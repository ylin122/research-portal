---
name: No shortening prompts
description: Never shorten, abbreviate, or paraphrase user prompts when delegating to research agents — use the exact prompt provided
type: feedback
---

Do not shorten or abbreviate user prompts when delegating tasks to sub-agents. Use the user's exact prompt verbatim.

**Why:** User noticed I abbreviated the research brief prompt for a batch of 26 companies, which produced inconsistent output quality vs the first batches that used the full prompt. The user's prompt contains specific tone, framing, and per-section instructions that materially affect output quality.

**How to apply:** When the user provides a prompt template to run across multiple companies, copy the full prompt into each agent delegation. Only shorten if the user explicitly says to.
