require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// Explicit labels: Public or Private
const LABELS = {
  // ── SOFTWARE: Cloud ──
  'citrix_seed':        'Private',
  'newfold_seed':       'Private',

  // ── SOFTWARE: Infrastructure ──
  'precisely_seed':     'Private',
  'perforce_seed':      'Private',
  'qlik_seed':          'Private',
  'smartbear_seed':     'Private',
  'cloudera_seed':      'Private',
  'idera_seed':         'Private',

  // ── SOFTWARE: Security ──
  'sonicwall_seed':     'Private',
  'barracuda_seed':     'Private',
  'ivanti_seed':        'Private',
  'knowbe4_seed':       'Private',
  'infoblox_seed':      'Private',

  // ── SOFTWARE: Application ──
  'kofax_seed':         'Private',
  'cdk_seed':           'Private',
  'cvent_seed':         'Private',

  // ── AI DIGITAL: Compute ──
  'apld_seed':          'Public',
  'coreweave_seed':     'Public',
  'terawulf_seed':      'Public',
  'cipher_seed':        'Public',
};

async function run() {
  const date = new Date().toISOString();
  let ok = 0, fail = 0;

  for (const [companyId, text] of Object.entries(LABELS)) {
    const { error } = await sb.from('company_fields').upsert(
      { company_id: companyId, field_key: 'public_private', text, date },
      { onConflict: 'company_id,field_key' }
    );
    if (error) {
      console.error(`FAIL ${companyId}: ${error.message}`);
      fail++;
    } else {
      console.log(`OK   ${companyId} → ${text}`);
      ok++;
    }
  }
  console.log(`\nDone: ${ok} updated, ${fail} failed`);
}
run().catch(console.error);
