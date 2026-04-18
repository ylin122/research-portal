import { useState } from "react";
import { T_, FONT } from "./lib/theme";
import { callClaude } from "./lib/callClaude";

const SECTORS = {
  software: "Software",
  aidigital: "Digital Infrastructure",
  itservices: "IT Services",
  internet: "Internet",
  hardware: "Hardware & Others",
  education: "Education & Services",
  healthcare: "Healthcare IT",
};

const THESIS_STORAGE_KEY = "research_portal_theses";
function loadTheses() { try { return JSON.parse(localStorage.getItem(THESIS_STORAGE_KEY) || "[]"); } catch { return []; } }
function saveTheses(theses) { localStorage.setItem(THESIS_STORAGE_KEY, JSON.stringify(theses)); }

function extractVerdict(text) {
  const m = text?.match(/VERDICT:\s*(STRONG|MODERATE|WEAK|FLAWED)/i);
  return m ? m[1].toUpperCase() : "UNKNOWN";
}

const verdictColor = (v) => {
  if (v === "STRONG" || v === "STRENGTHENED" || v === "CONFIRMED") return T_.green;
  if (v === "MODERATE" || v === "EVOLVING") return T_.amber;
  if (v === "WEAK" || v === "CHALLENGED") return "#F97316";
  if (v === "FLAWED" || v === "INVALIDATED") return T_.red;
  return T_.textGhost;
};

const statusColor = (s) => {
  if (s === "CONFIRMED" || s === "STRENGTHENED") return T_.green;
  if (s === "EVOLVING") return T_.amber;
  if (s === "CHALLENGED") return "#F97316";
  if (s === "INVALIDATED") return T_.red;
  return T_.textGhost;
};

