import React, { useState } from "react";

const T_ = {
  bg: "#0a0e17", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347", borderLight: "#222d40",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", blue: "#70b0fa",
};
const FONT = "'Inter', 'DM Sans', 'Segoe UI', sans-serif";
const s = {
  card: { background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 16 },
  section: { marginBottom: 36 },
  sectionHdr: { fontSize: 14, fontWeight: 500, color: T_.textDim, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${T_.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: FONT },
  sectionDate: { fontSize: 12, fontWeight: 400, color: T_.textGhost, fontFamily: FONT },
  newsScroll: { maxHeight: 400, overflowY: "auto", paddingRight: 8, scrollbarWidth: "thin", scrollbarColor: `${T_.border} transparent` },
  newsItem: { padding: "14px 0", borderBottom: `1px solid ${T_.borderLight}` },
  btnSmall: { padding: "4px 12px", fontSize: 12, border: `1px solid ${T_.border}`, background: "transparent", color: T_.textDim, borderRadius: 5, cursor: "pointer", fontFamily: FONT },
};

function fmtShort(d) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }

export default function TractCapitalReview({ curNews, newsLoading, refreshNews, companyId, companyName }) {
  const [tractTab, setTractTab] = useState("recent");

  return (
    <>
      {/* Tract Capital Sub-Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #1E293B" }}>
        {[{ key: "recent", label: "Recent Updates" }, { key: "overview", label: "Overview" }, { key: "orgchart", label: "Org Chart" }, { key: "contracts", label: "Contracts" }, { key: "sentiment", label: "Sentiment" }].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTractTab(tab.key)}
            style={{
              padding: "8px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
              background: "transparent",
              color: tractTab === tab.key ? "#F8FAFC" : "#64748B",
              borderBottom: tractTab === tab.key ? "2px solid #3B82F6" : "2px solid transparent",
              marginBottom: -1, transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== RECENT UPDATES TAB ===== */}
      {tractTab === "recent" && (
        <div style={s.section}>
          <div style={s.sectionHdr}>
            <span>Recent updates</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {curNews?.date && <span style={s.sectionDate}>Fetched {fmtShort(curNews.date)}</span>}
              <button style={s.btnSmall} onClick={() => refreshNews(companyId)} disabled={newsLoading}>
                {newsLoading ? "Fetching..." : "Refresh news"}
              </button>
            </div>
          </div>
          <div style={s.newsScroll}>
            {newsLoading && !curNews && (
              <div style={{ color: T_.textDim, fontSize: 14, padding: "20px 0", fontStyle: "italic", lineHeight: 1.7 }}>Searching for recent news about {companyName}...</div>
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
            {!curNews && !newsLoading && (
              <div style={{ color: T_.textDim, fontSize: 14, padding: "16px 0", lineHeight: 1.7 }}>Click "Refresh news" to pull the latest updates about {companyName}.</div>
            )}
          </div>
        </div>
      )}

      {/* ===== OVERVIEW TAB ===== */}
      {tractTab === "overview" && (<>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Tract Capital (Private)</div>
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
            { date: "Feb 24", event: "Fleet Data Centers closes $3.8B senior secured notes offering", type: "Financing", detail: "5.875% rate. Funds hyperscale facility in Reno/Storey County NV for NVIDIA. Upsized from original." },
            { date: "Feb 2026", event: "NVIDIA signs 200 MW triple-net lease at Storey County NV", type: "Contract", detail: "197-month term (~16.4 years). Fleet's first named hyperscaler tenant. Bloomberg confirmed." },
            { date: "2026", event: "Buckeye AZ campus development begins", type: "Capacity", detail: "2,069 acres. 1.8 GW planned. $20B+ project value. Acquired for $136M." },
            { date: "2026", event: "Virginia (Hanover) campus development", type: "Capacity", detail: "2.4 GW planned. East coast presence." },
            { date: "Ongoing", event: "Additional hyperscaler lease negotiations", type: "Contract", detail: "25+ GW pipeline across 29 facilities creates massive leasing optionality." },
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
            { date: "2026-2027", event: "Storey County NV facility energization for NVIDIA", type: "Capacity", detail: "200 MW initial. Fleet's flagship campus." },
            { date: "2027", event: "Caldwell County TX campus development", type: "Capacity", detail: "1,515 acres. 2+ GW planned." },
            { date: "2027+", event: "Additional Fleet Data Centers campus announcements", type: "Capacity", detail: "Fleet targets 500 MW+ single-tenant build-to-suit campuses." },
            { date: "Ongoing", event: "Tract land platform — new site acquisitions and entitlements", type: "Other", detail: "25,000+ acres across ~13 markets. Continuous pipeline development." },
            { date: "TBD", event: "Potential IPO or additional private funding round", type: "Financing", detail: "Company has raised ~$1.7B in equity. Scale may warrant public listing." },
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
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: Fleet Data Centers IR, Bloomberg, DataCenterDynamics, Data Center Frontier, Baxtel, AZ Big Media, Kirkland &amp; Ellis PR, Milbank PR.</div>
      </div>

      {/* Supply Chain & Ecosystem Map */}
      <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Tract Capital Supply Chain &amp; Ecosystem Map</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {[
          { label: "Customers", items: [
            { name: "NVIDIA", sub: "200 MW triple-net lease, Storey County NV. 197-month term. First named Fleet tenant", color: "#F59E0B" },
            { name: "Additional hyperscalers (pipeline)", sub: "25+ GW across 29 facilities available for lease-up", color: "#F59E0B" },
          ]},
          { label: "Tract Capital Platform", items: [
            { name: "Tract (Land Platform)", sub: "25,000+ acres \u00b7 ~13 markets \u00b7 Acquires land, secures power/fiber/zoning/entitlements \u00b7 Creates shovel-ready campuses", color: "#3B82F6" },
            { name: "Fleet Data Centers", sub: "Vertical development \u00b7 500 MW+ single-tenant build-to-suit \u00b7 Launched Jan 2025", color: "#3B82F6" },
          ]},
          { label: "Power & Infrastructure", items: [
            { name: "Multi-market power procurement", sub: "TX, AZ, NV, UT, VA, MN, IA, IL, NC. Utility-scale grid connections", color: "#10B981" },
          ]},
          { label: "Financing", items: [
            { name: "$3.8B Senior Secured Notes", sub: "5.875%, for Storey County NV NVIDIA facility", color: "#10B981" },
            { name: "~$1.7B equity raised", sub: "Berkshire Partners, PSP Partners, Permira, S2G, Columbia Capital", color: "#10B981" },
          ]},
          { label: "Competitors", items: [
            { name: "QTS (Blackstone)", sub: "Private. Hyperscale data centers. Acquired for $10B", color: "#EF4444" },
            { name: "Vantage Data Centers (DigitalBridge)", sub: "Private. Shell/power for hyperscalers", color: "#EF4444" },
            { name: "Digital Realty (DLR)", sub: "Public REIT. Global hyperscale + colocation", color: "#EF4444" },
            { name: "Equinix (EQIX)", sub: "Public REIT. Global interconnection", color: "#EF4444" },
            { name: "Applied Digital (APLD)", sub: "Public. Polaris Forge campuses", color: "#94A3B8" },
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
      <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Flow: Power &amp; Infrastructure → Tract (land, entitlements) → Fleet Data Centers (build, lease) → Customers (NVIDIA, hyperscalers). Financing partners enable capex scale.</div>

      {/* Major Contracts */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Major Contracts</div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>One confirmed named hyperscaler tenant (NVIDIA). 200 MW triple-net lease. $3.8B bond-financed.</div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>Customer Contracts</div>
        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 900 }}>
            <thead>
              <tr>
                {["Customer", "Location", "MW", "Term", "Lease Type", "Financing", "Source"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  cust: "NVIDIA",
                  location: "Storey County (Virginia City Highlands), NV",
                  mw: "200 MW",
                  term: "197 months (~16.4 years)",
                  leaseType: "Triple-net",
                  financing: "$3.8B 5.875% senior secured notes (Fleet Data Centers). Closed Feb 24, 2026. Upsized from original.",
                  source: "Bloomberg, Fleet Data Centers IR, Kirkland & Ellis PR, Milbank PR",
                },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#3B82F6", whiteSpace: "nowrap" }}>{row.cust}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.location}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F8FAFC", fontWeight: 600 }}>{row.mw}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.term}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8" }}>{row.leaseType}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F59E0B", fontSize: 11 }}>{row.financing}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Note: NVIDIA is the only publicly confirmed named tenant for Fleet Data Centers. Additional hyperscaler negotiations are ongoing across the 25+ GW pipeline.</div>
      </div>

      {/* Data Center Footprint */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Data Center Footprint</div>
        <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 16 }}>25,000+ acres across ~13 markets. 25+ GW planned capacity. ~29 facilities. Horizontal land platform + vertical development (Fleet).</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Total Land</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#10B981" }}>25,000+ acres</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Planned Capacity</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F59E0B" }}>25+ GW</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Facilities</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#3B82F6" }}>~29</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Markets</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#8B5CF6" }}>~13</div>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
          <thead>
            <tr>
              {["Location", "MW Planned", "Status", "Acres", "Notes"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { loc: "Storey County (Virginia City Highlands), NV", mw: "200 MW (initial)", status: "Under Construction", acres: "8,590", notes: "NVIDIA 197-month lease. $3.8B notes. Reno data center hub." },
              { loc: "Buckeye, AZ", mw: "1,800 MW (1.8 GW)", status: "Planning/Development", acres: "2,069", notes: "$136M land acquisition. $20B+ project value. Phoenix metro." },
              { loc: "Caldwell County, TX", mw: "2,000+ MW (2+ GW)", status: "Planning", acres: "1,515", notes: "Central Texas. Grid interconnection in progress." },
              { loc: "Hanover, VA", mw: "2,400 MW (2.4 GW)", status: "Planning", acres: "TBD", notes: "East coast. Near Dominion Energy grid." },
              { loc: "Additional sites (~25)", mw: "TX, UT, MN, IA, IL, NC", status: "Planning/Entitlement", acres: "Various", notes: "Horizontal land platform. Pre-positioned for hyperscaler demand." },
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 600, color: "#F8FAFC", fontSize: 11 }}>{row.loc}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 700 }}>{row.mw}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                    background: row.status === "Under Construction" ? "rgba(245,158,11,0.12)" : row.status === "Planning/Development" ? "rgba(59,130,246,0.12)" : "rgba(100,116,139,0.12)",
                    color: row.status === "Under Construction" ? "#F59E0B" : row.status === "Planning/Development" ? "#3B82F6" : "#94A3B8",
                  }}>{row.status}</span>
                </td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>{row.acres}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: Fleet Data Centers IR, Bloomberg, DataCenterDynamics, Data Center Frontier, Baxtel, AZ Big Media, Kirkland &amp; Ellis PR, Milbank PR.</div>
      </div>
    </>)}

    {/* ===== ORG CHART SUB-TAB ===== */}
    {tractTab === "orgchart" && (<>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Tract Capital Corporate Structure</div>
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
          <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>Tract Capital Management (TCM)</div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Private &middot; Denver, CO &middot; Founded 2022</div>
        </div>
        {/* Connector line */}
        <div style={{ width: 2, height: 24, background: "#1E293B" }} />
      </div>

      {/* === Connector lines from parent to entities === */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 2, height: 20, background: "#1E293B" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
        <div style={{ width: "60%", height: 2, background: "#1E293B", position: "relative" }}>
          {[0, 100].map(p => (
            <div key={p} style={{ position: "absolute", left: `${p}%`, top: -4, width: 2, height: 10, background: "#1E293B", transform: "translateX(-1px)" }} />
          ))}
        </div>
      </div>

      {/* Platform Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { name: "Tract (Land Platform)", tag: "HORIZONTAL", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6", color: "#3B82F6", border: "1px solid #1E293B",
            purpose: "Acquires raw land, pre-positions power/fiber/zoning/entitlements",
            scale: "25,000+ acres, ~29 facilities, ~13 markets",
            output: "Shovel-ready data center campuses sold/leased to developers and hyperscalers",
            notes: "Asset-light model. Creates value through entitlement and infrastructure pre-positioning." },
          { name: "Fleet Data Centers", tag: "VERTICAL", tagBg: "rgba(16,185,129,0.12)", tagColor: "#10B981", color: "#10B981", border: "1px solid #1E293B",
            purpose: "Builds mega-scale 500 MW+ single-tenant campuses",
            scale: "Launched Jan 2025",
            output: "First Deal: NVIDIA 200 MW, Storey County NV. Financing: $3.8B 5.875% senior secured notes",
            notes: "Build-to-suit model. Triple-net leases. Targets hyperscaler tenants." },
        ].map((e, i) => (
          <div key={i} style={{ background: "#111827", border: e.border, borderRadius: 8, padding: "12px 12px 10px", position: "relative", minWidth: 0 }}>
            <div style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: e.tagBg, color: e.tagColor, fontWeight: 600, display: "inline-block", marginBottom: 6 }}>{e.tag}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC", marginBottom: 2, lineHeight: 1.2 }}>{e.name}</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.7, marginTop: 8 }}>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Purpose:</span> {e.purpose}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Scale:</span> {e.scale}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Output:</span> {e.output}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Notes:</span> {e.notes}</div>
            </div>
          </div>
        ))}
      </div>

      {/* === KEY LEADERSHIP === */}
      <div style={s.card}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Key Leadership</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                {["Name", "Role", "Prior Experience", "Notable"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Grant van Rooyen", role: "CEO", exp: "Cologix (founded, $4B recap), Teraco ($3.5B sale), Level 3 (12 yrs)", notable: "Proven data center builder and operator" },
                { name: "Chris Vonderhaar", role: "President, Fleet", exp: "AWS (13 yrs, 30 regions, 4+ GW), Google Cloud", notable: "Built hyperscale infrastructure at the largest scale" },
                { name: "Nat Sahlstrom", role: "Chief Energy Officer", exp: "Amazon (global energy head)", notable: "Deep expertise in data center power procurement" },
                { name: "Matt Spencer", role: "President, Tract", exp: "35+ yrs telecom/infrastructure", notable: "Land and infrastructure development veteran" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.name}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600 }}>{row.role}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 11 }}>{row.exp}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.notable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* === KEY INVESTORS === */}
      <div style={s.card}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Key Investors</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          {[
            { name: "Berkshire Partners", detail: "Lead investor (2023). $16B AUM. Growth equity focus.", color: "#3B82F6" },
            { name: "PSP Partners", detail: "Strategic infrastructure investor", color: "#10B981" },
            { name: "Permira", detail: "$80B+ AUM. Growth equity in Tract", color: "#F59E0B" },
            { name: "S2G Ventures", detail: "Sustainable infrastructure focus", color: "#10B981" },
            { name: "Columbia Capital", detail: "Telecom/infrastructure specialist. Early Tract backer.", color: "#3B82F6" },
            { name: "Van Rooyen Family", detail: "$50M seed capital", color: "#F8FAFC" },
          ].map((inv, i) => (
            <div key={i} style={{ flex: "1 1 250px", minWidth: 250, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: inv.color, marginBottom: 6 }}>{inv.name}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: "1.6" }}>{inv.detail}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.7 }}>
            <span style={{ fontWeight: 700, color: "#3B82F6" }}>Total equity raised: ~$1.7B.</span> Institutional backing from top-tier PE and infrastructure-focused investors validates the platform thesis.
          </div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Sources: Fleet Data Centers IR, Bloomberg, DataCenterDynamics, Data Center Frontier, Crunchbase, PitchBook.</div>
    </>)}

    {/* ===== CONTRACTS SUB-TAB ===== */}
    {tractTab === "contracts" && (<>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Contracts &amp; Pipeline</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>One confirmed named hyperscaler tenant. 25+ GW development pipeline across ~29 facilities positions Tract/Fleet as a major land and development platform for AI data center demand.</div>

      {/* NVIDIA Contract Card */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#10B981" }}>NVIDIA — Storey County NV</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" }}>First Named Tenant</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>200 MW</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Tenant", value: "NVIDIA", sub: "" },
            { label: "MW", value: "200", sub: "" },
            { label: "Term", value: "197 months", sub: "~16.4 years" },
            { label: "Financing", value: "$3.8B notes", sub: "at 5.875%" },
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
              { term: "Location", detail: "Storey County (Virginia City Highlands), NV — part of Reno data center hub" },
              { term: "Lease Type", detail: "Triple-net" },
              { term: "Financing", detail: "Fleet Data Centers $3.8B senior secured notes (closed Feb 24, 2026)" },
              { term: "Tenant Confirmation", detail: "Bloomberg reported NVIDIA as the named tenant" },
              { term: "Notes Sizing", detail: "Pricing was originally planned at lower size, upsized due to demand" },
              { term: "Advisors", detail: "Kirkland & Ellis and Milbank advised on the transaction" },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 200, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pipeline Summary Card */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F59E0B" }}>Development Pipeline</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" }}>Total Pipeline</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>25+ GW</div>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <tbody>
            {[
              { term: "Total Land", detail: "25,000+ acres across ~13 markets" },
              { term: "Facilities", detail: "~29 facilities planned" },
              { term: "Total Capacity", detail: "25+ GW total planned capacity" },
              { term: "Key Markets", detail: "TX (multiple), AZ (Buckeye 1.8 GW), NV (Storey County), VA (Hanover 2.4 GW), UT, MN, IA, IL, NC" },
              { term: "Platform Model", detail: "Tract land platform creates shovel-ready sites; Fleet builds on top" },
              { term: "Optionality", detail: "Not all sites will necessarily be developed — optionality for Tract to sell entitled land to third-party developers" },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 200, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Risk Factors */}
      <div style={s.card}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>Risk Factors</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { title: "Private / Opaque", desc: "No public financial reporting. Limited visibility into cash flows, debt covenants, profitability. Investors must rely on press releases and bond offering documents.", color: "#EF4444" },
            { title: "Junk-Bond Financing", desc: "$3.8B 5.875% notes are high-yield (sub-investment-grade). If NVIDIA or future tenants don't perform, debt service could be challenging.", color: "#EF4444" },
            { title: "Massive Execution Scope", desc: "25+ GW across 29 facilities is extraordinarily ambitious. Most sites are in early planning. Converting land to operational data centers requires years and billions in capital.", color: "#F59E0B" },
            { title: "Community Opposition", desc: "At least 2 Tract sites have faced local opposition and failed. NIMBY risk is real for large-scale data center development.", color: "#F59E0B" },
            { title: "AI Demand Cyclicality", desc: "Pipeline assumes sustained hyperscaler demand for 5-10+ years. An AI spending downturn would reduce lease-up velocity.", color: "#F59E0B" },
            { title: "Single Named Tenant", desc: "Only NVIDIA confirmed. Pipeline value depends on signing additional hyperscaler tenants. Competition from QTS, Vantage, DLR, EQIX for same tenants.", color: "#EF4444" },
          ].map((item, i) => (
            <div key={i} style={{ flex: "1 1 280px", minWidth: 280, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: "1.6" }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 14, fontStyle: "italic" }}>Sources: Fleet Data Centers IR, Bloomberg, DataCenterDynamics, bond offering documents, community reporting.</div>
      </div>
    </>)}

    {/* ===== SENTIMENT SUB-TAB ===== */}
    {tractTab === "sentiment" && (<>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Market Position &amp; Investor Sentiment</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>Tract Capital is private — no public analyst coverage, no short interest, no stock price. Sentiment is assessed through institutional backing, leadership credibility, and competitive positioning.</div>

      {/* Company Profile Card */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Status", value: "Private", sub: "", color: "#94A3B8" },
          { label: "Total Equity Raised", value: "~$1.7B", sub: "", color: "#10B981" },
          { label: "Total Debt", value: "$3.8B", sub: "Fleet notes", color: "#F59E0B" },
          { label: "Competitive Position", value: "Largest", sub: "dedicated AI DC land platform", color: "#3B82F6" },
        ].map((m, i) => (
          <div key={i} style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: "14px 18px", flex: "1 1 180px", minWidth: 180 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Strategic Positioning Timeline */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Strategic Positioning Timeline</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { phase: "Formation (2022)", sentiment: "Genesis", color: "#94A3B8", desc: "Grant van Rooyen founds Tract Capital. $50M family seed. Vision: acquire and pre-position land for data center boom." },
            { phase: "Berkshire Investment (2023)", sentiment: "Institutional Validation", color: "#3B82F6", desc: "Berkshire Partners leads institutional round. Tract begins aggressive land acquisition across multiple states." },
            { phase: "Scale-Up (2024)", sentiment: "Rapid Growth", color: "#10B981", desc: "Portfolio grows to 25,000+ acres. Additional investors: PSP Partners, Permira, S2G, Columbia Capital. ~$1.7B total equity." },
            { phase: "Fleet Launch (Jan 2025)", sentiment: "Vertical Integration", color: "#F59E0B", desc: "Vertical development platform Fleet Data Centers launched. Targets 500 MW+ single-tenant build-to-suit campuses." },
            { phase: "NVIDIA Deal (Feb 2026)", sentiment: "Breakthrough", color: "#10B981", desc: "Fleet's first named tenant. 200 MW triple-net lease. $3.8B bond offering. Bloomberg coverage. Institutional validation." },
            { phase: "Current (Apr 2026)", sentiment: "Executing", color: "#8B5CF6", desc: "Executing on NV campus for NVIDIA. Developing AZ (1.8 GW) and VA (2.4 GW) campuses. Pipeline of 25+ GW positions Tract as a key infrastructure layer for AI." },
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

      {/* Leadership Credibility Card */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Management Track Record</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 800 }}>
            <thead>
              <tr>
                {["Name", "Role", "Prior Experience", "Notable"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Grant van Rooyen", role: "CEO", exp: "Cologix (founded, $4B recap), Teraco ($3.5B sale), Level 3 (12 yrs)", notable: "Proven data center builder and operator" },
                { name: "Chris Vonderhaar", role: "President, Fleet", exp: "AWS (13 yrs, 30 regions, 4+ GW), Google Cloud", notable: "Built hyperscale infrastructure at the largest scale" },
                { name: "Nat Sahlstrom", role: "Chief Energy Officer", exp: "Amazon (global energy head)", notable: "Deep expertise in data center power procurement" },
                { name: "Matt Spencer", role: "President, Tract", exp: "35+ yrs telecom/infrastructure", notable: "Land and infrastructure development veteran" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.name}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600 }}>{row.role}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 11, maxWidth: 350 }}>{row.exp}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.notable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>NOTE: Leadership team has collectively built, operated, or financed data center platforms worth $10B+. Deep hyperscaler relationships (AWS, NVIDIA) are a key competitive advantage.</div>
      </div>

      {/* Investor Base Card */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Investor Base</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 600 }}>
            <thead>
              <tr>
                {["Investor", "Type", "Notable"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { investor: "Berkshire Partners", type: "PE (lead investor)", notable: "$16B AUM. Growth equity focus." },
                { investor: "PSP Partners", type: "Family office", notable: "Strategic infrastructure investor" },
                { investor: "Permira", type: "PE", notable: "$80B+ AUM. Growth equity in Tract" },
                { investor: "S2G Ventures", type: "Impact/infrastructure", notable: "Sustainable infrastructure focus" },
                { investor: "Columbia Capital", type: "VC/Growth", notable: "Telecom/infrastructure specialist. Early Tract backer." },
                { investor: "Van Rooyen Family", type: "Founder", notable: "$50M seed capital" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.investor}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600 }}>{row.type}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 12 }}>{row.notable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 16, marginTop: 16 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            {[
              { label: "Key Investors", value: "Berkshire Partners, PSP Partners, Permira, Columbia Capital", color: "#3B82F6" },
            ].map((m, i) => (
              <div key={i} style={{ flex: "1 1 140px", minWidth: 140 }}>
                <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.7 }}>
            Tract Capital is private — no public short interest, no analyst coverage, no stock price. Investor sentiment is inferred from the quality and scale of institutional backing, the NVIDIA lease validation, and the $3.8B bond market reception (upsized due to demand).
          </div>
        </div>

        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginTop: 14 }}>Sources: Fleet Data Centers IR, Bloomberg, DataCenterDynamics, Crunchbase, PitchBook, Kirkland &amp; Ellis PR, Milbank PR.</div>
      </div>
    </>)}

    </>
  );
}
