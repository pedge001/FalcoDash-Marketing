// First-party analytics collector. The tracker (src/scripts/track.ts) sends small JSON beacons here:
//   { t: 'pv',    id, sid, vid, entry, p, title, r, q, w }   a page view
//   { t: 'leave', id, ms }                                   engaged time for a page view
//   { t: 'ev',    sid, vid, n, p, props }                    a custom event
import type { APIRoute } from 'astro';
import { db, ensureSchema } from '~/lib/db';
import { clientIp, dailyVisitorHash, geoFrom } from '~/lib/request';
import { isBot, parseUa } from '~/lib/ua';
import { classify, refHost } from '~/lib/channel';
import { SESSION_COOKIE } from '~/lib/auth';
import { SITE } from '~/data/site';

export const prerender = false;

const ok = () => new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
const str = (v: unknown, n: number) => (typeof v === 'string' && v ? v.slice(0, n) : null);
const ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const id = (v: unknown) => (typeof v === 'string' && ID_RE.test(v) ? v : null);
const OWN_HOST = new URL(SITE.url).hostname;
const EVENT_NAMES = new Set(['generate_lead', 'outbound_click', 'cta_click', 'scroll_depth']);

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const sql = db();
  if (!sql) return ok();
  const ua = request.headers.get('user-agent') || '';
  if (isBot(ua) || request.headers.get('sec-purpose')?.includes('prefetch')) return ok();
  // Don't count your own visits while signed in to the panel.
  if (cookies.get(SESSION_COOKIE)?.value) return ok();

  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > 8000) return ok();
    body = JSON.parse(text);
  } catch {
    return ok();
  }

  try {
    await ensureSchema();
    if (body.t === 'leave') {
      const pv = id(body.id);
      const ms = Math.max(0, Math.min(Number(body.ms) || 0, 30 * 60 * 1000));
      if (pv && ms) await sql`UPDATE pageviews SET engaged_ms = GREATEST(engaged_ms, ${Math.round(ms)}) WHERE pv_id = ${pv} AND created_at > now() - interval '1 day'`;
      return ok();
    }

    let ip = 'unknown';
    try { ip = clientIp(request, clientAddress); } catch { ip = clientIp(request); }
    const sid = id(body.sid);
    const vid = id(body.vid) ?? dailyVisitorHash(ip, ua);
    if (!sid) return ok();
    const geo = geoFrom(request);

    if (body.t === 'ev') {
      const name = str(body.n, 40);
      if (!name || !EVENT_NAMES.has(name)) return ok();
      const props: Record<string, string | number> = {};
      if (body.props && typeof body.props === 'object') {
        for (const [k, v] of Object.entries(body.props as Record<string, unknown>).slice(0, 10)) {
          if (!/^[a-z_]{1,30}$/.test(k)) continue;
          if (typeof v === 'string') props[k] = v.slice(0, 200);
          else if (typeof v === 'number' && Number.isFinite(v)) props[k] = v;
        }
      }
      await sql`INSERT INTO events (name, session_id, visitor_id, path, props, country, city)
        VALUES (${name}, ${sid}, ${vid}, ${str(body.p, 300)}, ${sql.json(props)}, ${geo.country}, ${geo.city})`;
      return ok();
    }

    if (body.t !== 'pv') return ok();
    const pv = id(body.id);
    const path = str(body.p, 300);
    if (!pv || !path || !path.startsWith('/') || path.startsWith('/admin')) return ok();

    const q = new URLSearchParams(str(body.q, 1000) ?? '');
    const referrer = str(body.r, 500);
    const rHost = refHost(referrer, OWN_HOST);
    const utm = {
      source: q.get('utm_source')?.slice(0, 100) || null,
      medium: q.get('utm_medium')?.slice(0, 100) || null,
      campaign: q.get('utm_campaign')?.slice(0, 150) || null,
      term: q.get('utm_term')?.slice(0, 150) || null,
      content: q.get('utm_content')?.slice(0, 150) || null,
    };
    const entry = body.entry === true;
    // Channel belongs to the session's first page; later pages inherit it.
    let channel = classify({ referrerHost: rHost, utmSource: utm.source, utmMedium: utm.medium });
    if (!entry) {
      const [first] = await sql<{ channel: string }[]>`SELECT channel FROM pageviews WHERE session_id = ${sid} ORDER BY created_at LIMIT 1`;
      if (first) channel = first.channel as typeof channel;
    }
    const w = Number(body.w);
    const screenW = Number.isFinite(w) && w > 0 && w < 10000 ? Math.round(w) : null;
    const { device, browser, os } = parseUa(ua, screenW);

    await sql`
      INSERT INTO pageviews (pv_id, session_id, visitor_id, is_entry, path, title, referrer, referrer_host, channel,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        country, region, region_code, city, postal_code, latitude, longitude, timezone,
        device, browser, os, screen_w)
      VALUES (${pv}, ${sid}, ${vid}, ${entry}, ${path}, ${str(body.title, 200)}, ${rHost ? referrer : null}, ${rHost}, ${channel},
        ${utm.source}, ${utm.medium}, ${utm.campaign}, ${utm.term}, ${utm.content},
        ${geo.country}, ${geo.region}, ${geo.region_code}, ${geo.city}, ${geo.postal_code}, ${geo.latitude}, ${geo.longitude}, ${geo.timezone},
        ${device}, ${browser}, ${os}, ${screenW})
      ON CONFLICT (pv_id) DO NOTHING`;
  } catch (err) {
    console.error('[collect]', (err as Error).message);
  }
  return ok();
};
