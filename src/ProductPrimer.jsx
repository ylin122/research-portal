import { useState } from "react";
import { T_, FONT } from "./lib/theme";
import TabBar from "./lib/TabBar";

const FormIcons = {
  // HBM — tall layered stack with logic base die and interposer (front view)
  "hbm-stack": (c) => (
    <svg width="44" height="44" viewBox="0 0 44 44">
      {/* Interposer (widest, faint) */}
      <rect x="2" y="38" width="40" height="2.5" fill={c} opacity="0.35" rx="0.5"/>
      {/* Logic base die */}
      <rect x="6" y="33" width="32" height="4" fill={c} rx="0.5"/>
      {/* DRAM stack — single solid block with horizontal layer dividers */}
      <rect x="9" y="5" width="26" height="27" fill={c} rx="0.5"/>
      {/* Layer separators (8H stack) */}
      <line x1="9" y1="8.4" x2="35" y2="8.4" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="9" y1="11.8" x2="35" y2="11.8" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="9" y1="15.2" x2="35" y2="15.2" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="9" y1="18.6" x2="35" y2="18.6" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="9" y1="22" x2="35" y2="22" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="9" y1="25.4" x2="35" y2="25.4" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="9" y1="28.8" x2="35" y2="28.8" stroke="#0F172A" strokeWidth="0.5"/>
    </svg>
  ),

  // DIMM — long PCB with chips on top, gold-finger contacts + center notch
  "dimm": (c) => (
    <svg width="44" height="44" viewBox="0 0 44 44">
      {/* PCB body */}
      <rect x="2" y="14" width="40" height="20" fill={c} opacity="0.35" rx="1"/>
      {/* DRAM chips */}
      <rect x="4" y="17" width="4" height="8" fill={c} rx="0.3"/>
      <rect x="9.5" y="17" width="4" height="8" fill={c} rx="0.3"/>
      <rect x="15" y="17" width="4" height="8" fill={c} rx="0.3"/>
      <rect x="20.5" y="17" width="4" height="8" fill={c} rx="0.3"/>
      <rect x="26" y="17" width="4" height="8" fill={c} rx="0.3"/>
      <rect x="31.5" y="17" width="4" height="8" fill={c} rx="0.3"/>
      <rect x="37" y="17" width="4" height="8" fill={c} rx="0.3"/>
      {/* Gold-finger contacts with center notch */}
      <rect x="2" y="30" width="17" height="4" fill={c} rx="0.3"/>
      <rect x="25" y="30" width="17" height="4" fill={c} rx="0.3"/>
    </svg>
  ),

  // BGA chip — solid square package with BGA ball-grid underneath
  "bga-square": (c) => (
    <svg width="44" height="44" viewBox="0 0 44 44">
      {/* Chip body */}
      <rect x="7" y="6" width="26" height="26" rx="2" fill={c}/>
      {/* Label etch (faint dark text-line) */}
      <rect x="13" y="16" width="14" height="2" fill="#0F172A" opacity="0.45" rx="0.3"/>
      <rect x="15" y="21" width="10" height="1.5" fill="#0F172A" opacity="0.35" rx="0.3"/>
      {/* BGA balls underneath */}
      <circle cx="10" cy="37" r="1.5" fill={c}/>
      <circle cx="15" cy="37" r="1.5" fill={c}/>
      <circle cx="20" cy="37" r="1.5" fill={c}/>
      <circle cx="25" cy="37" r="1.5" fill={c}/>
      <circle cx="30" cy="37" r="1.5" fill={c}/>
    </svg>
  ),

  // On-die SRAM — SoC chip with inner highlighted SRAM block
  "die-on-chip": (c) => (
    <svg width="44" height="44" viewBox="0 0 44 44">
      {/* Outer SoC */}
      <rect x="4" y="4" width="36" height="36" rx="2" fill={c} opacity="0.35"/>
      {/* Logic blocks around */}
      <rect x="7" y="7" width="9" height="7" fill={c} opacity="0.85" rx="0.3"/>
      <rect x="28" y="7" width="9" height="7" fill={c} opacity="0.85" rx="0.3"/>
      <rect x="7" y="30" width="9" height="7" fill={c} opacity="0.85" rx="0.3"/>
      <rect x="28" y="30" width="9" height="7" fill={c} opacity="0.85" rx="0.3"/>
      {/* SRAM block at center — solid + grid */}
      <rect x="17" y="16" width="10" height="12" fill={c}/>
      <line x1="20" y1="16" x2="20" y2="28" stroke="#0F172A" strokeWidth="0.4"/>
      <line x1="23.5" y1="16" x2="23.5" y2="28" stroke="#0F172A" strokeWidth="0.4"/>
      <line x1="17" y1="19" x2="27" y2="19" stroke="#0F172A" strokeWidth="0.4"/>
      <line x1="17" y1="22" x2="27" y2="22" stroke="#0F172A" strokeWidth="0.4"/>
      <line x1="17" y1="25" x2="27" y2="25" stroke="#0F172A" strokeWidth="0.4"/>
    </svg>
  ),

  // M.2 SSD — thin gumstick PCB, mounting hole, controller + NAND chips, M-key
  "m2": (c) => (
    <svg width="44" height="44" viewBox="0 0 44 44">
      {/* PCB body */}
      <rect x="3" y="16" width="35" height="12" fill={c} opacity="0.35" rx="1"/>
      {/* Mounting hole (left) */}
      <circle cx="6" cy="22" r="1.8" fill="#0F172A"/>
      <circle cx="6" cy="22" r="1.8" fill="none" stroke={c} strokeWidth="0.8"/>
      {/* Controller chip (slightly bigger) */}
      <rect x="11" y="18" width="6" height="8" fill={c} rx="0.3"/>
      {/* NAND chips */}
      <rect x="20" y="18" width="6" height="8" fill={c} rx="0.3"/>
      <rect x="28" y="18" width="6" height="8" fill={c} rx="0.3"/>
      {/* M-key edge connector (right side, with key cut) */}
      <rect x="35" y="18" width="5" height="3" fill={c}/>
      <rect x="35" y="23" width="5" height="3" fill={c}/>
    </svg>
  ),

  // U.2 / EDSFF eSSD — drive enclosure with label area + edge connector
  "u2": (c) => (
    <svg width="44" height="44" viewBox="0 0 44 44">
      {/* Drive body */}
      <rect x="3" y="10" width="38" height="24" rx="2" fill={c} opacity="0.35"/>
      <rect x="3" y="10" width="38" height="24" rx="2" fill="none" stroke={c} strokeWidth="1"/>
      {/* Top vent slats */}
      <rect x="6" y="13" width="22" height="0.8" fill={c} opacity="0.7"/>
      <rect x="6" y="15" width="22" height="0.8" fill={c} opacity="0.7"/>
      {/* Brand label area */}
      <rect x="6" y="18" width="22" height="13" fill={c} opacity="0.85" rx="0.3"/>
      <rect x="9" y="22" width="16" height="1.5" fill="#0F172A" opacity="0.55" rx="0.2"/>
      <rect x="9" y="25" width="12" height="1.5" fill="#0F172A" opacity="0.45" rx="0.2"/>
      <rect x="9" y="28" width="14" height="1.5" fill="#0F172A" opacity="0.45" rx="0.2"/>
      {/* PCIe edge connector on right */}
      <rect x="31" y="14" width="7" height="16" fill={c} rx="0.3"/>
      <line x1="32" y1="16" x2="37" y2="16" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="32" y1="18" x2="37" y2="18" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="32" y1="20" x2="37" y2="20" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="32" y1="22" x2="37" y2="22" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="32" y1="24" x2="37" y2="24" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="32" y1="26" x2="37" y2="26" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="32" y1="28" x2="37" y2="28" stroke="#0F172A" strokeWidth="0.5"/>
    </svg>
  ),

  // microSD — trapezoid card with cut corner + contact pins on bottom
  "microsd": (c) => (
    <svg width="44" height="44" viewBox="0 0 44 44">
      {/* Card body w/ cut corner */}
      <path d="M 14 6 L 33 6 L 33 38 L 14 38 L 14 13 L 21 6 Z" fill={c}/>
      {/* Logo area */}
      <rect x="18" y="11" width="11" height="6" fill="#0F172A" opacity="0.35" rx="0.5"/>
      {/* Contact pins on bottom */}
      <rect x="16" y="22" width="1.5" height="10" fill="#0F172A" opacity="0.6" rx="0.2"/>
      <rect x="19" y="22" width="1.5" height="10" fill="#0F172A" opacity="0.6" rx="0.2"/>
      <rect x="22" y="22" width="1.5" height="10" fill="#0F172A" opacity="0.6" rx="0.2"/>
      <rect x="25" y="22" width="1.5" height="10" fill="#0F172A" opacity="0.6" rx="0.2"/>
      <rect x="28" y="22" width="1.5" height="10" fill="#0F172A" opacity="0.6" rx="0.2"/>
      <rect x="31" y="22" width="1.5" height="10" fill="#0F172A" opacity="0.6" rx="0.2"/>
    </svg>
  ),

  // Raw NAND die — square wafer with grid and edge bond pads
  "die-square": (c) => (
    <svg width="44" height="44" viewBox="0 0 44 44">
      {/* Die body */}
      <rect x="7" y="7" width="30" height="30" fill={c} rx="0.5"/>
      {/* Internal circuit grid */}
      <line x1="14.5" y1="7" x2="14.5" y2="37" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="22" y1="7" x2="22" y2="37" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="29.5" y1="7" x2="29.5" y2="37" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="7" y1="14.5" x2="37" y2="14.5" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="7" y1="22" x2="37" y2="22" stroke="#0F172A" strokeWidth="0.5"/>
      <line x1="7" y1="29.5" x2="37" y2="29.5" stroke="#0F172A" strokeWidth="0.5"/>
      {/* Bond pads on edges */}
      <rect x="9" y="3" width="2.5" height="3" fill={c} opacity="0.7"/>
      <rect x="16" y="3" width="2.5" height="3" fill={c} opacity="0.7"/>
      <rect x="25.5" y="3" width="2.5" height="3" fill={c} opacity="0.7"/>
      <rect x="32.5" y="3" width="2.5" height="3" fill={c} opacity="0.7"/>
      <rect x="9" y="38" width="2.5" height="3" fill={c} opacity="0.7"/>
      <rect x="16" y="38" width="2.5" height="3" fill={c} opacity="0.7"/>
      <rect x="25.5" y="38" width="2.5" height="3" fill={c} opacity="0.7"/>
      <rect x="32.5" y="38" width="2.5" height="3" fill={c} opacity="0.7"/>
    </svg>
  ),

  // HDD — enclosure with platter visible + R/W arm (top-down view)
  "hdd": (c) => (
    <svg width="44" height="44" viewBox="0 0 44 44">
      {/* Drive enclosure */}
      <rect x="3" y="6" width="38" height="32" rx="2" fill={c} opacity="0.35"/>
      <rect x="3" y="6" width="38" height="32" rx="2" fill="none" stroke={c} strokeWidth="1"/>
      {/* Corner screws */}
      <circle cx="5.5" cy="8.5" r="1" fill={c}/>
      <circle cx="38.5" cy="8.5" r="1" fill={c}/>
      <circle cx="5.5" cy="35.5" r="1" fill={c}/>
      <circle cx="38.5" cy="35.5" r="1" fill={c}/>
      {/* Platter */}
      <circle cx="19" cy="22" r="13" fill={c} opacity="0.7"/>
      <circle cx="19" cy="22" r="13" fill="none" stroke="#0F172A" strokeWidth="0.4" opacity="0.5"/>
      <circle cx="19" cy="22" r="8" fill="none" stroke="#0F172A" strokeWidth="0.4" opacity="0.5"/>
      <circle cx="19" cy="22" r="4" fill="none" stroke="#0F172A" strokeWidth="0.4" opacity="0.5"/>
      {/* Spindle */}
      <circle cx="19" cy="22" r="2" fill="#0F172A" opacity="0.85"/>
      {/* Read/write arm */}
      <line x1="36" y1="11" x2="22" y2="21" stroke={c} strokeWidth="2"/>
      <circle cx="36" cy="11" r="1.6" fill={c}/>
      <rect x="20.5" y="19" width="3" height="1.3" fill="#0F172A" opacity="0.8" rx="0.3"/>
    </svg>
  ),
};

