/**
 * AUDIT 03: Freshness
 * Checks news cache staleness, research notes coverage, sector notes gaps.
 * Writes results to results/03_freshness.json
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const SKIP_SECTORS = ['prompts', 'sources'];
const NOW = Date.now();
const DAY = 86400000;

async function run() {
  const { data: companies } = await sb.from('companies').select('id, name, sector');
  const { data: news } = await sb.from('news_cache').select('company_id, date, items');
  const { data: notes } = await sb.from('company_notes').select('company_id, date');
  const { data: sectorNotes } = await sb.from('sector_notes').select('key, text, date');
  const { data: fields } = await sb.from('company_fields').select('company_id, field_key, date');

  const active = companies.filter(c => !SKIP_SECTORS.includes(c.sector));

  // News freshness
  const newsMap = {};
  for (const n of news || []) newsMap[n.company_id] = n;

  const newsFlags = [];
  let freshCount = 0, staleCount = 0, veryStaleCount = 0, missingCount = 0;

  for (const co of active) {
    const cached = newsMap[co.id];
    if (!cached) {
      newsFlags.push({ company: co.name, id: co.id, issue: 'no_news', detail: 'No cached news at all' });
      missingCount++;
    } else {
      const age = Math.round((NOW - new Date(cached.date).getTime()) / DAY);
      const itemCount = (cached.items || []).length;
      if (age > 30) {
        newsFlags.push({ company: co.name, id: co.id, issue: 'very_stale_news', detail: `${age} days old, ${itemCount} items` });
        veryStaleCount++;
      } else if (age > 7) {
        newsFlags.push({ company: co.name, id: co.id, issue: 'stale_news', detail: `${age} days old, ${itemCount} items` });
        staleCount++;
      } else {
        freshCount++;
      }
    }
  }

  // Notes coverage
  const noteCountMap = {};
  for (const n of notes || []) noteCountMap[n.company_id] = (noteCountMap[n.company_id] || 0) + 1;

  const noNotes = active.filter(c => !noteCountMap[c.id]).map(c => ({ name: c.name, id: c.id }));
  const topNotes = Object.entries(noteCountMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, count]) => ({ id, count, name: (companies.find(c => c.id === id) || {}).name }));

  // Field last-updated freshness
  const fieldDateMap = {};
  for (const f of fields || []) {
    if (!f.date) continue;
    const d = new Date(f.date).getTime();
    if (!fieldDateMap[f.company_id] || d > fieldDateMap[f.company_id]) {
      fieldDateMap[f.company_id] = d;
    }
  }

  const staleFields = [];
  for (const co of active) {
    const lastUpdate = fieldDateMap[co.id];
    if (!lastUpdate) {
      staleFields.push({ company: co.name, id: co.id, detail: 'No field updates ever' });
    } else {
      const age = Math.round((NOW - lastUpdate) / DAY);
      if (age > 60) {
        staleFields.push({ company: co.name, id: co.id, detail: `Last field update ${age} days ago` });
      }
    }
  }

  // Sector notes
  const sectorNoteFlags = [];
  const expectedSectors = [...new Set(active.map(c => c.sector))];
  const sectorNoteKeys = new Set((sectorNotes || []).filter(s => s.text && s.text.trim().length > 5).map(s => s.key));
  for (const sector of expectedSectors) {
    if (!sectorNoteKeys.has(sector) && !sectorNoteKeys.has(`${sector}_thesis`)) {
      sectorNoteFlags.push({ sector, issue: 'No sector-level thesis/notes' });
    }
  }

  const output = {
    check: '03_freshness',
    timestamp: new Date().toISOString(),
    summary: {
      news: { fresh: freshCount, stale: staleCount, very_stale: veryStaleCount, missing: missingCount },
      notes: { companies_with_notes: Object.keys(noteCountMap).length, companies_without_notes: noNotes.length },
      stale_fields: staleFields.length,
    },
    news_flags: newsFlags,
    no_notes: noNotes,
    top_notes: topNotes,
    stale_fields: staleFields,
    sector_note_flags: sectorNoteFlags,
  };

  const outPath = path.join(__dirname, 'results', '03_freshness.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`03_freshness: news=${freshCount} fresh/${staleCount} stale/${missingCount} missing | ${noNotes.length} cos without notes | ${staleFields.length} stale fields`);
}

run().catch(e => { console.error('03 FAILED:', e.message); process.exit(1); });
