import { useState } from "react";

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

const T_ = {
  bg: "#0a0e17", bgSidebar: "#0d1220", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347", borderLight: "#222d40",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", greenBg: "#0d3520", greenBorder: "#1a7a3d",
  amber: "#f5a623", amberBg: "#332508", amberBorder: "#8a5e16",
  grayBadge: "#3d4d60", grayBadgeText: "#b0bcc9",
  blue: "#70b0fa", red: "#f87171", redDim: "#7f1d1d",
};

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
      <h1 style={{ fontSize: 22, fontWeight: 600, color: T_.text, marginBottom: 4 }}>Data Verification</h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 28 }}>
        Track flagged issues, manage accepted changes, and build verification prompts to run against your data.
      </p>

      {/* ── Section 1: Flagged Issues ── */}
      <div style={panelStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={headerStyle}>Flagged Issues</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {flagged.length > 0 && (
              <span style={{ fontSize: 11, color: T_.textGhost }}>
                {flagged.filter(i => i.severity === "error").length} errors &middot; {flagged.filter(i => i.severity === "warning").length} warnings
              </span>
            )}
            <button onClick={() => setAddingFlag(!addingFlag)} style={btnSmall(addingFlag ? T_.border : T_.accent + "22", addingFlag ? T_.textDim : T_.accent, addingFlag ? T_.border : T_.accent + "44")}>
              {addingFlag ? "Cancel" : "+ Add Issue"}
            </button>
          </div>
        </div>

        {addingFlag && (
          <div style={{ background: T_.bgInput, border: `1px solid ${T_.borderLight}`, borderRadius: 8, padding: 14, marginBottom: 12 }}>
            <input value={flagTitle} onChange={e => setFlagTitle(e.target.value)} placeholder="Issue title..."
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: T_.text, fontSize: 13, fontFamily: FONT, marginBottom: 8 }} />
            <textarea value={flagDetail} onChange={e => setFlagDetail(e.target.value)} placeholder="Details — what's wrong, what to check..."
              rows={3} style={{ width: "100%", background: "transparent", border: `1px solid ${T_.border}`, borderRadius: 6, outline: "none", color: T_.textMid, fontSize: 12, fontFamily: FONT, padding: 8, resize: "vertical", marginBottom: 8 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {["error", "warning"].map(sev => (
                <span key={sev} onClick={() => setFlagSeverity(sev)} style={{
                  padding: "3px 12px", fontSize: 11, borderRadius: 5, cursor: "pointer",
                  background: flagSeverity === sev ? (sev === "error" ? T_.redDim : T_.amberBg) : "transparent",
                  color: flagSeverity === sev ? (sev === "error" ? T_.red : T_.amber) : T_.textGhost,
                  border: `1px solid ${flagSeverity === sev ? (sev === "error" ? T_.red + "44" : T_.amberBorder) : T_.border}`,
                }}>{sev}</span>
              ))}
              <button onClick={addFlag} style={{ ...btnSmall(T_.accent, "#000", T_.accent), marginLeft: "auto" }}>Add</button>
            </div>
          </div>
        )}

        {flagged.length === 0 && !addingFlag && (
          <div style={{ textAlign: "center", padding: "24px 0", color: T_.textGhost, fontSize: 13 }}>
            No flagged issues. Add issues manually or paste findings from verification runs.
          </div>
        )}

        {flagged.map((issue, idx) => {
          const isError = issue.severity === "error";
          const expanded = expandedFlag === idx;
          return (
            <div key={idx} style={{ borderRadius: 8, marginBottom: 6, overflow: "hidden", border: `1px solid ${isError ? T_.red + "44" : T_.amberBorder + "66"}` }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", cursor: "pointer",
                background: isError ? T_.redDim + "33" : T_.amberBg + "66",
              }} onClick={() => setExpandedFlag(expanded ? null : idx)}>
                <span style={{ fontSize: 13, color: isError ? T_.red : T_.amber }}>{isError ? "\u2716" : "\u26A0"}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: T_.text, flex: 1 }}>{issue.title}</span>
                <span style={{ fontSize: 11, color: T_.textGhost }}>
                  {new Date(issue.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <span style={{ fontSize: 10, color: T_.textGhost, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>&#9660;</span>
              </div>
              {expanded && (
                <div style={{ padding: "14px 16px", borderTop: `1px solid ${T_.borderLight}`, background: T_.bgPanel }}>
                  {issue.detail && <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6, marginBottom: 12, whiteSpace: "pre-wrap" }}>{issue.detail}</div>}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => acceptFlag(idx)} style={btnSmall(T_.greenBg, T_.green, T_.greenBorder)}>Accept &amp; Resolve</button>
                    <button onClick={() => removeFlag(idx)} style={btnSmall("transparent", T_.textGhost, T_.border)}>Dismiss</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Section 2: Accepted ── */}
      <div style={panelStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={headerStyle}>Accepted</span>
          {accepted.length > 0 && (
            <span style={{ fontSize: 11, color: T_.textGhost, cursor: "pointer" }} onClick={clearAccepted}>Clear all</span>
          )}
        </div>

        {accepted.length === 0 && (
          <div style={{ textAlign: "center", padding: "24px 0", color: T_.textGhost, fontSize: 13 }}>
            No accepted items yet.
          </div>
        )}

        {accepted.map((item, idx) => (
          <div key={idx} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", marginBottom: 4,
            borderRadius: 8, border: `1px solid ${T_.greenBorder}33`, background: T_.greenBg + "44",
          }}>
            <span style={{ fontSize: 12, color: T_.green }}>&#10003;</span>
            <span style={{ fontSize: 13, color: T_.text, flex: 1 }}>{item.title}</span>
            <span style={{ fontSize: 11, color: T_.textGhost }}>
              {new Date(item.acceptedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <span style={{ fontSize: 11, color: T_.textGhost, cursor: "pointer", padding: "2px 6px" }}
              onClick={() => dismissAccepted(idx)}>&#10005;</span>
          </div>
        ))}
      </div>

      {/* ── Section 3: Verification Prompts ── */}
      <div style={panelStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={headerStyle}>Verification Prompts</span>
          {editingPrompt === null && (
            <button onClick={startNewPrompt} style={btnSmall(T_.accent + "22", T_.accent, T_.accent + "44")}>+ Add Prompt</button>
          )}
        </div>

        {/* Prompt editor */}
        {editingPrompt !== null && (
          <div style={{ background: T_.bgInput, border: `1px solid ${T_.borderLight}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
            <textarea value={draftText} onChange={e => setDraftText(e.target.value)}
              placeholder="Write your verification prompt..."
              rows={5} style={{
                width: "100%", background: "transparent", border: `1px solid ${T_.border}`, borderRadius: 6,
                outline: "none", color: T_.text, fontSize: 13, fontFamily: FONT, padding: 10, resize: "vertical", marginBottom: 12, lineHeight: 1.6,
              }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={savePrompt} style={btnSmall(T_.accent, "#000", T_.accent)}>Save Prompt</button>
              <button onClick={() => { setEditingPrompt(null); setDraftText(""); setDraftTabs(new Set()); }}
                style={btnSmall("transparent", T_.textGhost, T_.border)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Saved prompts */}
        {prompts.length === 0 && editingPrompt === null && (
          <div style={{ textAlign: "center", padding: "24px 0", color: T_.textGhost, fontSize: 13 }}>
            No prompts yet. Add a verification prompt to get started.
          </div>
        )}

        {prompts.map((p, idx) => (
          <div key={idx} style={{
            background: T_.bgInput, border: `1px solid ${T_.borderLight}`, borderRadius: 8, padding: 14, marginBottom: 8,
          }}>
            <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6, marginBottom: 10, whiteSpace: "pre-wrap" }}>{p.text}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => { navigator.clipboard.writeText(p.text); }} style={btnSmall(T_.blue + "22", T_.blue, T_.blue + "44")}>Copy</button>
              <button onClick={() => startEditPrompt(idx)} style={btnSmall("transparent", T_.textGhost, T_.border)}>Edit</button>
              <button onClick={() => deletePrompt(idx)} style={btnSmall("transparent", T_.textGhost, T_.border)}>Delete</button>
              <span style={{ fontSize: 11, color: T_.textGhost, marginLeft: "auto" }}>
                {new Date(p.updated).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
