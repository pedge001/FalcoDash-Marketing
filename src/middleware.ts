import { defineMiddleware } from 'astro:middleware';
import { isAdmin } from '~/lib/auth';

// /admin (the panel) and /api/admin/* need a session. /admin/cms is static and protected by GitHub sign-in.
const PUBLIC_ADMIN = /^\/admin\/(login|logout)$/;

export const onRequest = defineMiddleware(async (ctx, next) => {
  if (ctx.isPrerendered) return next();
  const { pathname } = ctx.url;
  const isPanel = pathname === '/admin' || (pathname.startsWith('/admin/') && !pathname.startsWith('/admin/cms'));
  const isAdminApi = pathname.startsWith('/api/admin/');
  if (!isPanel && !isAdminApi) return next();

  if (!PUBLIC_ADMIN.test(pathname)) {
    const ok = await isAdmin(ctx.cookies);
    if (!ok) {
      if (isAdminApi) return Response.json({ ok: false, error: 'Not signed in' }, { status: 401 });
      const nextPath = pathname + ctx.url.search;
      return ctx.redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`, 303);
    }
  }
  const res = await next();
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  res.headers.set('Cache-Control', 'no-store');
  return res;
});
