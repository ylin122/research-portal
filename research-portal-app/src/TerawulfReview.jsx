import React, { useState } from "react";
import { T_, FONT } from "./lib/theme";
const FIELDS = [
  { key: "overview", label: "Company overview", ph: "Business description, founding year, HQ, stage, ownership, funding history, key leadership..." },
  { key: "products", label: "Key business / products", ph: "Start with how the company makes money. Core products, services, revenue streams, business model, pricing, value proposition..." },
  { key: "customers", label: "Customer focus", ph: "Target segments, key accounts, verticals, GTM motion, deal sizes, retention, expansion, geographic focus..." },
  { key: "industry", label: "Industry & market", ph: "TAM/SAM/SOM, growth drivers, macro trends, regulatory environment, tailwinds/headwinds, secular shifts..." },
  { key: "competitive", label: "Competitive landscape", ph: "Key competitors, differentiation, moat, positioning, win/loss dynamics, emerging threats, market share..." },
  { key: "transactions", label: "Recent transactions", ph: "Funding rounds, M&A, divestitures, partnerships, key deals, valuation history, cap table, exit path..." },
  { key: "financials", label: "Financials & metrics", ph: "Revenue, growth, margins, ARR/MRR, headcount, unit economics, burn, profitability, debt profile..." },
];
const s = {
  card: { background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 16 },
  section: { marginBottom: 36 },
  sectionHdr: { fontSize: 14, fontWeight: 500, color: T_.textDim, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${T_.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: FONT },
  sectionDate: { fontSize: 12, fontWeight: 400, color: T_.textGhost, fontFamily: FONT },
  btnSmall: { padding: "4px 12px", fontSize: 12, border: `1px solid ${T_.border}`, background: "transparent", color: T_.textDim, borderRadius: 5, cursor: "pointer", fontFamily: FONT },
  proseBody: { fontSize: 14, lineHeight: 1.9, color: T_.text, cursor: "pointer", whiteSpace: "pre-wrap", padding: "6px 0", fontFamily: FONT },
  textarea: { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, padding: "14px 16px", fontSize: 14, color: T_.text, outline: "none", fontFamily: FONT, resize: "vertical", minHeight: 110, lineHeight: 1.8, boxSizing: "border-box" },
};

function fmtShort(d) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }

