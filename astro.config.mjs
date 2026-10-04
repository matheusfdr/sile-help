import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const site = env.PUBLIC_SITE_URL || 'https://help.sileai.app';

// Static output, the same model as the institutional site (sileai.app): every page is HTML at
// build time, clean URLs without a trailing slash, and only small inline scripts on the client
// (search, mobile menu, tabs, screenshot zoom and feedback).
export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !/\/(404|busca)\/?$/.test(page) }),
  ],
  server: { port: 4400 },
});
