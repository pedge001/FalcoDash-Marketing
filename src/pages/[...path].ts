// Fallback for any path no page matches. Unknown URLs get a real 404 (the branded 404 page, with
// the site nav and a link to /contact). Only the old dashboard's known routes (APP_ROUTES below)
// are forwarded to app.falcodash.com; nothing else is.
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

// Routes of the association dashboard that lived on falcodash.com before it moved to
// app.falcodash.com (from the Falco-dash client router). Only these exact routes are forwarded,
// with the original path and query, so old bookmarks and emailed links keep working. Every other
// unknown path stays a 404. /admin/* is left out because this site has its own /admin.
const APP_ROUTES = new Set([
  '/account-balances', '/account/security', '/accounts', '/association-profile', '/board-report',
  '/budget-alerts', '/chart-of-accounts', '/checkout/success', '/dashboard', '/data', '/demo',
  '/expense-requests', '/export-templates', '/financial-reports', '/financials', '/forgot-password',
  '/login', '/login/two-factor', '/membership', '/settings', '/settings/branding',
  '/settings/integrations', '/signup', '/upload', '/upload-history', '/user-activity', '/users',
  '/api/qbo/callback',
]);
const APP_ROUTE_PATTERNS = [
  /^\/accept-invitation\/[^/]+$/,
  /^\/set-password\/[^/]+$/,
  /^\/account-balances\/[^/]+$/,
  /^\/financials\/[^/]+(\/[^/]+)?$/,
  /^\/membership\/[^/]+$/,
];
const isAppRoute = (key: string) => APP_ROUTES.has(key) || APP_ROUTE_PATTERNS.some((re) => re.test(key));

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
  // Fixed routes go out in lowercase (the app's router is case-sensitive). Routes with a token or
  // name segment are forwarded as sent, since invitation and password tokens are case-sensitive.
  if (isAppRoute(key)) {
    const path = APP_ROUTES.has(key) ? key : url.pathname.replace(/\/+$/, '');
    return new Response(null, { status: 301, headers: { Location: `https://app.falcodash.com${path}${url.search}`, 'Cache-Control': 'public, max-age=86400' } });
  }
  return notFound();
};
