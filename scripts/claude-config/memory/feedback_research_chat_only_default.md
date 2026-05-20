---
name: feedback-research-chat-only-default
description: "Research-output agents (@third-party-research, @sellside, @ratings-research, etc.) should stay chat-only by default; only save to disk when user explicitly asks"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f8890182-d889-4124-8893-6d67d55dc142
---

Research-output agents — `@third-party-research`, `@sellside`, `@ratings-research`, and similar synthesis agents — must keep their output chat-only by default. Do not proactively save PDFs, markdown, or any file to disk unless the user explicitly says "save it" / "save to disk" / etc.

**Why:** Confirmed 2026-05-20 — user lost a writeup made at home because they assumed it had been saved, but the agent's default is chat-only and the home machine's `~/Claude/Third Party/` is not synced. User explicitly said: "we can make tablet writeup chat-only too unless i tell u to save it." Avoids stale empty folders and ambiguity about what got persisted where.

**How to apply:**
- When invoking any of these agents, do not pass instructions to save unless the user asked for it.
- If the user wants the output durable across machines, route it through a synced location (research-portal repo, memory, or PA Dashboard repo) — not `~/Claude/Third Party/` or `~/Claude/Sellside/`, which are local-only.
- Save naming rules from [[feedback-research-pdf-naming]] still apply when saving is requested.