// Updated 2026-04-29
const PRODUCT_PRIMERS = {
  gpu: {
    label: "GPU",
    tagline: "AI accelerator silicon that runs the matrix math behind AI training and inference. Used in data center AI servers. Bought by hyperscalers (AWS, Azure, Google, Meta), neoclouds (CoreWeave, Lambda), large enterprises, and governments.",
    layers: [
      { label: "Finished Product", items: [
        { name: "Nvidia AI GPU", sub: "B200 / B300 / Vera Rubin · ~85% mkt (est.) · $30-70K ASP", color: T_.green, link: "NVDA" },
        { name: "AMD Instinct", sub: "MI355X / MI455X · ~10% mkt (est.) · $20-30K ASP", color: T_.red, link: "AMD" },
      ]},
      { label: "Design & IP", items: [
        { name: "NVIDIA (architect)", sub: "Hopper · Blackwell · Rubin · CUDA stack", color: T_.green, link: "NVDA" },
        { name: "AMD (architect)", sub: "CDNA 3/4/5 · ROCm", color: T_.red, link: "AMD" },
        { name: "Synopsys (EDA)", sub: "~31% EDA mkt · simulation/verification", color: T_.blue, link: "SNPS", flag: "concentration" },
        { name: "Cadence (EDA)", sub: "~30% EDA mkt · digital/analog flow", color: T_.blue, link: "CDNS", flag: "concentration" },
        { name: "Siemens EDA", sub: "~13% EDA mkt · Big-3 with SNPS+CDNS = ~75-85% combined", color: T_.blue, flag: "concentration" },
        { name: "ARM (CPU IP)", sub: "Neoverse V2/V3 — coherent CPU pairing for Grace/Vera", color: "#A855F7", link: "ARM" },
        { name: "Mellanox / NVLink IP", sub: "Owned by Nvidia (acq. 2020) — internal IP", color: T_.green, link: "NVDA" },
      ]},
      { label: "Packaging & Memory", items: [
        { name: "TSMC CoWoS", sub: "75K WPM Q1 26 → 130K target end-26 · dominant (some 2026 outsourced to ASE/Amkor)", color: T_.purple, link: "TSM", flag: "bottleneck" },
        { name: "SK Hynix HBM", sub: "HBM3E leader · ~53-57% share (Counterpoint Q3'25)", color: "#A855F7", link: "000660.KS", flag: "bottleneck" },
        { name: "Samsung HBM", sub: "HBM4 mass prod Feb 2026 (Pyeongtaek P4) · NVDA-qualified", color: T_.blue, link: "005930.KS", flag: "bottleneck" },
        { name: "Micron HBM", sub: "HBM3E ramping · HBM4 next", color: T_.amber, link: "MU", flag: "bottleneck" },
        { name: "Ibiden (ABF substrate)", sub: "~25% global ABF · capacity tight", color: "#EC4899", flag: "concentration" },
        { name: "Shinko / Unimicron / AT&S", sub: "ABF + organic substrates · all capacity-tight", color: "#EC4899", flag: "concentration" },
      ]},
      { label: "Foundry / Logic", items: [
        { name: "TSMC", sub: "N4P (B200/B300) · N3 (Rubin) · N2 (Rubin Ultra) · ~90% adv-node share", color: T_.purple, link: "TSM", flag: "concentration" },
        { name: "Intel Foundry", sub: "18A · Clearwater Forest validated MWC 26 · 14A High-NA next · not used for merchant GPU yet", color: "#0EA5E9", link: "INTC" },
        { name: "Samsung Foundry", sub: "Largely declined for AI logic — reserved for own use", color: T_.blue, link: "005930.KS" },
      ]},
      { label: "Fab Equipment", items: [
        { name: "ASML (litho)", sub: "EUV monopoly · 100% adv-node · multi-yr lead times", color: "#F97316", link: "ASML", flag: "bottleneck" },
        { name: "Applied Materials", sub: "Deposition, etch, CMP, ion implant · ~25% mkt", color: T_.amber, link: "AMAT" },
        { name: "Lam Research", sub: "Etch, deposition · ~20% mkt", color: T_.amber, link: "LRCX" },
        { name: "KLA", sub: "Inspection / metrology · ~50-60% wafer insp · 80%+ reticle insp", color: T_.amber, link: "KLAC", flag: "concentration" },
        { name: "Tokyo Electron (TEL)", sub: "Coater/developer + etch · ~90% track · near-100% on EUV/High-NA", color: T_.amber, flag: "concentration" },
        { name: "BE Semi / ASMPT", sub: "Hybrid bonding for HBM stacking · near-monopoly", color: T_.amber, flag: "concentration" },
        { name: "Teradyne / Advantest", sub: "Test equipment · duopoly", color: T_.amber, link: "TER" },
      ]},
      { label: "Materials & Chemicals", items: [
        { name: "Photoresist (Japan)", sub: "JSR, TOK, Shin-Etsu, Fujifilm, Sumitomo · ~90% global", color: "#FACC15", flag: "concentration" },
        { name: "PGME/PGMEA solvents", sub: "Iran-war hit Q1 26 · Daicel, Toagosei · prices +40-50% Apr · Korean alts (Chemtronics) supplying", color: "#FACC15", flag: "bottleneck" },
        { name: "Silicon wafers", sub: "Shin-Etsu Handotai, Sumco, Siltronic, GlobalWafers", color: "#FACC15", link: "SUMCO", flag: "concentration" },
        { name: "Specialty gases", sub: "Air Products, Linde, Air Liquide, Taiyo Nippon", color: "#FACC15", link: "APD" },
        { name: "Wet chemicals / cleaners", sub: "Fujifilm (acq. Entegris EC 2023), BASF, Avantor, KANTO", color: "#FACC15" },
        { name: "Photomasks", sub: "TOPPAN, Photronics, DNP · in-fab + merchant", color: "#FACC15", link: "PLAB" },
        { name: "CMP slurries", sub: "Merck KGaA (ex-Versum) / Entegris (acq. CMC) / DuPont", color: "#FACC15", link: "DD" },
      ]},
      { label: "Resources & Utilities", items: [
        { name: "Helium", sub: "~33% global from Qatar (Ras Laffan) — Mar 2026 strike, FM declared · Apr 7 ceasefire · normalization Jun-Aug 2026", color: "#DC2626", flag: "bottleneck" },
        { name: "Naphtha → propylene", sub: "Iran-war driven · ~doubled (Mar–May 2026, benchmark-dependent) · Korea expects 90% pre-war supply for May", color: "#DC2626", flag: "bottleneck" },
        { name: "Rare earths (Ga, Ge, Ne)", sub: "China dominance ~85% · Ga/Ge export ban suspended Nov 2025–Nov 2026", color: "#DC2626", flag: "concentration" },
        { name: "Power (Taiwan grid)", sub: "TSMC ~9% of Taiwan power (2025); S&P proj. ~24% by 2030 · grid expansion lagging", color: T_.amber, flag: "concentration" },
        { name: "Water (Taiwan/Korea)", sub: "Fab water-intensive · drought risk · ~10M gal/day per fab", color: T_.amber },
        { name: "Logistics", sub: "Sea + air freight · GPU shipped value ~$1M+/box", color: T_.textDim },
      ]},
    ],
    bottlenecks: [
      { node: "TSMC CoWoS", layer: "Packaging & Memory", supplier: "TSMC (sole)", leadTime: "12-18 mo", relief: "Ramp to 130K WPM end 2026; additional fabs Taiwan + Arizona", beneficiaries: "TSM directly. Resolves NVDA / AMD GPU supply." },
      { node: "HBM3E / HBM4", layer: "Packaging & Memory", supplier: "SK Hynix, Samsung, Micron", leadTime: "18-24 mo for new capacity", relief: "SK Hynix M15X + M16 mass prod, Micron HBM4 ramp 2027", beneficiaries: "000660.KS, 005930.KS, MU. Resolves Nvidia/AMD inventory." },
      { node: "ASML EUV", layer: "Fab Equipment", supplier: "ASML (sole)", leadTime: "Multi-year", relief: "Capacity expansion + High-NA EUV ramping", beneficiaries: "ASML. Resolves N3/N2 wafer capacity." },
      { node: "ABF substrate", layer: "Packaging & Memory", supplier: "Ibiden, Shinko, Unimicron, AT&S", leadTime: "12+ mo for new lines", relief: "Ibiden ¥500B (~$3.3B) 3-yr capex from FY26; AI-server substrate revenue ~3x YoY", beneficiaries: "Substrate makers (mostly Japanese / Taiwanese). Resolves chip-on-board cost." },
      { node: "PGME/PGMEA solvents", layer: "Materials & Chemicals", supplier: "Japanese chem majors via Daicel/Toagosei", leadTime: "Iran-war dependent", relief: "Korean alt suppliers (Chemtronics, Jaewon, Hanwul) ramping; PCN re-qual ~1 yr", beneficiaries: "Korean PGMEA suppliers. Resolves Samsung/SK Hynix fab continuity." },
      { node: "Helium", layer: "Resources & Utilities", supplier: "Qatar (~65% of Korea's imports), Algeria, US, Russia", leadTime: "Demand-elastic", relief: "Strategic reserves + new sources (Tanzania)", beneficiaries: "Air Products, Linde. Impacts ALL semi fabs + fiber-optics." },
      { node: "Liquid cooling (rack-scale)", layer: "Equipment / Infrastructure", supplier: "Vertiv, BE Semi, Asetek, CoolIT", leadTime: "6-12 mo", relief: "Vertiv ramping aggressively; multiple new entrants", beneficiaries: "VRT directly. Resolves NVL72-class deployment cadence." },
    ],
  },
  cpu: {
    label: "CPU",
    tagline: "General-purpose processor that runs the operating system, applications, and orchestrates AI accelerators. Used in servers, desktops, laptops, and embedded systems. Bought by server OEMs (Dell, HPE, Supermicro), hyperscalers, and PC makers.",
    layers: [
      { label: "Finished Product", items: [
        { name: "Intel Xeon", sub: "Granite Rapids · Sierra Forest · Clearwater Forest (1H 26) · ~71% unit / ~59% rev (Q4 25)", color: "#0EA5E9", link: "INTC" },
        { name: "AMD EPYC", sub: "Turin (Zen 5) · Venice (Zen 6, slip risk H2 26→27) · ~29% unit / ~41% rev share", color: T_.red, link: "AMD" },
        { name: "ARM-based DC CPU", sub: "Graviton, Cobalt, Axion, Vera, AGI, AmpereOne · low single-digit, growing", color: "#A855F7" },
      ]},
      { label: "Design & IP", items: [
        { name: "Intel (architect)", sub: "P-cores (Redwood/Panther Cove) · E-cores (Crestmont/Darkmont) · AMX", color: "#0EA5E9", link: "INTC" },
        { name: "AMD (architect)", sub: "Zen 5 / Zen 5c / Zen 6 · Infinity Fabric · CXL", color: T_.red, link: "AMD" },
        { name: "ARM Holdings (IP)", sub: "Neoverse V2/V3 · CSS-V3 · per-core royalty model", color: "#A855F7", link: "ARM" },
        { name: "Hyperscaler design teams", sub: "AWS Annapurna · MSFT silicon · Google Axion · Alibaba Yitian", color: T_.amber },
        { name: "x86 ISA (cross-license)", sub: "Closed ISA · Intel + AMD only · key barrier vs Arm", color: "#0EA5E9", flag: "concentration" },
        { name: "Synopsys (EDA)", sub: "~31% EDA mkt · simulation/verification", color: T_.blue, link: "SNPS", flag: "concentration" },
        { name: "Cadence (EDA)", sub: "~30% EDA mkt · digital/analog flow", color: T_.blue, link: "CDNS", flag: "concentration" },
        { name: "Siemens EDA", sub: "~13% EDA mkt · Big-3 with SNPS+CDNS", color: T_.blue, flag: "concentration" },
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
        { name: "Intel Foundry", sub: "Intel 7 (SPR/EMR) · Intel 3 (Granite/Sierra) · 18A (Clearwater Forest shipped MWC 26)", color: "#0EA5E9", link: "INTC", flag: "bottleneck" },
        { name: "Samsung Foundry", sub: "Rarely used for merchant DC CPUs", color: T_.blue, link: "005930.KS" },
        { name: "GlobalFoundries", sub: "Mature-node I/O dies (12nm/14nm) for AMD chiplets", color: T_.textDim, link: "GFS" },
      ]},
      { label: "Fab Equipment", items: [
        { name: "ASML (litho)", sub: "EUV monopoly · 100% adv-node · multi-yr lead times", color: "#F97316", link: "ASML", flag: "bottleneck" },
        { name: "Applied Materials", sub: "Deposition, etch, CMP, ion implant · ~25% mkt", color: T_.amber, link: "AMAT" },
        { name: "Lam Research", sub: "Etch, deposition · ~20% mkt", color: T_.amber, link: "LRCX" },
        { name: "KLA", sub: "Inspection / metrology · ~50-60% wafer insp · 80%+ reticle insp", color: T_.amber, link: "KLAC", flag: "concentration" },
        { name: "Tokyo Electron (TEL)", sub: "Coater/developer + etch · ~90% track · near-100% on EUV/High-NA", color: T_.amber, flag: "concentration" },
        { name: "Teradyne / Advantest", sub: "Test equipment · duopoly", color: T_.amber, link: "TER" },
      ]},
      { label: "Materials & Chemicals", items: [
        { name: "Photoresist (Japan)", sub: "JSR, TOK, Shin-Etsu, Fujifilm, Sumitomo · ~90% global", color: "#FACC15", flag: "concentration" },
        { name: "PGME/PGMEA solvents", sub: "Iran-war hit Q1 26 · Daicel, Toagosei · prices +40-50% Apr · Korean alts (Chemtronics) supplying", color: "#FACC15", flag: "bottleneck" },
        { name: "Silicon wafers", sub: "Shin-Etsu Handotai, Sumco, Siltronic, GlobalWafers", color: "#FACC15", link: "SUMCO", flag: "concentration" },
        { name: "Specialty gases", sub: "Air Products, Linde, Air Liquide, Taiyo Nippon", color: "#FACC15", link: "APD" },
        { name: "Wet chemicals / cleaners", sub: "Fujifilm (acq. Entegris EC 2023), BASF, Avantor, KANTO", color: "#FACC15" },
        { name: "Photomasks", sub: "TOPPAN, Photronics, DNP · in-fab + merchant", color: "#FACC15", link: "PLAB" },
        { name: "CMP slurries", sub: "Merck KGaA (ex-Versum) / Entegris (acq. CMC) / DuPont", color: "#FACC15", link: "DD" },
      ]},
      { label: "Resources & Utilities", items: [
        { name: "Helium", sub: "~33% global from Qatar (Ras Laffan) — Mar 2026 strike · Apr 7 ceasefire · normalization Jun-Aug 2026", color: "#DC2626", flag: "bottleneck" },
        { name: "Naphtha → propylene", sub: "Iran-war driven · ~doubled (Mar–May 2026, benchmark-dependent) · Korea expects 90% pre-war supply for May", color: "#DC2626", flag: "bottleneck" },
        { name: "Rare earths (Ga, Ge, Ne)", sub: "China dominance ~85% · Ga/Ge export ban suspended Nov 2025–Nov 2026", color: "#DC2626", flag: "concentration" },
        { name: "Power (Taiwan / Arizona grids)", sub: "TSMC + Intel Arizona fab loads · grid expansion lagging", color: T_.amber, flag: "concentration" },
        { name: "Water (Taiwan / Korea / Arizona)", sub: "Fab water-intensive · drought risk · ~10M gal/day per fab", color: T_.amber },
        { name: "Logistics", sub: "Sea + air freight · CPU value $1-15K/unit", color: T_.textDim },
      ]},
    ],
    bottlenecks: [
      { node: "Intel 18A yield (Diamond Rapids)", layer: "Foundry / Logic", supplier: "Intel Foundry (sole)", leadTime: "Diamond Rapids slip risk to mid-2027", relief: "Clearwater Forest launched MWC Mar 2026 (good sign); Diamond Rapids ramp 2H 2026 / 2027; fallback = TSMC N2", beneficiaries: "INTC if resolves; AMD harvests share if slips further." },
      { node: "TSMC N3 / N2 wafer starts", layer: "Foundry / Logic", supplier: "TSMC (sole adv-node)", leadTime: "12-18 mo", relief: "Arizona N2 fabs ramping 2027+", beneficiaries: "TSM directly. Resolves AMD, Vera, AGI, Graviton5 — but competes with GPU demand for same capacity." },
      { node: "ABF substrate", layer: "Packaging & Memory", supplier: "Ibiden, Shinko, Unimicron, AT&S", leadTime: "12+ mo for new lines", relief: "Ibiden expansion ~+15% 2026", beneficiaries: "Substrate makers. Shared bottleneck with GPU." },
      { node: "ASML EUV", layer: "Fab Equipment", supplier: "ASML (sole)", leadTime: "Multi-year", relief: "Capacity expansion + High-NA EUV ramping", beneficiaries: "ASML. Shared upstream constraint across CPU + GPU + DRAM." },
      { node: "MRDIMM (high-BW memory)", layer: "Packaging & Memory", supplier: "Micron, SK Hynix, Samsung", leadTime: "12 mo for MRDIMM ramp", relief: "DDR5 capacity expansions through 2027", beneficiaries: "MU directly. Granite Rapids + Venice need MRDIMM for full memory bandwidth." },
      { node: "PGME/PGMEA solvents", layer: "Materials & Chemicals", supplier: "Japanese chem majors via Daicel/Toagosei", leadTime: "Iran-war dependent", relief: "Korean alt suppliers (Chemtronics, Jaewon, Hanwul) ramping; PCN re-qual ~1 yr", beneficiaries: "Korean PGMEA suppliers. Resolves all fab continuity (CPU + GPU + DRAM)." },
      { node: "Helium", layer: "Resources & Utilities", supplier: "Qatar (~65% of Korea's imports), Algeria, US, Russia", leadTime: "Demand-elastic", relief: "Strategic reserves + Tanzania", beneficiaries: "Air Products, Linde. Impacts ALL semi fabs." },
      { node: "VRMs (high-power CPUs)", layer: "Equipment / Infrastructure", supplier: "MPS, ON Semi, ADI, Vicor", leadTime: "6-12 mo", relief: "Multiple suppliers ramping density", beneficiaries: "MPS, ADI. Resolves Diamond Rapids (650W) + Venice (600W) deployment." },
    ],
  },
  hbm: {
    label: "HBM",
    tagline: "High-bandwidth stacked DRAM packaged on top of AI accelerator chips. Used inside NVIDIA / AMD GPUs and custom AI ASICs (Google TPU, AWS Trainium, Microsoft MAIA). Sold by the 3 HBM suppliers (SK Hynix, Samsung, Micron) to those accelerator makers.",
    familyContext: {
      title: "DRAM Family — what HBM is part of",
      intro: "DRAM (Dynamic Random Access Memory) is the volatile main-memory tier — fast, byte-addressable, loses state when power cuts. The Big-3 memory makers (Samsung, SK Hynix, Micron) produce every variant below from the same underlying DRAM cell technology, but differ massively by packaging, interface, bandwidth, and form factor. HBM sits at the top — highest bandwidth, highest ASP, scarcest supply, AI-only.",
      specHeader: "Bandwidth",
      highlightColor: "#A855F7",
      rows: [
        {
          name: "HBM3E / HBM4",
          highlight: true,
          formIcon: "hbm-stack",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/AMD_Fiji_GPU_package_with_GPU%2C_HBM_memory_and_interposer.jpg/330px-AMD_Fiji_GPU_package_with_GPU%2C_HBM_memory_and_interposer.jpg",
          form: "8–16 dies stacked + logic base die · on-package via CoWoS",
          spec: "1.2–1.6+ TB/s per stack",
          asp: "$15–20",
          use: "AI accelerators only — Nvidia H200/B200/B300/Rubin, AMD MI300/MI400, AWS Trainium, Google TPU",
          notes: "Bandwidth is the moat. Only 3 makers globally.",
        },
        {
          name: "DDR5 (RDIMM / UDIMM)",
          formIcon: "dimm",
          imageUrl: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/products/pf-layout/pf_module/ddr5/spec-module-ddr5-rdimm-pc.png",
          form: "JEDEC DIMM · pluggable module",
          spec: "4800–8400 MT/s · ~38–67 GB/s per channel",
          asp: "$3–4",
          use: "Server main memory (12-ch on Granite Rapids / Turin), desktop, workstation",
          notes: "Highest-volume DRAM by far. Commodity-cyclical pricing. The 'baseline' DRAM.",
        },
        {
          name: "MRDIMM / MCRDIMM",
          formIcon: "dimm",
          imageUrl: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/products/pf-layout/pf_module/ddr5/spec-module-ddr5-mrdimm-pc.png",
          form: "DDR5 DIMM variant · multiplexed dual-rank",
          spec: "12,800 MT/s · 1.6x DDR5 BW",
          asp: "$5–6",
          use: "Top-end servers needing more memory BW — Granite Rapids 12-ch MRDIMM, Diamond Rapids, Venice",
          notes: "Bridges DDR5 ↔ HBM for memory-BW-bound CPU workloads. Niche but growing.",
        },
        {
          name: "LPDDR5X / LPDDR6",
          formIcon: "bga-square",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Tolino_shine_-_controller_board_-_Samsung_K4X2G323PD-8GD8-1997.jpg/250px-Tolino_shine_-_controller_board_-_Samsung_K4X2G323PD-8GD8-1997.jpg",
          form: "PoP soldered · no DIMM · low-power",
          spec: "8533–10700 MT/s",
          asp: "$4–5",
          use: "Smartphones, tablets, laptops · NEW: Nvidia GB200/GB300 Grace CPU (480GB LPDDR5X soldered per CPU)",
          notes: "Becoming AI-relevant on the host-CPU side. LPDDR6 JEDEC spec finalizing 2026.",
        },
        {
          name: "GDDR6 / GDDR7",
          formIcon: "bga-square",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/RTX_3060_12GB_GDDR6_with_GA104.png/250px-RTX_3060_12GB_GDDR6_with_GA104.png",
          form: "BGA soldered around GPU die",
          spec: "GDDR6 ~16–24 GT/s · GDDR7 32 GT/s (~1.5 TB/s/GPU)",
          asp: "$5–6",
          use: "Gaming GPUs (RTX 5090, RX 9000), edge AI (DGX Spark, RTX 6000 Pro), consoles",
          notes: "GDDR7 ramping 2025-2026. The non-CoWoS path for lower-end / consumer AI.",
        },
        {
          name: "SRAM (for context — not memory-co product)",
          formIcon: "die-on-chip",
          form: "On-die · integrated in CPU / GPU caches",
          spec: "TB/s class · ns latency",
          asp: "n/a (logic foundry — TSMC / Intel / Samsung)",
          use: "CPU L1/L2/L3, accelerator scratchpads, on-die memory in NVDA / AMD / Apple silicon",
          notes: "Not made by memory cos. SRAM stops scaling at ~N3 (the 'SRAM wall'). This is WHY HBM matters — off-chip bandwidth has to compensate for on-die memory not shrinking.",
        },
      ],
    },
    layers: [
      { label: "Finished Product", items: [
        { name: "SK Hynix HBM", sub: "HBM3E leader · ~53-57% share (Counterpoint Q3'25) · M16 + M15X", color: "#A855F7", link: "000660.KS", flag: "bottleneck" },
        { name: "Samsung HBM", sub: "HBM4 mass prod Feb 2026 (P4/Pyeongtaek) · ~22% share, growing · NVDA-qualified", color: T_.blue, link: "005930.KS", flag: "bottleneck" },
        { name: "Micron HBM", sub: "HBM3E ramp · HBM4 next · Boise + Hiroshima · ~21% share", color: T_.amber, link: "MU", flag: "bottleneck" },
      ]},
      { label: "Design & IP", items: [
        { name: "JEDEC HBM standard", sub: "HBM3E (1.2 TB/s) → HBM4 (~1.6 TB/s) · industry-wide", color: T_.textDim },
        { name: "DRAM cell design (per-vendor)", sub: "1a / 1b / 1c node — proprietary; SK Hynix process leadership", color: "#A855F7", link: "000660.KS" },
        { name: "TSV / 3D-stack design IP", sub: "Through-silicon vias (1024+ per die) · per-vendor IP", color: "#A855F7" },
        { name: "Logic base die design (HBM4)", sub: "First HBM gen with logic-class base die — TSMC N5/N3 fab for SK Hynix HBM4", color: T_.purple, link: "TSM" },
        { name: "Synopsys / Cadence / Siemens EDA", sub: "DRAM design tools · same EDA stack as logic · Big-3 ~75-85%", color: T_.blue, link: "SNPS", flag: "concentration" },
      ]},
      { label: "Stacking & Assembly", items: [
        { name: "Hybrid bonding (BE Semi + ASMPT)", sub: "Near-duopoly · multi-yr tool lead times · the binding HBM constraint", color: T_.red, flag: "bottleneck" },
        { name: "TSV process", sub: "Through-silicon via etch + Cu fill · 1024+ per die at HBM3E", color: T_.red, flag: "bottleneck" },
        { name: "Wafer thinning (Disco)", sub: "Disco leads · top-5 (Disco, Tokyo Seimitsu, Okamoto, CETC, G&N) ~90% combined · grinder + dicer", color: T_.red, flag: "concentration" },
        { name: "Stack height (8H → 12H → 16H)", sub: "Yield drops sharply with height · 16H HBM4e in dev", color: "#A855F7" },
        { name: "Underfill / molding (Resonac)", sub: "Resonac (Showa Denko), Sumitomo Bakelite · HBM-specific", color: "#EC4899", flag: "concentration" },
        { name: "HBM wafer-level test", sub: "Advantest + Teradyne (Magnum EPIC industry std) · multi-month lead time bottleneck", color: T_.red, flag: "bottleneck" },
      ]},
      { label: "DRAM Manufacturing", items: [
        { name: "SK Hynix M16 (Icheon)", sub: "HBM4 mass prod started ~Feb 2026 · 1c node", color: "#A855F7", link: "000660.KS", flag: "bottleneck" },
        { name: "SK Hynix M15X (Cheongju)", sub: "1st cleanroom pilot May 2026 · ~50-60K wpm by mid-2027 · ~$15B / 20T won invest", color: "#A855F7", link: "000660.KS" },
        { name: "Samsung Pyeongtaek + Hwaseong", sub: "P4 line · HBM4 mass prod Feb 2026 · 1c node · catching SK Hynix", color: T_.blue, link: "005930.KS" },
        { name: "Micron Boise + Hiroshima", sub: "HBM3E ramp · HBM4 in dev · 1b → 1c transition", color: T_.amber, link: "MU" },
        { name: "1a / 1b / 1c DRAM nodes", sub: "~12-10nm-class · SK Hynix leads node migration", color: "#A855F7", flag: "bottleneck" },
        { name: "TSMC (logic base die for HBM4)", sub: "New dependency · N5/N3 for HBM4 base die · SK Hynix outsourcing", color: T_.purple, link: "TSM", flag: "concentration" },
      ]},
      { label: "Fab Equipment", items: [
        { name: "ASML (litho)", sub: "EUV used for 1a/1b/1c DRAM nodes · multi-yr lead times", color: "#F97316", link: "ASML", flag: "bottleneck" },
        { name: "Lam Research", sub: "Etch-heavy for DRAM · capacitor + TSV etch · ~50% DRAM equip", color: T_.amber, link: "LRCX", flag: "concentration" },
        { name: "Applied Materials", sub: "Deposition + ion implant for DRAM", color: T_.amber, link: "AMAT" },
        { name: "KLA", sub: "Inspection / metrology · ~50-60% wafer insp · 80%+ reticle insp", color: T_.amber, link: "KLAC", flag: "concentration" },
        { name: "Tokyo Electron (TEL)", sub: "Coater/developer + etch · ~90% track · near-100% on EUV/High-NA", color: T_.amber, flag: "concentration" },
        { name: "BE Semi / ASMPT", sub: "Hybrid bonding tools · the gating HBM equipment", color: T_.amber, flag: "bottleneck" },
        { name: "Disco (wafer thinning)", sub: "Disco leads · top-5 ~90% · TSV-thinning + dicing", color: T_.amber, flag: "concentration" },
        { name: "Advantest / Teradyne (HBM test)", sub: "Duopoly · Teradyne Magnum EPIC = HBM stack-test std · long cycle a key throughput bottleneck", color: T_.amber, flag: "bottleneck" },
      ]},
      { label: "Materials & Chemicals", items: [
        { name: "Photoresist (Japan)", sub: "JSR, TOK, Shin-Etsu, Fujifilm, Sumitomo · ~90% global", color: "#FACC15", flag: "concentration" },
        { name: "PGME/PGMEA solvents", sub: "Iran-war hit Q1 26 · Daicel, Toagosei · prices +40-50% Apr · Korean fabs directly exposed", color: "#FACC15", flag: "bottleneck" },
        { name: "Silicon wafers", sub: "Shin-Etsu Handotai, Sumco · DRAM uses 300mm prime wafers", color: "#FACC15", link: "SUMCO", flag: "concentration" },
        { name: "TSV copper plating chems", sub: "Cu electroplating + barrier · Atotech, Entegris", color: "#FACC15", link: "ENTG" },
        { name: "Underfill / molding compound", sub: "Resonac (4004.T), Sumitomo Bakelite · HBM-specific", color: "#FACC15", flag: "concentration" },
        { name: "Specialty gases", sub: "Air Products, Linde, Air Liquide, Taiyo Nippon", color: "#FACC15", link: "APD" },
        { name: "CMP slurries / pads", sub: "Versum / CMC Materials / Cabot Microelectronics", color: "#FACC15", link: "DD" },
      ]},
      { label: "Resources & Utilities", items: [
        { name: "Helium", sub: "~33% global from Qatar (Ras Laffan) · Mar 2026 strike · Apr 7 ceasefire · normalization Jun-Aug · DRAM-critical", color: "#DC2626", flag: "bottleneck" },
        { name: "Naphtha → propylene", sub: "Iran-war driven · ~doubled Mar-May 2026 (benchmark-dependent) · hits Korean fabs first · 90% pre-war May supply", color: "#DC2626", flag: "bottleneck" },
        { name: "Power (Korean grid)", sub: "Samsung + SK Hynix concentrated in Korea · ~5%+ of grid", color: T_.amber, flag: "concentration" },
        { name: "Water (Korea)", sub: "Korean fabs water-intensive · drought risk · ~10M gal/day per fab", color: T_.amber, flag: "concentration" },
        { name: "Rare earths (Ga, Ge)", sub: "China dominance · Ga/Ge export ban suspended Nov 2025–Nov 2026 · DRAM uses gallium", color: "#DC2626", flag: "concentration" },
        { name: "Logistics", sub: "HBM ships to TSMC CoWoS for GPU integration · time-sensitive", color: T_.textDim },
      ]},
    ],
    bottlenecks: [
      { node: "HBM3E / HBM4 capacity", layer: "Finished Product", supplier: "SK Hynix, Samsung, Micron (only 3 globally)", leadTime: "18-24 mo for new capacity", relief: "SK Hynix M15X + M16 mass prod, Micron HBM4 ramp 2027", beneficiaries: "000660.KS, 005930.KS, MU. Resolves Nvidia/AMD GPU inventory." },
      { node: "Hybrid bonding (BE Semi / ASMPT)", layer: "Stacking & Assembly", supplier: "BE Semi (BESI), ASMPT (HK)", leadTime: "Multi-year tool lead time", relief: "Tool capacity expanding 2026-2027", beneficiaries: "BESI, ASMPT. Resolves stack throughput at all 3 HBM makers." },
      { node: "HBM test (Advantest + Teradyne)", layer: "Stacking & Assembly", supplier: "Advantest + Teradyne (Magnum EPIC = HBM stack std)", leadTime: "Multi-month test cycle", relief: "Both vendors expanding capacity; faster test methodologies", beneficiaries: "6857.T (Advantest), TER (Teradyne). Resolves HBM throughput across all 3 makers." },
      { node: "DRAM 1a/1b/1c node capacity", layer: "DRAM Manufacturing", supplier: "SK Hynix, Samsung, Micron (each fab their own)", leadTime: "18-24 mo for new clean-room", relief: "M15X clean-room ready May 2026, SK Hynix M16 ramping, Micron 1c ramp", beneficiaries: "All 3 HBM makers + DRAM equip suppliers (LRCX, AMAT, ASML)." },
      { node: "TSMC logic base die (HBM4)", layer: "DRAM Manufacturing", supplier: "TSMC (sole)", leadTime: "12-18 mo", relief: "TSMC allocation to SK Hynix HBM4 base die", beneficiaries: "TSM. New revenue stream — first time HBM uses logic foundry." },
      { node: "Disco wafer thinning", layer: "Stacking & Assembly", supplier: "Disco (~70%)", leadTime: "12 mo for new tools", relief: "Disco capacity expansion; alternative TKK Group", beneficiaries: "6146.T (Disco). Critical to TSV-thinning step." },
      { node: "PGME/PGMEA solvents", layer: "Materials & Chemicals", supplier: "Japanese chem majors via Daicel/Toagosei", leadTime: "Iran-war dependent", relief: "Korean alt suppliers (Chemtronics, Jaewon, Hanwul) ramping; PCN re-qual ~1 yr", beneficiaries: "Korean PGMEA suppliers. Korean HBM fabs uniquely exposed." },
      { node: "Helium", layer: "Resources & Utilities", supplier: "Qatar (~65% of Korea's imports), Algeria, US, Russia", leadTime: "Demand-elastic", relief: "Strategic reserves + Tanzania", beneficiaries: "Air Products, Linde. DRAM fabs are particularly helium-intensive." },
    ],
  },
  nand: {
    label: "NAND / SSD",
    tagline: "Non-volatile flash storage that retains data when power is off. Used in data center SSDs, smartphone storage (UFS / eMMC), consumer M.2 SSDs, and memory cards. Bought by hyperscalers, smartphone OEMs (Apple, Samsung), and PC makers.",
    familyContext: {
      title: "Non-Volatile Memory Family — what NAND/SSD is part of",
      intro: "NAND flash is the storage tier — persistent, block-addressable, ~100x cheaper $/GB than DRAM but ~1000x higher latency. SSDs are products built on NAND (controller + NAND dies + DRAM cache + firmware). The same 5 NAND makers (Samsung, SK Hynix/Solidigm, Kioxia, Sandisk, Micron) sell into very different products — from $0.05/GB consumer M.2 drives to $0.30/GB enterprise QLC eSSDs. At Samsung / SK Hynix / Micron, NAND and DRAM/HBM share fabs and capex — every NAND wafer is a DRAM/HBM wafer not built.",
      specHeader: "Interface / Speed",
      highlightColor: "#14B8A6",
      rows: [
        {
          name: "Enterprise SSD (eSSD)",
          highlight: true,
          formIcon: "u2",
          imageUrl: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/products/pf-layout/spec-ssd-epssd-bm1743.png",
          form: "U.2 / U.3 / EDSFF E1.S / E3.S (replacing 2.5\" SATA)",
          spec: "NVMe over PCIe Gen5 (~14 GB/s seq) · Gen6 in 2027",
          asp: "$0.10–0.30",
          use: "Hyperscaler data centers, AI training storage tier, all-flash arrays. AI driver: model weights, vector DBs, KV-cache spill, checkpoint storage.",
          notes: "Samsung BM1743 122TB QLC + Solidigm D5-P5336 122TB shipping. Fastest-growing NAND segment. 1-3 DWPD endurance.",
        },
        {
          name: "Client SSD (cSSD)",
          formIcon: "m2",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Toshiba_M2_2280_256_GB_SSD_front.jpg/250px-Toshiba_M2_2280_256_GB_SSD_front.jpg",
          form: "M.2 2280 NVMe · BGA",
          spec: "PCIe Gen4 (~7 GB/s) mainstream · Gen5 high-end",
          asp: "$0.05–0.10",
          use: "Laptops, desktops, gaming PCs — replacing all HDDs in PCs",
          notes: "Highest-volume SSD by units. Commodity pricing. Phison + SMI controllers dominate.",
        },
        {
          name: "UFS (Universal Flash Storage)",
          formIcon: "bga-square",
          imageUrl: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/products/pf-layout/spec-estorage-ufs-ufs4-1.png",
          form: "BGA soldered · single chip",
          spec: "UFS 4.0 ~4.2 GB/s seq",
          asp: "$0.10–0.15",
          use: "Premium smartphones (iPhone, Galaxy flagships), high-end tablets",
          notes: "Replacing eMMC at the top end. AI-on-device pushing capacity to 256GB+ standard.",
        },
        {
          name: "eMMC (embedded MMC)",
          formIcon: "bga-square",
          form: "BGA soldered",
          spec: "~400 MB/s (eMMC 5.1)",
          asp: "$0.05–0.10",
          use: "Entry-level smartphones, tablets, IoT, automotive infotainment, set-top boxes",
          notes: "Mature, declining mix as UFS takes premium-phone share. Still volume-strong in IoT/auto.",
        },
        {
          name: "Removable consumer",
          formIcon: "microsd",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/SanDisk_Extreme_265_Gigabyte_MicroSD_Card.jpg/250px-SanDisk_Extreme_265_Gigabyte_MicroSD_Card.jpg",
          form: "microSD, SD, USB drives, CFexpress",
          spec: "50 MB/s – 2 GB/s depending on tier",
          asp: "$0.05–0.10",
          use: "Consumer storage expansion, cameras, action cams, drone storage",
          notes: "Largely commoditized. Sandisk + Kioxia (BiCS JV) dominate. Consumer slice.",
        },
        {
          name: "3D NAND wafer (raw die)",
          formIcon: "die-square",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/A_2230_NVME_SSD.jpg/250px-A_2230_NVME_SSD.jpg",
          form: "Bare die · TLC / QLC / PLC",
          spec: "Cell-level (interface depends on product above)",
          asp: "$0.04–0.07 (raw)",
          use: "Underlying technology — feeds all SSD / UFS / eMMC / microSD products above",
          notes: "232L mainstream (Samsung V8, Micron G9). SK Hynix 321L in mass prod (since Aug 2025). QLC dominant in eSSD; PLC emerging.",
        },
        {
          name: "HDD (for context — mechanical, not NAND)",
          formIcon: "hdd",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Seagte_EXOS_X18_18_TB_20221006_oblique_bottom_view_HOF05339.png/250px-Seagte_EXOS_X18_18_TB_20221006_oblique_bottom_view_HOF05339.png",
          form: "Mechanical 3.5\" platters",
          spec: "~200 MB/s seq",
          asp: "$0.015–0.02",
          use: "Cold / archival storage; hyperscaler warm tier (declining)",
          notes: "Seagate / Western Digital. Being displaced by QLC eSSDs for warm storage — multi-year tailwind for NAND bit demand.",
        },
      ],
    },
    layers: [
      { label: "Finished Product", items: [
        { name: "Samsung NAND/SSD", sub: "~33% (Q3'25; ~28% Q4'25) NAND share · enterprise + client + UFS · BM1743 122TB QLC eSSD", color: T_.blue, link: "005930.KS" },
        { name: "SK Hynix + Solidigm", sub: "~20-22% combined · Solidigm = enterprise QLC leader · D5-P5336 122TB", color: "#A855F7", link: "000660.KS" },
        { name: "Kioxia", sub: "~15-17% share · BiCS Flash · Japan IPO Dec 2024", color: T_.amber, link: "285A.T" },
        { name: "Sandisk", sub: "~14% share · spun from WD Feb 2025 · BiCS Flash JV w/ Kioxia", color: T_.red, link: "SNDK" },
        { name: "Micron NAND/SSD", sub: "~13% share · G9 NAND · Crucial discontinued Feb 2026 (exit consumer)", color: T_.amber, link: "MU" },
        { name: "YMTC (China)", sub: "~5-7% rev / ~8% cap share (volatile) · Wuhan · capped by US export controls · Xtacking tech", color: "#DC2626", flag: "concentration" },
      ]},
      { label: "Design & IP", items: [
        { name: "3D NAND architectures (per-vendor)", sub: "Samsung V-NAND · SK Hynix 4D PUC · Kioxia/Sandisk BiCS · Micron RG · YMTC Xtacking", color: "#A855F7" },
        { name: "NVMe spec (NVM Express)", sub: "Open standard · governs SSD interface · NVMe 2.0 + ZNS", color: T_.textDim },
        { name: "PCIe SIG", sub: "Gen4 mainstream · Gen5 ramping · Gen6 ecosystem 2027", color: T_.textDim },
        { name: "JEDEC UFS / eMMC", sub: "UFS 4.0 shipping · UFS 5.0 in dev · eMMC mature", color: T_.textDim },
        { name: "Synopsys / Cadence / Siemens EDA", sub: "NAND + controller design tools · Big-3 same as logic ~75-85%", color: T_.blue, link: "SNPS", flag: "concentration" },
      ]},
      { label: "SSD Controllers", items: [
        { name: "Marvell (enterprise)", sub: "Bravera + leading-edge eSSD controllers · ~40%+ eSSD merchant mkt (est.)", color: T_.green, link: "MRVL" },
        { name: "Phison (consumer + enterprise)", sub: "E26/E28 consumer · Aerosphere AI eSSD · Pascari enterprise brand", color: T_.blue, link: "8299.TWO" },
        { name: "Silicon Motion", sub: "~30%+ client SSD controller (est.) · SM2508 PCIe Gen5", color: T_.amber, link: "SIMO" },
        { name: "Innogrit", sub: "Consumer + enterprise · IG5666 PCIe Gen5 · growing share", color: T_.textDim },
        { name: "In-house (Samsung, SK Hynix)", sub: "Vertically integrated · don't use merchant controllers for own-brand SSD", color: T_.blue, link: "005930.KS" },
      ]},
      { label: "Stacking & Layer Tech", items: [
        { name: "3D NAND layer count (232L → 300L+)", sub: "Samsung V8 (236L) · Micron G9 (232L) · SK Hynix 321L in mass prod · YMTC 232L", color: "#A855F7", flag: "bottleneck" },
        { name: "String stacking (multi-deck)", sub: "Multiple decks bonded for layer-count scaling · Micron pioneered", color: "#A855F7" },
        { name: "High-aspect-ratio (HAR) etch", sub: "Memory-hole etch through hundreds of layers · Lam Cryo-etch dominates", color: T_.red, flag: "bottleneck" },
        { name: "Cell type (TLC / QLC / PLC)", sub: "Bits per cell · TLC mainstream · QLC growing fast · PLC emerging 2026-27", color: "#A855F7" },
        { name: "Hybrid bonding (CMOS-on-NAND)", sub: "SK Hynix 4D PUC · YMTC Xtacking · enables peripheral logic on separate wafer", color: T_.red },
        { name: "Wafer-level test", sub: "Advantest + Teradyne · meaningfully less constrained than HBM test", color: T_.amber },
      ]},
      { label: "NAND Manufacturing", items: [
        { name: "Samsung Pyeongtaek + Xi'an", sub: "P1/P2/P3 · V8 production · V10 in dev · Xi'an in China (legacy)", color: T_.blue, link: "005930.KS" },
        { name: "SK Hynix Cheongju + Solidigm Dalian", sub: "M11/M15 · Solidigm Dalian fab acquired from Intel 2021", color: "#A855F7", link: "000660.KS" },
        { name: "Kioxia Yokkaichi + Kitakami", sub: "Joint fab w/ Sandisk (BiCS Flash) · Fab 6/7 Yokkaichi · Kitakami K1 new", color: T_.amber, link: "285A.T" },
        { name: "Sandisk (Yokkaichi shared w/ Kioxia)", sub: "BiCS Flash JV · spun from WD Feb 2025 · ~$2B annual capex", color: T_.red, link: "SNDK" },
        { name: "Micron Singapore + Manassas", sub: "$24B Singapore expansion · +700K sq ft cleanroom · NAND ramp H2 2028", color: T_.amber, link: "MU" },
        { name: "YMTC Wuhan (China)", sub: "Xtacking tech · capped by US export controls · ~5-7% rev / ~8% cap (volatile)", color: "#DC2626", flag: "concentration" },
      ]},
      { label: "Fab Equipment", items: [
        { name: "Lam Research (HAR etch)", sub: "Memory-hole etch · ~50%+ NAND etch mkt · Cryo-etch lead · the gating NAND tool", color: T_.amber, link: "LRCX", flag: "bottleneck" },
        { name: "Applied Materials", sub: "Deposition (W, oxide), ALD · ~25% NAND equip · critical for many-layer films", color: T_.amber, link: "AMAT" },
        { name: "Tokyo Electron (TEL)", sub: "Coater/developer + etch via subsidiary · ~90% track", color: T_.amber, flag: "concentration" },
        { name: "ASML (litho)", sub: "Mostly KrF/ArF for NAND · less EUV than DRAM · not the binding bottleneck", color: "#F97316", link: "ASML" },
        { name: "KLA", sub: "Inspection / metrology · ~50% wafer inspection", color: T_.amber, link: "KLAC", flag: "concentration" },
        { name: "Disco (wafer thinning + dicing)", sub: "NAND thinning + dicing · less critical than HBM thinning", color: T_.amber },
        { name: "Advantest / Teradyne (test)", sub: "Duopoly · NAND wafer test · less constrained than HBM", color: T_.amber, link: "TER" },
      ]},
      { label: "Materials & Chemicals", items: [
        { name: "HAR etch chemicals (Cryo)", sub: "Fluorocarbon etchants · specialty mixes · Lam-proprietary recipes", color: "#FACC15", flag: "concentration" },
        { name: "Tungsten deposition (WF6)", sub: "Word-lines + interconnect · Linde, Air Products, Mitsui", color: "#FACC15", link: "APD" },
        { name: "Photoresist (KrF/ArF)", sub: "JSR, TOK, Shin-Etsu, Fujifilm, Sumitomo · less EUV than DRAM", color: "#FACC15", flag: "concentration" },
        { name: "PGME/PGMEA solvents", sub: "Same Iran-war exposure as DRAM · Korean/Japanese NAND fabs hit", color: "#FACC15", flag: "bottleneck" },
        { name: "Silicon wafers", sub: "Shin-Etsu, Sumco, Siltronic · 300mm prime · same wafers as DRAM", color: "#FACC15", link: "SUMCO", flag: "concentration" },
        { name: "Specialty gases", sub: "Air Products, Linde, Air Liquide, Taiyo Nippon", color: "#FACC15", link: "APD" },
        { name: "CMP slurries", sub: "Merck KGaA / Entegris / DuPont · CMP step per layer in 3D NAND", color: "#FACC15", link: "DD" },
      ]},
      { label: "Resources & Utilities", items: [
        { name: "Helium", sub: "Qatar (~65% of Korea's imports) · NAND less helium-intensive than DRAM but still needed", color: "#DC2626", flag: "concentration" },
        { name: "Power (Korea / Japan / Singapore)", sub: "Samsung + SK Hynix in Korea, Kioxia in Japan, Micron in Singapore", color: T_.amber, flag: "concentration" },
        { name: "Water (Singapore / Korea / Japan)", sub: "Fab water-intensive · ~10M gal/day per fab · drought risk", color: T_.amber },
        { name: "Rare earths", sub: "China dominance ~85% · same risk profile as DRAM", color: "#DC2626", flag: "concentration" },
        { name: "Logistics", sub: "NAND ships globally · less time-sensitive than HBM (no CoWoS chase)", color: T_.textDim },
      ]},
    ],
    bottlenecks: [
      { node: "HAR etch capacity (Lam Cryo)", layer: "Stacking & Layer Tech", supplier: "Lam Research (Cryo-etch lead)", leadTime: "12-18 mo for tools", relief: "Lam Cryo-etch capacity ramping; AMAT entering selectively", beneficiaries: "LRCX. Resolves 300L+ layer scaling. Shared upstream constraint across all NAND makers." },
      { node: "Enterprise SSD controller IP (Gen5/6)", layer: "SSD Controllers", supplier: "Marvell, Phison, Silicon Motion", leadTime: "12-18 mo for new controller silicon", relief: "Multiple vendors competing; in-house at Samsung/SK Hynix", beneficiaries: "MRVL, Phison (8299.TWO), SIMO. Resolves Gen5/6 eSSD ramp + AI-server bandwidth headroom." },
      { node: "QLC density / endurance", layer: "Stacking & Layer Tech", supplier: "Samsung, SK Hynix/Solidigm (QLC leaders)", leadTime: "Process-development bound", relief: "Solidigm + Samsung QLC leadership; PLC in dev for warm tier", beneficiaries: "Solidigm (SK Hynix), Samsung. Resolves HDD→SSD warm-tier transition." },
      { node: "Capex reallocation (DRAM/HBM siphoning)", layer: "NAND Manufacturing", supplier: "Samsung, SK Hynix, Micron (the dual-makers)", leadTime: "18-24 mo for new capacity", relief: "Pure-play NAND (Kioxia, Sandisk) less conflicted", beneficiaries: "Kioxia (285A.T), Sandisk (SNDK). Pure-plays benefit from Big-3 capex split toward HBM." },
      { node: "PCIe Gen6 ecosystem", layer: "Design & IP", supplier: "PCIe SIG + Marvell + Phison + Innogrit + retimers", leadTime: "2027 ecosystem", relief: "Gen6 spec finalized; controllers in design", beneficiaries: "Controller makers + Astera Labs (retimers). Resolves AI-server SSD bandwidth headroom." },
      { node: "PGME/PGMEA solvents", layer: "Materials & Chemicals", supplier: "Japanese chem majors (Daicel / Toagosei)", leadTime: "Iran-war dependent", relief: "Korean alt suppliers ramping; same playbook as DRAM", beneficiaries: "Korean PGMEA suppliers. Korean + Japanese NAND fabs equally exposed." },
      { node: "China YMTC supply", layer: "Finished Product", supplier: "YMTC (China only)", leadTime: "US policy-dependent", relief: "US export controls limit YMTC growth; Korean/Japanese benefit", beneficiaries: "Samsung, SK Hynix, Kioxia, Sandisk, Micron — share gain if YMTC capped." },
      { node: "Helium", layer: "Resources & Utilities", supplier: "Qatar (~65% of Korea's imports), Algeria, US, Russia", leadTime: "Demand-elastic", relief: "Strategic reserves + Tanzania", beneficiaries: "Air Products, Linde. Impacts ALL semi fabs (less critical for NAND than DRAM)." },
    ],
  },
};

