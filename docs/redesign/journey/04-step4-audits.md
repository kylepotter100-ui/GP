# Motion journey, Step 4. Audits

Governing rules: `design-taste-frontend-v2-experimental` (Sections 4.10, 4.11, 5, 6, 9.G, 11, 14).
Plan: `01-plan.md`. On 3 November 2026 the owner said: "Please implement these suggestions in a new PR and merge. Consider exciting palettes to contrast the pages."
Screenshots of the result are in `after/`.
Built site checked through `wrangler dev` (the production Worker locally):
- widths 360 to 1920 px;
- light and dark themes;
- reduced motion.

| Audit | Result |
|---|---|
| Em-dash audit | **Pass.** 0 on any page. The only dashes are the same title and meta exceptions as before (D2, C4). |
| Pre-Flight Check (Section 14) | **Pass.** Every box ticked or not applicable (section 2). |
| Preservation audit | **Pass. 0 unapproved changes.**<br>- URLs, H1s, form field names and order, and body link anchors are unchanged.<br>- The nav and heading changes are the ones approved before (D1, D6, D7, D8, D14, D17, D19). |
| Brand fidelity audit | **Pass.** Coral `#F07957`, Cinzel with Open Sans, and the untouched logo PNG on its light plate. |

## 1. What was built

### The home page: seven chapters

| # | Chapter | Stage colour | Motion |
|---|---|---|---|
| 1 | Arrival | Day | **Shutter intro**, once per visit:<br>- nine shutters open;<br>- a coral chalk line snaps under the name;<br>- the H1 rises letter by letter.<br>All CSS from first paint, so nothing waits for script. |
| 2 | Promise | Day | The line lights up word by word, tied to the scroll. The four real figures roll in like an odometer. |
| 3 | Transformation | **Slate** (the lights go down) | The pinned before/after, in three acts:<br>- **Before**;<br>- **The plan**: a line drawing of the finished extension, drawn over the old house by a coral scan line;<br>- **After**: the photo sweeps in behind the handle.<br>The drag slider stays; a drag hands control to the visitor. |
| 4 | Craft | **Ink** | **One window, four crafts**, pinned:<br>- each service rises in with a curtain wipe and a counter-zoom;<br>- its name rolls in letter by letter;<br>- the progress line fills.<br>Tapping a service morphs its photo and name into the service page (cross-document view transition). The other eight services follow as an index. |
| 5 | Process | **Sage** | "From first sketch to final polish." Each stage develops from a line drawing into the photograph, and a coral thread draws down the page. |
| 6 | Proof | **Aubergine** | The stars fill one by one. Three reviews form a deck: flick it with a thumb, or use Next review. |
| 7 | Invitation | **Slate**, with a coral card | The travelling "Start your project" pill lands on the card's button. The brief grows out of whichever button opened it. |

**After the Invitation:** "The detail" holds today's long home copy in folded sections. It is still on the page with every link: the four service cards, About, the builder story, the four extension types and Local Carpenter.

### Palettes: "exciting palettes to contrast the pages"

**The four stage hues** are drawn from the photographs:

| Hue | Value | Taken from |
|---|---|---|
| Slate | `#14191E` | render and sky |
| Ink | `#0E1A2C` | the navy kitchen island |
| Sage | `#12221C` | the green media wall |
| Aubergine | `#1B1424` | dusk through a roof lantern |

How they behave:
- **Mapping:** a `data-stage` section switches every colour token inside it, so existing components render in that hue.
- **The morph:**
  - As the visitor scrolls, the page ground, header and footer move smoothly from one hue to the next.
  - The morph is driven by ScrollTrigger, never a scroll listener.
  - With reduced motion it changes in one step.
- **Contrast:** every pairing passes AA:
  - body text 14.6:1 or better;
  - muted text 5.6:1 or better;
  - coral 5.1:1 or better.

**Pages now contrast with one another.** Each page's "lights down" sections take its own tone:

| Tone | Pages |
|---|---|
| Slate | extensions, towns and areas, privacy |
| Ink | kitchens, garage conversions, contact |
| Sage | media walls, carpentry, local carpenter |
| Aubergine | gallery and testimonials |

