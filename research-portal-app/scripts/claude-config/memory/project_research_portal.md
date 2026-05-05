---
name: Research Portal Project
description: Vite + React + Supabase research portal for tracking software/tech companies — structure, DB patterns, and workflow
type: project
originSessionId: 5a8fbd21-1d4e-494c-96b4-5342a2923a64
---
Research portal at ~/projects/research-portal/research-portal-app (Vite + React + Supabase).

**Why:** User is a portfolio manager building an investment research dashboard to track companies across software, IT services, healthcare IT, and other sectors.

**How to apply:**
- Live app uses Supabase (not the seed data in research-portal.jsx which is an older standalone version)
- Company data lives in `companies`, `company_fields`, `company_notes`, `news_cache`, `sector_notes` tables
- To update companies, write a .cjs script using dotenv + @supabase/supabase-js and upsert
- Existing company IDs follow pattern: `companyname_s` (e.g., `bmcsoftware_s`, `avalara_s`)
- Fields: overview, products, customers, industry, competitive, transactions, financials
- Financials section always left empty per user instruction
- Dev server: from repo root `~/projects/research-portal`, run `vercel dev --listen 3000` (Vercel project has root directory set to `research-portal-app`, so running from the subdirectory doubles the path). Vercel CLI's "Creating initial build" step calls `yarn` — if yarn isn't installed it fails before binding the port. Workaround: `cd research-portal-app && npm run dev -- --port 3001` (skips API routes but boots the UI). Long-term fix: `npm i -g yarn`.
- Production URL: https://research-portal-one.vercel.app/
