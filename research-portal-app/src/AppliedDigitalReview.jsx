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

export default function AppliedDigitalReview({ companyId, companyName, curFields, updateField, editingField, setEditingField }) {
  const [apldTab, setApldTab] = useState("recent");

  return (
    <>
      {/* Applied Digital Sub-Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #1E293B" }}>
        {[{ key: "recent", label: "Research" }, { key: "overview", label: "Overview" }, { key: "orgchart", label: "Org Chart" }, { key: "contracts", label: "Supply Chain & Customers" }, { key: "sentiment", label: "Sentiment" }].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setApldTab(tab.key)}
            style={{
              padding: "8px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
              background: "transparent",
              color: apldTab === tab.key ? "#F8FAFC" : "#64748B",
              borderBottom: apldTab === tab.key ? "2px solid #3B82F6" : "2px solid transparent",
              marginBottom: -1, transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== RESEARCH TAB ===== */}
      {apldTab === "recent" && (
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
      {apldTab === "overview" && (<>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Applied Digital (APLD)</div>
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
            { date: "Apr 8", event: "Q3 FY2026 earnings release", type: "Earnings", detail: "After market close. Key watch: revenue trajectory post-$126.6M Q2, ELN-03 construction progress, Macquarie draw schedule, updated guidance." },
            { date: "Mid-2026", event: "Polaris Forge 1 Building 2 (ELN-03, 150 MW) Ready for Service", type: "Capacity", detail: "6 data halls. CoreWeave lease. Critical execution milestone — unlocks next tranche of $11B contract revenue." },
            { date: "2026", event: "Polaris Forge 2 initial phase (~100 MW of 200 MW) begins commissioning", type: "Capacity", detail: "Unnamed IG hyperscaler tenant. $5B 15-year lease. First revenue from second campus." },
            { date: "Jul 2026", event: "Q4 FY2026 / Full-year FY2026 results expected", type: "Earnings", detail: "Full fiscal year ended May 31. First year reflecting material HPC lease revenue." },
            { date: "H2 2026", event: "Macquarie facility additional draws", type: "Financing", detail: "Up to $5B perpetual preferred equity. Draws fund Polaris Forge 1 & 2 construction. Dilutive to common shareholders." },
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
            { date: "Late 2026", event: "Polaris Forge 2 remaining 100 MW online (total 200 MW)", type: "Capacity", detail: "Completes initial hyperscaler commitment. Enables FROR exercise for additional 800 MW." },
            { date: "2027", event: "Polaris Forge 1 Building 3 (150 MW) anticipated Ready for Service", type: "Capacity", detail: "CoreWeave option. Would bring Polaris Forge 1 to full 400 MW. ~$4B incremental lease revenue." },
            { date: "2027", event: "Potential hyperscaler FROR exercise for additional 800 MW at Polaris Forge 2", type: "Contract", detail: "Would expand Polaris Forge 2 to 1 GW and add tens of billions in additional lease value." },
            { date: "Ongoing", event: "ChronoScale (cloud spin-off) operational milestones", type: "Other", detail: "APLD retains ~97% ownership. EKSO Bionics merger vehicle. Unprofitable — potential drag if support needed." },
            { date: "FY2027", event: "Path to NOI >$1B within 5 years", type: "Earnings", detail: "Management target. Requires full occupancy at both campuses." },
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
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: Applied Digital IR, SEC filings (10-K, 8-K), CoreWeave IR, Macquarie partnership announcements, Jamestown Sun, DataCenterDynamics.</div>
      </div>

      {/* Supply Chain & Ecosystem Map */}
      <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Applied Digital Supply Chain &amp; Ecosystem Map</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {[
          { label: "Customers", items: [
            { name: "CoreWeave", sub: "Largest customer — $11B, 400 MW, 15-year leases at Polaris Forge 1", color: "#F59E0B" },
            { name: "U.S. IG Hyperscaler (unnamed)", sub: "~$5B, 200 MW, 15-year lease at Polaris Forge 2. FROR on 800 MW additional", color: "#F59E0B" },
          ]},
          { label: "Applied Digital Platform", items: [
            { name: "Applied Digital", sub: "2 campuses \u00b7 600 MW leased \u00b7 $16B contracted revenue \u00b7 Design PUE 1.18", color: "#3B82F6" },
          ]},
          { label: "GPU Supply", items: [
            { name: "NVIDIA", sub: "Former strategic investor ($160M, Sept 2024). APLD is Preferred Cloud Partner. H100, H200 deployed. Exited equity stake Dec 2025", color: "#10B981" },
          ]},
          { label: "Power & Infrastructure", items: [
            { name: "North Dakota Utilities", sub: "Ellendale & Harwood, ND. Cold climate, low-cost power, fiber connectivity", color: "#10B981" },
          ]},
          { label: "Financing Partners", items: [
            { name: "Macquarie Asset Management", sub: "Up to $5B perpetual preferred equity for campus construction", color: "#10B981" },
            { name: "APLD ComputeCo LLC", sub: "$2.35B 9.25% Senior Secured Notes due 2030", color: "#10B981" },
          ]},
          { label: "Competitors", items: [
            { name: "Core Scientific (CORZ)", sub: "Crypto-to-AI pivot. ~590 MW CoreWeave contracts. $8.7B backlog", color: "#EF4444" },
            { name: "Digital Realty (DLR)", sub: "Global data center REIT. Hyperscale + colocation", color: "#EF4444" },
            { name: "Equinix (EQIX)", sub: "Global interconnection leader. Premium colo", color: "#EF4444" },
            { name: "Vantage Data Centers", sub: "Private (DigitalBridge). Shell/power for hyperscalers", color: "#EF4444" },
            { name: "QTS (Blackstone)", sub: "Private. Acquired for $10B in 2021", color: "#94A3B8" },
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
      <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Flow: Power &amp; Infrastructure → Applied Digital (build, lease, operate) → Customers (CoreWeave, hyperscaler). Financing partners enable capex scale.</div>

      {/* Major Contracts */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Major Contracts</div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>Total contracted lease revenue: ~$16B across 600 MW. All leases are triple-net with 15-year terms.</div>

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
                  cust: "CoreWeave — Polaris Forge 1",
                  value: "~$11B",
                  term: "~15 years",
                  arr: "~$733M implied (at full 400 MW)",
                  delivery: "Building 1 (100 MW) operational Nov 2025. Building 2 (150 MW) mid-2026. Building 3 (150 MW) 2027 option.",
                  gpu: "NVIDIA H100, H200, GB200/GB300 (tenant-installed)",
                  pricing: "Triple-net lease. Tenant responsible for fit-out, power, maintenance.",
                  exit: "Milestone-contingent. CoreWeave restructured leases to SPV (CCAC VIII) with springing guarantees + $50M LOC (Mar 2026).",
                  source: "Applied Digital IR, SEC filings, JSA",
                },
                {
                  cust: "U.S. IG Hyperscaler — Polaris Forge 2",
                  value: "~$5B (initial 200 MW)",
                  term: "~15 years",
                  arr: "~$333M implied",
                  delivery: "Groundbreaking Sept 2025. Initial phases 2026-2027.",
                  gpu: "Tenant-installed",
                  pricing: "Triple-net lease.",
                  exit: "FROR on additional 800 MW. Specific exit terms not publicly disclosed.",
                  source: "Applied Digital IR (Oct 2025 announcement)",
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
        <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 16 }}>2 campuses in North Dakota. 600 MW leased across 2 tenants. Design PUE 1.18. Cold climate, low-cost power, fiber connectivity.</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Leased Capacity</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#10B981" }}>600 MW</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Under Construction</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F59E0B" }}>~450 MW</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Operational</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#3B82F6" }}>100 MW</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Expansion Potential</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#8B5CF6" }}>2 GW+</div>
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
              { loc: "Polaris Forge 1 Building 1 (ELN-02), Ellendale ND", tenant: "CoreWeave", mw: "100 (Phase 1: 50, Phase 2: 50)", status: "Operational", timeline: "Phase 1 Oct 2025, Phase 2 Nov 2025", notes: "First 100 MW delivered on time. ~50K GPU capacity. Design PUE 1.18." },
              { loc: "Polaris Forge 1 Building 2 (ELN-03), Ellendale ND", tenant: "CoreWeave", mw: "150 (6 data halls)", status: "Under Construction", timeline: "Mid-2026", notes: "CoreWeave lease restructured to CCAC VIII SPV (Mar 2026)." },
              { loc: "Polaris Forge 1 Building 3, Ellendale ND", tenant: "CoreWeave (option)", mw: "150 (6 data halls)", status: "Planning", timeline: "2027", notes: "CoreWeave option. Would complete 400 MW campus." },
              { loc: "Polaris Forge 2 Phase 1, Harwood ND", tenant: "IG Hyperscaler", mw: "200 (2 buildings)", status: "Under Construction", timeline: "2026-2027", notes: "Groundbreaking Sept 2025. ~$3B construction budget." },
              { loc: "Polaris Forge 2 Expansion, Harwood ND", tenant: "IG Hyperscaler (FROR)", mw: "Up to 800 additional", status: "Planning", timeline: "TBD", notes: "First right of refusal. Would expand to 1 GW total." },
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 600, color: "#F8FAFC", fontSize: 11 }}>{row.loc}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.tenant}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 700 }}>{row.mw}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                    background: row.status === "Operational" ? "rgba(16,185,129,0.12)" : row.status === "Under Construction" ? "rgba(245,158,11,0.12)" : "rgba(100,116,139,0.12)",
                    color: row.status === "Operational" ? "#10B981" : row.status === "Under Construction" ? "#F59E0B" : "#94A3B8",
                  }}>{row.status}</span>
                </td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>{row.timeline}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: Applied Digital IR, SEC filings (10-K, 8-K), Jamestown Sun, DataCenterDynamics.</div>
      </div>
    </>)}

    {/* ===== ORG CHART SUB-TAB ===== */}
    {apldTab === "orgchart" && (<>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Applied Digital Corporate &amp; Subsidiary Structure</div>
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
          <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>Applied Digital Corporation</div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Parent &middot; Delaware &middot; NASDAQ: APLD</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>S&P: B+</span>
          </div>
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
          { name: "APLD ComputeCo LLC", fullName: "Senior Secured Notes Issuer", tag: "SENIOR SECURED", tagBg: "rgba(239,68,68,0.12)", tagColor: "#EF4444", color: "#EF4444", border: "1px solid #1E293B",
            outstanding: "$2.35B", capacity: "$2.35B", rate: "9.250% fixed", maturity: "2030",
            gpus: "N/A (holding company for data center assets)", collateral: "First priority lien on substantially all ComputeCo assets", guarantor: "Guaranteed by APLD and certain subsidiaries", ringFenced: "Yes", sub: "Direct subsidiary \u00b7 Delaware" },
          { name: "APLD ELN-02 LLC", fullName: "Polaris Forge 1, Bldg 1", tag: "OPERATING", tagBg: "rgba(16,185,129,0.12)", tagColor: "#10B981", color: "#10B981", border: "1px solid #1E293B",
            outstanding: "Operational — 100 MW", capacity: "100 MW", rate: "Lease payments + $50M LOC credit support", maturity: "~15 year triple-net",
            gpus: "CoreWeave (via CCAC VIII SPV)", collateral: "Phase 1 & 2 delivered on schedule. CoreWeave springing guarantee from Parent.", guarantor: "N/A — operating entity", ringFenced: "N/A", sub: "Subsidiary \u00b7 Delaware" },
          { name: "APLD ELN-03 LLC", fullName: "Polaris Forge 1, Bldg 2", tag: "UNDER BUILD", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B", border: "1px solid #1E293B",
            outstanding: "Under construction — 150 MW", capacity: "150 MW", rate: "~15 year triple-net", maturity: "Mid-2026 RFS",
            gpus: "CoreWeave (via CCAC VIII SPV)", collateral: "6 data halls. Lease restructured Mar 2026.", guarantor: "N/A — under construction", ringFenced: "N/A", sub: "Subsidiary \u00b7 Delaware" },
          { name: "APLD DevCo LLC", fullName: "Development Entity", tag: "DEVELOPMENT", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6", color: "#3B82F6", border: "1px solid #1E293B",
            outstanding: "Active draws", capacity: "$100M+ facility", rate: "Not disclosed", maturity: "Macquarie Group (Commodities & Global Markets)",
            gpus: "Pre-lease development of new campus sites", collateral: "Closed Dec 2025. Funds early-stage site development before campus-level financing.", guarantor: "N/A — development entity", ringFenced: "N/A", sub: "Direct subsidiary \u00b7 Delaware" },
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

      {/* === FINANCING STRUCTURE CARD === */}
      <div style={s.card}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Macquarie Perpetual Preferred Equity</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#3B82F6", marginBottom: 6 }}>Facility Size</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              Up to <span style={{ fontWeight: 700, color: "#F8FAFC" }}>$5.0B</span>
            </div>
          </div>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#3B82F6", marginBottom: 6 }}>Partner</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              Macquarie Asset Management
            </div>
          </div>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#3B82F6", marginBottom: 6 }}>Structure</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              Perpetual preferred equity via JV partnership
            </div>
          </div>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 6 }}>Purpose</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              Fund Polaris Forge 1 &amp; 2 construction
            </div>
          </div>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 6 }}>First Draw</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              $787.5M completed by Nov 2025
            </div>
          </div>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B", marginBottom: 6 }}>Dilution</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              Involves common share issuance — dilutive to APLD shareholders
            </div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 12, lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700, color: "#F8FAFC" }}>Notes:</span> Largest single capital commitment. Non-debt structure avoids leverage covenants but dilutes equity.
        </div>
      </div>

      {/* === KEY INVESTORS === */}
      <div style={s.card}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Key Investors</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { name: "Macquarie Asset Management", detail: "Up to $5B preferred equity partner", color: "#3B82F6" },
            { name: "NVIDIA", detail: "Former strategic investor ($160M, Sept 2024) — exited position Dec 2025", color: "#10B981" },
            { name: "Related Companies", detail: "Participated in $160M raise (Sept 2024)", color: "#F59E0B" },
          ].map((inv, i) => (
            <div key={i} style={{ flex: "1 1 250px", minWidth: 250, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: inv.color, marginBottom: 6 }}>{inv.name}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: "1.6" }}>{inv.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Sources: Applied Digital IR, SEC filings (10-K FY2025, 8-K filings), StockTitan, Macquarie partnership announcements.</div>
    </>)}

    {/* ===== CONTRACTS SUB-TAB ===== */}
    {apldTab === "contracts" && (<>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Supply Side &amp; Customer Contracts</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>Total contracted lease revenue: ~$16B across 600 MW. Projected NOI &gt;$1B within 5 years. All leases are triple-net with 15-year terms.</div>

      {/* Contract Comparison */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Contract Comparison</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                {["Metric", "CoreWeave (Polaris Forge 1)", "IG Hyperscaler (Polaris Forge 2)"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { metric: "Contract Value", crwv: "$11B", hyper: "~$5B" },
                { metric: "Term", crwv: "~15 yr", hyper: "~15 yr" },
                { metric: "MW Committed", crwv: "400 MW (3 buildings)", hyper: "200 MW (2 buildings)" },
                { metric: "Annual Run Rate (implied)", crwv: "~$733M", hyper: "~$333M" },
                { metric: "GPU Type", crwv: "Tenant-installed (H100/H200/GB200)", hyper: "Tenant-installed" },
                { metric: "Lease Structure", crwv: "Triple-net lease", hyper: "Triple-net lease" },
                { metric: "Credit Support", crwv: "CCAC VIII SPV (A3-rated) + $50M LOC + springing guarantees", hyper: "Investment-grade tenant (implied AA-/A-tier)" },
                { metric: "Exit / Termination", crwv: "Milestone-contingent delivery", hyper: "Not publicly disclosed" },
                { metric: "Expansion Options", crwv: "Building 3 is an option held by CoreWeave", hyper: "FROR on 800 MW additional capacity" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.metric}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#10B981" }}>{row.crwv}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#F59E0B" }}>{row.hyper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CoreWeave Contract Deep Dive */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#10B981" }}>CoreWeave — $11B Anchor Tenant</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" }}>Total Contract</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>$11B</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Total Value", value: "$11B", sub: "" },
            { label: "Term", value: "~15 years", sub: "" },
            { label: "MW", value: "400", sub: "3 buildings" },
            { label: "Credit", value: "A3 (SPV)", sub: "BB (Parent)" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "10px 14px", flex: "1 1 130px", minWidth: 130 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>{m.value}</div>
              {m.sub && <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{m.sub}</div>}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Structure</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <tbody>
            {[
              { term: "Buildings", detail: "ELN-02 (100 MW, operational), ELN-03 (150 MW, mid-2026), Building 3 (150 MW, 2027 option)" },
              { term: "Lease Restructuring", detail: "Mar 30, 2026: ELN-02 portions and entirety of ELN-03 transferred to CoreWeave Compute Acquisition Co. VIII, LLC" },
              { term: "Credit Enhancements", detail: "Unconditional springing guarantees from CoreWeave Parent + $50M letter of credit on ELN-02" },
              { term: "SPV Rating", detail: "SPV rated A3 (Moody's) — significantly above CoreWeave's BB corporate rating" },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 200, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Risk</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <tbody>
            {[
              { term: "Concentration", detail: "CoreWeave is ~69% of APLD's total contracted value ($11B of $16B)" },
              { term: "CoreWeave Leverage", detail: "CoreWeave Parent is itself highly leveraged ($21.4B debt, BB corporate)" },
              { term: "Guarantee Conditions", detail: "Springing guarantee only activates under specific conditions" },
              { term: "Default Scenario", detail: "If CoreWeave defaults, APLD retains the physical data center but must find new tenants in a market with limited alternatives at this scale" },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 200, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hyperscaler Contract Card */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F59E0B" }}>U.S. IG Hyperscaler — $5B</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" }}>Total Contract</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>~$5B</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Total Value", value: "~$5B", sub: "" },
            { label: "Term", value: "~15 years", sub: "" },
            { label: "MW", value: "200", sub: "initial" },
            { label: "Expansion", value: "FROR on 800 MW", sub: "" },
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
              { term: "Identity", detail: "Confidential. Speculated to be FAANG-tier (Microsoft, Meta, Oracle, Amazon, or Google)" },
              { term: "Credit Quality", detail: "Investment-grade credit significantly reduces counterparty risk vs. CoreWeave" },
              { term: "FROR Upside", detail: "FROR on 800 MW would expand Polaris Forge 2 to 1 GW and potentially add $20B+ in additional lease value" },
              { term: "Timeline", detail: "Announced Oct 2025, construction began Sept 2025" },
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
            { title: "Customer Concentration", desc: "CoreWeave = 69% of contracted revenue. Top 2 = 100%. No revenue diversification beyond 2 tenants.", color: "#EF4444" },
            { title: "CoreWeave Counterparty Risk", desc: "CoreWeave carries $21.4B in debt with BB corporate rating. SPV restructuring mitigates but doesn't eliminate risk. Springing guarantee is conditional.", color: "#EF4444" },
            { title: "Construction Execution", desc: "Building 2 (150 MW) and Polaris Forge 2 (200 MW) both under construction simultaneously. Transformer, switchgear, and cooling supply chain risks. Any delay defers revenue while debt service continues.", color: "#F59E0B" },
            { title: "Leverage", desc: "$2.35B in 9.25% senior secured notes on an unprofitable company. Deeply negative free cash flow (-$6.38/share). Zero margin for error on execution.", color: "#EF4444" },
            { title: "Dilution", desc: "Macquarie perpetual preferred equity facility involves common share issuance. Additional draws will further dilute existing shareholders. Exact dilution mechanics tied to APLD stock price.", color: "#F59E0B" },
            { title: "Geographic Concentration", desc: "Both campuses in North Dakota. Single-state regulatory, weather, or utility risk. Power interconnection dependencies.", color: "#F59E0B" },
          ].map((item, i) => (
            <div key={i} style={{ flex: "1 1 280px", minWidth: 280, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: "1.6" }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 14, fontStyle: "italic" }}>Sources: Applied Digital IR, SEC filings (10-K, 8-K), CoreWeave SEC filings, Macquarie partnership announcements.</div>
      </div>
    </>)}

    {/* ===== SENTIMENT SUB-TAB ===== */}
    {apldTab === "sentiment" && (<>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Market Sentiment</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>12 analysts. All Buy. Avg PT ~$48. Short interest ~27-33% of float. Q3 earnings Apr 8.</div>

      {/* Consensus Snapshot */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Consensus Rating", value: "Strong Buy", sub: "12/12 Buy", color: "#10B981" },
          { label: "Avg Price Target", value: "~$48", sub: "Range: $36 – $81", color: "#3B82F6" },
          { label: "PT Range", value: "$36 – $81", sub: "", color: "#F8FAFC" },
          { label: "Short Interest", value: "~27-33%", sub: "of float", color: "#F59E0B" },
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
            { phase: "Current (Apr 2026)", sentiment: "Cautious Optimism", color: "#8B5CF6", desc: "Q3 earnings Apr 8. Stock ~$24-25. High short interest (27-33%). Market watching: Building 2 progress, cash burn, dilution from Macquarie draws." },
            { phase: "Execution Phase (Nov 2025 – Mar 2026)", sentiment: "Mixed", color: "#F59E0B", desc: "Building 1 delivered on time. Q2 revenue $126.6M (+250% YoY). But NVIDIA exited stake (Dec 2025), 9.25% debt raised concerns. Stock volatile ($18-$38 range)." },
            { phase: "Landmark Leases (May – Oct 2025)", sentiment: "Euphoric", color: "#3B82F6", desc: "$11B CoreWeave + $5B hyperscaler announcements. Stock hit ATH $42.27. Bulls saw REIT-like recurring revenue." },
            { phase: "NVIDIA Validation (Sept 2024)", sentiment: "Bullish Catalyst", color: "#10B981", desc: "$160M strategic investment. Stock surged. Institutional credibility boost." },
            { phase: "AI Pivot (2023)", sentiment: "Re-Rating", color: "#F59E0B", desc: "Renamed. Announced HPC strategy. Stock began re-rating. Sai Computing launched." },
            { phase: "Pre-Pivot (2021-2022)", sentiment: "Ignored", color: "#94A3B8", desc: "Crypto mining company. Low institutional interest. Stock under $5." },
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
                { firm: "B. Riley", analyst: "Lucas Pipes", rating: "Buy", pt: "$58", date: "Mar 2026", thesis: "Best-in-class AI infrastructure execution; $16B backlog underappreciated" },
                { firm: "Lake Street", analyst: "Rob Stimpson", rating: "Buy", pt: "$50", date: "Mar 2026", thesis: "Polaris Forge delivery de-risks revenue; REIT-like cash flows emerging" },
                { firm: "Northland Capital", analyst: "Mike Grondahl", rating: "Outperform", pt: "$45", date: "Feb 2026", thesis: "Q2 beat validates model; Building 2 on track" },
                { firm: "Macquarie", analyst: "Paul Golding", rating: "Outperform", pt: "$44", date: "Jan 2026", thesis: "Macquarie facility provides long-term capital visibility" },
                { firm: "D.A. Davidson", analyst: "Gil Luria", rating: "Buy", pt: "$52", date: "Feb 2026", thesis: "$16B contracted revenue provides exceptional visibility" },
                { firm: "Rosenblatt", analyst: "Mike Husseini", rating: "Buy", pt: "$81", date: "Mar 2026", thesis: "Most bullish; sees FROR exercise as massive upside catalyst" },
                { firm: "Roth Capital", analyst: "Darren Aftahi", rating: "Buy", pt: "$43", date: "Jan 2026", thesis: "CoreWeave credit enhancements de-risk anchor tenant" },
                { firm: "Benchmark", analyst: "Mark Palmer", rating: "Buy", pt: "$36", date: "Feb 2026", thesis: "Most conservative; concerned about dilution and execution timeline" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.firm}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.analyst}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                      background: row.rating.includes("Buy") || row.rating.includes("Outperform") ? "rgba(16,185,129,0.12)" : row.rating.includes("Sell") || row.rating.includes("Underperform") ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                      color: row.rating.includes("Buy") || row.rating.includes("Outperform") ? "#10B981" : row.rating.includes("Sell") || row.rating.includes("Underperform") ? "#EF4444" : "#F59E0B",
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
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>NOTE: Analyst names and specific targets are approximate and should be verified against Bloomberg/FactSet. The consensus direction (all Buy) is confirmed across multiple sources.</div>
      </div>

      {/* Market Positioning */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Market Positioning</div>

        {/* Insider Selling */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Insider Activity</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 20 }}>
          <thead>
            <tr>
              {["Date", "Insider", "Title", "Action", "Shares", "Value", "Notes"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { date: "Jan 16, 2026", insider: "Wes Cummins", title: "CEO & Chairman", action: "Sell", shares: "165,000 shares", value: "$6.01M", notes: "10b5-1 plan (assumed)" },
              { date: "Jan 30, 2026", insider: "Chuck Hastings", title: "Director", action: "Sell", shares: "45,987 shares", value: "$1.77M", notes: "" },
              { date: "Jan 15, 2026", insider: "Richard Nottenburg", title: "Director", action: "Sell", shares: "12,000 shares", value: "$425K", notes: "" },
              { date: "Jan 2026", insider: "Richard Nottenburg", title: "Director", action: "Sell", shares: "23,606 shares", value: "$835K", notes: "" },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.date}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", fontSize: 11 }}>{row.insider}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.title}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "rgba(239,68,68,0.12)", color: "#EF4444" }}>{row.action}</span>
                </td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.shares}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.value}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.7 }}>
            <span style={{ fontWeight: 700, color: "#EF4444" }}>Net insider activity: ALL SELLING.</span> No insider purchases identified. $9.0M total sold in ~3 months.
          </div>
        </div>

        {/* Institutional Ownership */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Institutional Ownership</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "Institutional", value: "~63-72%", color: "#3B82F6" },
            { label: "Insider", value: "~11%", sub: "Wes Cummins ~8%", color: "#F59E0B" },
            { label: "Retail", value: "~25%", color: "#94A3B8" },
            { label: "Total Holders", value: "~556", sub: "institutional", color: "#F8FAFC" },
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
              { label: "Short % of Float", value: "~27-33%", color: "#EF4444" },
              { label: "Short Shares", value: "~80M+", color: "#F59E0B" },
            ].map((m, i) => (
              <div key={i} style={{ flex: "1 1 140px", minWidth: 140 }}>
                <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.7 }}>
            Among the most shorted stocks in the technology sector. High short interest creates squeeze potential but also reflects significant bearish conviction on execution/leverage risk.
          </div>
        </div>

        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Sources: Applied Digital IR, MarketBeat, TipRanks, SEC filings (Form 4), FINRA short interest reports, Investing.com insider transactions.</div>
      </div>
    </>)}

    </>
  );
}
