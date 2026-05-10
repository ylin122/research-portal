---
name: Tax rates for portfolio calculations
description: User's NYC marginal capital gains tax stack — LT 34.526%, ST 51.526%. Single source of truth in PA dashboard's TAX_RATES constant.
type: user
originSessionId: 2dad95f2-0074-4023-8438-259b927f34b5
---
User's NYC marginal capital gains tax rates (specified 2026-05-10):

| Type | Federal | NIIT | NY State | NYC | **Total** |
|---|---|---|---|---|---|
| **Long-term cap gains / qualified dividends** | 20.0% | 3.8% | 6.85% | 3.876% | **34.526%** |
| **Short-term cap gains / ordinary div / interest** | 37.0% | 3.8% | 6.85% | 3.876% | **51.526%** |

Use the precise rates above (not the rounded "30% LT / 45% ST" mental model from prior).

**Where used in PA dashboard:**
- `src/lib/constants.js` → `TAX_RATES` export (single source of truth)
- `src/components/analytics/TaxSubTab.jsx` (Rebalance tab) — imports `TAX_RATES`

NJ rates also tracked in `TAX_RATES` (ST 49.770%, LT 32.770%) for relocation-savings comparison in Rebalance tab. NJ uses 8.97% state, no local.

The NY State 6.85% bracket corresponds to MFJ income roughly $215k–$323k. (The prior TaxSubTab assumed 9.65% / $800k MFJ — user-corrected to 6.85% on this date.)
