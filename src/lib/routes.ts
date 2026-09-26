// Every indexable URL on the site, with a last-modified date. Feeds sitemap.xml and llms.txt.
import { PAGES_UPDATED } from '~/data/site';
import { SERVICES } from '~/data/services';
import { INDUSTRIES } from '~/data/industries';
import { WORK } from '~/data/work';
import { getPosts, modified, categories } from '~/lib/blog';

export type RouteEntry = { path: string; lastmod: string; priority: number; changefreq: 'weekly' | 'monthly' | 'yearly' };

export async function allRoutes(): Promise<RouteEntry[]> {
  const posts = await getPosts();
  const d = (x: Date) => x.toISOString().slice(0, 10);
  const latestPost = posts[0] ? d(modified(posts.reduce((a, b) => (modified(a) > modified(b) ? a : b)))) : PAGES_UPDATED;
  const page = (path: string, priority = 0.7, changefreq: RouteEntry['changefreq'] = 'monthly'): RouteEntry => ({ path, lastmod: PAGES_UPDATED, priority, changefreq });
  return [
    page('/', 1.0, 'weekly'),
    page('/services', 0.9),
    ...SERVICES.map((s) => page(`/services/${s.slug}`, 0.9)),
    page('/industries', 0.8),
    ...INDUSTRIES.map((i) => page(`/industries/${i.slug}`, 0.8)),
    page('/work', 0.8),
    ...WORK.map((w) => page(`/work/${w.slug}`, 0.7)),
    page('/how-we-work', 0.8),
    page('/about', 0.7),
    page('/faq', 0.7),
    page('/contact', 0.8),
    { path: '/blog', lastmod: latestPost, priority: 0.8, changefreq: 'weekly' },
    ...categories().map((c) => {
      const inCat = posts.filter((p) => p.data.category === c.name);
      return { path: `/blog/category/${c.slug}`, lastmod: inCat[0] ? d(modified(inCat[0])) : PAGES_UPDATED, priority: 0.5, changefreq: 'weekly' as const };
    }),
    ...posts.map((p) => ({ path: `/blog/${p.id}`, lastmod: d(modified(p)), priority: 0.7, changefreq: 'monthly' as const })),
    page('/privacy', 0.2, 'yearly'),
    page('/terms', 0.2, 'yearly'),
  ];
}
