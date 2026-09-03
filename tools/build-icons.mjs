/**
 * Icon font pipeline.
 *
 * The site uses ~45 Font Awesome glyphs but was pulling the whole library from
 * cdnjs: a ~100KB stylesheet plus a 156KB + 118KB pair of webfonts, over two
 * extra cross-origin connections, with the fonts only discoverable *after* the
 * stylesheet had parsed. On a slow link that left every icon as a tofu box for
 * several seconds.
 *
 * This script scans the source for the `fa-*` classes actually used, then:
 *   1. downloads Font Awesome's stylesheet + webfonts for the pinned version,
 *   2. resolves each class name to its codepoint (including alias groups),
 *   3. subsets each font to only the glyphs in use,
 *   4. writes the subset fonts to src/assets/fonts/ and a minimal stylesheet
 *      to src/styles/icons.scss (imported by styles.scss).
 *
 * Output is committed, so the Netlify build needs no network access. Re-run
 * after adding a new icon to a template:
 *
 *   npm run icons:build
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
/** Font files live under assets/ so the existing asset glob copies them once. */
const FONT_DIR = path.join(SRC, 'assets', 'fonts');
/** The stylesheet is @imported into styles.scss, so it must live outside assets/. */
const CSS_OUT = path.join(SRC, 'styles', 'icons.scss');
/** Absolute so the bundler leaves the URL alone and there is a single copy. */
const FONT_URL_BASE = '/assets/fonts';

const FA_VERSION = '6.5.2';
const CDN = `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${FA_VERSION}`;

/** The font file behind each Font Awesome style we support. */
const FAMILIES = [
  {
    style: 'solid',
    prefix: 'fa-solid',
    file: 'fa-solid-900.woff2',
    weight: 900,
    family: 'FA Solid',
  },
  {
    style: 'brands',
    prefix: 'fa-brands',
    file: 'fa-brands-400.woff2',
    weight: 400,
    family: 'FA Brands',
  },
  {
    style: 'regular',
    prefix: 'fa-regular',
    file: 'fa-regular-400.woff2',
    weight: 400,
    family: 'FA Regular',
  },
];

async function walkSource() {
  const out = [];
  const skip = new Set(['node_modules', '.git', 'dist', '.angular']);
  async function rec(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (skip.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await rec(full);
      else if (/\.(ts|html)$/.test(entry.name)) out.push(full);
    }
  }
  await rec(SRC);
  return out;
}

/** Collect every `fa-<style> fa-<name>` pair referenced in the source. */
async function findUsedIcons() {
  const used = new Map(); // style -> Set(iconName)
  for (const file of await walkSource()) {
    const text = await readFile(file, 'utf8');
    for (const m of text.matchAll(/fa-(solid|regular|brands)\s+fa-([a-z0-9-]+)/g)) {
      if (!used.has(m[1])) used.set(m[1], new Set());
      used.get(m[1]).add(m[2]);
    }
  }
  return used;
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.text();
}

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Build `iconName -> codepoint` from Font Awesome's stylesheet. Rules look
 * like `.fa-house:before,.fa-home:before{content:"\f015"}`, so one rule can
 * define several aliases for the same glyph.
 */
function parseCodepoints(css) {
  const map = new Map();
  const rule = /((?:\.fa-[a-z0-9-]+(?:::?before)?\s*,?\s*)+)\{[^}]*?content\s*:\s*"\\([0-9a-fA-F]+)"/g;
  for (const m of css.matchAll(rule)) {
    const codepoint = parseInt(m[2], 16);
    for (const sel of m[1].matchAll(/\.fa-([a-z0-9-]+)/g)) {
      map.set(sel[1], codepoint);
    }
  }
  return map;
}

