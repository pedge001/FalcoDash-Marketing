// llms.txt (https://llmstxt.org): a plain-Markdown map of the site for language models,
// plus llms-full.txt with every page's substance inline.
import { SITE } from '~/data/site';
import { SERVICES } from '~/data/services';
import { INDUSTRIES } from '~/data/industries';
import { WORK } from '~/data/work';
import { CORE_FAQS, MORE_FAQS } from '~/data/faqs';
import { STEPS, PRINCIPLES } from '~/data/engagement';
import { getPosts, plain, formatDate, modified } from '~/lib/blog';
import { abs } from '~/lib/schema';

const faqMd = (faqs: { q: string; a: string }[]) => faqs.map((f) => `**${f.q}**\n${f.a}`).join('\n\n');

export async function llmsTxt() {
  const posts = await getPosts();
  return `# ${SITE.name}

> ${SITE.description}

Tagline: ${SITE.tagline}
Contact: ${SITE.email} · ${SITE.phoneDisplay} · ${SITE.locationLine}
Every engagement starts with a free automation audit: ${abs('/contact')}

## Services
${SERVICES.map((s) => `- [${s.name}](${abs(`/services/${s.slug}`)}): ${s.shortAnswer}`).join('\n')}

## Industries
${INDUSTRIES.map((i) => `- [${i.name}](${abs(`/industries/${i.slug}`)}): ${i.shortAnswer}`).join('\n')}

## Products and work
${WORK.map((w) => `- [${w.name}](${abs(`/work/${w.slug}`)}) (live at ${w.url}): ${w.shortAnswer}`).join('\n')}

## Company
- [How we work](${abs('/how-we-work')}): Free audit, paid strategy session, fixed-scope build, optional managed automation retainer.
- [About](${abs('/about')}): Who FalcoDash is and who founded it.
- [FAQ](${abs('/faq')}): Answers on cost, timelines, tools, data security and ownership.
- [Contact](${abs('/contact')}): Request a free automation audit.

## Blog
${posts.map((p) => `- [${p.data.title}](${abs(`/blog/${p.id}`)}): ${p.data.short_answer}`).join('\n')}

## Optional
- [Full text for LLMs](${abs('/llms-full.txt')}): Every page's content in one file.
- [RSS](${abs('/blog/rss.xml')})
- [Sitemap](${abs('/sitemap.xml')})
`;
}

export async function llmsFullTxt() {
  const posts = await getPosts();
  const out: string[] = [];
  out.push(`# ${SITE.name}: full site content\n\n> ${SITE.description}\n\nTagline: ${SITE.tagline}\nWebsite: ${SITE.url}\nEmail: ${SITE.email}\nPhone: ${SITE.phoneDisplay}\nLocation: ${SITE.locationLine}\nFounder: ${SITE.founder.name}\n`);
  out.push(`## How FalcoDash works\n\n${STEPS.map((s) => `- **${s.h}** (${s.k}): ${s.p}`).join('\n')}\n\nPrinciples:\n${PRINCIPLES.map((p) => `- **${p.h}**: ${p.p}`).join('\n')}`);
  out.push(`## Frequently asked questions\n\n${faqMd([...CORE_FAQS, ...MORE_FAQS])}`);
  for (const s of SERVICES) {
    out.push(`## Service: ${s.name}\nURL: ${abs(`/services/${s.slug}`)}\n\n${s.question}\n${s.shortAnswer}\n\n### ${s.examplesHeading}\n${s.examples.map((e) => `- **${e.title}**: ${e.body}`).join('\n')}\n\n### ${s.stepsHeading}\n${s.steps.map((e, i) => `${i + 1}. **${e.title}**: ${e.body}`).join('\n')}\n\n### ${s.fitHeading}\n${s.fit.map((f) => `- ${f}`).join('\n')}\n\n### Questions\n${faqMd(s.faqs)}`);
  }
  for (const i of INDUSTRIES) {
    out.push(`## Industry: ${i.name}\nURL: ${abs(`/industries/${i.slug}`)}\n\n${i.shortAnswer}\n\n${i.useCases.map((u) => `- **${u.title}**: ${u.body}`).join('\n')}\n\n### Questions\n${faqMd(i.faqs)}`);
  }
  for (const w of WORK) {
    out.push(`## Product: ${w.name}\nURL: ${abs(`/work/${w.slug}`)} · Live at ${w.url}\n\n${w.shortAnswer}\n\nProblem: ${w.problem}\nAudience: ${w.audience}\n\nWhat we built:\n${w.built.map((b) => `- ${b}`).join('\n')}\n\n### Questions\n${faqMd(w.faqs)}`);
  }
  for (const p of posts) {
    const d = p.data;
    out.push(`## Article: ${d.title}\nURL: ${abs(`/blog/${p.id}`)} · Published ${formatDate(d.date)} · Updated ${formatDate(modified(p))} · ${d.category}\n\nShort answer: ${d.short_answer}\n\n${d.sections.map((s) => `### ${s.heading}\n${plain(s.body)}`).join('\n\n')}${d.faqs?.length ? `\n\n### Questions\n${faqMd(d.faqs.map((f) => ({ q: f.question, a: f.answer })))}` : ''}`);
  }
  return out.join('\n\n---\n\n') + '\n';
}
