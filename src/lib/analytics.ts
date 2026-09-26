// Queries behind the /admin panel. All day boundaries use Pacific time.
import { db, ensureSchema } from '~/lib/db';

export const TZ = 'America/Los_Angeles';
export const RANGES = {
  today: { label: 'Today', days: 1 },
  '7d': { label: '7 days', days: 7 },
  '30d': { label: '30 days', days: 30 },
  '90d': { label: '90 days', days: 90 },
  '12m': { label: '12 months', days: 365 },
} as const;
export type RangeKey = keyof typeof RANGES;
export const parseRange = (v: string | null): RangeKey => (v && v in RANGES ? (v as RangeKey) : '30d');

export type Window = { from: Date; to: Date; prevFrom: Date; prevTo: Date; bucket: 'hour' | 'day' | 'week'; key: RangeKey };

/** Current window (ending now) and the equal-length window before it, for comparisons. */
export function windowFor(key: RangeKey): Window {
  const to = new Date();
  let from: Date;
  if (key === 'today') {
    const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(to);
    // Midnight Pacific, expressed in UTC (handles DST by probing the offset).
    const guess = new Date(`${ymd}T00:00:00Z`);
    const offsetH = Number(new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', hourCycle: 'h23' }).format(guess));
    from = new Date(guess.getTime() + ((24 - offsetH) % 24) * 3600e3);
  } else {
    from = new Date(to.getTime() - RANGES[key].days * 864e5);
  }
  const len = to.getTime() - from.getTime();
  return { from, to, prevFrom: new Date(from.getTime() - len), prevTo: from, bucket: key === 'today' ? 'hour' : key === '12m' ? 'week' : 'day', key };
}

const S = async () => {
  const sql = db();
  if (!sql) return null;
  await ensureSchema();
  return sql;
};

export async function kpis(w: Window) {
  const sql = await S();
  if (!sql) return null;
  const q = (from: Date, to: Date) => sql<{ visitors: number; sessions: number; pageviews: number; engaged: number | null; bounce: number | null }[]>`
    WITH s AS (
      SELECT session_id, count(*) AS pv, sum(engaged_ms) AS ms
      FROM pageviews WHERE created_at >= ${from} AND created_at < ${to} GROUP BY session_id
    )
    SELECT
      (SELECT count(DISTINCT visitor_id)::int FROM pageviews WHERE created_at >= ${from} AND created_at < ${to}) AS visitors,
      (SELECT count(*)::int FROM s) AS sessions,
      (SELECT coalesce(sum(pv), 0)::int FROM s) AS pageviews,
      (SELECT avg(ms)::float FROM s) AS engaged,
      (SELECT avg(CASE WHEN pv = 1 THEN 1.0 ELSE 0 END)::float FROM s) AS bounce`;
  const leadsQ = (from: Date, to: Date) => sql<{ n: number }[]>`SELECT count(*)::int AS n FROM leads WHERE created_at >= ${from} AND created_at < ${to}`;
  const [[cur], [prev], [lc], [lp]] = await Promise.all([q(w.from, w.to), q(w.prevFrom, w.prevTo), leadsQ(w.from, w.to), leadsQ(w.prevFrom, w.prevTo)]);
  return { cur: { ...cur, leads: lc.n }, prev: { ...prev, leads: lp.n } };
}

export async function series(w: Window) {
  const sql = await S();
  if (!sql) return [];
  const unit = w.bucket;
  const step = unit === 'hour' ? '1 hour' : unit === 'week' ? '1 week' : '1 day';
  return sql<{ bucket: string; visitors: number; pageviews: number; leads: number }[]>`
    WITH b AS (
      SELECT generate_series(date_trunc(${unit}, ${w.from}::timestamptz AT TIME ZONE ${TZ}), date_trunc(${unit}, ${w.to}::timestamptz AT TIME ZONE ${TZ}), ${step}::interval) AS t
    ),
    p AS (
      SELECT date_trunc(${unit}, created_at AT TIME ZONE ${TZ}) AS t, count(DISTINCT visitor_id)::int AS visitors, count(*)::int AS pageviews
      FROM pageviews WHERE created_at >= ${w.from} AND created_at < ${w.to} GROUP BY 1
    ),
    l AS (
      SELECT date_trunc(${unit}, created_at AT TIME ZONE ${TZ}) AS t, count(*)::int AS leads
      FROM leads WHERE created_at >= ${w.from} AND created_at < ${w.to} GROUP BY 1
    )
    SELECT to_char(b.t, 'YYYY-MM-DD"T"HH24:MI:SS') || 'Z' AS bucket, coalesce(p.visitors, 0) AS visitors, coalesce(p.pageviews, 0) AS pageviews, coalesce(l.leads, 0) AS leads
    FROM b LEFT JOIN p ON p.t = b.t LEFT JOIN l ON l.t = b.t ORDER BY b.t`;
}

type Row = { label: string; value: number; sub?: number | null; extra?: string | null };

/** Sessions by channel, with leads attributed to the session that submitted the form. */
export async function channels(w: Window) {
  const sql = await S();
  if (!sql) return [];
  return sql<(Row & { leads: number })[]>`
    WITH e AS (SELECT DISTINCT ON (session_id) session_id, channel FROM pageviews WHERE created_at >= ${w.from} AND created_at < ${w.to} ORDER BY session_id, created_at)
    SELECT e.channel AS label, count(*)::int AS value,
      count(*) FILTER (WHERE EXISTS (SELECT 1 FROM events ev WHERE ev.session_id = e.session_id AND ev.name = 'generate_lead'))::int AS leads
    FROM e GROUP BY 1 ORDER BY 2 DESC`;
}

export async function referrers(w: Window, channel?: string, limit = 12) {
  const sql = await S();
  if (!sql) return [];
  return sql<Row[]>`
    SELECT referrer_host AS label, count(DISTINCT session_id)::int AS value
    FROM pageviews WHERE created_at >= ${w.from} AND created_at < ${w.to} AND referrer_host IS NOT NULL AND is_entry
      ${channel ? sql`AND channel = ${channel}` : sql``}
    GROUP BY 1 ORDER BY 2 DESC LIMIT ${limit}`;
}

export async function campaigns(w: Window, limit = 15) {
  const sql = await S();
  if (!sql) return [];
  return sql<{ source: string | null; medium: string | null; campaign: string | null; sessions: number }[]>`
    SELECT utm_source AS source, utm_medium AS medium, utm_campaign AS campaign, count(DISTINCT session_id)::int AS sessions
    FROM pageviews WHERE created_at >= ${w.from} AND created_at < ${w.to} AND is_entry AND (utm_source IS NOT NULL OR utm_campaign IS NOT NULL)
    GROUP BY 1, 2, 3 ORDER BY 4 DESC LIMIT ${limit}`;
}

export async function pages(w: Window, opts: { entry?: boolean; limit?: number } = {}) {
  const sql = await S();
  if (!sql) return [];
  return sql<(Row & { pageviews: number; engaged: number | null })[]>`
    SELECT path AS label, count(DISTINCT visitor_id)::int AS value, count(*)::int AS pageviews, avg(NULLIF(engaged_ms, 0))::float AS engaged
    FROM pageviews WHERE created_at >= ${w.from} AND created_at < ${w.to} ${opts.entry ? sql`AND is_entry` : sql``}
    GROUP BY 1 ORDER BY 2 DESC LIMIT ${opts.limit ?? 12}`;
}

export async function breakdown(w: Window, col: 'device' | 'browser' | 'os' | 'country', limit = 10) {
  const sql = await S();
  if (!sql) return [];
  return sql<Row[]>`
    SELECT coalesce(${sql(col)}, 'Unknown') AS label, count(DISTINCT visitor_id)::int AS value
    FROM pageviews WHERE created_at >= ${w.from} AND created_at < ${w.to}
    GROUP BY 1 ORDER BY 2 DESC LIMIT ${limit}`;
}

export async function usStates(w: Window) {
  const sql = await S();
  if (!sql) return [];
  return sql<{ code: string; name: string | null; value: number }[]>`
    SELECT upper(region_code) AS code, max(region) AS name, count(DISTINCT visitor_id)::int AS value
    FROM pageviews WHERE created_at >= ${w.from} AND created_at < ${w.to} AND country = 'US' AND region_code IS NOT NULL
    GROUP BY 1 ORDER BY 3 DESC`;
}

export async function cities(w: Window, limit = 200) {
  const sql = await S();
  if (!sql) return [];
  return sql<{ city: string; region: string | null; country: string | null; lat: number | null; lon: number | null; value: number }[]>`
    SELECT city, max(region) AS region, max(country) AS country, avg(latitude)::float AS lat, avg(longitude)::float AS lon, count(DISTINCT visitor_id)::int AS value
    FROM pageviews WHERE created_at >= ${w.from} AND created_at < ${w.to} AND city IS NOT NULL
    GROUP BY city, region_code, country ORDER BY value DESC LIMIT ${limit}`;
}

export async function eventCounts(w: Window, name: string, prop: string, limit = 10) {
  const sql = await S();
  if (!sql) return [];
  return sql<Row[]>`
    SELECT coalesce(props->>${prop}, '(none)') AS label, count(*)::int AS value
    FROM events WHERE created_at >= ${w.from} AND created_at < ${w.to} AND name = ${name}
    GROUP BY 1 ORDER BY 2 DESC LIMIT ${limit}`;
}

export async function crawlers(w: Window) {
  const sql = await S();
  if (!sql) return { bots: [], kinds: [], paths: [], recent: [] };
  const [bots, kinds, paths, recent] = await Promise.all([
    sql<{ bot: string; kind: string; hits: number; pages: number; last: Date }[]>`
      SELECT bot, max(kind) AS kind, count(*)::int AS hits, count(DISTINCT path)::int AS pages, max(created_at) AS last
      FROM crawler_hits WHERE created_at >= ${w.from} AND created_at < ${w.to} GROUP BY bot ORDER BY hits DESC`,
    sql<Row[]>`SELECT kind AS label, count(*)::int AS value FROM crawler_hits WHERE created_at >= ${w.from} AND created_at < ${w.to} GROUP BY 1 ORDER BY 2 DESC`,
    sql<Row[]>`
      SELECT path AS label, count(*)::int AS value, string_agg(DISTINCT bot, ', ') AS extra
      FROM crawler_hits WHERE created_at >= ${w.from} AND created_at < ${w.to} AND kind IN ('ai_user', 'ai_search', 'ai_training')
      GROUP BY 1 ORDER BY 2 DESC LIMIT 15`,
    sql<{ created_at: Date; bot: string; kind: string; path: string; status: number }[]>`
      SELECT created_at, bot, kind, path, status FROM crawler_hits WHERE kind IN ('ai_user', 'ai_search') ORDER BY created_at DESC LIMIT 25`,
  ]);
  return { bots, kinds, paths, recent };
}

export async function live() {
  const sql = await S();
  if (!sql) return { now: 0, recent: [] };
  const [[{ now }], recent] = await Promise.all([
    sql<{ now: number }[]>`SELECT count(DISTINCT visitor_id)::int AS now FROM pageviews WHERE created_at > now() - interval '5 minutes'`,
    sql<{ created_at: Date; path: string; channel: string; referrer_host: string | null; city: string | null; region: string | null; country: string | null; device: string | null; browser: string | null; visitor_id: string; engaged_ms: number }[]>`
      SELECT created_at, path, channel, referrer_host, city, region, country, device, browser, visitor_id, engaged_ms
      FROM pageviews ORDER BY created_at DESC LIMIT 60`,
  ]);
  return { now, recent };
}

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'spam'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type LeadRow = {
  id: string; created_at: Date; name: string; email: string; company: string | null; industry: string | null; phone: string | null;
  message: string; source: string | null; attribution: Record<string, string>; status: string; notes: string | null;
  country: string | null; region: string | null; city: string | null; notified_at: Date | null; notify_error: string | null;
  session_id: string | null; visitor_id: string | null; updated_at: Date | null;
};

export async function leads(opts: { status?: string; limit?: number } = {}) {
  const sql = await S();
  if (!sql) return [];
  return sql<LeadRow[]>`
    SELECT * FROM leads ${opts.status ? sql`WHERE status = ${opts.status}` : sql`WHERE status <> 'spam'`}
    ORDER BY created_at DESC LIMIT ${opts.limit ?? 200}`;
}

export async function leadStatusCounts() {
  const sql = await S();
  if (!sql) return [];
  return sql<{ status: string; n: number }[]>`SELECT status, count(*)::int AS n FROM leads GROUP BY 1`;
}

export async function lead(id: string) {
  const sql = await S();
  if (!sql || !/^\d+$/.test(id)) return null;
  const [row] = await sql<LeadRow[]>`SELECT * FROM leads WHERE id = ${id}`;
  if (!row) return null;
  const journey = row.visitor_id || row.session_id
    ? await sql<{ created_at: Date; path: string; channel: string; referrer_host: string | null; utm_source: string | null; utm_campaign: string | null; city: string | null; region: string | null; country: string | null; device: string | null; engaged_ms: number; session_id: string }[]>`
        SELECT created_at, path, channel, referrer_host, utm_source, utm_campaign, city, region, country, device, engaged_ms, session_id
        FROM pageviews
        WHERE ${row.visitor_id ? sql`visitor_id = ${row.visitor_id}` : sql`session_id = ${row.session_id}`}
          AND created_at <= ${row.created_at}::timestamptz + interval '1 hour'
        ORDER BY created_at LIMIT 200`
    : [];
  return { lead: row, journey };
}

export async function updateLead(id: string, status: string, notes: string) {
  const sql = await S();
  if (!sql || !/^\d+$/.test(id) || !(LEAD_STATUSES as readonly string[]).includes(status)) return false;
  await sql`UPDATE leads SET status = ${status}, notes = ${notes.slice(0, 10000) || null}, updated_at = now() WHERE id = ${id}`;
  return true;
}
