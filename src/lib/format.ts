export const int = (n: number | null | undefined) => (n ?? 0).toLocaleString('en-US');
export const pct = (n: number | null | undefined, digits = 0) => `${((n ?? 0) * 100).toFixed(digits)}%`;
export function dur(ms: number | null | undefined) {
  const s = Math.round((ms ?? 0) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m}m ${String(s % 60).padStart(2, '0')}s` : `${Math.floor(m / 60)}h ${m % 60}m`;
}
/** Relative change; null when there's no previous value to compare with. */
export const delta = (cur: number | null | undefined, prev: number | null | undefined) =>
  prev ? ((cur ?? 0) - prev) / prev : null;
const dtf = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles' });
export const when = (d: Date | string) => dtf.format(new Date(d));
export function ago(d: Date | string) {
  const s = Math.round((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
export const countryName = (cc: string | null | undefined) => {
  if (!cc || cc === 'Unknown') return 'Unknown';
  try { return regionNames.of(cc) ?? cc; } catch { return cc; }
};
export const flag = (cc: string | null | undefined) =>
  cc && /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 0x1f1a5 + c.charCodeAt(0))) : '';
export const place = (city?: string | null, region?: string | null, country?: string | null) =>
  [city, region, country && country !== 'US' ? countryName(country) : country === 'US' && !region ? 'United States' : null].filter(Boolean).join(', ') || 'Unknown';
