import { useState, useEffect } from "react";

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

const T_ = {
  bg: "#0a0e17", bgSidebar: "#0d1220", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347", borderLight: "#222d40",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", greenBg: "#0d3520", greenBorder: "#1a7a3d",
  amber: "#f5a623", amberBg: "#332508", amberBorder: "#8a5e16",
  grayBadge: "#3d4d60", grayBadgeText: "#b0bcc9",
  red: "#f87171", redDim: "#7f1d1d",
  blue: "#70b0fa",
};

const PRIORITIES = ["High", "Medium", "Low"];

const prColors = {
  High: { bg: T_.greenBg, color: T_.green, border: T_.greenBorder },
  Medium: { bg: T_.amberBg, color: T_.amber, border: T_.amberBorder },
  Low: { bg: T_.grayBadge, color: T_.grayBadgeText, border: T_.textGhost },
};

const SECTORS = {
  software: "Software",
  aidigital: "Digital Infrastructure",
  itservices: "IT Services",
  internet: "Internet",
  hardware: "Hardware & Others",
  education: "Education & Services",
  healthcare: "Healthcare IT",
};

const AGENT_TABS = [
  { key: "research", label: "Research Agent" },
  { key: "brainstorm", label: "Brainstorming Agent" },
];

// ─── Agents shell (sub-tab container) ────────────────
export default function Agents({ companies, onSetPriority, fieldsMap, sectorNotes, initialTab }) {
  const [tab, setTab] = useState(initialTab || "research");
  useEffect(() => { if (initialTab) setTab(initialTab); }, [initialTab]);

  return (
    <div style={s.page}>
      <h1 style={s.title}>Agents</h1>
      <p style={s.sub}>Configure and manage automated research agents.</p>

      {/* Sub-tab bar */}
      <div style={s.tabBar}>
        {AGENT_TABS.map(t => (
          <span key={t.key} style={{
            ...s.tab,
            ...(tab === t.key ? { color: T_.accent, borderBottomColor: T_.accent } : {}),
          }} onClick={() => setTab(t.key)}>{t.label}</span>
        ))}
      </div>

      {/* Sub-tab content */}
      {tab === "research" && <ResearchAgent companies={companies} onSetPriority={onSetPriority} />}
      {tab === "brainstorm" && <BrainstormingAgent companies={companies} fieldsMap={fieldsMap} sectorNotes={sectorNotes} />}
    </div>
  );
}

// ─── Brainstorming Agent sub-tab ─────────────────────

async function callClaude(prompt, maxTokens = 4000) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: maxTokens,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const d = await r.json();
  return d.content?.map(i => i.type === "text" ? i.text : "").filter(Boolean).join("\n") || "";
}

const THESIS_STORAGE_KEY = "research_portal_theses";

function loadTheses() {
  try { return JSON.parse(localStorage.getItem(THESIS_STORAGE_KEY) || "[]"); } catch { return []; }
}

function saveTheses(theses) {
  localStorage.setItem(THESIS_STORAGE_KEY, JSON.stringify(theses));
}

