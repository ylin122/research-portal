import { useState, useEffect, useCallback, useRef } from "react";
import Primer from "./Primer";
import AIDisruption from "./AIDisruption";
import ResearchAgentPage from "./ResearchAgentPage";
import ThesisAgent from "./ThesisAgent";
import NotesIdeasAgent from "./NotesIdeasAgent";
import DataVerificationAgent from "./DataVerificationAgent";
import BusinessModels from "./BusinessModels";
import CreditInstruments from "./CreditInstruments";
import AuditLog from "./AuditLog";
import KnowledgeBase from "./KnowledgeBase";
import Prompts from "./Prompts";
import KnowledgeInterests from "./KnowledgeInterests";
import Sources from "./Sources";
import Restructuring from "./Restructuring";
import Principles from "./Principles";
import Dashboard from "./Dashboard";
import QuickNotes from "./QuickNotes";
import WatchlistAgent from "./WatchlistAgent";
import QAAgent from "./QAAgent";
// import IdeaTracker from "./IdeaTracker";
import TractCapitalReview from "./TractCapitalReview";
import IndustryResearch from "./IndustryResearch";
import {
  loadCompanies, insertCompany, updateCompanyPriority, updateCompanySector, updateCompanyMoats,
  loadAllFields, upsertField,
  loadAllNotes, insertNote, deleteNote as dbDeleteNote,
  loadNewsCache, upsertNewsCache,
  loadSectorNotes, upsertSectorNote,
  loadResearchResults,
} from "./lib/db";

// ─── Helpers ──────────────────────────────────────────
function useAutoSave(fn, ms = 700) {
  const t = useRef(null);
  return useCallback((...a) => { clearTimeout(t.current); t.current = setTimeout(() => fn(...a), ms); }, [fn, ms]);
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function ts() { return new Date().toISOString(); }
function fmt(d) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function fmtShort(d) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }

// ─── Sectors ──────────────────────────────────────────
const SECTORS = {
  software: { label: "Software", subs: { application: "Application", infrastructure: "Infrastructure", security: "Security", other: "Other" } },
  aidigital: { label: "Digital Infrastructure", subs: { compute: "Compute", shell: "Shell & Power", other: "Other" } },
  itservices: { label: "IT Services", subs: { var: "VAR", consulting: "Consulting", outsourcing: "Outsourcing", managed: "Managed Services", other: "Other" } },
  internet: { label: "Internet", subs: { ecommerce: "E-Commerce", adtech: "AdTech", social: "Social / Content", marketplace: "Marketplace", hosting: "Hosting / Domains", other: "Other" } },
  hardware: { label: "Hardware & Others", subs: { semiconductors: "Semiconductors", devices: "Devices", networking: "Networking", other: "Other" } },
  education: { label: "Education & Services", subs: { edtech: "EdTech", traditional: "Traditional", corporate: "Corporate Training", other: "Other" } },
  healthcare: { label: "Healthcare IT", subs: { ehr: "EHR / EMR", analytics: "Analytics", digital: "Digital Health", other: "Other" } },
  sources: { label: "Source", subs: { all: "All Sources" } },
};

const FIELDS = [
  { key: "overview", label: "Company overview", ph: "Business description, founding year, HQ, stage, ownership, funding history, key leadership..." },
  { key: "products", label: "Key business / products", ph: "Start with how the company makes money. Core products, services, revenue streams, business model, pricing, value proposition..." },
  { key: "customers", label: "Customer focus", ph: "Target segments, key accounts, verticals, GTM motion, deal sizes, retention, expansion, geographic focus..." },
  { key: "industry", label: "Industry & market", ph: "TAM/SAM/SOM, growth drivers, macro trends, regulatory environment, tailwinds/headwinds, secular shifts..." },
  { key: "competitive", label: "Competitive landscape", ph: "Key competitors, differentiation, moat, positioning, win/loss dynamics, emerging threats, market share..." },
  { key: "transactions", label: "Recent transactions", ph: "Funding rounds, M&A, divestitures, partnerships, key deals, valuation history, cap table, exit path..." },
  { key: "financials", label: "Financials & metrics", ph: "Revenue, growth, margins, ARR/MRR, headcount, unit economics, burn, profitability, debt profile..." },
];

const SOURCE_FIELDS = [
  { key: "overview", label: "Sources", ph: "Running list of sources used across company research briefs..." },
];

const PRIORITIES = ["High", "Medium", "Low"];

// ─── Theme ────────────────────────────────────────────
const T_ = {
  bg: "#0a0e17", bgSidebar: "#0d1220", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347", borderLight: "#222d40",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", greenBg: "#0d3520", greenBorder: "#1a7a3d",
  amber: "#f5a623", amberBg: "#332508", amberBorder: "#8a5e16",
  grayBadge: "#3d4d60", grayBadgeText: "#b0bcc9",
  blue: "#70b0fa", red: "#f87171", redDim: "#7f1d1d",
};

// ─── News API ─────────────────────────────────────────
async function fetchNews(name) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return [];
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: `Find the 4-6 most recent and critical news about "${name}" from the last 60 days. Focus on: funding, M&A, product launches, executive changes, partnerships, earnings, regulatory actions, and major business developments.\n\nSort results by date with the most recent first.\n\nRespond ONLY with a JSON array, no markdown backticks, no preamble. Each item:\n- "headline": string (concise, max 15 words)\n- "source": string (publication name)\n- "date": string (e.g. "Mar 15, 2026")\n- "summary": string (2-3 sentences on why this matters)\n\nIf no recent news found, return [].` }],
      }),
    });
    const d = await r.json();
    const txt = d.content?.map(i => i.type === "text" ? i.text : "").filter(Boolean).join("\n") || "";
    try { const p = JSON.parse(txt.replace(/```json|```/g, "").trim()); return Array.isArray(p) ? p : []; } catch { return []; }
  } catch { return []; }
}

