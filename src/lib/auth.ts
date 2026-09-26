// Single-user admin auth. The password lives in the ADMIN_PASSWORD env var; sessions are random
// tokens stored hashed in Postgres and sent as an HttpOnly cookie.
import type { AstroCookies } from 'astro';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { db, ensureSchema } from '~/lib/db';
import { sha256 } from '~/lib/request';

export const SESSION_COOKIE = 'fd_admin';
const SESSION_DAYS = 30;
const MAX_FAILS = 8; // per IP per 15 minutes

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !input) return false;
  // Compare fixed-length digests so the comparison is constant-time regardless of length.
  const a = Buffer.from(sha256(`pw:${input}`), 'hex');
  const b = Buffer.from(sha256(`pw:${expected}`), 'hex');
  return timingSafeEqual(a, b);
}

export async function tooManyAttempts(ipHash: string) {
  const sql = db();
  if (!sql) return false;
  await ensureSchema();
  const [{ n }] = await sql<{ n: number }[]>`
    SELECT count(*)::int AS n FROM admin_login_attempts
    WHERE ip_hash = ${ipHash} AND NOT ok AND created_at > now() - interval '15 minutes'`;
  return n >= MAX_FAILS;
}

export async function recordAttempt(ipHash: string, ok: boolean) {
  const sql = db();
  if (sql) await sql`INSERT INTO admin_login_attempts (ip_hash, method, ok) VALUES (${ipHash}, 'password', ${ok})`.catch(() => {});
}

export async function createSession(cookies: AstroCookies, secure: boolean, ipHash: string, ua: string) {
  const sql = db();
  if (!sql) throw new Error('DATABASE_URL is not set');
  await ensureSchema();
  const token = randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  await sql`INSERT INTO admin_sessions (token_hash, expires_at, ip_hash, user_agent) VALUES (${sha256(token)}, ${expires}, ${ipHash}, ${ua.slice(0, 300)})`;
  // Path "/" so /api/collect can see it and skip tracking your own visits.
  cookies.set(SESSION_COOKIE, token, { path: '/', httpOnly: true, secure, sameSite: 'lax', expires });
}

/** Returns true when the request carries a valid, unexpired admin session. */
export async function isAdmin(cookies: AstroCookies) {
  const token = cookies.get(SESSION_COOKIE)?.value;
  const sql = db();
  if (!token || !sql) return false;
  try {
    await ensureSchema();
    const rows = await sql`
      UPDATE admin_sessions SET last_seen = now()
      WHERE token_hash = ${sha256(token)} AND expires_at > now()
      RETURNING token_hash`;
    return rows.length > 0;
  } catch {
    return false;
  }
}

export async function destroySession(cookies: AstroCookies) {
  const token = cookies.get(SESSION_COOKIE)?.value;
  const sql = db();
  if (token && sql) await sql`DELETE FROM admin_sessions WHERE token_hash = ${sha256(token)}`.catch(() => {});
  cookies.delete(SESSION_COOKIE, { path: '/' });
}
