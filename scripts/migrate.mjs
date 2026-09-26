// Runs db/schema.sql against DATABASE_URL. Used as Railway's pre-deploy command.
import postgres from 'postgres';
import { readFileSync } from 'node:fs';

const url = process.env.DATABASE_URL;
if (!url) {
  console.warn('[migrate] DATABASE_URL is not set; skipping.');
  process.exit(0);
}
const sql = postgres(url, { max: 1, ssl: /railway\.internal|localhost|127\.0\.0\.1/.test(url) ? false : 'require', onnotice: () => {} });
try {
  await sql.unsafe(readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8'));
  console.log('[migrate] schema up to date');
} catch (err) {
  console.error('[migrate] failed:', err.message);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
