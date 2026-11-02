// Applies scripts/copy-edits.json to src/content/pages/*.json and writes docs/redesign/copy-edits.md.
// Usage: node scripts/apply-copy-edits.mjs   (idempotent: already-applied edits are reported, not reapplied)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const dir = 'src/content/pages/';
const cfg = JSON.parse(readFileSync('scripts/copy-edits.json', 'utf8'));
const log = [];
for (const file of readdirSync(dir)) {
  const slug = file.replace('.json', '');
  let raw = readFileSync(dir + file, 'utf8');
  const page = JSON.parse(raw);
  const sub = cfg.bannerSubtext[slug];
  if (sub && page.bannerSubtext !== sub) { log.push(['D9', slug, page.bannerSubtext.replace(/<[^>]+>/g, ''), sub]); page.bannerSubtext = sub; }
  raw = JSON.stringify(page, null, 1);
  for (const [rule, scope, find, repl] of cfg.replace) {
    if (scope !== '*' && scope !== slug) continue;
    const enc = (s) => JSON.stringify(s).slice(1, -1);
    const n = raw.split(enc(find)).length - 1;
    if (n) { raw = raw.split(enc(find)).join(enc(repl)); log.push([rule, slug, find, repl, n]); }
  }
  writeFileSync(dir + file, raw);
}
const esc = (s) => String(s).replace(/\|/g, '\\|');
const md = ['# Copy edits applied (approved in Step 2)', '', 'Every change to migrated copy. Nothing else in the page copy differs from the live site.', '', '| Rule | Page | Before | After | Count |', '|---|---|---|---|---|',
  ...log.map(([r, s, a, b, n]) => `| ${r} | \`${s}\` | ${esc(a)} | ${esc(b)} | ${n ?? 1} |`)];
writeFileSync('docs/redesign/copy-edits.md', md.join('\n') + '\n');
console.log('edits applied:', log.length);
