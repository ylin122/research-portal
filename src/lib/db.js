import { supabase } from './supabase';

// ─── Companies ─────────────────────────────────────────
export async function loadCompanies() {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { console.error('loadCompanies:', error); return []; }
  return data || [];
}

export async function insertCompany({ id, name, sector, sub }) {
  const { error } = await supabase.from('companies').insert({ id, name, sector, sub, priority: '' });
  if (error) console.error('insertCompany:', error);
}

export async function updateCompanyPriority(id, priority) {
  const { error } = await supabase.from('companies').update({ priority }).eq('id', id);
  if (error) console.error('updateCompanyPriority:', error);
}

export async function updateCompanySector(id, sector, sub) {
  const { error } = await supabase.from('companies').update({ sector, sub }).eq('id', id);
  if (error) console.error('updateCompanySector:', error);
}

// ─── Company Fields ────────────────────────────────────
export async function loadAllFields() {
  const map = {};
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase.from('company_fields').select('*').range(from, from + pageSize - 1);
    if (error) { console.error('loadAllFields:', error); break; }
    if (!data || data.length === 0) break;
    for (const row of data) {
      if (!map[row.company_id]) map[row.company_id] = {};
      map[row.company_id][row.field_key] = { text: row.text || '', date: row.date || '' };
    }
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return map;
}

export async function upsertField(companyId, fieldKey, text) {
  const date = new Date().toISOString();
  const { error } = await supabase.from('company_fields').upsert(
    { company_id: companyId, field_key: fieldKey, text, date },
    { onConflict: 'company_id,field_key' }
  );
  if (error) console.error('upsertField:', error);
  return date;
}

// ─── Compute Pricing ───────────────────────────────────────────
// Reads the latest snapshot of compute_prices written by the weekly cron.
export async function loadLatestComputePrices() {
  // First find the most recent as_of_date, then pull all rows for that date.
  const { data: latest, error: latestErr } = await supabase
    .from('compute_prices')
    .select('as_of_date')
    .order('as_of_date', { ascending: false })
    .limit(1);
  if (latestErr) { console.error('loadLatestComputePrices (latest):', latestErr); return { as_of: null, rows: [] }; }
  if (!latest || latest.length === 0) return { as_of: null, rows: [] };
  const as_of = latest[0].as_of_date;
  const { data, error } = await supabase
    .from('compute_prices')
    .select('*')
    .eq('as_of_date', as_of);
  if (error) { console.error('loadLatestComputePrices (rows):', error); return { as_of, rows: [] }; }
  return { as_of, rows: data || [] };
}

