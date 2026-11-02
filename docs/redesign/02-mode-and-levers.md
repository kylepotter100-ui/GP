# Step 2. Mode, dials and modernisation levers

Governing rules: `design-taste-frontend-v2-experimental` (Sections 1, 4, 11.A, 11.D, 11.E).
Scope agreed on 2 November 2026: build the design now; the SEO plan comes after the design is signed off. During the build, the SEO constraints from the brief act as guardrails, and only the additive fixes that fall out of the rebuild are made (section 6).

---

## 1. Mode: Redesign, Preserve

| Option | Why it is or isn't this one |
|---|---|
| Greenfield (content preserved) | No. The brand is not changing; name, logo, colours, type and voice all stay. |
| Overhaul | No. Overhaul means a new visual language on top of old content. The brief keeps the existing language (Cinzel capitals, blue and coral, square corners, a photo-led hero) and asks for it to be rebuilt well, not replaced. The Step 4 brand-fidelity audit would fail an overhaul by definition. |
| **Preserve** | **Yes.** Keep the brand, IA, copy and SEO surface; extract the tokens and rebuild the visual layer around them. |

Section 11.E notes that the visual debt is structural: there is no design system, and the mobile composition is broken (a 23-screen home page, the H1 off the first screen, a numbered card wall). So all six levers apply, not only levers 1 to 4. The rebuild also moves from Elementor to Astro, so every block is re-made anyway. Lever 6 (full replacement) is limited to the blocks named in section 4.6.

## 2. Design read and design system

*Reading this as: redesign of a local trade site (carpentry, extensions, kitchens) for homeowners aged 35 to 65 browsing on phones, with a solid, warm, hand-built language, leaning toward the brand's own Cinzel and Open Sans, square corners and blue and coral, built with native CSS in the existing Astro build around real project photography.*

**Design system (Section 2):** none. Section 2.A lists Bootstrap for a "fast local-business MVP", but this is a brand-preserving redesign rather than an MVP, and Bootstrap's defaults are the template look being retired. This is an aesthetic brief under 2.B, built honestly with native CSS through Tailwind v4 tokens.

## 3. Dials

| Dial | Current | Preserve preset (match / +1 / match) | **Set to** | Reason |
|---|---|---|---|---|
| `DESIGN_VARIANCE` | 3 | 3 | **4** | One step into the "offset" band. The coral offset frame is already a level-4 device. Photo ratios vary (4:3 next to 3:2), headings sit left over full-bleed photos, and nothing goes asymmetric or arty. Below 768px every layout collapses to one column. |
| `MOTION_INTENSITY` | 2 | 3 | **4** | The brief asks for before/after reveals, swipeable galleries, scroll reveals and a sticky bar. That is the bottom of the "fluid CSS" band: transitions on transform and opacity, IntersectionObserver reveals, CSS scroll-snap. No scroll-jacking, pinning, parallax or GSAP. |
| `VISUAL_DENSITY` | 6 | 6 | **5** | Service and town copy stays complete for SEO, so density can't drop far. Spacing moves to the standard band (`py-16` mobile, `py-24` desktop), paragraphs are capped at 65 characters a line, and the home page loses its triple pass over the services. |

## 4. Modernisation levers, in 11.D order

All six apply. The order is the skill's: lowest risk first.

### 4.1 Typography refresh
- Keep **Cinzel** (display) and **Open Sans** (text): the brand stack. Self-host both through `@fontsource` with `font-display: swap`. Drop the second font CDN and the three icon fonts.
- **Cinzel 600** for the H1 to H3, nav and buttons; Open Sans 400 and 600 for text. Cinzel is all capitals, so tracking stays near 0 rather than the skill's tight default; tight tracking on inscriptional capitals hurts legibility. Leading is 1.05 to 1.1.
- **Five sizes at most:**
  - display: about 26px on a phone, 52 to 56px on desktop, so the protected H1 fits in two lines on desktop;
  - section heading;
  - sub-heading;
  - body at 17 to 18px with 1.6 leading and a 65ch measure;
  - small.
