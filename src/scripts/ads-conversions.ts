// Fires Google Ads conversion events when gtag or dataLayer is already present.
// No-ops when they are absent. Does not inject any tag snippet.
import { adsSendTo, GOOGLE_ADS, isConfiguredTagId, type AdsConversionEvent } from '~/data/ads-conversions';

export function fireAdsEvent(eventName: AdsConversionEvent, params: Record<string, string> = {}) {
  try {
    const w = window as any;
    const send_to = adsSendTo(eventName);
    const label = GOOGLE_ADS.labels[eventName] || '';
    const ready = isConfiguredTagId(GOOGLE_ADS.conversionId) && !!label && !/_LABEL$/.test(label);
    if (typeof w.gtag === 'function') {
      if (ready) w.gtag('event', 'conversion', { send_to });
      w.gtag('event', eventName, params);
    }
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: eventName, send_to, ...params });
    }
    w.__fdTrack?.(eventName, params);
  } catch {
    // Intentionally empty: missing gtag/dataLayer must not throw.
  }
}

export function initAdsConversions() {
  const w = window as any;
  if (w.__fdAdsReady) return;
  w.__fdAdsReady = true;

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
