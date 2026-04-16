// ─── Sync agent definitions from Supabase to ~/.claude/agents/ ───
// Run: node scripts/sync-agents.cjs
// Pulls all agent definitions from Supabase and writes them as .md files

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const AGENTS_DIR = path.join(require('os').homedir(), '.claude', 'agents');

function toMd({ name, description, tools, body }) {
  return `---\nname: ${name}\ndescription: ${description}\ntools: ${tools}\n---\n\n${body}\n`;
}

(async () => {
  const { data, error } = await supabase
    .from('agent_definitions')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) { console.error('Failed to fetch agents:', error.message); process.exit(1); }
  if (!data || data.length === 0) { console.log('No agents found in Supabase.'); return; }

  fs.mkdirSync(AGENTS_DIR, { recursive: true });

  for (const agent of data) {
    const filePath = path.join(AGENTS_DIR, `${agent.id}.md`);
    fs.writeFileSync(filePath, toMd(agent), 'utf-8');
    console.log(`  OK: ${agent.id}.md`);
  }

  console.log(`Synced ${data.length} agents to ${AGENTS_DIR}`);
})();