**One accent.** Coral stays the only accent. The invitation's coral card is a call-to-action element, not a section colour.

### "Start your project": the brief

The brief is five tappable steps:
1. what are we building (photo tiles);
2. where;
3. when;
4. contact details;
5. photos and a note.

**Same form underneath:**
- the same six field names in the same order;
- the same Worker and the same email.

The three choices are written into the message. Without script it is the plain form.

**When sent,** a "Project brief" ticket is filled in and stamped "Received".

**Where it opens:**
- on most pages, as a full-screen sheet that grows out of the tapped button and shrinks back into it;
- on the contact page, in the page.

### The travelling call to action

The pill replaces the three-button phone bar (D13, replaced at the owner's request). It shows "Start your project" with Call one tap away.
- It appears once the hero's own buttons have scrolled away.
- It lands on the invitation's button.
- Pages without the brief send it to the contact page.

### Supporting changes

- **Line drawings:** `scripts/line-art.mjs` (`npm run line-art`) makes them from the real photos (edge detection in sharp). The files are 20 to 110 KB each, greyscale WebP, laid over the photo with a screen blend.
- **Hero film:** the hero accepts a silent loop of real work (`video`). The photo stays as its poster. The film plays only on screen and never with reduced motion. No footage exists yet.
- **Removed (replaced):**
  - the sticky phone bar;
  - the services stack;
  - the old contact form and contact section;
  - the photo marquee.

## 2. Pre-Flight Check (Section 14)

Dials:
- DESIGN_VARIANCE 8;
- MOTION_INTENSITY 9;
- VISUAL_DENSITY 2 on the home page, 5 on inner pages.

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 to 4 | Brief inference, dials, design system, redesign audit | Pass | See `01-plan.md` and the overhaul documents. |
| 5 | Zero em-dashes on the page | Pass | `npm run audit`: 0 on all 23 pages. |
| 6 | Page Theme Lock | Pass | Each page has one theme until its single "lights down" moment (the 4.11 exception, a deliberate switch with a strong transition). From there, every section is a tint of the dark family. The coral invitation card is an element. Overlays (menu, cookie banner, lightbox, brief sheet) are not sections. |
| 7 | Colour Consistency Lock | Pass | Coral is the one accent on every stage. The stamp uses a darker coral so its text reads on the plaster ticket (5.1:1). |
| 8 | Shape Consistency Lock | Pass | Square corners throughout. |
| 9 to 11 | Button, CTA wrap and form contrast | Pass | Ink on coral is 6.4:1. Light text on the ink button is 15.6:1. Form labels and inputs pass on every stage. The full review found 0 contrast failures. |
| 12, 13 | Serif discipline; palette family | Pass | Cinzel is the brand serif. The stage hues are slate, ink, sage and aubergine, not the beige, brass, oxblood and espresso family. |
| 14 | Italic descenders | Not applicable | No italics. |
| 15 to 17 | Hero fits, top padding, stack | Pass | Display line at most 2 lines. Subtext at most 18 words and 4 lines. Both CTAs visible from 360×640 up. 80px top padding. Four text elements. |
| 18 | Eyebrow count | Pass | No uppercase tracked labels. |
| 19, 20 | Split header, zigzag | Pass | Headings stack over their text; the reviews header pairs a heading with its button. |
| 21 | Duplicate CTA intent | Pass | One label per intent: "Start your project", "Call Us" ("Or call us on…"), "Read the reviews", "Explore". |
| 22 to 24, 30 | Logo walls, bento | Not applicable | |
| 25 | Copy self-audit | Pass | Section 3. |
| 26 | Motion motivated | Pass | One reason per chapter (section 1). |
| 27 | One marquee at most | Pass | None. |
| 28 | Nav on one line, 80px at most | Pass | 72px desktop, 64px phone. |
| 29 | Layout repetition | Pass | Every chapter is a different layout family. |
| 31 to 45 | Lists, real images, no tells | Pass | Real photos only. Labels sit off the images. No numbering, dots or decorative strips. |
| 46 | Content density | Pass | Home density 2. The long copy is folded in "The detail". |
| 47 | Quotes 3 lines at most | Pass | Deck quotes are 3 lines at most from 360 to 1920 px (4 at 320 px). |
| 48 | Motion claimed = shown | Pass | 32 interaction checks (section 5). |
| 49 | Pin per canonical skeleton | Pass | Before/after and craft window: `start: "top top"`, `pin: true`, scrubbed, function-based end, `invalidateOnRefresh`. Two pins at most per page. |
| 50 | No scroll listeners | Pass | ScrollTrigger and IntersectionObserver only. |
| 51 | Reduced motion | Pass | No GSAP, no pins, no shutters. The colour steps. The craft window is a list. The deck changes without movement. |
| 52 | Dark mode in both | Pass | Full review in light and dark. |
| 53, 54 | Mobile collapse; viewport units | Pass | No sideways scroll on any page. `svh` units. |
| 55 to 60 | Cleanup, states, cards, icons, isolation, tells | Pass | `gsap.matchMedia` reverts everything. The brief has validation, sending, failure and success states. Phosphor icons only. |
| 61 | Core Web Vitals | Pass (lab) | Section 4. |
| 62 | One design system | Pass | |

## 3. New strings (copy self-audit)

New lines are written from existing facts in the existing voice.

**Lifted from the existing copy:**
- "From first sketch to final polish."
- "Let’s talk about bringing your ideas to life."
- The four Process lines.
- The four Craft lines.

**The brief:**
- "Start your project";
- "Tell us what you are planning in five quick steps, with photos if you have them.";
- "What are we building?", "Where is the property?", "When would you like to start?", "How do we reach you?", "Show us the space";
- the option labels;
- "Send my brief";
- "Project brief", "Received";
- "Thank you, {name}. Your brief has reached us."

**Labels:**
- "We listen", "We draw it up", "We build it", "We hand it over";
- "Before", "The plan", "After";
- "More services", "The detail", "How we work on our main services";
- "Explore", "Swipe to flick through", "Next review", "Or call us on".

## 4. Performance

Mobile home (lab, local Worker, 390×844):
- **First load:** 349 KB in total, of which script is 53 KB. GSAP loads only when motion is allowed.
- **Paint:** the LCP is the hero photo, at about 0.16s locally.
- **Layout shift:** 0.
- **Line drawings:** lazy, and fetched only when motion is on. 20 to 110 KB each.

## 5. Interaction checks (all pass)

**Arrival:**
- Shutters play on the first page of a visit only, and are gone after the intro.
- The H1 keeps its full text as its accessible name.

**Stage colour:**
- The page colour moves day, then slate, ink, sage, aubergine.
- The header follows it.

**Transformation:** the before/after plays its three acts.

**Craft:**
- The window shows the four services in turn.
- Explore stays clear of the pill.

**Pill and deck:**
- The pill travels mid-page and lands on the invitation.
- The deck flicks by swipe and by button.

**The brief:**
- It opens as a sheet, with focus on step 1.
- The contact step will not continue without a name and email.
- A chosen photo shows as a thumbnail.
- It posts to the Worker (200), and the choices and note arrive in the message.
- The same six field names are sent, in the same order.
- The ticket shows, and the sheet closes and returns scrolling.

**Page morph:** the service hero is the morph target, with no shutters on later pages.

**Page tones:**
- House extensions closes in slate.
- Kitchen fitting closes in ink.

**Without the brief:**
- The privacy page sends "Start your project" to the contact page.
- The contact page shows the brief in the page.

**Reduced motion:**
- No shutters, no GSAP, no pins.
- The services are a plain list.
- The colour steps.
- No page errors.

## 6. Still open

- **Footage:** a half-day shoot and a timelapse camera for the hero film and the Transformation chapter. The hero is ready for a `video` file.
- **Site visits:** the brief does not offer one. It will once you confirm you do them.
- **Earlier items:**
  - the Ely phone link;
  - the kitchen spraying title dash;
  - review-quote permission (D15);
  - the privacy policy's cookie tables;
  - the form's inbox and Turnstile keys.