- No italics, no pure black.

### 4.2 Spacing and rhythm
- One 4px-based scale; one content width (about 1280px) with equal 16, 24 or 32px gutters by breakpoint.
- Section padding 64px on mobile and 96px on desktop. Gaps inside a section are always smaller than gaps between sections.
- The header shrinks to 64px on mobile and 72px on desktop (from 161 and 114).
- Remove the decorative bar under every heading; space and scale do that job.

### 4.3 Colour recalibration
- **Brand hexes kept exactly:** blue `#0C74BB` and coral `#F07957`. They are the logo's colours, so they are not desaturated (a brand override of the 80% saturation default in 4.2).
- **Coral is the single accent and belongs to actions only:** buttons and the sticky bar. White text on coral measures 2.8:1 and fails AA, so button text becomes off-black, at about 6.3:1.
- **Blue is the brand colour:** text links (4.7:1 on the ground), focus rings and one deliberate colour block, the closing contact section.
- **Neutrals unified:**
  - off-black ink replaces `#000000`;
  - a cool off-white ground (not cream);
  - one surface tone for separation;
  - one muted ink that passes AA.
- **Light theme, locked** (see decision D11). No section inverts mid-page.

### 4.4 Motion layer (MOTION_INTENSITY 4)
Each item has a one-line reason, as Section 5 requires.

| Motion | Why it exists | How |
|---|---|---|
| Before/after reveal | Storytelling: the work sells itself | Drag or keyboard slider (a native range input underneath), clip-path on the "after" photo. It is user-driven, so it still works with reduced motion; there is no auto-wipe. |
| Swipeable project galleries | Breadth without length | CSS scroll-snap rows that swipe natively, with prev and next buttons on desktop and no autoplay. On `/gallery/`, a `<dialog>` lightbox with swipe and arrow keys. The existing 9 filter categories are kept. |
| Restrained scroll reveals | Hierarchy: the heading, then copy, then photo | IntersectionObserver, opacity plus 16px rise, 60 to 80ms stagger, once only. Content is fully visible without JavaScript. Never on the hero or the LCP image. Off under `prefers-reduced-motion`. |
| Sticky mobile bar: Call, WhatsApp, Contact | Feedback and access: the action is always one thumb away | It slides up once the hero buttons scroll out of view (IntersectionObserver, not a scroll listener), respects the iPhone safe area, and sits clear of the cookie banner. |
| Button, link and card feedback | Feedback | Press is a 1px drop or 0.98 scale; hover is a tone step; there is a visible `:focus-visible` ring. |
| Retired | | The hero crossfade slideshow (it is the LCP cost), the floating WhatsApp bubble's entry animation, the Elementor fades. |

### 4.5 Hero and key-section recomposition
- **Home:**
  - **Hero:** the protected H1, a subtext of 20 words or fewer, "Contact Us" plus a call link, and a large real project photo. On phones the visual is the rear-extension before/after (same viewpoint, before and after), so real proof is on the first screen.
  - **Reviews:** they move to directly under the hero.
  - **Services:** the 12 numbered cards and six repeated splits become one grouped services index (Extensions, Conversions, Kitchens, Carpentry and joinery). Every protected service H2 and contextual link is kept, set as one editorial prose block plus a swipeable row of extension types.
  - **Close:** a before/after gallery teaser, then the contact close.
- **Service template (12 pages):**
  - hero with the protected H1 and the page's own photo;
  - the long-form copy kept whole as one editorial article column with photos set inline, so it counts as one layout family rather than six;
  - a swipe row of that service's real photos;
  - the "All our services" index;
  - the contact close.
