// Fires Google Ads conversion events when gtag is already present (GoogleTag.astro defines it).
// No-ops when it is absent. Does not inject any tag snippet. The old raw dataLayer.push copy of
// each event is gone: there is no GTM container on this site, so nothing read it.
//
// Once per visit: each conversion label is sent at most once per browser session (tab), tracked in
// sessionStorage under falco_conv_<label> ('queued' or 'sent'). If sessionStorage is unavailable,
// an in-memory set gives the same guarantee for the current page.
//
// Consent: while the visitor has not answered the banner yet (no stored choice, no GPC), a
// conversion is queued instead of sent. Google Ads re-sends ("redispatches") any conversion it
// collected under denied ad_storage once consent flips to granted on the same page, so sending
// before the choice and again after Accept would count twice. The queue is flushed exactly once,
// at the first of: Accept or Decline (fd-consent event); PENDING_GRACE_MS after the conversion
// with no answer; or the visitor leaving the page (beforeunload / pagehide). Without an answer it
// goes out as the same cookieless, denied-consent ping as before. GPC and a stored Decline send
// immediately with consent denied, as before; GPC is never upgraded.
import { adsSendTo, GOOGLE_ADS, isConfiguredTagId, type AdsConversionEvent } from '~/data/ads-conversions';
import { hasGpc, readConsentChoice } from '~/scripts/consent';

const KEY_PREFIX = 'falco_conv_';
const memState = new Map<string, 'queued' | 'sent'>();
// Backstop for visitors who ignore the banner and never leave cleanly (e.g. a phone tab that is
// backgrounded, where beforeunload/pagehide may not run). Long, because an Accept after the
// flush lets Google redispatch the ping (see above).
const PENDING_GRACE_MS = 60_000;
let graceTimer: number | undefined;

function session(): Storage | null {
  try {
    const s = window.sessionStorage;
    const probe = `${KEY_PREFIX}probe`;
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

function getState(label: string): 'queued' | 'sent' | null {
  const mem = memState.get(label);
  if (mem === 'sent') return mem;
  const v = session()?.getItem(KEY_PREFIX + label);
  if (v === 'sent' || v === 'queued') return v;
  return mem || null;
}

function setState(label: string, state: 'queued' | 'sent') {
  memState.set(label, state);
  try { session()?.setItem(KEY_PREFIX + label, state); } catch {}
}

function consentPending(): boolean {
  return !hasGpc() && readConsentChoice() === null;
}

function labelFor(eventName: AdsConversionEvent): string {
  const label = GOOGLE_ADS.labels[eventName] || '';
  const ready = isConfiguredTagId(GOOGLE_ADS.conversionId) && !!label && !/_LABEL$/.test(label);
  return ready ? label : '';
}

// The only place a gtag conversion event is sent. Checks the once-per-visit guard first.
function sendConversion(eventName: AdsConversionEvent): boolean {
  const w = window as any;
  const label = labelFor(eventName);
  if (!label || typeof w.gtag !== 'function') return false;
  if (getState(label) === 'sent') return false;
  setState(label, 'sent');
  w.gtag('event', 'conversion', { send_to: adsSendTo(eventName), transport_type: 'beacon' });
  return true;
}

/** Sends every queued conversion that has not been sent yet in this visit. */
export function flushQueuedConversions() {
  for (const eventName of Object.keys(GOOGLE_ADS.labels) as AdsConversionEvent[]) {
    const label = labelFor(eventName);
    if (label && getState(label) === 'queued') sendConversion(eventName);
  }
}

export function fireAdsEvent(eventName: AdsConversionEvent, params: Record<string, string> = {}) {
  try {
    const w = window as any;
    const label = labelFor(eventName);
    if (label && typeof w.gtag === 'function' && getState(label) === null) {
      if (consentPending()) {
        setState(label, 'queued');
        if (graceTimer === undefined) graceTimer = window.setTimeout(() => { graceTimer = undefined; flushQueuedConversions(); }, PENDING_GRACE_MS);
      } else {
        sendConversion(eventName);
      }
    }
    // The unlabeled gtag custom event (which only produced extra unlabeled Google Ads pings) is
    // gone. It is sent to GA4 only, and only once a GA4 ID is configured.
    const ga4 = isConfiguredTagId(GOOGLE_ADS.ga4Id) ? GOOGLE_ADS.ga4Id : '';
    if (ga4 && typeof w.gtag === 'function') {
      w.gtag('event', eventName, { ...params, send_to: ga4 });
    }
    // First-party analytics (/api/collect) is unchanged.
    w.__fdTrack?.(eventName, params);
  } catch {
    // Intentionally empty: missing gtag or storage must not throw.
  }
}

export function initAdsConversions() {
  const w = window as any;
  if (w.__fdAdsReady) return;
  w.__fdAdsReady = true;

  // Queued (pre-consent) conversions go out once: right after the visitor answers the banner,
  // after the grace period, or when the page is left without an answer. beforeunload runs while
  // the old page can still send; pagehide is the last-chance backup.
  document.addEventListener('fd-consent', () => flushQueuedConversions());
  addEventListener('beforeunload', () => flushQueuedConversions());
  addEventListener('pagehide', () => flushQueuedConversions());
  flushQueuedConversions();

  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (a.protocol === 'tel:' || href.startsWith('tel:')) {
      fireAdsEvent('tel_click', { phone: href.slice(0, 40) });
    }
  }, { capture: true });

  // Booking success hooks. A plain click on the booking link is not success.
  try {
    const params = new URLSearchParams(location.search);
    if (params.get('booked') === '1' || location.hash.replace(/^#/, '') === 'booked') {
      fireAdsEvent('call_booked', { source: 'return_url' });
    }
  } catch {}

  addEventListener('message', (e) => {
    const data = e.data;
    const name = data && typeof data === 'object' ? (data.event || data.type || '') : '';
    if (name === 'calendly.event_scheduled' || name === 'booking_confirmed') {
      fireAdsEvent('call_booked', { source: String(name) });
    }
  });
}
