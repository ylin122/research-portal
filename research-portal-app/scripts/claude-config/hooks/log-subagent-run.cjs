#!/usr/bin/env node
// SubagentStop hook → logs subagent runs to Supabase `agent_runs`.
// Both pa-dashboard and research-portal POST directly to their own Supabase
// using the project's service-role / secret key (not anon) so the table RLS
// can stay locked down (no anon-insert policy needed).

const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const https = require('https');

const LOG = path.join(os.homedir(), '.claude', 'hooks', 'log-subagent-run.log');
// Best-effort logger — intentionally swallows FS errors so hook never crashes on log failure.
const debug = msg => { try { fs.appendFileSync(LOG, `[${new Date().toISOString()}] ${msg}\n`); } catch {} };

function loadEnv(file) {
  const env = {};
  try {
    fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach(line => {
      const s = line.replace(/^\s*(export\s+)?/, '').trim();
      if (!s || s.startsWith('#')) return;
      const eq = s.indexOf('=');
      if (eq < 1) return;
      const key = s.slice(0, eq).trim();
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) return;
      let value = s.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    });
  } catch (e) { debug(`env load failed ${file}: ${e.message}`); }
  return env;
}

function detectProject(cwd, fallbackText) {
  // Prompt is more authoritative than cwd: Claude Code's subagent cwd often
  // reflects the last `cd` target rather than user intent. Prompt wins when
  // it names exactly one project; cwd is only the tiebreaker.
  const fb = (fallbackText || '').toLowerCase();
  const promptPA = fb.includes('portfolio-dashboard') || fb.includes('pa-dashboard') || fb.includes('portfolio dashboard') || fb.includes('pa dashboard');
  const promptRP = fb.includes('research-portal') || fb.includes('research portal');
  if (promptPA && !promptRP) return 'pa-dashboard';
  if (promptRP && !promptPA) return 'research-portal';

  const cwdLower = (cwd || '').toLowerCase().replace(/\\/g, '/');
  if (cwdLower.includes('/portfolio-dashboard') || cwdLower.includes('/pa-dashboard')) return 'pa-dashboard';
  if (cwdLower.includes('/research-portal')) return 'research-portal';

  // Both projects mentioned in prompt and no cwd signal — pick whichever appears first
  if (promptPA && promptRP) {
    const paIdx = Math.min(fb.indexOf('portfolio-dashboard'), fb.indexOf('pa-dashboard'));
    const rpIdx = fb.indexOf('research-portal');
    return paIdx >= 0 && (paIdx < rpIdx || rpIdx < 0) ? 'pa-dashboard' : 'research-portal';
  }
  return null;
}

function readSubagentTranscript(transcriptPath) {
  let text;
  try { text = fs.readFileSync(transcriptPath, 'utf8'); } catch { return {}; }
  const lines = text.trim().split(/\r?\n/);
  let firstUserPrompt = null, firstTs = null, lastTs = null;
  const files = new Set();
  for (const line of lines) {
    let obj;
    try { obj = JSON.parse(line); } catch { continue; }
    if (obj.timestamp) {
      if (!firstTs) firstTs = obj.timestamp;
      lastTs = obj.timestamp;
    }
    if (!firstUserPrompt && obj.type === 'user') {
      const c = obj.message?.content;
      if (typeof c === 'string') firstUserPrompt = c.slice(0, 200);
    }
    const content = obj.message?.content;
    if (Array.isArray(content)) {
      for (const c of content) {
        if (c?.type === 'tool_use' && ['Edit', 'Write', 'NotebookEdit'].includes(c.name)) {
          const p = c.input?.file_path;
          if (p) files.add(p);
        }
      }
    }
  }
  return { firstUserPrompt, files: [...files], firstTs, lastTs };
}

function findAgentCallFromMain(transcriptPath) {
  let text;
  try { text = fs.readFileSync(transcriptPath, 'utf8'); } catch { return null; }
  const lines = text.trim().split(/\r?\n/);
  for (let i = lines.length - 1; i >= 0; i--) {
    let obj;
    try { obj = JSON.parse(lines[i]); } catch { continue; }
    const content = obj?.message?.content;
    if (!Array.isArray(content)) continue;
    const tu = content.find(c => c && c.type === 'tool_use' && /^(Agent|Task)$/i.test(c.name));
    if (tu) return { input: tu.input || {}, timestamp: obj.timestamp };
  }
  return null;
}

function postJSON(urlStr, headers, body) {
  return new Promise((resolve) => {
    const u = new URL(urlStr);
    const mod = u.protocol === 'https:' ? https : http;
    const payload = Buffer.from(JSON.stringify(body));
    const req = mod.request({
      hostname: u.hostname,
      port: u.port || (u.protocol === 'https:' ? 443 : 80),
      path: u.pathname + u.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': payload.length, ...headers },
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 400) debug(`POST ${urlStr} ${res.statusCode}: ${data.slice(0, 200)}`);
        else debug(`POST ${urlStr} ok (${res.statusCode})`);
        resolve();
      });
    });
    req.on('error', e => { debug(`POST ${urlStr} error: ${e.message}`); resolve(); });
    req.write(payload);
    req.end();
  });
}

async function main() {
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;
  let payload = {};
  try { payload = JSON.parse(raw || '{}'); } catch {}

  const agentType = payload.agent_type || 'unknown';
  const mainTranscript = payload.transcript_path;
  const subTranscript = payload.agent_transcript_path;
  const cwd = payload.cwd || process.cwd();

  let task = '', files = [], duration_ms = null, fallbackText = '';
  if (subTranscript && fs.existsSync(subTranscript)) {
    const info = readSubagentTranscript(subTranscript);
    task = info.firstUserPrompt || agentType;
    files = info.files || [];
    fallbackText = info.firstUserPrompt || '';
    if (info.firstTs && info.lastTs) {
      duration_ms = Math.max(0, new Date(info.lastTs).getTime() - new Date(info.firstTs).getTime());
    }
  } else if (mainTranscript) {
    const agent = findAgentCallFromMain(mainTranscript);
    if (agent) {
      task = (agent.input.description || agent.input.subagent_type || 'subagent').slice(0, 200);
      fallbackText = `${agent.input.description || ''} ${agent.input.prompt || ''}`;
      if (agent.timestamp) duration_ms = Math.max(0, Date.now() - new Date(agent.timestamp).getTime());
    }
  }

  const project = detectProject(cwd, fallbackText);
  if (!project) { debug(`no project match: cwd=${cwd}`); return; }

  let url, key, credsPath;
  if (project === 'pa-dashboard') {
    credsPath = path.join(os.homedir(), '.claude', 'hooks', 'supabase-creds.env');
    const creds = loadEnv(credsPath);
    url = creds.PA_SUPABASE_URL;
    key = creds.PA_SUPABASE_SECRET_KEY || creds.PA_SUPABASE_ANON_KEY;
  } else {
    credsPath = path.join(os.homedir(), 'projects', 'research-portal', 'research-portal-app', '.env.local');
    const env = loadEnv(credsPath);
    url = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
    key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;
  }
  if (!url || !key) { debug(`missing supabase creds for ${project} (tried ${credsPath})`); return; }

  const row = {
    agent_name: agentType,
    task: (task || agentType).slice(0, 200),
    files_modified: files.length ? files : null,
    duration_ms,
    project,
  };

  debug(`logging ${project}/${agentType}: ${row.task}`);
  await postJSON(`${url}/rest/v1/agent_runs`, {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Prefer: 'return=minimal',
  }, row);
}

main().catch(e => debug(`fatal: ${e.message}`));
