---
name: project_pa_return_stats_panel
description: Deferred PA Dashboard work — add return-distribution / tail-risk stats analytics
metadata: 
  node_type: memory
  type: project
  originSessionId: 587a0ac2-5fe1-4912-b5f3-0bd5d6907071
---

Open thread (paused 2026-05-21): the user wants to understand portfolio returns from a
statistics perspective — skewness, fat tails / kurtosis, convexity & volatility drag,
ergodicity (time vs ensemble average), real-world distribution families, tail-risk
probability analysis. A full conceptual discussion was delivered 2026-05-21; the user
said "continue on this later."

Candidate PA Dashboard features identified but NOT yet approved or started:
- Portfolio-level skew & kurtosis of returns
- Expected Shortfall (CVaR) alongside the existing risk metrics (better than VaR)
- Geometric-vs-arithmetic return gap (volatility drag) per position

**Why:** The user explicitly deferred this; next session should pick up the thread
rather than re-deriving it. Implementation is an open offer, not a commitment.

**How to apply:** When the user returns to this, resume from the concepts already
covered and confirm which (if any) of the three candidate features they want built
before touching code. Risk-metric surfaces live in [[project_pa_dashboard.md]] —
Analytics tab (PerformanceAnalyticsSubTab.jsx, TaxSubTab.jsx, etc.).
