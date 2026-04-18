// ─── Push local ~/.claude/agents/ to Supabase + commit/push research portal to GitHub ───
// Run: node scripts/seed-agents.cjs
// This is the "log off" sync — run before switching machines.

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

// UI metadata — color, usage example, mode, sort order
const UI_META = {
  'codeverifier':         { color: '#34d673', usage: '@codeverifier check the Restructuring.jsx changes', mode: 'Read-only', sort: 0 },
  'fact-checker':         { color: '#70b0fa', usage: '@fact-checker check the PetSmart case in Restructuring.jsx', mode: 'Read-only', sort: 1 },
  'fact-disputer':        { color: '#f87171', usage: '@fact-disputer check the PetSmart case in Restructuring.jsx', mode: 'Read-only', sort: 2 },
  'fact-check-reconciler':{ color: '#f5a623', usage: '@fact-check-reconciler reconcile the results above', mode: 'Read-only. Runs after both fact agents return.', sort: 3 },
  'deploy':               { color: '#06B6D4', usage: '@deploy ship the latest changes', mode: 'Read + Write (git operations)', sort: 4 },
  'whatif':               { color: '#F97316', usage: '@whatif massive delays in R100 launch date driven by supply chain shocks', mode: 'Read-only', sort: 5 },
  'refresh':              { color: '#14B8A6', usage: '@refresh update the AI Research tab', mode: 'Read + Write', sort: 6 },
  'third-party-research': { color: '#38BDF8', usage: '@third-party-research pull everything on Perforce', mode: 'Read-only. Runs local Playwright-authenticated CLI tools.', sort: 7 },
  'consistency':          { color: '#c084fc', usage: '@consistency check credit research', mode: 'Read-only', sort: 8 },
  'sync-agents-pull':     { color: '#A78BFA', usage: '@sync-agents-pull', mode: 'Read + Write (local files)', sort: 9 },
  'sync-agents-push':     { color: '#A78BFA', usage: '@sync-agents-push', mode: 'Read + Write (Supabase + GitHub)', sort: 10 },
  'portfolio-verifier':   { color: '#F472B6', usage: '@portfolio-verifier refresh ETF_SENSITIVITY', mode: 'Read + Write (PortfolioDashboard.jsx)', sort: 11 },
};

function parseFrontmatter(raw) {
  const first = raw.indexOf('---');
  const second = raw.indexOf('---', first + 3);
  if (first < 0 || second < 0) return null;
  const fmBlock = raw.slice(first + 3, second).trim();
  const fm = {};
  for (const line of fmBlock.split('\n')) {
    const idx = line.indexOf(':');
    if (idx > 0) fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  const body = raw.slice(second + 3).trim();
  return { name: fm.name || '', description: fm.description || '', tools: fm.tools || '', body };
}

(async () => {
  // ── Step 1: Push agent .md files to Supabase ──
  console.log('\n=== Step 1: Push agents to Supabase ===');
  const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} agent files in ${AGENTS_DIR}`);

  for (const file of files) {
    const raw = fs.readFileSync(path.join(AGENTS_DIR, file), 'utf-8');
    const parsed = parseFrontmatter(raw);
    if (!parsed) { console.log(`  SKIP: ${file} (no frontmatter)`); continue; }

    const id = file.replace('.md', '');
    const meta = UI_META[id] || { color: '#70b0fa', usage: `@${id}`, mode: '', sort: 99 };

    const row = {
      id,
      name: parsed.name,
      description: parsed.description,
      tools: parsed.tools,
      body: parsed.body,
      color: meta.color,
      usage_example: meta.usage,
      mode: meta.mode,
      sort_order: meta.sort,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('agent_definitions').upsert(row, { onConflict: 'id' });
    if (error) console.error(`  ERROR: ${id}:`, error.message);
    else console.log(`  OK: ${id}`);
  }

  // ── Step 2: Commit and push research portal to GitHub ──
  console.log('\n=== Step 2: Push research portal to GitHub ===');
  const repoDir = path.join(__dirname, '..');
  try {
    const status = execSync('git status --porcelain', { cwd: repoDir, encoding: 'utf-8' }).trim();
    if (!status) {
      console.log('  No changes to commit.');
    } else {
      console.log(`  ${status.split('\n').length} file(s) changed`);
      execSync('git add -A', { cwd: repoDir });
      execSync('git commit -m "Sync: push local changes before machine switch"', { cwd: repoDir });
      console.log('  Committed.');
    }
    execSync('git push origin main', { cwd: repoDir });
    console.log('  Pushed to GitHub.');
  } catch (e) {
    console.error('  Git error:', e.message.split('\n')[0]);
  }

  // ── Step 3: Push dotclaude changes ──
  console.log('\n=== Step 3: Push dotclaude changes ===');
  const dotclaudeDir = path.join(require('os').homedir(), 'dotclaude');
  if (!fs.existsSync(dotclaudeDir)) {
    console.log('  SKIP: ~/dotclaude not cloned on this machine');
  } else {
    try {
      const status = execSync('git status --porcelain', { cwd: dotclaudeDir, encoding: 'utf-8' }).trim();
      if (!status) {
        console.log('  No dotclaude changes to commit.');
      } else {
        console.log(`  ${status.split('\n').length} dotclaude file(s) changed`);
        execSync('git add -A', { cwd: dotclaudeDir });
        execSync('git commit -m "Sync: push dotclaude changes before machine switch"', { cwd: dotclaudeDir });
        console.log('  Committed.');
      }
      execSync('git push origin main', { cwd: dotclaudeDir });
      console.log('  dotclaude pushed to GitHub.');
    } catch (e) {
      console.error('  dotclaude error:', e.message.split('\n')[0]);
    }
  }

  console.log('\nDone. Supabase + GitHub + dotclaude are up to date.');
})();
