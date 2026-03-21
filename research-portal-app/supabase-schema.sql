-- ============================================================
-- Research Portal — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Companies table
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  sub TEXT NOT NULL,
  priority TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Company fields (research brief sections)
CREATE TABLE IF NOT EXISTS company_fields (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL,
  text TEXT DEFAULT '',
  date TIMESTAMPTZ,
  UNIQUE(company_id, field_key)
);

-- 3. Company notes
CREATE TABLE IF NOT EXISTS company_notes (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT now()
);

-- 4. News cache
CREATE TABLE IF NOT EXISTS news_cache (
  company_id TEXT PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]'::jsonb,
  date TIMESTAMPTZ DEFAULT now()
);

-- 5. Sector notes (macro thesis per sector)
CREATE TABLE IF NOT EXISTS sector_notes (
  key TEXT PRIMARY KEY,
  text TEXT DEFAULT '',
  date TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_company_fields_company ON company_fields(company_id);
CREATE INDEX IF NOT EXISTS idx_company_notes_company ON company_notes(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_sector ON companies(sector);

-- ============================================================
-- Row Level Security — allow public read/write via anon key
-- (For a production app you'd want proper auth policies)
-- ============================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE sector_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on companies" ON companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on company_fields" ON company_fields FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on company_notes" ON company_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on news_cache" ON news_cache FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sector_notes" ON sector_notes FOR ALL USING (true) WITH CHECK (true);
