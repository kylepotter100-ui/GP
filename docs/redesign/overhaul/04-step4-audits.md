# Overhaul, Step 4. Audits

Governing rules: `design-taste-frontend-v2-experimental` (Sections 9.G, 11 and 14).
Built site: `dist/` from this commit, checked through `wrangler dev` (the production Worker locally) at 360, 390, 768, 1024, 1280, 1440 and 1920 px, in light and dark.
Screenshots of the result are in `after/`, next to `before/`.

| Audit | Result |
|---|---|
| Em-dash audit | **Pass.** 0 on any page. The only dashes left are in 1 title tag and 5 meta descriptions, kept verbatim by D2 and C4. |
| Pre-Flight Check (Section 14) | **Pass.** Every box ticked or not applicable. The Step 3 review found and fixed 13 issues first (section 6). |
| Preservation audit | **Pass.** 0 unapproved changes. URLs, form fields and body link anchors are unchanged; nav and heading changes are the ones you approved (D1, D6, D7, D8, D14, D17, D19). |
| Brand fidelity audit | **Pass.** Coral `#F07957`, Cinzel with Open Sans, and the untouched logo PNG all survive. |

---

## 1. Em-dash audit (Section 9.G)

Run by `scripts/dash-audit.mjs` (part of `npm run audit`, and of CI) over all 23 built pages. It searches the rendered text (headings, body, buttons, captions, quotes, attribution and alt text) for `—` and `–`.

- **On the page: 0.**
- **Accepted exceptions (D2, and C4 "titles and meta descriptions unchanged"):** 18 occurrences in head tags on 6 pages. Each one is a title or a description repeated in its `og:` and `twitter:` copies.

| Page | Tag | Text |
|---|---|---|
| `/kitchen-spraying/` | `<title>` | Kitchen Spraying **–** Expert Kitchen Unit & Cabinet Spraying \| Gary J Potter Carpentry & Construction |
| `/area/ely/`, `/garage-conversions/`, `/local-carpenter/`, `/media-walls/`, `/testimonials/` | meta description | One dash each, as on the live site |

The kitchen spraying title is the only one a visitor can see, in the browser tab. Replacing its `–` with `-` is a one-character title change, so I have left it until you approve it.

## 2. Pre-Flight Check (Section 14)

