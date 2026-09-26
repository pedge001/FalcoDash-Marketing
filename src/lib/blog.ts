import { getCollection, type CollectionEntry } from 'astro:content';
import { marked } from 'marked';
import { CATEGORIES } from '~/content.config';

export type Post = CollectionEntry<'blog'>;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const categorySlug = (c: string) => slugify(c);
export const categories = () => CATEGORIES.map((name) => ({ name, slug: categorySlug(name) }));

/** Published posts, newest first. Drafts and future-dated posts are left out of production builds. */
export async function getPosts(): Promise<Post[]> {
  const now = Date.now();
  const posts = await getCollection('blog', ({ data }) => (import.meta.env.PROD ? !data.draft && data.date.getTime() <= now : true));
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Featured post first (if any), then the rest newest first. */
export function orderForIndex(posts: Post[]) {
  const featured = posts.find((p) => p.data.featured);
  return featured ? [featured, ...posts.filter((p) => p !== featured)] : posts;
}

export function related(post: Post, all: Post[], n = 3) {
  return all
    .filter((p) => p.id !== post.id)
    .sort((a, b) => Number(b.data.category === post.data.category) - Number(a.data.category === post.data.category))
    .slice(0, n);
}

export const modified = (p: Post) => p.data.updated ?? p.data.date;

const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Los_Angeles' });
const fmtMonth = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'America/Los_Angeles' });
export const formatDate = (d: Date) => fmt.format(d);
export const formatMonth = (d: Date) => fmtMonth.format(d);

marked.setOptions({ gfm: true, breaks: false });
export const md = (s: string) => marked.parse(s, { async: false }) as string;
/** Strip Markdown to plain text for meta tags, JSON-LD and llms.txt. */
export const plain = (s: string) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const wordCount = (p: Post) =>
  [p.data.short_answer, ...p.data.sections.flatMap((s) => [s.heading, s.body]), ...(p.data.faqs ?? []).flatMap((f) => [f.question, f.answer])]
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
