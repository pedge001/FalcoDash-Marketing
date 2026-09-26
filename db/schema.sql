-- FalcoDash marketing site schema. Idempotent: safe to run on every deploy.

CREATE TABLE IF NOT EXISTS leads (
  id            BIGSERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  company       TEXT,
  industry      TEXT,
  phone         TEXT,
  message       TEXT NOT NULL,
  source        TEXT,
  attribution   JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_hash       TEXT,
  user_agent    TEXT,
  status        TEXT NOT NULL DEFAULT 'new',
  notified_at   TIMESTAMPTZ,
  notify_error  TEXT
);

-- Visitor location from Cloudflare's request headers (country always; region/city when the
-- "Add visitor location headers" managed transform is on).
ALTER TABLE leads ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS region  TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS city    TEXT;

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads (lower(email));
CREATE INDEX IF NOT EXISTS leads_ip_hash_created_idx ON leads (ip_hash, created_at DESC);

-- Lead pipeline (managed in /admin).
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes      TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;
-- Link a lead to the analytics visitor/session that submitted it.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS visitor_id TEXT;
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);

-- ---------- First-party analytics ----------
-- One row per page view, written by /api/collect. No cookies: visitor_id is a random ID kept in
-- the browser's localStorage (or a daily-rotating hash when the visitor sends Global Privacy Control).
CREATE TABLE IF NOT EXISTS pageviews (
  id            BIGSERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  pv_id         TEXT NOT NULL,
  session_id    TEXT NOT NULL,
  visitor_id    TEXT NOT NULL,
  is_entry      BOOLEAN NOT NULL DEFAULT false,
  path          TEXT NOT NULL,
  title         TEXT,
  referrer      TEXT,
  referrer_host TEXT,
  channel       TEXT NOT NULL DEFAULT 'Direct',
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  utm_term      TEXT,
  utm_content   TEXT,
  country       TEXT,
  region        TEXT,
  region_code   TEXT,
  city          TEXT,
  postal_code   TEXT,
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  timezone      TEXT,
  device        TEXT,
  browser       TEXT,
  os            TEXT,
  screen_w      INTEGER,
  engaged_ms    INTEGER NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX IF NOT EXISTS pageviews_pv_id_idx ON pageviews (pv_id);
CREATE INDEX IF NOT EXISTS pageviews_created_idx ON pageviews (created_at DESC);
CREATE INDEX IF NOT EXISTS pageviews_session_idx ON pageviews (session_id, created_at);
CREATE INDEX IF NOT EXISTS pageviews_visitor_idx ON pageviews (visitor_id, created_at);

-- Custom events: lead submissions, outbound clicks, CTA clicks.
CREATE TABLE IF NOT EXISTS events (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  name        TEXT NOT NULL,
  session_id  TEXT,
  visitor_id  TEXT,
  path        TEXT,
  props       JSONB NOT NULL DEFAULT '{}'::jsonb,
  country     TEXT,
  city        TEXT
);
CREATE INDEX IF NOT EXISTS events_created_idx ON events (created_at DESC);
CREATE INDEX IF NOT EXISTS events_name_idx ON events (name, created_at DESC);

-- Search engine and AI crawler requests, logged by server.mjs (crawlers don't run JavaScript).
CREATE TABLE IF NOT EXISTS crawler_hits (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  bot         TEXT NOT NULL,
  kind        TEXT NOT NULL,
  path        TEXT NOT NULL,
  status      INTEGER,
  country     TEXT
);
CREATE INDEX IF NOT EXISTS crawler_hits_created_idx ON crawler_hits (created_at DESC);
CREATE INDEX IF NOT EXISTS crawler_hits_bot_idx ON crawler_hits (bot, created_at DESC);

-- ---------- Admin auth ----------
CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash  TEXT PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL,
  last_seen   TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash     TEXT,
  user_agent  TEXT
);
CREATE TABLE IF NOT EXISTS admin_login_tokens (
  token_hash  TEXT PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash     TEXT NOT NULL,
  method      TEXT NOT NULL,
  ok          BOOLEAN NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_login_attempts_ip_idx ON admin_login_attempts (ip_hash, created_at DESC);
