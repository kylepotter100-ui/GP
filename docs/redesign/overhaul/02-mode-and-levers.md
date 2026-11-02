# Overhaul, Step 2. Mode, dials and modernisation levers

Governing rules: `design-taste-frontend-v2-experimental` (Sections 1, 4, 5, 6, 11).
The owner approved Step 1 "with your recommendations", which settles the four conflicts in `01-audit.md` §7 as recommended (section 2 below).

---

## 1. Mode: Redesign, Overhaul

| Option | Verdict |
|---|---|
| Preserve | No. That was the last round; the brief now asks for new colour and motion design. |
| **Overhaul** | **Yes.** A new visual language on top of the existing content and IA (11.A). Content, URLs, nav labels, form, logo and legal copy are preserved; colour, layout, type usage and motion are new. |
| Greenfield (content preserved) | No. The brand is not changing: the logo, the accent and the type stack all survive (the Step 4 brand-fidelity audit requires it). |

**Design read:** *a complete overhaul of a local trade site into a premium, motion-led landing experience for homeowners aged 35 to 65 on phones, with a cinematic, material, hand-built language, leaning toward scroll-driven and choreographed motion in the existing Astro build, carried by real project photography.*

**Design system (Section 2):** none from 2.A. An honest 2.B aesthetic, "cinematic editorial craft": native CSS through Tailwind v4 tokens, GSAP ScrollTrigger for pinned and scrubbed scenes (the library Sections 5.A and 5.B are written for), CSS and IntersectionObserver for simple reveals.

## 2. The four Step 1 conflicts, settled as recommended

| # | Conflict | Settled as |
|---|---|---|
| C1 | New colours vs. "the brand accent survives" | Coral `#F07957` stays as the single accent, exactly. Everything around it is a new palette (§4.3). The logo's blue stays only inside the logo. |
| C2 | Overhaul vs. "the type stack survives" | Cinzel and Open Sans both stay, used very differently: Cinzel only for monumental display moments; Open Sans for every heading below H1, the nav, buttons and UI. |
| C3 | Logo designed for light grounds | The PNG is untouched and always sits on its own light "plaster" plate, so it shows in its real colours on dark or photographic grounds. |
| C4 | How much copy changes | **Unchanged:** every title tag, meta description, canonical and H1; the service, town and areas body copy and all their contextual links; legal copy. **Home page:** becomes a landing page with new short headlines and section lines written in the existing voice from existing facts (no invented claims); every existing home copy block and its links stays on the page. |

## 3. Dials

| Dial | Current | Overhaul preset (+2 / +2 / match) | **Set to** | Reason |
|---|---|---|---|---|
| `DESIGN_VARIANCE` | 4 | 6 | **7** | Premium consumer preset. Asymmetric grids, overlaps, full-bleed photography, varied ratios. Every layout collapses to one column below 768px. |
| `MOTION_INTENSITY` | 3 | 5 | **8** | The brief asks for more motion design. The 8 to 10 band allows scroll-triggered choreography, scroll-scrubbed scenes and parallax. Held at 8, not 10, for an audience aged 35 to 65 on phones: no infinite loops, no cursor effects, at most two pinned scenes per page. |
| `VISUAL_DENSITY` | 5 to 6 | 5 to 6 | **4** | Home 3 (landing page, large type, full-bleed moments); inner pages 5 (their protected long copy stays, set in a chaptered reading layout). |

## 4. Modernisation levers, in 11.D order

All six apply; in an overhaul, levers 5 and 6 carry most of the change.

### 4.1 Typography refresh
- **Cinzel, display only.** The H1 and a few statement lines, set monumental (up to about 9vw on desktop, 2 lines at most), with wider tracking so the inscriptional capitals breathe. It no longer appears on nav, buttons or small headings.
- **Open Sans for everything else:** H2 to H4 in semibold sentence case, nav and buttons in semibold, body at 17 to 19px with 1.6 leading at 65ch.
- **One very large size and one small size** do the visible work; five sizes at most.

### 4.2 Spacing and rhythm
- **New grid.** A 12-column frame with asymmetric offsets (text on 5 columns against photos on 7, overlapping edges) and full-bleed photo chapters.
- **Section padding** of 96 to 160px on desktop, 64 to 96px on phones.
- **Inner pages:** a chaptered reading layout, with a sticky chapter index beside the article on desktop and an index panel on phones, so the long protected copy reads as chapters rather than a wall.

### 4.3 Colour recalibration: "Slate and Coral"
A new palette from the skill's own alternatives (4.2, Terracotta + Slate: warm coral against cool slate). It is not the beige, brass and espresso family.

