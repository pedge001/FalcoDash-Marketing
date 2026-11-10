// Fallback for any path no page matches. Unknown URLs get a real 404 (the branded 404 page, with
// the site nav and a link to /contact). The only links to the product subdomains are intentional
// ones in the page content; nothing is forwarded to app.falcodash.com automatically.
import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const prerender = false;

// Paths people expect to exist. Temporary (302) until real pages are built, so search engines
// don't treat /contact as their permanent home.
const TEMPORARY: Record<string, string> = {
  '/free-audit': '/contact',
  '/audit': '/contact',
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
  const target = TEMPORARY[url.pathname.replace(/\/+$/, '').toLowerCase()];
  if (target) return new Response(null, { status: 302, headers: { Location: `${target}${url.search}`, 'Cache-Control': 'no-store' } });
  return notFound();
};
