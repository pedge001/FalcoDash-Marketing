import type { APIRoute } from 'astro';
import { db, ensureSchema } from '~/lib/db';
import { sendLeadConfirmation, sendLeadNotification, type Lead } from '~/lib/email';
import { INDUSTRY_OPTIONS } from '~/data/site';
import { clientIp, geoFrom, hashIp } from '~/lib/request';
import { OFFER, REVENUE_LABELS, STUCK_OPTIONS } from '~/data/cashflow';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_PER_HOUR = 5;
// In-memory fallback limiter for when no database is attached.
const memHits = new Map<string, number[]>();

const clip = (v: FormDataEntryValue | null, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

function parseAttribution(raw: string): Record<string, string> {
  try {
    const obj = JSON.parse(raw || '{}');
    if (!obj || typeof obj !== 'object') return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj).slice(0, 10)) {
      if (/^[a-z_]{1,20}$/.test(k) && typeof v === 'string') out[k] = v.slice(0, 300);
    }
    return out;
  } catch {
    return {};
  }
}

/** Parses a dollar amount typed with or without "$" and commas. Returns null when empty, NaN when invalid. */
function money(raw: string): number | null {
  const s = raw.replace(/[$,\s]/g, '');
  if (!s) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return NaN;
  return Number(s);
}
const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

