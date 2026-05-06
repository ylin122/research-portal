---
name: refresh
description: Refreshes any research portal tab with the latest information from web sources, Yahoo Finance, and Supabase. Internal research tools (Moody's, S&P CapIQ, CreditSights, 9fin, Reorg, Third Bridge) are OPT-IN — only used if the user explicitly asks. Comprehensive multi-source refresh.
tools: Read, Bash, Grep, Glob, Edit, Write, WebSearch, WebFetch
---

Refresh a research portal tab or section with latest information from ALL available data sources. Source: `~/research-portal/research-portal-app/src/`

## Tab -> File / Storage Map

| Target | File(s) | Storage |
|---|---|---|
| Dashboard | `Dashboard.jsx` | Supabase |
| Thesis Tracker | `ThesisAgent.jsx` | localStorage |
| Agent Commands | `DataVerificationAgent.jsx` | -- |
| AI Research | `AIDisruption.jsx` | Hardcoded JSX |
| Industry Research | `IndustryResearch.jsx` | Hardcoded JSX |
| Quick Notes | `QuickNotes.jsx` | Supabase |
| Equity Research | inline `App.jsx` | localStorage |
| Company/Sector | inline `App.jsx` | Supabase |
| Knowledge | `KnowledgeInterests.jsx` | Hardcoded JSX |
| Research Wiki | `KnowledgeBase.jsx` | Supabase |
| Business Models | `BusinessModels.jsx` | Hardcoded JSX |
| Financial Instruments | `CreditInstruments.jsx` | Hardcoded JSX |
| Restructuring | `Restructuring.jsx` | Hardcoded JSX |
| Industry Primer | `Primer.jsx`, `PrimerNewTabs.jsx`, `PrimerNewTabs2.jsx` | Hardcoded JSX |
| Product / Service Primer | `ProductPrimer.jsx` | Hardcoded JSX |
| Principles | `Principles.jsx` | Supabase |
| Prompts | `Prompts.jsx` | Supabase |
| Sources | `Sources.jsx` | Supabase |
| APIs | `ApiDirectory.jsx` | Hardcoded JSX |
| Audit Log | `AuditLog.jsx` | Supabase |
| Company Reviews | `*Review.jsx` (GenericReview, MicronReview, OracleReview, CoreweaveReview, AppliedDigitalReview, CipherDigitalReview, TerawulfReview, TractCapitalReview) | Hardcoded JSX |
| What-If Agent | `WhatIfAgent.jsx` | -- |

## Data Sources

You have access to ALL of these. Use whichever are relevant to the target tab/section:

### Web (always use)
- **WebSearch** — general news, SEC filings, press releases, financial data
- **WebFetch** — pull specific URLs for authoritative sources

### Internal Research Tools — OPT-IN ONLY (do NOT use by default)

**Do not run these unless the user explicitly asks for credit/ratings/restructuring/expert-interview research, or names a specific tool by name.** No auth-checks, no searches, no probes by default. Web sources cover hyperscaler / equity / news content fully.

When the user does ask, the available tools live in `~/reorg-tools/`, `~/9fin-tools/`, `~/creditsights-tools/`, `~/thirdbridge-tools/`, `~/moodys-tools/`, `~/capiq-tools/`. Each has a `query.js` with `search`/`lookup`/`articles` subcommands; auth status varies by machine. Only invoke when explicitly in scope.

### Yahoo Finance API (use when refreshing financial data / prices)
```bash
curl -s "https://query1.finance.yahoo.com/v8/finance/chart/<TICKER>?interval=1d&range=5d" | node -e "..."
```
Or use the PA dashboard API if vercel dev is running: `curl -s http://localhost:3000/api/quote?symbols=TICKER1,TICKER2`

### Supabase (for tabs that use Supabase storage)
Read-only reference — check `~/research-portal/research-portal-app/.env` for connection details if needed.

## Process

### Step 0: Stale Sniffer (proactive pre-flight)

Before building the claim register, scan the file for stale-looking date strings. Run:

```bash
# Find every "Q\d \d{4}", month-name dates, and YYYY-MM-DD style patterns
grep -n -E "Q[1-4] (20[0-9]{2})" <target-file> | head -40
grep -n -E "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) [0-9]{1,2},? 20[0-9]{2}" <target-file> | head -40
```

Sort by date, surface the **oldest 10–20 entries** at the top of the run. These are the highest-priority refresh candidates. Examples of what to flag:
- `news: "Q3 2025 ..."` when today is past mid-2026
- `"as of Mar 2025"` when today is Apr 2026
- Earnings date entries from prior fiscal years still labeled "latest"

The user decides whether to widen scope to those items or stay focused on what they originally asked. The sniffer is informational — don't auto-edit based on it.

### Step 1: Read & Build Claim Register

Read every line of the target file(s). Build an exhaustive numbered register of every verifiable item:

- **Dates** — earnings dates, filing dates, event dates, "as of" timestamps
- **Figures** — revenue, EBITDA, margins, multiples, share prices, market caps, headcounts, growth rates
- **Company facts** — ownership, management names/titles, ratings, deal terms, contract values
- **Market/industry data** — market sizes (TAM/SAM), market share percentages, ranking claims
- **Status claims** — "pending", "completed", "expected Q2", regulatory status, litigation status
- **URLs & references** — linked sources, cited reports, named publications
- **Rankings & comparisons** — "#1 in...", "largest...", "faster than..."

Do NOT skip anything. If a section has 40 data points, the register must have 40 entries. Each entry: `[N] file:line — claim text — category`

#### Step 1b: Locate EVERY Representation of Each Metric (critical — #1 source of missed updates)

A single metric (e.g., "MSFT 2026 capex", "NVDA forward P/E", "CRWV backlog") typically appears in **3-5 different places within the same file**, in different syntactic forms:

1. **Prose / news strings** — `news: "Q1 2026 capex now ~$190B (+61% YoY)"`
2. **Chart data arrays** — `{ year: 2026, value: 130, est: true }`
3. **Comparison tables (JSX)** — `<td>$130B</td>` or `capex2026: 130`
4. **Summary tiles / headline stats** — `"Latest ARR: $25B+"`
5. **Aggregate / roll-up rows** — `aggregate: [{ year: 2026, value: 895 }]` (sums of the per-name rows above)
6. **Year-over-year computations / growth labels** — "+61% YoY", "doubled QoQ"

For EACH metric in the register, grep the file for every textual representation of the value AND for every label that names the metric. Record `file:line` for every occurrence. The register entry must list **all** of them, not just the first one you noticed.

```bash
# Example: before touching MSFT 2026 capex, find every place it lives in the file
grep -n -E "MSFT|Microsoft" IndustryResearch.jsx | grep -i -E "capex|2026|130|145|190"
grep -n -E "year: 2026.*value:" IndustryResearch.jsx
```

Failure mode this prevents: updating the news string to "$190B" while leaving `{year: 2026, value: 130}` in the chart data array — chart and prose disagree, and downstream aggregates roll up the stale number.

#### Step 1c: Arithmetic Invariant Check (catches sum/aggregate drift)

Aggregate-style claims ("top-5 total = $X", "industry capex = $Y", "combined backlog = $Z") are easy to leave stale because they're computed from underlying components. For every aggregate/sum/total claim in the register, **explicitly compute the value from its components and compare**.

Example pattern (this is exactly the bug class that the $700B/$760B miss exposed):

```bash
# Prose claims "Aggregate top-5 hyperscaler 2026 capex now ~$700B"
# Underlying chart array has individual capex2026 values
# Sum: AMZN 200 + GOOGL 185 + MSFT 190 + META 135 + ORCL 50 = $760B
# Mismatch — flag before any other edits
```

Walk every register entry asking: "is this an aggregate? if so, what are its components, and do they sum to it?" Categories that almost always need this check:
- "Aggregate / total / combined / sum X" prose claims
- `aggregate:` or `total:` chart-data rows that should equal Σ(per-name rows)
- "+X% YoY" growth labels that should match `(cur/prev - 1) * 100` from the underlying array
- "average / mean X" that should equal the actual mean

For each invariant: report **PASS / FAIL** with computed-vs-claimed delta. FAILS go into the Updates Made section as fixes. Do this BEFORE Step 4 edits so you have a clean target list.

**Tolerance band: ±1%.** Aggregates within ±1% of Σ(components) classify as `PASS-with-rounding` — these are intentional rounding (e.g., the file rounds $951B → $955B for display nicety). Drift beyond ±1% is a real failure that must be fixed.

Examples:
- Computed 951, claimed 955 → delta -0.4% → **PASS-with-rounding** (intentional)
- Computed 760, claimed 700 → delta +8.6% → **FAIL** (real drift, fix it)
- Computed 1100, claimed 1105 → delta -0.5% → **PASS-with-rounding**

Always show both the absolute delta ($) and the percentage delta in the report so the user can spot-check the tolerance call.

### Step 2: Verify Every Claim

For EACH item in the register:
1. **WebSearch** for the current state of that specific claim
2. **WebFetch** authoritative sources to confirm (SEC filings > company IR > press releases > financial news > analyst reports > blogs)
3. **Yahoo Finance** — for price, P/E, market cap, earnings date claims
4. **Internal research tools** — ONLY if the user's request explicitly asked for them (see Data Sources). Otherwise skip.
5. Mark each claim as:
   - **CURRENT** — verified correct as of today
   - **STALE** — was true but newer data exists (e.g., Q3 numbers replaced by Q4)
   - **WRONG** — factually incorrect
   - **UNVERIFIABLE** — cannot find a source to confirm or deny
   - **MISSING** — significant recent development not yet in the content

Do not batch-verify. Check each claim individually. A section with 30 claims requires 30 verification passes.

### Step 3: Research New Developments

Beyond verifying existing claims, actively search the web (WebSearch + WebFetch) for:
- Events in the last 90 days relevant to the section topic
- New companies, products, deals, or regulatory changes that should be added
- Updated figures (latest quarterly results, refreshed market data)
- Changes in competitive landscape

Internal research tools (Moody's, S&P, CreditSights, 9fin, Reorg, Third Bridge) are OPT-IN ONLY — do not invoke them unless the user's request explicitly named them or asked for credit/ratings/restructuring/expert research.

### Step 4: Apply Updates

- **Hardcoded JSX tabs**: Edit files directly. Preserve existing structure, formatting, and code style. Add `// Updated YYYY-MM-DD` comment at the top of updated sections.
- **Supabase/localStorage tabs**: Report exactly what needs updating with the new values. Do not modify DB directly.
- For each edit, note the old value and new value.

#### Step 4b: Walk Every Locator + Post-Edit Grep Self-Check (mandatory)

For EACH metric you change, walk through every locator captured in Step 1b and apply the update at every site:

- Did you update the **news/prose string**? Then also update the **chart data array**, the **comparison-table cell**, the **summary tile**, AND the **aggregate row** that sums it.
- If the metric flowed into a **roll-up** (e.g., `aggregate.top5_total`, "AI capex aggregate"), recompute the roll-up. Do not update one line and leave the sum stale.
- If the metric is referenced in a **YoY / QoQ growth label**, recompute the percentage.

**After editing, run a confirmation grep for the OLD value(s) you just replaced:**

```bash
grep -n -E "value: 130|130B|\\$130" IndustryResearch.jsx
```

Every remaining hit must be either (a) a different metric that legitimately equals the same number, or (b) historical (e.g., 2024 actual). If a remaining hit is the same metric you just updated, you missed a representation — fix it before reporting done.

### Step 5: Build Check

Run `cd ~/research-portal/research-portal-app && npx vite build 2>&1 | tail -20` to verify nothing broke. (Try the alternate path `~/research-portal/research-portal-app` if the first doesn't exist.)

### Step 5b: Visual Verification — grep the built chunk

Build clean ≠ rendered correctly. A chart bar can come out wrong (NaN heights, undefined cells, missing keys) while the build still passes. **Don't curl localhost** — Vite is a single-page app, so `http://localhost:3000/` only returns the empty React shell; the actual data is rendered client-side and won't show up in a curl response. Instead, grep the **bundled chunk** that `vite build` just produced — the data flows through that file after bundling.

```bash
# After vite build, find the chunk for the tab you edited
ls dist/assets/<TabName>-*.js

# Grep for red-flag patterns in the data layer — RUN ONE PATTERN AT A TIME
grep -c "NaN" dist/assets/<TabName>-*.js
grep -c "undefined," dist/assets/<TabName>-*.js
grep -c "null," dist/assets/<TabName>-*.js

# Confirm specific new values you just inserted are present (also one at a time)
grep -c "181.5B" dist/assets/<TabName>-*.js
grep -c "54.5B" dist/assets/<TabName>-*.js
```

**Important — ripgrep gotcha on minified chunks:** Vite chunks are single-line minified files. When you pass a multi-pattern regex with `|` alternation (e.g., `"NaN|undefined,|null,"`) to `rg` or `grep` against a single-line file, the matcher can return zero hits even when the individual patterns DO match — the alternation interacts badly with `--max-columns` truncation on very long lines. **Always run one pattern per call** when grepping bundled chunks. Confirmed during ProductPrimer.jsx refresh on 2026-04-29.

Red-flag patterns:
- `NaN` literal in the data (broken numeric calc — but ignore React internals like `isNaN` in `index-*.js`; only count `NaN` in the tab-specific chunk)
- `undefined,` or `null,` inside data objects (missing key)
- Empty array entries `[,]` or `[, ,]`
- Specific values you just edited NOT appearing in the chunk (your edit didn't actually flow through)

For UI-heavy edits (charts, tables, layout changes), the chunk grep confirms data integrity but NOT visual correctness (alignment, colors, overlap). For those, do a manual Chrome check on localhost:3000 and report PASS/FAIL/not performed. Don't claim visual correctness if you didn't actually look.

Skip with a one-line note if `dist/` doesn't exist (build failed or never ran). This is defense-in-depth, not a hard gate.

### Step 6: Cross-Tab / Cross-File Consistency Check

Some metrics live in **multiple files / tabs**. Use the watchlist below for the systematic sweep (always check these regardless of which tab you targeted), plus a per-edit grep for any metric you actually changed.

#### Cross-Tab Watchlist (always sweep these)

| Metric | Files where it typically appears |
|---|---|
| NVDA price / market cap / fwd P/E | `IndustryResearch.jsx`, `AIDisruption.jsx`, `Dashboard.jsx` |
| Anthropic ARR / valuation / Amazon investment | `IndustryResearch.jsx`, `AIDisruption.jsx` |
| OpenAI ARR / valuation / Stargate scale | `IndustryResearch.jsx`, `AIDisruption.jsx` |
| Hyperscaler 2026 capex (AMZN/GOOGL/MSFT/META/ORCL) | `IndustryResearch.jsx`, `AIDisruption.jsx`, sometimes `*Review.jsx` |
| CoreWeave (CRWV) backlog / RPO / debt | `IndustryResearch.jsx`, `CoreweaveReview.jsx`, `Restructuring.jsx` |
| Applied Digital (APLD) backlog / power / HPC rev | `IndustryResearch.jsx`, `AppliedDigitalReview.jsx`, `Restructuring.jsx` |
| Oracle RPO / Stargate commitments | `IndustryResearch.jsx`, `OracleReview.jsx` |
| Ratings (Moody's/S&P) for any covered name | `CreditInstruments.jsx` + the relevant `*Review.jsx` |
| Aggregate top-5 capex / industry capex total | `IndustryResearch.jsx`, `AIDisruption.jsx` |

For each touched metric AND every watchlist item that shares a name with anything you edited:

```bash
# Search the whole src tree for the metric — both old and new values, plus any label
grep -r -n -E "MSFT.*capex|Microsoft.*capex" ~/research-portal/research-portal-app/src/
grep -r -n -E "value: 130|value: 190" ~/research-portal/research-portal-app/src/
```

For each cross-file occurrence:
- **In scope** (user asked for a sweep, or the other tab obviously needs the same update): apply the same edit.
- **Out of scope** (user targeted only one tab): do NOT silently edit. Add the inconsistency to the report under "Cross-Tab Inconsistencies" with file:line + old value + the value you wrote in the target tab. The user decides whether to widen scope.

This catches the "two tabs disagree on the same number" failure mode after the refresh, not weeks later.

#### Historical-Quote Snapshot Exclusion (false-positive prevention)

Not every cross-file mismatch is a bug. Analyst thesis quotes, dated commentary, and historical snapshot tables intentionally hold values that were correct at a prior point in time. **Do NOT flag these as inconsistencies.**

A value should be classified as `INTENTIONAL_SNAPSHOT` (and skipped from the inconsistency list) if it appears inside a string or object that contains:
- A **firm + date** attribution (`firm: "JPMorgan"`, `date: "Feb 2026"`, `source: "Oppenheimer Mar 6"`)
- An explicit **"as of DATE"** marker (`"as of Mar 6"`, `"per Q4 2025 print"`)
- A **thesis / quote / commentary** field name (`thesis:`, `quote:`, `note:`, `commentary:`, `analyst_view:`)
- A **historical/archive** section header (`PRIOR_ESTIMATES`, `SNAPSHOTS_ARCHIVE`, `HISTORICAL_VIEWS`)

Example from this codebase: `CoreweaveReview.jsx:1077` and `1085` hold `$66.8B` for CRWV backlog inside Oppenheimer Mar 6 / JPM Feb 2026 thesis quotes. Current backlog is ~$88B. The thesis quote should NOT be updated — it's a historical record. A regex-only sweep would generate a false positive here; the exclusion rule prevents that.

When in doubt: read the surrounding 5 lines of context. If the value is attributed to a firm/date that predates the current refresh, classify as `INTENTIONAL_SNAPSHOT`. Note these in the report under a "Skipped (Historical Snapshots)" subsection so the user can spot-check your judgment, but do NOT include them in the live inconsistency list.

## Output

```
## Refresh Report: [Tab Name] — YYYY-MM-DD

### Stale Sniffer Findings (Step 0 — informational)
- [file:line] "Q3 2025 ..." (>180 days old)
- [file:line] "as of Mar 2025" (>365 days old)
- [N more — full list omitted]

### Claim Register: [N] items checked

### Arithmetic Invariants (Step 1c)
- "Aggregate top-5 = $X" prose vs Σ(components): PASS / FAIL (computed: $Y, claimed: $X, delta: $Z)
- "+33% YoY" growth label vs computed: PASS / FAIL
- [list every invariant checked]

### Updates Made
- [file:line] old value -> new value (source: URL)

### Corrected
- [file:line] WRONG: old claim -> corrected claim (source: URL)

### Stale (replaced with newer data)
- [file:line] old figure -> updated figure (source: URL)

### New Info Added
- [file:line] description of addition (source: URL)

### Unverifiable
- [file:line] claim — could not find authoritative source

### Cross-Tab Inconsistencies (flagged, not auto-fixed)
- [target file:line] now says X; [other file:line] still says Y — recommend widening scope to update there too

### Skipped (Historical Snapshots)
- [file:line] $66.8B inside JPM Feb 2026 thesis quote — INTENTIONAL_SNAPSHOT, not flagged

### Visual Verification (Step 5b — chunk grep)
- Chunk: `dist/assets/<TabName>-*.js` — found / missing
- Red-flag count in chunk (NaN / undefined, / null, in data layer): N
- New values present in chunk: e.g., "181.5B" ×2, "54.5B" ×2 (confirms edit flowed through)
- Manual Chrome inspection (UI-heavy edits only): PASS / FAIL / not performed (reason)

### Verification Stats
- Total claims: N
- Current: N | Stale: N | Wrong: N | Unverifiable: N | New additions: N
- Arithmetic invariants checked: N | PASS: N | FAIL (now fixed): N
- Representations updated per metric (avg): N (e.g., "MSFT 2026 capex updated in 5 places: news string, top5 array, revenueVsCapex array, comparison table, aggregate roll-up")
- Post-edit grep self-check: PASS / FAIL (list any remaining stale hits and why they're acceptable)
- Visual verification: PASS / FAIL / SKIPPED

### Sources
#### Web
1. [URL] — what it confirmed

#### Yahoo Finance
1. [Ticker] — what it confirmed (e.g., "CRWV — price $42.50, fwd P/E 35x")

#### Internal Research Tools (omit this section unless user explicitly asked for them)
1. [Tool] [search/article ID] — what it confirmed
```

## Rules
- Cite every update with a source URL
- Preserve existing code structure — don't refactor
- Flag rather than delete outdated content
- Never invent numbers — if you can't find it, say so
- Scope to what was requested — don't expand to other tabs (but DO grep-flag cross-tab inconsistencies)
- Every single data point gets checked — no skipping, no "and similar claims were verified"
- When the caller targets a subsection (e.g., "refresh the Coreweave case study in Restructuring"), scope the register to that subsection only but be fully exhaustive within it
- **Internal research tools are OPT-IN.** Do not run auth-checks, searches, or probes against Moody's / S&P CapIQ / CreditSights / 9fin / Reorg / Third Bridge unless the user's request explicitly asked for credit/ratings/restructuring/expert research, or named a specific tool. Web sources are the default.
- **One metric, many representations.** A single number usually lives in 3-5 places in one file (prose, chart data array, comparison table, summary tile, aggregate). Updating only the prose and leaving the chart array stale is the #1 historical failure mode. Use Step 1b to enumerate, Step 4b to update them all, and the post-edit grep to confirm none are missed.
- **Arithmetic invariants checked before edits (Step 1c).** Any aggregate/sum/total/average/YoY claim must be computed from its components and compared. FAILs become Updates Made.
- **Aggregates roll up — recompute them.** If you raise a per-name capex/revenue/backlog figure, the corresponding `aggregate` / `total` / `top5_sum` row is now wrong by exactly the delta. Update it.
- **Cross-tab consistency: grep before declaring done.** Even when scope is one tab, grep the rest of `src/` for the same metric — and ALWAYS sweep the watchlist in Step 6 — surfacing inconsistencies in the report.
- **Don't flag historical snapshots as bugs.** Values inside firm/date-attributed thesis quotes, "as of DATE" markers, or archive sections are intentional. Classify as `INTENTIONAL_SNAPSHOT` and report under "Skipped (Historical Snapshots)", not under "Cross-Tab Inconsistencies".
- **Visual verification: grep the built chunk (Step 5b).** Build clean ≠ rendered correctly. Don't curl localhost (Vite SPA returns empty shell). Instead, after `vite build`, grep `dist/assets/<TabName>-*.js` for `NaN` / `undefined,` / `null,` and confirm your new values appear in the chunk. For UI-heavy edits (chart layout, alignment, colors), also do a manual Chrome check; if you can't, say so explicitly rather than claiming success.
- **Try both candidate paths.** Source tree may be at `~/research-portal/research-portal-app/src/` or `~/research-portal/research-portal-app/src/` depending on the machine — check both, edit the one that exists.
