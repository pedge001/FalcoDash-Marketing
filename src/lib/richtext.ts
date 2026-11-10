// FAQ answers may contain inline links written as [label](/path). Visible pages render them as
// links; JSON-LD gets the same words as plain text, so the schema matches what readers see.
const LINK = /\[([^\]]+)\]\(((?:\/|https:\/\/)[^)\s]*)\)/g;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const answerText = (a: string) => a.replace(LINK, '$1');

export function answerHtml(a: string) {
  let out = '';
  let last = 0;
  for (const m of a.matchAll(LINK)) {
    out += esc(a.slice(last, m.index)) + `<a href="${esc(m[2])}">${esc(m[1])}</a>`;
    last = m.index! + m[0].length;
  }
  return out + esc(a.slice(last));
}

/** Markdown with absolute URLs, for llms.txt. */
export const answerMarkdown = (a: string, origin: string) => a.replace(LINK, (_, label, href) => `[${label}](${href.startsWith('/') ? origin + href : href})`);
