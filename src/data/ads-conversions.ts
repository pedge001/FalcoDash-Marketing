// Google Ads conversion IDs and labels. Replace the placeholders when the
// conversion actions exist in Google Ads. This file is config only: it does
// not load gtag, GTM, or any analytics tag snippet.
export const GOOGLE_ADS = {
  conversionId: 'AW-XXXXXXXXX',
  labels: {
    // Secondary: fire only after a successful calculator email submit.
    ar_calculator_completed: 'XXXXXXXXXXXXXXX',
    // Primary: fire only on booking success (Calendly scheduled event or ?booked=1).
    call_booked: 'XXXXXXXXXXXXXXX',
    tel_click: 'XXXXXXXXXXXXXXX',
  },
} as const;

export type AdsConversionEvent = keyof typeof GOOGLE_ADS.labels;

export function adsSendTo(event: AdsConversionEvent): string {
  return `${GOOGLE_ADS.conversionId}/${GOOGLE_ADS.labels[event]}`;
}
