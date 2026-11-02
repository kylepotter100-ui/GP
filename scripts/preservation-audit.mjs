// Step 4 preservation audit: diffs the built site (dist/) against the live-site baseline.
// Usage: npm run build && node scripts/preservation-audit.mjs
// Writes docs/redesign/04-preservation-audit.md and exits 1 if any unapproved change is found.
import { readFileSync, existsSync, writeFileSync } from 'node:fs';

const base = JSON.parse(readFileSync('docs/redesign/baseline.json', 'utf8'));
const ORIGIN = 'https://www.garyjpottercarpentry.co.uk';

const decode = (s) =>
  s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#38;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim();
const norm = (s) => decode(s).replace(/[–—]/g, ':').replace(/\s*:\s*/g, ': ').replace(/\s+/g, ' ').trim();
const loose = (s) => norm(s).toLowerCase().replace(/[^a-z0-9& ]/g, '').replace(/\s+/g, ' ').trim();
const rel = (h) => (h.startsWith(ORIGIN) ? h.slice(ORIGIN.length) || '/' : h);
const section = (html, open, close) => {
  const i = html.indexOf(open); if (i < 0) return '';
  const j = html.indexOf(close, i); return html.slice(i, j < 0 ? undefined : j);
};
const all = (re, s) => [...s.matchAll(re)];

const changes = []; // { page, kind, item, from, to, rule }
const add = (page, kind, item, from, to, rule) => changes.push({ page, kind, item, from, to, rule });

// ---------- URLs ----------
for (const p of base.pages) {
  const file = `dist${p.path}index.html`;
  if (!existsSync(file)) add(p.path, 'URL', p.path, 'exists', 'missing', null);
}

