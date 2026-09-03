/**
 * Image optimisation pipeline.
 *
 * Scans `src/assets/images` for raster sources (.jpeg/.jpg/.png) and, for each:
 *   1. emits WebP variants at the widths in `WIDTHS` (never upscaling),
 *   2. records intrinsic dimensions in `src/app/core/data/image-manifest.ts`.
 *
 * Source files are never modified — they stay as the `<picture>` fallback for
 * the handful of clients without WebP. Generated output is committed, so the
 * Netlify build stays a plain `ng build` with no native dependency.
 *
 * Re-run after adding or replacing photos:
 *
 *   npm run images:optimize          # incremental (content-hash cached)
 *   npm run images:optimize -- --force
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGE_ROOT = path.join(ROOT, 'src', 'assets', 'images');
const MANIFEST = path.join(ROOT, 'src', 'app', 'core', 'data', 'image-manifest.ts');
const CACHE = path.join(ROOT, '.angular', 'image-optimize-cache.json');
const INDEX_HTML = path.join(ROOT, 'src', 'index.html');

/**
 * The above-the-fold LCP image, preloaded from index.html. `sizes` must match
 * the `sizes` on the corresponding <app-img> in hero.component.html.
 */
const LCP_IMAGE = {
  key: 'assets/images/hero/hero-event.jpeg',
  sizes: '(min-width: 1024px) 45vw, 90vw',
};

/** Widths we emit. Sources are only downscaled, never upscaled. */
const WIDTHS = [400, 600, 800, 1200];
/** Largest variant we bother emitting — beyond this is wasted bytes for a display image. */
const MAX_WIDTH = 1200;
const SOURCE_EXT = new Set(['.jpeg', '.jpg', '.png']);
const RASTER_RE = /\.(jpe?g|png)$/i;

const force = process.argv.includes('--force');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (SOURCE_EXT.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

/** Web path used in templates, e.g. `assets/images/hero/hero-event.jpeg`. */
const webPath = (file) => path.relative(path.join(ROOT, 'src'), file).split(path.sep).join('/');
const variantPath = (file, width) => file.replace(RASTER_RE, `-${width}.webp`);

async function loadCache() {
  if (force || !existsSync(CACHE)) return {};
  try {
    return JSON.parse(await readFile(CACHE, 'utf8'));
  } catch {
    return {};
  }
}

async function main() {
  const sources = await walk(IMAGE_ROOT);
  const cache = await loadCache();
  const nextCache = {};
  const manifest = {};

  let generated = 0;
  let cached = 0;
  let sourceBytes = 0;

  for (const file of sources) {
    const key = webPath(file);
    const buffer = await readFile(file);
    const hash = createHash('sha1').update(buffer).digest('hex');
    const meta = await sharp(buffer).metadata();
    sourceBytes += buffer.length;

    // Ladder of standard widths, plus the source's own width when that adds
    // real resolution — otherwise a 735px source would only ever serve 400px
    // and look soft on high-DPI screens.
    const native = Math.min(meta.width, MAX_WIDTH);
    const widths = WIDTHS.filter((w) => w <= native);
    if (widths.length === 0 || native > widths[widths.length - 1] * 1.15) widths.push(native);

    manifest[key] = { width: meta.width, height: meta.height, widths };
    nextCache[key] = hash;

    const upToDate =
      cache[key] === hash && widths.every((w) => existsSync(variantPath(file, w)));
    if (upToDate) {
      cached++;
      continue;
    }

    for (const width of widths) {
      await sharp(buffer)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 72, effort: 5 })
        .toFile(variantPath(file, width));
    }
    generated++;
  }

  const entries = Object.keys(manifest)
    .sort()
    .map((key) => {
      const { width, height, widths } = manifest[key];
      return `  '${key}': { width: ${width}, height: ${height}, widths: [${widths.join(', ')}] },`;
    })
    .join('\n');

  await writeFile(
    MANIFEST,
    `/**
 * GENERATED FILE — do not edit by hand.
 * Run \`npm run images:optimize\` to regenerate.
 *
 * Intrinsic dimensions and available WebP widths for every raster asset.
 * \`app-img\` reads this to emit correct width/height (so images reserve their
 * space and never shift layout) and a srcset listing only variants that exist.
 */
export interface ImageMeta {
  readonly width: number;
  readonly height: number;
  readonly widths: readonly number[];
}

/** Keyed by the original asset path. Unknown paths (SVGs, remote URLs) miss. */
export const IMAGE_MANIFEST: Readonly<Record<string, ImageMeta | undefined>> = {
${entries}
};
`,
    'utf8',
  );

  await writeFile(CACHE, JSON.stringify(nextCache, null, 2), 'utf8');
  await writeLcpPreload(manifest);

  let webpBytes = 0;
  for (const [key, entry] of Object.entries(manifest)) {
    for (const w of entry.widths) {
      const p = variantPath(path.join(ROOT, 'src', key), w);
      if (existsSync(p)) webpBytes += (await stat(p)).size;
    }
  }

  const mb = (n) => (n / 1024 / 1024).toFixed(2);
  console.log(
    `images: ${generated} generated, ${cached} cached · sources ${mb(sourceBytes)}MB · webp variants ${mb(webpBytes)}MB`,
  );
}

/**
 * Rewrite the `<link rel="preload">` for the LCP image in index.html so its
 * srcset can never drift out of sync with the variants on disk.
 */
async function writeLcpPreload(manifest) {
  const entry = manifest[LCP_IMAGE.key];
  if (!entry) {
    console.warn(`images: LCP image ${LCP_IMAGE.key} not found — preload left untouched`);
    return;
  }

  const base = '/' + LCP_IMAGE.key.replace(RASTER_RE, '');
  const srcset = entry.widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
  const block = [
    '<!-- lcp-preload:start -->',
    '    <link',
    '      rel="preload"',
    '      as="image"',
    '      type="image/webp"',
    `      imagesrcset="${srcset}"`,
    `      imagesizes="${LCP_IMAGE.sizes}"`,
    '      fetchpriority="high"',
    '    />',
    '    <!-- lcp-preload:end -->',
  ].join('\n');

  const html = await readFile(INDEX_HTML, 'utf8');
  const markers = /<!-- lcp-preload:start -->[\s\S]*?<!-- lcp-preload:end -->/;
  if (!markers.test(html)) {
    console.warn('images: lcp-preload markers missing from index.html — skipped');
    return;
  }
  await writeFile(INDEX_HTML, html.replace(markers, block), 'utf8');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