- **Town template (4 pages):** the same skeleton, plus the photos of jobs that suit that town's services, and links into each service page from the existing body copy.
- **Gallery:** curated before/after pairs first, then the full filterable grid with the lightbox.
- **Testimonials:** real reviews set in the page.
- **Contact:** phone, WhatsApp and email set large, with the form beside them.

### 4.6 Full block replacement (only the unsalvageable)
1. The 12-card numbered services grid.
2. The Elfsight review widget, replaced by real review text in the page (D15).
3. The Click to Chat floating button, replaced by the sticky bar on mobile and a header link on desktop. The GA4 event name "Click to Chat" is kept.
4. The Forminator markup, replaced by a native form with **the same field names in the same order** (D14).
5. The cookie banner, replaced by a lightweight banner with **the same wording and the same three choices** (D18).
6. The footer "Find us" accordion, replaced as proposed in D17. **This needs your explicit yes.**
7. The hero slideshow and the six Copilot images (D16).

## 5. Photography plan

- **What exists:** 145 real project photos. Almost all are 1600x1200 WhatsApp exports: fine for page layouts, slightly soft for a full-bleed hero on high-density screens.
- **Same-viewpoint before/after pairs found:**

  | Project | Before | After |
  |---|---|---|
  | Rear extension | `Rear-view-before.jpg` | `Rear-view-after.jpg` |
  | Garage conversion | `1000066571.jpg` | `1000066570.jpg` |
  | Outdoor kitchen and oak pergola | `IMG-20250805-WA0037.jpg` | `IMG-20250805-WA0030.jpg` |
  | Media wall | `1000066611.jpg` (stud frame) | `1000066599.jpg` |
  | Bespoke library | `IMG-20250805-WA0021.jpg` (empty carcasses) | `IMG-20250806-WA0220.jpg` |

- **Build sequences:** these also exist for the rear extension (groundworks, steel frame, glazing, then the lantern-roof kitchen and living room), the bungalow side extension (footings to finished deck) and the garage conversion.
- **Pipeline:** photos are processed at build time into responsive AVIF and WebP with explicit sizes. Every photo gets a descriptive alt text of what it shows, not the business name.

## 6. SEO guardrails during the build (SEO plan deferred)

**Kept exactly:**
- all 22 URLs with trailing slashes;
- every title, meta description and canonical;
- H1 wording;
- the wording of keyword H2s;
- contextual body links (anchor text and target);
- phone, email and business name;
- nav labels (except D6 if approved);
- form field names and order;
- GA4 `G-48FGMN8RL6`, Clarity and the "Click to Chat" event.

**How exactness is guaranteed:** copy is migrated programmatically from the live HTML, not retyped. The Step 4 preservation audit diffs the built pages against `baseline.json`.

**Additive fixes that come with the rebuild:**
- heading order (D7, D8);
- descriptive alt text;
- LocalBusiness JSON-LD from `src/config/site.ts`, finalised with your Google Business Profile details in the SEO phase;
- `og:image` on the 8 pages that lack one.

**Deferred to the SEO plan:**
- FAQ blocks;
- Google Business Profile linking and name, address and phone alignment;
- citations;
- Search Console;
- differentiating the town pages;
- the DNS cutover and redirect check.

## 7. Decisions

Replying OK approves the recommendation in every row. Strike or change any row you don't want.

