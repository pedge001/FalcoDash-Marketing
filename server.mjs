// Production entry. Wraps Astro's standalone handler to add security and cache headers to every
// response (including pre-rendered pages and assets) and to redirect www → apex.
import http from 'node:http';
import { readFileSync } from 'node:fs';

process.env.ASTRO_NODE_AUTOSTART = 'disabled';
const { handler } = await import('./dist/server/entry.mjs');

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '';
const CANONICAL_HOST = (process.env.SITE_URL ? new URL(process.env.SITE_URL).host : 'falcodash.com').toLowerCase();

// Analytics hosts: Google Analytics 4, Microsoft Clarity, Cloudflare Web Analytics.
const ANALYTICS_SCRIPTS = 'https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms https://static.cloudflareinsights.com';
const ANALYTICS_CONNECT = 'https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.clarity.ms https://c.bing.com https://cloudflareinsights.com';

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://unpkg.com ${ANALYTICS_SCRIPTS}`,
  "style-src 'self' 'unsafe-inline' https://unpkg.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://api.github.com https://unpkg.com ${ANALYTICS_CONNECT}`,
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self' https://github.com",
  'upgrade-insecure-requests',
].join('; ');

const SECURITY = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Content-Security-Policy': CSP,
};

function cacheControl(path) {
  if (path.startsWith('/_astro/')) return 'public, max-age=31536000, immutable';
  if (path.startsWith('/api/') || path.startsWith('/admin')) return 'no-store';
  if (/\.(png|jpe?g|webp|avif|svg|ico|woff2?)$/.test(path)) return 'public, max-age=86400, stale-while-revalidate=604800';
  if (/\.(xml|txt|webmanifest)$/.test(path)) return 'public, max-age=3600';
  return 'public, max-age=0, must-revalidate';
}

const server = http.createServer((req, res) => {
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toString().split(',')[0].trim().toLowerCase();
  const path = (req.url || '/').split('?')[0];

  if (host === `www.${CANONICAL_HOST}`) {
    res.writeHead(301, { Location: `https://${CANONICAL_HOST}${req.url || '/'}` });
    return res.end();
  }
  if (path === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' });
    return res.end('ok');
  }
  if (INDEXNOW_KEY && path === `/${INDEXNOW_KEY}.txt`) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end(INDEXNOW_KEY);
  }

  for (const [k, v] of Object.entries(SECURITY)) res.setHeader(k, v);
  const cc = cacheControl(path);
  const writeHead = res.writeHead;
  res.writeHead = function (...args) {
    if (!res.getHeader('Cache-Control') || cc === 'no-store' || path.startsWith('/_astro/')) res.setHeader('Cache-Control', cc);
    return writeHead.apply(this, args);
  };
  handler(req, res);
});

server.keepAliveTimeout = 65_000;
server.listen(PORT, HOST, () => {
  console.log(`FalcoDash listening on http://${HOST}:${PORT}`);
  if (INDEXNOW_KEY && process.env.RAILWAY_ENVIRONMENT_NAME === 'production') setTimeout(submitIndexNow, 30_000);
});

// IndexNow tells Bing (which also feeds ChatGPT search and Copilot), Yandex and others that pages
// changed, so they recrawl within minutes instead of days. Runs once per deploy.
async function submitIndexNow() {
  try {
    const xml = readFileSync(new URL('./dist/client/sitemap.xml', import.meta.url), 'utf8');
    const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: CANONICAL_HOST, key: INDEXNOW_KEY, keyLocation: `https://${CANONICAL_HOST}/${INDEXNOW_KEY}.txt`, urlList }),
    });
    console.log(`[indexnow] submitted ${urlList.length} URLs: ${res.status}`);
  } catch (err) {
    console.error('[indexnow] failed', err.message);
  }
}

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