| Role | Light mode | Dark mode |
|---|---|---|
| Ground | Plaster `#F2F3F1` | Slate `#14191E` |
| Raised surface | `#E4E7E6` | `#1E252C` |
| Text | `#14191E` | `#EEF1F2` |
| Muted text | `#5A636B` | `#A7AFB6` |
| Accent (kept) | Coral `#F07957`, fills only (ink text 6.4:1) | Coral `#F07957`, fills and large text (6.3:1 on slate) |

- **Both modes** follow the visitor's system setting (Section 6.C). Each page is locked to one theme; photography supplies the drama in both.
- **Blue is retired** from the interface and stays only in the logo.
- **No pure black or white.**

### 4.4 Motion layer (MOTION_INTENSITY 8)
Each move has a reason (Section 5). Everything animates transform and opacity only, uses no scroll listeners, never hides content without script, and collapses to static under reduced motion.

| Move | Where | Why | How |
|---|---|---|---|
| **Scroll-scrubbed before/after** (signature) | Home, and the service pages that have a real pair | Storytelling: the job transforms as you scroll | A pinned scene (`start: "top top"`, scrub): the "before" photo wipes away to the "after". The drag slider stays for control; under reduced motion only the slider remains. |
| Cinematic hero entrance | Every page hero | Hierarchy | The headline rises line by line behind a mask; the photo settles from 1.06 to 1 scale. The photo is visible from the first paint, so the largest image never waits. |
| Services sticky-stack (5.A) | Home | Storytelling | The four main services pin and stack, each card shrinking as the next arrives; on phones, a swipe row. |
| "How we build it" horizontal pan (5.B) | Home | Storytelling, and proof of "all trades in-house" | Real stage photos of one extension (before, groundworks, steel, roof and lantern, finished) pan sideways as you scroll; on phones and under reduced motion, a swipe row. |
| Image clip reveals and photo parallax | Full-bleed and key photos | Hierarchy | Photos open from an inset clip as they enter; large photos drift slightly with the scroll (scrubbed). |
| Staggered section reveals | Every section | Hierarchy | Heading, then copy, then media, 60 to 90ms apart, once. |
| Count-up of real figures | Trust moment | Feedback | 2013, 40+, 5.0, 26 count up once when they enter. |
| Service index image preview | Home and inner pages, desktop | Feedback | Hovering a service name reveals its photo beside the list. |
| Page transitions | Between pages | State change | Native cross-document View Transitions; a plain page load where unsupported. |
| Header behaviour | Site-wide | Feedback | Hides on scroll down, returns on scroll up (ScrollTrigger direction). |
| Button and link feedback | Site-wide | Feedback | Fill wipe on hover, 1px press. |

### 4.5 Hero and key-section recomposition
- **Home, as a premium landing page:**
  1. **Hero:** cinematic full-bleed photo of real work, the protected H1 in monumental Cinzel, one line, Contact Us and Call Us.
  2. **Trust:** a statement moment with the rating and the real figures.
  3. **The signature:** the scroll-scrubbed before/after.
  4. **Services:** the stack.
  5. **How we build it:** the pan.
  6. **Reviews.**
  7. **Recent work.**
  8. **Contact.**

  The existing home copy blocks sit within these sections, with their links.
- **Inner pages:**
  - a full-bleed photo hero with the H1;
  - the chaptered article with a chapter index;
  - a before/after scene where a real pair exists (house extensions, garage conversions, media walls, local carpenter / carpentry services);
  - a service index with image previews;
  - the contact close.
- **Gallery:** projects first (the five before/after pairs and the build sequences), then the filterable grid in varied ratios, with the lightbox kept.

### 4.6 Full block replacement
Practically every block is redrawn (overhaul):
- header with the logo plate;
- footer, with the business name returning at full width;
- reviews;
- gallery;
- contact section, keeping the same form;
- sticky phone bar;
- cookie banner, with the same wording.

Retired: the coral offset rectangle (decorative), the grey section banding, the repeated "Project photos" row, and the Google map iframe loading on every page (replaced by a "Find us on Google Maps" link to the same place).

## 5. Fixed in Step 3 unless you approve otherwise
- URL structure (22 URLs, trailing slashes)
- Primary nav labels, and the header "Call Us" / "Send an Email"
- Form field names and order (`name-1-first-name`, `name-1-last-name`, `email-1`, `phone-1`, `upload-1[]`, `textarea-1`)
- The brand logo file
- Legal copy: the privacy policy and the cookie banner wording
- Per C4: titles, meta descriptions, canonicals, H1s, and inner-page body copy with its links

## 6. Still open (unchanged from before)
- Malformed phone links on the four town pages.
- The privacy policy's outdated cookie tables.
- Permission to quote the Google reviews.
- The form's destination inbox.
