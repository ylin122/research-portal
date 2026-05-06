---
name: sync-push
description: Push local state to GitHub. Run before logging off or switching machines. Commits and pushes ~/dotclaude (which carries CLAUDE.md, settings.json, agents/, skills/), research portal, and PA dashboard. No API keys required.
tools: Bash
---

# Sync Push — "Log Off" Command

Run this before switching machines to ensure everything is saved on GitHub.

## What it does:
1. Copies `~/.claude/{agents,skills}` and config files into `~/dotclaude/` and the research portal repo
2. Commits + pushes `~/dotclaude` (so other machines pick up agent + skill edits via git pull)
3. Commits + pushes research portal (carries Claude Code config + memory snapshots)
4. Commits + pushes PA dashboard

All sync paths use GitHub — no Supabase, no API keys.

## Steps:

### Step 1 — Sync local agents/skills/config into dotclaude
Local `~/.claude/agents/` is the working copy; `~/dotclaude/agents/` is the git-tracked source of truth. Copy any local edits up before committing:
```bash
mkdir -p ~/dotclaude/agents ~/dotclaude/skills
cp ~/.claude/agents/*.md ~/dotclaude/agents/ 2>/dev/null || true
# Skills are nested directories — copy recursively
cp -r ~/.claude/skills/. ~/dotclaude/skills/ 2>/dev/null || true
# Top-level config files
cp ~/.claude/CLAUDE.md ~/dotclaude/CLAUDE.md 2>/dev/null
cp ~/.claude/settings.json ~/dotclaude/settings.json 2>/dev/null
```

### Step 2 — Commit + push dotclaude
```bash
cd ~/dotclaude && git add -A && git status
```
If there are changes:
```bash
git commit -m "Update agents/skills/config" && git push origin main
```
If no changes, report "dotclaude: already up to date."

### Step 3 — Sync Claude Code config + memory into research portal
Copy `~/.claude/` configs, hook files, and conversation memory into the research portal repo so they're version-controlled:
```bash
CFG=~/projects/research-portal/scripts/claude-config
mkdir -p "$CFG/hooks" "$CFG/memory"
cp ~/.claude/mcp-config.json "$CFG/mcp-config.json" 2>/dev/null
cp ~/.claude/settings.json "$CFG/settings.json" 2>/dev/null
cp ~/.claude/settings.local.json "$CFG/settings.local.json" 2>/dev/null
cp ~/.claude/hooks/log-subagent-run.cjs "$CFG/hooks/log-subagent-run.cjs" 2>/dev/null
# Memory dir is per-machine; on Windows the active dir is C--Users-willi.
# If you're on a different machine, replace with that machine's project dir.
cp ~/.claude/projects/C--Users-willi/memory/*.md "$CFG/memory/" 2>/dev/null
```

**Never copy `~/.claude/hooks/supabase-creds.env`** — it contains the PA dashboard's Supabase secret key. Those must be re-pasted manually on each machine (grab from Supabase dashboard → API Keys page).

### Step 4 — Commit + push research portal
```bash
cd ~/projects/research-portal && git add -A && git status
```
If there are changes (typically claude-config snapshots from Step 3):
```bash
git commit -m "Sync Claude Code config + memory" && git push origin main
```
If no changes, report "research portal: already up to date."

### Step 5 — Push PA dashboard
```bash
cd ~/projects/pa-dashboard && git add -A && git status
```
If there are changes, commit with a descriptive message and push:
```bash
git commit -m "Update dashboard <describe changes>" && git push
```
If no changes, report "PA dashboard: already up to date."

Run all steps and report the output. If there are git conflicts or errors, report them to the user.
