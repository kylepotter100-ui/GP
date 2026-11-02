# Step 1. Redesign audit (Section 11.B)

Site: https://www.garyjpottercarpentry.co.uk/ (WordPress, Elementor Pro, All in One SEO 5.0.4, Forminator, served by nginx)
Captured: 2 November 2026. Governing rules: `design-taste-frontend-v2-experimental`.

Method: all 22 URLs from the live XML sitemaps were rendered in headless Chromium at 390x844 and 1440x900. I read the computed styles, the DOM, the Elementor kit CSS and the full-page screenshots, and checked every internal link. Before screenshots are in `before/`. The per-page baseline (titles, descriptions, canonicals, headings, body links, nav, form fields, footer links) is in `baseline.json` and is what the Step 4 preservation audit will diff against.

Design read (0.B): *Reading this as: redesign of a local trade site (carpentry, extensions, kitchens) for homeowners aged 35 to 65 browsing on phones, with a solid, warm, hand-built language, leaning toward the brand's own Cinzel and Open Sans, square corners and blue and coral, built with native CSS in the existing Astro build around real project photography.*

---

## 1. Brand tokens in use

| Token | Value | Where it shows up |
|---|---|---|
| Brand blue | `#0C74BB` (Elementor "primary" and "accent" are both this value) | Full-bleed section fields (About, Local Carpenter, Wrap/Timber), cookie banner, footer bottom bar, logo wordmark (`#0F76BB` in the PNG) |
| Coral | `#F07957` (Elementor "secondary") | Every CTA button, active nav item, contact section field, offset photo frames, short rules under card titles, logo tagline |
| Text | `#000000` pure black | Body and headings on white sections |
| Ground | `#FFFFFF` | Default sections |
| Footer | `#000000` pure black | Footer field |
| Others | `#F6F6F8` (Elfsight review widget only), `#25D366` (WhatsApp button), yellow "Accept All" in the cookie banner, `#FFBC7D` defined in the kit CSS with no visible use | Third-party UI |
| Display type | **Cinzel** 400 / 500 / 600 (Google Fonts) | H1 to H3, nav, buttons, footer headings. Cinzel is an all-capitals inscriptional face, which is why headings read as small caps. It echoes the logo's lettering. |
| Text type | **Open Sans** 400 / 500 / 600 / 700 | Body 16px / 24px line height, form fields |
| Type scale (desktop / phone) | Hero name H2 66px / 30px; H1 36px / 24px; section H2 about 28 to 36px; body 16px | |
| Font loading | Loaded twice, from `fonts.gstatic.com` and `fonts.bunny.net`, plus Font Awesome, eicons and Forminator icon fonts | |
| Radii | **0px** on every brand component (buttons, photo frames, inputs, cards) | Rounded corners appear only inside third-party widgets (Elfsight 8px and 24px, WhatsApp circle, cookie buttons) |
| Logo | PNG, 500x331, transparent: grey circular saw blade (`#818284`), "GARY J POTTER" in blue inscriptional capitals, "Carpentry & Construction" in coral. Alt text "Gary J Potter \| Logo" | Header: CSS `filter: brightness(200%) contrast(200%)` turns the saw white and shifts the blue toward cyan, so the brand blue is distorted in the header. Footer: the unfiltered logo sits on pure black, where the grey saw and blue wordmark have low contrast. There is no SVG version. |
| Signature devices | Coral L-shaped offset frame behind photos; short black or white bar under every heading; coral square with a navigation-arrow icon on each service card | |

## 2. Information architecture

**Page tree (22 URLs, all 200, all self-canonical with trailing slash)**

```
/
├── Services (12, top level slugs)
│   ├── /carpentry-services/        ├── /single-storey-extensions/
│   ├── /local-carpenter/           ├── /double-storey-extensions/
│   ├── /house-extensions/          ├── /wrap-around-extensions/
│   ├── /garage-conversions/        ├── /timber-framed-extensions/
│   ├── /media-walls/               ├── /extension-builder/
│   ├── /kitchen-fitting/           └── /kitchen-spraying/
├── /areas-we-cover/
│   ├── /area/ely/                  ├── /area/bury-st-edmunds/
│   └── /area/newmarket/            └── /area/cambridge/
├── /gallery/
├── /testimonials/
├── /contact-us/
└── /privacy-policy/
```