function parseIntake(form: FormData): { message: string } | { error: string } {
  const business = clip(form.get('q_business'), 2000);
  const revenue = clip(form.get('revenue'), 40);
  const openAr = money(clip(form.get('open_ar'), 40));
  const ar90 = money(clip(form.get('ar_over_90'), 40));
  const daysRaw = clip(form.get('days_to_paid'), 10);
  const days = daysRaw ? Number(daysRaw) : null;
  const calcDaysRaw = clip(form.get('calc_days'), 10);
  const calcDays = calcDaysRaw && /^\d{1,4}$/.test(calcDaysRaw) ? Number(calcDaysRaw) : null;
  const invoicing = clip(form.get('q_invoicing'), 2000);
  const stuck = form.getAll('stuck').map((v) => (typeof v === 'string' ? v : '')).filter((v) => (STUCK_OPTIONS as readonly string[]).includes(v));
  const oneThing = clip(form.get('q_one_thing'), 1000);

  if (business.length < 3) return { error: 'Please tell us what your business does and roughly how many people work there.' };
  if (!REVENUE_LABELS.includes(revenue)) return { error: 'Please choose your annual revenue range.' };
  if (openAr === null || Number.isNaN(openAr)) return { error: 'Please enter your total open AR as a dollar amount.' };
  if (ar90 !== null && Number.isNaN(ar90)) return { error: 'Please enter AR over 90 days as a dollar amount, or leave it blank.' };
  if (ar90 !== null && ar90 > openAr) return { error: "AR over 90 days can't be more than your total open AR." };
  if (days !== null && !(Number.isInteger(days) && days >= 0 && days <= 3650)) return { error: 'Please enter the average days to get paid as a whole number, or leave it blank.' };

  const lines = [
    `${OFFER.name}: intake`,
    '',
    `1. What the business does and team size: ${business}`,
    `2. Annual revenue range: ${revenue}`,
    `3. Total open AR: ${usd(openAr)}`,
    `4. AR over 90 days: ${ar90 === null ? '-' : usd(ar90)}`,
    `5. Average days from finishing a job to getting paid: ${days === null ? '-' : days}`,
    `6. How invoices go out and who follows up: ${invoicing || '-'}`,
    `7. Where work or money gets stuck most: ${stuck.length ? stuck.join(', ') : '-'}`,
    `8. If one thing ran itself next month: ${oneThing || '-'}`,
  ];
  if (calcDays !== null) lines.push('', `From the AR calculator: average days from invoice to paid: ${calcDays}`);
  return { message: lines.join('\n') };
}

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const fail = (status: number, error: string) =>
    wantsJson ? Response.json({ ok: false, error }, { status }) : redirect('/contact/error', 303);
  const done = () => (wantsJson ? Response.json({ ok: true }) : redirect('/contact/thanks', 303));

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, 'Please fill in the form and try again.');
  }

  // Spam checks: a hidden honeypot field, and a minimum time on page when the script set it.
  // Bots get a normal-looking success so they don't retry.
  if (clip(form.get('website'), 200)) return done();
  const t = Number(form.get('t'));
  if (t && Date.now() - t < 2500) return done();

  const industry = clip(form.get('industry'), 80);
  const isIntake = form.has('q_business');
  const lead: Lead = {
    name: clip(form.get('name'), 120),
    email: clip(form.get('email'), 200).toLowerCase(),
    company: clip(form.get('company'), 160) || undefined,
    industry: INDUSTRY_OPTIONS.includes(industry) ? industry : undefined,
    phone: clip(form.get('phone'), 40) || undefined,
    message: clip(form.get('message'), 5000),
    source: clip(form.get('source'), 200) || undefined,
    attribution: parseAttribution(clip(form.get('utm'), 2000)),
  };

  if (!lead.name) return fail(422, 'Please enter your name.');
  if (!EMAIL_RE.test(lead.email)) return fail(422, 'Please enter a valid email address.');
  const isCalcResults = lead.source === OFFER.source && form.has('monthly_revenue') && !isIntake;
  if (isCalcResults) {
    const monthly = money(clip(form.get('monthly_revenue'), 40));
    const daysRaw = clip(form.get('days_to_paid'), 10);
    const days = daysRaw ? Number(daysRaw) : NaN;
    if (monthly === null || Number.isNaN(monthly) || monthly <= 0) {
      return fail(422, 'Please enter your monthly revenue as a dollar amount.');
    }
    if (!(Number.isInteger(days) && days >= 0 && days <= 3650)) {
      return fail(422, 'Please enter the average days to get paid as a whole number.');
    }
    const tied = (monthly / 30) * days;
    lead.message = [
      `${OFFER.name}: AR calculator results`,
      `Monthly revenue: ${usd(monthly)}`,
      `Average days to get paid: ${days}`,
      `Cash tied up in AR (monthly revenue ÷ 30 × days): ${usd(tied)}`,
    ].join('\n');
    lead.offer = 'cash-flow-fix';
  } else if (isIntake) {
    // 90 Day Cash Flow Fix intake: the answers become the lead's message, so they show up in
    // /admin and the notification email without a schema change.
    const intake = parseIntake(form);
    if ('error' in intake) return fail(422, intake.error);
    lead.message = intake.message;
    lead.offer = 'cash-flow-fix';
  } else if (lead.message.length < 5) return fail(422, 'Please tell us a little about what you want to automate.');

  let ip = 'unknown';
  try { ip = clientIp(request, clientAddress); } catch { ip = clientIp(request); }
  const ipHash = hashIp(ip);
  const ua = (request.headers.get('user-agent') || '').slice(0, 400);
  const loc = geoFrom(request);
  const idOk = (v: string) => (/^[A-Za-z0-9_-]{8,64}$/.test(v) ? v : null);
  const sessionId = idOk(clip(form.get('sid'), 64));
  const visitorId = idOk(clip(form.get('vid'), 64));
  lead.location = [loc.city, loc.region, loc.country].filter(Boolean).join(', ') || undefined;
  const sql = db();

  // Rate limit per IP.
  if (sql) {
    try {
      await ensureSchema();
      const [{ n }] = await sql<{ n: number }[]>`SELECT count(*)::int AS n FROM leads WHERE ip_hash = ${ipHash} AND created_at > now() - interval '1 hour'`;
      if (n >= MAX_PER_HOUR) return fail(429, 'Too many requests. Please email hello@falcodash.com.');
    } catch (err) {
      console.error('[contact] rate-limit check failed', err);
    }
  } else {
    const now = Date.now();
    const hits = (memHits.get(ipHash) || []).filter((h) => now - h < 3600_000);
    if (hits.length >= MAX_PER_HOUR) return fail(429, 'Too many requests. Please email hello@falcodash.com.');
    memHits.set(ipHash, [...hits, now]);
  }

  // Store first so a lead is never lost to an email outage.
  let stored = false;
  if (sql) {
    try {
      const [row] = await sql<{ id: string }[]>`
        INSERT INTO leads (name, email, company, industry, phone, message, source, attribution, ip_hash, user_agent, country, region, city, session_id, visitor_id)
        VALUES (${lead.name}, ${lead.email}, ${lead.company ?? null}, ${lead.industry ?? null}, ${lead.phone ?? null},
                ${lead.message}, ${lead.source ?? null}, ${sql.json(lead.attribution ?? {})}, ${ipHash}, ${ua},
                ${loc.country}, ${loc.region}, ${loc.city}, ${sessionId}, ${visitorId})
        RETURNING id`;
      lead.id = row.id;
      stored = true;
    } catch (err) {
      console.error('[contact] insert failed', err);
    }
  }

  let notified = false;
  try {
    await sendLeadNotification(lead);
    notified = true;
  } catch (err) {
    console.error('[contact] notification failed', err);
    if (sql && lead.id) {
      await sql`UPDATE leads SET notify_error = ${String((err as Error).message).slice(0, 500)} WHERE id = ${lead.id}`.catch(() => {});
    }
  }
  if (notified && sql && lead.id) {
    await sql`UPDATE leads SET notified_at = now() WHERE id = ${lead.id}`.catch(() => {});
  }

  if (!stored && !notified) {
    console.error('[contact] lead neither stored nor emailed', { email: lead.email });
    return fail(503, 'We could not send your request. Please email hello@falcodash.com or call (909) 499-6997.');
  }

  // The confirmation is a courtesy; its failure doesn't fail the request.
  sendLeadConfirmation(lead).catch((err) => console.error('[contact] confirmation failed', err));

  return done();
};

export const ALL: APIRoute = () => new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
