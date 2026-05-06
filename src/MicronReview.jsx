import { ReviewShell, reviewStyles as s } from "./GenericReview";

export default function MicronReview({ companyId, companyName, curFields, updateField, editingField, setEditingField }) {
  return (
    <ReviewShell ticker="MU" companyId={companyId} companyName={companyName}
      curFields={curFields} updateField={updateField}
      editingField={editingField} setEditingField={setEditingField}>
      {(tab) => (<>

      {/* ===== OVERVIEW TAB ===== */}
      {tab ==="overview" && (<>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Micron Technology (MU)</div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>DRAM &amp; NAND Memory Semiconductor &middot; NASDAQ: MU &middot; Founded 1978 &middot; Boise, Idaho</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(16,185,129,0.15)", color: "#10B981" }}>S&amp;P: BBB-</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(16,185,129,0.15)", color: "#10B981" }}>Moody's: Baa3</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(16,185,129,0.15)", color: "#10B981" }}>Investment Grade</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>Market Cap</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#3B82F6" }}>~$474B</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>~$419/share &middot; P/E ~18x (TTM) &middot; Fwd P/E ~7x</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "FY2025 Revenue", value: "$37.4B", sub: "+49% YoY" },
            { label: "Q2 FY2026 Rev", value: "$23.9B", sub: "+196% YoY, +75% QoQ" },
            { label: "Q2 FY2026 EPS", value: "$12.20", sub: "Beat est. $8.79 by 39%" },
            { label: "Q2 Gross Margin", value: "74.4%", sub: "Record, up from 45.7% Q4 FY25" },
            { label: "DRAM % Rev", value: "77%", sub: "$28.6B FY2025" },
            { label: "Data Center % Rev", value: "56%", sub: "Record in FY2025" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "10px 14px", flex: "1 1 130px", minWidth: 130 }}>
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
        <div style={{ fontSize: 13, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #3B82F6" }}>0–6 Months (Apr – Oct 2026)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { date: "Mar 20", event: "Q2 FY2026 earnings blowout", type: "Earnings", detail: "Revenue $23.9B (+196% YoY). EPS $12.20 vs $8.79 est. Gross margin 74.4%. Record free cash flow. HBM revenue exceeded $5B in the quarter. Stock surged to ATH ~$471." },
            { date: "Mar 25-31", event: "Senior notes tender offers", type: "Financing", detail: "Cash tender offers for six series of senior notes maturing 2031-2035 totaling $5.4B principal. Strengthening balance sheet as profitability surges." },
            { date: "Feb 28", event: "India ATMP facility opens", type: "Capacity", detail: "$2.75B semiconductor assembly and test plant in Sanand, Gujarat. First made-in-India memory shipped to Dell. 500K+ sq ft cleanroom. 5,000 direct jobs." },
            { date: "Q3 FY26", event: "Q3 FY2026 earnings (Jun)", type: "Earnings", detail: "Guided revenue $33.5B (+/-$750M). Gross margin ~81%. Operating expenses ~$1.4B. Continuation of explosive growth driven by HBM and data center demand." },
            { date: "H1 2026", event: "HBM4 mass production ramp", type: "Product", detail: "Micron ramping HBM4 production aligned with NVIDIA Rubin platform launch. Targeting DRAM-like market share in HBM. HBM TAM growing from $38B (2025) to $58B (2026)." },
            { date: "Mid-2026", event: "New York megafab construction begins", type: "Capacity", detail: "First fab at $100B Clay, NY manufacturing complex. CHIPS Act funding redirected: ~$3.4B to NY, ~$2.8B to Idaho. 600K sq ft cleanroom per fab." },
            { date: "2026", event: "Idaho HVM fab acceleration", type: "Capacity", detail: "$25B investment in Boise-area HVM fab. Received additional $1.2B in reallocated CHIPS Act funding. Leading-edge DRAM production." },
            { date: "2026", event: "Singapore NAND expansion", type: "Capacity", detail: "$24B investment to expand NAND wafer manufacturing in Singapore. Adding 700K sq ft of cleanroom space. Announced Jan 2026." },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 10px", background: "#0B0F19", borderRadius: 6, border: "1px solid #1E293B" }}>
              <div style={{ width: 75, minWidth: 75 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6" }}>{c.date}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC" }}>{c.event}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 3,
                    background: c.type === "Earnings" ? "rgba(139,92,246,0.12)" : c.type === "Capacity" ? "rgba(16,185,129,0.12)" : c.type === "Financing" ? "rgba(59,130,246,0.12)" : c.type === "Contract" ? "rgba(239,68,68,0.12)" : c.type === "Product" ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.12)",
                    color: c.type === "Earnings" ? "#8B5CF6" : c.type === "Capacity" ? "#10B981" : c.type === "Financing" ? "#3B82F6" : c.type === "Contract" ? "#EF4444" : c.type === "Product" ? "#F59E0B" : "#F59E0B",
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
            { date: "Q4 FY26", event: "Q4 FY2026 earnings (Sep 2026)", type: "Earnings", detail: "Full-year FY2026 revenue tracking toward $90-100B+ based on quarterly trajectory. DRAM supercycle driven by AI/HBM demand. Margin expansion continuing." },
            { date: "Late 2026", event: "HBM4 volume production", type: "Product", detail: "Full-scale HBM4 production for NVIDIA Rubin GPUs. Competing with SK Hynix (est. 50%+ HBM share) and Samsung (est. 30%+). Micron targeting ~20%+ HBM share matching DRAM share." },
            { date: "2027", event: "India ATMP Phase 1 full ramp", type: "Capacity", detail: "Sanand facility scaling from tens of millions of chips (2026) to hundreds of millions (2027). Phase 1 at full 500K+ sq ft cleanroom utilization." },
            { date: "2027", event: "Idaho fab Phase 1 production", type: "Capacity", detail: "Leading-edge DRAM production begins at accelerated Idaho HVM fab. Part of $25B investment. CHIPS Act supported." },
            { date: "2027", event: "New York fab construction continues", type: "Capacity", detail: "Multi-year buildout of first two of four planned fabs at $100B megafab complex in Clay, NY. 2.4M sq ft total cleanroom across all four fabs." },
            { date: "2027", event: "HBM4E development", type: "Product", detail: "Next-generation HBM4E expected to hit 40% of 2027 HBM market per TrendForce. Samsung and SK Hynix targeting H1 2026 completion; Micron following." },
            { date: "H1 2027", event: "CHIPS Act milestone reviews", type: "Partnership", detail: "Department of Commerce reviews progress on $6.165B CHIPS Act commitments. Idaho and New York projects must hit construction milestones to unlock remaining tranches." },
            { date: "2027", event: "Singapore expansion completion", type: "Capacity", detail: "New NAND cleanroom space coming online at expanded Singapore manufacturing complex. 700K sq ft addition." },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 10px", background: "#0B0F19", borderRadius: 6, border: "1px solid #1E293B" }}>
              <div style={{ width: 85, minWidth: 85 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B" }}>{c.date}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC" }}>{c.event}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 3,
                    background: c.type === "Earnings" ? "rgba(139,92,246,0.12)" : c.type === "Capacity" ? "rgba(16,185,129,0.12)" : c.type === "Financing" ? "rgba(59,130,246,0.12)" : c.type === "Contract" ? "rgba(239,68,68,0.12)" : c.type === "Product" ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.12)",
                    color: c.type === "Earnings" ? "#8B5CF6" : c.type === "Capacity" ? "#10B981" : c.type === "Financing" ? "#3B82F6" : c.type === "Contract" ? "#EF4444" : c.type === "Product" ? "#F59E0B" : "#F59E0B",
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
            { label: "Product", color: "#F59E0B" },
            { label: "Partnership", color: "#A78BFA" },
          ].map((l, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748B" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: Micron IR, SEC filings (10-K, 10-Q, 8-K), CHIPS Act fact sheets, DataCenterDynamics, TrendForce, earnings call transcripts.</div>
      </div>

      {/* Supply Chain & Ecosystem Map — OpenAI style layers */}
      <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Micron Supply Chain &amp; Ecosystem Map</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {[
          { label: "Customers", items: [
            { name: "Apple", sub: "Largest single customer. DRAM and NAND for iPhone, iPad, Mac. ~10-15% of revenue historically.", color: "#F59E0B" },
            { name: "NVIDIA", sub: "HBM3E/HBM4 for H200, B200, GB200, Rubin GPUs. Key AI growth driver.", color: "#F59E0B" },
            { name: "Cloud / Data Center", sub: "AWS, Azure, Google Cloud — server DRAM, SSDs, HBM. 56% of FY2025 revenue.", color: "#F59E0B" },
            { name: "PC OEMs", sub: "Dell, HP, Lenovo — client DRAM and NAND for PCs and laptops.", color: "#F59E0B" },
            { name: "Mobile OEMs", sub: "Samsung, Xiaomi, Oppo — LPDDR5X for smartphones.", color: "#F59E0B" },
            { name: "Automotive", sub: "Tesla, BMW, Ford — LPDDR5, eMMC/UFS for ADAS, infotainment.", color: "#F59E0B" },
          ]},
          { label: "Micron Platform", items: [
            { name: "Micron Technology", sub: "#3 Global Memory · ~25% DRAM share · ~13% NAND share · ~21% HBM share · $474B mkt cap", color: "#3B82F6" },
          ]},
          { label: "Equipment Suppliers", items: [
            { name: "ASML", sub: "EUV lithography systems — critical for leading-edge DRAM nodes (1-beta, 1-gamma).", color: "#10B981" },
            { name: "Applied Materials", sub: "Deposition, etch, CMP equipment — largest semiconductor equipment supplier.", color: "#10B981" },
            { name: "Lam Research", sub: "Etch and deposition systems — key for 3D NAND layer stacking and DRAM patterning.", color: "#10B981" },
            { name: "Tokyo Electron", sub: "Coater/developer, etch, deposition — Japan-based, critical for Micron's Japan fabs.", color: "#10B981" },
          ]},
          { label: "Raw Materials", items: [
            { name: "Silicon Wafers", sub: "Shin-Etsu, SUMCO, Siltronic — 300mm wafer supply.", color: "#8B5CF6" },
            { name: "Specialty Chemicals", sub: "Photoresists (JSR, TOK), CMP slurries (CMC Materials), etch gases.", color: "#8B5CF6" },
            { name: "Packaging / HBM", sub: "TSV (through-silicon via), advanced packaging for HBM stacking. Micron does in-house + OSAT partners.", color: "#8B5CF6" },
          ]},
          { label: "Competitors", items: [
            { name: "Samsung Electronics", sub: "~40% DRAM, ~33% NAND share. Largest memory maker. Recovering HBM position (~17→30%+ share).", color: "#EF4444" },
            { name: "SK Hynix", sub: "~35% DRAM, ~20% NAND share. HBM market leader at 62% share. First to mass-produce HBM3E.", color: "#EF4444" },
            { name: "Kioxia / Western Digital", sub: "NAND-only. Combined ~30% NAND share. No DRAM or HBM. Kioxia IPO'd Oct 2024.", color: "#EF4444" },
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
      <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Flow: Equipment Suppliers + Raw Materials → Micron (wafer fab, assembly, test) → Customers (data center, mobile, client, auto, embedded). CHIPS Act funding enables US capacity expansion.</div>

      {/* Major Contracts / Customers */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Major Contracts &amp; Customers</div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>Key customers span data center AI (NVIDIA HBM), cloud hyperscalers (AWS, Azure, GCP), mobile (Apple), PC OEMs, and automotive. Data center reached record 56% of FY2025 revenue. HBM + high-capacity DIMMs + LP server DRAM combined revenue hit $10B in FY2025 (5x YoY).</div>

        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 900 }}>
            <thead>
              <tr>
                {["Customer / Segment", "Products", "Est. Revenue Share", "Trend", "Strategic Importance", "Source"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  cust: "Data Center / Cloud",
                  products: "HBM3E, HBM4, Server DRAM (high-capacity DIMMs, LPDDR5X), Data Center SSDs",
                  share: "56% of FY2025 rev (~$20.9B)",
                  trend: "Rapidly growing — record in FY2025. Q4 FY25 cloud BU alone was $4.5B (40% of quarterly rev).",
                  importance: "Primary growth engine. AI/HBM driving supercycle. Combined HBM + high-cap DIMMs + LP server DRAM hit $10B in FY2025 (5x YoY).",
                  source: "Micron Q4 FY2025 earnings, 10-K",
                },
                {
                  cust: "NVIDIA (HBM)",
                  products: "HBM3E (8-hi, 12-hi stacks), HBM4 (ramping 2026)",
                  share: "Part of Data Center segment",
                  trend: "HBM revenue exceeded $5B in Q2 FY2026 alone. Growing from $38B TAM (2025) to $58B TAM (2026).",
                  importance: "Qualified for NVIDIA H200, B200, GB200. HBM4 for Rubin platform. Micron at ~21% HBM share vs SK Hynix 62%, Samsung 17%.",
                  source: "TrendForce, Micron IR, earnings calls",
                },
                {
                  cust: "Apple",
                  products: "LPDDR5X DRAM, NAND flash (iPhone, iPad, Mac)",
                  share: "~10-15% of total revenue (est.)",
                  trend: "Stable, large customer. iPhone cycle dependent.",
                  importance: "Largest single customer historically. Long-standing relationship. Micron supplies both DRAM and NAND for Apple devices.",
                  source: "Industry estimates, supply chain reports",
                },
                {
                  cust: "Mobile OEMs",
                  products: "LPDDR5X, UFS/eMMC NAND for smartphones",
                  share: "Part of Mobile BU — $3.76B in Q4 FY2025",
                  trend: "Recovering from inventory correction. AI-on-device driving higher memory per phone.",
                  importance: "Android OEMs (Samsung, Xiaomi, Oppo, Vivo). Premium smartphones now shipping 12-16GB LPDDR5X.",
                  source: "Micron earnings, IDC",
                },
                {
                  cust: "PC OEMs / Client",
                  products: "DDR5, LPDDR5X, Client SSDs",
                  share: "Part of Mobile & Client BU",
                  trend: "AI PC refresh cycle driving DDR5 adoption. Windows 11 AI Copilot+ PCs need 16GB+ RAM.",
                  importance: "Dell, HP, Lenovo, ASUS. Enterprise refresh + AI PC cycle = tailwind.",
                  source: "Micron earnings, industry reports",
                },
                {
                  cust: "Automotive & Embedded",
                  products: "LPDDR5, DDR4/5, eMMC, UFS, NOR flash",
                  share: "AEBU: $1.43B Q4 FY2025",
                  trend: "Growing with ADAS, autonomous driving, EV adoption. Content per vehicle rising 2-3x.",
                  importance: "Tesla, BMW, Ford, GM, major Tier 1s. Long design cycles = sticky revenue.",
                  source: "Micron Embedded BU, 10-K",
                },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#3B82F6", whiteSpace: "nowrap" }}>{row.cust}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>{row.products}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F8FAFC", fontWeight: 600 }}>{row.share}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.trend}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11, maxWidth: 300 }}>{row.importance}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manufacturing Footprint */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Manufacturing Footprint</div>
        <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 16 }}>Global fab network spanning US, Japan, Singapore, Taiwan, and India. Over $150B in planned investments over the next decade. CHIPS Act: $6.165B awarded for Idaho and New York projects. India ATMP facility opened Feb 2026.</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>CHIPS Act Funding</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#10B981" }}>$6.165B</div>
            <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>Idaho + New York fabs</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>New York Investment</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F59E0B" }}>~$100B</div>
            <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>4-fab megafab complex, Clay NY</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Idaho Investment</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#3B82F6" }}>~$25B</div>
            <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>HVM fab, leading-edge DRAM</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Singapore Expansion</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#8B5CF6" }}>$24B</div>
            <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>NAND expansion, 700K sq ft</div>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
          <thead>
            <tr>
              {["Location", "Type", "Product", "Status", "Timeline", "Investment", "Notes"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { loc: "Boise, Idaho (HQ)", type: "R&D + Fab", product: "DRAM (leading-edge)", status: "Operational + Expanding", timeline: "Existing + new HVM fab 2027", inv: "$25B+", notes: "Global HQ. R&D center. New HVM fab accelerated with $1.2B redirected CHIPS Act funds." },
              { loc: "Clay, New York", type: "Megafab", product: "DRAM (leading-edge)", status: "Construction starting", timeline: "Mid-2026 groundbreaking", inv: "~$100B (4 fabs)", notes: "Each fab: 600K sq ft cleanroom. 2.4M sq ft total. CHIPS Act: ~$3.4B allocated. 20,000 jobs planned." },
              { loc: "Manassas, Virginia", type: "Fab", product: "DRAM (legacy/specialty)", status: "Operational", timeline: "Existing", inv: "—", notes: "Legacy DRAM production. Received preliminary CHIPS Act terms for legacy memory supply security." },
              { loc: "Hiroshima, Japan", type: "Fab", product: "DRAM (leading-edge)", status: "Operational", timeline: "Existing", inv: "—", notes: "Acquired via Elpida Memory (2012). Leading-edge DRAM node production. 1-beta and 1-gamma." },
              { loc: "Singapore", type: "Fab + Expansion", product: "NAND (3D)", status: "Operational + Expanding", timeline: "Expansion completing 2027", inv: "$24B expansion", notes: "Major NAND manufacturing hub. Adding 700K sq ft cleanroom. Announced Jan 2026." },
              { loc: "Taichung, Taiwan", type: "Fab", product: "DRAM", status: "Operational", timeline: "Existing", inv: "—", notes: "Acquired via Inotera Memories. DRAM production." },
              { loc: "Sanand, Gujarat, India", type: "ATMP", product: "Assembly, Test, Packaging", status: "Operational", timeline: "Opened Feb 28, 2026", inv: "$2.75B", notes: "India's first semiconductor ATMP facility. 500K+ sq ft cleanroom. First shipment to Dell. 5,000 direct jobs." },
              { loc: "Penang, Malaysia", type: "ATMP", product: "Assembly, Test, Packaging", status: "Operational", timeline: "Existing", inv: "—", notes: "Long-standing assembly and test operations." },
              { loc: "Xi'an, China", type: "ATMP", product: "NAND packaging", status: "Operational", timeline: "Existing", inv: "—", notes: "NAND flash packaging. Subject to geopolitical risk — China banned Micron products in critical infrastructure (May 2023)." },
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 600, color: "#F8FAFC", fontSize: 11 }}>{row.loc}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.type}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600, fontSize: 11 }}>{row.product}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                    background: row.status.includes("Operational") ? "rgba(16,185,129,0.12)" : row.status.includes("Construction") ? "rgba(245,158,11,0.12)" : "rgba(100,116,139,0.12)",
                    color: row.status.includes("Operational") ? "#10B981" : row.status.includes("Construction") ? "#F59E0B" : "#94A3B8",
                  }}>{row.status}</span>
                </td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>{row.timeline}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#F59E0B", fontWeight: 600, fontSize: 11 }}>{row.inv}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: Micron IR, CHIPS Act fact sheets (White House, Dept. of Commerce), Micron 10-K, DataCenterDynamics, Tom's Hardware, Computer Weekly, PM India.</div>
      </div>
    </>)}

    {/* ===== ORG CHART SUB-TAB ===== */}
    {tab ==="orgchart" && (<>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Micron Technology Corporate Structure</div>
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
          <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>Micron Technology, Inc.</div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Parent &middot; Delaware &middot; NASDAQ: MU &middot; CIK 0000723125</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 6 }}>Founded 1978 &middot; HQ: Boise, Idaho &middot; ~48,000 employees &middot; CEO: Sanjay Mehrotra</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(16,185,129,0.15)", color: "#10B981" }}>S&amp;P: BBB-</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(16,185,129,0.15)", color: "#10B981" }}>Moody's: Baa3 (Stable)</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(16,185,129,0.15)", color: "#10B981" }}>Investment Grade</span>
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
        <div style={{ width: "80%", height: 2, background: "#1E293B", position: "relative" }}>
          {[0, 33, 66, 100].map(p => (
            <div key={p} style={{ position: "absolute", left: `${p}%`, top: -4, width: 2, height: 10, background: "#1E293B", transform: "translateX(-1px)" }} />
          ))}
        </div>
      </div>

      {/* Segment Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { name: "Compute & Networking BU (CNBU)", tag: "DATA CENTER", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6", color: "#3B82F6", border: "1px solid #1E293B",
            revenue: "$4.5B (Q4 FY25)", share: "40% of Q4 rev", products: "HBM3E, HBM4, server DRAM (high-cap DIMMs), LPDDR5X for AI servers", customers: "NVIDIA, AMD, Intel, cloud hyperscalers (AWS, Azure, GCP)", growth: "Fastest growing. HBM + high-cap DIMMs + LP server DRAM = $10B in FY2025 (5x YoY)", notes: "Record $4.5B in Q4 FY2025. HBM alone exceeded $5B in Q2 FY2026." },
          { name: "Mobile Business Unit (MBU)", tag: "MOBILE", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B", border: "1px solid #1E293B",
            revenue: "$3.76B (Q4 FY25)", share: "33% of Q4 rev", products: "LPDDR5X DRAM, NAND (UFS, eMMC) for smartphones and tablets", customers: "Apple, Samsung, Xiaomi, Oppo, Vivo, Google", growth: "Recovering from inventory correction. AI-on-device driving higher content per phone (12-16GB DRAM).", notes: "Apple is largest single customer. iPhone memory content rising with on-device AI." },
          { name: "Embedded Business Unit (EBU)", tag: "AUTO / INDUSTRIAL", tagBg: "rgba(16,185,129,0.12)", tagColor: "#10B981", color: "#10B981", border: "1px solid #1E293B",
            revenue: "$1.43B (Q4 FY25)", share: "13% of Q4 rev", products: "LPDDR5/4X, DDR4/5, eMMC, UFS, NOR flash for automotive and industrial", customers: "Tesla, BMW, Ford, Bosch, Continental, Siemens", growth: "Steady growth. Automotive content per vehicle rising 2-3x with ADAS and EV adoption.", notes: "Long design cycles create sticky revenue streams. Industrial IoT expanding." },
          { name: "Storage Business Unit (SBU)", tag: "NAND / SSD", tagBg: "rgba(139,92,246,0.12)", tagColor: "#A78BFA", color: "#A78BFA", border: "1px solid #1E293B",
            revenue: "Part of $8.5B NAND (FY25)", share: "~23% of FY25 rev (NAND total)", products: "Data center SSDs, client SSDs, enterprise storage solutions", customers: "Cloud hyperscalers, enterprise data centers, PC OEMs", growth: "NAND revenue $8.5B in FY2025 (+18% YoY). Data center SSDs growing fastest. Client SSDs cyclical.", notes: "Crucial consumer brand discontinued Feb 2026 — exiting consumer market to focus on enterprise." },
        ].map((e, i) => (
          <div key={i} style={{ background: "#111827", border: e.border, borderRadius: 8, padding: "12px 12px 10px", position: "relative", minWidth: 0 }}>
            <div style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: e.tagBg, color: e.tagColor, fontWeight: 600, display: "inline-block", marginBottom: 6 }}>{e.tag}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC", marginBottom: 2, lineHeight: 1.2 }}>{e.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 8, marginTop: 8 }}>
              <div style={{ background: "#0B0F19", borderRadius: 5, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Revenue</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: e.color }}>{e.revenue}</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>{e.share}</div>
              </div>
              <div style={{ background: "#0B0F19", borderRadius: 5, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Products</div>
                <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.4, marginTop: 2 }}>{e.products}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.7 }}>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Customers:</span> {e.customers}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Growth:</span> {e.growth}</div>
              <div style={{ marginTop: 4, color: "#94A3B8", fontStyle: "italic" }}>{e.notes}</div>
            </div>
          </div>
        ))}
      </div>

      {/* === KEY SUBSIDIARIES === */}
      <div style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, marginTop: 4 }}>Key Subsidiaries &amp; Global Entities</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { name: "Micron Semiconductor Products", sub: "US (Idaho) — DRAM wafer manufacturing", tag: "FAB", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6" },
          { name: "Micron Japan, Ltd.", sub: "Hiroshima — leading-edge DRAM fab (ex-Elpida)", tag: "FAB", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6" },
          { name: "Micron Semiconductor Asia Pte. Ltd.", sub: "Singapore — NAND flash manufacturing", tag: "FAB", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6" },
          { name: "Micron Memory Taiwan Co., Ltd.", sub: "Taichung — DRAM manufacturing (ex-Inotera)", tag: "FAB", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6" },
          { name: "Micron Semiconductor (India) Pvt. Ltd.", sub: "Sanand, Gujarat — ATMP facility, opened Feb 2026", tag: "ATMP", tagBg: "rgba(16,185,129,0.12)", tagColor: "#10B981" },
          { name: "Micron Semiconductor (Malaysia)", sub: "Penang — assembly, test, packaging", tag: "ATMP", tagBg: "rgba(16,185,129,0.12)", tagColor: "#10B981" },
          { name: "Micron Semiconductor (Xiamen) Co.", sub: "Xi'an, China — NAND packaging (geopolitical risk)", tag: "ATMP", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B" },
          { name: "Crucial Technology (winding down)", sub: "Consumer brand discontinued Feb 2026", tag: "BRAND", tagBg: "rgba(139,92,246,0.12)", tagColor: "#A78BFA" },
        ].map((e, i) => (
          <div key={i} style={{ background: "#111827", border: "1px solid #1E293B", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: e.tagBg, color: e.tagColor, fontWeight: 600, display: "inline-block", marginBottom: 6 }}>{e.tag}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC", marginBottom: 2 }}>{e.name}</div>
            <div style={{ fontSize: 10, color: "#64748B", lineHeight: 1.4 }}>{e.sub}</div>
          </div>
        ))}
      </div>

      {/* === DEBT STRUCTURE === */}
      <div style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, marginTop: 4 }}>Debt Structure</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { name: "4.975% Senior Notes", tag: "SENIOR UNSECURED", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B",
            outstanding: "$500M", rate: "4.975%", maturity: "2026",
            notes: "Near-term maturity. Part of tender offer program." },
          { name: "4.185% Senior Notes", tag: "SENIOR UNSECURED", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B",
            outstanding: "~$1B", rate: "4.185%", maturity: "Feb 2027",
            notes: "Investment-grade rated. Standard corporate bond." },
          { name: "5.375% Senior Notes", tag: "SENIOR UNSECURED", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B",
            outstanding: "~$1B", rate: "5.375%", maturity: "Apr 2028",
            notes: "Standard senior unsecured." },
          { name: "5.300% Senior Notes", tag: "SENIOR UNSECURED", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B",
            outstanding: "$1.0B", rate: "5.300%", maturity: "2031",
            notes: "Subject to Mar 2026 tender offer." },
          { name: "5.650% Senior Notes", tag: "SENIOR UNSECURED", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B",
            outstanding: "$500M", rate: "5.650%", maturity: "2032",
            notes: "Subject to Mar 2026 tender offer." },
          { name: "5.875% / 6.050% Notes (2033-2035)", tag: "SENIOR UNSECURED", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B",
            outstanding: "~$3.9B total", rate: "5.875-6.050%", maturity: "2033-2035",
            notes: "Multiple series. Part of $5.4B in 2031-2035 notes subject to tender offers (Mar 2026)." },
          { name: "$3.5B Revolving Credit Facility", tag: "REVOLVER", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6", color: "#3B82F6",
            outstanding: "$0 drawn", rate: "Variable", maturity: "Mar 2030",
            notes: "Entered Mar 2025. Replaced prior $2.5B facility. $250M LC sublimit. Fully undrawn as of Nov 2025." },
          { name: "Total Debt (Q1 FY2026)", tag: "SUMMARY", tagBg: "rgba(139,92,246,0.12)", tagColor: "#A78BFA", color: "#A78BFA",
            outstanding: "$11.8B", rate: "Blended", maturity: "Various",
            notes: "Down from $14.5B — reduced $2.7B in Q1 FY2026 (paid $1B term loans + redeemed $1.7B notes). Net cash position >$250M. $15.5B total liquidity." },
          { name: "Cash & Investments", tag: "LIQUIDITY", tagBg: "rgba(16,185,129,0.12)", tagColor: "#10B981", color: "#10B981",
            outstanding: "$12.0B", rate: "—", maturity: "—",
            notes: "As of Q1 FY2026 (Nov 2025). $15.5B total liquidity including undrawn revolver." },
        ].map((e, i) => (
          <div key={i} style={{ background: "#111827", border: "1px solid #1E293B", borderRadius: 8, padding: "12px 12px 10px" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: e.tagBg, color: e.tagColor, fontWeight: 600 }}>{e.tag}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC", marginBottom: 8 }}>{e.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 8 }}>
              <div style={{ background: "#0B0F19", borderRadius: 5, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Outstanding</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: e.color }}>{e.outstanding}</div>
              </div>
              <div style={{ background: "#0B0F19", borderRadius: 5, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Coupon / Rate</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: e.color }}>{e.rate}</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>Mat: {e.maturity}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#94A3B8", lineHeight: 1.5 }}>{e.notes}</div>
          </div>
        ))}
      </div>

      {/* === LEADERSHIP === */}
      <div style={s.card}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Executive Leadership</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { name: "Sanjay Mehrotra", title: "Chairman, President & CEO", detail: "CEO since 2017. Co-founded SanDisk (1988), led through $19B WD acquisition (2016). 40+ years in semiconductor industry. Driving AI/HBM pivot." },
            { name: "Mark Murphy", title: "Executive Vice President & CFO", detail: "CFO since 2022. Previously CFO at Qorvo. Overseeing aggressive capex expansion while maintaining investment-grade balance sheet." },
            { name: "Sumit Sadana", title: "EVP & Chief Business Officer", detail: "CBO since 2017. Oversees business strategy, marketing, sales operations. Previously at Broadcom and Qualcomm." },
            { name: "Scott DeBoer", title: "EVP, Technology & Products", detail: "Leads technology development, process engineering, and product development. Key architect of HBM and leading-edge DRAM node transitions." },
          ].map((exec, i) => (
            <div key={i} style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC", marginBottom: 2 }}>{exec.name}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#3B82F6", marginBottom: 6 }}>{exec.title}</div>
              <div style={{ fontSize: 10, color: "#94A3B8", lineHeight: 1.6 }}>{exec.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Sources: Micron 10-K (FY2025), 10-Q (Q1 FY2026), SEC filings (EX-21.1 subsidiary list), Micron IR, 8-K filings, Bloomberg, Micron leadership page. 113 subsidiaries across 18 countries per CompanyData.</div>
    </>)}

    {/* ===== CONTRACTS SUB-TAB ===== */}
    {tab ==="contracts" && (<>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Supply Chain &amp; Customer Deep Dive</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>Micron is the #3 global memory semiconductor company. DRAM: ~25% market share (behind Samsung ~40%, SK Hynix ~35%). NAND: ~13% share. HBM: ~21% share (behind SK Hynix 62%, ahead of Samsung 17%). Revenue mix: 77% DRAM, 23% NAND in FY2025.</div>

      {/* Revenue Breakdown */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Revenue Breakdown</div>
        <div style={{ display: "flex", gap: 16 }}>

        {/* By Product */}
        <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #10B981" }}>By Product (FY2025)</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 11 }}>
            <thead>
              <tr>
                {["Product", "Revenue", "% of Total", "YoY Growth", "Trend"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { product: "DRAM", rev: "$28.58B", pct: "77%", growth: "+62% YoY", trend: "AI/HBM supercycle. Server DRAM + HBM driving record demand." },
                { product: "NAND", rev: "$8.50B", pct: "23%", growth: "+18% YoY", trend: "Recovery from downturn. Data center SSDs strongest segment." },
                { product: "HBM (subset of DRAM)", rev: "$5B+ (Q2 FY26 alone)", pct: "Growing rapidly", growth: ">5x FY24→FY25", trend: "HBM TAM: $38B (2025) → $58B (2026). Micron ~21% share." },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.product}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600 }}>{row.rev}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.pct}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#10B981", fontWeight: 600 }}>{row.growth}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        {/* By End Market */}
        <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #F59E0B" }}>By End Market (FY2025 / Q4 FY2025)</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 11 }}>
            <thead>
              <tr>
                {["Segment", "Q4 FY25 Rev", "% of Q4 Rev", "Key Drivers"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { seg: "Cloud / Data Center (CNBU)", rev: "$4.50B", pct: "40%", drivers: "HBM3E, high-cap DIMMs, LP server DRAM, DC SSDs. AI capex supercycle. Record revenue." },
                { seg: "Mobile (MBU)", rev: "$3.76B", pct: "33%", drivers: "LPDDR5X for smartphones. Apple iPhone, Samsung Galaxy. AI-on-device content growth." },
                { seg: "Auto & Embedded (EBU)", rev: "$1.43B", pct: "13%", drivers: "ADAS, autonomous driving, EV. Memory content per vehicle rising 2-3x. Long design cycles." },
                { seg: "Client / Storage (SBU)", rev: "~$1.6B", pct: "~14%", drivers: "DDR5 for AI PCs, client SSDs. Windows 11 refresh, Copilot+ PCs driving 16GB+ adoption." },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.seg}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600 }}>{row.rev}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.pct}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.drivers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>Sources: Micron Q4 FY2025 earnings, 10-K, earnings call prepared remarks, Futurum Group analysis.</div>
      </div>

      {/* HBM Competitive Landscape */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>HBM Competitive Landscape</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                {["Company", "HBM Market Share (Q2 2025)", "DRAM Market Share", "HBM3E Status", "HBM4 Status", "Key Advantage"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { co: "SK Hynix", hbmShare: "62%", dramShare: "~35%", hbm3e: "Volume production since mid-2024. First to market.", hbm4: "Mass production ramping 2026. UBS est. ~70% HBM4 share for NVIDIA Rubin.", advantage: "First-mover in HBM. Deepest NVIDIA relationship. Dominant share." },
                { co: "Micron", hbmShare: "21%", dramShare: "~25%", hbm3e: "Qualified for NVIDIA H200, B200, GB200. 12-hi stacks shipping.", hbm4: "Mass production ramping 2026, aligned with NVIDIA Rubin launch.", advantage: "Technology parity on HBM3E. Best power efficiency claims. US CHIPS Act support." },
                { co: "Samsung", hbmShare: "17%", dramShare: "~40%", hbm3e: "Qualification delays. Now qualified by major customers. Recovering.", hbm4: "Targeting H1 2026 completion. Full-scale supply in 2026.", advantage: "Largest DRAM capacity. Can leverage scale once qualified. Targeting 30%+ HBM share by 2026." },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: row.co === "Micron" ? "#3B82F6" : row.co === "SK Hynix" ? "#10B981" : "#F59E0B" }}>{row.co}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#F8FAFC", fontWeight: 700, fontSize: 14 }}>{row.hbmShare}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.dramShare}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.hbm3e}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.hbm4}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 11, maxWidth: 250 }}>{row.advantage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          {[
            { label: "HBM TAM 2025", value: "$38B", color: "#3B82F6" },
            { label: "HBM TAM 2026", value: "$58B", color: "#10B981" },
            { label: "Growth", value: "+53% YoY", color: "#F59E0B" },
            { label: "HBM3E Share 2026", value: "~67% of HBM", color: "#8B5CF6" },
            { label: "HBM4 Share 2026", value: "~33% of HBM", color: "#A78BFA" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "10px 14px", flex: "1 1 120px", minWidth: 120 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>Sources: TrendForce, Astute Group, SK Hynix Newsroom, Goldman Sachs estimates, UBS estimates, Micron earnings calls.</div>
      </div>

      {/* Supplier Relationships */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Key Supplier Relationships</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 800 }}>
            <thead>
              <tr>
                {["Supplier", "Products / Services", "Criticality", "Concentration Risk", "Notes"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { supplier: "ASML", products: "EUV lithography systems (NXE:3600, NXE:3800)", criticality: "Critical", risk: "Sole source for EUV", notes: "No alternative supplier. Lead times 12-18 months. Essential for 1-beta, 1-gamma DRAM nodes. Export controls limit China access — benefits Micron." },
                { supplier: "Applied Materials", products: "CVD, PVD, etch, CMP, inspection equipment", criticality: "High", risk: "Dominant but alternatives exist", notes: "Largest semiconductor equipment supplier. Critical for both DRAM and NAND process steps." },
                { supplier: "Lam Research", products: "Etch, deposition (especially for 3D NAND)", criticality: "High", risk: "Key for NAND stacking", notes: "Essential for 200+ layer NAND. Also important for DRAM advanced patterning." },
                { supplier: "Tokyo Electron (TEL)", products: "Coater/developer, etch, deposition", criticality: "High", risk: "Japan-centric supply", notes: "Critical for Micron's Hiroshima fab. Japan government subsidies support domestic supply chain." },
                { supplier: "Silicon Wafer Suppliers", products: "300mm silicon wafers (Shin-Etsu, SUMCO, Siltronic)", criticality: "High", risk: "Oligopoly — 5 suppliers control >90%", notes: "Long-term supply agreements. Wafer prices relatively stable in memory supercycle." },
                { supplier: "Specialty Chemical Suppliers", products: "Photoresists (JSR, TOK), CMP slurries, etch gases", criticality: "Medium-High", risk: "Japan-concentrated", notes: "JSR was acquired by JSR Corp (now part of Eneos). Japan export controls could impact supply." },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#8B5CF6", whiteSpace: "nowrap" }}>{row.supplier}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>{row.products}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                      background: row.criticality === "Critical" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                      color: row.criticality === "Critical" ? "#EF4444" : "#F59E0B",
                    }}>{row.criticality}</span>
                  </td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F59E0B", fontSize: 11 }}>{row.risk}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11, maxWidth: 300 }}>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Factors */}
      <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>Key Supply Chain &amp; Customer Risk Factors</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        {[
          { title: "Memory Cyclicality", desc: "Memory is highly cyclical. DRAM and NAND prices can swing 30-50% in a cycle. Current AI supercycle is unprecedented but not immune to correction. FY2023 saw $5.8B net loss during downturn.", color: "#EF4444" },
          { title: "China Geopolitical Risk", desc: "China's CAC banned Micron products in critical infrastructure (May 2023). Xi'an ATMP facility at risk. China represented ~10% of revenue historically. US-China export controls create ongoing uncertainty.", color: "#EF4444" },
          { title: "HBM Execution Risk", desc: "SK Hynix has 62% HBM share vs Micron's 21%. Samsung recovering to 30%+. Micron must maintain technology parity and secure NVIDIA/AMD qualification for each new generation (HBM4, HBM4E).", color: "#F59E0B" },
          { title: "CHIPS Act Execution", desc: "$6.165B in federal funding tied to construction milestones. Delays in New York megafab (construction start pushed to mid-2026). $1.2B reallocated from NY to Idaho. Political risk if future administrations change priorities.", color: "#F59E0B" },
          { title: "Customer Concentration", desc: "Apple is largest single customer (~10-15% of revenue). NVIDIA HBM purchases growing rapidly. Cloud hyperscaler capex could slow if AI monetization disappoints. Diversification across segments mitigates.", color: "#F59E0B" },
          { title: "Capex Intensity", desc: "Memory manufacturing requires massive capex ($8-12B+ annually). FY2025 capex ~$14B. CHIPS Act and government subsidies help but Micron must balance growth investment with shareholder returns.", color: "#3B82F6" },
        ].map((item, i) => (
          <div key={i} style={{ flex: "1 1 280px", minWidth: 280, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: "1.6" }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: "#64748B", marginTop: 14, fontStyle: "italic" }}>Sources: Micron 10-K (risk factors), TrendForce, CHIPS Act fact sheets, Reuters (China ban), industry reports.</div>
    </>)}

    {/* ===== SENTIMENT SUB-TAB ===== */}
    {tab ==="sentiment" && (<>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Market Sentiment</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>~29 analysts. Consensus: Strong Buy. Avg PT ~$465-493. Stock ~$419. FY2026 tracking to massive earnings acceleration. Forward P/E ~7x on est. FY2026 EPS of ~$56-57. Q2 FY2026 was a blowout: $23.9B revenue, $12.20 EPS, 74.4% gross margin.</div>

      {/* Consensus Snapshot */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Consensus Rating", value: "Strong Buy", sub: "~29 analysts covering", color: "#10B981" },
          { label: "Avg Price Target", value: "~$465-493", sub: "Range: $249 – $700", color: "#3B82F6" },
          { label: "Current Price", value: "~$419", sub: "ATH ~$471 (post Q2 FY26 earnings). Mkt cap ~$474B", color: "#F8FAFC" },
          { label: "Credit Ratings", value: "BBB- / Baa3", sub: "Investment Grade. Both stable outlook.", color: "#10B981" },
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
            { phase: "Post-Q2 FY2026 (Mar-Apr 2026)", sentiment: "Euphoric", color: "#10B981", desc: "Stock surged to ATH ~$471 after Q2 FY2026 blowout. Revenue $23.9B (+196% YoY). EPS $12.20 vs $8.79 est. Gross margin 74.4%. Q3 guided $33.5B (+/-$750M) with 81% gross margin. Cantor Fitzgerald set street-high $700 PT. Forward P/E compressed to ~7x on FY2026E EPS of ~$57. HBM revenue >$5B in the quarter alone." },
            { phase: "Q1 FY2026 (Dec 2025)", sentiment: "Cautious Optimism", color: "#F59E0B", desc: "Q1 revenue $8.71B (+84% YoY) beat estimates. EPS $1.79 vs $1.44 est. However, Q2 guidance of $18.7B was below some bulls' expectations initially. Stock pulled back from ~$150 to ~$100 range. Concerns about NAND weakness and consumer market exit (Crucial brand discontinued). $2.7B in debt paid down." },
            { phase: "Q4 FY2025 (Sep 2025)", sentiment: "Strong Bullish", color: "#10B981", desc: "Revenue $11.3B (+46% YoY). Gross margin 45.7%. EPS $3.03 (+157% YoY). All above guidance. Data center hit record 56% of revenue. Full-year FY2025: $37.4B revenue (+49% YoY). HBM + high-cap DIMMs + LP server DRAM = $10B (5x YoY). Strong FY2026 outlook." },
            { phase: "Mid-FY2025 (Q2-Q3 2025)", sentiment: "Accelerating", color: "#3B82F6", desc: "Revenue inflecting higher each quarter. DRAM prices rising on AI demand. HBM3E qualifications secured for NVIDIA H200, B200. Multiple analyst upgrades. Memory supercycle narrative gaining traction. Stock rose from ~$80 to ~$130 range." },
            { phase: "Early FY2025 (Q1 2025, Dec 2024)", sentiment: "Recovery", color: "#F59E0B", desc: "Emerging from FY2024 downturn. DRAM demand recovering. First HBM3E revenue. China ban impact contained. CHIPS Act $6.165B finalized (Dec 2024). Industry-wide inventory normalization completing." },
            { phase: "FY2024 Trough", sentiment: "Bearish", color: "#EF4444", desc: "FY2024 revenue $25.1B (down from $30.8B FY2022 peak before downturn). Memory industry downcycle. DRAM and NAND prices collapsed. China banned Micron in critical infrastructure (May 2023). Stock recovered from ~$50 lows as AI narrative emerged." },
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
                { firm: "Cantor Fitzgerald", rating: "Overweight", pt: "$700", action: "Street high (Mar 19, 2026)", thesis: "HBM supercycle is generational. Micron earnings power dramatically underestimated. FY2026 EPS could exceed $60." },
                { firm: "UBS", rating: "Buy", pt: "$550", action: "Raised (Apr 8, 2026)", thesis: "HBM4 ramp positions Micron for sustained earnings growth. DRAM pricing power in AI cycle." },
                { firm: "Citigroup", rating: "Buy", pt: "$520", action: "Raised (Mar 31, 2026)", thesis: "Q2 blowout confirms supercycle thesis. Data center demand is structural, not cyclical." },
                { firm: "JP Morgan", rating: "Overweight", pt: "$500", action: "Raised (Mar 19, 2026)", thesis: "HBM + data center DRAM driving multi-year earnings expansion. Margin expansion has further room." },
                { firm: "Goldman Sachs", rating: "Buy", pt: "$480", action: "Raised post-Q2 FY26", thesis: "Memory supercycle supported by AI capex. Micron well-positioned in HBM behind SK Hynix." },
                { firm: "Morgan Stanley", rating: "Overweight", pt: "$470", action: "Raised post-Q2 FY26", thesis: "HBM and server DRAM driving unprecedented margin expansion. Balance sheet improving rapidly." },
                { firm: "Barclays", rating: "Overweight", pt: "$460", action: "Raised post-Q2 FY26", thesis: "AI memory demand exceeds supply growth. Micron capturing share in high-value segments." },
                { firm: "Deutsche Bank", rating: "Buy", pt: "$440", action: "Raised post-Q2 FY26", thesis: "Best risk/reward in semis. Forward P/E of ~7x too cheap for earnings trajectory." },
                { firm: "Wells Fargo", rating: "Overweight", pt: "$430", action: "Raised post-Q2 FY26", thesis: "HBM TAM growing faster than expected. Micron's technology closing gap with SK Hynix." },
                { firm: "Itau BBA", rating: "Market Perform", pt: "$249", action: "Street low (Oct 2025)", thesis: "Memory cyclicality risk. HBM share gains uncertain vs SK Hynix. Valuation stretched." },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.firm}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                      background: row.rating.includes("Buy") || row.rating.includes("Overweight") ? "rgba(16,185,129,0.12)" : row.rating.includes("Sell") || row.rating.includes("Underperform") ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                      color: row.rating.includes("Buy") || row.rating.includes("Overweight") ? "#10B981" : row.rating.includes("Sell") || row.rating.includes("Underperform") ? "#EF4444" : "#F59E0B",
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

      {/* Financial Performance */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Financial Performance Trajectory</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                {["Period", "Revenue", "Gross Margin", "EPS (Diluted)", "Net Income", "Key Highlight"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { period: "FY2023", rev: "$15.5B", gm: "Negative", eps: "-$5.34", ni: "-$5.8B", highlight: "Memory downcycle trough. DRAM/NAND prices collapsed. China ban." },
                { period: "FY2024", rev: "$25.1B", gm: "22%", eps: "$1.30", ni: "$1.5B", highlight: "Recovery year. HBM revenue began. AI demand emerging." },
                { period: "FY2025", rev: "$37.4B", gm: "~38% (avg)", eps: "$7.59", ni: "$8.5B", highlight: "+49% YoY. Data center = 56% of rev. HBM + server DRAM = $10B (5x YoY)." },
                { period: "Q1 FY2026", rev: "$8.71B", gm: "~39%", eps: "$1.79", ni: "~$2.0B", highlight: "+84% YoY. Beat ests. $2.7B debt paid down." },
                { period: "Q2 FY2026", rev: "$23.9B", gm: "74.4%", eps: "$12.20", ni: "$13.8B", highlight: "+196% YoY, +75% QoQ. Record everything. HBM >$5B. ATH $471." },
                { period: "Q3 FY2026 (Guide)", rev: "$33.5B", gm: "~81%", eps: "~$18-20 est.", ni: "—", highlight: "Guided Mar 2026. Would be another record. AI/HBM driving explosive margin expansion." },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC" }}>{row.period}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600 }}>{row.rev}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: row.gm.includes("Negative") ? "#EF4444" : "#10B981", fontWeight: 600 }}>{row.gm}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: row.eps.startsWith("-") ? "#EF4444" : "#10B981", fontWeight: 700 }}>{row.eps}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.ni}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11, maxWidth: 300 }}>{row.highlight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>Sources: Micron IR, 10-K, 10-Q, earnings call transcripts, Yahoo Finance, StockAnalysis, MarketBeat.</div>
      </div>

      {/* Market Positioning */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Market Positioning &amp; Key Metrics</div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          {[
            { label: "Market Cap", value: "~$474B", sub: "Top 15 US by market cap" },
            { label: "Forward P/E", value: "~6.6x", sub: "On FY2026E EPS ~$57" },
            { label: "TTM P/E", value: "~18x", sub: "Rapidly compressing" },
            { label: "52-Week Range", value: "$80 – $471", sub: "ATH post-Q2 FY26" },
            { label: "Shares Outstanding", value: "~1.13B", sub: "Diluted" },
            { label: "Dividend Yield", value: "~0.1%", sub: "$0.115/qtr ($0.46/yr)" },
          ].map((m, i) => (
            <div key={i} style={{ flex: "1 1 140px", minWidth: 140, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>{m.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Bull vs Bear Case</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 6 }}>Bull Case</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              AI/HBM supercycle is generational, not cyclical. HBM TAM growing from $38B to $58B+ in one year. Micron's gross margins expanding from 38% to 81% in two quarters. Forward P/E of ~7x is absurdly cheap for this earnings trajectory. CHIPS Act subsidies de-risk US expansion. Balance sheet rapidly deleveraging — could be net cash positive by end of FY2026. HBM4 ramp provides multi-year earnings visibility.
            </div>
          </div>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#EF4444", marginBottom: 6 }}>Bear Case</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              Memory is cyclical — every supercycle ends. Current margins (74-81%) are historically unprecedented and mean-revert. AI capex could slow if hyperscaler monetization disappoints. SK Hynix has 62% HBM share vs Micron's 21% — Micron is #3. Samsung recovering aggressively. China geopolitical risk unresolved. $100B+ in planned capex creates execution and financing risk. HBM could become commoditized as Samsung catches up.
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginTop: 12 }}>Sources: Yahoo Finance, StockAnalysis, MarketBeat, Benzinga, Capital.com, Public.com, Cantor Fitzgerald, UBS, Citigroup, JP Morgan research notes.</div>
      </div>
    </>)}

    </>)}
    </ReviewShell>
  );
}
