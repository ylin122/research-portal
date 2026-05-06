import { ReviewShell, reviewStyles as s } from "./GenericReview";

export default function CoreweaveReview({ companyId, companyName, curFields, updateField, editingField, setEditingField }) {
  return (
    <ReviewShell ticker="CRWV" companyId={companyId} companyName={companyName}
      curFields={curFields} updateField={updateField}
      editingField={editingField} setEditingField={setEditingField}>
      {(tab) => (<>

      {/* ===== OVERVIEW TAB ===== */}
      {tab ==="overview" && (<>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>CoreWeave (CRWV)</div>
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
            { date: "Mar 31", event: "$8.5B Meta-backed DDTL 4.0 closed", type: "Financing", detail: "First-ever IG-rated GPU-backed deal. A3 (Moody's) / A-low (DBRS). SOFR+225 / ~5.9% fixed. Maturity Mar 2032. Anchored by Blackstone. CRWV +8%." },
            { date: "Apr 9", event: "$21B Meta expansion signed", type: "Contract", detail: "Expanded AI infrastructure agreement through 2032. Total Meta commitment now ~$35B. Stock surged on announcement. Underpins additional financing capacity." },
            { date: "Apr 9-10", event: "$4.7B new debt offering", type: "Financing", detail: "$3B convertible senior notes due 2032 (+ $450M greenshoe). $1.25B senior unsecured notes due 2031. Total debt now exceeds $21B." },
            { date: "Apr 10", event: "Anthropic multi-year deal", type: "Contract", detail: "Multi-year agreement to power Claude AI models at production scale. Financial terms undisclosed. Phased rollout using NVIDIA architectures incl. Vera Rubin starting late 2026. CRWV +11%." },
            { date: "May 20", event: "Q1 2026 earnings", type: "Earnings", detail: "Guided $1.9-2.0B rev. First report with Meta infra ramp. Key test post-Q4 miss. Adj. operating income $0-40M (margin trough)." },
            { date: "Mid-2026", event: "Ellendale ND Phase 2 (150 MW)", type: "Capacity", detail: "Applied Digital Polaris campus, Building 2. Proves execution on phased delivery. (Source: Applied Digital IR, Aug 2025)" },
            { date: "H2 2026", event: "Vera Rubin (R100) first deployments", type: "GPU", detail: "CoreWeave among first cloud providers. HGX B300 now generally available. Vera Rubin NVL72 and Vera CPU rack expected H2 2026." },
            { date: "Aug 2026", event: "Q2 2026 earnings", type: "Earnings", detail: "Revenue trajectory confirmation. Market watching for delivery execution and Meta revenue ramp. Full-year guide: $12-13B rev." },
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
            { date: "Q4 2026", event: "H100/H200 fleet rebooking window", type: "Contract", detail: "~250K H100/H200 GPUs need to be rebooked as Microsoft's 2023 contract is rolling off. Demand will be driven by AI inference workloads and H100/H200 spot pricing at a large discount for take-or-pay contracts." },
            { date: "Q1 2027", event: "Poolside Project Horizon Phase 1 (250 MW)", type: "Capacity", detail: "CoreWeave anchor tenant at 2GW AI campus in West Texas. 40K+ GB300 GPUs. ~$5B backlog (Evercore est). Poolside raised ~$2B Series C at $12B val. NVIDIA invested up to $1B." },
            { date: "2026-27", event: "Runway AI compute ramp", type: "Contract", detail: "CoreWeave powering Runway's next-gen world models on GB300 NVL72 (deal announced Dec 2025). Runway raised $315M Series E at $5.3B (Feb 2026). ~$265M revenue projected 2026." },
            { date: "YE 2026", event: "1.7 GW capacity target", type: "Capacity", detail: "Must double from 850 MW. Underpins entire $12-13B revenue guidance. Per CFO on Q4 2025 call. (Source: CoreWeave Q4 2025 earnings)" },
            { date: "2027", event: "Ellendale ND Phase 3 (150 MW)", type: "Capacity", detail: "Applied Digital Polaris campus, Building 3. 'Anticipated at full capacity in 2027.' No specific quarter. (Source: Applied Digital IR, Aug 2025)" },
            { date: "Early 2027", event: "Kenilworth NEST (250 MW)", type: "Capacity", detail: "Largest owned campus. $1.8B build. $250M NJ tax credit. Construction started Sep 2025. (Source: Real Estate NJ, CoreWeave IR)" },
            { date: "H1 2027", event: "Regina, Saskatchewan (140 MW)", type: "Capacity", detail: "Bell Canada 300 MW campus. CoreWeave 140 MW, Cerebras 160 MW. Construction spring 2026. CoreWeave's share timing within phased rollout not confirmed. (Source: BCE Newsroom, DCD)" },
            { date: "Summer 2027", event: "Lancaster, PA Phase 1 (100 MW)", type: "Capacity", detail: "Five 20 MW halls. First phase of $6B campus ($11B total). Co-developed with Chirisa / Machine Investment Group. (Source: CoreWeave IR, DCD)" },
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
            { label: "GPU", color: "#F59E0B" },
          ].map((l, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748B" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: CoreWeave IR, Applied Digital IR, Core Scientific IR, NVIDIA product roadmap, SEC filings (DDTL amendments), DataCenterDynamics, BCE Newsroom, Real Estate NJ.</div>
      </div>

      {/* Supply Chain & Ecosystem Map — OpenAI style layers */}
      <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>CoreWeave Supply Chain &amp; Ecosystem Map</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {[
          { label: "Customers", items: [
            { name: "Microsoft / OpenAI", sub: "OpenAI $22.4B multi-year GPU lease (thru 2029). Microsoft ~$10B (thru ~2030).", color: "#F59E0B" },
            { name: "Meta", sub: "~$35B total ($14.2B + $21B expansion Apr 2026) — largest customer by backlog", color: "#F59E0B" },
            { name: "Anthropic", sub: "Multi-year deal (Apr 2026) — powering Claude AI at production scale. Vera Rubin deployment.", color: "#F59E0B" },
            { name: "Poolside", sub: "$12B val · 40K+ GB300 GPUs · Anchor tenant, 2GW Project Horizon TX", color: "#F59E0B" },
            { name: "Perplexity", sub: "$20B val · Multi-year inference deal (Mar 2026) · GB200 NVL72", color: "#F59E0B" },
            { name: "Runway", sub: "$5.3B val · Next-gen world models on GB300 NVL72 (Dec 2025)", color: "#F59E0B" },
            { name: "AI Startups", sub: "Midjourney, Cursor, Cognition, Cline, Zonos + long tail", color: "#F59E0B" },
            { name: "Enterprise", sub: "Inference workloads, fine-tuning, on-demand compute", color: "#F59E0B" },
          ]},
          { label: "CoreWeave Platform", items: [
            { name: "CoreWeave", sub: "#1 Neocloud · 43 DCs · 850 MW active · 3.1 GW contracted", color: "#3B82F6" },
          ]},
          { label: "GPU Supply", items: [
            { name: "NVIDIA", sub: "Sole GPU supplier — H100, H200, GB200 NVL72, GB300 NVL72 · $2B equity investment (Jan 2026) + financing", color: "#10B981" },
          ]},
          { label: "Power & Shell", items: [
            { name: "Core Scientific", sub: "Denton TX, Muskogee OK — ~590 MW (12-yr leases). Largest single DC partner.", color: "#10B981" },
            { name: "Applied Digital", sub: "Ellendale ND — 400 MW Polaris Forge (15-yr leases). $16B aggregate.", color: "#10B981" },
            { name: "Galaxy Digital", sub: "Dickens County TX — 800 MW Helios campus (15-yr lease). $1.4B project finance.", color: "#10B981" },
            { name: "Chirisa / Blue Owl", sub: "Chester VA (28+120 MW) + Lancaster PA (100-300 MW). $6B Phase 1.", color: "#10B981" },
            { name: "Global Switch / Digital Realty", sub: "London + Crawley UK — H200 GPUs. Part of £1B UK investment.", color: "#F59E0B" },
            { name: "Bell Canada", sub: "Regina, Saskatchewan — 140 MW (of 300 MW campus). C$1.7B. Mar 2026.", color: "#10B981" },
          ]},
          { label: "Competitors", items: [
            { name: "Lambda", sub: "~30K GPUs · Developer-focused, on-demand GPU cloud", color: "#EF4444" },
            { name: "Crusoe", sub: "~20K GPUs · Clean energy (stranded gas), enterprise AI", color: "#EF4444" },
            { name: "Nebius (ex-Yandex)", sub: "~20K GPUs · Meta $27B deal, EU/MENA expansion, NVIDIA $2B stake", color: "#EF4444" },
            { name: "Voltage Park", sub: "~10K GPUs · A100 fleet, low-cost on-demand", color: "#EF4444" },
            { name: "Hyperscalers (AWS/Azure/GCP)", sub: "Expanding GPU capacity — but neoclouds offer dedicated, flexible capacity", color: "#94A3B8" },
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
      <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Flow: GPU Supply → CoreWeave (procurement, rack, deploy) → Customers (AI labs, enterprise). Power & Shell enables physical buildout. Financing enables capex scale.</div>

      {/* Major Contracts */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Major Contracts</div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>Customer concentration: Microsoft = 67% of FY2025 revenue. Backlog diversifying rapidly — Meta now largest at ~$35B. Total backlog: ~$87B+ (post-Meta expansion + Anthropic). RPO: $60.7B (YE2025). CoreWeave now serves 9 of the top 10 AI model providers.</div>

        {/* Customer Contracts */}
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
                  cust: "Microsoft",
                  value: "Up to ~$10B",
                  term: "Multi-year (through ~2029)",
                  arr: "~$3.4B (67% of FY25 rev)",
                  delivery: "Ongoing — ramping since 2023",
                  gpu: "H100, H200, GB200",
                  pricing: "Take-or-pay, committed capacity",
                  exit: "Can exit if CoreWeave misses delivery milestones. Declined ~$12B expansion option (Mar 2025), redirected to OpenAI (who signed $11.9B deal days later).",
                  source: "S-1/A, DataCenterDynamics",
                },
                {
                  cust: "OpenAI",
                  value: "$22.4B",
                  term: "~5 years (through ~2030)",
                  arr: "~$4.5B implied",
                  delivery: "Phased: $11.9B (Mar), +$4B (May), +$6.5B (Sep 2025)",
                  gpu: "GB200, Vera Rubin",
                  pricing: "Take-or-pay, reserved capacity. OpenAI also invested $350M equity in CRWV.",
                  exit: "Milestone-contingent. If CoreWeave fails to deliver capacity on schedule, OpenAI can reduce or exit commitments without penalty.",
                  source: "S-1/A, Bloomberg, company announcements",
                },
                {
                  cust: "Meta",
                  value: "~$35B+",
                  term: "Through 2032",
                  arr: "~$5B+ implied",
                  delivery: "Starting 2026 — GB300 Blackwell Ultra",
                  gpu: "NVIDIA GB300 Blackwell Ultra",
                  pricing: "Committed capacity. $21B expansion signed Apr 9, 2026. Original contract ($14.2B) used as collateral for $8.5B financing.",
                  exit: "\"Up to\" language — ceiling, not guaranteed floor. Exit provisions tied to delivery milestones.",
                  source: "CoreWeave IR, CNBC, Bloomberg",
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

      {/* Data Center Footprint & Active Power */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Data Center Footprint & Active Power</div>
        <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 16 }}>43 data centers (YE 2025). 850 MW active power capacity (utility connected; est. ~650-750 MW billing in Q4 2025). Nearly all facilities are LEASED — Kenilworth NJ is the only confirmed owned site. $15B+ in long-term lease obligations.</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Active Power (Connected)</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#10B981" }}>850 MW</div>
            <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>Est. ~650-750 MW billing Q4 2025</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Target (End 2026)</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F59E0B" }}>1.7 GW+</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Contracted Total</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#3B82F6" }}>3.1 GW</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Target (2030)</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#8B5CF6" }}>5 GW</div>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
          <thead>
            <tr>
              {["Location", "Partner", "MW", "Own/Lease", "Status", "Timeline", "Notes"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              // Under construction / planning — latest to earliest
              { loc: "Longfellow Ranch, TX (Poolside Horizon)", partner: "Poolside AI", mw: "2,000 (8×250 MW phases)", own: "Leased", status: "Planning", timeline: "First 250 MW: late 2026", notes: "Anchor tenant for first phase. Natural gas powered (Permian Basin)." },
              { loc: "Hammond, IN", partner: "Decennial Group", mw: "180", own: "Leased", status: "Planning", timeline: "2027 (contingent on NIPSCO power)", notes: "$3B project. 450K sq ft. Power agreement still pending." },
              { loc: "Lancaster, PA", partner: "Chirisa / Machine Investment Group", mw: "100 (Phase 1; scalable to 300)", own: "Leased (likely)", status: "Under build", timeline: "Summer 2027", notes: "$6B Phase 1. Five 20 MW halls. Turner-Wohlsen JV builder." },
              { loc: "Regina, Saskatchewan", partner: "Bell Canada", mw: "140 (of 300 MW campus)", own: "Leased", status: "Pre-construction", timeline: "H1 2027 (phased)", notes: "Cerebras co-tenant (160 MW). C$1.7B Bell investment. Announced Mar 2026." },
              { loc: "Kenilworth, NJ (NEST)", partner: "CoreWeave (OWNED)", mw: "50 initial; 250 target", own: "Owned", status: "Under build", timeline: "Early 2027", notes: "Only confirmed owned facility. $322M acquisition (former Merck). $1.8B total. $250M NJ tax credit." },
              { loc: "Ellendale, ND (Phase 3)", partner: "Applied Digital", mw: "150", own: "Leased (~15 yr)", status: "Under build", timeline: "2027", notes: "Building 3 at Polaris Forge 1. No specific quarter disclosed." },
              { loc: "Ellendale, ND (Phase 2)", partner: "Applied Digital", mw: "150", own: "Leased (~15 yr)", status: "Under build", timeline: "Mid-2026", notes: "Building 2 at Polaris Forge 1." },
              { loc: "Dickens County, TX (Galaxy Helios)", partner: "Galaxy Digital", mw: "800 (committed by CRWV)", own: "Leased (15 yr)", status: "Under build", timeline: "First phase: early-mid 2026", notes: "Galaxy closed $1.4B project finance. Capacity doubling approved to 1.6 GW." },
              { loc: "Muskogee, OK", partner: "Core Scientific", mw: "100 total (~70 IT)", own: "Leased (12 yr)", status: "Under build", timeline: "2026", notes: "Part of $8.7B / 500 MW hosting deal. Groundbreaking Nov 2024." },
              { loc: "Denton, TX (expansion)", partner: "Core Scientific", mw: "~260 total (phased)", own: "Leased (12 yr)", status: "Partially operational", timeline: "Phased 2025-2027", notes: "~48-100 MW est. live, 16K GPUs deployed. 60-day weather delay. $1.2B expansion. OpenAI workloads." },
              { loc: "Chester, VA (expansion)", partner: "Chirisa / Blue Owl JV", mw: "120 (expansion from 28)", own: "Leased (12 yr)", status: "Under build", timeline: "Phased 2025-2026", notes: "$5B JV. Note: Blue Owl had difficulty securing $4B financing for related project (Feb 2026)." },
              { loc: "Östersund, Sweden", partner: "EcoDataCenter", mw: "20 (Phase 1 of 150)", own: "Leased", status: "Under build", timeline: "2026", notes: "Second Swedish site." },
              // Operational — latest to earliest
              { loc: "Vennesla, Norway", partner: "Bulk Infrastructure", mw: "Not disclosed", own: "Leased", status: "Likely operational", timeline: "Target: Summer 2025 (no go-live PR)", notes: "GB200 NVL72. 100% hydropower. Go-live not explicitly confirmed." },
              { loc: "Falun, Sweden", partner: "EcoDataCenter", mw: "Not disclosed", own: "Leased", status: "Likely operational", timeline: "Target: Early 2025 (no go-live PR)", notes: "Blackwell GPUs. Part of $2.2B EU investment. Go-live not explicitly confirmed." },
              { loc: "Ellendale, ND (Phase 1)", partner: "Applied Digital", mw: "100", own: "Leased (~15 yr)", status: "Operational", timeline: "Nov 24, 2025 (confirmed)", notes: "Building 1 at Polaris Forge 1. Both 50 MW phases delivered on time." },
              { loc: "Barcelona, Spain", partner: "MERLIN Edged", mw: "15", own: "Leased", status: "Operational", timeline: "May 13, 2025", notes: "10,224 H200 GPUs. 100% renewable. Blackwell expansion planned 2026." },
              { loc: "Cambridge, Ontario", partner: "Related Digital / TowerBrook", mw: "Not disclosed (54 MW expansion under build)", own: "Leased", status: "Operational", timeline: "Pre-2026", notes: "$11B 15-yr deal. CPPIB $225M expansion investment. Cohere customer." },
              { loc: "London Docklands, UK", partner: "Global Switch", mw: "Not disclosed", own: "Leased", status: "Operational", timeline: "Dec 2024", notes: "H200 GPUs. Quantum-2 InfiniBand. 100% renewable." },
              { loc: "Crawley, UK", partner: "Digital Realty", mw: "Not disclosed", own: "Leased", status: "Operational", timeline: "Oct 2024", notes: "H200 GPUs. 100% renewable. Part of GBP 1B UK investment." },
              { loc: "Chester, VA (Phase 1)", partner: "Chirisa Technology Parks", mw: "28", own: "Leased (12 yr)", status: "Operational", timeline: "2024", notes: "$365M contract for initial 28 MW. 250K sq ft, 88-acre campus." },
              { loc: "Austin, TX", partner: "Core Scientific", mw: "16 (12 operating)", own: "Leased (8 yr)", status: "Operational", timeline: "2024", notes: "118K sq ft. Acquisition failed; remains lease." },
              { loc: "Hillsboro, OR", partner: "Flexential", mw: "9", own: "Leased", status: "Operational", timeline: "2024", notes: "InfiniBand at 3,600 Gbps." },
              { loc: "Douglasville, GA", partner: "Flexential", mw: "9", own: "Leased", status: "Operational", timeline: "2024", notes: "Southeast US presence." },
              { loc: "Plano, TX", partner: "Lincoln Rackhouse", mw: "30 (12 initial)", own: "Leased (6+4 yr)", status: "Operational", timeline: "End of 2023", notes: "454K sq ft. $1.6B project. $141M city tax incentives." },
              { loc: "Las Vegas, NV", partner: "Switch", mw: "Not disclosed", own: "Leased", status: "Operational", timeline: "2022-2023", notes: "Switch Core Campus (275 MW total). CRWV allocation undisclosed." },
              { loc: "Chicago, IL (ORD1)", partner: "Not disclosed", mw: "Not disclosed", own: "Leased", status: "Operational", timeline: "Pre-2023", notes: "Original region. Colocation partner not publicly named." },
              { loc: "Weehawken, NJ (LGA1)", partner: "Not disclosed", mw: "Not disclosed", own: "Leased", status: "Operational", timeline: "Pre-2023", notes: "Original HQ region. Colocation partner not confirmed." },
              { loc: "Other US sites (~18)", partner: "Various (incl. Equinix IBX)", mw: "Not individually disclosed", own: "Leased", status: "Operational", timeline: "Various", notes: "Smaller retail colo deployments. Make up bulk of 43 DC count." },
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 600, color: "#F8FAFC", fontSize: 11 }}>{row.loc}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.partner}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 700 }}>{row.mw}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: row.own === "Owned" ? "#10B981" : "#94A3B8", fontWeight: row.own === "Owned" ? 700 : 400, fontSize: 11 }}>{row.own}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                    background: row.status === "Operational" ? "rgba(16,185,129,0.12)" : row.status === "Under build" ? "rgba(245,158,11,0.12)" : row.status === "Partially operational" ? "rgba(59,130,246,0.12)" : row.status === "Likely operational" ? "rgba(16,185,129,0.08)" : row.status === "Pre-construction" ? "rgba(245,158,11,0.08)" : "rgba(100,116,139,0.12)",
                    color: row.status === "Operational" ? "#10B981" : row.status === "Under build" ? "#F59E0B" : row.status === "Partially operational" ? "#3B82F6" : row.status === "Likely operational" ? "#6EE7B7" : row.status === "Pre-construction" ? "#FCD34D" : "#94A3B8",
                  }}>{row.status}</span>
                </td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>{row.timeline}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: CoreWeave S-1/A, 10-K (FY2025), Q4 2025 earnings, Applied Digital IR, Core Scientific IR, Flexential PR, Digital Realty, Global Switch, MERLIN Edged, Bulk Infrastructure, EcoDataCenter, Galaxy Digital, Poolside AI, Bell Canada/BCE, Decennial Group, Chirisa Technology Parks, Real Estate NJ, DCD, Baxtel.</div>
      </div>
    </>)}

    {/* ===== ORG CHART SUB-TAB ===== */}
    {tab ==="orgchart" && (<>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>CoreWeave Corporate &amp; SPV Structure</div>
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
          <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>CoreWeave, Inc.</div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Parent &middot; Delaware &middot; CIK 0001769628</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 6 }}>Unconditional guarantor of DDTL 1.0, 2.0, 2.1, and DDTL 3.0 (CCAC VII only)</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>S&P: B+</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>Moody's: Ba3</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>Fitch: BB-</span>
          </div>
        </div>
        {/* Connector line */}
        <div style={{ width: 2, height: 24, background: "#1E293B" }} />
      </div>

      {/* === CCAC ENTITIES — SINGLE ROW ORG CHART === */}
      {/* Connector lines from parent to entities */}
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

      {/* Entity Cards — single row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { name: "CCAC II, LLC", fullName: "CoreWeave Compute Acquisition Co. II", tag: "DDTL 1.0", tagBg: "rgba(239,68,68,0.12)", tagColor: "#EF4444", color: "#EF4444", border: "1px solid #1E293B",
            outstanding: "$1.55B", capacity: "$2.3B", capacityNote: "amortizing", rate: "SOFR+962", effRate: "~15% eff.", maturity: "Mar 28, 2028 (balloon)", gpus: "NVIDIA H100 80GB (Hopper)", customer: "Microsoft (specified IG)", recourse: "Full recourse to Parent", lenders: "Magnetar Capital (Lead), Blackstone Tactical Opp.",
            syndicate: "Coatue, DigitalBridge, BlackRock, PIMCO, Carlyle", collateral: "1st priority: 100% equity in CCAC II + all assets", agent: "U.S. Bank Trust Co., N.A.", guarantor: "CoreWeave, Inc. — unconditional", ltv: "~65% on GPU hardware", crossDefault: "Yes — customary", ringFenced: "Yes — CCAC II assets only", sub: "Direct subsidiary · Delaware" },
          { name: "CCAC IV, LLC", fullName: "CoreWeave Compute Acquisition Co. IV", tag: "DDTL 2.0/2.1", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B", border: "1px solid #1E293B",
            outstanding: "$7.78B", capacity: "$10.6B", capacityNote: "combined", rate: "SOFR+425–1300", effRate: "~9–17% eff.", maturity: "5 years from each draw", gpus: "H100, H200, early Blackwell", customer: "Tiered: Microsoft (IG), other IG, non-IG", recourse: "Full recourse to Parent", lenders: "Blackstone (Lead), Magnetar Capital",
            syndicate: "Coatue, Carlyle, CDPQ, DigitalBridge, BlackRock, Eldridge", collateral: "1st priority: 100% equity in CCAC IV + all assets", agent: "U.S. Bank Trust Co., N.A.", guarantor: "CoreWeave, Inc. — unconditional", ltv: "—", crossDefault: "Yes — customary", ringFenced: "Yes — CCAC IV assets only", sub: "Direct subsidiary · Delaware", foreignSubs: "CCAC IV UK Ltd, Sweden AB, Spain S.L.U" },
          { name: "CCAC V + VII", fullName: "Co-Borrowers", tag: "DDTL 3.0", tagBg: "rgba(16,185,129,0.12)", tagColor: "#10B981", color: "#10B981", border: "1px solid #1E293B",
            outstanding: "$340M", capacity: "$2.6B", capacityNote: "early draws", rate: "SOFR+400", effRate: "~9% eff.", maturity: "Aug 21, 2030", gpus: "NVIDIA GB200 NVL72, GB300 NVL72", customer: "OpenAI — $22.4B contract", recourse: "Split: VII=full, V=non-recourse", lenders: "Morgan Stanley, MUFG Bank",
            syndicate: "Goldman Sachs, JPMorgan, Wells Fargo, BBVA, SocGen", collateral: "All CCAC VII assets + 100% equity via Holdco", agent: "MUFG Bank, Ltd.", guarantor: "VII: Parent + Holdco · V: NONE", ltv: "—", crossDefault: "Yes — customary", ringFenced: "Yes — V/VII assets only", sub: "V=direct · VII=indirect (via Holdco) · Delaware", hedging: "Must swap ≥75% floating to fixed" },
          { name: "Meta Facility", fullName: "Meta-Backed Debt Facility", tag: "PENDING", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6", color: "#3B82F6", border: "1px dashed #3B82F6",
            outstanding: "$8.5B", capacity: "$8.5B", capacityNote: "largest single DDTL", rate: "SOFR+225 / ~5.9% fixed", effRate: "~5.9%", maturity: "Mar 2032", gpus: "NVIDIA GB300 NVL72 (Blackwell Ultra)", customer: "Meta Platforms — AA-/Aa3", recourse: "Non-recourse to Parent", lenders: "MUFG, Morgan Stanley (co-structuring agents / JBR)",
            syndicate: "Goldman Sachs, JPMorgan (coordinating lead arrangers). Anchored by Blackstone Credit. Meaningfully oversubscribed.", collateral: "GPU clusters + Meta contract cash flows (~$19.2B)", agent: "MUFG", guarantor: "N/A — SPV structure", ltv: "~44% ($8.5B / $19.2B)", crossDefault: "Yes", ringFenced: "Yes", sub: "CoreWeave Compute Acquisition Co. VIII, LLC", structure: "First-ever IG-rated GPU-backed financing. Rated A3 (Moody's) / A-low (DBRS). ~300bp improvement vs 9% unsecured." },
          { name: "CCAC III / VI", fullName: "Reserved Entities", tag: "RESERVED", tagBg: "rgba(139,92,246,0.12)", tagColor: "#A78BFA", color: "#A78BFA", border: "1px solid #1E293B",
            outstanding: "—", capacity: "—", capacityNote: "—", rate: "—", effRate: "—", maturity: "—", gpus: "—", customer: "—", recourse: "—", lenders: "—",
            syndicate: "—", collateral: "—", agent: "—", guarantor: "—", ltv: "—", crossDefault: "—", ringFenced: "—", sub: "Delaware · Listed in 10-K EX-21.1", notes: "III: Dormant. VI: Reserved — likely Meta facility SPV candidate." },
        ].map((e, i) => (
          <div key={i} style={{ background: "#111827", border: e.border, borderRadius: 8, padding: "12px 12px 10px", position: "relative", minWidth: 0 }}>
            <div style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: e.tagBg, color: e.tagColor, fontWeight: 600, display: "inline-block", marginBottom: 6 }}>{e.tag}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC", marginBottom: 2, lineHeight: 1.2 }}>{e.name}</div>
            <div style={{ fontSize: 9, color: "#64748B", marginBottom: 8 }}>{e.fullName} · {e.sub}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 8 }}>
              <div style={{ background: "#0B0F19", borderRadius: 5, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Outstanding</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: e.color }}>{e.outstanding}</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>of {e.capacity}</div>
              </div>
              <div style={{ background: "#0B0F19", borderRadius: 5, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Rate</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: e.color }}>{e.rate}</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>{e.effRate}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.7 }}>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Maturity:</span> {e.maturity}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>GPUs:</span> {e.gpus}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Customer:</span> {e.customer}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Collateral:</span> {e.collateral}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Guarantor:</span> {e.guarantor}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Recourse:</span> {e.recourse}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Ring-Fenced:</span> {e.ringFenced}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Lead Lenders:</span> {e.lenders}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Syndicate:</span> {e.syndicate}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Agent:</span> {e.agent}</div>
              {e.ltv && e.ltv !== "—" && <div><span style={{ color: "#64748B", fontWeight: 600 }}>LTV:</span> {e.ltv}</div>}
              {e.crossDefault && e.crossDefault !== "—" && <div><span style={{ color: "#64748B", fontWeight: 600 }}>Cross-Default:</span> {e.crossDefault}</div>}
              {e.foreignSubs && <div><span style={{ color: "#64748B", fontWeight: 600 }}>Foreign Subs:</span> {e.foreignSubs}</div>}
              {e.hedging && <div><span style={{ color: "#64748B", fontWeight: 600 }}>Hedging:</span> {e.hedging}</div>}
              {e.structure && <div><span style={{ color: "#64748B", fontWeight: 600 }}>Structure:</span> {e.structure}</div>}
              {e.notes && <div style={{ marginTop: 4, color: "#94A3B8", fontStyle: "italic" }}>{e.notes}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* === UNSECURED NOTES === */}
      <div style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, marginTop: 4 }}>Debt at Parent</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { name: "9.250% Senior Notes", tag: "UNSECURED", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B",
            outstanding: "$2.0B", rate: "9.25%", rateType: "fixed", maturity: "Jun 1, 2030",
            issuer: "CoreWeave, Inc.", guarantor: "CoreWeave Cash Management LLC + future domestic restricted subsidiaries", trustee: "Wilmington Trust, N.A.",
            offering: "Rule 144A · Issued May 2025", redemption: "Redeemable pre-Jun 2027 at par + make-whole premium", ranking: "Senior unsecured — pari passu with 2031 Notes and Convertible Notes",
            covenants: "Incurrence-based: debt limitation, restricted payments, asset sale proceeds, affiliate transactions.", crossDefault: "Yes — cross-acceleration to other indebtedness >$150M", changeOfControl: "101% repurchase offer upon change of control" },
          { name: "9.000% Senior Notes", tag: "UNSECURED", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B",
            outstanding: "$1.75B", rate: "9.00%", rateType: "fixed", maturity: "Feb 1, 2031",
            issuer: "CoreWeave, Inc.", guarantor: "Same guarantor pool as 2030 Notes — jointly & severally, fully & unconditionally", trustee: "Not disclosed",
            offering: "Rule 144A / Reg S · Issued Jul 2025", redemption: "Standard high-yield call schedule", ranking: "Senior unsecured — pari passu with 2030 Notes and Convertible Notes",
            covenants: "Substantially identical to 2030 Notes indenture. Incurrence-based covenants.", crossDefault: "Yes — cross-acceleration to other indebtedness >$150M", changeOfControl: "101% repurchase offer upon change of control" },
          { name: "1.25B Senior Notes (2031)", tag: "UNSECURED", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B",
            outstanding: "$1.25B", rate: "TBD", rateType: "fixed", maturity: "2031",
            issuer: "CoreWeave, Inc.", guarantor: "Same guarantor pool", trustee: "TBD",
            offering: "Issued Apr 2026 alongside $3B convertible", redemption: "Standard high-yield call schedule", ranking: "Senior unsecured — pari passu with existing notes",
            covenants: "Expected substantially identical to existing indentures.", crossDefault: "Yes — cross-acceleration to other indebtedness >$150M", changeOfControl: "101% repurchase offer" },
          { name: "1.75% Convertible Notes", tag: "CONVERTIBLE", tagBg: "rgba(139,92,246,0.12)", tagColor: "#A78BFA", color: "#A78BFA",
            outstanding: "$2.588B", rate: "1.75%", rateType: "fixed", maturity: "Dec 1, 2031",
            issuer: "CoreWeave, Inc.", guarantor: "Same guarantor pool — jointly & severally, fully & unconditionally", trustee: "U.S. Bank Trust Co., N.A.",
            offering: "Issued Dec 2025", redemption: "Redeemable after Dec 2028 if stock >130% of conversion price for 20/30 days", ranking: "Senior unsecured — pari passu with 2030 and 2031 Notes",
            covenants: "Lighter than high-yield notes. Standard convertible indenture restrictions.", crossDefault: "Yes — cross-acceleration to other indebtedness >$150M", changeOfControl: "Investor put at 100% + make-whole fundamental change adjustment",
            conversion: "9.2764 shares/$1K (~$107.80 conversion price)", cappedCall: "Strike $107.80, cap $215.60 ($340M cost)" },
          { name: "$3B Convertible Notes (2032)", tag: "CONVERTIBLE", tagBg: "rgba(139,92,246,0.12)", tagColor: "#A78BFA", color: "#A78BFA",
            outstanding: "$3.0B", rate: "TBD", rateType: "fixed", maturity: "2032",
            issuer: "CoreWeave, Inc.", guarantor: "Same guarantor pool", trustee: "TBD",
            offering: "Issued Apr 2026. $450M greenshoe option.", redemption: "TBD", ranking: "Senior unsecured — pari passu with existing notes",
            covenants: "Standard convertible indenture.", crossDefault: "Yes — cross-acceleration to other indebtedness >$150M", changeOfControl: "TBD",
            conversion: "Terms TBD — issued alongside $21B Meta expansion", cappedCall: "TBD" },
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
                <div style={{ fontSize: 10, color: "#94A3B8" }}>{e.rateType}</div>
              </div>
              <div style={{ background: "#0B0F19", borderRadius: 5, padding: "6px 8px" }}>
                <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Coupon</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: e.color }}>{e.rate}</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>Mat: {e.maturity}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.7 }}>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Issuer:</span> {e.issuer}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Guarantor:</span> {e.guarantor}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Trustee:</span> {e.trustee}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Ranking:</span> {e.ranking}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Offering:</span> {e.offering}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Redemption:</span> {e.redemption}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Covenants:</span> {e.covenants}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Cross-Default:</span> {e.crossDefault}</div>
              <div><span style={{ color: "#64748B", fontWeight: 600 }}>Change of Control:</span> {e.changeOfControl}</div>
              {e.conversion && <div><span style={{ color: "#64748B", fontWeight: 600 }}>Conversion:</span> {e.conversion}</div>}
              {e.cappedCall && <div><span style={{ color: "#64748B", fontWeight: 600 }}>Capped Call:</span> {e.cappedCall}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* === CROSS-STRUCTURE RISK MAP === */}
      <div style={s.card}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Cross-Structure Risk Map</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#EF4444", marginBottom: 6 }}>Cross-Default Exposure</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              Every facility has customary cross-default clauses. A covenant breach in one facility (e.g., Dec 2024 CCAC IV breach) could trigger acceleration across the entire debt stack through cross-default provisions AND the parent guarantee structure.
            </div>
          </div>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 6 }}>Ring-Fencing (Asset Level)</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              No cross-collateralization between SPVs. CCAC II, CCAC IV, and CCAC V/VII assets are ring-fenced. BUT the parent guarantee creates de facto cross-exposure — ring-fencing protects SPV assets from other SPV creditors, not from parent-level cascading.
            </div>
          </div>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B", marginBottom: 6 }}>Parent Guarantee Scope</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              Full recourse: DDTL 1.0 (CCAC II), DDTL 2.0/2.1 (CCAC IV), DDTL 3.0 CCAC VII only.<br/>
              <span style={{ color: "#EF4444", fontWeight: 600 }}>NOT guaranteed: CCAC V</span> (DDTL 3.0 co-borrower). First non-recourse SPV — may signal shift toward true project finance.
            </div>
          </div>
          <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#8B5CF6", marginBottom: 6 }}>Guarantor Silos</div>
            <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>
              <strong>DDTL SPVs:</strong> Guaranteed by Parent directly. Restrictive covenants on Parent (debt, liens, dividends, M&A).<br/>
              <strong>Unsecured debt:</strong> Guaranteed by CoreWeave Cash Management LLC + future restricted subs. Separate guarantor pool from DDTLs.
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Sources: CoreWeave S-1/A (Mar 2025), 10-K FY2025 (filed Mar 2, 2026), EX-21.1 subsidiary lists, 8-K filings (DDTL 3.0 Jul 2025, Fifth Amendment Sep 2025, Convertible Notes Dec 2025), Bloomberg (Meta facility Feb 2026), $4.7B debt offering (Apr 2026). All entity names and terms per SEC filings.</div>
    </>)}

    {/* ===== CONTRACTS SUB-TAB ===== */}
    {tab ==="contracts" && (<>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Supply Side &amp; Customer Contracts</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>Granular terms on CoreWeave's anchor contracts. Total backlog: ~$87B+ (post-Apr 2026 Meta expansion + Anthropic deal). RPO: $60.7B (YE2025). 96% take-or-pay. CoreWeave now serves 9 of top 10 AI model providers. Key commercial terms redacted in SEC filings.</div>

      {/* Contract Comparison */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Contract Comparison</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                {["Metric", "OpenAI", "Meta", "Microsoft"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { metric: "Contract Value", oai: "$22.4B", meta: "~$35B+", msft: "~$10B" },
                { metric: "Term", oai: "Through Oct 2030", meta: "Through 2032", msft: "Through ~2030" },
                { metric: "% of Backlog", oai: "~26%", meta: "~40% (~$35B total)", msft: "~11%" },
                { metric: "% of FY25 Revenue", oai: "Ramping (signed Mar 2025)", meta: "Minimal (signed Sep 2025)", msft: "67% ($3.4B)" },
                { metric: "Counterparty Credit", oai: "Unrated (pre-profit)", meta: "A+ (IG)", msft: "AA+ (IG)" },
                { metric: "GPU Generation", oai: "GB200 → GB300", meta: "GB300 (Blackwell Ultra)", msft: "H100 / H200" },
                { metric: "Financing Rate", oai: "SOFR+4.00% (SPV)", meta: "SOFR+2.25% (DDTL)", msft: "Not separately financed" },
                { metric: "Equity Cross-Investment", oai: "$350M at $40/share", meta: "None", msft: "None" },
                { metric: "Strategic Importance", oai: "CoreWeave is <4% of OAI's $610B infra", meta: "Now largest customer by backlog. $21B expansion Apr 2026.", msft: "Bridge/supplement to Azure" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.metric}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#10B981" }}>{row.oai}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#F59E0B" }}>{row.meta}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#3B82F6" }}>{row.msft}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>The 175bp spread differential (SOFR+2.25% Meta vs SOFR+4.00% OpenAI) is the market's pricing of counterparty credit quality. For unsecured bondholders, the blended counterparty quality across the backlog determines recovery in a stress scenario.</div>
      </div>

      {/* AI-Native Customer Pipeline */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>AI-Native Customer Pipeline</div>
        <div style={{ display: "flex", gap: 16 }}>

        {/* Confirmed Customers */}
        <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #10B981" }}>Confirmed CoreWeave Customers</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 11 }}>
            <thead>
              <tr>
                {["Company", "Sector", "Valuation", "GPU", "Deal / Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { co: "Anthropic", sector: "AI Foundation Model", val: "$61B", gpu: "NVIDIA (incl. Vera Rubin)", deal: "Multi-year deal (Apr 10, 2026). Powering Claude at production scale." },
                { co: "Poolside", sector: "AI Coding", val: "$12B", gpu: "40K+ GB300", deal: "~$5B backlog (Evercore). Anchor tenant, Project Horizon 2GW TX campus" },
                { co: "Perplexity", sector: "AI Search", val: "$20B", gpu: "GB200 NVL72", deal: "Multi-year inference deal (Mar 2026)" },
                { co: "Runway", sector: "AI Video / World Models", val: "$5.3B", gpu: "GB300 NVL72", deal: "Training + inference (Dec 2025)" },
                { co: "Midjourney", sector: "AI Image Gen", val: "~$10B", gpu: "H100/H200", deal: "Reserved instance (Q4 2025)" },
                { co: "Cursor (Anysphere)", sector: "AI Coding", val: "$50B", gpu: "H100", deal: "Reserved instance (Q4 2025). Primary on AWS/Azure" },
                { co: "Cognition (Devin)", sector: "AI SWE Agent", val: "$10.2B", gpu: "—", deal: "Reserved instance (Q4 2025)" },
                { co: "MercadoLibre", sector: "Enterprise AI", val: "Public", gpu: "—", deal: "Reserved instance (Q4 2025)" },
                { co: "Zonos", sector: "Global Commerce", val: "Early", gpu: "—", deal: "GTC 2026 deployment" },
                { co: "Cline", sector: "Autonomous Coding", val: "Early", gpu: "—", deal: "GTC 2026 deployment" },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.co}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.sector}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600 }}>{row.val}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#F59E0B", fontSize: 11 }}>{row.gpu}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 11 }}>{row.deal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        {/* Best Prospects */}
        <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #F59E0B" }}>Best Prospects (No Neocloud Lock-In)</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 11 }}>
            <thead>
              <tr>
                {["Company", "Sector", "Valuation", "ARR", "Why CoreWeave Could Win"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { co: "Pika", sector: "AI Video Gen", val: "$2B", arr: "~$50M", why: "Extremely GPU-intensive. No exclusive deal." },
                { co: "HeyGen", sector: "AI Video", val: "$1.3B", arr: "~$95M", why: "Video gen needs massive GPU inference." },
                { co: "Synthesia", sector: "AI Video Avatars", val: "$2.1B", arr: "$100M+", why: "GPU-heavy rendering. No known lock-in." },
                { co: "World Labs", sector: "3D / Spatial AI", val: "$1B+", arr: "Pre-rev", why: "Fei-Fei Li. Needs training compute." },
                { co: "Harvey", sector: "Legal AI", val: "$11B", arr: "$190M", why: "Scaling fast. No known neocloud deal." },
                { co: "Sierra", sector: "Enterprise Agents", val: "$10B", arr: "$150M", why: "Inference at scale. No exclusive provider." },
                { co: "Glean", sector: "Enterprise Search", val: "$7.2B", arr: "$200M", why: "Inference-heavy. No known neocloud lock." },
                { co: "Scale AI", sector: "Data / Labeling", val: "$14B", arr: "$500M+", why: "Training + inference at scale." },
                { co: "Lovable", sector: "Vibe Coding", val: "$5B", arr: "$400M", why: "Fast growth. GPU for code gen." },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.co}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.sector}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600 }}>{row.val}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#10B981", fontWeight: 600 }}>{row.arr}</td>
                  <td style={{ padding: "7px 8px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 11 }}>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>Confirmed customers from Q4 2025 earnings call + GTC 2026 announcements + press releases. Prospects based on no known exclusive neocloud deal and GPU-intensive workloads. Sources: CoreWeave IR, Motley Fool, DCD, CNBC, company disclosures.</div>
      </div>

      {/* Supply-Side / Backstop Contracts */}
      <div style={s.card}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>Supply-Side & Backstop Contracts</div>
        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 900 }}>
            <thead>
              <tr>
                {["Counterparty", "Contract Value", "Term", "Type", "Key Terms", "Source"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  cpty: "NVIDIA (Backstop)",
                  value: "$6.3B",
                  term: "Through Apr 2032",
                  type: "Capacity backstop",
                  terms: "NVIDIA purchases any unsold CoreWeave GPU capacity — de-risks utilization. Contingent on CoreWeave meeting delivery milestones. Effectively a put option on idle capacity.",
                  source: "S-1/A",
                },
                {
                  cpty: "NVIDIA (Equity)",
                  value: "$2B",
                  term: "Jan 2026",
                  type: "Equity investment",
                  terms: "Invested at $87.20/share. Aligns NVIDIA's interest with CoreWeave's success. NVIDIA is both supplier and financial backer.",
                  source: "S-1/A, Bloomberg",
                },
                {
                  cpty: "Core Scientific",
                  value: "$8.7B",
                  term: "12 years",
                  type: "DC hosting / colocation",
                  terms: "590 MW across 5 sites. CoreWeave proposed $9B all-stock acquisition (Jul 2025), but Core Scientific shareholders rejected it Oct 2025 — deal terminated. Take-or-pay on power and space.",
                  source: "Core Scientific IR, S-1/A",
                },
                {
                  cpty: "Applied Digital",
                  value: "~$11B",
                  term: "~15 years",
                  type: "DC hosting / colocation",
                  terms: "~$11B anticipated lease revenue over ~15 years. 400 MW at Ellendale, ND (Polaris campus). 3 phases: 100 MW (live Q4 2025), 150 MW (mid 2026), 150 MW (2027).",
                  source: "Applied Digital IR",
                },
                {
                  cpty: "Blackstone / Carlyle",
                  value: "~$8.5B+",
                  term: "Various maturities",
                  type: "Secured debt financing",
                  terms: "Secured against GPU fleet + DC assets. Meta contract used as collateral for Feb 2026 raise. Multiple tranches: Term Loan B, secured notes.",
                  source: "S-1/A, Moody's, S&P",
                },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#8B5CF6", whiteSpace: "nowrap" }}>{row.cpty}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F8FAFC", fontWeight: 600 }}>{row.value}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.term}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8" }}>{row.type}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11, maxWidth: 300 }}>{row.terms}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Contract Risk Factors */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>Contract Risk Factors</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { title: "Customer Concentration", desc: "Microsoft = 67% of FY2025 revenue ($3.4B of $5.1B). Backlog rapidly diversifying — Meta now ~40% of ~$87B+ backlog. Anthropic + Poolside + Perplexity add breadth. Serves 9 of top 10 AI model providers.", color: "#F59E0B" },
            { title: "\"Up To\" Contract Language", desc: "Meta (~$19.2B+) and other contracts use \"up to\" ceilings, not guaranteed minimums. Delivery shortfall = revenue shortfall.", color: "#EF4444" },
            { title: "Milestone-Contingent Exits", desc: "If CoreWeave misses construction milestones, take-or-pay protections may be voided. Kerrisdale's walk-away analysis references Applied Digital lease terms, not CoreWeave customer contracts directly.", color: "#EF4444" },
            { title: "Counterparty Credit Risk", desc: "OpenAI ($22.4B) is unprofitable and pre-IPO. Circular: NVIDIA supplies GPUs + invests + backstops. OpenAI is customer + equity investor ($350M).", color: "#F59E0B" },
            { title: "Committed vs. On-Demand", desc: "~96% take-or-pay, ~4% on-demand. High visibility but must deliver on time to collect.", color: "#10B981" },
            { title: "Contract-as-Collateral", desc: "$8.5B DDTL (A3-rated) backed by Meta contract. If contract terminated, collateral value declines.", color: "#F59E0B" },
          ].map((item, i) => (
            <div key={i} style={{ flex: "1 1 280px", minWidth: 280, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: "1.6" }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, color: "#64748B", marginTop: 14, fontStyle: "italic" }}>Sources: CoreWeave S-1/A (Mar 2025), Q2 2025 earnings, Bloomberg, Reuters, DataCenterDynamics, Kerrisdale Capital short report, Core Scientific IR, Applied Digital IR, Moody's (B3 CFR), S&P (B- issuer).</div>
      </div>

      {/* ═══ OPENAI ═══ */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#10B981" }}>OpenAI</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>Largest backlog contributor (~34%) &middot; 3 tranches &middot; $350M equity cross-investment</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" }}>Total Contract</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>$22.4B</div>
          </div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Contract Tranches</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <thead>
            <tr>
              {["Tranche", "Value", "Date Signed", "Term", "GPU Type", "Notes"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { tranche: "Initial", value: "$11.9B", date: "Mar 10, 2025", term: "Through Oct 2030 (~5.5yr)", gpu: "GB200 NVL72 (Blackwell)", notes: "Signed alongside IPO. Redirected from Microsoft's declined $12B option." },
              { tranche: "Expansion 1", value: "Up to $4.0B", date: "May 2025", term: "Through Apr 2029 (~4yr)", gpu: "GB200 / GB300 NVL72", notes: "Bloomberg reported. Shorter term than initial tranche." },
              { tranche: "Expansion 2", value: "Up to $6.5B", date: "Sep 25, 2025", term: "Not separately disclosed", gpu: "GB300 NVL72 (Blackwell Ultra)", notes: "Transition to next-gen from July 2025. CoreWeave press release." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#10B981" }}>{row.tranche}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC" }}>{row.value}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.date}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8" }}>{row.term}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8" }}>{row.gpu}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Contract Structure &amp; Terms</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <tbody>
            {[
              { term: "Pricing Model", detail: "Take-or-pay, committed capacity (~98% of contract). \"Up to\" ceiling language — actual revenue depends on CoreWeave delivering capacity on schedule. Prepayment structure likely similar to Microsoft (15-25% upfront)." },
              { term: "Equity Cross-Investment", detail: "$350M private placement: 8,750,000 shares at $40/share (IPO price). No cash changed hands — recorded as contra-revenue asset. Amortizes ~$70M/year against reported OpenAI revenue. 180-day lock-up expired mid-Aug 2025." },
              { term: "SPV Structure", detail: "Assets held in CoreWeave Compute Acquisition Co. V and VII (special purpose vehicles). $2.6B delayed-draw term loan (DDTL) at SOFR+4.00%, led by Morgan Stanley, MUFG, Goldman Sachs. SPV isolates OpenAI contract assets." },
              { term: "Termination / Break", detail: "OpenAI can terminate for non-delivery. OpenAI holds secured lien on SPV equity in event of default — meaning OpenAI has priority claim on the GPU assets serving its contract if CoreWeave defaults." },
              { term: "Counterparty Risk", detail: "OpenAI is NOT investment grade. Unprofitable ($14B projected loss 2026). Revenue is consumption-based ($19B run rate). However, OpenAI is backed by Microsoft ($250B), Amazon ($50B), and NVIDIA ($10B). Implicit backstop from investors." },
              { term: "Backlog Share", detail: "~34% of $66.8B backlog — largest single contributor. But OpenAI is <4% of its own total infrastructure spend (~$610B across Azure $250B, Oracle $300B, AWS $38B, CoreWeave $22.4B)." },
              { term: "Contra-Revenue Impact", detail: "The $350M equity investment is amortized as a reduction to revenue over the contract term. ~$70M/year. This means CoreWeave's reported OpenAI revenue is ~$70M/year lower than cash received. Investors should add back for cash flow analysis." },
              { term: "Financing Cost", detail: "SPV DDTL at SOFR+4.00% — this is the rate the market charges against OpenAI's credit quality as filtered through CoreWeave's delivery risk. Compare to Meta financing at SOFR+2.25% (175bp premium for OpenAI counterparty risk)." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 180, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10, marginTop: 16 }}>Delivery Milestones &amp; Termination Provisions</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <tbody>
            {[
              { term: "Termination Right", detail: "OpenAI can terminate 'all or a portion' of commitment upon CoreWeave's 'repeated failure to meet availability of service requirements.' Operates at individual order-form level — partial termination possible. (Source: CoreWeave 10-K)" },
              { term: "Substitute Operator", detail: "Upon termination, OpenAI may assume infrastructure operations within 2 business days — effectively seizing the GPU assets and continuing to run workloads. OpenAI also holds a secured lien on SPV equity. (Source: CoreWeave S-1/A SPV exhibits)" },
              { term: "Cure Period", detail: "NOT PUBLICLY DISCLOSED. The specific cure period duration before OpenAI can trigger termination is redacted in SEC filings." },
              { term: "Known Delays", detail: "Denton, TX facility (260 MW, Core Scientific) delayed ~60+ days from weather, plus additional 'several months' from design revisions. Core Scientific flagged delays in Feb 2025 — 9 months before CoreWeave publicly disclosed. OpenAI accommodated by shifting contract start dates rather than terminating. (Sources: WSJ Dec 2025, Pomerantz complaint, Core Scientific Q3 2025 commentary)" },
              { term: "DDTL Amendment", detail: "Credit agreement amended Dec 31, 2025 to 'align with delivery timing.' DSCR testing postponed to Oct 2027. Unlimited equity cures permitted through Oct 2026. Signals lenders acknowledged delivery timeline slippage. (Source: CoreWeave 10-K)" },
              { term: "Specific Milestones", detail: "NOT PUBLICLY DISCLOSED. Specific dated milestones (MW, GPU counts, delivery dates per order form) are redacted under confidential treatment in all SEC filings." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 180, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Sources: CoreWeave S-1/A, 10-K (FY2025), CoreWeave IR press releases, Bloomberg, CNBC, SEC filings (SPV exhibits).</div>
      </div>

      {/* ═══ META ═══ */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F59E0B" }}>Meta</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>Investment-grade counterparty &middot; ~$35B+ total contract &middot; Largest customer by backlog &middot; ~40% of backlog</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" }}>Total Contract</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>~$35B+</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>$14.2B initial + $21B expansion (Apr 2026)</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Initial", value: "Sep 30, 2025", sub: "$14.2B announced" },
            { label: "Expansion", value: "Apr 9, 2026", sub: "$21B additional" },
            { label: "Duration", value: "Through 2032", sub: "Extended commitment" },
            { label: "GPU Type", value: "GB300 NVL72", sub: "Blackwell Ultra" },
            { label: "Financing Rate", value: "SOFR+2.25%", sub: "IG-like pricing" },
            { label: "Meta Credit", value: "Investment Grade", sub: "$201B rev, $62B NI" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "10px 14px", flex: "1 1 130px", minWidth: 130 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>{m.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Contract Structure &amp; Terms</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <tbody>
            {[
              { term: "Total Value", detail: "~$35B+ total. $14.2B initial (Sep 2025) + $21B expanded agreement (Apr 9, 2026). Original contract used as collateral for $8.5B IG-rated financing. Meta is now CoreWeave's largest customer by backlog." },
              { term: "Collateral Financing", detail: "$8.5B DDTL 4.0 closed Mar 31, 2026. Rated A3 (Moody's) / A-low (DBRS) — first-ever IG-rated GPU-backed financing. SOFR+225 / ~5.9% fixed. Maturity Mar 2032. MUFG + Morgan Stanley (co-structuring), Goldman + JPM (CLAs). Anchored by Blackstone Credit. Meaningfully oversubscribed." },
              { term: "IG Backstop Logic", detail: "The lenders are effectively lending against Meta's committed payment obligations. Meta ($201B revenue, $62B net income, IG-rated) is the economic backstop. If CoreWeave delivers capacity, Meta pays, and the debt is serviced. The secured lenders are double-collateralized: GPU hardware + contracted IG cash flows." },
              { term: "Pricing Model", detail: "Committed capacity, take-or-pay. \"Up to\" ceiling language on individual order forms. Total ~$19.2B+ across two agreements. Actual revenue depends on delivery execution." },
              { term: "Termination / Break", detail: "Specific termination provisions not publicly disclosed. General take-or-pay terms require payment through lease-end absent CoreWeave non-performance. If CoreWeave fails to deliver capacity on schedule, Meta is not obligated to pay, and collateral value for the $8.5B loan declines." },
              { term: "GPU Specifications", detail: "NVIDIA GB300 NVL72 (Blackwell Ultra) confirmed. This is next-gen after GB200 — higher performance, expected volume availability mid-2026. Delivery starting 2026." },
              { term: "Competitive Context", detail: "Meta also signed $27B deal with Nebius (Mar 2026) on Vera Rubin chips. Meta's total neocloud spend: $46B+ (CoreWeave ~$19B + Nebius $27B). CoreWeave is supplemental to Meta's own 4+ GW internal DC buildout, not a strategic sole-source." },
              { term: "SOFR+225 vs +400", detail: "175bp spread differential reflects counterparty quality: Meta IG (A3-rated deal) vs OpenAI sub-IG (SOFR+400). ~300bp improvement vs 9% unsecured notes. First-ever IG-rated GPU-backed financing." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 200, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10, marginTop: 16 }}>Delivery Milestones &amp; Termination Provisions</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <tbody>
            {[
              { term: "Termination Right", detail: "General take-or-pay terms require payment through lease-end absent CoreWeave non-performance. Specific termination triggers and cure periods are NOT PUBLICLY DISCLOSED — redacted in SEC filings." },
              { term: "Delivery Status", detail: "Contract announced Sep 2025. GB300 NVL72 delivery starting 2026. No public disclosure of specific delivery milestones or whether any have been met/missed." },
              { term: "Collateral Implications", detail: "If CoreWeave fails to deliver and Meta terminates, the $8.5B DDTL collateral value declines — potentially triggering covenant issues for the Morgan Stanley/MUFG facility. The financing was sized against Meta's committed cash flows." },
              { term: "Specific Milestones", detail: "NOT PUBLICLY DISCLOSED. No public filing contains specific dated delivery milestones for the Meta contract." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 200, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Sources: CoreWeave S-1/A, 10-K (FY2025), Bloomberg (Feb 2026 — $8.5B loan, &gt;$5B additional contract), CNBC, Reuters, PYMNTS.</div>
      </div>

      {/* ═══ MICROSOFT ═══ */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#3B82F6" }}>Microsoft</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>Largest current revenue contributor (~67% FY2025) &middot; Original anchor customer &middot; Diversifying away</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" }}>Total Contract</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>~$10B</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "FY2023 Revenue", value: "~$80M", sub: "35% of total" },
            { label: "FY2024 Revenue", value: "~$1.18B", sub: "62% of total" },
            { label: "FY2025 Revenue", value: "~$3.42B", sub: "67% of total" },
            { label: "Peak Quarterly", value: "~71%", sub: "Q2 2025" },
            { label: "Contract Start", value: "Jun 2023", sub: "Original MSA" },
            { label: "Contract End", value: "~2030", sub: "\"End of decade\"" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "10px 14px", flex: "1 1 130px", minWidth: 130 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>{m.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Contract Structure &amp; Terms</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <tbody>
            {[
              { term: "Structure", detail: "Multiple order forms under a single Master Service Agreement (MSA). Exhibit 10.23 in S-1 — key commercial terms redacted under confidential treatment." },
              { term: "GPU Types", detail: "Primarily NVIDIA H100 (Hopper) — the GPU that drove the original 2023 deal. Some H200 allocation. Newer Blackwell GPUs (GB200/GB300) primarily allocated to OpenAI and Meta contracts." },
              { term: "Pricing Model", detail: "Take-or-pay, committed capacity. Part of CoreWeave's 96% committed revenue base. Customers typically prepay 15-25% upfront. Microsoft must pay through end of lease term whether or not capacity is used." },
              { term: "$12B Expansion Option", detail: "Microsoft had a pre-existing ~$12B capacity expansion option. Declined to exercise in March 2025 (reported by Semafor). The capacity was redirected to OpenAI, which signed the $11.9B deal days later. Exercise deadline, pricing, and specific terms were never publicly disclosed." },
              { term: "Termination / Break", detail: "Contracts require payment through term-end. Exit available on CoreWeave nonperformance or missed construction milestones. FT reported Microsoft 'withdrew from some commitments' over delivery issues; CoreWeave denied cancellations. No public penalty schedule." },
              { term: "Renewal Risk", detail: "Microsoft signed $19.4B deal with Nebius (Oct 2025), diversifying away from CoreWeave. Microsoft released OpenAI from Azure exclusivity (Jan 2025). CoreWeave serves as supplement/bridge while Microsoft builds own capacity." },
              { term: "Azure Interaction", detail: "Microsoft was running at 35-45% GPU efficiency vs CoreWeave's 55-65%. Microsoft is freeing up Azure for commercial clients by offloading internal/OpenAI workloads to neoclouds." },
              { term: "Data Centers", detail: "Not customer-specifically disclosed. US East Coast facilities (NJ metro) most likely serve Microsoft given proximity to Azure East regions. CoreWeave operates 43 DCs across US and Europe." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 180, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10, marginTop: 16 }}>Delivery Milestones &amp; Termination Provisions</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <tbody>
            {[
              { term: "Cure Period", detail: "MSA (Exhibit 10.23) provides a 30-day base cure period for material breach, extendable if the breaching party is 'diligently curing.' Exact extension duration is redacted [*]. Nonpayment cure CANNOT be extended. (Source: CoreWeave S-1, Exhibit 10.23)" },
              { term: "Termination Scope", detail: "Termination operates at the ORDER-FORM level, not the MSA level. Microsoft can terminate individual capacity commitments without terminating the entire relationship. This is the likely mechanism for the reported 'withdrawal from some commitments.' (Source: MSA structure, FT reporting Mar 2025)" },
              { term: "FT Reporting", detail: "Financial Times reported (Mar 2025) that Microsoft 'withdrew from some commitments' over 'delivery issues and missed deadlines.' CoreWeave denied cancellations. The mechanism was likely order-form non-execution rather than formal MSA termination. (Source: Financial Times, CoreWeave denial)" },
              { term: "Known Delays", detail: "No specific Microsoft delivery delays publicly disclosed by CoreWeave. However, the FT reporting and the $12B expansion option decline (also Mar 2025) suggest delivery concerns influenced Microsoft's commitment level." },
              { term: "Specific Milestones", detail: "NOT PUBLICLY DISCLOSED. Specific dated milestones per order form are redacted in the MSA (Exhibit 10.23) under confidential treatment." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap", width: 180, verticalAlign: "top" }}>{row.term}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", lineHeight: 1.6 }}>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Sources: CoreWeave S-1/A (Exhibit 10.23), 10-K (FY2025), Semafor, The Information, Financial Times, DataCenterDynamics.</div>
      </div>
    </>)}

    {/* ===== SENTIMENT SUB-TAB ===== */}
    {tab ==="sentiment" && (<>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Market Sentiment</div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>32-37 analysts. Consensus: Buy. Avg PT ~$115-122. Stock ~$102 after back-to-back $21B Meta expansion + Anthropic deal. Short interest ~15-16.5%. S&P outlook upgraded to Positive.</div>

      {/* Consensus Snapshot */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Consensus Rating", value: "Buy", sub: "32-37 analysts covering", color: "#10B981" },
          { label: "Avg Price Target", value: "~$115-122", sub: "Range: $32 – $200", color: "#3B82F6" },
          { label: "Current Price", value: "~$102", sub: "+11% on Anthropic deal (Apr 10). ATH $187.", color: "#F8FAFC" },
          { label: "Credit Ratings", value: "B+(↑) / Ba3 / BB-", sub: "S&P outlook → Positive. Moody's/Fitch stable.", color: "#F59E0B" },
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
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Sentiment Arc: IPO to Present</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { phase: "Current (Apr 10, 2026)", sentiment: "Bullish Momentum", color: "#10B981", desc: "Stock ~$102 (+11% on Apr 10). Back-to-back catalysts: $21B Meta expansion (Apr 9) + Anthropic multi-year deal (Apr 10). $4.7B new debt offering ($3B convertible + $1.25B unsecured). S&P outlook upgraded to Positive. Short interest ~15-16.5%. Now serves 9 of top 10 AI model providers. Total backlog ~$87B+." },
            { phase: "Mar 2026", sentiment: "Inflection", color: "#8B5CF6", desc: "Stock ~$77→$85. $8.5B Meta-backed IG financing closed — first-ever IG-rated GPU-backed deal (A3/Moody's). BofA upgraded to Buy ($100). Oppenheimer initiated Outperform ($140). Deutsche Bank raised PT to $140." },
            { phase: "Q4 Earnings Shock (Feb 27, 2026)", sentiment: "Bearish Reset", color: "#EF4444", desc: "EPS miss: -$0.89 vs -$0.50 est. Q1 2026 guidance miss. $30-35B capex guide for 2026 spooked market. Stock crashed 18-28% in 2 days. 10+ firms cut PTs: JPM $98→$80, Evercore $115→$85, Citi $97→$75, Macquarie $75→$57." },
            { phase: "Fall Correction (Oct-Dec 2025)", sentiment: "Mixed", color: "#F59E0B", desc: "Core Scientific deal rejected by shareholders. Kerrisdale short report ($6-13 PT). Stock pulled back to ~$120. Some PTs trimmed. Debate intensified on capex sustainability. CDS spreads doubled." },
            { phase: "Summer Peak (Jul-Sep 2025)", sentiment: "Euphoric", color: "#3B82F6", desc: "Stock hit ATH $187. Core Scientific acquisition announced ($9B). OpenAI deal expanded to $22.4B. Meta signed ~$19B+. NVIDIA backstop disclosed ($6.3B). PTs surged: Wells Fargo $200, Bernstein $185, Oppenheimer $175. Bears were silenced." },
            { phase: "Post-IPO Rally (Apr-Jun 2025)", sentiment: "Warming", color: "#10B981", desc: "Stock surged to $75+. Q1 2025 beat ($981M rev vs $847M est). Multiple upgrades: JPM upgraded to OW ($80), Goldman to Buy ($78), Citi initiated Buy ($72). Backlog growth validated thesis." },
            { phase: "IPO (Mar 2025)", sentiment: "Cautious", color: "#F59E0B", desc: "IPO priced at $40 (below $47-55 range). Avg initial PT ~$48. Concerns: $8B debt, negative FCF, customer concentration. Goldman, JPM, Morgan Stanley all initiated at Neutral/EW. Only Barclays (OW, $55) was bullish." },
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
                { firm: "Wells Fargo", rating: "Overweight", pt: "$200", action: "Street high (Sep 2025)", thesis: "Most bullish. GPU demand extends 2+ years. CoreWeave = NVIDIA's preferred channel partner." },
                { firm: "HC Wainwright", rating: "Strong Buy", pt: "$180", action: "Reiterated (Mar 2, 2026)", thesis: "Backlog visibility, NVIDIA partnership, Meta/OpenAI contracts." },
                { firm: "Oppenheimer", rating: "Outperform", pt: "$140", action: "Initiated (Mar 6, 2026)", thesis: "$66.8B backlog at ~$77 stock = massive disconnect." },
                { firm: "Citi", rating: "Buy", pt: "$126", action: "Cut from $135 (Mar 4, 2026)", thesis: "Revenue visibility strong. Capex guide higher than expected." },
                { firm: "Evercore ISI", rating: "Outperform", pt: "$120", action: "Cut from $150 (Mar 9, 2026)", thesis: "AI capex cycle is early. CoreWeave's scale advantage is durable." },
                { firm: "BofA Securities", rating: "Buy", pt: "$100", action: "Upgraded from Neutral (Mar 24, 2026)", thesis: "Pullback creates entry point. Meta/OpenAI contracts underappreciated." },
                { firm: "Goldman Sachs", rating: "Buy", pt: "$96", action: "Cut from $115 (Feb 2026)", thesis: "Fastest cloud infrastructure ramp in history. Backlog de-risks revenue." },
                { firm: "Barclays", rating: "Overweight", pt: "$95", action: "Cut from $110 (Feb 2026)", thesis: "Best-positioned neocloud. NVIDIA backstop provides floor." },
                { firm: "Macquarie", rating: "Hold", pt: "$90", action: "Cut from $115 (Feb 27, 2026)", thesis: "Backlog impressive but near-term execution risk elevated." },
                { firm: "Deutsche Bank", rating: "Buy", pt: "$88", action: "Cut from $110 (Feb 2026)", thesis: "Structural AI demand winner. Debt manageable given contracted cash flows." },
                { firm: "JPMorgan", rating: "Overweight", pt: "$80", action: "Cut from $98 (Feb 2026)", thesis: "Q4 miss was execution, not demand. $66.8B backlog intact." },
                { firm: "Morgan Stanley", rating: "Equal Weight", pt: "$72", action: "Cut from $88 (Feb 2026)", thesis: "Neutral. FCF negative for years. Execution risk elevated." },
                { firm: "Bernstein", rating: "Underperform", pt: "$56", action: "Initiated (Mar 5, 2026)", thesis: "GPU commodity risk, hyperscaler competition, leverage too high." },
                { firm: "Kerrisdale Capital", rating: "Sell (Short)", pt: "$10", action: "Short report (Sep 2025)", thesis: "\"Debt-fueled GPU rental.\" NVIDIA backstop masks weak demand." },
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
                { agency: "S&P Global", rating: "B+ (Issuer)", outlook: "Positive", points: "Outlook upgraded to Positive (from Stable). Upgrade possible if material weaknesses in internal controls remediated by year-end and FFO/debt exceeds 12%." },
                { agency: "Moody's", rating: "Ba3 (CFR)", outlook: "Stable", points: "Revenue visibility from backlog is strong. Debt/EBITDA elevated but declining. NVIDIA backstop is credit positive." },
                { agency: "Fitch", rating: "BB-", outlook: "Positive", points: "Most favorable view. Positive outlook reflects rapidly scaling revenue and improving credit metrics. Could upgrade if FCF turns positive." },
                { agency: "CreditSights", rating: "Market Perform", outlook: "—", points: "9.25% 2030 notes at ~595 bps Z-spread. 5Y CDS widened from 371 to 773 bps (Sep-Dec 2025). $8.5B Meta DDTL rated A3/A-low — multi-notch above corporate rating." },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC" }}>{row.agency}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>{row.rating}</span>
                  </td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: row.outlook === "Positive" ? "#10B981" : row.outlook === "Negative" ? "#EF4444" : "#94A3B8", fontWeight: 600 }}>{row.outlook}</td>
                  <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 12, maxWidth: 400 }}>{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>Sources: S&P Global Ratings, Moody's Investors Service, Fitch Ratings, CreditSights, Bloomberg Terminal, company filings. Credit ratings as of Mar 2026.</div>
      </div>

      {/* Market Positioning */}
      <div style={s.card}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Market Positioning</div>

        {/* Convertible Arb Impact */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Convertible Arbitrage &amp; Impact on Short Interest</div>
        <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.7 }}>
            CoreWeave has $5.25B+ in convertible notes: $2.25B (Dec 2031, 1.75% coupon, $340M capped call) + $3B new convertible (2032, issued Apr 2026 with $450M greenshoe). Convertible arbitrage funds typically go <span style={{ fontWeight: 700, color: "#F8FAFC" }}>long the convert + short the equity</span> to capture embedded optionality. This mechanical short activity <span style={{ fontWeight: 700, color: "#F59E0B" }}>inflates reported short interest without representing a directional bearish view</span>.
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
            {[
              { label: "Total Converts", value: "$5.25B+", sub: "$2.25B (Dec 2031) + $3B (2032)" },
              { label: "Coupon", value: "1.75%", sub: "Dec 2031 notes. Apr 2026 terms TBD." },
              { label: "Capped Call", value: "$340M", sub: "On Dec 2031 notes. Limits dilution." },
              { label: "Est. Arb Short", value: "~5-8% of SI", sub: "Larger convert base = more arb shorts" },
            ].map((m, i) => (
              <div key={i} style={{ flex: "1 1 140px", minWidth: 140 }}>
                <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>{m.value}</div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{m.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 12, lineHeight: 1.6 }}>
            <span style={{ fontWeight: 700, color: "#F8FAFC" }}>Implication:</span> Of the ~15-16.5% reported short interest, an estimated ~5-8 percentage points may be convertible arb (non-directional) given the larger $5.25B+ convert base. The remaining ~8-11% is likely directional short sellers. May 20 earnings is shaping up as a key battleground between bulls (backlog/growth) and bears (leverage/concentration risk).
          </div>
        </div>

        {/* Insider Selling */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Insider Selling &amp; Buying</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 20 }}>
          <thead>
            <tr>
              {["Insider", "Date", "Action", "Shares", "Price", "Value", "Notes"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { insider: "Michael Intrator (CEO)", date: "Apr 8, 2026", action: "Sell", shares: "62,399", price: "$88-$93", value: "~$5.6M", notes: "10b5-1 plan. Also sold 82,456 shares on Mar 25." },
              { insider: "Brian Venturo (CSO)", date: "Apr 6, 2026", action: "Sell", shares: "1,125,000", price: "~$80-$82", value: "~$91M", notes: "Entities sold via 10b5-1 plan. Largest single insider sale." },
              { insider: "Brannin McBee (CDO)", date: "Apr 6, 2026", action: "Sell", shares: "166,665", price: "$80-$82", value: "~$13.5M", notes: "Class B→A conversion + sale. Pre-arranged 10b5-1." },
              { insider: "Insiders (aggregate)", date: "Last 3 months", action: "Sell only", shares: "—", price: "—", value: "—", notes: "Zero insider buying. All sales under pre-set 10b5-1 plans. Insiders own ~25.5% of total shares." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", fontSize: 11 }}>{row.insider}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.date}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "rgba(239,68,68,0.12)", color: "#EF4444" }}>{row.action}</span>
                </td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.shares}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8" }}>{row.price}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.value}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Top Institutional Owners */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Top Institutional Owners &amp; Changes Since IPO</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, marginBottom: 16 }}>
          <thead>
            <tr>
              {["Holder", "Shares (M)", "% Ownership", "Type", "Change Since IPO", "Notes"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { holder: "Magnetar Financial", shares: "—", pct: "Largest holder", type: "Financial Sponsor", change: "Pre-IPO anchor. Likely reducing via secondary sales.", notes: "Both creditor (DDTL 1.0) and equity holder. Complex incentive alignment." },
              { holder: "NVIDIA Corp", shares: "47.2M", pct: "9.47%", type: "Strategic", change: "Increased — $250M at IPO ($40), then $2B in Jan 2026 ($87.20)", notes: "Supplier + investor + backstop ($6.3B). Deepening commitment." },
              { holder: "Situational Awareness LP", shares: "—", pct: "Top 10", type: "Hedge Fund", change: "New post-IPO.", notes: "Event-driven / fundamental. Name implies catalyst-oriented strategy." },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC" }}>{row.holder}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.shares}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600 }}>{row.pct}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8" }}>{row.type}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 11 }}>{row.change}</td>
                <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Sources: MarketBeat, Fintel, SEC 13F filings (Q4 2025), Investing.com insider transactions, FINRA short interest reports, CoreWeave SEC Form 4 filings, CBOE convertible note data.</div>
      </div>
    </>)}

    </>)}
    </ReviewShell>
  );
}
