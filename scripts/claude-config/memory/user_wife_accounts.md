---
name: Account single-stock eligibility
description: Which accounts can buy single-stock equities vs ETFs-only. Critical for rebalance recommendations.
type: user
originSessionId: 095509f7-2a4f-45ca-aaca-9220f3fe6768
---
**Accounts that CAN buy single-stock equities:**
- Individual Y
- Joint WROS (JWROS)
- IRA Y

**Accounts RESTRICTED to ETFs only (no single stocks):**
- Individual W (wife Willie)
- Individual Q (wife Willie)
- Roth W = Roth IRA (wife Willie)
- Rollover W = Rollover IRA (wife Willie)

Note: "Rollover W" and "Rollover IRA" are the same Fidelity account (233-824657) — the dashboard uses "Rollover W" as the display name; Fidelity calls it Rollover IRA.

Rollover W currently holds legacy single-stock positions (NVDA, META, AAPL, AMZN) — those are inherited/pre-existing and dashboard flags them via `LEGACY_LOT_KEYS`. The rule applies to NEW single-stock buys going forward, not the existing holdings.

When recommending rebalances or new positions, only suggest single stocks for Individual Y, Joint WROS, or IRA Y. For W, Q, Roth W, Rollover W — only ETFs.
