import type { APIRoute } from 'astro';
import { SITE } from '~/data/site';

// Search and AI answer engines are explicitly welcome: being cited is the goal.
const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'Bingbot', 'DuckAssistBot',
  'Amazonbot', 'meta-externalagent', 'MistralAI-User', 'cohere-ai', 'YouBot',
];

export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    '',
    ...AI_BOTS.flatMap((b) => [`User-agent: ${b}`]),
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    '',
    `Sitemap: ${SITE.url}/sitemap.xml`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
