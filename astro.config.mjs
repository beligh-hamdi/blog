// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The canonical production URL. Used for absolute URLs in sitemap.xml,
// the RSS feed, and canonical/OpenGraph tags. Override per-environment with
// the SITE_URL env var (set this in your deploy target before going live).
const SITE_URL = process.env.SITE_URL ?? 'https://blog.beligh.example';

// Sub-path the site is served under. Leave as '/' for a root/custom domain
// (Cloudflare Pages, Netlify). For a GitHub Pages *project* site served at
// https://<owner>.github.io/<repo>/, set BASE_PATH=/<repo>/ in CI.
const BASE_PATH = process.env.BASE_PATH ?? '/';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  integrations: [
    sitemap({
      // Internal editorial tooling (/admin/*, /editorial) should never appear in
      // the sitemap or be indexed by crawlers.
      filter: (page) => !page.includes('/admin/') && !page.includes('/editorial'),
    }),
  ],
});
