import type { APIRoute } from 'astro';
import { db } from '~/lib/db';

export const prerender = false;

export const GET: APIRoute = async () => {
  const sql = db();
  let database: 'ok' | 'error' | 'not_configured' = 'not_configured';
  if (sql) {
    try {
      await sql`SELECT 1`;
      database = 'ok';
    } catch {
      database = 'error';
    }
  }
  return Response.json(
    { ok: true, database, email: process.env.RESEND_API_KEY ? 'configured' : 'not_configured' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
};
