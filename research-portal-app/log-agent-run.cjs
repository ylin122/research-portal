// Usage: node log-agent-run.cjs --agent "refresh" --task "Industry Research" --changes "Updated 24 data points..." --files "IndustryResearch.jsx,App.jsx" --issues-found 8 --issues-fixed 8 --duration 360000
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    result[key] = args[i + 1] || '';
  }
  return result;
}

async function main() {
  const args = parseArgs();
  if (!args.agent || !args.task) {
    console.error('Required: --agent <name> --task <description>');
    console.error('Optional: --changes <summary> --files <comma-separated> --issues-found <n> --issues-fixed <n> --duration <ms>');
    process.exit(1);
  }

  const row = {
    agent_name: args.agent,
    task: args.task,
    changes: args.changes || '',
    files_modified: args.files ? args.files.split(',').map(f => f.trim()) : [],
    issues_found: args['issues-found'] ? parseInt(args['issues-found']) : null,
    issues_fixed: args['issues-fixed'] ? parseInt(args['issues-fixed']) : null,
    duration_ms: args.duration ? parseInt(args.duration) : null,
  };

  const { error } = await supabase.from('agent_runs').insert(row);
  if (error) {
    console.error('Failed to log:', error.message);
    process.exit(1);
  }
  console.log(`Logged: ${row.agent_name} — ${row.task}`);
}

main();
