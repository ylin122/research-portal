---
name: User's machines and Claude memory paths
description: The user has two machines — "tablet" (Windows user willi) and "home" (Windows user ylin1) — each with its own home dir and ~/.claude/projects/C--Users-<user>/memory/ folder
type: reference
originSessionId: 30063391-ae03-4503-8e9c-7de001d45255
---
The user works across two machines:

- **Tablet** — Windows user `willi` · home dir `C:\Users\willi` · Claude Code project-memory at `~/.claude/projects/C--Users-willi/memory/`.
- **Home** — Windows user `ylin1` · home dir `C:\Users\ylin1` · Claude Code project-memory at `~/.claude/projects/C--Users-ylin1/memory/`. (Inferred from the `C--Users-ylin1` folder name + user confirmation on 2026-05-12 — verify on the home machine if it matters.)

Memory syncs between the two via the research-portal repo's `scripts/claude-config/memory/` snapshot — the `sync-pull` / `sync-push` agents call `scripts/sync-memory.cjs`, which resolves the per-machine memory dir as `C--Users-<basename of home>` and rebuilds `MEMORY.md` from the files that exist.

Gotcha: `sync-memory.cjs` warns if a machine has more than one `~/.claude/projects/C--Users-*/memory/` dir. The tablet had a stale `C--Users-ylin1/memory/` (frozen ~2026-04-29, 25 files, outdated index) sitting next to its live `C--Users-willi/` — a leftover from an early profile copy, not the home machine's current memory. If that warning fires on the tablet, the `ylin1` folder there is the stale copy and is safe to delete.
