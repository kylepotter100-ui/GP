// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site.ts';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Production URL. Used for canonical links, Open Graph URLs and sitemap.xml.
  site: site.url,
  // Static HTML output, served by Cloudflare Workers static assets (see wrangler.jsonc).
  output: 'static',
  // One URL per page: /about/ (Cloudflare redirects /about -> /about/ to match).
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
