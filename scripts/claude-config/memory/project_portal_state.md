---
name: Research Portal Current State
description: Current state of the research portal app — tech stack, features, company count, and architecture decisions as of March 2026
type: project
---

**Stack:** Vite + React (single App.jsx) + Supabase backend, deployed on Vercel via GitHub (ylin122/research-portal)

**Supabase project:** https://azhbbywzspflrxpqrdqw.supabase.co
- Tables: companies, company_fields, company_notes, news_cache, sector_notes
- RLS enabled with open policies (no auth)
- company_fields stores all structured data including public_private classification

**App structure:** research-portal-app/ subdirectory in repo. Vercel root directory set to research-portal-app.

**Features built:**
- Dark Bloomberg-style UI with sidebar navigation
- 8 sectors: Software, Digital Infrastructure, IT Services, Internet, Hardware, Education, Healthcare IT + Prompt/Source tabs
- Editable sector/sub-sector per company (pencil icon)
- Priority system: High/Medium/Low with filtering on home page
- Public/Private classification per company (toggleable badge)
- Alphabetical company sorting
- Search works across collapsed sectors
- Recent Updates feed on home page (sorted by edit date, filterable by priority)
- News refresh via Anthropic API (needs VITE_ANTHROPIC_API_KEY)
- Sector stat cards (4-column grid)
- Research notes per company
- 7 structured fields per company: overview, products, customers, industry, competitive, transactions, financials

**Company count:** ~144 (32 public, 112 private) across all sectors

**How to add companies:** Write a .cjs script using dotenv + @supabase/supabase-js, upsert into companies + company_fields tables. Pattern established in insert-batch*.cjs files.

**How to run locally:** cd research-portal-app && npm run dev → localhost:5173

**Why:** The portal is a refresher/learning tool for a massive coverage universe. No financials. User is in PE/investment research. Briefs are written in bullet format, no periods, portfolio-manager tone.
