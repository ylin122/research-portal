/**
 * AUDIT 07: Cross-Checks
 * Detects duplicates, orphaned records, and date anomalies.
 * Writes results to results/07_cross_checks.json
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const flags = [];

  const { data: companies } = await sb.from('companies').select('id, name, sector, sub');
  const { data: fields } = await sb.from('company_fields').select('company_id, field_key, date');
  const { data: notes } = await sb.from('company_notes').select('company_id, date');
  const { data: news } = await sb.from('news_cache').select('company_id, date');
  const { data: kbArticles } = await sb.from('kb_articles').select('id, title, source_url');

  const companyIds = new Set(companies.map(c => c.id));

  // ── Duplicate company names ──
  const nameMap = {};
  for (const c of companies) {
    const normalized = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!nameMap[normalized]) nameMap[normalized] = [];
    nameMap[normalized].push({ id: c.id, name: c.name, sector: c.sector });
  }
  const dupeNames = Object.entries(nameMap).filter(([, v]) => v.length > 1);
  if (dupeNames.length > 0) {
    flags.push({
      issue: 'duplicate_company_names',
      detail: `${dupeNames.length} potential duplicates`,
      items: dupeNames.map(([, v]) => v),
    });
  }

  // ── Orphaned company_fields ──
  const orphanedFields = (fields || []).filter(f => !companyIds.has(f.company_id));
  const orphanedFieldIds = [...new Set(orphanedFields.map(f => f.company_id))];
  if (orphanedFieldIds.length > 0) {
    flags.push({
      issue: 'orphaned_company_fields',
      detail: `${orphanedFieldIds.length} company_ids in company_fields that don't exist in companies table`,
      items: orphanedFieldIds,
    });
  }

  // ── Orphaned company_notes ──
  const orphanedNotes = (notes || []).filter(n => !companyIds.has(n.company_id));
  const orphanedNoteIds = [...new Set(orphanedNotes.map(n => n.company_id))];
  if (orphanedNoteIds.length > 0) {
    flags.push({
      issue: 'orphaned_company_notes',
      detail: `${orphanedNoteIds.length} company_ids in company_notes that don't exist in companies table`,
      items: orphanedNoteIds,
    });
  }

  // ── Orphaned news_cache ──
  const orphanedNews = (news || []).filter(n => !companyIds.has(n.company_id));
  const orphanedNewsIds = [...new Set(orphanedNews.map(n => n.company_id))];
  if (orphanedNewsIds.length > 0) {
    flags.push({
      issue: 'orphaned_news_cache',
      detail: `${orphanedNewsIds.length} company_ids in news_cache that don't exist in companies table`,
      items: orphanedNewsIds,
    });
  }

  // ── Duplicate KB articles ──
  if (kbArticles && kbArticles.length > 0) {
    const titleMap = {};
    const urlMap = {};
    for (const a of kbArticles) {
      if (a.title) {
        const t = a.title.toLowerCase().trim();
        if (!titleMap[t]) titleMap[t] = [];
        titleMap[t].push(a.id);
      }
      if (a.source_url) {
        const u = a.source_url.toLowerCase().trim();
        if (!urlMap[u]) urlMap[u] = [];
        urlMap[u].push(a.id);
      }
    }
    const dupeTitles = Object.entries(titleMap).filter(([, v]) => v.length > 1);
    const dupeUrls = Object.entries(urlMap).filter(([, v]) => v.length > 1);

    if (dupeTitles.length > 0) {
      flags.push({ issue: 'duplicate_kb_titles', detail: `${dupeTitles.length} duplicate article titles`, items: dupeTitles.map(([t, ids]) => ({ title: t, ids })) });
    }
    if (dupeUrls.length > 0) {
      flags.push({ issue: 'duplicate_kb_urls', detail: `${dupeUrls.length} duplicate source URLs`, items: dupeUrls.map(([u, ids]) => ({ url: u, ids })) });
    }
  }

  // ── Date anomalies ──
  const now = new Date();
  const futureThreshold = new Date(now.getTime() + 86400000); // 1 day ahead is OK
  const pastThreshold = new Date('2023-01-01');
  const dateFlags = [];

  function checkDate(date, source, id) {
    if (!date) return;
    try {
      const d = new Date(date);
      if (d > futureThreshold) {
        dateFlags.push({ source, id, date, issue: 'future_date' });
      } else if (d < pastThreshold) {
        dateFlags.push({ source, id, date, issue: 'suspiciously_old' });
      }
    } catch {}
  }

  for (const f of (fields || [])) checkDate(f.date, 'company_fields', f.company_id + '/' + f.field_key);
  for (const n of (notes || [])) checkDate(n.date, 'company_notes', n.company_id);
  for (const n of (news || [])) checkDate(n.date, 'news_cache', n.company_id);

  if (dateFlags.length > 0) {
    flags.push({ issue: 'date_anomalies', detail: `${dateFlags.length} date issues found`, items: dateFlags });
  }

  const output = {
    check: '07_cross_checks',
    timestamp: new Date().toISOString(),
    summary: {
      duplicate_companies: dupeNames.length,
      orphaned_fields: orphanedFieldIds.length,
      orphaned_notes: orphanedNoteIds.length,
      orphaned_news: orphanedNewsIds.length,
      date_anomalies: dateFlags.length,
      total_flags: flags.length,
    },
    flags,
  };

  const outPath = path.join(__dirname, 'results', '07_cross_checks.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`07_cross: ${dupeNames.length} dupes, ${orphanedFieldIds.length + orphanedNoteIds.length + orphanedNewsIds.length} orphans, ${dateFlags.length} date issues`);
}

run().catch(e => { console.error('07 FAILED:', e.message); process.exit(1); });
