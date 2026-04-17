// ─── Pull from GitHub + Supabase to local machine ───
// Run: node scripts/sync-agents.cjs
// This is the "log on" sync — run when starting on a new machine.

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const AGENTS_DIR = path.join(require('os').homedir(), '.claude', 'agents');

function toMd({ name, description, tools, body }) {
  return `---\nname: ${name}\ndescription: ${description}\ntools: ${tools}\n---\n\n${body}\n`;
}

(async () => {
  // ── Step 1: Pull latest repos from GitHub ──
  console.log('\n=== Step 1: Pull repos from GitHub ===');
  const repos = [
    { name: 'research-portal', dir: path.join(__dirname, '..'), branch: 'main' },
    { name: 'portfolio-dashboard', dir: path.join(require('os').homedir(), 'projects', 'portfolio-dashboard'), branch: 'master' },
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

  // ── Step 2: Pull agent definitions from Supabase to local ──
  console.log('\n=== Step 2: Pull agents from Supabase ===');
  const { data, error } = await supabase
    .from('agent_definitions')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) { console.error('Failed to fetch agents:', error.message); process.exit(1); }
  if (!data || data.length === 0) { console.log('No agents found in Supabase.'); return; }

  fs.mkdirSync(AGENTS_DIR, { recursive: true });

  // Track which files came from Supabase
  const supabaseIds = new Set();

  for (const agent of data) {
    const filePath = path.join(AGENTS_DIR, `${agent.id}.md`);
    fs.writeFileSync(filePath, toMd(agent), 'utf-8');
    supabaseIds.add(`${agent.id}.md`);
    console.log(`  OK: ${agent.id}.md`);
  }

  // Check for local-only agents (exist on disk but not in Supabase)
  const localFiles = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
  const localOnly = localFiles.filter(f => !supabaseIds.has(f));
  if (localOnly.length > 0) {
    console.log(`\n  Local-only agents (not in Supabase):`);
    for (const f of localOnly) {
      console.log(`    ${f} — run @sync-agents-push to upload`);
    }
  }

  // ── Step 3: Pull dotclaude + refresh ~/.claude/CLAUDE.md and settings.json ──
  console.log('\n=== Step 3: Pull dotclaude + refresh ~/.claude/{CLAUDE.md,settings.json} ===');
  const dotclaudeDir = path.join(require('os').homedir(), 'dotclaude');
  if (!fs.existsSync(dotclaudeDir)) {
    console.log('  SKIP: ~/dotclaude not cloned on this machine');
    console.log('  Run: git clone https://github.com/ylin122/dotclaude.git ~/dotclaude');
  } else {
    try {
      const result = execSync('git pull --ff-only origin main', { cwd: dotclaudeDir, encoding: 'utf-8' }).trim();
      console.log(`  ${result.split('\n')[0]}`);
      const claudeDir = path.join(require('os').homedir(), '.claude');
      for (const file of ['CLAUDE.md', 'settings.json']) {
        const src = path.join(dotclaudeDir, file);
        const dst = path.join(claudeDir, file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dst);
          console.log(`  OK: ~/.claude/${file} refreshed`);
        }
      }
      const skillsSrc = path.join(dotclaudeDir, 'skills');
      const skillsDst = path.join(claudeDir, 'skills');
      if (fs.existsSync(skillsSrc)) {
        fs.mkdirSync(skillsDst, { recursive: true });
        fs.cpSync(skillsSrc, skillsDst, { recursive: true, force: true });
        const skillCount = fs.readdirSync(skillsSrc).filter(f => f !== '.gitkeep').length;
        console.log(`  OK: ~/.claude/skills/ refreshed (${skillCount} skill${skillCount === 1 ? '' : 's'})`);
      }
    } catch (e) {
      console.error('  dotclaude error:', e.message.split('\n')[0]);
    }
  }

  console.log(`\nDone. Synced ${data.length} agents from Supabase. GitHub + dotclaude up to date.`);
})();
