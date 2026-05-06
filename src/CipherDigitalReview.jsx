import { useState } from "react";
import FinancialsTab from "./FinancialsTab";
import { RESEARCH_FIELDS as FIELDS, reviewStyles as s, fmtShort } from "./GenericReview";

export default function CipherDigitalReview({ companyId, companyName, curFields, updateField, editingField, setEditingField }) {
  const [cifrTab, setCifrTab] = useState("recent");

  return (
    <>
      {/* Cipher Digital Sub-Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #1E293B" }}>
        {[{ key: "recent", label: "Research" }, { key: "overview", label: "Overview" }, { key: "financials", label: "Financials" }, { key: "orgchart", label: "Org Chart" }, { key: "contracts", label: "Supply Chain & Customers" }, { key: "sentiment", label: "Sentiment" }].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCifrTab(tab.key)}
            style={{
              padding: "8px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
              background: "transparent",
              color: cifrTab === tab.key ? "#F8FAFC" : "#64748B",
              borderBottom: cifrTab === tab.key ? "2px solid #3B82F6" : "2px solid transparent",
              marginBottom: -1, transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== RESEARCH TAB ===== */}
      {cifrTab === "recent" && (
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
      {cifrTab === "overview" && (<>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Cipher Digital (CIFR)</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Formerly Cipher Mining</div>
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
            { date: "May 5-12", event: "Q1 2026 earnings release", type: "Earnings", detail: "First report under Cipher Digital rebrand. Watch: construction progress on Black Pearl & Barber Lake, BTC treasury liquidation, third hyperscaler deal details." },
            { date: "By Sept 30", event: "Barber Lake Phase I delivery (Fluidstack/Google)", type: "Capacity", detail: "168 MW initial tranche. Critical execution milestone. $3.8B contract revenue begins." },
            { date: "Q4 2026", event: "Black Pearl Phase I initial subphase rent commencement (AWS)", type: "Capacity", detail: "300 MW campus. ~$5.5B contract. First major HPC revenue." },
            { date: "Through 2026", event: "Full exit of Bitcoin treasury (~1,166 BTC)", type: "Other", detail: "Reinvesting proceeds into HPC business. Completing mining-to-infra transition." },
            { date: "Mar 25 (occ.)", event: "Third hyperscaler lease — 15-year IG tenant + $200M revolver", type: "Contract", detail: "Morgan Stanley-led credit facility. Validates demand for Cipher's power/sites." },
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
            { date: "By Jan 31 '27", event: "Barber Lake Phase II delivery", type: "Capacity", detail: "Additional 56 MW expansion (total 207 MW critical IT). Fluidstack/Google." },
            { date: "Q4 2027", event: "Ulysses OH site energization target", type: "Capacity", detail: "200 MW. Acquired Dec 2025. PJM interconnect. First site outside Texas." },
            { date: "2026-2030", event: "3.4 GW development pipeline across 8 sites", type: "Capacity", detail: "7 in Texas + 1 in Ohio. Prioritized for HPC. $9-10M/MW estimated build cost." },
            { date: "2027+", event: "Additional hyperscaler lease-ups", type: "Contract", detail: "3.4 GW pipeline provides massive optionality for new tenant signings." },
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
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: Cipher Digital IR, SEC filings (10-K, 8-K), AWS/Fluidstack/Google announcements, Morgan Stanley credit facility docs.</div>
      </div>

      {/* Supply Chain & Ecosystem Map */}
      <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Cipher Digital Supply Chain &amp; Ecosystem Map</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {[
          { label: "Customers", items: [
            { name: "Amazon Web Services (AWS)", sub: "Black Pearl, Odessa TX \u2014 300 MW, 15-year lease, ~$5.5B. Nearly 100% NOI margin", color: "#F59E0B" },
            { name: "Fluidstack (Google backstop)", sub: "Barber Lake, Colorado City TX \u2014 300 MW gross (207 MW critical IT), 10-year lease, ~$3.8B. Google backstops $1.73B", color: "#F59E0B" },
            { name: "Undisclosed IG Hyperscaler", sub: "Existing site, 15-year lease. Announced Mar 2026", color: "#F59E0B" },
          ]},
          { label: "Cipher Digital Platform", items: [
            { name: "Cipher Digital", sub: "3.4 GW pipeline \u00b7 8 sites \u00b7 $9.3B+ contracted HPC revenue \u00b7 Pivoting from BTC mining", color: "#3B82F6" },
          ]},
          { label: "Power & Infrastructure", items: [
            { name: "ERCOT Grid (Texas)", sub: "Primary power market for all TX sites. Sub-3\u00a2/kWh contracted at some sites", color: "#10B981" },
            { name: "AEP Ohio / PJM", sub: "Ulysses OH site. PJM interconnect secured", color: "#10B981" },
          ]},
          { label: "Financing", items: [
            { name: "$2B Senior Secured Notes", sub: "6.125%, maturing 2031. For Black Pearl. 6.5x oversubscribed", color: "#10B981" },
            { name: "$333M Tack-On Notes", sub: "Same 6.125% rate. For Barber Lake upsizing", color: "#10B981" },
            { name: "$200M Revolving Credit", sub: "Morgan Stanley-led. Goldman, JPM, Wells Fargo, Santander, SMBC", color: "#10B981" },
            { name: "Fortress Credit Advisors", sub: "Construction financing partner for Barber Lake", color: "#10B981" },
          ]},
          { label: "Competitors", items: [
            { name: "TeraWulf (WULF)", sub: "522 MW contracted. Lake Mariner NY + Abernathy TX", color: "#EF4444" },
            { name: "Applied Digital (APLD)", sub: "$16B contracted. Polaris Forge campuses ND", color: "#EF4444" },
            { name: "Core Scientific (CORZ)", sub: "590 MW CoreWeave contracts", color: "#EF4444" },
            { name: "IREN (IREN)", sub: "Expanding to ~3 GW. Prince George BC + TX", color: "#EF4444" },
            { name: "Hut 8 (HUT)", sub: "Mining + HPC", color: "#94A3B8" },
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
      <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Flow: Power &amp; Infrastructure &rarr; Cipher Digital (build, lease, operate) &rarr; Customers (AWS, Fluidstack/Google, hyperscaler). Financing partners enable capex scale.</div>

      {/* Major Contracts */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Major Contracts</div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>Total contracted HPC revenue: ~$9.3B+ across first two deals. All leases are triple-net or HPC hosting with 10-15 year terms.</div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>Customer Contracts</div>
        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 900 }}>
            <thead>
              <tr>
                {["Customer", "Contract Value", "Term", "Annual Run Rate", "MW", "GPU/Fit-Out", "Lease Structure", "Credit", "Timeline"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  cust: "AWS \u2014 Black Pearl",
                  value: "~$5.5B",
                  term: "15 years",
                  arr: "~$367M implied ARR",
                  mw: "300 MW, Odessa TX",
                  gpu: "Tenant-installed",
                  pricing: "Triple-net-like, nearly 100% NOI margin",
                  credit: "Investment-grade tenant (AWS/Amazon)",
                  timeline: "Q4 2026 rent start",
                },
                {
                  cust: "Fluidstack/Google \u2014 Barber Lake",
                  value: "~$3.8B",
                  term: "10 years (extensions to ~$7B)",
                  arr: "~$380M implied ARR",
                  mw: "300 MW gross / 207 MW critical IT, Colorado City TX",
                  gpu: "Tenant-installed",
                  pricing: "HPC hosting",
                  credit: "Google backstops $1.73B of Fluidstack obligations",
                  timeline: "Phase I Sept 2026, Phase II Jan 2027",
                },
                {
                  cust: "Undisclosed IG Hyperscaler",
                  value: "TBD",
                  term: "15 years",
                  arr: "TBD",
                  mw: "Existing site",
                  gpu: "TBD",
                  pricing: "TBD",
                  credit: "Investment-grade tenant",
                  timeline: "Announced Mar 25, 2026",
                },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#3B82F6", whiteSpace: "nowrap" }}>{row.cust}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F8FAFC", fontWeight: 600 }}>{row.value}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.term}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.arr}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.mw}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8" }}>{row.gpu}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.pricing}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F59E0B", fontSize: 11 }}>{row.credit}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.timeline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Center Footprint */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Data Center Footprint</div>
        <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 16 }}>8 sites across Texas and Ohio. 3.4 GW development pipeline. Pivoting from BTC mining to HPC infrastructure.</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Contracted HPC</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#10B981" }}>600+ MW</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Under Construction</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F59E0B" }}>~600 MW</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Development Pipeline</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#3B82F6" }}>3.4 GW</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Sites</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#8B5CF6" }}>8</div>
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
              { loc: "Black Pearl, Odessa TX", tenant: "AWS", mw: "300 (HPC) + 207 (legacy mining)", status: "Under Construction (HPC)", timeline: "Q4 2026 rent start", notes: "Mining rigs sold/relocated. Largest single campus." },
              { loc: "Barber Lake, Colorado City TX", tenant: "Fluidstack/Google", mw: "300 gross (207 critical IT)", status: "Under Construction", timeline: "Phase I Sept 2026, Phase II Jan 2027", notes: "Google $1.73B backstop. 95% long-lead equipment secured." },
              { loc: "Odessa (mining), TX", tenant: "\u2014", mw: "207", status: "Operational (mining)", timeline: "Winding down", notes: "Last active mining site. Rigs being sold or relocated." },
              { loc: "Ulysses, OH", tenant: "TBD", mw: "200", status: "Acquired Dec 2025", timeline: "Q4 2027 energization", notes: "First non-Texas site. PJM interconnect." },
              { loc: "Pipeline Sites (~4 undisclosed), TX", tenant: "TBD", mw: "~2.7 GW remaining", status: "Planning", timeline: "2027-2030", notes: "7 TX + 1 OH total. Prioritized for HPC." },
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 600, color: "#F8FAFC", fontSize: 11 }}>{row.loc}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.tenant}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 700 }}>{row.mw}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                    background: row.status.includes("Operational") ? "rgba(16,185,129,0.12)" : row.status.includes("Under Construction") ? "rgba(245,158,11,0.12)" : row.status.includes("Acquired") ? "rgba(59,130,246,0.12)" : "rgba(100,116,139,0.12)",
                    color: row.status.includes("Operational") ? "#10B981" : row.status.includes("Under Construction") ? "#F59E0B" : row.status.includes("Acquired") ? "#3B82F6" : "#94A3B8",
                  }}>{row.status}</span>
                </td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>{row.timeline}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Divested */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginTop: 16, marginBottom: 8 }}>Divested</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
          <tbody>
            <tr>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 600, color: "#F8FAFC", fontSize: 11 }}>Alborz, Bear, Chief (TX)</td>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>Sold to Canaan Feb 2026</td>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 700 }}>120 MW total</td>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>~$39.75M all-stock</td>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>Off-grid wind/JV mining sites.</td>
            </tr>
          </tbody>
        </table>

        <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: Cipher Digital IR, SEC filings (10-K, 8-K), AWS/Fluidstack announcements, PJM interconnect filings.</div>
      </div>
    </>)}

    {/* ===== ORG CHART SUB-TAB ===== */}
    {cifrTab === "orgchart" && (<>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Cipher Digital Corporate Structure</div>
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
          <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>Cipher Digital Inc. (fka Cipher Mining Inc.)</div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Parent &middot; Delaware &middot; NASDAQ: CIFR</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>Rebranded Feb 24, 2026</span>
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
          { name: "Black Pearl Project SPV", fullName: "Senior Secured Notes Issuer", tag: "SENIOR SECURED", tagBg: "rgba(239,68,68,0.12)", tagColor: "#EF4444", color: "#EF4444", border: "1px solid #1E293B",
            outstanding: "$2B", capacity: "$2B", rate: "6.125%", maturity: "2031",
            gpus: "AWS", collateral: "Black Pearl project assets", guarantor: "6.5x oversubscribed (~$13B in orders). Nearly 100% NOI margin on AWS lease.", ringFenced: "300 MW HPC", sub: "Subsidiary \u00b7 Delaware" },
          { name: "Barber Lake Project Entity", fullName: "Project Finance", tag: "PROJECT FINANCE", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B", border: "1px solid #1E293B",
            outstanding: "$333M tack-on + Fortress", capacity: "$333M tack-on + Fortress construction facility", rate: "Fluidstack/Google", maturity: "Phase I Sept 2026",
            gpus: "Fluidstack/Google", collateral: "Google backstops $1.73B. 95% long-lead equipment secured.", guarantor: "300 MW gross / 207 MW critical IT", ringFenced: "Colorado City TX", sub: "Subsidiary \u00b7 Delaware" },
          { name: "Ulysses (Ohio)", fullName: "Development Site", tag: "DEVELOPMENT", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6", color: "#3B82F6", border: "1px solid #1E293B",
            outstanding: "200 MW", capacity: "200 MW", rate: "Acquired Dec 2025", maturity: "Q4 2027 energization",
            gpus: "TBD", collateral: "First non-Texas site. Diversifies ERCOT concentration.", guarantor: "PJM interconnect (AEP Ohio)", ringFenced: "Ohio", sub: "Subsidiary \u00b7 Delaware" },
          { name: "Legacy Mining / Divested", fullName: "Winding Down", tag: "DIVESTED", tagBg: "rgba(100,116,139,0.12)", tagColor: "#94A3B8", color: "#94A3B8", border: "1px solid #1E293B",
            outstanding: "Alborz, Bear, Chief sold", capacity: "$39.75M (all-stock) to Canaan Feb 2026", rate: "Odessa mining winding down", maturity: "Rigs sold or relocated",
            gpus: "N/A", collateral: "~1,166 BTC treasury, planned full exit through 2026.", guarantor: "N/A", ringFenced: "N/A", sub: "Various \u00b7 Texas" },
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

      {/* === KEY SHAREHOLDERS === */}
      <div style={s.card}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Key Shareholders</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { name: "Bitfury Top HoldCo B.V.", detail: "23.05% (93.38M shares) \u2014 founding parent", color: "#3B82F6" },
            { name: "Institutional", detail: "~74-75% of shares outstanding", color: "#10B981" },
            { name: "New CFO Greg Mumford", detail: "Ex-KBW digital infra M&A \u2014 signals strategic direction", color: "#F59E0B" },
          ].map((inv, i) => (
            <div key={i} style={{ flex: "1 1 250px", minWidth: 250, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: inv.color, marginBottom: 6 }}>{inv.name}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: "1.6" }}>{inv.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Sources: Cipher Digital IR, SEC filings (10-K, 8-K, DEF 14A), EDGAR ownership filings, bond offering documents.</div>
    </>)}

    {/* ===== CONTRACTS SUB-TAB ===== */}
    {cifrTab === "contracts" && (<>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Supply Side &amp; Customer Contracts</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>Total contracted HPC revenue: ~$9.3B+ across first two deals. Target average NOI: $669M/year (2026-2036). Peak NOI: $754M by 2035. 85-90% NOI margins.</div>

      {/* Contract Comparison */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Contract Comparison</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                {["Metric", "AWS (Black Pearl)", "Fluidstack (Barber Lake)", "IG Hyperscaler (Mar 2026)"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { metric: "Contract Value", aws: "~$5.5B", fluid: "~$3.8B", hyper: "TBD" },
                { metric: "Term", aws: "15 yr", fluid: "10 yr", hyper: "15 yr" },
                { metric: "MW", aws: "300 MW", fluid: "207 MW critical IT", hyper: "TBD" },
                { metric: "ARR (implied)", aws: "~$367M", fluid: "~$380M", hyper: "TBD" },
                { metric: "Tenant Credit", aws: "Investment-grade (AWS)", fluid: "Google backstop ($1.73B)", hyper: "Investment-grade" },
                { metric: "Lease Structure", aws: "Triple-net, ~100% NOI", fluid: "HPC hosting", hyper: "TBD" },
                { metric: "Financing", aws: "$2B 6.125% notes", fluid: "$333M notes + Fortress", hyper: "$200M revolver" },
                { metric: "Delivery Timeline", aws: "Q4 2026", fluid: "Ph I Sept 2026 / Ph II Jan 2027", hyper: "TBD" },
                { metric: "Expansion", aws: "\u2014", fluid: "Extensions to ~$7B", hyper: "TBD" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.metric}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#10B981" }}>{row.aws}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#F59E0B" }}>{row.fluid}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#94A3B8" }}>{row.hyper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AWS Deep Dive */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#10B981" }}>AWS \u2014 Black Pearl Deep Dive</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" }}>Total Contract</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>~$5.5B</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Total Value", value: "~$5.5B", sub: "" },
            { label: "Term", value: "15 years", sub: "" },
            { label: "MW", value: "300", sub: "" },
            { label: "NOI Margin", value: "~100%", sub: "" },
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
              { term: "Campus", detail: "Black Pearl campus in Odessa TX. Former crypto mining site converted to HPC." },
              { term: "Lease Type", detail: "Triple-net lease \u2014 AWS responsible for fit-out. Nearly 100% NOI margin." },
              { term: "Financing", detail: "6.5x oversubscribed financing ($13B demand for $2B offering) demonstrates institutional confidence." },
              { term: "Timeline", detail: "Q4 2026 initial rent commencement." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 200, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fluidstack/Google Deep Dive */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F59E0B" }}>Fluidstack/Google \u2014 Barber Lake Deep Dive</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" }}>Total Contract</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>~$3.8B</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Total Value", value: "~$3.8B", sub: "extensions to ~$7B" },
            { label: "Term", value: "10 years", sub: "" },
            { label: "MW", value: "207", sub: "critical IT" },
            { label: "Backstop", value: "Google $1.73B", sub: "" },
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
              { term: "Campus", detail: "Barber Lake campus in Colorado City TX. Two tranches: 168 MW initial + 56 MW expansion." },
              { term: "Backstop", detail: "Google backstops $1.73B of Fluidstack obligations ($1.4B initial + $333M tack-on)." },
              { term: "Financing", detail: "Fortress provides construction financing. 95% of long-lead equipment secured." },
              { term: "Timeline", detail: "Phase I target Sept 30, 2026. Phase II by Jan 31, 2027." },
              { term: "Extensions", detail: "Extension options could bring total value to ~$7B." },
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
            { title: "Construction Execution", desc: "Black Pearl and Barber Lake must both deliver on 2026 deadlines. Simultaneous construction of 600+ MW. Any delay defers revenue on $9.3B of contracts.", color: "#EF4444" },
            { title: "Revenue Gap", desc: "No material HPC revenue until Q4 2026. Mining winding down. Company burning cash through transition. Unrestricted liquidity $754M must bridge gap.", color: "#EF4444" },
            { title: "ERCOT Concentration", desc: "All current operational/construction sites in Texas. ERCOT grid reliability concerns (2021 winter storm precedent). Power cost and availability risk.", color: "#F59E0B" },
            { title: "Customer Concentration", desc: "AWS and Google/Fluidstack = 100% of contracted HPC revenue. Loss of either would be catastrophic.", color: "#EF4444" },
            { title: "Fluidstack Counterparty", desc: "Fluidstack is a startup. Google backstop covers $1.73B but exact terms not fully public. Remaining $2B+ of Barber Lake value depends on Fluidstack.", color: "#F59E0B" },
            { title: "BTC Transition Risk", desc: "~1,166 BTC treasury being liquidated. BTC price drops reduce proceeds. Mining revenue declining while HPC not yet producing.", color: "#F59E0B" },
          ].map((item, i) => (
            <div key={i} style={{ flex: "1 1 280px", minWidth: 280, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: "1.6" }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 14, fontStyle: "italic" }}>Sources: Cipher Digital IR, SEC filings (10-K, 8-K), AWS/Fluidstack/Google announcements, bond offering documents.</div>
      </div>
    </>)}

    {/* ===== SENTIMENT SUB-TAB ===== */}
    {cifrTab === "sentiment" && (<>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Market Sentiment</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>11-16 analysts. All Buy. Avg PT ~$21-26. Short interest ~20-21% of float. Q1 earnings May 5-12.</div>

      {/* Consensus Snapshot */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Consensus Rating", value: "Strong Buy", sub: "11-16 Buy", color: "#10B981" },
          { label: "Avg Price Target", value: "~$21-26", sub: "", color: "#3B82F6" },
          { label: "PT Range", value: "$18 – $50", sub: "", color: "#F8FAFC" },
          { label: "Short Interest", value: "~20-21%", sub: "of float", color: "#F59E0B" },
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
            { phase: "Current (Apr 2026)", sentiment: "Execution Phase", color: "#8B5CF6", desc: "Market waiting for Q4 2026 rent commencements. 20%+ short interest. Q1 earnings May 5-12 next catalyst." },
            { phase: "Transition Phase (Feb-Mar 2026)", sentiment: "Mixed", color: "#F59E0B", desc: "Rebranded to Cipher Digital. Divested mining JVs to Canaan. New CFO from KBW (M&A signal). Third hyperscaler deal. $200M revolver. Stock pulled back to $12 range." },
            { phase: "Landmark Deals (Sept-Oct 2025)", sentiment: "Euphoric", color: "#3B82F6", desc: "AWS $5.5B Black Pearl deal. Fluidstack/Google $3.8B Barber Lake deal. Stock hit ATH $25.52 (Nov 2025). Market re-rated as AI infrastructure." },
            { phase: "AI Pivot Begins (2024)", sentiment: "Re-Rating", color: "#10B981", desc: "Announced HPC strategy. Began site acquisitions and repurposing. AWS relationship developing." },
            { phase: "Bitcoin Miner (2022-2023)", sentiment: "Volatile", color: "#F59E0B", desc: "Built mining fleet to ~23.6 EH/s. Revenue grew with BTC price. Stock volatile." },
            { phase: "SPAC Launch (2021)", sentiment: "Speculative", color: "#94A3B8", desc: "Cipher Mining formed as Bitfury subsidiary. Public via SPAC merger with Good Works Acquisition Corp." },
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
                { firm: "HC Wainwright", analyst: "\u2014", rating: "Buy", pt: "$25", date: "Feb 2026", thesis: "$9.3B backlog provides exceptional visibility" },
                { firm: "Keefe Bruyette (KBW)", analyst: "\u2014", rating: "Outperform", pt: "$20", date: "Mar 2026", thesis: "Cut from $22. Concerned about construction timeline" },
                { firm: "Rosenblatt", analyst: "\u2014", rating: "Buy", pt: "$22", date: "Mar 2026", thesis: "Bullish post-management meeting" },
                { firm: "Canaccord Genuity", analyst: "\u2014", rating: "Buy", pt: "$24", date: "Feb 2026", thesis: "AWS deal de-risks revenue" },
                { firm: "B. Riley", analyst: "\u2014", rating: "Buy", pt: "$26", date: "Feb 2026", thesis: "3.4 GW pipeline is massive optionality" },
                { firm: "Roth Capital", analyst: "\u2014", rating: "Buy", pt: "$21", date: "Jan 2026", thesis: "Google backstop mitigates Fluidstack risk" },
                { firm: "Lake Street", analyst: "\u2014", rating: "Buy", pt: "$18", date: "Feb 2026", thesis: "Floor valuation" },
                { firm: "Benchmark", analyst: "\u2014", rating: "Buy", pt: "$50", date: "Mar 2026", thesis: "Most bullish \u2014 sees full pipeline monetization" },
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
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>NOTE: Specific analyst names approximate. Consensus direction confirmed. Verify against Bloomberg/FactSet for latest.</div>
      </div>

      {/* Market Positioning */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Market Positioning</div>

        {/* Insider Activity */}
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
              { date: "Mar 25, 2026", insider: "Tyler Page", title: "CEO", action: "Sell", shares: "37,500 shares", value: "$604K", notes: "10b5-1 plan" },
              { date: "Mar 23, 2026", insider: "Cary Grossman", title: "Director", action: "Sell", shares: "30,000 shares", value: "$436K", notes: "" },
              { date: "Mar 4, 2026", insider: "James Newsome", title: "Director", action: "Sell", shares: "45,161 shares", value: "$711K", notes: "" },
              { date: "Mar 31, 2026", insider: "Will Iwaschuk", title: "Co-President/CLO", action: "RSU exercise +140K / tax sell -65.9K", shares: "140K / -65.9K", value: "$848K tax withholding", notes: "" },
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
            <span style={{ fontWeight: 700, color: "#EF4444" }}>Net insider activity: ALL SELLING.</span> No insider purchases identified. Modest amounts under 10b5-1 plans.
          </div>
        </div>

        {/* Institutional Ownership */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Institutional Ownership</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "Bitfury Top HoldCo", value: "23.05%", sub: "founding parent", color: "#3B82F6" },
            { label: "Institutional", value: "~74-75%", sub: "", color: "#10B981" },
            { label: "Retail", value: "~3%", sub: "", color: "#94A3B8" },
            { label: "Short Interest", value: "~20-21%", sub: "of float (~63-64M shares)", color: "#F59E0B" },
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
              { label: "Short % of Float", value: "~20-21%", color: "#EF4444" },
              { label: "Short Shares", value: "~63-64M", color: "#F59E0B" },
            ].map((m, i) => (
              <div key={i} style={{ flex: "1 1 140px", minWidth: 140 }}>
                <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.7 }}>
            Trending up (+4.12% recent period). Reflects execution skepticism on construction timelines and leverage.
          </div>
        </div>

        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Sources: Cipher Digital IR, MarketBeat, TipRanks, SEC filings (Form 4), FINRA short interest reports, EDGAR ownership filings.</div>
      </div>
    </>)}

    {cifrTab === "financials" && (
      <FinancialsTab ticker="CIFR" companyId={companyId} companyName={companyName}
        curFields={curFields} updateField={updateField} />
    )}

    </>
  );
}
