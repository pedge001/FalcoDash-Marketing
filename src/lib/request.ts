import { createHash, createHmac } from 'node:crypto';

/** The visitor's IP. Behind Cloudflare it arrives in cf-connecting-ip; x-forwarded-for is the fallback. */
export function clientIp(request: Request, fallback?: string) {
  const cf = request.headers.get('cf-connecting-ip');
  if (cf) return cf.trim();
  const fwd = request.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0].trim() : request.headers.get('x-real-ip')) || fallback || 'unknown';
}

const salt = () => process.env.IP_HASH_SALT || 'falcodash';
export const hashIp = (ip: string) => createHash('sha256').update(`${salt()}:${ip}`).digest('hex').slice(0, 32);
export const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

/** A visitor ID that changes every day and can't be reversed; used when we may not store an ID. */
export function dailyVisitorHash(ip: string, ua: string, date = new Date()) {
  const day = date.toISOString().slice(0, 10);
  const daySalt = createHmac('sha256', salt()).update(day).digest('hex');
  return 'd_' + createHash('sha256').update(`${daySalt}:${ip}:${ua}`).digest('hex').slice(0, 24);
}

export type Geo = {
  country: string | null;
  region: string | null;
  region_code: string | null;
  city: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
};

/**
 * Visitor location from Cloudflare. cf-ipcountry is always present when the zone is proxied; the rest
 * need the "Add visitor location headers" Managed Transform. Local dev can fake them with
 * DEV_GEO='{"country":"US","region":"California",...}'.
 */
export function geoFrom(request: Request): Geo {
  const h = (k: string) => {
    const v = request.headers.get(k);
    if (!v) return null;
    try { return decodeURIComponent(v).slice(0, 100); } catch { return v.slice(0, 100); }
  };
  const num = (k: string) => { const v = Number(request.headers.get(k)); return Number.isFinite(v) && request.headers.get(k) ? v : null; };
  const c = h('cf-ipcountry');
  const geo: Geo = {
    country: c && c !== 'XX' && c !== 'T1' ? c.toUpperCase() : null,
    region: h('cf-region'),
    region_code: h('cf-region-code'),
    city: h('cf-ipcity'),
    postal_code: h('cf-postal-code'),
    latitude: num('cf-iplatitude'),
    longitude: num('cf-iplongitude'),
    timezone: h('cf-timezone'),
  };
  if (!geo.country && process.env.DEV_GEO && process.env.NODE_ENV !== 'production') {
    try { Object.assign(geo, JSON.parse(process.env.DEV_GEO)); } catch {}
  }
  return geo;
}
