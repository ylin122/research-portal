---
name: edgartools financial statement column order
description: When pulling financials with edgartools, always display periods left-to-right from earliest to latest
type: feedback
originSessionId: e8319c12-b220-43e4-bc2e-de1e4de2672b
---
When presenting financial statements pulled via edgartools (income statement, balance sheet, cash flow, etc.), always order the period columns left-to-right from **earliest to latest** (chronological, oldest on the left, most recent on the right).

**Why:** User's preferred reading order — makes period-over-period trend direction match natural left-to-right reading. edgartools' default XBRL rendering puts the latest period on the left, so the output must be reordered before showing it.

**How to apply:** Whenever reformatting an edgartools `Statements` / `Financials` / XBRL table for the user, flip the column order if it comes back latest-first. Applies to any financial statement from edgartools regardless of company or form (10-K, 10-Q, etc.).
