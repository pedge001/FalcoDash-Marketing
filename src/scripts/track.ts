// FalcoDash first-party analytics. No cookies. Sends page views, engaged time and a few events to
// /api/collect. A random visitor ID lives in localStorage; visitors who send Global Privacy Control
// get no stored ID (the server uses a daily-rotating hash instead).

const ENDPOINT = '/api/collect';
const SESSION_IDLE_MS = 30 * 60 * 1000;

const rid = () => {
  const a = new Uint8Array(12);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 20);
};
const safe = <T,>(fn: () => T, fallback: T): T => { try { return fn(); } catch { return fallback; } };

function send(payload: object) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, body)) return;
  fetch(ENDPOINT, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
}

export function initTracking() {
  if ((window as any).__fdTrack) return;
  const gpc = (navigator as any).globalPrivacyControl === true;
  const vid = gpc ? null : safe(() => {
    let v = localStorage.getItem('fd_vid');
    if (!v) { v = rid(); localStorage.setItem('fd_vid', v); }
    return v;
  }, null);

  const now = Date.now();
  let entry = false;
  let sid: string;
  try {
    const last = Number(sessionStorage.getItem('fd_last') || 0);
    let s = sessionStorage.getItem('fd_sid');
    if (!s || now - last > SESSION_IDLE_MS) { s = rid(); sessionStorage.setItem('fd_sid', s); entry = true; }
    sessionStorage.setItem('fd_last', String(now));
    sid = s;
  } catch {
    sid = rid();
    entry = true;
  }

  const pvId = rid();
  send({ t: 'pv', id: pvId, sid, vid, entry, p: location.pathname, title: document.title, r: document.referrer || null, q: location.search.slice(1), w: screen.width });

  // Engaged time: only while the tab is visible.
  let visibleSince = document.visibilityState === 'visible' ? performance.now() : 0;
  let engaged = 0;
  let lastSent = 0;
  const flush = () => {
    if (visibleSince) { engaged += performance.now() - visibleSince; visibleSince = 0; }
    if (engaged - lastSent > 500) { lastSent = engaged; send({ t: 'leave', id: pvId, ms: Math.round(engaged) }); }
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
    else visibleSince = performance.now();
    safe(() => sessionStorage.setItem('fd_last', String(Date.now())), undefined);
  });
  addEventListener('pagehide', flush);

  const track = (n: string, props: Record<string, string | number> = {}) => send({ t: 'ev', sid, vid, n, p: location.pathname, props });
  (window as any).__fdTrack = track;

  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a) return;
    const url = safe(() => new URL(a.href, location.href), null);
    if (!url) return;
    if (url.host !== location.host && /^https?:$/.test(url.protocol)) track('outbound_click', { url: url.href.slice(0, 200) });
    else if (url.pathname === '/contact') track('cta_click', { text: (a.textContent || '').trim().slice(0, 60) });
  }, { capture: true });
}
