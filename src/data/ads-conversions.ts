// Single config spot for Google tag IDs and conversion labels.
// Conversion actions created in Google Ads (Penny Empire, customer 131113613) on
// 2026-11-12 PT under Google tag AW-944429747. These are public IDs, so they live
// here as defaults; PUBLIC_GOOGLE_ADS_ID still overrides the account ID.
export const GOOGLE_ADS = {
  // Env wins over the file. Placeholders or empty values make the tag a no-op.
  conversionId: (import.meta.env.PUBLIC_GOOGLE_ADS_ID || 'AW-944429747').trim(),
  // Empty: no G- measurement ID was on the sheet.
  ga4Id: (import.meta.env.PUBLIC_GA4_ID || '').trim(),
  labels: {
    // Secondary. FalcoDash - AR calculator completed (calculator email submitted successfully).
    ar_calculator_completed: 'ew_wCMflq7cdELO1q8ID',
    // Primary. FalcoDash - Call booked (booking confirmed: ?booked=1, #booked, or a Calendly/booking postMessage).
    call_booked: 'WPLqCMTlq7cdELO1q8ID',
    // FalcoDash - Phone number click (tel: links).
    tel_click: 'u5lJCMrlq7cdELO1q8ID',
    // FalcoDash - Free audit form submit (successful /free-audit form submit).
    free_audit_submitted: 'ufuNCMHlq7cdELO1q8ID',
  },
};

export type AdsConversionEvent = keyof typeof GOOGLE_ADS.labels;

export function adsSendTo(event: AdsConversionEvent): string {
  return `${GOOGLE_ADS.conversionId}/${GOOGLE_ADS.labels[event]}`;
}

/** True only for a real AW- or G- ID, not a placeholder like AW-XXXXXXXXX. */
export function isConfiguredTagId(id: string): boolean {
  if (!id || /X{3,}/i.test(id)) return false;
  return /^(AW-\d+|G-[A-Z0-9]+)$/.test(id);
}
