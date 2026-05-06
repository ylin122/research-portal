---
name: Research Portal Expansion Vision
description: User's longer-term vision for research-portal — aggregated research hub, architectural decisions made 2026-04-21
type: project
originSessionId: 2774e82b-87ec-4662-83b5-7a98d44d86b3
---
User wants to evolve research-portal into an integrated research hub that aggregates: sell-side research, personal notes, 3rd party research (Reorg/9fin/CreditSights/Third Bridge), competitor data from public sources, and an internal folder (work side).

**Why:** User spends most of their finetuning time on the personal portal and doesn't want to duplicate UI/UX work when extending research workflows at work. Current state: CoreWeave is a 1,241-line hardcoded monolith (CoreweaveReview.jsx); GenericReview.jsx is a simpler 7-field template used for other tickers; schema (companies, company_fields, company_notes, news_cache, sector_notes) is generic but underused for rich content.

**How to apply:**

1. **Architectural direction decided: Option C** — share the codebase, but personal uses rich customizable sections while work uses the existing simple GenericReview. Same repo on personal GitHub, cloned at work with work Supabase creds. Confirmed work machines can pull from personal GitHub. Sensitive work data is only private company financials/documents — no work-only code logic needed. Private data stays in work Supabase only, never touches personal infra.

2. **Framing that helped user: 4-layer pipeline, not 5 features** — Ingestion (adapters per source) → Storage (one normalized Supabase schema) → Views (UI reads from storage) → Agents (read/write storage). Adding a 6th input later should be an adapter, not a rewrite.

3. **Next session starting point: storage schema design.** User asked what "schema" means — needs plain-language framing, no jargon. Propose a concrete schema sketch (documents table with source_type, company link, date, content; separate notes table) as something to react to, not a plan. User got overwhelmed earlier by too much detail at once — keep explanations tight, one layer at a time.

4. **Do not pursue the big CoreWeave refactor yet.** User explicitly called it a heavy lift and signaled it'll happen at home in iterations. Rich per-section tables (company_events, company_contracts, company_debt_entities, etc.) are a later-stage project. First priority is storage schema for the aggregation vision, not refactoring CoreWeave.

5. **User communication style on this topic:** gets overwhelmed by long responses and multiple options. Give one clean recommendation with tradeoff, ask narrowing questions, go one layer deep at a time.