**Primary nav (labels verbatim):** Home · Services (dropdown, parent link is `#`) · Areas We Cover · Gallery · Testimonials · Contact Us. Dropdown order and labels: Carpentry services, Local Carpenter, House Extensions, Garage Conversions, Media walls, Kitchen fitting, Kitchen Spraying, Single Storey Extensions, Double Storey Extensions, Wrap Around Extensions, Timber Framed Extensions, Extension Builder. Utility links in the header: "Call Us" (`tel:+447415216223`) and "Send an Email" (`mailto:info@garyjpottercarpentry.co.uk`). The four town pages are not in the nav.

**Footer:** logo, phone, email, Facebook, Instagram · "Services" column (12 links) · "Quick Links" column (Home, Areas We Cover, Ely, Bury St Edmunds, Newmarket, Cambridge, Contact Us, Testimonials, Gallery, Privacy Policy) · "Find us" heading over a collapsed `<details>` accordion, itself labelled "Quick Links", that holds 56 keyword links · copyright line.

**Conversion paths**

1. **Phone:** `tel:` in the header utility bar, the hero subtext, the shared Contact block on every page and the footer.
2. **WhatsApp:** floating button (Click to Chat by HoliThemes, number 447415216223, no pre-filled message). It fires a GA4 event named "Click to Chat".
3. **Form:** Forminator module 2053 is repeated at the foot of all 22 pages, privacy policy included. Field names: `name-1-first-name`, `name-1-last-name`, `email-1`, `phone-1`, `upload-1[]` (multiple files, drag and drop), `textarea-1`, plus reCAPTCHA. Submit label "SUBMIT". All fields use the placeholder as the label; there are no `<label>` elements.
4. **Email:** `mailto:` in the header, the Contact block and the footer.
5. **Buttons:** "Contact Us" buttons go to `/contact-us/`.

**Tracking to keep working:** GA4 `G-48FGMN8RL6` (gtag), Microsoft Clarity, and the WhatsApp "Click to Chat" event. A consent banner reads "We use cookies to improve your experience on our site. By using our site, you consent to cookies." with Preferences / Reject / Accept All.

## 3. Content blocks (home page, in order)

| # | Block | Doing work? |
|---|---|---|
| 1 | Hero: rotating background photos, business name as H2, 32-word subtext with the phone number, "Contact Us" | Partly. Phone and real photos work. The name is repeated in the subtext; no proof. |
| 2 | H1 "Crafted Carpentry & Construction Across Cambridgeshire & Suffolk" plus three paragraphs (since 2013, 40+ years, small team, all trades) | Yes, but it is a text wall. |
| 3 | "Our Services": 12 identical photo cards numbered 01 to 12 | Internal links, yes. The format is filler. |
| 4 | "About Our Company" (blue field): planning and drawings reassurance | Yes. This is the planning-and-trades reassurance the audience needs. |
| 5 to 10 | Six image-and-text sections retelling the same services (house extensions, garage conversions, media walls, kitchen fitting, local carpenter with the trust list, extension builder, single, double, wrap-around, timber-framed) | The trust list and contextual links do work. The rest repeats block 3. |
| 11 | "What our customers say": Elfsight Google Reviews widget, 5.0 from 26 reviews | The proof is real, but on mobile it shows only the summary card. |
| 12 | "Contact Us" (coral field): copy, contextual links, form | Yes. |

Services appear three times on the home page. At 390px wide the page is 19,561px tall, about 23 phone screens; at 1440px it is 12,208px.

## 4. Patterns to preserve

