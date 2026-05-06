# Weekly Research Portal Audit

A multi-pass audit system that runs independent checks in sequence. Each check is its own Node.js script that queries Supabase, runs validations, and writes results to `results/`.

## How to Run

From `research-portal-app/`, paste this into Claude Code:

```
Run my weekly research portal audit. Execute each script in scripts/audit/ in order (01 through 08). Each script writes a JSON results file to scripts/audit/results/. After all scripts complete, run 09_report.cjs to compile the final report. Then read the report and tell me what needs attention — prioritize critical issues and stale data.
```

Or run manually:

```bash
cd research-portal-app
node scripts/audit/01_field_coverage.cjs
node scripts/audit/02_labels_and_classification.cjs
node scripts/audit/03_freshness.cjs
node scripts/audit/04_industry_research_hardcoded.cjs
node scripts/audit/05_knowledge_base.cjs
node scripts/audit/06_agents_and_pipeline.cjs
node scripts/audit/07_cross_checks.cjs
node scripts/audit/08_accuracy_spot_check.cjs
node scripts/audit/09_report.cjs
```

## What Each Check Does

| Script | Scope | Queries | Web Verification |
|--------|-------|---------|-----------------|
| 01 | Field coverage per company | Supabase | No |
| 02 | Public/private, priority, sector labels | Supabase | No |
| 03 | News staleness, notes coverage, sector notes | Supabase | No |
| 04 | AI labs/capex/GPU hardcoded data in JSX | File read | No |
| 05 | KB articles, Obsidian wiki sync | Supabase + files | No |
| 06 | Ideas, Q&A, watchlist pipelines | Supabase | No |
| 07 | Duplicates, orphans, date errors | Supabase | No |
| 08 | Spot-check 5 companies for accuracy | Supabase | Yes (web) |
| 09 | Compile all results into final report | File read | No |

Scripts 01-07 are pure data checks (fast, no errors). Script 08 does web verification on a rotating sample. Script 09 reads all result files and produces the summary.
