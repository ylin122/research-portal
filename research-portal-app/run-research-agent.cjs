/**
 * Research Agent — runs web searches for prioritized companies
 * and writes results to the research_results table in Supabase.
 *
 * Usage: node run-research-agent.cjs [--priority High,Medium,Low]
 *
 * Requires env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ANTHROPIC_API_KEY
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const ANTHROPIC_KEY = process.env.VITE_ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-20250514';

// Parse --priority flag (default: High,Medium)
const args = process.argv.slice(2);
const prIdx = args.indexOf('--priority');
const priorities = prIdx >= 0 && args[prIdx + 1]
  ? args[prIdx + 1].split(',').map(s => s.trim())
  : ['High', 'Medium'];

const SEARCH_CONFIGS = [
  {
    key: 'news',
    prompt: (name) => `Find the 6-8 most recent and important news about "${name}" from the last 90 days. Focus on: funding, M&A, product launches, executive changes, partnerships, earnings, regulatory actions, and major business developments. Sort by date, most recent first. Respond ONLY with a JSON array (no markdown, no preamble). Each item: {"headline": string (max 15 words), "source": string, "date": string (e.g. "Mar 15, 2026"), "summary": string (2-3 sentences), "category": string (one of: "M&A", "Earnings", "Product", "Leadership", "Partnership", "Regulatory", "Funding", "Other")}. If nothing found, return [].`,
  },
  {
    key: 'transactions',
    prompt: (name) => `Find all recent M&A transactions, acquisitions, divestitures, funding rounds, and strategic investments involving "${name}" or its direct competitors from the last 12 months. Respond ONLY with a JSON array (no markdown, no preamble). Each item: {"title": string, "date": string, "type": string (one of: "Acquisition", "Divestiture", "Funding", "IPO", "SPAC", "Strategic Investment", "Merger"), "value": string (deal value if known, else "Undisclosed"), "parties": string, "summary": string (2-3 sentences)}. If nothing found, return [].`,
  },
  {
    key: 'competitive',
    prompt: (name) => `Analyze the current competitive landscape for "${name}". Search for recent competitive developments, market share shifts, new entrants, product launches by competitors, and win/loss dynamics. Respond ONLY with a JSON array (no markdown, no preamble). Each item: {"competitor": string, "development": string, "date": string, "impact": string (one of: "Positive", "Negative", "Neutral"), "summary": string (2-3 sentences)}. If nothing found, return [].`,
  },
  {
    key: 'industry',
    prompt: (name) => `Search for the most important industry trends, regulatory changes, and macro developments affecting "${name}" and its sector over the last 6 months. Respond ONLY with a JSON array (no markdown, no preamble). Each item: {"trend": string, "source": string, "date": string, "impact": string (one of: "Tailwind", "Headwind", "Mixed"), "summary": string (2-3 sentences)}. If nothing found, return [].`,
  },
];

async function callClaude(prompt) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const d = await r.json();
  const txt = d.content?.map(i => i.type === 'text' ? i.text : '').filter(Boolean).join('\n') || '';
  try {
    const parsed = JSON.parse(txt.replace(/```json|```/g, '').trim());
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function main() {
  console.log(`Research Agent starting — priorities: ${priorities.join(', ')}`);

  // Load companies
  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, name, sector, priority')
    .in('priority', priorities);

  if (error) { console.error('Failed to load companies:', error); process.exit(1); }
  if (!companies || companies.length === 0) { console.log('No companies found for given priorities.'); return; }

  console.log(`Found ${companies.length} companies to research.\n`);

  for (const co of companies) {
    console.log(`--- ${co.name} (${co.priority}) ---`);
    const results = {};

    for (const cfg of SEARCH_CONFIGS) {
      process.stdout.write(`  ${cfg.key}... `);
      try {
        const items = await callClaude(cfg.prompt(co.name));
        results[cfg.key] = items;
        console.log(`${items.length} results`);
      } catch (e) {
        console.log(`error: ${e.message}`);
        results[cfg.key] = [];
      }
    }

    // Upsert to Supabase
    const { error: upsertErr } = await supabase.from('research_results').upsert(
      {
        company_id: co.id,
        news: results.news || [],
        transactions: results.transactions || [],
        competitive: results.competitive || [],
        industry: results.industry || [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'company_id' }
    );

    if (upsertErr) {
      console.log(`  ⚠ Failed to save: ${upsertErr.message}`);
    } else {
      console.log(`  ✓ Saved to Supabase\n`);
    }
  }

  console.log('Research Agent complete.');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
