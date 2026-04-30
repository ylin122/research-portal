---
name: PA Dashboard Project
description: PA dashboard (portfolio analytics) at ~/pa-dashboard — built and developed via Claude Code CLI
type: project
originSessionId: 6adfe949-fbcb-4b4a-992e-9de13ae3e182
---
PA Dashboard at ~/pa-dashboard (Vite + React + Supabase). Deployed at https://dashboard-beta-seven-79.vercel.app/

**Why:** Portfolio analytics dashboard tracking equity holdings, semiconductor ETFs, and related research. User calls it "PA dashboard". Built and iterated entirely via Claude Code CLI.

**How to apply:**
- Local dev: use `vercel dev` (NOT `npm run dev`) so API functions run locally
- 6 tabs: Dashboard, Sensitivity, Research, Analytics, Trading, Refresh Log
- Positions from Fidelity statements (3/31/2026): 7 accounts (Individual Y, Joint WROS, Individual W, Individual Q, IRA Y, Roth W, Rollover W)
- Yahoo Finance API integration: `/api/quote` (live prices, P/E, fwd P/E, earnings dates), `/api/history` (historical prices for charts)
- Auto-refresh on page load fetches 66+ tickers (portfolio + SMH + SOXX + DRAM constituents + research)
- ETF_SENSITIVITY has 3 ETFs: SMH (25 holdings), SOXX (30 holdings), DRAM (9 holdings)
- Effective Position Exposure (overlap analysis) on Dashboard tab: decomposes ETF holdings into constituent positions
- Forward P/E uses Yahoo's `priceEpsCurrentYear` field (matches website), NOT `forwardPE` (which is NTM blended)
- Vercel-GitHub auto-deploy; `npm run deploy` for one-command commit+push
- Dark theme: #0B0F19 bg, #F8FAFC headers, #94A3B8 secondary, #3B82F6 accent, DM Sans font