Dials: DESIGN_VARIANCE 7, MOTION_INTENSITY 8, VISUAL_DENSITY 4 (home 3, inner pages 5).

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Brief inference declared | Pass | `02-mode-and-levers.md` §1, "Design read". |
| 2 | Dial values explicit and reasoned | Pass | 7 / 8 / 4, reasons in `02` §3. |
| 3 | Design system named honestly | Pass | None from 2.A. An honest 2.B aesthetic, "cinematic editorial craft": Tailwind v4 tokens plus GSAP ScrollTrigger. |
| 4 | Redesign mode detected and audited | Pass | Overhaul. Audit in `01-audit.md`. |
| 5 | Zero em-dashes on the page | Pass | Section 1. |
| 6 | Page Theme Lock | Pass (fixed) | The theme follows the visitor's system setting, and every section stays inside that theme's family. The contact section was a dark slate band on light pages; it is now the deepest tint of the page's own theme. The menu, cookie banner and lightbox are overlays. Heroes are photographs. |
| 7 | Colour Consistency Lock | Pass | Coral is the only accent: buttons, stars, link underlines, the active nav mark and the chapter marker. Red appears only as the form's error state. |
| 8 | Shape Consistency Lock | Pass | Square corners everywhere; no radius anywhere in the build. |
| 9 | Button contrast | Pass | Ink on coral 6.4:1. The automated contrast check (22 pages × 3 widths × 2 themes) found 0 failures. |
| 10 | No CTA label wraps at desktop | Pass | 0 wraps in the same review. |
| 11 | Form contrast | Pass | Light: labels 15.9:1, field underline 4.9:1, focus ring in ink. Dark: labels 15.6:1, underline 7.0:1. Help text 5.5:1 (light) and 8.0:1 (dark). |
| 12 | Serif discipline | Pass | Cinzel, the brand's own serif. Not Fraunces or Instrument Serif. |
| 13 | Premium palette check | Pass | Slate and coral, not the beige, brass, oxblood and espresso family. |
| 14 | Italic descender clearance | Not applicable | No italics are used. |
| 15 | Hero fits the viewport | Pass | The Cinzel display line is at most 2 lines at every width; on pages with a long protected H1 the quieter Open Sans line adds one more. Subtext is at most 18 words and 4 lines (fixed at 360 px). Both CTAs are visible without scrolling at every size from 360×640 to 1440×900. |
| 16 | Hero top padding | Pass | 80px on desktop (`lg:pt-20`). |
| 17 | Hero stack, 4 text elements at most | Pass | Brand line or breadcrumb, H1, subtext, CTAs. |
| 18 | Eyebrow count | Pass (fixed) | No uppercase tracked labels. The small "Why Homeowners Trust Us" label over the trust statement was removed: it repeated a line from the protected Local Carpenter copy. |
| 19 | Split-header ban | Pass (fixed) | The builder and trust sections are now stacked vertically. The two-column headers left are the reviews heading with its button and the contact copy beside its form. |
| 20 | Zigzag cap | Pass | No run of 3 image and text splits. |
| 21 | No duplicate CTA intent | Pass (fixed) | The second "See the full gallery" on home was removed. Each intent has one label everywhere: "Contact Us", "Call Us", "Send an Email". |
| 22 to 24 | Logo wall, bento, "trusted by" wall | Not applicable | None on the site. |
| 25 | Copy self-audit | Pass | Every new string was re-read (section 3). |
| 26 | Motion motivated | Pass | Each move has its reason in `02` §4.4. |
| 27 | One marquee per page at most | Pass | One, home "Recent work". It pauses on hover and focus, and does not run under reduced motion. |
| 28 | Navigation on one line, 80px at most | Pass | One row from 1024 px; header 72px desktop, 64px phone. |
| 29 | Section layout repetition | Pass | Home uses at least 8 families: full-bleed hero, statement and figures, pinned scene, sticky stack, image index, wide photo, panning row, tabbed comparison, marquee, form. |
| 30 | Bento rhythm | Not applicable | No bento. |
| 31 | Long lists use the right component | Pass | Services are an index with image previews. The footer lists are site navigation. Protected body lists are unchanged. |
| 32 | Real images | Pass | All photographs are the company's own work (150). |
| 33 | No pills on images | Pass | Labels sit below photos, never on them. |
| 34 to 37 | No credit captions, version footers, micro-meta lines or hero text strips | Pass | None. |
| 38 | No floating top-right sub-text | Pass (fixed) | The project label in the corner of the before/after scene was removed; the caption under the slider already names the job. |
| 39 to 45 | No scoring bars, locale strips, scroll cues, version labels, section numbers, decorative dots or ruled rows | Pass | None. The footer's area sentence is the business's real service area, which suits a local trade. |
| 46 | Content density | Pass | New lines are short. The long service and town copy is protected (C4) and set as chapters with an index. |
| 47 | Quotes 3 lines at most | Pass (fixed) | Quotes are cut further, never reworded (… marks a cut), and sized so each is at most 3 lines from 360 to 1920 px. |
| 48 | Motion claimed = motion shown | Pass (fixed) | The scroll-driven layer was not running (section 6, first item). It now runs and is verified in the browser. |
| 49 | Sticky-stack per 5.A | Pass | `start: "top top"`, `pin: true`, `pinSpacing: false`, scrubbed scale. One adaptation: on phones too short for a whole card, the card pins at its end so it is read in full. The build-stages pan is CSS, not a 5.B pin (see section 5). |
| 50 | No scroll listeners | Pass | ScrollTrigger, IntersectionObserver and CSS scroll-driven animation only. |
| 51 | Reduced motion | Pass | Tested: GSAP is never loaded, there are no pins or loops, the slider sits at 50%, and every reveal is visible. |
| 52 | Dark mode tested in both modes | Pass | The full review ran in both themes. |
| 53 | Mobile collapse explicit | Pass | Every multi-column layout declares its single-column form. No sideways scroll at any scroll position. |
| 54 | Viewport stability | Pass | `svh` units; no `h-screen`. |
| 55 | Animation cleanup | Pass | No React; `gsap.matchMedia` reverts every pin and tween. |
| 56 | Empty, loading and error states | Pass | Form: validation, sending, success and failure messages. The gallery shows only filters that have photos. |
| 57 | Cards omitted where possible | Pass | Only the services stack uses cards, because the stack is the device. |
| 58 | Icons from an allowed library | Pass | Phosphor only. |
| 59 | Motion isolated | Pass | One module, loaded only when motion is allowed. |
| 60 | No AI tells | Pass | Open Sans, not Inter; no purple; no three equal cards; no placeholder names. |
| 61 | Core Web Vitals | Pass (lab) | Mobile home: 206 KB, CLS 0, LCP is the hero photo at about 0.2s locally. |
| 62 | One design system | Pass | One token set throughout. |

