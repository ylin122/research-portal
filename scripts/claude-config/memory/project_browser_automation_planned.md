---
name: Browser automation tool — planned
description: User wants a Playwright + persistent-Chrome harness built; deferred as of 2026-05-12
type: project
originSessionId: 9ff3e778-579a-41b1-ae25-07618d246c16
---
User wants to build out browser automation: `npm install playwright` + a small harness (~50-150 LOC) that launches Chrome with a persistent user-data-dir so logins/cookies/2FA-trusted-device state survive between runs (same pattern as the Third Bridge tool). Purpose: scrape no-API web data, keep PA Dashboard hand-seeded figures fresh (ETF weights, betas), visually verify deploys via screenshots, and E2E-test the two apps.

**Status:** Approved in concept on 2026-05-12, explicitly deferred ("let's do it later"). Not started.

**Agreed first concrete target when we do it:** StockAnalysis.com ETF holdings/weights scraper → auto-update `ETF_SENSITIVITY` in `~/projects/pa-dashboard/src/lib/constants.js` (currently a manual refresh pain point, documented in code comments). Suggested home: new `~/projects/web-tools` repo or fold into research-portal.

**Caveat the user is aware of:** logged-in automation acts as the user on those accounts — treat anything stateful (submit/post/download) like `git push`, confirm first.
