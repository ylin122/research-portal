import React, { useState, useMemo, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const fmt = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtPct = (n) => (n * 100).toFixed(1) + "%";
const fmtShares = (n) => n % 1 === 0 ? n.toLocaleString() : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 3 });
const fmtPrice = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtNum = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const AI_LABS_DATA = {
  OpenAI: {
    name: "OpenAI", tagline: "Building AGI that benefits all of humanity",
    hq: "San Francisco, CA", founded: 2015, employees: "~5,000", ceo: "Sam Altman",
    valuation: { current: "$852B", date: "Mar 2026", series: "Series G ($122B)", investors: "Amazon ($50B), Nvidia ($30B), SoftBank ($30B), $3B individual investors" },
    arr: [
      { year: 2023, value: 2 }, { year: 2024, value: 6 }, { year: 2025, value: 20 },
      { year: 2026, value: 50, est: true }, { year: 2027, value: 100, est: true }, { year: 2028, value: 150, est: true },
      { year: 2029, value: 200, est: true }, { year: 2030, value: 280, est: true },
    ],
    arrCurrent: { value: "$25B+ ARR", date: "Mar 2026", source: "Bloomberg (Mar 31). Crossed $25B end of Feb. $122B round closed at $852B val." },
    arrSource: "2023-2025: CFO Sarah Friar (Jan 2026 blog). 2027E: Altman ($100B). 2030E: CNBC ($280B high).",
    compute: [
      { year: 2023, value: 0.2 }, { year: 2024, value: 0.6 }, { year: 2025, value: 1.9 },
      { year: 2026, value: 5, est: true }, { year: 2027, value: 10, est: true }, { year: 2028, value: 15, est: true },
      { year: 2029, value: 20, est: true }, { year: 2030, value: 26, est: true },
    ],
    computeCurrent: { value: "~1.9 GW", date: "Dec 2025", source: "CFO Sarah Friar blog (Jan 2026)" },
    computeSource: "Friar (2023-2025 actual), Stargate 10 GW commitment, Sacra: 26 GW total contracted",
    users: { paying: "9M+ business users, 910M WAU", trend: "WAU +30% in 5 months" },
    mau: [
      { q: "Q1 23", value: 100 }, { q: "Q2 23", value: 180 }, { q: "Q3 23", value: 180 }, { q: "Q4 23", value: 200 },
      { q: "Q1 24", value: 250 }, { q: "Q2 24", value: 350 }, { q: "Q3 24", value: 500 }, { q: "Q4 24", value: 600 },
      { q: "Q1 25", value: 800 }, { q: "Q2 25", value: 800 }, { q: "Q3 25", value: 810 }, { q: "Q4 25", value: 900 },
      { q: "Q1 26", value: 1000, est: true },
    ],
    mauLabel: "Platform MAU (M)",
    mauSource: "OpenAI disclosures, Sensor Tower, Similarweb. Q1 26E: analyst consensus.",
    burn: "$14B projected loss 2026 \u00b7 Cash flow positive ~2030",
    equity: [
      { ticker: "MSFT", name: "Microsoft", exposure: "49% economic interest (declining), $250B Azure deal, board seat", color: "#3B82F6" },
      { ticker: "AMZN", name: "Amazon", exposure: "$50B investor, $138B AWS deal, 2 GW Trainium", color: "#F59E0B" },
      { ticker: "NVDA", name: "Nvidia", exposure: "$30B investor, primary GPU supplier, Vera Rubin commitment", color: "#10B981" },
      { ticker: "ORCL", name: "Oracle", exposure: "~$300B Stargate cloud deal (2027-2031), ~$60B/yr", color: "#EF4444" },
      { ticker: "9984.T", name: "SoftBank", exposure: "$30B investor, Stargate co-founder", color: "#8B5CF6" },
    ],
    ecosystem: [
      { category: "Cloud", partners: "Microsoft Azure ($250B), AWS ($138B), Oracle (~$300B), CoreWeave ($22.4B, GB200/GB300)", color: "#3B82F6" },
      { category: "Chips", partners: "Nvidia (Vera Rubin), Broadcom (custom ASIC via TSMC), Cerebras (WSE-3), AMD (6 GW)", color: "#F59E0B" },
      { category: "Power", partners: "Stargate: 10 GW across 6+ US sites (Abilene TX, OH, WI, TX)", color: "#10B981" },
      { category: "Memory", partners: "SK Hynix, Samsung, Micron \u2014 via Nvidia/AMD GPU HBM packaging", color: "#A855F7" },
      { category: "Distribution", partners: "ChatGPT (910M WAU), Copilot (via MSFT), Apple Siri (in talks)", color: "#EF4444" },
    ],
  },
  Anthropic: {
    name: "Anthropic", tagline: "AI safety company \u00b7 Claude",
    hq: "San Francisco, CA", founded: 2021, employees: "~1,100", ceo: "Dario Amodei",
    valuation: { current: "$380B", date: "Feb 2026", series: "Series G ($30B)", investors: "GIC, Coatue, D.E. Shaw, Founders Fund, ICONIQ, MSFT ($5B), NVDA ($10B)" },
    arr: [
      { year: 2023, value: 0.1 }, { year: 2024, value: 1 }, { year: 2025, value: 9 },
      { year: 2026, value: 26, est: true }, { year: 2027, value: 45, est: true }, { year: 2028, value: 70, est: true },
      { year: 2029, value: 85, est: true }, { year: 2030, value: 100, est: true },
    ],
    arrCurrent: { value: "$30B+ ARR", date: "Apr 2026", source: "Bloomberg/Anthropic (Apr 6, 2026). Up from $19B (Mar), $14B (Feb), $9B (end 2025). Surpassed OpenAI (~$24-25B)." },
    arrSource: "2024: $1B ARR exit (company). 2025: $9B ARR exit (SaaStr). 2026E: $20-26B (TechCrunch). 2028E: $70B bull (The Information).",
    compute: [
      { year: 2023, value: 0.05 }, { year: 2024, value: 0.15 }, { year: 2025, value: 0.5 },
      { year: 2026, value: 1.5, est: true }, { year: 2027, value: 3, est: true }, { year: 2028, value: 5, est: true },
      { year: 2029, value: 7, est: true }, { year: 2030, value: 10, est: true },
    ],
    computeCurrent: { value: "~1 GW (scaling to ~3.5 GW)", date: "Apr 2026", source: "1 GW live (2026) + 3.5 GW Google TPU via Broadcom (online 2027) + AWS + Azure" },
    computeSource: "Apr 2026: Expanded Google/Broadcom deal — multi-GW next-gen TPU capacity (online 2027), US-sited. AWS Bedrock (Project Rainier), Azure ($30B compute deal). Total commitment largest in industry.",
    users: { paying: "300K+ biz customers, 1,000+ at $1M+/yr (doubled from 500+ in Feb)", trend: "8 of Fortune 10 are Claude customers" },
    mau: [
      { q: "Q1 23", value: 0.1 }, { q: "Q2 23", value: 0.5 }, { q: "Q3 23", value: 1 }, { q: "Q4 23", value: 4 },
      { q: "Q1 24", value: 5 }, { q: "Q2 24", value: 10 }, { q: "Q3 24", value: 15 }, { q: "Q4 24", value: 19 },
      { q: "Q1 25", value: 19 }, { q: "Q2 25", value: 30 }, { q: "Q3 25", value: 30 }, { q: "Q4 25", value: 40 },
      { q: "Q1 26", value: 45, est: true },
    ],
    mauLabel: "Platform MAU (M)",
    mauSource: "Backlinko, Semrush, Similarweb. Includes claude.ai + app. Excludes embedded API reach (~300M).",
    burn: "Fastest to profitability \u00b7 FCF positive projected 2027-2028",
    equity: [
      { ticker: "AMZN", name: "Amazon", exposure: "$8B+ invested, primary AWS Bedrock partner", color: "#F59E0B" },
      { ticker: "GOOGL", name: "Google", exposure: "$3B invested, expanded TPU deal via Broadcom (1 GW live + 3.5 GW 2027), Vertex AI", color: "#3B82F6" },
      { ticker: "MSFT", name: "Microsoft", exposure: "$5B invested, Azure compute ($30B)", color: "#8B5CF6" },
      { ticker: "NVDA", name: "Nvidia", exposure: "$10B invested, Grace Blackwell + Vera Rubin supply", color: "#10B981" },
    ],
    ecosystem: [
      { category: "Cloud", partners: "AWS Bedrock (primary), Google Cloud (1 GW live + 3.5 GW via Broadcom 2027), Azure ($30B)", color: "#3B82F6" },
      { category: "Chips", partners: "Google TPU v7, AWS Trainium, Nvidia Grace Blackwell + Vera Rubin", color: "#F59E0B" },
      { category: "Power", partners: "Fluidstack ($50B own DCs — TX, NY), AWS Rainier (2.2 GW), Google TPU DCs", color: "#10B981" },
      { category: "Memory", partners: "SK Hynix, Samsung, Micron \u2014 via TPU/GPU from cloud partners", color: "#A855F7" },
      { category: "Distribution", partners: "Claude.ai, Claude Code ($2.5B ARR), API (300K+), Cowork", color: "#EF4444" },
    ],
  },
  Google: {
    name: "Google DeepMind", tagline: "Gemini \u00b7 TPU \u00b7 Vertically Integrated AI",
    hq: "Mountain View, CA / London", founded: "2010 (DeepMind)", employees: "~3,000+ (DeepMind)", ceo: "Demis Hassabis / Sundar Pichai",
    valuation: { current: "GOOGL $3.76T", date: "Mar 2026", series: "Public (GOOGL)", investors: "Public market \u00b7 You hold 346 shares" },
    arr: [
      { year: 2023, value: 37 }, { year: 2024, value: 48 }, { year: 2025, value: 62 },
      { year: 2026, value: 78, est: true }, { year: 2027, value: 97, est: true }, { year: 2028, value: 120, est: true },
      { year: 2029, value: 148, est: true }, { year: 2030, value: 180, est: true },
    ],
    arrLabel: "Google Cloud ARR (Q4 × 4, $B)",
    arrCurrent: { value: "$62B ARR", date: "Q4 2025", source: "Alphabet Q4 2025 earnings (Q4 rev × 4)" },
    arrSource: "Alphabet 10-K Q4 annualized (2023-2025). 2026-2030E: Wall St. consensus ~25% CAGR from exit rate.",
    compute: [
      { year: 2023, value: 5 }, { year: 2024, value: 6 }, { year: 2025, value: 7.5 },
      { year: 2026, value: 10, est: true }, { year: 2027, value: 14, est: true }, { year: 2028, value: 18, est: true },
      { year: 2029, value: 22, est: true }, { year: 2030, value: 27, est: true },
    ],
    computeLabel: "Total DC Fleet (GW, est.)",
    computeCurrent: { value: "~7.5 GW (total fleet)", date: "2025", source: "Analyst est. from $75B capex (2025)" },
    computeSource: "Analyst est. from capex. Google does not disclose GW directly. $175-185B capex guided for 2026 (Q4 2025 earnings, Feb 5 2026).",
    users: { paying: "Gemini 750M+ MAU, Cloud 15M+ biz, 120K+ enterprises", trend: "Gemini market share 5.7% to 21.5% in 12 mo" },
    mau: [
      { q: "Q1 23", value: 0 }, { q: "Q2 23", value: 0 }, { q: "Q3 23", value: 0 }, { q: "Q4 23", value: 7 },
      { q: "Q1 24", value: 30 }, { q: "Q2 24", value: 82 }, { q: "Q3 24", value: 150 }, { q: "Q4 24", value: 250 },
      { q: "Q1 25", value: 350 }, { q: "Q2 25", value: 450 }, { q: "Q3 25", value: 650 }, { q: "Q4 25", value: 750 },
      { q: "Q1 26", value: 800, est: true },
    ],
    mauLabel: "Gemini App MAU (M)",
    mauSource: "Alphabet earnings (Q3-Q4 2025), court docs (Apr 2025), Sensor Tower, SQ Magazine.",
    burn: "Profitable \u00b7 GOOGL operating income $112B (2025)",
    equity: [
      { ticker: "GOOGL", name: "Alphabet (direct)", exposure: "100% of DeepMind embedded in GOOGL. You hold 346 shares ($102K)", color: "#3B82F6" },
    ],
    ecosystem: [
      { category: "Cloud", partners: "GCP $55B+ run rate, selling TPUs to Anthropic, Meta", color: "#3B82F6" },
      { category: "Chips", partners: "TPU v7 Ironwood (custom), Nvidia GPUs (customers), Arm Axion CPU", color: "#F59E0B" },
      { category: "Power", partners: "$175-185B capex 2026 \u2014 nuclear SMR, solar PPAs, global DC expansion", color: "#10B981" },
      { category: "Memory", partners: "SK Hynix (HBM for TPUs), Samsung, Micron", color: "#A855F7" },
      { category: "Distribution", partners: "Search (8.5B queries/day), Android, YouTube, Apple Siri (Gemini, ~$5B)", color: "#EF4444" },
    ],
  },
  xAI: {
    name: "xAI", tagline: "Understanding the Universe",
    hq: "SF / Memphis, TN", founded: 2023, employees: "~200+", ceo: "Elon Musk",
    valuation: { current: "$250B", date: "Feb 2026", series: "Series E ($20B, Jan 2026)", investors: "Valor, Fidelity, QIA, MGX, Nvidia, Cisco, Tesla ($2B)" },
    arr: [
      { year: 2023, value: 0 }, { year: 2024, value: 0.1 }, { year: 2025, value: 0.5 },
      { year: 2026, value: 2, est: true }, { year: 2027, value: 5, est: true }, { year: 2028, value: 12, est: true },
      { year: 2029, value: 22, est: true }, { year: 2030, value: 35, est: true },
    ],
    arrLabel: "Standalone AI ARR ($B, excl. X ads)",
    arrCurrent: { value: "~$1B ARR", date: "Feb 2026", source: "Sacra est. (Grok subs, API, X Premium AI)" },
    arrSource: "Sacra (standalone ~$500M 2025), mgmt multi-$B target by 2027. X Premium $1B ARR (Feb 2026).",
    compute: [
      { year: 2023, value: 0 }, { year: 2024, value: 0.2 }, { year: 2025, value: 0.8 },
      { year: 2026, value: 2, est: true }, { year: 2027, value: 3.5, est: true }, { year: 2028, value: 5, est: true },
      { year: 2029, value: 6, est: true }, { year: 2030, value: 8, est: true },
    ],
    computeCurrent: { value: "~2 GW (Colossus)", date: "Jan 2026", source: "Musk X post (Dec 2025), Introl Blog" },
    computeSource: "Musk (2 GW, Jan 2026), 555K GPUs ($18B). Solaris 1.1 GW by Q2 2027. Doosan 5x380MW.",
    users: { paying: "SuperGrok $30/mo, Heavy $300/mo, X Premium $1B ARR", trend: "Grok ~35M MAU, X: 600M MAU" },
    mau: [
      { q: "Q1 23", value: 0 }, { q: "Q2 23", value: 0 }, { q: "Q3 23", value: 0 }, { q: "Q4 23", value: 0.05 },
      { q: "Q1 24", value: 0.5 }, { q: "Q2 24", value: 1 }, { q: "Q3 24", value: 3 }, { q: "Q4 24", value: 5 },
      { q: "Q1 25", value: 18 }, { q: "Q2 25", value: 35 }, { q: "Q3 25", value: 30 }, { q: "Q4 25", value: 35 },
      { q: "Q1 26", value: 50, est: true },
    ],
    mauLabel: "Grok MAU (M)",
    mauSource: "Similarweb, Sensor Tower, xAI disclosures. Grok 3 launch drove Q1 25 spike.",
    burn: "~$1B/month \u00b7 Profitability target 2027",
    equity: [
      { ticker: "TSLA", name: "Tesla", exposure: "$2B investor, FSD data, Megapack power for Colossus", color: "#EF4444" },
      { ticker: "NVDA", name: "Nvidia", exposure: "Strategic investor, 555K GPU supplier ($18B)", color: "#10B981" },
      { ticker: "034020.KS", name: "Doosan Enerbility", exposure: "5x 380MW turbines for Colossus (in FLKR)", color: "#F59E0B" },
      { ticker: "SEI", name: "Solaris Energy", exposure: "600MW+ fleet, 67% of orderbook, JV partner", color: "#3B82F6" },
    ],
    ecosystem: [
      { category: "Cloud", partners: "Self-hosted (Colossus Memphis) \u2014 no hyperscaler dependency", color: "#3B82F6" },
      { category: "Chips", partners: "Nvidia (555K GPUs, $18B), potential custom ASIC plans", color: "#F59E0B" },
      { category: "Power", partners: "Solaris Energy (600MW+), Doosan Enerbility (5x 380MW), Tesla Megapacks", color: "#10B981" },
      { category: "Memory", partners: "SK Hynix, Samsung, Micron \u2014 via Nvidia HBM3E packaging", color: "#A855F7" },
      { category: "Distribution", partners: "X (600M MAU), Tesla FSD, SpaceX/Starlink, DoD GenAI.mil", color: "#EF4444" },
    ],
  },
  Meta: {
    name: "Meta AI", tagline: "Llama \u00b7 Open-weight models \u00b7 3.5B+ DAP",
    hq: "Menlo Park, CA", founded: "2004 (Meta AI: 2013)", employees: "~75,000", ceo: "Mark Zuckerberg",
    valuation: { current: "META $1.5T", date: "Mar 2026", series: "Public (META)", investors: "Public market \u00b7 You hold META shares" },
    arr: [
      { year: 2023, value: 135 }, { year: 2024, value: 165 }, { year: 2025, value: 201 },
      { year: 2026, value: 220, est: true }, { year: 2027, value: 260, est: true }, { year: 2028, value: 310, est: true },
      { year: 2029, value: 360, est: true }, { year: 2030, value: 410, est: true },
    ],
    arrLabel: "Total Revenue ($B)",
    arrCurrent: { value: "$201B Rev", date: "2025", source: "META 10-K. FY2025 rev $201B (+22% YoY). AI-driven ad rev ~$10B ARR from video tools alone." },
    arrSource: "SEC filings (2023-2025 actual). 2026-2030E: Wall St. consensus ~15% CAGR from AI-driven ad + commerce revenue.",
    compute: [
      { year: 2023, value: 1.5 }, { year: 2024, value: 2.5 }, { year: 2025, value: 4 },
      { year: 2026, value: 7, est: true }, { year: 2027, value: 10, est: true }, { year: 2028, value: 14, est: true },
      { year: 2029, value: 18, est: true }, { year: 2030, value: 22, est: true },
    ],
    computeCurrent: { value: "~4 GW (est.)", date: "2025", source: "Analyst est. from $72B capex (2025). 30 DCs planned/operational." },
    computeSource: "Analyst estimates from capex. Meta does not disclose GW directly. $115-135B capex guided for 2026.",
    users: { paying: "3.54B DAP, 1B+ Meta AI MAU", trend: "Meta AI hit 1B MAU in Q1 2025 — fastest AI platform growth ever" },
    mau: [
      { q: "Q1 23", value: 0 }, { q: "Q2 23", value: 0 }, { q: "Q3 23", value: 0 }, { q: "Q4 23", value: 0 },
      { q: "Q1 24", value: 50 }, { q: "Q2 24", value: 150 }, { q: "Q3 24", value: 400 }, { q: "Q4 24", value: 600 },
      { q: "Q1 25", value: 1000 }, { q: "Q2 25", value: 1100 }, { q: "Q3 25", value: 1200 }, { q: "Q4 25", value: 1300 },
      { q: "Q1 26", value: 1400, est: true },
    ],
    mauLabel: "Meta AI MAU (M)",
    mauSource: "Zuckerberg shareholder mtg (Q1 2025: 1B MAU). Analyst estimates for subsequent quarters. Embedded in FB/IG/WA.",
    burn: "Profitable \u00b7 $62.4B net income (2025) \u00b7 Op. margin ~40%",
    equity: [
      { ticker: "META", name: "Meta Platforms", exposure: "Public (NASDAQ: META) \u00b7 You hold shares directly", color: "#3B82F6" },
      { ticker: "NVDA", name: "Nvidia", exposure: "Largest GPU customer globally. Tens of $B multi-year deal (Feb 2026)", color: "#10B981" },
      { ticker: "GOOGL", name: "Google", exposure: "$10B+ 6-yr cloud deal (Aug 2025). TPU lease talks for on-prem 2027", color: "#F59E0B" },
      { ticker: "AMD", name: "AMD", exposure: "$60-100B 5-yr Instinct GPU deal, 6 GW, 10% equity option", color: "#EF4444" },
    ],
    ecosystem: [
      { category: "Chips", partners: "Nvidia (millions of Blackwell/Rubin GPUs), AMD (6 GW Instinct), Google TPU (in talks), MTIA (custom inference)", color: "#F59E0B" },
      { category: "Cloud", partners: "CoreWeave ($19.2B+, GB300, 6-yr thru 2032), Nebius ($27B 5-yr, Vera Rubin), Google Cloud ($10B+ 6-yr), primarily on-prem DCs", color: "#3B82F6" },
      { category: "Power", partners: "Hyperion (LA, 5 GW, nuclear-backed), 30 DCs (26 in US), $600B US investment by 2028", color: "#10B981" },
      { category: "Memory", partners: "SK Hynix, Samsung, Micron \u2014 via Nvidia/AMD HBM packaging", color: "#A855F7" },
      { category: "Distribution", partners: "Facebook (3B+), Instagram (2B+), WhatsApp (2.5B+), Threads, Meta AI (1.4B MAU)", color: "#EF4444" },
    ],
  },
};

// AI Labs Industry News — Update during refresh alongside dashNewsUpdates
const AI_LABS_NEWS = [
  { date: "Apr 6", text: "Anthropic tops $30B ARR, surpassing OpenAI (~$24-25B) — up from $19B (Mar) and $9B (end 2025). 1,000+ customers at $1M+/yr (doubled from Feb). Claude Code ARR >$2.5B. Simultaneously announces expanded Google/Broadcom compute deal: ~3.5 GW of next-gen TPU capacity (online 2027), adding to 1 GW already live. Largest compute commitment by any AI lab. US-sited. AWS remains primary cloud partner (Bloomberg, Anthropic)." },
  { date: "Apr 6", text: "Broadcom confirms expanded long-term deal with Google — custom TPU design + networking through 2031. Anthropic named as key customer for the new TPU capacity. Deal is INCREMENTAL to existing Broadcom-Google relationship (TPU co-design ongoing), but significantly larger in scale (multi-GW). AWS relationship with Anthropic unchanged (CNBC, Broadcom IR)." },
  { date: "Mar 31", text: "OpenAI closes $122B round at $852B valuation — largest private funding in history. Amazon ($50B), Nvidia ($30B), SoftBank ($30B), $3B from individual investors via banks. Now valued higher than Intel + AMD + Qualcomm combined (Bloomberg)." },
  { date: "Mar 30", text: "Mistral AI raises $830M debt for Paris data center — first European AI lab to self-host training. Total raised $2.6B+. Codestral (code) + Pixtral (vision) gaining traction (TechCrunch)." },
  { date: "Mar 29", text: "Anthropic in IPO talks as soon as Q4 2026 — targeting $200B+ public valuation. Revenue tripling in 2026. CNBC reports Morgan Stanley + Goldman Sachs advising (CNBC, Bloomberg)." },
  { date: "Mar 29", text: "OpenAI kills Sora — video generation product shuttered. Team reassigned to core research. Usage was 'far below expectations.' Focus shifts to enterprise + reasoning (The Information)." },
  { date: "Mar 28", text: "Anthropic Claude paid subscribers more than double YTD — Claude Code $2.5B+ ARR, Claude.ai Pro/Team surging. Enterprise now >60% of revenue. Agentic workflows driving adoption (Bloomberg)." },
  { date: "Mar 28", text: "Apple opens Siri to every AI — new SDK lets ChatGPT, Claude, Gemini plug directly into Siri via 'AI Extensions.' No default lock-in. Developers can ship AI features to 2B+ Apple devices (TechCrunch)." },
  { date: "Mar 25", text: "Google unveils TurboQuant — 6x AI memory compression, 8x inference speedup on H100s. KV cache compressed to 3-bit. ICLR 2026 paper. 'Pied Piper' comparisons viral. Memory stocks crushed (Google Research, TechCrunch)." },
  { date: "Mar 24", text: "Arm Holdings unveils first in-house CPU chip (AGI CPU). Raymond James upgrades to Outperform, $166 PT. Business model shift to 'fabless semiconductor element' (CNBC)." },
  { date: "Mar 23", text: "OpenAI pivots ahead of Q4 2026 IPO — targeting $600B total compute spend by 2030. Fidji Simo: 'orienting aggressively' to enterprise productivity. 900M WAU, 50M paying subs (CNBC)." },
  { date: "Mar 22", text: "Cerebras IPO expected spring 2026. Filed confidentially Feb. $23B valuation after $1B Series H. AWS WSE-3 cloud deal. Wafer-scale chips rival NVIDIA (Reuters, AccessIPOs)." },
  { date: "Mar 21", text: "MSFT $383.65 — down 3.9% from Mar 16. Circana: Microsoft's Resident Evil Requiem partnership driving gaming AI revenue. MSFT stock 'cheap, generational opportunity' (Nasdaq)." },
  { date: "Mar 20", text: "SMCI co-founder Wally Liaw indicted — $2.5B NVIDIA chip smuggling scheme to China. SMCI -33%, ~$6B market cap wiped. Liaw arrested, resigned from board (Bloomberg, CNBC)." },
  { date: "Mar 20", text: "Iran war puts AI infrastructure at risk — 3 AWS data centers in UAE/Bahrain damaged by drone strikes. Tech firms reassessing Middle East investments (The Hill, Time)." },
  { date: "Mar 17", text: "NVIDIA GTC: $1T order forecast through 2027. Vera Rubin platform (7 chips) for agentic AI. Groq 3 LPU integrated. Feynman (2028) previewed (CNBC, NVIDIA PR)." },
  { date: "Mar 17", text: "OpenAI developing desktop 'superapp' combining all products into single platform — direct competition with Google and Microsoft (TipRanks)." },
  { date: "Mar 16", text: "Meta-Nebius $27B five-year deal — $12B dedicated + $15B elastic compute. First large-scale Vera Rubin deployment. Meta 2026 capex $115-135B (Bloomberg)." },
  { date: "Mar 13", text: "Google closes $32B Wiz acquisition — largest deal in Google history. Cybersecurity integration into Google Cloud (TechCrunch)." },
  { date: "Mar 12", text: "Meta AI surpasses 1.4B MAU. Llama 4 Maverick released open-source. Anthropic raises $30B Series G at $380B valuation (company filings)." },
  { date: "Mar 5", text: "Marvell Q4 earnings beat — Data Center revenue 2x YoY. Custom AI accelerator business expanding (Google, Amazon, MSFT customers)." },
];

// GPU/ASIC Industry News — Update during refresh
const GPU_ASIC_NEWS = [
  { date: "Mar 26", text: "TurboQuant aftershock — Samsung -4.7%, SK Hynix -6.2%, MU -5.5%, Kioxia -6%. Memory peak-out debate intensifies. KOSPI -3%. Analysts split: Wells Fargo 'buy the dip' vs BTIG caution (CNBC, Seoul Econ Daily)." },
  { date: "Mar 25", text: "Google TurboQuant: 6x memory compression for AI inference (KV cache → 3-bit). MU -3.4%, SNDK -5.7%, WDC -4.7%. Morgan Stanley: Jevons Paradox could boost demand long-term. Wells Fargo: 'attacks cost curve' (CNBC, SCMP)." },
  { date: "Mar 24", text: "MU -22% from ATH in 6 days post-earnings (closed ATH Mar 18 then reported). BTIG: 'When good news gets sold, pay attention.' Capex >$25B + TurboQuant fears weighing on sentiment (CNBC)." },
  { date: "Mar 21", text: "TERAFAB — Musk unveils $20-25B chip fab JV (Tesla/SpaceX/xAI) in Austin. Two chip families: edge inference (FSD, Optimus) + space-hardened (orbital DCs). AI5 late 2026, volume 2027 (Bloomberg, Fortune)." },
  { date: "Mar 21", text: "NVDA $174.90 — down 5.3% since GTC as broader tech sells off on Iran/war concerns. EVP Puri sells $54.7M in NVDA stock (Investing.com)." },
  { date: "Mar 20", text: "SMCI co-founder charged with smuggling $2.5B in NVIDIA-powered servers to China. SMCI -33%. DOJ's highest-profile export control case. Liaw arrested, resigned from board (Bloomberg, CNBC)." },
  { date: "Mar 18", text: "Micron Q2 FY26: Revenue $23.86B (3x YoY, beat by $3.8B). EPS $12.20 vs $9.31 est. Q3 guide $33.5B (+200% YoY). HBM4 volume production started for Vera Rubin (CNBC)." },
  { date: "Mar 17", text: "GTC 2026 keynote: Jensen Huang projects $1T in GPU orders through 2027. Vera Rubin NVL72 — 10x inference perf/watt vs Blackwell. 7 chips in full production (NVIDIA PR)." },
  { date: "Mar 17", text: "NVIDIA acquires Groq for ~$20B — Groq 3 LPU integrated into Vera Rubin for inference acceleration. Ships H2 2026. Groq founders join NVIDIA (CNBC, DCK)." },
  { date: "Mar 17", text: "GTC: Feynman architecture (2028) previewed — Rosa CPU, LP40 LPU, BlueField-5, dual copper + co-packaged optics. Next after Vera Rubin." },
  { date: "Mar 17", text: "GTC: OpenClaw crosses 100K GitHub stars, 2M visitors in first week. Huang calls it 'most popular open source project in history of humanity.'" },
  { date: "Mar 16", text: "Vertiv role in Vera Rubin DSX AI Factory reference design confirmed. Power/cooling infrastructure for next-gen NVIDIA data centers (Investing.com)." },
  { date: "Mar 14", text: "Broadcom CEO predicts AI chip sales to top $100B in FY2027. Q1'26 revenue $19.3B (+29% YoY), gross margin ~77%." },
  { date: "Mar 5", text: "Marvell Q4 revenue beat. Data Center revenue doubled YoY. Custom AI accelerators for Google, Amazon, Microsoft expanding." },
];

// Neocloud Industry News — Update during refresh
const NEOCLOUD_NEWS = [
  { date: "Mar 31", text: "Microsoft declines $12B CoreWeave expansion — opted not to exercise option on additional DC capacity citing shifting cloud strategy. CRWV -8%. Raises questions about demand concentration risk (Bloomberg, WSJ)." },
  { date: "Mar 29", text: "Pomerantz LLP files class action against CoreWeave on behalf of IPO investors. Alleges material misstatements re: customer concentration and Denton TX delays. Second major class action after Bleichmar Fonti (GlobeNewswire)." },
  { date: "Mar 28", text: "Meta extends $8.5B credit facility to CoreWeave — largest single AI infrastructure loan. 5-year term, secured against GPU fleet + contracts. Meta gets priority compute access (Reuters, FT)." },
  { date: "Mar 27", text: "CoreWeave Denton TX 100 MW expansion delayed 3-6 months due to grid interconnection bottlenecks. ERCOT backlog growing. Core Scientific Denton site also affected (DatacenterDynamics)." },
  { date: "Mar 26", text: "Neocloud stocks under pressure as broader tech sells off. S&P -1.5%, Nasdaq -2%. TurboQuant raises questions on total infra spend if AI efficiency improves. CRWV, NBIS tracking lower with sector (Bloomberg)." },
  { date: "Mar 23", text: "CoreWeave among first to deploy NVIDIA Vera Rubin + HGX B300 servers. CRWV ~$80, well below ATH $186. Short interest at 12.1% (TipRanks, Bankless Times)." },
  { date: "Mar 22", text: "OpenAI tempering DC buildout ahead of Q4 IPO. $600B compute target by 2030. Pivoting to asset-light model using CRWV/NBIS/ORCL capacity (CNBC)." },
  { date: "Mar 21", text: "CoreWeave vs Nebius debate intensifies — CRWV has $55B+ backlog but heavy debt concerns. NBIS claims 3x compute/MW efficiency (Motley Fool)." },
  { date: "Mar 16", text: "Nebius (NBIS) signs $27B five-year deal with Meta — $12B dedicated Vera Rubin + $15B elastic. 9x expansion from $3B Nov deal. NBIS +14% (Bloomberg)." },
  { date: "Mar 12", text: "NVIDIA invests $2B in Nebius — 8.3% equity stake. Citi issues Buy/High Risk rating citing differentiated TAM growth (Motley Fool, Citi)." },
  { date: "Mar 11", text: "Nebius targets $7-9B ARR by end of 2026. Expanding DCs in UK, Israel, New Jersey. Aether 3.0 cloud platform + Token Factory launched." },
  { date: "Mar 8", text: "CoreWeave $55B+ revenue backlog. 2025 revenue $5.05-5.15B. Analysts project $12B+ in 2026 (+134% YoY). Heavy debt weighing on stock (24/7 Wall St)." },
  { date: "Mar 3", text: "CoreWeave class action lawsuit filed (Bleichmar Fonti & Auld). Stock dropped from ~$101 to ~$76 in late Feb after Q4 loss widened." },
  { date: "Feb 27", text: "CoreWeave Q4 2025: Revenue $1.6B, 168% FY growth to $5.1B. But net loss widened, 2026 capex guided $30-35B. Stock fell 21%." },
  { date: "Jan 7", text: "Applied Digital Q2 FY26: Revenue $127M (+250% YoY). Polaris Forge 1 100MW operational. $5B Macquarie partnership." },
];

// Shell + Power Industry News — Update during refresh
const SHELL_POWER_NEWS = [
  { date: "Mar 26", text: "Trump tells Iran 'get serious.' Brent surges +6.5% to ~$109. Gas $3.96/gal (23-day streak, +34% in a month). OECD warns US inflation above Fed targets. ECB's Lagarde: 'real shock' (CNBC, Bloomberg)." },
  { date: "Mar 25", text: "Iran rejects US 15-point ceasefire proposal (delivered via Pakistan). Lays out 5-point counterplan including Hormuz control. S&P +0.54% as markets bet on eventual deal (AP, NYT)." },
  { date: "Mar 23", text: "Oil crashes — Brent ~$120→~$100 on Trump-Iran 'productive talks.' 5-day pause on Iranian energy strikes. IEA considering additional releases beyond 400M barrel commitment (CNBC, AP)." },
  { date: "Mar 22", text: "Helium supply crisis — Iran war cut ~30% of global helium, critical for semi fab. Asia fabs (Samsung, SK Hynix) most exposed — 65% of helium imports from Qatar (WEF, AP)." },
  { date: "Mar 20", text: "Iran war threatens AI infrastructure globally — 3 AWS data centers in UAE/Bahrain damaged. Oil near $100. Energy costs rising for all DC operators (The Hill, Time)." },
  { date: "Mar 17", text: "GTC 2026: Vertiv confirmed as partner for NVIDIA Vera Rubin DSX AI Factory reference design. Power/cooling infrastructure critical for next-gen DCs." },
  { date: "Mar 14", text: "Vertiv (VRT), Lumentum (LITE), Coherent (COHR) added to S&P 500 in quarterly rebalancing — biggest AI-concentrated reshuffle in history." },
  { date: "Mar 11", text: "Nebius planning 800MW-1GW of connected DC power by end 2026. Expanding UK, Israel, New Jersey facilities. 2026 capex raised to ~$5B." },
  { date: "Mar 5", text: "IREN (formerly Iris Energy) Microsoft $9.7B contract for 200MW capacity. 85% project EBITDA margin. Five-year term (Nov 2025 announcement)." },
  { date: "Mar 5", text: "Applied Digital Polaris Forge 2: $5B lease with investment-grade hyperscaler for 200MW. 15-year term. Macquarie $5B infrastructure partnership." },
  { date: "Feb 27", text: "CoreWeave 2026 capex guidance: $30-35B, up from $14.9B in 2025. Pursuing $9B all-stock acquisition of Core Scientific for power assets." },
  { date: "Jan 21", text: "BofA warns: 'Investors underestimating war risks.' Higher energy costs from Iran conflict could dampen AI infra spending near-term (Nasdaq)." },
];

