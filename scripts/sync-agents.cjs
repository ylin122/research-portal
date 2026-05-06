// ─── Pull from GitHub to local machine ───
// Run: node scripts/sync-agents.cjs
// This is the "log on" sync — run when starting on a new machine.
//
// As of 2026-05-05: agents and skills live in the ~/dotclaude git repo (no longer
// synced via Supabase — the anon key is RLS-blocked from writes and we wanted to
// avoid managing a service-role key per machine). dotclaude is the source of truth
// for ~/.claude/{CLAUDE.md, settings.json, agents/, skills/}.
//
// Architecture:
//   ~/dotclaude/                    ← git repo (push from any machine, pull on others)
//     ├── CLAUDE.md
//     ├── settings.json
//     ├── agents/                   ← all agent .md files
//     └── skills/                   ← all skill SKILL.md files
//
//   ~/.claude/                      ← local Claude Code config (overwritten on sync)
//     ├── CLAUDE.md                 ← copied from dotclaude
//     ├── settings.json             ← copied from dotclaude
//     ├── agents/                   ← copied from dotclaude
//     └── skills/                   ← copied from dotclaude

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const HOME = os.homedir();
const DOTCLAUDE = path.join(HOME, 'dotclaude');
const CLAUDE = path.join(HOME, '.claude');

(async () => {
  // ── Step 1: Pull project repos from GitHub ──
  console.log('\n=== Step 1: Pull repos from GitHub ===');
  const repos = [
    { name: 'research-portal', dir: path.join(__dirname, '..'), branch: 'main' },
    { name: 'portfolio-dashboard', dir: path.join(HOME, 'projects', 'portfolio-dashboard'), branch: 'master' },
  ];
  for (const r of repos) {
    if (!fs.existsSync(r.dir)) {
      console.log(`  SKIP: ${r.name} not cloned at ${r.dir}`);
      continue;
    }
    try {
      const result = execSync(`git pull origin ${r.branch}`, { cwd: r.dir, encoding: 'utf-8' }).trim();
      console.log(`  ${r.name}: ${result.split('\n')[0]}`);
    } catch (e) {
      console.error(`  ${r.name} pull error:`, e.message.split('\n')[0]);
    }
  }

  // ── Step 2: Pull dotclaude + sync agents/skills/CLAUDE.md/settings.json ──
  console.log('\n=== Step 2: Pull dotclaude + sync ~/.claude/ ===');
  if (!fs.existsSync(DOTCLAUDE)) {
    console.log('  SKIP: ~/dotclaude not cloned on this machine');
    console.log('  Run: git clone https://github.com/ylin122/dotclaude.git ~/dotclaude');
    return;
  }
  try {
    const result = execSync('git pull --ff-only origin main', { cwd: DOTCLAUDE, encoding: 'utf-8' }).trim();
    console.log(`  dotclaude: ${result.split('\n')[0]}`);
  } catch (e) {
    console.error('  dotclaude pull error:', e.message.split('\n')[0]);
  }

  // CLAUDE.md + settings.json — top-level files
  for (const file of ['CLAUDE.md', 'settings.json']) {
    const src = path.join(DOTCLAUDE, file);
    const dst = path.join(CLAUDE, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
      console.log(`  OK: ~/.claude/${file} refreshed`);
    }
  }

  // Agents — flat .md files
  const agentsSrc = path.join(DOTCLAUDE, 'agents');
  const agentsDst = path.join(CLAUDE, 'agents');
  if (fs.existsSync(agentsSrc)) {
    fs.mkdirSync(agentsDst, { recursive: true });
    const files = fs.readdirSync(agentsSrc).filter(f => f.endsWith('.md'));
    for (const f of files) {
      fs.copyFileSync(path.join(agentsSrc, f), path.join(agentsDst, f));
    }
    console.log(`  OK: ~/.claude/agents/ refreshed (${files.length} agent${files.length === 1 ? '' : 's'})`);
  }

  // Skills — nested directories with SKILL.md
  const skillsSrc = path.join(DOTCLAUDE, 'skills');
  const skillsDst = path.join(CLAUDE, 'skills');
  if (fs.existsSync(skillsSrc)) {
    fs.mkdirSync(skillsDst, { recursive: true });
    fs.cpSync(skillsSrc, skillsDst, { recursive: true, force: true });
    const skillCount = fs.readdirSync(skillsSrc).filter(f => f !== '.gitkeep').length;
    console.log(`  OK: ~/.claude/skills/ refreshed (${skillCount} skill${skillCount === 1 ? '' : 's'})`);
  }

  console.log('\nDone. GitHub + dotclaude up to date. No API keys required.');
})();