| # | Decision | Recommendation |
|---|---|---|
| D1 | Dashes in 13 protected keyword H2s | Keep every word; replace the dash with a colon, which the site already does elsewhere. |
| D2 | Dashes in 1 title and 5 meta descriptions | Keep them verbatim, since they are not on the page. List them as accepted exceptions in the Step 4 em-dash audit. |
| D3 | 3 em-dashes in the privacy policy (legal copy, 11.F) | Punctuation-only swap, wording unchanged. |
| D4 | Dashes in the remaining body copy | Punctuation-only edits (comma, colon or full stop), no wording or link changes. |
| D5 | Typo "Looking for as local carpenter" | Correct to "a local carpenter". |
| D6 | Nav casing: "Carpentry services", "Media walls", "Kitchen fitting" | Title Case ("Carpentry Services", "Media Walls", "Kitchen Fitting"), matching the footer and the page H1s. Title tags unchanged. |
| D7 | Banner H2 above the H1 on 21 pages | Becomes a breadcrumb with the same words; it is no longer a heading. |
| D8 | Home "01" to "12" H2s; duplicate service headings; H1 then H3 skips | Remove the number headings. The 12 service names become H3s under "Our Services" with unchanged wording. Duplicated names ("House Extensions" twice) appear once. The first H3 on the 5 extension pages is promoted to H2. |
| D9 | Hero subtexts over 20 words (home and others) | Trim to 20 words or fewer using the existing phrases. Home: "Crafted with care, built to last. Extensions, garage conversions, kitchens and bespoke carpentry since 2013." The phone number moves to the call button. |
| D10 | One accent vs. a two-colour brand | Coral for actions (with off-black text, for contrast); blue for identity, links and one closing colour block. Exact hexes; `#000` becomes off-black. |
| D11 | Dark mode (skill expects both modes) | Light theme, locked. The logo exists only as a raster PNG made for light grounds. A dark mode needs either the current filter, which distorts the brand blue, or a redrawn logo, which is a logo change. Revisit if a vector logo is made. |
| D12 | Stack (skill defaults to React, Next and Motion) | Keep Astro static output with Tailwind v4 and a few small vanilla TypeScript scripts; no React or animation library. Phosphor icons, self-hosted fonts. This is the lightest way to meet "never delays page load". |
| D13 | One label per intent (4.5) vs. "Quote" in the brief | Every contact button says **"Contact Us"**, matching the protected nav label. The sticky bar reads Call Us, WhatsApp, Contact Us. The alternative, "Get a Quote" everywhere, means renaming the nav item (the URL stays). |
| D14 | Form backend | Native form, same field names and order, visible labels (the current placeholder words), labelled "Submit". It posts to a Cloudflare Worker with Turnstile spam protection and email delivery. Built in Step 3; it goes live once you give me the destination address. The form is removed from the privacy policy page only. |
| D15 | Reviews | Set 3 to 6 real Google review excerpts (3 lines or fewer, reviewer name, "Google review") with the 5.0 from 26 figure and a link to your Google profile. Elfsight is removed. No review star markup, since self-served reviews are not eligible. Not published until you confirm you're happy to quote them. |
| D16 | Six Copilot AI images | Remove all six. `/wrap-around-extensions/` uses real extension photos, truthfully captioned, until you tell me which jobs were wrap-arounds. |
| D17 | Footer "Find us" (56 keyword links) | **Needs your explicit yes.** Replace it with one service-area sentence; four links to the town pages (Ely, Newmarket, Bury St Edmunds, Cambridge); "All areas we cover" linking to `/areas-we-cover/`; and your Google profile link. The Services column keeps the 12 service links once each, so every service and town URL is still linked from every page, with honest anchors. |
| D18 | Cookie banner | Same wording and Preferences, Reject and Accept All. Restyled as a compact bottom sheet that doesn't cover the hero or the sticky bar. GA4 and Clarity load only after Accept. |
| D19 | "Services" nav parent links to `#` | It becomes a button that opens the dropdown; same label, no new URL. |
| D20 | Logo treatment | A plain light header and a light footer, so the PNG always shows in its real colours with no CSS filter. The closing blue block sits above the footer. |

## 8. What I need, and when

- **Nothing blocks Step 3.** I can build everything from the live site and the 145 photos.
- **Before launch:** the form's destination email; whether I can quote the Google reviews, plus your Google profile link; which jobs were wrap-around extensions; full-resolution originals of the hero and before/after photos, if you have them.
- **For the SEO phase:** the Search Console export and your Google Business Profile details.
