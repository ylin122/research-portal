// ─── Seed agent definitions from ~/.claude/agents/ into Supabase ───
// Run: node scripts/seed-agents.cjs
// Requires: dotenv, @supabase/supabase-js (already installed)

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const AGENTS_DIR = path.join(require('os').homedir(), '.claude', 'agents');

// UI metadata for each agent (color, usage example, mode)
const UI_META = {
  'verifier':             { color: '#34d673', usage: '@verifier check the Restructuring.jsx changes', mode: 'Read-only. Never modifies files.', sort: 0 },
  'fact-checker':         { color: '#70b0fa', usage: '@fact-checker check the PetSmart case in Restructuring.jsx', mode: 'Read-only. Searches web for corroboration.', sort: 1 },
  'fact-disputer':        { color: '#f87171', usage: '@fact-disputer check the PetSmart case in Restructuring.jsx', mode: 'Read-only. Searches for contradicting evidence.', sort: 2 },
  'fact-check-reconciler':{ color: '#f5a623', usage: '@fact-check-reconciler reconcile the results above', mode: 'Read-only. Runs after both fact agents return.', sort: 3 },
  'deploy':               { color: '#06B6D4', usage: '@deploy ship the latest changes', mode: 'Read + Write (git operations). Never force pushes or commits secrets.', sort: 4 },
  'whatif':               { color: '#F97316', usage: '@whatif massive delays in R100 launch date driven by supply chain shocks', mode: 'Read-only. Pulls company data from Supabase, researches scenario via web.', sort: 5 },
  'refresh':              { color: '#14B8A6', usage: '@refresh update the AI Research tab', mode: 'Read + Write. Edits hardcoded JSX; reports changes needed for DB-backed tabs.', sort: 6 },
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
  const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} agent files in ${AGENTS_DIR}`);

  for (const file of files) {
    const raw = fs.readFileSync(path.join(AGENTS_DIR, file), 'utf-8');
    const parsed = parseFrontmatter(raw);
    if (!parsed) { console.log(`  SKIP: ${file} (no frontmatter)`); continue; }

    const id = file.replace('.md', '');
    const meta = UI_META[id] || { color: '#70b0fa', usage: '', mode: '', sort: 99 };

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

  console.log('Done.');
})();
