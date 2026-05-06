/**
 * AUDIT 06: Agents & Pipeline
 * Checks ideas pipeline, Q&A log, watchlist for stale/incomplete data.
 * Writes results to results/06_agents_and_pipeline.json
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const NOW = Date.now();
const DAY = 86400000;

async function run() {
  const flags = [];

  // ── Ideas ──
  const { data: ideas, error: idErr } = await sb.from('ideas').select('*');
  const ideaStats = { total: 0, by_status: {}, stale_seeds: [], empty_thesis: [] };

  if (!idErr && ideas) {
    ideaStats.total = ideas.length;
    for (const idea of ideas) {
      const status = idea.status || 'unknown';
      ideaStats.by_status[status] = (ideaStats.by_status[status] || 0) + 1;

      // Stale seeds (>30 days)
      if (status === 'seed' && idea.date) {
        const age = Math.round((NOW - new Date(idea.date).getTime()) / DAY);
        if (age > 30) {
          ideaStats.stale_seeds.push({ title: idea.title, age_days: age });
        }
      }

      // Empty thesis
      if (['thesis', 'validated'].includes(status) && (!idea.thesis || idea.thesis.trim().length < 10)) {
        ideaStats.empty_thesis.push({ title: idea.title, status });
      }
    }
  } else if (idErr) {
    flags.push({ table: 'ideas', issue: 'query_error', detail: idErr.message });
  }

  // ── Q&A ──
  const { data: qa, error: qaErr } = await sb.from('qa_log').select('*');
  const qaStats = { total: 0, answered: 0, pending: 0, stale_pending: [] };

  if (!qaErr && qa) {
    qaStats.total = qa.length;
    for (const q of qa) {
      if (q.answer && q.answer.trim().length > 0) {
        qaStats.answered++;
      } else {
        qaStats.pending++;
        if (q.date) {
          const age = Math.round((NOW - new Date(q.date).getTime()) / DAY);
          if (age > 7) {
            qaStats.stale_pending.push({ question: (q.question || '').substring(0, 100), age_days: age });
          }
        }
      }
    }
  } else if (qaErr) {
    flags.push({ table: 'qa_log', issue: 'query_error', detail: qaErr.message });
  }

  // ── Watchlist ──
  const { data: watchlist, error: wlErr } = await sb.from('watchlist').select('*');
  const wlStats = { total: 0, keywords: [] };

  if (!wlErr && watchlist) {
    wlStats.total = watchlist.length;
    wlStats.keywords = watchlist.map(w => w.keyword || w.term || w.text || '(unknown)');

    // Check for overly broad terms
    const broad = wlStats.keywords.filter(k => k.length < 4);
    if (broad.length > 0) {
      flags.push({ table: 'watchlist', issue: 'overly_broad_keywords', detail: `Short keywords that may generate noise: ${broad.join(', ')}` });
    }
  } else if (wlErr) {
    flags.push({ table: 'watchlist', issue: 'query_error', detail: wlErr.message });
  }

  // ── Quick Notes ──
  const { data: qnotes, error: qnErr } = await sb.from('quick_notes').select('id, date');
  const qnStats = { total: (qnotes || []).length };

  const output = {
    check: '06_agents_and_pipeline',
    timestamp: new Date().toISOString(),
    summary: {
      ideas: ideaStats.by_status,
      ideas_total: ideaStats.total,
      qa_total: qaStats.total,
      qa_pending: qaStats.pending,
      watchlist_count: wlStats.total,
      quick_notes: qnStats.total,
    },
    idea_flags: {
      stale_seeds: ideaStats.stale_seeds,
      empty_thesis: ideaStats.empty_thesis,
    },
    qa_flags: {
      stale_pending: qaStats.stale_pending,
    },
    watchlist_keywords: wlStats.keywords,
    errors: flags,
  };

  const outPath = path.join(__dirname, 'results', '06_agents_and_pipeline.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`06_pipeline: ${ideaStats.total} ideas, ${qaStats.total} Q&A (${qaStats.pending} pending), ${wlStats.total} watchlist | ${flags.length} errors`);
}

run().catch(e => { console.error('06 FAILED:', e.message); process.exit(1); });