- **Name and logo:** "Gary J Potter Carpentry & Construction", and the saw-blade logo in its original colours.
- **Cinzel capitals:** the display face. It is the visual echo of the carved lettering in the logo, and the most recognisable thing about the site's type.
- **Colour:** blue `#0C74BB` and coral `#F07957` as the brand pair, matching the logo's wordmark and tagline.
- **Corners:** square, 0 radius, everywhere.
- **Recognisable hero:** a full-bleed photograph of a finished job with the business name set large in Cinzel.
- **Copy voice:** friendly, plain, second person, with a little warmth ("We see garages differently.", "Your kitchen is the heart of your home", "first sketch to final polish"), and the tagline "Crafted with care, built to last".
- **Trust signals** already in the copy:
  - since 2013 (7 pages)
  - 40+ years combined experience (14)
  - NVQ-qualified team (10)
  - one-year workmanship guarantee (14)
  - public liability insurance (12)
  - all trades managed in-house
  - help with planning and drawings (8)
  - family-run
- **Low-friction contact:** visible phone number, WhatsApp, a form that takes photo uploads, plus the "Call Us" and "Send an Email" utility links.
- **Real proof:** 5.0 from 26 Google reviews; 145 real project photos in the gallery, including one before-and-after pair (`Rear-view-before.jpg` and `Rear-view-after.jpg`) and `After-2.jpg`.
- **SEO skeleton:** 12 service pages, 4 town pages, consistent exact-match contextual links in body copy (for example "house extensions" goes to `/house-extensions/`), and town names in body copy linking to `/area/` pages.

## 5. Patterns to retire

**Heading order and structure**
- On 21 of 22 pages a banner H2 (the page name) sits above the H1. On the home page the H1 starts 793px down at 390 wide, under the cookie banner, and 1,009px down at 1440, so it is not on the first screen at either width.
- The five extension pages go H1 then H3, skipping H2.
- Twelve H2s on the home page are just numbers, "01" to "12" (Section 9.F index numbering).

**Template tells (Elementor)**
- Twelve identical service cards, each with the same coral arrow tile, which carries no meaning.
- A decorative bar under every heading.
- Six image-and-text sections in a row on the home page: four left/right splits and two text-over-photo-pair blocks. The Section-Layout-Repetition ban allows each layout family once per page.
- Pure black text and a pure black footer (9.A).
- The hero headline runs to 3 lines on a phone (cap 2). The subtext is 32 words over 6 lines (cap 20 words, 4 lines) and repeats the business name after a pipe.
- At 114px on desktop and 161px on mobile, the header is over the 80px cap.

**Dashes**
47 em-dashes and 33 en-dashes appear in visible on-page text across the 22 pages. They are in 13 keyword H2s, the hero subtext, body copy, the shared Contact block and 3 in the privacy policy. Section 9.G bans all of them; see the conflicts in section 8.

**Copy**
- A typo in the shared Contact block on every page: "Looking for as local carpenter".
- An image named and captioned "Internal remodeeling of buffer unit".
- Inconsistent casing:
  - nav: "Carpentry services", "Media walls" and "Kitchen fitting" next to "House Extensions"
  - banner headings: "contact Us", "Areas we Cover"
  - titles: "Contact us", "Kitchen fitting", "Media walls", "Carpentry services"
- The `/testimonials/` meta description is a scraped body excerpt with a missing space ("...Suffolk.Read what...") and a repeated title.

**Imagery**
- Six Microsoft Copilot AI renders (`Copilot_20260906_*.jpg`) are shown next to real work. Two are on the home page, including the timber-clad extension at dusk in the Wrap and Timber section. All six are on `/wrap-around-extensions/`, one of them as its share image. Homeowners comparing builders will take these for Gary's jobs, which is the opposite of "the work sells itself".
- Alt text: 146 of 154 photo `<img>` tags use the business name or a keyword template ("Gary J Potter | House Extensions", "Bespoke Wrap Around Extensions" six times on one page). None describes the photo.
- The site photos are WhatsApp-compressed exports (`IMG-2025...-WA0xxx.jpg`).

