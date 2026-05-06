/**
 * AUDIT 09: Report Compiler
 * Reads all result files from 01-08 and produces a single markdown report.
 * Writes to results/weekly_report.md
 */
const fs = require('fs');
const path = require('path');

const RESULTS_DIR = path.join(__dirname, 'results');
const today = new Date().toISOString().split('T')[0];

function loadResult(filename) {
  const fp = path.join(RESULTS_DIR, filename);
  if (!fs.existsSync(fp)) return null;
  try { return JSON.parse(fs.readFileSync(fp, 'utf-8')); } catch { return null; }
}

function run() {
  const r01 = loadResult('01_field_coverage.json');
  const r02 = loadResult('02_labels_and_classification.json');
  const r03 = loadResult('03_freshness.json');
  const r04 = loadResult('04_industry_research_hardcoded.json');
  const r05 = loadResult('05_knowledge_base.json');
  const r06 = loadResult('06_agents_and_pipeline.json');
  const r07 = loadResult('07_cross_checks.json');
  const r08 = loadResult('08_accuracy_spot_check.json');

  const lines = [];
  const critical = [];
  const stale = [];
  const gaps = [];

  lines.push(`# Weekly Audit Report — ${today}`);
  lines.push('');

  // ── Summary ──
  lines.push('## Summary');
  if (r01) lines.push(`- **Companies:** ${r01.summary.total_companies} total, ${r01.summary.fully_complete} fully filled, ${r01.summary.zero_fields} with zero fields`);
  if (r01) lines.push(`- **Avg field completion:** ${r01.summary.avg_completion}%`);
  if (r02) lines.push(`- **Labels:** ${r02.summary.public_private.Public || 0} public, ${r02.summary.public_private.Private || 0} private, ${r02.summary.public_private.unset || 0} unset`);
  if (r03) lines.push(`- **News freshness:** ${r03.summary.news.fresh} fresh, ${r03.summary.news.stale} stale, ${r03.summary.news.missing} missing`);
  if (r03) lines.push(`- **Notes:** ${r03.summary.notes.companies_without_notes} companies have no research notes`);
  if (r05) lines.push(`- **KB articles:** ${r05.summary.kb_total}, ${r05.summary.kb_not_analyzed} not analyzed`);
  if (r06) lines.push(`- **Ideas pipeline:** ${r06.summary.ideas_total} total | Q&A: ${r06.summary.qa_pending} pending`);
  if (r07) lines.push(`- **Cross-check flags:** ${r07.summary.total_flags}`);
  lines.push('');

  // ── Critical Issues ──
  if (r02 && r02.summary.public_private.unset > 0) {
    critical.push(`${r02.summary.public_private.unset} companies missing public/private label`);
  }
  if (r07 && r07.summary.orphaned_fields > 0) {
    critical.push(`${r07.summary.orphaned_fields} orphaned records in company_fields (company no longer exists)`);
  }
  if (r07 && r07.summary.orphaned_notes > 0) {
    critical.push(`${r07.summary.orphaned_notes} orphaned records in company_notes`);
  }
  if (r07 && r07.summary.date_anomalies > 0) {
    critical.push(`${r07.summary.date_anomalies} date anomalies (future dates or suspiciously old)`);
  }
  if (r02) {
    const badSubs = (r02.flags || []).filter(f => f.issue === 'invalid_subsector');
    if (badSubs.length > 0) critical.push(`${badSubs.length} companies with invalid subsector: ${badSubs.map(f => f.company).join(', ')}`);
  }

  lines.push('## Critical Issues');
  if (critical.length === 0) lines.push('None');
  else critical.forEach(c => lines.push(`- ${c}`));
  lines.push('');

  // ── Stale Data ──
  if (r03) {
    const vs = (r03.news_flags || []).filter(f => f.issue === 'very_stale_news');
    if (vs.length > 0) stale.push(`${vs.length} companies with very stale news (>30 days): ${vs.slice(0, 10).map(f => f.company).join(', ')}`);
    const s = (r03.news_flags || []).filter(f => f.issue === 'stale_news');
    if (s.length > 0) stale.push(`${s.length} companies with stale news (>7 days)`);
    if (r03.stale_fields.length > 0) stale.push(`${r03.stale_fields.length} companies with no field updates in 60+ days`);
  }
  if (r04) {
    if (r04.summary.potential_stale_dates > 0) stale.push(`${r04.summary.potential_stale_dates} potentially stale date references in Industry Research hardcoded data`);
  }
  if (r06) {
    const stalePending = (r06.qa_flags?.stale_pending || []);
    if (stalePending.length > 0) stale.push(`${stalePending.length} Q&A questions unanswered for >7 days`);
  }

  lines.push('## Stale Data');
  if (stale.length === 0) lines.push('None');
  else stale.forEach(s => lines.push(`- ${s}`));
  lines.push('');

  // ── Completeness Gaps ──
  if (r01) {
    const zeros = (r01.flags || []).filter(f => f.pct_complete === 0);
    const partial = (r01.flags || []).filter(f => f.pct_complete > 0 && f.pct_complete < 100);
    if (zeros.length > 0) gaps.push(`${zeros.length} companies with zero research fields filled`);
    if (partial.length > 0) gaps.push(`${partial.length} companies partially filled (missing: ${partial.slice(0, 5).map(p => `${p.name}: ${p.missing.join(', ')}`).join(' | ')})`);
  }
  if (r03 && r03.no_notes.length > 0) {
    gaps.push(`${r03.no_notes.length} companies with no research notes at all`);
  }
  if (r05 && r05.summary.kb_not_analyzed > 0) {
    gaps.push(`${r05.summary.kb_not_analyzed} KB articles not yet analyzed (no key_takeaways)`);
  }
  if (r05 && r05.wiki_flags.length > 0) {
    for (const wf of r05.wiki_flags) {
      gaps.push(`Wiki: ${wf.issue} — ${wf.detail}`);
    }
  }
  if (r06) {
    const staleSeeds = r06.idea_flags?.stale_seeds || [];
    if (staleSeeds.length > 0) gaps.push(`${staleSeeds.length} ideas stuck in "seed" status for >30 days`);
  }

  lines.push('## Completeness Gaps');
  if (gaps.length === 0) lines.push('None');
  else gaps.forEach(g => lines.push(`- ${g}`));
  lines.push('');

  // ── Accuracy Spot Check ──
  lines.push('## Accuracy Spot Check (verify via web search)');
  if (r08) {
    lines.push(`**Week ${r08.week_number} sample:** ${r08.summary.companies_sampled.join(', ')}`);
    lines.push(`**Total checks:** ${r08.summary.total_checks}`);
    lines.push('');
    lines.push('### Company Checks');
    for (const co of r08.company_checks) {
      lines.push(`**${co.company}** (${co.sector})`);
      for (const ch of co.checks) {
        lines.push(`- [ ] ${ch.field}: ${ch.verify}`);
        if (ch.current_value) lines.push(`  - Current: ${ch.current_value.substring(0, 150)}`);
      }
      lines.push('');
    }
    lines.push('### Hardcoded Data Checks');
    for (const ch of r08.hardcoded_checks) {
      lines.push(`- [ ] **${ch.section}** — ${ch.item}: ${ch.verify}`);
    }
  } else {
    lines.push('Script 08 did not run.');
  }
  lines.push('');

  // ── Stats Snapshot ──
  lines.push('## Stats Snapshot');
  if (r02) {
    lines.push('### Companies by Sector');
    for (const [k, v] of Object.entries(r02.summary.sectors).sort(([, a], [, b]) => b - a)) {
      lines.push(`- ${k}: ${v}`);
    }
    lines.push('');
    lines.push('### Priority Distribution');
    for (const [k, v] of Object.entries(r02.summary.priority)) {
      lines.push(`- ${k}: ${v}`);
    }
  }
  if (r05) {
    lines.push('');
    lines.push('### KB Articles by Category');
    for (const [k, v] of Object.entries(r05.summary.kb_by_category)) {
      lines.push(`- ${k}: ${v}`);
    }
  }
  if (r06 && r06.summary.ideas) {
    lines.push('');
    lines.push('### Ideas Pipeline');
    for (const [k, v] of Object.entries(r06.summary.ideas)) {
      lines.push(`- ${k}: ${v}`);
    }
  }
  lines.push('');

  // Write report
  const report = lines.join('\n');
  const outPath = path.join(RESULTS_DIR, 'weekly_report.md');
  fs.writeFileSync(outPath, report);
  console.log(`\n${'='.repeat(60)}`);
  console.log('WEEKLY AUDIT REPORT GENERATED');
  console.log(`${'='.repeat(60)}`);
  console.log(`File: ${outPath}`);
  console.log(`Critical: ${critical.length} | Stale: ${stale.length} | Gaps: ${gaps.length}`);
  if (r08) console.log(`Spot checks: ${r08.summary.total_checks} items to verify via web search`);
}

run();
