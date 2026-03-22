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

// ─── Company Fields ────────────────────────────────────
export async function loadAllFields() {
  const { data, error } = await supabase.from('company_fields').select('*');
  if (error) { console.error('loadAllFields:', error); return {}; }
  const map = {};
  for (const row of data || []) {
    if (!map[row.company_id]) map[row.company_id] = {};
    map[row.company_id][row.field_key] = { text: row.text || '', date: row.date || '' };
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