## 3. Copy self-audit: every new string

New lines are written in the existing voice from existing facts (C4). All other text is the live site's own.

- **Trust:** "Craftsmanship you can see, with reliability you can feel." (from the About copy).
  - "5.0: Google rating, from 26 reviews"
  - "40+: Years of combined experience"
  - "2013: Helping homeowners since"
  - "1 year: Workmanship guarantee, plus full public liability insurance"
- **Section labels:** "Before and after", "Our Services", "More services", "More before and after", "Recent work", "From start to finish", "On this page".
- **Build stages:**
  - Home: Before, Groundwork and floor, Steel frame, Roof and lantern, Finished.
  - Gallery, bungalow extension: Before, Footings, Floor, Blockwork, Roofed and tiled, Finished.
  - Gallery, garage conversion: Before, Stripped back, Framed and insulated, New brickwork, Finished.
  - Every label matches what its photo shows.
- **Links and buttons:** "See the full gallery", "Read the reviews", "All areas we cover", "Find us on Google Maps".
- **Footer:**
  - "Crafted with care, built to last."
  - "We work across Ely, Newmarket, Bury St Edmunds, Cambridge and the villages around them."

## 4. Preservation audit

Generated by `scripts/preservation-audit.mjs` against `docs/redesign/baseline.json`; the full table is in `04-preservation-audit.md`. CI runs it on every push.

| Item | Changed | Detail |
|---|---|---|
| URLs | **0** | All 22 URLs build at the same paths with trailing slashes. Titles, meta descriptions and canonicals are identical. |
| Primary nav labels | **3, approved (D6)** | Casing only: "Carpentry Services", "Media Walls", "Kitchen Fitting". "Services" is a button with the same label instead of a link to `#` (D19). The header's "Call Us" and "Send an Email" are unchanged. |
| Form fields | **0** | `name-1-first-name`, `name-1-last-name`, `email-1`, `phone-1`, `upload-1[]`, `textarea-1`, same order, on every page with the form. The privacy policy page has no form (D14). |
| Link anchors | **0 in the body copy** | Every contextual link keeps its anchor text and target. Footer: the 56 "Service Town" keyword links became one area sentence, 4 town links, "All areas we cover" and a Google Maps link (D17). |
| H1s | **0** | All 22 are character for character the same. On 3 town pages the build had dropped a space ("inNewmarket"); this audit caught it and it is fixed. |
| Other headings | **approved only** | D1: 13 dashes became colons. D7: 21 banner H2s became the breadcrumb or brand line. D8: 12 number headings removed, 21 level fixes, 3 casing fixes. |

The D rules are the ones you approved in the first round ("approve all including D17"). The overhaul keeps them under C4.

## 5. Brand fidelity audit