for (const p of base.pages) {
  const file = `dist${p.path}index.html`;
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8').replace(/<svg[\s\S]*?<\/svg>/g, '');
  const head = section(html, '<head', '</head>');
  const main = section(html, '<main', '</main>');

  // ---------- Title, description, canonical ----------
  const title = decode(head.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
  const desc = decode(head.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  const canon = head.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
  if (title !== decode(p.title)) add(p.path, 'Title tag', 'title', p.title, title, null);
  if (desc !== decode(p.description ?? '')) add(p.path, 'Meta description', 'description', p.description, desc, null);
  if (canon !== p.canonical) add(p.path, 'Canonical', 'canonical', p.canonical, canon, null);

  // ---------- Headings ----------
  const built = all(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g, main).map((m) => ({ level: +m[1], text: norm(m[2]) }));
  const builtLoose = new Map(built.map((h) => [loose(h.text), h]));
  const crumb = norm(main.match(/aria-current="page"[^>]*>([^<]*)</)?.[1] ?? '');
  const brandLine = p.path === '/' ? norm(main.match(/<p class="font-semibold text-ink-muted">([^<]*)<\/p>/)?.[1] ?? '') : '';
  const baseHeads = p.headings.map((h) => ({ level: +h[1], text: norm(h.slice(4)) }));
  const h1i = baseHeads.findIndex((h) => h.level === 1);
  baseHeads.forEach((h, i) => {
    if (h.level === 1) {
      const b = built.find((x) => x.level === 1);
      if (!b || b.text !== h.text) add(p.path, 'H1', h.text, h.text, b?.text ?? 'missing', null);
      return;
    }
    if (/^\d{2}$/.test(h.text)) { add(p.path, 'Heading removed', h.text, `H${h.level} "${h.text}"`, 'removed', 'D8'); return; }
    if (i < h1i && h.level === 2) {
      const kept = loose(crumb) === loose(h.text) || loose(brandLine) === loose(h.text);
      add(p.path, 'Banner heading', h.text, `H2 "${h.text}"`, kept ? `breadcrumb / brand line "${crumb || brandLine}"` : 'missing', kept ? 'D7' : null);
      return;
    }
    const match = builtLoose.get(loose(h.text));
    if (!match) {
      // A duplicated service name on the home page appears once (D8).
      const dup = baseHeads.some((o, j) => j !== i && loose(o.text) === loose(h.text)) && built.some((x) => loose(x.text) === loose(h.text));
      add(p.path, 'Heading', h.text, `H${h.level} "${h.text}"`, dup ? 'merged with its duplicate' : 'missing', dup ? 'D8' : null);
      return;
    }
    const sameDecoded = norm(h.text) === match.text;
    const dashOnly = h.text !== match.text && /[–—]/.test(p.headings[i]) ;
    if (!sameDecoded || dashOnly) {
      const rule = /[–—]/.test(p.headings[i]) ? 'D1' : h.text.toLowerCase() === match.text.toLowerCase() ? 'D6/D8 casing' : null;
      add(p.path, 'Heading wording', h.text, p.headings[i].slice(4), match.text, rule);
    } else if (decode(p.headings[i].slice(4)) !== match.text) {
      add(p.path, 'Heading wording', h.text, p.headings[i].slice(4), match.text, /[–—]/.test(p.headings[i]) ? 'D1' : null);
    }
    if (match.level !== h.level) add(p.path, 'Heading level', h.text, `H${h.level}`, `H${match.level}`, 'D8');
  });

  // ---------- Contextual body links ----------
  const links = all(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, main).map((m) => ({ href: rel(m[1].replace(/&amp;/g, '&')), anchor: decode(m[2]) }));
  const has = (l) => links.some((x) => x.href === l.href && x.anchor.toLowerCase() === decode(l.anchor).toLowerCase());
  for (const l of p.bodyLinks) {
    if (has(l)) continue;
    let rule = null; let note = 'missing';
    if (/^(07415 216223|07415216223)$/.test(l.anchor) && l.href.startsWith('tel:')) {
      // Phone links in the old banner subtext moved to the Call Us buttons (D9).
      const stillLinked = links.some((x) => x.href.startsWith('tel:'));
      rule = stillLinked ? 'D9' : null; note = 'moved to the Call Us button';
    }
    if (p.path === '/' && /^(Carpentry services|Kitchen fitting|Media walls|Kitchen Spraying)$/i.test(l.anchor.trim())) {
      const b = links.find((x) => x.href === l.href && x.anchor.toLowerCase().trim() === l.anchor.toLowerCase().trim());
      rule = b ? 'D6/D8 casing' : null; note = b ? `"${b.anchor}"` : 'missing';
    }
    add(p.path, 'Body link', `${l.anchor} → ${l.href}`, l.anchor, note, rule);
  }

  // ---------- Form fields (every page that had the form) ----------
  const form = section(html, 'data-contact-form', '</form>');
  const fields = all(/name="([^"]+)"/g, form).map((m) => m[1]).filter((n) => !['page'].includes(n));
  const expected = base.form.fields.map((f) => f.name);
  if (p.path === '/privacy-policy/') { if (!form) add(p.path, 'Form', 'enquiry form', 'present', 'removed from the privacy policy page', 'D14'); }
  else if (fields.join() !== expected.join()) add(p.path, 'Form fields', 'names and order', expected.join(', '), fields.join(', ') || 'missing', null);
}

// ---------- Navigation (labels and targets) ----------
const home = readFileSync('dist/index.html', 'utf8').replace(/<svg[\s\S]*?<\/svg>/g, '');
const header = section(home, '<header', '</header>');
const navHtml = section(header, '<nav aria-label="Main"', '</nav>');
const navLinks = all(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, navHtml).map((m) => ({ href: rel(m[1]), label: decode(m[2]) }));
const navButton = decode(navHtml.match(/<button[^>]*>([\s\S]*?)<\/button>/)?.[1] ?? '');
for (const item of base.nav) {
  if (item.href === '#') {
    add('all pages', 'Nav item', item.label, `link to "#"`, navButton === item.label ? 'dropdown button, same label' : `"${navButton}"`, navButton === item.label ? 'D19' : null);
    continue;
  }
  const href = rel(item.href);
  const b = navLinks.find((x) => x.href === href);
  if (!b) add('all pages', 'Nav item', item.label, item.label, 'missing', null);
  else if (b.label !== item.label) add('all pages', 'Nav label', item.label, item.label, b.label, b.label.toLowerCase() === item.label.toLowerCase() ? 'D6' : null);
}
for (const u of base.headerUtility) {
  if (!header.includes(`href="${u.href}"`) || !decode(header).includes(u.label)) add('all pages', 'Header link', u.label, u.label, 'missing', null);
}

// ---------- Footer ----------
// The site footer (review attributions also use <footer> inside <blockquote>).
const footer = home.slice(home.lastIndexOf('<footer'), home.lastIndexOf('</footer>'));
const fLinks = all(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, footer).map((m) => ({ href: rel(m[1]), anchor: decode(m[2]) }));
const townWords = /(Bury St Edmunds|Cambridge|Ely|Newmarket)$/;
let removedFindUs = 0;
for (const l of base.footerLinks) {
  const anchor = decode(l.anchor);
  if (!anchor) continue; // logo link
  const href = rel(l.href);
  if (fLinks.some((x) => x.href === href && x.anchor.toLowerCase() === anchor.toLowerCase())) continue;
  if (townWords.test(anchor) && anchor.split(' ').length > 1 && !href.startsWith('/area/')) { removedFindUs++; continue; }
  add('footer', 'Footer link', `${anchor} → ${href}`, anchor, 'missing', null);
}
add('footer', 'Footer "Find us"', `${removedFindUs} keyword links`, `${removedFindUs} "<Service> <Town>" links to the 12 service URLs`, 'one service-area sentence, 4 town-page links, All areas we cover, map kept', 'D17');

// ---------- Report ----------
const approved = changes.filter((c) => c.rule);
const unapproved = changes.filter((c) => !c.rule);
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|');
const table = (rows) => ['| Page | What | Before | After | Approved by |', '|---|---|---|---|---|', ...rows.map((c) => `| \`${c.page}\` | ${c.kind} | ${esc(c.from)} | ${esc(c.to)} | ${c.rule ?? '**not approved**'} |`)].join('\n');
const md = [
  '# Step 4. Preservation audit',
  '',
  'Generated by `scripts/preservation-audit.mjs` from the built site (`dist/`) against `docs/redesign/baseline.json` (the live site on 2 November 2026).',
  'It checks every URL, title tag, meta description, canonical, H1, heading, contextual body link, nav label, header link, form field and footer link.',
  '',
  `**Unapproved changes: ${unapproved.length}.**`,
  '',
  unapproved.length ? table(unapproved) : 'None.',
  '',
  `## Approved changes (${approved.length})`,
  '',
  table(approved),
  '',
].join('\n');
writeFileSync('docs/redesign/04-preservation-audit.md', md);
console.log(`URLs checked: ${base.pages.length}. Approved changes: ${approved.length}. Unapproved: ${unapproved.length}.`);
for (const c of unapproved) console.log(`  UNAPPROVED ${c.page} ${c.kind}: ${c.from} -> ${c.to}`);
process.exit(unapproved.length ? 1 : 0);
