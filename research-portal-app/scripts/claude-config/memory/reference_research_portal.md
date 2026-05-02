---
name: Research Portal Vercel URL
description: The research portal project is deployed at research-portal-one.vercel.app, repo is ylin122/research-portal on GitHub
type: reference
originSessionId: e342bb59-4c4e-4edc-bb1d-ea8ff11664e2
---
- Vercel deployment: https://research-portal-one.vercel.app/
- Vercel project name: `research-portal-app` (under `ylin122-2906s-projects` scope) — NOT `research-portal`
- GitHub repo: https://github.com/ylin122/research-portal (git root at ~/research-portal, app code in research-portal-app/ subdir)
- Local path: ~/research-portal/research-portal-app
- Tech stack: Vite + React, Supabase backend, Recharts for charts
- Env vars live in Vercel (Development + Production): VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, ALPHA_VANTAGE_API_KEY. Pull with `vercel env pull .env.local`.
