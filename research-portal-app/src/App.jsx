import { useState, useEffect, useCallback, useRef, Suspense, lazy } from "react";
const Primer = lazy(() => import("./Primer"));
const ProductPrimer = lazy(() => import("./ProductPrimer"));
const AIDisruption = lazy(() => import("./AIDisruption"));
import NotesIdeasAgent from "./NotesIdeasAgent";
import AgentsTools from "./AgentsTools";
const BusinessModels = lazy(() => import("./BusinessModels"));
const Accounting = lazy(() => import("./Accounting"));
const CreditInstruments = lazy(() => import("./CreditInstruments"));
import AuditLog from "./AuditLog";
import KnowledgeBase from "./KnowledgeBase";
import Prompts from "./Prompts";
import KnowledgeInterests from "./KnowledgeInterests";
import Sources from "./Sources";
const Restructuring = lazy(() => import("./Restructuring"));
const CaseStudies = lazy(() => import("./CaseStudies"));
import Principles from "./Principles";
import ApiDirectory from "./ApiDirectory";
import Dashboard from "./Dashboard";
import QuickNotes from "./QuickNotes";
import TractCapitalReview from "./TractCapitalReview";
import CoreweaveReview from "./CoreweaveReview";
import AppliedDigitalReview from "./AppliedDigitalReview";
import CipherDigitalReview from "./CipherDigitalReview";
import TerawulfReview from "./TerawulfReview";
import MicronReview from "./MicronReview";
import OracleReview from "./OracleReview";
import MetaReview from "./MetaReview";
import GenericReview from "./GenericReview";
const IndustryResearch = lazy(() => import("./IndustryResearch"));
import {
  loadCompanies, insertCompany, updateCompanyPriority, updateCompanySector,
  loadAllFields, upsertField,
} from "./lib/db";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";

// ─── Helpers ──────────────────────────────────────────
function useAutoSave(fn, ms = 700) {
  const t = useRef(null);
  return useCallback((...a) => { clearTimeout(t.current); t.current = setTimeout(() => fn(...a), ms); }, [fn, ms]);
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function ts() { return new Date().toISOString(); }
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
  // "financials" text field intentionally omitted — live data is shown via the
  // Financials tab (api/financials.mjs). Manual snapshots go stale.
];

const SOURCE_FIELDS = [
  { key: "overview", label: "Sources", ph: "Running list of sources used across company research briefs..." },
];

const PRIORITIES = ["High", "Medium", "Low"];

const MOBILE_MORE_ITEMS = [
  { type: "home", label: "Dashboard", icon: "\u{2302}" },
  { type: null, label: "— Agents —", icon: "" },
  { type: "dataVerificationAgent", label: "Agents / Tools", icon: "\u{1F6E0}" },
  { type: "notesIdeasAgent", label: "Ideas Agent", icon: "\u{1F4A1}" },
  { type: null, label: "— Trackers —", icon: "" },
  { type: "aidisruption", label: "AI Research", icon: "\u{1F916}" },
  { type: "industryResearch", label: "Industry Research", icon: "\u{1F3ED}" },
  { type: "quickNotes", label: "Notes", icon: "\u{1F4DD}" },
  { type: null, label: "— Research —", icon: "" },
  { type: "equityResearch", label: "Primary Research", icon: "\u{1F4C8}" },
  { type: null, label: "— Credit Research —", icon: "" },
  ...Object.entries(SECTORS).filter(([sk]) => sk !== "sources").map(([sk, sec]) => ({
    type: "sector", sector: sk, label: sec.label, icon: "\u{1F4C1}"
  })),
  { type: null, label: "— Reference —", icon: "" },
  { type: "knowledge", label: "Knowledge / Interests", icon: "\u{1F4D6}" },
  { type: "researchWiki", label: "Research Wiki", icon: "\u{1F4DA}" },
  { type: "businessModels", label: "Business Models", icon: "\u{1F4CA}" },
  { type: "accounting", label: "Accounting", icon: "\u{1F4D1}" },
  { type: "creditInstruments", label: "Financial Instruments", icon: "\u{1F4B0}" },
  { type: "restructuring", label: "Restructuring", icon: "\u{1F3D7}" },
  { type: "caseStudies", label: "Case Studies", icon: "\u{1F4DA}" },
  { type: "primer", label: "Industry Primer", icon: "\u{1F4D3}" },
  { type: "sources", label: "Sources", icon: "\u{1F517}" },
  { type: "auditLog", label: "Audit Log", icon: "\u{1F4CB}" },
];

