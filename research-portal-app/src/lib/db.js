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

export async function deleteCompany(id) {
  const { error } = await supabase.from('companies').delete().eq('id', id);
  if (error) console.error('deleteCompany:', error);
}

export async function updateCompanyPriority(id, priority) {
  const { error } = await supabase.from('companies').update({ priority }).eq('id', id);
  if (error) console.error('updateCompanyPriority:', error);
}

export async function updateCompanySector(id, sector, sub) {
  const { error } = await supabase.from('companies').update({ sector, sub }).eq('id', id);
  if (error) console.error('updateCompanySector:', error);
}

export async function updateCompanyMoats(id, moats) {
  const { error } = await supabase.from('companies').update({ moats }).eq('id', id);
  if (error) console.error('updateCompanyMoats:', error);
}

// ─── Company Fields ────────────────────────────────────
export async function loadAllFields() {
  const map = {};
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase.from('company_fields').select('*').range(from, from + pageSize - 1);
    if (error) { console.error('loadAllFields:', error); break; }
    for (const row of data || []) {
      if (!map[row.company_id]) map[row.company_id] = {};
      map[row.company_id][row.field_key] = { text: row.text || '', date: row.date || '' };
    }
    if (!data || data.length < pageSize) break;
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

// ─── Company Notes ─────────────────────────────────────
export async function loadAllNotes() {
  const { data, error } = await supabase
    .from('company_notes')
    .select('*')
    .order('date', { ascending: false });
  if (error) { console.error('loadAllNotes:', error); return {}; }
  const map = {};
  for (const row of data || []) {
    if (!map[row.company_id]) map[row.company_id] = [];
    map[row.company_id].push({ id: row.id, text: row.text, date: row.date });
  }
  return map;
}

export async function insertNote(companyId, noteId, text) {
  const date = new Date().toISOString();
  const { error } = await supabase.from('company_notes').insert({
    id: noteId, company_id: companyId, text, date
  });
  if (error) console.error('insertNote:', error);
  return date;
}

export async function deleteNote(noteId) {
  const { error } = await supabase.from('company_notes').delete().eq('id', noteId);
  if (error) console.error('deleteNote:', error);
}

// ─── News Cache ────────────────────────────────────────
export async function loadNewsCache() {
  const { data, error } = await supabase.from('news_cache').select('*');
  if (error) { console.error('loadNewsCache:', error); return {}; }
  const map = {};
  for (const row of data || []) {
    map[row.company_id] = { items: row.items || [], date: row.date };
  }
  return map;
}

export async function upsertNewsCache(companyId, items) {
  const date = new Date().toISOString();
  const { error } = await supabase.from('news_cache').upsert(
    { company_id: companyId, items, date },
    { onConflict: 'company_id' }
  );
  if (error) console.error('upsertNewsCache:', error);
  return date;
}

// ─── Research Results ─────────────────────────────────
export async function loadResearchResults() {
  const { data, error } = await supabase.from('research_results').select('*');
  if (error) { console.error('loadResearchResults:', error); return {}; }
  const map = {};
  for (const row of data || []) {
    map[row.company_id] = {
      news: row.news || [],
      transactions: row.transactions || [],
      competitive: row.competitive || [],
      industry: row.industry || [],
      lastUpdated: row.updated_at,
    };
  }
  return map;
}

export async function upsertResearchResult(companyId, results) {
  const { error } = await supabase.from('research_results').upsert(
    { company_id: companyId, news: results.news || [], transactions: results.transactions || [], competitive: results.competitive || [], industry: results.industry || [], updated_at: new Date().toISOString() },
    { onConflict: 'company_id' }
  );
  if (error) console.error('upsertResearchResult:', error);
}

// ─── Agent Definitions ────────────────────────────────
export async function loadAgents() {
  const { data, error } = await supabase
    .from('agent_definitions')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) { console.error('loadAgents:', error); return []; }
  return data || [];
}

export async function upsertAgent(agent) {
  const { error } = await supabase.from('agent_definitions').upsert(
    { ...agent, updated_at: new Date().toISOString() },
    { onConflict: 'id' }
  );
  if (error) console.error('upsertAgent:', error);
}

export async function deleteAgent(id) {
  const { error } = await supabase.from('agent_definitions').delete().eq('id', id);
  if (error) console.error('deleteAgent:', error);
}

// ─── Sector Notes ──────────────────────────────────────
export async function loadSectorNotes() {
  const { data, error } = await supabase.from('sector_notes').select('*');
  if (error) { console.error('loadSectorNotes:', error); return {}; }
  const map = {};
  for (const row of data || []) {
    map[row.key] = { text: row.text || '', date: row.date || '' };
  }
  return map;
}

export async function upsertSectorNote(key, text) {
  const date = new Date().toISOString();
  const { error } = await supabase.from('sector_notes').upsert(
    { key, text, date },
    { onConflict: 'key' }
  );
  if (error) console.error('upsertSectorNote:', error);
  return date;
}
