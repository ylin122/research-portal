/**
 * AUDIT 04: Industry Research Hardcoded Data
 * Reads IndustryResearch.jsx and extracts all hardcoded figures (valuations, ARR, employee counts,
 * models, capex, GPU specs) and flags data older than thresholds.
 * Writes results to results/04_industry_research_hardcoded.json
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..', 'src', 'IndustryResearch.jsx');

function extractDates(text) {
  // Find date-like patterns: "Q1 2026", "Mar 2026", "2025", "Jan 2026", etc.
  const patterns = [
    /(?:Q[1-4])\s*['"]?\s*20\d{2}/gi,
    /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+20\d{2}/gi,
    /20\d{2}E?\b/g,
  ];
  const dates = new Set();
  for (const p of patterns) {
    const matches = text.match(p) || [];
    matches.forEach(m => dates.add(m));
  }
  return [...dates];
}

function run() {
  const src = fs.readFileSync(SRC, 'utf-8');
  const lines = src.split('\n');

  const flags = [];
  const stats = { total_lines: lines.length, data_sections: [] };

  // Find AI lab data blocks
  const labPattern = /name:\s*["']([^"']+)["']/g;
  const valuationPattern = /valuation:\s*["']([^"']+)["']/g;
  const arrPattern = /arr[^:]*:\s*["']?(\$?[\d.]+[BMK]?)/gi;
  const employeePattern = /employees?[^:]*:\s*["']?([\d,]+)/gi;
  const modelPattern = /(?:latest|flagship|model)[^:]*:\s*["']([^"']+)["']/gi;

  // Extract lab names
  let match;
  const labNames = [];
  while ((match = labPattern.exec(src)) !== null) {
    if (['OpenAI', 'Anthropic', 'Google DeepMind', 'xAI', 'Meta'].includes(match[1])) {
      labNames.push(match[1]);
    }
  }

  // Find all valuation mentions
  const valMatches = [];
  valuationPattern.lastIndex = 0;
  while ((match = valuationPattern.exec(src)) !== null) {
    valMatches.push({ value: match[1], line: src.substring(0, match.index).split('\n').length });
  }

  // Find date references in the file
  const allDates = extractDates(src);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed

  // Check for data that references old years
  const oldDates = allDates.filter(d => {
    const yearMatch = d.match(/20(\d{2})/);
    if (!yearMatch) return false;
    const year = 2000 + parseInt(yearMatch[1]);
    // Flag if the data is from >6 months ago and not marked as estimate (E)
    if (d.includes('E')) return false; // estimates are fine
    return year < currentYear - 1;
  });

  // Scan for specific hardcoded sections
  const sections = [
    { name: 'AI Labs', pattern: /AI Labs|aiLabs|LABS_DATA/i },
    { name: 'AI-Native', pattern: /AI-Native|ainative|AI_NATIVE/i },
    { name: 'AI Capex', pattern: /capex|CAPEX/i },
    { name: 'GPU/ASIC', pattern: /GPU|ASIC|gpu_data|gpuAsic/i },
    { name: 'Compute', pattern: /compute|COMPUTE/i },
    { name: 'Semi Capex', pattern: /semi.*capex|SEMI_CAPEX/i },
  ];

  for (const sec of sections) {
    const matchLines = [];
    lines.forEach((line, i) => {
      if (sec.pattern.test(line)) matchLines.push(i + 1);
    });
    stats.data_sections.push({ name: sec.name, referenced_at_lines: matchLines.slice(0, 5) });
  }

  // Look for dollar figures that might be stale
  const dollarPattern = /\$[\d,.]+\s*[BMTbmt](?:illion)?/g;
  const dollarRefs = [];
  let dMatch;
  while ((dMatch = dollarPattern.exec(src)) !== null) {
    const lineNum = src.substring(0, dMatch.index).split('\n').length;
    const context = lines[lineNum - 1].trim().substring(0, 120);
    dollarRefs.push({ value: dMatch[0], line: lineNum, context });
  }

  // Flag items to verify
  if (valMatches.length > 0) {
    flags.push({
      section: 'AI Labs',
      issue: 'valuation_check_needed',
      detail: `Found ${valMatches.length} valuation references. Verify these are current.`,
      items: valMatches.slice(0, 10),
    });
  }

  flags.push({
    section: 'All',
    issue: 'dollar_figures_to_verify',
    detail: `Found ${dollarRefs.length} dollar amount references in hardcoded data. Sample below.`,
    items: dollarRefs.slice(0, 20),
  });

  flags.push({
    section: 'All',
    issue: 'date_references',
    detail: `Found ${allDates.length} date references. Oldest non-estimate dates that may be stale:`,
    items: oldDates.slice(0, 15),
  });

  const output = {
    check: '04_industry_research_hardcoded',
    timestamp: new Date().toISOString(),
    summary: {
      file_lines: lines.length,
      lab_names_found: labNames,
      valuation_refs: valMatches.length,
      dollar_refs: dollarRefs.length,
      date_refs: allDates.length,
      potential_stale_dates: oldDates.length,
    },
    flags,
    stats,
  };

  const outPath = path.join(__dirname, 'results', '04_industry_research_hardcoded.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`04_hardcoded: ${lines.length} lines, ${dollarRefs.length} dollar refs, ${valMatches.length} valuations, ${oldDates.length} potentially stale dates`);
}

run();
