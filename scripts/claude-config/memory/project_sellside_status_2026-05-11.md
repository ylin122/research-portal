---
name: Sellside setup status (paused 2026-05-11)
description: In-progress state of sellside tooling at home machine — what works, what's pending, where to resume
type: project
originSessionId: 71d3351a-c0d2-4ee0-9971-b7cf23a5a289
---
User paused 2026-05-11 mid-session to relocate. Will resume.

**Done:**
- All 8 broker tools configured + authenticated at home (GS, MS, JPM, Barclays, BofA, DB, Citi, WF)
- `~/.claude/commands/sellside-login.md` + `~/.claude/commands/sellside.md` + `~/sellside_preflight.mjs` installed
- Each broker's `login.js` replaced with diag-login pattern (validates via API call before saving state). Originals kept as `login.js.original-broken-stable-url-gate`
- 4 Amazon PDFs downloaded end-to-end to `C:\Users\willi\sellside-research\Amazon\`: GS (872KB Q1 Review), JPM (1.7MB), MS (2.9MB GOOGL/AMZN/META), Barclays (269KB FedEx covering AMZN). Plus 4 text extracts.

**Pending — search-quality fixes per broker (auth fine, but search doesn't find target company):**
- **BofA**: `report "<company>"` can't find company filter on search results page. Selector mismatch vs work.
- **Citi**: autocomplete returns broad sector commentary, not company-tagged research. Need to drill into research content via different endpoint.
- **DB**: typeahead returns 0 companies for "Amazon". Need different query format or company-lookup endpoint.
- **WF**: global-search/v1 didn't return securityFilter. Fell back to text search → no AMZN-targeted hits.

**Pending — portal integration (user's original ask):**
- Drop sellside PDFs into Supabase `kb_articles` with `source_type='sellside'`
- Add `broker`, `analyst`, `asset_class`, `report_type`, `rating`, `target_price` columns
- Build `/sellside` tab in Research Portal (port 3000) that filters `source_type='sellside'`

**Why:** User wants a sellside research aggregator integrated with the Research Portal. The auth/scraping layer is now done. Next phase is the storage + UI layer.

**How to apply:**
- Don't redo the auth work — all 8 brokers have working login.js (diag-login pattern). Just run `/sellside-login` if any TTLs expired (WF expires in 1h after login).
- When resuming, ask user: fix the 4 search-quality issues first, or move to portal integration?
- The portal integration is the original goal — search fixes are nice-to-have polish.
- Reference: see `reference_sellside_brokers.md` for per-broker quirks.
