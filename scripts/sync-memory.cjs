// ─── Robust two-way sync of Claude Code conversation memory ───
// Usage:  node scripts/sync-memory.cjs pull    (repo snapshot  -> this machine; run by the sync-pull agent)
//         node scripts/sync-memory.cjs push    (this machine   -> repo snapshot; run by the sync-push agent)
//
// Why this exists
// ---------------
// The old approach was `cp *.md` + `git add -A`. That let a machine whose local
// memory folder was stale/sparse overwrite the shared MEMORY.md (the index) with a
// short version — which orphaned every memory file it didn't list, even though those
// files were still sitting in the repo. (Happened 2026-05-11: a 5-file folder
// overwrote a 29-entry index and "lost" 28 memories that were never actually gone.)
//
// What this does instead
// ----------------------
//  1. Resolves the per-machine memory dir deterministically: ~/.claude/projects/
//     C--Users-<basename of home>/memory. If more than one C--Users-*/memory dir
//     exists, it warns and explains — that ambiguity (the old `... | head -1`) is
//     exactly how pull and push could end up touching different folders.
//  2. Unions the *.md memory files (never deletes the other side's files).
//  3. Rebuilds MEMORY.md from the files that actually exist — preserving existing
//     hand-curated index lines, auto-generating a line (from each file's frontmatter
//     `description:`) for any file that lacks one, and dropping lines whose file is
//     gone. So the index can never again drift away from the files.
//  4. Warns loudly when one side has memory files the other doesn't (the signal that
//     a real deletion — or a stale folder — needs a human decision).
//
// Note on deletions: this script never auto-deletes a memory file. To permanently
// remove a memory, `git rm scripts/claude-config/memory/<file>.md` in the repo and
// commit — that propagates to other machines on their next pull. Deleting it only
// from ~/.claude does NOT propagate (the sync unions files).

const fs = require('fs');
const path = require('path');
const os = require('os');

const mode = process.argv[2];
if (mode !== 'pull' && mode !== 'push') {
  console.error('usage: node scripts/sync-memory.cjs <pull|push>');
  process.exit(2);
}

const HOME = os.homedir(); // Windows-safe (C:\Users\..); do NOT use $HOME (msys gives /c/Users/..)
// __dirname is <repo>/scripts, so this is <repo>/scripts/claude-config/memory:
const REPO_MEM_DIR = path.resolve(__dirname, 'claude-config', 'memory');

// ── resolve this machine's memory dir ──────────────────────────────────────
const projectsDir = path.join(HOME, '.claude', 'projects');
const memDirsPresent = (fs.existsSync(projectsDir) ? fs.readdirSync(projectsDir) : [])
  .filter(n => n.startsWith('C--Users-'))
  .map(n => path.join(projectsDir, n, 'memory'))
  .filter(d => fs.existsSync(d));
const preferredMemDir = path.join(projectsDir, 'C--Users-' + path.basename(HOME), 'memory');

let LOCAL_MEM;
if (memDirsPresent.length === 0) {
  LOCAL_MEM = preferredMemDir;
  fs.mkdirSync(LOCAL_MEM, { recursive: true });
  console.log(`  created local memory dir: ${LOCAL_MEM}`);
} else if (memDirsPresent.length === 1) {
  LOCAL_MEM = memDirsPresent[0];
} else {
  LOCAL_MEM = memDirsPresent.includes(preferredMemDir) ? preferredMemDir : memDirsPresent.slice().sort()[0];
  console.warn(`  ⚠ multiple Claude memory dirs on this machine — sync will only touch:`);
  console.warn(`      ${LOCAL_MEM}`);
  console.warn(`    others (NOT synced): ${memDirsPresent.filter(d => d !== LOCAL_MEM).join(', ')}`);
  console.warn(`    consolidate them so the machine has a single memory folder.`);
}

fs.mkdirSync(REPO_MEM_DIR, { recursive: true });

// ── helpers ────────────────────────────────────────────────────────────────
const mdFiles = dir => (fs.existsSync(dir) ? fs.readdirSync(dir) : []).filter(f => f.endsWith('.md') && f !== 'MEMORY.md');

function descriptionOf(file) {
  let txt;
  try { txt = fs.readFileSync(file, 'utf8'); } catch { return null; }
  const fm = txt.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return null;
  const d = fm[1].match(/^description:\s*(.+)$/m) || fm[1].match(/^name:\s*(.+)$/m);
  return d ? d[1].trim().replace(/^["']|["']$/g, '') : null;
}

// copy newer/changed *.md from src into dst; never deletes anything in dst.
function unionCopy(src, dst) {
  let n = 0;
  for (const f of mdFiles(src)) {
    const s = path.join(src, f), d = path.join(dst, f);
    const buf = fs.readFileSync(s);
    if (!fs.existsSync(d) || !fs.readFileSync(d).equals(buf)) { fs.writeFileSync(d, buf); n++; }
  }
  return n;
}

// rebuild <dir>/MEMORY.md from the *.md files present: keep existing lines (in their
// existing order), drop lines whose file is gone, append a generated line for any
// file not yet indexed.
function rebuildIndex(dir) {
  const idxPath = path.join(dir, 'MEMORY.md');
  const present = new Set(mdFiles(dir));
  const out = ['# Memory Index', ''];
  const seen = new Set();
  if (fs.existsSync(idxPath)) {
    for (const line of fs.readFileSync(idxPath, 'utf8').split('\n')) {
      const m = line.match(/^- \[[^\]]+\]\(([^)]+)\)/);
      if (m && present.has(m[1]) && !seen.has(m[1])) { out.push(line.replace(/\s+$/, '')); seen.add(m[1]); }
    }
  }
  for (const f of [...present].filter(f => !seen.has(f)).sort()) {
    out.push(`- [${f}](${f}) — ${descriptionOf(path.join(dir, f)) || '(no description)'}`);
  }
  fs.writeFileSync(idxPath, out.join('\n') + '\n');
  return present.size;
}

function warnAsymmetry(haveName, haveDir, missName, missDir) {
  const have = new Set(mdFiles(haveDir));
  const onlyHere = [...have].filter(f => !fs.existsSync(path.join(missDir, f)));
  if (onlyHere.length) {
    console.warn(`  ⚠ ${onlyHere.length} memory file(s) in ${haveName} but not in ${missName} — left untouched:`);
    console.warn(`      ${onlyHere.join(', ')}`);
    console.warn(`    if you meant to delete them, \`git rm\` them in the repo and commit; otherwise run the other sync direction.`);
  }
}

// ── do it ──────────────────────────────────────────────────────────────────
if (mode === 'pull') {
  const n = unionCopy(REPO_MEM_DIR, LOCAL_MEM);
  const total = rebuildIndex(LOCAL_MEM);
  warnAsymmetry('this machine', LOCAL_MEM, 'the repo', REPO_MEM_DIR);
  console.log(`  memory pull: ${total} memories on this machine (${n} updated from repo); index rebuilt`);
} else {
  const n = unionCopy(LOCAL_MEM, REPO_MEM_DIR);
  const total = rebuildIndex(REPO_MEM_DIR);
  warnAsymmetry('the repo', REPO_MEM_DIR, 'this machine', LOCAL_MEM);
  console.log(`  memory push: ${total} memories in repo snapshot (${n} updated from this machine); index rebuilt`);
  console.log(`  → run \`git add -A\` + commit in the repo to publish (sync-push step 4 does this).`);
}