**Reviews**
The Elfsight widget loads late from a third-party script. On a phone its first slide is an "AI-Generated Summary" card that cuts off at "Gary is pr", so no customer's words are visible without tapping the arrow. The /testimonials/ page has no testimonials of its own beyond that widget.

**Footer "Find us" block**
Flagged; I will not remove it without your approval. It is a heading over a closed accordion, also labelled "Quick Links", holding **56 links** of the form "<Service> <Town>": the 12 services crossed with the 4 towns, with kitchen spraying getting 12 variants. All 56 point to the same 12 service URLs; **none points to the `/area/` town pages** the anchors describe. Google's spam policies name "blocks of text that list cities and regions that a webpage is trying to rank for" as keyword stuffing, and this block appears on all 22 pages. A replacement is proposed in Step 2.

**Broken or awkward**
- The "Services" nav parent links to `#`, so on a phone tapping it does nothing.
- The footer Privacy Policy link has no trailing slash and gets a 301.
- On mobile the WhatsApp button sits on top of the cookie banner's Reject and Accept All buttons.
- The cookie banner covers the bottom 28% of the first phone screen.
- The same form is repeated on the privacy policy page.

**Performance**
These are lab numbers from this container through a proxy, so indicative rather than field data.
- Home page on mobile: 97 requests, about 3.2 MB, 35 script requests, 13 third-party hosts.
- LCP about 4.9 s; the LCP element is the hero background slideshow. CLS 0.
- Two font CDNs and three icon fonts; jQuery, Elementor runtime, reCAPTCHA, Elfsight, Clarity and GTM.

**SEO details**
- `og:type` is "article" on every page, the home page included.
- `og:image` is missing on 8 pages: contact, testimonials, gallery, privacy and all 4 town pages.
- Structured data is AIOSEO's generic Organization, WebSite, WebPage and BreadcrumbList. There is no LocalBusiness, no address or areaServed, no opening hours and no FAQPage.

## 6. Dial reading of the current site

| Dial | Reading | Why |
|---|---|---|
| `DESIGN_VARIANCE` | **3** | Centred hero, symmetric equal three-up card grid, one alternating split layout repeated six times. The coral offset frame is the only off-grid gesture. |
| `MOTION_INTENSITY` | **2** | A background crossfade in the hero, lazy-load fades and a manual review carousel. No scroll-linked or entrance choreography, no hover feedback beyond colour. |
| `VISUAL_DENSITY` | **6** | About 1,100 words of body copy on the home page, three passes over the same services, standard section padding, long paragraphs at 16px. |

## 7. SEO baseline

**Ranking pages: not measured.** I have no Search Console or rank-tracking access, so I cannot say which pages rank or for what. To protect the pages that matter, I'd like a Search Console export (Performance, Pages and Queries, last 16 months) before Step 3.

**Indexing:**
- AIOSEO sitemaps (`/sitemap.xml` index, plus `page-sitemap.xml` and `area-sitemap.xml`) list the 22 URLs. `robots.txt` allows everything except `/wp-admin/` and search.
- Robots meta is `max-image-preview:large`.
- Redirects: `http://garyjpottercarpentry.co.uk/` goes to `https://garyjpottercarpentry.co.uk/` and then to `https://www...` (two hops). URLs without a trailing slash 301 to the slashed version.
- No 4xx on any internal link.

**Anchors:**
- Body copy uses exact-match service anchors on most pages.
- A shared Contact block repeats about 6 links on every page.
- The home, contact, testimonials and gallery pages link the four town names to `/area/` pages.
- The town pages are reachable from the footer Quick Links and `/areas-we-cover/`, never from the nav.

**Titles and H1s.** Kept verbatim under your SEO constraint.

