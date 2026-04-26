// ─── Push local ~/.claude/agents/ to Supabase + commit/push research portal to GitHub ───
// Run: node scripts/seed-agents.cjs
// This is the "log off" sync — run before switching machines.

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env.local') });
require('dotenv').config(); // fallback to .env for any keys .env.local doesn't set
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const AGENTS_DIR = path.join(require('os').homedir(), '.claude', 'agents');
const SKILLS_DIR = path.join(require('os').homedir(), '.claude', 'skills');

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
  'sync-pull':            { color: '#A78BFA', usage: '@sync-pull', mode: 'Read + Write (local files)', sort: 9 },
  'sync-push':            { color: '#A78BFA', usage: '@sync-push', mode: 'Read + Write (Supabase + GitHub)', sort: 10 },
  'numbers-audit':        { color: '#FBBF24', usage: '@numbers-audit refresh ETF_SENSITIVITY', mode: 'Audit (default) or Refresh/Fix', sort: 11 },
  // Skills (id prefixed with `skill-` in Supabase to coexist with agents in the same table)
  'skill-research-ingest':{ color: '#E879F9', usage: '/research-ingest', mode: 'Read + Write. End-to-end pipeline.', sort: 100 },
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

  const localIds = new Set();
  for (const file of files) {
    const raw = fs.readFileSync(path.join(AGENTS_DIR, file), 'utf-8');
    const parsed = parseFrontmatter(raw);
    if (!parsed) { console.log(`  SKIP: ${file} (no frontmatter)`); continue; }

    const id = file.replace('.md', '');
    localIds.add(id);
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

  // ── Step 1b: Push skill .md files to Supabase (id prefix `skill-`) ──
  if (fs.existsSync(SKILLS_DIR)) {
    const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory()).map(d => d.name);
    console.log(`Found ${skillDirs.length} skill folder(s) in ${SKILLS_DIR}`);

    for (const skillName of skillDirs) {
      const skillFile = path.join(SKILLS_DIR, skillName, 'SKILL.md');
      if (!fs.existsSync(skillFile)) { console.log(`  SKIP: ${skillName} (no SKILL.md)`); continue; }
      const raw = fs.readFileSync(skillFile, 'utf-8');
      const parsed = parseFrontmatter(raw);
      if (!parsed) { console.log(`  SKIP: ${skillName} (no frontmatter)`); continue; }

      const id = `skill-${skillName}`;
      localIds.add(id);
      const meta = UI_META[id] || { color: '#E879F9', usage: `/${skillName}`, mode: '', sort: 100 };

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
  }

  // ── Step 1c: Reconcile — delete Supabase rows with no matching local file ──
  const { data: remoteRows, error: listErr } = await supabase.from('agent_definitions').select('id');
  if (listErr) {
    console.error(`  RECONCILE ERROR: ${listErr.message}`);
  } else {
    const orphans = remoteRows.map(r => r.id).filter(id => !localIds.has(id));
    if (orphans.length === 0) {
      console.log('  Reconcile: no orphan rows to delete.');
    } else {
      console.log(`  Reconcile: deleting ${orphans.length} orphan row(s): ${orphans.join(', ')}`);
      const { error: delErr } = await supabase.from('agent_definitions').delete().in('id', orphans);
      if (delErr) console.error(`  DELETE ERROR: ${delErr.message}`);
      else console.log('  Orphans deleted.');
    }
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