export default function ThesisAgent({ companies, fieldsMap, sectorNotes }) {
  const [mode, setMode] = useState("validate");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [thesis, setThesis] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [theses, setTheses] = useState(loadTheses);
  const [trackLoading, setTrackLoading] = useState({});
  const [expandedThesis, setExpandedThesis] = useState(null);

  const activeCos = companies.filter(c => c.sector !== "sources" && c.sector !== "prompts").sort((a, b) => a.name.localeCompare(b.name));

  function getCompanyContext(companyId) {
    const fields = fieldsMap?.[companyId] || {};
    const parts = [];
    for (const [key, val] of Object.entries(fields)) {
      if (val.text?.trim() && !key.startsWith("ai_")) {
        parts.push(`${key}: ${val.text.slice(0, 500)}`);
      }
    }
    return parts.join("\n\n");
  }

  async function validateThesis() {
    if (!thesis.trim()) return;
    setLoading(true);
    setResult(null);
    const co = activeCos.find(c => c.id === selectedCompany);
    const coName = co?.name || "the sector/market";
    const context = co ? getCompanyContext(co.id) : "";

    const prompt = `You are an investment research analyst stress-testing an investment thesis. Be rigorous, intellectually honest, and specific.

COMPANY/TOPIC: ${coName}
${context ? `\nEXISTING RESEARCH:\n${context}\n` : ""}
THESIS TO VALIDATE:
${thesis}

Analyze this thesis thoroughly using web search for current data. Return your analysis in this exact format (plain text, no markdown backticks):

VERDICT: [STRONG | MODERATE | WEAK | FLAWED]

SUPPORTING EVIDENCE:
- [bullet point with specific data/facts that support the thesis]
- [2-4 more bullets]

COUNTER-EVIDENCE:
- [bullet point with specific data/facts that challenge the thesis]
- [2-4 more bullets]

KEY RISKS:
- [specific risk that could invalidate the thesis]
- [2-3 more]

BLIND SPOTS:
- [what the thesis fails to consider]
- [1-2 more]

REFINED THESIS:
[A stronger, more nuanced version of the original thesis incorporating the evidence above, 2-3 sentences]`;

    try {
      const text = await callClaude(prompt);
      setResult(text);
      const newThesis = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        companyId: selectedCompany,
        companyName: coName,
        thesis: thesis.trim(),
        verdict: extractVerdict(text),
        lastValidation: text,
        lastChecked: new Date().toISOString(),
        created: new Date().toISOString(),
        history: [{ date: new Date().toISOString(), verdict: extractVerdict(text), summary: text.slice(0, 200) }],
      };
      const updated = [newThesis, ...theses];
      setTheses(updated);
      saveTheses(updated);
    } catch (e) {
      setResult("Error: " + e.message);
    }
    setLoading(false);
  }

  async function recheckThesis(t) {
    setTrackLoading(p => ({ ...p, [t.id]: true }));
    const co = activeCos.find(c => c.id === t.companyId);
    const context = co ? getCompanyContext(co.id) : "";

    const prompt = `You are an investment research analyst re-evaluating a previously validated thesis. Check if new developments have changed the picture.

COMPANY/TOPIC: ${t.companyName}
${context ? `\nEXISTING RESEARCH:\n${context}\n` : ""}
ORIGINAL THESIS:
${t.thesis}

PREVIOUS VERDICT: ${t.verdict}
PREVIOUS CHECK DATE: ${new Date(t.lastChecked).toLocaleDateString()}

Search for the latest news and developments since the last check. Has anything changed?

Return your analysis in this exact format (plain text, no markdown backticks):

STATUS: [CONFIRMED | STRENGTHENED | CHALLENGED | INVALIDATED | EVOLVING]

WHAT CHANGED:
- [specific new development since last check]
- [more if applicable]

CURRENT ASSESSMENT:
[2-3 sentences on where the thesis stands now]

VERDICT: [STRONG | MODERATE | WEAK | FLAWED]`;

    try {
      const text = await callClaude(prompt);
      const newVerdict = extractVerdict(text);
      const statusMatch = text?.match(/STATUS:\s*(CONFIRMED|STRENGTHENED|CHALLENGED|INVALIDATED|EVOLVING)/i);
      const status = statusMatch ? statusMatch[1].toUpperCase() : "UNKNOWN";
      const updated = theses.map(th => {
        if (th.id !== t.id) return th;
        return { ...th, verdict: newVerdict, lastValidation: text, lastChecked: new Date().toISOString(), trackStatus: status, history: [...(th.history || []), { date: new Date().toISOString(), verdict: newVerdict, status, summary: text.slice(0, 200) }] };
      });
      setTheses(updated);
      saveTheses(updated);
    } catch (e) { console.error("Recheck failed:", e); }
    setTrackLoading(p => ({ ...p, [t.id]: false }));
  }

  function deleteThesis(id) {
    const updated = theses.filter(t => t.id !== id);
    setTheses(updated);
    saveTheses(updated);
    if (expandedThesis === id) setExpandedThesis(null);
  }

  function renderFormattedText(text) {
    return text.split("\n").map((line, i) => {
      const isHeader = /^(VERDICT|STATUS|SUPPORTING EVIDENCE|COUNTER-EVIDENCE|KEY RISKS|BLIND SPOTS|REFINED THESIS|WHAT CHANGED|CURRENT ASSESSMENT):/.test(line);
      const verdictLine = line.match(/^VERDICT:\s*(\w+)/);
      const statusLine = line.match(/^STATUS:\s*(\w+)/);
      if (verdictLine) return <div key={i} style={{ fontSize: 16, fontWeight: 600, color: verdictColor(verdictLine[1]), marginBottom: 10, marginTop: 4 }}>VERDICT: {verdictLine[1]}</div>;
      if (statusLine) return <div key={i} style={{ fontSize: 16, fontWeight: 600, color: statusColor(statusLine[1]), marginBottom: 10 }}>STATUS: {statusLine[1]}</div>;
      if (isHeader) return <div key={i} style={{ fontSize: 14, fontWeight: 600, color: T_.accent, marginTop: 16, marginBottom: 6 }}>{line}</div>;
      if (line.startsWith("- ")) return <div key={i} style={{ fontSize: 13, color: T_.text, paddingLeft: 16, marginBottom: 4, lineHeight: 1.7 }}>{line}</div>;
      if (line.trim()) return <div key={i} style={{ fontSize: 13, color: T_.text, lineHeight: 1.7, marginBottom: 4 }}>{line}</div>;
      return <div key={i} style={{ height: 8 }} />;
    });
  }

  return (
    <div style={s.page}>
      <h1 style={s.title}>Thesis Agent</h1>
      <p style={s.sub}>Validate investment theses with AI-powered research and track them over time.</p>

      <div style={s.tabBar}>
        {[{ key: "validate", label: "Thesis Validator" }, { key: "tracker", label: "Thesis Tracker" }].map(m => (
          <span key={m.key} style={{ ...s.tab, background: mode === m.key ? "#3B82F6" : "#111827", color: mode === m.key ? "#FFF" : "#94A3B8" }} onClick={() => setMode(m.key)}>{m.label}</span>
        ))}
      </div>

      {/* ─── VALIDATOR ─── */}
      {mode === "validate" && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <label style={s.label}>Company (optional)</label>
            <select style={s.select} value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
              <option value="">General / Sector-level thesis</option>
              {activeCos.map(c => <option key={c.id} value={c.id}>{c.name} — {SECTORS[c.sector] || c.sector}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={s.label}>Your thesis</label>
            <textarea style={s.textarea} rows={5} placeholder="e.g., Cohesity's merger with Veritas positions them to dominate the data management market because..." value={thesis} onChange={e => setThesis(e.target.value)} />
          </div>

          <button style={{ ...s.btnAccent, opacity: loading || !thesis.trim() ? 0.5 : 1 }} disabled={loading || !thesis.trim()} onClick={validateThesis}>
            {loading ? "Validating..." : "Validate Thesis"}
          </button>

          {result && (
            <div style={s.resultBox}>
              <div style={{ fontSize: 12, color: T_.textGhost, marginBottom: 12 }}>Validation Result — {new Date().toLocaleDateString()}</div>
              {renderFormattedText(result)}
            </div>
          )}
        </div>
      )}

      {/* ─── TRACKER ─── */}
      {mode === "tracker" && (
        <div>
          {theses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: T_.textGhost }}>
              <div style={{ fontSize: 16, marginBottom: 8 }}>No theses tracked yet</div>
              <div style={{ fontSize: 13 }}>Use the Thesis Validator to create and validate a thesis — it will automatically appear here.</div>
            </div>
          ) : theses.map(t => {
            const isExpanded = expandedThesis === t.id;
            const isChecking = trackLoading[t.id];
            const daysSince = Math.floor((Date.now() - new Date(t.lastChecked).getTime()) / 86400000);
            const stale = daysSince >= 7;

            return (
              <div key={t.id} style={s.thesisCard}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: T_.text }}>{t.companyName}</span>
                      <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, fontWeight: 600, color: verdictColor(t.verdict), background: t.verdict === "STRONG" ? T_.greenBg : t.verdict === "MODERATE" ? T_.amberBg : t.verdict === "WEAK" ? "rgba(249,115,22,0.15)" : t.verdict === "FLAWED" ? T_.redDim : T_.bgPanel }}>{t.verdict}</span>
                      {t.trackStatus && <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, color: statusColor(t.trackStatus), border: `1px solid ${statusColor(t.trackStatus)}30` }}>{t.trackStatus}</span>}
                      {stale && <span style={{ fontSize: 10, color: T_.red }}>Stale ({daysSince}d ago)</span>}
                    </div>
                    <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6, marginBottom: 8 }}>{t.thesis}</div>
                    <div style={{ fontSize: 11, color: T_.textGhost }}>
                      Created {new Date(t.created).toLocaleDateString()} — Last checked {new Date(t.lastChecked).toLocaleDateString()}
                      {t.history && t.history.length > 1 && ` — ${t.history.length} checks`}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button style={s.btnSmall} onClick={() => setExpandedThesis(isExpanded ? null : t.id)}>{isExpanded ? "Collapse" : "Details"}</button>
                    <button style={{ ...s.btnSmall, color: T_.accent, borderColor: T_.accent }} disabled={isChecking} onClick={() => recheckThesis(t)}>{isChecking ? "Checking..." : "Recheck"}</button>
                    <button style={{ ...s.btnSmall, color: T_.red, borderColor: `${T_.red}40` }} onClick={() => deleteThesis(t.id)}>Delete</button>
                  </div>
                </div>
                {isExpanded && t.lastValidation && (
                  <div style={{ marginTop: 16, padding: "16px 0", borderTop: `1px solid ${T_.borderLight}` }}>
                    {renderFormattedText(t.lastValidation)}
                    {t.history && t.history.length > 1 && (
                      <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${T_.borderLight}` }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: T_.textDim, marginBottom: 8 }}>History</div>
                        {t.history.map((h, i) => (
                          <div key={i} style={{ display: "flex", gap: 12, fontSize: 12, color: T_.textGhost, marginBottom: 4, alignItems: "center" }}>
                            <span>{new Date(h.date).toLocaleDateString()}</span>
                            <span style={{ color: verdictColor(h.verdict), fontWeight: 500 }}>{h.verdict}</span>
                            {h.status && <span style={{ color: statusColor(h.status) }}>{h.status}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { flex: 1, padding: "36px 52px", overflowY: "auto", maxWidth: "none" },
  title: { fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", margin: "0 0 6px", fontFamily: FONT },
  sub: { fontSize: 14, color: T_.textDim, marginBottom: 24, lineHeight: 1.7, fontFamily: FONT },
  tabBar: { display: "flex", flexWrap: "wrap", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B", marginBottom: 28, width: "fit-content", maxWidth: "100%" },
  tab: { padding: "8px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.15s", fontFamily: FONT, whiteSpace: "nowrap" },
  label: { display: "block", fontSize: 12, fontWeight: 500, color: T_.textDim, marginBottom: 8, fontFamily: FONT },
  select: { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 7, padding: "10px 14px", fontSize: 13, color: T_.text, outline: "none", fontFamily: FONT, boxSizing: "border-box", appearance: "auto" },
  textarea: { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, padding: "14px 16px", fontSize: 13, color: T_.text, outline: "none", fontFamily: FONT, resize: "vertical", minHeight: 100, lineHeight: 1.7, boxSizing: "border-box" },
  btnAccent: { padding: "10px 24px", fontSize: 13, fontWeight: 500, border: "none", background: T_.accent, color: T_.bg, borderRadius: 7, cursor: "pointer", fontFamily: FONT },
  btnSmall: { padding: "5px 12px", fontSize: 11, border: `1px solid ${T_.border}`, background: "transparent", color: T_.textDim, borderRadius: 5, cursor: "pointer", fontFamily: FONT },
  resultBox: { marginTop: 24, background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: "20px 24px", fontFamily: FONT },
  thesisCard: { background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: "18px 22px", marginBottom: 8, fontFamily: FONT },
};