const productList = [
  { key: "gpu", label: "GPU", color: T_.green },
  { key: "cpu", label: "CPU", color: "#0EA5E9" },
  { key: "hbm", label: "HBM", color: "#A855F7" },
  { key: "nand", label: "NAND / SSD", color: "#14B8A6" },
];

export default function ProductPrimer() {
  const [activeProduct, setActiveProduct] = useState("gpu");
  const [bottleneckOnly, setBottleneckOnly] = useState(false);

  const product = PRODUCT_PRIMERS[activeProduct] || PRODUCT_PRIMERS.gpu;
  const flagColor = (f) => f === "bottleneck" ? T_.red : f === "concentration" ? T_.amber : null;
  const flagLabel = (f) => f === "bottleneck" ? "BOTTLENECK" : f === "concentration" ? "CONCENTRATED" : "";

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

      {product.familyContext && (
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>
            {product.familyContext.title}
          </div>
          <div style={{ fontSize: 12, color: T_.textDim, lineHeight: 1.6, marginBottom: 14 }}>
            {product.familyContext.intro}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T_.border}` }}>
                  <th style={{ padding: "8px 8px", textAlign: "center", fontSize: 10, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", width: 72 }}>Form</th>
                  {["Product", "Form Factor", product.familyContext.specHeader || "Bandwidth", "ASP ($/GB)", "Primary Use", "Notes"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {product.familyContext.rows.map((r, i) => {
                  const hl = product.familyContext.highlightColor || T_.amber;
                  const iconColor = r.highlight ? hl : T_.textMid;
                  const iconFn = r.formIcon && FormIcons[r.formIcon];
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #0B0F19", background: r.highlight ? `${hl}14` : "transparent" }}>
                      <td style={{ padding: "6px 8px", textAlign: "center", width: 72 }}>
                        {r.imageUrl ? (
                          <img
                            src={r.imageUrl}
                            alt={r.name}
                            loading="lazy"
                            style={{
                              width: 56,
                              height: 56,
                              objectFit: "contain",
                              objectPosition: "center",
                              borderRadius: 5,
                              background: "#fff",
                              padding: 3,
                              border: r.highlight ? `1.5px solid ${hl}` : `1px solid ${T_.border}`,
                              boxShadow: r.highlight ? `0 0 8px ${hl}55` : "none",
                              filter: r.highlight ? "none" : "saturate(0.9) brightness(0.97)",
                              display: "inline-block",
                            }}
                          />
                        ) : iconFn ? (
                          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{iconFn(iconColor)}</div>
                        ) : null}
                      </td>
                      <td style={{ padding: "8px 10px", color: r.highlight ? T_.text : T_.textMid, fontWeight: 700, whiteSpace: "nowrap" }}>
                        {r.highlight && <span style={{ color: hl }}>● </span>}
                        {r.name}
                      </td>
                      <td style={{ padding: "8px 10px", color: T_.textDim, fontSize: 11 }}>{r.form}</td>
                      <td style={{ padding: "8px 10px", color: T_.text, fontSize: 11, fontWeight: 600 }}>{r.spec}</td>
                      <td style={{ padding: "8px 10px", color: T_.amber, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{r.asp}</td>
                      <td style={{ padding: "8px 10px", color: T_.textDim, fontSize: 11 }}>{r.use}</td>
                      <td style={{ padding: "8px 10px", color: T_.textGhost, fontSize: 10, fontStyle: "italic" }}>{r.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>Highlighted row = the product this primer tab is focused on. Other rows are sibling memory products in the same family — sharing makers, fabs, and capex dollars.</div>
        </div>
      )}

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

      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>Bottleneck Watch — what&apos;s stuck &amp; who benefits when it loosens</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T_.border}` }}>
              {["Pinch Point", "What Relieves It", "Beneficiaries"].map(h => (
                <th key={h} style={{ padding: "5px 8px", textAlign: "left", fontSize: 9, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {product.bottlenecks.map((b, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #0B0F19" }}>
                <td style={{ padding: "5px 8px", color: T_.red, fontWeight: 700, whiteSpace: "nowrap" }}>● {b.node}</td>
                <td style={{ padding: "5px 8px", color: T_.textDim, fontSize: 10 }}>{b.relief}</td>
                <td style={{ padding: "5px 8px", color: T_.green, fontWeight: 600, fontSize: 10 }}>{b.beneficiaries}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
}
