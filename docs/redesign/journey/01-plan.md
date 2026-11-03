# Motion journey, Step 1. Plan (before building)

**Status:** approved by the owner on 3 November 2026 ("Please implement these suggestions in a new PR and merge. Consider exciting palettes to contrast the pages."). Built and audited: see `04-step4-audits.md`.

Governing rules: `design-taste-frontend-v2-experimental` (Sections 1, 4.11, 5, 6, 7 and 14).
Interactive mock-ups, with a design note for each moment: https://claude.ai/artifact/15DNnY16uZkQfaww8K4pSE (private to the owner until shared).

## The brief

- **The problem:** the page is informative but busy.
- **The aim:** visitors should feel this is not an ordinary builder. The page should be premium, demand attention and lead people on a journey of discovery.
- **Keep:** the scroll-driven before/after reveal.
- **Mobile:** design for phones first.
- **The call to action:** every path ends on one that is more than "submit a form".

## The journey: seven chapters, one feeling each

| # | Chapter | Feeling | Signature motion |
|---|---|---|---|
| 1 | Arrival | Intrigue | **Shutter reveal:**<br>- nine louvres turn open;<br>- the photo (later a 10s film) settles;<br>- a coral chalk line snaps under the name;<br>- the H1 rises letter by letter.<br>Plays once per visit, 1.6s. |
| 2 | Promise | Trust | "Craftsmanship you can see, with reliability you can feel." lights up word by word with the scroll. The four real figures roll in like an odometer. |
| 3 | Transformation | Wonder | The kept before/after, now in three acts: **Before**, then **the plan**, then **After**.<br>- The plan is line art drawn over the old house by a coral scan line, made from the real "after" photo at build time.<br>- Then the finished photo sweeps in.<br>- The scene is pinned.<br>- The page's one theme change happens here: day turns to slate (Section 4.11 allows one deliberate switch). |
| 4 | Craft | Desire | **One window, four crafts.** A pinned window wipes between the four main services:<br>- each name rolls in letter by letter;<br>- a progress line fills.<br>Tapping Explore morphs the photo into the service page (shared-element View Transition). |
| 5 | Process | Confidence | **"From first sketch to final polish."**<br>- Each stage photo develops from a line drawing into the real photograph.<br>- A coral thread draws down the page, linking the stages.<br>- All copy comes from the existing site. |
| 6 | Proof | Reassurance | The stars fill one by one. Three reviews sit as a deck you flick through with your thumb, or with the "Next review" button. |
| 7 | Invitation | Action | The "Start your project" pill travels with the visitor from the hero and lands here as the big button.<br>- The brief grows out of the button.<br>- Five tappable steps: project, place, timing, photos, contact.<br>- Then a project brief assembles and is stamped "Received". |

Below the Invitation, "The detail" holds today's long home copy, folded in accordions. It stays on the page in the HTML, for search engines.

## Mobile first

- **Scrolling:** native scroll drives every scene, with no scroll-jacking on touch. Smooth scrolling is desktop-only and optional.
- **Thumb zone:** the call to action lives there all the way down, and Call is always one tap away.
- **Screen fit:**
  - Each chapter fits in one or two screens.
  - Every pinned scene is tested from 360×640 up.
- **What animates:** only transform, opacity and clip-path.

## Motion system

- **Three speeds:**
  - feedback: 160 to 240ms;
  - reveals: 600 to 900ms;
  - cinematic moments: 1.2 to 1.6s.
- **Easing:**
  - expo-out for arrivals;
  - ease-in-out for morphs;
  - linear for anything tied to the scroll.
- **One signature per chapter.** Nothing loops except the hero film.

## Film

There is no footage yet. A half-day shoot with a phone on a gimbal covers the hero loop. A fixed timelapse camera on the next extension would feed a scroll-scrubbed build film in the Transformation chapter.

Shot list:
1. Low sun across a finished room.
2. A saw through timber.
3. A level on a stud wall.
4. A roof lantern with clouds.
5. Bifolds opening.
6. Gary walking the plans on site.
7. The timelapse.

Specification:
- Loops of 10 to 12 seconds, silent, under 2.5 MB each.
- The poster frame loads first.
- The film plays only on screen, and never with reduced motion or Data Saver.

## Under the hood

- **GSAP:** 3.15 is already a dependency. SplitText, Flip, ScrambleText and DrawSVG are now free for commercial use.
- **View Transitions:** Chrome and Edge 126+, Safari 18.2+. Firefox falls back to a normal page load.
- **CSS scroll-driven animations:** Chrome 115+, Safari 26+, Firefox 159+, with GSAP for the pinned scenes.
- **Line art:** generated from real photos at build time. No illustration, no AI imagery.
- **No WebGL in phase one.**

## Budgets and access

- **JavaScript:** under 90 KB compressed on the home page, loaded after first paint and only when motion is allowed.
- **Hero poster:** under 160 KB.
- **Targets:** LCP under 2.5s, INP under 200ms, CLS 0, on a mid-range Android over 4G.
- **Reduced motion:** a still, complete story; every chapter has a static form.
- **Accessibility:** content stays in reading order, and the deck and brief work by keyboard. Contrast is AA in day and slate.
- **The brief:** sends the same six form fields to the same Worker. The project, place and timing go into the message.

## Dials

| Dial | Now | Proposed |
|---|---|---|
| DESIGN_VARIANCE | 7 | 8 |
| MOTION_INTENSITY | 8 | 9 |
| VISUAL_DENSITY (home) | 3 | 2 |

Inner pages stay at density 5.

## Build phases

1. **Foundations:**
   - the seven chapters;
   - the day-to-slate switch;
   - the travelling call to action;
   - the reduced-motion story.
2. **Signature moments:**
   - shutters;
   - the lit promise;
   - before / plan / after;
   - the craft window;
   - the page morph.
3. **Process, proof and the brief.**
4. **Film and launch:**
   - footage;
   - real-device testing;
   - the four Step 4 audits.

## Decisions for the owner

1. The seven-chapter journey, with the long home copy moved into "The detail". It stays on the page, folded.
2. The one theme change: day to slate at the Transformation, staying slate to the end.
3. "Start your project" as the single call to action, replacing the three-button phone bar. Call stays one tap away. **This changes D13.**
4. A half-day film shoot and a timelapse camera on the next extension.
5. The new dials.
6. Whether the brief should offer a site visit. Only if one is offered; it won't be claimed otherwise.

## Research

- [Chrome for Developers: cross-document view transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document)
- [Chrome for Developers: scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
- [Webflow: GSAP becomes free](https://webflow.com/blog/gsap-becomes-free)
- Awwwards inspiration:
  - [scrollytelling experience](https://www.awwwards.com/inspiration/scrollytelling-experience-creativcurrent)
  - [homepage scroll experience](https://www.awwwards.com/inspiration/homepage-scroll-experience-postevand-1-1)
  - [Lago Lago scroll story](https://www.awwwards.com/inspiration/scroll-https-lagolago-nl-en)
