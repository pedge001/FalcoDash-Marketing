// Traffic channel for a visit, from UTM tags and the referrer. "AI" is its own channel so visits
// from ChatGPT, Perplexity, Claude, Gemini and Copilot answers are visible.

export const CHANNELS = ['AI', 'Search', 'Social', 'Email', 'Paid', 'Referral', 'Campaign', 'Direct'] as const;
export type Channel = (typeof CHANNELS)[number];

const AI = /(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com|perplexity\.ai|claude\.ai|anthropic\.com|gemini\.google\.com|bard\.google\.com|copilot\.microsoft\.com|copilot\.cloud\.microsoft|you\.com|phind\.com|meta\.ai|poe\.com|chat\.deepseek\.com|grok\.com|x\.ai|chat\.mistral\.ai|kagi\.com)$/;
const SEARCH = /(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|search\.yahoo\.com|yahoo\.com|ecosia\.org|search\.brave\.com|baidu\.com|yandex\.[a-z]+|startpage\.com|qwant\.com)$/;
const SOCIAL = /(^|\.)(linkedin\.com|lnkd\.in|facebook\.com|fb\.com|m\.facebook\.com|l\.facebook\.com|instagram\.com|l\.instagram\.com|t\.co|x\.com|twitter\.com|reddit\.com|youtube\.com|youtu\.be|threads\.net|tiktok\.com|nextdoor\.com|pinterest\.com|bsky\.app|news\.ycombinator\.com)$/;
const MAIL = /(^|\.)(mail\.google\.com|outlook\.live\.com|outlook\.office\.com|mail\.yahoo\.com)$/;

export function classify(opts: { referrerHost?: string | null; utmSource?: string | null; utmMedium?: string | null }): Channel {
  const src = (opts.utmSource || '').toLowerCase();
  const med = (opts.utmMedium || '').toLowerCase();
  const host = (opts.referrerHost || '').toLowerCase();
  if (AI.test(host) || AI.test(src) || /chatgpt|perplexity|claude|gemini|copilot/.test(src)) return 'AI';
  if (/^(cpc|ppc|paid|paidsearch|paid_social|paidsocial|display|cpm)$/.test(med)) return 'Paid';
  if (med === 'email' || med === 'newsletter' || MAIL.test(host)) return 'Email';
  if (med === 'social' || SOCIAL.test(host) || SOCIAL.test(src)) return 'Social';
  if (med === 'organic' || SEARCH.test(host)) return 'Search';
  if (src || med) return 'Campaign';
  if (host) return 'Referral';
  return 'Direct';
}

export function refHost(referrer: string | null | undefined, ownHost: string) {
  if (!referrer) return null;
  try {
    const h = new URL(referrer).hostname.replace(/^www\./, '').toLowerCase();
    if (!h || h === ownHost.replace(/^www\./, '') || h === 'localhost') return null;
    return h;
  } catch {
    return null;
  }
}
