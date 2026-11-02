# GP website

Website rebuild: a visual redesign plus local SEO, tied to the business's Google Business Profile.

- **Framework:** [Astro](https://astro.build) building static HTML (fast, crawlable, no client JS by default)
- **Hosting:** [Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/), configured in `wrangler.jsonc`
- **SEO baseline:** canonical URLs, Open Graph tags, `LocalBusiness` JSON-LD, `sitemap-index.xml` and `robots.txt`, all generated from `src/config/site.ts`
- **Design:** the [`design-taste-frontend`](https://github.com/Leonxlnx/taste-skill) agent skill is installed in `.claude/skills/`

## Local development

Requires Node 22+.

```bash
npm install
```

```bash
npm run dev        # Astro dev server at http://localhost:4321
```

```bash
npm run preview    # build, then serve dist/ through Cloudflare's local runtime (wrangler dev)
```

```bash
npm run check      # type-check .astro and .ts files
```

## Project layout

```
src/config/site.ts            business details (name, phone, email, analytics IDs): edit these first
src/content/pages/*.json      page copy migrated verbatim from the live site (one file per URL)
src/data/                     services, reviews, photo metadata, which photos each page uses
src/assets/photos/            150 real project photos (resized to AVIF/WebP at build time)
src/components/               header, footer, hero, before/after slider, swipe rows, contact form...
src/pages/                    routes: index, [slug] (services, areas, privacy), area/[town], gallery, testimonials, contact-us
src/scripts/site.ts           all client behaviour (reveals, menus, slider, consent, form)
worker/index.ts               Cloudflare Worker: /api/contact form handler, everything else served from dist/
public/_headers, _redirects   security and cache headers; old sitemap URLs redirect to the new one
wrangler.jsonc                Cloudflare Worker config
```

## Deploying to Cloudflare

### Option A: Git integration (recommended)

Cloudflare builds and deploys on every push. Pull requests get preview URLs.

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Import a repository** and choose this repo.
2. Build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Production branch: `main`
3. Once it has deployed, add the real domain under the Worker's **Settings → Domains & Routes → Custom domain**. The domain's DNS has to be on Cloudflare.

The Worker name in Cloudflare must match `name` in `wrangler.jsonc` (`gp-website`).

### Option B: Deploy from your machine

```bash
npx wrangler login
```

```bash
npm run deploy
```

## Before going live

- [ ] Confirm the owner is happy for the Google reviews in `src/data/reviews.ts` to be quoted (decision D15).
- [ ] Add the Google Business Profile link to `googleProfileUrl` in `src/config/site.ts` (shows "Find us on Google" in the footer).
- [ ] Contact form (decision D14):
  - [ ] The domain's DNS is on Cloudflare with **Email Routing** enabled, and `info@garyjpottercarpentry.co.uk` (or the chosen inbox) is a verified destination. Update `MAIL_TO` / `destination_address` in `wrangler.jsonc` if it differs.
  - [ ] Create a Turnstile widget for the domain; put its site key in `turnstileSiteKey` (`src/config/site.ts`) and its secret in the Worker: `npx wrangler secret put TURNSTILE_SECRET`.
  - [ ] Send a test enquiry with a photo attached.
- [ ] Tell me which jobs were wrap-around extensions, so `/wrap-around-extensions/` can show them.
- [ ] Full-resolution originals of the hero and before/after photos, if available (the current ones are 1600px WhatsApp copies).
- [ ] After DNS cutover: submit `/sitemap-index.xml` in Google Search Console (old `/sitemap.xml` redirects to it) and spot-check the 22 URLs.

## Redesign records

- `docs/redesign/01-audit.md`: audit of the live site (Step 1).
- `docs/redesign/02-mode-and-levers.md`: mode, dials, levers and decisions D1 to D20 (Step 2).
- `docs/redesign/copy-edits.md`: every approved change to migrated copy.
- `docs/redesign/baseline.json`: live-site SEO baseline; `scripts/preservation-audit.mjs` diffs the build against it.
- `scripts/copy-edits.json` and `scripts/apply-copy-edits.mjs`: the approved copy edits, applied to `src/content/pages`.
