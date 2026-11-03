# CLAUDE.md

Business website: a redesign for visual quality and local SEO, linked to a Google Business Profile.

## Stack

- Astro 7, static output (`output: 'static'`, `trailingSlash: 'always'`, directory build format)
- Deployed to Cloudflare Workers static assets from `dist/` (`wrangler.jsonc`)
- Node 22+ (`.node-version`)

## Commands

- `npm run dev`: Astro dev server
- `npm run build`: build to `dist/`
- `npm run check`: type-check
- `npm run preview`: build, then serve through `wrangler dev` (closest to production)
- `npx wrangler deploy --dry-run`: validate the Cloudflare config without deploying

## Conventions

- Business details live only in `src/config/site.ts`. Don't hard-code the name, address, phone, hours or URLs in pages; import `site`.
- Every page uses `BaseLayout`, passing `title` and `description`. Page-specific structured data goes in the `jsonLd` prop.
- Name, address and phone must stay character-for-character identical to the Google Business Profile.
- When a URL changes, add a 301 to `public/_redirects`.
- Keep pages static. Add the `@astrojs/cloudflare` adapter only if a feature needs server code (e.g. a contact form handler).
- CSS scroll-driven animations (`animation-timeline: view()`): write them as longhands (`animation-name`, `-timing-function`, `-fill-mode`, `-timeline`), never the `animation` shorthand. The minifier folds the timeline into the shorthand, which browsers reject. Clip their ancestors with `overflow: clip`, not `hidden`: `hidden` creates a scroll container that freezes the timeline.
- `npm run audit` (em-dash and preservation audits) runs in CI and must report 0 unapproved changes.

## Design work

The only source of design rules for this project is `design-taste-frontend-v2-experimental` (`.claude/skills/design-taste-frontend-v2-experimental`, from Leonxlnx/taste-skill-classics). It is opt-in and must be invoked by name. Section numbers in briefs (11.B audit, 11.D levers, 14 Pre-Flight) refer to it.
The `design-taste-frontend` (v2) skill is also installed but is not used for this project.

The redesign runs in gated steps, each waiting for the owner's OK: audit (`docs/redesign/01-audit.md`), mode and levers, implementation, then the em-dash, Pre-Flight, preservation and brand-fidelity audits.
A second round, a **complete overhaul** (new colours and motion, premium landing page), runs the same gated steps in `docs/redesign/overhaul/`. It supersedes the Preserve-mode design in `docs/redesign/01`, `02` and `04`.
A third round, the **motion journey** (a seven-chapter home page journey ending in a "Start your project" brief, with deep stage palettes per chapter and per page), is in `docs/redesign/journey/`: plan in `01-plan.md`, approved and built, audited in `04-step4-audits.md`.
Stage palettes: a section with `data-stage="slate|ink|sage|aubergine"` switches every colour token inside it; `src/scripts/stage.ts` moves the page ground, header and footer between them. Each page goes "lights down" once, then stays in its dark tones to the end (Section 4.11).
The enquiry form is `ProjectBrief.astro`: keep its six field names and their order; the choice steps write into `textarea-1`. Line drawings for "the plan" come from `npm run line-art`.
`docs/redesign/baseline.json` is the live-site baseline (titles, descriptions, canonicals, headings, body links, nav, form fields). Diff against it for the preservation audit; don't edit it.
