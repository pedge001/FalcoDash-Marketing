import postgres from 'postgres';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

let sql: postgres.Sql | null = null;
let ready: Promise<void> | null = null;

/** Lazily connected client. Returns null when DATABASE_URL is not set (e.g. local dev without Postgres). */
export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!sql) {
    sql = postgres(url, {
      max: 5,
      idle_timeout: 30,
      connect_timeout: 10,
      // Railway's private network doesn't use TLS; public proxy URLs do.
      ssl: /railway\.internal|localhost|127\.0\.0\.1/.test(url) ? false : 'require',
      onnotice: () => {},
    });
  }
  return sql;
}

/** Applies db/schema.sql once per process (it is idempotent), as a backstop to the pre-deploy migration. */
export async function ensureSchema() {
  const s = db();
  if (!s) return;
  ready ??= (async () => {
    const ddl = readFileSync(join(process.cwd(), 'db/schema.sql'), 'utf8');
    await s.unsafe(ddl);
  })().catch((err) => {
    ready = null;
    throw err;
  });
  return ready;
}
