#!/usr/bin/env node
// One-shot migration: bare-quoted hex literals → T_ tokens across the 22 in-scope tab files.
// Run with --dry to preview counts; run without flags to apply.

const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "..", "src");
const DRY = process.argv.includes("--dry");

const FILES = [
  "Dashboard.jsx", "AgentsTools.jsx", "AIDisruption.jsx",
  "IndustryResearch.jsx", "QuickNotes.jsx", "KnowledgeInterests.jsx",
  "KnowledgeBase.jsx", "BusinessModels.jsx", "Accounting.jsx", "CreditInstruments.jsx",
  "Restructuring.jsx", "CaseStudies.jsx", "Primer.jsx", "PrimerNewTabs.jsx",
  "PrimerNewTabs2.jsx", "ProductPrimer.jsx", "Sources.jsx", "AuditLog.jsx",
  "Prompts.jsx", "Principles.jsx", "ApiDirectory.jsx",
];

// Hex → T_ token. Values must match theme.js exactly.
const HEX_TO_TOKEN = {
  "F8FAFC": "T_.text",
  "E2E8F0": "T_.textMid",
  "94A3B8": "T_.textDim",
  "64748B": "T_.textGhost",
  "1E293B": "T_.border",
  "3B82F6": "T_.blue",
  "10B981": "T_.green",
  "F59E0B": "T_.amber",
  "EF4444": "T_.red",
  "8B5CF6": "T_.purple",
  "111827": "T_.bgPanel",
};

const HEX_ALTERNATIVES = Object.keys(HEX_TO_TOKEN).join("|");

// Pass C — JSX attribute pattern: attr="#XXXXXX" → attr={T_.token}.
// Must run BEFORE Pass A so the `=` lookbehind in Pass A correctly skips them.
const passC = new RegExp(`([A-Za-z][A-Za-z0-9-]*)="#(${HEX_ALTERNATIVES})"(?![0-9A-Fa-f])`, "gi");

// Pass A — bare-quoted 6-char hex string: "#XXXXXX" (no following hex char to exclude alpha).
// Negative lookbehind on `=` skips JSX attrs (handled by Pass C).
const passA = new RegExp(`(?<!=)"#(${HEX_ALTERNATIVES})"(?![0-9A-Fa-f])`, "gi");

// Pass B — hex inside a larger string: "...#XXXXXX...". Convert string to template literal.
// Match any double-quoted string containing at least one known hex.
const passB = new RegExp(`"([^"\\n]*?)#(${HEX_ALTERNATIVES})([^"\\n]*?)"(?![0-9A-Fa-f])`, "gi");

const results = {};
let totalA = 0;
let totalB = 0;
let totalC = 0;

for (const file of FILES) {
  const fullPath = path.join(SRC_DIR, file);
  if (!fs.existsSync(fullPath)) {
    console.warn(`SKIP missing: ${file}`);
    continue;
  }
  let content = fs.readFileSync(fullPath, "utf8");
  const orig = content;
  let countA = 0;
  let countB = 0;
  let countC = 0;

  // Pass C first — JSX attribute conversion.
  content = content.replace(passC, (match, attr, hex) => {
    const token = HEX_TO_TOKEN[hex.toUpperCase()];
    if (!token) return match;
    countC++;
    return `${attr}={${token}}`;
  });

  // Pass A — property values, array elements, var assigns, function args.
  content = content.replace(passA, (match, hex) => {
    countA++;
    return HEX_TO_TOKEN[hex.toUpperCase()] || match;
  });

  // Pass B — convert remaining hex-in-string into template literals.
  // Repeat until no more known hex appears inside any double-quoted string.
  let mutated = true;
  while (mutated) {
    mutated = false;
    content = content.replace(passB, (match, prefix, hex, suffix) => {
      // Only convert if the string contains no template interpolation already.
      if (match.includes("${")) {
        // Already a template-style mid-conversion; need a different approach
        // — but our regex only matches bare double-quoted strings, so this branch
        // shouldn't fire in practice. Leave untouched.
        return match;
      }
      // Don't convert if the string is itself just the hex (Pass A would have caught it).
      if (prefix === "" && suffix === "") {
        return match;
      }
      mutated = true;
      countB++;
      const token = HEX_TO_TOKEN[hex.toUpperCase()];
      if (!token) return match;
      // Escape backticks and ${ in surrounding text (extremely unlikely in CSS strings).
      const safePrefix = prefix.replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
      const safeSuffix = suffix.replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
      return "`" + safePrefix + "${" + token + "}" + safeSuffix + "`";
    });
  }

  results[file] = { countA, countB, countC };
  totalA += countA;
  totalB += countB;
  totalC += countC;

  if (!DRY && content !== orig) {
    fs.writeFileSync(fullPath, content);
  }
}

console.log("\nMigration summary:");
console.log("  File                              Pass A   Pass B   Pass C");
for (const [file, { countA, countB, countC }] of Object.entries(results)) {
  if (countA + countB + countC === 0) continue;
  console.log(`  ${file.padEnd(32)} ${String(countA).padStart(6)}  ${String(countB).padStart(6)}  ${String(countC).padStart(6)}`);
}
console.log(`  ${"TOTAL".padEnd(32)} ${String(totalA).padStart(6)}  ${String(totalB).padStart(6)}  ${String(totalC).padStart(6)}`);
console.log(`\nLegend:`);
console.log(`  Pass A — bare hex string "#XXX" → T_.token (property values, array/var/arg)`);
console.log(`  Pass B — hex inside larger string → template literal "\${T_.token}"`);
console.log(`  Pass C — JSX attribute attr="#XXX" → attr={T_.token}`);
console.log(`\nMode: ${DRY ? "DRY RUN — no files modified" : "APPLIED"}`);
