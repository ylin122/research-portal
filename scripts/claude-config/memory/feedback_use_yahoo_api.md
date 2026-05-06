---
name: Use Yahoo Finance API for live prices
description: Always use the dashboard's Yahoo Finance API (/api/quote) to fetch latest prices when running portfolio analysis — never rely on stale static prices in code
type: feedback
---

Always fetch live prices from the Yahoo Finance API when doing portfolio analysis, tax calculations, or trade planning. Do not rely on the static `P = {}` prices in PortfolioDashboard.jsx — those are from the last refresh and may be stale.

**Why:** Static prices in the code are snapshot values from the last refresh. The user has a live Yahoo Finance API set up at `/api/quote` that returns current market prices. Using stale prices leads to wrong gain/loss calculations and bad trade recommendations.

**How to apply:** Before any portfolio analysis, call the Vercel-deployed API (e.g., `https://dashboard-beta-seven-79.vercel.app/api/quote?symbols=TICKER1,TICKER2`) to get current prices. Use these for all gain/loss and tax impact calculations.
