-- ============================================================
-- Research Portal — Supabase Schema (canonical)
-- Run this in Supabase SQL Editor. Idempotent: safe to re-run.
--
-- Columns are reconciled against actual client code:
--   src/lib/db.js, KnowledgeBase.jsx, KnowledgeInterests.jsx,
--   QuickNotes.jsx, Sources.jsx, Prompts.jsx, Principles.jsx,
--   AgentsTools.jsx, AuditLog.jsx, Dashboard.jsx, AIDisruption.jsx.
--
-- Each table block does:
--   1. CREATE TABLE IF NOT EXISTS  — for fresh installs.
--   2. ALTER TABLE ... ADD COLUMN IF NOT EXISTS — for existing
--      databases that pre-date a column. PostgreSQL ignores the
--      ADD COLUMN if the column already exists.
--
-- Security model:
--   • Every write goes through an authenticated browser session
--     (Supabase Auth signInWithPassword in App.jsx).
--   • Server function api/financials.mjs verifies the JWT before any work.
--   • RLS policies require the request to be authenticated on every table.
--
-- One-time setup in Supabase Dashboard before this app works end-to-end:
--   1. Authentication > Users > Add user (email + password). This is
--      your sign-in credential.
--   2. Run this file in SQL Editor.
-- ============================================================


-- ─── Tables in active use ─────────────────────────────────────

