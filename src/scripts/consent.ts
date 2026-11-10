// Consent Mode v2 updates and the cookie banner. The default "denied" command
// and the gtag.js load live in an inline <head> script so they run first.
export const CONSENT_KEY = 'fd_cookie_consent';
export const CONSENT_DENIED = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
} as const;
export const CONSENT_GRANTED = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
} as const;

export function hasGpc(): boolean {
  return (navigator as any).globalPrivacyControl === true;
}

export function readConsentChoice(): 'accepted' | 'denied' | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    if (v === 'accepted' || v === 'denied') return v;
  } catch {}
  return null;
}

export function writeConsentChoice(value: 'accepted' | 'denied') {
  try { localStorage.setItem(CONSENT_KEY, value); } catch {}
}

export function updateConsent(granted: boolean) {
  const w = window as any;
  if (typeof w.gtag !== 'function') return;
  // GPC: ad (and analytics) consent stays denied and is never upgraded.
  if (hasGpc() || !granted) w.gtag('consent', 'update', { ...CONSENT_DENIED });
  else w.gtag('consent', 'update', { ...CONSENT_GRANTED });
}

export function initConsentBanner() {
  const root = document.querySelector<HTMLElement>('[data-consent-banner]');
  if (!root) return;

  const hide = () => { root.hidden = true; };
  const show = () => { root.hidden = false; };

  if (hasGpc()) {
    updateConsent(false);
    hide();
    return;
  }

  const saved = readConsentChoice();
  if (saved === 'accepted') { updateConsent(true); hide(); return; }
  if (saved === 'denied') { updateConsent(false); hide(); return; }

  show();
  root.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const accept = btn.dataset.consent === 'accept';
      writeConsentChoice(accept ? 'accepted' : 'denied');
      updateConsent(accept);
      hide();
      document.dispatchEvent(new CustomEvent('fd-consent', { detail: { accepted: accept && !hasGpc() } }));
    });
  });
}