// Sources: Company 10-K/10-Q filings, earnings guidance, CreditSights, Futurum, CNBC, Bloomberg, BofA
const AI_CAPEX_DATA = {
  top5: [
    { name: "Amazon (AWS)", ticker: "AMZN", color: "#F59E0B",
      capex: [
        { year: 2022, value: 58 }, { year: 2023, value: 54 }, { year: 2024, value: 83 }, { year: 2025, value: 132 },
        { year: 2026, value: 200, est: true }, { year: 2027, value: 220, est: true }, { year: 2028, value: 200, est: true },
        { year: 2029, value: 185, est: true }, { year: 2030, value: 175, est: true },
      ],
      spendingOn: "AWS data centers, Nvidia GPUs + Trainium 2 custom chips, Anthropic partnership, Project Kuiper, robotics",
      news: "2026 guided at $200B (Q4 2025 earnings, Feb 6 2026). 2025 actual $131.8B (+59% YoY). AWS at $142B ARR, growing 24%. Shares fell 11% on guidance. FCF compressed to $7.7B from $32.9B. Capex consuming 94.5% of OCF.",
      partners: "Nvidia (GPUs), Annapurna Labs/Trainium (custom), Anthropic ($8B+ invested), OpenAI ($38B 7-yr deal), CoreWeave",
    },
    { name: "Alphabet (Google)", ticker: "GOOGL", color: "#3B82F6",
      capex: [
        { year: 2022, value: 31 }, { year: 2023, value: 32 }, { year: 2024, value: 53 }, { year: 2025, value: 91 },
        { year: 2026, value: 180, est: true }, { year: 2027, value: 200, est: true }, { year: 2028, value: 190, est: true },
        { year: 2029, value: 175, est: true }, { year: 2030, value: 165, est: true },
      ],
      spendingOn: "TPU v7 Ironwood fabs, global DC expansion, Nvidia GPUs for GCP customers, subsea cables, DeepMind compute",
      news: "2026 capex guided $175-185B (Q4 2025 earnings, Feb 5 2026). Nearly double 2025's $91B. Cloud backlog surged to $240B. Supply-constrained per Pichai. Street expected $119B — guidance shocked at +50%.",
      partners: "Broadcom (TPU co-design thru 2031, expanded Apr 2026 — multi-GW for Anthropic), TSMC (fab), Anthropic (3.5 GW TPU 2027), Meta (TPU lease talks), Apple (Gemini deal ~$5B)",
    },
    { name: "Microsoft (Azure)", ticker: "MSFT", color: "#8B5CF6",
      capex: [
        { year: 2022, value: 24 }, { year: 2023, value: 28 }, { year: 2024, value: 44 }, { year: 2025, value: 78 },
        { year: 2026, value: 120, est: true }, { year: 2027, value: 130, est: true }, { year: 2028, value: 125, est: true },
        { year: 2029, value: 115, est: true }, { year: 2030, value: 110, est: true },
      ],
      spendingOn: "Azure AI DCs, Nvidia GPUs (GB200/Vera Rubin for OpenAI), Maia custom chips, OpenAI hosting",
      news: "2026 capex tracking ~$120B+ (no full-year guide yet; Q2 FY2026 was $37.5B). Capital intensity at 45% of revenue. $250B Azure-OpenAI deal. $5B Anthropic investment. CoreWeave: ~$10B commitment but declined $12B expansion option (Mar 2025); signed $19.4B Nebius deal (Oct 2025). Diversifying away from CoreWeave dependency ($33B+ total neocloud commitments).",
      partners: "OpenAI (49% economic interest), Nvidia, Anthropic ($5B), AMD, Nebius ($19.4B 5-yr), CoreWeave (~$10B, declining), Lambda",
    },
    { name: "Meta Platforms", ticker: "META", color: "#EF4444",
      capex: [
        { year: 2022, value: 32 }, { year: 2023, value: 28 }, { year: 2024, value: 39 }, { year: 2025, value: 72 },
        { year: 2026, value: 125, est: true }, { year: 2027, value: 135, est: true }, { year: 2028, value: 130, est: true },
        { year: 2029, value: 120, est: true }, { year: 2030, value: 115, est: true },
      ],
      spendingOn: "Llama training clusters, Nvidia GPUs, MTIA custom chips, global DC buildout, Reality Labs",
      news: "2026 guided $115-135B (nearly double 2025's $72.2B). $19.2B+ CoreWeave deal (GB300). $27B Nebius deal (Vera Rubin, Mar 2026). Google TPU lease talks from 2027. $75B bond issuance Sept-Oct 2025. Open-source Llama strategy.",
      partners: "Nvidia (primary GPU), CoreWeave ($19.2B+), Nebius ($27B Vera Rubin), Google (TPU talks), TSMC (MTIA fab)",
    },
    { name: "Oracle", ticker: "ORCL", color: "#10B981",
      capex: [
        { year: 2022, value: 7 }, { year: 2023, value: 9 }, { year: 2024, value: 12 }, { year: 2025, value: 25 },
        { year: 2026, value: 50, est: true }, { year: 2027, value: 60, est: true }, { year: 2028, value: 60, est: true },
        { year: 2029, value: 55, est: true }, { year: 2030, value: 50, est: true },
      ],
      spendingOn: "Stargate DCs for OpenAI, OCI GPU clusters, Nvidia GB200 racks, land/power acquisition",
      news: "~$300B Stargate deal with OpenAI (~$60B/yr for 5 yrs starting 2027). Capital intensity surged to 57% of revenue. 4.5 GW Stargate capacity with OpenAI.",
      partners: "OpenAI/SoftBank (Stargate JV, $300B over 5 yrs), Nvidia, Arm, CoreWeave (some capacity)",
    },
  ],
  others: [
    { rank: 6, name: "CoreWeave", ticker: "CRWV", capex2025: 14.9, capex2026: 33, capex2027: 45, status: "Public (IPO Mar 2025 at $40). FY2025 rev $5.1B (+167% YoY). $66.8B backlog. RPO $60.7B. Capex $14.9B (2025), guided $30-35B (2026). $19.6B total debt (post-Meta loan). 850 MW active, 1.7 GW target YE2026. 43 data centers. First to deploy GB200 (Feb 2025) & GB300 NVL72 (Jul 2025). Key customers: MSFT ($10B), OpenAI ($22.4B), Meta ($19.2B+), NVIDIA ($6.3B backstop). EBITDA $3.1B (FY2025).", color: "#06B6D4" },
    { rank: 7, name: "xAI (Musk)", ticker: "Private", capex2025: 18, capex2026: 25, capex2027: 30, status: "Colossus cluster: 555K GPUs ($18B). 2 GW capacity. Series E $20B. Acquired BY SpaceX Feb 2026 (wholly-owned sub). TERAFAB JV $20-25B (separate).", color: "#F97316" },
    { rank: 8, name: "Alibaba Cloud", ticker: "BABA", capex2025: 16, capex2026: 23, capex2027: 25, status: "RMB 380B (~$53B) committed over 3 yrs for AI & cloud. 35.8% China AI cloud share. Buying RTX 4090s for inference.", color: "#EF4444" },
    { rank: 9, name: "ByteDance / TikTok", ticker: "Private", capex2025: 15, capex2026: 23, capex2027: 25, status: "RMB 160B (~$23B) 2026 target. $14B earmarked for Nvidia AI chips. DCs in Malaysia, Indonesia, US.", color: "#84CC16" },
    { rank: 10, name: "Apple", ticker: "AAPL", capex2025: 12, capex2026: 18, capex2027: 22, status: "Apple Intelligence private cloud. Gemini deal ~$5B. Modest vs hyperscalers but ramping.", color: "#A855F7" },
    { rank: 11, name: "SoftBank (Stargate JV)", ticker: "9984.T", capex2025: 8, capex2026: 15, capex2027: 25, status: "Lead investor in $500B Stargate JV with OpenAI & Oracle. Arm Holdings majority owner. Deploying via Oracle DCs.", color: "#F59E0B" },
    { rank: 12, name: "Tencent", ticker: "TCEHY", capex2025: 8, capex2026: 12, capex2027: 15, status: "More measured approach; prioritizing profitability. Quarterly capex declined late 2025. H200 chip access approved.", color: "#10B981" },
    { rank: 13, name: "Samsung Electronics", ticker: "005930", capex2025: 8, capex2026: 10, capex2027: 12, status: "HBM3E/HBM4 capacity expansion. Foundry investment for AI chips. Both supplier and builder.", color: "#3B82F6" },
    { rank: 14, name: "Nebius (ex-Yandex)", ticker: "NBIS", capex2025: 2, capex2026: 5, capex2027: 8, status: "Neocloud. $35B+ mkt cap. Meta $27B + MSFT $19.4B 5-yr deals. NVDA $2B (8.3% stake). Targeting 2.5 GW by end 2026.", color: "#22D3EE" },
    { rank: 15, name: "Tesla (Dojo + Training)", ticker: "TSLA", capex2025: 5, capex2026: 7, capex2027: 10, status: "TERAFAB JV (3/21): $20-25B chip fab w/ SpaceX+xAI in Austin. AI5 chip. 1TW compute target. Separate from TSLA capex plan. Dojo + FSD training.", color: "#DC2626" },
    { rank: 16, name: "Crusoe Energy", ticker: "Private", capex2025: 3, capex2026: 5, capex2027: 8, status: "Building Stargate Abilene campus for OpenAI (1.2 GW). Phase 1 live Sept 2025. IPO expected ~$10B+ mid-2026.", color: "#059669" },
    { rank: 17, name: "Lambda", ticker: "Private", capex2025: 2, capex2026: 4, capex2027: 6, status: "Neocloud. $1.5B funding. MSFT deal. 10K Blackwell Ultra GPUs in Kansas City. IPO anticipated.", color: "#7C3AED" },
    { rank: 18, name: "IREN (fka Iris Energy)", ticker: "IREN", capex2025: 3, capex2026: 4, capex2027: 5, status: "140K GPU target. $3.4B AI Cloud ARR by end CY26. MSFT prepayment $1.9B. 4.5 GW secured power. Oklahoma 1.6 GW campus.", color: "#0EA5E9" },
    { rank: 19, name: "Core Scientific", ticker: "CORZ", capex2025: 2, capex2026: 3, capex2027: 4, status: "Ex-Bitcoin miner → AI DC. CoreWeave/OpenAI anchor tenant. 1.2 GW pipeline. $8.7B contract backlog.", color: "#D946EF" },
    { rank: 20, name: "Baidu", ticker: "BIDU", capex2025: 3, capex2026: 4, capex2027: 5, status: "Ernie 5.0 training. Kunlun AI chips. China's #3 cloud. Conservative spender vs. Alibaba/ByteDance.", color: "#6366F1" },
  ],
  aggregate: [
    { year: 2022, value: 190 }, { year: 2023, value: 195 }, { year: 2024, value: 270 }, { year: 2025, value: 516 },
    { year: 2026, value: 866, est: true }, { year: 2027, value: 990, est: true }, { year: 2028, value: 940, est: true },
    { year: 2029, value: 870, est: true }, { year: 2030, value: 820, est: true },
  ],
  // Cloud/AI segment revenue ($B) + total company capex ($B) for Revenue vs Capex chart
  // Amazon = AWS segment, Alphabet = Google Cloud, Microsoft = Azure, Meta = total rev (no cloud segment), Oracle = Cloud rev
  revenueVsCapex: [
    { name: "Amazon (AWS)", color: "#F59E0B", rev: [
      { year: 2022, value: 80 }, { year: 2023, value: 91 }, { year: 2024, value: 108 }, { year: 2025, value: 130 },
      { year: 2026, value: 165, est: true }, { year: 2027, value: 200, est: true }, { year: 2028, value: 235, est: true }, { year: 2029, value: 265, est: true }, { year: 2030, value: 290, est: true },
    ], margin: [
      { year: 2022, value: 24 }, { year: 2023, value: 24 }, { year: 2024, value: 37 }, { year: 2025, value: 38 },
      { year: 2026, value: 34, est: true }, { year: 2027, value: 36, est: true }, { year: 2028, value: 38, est: true }, { year: 2029, value: 39, est: true }, { year: 2030, value: 40, est: true },
    ], capex: [
      { year: 2022, value: 58 }, { year: 2023, value: 54 }, { year: 2024, value: 83 }, { year: 2025, value: 132 },
      { year: 2026, value: 200, est: true }, { year: 2027, value: 220, est: true }, { year: 2028, value: 200, est: true }, { year: 2029, value: 185, est: true }, { year: 2030, value: 175, est: true },
    ]},
    { name: "Alphabet (Google Cloud)", color: "#3B82F6", rev: [
      { year: 2022, value: 26 }, { year: 2023, value: 33 }, { year: 2024, value: 44 }, { year: 2025, value: 70 },
      { year: 2026, value: 100, est: true }, { year: 2027, value: 130, est: true }, { year: 2028, value: 155, est: true }, { year: 2029, value: 175, est: true }, { year: 2030, value: 195, est: true },
    ], margin: [
      { year: 2022, value: -8 }, { year: 2023, value: 5 }, { year: 2024, value: 14 }, { year: 2025, value: 18 },
      { year: 2026, value: 20, est: true }, { year: 2027, value: 24, est: true }, { year: 2028, value: 27, est: true }, { year: 2029, value: 29, est: true }, { year: 2030, value: 30, est: true },
    ], capex: [
      { year: 2022, value: 31 }, { year: 2023, value: 32 }, { year: 2024, value: 53 }, { year: 2025, value: 91 },
      { year: 2026, value: 180, est: true }, { year: 2027, value: 200, est: true }, { year: 2028, value: 190, est: true }, { year: 2029, value: 175, est: true }, { year: 2030, value: 165, est: true },
    ]},
    { name: "Microsoft (Azure)", color: "#8B5CF6", rev: [
      { year: 2022, value: 75 }, { year: 2023, value: 88 }, { year: 2024, value: 105 }, { year: 2025, value: 125 },
      { year: 2026, value: 160, est: true }, { year: 2027, value: 195, est: true }, { year: 2028, value: 225, est: true }, { year: 2029, value: 255, est: true }, { year: 2030, value: 280, est: true },
    ], margin: [
      { year: 2022, value: 42 }, { year: 2023, value: 43 }, { year: 2024, value: 45 }, { year: 2025, value: 44 },
      { year: 2026, value: 40, est: true }, { year: 2027, value: 42, est: true }, { year: 2028, value: 44, est: true }, { year: 2029, value: 45, est: true }, { year: 2030, value: 46, est: true },
    ], capex: [
      { year: 2022, value: 24 }, { year: 2023, value: 28 }, { year: 2024, value: 44 }, { year: 2025, value: 78 },
      { year: 2026, value: 120, est: true }, { year: 2027, value: 130, est: true }, { year: 2028, value: 125, est: true }, { year: 2029, value: 115, est: true }, { year: 2030, value: 110, est: true },
    ]},
    { name: "Meta Platforms", color: "#EF4444", rev: [
      { year: 2022, value: 117 }, { year: 2023, value: 135 }, { year: 2024, value: 165 }, { year: 2025, value: 201 },
      { year: 2026, value: 230, est: true }, { year: 2027, value: 265, est: true }, { year: 2028, value: 295, est: true }, { year: 2029, value: 320, est: true }, { year: 2030, value: 340, est: true },
    ], margin: [
      { year: 2022, value: 80 }, { year: 2023, value: 81 }, { year: 2024, value: 82 }, { year: 2025, value: 82 },
      { year: 2026, value: 80, est: true }, { year: 2027, value: 80, est: true }, { year: 2028, value: 81, est: true }, { year: 2029, value: 81, est: true }, { year: 2030, value: 81, est: true },
    ], capex: [
      { year: 2022, value: 32 }, { year: 2023, value: 28 }, { year: 2024, value: 39 }, { year: 2025, value: 72 },
      { year: 2026, value: 125, est: true }, { year: 2027, value: 135, est: true }, { year: 2028, value: 130, est: true }, { year: 2029, value: 120, est: true }, { year: 2030, value: 115, est: true },
    ]},
    { name: "Oracle (Cloud)", color: "#10B981", rev: [
      { year: 2022, value: 12 }, { year: 2023, value: 15 }, { year: 2024, value: 20 }, { year: 2025, value: 30 },
      { year: 2026, value: 45, est: true }, { year: 2027, value: 65, est: true }, { year: 2028, value: 80, est: true }, { year: 2029, value: 95, est: true }, { year: 2030, value: 105, est: true },
    ], margin: [
      { year: 2022, value: 30 }, { year: 2023, value: 28 }, { year: 2024, value: 25 }, { year: 2025, value: 20 },
      { year: 2026, value: 18, est: true }, { year: 2027, value: 22, est: true }, { year: 2028, value: 26, est: true }, { year: 2029, value: 30, est: true }, { year: 2030, value: 32, est: true },
    ], capex: [
      { year: 2022, value: 7 }, { year: 2023, value: 9 }, { year: 2024, value: 12 }, { year: 2025, value: 25 },
      { year: 2026, value: 50, est: true }, { year: 2027, value: 60, est: true }, { year: 2028, value: 60, est: true }, { year: 2029, value: 55, est: true }, { year: 2030, value: 50, est: true },
    ]},
  ],
};

// GPU Compute Cost & Performance Data
// Sources: SemiAnalysis, Introl, IntuitionLabs, Exxact, SiliconData, Jarvislabs, RunPod, Modal
const GPU_DATA = [
  {
    gpu: "A100 SXM", gen: "Ampere", year: 2020, node: "TSMC 7nm",
    vram: 80, hbmType: "HBM2e", bw: 2.0, tdp: 400, fp16: 312, fp8: 0, nvlink: 600,
    price: { unit: 10000, cloud: [
      { period: "Q1 23", value: 3.80 }, { period: "Q2 23", value: 3.50 }, { period: "Q3 23", value: 3.00 }, { period: "Q4 23", value: 2.60 },
      { period: "Q1 24", value: 2.20 }, { period: "Q2 24", value: 1.80 }, { period: "Q3 24", value: 1.50 }, { period: "Q4 24", value: 1.30 },
      { period: "Q1 25", value: 1.10 }, { period: "Q2 25", value: 0.95 }, { period: "Q3 25", value: 0.82 }, { period: "Q4 25", value: 0.75 },
      { period: "Q1 26", value: 0.70 },
    ]},
    perf: { trainVsA100: "1.0x", inferVsA100: "1.0x", tokPerSec: "~350 (Llama 70B)", tokPerWatt: "0.88", tokPerDollar: "~500/hr" },
    status: "EOL — still widely deployed for inference & fine-tuning",
  },
  {
    gpu: "H100 SXM", gen: "Hopper", year: 2022, node: "TSMC 4N",
    vram: 80, hbmType: "HBM3", bw: 3.35, tdp: 700, fp16: 990, fp8: 1979, nvlink: 900,
    price: { unit: 27000, cloud: [
      { period: "Q1 23", value: 8.50 }, { period: "Q2 23", value: 8.00 }, { period: "Q3 23", value: 7.00 }, { period: "Q4 23", value: 6.00 },
      { period: "Q1 24", value: 5.00 }, { period: "Q2 24", value: 4.20 }, { period: "Q3 24", value: 3.70 }, { period: "Q4 24", value: 3.30 },
      { period: "Q1 25", value: 2.80 }, { period: "Q2 25", value: 2.40 }, { period: "Q3 25", value: 2.10 }, { period: "Q4 25", value: 1.90 },
      { period: "Q1 26", value: 2.20 },
    ]},
    perf: { trainVsA100: "~3x", inferVsA100: "~6x", tokPerSec: "~1,400 (Llama 70B)", tokPerWatt: "2.00", tokPerDollar: "~700/hr" },
    status: "Workhorse — mainstream for training & inference",
  },
  {
    gpu: "H200 SXM", gen: "Hopper", year: 2024, node: "TSMC 4N",
    vram: 141, hbmType: "HBM3e", bw: 4.8, tdp: 700, fp16: 990, fp8: 1979, nvlink: 900,
    price: { unit: 35000, cloud: [
      { period: "Q3 24", value: 6.50 }, { period: "Q4 24", value: 5.80 },
      { period: "Q1 25", value: 4.80 }, { period: "Q2 25", value: 4.30 }, { period: "Q3 25", value: 3.90 }, { period: "Q4 25", value: 3.70 },
      { period: "Q1 26", value: 3.72 },
    ]},
    perf: { trainVsA100: "~3x", inferVsA100: "~12x (mem-bound)", tokPerSec: "~2,800 (Llama 70B)", tokPerWatt: "4.00", tokPerDollar: "~750/hr" },
    status: "Premium inference — 76% more VRAM than H100",
  },
  {
    gpu: "B200 SXM", gen: "Blackwell", year: 2025, node: "TSMC 4NP",
    vram: 192, hbmType: "HBM3e", bw: 8.0, tdp: 1000, fp16: 2250, fp8: 4500, nvlink: 1800,
    price: { unit: 40000, cloud: [
      { period: "Q3 25", value: 8.00 }, { period: "Q4 25", value: 7.20 }, { period: "Q1 26", value: 6.00 },
    ]},
    perf: { trainVsA100: "~6x", inferVsA100: "~15x (DGX vs DGX)", tokPerSec: "~7,000 (Llama 70B, est.)", tokPerWatt: "7.00", tokPerDollar: "~1,170/hr" },
    status: "Ramping — sold out through mid-2026",
  },
  {
    gpu: "GB200 NVL72", gen: "Blackwell", year: 2025, node: "TSMC 4NP",
    vram: 192, hbmType: "HBM3e", bw: 8.0, tdp: 1200, fp16: 2500, fp8: 5000, nvlink: 1800,
    price: { unit: 54000, cloud: [
      { period: "Q1 26", value: 8.50 },
    ]},
    perf: { trainVsA100: "~8x (rack)", inferVsA100: "~30x (NVL72 rack)", tokPerSec: "~10,000+ (Llama 70B, rack-avg)", tokPerWatt: "8.33", tokPerDollar: "~1,180/hr" },
    status: "Rack-scale — 72 GPUs + 36 Grace CPUs + 18 BlueField-3 DPUs, liquid cooled. First commercial deployment: CoreWeave (Feb 2025). ~100 TB HBM3e per rack. Used for OpenAI Tranches 1 & 2.",
  },
  {
    gpu: "Vera Rubin", gen: "Rubin", year: 2026, node: "TSMC 3nm",
    vram: 288, hbmType: "HBM4", bw: 13.0, tdp: 1800, fp16: 0, fp8: 0, nvlink: 3600,
    price: { unit: 0, cloud: [] },
    perf: { trainVsA100: "TBD", inferVsA100: "TBD", tokPerSec: "TBD", tokPerWatt: "TBD", tokPerDollar: "TBD" },
    status: "H2 2026 deployment. 336B transistors. 10x inference cost reduction vs Blackwell. HBM4, NVL144 rack (3.6 ExaFLOPS FP4). Meta $27B Nebius deal for Vera Rubin (Mar 2026). Rubin Ultra 2027.",
  },
];

// GPU Cumulative Shipments (thousands of units) — same cohorts as cloud rental chart
// Sources: Epoch AI Chip Sales DB, TrendForce, Jensen Huang disclosures (4M Hoppers, 3M Blackwell thru Oct '25), SemiAnalysis
// A100 reached EOL; H100/H200 = Hopper family; B200/GB200 = Blackwell family
const GPU_DEMAND_DATA = [
  { period: "Q1 23", "A100 SXM": 420, "H100 SXM": 80 },
  { period: "Q2 23", "A100 SXM": 480, "H100 SXM": 120 },
  { period: "Q3 23", "A100 SXM": 550, "H100 SXM": 250 },
  { period: "Q4 23", "A100 SXM": 600, "H100 SXM": 500 },
  { period: "Q1 24", "A100 SXM": 630, "H100 SXM": 900 },
  { period: "Q2 24", "A100 SXM": 650, "H100 SXM": 1300, "H200 SXM": 30 },
  { period: "Q3 24", "A100 SXM": 670, "H100 SXM": 1800, "H200 SXM": 100 },
  { period: "Q4 24", "A100 SXM": 680, "H100 SXM": 2500, "H200 SXM": 200, "B200 SXM": 80 },
  { period: "Q1 25", "A100 SXM": 690, "H100 SXM": 2900, "H200 SXM": 350, "B200 SXM": 400, "GB200 NVL72": 80 },
  { period: "Q2 25", "A100 SXM": 700, "H100 SXM": 3200, "H200 SXM": 500, "B200 SXM": 800, "GB200 NVL72": 250 },
  { period: "Q3 25", "A100 SXM": 700, "H100 SXM": 3500, "H200 SXM": 650, "B200 SXM": 1300, "GB200 NVL72": 550 },
  { period: "Q4 25", "A100 SXM": 700, "H100 SXM": 3700, "H200 SXM": 800, "B200 SXM": 1800, "GB200 NVL72": 900 },
  { period: "Q1 26", "A100 SXM": 700, "H100 SXM": 3900, "H200 SXM": 1100, "B200 SXM": 3200, "GB200 NVL72": 1800 },
];

// LLM / AI API Pricing History — Frontier models, $/1M tokens
// Sources: OpenAI, Anthropic, Google, xAI official pricing pages, IntuitionLabs, Nebuly, SiliconData
// Tracks flagship (best) + value (cheapest capable) models per lab over time
const LLM_PRICING_DATA = {
  // Timeline entries: each is a model release with pricing at launch
  models: [
    // OpenAI
    { lab: "OpenAI", model: "GPT-4", date: "2023-03", input: 30.00, output: 60.00, ctx: 8, tier: "flagship", color: "#10B981" },
    { lab: "OpenAI", model: "GPT-4 32K", date: "2023-03", input: 60.00, output: 120.00, ctx: 32, tier: "flagship", color: "#10B981" },
    { lab: "OpenAI", model: "GPT-3.5 Turbo", date: "2023-03", input: 1.50, output: 2.00, ctx: 4, tier: "value", color: "#10B981" },
    { lab: "OpenAI", model: "GPT-4 Turbo", date: "2023-11", input: 10.00, output: 30.00, ctx: 128, tier: "flagship", color: "#10B981" },
    { lab: "OpenAI", model: "GPT-3.5 Turbo (v2)", date: "2024-01", input: 0.50, output: 1.50, ctx: 16, tier: "value", color: "#10B981" },
    { lab: "OpenAI", model: "GPT-4o", date: "2024-05", input: 5.00, output: 15.00, ctx: 128, tier: "flagship", color: "#10B981" },
    { lab: "OpenAI", model: "GPT-4o mini", date: "2024-07", input: 0.15, output: 0.60, ctx: 128, tier: "value", color: "#10B981" },
    { lab: "OpenAI", model: "GPT-4o (v2)", date: "2024-10", input: 2.50, output: 10.00, ctx: 128, tier: "flagship", color: "#10B981" },
    { lab: "OpenAI", model: "GPT-5", date: "2025-03", input: 2.00, output: 8.00, ctx: 128, tier: "flagship", color: "#10B981" },
    { lab: "OpenAI", model: "GPT-5.2", date: "2025-09", input: 1.75, output: 14.00, ctx: 128, tier: "flagship", color: "#10B981" },
    { lab: "OpenAI", model: "GPT-5.4", date: "2026-03", input: 2.50, output: 10.00, ctx: 1000, tier: "flagship", color: "#10B981" },
    // Anthropic
    { lab: "Anthropic", model: "Claude 2", date: "2023-07", input: 8.00, output: 24.00, ctx: 100, tier: "flagship", color: "#F59E0B" },
    { lab: "Anthropic", model: "Claude 3 Opus", date: "2024-03", input: 15.00, output: 75.00, ctx: 200, tier: "flagship", color: "#F59E0B" },
    { lab: "Anthropic", model: "Claude 3 Sonnet", date: "2024-03", input: 3.00, output: 15.00, ctx: 200, tier: "mid", color: "#F59E0B" },
    { lab: "Anthropic", model: "Claude 3 Haiku", date: "2024-03", input: 0.25, output: 1.25, ctx: 200, tier: "value", color: "#F59E0B" },
    { lab: "Anthropic", model: "Claude 3.5 Sonnet", date: "2024-06", input: 3.00, output: 15.00, ctx: 200, tier: "flagship", color: "#F59E0B" },
    { lab: "Anthropic", model: "Claude 3.5 Haiku", date: "2024-11", input: 1.00, output: 5.00, ctx: 200, tier: "value", color: "#F59E0B" },
    { lab: "Anthropic", model: "Claude Opus 4", date: "2025-03", input: 15.00, output: 75.00, ctx: 200, tier: "flagship", color: "#F59E0B" },
    { lab: "Anthropic", model: "Claude Sonnet 4", date: "2025-05", input: 3.00, output: 15.00, ctx: 200, tier: "mid", color: "#F59E0B" },
    { lab: "Anthropic", model: "Claude Opus 4.5", date: "2025-08", input: 5.00, output: 25.00, ctx: 200, tier: "flagship", color: "#F59E0B" },
    { lab: "Anthropic", model: "Claude Sonnet 4.5", date: "2025-09", input: 3.00, output: 15.00, ctx: 1000, tier: "mid", color: "#F59E0B" },
    { lab: "Anthropic", model: "Claude Haiku 4.5", date: "2025-10", input: 1.00, output: 5.00, ctx: 200, tier: "value", color: "#F59E0B" },
    { lab: "Anthropic", model: "Claude Opus 4.6", date: "2026-02", input: 5.00, output: 25.00, ctx: 1000, tier: "flagship", color: "#F59E0B" },
    { lab: "Anthropic", model: "Claude Sonnet 4.6", date: "2026-02", input: 3.00, output: 15.00, ctx: 1000, tier: "mid", color: "#F59E0B" },
    // Google
    { lab: "Google", model: "Gemini 1.0 Pro", date: "2023-12", input: 0.50, output: 1.50, ctx: 32, tier: "flagship", color: "#3B82F6" },
    { lab: "Google", model: "Gemini 1.5 Pro", date: "2024-02", input: 3.50, output: 10.50, ctx: 1000, tier: "flagship", color: "#3B82F6" },
    { lab: "Google", model: "Gemini 1.5 Flash", date: "2024-05", input: 0.35, output: 1.05, ctx: 1000, tier: "value", color: "#3B82F6" },
    { lab: "Google", model: "Gemini 1.5 Pro (v2)", date: "2024-09", input: 1.25, output: 5.00, ctx: 2000, tier: "flagship", color: "#3B82F6" },
    { lab: "Google", model: "Gemini 2.0 Flash", date: "2024-12", input: 0.10, output: 0.40, ctx: 1000, tier: "value", color: "#3B82F6" },
    { lab: "Google", model: "Gemini 2.5 Pro", date: "2025-03", input: 1.25, output: 10.00, ctx: 1000, tier: "flagship", color: "#3B82F6" },
    { lab: "Google", model: "Gemini 2.5 Flash", date: "2025-06", input: 0.15, output: 0.60, ctx: 1000, tier: "value", color: "#3B82F6" },
    { lab: "Google", model: "Gemini 3 Flash", date: "2025-12", input: 0.10, output: 0.40, ctx: 1000, tier: "value", color: "#3B82F6" },
    // xAI
    { lab: "xAI", model: "Grok 2", date: "2024-08", input: 2.00, output: 10.00, ctx: 131, tier: "flagship", color: "#EF4444" },
    { lab: "xAI", model: "Grok 2 mini", date: "2024-08", input: 0.20, output: 1.00, ctx: 131, tier: "value", color: "#EF4444" },
    { lab: "xAI", model: "Grok 3", date: "2025-02", input: 3.00, output: 15.00, ctx: 131, tier: "flagship", color: "#EF4444" },
    { lab: "xAI", model: "Grok 3 mini", date: "2025-02", input: 0.30, output: 0.50, ctx: 131, tier: "value", color: "#EF4444" },
    { lab: "xAI", model: "Grok 4.1", date: "2026-01", input: 3.00, output: 15.00, ctx: 256, tier: "flagship", color: "#EF4444" },
  ],
  // Frontier output cost timeline (best available model's output $/MTok at each date)
  // Shows the "price of intelligence" declining over time
  frontierOutput: [
    { date: "Mar 2023", price: 60.00, model: "GPT-4" },
    { date: "Jul 2023", price: 24.00, model: "Claude 2" },
    { date: "Nov 2023", price: 30.00, model: "GPT-4 Turbo" },
    { date: "Dec 2023", price: 1.50, model: "Gemini 1.0 Pro" },
    { date: "Mar 2024", price: 15.00, model: "Claude 3 Sonnet" },
    { date: "May 2024", price: 15.00, model: "GPT-4o" },
    { date: "Jun 2024", price: 15.00, model: "Claude 3.5 Sonnet" },
    { date: "Oct 2024", price: 10.00, model: "GPT-4o v2" },
    { date: "Mar 2025", price: 8.00, model: "GPT-5" },
    { date: "Sep 2025", price: 10.00, model: "Gemini 2.5 Pro" },
    { date: "Mar 2026", price: 10.00, model: "GPT-5.4" },
  ],
  // Value tier (cheapest capable) output cost timeline
  valueOutput: [
    { date: "Mar 2023", price: 2.00, model: "GPT-3.5 Turbo" },
    { date: "Jan 2024", price: 1.50, model: "GPT-3.5 Turbo v2" },
    { date: "Mar 2024", price: 1.25, model: "Claude 3 Haiku" },
    { date: "May 2024", price: 1.05, model: "Gemini 1.5 Flash" },
    { date: "Jul 2024", price: 0.60, model: "GPT-4o mini" },
    { date: "Dec 2024", price: 0.40, model: "Gemini 2.0 Flash" },
    { date: "Jun 2025", price: 0.60, model: "Gemini 2.5 Flash" },
    { date: "Dec 2025", price: 0.40, model: "Gemini 3 Flash" },
  ],
  // Context window evolution
  contextEvolution: [
    { date: "Mar 2023", maxCtx: 32, model: "GPT-4 32K" },
    { date: "Jul 2023", maxCtx: 100, model: "Claude 2" },
    { date: "Nov 2023", maxCtx: 128, model: "GPT-4 Turbo" },
    { date: "Feb 2024", maxCtx: 1000, model: "Gemini 1.5 Pro" },
    { date: "Jun 2024", maxCtx: 2000, model: "Gemini 1.5 Pro (2M)" },
    { date: "Feb 2026", maxCtx: 1000, model: "Claude Opus 4.6 / GPT-5.4" },
  ],
};

