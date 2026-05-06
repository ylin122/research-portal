/**
 * AUDIT 01: Field Coverage
 * Checks that every company has all 7 research fields populated.
 * Writes results to results/01_field_coverage.json
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const REQUIRED_FIELDS = ['overview', 'products', 'customers', 'industry', 'competitive', 'transactions', 'financials'];
const SKIP_SECTORS = ['prompts', 'sources'];

async function run() {
  const { data: companies } = await sb.from('companies').select('id, name, sector, sub');
  const { data: fields } = await sb.from('company_fields').select('company_id, field_key, text');

  // Build field map
  const fieldMap = {};
  for (const f of fields || []) {
    if (!fieldMap[f.company_id]) fieldMap[f.company_id] = {};
    fieldMap[f.company_id][f.field_key] = f.text || '';
  }

  const results = [];
  let totalFields = 0;
  let filledFields = 0;

  for (const co of companies) {
    if (SKIP_SECTORS.includes(co.sector)) continue;

    const coFields = fieldMap[co.id] || {};
    const missing = [];
    const empty = [];

    for (const key of REQUIRED_FIELDS) {
      totalFields++;
      if (!(key in coFields)) {
        missing.push(key);
      } else if (coFields[key].trim().length < 10) {
        empty.push(key);
      } else {
        filledFields++;
      }
    }

    const pct = Math.round(((REQUIRED_FIELDS.length - missing.length - empty.length) / REQUIRED_FIELDS.length) * 100);

    results.push({
      id: co.id,
      name: co.name,
      sector: co.sector,
      sub: co.sub,
      missing,
      empty,
      pct_complete: pct,
    });
  }

  results.sort((a, b) => a.pct_complete - b.pct_complete);

  const complete = results.filter(r => r.pct_complete === 100).length;
  const partial = results.filter(r => r.pct_complete > 0 && r.pct_complete < 100).length;
  const zero = results.filter(r => r.pct_complete === 0).length;

  const output = {
    check: '01_field_coverage',
    timestamp: new Date().toISOString(),
    summary: {
      total_companies: results.length,
      fully_complete: complete,
      partially_complete: partial,
      zero_fields: zero,
      avg_completion: Math.round(results.reduce((s, r) => s + r.pct_complete, 0) / results.length),
    },
    flags: results.filter(r => r.pct_complete < 100),
    all: results,
  };

  const outPath = path.join(__dirname, 'results', '01_field_coverage.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`01_field_coverage: ${complete}/${results.length} complete, ${zero} empty, avg ${output.summary.avg_completion}%`);
}

run().catch(e => { console.error('01 FAILED:', e.message); process.exit(1); });
