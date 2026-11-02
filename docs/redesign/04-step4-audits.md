# Step 4. Audits

Run on the final build (2 November 2026) through Cloudflare's local runtime (`wrangler dev`), at 390, 768, 1024, 1280 and 1440 px.
Re-run any time with `npm run build && npm run audit` (CI runs the same).

**Result: no Fail.** Every Pre-Flight box is ticked or not applicable by an approved decision; the preservation list holds no unapproved change.

---

## 1. Em-dash audit (Section 9.G)

`scripts/dash-audit.mjs` scans every built HTML file: visible text, alt text, aria labels, button values, title tags, meta tags and structured data.

| Where | Em/en dashes before (live site) | After |
|---|---|---|
| Visible page text, all 22 pages | 47 em, 33 en | **0** |
| Alt text, aria labels, buttons | 0 | **0** |
| Title tags and meta descriptions | 1 title, 5 descriptions | 1 title, 5 descriptions, kept verbatim: **accepted exception D2** (not on the page; repeated in `og:`/`twitter:` tags and JSON-LD) |

How the visible ones went: 13 in keyword H2s became colons (D1); 3 in the privacy policy and 22 in body copy became commas, colons or brackets, punctuation only (D3, D4); the rest were in the old banner subtexts, rewritten to 20 words or fewer from existing phrases (D9). Every edit is listed in `copy-edits.md`. Review quotes use a real ellipsis (…) where an excerpt is cut, never a dash.