function BrainstormingAgent({ companies, fieldsMap, sectorNotes }) {
  const [mode, setMode] = useState("validate"); // "validate" | "tracker"
  const [selectedCompany, setSelectedCompany] = useState("");
  const [thesis, setThesis] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [theses, setTheses] = useState(loadTheses);
  const [trackLoading, setTrackLoading] = useState({});
  const [expandedThesis, setExpandedThesis] = useState(null);

  const activeCos = companies.filter(c => c.sector !== "sources" && c.sector !== "prompts").sort((a, b) => a.name.localeCompare(b.name));

  // Build context from existing research
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

      // Auto-save to tracker
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

  function extractVerdict(text) {
    const m = text?.match(/VERDICT:\s*(STRONG|MODERATE|WEAK|FLAWED)/i);
    return m ? m[1].toUpperCase() : "UNKNOWN";
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
        return {
          ...th,
          verdict: newVerdict,
          lastValidation: text,
          lastChecked: new Date().toISOString(),
          trackStatus: status,
          history: [...(th.history || []), { date: new Date().toISOString(), verdict: newVerdict, status, summary: text.slice(0, 200) }],
        };
      });
      setTheses(updated);
      saveTheses(updated);
    } catch (e) {
      console.error("Recheck failed:", e);
    }
    setTrackLoading(p => ({ ...p, [t.id]: false }));
  }

  function deleteThesis(id) {
    const updated = theses.filter(t => t.id !== id);
    setTheses(updated);
    saveTheses(updated);
    if (expandedThesis === id) setExpandedThesis(null);
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

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <h2 style={s.subTitle}>Brainstorming Agent</h2>
      </div>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 24, lineHeight: 1.6, fontFamily: FONT }}>
        Validate investment theses with AI-powered research and track them over time for changes.
      </p>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 0, marginBottom: 28, borderBottom: `1px solid ${T_.borderLight}` }}>
        {[{ key: "validate", label: "Thesis Validator" }, { key: "tracker", label: "Thesis Tracker" }].map(m => (
          <span key={m.key} style={{
            ...s.tab,
            ...(mode === m.key ? { color: T_.accent, borderBottomColor: T_.accent } : {}),
          }} onClick={() => setMode(m.key)}>{m.label}</span>
        ))}
      </div>

      {/* ─── VALIDATOR ─── */}
      {mode === "validate" && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <label style={s.label}>Company (optional)</label>
            <select
              style={s.select}
              value={selectedCompany}
              onChange={e => setSelectedCompany(e.target.value)}
            >
              <option value="">General / Sector-level thesis</option>
              {activeCos.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {SECTORS[c.sector] || c.sector}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={s.label}>Your thesis</label>
            <textarea
              style={s.textarea}
              rows={5}
              placeholder="e.g., Cohesity's merger with Veritas positions them to dominate the data management market because..."
              value={thesis}
              onChange={e => setThesis(e.target.value)}
            />
          </div>

          <button
            style={{ ...s.btnAccent, opacity: loading || !thesis.trim() ? 0.5 : 1 }}
            disabled={loading || !thesis.trim()}
            onClick={validateThesis}
          >
            {loading ? "Validating..." : "Validate Thesis"}
          </button>

          {result && (
            <div style={s.resultBox}>
              <div style={{ fontSize: 12, color: T_.textGhost, marginBottom: 12 }}>
                Validation Result — {new Date().toLocaleDateString()}
              </div>
              {result.split("\n").map((line, i) => {
                const isHeader = /^(VERDICT|SUPPORTING EVIDENCE|COUNTER-EVIDENCE|KEY RISKS|BLIND SPOTS|REFINED THESIS):/.test(line);
                const verdictLine = line.match(/^VERDICT:\s*(\w+)/);
                if (verdictLine) {
                  return (
                    <div key={i} style={{ fontSize: 16, fontWeight: 600, color: verdictColor(verdictLine[1]), marginBottom: 12, marginTop: 4 }}>
                      VERDICT: {verdictLine[1]}
                    </div>
                  );
                }
                if (isHeader) {
                  return <div key={i} style={{ fontSize: 14, fontWeight: 600, color: T_.accent, marginTop: 16, marginBottom: 6 }}>{line}</div>;
                }
                if (line.startsWith("- ")) {
                  return <div key={i} style={{ fontSize: 13, color: T_.text, paddingLeft: 16, marginBottom: 4, lineHeight: 1.7 }}>{line}</div>;
                }
                if (line.trim()) {
                  return <div key={i} style={{ fontSize: 13, color: T_.text, lineHeight: 1.7, marginBottom: 4 }}>{line}</div>;
                }
                return <div key={i} style={{ height: 8 }} />;
              })}
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
              <div style={{ fontSize: 13 }}>Use the Thesis Validator to create and validate a thesis — it will automatically appear here for tracking.</div>
            </div>
          ) : (
            <div>
              {theses.map(t => {
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
                          <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, fontWeight: 600, color: verdictColor(t.verdict), background: t.verdict === "STRONG" ? T_.greenBg : t.verdict === "MODERATE" ? T_.amberBg : t.verdict === "WEAK" ? "rgba(249,115,22,0.15)" : t.verdict === "FLAWED" ? T_.redDim : T_.bgPanel }}>
                            {t.verdict}
                          </span>
                          {t.trackStatus && (
                            <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, color: statusColor(t.trackStatus), border: `1px solid ${statusColor(t.trackStatus)}30` }}>
                              {t.trackStatus}
                            </span>
                          )}
                          {stale && <span style={{ fontSize: 10, color: T_.red }}>Stale ({daysSince}d ago)</span>}
                        </div>
                        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6, marginBottom: 8 }}>{t.thesis}</div>
                        <div style={{ fontSize: 11, color: T_.textGhost }}>
                          Created {new Date(t.created).toLocaleDateString()} — Last checked {new Date(t.lastChecked).toLocaleDateString()}
                          {t.history && t.history.length > 1 && ` — ${t.history.length} checks`}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button style={s.btnSmall} onClick={() => setExpandedThesis(isExpanded ? null : t.id)}>
                          {isExpanded ? "Collapse" : "Details"}
                        </button>
                        <button style={{ ...s.btnSmall, color: T_.accent, borderColor: T_.accent }} disabled={isChecking} onClick={() => recheckThesis(t)}>
                          {isChecking ? "Checking..." : "Recheck"}
                        </button>
                        <button style={{ ...s.btnSmall, color: T_.red, borderColor: `${T_.red}40` }} onClick={() => deleteThesis(t.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                    {isExpanded && t.lastValidation && (
                      <div style={{ marginTop: 16, padding: "16px 0", borderTop: `1px solid ${T_.borderLight}` }}>
                        {t.lastValidation.split("\n").map((line, i) => {
                          const isHeader = /^(VERDICT|STATUS|SUPPORTING EVIDENCE|COUNTER-EVIDENCE|KEY RISKS|BLIND SPOTS|REFINED THESIS|WHAT CHANGED|CURRENT ASSESSMENT):/.test(line);
                          const verdictLine = line.match(/^VERDICT:\s*(\w+)/);
                          const statusLine = line.match(/^STATUS:\s*(\w+)/);
                          if (verdictLine) return <div key={i} style={{ fontSize: 15, fontWeight: 600, color: verdictColor(verdictLine[1]), marginBottom: 8 }}>VERDICT: {verdictLine[1]}</div>;
                          if (statusLine) return <div key={i} style={{ fontSize: 15, fontWeight: 600, color: statusColor(statusLine[1]), marginBottom: 8 }}>STATUS: {statusLine[1]}</div>;
                          if (isHeader) return <div key={i} style={{ fontSize: 13, fontWeight: 600, color: T_.accent, marginTop: 14, marginBottom: 4 }}>{line}</div>;
                          if (line.startsWith("- ")) return <div key={i} style={{ fontSize: 13, color: T_.text, paddingLeft: 16, marginBottom: 3, lineHeight: 1.6 }}>{line}</div>;
                          if (line.trim()) return <div key={i} style={{ fontSize: 13, color: T_.text, lineHeight: 1.6, marginBottom: 3 }}>{line}</div>;
                          return <div key={i} style={{ height: 6 }} />;
                        })}
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
      )}
    </div>
  );
}

// ─── Research Agent sub-tab ──────────────────────────
function ResearchAgent({ companies, onSetPriority }) {
  const [collapsed, setCollapsed] = useState({});

  const toggle = (sk) => setCollapsed(p => ({ ...p, [sk]: !p[sk] }));

  const bySector = {};
  for (const c of companies) {
    if (c.sector === "sources" || c.sector === "prompts") continue;
    if (!bySector[c.sector]) bySector[c.sector] = [];
    bySector[c.sector].push(c);
  }

  for (const sk of Object.keys(bySector)) {
    bySector[sk].sort((a, b) => a.name.localeCompare(b.name));
  }

  const counts = { High: 0, Medium: 0, Low: 0, None: 0 };
  for (const c of companies) {
    if (c.sector === "sources" || c.sector === "prompts") continue;
    if (c.priority && counts[c.priority] !== undefined) counts[c.priority]++;
    else counts.None++;
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <h2 style={s.subTitle}>Research Agent</h2>
      </div>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 24, lineHeight: 1.6, fontFamily: FONT }}>
        Configure which companies the research agent monitors. Priority determines news scraping frequency and depth.
      </p>

      <div style={s.summaryRow}>
        {PRIORITIES.map(pr => (
          <div key={pr} style={{ ...s.summaryCard, borderColor: prColors[pr].border }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: prColors[pr].color }}>{counts[pr]}</div>
            <div style={{ fontSize: 12, color: T_.textDim }}>{pr} Priority</div>
          </div>
        ))}
        <div style={{ ...s.summaryCard, borderColor: T_.border }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: T_.textGhost }}>{counts.None}</div>
          <div style={{ fontSize: 12, color: T_.textDim }}>Unassigned</div>
        </div>
      </div>

      {Object.entries(SECTORS).map(([sk, label]) => {
        const cos = bySector[sk];
        if (!cos || cos.length === 0) return null;
        const isCollapsed = collapsed[sk];
        const sectorCounts = { High: 0, Medium: 0, Low: 0 };
        for (const c of cos) {
          if (c.priority && sectorCounts[c.priority] !== undefined) sectorCounts[c.priority]++;
        }

        return (
          <div key={sk} style={s.sectorBlock}>
            <div style={s.sectorHeader} onClick={() => toggle(sk)}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, color: T_.textDim, transition: "transform .15s", transform: isCollapsed ? "rotate(0)" : "rotate(90deg)", display: "inline-block" }}>&#9654;</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: T_.text }}>{label}</span>
                <span style={{ fontSize: 12, color: T_.textGhost }}>{cos.length}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {PRIORITIES.map(pr => sectorCounts[pr] > 0 && (
                  <span key={pr} style={{ fontSize: 11, color: prColors[pr].color, background: prColors[pr].bg, padding: "2px 8px", borderRadius: 4 }}>
                    {sectorCounts[pr]} {pr}
                  </span>
                ))}
              </div>
            </div>
            {!isCollapsed && (
              <div style={s.companyList}>
                {cos.map(c => {
                  const pr = c.priority || "";
                  return (
                    <div key={c.id} style={s.companyRow}>
                      <span style={{ fontSize: 13, color: T_.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                      <div style={{ display: "flex", gap: 4 }}>
                        {PRIORITIES.map(p => {
                          const active = pr === p;
                          const pc = prColors[p];
                          return (
                            <span key={p} style={{
                              padding: "4px 12px", fontSize: 11, borderRadius: 5, cursor: "pointer",
                              border: `1px solid ${active ? pc.border : T_.border}`,
                              background: active ? pc.bg : "transparent",
                              color: active ? pc.color : T_.textGhost,
                              transition: "all .12s", fontFamily: FONT,
                            }} onClick={() => onSetPriority(c.id, p)}>{p}</span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const s = {
  page: { flex: 1, padding: "36px 52px", overflowY: "auto", maxWidth: 1020 },
  title: { fontSize: 24, fontWeight: 500, color: T_.text, margin: "0 0 6px", fontFamily: FONT },
  sub: { fontSize: 14, color: T_.textDim, marginBottom: 24, lineHeight: 1.7, fontFamily: FONT },
  subTitle: { fontSize: 18, fontWeight: 500, color: T_.text, margin: 0, fontFamily: FONT },
  tabBar: { display: "flex", gap: 0, borderBottom: `1px solid ${T_.borderLight}`, marginBottom: 28 },
  tab: { padding: "10px 20px", fontSize: 13, fontWeight: 500, color: T_.textGhost, cursor: "pointer", borderBottom: "2px solid transparent", transition: "all .12s", fontFamily: FONT, marginBottom: -1 },
  summaryRow: { display: "flex", gap: 10, marginBottom: 32 },
  summaryCard: { background: T_.bgPanel, border: `1px solid`, borderRadius: 10, padding: "14px 20px", minWidth: 100, textAlign: "center", fontFamily: FONT },
  sectorBlock: { marginBottom: 4, background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, overflow: "hidden" },
  sectorHeader: { padding: "12px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none", fontFamily: FONT },
  companyList: { borderTop: `1px solid ${T_.borderLight}` },
  companyRow: { display: "flex", alignItems: "center", gap: 12, padding: "9px 18px 9px 38px", borderBottom: `1px solid ${T_.borderLight}`, fontFamily: FONT },
  label: { display: "block", fontSize: 12, fontWeight: 500, color: T_.textDim, marginBottom: 8, fontFamily: FONT },
  select: { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 7, padding: "10px 14px", fontSize: 13, color: T_.text, outline: "none", fontFamily: FONT, boxSizing: "border-box", appearance: "auto" },
  textarea: { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, padding: "14px 16px", fontSize: 13, color: T_.text, outline: "none", fontFamily: FONT, resize: "vertical", minHeight: 100, lineHeight: 1.7, boxSizing: "border-box" },
  btnAccent: { padding: "10px 24px", fontSize: 13, fontWeight: 500, border: "none", background: T_.accent, color: T_.bg, borderRadius: 7, cursor: "pointer", fontFamily: FONT },
  btnSmall: { padding: "5px 12px", fontSize: 11, border: `1px solid ${T_.border}`, background: "transparent", color: T_.textDim, borderRadius: 5, cursor: "pointer", fontFamily: FONT },
  resultBox: { marginTop: 24, background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: "20px 24px", fontFamily: FONT },
  thesisCard: { background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: "18px 22px", marginBottom: 8, fontFamily: FONT },
};
