---
name: feedback-beta-3y-only
description: "User wants 3Y beta only — never asked for 5Y. BETA_STATIC in PA Dashboard must be 3Y, computed from daily adjclose returns vs SPY, never Yahoo's 5Y monthly."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c82f58f7-2193-4b24-98da-7187fd2af642
---

For PA Dashboard `BETA_STATIC`, always use **3Y beta computed from daily adjclose returns vs SPY** (Cov / Var over trailing 756 days). Never use Yahoo's 5Y monthly `beta` field.

**Why:** User never asked for 5Y beta — only 3Y. The pa-refresh agent originally wrote Yahoo's 5Y monthly `beta` to BETA_STATIC by default (Yahoo's `quoteSummary.defaultKeyStatistics.beta` field), which produced values the user didn't want. Mobile dashboard label was even "Beta 5Y M". Corrected on 2026-05-13.

**How to apply:**
- `BETA_STATIC` values must be 3Y betas, same source as the live 1Y beta in `fetchRiskData` (daily adjclose returns vs SPY) — just a different window (756 vs 252 days).
- Mobile dashboard label is "Beta 3Y" (not "Beta 5Y M").
- When a ticker has insufficient history (< 100 trading days, e.g., a newly-launched ETF like DRAM), preserve the existing value and flag it in the refresh report.
- Pa-refresh agent spec (`~/.claude/agents/pa-refresh.md`) was updated to reflect this — Step 9 reads from Step 10's 3Y beta computation rather than Yahoo's 5Y `beta` field.

Related: [[project_pa_dashboard]] · [[reference_pa_dashboard]]
