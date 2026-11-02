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
src/config/site.ts        business details (NAP, hours, URLs): edit these first
src/components/SEO.astro  <head> tags and JSON-LD structured data
src/layouts/BaseLayout.astro
src/pages/                one file per route; robots.txt.ts generates /robots.txt
public/_headers           security and cache headers on Cloudflare
public/_redirects         301s from old URLs (add these when the redesign changes paths)
wrangler.jsonc            Cloudflare Worker config
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

- [ ] Fill in `src/config/site.ts` with the real business details. Name, address and phone must match the Google Business Profile exactly.
- [ ] Set `site.url` to the production domain (it drives the canonical URLs and the sitemap).
- [ ] Set `businessType` to the most specific [schema.org type](https://schema.org/LocalBusiness#subtypes).
- [ ] Add a 1200×630 share image to `public/` and point `ogImage` at it.
- [ ] Add 301s in `public/_redirects` for any URL on the old site that changes.
- [ ] Add the site to [Google Search Console](https://search.google.com/search-console) and submit `/sitemap-index.xml`.
- [ ] Put the website URL on the Google Business Profile, and put the Profile's Maps link in `sameAs` and `googleMapsUrl`.
- [ ] Check the structured data with Google's [Rich Results Test](https://search.google.com/test/rich-results).
