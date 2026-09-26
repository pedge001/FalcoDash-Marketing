import type { APIRoute } from 'astro';
import { allRoutes } from '~/lib/routes';
import { abs } from '~/lib/schema';

export const GET: APIRoute = async () => {
  const routes = await allRoutes();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${abs(r.path)}</loc><lastmod>${r.lastmod}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority.toFixed(1)}</priority></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
