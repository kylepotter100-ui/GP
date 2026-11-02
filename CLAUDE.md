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

For any visual design, redesign or page-building work, use the `design-taste-frontend` skill (`.claude/skills/design-taste-frontend`).
Run its scripts from the repo root, so its working files land in `.taste-skill/`. Commit `.taste-skill/direction.json`; screenshots are gitignored.
In the cloud container its browser checks use `CHROME_PATH`, which is set in `.claude/settings.json`.
