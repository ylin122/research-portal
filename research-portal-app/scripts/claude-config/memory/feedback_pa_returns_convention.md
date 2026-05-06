---
name: PA dashboard return-type convention (TR vs price)
description: Which charts/metrics in the PA dashboard use total return (adjclose) vs price return (close-only). Critical to remember.
type: feedback
originSessionId: 1e31aa4f-2dcf-4c50-9cc1-d5e2b6852840
---
PA dashboard return-type convention — **two parallel datasets** must be available:

| Surface | Return type | Yahoo field |
|---|---|---|
| ETF Sensitivity tab chart % | **Price return** | `close` |
| Stock Sensitivity tab chart % | **Price return** | `close` |
| Dashboard "Portfolio Performance" chart | **Total return** | adjclose-derived TWR |
| Risk tab "Portfolio Value Over Time" chart | **Total return** | adjclose-derived TWR |
| Sharpe / IR / Volatility / Beta calculations | **Total return** | `adjclose` (always) |
| SPY benchmark (vs SPY TR column, IR active return) | **Total return** | `adjclose` |

**Why:** User cross-checks single-ticker charts against Yahoo Finance website, which shows price return only. Mismatch on individual ticker = looks like a bug. Portfolio-level analytics need TR for accurate investor return + correct Sharpe/IR/vol math (close-only inflates IR by ~1.8pp/yr because SPY's div yield is missed).

**How to apply:**
- `/api/history` must continue returning **both** `close` and `adjclose` (single fetch, both fields available).
- When wiring a NEW chart: ask which type. Default for single-ticker stock/ETF charts = price return. Default for portfolio aggregates and any risk-analytics math = total return.
- Never use close-only for Sharpe/IR/Beta/vol calcs — that was the original bug we fixed in `api/history.mjs` + `PortfolioDashboard.jsx fetchRiskData`.
- The "vs SPY TR" column is explicitly TR — keep it adjclose-based.
