import { useState } from "react";
import { T_, FONT } from "./lib/theme";
import TabBar from "./lib/TabBar";

const PRODUCT_PRIMERS = {
  gpu: {
    label: "GPU",
    tagline: "AI accelerator GPU — silicon at the heart of the AI buildout. ~$30-70K ASP, ~$200B+ market 2026, ~85% Nvidia / ~10% AMD share. The most supply-constrained product in the modern economy.",
    layers: [
      { label: "Finished Product", items: [
        { name: "Nvidia AI GPU", sub: "B200 / B300 / Vera Rubin · ~85% mkt · $30-70K ASP", color: T_.green, link: "NVDA" },
        { name: "AMD Instinct", sub: "MI355X / MI455X · ~10% mkt · $20-30K ASP", color: T_.red, link: "AMD" },
      ]},
      { label: "Design & IP", items: [
        { name: "NVIDIA (architect)", sub: "Hopper · Blackwell · Rubin · CUDA stack", color: T_.green, link: "NVDA" },
        { name: "AMD (architect)", sub: "CDNA 3/4/5 · ROCm", color: T_.red, link: "AMD" },
        { name: "Synopsys (EDA)", sub: "~50% EDA mkt · simulation/verification", color: T_.blue, link: "SNPS", flag: "concentration" },
        { name: "Cadence (EDA)", sub: "~30% EDA mkt · digital/analog flow", color: T_.blue, link: "CDNS", flag: "concentration" },
        { name: "ARM (CPU IP)", sub: "Neoverse V2/V3 — coherent CPU pairing for Grace/Vera", color: "#A855F7", link: "ARM" },
        { name: "Mellanox / NVLink IP", sub: "Owned by Nvidia (acq. 2020) — internal IP", color: T_.green, link: "NVDA" },
      ]},
      { label: "Packaging & Memory", items: [
        { name: "TSMC CoWoS", sub: "75K WPM Q1 26 → 130K target end-26 · sole supplier", color: T_.purple, link: "TSM", flag: "bottleneck" },
        { name: "SK Hynix HBM", sub: "HBM3E leader · 50%+ share · 2026 sold out", color: "#A855F7", link: "000660.KS", flag: "bottleneck" },
        { name: "Samsung HBM", sub: "HBM3E + HBM4 ramp · M16 mass prod Apr 2026", color: T_.blue, link: "005930.KS", flag: "bottleneck" },
        { name: "Micron HBM", sub: "HBM3E ramping · 2026 sold out · HBM4 next", color: T_.amber, link: "MU", flag: "bottleneck" },
        { name: "Ibiden (ABF substrate)", sub: "~25% global ABF · capacity tight", color: "#EC4899", flag: "concentration" },
        { name: "Shinko / Unimicron / AT&S", sub: "ABF + organic substrates · all capacity-tight", color: "#EC4899", flag: "concentration" },
      ]},
      { label: "Foundry / Logic", items: [
        { name: "TSMC", sub: "N4P (B200) · N3 (B300/Rubin) · N2 (Rubin Ultra) · ~90% adv-node share", color: T_.purple, link: "TSM", flag: "concentration" },
        { name: "Intel Foundry", sub: "18A — yield issues · not used for merchant GPU yet", color: "#0EA5E9", link: "INTC" },
        { name: "Samsung Foundry", sub: "Largely declined for AI logic — reserved for own use", color: T_.blue, link: "005930.KS" },
      ]},
      { label: "Fab Equipment", items: [
        { name: "ASML (litho)", sub: "EUV monopoly · 100% adv-node · multi-yr lead times", color: "#F97316", link: "ASML", flag: "bottleneck" },
        { name: "Applied Materials", sub: "Deposition, etch, CMP, ion implant · ~25% mkt", color: T_.amber, link: "AMAT" },
        { name: "Lam Research", sub: "Etch, deposition · ~20% mkt", color: T_.amber, link: "LRCX" },
        { name: "KLA", sub: "Inspection / metrology · ~85% market", color: T_.amber, link: "KLAC", flag: "concentration" },
        { name: "Tokyo Electron (TEL)", sub: "Coater/developer + etch · ~85% lithography track", color: T_.amber, flag: "concentration" },
        { name: "BE Semi / ASMPT", sub: "Hybrid bonding for HBM stacking · near-monopoly", color: T_.amber, flag: "concentration" },
        { name: "Teradyne / Advantest", sub: "Test equipment · duopoly", color: T_.amber, link: "TER" },
      ]},
      { label: "Materials & Chemicals", items: [
        { name: "Photoresist (Japan)", sub: "JSR, TOK, Shin-Etsu, Fujifilm, Nissan · ~80% global", color: "#FACC15", flag: "concentration" },
        { name: "PGME/PGMEA solvents", sub: "Iran-war hit · Daicel, Toagosei · 6 of 12 NCCs cut", color: "#FACC15", flag: "bottleneck" },
        { name: "Silicon wafers", sub: "Shin-Etsu Handotai, Sumco, Siltronic, GlobalWafers", color: "#FACC15", link: "SUMCO", flag: "concentration" },
        { name: "Specialty gases", sub: "Air Products, Linde, Air Liquide, Taiyo Nippon", color: "#FACC15", link: "APD" },
        { name: "Wet chemicals / cleaners", sub: "Entegris (~30% mkt), KMG, Versum", color: "#FACC15", link: "ENTG" },
        { name: "Photomasks", sub: "TOPPAN, Photronics, DNP · in-fab + merchant", color: "#FACC15", link: "PLAB" },
        { name: "CMP slurries", sub: "Versum / CMC Materials / DuPont", color: "#FACC15", link: "DD" },
      ]},
      { label: "Resources & Utilities", items: [
        { name: "Helium", sub: "~30% global from Iran/Qatar — disrupted Mar 2026", color: "#DC2626", flag: "bottleneck" },
        { name: "Naphtha → propylene", sub: "Iran-war driven · 92% spot-price spike Q1 2026", color: "#DC2626", flag: "bottleneck" },
        { name: "Rare earths (Ga, Ge, Ne)", sub: "China dominance ~85% · export controls active", color: "#DC2626", flag: "concentration" },
        { name: "Power (Taiwan grid)", sub: "TSMC ~6% of Taiwan power · grid expansion lagging", color: T_.amber, flag: "concentration" },
        { name: "Water (Taiwan/Korea)", sub: "Fab water-intensive · drought risk · ~10M gal/day per fab", color: T_.amber },
        { name: "Logistics", sub: "Sea + air freight · GPU shipped value ~$1M+/box", color: T_.textDim },
      ]},
    ],
    drivers: [
      { metric: "TSMC CoWoS WPM", current: "75K (Q1 2026)", target: "130K (end 2026)", status: "constrained", note: "The single most constrained GPU input. Every 5K WPM uplift = ~30K racks. Sole-sourced at TSMC." },
      { metric: "HBM3E / HBM4 capacity", current: "All 2026 supply sold out", target: "+30-50% in 2027", status: "constrained", note: "SK Hynix M15X clean room ready May 2026. Samsung HBM4 mass prod Apr 2026. Micron ramping." },
      { metric: "TSMC N3 / N2 wafer starts", current: "~30K wpm leading-edge", target: "Expansion via Arizona N2", status: "constrained", note: "Allocates to Apple first, then Nvidia/AMD/MediaTek." },
      { metric: "ABF substrate volume", current: "Capacity-tight", target: "+15% in 2026 (Ibiden expansion)", status: "constrained", note: "Single biggest non-CoWoS package bottleneck." },
      { metric: "ASML EUV deliveries", current: "~50-60 systems/yr", target: "~70 systems/yr 2027", status: "constrained", note: "Each ~$200M, multi-yr lead time. High-NA EUV ramping (3 systems shipped)." },
      { metric: "Power-delivery (VRMs)", current: "Adequate", target: "Adequate", status: "ok", note: "MPS, ON Semi, ADI, Vicor — multiple suppliers. Not the binding constraint." },
      { metric: "Liquid cooling (rack-scale)", current: "Constrained for NVL72-class", target: "Vertiv, BE Semi, Asetek ramping", status: "constrained", note: "Rack-scale GB200/Vera Rubin requires direct-to-chip liquid — niche supply chain." },
    ],
    bottlenecks: [
      { node: "TSMC CoWoS", layer: "Packaging & Memory", supplier: "TSMC (sole)", leadTime: "12-18 mo", relief: "Ramp to 130K WPM end 2026; additional fabs Taiwan + Arizona", beneficiaries: "TSM directly. Resolves NVDA / AMD GPU supply." },
      { node: "HBM3E / HBM4", layer: "Packaging & Memory", supplier: "SK Hynix, Samsung, Micron", leadTime: "18-24 mo for new capacity", relief: "M15X (SK Hynix), Samsung M16 mass prod, Micron HBM4 ramp 2027", beneficiaries: "000660.KS, 005930.KS, MU. Resolves Nvidia/AMD inventory." },
      { node: "ASML EUV", layer: "Fab Equipment", supplier: "ASML (sole)", leadTime: "Multi-year", relief: "Capacity expansion + High-NA EUV ramping", beneficiaries: "ASML. Resolves N3/N2 wafer capacity." },
      { node: "ABF substrate", layer: "Packaging & Memory", supplier: "Ibiden, Shinko, Unimicron, AT&S", leadTime: "12+ mo for new lines", relief: "Ibiden expansion ~+15% 2026", beneficiaries: "Substrate makers (mostly Japanese / Taiwanese). Resolves chip-on-board cost." },
      { node: "PGME/PGMEA solvents", layer: "Materials & Chemicals", supplier: "Japanese chem majors via Daicel/Toagosei", leadTime: "Iran-war dependent", relief: "Korean alt suppliers (Chemtronics, Jaewon, Hanwul) ramping; PCN re-qual ~1 yr", beneficiaries: "Korean PGMEA suppliers. Resolves Samsung/SK Hynix fab continuity." },
      { node: "Helium", layer: "Resources & Utilities", supplier: "Qatar (~75% of Asia imports), Algeria, US, Russia", leadTime: "Demand-elastic", relief: "Strategic reserves + new sources (Tanzania)", beneficiaries: "Air Products, Linde. Impacts ALL semi fabs + fiber-optics." },
      { node: "Liquid cooling (rack-scale)", layer: "Equipment / Infrastructure", supplier: "Vertiv, BE Semi, Asetek, CoolIT", leadTime: "6-12 mo", relief: "Vertiv ramping aggressively; multiple new entrants", beneficiaries: "VRT directly. Resolves NVL72-class deployment cadence." },
    ],
  },
  cpu: {
    label: "CPU",
    tagline: "Server CPU — orchestrates agentic AI workloads. Tool processing accounts for up to 90.6% of agent latency. The CPU:GPU ratio is shifting from 1:4-1:8 (training-era) to 1:1-1:2 (agentic-era), implying ~4x CPU core demand per GW of AI capacity. ~$5-15K ASP, ~$50B+ DC server CPU market 2026.",
    layers: [
      { label: "Finished Product", items: [
        { name: "Intel Xeon", sub: "Granite Rapids · Sierra Forest · ~70% mkt share · $5-15K ASP", color: "#0EA5E9", link: "INTC" },
        { name: "AMD EPYC", sub: "Turin (Zen 5) · Venice (Zen 6 H2 26) · ~30% rev share · $5-15K ASP", color: T_.red, link: "AMD" },
        { name: "ARM-based DC CPU", sub: "Graviton, Cobalt, Axion, Vera, AGI, AmpereOne · ~5-10% growing fast", color: "#A855F7" },
      ]},
      { label: "Design & IP", items: [
        { name: "Intel (architect)", sub: "P-cores (Redwood/Panther Cove) · E-cores (Crestmont/Darkmont) · AMX", color: "#0EA5E9", link: "INTC" },
        { name: "AMD (architect)", sub: "Zen 5 / Zen 5c / Zen 6 · Infinity Fabric · CXL", color: T_.red, link: "AMD" },
        { name: "ARM Holdings (IP)", sub: "Neoverse V2/V3 · CSS-V3 · per-core royalty model", color: "#A855F7", link: "ARM" },
        { name: "Hyperscaler design teams", sub: "AWS Annapurna · MSFT silicon · Google Axion · Alibaba Yitian", color: T_.amber },
        { name: "x86 ISA (cross-license)", sub: "Closed ISA · Intel + AMD only · key barrier vs Arm", color: "#0EA5E9", flag: "concentration" },
        { name: "Synopsys (EDA)", sub: "~50% EDA mkt · simulation/verification", color: T_.blue, link: "SNPS", flag: "concentration" },
        { name: "Cadence (EDA)", sub: "~30% EDA mkt · digital/analog flow", color: T_.blue, link: "CDNS", flag: "concentration" },
      ]},
      { label: "Packaging & Memory", items: [
        { name: "DDR5 DRAM", sub: "Micron, Samsung, SK Hynix · adequate but pricing rising", color: "#A855F7", link: "MU" },
        { name: "MRDIMM (high-BW)", sub: "1.6x DDR5 BW · MCR registered DIMM · niche supply", color: "#A855F7", flag: "concentration" },
        { name: "DIMM makers", sub: "Kingston, Crucial, Samsung, SK Hynix, Micron — merchant DIMMs", color: "#A855F7" },
        { name: "Intel Foveros (3D pkg)", sub: "Intel-internal advanced packaging for Granite Rapids+", color: "#0EA5E9", link: "INTC" },
        { name: "AMD chiplet pkg", sub: "Multi-die EPYC via TSMC InFO/SoIC", color: T_.red, link: "AMD" },
        { name: "Ibiden (ABF substrate)", sub: "~25% global ABF · shared bottleneck w/ GPU", color: "#EC4899", flag: "concentration" },
        { name: "Shinko / Unimicron / AT&S", sub: "ABF + organic substrates · capacity-tight", color: "#EC4899", flag: "concentration" },
      ]},
      { label: "Foundry / Logic", items: [
        { name: "TSMC", sub: "N3 (AMD Turin/Venice, Vera, AGI, Graviton5, Cobalt 200) · ~90% adv-node share", color: T_.purple, link: "TSM", flag: "concentration" },
        { name: "Intel Foundry", sub: "Intel 7 (SPR/EMR) · Intel 3 (Granite/Sierra) · Intel 18A (yield issues)", color: "#0EA5E9", link: "INTC", flag: "bottleneck" },
        { name: "Samsung Foundry", sub: "Rarely used for merchant DC CPUs", color: T_.blue, link: "005930.KS" },
        { name: "GlobalFoundries", sub: "Mature-node I/O dies (12nm/14nm) for AMD chiplets", color: T_.textDim, link: "GFS" },
      ]},
      { label: "Fab Equipment", items: [
        { name: "ASML (litho)", sub: "EUV monopoly · 100% adv-node · multi-yr lead times", color: "#F97316", link: "ASML", flag: "bottleneck" },
        { name: "Applied Materials", sub: "Deposition, etch, CMP, ion implant · ~25% mkt", color: T_.amber, link: "AMAT" },
        { name: "Lam Research", sub: "Etch, deposition · ~20% mkt", color: T_.amber, link: "LRCX" },
        { name: "KLA", sub: "Inspection / metrology · ~85% market", color: T_.amber, link: "KLAC", flag: "concentration" },
        { name: "Tokyo Electron (TEL)", sub: "Coater/developer + etch · ~85% lithography track", color: T_.amber, flag: "concentration" },
        { name: "Teradyne / Advantest", sub: "Test equipment · duopoly", color: T_.amber, link: "TER" },
      ]},
      { label: "Materials & Chemicals", items: [
        { name: "Photoresist (Japan)", sub: "JSR, TOK, Shin-Etsu, Fujifilm, Nissan · ~80% global", color: "#FACC15", flag: "concentration" },
        { name: "PGME/PGMEA solvents", sub: "Iran-war hit · Daicel, Toagosei · 6 of 12 NCCs cut", color: "#FACC15", flag: "bottleneck" },
        { name: "Silicon wafers", sub: "Shin-Etsu Handotai, Sumco, Siltronic, GlobalWafers", color: "#FACC15", link: "SUMCO", flag: "concentration" },
        { name: "Specialty gases", sub: "Air Products, Linde, Air Liquide, Taiyo Nippon", color: "#FACC15", link: "APD" },
        { name: "Wet chemicals / cleaners", sub: "Entegris (~30% mkt), KMG, Versum", color: "#FACC15", link: "ENTG" },
        { name: "Photomasks", sub: "TOPPAN, Photronics, DNP · in-fab + merchant", color: "#FACC15", link: "PLAB" },
        { name: "CMP slurries", sub: "Versum / CMC Materials / DuPont", color: "#FACC15", link: "DD" },
      ]},
      { label: "Resources & Utilities", items: [
        { name: "Helium", sub: "~30% global from Iran/Qatar — disrupted Mar 2026", color: "#DC2626", flag: "bottleneck" },
        { name: "Naphtha → propylene", sub: "Iran-war driven · 92% spot-price spike Q1 2026", color: "#DC2626", flag: "bottleneck" },
        { name: "Rare earths (Ga, Ge, Ne)", sub: "China dominance ~85% · export controls active", color: "#DC2626", flag: "concentration" },
        { name: "Power (Taiwan / Arizona grids)", sub: "TSMC + Intel Arizona fab loads · grid expansion lagging", color: T_.amber, flag: "concentration" },
        { name: "Water (Taiwan / Korea / Arizona)", sub: "Fab water-intensive · drought risk · ~10M gal/day per fab", color: T_.amber },
        { name: "Logistics", sub: "Sea + air freight · CPU value $1-15K/unit", color: T_.textDim },
      ]},
    ],
    drivers: [
      { metric: "Intel 18A yields", current: "Yield issues — Clearwater Forest + Diamond Rapids at risk", target: "H2 2026 if yields hold; possible slip to 2027", status: "constrained", note: "The single biggest Intel-specific risk. If 18A slips, AMD takes share unopposed in next-gen." },
      { metric: "TSMC N3 / N2 wafer starts", current: "~30K wpm leading-edge (shared w/ GPU)", target: "Expansion via Arizona N2 2027+", status: "constrained", note: "Allocates Apple → Nvidia/AMD → ARM AGI → Vera → Graviton5 → MediaTek. CPU competes with GPU for same wafers." },
      { metric: "DDR5 / MRDIMM capacity", current: "Adequate; MRDIMM tight", target: "DDR5 capacity expanding 2026-2027", status: "tight", note: "Less constrained than HBM. MRDIMM (1.6x DDR5 BW) is the niche supply for top-end CPUs." },
      { metric: "ABF substrate volume", current: "Capacity-tight (shared w/ GPU)", target: "+15% in 2026 (Ibiden expansion)", status: "constrained", note: "Same Ibiden/Shinko/Unimicron capacity that bottlenecks GPU." },
      { metric: "ASML EUV deliveries", current: "~50-60 systems/yr (shared)", target: "~70 systems/yr 2027", status: "constrained", note: "Shared with GPU + DRAM. Each ~$200M, multi-yr lead time." },
      { metric: "Server motherboard / OEM capacity", current: "Adequate", target: "Adequate", status: "ok", note: "Dell, HPE, Supermicro, ZT, Foxconn — multiple suppliers. Not the binding constraint." },
      { metric: "Power delivery (VRMs)", current: "Constrained for 600W+ (Venice, Diamond Rapids)", target: "Adequate for mainstream", status: "tight", note: "Top-end CPUs need higher-density VRMs. MPS, ON Semi, ADI, Vicor — multiple suppliers." },
    ],
    bottlenecks: [
      { node: "Intel 18A yield", layer: "Foundry / Logic", supplier: "Intel Foundry (sole)", leadTime: "Yield-dependent · slip risk to 2027", relief: "Intel process improvements; otherwise migrate Diamond Rapids to TSMC N2 (would take ~12 mo)", beneficiaries: "INTC if resolves; AMD harvests share if slips. Mutually exclusive." },
      { node: "TSMC N3 / N2 wafer starts", layer: "Foundry / Logic", supplier: "TSMC (sole adv-node)", leadTime: "12-18 mo", relief: "Arizona N2 fabs ramping 2027+", beneficiaries: "TSM directly. Resolves AMD, Vera, AGI, Graviton5 — but competes with GPU demand for same capacity." },
      { node: "ABF substrate", layer: "Packaging & Memory", supplier: "Ibiden, Shinko, Unimicron, AT&S", leadTime: "12+ mo for new lines", relief: "Ibiden expansion ~+15% 2026", beneficiaries: "Substrate makers. Shared bottleneck with GPU." },
      { node: "ASML EUV", layer: "Fab Equipment", supplier: "ASML (sole)", leadTime: "Multi-year", relief: "Capacity expansion + High-NA EUV ramping", beneficiaries: "ASML. Shared upstream constraint across CPU + GPU + DRAM." },
      { node: "MRDIMM (high-BW memory)", layer: "Packaging & Memory", supplier: "Micron, SK Hynix, Samsung", leadTime: "12 mo for MRDIMM ramp", relief: "DDR5 capacity expansions through 2027", beneficiaries: "MU directly. Granite Rapids + Venice need MRDIMM for full memory bandwidth." },
      { node: "PGME/PGMEA solvents", layer: "Materials & Chemicals", supplier: "Japanese chem majors via Daicel/Toagosei", leadTime: "Iran-war dependent", relief: "Korean alt suppliers (Chemtronics, Jaewon, Hanwul) ramping; PCN re-qual ~1 yr", beneficiaries: "Korean PGMEA suppliers. Resolves all fab continuity (CPU + GPU + DRAM)." },
      { node: "Helium", layer: "Resources & Utilities", supplier: "Qatar (~75% Asia imports), Algeria, US, Russia", leadTime: "Demand-elastic", relief: "Strategic reserves + Tanzania", beneficiaries: "Air Products, Linde. Impacts ALL semi fabs." },
      { node: "VRMs (high-power CPUs)", layer: "Equipment / Infrastructure", supplier: "MPS, ON Semi, ADI, Vicor", leadTime: "6-12 mo", relief: "Multiple suppliers ramping density", beneficiaries: "MPS, ADI. Resolves Diamond Rapids (650W) + Venice (600W) deployment." },
    ],
  },
  hbm: {
    label: "HBM",
    tagline: "HBM (High Bandwidth Memory) — stacked DRAM packaged on top of AI accelerators. The single most supply-constrained component in the modern AI stack. ~$30-60B market 2026, growing 60-100%+ annually. Only 3 suppliers globally (SK Hynix, Samsung, Micron). 100% of 2026 capacity sold out before the year started.",
    layers: [
      { label: "Finished Product", items: [
        { name: "SK Hynix HBM", sub: "HBM3E leader · ~50%+ mkt share · M16 + M15X · 2026 sold out", color: "#A855F7", link: "000660.KS", flag: "bottleneck" },
        { name: "Samsung HBM", sub: "HBM3E + HBM4 (M16 mass prod Apr 2026) · 2026 sold out", color: T_.blue, link: "005930.KS", flag: "bottleneck" },
        { name: "Micron HBM", sub: "HBM3E ramp · HBM4 next · Boise + Hiroshima · 2026 sold out", color: T_.amber, link: "MU", flag: "bottleneck" },
      ]},
      { label: "Design & IP", items: [
        { name: "JEDEC HBM standard", sub: "HBM3E (1.2 TB/s) → HBM4 (~1.6 TB/s) · industry-wide", color: T_.textDim },
        { name: "DRAM cell design (per-vendor)", sub: "1a / 1b / 1c node — proprietary; SK Hynix process leadership", color: "#A855F7", link: "000660.KS" },
        { name: "TSV / 3D-stack design IP", sub: "Through-silicon vias (1024+ per die) · per-vendor IP", color: "#A855F7" },
        { name: "Logic base die design (HBM4)", sub: "First HBM gen with logic-class base die — TSMC N5/N3 fab for SK Hynix HBM4", color: T_.purple, link: "TSM" },
        { name: "Synopsys / Cadence (EDA)", sub: "DRAM design tools · same EDA stack as logic", color: T_.blue, link: "SNPS", flag: "concentration" },
      ]},
      { label: "Stacking & Assembly", items: [
        { name: "Hybrid bonding (BE Semi + ASMPT)", sub: "Near-duopoly · multi-yr tool lead times · the binding HBM constraint", color: T_.red, flag: "bottleneck" },
        { name: "TSV process", sub: "Through-silicon via etch + Cu fill · 1024+ per die at HBM3E", color: T_.red, flag: "bottleneck" },
        { name: "Wafer thinning (Disco)", sub: "~70% global share · grinder + dicer · near-monopoly", color: T_.red, flag: "concentration" },
        { name: "Stack height (8H → 12H → 16H)", sub: "Yield drops sharply with height · 16H HBM4e in dev", color: "#A855F7" },
        { name: "Underfill / molding (Resonac)", sub: "Resonac (Showa Denko), Sumitomo Bakelite · HBM-specific", color: "#EC4899", flag: "concentration" },
        { name: "HBM wafer-level test", sub: "Advantest (~70% HBM test) · multi-month lead time bottleneck", color: T_.red, flag: "bottleneck" },
      ]},
      { label: "DRAM Manufacturing", items: [
        { name: "SK Hynix M16 (Icheon)", sub: "HBM4 mass prod started Apr 2026 · 1c node", color: "#A855F7", link: "000660.KS", flag: "bottleneck" },
        { name: "SK Hynix M15X (Cheongju)", sub: "First clean room ready May 2026 · HBM expansion", color: "#A855F7", link: "000660.KS" },
        { name: "Samsung Pyeongtaek + Hwaseong", sub: "P3, M16 lines · HBM3E + HBM4 ramp · catching SK Hynix", color: T_.blue, link: "005930.KS" },
        { name: "Micron Boise + Hiroshima", sub: "HBM3E ramp · HBM4 in dev · 1b → 1c transition", color: T_.amber, link: "MU" },
        { name: "1a / 1b / 1c DRAM nodes", sub: "~12-10nm-class · SK Hynix leads node migration", color: "#A855F7", flag: "bottleneck" },
        { name: "TSMC (logic base die for HBM4)", sub: "New dependency · N5/N3 for HBM4 base die · SK Hynix outsourcing", color: T_.purple, link: "TSM", flag: "concentration" },
      ]},
      { label: "Fab Equipment", items: [
        { name: "ASML (litho)", sub: "EUV used for 1a/1b/1c DRAM nodes · multi-yr lead times", color: "#F97316", link: "ASML", flag: "bottleneck" },
        { name: "Lam Research", sub: "Etch-heavy for DRAM · capacitor + TSV etch · ~50% DRAM equip", color: T_.amber, link: "LRCX", flag: "concentration" },
        { name: "Applied Materials", sub: "Deposition + ion implant for DRAM", color: T_.amber, link: "AMAT" },
        { name: "KLA", sub: "Inspection / metrology · ~85% market", color: T_.amber, link: "KLAC", flag: "concentration" },
        { name: "Tokyo Electron (TEL)", sub: "Coater/developer + etch · ~85% lithography track", color: T_.amber, flag: "concentration" },
        { name: "BE Semi / ASMPT", sub: "Hybrid bonding tools · the gating HBM equipment", color: T_.amber, flag: "bottleneck" },
        { name: "Disco (wafer thinning)", sub: "~70% global share · TSV-thinning + dicing", color: T_.amber, flag: "concentration" },
        { name: "Advantest (HBM test)", sub: "~70% HBM test mkt · long test cycle a key throughput bottleneck", color: T_.amber, flag: "bottleneck" },
      ]},
      { label: "Materials & Chemicals", items: [
        { name: "Photoresist (Japan)", sub: "JSR, TOK, Shin-Etsu, Fujifilm, Nissan · ~80% global", color: "#FACC15", flag: "concentration" },
        { name: "PGME/PGMEA solvents", sub: "Iran-war hit · Daicel, Toagosei · Korean fabs directly exposed", color: "#FACC15", flag: "bottleneck" },
        { name: "Silicon wafers", sub: "Shin-Etsu Handotai, Sumco · DRAM uses 300mm prime wafers", color: "#FACC15", link: "SUMCO", flag: "concentration" },
        { name: "TSV copper plating chems", sub: "Cu electroplating + barrier · Atotech, Entegris", color: "#FACC15", link: "ENTG" },
        { name: "Underfill / molding compound", sub: "Resonac (4004.T), Sumitomo Bakelite · HBM-specific", color: "#FACC15", flag: "concentration" },
        { name: "Specialty gases", sub: "Air Products, Linde, Air Liquide, Taiyo Nippon", color: "#FACC15", link: "APD" },
        { name: "CMP slurries / pads", sub: "Versum / CMC Materials / Cabot Microelectronics", color: "#FACC15", link: "DD" },
      ]},
      { label: "Resources & Utilities", items: [
        { name: "Helium", sub: "~30% global from Iran/Qatar — disrupted Mar 2026 · DRAM-critical", color: "#DC2626", flag: "bottleneck" },
        { name: "Naphtha → propylene", sub: "Iran-war driven · 92% spot-price spike · hits Korean fabs first", color: "#DC2626", flag: "bottleneck" },
        { name: "Power (Korean grid)", sub: "Samsung + SK Hynix concentrated in Korea · ~5%+ of grid", color: T_.amber, flag: "concentration" },
        { name: "Water (Korea)", sub: "Korean fabs water-intensive · drought risk · ~10M gal/day per fab", color: T_.amber, flag: "concentration" },
        { name: "Rare earths (Ga, Ge)", sub: "China dominance · DRAM uses gallium for compound layers", color: "#DC2626", flag: "concentration" },
        { name: "Logistics", sub: "HBM ships to TSMC CoWoS for GPU integration · time-sensitive", color: T_.textDim },
      ]},
    ],
    drivers: [
      { metric: "DRAM 1a/1b/1c wafer capacity", current: "All 2026 supply sold out", target: "+30-50% in 2027 (M15X + Samsung M16)", status: "constrained", note: "The single biggest HBM constraint. SK Hynix 1c-node leadership is the moat." },
      { metric: "Hybrid bonding tool capacity", current: "BE Semi + ASMPT delivery-bound", target: "Tool capacity expanding 2026-2027", status: "constrained", note: "Hybrid bonding is the gating equipment for HBM stacks. Multi-yr tool lead times." },
      { metric: "Advantest HBM test capacity", current: "Multi-month test lead times", target: "Advantest expanding", status: "constrained", note: "HBM test cycles are unusually long. Advantest ~70% mkt — single-supplier risk." },
      { metric: "TSV throughput per die", current: "1024+ TSVs per die at HBM3E", target: "More + smaller for HBM4/HBM4e", status: "tight", note: "TSV count rising every gen. Lam Research etch capacity is the binding tool." },
      { metric: "Stack height (8H → 12H → 16H)", current: "12H HBM3E shipping; 16H HBM4e in dev", target: "16H by 2027-2028", status: "tight", note: "Yield drops sharply at 16H. SK Hynix process leadership widens here." },
      { metric: "Logic base die (HBM4)", current: "New dependency · TSMC N5/N3", target: "Adequate if TSMC allocates", status: "tight", note: "HBM4 introduces logic-class base die — first time HBM ties to TSMC. SK Hynix outsourcing." },
      { metric: "Korean fab continuity", current: "Iran-war PGME/PGMEA risk", target: "Korean alt-supplier qualification ~1 yr", status: "tight", note: "Samsung + SK Hynix uniquely exposed to Japanese photoresist solvent disruption." },
    ],
    bottlenecks: [
      { node: "HBM3E / HBM4 capacity", layer: "Finished Product", supplier: "SK Hynix, Samsung, Micron (only 3 globally)", leadTime: "18-24 mo for new capacity", relief: "M15X (SK Hynix), Samsung M16 mass prod, Micron HBM4 ramp 2027", beneficiaries: "000660.KS, 005930.KS, MU. Resolves Nvidia/AMD GPU inventory." },
      { node: "Hybrid bonding (BE Semi / ASMPT)", layer: "Stacking & Assembly", supplier: "BE Semi (BESI), ASMPT (HK)", leadTime: "Multi-year tool lead time", relief: "Tool capacity expanding 2026-2027", beneficiaries: "BESI, ASMPT. Resolves stack throughput at all 3 HBM makers." },
      { node: "Advantest HBM test", layer: "Stacking & Assembly", supplier: "Advantest (~70%), Teradyne (rest)", leadTime: "Multi-month test cycle", relief: "Advantest capacity expansions; faster test methodologies", beneficiaries: "6857.T (Advantest). Resolves HBM throughput across all 3 makers." },
      { node: "DRAM 1a/1b/1c node capacity", layer: "DRAM Manufacturing", supplier: "SK Hynix, Samsung, Micron (each fab their own)", leadTime: "18-24 mo for new clean-room", relief: "M15X clean-room ready May 2026, Samsung M16 ramping, Micron 1c ramp", beneficiaries: "All 3 HBM makers + DRAM equip suppliers (LRCX, AMAT, ASML)." },
      { node: "TSMC logic base die (HBM4)", layer: "DRAM Manufacturing", supplier: "TSMC (sole)", leadTime: "12-18 mo", relief: "TSMC allocation to SK Hynix HBM4 base die", beneficiaries: "TSM. New revenue stream — first time HBM uses logic foundry." },
      { node: "Disco wafer thinning", layer: "Stacking & Assembly", supplier: "Disco (~70%)", leadTime: "12 mo for new tools", relief: "Disco capacity expansion; alternative TKK Group", beneficiaries: "6146.T (Disco). Critical to TSV-thinning step." },
      { node: "PGME/PGMEA solvents", layer: "Materials & Chemicals", supplier: "Japanese chem majors via Daicel/Toagosei", leadTime: "Iran-war dependent", relief: "Korean alt suppliers (Chemtronics, Jaewon, Hanwul) ramping; PCN re-qual ~1 yr", beneficiaries: "Korean PGMEA suppliers. Korean HBM fabs uniquely exposed." },
      { node: "Helium", layer: "Resources & Utilities", supplier: "Qatar (~75% Asia imports), Algeria, US, Russia", leadTime: "Demand-elastic", relief: "Strategic reserves + Tanzania", beneficiaries: "Air Products, Linde. DRAM fabs are particularly helium-intensive." },
    ],
  },
};

