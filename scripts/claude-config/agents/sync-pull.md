---
name: sync-pull
description: Pull latest from GitHub to local machine. Run when logging on to a new machine. Pulls research portal, PA dashboard, and dotclaude (which carries CLAUDE.md, settings.json, agents/, skills/) — all from GitHub. No API keys required.
tools: Bash
---

# Sync Pull — "Log On" Command

Run this when starting on a new or different machine to get the latest state. Everything comes from GitHub — no API keys required.

## What it does:
1. Pulls latest research portal code from GitHub (`git pull origin main`)
2. Pulls latest PA dashboard code from GitHub
3. Pulls latest `~/dotclaude` and refreshes `~/.claude/{CLAUDE.md, settings.json, agents/, skills/}`
4. Restores Claude Code config + memory from the research portal repo

## Steps:

### Step 1 — Pull projects + dotclaude (one command via the harness script)
```bash
cd ~/projects/research-portal && node scripts/sync-agents.cjs
```
This script:
- `git pull` on research-portal and pa-dashboard repos
- `git pull` on `~/dotclaude` and copies CLAUDE.md/settings.json/agents/skills into `~/.claude/`

If `~/dotclaude` isn't cloned on this machine yet:
```bash
git clone https://github.com/ylin122/dotclaude.git ~/dotclaude
```
Then re-run Step 1.

### Step 2 — Restore Claude Code config + memory from GitHub
Copy synced config files, hook scripts, and conversation memory back to `~/.claude/`:
```bash
CFG=~/projects/research-portal/scripts/claude-config
# Memory dir is per-machine — replace C--Users-willi with this machine's
# Claude Code project dir (under ~/.claude/projects/) if different.
mkdir -p ~/.claude/hooks ~/.claude/projects/C--Users-willi/memory
cp "$CFG/mcp-config.json" ~/.claude/mcp-config.json 2>/dev/null
cp "$CFG/settings.local.json" ~/.claude/settings.local.json 2>/dev/null
cp "$CFG/hooks/log-subagent-run.cjs" ~/.claude/hooks/log-subagent-run.cjs 2>/dev/null
cp "$CFG/memory/"*.md ~/.claude/projects/C--Users-willi/memory/ 2>/dev/null
```
Note: After restoring MCP config, the user must restart Claude Code for MCP servers to load.

**Supabase secret keys are NOT synced** (only used by the PA dashboard's audit hook, not agent sync). After first pull on a new machine, the audit hook will fail silently until `~/.claude/hooks/supabase-creds.env` is recreated:
```
PA_SUPABASE_URL=https://jonmrddvqlzxtsqiwscj.supabase.co
PA_SUPABASE_SECRET_KEY=<grab from Supabase dashboard → API Keys → Secret keys>
```
Grab the secret key at: https://supabase.com/dashboard/project/jonmrddvqlzxtsqiwscj/settings/api-keys

### Step 3 — Install MCP server dependencies
Check if edgartools is installed, install if missing:
```bash
py -m pip show edgartools >/dev/null 2>&1 || py -m pip install "edgartools[ai]"
```

Run all steps and report the output.
