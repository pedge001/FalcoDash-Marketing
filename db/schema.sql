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