-- companies: master list of tracked tickers.
CREATE TABLE IF NOT EXISTS companies (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  sector       TEXT NOT NULL,
  sub          TEXT NOT NULL,
  priority     TEXT DEFAULT '',
  moats        JSONB,
  created_at   TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT '';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS moats JSONB;

-- company_fields: per-company free-text fields (thesis, news, financials, etc.).
CREATE TABLE IF NOT EXISTS company_fields (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company_id   TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  field_key    TEXT NOT NULL,
  text         TEXT DEFAULT '',
  date         TIMESTAMPTZ,
  UNIQUE (company_id, field_key)
);

-- kb_articles: research articles ingested from Gmail + analyzed.
CREATE TABLE IF NOT EXISTS kb_articles (
  id                       TEXT PRIMARY KEY,
  title                    TEXT NOT NULL,
  date                     TIMESTAMPTZ,
  category                 TEXT,
  content                  TEXT,
  summary                  TEXT,
  source_url               TEXT,
  source_type              TEXT,
  published_date           TEXT,
  tags                     JSONB,
  themes                   JSONB,
  key_takeaways            JSONB,
  key_metrics              JSONB,
  questions                JSONB,
  investment_implications  TEXT,
  created_at               TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS summary                 TEXT;
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS source_url              TEXT;
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS source_type             TEXT;
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS published_date          TEXT;
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS tags                    JSONB;
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS themes                  JSONB;
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS key_takeaways           JSONB;
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS key_metrics             JSONB;
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS questions               JSONB;
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS investment_implications TEXT;

-- concepts: short-form glossary terms (Knowledge / Interests > Concepts tab).
CREATE TABLE IF NOT EXISTS concepts (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  topic           TEXT,
  one_liner       TEXT,
  explanation     TEXT,
  example         TEXT,
  analogy         TEXT,
  key_points      JSONB,
  why_it_matters  TEXT,
  related         JSONB,
  created_at      TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE concepts ADD COLUMN IF NOT EXISTS one_liner      TEXT;
ALTER TABLE concepts ADD COLUMN IF NOT EXISTS explanation    TEXT;
ALTER TABLE concepts ADD COLUMN IF NOT EXISTS example        TEXT;
ALTER TABLE concepts ADD COLUMN IF NOT EXISTS analogy        TEXT;
ALTER TABLE concepts ADD COLUMN IF NOT EXISTS key_points     JSONB;
ALTER TABLE concepts ADD COLUMN IF NOT EXISTS why_it_matters TEXT;
ALTER TABLE concepts ADD COLUMN IF NOT EXISTS related        JSONB;

-- deep_dives: long-form articles (Knowledge / Interests > Deep Dives tab).
CREATE TABLE IF NOT EXISTS deep_dives (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  topic        TEXT,
  summary      TEXT,
  sections     JSONB,
  created_at   TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE deep_dives ADD COLUMN IF NOT EXISTS summary  TEXT;
ALTER TABLE deep_dives ADD COLUMN IF NOT EXISTS sections JSONB;

-- principles: investing principles list (sorted manually via sort_order).
CREATE TABLE IF NOT EXISTS principles (
  id           TEXT PRIMARY KEY,
  title        TEXT,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE principles ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE principles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- prompts: reusable Claude Code prompts.
CREATE TABLE IF NOT EXISTS prompts (
  id           TEXT PRIMARY KEY,
  title        TEXT,
  prompt_text  TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS prompt_text TEXT;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ DEFAULT now();
-- Backfill: if rows still hold the old `body` column, copy it once into prompt_text.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='prompts' AND column_name='body'
  ) THEN
    EXECUTE 'UPDATE prompts SET prompt_text = COALESCE(prompt_text, body) WHERE prompt_text IS NULL';
  END IF;
END $$;

-- quick_notes: short notes from the Notes tab.
CREATE TABLE IF NOT EXISTS quick_notes (
  id           TEXT PRIMARY KEY,
  content      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE quick_notes ADD COLUMN IF NOT EXISTS content TEXT;
-- Backfill: if rows still hold the old `text` column, copy into content.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quick_notes' AND column_name='text'
  ) THEN
    EXECUTE 'UPDATE quick_notes SET content = COALESCE(content, text) WHERE content IS NULL';
  END IF;
END $$;

-- sources: trusted research sources directory.
CREATE TABLE IF NOT EXISTS sources (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  url          TEXT,
  category     TEXT,
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE sources ADD COLUMN IF NOT EXISTS description TEXT;
-- Backfill: if rows still hold the old `notes` column, copy into description.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='sources' AND column_name='notes'
  ) THEN
    EXECUTE 'UPDATE sources SET description = COALESCE(description, notes) WHERE description IS NULL';
  END IF;
END $$;

-- agent_runs: audit log of agent executions (AuditLog tab).
CREATE TABLE IF NOT EXISTS agent_runs (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  agent_name      TEXT,
  task            TEXT,
  changes         TEXT,
  files_modified  JSONB,
  issues_found    INTEGER,
  issues_fixed    INTEGER,
  duration_ms     BIGINT,
  project         TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS task           TEXT;
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS changes        TEXT;
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS files_modified JSONB;
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS issues_found   INTEGER;
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS issues_fixed   INTEGER;
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS duration_ms    BIGINT;
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS project        TEXT;

-- agent_definitions: copies of agent prompt files (Agents/Tools tab).
CREATE TABLE IF NOT EXISTS agent_definitions (
  id           TEXT PRIMARY KEY,
  name         TEXT,
  description  TEXT,
  tools        TEXT,
  body         TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE agent_definitions ADD COLUMN IF NOT EXISTS tools TEXT;
ALTER TABLE agent_definitions ADD COLUMN IF NOT EXISTS body  TEXT;

-- financials_cache: per-ticker cached EDGAR + Yahoo data (api/financials.mjs).
CREATE TABLE IF NOT EXISTS financials_cache (
  ticker       TEXT PRIMARY KEY,
  data         JSONB,
  updated_at   TIMESTAMPTZ DEFAULT now()
);


-- ─── Tables retained but no longer surfaced in the UI ────────
-- Keep them so historical rows aren't lost. The matching client
-- code was removed from src/lib/db.js. Drop manually if you want
-- a clean prod database.

CREATE TABLE IF NOT EXISTS company_notes (
  id           TEXT PRIMARY KEY,
  company_id   TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  text         TEXT NOT NULL,
  date         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sector_notes (
  key          TEXT PRIMARY KEY,
  text         TEXT DEFAULT '',
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
CREATE INDEX IF NOT EXISTS idx_company_notes_company  ON company_notes(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_sector       ON companies(sector);
CREATE INDEX IF NOT EXISTS idx_kb_articles_created_at ON kb_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_concepts_title         ON concepts(title);
CREATE INDEX IF NOT EXISTS idx_agent_runs_created_at  ON agent_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_runs_project     ON agent_runs(project);


-- ─── Row Level Security: lock to authenticated users only ────

DO $$
DECLARE t TEXT;
DECLARE pol TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'companies','company_fields','kb_articles','concepts',
    'deep_dives','principles','prompts','quick_notes','sources','agent_runs',
    'agent_definitions','financials_cache','company_notes','sector_notes',
    'news_cache','research_results','ideas','qa_log','watchlist'
  ])
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);

    -- Drop ALL existing policies on the table (catches old open policies
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
-- Any row means a table is missing the auth_only policy or still has an
-- extra policy that needs investigation.
--
--   SELECT tablename, policyname FROM pg_policies
--   WHERE schemaname = 'public' AND policyname <> 'auth_only';
