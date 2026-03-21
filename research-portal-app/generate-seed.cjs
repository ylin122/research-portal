// Run: node generate-seed.cjs > supabase-seed.sql
// Generates INSERT statements for all seed companies + fields + notes

const SEED_COMPANIES = [
  { id: "citrix_seed", name: "Citrix (Cloud Software Group)", sector: "software", sub: "cloud" },
  { id: "precisely_seed", name: "Precisely", sector: "software", sub: "infrastructure" },
  { id: "sonicwall_seed", name: "SonicWall", sector: "software", sub: "security" },
  { id: "barracuda_seed", name: "Barracuda Networks", sector: "software", sub: "security" },
  { id: "kofax_seed", name: "Kofax", sector: "software", sub: "application" },
  { id: "perforce_seed", name: "Perforce", sector: "software", sub: "infrastructure" },
  { id: "ivanti_seed", name: "Ivanti", sector: "software", sub: "security" },
  { id: "newfold_seed", name: "Newfold Digital", sector: "software", sub: "cloud" },
  { id: "cdk_seed", name: "CDK Global", sector: "software", sub: "application" },
  { id: "qlik_seed", name: "Qlik", sector: "software", sub: "infrastructure" },
  { id: "cvent_seed", name: "Cvent", sector: "software", sub: "application" },
  { id: "smartbear_seed", name: "SmartBear", sector: "software", sub: "infrastructure" },
  { id: "cloudera_seed", name: "Cloudera", sector: "software", sub: "infrastructure" },
  { id: "knowbe4_seed", name: "KnowBe4", sector: "software", sub: "security" },
  { id: "infoblox_seed", name: "Infoblox", sector: "software", sub: "security" },
  { id: "apld_seed", name: "Applied Digital", sector: "aidigital", sub: "compute" },
  { id: "coreweave_seed", name: "CoreWeave", sector: "aidigital", sub: "compute" },
  { id: "terawulf_seed", name: "TeraWulf", sector: "aidigital", sub: "compute" },
  { id: "cipher_seed", name: "Cipher Digital (fka Cipher Mining)", sector: "aidigital", sub: "compute" },
  { id: "idera_seed", name: "Idera", sector: "software", sub: "infrastructure" },
  { id: "prompt_researchbrief_seed", name: "Company Research Brief", sector: "prompts", sub: "all" },
  { id: "source_master_seed", name: "Research Sources", sector: "sources", sub: "all" },
];

// We read the original JSX to extract seed data
const fs = require('fs');
const content = fs.readFileSync('../research-portal.jsx', 'utf8');

// Extract SEED_DATA object - find the start and end
const seedStart = content.indexOf('const SEED_DATA = {');
const seedEnd = content.indexOf('\n// ─── Theme', seedStart);
const seedBlock = content.substring(seedStart, seedEnd);

// We'll use a different approach - eval the data in a sandboxed way
// Actually let's just parse the JSX file and extract via regex patterns

function esc(s) {
  if (!s) return '';
  return s.replace(/'/g, "''");
}

let output = [];
output.push('-- ============================================================');
output.push('-- Research Portal — Seed Data');
output.push('-- Run this AFTER supabase-schema.sql');
output.push('-- ============================================================');
output.push('');

// Insert companies
output.push('-- Companies');
for (const c of SEED_COMPANIES) {
  output.push(`INSERT INTO companies (id, name, sector, sub, priority) VALUES ('${c.id}', '${esc(c.name)}', '${c.sector}', '${c.sub}', '') ON CONFLICT (id) DO NOTHING;`);
}
output.push('');

// Now we need to extract seed data. Let's use a simpler approach -
// require the data from a separate extracted file
// Actually, the easiest approach is to just output the seed SQL from the JSX data directly
// Let me extract the SEED_DATA by evaluating it

// Create a temporary module that exports the data
const path = require('path');
const tempFile = path.join(__dirname, '_seed_extract.cjs');

// Extract just the SEED_DATA object
let dataStr = seedBlock.replace('const SEED_DATA = ', 'module.exports = ');
// Remove trailing semicolons
dataStr = dataStr.trimEnd();
if (dataStr.endsWith(';')) dataStr = dataStr.slice(0, -1);

fs.writeFileSync(tempFile, dataStr);

let SEED_DATA;
try {
  SEED_DATA = require(tempFile);
} catch(e) {
  console.error('// Failed to parse SEED_DATA:', e.message);
  console.error('// You will need to manually run the seed data');
  process.exit(1);
}

// Now generate INSERT statements for fields and notes
output.push('-- Company Fields');
for (const [companyId, data] of Object.entries(SEED_DATA)) {
  if (!data.fields) continue;

  // Set priority on company
  if (data.priority) {
    output.push(`UPDATE companies SET priority = '${esc(data.priority)}' WHERE id = '${companyId}';`);
  }

  for (const [fieldKey, fieldData] of Object.entries(data.fields)) {
    if (!fieldData || !fieldData.text) continue;
    const dateVal = fieldData.date ? `'${fieldData.date}'` : 'NULL';
    output.push(`INSERT INTO company_fields (company_id, field_key, text, date) VALUES ('${companyId}', '${fieldKey}', '${esc(fieldData.text)}', ${dateVal}) ON CONFLICT (company_id, field_key) DO UPDATE SET text = EXCLUDED.text, date = EXCLUDED.date;`);
  }
}
output.push('');

output.push('-- Company Notes');
for (const [companyId, data] of Object.entries(SEED_DATA)) {
  if (!data.notes || data.notes.length === 0) continue;
  for (const note of data.notes) {
    const dateVal = note.date ? `'${note.date}'` : 'now()';
    output.push(`INSERT INTO company_notes (id, company_id, text, date) VALUES ('${note.id}', '${companyId}', '${esc(note.text)}', ${dateVal}) ON CONFLICT (id) DO NOTHING;`);
  }
}

console.log(output.join('\n'));
