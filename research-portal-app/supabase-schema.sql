-- ============================================================
-- Research Portal — Supabase Schema (canonical)
-- Run this in Supabase SQL Editor. Idempotent: safe to re-run.
--
-- Security model:
--   • Every write goes through an authenticated browser session
--     (Supabase Auth signInWithPassword in App.jsx).
--   • Server functions (api/financials.mjs) verify the JWT before any work.
--   • RLS policies require auth.uid() IS NOT NULL on every table.
--   • The anon key in the client bundle is *only* usable for SELECT/INSERT
--     when the request carries a valid JWT.
--
-- One-time setup in Supabase Dashboard before this app works end-to-end:
--   1. Authentication > Users > Add user (email + password). This becomes
--      your sign-in credential.
--   2. Run this file in SQL Editor.
-- ============================================================


-- ─── Tables in active use ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS companies (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  sector       TEXT NOT NULL,
  sub          TEXT NOT NULL,
  priority     TEXT DEFAULT '',
  moats        JSONB,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS company_fields (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company_id   TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  field_key    TEXT NOT NULL,
  text         TEXT DEFAULT '',
  date         TIMESTAMPTZ,
  UNIQUE (company_id, field_key)
);

CREATE TABLE IF NOT EXISTS sector_notes (
  key          TEXT PRIMARY KEY,
  text         TEXT DEFAULT '',
  date         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kb_articles (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  date            TIMESTAMPTZ,
  category        TEXT,
  content         TEXT,
  key_takeaways   JSONB,
  themes          JSONB,
  questions       JSONB,
  key_metrics     JSONB,
  investment_implications TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS concepts (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  topic        TEXT,
  one_liner    TEXT,
  body         TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS deep_dives (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  topic        TEXT,
  body         TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS principles (
  id           TEXT PRIMARY KEY,
  title        TEXT,
  body         TEXT,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prompts (
  id           TEXT PRIMARY KEY,
  title        TEXT,
  body         TEXT,
  category     TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quick_notes (
  id           TEXT PRIMARY KEY,
  text         TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sources (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  url          TEXT,
  category     TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_runs (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  agent_name   TEXT,
  status       TEXT,
  detail       JSONB,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_definitions (
  id           TEXT PRIMARY KEY,
  name         TEXT,
  description  TEXT,
  config       JSONB,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS financials_cache (
  ticker       TEXT PRIMARY KEY,
  data         JSONB,
  updated_at   TIMESTAMPTZ DEFAULT now()
);


-- ─── Tables retained but no longer surfaced in the UI ────────
-- Keep them so historical rows aren't lost. The matching client code
-- and exports were removed from src/lib/db.js in the 2026-05 cleanup.
-- Drop manually if you don't want them in production.

CREATE TABLE IF NOT EXISTS company_notes (
  id           TEXT PRIMARY KEY,
  company_id   TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  text         TEXT NOT NULL,
  date         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news_cache (
  company_id   TEXT PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
  items        JSONB DEFAULT '[]'::jsonb,
  date         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_results (
  company_id   TEXT PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
  news         JSONB,
  transactions JSONB,
  competitive  JSONB,
  industry     JSONB,
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ideas (
  id           TEXT PRIMARY KEY,
  title        TEXT,
  status       TEXT,
  conviction   TEXT,
  body         TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS qa_log (
  id           TEXT PRIMARY KEY,
  question     TEXT,
  answer       TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS watchlist (
  id           TEXT PRIMARY KEY,
  keyword      TEXT,
  active       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT now()
);


-- ─── Indexes ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_company_fields_company ON company_fields(company_id);
CREATE INDEX IF NOT EXISTS idx_company_notes_company ON company_notes(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_sector ON companies(sector);
CREATE INDEX IF NOT EXISTS idx_kb_articles_created_at ON kb_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_concepts_title ON concepts(title);
CREATE INDEX IF NOT EXISTS idx_agent_runs_created_at ON agent_runs(created_at DESC);


-- ─── Row Level Security: lock to authenticated users only ────

DO $$
DECLARE t TEXT;
DECLARE pol TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'companies','company_fields','sector_notes','kb_articles','concepts',
    'deep_dives','principles','prompts','quick_notes','sources','agent_runs',
    'agent_definitions','financials_cache','company_notes','news_cache',
    'research_results','ideas','qa_log','watchlist'
  ])
  LOOP
    -- Enable RLS
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);

    -- Drop ALL existing policies on the table (catches the old open policies
    -- like "Allow all on X" plus any prior named auth policies).
    FOR pol IN
      SELECT policyname FROM pg_policies WHERE tablename = t AND schemaname = 'public'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol, t);
    END LOOP;

    -- Add the canonical auth-required policy (one ALL-verb policy is enough).
    EXECUTE format(
      'CREATE POLICY "auth_only" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      t
    );
  END LOOP;
END $$;

-- Verify: the SELECT below should return zero rows after this script runs.
-- Any row means a table is missing the auth_only policy or still has an extra
-- policy that needs investigation.
--
--   SELECT tablename, policyname FROM pg_policies
--   WHERE schemaname = 'public' AND policyname <> 'auth_only';