// Semiconductor Capex Data ($B) — Foundry, Memory/HBM, ASIC Design, Equipment
// Sources: TSMC/Samsung/SK Hynix/Micron 10-K filings, TrendForce, SemiAnalysis, company earnings calls
const SEMI_CAPEX_DATA = {
  companies: [
    { name: "TSMC", ticker: "TSM", segment: "Foundry", color: "#10B981",
      revenue: [
        { year: 2022, value: 75.9 }, { year: 2023, value: 69.3 }, { year: 2024, value: 87.1 }, { year: 2025, value: 108 },
        { year: 2026, value: 140, est: true }, { year: 2027, value: 165, est: true }, { year: 2028, value: 185, est: true }, { year: 2029, value: 200, est: true }, { year: 2030, value: 210, est: true },
      ],
      grossMargin: [
        { year: 2022, value: 59.6 }, { year: 2023, value: 54.4 }, { year: 2024, value: 56.1 }, { year: 2025, value: 58.0 },
        { year: 2026, value: 57, est: true }, { year: 2027, value: 56, est: true }, { year: 2028, value: 56, est: true }, { year: 2029, value: 55, est: true }, { year: 2030, value: 55, est: true },
      ],
      capex: [
        { year: 2022, value: 36.3 }, { year: 2023, value: 30.5 }, { year: 2024, value: 29.8 }, { year: 2025, value: 40.9 },
        { year: 2026, value: 54, est: true }, { year: 2027, value: 60, est: true }, { year: 2028, value: 62, est: true }, { year: 2029, value: 58, est: true }, { year: 2030, value: 55, est: true },
      ],
      breakdown: "70-80% advanced nodes (2nm/3nm), 10% specialty, 10-20% packaging (CoWoS/SoIC)",
      supplyTimeline: "N3 ramp: capex in 2023 → volume supply H2 2024. N2 capex 2025 → risk production H2 2025, volume H1 2026. CoWoS capacity target: 150K wafers/mo by end 2026 (4x late-2024 levels). Arizona Fab 2 (N3/N2): capex 2024-2026 → production 2028.",
      notes: "Record $54B guided for 2026 (+33% YoY). HPC now 58% of revenue. Revenue surpassed $100B in 2025 for first time. Margins sustainable at 56%+.",
    },
    { name: "Samsung Semi", ticker: "005930", segment: "Memory + Foundry", color: "#3B82F6",
      revenue: [
        { year: 2022, value: 63.2 }, { year: 2023, value: 40.0 }, { year: 2024, value: 55.0 }, { year: 2025, value: 68 },
        { year: 2026, value: 80, est: true }, { year: 2027, value: 90, est: true }, { year: 2028, value: 95, est: true }, { year: 2029, value: 98, est: true }, { year: 2030, value: 100, est: true },
      ],
      grossMargin: [
        { year: 2022, value: 47.0 }, { year: 2023, value: 12.0 }, { year: 2024, value: 35.0 }, { year: 2025, value: 42 },
        { year: 2026, value: 44, est: true }, { year: 2027, value: 45, est: true }, { year: 2028, value: 46, est: true }, { year: 2029, value: 45, est: true }, { year: 2030, value: 45, est: true },
      ],
      capex: [
        { year: 2022, value: 37.5 }, { year: 2023, value: 28.0 }, { year: 2024, value: 26.5 }, { year: 2025, value: 25.0 },
        { year: 2026, value: 30, est: true }, { year: 2027, value: 34, est: true }, { year: 2028, value: 36, est: true }, { year: 2029, value: 35, est: true }, { year: 2030, value: 34, est: true },
      ],
      breakdown: "~60% DRAM/HBM, ~25% NAND, ~15% foundry (Gate-All-Around)",
      supplyTimeline: "HBM3E qualified by Nvidia late 2025. HBM4: yield improved significantly, 1C process ramp H1 2026. P4L fab expansion online H2 2026. Pyeongtaek P5 resumed construction.",
      notes: "2026E capex >40T KRW (~$30B). Growth driven by DRAM/HBM. 35% HBM market share (Q3 2025). 2023 margin collapse from memory downturn (12% GM).",
    },
    { name: "SK Hynix", ticker: "000660", segment: "Memory (HBM Leader)", color: "#F59E0B",
      revenue: [
        { year: 2022, value: 34.2 }, { year: 2023, value: 22.8 }, { year: 2024, value: 40.1 }, { year: 2025, value: 55 },
        { year: 2026, value: 68, est: true }, { year: 2027, value: 78, est: true }, { year: 2028, value: 85, est: true }, { year: 2029, value: 88, est: true }, { year: 2030, value: 90, est: true },
      ],
      grossMargin: [
        { year: 2022, value: 43.0 }, { year: 2023, value: -5.0 }, { year: 2024, value: 45.0 }, { year: 2025, value: 52 },
        { year: 2026, value: 50, est: true }, { year: 2027, value: 48, est: true }, { year: 2028, value: 47, est: true }, { year: 2029, value: 46, est: true }, { year: 2030, value: 45, est: true },
      ],
      capex: [
        { year: 2022, value: 14.5 }, { year: 2023, value: 10.5 }, { year: 2024, value: 13.5 }, { year: 2025, value: 21.0 },
        { year: 2026, value: 26, est: true }, { year: 2027, value: 30, est: true }, { year: 2028, value: 32, est: true }, { year: 2029, value: 30, est: true }, { year: 2030, value: 28, est: true },
      ],
      breakdown: "85-90% DRAM, of which HBM ~2.5T KRW. 10% NAND",
      supplyTimeline: "HBM3E: volume ramp 2024, sold out through 2026. HBM4: capacity expansion at M15x fab, equipment prep Q1 2026, Union Fab start Q1 2027. Current 160K wafers/mo HBM output.",
      notes: "53% HBM market share (Q2 2025). HBM4 specs raised by Nvidia to >11 Gbps. 2023 was negative gross margin from memory crash.",
    },
    { name: "Micron", ticker: "MU", segment: "Memory (HBM + DRAM)", color: "#8B5CF6",
      revenue: [
        { year: 2022, value: 30.8 }, { year: 2023, value: 15.5 }, { year: 2024, value: 25.1 }, { year: 2025, value: 42.3 },
        { year: 2026, value: 74, est: true }, { year: 2027, value: 86, est: true }, { year: 2028, value: 92, est: true }, { year: 2029, value: 95, est: true }, { year: 2030, value: 98, est: true },
      ],
      grossMargin: [
        { year: 2022, value: 45.0 }, { year: 2023, value: -8.0 }, { year: 2024, value: 22.0 }, { year: 2025, value: 48 },
        { year: 2026, value: 58, est: true }, { year: 2027, value: 55, est: true }, { year: 2028, value: 53, est: true }, { year: 2029, value: 51, est: true }, { year: 2030, value: 50, est: true },
      ],
      capex: [
        { year: 2022, value: 12.1 }, { year: 2023, value: 7.7 }, { year: 2024, value: 8.4 }, { year: 2025, value: 14.0 },
        { year: 2026, value: 25, est: true }, { year: 2027, value: 28, est: true }, { year: 2028, value: 26, est: true }, { year: 2029, value: 24, est: true }, { year: 2030, value: 22, est: true },
      ],
      breakdown: "Primarily 1-gamma node DRAM + TSV equipment for HBM. Exited consumer memory (Dec 2025).",
      supplyTimeline: "HBM4E samples shipping at 11 Gbps. 2026 HBM sold out. New ID1 fab (Idaho, US): capex 2024-2026, operational not before 2027. NY fab progressing.",
      notes: "Q2 FY26 blowout: Rev $23.86B (+196%), EPS $12.20, GM 74.4%. Q3 guide $33.5B. Capex raised >$25B. HBM4 volume prod for Vera Rubin. Idaho fab mid-2027, NY $100B campus H2 2028. 2023 was -8% GM from memory crash.",
    },
    { name: "Intel", ticker: "INTC", segment: "Foundry + IDM", color: "#06B6D4",
      revenue: [
        { year: 2022, value: 63.1 }, { year: 2023, value: 54.2 }, { year: 2024, value: 53.1 }, { year: 2025, value: 52 },
        { year: 2026, value: 55, est: true }, { year: 2027, value: 58, est: true }, { year: 2028, value: 62, est: true }, { year: 2029, value: 65, est: true }, { year: 2030, value: 68, est: true },
      ],
      grossMargin: [
        { year: 2022, value: 47.3 }, { year: 2023, value: 40.0 }, { year: 2024, value: 32.7 }, { year: 2025, value: 36 },
        { year: 2026, value: 38, est: true }, { year: 2027, value: 40, est: true }, { year: 2028, value: 42, est: true }, { year: 2029, value: 43, est: true }, { year: 2030, value: 44, est: true },
      ],
      capex: [
        { year: 2022, value: 25.1 }, { year: 2023, value: 25.8 }, { year: 2024, value: 21.5 }, { year: 2025, value: 18.0 },
        { year: 2026, value: 20, est: true }, { year: 2027, value: 22, est: true }, { year: 2028, value: 24, est: true }, { year: 2029, value: 22, est: true }, { year: 2030, value: 20, est: true },
      ],
      breakdown: "'5 nodes in 4 years' plan: Intel 7 → 4 → 3 → 20A → 18A. Foundry services (IFS) expansion.",
      supplyTimeline: "Intel 18A: risk production H2 2025, volume 2026. Ohio mega-fab: broke ground 2022, delayed, first chips ~2027-2028. Foundry spin-off under review.",
      notes: "Restructuring. $10B+ cost cuts. Foundry losses $7B in 2024. 18A is make-or-break. Margin erosion from foundry investments.",
    },
    { name: "Broadcom", ticker: "AVGO", segment: "ASIC Design", color: "#EF4444",
      revenue: [
        { year: 2022, value: 33.2 }, { year: 2023, value: 35.8 }, { year: 2024, value: 51.6 }, { year: 2025, value: 65 },
        { year: 2026, value: 80, est: true }, { year: 2027, value: 95, est: true }, { year: 2028, value: 108, est: true }, { year: 2029, value: 118, est: true }, { year: 2030, value: 125, est: true },
      ],
      grossMargin: [
        { year: 2022, value: 74.7 }, { year: 2023, value: 74.0 }, { year: 2024, value: 76.2 }, { year: 2025, value: 77 },
        { year: 2026, value: 77, est: true }, { year: 2027, value: 78, est: true }, { year: 2028, value: 78, est: true }, { year: 2029, value: 77, est: true }, { year: 2030, value: 77, est: true },
      ],
      capex: [
        { year: 2022, value: 0.5 }, { year: 2023, value: 0.5 }, { year: 2024, value: 0.7 }, { year: 2025, value: 1.0 },
        { year: 2026, value: 1.5, est: true }, { year: 2027, value: 2.0, est: true }, { year: 2028, value: 2.5, est: true }, { year: 2029, value: 2.5, est: true }, { year: 2030, value: 2.5, est: true },
      ],
      breakdown: "R&D-heavy, fab-light. Designs custom ASICs for Google (TPU), Meta (MTIA), OpenAI. Networking.",
      supplyTimeline: "TPU v7 Ironwood co-designed with Google, ramping 2026. OpenAI custom ASIC in design, first silicon 2026-2027. Revenue from custom AI accelerators growing >3x YoY.",
      notes: "Key ASIC partner for 3 of top 5 hyperscalers. AI rev run rate >$15B. 90% custom AI chip market. 77% gross margin — highest in semi. VMware acquisition boosted rev.",
    },
  ],
  aggregate: [
    { year: 2022, value: 126 }, { year: 2023, value: 103 },
    { year: 2024, value: 100 }, { year: 2025, value: 120 }, { year: 2026, value: 157, est: true },
    { year: 2027, value: 176, est: true }, { year: 2028, value: 183, est: true }, { year: 2029, value: 172, est: true }, { year: 2030, value: 162, est: true },
  ],
};

// GPU & ASIC Roadmap Data
// Sources: NVIDIA GTC 2025, AMD FAD 2025, Google Cloud Next 2025, AWS re:Invent, SemiAnalysis, Tom's Hardware
const CHIP_ROADMAP = [
  // NVIDIA GPUs
  { vendor: "NVIDIA", type: "GPU", chip: "A100", arch: "Ampere", node: "7nm", year: 2020, status: "EOL", vram: 80, hbm: "HBM2e", bw: 2.0, tdp: 400, fp8: 0, fp4: 0, system: "DGX A100", notes: "Workhorse of GPT-3/4 era. 4M+ shipped. EOL but still widely deployed for inference.", color: "#64748B" },
  { vendor: "NVIDIA", type: "GPU", chip: "H100", arch: "Hopper", node: "4N", year: 2022, status: "Shipping", vram: 80, hbm: "HBM3", bw: 3.35, tdp: 700, fp8: 1979, fp4: 0, system: "DGX H100 / HGX H100", notes: "4M shipped thru Oct '25 (Jensen). Mainstream for training. Being superseded by Blackwell.", color: "#3B82F6" },
  { vendor: "NVIDIA", type: "GPU", chip: "H200", arch: "Hopper", node: "4N", year: 2024, status: "Shipping", vram: 141, hbm: "HBM3e", bw: 4.8, tdp: 700, fp8: 1979, fp4: 0, system: "HGX H200", notes: "Bridge product. 76% more VRAM than H100. Premium inference chip.", color: "#60A5FA" },
  { vendor: "NVIDIA", type: "GPU", chip: "B200", arch: "Blackwell", node: "4NP", year: 2025, status: "Shipping", vram: 192, hbm: "HBM3e", bw: 8.0, tdp: 1000, fp8: 4500, fp4: 10000, system: "GB200 NVL72", notes: "3M+ shipped thru Oct '25. Sold out through mid-2026. Dual-die design.", color: "#10B981" },
  { vendor: "NVIDIA", type: "GPU", chip: "B300", arch: "Blackwell Ultra", node: "4NP", year: 2025, status: "H2 2025", vram: 288, hbm: "HBM3e 12-Hi", bw: 8.0, tdp: 1200, fp8: 0, fp4: 15000, system: "GB300 NVL72", notes: "1.5x B200 FP4. 288GB via 12-Hi stacks. CX-8 NIC (800G). First commercial deployment: CoreWeave (Jul 2025). Used for OpenAI Tranche 3 and Meta $19.2B+ deal.", color: "#059669" },
  { vendor: "NVIDIA", type: "GPU", chip: "VR200 (Vera Rubin)", arch: "Rubin", node: "3nm", year: 2026, status: "H2 2026", vram: 288, hbm: "HBM4", bw: 13.0, tdp: 1800, fp8: 0, fp4: 50000, system: "VR200 NVL144", notes: "In production (Jensen, CES 2026). Mass production late Q2 2026, rack assembly Q3 2026. ~5-7K racks H2 2026. 3.3x B300 compute. HBM4. NVLink 6. Vera CPU (88-core Arm). 3.6 EFLOPS FP4/rack.", color: "#F59E0B" },
  { vendor: "NVIDIA", type: "GPU", chip: "VR300 (Rubin Ultra)", arch: "Rubin Ultra", node: "3nm", year: 2027, status: "H2 2027", vram: 1024, hbm: "HBM4e 16-Hi", bw: 8.0, tdp: 3600, fp8: 0, fp4: 100000, system: "VR300 NVL576 (Kyber)", notes: "21x GB200 NVL72 perf. 144 GPUs per Kyber rack. NVLink 7. 4-die GPU. 1TB HBM4e. 15 EFLOPS FP4/rack.", color: "#D97706" },
  { vendor: "NVIDIA", type: "GPU", chip: "Feynman", arch: "Feynman", node: "2nm?", year: 2028, status: "Announced", vram: 0, hbm: "HBM4e+", bw: 0, tdp: 0, fp8: 0, fp4: 0, system: "TBD", notes: "Rosa CPU. LP40 LPU (Groq). BlueField-5. Dual copper + co-packaged optics. Previewed at GTC 2026.", color: "#94A3B8" },
  // AMD GPUs
  { vendor: "AMD", type: "GPU", chip: "MI300X", arch: "CDNA 3", node: "5nm/6nm", year: 2023, status: "Shipping", vram: 192, hbm: "HBM3", bw: 5.3, tdp: 750, fp8: 2600, fp4: 0, system: "8x OAM", notes: "Adopted by MSFT, Meta, Oracle. El Capitan #1 supercomputer. $5B+ AI rev in 2024.", color: "#EF4444" },
  { vendor: "AMD", type: "GPU", chip: "MI325X", arch: "CDNA 3.5", node: "5nm", year: 2024, status: "Shipping", vram: 288, hbm: "HBM3e", bw: 6.0, tdp: 750, fp8: 2600, fp4: 0, system: "8x OAM", notes: "Memory upgrade to 288GB HBM3e. Same compute as MI300X.", color: "#F87171" },
  { vendor: "AMD", type: "GPU", chip: "MI355X", arch: "CDNA 4", node: "3nm", year: 2025, status: "Shipping", vram: 288, hbm: "HBM3e", bw: 8.0, tdp: 1400, fp8: 0, fp4: 5000, system: "8x OAM / Helios Rack", notes: "Shipping since Q3 2025. Vultr, Oracle among first deployers. 300-600K units/quarter in 2026. 35x inference over MI300X (FP4).", color: "#DC2626" },
  { vendor: "AMD", type: "GPU", chip: "MI455X", arch: "CDNA 5", node: "3nm", year: 2026, status: "Q3 2026", vram: 432, hbm: "HBM4", bw: 19.6, tdp: 0, fp8: 20000, fp4: 40000, system: "Helios Rack", notes: "Shown at CES 2026. 3 AI EFLOPS per Helios rack. Also MI440X (enterprise) and MI430X (HPC/sovereign). Meta $60B+ deal.", color: "#B91C1C" },
  { vendor: "AMD", type: "GPU", chip: "MI500", arch: "CDNA Next", node: "2nm?", year: 2027, status: "Announced", vram: 0, hbm: "HBM4e", bw: 0, tdp: 0, fp8: 0, fp4: 0, system: "TBD", notes: "Annual cadence target. Details TBD. Competing with Rubin Ultra.", color: "#991B1B" },
  // Google TPUs
  { vendor: "Google", type: "ASIC (TPU)", chip: "TPU v5p", arch: "Custom", node: "5nm", year: 2023, status: "Shipping", vram: 95, hbm: "HBM2e", bw: 4.8, tdp: 300, fp8: 0, fp4: 0, system: "8960-chip pods", notes: "3D torus interconnect. Used for Gemini 1.0/1.5 training.", color: "#3B82F6" },
  { vendor: "Google", type: "ASIC (TPU)", chip: "TPU v6e (Trillium)", arch: "Custom", node: "5nm", year: 2024, status: "Shipping", vram: 32, hbm: "HBM", bw: 1.6, tdp: 200, fp8: 0, fp4: 0, system: "256-chip pods", notes: "4x training perf over v5e. Cost-optimized for inference. Gemini 2.0 trained here.", color: "#2563EB" },
  { vendor: "Google", type: "ASIC (TPU)", chip: "TPU v7 (Ironwood)", arch: "Custom", node: "3nm?", year: 2025, status: "GA 2026", vram: 192, hbm: "HBM3e", bw: 7.4, tdp: 600, fp8: 4614, fp4: 0, system: "9216-chip pods (42.5 EFLOPS)", notes: "First native FP8 TPU. Anthropic 1M-chip deal. Meta lease talks. 44% lower TCO vs GB200.", color: "#1D4ED8" },
  { vendor: "Google", type: "ASIC (TPU)", chip: "TPU v8 (TBD)", arch: "Custom", node: "TBD", year: 2027, status: "Expected", vram: 0, hbm: "HBM4?", bw: 0, tdp: 0, fp8: 0, fp4: 0, system: "TBD", notes: "Annual cadence. Likely HBM4. Details unannounced.", color: "#1E40AF" },
  // Amazon ASICs
  { vendor: "Amazon", type: "ASIC", chip: "Trainium 1", arch: "Custom", node: "7nm?", year: 2022, status: "EOL", vram: 32, hbm: "HBM2", bw: 0.8, tdp: 0, fp8: 0, fp4: 0, system: "Trn1 instances", notes: "First-gen. Limited adoption. Lagged behind Nvidia.", color: "#F59E0B" },
  { vendor: "Amazon", type: "ASIC", chip: "Trainium 2", arch: "Custom", node: "5nm?", year: 2024, status: "Shipping", vram: 96, hbm: "HBM3", bw: 2.5, tdp: 0, fp8: 0, fp4: 0, system: "Trn2 instances / UltraCluster", notes: "4x training perf over Trn1. 500K+ chips at Anthropic's Indiana DC. 64K-chip UltraClusters.", color: "#D97706" },
  { vendor: "Amazon", type: "ASIC", chip: "Trainium 3", arch: "Custom", node: "3nm", year: 2025, status: "Shipping (Dec 2025)", vram: 144, hbm: "HBM3e", bw: 4.9, tdp: 0, fp8: 2520, fp4: 0, system: "TBD", notes: "GA Dec 2025. 2.52 PFLOPS FP8/chip. 4.4x perf vs Trn2. 144GB HBM3e. Full production ramp Q2 2026. Trainium 4 announced for late 2026.", color: "#B45309" },
  // Microsoft
  { vendor: "Microsoft", type: "ASIC", chip: "Maia 100", arch: "Custom", node: "5nm", year: 2024, status: "Internal", vram: 64, hbm: "HBM2e", bw: 1.8, tdp: 500, fp8: 0, fp4: 0, system: "Azure Maia racks", notes: "First custom AI chip. Liquid-cooled. Designed with OpenAI workloads in mind.", color: "#8B5CF6" },
  { vendor: "Microsoft", type: "ASIC", chip: "Maia 200 (TBD)", arch: "Custom", node: "TBD", year: 2026, status: "Expected", vram: 0, hbm: "HBM3e?", bw: 0, tdp: 0, fp8: 0, fp4: 0, system: "Azure", notes: "Next-gen expected. MSFT investing heavily in custom silicon + Nvidia for OpenAI.", color: "#7C3AED" },
  // Meta
  { vendor: "Meta", type: "ASIC", chip: "MTIA v1", arch: "Custom", node: "7nm", year: 2023, status: "Internal", vram: 0, hbm: "—", bw: 0, tdp: 25, fp8: 0, fp4: 0, system: "Inference only", notes: "First-gen inference ASIC. Ranking & recommendation models. Very low power.", color: "#EC4899" },
  { vendor: "Meta", type: "ASIC", chip: "MTIA v2", arch: "Custom", node: "5nm", year: 2025, status: "Internal", vram: 0, hbm: "—", bw: 0, tdp: 0, fp8: 0, fp4: 0, system: "Inference at scale", notes: "Scaled up for Llama inference. Still relies on Nvidia GPUs for training.", color: "#DB2777" },
  // OpenAI
  { vendor: "OpenAI", type: "ASIC", chip: "Titan (Custom ASIC w/ Broadcom)", arch: "Custom", node: "N3", year: 2026, status: "In Design", vram: 0, hbm: "HBM4", bw: 0, tdp: 0, fp8: 0, fp4: 0, system: "TBD", notes: "Broadcom co-design, TSMC N3 fab, Samsung HBM4 (exclusive deal, Mar 2026). $10B Broadcom order. First racks H2 2026. 2nd-gen planned on TSMC A16.", color: "#6366F1" },
];

const NEOCLOUD_DATA = [
  { name: "CoreWeave", ticker: "CRWV", status: "Public (Nasdaq, IPO Mar 2025 at $40)", valuation: "$55B+", founded: 2017, hq: "Livingston, NJ",
    power: { connected: "850 MW", contracted: "3.1 GW" }, gpus: "250K+ (H100/H200/GB200/GB300)", backlog: "$66.8B",
    keyClients: "Microsoft ($10B, 67% of FY2025 rev), OpenAI ($22.4B across 3 tranches), Meta ($19.2B+, GB300), NVIDIA ($6.3B backstop), IBM (GB200)",
    contracts: "MSFT $10B multi-year · OpenAI $22.4B (3 tranches thru 2031) · Meta $19.2B+ (GB300, 6-yr thru 2032) · NVIDIA $6.3B backstop (thru Apr 2032) · OpenAI $350M equity investment at IPO",
    revenue: "$5.1B FY2025 (+167% YoY). EBITDA $3.1B. 96% from long-term take-or-pay contracts.", investors: "NVIDIA ($5.3B equity + $6.3B capacity), OpenAI ($350M IPO), Magnetar, Coatue, Fidelity, Jane Street",
    locations: "43 data centers: NJ (Kenilworth 250MW), PA (Lancaster 300MW), TX (Denton 260MW, Plano 30MW), VA (Chester 148MW), OK (Muskogee 100MW), ND (Ellendale 400MW), UK (Crawley, London), Norway, Canada (Regina 300MW)",
    timeline: "GB200 NVL72 live Feb 2025 · GB300 NVL72 live Jul 2025 · 1.7 GW target YE2026 · 3.1 GW contracted by YE2027 · 5+ GW by 2030",
    notes: "Platinum-tier SemiAnalysis rating. Only neocloud commanding premium pricing. $34B+ off-balance-sheet leases. $19.6B total debt. Capex $14.9B (2025), guided $30-35B (2026). RPO $60.7B. Revenue per MW ~$7.4M annualized. 55-65% GPU utilization (vs Azure 35-45%).", color: "#3B82F6" },
  { name: "Nebius", ticker: "NBIS", status: "Public (Nasdaq)", valuation: "$35B+", founded: 2024, hq: "Amsterdam, NL",
    power: { connected: "220 MW", contracted: "2.5 GW" }, gpus: "50K+ (H100/H200/B200)", backlog: "$49B+",
    keyClients: "Microsoft (5-yr GPU supply deal), Meta ($27B 5-yr), Mistral, Anthropic",
    contracts: "$49B+ backlog · Meta $27B 5-yr Vera Rubin deal (Mar 2026) · MSFT $19.4B 5-yr deal · Targeting 800 MW-1 GW by end 2026 · Sovereign AI cloud (EU/ME)",
    revenue: "~$400M run rate (targeting $7-9B ARR by end 2026)", investors: "NVIDIA ($2B, 8.3% equity — Mar 2026), Accel ($700M round), MSFT ($19.4B infra contract), Meta ($27B + prior $3B compute)",
    locations: "Finland, France, US (Kansas City, New Jersey), Israel, UAE", timeline: "220 MW live · 800 MW-1 GW connected by end 2026 · 2.5 GW contracted",
    notes: "Ex-Yandex spin-off. Gold-tier SemiAnalysis. Open-source Soperator (Slurm-on-K8s). Strong EU sovereign cloud positioning. NBIS +630% from 2025 lows. First large-scale NVIDIA Vera Rubin deployment via Meta deal.", color: "#06B6D4" },
  { name: "Lambda Labs", ticker: "Private", status: "Private", valuation: "$4B+", founded: 2012, hq: "San Francisco, CA",
    power: { connected: "~100 MW", contracted: "~500 MW" }, gpus: "15K+ (A100/H100/H200/B200)", backlog: "N/A",
    keyClients: "AI research labs, startups, enterprise", contracts: "NVIDIA leaseback model · On-prem + cloud GPU clusters",
    revenue: "~$300M+ est.", investors: "NVIDIA (equity + leaseback model), T. Rowe Price, $1.5B raised. NVIDIA provides preferential GPU allocation",
    locations: "Austin TX, SF Bay Area, multiple colo sites", timeline: "B200 clusters live 2025 · Expanding 2026",
    notes: "Developer-first identity. One-click clusters. On-prem + cloud hybrid. VAST Data storage integration (11-12 GB/s per node).", color: "#10B981" },
  { name: "Crusoe Cloud", ticker: "Private", status: "Private", valuation: "$5B+", founded: 2018, hq: "Denver, CO",
    power: { connected: "~200 MW", contracted: "4.5 GW (natural gas)" }, gpus: "~20K (H100/H200)", backlog: "N/A",
    keyClients: "Enterprise AI, sustainability-focused orgs", contracts: "4.5 GW natural gas contracts · $600M Series D (Dec 2024)",
    revenue: "~$200M est.", investors: "NVIDIA (undisclosed equity), Valor Equity (Musk-linked), Founders Fund, $1.1B+ raised",
    locations: "Wyoming, Montana, Colorado, Texas", timeline: "4.5 GW gas secured · Multi-GW DC pipeline 2026-2028",
    notes: "Sustainability-first: flare gas + stranded renewables. Massive 45 GW long-term pipeline. API-driven managed services.", color: "#84CC16" },
  { name: "Fluidstack", ticker: "Private", status: "Private", valuation: "$2B+", founded: 2017, hq: "London, UK",
    power: { connected: "~150 MW", contracted: "Multi-GW" }, gpus: "100K+ managed", backlog: "$50B (Anthropic deal)",
    keyClients: "Anthropic ($50B), Meta, Mistral, Midjourney, Character.AI",
    contracts: "$50B Anthropic multi-year DC buildout · French govt $11B 1-GW AI project · $6.7B TeraWulf hosting (2x 10-yr)",
    revenue: "$66M (2024, +37x from 2022)", investors: "Google (backstops Anthropic/TeraWulf/Hut 8 leases), $200M Series A (Feb 2025). French govt partnership ($11B)",
    locations: "TX (Mitchell County), NY (Niagara County), France, UK", timeline: "TX + NY sites online throughout 2026 · French 1-GW site 2026-2027",
    notes: "Anthropic's primary DC partner. Oxford spin-off. Speed advantage: months not years. Wholesale (62%) + marketplace (38%).", color: "#F59E0B" },
  { name: "Voltage Park", ticker: "Private", status: "Private", valuation: "$1B+ est.", founded: 2023, hq: "San Francisco, CA",
    power: { connected: "~80 MW", contracted: "~200 MW" }, gpus: "24K+ H100 SXM", backlog: "N/A",
    keyClients: "AI startups, research labs", contracts: "Short-to-medium term GPU rental · Bare-metal H100 clusters",
    revenue: "N/A", investors: "Crypto-wealth backed (undisclosed). No known hyperscaler equity stakes",
    locations: "6 global Tier 3+ data centers", timeline: "Operational · Expanding 2026",
    notes: "Bare-metal performance focus. Among cheapest H100 providers. 6 DCs across US/EU.", color: "#8B5CF6" },
  { name: "RunPod", ticker: "Private", status: "Private", valuation: "$1B+ est.", founded: 2022, hq: "Moorestown, NJ",
    power: { connected: "~50 MW", contracted: "~150 MW" }, gpus: "10K+ (A100/H100/H200)", backlog: "N/A",
    keyClients: "AI developers, startups, academics", contracts: "Secure Cloud + Community Cloud model · Serverless inference",
    revenue: "~$100M+ est.", investors: "Dell Technologies Capital, Intel Capital, NVIDIA (undisclosed), $220M+ raised",
    locations: "US, EU (multiple colo partners)", timeline: "Expanding GPU fleet 2026",
    notes: "Developer darling: spin up GPUs in seconds. Autoscaling + serverless. Community Cloud for budget workloads.", color: "#EF4444" },
  { name: "Nscale", ticker: "Private", status: "Private", valuation: "$1B+ est.", founded: 2023, hq: "London, UK",
    power: { connected: "~50 MW", contracted: "~500 MW" }, gpus: "Targeting 100K by 2026", backlog: "N/A",
    keyClients: "EU sovereign AI customers, NVIDIA", contracts: "Stargate Norway project (100K GPUs by 2026) · NVIDIA-backed",
    revenue: "N/A", investors: "NVIDIA (strategic investor + GPU allocation), sovereign wealth funds (Norway). EU sovereign AI mandate",
    locations: "Norway (Stargate), UK", timeline: "100K GPUs by 2026 · Norway site operational 2026",
    notes: "Sovereign AI cloud for Europe. NVIDIA-backed. Norwegian hydro power for sustainability.", color: "#22D3EE" },
  { name: "Vultr", ticker: "Private", status: "Private (DigitalOcean competitor)", valuation: "$3.5B", founded: 2014, hq: "Matawan, NJ",
    power: { connected: "~100 MW", contracted: "~300 MW" }, gpus: "H100/B200 fleet", backlog: "N/A",
    keyClients: "SMBs, developers, AI startups", contracts: "B200 reserved instances (36-mo @ $2.89/hr) · 32 DC locations",
    revenue: "$500M+ est.", investors: "AMD (strategic partnership), $333M raised. Alternative to NVIDIA-dominated neoclouds",
    locations: "32 locations globally", timeline: "B200 availability 2025-2026",
    notes: "Broadest geographic coverage of any neocloud (32 DCs). Simple pricing. B200 reserved model. AMD partnership.", color: "#A855F7" },
  { name: "WhiteFiber", ticker: "WYFI", status: "Public (Nasdaq)", valuation: "$2B+", founded: 2023, hq: "Singapore",
    power: { connected: "~50 MW", contracted: "~500 MW" }, gpus: "GPU cloud for Asia/APAC", backlog: "N/A",
    keyClients: "APAC enterprises, sovereign AI programs",
    contracts: "APAC-focused GPU cloud · Sovereign AI positioning for SE Asia",
    revenue: "~$50M est.", investors: "Singapore ecosystem. IPO 2025",
    locations: "Singapore, Indonesia, Malaysia", timeline: "Expanding across APAC 2026",
    notes: "APAC neocloud play. +23% YTD. Sovereign AI for SE Asian govts. Small but high-growth.", color: "#06B6D4" },
  { name: "Vast.ai", ticker: "Private", status: "Private", valuation: "<$1B est.", founded: 2018, hq: "San Francisco, CA",
    power: { connected: "Marketplace", contracted: "N/A" }, gpus: "50K+ (marketplace model)", backlog: "N/A",
    keyClients: "AI researchers, indie developers, small teams",
    contracts: "GPU marketplace: supply-side from mining farms + DCs · Spot + reserved pricing",
    revenue: "~$50M+ est.", investors: "Seed/Series A funded. Marketplace model (capital-light)",
    locations: "Global marketplace (distributed)", timeline: "Expanding supply side 2026",
    notes: "GPU marketplace model — Airbnb for compute. Lowest prices in market. Spot market for H100s. Capital-light but quality variance.", color: "#94A3B8" },
  { name: "Civo", ticker: "Private", status: "Private", valuation: "$500M+ est.", founded: 2020, hq: "London, UK",
    power: { connected: "~30 MW", contracted: "~100 MW" }, gpus: "GPU cloud for EU", backlog: "N/A",
    keyClients: "EU developers, SMBs, sovereign AI",
    contracts: "Kubernetes-native GPU cloud · UK/EU sovereign positioning",
    revenue: "~$30M est.", investors: "EU-focused VCs. Kubernetes-native differentiation",
    locations: "UK, EU", timeline: "Expanding EU footprint 2026",
    notes: "K8s-native cloud. EU sovereign AI focus. Small but developer-loved. Competing with Vultr for EU SMB market.", color: "#10B981" },
];

