/**
 * AUDIT 02: Labels & Classification
 * Checks public/private labels, priority distribution, sector/sub validity.
 * Writes results to results/02_labels_and_classification.json
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const SKIP_SECTORS = ['prompts', 'sources'];

// Known valid sector/sub combos
const VALID_SUBS = {
  software: ['application', 'infrastructure', 'security', 'other'],
  aidigital: ['compute', 'shell', 'other'],
  itservices: ['var', 'consulting', 'outsourcing', 'managed', 'other'],
  internet: ['ecommerce', 'adtech', 'social', 'marketplace', 'hosting', 'other'],
  hardware: ['semiconductors', 'devices', 'networking', 'other'],
  education: ['edtech', 'traditional', 'corporate', 'other'],
  healthcare: ['ehr', 'analytics', 'digital', 'other'],
};

async function run() {
  const { data: companies } = await sb.from('companies').select('id, name, sector, sub, priority');
  const { data: fields } = await sb.from('company_fields').select('company_id, field_key, text').eq('field_key', 'public_private');

  const ppMap = {};
  for (const f of fields || []) ppMap[f.company_id] = f.text || '';

  const flags = [];
  const priorityDist = { High: 0, Medium: 0, Low: 0, Watching: 0, unset: 0 };
  const ppDist = { Public: 0, Private: 0, unset: 0 };
  const sectorDist = {};

  for (const co of companies) {
    if (SKIP_SECTORS.includes(co.sector)) continue;

    // Public/Private
    const pp = ppMap[co.id] || '';
    if (!pp) {
      flags.push({ company: co.name, id: co.id, issue: 'public_private_missing', detail: 'No public/private label set' });
      ppDist.unset++;
    } else if (pp.startsWith('Public')) {
      ppDist.Public++;
    } else {
      ppDist.Private++;
    }

    // Priority
    const pri = co.priority || '';
    if (pri && priorityDist[pri] !== undefined) {
      priorityDist[pri]++;
    } else if (pri) {
      priorityDist[pri] = (priorityDist[pri] || 0) + 1;
    } else {
      priorityDist.unset++;
      // Don't flag — most companies won't have priority set
    }

    // Sector/Sub validation
    const sKey = `${co.sector}/${co.sub}`;
    sectorDist[sKey] = (sectorDist[sKey] || 0) + 1;

    if (!co.sector || !co.sub) {
      flags.push({ company: co.name, id: co.id, issue: 'missing_sector', detail: `sector="${co.sector}" sub="${co.sub}"` });
    } else if (VALID_SUBS[co.sector] && !VALID_SUBS[co.sector].includes(co.sub)) {
      flags.push({ company: co.name, id: co.id, issue: 'invalid_subsector', detail: `"${co.sub}" not in valid list for "${co.sector}"` });
    }
  }

  const output = {
    check: '02_labels_and_classification',
    timestamp: new Date().toISOString(),
    summary: {
      public_private: ppDist,
      priority: priorityDist,
      sectors: sectorDist,
      flag_count: flags.length,
    },
    flags,
  };

  const outPath = path.join(__dirname, 'results', '02_labels_and_classification.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`02_labels: ${ppDist.Public} public, ${ppDist.Private} private, ${ppDist.unset} unset | ${flags.length} flags`);
}

run().catch(e => { console.error('02 FAILED:', e.message); process.exit(1); });
