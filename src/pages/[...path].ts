// Fallback for any path no page matches. Unknown URLs get a real 404 (the branded 404 page, with
// the site nav and a link to /contact). The only links to the product subdomains are intentional
// ones in the page content; nothing is forwarded to app.falcodash.com automatically.
import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const prerender = false;

// Short aliases for real pages: permanent.
const PERMANENT: Record<string, string> = {
  '/audit': '/free-audit',
};
// Paths people expect to exist. Temporary (302) until a real page is built, so search engines
// don't treat the target as its permanent home.
const TEMPORARY: Record<string, string> = {
  '/pricing': '/contact',
};

let notFoundHtml: string | null = null;
function notFound() {
  try {
    notFoundHtml ??= readFileSync(join(process.cwd(), 'dist/client/404.html'), 'utf8');
  } catch {
    notFoundHtml = '<!doctype html><title>Page not found | FalcoDash</title><p>Page not found. <a href="/">FalcoDash home</a> · <a href="/contact">Contact</a></p>';
  }
  return new Response(notFoundHtml, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

export const ALL: APIRoute = ({ url }) => {
  const key = url.pathname.replace(/\/+$/, '').toLowerCase();
  if (PERMANENT[key]) return new Response(null, { status: 301, headers: { Location: `${PERMANENT[key]}${url.search}`, 'Cache-Control': 'public, max-age=86400' } });
  if (TEMPORARY[key]) return new Response(null, { status: 302, headers: { Location: `${TEMPORARY[key]}${url.search}`, 'Cache-Control': 'no-store' } });
  return notFound();
};
