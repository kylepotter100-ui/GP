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

## Design work

The only source of design rules for this project is `design-taste-frontend-v2-experimental` (`.claude/skills/design-taste-frontend-v2-experimental`, from Leonxlnx/taste-skill-classics). It is opt-in and must be invoked by name. Section numbers in briefs (11.B audit, 11.D levers, 14 Pre-Flight) refer to it.
The `design-taste-frontend` (v2) skill is also installed but is not used for this project.

The redesign runs in gated steps, each waiting for the owner's OK: audit (`docs/redesign/01-audit.md`), mode and levers, implementation, then the em-dash, Pre-Flight, preservation and brand-fidelity audits.
`docs/redesign/baseline.json` is the live-site baseline (titles, descriptions, canonicals, headings, body links, nav, form fields). Diff against it for the preservation audit; don't edit it.