// ─── App ──────────────────────────────────────────────
const APP_PASS = "Ylin6274!";

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("rp_auth") === "1");
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);

  if (!authed) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: T_.bg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <div style={{ background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 12, padding: 40, width: 320, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: T_.text, marginBottom: 6 }}>Research Portal</div>
          <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 24 }}>Enter password to continue</div>
          <input
            type="password"
            value={passInput}
            onChange={e => { setPassInput(e.target.value); setPassError(false); }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                if (passInput === APP_PASS) { sessionStorage.setItem("rp_auth", "1"); setAuthed(true); }
                else setPassError(true);
              }
            }}
            placeholder="Password"
            autoFocus
            style={{
              width: "100%", background: T_.bgInput, border: `1px solid ${passError ? T_.red : T_.border}`, borderRadius: 6,
              padding: "10px 14px", color: T_.text, fontSize: 14, outline: "none", boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
          {passError && <div style={{ color: T_.red, fontSize: 12, marginTop: 8 }}>Incorrect password</div>}
          <button
            onClick={() => {
              if (passInput === APP_PASS) { sessionStorage.setItem("rp_auth", "1"); setAuthed(true); }
              else setPassError(true);
            }}
            style={{
              marginTop: 16, width: "100%", background: T_.accent, color: "#000", border: "none", borderRadius: 6,
              padding: "10px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return <AppContent />;
}

function AppContent() {
  const [ready, setReady] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [sectorNotes, setSectorNotes] = useState({});
  const [fieldsMap, setFieldsMap] = useState({});
  const [notesMap, setNotesMap] = useState({});
  const [newsCache, setNewsCache] = useState({});
  const [newsLoading, setNewsLoading] = useState({});
  const [researchResults, setResearchResults] = useState({});
  const [view, setView] = useState({ type: "home" });
  const [sidebarOpen, setSidebarOpen] = useState(() => Object.fromEntries(Object.keys(SECTORS).map(k => [k, false])));
  const [companiesOpen, setCompaniesOpen] = useState(false);
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [equityOpen, setEquityOpen] = useState(false);
  const [industryOpen, setIndustryOpen] = useState(false);
  const [equities, setEquities] = useState(() => {
    try { return JSON.parse(localStorage.getItem("research_portal_equities") || "[]"); } catch { return []; }
  });
  const [equityNotes, setEquityNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("research_portal_equity_notes") || "{}"); } catch { return {}; }
  });
  const [adding, setAdding] = useState(null);
  const [addName, setAddName] = useState("");
  const [addSub, setAddSub] = useState("");
  const [search, setSearch] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [editingSector, setEditingSector] = useState(false);
  const [pendingSector, setPendingSector] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("");
  const addRef = useRef(null);

  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [cos, fields, notes, news, sn, rr] = await Promise.all([
          loadCompanies(), loadAllFields(), loadAllNotes(), loadNewsCache(), loadSectorNotes(), loadResearchResults()
        ]);
        setCompanies(cos);
        setFieldsMap(fields);
        setNotesMap(notes);
        setNewsCache(news);
        setSectorNotes(sn);
        setResearchResults(rr);
        setReady(true);
      } catch (err) {
        console.error('Failed to load data:', err);
        setLoadError(err.message || 'Failed to connect to database');
      }
    })();
  }, []);

  // Seed equity companies on first load
  useEffect(() => {
    const SEED = [
      { id: "eq_micron", name: "Micron", sub: "" },
      { id: "eq_alibaba", name: "Alibaba", sub: "" },
      { id: "eq_tencent", name: "Tencent", sub: "" },
      { id: "eq_lumentum", name: "Lumentum", sub: "" },
      { id: "eq_coherent", name: "Coherent", sub: "" },
      { id: "eq_nvda", name: "NVIDIA", sub: "" },
      { id: "eq_amzn", name: "Amazon", sub: "" },
      { id: "eq_msft", name: "Microsoft", sub: "" },
      { id: "eq_tsm", name: "TSMC", sub: "" },
    ];
    if (equities.length === 0) {
      setEquities(SEED);
      localStorage.setItem("research_portal_equities", JSON.stringify(SEED));
    } else {
      const ids = new Set(equities.map(e => e.id));
      const missing = SEED.filter(s => !ids.has(s.id));
      if (missing.length > 0) {
        const updated = [...equities, ...missing];
        setEquities(updated);
        localStorage.setItem("research_portal_equities", JSON.stringify(updated));
      }
    }
  }, []);

  function saveEquities(updated) { setEquities(updated); localStorage.setItem("research_portal_equities", JSON.stringify(updated)); }
  function saveEquityNotes(updated) { setEquityNotes(updated); localStorage.setItem("research_portal_equity_notes", JSON.stringify(updated)); }

  const debouncedFieldSave = useAutoSave((companyId, fieldKey, text) => {
    upsertField(companyId, fieldKey, text);
  });

  const debouncedSectorNoteSave = useAutoSave((key, text) => {
    upsertSectorNote(key, text);
  });

  async function refreshNews(id) {
    const co = companies.find(c => c.id === id);
    if (!co) return;
    setNewsLoading(p => ({ ...p, [id]: true }));
    const news = await fetchNews(co.name);
    const date = await upsertNewsCache(id, news);
    setNewsCache(p => ({ ...p, [id]: { items: news, date } }));
    setNewsLoading(p => ({ ...p, [id]: false }));
  }

  async function refreshAllNews() {
    for (const co of companies) { await refreshNews(co.id); }
  }

  async function addCompanyHandler() {
    if (!addName.trim() || !adding || !addSub) return;
    const id = uid();
    await insertCompany({ id, name: addName.trim(), sector: adding, sub: addSub });
    const newCo = { id, name: addName.trim(), sector: adding, sub: addSub, priority: '' };
    setCompanies(p => [...p, newCo]);
    setAdding(null); setAddName(""); setAddSub("");
    setView({ type: "company", id });
    setTimeout(() => refreshNews(id), 200);
  }

  async function changeSector(id, newSector, newSub) {
    await updateCompanySector(id, newSector, newSub);
    setCompanies(p => p.map(c => c.id === id ? { ...c, sector: newSector, sub: newSub } : c));
  }

  function updateField(id, key, text) {
    setFieldsMap(p => ({
      ...p,
      [id]: { ...(p[id] || {}), [key]: { text, date: ts() } }
    }));
    debouncedFieldSave(id, key, text);
  }

  async function setPriority(id, pr) {
    const newPr = companies.find(c => c.id === id)?.priority === pr ? "" : pr;
    await updateCompanyPriority(id, newPr);
    setCompanies(p => p.map(c => c.id === id ? { ...c, priority: newPr } : c));
  }

  async function addNote(id, text) {
    if (!text.trim()) return;
    const noteId = uid();
    const date = await insertNote(id, noteId, text);
    setNotesMap(p => ({
      ...p,
      [id]: [{ id: noteId, text, date: date || ts() }, ...(p[id] || [])]
    }));
  }

  async function delNote(cid, nid) {
    await dbDeleteNote(nid);
    setNotesMap(p => ({
      ...p,
      [cid]: (p[cid] || []).filter(n => n.id !== nid)
    }));
  }

  function updateSN(key, text) {
    const date = ts();
    setSectorNotes(p => ({ ...p, [key]: { text, date } }));
    debouncedSectorNoteSave(key, text);
  }

  const getCos = (sector) => companies.filter(c => c.sector === sector).sort((a, b) => a.name.localeCompare(b.name));
  const filteredCos = (list) => search ? list.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : list;

  const FIELD_LABELS = Object.fromEntries([...FIELDS, ...SOURCE_FIELDS].map(f => [f.key, f.label]));

  function recentUpdates(limit = 15) {
    const all = [];
    Object.entries(fieldsMap).forEach(([id, fields]) => {
      const co = companies.find(c => c.id === id);
      if (!co || co.sector === "prompts" || co.sector === "sources") return;
      if (priorityFilter && (co.priority || "") !== priorityFilter) return;
      Object.entries(fields).forEach(([key, val]) => {
        if (!val.date || !val.text?.trim() || key.startsWith("ai_")) return;
        all.push({ cid: id, coName: co.name, sector: co.sector, fieldKey: key, fieldLabel: FIELD_LABELS[key] || key, date: val.date });
      });
    });
    // Also include notes
    Object.entries(notesMap).forEach(([id, notes]) => {
      const co = companies.find(c => c.id === id);
      if (!co || co.sector === "prompts" || co.sector === "sources") return;
      if (priorityFilter && (co.priority || "") !== priorityFilter) return;
      (notes || []).forEach(n => {
        all.push({ cid: id, coName: co.name, sector: co.sector, fieldKey: "note", fieldLabel: "Research note", date: n.date });
      });
    });
    return all.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
  }

  useEffect(() => { if (adding && addRef.current) addRef.current.focus(); }, [adding]);

  if (!ready) return (
    <div style={s.wrap}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, color: loadError ? T_.red : T_.textDim, fontSize: 13, flexDirection: "column", gap: 8 }}>
        {loadError ? <><div>Error connecting to database:</div><div>{loadError}</div></> : "Loading..."}
      </div>
    </div>
  );

  const cur = view.type === "company" ? companies.find(c => c.id === view.id) : null;
  const curFields = cur ? (fieldsMap[cur.id] || {}) : null;
  const curNotes = cur ? (notesMap[cur.id] || []) : null;
  const curNews = cur ? (newsCache[cur.id] || null) : null;
  const curPriority = cur?.priority || "";

  return (
    <div style={s.wrap}>
      {/* SIDEBAR */}
      <div className="desktop-sidebar" style={s.sidebar}>
        <div style={s.sidebarTitle} onClick={() => { setView({ type: "home" }); setEditingField(null); }}>Research Portal</div>
        <div style={{ padding: "0 16px 14px" }}>
          <input style={s.searchInput} placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={s.navTree}>
          {/* Principles */}
          <div style={{ ...s.sectorHdr, marginTop: 0, color: view.type === "principles" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "principles" }); setEditingField(null); }}>
            <span>Principles & Epiphanies</span>
          </div>

          {/* Agents */}
          <div>
            <div style={{ ...s.sectorHdr, marginTop: 0 }} onClick={() => setAgentsOpen(p => !p)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9, color: T_.textDim, transition: "transform .15s", transform: agentsOpen ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>
                <span>Agents</span>
              </div>
            </div>
            {agentsOpen && [
              { key: "watchlist", label: "Alerts" },
              { key: "qa", label: "Q&A" },
              { key: "research", label: "Research" },
              { key: "thesis", label: "Thesis Tracker" },
              { key: "notesIdeas", label: "Ideas" },
              { key: "dataVerification", label: "Data Verification" },
            ].map(t => (
              <div key={t.key} style={{ ...s.navCo, color: view.type === t.key + "Agent" ? T_.accent : T_.textMid }} onClick={() => { setView({ type: t.key + "Agent" }); setEditingField(null); }}>
                <span>{t.label}</span>
              </div>
            ))}
          </div>

          {/* Idea Tracker — removed */}

          {/* AI Research */}
          <div style={{ ...s.sectorHdr, color: view.type === "aidisruption" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "aidisruption" }); setEditingField(null); }}>
            <span>AI Research</span>
          </div>

          {/* Notes */}
          <div style={{ ...s.sectorHdr, color: view.type === "quickNotes" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "quickNotes" }); setEditingField(null); }}>
            <span>Notes</span>
          </div>

          {/* Industry Research */}
          <div>
            <div style={s.sectorHdr} onClick={() => setIndustryOpen(p => !p)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9, color: T_.textDim, transition: "transform .15s", transform: industryOpen ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>
                <span style={{ color: view.type === "industryResearch" ? T_.accent : T_.textDim }}>Industry Research</span>
              </div>
              <span style={s.badge}>7</span>
            </div>
            {industryOpen && (
              <>
                {[
                  { key: "ailabs", label: "AI Labs" },
                  { key: "ainative", label: "AI-Native" },
                  { key: "capex", label: "AI Capex" },
                  { key: "semicapex", label: "Semi Capex" },
                  { key: "compute", label: "Compute" },
                  { key: "chiproadmap", label: "GPU/ASIC" },
                  { key: "aiinfra", label: "AI Infra" },
                ].map(tab => {
                  const active = view.type === "industryResearch" && view.sub === tab.key;
                  return (
                    <div key={tab.key} style={{ ...s.navCo, ...(active ? s.navCoActive : {}), paddingLeft: 38 }} onClick={() => { setView({ type: "industryResearch", sub: tab.key }); setEditingField(null); }}>
                      <span>{tab.label}</span>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Equity Research */}
          <div>
            <div style={s.sectorHdr} onClick={() => setEquityOpen(p => !p)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9, color: T_.textDim, transition: "transform .15s", transform: equityOpen ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>
                <span onClick={e => { e.stopPropagation(); setView({ type: "equityResearch" }); setEditingField(null); }}>Equity Research</span>
              </div>
              {equities.length > 0 && <span style={s.badge}>{equities.length}</span>}
            </div>
            {equityOpen && (
              <>
                {equities.map(eq => {
                  const active = view.type === "equityDetail" && view.id === eq.id;
                  return (
                    <div key={eq.id} style={{ ...s.navCo, ...(active ? s.navCoActive : {}), paddingLeft: 38 }} onClick={() => { setView({ type: "equityDetail", id: eq.id }); setEditingField(null); }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{eq.name}</span>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Credit Research */}
          <div>
            <div style={s.sectorHdr} onClick={() => setCompaniesOpen(p => !p)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9, color: T_.textDim, transition: "transform .15s", transform: companiesOpen ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>
                <span>Credit Research</span>
              </div>
              <span style={s.badge}>{companies.filter(c => c.sector !== "sources" && c.sector !== "prompts").length}</span>
            </div>
            {companiesOpen && Object.entries(SECTORS).map(([sk, sec]) => {
              const cos = filteredCos(getCos(sk));
              const open = sidebarOpen[sk];
              const total = getCos(sk).length;
              return (
                <div key={sk}>
                  <div style={{ ...s.sectorHdr, paddingLeft: 34 }} onClick={() => sk === "sources" ? (() => { setView({ type: "company", id: "source_master_seed" }); setEditingField(null); })() : setSidebarOpen(p => ({ ...p, [sk]: !p[sk] }))}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {sk !== "sources" && <span style={{ fontSize: 9, color: T_.textDim, transition: "transform .15s", transform: open ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>}
                      <span onClick={e => { e.stopPropagation(); if (sk === "sources") { setView({ type: "company", id: "source_master_seed" }); } else { setView({ type: "sector", sector: sk }); } setEditingField(null); }}>{sec.label}</span>
                    </div>
                    {total > 0 && sk !== "sources" && <span style={s.badge}>{total}</span>}
                  </div>
                  {(open || search) && sk !== "sources" && cos.length > 0 && (
                    <>
                      {cos.map(c => {
                        const active = view.type === "company" && view.id === c.id;
                        const pr = c.priority || "";
                        return (
                          <div key={c.id} style={{ ...s.navCo, ...(active ? s.navCoActive : {}), paddingLeft: 52 }} onClick={() => { setView({ type: "company", id: c.id }); setEditingField(null); }}>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{c.name}</span>
                            {pr && <span style={{ ...s.prDot, background: pr === "High" ? T_.green : pr === "Medium" ? T_.amber : T_.textGhost }} />}
                          </div>
                        );
                      })}
                      <div style={{ ...s.navAdd, paddingLeft: 52 }} onClick={() => { setAdding(sk); setAddSub(Object.keys(sec.subs)[0]); }}>+ Add company</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Knowledge / Interests */}
          <div style={{ ...s.sectorHdr, color: view.type === "knowledge" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "knowledge" }); setEditingField(null); }}>
            <span>Knowledge / Interests</span>
          </div>

          {/* YL Research Wiki */}
          <div style={{ ...s.sectorHdr, color: view.type === "researchWiki" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "researchWiki" }); setEditingField(null); }}>
            <span>YL Research Wiki</span>
          </div>

          {/* Restructuring */}
          <div style={{ ...s.sectorHdr, color: view.type === "restructuring" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "restructuring" }); setEditingField(null); }}>
            <span>Restructuring</span>
          </div>

          {/* Prompts */}
          <div style={{ ...s.sectorHdr, color: view.type === "prompts" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "prompts" }); setEditingField(null); }}>
            <span>Prompts</span>
          </div>

          {/* Business Models */}
          <div style={{ ...s.sectorHdr, color: view.type === "businessModels" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "businessModels" }); setEditingField(null); }}>
            <span>Business Models</span>
          </div>

          {/* Financial Instruments */}
          <div style={{ ...s.sectorHdr, color: view.type === "creditInstruments" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "creditInstruments" }); setEditingField(null); }}>
            <span>Financial Instruments</span>
          </div>

          {/* Industry Primer */}
          <div style={{ ...s.sectorHdr, color: view.type === "primer" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "primer" }); setEditingField(null); }}>
            <span>Industry Primer</span>
          </div>

          {/* Sources */}
          <div style={{ ...s.sectorHdr, color: view.type === "sources" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "sources" }); setEditingField(null); }}>
            <span>Sources</span>
          </div>

          {/* Audit & Change Log */}
          <div style={{ ...s.sectorHdr, color: view.type === "auditLog" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "auditLog" }); setEditingField(null); }}>
            <span>Audit Log</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-content" style={s.main}>
        {adding && (
          <div style={s.modalOverlay}>
            <div style={s.modalBox}>
              <div style={{ fontSize: 14, fontWeight: 500, color: T_.accent, marginBottom: 16 }}>Add company to {SECTORS[adding]?.label}</div>
              <input ref={addRef} style={s.modalInput} placeholder="Company name" value={addName}
                onChange={e => setAddName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addCompanyHandler(); if (e.key === "Escape") { setAdding(null); setAddName(""); } }} />
              <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                {Object.entries(SECTORS[adding]?.subs || {}).map(([k, v]) => (
                  <span key={k} style={{ ...s.subPill, ...(addSub === k ? s.subPillActive : {}) }} onClick={() => setAddSub(k)}>{v}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                <button style={s.btnAccent} onClick={addCompanyHandler}>Add</button>
                <button style={s.btnGhost} onClick={() => { setAdding(null); setAddName(""); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* HOME / DASHBOARD */}
        {view.type === "home" && (
          <div style={{ ...s.page, maxWidth: "none" }}>
            <Dashboard companies={companies} setView={setView} />
          </div>
        )}

        {/* SECTOR */}
        {view.type === "sector" && SECTORS[view.sector] && (
          <div style={s.page}>
            <h1 style={s.pageTitle}>{SECTORS[view.sector].label}</h1>
            <p style={s.pageSub}>{getCos(view.sector).length} companies</p>
            {Object.entries(SECTORS[view.sector].subs).map(([subk, subLabel]) => {
              const cos = getCos(view.sector).filter(c => c.sub === subk);
              if (cos.length === 0) return null;
              return (
                <div key={subk} style={s.section}>
                  <div style={s.sectionHdr}><span>{subLabel}</span><span style={s.sectionDate}>{cos.length} companies</span></div>
                  {cos.map(c => {
                    const pr = c.priority || "";
                    return (
                      <div key={c.id} style={s.listRow} onClick={() => { setView({ type: "company", id: c.id }); setEditingField(null); }}>
                        <span style={{ fontSize: 14, color: T_.text, flex: 1 }}>{c.name}</span>
                        <span style={{ fontSize: 10, color: (fieldsMap[c.id]?.public_private?.text || "").startsWith("Public") ? T_.blue : T_.textGhost, opacity: 0.7 }}>{(fieldsMap[c.id]?.public_private?.text || "").startsWith("Public") ? "PUB" : "PVT"}</span>
                        {pr && <span style={{ ...s.prBadge, background: pr === "High" ? T_.greenBg : pr === "Medium" ? T_.amberBg : T_.grayBadge, color: pr === "High" ? T_.green : pr === "Medium" ? T_.amber : T_.grayBadgeText, borderColor: pr === "High" ? T_.greenBorder : pr === "Medium" ? T_.amberBorder : T_.textGhost }}>{pr}</span>}
                        <span style={{ color: T_.textGhost, fontSize: 14 }}>&rarr;</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {getCos(view.sector).length === 0 && (
              <div style={{ color: T_.textDim, fontSize: 14, padding: "24px 0", lineHeight: 1.7 }}>No companies added yet. Use "+ Add company" in the sidebar.</div>
            )}
          </div>
        )}

        {/* PRIMER */}
        {view.type === "primer" && <Primer initialTab={view.sub} />}

        {/* AI DISRUPTION */}
        {view.type === "aidisruption" && <AIDisruption companies={companies} initialTab={view.sub} />}

        {/* INDUSTRY RESEARCH */}
        {view.type === "industryResearch" && <IndustryResearch initialTab={view.sub} />}

        {/* RESEARCH AGENT */}
        {view.type === "researchAgent" && <ResearchAgentPage companies={companies} onSetPriority={setPriority} researchResults={researchResults} />}

        {/* THESIS AGENT */}
        {view.type === "thesisAgent" && <ThesisAgent companies={companies} fieldsMap={fieldsMap} sectorNotes={sectorNotes} />}

        {/* WATCHLIST AGENT */}
        {view.type === "watchlistAgent" && <WatchlistAgent />}

        {/* Q&A AGENT */}
        {view.type === "qaAgent" && <QAAgent />}

        {/* NOTES / IDEAS AGENT */}
        {view.type === "notesIdeasAgent" && <NotesIdeasAgent companies={companies} fieldsMap={fieldsMap} sectorNotes={sectorNotes} />}

        {/* DATA VERIFICATION AGENT */}
        {view.type === "dataVerificationAgent" && <DataVerificationAgent companies={companies} fieldsMap={fieldsMap} sectorNotes={sectorNotes} />}

        {/* EQUITY RESEARCH */}
        {view.type === "equityResearch" && (
          <div style={s.page}>
            <h1 style={s.pageTitle}>Equity Research</h1>
            <p style={s.pageSub}>Tracking {equities.length} companies.</p>
            {equities.map(eq => (
              <div key={eq.id} style={s.listRow} onClick={() => { setView({ type: "equityDetail", id: eq.id }); setEditingField(null); }}>
                <span style={{ fontSize: 14, color: T_.text, flex: 1 }}>{eq.name}</span>
                {eq.sub && <span style={{ fontSize: 11, color: T_.textGhost }}>{eq.sub}</span>}
                <span style={{ color: T_.textGhost, fontSize: 14 }}>&rarr;</span>
              </div>
            ))}
          </div>
        )}

        {/* EQUITY DETAIL */}
        {view.type === "equityDetail" && (() => {
          const eq = equities.find(e => e.id === view.id);
          if (!eq) return null;
          const notes = equityNotes[eq.id] || "";
          return (
            <div style={s.page}>
              <div style={s.breadcrumb}>
                <span onClick={() => { setView({ type: "equityResearch" }); setEditingField(null); }}>Equity Research</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <h1 style={s.pageTitle}>{eq.name}</h1>
                <button style={s.btnGhost} onClick={() => { setView({ type: "equityResearch" }); setEditingField(null); }}>&#8592; Back</button>
              </div>
              <div style={s.section}>
                <div style={s.sectionHdr}>Notes</div>
                <textarea
                  style={{ width: "100%", minHeight: 200, background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, color: T_.text, fontSize: 14, padding: 14, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif', resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.7 }}
                  placeholder="Research notes, investment thesis, key metrics..."
                  value={notes}
                  onChange={e => { const updated = { ...equityNotes, [eq.id]: e.target.value }; saveEquityNotes(updated); }}
                />
              </div>
            </div>
          );
        })()}

        {/* YL RESEARCH WIKI */}
        {view.type === "researchWiki" && (
          <div style={{ ...s.page, maxWidth: "none" }}>
            <KnowledgeBase />
          </div>
        )}

        {/* PRINCIPLES */}
        {view.type === "principles" && (
          <div style={{ ...s.page, maxWidth: "none" }}>
            <Principles />
          </div>
        )}

        {/* PROMPTS */}
        {view.type === "prompts" && (
          <div style={{ ...s.page, maxWidth: "none" }}>
            <Prompts />
          </div>
        )}

        {/* KNOWLEDGE / INTERESTS */}
        {view.type === "knowledge" && (
          <div style={{ ...s.page, maxWidth: "none" }}>
            <KnowledgeInterests />
          </div>
        )}

        {/* BUSINESS MODELS */}
        {view.type === "businessModels" && <BusinessModels initialTab={view.sub} />}

        {/* CREDIT INSTRUMENTS */}
        {view.type === "creditInstruments" && <CreditInstruments initialTab={view.sub} />}

        {/* RESTRUCTURING */}
        {view.type === "restructuring" && <Restructuring initialTab={view.sub} />}

        {/* MOBILE MORE MENU */}
        {view.type === "mobileMore" && (
          <div style={{ ...s.page, maxWidth: "none" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: T_.text, marginBottom: 20, fontFamily: FONT }}>All Sections</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { type: "home", label: "Dashboard", icon: "\u{2302}" },
                { type: null, label: "— Agents —", icon: "" },
                { type: "watchlistAgent", label: "Alerts", icon: "\u{1F514}" },
                { type: "qaAgent", label: "Q&A", icon: "\u{2753}" },
                { type: "researchAgent", label: "Research Agent", icon: "\u{1F50D}" },
                { type: "thesisAgent", label: "Thesis Tracker", icon: "\u{1F3AF}" },
                { type: "notesIdeasAgent", label: "Ideas Agent", icon: "\u{1F4A1}" },
                { type: "dataVerificationAgent", label: "Data Verification", icon: "\u{2705}" },
                { type: null, label: "— Trackers —", icon: "" },
                { type: "aidisruption", label: "AI Research", icon: "\u{1F916}" },
                { type: "industryResearch", label: "Industry Research", icon: "\u{1F3ED}" },
                { type: "quickNotes", label: "Notes", icon: "\u{1F4DD}" },
                { type: null, label: "— Research —", icon: "" },
                { type: "equityResearch", label: "Equity Research", icon: "\u{1F4C8}" },
                { type: null, label: "— Credit Research —", icon: "" },
                ...Object.entries(SECTORS).filter(([sk]) => sk !== "sources").map(([sk, sec]) => ({
                  type: "sector", sector: sk, label: sec.label, icon: "\u{1F4C1}"
                })),
                { type: null, label: "— Reference —", icon: "" },
                { type: "knowledge", label: "Knowledge / Interests", icon: "\u{1F4D6}" },
                { type: "researchWiki", label: "YL Research Wiki", icon: "\u{1F4DA}" },
                { type: "businessModels", label: "Business Models", icon: "\u{1F4CA}" },
                { type: "creditInstruments", label: "Financial Instruments", icon: "\u{1F4B0}" },
                { type: "restructuring", label: "Restructuring", icon: "\u{1F3D7}" },
                { type: "primer", label: "Industry Primer", icon: "\u{1F4D3}" },
                { type: "sources", label: "Sources", icon: "\u{1F517}" },
                { type: "auditLog", label: "Audit Log", icon: "\u{1F4CB}" },
              ].map((item, idx) => (
                item.type === null ? (
                  <div key={idx} style={{ fontSize: 11, fontWeight: 600, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", padding: "14px 18px 4px", marginTop: idx > 0 ? 8 : 0 }}>{item.label.replace(/—/g, "").trim()}</div>
                ) :
                <div key={item.type + (item.sector || "") + idx} onClick={() => {
                  if (item.sector) { setView({ type: "sector", sector: item.sector }); }
                  else { setView({ type: item.type }); }
                  setEditingField(null);
                }} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                  background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.border}`, cursor: "pointer",
                }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: T_.text }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUICK NOTES */}
        {view.type === "quickNotes" && <QuickNotes />}

        {/* SOURCES */}
        {view.type === "sources" && <Sources />}

        {/* AUDIT LOG */}
        {view.type === "auditLog" && <AuditLog companies={companies} fieldsMap={fieldsMap} notesMap={notesMap} newsCache={newsCache} sectorNotes={sectorNotes} />}

        {/* IDEA TRACKER — removed */}

        {/* COMPANY */}
        {view.type === "company" && cur && (
          <div style={{ ...s.page, maxWidth: "none" }}>
            <div style={s.breadcrumb}>
              <span onClick={() => { setView((cur.sector === "sources") ? { type: "home" } : { type: "sector", sector: cur.sector }); setEditingField(null); }}>{SECTORS[cur.sector]?.label}</span>
              {cur.sector !== "sources" && <>
                <span style={{ color: T_.textGhost }}>&rsaquo;</span>
                <span onClick={() => { setView({ type: "sector", sector: cur.sector }); setEditingField(null); }}>{SECTORS[cur.sector]?.subs[cur.sub]}</span>
              </>}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <h1 style={s.pageTitle}>{cur.name}</h1>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button style={s.btnGhost} onClick={() => { setView((cur.sector === "sources") ? { type: "home" } : { type: "sector", sector: cur.sector }); setEditingField(null); setEditingSector(false); }}>&#8592; Back</button>
              </div>
            </div>
            {cur.sector !== "sources" && (
              <div style={{ fontSize: 14, color: T_.textDim, marginBottom: 24 }}>
                {!editingSector ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ cursor: "pointer" }} onClick={() => setEditingSector(true)}>
                      {SECTORS[cur.sector]?.subs[cur.sub] || cur.sub} &middot; {SECTORS[cur.sector]?.label || cur.sector}
                      <span style={{ fontSize: 12, color: T_.textGhost, marginLeft: 8 }}>&#9998;</span>
                    </span>
                    <span style={{
                      fontSize: 11, padding: "2px 10px", borderRadius: 4, cursor: "pointer",
                      background: (curFields?.public_private?.text || "").startsWith("Public") ? "rgba(112,176,250,0.12)" : "rgba(138,153,171,0.12)",
                      color: (curFields?.public_private?.text || "").startsWith("Public") ? T_.blue : T_.textGhost,
                      border: `1px solid ${(curFields?.public_private?.text || "").startsWith("Public") ? "rgba(112,176,250,0.3)" : T_.border}`,
                    }} onClick={() => {
                      const cur_ = curFields?.public_private?.text || "Private";
                      const newVal = cur_.startsWith("Public") ? "Private" : "Public";
                      updateField(cur.id, "public_private", newVal);
                    }}>{curFields?.public_private?.text || "Private"}</span>
                  </span>
                ) : (() => {
                  const activeSector = pendingSector || cur.sector;
                  return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 12, color: T_.textGhost }}>Sector</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {Object.entries(SECTORS).filter(([sk]) => sk !== "prompts" && sk !== "sources").map(([sk, sec]) => (
                        <span key={sk} style={{ ...s.subPill, ...(activeSector === sk ? s.subPillActive : {}) }}
                          onClick={() => setPendingSector(sk)}>{sec.label}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: T_.textGhost }}>Sub-sector</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {Object.entries(SECTORS[activeSector]?.subs || {}).map(([sk, sv]) => (
                        <span key={sk} style={{ ...s.subPill, ...(activeSector === cur.sector && cur.sub === sk ? s.subPillActive : {}) }}
                          onClick={() => { changeSector(cur.id, activeSector, sk); setEditingSector(false); setPendingSector(null); }}>{sv}</span>
                      ))}
                    </div>
                    <button style={{ ...s.btnSmall, alignSelf: "flex-start" }} onClick={() => { setEditingSector(false); setPendingSector(null); }}>Cancel</button>
                  </div>
                  );
                })()}
              </div>
            )}

            {/* Research Agent Priority */}
            {cur.sector !== "sources" && (
              <div style={{ marginBottom: 32 }}>
                <span style={{ fontSize: 12, color: T_.textGhost, display: "block", marginBottom: 8 }}>Research Agent Priority</span>
                <div style={{ display: "flex", gap: 8 }}>
                {PRIORITIES.map(pr => (
                  <span key={pr} style={{
                    ...s.prPill,
                    ...(curPriority === pr ? {
                      background: pr === "High" ? T_.greenBg : pr === "Medium" ? T_.amberBg : T_.grayBadge,
                      color: pr === "High" ? T_.green : pr === "Medium" ? T_.amber : T_.grayBadgeText,
                      borderColor: pr === "High" ? T_.greenBorder : pr === "Medium" ? T_.amberBorder : T_.textGhost,
                    } : {})
                  }} onClick={() => setPriority(cur.id, pr)}>{pr}</span>
                ))}
                </div>
              </div>
            )}

            {/* Tract Capital Review */}
            {cur.id === "tractcapital_seed" && <TractCapitalReview curNews={curNews} newsLoading={!!newsLoading[cur.id]} refreshNews={() => refreshNews(cur.id)} companyId={cur.id} companyName={cur.name} />}

            {/* Recent Updates */}
            {cur.sector !== "sources" && !["tractcapital_seed"].includes(cur.id) && (
              <div style={s.section}>
                <div style={s.sectionHdr}>
                  <span>Recent updates</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {curNews?.date && <span style={s.sectionDate}>Fetched {fmtShort(curNews.date)}</span>}
                    <button style={s.btnSmall} onClick={() => refreshNews(cur.id)} disabled={newsLoading[cur.id]}>
                      {newsLoading[cur.id] ? "Fetching..." : "Refresh news"}
                    </button>
                  </div>
                </div>
                <div style={s.newsScroll}>
                  {newsLoading[cur.id] && !curNews && (
                    <div style={{ color: T_.textDim, fontSize: 14, padding: "20px 0", fontStyle: "italic", lineHeight: 1.7 }}>Searching for recent news about {cur.name}...</div>
                  )}
                  {curNews && curNews.items.length === 0 && (
                    <div style={{ color: T_.textDim, fontSize: 14, padding: "16px 0", lineHeight: 1.7 }}>No recent news found. Click "Refresh news" to search again.</div>
                  )}
                  {curNews && [...curNews.items].sort((a, b) => {
                    try { return new Date(b.date) - new Date(a.date); } catch { return 0; }
                  }).map((item, i) => (
                    <div key={i} style={s.newsItem}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                        <div style={{ fontSize: 14, color: T_.text, fontWeight: 500, lineHeight: 1.6, flex: 1 }}>{item.headline}</div>
                        <span style={{ fontSize: 12, color: T_.textGhost, flexShrink: 0, whiteSpace: "nowrap", paddingTop: 2 }}>{item.date}</span>
                      </div>
                      {item.summary && <div style={{ fontSize: 14, color: T_.textMid, lineHeight: 1.7, marginTop: 6 }}>{item.summary}</div>}
                      {item.source && <div style={{ fontSize: 12, color: T_.textGhost, marginTop: 4 }}>{item.source}</div>}
                    </div>
                  ))}
                  {!curNews && !newsLoading[cur.id] && (
                    <div style={{ color: T_.textDim, fontSize: 14, padding: "16px 0", lineHeight: 1.7 }}>Click "Refresh news" to pull the latest updates about {cur.name}.</div>
                  )}
                </div>
              </div>
            )}

            {/* Research Notes — hidden for companies with dedicated review tabs */}
            {cur.sector !== "sources" && !["tractcapital_seed"].includes(cur.id) && (
              <div style={s.section}>
                <div style={s.sectionHdr}>
                  <span>Research notes</span>
                  <span style={s.sectionDate}>{(curNotes || []).length} entries</span>
                </div>
                <NoteInput onAdd={t => addNote(cur.id, t)} />
                {(curNotes || []).length === 0 && (
                  <div style={{ color: T_.textDim, fontSize: 14, padding: "16px 0", lineHeight: 1.7 }}>No notes yet. Add your first research note above.</div>
                )}
                {(curNotes || []).map(n => (
                  <div key={n.id} style={s.noteEntry}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
                      <div style={{ fontSize: 14, color: T_.text, lineHeight: 1.8, flex: 1, whiteSpace: "pre-wrap" }}>{n.text}</div>
                      <span style={{ fontSize: 14, color: T_.textGhost, cursor: "pointer", padding: "0 6px", flexShrink: 0, lineHeight: 1 }} onClick={() => delNote(cur.id, n.id)}>&times;</span>
                    </div>
                    <div style={{ fontSize: 12, color: T_.textGhost, marginTop: 8 }}>{fmt(n.date)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Moat vs AI Scoring — hidden for companies with dedicated review tabs */}
            {cur.sector !== "sources" && !["tractcapital_seed"].includes(cur.id) && (() => {
              const MOAT_TIERS = [
                { label: "T1 — Structural (3x)", weight: 3, color: "#34d673", moats: [
                  { key: "data", name: "Proprietary Data" },
                  { key: "switching", name: "Switching Cost" },
                ]},
                { label: "T2 — Strong (2x)", weight: 2, color: "#F59E0B", moats: [
                  { key: "regulatory", name: "Regulatory & Compliance" },
                  { key: "ecosystem", name: "Ecosystem & Integration" },
                  { key: "security", name: "Security" },
                ]},
                { label: "T3 — Temporal (1x)", weight: 1, color: T_.textGhost, moats: [
                  { key: "contracts", name: "Long-term Contracts" },
                  { key: "brand", name: "Brand & Trust" },
                  { key: "infra", name: "Infrastructure Support" },
                ]},
              ];
              const moats = cur.moats || {};
              const moatEnabled = moats._enabled !== false;
              const scoreBg = (v) => ({ 1: "#EF444433", 2: "#F59E0B33", 3: "#34d67333" }[v] || "transparent");
              const scoreCol = (v) => ({ 1: "#EF4444", 2: "#F59E0B", 3: "#34d673" }[v] || T_.textGhost);
              const scoreLabel = { 1: "Weak", 2: "Med", 3: "Strong" };
              const wTotal = MOAT_TIERS.reduce((s, t) => s + t.moats.reduce((s2, m) => s2 + (moats[m.key] || 0) * t.weight, 0), 0);
              const maxScore = 45;
              const totalColor = wTotal >= 33 ? "#34d673" : wTotal >= 21 ? "#F59E0B" : wTotal > 0 ? "#EF4444" : T_.textGhost;
              const setMoat = (key, val) => {
                const next = { ...moats, [key]: val };
                delete next.physical;
                const idx = companies.findIndex(c => c.id === cur.id);
                if (idx >= 0) {
                  const updated = [...companies];
                  updated[idx] = { ...updated[idx], moats: next };
                  setCompanies(updated);
                }
                updateCompanyMoats(cur.id, next);
              };
              const toggleMoat = () => {
                const next = { ...moats, _enabled: !moatEnabled };
                const idx = companies.findIndex(c => c.id === cur.id);
                if (idx >= 0) {
                  const updated = [...companies];
                  updated[idx] = { ...updated[idx], moats: next };
                  setCompanies(updated);
                }
                updateCompanyMoats(cur.id, next);
              };
              return (
                <div style={s.section}>
                  <div style={s.sectionHdr}>
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      Moat vs AI
                      <span onClick={toggleMoat} style={{
                        display: "inline-flex", alignItems: "center", width: 36, height: 18, borderRadius: 9, cursor: "pointer",
                        background: moatEnabled ? T_.green : T_.border, padding: 2, transition: "background 0.2s",
                      }}>
                        <span style={{
                          width: 14, height: 14, borderRadius: 7, background: "#fff",
                          transform: moatEnabled ? "translateX(18px)" : "translateX(0)", transition: "transform 0.2s",
                        }} />
                      </span>
                    </span>
                    {moatEnabled && wTotal > 0 && <span style={{ fontSize: 13, fontWeight: 700, color: totalColor }}>{wTotal}/{maxScore}</span>}
                    {!moatEnabled && <span style={{ fontSize: 11, color: T_.textGhost, fontStyle: "italic" }}>Excluded from scoring</span>}
                  </div>
                  {moatEnabled && MOAT_TIERS.map(tier => (
                    <div key={tier.label} style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: tier.color, textTransform: "uppercase", marginBottom: 6, letterSpacing: 0.5 }}>{tier.label}</div>
                      <div style={{ display: "grid", gridTemplateColumns: tier.moats.length === 2 ? "1fr 1fr" : "1fr 1fr 1fr", gap: 6 }}>
                        {tier.moats.map(m => {
                          const v = moats[m.key] || 0;
                          const wPts = v * tier.weight;
                          return (
                            <div key={m.key} style={{ background: T_.bgInput, borderRadius: 6, padding: "8px 10px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                <span style={{ fontSize: 10, color: T_.textGhost, fontWeight: 600, textTransform: "uppercase" }}>{m.name}</span>
                                {v > 0 && <span style={{ fontSize: 9, color: scoreCol(v), fontWeight: 700 }}>+{wPts}</span>}
                              </div>
                              <div style={{ display: "flex", gap: 4 }}>
                                {[1, 2, 3].map(sv => (
                                  <button key={sv} onClick={() => setMoat(m.key, v === sv ? 0 : sv)} style={{
                                    flex: 1, padding: "3px 0", fontSize: 10, fontWeight: 600, borderRadius: 4, cursor: "pointer",
                                    border: v === sv ? `1px solid ${scoreCol(sv)}` : `1px solid ${T_.border}`,
                                    background: v === sv ? scoreBg(sv) : "transparent",
                                    color: v === sv ? scoreCol(sv) : T_.textGhost,
                                  }}>{scoreLabel[sv]}</button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Structured Fields — hidden for companies with dedicated review tabs */}
            {!["tractcapital_seed"].includes(cur.id) && (cur.sector === "sources" ? SOURCE_FIELDS : FIELDS).map(f => {
              const fd = curFields?.[f.key];
              const isEditing = editingField === f.key;
              const hasContent = fd?.text?.trim();
              return (
                <div key={f.key} style={s.section}>
                  <div style={s.sectionHdr}>
                    <span>{f.label}</span>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      {fd?.date && fd.date && <span style={s.sectionDate}>{fmtShort(fd.date)}</span>}
                      {hasContent && !isEditing && <button style={s.btnSmall} onClick={() => setEditingField(f.key)}>Edit</button>}
                    </div>
                  </div>
                  {(isEditing || !hasContent) ? (
                    <div>
                      <textarea style={s.textarea} rows={6}
                        value={fd?.text || ""}
                        onChange={e => updateField(cur.id, f.key, e.target.value)}
                        placeholder={f.ph}
                        autoFocus={isEditing} />
                      {isEditing && <button style={{ ...s.btnSmall, marginTop: 10 }} onClick={() => setEditingField(null)}>Done</button>}
                    </div>
                  ) : (
                    <div style={s.proseBody} onClick={() => setEditingField(f.key)}>{fd.text}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="mobile-bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: 64,
        background: T_.bgSidebar, borderTop: `1px solid ${T_.border}`,
        display: "none", justifyContent: "space-around", alignItems: "center",
        zIndex: 100, paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {[
          { type: "home", label: "Home", icon: "\u2302" },
          { type: "researchWiki", label: "Wiki", icon: "\u{1F4DA}" },
          { type: "quickNotes", label: "Notes", icon: "\u{1F4DD}" },
          { type: "mobileMore", label: "More", icon: "\u2261" },
        ].map(tab => {
          const isActive = tab.type === "mobileMore"
            ? !["home", "researchWiki", "quickNotes"].includes(view.type)
            : view.type === tab.type;
          return (
            <div key={tab.type} onClick={() => {
              if (tab.type === "mobileMore") {
                setView(prev => prev.type === "mobileMore" ? prev : { type: "mobileMore" });
              } else {
                setView({ type: tab.type }); setEditingField(null);
              }
            }} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              cursor: "pointer", padding: "6px 12px", borderRadius: 8,
              color: isActive ? T_.accent : T_.textGhost,
            }}>
              <span style={{ fontSize: 20 }}>{tab.icon}</span>
              <span style={{ fontSize: 9, fontWeight: isActive ? 600 : 400 }}>{tab.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NoteInput({ onAdd }) {
  const [t, setT] = useState("");
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <input style={s.noteInput} placeholder="Add a research note..." value={t}
        onChange={e => setT(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onAdd(t); setT(""); } }} />
      <button style={s.btnAccent} onClick={() => { onAdd(t); setT(""); }}>Add</button>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const s = {
  wrap: { display: "flex", minHeight: "100vh", background: T_.bg, fontFamily: FONT, fontSize: 14, color: T_.text },
  sidebar: { width: 230, background: T_.bgSidebar, borderRight: `1px solid ${T_.border}`, display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh", position: "sticky", top: 0, overflowY: "auto" },
  sidebarTitle: { padding: "22px 22px 18px", fontSize: 15, fontWeight: 500, color: T_.text, cursor: "pointer", fontFamily: FONT },
  searchInput: { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 7, padding: "8px 12px", fontSize: 13, color: T_.text, outline: "none", fontFamily: FONT, boxSizing: "border-box" },
  navTree: { flex: 1, overflowY: "auto", padding: "6px 0" },
  sectorHdr: { padding: "9px 18px", fontSize: 13, fontWeight: 500, color: T_.textDim, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, userSelect: "none", fontFamily: FONT },
  badge: { fontSize: 11, color: T_.textGhost, background: T_.bgPanel, padding: "2px 8px", borderRadius: 4, fontFamily: FONT },
  navCo: { padding: "7px 18px 7px 38px", fontSize: 13, color: T_.textMid, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, borderLeft: "2px solid transparent", transition: "all .1s", lineHeight: 1.5, fontFamily: FONT },
  navCoActive: { background: "rgba(245,158,11,0.08)", color: T_.accent, borderLeftColor: T_.accent },
  prDot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  navAdd: { padding: "6px 18px 6px 38px", fontSize: 12, color: T_.textGhost, cursor: "pointer", fontFamily: FONT },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", background: T_.bg },
  page: { flex: 1, padding: "36px 52px", overflowY: "auto", maxWidth: 1020 },
  pageTitle: { fontSize: 24, fontWeight: 500, color: T_.text, margin: "0 0 6px", fontFamily: FONT },
  pageSub: { fontSize: 14, color: T_.textDim, marginBottom: 28, lineHeight: 1.7, fontFamily: FONT },
  breadcrumb: { fontSize: 13, color: T_.textGhost, marginBottom: 12, display: "flex", gap: 8, alignItems: "center", cursor: "pointer", fontFamily: FONT },
  section: { marginBottom: 36 },
  sectionHdr: { fontSize: 14, fontWeight: 500, color: T_.textDim, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${T_.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: FONT },
  sectionDate: { fontSize: 12, fontWeight: 400, color: T_.textGhost, fontFamily: FONT },
  proseBody: { fontSize: 14, lineHeight: 1.9, color: T_.text, cursor: "pointer", whiteSpace: "pre-wrap", padding: "6px 0", fontFamily: FONT },
  textarea: { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, padding: "14px 16px", fontSize: 14, color: T_.text, outline: "none", fontFamily: FONT, resize: "vertical", minHeight: 110, lineHeight: 1.8, boxSizing: "border-box" },
  noteInput: { flex: 1, background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, padding: "11px 16px", fontSize: 14, color: T_.text, outline: "none", fontFamily: FONT, boxSizing: "border-box" },
  noteEntry: { padding: "18px 0", borderBottom: `1px solid ${T_.borderLight}` },
  newsScroll: { maxHeight: 400, overflowY: "auto", paddingRight: 8, scrollbarWidth: "thin", scrollbarColor: `${T_.border} transparent` },
  newsItem: { padding: "14px 0", borderBottom: `1px solid ${T_.borderLight}` },
  listRow: { display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: `1px solid ${T_.borderLight}`, cursor: "pointer" },
  statCard: { background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: "16px 18px", cursor: "pointer" },
  prPill: { padding: "7px 18px", fontSize: 13, borderRadius: 7, cursor: "pointer", border: `1px solid ${T_.border}`, color: T_.textGhost, transition: "all .12s", background: "transparent", fontFamily: FONT },
  prBadge: { fontSize: 12, padding: "4px 12px", borderRadius: 6, border: "1px solid", fontFamily: FONT },
  btnAccent: { padding: "9px 20px", fontSize: 13, fontWeight: 500, border: "none", background: T_.accent, color: T_.bg, borderRadius: 7, cursor: "pointer", fontFamily: FONT },
  btnGhost: { padding: "7px 16px", fontSize: 13, border: `1px solid ${T_.border}`, background: "transparent", color: T_.textMid, borderRadius: 7, cursor: "pointer", fontFamily: FONT },
  btnSmall: { padding: "4px 12px", fontSize: 12, border: `1px solid ${T_.border}`, background: "transparent", color: T_.textDim, borderRadius: 5, cursor: "pointer", fontFamily: FONT },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 },
  modalBox: { background: T_.bgSidebar, border: `1px solid ${T_.border}`, borderRadius: 12, padding: "26px 30px", width: 420, maxWidth: "90%", fontFamily: FONT },
  modalInput: { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 7, padding: "10px 14px", fontSize: 14, color: T_.text, outline: "none", fontFamily: FONT, boxSizing: "border-box" },
  subPill: { padding: "5px 14px", fontSize: 12, color: T_.textDim, border: `1px solid ${T_.border}`, borderRadius: 6, cursor: "pointer", fontFamily: FONT },
  subPillActive: { color: T_.accent, borderColor: T_.accent, background: "rgba(245,158,11,0.1)" },
};