const SHELL_POWER_DATA = [
  { name: "TeraWulf", ticker: "WULF", status: "Public (Nasdaq)", valuation: "$4B+", founded: 2021, hq: "Easton, MD",
    power: { connected: "~245 MW", contracted: "~600 MW" }, powerType: "Nuclear + Hydro (zero-carbon)",
    keyClients: "Fluidstack/Anthropic, Core42 (G42)", backlog: "$9.5B (25-yr Fluidstack JV)",
    contracts: "$9.5B 25-yr Fluidstack JV · Core42 70 MW lease · 168 MW Abernathy TX campus",
    revenue: "$7.2M HPC (Q3 2025, first recurring)", locations: "Lake Mariner NY (nuclear), Abernathy TX",
    timeline: "18 MW live · 168 MW TX online 2026 · 600 MW total contracted through 2026",
    ecosystem: "Google ($3.2B backstop, 14% equity stake — Dec 2025), Fluidstack ($9.5B JV), Core42/G42 ($1.1B 10-yr lease)", notes: "Zero-carbon power edge (nuclear/hydro). Ex-Bitcoin miner. Power-first model: owns the MW, leases to neoclouds. Google backstop is key credit enhancement.", color: "#10B981" },
  { name: "Applied Digital", ticker: "APLD", status: "Public (Nasdaq)", valuation: "$5B+", founded: 2022, hq: "Dallas, TX",
    power: { connected: "~100 MW", contracted: "~700 MW" }, powerType: "Grid + renewables",
    keyClients: "CoreWeave (400 MW), investment-grade hyperscaler (200 MW)", backlog: "$16B (600 MW leased)",
    contracts: "CoreWeave 400 MW (Polaris Forge 1-3) · 200 MW Polaris Forge 2 (hyperscaler 15-yr) · $16B aggregate lease revenue",
    revenue: "$85M HPC hosting (Q2 FY26)", locations: "Ellendale ND (Polaris Forge 1), Harwood ND (Forge 2), Jamestown ND",
    timeline: "100 MW live · 150 MW CY2026 · 150 MW CY2027 · 200 MW Forge 2 CY2026-2027",
    ecosystem: "CoreWeave ($11B total lease revenue, 400 MW), investment-grade hyperscaler (200 MW, 15-yr). No direct equity from hyperscalers but CoreWeave is NVIDIA-backed", notes: "Data center design-build-operate for hyperscalers. Cool climate (Dakotas) advantage. $3B Forge 2 campus.", color: "#3B82F6" },
  { name: "Core Scientific", ticker: "CORZ", status: "Public (Nasdaq)", valuation: "$6B+", founded: 2017, hq: "Austin, TX",
    power: { connected: "~250 MW HPC", contracted: "~590 MW (CoreWeave)" }, powerType: "Grid (multi-state)",
    keyClients: "CoreWeave (590 MW contract)", backlog: "$10B+ (CoreWeave)",
    contracts: "CoreWeave $8.7B 12-yr 590 MW contract across 6 sites · Denton TX 100 MW expansion (delayed, mid-2026) · 300 MW expansion + 400 MW new sites",
    revenue: "$1B+ quarterly (BTC + hosting)", locations: "TX (Denton, Pecos), GA, NC, SC, KY, ND — 16 sites",
    timeline: "250 MW live to CoreWeave · 590 MW by early 2027 · 700 MW+ total HPC by 2028",
    ecosystem: "CoreWeave ($10B+ 590 MW contract). NVIDIA indirect via CoreWeave. Galaxy Digital partnership. No direct hyperscaler equity stakes", notes: "Largest ex-crypto infrastructure. 700K+ miners operated. AI hosting 75-80% gross margin at maturity vs -3% for mining.", color: "#F59E0B" },
  { name: "Cipher Mining", ticker: "CIFR", status: "Public (Nasdaq)", valuation: "$3B+", founded: 2021, hq: "New York, NY",
    power: { connected: "~168 MW", contracted: "~470 MW" }, powerType: "Grid (TX, OH)",
    keyClients: "AWS (300 MW, 15-yr), Neocloud (168 MW, 10-yr)", backlog: "$5.5B+ (AWS deal alone)",
    contracts: "AWS 15-yr $5.5B 300 MW lease · 168 MW 10-yr AI hosting agreement · Multiple TX/OH sites",
    revenue: "$56M (Q3 2025)", locations: "Odessa TX, Black Pearl TX, Bear TX, Barber Lake OH",
    timeline: "168 MW AI hosting live · 300 MW AWS coming online 2026-2027",
    ecosystem: "Amazon/AWS ($5.5B 15-yr 300 MW lease — direct hyperscaler contract), Fluidstack (168 MW hosting). AWS is primary anchor tenant", notes: "Significant AWS anchor deal. Fixed-price long-duration contracts reduce GPU pricing risk. Direct hyperscaler relationship is rare among ex-miners.", color: "#8B5CF6" },
  { name: "Hut 8", ticker: "HUT", status: "Public (Nasdaq/TSX)", valuation: "$3B+", founded: 2017, hq: "Miami, FL",
    power: { connected: "~100 MW HPC", contracted: "~2.3 GW (Anthropic pipeline)" }, powerType: "Grid + renewables",
    keyClients: "Anthropic/Fluidstack (Google-backed), enterprise", backlog: "$7B (Anthropic/Fluidstack 15-yr)",
    contracts: "$7B 15-yr Anthropic/Fluidstack lease (Google backstop) · Could scale to 2.3 GW · Energy infrastructure platform",
    revenue: "$100M+ quarterly", locations: "Alberta, Ontario, TX, NY",
    timeline: "Initial capacity 2026 · 2.3 GW full pipeline 2027-2030",
    ecosystem: "Anthropic/Fluidstack ($7B 15-yr lease), Google/Alphabet (financial backstop for lease term — credit enhancement), potential 2.3 GW pipeline", notes: "Direct Anthropic infrastructure play. Google providing financial backstop for 15-yr term. Repositioning as energy infrastructure platform. Most direct Anthropic exposure among shells.", color: "#EF4444" },
  { name: "Riot Platforms", ticker: "RIOT", status: "Public (Nasdaq)", valuation: "$4B+", founded: 2000, hq: "Castle Rock, CO",
    power: { connected: "~1.1 GW total", contracted: "~1.7 GW" }, powerType: "Grid (TX ERCOT)",
    keyClients: "In talks for AI hosting JVs", backlog: "N/A (early stage AI pivot)",
    contracts: "112 MW AI/HPC capacity at Corsicana TX campus · In discussion with AI hosting partners",
    revenue: "$100M+ quarterly (mining)", locations: "Corsicana TX (1 GW), Rockdale TX",
    timeline: "112 MW HPC development · Partner deals expected 2026",
    ecosystem: "In discussions with AI hosting partners (unnamed). No hyperscaler deals signed yet. Potential JV similar to TeraWulf/Fluidstack model", notes: "Largest power footprint of any ex-miner (1.7 GW). TX ERCOT advantage. Slow AI pivot but massive power optionality at ~$0.03-0.04/kWh.", color: "#D97706" },
  { name: "CleanSpark", ticker: "CLSK", status: "Public (Nasdaq)", valuation: "$4B+", founded: 2014, hq: "Henderson, NV",
    power: { connected: "~700 MW", contracted: "~1 GW+" }, powerType: "Grid (GA, MS, TN, WY)",
    keyClients: "Pure Bitcoin mining (exploring AI)", backlog: "N/A (no AI contracts yet)",
    contracts: "No AI hosting contracts yet · Evaluating HPC/AI opportunities · Multiple southern US sites",
    revenue: "$150M+ quarterly (mining)", locations: "GA (multiple), MS, TN, WY — 20+ sites",
    timeline: "AI evaluation phase · Potential 2026-2027 pivot",
    ecosystem: "No hyperscaler or neocloud partnerships announced. Pure Bitcoin mining. Conversion optionality only", notes: "Second-largest mining fleet. 700+ MW of power but 100% mining today. Massive conversion optionality if mining economics worsen.", color: "#94A3B8" },
  { name: "Marathon Digital", ticker: "MARA", status: "Public (Nasdaq)", valuation: "$6B+", founded: 2010, hq: "Fort Lauderdale, FL",
    power: { connected: "~1.1 GW", contracted: "~1.5 GW" }, powerType: "Grid + renewables (global)",
    keyClients: "Pure Bitcoin mining (exploring AI)", backlog: "N/A (exploring)",
    contracts: "No major AI contracts · Exploring AI/HPC joint ventures · Kaspa mining diversification",
    revenue: "$252M quarterly (mining)", locations: "TX, NE, OH, ND, UAE, Paraguay — global",
    timeline: "AI exploration phase",
    ecosystem: "No AI/HPC partnerships. Exploring JV opportunities. Kaspa mining diversification. Global but no hyperscaler relationships", notes: "Largest BTC miner by market cap. 44.9% gross margins (mining). Global power portfolio but no AI pivot yet.", color: "#64748B" },
  { name: "Solaris Energy", ticker: "SEI", status: "Public (Nasdaq)", valuation: "$2B+", founded: 2021, hq: "Houston, TX",
    power: { connected: "~600 MW", contracted: "~1.2 GW" }, powerType: "Natural gas turbines (mobile + permanent)",
    keyClients: "xAI (67% of orderbook), oil & gas, data centers", backlog: "67% xAI/Colossus",
    contracts: "600 MW+ fleet for xAI Colossus · Mobile natural gas power · Behind-the-meter generation for DCs",
    revenue: "~$100M+ est.", locations: "Memphis TN (xAI Colossus), TX, various DC sites",
    timeline: "600 MW deployed · 1.2 GW by 2027",
    ecosystem: "xAI (67% of orderbook — primary client), Tesla (Megapack co-deployment at Colossus). Elon Musk ecosystem concentration risk", notes: "Behind-the-meter power specialist. 67% of orders from xAI. Gas turbine fleet deploys in months vs years for grid. Key Colossus power partner.", color: "#F97316" },
  { name: "Constellation Energy", ticker: "CEG", status: "Public (Nasdaq)", valuation: "$85B+", founded: 2022, hq: "Baltimore, MD",
    power: { connected: "~32 GW fleet", contracted: "Multi-GW DC deals" }, powerType: "Nuclear fleet (largest US operator)",
    keyClients: "Microsoft (Three Mile Island restart), hyperscalers", backlog: "Multi-billion (MSFT + others)",
    contracts: "Microsoft 20-yr PPA (Three Mile Island restart, 835 MW) · Nuclear-powered DC PPAs with multiple hyperscalers",
    revenue: "$6B+ annually", locations: "PA, IL, NY, MD, NJ — 21 nuclear reactors across US",
    timeline: "Three Mile Island restart ~2028 · Ongoing nuclear PPAs",
    ecosystem: "Microsoft (20-yr Three Mile Island PPA, 835 MW — largest single AI power deal), multiple hyperscaler nuclear PPAs. No equity stakes — utility model", notes: "Largest US nuclear fleet (32 GW). Only proven path to GW-scale zero-carbon baseload for AI DCs. Premium to grid pricing but 24/7 reliability.", color: "#06B6D4" },
  { name: "Vistra", ticker: "VST", status: "Public (NYSE)", valuation: "$55B+", founded: 2016, hq: "Irving, TX",
    power: { connected: "~41 GW fleet", contracted: "Multi-GW DC deals" }, powerType: "Nuclear + gas + solar",
    keyClients: "ERCOT grid, hyperscalers (behind-meter PPAs)", backlog: "Multi-billion",
    contracts: "Comanche Peak nuclear (2.3 GW) · Multiple gas-fired behind-meter DC deals · Amazon/Microsoft rumored",
    revenue: "$17B+ (FY2025)", locations: "TX (ERCOT), PA, OH, IL — diverse fleet",
    timeline: "Comanche Peak uprate + new gas capacity 2026-2028",
    ecosystem: "Hyperscaler PPAs rumored. No confirmed equity stakes. ERCOT positioning for TX AI corridor", notes: "2nd largest US nuclear operator. ERCOT exposure = direct TX AI boom play. +300% in 2025. Gas peakers for behind-meter.", color: "#EF4444" },
  { name: "Talen Energy", ticker: "TLN", status: "Public (Nasdaq)", valuation: "$12B+", founded: 2015, hq: "Houston, TX",
    power: { connected: "~13 GW fleet", contracted: "960 MW sold to AWS" }, powerType: "Nuclear + gas",
    keyClients: "Amazon/AWS (Susquehanna campus)", backlog: "$650M (AWS deal)",
    contracts: "Sold 960 MW Susquehanna nuclear campus to AWS for $650M (Mar 2024) · Cumulus Data (DC co-located with nuclear)",
    revenue: "$3.5B+ (FY2025)", locations: "PA (Susquehanna nuclear), MT, TX",
    timeline: "AWS Susquehanna DC operational 2025 · Expanding Cumulus Data",
    ecosystem: "Amazon/AWS (direct nuclear-to-DC sale, landmark deal). Cumulus Data subsidiary for co-located DC+power", notes: "First major nuclear-to-AI DC deal. Susquehanna sale validated nuclear+DC model. IPO'd from bankruptcy 2023.", color: "#F59E0B" },
  { name: "Oklo", ticker: "OKLO", status: "Public (NYSE)", valuation: "$5B+", founded: 2013, hq: "Santa Clara, CA",
    power: { connected: "0 MW (pre-revenue)", contracted: "~2 GW pipeline" }, powerType: "Advanced nuclear (SMR)",
    keyClients: "DOD, Equinix, Switch (signed LOIs)", backlog: "2 GW pipeline (LOIs/MOUs)",
    contracts: "Equinix 500 MW LOI · Switch 12 GW LOI · DOE fuel recycling agreement · Sam Altman chairman",
    revenue: "Pre-revenue", locations: "Idaho (INL site), OH, TX planned",
    timeline: "First reactor ~2027 · Commercial scale 2028-2030",
    ecosystem: "Sam Altman (OpenAI) is Chairman. Equinix, Switch LOIs. DOE fuel recycling partnership. ARC Holdings (Altman's fund) largest investor", notes: "Sam Altman-backed SMR play. Pre-revenue but 2 GW pipeline. Only fission power company with NRC application. AI power optionality.", color: "#8B5CF6" },
  { name: "NRG Energy", ticker: "NRG", status: "Public (NYSE)", valuation: "$22B+", founded: 2003, hq: "Houston, TX",
    power: { connected: "~23 GW fleet", contracted: "DC PPAs growing" }, powerType: "Gas + nuclear + solar + wind",
    keyClients: "Enterprise, retail, hyperscaler PPAs", backlog: "Multi-billion",
    contracts: "Behind-meter gas generation for TX DCs · Corporate PPAs growing · Vivint retail power",
    revenue: "$34B+ (FY2025)", locations: "TX, CT, DE, MD, NJ, NY, PA, IL",
    timeline: "Expanding DC-specific PPAs 2026+",
    ecosystem: "Large diversified power generator. TX ERCOT presence. Growing DC PPA business. Retail + wholesale model", notes: "Largest competitive power generator in US. ERCOT TX exposure for AI data center corridor. Diversified fuel mix.", color: "#10B981" },
  { name: "NextEra Energy", ticker: "NEE", status: "Public (NYSE)", valuation: "$160B+", founded: 1925, hq: "Juno Beach, FL",
    power: { connected: "~70 GW (FPL + NEER)", contracted: "Multi-GW renewables backlog" }, powerType: "Renewables (solar/wind) + nuclear + gas",
    keyClients: "Utilities, hyperscalers (renewables PPAs)", backlog: "$24B+ renewables backlog",
    contracts: "Largest renewable energy generator globally · Google, Amazon, Meta renewable PPAs",
    revenue: "$28B+ (FY2025)", locations: "FL (FPL utility), national renewables",
    timeline: "Adding 20+ GW renewables 2025-2028",
    ecosystem: "Hyperscaler renewable PPAs (Google, Amazon, Meta). Florida Power & Light utility. NextEra Energy Partners (NEP) subsidiary", notes: "Largest renewable generator globally. AI DCs need green PPAs for ESG commitments. Indirect but growing AI exposure.", color: "#84CC16" },
  { name: "GE Vernova", ticker: "GEV", status: "Public (NYSE)", valuation: "$85B+", founded: 2024, hq: "Cambridge, MA",
    power: { connected: "Equip supplier", contracted: "N/A" }, powerType: "Gas turbines + grid equipment + nuclear services",
    keyClients: "Utilities, DC developers, hyperscalers", backlog: "$50B+ equipment backlog",
    contracts: "Gas turbine orders surging for DC backup/primary power · Grid transformers sold out through 2028",
    revenue: "$36B+ (FY2025)", locations: "Global manufacturing",
    timeline: "Gas turbine capacity expanding 2026-2028 · Grid transformer backlog 3+ years",
    ecosystem: "Sole-source or duopoly for heavy-duty gas turbines (with Siemens Energy). Grid transformers critical bottleneck for AI DC grid connections", notes: "Grid equipment bottleneck play. Transformers sold out 3+ yrs. Every GW of AI DC needs grid upgrades. GE Vernova spun off from GE Apr 2024.", color: "#3B82F6" },
  { name: "Vertiv", ticker: "VRT", status: "Public (NYSE)", valuation: "$45B+", founded: 2000, hq: "Columbus, OH",
    power: { connected: "Equip supplier", contracted: "N/A" }, powerType: "DC power/cooling/management infrastructure",
    keyClients: "All hyperscalers, DC operators, neoclouds", backlog: "$7B+ orders",
    contracts: "Power distribution, UPS, thermal management, monitoring for AI DCs · Liquid cooling for GPU racks",
    revenue: "$8.5B+ (FY2025, +18% YoY)", locations: "Global (200+ service centers, 35+ countries)",
    timeline: "Liquid cooling revenue 3x 2025 · AI DC demand accelerating",
    ecosystem: "Every AI DC uses Vertiv equipment. NVIDIA-recommended cooling partner. Liquid cooling for GB200/Vera Rubin racks is critical", notes: "Picks-and-shovels AI infrastructure. Liquid cooling is the constraint for next-gen GPUs. +150% in 2024. S&P 500 added.", color: "#F59E0B" },
  { name: "Eaton Corp", ticker: "ETN", status: "Public (NYSE)", valuation: "$130B+", founded: 1911, hq: "Dublin, Ireland",
    power: { connected: "Equip supplier", contracted: "N/A" }, powerType: "Electrical distribution + UPS + switchgear",
    keyClients: "All DC developers, hyperscalers, utilities", backlog: "$14B+ (electrical segment)",
    contracts: "Power distribution units, switchgear, UPS for AI DCs · Record electrical backlog",
    revenue: "$24B+ (FY2025)", locations: "Global manufacturing + distribution",
    timeline: "Data center electrical segment +25% YoY growth 2025-2027",
    ecosystem: "Every DC needs Eaton electrical infrastructure. Growing AI DC content per MW. Transformers, switchgear, PDUs are supply-constrained", notes: "Broad industrial conglomerate with growing DC exposure. DC electrical content growing from $30M/MW to $50M+/MW. Record backlogs.", color: "#A855F7" },
  { name: "Bloom Energy", ticker: "BE", status: "Public (NYSE)", valuation: "$8B+", founded: 2001, hq: "San Jose, CA",
    power: { connected: "~1 GW deployed", contracted: "Growing DC pipeline" }, powerType: "Solid oxide fuel cells (nat gas / hydrogen)",
    keyClients: "AI DC developers, behind-meter power", backlog: "$5B+",
    contracts: "Fuel cell power for off-grid / behind-meter AI DCs · 24/7 baseload alternative to grid · AES partnership",
    revenue: "$1.5B+ (FY2025)", locations: "Global deployments, US manufacturing",
    timeline: "AI DC fuel cell orders accelerating 2026+",
    ecosystem: "Alternative to grid power for constrained AI DC sites. AES partnership for 1 GW+ DC power. Behind-meter bridge while grid builds out", notes: "AI DC power bridge play. Grid connection takes 3-5 yrs; fuel cells deploy in months. Behind-meter for time-to-power advantage.", color: "#DC2626" },
];

const ETF_SENS_RETURNS = {
  SMH:  { "1D": 1.5, "1W": 1.5, YTD: 8.0, "1Y": 68.5, "3Y": 15.0 },
  SOXX: { "1D": 2.0, "1W": 1.0, YTD: 39.7, "1Y": 70.3, "3Y": 13.5 },
  FLKR: { "1D": 5.9, "1W": -5.4, YTD: 85.0, "1Y": 141.2, "3Y": 36.0 },
};