## 2. Pre-Flight Check (Section 14)

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Brief inference declared (0.B) | Pass | Design read in `01-audit.md` and `02-mode-and-levers.md` |
| 2 | Dial values explicit and reasoned | Pass | `DESIGN_VARIANCE 4`, `MOTION_INTENSITY 4`, `VISUAL_DENSITY 5`, reasons in `02-mode-and-levers.md` §3 |
| 3 | Design system chosen or aesthetic labelled honestly | Pass | No 2.A system; brand-led aesthetic built with native CSS through Tailwind v4 tokens (2.B) |
| 4 | Redesign mode detected, audit performed | Pass | Redesign: Preserve; audit in `01-audit.md` |
| 5 | Zero em-dashes on the page | Pass | §1 above: 0 on-page; title/meta exception approved (D2) |
| 6 | Page Theme Lock | Pass | Light theme on every page (D11). Sections step between ground and surface tones; one deliberate brand-blue colour block, the closing contact section. Cookie banner and lightbox are overlays, not sections |
| 7 | Colour Consistency Lock | Pass | Coral `#F07957` is the only accent, used identically for every action (buttons, sticky bar, Submit, Accept All) plus the rating stars and the brand's offset frame |
| 8 | Shape Consistency Lock | Pass | One radius: 0. Measured: no element with a non-zero radius |
| 9 | Button contrast (AA 4.5:1) | Pass | Coral with ink text 6.4:1; quiet buttons 15.2:1; quiet buttons on the blue block 6.4:1; cookie buttons 11.9:1 |
| 10 | CTA labels never wrap at desktop | Pass | Measured at 1024, 1280, 1440: none wrap |
| 11 | Form contrast | Pass | Labels 16.5:1; typed text 15.2:1; each field edge (2px line) 7.3:1 against the field; help text 7:1; focus ring brand blue |
| 12 | Serif discipline | Pass | Cinzel is the brand's existing display face and echoes the logo lettering (the brand names the serif). Not Fraunces or Instrument Serif |
| 13 | Premium-consumer palette check | Pass | Cool off-white, brand blue and coral: not the beige, brass and espresso family |
| 14 | Italic descender clearance | Pass | No italic display type |
| 15 | Hero fits the viewport | Pass | H1 two lines at 1024, 1280 and 1440 on every page; subtext 20 words or fewer (D9); Contact Us visible without scrolling at every width tested |
| 16 | Hero top padding ≤ `pt-24` | Pass | 40px at desktop |
| 17 | Hero stack ≤ 4 text elements | Pass | Home: business name line, H1, subtext, buttons. Inner pages: breadcrumb, H1, subtext, buttons |
| 18 | Eyebrow count ≤ ceil(sections / 3) | Pass | 0 eyebrows. Group labels ("Extensions") and breadcrumbs are sentence case, not tracked capitals |
| 19 | Split-Header Ban | Pass | Section headings stack above their copy. Where a heading and something sit side by side, the right side is real content (a link, the rating, the photo pair), not a floating explainer |
| 20 | Zigzag Alternation Cap | Pass | No alternating image/text sections anywhere. Service and town copy is one editorial article with photos in a side rail, read as one layout family |
| 21 | No Duplicate CTA Intent | Pass | One label per action: Contact Us (form/page), Call Us, WhatsApp, Send an Email (all live-site labels, D13) |
| 22 | Logo wall = logos only | N/A | No logo wall |
| 23 | Bento background diversity | Pass | Every tile in the services grid is a different real photograph |
| 24 | "Trusted by" logo wall | N/A | None |
| 25 | Copy self-audit | Pass | All page copy is the live site's own (plus the logged approved edits). New strings re-read: subtexts, "Before and after", "Project photos", "All projects", "See the full gallery", "Read the reviews", stage labels, form labels and states, cookie preferences, footer service-area sentence, 404 page |
| 26 | Motion motivated | Pass | Reasons per move in `02-mode-and-levers.md` §4.4 (storytelling, hierarchy, feedback) |
| 27 | Marquee max one | Pass | None |
| 28 | Navigation on one line, ≤ 80px | Pass | One line at 1024 and above; header 72px desktop, 64px mobile (was 114 / 161) |
| 29 | Section-layout repetition | Pass | Home uses 9 families across 9 sections: overlap hero with before/after, asymmetric reviews, editorial stack, 7/5 bento with tile grid, stacked text with stage strip, 2×2 cards, tabbed comparison, offset photo pair split, colour-block close |
| 30 | Bento rhythm and exact cell count | Pass | 4 featured services in 4 cells (7/5 then 5/7); 5 extension tiles in 5; 3 tiles as 2+1+1; 4 build stages in 4 |
| 31 | Long lists use the right component | Pass | No `divide-y` lists; protected lists stay as prose lists with square markers; the footer lists are navigation |
| 32 | Real images | Pass | 150 real project photos (Gary's own). No placeholders, fake screenshots or decorative SVG. The six Copilot renders and one stock photo were removed (D16) |
| 33 | No pills or labels on images | Pass | Before/After captions and stage names sit below the photos |
| 34 | No decorative photo credits | Pass | None. Lightbox captions describe the photo |
| 35 | No version footers | Pass | None |
| 36 | No micro-meta sentences | Pass | None |
| 37 | No decorative strip at hero bottom | Pass | None |
| 38 | No floating top-right sub-text | Pass | None |
| 39 | No filled-track score bars | Pass | None |
| 40 | No locale strips | Pass | Only the footer service-area sentence, a real statement for a local trade (D17) |
| 41 | No scroll cues | Pass | None |
| 42 | No version labels in hero | Pass | None |
| 43 | No section-numbering eyebrows | Pass | The 01 to 12 headings are gone (D8) |
| 44 | No decorative dots | Pass | None |
| 45 | No `border-t` + `border-b` on every row | Pass | Only the three short cookie tables in the privacy policy have row lines (real tables keep their conventions) |
| 46 | Content density sane | Pass, justified | The long service and town copy is protected for SEO (the section's job); it is set as one readable article column at 65 characters. No data tables, no invented figures |
| 47 | Quotes ≤ 3 lines, clean attribution | Pass | Measured: every quote 3 lines or fewer at 390 and 1440. Attribution: name, project, "Google review" |
| 48 | Motion claimed = motion shown | Pass | Reveals, slider, swipe rows, sticky bar and button feedback all run (tested) |
| 49 | GSAP sticky-stack / pan skeletons | N/A | Not used (no pinning by brief) |
| 50 | No `window.addEventListener('scroll')` | Pass | None; IntersectionObserver only |
| 51 | Reduced motion wrapped | Pass | Reveals only arm under `no-preference`; a global reduced-motion rule collapses every transition; the slider is user-driven and still works |
| 52 | Dark mode tokens tested in both modes | N/A, approved | D11: light theme locked (raster logo made for light grounds). Colours are semantic tokens, so a dark set can be added if a vector logo is made |
| 53 | Mobile collapse explicit | Pass | Every multi-column section is one column below 1024px (swipe rows on phones); no sideways scroll at 390 or 768 (measured) |
| 54 | Viewport stability | Pass | No `h-screen`; full-height surfaces use `dvh` |
| 55 | Animation cleanup in effects | N/A | No React; one deferred module, observers unobserve after firing |
| 56 | Empty, loading and error states | Pass | Form: inline validation, "Sending…", error with phone fallback, success panel; no-JS fallback page from the Worker. Every gallery filter has photos |
| 57 | Cards omitted where spacing works | Pass | No boxed cards; content groups by space and tone |
| 58 | Icons from an allowed library | Pass | Phosphor only, inlined at build; no hand-drawn icon paths |
| 59 | Motion isolated in client leaves | N/A | No React; all behaviour is in `src/scripts/site.ts`, loaded deferred |
| 60 | No AI tells | Pass | No Inter, no purple, no three equal feature cards, no invented names or numbers |
| 61 | Core Web Vitals plausibly hit | Pass | Home on a phone: 13 requests, 223 KB, 1 script, 0 third parties before consent, CLS 0 (was 97 requests, 3.2 MB, 35 scripts, 13 hosts, LCP 4.9 s). Field data comes after launch |
| 62 | One design system | Pass | One token set in `src/styles/global.css` |

## 3. Preservation audit

Generated by `scripts/preservation-audit.mjs` against `baseline.json`; full table in `04-preservation-audit.md`.

**Unapproved changes: none.**

| Checked | Result |
|---|---|
| URLs (22, trailing slashes) | All unchanged. Non-slash versions 301 to them, as on WordPress |
| Title tags, meta descriptions, canonicals | All 22 identical |
| H1 wording | All 22 identical |
| Keyword H2 wording | Identical except the 13 dash → colon edits (D1) and service-name casing on the home page (D6/D8) |
| Contextual body links (anchor text and target) | All present, all identical |
| Phone, email, business name | Identical everywhere |
| Primary nav labels | Identical except D6 casing: Carpentry Services, Media Walls, Kitchen Fitting |
| Header links | "Call Us", "Send an Email" unchanged |
| Form field names and order | Identical on all 21 pages that have the form; removed from the privacy policy page only (D14) |
| Footer links | Services and Quick Links identical (text, order and targets); the 56 "Find us" keyword links replaced (D17) |

Approved changes in the table, by rule: 21 banner headings → breadcrumbs (D7), 21 heading level changes (D8), 13 heading dashes (D1), 12 number headings removed (D8), 3 heading casing (D6/D8), 3 nav casing (D6), Services link → button (D19), privacy-page form (D14), footer "Find us" (D17).

## 4. Brand fidelity audit

| Brand element | Live site | Redesign | Verdict |
|---|---|---|---|
| Accent (Elementor "accent" and "primary") | Blue `#0C74BB` | `#0C74BB` exactly: the closing colour block, focus rings, logo. Text links use a one-step deeper shade of the same blue (`#0B67A6`) because `#0C74BB` measures 4.3:1 on the light surface tone | Survived |
| Secondary | Coral `#F07957` | `#F07957` exactly: every action button, the sticky bar, rating stars, the offset photo frame | Survived |
| Type stack | Cinzel (display) + Open Sans (text) | Cinzel + Open Sans, now self-hosted variable fonts, no third-party font CDN | Survived |
| Logo | Saw-blade PNG, distorted in the header by a brightness/contrast filter; low contrast on the black footer | The same file, untouched, shown unfiltered on light grounds in header and footer (D20) | Survived, treatment corrected |
| Corners | Square (0 radius) | Square everywhere | Survived |
| Signature device | Coral offset frame behind photos | Kept on page heroes and the local-carpenter photo pair | Survived |

## 5. Found during the build: not changed, needs your decision

1. **Malformed phone links on the four town pages.** The live copy links the number as `tel:+4407415 216223` (extra 0, space). Kept exactly as found under the preservation rule. Recommend correcting to `tel:+447415216223`.
2. **Privacy policy cookie tables are now out of date.** They list WordPress cookies (`wpconsent_preferences`, `comment_author`, `wordpress_logged_in`…) that the new site never sets, and do not mention Google Analytics or Microsoft Clarity. Kept verbatim (legal copy, 11.F). Recommend a legal update before launch.
3. **Footer map kept.** The old "Find us" block also held a Google Map of 32 Acorn Way, Red Lodge, which my D17 description missed. The map stays (lazy-loaded) beside the new service-area links.
4. **One more non-original photo retired.** The timber-framed page used a stock photo (Envato filename pattern) as well as the Copilot renders. Replaced with Gary's own roof-frame photo under the same reasoning as D16.
5. **Share images and old image URLs.** Every page now has a 1200×630 share image of real work (8 had none). The old `/wp-content/uploads/` image URLs will stop working at cutover: part of the SEO plan.
6. **Reviews.** Seven real Google review excerpts, cut to three lines (… marks a cut). Still subject to D15: confirm before launch.

## 6. Before and after

| Measure | Live site | Redesign |
|---|---|---|
| Home, phone, page length | 19,561 px (about 23 screens) | 12,642 px (about 15), all copy kept |
| H1 on the first screen | No (793 px phone, 1,009 px desktop) | Yes, 2 lines on desktop |
| Real proof on the first phone screen | None | Before/after of a real rear extension |
| Header height | 161 px phone, 114 px desktop | 64 px, 72 px |
| Home requests / weight (phone) | 97 / 3.2 MB | 13 / 223 KB |
| Scripts / third-party hosts before consent | 35 / 13 | 1 / 0 |
| Analytics before consent | Yes | No (GA4 and Clarity after Accept) |
| Photos with descriptive alt text | 8 of 154 | 150 of 150 |
| AI or stock images presented as work | 7 | 0 |
