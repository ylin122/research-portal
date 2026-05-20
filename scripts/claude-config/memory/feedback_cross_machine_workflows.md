---
name: feedback-cross-machine-workflows
description: "Cross-machine sync contract for /sellside-login, /sellside, @third-party-research — 2-layer model (synced code + per-machine state), routine flow, common breakages"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f8890182-d889-4124-8893-6d67d55dc142
---

The user runs three research workflows across two machines (tablet `willi` + home `ylin1`) and has lost time to sync-time breakage. The architecture is fixed; remembering it = stable cross-machine operation.

**Why:** User explicitly said (2026-05-20): "I have sent a lot of time reconciling between machines and it often breaks. Can we dig deep and make sure this is explicit in the command that these should be functional and execute correctly based on my directions across machines so i dont have issues sync'ing." Each of the 3 workflow files now has a "Cross-Machine Reliability Contract" section explaining this — but I should also know the pattern from memory so I can reason about it before reading the files.

**How to apply:** When the user reports a research-workflow failure across machines, check the 2-layer model immediately. Don't speculate — check git state, .env presence, state.json freshness, in that order.

## The 2-layer model

**Layer 1 — Code (syncs via git):**
- `~/dotclaude/` (skill/agent definitions) → mirrors to `~/.claude/` via SessionStart hook
- `~/sellside-broker-tools/` (sell-side engine: per-broker login.js + query.js + lib/headless-login.mjs + bin/preflight.mjs + bin/setup-machine.ps1)
- `~/third-party-research-tools/` (third-party engine: per-tool login.js + query.js + bin/preflight.mjs + bin/os-input.ps1 + bin/setup-machine.ps1 + bin/topdf.mjs)

All three pulled by `/sync-pull`. Edit on one machine → commit + push → `/sync-pull` on the other.

**Layer 2 — State (per-machine, gitignored):**
- `<tool>/.env` — credentials. Provisioned by `bin/setup-machine.ps1` on first run per machine.
- `<tool>/state.json` — session cookies. Tied to the machine's browser fingerprint; can't be copied.
- `<tool>/browser-profile/` — Playwright persistent profile. Same — per-machine.
- `<tool>/node_modules/` — npm deps. Installed by setup-machine.ps1.

**Critical:** state.json is NOT portable. Copying it from one machine to another won't authenticate the second. Each machine must run `login.js` once per tool/broker to establish its own state.

## Routine sync flow (what user does on arrival at any machine)

1. `/sync-pull` — pulls all 3 git repos.
2. Invoke the workflow (`/sellside-login`, `/sellside <Co>`, or `@third-party-research <Co>`). Step 0 auto-detects + relogins per-machine state as needed.

That's it. No copying, no manual file transfer.

## Fresh-machine setup (one-time)

For each tool repo:
```
git clone https://github.com/ylin122/<repo>.git ~/<repo>
cd ~/<repo> && ./bin/setup-machine.ps1
```

`setup-machine.ps1` walks through .env creds, runs `npm install`, installs Playwright Chromium. After that, the workflow's normal flow handles auth.

## Common breakages I've personally seen (and their actual fixes)

- **state.json stale on tablet but works on home** → run `login.js` for the dead tool on tablet. Not a sync problem; per-machine state issue.
- **Uncommitted local changes from previous session** → `git -C ~/<repo> status -sb` to detect. Commit + push BEFORE doing anything else.
- **Em-dashes in .ps1 files break Windows PowerShell 5.1 parser** — fixed in repo; if it recurs, run `grep -P '[^\x00-\x7F]' <file>` and replace.
- **Orphan Chrome lockfiles after background-launched login.js gets SIGHUP'd** — kill orphan Chromes matching the tool path, `rm browser-profile/lockfile`.
- **BofA Mercury 2-step login (page-expired + v2/login_page)** — fixed in `lib/headless-login.mjs` (refresh + second-fill). If recurring, check that file's commit history.
- **WF cached-dashboard with expired sspfid** — known edge case. Dashboard renders but no Login button. Auto-relogin can't recover; user does it manually.
- **WF 1-hour sspfid TTL** — expected. Re-run `/sellside-login` just before doing real research.
- **Reorg → Octus URL rebrand** — `reorg/login.js` force-overrides any stale `REORG_URL` in `.env`. So old .env from another machine still works.

See [[feedback-sellside-auth-automation]] for sellside-specific auth flow details, [[reference-thirdbridge-login]] for Third Bridge's bot-resistant model, [[feedback-os-input-focus-safety]] for OS-level input safety.
