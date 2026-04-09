import { useState } from "react";
import { T_, FONT } from "./lib/theme";

const PROMPTS_KEY = "research_portal_verify_prompts";
const FLAGGED_KEY = "research_portal_verify_flagged";
const ACCEPTED_KEY = "research_portal_verification_accepted";

function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } }
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

const TAB_OPTIONS = [
  { key: "credit", label: "Credit Research" },
  { key: "equity", label: "Equity Research" },
  { key: "primer", label: "Primer" },
  { key: "businessModels", label: "Business Models" },
  { key: "creditInstruments", label: "Credit Instruments" },
  { key: "aiResearch", label: "AI Research" },
];

export default function DataVerificationAgent({ companies, fieldsMap, sectorNotes }) {
  const [prompts, setPrompts] = useState(() => load(PROMPTS_KEY, []));
  const [flagged, setFlagged] = useState(() => load(FLAGGED_KEY, []));
  const [accepted, setAccepted] = useState(() => load(ACCEPTED_KEY, []));

  // Prompt editing
  const [editingPrompt, setEditingPrompt] = useState(null); // null = not editing, "new" = adding, index = editing existing
  const [draftText, setDraftText] = useState("");
  const [draftTabs, setDraftTabs] = useState(new Set());

  // Flagged issue input
  const [addingFlag, setAddingFlag] = useState(false);
  const [flagTitle, setFlagTitle] = useState("");
  const [flagDetail, setFlagDetail] = useState("");
  const [flagSeverity, setFlagSeverity] = useState("warning");
  const [expandedFlag, setExpandedFlag] = useState(null);

  // ── Prompt Management ──

  function startNewPrompt() {
    setEditingPrompt("new");
    setDraftText("");
    setDraftTabs(new Set());
  }

  function startEditPrompt(idx) {
    const p = prompts[idx];
    setEditingPrompt(idx);
    setDraftText(p.text);
    setDraftTabs(new Set(p.tabs));
  }

  function savePrompt() {
    if (!draftText.trim()) return;
    const entry = { text: draftText.trim(), tabs: [...draftTabs], updated: new Date().toISOString() };
    let updated;
    if (editingPrompt === "new") {
      updated = [...prompts, entry];
    } else {
      updated = prompts.map((p, i) => i === editingPrompt ? entry : p);
    }
    setPrompts(updated);
    save(PROMPTS_KEY, updated);
    setEditingPrompt(null);
    setDraftText("");
    setDraftTabs(new Set());
  }

  function deletePrompt(idx) {
    const updated = prompts.filter((_, i) => i !== idx);
    setPrompts(updated);
    save(PROMPTS_KEY, updated);
  }

  function toggleDraftTab(key) {
    setDraftTabs(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function copyPromptWithData(idx) {
    const p = prompts[idx];
    const dataSection = buildDataExport(p.tabs);
    const full = `${p.text}\n\n--- DATA TO VERIFY ---\n${dataSection}`;
    navigator.clipboard.writeText(full);
  }

  function buildDataExport(tabs) {
    const activeCos = companies.filter(c => c.sector !== "sources" && c.sector !== "prompts");
    let equities = [];
    let equityNotes = {};
    try { equities = JSON.parse(localStorage.getItem("research_portal_equities") || "[]"); } catch {}
    try { equityNotes = JSON.parse(localStorage.getItem("research_portal_equity_notes") || "{}"); } catch {}

    const sections = [];

    for (const tabKey of tabs) {
      switch (tabKey) {
        case "credit": {
          const lines = activeCos.map(co => {
            const fields = fieldsMap[co.id] || {};
            const parts = Object.entries(fields)
              .filter(([k, v]) => v.text && k !== "public_private")
              .map(([k, v]) => `  ${k}: ${v.text.slice(0, 400)}`);
            return parts.length > 0 ? `${co.name}\n${parts.join("\n")}` : null;
          }).filter(Boolean);
          if (lines.length > 0) sections.push(`[CREDIT RESEARCH — ${lines.length} companies]\n${lines.join("\n\n")}`);
          break;
        }
        case "equity": {
          const lines = equities.map(eq => {
            const notes = equityNotes[eq.id] || "";
            return notes ? `${eq.name}: ${notes.slice(0, 500)}` : `${eq.name}: (no notes)`;
          });
          if (lines.length > 0) sections.push(`[EQUITY RESEARCH — ${lines.length} equities]\n${lines.join("\n")}`);
          break;
        }
        case "primer":
          sections.push(`[PRIMER — 20 industry sectors]\nCovers: Software, Semiconductors, Digital Infrastructure, IT Services, Healthcare IT, Healthcare & Pharma, Healthcare Services, Internet, Education, Comms & Telecom, Consumer Discretionary, Consumer Staples, Financials, Fintech, Industrials, Aerospace & Defense, Energy & Materials, Real Estate, Utilities. Each sector has TAM estimates, growth rates, key players, value chains, and revenue models.`);
          break;
        case "businessModels":
          sections.push(`[BUSINESS MODELS — 13 models]\nCovers: Aircraft Leasing, GPU/Compute Leasing, Equipment Leasing, SaaS/Subscription, Payment Take Rates, Marketplace/Platform, REITs, Regulated Utilities, Banking/Net Interest, Franchise, Royalties & Licensing, Data & Info Services, Specialty Finance. Each has economics, key metrics, valuation multiples, and company examples.`);
          break;
        case "creditInstruments":
          sections.push(`[CREDIT INSTRUMENTS — 5 sections]\nCovers: Leveraged Loans & HY/IG Bonds, Structured Credit (CLO, ABS, CMBS), Derivatives (CDS, IRS, TRS), Hybrid Instruments (Convertibles, Preferred, PIK), Distressed (DIP, Loan-to-Own, Claims Trading). Each has mechanics, pricing, market size, and analysis frameworks.`);
          break;
        case "aiResearch":
          sections.push(`[AI RESEARCH]\nAI disruption analysis: moat scores, Jevons Paradox analysis, sector disruption rankings, weighted moat tiers across 20+ sectors.`);
          break;
      }
    }

    return sections.join("\n\n");
  }

  // ── Flagged Issues ──

  function addFlag() {
    if (!flagTitle.trim()) return;
    const entry = { title: flagTitle.trim(), detail: flagDetail.trim(), severity: flagSeverity, date: new Date().toISOString() };
    const updated = [entry, ...flagged];
    setFlagged(updated);
    save(FLAGGED_KEY, updated);
    setFlagTitle("");
    setFlagDetail("");
    setFlagSeverity("warning");
    setAddingFlag(false);
  }

  function acceptFlag(idx) {
    const issue = flagged[idx];
    const updatedAccepted = [{ ...issue, acceptedDate: new Date().toISOString() }, ...accepted];
    setAccepted(updatedAccepted);
    save(ACCEPTED_KEY, updatedAccepted);
    const updatedFlagged = flagged.filter((_, i) => i !== idx);
    setFlagged(updatedFlagged);
    save(FLAGGED_KEY, updatedFlagged);
    setExpandedFlag(null);
  }

  function removeFlag(idx) {
    const updated = flagged.filter((_, i) => i !== idx);
    setFlagged(updated);
    save(FLAGGED_KEY, updated);
  }

  function dismissAccepted(idx) {
    const updated = accepted.filter((_, i) => i !== idx);
    setAccepted(updated);
    save(ACCEPTED_KEY, updated);
  }

  function clearAccepted() {
    setAccepted([]);
    save(ACCEPTED_KEY, []);
  }

  // ── Shared styles ──
  const panelStyle = { background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: 20, marginBottom: 20 };
  const headerStyle = { fontSize: 13, fontWeight: 600, color: T_.textMid, letterSpacing: 0.3 };
  const btnSmall = (bg, color, border) => ({
    padding: "5px 14px", fontSize: 11, fontWeight: 500, borderRadius: 6, cursor: "pointer",
    background: bg, color, border: `1px solid ${border}`, fontFamily: FONT,
  });

  return (
    <div style={{ padding: "36px 44px", maxWidth: 960, fontFamily: FONT }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: T_.text, marginBottom: 4 }}>Agent Commands</h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 28 }}>
        Claude Code agents for verification, fact-checking, and quality control. Run these from the CLI with <span style={{ color: T_.accent, fontFamily: "monospace" }}>@agent-name</span>.
      </p>

      {/* ── Section 0: Agent Commands Reference ── */}
      <div style={panelStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={headerStyle}>Claude Code Agents</span>
          <span style={{ fontSize: 11, color: T_.textGhost }}>~/.claude/agents/</span>
        </div>

        {[
          {
            name: "@verifier",
            file: "verifier.md",
            color: T_.green,
            desc: "Code correctness — syntax, build, structure, dead code, broken references",
            usage: "@verifier check the Restructuring.jsx changes",
            tools: "Read, Bash, Grep, Glob",
            mode: "Read-only. Never modifies files.",
          },
          {
            name: "@fact-checker",
            file: "fact-checker.md",
            color: T_.blue,
            desc: "Data accuracy — CONFIRM agent. Extracts factual claims and searches for supporting evidence from primary sources.",
            usage: "@fact-checker check the PetSmart case in Restructuring.jsx",
            tools: "Read, Bash, Grep, Glob, WebSearch, WebFetch",
            mode: "Read-only. Searches web for corroboration.",
          },
          {
            name: "@fact-disputer",
            file: "fact-disputer.md",
            color: T_.red,
            desc: "Data accuracy — DISPUTE agent. Adversarial skeptic that actively tries to disprove every factual claim.",
            usage: "@fact-disputer check the PetSmart case in Restructuring.jsx",
            tools: "Read, Bash, Grep, Glob, WebSearch, WebFetch",
            mode: "Read-only. Searches for contradicting evidence.",
          },
          {
            name: "@fact-check-reconciler",
            file: "fact-check-reconciler.md",
            color: T_.amber,
            desc: "Reconciles @fact-checker and @fact-disputer results. Produces final VERIFIED / LIKELY CORRECT / CONFLICT / LIKELY WRONG / UNVERIFIABLE verdicts.",
            usage: "@fact-check-reconciler reconcile the results above",
            tools: "Read, Bash, Grep",
            mode: "Read-only. Runs after both fact agents return.",
          },
          {
            name: "@deploy",
            file: "deploy.md",
            color: "#06B6D4",
            desc: "Build, commit, push to GitHub, and verify Vercel deployment. One command to ship. Checks for secrets, runs vite build, and won't push broken code.",
            usage: "@deploy ship the latest changes",
            tools: "Read, Bash, Grep, Glob",
            mode: "Read + Write (git operations). Never force pushes or commits secrets.",
          },
          {
            name: "@refresh",
            file: "refresh.md",
            color: "#14B8A6",
            desc: "Updates any tab with the latest information from the web. Searches for current news, data, market developments, and regulatory changes. Fact-checks existing content and corrects outdated claims.",
            usage: "@refresh update the AI Research tab",
            tools: "Read, Bash, Grep, Glob, Edit, Write, WebSearch, WebFetch",
            mode: "Read + Write. Edits hardcoded JSX directly; reports changes needed for DB-backed tabs.",
          },
          {
            name: "@consistency",
            file: "commands/consistency.md",
            color: "#c084fc",
            desc: "Scans research content across tabs for missing fields, stale data, depth mismatches, and format/style inconsistencies. Reports issues by severity with specific fix suggestions.",
            usage: "@consistency check credit research",
            tools: "Read, Bash, Grep, Glob",
            mode: "Read-only. Never modifies files or data.",
          },
        ].map(agent => (
          <div key={agent.name} style={{
            background: T_.bgInput, border: `1px solid ${T_.borderLight}`, borderRadius: 8, padding: 14, marginBottom: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: agent.color, fontFamily: "monospace" }}>{agent.name}</span>
              <span style={{ fontSize: 10, color: T_.textGhost, fontFamily: "monospace" }}>{agent.file}</span>
            </div>
            <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.6, marginBottom: 8 }}>{agent.desc}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 11, color: T_.textGhost }}>
                <span style={{ fontWeight: 600, color: T_.textDim }}>Usage:</span>{" "}
                <span style={{ fontFamily: "monospace", color: agent.color, background: `${agent.color}10`, padding: "1px 6px", borderRadius: 3 }}>{agent.usage}</span>
              </div>
              <div style={{ fontSize: 11, color: T_.textGhost }}>
                <span style={{ fontWeight: 600, color: T_.textDim }}>Tools:</span> {agent.tools}
              </div>
              <div style={{ fontSize: 11, color: T_.textGhost }}>
                <span style={{ fontWeight: 600, color: T_.textDim }}>Mode:</span> {agent.mode}
              </div>
            </div>
          </div>
        ))}

        <div style={{ background: T_.bgInput, border: `1px dashed ${T_.accent}30`, borderRadius: 8, padding: "12px 14px", marginTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T_.accent, marginBottom: 6 }}>Recommended Workflow</div>
          <div style={{ fontSize: 11, color: T_.textMid, lineHeight: 1.8 }}>
            <strong>1.</strong> To update a tab with latest info → <span style={{ fontFamily: "monospace", color: "#14B8A6" }}>@refresh</span> (searches web, updates content, checks accuracy)<br/>
            <strong>2.</strong> After code changes → <span style={{ fontFamily: "monospace", color: T_.green }}>@verifier</span><br/>
            <strong>3.</strong> After writing research content → run <span style={{ fontFamily: "monospace", color: T_.blue }}>@fact-checker</span> and <span style={{ fontFamily: "monospace", color: T_.red }}>@fact-disputer</span> in parallel<br/>
            <strong>4.</strong> After both return → <span style={{ fontFamily: "monospace", color: T_.amber }}>@fact-check-reconciler</span> to get final verdicts<br/>
            <strong>5.</strong> Fix any CONFLICT / LIKELY WRONG items, then re-verify<br/>
            <strong>6.</strong> Periodically → <span style={{ fontFamily: "monospace", color: "#c084fc" }}>@consistency</span> to catch format/depth/staleness drift across tabs
          </div>
        </div>
      </div>

    </div>
  );
}