// ETF Sensitivity Data: Top 10 constituents, sector breakdown, ETF-level metrics
const ETF_SENSITIVITY = {
  SMH: {
    name: "VanEck Semiconductor ETF", price: 374.25, ltmPe: 38.4, fwdPe: 0, ltmEps: 9.74, fwdEps: 0, beta1Y: 1.55, beta3Y: 1.67,
    sectors: [
      { name: "Equipment", weight: 23.4, color: "#F59E0B" },
      { name: "AI / GPU", weight: 22.4, color: "#3B82F6" },
      { name: "Foundry", weight: 11.3, color: "#06B6D4" },
      { name: "Analog", weight: 9.7, color: "#F97316" },
      { name: "Networking", weight: 6.5, color: "#8B5CF6" },
      { name: "Memory", weight: 6.5, color: "#A855F7" },
      { name: "EDA", weight: 4.7, color: "#EF4444" },
      { name: "IDM", weight: 4.4, color: "#10B981" },
      { name: "Mobile", weight: 3.2, color: "#14B8A6" },
      { name: "Auto/IoT", weight: 1.8, color: "#6366F1" },
      { name: "Power", weight: 1.0, color: "#84CC16" },
      { name: "MCU", weight: 1.0, color: "#22D3EE" },
      { name: "RF", weight: 0.4, color: "#1E40AF" },
      { name: "Display", weight: 0.1, color: "#F59E0B" },
    ],
    holdings: [
      { ticker: "NVDA", name: "NVIDIA Corp", weight: 18.25, price: 174.60, ltmEps: 4.90, fwdEps: 8.67, ltmPe: 35.6, fwdPe: 20.1, sector: "AI / GPU", sectorColor: "#3B82F6" },
      { ticker: "TSM", name: "Taiwan Semiconductor", weight: 11.27, price: 332.00, ltmEps: 10.41, fwdEps: 15.96, ltmPe: 31.9, fwdPe: 20.8, sector: "Foundry", sectorColor: "#06B6D4" },
      { ticker: "AVGO", name: "Broadcom Inc", weight: 6.88, price: 315.80, ltmEps: 5.09, fwdEps: 11.45, ltmPe: 62.0, fwdPe: 27.6, sector: "Networking", sectorColor: "#8B5CF6" },
      { ticker: "MU", name: "Micron Technology", weight: 6.47, price: 376.30, ltmEps: 21.46, fwdEps: 30.52, ltmPe: 17.5, fwdPe: 12.3, sector: "Memory", sectorColor: "#A855F7" },
      { ticker: "ASML", name: "ASML Holding NV", weight: 5.84, price: 1394.00, ltmEps: 29.03, fwdEps: 28.06, ltmPe: 48.0, fwdPe: 49.7, sector: "Equipment", sectorColor: "#F59E0B" },
      { ticker: "LRCX", name: "Lam Research", weight: 5.68, price: 216.64, ltmEps: 4.53, fwdEps: 11.11, ltmPe: 47.8, fwdPe: 19.5, sector: "Equipment", sectorColor: "#F59E0B" },
      { ticker: "AMAT", name: "Applied Materials", weight: 5.12, price: 352.88, ltmEps: 11.38, fwdEps: 12.79, ltmPe: 31.0, fwdPe: 27.6, sector: "Equipment", sectorColor: "#F59E0B" },
      { ticker: "KLAC", name: "KLA Corporation", weight: 4.92, price: 1467.45, ltmEps: 32.68, fwdEps: 69.09, ltmPe: 44.9, fwdPe: 21.2, sector: "Equipment", sectorColor: "#F59E0B" },
      { ticker: "ADI", name: "Analog Devices", weight: 4.02, price: 316.18, ltmEps: 5.38, fwdEps: 9.91, ltmPe: 58.8, fwdPe: 31.9, sector: "Analog", sectorColor: "#F97316" },
      { ticker: "AMD", name: "Advanced Micro Devices", weight: 3.90, price: 205.29, ltmEps: 3.83, fwdEps: 6.39, ltmPe: 53.6, fwdPe: 32.1, sector: "AI / GPU", sectorColor: "#3B82F6" },
      { ticker: "QCOM", name: "Qualcomm Inc", weight: 3.75, price: 130.89, ltmEps: 4.92, fwdEps: 8.96, ltmPe: 26.6, fwdPe: 14.6, sector: "Mobile", sectorColor: "#14B8A6" },
      { ticker: "MRVL", name: "Marvell Technology", weight: 3.50, price: 97.92, ltmEps: 3.25, fwdEps: 2.94, ltmPe: 30.1, fwdPe: 33.3, sector: "Networking", sectorColor: "#8B5CF6" },
      { ticker: "NXPI", name: "NXP Semiconductors", weight: 2.80, price: 198.67, ltmEps: 8.04, fwdEps: 14.39, ltmPe: 24.7, fwdPe: 13.8, sector: "Auto/IoT", sectorColor: "#6366F1" },
      { ticker: "TXN", name: "Texas Instruments", weight: 2.50, price: 195.83, ltmEps: 5.42, fwdEps: 7.01, ltmPe: 36.1, fwdPe: 27.9, sector: "Analog", sectorColor: "#F97316" },
      { ticker: "INTC", name: "Intel Corp", weight: 2.00, price: 47.00, ltmEps: -0.15, fwdEps: 0.50, ltmPe: 0, fwdPe: 94.0, sector: "IDM", sectorColor: "#10B981" },
      { ticker: "ARM", name: "Arm Holdings", weight: 2.40, price: 154.80, ltmEps: 0.74, fwdEps: 2.14, ltmPe: 209.2, fwdPe: 72.4, sector: "AI / GPU", sectorColor: "#3B82F6" },
      { ticker: "SNPS", name: "Synopsys Inc", weight: 1.50, price: 401.95, ltmEps: 6.51, fwdEps: 17.06, ltmPe: 61.7, fwdPe: 23.6, sector: "EDA", sectorColor: "#EF4444" },
      { ticker: "CDNS", name: "Cadence Design", weight: 1.30, price: 280.62, ltmEps: 4.07, fwdEps: 9.41, ltmPe: 68.9, fwdPe: 29.8, sector: "EDA", sectorColor: "#EF4444" },
      { ticker: "MPWR", name: "Monolithic Power", weight: 1.20, price: 1058.28, ltmEps: 12.91, fwdEps: 25.85, ltmPe: 82.0, fwdPe: 40.9, sector: "Power", sectorColor: "#84CC16" },
      { ticker: "ON", name: "ON Semiconductor", weight: 1.10, price: 60.87, ltmEps: 0.29, fwdEps: 4.03, ltmPe: 209.9, fwdPe: 15.1, sector: "Power", sectorColor: "#84CC16" },
      { ticker: "CRDO", name: "Credo Technology", weight: 1.00, price: 96.44, ltmEps: 1.82, fwdEps: 4.72, ltmPe: 53.0, fwdPe: 20.4, sector: "Networking", sectorColor: "#8B5CF6" },
      { ticker: "MCHP", name: "Microchip Technology", weight: 0.90, price: 64.20, ltmEps: -1.08, fwdEps: 2.66, ltmPe: 0, fwdPe: 24.1, sector: "MCU", sectorColor: "#22D3EE" },
      { ticker: "GFS", name: "GlobalFoundries", weight: 0.80, price: 44.57, ltmEps: 1.59, fwdEps: 2.37, ltmPe: 28.0, fwdPe: 18.8, sector: "Foundry", sectorColor: "#06B6D4" },
      { ticker: "SWKS", name: "Skyworks Solutions", weight: 0.60, price: 56.66, ltmEps: 2.61, fwdEps: 4.99, ltmPe: 21.7, fwdPe: 11.4, sector: "RF", sectorColor: "#1E40AF" },
      { ticker: "ENTG", name: "Entegris Inc", weight: 0.50, price: 115.75, ltmEps: 1.55, fwdEps: 4.39, ltmPe: 74.7, fwdPe: 26.4, sector: "Equipment", sectorColor: "#F59E0B" },
    ],
  },
  SOXX: {
    name: "iShares Semiconductor ETF", price: 323.48, ltmPe: 39.7, fwdPe: 0, ltmEps: 8.15, fwdEps: 0, beta1Y: 1.60, beta3Y: 1.72,
    sectors: [
      { name: "AI / GPU", weight: 13.8, color: "#3B82F6" },
      { name: "Memory", weight: 14.9, color: "#A855F7" },
      { name: "Equipment", weight: 19.8, color: "#F59E0B" },
      { name: "Foundry", weight: 5.5, color: "#06B6D4" },
      { name: "Analog", weight: 10.2, color: "#F97316" },
      { name: "Networking", weight: 9.5, color: "#8B5CF6" },
      { name: "IDM", weight: 6.0, color: "#10B981" },
      { name: "EDA", weight: 5.8, color: "#EF4444" },
      { name: "Mobile", weight: 4.5, color: "#14B8A6" },
      { name: "Auto/IoT", weight: 3.5, color: "#6366F1" },
      { name: "Power", weight: 2.5, color: "#84CC16" },
      { name: "Other", weight: 4.0, color: "#94A3B8" },
    ],
    holdings: [
      { ticker: "MU", name: "Micron Technology", weight: 8.61, price: 357.22, ltmEps: 21.14, fwdEps: 99.23, ltmPe: 16.9, fwdPe: 3.6, sector: "Memory", sectorColor: "#A855F7" },
      { ticker: "AMAT", name: "Applied Materials", weight: 7.29, price: 337.17, ltmEps: 9.74, fwdEps: 13.82, ltmPe: 34.6, fwdPe: 24.4, sector: "Equipment", sectorColor: "#F59E0B" },
      { ticker: "NVDA", name: "NVIDIA Corp", weight: 6.71, price: 167.52, ltmEps: 4.91, fwdEps: 11.10, ltmPe: 34.1, fwdPe: 15.1, sector: "AI / GPU", sectorColor: "#3B82F6" },
      { ticker: "AMD", name: "Advanced Micro Devices", weight: 6.17, price: 201.99, ltmEps: 2.61, fwdEps: 10.74, ltmPe: 77.4, fwdPe: 18.8, sector: "AI / GPU", sectorColor: "#3B82F6" },
      { ticker: "AVGO", name: "Broadcom Inc", weight: 5.32, price: 300.68, ltmEps: 5.14, fwdEps: 17.79, ltmPe: 58.5, fwdPe: 16.9, sector: "Networking", sectorColor: "#8B5CF6" },
      { ticker: "LRCX", name: "Lam Research", weight: 5.03, price: 211.41, ltmEps: 4.86, fwdEps: 6.91, ltmPe: 43.5, fwdPe: 30.6, sector: "Equipment", sectorColor: "#F59E0B" },
      { ticker: "ADI", name: "Analog Devices", weight: 4.50, price: 307.44, ltmEps: 5.47, fwdEps: 12.92, ltmPe: 56.2, fwdPe: 23.8, sector: "Analog", sectorColor: "#F97316" },
      { ticker: "KLAC", name: "KLA Corporation", weight: 4.35, price: 1443.21, ltmEps: 34.36, fwdEps: 47.63, ltmPe: 42.0, fwdPe: 30.3, sector: "Equipment", sectorColor: "#F59E0B" },
      { ticker: "ASML", name: "ASML Holding NV", weight: 4.31, price: 1302.47, ltmEps: 28.52, fwdEps: 43.30, ltmPe: 45.7, fwdPe: 30.1, sector: "Equipment", sectorColor: "#F59E0B" },
      { ticker: "TER", name: "Teradyne Inc", weight: 4.29, price: 295.61, ltmEps: 3.46, fwdEps: 8.23, ltmPe: 85.4, fwdPe: 35.9, sector: "Equipment", sectorColor: "#F59E0B" },
      { ticker: "QCOM", name: "Qualcomm Inc", weight: 4.10, price: 127.11, ltmEps: 4.96, fwdEps: 11.15, ltmPe: 25.6, fwdPe: 11.4, sector: "Mobile", sectorColor: "#14B8A6" },
      { ticker: "MRVL", name: "Marvell Technology", weight: 3.80, price: 94.88, ltmEps: 3.07, fwdEps: 5.45, ltmPe: 30.9, fwdPe: 17.4, sector: "Networking", sectorColor: "#8B5CF6" },
      { ticker: "TSM", name: "Taiwan Semiconductor", weight: 3.60, price: 326.74, ltmEps: 10.37, fwdEps: 17.95, ltmPe: 31.5, fwdPe: 18.2, sector: "Foundry", sectorColor: "#06B6D4" },
      { ticker: "TXN", name: "Texas Instruments", weight: 3.50, price: 190.33, ltmEps: 5.44, fwdEps: 7.91, ltmPe: 35.0, fwdPe: 24.1, sector: "Analog", sectorColor: "#F97316" },
      { ticker: "SNPS", name: "Synopsys Inc", weight: 3.00, price: 380.47, ltmEps: 6.51, fwdEps: 17.06, ltmPe: 58.4, fwdPe: 22.3, sector: "EDA", sectorColor: "#EF4444" },
      { ticker: "CDNS", name: "Cadence Design", weight: 2.70, price: 271.77, ltmEps: 4.05, fwdEps: 9.41, ltmPe: 67.1, fwdPe: 28.9, sector: "EDA", sectorColor: "#EF4444" },
      { ticker: "NXPI", name: "NXP Semiconductors", weight: 2.60, price: 191.66, ltmEps: 7.95, fwdEps: 16.74, ltmPe: 24.1, fwdPe: 11.4, sector: "Auto/IoT", sectorColor: "#6366F1" },
      { ticker: "ON", name: "ON Semiconductor", weight: 2.40, price: 58.35, ltmEps: 0.29, fwdEps: 4.02, ltmPe: 201.2, fwdPe: 14.5, sector: "Power", sectorColor: "#84CC16" },
      { ticker: "MPWR", name: "Monolithic Power", weight: 2.10, price: 1053.01, ltmEps: 12.86, fwdEps: 25.87, ltmPe: 81.9, fwdPe: 40.7, sector: "Power", sectorColor: "#84CC16" },
      { ticker: "ARM", name: "Arm Holdings", weight: 1.90, price: 144.13, ltmEps: 0.75, fwdEps: 2.14, ltmPe: 192.2, fwdPe: 67.4, sector: "AI / GPU", sectorColor: "#3B82F6" },
      { ticker: "INTC", name: "Intel Corp", weight: 1.80, price: 43.13, ltmEps: 0, fwdEps: 0.99, ltmPe: 0, fwdPe: 43.5, sector: "IDM", sectorColor: "#10B981" },
      { ticker: "CRDO", name: "Credo Technology", weight: 1.60, price: 95.24, ltmEps: 1.82, fwdEps: 4.72, ltmPe: 52.3, fwdPe: 20.2, sector: "Networking", sectorColor: "#8B5CF6" },
      { ticker: "MCHP", name: "Microchip Technology", weight: 1.40, price: 62.00, ltmEps: 0, fwdEps: 2.66, ltmPe: 0, fwdPe: 23.3, sector: "MCU", sectorColor: "#22D3EE" },
      { ticker: "ENTG", name: "Entegris Inc", weight: 1.30, price: 113.59, ltmEps: 1.54, fwdEps: 4.39, ltmPe: 73.8, fwdPe: 25.9, sector: "Equipment", sectorColor: "#F59E0B" },
      { ticker: "GFS", name: "GlobalFoundries", weight: 1.20, price: 42.94, ltmEps: 1.59, fwdEps: 2.37, ltmPe: 27.0, fwdPe: 18.1, sector: "Foundry", sectorColor: "#06B6D4" },
      { ticker: "MKSI", name: "MKS Instruments", weight: 1.10, price: 223.18, ltmEps: 4.37, fwdEps: 12.00, ltmPe: 51.1, fwdPe: 18.6, sector: "Equipment", sectorColor: "#F59E0B" },
      { ticker: "SWKS", name: "Skyworks Solutions", weight: 1.00, price: 53.65, ltmEps: 2.61, fwdEps: 4.99, ltmPe: 20.6, fwdPe: 10.8, sector: "RF", sectorColor: "#1E40AF" },
      { ticker: "RMBS", name: "Rambus Inc", weight: 0.90, price: 89.73, ltmEps: 2.11, fwdEps: 3.52, ltmPe: 42.5, fwdPe: 25.5, sector: "Memory", sectorColor: "#A855F7" },
      { ticker: "LSCC", name: "Lattice Semiconductor", weight: 0.80, price: 90.39, ltmEps: 0.02, fwdEps: 2.00, ltmPe: 0, fwdPe: 45.1, sector: "FPGA", sectorColor: "#14B8A6" },
      { ticker: "ALAB", name: "Astera Labs", weight: 1.36, price: 112.47, ltmEps: 1.21, fwdEps: 3.53, ltmPe: 93.0, fwdPe: 31.9, sector: "Networking", sectorColor: "#8B5CF6" },
      { ticker: "MTSI", name: "MACOM Technology", weight: 1.35, price: 225.44, ltmEps: 2.21, fwdEps: 5.57, ltmPe: 102.0, fwdPe: 40.5, sector: "RF", sectorColor: "#1E40AF" },
      { ticker: "NVMI", name: "Nova Ltd", weight: 1.27, price: 440.72, ltmEps: 7.94, fwdEps: 12.49, ltmPe: 55.5, fwdPe: 35.3, sector: "Equipment", sectorColor: "#F59E0B" },
      { ticker: "ASX", name: "ASE Technology", weight: 0.97, price: 21.50, ltmEps: 0.56, fwdEps: 1.20, ltmPe: 38.4, fwdPe: 17.9, sector: "IDM", sectorColor: "#10B981" },
      { ticker: "QRVO", name: "Qorvo Inc", weight: 0.70, price: 77.35, ltmEps: 3.63, fwdEps: 6.73, ltmPe: 21.3, fwdPe: 11.5, sector: "RF", sectorColor: "#1E40AF" },
      { ticker: "CRUS", name: "Cirrus Logic", weight: 0.65, price: 143.39, ltmEps: 7.59, fwdEps: 9.19, ltmPe: 18.9, fwdPe: 15.6, sector: "Analog", sectorColor: "#F97316" },
      { ticker: "AMKR", name: "Amkor Technology", weight: 0.55, price: 44.45, ltmEps: 1.50, fwdEps: 2.29, ltmPe: 29.6, fwdPe: 19.4, sector: "IDM", sectorColor: "#10B981" },
      { ticker: "WOLF", name: "Wolfspeed Inc", weight: 0.45, price: 15.44, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Power", sectorColor: "#84CC16" },
      { ticker: "ALGM", name: "Allegro MicroSystems", weight: 0.35, price: 30.12, ltmEps: 0, fwdEps: 0.94, ltmPe: 0, fwdPe: 32.0, sector: "Analog", sectorColor: "#F97316" },
    ],
  },
  FLKR: {
    name: "Franklin FTSE South Korea ETF", price: 39.29, ltmPe: 15.8, fwdPe: 0, ltmEps: 2.49, fwdEps: 0, beta1Y: 1.08, beta3Y: 1.15,
    sectors: [
      { name: "Semiconductors", weight: 44.0, color: "#3B82F6" },
      { name: "Automotive", weight: 10.5, color: "#8B5CF6" },
      { name: "Financials", weight: 10.0, color: "#10B981" },
      { name: "Industrials", weight: 8.5, color: "#06B6D4" },
      { name: "Communication Svc", weight: 5.5, color: "#F59E0B" },
      { name: "Materials", weight: 5.0, color: "#F97316" },
      { name: "Healthcare", weight: 4.5, color: "#EF4444" },
      { name: "Energy", weight: 3.5, color: "#84CC16" },
      { name: "Consumer", weight: 3.5, color: "#14B8A6" },
      { name: "Other", weight: 5.0, color: "#94A3B8" },
    ],
    holdings: [
      // Prices in KRW from Yahoo Finance (3/27/26). P/E populated on live refresh.
      { ticker: "005930", name: "Samsung Electronics", weight: 22.27, price: 179700, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Semiconductors", sectorColor: "#3B82F6" },
      { ticker: "000660", name: "SK Hynix", weight: 20.88, price: 922000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Semiconductors", sectorColor: "#3B82F6" },
      { ticker: "005380", name: "Hyundai Motor", weight: 3.31, price: 495000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Automotive", sectorColor: "#8B5CF6" },
      { ticker: "005935", name: "Samsung Elec Pref", weight: 2.56, price: 126200, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Semiconductors", sectorColor: "#3B82F6" },
      { ticker: "402340", name: "SK Square", weight: 2.10, price: 544000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Semiconductors", sectorColor: "#3B82F6" },
      { ticker: "105560", name: "KB Financial Group", weight: 2.06, price: 152200, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: "#10B981" },
      { ticker: "000270", name: "Kia Corporation", weight: 1.77, price: 155800, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Automotive", sectorColor: "#8B5CF6" },
      { ticker: "034020", name: "Doosan Enerbility", weight: 1.71, price: 98100, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "055550", name: "Shinhan Financial", weight: 1.50, price: 93500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: "#10B981" },
      { ticker: "012450", name: "Hanwha Aerospace", weight: 1.48, price: 1335000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "035420", name: "Naver Corp", weight: 1.45, price: 212500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Communication Svc", sectorColor: "#F59E0B" },
      { ticker: "012330", name: "Hyundai Mobis", weight: 1.40, price: 408500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Automotive", sectorColor: "#8B5CF6" },
      { ticker: "068270", name: "Celltrion Inc", weight: 1.31, price: 206000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Healthcare", sectorColor: "#EF4444" },
      { ticker: "086790", name: "Hana Financial Group", weight: 1.29, price: 110400, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: "#10B981" },
      { ticker: "086280", name: "Hyundai Glovis", weight: 1.20, price: 231500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "005490", name: "POSCO Holdings", weight: 1.12, price: 343000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "096770", name: "SK Innovation", weight: 1.15, price: 111400, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Energy", sectorColor: "#84CC16" },
      { ticker: "066570", name: "LG Electronics", weight: 1.10, price: 112000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Consumer", sectorColor: "#14B8A6" },
      { ticker: "028260", name: "Samsung C&T", weight: 1.05, price: 269000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "003670", name: "POSCO Future M", weight: 1.00, price: 209000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "373220", name: "LG Energy Solution", weight: 0.95, price: 394500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "329180", name: "HD Hyundai Heavy Ind", weight: 0.90, price: 498500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "009150", name: "Samsung Electro-Mech", weight: 0.88, price: 434000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Semiconductors", sectorColor: "#3B82F6" },
      { ticker: "006400", name: "Samsung SDI", weight: 1.08, price: 405500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "267260", name: "HD Hyundai Electric", weight: 0.96, price: 915000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "207940", name: "Samsung Biologics", weight: 0.83, price: 1606000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Healthcare", sectorColor: "#EF4444" },
      { ticker: "032830", name: "Samsung Life", weight: 0.79, price: 223000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: "#10B981" },
      { ticker: "259960", name: "Krafton", weight: 0.80, price: 254500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Communication Svc", sectorColor: "#F59E0B" },
      { ticker: "009540", name: "HD Korea Shipbuilding", weight: 0.76, price: 367000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "010140", name: "Samsung Heavy Ind", weight: 0.75, price: 26000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "010130", name: "Korea Zinc", weight: 0.72, price: 1483000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "017670", name: "SK Telecom", weight: 0.72, price: 79900, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Communication Svc", sectorColor: "#F59E0B" },
      { ticker: "034730", name: "SK Inc", weight: 0.70, price: 334000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "051910", name: "LG Chem", weight: 0.68, price: 313000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "000810", name: "Samsung Fire & Marine", weight: 0.65, price: 443000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: "#10B981" },
      { ticker: "018260", name: "Samsung SDS", weight: 0.62, price: 156300, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Semiconductors", sectorColor: "#3B82F6" },
      { ticker: "030200", name: "KT Corp", weight: 0.60, price: 60800, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Communication Svc", sectorColor: "#F59E0B" },
      { ticker: "003490", name: "Korean Air", weight: 0.58, price: 25300, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "035720", name: "Kakao Corp", weight: 0.55, price: 48800, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Communication Svc", sectorColor: "#F59E0B" },
      { ticker: "316140", name: "Woori Financial Group", weight: 0.52, price: 33600, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: "#10B981" },
      { ticker: "036570", name: "NCsoft", weight: 0.50, price: 230000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Communication Svc", sectorColor: "#F59E0B" },
      { ticker: "180640", name: "Hanjin KAL", weight: 0.48, price: 117200, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "011200", name: "HMM Co", weight: 0.45, price: 19660, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "033780", name: "KT&G", weight: 0.43, price: 158000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Consumer", sectorColor: "#14B8A6" },
      { ticker: "352820", name: "HYBE", weight: 0.42, price: 307000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Communication Svc", sectorColor: "#F59E0B" },
      { ticker: "003550", name: "LG Corp", weight: 0.40, price: 89000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "047050", name: "POSCO International", weight: 0.38, price: 74500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "326030", name: "SK Biopharmaceuticals", weight: 0.36, price: 100300, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Healthcare", sectorColor: "#EF4444" },
      { ticker: "097950", name: "CJ CheilJedang", weight: 0.34, price: 214500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Consumer", sectorColor: "#14B8A6" },
      { ticker: "011170", name: "Lotte Chemical", weight: 0.32, price: 82700, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "161390", name: "Hankook Tire", weight: 0.30, price: 58000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Automotive", sectorColor: "#8B5CF6" },
      { ticker: "323410", name: "KakaoBank", weight: 0.28, price: 24650, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: "#10B981" },
      { ticker: "377300", name: "KakaoPay", weight: 0.26, price: 53500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: "#10B981" },
      { ticker: "138930", name: "BNK Financial Group", weight: 0.24, price: 18680, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: "#10B981" },
      { ticker: "024110", name: "Industrial Bank of Korea", weight: 0.22, price: 23550, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: "#10B981" },
    ],
  },
};

// TYPE_COLORS stub for badge style function
const TYPE_COLORS = {
  ETF: { bg: "#E8F4FD", text: "#1565C0", border: "#90CAF9" },
  Stock: { bg: "#F3E8FD", text: "#7B1FA2", border: "#CE93D8" },
  "Money Market": { bg: "#E8F5E9", text: "#2E7D32", border: "#A5D6A7" },
};


export default function IndustryResearch({ initialTab }) {
  const [mainTab, setMainTab] = useState(initialTab || "ailabs");
  useEffect(() => { if (initialTab) setMainTab(initialTab); }, [initialTab]);
  const [activeLab, setActiveLab] = useState("OpenAI");
  const [activeInfra, setActiveInfra] = useState("neoclouds");
  const [activeGpu, setActiveGpu] = useState("all");
  const [chipVendorFilter, setChipVendorFilter] = useState("All");
  const [chipDeliverySort, setChipDeliverySort] = useState({ key: "shipDate", dir: "desc" });
  const [chipHistSort, setChipHistSort] = useState({ key: "q", dir: "desc" });
  const [llmLabFilter, setLlmLabFilter] = useState("All");
  const [llmTableSort, setLlmTableSort] = useState({ key: "date", dir: "desc" });
  const [neocloudSort, setNeocloudSort] = useState({ key: "backlog", dir: "desc" });
  const [shellSort, setShellSort] = useState({ key: "backlog", dir: "desc" });
  const [labNotes, setLabNotes] = useState({ OpenAI: "", xAI: "", Google: "", Anthropic: "", Meta: "" });
  // ETF sensitivity state (available if sensitivity tab is added later)
  // const [smhData, setSmhData] = useState(ETF_SENSITIVITY.SMH.holdings.map(h => ({ ...h })));
  // const [soxxData, setSoxxData] = useState(ETF_SENSITIVITY.SOXX.holdings.map(h => ({ ...h })));
  // const [flkrData, setFlkrData] = useState(ETF_SENSITIVITY.FLKR.holdings.map(h => ({ ...h })));
  // const [sensMode, setSensMode] = useState("fwd");
  // const [sensEtf, setSensEtf] = useState("SMH");

  const s = {
    page: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0B0F19", color: "#E2E8F0", minHeight: "100vh", padding: "24px 28px" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, borderBottom: "1px solid #1E293B", paddingBottom: 20 },
    title: { fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", color: "#F8FAFC" },
    subtitle: { fontSize: 13, color: "#94A3B8", marginTop: 4 },
    bigNum: { fontSize: 32, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-1px" },
    card: { background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 16 },
    statsRow: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
    statBox: { background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: "14px 18px", flex: "1 1 140px", minWidth: 140 },
    statLabel: { fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 },
    statVal: { fontSize: 20, fontWeight: 700, color: "#F8FAFC" },
    filtersRow: { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" },
    filterGroup: { display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B" },
    filterBtn: (active) => ({
      padding: "7px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.15s",
      background: active ? "#3B82F6" : "#111827", color: active ? "#FFF" : "#94A3B8",
    }),
    viewToggle: (active) => ({
      padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", borderRadius: 8, transition: "all 0.15s",
      background: active ? "#1E293B" : "transparent", color: active ? "#F8FAFC" : "#94A3B8",
    }),
    table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 },
    th: { textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" },
    thRight: { textAlign: "right", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" },
    td: { padding: "10px 12px", borderBottom: "1px solid #1E293B10", whiteSpace: "nowrap" },
    tdRight: { padding: "10px 12px", borderBottom: "1px solid #1E293B10", textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" },
    ticker: { fontWeight: 700, color: "#F8FAFC", fontSize: 14, letterSpacing: "0.3px" },
    name: { color: "#94A3B8", fontSize: 11, marginTop: 1 },
    badge: (type) => ({
      display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
      background: TYPE_COLORS[type]?.bg || "#333", color: TYPE_COLORS[type]?.text || "#FFF",
      border: `1px solid ${TYPE_COLORS[type]?.border || "#555"}`,
    }),
    peInput: { width: 58, padding: "4px 6px", fontSize: 12, background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 4, color: "#E2E8F0", textAlign: "right", outline: "none" },
    btn: { padding: "6px 14px", fontSize: 12, fontWeight: 600, borderRadius: 6, border: "none", cursor: "pointer", transition: "all 0.15s" },
    barWrap: { width: "100%", height: 6, background: "#1E293B", borderRadius: 3, overflow: "hidden" },
    bar: (pct, color) => ({ width: `${Math.min(pct, 100)}%`, height: "100%", background: color || "#3B82F6", borderRadius: 3, transition: "width 0.3s" }),
    input: { padding: "6px 10px", fontSize: 12, background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, color: "#E2E8F0", outline: "none", width: "100%" },
    select: { padding: "6px 10px", fontSize: 12, background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, color: "#E2E8F0", outline: "none" },
  };

  const fmt_ = fmt;
  const fmtPrice_ = fmtPrice;
  const _fmt = fmt;
  const _fmtPrice = fmtPrice;

  // Stub holdings as empty for supply chain map (research portal has no portfolio)
  const holdings = [];

  const tabs = [
    { key: "ailabs", label: "AI Labs" },
    { key: "ainative", label: "AI-Native" },
    { key: "capex", label: "AI Capex" },
    { key: "semicapex", label: "Semi Capex" },
    { key: "compute", label: "Compute" },
    { key: "chiproadmap", label: "GPU/ASIC" },
    { key: "aiinfra", label: "AI Infra" },
  ];

  return (
    <div style={s.page}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "2px solid #1E293B", overflowX: "auto" }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setMainTab(tab.key)} style={{
            padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
            background: "transparent", color: mainTab === tab.key ? "#F8FAFC" : "#64748B",
            border: "none", borderBottom: mainTab === tab.key ? "2px solid #3B82F6" : "2px solid transparent",
            transition: "all 0.15s", whiteSpace: "nowrap",
          }}>{tab.label}</button>
        ))}
      </div>

      {mainTab === "ailabs" && (() => {
        const labKeys = ["OpenAI", "Anthropic", "Google", "xAI", "Meta"];
        const lab = AI_LABS_DATA[activeLab];
        const maxArr = lab ? Math.max(...lab.arr.map(a => a.value)) : 0;
        const maxCompute = lab ? Math.max(...lab.compute.map(c => c.value)) : 0;
        return (<>
        {/* Lab Sub-tabs */}
        <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B", marginBottom: 24, width: "fit-content" }}>
          <button onClick={() => setActiveLab("Overview")} style={{ padding: "8px 22px", fontSize: 16, fontWeight: 600, cursor: "pointer", border: "none", background: activeLab === "Overview" ? "#3B82F6" : "#111827", color: activeLab === "Overview" ? "#FFF" : "#94A3B8", transition: "all 0.15s" }}>Overview</button>
          {labKeys.map(k => (
            <button key={k} onClick={() => setActiveLab(k)} style={{ padding: "8px 22px", fontSize: 16, fontWeight: 600, cursor: "pointer", border: "none", background: activeLab === k ? "#3B82F6" : "#111827", color: activeLab === k ? "#FFF" : "#94A3B8", transition: "all 0.15s" }}>{AI_LABS_DATA[k].name}</button>
          ))}
        </div>

        {/* ===== OVERVIEW SUB-TAB ===== */}
        {activeLab === "Overview" && (<>

        {/* AI Labs Industry & Market Updates — full width */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#3B82F6" }}>●</span> Industry & Market Updates
          </div>
          <div style={{ maxHeight: 280, overflow: "auto", padding: "12px 16px" }}>
            {AI_LABS_NEWS.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ fontSize: 11, color: "#64748B", minWidth: 50, flexShrink: 0, fontWeight: 600, marginTop: 1 }}>{item.date}</span>
                <span style={{ fontSize: 13, color: "#CBD5E1" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Labs Summary Table */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>AI Labs — Key Metrics Comparison</div>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr>
                {["Metric", "OpenAI", "Anthropic", "Google DeepMind", "xAI", "Meta AI"].map((h, i) => (
                  <th key={h} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 600, color: i === 0 ? "#94A3B8" : [null, "#10B981", "#F59E0B", "#3B82F6", "#EF4444", "#A855F7"][i], textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #1E293B", textAlign: i === 0 ? "left" : "right", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { metric: "Valuation", vals: ["$852B", "$380B", "GOOGL $3.76T", "$250B", "META $1.5T"], bold: true },
                { metric: "Latest ARR", vals: ["$25B (Feb '26)", "$19B (Mar '26)", "$62B (Cloud)", "~$1B", "$190B (Rev)"], bold: true },
                { metric: "2026E ARR", vals: ["$50B", "$26B", "$78B (Cloud)", "$2B", "$220B (Rev)"], bold: false },
                { metric: "MAU (Latest)", vals: ["~900M WAU", "~40M", "750M (Gemini)", "~35M (Grok)", "1.4B (Meta AI)"], bold: true },
                { metric: "Paying Users", vals: ["50M+ subs", "300K+ biz", "120K+ enterprise", "X Premium", "3.54B DAP"], bold: false },
                { metric: "Compute / Power", vals: ["~1.9 GW", "~1 GW", "~7.5 GW (fleet)", "~2 GW", "~4 GW (est.)"], bold: false },
                { metric: "Latest Flagship", vals: ["GPT-5.4", "Opus 4.6", "Gemini 2.5 Pro", "Grok 4.1", "Llama 4 Maverick"], bold: true },
              ].map((row, ri) => (
                <tr key={ri} onMouseEnter={e => e.currentTarget.style.background = "#1E293B20"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "9px 14px", borderBottom: "1px solid #1E293B10", fontWeight: 600, color: "#94A3B8", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.4px" }}>{row.metric}</td>
                  {row.vals.map((v, vi) => (
                    <td key={vi} style={{ padding: "9px 14px", borderBottom: "1px solid #1E293B10", textAlign: "right", fontWeight: row.bold ? 700 : 400, color: row.bold ? "#F8FAFC" : "#E2E8F0", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* API Pricing Table — All Models */}
        {(() => {
          const pricingLabs = ["OpenAI", "Anthropic", "Google", "xAI"];
          const pricingLabColors = { OpenAI: "#10B981", Anthropic: "#F59E0B", Google: "#3B82F6", xAI: "#EF4444" };
          const allPricingModels = LLM_PRICING_DATA.models;
          const pricingTableModels = llmLabFilter === "All" ? allPricingModels : allPricingModels.filter(m => m.lab === llmLabFilter);
          const sortedPricingModels = [...pricingTableModels].sort((a, b) => {
            const k = llmTableSort.key;
            let va, vb;
            if (k === "lab") { va = a.lab; vb = b.lab; }
            else if (k === "model") { va = a.model; vb = b.model; }
            else if (k === "tier") { va = a.tier; vb = b.tier; }
            else if (k === "input") { va = a.input; vb = b.input; }
            else if (k === "output") { va = a.output; vb = b.output; }
            else if (k === "ctx") { va = a.ctx; vb = b.ctx; }
            else if (k === "date") { va = a.date; vb = b.date; }
            else if (k === "savings") { va = a.output; vb = b.output; }
            else { va = a.output; vb = b.output; }
            if (typeof va === "string") return llmTableSort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
            return llmTableSort.dir === "asc" ? va - vb : vb - va;
          });
          const handlePricingSort = (key) => {
            setLlmTableSort(prev => prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
          };
          const PriceSortIcon = ({ col }) => (
            <span style={{ opacity: llmTableSort.key === col ? 1 : 0.3, marginLeft: 3, fontSize: 9 }}>
              {llmTableSort.key === col && llmTableSort.dir === "desc" ? "\u25BC" : "\u25B2"}
            </span>
          );
          return (
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1E293B" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px" }}>API Pricing — All Models</div>
            <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B" }}>
              {["All", ...pricingLabs].map(l => (
                <button key={l} onClick={() => setLlmLabFilter(l)} style={{
                  padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                  background: llmLabFilter === l ? (l === "All" ? "#3B82F6" : pricingLabColors[l]) : "#111827",
                  color: llmLabFilter === l ? "#FFF" : "#94A3B8", transition: "all 0.15s",
                }}>{l}</button>
              ))}
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr>
                {[
                  { label: "Lab", key: "lab", align: "left" },
                  { label: "Model", key: "model", align: "left" },
                  { label: "Tier", key: "tier", align: "left" },
                  { label: "Input $/MTok", key: "input", align: "right" },
                  { label: "Output $/MTok", key: "output", align: "right" },
                  { label: "Context", key: "ctx", align: "right" },
                  { label: "Released", key: "date", align: "right" },
                  { label: "Deflation vs GPT-4", key: "savings", align: "right" },
                ].map((h) => (
                  <th key={h.key} onClick={() => handlePricingSort(h.key)} style={{
                    textAlign: h.align,
                    padding: "10px 12px", fontSize: 10, fontWeight: 600, color: "#94A3B8",
                    textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B",
                    whiteSpace: "nowrap", cursor: "pointer", userSelect: "none",
                  }}>
                    {h.label}<PriceSortIcon col={h.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedPricingModels.map((m, i) => {
                const savings = ((1 - m.output / 60) * 100).toFixed(0);
                return (
                  <tr key={i}
                    onMouseEnter={e => e.currentTarget.style.background = "#1E293B40"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10" }}>
                      <span style={{ fontWeight: 700, color: pricingLabColors[m.lab] || "#F8FAFC", fontSize: 13 }}>{m.lab}</span>
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", fontSize: 14 }}>{m.model}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10" }}>
                      <span style={{
                        display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                        background: m.tier === "flagship" ? "#FEF3C7" : m.tier === "mid" ? "#DBEAFE" : "#D1FAE5",
                        color: m.tier === "flagship" ? "#92400E" : m.tier === "mid" ? "#1E40AF" : "#065F46",
                      }}>{m.tier}</span>
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#E2E8F0", fontVariantNumeric: "tabular-nums", fontSize: 14 }}>${m.input.toFixed(2)}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", textAlign: "right", fontWeight: 700, color: "#F8FAFC", fontVariantNumeric: "tabular-nums", fontSize: 14 }}>${m.output.toFixed(2)}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#94A3B8", fontVariantNumeric: "tabular-nums" }}>{m.ctx >= 1000 ? `${(m.ctx/1000).toFixed(0)}M` : `${m.ctx}K`}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#94A3B8", fontSize: 12 }}>{m.date}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                        <span style={{ fontWeight: 600, color: "#10B981", fontSize: 12 }}>-{savings}%</span>
                        <div style={{ width: 50, height: 6, background: "#1E293B", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${Math.min(parseInt(savings), 100)}%`, height: "100%", background: "#10B981", borderRadius: 3 }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: "10px 16px", fontSize: 11, color: "#94A3B8", fontStyle: "italic" }}>Deflation vs GPT-4: % cheaper than GPT-4's original $60/MTok output price at launch (Mar 2023). Click any column header to sort.</div>
        </div>
          );
        })()}

        {/* LLM Pricing Key Observations */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>LLM Pricing — Key Observations</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "\ud83d\udcc9", title: "10x Annual Deflation", text: "LLM inference costs decline faster than any prior technology \u2014 faster than Moore's Law, PC compute, or dotcom bandwidth. GPT-4-equivalent output: $60 \u2192 ~$0.40/MTok in 3 years." },
              { icon: "\ud83c\udfed", title: "Output 3-5x More Than Input", text: "All providers price output tokens 3-10x higher than input. Output requires sequential autoregressive generation while input parallelizes. Output-heavy apps face different economics." },
              { icon: "\ud83d\udcd0", title: "Context Windows Exploded 62x", text: "GPT-4's 32K (Mar '23) \u2192 Gemini's 2M tokens (Jun '24). Anthropic and OpenAI at 1M standard. Eliminates chunking overhead and enables entirely new use cases." },
              { icon: "\u2694\ufe0f", title: "Google Leads Price, Anthropic Quality-per-$", text: "Gemini Flash ($0.10-0.40/MTok output) undercuts all rivals. Anthropic Opus 4.6 dropped 67% from Opus 4 ($75\u2192$25). OpenAI GPT-5.4 balances cost + capability at $10/MTok." },
              { icon: "\ud83d\udd04", title: "Batch + Caching = 75-90% Further Savings", text: "Prompt caching (90% savings on repeated content) and batch APIs (50% off for async) mean sticker price is the ceiling. Production workloads routinely pay 25% of list." },
              { icon: "\ud83c\udde8\ud83c\uddf3", title: "DeepSeek Disrupted the Pricing Floor", text: "DeepSeek R1 at $0.55/$2.19 \u2014 90% below Western incumbents. Forces all providers to offer competitive value tiers or lose developer adoption." },
            ].map((item, idx) => (
              <div key={idx} style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{item.title}</span>
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        </>)}

        {/* ===== INDIVIDUAL LAB SUB-TAB ===== */}
        {lab && (<>
        {/* Lab Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, borderBottom: "1px solid #1E293B", paddingBottom: 20 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>{lab.name}</div>
            <div style={{ fontSize: 16, color: "#94A3B8", marginTop: 4 }}>{lab.tagline}</div>
            <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 6 }}>{lab.hq} &middot; Founded {lab.founded} &middot; {lab.employees} employees &middot; CEO: {lab.ceo}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>Valuation</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-1px" }}>{lab.valuation.current}</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>{lab.valuation.date} &middot; {lab.valuation.series}</div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: "16px 18px", borderLeft: "3px solid #3B82F6" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Users / Reach</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#3B82F6" }}>{lab.users.paying}</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>{lab.users.trend}</div>
          </div>
          <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: "16px 18px", borderLeft: "3px solid #10B981" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Burn / Profitability</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#10B981", lineHeight: 1.5 }}>{lab.burn}</div>
          </div>
          <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: "16px 18px", borderLeft: "3px solid #F59E0B" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Latest Funding</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#F59E0B" }}>{lab.valuation.series}</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4, lineHeight: 1.5 }}>{lab.valuation.investors}</div>
          </div>
        </div>

        {/* ARR + Compute Charts Side by Side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 8 }}>
          {/* ARR Growth Chart */}
          <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>{lab.arrLabel || "ARR — Annualized Run Rate ($B)"}</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 150 }}>
              {lab.arr.map((a, i) => {
                const barH = maxArr > 0 ? (a.value / maxArr) * 120 : 0;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: a.est ? "#94A3B8" : "#F8FAFC" }}>${a.value >= 1 ? Math.round(a.value) : a.value}B</div>
                    <div style={{ width: "100%", maxWidth: 44, height: barH, background: a.est ? "linear-gradient(180deg, #334155 0%, #1E293B 100%)" : "linear-gradient(180deg, #3B82F6 0%, #1E40AF 100%)", borderRadius: "4px 4px 0 0", transition: "height 0.3s", minHeight: 3, border: a.est ? "1px dashed #475569" : "none" }} />
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{a.year}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 8, fontStyle: "italic" }}>Solid = actual &middot; Dashed = estimate</div>
          </div>

          {/* Compute / Power Growth Chart */}
          <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>{lab.computeLabel || "Compute / Power (GW)"}</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 150 }}>
              {lab.compute.map((c, i) => {
                const barH = maxCompute > 0 ? (c.value / maxCompute) * 120 : 0;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: c.est ? "#94A3B8" : "#F8FAFC" }}>{c.value >= 1 ? c.value.toFixed(0) : c.value} GW</div>
                    <div style={{ width: "100%", maxWidth: 44, height: barH, background: c.est ? "linear-gradient(180deg, #374151 0%, #1F2937 100%)" : "linear-gradient(180deg, #F59E0B 0%, #B45309 100%)", borderRadius: "4px 4px 0 0", transition: "height 0.3s", minHeight: 3, border: c.est ? "1px dashed #475569" : "none" }} />
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{c.year}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 8, fontStyle: "italic" }}>Solid = actual &middot; Dashed = projection</div>
          </div>
        </div>

        {/* Current Trackers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#3B82F6" }}>{lab.arrCurrent.value}</span>
                <span style={{ fontSize: 13, color: "#94A3B8", marginLeft: 8 }}>as of {lab.arrCurrent.date}</span>
              </div>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>Track vs projection</span>
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Source: {lab.arrSource}</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#F59E0B" }}>{lab.computeCurrent.value}</span>
                <span style={{ fontSize: 13, color: "#94A3B8", marginLeft: 8 }}>as of {lab.computeCurrent.date}</span>
              </div>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>Track vs projection</span>
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Source: {lab.computeSource}</div>
          </div>
        </div>

        {/* MAU Growth Chart */}
        {lab.mau && (() => {
          const mauData = lab.mau.filter(m => m.value > 0);
          const maxMau = Math.max(...mauData.map(m => m.value));
          const formatMau = v => v >= 1000 ? `${(v/1000).toFixed(1)}B` : v >= 1 ? `${Math.round(v)}M` : `${(v*1000).toFixed(0)}K`;
          return (
          <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>{lab.mauLabel || "Platform MAU"}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", fontStyle: "italic" }}>{lab.mauSource}</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 170 }}>
              {lab.mau.map((m, i) => {
                const barH = maxMau > 0 && m.value > 0 ? Math.max((m.value / maxMau) * 130, 4) : 0;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    {m.value > 0 ? (
                      <>
                        <div style={{ fontSize: 10, fontWeight: 700, color: m.est ? "#94A3B8" : "#F8FAFC", whiteSpace: "nowrap" }}>{formatMau(m.value)}</div>
                        <div style={{ width: "100%", maxWidth: 36, height: barH, background: m.est ? "linear-gradient(180deg, #334155 0%, #1E293B 100%)" : "linear-gradient(180deg, #8B5CF6 0%, #6D28D9 100%)", borderRadius: "4px 4px 0 0", transition: "height 0.3s", border: m.est ? "1px dashed #475569" : "none" }} />
                      </>
                    ) : (
                      <div style={{ height: 0 }} />
                    )}
                    <div style={{ fontSize: 9, color: "#94A3B8", whiteSpace: "nowrap" }}>{m.q}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 8, fontStyle: "italic" }}>Solid = reported &middot; Dashed = estimate</div>
          </div>
          );
        })()}

        {/* ===== SUPPLY CHAIN MAP & CONTRACTS ===== */}
        {(() => {
          const supplyChains = {
            OpenAI: {
              layers: [
                { label: "AI Lab", items: [{ name: "OpenAI", sub: "$25B ARR · 910M WAU", color: "#10B981" }] },
                { label: "Cloud / Compute", items: [
                  { name: "Microsoft Azure", sub: "$250B (2025-2032)", color: "#3B82F6", link: "MSFT" },
                  { name: "Oracle Cloud", sub: "$300B (2027-2031)", color: "#EF4444", link: "ORCL" },
                  { name: "AWS", sub: "$38B 7yr", color: "#F59E0B", link: "AMZN" },
                  { name: "CoreWeave", sub: "$22.4B (thru 2029)", color: "#8B5CF6", link: "CRWV" },
                ]},
                { label: "Silicon", items: [
                  { name: "NVIDIA", sub: "10 GW · Vera Rubin · $100B inv.", color: "#10B981", link: "NVDA" },
                  { name: "AMD", sub: "6 GW · Instinct · 10% equity", color: "#EF4444", link: "AMD" },
                  { name: "Broadcom", sub: "10 GW custom ASIC", color: "#3B82F6", link: "AVGO" },
                  { name: "Intel", sub: "x86 CPUs", color: "#64748B", link: "INTC" },
                ]},
                { label: "Fabrication", items: [
                  { name: "TSMC", sub: "All GPU/ASIC fab", color: "#8B5CF6", link: "TSM" },
                ]},
                { label: "Infrastructure / Power", items: [
                  { name: "Stargate JV", sub: "SoftBank + Oracle · $500B · 10 GW", color: "#F59E0B" },
                  { name: "SoftBank", sub: "$30B inv. · Chair: Masa Son", color: "#A855F7", link: "9984.T" },
                  { name: "MGX (Abu Dhabi)", sub: "Stargate co-funder", color: "#64748B" },
                ]},
                { label: "Distribution", items: [
                  { name: "ChatGPT", sub: "910M WAU · $200/mo Pro", color: "#10B981" },
                  { name: "Microsoft Copilot", sub: "M365, GitHub, Azure AI", color: "#3B82F6", link: "MSFT" },
                  { name: "Apple", sub: "Siri integration (in talks)", color: "#94A3B8", link: "AAPL" },
                ]},
              ],
              contracts: [
                { date: "Jan 2025", partner: "Stargate JV", type: "Infrastructure", amount: "$500B", duration: "4 years", deploy: "10 GW by 2029", status: "Active — 7 GW planned" },
                { date: "Sep 2025", partner: "NVIDIA", type: "Chip Supply + Investment", amount: "$100B inv. for 10 GW", duration: "Multi-year", deploy: "1st GW H2 2026 (Vera Rubin)", status: "LOI signed" },
                { date: "Oct 2025", partner: "AMD", type: "Chip Supply + Equity", amount: "$90B hardware · 10% equity warrants", duration: "Multi-year", deploy: "1st GW H2 2026", status: "Announced" },
                { date: "Oct 2025", partner: "Broadcom", type: "Custom ASIC Co-design", amount: "~$350B est. (10 GW)", duration: "2026-2032", deploy: "Samples mid-2026, prod late 2026", status: "In development" },
                { date: "Oct 2025", partner: "Intel", type: "CPU Supply", amount: "Undisclosed", duration: "Multi-year", deploy: "x86 CPUs for AI servers", status: "Announced" },
                { date: "Oct 2025", partner: "TSMC", type: "Foundry / Fab", amount: "Undisclosed", duration: "Multi-year", deploy: "All custom + GPU fab", status: "Active" },
                { date: "2019-2025", partner: "Microsoft Azure", type: "Cloud Compute", amount: "$250B", duration: "~7 years (thru 2032)", deploy: "Ongoing — primary cloud", status: "Restructured Oct 2025" },
                { date: "2025", partner: "Oracle Cloud", type: "Cloud Compute", amount: "$300B ($60B/yr)", duration: "5 years (2027-2031)", deploy: "Abilene TX, NM online 2026", status: "Active" },
                { date: "Nov 2025", partner: "AWS", type: "Cloud Compute", amount: "$38B", duration: "7 years", deploy: "GB200/GB300 GPUs, full by end 2026", status: "Active" },
                { date: "2024-2025", partner: "CoreWeave", type: "Cloud Compute", amount: "$22.4B", duration: "Thru 2029", deploy: "$11.9B + $4B + $6.5B expansions", status: "Active" },
                { date: "Jul 2025", partner: "U.S. DoD (CDAO)", type: "Defense AI", amount: "Up to $200M", duration: "~1 year", deploy: "AI agents for defense missions", status: "Awarded" },
              ],
            },
            Anthropic: {
              layers: [
                { label: "AI Lab", items: [{ name: "Anthropic", sub: "$19B ARR · 300K+ biz", color: "#F59E0B" }] },
                { label: "Cloud / Compute", items: [
                  { name: "AWS (Primary)", sub: "Project Rainier · $11B campus", color: "#F59E0B", link: "AMZN" },
                  { name: "Google Cloud", sub: "1M TPUs · 1+ GW · tens of $B", color: "#3B82F6", link: "GOOGL" },
                  { name: "Microsoft Azure", sub: "$30B compute · 1 GW", color: "#8B5CF6", link: "MSFT" },
                ]},
                { label: "Silicon", items: [
                  { name: "AWS Trainium2/3", sub: "1M+ chips · Rainier · co-designed", color: "#F59E0B", link: "AMZN" },
                  { name: "Google TPU v7", sub: "Ironwood · 1M units", color: "#3B82F6", link: "GOOGL" },
                  { name: "NVIDIA", sub: "Grace Blackwell + Vera Rubin", color: "#10B981", link: "NVDA" },
                ]},
                { label: "Own Infrastructure", items: [
                  { name: "Fluidstack DCs", sub: "$50B · TX + NY · online 2026", color: "#EF4444" },
                  { name: "TeraWulf", sub: "168 MW (TX) + 360 MW (NY)", color: "#10B981", link: "WULF" },
                  { name: "Cipher Mining", sub: "244 MW (TX) via Fluidstack", color: "#A855F7", link: "CIFR" },
                ]},
                { label: "Ecosystem / Investors", items: [
                  { name: "Amazon", sub: "$8B invested · primary partner", color: "#F59E0B", link: "AMZN" },
                  { name: "Google", sub: "$3B+ invested · 14% equity (capped 15%)", color: "#3B82F6", link: "GOOGL" },
                  { name: "Microsoft", sub: "$5B invested", color: "#8B5CF6", link: "MSFT" },
                  { name: "NVIDIA", sub: "$10B invested", color: "#10B981", link: "NVDA" },
                ]},
                { label: "Distribution / Defense", items: [
                  { name: "Claude.ai + Code", sub: "$2.5B ARR (Code: $500M in 8 wk)", color: "#10B981" },
                  { name: "Palantir + AWS", sub: "IL6 classified · defense AI", color: "#EF4444", link: "PLTR" },
                  { name: "Bedrock / Vertex / Foundry", sub: "All 3 hyperscaler platforms", color: "#3B82F6" },
                ]},
              ],
              contracts: [
                { date: "Sep 2023", partner: "Amazon / AWS", type: "Investment + Cloud", amount: "$1.25B (initial)", duration: "Ongoing", deploy: "AWS = primary cloud provider", status: "Active" },
                { date: "Mar 2024", partner: "Amazon / AWS", type: "Investment", amount: "$2.75B (total $4B)", duration: "Ongoing", deploy: "Bedrock integration", status: "Active" },
                { date: "Nov 2024", partner: "Amazon / AWS", type: "Investment", amount: "$4B (total $8B)", duration: "Ongoing", deploy: "Primary training partner", status: "Active" },
                { date: "Nov 2024", partner: "Palantir + AWS", type: "Defense / IC", amount: "Undisclosed", duration: "Ongoing", deploy: "Claude on IL6 for defense/intel", status: "Active — classified missions" },
                { date: "Oct 2024", partner: "Project Rainier", type: "Dedicated DC Campus", amount: "$11B (AWS-funded)", duration: "Multi-year", deploy: "500K Trainium2 → 1M+ by end 2025", status: "Operational (Oct 2025)" },
                { date: "Jan 2025", partner: "Google", type: "Investment", amount: "$1B (total ~$3B+)", duration: "Ongoing", deploy: "14% equity stake (capped 15%)", status: "Active" },
                { date: "Oct 2025", partner: "Google Cloud", type: "TPU Compute", amount: "Tens of $B", duration: "Multi-year", deploy: "1M TPUs · 1+ GW online 2026", status: "Active" },
                { date: "Nov 2025", partner: "Fluidstack", type: "Own Data Centers", amount: "$50B", duration: "Multi-year", deploy: "TX + NY sites online 2026", status: "Under construction" },
                { date: "Nov 2025", partner: "Microsoft Azure", type: "Cloud Compute", amount: "$30B", duration: "Multi-year", deploy: "1 GW · Grace Blackwell + Vera Rubin", status: "Announced" },
                { date: "Nov 2025", partner: "NVIDIA", type: "Investment + Silicon", amount: "$10B investment", duration: "Multi-year", deploy: "Co-optimize Claude for NVDA arch", status: "Announced" },
                { date: "Nov 2025", partner: "Microsoft", type: "Investment", amount: "$5B", duration: "Funding round", deploy: "Foundry, Copilot integration", status: "Committed" },
                { date: "Feb 2026", partner: "Series G", type: "Fundraise", amount: "$30B raised", duration: "—", deploy: "$380B post-money valuation", status: "Closed" },
                { date: "Jul 2025", partner: "U.S. DoD (CDAO)", type: "Defense AI", amount: "Up to $200M", duration: "~1 year", deploy: "AI agents for defense missions", status: "Awarded" },
              ],
            },
            Google: {
              layers: [
                { label: "AI Lab", items: [{ name: "Google DeepMind", sub: "Gemini · $62B Cloud ARR", color: "#3B82F6" }] },
                { label: "Cloud Platform", items: [
                  { name: "Google Cloud (GCP)", sub: "$93B capex 2026 · 7.5+ GW fleet", color: "#3B82F6", link: "GOOGL" },
                ]},
                { label: "Custom Silicon", items: [
                  { name: "TPU v7 Ironwood", sub: "192 GB HBM3e · 44% lower TCO", color: "#3B82F6", link: "GOOGL" },
                  { name: "Axion (Arm CPU)", sub: "Custom Arm-based server CPU", color: "#10B981", link: "GOOGL" },
                  { name: "NVIDIA GPUs", sub: "Blackwell + Vera Rubin (also buys)", color: "#10B981", link: "NVDA" },
                ]},
                { label: "Fabrication", items: [
                  { name: "Broadcom", sub: "TPU ASIC design partner", color: "#EF4444", link: "AVGO" },
                  { name: "TSMC", sub: "All TPU + Axion fab", color: "#8B5CF6", link: "TSM" },
                ]},
                { label: "External TPU Customers", items: [
                  { name: "Anthropic", sub: "1M TPUs · tens of $B", color: "#F59E0B" },
                  { name: "Meta (in talks)", sub: "Cloud 2026 → on-prem 2027", color: "#A855F7", link: "META" },
                  { name: "Midjourney / Cohere", sub: "Inference migration", color: "#64748B" },
                ]},
                { label: "Equity / Investments", items: [
                  { name: "Anthropic", sub: "$3B+ invested · 14% equity", color: "#F59E0B" },
                  { name: "TeraWulf", sub: "14% equity + backstop", color: "#10B981", link: "WULF" },
                  { name: "Cipher Mining", sub: "5.4% equity", color: "#A855F7", link: "CIFR" },
                ]},
                { label: "Distribution", items: [
                  { name: "Gemini App", sub: "750M+ MAU · Android default", color: "#3B82F6" },
                  { name: "Vertex AI", sub: "15M+ biz, 120K+ enterprise", color: "#10B981" },
                  { name: "Workspace / Search", sub: "2B+ users · AI Overviews", color: "#F59E0B" },
                ]},
              ],
              contracts: [
                { date: "2023", partner: "Anthropic", type: "Investment", amount: "$2B (initial)", duration: "Ongoing", deploy: "Equity stake, TPU usage", status: "Active" },
                { date: "Jan 2025", partner: "Anthropic", type: "Investment", amount: "$1B (total ~$3B+)", duration: "Ongoing", deploy: "14% equity (capped 15%)", status: "Active" },
                { date: "Oct 2025", partner: "Anthropic", type: "TPU Cloud Deal", amount: "Tens of $B", duration: "Multi-year", deploy: "1M TPUs · 1+ GW online 2026", status: "Active" },
                { date: "Apr 2026", partner: "Anthropic (expanded)", type: "TPU Cloud Deal", amount: "Multi-$B (incremental)", duration: "Multi-year", deploy: "~3.5 GW next-gen TPU via Broadcom · online 2027 · US-sited", status: "Active" },
                { date: "Nov 2025", partner: "Meta (in talks)", type: "TPU Cloud + On-prem", amount: "Multi-$B (est.)", duration: "Cloud 2026, on-prem 2027", deploy: "Inference → training migration", status: "In negotiations" },
                { date: "Apr 2026", partner: "Broadcom (expanded)", type: "ASIC Design + Supply", amount: "Undisclosed (significant)", duration: "Through 2031", deploy: "Next-gen TPU design + networking + components for AI racks", status: "Active" },
                { date: "2025", partner: "Broadcom", type: "ASIC Design Partner", amount: "Undisclosed", duration: "Ongoing", deploy: "TPU v6/v7 co-design + fab via TSMC", status: "Active" },
                { date: "2025", partner: "TeraWulf", type: "Equity + Backstop", amount: "14% equity + loan backstop", duration: "Multi-year", deploy: "Via Fluidstack for Anthropic DCs", status: "Active" },
                { date: "2025", partner: "Cipher Mining", type: "Equity + Backstop", amount: "5.4% equity + $1.4B lease backstop", duration: "Multi-year", deploy: "Via Fluidstack for Anthropic DCs", status: "Active" },
                { date: "2025", partner: "Fluidstack", type: "Backstop + TPU Supply", amount: "Backstop loans + TPU merchant", duration: "Multi-year", deploy: "1st external TPU merchant customer", status: "Active" },
                { date: "2026", partner: "CapEx Guidance", type: "Internal Infrastructure", amount: "$175-185B", duration: "2026", deploy: "DCs, servers, networking. ~2x 2025 spend", status: "Guided" },
                { date: "Jul 2025", partner: "U.S. DoD (CDAO)", type: "Defense AI", amount: "Up to $200M", duration: "~1 year", deploy: "AI agents for defense missions", status: "Awarded" },
                { date: "Aug 2025", partner: "Meta", type: "Cloud Deal", amount: "$10B+ (6-yr)", duration: "6 years", deploy: "Core Meta apps on GCP", status: "Active" },
              ],
            },
            xAI: {
              layers: [
                { label: "AI Lab", items: [{ name: "xAI", sub: "Grok · $7B ARR est.", color: "#A855F7" }] },
                { label: "Cloud / Compute", items: [
                  { name: "Oracle Cloud", sub: "Primary cloud partner", color: "#EF4444", link: "ORCL" },
                  { name: "AWS", sub: "Secondary cloud", color: "#F59E0B", link: "AMZN" },
                ]},
                { label: "Silicon", items: [
                  { name: "NVIDIA", sub: "500K+ GPUs · Blackwell · Vera Rubin", color: "#10B981", link: "NVDA" },
                  { name: "AMD", sub: "Instinct GPUs (secondary)", color: "#EF4444", link: "AMD" },
                ]},
                { label: "Fabrication", items: [
                  { name: "TSMC", sub: "All GPU fab", color: "#8B5CF6", link: "TSM" },
                ]},
                { label: "Own Infrastructure", items: [
                  { name: "Colossus 1", sub: "Memphis, TN · 100K H100s · operational", color: "#A855F7" },
                  { name: "Colossus 2", sub: "Memphis, TN · 500K+ GPUs · expanding", color: "#EF4444" },
                  { name: "Solaris Energy", sub: "Behind-meter gas turbines · 67% of orders", color: "#F59E0B" },
                ]},
                { label: "Ecosystem / Investors", items: [
                  { name: "NVIDIA", sub: "GPU-for-equity deal (like OpenAI)", color: "#10B981", link: "NVDA" },
                  { name: "Tesla", sub: "Megapack co-deployment · Musk synergy", color: "#F59E0B", link: "TSLA" },
                  { name: "SoftBank / Qatar", sub: "Major investors", color: "#A855F7" },
                ]},
                { label: "Distribution", items: [
                  { name: "X (Twitter)", sub: "Grok integrated · 600M+ MAU", color: "#64748B" },
                  { name: "Grok App", sub: "Standalone (iOS/Android)", color: "#A855F7" },
                  { name: "API", sub: "Enterprise + developer access", color: "#3B82F6" },
                ]},
              ],
              contracts: [
                { date: "Jul 2023", partner: "xAI Founded", type: "Formation", amount: "—", duration: "—", deploy: "Elon Musk founds xAI", status: "Active" },
                { date: "Sep 2024", partner: "Colossus 1", type: "Own DC Build", amount: "~$4B est.", duration: "Ongoing", deploy: "100K H100s · Memphis, TN · 150 MW", status: "Operational" },
                { date: "Dec 2024", partner: "Series C", type: "Fundraise", amount: "$6B", duration: "—", deploy: "$45B pre-money valuation", status: "Closed" },
                { date: "Mar 2025", partner: "Series D", type: "Fundraise", amount: "$12B", duration: "—", deploy: "~$80B valuation (est.)", status: "Closed" },
                { date: "2025", partner: "NVIDIA", type: "GPU Supply + Investment", amount: "Multi-$B (GPU-for-equity)", duration: "Multi-year", deploy: "500K+ Blackwell GPUs for Colossus 2", status: "Active" },
                { date: "2025", partner: "Oracle Cloud", type: "Cloud Compute", amount: "Multi-$B", duration: "Multi-year", deploy: "Primary cloud for inference", status: "Active" },
                { date: "2025", partner: "Solaris Energy", type: "Power / Behind-meter", amount: "67% of Solaris orderbook", duration: "Multi-year", deploy: "Gas turbine power for Colossus", status: "Active" },
                { date: "2025", partner: "Colossus 2", type: "DC Expansion", amount: "~$10B+ est.", duration: "Ongoing", deploy: "500K+ GPUs · Memphis expansion", status: "Under construction" },
                { date: "Jul 2025", partner: "U.S. DoD (CDAO)", type: "Defense AI", amount: "Up to $200M", duration: "~1 year", deploy: "AI agents for defense missions", status: "Awarded" },
                { date: "2025", partner: "Tesla", type: "Energy / Ecosystem", amount: "Undisclosed", duration: "Ongoing", deploy: "Megapack battery co-deployment", status: "Active" },
              ],
            },
            Meta: {
              layers: [
                { label: "AI Lab", items: [{ name: "Meta AI", sub: "Llama · $190B Rev · 1.4B AI MAU", color: "#3B82F6" }] },
                { label: "Cloud / Compute", items: [
                  { name: "On-Prem DCs (Primary)", sub: "30 DCs · 26 in US · $600B by 2028", color: "#3B82F6", link: "META" },
                  { name: "Nebius", sub: "$27B 5-yr · Vera Rubin · from 2027", color: "#06B6D4", link: "NBIS" },
                  { name: "Google Cloud", sub: "$10B+ 6-yr deal", color: "#10B981", link: "GOOGL" },
                  { name: "CoreWeave", sub: "$14.2B multi-year", color: "#8B5CF6", link: "CRWV" },
                ]},
                { label: "Silicon", items: [
                  { name: "NVIDIA", sub: "Millions of GPUs · Blackwell + Rubin", color: "#10B981", link: "NVDA" },
                  { name: "AMD", sub: "6 GW Instinct · $60-100B · 10% equity", color: "#EF4444", link: "AMD" },
                  { name: "Google TPU", sub: "In talks · cloud 2026, on-prem 2027", color: "#3B82F6", link: "GOOGL" },
                  { name: "MTIA (Custom)", sub: "In-house inference chip", color: "#64748B", link: "META" },
                ]},
                { label: "Fabrication", items: [
                  { name: "TSMC", sub: "All GPU + MTIA fab", color: "#8B5CF6", link: "TSM" },
                  { name: "Broadcom", sub: "Custom networking / NIC", color: "#F59E0B", link: "AVGO" },
                  { name: "Corning", sub: "$6B optical fiber deal", color: "#64748B", link: "GLW" },
                ]},
                { label: "Own Infrastructure", items: [
                  { name: "Hyperion (Louisiana)", sub: "5 GW · 1.3M GPUs · done 2030", color: "#EF4444" },
                  { name: "Prometheus (Ohio)", sub: "Online 2026 · natural gas", color: "#F59E0B" },
                  { name: "Blue Owl JV", sub: "Hyperion financing · 16-yr lease", color: "#A855F7" },
                ]},
                { label: "Distribution", items: [
                  { name: "Facebook + Instagram", sub: "3B+ and 2B+ users", color: "#3B82F6", link: "META" },
                  { name: "WhatsApp", sub: "2.5B+ users · AI integrated", color: "#10B981", link: "META" },
                  { name: "Meta AI", sub: "1.4B MAU · fastest AI growth ever", color: "#F59E0B", link: "META" },
                  { name: "Llama (Open Weight)", sub: "Most downloaded OSS model family", color: "#A855F7" },
                ]},
              ],
              contracts: [
                { date: "Mar 2026", partner: "Nebius", type: "AI Cloud Infrastructure", amount: "Up to $27B ($12B dedicated + $15B available)", duration: "5 years", deploy: "Vera Rubin platform · multi-location · from early 2027", status: "Active" },
                { date: "Feb 2026", partner: "NVIDIA", type: "GPU Supply", amount: "Tens of $B (est. $35-67B)", duration: "Multi-year", deploy: "Millions of Blackwell + Rubin GPUs", status: "Active" },
                { date: "2026", partner: "CapEx Guidance", type: "Internal Infrastructure", amount: "$115-135B", duration: "2026", deploy: "Nearly 2x 2025 ($72B). 30 DCs total.", status: "Guided" },
                { date: "Nov 2025", partner: "Nebius (initial)", type: "AI Cloud Compute", amount: "$3B", duration: "Multi-year", deploy: "Initial GPU capacity deal", status: "Active — expanded Mar 2026" },
                { date: "Nov 2025", partner: "Google TPU (in talks)", type: "Chip Lease + Purchase", amount: "Multi-$B (est.)", duration: "Cloud 2026, on-prem 2027", deploy: "Inference diversification from NVDA", status: "In negotiations" },
                { date: "Oct 2025", partner: "Hyperion / Blue Owl", type: "DC JV", amount: "~$10B+ (Blue Owl financed)", duration: "16-yr lease", deploy: "5 GW Louisiana · nuclear-backed · done 2030", status: "Under construction" },
                { date: "Q3 2025", partner: "CoreWeave", type: "Cloud Compute", amount: "$14.2B", duration: "Multi-year", deploy: "GPU clusters for Llama training", status: "Active" },
                { date: "Aug 2025", partner: "Google Cloud", type: "Cloud Compute", amount: "$10B+ (6-yr)", duration: "6 years", deploy: "Core Meta apps on GCP", status: "Active" },
                { date: "2025", partner: "AMD", type: "Chip Supply + Equity", amount: "$60-100B · 6 GW · 10% equity option", duration: "5 years", deploy: "Instinct GPUs for training + inference", status: "Active" },
                { date: "2025", partner: "Corning", type: "Optical Fiber Supply", amount: "$6B", duration: "Multi-year", deploy: "Data center interconnect fiber", status: "Active" },
                { date: "2025", partner: "Prometheus (Ohio)", type: "Own DC Build", amount: "Undisclosed", duration: "Ongoing", deploy: "Online 2026 · natural gas power", status: "Under construction" },
                { date: "2025", partner: "MTIA v2", type: "Custom Silicon (In-house)", amount: "Internal R&D", duration: "Ongoing", deploy: "Inference chip for ranking + recommendation", status: "In deployment" },
              ],
            },
          };
          const sc = supplyChains[activeLab];
          // Build ticker weight map (% of total portfolio)
          const tickerValues = {};
          holdings.forEach(h => { tickerValues[h.ticker] = (tickerValues[h.ticker] || 0) + h.value; });
          const portTotal = holdings.reduce((s, h) => s + h.value, 0);
          const tickerWeight = (ticker) => portTotal > 0 ? (tickerValues[ticker] || 0) / portTotal : 0;
          // Sort contracts: newest first. Parse mixed date formats to sortable key.
          const dateKey = (d) => {
            if (!d) return "0000";
            const m = d.match(/(\d{4})/); const yr = m ? m[1] : "0000";
            const months = { Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12" };
            const mm = d.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/);
            const qm = d.match(/Q(\d)/);
            if (mm) return yr + "-" + months[mm[1]];
            if (qm) return yr + "-" + String(parseInt(qm[1]) * 3).padStart(2, "0");
            if (d.includes("-")) { const pts = d.split("-"); return pts[pts.length - 1] + "-12"; }
            return yr + "-06";
          };
          const sortedContracts = [...sc.contracts].sort((a, b) => dateKey(b.date).localeCompare(dateKey(a.date)));
          if (!sc) return null;
          return (
          <>
          {/* Supply Chain Flow */}
          <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>{lab.name} Supply Chain &amp; Ecosystem Map</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {sc.layers.map((layer, li) => (
                <div key={li}>
                  {li > 0 && (
                    <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                      <svg width="24" height="18" viewBox="0 0 24 18"><path d="M12 0 L12 12 M6 8 L12 14 L18 8" stroke="#334155" strokeWidth="2" fill="none"/></svg>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 120, flexShrink: 0, fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", textAlign: "right" }}>{layer.label}</div>
                    <div style={{ flex: 1, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {layer.items.map((item, ii) => {
                        const inPort = item.link && tickerWeight(item.link) > 0.01;
                        return (
                        <div key={ii} style={{
                          background: inPort ? "rgba(16,185,129,0.08)" : "#0B0F19",
                          border: `1px solid ${inPort ? "#10B981" : "#1E293B"}`,
                          borderRadius: 8, padding: "10px 14px", minWidth: 160, flex: "1 1 160px", maxWidth: 260,
                          borderLeft: `3px solid ${item.color}`,
                          position: "relative",
                        }}>
                          {inPort && <div style={{ position: "absolute", top: 4, right: 6, fontSize: 8, color: "#10B981", fontWeight: 700, letterSpacing: "0.5px" }}>IN PORTFOLIO</div>}
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3, lineHeight: 1.4 }}>{item.sub}</div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 10, color: "#64748B", alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, border: "1px solid #10B981", background: "rgba(16,185,129,0.08)" }} />
                In your portfolio (&gt;1% weight)
              </span>
              <span>Arrows indicate primary value/compute flow direction</span>
            </div>
          </div>

          {/* Contracts Table */}
          <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>{lab.name} Major Contracts &amp; Commitments</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>{sc.contracts.length} deals tracked</div>
            </div>
            <div style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1E293B" }}>
                    {["Date","Partner","Type","Amount","Duration","Deployment / Notes","Status"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedContracts.map((c, ci) => (
                    <tr key={ci} style={{ borderBottom: "1px solid #0B0F19" }}>
                      <td style={{ padding: "8px 10px", color: "#94A3B8", whiteSpace: "nowrap", fontSize: 11 }}>{c.date}</td>
                      <td style={{ padding: "8px 10px", color: "#E2E8F0", fontWeight: 600, whiteSpace: "nowrap" }}>{c.partner}</td>
                      <td style={{ padding: "8px 10px", color: "#94A3B8" }}>{c.type}</td>
                      <td style={{ padding: "8px 10px", color: "#F59E0B", fontWeight: 700, whiteSpace: "nowrap" }}>{c.amount}</td>
                      <td style={{ padding: "8px 10px", color: "#94A3B8", whiteSpace: "nowrap" }}>{c.duration}</td>
                      <td style={{ padding: "8px 10px", color: "#94A3B8", fontSize: 11, maxWidth: 220 }}>{c.deploy}</td>
                      <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                          background: c.status.includes("Active") || c.status.includes("Operational") || c.status.includes("Closed") ? "rgba(16,185,129,0.12)" : c.status.includes("construction") || c.status.includes("development") ? "rgba(245,158,11,0.12)" : "rgba(59,130,246,0.12)",
                          color: c.status.includes("Active") || c.status.includes("Operational") || c.status.includes("Closed") ? "#10B981" : c.status.includes("construction") || c.status.includes("development") ? "#F59E0B" : "#3B82F6",
                        }}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 10, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>
              Sources: Company announcements, SEC filings, CNBC, Bloomberg, The Information, TechCrunch. Amounts are reported commitments and may include multi-year estimates.
            </div>
          </div>
          </>
          );
        })()}

        {/* Public Equity Exposure */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Public Equity Exposure</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {lab.equity.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  minWidth: 70, padding: "6px 10px", borderRadius: 6,
                  background: `${e.color}18`, border: `1px solid ${e.color}40`,
                  fontSize: 16, fontWeight: 700, color: e.color, textAlign: "center", letterSpacing: "0.5px",
                }}>
                  {e.ticker}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#E2E8F0", minWidth: 100 }}>{e.name}</div>
                <div style={{ fontSize: 14, color: "#94A3B8", flex: 1 }}>{e.exposure}</div>
              </div>
            ))}
          </div>
        </div>



        </>)}

        </>);
      })()}

      {/* ===== AI-NATIVE TAB ===== */}
      {mainTab === "ainative" && (<>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>AI-Native Platforms</div>
        <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>AI-native companies with $100M+ ARR. These platforms represent the demand side of the GPU compute stack — every dollar of AI-native revenue ultimately requires GPU infrastructure from hyperscalers and neoclouds like CoreWeave.</div>

        {/* Growth Trend Cards */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "AI-Native $50M+ ARR Companies", value: "30-50", sub: "Up from ~3 in 2023", color: "#10B981" },
            { label: "Fastest 0→$1B ARR", value: "Cursor", sub: "24 months (Nov 2025). Previous record: ChatGPT ~18 months.", color: "#3B82F6" },
            { label: "AI-Native vs SaaS Speed", value: "2x faster", sub: "AI-native cos reach $1M ARR in half the time of B2B SaaS", color: "#F59E0B" },
            { label: "2026 AI Startup Funding", value: "$15B+ in 49 days", sub: "17 US AI cos raised $100M+ in first 49 days of 2026", color: "#8B5CF6" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: "14px 18px", flex: "1 1 180px", minWidth: 180 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* AI Startup Formation Trend */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4 }}>AI Startup Formation Trend</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>AI startup formation has exploded since ChatGPT's launch (Nov 2022). Nearly 1 in 4 new startups is now an AI company (PitchBook). AI captured ~50% of all global VC funding in 2025.</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
              <thead>
                <tr>
                  {["Year", "New AI Startups (US)", "GenAI VC Funding", "AI % of All VC", "Companies at $50M+ ARR", "Key Catalyst"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { year: "2026E", startups: "~2,500-3,500 est.", funding: "Tracking higher", pct: ">50%", arr50: "30-50+", catalyst: "17 US cos raise $100M+ in first 49 days. 1 in 4 new startups is AI (PitchBook)." },
                  { year: "2025", startups: "~1,500-2,000 est.", funding: "$202.3B (all AI)", pct: "~50%", arr50: "~20-30", catalyst: "AI-native at scale. Cursor hits $1B ARR in 24 months. 55 US cos raise $100M+." },
                  { year: "2024", startups: "~1,000-1,500 est.", funding: "~$45B+", pct: "~35%", arr50: "~10-15", catalyst: "AI coding, agents, vertical AI. 8 companies raise $1B+ rounds." },
                  { year: "2023", startups: "~700-900 est.", funding: "$29.1B (+469%)", pct: "~20%", arr50: "~5-8", catalyst: "GPT-4. Enterprise adoption wave. 691 GenAI deals." },
                  { year: "2022", startups: "524 (confirmed)", funding: "$5.1B", pct: "~12%", arr50: "~2-3", catalyst: "ChatGPT launches Nov 2022. Inflection point." },
                  { year: "2021", startups: "~300-400", funding: "~$3B", pct: "~8%", arr50: "~1-2", catalyst: "GitHub Copilot, DALL-E. Developer tools emerge." },
                  { year: "2020", startups: "~200-300", funding: "~$1B", pct: "~5%", arr50: "~0", catalyst: "GPT-3 launch. AI still niche." },
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#3B82F6" }}>{row.year}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F8FAFC", fontWeight: 600 }}>{row.startups}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#10B981", fontWeight: 600 }}>{row.funding}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.pct}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F8FAFC", fontWeight: 700, fontSize: 14 }}>{row.arr50}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 11 }}>{row.catalyst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Company Table */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>AI-Native Companies ($50M+ ARR)</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 900 }}>
              <thead>
                <tr>
                  {["Company", "Sector", "Valuation", "ARR", "ARR Date", "Founded", "Funding", "Disrupts"].map(h => (
                    <th key={h} style={{ textAlign: h === "Company" || h === "Sector" || h === "Disrupts" ? "left" : "right", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Cursor (Anysphere)", sector: "AI Coding", val: "$29.3B → $50B", arr: "$2.0B+", arrDate: "Feb 2026", founded: "2022", funding: "$3.3B", disrupts: "GitHub Copilot, VS Code, JetBrains", color: "#3B82F6" },
                  { name: "Poolside", sector: "AI Coding / Agents", val: "$12B", arr: "~$50M", arrDate: "Mar 2025", founded: "2023", funding: "~$2B+ (Series C)", disrupts: "Enterprise SWE, coding agents. CoreWeave anchor tenant — 40K+ GB300 GPUs, 2GW Project Horizon campus (TX)", color: "#06B6D4" },
                  { name: "Perplexity", sector: "AI Search", val: "$20B", arr: "$100M+", arrDate: "2025E", founded: "2022", funding: "$1.5B+", disrupts: "Google Search, Wikipedia", color: "#6366F1" },
                  { name: "Scale AI", sector: "Data/Labeling", val: "$14B", arr: "Est. $500M+", arrDate: "2025E", founded: "2016", funding: "$1.6B+", disrupts: "Data labeling, AI training data", color: "#3B82F6" },
                  { name: "OpenEvidence", sector: "Healthcare AI", val: "$12B", arr: "$100M", arrDate: "Jan 2026", founded: "2022", funding: "$700M", disrupts: "UpToDate, Epocrates, clinical tools", color: "#EF4444" },
                  { name: "ElevenLabs", sector: "AI Voice/Audio", val: "$11B", arr: "$330M+", arrDate: "YE 2025", founded: "2022", funding: "$500M+", disrupts: "Voice actors, audio production, dubbing", color: "#F97316" },
                  { name: "Cognition (Devin)", sector: "AI SWE Agent", val: "$10.2B", arr: "~$100M", arrDate: "Mid 2025E", founded: "2021", funding: "$600M+", disrupts: "Offshore dev, traditional SWE", color: "#8B5CF6" },
                  { name: "Sierra", sector: "Enterprise AI Agents", val: "$10B", arr: "$150M", arrDate: "Jan 2026", founded: "2023", funding: "$585M", disrupts: "Zendesk, Salesforce Service Cloud", color: "#10B981" },
                  { name: "Mistral AI", sector: "Open-Source LLM", val: "$8-10B", arr: "~$600M", arrDate: "2025E", founded: "2023", funding: "$1.1B+", disrupts: "OpenAI, enterprise LLM deployments", color: "#EF4444" },
                  { name: "Harvey", sector: "Legal AI", val: "$8B → $11B", arr: "$190M", arrDate: "Dec 2025", founded: "2022", funding: "$960M+", disrupts: "Westlaw, LexisNexis, Casetext", color: "#F59E0B" },
                  { name: "Glean", sector: "Enterprise AI Search", val: "$7.2B", arr: "$200M", arrDate: "Dec 2025", founded: "2019", funding: "$410M", disrupts: "Microsoft Copilot, Coveo, Elastic", color: "#0EA5E9" },
                  { name: "Cohere", sector: "Enterprise LLM", val: "$5.5B", arr: "~$60M", arrDate: "2025E", founded: "2019", funding: "$1B+", disrupts: "OpenAI Enterprise, on-prem LLM", color: "#10B981" },
                  { name: "Lovable", sector: "Vibe Coding", val: "$5B", arr: "$400M", arrDate: "Mar 2026", founded: "2024", funding: "$545M", disrupts: "Wix, Squarespace, Webflow", color: "#EC4899" },
                  { name: "Runway", sector: "AI Video / World Models", val: "$5.3B", arr: "~$265M (2026E)", arrDate: "2026E", founded: "2018", funding: "$860M", disrupts: "Video production, VFX, world simulation. CoreWeave powers training on GB300 NVL72 (Dec 2025 deal)", color: "#A855F7" },
                  { name: "Synthesia", sector: "AI Video Avatars", val: "$2.1B", arr: "$100M+", arrDate: "Apr 2025", founded: "2017", funding: "$330M+", disrupts: "Corporate training video, production studios", color: "#8B5CF6" },
                  { name: "Pika", sector: "AI Video Gen", val: "$2B", arr: "~$50M", arrDate: "2025E", founded: "2023", funding: "$235M", disrupts: "Video editing, motion graphics", color: "#EC4899" },
                  { name: "Midjourney", sector: "AI Image Gen", val: "Bootstrapped", arr: "$500M", arrDate: "2025", founded: "2022", funding: "$0 (self-funded)", disrupts: "Adobe, stock photography, designers", color: "#F97316" },
                  { name: "Jasper", sector: "AI Content", val: "$1.5B", arr: "~$180M", arrDate: "2025E", founded: "2021", funding: "$300M+", disrupts: "Copywriters, content marketing tools", color: "#94A3B8" },
                  { name: "HeyGen", sector: "AI Video", val: "$1.3B", arr: "~$95M", arrDate: "Sep 2025", founded: "2020", funding: "$240M+", disrupts: "Video production, localization", color: "#F59E0B" },
                  { name: "Replit", sector: "AI Coding/IDE", val: "$1.2B", arr: "~$50M", arrDate: "2025E", founded: "2016", funding: "$300M+", disrupts: "Development environments, cloud IDEs", color: "#F97316" },
                  { name: "EliseAI", sector: "Real Estate AI", val: "TBD", arr: "$100M+", arrDate: "2025", founded: "2017", funding: "$200M+", disrupts: "Property management, leasing tools", color: "#3B82F6" },
                  { name: "Emergent", sector: "Vibe Coding", val: "TBD", arr: "$100M", arrDate: "Feb 2026", founded: "2025", funding: "TBD", disrupts: "Mobile dev tools, low-code", color: "#A855F7" },
                ].map((co, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: co.color }}>{co.name}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>{co.sector}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#F8FAFC", fontWeight: 600 }}>{co.val}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#10B981", fontWeight: 700 }}>{co.arr}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#94A3B8", fontSize: 11 }}>{co.arrDate}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#94A3B8" }}>{co.founded}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#E2E8F0", fontSize: 11 }}>{co.funding}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F59E0B", fontSize: 11 }}>{co.disrupts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </>)}

      {/* ===== AI CAPEX TAB ===== */}
      {mainTab === "capex" && (() => {
        // Build chart data for top 5 trajectory
        const years = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
        const top5ChartData = years.map(yr => {
          const row = { year: yr.toString() };
          let isEst = false;
          AI_CAPEX_DATA.top5.forEach(co => {
            const pt = co.capex.find(c => c.year === yr);
            if (pt) { row[co.name] = pt.value; if (pt.est) isEst = true; }
          });
          row.est = isEst;
          return row;
        });
        // Aggregate chart data
        const aggChartData = AI_CAPEX_DATA.aggregate.map(a => ({
          year: a.year.toString(),
          total: a.value,
          est: !!a.est,
        }));
        // Top 5 total 2025+2026
        const top5Total2026 = AI_CAPEX_DATA.top5.reduce((s, co) => {
          const pt = co.capex.find(c => c.year === 2026);
          return s + (pt ? pt.value : 0);
        }, 0);
        const top5Total2025 = AI_CAPEX_DATA.top5.reduce((s, co) => {
          const pt = co.capex.find(c => c.year === 2025);
          return s + (pt ? pt.value : 0);
        }, 0);
        const top5Total2024 = AI_CAPEX_DATA.top5.reduce((s, co) => {
          const pt = co.capex.find(c => c.year === 2024);
          return s + (pt ? pt.value : 0);
        }, 0);
        const yoyGrowth = top5Total2025 > 0 ? ((top5Total2026 / top5Total2025 - 1) * 100) : 0;
        const mc = (label, value, sub, color) => (
          <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: "16px 20px", flex: "1 1 0" }}>
            <div style={{ fontSize: 12, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: color || "#F8FAFC", letterSpacing: "-0.5px" }}>{value}</div>
            {sub && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{sub}</div>}
          </div>
        );
        return (<>
        {/* Header */}
        <div style={{ marginBottom: 28, borderBottom: "1px solid #1E293B", paddingBottom: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>AI Capex Tracker</div>
          <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 5 }}>Hyperscaler &amp; neocloud infrastructure spending · 2022–2030</div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
          {mc("2024 Actual (Top 5)", `$${top5Total2024}B`, "Amazon $83B · Alphabet $53B · MSFT $44B · Meta $39B · Oracle $12B")}
          {mc("2025 Estimate (Top 5)", `$${top5Total2025}B`, `+${((top5Total2025 / top5Total2024 - 1) * 100).toFixed(0)}% y/y`, "#F59E0B")}
          {mc("2026 Estimate (Top 5)", `$${top5Total2026}B`, `+${yoyGrowth.toFixed(0)}% y/y · ~75% for AI infra`, "#3B82F6")}
          {mc("2026E All Players", `$${AI_CAPEX_DATA.aggregate.find(a => a.year === 2026)?.value || 0}B`, "Top 5 + neoclouds + others", "#10B981")}
        </div>

        {/* Top 5 Trajectory Chart */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>Top 5 Capex Trajectory ($B)</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Dashed lines = estimates · Solid = reported actuals</div>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {AI_CAPEX_DATA.top5.map(co => (
                <div key={co.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                  <div style={{ width: 12, height: 3, borderRadius: 1, background: co.color }} />
                  <span style={{ color: "#94A3B8" }}>{co.name.split(" (")[0]}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={top5ChartData} margin={{ top: 12, right: 16, left: 8, bottom: 4 }}>
              <defs>
                {AI_CAPEX_DATA.top5.map(co => (
                  <linearGradient key={co.name} id={`capex-grad-${co.ticker}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={co.color} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={co.color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="year" tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={{ stroke: "#1E293B" }} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => `$${v}B`} />
              <Tooltip
                contentStyle={{ background: "rgba(15,23,42,0.95)", border: "1px solid #334155", borderRadius: 8, fontSize: 13, color: "#E2E8F0" }}
                formatter={(value, name) => [`$${value}B`, name.split(" (")[0]]}
                labelFormatter={(label, payload) => {
                  const isEst = payload?.[0]?.payload?.est;
                  return `${label}${isEst ? " (Estimate)" : ""}`;
                }}
              />
              {AI_CAPEX_DATA.top5.map(co => (
                <Area
                  key={co.name}
                  type="monotone"
                  dataKey={co.name}
                  stroke={co.color}
                  strokeWidth={2.5}
                  fill={`url(#capex-grad-${co.ticker})`}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    const pt = co.capex.find(c => c.year === parseInt(payload.year));
                    if (!pt) return null;
                    return <circle cx={cx} cy={cy} r={pt.est ? 3 : 4} fill={pt.est ? "transparent" : co.color} stroke={co.color} strokeWidth={pt.est ? 1.5 : 0} strokeDasharray={pt.est ? "3 2" : "none"} />;
                  }}
                  strokeDasharray={(function() { return undefined; })()}
                  connectNulls
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Aggregate Total Bar Chart */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Aggregate AI Infrastructure Capex ($B) — All Players</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 180, padding: "0 8px" }}>
            {aggChartData.map((d) => {
              const maxVal = Math.max(...aggChartData.map(a => a.total));
              const h = (d.total / maxVal) * 160;
              return (
                <div key={d.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: d.est ? "#94A3B8" : "#F8FAFC" }}>${d.total}B</div>
                  <div style={{
                    width: "100%", maxWidth: 64, height: h, borderRadius: "6px 6px 2px 2px",
                    background: d.est ? "linear-gradient(180deg, #1E40AF 0%, #1E293B 100%)" : "linear-gradient(180deg, #3B82F6 0%, #1E40AF 100%)",
                    border: d.est ? "1px dashed #3B82F6" : "none",
                    transition: "height 0.3s",
                  }} />
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{d.year}</div>
                  {d.est && <div style={{ fontSize: 9, color: "#94A3B8" }}>Est.</div>}
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 12, fontStyle: "italic" }}>Sources: CreditSights, Goldman Sachs, BofA, company earnings guidance. Includes top 5 hyperscalers + neoclouds + other AI infra spenders.</div>
        </div>

        {/* Cloud Revenue, Margin & Capex Table */}
        {(() => {
          const yrRange = [2022,2023,2024,2025,2026,2027,2028,2029,2030];
          const getYoY = (data, yr) => {
            const cur = data?.find(d => d.year === yr)?.value;
            const prev = data?.find(d => d.year === yr - 1)?.value;
            if (cur == null || prev == null || prev === 0) return null;
            return ((cur / prev - 1) * 100);
          };
          return (
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>Cloud Revenue, Margin &amp; Capex ($B / %)</div>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>Company</th>
                <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", borderBottom: "1px solid #1E293B" }}>Metric</th>
                {yrRange.map(yr => (
                  <th key={yr} style={{ textAlign: "right", padding: "8px 6px", fontSize: 10, fontWeight: 600, color: yr >= 2026 ? "#94A3B8" : "#E2E8F0", textTransform: "uppercase", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>
                    {yr}{yr >= 2026 ? "E" : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AI_CAPEX_DATA.revenueVsCapex.map((co) => {
                const rows = [
                  { metric: "Revenue", data: co.rev, fmt: (v) => `$${v}B`, bold: true },
                  { metric: "Revenue y/y", isYoY: true, srcData: co.rev },
                  { metric: "Op. Margin", data: co.margin, fmt: (v) => `${v}%`, bold: false },
                  { metric: "Capex", data: co.capex, fmt: (v) => `$${v}B`, bold: false },
                  { metric: "Capex y/y", isYoY: true, srcData: co.capex },
                ];
                return rows.map((row, ri) => (
                  <tr key={co.name + ri}
                    onMouseEnter={e => e.currentTarget.style.background = "#1E293B20"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {ri === 0 ? (
                      <td rowSpan={5} style={{ padding: "8px 10px", borderBottom: "2px solid #1E293B", fontWeight: 700, color: co.color, fontSize: 13, verticalAlign: "top" }}>
                        {co.name}
                      </td>
                    ) : null}
                    <td style={{ padding: "5px 10px", borderBottom: ri === 4 ? "2px solid #1E293B" : "1px solid #1E293B08", color: row.isYoY ? "#94A3B8" : "#94A3B8", fontSize: row.isYoY ? 10 : 11, fontWeight: 600, fontStyle: row.isYoY ? "italic" : "normal" }}>{row.metric}</td>
                    {yrRange.map(yr => {
                      if (row.isYoY) {
                        const yoy = getYoY(row.srcData, yr);
                        return (
                          <td key={yr} style={{ padding: "4px 6px", borderBottom: ri === 4 ? "2px solid #1E293B" : "1px solid #1E293B08", textAlign: "right", fontSize: 10, fontVariantNumeric: "tabular-nums", color: yoy == null ? "#94A3B8" : yoy >= 0 ? "#10B981" : "#EF4444" }}>
                            {yoy != null ? `${yoy >= 0 ? "+" : ""}${yoy.toFixed(0)}%` : "—"}
                          </td>
                        );
                      }
                      const pt = row.data?.find(d => d.year === yr);
                      const val = pt?.value;
                      const isEst = pt?.est;
                      const isNeg = val < 0;
                      return (
                        <td key={yr} style={{
                          padding: "5px 6px", borderBottom: ri === 4 ? "2px solid #1E293B" : "1px solid #1E293B08",
                          textAlign: "right", fontVariantNumeric: "tabular-nums",
                          color: row.metric === "Op. Margin" ? (isNeg ? "#EF4444" : val >= 40 ? "#10B981" : "#E2E8F0") : (isEst ? "#94A3B8" : "#E2E8F0"),
                          fontWeight: row.bold ? 600 : 400, fontSize: 12,
                        }}>
                          {val != null ? row.fmt(val) : "—"}
                        </td>
                      );
                    })}
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
          );
        })()}

        {/* Top 5 Detail Cards */}
        <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Top 5 Hyperscalers — Detail</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {AI_CAPEX_DATA.top5.map((co, idx) => {
            const cap2026 = co.capex.find(c => c.year === 2026)?.value || 0;
            const cap2025 = co.capex.find(c => c.year === 2025)?.value || 0;
            const cap2024 = co.capex.find(c => c.year === 2024)?.value || 0;
            const yoy = cap2025 > 0 ? ((cap2026 / cap2025 - 1) * 100) : 0;
            return (
              <div key={co.name} style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, borderLeft: `3px solid ${co.color}` }}>
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: co.color, background: `${co.color}18`, padding: "3px 8px", borderRadius: 4 }}>#{idx + 1}</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>{co.name}</span>
                    <span style={{ fontSize: 13, color: "#94A3B8" }}>{co.ticker}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, textAlign: "right" }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>2024A</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#94A3B8" }}>${cap2024}B</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>2025E</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0" }}>${cap2025}B</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>2026E</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: co.color }}>${cap2026}B</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>y/y</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: yoy >= 0 ? "#10B981" : "#EF4444" }}>+{yoy.toFixed(0)}%</div>
                    </div>
                  </div>
                </div>

                {/* Inline trajectory sparkline */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 48 }}>
                    {co.capex.map((pt) => {
                      const maxV = Math.max(...co.capex.map(c => c.value));
                      const h = (pt.value / maxV) * 44;
                      return (
                        <div key={pt.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                          <div style={{ fontSize: 9, color: pt.est ? "#94A3B8" : "#CBD5E1", fontWeight: 600 }}>{pt.value}</div>
                          <div style={{
                            width: "100%", maxWidth: 40, height: Math.max(h, 3), borderRadius: "3px 3px 1px 1px",
                            background: pt.est ? `${co.color}50` : co.color,
                            border: pt.est ? `1px dashed ${co.color}` : "none",
                          }} />
                          <div style={{ fontSize: 8, color: "#94A3B8" }}>{pt.year.toString().slice(-2)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3-column info grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Spending On</div>
                    <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.spendingOn}</div>
                  </div>
                  <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Major News &amp; Contracts</div>
                    <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.news}</div>
                  </div>
                  <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Key Partners</div>
                    <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.partners}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ranks 6–20 Table */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1E293B" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px" }}>Neoclouds, Big Tech &amp; Other Major Spenders (Ranks 6–20)</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Total 6-20: ${AI_CAPEX_DATA.others.reduce((s, c) => s + c.capex2026, 0)}B (2026E)</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr>
                {["#", "Company", "Ticker", "2025E", "2026E", "2027E", "y/y", "2026E Scale", "Status & Notes"].map((h, i) => (
                  <th key={i} style={{
                    textAlign: i >= 3 && i <= 7 ? "right" : "left",
                    padding: "10px 12px", fontSize: 10, fontWeight: 600, color: "#94A3B8",
                    textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B",
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AI_CAPEX_DATA.others.map((co) => {
                const yoy = co.capex2025 > 0 ? ((co.capex2026 / co.capex2025 - 1) * 100) : 0;
                const maxCapex = Math.max(...AI_CAPEX_DATA.others.map(c => c.capex2026));
                const barPct = (co.capex2026 / maxCapex) * 100;
                const isTop10 = co.rank <= 10;
                return (
                  <tr key={co.name}
                    style={{ background: isTop10 ? "#111827" : "transparent", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1E293B40"}
                    onMouseLeave={e => e.currentTarget.style.background = isTop10 ? "#111827" : "transparent"}
                  >
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: co.color, fontSize: 13 }}>#{co.rank}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10" }}>
                      <div style={{ fontWeight: 700, color: "#F8FAFC", fontSize: 14 }}>{co.name}</div>
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{co.ticker}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", textAlign: "right", fontWeight: 600, color: "#94A3B8", fontVariantNumeric: "tabular-nums", fontSize: 14 }}>${co.capex2025}B</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", textAlign: "right", fontWeight: 700, color: co.color, fontVariantNumeric: "tabular-nums", fontSize: 14 }}>${co.capex2026}B</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", textAlign: "right", fontWeight: 600, color: "#E2E8F0", fontVariantNumeric: "tabular-nums", fontSize: 14 }}>${co.capex2027}B</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", textAlign: "right", fontWeight: 600, color: yoy >= 50 ? "#F59E0B" : "#10B981", fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
                      {co.capex2025 > 0 ? `+${yoy.toFixed(0)}%` : "—"}
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                        <div style={{ width: 80, height: 8, background: "#1E293B", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: `${barPct}%`, height: "100%", background: co.color, borderRadius: 4, transition: "width 0.3s" }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11, maxWidth: 380, lineHeight: 1.5 }}>{co.status}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: "#1E293B40" }}>
                <td colSpan={3} style={{ padding: "10px 12px", fontWeight: 700, color: "#F8FAFC", fontSize: 13 }}>Total (Ranks 6–20)</td>
                <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#94A3B8", fontSize: 14, fontVariantNumeric: "tabular-nums" }}>${AI_CAPEX_DATA.others.reduce((s, c) => s + c.capex2025, 0)}B</td>
                <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#3B82F6", fontSize: 14, fontVariantNumeric: "tabular-nums" }}>${AI_CAPEX_DATA.others.reduce((s, c) => s + c.capex2026, 0)}B</td>
                <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#E2E8F0", fontSize: 14, fontVariantNumeric: "tabular-nums" }}>${AI_CAPEX_DATA.others.reduce((s, c) => s + c.capex2027, 0)}B</td>
                <td style={{ padding: "10px 12px" }}></td>
                <td style={{ padding: "10px 12px" }}></td>
                <td style={{ padding: "10px 12px" }}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Key Themes */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Key Themes &amp; Observations</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "⚡", title: "Supply-Constrained, Not Demand-Constrained", text: "All hyperscalers report demand exceeding available capacity. GPU lead times remain 6-12 months. The constraint is buildout speed, not customer demand." },
              { icon: "💰", title: "Debt-Funded Buildout", text: "Hyperscalers raised $108B in debt in 2025. BofA projects $1.5T total over coming years. Capex now consumes ~90% of operating cash flow minus dividends." },
              { icon: "🏗️", title: "Capital Intensity at Industrial Levels", text: "Capital intensity reached 45-57% of revenue — resembling utilities, not tech companies. ORCL at 57%, MSFT at 45%, a structural shift from historically asset-light models." },
              { icon: "🔧", title: "Custom Silicon Rising", text: "Google TPU v7, Amazon Trainium3, Meta MTIA, Microsoft Maia — all pursuing custom chips to reduce Nvidia dependency and optimize TCO for proprietary workloads." },
              { icon: "🌐", title: "Neoclouds Filling the Gap", text: "CoreWeave, Nebius, Lambda offer 40-60% lower GPU rental costs vs. hyperscalers. CoreWeave's $66.8B backlog validates demand. NVIDIA holds ~6% equity stake in CoreWeave." },
              { icon: "📈", title: "Top 5 Cumulative 2025-2027: ~$1.8T", text: "Goldman initially projected $1.15T for 2025-2027, but post-earnings guidance revisions pushed the total toward ~$1.8T for the top 5 alone. AI infra spend approaching 4.4% of GDP, near dotcom peak." },
            ].map((item, idx) => (
              <div key={idx} style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{item.title}</span>
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </>);
      })()}

      {mainTab === "semicapex" && (() => {
        const years = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
        const companies = SEMI_CAPEX_DATA.companies;
        // Chart data
        const chartData = years.map(yr => {
          const row = { year: yr.toString() };
          let isEst = false;
          companies.forEach(co => {
            const pt = co.capex.find(c => c.year === yr);
            if (pt) { row[co.name] = pt.value; if (pt.est) isEst = true; }
          });
          row.est = isEst;
          return row;
        });

        return (<>
        <div style={{ marginBottom: 28, borderBottom: "1px solid #1E293B", paddingBottom: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Semi Capex</div>
          <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 5 }}>Semiconductor supply chain capex · Foundry, Memory/HBM, ASIC · 2020–2030</div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
          {[
            { label: "TSMC 2026E", value: "$54B", sub: "+33% y/y · 70-80% advanced nodes (2/3nm)", color: "#10B981" },
            { label: "DRAM Industry 2026E", value: "$69.5B", sub: "SK Hynix $26B + Samsung $30B + Micron $13.5B", color: "#F59E0B" },
            { label: "HBM Market 2026", value: "Sold Out", sub: "All 3 vendors sold out. HBM4 ramp H1 2026", color: "#EF4444" },
            { label: "Capex → Supply Lag", value: "18-24 mo", sub: "Capex today → volume production 1.5-2 yrs later", color: "#3B82F6" },
          ].map((c, i) => (
            <div key={i} style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: "16px 20px", flex: "1 1 0" }}>
              <div style={{ fontSize: 12, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: c.color, letterSpacing: "-0.5px" }}>{c.value}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Trajectory Chart */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>Capex Trajectory by Company ($B)</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Dashed = estimates · Solid = reported</div>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {companies.map(co => (
                <div key={co.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                  <div style={{ width: 12, height: 3, borderRadius: 1, background: co.color }} />
                  <span style={{ color: "#94A3B8" }}>{co.name}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={chartData} margin={{ top: 12, right: 16, left: 8, bottom: 4 }}>
              <defs>
                {companies.map(co => (
                  <linearGradient key={co.name} id={`semi-grad-${co.ticker}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={co.color} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={co.color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="year" tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={{ stroke: "#1E293B" }} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => `$${v}B`} />
              <Tooltip contentStyle={{ background: "rgba(15,23,42,0.95)", border: "1px solid #334155", borderRadius: 8, fontSize: 13, color: "#E2E8F0" }}
                formatter={(value, name) => [`$${value}B`, name]} />
              {companies.map(co => (
                <Area key={co.name} type="monotone" dataKey={co.name} stroke={co.color} strokeWidth={2.5}
                  fill={`url(#semi-grad-${co.ticker})`} dot={{ r: 3 }} connectNulls />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue, Gross Margin & Capex Table per Company */}
        {(() => {
          const getYoY = (data, yr) => {
            const cur = data?.find(d => d.year === yr)?.value;
            const prev = data?.find(d => d.year === yr - 1)?.value;
            if (cur == null || prev == null || prev <= 0) return null;
            return ((cur / prev - 1) * 100);
          };
          return (
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>Revenue, Gross Margin &amp; Capex ($B / %)</div>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>Company</th>
                <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", borderBottom: "1px solid #1E293B" }}>Metric</th>
                {years.map(yr => (
                  <th key={yr} style={{ textAlign: "right", padding: "8px 6px", fontSize: 10, fontWeight: 600, color: yr >= 2026 ? "#94A3B8" : "#E2E8F0", textTransform: "uppercase", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>
                    {yr}{yr >= 2026 ? "E" : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companies.map((co) => {
                const rows = [
                  { metric: "Revenue", data: co.revenue, fmt: (v) => `$${v}B`, bold: true },
                  { metric: "Revenue y/y", isYoY: true, srcData: co.revenue },
                  { metric: "Gross Margin", data: co.grossMargin, fmt: (v) => `${v}%`, bold: false },
                  { metric: "Capex", data: co.capex, fmt: (v) => `$${v}B`, bold: false },
                  { metric: "Capex y/y", isYoY: true, srcData: co.capex },
                ];
                return rows.map((row, ri) => (
                  <tr key={co.name + ri}
                    onMouseEnter={e => e.currentTarget.style.background = "#1E293B20"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {ri === 0 ? (
                      <td rowSpan={5} style={{ padding: "8px 10px", borderBottom: "2px solid #1E293B", fontWeight: 700, color: co.color, fontSize: 13, verticalAlign: "top" }}>
                        {co.name}<br/><span style={{ fontSize: 10, fontWeight: 400, color: "#94A3B8" }}>{co.segment}</span>
                      </td>
                    ) : null}
                    <td style={{ padding: "5px 10px", borderBottom: ri === 4 ? "2px solid #1E293B" : "1px solid #1E293B08", color: "#94A3B8", fontSize: row.isYoY ? 10 : 11, fontWeight: 600, fontStyle: row.isYoY ? "italic" : "normal" }}>{row.metric}</td>
                    {years.map(yr => {
                      if (row.isYoY) {
                        const yoy = getYoY(row.srcData, yr);
                        return (
                          <td key={yr} style={{ padding: "4px 6px", borderBottom: ri === 4 ? "2px solid #1E293B" : "1px solid #1E293B08", textAlign: "right", fontSize: 10, fontVariantNumeric: "tabular-nums", color: yoy == null ? "#94A3B8" : yoy >= 0 ? "#10B981" : "#EF4444" }}>
                            {yoy != null ? `${yoy >= 0 ? "+" : ""}${yoy.toFixed(0)}%` : "—"}
                          </td>
                        );
                      }
                      const pt = row.data?.find(d => d.year === yr);
                      const val = pt?.value;
                      const isEst = pt?.est;
                      const isNeg = val < 0;
                      return (
                        <td key={yr} style={{
                          padding: "5px 6px", borderBottom: ri === 4 ? "2px solid #1E293B" : "1px solid #1E293B08",
                          textAlign: "right", fontVariantNumeric: "tabular-nums",
                          color: row.metric === "Gross Margin" ? (isNeg ? "#EF4444" : val >= 50 ? "#10B981" : "#E2E8F0") : (isEst ? "#94A3B8" : "#E2E8F0"),
                          fontWeight: row.bold ? 600 : 400, fontSize: 12,
                        }}>
                          {val != null ? row.fmt(val) : "—"}
                        </td>
                      );
                    })}
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
          );
        })()}


        {/* Company Detail Cards */}
        <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Company Detail</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {companies.map((co) => {
            const cap26 = co.capex.find(c => c.year === 2026)?.value || 0;
            const cap25 = co.capex.find(c => c.year === 2025)?.value || 0;
            const cap24 = co.capex.find(c => c.year === 2024)?.value || 0;
            const yoy = cap25 > 0 ? ((cap26 / cap25 - 1) * 100) : 0;
            return (
              <div key={co.name} style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, borderLeft: `3px solid ${co.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>{co.name}</span>
                    <span style={{ fontSize: 13, color: "#94A3B8" }}>{co.ticker} · {co.segment}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, textAlign: "right" }}>
                    <div><div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>2024A</div><div style={{ fontSize: 16, fontWeight: 700, color: "#94A3B8" }}>${cap24}B</div></div>
                    <div><div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>2025</div><div style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0" }}>${cap25}B</div></div>
                    <div><div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>2026E</div><div style={{ fontSize: 20, fontWeight: 700, color: co.color }}>${cap26}B</div></div>
                    <div><div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>y/y</div><div style={{ fontSize: 16, fontWeight: 700, color: yoy >= 0 ? "#10B981" : "#EF4444" }}>{yoy >= 0 ? "+" : ""}{yoy.toFixed(0)}%</div></div>
                  </div>
                </div>
                {/* 3-column info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Capex Breakdown</div>
                    <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.breakdown}</div>
                  </div>
                  <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Capex → Supply Timeline</div>
                    <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.supplyTimeline}</div>
                  </div>
                  <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Key Notes</div>
                    <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.notes}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Themes */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Key Themes</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "⏱️", title: "18-24 Month Capex-to-Supply Lag", text: "TSMC N2 capex in 2025 → volume production H1 2026. SK Hynix HBM4 equipment prep Q1 2026 → Union Fab production Q1 2027. Micron ID1 fab capex 2024-2026 → operational 2027+. This lag means today's capex signals supply availability 2 years out." },
              { icon: "🔧", title: "CoWoS Packaging is the Bottleneck", text: "TSMC allocating 10-20% of capex ($5-10B) to advanced packaging. CoWoS capacity target: 150K wafers/mo by end 2026 (4x late-2024). Nvidia secured ~70% of 2025 CoWoS-L capacity. Packaging, not transistors, is the binding constraint." },
              { icon: "💾", title: "HBM Sold Out Through 2026", text: "All 3 memory vendors (SK Hynix 53%, Samsung 35%, Micron 11% share) report HBM sold out for 2026. HBM4 transition from HBM3E adds complexity. Wafer consumption ratio: HBM uses 2.5-3x more silicon than conventional DRAM." },
              { icon: "🏭", title: "Capex Shifting from Quantity to Quality", text: "DRAM capex growing only 14% YoY despite massive demand — limited by cleanroom availability. Investment shifting to process upgrades (1-gamma node), higher stacking (12-Hi → 16-Hi), and hybrid bonding rather than raw wafer capacity expansion." },
              { icon: "🌐", title: "Geographic Diversification Drives Cost Up", text: "TSMC Arizona (N3/N2), Samsung Taylor TX, Micron NY/Idaho, Intel Ohio — overseas fabs cost 30-50% more than Asian equivalents. TSMC's $17B Japan Kumamoto upgrade for 3nm. Trade deals and CHIPS Act subsidies offset some premium." },
              { icon: "📈", title: "Semi Capex Lags AI Capex by Design", text: "Hyperscaler AI capex ($780B in 2026) dwarfs semi capex ($145B) because semis are upstream inputs. Each $1 of semi capex enables ~$5 of downstream AI infrastructure spending. Semi companies are disciplined — memory vendors cut capex 30% in 2023 downturn." },
            ].map((item, idx) => (
              <div key={idx} style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{item.title}</span>
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </>);
      })()}

      {/* ===== GPU & ASIC ROADMAP TAB ===== */}

      {mainTab === "chiproadmap" && (() => {
        const vendors = ["NVIDIA", "AMD", "Google", "Amazon", "Microsoft", "Meta", "OpenAI"];
        const vendorColors = { NVIDIA: "#10B981", AMD: "#EF4444", Google: "#3B82F6", Amazon: "#F59E0B", Microsoft: "#8B5CF6", Meta: "#EC4899", OpenAI: "#6366F1" };
        const filtered = chipVendorFilter === "All" ? CHIP_ROADMAP : CHIP_ROADMAP.filter(c => c.vendor === chipVendorFilter);
        const sorted = [...filtered].sort((a, b) => b.year - a.year || a.vendor.localeCompare(b.vendor));
        // Timeline data by year
        const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];
        const chipsByYear = {};
        CHIP_ROADMAP.forEach(c => { if (!chipsByYear[c.year]) chipsByYear[c.year] = []; chipsByYear[c.year].push(c); });
        // Status colors
        const statusColor = (s) => s === "EOL" ? "#94A3B8" : s === "Shipping" ? "#10B981" : s === "Internal" ? "#8B5CF6" : s.includes("202") ? "#F59E0B" : "#94A3B8";

        return (<>
        <div style={{ marginBottom: 28, borderBottom: "1px solid #1E293B", paddingBottom: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>GPU/ASIC</div>
          <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 5 }}>Tracking AI accelerator generations across NVIDIA, AMD, Google, Amazon, Microsoft, Meta &amp; OpenAI</div>
        </div>

        {/* GPU/ASIC Industry & Market Updates */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#3B82F6" }}>●</span> Industry & Market Updates
          </div>
          <div style={{ maxHeight: 280, overflow: "auto", padding: "12px 16px" }}>
            {GPU_ASIC_NEWS.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ fontSize: 11, color: "#64748B", minWidth: 50, flexShrink: 0, fontWeight: 600, marginTop: 1 }}>{item.date}</span>
                <span style={{ fontSize: 13, color: "#CBD5E1" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Timeline */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 20, overflowX: "auto" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Release Timeline</div>
          {/* Vendor rows */}
          {vendors.filter(v => CHIP_ROADMAP.some(c => c.vendor === v)).map(v => (
            <div key={v} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <div style={{ width: 90, fontSize: 12, fontWeight: 700, color: vendorColors[v], flexShrink: 0 }}>{v}</div>
              <div style={{ display: "flex", flex: 1, gap: 0 }}>
                {years.map(yr => {
                  const chips = CHIP_ROADMAP.filter(c => c.vendor === v && c.year === yr);
                  return (
                    <div key={yr} style={{ flex: 1, minWidth: 0, display: "flex", gap: 3, padding: "2px 4px", borderLeft: "1px solid #1E293B" }}>
                      {chips.map(c => (
                        <div key={c.chip} title={`${c.chip} — ${c.status}\n${c.notes}`} style={{
                          padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                          background: `${vendorColors[v]}20`, color: vendorColors[v],
                          border: `1px solid ${c.status === "Shipping" || c.status === "Internal" ? vendorColors[v] : `${vendorColors[v]}60`}`,
                          borderStyle: c.status === "Shipping" || c.status === "Internal" || c.status === "EOL" ? "solid" : "dashed",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 110, cursor: "default",
                        }}>
                          {c.chip.split(" (")[0]}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {/* Year labels */}
          <div style={{ display: "flex", marginTop: 6 }}>
            <div style={{ width: 90, flexShrink: 0 }} />
            {years.map(yr => (
              <div key={yr} style={{ flex: 1, textAlign: "center", fontSize: 11, color: "#94A3B8", fontWeight: 600, borderLeft: "1px solid #1E293B", padding: "4px 0" }}>{yr}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 11, color: "#94A3B8" }}>
            <span>━ Shipping / Deployed</span>
            <span style={{ borderBottom: "1px dashed #94A3B8", paddingBottom: 1 }}>┅ Planned / Announced</span>
          </div>
        </div>

        {/* Full Specs Table — filterable by vendor */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1E293B" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px" }}>Accelerator Specs</div>
            <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B" }}>
              {["All", ...vendors].map(v => (
                <button key={v} onClick={() => setChipVendorFilter(v)} style={{
                  padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none",
                  background: chipVendorFilter === v ? (v === "All" ? "#3B82F6" : vendorColors[v] || "#3B82F6") : "#111827",
                  color: chipVendorFilter === v ? "#FFF" : "#94A3B8", transition: "all 0.15s",
                }}>{v}</button>
              ))}
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                {["Vendor", "Chip", "Type", "Arch / Node", "Year", "Status", "VRAM", "HBM", "BW (TB/s)", "TDP", "FP8 TFLOPS", "FP4 PFLOPS", "System"].map((h, i) => (
                  <th key={i} style={{
                    textAlign: i >= 6 ? "right" : "left",
                    padding: "8px 10px", fontSize: 10, fontWeight: 600, color: "#94A3B8",
                    textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => (
                <tr key={i} onMouseEnter={e => e.currentTarget.style.background = "#1E293B40"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: vendorColors[c.vendor], fontSize: 13 }}>{c.vendor}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", fontSize: 13 }}>{c.chip}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{c.type}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>{c.arch} · {c.node}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontWeight: 600 }}>{c.year}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: `${statusColor(c.status)}20`, color: statusColor(c.status) }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#E2E8F0", fontVariantNumeric: "tabular-nums" }}>{c.vram > 0 ? `${c.vram.toLocaleString()} GB` : "—"}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#94A3B8", fontSize: 11 }}>{c.hbm}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#E2E8F0", fontVariantNumeric: "tabular-nums" }}>{c.bw > 0 ? `${c.bw.toFixed(1)} TB/s` : "—"}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#E2E8F0", fontVariantNumeric: "tabular-nums" }}>{c.tdp > 0 ? `${c.tdp.toLocaleString()}W` : "—"}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#E2E8F0", fontVariantNumeric: "tabular-nums" }}>{c.fp8 > 0 ? `${c.fp8.toLocaleString()} TFLOPS` : "—"}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#E2E8F0", fontVariantNumeric: "tabular-nums" }}>{c.fp4 > 0 ? (c.fp4 >= 1000 ? `${(c.fp4/1000).toFixed(0)}` : c.fp4.toLocaleString()) : "—"}{c.fp4 > 0 ? (c.fp4 >= 1000 ? " EFLOPS" : " TFLOPS") : ""}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.system}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delivery & Volume Expectations — Current + Upcoming */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Delivery &amp; Volume Expectations — Current &amp; Upcoming</div>
          {(() => {
            const deliveryData = [
              { vendor: "NVIDIA", chip: "Vera Rubin (VR200)", status: "H2 2026", shipDate: "2026-07", vol2025: "—", vol2026: "5.7M units (JPM)", customers: "OpenAI (1st GW), all hyperscalers", notes: "HBM4 288GB · TSMC 3nm · NVL144. First GW for OpenAI H2 2026.", color: "#8B5CF6", sortOrder: 1 },
              { vendor: "NVIDIA", chip: "Blackwell (B200/GB200)", status: "Shipping", shipDate: "2025-03", vol2025: "5.2M units", vol2026: "1.8M (wind-down)", customers: "MSFT, META, AMZN, GOOGL, ORCL", notes: "Sold out thru mid-2026. 3.6M backlog. 25-35K NVL72 racks in 2025.", color: "#10B981", sortOrder: 2 },
              { vendor: "NVIDIA", chip: "Rubin Ultra", status: "H2 2027", shipDate: "2027-07", vol2025: "—", vol2026: "—", customers: "TBD", notes: "Next-gen after Vera Rubin. Annual cadence.", color: "#64748B", sortOrder: 0 },
              { vendor: "AMD", chip: "MI450X Helios", status: "H2 2026", shipDate: "2026-07", vol2025: "—", vol2026: "Ramp begins", customers: "OpenAI (6 GW), Meta (6 GW)", notes: "HBM4 · Full-rack system. $90B OAI + $60-100B Meta deals.", color: "#EF4444", sortOrder: 1 },
              { vendor: "AMD", chip: "MI350X (CDNA 4)", status: "Shipping (Q3 2025)", shipDate: "2025-07", vol2025: "~500K-800K", vol2026: "~1.5M est.", customers: "MSFT, Oracle, Meta, OpenAI", notes: "288GB HBM3e · 3nm · Fastest AMD ramp ever. $22-25K ASP.", color: "#EF4444", sortOrder: 2 },
              { vendor: "Google", chip: "TPU v7 Ironwood", status: "GA 2026", shipDate: "2026-03", vol2025: "Samples", vol2026: "~500K-600K V7E", customers: "Anthropic, Meta (talks), internal", notes: "192GB HBM3e · 44% lower TCO. First merchant sales. V7P $10K.", color: "#3B82F6", sortOrder: 1 },
              { vendor: "Google", chip: "TPU v6 Trillium", status: "Shipping", shipDate: "2024-12", vol2025: "~2.5M units", vol2026: "~1.6M (transition)", customers: "DeepMind, Anthropic, Midjourney", notes: "ASP ~$4,500. Anthropic 1M-chip deal. Meta in talks.", color: "#3B82F6", sortOrder: 2 },
              { vendor: "Amazon", chip: "Trainium3", status: "H1 2026", shipDate: "2026-03", vol2025: "—", vol2026: "Ramp begins", customers: "Anthropic, AWS customers", notes: "4x perf vs T2. Co-designed with Anthropic.", color: "#F59E0B", sortOrder: 1 },
              { vendor: "Amazon", chip: "Trainium2", status: "Shipping (Oct 2025)", shipDate: "2025-10", vol2025: "~1M+ (Rainier)", vol2026: "~2-3M", customers: "Anthropic (primary), Bedrock", notes: "Rainier: 500K→1M+. 30-40% better price-perf. Co-designed.", color: "#F59E0B", sortOrder: 2 },
              { vendor: "Broadcom", chip: "Custom XPUs (TPU, OAI)", status: "Shipping / In dev", shipDate: "2024-06", vol2025: "~2.5M+ (via Google)", vol2026: "~3-4M+", customers: "Google (TPU), OpenAI (custom), Anthropic (via Google)", notes: "ASIC design + networking thru 2031. Apr 2026: expanded deal for multi-GW Anthropic TPU capacity. $100B AI rev target FY2027.", color: "#A855F7", sortOrder: 2 },
              { vendor: "Meta", chip: "MTIA v2 (In-house)", status: "In deployment", shipDate: "2025-06", vol2025: "Internal only", vol2026: "Scaling", customers: "Meta (ranking, reco, inference)", notes: "Custom inference chip. Supplements GPU fleet.", color: "#64748B", sortOrder: 3 },
            ];
            const dSorted = [...deliveryData].sort((a, b) => {
              const k = chipDeliverySort.key;
              let va, vb;
              if (k === "shipDate") { va = a.shipDate; vb = b.shipDate; }
              else if (k === "vendor") { va = a.vendor; vb = b.vendor; }
              else if (k === "chip") { va = a.chip; vb = b.chip; }
              else if (k === "status") { va = a.status; vb = b.status; }
              else { va = a.shipDate; vb = b.shipDate; }
              if (typeof va === "string") return chipDeliverySort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
              return chipDeliverySort.dir === "asc" ? va - vb : vb - va;
            });
            const dToggle = (key) => setChipDeliverySort(prev => prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });
            const dArr = (key) => chipDeliverySort.key === key ? (chipDeliverySort.dir === "asc" ? " ↑" : " ↓") : "";
            const shipLabel = (d) => { const [y, m] = d.split("-"); const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return `${months[+m]} ${y}`; };
            return (
            <div style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #1E293B" }}>
                    {[{l:"Vendor",k:"vendor"},{l:"Chip / Platform",k:"chip"},{l:"Ship Date (Est.)",k:"shipDate"},{l:"Status",k:"status"},{l:"2025 Vol (est.)",k:""},{l:"2026 Vol (est.)",k:""},{l:"Key Customers",k:""},{l:"Notes",k:""}].map((h, i) => (
                      <th key={h.l} onClick={h.k ? () => dToggle(h.k) : undefined} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", cursor: h.k ? "pointer" : "default" }}>{h.l}{dArr(h.k)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dSorted.map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: "1px solid #0B0F19" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 700, color: row.color, whiteSpace: "nowrap" }}>{row.vendor}</td>
                      <td style={{ padding: "8px 10px", color: "#E2E8F0", fontWeight: 600, whiteSpace: "nowrap" }}>{row.chip}</td>
                      <td style={{ padding: "8px 10px", color: "#F8FAFC", fontWeight: 600, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{shipLabel(row.shipDate)}</td>
                      <td style={{ padding: "8px 10px" }}><span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: row.status.includes("Shipping") || row.status.includes("deployment") ? "rgba(16,185,129,0.12)" : row.status.includes("2026") ? "rgba(245,158,11,0.12)" : "rgba(100,116,139,0.12)", color: row.status.includes("Shipping") || row.status.includes("deployment") ? "#10B981" : row.status.includes("2026") ? "#F59E0B" : "#94A3B8" }}>{row.status}</span></td>
                      <td style={{ padding: "8px 10px", color: "#E2E8F0", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{row.vol2025}</td>
                      <td style={{ padding: "8px 10px", color: "#F59E0B", fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{row.vol2026}</td>
                      <td style={{ padding: "8px 10px", color: "#94A3B8", fontSize: 11, whiteSpace: "nowrap" }}>{row.customers}</td>
                      <td style={{ padding: "8px 10px", color: "#94A3B8", fontSize: 11, maxWidth: 280 }}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>);
          })()}
          <div style={{ fontSize: 10, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: JP Morgan, Morgan Stanley, SemiAnalysis, Epoch AI, TweakTown, company earnings.</div>
        </div>

        {/* Historical Delivery & Volume Trend */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Historical AI Accelerator Shipments (Cumulative Quarterly, Millions)</div>
          <div style={{ fontSize: 11, color: "#64748B", marginBottom: 16 }}>Tracks quarterly cumulative shipped units across major vendors. Shows acceleration curve and market share shifts.</div>
          {(() => {
            const histData = [
              { q: "Q4 2026E", qSort: 20264, nvda: "16.5M", amd: "3.8M", tpu: "7.0M", trn: "5.0M", total: "~32.3M", qoq: "+17%", notes: "Full VR year exit rate. MI450 + T3 at scale." },
              { q: "Q3 2026E", qSort: 20263, nvda: "14.0M", amd: "3.1M", tpu: "6.2M", trn: "4.2M", total: "~27.5M", qoq: "+17%", notes: "VR volume. 5.7M Rubin + 1.8M BW for 2026." },
              { q: "Q2 2026E", qSort: 20262, nvda: "12.0M", amd: "2.5M", tpu: "5.5M", trn: "3.6M", total: "~23.6M", qoq: "+15%", notes: "Vera Rubin 1st ships. MI450 ramp. TPU v7E GA." },
              { q: "Q1 2026E", qSort: 20261, nvda: "10.8M", amd: "2.0M", tpu: "4.8M", trn: "3.0M", total: "~20.6M", qoq: "+14%", notes: "Blackwell wind-down. VR prep. TPU v7 samples." },
              { q: "Q4 2025", qSort: 20254, nvda: "9.5M", amd: "1.7M", tpu: "4.3M", trn: "2.5M", total: "~18.0M", qoq: "+25%", notes: "5.2M Blackwell for 2025. T2→1M+. TPU 2.5M." },
              { q: "Q3 2025", qSort: 20253, nvda: "7.8M", amd: "1.4M", tpu: "3.6M", trn: "1.6M", total: "~14.4M", qoq: "+23%", notes: "Blackwell 'off the charts'. Rainier 500K. TPU deal." },
              { q: "Q2 2025", qSort: 20252, nvda: "6.3M", amd: "1.1M", tpu: "3.2M", trn: "1.1M", total: "~11.7M", qoq: "+21%", notes: "NVL72 racks deploying. MI350 early." },
              { q: "Q1 2025", qSort: 20251, nvda: "5.1M", amd: "0.9M", tpu: "2.8M", trn: "0.9M", total: "~9.7M", qoq: "+20%", notes: "Blackwell volume (750-800K). MI325X ships." },
              { q: "Q4 2024", qSort: 20244, nvda: "4.3M", amd: "0.7M", tpu: "2.4M", trn: "0.7M", total: "~8.1M", qoq: "+14%", notes: "Blackwell samples (250-300K). T2 announced." },
              { q: "Q3 2024", qSort: 20243, nvda: "4.0M", amd: "0.5M", tpu: "2.1M", trn: "0.5M", total: "~7.1M", qoq: "+25%", notes: "Blackwell delayed (mask fix). H200 fills gap." },
              { q: "Q2 2024", qSort: 20242, nvda: "3.3M", amd: "0.3M", tpu: "1.8M", trn: "0.3M", total: "~5.7M", qoq: "+27%", notes: "H200 peak. MI300X to MSFT/Meta." },
              { q: "Q1 2024", qSort: 20241, nvda: "2.5M", amd: "0.15M", tpu: "1.6M", trn: "0.2M", total: "~4.5M", qoq: "+32%", notes: "H200 ramp. MI300X volume. TPU v5e." },
              { q: "Q4 2023", qSort: 20234, nvda: "1.8M", amd: "0.05M", tpu: "1.4M", trn: "0.1M", total: "~3.4M", qoq: "+36%", notes: "H100 peak quarter. MI300X launch." },
              { q: "Q3 2023", qSort: 20233, nvda: "1.2M", amd: "0.02M", tpu: "1.2M", trn: "0.05M", total: "~2.5M", qoq: "+47%", notes: "H100 volume shipping. GPU cloud sold out." },
              { q: "Q2 2023", qSort: 20232, nvda: "0.7M", amd: "<0.01M", tpu: "1.0M", trn: "<0.01M", total: "~1.7M", qoq: "+42%", notes: "ChatGPT demand surge. H100 ramp." },
              { q: "Q1 2023", qSort: 20231, nvda: "0.4M", amd: "<0.01M", tpu: "0.8M", trn: "<0.01M", total: "~1.2M", qoq: "—", notes: "Pre-ChatGPT infra. A100/H100 early ramp." },
            ];
            const hSorted = [...histData].sort((a, b) => chipHistSort.dir === "asc" ? a.qSort - b.qSort : b.qSort - a.qSort);
            const hToggle = () => setChipHistSort(prev => ({ key: "q", dir: prev.dir === "asc" ? "desc" : "asc" }));
            const hArr = chipHistSort.dir === "asc" ? " ↑" : " ↓";
            return (
            <div style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #1E293B" }}>
                    <th onClick={hToggle} style={{ padding: "8px 10px", textAlign: "right", fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", cursor: "pointer" }}>Quarter{hArr}</th>
                    {["NVIDIA GPU","AMD Instinct","Google TPU","AWS Trainium","Total AI Chips","QoQ Δ","Notes"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: h === "Notes" ? "left" : "right", fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hSorted.map((row, ri) => {
                    const isEst = row.q.includes("E");
                    return (
                    <tr key={ri} style={{ borderBottom: "1px solid #0B0F19", background: isEst ? "rgba(59,130,246,0.03)" : "transparent" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 700, color: isEst ? "#3B82F6" : "#E2E8F0", whiteSpace: "nowrap", textAlign: "right" }}>{row.q}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: "#10B981", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{row.nvda}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: "#EF4444", fontVariantNumeric: "tabular-nums" }}>{row.amd}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: "#3B82F6", fontVariantNumeric: "tabular-nums" }}>{row.tpu}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: "#F59E0B", fontVariantNumeric: "tabular-nums" }}>{row.trn}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: "#F8FAFC", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{row.total}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: row.qoq.includes("+") ? "#10B981" : "#94A3B8", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{row.qoq}</td>
                      <td style={{ padding: "8px 10px", color: "#94A3B8", fontSize: 11, maxWidth: 280 }}>{row.notes}</td>
                    </tr>);
                  })}
                </tbody>
              </table>
            </div>);
          })()}
          <div style={{ fontSize: 10, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: Epoch AI, JP Morgan, Morgan Stanley, SemiAnalysis, company earnings, TechInsights. Cumulative shipped units. 2026E = estimates.</div>
        </div>

        {/* Notes per chip — expandable */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Key Notes &amp; Context</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {sorted.filter(c => c.notes).map((c, i) => (
              <div key={i} style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: vendorColors[c.vendor] }}>{c.vendor}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>{c.chip}</span>
                  <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 9, fontWeight: 600, background: `${statusColor(c.status)}20`, color: statusColor(c.status) }}>{c.status}</span>
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>{c.notes}</div>
              </div>
            ))}
          </div>
        </div>
      </>);
      })()}

      {mainTab === "compute" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Compute</div>
              <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>GPU rental pricing, specs &amp; token economics across generations</div>
            </div>
          </div>

          {/* Cloud Rental Price History Chart */}
          <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Cloud Rental Price ($/GPU-hr, on-demand avg.)</div>
            <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
              {[{ gpu: "A100 SXM", color: "#94A3B8" }, { gpu: "H100 SXM", color: "#3B82F6" }, { gpu: "H200 SXM", color: "#60A5FA" }, { gpu: "B200 SXM", color: "#10B981" }, { gpu: "GB200 NVL72", color: "#F59E0B" }].map(g => (
                <div key={g.gpu} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                  <div style={{ width: 10, height: 3, borderRadius: 1, background: g.color }} />
                  <span style={{ color: "#94A3B8" }}>{g.gpu}</span>
                </div>
              ))}
            </div>
            {(() => {
              const periods = ["Q1 23","Q2 23","Q3 23","Q4 23","Q1 24","Q2 24","Q3 24","Q4 24","Q1 25","Q2 25","Q3 25","Q4 25","Q1 26"];
              const chartData = periods.map(p => {
                const row = { period: p };
                GPU_DATA.forEach(g => {
                  const match = g.price.cloud.find(c => c.period === p);
                  if (match && match.value > 0) row[g.gpu] = match.value;
                });
                return row;
              });
              return (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chartData} margin={{ top: 8, right: 20, left: 8, bottom: 4 }}>
                    <XAxis dataKey="period" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={{ stroke: "#1E293B" }} tickLine={false} />
                    <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `$${v}/hr`} domain={[0, 9]} />
                    <Tooltip
                      contentStyle={{ background: "rgba(15,23,42,0.95)", border: "1px solid #334155", borderRadius: 8, fontSize: 12, color: "#E2E8F0" }}
                      formatter={(value, name) => [`$${value.toFixed(2)}/hr`, name]}
                    />
                    <Line type="monotone" dataKey="A100 SXM" stroke="#64748B" strokeWidth={2} dot={{ r: 3, fill: "#94A3B8" }} connectNulls />
                    <Line type="monotone" dataKey="H100 SXM" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3, fill: "#3B82F6" }} connectNulls />
                    <Line type="monotone" dataKey="H200 SXM" stroke="#60A5FA" strokeWidth={2} dot={{ r: 3, fill: "#60A5FA" }} connectNulls />
                    <Line type="monotone" dataKey="B200 SXM" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: "#10B981" }} connectNulls />
                    <Line type="monotone" dataKey="GB200 NVL72" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4, fill: "#F59E0B" }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              );
            })()}
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 8, fontStyle: "italic" }}>Sources: SiliconData GPU Rental Index, Jarvislabs, RunPod, Lambda, AWS/GCP on-demand. Avg of specialist providers.</div>
          </div>

          {/* GPU Cumulative Shipments Chart */}
          <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Cumulative GPU Shipments by Generation (thousands of units)</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 16 }}>Tracks installed base ramp for same cohorts as rental prices above</div>
            <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
              {[{ gpu: "A100 SXM", color: "#94A3B8" }, { gpu: "H100 SXM", color: "#3B82F6" }, { gpu: "H200 SXM", color: "#60A5FA" }, { gpu: "B200 SXM", color: "#10B981" }, { gpu: "GB200 NVL72", color: "#F59E0B" }].map(g => (
                <div key={g.gpu} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                  <div style={{ width: 10, height: 3, borderRadius: 1, background: g.color }} />
                  <span style={{ color: "#94A3B8" }}>{g.gpu}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={GPU_DEMAND_DATA} margin={{ top: 8, right: 20, left: 8, bottom: 4 }}>
                <defs>
                  {[{ key: "A100 SXM", color: "#94A3B8" }, { key: "H100 SXM", color: "#3B82F6" }, { key: "H200 SXM", color: "#60A5FA" }, { key: "B200 SXM", color: "#10B981" }, { key: "GB200 NVL72", color: "#F59E0B" }].map(g => (
                    <linearGradient key={g.key} id={`demand-grad-${g.key.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={g.color} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={g.color} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <XAxis dataKey="period" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={{ stroke: "#1E293B" }} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}M` : `${v}K`} />
                <Tooltip
                  contentStyle={{ background: "rgba(15,23,42,0.95)", border: "1px solid #334155", borderRadius: 8, fontSize: 12, color: "#E2E8F0" }}
                  formatter={(value, name) => [value >= 1000 ? `${(value/1000).toFixed(1)}M units` : `${value}K units`, name]}
                />
                <Area type="monotone" dataKey="A100 SXM" stroke="#64748B" strokeWidth={2} fill={`url(#demand-grad-A100SXM)`} dot={{ r: 3, fill: "#94A3B8" }} connectNulls />
                <Area type="monotone" dataKey="H100 SXM" stroke="#3B82F6" strokeWidth={2.5} fill={`url(#demand-grad-H100SXM)`} dot={{ r: 3, fill: "#3B82F6" }} connectNulls />
                <Area type="monotone" dataKey="H200 SXM" stroke="#60A5FA" strokeWidth={2} fill={`url(#demand-grad-H200SXM)`} dot={{ r: 3, fill: "#60A5FA" }} connectNulls />
                <Area type="monotone" dataKey="B200 SXM" stroke="#10B981" strokeWidth={2.5} fill={`url(#demand-grad-B200SXM)`} dot={{ r: 3, fill: "#10B981" }} connectNulls />
                <Area type="monotone" dataKey="GB200 NVL72" stroke="#F59E0B" strokeWidth={2} fill={`url(#demand-grad-GB200NVL72)`} dot={{ r: 4, fill: "#F59E0B" }} connectNulls />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 8, fontStyle: "italic" }}>Sources: Epoch AI Chip Sales DB, TrendForce, Jensen Huang (4M Hoppers + 3M Blackwell thru Oct '25), SemiAnalysis. A100 = cumulative installed; Hopper/Blackwell = cumulative shipped.</div>
          </div>

          {/* GPU Specs Comparison Table */}
          <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, marginBottom: 20, overflow: "auto" }}>
            <div style={{ padding: "14px 16px", fontSize: 13, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>GPU Specs Comparison</div>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
              <thead><tr>
                {["GPU","Gen","Year","VRAM","HBM","BW (TB/s)","TDP (W)","FP16 TFLOPS","FP8 TFLOPS","NVLink (GB/s)","Unit Price","Cloud $/hr"].map((h,i) => (
                  <th key={i} style={{ padding: "10px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", borderBottom: "1px solid #1E293B", textAlign: i > 2 ? "right" : "left", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[...GPU_DATA].reverse().map((g, i) => {
                  const genColor = g.gen === "Ampere" ? "#64748B" : g.gen === "Hopper" ? "#3B82F6" : g.gen === "Blackwell" ? "#10B981" : "#F59E0B";
                  const latestCloud = g.price.cloud.length > 0 ? g.price.cloud[g.price.cloud.length - 1].value : 0;
                  return (
                    <tr key={i} onMouseEnter={e => e.currentTarget.style.background = "#1E293B30"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B08", fontWeight: 700, color: "#F8FAFC", fontSize: 14 }}>{g.gpu}</td>
                      <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B08" }}>
                        <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: `${genColor}18`, color: genColor, border: `1px solid ${genColor}40` }}>{g.gen}</span>
                      </td>
                      <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B08", color: "#94A3B8" }}>{g.year}</td>
                      <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B08", textAlign: "right", color: "#E2E8F0", fontWeight: 600 }}>{g.vram.toLocaleString()} GB</td>
                      <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B08", textAlign: "right", color: "#94A3B8" }}>{g.hbmType}</td>
                      <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B08", textAlign: "right", color: "#E2E8F0" }}>{g.bw} TB/s</td>
                      <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B08", textAlign: "right", color: g.tdp >= 1000 ? "#EF4444" : g.tdp >= 700 ? "#F59E0B" : "#94A3B8", fontWeight: 600 }}>{g.tdp.toLocaleString()}W</td>
                      <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B08", textAlign: "right", color: "#E2E8F0" }}>{g.fp16 ? `${g.fp16.toLocaleString()} TFLOPS` : "TBD"}</td>
                      <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B08", textAlign: "right", color: "#E2E8F0" }}>{g.fp8 ? `${g.fp8.toLocaleString()} TFLOPS` : "TBD"}</td>
                      <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B08", textAlign: "right", color: "#94A3B8" }}>{g.nvlink.toLocaleString()} GB/s</td>
                      <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B08", textAlign: "right", color: "#F8FAFC", fontWeight: 600 }}>{g.price.unit ? `$${(g.price.unit / 1000).toFixed(0)}K` : "TBD"}</td>
                      <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B08", textAlign: "right", color: "#10B981", fontWeight: 700 }}>{latestCloud > 0 ? `$${latestCloud.toFixed(2)}/hr` : "TBD"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Token Economics & Performance */}
          <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, marginBottom: 20, overflow: "auto" }}>
            <div style={{ padding: "14px 16px", fontSize: 13, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>Token Economics &amp; Performance</div>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
              <thead><tr>
                {["GPU","Train vs A100","Infer vs A100","Tokens/sec (Llama 70B)","Tokens/Watt","Tokens/$ (per hr)","Status"].map((h,i) => (
                  <th key={i} style={{ padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", borderBottom: "1px solid #1E293B", textAlign: i > 0 && i < 6 ? "right" : "left", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[...GPU_DATA].reverse().map((g, i) => {
                  const genColor = g.gen === "Ampere" ? "#64748B" : g.gen === "Hopper" ? "#3B82F6" : g.gen === "Blackwell" ? "#10B981" : "#F59E0B";
                  return (
                    <tr key={i} onMouseEnter={e => e.currentTarget.style.background = "#1E293B30"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B08", fontWeight: 700, color: "#F8FAFC", fontSize: 14 }}>{g.gpu}</td>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B08", textAlign: "right", color: "#E2E8F0", fontWeight: 600 }}>{g.perf.trainVsA100}</td>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B08", textAlign: "right", color: "#10B981", fontWeight: 600 }}>{g.perf.inferVsA100}</td>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B08", textAlign: "right", color: "#F8FAFC", fontWeight: 700 }}>{g.perf.tokPerSec}</td>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B08", textAlign: "right", color: "#F59E0B", fontWeight: 600 }}>{g.perf.tokPerWatt}</td>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B08", textAlign: "right", color: "#3B82F6", fontWeight: 600 }}>{g.perf.tokPerDollar}</td>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid #1E293B08", color: "#94A3B8", fontSize: 12, maxWidth: 260 }}>{g.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Key Observations */}
          <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20 }}>
            <div style={{ fontSize: 13, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Key Observations</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Price Collapse", text: "H100 rental fell from $8/hr (H1 2023) to $2.20/hr (H1 2026) — a 73% decline in 3 years as supply caught up.", color: "#3B82F6" },
                { label: "A100 Near-Free", text: "A100 at $0.70/hr is approaching commodity pricing. Still viable for inference and fine-tuning at 70% of H100 perf.", color: "#94A3B8" },
                { label: "Blackwell Premium", text: "B200/GB200 commands 3x H100 pricing but delivers 15x inference throughput — net 5x better cost per token.", color: "#10B981" },
                { label: "Memory Wall", text: "HBM3e prices rose 40-60% in 2025-2026 due to AI demand. This flows into GPU costs — AMD warned of 2026 hikes.", color: "#EF4444" },
                { label: "Power Scaling", text: "TDP rose from 400W (A100) → 700W (H100) → 1200W (GB200). Data center power is now the binding constraint.", color: "#F59E0B" },
                { label: "Vera Rubin (2026)", text: "HBM4 at 288 GB, 13 TB/s bandwidth, TSMC 3nm. NVL144 rack at 3.6 ExaFLOPS FP4. Will reset the price curve.", color: "#8B5CF6" },
              ].map((obs, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ minWidth: 110, padding: "5px 10px", borderRadius: 6, background: `${obs.color}15`, border: `1px solid ${obs.color}40`, fontSize: 12, fontWeight: 700, color: obs.color, textAlign: "center" }}>
                    {obs.label}
                  </div>
                  <div style={{ fontSize: 13, color: "#E2E8F0", lineHeight: 1.6, flex: 1 }}>{obs.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mainTab === "aiinfra" && (
        <div>
        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B", marginBottom: 24, width: "fit-content" }}>
          {[{ key: "neoclouds", label: "Neoclouds" }, { key: "shellpower", label: "Shell + Power" }].map(t => (
            <button key={t.key} onClick={() => setActiveInfra(t.key)} style={{ padding: "8px 22px", fontSize: 16, fontWeight: 600, cursor: "pointer", border: "none", background: activeInfra === t.key ? "#3B82F6" : "#111827", color: activeInfra === t.key ? "#FFF" : "#94A3B8", transition: "all 0.15s" }}>{t.label}</button>
          ))}
        </div>

        {/* Neoclouds Sub-tab */}
        {activeInfra === "neoclouds" && (
        <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, borderBottom: "1px solid #1E293B", paddingBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Neoclouds</div>
            <div style={{ fontSize: 16, color: "#94A3B8", marginTop: 4 }}>{NEOCLOUD_DATA.length} providers &middot; GPU-as-a-Service for AI/HPC workloads</div>
          </div>
        </div>

        {/* Neocloud Industry & Market Updates */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#3B82F6" }}>●</span> Industry & Market Updates
          </div>
          <div style={{ maxHeight: 280, overflow: "auto", padding: "12px 16px" }}>
            {NEOCLOUD_NEWS.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ fontSize: 11, color: "#64748B", minWidth: 50, flexShrink: 0, fontWeight: 600, marginTop: 1 }}>{item.date}</span>
                <span style={{ fontSize: 13, color: "#CBD5E1" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Table */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>Neocloud Landscape — Key Metrics &middot; {NEOCLOUD_DATA.length} providers</div>
          {(() => {
            const pn = (s) => { if (!s || s === "N/A" || s === "—") return 0; const m = String(s).replace(/[^0-9.]/g, ""); return parseFloat(m) || 0; };
            const ncSorted = [...NEOCLOUD_DATA].sort((a, b) => {
              const k = neocloudSort.key;
              let va, vb;
              if (k === "name") { va = a.name; vb = b.name; }
              else if (k === "ticker") { va = a.ticker; vb = b.ticker; }
              else if (k === "connected") { va = pn(a.power.connected); vb = pn(b.power.connected); }
              else if (k === "contracted") { va = pn(a.power.contracted); vb = pn(b.power.contracted); }
              else if (k === "backlog") { va = pn(a.backlog); vb = pn(b.backlog); }
              else { va = a.name; vb = b.name; }
              if (typeof va === "string") return neocloudSort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
              return neocloudSort.dir === "asc" ? va - vb : vb - va;
            });
            const ncToggle = (key) => setNeocloudSort(prev => prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });
            const ncArr = (key) => neocloudSort.key === key ? (neocloudSort.dir === "asc" ? " ↑" : " ↓") : "";
            return (
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
              <thead>
                <tr>
                  {[{l:"Company",k:"name"},{l:"Ticker",k:"ticker"},{l:"Power (Connected)",k:"connected"},{l:"Power (Contracted)",k:"contracted"},{l:"GPUs",k:"gpus"},{l:"Backlog",k:"backlog"},{l:"Key Clients",k:""},{l:"Locations",k:""}].map((h, i) => (
                    <th key={h.l} onClick={h.k ? () => ncToggle(h.k) : undefined} style={{ padding: "10px 10px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #1E293B", textAlign: i === 0 ? "left" : i < 6 ? "right" : "left", whiteSpace: "nowrap", cursor: h.k ? "pointer" : "default" }}>{h.l}{ncArr(h.k)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ncSorted.map((co, i) => (
                  <tr key={i} onMouseEnter={e => e.currentTarget.style.background = "#1E293B20"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: co.color, fontSize: 13 }}>{co.name}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: co.ticker === "Private" ? "#94A3B8" : "#E2E8F0", fontWeight: 600 }}>{co.ticker}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#E2E8F0", fontVariantNumeric: "tabular-nums" }}>{co.power.connected}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#F8FAFC", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{co.power.contracted}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#E2E8F0", fontSize: 11 }}>{co.gpus}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#10B981", fontWeight: 600 }}>{co.backlog || "—"}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11, maxWidth: 200 }}>{co.keyClients}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11, maxWidth: 160 }}>{co.locations}</td>
                  </tr>
                ))}
              </tbody>
            </table>);
          })()}
        </div>

        {/* Detail Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: "#64748B", fontStyle: "italic", marginBottom: 16 }}>Sources: SEC filings (S-1, 10-Q, 10-K), company press releases, Bloomberg, The Information, ABI Research, Synergy Research Group, Mordor Intelligence. Backlog = total remaining performance obligations or announced deal values. As of Mar 2026.</div>
          {NEOCLOUD_DATA.map((co) => (
            <div key={co.name} style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, borderLeft: `3px solid ${co.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>{co.name}</span>
                  <span style={{ fontSize: 13, color: "#94A3B8" }}>{co.ticker} &middot; {co.status}</span>
                </div>
                <div style={{ display: "flex", gap: 16, textAlign: "right" }}>
                  <div><div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>Valuation</div><div style={{ fontSize: 16, fontWeight: 700, color: co.color }}>{co.valuation}</div></div>
                  <div><div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>Revenue</div><div style={{ fontSize: 14, fontWeight: 600, color: "#E2E8F0" }}>{co.revenue || "N/A"}</div></div>
                  <div><div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>Backlog</div><div style={{ fontSize: 14, fontWeight: 600, color: "#10B981" }}>{co.backlog || "N/A"}</div></div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Contracts &amp; Commitments</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.contracts}</div>
                </div>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Equity, Converts &amp; Ecosystem</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.investors}</div>
                </div>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Power &amp; Compute</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>Connected: {co.power.connected} &middot; Contracted: {co.power.contracted}<br/>GPUs: {co.gpus}</div>
                </div>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Timeline &amp; Notes</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.timeline}<br/><span style={{ color: "#94A3B8", fontStyle: "italic" }}>{co.notes}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
        )}

        {/* Shell + Power Sub-tab */}
        {activeInfra === "shellpower" && (
        <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, borderBottom: "1px solid #1E293B", paddingBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Shell + Power</div>
            <div style={{ fontSize: 16, color: "#94A3B8", marginTop: 4 }}>{SHELL_POWER_DATA.length} providers &middot; Infrastructure shell &amp; power for AI data centers</div>
          </div>
        </div>

        {/* Shell + Power Industry & Market Updates */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#3B82F6" }}>●</span> Industry & Market Updates
          </div>
          <div style={{ maxHeight: 280, overflow: "auto", padding: "12px 16px" }}>
            {SHELL_POWER_NEWS.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ fontSize: 11, color: "#64748B", minWidth: 50, flexShrink: 0, fontWeight: 600, marginTop: 1 }}>{item.date}</span>
                <span style={{ fontSize: 13, color: "#CBD5E1" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Table */}
        <div style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>Shell &amp; Power Infrastructure — Key Metrics &middot; {SHELL_POWER_DATA.length} providers</div>
          {(() => {
            const pn = (s) => { if (!s || s === "N/A" || s === "—") return 0; const m = String(s).replace(/[^0-9.]/g, ""); return parseFloat(m) || 0; };
            const spSorted = [...SHELL_POWER_DATA].sort((a, b) => {
              const k = shellSort.key;
              let va, vb;
              if (k === "name") { va = a.name; vb = b.name; }
              else if (k === "ticker") { va = a.ticker; vb = b.ticker; }
              else if (k === "connected") { va = pn(a.power.connected); vb = pn(b.power.connected); }
              else if (k === "contracted") { va = pn(a.power.contracted); vb = pn(b.power.contracted); }
              else if (k === "backlog") { va = pn(a.backlog); vb = pn(b.backlog); }
              else { va = a.name; vb = b.name; }
              if (typeof va === "string") return shellSort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
              return shellSort.dir === "asc" ? va - vb : vb - va;
            });
            const spToggle = (key) => setShellSort(prev => prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });
            const spArr = (key) => shellSort.key === key ? (shellSort.dir === "asc" ? " ↑" : " ↓") : "";
            return (
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
              <thead>
                <tr>
                  {[{l:"Company",k:"name"},{l:"Ticker",k:"ticker"},{l:"Power (Connected)",k:"connected"},{l:"Power (Contracted)",k:"contracted"},{l:"Power Type",k:""},{l:"Backlog",k:"backlog"},{l:"Key Clients",k:""},{l:"Locations",k:""}].map((h, i) => (
                    <th key={h.l} onClick={h.k ? () => spToggle(h.k) : undefined} style={{ padding: "10px 10px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #1E293B", textAlign: i === 0 ? "left" : i < 6 ? "right" : "left", whiteSpace: "nowrap", cursor: h.k ? "pointer" : "default" }}>{h.l}{spArr(h.k)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {spSorted.map((co, i) => (
                  <tr key={i} onMouseEnter={e => e.currentTarget.style.background = "#1E293B20"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: co.color, fontSize: 13 }}>{co.name}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#E2E8F0", fontWeight: 600 }}>{co.ticker}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#E2E8F0", fontVariantNumeric: "tabular-nums" }}>{co.power.connected}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#F8FAFC", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{co.power.contracted}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#94A3B8", fontSize: 11 }}>{co.powerType}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", textAlign: "right", color: "#10B981", fontWeight: 600 }}>{co.backlog || "—"}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11, maxWidth: 180 }}>{co.keyClients}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11, maxWidth: 160 }}>{co.locations}</td>
                  </tr>
                ))}
              </tbody>
            </table>);
          })()}
        </div>

        {/* Detail Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: "#64748B", fontStyle: "italic", marginBottom: 16 }}>Sources: SEC filings (S-1, 10-Q, 10-K), company press releases, Bloomberg, CBRE DC Market Report, JLL Data Center Outlook, Uptime Institute. Power capacity and contract values from public filings and press releases. As of Mar 2026.</div>
          {SHELL_POWER_DATA.map((co) => (
            <div key={co.name} style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, borderLeft: `3px solid ${co.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>{co.name}</span>
                  <span style={{ fontSize: 13, color: "#94A3B8" }}>{co.ticker} &middot; {co.status}</span>
                </div>
                <div style={{ display: "flex", gap: 16, textAlign: "right" }}>
                  <div><div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>Valuation</div><div style={{ fontSize: 16, fontWeight: 700, color: co.color }}>{co.valuation}</div></div>
                  <div><div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>Power Type</div><div style={{ fontSize: 14, fontWeight: 600, color: "#E2E8F0" }}>{co.powerType}</div></div>
                  <div><div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>Backlog</div><div style={{ fontSize: 14, fontWeight: 600, color: "#10B981" }}>{co.backlog || "N/A"}</div></div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Contracts &amp; Commitments</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.contracts}</div>
                </div>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Equity, Converts &amp; Ecosystem</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.ecosystem || "No disclosed relationships"}</div>
                </div>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Power &amp; Infrastructure</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>Connected: {co.power.connected} &middot; Contracted: {co.power.contracted}<br/>Type: {co.powerType}<br/>Revenue: {co.revenue || "N/A"}</div>
                </div>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Timeline &amp; Notes</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.timeline}<br/><span style={{ color: "#94A3B8", fontStyle: "italic" }}>{co.notes}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
        )}

        </div>
      )}


    </div>
  );
}
