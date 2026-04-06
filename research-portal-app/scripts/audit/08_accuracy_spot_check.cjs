/**
 * AUDIT 08: Accuracy Spot Check (REQUIRES CLAUDE CODE)
 *
 * This script does NOT run automatically — it generates a structured checklist
 * for Claude Code to verify via web search. It picks a rotating sample of
 * companies and hardcoded data points each week.
 *
 * Writes checklist to results/08_accuracy_spot_check.json
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const SKIP_SECTORS = ['prompts', 'sources'];

async function run() {
  const { data: companies } = await sb.from('companies').select('id, name, sector, sub');
  const { data: fields } = await sb.from('company_fields').select('company_id, field_key, text');

  const active = companies.filter(c => !SKIP_SECTORS.includes(c.sector));
  const fieldMap = {};
  for (const f of fields || []) {
    if (!fieldMap[f.company_id]) fieldMap[f.company_id] = {};
    fieldMap[f.company_id][f.field_key] = f.text || '';
  }

  // Pick 5 companies using a weekly rotation based on week number
  const weekNum = Math.floor(Date.now() / (7 * 86400000));
  const shuffled = [...active].sort((a, b) => {
    const ha = hashStr(a.id + weekNum);
    const hb = hashStr(b.id + weekNum);
    return ha - hb;
  });
  const sample = shuffled.slice(0, 5);

  // Build checklist
  const checklist = [];

  for (const co of sample) {
    const coFields = fieldMap[co.id] || {};
    const pp = coFields.public_private || '';
    const checks = [];

    // Check public/private
    checks.push({
      field: 'public_private',
      current_value: pp || '(not set)',
      verify: pp.startsWith('Public')
        ? `Verify ${co.name} is publicly traded. Find ticker and exchange.`
        : `Verify ${co.name} is private. Check it has NOT IPO'd or been acquired by a public company.`,
    });

    // Check overview claims
    if (coFields.overview && coFields.overview.length > 50) {
      const snippet = coFields.overview.substring(0, 200);
      checks.push({
        field: 'overview',
        current_value: snippet + '...',
        verify: `Verify key claims: ownership, HQ, employee count, founding date. Flag anything incorrect.`,
      });
    }

    // Check products
    if (coFields.products && coFields.products.length > 50) {
      checks.push({
        field: 'products',
        current_value: coFields.products.substring(0, 200) + '...',
        verify: `Verify main products/services are current. Check for major product launches or discontinuations in last 6 months.`,
      });
    }

    // Check recent transactions
    if (coFields.transactions && coFields.transactions.length > 30) {
      checks.push({
        field: 'transactions',
        current_value: coFields.transactions.substring(0, 200) + '...',
        verify: `Verify transaction details (acquirer, date, amount). Check for any new transactions not listed.`,
      });
    }

    checklist.push({
      company: co.name,
      id: co.id,
      sector: `${co.sector}/${co.sub}`,
      checks,
    });
  }

  // Add hardcoded data checks
  const hardcodedChecks = [
    {
      section: 'AI Labs',
      item: 'OpenAI valuation',
      verify: 'Search for latest OpenAI valuation. Compare against what is in IndustryResearch.jsx.',
    },
    {
      section: 'AI Labs',
      item: 'Anthropic ARR',
      verify: 'Search for latest Anthropic ARR or revenue figure. Compare against portal data.',
    },
    {
      section: 'AI Labs',
      item: 'AI lab latest models',
      verify: 'For each lab (OpenAI, Anthropic, Google, xAI, Meta), verify the latest flagship model name is correct.',
    },
    {
      section: 'AI Labs',
      item: 'AI lab CEO/leadership',
      verify: 'Verify CEO for each AI lab has not changed.',
    },
    {
      section: 'AI-Native',
      item: 'Fastest 0-$1B ARR',
      verify: 'Verify current record holder for fastest 0 to $1B ARR among AI-native companies.',
    },
  ];

  const output = {
    check: '08_accuracy_spot_check',
    timestamp: new Date().toISOString(),
    week_number: weekNum,
    summary: {
      companies_sampled: sample.map(c => c.name),
      total_checks: checklist.reduce((s, c) => s + c.checks.length, 0) + hardcodedChecks.length,
    },
    company_checks: checklist,
    hardcoded_checks: hardcodedChecks,
    instructions: 'Run each check via web search. For each, report: PASS (correct), STALE (was correct but outdated), or FAIL (incorrect). Include the correct value if STALE or FAIL.',
  };

  const outPath = path.join(__dirname, 'results', '08_accuracy_spot_check.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`08_spot_check: ${sample.length} companies sampled, ${output.summary.total_checks} total checks generated`);
}

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

run().catch(e => { console.error('08 FAILED:', e.message); process.exit(1); });
