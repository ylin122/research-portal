/**
 * AUDIT 05: Knowledge Base & Obsidian Wiki
 * Checks KB articles for completeness, and verifies Obsidian wiki index is in sync.
 * Writes results to results/05_knowledge_base.json
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const WIKI_ROOT = 'C:/Users/willi/research-portal';

async function run() {
  const flags = [];

  // ── KB Articles from Supabase ──
  const { data: articles, error: artErr } = await sb.from('kb_articles').select('*');
  if (artErr) {
    console.log('05: kb_articles table error (may not exist):', artErr.message);
  }

  const kbStats = { total: 0, by_category: {}, missing_fields: [], not_analyzed: [] };

  if (articles && articles.length > 0) {
    kbStats.total = articles.length;
    for (const a of articles) {
      const cat = a.category || 'uncategorized';
      kbStats.by_category[cat] = (kbStats.by_category[cat] || 0) + 1;

      const missing = [];
      if (!a.title || a.title.trim().length < 3) missing.push('title');
      if (!a.summary || a.summary.trim().length < 10) missing.push('summary');
      if (!a.content || a.content.trim().length < 20) missing.push('content');
      if (!a.category) missing.push('category');

      if (missing.length > 0) {
        kbStats.missing_fields.push({ id: a.id, title: a.title || '(no title)', missing });
      }

      if (!a.key_takeaways || (Array.isArray(a.key_takeaways) && a.key_takeaways.length === 0)) {
        kbStats.not_analyzed.push({ id: a.id, title: a.title || '(no title)' });
      }
    }
  }

  // ── Obsidian Wiki Sync ──
  const wikiFlags = [];

  try {
    // Check raw sources vs _summaries.md
    const summariesPath = path.join(WIKI_ROOT, 'wiki', '_summaries.md');
    const indexPath = path.join(WIKI_ROOT, 'wiki', '_index.md');

    let summariesContent = '';
    let indexContent = '';

    if (fs.existsSync(summariesPath)) {
      summariesContent = fs.readFileSync(summariesPath, 'utf-8');
    } else {
      wikiFlags.push({ issue: 'missing_summaries_file', detail: '_summaries.md does not exist' });
    }

    if (fs.existsSync(indexPath)) {
      indexContent = fs.readFileSync(indexPath, 'utf-8');
    } else {
      wikiFlags.push({ issue: 'missing_index_file', detail: '_index.md does not exist' });
    }

    // Find all raw source files
    const rawDirs = ['articles', 'notes', 'threads', 'papers'];
    const rawFiles = [];
    for (const dir of rawDirs) {
      const dirPath = path.join(WIKI_ROOT, 'raw', dir);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
        files.forEach(f => rawFiles.push(`raw/${dir}/${f}`));
      }
    }

    // Check which raw files are NOT in summaries
    const missingFromSummaries = rawFiles.filter(f => {
      const basename = path.basename(f);
      return !summariesContent.includes(basename);
    });

    if (missingFromSummaries.length > 0) {
      wikiFlags.push({
        issue: 'raw_not_in_summaries',
        detail: `${missingFromSummaries.length} raw files not summarized`,
        files: missingFromSummaries,
      });
    }

    // Check concepts/ and connections/ vs _index.md
    const conceptsDir = path.join(WIKI_ROOT, 'wiki', 'concepts');
    const connectionsDir = path.join(WIKI_ROOT, 'wiki', 'connections');

    const conceptFiles = fs.existsSync(conceptsDir) ? fs.readdirSync(conceptsDir).filter(f => f.endsWith('.md')) : [];
    const connectionFiles = fs.existsSync(connectionsDir) ? fs.readdirSync(connectionsDir).filter(f => f.endsWith('.md')) : [];

    const missingFromIndex = [];
    for (const f of conceptFiles) {
      if (!indexContent.includes(f)) missingFromIndex.push(`concepts/${f}`);
    }
    for (const f of connectionFiles) {
      if (!indexContent.includes(f)) missingFromIndex.push(`connections/${f}`);
    }

    if (missingFromIndex.length > 0) {
      wikiFlags.push({
        issue: 'wiki_not_in_index',
        detail: `${missingFromIndex.length} wiki files not in _index.md`,
        files: missingFromIndex,
      });
    }

  } catch (e) {
    wikiFlags.push({ issue: 'wiki_read_error', detail: e.message });
  }

  const output = {
    check: '05_knowledge_base',
    timestamp: new Date().toISOString(),
    summary: {
      kb_total: kbStats.total,
      kb_by_category: kbStats.by_category,
      kb_missing_fields: kbStats.missing_fields.length,
      kb_not_analyzed: kbStats.not_analyzed.length,
      wiki_flags: wikiFlags.length,
    },
    kb_missing_fields: kbStats.missing_fields,
    kb_not_analyzed: kbStats.not_analyzed,
    wiki_flags: wikiFlags,
  };

  const outPath = path.join(__dirname, 'results', '05_knowledge_base.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`05_kb: ${kbStats.total} articles, ${kbStats.missing_fields.length} incomplete, ${kbStats.not_analyzed.length} not analyzed | ${wikiFlags.length} wiki sync flags`);
}

run().catch(e => { console.error('05 FAILED:', e.message); process.exit(1); });
