---
name: Research Portal
description: Research portal project — Vercel project, deployment URL, GitHub repo, local path
type: reference
originSessionId: e342bb59-4c4e-4edc-bb1d-ea8ff11664e2
---
- Vercel deployment: https://research-portal-one.vercel.app/
- Vercel project name: `research-portal` (renamed from `research-portal-app` on 2026-05-06; rootDirectory cleared)
- GitHub repo: https://github.com/ylin122/research-portal
- Local path: ~/projects/research-portal (flattened from research-portal/research-portal-app/ on 2026-05-06)
- Tech stack: Vite + React, Supabase backend, Recharts for charts
- Env vars live in Vercel (Development + Production): VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, ALPHA_VANTAGE_API_KEY. Pull with `vercel env pull .env.local`.
