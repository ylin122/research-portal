require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// Public companies (ticker)
const PUBLIC = [
  'solarwinds_seed',    // NYSE: SWI
  'tenable_s',          // Nasdaq: TENB
  'gendigital_s',       // Nasdaq: GEN
  'zoominfo_s',         // Nasdaq: ZI
  'dayforce_s',         // NYSE: DAY
  'evercommerce_s',     // Nasdaq: EVCM
  'ccinfo_s',           // Nasdaq: CCCS
  'ssctechnologies_s',  // Nasdaq: SSNC
  'nable_s',            // NYSE: NABL
  'clearwater_s',       // NYSE: CWAN
  'dyedurham_s',        // TSX: DND
  'opentext_s',         // Nasdaq: OTEX
  'thoughtworks_s',     // Nasdaq: TWKS
  'maxlinear_s',        // Nasdaq: MXL
  'allegro_s',          // Nasdaq: ALGM
  'adeia_s',            // Nasdaq: ADEA
  'coherent_s',         // NYSE: COHR
  'ncratleos_s',        // NYSE: NATL
  'celestica_s',        // NYSE: CLS
  'entegris_s',         // Nasdaq: ENTG
  'mksinst_s',          // Nasdaq: MKSI
  'waystar_s',          // Nasdaq: WAY
  'rackspace_s',        // Nasdaq: RXT
  'xerox_s',            // Nasdaq: XRX
  'godaddy_seed',       // NYSE: GDDY
  'kindercare_seed',    // NYSE: KLC
  'brighthorizons_seed',// NYSE: BFAM
  'skillsoft_seed',     // NYSE: SKIL
  'adtalem_seed',       // NYSE: ATGE
  'apld_seed',          // Nasdaq: APLD
  'coreweave_seed',     // Nasdaq: CRWV
  'terawulf_seed',      // Nasdaq: WULF
  'cipher_seed',        // Nasdaq: CIFR
  'ultraclean_s',       // Nasdaq: UCTT
  'zuora_s',            // was public, now Silver Lake private — marking private below
];

// Actually Zuora was taken private by Silver Lake in early 2025 — remove from public
const PUBLIC_SET = new Set(PUBLIC.filter(id => id !== 'zuora_s'));

async function run() {
  // Get all companies
  const { data: companies, error } = await sb.from('companies').select('id, name');
  if (error) { console.error(error); return; }

  let pubCount = 0, privCount = 0;
  for (const co of companies) {
    const status = PUBLIC_SET.has(co.id) ? 'Public' : 'Private';
    const { error: fErr } = await sb.from('company_fields').upsert(
      { company_id: co.id, field_key: 'public_private', text: status, date: '2026-03-22T00:00:00Z' },
      { onConflict: 'company_id,field_key' }
    );
    if (fErr) console.error(`  ${co.name} error:`, fErr);
    else {
      if (status === 'Public') pubCount++; else privCount++;
    }
  }
  console.log(`Done. ${pubCount} public, ${privCount} private.`);
}
run().catch(console.error);