const productList = [
  { key: "gpu", label: "GPU", color: T_.green },
  { key: "cpu", label: "CPU", color: "#0EA5E9" },
  { key: "hbm", label: "HBM", color: "#A855F7" },
];

export default function ProductPrimer() {
  const [activeProduct, setActiveProduct] = useState("gpu");
  const [bottleneckOnly, setBottleneckOnly] = useState(false);

  const product = PRODUCT_PRIMERS[activeProduct] || PRODUCT_PRIMERS.gpu;
  const flagColor = (f) => f === "bottleneck" ? T_.red : f === "concentration" ? T_.amber : null;
  const flagLabel = (f) => f === "bottleneck" ? "BOTTLENECK" : f === "concentration" ? "CONCENTRATED" : "";
  const driverColor = (s) => s === "constrained" ? T_.red : s === "tight" ? T_.amber : T_.green;

  const filteredLayers = bottleneckOnly
    ? product.layers.map(l => ({ ...l, items: l.items.filter(it => it.flag === "bottleneck" || it.flag === "concentration") })).filter(l => l.items.length > 0)
    : product.layers;

  return (
    <div style={{ fontFamily: FONT, background: T_.bg, color: T_.textMid, minHeight: "100vh", padding: "36px 52px" }}>
      <div style={{ marginBottom: 24, borderBottom: `1px solid ${T_.border}`, paddingBottom: 18 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>Product / Service Primer</div>
        <div style={{ fontSize: 14, color: T_.textDim, marginTop: 5 }}>Trace any product upstream to its inputs. Find where the bottlenecks are. Identify what gates output.</div>
      </div>

      <TabBar
        tabs={productList.map(p => ({ key: p.key, label: p.label, color: p.color }))}
        active={activeProduct}
        onChange={setActiveProduct}
        marginBottom={20}
        trailing={<div style={{ padding: "8px 18px", fontSize: 12, color: "#475569", fontStyle: "italic", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>more products coming: CoWoS, networking, optical, data center…</div>}
      />

      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{product.tagline}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 16, fontSize: 11, color: T_.textDim, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: T_.red }} /> Bottleneck (currently supply-constrained)
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: T_.amber }} /> Concentration risk (≥80% single-source / single-country)
          </span>
        </div>
        <button onClick={() => setBottleneckOnly(p => !p)} style={{
          padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer",
          border: `1px solid ${bottleneckOnly ? T_.red : T_.borderStrong}`,
          background: bottleneckOnly ? "rgba(239,68,68,0.12)" : "#0B0F19",
          color: bottleneckOnly ? T_.red : T_.textDim,
          borderRadius: 6, whiteSpace: "nowrap",
        }}>{bottleneckOnly ? "✓ Showing bottlenecks/concentration only" : "Show bottlenecks/concentration only"}</button>
      </div>

      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>{product.label} Supply Chain &amp; Input Map</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredLayers.map((layer, li) => (
            <div key={li}>
              {li > 0 && (
                <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                  <svg width="24" height="18" viewBox="0 0 24 18"><path d="M12 0 L12 12 M6 8 L12 14 L18 8" stroke={T_.borderStrong} strokeWidth="2" fill="none"/></svg>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 130, flexShrink: 0, fontSize: 10, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.8px", textAlign: "right" }}>{layer.label}</div>
                <div style={{ flex: 1, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {layer.items.map((item, ii) => {
                    const fc = flagColor(item.flag);
                    return (
                    <div key={ii} style={{
                      background: item.flag === "bottleneck" ? "rgba(239,68,68,0.06)" : item.flag === "concentration" ? "rgba(245,158,11,0.04)" : "#0B0F19",
                      border: `1px solid ${fc || T_.border}`,
                      borderRadius: 8, padding: "10px 14px", minWidth: 170, flex: "1 1 170px", maxWidth: 280,
                      borderLeft: `3px solid ${item.color}`,
                      position: "relative",
                    }}>
                      {item.flag && <div style={{ position: "absolute", top: 4, right: 6, fontSize: 8, color: fc, fontWeight: 700, letterSpacing: "0.5px" }}>● {flagLabel(item.flag)}</div>}
                      <div style={{ fontSize: 13, fontWeight: 700, color: T_.textMid }}>{item.name}{item.link ? <span style={{ fontSize: 10, color: T_.textGhost, marginLeft: 6, fontWeight: 500 }}>· {item.link}</span> : null}</div>
                      <div style={{ fontSize: 11, color: T_.textDim, marginTop: 3, lineHeight: 1.4 }}>{item.sub}</div>
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 14, fontStyle: "italic" }}>Reads top-down: finished product at top, raw inputs at bottom. Arrows indicate dependency direction (each layer depends on the layers below).</div>
      </div>

      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Drivers of Output — what gates {product.label} supply</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T_.border}` }}>
              {["Driver", "Current", "Target / Trajectory", "Status", "Note"].map(h => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {product.drivers.map((d, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #0B0F19" }}>
                <td style={{ padding: "8px 10px", color: T_.textMid, fontWeight: 700, whiteSpace: "nowrap" }}>{d.metric}</td>
                <td style={{ padding: "8px 10px", color: T_.text, fontWeight: 600, whiteSpace: "nowrap" }}>{d.current}</td>
                <td style={{ padding: "8px 10px", color: T_.textDim, whiteSpace: "nowrap" }}>{d.target}</td>
                <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: `${driverColor(d.status)}20`, color: driverColor(d.status) }}>
                    {d.status === "constrained" ? "● CONSTRAINED" : d.status === "tight" ? "◐ TIGHT" : "○ OK"}
                  </span>
                </td>
                <td style={{ padding: "8px 10px", color: T_.textDim, fontSize: 11 }}>{d.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Bottleneck Watch — what's stuck and who benefits when it loosens</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T_.border}` }}>
              {["Node", "Layer", "Supplier(s)", "Lead Time", "What Relieves It", "Beneficiaries / Read-Through"].map(h => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {product.bottlenecks.map((b, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #0B0F19" }}>
                <td style={{ padding: "8px 10px", color: T_.red, fontWeight: 700, whiteSpace: "nowrap" }}>● {b.node}</td>
                <td style={{ padding: "8px 10px", color: T_.textDim, whiteSpace: "nowrap", fontSize: 11 }}>{b.layer}</td>
                <td style={{ padding: "8px 10px", color: T_.textMid, fontSize: 11 }}>{b.supplier}</td>
                <td style={{ padding: "8px 10px", color: T_.amber, fontWeight: 600, whiteSpace: "nowrap", fontSize: 11 }}>{b.leadTime}</td>
                <td style={{ padding: "8px 10px", color: T_.textDim, fontSize: 11 }}>{b.relief}</td>
                <td style={{ padding: "8px 10px", color: T_.green, fontWeight: 600, fontSize: 11 }}>{b.beneficiaries}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>Sources: TSMC IR, SK Hynix / Samsung / Micron earnings, ASML guidance, TrendForce, SemiAnalysis, Marathon Fund research notes.</div>
      </div>
    </div>
  );
}
