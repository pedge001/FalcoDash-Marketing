interface ImportMetaEnv {
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_CLARITY_ID?: string;
  readonly PUBLIC_CF_BEACON_TOKEN?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
