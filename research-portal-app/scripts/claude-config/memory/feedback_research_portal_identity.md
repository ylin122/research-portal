---
name: Research Portal Identity
description: "Research portal" always means ~/research-portal/research-portal-app — never the PA dashboard
type: feedback
---

"Research portal" and "open the research portal" always refers to the project at ~/research-portal/research-portal-app (Vite + React + Supabase). Never confuse it with the PA dashboard at ~/pa-dashboard. They are separate projects.

**Why:** User was repeatedly frustrated by the two projects being conflated. This is a serious recurring mistake.

**How to apply:**
- "research portal", "open latest", or any ambiguous "open on chrome" WITHOUT context → research portal (https://research-portal-one.vercel.app/ or localhost via `vercel dev` in ~/research-portal/research-portal-app)
- "PA dashboard" explicitly → PA dashboard (https://dashboard-beta-seven-79.vercel.app/ or localhost via `vercel dev` in ~/pa-dashboard)
- When in doubt, ASK which one. Do not guess.
- The two projects must NEVER share the same localhost port. Use 5173 for PA dashboard, 5174 for research portal (or vice versa, but keep them separate).