// ─── App ──────────────────────────────────────────────
// Auth gate via Supabase Auth. The user must exist in Supabase Auth (created
// once in the Supabase dashboard) and the RLS policies must require auth.uid()
// — otherwise this is just a UI gate, not actual security.
export default function App() {
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState(() => localStorage.getItem("rp_last_email") || "");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [authBusy, setAuthBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn() {
    if (!email || !password) return;
    setAuthBusy(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthBusy(false);
    if (error) {
      setAuthError(error.message);
    } else {
      localStorage.setItem("rp_last_email", email);
      setPassword("");
    }
  }

  if (!authChecked) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: T_.bg, color: T_.textDim, fontSize: 13 }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: T_.bg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <div style={{ background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 12, padding: 40, width: 340 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: T_.text, marginBottom: 6, textAlign: "center" }}>Research Portal</div>
          <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 24, textAlign: "center" }}>Sign in to continue</div>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setAuthError(null); }}
            placeholder="Email"
            autoFocus={!email}
            style={{
              width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 6,
              padding: "10px 14px", color: T_.text, fontSize: 14, outline: "none", boxSizing: "border-box",
              fontFamily: "inherit", marginBottom: 10,
            }}
          />
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setAuthError(null); }}
            onKeyDown={e => { if (e.key === "Enter") signIn(); }}
            placeholder="Password"
            autoFocus={!!email}
            style={{
              width: "100%", background: T_.bgInput, border: `1px solid ${authError ? T_.red : T_.border}`, borderRadius: 6,
              padding: "10px 14px", color: T_.text, fontSize: 14, outline: "none", boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
          {authError && <div style={{ color: T_.red, fontSize: 12, marginTop: 8 }}>{authError}</div>}
          <button
            onClick={signIn}
            disabled={authBusy || !email || !password}
            style={{
              marginTop: 16, width: "100%", background: T_.accent, color: "#000", border: "none", borderRadius: 6,
              padding: "10px", fontSize: 14, fontWeight: 600, cursor: authBusy ? "default" : "pointer", fontFamily: "inherit",
              opacity: authBusy ? 0.6 : 1,
            }}
          >
            {authBusy ? "Signing in..." : "Sign in"}
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
  const [fieldsMap, setFieldsMap] = useState({});
  const [view, setView] = useState({ type: "home" });
  const [sidebarOpen, setSidebarOpen] = useState(() => Object.fromEntries(Object.keys(SECTORS).map(k => [k, false])));
  const [companiesOpen, setCompaniesOpen] = useState(false);
  const [equityOpen, setEquityOpen] = useState(false);
  const [publicCosOpen, setPublicCosOpen] = useState(false);
  const [publicSidebarOpen, setPublicSidebarOpen] = useState(() => Object.fromEntries(Object.keys(SECTORS).map(k => [k, false])));
  const [industryOpen, setIndustryOpen] = useState(false);
  const [equities] = useState(() => {
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
      { id: "eq_orcl", name: "Oracle", sub: "" },
      { id: "eq_meta", name: "Meta", sub: "" },
    ];
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem("research_portal_equities") || "[]"); } catch { /* fall through to SEED */ }
    if (saved.length === 0) {
      localStorage.setItem("research_portal_equities", JSON.stringify(SEED));
      return SEED;
    }
    const ids = new Set(saved.map(e => e.id));
    const missing = SEED.filter(s => !ids.has(s.id));
    if (missing.length > 0) {
      const merged = [...saved, ...missing];
      localStorage.setItem("research_portal_equities", JSON.stringify(merged));
      return merged;
    }
    return saved;
  });
  const [adding, setAdding] = useState(null);
  const [addName, setAddName] = useState("");
  const [addSub, setAddSub] = useState("");
  const [search, setSearch] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [editingSector, setEditingSector] = useState(false);
  const [pendingSector, setPendingSector] = useState(null);
  const addRef = useRef(null);

  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [cos, fields] = await Promise.all([loadCompanies(), loadAllFields()]);
        setCompanies(cos);
        setFieldsMap(fields);
        setReady(true);
      } catch (err) {
        console.error('Failed to load data:', err);
        setLoadError(err.message || 'Failed to connect to database');
      }
    })();
  }, []);

  const debouncedFieldSave = useAutoSave((companyId, fieldKey, text) => {
    upsertField(companyId, fieldKey, text);
  });

  async function addCompanyHandler() {
    if (!addName.trim() || !adding || !addSub) return;
    const id = uid();
    await insertCompany({ id, name: addName.trim(), sector: adding, sub: addSub });
    const newCo = { id, name: addName.trim(), sector: adding, sub: addSub, priority: '' };
    setCompanies(p => [...p, newCo]);
    setAdding(null); setAddName(""); setAddSub("");
    setView({ type: "company", id });
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

  const getCos = (sector) => companies.filter(c => c.sector === sector).sort((a, b) => a.name.localeCompare(b.name));
  const isPublicCo = (c) => (fieldsMap[c.id]?.public_private?.text || "").startsWith("Public");
  const getPublicCos = (sector) => getCos(sector).filter(c => isPublicCo(c));
  const getPrivateCos = (sector) => getCos(sector).filter(c => !isPublicCo(c));
  const filteredCos = (list) => search ? list.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : list;

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
  const curPriority = cur?.priority || "";

  return (
    <div style={s.wrap}>
      {/* SIDEBAR */}
      <div className="desktop-sidebar" style={s.sidebar}>
        <div style={s.sidebarTitle} onClick={() => { setView({ type: "home" }); setEditingField(null); }}>Research Portal</div>
        <div style={{ padding: "0 16px 14px", position: "relative" }}>
          <input style={s.searchInput} placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)} />
          {search.trim().length > 0 && (() => {
            const q = search.toLowerCase();
            const matches = [
              ...companies.filter(c => c.sector !== "sources" && c.name.toLowerCase().includes(q)),
              ...equities.filter(eq => eq.name.toLowerCase().includes(q)).map(eq => ({ ...eq, _isEquity: true })),
            ].slice(0, 12);
            if (matches.length === 0) return null;
            return (
              <div style={{ position: "absolute", top: "100%", left: 16, right: 16, background: T_.bgSidebar, border: `1px solid ${T_.border}`, borderRadius: 8, zIndex: 200, maxHeight: 320, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                {matches.map(c => (
                  <div key={c.id} style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${T_.borderLight}`, fontSize: 13, color: T_.text, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    onMouseEnter={e => e.currentTarget.style.background = T_.bgInput}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    onClick={() => {
                      if (c._isEquity) { setView({ type: "equityDetail", id: c.id }); }
                      else { setView({ type: "company", id: c.id }); }
                      setSearch("");
                      setEditingField(null);
                    }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                    <span style={{ fontSize: 10, color: T_.textGhost, flexShrink: 0, marginLeft: 8 }}>{c._isEquity ? "Primary" : (SECTORS[c.sector]?.label || c.sector)}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
        <div style={s.navTree}>
          {/* Principles */}
          <div style={{ ...s.sectorHdr, marginTop: 0, color: view.type === "principles" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "principles" }); setEditingField(null); }}>
            <span>Principles & Epiphanies</span>
          </div>

          {/* Agents / Tools */}
          <div style={{ ...s.sectorHdr, marginTop: 0, color: view.type === "dataVerificationAgent" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "dataVerificationAgent" }); setEditingField(null); }}>
            <span>Agents / Tools</span>
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
              <span style={s.badge}>10</span>
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
                  { key: "cpuroadmap", label: "CPU" },
                  { key: "neoclouds", label: "Neoclouds" },
                  { key: "shellpower", label: "Shell + Power" },
                  { key: "foundry", label: "Foundry" },
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

          {/* Primary Research */}
          <div>
            <div style={s.sectorHdr} onClick={() => setEquityOpen(p => !p)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9, color: T_.textDim, transition: "transform .15s", transform: equityOpen ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>
                <span>Primary Research</span>
              </div>
              {equities.length > 0 && <span style={s.badge}>{equities.length}</span>}
            </div>
            {equityOpen && (
              <>
                {[...equities].sort((a, b) => a.name.localeCompare(b.name)).map(eq => {
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

          {/* Public Company Research */}
          <div>
            <div style={s.sectorHdr} onClick={() => setPublicCosOpen(p => !p)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9, color: T_.textDim, transition: "transform .15s", transform: publicCosOpen ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>
                <span>Public Company Research</span>
              </div>
              <span style={s.badge}>{companies.filter(c => c.sector !== "sources" && c.sector !== "prompts" && isPublicCo(c)).length}</span>
            </div>
            {publicCosOpen && Object.entries(SECTORS).filter(([sk]) => sk !== "sources").map(([sk, sec]) => {
              const pubCos = filteredCos(getPublicCos(sk));
              const open = publicSidebarOpen[sk];
              const total = getPublicCos(sk).length;
              if (total === 0) return null;
              return (
                <div key={sk}>
                  <div style={{ ...s.sectorHdr, paddingLeft: 34 }} onClick={() => setPublicSidebarOpen(p => ({ ...p, [sk]: !p[sk] }))}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 9, color: T_.textDim, transition: "transform .15s", transform: open ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>
                      <span onClick={e => { e.stopPropagation(); setView({ type: "sector", sector: sk }); setEditingField(null); }}>{sec.label}</span>
                    </div>
                    <span style={s.badge}>{total}</span>
                  </div>
                  {(open || search) && pubCos.length > 0 && pubCos.map(c => {
                    const active = view.type === "company" && view.id === c.id;
                    const pr = c.priority || "";
                    return (
                      <div key={c.id} style={{ ...s.navCo, ...(active ? s.navCoActive : {}), paddingLeft: 52 }} onClick={() => { setView({ type: "company", id: c.id }); setEditingField(null); }}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{c.name}</span>
                        {pr && <span style={{ ...s.prDot, background: pr === "High" ? T_.green : pr === "Medium" ? T_.amber : T_.textGhost }} />}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Private Company Research */}
          <div>
            <div style={s.sectorHdr} onClick={() => setCompaniesOpen(p => !p)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9, color: T_.textDim, transition: "transform .15s", transform: companiesOpen ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>
                <span>Private Company Research</span>
              </div>
              <span style={s.badge}>{companies.filter(c => c.sector !== "sources" && c.sector !== "prompts" && !isPublicCo(c)).length}</span>
            </div>
            {companiesOpen && Object.entries(SECTORS).map(([sk, sec]) => {
              const privCos = filteredCos(getPrivateCos(sk));
              const open = sidebarOpen[sk];
              const total = getPrivateCos(sk).length;
              return (
                <div key={sk}>
                  <div style={{ ...s.sectorHdr, paddingLeft: 34 }} onClick={() => {
                    if (sk === "sources") {
                      setView({ type: "company", id: "source_master_seed" });
                      setEditingField(null);
                    } else {
                      setSidebarOpen(p => ({ ...p, [sk]: !p[sk] }));
                    }
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {sk !== "sources" && <span style={{ fontSize: 9, color: T_.textDim, transition: "transform .15s", transform: open ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>}
                      <span onClick={e => { e.stopPropagation(); if (sk === "sources") { setView({ type: "company", id: "source_master_seed" }); } else { setView({ type: "sector", sector: sk }); } setEditingField(null); }}>{sec.label}</span>
                    </div>
                    {total > 0 && sk !== "sources" && <span style={s.badge}>{total}</span>}
                  </div>
                  {(open || search) && sk !== "sources" && privCos.length > 0 && (
                    <>
                      {privCos.map(c => {
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

          {/* Research Wiki */}
          <div style={{ ...s.sectorHdr, color: view.type === "researchWiki" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "researchWiki" }); setEditingField(null); }}>
            <span>Research Wiki</span>
          </div>

          {/* Restructuring */}
          <div style={{ ...s.sectorHdr, color: view.type === "restructuring" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "restructuring" }); setEditingField(null); }}>
            <span>Restructuring</span>
          </div>

          {/* Product / Service Primer */}
          <div style={{ ...s.sectorHdr, color: view.type === "productPrimer" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "productPrimer" }); setEditingField(null); }}>
            <span>Product / Service Primer</span>
          </div>

          {/* Industry Primer */}
          <div style={{ ...s.sectorHdr, color: view.type === "primer" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "primer" }); setEditingField(null); }}>
            <span>Industry Primer</span>
          </div>

          {/* Case Studies */}
          <div style={{ ...s.sectorHdr, color: view.type === "caseStudies" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "caseStudies" }); setEditingField(null); }}>
            <span>Case Studies</span>
          </div>

          {/* Prompts */}
          <div style={{ ...s.sectorHdr, color: view.type === "prompts" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "prompts" }); setEditingField(null); }}>
            <span>Prompts</span>
          </div>

          {/* Business Models */}
          <div style={{ ...s.sectorHdr, color: view.type === "businessModels" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "businessModels" }); setEditingField(null); }}>
            <span>Business Models</span>
          </div>

          {/* Accounting */}
          <div style={{ ...s.sectorHdr, color: view.type === "accounting" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "accounting" }); setEditingField(null); }}>
            <span>Accounting</span>
          </div>

          {/* Financial Instruments */}
          <div style={{ ...s.sectorHdr, color: view.type === "creditInstruments" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "creditInstruments" }); setEditingField(null); }}>
            <span>Financial Instruments</span>
          </div>

          {/* Sources */}
          <div style={{ ...s.sectorHdr, color: view.type === "sources" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "sources" }); setEditingField(null); }}>
            <span>Sources</span>
          </div>

          {/* APIs */}
          <div style={{ ...s.sectorHdr, color: view.type === "apis" ? T_.accent : T_.textDim }} onClick={() => { setView({ type: "apis" }); setEditingField(null); }}>
            <span>APIs</span>
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
          <div style={s.page}>
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
        {view.type === "primer" && <Suspense fallback={<div style={s.page}><div style={{ color: T_.textDim }}>Loading...</div></div>}><Primer initialTab={view.sub} /></Suspense>}
        {view.type === "productPrimer" && <Suspense fallback={<div style={s.page}><div style={{ color: T_.textDim }}>Loading...</div></div>}><ProductPrimer /></Suspense>}

        {/* AI DISRUPTION */}
        {view.type === "aidisruption" && <Suspense fallback={<div style={s.page}><div style={{ color: T_.textDim }}>Loading...</div></div>}><AIDisruption companies={companies} initialTab={view.sub} /></Suspense>}

        {/* INDUSTRY RESEARCH */}
        {view.type === "industryResearch" && <Suspense fallback={<div style={s.page}><div style={{ color: T_.textDim }}>Loading...</div></div>}><IndustryResearch initialTab={view.sub} /></Suspense>}


        {/* NOTES / IDEAS AGENT */}
        {view.type === "notesIdeasAgent" && <NotesIdeasAgent companies={companies} />}

        {/* AGENTS & TOOLS */}
        {view.type === "dataVerificationAgent" && <AgentsTools />}

        {/* TOOLS */}

        {/* EQUITY RESEARCH */}
        {view.type === "equityResearch" && (
          <div style={s.page}>
            <h1 style={s.pageTitle}>Primary Research</h1>
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
          const eqFields = fieldsMap[eq.id] || {};
          return (
            <div style={s.page}>
              <div style={s.breadcrumb}>
                <span onClick={() => { setView({ type: "equityResearch" }); setEditingField(null); }}>Primary Research</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <h1 style={s.pageTitle}>{eq.name}</h1>
                <button style={s.btnGhost} onClick={() => { setView({ type: "equityResearch" }); setEditingField(null); }}>&#8592; Back</button>
              </div>

              {/* Micron Review */}
              {eq.id === "eq_micron" && <MicronReview companyId={eq.id} companyName={eq.name} curFields={eqFields} updateField={updateField} editingField={editingField} setEditingField={setEditingField} />}

              {/* Oracle Review */}
              {eq.id === "eq_orcl" && <OracleReview companyId={eq.id} companyName={eq.name} curFields={eqFields} updateField={updateField} editingField={editingField} setEditingField={setEditingField} />}

              {/* Meta Review */}
              {eq.id === "eq_meta" && <MetaReview companyId={eq.id} companyName={eq.name} curFields={eqFields} updateField={updateField} editingField={editingField} setEditingField={setEditingField} />}

              {/* Generic Review — for all equity names without dedicated reviews */}
              {!["eq_micron", "eq_orcl", "eq_meta"].includes(eq.id) && <GenericReview companyId={eq.id} companyName={eq.name} curFields={eqFields} updateField={updateField} editingField={editingField} setEditingField={setEditingField} />}
            </div>
          );
        })()}

        {/* YL RESEARCH WIKI */}
        {view.type === "researchWiki" && (
          <div style={s.page}>
            <KnowledgeBase />
          </div>
        )}

        {/* PRINCIPLES */}
        {view.type === "principles" && (
          <div style={s.page}>
            <Principles />
          </div>
        )}

        {/* PROMPTS */}
        {view.type === "prompts" && (
          <div style={s.page}>
            <Prompts />
          </div>
        )}

        {/* KNOWLEDGE / INTERESTS */}
        {view.type === "knowledge" && (
          <div style={s.page}>
            <KnowledgeInterests />
          </div>
        )}

        {/* BUSINESS MODELS */}
        {view.type === "businessModels" && <Suspense fallback={<div style={s.page}><div style={{ color: T_.textDim }}>Loading...</div></div>}><BusinessModels initialTab={view.sub} /></Suspense>}

        {/* ACCOUNTING */}
        {view.type === "accounting" && <Suspense fallback={<div style={s.page}><div style={{ color: T_.textDim }}>Loading...</div></div>}><Accounting initialTab={view.sub} /></Suspense>}

        {/* CREDIT INSTRUMENTS */}
        {view.type === "creditInstruments" && <Suspense fallback={<div style={s.page}><div style={{ color: T_.textDim }}>Loading...</div></div>}><CreditInstruments initialTab={view.sub} /></Suspense>}

        {/* RESTRUCTURING */}
        {view.type === "restructuring" && <Suspense fallback={<div style={s.page}><div style={{ color: T_.textDim }}>Loading...</div></div>}><Restructuring initialTab={view.sub} /></Suspense>}

        {/* CASE STUDIES */}
        {view.type === "caseStudies" && <Suspense fallback={<div style={s.page}><div style={{ color: T_.textDim }}>Loading...</div></div>}><CaseStudies initialTab={view.sub} /></Suspense>}

        {/* MOBILE MORE MENU */}
        {view.type === "mobileMore" && (
          <div style={s.page}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 20, fontFamily: FONT }}>All Sections</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {MOBILE_MORE_ITEMS.map((item, idx) => (
                item.type === null ? (
                  <div key={item.label} style={{ fontSize: 11, fontWeight: 600, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", padding: "14px 18px 4px", marginTop: idx > 0 ? 8 : 0 }}>{item.label.replace(/—/g, "").trim()}</div>
                ) :
                <div key={item.label} onClick={() => {
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

        {/* APIs */}
        {view.type === "apis" && (
          <div style={s.page}>
            <ApiDirectory />
          </div>
        )}

        {/* AUDIT LOG */}
        {view.type === "auditLog" && <AuditLog />}

        {/* IDEA TRACKER — removed */}

        {/* COMPANY */}
        {view.type === "company" && cur && (
          <div style={s.page}>
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
            {cur.id === "tractcapital_seed" && <TractCapitalReview companyId={cur.id} companyName={cur.name} curFields={curFields} updateField={updateField} editingField={editingField} setEditingField={setEditingField} />}

            {/* CoreWeave Review */}
            {cur.id === "coreweave_seed" && <CoreweaveReview companyId={cur.id} companyName={cur.name} curFields={curFields} updateField={updateField} editingField={editingField} setEditingField={setEditingField} />}

            {/* Applied Digital Review */}
            {cur.id === "apld_seed" && <AppliedDigitalReview companyId={cur.id} companyName={cur.name} curFields={curFields} updateField={updateField} editingField={editingField} setEditingField={setEditingField} />}

            {/* Cipher Digital Review */}
            {cur.id === "cipher_seed" && <CipherDigitalReview companyId={cur.id} companyName={cur.name} curFields={curFields} updateField={updateField} editingField={editingField} setEditingField={setEditingField} />}

            {/* TeraWulf Review */}
            {cur.id === "terawulf_seed" && <TerawulfReview companyId={cur.id} companyName={cur.name} curFields={curFields} updateField={updateField} editingField={editingField} setEditingField={setEditingField} />}

            {/* Generic Review — for all Credit Research + Equity companies without dedicated reviews */}
            {!["tractcapital_seed", "coreweave_seed", "apld_seed", "cipher_seed", "terawulf_seed"].includes(cur.id) && cur.sector !== "sources" && <GenericReview companyId={cur.id} companyName={cur.name} curFields={curFields} updateField={updateField} editingField={editingField} setEditingField={setEditingField} />}

            {/* Structured Fields — only for sources sector */}
            {cur.sector === "sources" && SOURCE_FIELDS.map(f => {
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

// ─── Styles ───────────────────────────────────────────
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
  page: { flex: 1, padding: "36px 52px", overflowY: "auto" },
  pageTitle: { fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px", margin: "0 0 6px", fontFamily: FONT },
  pageSub: { fontSize: 14, color: T_.textDim, marginBottom: 28, lineHeight: 1.7, fontFamily: FONT },
  breadcrumb: { fontSize: 13, color: T_.textGhost, marginBottom: 12, display: "flex", gap: 8, alignItems: "center", cursor: "pointer", fontFamily: FONT },
  section: { marginBottom: 36 },
  sectionHdr: { fontSize: 14, fontWeight: 500, color: T_.textDim, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${T_.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: FONT },
  sectionDate: { fontSize: 12, fontWeight: 400, color: T_.textGhost, fontFamily: FONT },
  proseBody: { fontSize: 14, lineHeight: 1.9, color: T_.text, cursor: "pointer", whiteSpace: "pre-wrap", padding: "6px 0", fontFamily: FONT },
  textarea: { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, padding: "14px 16px", fontSize: 14, color: T_.text, outline: "none", fontFamily: FONT, resize: "vertical", minHeight: 110, lineHeight: 1.8, boxSizing: "border-box" },
  noteInput: { flex: 1, background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, padding: "11px 16px", fontSize: 14, color: T_.text, outline: "none", fontFamily: FONT, boxSizing: "border-box" },
  noteEntry: { padding: "18px 0", borderBottom: `1px solid ${T_.borderLight}` },
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
