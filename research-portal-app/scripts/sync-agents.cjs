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
  // ── Step 1: Pull latest research portal from GitHub ──
  console.log('\n=== Step 1: Pull research portal from GitHub ===');
  const repoDir = path.join(__dirname, '..');
  try {
    const result = execSync('git pull origin main', { cwd: repoDir, encoding: 'utf-8' }).trim();
    console.log(`  ${result}`);
  } catch (e) {
    console.error('  Git pull error:', e.message.split('\n')[0]);
    console.log('  Continuing with Supabase sync...');
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

  console.log(`\nDone. Synced ${data.length} agents from Supabase. GitHub is up to date.`);
})();
