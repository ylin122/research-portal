---
name: Research Portal Identity
description: "Research portal" always means ~/projects/research-portal — never the PA dashboard
type: feedback
originSessionId: b0f3e709-e578-4d1b-b13b-2a57a7c525dd
---
"Research portal" and "open the research portal" always refers to the project at ~/projects/research-portal (Vite + React + Supabase). Never confuse it with the PA dashboard at ~/projects/pa-dashboard. They are separate projects.

**Why:** User was repeatedly frustrated by the two projects being conflated. This is a serious recurring mistake.

**How to apply:**
- "research portal", "open latest", or any ambiguous "open on chrome" WITHOUT context → research portal (https://research-portal-one.vercel.app/ or localhost in ~/projects/research-portal)
- "PA dashboard" explicitly → PA dashboard (https://dashboard-beta-seven-79.vercel.app/ — alias still active after rename — or localhost in ~/projects/pa-dashboard)
- When in doubt, ASK which one. Do not guess.
- The two projects must NEVER share the same localhost port. Use 3000 for PA dashboard, 3001 for research portal.
- Both projects run via `vercel dev --listen <port>` from their repo root (yarn is installed globally so the initial-build step works).
