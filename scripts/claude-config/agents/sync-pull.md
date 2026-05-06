---
name: sync-pull
description: Pull latest from GitHub + Supabase to local machine. Run when logging on to a new machine. Pulls research portal and PA dashboard from GitHub, syncs agent definitions from Supabase to ~/.claude/agents/.
tools: Bash
---

# Sync Pull — "Log On" Command

Run this when starting on a new or different machine to get the latest state.

## What it does:
1. Pulls latest research portal code from GitHub (`git pull origin main`)
2. Pulls all agent definitions from Supabase and writes them as `.md` files to `~/.claude/agents/`
3. Reports any local-only agents that aren't in Supabase yet (so you can push them)
4. Pulls latest PA dashboard code from GitHub

## Steps:

### Step 1 — Sync research portal + agents from Supabase
```bash
cd ~/research-portal/research-portal-app && git pull origin main && node scripts/sync-agents.cjs
```

### Step 2 — Pull PA dashboard
```bash
cd ~/pa-dashboard && git pull
```

### Step 3 — Restore Claude Code config + memory from GitHub
Copy synced config files, hook scripts, and conversation memory back to `~/.claude/`:
```bash
CFG=~/research-portal/research-portal-app/scripts/claude-config
# Memory dir is per-machine — replace C--Users-willi with this machine's
# Claude Code project dir (under ~/.claude/projects/) if different.
mkdir -p ~/.claude/hooks ~/.claude/projects/C--Users-willi/memory
cp "$CFG/mcp-config.json" ~/.claude/mcp-config.json 2>/dev/null
cp "$CFG/settings.json" ~/.claude/settings.json 2>/dev/null
cp "$CFG/settings.local.json" ~/.claude/settings.local.json 2>/dev/null
cp "$CFG/hooks/log-subagent-run.cjs" ~/.claude/hooks/log-subagent-run.cjs 2>/dev/null
cp "$CFG/memory/"*.md ~/.claude/projects/C--Users-willi/memory/ 2>/dev/null
```
Note: After restoring MCP config, the user must restart Claude Code for MCP servers to load.

**Supabase secret keys are NOT synced.** After first pull on a new machine, the audit hook will fail silently until `~/.claude/hooks/supabase-creds.env` is recreated:
```
PA_SUPABASE_URL=https://jonmrddvqlzxtsqiwscj.supabase.co
PA_SUPABASE_SECRET_KEY=<grab from Supabase dashboard → API Keys → Secret keys>
```
Grab the secret key at: https://supabase.com/dashboard/project/jonmrddvqlzxtsqiwscj/settings/api-keys

### Step 4 — Install MCP server dependencies
Check if edgartools is installed, install if missing:
```bash
py -m pip show edgartools >/dev/null 2>&1 || py -m pip install "edgartools[ai]"
```

Run all steps and report the output. If there are local-only agents, suggest running `@sync-push` to upload them.
