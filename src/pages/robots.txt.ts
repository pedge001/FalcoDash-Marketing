import type { APIRoute } from 'astro';
import { SITE } from '~/data/site';

// One group per policy, and no bot is named in more than one group (a crawler obeys only the most
// specific group that names it, so overlapping groups give conflicting answers).
const SEARCH_AND_ANSWER = [
  'Googlebot', 'Bingbot', 'Applebot', 'DuckDuckBot',
  'OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'DuckAssistBot',
];
const TRAINING_ONLY = [
  'GPTBot', 'ClaudeBot', 'anthropic-ai', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bytespider',
  'meta-externalagent', 'cohere-ai', 'Amazonbot', 'MistralAI-Training', 'Diffbot', 'Google-CloudVertexBot',
];
const PRIVATE = ['Disallow: /admin', 'Disallow: /api/'];
const ua = (bots: string[]) => bots.map((b) => `User-agent: ${b}`);

export const GET: APIRoute = () => {
  const body = [
    '# Search engines and AI answer engines are welcome. They index pages, cite them in answers',
    '# and send visitors, which is the point of this site.',
    ...ua(SEARCH_AND_ANSWER),
    'Allow: /',
    ...PRIVATE,
    '',
    '# Training-only crawlers are opted out. They collect content to train models and do not cite',
    '# sources or send visitors. The llms.txt summaries stay readable to everyone.',
    ...ua(TRAINING_ONLY),
    'Allow: /llms.txt',
    'Allow: /llms-full.txt',
    'Disallow: /',
    '',
    '# Everyone else.',
    'User-agent: *',
    'Content-Signal: search=yes, ai-input=yes, ai-train=no',
    'Allow: /',
    ...PRIVATE,
    '',
    `Sitemap: ${SITE.url}/sitemap.xml`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