| URL | Title tag | H1 | Banner H2 above H1 | og:image |
|---|---|---|---|---|
| `/` | Gary J Potter Carpentry & Construction \| Crafted with care, built to last | Crafted Carpentry & Construction Across Cambridgeshire & Suffolk | Gary J Potter Carpentry & Construction | yes |
| `/contact-us/` | Contact us \| Gary J Potter Carpentry & Construction | Contact Gary J Potter Carpentry & Construction | contact Us | **missing** |
| `/testimonials/` | Testimonials \| Gary J Potter Carpentry & Construction | Testimonials \| Gary J Potter Carpentry & Construction | Testimonials | **missing** |
| `/gallery/` | Gallery \| Gary J Potter Carpentry & Construction | Gallery \| Gary J Potter Carpentry & Construction | Gallery | **missing** |
| `/areas-we-cover/` | Areas We Cover \| Gary J Potter Carpentry & Construction | Areas We Cover \| Gary J Potter Carpentry & Construction | Areas we Cover | yes |
| `/wrap-around-extensions/` | Seamless Wrap Around Extensions \| Gary J Potter Carpentry & Construction | Wrap Around Extensions \| Ely, Bury St Edmunds, & Newmarket | Wrap Around Extensions | yes |
| `/extension-builder/` | Experienced Extension Builder \| Gary J Potter Carpentry & Construction | Extension Builder \| Ely, Bury St Edmunds, & Newmarket | Extension Builder | yes |
| `/timber-framed-extensions/` | Stylish Timber Framed Extensions \| Gary J Potter Carpentry & Construction | Timber Framed Extensions \| Ely, Bury St Edmunds, & Newmarket | Timber Framed Extensions | yes |
| `/single-storey-extensions/` | Professional Single Storey Extensions \| Gary J Potter Carpentry & Construction | Single Storey Extensions \| Ely, Bury St Edmunds, & Newmarket | Single Storey Extensions | yes |
| `/double-storey-extensions/` | Expert Double Storey Extensions \| Gary J Potter Carpentry & Construction | Double Storey Extensions \| Ely, Bury St Edmunds, & Newmarket | Double Storey Extensions | yes |
| `/kitchen-fitting/` | Kitchen fitting \| Gary J Potter Carpentry & Construction | Kitchen Fitting in Ely, Newmarket, Bury St Edmunds & Cambridge | Kitchen Fitting | yes |
| `/local-carpenter/` | Local Carpenter \| Gary J Potter Carpentry & Construction | Local Carpenter: Ely, Newmarket, Bury St Edmunds & Cambridge | Local Carpenter | yes |
| `/kitchen-spraying/` | Kitchen Spraying – Expert Kitchen Unit & Cabinet Spraying \| Gary J Potter Carpentry & Construction | Kitchen Spraying - High-Quality Spraying for Kitchens | Kitchen Spraying | yes |
| `/house-extensions/` | House Extensions \| Gary J Potter Carpentry & Construction | House Extensions in Cambridgeshire & Suffolk \| Gary J Potter | House Extensions | yes |
| `/garage-conversions/` | Garage Conversions \| Gary J Potter Carpentry & Construction | Garage Conversions \| Ely Newmarket Bury St Edmunds Cambridge | Garage Conversions | yes |
| `/carpentry-services/` | Carpentry services \| Gary J Potter Carpentry & Construction | Carpentry Services in Cambridgeshire & Suffolk | Carpentry Services | yes |
| `/privacy-policy/` | Privacy Policy \| Gary J Potter Carpentry & Construction | Privacy Policy | none | **missing** |
| `/media-walls/` | Media walls \| Gary J Potter Carpentry & Construction | Media Walls in Ely, Newmarket, Bury St Edmunds & Cambridge | Media Walls | yes |
| `/area/newmarket/` | Newmarket \| Gary J Potter Carpentry & Construction | Local Carpenter & Building Services in Newmarket | Newmarket | **missing** |
| `/area/ely/` | Ely \| Gary J Potter Carpentry & Construction | Local Carpenter & Construction Services in Ely | Ely | **missing** |
| `/area/cambridge/` | Cambridge \| Gary J Potter Carpentry & Construction | Local Carpenter & Construction Services in Cambridge | Cambridge | **missing** |
| `/area/bury-st-edmunds/` | Bury St Edmunds \| Gary J Potter Carpentry & Construction | Bespoke Carpenter & Construction Services \| Bury St Edmunds | Bury St Edmunds | **missing** |


