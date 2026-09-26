import type { APIRoute } from 'astro';
import { getPosts, plain } from '~/lib/blog';
import { SITE } from '~/data/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const items = posts
    .map((p) => {
      const url = `${SITE.url}/blog/${p.id}`;
      const body = [p.data.short_answer, ...p.data.sections.map((s) => `${s.heading}: ${plain(s.body)}`)].join('\n\n');
      return `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${p.data.date.toUTCString()}</pubDate>
      <category>${esc(p.data.category)}</category>
      <description>${esc(p.data.description)}</description>
      <content:encoded><![CDATA[${body.replace(/]]>/g, ']]]]><![CDATA[>')}]]></content:encoded>
    </item>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>FalcoDash Blog</title>
    <link>${SITE.url}/blog</link>
    <atom:link href="${SITE.url}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Practical guides on AI automation, AI workflows, dashboards and custom apps.</description>
    <language>en-us</language>
    <lastBuildDate>${(posts[0]?.data.updated ?? posts[0]?.data.date ?? new Date()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