| Element | Before | After | Result |
|---|---|---|---|
| Accent colour | Coral `#F07957` on buttons, sticky bar and stars | Coral `#F07957`, exactly, as the only accent: buttons, sticky bar, stars, link underlines, active nav. Ink text on coral at 6.4:1. | **Survived** |
| Type stack | Cinzel and Open Sans | Both, self-hosted variable fonts. Cinzel only for display: the H1 line, figures, the footer name and "Thank you". Open Sans for everything else, nav and buttons included (C2). | **Survived** |
| Logo | Saw-blade PNG, unfiltered, light grounds, header and footer | The same file, byte for byte (SHA-256 `26ff98f2…`, identical to the live site's). Unfiltered, always on its light plate: header, footer and mobile menu (C3). | **Survived** |
| Logo blue `#0C74BB` | Primary interface colour | Kept inside the logo only (C1). | As approved |

## 6. Found and fixed during the Step 3 review

1. **The scroll-driven layer never ran:** reveals, clip-ins, photo drift and the build-stages pan.
   - Cause 1: the CSS minifier folded `animation-timeline` into the `animation` shorthand, which browsers reject.
   - Cause 2: several clipping wrappers used `overflow: hidden`, which traps the timeline.
   - Fix: longhands, and `overflow: clip`. Now verified in the browser: everything revealed is fully shown before it reaches mid-screen.
2. **Services stack ghosting:** the card underneath showed through the receding one. Cards now stay opaque and recede under a veil.
3. **Services stack on small phones:** cards taller than the screen now pin at their end, so the last line is read before the next card covers it. Tested from 360×640 to 1440×900.
4. **Build-stages pan:** the last photo never came fully into view. The pan distance is now worked out from the number of stages.
5. **Before/after scene:** once a visitor drags the handle or uses the arrow keys, scrolling stops moving the slider.
6. **Town page H1s:** the missing space (section 4).
7. **Footer name:** the "R" of "Potter" was cut off at every width. It now fits its column exactly.
8. **Theme Lock:** the contact band (Pre-Flight 6).
9. **Layout rules:** split header, corner sub-text and the duplicate CTA (Pre-Flight 19, 38, 21).
10. **Trust label:** the eyebrow-style label was removed (Pre-Flight 18).
11. **Quotes:** cut and resized to 3 lines (Pre-Flight 47).
12. **Sticky phone bar:** its labels were in Cinzel; now Open Sans, per C2.
13. **Long headings:** over 60 characters they step down one size, so they stay at about 3 lines.

## 7. Where the build differs from Step 2

1. **"How we build it" pans with the scroll (CSS) instead of pinning (5.B).**
   - Why: a pinned pan would be a third pin on home, against the cap of two that you approved.
   - What it does: it travels from the first stage to the last while the row is in view.
   - Alternative: say if you would rather pin it instead of the services stack.
2. **The services stack also runs on phones** instead of becoming a swipe row there.
   - Why: a swipe row would hide three of the four main services behind a sideways gesture. The stack is tested readable from 360 px.
3. **Only 5.0 and 40+ count up.** A year counting up from zero reads oddly, and "26" sits inside a label.
4. **Added within the approved sections:**
   - home: a "More before and after" project switcher, and the four extension types under "How we build it";
   - gallery: two real build sequences, bungalow extension and garage conversion.

## 8. Still open

- **Ely page phone link:** one link in the protected Ely copy points to `tel:+4407415 216223`. That is "+44" followed by the leading 0, which phones may fail to connect. Correcting the link target (not its text) needs your OK.
- **Privacy policy cookie tables:** they describe the old WordPress cookies. This is legal copy, so it needs your or your adviser's wording.
- **Review quotes (D15):** please confirm the Google reviews may be quoted. The excerpts are now shorter, with cuts marked "…".
- **The form:** it needs its destination inbox and the Turnstile keys before it goes live.
- **Kitchen spraying title:** the one visible dash (section 1), waiting for your approval.
- **Narrow screens:**
  - At 320 px, two quotes run to 4 lines.
  - On phones, one 80-character House Extensions H2 runs to 4 lines.
- **Repository:** the GitHub default branch is `claude/vibrant-planck-512veg`. Switching it to `main` is recommended.