**Meta descriptions (verbatim)**

| URL | Meta description |
|---|---|
| `/` | Gary J Potter Carpentry & Construction experts in house extensions, kitchens, garage conversions & media walls across Ely, Newmarket, Bury St Edmunds & Cambridge. |
| `/contact-us/` | Contact Gary J Potter Carpentry & Construction. Call 07415 216223 or email info@garyjpottercarpentry.co.uk for bespoke carpenter & building services. |
| `/testimonials/` | Testimonials Hear from our customers — trusted carpentry & construction services across Cambridgeshire & Suffolk.Read what our clients say, then call 07415 216223 to start your own project. Testimonials \| Gary J Potter Carpentry & Construction At Gary J Potter Carpentry & Construction, we believe the best measure of our work is the feedback from |
| `/gallery/` | View the gallery of Gary J Potter Carpentry & Construction. House extensions, garage conversions, kitchens, media walls & bespoke carpentry across Cambridgeshire. |
| `/areas-we-cover/` | Covering Ely, Newmarket, Bury St Edmunds, Cambridge & surrounding areas. Expert carpentry, kitchens, house extensions, garage conversions & media walls. |
| `/wrap-around-extensions/` | Gary J Potter Carpentry & Construction offers professional wrap around extensions. Providing seamless extensions built around you. Contact us for a free quote. |
| `/extension-builder/` | Gary J Potter Carpentry & Construction is a professional extension builder. Creating bespoke extensions for homeowners. Contact us and extend your home. |
| `/timber-framed-extensions/` | Gary J Potter Carpentry & Construction offers professional timber framed extensions. Building extensions from long-lasting timber. Contact us for a free quote. |
| `/single-storey-extensions/` | Gary J Potter Carpentry & Construction offers expert single storey extensions. Extending the ground floor of your home for more space. Contact us for more. |
| `/double-storey-extensions/` | Gary J Potter Carpentry & Construction offers professional double storey extensions. Extending both floors of your home for more living space. Contact us today. |
| `/kitchen-fitting/` | Professional kitchen fitting in Ely, Newmarket, Bury St Edmunds & Cambridge. Bespoke kitchens, units, doors, worktops & islands installed with expert care. |
| `/local-carpenter/` | Looking for a reliable local carpenter in Ely, Newmarket, Bury St Edmunds or Cambridge? Bespoke joinery, wardrobes, shelving, kitchens & media walls – built with care. |
| `/kitchen-spraying/` | Gary J Potter Carpentry & Construction is a local carpenter offering durable kitchen spraying for homeowners looking for a stylish finish for their kitchen. |
| `/house-extensions/` | Trusted builders for house extensions in Ely, Newmarket, Bury St Edmunds & Cambridge. Brick and timber extensions, trusses, cladding & full design-to-completion service. |
| `/garage-conversions/` | Garage conversions in Ely, Newmarket, Bury St Edmunds & Cambridge. Expert carpentry, design-to-completion service – offices, bedrooms, gyms & more. |
| `/carpentry-services/` | Bespoke carpentry services & renovation experts in Ely, Newmarket, Bury St Edmunds & Cambridge. Joinery, extensions, kitchens & media walls crafted with care. |
| `/privacy-policy/` | Privacy Policy for Gary J Potter Carpentry & Construction |
| `/media-walls/` | Bespoke media walls designed & built in Ely, Newmarket, Bury St Edmunds & Cambridge. Stylish TV walls with storage, shelving & hidden wiring – crafted with care. |
| `/area/newmarket/` | Carpentry & construction company in Newmarket. Local experts in house extensions, garage conversions, kitchens, media walls & bespoke carpentry. |
| `/area/ely/` | Trusted carpentry & construction company in Ely. House extensions, garage conversions, kitchens, media walls & bespoke carpentry – built with care. |
| `/area/cambridge/` | Carpentry & construction company in Cambridge. Local experts in house extensions, garage conversions, kitchens, media walls & bespoke carpentry. |
| `/area/bury-st-edmunds/` | Carpentry & construction company in Bury St Edmunds. Bespoke carpentry, kitchens, media walls, garage conversions & house extensions delivered with care. |


