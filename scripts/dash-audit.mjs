// Step 4 em-dash audit (Section 9.G): finds every em dash (U+2014) and en dash (U+2013) in the built site.
// Visible text, alt text, aria labels, title tags and meta descriptions are all checked.
// Title tags and meta descriptions are kept verbatim by the SEO constraint (decision D2): they are
// reported as accepted exceptions. Anything else fails.
// Usage: node scripts/dash-audit.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); });
walk('dist');

const DASH = /[–—]/;
const fails = [];
const exceptions = [];
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
  const metaTags = [...html.matchAll(/<meta\b[^>]*content="([^"]*)"[^>]*>/g)];
  if (DASH.test(title)) exceptions.push(`${f}: <title> ${title}`);
  for (const m of metaTags) if (DASH.test(m[1])) exceptions.push(`${f}: meta ${m[0].match(/(name|property)="([^"]+)"/)?.[2]}: ${m[1].slice(0, 90)}`);
  const body = html
    .replace(/<head[\s\S]*?<\/head>/, '')
    .replace(/<script[\s\S]*?<\/script>/g, (s) => (s.includes('application/ld+json') ? s : ''))
    .replace(/<style[\s\S]*?<\/style>/g, '');
  // Structured data repeats the title and description verbatim: same exception as the head tags.
  const ld = [...body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('');
  for (const m of ld.matchAll(/"(name|description)":"([^"]*[–—][^"]*)"/g)) exceptions.push(`${f}: JSON-LD ${m[1]} (repeats the title/description)`);
  const visible = body.replace(/<script[\s\S]*?<\/script>/g, '');
  const attrs = [...visible.matchAll(/\s(alt|aria-label|title|placeholder|value)="([^"]*)"/g)].filter((m) => DASH.test(m[2]));
  const text = visible.replace(/<[^>]+>/g, ' ');
  for (const m of text.matchAll(/.{0,40}[–—].{0,40}/g)) fails.push(`${f}: text "${m[0].trim()}"`);
  for (const m of attrs) fails.push(`${f}: ${m[1]}="${m[2]}"`);
}
console.log(`HTML files: ${files.length}. On-page dashes: ${fails.length}. Accepted exceptions (title/meta, D2): ${exceptions.length}.`);
fails.forEach((x) => console.log('  FAIL', x));
exceptions.forEach((x) => console.log('  EXCEPTION', x));
process.exit(fails.length ? 1 : 0);
