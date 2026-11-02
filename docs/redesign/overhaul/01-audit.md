# Overhaul, Step 1. Audit (Section 11.B)

Captured 2 November 2026. Governing rules: `design-taste-frontend-v2-experimental`.

**What is audited.** The current site in this repo (commit `92eb8a3`): the build whose before/after images and contact form the owner says work. It was made to the earlier Preserve brief, so its brand, structure and copy are still the WordPress site's. The **SEO baseline** still comes from the live WordPress site, because that is what Google indexes today (`docs/redesign/baseline.json`).

Screenshots of the current build are in `before/`.

**Design read (0.B), new brief:** *Reading this as: a complete overhaul of a local trade site into a premium, motion-led landing experience for homeowners aged 35 to 65 on phones, with a cinematic, material, hand-built language, leaning toward scroll-driven and choreographed motion in the existing Astro build, carried by real project photography.*

---

## 1. Brand tokens in use

| Token | Value | Use |
|---|---|---|
| Ground | `#F6F7F7` cool off-white | Page background |
| Surface | `#ECEEEF` cool grey | Alternate section bands (16 of the home page's backgrounds) |
| Ink | `#15191D` | All text (125 of 157 text runs on the home page) |
| Muted ink | `#4B535C` | Breadcrumbs, captions, help text |
| Primary (logo blue) | `#0C74BB` | One colour block (the closing contact section), focus rings, logo wordmark |
| Link blue | `#0B67A6` | Text links (28 runs on the home page) |
| Accent (logo coral) | `#F07957` | Every action button, sticky bar, rating stars, offset photo frame |
| Type, display | **Cinzel** (variable, 600) | H1 to H3, nav, buttons, footer headings. All-capitals inscriptional serif, echoing the logo |
| Type, text | **Open Sans** (variable, 400/600) | Body 17 to 18px, labels |
| Type scale | 5 sizes | Display 24 to 52px, title 20 to 34px, sub 18 to 21px, body 17 to 18px, small 14px |
| Radii | **0** everywhere | Measured: no element with a rounded corner |
| Logo | Saw-blade PNG (500×331), grey saw, blue "GARY J POTTER", coral "Carpentry & Construction" | Unfiltered on light grounds, header (50 to 60px tall) and footer |
| Signature device | Coral L-shaped offset block behind a photo | Page heroes and one home section |

## 2. Information architecture

**Page tree:** 22 URLs, unchanged from the live site.
- `/`
- 12 service pages at the top level
- `/areas-we-cover/` and 4 town pages under `/area/`
- `/gallery/`, `/testimonials/`, `/contact-us/`, `/privacy-policy/`

**Templates:**
- **Home:** 9 sections. Hero with before/after, reviews, about, services, extension builder with build stages, extension types, before/after switcher, local carpenter, contact.
- **One shared template for 19 pages** (12 services, 4 towns, areas, privacy): split hero, long article with a photo rail, a "Project photos" swipe row, the blue contact close.
- **Gallery:** before/after switcher, then 150 photos with 9 filters and a lightbox.
- **Testimonials** and **Contact:** short custom pages.

**Primary nav (labels as built):** Home · Services (12) · Areas We Cover · Gallery · Testimonials · Contact Us. Header links: "Call Us", "Send an Email". Services labels: Carpentry Services, Local Carpenter, House Extensions, Garage Conversions, Media Walls, Kitchen Fitting, Kitchen Spraying, Single Storey Extensions, Double Storey Extensions, Wrap Around Extensions, Timber Framed Extensions, Extension Builder.

**Conversion paths:**
1. **Hero buttons:** "Contact Us", which jumps to the on-page form, and "Call Us 07415 216223".
2. **Phone sticky bar:** Call Us · WhatsApp · Contact Us, shown after the hero.
3. **Closing contact block on 21 pages:** call, WhatsApp, email, and the enquiry form.
4. **Enquiry form:** fields `name-1-first-name`, `name-1-last-name`, `email-1`, `phone-1`, `upload-1[]`, `textarea-1`; Turnstile spam check; posts to the Cloudflare Worker `/api/contact`, which emails the enquiry with photos attached.

**Tracking:** GA4 `G-48FGMN8RL6` and Clarity, after cookie consent; the "Click to Chat" event on WhatsApp taps.

## 3. Patterns to preserve

- **The before/after reveal** (named by the owner as working; read here as the drag-to-compare before/after images):
  - the rear-extension pair in the home hero;
  - the four-project switcher on the home and gallery pages;
  - five real same-viewpoint pairs: rear extension, garage conversion, outdoor kitchen, media wall, bespoke library.
- **The contact form** (named by the owner as working): field names and order, photo upload, inline states, the Worker endpoint and email delivery.
- **Real photography:** 150 of Gary's own photos with descriptive alt text. Real proof is the strongest asset this site has.
- **Recognisable hero:** a real finished job, large, with the business name above the headline.
- **Copy voice:** friendly, plain, second person ("We see garages differently.", "first sketch to final polish"); the line "Crafted with care, built to last".
- **Trust facts:**
  - since 2013;
  - 40+ years combined experience;
  - NVQ-qualified;
  - one-year workmanship guarantee;
  - public liability insurance;
  - all trades in-house;
  - help with planning and drawings;
  - 5.0 from 26 Google reviews.
- **Fixed by the brief (Step 3):** URL structure, primary nav labels, form field names, the brand logo, legal copy (privacy policy, cookie banner wording).

## 4. Patterns to retire

Nothing is broken: 0 sideways overflow at 390, 768 and 1440 px, 0 broken images, 0 dead internal links. These are the patterns that keep it from reading as premium, judged against the new brief.

1. **One motion vocabulary.** All movement is the same 18px fade-up: 34 elements on load, about 100 more on scroll. There is no hero entrance, no scroll-linked motion and no signature move; the before/after slider is the only moment that responds. That is `MOTION_INTENSITY` 3 against a brief that asks for more.
2. **A utilitarian palette.** Cool grey bands alternate down every page (ground `#F6F7F7`, surface `#ECEEEF`) with one blue block at the end. There is no material warmth and no dark or deep moment, and coral appears only as button fills. The rhythm reads as template banding.
3. **Monotone hierarchy.** Cinzel capitals carry every heading level, the nav and the buttons, so H1, H2 and H3 differ only in size. At 15 to 17px (nav, buttons) the inscriptional capitals read cramped.
4. **One template for 19 pages.** Every service and town page has the same split hero, article, "Project photos" row (the same heading on 18 pages) and blue close. Moving between pages shows no change of pace.
5. **Text walls.** The full long-form SEO copy runs unbroken.
   - Town pages are 19,360 to 19,857 px tall on a phone, about 23 screens.
   - Service pages have a median of 10,782 px.
   - The home page is 12,642 px.
6. **The split hero** on inner pages (breadcrumb, H1, subtext, two buttons, photo at 5/7) is the default landing-page composition.
7. **A decorative block.** The coral offset rectangle behind photos is a hand-placed decorative shape, not information.
8. **An uncurated gallery.** 150 equal square tiles in one grid, about 24 phone screens; no projects, no story.
9. **Static proof.** Reviews are plain quotes in two columns, and the 5.0 rating is set like body content rather than a moment.
10. **The footer as sitemap.** Two link columns, a service-area sentence, and a large grey map iframe that loads Google Maps on every page.

**Still open from the last round:**
- the four town pages' malformed phone links (`tel:+4407415 216223`);
- the privacy policy's cookie tables, which list WordPress cookies;
- permission to quote the Google reviews.

## 5. Dial reading of the current site

| Dial | Reading | Why |
|---|---|---|
| `DESIGN_VARIANCE` | **4** | Offset 7/5 grids, one overlap device, left-aligned headings; every inner page is the same split, so it reads closer to 3 |
| `MOTION_INTENSITY` | **3** | One fade-up pattern, user-driven slider and swipe rows; nothing choreographed or scroll-linked |
| `VISUAL_DENSITY` | **5** home, **6** inner pages | Standard section spacing; long unbroken articles on service and town pages |

## 6. SEO baseline (live site; unchanged by the current build)

**Rankings: not measured.** There is no Search Console access. A Pages and Queries export would show which pages can least afford copy changes.

**Indexed URLs:** the 22 above, all self-canonical with trailing slashes. Non-slash URLs and the old sitemap URLs 301 in the build.

**Title tags** follow two patterns:
- `<Name> | Gary J Potter Carpentry & Construction` on the inner pages; some service titles add a word, e.g. "Seamless Wrap Around Extensions", "Experienced Extension Builder".
- On the home page: "Gary J Potter Carpentry & Construction | Crafted with care, built to last".

**H1s** carry the main keyword and towns, e.g.:
- "Garage Conversions | Ely Newmarket Bury St Edmunds Cambridge"
- "Local Carpenter & Construction Services in Ely"

**Anchors:**
- **Exact-match body links:** "house extensions", "garage conversions" and the like link from the copy of almost every page to the 12 service pages.
- **Town links:** town names link to the 4 `/area/` pages from the home, contact, testimonials and gallery copy and from the footer.
- **Footer:** each service linked once; the 4 towns linked twice (Quick Links and Find us).

The full per-page titles, meta descriptions, canonicals, headings and body links are in `baseline.json`.

**Main SEO risk in an overhaul:** rewriting H1s, keyword H2s or the long service and town copy. The new brief protects URLs, nav labels, form fields, logo and legal copy, but not titles, H1s or body copy.

## 7. Conflicts to settle in Step 2

1. **"New colour designs" vs. the Step 4 brand-fidelity check** that the existing accent survives. The current accent is coral `#F07957`, the logo's tagline colour; the logo's blue is the primary.
2. **Complete overhaul vs. the type stack surviving.** Cinzel and Open Sans can be kept and used very differently (scale, weight, where each appears), or changed with your explicit approval.
3. **Logo treatment.** The logo exists only as a PNG designed for light backgrounds. Any dark or photographic sections must show it on a light field, unless you approve a reversed version.
4. **SEO scope.** Whether titles, meta descriptions, H1s and the long service and town copy stay as they are (lowest risk with no ranking data), and how far the home page may be rewritten as a landing page. Section 11.C keeps copy voice unless a rewrite is asked for.