**H2s containing a dash character (protected wording):**

- `/` H2: Gary J Potter Carpentry & Construction — Your Local Extension Builder
- `/area/newmarket/` H2: Single Storey Extensions in Newmarket – Create Space That Fits Your Lifestyle
- `/area/newmarket/` H2: Wrap Around Extensions in Newmarket – Unlock More From Your Home
- `/area/newmarket/` H2: Timber Framed Extensions in Newmarket – Enjoy Flexible, Efficient Space
- `/area/ely/` H2: Single Storey Extensions in Ely – Create More Space Without Moving
- `/area/ely/` H2: Wrap Around Extensions in Ely – Make Every Corner Work Harder
- `/area/ely/` H2: Timber Framed Extensions in Ely – Build Beautiful Space Efficiently
- `/area/cambridge/` H2: Single Storey Extensions in Cambridge – Make Your Home Work Harder
- `/area/cambridge/` H2: Wrap Around Extensions in Cambridge – Give Your Ground Floor New Purpose
- `/area/cambridge/` H2: Timber Framed Extensions in Cambridge – Create More Without Compromise
- `/area/bury-st-edmunds/` H2: Single Storey Extensions in Bury St Edmunds – Give Your Home Room to Breathe
- `/area/bury-st-edmunds/` H2: Wrap Around Extensions in Bury St Edmunds – Reimagine Your Ground Floor
- `/area/bury-st-edmunds/` H2: Timber Framed Extensions in Bury St Edmunds – A Flexible Way to Expand

## 8. Conflicts between the brief and the skill that need your call in Step 2

1. **Em-dash ban vs. protected H2 wording.** 13 keyword H2s contain a dash (1 em, 12 en; listed above). I propose keeping every word and replacing the dash with a colon. The site already does this in "Double Storey Extensions: Twice the Space Without Moving".
2. **Dashes in titles and meta descriptions.** One title (`/kitchen-spraying/`) and five meta descriptions contain a dash. They are not visible on the page, but your constraint keeps them verbatim. I propose recording them as accepted exceptions in the Step 4 em-dash audit; otherwise that audit fails.
3. **Privacy policy.** It has 3 em-dashes, and Section 11.F forbids silent changes to legal copy. Same choice: an accepted exception, or approve a punctuation-only change.
4. **Body copy.** I propose punctuation-only edits (comma, colon or full stop in place of the dash) with no change to wording or links.
5. **Typo and casing.** Fixing "as local carpenter" to "a local carpenter" is a body-copy change. The nav casing ("Carpentry services" and others) is a nav label change, protected under 11.F.
6. **One accent colour (4.2) vs. a two-colour brand.** Blue and coral both carry the brand.
7. **Dark mode (6.C and 8).** The skill expects dual mode; the brand is light only today.
8. **Stack (3.A).** The skill defaults to React or Next, Tailwind v4 and Motion; this repo is Astro, static, on Cloudflare.
9. **Form backend.** Forminator posts to WordPress. On Cloudflare the same field names need a Worker endpoint, an email provider and a reCAPTCHA replacement (Turnstile).
10. **Reviews.** Replace the Elfsight widget with the real review text set in the page (needs your OK to reuse it), or keep the widget.
11. **The six Copilot images.** Retiring them leaves `/wrap-around-extensions/` without pictures until real ones are chosen.

## 9. What I need from you

- Search Console export (pages and queries).
- Google Business Profile: the exact name, phone, whether it shows a street address or is a service-area business, its categories, opening hours and the profile URL.
- Permission to quote Google reviews on the site, or the review text you would like used.
- Original-resolution photos if you have them; the site copies are WhatsApp-compressed. Any other before-and-after pairs beyond the rear-view one.
- The email address form submissions should go to.
