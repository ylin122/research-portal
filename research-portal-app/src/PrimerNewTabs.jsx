// PrimerNewTabs1 — Communication Services, Consumer Discretionary, Consumer Staples,
// Financials, Fintech, Industrials, Aerospace & Defense
// Mirrors exact JSX structure from Primer.jsx (IT Services tab pattern)

export default function PrimerNewTabs1({ subTab, toggle, isExp, T_ }) {

  // helper: expand taxonomy cat + subsector (force open, don't toggle closed)
  const forceOpen = (...keys) => { keys.forEach(k => { if (!isExp(k)) toggle(k); }); };

  // ═══════════════════════════════════════════════════════════════════
  // COMMUNICATION SERVICES & TELECOM
  // ═══════════════════════════════════════════════════════════════════
  if (subTab === "comms") {
    const SUBS = {
      wireless: { name: "Wireless Carriers", fullName: "Mobile Network Operators (MNOs)", category: "Network Operators", color: T_.blue,
        tam: "$950B+ (2025, global)", growth: "~3-5% CAGR", icon: "📱",
        desc: "Operators of licensed mobile spectrum providing voice, data, and messaging services to consumers and enterprises. Capital-intensive, oligopolistic market structure in most countries.",
        whatTheySell: "Postpaid and prepaid wireless plans, device financing, mobile hotspot, IoT connectivity, private 5G networks, wholesale MVNO access",
        whoBuys: "Consumers (80% of revenue), enterprises (private networks, IoT), MVNOs (wholesale), government agencies",
        keyPlayers: ["T-Mobile US", "Verizon", "AT&T", "Deutsche Telekom", "Vodafone", "China Mobile", "Reliance Jio", "Bharti Airtel"],
        trends: "5G monetization still elusive for consumers. Fixed wireless access (FWA) as broadband substitute. MVNO growth (Mint, Visible). T-Mobile gaining share post-Sprint merger. Enterprise 5G/private networks as growth vector",
      },
      wireline: { name: "Wireline / Fiber", fullName: "Wireline Telecom & Fiber-to-the-Home (FTTH)", category: "Network Operators", color: T_.green,
        tam: "$280B+ (2025, global)", growth: "~2-4% CAGR", icon: "🔌",
        desc: "Fixed-line telecommunications delivering broadband, voice, and data services over copper and fiber-optic networks. Fiber overbuilds are driving a multi-year investment cycle.",
        whatTheySell: "Fiber broadband (1-10 Gbps), legacy DSL, enterprise Ethernet, MPLS/SD-WAN connectivity, voice (VoIP/POTS), wholesale dark fiber",
        whoBuys: "Residential broadband subscribers, enterprise/SMB for connectivity, hyperscalers leasing dark fiber, other carriers (wholesale)",
        keyPlayers: ["AT&T (fiber)", "Lumen Technologies", "Frontier Fiber", "Altice/Optimum", "Brightspeed", "Consolidated Communications", "BT Group", "Orange"],
        trends: "Massive FTTH build-out ($100B+ US investment). BEAD program funding rural fiber. Legacy copper revenue declining. Fiber net adds accelerating. PE-backed fiber overbuilders (Lumos, Ziply)",
      },
      cable: { name: "Cable / Broadband", fullName: "Cable Operators & Broadband Providers", category: "Network Operators", color: T_.purple,
        tam: "$300B+ (2025, US + Europe)", growth: "~1-3% CAGR", icon: "📺",
        desc: "Operators of hybrid fiber-coax (HFC) networks providing broadband internet, video, and voice services. Broadband is the core profit driver as video declines.",
        whatTheySell: "High-speed internet (DOCSIS 3.1/4.0), video/TV packages, voice, mobile (MVNO), enterprise connectivity, WiFi solutions",
        whoBuys: "Residential households (broadband + video), SMB/enterprise, mobile subscribers via MVNO arrangements",
        keyPlayers: ["Comcast (Xfinity)", "Charter (Spectrum)", "Cox Communications", "Altice USA", "Rogers (Canada)", "Liberty Global (Europe)", "Telenet"],
        trends: "Broadband subscriber losses to FWA and fiber overbuilders. DOCSIS 4.0 upgrade cycle. Video cord-cutting accelerating. Cable MVNO wireless bundles growing. Mid-split/high-split upgrades for more upstream bandwidth",
      },
      towers: { name: "Tower Companies / Infrastructure", fullName: "Wireless Tower & Small Cell Infrastructure", category: "Infrastructure", color: T_.amber,
        tam: "$60B+ (2025, global)", growth: "~5-7% CAGR", icon: "🗼",
        desc: "Owners and operators of wireless tower sites leased to mobile carriers. Toll-booth business model with long-term contracts, built-in escalators, and high recurring revenue.",
        whatTheySell: "Tower leases (macro towers), small cells, rooftop sites, in-building DAS, fiber backhaul, edge computing colocation",
        whoBuys: "Wireless carriers (T-Mobile, Verizon, AT&T are ~75% of US tower revenue), government, enterprise (private networks)",
        keyPlayers: ["American Tower", "Crown Castle", "SBA Communications", "Uniti Group", "Cellnex (Europe)", "Indus Towers (India)", "IHS Towers"],
        trends: "5G densification driving small cell demand. Carrier consolidation risk (fewer tenants). American Tower pivoting to data centers. Crown Castle exploring strategic alternatives. Built-in 3% annual escalators in leases",
      },
      satellite: { name: "Satellite & LEO", fullName: "Satellite Communications & Low Earth Orbit Constellations", category: "Infrastructure", color: "#06B6D4",
        tam: "$30B+ (2025)", growth: "~8-12% CAGR", icon: "🛰️",
        desc: "Satellite-based connectivity serving remote areas, maritime, aviation, government, and defense. LEO constellations (Starlink) are disrupting legacy GEO operators.",
        whatTheySell: "Broadband internet (LEO/GEO), direct-to-device connectivity, maritime/aviation connectivity, government/military SATCOM, IoT backhaul",
        whoBuys: "Rural/remote consumers, airlines, shipping companies, defense/intelligence agencies, enterprise (backup connectivity), IoT deployments",
        keyPlayers: ["SpaceX (Starlink — dominant LEO)", "Viasat", "SES", "Eutelsat (OneWeb)", "Iridium", "Globalstar (Apple partner)", "Amazon (Kuiper — launching)"],
        trends: "Starlink at 9M+ subscribers (late 2025), dominant in LEO. Direct-to-device (D2D) partnerships with carriers. Amazon Kuiper launching 2025-2026. GEO operators consolidating (SES-Intelsat). Government/defense as growth market",
      },
      ucaas: { name: "Unified Communications / CPaaS", fullName: "UCaaS, CCaaS & Communications Platform as a Service", category: "Services & Applications", color: T_.red,
        tam: "$80B+ (2025)", growth: "~12-15% CAGR", icon: "💬",
        desc: "Cloud-based voice, video, messaging, and contact center platforms replacing legacy PBX systems. CPaaS provides programmable communications APIs for developers.",
        whatTheySell: "UCaaS (voice/video/messaging), CCaaS (cloud contact center), CPaaS (SMS/voice/video APIs), SIP trunking, SD-WAN, team collaboration",
        whoBuys: "Enterprise IT/telecom teams, contact center managers, developers (CPaaS), SMBs moving off legacy PBX",
        keyPlayers: ["Microsoft Teams (dominant UCaaS)", "Zoom", "RingCentral", "Twilio (CPaaS)", "Vonage (Ericsson)", "Five9 (CCaaS)", "NICE (CCaaS)", "Genesys", "8x8"],
        trends: "Microsoft Teams dominates UCaaS with 320M+ MAU. AI-powered contact centers (agent assist, summarization). CPaaS embedding comms into apps. CCaaS replacing on-prem Avaya/Cisco. Zoom pivoting to platform",
      },
      media: { name: "Media & Content Networks", fullName: "Media, Broadcasting & Content Delivery", category: "Content & Media", color: "#EC4899",
        tam: "$200B+ (2025, global ad + subscription)", growth: "~4-6% CAGR", icon: "🎬",
        desc: "Companies producing, distributing, and monetizing media content across broadcast, streaming, and digital platforms. Includes traditional TV networks and streaming services.",
        whatTheySell: "Streaming subscriptions, advertising (linear + digital), content licensing, live sports rights, affiliate/retransmission fees",
        whoBuys: "Consumers (streaming subs), advertisers (brands, agencies), pay-TV distributors (affiliate fees), international licensees",
        keyPlayers: ["Netflix", "Disney (Disney+/Hulu/ESPN)", "Comcast (Peacock/NBC)", "Warner Bros Discovery (Max)", "Paramount (Paramount+)", "YouTube (Google)", "Amazon Prime Video"],
        trends: "Streaming profitability becoming the focus (Netflix leads). Ad-supported tiers growing fast. Sports rights inflation. Linear TV declining 8-10% annually. Bundle fatigue driving consolidation. YouTube is the largest 'TV network' by watch time",
      },
    };
    const TAX = [
      { key: "operators", label: "Network Operators", color: T_.blue, icon: "📡", children: ["wireless", "wireline", "cable"] },
      { key: "infra", label: "Infrastructure", color: T_.amber, icon: "🗼", children: ["towers", "satellite"] },
      { key: "services", label: "Services & Applications", color: T_.red, icon: "💬", children: ["ucaas"] },
      { key: "content", label: "Content & Media", color: "#EC4899", icon: "🎬", children: ["media"] },
    ];
    return (
    <div>
      <div style={{ marginBottom: 24 }}><div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>Communication Services & Telecom Primer</div><div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Wireless, broadband, towers, satellite, UCaaS, and media — the connectivity value chain</div></div>
      {/* Value Chain */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Telecom & Media — Value Chain</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Infrastructure underpins network operators, who deliver connectivity to service providers and content platforms, which serve end users. ~$1.8T global industry.</div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          {[
            { label: "Infrastructure", color: T_.amber, icon: "🗼", desc: "Physical assets & spectrum",
              rows: [{ sub: "Towers", ex: "American Tower, Crown Castle, SBA" }, { sub: "Fiber", ex: "Lumen, Zayo, Uniti, Crown Fiber" }, { sub: "Satellite", ex: "SpaceX Starlink, Viasat, SES" }, { sub: "Spectrum", ex: "Licensed by FCC auction" }],
              buyers: "Carriers, ISPs, governments" },
            { label: "Network Operators", color: T_.blue, icon: "📡", desc: "Build & run the networks",
              rows: [{ sub: "Wireless", ex: "T-Mobile, Verizon, AT&T" }, { sub: "Cable", ex: "Comcast, Charter, Cox" }, { sub: "Fiber ISP", ex: "AT&T Fiber, Frontier, Lumen" }],
              buyers: "Consumers, enterprises, MVNOs" },
            { label: "Service Providers", color: T_.green, icon: "💬", desc: "Applications over networks",
              rows: [{ sub: "UCaaS", ex: "Microsoft Teams, Zoom, RingCentral" }, { sub: "CCaaS", ex: "Five9, NICE, Genesys" }, { sub: "CPaaS", ex: "Twilio, Vonage, Bandwidth" }],
              buyers: "Enterprise IT, developers, SMBs" },
            { label: "Content & Apps", color: "#EC4899", icon: "🎬", desc: "Media & streaming",
              rows: [{ sub: "Streaming", ex: "Netflix, Disney+, YouTube" }, { sub: "Broadcast", ex: "NBC, CBS, Fox, ESPN" }, { sub: "Social", ex: "Meta, TikTok, X, Snap" }],
              buyers: "Consumers, advertisers" },
            { label: "End Users", color: "#6366F1", icon: "👥", desc: "Consumers & enterprises",
              rows: [{ sub: "Consumer", ex: "Mobile, broadband, streaming" }, { sub: "Enterprise", ex: "SD-WAN, UCaaS, private 5G" }, { sub: "IoT", ex: "Connected devices, M2M" }],
              buyers: "Every person and organization" },
          ].map((stage, i, arr) => (
            <div key={stage.label} style={{ display: "flex", alignItems: "stretch" }}>
              <div style={{ flex: 1, background: stage.color + "0A", border: `1px solid ${stage.color}33`, borderRadius: 8, padding: "12px 12px", minWidth: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}><span style={{ fontSize: 14 }}>{stage.icon}</span><span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.label}</span></div>
                <div style={{ fontSize: 11, color: T_.textDim, marginBottom: 10 }}>{stage.desc}</div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                  {stage.rows.map(r => (<div key={r.sub} style={{ background: T_.bg, borderRadius: 5, padding: "5px 8px" }}><div style={{ fontSize: 11, fontWeight: 600, color: stage.color }}>{r.sub}</div><div style={{ fontSize: 10, color: T_.textDim, lineHeight: 1.4 }}>{r.ex}</div></div>))}
                </div>
                <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8, borderTop: `1px solid ${T_.borderLight}`, paddingTop: 5 }}><span style={{ fontWeight: 600 }}>Buyers:</span> {stage.buyers}</div>
              </div>
              {i < arr.length - 1 && <div style={{ display: "flex", alignItems: "center", padding: "0 4px", color: T_.textGhost, fontSize: 16, flexShrink: 0 }}>&#8594;</div>}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>Infrastructure owners lease capacity to network operators, who deliver connectivity that service providers and content platforms ride on top of to reach end users. Towers and fiber are the 'toll roads' of telecom.</div>
      </div>
      {/* Taxonomy */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Telecom & Media Taxonomy</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Click to expand</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {TAX.map(cat => (
            <div key={cat.key}>
              <div onClick={() => toggle("comtax_" + cat.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: isExp("comtax_" + cat.key) ? cat.color + "22" : T_.bg, borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("comtax_" + cat.key) ? cat.color + "44" : T_.border}` }}>
                <span style={{ fontSize: 16 }}>{cat.icon}</span><span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsector{cat.children.length > 1 ? "s" : ""}</span>
                <span style={{ fontSize: 12, color: T_.textGhost, transform: isExp("comtax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span>
              </div>
              {isExp("comtax_" + cat.key) && <div style={{ marginLeft: 32, marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>{cat.children.map(ck => { const sub = SUBS[ck]; if (!sub) return null; return (
                <div key={ck} onClick={() => toggle("comsub_" + ck)} style={{ padding: "10px 16px", background: isExp("comsub_" + ck) ? T_.bgInput : T_.bg, borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span><span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span><span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span><span style={{ fontSize: 13, color: T_.textGhost, transform: isExp("comsub_" + ck) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span></div>
                  {isExp("comsub_" + ck) && <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T_.borderLight}` }} onClick={e => e.stopPropagation()}>
                    <div style={{ fontSize: 13, color: T_.textMid, marginBottom: 8, lineHeight: 1.5 }}>{sub.desc}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>What They Sell</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whatTheySell}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Who Buys</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whoBuys}</div></div></div>
                    <div style={{ marginBottom: 8 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Players</div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{sub.keyPlayers.map(p => <span key={p} style={{ fontSize: 12, padding: "3px 10px", background: cat.color + "22", color: cat.color, borderRadius: 10, border: `1px solid ${cat.color}44` }}>{p}</span>)}</div></div>
                    <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Trends</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.5 }}>{sub.trends}</div></div>
                  </div>}
                </div>); })}</div>}
            </div>
          ))}
        </div>
      </div>
      {/* Subsector TAM Cards */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Subsector Overview — TAM & Growth</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
          {Object.entries(SUBS).map(([key, sub]) => (
            <div key={key} style={{ padding: "12px 14px", background: T_.bg, borderRadius: 8, border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer" }} onClick={() => { const cat = TAX.find(t => t.children.includes(key)); if (cat) forceOpen("comtax_" + cat.key, "comsub_" + key); }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.name}</span></div>
              <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 6 }}>{sub.category}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>TAM</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.tam}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>Growth</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.green }}>{sub.growth}</div></div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Revenue Models */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Telecom Revenue Models</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How telecom and media companies generate revenue. The industry spans from infrastructure leasing (highest quality) to advertising (most cyclical).</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { name: "Subscription (Postpaid Wireless & Broadband)", color: T_.blue, icon: "🔄",
              how: "Customers pay a fixed monthly fee for wireless or broadband service. Postpaid wireless includes device installment plans. Broadband priced by speed tier. Multi-year implicit relationships with low voluntary churn",
              economics: "Wireless ARPU: $48-55/mo (US postpaid). Broadband ARPU: $60-80/mo. Churn: 0.8-1.2% monthly for wireless, lower for broadband. Gross margins: 55-65%. Massive fixed-cost networks mean incremental subscribers are highly profitable",
              examples: "T-Mobile postpaid ($55 ARPU), Verizon wireless, Comcast Xfinity Internet ($85+ ARPU), AT&T Fiber",
              valuation: "6-8x EBITDA for wireless carriers. Broadband-heavy cable at 7-9x. Market rewards subscriber growth, low churn, and ARPU expansion. T-Mobile trades at premium due to growth",
              transition: "Mature model with pricing power limited by competition. Growth comes from ARPU expansion (premium tiers, add-ons) rather than net new subscribers in developed markets. Converged bundles (wireless + broadband) increasing" },
            { name: "Usage-Based (Metered Data & Overage)", color: T_.green, icon: "📊",
              how: "Revenue scales with consumption — per GB of data, per minute of voice, per message sent. Common in prepaid wireless, international roaming, enterprise metered circuits, and CPaaS (per API call)",
              economics: "Highly variable margins depending on segment. CPaaS: 45-55% gross margin on per-message/call pricing. Prepaid wireless: lower ARPU ($25-35) but minimal acquisition cost. Enterprise metered: negotiated rates",
              examples: "Twilio (per SMS/voice API call), prepaid wireless (T-Mobile Prepaid, Tracfone), international roaming charges, enterprise metered bandwidth",
              valuation: "CPaaS companies valued on revenue growth and net expansion. Twilio at 2-3x revenue. Prepaid wireless valued at discount to postpaid due to higher churn and lower ARPU",
              transition: "Declining in consumer wireless (unlimited plans won). Growing in CPaaS/API economy. Enterprise metered circuits being replaced by SD-WAN flat-rate pricing" },
            { name: "Wholesale (Carrier-to-Carrier)", color: "#0EA5E9", icon: "🔗",
              how: "Carriers sell network capacity to other carriers, MVNOs, and enterprises at wholesale rates. Includes backhaul, transit, wavelengths, dark fiber leases, and MVNO access. Long-term contracts (3-10+ years)",
              economics: "Gross margins: 60-75% (leveraging existing network). Revenue is recurring and contractual. Wholesale rates are lower per unit but high volume. Dark fiber leases are essentially real estate — very high margin once lit",
              examples: "Lumen enterprise/wholesale fiber, Zayo dark fiber leases, T-Mobile MVNO wholesale (Mint Mobile, Google Fi), Crown Castle fiber",
              valuation: "Wholesale fiber assets valued at 10-14x EBITDA. MVNO wholesale is lower margin but provides network utilization. Dark fiber increasingly valued as AI/data center demand surges",
              transition: "AI data center buildout driving massive demand for dark fiber and long-haul capacity. Hyperscalers are the fastest-growing wholesale customers. Fiber-rich carriers (Lumen, Zayo) being revalued" },
            { name: "Advertising (Media & Digital)", color: "#EC4899", icon: "📣",
              how: "Revenue from selling ad inventory across linear TV, streaming, digital, and social platforms. Priced on CPM (cost per thousand impressions), CPC (cost per click), or CPA (cost per action). Programmatic buying dominates digital",
              economics: "Gross margins: 40-70% depending on content costs. Linear TV ad revenue declining 5-8% annually. Streaming ad tiers growing 20%+. Revenue is cyclical — tied to economic conditions and advertiser budgets",
              examples: "YouTube ($35B+ annual ad revenue), Netflix ad tier, Disney+/Hulu advertising, Comcast/NBC linear + Peacock ads, Meta (social), The Trade Desk (programmatic)",
              valuation: "Digital ad platforms at 8-15x revenue. Legacy linear TV assets at 5-7x EBITDA and declining. Market rewards digital scale and targeting capability. Connected TV (CTV) ads command premium CPMs",
              transition: "Massive shift from linear to digital/CTV. Streaming ad tiers (Netflix, Disney+) creating new inventory. Retail media networks growing. AI-personalized ad targeting. Linear TV ad spend declining irreversibly" },
            { name: "Infrastructure Leasing (Towers & Fiber)", color: T_.amber, icon: "🗼",
              how: "Tower companies own physical sites and lease antenna space to wireless carriers under long-term contracts (5-10 year initial terms with 5-year renewals). Built-in annual rent escalators of 3%. Multiple tenants per tower share fixed costs",
              economics: "Gross margins: 70-80%. Tower tenancy: each additional tenant on a tower is ~80% incremental margin (fixed costs already covered). Average US tower has 2-3 tenants. Churn is <2% annually. AFFO margins: 50-60%",
              examples: "American Tower (~150K global towers, post-India divestiture), Crown Castle (40K US towers + fiber), SBA Communications (39K towers), Cellnex (115K European towers)",
              valuation: "Tower REITs trade at 20-25x AFFO. Premium for US exposure, co-location potential, and 5G densification runway. Among the highest-quality recurring revenue models in any sector",
              transition: "5G densification requires more small cells and tower amendments. Carriers unlikely to build own towers (CapEx discipline). Risk: carrier consolidation reduces tenant count. Opportunity: edge computing colocation on tower sites" },
          ].map((model, i) => (
            <div key={i} style={{ background: T_.bg, borderRadius: 10, border: `1px solid ${model.color}33`, borderLeft: `4px solid ${model.color}`, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><span style={{ fontSize: 20 }}>{model.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: model.color }}>{model.name}</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>How It Works</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.how}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Unit Economics</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.economics}</div></div></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Examples</div><div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{model.examples}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Valuation Impact</div><div style={{ fontSize: 13, color: T_.green, lineHeight: 1.6 }}>{model.valuation}</div></div></div>
              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Transition Dynamics</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{model.transition}</div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Key Concepts */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { title: "ARPU (Average Revenue Per User)", desc: "The single most important metric in telecom. Wireless postpaid ARPU in the US is $48-55/mo. Broadband ARPU is $60-80/mo. Investors focus on ARPU trends — expansion signals pricing power, compression signals competitive pressure." },
            { title: "Churn", desc: "Monthly percentage of subscribers who leave. Wireless postpaid churn: 0.8-1.2%. Broadband churn: 1.2-1.8%. A 0.1% improvement in monthly churn compounds to millions in retained revenue annually. The lowest-churn operators (T-Mobile, fiber ISPs) command premium valuations." },
            { title: "Spectrum & Licensing", desc: "Wireless spectrum is a finite, government-licensed resource. Carriers spend $10-100B+ at FCC auctions. Low-band (600-900 MHz) for coverage, mid-band (2.5-3.7 GHz) for 5G capacity, mmWave (24-40 GHz) for dense urban. Spectrum holdings are a key competitive moat." },
            { title: "Net Adds", desc: "New subscribers added minus subscribers lost in a period. The primary growth metric for carriers and broadband providers. Postpaid phone net adds are the highest quality. T-Mobile has led US wireless net adds since the Sprint merger." },
            { title: "CapEx Intensity", desc: "Capital expenditure as % of revenue. Wireless carriers: 12-18%. Cable operators: 10-15%. Fiber overbuilders: 25-40% during build phase. High CapEx intensity limits free cash flow but builds durable assets. The investment cycle is shifting from 5G to fiber to AI-related infrastructure." },
            { title: "Tower Economics", desc: "A tower costs $250-350K to build. First tenant covers costs at ~$24K/yr lease. Each incremental tenant adds ~$20K/yr at ~80% incremental margin. A 3-tenant tower generates ~$64K/yr revenue at ~75% margin. Built-in 3% annual escalators compound over 10-20 year contracts." },
          ].map((c, i) => (
            <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>);
  }

  // ═══════════════════════════════════════════════════════════════════
  // CONSUMER DISCRETIONARY
  // ═══════════════════════════════════════════════════════════════════
  if (subTab === "consumerdisc") {
    const SUBS = {
      apparel: { name: "Apparel & Luxury", fullName: "Apparel, Footwear & Luxury Goods", category: "Brands & Fashion", color: "#EC4899",
        tam: "$350B+ (2025, US)", growth: "~3-5% CAGR", icon: "👗",
        desc: "Branded clothing, footwear, accessories, and luxury goods spanning mass-market to ultra-luxury. Brand equity and desirability are the primary moats.",
        whatTheySell: "Apparel, footwear, handbags, accessories, jewelry, watches, cosmetics (luxury). Sold via owned retail, wholesale, and DTC e-commerce",
        whoBuys: "Consumers across income levels. Luxury skews high-income/aspirational. Mass-market driven by fashion trends and value. Gen Z and millennials drive growth in athletic/streetwear",
        keyPlayers: ["LVMH", "Nike", "Hermès", "Kering (Gucci)", "Inditex (Zara)", "TJX Companies", "Lululemon", "Tapestry (Coach)", "Ralph Lauren", "VF Corp"],
        trends: "Luxury resilient despite macro concerns. Athletic/athleisure still growing. DTC shift (Nike pulled back from wholesale). Off-price (TJX, Ross) gaining share. Resale market growing 15%+. China luxury demand volatile",
      },
      auto: { name: "Automotive", fullName: "Automotive OEMs & Dealers", category: "Automotive", color: T_.blue,
        tam: "$2.5T+ (2025, global)", growth: "~3-4% CAGR", icon: "🚗",
        desc: "Vehicle manufacturers (OEMs), auto dealers, and the broader automotive ecosystem including parts, financing, and aftermarket services.",
        whatTheySell: "New vehicles (ICE, hybrid, EV), used vehicles, parts and accessories, financing/leasing, service and maintenance, fleet management",
        whoBuys: "Consumers, commercial fleets, rental companies, government. US sells ~16M new vehicles/year. China ~25M. Global ~85M",
        keyPlayers: ["Toyota", "Volkswagen Group", "GM", "Ford", "Stellantis", "BYD", "Tesla", "Hyundai/Kia", "BMW", "AutoNation", "Penske Auto", "Lithia Motors"],
        trends: "EV adoption slowing vs expectations (hybrids surging). Chinese OEMs (BYD) gaining global share. Software-defined vehicles. Dealer consolidation. Used car market normalized post-COVID. Average new vehicle price ~$48K",
      },
      homebuilders: { name: "Homebuilders & Home Improvement", fullName: "Homebuilders, Building Products & Home Improvement Retail", category: "Housing", color: T_.green,
        tam: "$600B+ (2025, US new construction + remodel)", growth: "~3-6% CAGR", icon: "🏠",
        desc: "Companies that build new homes, manufacture building products, or sell home improvement materials and services. Highly cyclical, tied to interest rates and housing starts.",
        whatTheySell: "New single-family and multi-family homes, building products (roofing, insulation, windows), home improvement retail, renovation services",
        whoBuys: "Homebuyers (first-time and move-up), landlords/investors, contractors, DIY homeowners",
        keyPlayers: ["D.R. Horton", "Lennar", "NVR", "PulteGroup", "Home Depot", "Lowe's", "Masco", "Fortune Brands (Moen)", "Builders FirstSource"],
        trends: "Structural housing underbuilt by 3-5M units in US. High rates locked in existing homeowners (rate lock-in effect). Builders buying down mortgage rates. Home Depot/Lowe's pro business growing. Aging housing stock driving repair/remodel",
      },
      restaurants: { name: "Restaurants & Food Service", fullName: "Restaurants, QSR & Food Service", category: "Food & Dining", color: T_.amber,
        tam: "$1T+ (2025, US)", growth: "~4-6% CAGR", icon: "🍔",
        desc: "Quick-service (QSR), fast-casual, casual dining, and fine dining restaurants. Franchise-heavy model dominates QSR. Delivery and digital ordering transforming the industry.",
        whatTheySell: "Food and beverages (dine-in, takeout, delivery), franchise licenses and royalties, catering, branded consumer products (CPG crossover)",
        whoBuys: "Consumers (eating out ~55% of food spend in US). Franchisees (buy franchise rights). Business catering and events",
        keyPlayers: ["McDonald's", "Starbucks", "Chick-fil-A", "Chipotle", "Yum! Brands (Taco Bell, KFC, Pizza Hut)", "Restaurant Brands (Burger King, Tim Hortons)", "Darden (Olive Garden)", "Wingstop"],
        trends: "Value wars intensifying (consumers trading down). Digital ordering now 35-40% of sales. Delivery via DoorDash/Uber Eats. QSR outperforming casual dining. Labor costs rising. Menu price inflation moderating. Drive-thru innovation",
      },
      travel: { name: "Travel & Leisure", fullName: "Hotels, Cruise Lines, OTAs & Leisure", category: "Travel", color: T_.purple,
        tam: "$800B+ (2025, US travel)", growth: "~5-8% CAGR", icon: "✈️",
        desc: "Hotels, cruise lines, online travel agencies (OTAs), theme parks, and leisure experiences. Asset-light franchise models dominate lodging. Strong post-COVID recovery.",
        whatTheySell: "Hotel rooms (managed/franchised), cruise berths, flight/hotel bookings (OTAs), theme park admissions, vacation rentals, travel insurance",
        whoBuys: "Leisure travelers, business travelers, families, group/convention. High-income consumers driving premiumization",
        keyPlayers: ["Marriott", "Hilton", "Airbnb", "Booking Holdings", "Expedia", "Royal Caribbean", "Carnival", "Disney Parks", "IHG", "Hyatt"],
        trends: "Experiences over things (secular tailwind). Asset-light hotel models dominant (Marriott/Hilton 98%+ franchised). Loyalty programs as profit centers. Cruise demand exceeding pre-COVID. Business travel recovered ~85%. OTA vs direct booking tension",
      },
      specialty: { name: "Retail (Specialty)", fullName: "Specialty Retail & Department Stores", category: "Retail", color: T_.red,
        tam: "$500B+ (2025, US specialty retail)", growth: "~2-4% CAGR", icon: "🛍️",
        desc: "Focused retail concepts in specific categories — electronics, pet, auto parts, sporting goods, beauty. Winners have strong category expertise and omnichannel capabilities.",
        whatTheySell: "Category-specific merchandise (electronics, pet supplies, auto parts, sporting goods, beauty), services (Geek Squad, grooming), loyalty programs",
        whoBuys: "Consumers shopping for specific categories. Pros/enthusiasts (auto parts stores serve DIY and DIFM mechanics)",
        keyPlayers: ["Best Buy", "Chewy", "PetSmart", "AutoZone", "O'Reilly Auto", "Dick's Sporting Goods", "Ulta Beauty", "Five Below", "Bath & Body Works"],
        trends: "Auto parts resilient (aging fleet, DIY + DIFM). Pet humanization secular trend (premiumization). Beauty outperforming apparel. Electronics facing cyclical headwinds. Off-price and value retail gaining share",
      },
      ecommerce: { name: "E-Commerce & DTC", fullName: "E-Commerce Platforms & Direct-to-Consumer Brands", category: "Digital Commerce", color: "#0EA5E9",
        tam: "$1.1T+ (2025, US e-commerce)", growth: "~8-12% CAGR", icon: "🛒",
        desc: "Online retail platforms, marketplace operators, and DTC brands selling directly to consumers. E-commerce ~22% of US retail (2025), still growing share.",
        whatTheySell: "Online marketplaces (3P seller platforms), DTC branded goods, fulfillment services, advertising on e-commerce platforms, subscription boxes",
        whoBuys: "Consumers (convenience-driven). Third-party sellers (marketplace access). Advertisers (retail media). Businesses (B2B e-commerce)",
        keyPlayers: ["Amazon (dominant ~38% US e-commerce share)", "Shopify (platform for DTC)", "Walmart.com", "eBay", "Etsy", "Temu", "Shein", "MercadoLibre (LATAM)"],
        trends: "Amazon still gaining share. Retail media (Amazon Ads $50B+) is fastest-growing revenue line. Temu/Shein disrupting with ultra-low-cost. Social commerce growing (TikTok Shop). Same-day delivery becoming standard. Shopify powering millions of DTC brands",
      },
    };
    const TAX = [
      { key: "brands", label: "Brands & Fashion", color: "#EC4899", icon: "👗", children: ["apparel"] },
      { key: "auto", label: "Automotive", color: T_.blue, icon: "🚗", children: ["auto"] },
      { key: "housing", label: "Housing", color: T_.green, icon: "🏠", children: ["homebuilders"] },
      { key: "food", label: "Food & Dining", color: T_.amber, icon: "🍔", children: ["restaurants"] },
      { key: "travel", label: "Travel", color: T_.purple, icon: "✈️", children: ["travel"] },
      { key: "retail", label: "Retail & E-Commerce", color: T_.red, icon: "🛍️", children: ["specialty", "ecommerce"] },
    ];
    return (
    <div>
      <div style={{ marginBottom: 24 }}><div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>Consumer Discretionary Primer</div><div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Apparel, auto, housing, restaurants, travel, and retail — spending on wants, not needs</div></div>
      {/* Value Chain */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Consumer Discretionary — Value Chain</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>From raw materials through brands and distribution to the end consumer. Each stage adds margin and brand value.</div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          {[
            { label: "Raw Materials / Mfg", color: T_.textGhost, icon: "🏭", desc: "Sourcing & production",
              rows: [{ sub: "Textiles", ex: "Cotton, synthetics, leather" }, { sub: "Auto Parts", ex: "Steel, aluminum, batteries" }, { sub: "Building Materials", ex: "Lumber, cement, glass" }, { sub: "Food Supply", ex: "Proteins, produce, grains" }],
              buyers: "Brands, OEMs, builders" },
            { label: "Brands / Design", color: "#EC4899", icon: "✨", desc: "Create desirability & IP",
              rows: [{ sub: "Luxury / Apparel", ex: "LVMH, Nike, Lululemon" }, { sub: "Auto OEM", ex: "Toyota, GM, Tesla, BYD" }, { sub: "Restaurant Brands", ex: "McDonald's, Starbucks, Chipotle" }, { sub: "Homebuilders", ex: "D.R. Horton, Lennar, NVR" }],
              buyers: "Distributors, retailers, consumers" },
            { label: "Distribution / Retail", color: T_.green, icon: "🏪", desc: "Get products to market",
              rows: [{ sub: "Physical Retail", ex: "Home Depot, Best Buy, Ulta" }, { sub: "Auto Dealers", ex: "AutoNation, Penske, Lithia" }, { sub: "E-Commerce", ex: "Amazon, Shopify, DTC sites" }, { sub: "Franchise Ops", ex: "McDonald's franchisees" }],
              buyers: "End consumers" },
            { label: "Consumer", color: "#6366F1", icon: "👥", desc: "End buyer / spender",
              rows: [{ sub: "Mass Market", ex: "Value / mid-tier consumers" }, { sub: "Affluent", ex: "Premium & luxury buyers" }, { sub: "Experience", ex: "Travel, dining, events" }, { sub: "Digital", ex: "E-commerce, DTC, mobile" }],
              buyers: "Spending driven by income, confidence, credit" },
          ].map((stage, i, arr) => (
            <div key={stage.label} style={{ display: "flex", alignItems: "stretch" }}>
              <div style={{ flex: 1, background: stage.color + "0A", border: `1px solid ${stage.color}33`, borderRadius: 8, padding: "12px 12px", minWidth: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}><span style={{ fontSize: 14 }}>{stage.icon}</span><span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.label}</span></div>
                <div style={{ fontSize: 11, color: T_.textDim, marginBottom: 10 }}>{stage.desc}</div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                  {stage.rows.map(r => (<div key={r.sub} style={{ background: T_.bg, borderRadius: 5, padding: "5px 8px" }}><div style={{ fontSize: 11, fontWeight: 600, color: stage.color }}>{r.sub}</div><div style={{ fontSize: 10, color: T_.textDim, lineHeight: 1.4 }}>{r.ex}</div></div>))}
                </div>
                <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8, borderTop: `1px solid ${T_.borderLight}`, paddingTop: 5 }}><span style={{ fontWeight: 600 }}>Buyers:</span> {stage.buyers}</div>
              </div>
              {i < arr.length - 1 && <div style={{ display: "flex", alignItems: "center", padding: "0 4px", color: T_.textGhost, fontSize: 16, flexShrink: 0 }}>&#8594;</div>}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>Consumer discretionary spending is the most cyclical sector — closely tied to employment, wages, consumer confidence, and interest rates. When the economy weakens, consumers cut discretionary before staples.</div>
      </div>
      {/* Taxonomy */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Consumer Discretionary Taxonomy</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Click to expand</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {TAX.map(cat => (
            <div key={cat.key}>
              <div onClick={() => toggle("cdtax_" + cat.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: isExp("cdtax_" + cat.key) ? cat.color + "22" : T_.bg, borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("cdtax_" + cat.key) ? cat.color + "44" : T_.border}` }}>
                <span style={{ fontSize: 16 }}>{cat.icon}</span><span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsector{cat.children.length > 1 ? "s" : ""}</span>
                <span style={{ fontSize: 12, color: T_.textGhost, transform: isExp("cdtax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span>
              </div>
              {isExp("cdtax_" + cat.key) && <div style={{ marginLeft: 32, marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>{cat.children.map(ck => { const sub = SUBS[ck]; if (!sub) return null; return (
                <div key={ck} onClick={() => toggle("cdsub_" + ck)} style={{ padding: "10px 16px", background: isExp("cdsub_" + ck) ? T_.bgInput : T_.bg, borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span><span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span><span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span><span style={{ fontSize: 13, color: T_.textGhost, transform: isExp("cdsub_" + ck) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span></div>
                  {isExp("cdsub_" + ck) && <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T_.borderLight}` }} onClick={e => e.stopPropagation()}>
                    <div style={{ fontSize: 13, color: T_.textMid, marginBottom: 8, lineHeight: 1.5 }}>{sub.desc}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>What They Sell</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whatTheySell}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Who Buys</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whoBuys}</div></div></div>
                    <div style={{ marginBottom: 8 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Players</div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{sub.keyPlayers.map(p => <span key={p} style={{ fontSize: 12, padding: "3px 10px", background: cat.color + "22", color: cat.color, borderRadius: 10, border: `1px solid ${cat.color}44` }}>{p}</span>)}</div></div>
                    <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Trends</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.5 }}>{sub.trends}</div></div>
                  </div>}
                </div>); })}</div>}
            </div>
          ))}
        </div>
      </div>
      {/* Subsector TAM Cards */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Subsector Overview — TAM & Growth</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
          {Object.entries(SUBS).map(([key, sub]) => (
            <div key={key} style={{ padding: "12px 14px", background: T_.bg, borderRadius: 8, border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer" }} onClick={() => { const cat = TAX.find(t => t.children.includes(key)); if (cat) forceOpen("cdtax_" + cat.key, "cdsub_" + key); }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.name}</span></div>
              <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 6 }}>{sub.category}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>TAM</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.tam}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>Growth</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.green }}>{sub.growth}</div></div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Revenue Models */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Consumer Discretionary Revenue Models</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How consumer discretionary companies make money. Brand strength and distribution are the key differentiators.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { name: "Retail / DTC Sales", color: "#EC4899", icon: "🛍️",
              how: "Brands sell directly to consumers through owned stores, e-commerce, or wholesale to third-party retailers. Revenue recognized at point of sale. Owned retail provides higher margins but requires capital; wholesale provides reach but lower margins",
              economics: "Gross margins: 50-70% (luxury/branded) to 25-35% (mass retail). DTC gross margins typically 10-20pts higher than wholesale. Four-wall store margins: 20-35% for well-run concepts. E-commerce margins improving but still below store margins due to shipping/returns",
              examples: "Nike DTC (now ~45% of revenue), Lululemon (95%+ DTC), LVMH boutiques, Home Depot/Lowe's retail, TJX off-price stores",
              valuation: "Branded DTC at 3-8x revenue. Traditional retail at 0.5-2x revenue or 6-12x EBITDA. Market rewards brands with pricing power, high DTC mix, and strong same-store sales growth. Off-price retailers (TJX) command premium multiples",
              transition: "Shift from wholesale-dependent to DTC. Nike pulled back from wholesale, then partially reversed. Pure DTC brands struggling with CAC (acquisition costs). Omnichannel (stores + online) emerging as the winning model" },
            { name: "Franchise Model", color: T_.amber, icon: "🏪",
              how: "Franchisor licenses its brand, systems, and supply chain to independent operators (franchisees). Revenue from initial franchise fees plus ongoing royalties (4-6% of sales). Franchisor owns the brand; franchisee owns the operation and bears most capital costs",
              economics: "Royalty revenue is nearly 100% margin. Franchise systems have 80-90% gross margins. Capital-light — franchisees fund unit growth. McDonald's: 95% franchised, ~$25B system-wide sales generates ~$14B franchisor revenue at 65%+ operating margin",
              examples: "McDonald's (95% franchised), Marriott/Hilton (98%+ franchised), Yum! Brands, Restaurant Brands International, Wingstop (98% franchised), Planet Fitness",
              valuation: "20-30x EBITDA for high-quality franchisors. Among the highest multiples in consumer. Market rewards the capital-light, high-margin, royalty-based model. Wingstop at 50x+ EBITDA due to unit growth and digital mix",
              transition: "Most asset-heavy operators are moving to franchise/asset-light models. Hilton and Marriott completed this transition in hotels. Restaurant chains refranchising. The trade-off: franchise revenue is lower nominal revenue but far higher quality" },
            { name: "Subscription / Membership", color: T_.green, icon: "🔄",
              how: "Customers pay recurring fees for access to products, services, or experiences. Includes gym memberships, warehouse clubs, subscription boxes, loyalty programs with paid tiers. Revenue recognized ratably",
              economics: "Retention rates: 70-90% annually depending on category. Costco membership renewal: 93%. Amazon Prime: 97%+ estimated. Membership fees often near-100% margin that subsidize low-margin product sales",
              examples: "Costco ($65-130 annual membership), Amazon Prime ($139/yr), Planet Fitness ($15-25/mo), Stitch Fix (styling subscription), Peloton (content subscription)",
              valuation: "Premium for high-retention subscription models. Costco at 35-45x P/E (membership fee stability). Planet Fitness at 25-30x EBITDA. Market penalizes subscription businesses with high churn (Peloton, Stitch Fix)",
              transition: "Every consumer company wants a subscription component. Retailers adding membership tiers (Walmart+). Restaurants launching subscription offers (Panera Unlimited Sip). Auto companies exploring subscription features (BMW heated seats controversy)" },
            { name: "Marketplace / Platform", color: "#0EA5E9", icon: "🌐",
              how: "Platforms connect buyers and sellers, taking a commission or enabling advertising. Revenue from seller fees, fulfillment services, and advertising. Two-sided network effects create winner-take-most dynamics",
              economics: "Take rates: 8-15% (Amazon 3P) to 20-30% (Etsy, Airbnb). Advertising is highest-margin revenue stream ($50B+ for Amazon). Marketplace gross margins: 60-80%. Fulfillment is lower margin but drives seller adoption",
              examples: "Amazon Marketplace (60%+ of Amazon units are 3P), Airbnb (16-20% take rate), Etsy (~19% take rate), eBay, Booking.com, DoorDash/Uber Eats",
              valuation: "8-15x revenue for high-growth marketplaces. Amazon 3P + ads business valued at premium. Airbnb at 8-10x revenue. Market rewards GMV growth, take rate stability, and advertising monetization",
              transition: "Marketplaces dominating vs. single-brand e-commerce. Amazon captures ~38% of US e-commerce. Social commerce (TikTok Shop) emerging as new channel. Retail media networks turning marketplaces into ad platforms" },
          ].map((model, i) => (
            <div key={i} style={{ background: T_.bg, borderRadius: 10, border: `1px solid ${model.color}33`, borderLeft: `4px solid ${model.color}`, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><span style={{ fontSize: 20 }}>{model.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: model.color }}>{model.name}</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>How It Works</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.how}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Unit Economics</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.economics}</div></div></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Examples</div><div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{model.examples}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Valuation Impact</div><div style={{ fontSize: 13, color: T_.green, lineHeight: 1.6 }}>{model.valuation}</div></div></div>
              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Transition Dynamics</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{model.transition}</div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Key Concepts */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { title: "Same-Store Sales (Comps)", desc: "Revenue growth at stores open 12+ months — the most important metric in retail and restaurants. Strips out new unit openings to show organic growth. Comps above 3-5% signal strong demand. Negative comps trigger valuation compression rapidly." },
            { title: "Inventory Turns", desc: "How many times a company sells through its inventory per year. Fast fashion (Zara): 10-12x. Luxury (Hermès): 2-3x. Auto dealers: 8-12x. Higher turns mean less markdown risk and better working capital. Excess inventory is the #1 margin destroyer in retail." },
            { title: "Consumer Confidence", desc: "Conference Board Consumer Confidence Index measures willingness to spend. Discretionary spending correlates strongly with employment, wage growth, and stock/home prices. Above 100 = optimistic. Below 80 = recessionary. The most macro-sensitive sector." },
            { title: "Brand Equity", desc: "The intangible value of a brand that allows premium pricing. Hermès sells a leather bag for $10K+ at 70%+ margins. A no-name bag costs $50. Brand equity enables pricing power, customer loyalty, and lower marketing costs. It's the moat." },
            { title: "Omnichannel", desc: "Integrating physical stores, e-commerce, mobile, and social into a seamless shopping experience. Buy online pick up in store (BOPIS), ship-from-store, endless aisle. Retailers with strong omnichannel (Home Depot, Best Buy) outperform pure e-commerce and pure brick-and-mortar." },
          ].map((c, i) => (
            <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>);
  }

  // ═══════════════════════════════════════════════════════════════════
  // CONSUMER STAPLES
  // ═══════════════════════════════════════════════════════════════════
  if (subTab === "consumerstaples") {
    const SUBS = {
      food: { name: "Packaged Food & Beverage", fullName: "Packaged Food, Snacks & Beverages", category: "Branded CPG", color: T_.amber,
        tam: "$900B+ (2025, US)", growth: "~3-5% CAGR", icon: "🥤",
        desc: "Branded food and beverage products sold through retail channels. Stable demand regardless of economic cycle. Growth driven by pricing power, innovation, and emerging market expansion.",
        whatTheySell: "Snacks, cereals, condiments, frozen meals, beverages (soft drinks, water, juice, sports drinks), dairy, confectionery, pet food",
        whoBuys: "Every consumer — purchased through grocery, mass retail (Walmart), convenience, and online. Grocery retailers are the primary distribution channel",
        keyPlayers: ["Nestlé", "PepsiCo", "Coca-Cola", "Mondelēz", "General Mills", "Kraft Heinz", "Kellanova (Mars acquired)", "Conagra", "Campbell's (Sovos)"],
        trends: "Pricing fatigue (consumers trading down after 2022-2024 inflation). GLP-1/weight loss drugs impacting snack volume. Private label gaining share. Better-for-you and functional beverages growing. Energy drinks still outperforming (Celsius, Monster)",
      },
      household: { name: "Household & Personal Care", fullName: "Household Products & Personal Care", category: "Branded CPG", color: T_.blue,
        tam: "$250B+ (2025, US)", growth: "~3-5% CAGR", icon: "🧴",
        desc: "Cleaning products, laundry, personal hygiene, skincare, and beauty products. Highly defensive — consumers maintain spending on essentials even in recessions.",
        whatTheySell: "Laundry detergent, cleaning supplies, diapers, paper products, shampoo/conditioner, skincare, oral care, deodorant, feminine care",
        whoBuys: "Every household. Purchased through grocery, mass, drug, dollar stores, and online. Brand loyalty varies — some categories highly brand-loyal (oral care) vs. price-sensitive (paper products)",
        keyPlayers: ["Procter & Gamble", "Unilever", "Colgate-Palmolive", "Church & Dwight", "Henkel", "Reckitt", "Kimberly-Clark", "Estée Lauder", "L'Oréal"],
        trends: "Premiumization in skincare/beauty. P&G dominating through innovation and marketing. Sustainability/refill models. DTC beauty brands gaining share online. Private label gaining in commoditized categories (paper, cleaning)",
      },
      tobacco: { name: "Tobacco & Alcohol", fullName: "Tobacco, Alcohol & Cannabis", category: "Sin Stocks", color: T_.red,
        tam: "$350B+ (2025, US tobacco + alcohol)", growth: "~1-3% CAGR (volume decline, price growth)", icon: "🍷",
        desc: "Cigarettes, reduced-risk products (vaping, heated tobacco, nicotine pouches), beer, wine, spirits, and legal cannabis. Volume declining in tobacco; premiumization in alcohol.",
        whatTheySell: "Cigarettes, heated tobacco (IQOS), nicotine pouches (Zyn), vaping, beer, wine, spirits, hard seltzer, cannabis products",
        whoBuys: "Adult consumers. Tobacco is highly addictive with inelastic demand (price increases pass through). Alcohol skews social/experiential. Cannabis still state-regulated in US",
        keyPlayers: ["Philip Morris International (IQOS, Zyn)", "Altria", "British American Tobacco", "Anheuser-Busch InBev", "Diageo", "Constellation Brands", "Molson Coors", "Brown-Forman"],
        trends: "Nicotine pouches (Zyn) growing 50%+. Cigarette volume declining 4-5%/yr but pricing offsets. Premiumization in spirits. Beer losing share to spirits and RTD cocktails. GLP-1 drugs potentially impacting alcohol consumption. Cannabis legalization stalled federally",
      },
      agri: { name: "Agriculture & Commodity Ingredients", fullName: "Agricultural Commodities & Ingredients", category: "Upstream", color: "#84CC16",
        tam: "$600B+ (2025, global ag trading + ingredients)", growth: "~3-5% CAGR", icon: "🌾",
        desc: "Global agricultural commodity trading, processing, and ingredient manufacturing. The upstream supply chain for all food & beverage companies.",
        whatTheySell: "Grain trading and processing, oilseed crushing, sugar refining, food ingredients (flavors, colors, starches, proteins), animal nutrition, fertilizers",
        whoBuys: "CPG companies (Nestlé, PepsiCo), food manufacturers, bakeries, restaurants, livestock/poultry producers, biofuel producers",
        keyPlayers: ["Archer Daniels Midland (ADM)", "Bunge", "Cargill (private)", "Louis Dreyfus (private)", "Ingredion", "Kerry Group", "IFF", "Givaudan"],
        trends: "Specialty ingredients growing faster than commodity trading. Plant-based proteins, alternative sweeteners. Supply chain disruptions (weather, trade wars). ADM/Bunge under margin pressure as commodity cycle normalizes. Precision agriculture",
      },
      grocery: { name: "Grocery & Drug Retail", fullName: "Grocery Chains, Drug Stores & Mass Retail", category: "Retail", color: T_.green,
        tam: "$1.3T+ (2025, US grocery + drug)", growth: "~2-4% CAGR", icon: "🏬",
        desc: "Physical and online retail of food, beverages, household products, health & beauty, and pharmacy. Low-margin, high-volume business with thin operating margins.",
        whatTheySell: "Groceries, pharmacy/prescriptions, health & beauty, household essentials, prepared foods, fuel, financial services (money orders)",
        whoBuys: "Every household. Consumers visit grocery 1.5x/week on average. Walmart is the #1 US grocer (~25% share). Private label share growing",
        keyPlayers: ["Walmart (grocery leader)", "Kroger", "Costco", "Albertsons", "Ahold Delhaize (Stop & Shop, Food Lion)", "Publix", "Aldi", "Walgreens", "CVS Health"],
        trends: "Walmart dominance expanding. Kroger-Albertsons merger dynamics. Hard discount (Aldi, Lidl) gaining share. Online grocery ~12% of sales and growing. Pharmacy under pressure (PBM reimbursement, store closures). Dollar stores serving food deserts",
      },
      privatelabel: { name: "Private Label", fullName: "Private Label / Store Brand Manufacturing", category: "Manufacturing", color: T_.purple,
        tam: "$230B+ (2025, US private label)", growth: "~5-7% CAGR", icon: "🏷️",
        desc: "Products manufactured for retailers under the retailer's own brand (store brands). Growing share as consumers trade down from national brands and retailers seek higher margins.",
        whatTheySell: "Store-brand food, beverages, household products, health & beauty, OTC medicines — manufactured to retailer specifications by contract manufacturers",
        whoBuys: "Retailers (Walmart Great Value, Costco Kirkland, Kroger Private Selection, Amazon Basics). Consumers purchasing for value (typically 20-30% cheaper than national brands)",
        keyPlayers: ["TreeHouse Foods", "Post Holdings", "8th Continent", "Perrigo (OTC/personal care)", "Clarios", "Vi-Jon", "Walmart (Great Value)", "Costco (Kirkland Signature)"],
        trends: "Private label at 23%+ of US grocery dollar share, highest ever. European markets at 35-45% (further growth runway in US). Retailer brand quality improving. Inflation drove trial, habits are sticking. Kirkland Signature alone does $90B+ at retail",
      },
    };
    const TAX = [
      { key: "cpg", label: "Branded CPG", color: T_.amber, icon: "🥤", children: ["food", "household"] },
      { key: "sin", label: "Tobacco & Alcohol", color: T_.red, icon: "🍷", children: ["tobacco"] },
      { key: "upstream", label: "Upstream / Ingredients", color: "#84CC16", icon: "🌾", children: ["agri"] },
      { key: "retail", label: "Retail & Distribution", color: T_.green, icon: "🏬", children: ["grocery"] },
      { key: "pl", label: "Private Label", color: T_.purple, icon: "🏷️", children: ["privatelabel"] },
    ];
    return (
    <div>
      <div style={{ marginBottom: 24 }}><div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>Consumer Staples Primer</div><div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Packaged food, household products, grocery, and the defensive consumer — spending on needs, not wants</div></div>
      {/* Value Chain */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Consumer Staples — Value Chain</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>From farm to fork. Each stage adds processing, branding, or distribution value. Margins are thin at retail but wide at branded CPG.</div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          {[
            { label: "Agriculture / Ingredients", color: "#84CC16", icon: "🌾", desc: "Raw materials & processing",
              rows: [{ sub: "Commodity Trading", ex: "ADM, Bunge, Cargill" }, { sub: "Ingredients", ex: "IFF, Givaudan, Ingredion" }, { sub: "Packaging", ex: "Ball Corp, Amcor, Berry" }],
              buyers: "CPG companies, food manufacturers" },
            { label: "Processing / Mfg", color: T_.textGhost, icon: "🏭", desc: "Transform into products",
              rows: [{ sub: "Food Processing", ex: "Nestlé, General Mills, Conagra" }, { sub: "Beverage Mfg", ex: "Coca-Cola bottlers, AB InBev" }, { sub: "Contract Mfg", ex: "TreeHouse Foods, Perrigo" }],
              buyers: "Brands (own mfg) or retailers (private label)" },
            { label: "Brands / CPG", color: T_.amber, icon: "✨", desc: "Market & distribute",
              rows: [{ sub: "Food & Snacks", ex: "PepsiCo, Mondelēz, Kraft Heinz" }, { sub: "Household", ex: "P&G, Colgate, Church & Dwight" }, { sub: "Tobacco/Alcohol", ex: "Philip Morris, Diageo, AB InBev" }],
              buyers: "Retailers, distributors, foodservice" },
            { label: "Distribution", color: "#0EA5E9", icon: "🚛", desc: "Wholesale & logistics",
              rows: [{ sub: "Broadline", ex: "Sysco, US Foods, PFGC" }, { sub: "Specialty", ex: "UNFI (natural/organic)" }, { sub: "DSD", ex: "PepsiCo, Coca-Cola (direct store)" }],
              buyers: "Retailers, restaurants, institutions" },
            { label: "Retail", color: T_.green, icon: "🏬", desc: "Sell to consumers",
              rows: [{ sub: "Grocery", ex: "Walmart, Kroger, Albertsons" }, { sub: "Club/Mass", ex: "Costco, Target, BJ's" }, { sub: "Drug/Dollar", ex: "CVS, Walgreens, Dollar General" }],
              buyers: "End consumers" },
            { label: "Consumer", color: "#6366F1", icon: "👥", desc: "Eat, drink, clean, repeat",
              rows: [{ sub: "Households", ex: "130M US households" }, { sub: "Foodservice", ex: "Restaurants, cafeterias" }, { sub: "Institutional", ex: "Hospitals, schools, military" }],
              buyers: "Non-discretionary — spending persists in recession" },
          ].map((stage, i, arr) => (
            <div key={stage.label} style={{ display: "flex", alignItems: "stretch" }}>
              <div style={{ flex: 1, background: stage.color + "0A", border: `1px solid ${stage.color}33`, borderRadius: 8, padding: "12px 12px", minWidth: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}><span style={{ fontSize: 14 }}>{stage.icon}</span><span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.label}</span></div>
                <div style={{ fontSize: 11, color: T_.textDim, marginBottom: 10 }}>{stage.desc}</div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                  {stage.rows.map(r => (<div key={r.sub} style={{ background: T_.bg, borderRadius: 5, padding: "5px 8px" }}><div style={{ fontSize: 11, fontWeight: 600, color: stage.color }}>{r.sub}</div><div style={{ fontSize: 10, color: T_.textDim, lineHeight: 1.4 }}>{r.ex}</div></div>))}
                </div>
                <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8, borderTop: `1px solid ${T_.borderLight}`, paddingTop: 5 }}><span style={{ fontWeight: 600 }}>Buyers:</span> {stage.buyers}</div>
              </div>
              {i < arr.length - 1 && <div style={{ display: "flex", alignItems: "center", padding: "0 4px", color: T_.textGhost, fontSize: 16, flexShrink: 0 }}>&#8594;</div>}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>Consumer staples are the most defensive sector — recession-resistant demand with stable cash flows. The trade-off is lower growth. Brands compete for shelf space, trade spend optimization, and price/volume balance.</div>
      </div>
      {/* Taxonomy */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Consumer Staples Taxonomy</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Click to expand</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {TAX.map(cat => (
            <div key={cat.key}>
              <div onClick={() => toggle("cstax_" + cat.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: isExp("cstax_" + cat.key) ? cat.color + "22" : T_.bg, borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("cstax_" + cat.key) ? cat.color + "44" : T_.border}` }}>
                <span style={{ fontSize: 16 }}>{cat.icon}</span><span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsector{cat.children.length > 1 ? "s" : ""}</span>
                <span style={{ fontSize: 12, color: T_.textGhost, transform: isExp("cstax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span>
              </div>
              {isExp("cstax_" + cat.key) && <div style={{ marginLeft: 32, marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>{cat.children.map(ck => { const sub = SUBS[ck]; if (!sub) return null; return (
                <div key={ck} onClick={() => toggle("cssub_" + ck)} style={{ padding: "10px 16px", background: isExp("cssub_" + ck) ? T_.bgInput : T_.bg, borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span><span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span><span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span><span style={{ fontSize: 13, color: T_.textGhost, transform: isExp("cssub_" + ck) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span></div>
                  {isExp("cssub_" + ck) && <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T_.borderLight}` }} onClick={e => e.stopPropagation()}>
                    <div style={{ fontSize: 13, color: T_.textMid, marginBottom: 8, lineHeight: 1.5 }}>{sub.desc}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>What They Sell</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whatTheySell}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Who Buys</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whoBuys}</div></div></div>
                    <div style={{ marginBottom: 8 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Players</div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{sub.keyPlayers.map(p => <span key={p} style={{ fontSize: 12, padding: "3px 10px", background: cat.color + "22", color: cat.color, borderRadius: 10, border: `1px solid ${cat.color}44` }}>{p}</span>)}</div></div>
                    <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Trends</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.5 }}>{sub.trends}</div></div>
                  </div>}
                </div>); })}</div>}
            </div>
          ))}
        </div>
      </div>
      {/* Subsector TAM Cards */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Subsector Overview — TAM & Growth</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
          {Object.entries(SUBS).map(([key, sub]) => (
            <div key={key} style={{ padding: "12px 14px", background: T_.bg, borderRadius: 8, border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer" }} onClick={() => { const cat = TAX.find(t => t.children.includes(key)); if (cat) forceOpen("cstax_" + cat.key, "cssub_" + key); }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.name}</span></div>
              <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 6 }}>{sub.category}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>TAM</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.tam}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>Growth</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.green }}>{sub.growth}</div></div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Revenue Models */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Consumer Staples Revenue Models</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How staples companies make money. The battle is between branded pricing power and private label value.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { name: "Branded CPG Sales", color: T_.amber, icon: "✨",
              how: "Branded consumer packaged goods companies sell through retailers (grocery, mass, club, convenience). Revenue = volume x price. Trade spend (promotions, slotting fees, coupons) reduces gross-to-net revenue by 20-30%. Brands fight for shelf space and consumer mindshare",
              economics: "Gross margins: 45-65% (P&G at 52%, Coca-Cola at 60%). Operating margins: 18-30%. Revenue growth typically 3-6% (1-2% volume + 2-4% pricing). Trade spend is 15-25% of gross revenue. A&P (advertising & promotion) is 8-15% of net revenue. Scale is the moat — P&G spends $8B/yr on advertising",
              examples: "P&G ($84B revenue), Coca-Cola ($46B), PepsiCo ($92B), Nestlé ($100B+ CHF), Mondelēz ($36B), Colgate ($20B)",
              valuation: "18-28x P/E for staples leaders. 12-16x EBITDA. Market rewards consistent organic growth, pricing power, and margin expansion. Dividend yield matters — staples are bond proxies. P&G consistently commands premium",
              transition: "Facing private label share gains and consumer trade-down. Responding with premiumization (P&G Pampers Premium, Coca-Cola mini cans at higher per-oz pricing), innovation, and DTC channels. GLP-1 drugs creating new headwind for snack/beverage companies" },
            { name: "Private Label Manufacturing", color: T_.purple, icon: "🏷️",
              how: "Contract manufacturers produce products to retailer specifications under the retailer's brand (Walmart Great Value, Costco Kirkland, Kroger store brands). Revenue comes from manufacturing contracts with retailers — lower margin per unit but predictable volume",
              economics: "Gross margins: 18-28% (vs 45-65% for branded). Operating margins: 5-10%. Volume is more predictable (contracted with major retailers). Lower marketing costs (zero consumer advertising). Working capital intensive. Scale and cost efficiency are critical",
              examples: "TreeHouse Foods (largest US private label food company), Perrigo (OTC/personal care), Cott/Primo Water (beverages), Greencore (UK sandwiches/convenience)",
              valuation: "8-12x EBITDA for private label manufacturers. Discount to branded CPG due to lower margins, limited pricing power, and customer concentration risk. TreeHouse has been a challenging PE/public equity investment despite growing category",
              transition: "Private label share growing from 23% toward European levels (35-45%). Retailers investing in store brand quality. Costco Kirkland is a $90B+ retail brand. The risk for private label manufacturers: retailers can switch manufacturers relatively easily" },
            { name: "Direct-to-Consumer (DTC)", color: "#0EA5E9", icon: "📦",
              how: "Brands sell directly to consumers via e-commerce, bypassing traditional retail. Higher margins per unit (no retailer markup) but requires investment in marketing, fulfillment, and customer acquisition. Subscription models for replenishment items",
              economics: "Gross margins: 60-80% (vs. 45-65% through retail after trade spend). Customer acquisition cost (CAC) is the critical metric — $30-80 per customer for staples DTC. Subscription retention: 60-80% after 12 months. Fulfillment costs eat into margin advantage",
              examples: "Dollar Shave Club (Unilever), The Honest Company, Hims & Hers, Hello Fresh (meal kits), Chewy (pet), P&G direct shop, Nestlé DTC brands",
              valuation: "2-5x revenue for DTC brands with growth. Market has re-rated DTC brands lower after 2021-2022 hype. Hims & Hers gaining traction. Dollar Shave Club failed to scale profitably (Unilever wrote down). Profitable DTC at scale is very difficult in staples",
              transition: "DTC is a complement, not a replacement for retail distribution. Most CPG DTC is <5% of brand revenue. Exceptions in pet (Chewy ~$12B revenue), personal care/wellness (Hims), and meal kits. Subscription replenishment works best for consumables" },
            { name: "Commodity Sales", color: "#84CC16", icon: "🌾",
              how: "Agricultural commodity trading and processing — buying raw agricultural products, processing them, and selling to food manufacturers. Revenue = commodity price x volume. Margins come from origination efficiency, processing spread, and logistics",
              economics: "Gross margins: 5-12% (commodity processing). Operating margins: 3-6%. Revenue is highly volatile (commodity price swings). Working capital intensive (financing commodity inventories). Returns on capital are moderate (8-12% ROIC in good years). Scale and logistics network are the moats",
              examples: "ADM ($90B+ revenue, ~5% operating margin), Bunge ($55B), Cargill ($170B, private), Louis Dreyfus (private), Ingredion ($8B, specialty ingredients)",
              valuation: "6-10x EBITDA for commodity processors. Specialty ingredients (IFF, Givaudan, Kerry) command 14-20x due to higher margins and growth. Market penalizes commodity cyclicality and thin margins. Investors prefer specialty/ingredient companies",
              transition: "Commodity processors pivoting to higher-margin specialty ingredients. ADM expanding nutrition segment. Bunge-Viterra merger creating scale. The shift from bulk commodity to value-added ingredients mirrors the broader 'move up the value chain' theme" },
          ].map((model, i) => (
            <div key={i} style={{ background: T_.bg, borderRadius: 10, border: `1px solid ${model.color}33`, borderLeft: `4px solid ${model.color}`, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><span style={{ fontSize: 20 }}>{model.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: model.color }}>{model.name}</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>How It Works</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.how}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Unit Economics</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.economics}</div></div></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Examples</div><div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{model.examples}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Valuation Impact</div><div style={{ fontSize: 13, color: T_.green, lineHeight: 1.6 }}>{model.valuation}</div></div></div>
              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Transition Dynamics</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{model.transition}</div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Key Concepts */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { title: "Volume vs Price", desc: "Staples organic growth = volume growth + price/mix. Healthy growth is balanced (2% volume + 3% price). Pure pricing growth (like 2022-2024) eventually faces consumer pushback and volume declines. The market rewards volume-led growth." },
            { title: "Trade Spend", desc: "Payments from CPG brands to retailers for shelf placement, promotions, displays, and coupons. Typically 20-30% of gross revenue. Optimizing trade spend (which promotions drive incremental volume vs. just subsidizing existing purchases) is a key margin lever." },
            { title: "Category Captain", desc: "The leading brand in a category often serves as 'category captain' — advising the retailer on planogram layout, assortment, and pricing for the entire category (including competitors). P&G is category captain in detergent, oral care, diapers at most retailers." },
            { title: "Shelf Space & Planograms", desc: "Physical shelf space is the #1 competitive battleground. Brands pay slotting fees ($10K-500K per SKU) for placement. Planograms dictate exactly where products sit — eye level commands 35% more sales. Losing shelf space is the beginning of brand death." },
            { title: "Elasticity", desc: "How sensitive demand is to price changes. Staples have low elasticity (people still buy toothpaste). Elasticity of -0.3 means a 10% price increase loses 3% volume. Luxury staples (premium spirits, organic food) are even less elastic. Private label is the elastic alternative." },
            { title: "Brand Premium", desc: "The price difference consumers will pay for a branded product vs. private label. Tide charges 30-40% more than store-brand detergent. As premiums widen (due to inflation-driven pricing), consumers trade down. The optimal brand premium is high enough for margin but low enough to prevent switching." },
          ].map((c, i) => (
            <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>);
  }

  // ═══════════════════════════════════════════════════════════════════
  // FINANCIALS
  // ═══════════════════════════════════════════════════════════════════
  if (subTab === "financials") {
    const SUBS = {
      combanking: { name: "Commercial Banking", fullName: "Commercial & Retail Banking", category: "Banking", color: T_.blue,
        tam: "$2.2T+ (2025, global banking revenue)", growth: "~4-6% CAGR", icon: "🏦",
        desc: "Traditional deposit-taking and lending institutions serving consumers and businesses. The backbone of the financial system. Net interest income (NII) from the spread between lending and deposit rates is the primary revenue driver.",
        whatTheySell: "Checking/savings accounts, mortgages, auto loans, credit cards, commercial loans, lines of credit, treasury management, trade finance",
        whoBuys: "Consumers (retail banking), SMBs, mid-market corporates, large enterprises. Every person and business needs banking",
        keyPlayers: ["JPMorgan Chase", "Bank of America", "Wells Fargo", "Citigroup", "US Bancorp", "PNC Financial", "Truist", "HSBC", "Goldman Sachs (Marcus)"],
        trends: "Higher-for-longer rates benefiting NII but pressuring deposit costs. Deposit migration to money markets. CRE exposure concerns (office). JPMorgan dominant and gaining share. Regional bank stress post-SVB. Digital banking expectations rising",
      },
      ib: { name: "Investment Banking & Capital Markets", fullName: "Investment Banking, Advisory & Sales/Trading", category: "Capital Markets", color: T_.green,
        tam: "$400B+ (2025, global IB + trading revenue)", growth: "~5-8% CAGR (cyclical)", icon: "📈",
        desc: "Advisory services (M&A, restructuring), capital raising (equity and debt underwriting), and sales & trading (FICC, equities). Highly cyclical — revenue swings 30-50% with market conditions.",
        whatTheySell: "M&A advisory, IPO underwriting, debt capital markets (DCM), equity capital markets (ECM), leveraged finance, sales & trading, research, prime brokerage",
        whoBuys: "Corporations (M&A, capital raising), PE/financial sponsors (leveraged buyouts), institutional investors (trading, research), governments (debt issuance)",
        keyPlayers: ["Goldman Sachs", "Morgan Stanley", "JPMorgan", "Evercore", "Centerview", "Lazard", "Moelis", "PJT Partners", "Jefferies", "Houlihan Lokey"],
        trends: "2025 M&A recovery underway (PE exits normalizing). IPO market reopening. Leveraged finance activity strong. AI transforming research and trading. Fee compression in execution services. Boutiques gaining advisory share from bulge bracket",
      },
      insurance: { name: "Insurance (P&C, Life)", fullName: "Property & Casualty, Life & Health Insurance", category: "Insurance", color: T_.red,
        tam: "$1.5T+ (2025, US premiums)", growth: "~5-7% CAGR", icon: "🛡️",
        desc: "Risk transfer through insurance policies. P&C (auto, home, commercial) is cyclical with hard/soft market pricing. Life insurance provides death benefits and savings products. Underwriting profit + investment income = total return.",
        whatTheySell: "Auto insurance, homeowners, commercial property, general liability, workers comp, life/annuities, health insurance, reinsurance, specialty lines (cyber, E&O)",
        whoBuys: "Consumers (auto, home, life), businesses (commercial insurance), other insurers (reinsurance). Mandatory in many cases (auto, workers comp)",
        keyPlayers: ["Berkshire Hathaway (GEICO)", "State Farm", "Progressive", "Allstate", "Chubb", "AIG", "MetLife", "Prudential", "Travelers", "Munich Re", "Swiss Re"],
        trends: "Hard P&C market — rates still rising in casualty and property after years of losses. Climate risk repricing homeowners. Auto insurance profitability recovering. Private credit allocation by insurers growing. Insurtech impact modest so far",
      },
      am: { name: "Asset Management", fullName: "Asset Management & Wealth Management", category: "Asset Management", color: T_.purple,
        tam: "$500B+ (2025, global AM revenue)", growth: "~5-8% CAGR", icon: "💼",
        desc: "Investment management of pooled capital — mutual funds, ETFs, separately managed accounts, and alternatives. Revenue is primarily a percentage of AUM (assets under management). Fee compression in passive; growth in alternatives.",
        whatTheySell: "Mutual funds, ETFs, separately managed accounts (SMAs), alternative investments (PE, hedge funds, real estate, credit), financial planning/advisory",
        whoBuys: "Institutional investors (pensions, endowments, sovereign wealth), RIAs and wealth advisors, retail investors, family offices",
        keyPlayers: ["BlackRock ($14T+ AUM)", "Vanguard ($9T+)", "Fidelity", "State Street Global", "T. Rowe Price", "PIMCO (Allianz)", "Capital Group (American Funds)", "Invesco"],
        trends: "Passive crushing active (ETFs now $10T+ AUM globally). Fee compression (equity fund avg fee: 40bps → 20bps). Alternatives growing (PE, private credit, real assets). BlackRock dominant and diversifying. Model portfolios gaining adoption. Direct indexing growing",
      },
      privatecredit: { name: "Private Credit & Alt Lending", fullName: "Private Credit, Direct Lending & Alternative Lending Platforms", category: "Alternative Lending", color: T_.amber,
        tam: "$1.7T+ (2025, private credit AUM)", growth: "~15-20% CAGR", icon: "💰",
        desc: "Non-bank lending to businesses — direct loans, mezzanine, distressed debt, asset-based lending. Fastest-growing segment in financial services as banks retreat from middle-market lending post-regulation.",
        whatTheySell: "Direct loans (senior secured, unitranche), mezzanine debt, distressed/special situations, asset-based lending (ABL), real estate debt, infrastructure debt, NAV lending",
        whoBuys: "Middle-market companies (typically PE-backed), real estate developers, infrastructure projects, large corporates (for flexibility/speed). Investors: pensions, insurance, family offices seeking yield",
        keyPlayers: ["Apollo (largest — $600B+ credit AUM)", "Ares Management", "Blue Owl Capital", "Owl Rock", "Golub Capital", "HPS Investment Partners", "Blackstone Credit", "KKR Credit"],
        trends: "Private credit AUM doubled in 3 years ($0.9T → $1.7T+). Banks ceding market share due to Basel III/IV capital requirements. Spread compression as competition intensifies. Unitranche displacing traditional bank + mezzanine structures. Credit quality untested through a real downturn",
      },
      payments: { name: "Payments & Processing", fullName: "Payments Networks, Processing & Merchant Services", category: "Payments", color: "#0EA5E9",
        tam: "$2.5T+ (2025, global payments revenue)", growth: "~8-10% CAGR", icon: "💳",
        desc: "The infrastructure and services enabling electronic money movement — card networks, merchant acquiring, issuer processing, cross-border payments, and real-time payments.",
        whatTheySell: "Card network processing (authorization, clearing, settlement), merchant acquiring, POS terminals, payment gateways, issuer processing, cross-border FX, B2B payments",
        whoBuys: "Merchants (acquiring), banks (network membership, issuer processing), consumers (card products), corporates (B2B payments, treasury), governments",
        keyPlayers: ["Visa", "Mastercard", "PayPal", "Adyen", "Fiserv (Clover)", "Global Payments", "Block (Square)", "FIS", "Worldpay", "Stripe"],
        trends: "Cash-to-digital secular shift continuing (still 15%+ of transactions are cash in US). Real-time payments (FedNow) growing slowly. Visa/Mastercard duopoly facing regulatory pressure. B2B payments digitization is the next frontier. Embedded payments in software platforms",
      },
    };
    const TAX = [
      { key: "banking", label: "Banking", color: T_.blue, icon: "🏦", children: ["combanking"] },
      { key: "cm", label: "Capital Markets", color: T_.green, icon: "📈", children: ["ib"] },
      { key: "ins", label: "Insurance", color: T_.red, icon: "🛡️", children: ["insurance"] },
      { key: "am", label: "Asset Management", color: T_.purple, icon: "💼", children: ["am"] },
      { key: "altlend", label: "Alternative Lending", color: T_.amber, icon: "💰", children: ["privatecredit"] },
      { key: "pay", label: "Payments", color: "#0EA5E9", icon: "💳", children: ["payments"] },
    ];
    return (
    <div>
      <div style={{ marginBottom: 24 }}><div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>Financials Primer</div><div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Banking, capital markets, insurance, asset management, private credit, and payments</div></div>
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Financials — Value Chain</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Capital flows from sources through intermediaries and distributors to end clients. The financial system intermediates risk and allocates capital.</div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          {[
            { label: "Capital Sources", color: "#84CC16", icon: "💵", desc: "Where money originates",
              rows: [{ sub: "Depositors", ex: "Consumer & business deposits" }, { sub: "Central Banks", ex: "Fed, ECB, BOJ (monetary policy)" }, { sub: "Capital Markets", ex: "Bond markets, equity markets" }, { sub: "Policyholders", ex: "Insurance premiums" }],
              buyers: "Banks, insurers, asset managers" },
            { label: "Financial Intermediaries", color: T_.blue, icon: "🏦", desc: "Transform & allocate capital",
              rows: [{ sub: "Banks", ex: "JPMorgan, BofA, Wells Fargo" }, { sub: "Insurers", ex: "Berkshire, Progressive, Chubb" }, { sub: "Asset Managers", ex: "BlackRock, Vanguard, Apollo" }, { sub: "Private Credit", ex: "Apollo, Ares, Blue Owl" }],
              buyers: "Borrowers, investors, policyholders" },
            { label: "Distribution", color: T_.amber, icon: "🔗", desc: "Reach end clients",
              rows: [{ sub: "Branches", ex: "30K+ US bank branches" }, { sub: "Wealth Advisors", ex: "Morgan Stanley WM, UBS, RIAs" }, { sub: "Brokers/Agents", ex: "Insurance agents, mortgage brokers" }, { sub: "Digital", ex: "Apps, robo-advisors, neobanks" }],
              buyers: "End clients (consumers, businesses)" },
            { label: "End Clients", color: "#6366F1", icon: "👥", desc: "Users of financial services",
              rows: [{ sub: "Consumers", ex: "Deposits, loans, insurance, investing" }, { sub: "SMB/Corporate", ex: "Lending, treasury, insurance" }, { sub: "Institutional", ex: "Pensions, endowments, SWFs" }, { sub: "Government", ex: "Debt issuance, regulation" }],
              buyers: "Every person and entity in the economy" },
          ].map((stage, i, arr) => (
            <div key={stage.label} style={{ display: "flex", alignItems: "stretch" }}>
              <div style={{ flex: 1, background: stage.color + "0A", border: `1px solid ${stage.color}33`, borderRadius: 8, padding: "12px 12px", minWidth: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}><span style={{ fontSize: 14 }}>{stage.icon}</span><span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.label}</span></div>
                <div style={{ fontSize: 11, color: T_.textDim, marginBottom: 10 }}>{stage.desc}</div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                  {stage.rows.map(r => (<div key={r.sub} style={{ background: T_.bg, borderRadius: 5, padding: "5px 8px" }}><div style={{ fontSize: 11, fontWeight: 600, color: stage.color }}>{r.sub}</div><div style={{ fontSize: 10, color: T_.textDim, lineHeight: 1.4 }}>{r.ex}</div></div>))}
                </div>
                <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8, borderTop: `1px solid ${T_.borderLight}`, paddingTop: 5 }}><span style={{ fontWeight: 600 }}>Buyers:</span> {stage.buyers}</div>
              </div>
              {i < arr.length - 1 && <div style={{ display: "flex", alignItems: "center", padding: "0 4px", color: T_.textGhost, fontSize: 16, flexShrink: 0 }}>&#8594;</div>}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>Financial services is the most regulated sector. Capital requirements (Basel III/IV), interest rates (Fed policy), and credit cycles define profitability. Banks earn the spread; insurers earn the float; asset managers earn the fee.</div>
      </div>
      {/* Taxonomy */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Financials Taxonomy</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Click to expand</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {TAX.map(cat => (
            <div key={cat.key}>
              <div onClick={() => toggle("fintax_" + cat.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: isExp("fintax_" + cat.key) ? cat.color + "22" : T_.bg, borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("fintax_" + cat.key) ? cat.color + "44" : T_.border}` }}>
                <span style={{ fontSize: 16 }}>{cat.icon}</span><span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsector{cat.children.length > 1 ? "s" : ""}</span>
                <span style={{ fontSize: 12, color: T_.textGhost, transform: isExp("fintax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span>
              </div>
              {isExp("fintax_" + cat.key) && <div style={{ marginLeft: 32, marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>{cat.children.map(ck => { const sub = SUBS[ck]; if (!sub) return null; return (
                <div key={ck} onClick={() => toggle("finsub_" + ck)} style={{ padding: "10px 16px", background: isExp("finsub_" + ck) ? T_.bgInput : T_.bg, borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span><span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span><span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span><span style={{ fontSize: 13, color: T_.textGhost, transform: isExp("finsub_" + ck) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span></div>
                  {isExp("finsub_" + ck) && <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T_.borderLight}` }} onClick={e => e.stopPropagation()}>
                    <div style={{ fontSize: 13, color: T_.textMid, marginBottom: 8, lineHeight: 1.5 }}>{sub.desc}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>What They Sell</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whatTheySell}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Who Buys</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whoBuys}</div></div></div>
                    <div style={{ marginBottom: 8 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Players</div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{sub.keyPlayers.map(p => <span key={p} style={{ fontSize: 12, padding: "3px 10px", background: cat.color + "22", color: cat.color, borderRadius: 10, border: `1px solid ${cat.color}44` }}>{p}</span>)}</div></div>
                    <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Trends</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.5 }}>{sub.trends}</div></div>
                  </div>}
                </div>); })}</div>}
            </div>
          ))}
        </div>
      </div>
      {/* Subsector TAM Cards */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Subsector Overview — TAM & Growth</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
          {Object.entries(SUBS).map(([key, sub]) => (
            <div key={key} style={{ padding: "12px 14px", background: T_.bg, borderRadius: 8, border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer" }} onClick={() => { const cat = TAX.find(t => t.children.includes(key)); if (cat) forceOpen("fintax_" + cat.key, "finsub_" + key); }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.name}</span></div>
              <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 6 }}>{sub.category}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>TAM</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.tam}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>Growth</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.green }}>{sub.growth}</div></div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Revenue Models */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Financial Services Revenue Models</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How financial institutions make money. The model defines the risk profile and valuation framework.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { name: "Net Interest Income (NII)", color: T_.blue, icon: "🏦",
              how: "Banks earn the spread between interest received on loans/securities and interest paid on deposits/borrowings. NII = interest income - interest expense. The larger the balance sheet and wider the spread, the more NII. Sensitive to rate environment and yield curve shape",
              economics: "Net interest margin (NIM): 2.5-3.5% for most banks. JPMorgan NII: ~$90B annually. NII is ~55-65% of total bank revenue. Rising rates help NII (loans reprice faster than deposits) up to a point, then deposit costs catch up. Inverted yield curve compresses NIM",
              examples: "JPMorgan ($90B+ NII), Bank of America ($56B), Wells Fargo ($52B), US Bancorp ($17B), PNC ($14B)",
              valuation: "Banks valued on P/TBV (price to tangible book value): 1.0-2.5x for well-run banks. JPMorgan at ~2.5x TBV. ROE is the key driver — banks earning >15% ROE trade at premium to book. Below 10% ROE trades at discount",
              transition: "NII is cyclical — it expanded dramatically in 2022-2023 as rates rose, now normalizing as deposit costs catch up. Banks diversifying toward fee income to reduce NII sensitivity. Digital banking reducing branch costs" },
            { name: "Fee-Based (Advisory / AUM)", color: T_.green, icon: "📊",
              how: "Revenue from advisory services (M&A, restructuring), asset management fees (% of AUM), wealth management fees, and transaction fees. Non-interest income provides diversification from NII. Typically 35-45% of total bank revenue for diversified banks",
              economics: "Advisory fees: $5-50M+ per M&A deal. AUM fees: 15-50bps for passive, 50-100bps for active, 150-200bps for alternatives. Wealth management: 75-100bps on AUM. Asset management is scalable — marginal cost of managing an additional $1B is low",
              examples: "Goldman Sachs (advisory + trading), BlackRock ($14T AUM, ~25bps avg fee), Morgan Stanley Wealth Management, Evercore (pure advisory), Apollo (alternatives)",
              valuation: "Asset managers: 10-20x earnings. Alternatives managers (Apollo, Ares, KKR) at 15-25x due to locked-up capital and performance fees. Advisory boutiques at 10-15x. Market rewards fee-related earnings (FRE) which are predictable and recurring",
              transition: "Passive displacing active in traditional asset management. Alternatives (PE, credit, real estate) growing as the high-fee replacement. Every major bank is investing in wealth management. Advisory fees are cyclical but command premium multiples" },
            { name: "Insurance Premiums", color: T_.red, icon: "🛡️",
              how: "Insurers collect premiums upfront and pay claims later — the 'float' (premiums collected before claims paid) can be invested. Underwriting profit = premiums - claims - expenses. Combined ratio below 100% = underwriting profit. Investment income on the float adds to total returns",
              economics: "P&C combined ratios: 95-105% (95% = 5% underwriting profit). Life insurance: premiums invested over decades. Berkshire Hathaway float: $170B+ invested in stocks/bonds. Progressive combined ratio: ~91% (among best). Investment income: 3-5% yield on float",
              examples: "Berkshire Hathaway (GEICO + reinsurance), Progressive ($66B premiums), Chubb, AIG, Allstate, MetLife (life), Prudential (life)",
              valuation: "P&C insurers: 1.5-3.0x book value. Premium for superior underwriting (Progressive, Chubb). Life insurers: 0.5-1.5x book. Reinsurers: 1.0-2.0x. Market rewards consistent combined ratios below 95% and conservative reserving",
              transition: "Climate change repricing property insurance (Florida, California). Insurtech mostly failed to disrupt distribution. Private credit allocation growing (insurers seeking yield). AI for underwriting and claims processing. Hard market benefiting disciplined underwriters" },
            { name: "Transaction Processing", color: "#0EA5E9", icon: "💳",
              how: "Payment networks and processors earn a fee on every electronic transaction — card swipes, ACH transfers, wire transfers, cross-border payments. Revenue = transaction volume x per-transaction fee (interchange, network fees, processing fees). Volume grows with GDP and cash-to-digital shift",
              economics: "Visa/Mastercard take 5-15bps per transaction (network fees). Merchant acquirers take 20-30bps. Total merchant discount rate: 2-3% of transaction value. Visa operating margins: ~65%. Mastercard: ~55%. Highly scalable — fixed infrastructure, marginal cost near zero",
              examples: "Visa ($35B revenue, 65% margin), Mastercard ($27B), Fiserv/Clover, Global Payments, Adyen, Stripe, Block/Square",
              valuation: "Visa/Mastercard at 25-35x earnings — among the highest-quality businesses in any sector. Payment processors: 15-25x EBITDA. Market rewards volume growth, margin expansion, and network effects. Duopoly structure provides pricing power",
              transition: "Cash-to-digital shift still has runway (15%+ of US transactions are cash, higher globally). Real-time payments (FedNow, UPI in India) could disrupt card networks long-term. B2B payments digitization is the next $30T+ opportunity. Embedded payments in software growing" },
          ].map((model, i) => (
            <div key={i} style={{ background: T_.bg, borderRadius: 10, border: `1px solid ${model.color}33`, borderLeft: `4px solid ${model.color}`, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><span style={{ fontSize: 20 }}>{model.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: model.color }}>{model.name}</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>How It Works</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.how}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Unit Economics</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.economics}</div></div></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Examples</div><div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{model.examples}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Valuation Impact</div><div style={{ fontSize: 13, color: T_.green, lineHeight: 1.6 }}>{model.valuation}</div></div></div>
              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Transition Dynamics</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{model.transition}</div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Key Concepts */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { title: "NIM (Net Interest Margin)", desc: "Net interest income / average earning assets. The fundamental profitability metric for banks. US bank average NIM: ~3.0%. JPMorgan: ~2.7%. Community banks: 3.3-3.8%. NIM expands when rates rise (assets reprice faster) and compresses when deposit costs catch up or curve inverts." },
            { title: "ROE / ROA", desc: "Return on equity (net income / equity) and return on assets (net income / total assets). ROE target: 12-17% for well-run banks. ROA target: 1.0-1.5%. JPMorgan: ~17% ROE, ~1.4% ROA (best-in-class). ROE below cost of equity (~10%) means the bank destroys shareholder value." },
            { title: "CET1 Capital Ratio", desc: "Common Equity Tier 1 capital / risk-weighted assets. The key regulatory capital metric. Minimum: 4.5% + buffers = ~10-12% for large banks. JPMorgan CET1: ~15%. Higher CET1 = safer but lower ROE (excess capital is a drag). Banks must pass annual stress tests (CCAR) to return capital." },
            { title: "Credit Quality (NCOs / NPAs)", desc: "Net charge-offs (NCOs) = loans written off as losses. Non-performing assets (NPAs) = loans 90+ days past due. NCO ratio: 0.3-0.6% is normal, >1% is stressed. Consumer credit (credit cards, auto) normalizing post-COVID. CRE (commercial real estate, especially office) is the key risk for 2025-2026." },
            { title: "Combined Ratio", desc: "Insurance metric: (claims + expenses) / premiums. Below 100% = underwriting profit. Progressive: ~91% (excellent). Industry average P&C: ~100%. A 95% combined ratio means $5 of profit per $100 of premiums before investment income. The key metric for P&C insurer quality." },
            { title: "AUM Flows", desc: "Net new money flowing into or out of an asset manager's funds. Positive flows = market is choosing your products. Negative flows = redemptions exceed new money. BlackRock: $400B+ annual net inflows. Active managers losing ~$500B/yr to passive. Flows are the leading indicator of AM revenue." },
          ].map((c, i) => (
            <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>);
  }

  // ═══════════════════════════════════════════════════════════════════
  // FINTECH
  // ═══════════════════════════════════════════════════════════════════
  if (subTab === "fintech") {
    const SUBS = {
      digipay: { name: "Digital Payments", fullName: "Digital Payments & Mobile Wallets", category: "Payments", color: T_.blue,
        tam: "$150B+ (2025, fintech payments revenue)", growth: "~12-15% CAGR", icon: "💳",
        desc: "Digital-first payment solutions including mobile wallets, payment gateways, peer-to-peer transfers, and checkout experiences. Enabling the shift from cash and cards to digital-native payments.",
        whatTheySell: "Payment gateway/checkout, mobile wallets, P2P payments, BNPL, payment orchestration, cross-border payments, crypto on/off ramps",
        whoBuys: "E-commerce merchants, SMBs, consumers (P2P), enterprises (payment infrastructure), developers (payment APIs)",
        keyPlayers: ["Stripe", "Adyen", "Block (Square/Cash App)", "PayPal/Venmo", "Checkout.com", "Klarna (BNPL)", "Affirm", "Wise (cross-border)"],
        trends: "Stripe dominant in developer/e-commerce payments (~$1T+ TPV). BNPL growth moderating post-hype. Embedded payments in SaaS platforms. Real-time payments growing. Cross-border payments being disrupted by Wise, Remitly. Stablecoin payments emerging",
      },
      neobank: { name: "Neobanking & BaaS", fullName: "Neobanks, Challenger Banks & Banking-as-a-Service", category: "Digital Banking", color: T_.green,
        tam: "$30B+ (2025, neobank + BaaS revenue)", growth: "~20-25% CAGR", icon: "📱",
        desc: "Digital-only banks (no physical branches) and BaaS platforms that enable non-banks to embed banking products. Neobanks serve consumers and SMBs with lower fees and better UX.",
        whatTheySell: "Digital checking/savings accounts, debit cards, early wage access, SMB banking, BaaS APIs (ledgering, card issuing, compliance), embedded banking",
        whoBuys: "Underbanked consumers, millennials/Gen Z, freelancers/gig workers, SMBs. BaaS: fintech startups, tech companies embedding financial products",
        keyPlayers: ["Chime (largest US neobank, 22M+ customers)", "Nubank (Brazil, 100M+ customers)", "Revolut (UK/global)", "SoFi", "Mercury (SMB)", "Unit (BaaS)", "Column (BaaS)", "Synapse (failed — cautionary tale)"],
        trends: "Profitability now the focus (Nubank profitable, Chime approaching). BaaS under regulatory scrutiny after Synapse collapse. Sponsor bank model being tightened. Neobanks expanding beyond banking (investing, crypto, insurance). SMB neobanking growing fast (Mercury, Brex)",
      },
      lendplat: { name: "Lending Platforms", fullName: "Digital Lending & Marketplace Lending", category: "Lending", color: T_.amber,
        tam: "$50B+ (2025, fintech lending revenue)", growth: "~10-14% CAGR", icon: "🏠",
        desc: "Technology-enabled lending platforms for personal loans, mortgages, SMB lending, and student loans. AI-powered underwriting and digital-first origination processes.",
        whatTheySell: "Personal loans, SMB loans/lines, mortgage origination, student loan refinancing, auto lending, BNPL, revenue-based financing, invoice factoring",
        whoBuys: "Consumers (personal loans, mortgages, student refi), small businesses (working capital, equipment), institutional investors (loan purchases)",
        keyPlayers: ["SoFi", "LendingClub", "Upstart (AI underwriting)", "Better Mortgage", "Kabbage (AmEx)", "Fundbox", "OnDeck (Enova)", "Pagaya"],
        trends: "AI underwriting improving credit decisioning. Higher rates compressed origination volumes 2022-2024, recovering now. Embedded lending (lend at point of sale). Institutional capital fueling marketplace lending. Mortgage fintech consolidating",
      },
      insurtech: { name: "InsurTech", fullName: "Insurance Technology", category: "Insurance", color: T_.red,
        tam: "$15B+ (2025, insurtech revenue)", growth: "~15-20% CAGR", icon: "🛡️",
        desc: "Technology-driven insurance distribution, underwriting, and claims management. Most insurtechs are MGAs (managing general agents) or embedded insurance platforms rather than full-stack carriers.",
        whatTheySell: "Digital insurance distribution, AI underwriting, parametric insurance, embedded insurance (at point of sale), claims automation, insurance APIs",
        whoBuys: "Consumers (auto, renters, life), SMBs (commercial insurance), enterprises (embedding insurance in products), insurance carriers (tech solutions)",
        keyPlayers: ["Lemonade", "Root Insurance", "Hippo", "Coalition (cyber)", "Pie Insurance (workers comp)", "Newfront", "Corvus (cyber)", "Bolttech"],
        trends: "Most full-stack insurtechs (Lemonade, Root) have struggled with loss ratios. MGA model more capital-efficient. Cyber insurance fastest-growing line. Embedded insurance gaining traction. AI for claims processing showing ROI. Incumbents adopting insurtech tools",
      },
      wealthtech: { name: "WealthTech & Robo-Advisory", fullName: "Digital Wealth Management & Robo-Advisors", category: "Investing", color: T_.purple,
        tam: "$20B+ (2025, wealthtech revenue)", growth: "~12-16% CAGR", icon: "📊",
        desc: "Digital platforms for investing, portfolio management, and financial planning. Robo-advisors automate asset allocation. Trading platforms democratized market access.",
        whatTheySell: "Robo-advisory, self-directed trading, crypto trading, alternative investment access, financial planning tools, portfolio analytics, retirement accounts",
        whoBuys: "Retail investors (millennials/Gen Z), mass affluent, RIAs (using B2B wealthtech), family offices, retirement savers",
        keyPlayers: ["Robinhood", "Wealthfront", "Betterment", "Schwab Intelligent Portfolios", "Public.com", "Titan", "Carta (private markets)", "AngelList"],
        trends: "PFOF (payment for order flow) under regulatory pressure. Crypto integration in trading apps. Alternative investments (PE, private credit) being democratized for retail. AI financial advisors emerging. Robinhood diversifying beyond trading (Gold, credit cards, retirement)",
      },
      regtech: { name: "RegTech & Compliance", fullName: "Regulatory Technology & Compliance Automation", category: "Infrastructure", color: "#0EA5E9",
        tam: "$18B+ (2025)", growth: "~18-22% CAGR", icon: "📋",
        desc: "Software automating regulatory compliance, KYC/AML, fraud detection, and risk management. Banks spend $270B+ annually on compliance — RegTech automates manual processes.",
        whatTheySell: "KYC/identity verification, AML transaction monitoring, sanctions screening, regulatory reporting, compliance workflow automation, fraud detection, risk analytics",
        whoBuys: "Banks, fintechs, insurance companies, broker-dealers, crypto exchanges, payment companies. Compliance teams, risk officers, CLOs",
        keyPlayers: ["Chainalysis (crypto compliance)", "Alloy (identity)", "ComplyAdvantage", "Hummingbird", "Sardine (fraud)", "Unit21", "Jumio (identity verification)", "Persona"],
        trends: "Regulatory burden increasing (AI governance, crypto regulation, data privacy). Banks spending $270B+ annually on compliance. AI for transaction monitoring reducing false positives. Identity verification becoming real-time. Crypto compliance mandatory as regulation expands",
      },
      crypto: { name: "Crypto / Blockchain Infra", fullName: "Cryptocurrency & Blockchain Infrastructure", category: "Crypto", color: "#F97316",
        tam: "$40B+ (2025, crypto services revenue)", growth: "~25-35% CAGR (highly volatile)", icon: "🔗",
        desc: "Infrastructure for cryptocurrency trading, custody, stablecoin issuance, and blockchain applications. Includes exchanges, custodians, stablecoin operators, and DeFi protocols.",
        whatTheySell: "Crypto exchanges, institutional custody, stablecoin infrastructure, blockchain node services, tokenization platforms, wallet infrastructure, L1/L2 blockchains",
        whoBuys: "Retail traders, institutional investors, treasurers (stablecoins), developers (blockchain infrastructure), enterprises (tokenization)",
        keyPlayers: ["Coinbase", "Circle (USDC)", "Tether (USDT)", "Fireblocks (custody)", "Anchorage Digital", "Alchemy (node infra)", "Chainalysis", "Binance"],
        trends: "Bitcoin ETFs launched (BlackRock IBIT: $50B+ AUM). Stablecoins: $160B+ market cap and growing (payments use case). Tokenization of real-world assets (treasuries, real estate). Regulatory clarity improving in US. Institutional adoption accelerating. DeFi TVL recovering",
      },
    };
    const TAX = [
      { key: "pay", label: "Payments", color: T_.blue, icon: "💳", children: ["digipay"] },
      { key: "bank", label: "Digital Banking", color: T_.green, icon: "📱", children: ["neobank"] },
      { key: "lend", label: "Lending", color: T_.amber, icon: "🏠", children: ["lendplat"] },
      { key: "ins", label: "InsurTech", color: T_.red, icon: "🛡️", children: ["insurtech"] },
      { key: "invest", label: "Investing", color: T_.purple, icon: "📊", children: ["wealthtech"] },
      { key: "infra", label: "Infrastructure", color: "#0EA5E9", icon: "📋", children: ["regtech"] },
      { key: "crypto", label: "Crypto", color: "#F97316", icon: "🔗", children: ["crypto"] },
    ];
    return (
    <div>
      <div style={{ marginBottom: 24 }}><div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>Fintech Primer</div><div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Digital payments, neobanking, lending platforms, insurtech, wealthtech, regtech, and crypto infrastructure</div></div>
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Fintech — Value Chain</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>From banking infrastructure through middleware platforms to consumer-facing applications. Each layer enables the one to its right.</div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          {[
            { label: "Banking Infrastructure", color: T_.textGhost, icon: "🏦", desc: "Regulated core systems",
              rows: [{ sub: "Sponsor Banks", ex: "Cross River, Evolve, Column" }, { sub: "Card Networks", ex: "Visa, Mastercard" }, { sub: "Core Banking", ex: "FIS, Fiserv, Jack Henry" }, { sub: "ACH / RTP", ex: "Fed, The Clearing House" }],
              buyers: "Fintechs, BaaS platforms" },
            { label: "Platform / Middleware", color: "#0EA5E9", icon: "🔗", desc: "APIs connecting infra to apps",
              rows: [{ sub: "BaaS", ex: "Unit, Column, Treasury Prime" }, { sub: "Payments API", ex: "Stripe, Adyen, Checkout.com" }, { sub: "Identity / KYC", ex: "Alloy, Persona, Jumio" }, { sub: "Data Aggregation", ex: "Plaid, MX, Finicity" }],
              buyers: "Fintech apps, enterprises" },
            { label: "Application Layer", color: T_.blue, icon: "📱", desc: "Consumer & SMB products",
              rows: [{ sub: "Neobanks", ex: "Chime, Revolut, Nubank" }, { sub: "Lending", ex: "SoFi, Upstart, Affirm" }, { sub: "Investing", ex: "Robinhood, Wealthfront" }, { sub: "InsurTech", ex: "Lemonade, Coalition, Root" }],
              buyers: "Consumers, SMBs" },
            { label: "Distribution", color: T_.amber, icon: "🌐", desc: "How products reach users",
              rows: [{ sub: "Mobile Apps", ex: "App Store, Google Play" }, { sub: "Embedded Finance", ex: "Shopify Capital, Uber debit" }, { sub: "Marketplaces", ex: "NerdWallet, Bankrate" }],
              buyers: "End users (consumers, businesses)" },
            { label: "End User", color: "#6366F1", icon: "👥", desc: "Consumers & businesses",
              rows: [{ sub: "Consumers", ex: "Banking, payments, investing" }, { sub: "SMBs", ex: "Payments, lending, banking" }, { sub: "Enterprise", ex: "Treasury, payments, compliance" }],
              buyers: "Everyone participating in financial system" },
          ].map((stage, i, arr) => (
            <div key={stage.label} style={{ display: "flex", alignItems: "stretch" }}>
              <div style={{ flex: 1, background: stage.color + "0A", border: `1px solid ${stage.color}33`, borderRadius: 8, padding: "12px 12px", minWidth: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}><span style={{ fontSize: 14 }}>{stage.icon}</span><span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.label}</span></div>
                <div style={{ fontSize: 11, color: T_.textDim, marginBottom: 10 }}>{stage.desc}</div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                  {stage.rows.map(r => (<div key={r.sub} style={{ background: T_.bg, borderRadius: 5, padding: "5px 8px" }}><div style={{ fontSize: 11, fontWeight: 600, color: stage.color }}>{r.sub}</div><div style={{ fontSize: 10, color: T_.textDim, lineHeight: 1.4 }}>{r.ex}</div></div>))}
                </div>
                <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8, borderTop: `1px solid ${T_.borderLight}`, paddingTop: 5 }}><span style={{ fontWeight: 600 }}>Buyers:</span> {stage.buyers}</div>
              </div>
              {i < arr.length - 1 && <div style={{ display: "flex", alignItems: "center", padding: "0 4px", color: T_.textGhost, fontSize: 16, flexShrink: 0 }}>&#8594;</div>}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>Fintech unbundles traditional banking into specialized layers. The infrastructure layer (sponsor banks, card networks) is still dominated by incumbents. The middleware and application layers are where fintech innovation concentrates.</div>
      </div>
      {/* Taxonomy */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Fintech Taxonomy</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Click to expand</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {TAX.map(cat => (
            <div key={cat.key}>
              <div onClick={() => toggle("fttax_" + cat.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: isExp("fttax_" + cat.key) ? cat.color + "22" : T_.bg, borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("fttax_" + cat.key) ? cat.color + "44" : T_.border}` }}>
                <span style={{ fontSize: 16 }}>{cat.icon}</span><span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsector{cat.children.length > 1 ? "s" : ""}</span>
                <span style={{ fontSize: 12, color: T_.textGhost, transform: isExp("fttax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span>
              </div>
              {isExp("fttax_" + cat.key) && <div style={{ marginLeft: 32, marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>{cat.children.map(ck => { const sub = SUBS[ck]; if (!sub) return null; return (
                <div key={ck} onClick={() => toggle("ftsub_" + ck)} style={{ padding: "10px 16px", background: isExp("ftsub_" + ck) ? T_.bgInput : T_.bg, borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span><span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span><span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span><span style={{ fontSize: 13, color: T_.textGhost, transform: isExp("ftsub_" + ck) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span></div>
                  {isExp("ftsub_" + ck) && <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T_.borderLight}` }} onClick={e => e.stopPropagation()}>
                    <div style={{ fontSize: 13, color: T_.textMid, marginBottom: 8, lineHeight: 1.5 }}>{sub.desc}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>What They Sell</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whatTheySell}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Who Buys</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whoBuys}</div></div></div>
                    <div style={{ marginBottom: 8 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Players</div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{sub.keyPlayers.map(p => <span key={p} style={{ fontSize: 12, padding: "3px 10px", background: cat.color + "22", color: cat.color, borderRadius: 10, border: `1px solid ${cat.color}44` }}>{p}</span>)}</div></div>
                    <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Trends</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.5 }}>{sub.trends}</div></div>
                  </div>}
                </div>); })}</div>}
            </div>
          ))}
        </div>
      </div>
      {/* Subsector TAM Cards */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Subsector Overview — TAM & Growth</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
          {Object.entries(SUBS).map(([key, sub]) => (
            <div key={key} style={{ padding: "12px 14px", background: T_.bg, borderRadius: 8, border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer" }} onClick={() => { const cat = TAX.find(t => t.children.includes(key)); if (cat) forceOpen("fttax_" + cat.key, "ftsub_" + key); }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.name}</span></div>
              <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 6 }}>{sub.category}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>TAM</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.tam}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>Growth</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.green }}>{sub.growth}</div></div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Revenue Models */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Fintech Revenue Models</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How fintech companies monetize. The best models combine transaction-based revenue with recurring software fees.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { name: "Transaction Fees (Take Rate)", color: T_.blue, icon: "💳",
              how: "A percentage or fixed fee per transaction processed. Revenue scales linearly with payment volume. Stripe charges ~2.9% + $0.30 per online transaction. Adyen charges interchange++ (interchange + scheme fees + small markup). Revenue = TPV x take rate",
              economics: "Take rates: 0.1-0.3% (wholesale/Adyen) to 2.9% (Stripe SMB). Gross margins on payments: 40-55% after interchange. Stripe processes $1T+ TPV. Adyen ~$1T+. Revenue is highly predictable and grows with e-commerce/digital payments. Scale improves margins (fixed cost leverage)",
              examples: "Stripe (~$2B+ net revenue), Adyen ($1.8B), Block/Square ($7B gross profit), PayPal ($30B revenue), Affirm (merchant fees on BNPL)",
              valuation: "10-25x revenue for high-growth payment companies. Adyen at ~15x. Stripe private at ~$65B valuation. Market rewards TPV growth, take rate stability, and net revenue retention. Declining take rates (competition) compress multiples",
              transition: "Take rates under pressure from competition and scale. Fintechs adding software and financial services to increase revenue per customer beyond pure transaction fees. Embedded payments (Shopify, Toast) capturing share from standalone processors" },
            { name: "SaaS Subscription", color: T_.green, icon: "🔄",
              how: "Monthly or annual subscription for fintech software — compliance, analytics, treasury management, banking tools. Priced per user, per entity, or platform fee. Predictable recurring revenue stream",
              economics: "Gross margins: 70-85%. Annual contract values: $10K-500K+ for B2B fintech SaaS. Net dollar retention: 110-130%+ for best-in-class. Lower acquisition costs than consumer fintech. Example: Plaid charges banks/fintechs per API call + platform fees",
              examples: "Plaid (data connectivity), Alloy (identity/KYC), nCino (banking software), Q2 Holdings (digital banking platform), Finastra, MX Technologies",
              valuation: "8-15x ARR for fintech SaaS. Premium for mission-critical compliance and banking infrastructure. nCino at ~8x revenue. Q2 Holdings at ~6x. Market rewards high retention and regulatory moat (compliance software is sticky)",
              transition: "The highest-quality revenue stream in fintech. Companies pivoting from pure transaction models to hybrid SaaS + transaction. Stripe expanding into billing, invoicing, tax — all SaaS revenue. Compliance SaaS growing as regulation increases" },
            { name: "Interchange / Payment Processing", color: T_.amber, icon: "🔀",
              how: "Revenue from interchange fees earned on debit/credit card transactions. Neobanks and fintech card issuers earn interchange when customers swipe their cards. Interchange rates: 1.5-2.5% credit, 0.5-1.0% debit (set by card networks, paid by merchant's bank to issuer's bank)",
              economics: "Debit interchange: ~$0.21 + 5bps (Durbin-regulated) or ~1% (exempt under $10B assets). Credit interchange: 1.5-2.5%. Chime earns interchange on every Cash App/debit swipe. Revenue per active user: $100-200/yr from interchange alone. Margins: 80%+ on interchange revenue",
              examples: "Chime (primary revenue = debit interchange), Cash App, Robinhood Gold card, Brex corporate cards, Ramp (corporate cards), Marqeta (card issuing platform)",
              valuation: "Interchange-dependent models valued lower than diversified fintechs. Risk: Durbin amendment expansion could cut interchange. Chime private at ~$25B includes this risk. Card issuing platforms (Marqeta) at 8-12x revenue",
              transition: "Neobanks diversifying beyond interchange to subscription fees (Chime, SoFi), lending, and wealth management. Pure interchange models are vulnerable to regulatory changes. Marqeta powers card issuing for many fintechs — the 'picks and shovels' play" },
            { name: "Platform / Marketplace", color: T_.purple, icon: "🏪",
              how: "Fintech platforms connecting borrowers with lenders, insurance seekers with carriers, or investors with investment opportunities. Revenue from origination fees, referral fees, or marketplace spreads. Two-sided network effects",
              economics: "Origination fees: 1-5% of loan amount. Referral fees: $50-500 per qualified lead. Marketplace spreads vary. Revenue is volume-dependent and cyclical. Loan marketplace gross margins: 50-70%. Key metric: conversion rate of traffic to funded loans/policies",
              examples: "LendingClub (marketplace + balance sheet lending), Pagaya (AI credit marketplace), Lemonade (insurance marketplace), NerdWallet/Bankrate (financial product marketplace), Upstart (AI lending marketplace)",
              valuation: "3-8x revenue for lending marketplaces. Premium for AI-driven platforms with proven credit performance. Upstart highly volatile (5x revenue to 1x to 5x). NerdWallet at ~3x revenue. Market rewards volume growth and credit quality track record",
              transition: "Pure marketplace models (asset-light) vs hybrid (marketplace + balance sheet). Most lending fintechs have added balance sheet to stabilize revenue. Insurance marketplaces more capital-efficient than full-stack carriers" },
            { name: "Lending Spread (Net Interest Income)", color: T_.red, icon: "💰",
              how: "Fintech lenders earn the spread between their cost of funds and the interest rate charged to borrowers — same as traditional banking NII but with technology-driven origination and underwriting. Revenue = outstanding loans x net interest margin",
              economics: "Fintech lending NIM: 5-15% (higher than banks due to unsecured/subprime). Default rates: 3-8% for personal loans. Revenue per loan: $500-3,000 over loan life. Cost of funds: 4-8% (securitization, warehouse lines). SoFi NIM: ~6%. LendingClub NIM: ~7-8%",
              examples: "SoFi (student refi, personal loans, mortgages), LendingClub (personal loans), Upstart (personal loans via bank partners), Affirm (BNPL — effectively lending), Oportun (subprime personal loans)",
              valuation: "1-3x book value for fintech lenders (similar to banks). SoFi at ~2x TBV. Premium for technology moat and growth. Discount for credit risk uncertainty. Market scrutinizes credit quality intensely — one bad vintage destroys valuation",
              transition: "Many fintechs starting as asset-light marketplaces have added balance sheet lending for revenue stability. The trade-off: balance sheet lending provides more revenue but requires capital and introduces credit risk. Hybrid models emerging as the standard" },
          ].map((model, i) => (
            <div key={i} style={{ background: T_.bg, borderRadius: 10, border: `1px solid ${model.color}33`, borderLeft: `4px solid ${model.color}`, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><span style={{ fontSize: 20 }}>{model.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: model.color }}>{model.name}</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>How It Works</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.how}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Unit Economics</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.economics}</div></div></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Examples</div><div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{model.examples}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Valuation Impact</div><div style={{ fontSize: 13, color: T_.green, lineHeight: 1.6 }}>{model.valuation}</div></div></div>
              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Transition Dynamics</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{model.transition}</div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Key Concepts */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { title: "Take Rate", desc: "Revenue as a percentage of total payment volume (TPV) or gross merchandise volume (GMV) processed. Stripe: ~0.2% net take rate on $1T+ TPV. Adyen: ~0.15%. Higher take rates indicate more value-add (fraud, checkout optimization) but face competitive pressure over time." },
            { title: "TPV (Total Payment Volume)", desc: "The total dollar value of payments processed through a platform. The primary scale metric for payment companies. Stripe: $1T+. PayPal: $1.5T+. Block: $200B+. Growth in TPV is driven by merchant acquisition, same-merchant growth, and secular cash-to-digital shift." },
            { title: "Embedded Finance", desc: "Financial products (payments, lending, insurance, banking) embedded directly into non-financial software and platforms. Shopify Capital lends to merchants. Uber offers driver debit cards. Toast embeds payments in restaurant POS. Estimated $7T+ embedded finance opportunity by 2030." },
            { title: "BaaS (Banking-as-a-Service)", desc: "APIs and platforms that enable non-bank companies to offer banking products (accounts, cards, lending) without obtaining a bank charter. Regulated through sponsor bank partnerships. Under scrutiny after Synapse collapse (2024) — regulators tightening oversight of sponsor bank / BaaS relationships." },
            { title: "Open Banking", desc: "Regulatory frameworks (PSD2 in Europe, Section 1033 in US) requiring banks to share customer financial data with authorized third parties via APIs. Enables fintech innovation (aggregation, switching, personalization). Plaid and MX are the key data connectivity providers in the US." },
            { title: "CAC / LTV", desc: "Customer acquisition cost and lifetime value — the fundamental unit economics of fintech. Neobank CAC: $15-40 (low due to referrals). Lending CAC: $200-500. Insurance CAC: $100-300. LTV/CAC ratio of 3x+ is healthy. Many consumer fintechs struggled with CAC exceeding LTV in 2021-2022 hype." },
          ].map((c, i) => (
            <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>);
  }

  // ═══════════════════════════════════════════════════════════════════
  // INDUSTRIALS
  // ═══════════════════════════════════════════════════════════════════
  if (subTab === "industrials") {
    const SUBS = {
      machinery: { name: "Machinery & Equipment", fullName: "Industrial Machinery & Heavy Equipment", category: "Machinery", color: T_.amber,
        tam: "$600B+ (2025, global)", growth: "~4-6% CAGR", icon: "🔩",
        desc: "Manufacturers of industrial machinery, heavy equipment, and machine tools used in manufacturing, mining, construction, and agriculture. Long product cycles with significant aftermarket revenue.",
        whatTheySell: "Construction equipment (excavators, loaders), mining equipment, agricultural machinery, industrial compressors, pumps, machine tools, material handling, HVAC industrial",
        whoBuys: "Construction companies, miners, farmers, manufacturers, logistics providers, utilities, oil & gas operators",
        keyPlayers: ["Caterpillar", "John Deere", "Komatsu", "Volvo CE", "AGCO", "Parker Hannifin", "Illinois Tool Works (ITW)", "Dover", "Danaher"],
        trends: "Electrification of equipment (electric excavators, autonomous tractors). Precision agriculture driving Deere investment. Aftermarket/services growing as % of revenue (higher margin). Reshoring driving US industrial investment. Equipment rental growing vs ownership",
      },
      electrical: { name: "Electrical Equipment & Automation", fullName: "Electrical Equipment, Power Management & Industrial Automation", category: "Electrical & Automation", color: T_.blue,
        tam: "$400B+ (2025, global)", growth: "~6-9% CAGR", icon: "⚡",
        desc: "Electrical distribution equipment, power management systems, industrial automation, and robotics. Critical infrastructure for electrification, data centers, and factory automation.",
        whatTheySell: "Electrical panels/switchgear, transformers, UPS systems, PLCs, industrial robots, drives/motors, building automation, grid infrastructure",
        whoBuys: "Utilities, data centers, manufacturing plants, commercial buildings, industrial facilities, EV charging infrastructure, renewable energy projects",
        keyPlayers: ["Eaton", "Schneider Electric", "ABB", "Siemens", "Emerson Electric", "Rockwell Automation", "Honeywell", "Vertiv (data center power)"],
        trends: "Data center power demand surging (AI). Grid modernization ($100B+ US investment). EV charging infrastructure. Factory automation accelerating (labor shortages). Eaton and Vertiv as data center power plays. Transformer shortage (2-3 year backlogs)",
      },
      buildprod: { name: "Building Products", fullName: "Building Products & Materials", category: "Building Products", color: T_.green,
        tam: "$300B+ (2025, US)", growth: "~4-6% CAGR", icon: "🏗️",
        desc: "Products used in residential and commercial construction — roofing, insulation, windows, doors, siding, plumbing, HVAC. Replacement/repair demand provides cyclical stability.",
        whatTheySell: "Roofing (shingles, commercial), insulation, windows/doors, siding, plumbing fixtures, HVAC systems, flooring, lighting, water heaters",
        whoBuys: "Homebuilders (new construction), contractors (repair & remodel), commercial developers, homeowners (DIY), building owners (replacement)",
        keyPlayers: ["Carrier Global (HVAC)", "Trane Technologies (HVAC)", "Masco (faucets, cabinets)", "Fortune Brands (Moen)", "Builders FirstSource (distribution)", "Owens Corning (insulation, roofing)", "James Hardie (siding)", "A.O. Smith (water heaters)"],
        trends: "Repair & remodel provides stability (~60% of building products revenue). Energy efficiency driving HVAC upgrades (heat pumps). Housing underbuilt in US. Commercial construction moderating but data center construction booming. Pricing power in concentrated categories (roofing, HVAC)",
      },
      distribution: { name: "Industrial Distribution", fullName: "Industrial & Specialty Distribution", category: "Distribution", color: "#0EA5E9",
        tam: "$200B+ (2025, US)", growth: "~4-6% CAGR", icon: "📦",
        desc: "Wholesale distribution of industrial products — fasteners, safety equipment, electrical supplies, MRO (maintenance, repair, operations). Fragmented market with consolidation opportunity.",
        whatTheySell: "Fasteners, cutting tools, safety equipment, electrical supplies, plumbing, janitorial, MRO supplies, metalworking, power transmission components",
        whoBuys: "Manufacturers, construction companies, government facilities, hospitals, schools — anyone maintaining facilities or running production lines",
        keyPlayers: ["Fastenal", "W.W. Grainger", "MSC Industrial", "Wesco International", "Applied Industrial Technologies", "HD Supply (Home Depot)", "Motion Industries (Genuine Parts)"],
        trends: "E-commerce penetration still low (~15% of industrial distribution). Vending/inventory management solutions (Fastenal). Customer consolidation of suppliers. Private label growth. Fastenal and Grainger gaining share from smaller distributors. Automation in warehouses",
      },
      waste: { name: "Waste Management & Environmental", fullName: "Waste Management & Environmental Services", category: "Environmental Services", color: "#84CC16",
        tam: "$120B+ (2025, US)", growth: "~5-7% CAGR", icon: "♻️",
        desc: "Collection, disposal, and recycling of solid waste, hazardous waste, and environmental remediation. Highly defensive — waste volumes are relatively recession-proof. Consolidated oligopoly in US.",
        whatTheySell: "Residential waste collection, commercial waste collection, landfill disposal, recycling, hazardous waste management, environmental remediation, renewable energy (landfill gas)",
        whoBuys: "Municipalities (residential contracts), commercial businesses, industrial facilities, construction sites, federal government (hazardous/remediation)",
        keyPlayers: ["Waste Management", "Republic Services", "GFL Environmental", "Waste Connections", "Clean Harbors (hazardous)", "Casella Waste", "US Ecology (Republic)"],
        trends: "Pricing power from consolidated market (WM + Republic = ~50% of US market). Sustainability mandates driving recycling investment. Landfill gas-to-energy (renewable natural gas). M&A continues in fragmented segments. PFAS remediation as emerging growth area",
      },
      transport: { name: "Transportation & Logistics", fullName: "Freight, Logistics & Supply Chain Services", category: "Transportation", color: T_.purple,
        tam: "$1T+ (2025, US freight + logistics)", growth: "~3-5% CAGR (cyclical)", icon: "🚛",
        desc: "Movement of goods by truck, rail, air, and ocean, plus logistics services (brokerage, warehousing, last-mile). Highly cyclical — tied to industrial production and consumer spending.",
        whatTheySell: "Truckload/LTL freight, rail transport, air cargo, ocean shipping, freight brokerage, warehousing/3PL, last-mile delivery, supply chain management",
        whoBuys: "Manufacturers, retailers, e-commerce companies, distributors, agricultural producers — any company moving physical goods",
        keyPlayers: ["UPS", "FedEx", "Union Pacific", "BNSF (Berkshire)", "XPO Logistics", "Old Dominion (LTL)", "C.H. Robinson", "J.B. Hunt", "Maersk"],
        trends: "Freight recession 2022-2024 ending, recovery underway. E-commerce driving last-mile investment. Autonomous trucking in early deployment. LTL consolidation (Yellow bankruptcy redistributed share). Rail precision scheduling. Nearshoring benefiting cross-border trucking",
      },
      ec: { name: "Engineering & Construction", fullName: "Engineering, Procurement & Construction (EPC)", category: "Engineering & Construction", color: T_.red,
        tam: "$250B+ (2025, US E&C)", growth: "~5-8% CAGR", icon: "🏗️",
        desc: "Engineering, procurement, and construction services for large infrastructure projects — power plants, data centers, LNG facilities, transportation, and water systems. Project-based with multi-year backlogs.",
        whatTheySell: "Engineering design, procurement management, construction management, EPC turnkey projects, environmental services, maintenance services, program management",
        whoBuys: "Federal/state government (infrastructure), utilities, oil & gas companies, data center operators, industrial manufacturers, mining companies",
        keyPlayers: ["Fluor", "Bechtel (private)", "Jacobs Engineering", "AECOM", "Quanta Services (power)", "MasTec", "EMCOR", "Comfort Systems USA"],
        trends: "Infrastructure Investment & Jobs Act ($1.2T) driving multi-year backlog growth. Data center construction booming. Grid modernization. LNG export facility construction. Skilled labor shortage is the #1 constraint. Quanta and MasTec as electrification plays",
      },
    };
    const TAX = [
      { key: "mach", label: "Machinery", color: T_.amber, icon: "🔩", children: ["machinery"] },
      { key: "elec", label: "Electrical & Automation", color: T_.blue, icon: "⚡", children: ["electrical"] },
      { key: "build", label: "Building Products", color: T_.green, icon: "🏗️", children: ["buildprod"] },
      { key: "dist", label: "Distribution", color: "#0EA5E9", icon: "📦", children: ["distribution"] },
      { key: "env", label: "Environmental Services", color: "#84CC16", icon: "♻️", children: ["waste"] },
      { key: "trans", label: "Transportation", color: T_.purple, icon: "🚛", children: ["transport"] },
      { key: "ec", label: "Engineering & Construction", color: T_.red, icon: "🏗️", children: ["ec"] },
    ];
    return (
    <div>
      <div style={{ marginBottom: 24 }}><div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>Industrials Primer</div><div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Machinery, electrical equipment, building products, distribution, waste, transportation, and E&C</div></div>
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Industrials — Value Chain</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>From raw materials through manufacturing and distribution to end markets. The industrial economy is cyclical but increasingly benefiting from electrification, reshoring, and infrastructure investment.</div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          {[
            { label: "Raw Materials", color: T_.textGhost, icon: "⛏️", desc: "Metals, chemicals, energy",
              rows: [{ sub: "Steel / Metals", ex: "Nucor, Steel Dynamics, Alcoa" }, { sub: "Chemicals", ex: "Dow, BASF, Linde" }, { sub: "Energy", ex: "Oil, gas, electricity" }],
              buyers: "Manufacturers, builders" },
            { label: "Components / Mfg", color: T_.amber, icon: "🔩", desc: "Parts & sub-assemblies",
              rows: [{ sub: "Machinery Parts", ex: "Parker Hannifin, Roper, ITW" }, { sub: "Electrical", ex: "Eaton, Schneider, ABB" }, { sub: "Building Products", ex: "Carrier, Trane, Owens Corning" }],
              buyers: "OEMs, contractors, end users" },
            { label: "Assembly / OEM", color: T_.blue, icon: "🏭", desc: "Final equipment production",
              rows: [{ sub: "Heavy Equipment", ex: "Caterpillar, Deere, Komatsu" }, { sub: "Automation", ex: "Rockwell, Fanuc, Keyence" }, { sub: "Vehicles", ex: "PACCAR, Daimler Truck" }],
              buyers: "Distributors, end users" },
            { label: "Distribution", color: "#0EA5E9", icon: "📦", desc: "Wholesale & logistics",
              rows: [{ sub: "Industrial Dist", ex: "Fastenal, Grainger, MSC" }, { sub: "Freight", ex: "UPS, FedEx, XPO, Old Dominion" }, { sub: "E&C Services", ex: "Quanta, Fluor, AECOM" }],
              buyers: "End market customers" },
            { label: "End Markets", color: "#6366F1", icon: "🏗️", desc: "Final demand",
              rows: [{ sub: "Construction", ex: "Residential, commercial, infra" }, { sub: "Manufacturing", ex: "Discrete, process, auto" }, { sub: "Energy / Utilities", ex: "Power gen, grid, oil & gas" }, { sub: "Government", ex: "Federal, state, municipal" }],
              buyers: "Driven by GDP, investment, and policy" },
          ].map((stage, i, arr) => (
            <div key={stage.label} style={{ display: "flex", alignItems: "stretch" }}>
              <div style={{ flex: 1, background: stage.color + "0A", border: `1px solid ${stage.color}33`, borderRadius: 8, padding: "12px 12px", minWidth: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}><span style={{ fontSize: 14 }}>{stage.icon}</span><span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.label}</span></div>
                <div style={{ fontSize: 11, color: T_.textDim, marginBottom: 10 }}>{stage.desc}</div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                  {stage.rows.map(r => (<div key={r.sub} style={{ background: T_.bg, borderRadius: 5, padding: "5px 8px" }}><div style={{ fontSize: 11, fontWeight: 600, color: stage.color }}>{r.sub}</div><div style={{ fontSize: 10, color: T_.textDim, lineHeight: 1.4 }}>{r.ex}</div></div>))}
                </div>
                <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8, borderTop: `1px solid ${T_.borderLight}`, paddingTop: 5 }}><span style={{ fontWeight: 600 }}>Buyers:</span> {stage.buyers}</div>
              </div>
              {i < arr.length - 1 && <div style={{ display: "flex", alignItems: "center", padding: "0 4px", color: T_.textGhost, fontSize: 16, flexShrink: 0 }}>&#8594;</div>}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>Industrials are cyclical but benefiting from structural tailwinds: electrification, grid modernization, reshoring, infrastructure spending (IIJA), and data center buildout. The best industrial businesses have high aftermarket mix (recurring) and pricing power.</div>
      </div>
      {/* Taxonomy */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Industrials Taxonomy</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Click to expand</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {TAX.map(cat => (
            <div key={cat.key}>
              <div onClick={() => toggle("indtax_" + cat.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: isExp("indtax_" + cat.key) ? cat.color + "22" : T_.bg, borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("indtax_" + cat.key) ? cat.color + "44" : T_.border}` }}>
                <span style={{ fontSize: 16 }}>{cat.icon}</span><span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsector{cat.children.length > 1 ? "s" : ""}</span>
                <span style={{ fontSize: 12, color: T_.textGhost, transform: isExp("indtax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span>
              </div>
              {isExp("indtax_" + cat.key) && <div style={{ marginLeft: 32, marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>{cat.children.map(ck => { const sub = SUBS[ck]; if (!sub) return null; return (
                <div key={ck} onClick={() => toggle("indsub_" + ck)} style={{ padding: "10px 16px", background: isExp("indsub_" + ck) ? T_.bgInput : T_.bg, borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span><span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span><span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span><span style={{ fontSize: 13, color: T_.textGhost, transform: isExp("indsub_" + ck) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span></div>
                  {isExp("indsub_" + ck) && <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T_.borderLight}` }} onClick={e => e.stopPropagation()}>
                    <div style={{ fontSize: 13, color: T_.textMid, marginBottom: 8, lineHeight: 1.5 }}>{sub.desc}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>What They Sell</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whatTheySell}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Who Buys</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whoBuys}</div></div></div>
                    <div style={{ marginBottom: 8 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Players</div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{sub.keyPlayers.map(p => <span key={p} style={{ fontSize: 12, padding: "3px 10px", background: cat.color + "22", color: cat.color, borderRadius: 10, border: `1px solid ${cat.color}44` }}>{p}</span>)}</div></div>
                    <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Trends</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.5 }}>{sub.trends}</div></div>
                  </div>}
                </div>); })}</div>}
            </div>
          ))}
        </div>
      </div>
      {/* Subsector TAM Cards */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Subsector Overview — TAM & Growth</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
          {Object.entries(SUBS).map(([key, sub]) => (
            <div key={key} style={{ padding: "12px 14px", background: T_.bg, borderRadius: 8, border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer" }} onClick={() => { const cat = TAX.find(t => t.children.includes(key)); if (cat) forceOpen("indtax_" + cat.key, "indsub_" + key); }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.name}</span></div>
              <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 6 }}>{sub.category}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>TAM</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.tam}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>Growth</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.green }}>{sub.growth}</div></div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Revenue Models */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Industrial Revenue Models</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How industrial companies make money. The best businesses combine equipment sales with high-margin aftermarket revenue.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { name: "Equipment Sales + Aftermarket", color: T_.amber, icon: "🔩",
              how: "Sell capital equipment (machinery, vehicles, HVAC) upfront, then earn recurring revenue from parts, service, and maintenance over the equipment's 10-20+ year life. The 'razor and blade' of industrials. Aftermarket revenue is 3-5x the initial equipment sale over product life",
              economics: "Equipment gross margins: 25-35%. Aftermarket gross margins: 45-65%. Aftermarket as % of revenue: 30-50% for best-in-class (Caterpillar ~55%, Deere ~35%). Installed base of millions of machines creates decades of parts demand. Aftermarket is less cyclical than new equipment",
              examples: "Caterpillar (equipment + Cat parts/service), John Deere (equipment + precision ag subscriptions), Carrier/Trane (HVAC equipment + service contracts), Parker Hannifin (motion/control components + aftermarket)",
              valuation: "15-25x EBITDA for high-aftermarket industrials. Caterpillar at ~17x. Companies with >40% aftermarket/services mix command premium. Pure equipment companies (no aftermarket): 8-12x. The aftermarket mix is the single most important valuation driver in industrials",
              transition: "Every industrial company is growing aftermarket and services. Connected equipment (IoT/telematics) enables predictive maintenance and parts ordering. Deere's precision ag subscription model is the gold standard. Equipment-as-a-service (rental/leasing) also growing" },
            { name: "Service Contracts (Recurring)", color: T_.green, icon: "🔄",
              how: "Multi-year contracts for maintenance, monitoring, and operations of installed equipment or systems. Revenue recognized ratably. Provides predictable recurring revenue stream and customer lock-in. Common in HVAC, elevator, fire/security, and building automation",
              economics: "Gross margins: 40-55%. Contract retention: 90-95%. Revenue visibility: 2-5 year contracts. Service revenue per technician: $200-400K. The installed base grows as new equipment is sold — creating a compounding annuity. Elevator service is the classic example (Otis generates 60% of revenue from service)",
              examples: "Otis Elevator (60% service revenue, 95%+ retention), Carrier (building services), Trane Technologies (HVAC service), Honeywell Building Solutions, EMCOR (facility services)",
              valuation: "Premium multiples: 18-28x EBITDA for service-heavy industrials. Otis at ~25x. Market rewards the recurring, high-retention nature. Service contracts create a 'recurring revenue industrial' that trades more like software than manufacturing",
              transition: "The megatrend in industrials — shifting from transactional equipment sales to recurring service models. IoT and predictive analytics enable condition-based maintenance (service only when needed). Building automation and smart building platforms driving service attach rates" },
            { name: "Distribution Markup", color: "#0EA5E9", icon: "📦",
              how: "Industrial distributors buy products from manufacturers at wholesale and sell to end users at a markup. Revenue = cost + gross margin (typically 25-40%). Value-add: inventory availability, technical expertise, credit extension, logistics, and vending/VMI solutions",
              economics: "Gross margins: 28-42% (Fastenal ~46%, Grainger ~39%). Operating margins: 12-20%. Revenue per employee: $300-600K. Key metric: same-day/next-day fill rate (95%+ target). Working capital intensive (inventory). Scale drives purchasing leverage",
              examples: "Fastenal ($7.5B, fasteners/safety), Grainger ($17B, MRO), MSC Industrial ($4B, metalworking), Wesco ($22B, electrical), Applied Industrial ($4.5B, bearings/power transmission)",
              valuation: "15-22x EBITDA for leading distributors. Fastenal at ~30x earnings (premium for execution). Market rewards share gainers with high incremental margins. The thesis: distribution is consolidating, large players gain share from thousands of small distributors",
              transition: "E-commerce disruption is slower than feared — customers value technical expertise and same-day availability. Vending machines (Fastenal has 120K+) and VMI (vendor-managed inventory) create switching costs. Amazon Business is a long-term threat but hasn't materially impacted leaders" },
            { name: "Project-Based / EPC", color: T_.red, icon: "🏗️",
              how: "Engineering and construction companies execute large-scale projects on cost-plus, fixed-price, or lump-sum contracts. Revenue recognized over project life (percentage of completion). Projects range from $10M to $10B+ and last 1-5+ years",
              economics: "Gross margins: 8-15% (construction). Operating margins: 4-8% for E&C firms. Fixed-price contracts carry margin risk (cost overruns). Cost-plus is safer but lower margin. Backlog provides revenue visibility (1-3 years typically). Labor productivity is the key margin driver",
              examples: "Quanta Services ($23B, power/utility E&C), Fluor ($16B, diversified E&C), AECOM ($16B, infrastructure), MasTec ($13B, infrastructure), EMCOR ($14B, mechanical/electrical)",
              valuation: "10-16x EBITDA for E&C firms. Premium for specialty niches (Quanta in power, EMCOR in mechanical). Discount for cost-overrun prone fixed-price heavy civil. Backlog quality (funded, probability-weighted) matters. Market rewards margin consistency over growth",
              transition: "Electrification and grid modernization driving multi-year demand cycle. Data center construction is the fastest-growing end market. IIJA ($1.2T) and IRA (clean energy) creating secular demand. Skilled labor shortage is the binding constraint — companies with strong labor forces have competitive advantage" },
            { name: "Fleet / Leasing", color: T_.purple, icon: "🚛",
              how: "Companies own and lease equipment fleets — trucks, trailers, containers, construction equipment — to customers who prefer operating expense over capital expenditure. Revenue from lease payments, maintenance, and asset disposition. Capital-intensive but predictable",
              economics: "Utilization rate is the key metric (target: 70-85% for equipment, 90%+ for trucks). Lease terms: 3-7 years typically. Residual value risk on owned assets. ROA: 5-10%. Revenue = monthly lease rate x fleet size x utilization. Maintenance and fuel add ancillary revenue",
              examples: "United Rentals ($15B, equipment rental), Penske Truck Leasing, Ryder System, GATX (railcar leasing), Triton (container leasing), Herc Holdings (equipment rental)",
              valuation: "8-14x EBITDA for rental/leasing companies. United Rentals at ~11x. Market rewards fleet utilization, pricing discipline, and fleet age management. Rental penetration in construction is ~55% and growing (vs ownership). Scale advantages in procurement and logistics",
              transition: "Equipment rental gaining share vs. ownership (more flexible, less capital for customers). United Rentals dominating through acquisitions. Electric equipment fleet transition beginning. Connected fleet (telematics) improving utilization and reducing theft/damage" },
          ].map((model, i) => (
            <div key={i} style={{ background: T_.bg, borderRadius: 10, border: `1px solid ${model.color}33`, borderLeft: `4px solid ${model.color}`, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><span style={{ fontSize: 20 }}>{model.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: model.color }}>{model.name}</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>How It Works</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.how}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Unit Economics</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.economics}</div></div></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Examples</div><div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{model.examples}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Valuation Impact</div><div style={{ fontSize: 13, color: T_.green, lineHeight: 1.6 }}>{model.valuation}</div></div></div>
              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Transition Dynamics</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{model.transition}</div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Key Concepts */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { title: "Book-to-Bill", desc: "New orders received / revenue recognized in a period. Above 1.0x means backlog is growing (demand > supply). Below 1.0x means backlog is shrinking. A leading indicator of future revenue. Caterpillar book-to-bill of 1.2x signals strong demand ahead." },
            { title: "Aftermarket Mix", desc: "Aftermarket (parts, service, maintenance) as a % of total revenue. Higher mix = more recurring, higher-margin, less cyclical revenue. Best-in-class: Otis 60%, Caterpillar 55%, Deere 35%. Every industrial company is trying to grow this metric. It's the primary driver of valuation re-rating." },
            { title: "Industrial Production (IP)", desc: "Federal Reserve index measuring output of US factories, mines, and utilities. The key macro indicator for industrials. IP growth of 2-3% signals healthy demand. Negative IP = industrial recession. IP correlates strongly with industrial equipment orders and distribution sales." },
            { title: "Capacity Utilization", desc: "How much of manufacturing capacity is being used. US average: ~78% (2025). Above 80% = tight, encourages capital investment. Below 75% = excess capacity, capex deferred. High utilization benefits equipment makers (Caterpillar, Deere) and distributors (Fastenal, Grainger)." },
            { title: "Reshoring / Nearshoring", desc: "Moving manufacturing back to the US (reshoring) or to Mexico/LATAM (nearshoring) from Asia. Driven by supply chain risk, tariffs, CHIPS Act, IRA incentives. Creating $200B+ in announced US factory construction. Benefits industrial distributors, E&C firms, electrical equipment, and automation companies." },
          ].map((c, i) => (
            <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>);
  }

  // ═══════════════════════════════════════════════════════════════════
  // AEROSPACE & DEFENSE
  // ═══════════════════════════════════════════════════════════════════
  if (subTab === "aerodefense") {
    const SUBS = {
      primes: { name: "Defense Primes", fullName: "Large Defense Prime Contractors", category: "Defense", color: T_.blue,
        tam: "$450B+ (2025, US defense spending)", growth: "~4-6% CAGR", icon: "🎖️",
        desc: "The largest defense contractors serving as prime system integrators for major weapons programs — fighter jets, missiles, naval vessels, satellites, and command systems. Deep government relationships and security clearances create enormous barriers to entry.",
        whatTheySell: "Fighter aircraft (F-35, F/A-18), missiles and munitions, naval combat systems, satellites, C4ISR systems, missile defense, ground vehicles, nuclear deterrence",
        whoBuys: "US Department of Defense (~60% of revenue), allied nations (FMS — Foreign Military Sales ~20%), intelligence agencies, NATO",
        keyPlayers: ["Lockheed Martin", "RTX (Raytheon)", "Northrop Grumman", "General Dynamics", "Boeing Defense", "L3Harris Technologies", "BAE Systems"],
        trends: "Defense budgets rising globally (Ukraine, China/Taiwan threat). Munitions stockpile replenishment ($30B+ multi-year). F-35 sustainment is the largest program ($1.7T lifecycle). AUKUS driving allied procurement. Space and cyber fastest-growing domains",
      },
      commercialoem: { name: "Commercial Aerospace OEM", fullName: "Commercial Aircraft & Engine OEMs", category: "Commercial Aerospace", color: T_.green,
        tam: "$350B+ (2025, commercial aerospace)", growth: "~6-8% CAGR", icon: "✈️",
        desc: "Manufacturers of commercial aircraft and jet engines. Boeing-Airbus duopoly in large aircraft. Engine market is a triopoly (GE Aerospace, Pratt & Whitney, Rolls-Royce). Multi-year production backlogs.",
        whatTheySell: "Narrow-body aircraft (737 MAX, A320neo), wide-body aircraft (787, A350), regional jets, jet engines (LEAP, GTF, GE9X), avionics, landing gear",
        whoBuys: "Airlines (American, Delta, United, Southwest, Ryanair), lessors (AerCap, Air Lease), cargo operators (FedEx, UPS), governments",
        keyPlayers: ["Airbus", "Boeing", "GE Aerospace (engines)", "RTX/Pratt & Whitney (engines)", "Rolls-Royce (engines)", "Embraer", "Bombardier"],
        trends: "Boeing in crisis (quality issues, production limits, FAA scrutiny). Airbus winning market share (massive backlog: 8,600+ aircraft). Engine OEMs thriving — LEAP and GTF programs driving aftermarket. Aircraft demand exceeds supply through 2030+. Single-aisle production ramp is the key bottleneck",
      },
      aerostructures: { name: "Aerostructures & Components", fullName: "Aerostructures, Systems & Components", category: "Supply Chain", color: T_.amber,
        tam: "$120B+ (2025, global aerostructures + components)", growth: "~6-8% CAGR", icon: "🔧",
        desc: "Tier 1-3 suppliers making fuselages, wings, nacelles, landing gear, avionics, actuators, and other aircraft components. Supply chain health is critical — Boeing's issues trace partly to supplier quality.",
        whatTheySell: "Fuselage sections, wing components, nacelles, landing gear, flight controls, actuators, avionics, wiring harnesses, interiors (seats, galleys, lavatories)",
        whoBuys: "Boeing, Airbus, engine OEMs (GE, RTX), defense primes, MRO providers, airlines (spare parts)",
        keyPlayers: ["Spirit AeroSystems (Boeing acquired)", "Safran", "TransDigm", "HEICO", "Howmet Aerospace", "Moog", "Ducommun", "Triumph Group"],
        trends: "TransDigm and HEICO dominant in proprietary aftermarket parts (sole-source pricing power). Supply chain recovery still underway post-COVID. Labor shortages in manufacturing. Sole-source parts command 50-70% gross margins. Boeing supply chain quality under intense scrutiny",
      },
      defenseelec: { name: "Defense Electronics & C4ISR", fullName: "Defense Electronics, Sensors & Command Systems", category: "Defense Technology", color: T_.red,
        tam: "$100B+ (2025, global)", growth: "~5-8% CAGR", icon: "📡",
        desc: "Electronic warfare, radar, communications, intelligence/surveillance/reconnaissance (ISR), and command-and-control systems. The 'brains' of modern military operations — increasingly software-defined.",
        whatTheySell: "Radar systems, electronic warfare (EW), ISR sensors, tactical communications, satellite ground systems, cybersecurity, mission computing, GPS/PNT",
        whoBuys: "US DoD (Army, Navy, Air Force, Space Force), intelligence community (CIA, NRO, NSA), allied militaries, border security agencies",
        keyPlayers: ["L3Harris", "Northrop Grumman (sensors)", "RTX (radar, EW)", "Elbit Systems", "BAE Systems (EW)", "Mercury Systems", "CACI International", "Leidos"],
        trends: "Software-defined everything (open architecture, MOSA). JADC2 (Joint All-Domain Command and Control) driving network investment. Electronic warfare as growth domain. Autonomous systems and AI for ISR. Space-based ISR growing. Cyber as fastest-growing defense budget line",
      },
      mro: { name: "MRO & Aftermarket", fullName: "Maintenance, Repair & Overhaul + Aftermarket Parts", category: "Aftermarket", color: T_.purple,
        tam: "$90B+ (2025, commercial MRO)", growth: "~5-7% CAGR", icon: "🔧",
        desc: "Maintenance, repair, and overhaul of commercial aircraft and engines, plus proprietary aftermarket parts distribution. MRO is the recurring revenue stream of aerospace — airlines must maintain aircraft regardless of economic conditions.",
        whatTheySell: "Engine overhaul, airframe heavy maintenance, component repair, line maintenance, PMA parts, DER repairs, avionics upgrades, modifications",
        whoBuys: "Airlines (in-house or outsourced), cargo operators, military operators, lessors. Mandated by FAA airworthiness requirements — not discretionary",
        keyPlayers: ["GE Aerospace (engine MRO)", "RTX/Pratt & Whitney (engine MRO)", "Lufthansa Technik", "ST Engineering", "AAR Corp", "TransDigm (aftermarket parts)", "HEICO (aftermarket parts)", "MTU Aero Engines"],
        trends: "Fleet aging drives MRO demand (average aircraft age ~12 years). GTF (Pratt) engine inspection mandate creating surge demand. Engine shop visits at record levels. TransDigm/HEICO pricing power on sole-source parts. PMA parts adoption growing as airlines seek cost savings",
      },
      space: { name: "Space & Launch Services", fullName: "Space Systems, Launch Services & Satellite Manufacturing", category: "Space", color: "#06B6D4",
        tam: "$60B+ (2025, global space economy government + commercial)", growth: "~8-12% CAGR", icon: "🚀",
        desc: "Satellite manufacturing, launch services, space station operations, and space-based intelligence. SpaceX has revolutionized launch economics. Space is increasingly a commercial market, not just government.",
        whatTheySell: "Launch services (rockets), satellite manufacturing (comms, Earth observation, navigation), space station operations, ground systems, space-based ISR, in-space servicing",
        whoBuys: "US Space Force, NRO, NASA, commercial satellite operators (SES, Intelsat), commercial space stations, scientific missions",
        keyPlayers: ["SpaceX (dominant launch)", "United Launch Alliance (Boeing/Lockheed)", "Northrop Grumman (satellites, Antares)", "L3Harris (space sensors)", "Rocket Lab", "Blue Origin", "Planet Labs (Earth observation)"],
        trends: "SpaceX Starship revolutionizing heavy lift. Proliferated LEO (hundreds of small sats vs. few large GEO). Space Force budget growing double digits. Commercial space stations replacing ISS (2030). On-orbit servicing and space debris as emerging markets. Rocket Lab gaining traction",
      },
    };
    const TAX = [
      { key: "defense", label: "Defense", color: T_.blue, icon: "🎖️", children: ["primes"] },
      { key: "commaero", label: "Commercial Aerospace", color: T_.green, icon: "✈️", children: ["commercialoem"] },
      { key: "supply", label: "Supply Chain", color: T_.amber, icon: "🔧", children: ["aerostructures"] },
      { key: "deftech", label: "Defense Technology", color: T_.red, icon: "📡", children: ["defenseelec"] },
      { key: "after", label: "Aftermarket / MRO", color: T_.purple, icon: "🔧", children: ["mro"] },
      { key: "space", label: "Space", color: "#06B6D4", icon: "🚀", children: ["space"] },
    ];
    return (
    <div>
      <div style={{ marginBottom: 24 }}><div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>Aerospace & Defense Primer</div><div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Defense primes, commercial OEMs, aerostructures, defense electronics, MRO, and space</div></div>
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Aerospace & Defense — Value Chain</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>From R&D through manufacturing and integration to operations and sustainment. Both defense and commercial aerospace follow this pattern, with different funding sources and timelines.</div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          {[
            { label: "R&D / Design", color: T_.blue, icon: "🔬", desc: "Concept to prototype",
              rows: [{ sub: "Defense R&D", ex: "DARPA, prime IR&D, SBIRs" }, { sub: "Commercial R&D", ex: "Boeing, Airbus, GE Aerospace" }, { sub: "Space R&D", ex: "SpaceX, NASA, NRO" }],
              buyers: "DoD, NASA, OEMs (self-funded)" },
            { label: "Manufacturing", color: T_.amber, icon: "🏭", desc: "Build components & systems",
              rows: [{ sub: "Aerostructures", ex: "Spirit, Safran, Howmet" }, { sub: "Engines", ex: "GE Aerospace, Pratt & Whitney" }, { sub: "Electronics", ex: "L3Harris, Northrop, RTX" }, { sub: "Components", ex: "TransDigm, HEICO, Moog" }],
              buyers: "OEMs, primes, airlines" },
            { label: "Systems Integration", color: T_.green, icon: "🔗", desc: "Assemble & test",
              rows: [{ sub: "Defense Primes", ex: "Lockheed, Northrop, GD" }, { sub: "Aircraft OEM", ex: "Boeing, Airbus, Embraer" }, { sub: "Space Systems", ex: "SpaceX, ULA, Northrop" }],
              buyers: "DoD, airlines, lessors, NASA" },
            { label: "Operations / MRO", color: T_.purple, icon: "🔧", desc: "Sustain & maintain",
              rows: [{ sub: "Engine MRO", ex: "GE, Pratt, Lufthansa Technik" }, { sub: "Airframe MRO", ex: "ST Engineering, AAR Corp" }, { sub: "Parts/Aftermarket", ex: "TransDigm, HEICO" }],
              buyers: "Airlines, military operators" },
            { label: "End Customer", color: "#6366F1", icon: "👥", desc: "Operators & end users",
              rows: [{ sub: "DoD / Military", ex: "US, NATO, allied nations" }, { sub: "Airlines", ex: "Delta, United, Ryanair" }, { sub: "Space Operators", ex: "SpaceX, SES, Planet Labs" }, { sub: "Government (civil)", ex: "NASA, FAA, NOAA" }],
              buyers: "Defense budgets, passenger demand" },
          ].map((stage, i, arr) => (
            <div key={stage.label} style={{ display: "flex", alignItems: "stretch" }}>
              <div style={{ flex: 1, background: stage.color + "0A", border: `1px solid ${stage.color}33`, borderRadius: 8, padding: "12px 12px", minWidth: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}><span style={{ fontSize: 14 }}>{stage.icon}</span><span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.label}</span></div>
                <div style={{ fontSize: 11, color: T_.textDim, marginBottom: 10 }}>{stage.desc}</div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                  {stage.rows.map(r => (<div key={r.sub} style={{ background: T_.bg, borderRadius: 5, padding: "5px 8px" }}><div style={{ fontSize: 11, fontWeight: 600, color: stage.color }}>{r.sub}</div><div style={{ fontSize: 10, color: T_.textDim, lineHeight: 1.4 }}>{r.ex}</div></div>))}
                </div>
                <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8, borderTop: `1px solid ${T_.borderLight}`, paddingTop: 5 }}><span style={{ fontWeight: 600 }}>Buyers:</span> {stage.buyers}</div>
              </div>
              {i < arr.length - 1 && <div style={{ display: "flex", alignItems: "center", padding: "0 4px", color: T_.textGhost, fontSize: 16, flexShrink: 0 }}>&#8594;</div>}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>A&D has the longest product cycles of any industry — an aircraft program takes 10-15 years from concept to delivery and operates for 30+ years. Defense programs are funded by government budgets (visible, predictable). Commercial aerospace is driven by airline demand (cyclical but growing secularly).</div>
      </div>
      {/* Taxonomy */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Aerospace & Defense Taxonomy</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Click to expand</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {TAX.map(cat => (
            <div key={cat.key}>
              <div onClick={() => toggle("adtax_" + cat.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: isExp("adtax_" + cat.key) ? cat.color + "22" : T_.bg, borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("adtax_" + cat.key) ? cat.color + "44" : T_.border}` }}>
                <span style={{ fontSize: 16 }}>{cat.icon}</span><span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsector{cat.children.length > 1 ? "s" : ""}</span>
                <span style={{ fontSize: 12, color: T_.textGhost, transform: isExp("adtax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span>
              </div>
              {isExp("adtax_" + cat.key) && <div style={{ marginLeft: 32, marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>{cat.children.map(ck => { const sub = SUBS[ck]; if (!sub) return null; return (
                <div key={ck} onClick={() => toggle("adsub_" + ck)} style={{ padding: "10px 16px", background: isExp("adsub_" + ck) ? T_.bgInput : T_.bg, borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span><span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span><span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span><span style={{ fontSize: 13, color: T_.textGhost, transform: isExp("adsub_" + ck) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span></div>
                  {isExp("adsub_" + ck) && <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T_.borderLight}` }} onClick={e => e.stopPropagation()}>
                    <div style={{ fontSize: 13, color: T_.textMid, marginBottom: 8, lineHeight: 1.5 }}>{sub.desc}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>What They Sell</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whatTheySell}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Who Buys</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whoBuys}</div></div></div>
                    <div style={{ marginBottom: 8 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Players</div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{sub.keyPlayers.map(p => <span key={p} style={{ fontSize: 12, padding: "3px 10px", background: cat.color + "22", color: cat.color, borderRadius: 10, border: `1px solid ${cat.color}44` }}>{p}</span>)}</div></div>
                    <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Trends</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.5 }}>{sub.trends}</div></div>
                  </div>}
                </div>); })}</div>}
            </div>
          ))}
        </div>
      </div>
      {/* Subsector TAM Cards */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Subsector Overview — TAM & Growth</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
          {Object.entries(SUBS).map(([key, sub]) => (
            <div key={key} style={{ padding: "12px 14px", background: T_.bg, borderRadius: 8, border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer" }} onClick={() => { const cat = TAX.find(t => t.children.includes(key)); if (cat) forceOpen("adtax_" + cat.key, "adsub_" + key); }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.name}</span></div>
              <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 6 }}>{sub.category}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>TAM</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.tam}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>Growth</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.green }}>{sub.growth}</div></div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Revenue Models */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>A&D Revenue Models</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How A&D companies make money. Defense is government-funded (cost-plus or fixed-price contracts). Commercial aerospace is market-driven with the aftermarket generating the highest margins.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { name: "Government Cost-Plus Contracts", color: T_.blue, icon: "📋",
              how: "The government reimburses the contractor for allowable costs plus a negotiated fee (profit margin). Used for R&D, complex development programs, and early production. Contractor bears minimal cost risk — if costs increase, the government pays more. Fee is typically 8-12% of costs",
              economics: "Operating margins: 8-12% (fee on top of costs). Revenue is highly predictable (funded by appropriations). Risk is low but margins are capped. Cost-plus represents ~30-40% of defense prime revenue. The contractor is incentivized to maximize cost (misaligned incentive) — mitigated by DCMA auditing",
              examples: "Lockheed Martin F-35 development (SDD phase was cost-plus), Northrop Grumman B-21 Raider early phase, major satellite development programs, NASA contracts (James Webb Telescope — massive cost overruns)",
              valuation: "Cost-plus revenue valued at 10-14x EBITDA. Lower than commercial/aftermarket due to capped margins. But highly predictable — the government almost never cancels major programs. Investors view cost-plus as 'bond-like' revenue",
              transition: "DoD shifting toward fixed-price for production to control costs. But complex development programs will remain cost-plus (too much technical risk for fixed-price). The margin opportunity is in transitioning from cost-plus development to fixed-price production as programs mature" },
            { name: "Fixed-Price Production", color: T_.green, icon: "🏭",
              how: "Contractor delivers a defined product at a fixed price. If costs come in below the fixed price, the contractor keeps the profit. If costs overrun, the contractor absorbs the loss. Used for production lots once design is mature. Variants include firm-fixed-price (FFP) and fixed-price-incentive (FPI)",
              economics: "Operating margins: 10-15% target (but can range from -5% to 20% depending on execution). Revenue is predictable (funded lots). Risk is higher than cost-plus — cost overruns destroy margins. Learning curve: each successive production lot should cost less (80-85% learning curve). LRIP has lower margins than FRP",
              examples: "Lockheed Martin F-35 LRIP/FRP lots ($80M-90M per aircraft), RTX Patriot missile production, General Dynamics Abrams tank production, Boeing KC-46 tanker (fixed-price loss program)",
              valuation: "Fixed-price production valued at 12-16x EBITDA — higher than cost-plus due to margin expansion potential. Market rewards programs on the learning curve (margins improve each lot). Penalizes programs with cost overruns (Boeing KC-46, SNC Gorgon Stare)",
              transition: "The profitable sweet spot is mature production programs with decades of backlog (F-35 will produce through 2040+). The risk is taking on fixed-price contracts before design is fully mature — Boeing's KC-46 and fixed-price MQ-25 demonstrate this risk. DoD increasingly mandating fixed-price" },
            { name: "Aftermarket / MRO", color: T_.purple, icon: "🔧",
              how: "Revenue from maintaining, repairing, and overhauling aircraft, engines, and defense systems throughout their 20-40 year operational lives. Includes proprietary spare parts, engine overhauls, airframe maintenance, modifications, and sustainment contracts. Often sole-source (only the OEM can provide parts)",
              economics: "Gross margins: 50-70% for proprietary aftermarket parts (TransDigm at 59%). Engine MRO margins: 20-30%. Defense sustainment margins: 10-15%. Aftermarket is recurring — aircraft fly for 30+ years. Each engine shop visit costs $3-8M. TransDigm's model: acquire companies with sole-source parts and raise prices",
              examples: "GE Aerospace (engine aftermarket ~60% of revenue), TransDigm ($7B+ revenue, 59% gross margin from sole-source parts), HEICO (PMA alternative parts), RTX/Pratt & Whitney engine MRO, Lockheed F-35 sustainment ($15B/yr)",
              valuation: "25-40x EBITDA for aftermarket-heavy businesses. TransDigm at ~30x. HEICO at ~45x. Premium for sole-source pricing power, recurring demand, and non-discretionary nature (FAA mandates maintenance). The highest-quality revenue stream in A&D",
              transition: "Aftermarket is the value creation engine in A&D. Every new aircraft or engine sold creates 20-40 years of aftermarket revenue. GE Aerospace sells engines at low/negative margin to capture the aftermarket annuity. TransDigm/HEICO acquisition model: buy companies with sole-source IP" },
            { name: "Commercial OEM Sales", color: T_.amber, icon: "✈️",
              how: "Sale of new commercial aircraft and engines to airlines and lessors. Aircraft priced at list ($100-450M+ per aircraft) but typically sold at 40-60% discount. Engines often sold at or below cost to capture aftermarket. Multi-year backlogs (Airbus: 8,600+ aircraft)",
              economics: "Aircraft OEM margins: 8-12% operating (Boeing targeting 10%+ recovery). Engine OEM margins on new sales: 0-5% (loss leader for aftermarket). Airbus delivers ~735 aircraft/year (targeting 75/month). Boeing: ~400-500 (production limited). Revenue recognized on delivery. Progress payments from airlines fund production",
              examples: "Airbus A320neo family ($110M list, $50-60M typical), Boeing 737 MAX ($120M list), GE LEAP engine ($15M list), Pratt & Whitney GTF engine",
              valuation: "Aircraft OEMs: 15-20x normalized earnings. Boeing currently depressed due to quality/production issues (trading on recovery optionality). Engine OEMs (GE Aerospace): 30-40x — market values the aftermarket annuity created by each engine sold. New engine programs are investments in future aftermarket",
              transition: "Single-aisle production ramp is the dominant commercial aerospace story through 2030. Boeing must recover production quality and rate. Airbus constrained by supply chain. Engine demand exceeds capacity (3-year lead times). Next-gen aircraft (Boeing NMA replacement, potential new narrowbody) not expected until 2035+" },
            { name: "Space Launch Services", color: "#06B6D4", icon: "🚀",
              how: "Revenue from launching payloads to orbit — satellites, space station cargo, national security payloads. Priced per launch or per kg to orbit. SpaceX has driven costs down 10x with reusable Falcon 9. Starship promises another 10x reduction",
              economics: "Falcon 9 launch price: $67M (partially reusable). Starship target: $10-20M per launch (fully reusable). ULA Vulcan: ~$100-150M. Rocket Lab Electron: $7.5M (small sat). Launch margins: 20-40% estimated for SpaceX. Government contracts (NSSL) have higher pricing and margins",
              examples: "SpaceX Falcon 9/Heavy ($67-150M per launch, 90+ launches/year), ULA Vulcan (NSSL), Rocket Lab Electron/Neutron, Blue Origin New Glenn, Arianespace Ariane 6",
              valuation: "SpaceX private at ~$350B valuation (includes Starlink). Rocket Lab public at ~$10B. Launch is increasingly a commodity — SpaceX dominance compresses pricing. Market values vertical integration (SpaceX launches its own Starlink constellation). Starship success could be transformational",
              transition: "SpaceX has ~65% of global commercial launch market. Starship success would enable entirely new applications (space stations, lunar missions, point-to-point transport). Government launch remains higher-priced (NSSL Phase 3 contracts). Small sat launch market growing (Rocket Lab, Firefly)" },
          ].map((model, i) => (
            <div key={i} style={{ background: T_.bg, borderRadius: 10, border: `1px solid ${model.color}33`, borderLeft: `4px solid ${model.color}`, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><span style={{ fontSize: 20 }}>{model.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: model.color }}>{model.name}</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>How It Works</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.how}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Unit Economics</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.economics}</div></div></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Examples</div><div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{model.examples}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Valuation Impact</div><div style={{ fontSize: 13, color: T_.green, lineHeight: 1.6 }}>{model.valuation}</div></div></div>
              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Transition Dynamics</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{model.transition}</div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Key Concepts */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { title: "Backlog", desc: "Total value of firm orders not yet delivered/recognized as revenue. The primary forward indicator in A&D. Lockheed Martin backlog: $166B (3x annual revenue). Airbus backlog: 8,600+ aircraft (~12 years of production). Higher backlog = more revenue visibility and certainty." },
            { title: "Book-to-Bill", desc: "New orders received / revenue recognized. Above 1.0x means backlog is growing. Defense primes targeting 1.0-1.1x in peacetime, higher during rearmament cycles. Commercial aerospace book-to-bill can exceed 2.0x during order boom cycles (like current single-aisle demand)." },
            { title: "LRIP vs FRP", desc: "Low-Rate Initial Production (LRIP) is early production at low volumes to validate manufacturing before Full-Rate Production (FRP). LRIP lots have lower margins (learning curve, setup costs). FRP lots have mature margins. F-35 transitioned from LRIP to FRP in 2023 after 15+ years of LRIP." },
            { title: "IDIQ Contracts", desc: "Indefinite Delivery/Indefinite Quantity — a contract framework where the government sets a ceiling value and orders specific quantities over time (task orders). Common in services and sustainment. Provides a vehicle for ongoing work without re-competing each task. Typical term: 5-10 years." },
            { title: "OEM vs Tier 1 vs Tier 2", desc: "OEMs (Boeing, Lockheed) are the prime/final integrators. Tier 1 suppliers (Spirit, Safran, TransDigm) provide major subsystems directly to OEMs. Tier 2+ suppliers provide components to Tier 1s. Margin and pricing power generally increase as you move down the tier structure (more sole-source)." },
            { title: "Defense Budget Cycle", desc: "US defense budget (~$886B FY2025) is set annually by Congress. FYDP (Future Years Defense Program) provides 5-year outlook. Budget growth of 3-5% is the baseline expectation. Supplemental appropriations (Ukraine, Israel) add incremental funding. Budget sequestration (2013) was the last major cut." },
          ].map((c, i) => (
            <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>);
  }

  // No matching subTab
  return null;
}
