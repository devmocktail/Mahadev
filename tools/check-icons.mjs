/**
 * Guard for the icon subset.
 *
 * Icons are self-hosted as a subset containing only the glyphs the templates
 * use, so adding a new `fa-*` class without regenerating would render nothing
 * at all — silently. This runs offline as a `prebuild` step and fails the build
 * with the exact command to fix it.
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const ICONS_CSS = path.join(SRC, 'styles', 'icons.scss');

async function walk(dir, out = []) {
  const skip = new Set(['node_modules', '.git', 'dist', '.angular']);
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (/\.(ts|html)$/.test(entry.name)) out.push(full);
  }
  return out;
}

async function main() {
  if (!existsSync(ICONS_CSS)) {
    console.error('icons: src/styles/icons.scss is missing. Run `npm run icons:build`.');
    process.exit(1);
  }

  const css = await readFile(ICONS_CSS, 'utf8');
  const defined = new Set(
    [...css.matchAll(/\.(fa-(?:solid|regular|brands))\.(fa-[a-z0-9-]+)::before/g)].map(
      (m) => `${m[1]} ${m[2]}`,
    ),
  );

  const used = new Map(); // "fa-solid fa-house" -> first file that uses it
  for (const file of await walk(SRC)) {
    if (path.resolve(file) === ICONS_CSS) continue;
    const text = await readFile(file, 'utf8');
    for (const m of text.matchAll(/fa-(solid|regular|brands)\s+fa-([a-z0-9-]+)/g)) {
      const key = `fa-${m[1]} fa-${m[2]}`;
      if (!used.has(key)) used.set(key, path.relative(ROOT, file).split(path.sep).join('/'));
    }
  }

  const missing = [...used].filter(([key]) => !defined.has(key));

  if (missing.length) {
    console.error(
      `\nicons: ${missing.length} icon(s) are used but not in the generated subset —\n` +
        `they would render as nothing. Run \`npm run icons:build\` to include them.\n`,
    );
    for (const [key, file] of missing) console.error(`  ${key}   (${file})`);
    console.error('');
    process.exit(1);
  }

  const unused = [...defined].filter((key) => !used.has(key));
  const note = unused.length ? ` (${unused.length} generated but no longer used)` : '';
  console.log(`icons: ${used.size} icon(s) used, all present in the subset${note}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
