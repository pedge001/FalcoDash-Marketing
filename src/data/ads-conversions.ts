// Single config spot for Google tag IDs and conversion labels.
// Source: "Tracking plan" tab of the FalcoDash Google Ads Search review sheet
// https://docs.google.com/spreadsheets/d/10q10khNbbuyluzEoX0Yl-jFSaSXWhoWWCfhmnWB-94U
// read 2026-11-09 PT. The sheet has placeholders only — no real Ads conversion
// ID, no real conversion labels, and no GA4 measurement ID. Do not invent IDs.
export const GOOGLE_ADS = {
  conversionId: 'AW-XXXXXXXXX',
  // Empty: no G- measurement ID was on the sheet.
  ga4Id: '',
  labels: {
    // Secondary. Sheet placeholder send_to: AW-XXXXXXXXX/AR_CALCULATOR_COMPLETE_LABEL
    ar_calculator_completed: 'AR_CALCULATOR_COMPLETE_LABEL',
    // Primary. Sheet placeholder send_to: AW-XXXXXXXXX/CALL_BOOKED_LABEL
    call_booked: 'CALL_BOOKED_LABEL',
    // tel: clicks. Sheet placeholder send_to: AW-XXXXXXXXX/WEBSITE_CALL_CLICK_LABEL
    tel_click: 'WEBSITE_CALL_CLICK_LABEL',
  },
} as const;

export type AdsConversionEvent = keyof typeof GOOGLE_ADS.labels;

export function adsSendTo(event: AdsConversionEvent): string {
  return `${GOOGLE_ADS.conversionId}/${GOOGLE_ADS.labels[event]}`;
}

/** True only for a real AW- or G- ID, not a placeholder like AW-XXXXXXXXX. */
export function isConfiguredTagId(id: string): boolean {
  if (!id || /X{3,}/i.test(id)) return false;
  return /^(AW-\d+|G-[A-Z0-9]+)$/.test(id);
}
