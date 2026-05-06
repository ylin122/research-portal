---
name: Research Ingest Workflow
description: When user says "research ingest" — run the full pipeline: Gmail ingest, analyze, sync to Supabase and Obsidian
type: feedback
originSessionId: 5a8fbd21-1d4e-494c-96b4-5342a2923a64
---
When user asks to "ingest research" or "research ingest", run the FULL pipeline:
1. **Ingest** — `python3 scripts/gmail_ingest.py` (Gmail → Supabase kb_articles)
2. **Analyze** — Summarize new articles (key takeaways, tickers, relevance to portfolio)
3. **Sync** — Export from Supabase → Obsidian vault as markdown files

**Why:** User has asked for this multiple times. The script at ~/projects/research-portal/scripts/gmail_ingest.py currently only does step 1. Steps 2 and 3 are documented in the script header but not yet implemented. User has an Obsidian vault path already set up from prior sessions.

**How to apply:** Don't just run the ingest — run all 3 steps. If steps 2/3 aren't built yet, build them or tell the user they need to be built.
- Always include `published_date` for each article (the date the article was originally published, not the date it was emailed/ingested)
- Pull actual article titles from content/URL, not generic email subjects like "Research"
- Skip non-research emails (Google Cloud notifications, etc.)
- Portfolio exposure tags should be thoughtful and critical — only key tickers with direct material relevance
- **Portfolio exposure formatting:** Always place "Portfolio exposure: TICKERS" on its own line, separated by a paragraph break (`\n\n`) from the investment implications text — never inline at the end of a sentence
- **Published date is required:** Always fetch and set `published_date` for every article — use the article's actual publication date from the source, not the email/ingest date. If the source page doesn't have a date, use the email date as fallback.
