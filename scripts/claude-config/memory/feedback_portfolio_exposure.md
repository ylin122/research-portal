---
name: Portfolio exposure on its own line
description: In research wiki article analysis, always put "Portfolio exposure:" on its own separate line with a double newline before it
type: feedback
---

In investment_implications for research wiki articles, "Portfolio exposure: [TICKERS]" must always appear on its own line, separated from the preceding text by a double newline (\n\n). Do not inline it at the end of a sentence.

**Why:** User wants portfolio exposure to render as its own row in the Research Wiki UI (which uses whiteSpace: pre-wrap).

**How to apply:** When generating investment_implications during research ingest analysis, always end with `\n\nPortfolio exposure: TICKER1, TICKER2` as the last line, separated from the analysis text above.
