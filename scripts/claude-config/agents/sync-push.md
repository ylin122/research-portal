---
name: sync-push
description: Push local state to Supabase + GitHub. Run before logging off or switching machines. Uploads all ~/.claude/agents/ to Supabase, commits and pushes research portal and PA dashboard changes to GitHub.
tools: Bash
---

# Sync Push — "Log Off" Command

Run this before switching machines to ensure everything is saved remotely.

## What it does:
1. Reads all `.md` files from `~/.claude/agents/` and upserts them into Supabase `agent_definitions` table
2. Commits any uncommitted research portal changes and pushes to GitHub
3. Commits any uncommitted PA dashboard changes and pushes to GitHub

## Steps:

### Step 1 — Sync agents to Supabase + push research portal
```bash
cd ~/research-portal/research-portal-app && node scripts/seed-agents.cjs
```
The script also pushes the research-portal and dotclaude repos itself. As a sanity check, confirm nothing is left uncommitted:
```bash
cd ~/research-portal && git status
```

### Step 2 — Push PA dashboard
```bash
cd ~/pa-dashboard && git add -A && git status
```
If there are changes, commit with a descriptive message and push:
```bash
git commit -m "Update dashboard <describe changes>" && git push
```
If no changes, report "PA dashboard: already up to date."

### Step 3 — Sync Claude Code config + memory to GitHub
Copy `~/.claude/` configs, hook files, and conversation memory into the research portal repo so they're version-controlled:
```bash
CFG=~/research-portal/research-portal-app/scripts/claude-config
mkdir -p "$CFG/hooks" "$CFG/memory"
cp ~/.claude/mcp-config.json "$CFG/mcp-config.json" 2>/dev/null
cp ~/.claude/settings.json "$CFG/settings.json" 2>/dev/null
cp ~/.claude/settings.local.json "$CFG/settings.local.json" 2>/dev/null
cp ~/.claude/hooks/log-subagent-run.cjs "$CFG/hooks/log-subagent-run.cjs" 2>/dev/null
# Memory dir is per-machine; on Windows the active dir is C--Users-willi.
# If you're on a different machine, replace with that machine's project dir.
cp ~/.claude/projects/C--Users-willi/memory/*.md "$CFG/memory/" 2>/dev/null
```
These get committed and pushed with the research portal in Step 1.

**Never copy `~/.claude/hooks/supabase-creds.env`** — it contains Supabase secret keys. Those must be re-pasted manually on each machine (grab from Supabase dashboard → API Keys page).

Run all steps and report the output. If there are git conflicts or errors, report them to the user.