export default function TerawulfReview({ companyId, companyName, curFields, updateField, editingField, setEditingField }) {
  const [wulfTab, setWulfTab] = useState("recent");

  return (
    <>
      {/* TeraWulf Sub-Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #1E293B" }}>
        {[{ key: "recent", label: "Research" }, { key: "overview", label: "Overview" }, { key: "orgchart", label: "Org Chart" }, { key: "contracts", label: "Supply Chain & Customers" }, { key: "sentiment", label: "Sentiment" }].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setWulfTab(tab.key)}
            style={{
              padding: "8px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
              background: "transparent",
              color: wulfTab === tab.key ? "#F8FAFC" : "#64748B",
              borderBottom: wulfTab === tab.key ? "2px solid #3B82F6" : "2px solid transparent",
              marginBottom: -1, transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== RESEARCH TAB ===== */}
      {wulfTab === "recent" && (
        <div style={s.section}>
          {FIELDS.map(f => {
            const fd = curFields?.[f.key];
            const isEditing = editingField === f.key;
            const hasContent = fd?.text?.trim();
            return (
              <div key={f.key} style={s.section}>
                <div style={s.sectionHdr}>
                  <span>{f.label}</span>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {fd?.date && <span style={s.sectionDate}>{fmtShort(fd.date)}</span>}
                    {hasContent && !isEditing && <button style={s.btnSmall} onClick={() => setEditingField(f.key)}>Edit</button>}
                  </div>
                </div>
                {(isEditing || !hasContent) ? (
                  <div>
                    <textarea style={s.textarea} rows={6}
                      value={fd?.text || ""}
                      onChange={e => updateField(companyId, f.key, e.target.value)}
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

      {/* ===== OVERVIEW TAB ===== */}
      {wulfTab === "overview" && (<>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>TeraWulf (WULF)</div>
          </div>
        </div>
      </div>

      {/* Key Events Timeline */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Key Events Timeline</div>
        <div style={{ display: "flex", gap: 16 }}>

        {/* 0-6 Months */}
        <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #3B82F6" }}>0–6 Months (Apr – Oct 2026)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { date: "May 8, 2026", event: "Q1 2026 earnings release", type: "Earnings", detail: "Key watch: HPC revenue ramp from CB-1/CB-2 (Core42), construction progress on CB-3/CB-4/CB-5, Abernathy JV update." },
            { date: "H2 2026", event: "Abernathy TX campus (168 MW critical IT) commissioning begins", type: "Capacity", detail: "51/49 JV with Fluidstack. 240 MW gross. New market beyond Lake Mariner." },
            { date: "2026", event: "CB-3/CB-4 (200+ MW) construction progress at Lake Mariner", type: "Capacity", detail: "Fluidstack/Google 10-year lease. Part of $9.5B contract package." },
            { date: "2026", event: "CB-5 (160 MW) construction at Lake Mariner", type: "Capacity", detail: "Fluidstack expansion. Added to bring Lake Mariner HPC to 500+ MW." },
            { date: "Ongoing", event: "Bitcoin mining wind-down", type: "Other", detail: "Minimal BTC operations remaining. Company pivoted fully to HPC hosting." },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 10px", background: "#0B0F19", borderRadius: 6, border: "1px solid #1E293B" }}>
              <div style={{ width: 75, minWidth: 75 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6" }}>{c.date}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC" }}>{c.event}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 3,
                    background: c.type === "Earnings" ? "rgba(139,92,246,0.12)" : c.type === "Capacity" ? "rgba(16,185,129,0.12)" : c.type === "Financing" ? "rgba(59,130,246,0.12)" : c.type === "Contract" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                    color: c.type === "Earnings" ? "#8B5CF6" : c.type === "Capacity" ? "#10B981" : c.type === "Financing" ? "#3B82F6" : c.type === "Contract" ? "#EF4444" : "#F59E0B",
                  }}>{c.type}</span>
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>{c.detail}</div>
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* 6-18 Months */}
        <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #F59E0B" }}>6–18 Months (Oct 2026 – Oct 2027)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { date: "Late 2026/2027", event: "CB-3/CB-4 energization at Lake Mariner", type: "Capacity", detail: "200+ MW for Fluidstack/Google. Critical revenue inflection." },
            { date: "2027", event: "CB-5 (160 MW) energization at Lake Mariner", type: "Capacity", detail: "Brings total Lake Mariner HPC to ~500 MW." },
            { date: "2027", event: "Abernathy TX full ramp", type: "Capacity", detail: "168 MW critical IT. Fluidstack JV. Diversifies geographic concentration." },
            { date: "Ongoing", event: "Core42 135 MW expansion option", type: "Contract", detail: "Potential exercise would nearly triple Core42 commitment at Lake Mariner. Status unconfirmed." },
            { date: "2027+", event: "Lake Mariner full buildout toward 750 MW", type: "Capacity", detail: "Former 700 MW coal plant site. Long-term expansion potential." },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 10px", background: "#0B0F19", borderRadius: 6, border: "1px solid #1E293B" }}>
              <div style={{ width: 85, minWidth: 85 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B" }}>{c.date}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC" }}>{c.event}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 3,
                    background: c.type === "Earnings" ? "rgba(139,92,246,0.12)" : c.type === "Capacity" ? "rgba(16,185,129,0.12)" : c.type === "Financing" ? "rgba(59,130,246,0.12)" : c.type === "Contract" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                    color: c.type === "Earnings" ? "#8B5CF6" : c.type === "Capacity" ? "#10B981" : c.type === "Financing" ? "#3B82F6" : c.type === "Contract" ? "#EF4444" : "#F59E0B",
                  }}>{c.type}</span>
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>{c.detail}</div>
              </div>
            </div>
          ))}
        </div>
        </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
          {[
            { label: "Contract", color: "#EF4444" },
            { label: "Earnings", color: "#8B5CF6" },
            { label: "Capacity", color: "#10B981" },
            { label: "Financing", color: "#3B82F6" },
            { label: "Other", color: "#F59E0B" },
          ].map((l, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748B" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: TeraWulf IR, SEC filings (10-K, 8-K), CoinDesk, DataCenterDynamics, Carbon Credits, Ramboll.</div>
      </div>

      {/* Supply Chain & Ecosystem Map */}
      <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>TeraWulf Supply Chain &amp; Ecosystem Map</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {[
          { label: "Customers", items: [
            { name: "Core42 (G42 subsidiary)", sub: "72.5 MW gross, 10+ year lease at Lake Mariner CB-1/CB-2. UAE sovereign-backed AI company", color: "#F59E0B" },
            { name: "Fluidstack (Google-backed)", sub: "~360 MW at Lake Mariner (CB-3/CB-4/CB-5) + 168 MW at Abernathy. 10-year leases", color: "#F59E0B" },
          ]},
          { label: "TeraWulf Platform", items: [
            { name: "TeraWulf", sub: "Lake Mariner NY (750 MW potential) + Abernathy TX (240 MW) \u00b7 522 MW contracted \u00b7 $12.8B+ backlog", color: "#3B82F6" },
          ]},
          { label: "Power & Infrastructure", items: [
            { name: "Lake Mariner Nuclear/Hydro Grid", sub: "Former 700 MW Somerset coal plant site. 89% zero-carbon grid (nuclear + hydro). ~$0.047/kWh", color: "#10B981" },
            { name: "Beowulf Electricity & Data", sub: "Acquired Dec 2024 for $90M. Power procurement subsidiary. Manages grid connections and wholesale energy", color: "#10B981" },
          ]},
          { label: "Financing", items: [
            { name: "Abernathy JV Financing", sub: "$1.55B project finance notes (6.375%) for Abernathy campus. TeraWulf 51% / Fluidstack 49%", color: "#10B981" },
            { name: "Corporate", sub: "$3.7B cash (Dec 2025). ~$5.2B total debt. Convertible notes outstanding", color: "#10B981" },
          ]},
          { label: "Competitors", items: [
            { name: "Applied Digital (APLD)", sub: "$16B contracted. Polaris Forge campuses in ND", color: "#EF4444" },
            { name: "Cipher Digital (CIFR)", sub: "$9.3B+ contracted. Black Pearl & Barber Lake in TX", color: "#EF4444" },
            { name: "Core Scientific (CORZ)", sub: "590 MW CoreWeave contracts", color: "#EF4444" },
            { name: "IREN (IREN)", sub: "Expanding to ~3 GW by 2026. Prince George BC + TX", color: "#EF4444" },
            { name: "Hut 8 (HUT)", sub: "Mining + HPC infrastructure", color: "#94A3B8" },
          ]},
        ].map((layer, li) => (
          <div key={li} style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B" }}>
            <div style={{ width: 180, minWidth: 180, background: "#0B0F19", padding: "12px 14px", display: "flex", alignItems: "center", borderRight: "1px solid #1E293B" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px" }}>{layer.label}</span>
            </div>
            <div style={{ flex: 1, display: "flex", gap: 0, flexWrap: "wrap", background: "#111827" }}>
              {layer.items.map((item, ii) => (
                <div key={ii} style={{ flex: "1 1 200px", padding: "10px 14px", borderRight: ii < layer.items.length - 1 ? "1px solid #1E293B" : "none" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: "#64748B", marginTop: 2, lineHeight: 1.4 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Flow: Power &amp; Infrastructure → TeraWulf (build, lease, operate) → Customers (Core42, Fluidstack/Google). Financing partners enable capex scale.</div>

      {/* Major Contracts */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Major Contracts</div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>Total contracted HPC revenue: ~$12.8B+ across 522 MW. All HPC contracts are 10+ year terms.</div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>Customer Contracts</div>
        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 900 }}>
            <thead>
              <tr>
                {["Customer", "Contract Value", "Term", "Annual Run Rate", "Delivery", "GPU Type", "Pricing", "Exit / Termination", "Source"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  cust: "Core42 (G42)",
                  value: "~$1.2B estimated",
                  term: "10+ years",
                  arr: "~$120M implied",
                  delivery: "CB-1/CB-2 at Lake Mariner, 72.5 MW gross",
                  gpu: "Tenant-installed (NVIDIA)",
                  pricing: "Colocation hosting, triple-net-like",
                  exit: "135 MW expansion option held by Core42",
                  source: "TeraWulf IR, DCD",
                },
                {
                  cust: "Fluidstack (Google-backed) — Lake Mariner",
                  value: "~$9.5B total (CB-3/CB-4 + CB-5)",
                  term: "10 years",
                  arr: "~$950M implied",
                  delivery: "CB-3/CB-4 (200+ MW) + CB-5 (160 MW) at Lake Mariner",
                  gpu: "Tenant-installed",
                  pricing: "HPC hosting",
                  exit: "Google backstops Fluidstack obligations",
                  source: "TeraWulf IR, CoinDesk",
                },
                {
                  cust: "Fluidstack — Abernathy TX JV",
                  value: "~$2.1B estimated",
                  term: "10 years",
                  arr: "~$210M implied",
                  delivery: "168 MW critical IT (240 MW gross)",
                  gpu: "Tenant-installed",
                  pricing: "51/49 JV structure",
                  exit: "Financed by $1.55B project notes",
                  source: "TeraWulf IR",
                },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#3B82F6", whiteSpace: "nowrap" }}>{row.cust}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F8FAFC", fontWeight: 600 }}>{row.value}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.term}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.arr}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.delivery}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8" }}>{row.gpu}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.pricing}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F59E0B", fontSize: 11 }}>{row.exit}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Center Footprint */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Data Center Footprint</div>
        <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 16 }}>2 campuses: Lake Mariner (NY) + Abernathy (TX). 522 MW contracted across 2 tenants. 89% zero-carbon grid at Lake Mariner.</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Contracted MW</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#10B981" }}>522 MW</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Operational</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#3B82F6" }}>~72.5 MW</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Under Construction</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F59E0B" }}>~530 MW</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Expansion Potential</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#8B5CF6" }}>~1 GW</div>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
          <thead>
            <tr>
              {["Location", "Tenant", "MW", "Status", "Timeline", "Notes"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { loc: "Lake Mariner CB-1/CB-2, Barker NY", tenant: "Core42 (G42)", mw: "72.5 gross", status: "Operational", timeline: "Delivered 2025", notes: "10+ year lease. UAE sovereign-backed tenant. 135 MW expansion option." },
              { loc: "Lake Mariner CB-3/CB-4, Barker NY", tenant: "Fluidstack (Google)", mw: "200+", status: "Under Construction", timeline: "2026-2027", notes: "10-year lease. Part of $9.5B package." },
              { loc: "Lake Mariner CB-5, Barker NY", tenant: "Fluidstack (Google)", mw: "160", status: "Under Construction", timeline: "2027", notes: "Expansion announced Oct 2025." },
              { loc: "Abernathy, TX", tenant: "Fluidstack", mw: "168 critical IT (240 gross)", status: "Under Construction", timeline: "H2 2026", notes: "51/49 JV. $1.55B project financing. New geographic market." },
              { loc: "Lake Mariner Expansion, Barker NY", tenant: "TBD", mw: "Up to 750 total", status: "Planning", timeline: "2027+", notes: "Former 700 MW coal plant. 89% zero-carbon grid." },
              { loc: "Nautilus Cryptomine, PA", tenant: "DIVESTED", mw: "\u2014", status: "Sold Oct 2024", timeline: "\u2014", notes: "Sold to Talen Energy for $85M. Former nuclear-adjacent mining site." },
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 600, color: "#F8FAFC", fontSize: 11 }}>{row.loc}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.tenant}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 700 }}>{row.mw}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                    background: row.status === "Operational" ? "rgba(16,185,129,0.12)" : row.status === "Under Construction" ? "rgba(245,158,11,0.12)" : row.status === "Sold Oct 2024" ? "rgba(100,116,139,0.12)" : "rgba(100,116,139,0.12)",
                    color: row.status === "Operational" ? "#10B981" : row.status === "Under Construction" ? "#F59E0B" : "#94A3B8",
                  }}>{row.status}</span>
                </td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>{row.timeline}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: TeraWulf IR, SEC filings, CoinDesk, DataCenterDynamics, Carbon Credits, Ramboll.</div>
      </div>
    </>)}

    {/* ===== ORG CHART SUB-TAB ===== */}
    {wulfTab === "orgchart" && (<>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>TeraWulf Corporate Structure</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>As of</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#3B82F6" }}>Mar 2026</div>
          </div>
        </div>
      </div>

      {/* === PARENT ENTITY === */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 8 }}>
        <div style={{ background: "linear-gradient(135deg, #1E3A5F, #0B1929)", border: "2px solid #3B82F6", borderRadius: 12, padding: "20px 40px", textAlign: "center", minWidth: 400, position: "relative" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>TeraWulf Inc.</div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Parent &middot; Delaware &middot; NASDAQ: WULF</div>
        </div>
        {/* Connector line */}
        <div style={{ width: 2, height: 24, background: "#1E293B" }} />
      </div>

      {/* === Connector lines from parent to entities === */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 2, height: 20, background: "#1E293B" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
        <div style={{ width: "80%", height: 2, background: "#1E293B", position: "relative" }}>
          {[0, 33, 66, 100].map(p => (
            <div key={p} style={{ position: "absolute", left: `${p}%`, top: -4, width: 2, height: 10, background: "#1E293B", transform: "translateX(-1px)" }} />
          ))}
        </div>
      </div>

      {/* Entity Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { name: "Lake Mariner Data LLC", fullName: "Flagship HPC Campus", tag: "OPERATING", tagBg: "rgba(16,185,129,0.12)", tagColor: "#10B981", color: "#10B981", border: "1px solid #1E293B",
            outstanding: "72.5 MW operational", capacity: "750 MW potential", rate: "360+ MW under build", maturity: "Core42, Fluidstack",
            gpus: "Core42, Fluidstack", collateral: "Former 700 MW Somerset coal plant. 89% zero-carbon grid. Flagship campus.", guarantor: "Operational + Under construction", ringFenced: "N/A", sub: "Subsidiary \u00b7 New York" },
          { name: "Abernathy JV (TeraWulf 51% / Fluidstack 49%)", fullName: "Texas HPC Campus", tag: "UNDER BUILD", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B", border: "1px solid #1E293B",
            outstanding: "168 MW critical IT", capacity: "240 MW gross", rate: "$1.55B project finance notes at 6.375%", maturity: "H2 2026 commissioning",
            gpus: "Fluidstack", collateral: "First campus outside New York. Texas ERCOT grid.", guarantor: "Under construction", ringFenced: "N/A", sub: "Joint venture \u00b7 Texas" },
          { name: "Beowulf Electricity & Data Inc.", fullName: "Power Procurement Subsidiary", tag: "POWER", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6", color: "#3B82F6", border: "1px solid #1E293B",
            outstanding: "Acquired Dec 2024", capacity: "$90M acquisition", rate: "Power procurement, grid management", maturity: "Wholesale energy",
            gpus: "N/A — utility subsidiary", collateral: "Streamlines energy costs across all campuses. Key to maintaining ~$0.047/kWh advantage.", guarantor: "Operational", ringFenced: "N/A", sub: "Subsidiary \u00b7 Delaware" },
          { name: "Nautilus Cryptomine LLC", fullName: "Former BTC Mining Site", tag: "DIVESTED", tagBg: "rgba(100,116,139,0.12)", tagColor: "#94A3B8", color: "#94A3B8", border: "1px solid #1E293B",
            outstanding: "Sold Oct 2024", capacity: "To Talen Energy", rate: "$85M sale price", maturity: "N/A",
            gpus: "N/A — divested", collateral: "Former nuclear-adjacent BTC mining. Sold to fund AI pivot.", guarantor: "Divested", ringFenced: "N/A", sub: "Former subsidiary" },
        ].map((e, i) => (
          <div key={i} style={{ background: "#111827", border: e.border, borderRadius: 8, padding: "12px 12px 10px", position: "relative", minWidth: 0 }}>
            <div style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: e.tagBg, color: e.tagColor, fontWeight: 600, display: "inline-block", marginBottom: 6 }}>{e.tag}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC", marginBottom: 2, lineHeight: 1.2 }}>{e.name}</div>
            <div style={{ fontSize: 9, color: "#64748B", marginBottom: 8 }}>{e.fullName} &middot; {e.sub}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 8 }}>
              <div style={{ background: "#0B0F19", borderRadius: 5, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Outstanding</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: e.color }}>{e.outstanding}</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>of {e.capacity}</div>
              </div>
              <div style={{ background: "#0B0F19", borderRadius: 5, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Rate</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: e.color }}>{e.rate}</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>Mat: {e.maturity}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.7 }}>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>GPUs/Tenant:</span> {e.gpus}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Collateral/Notes:</span> {e.collateral}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Guarantor:</span> {e.guarantor}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Ring-Fenced:</span> {e.ringFenced}</div>
            </div>
          </div>
        ))}
      </div>

      {/* === KEY INVESTORS === */}
      <div style={s.card}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Key Investors</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { name: "Institutional Ownership", detail: "~65-70% institutional ownership", color: "#3B82F6" },
            { name: "Paul Prager (CEO)", detail: "Significant insider stake", color: "#F59E0B" },
            { name: "No Named Strategic Corporate Investors", detail: "Unlike APLD's former NVIDIA stake, no disclosed strategic corporate investors", color: "#94A3B8" },
          ].map((inv, i) => (
            <div key={i} style={{ flex: "1 1 250px", minWidth: 250, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: inv.color, marginBottom: 6 }}>{inv.name}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: "1.6" }}>{inv.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Sources: TeraWulf IR, SEC filings (10-K, 8-K), The Block, Talen Energy IR.</div>
    </>)}

    {/* ===== CONTRACTS SUB-TAB ===== */}
    {wulfTab === "contracts" && (<>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Supply Side &amp; Customer Contracts</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>Total contracted HPC revenue: ~$12.8B+ across 522 MW. All HPC contracts are 10+ year terms.</div>

      {/* Contract Comparison */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Contract Comparison</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                {["Metric", "Core42", "Fluidstack Lake Mariner", "Fluidstack Abernathy"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { metric: "Contract Value", core42: "~$1.2B", fluidLM: "~$9.5B", fluidABN: "~$2.1B" },
                { metric: "Term", core42: "10+ yr", fluidLM: "10 yr", fluidABN: "10 yr" },
                { metric: "MW Committed", core42: "72.5 MW", fluidLM: "360 MW (CB-3/4/5)", fluidABN: "168 MW critical IT" },
                { metric: "Annual Run Rate", core42: "~$120M", fluidLM: "~$950M", fluidABN: "~$210M" },
                { metric: "GPU Type", core42: "Tenant-installed (NVIDIA)", fluidLM: "Tenant-installed", fluidABN: "Tenant-installed" },
                { metric: "Lease Structure", core42: "Colocation hosting", fluidLM: "HPC hosting", fluidABN: "51/49 JV" },
                { metric: "Credit Support", core42: "UAE sovereign-backed (G42)", fluidLM: "Google backstops obligations", fluidABN: "$1.55B project financing" },
                { metric: "Exit / Termination", core42: "Not disclosed", fluidLM: "Not disclosed", fluidABN: "Not disclosed" },
                { metric: "Expansion Options", core42: "135 MW expansion option", fluidLM: "Additional Lake Mariner capacity", fluidABN: "\u2014" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.metric}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#10B981" }}>{row.core42}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#F59E0B" }}>{row.fluidLM}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#3B82F6" }}>{row.fluidABN}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Core42 Contract Deep Dive */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#10B981" }}>Core42 Deep Dive</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" }}>Total Contract</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>~$1.2B</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Total Value", value: "~$1.2B", sub: "" },
            { label: "Term", value: "10+ years", sub: "" },
            { label: "MW", value: "72.5", sub: "gross" },
            { label: "Backer", value: "G42/UAE sovereign", sub: "" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "10px 14px", flex: "1 1 130px", minWidth: 130 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>{m.value}</div>
              {m.sub && <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{m.sub}</div>}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Notes</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <tbody>
            {[
              { term: "Tenant", detail: "First HPC tenant at Lake Mariner. CB-1/CB-2 delivered on schedule." },
              { term: "Backer", detail: "Core42 is a subsidiary of G42, an Abu Dhabi sovereign-backed AI company with Microsoft partnership." },
              { term: "Expansion", detail: "135 MW expansion option would nearly triple commitment." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 200, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fluidstack/Google Contract Deep Dive */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F59E0B" }}>Fluidstack/Google Deep Dive</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" }}>Total Contract</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>~$11.6B</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Total Value", value: "~$11.6B", sub: "combined" },
            { label: "Term", value: "10 years", sub: "" },
            { label: "MW", value: "528", sub: "360 LM + 168 ABN" },
            { label: "Backstop", value: "Google", sub: "" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "10px 14px", flex: "1 1 130px", minWidth: 130 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>{m.value}</div>
              {m.sub && <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{m.sub}</div>}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Notes</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <tbody>
            {[
              { term: "Provider", detail: "Fluidstack is a Google-backed AI compute provider. Google backstops lease obligations." },
              { term: "Timeline", detail: "Deals announced Oct 2025 (CB-3/CB-4), expanded with CB-5 (Oct 2025), and Abernathy JV (Jan 2026)." },
              { term: "Scale", detail: "Largest single customer relationship. CoinDesk reported stock surged 22% on initial deal announcement." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 200, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contract Risk Factors */}
      <div style={s.card}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>Contract Risk Factors</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { title: "Customer Concentration", desc: "Fluidstack/Google = ~90% of contracted revenue. Core42 = ~10%. Extreme dependence on single customer relationship.", color: "#EF4444" },
            { title: "Fluidstack Counterparty", desc: "Fluidstack is a startup. Google backstop mitigates but exact guarantee terms not fully public. If Google reduces commitment, Fluidstack may not independently cover.", color: "#EF4444" },
            { title: "Construction Execution", desc: "530+ MW under construction simultaneously (Lake Mariner CB-3/4/5 + Abernathy). Supply chain, labor, transformer procurement risks.", color: "#F59E0B" },
            { title: "Geographic Concentration", desc: "Lake Mariner = ~80% of total MW. Single-site risk (weather, grid, regulatory). Abernathy diversifies somewhat.", color: "#F59E0B" },
            { title: "Energy Branding Risk", desc: "\"89% zero-carbon\" marketing has been questioned (Hunterbrook report). Lake Mariner uses grid power, not direct nuclear/hydro. Reputational risk if scrutinized.", color: "#F59E0B" },
            { title: "Leverage", desc: "~$5.2B total debt on $168.5M FY2025 revenue. $661.4M net loss (includes non-cash). Cash of $3.7B provides runway but debt service is significant.", color: "#EF4444" },
          ].map((item, i) => (
            <div key={i} style={{ flex: "1 1 280px", minWidth: 280, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: "1.6" }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 14, fontStyle: "italic" }}>Sources: TeraWulf IR, SEC filings (10-K, 8-K), CoinDesk, Hunterbrook Media, DataCenterDynamics.</div>
      </div>
    </>)}

    {/* ===== SENTIMENT SUB-TAB ===== */}
    {wulfTab === "sentiment" && (<>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Market Sentiment</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>13 analysts. All Buy. Avg PT ~$23. Short interest ~22% of float. Q1 earnings May 8.</div>

      {/* Consensus Snapshot */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Consensus Rating", value: "Strong Buy", sub: "13/0/0 Buy", color: "#10B981" },
          { label: "Avg Price Target", value: "~$23", sub: "Range: $17 – $37", color: "#3B82F6" },
          { label: "PT Range", value: "$17 – $37", sub: "", color: "#F8FAFC" },
          { label: "Short Interest", value: "~22%", sub: "of float", color: "#F59E0B" },
        ].map((m, i) => (
          <div key={i} style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: "14px 18px", flex: "1 1 180px", minWidth: 180 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Sentiment Arc */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Sentiment Arc</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { phase: "Current (Apr 2026)", sentiment: "Execution Watch", color: "#8B5CF6", desc: "Stock ~$14-15. Strong Buy consensus. 22% short interest reflects execution skepticism. Q1 earnings May 8 is next catalyst." },
            { phase: "Expansion Phase (Jan – Mar 2026)", sentiment: "Growth Mode", color: "#3B82F6", desc: "Abernathy JV, CB-5 expansion, $1.55B project financing. Execution now the key variable." },
            { phase: "Google/Fluidstack Deals (Oct 2025)", sentiment: "Euphoric", color: "#10B981", desc: "$9.5B+ in contracts announced. Stock surged 22% in a day. Market re-rated WULF as AI infrastructure play. Hit ATH $18.51." },
            { phase: "AI Pivot (2024)", sentiment: "Re-Rating", color: "#F59E0B", desc: "Sold Nautilus to Talen ($85M). Announced Core42 deal (72.5 MW). Clear strategic shift to HPC hosting." },
            { phase: "Nuclear Narrative (2023-2024)", sentiment: "ESG Interest", color: "#F59E0B", desc: "Nautilus nuclear-adjacent mine generated ESG interest. Stock re-rated on clean energy mining thesis." },
            { phase: "Bitcoin Miner (2021-2023)", sentiment: "BTC-Correlated", color: "#94A3B8", desc: "Founded as BTC miner. Lake Mariner site acquired. Built mining capacity. Stock largely followed BTC price." },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B" }}>
              <div style={{ width: 200, minWidth: 200, background: "#0B0F19", padding: "12px 14px", borderRight: "1px solid #1E293B" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC" }}>{p.phase}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: p.color, marginTop: 4 }}>{p.sentiment}</div>
              </div>
              <div style={{ flex: 1, padding: "12px 14px", background: "#111827" }}>
                <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analyst Coverage Table */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Analyst Coverage Detail</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 800 }}>
            <thead>
              <tr>
                {["Firm", "Analyst", "Rating", "Price Target", "Date", "Key Thesis"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { firm: "Morgan Stanley", analyst: "\u2014", rating: "Overweight", pt: "$37", date: "Mar 2026", thesis: "Most bullish. Sees AI infrastructure as secular growth." },
                { firm: "B. Riley", analyst: "Lucas Pipes", rating: "Buy", pt: "$25", date: "Feb 2026", thesis: "Lake Mariner nuclear-adjacent power is differentiator." },
                { firm: "Canaccord Genuity", analyst: "\u2014", rating: "Buy", pt: "$24", date: "Mar 2026", thesis: "Fluidstack/Google contracts de-risk revenue." },
                { firm: "Roth Capital", analyst: "Darren Aftahi", rating: "Buy", pt: "$23", date: "Feb 2026", thesis: "Abernathy JV adds geographic diversification." },
                { firm: "HC Wainwright", analyst: "\u2014", rating: "Buy", pt: "$22", date: "Mar 2026", thesis: "Strong backlog visibility." },
                { firm: "Lake Street", analyst: "\u2014", rating: "Buy", pt: "$20", date: "Feb 2026", thesis: "Execution key to re-rating." },
                { firm: "Macquarie", analyst: "\u2014", rating: "Outperform", pt: "$19", date: "Jan 2026", thesis: "Conservative on construction timeline." },
                { firm: "D.A. Davidson", analyst: "\u2014", rating: "Buy", pt: "$17", date: "Feb 2026", thesis: "Floor valuation; most conservative." },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.firm}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.analyst}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                      background: row.rating.includes("Buy") || row.rating.includes("Outperform") || row.rating.includes("Overweight") ? "rgba(16,185,129,0.12)" : row.rating.includes("Sell") || row.rating.includes("Underperform") ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                      color: row.rating.includes("Buy") || row.rating.includes("Outperform") || row.rating.includes("Overweight") ? "#10B981" : row.rating.includes("Sell") || row.rating.includes("Underperform") ? "#EF4444" : "#F59E0B",
                    }}>{row.rating}</span>
                  </td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#3B82F6" }}>{row.pt}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.date}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 12, maxWidth: 350 }}>{row.thesis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>NOTE: Analyst names approximate. Consensus direction confirmed across sources.</div>
      </div>

      {/* Market Positioning */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Market Positioning</div>

        {/* Insider Activity */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Insider Activity</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 20 }}>
          <thead>
            <tr>
              {["Date", "Insider", "Title", "Action", "Value", "Notes"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { date: "Mar 2026", insider: "Patrick Fleury", title: "CFO", action: "Sell", value: "~$9.6M", notes: "10b5-1 plan" },
              { date: "Mar 2026", insider: "Paul Prager", title: "CEO", action: "Sell", value: "~$4.5M", notes: "10b5-1 plan" },
              { date: "Mar 2026", insider: "Anthony Bucella", title: "Director", action: "Buy", value: "~$70K", notes: "Open market purchase \u2014 contrarian signal" },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.date}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", fontSize: 11 }}>{row.insider}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.title}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                    background: row.action === "Sell" ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)",
                    color: row.action === "Sell" ? "#EF4444" : "#10B981",
                  }}>{row.action}</span>
                </td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.value}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.7 }}>
            <span style={{ fontWeight: 700, color: "#EF4444" }}>Net: Heavy selling from C-suite.</span> One small director buy.
          </div>
        </div>

        {/* Institutional Ownership */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Institutional Ownership</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "Institutional", value: "~65-70%", color: "#3B82F6" },
            { label: "Insider", value: "~15%", sub: "", color: "#F59E0B" },
            { label: "Short Interest", value: "~22%", sub: "of float", color: "#EF4444" },
          ].map((m, i) => (
            <div key={i} style={{ flex: "1 1 140px", minWidth: 140, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
              {m.sub && <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{m.sub}</div>}
            </div>
          ))}
        </div>

        {/* Short Interest Card */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Short Interest</div>
        <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            {[
              { label: "Short % of Float", value: "~22%", color: "#EF4444" },
            ].map((m, i) => (
              <div key={i} style={{ flex: "1 1 140px", minWidth: 140 }}>
                <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.7 }}>
            Elevated short interest reflects skepticism on execution timeline and leverage. Stock has squeeze potential given 13/0/0 Buy consensus.
          </div>
        </div>

        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Sources: TeraWulf IR, MarketBeat, TipRanks, SEC filings (Form 4), FINRA short interest reports.</div>
      </div>
    </>)}

    </>
  );
}
