// Everything that used to live on falcodash.com moved to app.falcodash.com. Any path this site
// doesn't serve is permanently redirected there, keeping the path and query, so old links,
// bookmarks and search results keep working.
import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const prerender = false;

// Paths that belong to this site; unknown URLs under them are real 404s, not legacy app links.
const OWN = /^\/(api|_astro|admin|og|images|blog|services|industries|work)(\/|$)/;

let notFoundHtml: string | null = null;
function notFound() {
  try {
    notFoundHtml ??= readFileSync(join(process.cwd(), 'dist/client/404.html'), 'utf8');
  } catch {
    notFoundHtml = '<!doctype html><title>Page not found | FalcoDash</title><p>Page not found. <a href="/">FalcoDash home</a></p>';
  }
  return new Response(notFoundHtml, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export const ALL: APIRoute = ({ url }) => {
  if (OWN.test(url.pathname)) return notFound();
  return new Response(null, {
    status: 301,
    headers: { Location: `https://app.falcodash.com${url.pathname}${url.search}`, 'Cache-Control': 'public, max-age=86400' },
  });
};
