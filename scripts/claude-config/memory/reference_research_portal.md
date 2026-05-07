---
name: Research Portal
description: Research portal project — Vercel project, deployment URL, GitHub repo, local path
type: reference
originSessionId: e342bb59-4c4e-4edc-bb1d-ea8ff11664e2
---
- User-facing name: **Research Portal**; canonical slug: `research-portal`
- Vercel deployment: https://research-portal-one.vercel.app/
- Vercel project name: `research-portal` (id `prj_IiX8TS7pFzXxZEhhZmjTMx8IVLdj`; renamed from `research-portal-app` 2026-05-06; rootDirectory cleared)
- GitHub repo: https://github.com/ylin122/research-portal
- Local path: `~/projects/research-portal` (relocated from `~/research-portal` 2026-05-07)
- Default local dev port: **5180** (pinned in `vite.config.js`)
- Local dev: `cd ~/projects/research-portal && npm run dev` → http://localhost:5180
- Tech stack: Vite + React, Supabase backend, Recharts for charts
- Env vars live in Vercel (Development + Production): VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, ALPHA_VANTAGE_API_KEY. Pull with `vercel env pull .env.local`.
