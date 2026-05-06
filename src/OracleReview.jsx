import { ReviewShell, reviewStyles as s } from "./GenericReview";

export default function OracleReview({ companyId, companyName, curFields, updateField, editingField, setEditingField }) {
  return (
    <ReviewShell ticker="ORCL" companyId={companyId} companyName={companyName}
      curFields={curFields} updateField={updateField}
      editingField={editingField} setEditingField={setEditingField}>
      {(tab) => (<>

      {/* ===== OVERVIEW TAB ===== */}
      {tab ==="overview" && (<>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Oracle Corporation (ORCL)</div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Founded 1977 &middot; Austin, TX (HQ) &middot; NYSE: ORCL &middot; ~164,000 employees</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>Enterprise software, cloud infrastructure, database, ERP/SaaS, healthcare IT</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#64748B" }}>See Financials tab for live price / market cap / P/E</div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "FY2025 Revenue", value: "$57.4B", sub: "+8% YoY (FYE May 31, 2025)" },
            { label: "FY2026E Revenue", value: "$67B", sub: "Guided +17% YoY" },
            { label: "FY2027E Revenue", value: "$90B", sub: "Guided +34% YoY" },
            { label: "RPO (Q3 FY26)", value: "$553B", sub: "+325% YoY. Record backlog." },
            { label: "FY2026E CapEx", value: "$50B", sub: "Up from $21.2B in FY2025" },
            { label: "Total Debt (Feb 2026)", value: "~$162B", sub: "Net debt ~$90B" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "10px 14px", flex: "1 1 140px", minWidth: 140 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>{m.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Events Timeline */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Key Events Timeline</div>
        <div style={{ display: "flex", gap: 16 }}>

        {/* 0-6 Months */}
        <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #3B82F6" }}>0-6 Months (Apr - Oct 2026)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { date: "Feb 2, 2026", event: "$25B bond offering + $20B ATM equity program", type: "Financing", detail: "8-part senior note offering ($25B) with maturities from 2029 to 2066 (4.55%-6.85%). $129B order book. Plus $20B at-the-market equity distribution via BofA, Citi, Deutsche, Goldman, JPM." },
            { date: "Mar 10", event: "Q3 FY2026 earnings beat", type: "Earnings", detail: "Revenue $17.2B (+22% YoY). Cloud revenue $8.9B (+44%). OCI revenue $4.9B (+84%). GPU-related revenue +243%. RPO $553B (+325% YoY). FY26 rev guide $67B, FY27 raised to $90B." },
            { date: "Q4 FY26", event: "Q4 FY2026 earnings (June 2026)", type: "Earnings", detail: "Final quarter of FY2026. Key test for $67B revenue guide. OCI ramp from Stargate and multicloud deals. CapEx run-rate at ~$12.5B/quarter." },
            { date: "Mid-2026", event: "Stargate Abilene Phase 1 completion", type: "Capacity", detail: "1.2 GW data center in Abilene, TX for OpenAI. ~400K NVIDIA GB200 GPUs. One of the world's largest data centers. 15-year lease to OpenAI." },
            { date: "H1 2026", event: "DOE Equinox supercomputer delivery", type: "Partnership", detail: "10,000 NVIDIA Blackwell GPUs at Argonne National Lab. Joint partnership with NVIDIA and DOE. First phase of larger Solstice system (100K GPUs)." },
            { date: "Q3 CY2026", event: "AMD MI450 GPU deployment on OCI", type: "Product", detail: "50,000 AMD Instinct MI450 Series GPUs. First hyperscaler with publicly available AMD AI supercluster. Diversifies beyond NVIDIA dependency." },
            { date: "Ongoing", event: "Oracle Database@AWS/Azure/GCP expansion", type: "Partnership", detail: "Multicloud DB grew 817% in Q2. AWS expanding from 2 to 20+ regions. Azure from 14 to 33 regions. Google Cloud in 11 regions (+9 planned)." },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 10px", background: "#0B0F19", borderRadius: 6, border: "1px solid #1E293B" }}>
              <div style={{ width: 85, minWidth: 85 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6" }}>{c.date}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC" }}>{c.event}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 3,
                    background: c.type === "Earnings" ? "rgba(139,92,246,0.12)" : c.type === "Capacity" ? "rgba(16,185,129,0.12)" : c.type === "Financing" ? "rgba(59,130,246,0.12)" : c.type === "Contract" ? "rgba(239,68,68,0.12)" : c.type === "Partnership" ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.12)",
                    color: c.type === "Earnings" ? "#8B5CF6" : c.type === "Capacity" ? "#10B981" : c.type === "Financing" ? "#3B82F6" : c.type === "Contract" ? "#EF4444" : c.type === "Partnership" ? "#F59E0B" : "#F59E0B",
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
        <div style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #F59E0B" }}>6-18 Months (Oct 2026 - Oct 2027)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { date: "H2 2026", event: "Stargate expansion to 5+ new sites", type: "Capacity", detail: "OpenAI, Oracle, SoftBank expanding Stargate beyond Abilene TX. New sites announced across multiple US states. Total commitment up to $500B / 10 GW by end of decade." },
            { date: "FY2027", event: "FY2027 revenue target: $90B", type: "Earnings", detail: "Management guided $90B revenue for FY2027 (Jun 2026 - May 2027). Implies ~34% growth. Driven by OCI ramp, Stargate, multicloud DB, and AI contracts." },
            { date: "2026-27", event: "OCI growth target >70%", type: "Product", detail: "OCI revenue guided to grow >70% in FY2026 (from 50% in FY2025). Q3 FY26 already tracking at 84%. GPU revenue +243%. Target $18B OCI revenue in FY2026." },
            { date: "2027", event: "DOE Solstice supercomputer delivery", type: "Partnership", detail: "100,000 NVIDIA Blackwell GPUs at Argonne National Lab. Largest AI supercomputer in DOE lab complex. Joint with NVIDIA." },
            { date: "2027", event: "Cloud regions expansion to 150+", type: "Capacity", detail: "From 101 regions (Q3 2025). Larry Ellison: 'More cloud regions than all competitors combined.' Major investments: $8B Japan, $6.5B Malaysia, $3B Germany/Netherlands." },
            { date: "CY2027", event: "CapEx peak expected FY2028", type: "Financing", detail: "S&P expects capex to peak in FY2028. Adjusted leverage may exceed 4x in FY2027-2028. Key test for credit metrics and rating stability." },
            { date: "2027", event: "TikTok JV revenue ramp", type: "Contract", detail: "Oracle as 15% investor and 'trusted security partner' for TikTok US JV. Long-term OCI hosting for non-AI workloads. High-margin, stable cloud revenue." },
            { date: "Ongoing", event: "Oracle Health / Cerner integration", type: "Product", detail: "Continued integration of $28.3B Cerner acquisition. VA contract rollouts remain challenging. Healthcare AI applications on OCI." },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 10px", background: "#0B0F19", borderRadius: 6, border: "1px solid #1E293B" }}>
              <div style={{ width: 85, minWidth: 85 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B" }}>{c.date}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC" }}>{c.event}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 3,
                    background: c.type === "Earnings" ? "rgba(139,92,246,0.12)" : c.type === "Capacity" ? "rgba(16,185,129,0.12)" : c.type === "Financing" ? "rgba(59,130,246,0.12)" : c.type === "Contract" ? "rgba(239,68,68,0.12)" : c.type === "Partnership" ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.12)",
                    color: c.type === "Earnings" ? "#8B5CF6" : c.type === "Capacity" ? "#10B981" : c.type === "Financing" ? "#3B82F6" : c.type === "Contract" ? "#EF4444" : c.type === "Partnership" ? "#F59E0B" : "#F59E0B",
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
            { label: "Partnership", color: "#F59E0B" },
            { label: "Product", color: "#F59E0B" },
          ].map((l, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748B" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: Oracle IR, SEC filings (10-K FY2025, 10-Q Q3 FY2026), Q3 FY2026 earnings call, OpenAI Stargate announcements, DCD, Bloomberg, CNBC, DOE/Argonne.</div>
      </div>

      {/* Supply Chain & Ecosystem Map */}
      <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Oracle Supply Chain &amp; Ecosystem Map</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {[
          { label: "Customers", items: [
            { name: "OpenAI / Stargate", sub: "$300B JV with SoftBank. Oracle providing 4.5 GW DC capacity. 400K GB200 GPUs at Abilene TX. 15-yr lease.", color: "#F59E0B" },
            { name: "TikTok / ByteDance", sub: "Oracle is 15% investor + 'trusted security partner' in US TikTok JV. Long-term OCI hosting for non-AI workloads.", color: "#F59E0B" },
            { name: "Meta", sub: "Major OCI customer. Part of $553B RPO backlog. AI infrastructure contracts.", color: "#F59E0B" },
            { name: "NVIDIA", sub: "OCI customer for DGX Cloud. Also key GPU supplier. DOE Solstice/Equinox partnership.", color: "#F59E0B" },
            { name: "Banks & Financial Services", sub: "Goldman Sachs, JPMorgan, Deutsche Bank on Oracle DB@Cloud. Fusion ERP + NetSuite.", color: "#F59E0B" },
            { name: "Healthcare", sub: "Oracle Health (Cerner). VA, NHS, hospital systems. EHR + clinical AI on OCI.", color: "#F59E0B" },
            { name: "Enterprise SaaS", sub: "Thousands of Fusion ERP, HCM, SCM customers. NetSuite for mid-market. 37,500+ customers.", color: "#F59E0B" },
          ]},
          { label: "Oracle Platform", items: [
            { name: "Oracle Corporation", sub: "101+ cloud regions. $553B RPO. $67B FY26E rev. #4 cloud provider by IaaS revenue.", color: "#3B82F6" },
          ]},
          { label: "Infra Partners", items: [
            { name: "NVIDIA", sub: "Primary GPU supplier. GB200, GB300, Vera Rubin. 400K+ GPUs for Stargate. DOE partnership.", color: "#10B981" },
            { name: "AMD", sub: "50K MI450 GPUs on OCI starting Q3 2026. First hyperscaler AMD AI supercluster.", color: "#10B981" },
            { name: "SoftBank", sub: "Stargate JV co-investor. $19B committed. 40% ownership. Financial responsibility.", color: "#10B981" },
          ]},
          { label: "Cloud Partners", items: [
            { name: "AWS", sub: "Oracle Database@AWS. GA in 2 regions, expanding to 20+. Multicloud Universal Credits.", color: "#10B981" },
            { name: "Microsoft Azure", sub: "Oracle Database@Azure. 33 regions. Exadata on Azure. Deepest multicloud integration.", color: "#10B981" },
            { name: "Google Cloud", sub: "Oracle Database@Google Cloud. 11 regions + 9 planned. GCP marketplace listings.", color: "#10B981" },
          ]},
          { label: "Competitors", items: [
            { name: "AWS", sub: "Market leader in IaaS/PaaS. ~31% cloud market share. Aurora, RDS compete with Oracle DB.", color: "#EF4444" },
            { name: "Microsoft Azure", sub: "#2 cloud. ~25% share. SQL Server / Cosmos DB. Also Oracle's multicloud partner.", color: "#EF4444" },
            { name: "Google Cloud", sub: "#3 cloud. ~11% share. BigQuery, Spanner. Also Oracle multicloud partner.", color: "#EF4444" },
            { name: "SAP", sub: "Direct ERP competitor. S/4HANA vs Fusion. HANA DB vs Oracle DB. Similar enterprise base.", color: "#EF4444" },
            { name: "Salesforce", sub: "CRM leader. Competes with Oracle CX. Different go-to-market but overlapping enterprise spend.", color: "#EF4444" },
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
      <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Flow: GPU Supply (NVIDIA, AMD) + Cloud Partners (AWS, Azure, GCP multicloud) + Stargate JV (SoftBank, OpenAI) feed Oracle's platform. Oracle serves enterprise, AI, healthcare, and government customers.</div>

      {/* Major Contracts / Customers */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Major Contracts &amp; Customers</div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>RPO: $553B (Q3 FY2026, +325% YoY). Majority driven by large-scale AI infrastructure contracts with OpenAI, Meta, NVIDIA, and government agencies. Most RPO supported by customer prepayments or customer-supplied GPUs.</div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>Key Customer Contracts</div>
        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 900 }}>
            <thead>
              <tr>
                {["Customer", "Contract / Relationship", "Value / Scale", "Duration", "GPU / Infrastructure", "Key Terms", "Source"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  cust: "OpenAI / Stargate JV",
                  contract: "Stargate AI infrastructure JV",
                  value: "~$300B total JV (Oracle share: $7B equity + DC buildout)",
                  duration: "Through 2029+ (up to $500B / 10 GW)",
                  gpu: "400K NVIDIA GB200 GPUs at Abilene TX (1.2 GW). 4.5 GW total Oracle commitment.",
                  terms: "Oracle builds and operates DCs. OpenAI is anchor tenant. SoftBank has financial responsibility. Oracle + MGX each hold ~10% equity. 15-year GPU lease.",
                  source: "OpenAI, Oracle IR, Bloomberg, DCD",
                },
                {
                  cust: "TikTok / ByteDance",
                  contract: "US TikTok JV investor + cloud host",
                  value: "Oracle holds 15% stake in US TikTok entity",
                  duration: "Long-term (JV finalized Dec 2025)",
                  gpu: "OCI hosting for non-AI workloads (video serving, data storage)",
                  terms: "Oracle is 'trusted security partner.' Silver Lake, Oracle, MGX each hold 15%. Major OCI tenant. Secures high-margin, stable cloud revenue.",
                  source: "Morningstar, Rest of World, CNBC",
                },
                {
                  cust: "US Dept. of Energy",
                  contract: "DOE Solstice + Equinox supercomputers",
                  value: "Multi-billion (not fully disclosed)",
                  duration: "Equinox H1 2026, Solstice 2027",
                  gpu: "Equinox: 10K Blackwell GPUs. Solstice: 100K Blackwell GPUs. Largest DOE AI supercomputer.",
                  terms: "Public-private partnership with NVIDIA. Hosted at Argonne National Lab. Scientific discovery and national security workloads.",
                  source: "DOE, NVIDIA Newsroom, Argonne",
                },
                {
                  cust: "Meta",
                  contract: "OCI AI infrastructure",
                  value: "Significant (included in $553B RPO)",
                  duration: "Multi-year",
                  gpu: "NVIDIA GPU clusters on OCI",
                  terms: "Part of Oracle's large-scale AI infrastructure contracts. Meta also separately contracts with CoreWeave and Nebius.",
                  source: "Oracle Q3 FY26 earnings, CNBC",
                },
                {
                  cust: "NVIDIA",
                  contract: "DGX Cloud on OCI + GPU supply",
                  value: "Included in RPO",
                  duration: "Multi-year",
                  gpu: "DGX Cloud instances. NVIDIA supplies GPUs and runs DGX Cloud on OCI.",
                  terms: "Dual relationship: NVIDIA is both supplier (GPUs) and customer (DGX Cloud hosting). Deep technical integration.",
                  source: "Oracle IR, NVIDIA GTC",
                },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#3B82F6", whiteSpace: "nowrap" }}>{row.cust}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F8FAFC", fontWeight: 600, fontSize: 11 }}>{row.contract}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.value}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.duration}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.gpu}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.terms}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Center / Cloud Infrastructure Footprint */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Data Center &amp; Cloud Infrastructure Footprint</div>
        <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 16 }}>101+ cloud regions as of Q3 FY2025, expanding to 150+. Larry Ellison: "We will build more cloud data centers than all our competitors combined." CapEx surging from $6.9B (FY2024) to $21.2B (FY2025) to $50B (FY2026E) to support AI infrastructure buildout.</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Cloud Regions</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#10B981" }}>101+</div>
            <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>Target 150+ by 2027</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Stargate Capacity</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F59E0B" }}>4.5 GW</div>
            <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>Oracle's Stargate commitment</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>FY2026E CapEx</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#3B82F6" }}>$50B</div>
            <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>Up from $21.2B in FY2025</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Stargate JV Total</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#8B5CF6" }}>$500B / 10 GW</div>
            <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>Full commitment by end of decade</div>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
          <thead>
            <tr>
              {["Region / Facility", "Type", "Capacity", "Status", "Investment", "Notes"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { loc: "Abilene, TX (Stargate Phase 1)", type: "AI / Stargate JV", cap: "1.2 GW", status: "Under build", investment: "~$40B+ (GPU + DC)", notes: "400K NVIDIA GB200 GPUs. 15-yr OpenAI lease. Mid-2026 target completion. One of world's largest DCs." },
              { loc: "Stargate Sites (5+ additional)", type: "AI / Stargate JV", cap: "Multi-GW", status: "Planning", investment: "Part of $500B JV", notes: "Expansion beyond Abilene to multiple US states. Announced Feb 2026." },
              { loc: "Japan", type: "Cloud Regions", cap: "Multiple regions", status: "Expanding", investment: "$8B+", notes: "Major investment in Japanese cloud infrastructure. Enterprise and government clients." },
              { loc: "Malaysia", type: "Cloud Regions", cap: "Multiple regions", status: "Expanding", investment: "$6.5B", notes: "Southeast Asia expansion. AI and enterprise workloads." },
              { loc: "Germany & Netherlands", type: "Cloud Regions", cap: "Multiple regions", status: "Expanding", investment: "$3B", notes: "European sovereign cloud expansion. GDPR-compliant regions." },
              { loc: "Argonne National Lab, IL", type: "DOE Supercomputer", cap: "100K GPUs (Solstice)", status: "Under build", investment: "Multi-billion", notes: "Equinox (10K GPUs, H1 2026) + Solstice (100K GPUs, 2027). Largest DOE AI system." },
              { loc: "Global OCI Regions (101+)", type: "Public Cloud", cap: "101+ regions", status: "Operational", investment: "Cumulative $50B+ FY26", notes: "Multicloud: DB@AWS (20+ regions), DB@Azure (33 regions), DB@GCP (11 regions)." },
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 600, color: "#F8FAFC", fontSize: 11 }}>{row.loc}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.type}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 700 }}>{row.cap}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                    background: row.status === "Operational" ? "rgba(16,185,129,0.12)" : row.status === "Under build" ? "rgba(245,158,11,0.12)" : row.status === "Expanding" ? "rgba(59,130,246,0.12)" : "rgba(100,116,139,0.12)",
                    color: row.status === "Operational" ? "#10B981" : row.status === "Under build" ? "#F59E0B" : row.status === "Expanding" ? "#3B82F6" : "#94A3B8",
                  }}>{row.status}</span>
                </td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>{row.investment}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: Oracle IR, OpenAI Stargate announcements, DOE/Argonne, Oracle cloud region docs, DCD, Bloomberg, CNBC.</div>
      </div>
    </>)}

    {/* ===== ORG CHART SUB-TAB ===== */}
    {tab ==="orgchart" && (<>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Oracle Corporate Structure</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>As of</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#3B82F6" }}>Apr 2026</div>
          </div>
        </div>
      </div>

      {/* === PARENT ENTITY === */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 8 }}>
        <div style={{ background: "linear-gradient(135deg, #1E3A5F, #0B1929)", border: "2px solid #3B82F6", borderRadius: 12, padding: "20px 40px", textAlign: "center", minWidth: 400, position: "relative" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>Oracle Corporation</div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Parent &middot; Delaware &middot; NYSE: ORCL &middot; Founded 1977</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 6 }}>Chairman/CTO: Larry Ellison &middot; Co-CEOs: Clay Magouyrk, Mike Sicilia &middot; Exec Vice Chair: Safra Catz</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>S&P: BBB (Negative)</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>Moody's: Baa2 (Negative)</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>Fitch: BBB</span>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>Total Debt: ~$162B</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>Net Debt: ~$90B</span>
          </div>
        </div>
        {/* Connector line */}
        <div style={{ width: 2, height: 24, background: "#1E293B" }} />
      </div>

      {/* === BUSINESS SEGMENTS === */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 2, height: 20, background: "#1E293B" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
        <div style={{ width: "90%", height: 2, background: "#1E293B", position: "relative" }}>
          {[0, 25, 50, 75, 100].map(p => (
            <div key={p} style={{ position: "absolute", left: `${p}%`, top: -4, width: 2, height: 10, background: "#1E293B", transform: "translateX(-1px)" }} />
          ))}
        </div>
      </div>

      {/* Segment Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { name: "Cloud Services & License Support", tag: "LARGEST SEGMENT", tagBg: "rgba(16,185,129,0.12)", tagColor: "#10B981", color: "#10B981", border: "1px solid #1E293B",
            revenue: "$44.0B", revenueNote: "FY2025 (+12% YoY)", growth: "+12% YoY", sub: "SaaS + PaaS + IaaS subscriptions",
            details: [
              "Oracle Cloud Infrastructure (OCI) — IaaS",
              "Fusion Cloud ERP, HCM, SCM — SaaS",
              "NetSuite — Mid-market ERP SaaS",
              "Oracle Health (Cerner) — Healthcare SaaS",
              "Database Cloud Services",
              "License support / maintenance renewals",
            ] },
          { name: "Cloud Infrastructure (OCI)", tag: "FASTEST GROWING", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6", color: "#3B82F6", border: "1px solid #1E293B",
            revenue: "$4.9B/qtr", revenueNote: "Q3 FY2026 (+84% YoY)", growth: "+84% YoY", sub: "IaaS — GPU compute, storage, networking",
            details: [
              "GPU Cloud (NVIDIA GB200, H100, H200)",
              "AMD MI450 (launching Q3 CY2026)",
              "Stargate JV infrastructure",
              "DGX Cloud hosting for NVIDIA",
              "Sovereign cloud regions",
              "OCI Supercluster for AI training",
            ] },
          { name: "Cloud Applications (SaaS)", tag: "STEADY GROWTH", tagBg: "rgba(139,92,246,0.12)", tagColor: "#A78BFA", color: "#A78BFA", border: "1px solid #1E293B",
            revenue: "$3.9B/qtr", revenueNote: "Q3 FY2026 (+11% YoY)", growth: "+11% YoY", sub: "Enterprise SaaS applications",
            details: [
              "Fusion ERP — Large enterprise",
              "Fusion HCM — HR / payroll",
              "Fusion SCM — Supply chain",
              "NetSuite — Mid-market ERP",
              "Oracle Health (Cerner) — EHR",
              "Oracle CX — Customer experience",
            ] },
          { name: "License & On-Premise", tag: "LEGACY", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B", border: "1px solid #1E293B",
            revenue: "$5.2B", revenueNote: "FY2025 (+2% YoY)", growth: "+2% YoY", sub: "Perpetual licenses + on-prem DB",
            details: [
              "Oracle Database (on-premises)",
              "Oracle Middleware",
              "Oracle Applications (on-prem ERP)",
              "Java / GraalVM licenses",
              "Technology licenses",
              "Declining as customers migrate to cloud",
            ] },
          { name: "Hardware", tag: "STABLE", tagBg: "rgba(100,116,139,0.12)", tagColor: "#94A3B8", color: "#94A3B8", border: "1px solid #1E293B",
            revenue: "$2.9B", revenueNote: "FY2025", growth: "Flat", sub: "Engineered systems + Exadata",
            details: [
              "Exadata — Database appliance",
              "Oracle Exalogic / Exalytics",
              "SPARC servers (legacy)",
              "Storage systems",
              "Hardware support & maintenance",
              "Exadata Cloud@Customer",
            ] },
        ].map((e, i) => (
          <div key={i} style={{ background: "#111827", border: e.border, borderRadius: 8, padding: "12px 12px 10px", position: "relative", minWidth: 0 }}>
            <div style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: e.tagBg, color: e.tagColor, fontWeight: 600, display: "inline-block", marginBottom: 6 }}>{e.tag}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC", marginBottom: 2, lineHeight: 1.2 }}>{e.name}</div>
            <div style={{ fontSize: 9, color: "#64748B", marginBottom: 8 }}>{e.sub}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 8 }}>
              <div style={{ background: "#0B0F19", borderRadius: 5, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Revenue</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: e.color }}>{e.revenue}</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>{e.revenueNote}</div>
              </div>
              <div style={{ background: "#0B0F19", borderRadius: 5, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Growth</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: e.color }}>{e.growth}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.7 }}>
              {e.details.map((d, di) => (
                <div key={di} style={{ color: "#94A3B8" }}>&bull; {d}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* === KEY SUBSIDIARIES === */}
      <div style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, marginTop: 4 }}>Key Subsidiaries &amp; Acquisitions</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { name: "Oracle Health (Cerner)", tag: "HEALTHCARE", tagBg: "rgba(16,185,129,0.12)", tagColor: "#10B981", color: "#10B981",
            acquired: "$28.3B", year: "Jun 2022", status: "Integrating",
            details: "Leading EHR/healthcare IT platform. Serves hospitals, health systems, VA. Integration ongoing — VA contract rollouts paused intermittently. Healthcare AI on OCI." },
          { name: "NetSuite", tag: "MID-MARKET ERP", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6", color: "#3B82F6",
            acquired: "$9.3B", year: "Nov 2016", status: "Mature",
            details: "Leading cloud ERP for mid-market. 37,500+ customers. Multi-subsidiary support. Oracle positions NetSuite for divisions while Fusion serves HQ. Strong recurring revenue." },
          { name: "OCI (Organic)", tag: "CLOUD INFRA", tagBg: "rgba(139,92,246,0.12)", tagColor: "#A78BFA", color: "#A78BFA",
            acquired: "Organic build", year: "Gen2 launched 2018", status: "Hypergrowth",
            details: "Gen2 cloud infrastructure built from scratch. +84% growth (Q3 FY26). GPU cloud (NVIDIA, AMD). Stargate JV backbone. Multicloud DB@AWS/Azure/GCP. 101+ regions." },
          { name: "Stargate LLC (JV)", tag: "AI JV", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B",
            acquired: "$7B equity", year: "Jan 2025", status: "Building",
            details: "JV with OpenAI (40%), SoftBank (40%), Oracle (~10%), MGX (~10%). Up to $500B / 10 GW commitment. Oracle provides DC infrastructure. 4.5 GW Oracle commitment." },
        ].map((e, i) => (
          <div key={i} style={{ background: "#111827", border: "1px solid #1E293B", borderRadius: 8, padding: "12px 12px 10px" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: e.tagBg, color: e.tagColor, fontWeight: 600 }}>{e.tag}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC", marginBottom: 8 }}>{e.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 8 }}>
              <div style={{ background: "#0B0F19", borderRadius: 5, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Acquired For</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: e.color }}>{e.acquired}</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>{e.year}</div>
              </div>
              <div style={{ background: "#0B0F19", borderRadius: 5, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Status</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: e.color }}>{e.status}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.7 }}>
              {e.details}
            </div>
          </div>
        ))}
      </div>

      {/* === DEBT STRUCTURE === */}
      <div style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, marginTop: 4 }}>Debt Structure &amp; Bond Tranches</div>
      <div style={s.card}>
        <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>Total debt: ~$162B (Feb 2026). Net debt: ~$90B. Oracle has been aggressively issuing debt to fund $50B FY2026 capex and Stargate buildout. CDS spreads widened above 125 bps (highest since 2009). Both S&P (BBB) and Moody's (Baa2) have negative outlooks. Adjusted leverage may exceed 4x in FY2027-2028.</div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Feb 2026 Bond Offering ($25B) — Record-Setting</div>
        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                {["Tranche", "Amount", "Coupon", "Maturity", "Type", "Notes"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { tranche: "Floating Rate Notes", amount: "$500M", coupon: "Floating", maturity: "2029", type: "Senior Unsecured", notes: "SOFR-based floating rate" },
                { tranche: "Fixed Notes", amount: "$3.0B", coupon: "4.55%", maturity: "2029", type: "Senior Unsecured", notes: "3-year tenor" },
                { tranche: "Fixed Notes", amount: "$3.5B", coupon: "4.95%", maturity: "2031", type: "Senior Unsecured", notes: "5-year tenor" },
                { tranche: "Fixed Notes", amount: "$3.0B", coupon: "5.35%", maturity: "2033", type: "Senior Unsecured", notes: "7-year tenor" },
                { tranche: "Fixed Notes", amount: "$5.0B", coupon: "5.70%", maturity: "2036", type: "Senior Unsecured", notes: "10-year tenor" },
                { tranche: "Fixed Notes", amount: "$2.25B", coupon: "6.55%", maturity: "2046", type: "Senior Unsecured", notes: "20-year tenor" },
                { tranche: "Fixed Notes", amount: "$5.0B", coupon: "6.70%", maturity: "2056", type: "Senior Unsecured", notes: "30-year tenor" },
                { tranche: "Fixed Notes", amount: "$2.75B", coupon: "6.85%", maturity: "2066", type: "Senior Unsecured", notes: "40-year tenor" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC" }}>{row.tranche}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 700 }}>{row.amount}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#F59E0B", fontWeight: 600 }}>{row.coupon}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.maturity}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.type}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 16 }}>$129B order book — surpassed Meta's 2025 record. Also: $20B at-the-market equity distribution agreement (BofA, Citi, Deutsche Bank, Goldman, JPM).</div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Sep 2025 Bond Offering ($18B)</div>
        <div style={{ overflowX: "auto", marginBottom: 16 }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                {["Tranche", "Amount", "Coupon", "Maturity", "Notes"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { tranche: "Fixed Notes", amount: "$3.0B", coupon: "4.45%", maturity: "2030", notes: "5-year tenor" },
                { tranche: "Fixed Notes", amount: "$3.0B", coupon: "4.80%", maturity: "2032", notes: "7-year tenor" },
                { tranche: "Fixed Notes", amount: "$4.0B", coupon: "5.20%", maturity: "2035", notes: "10-year tenor" },
                { tranche: "Fixed Notes", amount: "$2.5B", coupon: "5.875%", maturity: "2045", notes: "20-year tenor" },
                { tranche: "Fixed Notes", amount: "$3.5B", coupon: "5.95%", maturity: "2055", notes: "30-year tenor" },
                { tranche: "Fixed Notes", amount: "$2.0B", coupon: "6.10%", maturity: "2065", notes: "40-year tenor" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC" }}>{row.tranche}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 700 }}>{row.amount}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#F59E0B", fontWeight: 600 }}>{row.coupon}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.maturity}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* === CREDIT RISK MAP === */}
      <div style={s.card}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Credit Risk Assessment</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#EF4444", marginBottom: 6 }}>Leverage Concerns</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              Total debt ~$162B (Feb 2026). Net debt ~$90B. S&P-adjusted leverage may exceed 4x in FY2027-2028. Free operating cash flow deficit expected to widen significantly beyond $10B in FY2026. CapEx peaking FY2028. Both S&P and Moody's have negative outlooks.
            </div>
          </div>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 6 }}>RPO Backstop</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              $553B RPO (+325% YoY) provides massive revenue visibility. Most of the increase relates to large AI contracts where Oracle does not need incremental funding — customers prepay for GPUs or supply their own. RPO de-risks revenue but not capex.
            </div>
          </div>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B", marginBottom: 6 }}>Counterparty Concentration</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              Moody's flagged "significant counterparty risk" from $300B OpenAI Stargate deal. OpenAI is not investment grade and unprofitable. Large-scale AI contracts with a small number of counterparties concentrate risk. TikTok JV adds diversification.
            </div>
          </div>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#8B5CF6", marginBottom: 6 }}>Bond Market Signal</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              CDS spreads widened above 125 bps — levels not seen since the 2009 financial crisis. Bonds now trade like junk in secondary market despite BBB/Baa2 ratings. Feb 2026 $25B offering was well received ($129B book) but at widening spreads. Market pricing in downgrade risk.
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Sources: Oracle 10-K FY2025, 10-Q Q3 FY2026, S&P Global Ratings (BBB Negative), Moody's (Baa2 Negative), Fitch (BBB), Oracle IR, Bloomberg, DCD, SEC filings, CreditSights.</div>
    </>)}

    {/* ===== CONTRACTS SUB-TAB ===== */}
    {tab ==="contracts" && (<>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Supply Chain &amp; Customer Contracts</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>Oracle's $553B RPO backlog is dominated by large-scale AI infrastructure contracts. Revenue breakdown: Cloud Services &amp; License Support $44B (FY25), Cloud Infrastructure $4.9B/qtr (+84% YoY, Q3 FY26), Cloud Applications $3.9B/qtr (+11%). Multicloud DB revenue grew 817% in Q2 FY26.</div>

      {/* Contract Comparison: AI vs Traditional */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Revenue Breakdown &amp; Growth</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                {["Segment", "FY2025 Revenue", "Q3 FY2026 Revenue", "Growth Rate", "% of Total", "Key Drivers"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { seg: "Cloud Infrastructure (OCI)", fy25: "~$10B (est)", q3: "$4.9B", growth: "+84% YoY", pct: "~28%", drivers: "GPU compute (NVIDIA/AMD), Stargate JV, AI training/inference, DGX Cloud" },
                { seg: "Cloud Applications (SaaS)", fy25: "~$14B (est)", q3: "$3.9B", growth: "+11% YoY", pct: "~23%", drivers: "Fusion ERP/HCM/SCM, NetSuite, Oracle Health (Cerner), CX" },
                { seg: "License Support", fy25: "~$20B (est)", q3: "Included above", growth: "+3-4% YoY", pct: "~35%", drivers: "Database maintenance renewals. High-margin, declining growth." },
                { seg: "Cloud License & On-Prem", fy25: "$5.2B", q3: "~$1.1B", growth: "+2% YoY", pct: "~9%", drivers: "Perpetual licenses. Declining as customers migrate to cloud subscriptions." },
                { seg: "Hardware", fy25: "$2.9B", q3: "~$0.7B", growth: "Flat", pct: "~5%", drivers: "Exadata appliances, SPARC (legacy), storage. Stable but not growing." },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.seg}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600 }}>{row.fy25}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#10B981", fontWeight: 600 }}>{row.q3}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#F59E0B", fontWeight: 600 }}>{row.growth}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.pct}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.drivers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>GPU-related revenue grew 243% YoY in Q3 FY2026 and 177% in Q2. OCI revenue target: $18B for FY2026 (per CEO Safra Catz). Total cloud growth guided &gt;40% for FY2026.</div>
      </div>

      {/* Major AI & Cloud Partnerships */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Major AI &amp; Cloud Partnerships</div>
        <div style={{ display: "flex", gap: 16 }}>

        {/* AI Infrastructure */}
        <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #10B981" }}>AI Infrastructure Contracts</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 11 }}>
            <thead>
              <tr>
                {["Partner", "Deal", "Value / Scale", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { partner: "OpenAI / Stargate", deal: "AI DC JV — 4.5 GW Oracle capacity", value: "~$300B JV total", status: "Building (Abilene TX Phase 1 mid-2026)" },
                { partner: "NVIDIA", deal: "DGX Cloud on OCI + GPU supply", value: "400K+ GPUs for Stargate", status: "Active — GB200, planning Vera Rubin" },
                { partner: "AMD", deal: "MI450 GPU supercluster on OCI", value: "50K MI450 GPUs", status: "Launching Q3 CY2026" },
                { partner: "DOE / Argonne", deal: "Solstice + Equinox supercomputers", value: "110K GPUs total", status: "Equinox H1 2026, Solstice 2027" },
                { partner: "Meta", deal: "OCI AI infrastructure", value: "Included in $553B RPO", status: "Active" },
                { partner: "SoftBank", deal: "Stargate JV co-investor", value: "$19B committed (40% stake)", status: "Active" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.partner}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 11 }}>{row.deal}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600 }}>{row.value}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        {/* Multicloud & Enterprise */}
        <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #F59E0B" }}>Multicloud &amp; Enterprise Partnerships</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 11 }}>
            <thead>
              <tr>
                {["Partner", "Integration", "Regions", "Growth"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { partner: "Microsoft Azure", integration: "Oracle Database@Azure", regions: "33 regions (from 14)", growth: "Deepest multicloud integration" },
                { partner: "AWS", integration: "Oracle Database@AWS", regions: "2 GA, expanding to 20+", growth: "GA in Virginia, Oregon, Frankfurt, Tokyo" },
                { partner: "Google Cloud", integration: "Oracle Database@Google Cloud", regions: "11 regions (+9 planned)", growth: "GCP marketplace listings" },
                { partner: "TikTok / ByteDance", integration: "US JV investor + OCI host", regions: "US-based infrastructure", growth: "15% stake. Long-term OCI tenant." },
                { partner: "Enterprise SaaS", integration: "Fusion ERP, HCM, SCM, NetSuite", regions: "Global", growth: "37,500+ NetSuite customers" },
                { partner: "Oracle Health", integration: "Cerner EHR on OCI", regions: "US, UK, global", growth: "VA contract. Healthcare AI." },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.partner}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 11 }}>{row.integration}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600 }}>{row.regions}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>Sources: Oracle IR, OpenAI Stargate announcements, NVIDIA GTC 2026, AMD OCI announcement, DOE/Argonne, Oracle multicloud blog, Morningstar, DCD.</div>
      </div>

      {/* Key Risk Factors */}
      <div style={s.card}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>Key Business &amp; Credit Risk Factors</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { title: "Massive CapEx Commitment", desc: "FY2026 capex guided to $50B (up from $21.2B FY2025). CapEx expected to peak FY2028. Free cash flow likely negative for several years. Funded by $25B bond offering + $20B ATM equity + operating cash flow ($20.8B FY2025).", color: "#EF4444" },
            { title: "Counterparty Concentration", desc: "Moody's flagged 'significant counterparty risk' from OpenAI/Stargate ($300B JV). OpenAI is unprofitable and not investment grade. A small number of large AI contracts dominate the $553B RPO backlog.", color: "#EF4444" },
            { title: "Leverage & Downgrade Risk", desc: "Total debt ~$162B. Net debt ~$90B. CDS spreads above 125 bps. Both S&P (BBB) and Moody's (Baa2) have negative outlooks. Adjusted leverage may exceed 4x in FY2027-2028. Bonds already trading like junk in secondary market.", color: "#F59E0B" },
            { title: "Execution Risk on Stargate", desc: "4.5 GW Oracle commitment is unprecedented. 400K GPU deployment at Abilene TX by mid-2026. Construction delays, supply chain issues, or counterparty changes could impact timeline and revenue recognition.", color: "#F59E0B" },
            { title: "Oracle Health (Cerner) Integration", desc: "$28.3B Cerner acquisition (2022) integration still ongoing. VA contract rollouts paused intermittently due to software stability. Healthcare AI opportunity offset by near-term execution challenges.", color: "#F59E0B" },
            { title: "RPO Quality & Revenue Visibility", desc: "Most $553B RPO backed by customer prepayments or customer-supplied GPUs — Oracle says it does not need incremental funding. But RPO is 'signed contracts' not 'recognized revenue' — long conversion timeline.", color: "#10B981" },
          ].map((item, i) => (
            <div key={i} style={{ flex: "1 1 280px", minWidth: 280, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: "1.6" }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 14, fontStyle: "italic" }}>Sources: Oracle 10-K FY2025, 10-Q Q3 FY2026, S&P Global Ratings, Moody's, Bloomberg, CreditSights, Oracle IR, DOE/Argonne.</div>
      </div>

      {/* ═══ Stargate Deep Dive ═══ */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#10B981" }}>Stargate JV (OpenAI / SoftBank / Oracle / MGX)</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>Largest AI infrastructure project in history &middot; Up to $500B / 10 GW &middot; Oracle providing DC capacity</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" }}>Total JV Commitment</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>$500B</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Announced", value: "Jan 21, 2025", sub: "By President Trump" },
            { label: "Oracle Role", value: "DC Builder", sub: "4.5 GW capacity commitment" },
            { label: "Oracle Equity", value: "$7B", sub: "~10% ownership" },
            { label: "OpenAI Stake", value: "40%", sub: "$19B committed. Operational lead." },
            { label: "SoftBank Stake", value: "40%", sub: "$19B committed. Financial lead." },
            { label: "Phase 1", value: "Abilene, TX", sub: "1.2 GW, 400K GPUs, mid-2026" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "10px 14px", flex: "1 1 130px", minWidth: 130 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>{m.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Stargate Structure &amp; Terms</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <tbody>
            {[
              { term: "Total Investment", detail: "Up to $500B in AI infrastructure in the US by 2029. Initial $100B deployment immediately. Oracle-OpenAI specific deal valued at ~$300B for 4.5 GW of additional data center capacity." },
              { term: "Ownership", detail: "OpenAI 40%, SoftBank 40%, Oracle ~10%, MGX ~10%. Each of OpenAI and SoftBank committed $19B. Oracle and MGX each contributed $7B." },
              { term: "Oracle's Role", detail: "Oracle builds and operates data center infrastructure. 4.5 GW capacity commitment. Phase 1 at Abilene TX (1.2 GW, 400K NVIDIA GB200 GPUs). Oracle purchases GPUs (~$40B for Abilene alone) and leases compute to OpenAI under 15-year agreement." },
              { term: "GPU Procurement", detail: "Oracle spending ~$40B on NVIDIA chips for Abilene facility alone. GB200 NVL72 (Blackwell) initially, transitioning to future generations. Dual-sourcing with AMD MI450 on OCI more broadly." },
              { term: "Revenue Model", detail: "OpenAI is anchor tenant. 15-year lease agreement. Oracle earns recurring GPU lease revenue. Most RPO from Stargate supported by customer prepayments — Oracle says it does not need to raise incremental funds for most of this capacity." },
              { term: "Expansion Plans", detail: "5+ additional sites beyond Abilene announced. Expansion to multiple US states and potentially UK, Norway, Japan, UAE. On track for full $500B / 10 GW commitment by end of decade." },
              { term: "Stargate Disputes", detail: "Reports of partner disputes potentially stalling some expansion. Oracle-OpenAI relationship is strong but JV governance with SoftBank adds complexity. Larry Ellison and Sam Altman personally finalized $300B terms in Sep 2025." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 180, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Sources: OpenAI announcements, Oracle IR, Bloomberg, DCD, Data Center Frontier, CNBC, Reuters.</div>
      </div>

      {/* ═══ TikTok ═══ */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F59E0B" }}>TikTok / ByteDance</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>Oracle as 15% JV investor + trusted security partner + OCI cloud host</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" }}>Oracle Stake</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>15%</div>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <tbody>
            {[
              { term: "Deal Structure", detail: "ByteDance finalized binding agreement for US-based TikTok joint venture on December 19, 2025. Three managing investors: Silver Lake, Oracle, and MGX, each holding 15%. Oracle named as 'trusted security partner.'" },
              { term: "Cloud Revenue", detail: "TikTok is already a major OCI customer for non-AI workloads (video serving, content delivery, data storage). The JV secures TikTok as a long-term, high-margin cloud infrastructure tenant." },
              { term: "Strategic Value", detail: "Per Morningstar: deal secures major cash flow but does little to de-risk the data center buildout. Per RBC: supports OCI growth and reduces customer concentration risk vs. reliance on OpenAI." },
              { term: "Revenue Impact", detail: "Specific TikTok OCI revenue not disclosed. Included within Oracle's cloud services revenue. High-margin, stable workloads (non-AI) complement volatile GPU compute revenue." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 180, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Sources: Morningstar, Rest of World, CNBC, RBC Capital, Oracle IR.</div>
      </div>
    </>)}

    {/* ===== SENTIMENT SUB-TAB ===== */}
    {tab ==="sentiment" && (<>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Market Sentiment</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>33-44 analysts covering. Consensus: Buy. Avg PT ~$260-266. Stock ~$138 (Apr 10, 2026). PT range: $160 (RBC) to $400 (Guggenheim). Investment grade but negative outlook from S&P and Moody's. Massive $553B RPO backlog.</div>

      {/* Consensus Snapshot */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Consensus Rating", value: "Buy", sub: "33 of 44 analysts rate Buy. 10 Hold. 1 Sell.", color: "#10B981" },
          { label: "Avg Price Target", value: "~$261", sub: "Range: $160 (RBC) to $400 (Guggenheim) — see Financials tab for live price / P/E", color: "#3B82F6" },
          { label: "Credit Ratings", value: "BBB / Baa2", sub: "S&P Negative. Moody's Negative. Fitch BBB.", color: "#F59E0B" },
        ].map((m, i) => (
          <div key={i} style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: "14px 18px", flex: "1 1 180px", minWidth: 180 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Sentiment Timeline */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Sentiment Arc: FY2025 to Present</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { phase: "Current (Apr 2026)", sentiment: "Recovery / Cautious Optimism", color: "#10B981", desc: "Stock ~$138. Down from ATH $198 (Nov 2024). $25B bond offering well received ($129B book). Q3 FY26 beat: revenue $17.2B (+22%), OCI +84%. RPO $553B. FY27 guide raised to $90B. But stock down ~30% from highs on CapEx/leverage fears." },
            { phase: "Q3 FY26 Earnings (Mar 10, 2026)", sentiment: "Beat & Raise", color: "#3B82F6", desc: "Revenue $17.2B (+22% YoY) beat. EPS $1.27 GAAP (+24%), $1.79 non-GAAP (+21%). RPO $553B (+325%). FY26 revenue $67B maintained. FY27 raised to $90B. Capex $50B for FY26. Guggenheim initiated at $400 PT." },
            { phase: "Feb 2026 Bond Offering", sentiment: "Market Validation", color: "#8B5CF6", desc: "$25B 8-part bond offering + $20B ATM equity. $129B order book (record). Maturities 2029-2066. Coupons 4.55%-6.85%. Raised total funding to cover $50B FY26 capex. But CDS spreads above 125 bps — bonds trading like junk despite BBB rating." },
            { phase: "Q2 FY26 Earnings (Dec 2025)", sentiment: "Mixed — CapEx Shock", color: "#F59E0B", desc: "Revenue $16.1B (+13%). Cloud $8B (+33%). OCI $4.1B (+66%). BUT: CapEx $12B (vs $8.25B expected). FY26 capex guidance raised by $15B to $50B total. Moody's revised outlook to Negative. Stock sold off on leverage concerns." },
            { phase: "TikTok JV (Dec 2025)", sentiment: "Positive Catalyst", color: "#10B981", desc: "ByteDance finalized US TikTok JV. Oracle as 15% investor + trusted security partner + OCI host. Secures major long-term cloud customer. RBC: reduces customer concentration risk." },
            { phase: "Stargate Announcement (Jan 2025)", sentiment: "Euphoric", color: "#3B82F6", desc: "$500B Stargate JV announced by President Trump. OpenAI, SoftBank, Oracle, MGX. Oracle stock surged. Larry Ellison and Sam Altman formalized $300B Oracle-OpenAI deal by Sep 2025. Abilene TX Phase 1 (1.2 GW) underway." },
            { phase: "ATH (Nov 2024)", sentiment: "Peak Euphoria", color: "#10B981", desc: "Stock hit all-time high ~$198. Driven by AI narrative, OCI growth, and Stargate anticipation. P/E expanded significantly. Multiple analysts at $200+ targets." },
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
                {["Firm", "Rating", "Price Target", "Last Action", "Key Thesis"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { firm: "Guggenheim", rating: "Buy", pt: "$400", action: "Initiated (Mar 13, 2026)", thesis: "Street-high PT. Massive RPO = multi-year revenue visibility. AI infrastructure leader." },
                { firm: "Oppenheimer", rating: "Outperform", pt: "$275", action: "Initiated (Mar 2, 2026)", thesis: "$553B RPO at ~$138 stock = massive disconnect. OCI growth trajectory unmatched." },
                { firm: "Deutsche Bank", rating: "Buy", pt: "$260", action: "Maintained (Mar 2026)", thesis: "Structural AI demand winner. Stargate JV de-risks long-term revenue." },
                { firm: "Goldman Sachs", rating: "Buy", pt: "$250", action: "Maintained (2026)", thesis: "OCI is fastest-growing major cloud. Multicloud DB strategy expands TAM." },
                { firm: "Barclays", rating: "Overweight", pt: "$245", action: "Maintained (2026)", thesis: "Best positioned for AI infrastructure buildout among legacy tech." },
                { firm: "JPMorgan", rating: "Overweight", pt: "$240", action: "Maintained (2026)", thesis: "RPO growth validates AI capex cycle. FY27 $90B guide is credible." },
                { firm: "Citi", rating: "Buy", pt: "$235", action: "Maintained (2026)", thesis: "OCI growth + multicloud DB + Stargate = triple growth engine." },
                { firm: "Wells Fargo", rating: "Overweight", pt: "$230", action: "Maintained (2026)", thesis: "AI infrastructure demand extends multiple years. Oracle = NVIDIA channel partner." },
                { firm: "Bank of America", rating: "Buy", pt: "$220", action: "Maintained (2026)", thesis: "Pullback from ATH creates entry point. $553B RPO underappreciated." },
                { firm: "Evercore ISI", rating: "Outperform", pt: "$210", action: "Maintained (2026)", thesis: "AI capex cycle early innings. Oracle's scale advantage durable." },
                { firm: "Morgan Stanley", rating: "Equal Weight", pt: "$185", action: "Maintained (2026)", thesis: "Revenue growth strong but leverage rising. FCF negative for years. Execution risk." },
                { firm: "RBC Capital", rating: "Sector Perform", pt: "$160", action: "Issued (Mar 11, 2026)", thesis: "Street-low PT. Capex concerns. Leverage may exceed 4x. Downgrade risk." },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.firm}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                      background: row.rating.includes("Buy") || row.rating.includes("Overweight") || row.rating.includes("Outperform") ? "rgba(16,185,129,0.12)" : row.rating.includes("Sell") || row.rating.includes("Underperform") ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                      color: row.rating.includes("Buy") || row.rating.includes("Overweight") || row.rating.includes("Outperform") ? "#10B981" : row.rating.includes("Sell") || row.rating.includes("Underperform") ? "#EF4444" : "#F59E0B",
                    }}>{row.rating}</span>
                  </td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#3B82F6" }}>{row.pt}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.action}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 12, maxWidth: 350 }}>{row.thesis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Research */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Credit Research &amp; Ratings</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                {["Agency / Firm", "Rating / View", "Outlook", "Key Points"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { agency: "S&P Global", rating: "BBB (Issuer)", outlook: "Negative", points: "Affirmed BBB but negative outlook. CapEx plans strain credit profile. S&P-adjusted leverage may exceed 4x in FY2027-2028. FCF deficit widening beyond $10B in FY2026." },
                { agency: "Moody's", rating: "Baa2 (Senior Unsecured)", outlook: "Negative", points: "Revised to negative from stable. Elevated leverage and increasingly negative FCF. RPO backlog is credit positive but counterparty risk and capex requirements are primary concerns." },
                { agency: "Fitch", rating: "BBB", outlook: "Stable", points: "Most favorable view. RPO growth and revenue visibility support rating. Watching leverage trajectory." },
                { agency: "CreditSights", rating: "Outperform (Apr 2026)", outlook: "Upgraded", points: "Upgraded to Outperform in April 2026. CDS spreads above 125 bps (highest since 2009). $25B bond offering well received. Bonds trading wider than rating implies." },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC" }}>{row.agency}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>{row.rating}</span>
                  </td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: row.outlook === "Positive" || row.outlook === "Stable" || row.outlook === "Upgraded" ? "#10B981" : row.outlook === "Negative" ? "#EF4444" : "#94A3B8", fontWeight: 600 }}>{row.outlook}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 12, maxWidth: 400 }}>{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>Sources: S&P Global Ratings, Moody's Investors Service, Fitch Ratings, CreditSights, Bloomberg, Oracle filings. Ratings as of Apr 2026.</div>
      </div>

      {/* Market Positioning */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Market Positioning &amp; Key Metrics</div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Financial Snapshot</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "FY2025 Revenue", value: "$57.4B", sub: "+8% YoY" },
            { label: "FY2025 GAAP EPS", value: "$4.34", sub: "Non-GAAP: $6.03" },
            { label: "FY2025 OCF", value: "$20.8B", sub: "+12% YoY" },
            { label: "RPO", value: "$553B", sub: "+325% YoY (Q3 FY26)" },
            { label: "Total Debt", value: "~$162B", sub: "Net debt ~$90B" },
            { label: "FY2026E CapEx", value: "$50B", sub: "Up from $21.2B FY25" },
          ].map((m, i) => (
            <div key={i} style={{ flex: "1 1 140px", minWidth: 140 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>{m.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Key Leadership</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 20 }}>
          <thead>
            <tr>
              {["Executive", "Title", "Background", "Notes"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { exec: "Larry Ellison", title: "Chairman & CTO", bg: "Co-founder (1977). Former CEO. Net worth ~$200B+.", notes: "Visionary behind Oracle DB and OCI pivot. Personally finalized $300B Stargate terms with Sam Altman." },
              { exec: "Clay Magouyrk", title: "Co-CEO (from Sep 2025)", bg: "Age 39. Former President of OCI. Joined Oracle 2014 from AWS.", notes: "Founding member of Oracle cloud engineering. Architected Gen2 OCI. Youngest CEO of a major tech company." },
              { exec: "Mike Sicilia", title: "Co-CEO (from Sep 2025)", bg: "Age 54. Former President of Oracle Industries. Joined via Primavera acquisition.", notes: "Leads Oracle Health (Cerner), industry verticals, and enterprise applications." },
              { exec: "Safra Catz", title: "Executive Vice Chair of Board", bg: "CEO from 2014-2025. 26-year partnership with Ellison.", notes: "Transitioned from CEO to Vice Chair Sep 2025. Guides Oracle's strategic direction and growth." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", fontSize: 11 }}>{row.exec}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600, fontSize: 11 }}>{row.title}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.bg}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Bull vs. Bear Case</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 8 }}>Bull Case</div>
            <div style={{ fontSize: 11, color: "#E2E8F0", lineHeight: 1.7 }}>
              &bull; $553B RPO (+325% YoY) = unprecedented revenue visibility<br/>
              &bull; OCI growing 84% — fastest major cloud provider<br/>
              &bull; Stargate JV: $300B+ deal with OpenAI anchors decade of growth<br/>
              &bull; Multicloud DB strategy (AWS, Azure, GCP) expands TAM massively<br/>
              &bull; FY27 $90B revenue guide implies 34% growth acceleration<br/>
              &bull; TikTok JV diversifies customer base<br/>
              &bull; GPU revenue +243% — AI infrastructure leader<br/>
              &bull; RPO largely pre-funded by customers (no incremental capital needed)
            </div>
          </div>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#EF4444", marginBottom: 8 }}>Bear Case</div>
            <div style={{ fontSize: 11, color: "#E2E8F0", lineHeight: 1.7 }}>
              &bull; Total debt ~$162B, net debt ~$90B — leverage rising<br/>
              &bull; CDS spreads above 125 bps (2009 crisis levels)<br/>
              &bull; S&P + Moody's both Negative outlook — downgrade risk<br/>
              &bull; $50B FY26 capex with FCF deficit widening beyond $10B<br/>
              &bull; Counterparty risk: OpenAI unprofitable, not IG-rated<br/>
              &bull; Stock down ~30% from ATH on leverage/capex fears<br/>
              &bull; Cerner/Oracle Health integration still challenging<br/>
              &bull; CapEx peaking FY2028 — years of negative FCF ahead
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Sources: Oracle IR, SEC filings (10-K, 10-Q), analyst reports (Guggenheim, RBC, Oppenheimer, Goldman, JPM, Citi, BofA, Wells Fargo, Deutsche Bank, Evercore, Barclays, Morgan Stanley), S&P, Moody's, Fitch, CreditSights, Bloomberg, TipRanks, StockAnalysis, MarketBeat.</div>
      </div>
    </>)}

    </>)}
    </ReviewShell>
  );
}
