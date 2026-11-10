interface ImportMetaEnv {
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_CLARITY_ID?: string;
  readonly PUBLIC_CF_BEACON_TOKEN?: string;
  /** "1" shows case-study TODO placeholders in a production build (e.g. a preview deploy). */
  readonly PUBLIC_SHOW_TODOS?: string;
  /** Booking page for the step after the /cash-flow-fix intake form. Placeholder shown when unset. */
  readonly PUBLIC_BOOKING_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
