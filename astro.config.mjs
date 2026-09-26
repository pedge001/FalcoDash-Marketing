// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

const SITE = process.env.SITE_URL || 'https://falcodash.com';

export default defineConfig({
  site: SITE,
  // Every marketing page is pre-rendered to static HTML at build time.
  // Only the routes that set `export const prerender = false` (the API) run on the server.
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'never',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  security: {
    checkOrigin: true,
    allowedDomains: [
      { hostname: 'falcodash.com', protocol: 'https' },
      { hostname: 'www.falcodash.com', protocol: 'https' },
      { hostname: '**.up.railway.app', protocol: 'https' },
    ],
  },
  image: { responsiveStyles: true },
});