async function main() {
  const used = await findUsedIcons();
  const totalUsed = [...used.values()].reduce((n, s) => n + s.size, 0);
  console.log(`icons: ${totalUsed} distinct icons used across ${used.size} style(s)`);

  console.log(`icons: fetching Font Awesome ${FA_VERSION}...`);
  const css = await fetchText(`${CDN}/css/all.min.css`);
  const codepoints = parseCodepoints(css);
  console.log(`icons: parsed ${codepoints.size} icon names from upstream CSS`);

  await mkdir(FONT_DIR, { recursive: true });
  await mkdir(path.dirname(CSS_OUT), { recursive: true });

  const missing = [];
  const blocks = [];
  const written = [];

  for (const fam of FAMILIES) {
    const names = used.get(fam.style);
    if (!names || names.size === 0) {
      console.log(`icons: ${fam.style} - unused, skipped`);
      continue;
    }

    const glyphs = [];
    const rules = [];
    for (const name of [...names].sort()) {
      const cp = codepoints.get(name);
      if (cp === undefined) {
        missing.push(`${fam.style}/${name}`);
        continue;
      }
      glyphs.push(String.fromCodePoint(cp));
      rules.push(`.${fam.prefix}.fa-${name}::before { content: '\\${cp.toString(16)}'; }`);
    }

    const source = await fetchBuffer(`${CDN}/webfonts/${fam.file}`);
    const subset = await subsetFont(source, glyphs.join(''), { targetFormat: 'woff2' });
    const outName = fam.file.replace('.woff2', '-subset.woff2');
    await writeFile(path.join(FONT_DIR, outName), subset);
    written.push(outName);
    console.log(
      `icons: ${fam.style} - ${glyphs.length} glyphs, ` +
        `${(source.length / 1024).toFixed(0)}KB -> ${(subset.length / 1024).toFixed(1)}KB`,
    );

    blocks.push(
      [
        `/* ---------- ${fam.style} (${glyphs.length} glyphs) ---------- */`,
        `@font-face {`,
        `  font-family: '${fam.family}';`,
        `  font-style: normal;`,
        `  font-weight: ${fam.weight};`,
        `  /* block, not swap: briefly show nothing rather than a tofu box. The`,
        `     file is a few KB and same-origin, so the window is imperceptible. */`,
        `  font-display: block;`,
        `  src: url('${FONT_URL_BASE}/${outName}') format('woff2');`,
        `}`,
        ``,
        `.${fam.prefix} {`,
        `  font-family: '${fam.family}';`,
        `  font-weight: ${fam.weight};`,
        `}`,
        ``,
        rules.join('\n'),
      ].join('\n'),
    );
  }

  if (missing.length) {
    console.warn(`icons: WARNING - no codepoint found for: ${missing.join(', ')}`);
  }

  const header = [
    '/**',
    ' * GENERATED FILE - do not edit by hand.',
    ' * Run `npm run icons:build` to regenerate (needed after adding a new fa-* class).',
    ' *',
    ` * A self-hosted subset of Font Awesome ${FA_VERSION} containing only the icons this`,
    ' * site actually uses, replacing a ~100KB third-party stylesheet and two full',
    ' * webfonts served from cdnjs.',
    ' */',
    '',
    '.fa-solid,',
    '.fa-regular,',
    '.fa-brands {',
    '  -moz-osx-font-smoothing: grayscale;',
    '  -webkit-font-smoothing: antialiased;',
    '  display: inline-block;',
    '  font-style: normal;',
    '  font-variant: normal;',
    '  line-height: 1;',
    '  text-rendering: auto;',
    '}',
    '',
    '/* Utility used in the templates. */',
    '.fa-fw {',
    '  text-align: center;',
    '  width: 1.25em;',
    '}',
    '',
  ].join('\n');

  await writeFile(CSS_OUT, `${header}\n${blocks.join('\n\n')}\n`, 'utf8');
  console.log(`icons: wrote ${path.relative(ROOT, CSS_OUT).split(path.sep).join('/')}`);
  console.log(`icons: preload -> ${written.join(', ')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
