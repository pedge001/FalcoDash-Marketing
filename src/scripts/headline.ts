// Swap the landing-page H1 from ?ag=. The default headline is already in the
// server-rendered HTML so crawlers that skip JavaScript still get a real H1.
import { HEADLINES, type HeadlineKey } from '~/data/cashflow';

export function initHeadline() {
  const el = document.querySelector<HTMLElement>('[data-headline]');
  if (!el) return;
  let ag = '';
  try { ag = new URLSearchParams(location.search).get('ag') || ''; } catch { return; }
  if (!(ag in HEADLINES) || ag === 'default') return;
  const text = HEADLINES[ag as HeadlineKey];
  el.textContent = text;
  el.dataset.ag = ag;
}
