import type { APIRoute, GetStaticPaths } from 'astro';
import { renderOg } from '~/lib/og';
import { SERVICES } from '~/data/services';
import { INDUSTRIES } from '~/data/industries';
import { WORK } from '~/data/work';
import { getPosts } from '~/lib/blog';

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  const p = (slug: string, eyebrow: string, title: string) => ({ params: { slug }, props: { eyebrow, title } });
  return [
    p('default', 'AI implementation & automation firm', 'Custom AI automation for teams that run on data.'),
    p('services', 'Services', 'AI automation services, built and run for you.'),
    p('industries', 'Industries', 'Who we work with.'),
    p('work', 'Work', 'Built and running.'),
    p('blog', 'FalcoDash Blog', 'Guides to AI, automation and better data.'),
    p('about', 'About', 'Most companies already have the data they need.'),
    p('faq', 'FAQ', 'Questions, answered.'),
    p('contact', 'Free automation audit', "Tell us what's slowing your team down."),
    p('how-we-work', 'How we work', 'Audit. Build. Run.'),
    ...SERVICES.map((s) => p(`services/${s.slug}`, `Services — ${s.name}`, s.h1)),
    ...INDUSTRIES.map((i) => p(`industries/${i.slug}`, 'Industries', i.h1)),
    ...WORK.map((w) => p(`work/${w.slug}`, w.tags, `${w.name}: ${w.summary}`)),
    ...posts.map((post) => p(`blog/${post.id}`, `Blog — ${post.data.category}`, post.data.title)),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props as { eyebrow: string; title: string });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
