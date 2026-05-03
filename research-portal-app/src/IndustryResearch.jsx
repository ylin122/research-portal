import { useState, useMemo, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { T_, FONT } from "./lib/theme";
import TabBar from "./lib/TabBar";
import { tooltipStyle, tooltipStyleSm } from "./lib/chartTheme";

// Updated 2026-04-29 (hyperscaler Q1 2026 prints)
const fmt = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtPct = (n) => (n * 100).toFixed(1) + "%";
const fmtShares = (n) => n % 1 === 0 ? n.toLocaleString() : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 3 });
const fmtPrice = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtNum = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const AI_LABS_DATA = {
  OpenAI: {
    name: "OpenAI", tagline: "Building AGI that benefits all of humanity",
    hq: "San Francisco, CA", founded: 2015, employees: "~5,000", ceo: "Sam Altman",
    valuation: { current: "$852B", date: "Mar 2026", series: "Series G ($122B)", investors: "Amazon ($50B), Nvidia ($30B), SoftBank ($30B); $3B individual investors via banks; SoftBank co-led w/ a16z, D.E. Shaw Ventures, MGX, TPG, T. Rowe Price + continued MSFT participation (~$9B combined)" },
    arr: [
      { year: 2023, value: 2 }, { year: 2024, value: 6 }, { year: 2025, value: 20 },
      { year: 2026, value: 50, est: true }, { year: 2027, value: 100, est: true }, { year: 2028, value: 150, est: true },
      { year: 2029, value: 200, est: true }, { year: 2030, value: 280, est: true },
    ],
    arrCurrent: { value: "~$24-25B ARR", date: "Apr 2026", source: "Bloomberg (Mar 31). $2B/mo revenue → ~$24B run-rate. $122B round closed at $852B val. 900M WAU, 50M paying subs. Surpassed by Anthropic — official $30B+ (Apr 6) and SemiAnalysis tracking ~$44B+ (May 2). OpenAI disputes basis." },
    arrSource: "2023-2025: CFO Sarah Friar (Jan 2026 blog). 2027E: Altman ($100B). 2030E: CNBC ($280B high).",
    compute: [
      { year: 2023, value: 0.2 }, { year: 2024, value: 0.6 }, { year: 2025, value: 1.9 },
      { year: 2026, value: 5, est: true }, { year: 2027, value: 10, est: true }, { year: 2028, value: 15, est: true },
      { year: 2029, value: 20, est: true }, { year: 2030, value: 26, est: true },
    ],
    computeCurrent: { value: "~1.9 GW", date: "Dec 2025", source: "CFO Sarah Friar blog (Jan 2026)" },
    computeSource: "Friar (2023-2025 actual), Stargate 10 GW commitment, Sacra: 26 GW total contracted",
    users: { paying: "9M+ business users, 900M WAU", trend: "WAU +30% in 5 months" },
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
      { ticker: "MSFT", name: "Microsoft", exposure: "~27% equity stake (post-restructuring Oct 2025), $250B Azure deal, board seat", color: T_.blue },
      { ticker: "AMZN", name: "Amazon", exposure: "$50B investor, $38B 7-yr AWS GB200/GB300 deal (Nov 2025), Trainium ramping", color: T_.amber },
      { ticker: "NVDA", name: "Nvidia", exposure: "$30B investor, primary GPU supplier, Vera Rubin commitment", color: T_.green },
      { ticker: "ORCL", name: "Oracle", exposure: "~$300B Stargate cloud deal (2027-2031), ~$60B/yr", color: T_.red },
      { ticker: "9984.T", name: "SoftBank", exposure: "$30B investor, Stargate co-founder", color: T_.purple },
    ],
    ecosystem: [
      { category: "Cloud", partners: "Microsoft Azure ($250B thru 2032), AWS ($38B 7-yr Nov 2025), Oracle (~$300B Stargate), CoreWeave ($22.4B, GB200/GB300)", color: T_.blue },
      { category: "Chips", partners: "Nvidia (Vera Rubin), Broadcom (custom ASIC via TSMC), Cerebras (WSE-3), AMD (6 GW)", color: T_.amber },
      { category: "Power", partners: "Stargate: ~7-8 GW planned, $400B+ committed (Abilene TX 1.2 GW live + MI 1.4 GW Saline Twp, WI 'Lighthouse'/Vantage, WY, PA, more TX). 10 GW / $500B target by 2029.", color: T_.green },
      { category: "Memory", partners: "SK Hynix, Samsung, Micron \u2014 via Nvidia/AMD GPU HBM packaging", color: "#A855F7" },
      { category: "Distribution", partners: "ChatGPT (900M WAU), Copilot (via MSFT), Apple Siri (in talks)", color: T_.red },
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
    arrCurrent: { value: "~$44B+ ARR", date: "May 2026", source: "SemiAnalysis (May 2, 2026 tracking — $9B end-2025 → $14B Feb → $19B Mar → $30B Apr 6 official → $44B+ May). Anthropic last officially confirmed $30B+ on Apr 6 (Bloomberg); SemiAnalysis estimates ~5x growth in <5 months. 80% from 300K+ biz customers; Claude Code >$2.5B ARR alone." },
    arrSource: "2024: $1B ARR exit (company). 2025: $9B ARR exit (SaaStr). 2026E: $20-26B (TechCrunch). 2028E: $70B bull (The Information). Claude Code ARR $2.5B+.",
    compute: [
      { year: 2023, value: 0.05 }, { year: 2024, value: 0.15 }, { year: 2025, value: 0.5 },
      { year: 2026, value: 1.5, est: true }, { year: 2027, value: 3, est: true }, { year: 2028, value: 5, est: true },
      { year: 2029, value: 7, est: true }, { year: 2030, value: 10, est: true },
    ],
    computeCurrent: { value: "~1 GW (scaling to multi-GW)", date: "Apr 2026", source: "Project Rainier ~500K Trainium2 chips live + up to 5 GW AWS Trainium ramp + 3.5 GW Google TPU via Broadcom (online 2027) + Azure" },
    computeSource: "Updated 2026-04-29: Apr 21 2026 AWS-Anthropic expansion — $100B over 10 yrs, up to 5 GW Trainium capacity (~1 GW Trn2+Trn3 online by YE 2026, multi-GW thereafter). Apr 2026: Expanded Google/Broadcom deal — multi-GW next-gen TPU capacity (online 2027). Azure ($30B Nov 2025 commitment). Largest aggregate compute commitment in industry.",
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
      { ticker: "AMZN", name: "Amazon", exposure: "$13B+ invested ($5B added Apr 2026, option for up to $20B more), primary AWS partner — $100B 10-yr commit, up to 5 GW Trainium", color: T_.amber },
      { ticker: "GOOGL", name: "Google", exposure: "$3B invested, expanded TPU deal via Broadcom (1 GW live + 3.5 GW 2027), Vertex AI", color: T_.blue },
      { ticker: "MSFT", name: "Microsoft", exposure: "$5B invested, Azure compute ($30B)", color: T_.purple },
      { ticker: "NVDA", name: "Nvidia", exposure: "$10B invested, Grace Blackwell + Vera Rubin supply", color: T_.green },
    ],
    ecosystem: [
      { category: "Cloud", partners: "AWS ($100B/10-yr, up to 5 GW Trainium — Apr 2026), Google Cloud (1 GW live + 3.5 GW via Broadcom 2027), Azure ($30B Nov 2025)", color: T_.blue },
      { category: "Chips", partners: "AWS Trainium2/3 (>1M Trn2 chips today, ~1 GW combined Trn2+Trn3 by YE26), Google TPU v7, Nvidia Grace Blackwell + Vera Rubin", color: T_.amber },
      { category: "Power", partners: "Fluidstack ($50B own DCs — TX, NY, sites online thru 2026), AWS Project Rainier (live, ~500K Trn2 chips), Google TPU DCs", color: T_.green },
      { category: "Memory", partners: "SK Hynix, Samsung, Micron \u2014 via TPU/GPU from cloud partners", color: "#A855F7" },
      { category: "Distribution", partners: "Claude.ai, Claude Code ($2.5B ARR), API (300K+), Cowork. Opus 4.7 released Apr 17.", color: T_.red },
    ],
  },
  Google: {
    name: "Google DeepMind", tagline: "Gemini \u00b7 TPU \u00b7 Vertically Integrated AI",
    hq: "Mountain View, CA / London", founded: "2010 (DeepMind)", employees: "~3,000+ (DeepMind)", ceo: "Demis Hassabis / Sundar Pichai",
    valuation: { current: "GOOGL $3.76T", date: "Mar 2026", series: "Public (GOOGL)", investors: "Public market" },
    arr: [
      { year: 2023, value: 37 }, { year: 2024, value: 48 }, { year: 2025, value: 62 },
      { year: 2026, value: 78, est: true }, { year: 2027, value: 97, est: true }, { year: 2028, value: 120, est: true },
      { year: 2029, value: 148, est: true }, { year: 2030, value: 180, est: true },
    ],
    arrLabel: "Google Cloud ARR (Q4 × 4, $B)",
    arrCurrent: { value: "~$80B ARR (Q1 × 4)", date: "Q1 2026", source: "Updated 2026-04-29: Alphabet Q1 2026 earnings — GCP rev ~$20B (+63% YoY), Cloud op income $6.6B (32.9% margin, tripled YoY). Backlog $462B (~doubled QoQ from $240B). 'Compute constrained.' Just over 50% of backlog to convert in next 24 months." },
    arrSource: "Alphabet 10-K Q4 annualized (2023-2025). Q1 2026 actual run-rate. 2026-2030E: Wall St. consensus ~25% CAGR from exit rate.",
    compute: [
      { year: 2023, value: 5 }, { year: 2024, value: 6 }, { year: 2025, value: 7.5 },
      { year: 2026, value: 10, est: true }, { year: 2027, value: 14, est: true }, { year: 2028, value: 18, est: true },
      { year: 2029, value: 22, est: true }, { year: 2030, value: 27, est: true },
    ],
    computeLabel: "Total DC Fleet (GW, est.)",
    computeCurrent: { value: "~7.5 GW (total fleet)", date: "2025", source: "Analyst est. from $75B capex (2025)" },
    computeSource: "Analyst est. from capex. Google does not disclose GW directly. 2026 capex RAISED to $180-190B (Q1 2026 earnings, Apr 29 2026; up from prior $175-185B); 2027 to 'significantly increase.'",
    users: { paying: "Gemini 750M+ MAU, Cloud 15M+ biz, 120K+ enterprises", trend: "Gemini market share 5.7% to 21.5% in 12 mo" },
    mau: [
      { q: "Q1 23", value: 0 }, { q: "Q2 23", value: 0 }, { q: "Q3 23", value: 0 }, { q: "Q4 23", value: 7 },
      { q: "Q1 24", value: 30 }, { q: "Q2 24", value: 82 }, { q: "Q3 24", value: 150 }, { q: "Q4 24", value: 250 },
      { q: "Q1 25", value: 350 }, { q: "Q2 25", value: 450 }, { q: "Q3 25", value: 650 }, { q: "Q4 25", value: 750 },
      { q: "Q1 26", value: 800, est: true },
    ],
    mauLabel: "Gemini App MAU (M)",
    mauSource: "Alphabet earnings (Q3-Q4 2025), court docs (Apr 2025), Sensor Tower, SQ Magazine.",
    burn: "Profitable \u00b7 GOOGL operating income $129B (2025)",
    equity: [
      { ticker: "GOOGL", name: "Alphabet (direct)", exposure: "100% of DeepMind embedded in GOOGL", color: T_.blue },
    ],
    ecosystem: [
      { category: "Cloud", partners: "GCP $55B+ run rate, selling TPUs to Anthropic, Meta", color: T_.blue },
      { category: "Chips", partners: "TPU v7 Ironwood (custom), Nvidia GPUs (customers), Arm Axion CPU", color: T_.amber },
      { category: "Power", partners: "$180-190B capex 2026 (raised Apr 29) \u2014 nuclear SMR, solar PPAs, global DC expansion. 2027 capex to 'significantly increase'", color: T_.green },
      { category: "Memory", partners: "SK Hynix (HBM for TPUs), Samsung, Micron", color: "#A855F7" },
      { category: "Distribution", partners: "Search (8.5B queries/day), Android, YouTube, Apple Siri (Gemini, ~$5B)", color: T_.red },
    ],
  },
  xAI: {
    name: "xAI", tagline: "Understanding the Universe",
    hq: "SF / Memphis, TN", founded: 2023, employees: "~200+", ceo: "Elon Musk",
    valuation: { current: "$230B", date: "Jan 2026", series: "Series E ($20B, Jan 2026)", investors: "Valor, Stepstone, Fidelity, QIA, MGX, Baron, Nvidia, Cisco, Tesla ($2B)" },
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
      { ticker: "TSLA", name: "Tesla", exposure: "$2B investor, FSD data, Megapack power for Colossus", color: T_.red },
      { ticker: "NVDA", name: "Nvidia", exposure: "Strategic investor, 555K GPU supplier ($18B)", color: T_.green },
      { ticker: "034020.KS", name: "Doosan Enerbility", exposure: "5x 380MW turbines for Colossus (in FLKR)", color: T_.amber },
      { ticker: "SEI", name: "Solaris Energy", exposure: "600MW+ fleet, 67% of orderbook, JV partner", color: T_.blue },
    ],
    ecosystem: [
      { category: "Cloud", partners: "Self-hosted (Colossus Memphis) \u2014 no hyperscaler dependency", color: T_.blue },
      { category: "Chips", partners: "Nvidia (555K GPUs, $18B), potential custom ASIC plans", color: T_.amber },
      { category: "Power", partners: "Solaris Energy (600MW+), Doosan Enerbility (5x 380MW), Tesla Megapacks", color: T_.green },
      { category: "Memory", partners: "SK Hynix, Samsung, Micron \u2014 via Nvidia HBM3E packaging", color: "#A855F7" },
      { category: "Distribution", partners: "X (600M MAU), Tesla FSD, SpaceX/Starlink, DoD GenAI.mil", color: T_.red },
    ],
  },
  Meta: {
    name: "Meta AI", tagline: "Llama \u00b7 Open-weight models \u00b7 3.5B+ DAP",
    hq: "Menlo Park, CA", founded: "2004 (Meta AI: 2013)", employees: "~75,000", ceo: "Mark Zuckerberg",
    valuation: { current: "META $1.5T", date: "Mar 2026", series: "Public (META)", investors: "Public market" },
    arr: [
      { year: 2023, value: 135 }, { year: 2024, value: 165 }, { year: 2025, value: 201 },
      { year: 2026, value: 220, est: true }, { year: 2027, value: 260, est: true }, { year: 2028, value: 310, est: true },
      { year: 2029, value: 360, est: true }, { year: 2030, value: 410, est: true },
    ],
    arrLabel: "Total Revenue ($B)",
    arrCurrent: { value: "$56.3B Q1 26 Rev (+33% YoY)", date: "Q1 2026", source: "Updated 2026-04-29: META Q1 2026 — Rev $56.31B (+33% YoY), net income $26.77B (incl $8.03B OBBBA tax benefit). FDAP +4%, ad impressions +19%, price/ad +12%. Q2 guide $58-61B. AI-driven ad rev ~$10B ARR from video tools alone." },
    arrSource: "SEC filings (2023-2025 actual). Q1 2026 actual. 2026-2030E: Wall St. consensus ~15% CAGR from AI-driven ad + commerce revenue.",
    compute: [
      { year: 2023, value: 1.5 }, { year: 2024, value: 2.5 }, { year: 2025, value: 4 },
      { year: 2026, value: 7, est: true }, { year: 2027, value: 10, est: true }, { year: 2028, value: 14, est: true },
      { year: 2029, value: 18, est: true }, { year: 2030, value: 22, est: true },
    ],
    computeCurrent: { value: "~4 GW (est.)", date: "2025", source: "Analyst est. from $72B capex (2025). 30 DCs planned/operational." },
    computeSource: "Updated 2026-04-29: Analyst estimates from capex. Meta does not disclose GW directly. 2026 capex RAISED to $125-145B (Q1 2026 earnings, Apr 29; from prior $115-135B), citing higher component prices + DC costs. Stock -7% AH on the raise.",
    users: { paying: "3.54B DAP, 1B+ Meta AI MAU", trend: "Meta AI hit 1B MAU by May 2025 (announced at May 28, 2025 annual shareholder meeting) — fastest AI platform growth ever" },
    mau: [
      { q: "Q1 23", value: 0 }, { q: "Q2 23", value: 0 }, { q: "Q3 23", value: 0 }, { q: "Q4 23", value: 0 },
      { q: "Q1 24", value: 50 }, { q: "Q2 24", value: 150 }, { q: "Q3 24", value: 400 }, { q: "Q4 24", value: 600 },
      { q: "Q1 25", value: 1000 }, { q: "Q2 25", value: 1100 }, { q: "Q3 25", value: 1200 }, { q: "Q4 25", value: 1300 },
      { q: "Q1 26", value: 1400, est: true },
    ],
    mauLabel: "Meta AI MAU (M)",
    mauSource: "Zuckerberg, May 28, 2025 annual shareholder meeting (1B MAU; from 500M Sep 2024). Analyst estimates for subsequent quarters. Embedded in FB/IG/WA.",
    burn: "Profitable \u00b7 $60.5B net income (2025) \u00b7 Op. margin ~41%",
    equity: [
      { ticker: "META", name: "Meta Platforms", exposure: "Public (NASDAQ: META)", color: T_.blue },
      { ticker: "NVDA", name: "Nvidia", exposure: "Largest GPU customer globally. Tens of $B multi-year deal (Feb 2026)", color: T_.green },
      { ticker: "GOOGL", name: "Google", exposure: "$10B+ 6-yr cloud deal (Aug 2025). TPU lease talks for on-prem 2027", color: T_.amber },
      { ticker: "AMD", name: "AMD", exposure: "$60-100B 5-yr Instinct GPU deal, 6 GW, 10% equity option", color: T_.red },
    ],
    ecosystem: [
      { category: "Chips", partners: "Nvidia (millions of Blackwell/Rubin GPUs), AMD (6 GW Instinct), Google TPU (in talks), MTIA (custom inference)", color: T_.amber },
      { category: "Cloud", partners: "CoreWeave ($35.2B total, GB300, thru 2032 — expanded $21B Apr 2026), Nebius ($27B 5-yr, Vera Rubin), Google Cloud ($10B+ 6-yr), primarily on-prem DCs", color: T_.blue },
      { category: "Power", partners: "Hyperion (Richland Parish LA, sized for 5 GW IT load — 7 new gas plants ~5.2 GW + 240mi of 500-kV transmission); Prometheus (New Albany OH, 1+ GW, online 2026); 6.6 GW nuclear via Vistra/Oklo/TerraPower (Jan 2026) + Constellation Clinton (Jun 2025, online 2027); 30 DCs (26 in US); $600B US investment by 2028", color: T_.green },
      { category: "Memory", partners: "SK Hynix, Samsung, Micron \u2014 via Nvidia/AMD HBM packaging", color: "#A855F7" },
      { category: "Distribution", partners: "Facebook (3B+), Instagram (2B+), WhatsApp (2.5B+), Threads, Meta AI (1.4B MAU)", color: T_.red },
    ],
  },
};

// AI Labs Industry News — Update during refresh alongside dashNewsUpdates
// Updated 2026-05-03
const AI_LABS_NEWS = [
  { date: "May 2", text: "Anthropic ARR ~$44B+ per SemiAnalysis tracking — up from $30B official disclosure on Apr 6 (Bloomberg/Anthropic). Trajectory: $9B (end 2025) → $14B (Feb) → $19B (Mar) → $30B (Apr 6 official) → $44B+ (May per SemiAnalysis). ~5x growth in <5 months. Methodology not company-confirmed; SemiAnalysis aggregates customer/usage signals (SemiAnalysis 'AI Value Capture' May 1; officechai)." },
  { date: "Apr 29", text: "META Q1 2026: Rev $56.31B (+33% YoY), net income $26.77B (incl $8.03B OBBBA tax benefit). FY26 capex RAISED to $125-145B (from $115-135B) citing higher component prices + DC costs. Q2 rev guide $58-61B. Declines specific 2027 capex guide but warns 'we have continued to underestimate compute needs.' Stock -7% AH (Fortune, CNBC)." },
  { date: "Apr 29", text: "GOOGL Q1 2026: Rev $109.9B (+22% YoY), net income $62.57B (+81%). GCP rev ~$20B (+63%), Cloud op income $6.6B (32.9% margin, tripled YoY). Backlog $462B (~doubled QoQ from $240B). 2026 capex RAISED to $180-190B (from $175-185B); 2027 capex 'significantly higher.' Pichai: 'compute constrained' (CNBC, 9to5Google, TechCrunch)." },
  { date: "Apr 29", text: "AMZN Q1 2026: Rev $181.5B (+17% YoY, vs $155.7B Q1 2025), beat $177.3B est by 2.4%; EPS $2.78 vs $1.63 est. AWS rev $37.6B (+28% YoY) — fastest growth in 15 quarters. AWS op income $14.2B. AI run rate >$15B, growing triple-digits. Chips business >$20B run rate (Graviton+Trainium+Nitro). 2026 capex ~$200B; Q1 cash capex $43.2B. Trn3 30-40% better price/perf vs Trn2, nearly fully subscribed (CNBC, Investing.com, Stocktitan)." },
  { date: "Apr 29", text: "MSFT Q3 FY26: Rev $82.9B (+18%), EPS $4.27 vs $4.06 est. Azure +40% (39% cc, above 37-38% guide). Microsoft Cloud rev $54.5B (+29%, +25% cc). Capex $31.9B (below $34.9B est). FY26 capex now ~$190B (+61% YoY). Commercial RPO $627B (+99% YoY incl OpenAI; +26% ex-OpenAI). GM 67.6% — narrowest since 2022 on DC depreciation. AI run-rate $37B+ (+123% YoY) (CNBC, Investing.com, Microsoft IR)." },
  { date: "Apr 21", text: "Anthropic-Amazon expand to $100B+ over 10 yrs — up to 5 GW Trainium capacity. Amazon adds $5B upfront equity (now $13B+ invested), with option for up to $20B more. Anthropic uses >1M Trainium2 chips today; ~1 GW combined Trn2+Trn3 by YE 2026 (Anthropic blog, Amazon, SemiAnalysis)." },
  { date: "Apr 20", text: "AWS Project Rainier live — ~500K Trainium2 chips deployed (one of world's largest AI clusters). Anthropic running production workloads on cluster. Built in <12 months (AWS PR, DCD)." },
  { date: "Apr 17", text: "Anthropic releases Claude Opus 4.7 — stronger coding (87.6% SWE-bench Verified, +7pts vs 4.6; GPT-5.4 sits at 58.7%), 3x image resolution (2,576px), cybersecurity safeguards. GA across API, Bedrock, Vertex, Foundry. Pricing unchanged ($5/$25 MTok); new tokenizer can produce up to 35% more tokens for the same input — partial 'stealth price hike' (CNBC, VentureBeat, Finout)." },
  { date: "Apr 16", text: "TSMC Q1 2026: Rev $35.9B (+41% YoY), GM 66.2%, OM 58.1% — 4th consecutive record quarter. HPC 61% of rev. FY2026 rev raised to ~$159B (+30%). Capex trending to high end ($52-56B). Q2 guide $39-40.2B. Warns Middle East conflict may impact profitability (CNBC, Tom's Hardware)." },
  { date: "Apr 14", text: "Anthropic facing user backlash over Claude performance decline — model failing instructions more on complex workflows. Connected to 'effort level' reduction to economize on tokens. Claude Mythos launch delayed (Fortune)." },
  { date: "Apr 9", text: "CoreWeave expands Meta deal by $21B — total commitment now $35.2B thru 2032. Revenue backlog surges to $88B. Anthropic deal also cemented. Stock +4% on announcement (CNBC, Motley Fool)." },
  { date: "Apr 6", text: "Anthropic tops $30B ARR, surpassing OpenAI (~$25B) — up from $19B (Mar) and $9B (end 2025). 1,000+ customers at $1M+/yr (doubled from Feb). Claude Code ARR >$2.5B. Simultaneously announces expanded Google/Broadcom compute deal: ~3.5 GW of next-gen TPU capacity (online 2027), adding to 1 GW already live. Largest compute commitment by any AI lab. US-sited. AWS remains primary cloud partner (Bloomberg, Anthropic)." },
  { date: "Apr 6", text: "Broadcom confirms expanded long-term deal with Google — custom TPU design + networking through 2031. Anthropic named as key customer for the new TPU capacity. Deal is INCREMENTAL to existing Broadcom-Google relationship (TPU co-design ongoing), but significantly larger in scale (multi-GW). AWS relationship with Anthropic unchanged (CNBC, Broadcom IR)." },
  { date: "Mar 31", text: "OpenAI closes $122B round at $852B valuation — largest private funding in history. Anchored by Amazon ($50B), Nvidia ($30B), SoftBank ($30B). SoftBank co-led with a16z, D.E. Shaw Ventures, MGX, TPG, T. Rowe Price, and continued MSFT participation (~$9B combined). $3B from individual investors via banks. Now valued higher than Intel + AMD + Qualcomm combined (Bloomberg)." },
  { date: "Mar 30", text: "Mistral AI raises $830M debt for Paris data center — first European AI lab to self-host training. Total raised $2.9B+. Codestral (code) + Pixtral (vision) gaining traction (TechCrunch)." },
  { date: "Mar 29", text: "Anthropic in IPO talks as soon as Q4 2026 — targeting $400-500B public valuation. Revenue tripling in 2026. Goldman Sachs + JPMorgan as leads; Morgan Stanley in early discussions (CNBC, Bloomberg)." },
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
  { date: "Mar 11", text: "Google closes $32B Wiz acquisition — largest deal in Google history. Cybersecurity integration into Google Cloud (TechCrunch)." },
  { date: "Mar 12", text: "Meta AI surpasses 1.4B MAU. Llama 4 Maverick released open-source. Anthropic raises $30B Series G at $380B valuation (company filings)." },
  { date: "Mar 5", text: "Marvell Q4 earnings beat — Data Center revenue 2x YoY. Custom AI accelerator business expanding (Google, Amazon, MSFT customers)." },
];

// GPU/ASIC Industry News — Update during refresh
const GPU_ASIC_NEWS = [
  { date: "Apr 16", text: "TSMC Q1 2026 record: Rev $35.9B (+41% YoY), GM 66.2%, OM 58.1%. HPC now 61% of revenue (was 46% in Q1 2024). FY2026 rev guide raised to ~$159B. Capex trending high end $52-56B. N2 in HVM. CoWoS 75K wpm, targeting 130K wpm end-2026 (CNBC, Tom's Hardware)." },
  { date: "Apr 14", text: "SK Hynix HBM4 mass production begins at M16 (Icheon) and M15X (Cheongju). HBM3E still ~2/3 of shipments in 2026. M15X first clean room ready May 2026. Entire 2026 HBM supply sold out (TrendForce, SK Hynix)." },
  { date: "Apr 9", text: "AMD confirms MI455X shipments on track for H2 2026 — denies delay reports. 320B transistors, TSMC N2, 432GB HBM4, 40 PFLOPS FP4. Helios rack: 72x MI455X, 31 TB HBM4. July Advancing AI event for details (Tom's Hardware, VideoCardz)." },
  { date: "Mar 26", text: "TurboQuant aftershock — Samsung -4.7%, SK Hynix -6.2%, MU -5.5%, Kioxia -6%. Memory peak-out debate intensifies. KOSPI -3%. Analysts split: Wells Fargo 'buy the dip' vs BTIG caution (CNBC, Seoul Econ Daily)." },
  { date: "Mar 25", text: "Google TurboQuant: 6x memory compression for AI inference (KV cache → 3-bit). MU -3.4%, SNDK -5.7%, WDC -4.7%. Morgan Stanley: Jevons Paradox could boost demand long-term. Wells Fargo: 'attacks cost curve' (CNBC, SCMP)." },
  { date: "Mar 24", text: "MU -22% from ATH in 6 days post-earnings (closed ATH Mar 18 then reported). BTIG: 'When good news gets sold, pay attention.' Capex >$25B + TurboQuant fears weighing on sentiment (CNBC)." },
  { date: "Mar 21", text: "TERAFAB — Musk unveils $20-25B chip fab JV (Tesla/SpaceX/xAI) in Austin. Two chip families: edge inference (FSD, Optimus) + space-hardened (orbital DCs). AI5 late 2026, volume 2027 (Bloomberg, Fortune)." },
  { date: "Mar 21", text: "NVDA $174.90 — down 5.3% since GTC as broader tech sells off on Iran/war concerns. EVP Puri sells $54.7M in NVDA stock (Investing.com)." },
  { date: "Mar 20", text: "SMCI co-founder charged with smuggling $2.5B in NVIDIA-powered servers to China. SMCI -33%. DOJ's highest-profile export control case. Liaw arrested, resigned from board (Bloomberg, CNBC)." },
  { date: "Mar 18", text: "Micron Q2 FY26: Revenue $23.86B (3x YoY, beat by $3.8B). EPS $12.20 vs $9.31 est. Q3 guide $33.5B (+200% YoY). HBM4 volume production started for Vera Rubin (CNBC)." },
  { date: "Mar 17", text: "GTC 2026 keynote: Jensen Huang projects $1T in GPU orders through 2027. Vera Rubin NVL72 — 10x inference perf/watt vs Blackwell. 7 chips in full production (NVIDIA PR)." },
  { date: "Mar 17", text: "NVIDIA licenses Groq LPU technology for ~$20B (announced Dec 2025) — Groq 3 LPU integrated into Vera Rubin for inference acceleration. Ships H2 2026. Key Groq leadership joins NVIDIA; Groq remains independent entity (CNBC, DCK)." },
  { date: "Mar 17", text: "GTC: Feynman architecture (2028) previewed — Rosa CPU, LP40 LPU, BlueField-5, dual copper + co-packaged optics. Next after Vera Rubin." },
  { date: "Mar 17", text: "GTC: OpenClaw crosses 100K GitHub stars, 2M visitors in first week. Huang calls it 'most popular open source project in history of humanity.'" },
  { date: "Mar 16", text: "Vertiv role in Vera Rubin DSX AI Factory reference design confirmed. Power/cooling infrastructure for next-gen NVIDIA data centers (Investing.com)." },
  { date: "Mar 14", text: "Broadcom Q1 FY26: Rev $19.3B (+29% YoY), AI rev $8.4B (+106%). Custom accelerators +140% YoY. $73B AI backlog. CEO: '$100B AI chip rev by 2027.' Q2 AI rev guide $10.7B (+140%). 6 hyperscaler ASIC customers (CNBC, Broadcom IR)." },
  { date: "Mar 5", text: "Marvell Q4 revenue beat. Data Center revenue doubled YoY. Custom AI accelerators for Google, Amazon, Microsoft expanding." },
];

// Neocloud Industry News — Update during refresh
// Updated 2026-04-29
const NEOCLOUD_NEWS = [
  { date: "Apr 23", text: "Applied Digital (APLD) +12% on $7.5B Delta Forge 1 lease — 15-yr, 300 MW, unnamed US-based 'high investment-grade' hyperscaler. Total contracted lease revenue lifts to >$23B. APLD shifts narrative from 'CoreWeave concentration' to multi-tenant infra (TheStreet, Stocktitan)." },
  { date: "Apr 21", text: "Anthropic-AWS Trainium expansion: $100B over 10 yrs, up to 5 GW. AMZN adds $5B equity (now $13B+ invested), option for $20B more. AWS Project Rainier (~500K Trn2) live, Anthropic running production workloads (Anthropic, Amazon, SemiAnalysis)." },
  { date: "Apr 16", text: "CoreWeave revenue backlog surges to ~$88B post-$21B Meta expansion deal (thru 2032). Total Meta commitment now $35.2B. Anthropic deal also cements. CoreWeave has now signed all four largest AI labs (Meta, Anthropic, OpenAI, Google). 2026 rev guide $12-13B (+140% YoY). Stock rallying from lows (CNBC, Motley Fool, Augment)." },
  { date: "Apr 14", text: "Nebius closes $4.34B convertible debt round — 'well-funded' for 2026 capex. Goldman raises PT to $205 after $27B Meta deal. In acquisition talks with AI21 Labs (Israel). NBIS +681% from 2025 lows. Short interest >20% (Goldman Sachs, TheStreet)." },
  { date: "Mar 2025 (historical)", text: "Microsoft declined $12B CoreWeave expansion — opted not to exercise option on additional DC capacity citing shifting cloud strategy. (Original event: Mar 2025, ahead of CRWV IPO; reported by Semafor + FT/Bloomberg.) Raised questions about demand concentration risk.", historical: true },
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
// Updated 2026-04-29
const SHELL_POWER_NEWS = [
  { date: "Apr 29", text: "Hyperscaler Q1 prints reaffirm power-supply scarcity: GOOGL 'compute constrained,' Cloud backlog $462B (~doubled QoQ); Meta capex raised to $125-145B citing higher DC + component costs; MSFT capex now ~$190B (+61%); AWS at $37.6B rev (+28%, fastest in 15 quarters). Aggregate top-5 hyperscaler 2026 capex now ~$760B (AMZN $200B + GOOGL $185B + MSFT $190B + META $135B + ORCL $50B mid-points; CreditSights, CNBC, Investing.com)." },
  { date: "Apr 23", text: "Applied Digital signs 15-yr 300 MW lease at Delta Forge 1 with 'high investment-grade' hyperscaler — $7.5B contracted value. Total APLD contracted lease revenue >$23B. ND power campus model validates picks-and-shovels DC thesis (Stocktitan, TheStreet)." },
  { date: "Apr 21", text: "Anthropic-AWS expand Trainium pact to $100B/5 GW over 10 yrs. AWS Project Rainier (~500K Trn2 chips) operational. Demonstrates ~1 GW combined Trn2+Trn3 capacity online by YE26 (AWS, Anthropic, SemiAnalysis)." },
  { date: "Apr 20", text: "Microsoft Fairwater (Mt Pleasant, Wisconsin) AI data center goes live ahead of schedule — 'world's most powerful AI DC' linking hundreds of thousands of GB200/GB300 GPUs. Initial 3 buildings 1.2M sqft; total approved buildout ~9M sqft, total taxable value $13B+ (DCD, TheEnergyMag)." },
  { date: "Mar 27", text: "Microsoft picks up Crusoe's 900 MW campus in Texas that OpenAI did not exercise — telling sign of MSFT-OpenAI drift post Oct 2025 restructure (Fortune, The Register)." },
  { date: "Mar 26", text: "Trump tells Iran 'get serious.' Brent surges +6.5% to ~$109. Gas $3.96/gal (23-day streak, +34% in a month). OECD warns US inflation above Fed targets. ECB's Lagarde: 'real shock' (CNBC, Bloomberg)." },
  { date: "Mar 25", text: "Iran rejects US 15-point ceasefire proposal (delivered via Pakistan). Lays out 5-point counterplan including Hormuz control. S&P +0.54% as markets bet on eventual deal (AP, NYT)." },
  { date: "Mar 23", text: "Oil crashes — Brent ~$120→~$100 on Trump-Iran 'productive talks.' 5-day pause on Iranian energy strikes. IEA considering additional releases beyond 400M barrel commitment (CNBC, AP)." },
  { date: "Mar 22", text: "Helium supply crisis — Iran war cut ~30% of global helium, critical for semi fab. Asia fabs (Samsung, SK Hynix) most exposed — Qatar supplies ~28% of US helium imports (peak 47%) and 60-70% of Asian imports per USGS Mineral Commodity Summaries 2026 (WEF, AP)." },
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
// Updated 2026-04-29 — Hyperscaler Q1 2026 prints
const AI_CAPEX_DATA = {
  top5: [
    { name: "Amazon (AWS)", ticker: "AMZN", color: T_.amber,
      capex: [
        { year: 2022, value: 58 }, { year: 2023, value: 54 }, { year: 2024, value: 83 }, { year: 2025, value: 132 },
        { year: 2026, value: 200, est: true }, { year: 2027, value: 220, est: true }, { year: 2028, value: 200, est: true },
        { year: 2029, value: 185, est: true }, { year: 2030, value: 175, est: true },
      ],
      spendingOn: "AWS data centers, Nvidia GPUs + Trainium 2/3 custom chips, Anthropic partnership ($100B/5GW), Project Kuiper, robotics",
      news: "Q1 2026 (Apr 29): Total rev $181.5B (+17% YoY), EPS $2.78 vs $1.63 est. AWS rev $37.6B (+28% YoY) — fastest growth in 15 quarters; AWS op income $14.2B. AI run-rate >$15B (triple-digit growth). Chips business (Graviton+Trainium+Nitro) at >$20B run rate. 2026 capex ~$200B (reaffirmed); Q1 cash capex $43.2B. >$225B Trainium revenue commitments. Trn3 30-40% better price/perf vs Trn2, nearly fully subscribed.",
      partners: "Nvidia (GPUs), Annapurna Labs/Trainium (custom), Anthropic ($13B+ invested incl Apr 2026 $5B add, option for $20B more; $100B/10-yr 5 GW Trainium), OpenAI ($38B 7-yr GB200/GB300 deal Nov 2025), CoreWeave",
    },
    { name: "Alphabet (Google)", ticker: "GOOGL", color: T_.blue,
      capex: [
        { year: 2022, value: 31 }, { year: 2023, value: 32 }, { year: 2024, value: 53 }, { year: 2025, value: 91 },
        { year: 2026, value: 185, est: true }, { year: 2027, value: 220, est: true }, { year: 2028, value: 215, est: true },
        { year: 2029, value: 200, est: true }, { year: 2030, value: 185, est: true },
      ],
      spendingOn: "TPU v7 Ironwood fabs, global DC expansion, Nvidia GPUs for GCP customers, subsea cables, DeepMind compute",
      news: "Q1 2026 (Apr 29): Total rev $109.9B (+22% YoY), net income $62.57B (+81%). GCP rev ~$20B (+63% YoY), Cloud op income $6.6B (32.9% margin, tripled YoY). Backlog $462B (~doubled QoQ from $240B); ~50% to convert in next 24 months. 2026 capex RAISED to $180-190B (from $175-185B); 2027 to 'significantly increase.' Pichai: 'compute constrained.'",
      partners: "Broadcom (TPU co-design thru 2031, expanded Apr 2026 — multi-GW for Anthropic), TSMC (fab), Anthropic (3.5 GW TPU 2027), Meta (TPU lease talks), Apple (Gemini deal ~$5B)",
    },
    { name: "Microsoft (Azure)", ticker: "MSFT", color: T_.purple,
      capex: [
        { year: 2022, value: 24 }, { year: 2023, value: 28 }, { year: 2024, value: 44 }, { year: 2025, value: 78 },
        { year: 2026, value: 190, est: true }, { year: 2027, value: 200, est: true }, { year: 2028, value: 190, est: true },
        { year: 2029, value: 175, est: true }, { year: 2030, value: 160, est: true },
      ],
      spendingOn: "Azure AI DCs (Fairwater Wisconsin live Apr 2026), Nvidia GPUs (GB200/Vera Rubin for OpenAI), Maia custom chips, OpenAI hosting",
      news: "Q3 FY26 (Apr 29): Rev $82.9B (+18%), EPS $4.27 vs $4.06 est. Azure +40% (39% cc, above 37-38% guide). Microsoft Cloud rev $54.5B (+29%, +25% cc). Q3 capex $31.9B (below $34.9B est) but FY26 capex now ~$190B (+61% YoY); Hood cited $25B impact from higher component prices. Commercial RPO $627B (+99% YoY incl OpenAI; +26% ex-OpenAI). GM 67.6% — narrowest since 2022 on DC depreciation. AI run-rate $37B+ (+123% YoY). Wisconsin Fairwater DC live ahead of schedule (Apr 2026).",
      partners: "OpenAI (~27% equity stake, $250B Azure commit thru 2032 post-Oct 2025 restructure), Nvidia, Anthropic ($5B + $30B Azure compute Nov 2025), AMD, Nebius ($19.4B 5-yr), CoreWeave (~$10B), Lambda",
    },
    { name: "Meta Platforms", ticker: "META", color: T_.red,
      capex: [
        { year: 2022, value: 32 }, { year: 2023, value: 28 }, { year: 2024, value: 39 }, { year: 2025, value: 72 },
        { year: 2026, value: 135, est: true }, { year: 2027, value: 155, est: true }, { year: 2028, value: 150, est: true },
        { year: 2029, value: 135, est: true }, { year: 2030, value: 125, est: true },
      ],
      spendingOn: "Llama training clusters (Hyperion 5 GW, Prometheus 1+ GW), Nvidia GPUs, MTIA custom chips, global DC buildout, Reality Labs",
      news: "Q1 2026 (Apr 29): Rev $56.31B (+33% YoY), net income $26.77B (+61%, includes $8B OBBBA tax benefit). 2026 capex RAISED to $125-145B (from $115-135B) — higher component pricing + DC costs; stock -7% AH. Q2 rev guide $58-61B. Declines specific 2027 capex but: 'we have continued to underestimate our compute needs.' CoreWeave total $35.2B ($14.2B orig + $21B expansion Apr 2026 thru 2032). $27B Nebius (Vera Rubin, Mar 2026). 6.6 GW nuclear (Vistra/Oklo/TerraPower Jan 2026 + Constellation Clinton 2027).",
      partners: "Nvidia (primary GPU), CoreWeave ($35.2B total), Nebius ($27B Vera Rubin), Google (TPU talks), TSMC (MTIA fab), Vistra/Oklo/TerraPower/Constellation (nuclear)",
    },
    { name: "Oracle", ticker: "ORCL", color: T_.green,
      capex: [
        { year: 2022, value: 7 }, { year: 2023, value: 9 }, { year: 2024, value: 12 }, { year: 2025, value: 25 },
        { year: 2026, value: 50, est: true }, { year: 2027, value: 60, est: true }, { year: 2028, value: 60, est: true },
        { year: 2029, value: 55, est: true }, { year: 2030, value: 50, est: true },
      ],
      spendingOn: "Stargate DCs for OpenAI (Abilene 1.2 GW + MI/WI/WY/PA), OCI GPU clusters, Nvidia GB200/Vera Rubin racks, land/power acquisition",
      news: "RPO $553B at end Q3 FY26 (+325% YoY) incl ~$30B/yr OpenAI deal + Meta + xAI. Stargate at ~7-8 GW planned, $400B+ investment, 5 new sites announced (MI 1.4 GW, WI 'Lighthouse', WY, PA, TX). Crusoe Abilene 1.2 GW campus serving Oracle/OpenAI live; full mid-2026. Most equipment funded by customer prepayments. CreditSights upgraded to Outperform Apr 7 2026.",
      partners: "OpenAI/SoftBank (Stargate JV, ~$300B over 5 yrs), Nvidia, Arm, Crusoe (Abilene 1.2 GW), Vantage (WI 'Lighthouse'), Related Digital (MI 1+ GW)",
    },
  ],
  others: [
    { rank: 6, name: "CoreWeave", ticker: "CRWV", capex2025: 14.9, capex2026: 33, capex2027: 45, status: "Public (IPO Mar 2025 at $40). FY2025 rev $5.1B (+167% YoY). $88B revenue backlog. RPO $60.7B. Capex $14.9B (2025), guided $30-35B (2026). $19.6B total debt (post-Meta loan). 850 MW active, 1.7 GW target YE2026. 43 data centers. Key customers: MSFT ($10B), OpenAI ($22.4B), Meta ($35.2B total, expanded $21B Apr 2026 thru 2032), NVIDIA ($6.3B backstop). 2026 rev guide $12-13B.", color: "#06B6D4" },
    { rank: 7, name: "xAI (Musk)", ticker: "Private", capex2025: 18, capex2026: 25, capex2027: 30, status: "Colossus cluster: 555K GPUs ($18B). 2 GW capacity. Series E $20B. Acquired BY SpaceX Feb 2026 (wholly-owned sub). TERAFAB JV $20-25B (separate).", color: "#F97316" },
    { rank: 8, name: "Alibaba Cloud", ticker: "BABA", capex2025: 16, capex2026: 23, capex2027: 25, status: "RMB 380B (~$53B) committed over 3 yrs for AI & cloud. 35.8% China AI cloud share. Buying RTX 4090s for inference.", color: T_.red },
    { rank: 9, name: "ByteDance / TikTok", ticker: "Private", capex2025: 15, capex2026: 23, capex2027: 25, status: "RMB 160B (~$23B) 2026 target. $14B earmarked for Nvidia AI chips. DCs in Malaysia, Indonesia, US.", color: "#84CC16" },
    { rank: 10, name: "Apple", ticker: "AAPL", capex2025: 12, capex2026: 18, capex2027: 22, status: "Apple Intelligence private cloud. Gemini deal ~$5B. Modest vs hyperscalers but ramping.", color: "#A855F7" },
    { rank: 11, name: "SoftBank (Stargate JV)", ticker: "9984.T", capex2025: 8, capex2026: 15, capex2027: 25, status: "Lead investor in $500B Stargate JV with OpenAI & Oracle. Arm Holdings majority owner. Deploying via Oracle DCs.", color: T_.amber },
    { rank: 12, name: "Tencent", ticker: "TCEHY", capex2025: 8, capex2026: 12, capex2027: 15, status: "More measured approach; prioritizing profitability. Quarterly capex declined late 2025. H200 chip access approved.", color: T_.green },
    { rank: 13, name: "Samsung Electronics", ticker: "005930", capex2025: 8, capex2026: 10, capex2027: 12, status: "HBM3E/HBM4 capacity expansion. Foundry investment for AI chips. Both supplier and builder.", color: T_.blue },
    { rank: 14, name: "Nebius (ex-Yandex)", ticker: "NBIS", capex2025: 2, capex2026: 5, capex2027: 8, status: "Neocloud. $35B+ mkt cap. Meta $27B + MSFT $19.4B 5-yr deals. NVDA $2B (8.3% stake). Targeting 2.5 GW by end 2026.", color: "#22D3EE" },
    { rank: 15, name: "Tesla (Dojo + Training)", ticker: "TSLA", capex2025: 5, capex2026: 7, capex2027: 10, status: "TERAFAB JV (3/21): $20-25B chip fab w/ SpaceX+xAI in Austin. AI5 chip. Dojo ExaPOD ~1.1 EFLOPS; 100 EFLOPS cumulative compute goal. Separate from TSLA capex plan. Dojo project disbanded Aug 2025, restarted Jan 2026 (TechCrunch). Dojo + FSD training.", color: "#DC2626" },
    { rank: 16, name: "Crusoe Energy", ticker: "Private", capex2025: 3, capex2026: 5, capex2027: 8, status: "Building Stargate Abilene campus for OpenAI (1.2 GW). Phase 1 live Sept 2025. IPO expected ~$10B+ mid-2026.", color: "#059669" },
    { rank: 17, name: "Lambda", ticker: "Private", capex2025: 2, capex2026: 4, capex2027: 6, status: "Neocloud. $1.5B funding. MSFT deal. 10K Blackwell Ultra GPUs in Kansas City. IPO anticipated.", color: "#7C3AED" },
    { rank: 18, name: "IREN (fka Iris Energy)", ticker: "IREN", capex2025: 3, capex2026: 4, capex2027: 5, status: "140K GPU target. $3.4B AI Cloud ARR by end CY26. MSFT prepayment $1.9B. 4.5 GW secured power. Oklahoma 1.6 GW campus.", color: "#0EA5E9" },
    { rank: 19, name: "Core Scientific", ticker: "CORZ", capex2025: 2, capex2026: 3, capex2027: 4, status: "Ex-Bitcoin miner → AI DC. CoreWeave/OpenAI anchor tenant. 1.2 GW pipeline. $8.7B contract backlog.", color: "#D946EF" },
    { rank: 20, name: "Baidu", ticker: "BIDU", capex2025: 3, capex2026: 4, capex2027: 5, status: "Ernie 5.0 training. Kunlun AI chips. China's #3 cloud. Conservative spender vs. Alibaba/ByteDance.", color: "#6366F1" },
  ],
  aggregate: [
    { year: 2022, value: 190 }, { year: 2023, value: 195 }, { year: 2024, value: 270 }, { year: 2025, value: 516 },
    { year: 2026, value: 955, est: true }, { year: 2027, value: 1105, est: true }, { year: 2028, value: 1060, est: true },
    { year: 2029, value: 985, est: true }, { year: 2030, value: 920, est: true },
  ],
  // Cloud/AI segment revenue ($B) + total company capex ($B) for Revenue vs Capex chart
  // Amazon = AWS segment, Alphabet = Google Cloud, Microsoft = Azure, Meta = total rev (no cloud segment), Oracle = Cloud rev
  revenueVsCapex: [
    { name: "Amazon (AWS)", color: T_.amber, rev: [
      { year: 2022, value: 80 }, { year: 2023, value: 91 }, { year: 2024, value: 108 }, { year: 2025, value: 130 },
      { year: 2026, value: 165, est: true }, { year: 2027, value: 200, est: true }, { year: 2028, value: 235, est: true }, { year: 2029, value: 265, est: true }, { year: 2030, value: 290, est: true },
    ], margin: [
      { year: 2022, value: 24 }, { year: 2023, value: 24 }, { year: 2024, value: 37 }, { year: 2025, value: 38 },
      { year: 2026, value: 34, est: true }, { year: 2027, value: 36, est: true }, { year: 2028, value: 38, est: true }, { year: 2029, value: 39, est: true }, { year: 2030, value: 40, est: true },
    ], capex: [
      { year: 2022, value: 58 }, { year: 2023, value: 54 }, { year: 2024, value: 83 }, { year: 2025, value: 132 },
      { year: 2026, value: 200, est: true }, { year: 2027, value: 220, est: true }, { year: 2028, value: 200, est: true }, { year: 2029, value: 185, est: true }, { year: 2030, value: 175, est: true },
    ]},
    { name: "Alphabet (Google Cloud)", color: T_.blue, rev: [
      { year: 2022, value: 26 }, { year: 2023, value: 33 }, { year: 2024, value: 44 }, { year: 2025, value: 70 },
      { year: 2026, value: 110, est: true }, { year: 2027, value: 145, est: true }, { year: 2028, value: 175, est: true }, { year: 2029, value: 200, est: true }, { year: 2030, value: 220, est: true },
    ], margin: [
      { year: 2022, value: -8 }, { year: 2023, value: 5 }, { year: 2024, value: 14 }, { year: 2025, value: 18 },
      { year: 2026, value: 28, est: true }, { year: 2027, value: 30, est: true }, { year: 2028, value: 31, est: true }, { year: 2029, value: 31, est: true }, { year: 2030, value: 32, est: true },
    ], capex: [
      { year: 2022, value: 31 }, { year: 2023, value: 32 }, { year: 2024, value: 53 }, { year: 2025, value: 91 },
      { year: 2026, value: 185, est: true }, { year: 2027, value: 220, est: true }, { year: 2028, value: 215, est: true }, { year: 2029, value: 200, est: true }, { year: 2030, value: 185, est: true },
    ]},
    { name: "Microsoft (Azure)", color: T_.purple, rev: [
      { year: 2022, value: 75 }, { year: 2023, value: 88 }, { year: 2024, value: 105 }, { year: 2025, value: 125 },
      { year: 2026, value: 165, est: true }, { year: 2027, value: 205, est: true }, { year: 2028, value: 240, est: true }, { year: 2029, value: 270, est: true }, { year: 2030, value: 295, est: true },
    ], margin: [
      { year: 2022, value: 42 }, { year: 2023, value: 43 }, { year: 2024, value: 45 }, { year: 2025, value: 44 },
      { year: 2026, value: 38, est: true }, { year: 2027, value: 41, est: true }, { year: 2028, value: 43, est: true }, { year: 2029, value: 44, est: true }, { year: 2030, value: 45, est: true },
    ], capex: [
      { year: 2022, value: 24 }, { year: 2023, value: 28 }, { year: 2024, value: 44 }, { year: 2025, value: 78 },
      { year: 2026, value: 190, est: true }, { year: 2027, value: 200, est: true }, { year: 2028, value: 190, est: true }, { year: 2029, value: 175, est: true }, { year: 2030, value: 160, est: true },
    ]},
    { name: "Meta Platforms", color: T_.red, rev: [
      { year: 2022, value: 117 }, { year: 2023, value: 135 }, { year: 2024, value: 165 }, { year: 2025, value: 201 },
      { year: 2026, value: 240, est: true }, { year: 2027, value: 280, est: true }, { year: 2028, value: 315, est: true }, { year: 2029, value: 345, est: true }, { year: 2030, value: 365, est: true },
    ], margin: [
      { year: 2022, value: 80 }, { year: 2023, value: 81 }, { year: 2024, value: 82 }, { year: 2025, value: 82 },
      { year: 2026, value: 80, est: true }, { year: 2027, value: 80, est: true }, { year: 2028, value: 81, est: true }, { year: 2029, value: 81, est: true }, { year: 2030, value: 81, est: true },
    ], capex: [
      { year: 2022, value: 32 }, { year: 2023, value: 28 }, { year: 2024, value: 39 }, { year: 2025, value: 72 },
      { year: 2026, value: 135, est: true }, { year: 2027, value: 155, est: true }, { year: 2028, value: 150, est: true }, { year: 2029, value: 135, est: true }, { year: 2030, value: 125, est: true },
    ]},
    { name: "Oracle (Cloud)", color: T_.green, rev: [
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
      { period: "Q1 26", value: 0.70 }, { period: "Q2 26", value: 0.65 },
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
      { period: "Q1 26", value: 2.20 }, { period: "Q2 26", value: 2.30 },
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
      { period: "Q1 26", value: 3.72 }, { period: "Q2 26", value: 3.65 },
    ]},
    perf: { trainVsA100: "~3x", inferVsA100: "~12x (mem-bound)", tokPerSec: "~2,800 (Llama 70B)", tokPerWatt: "4.00", tokPerDollar: "~750/hr" },
    status: "Premium inference — 76% more VRAM than H100",
  },
  {
    gpu: "B200 SXM", gen: "Blackwell", year: 2025, node: "TSMC 4NP",
    vram: 192, hbmType: "HBM3e", bw: 8.0, tdp: 1000, fp16: 2250, fp8: 4500, nvlink: 1800,
    price: { unit: 40000, cloud: [
      { period: "Q3 25", value: 8.00 }, { period: "Q4 25", value: 7.20 }, { period: "Q1 26", value: 6.00 }, { period: "Q2 26", value: 5.50 },
    ]},
    perf: { trainVsA100: "~6x", inferVsA100: "~15x (DGX vs DGX)", tokPerSec: "~7,000 (Llama 70B, est.)", tokPerWatt: "7.00", tokPerDollar: "~1,170/hr" },
    status: "Ramping — sold out through mid-2026",
  },
  {
    gpu: "GB200 NVL72", gen: "Blackwell", year: 2025, node: "TSMC 4NP",
    vram: 192, hbmType: "HBM3e", bw: 8.0, tdp: 1200, fp16: 2500, fp8: 5000, nvlink: 1800,
    price: { unit: 54000, cloud: [
      { period: "Q1 26", value: 8.50 }, { period: "Q2 26", value: 7.80 },
    ]},
    perf: { trainVsA100: "~8x (rack)", inferVsA100: "~30x (NVL72 rack)", tokPerSec: "~10,000+ (Llama 70B, rack-avg)", tokPerWatt: "8.33", tokPerDollar: "~1,180/hr" },
    status: "Rack-scale — 72 GPUs + 36 Grace CPUs + 18 BlueField-3 DPUs, liquid cooled. First commercial deployment: CoreWeave (Feb 2025). ~13.5 TB HBM3e per rack (72 × 192 GB). Used for OpenAI Tranches 1 & 2.",
  },
  {
    gpu: "Vera Rubin", gen: "Rubin", year: 2026, node: "TSMC 3nm",
    vram: 288, hbmType: "HBM4", bw: 22.0, tdp: 1800, fp16: 0, fp8: 0, nvlink: 3600,
    price: { unit: 0, cloud: [] },
    perf: { trainVsA100: "TBD", inferVsA100: "TBD", tokPerSec: "TBD", tokPerWatt: "TBD", tokPerDollar: "TBD" },
    status: "H2 2026 deployment. 336B transistors. 10x inference cost reduction vs Blackwell. HBM4, NVL72 rack (3.6 ExaFLOPS FP4). Meta $27B Nebius deal for Vera Rubin (Mar 2026). Rubin Ultra 2027.",
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
  { period: "Q2 26", "A100 SXM": 700, "H100 SXM": 4000, "H200 SXM": 1400, "B200 SXM": 4500, "GB200 NVL72": 2700 },
];

// LLM / AI API Pricing History — Frontier models, $/1M tokens
// Sources: OpenAI, Anthropic, Google, xAI official pricing pages, IntuitionLabs, Nebuly, SiliconData
// Tracks flagship (best) + value (cheapest capable) models per lab over time
const LLM_PRICING_DATA = {
  // Timeline entries: each is a model release with pricing at launch
  models: [
    // OpenAI
    { lab: "OpenAI", model: "GPT-4", date: "2023-03", input: 30.00, output: 60.00, ctx: 8, tier: "flagship", color: T_.green },
    { lab: "OpenAI", model: "GPT-4 32K", date: "2023-03", input: 60.00, output: 120.00, ctx: 32, tier: "flagship", color: T_.green },
    { lab: "OpenAI", model: "GPT-3.5 Turbo", date: "2023-03", input: 1.50, output: 2.00, ctx: 4, tier: "value", color: T_.green },
    { lab: "OpenAI", model: "GPT-4 Turbo", date: "2023-11", input: 10.00, output: 30.00, ctx: 128, tier: "flagship", color: T_.green },
    { lab: "OpenAI", model: "GPT-3.5 Turbo (v2)", date: "2024-01", input: 0.50, output: 1.50, ctx: 16, tier: "value", color: T_.green },
    { lab: "OpenAI", model: "GPT-4o", date: "2024-05", input: 5.00, output: 15.00, ctx: 128, tier: "flagship", color: T_.green },
    { lab: "OpenAI", model: "GPT-4o mini", date: "2024-07", input: 0.15, output: 0.60, ctx: 128, tier: "value", color: T_.green },
    { lab: "OpenAI", model: "GPT-4o (v2)", date: "2024-10", input: 2.50, output: 10.00, ctx: 128, tier: "flagship", color: T_.green },
    { lab: "OpenAI", model: "GPT-5", date: "2025-08", input: 1.25, output: 10.00, ctx: 128, tier: "flagship", color: T_.green },
    { lab: "OpenAI", model: "GPT-5.2", date: "2025-09", input: 1.75, output: 14.00, ctx: 128, tier: "flagship", color: T_.green },
    { lab: "OpenAI", model: "GPT-5.4", date: "2026-03", input: 2.50, output: 10.00, ctx: 1000, tier: "flagship", color: T_.green },
    // Anthropic
    { lab: "Anthropic", model: "Claude 2", date: "2023-07", input: 8.00, output: 24.00, ctx: 100, tier: "flagship", color: T_.amber },
    { lab: "Anthropic", model: "Claude 3 Opus", date: "2024-03", input: 15.00, output: 75.00, ctx: 200, tier: "flagship", color: T_.amber },
    { lab: "Anthropic", model: "Claude 3 Sonnet", date: "2024-03", input: 3.00, output: 15.00, ctx: 200, tier: "mid", color: T_.amber },
    { lab: "Anthropic", model: "Claude 3 Haiku", date: "2024-03", input: 0.25, output: 1.25, ctx: 200, tier: "value", color: T_.amber },
    { lab: "Anthropic", model: "Claude 3.5 Sonnet", date: "2024-06", input: 3.00, output: 15.00, ctx: 200, tier: "flagship", color: T_.amber },
    { lab: "Anthropic", model: "Claude 3.5 Haiku", date: "2024-11", input: 1.00, output: 5.00, ctx: 200, tier: "value", color: T_.amber },
    { lab: "Anthropic", model: "Claude Opus 4", date: "2025-05", input: 15.00, output: 75.00, ctx: 200, tier: "flagship", color: T_.amber },
    { lab: "Anthropic", model: "Claude Sonnet 4", date: "2025-05", input: 3.00, output: 15.00, ctx: 200, tier: "mid", color: T_.amber },
    { lab: "Anthropic", model: "Claude Opus 4.5", date: "2025-08", input: 5.00, output: 25.00, ctx: 200, tier: "flagship", color: T_.amber },
    { lab: "Anthropic", model: "Claude Sonnet 4.5", date: "2025-09", input: 3.00, output: 15.00, ctx: 1000, tier: "mid", color: T_.amber },
    { lab: "Anthropic", model: "Claude Haiku 4.5", date: "2025-10", input: 1.00, output: 5.00, ctx: 200, tier: "value", color: T_.amber },
    { lab: "Anthropic", model: "Claude Opus 4.6", date: "2026-02", input: 5.00, output: 25.00, ctx: 1000, tier: "flagship", color: T_.amber },
    { lab: "Anthropic", model: "Claude Sonnet 4.6", date: "2026-02", input: 3.00, output: 15.00, ctx: 1000, tier: "mid", color: T_.amber },
    { lab: "Anthropic", model: "Claude Opus 4.7", date: "2026-04", input: 5.00, output: 25.00, ctx: 1000, tier: "flagship", color: T_.amber },
    // Google
    { lab: "Google", model: "Gemini 1.0 Pro", date: "2023-12", input: 0.50, output: 1.50, ctx: 32, tier: "flagship", color: T_.blue },
    { lab: "Google", model: "Gemini 1.5 Pro", date: "2024-02", input: 3.50, output: 10.50, ctx: 1000, tier: "flagship", color: T_.blue },
    { lab: "Google", model: "Gemini 1.5 Flash", date: "2024-05", input: 0.35, output: 1.05, ctx: 1000, tier: "value", color: T_.blue },
    { lab: "Google", model: "Gemini 1.5 Pro (v2)", date: "2024-09", input: 1.25, output: 5.00, ctx: 2000, tier: "flagship", color: T_.blue },
    { lab: "Google", model: "Gemini 2.0 Flash", date: "2024-12", input: 0.10, output: 0.40, ctx: 1000, tier: "value", color: T_.blue },
    { lab: "Google", model: "Gemini 2.5 Pro", date: "2025-03", input: 1.25, output: 10.00, ctx: 1000, tier: "flagship", color: T_.blue },
    { lab: "Google", model: "Gemini 2.5 Flash", date: "2025-06", input: 0.15, output: 0.60, ctx: 1000, tier: "value", color: T_.blue },
    { lab: "Google", model: "Gemini 3 Flash", date: "2025-12", input: 0.10, output: 0.40, ctx: 1000, tier: "value", color: T_.blue },
    // xAI
    { lab: "xAI", model: "Grok 2", date: "2024-08", input: 2.00, output: 10.00, ctx: 131, tier: "flagship", color: T_.red },
    { lab: "xAI", model: "Grok 2 mini", date: "2024-08", input: 0.20, output: 1.00, ctx: 131, tier: "value", color: T_.red },
    { lab: "xAI", model: "Grok 3", date: "2025-02", input: 3.00, output: 15.00, ctx: 131, tier: "flagship", color: T_.red },
    { lab: "xAI", model: "Grok 3 mini", date: "2025-02", input: 0.30, output: 0.50, ctx: 131, tier: "value", color: T_.red },
    { lab: "xAI", model: "Grok 4.1", date: "2026-01", input: 3.00, output: 15.00, ctx: 256, tier: "flagship", color: T_.red },
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
    { date: "Feb 2026", maxCtx: 1000, model: "Claude Opus 4.6 / GPT-5.4 (Anthropic + OpenAI standardize at 1M; Gemini still leads at 2M from Jun 2024)" },
  ],
};

// Semiconductor Capex Data ($B) — Foundry, Memory/HBM, ASIC Design, Equipment
// Sources: TSMC/Samsung/SK Hynix/Micron 10-K filings, TrendForce, SemiAnalysis, company earnings calls
const SEMI_CAPEX_DATA = {
  companies: [
    { name: "TSMC", ticker: "TSM", segment: "Foundry", color: T_.green,
      revenue: [
        { year: 2022, value: 75.9 }, { year: 2023, value: 69.3 }, { year: 2024, value: 88.3 }, { year: 2025, value: 122 },
        { year: 2026, value: 159, est: true }, { year: 2027, value: 190, est: true }, { year: 2028, value: 215, est: true }, { year: 2029, value: 235, est: true }, { year: 2030, value: 250, est: true },
      ],
      grossMargin: [
        { year: 2022, value: 59.6 }, { year: 2023, value: 54.4 }, { year: 2024, value: 56.1 }, { year: 2025, value: 59.9 },
        { year: 2026, value: 64, est: true }, { year: 2027, value: 62, est: true }, { year: 2028, value: 60, est: true }, { year: 2029, value: 59, est: true }, { year: 2030, value: 58, est: true },
      ],
      capex: [
        { year: 2022, value: 36.3 }, { year: 2023, value: 30.5 }, { year: 2024, value: 29.8 }, { year: 2025, value: 40.9 },
        { year: 2026, value: 54, est: true }, { year: 2027, value: 60, est: true }, { year: 2028, value: 62, est: true }, { year: 2029, value: 58, est: true }, { year: 2030, value: 55, est: true },
      ],
      breakdown: "70-80% advanced nodes (2nm/3nm), 10% specialty, 10-20% packaging (CoWoS/SoIC)",
      supplyTimeline: "N3 ramp: capex in 2023 → volume supply H2 2024. N2 HVM Q4 2025, volume H1 2026. CoWoS capacity: 75K wpm end-2025, target 130K wpm end-2026. Arizona Fab 21 P1 in production (4nm), P2 construction (3nm, 2027), P3 groundbreaking (2nm/A16, 2027).",
      notes: "Q1 2026: Rev $35.9B (+41% YoY), GM 66.2%, OM 58.1%. Record 4th consecutive quarter. HPC 61% of rev. FY2025 rev $122B. FY2026E rev ~$159B (+30%). Capex guided $52-56B (high end likely). Q2 guide $39-40.2B.",
    },
    { name: "Samsung Semi", ticker: "005930", segment: "Memory + Foundry", color: T_.blue,
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
    { name: "SK Hynix", ticker: "000660", segment: "Memory (HBM Leader)", color: T_.amber,
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
      notes: "53% HBM market share (Q3 2025). HBM4 specs raised by Nvidia to >11 Gbps. 2023 was negative gross margin from memory crash.",
    },
    { name: "Micron", ticker: "MU", segment: "Memory (HBM + DRAM)", color: T_.purple,
      revenue: [
        { year: 2022, value: 30.8 }, { year: 2023, value: 15.5 }, { year: 2024, value: 25.1 }, { year: 2025, value: 42.3 },
        { year: 2026, value: 110, est: true }, { year: 2027, value: 120, est: true }, { year: 2028, value: 115, est: true }, { year: 2029, value: 110, est: true }, { year: 2030, value: 108, est: true },
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
      notes: "Q2 FY26 blowout: Rev $23.86B (+196%), EPS $12.20, GM 74.4%. Q3 guide $33.5B (GM ~81%, EPS $19.15). Capex raised >$25B. HBM4 volume prod for Vera Rubin. 30% dividend increase (Mar 2026). Idaho fab mid-2027, NY $100B campus H2 2028. 2023 was -8% GM from memory crash.",
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
    { name: "Broadcom", ticker: "AVGO", segment: "ASIC Design", color: T_.red,
      revenue: [
        { year: 2022, value: 33.2 }, { year: 2023, value: 35.8 }, { year: 2024, value: 51.6 }, { year: 2025, value: 63.9 },
        { year: 2026, value: 85, est: true }, { year: 2027, value: 105, est: true }, { year: 2028, value: 120, est: true }, { year: 2029, value: 130, est: true }, { year: 2030, value: 140, est: true },
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
      supplyTimeline: "TPU v7 Ironwood co-designed with Google, ramping 2026. OpenAI custom ASIC in design, first silicon 2026-2027. Revenue from custom AI accelerators growing >3x YoY. Q2 FY26 AI rev guided $10.7B (+140% YoY).",
      notes: "Q1 FY26: Rev $19.3B (+29%), AI rev $8.4B (+106%). Custom accelerators grew 140% YoY. 6 hyperscaler ASIC customers. $73B AI backlog. CEO: '$100B AI chip rev by 2027.' 77% gross margin — highest in semi.",
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
  { vendor: "NVIDIA", type: "GPU", chip: "A100", arch: "Ampere", node: "7nm", year: 2020, status: "EOL", vram: 80, hbm: "HBM2e", bw: 2.0, tdp: 400, fp8: 0, fp4: 0, system: "DGX A100", notes: "Workhorse of GPT-3/4 era. 4M+ shipped. EOL but still widely deployed for inference.", color: T_.textGhost },
  { vendor: "NVIDIA", type: "GPU", chip: "H100", arch: "Hopper", node: "4N", year: 2022, status: "Shipping", vram: 80, hbm: "HBM3", bw: 3.35, tdp: 700, fp8: 1979, fp4: 0, system: "DGX H100 / HGX H100", notes: "4M shipped thru Oct '25 (Jensen). Mainstream for training. Being superseded by Blackwell.", color: T_.blue },
  { vendor: "NVIDIA", type: "GPU", chip: "H200", arch: "Hopper", node: "4N", year: 2024, status: "Shipping", vram: 141, hbm: "HBM3e", bw: 4.8, tdp: 700, fp8: 1979, fp4: 0, system: "HGX H200", notes: "Bridge product. 76% more VRAM than H100. Premium inference chip.", color: "#60A5FA" },
  { vendor: "NVIDIA", type: "GPU", chip: "B200", arch: "Blackwell", node: "4NP", year: 2025, status: "Shipping", vram: 192, hbm: "HBM3e", bw: 8.0, tdp: 1000, fp8: 4500, fp4: 9000, system: "GB200 NVL72", notes: "~6M Blackwell GPUs shipped thru Oct '25 per Jensen (includes B200/B300/GB200/GB300 family). Sold out through mid-2026. Dual-die design.", color: T_.green },
  { vendor: "NVIDIA", type: "GPU", chip: "B300", arch: "Blackwell Ultra", node: "4NP", year: 2025, status: "Shipping", vram: 288, hbm: "HBM3e 12-Hi", bw: 8.0, tdp: 1200, fp8: 0, fp4: 15000, system: "GB300 NVL72", notes: "Shipping since Jan 2026. 1.5x B200 FP4. 288GB via 12-Hi stacks. CX-8 NIC (800G). First commercial deployment: CoreWeave (Jul 2025). Used for OpenAI Tranche 3 and Meta $35.2B deal.", color: "#059669" },
  { vendor: "NVIDIA", type: "GPU", chip: "VR200 (Vera Rubin)", arch: "Rubin", node: "3nm", year: 2026, status: "H2 2026", vram: 288, hbm: "HBM4", bw: 22.0, tdp: 1800, fp8: 0, fp4: 50000, system: "VR200 NVL72", notes: "In production (Jensen, CES 2026). Mass production late Q2 2026, rack assembly Q3 2026. ~5-7K racks H2 2026. 3.3x B300 compute. HBM4. NVLink 6. Vera CPU (88-core Arm). 3.6 EFLOPS FP4/rack.", color: T_.amber },
  { vendor: "NVIDIA", type: "GPU", chip: "VR300 (Rubin Ultra)", arch: "Rubin Ultra", node: "3nm", year: 2027, status: "H2 2027", vram: 1024, hbm: "HBM4e 16-Hi", bw: 8.0, tdp: 3600, fp8: 0, fp4: 100000, system: "VR300 NVL576 (Kyber)", notes: "21x GB200 NVL72 perf. 144 GPUs per Kyber rack. NVLink 7. 4-die GPU. 1TB HBM4e. 15 EFLOPS FP4/rack.", color: "#D97706" },
  { vendor: "NVIDIA", type: "GPU", chip: "Feynman", arch: "Feynman", node: "TSMC A16 (1.6nm)", year: 2028, status: "Announced", vram: 0, hbm: "HBM4e/HBM5 (proprietary)", bw: 0, tdp: 0, fp8: 0, fp4: 0, system: "TBD", notes: "3D die stacking (first stacked GPU dies), custom HBM memory variant, TSMC A16 1.6nm. Rosa CPU. LP40 LPU (Groq). BlueField-5. Silicon photonics (optical NVLink). Previewed at GTC 2026 (Mar 2026).", color: T_.textDim },
  // AMD GPUs
  { vendor: "AMD", type: "GPU", chip: "MI300X", arch: "CDNA 3", node: "5nm/6nm", year: 2023, status: "Shipping", vram: 192, hbm: "HBM3", bw: 5.3, tdp: 750, fp8: 2600, fp4: 0, system: "8x OAM", notes: "Adopted by MSFT, Meta, Oracle. (Note: El Capitan #1 supercomputer uses the MI300A APU variant, not MI300X.) $5B+ AI rev in 2024.", color: T_.red },
  { vendor: "AMD", type: "GPU", chip: "MI325X", arch: "CDNA 3.5", node: "5nm", year: 2024, status: "Shipping", vram: 288, hbm: "HBM3e", bw: 6.0, tdp: 750, fp8: 2600, fp4: 0, system: "8x OAM", notes: "Memory upgrade to 288GB HBM3e. Same compute as MI300X.", color: "#F87171" },
  { vendor: "AMD", type: "GPU", chip: "MI355X", arch: "CDNA 4", node: "3nm", year: 2025, status: "Shipping", vram: 288, hbm: "HBM3e", bw: 8.0, tdp: 1400, fp8: 0, fp4: 5000, system: "8x OAM / Helios Rack", notes: "Shipping since Q3 2025. Vultr, Oracle among first deployers. 300-600K units/quarter in 2026. 35x inference over MI300X (FP4).", color: "#DC2626" },
  { vendor: "AMD", type: "GPU", chip: "MI455X", arch: "CDNA 5", node: "N2 (TSMC)", year: 2026, status: "H2 2026", vram: 432, hbm: "HBM4", bw: 19.6, tdp: 0, fp8: 20000, fp4: 40000, system: "Helios Rack (72x MI455X)", notes: "320B transistors (12 N2 + 3 N3 chiplets). 10x MI355X perf. 31 TB HBM4 per Helios rack. OpenAI 6 GW deal. AMD confirms H2 2026 on track (Apr 2026). Also MI440X (enterprise) and MI430X (HPC/sovereign). July Advancing AI event for details.", color: "#B91C1C" },
  { vendor: "AMD", type: "GPU", chip: "MI500", arch: "CDNA Next", node: "2nm?", year: 2027, status: "Announced", vram: 0, hbm: "HBM4e", bw: 0, tdp: 0, fp8: 0, fp4: 0, system: "TBD", notes: "Annual cadence target. Details TBD. Competing with Rubin Ultra.", color: "#991B1B" },
  // Google TPUs
  { vendor: "Google", type: "ASIC (TPU)", chip: "TPU v5p", arch: "Custom", node: "5nm", year: 2023, status: "Shipping", vram: 95, hbm: "HBM2e", bw: 4.8, tdp: 300, fp8: 0, fp4: 0, system: "8960-chip pods", notes: "3D torus interconnect. Used for Gemini 1.0/1.5 training.", color: T_.blue },
  { vendor: "Google", type: "ASIC (TPU)", chip: "TPU v6e (Trillium)", arch: "Custom", node: "5nm", year: 2024, status: "Shipping", vram: 32, hbm: "HBM", bw: 1.6, tdp: 200, fp8: 0, fp4: 0, system: "256-chip pods", notes: "4x training perf over v5e. Cost-optimized for inference. Gemini 2.0 trained here.", color: "#2563EB" },
  { vendor: "Google", type: "ASIC (TPU)", chip: "TPU v7 (Ironwood)", arch: "Custom", node: "3nm?", year: 2025, status: "GA", vram: 192, hbm: "HBM3e", bw: 7.4, tdp: 600, fp8: 4614, fp4: 0, system: "9216-chip pods (42.5 EFLOPS)", notes: "GA late 2025. First native FP8 TPU. Anthropic 1M-chip deal. Meta lease talks. 44% lower TCO vs GB200.", color: "#1D4ED8" },
  { vendor: "Google", type: "ASIC (TPU)", chip: "TPU v8 (TBD)", arch: "Custom", node: "TBD", year: 2027, status: "Expected", vram: 0, hbm: "HBM4?", bw: 0, tdp: 0, fp8: 0, fp4: 0, system: "TBD", notes: "Annual cadence. Likely HBM4. Details unannounced.", color: "#1E40AF" },
  // Amazon ASICs
  { vendor: "Amazon", type: "ASIC", chip: "Trainium 1", arch: "Custom", node: "7nm?", year: 2022, status: "EOL", vram: 32, hbm: "HBM2", bw: 0.8, tdp: 0, fp8: 0, fp4: 0, system: "Trn1 instances", notes: "First-gen. Limited adoption. Lagged behind Nvidia.", color: T_.amber },
  { vendor: "Amazon", type: "ASIC", chip: "Trainium 2", arch: "Custom", node: "5nm?", year: 2024, status: "Shipping", vram: 96, hbm: "HBM3", bw: 2.5, tdp: 0, fp8: 0, fp4: 0, system: "Trn2 instances / UltraCluster", notes: "4x training perf over Trn1. 500K+ chips at Anthropic's Indiana DC. 64K-chip UltraClusters.", color: "#D97706" },
  { vendor: "Amazon", type: "ASIC", chip: "Trainium 3", arch: "Custom", node: "3nm", year: 2025, status: "Shipping (Dec 2025)", vram: 144, hbm: "HBM3e", bw: 4.9, tdp: 0, fp8: 2520, fp4: 0, system: "TBD", notes: "GA Dec 2025. 2.52 PFLOPS FP8/chip. 4.4x perf vs Trn2. 144GB HBM3e. Full production ramp Q2 2026. Trainium 4 announced for late 2026.", color: "#B45309" },
  // Microsoft
  { vendor: "Microsoft", type: "ASIC", chip: "Maia 100", arch: "Custom", node: "5nm", year: 2024, status: "Internal", vram: 64, hbm: "HBM2e", bw: 1.8, tdp: 500, fp8: 0, fp4: 0, system: "Azure Maia racks", notes: "First custom AI chip. Liquid-cooled. Designed with OpenAI workloads in mind.", color: T_.purple },
  { vendor: "Microsoft", type: "ASIC", chip: "Maia 200", arch: "Custom", node: "3nm", year: 2026, status: "Deployed", vram: 216, hbm: "HBM3e", bw: 0, tdp: 0, fp8: 0, fp4: 0, system: "Azure (US Central, US West 3)", notes: "Deployed Jan 2026. TSMC 3nm, 216 GB HBM3e. Optimized for inference. Maia 280 planned for 2027.", color: "#7C3AED" },
  // Meta
  { vendor: "Meta", type: "ASIC", chip: "MTIA v1", arch: "Custom", node: "7nm", year: 2023, status: "Internal", vram: 0, hbm: "—", bw: 0, tdp: 25, fp8: 0, fp4: 0, system: "Inference only", notes: "First-gen inference ASIC. Ranking & recommendation models. Very low power.", color: "#EC4899" },
  { vendor: "Meta", type: "ASIC", chip: "MTIA v2", arch: "Custom", node: "5nm", year: 2025, status: "Internal", vram: 0, hbm: "—", bw: 0, tdp: 0, fp8: 0, fp4: 0, system: "Inference at scale", notes: "Scaled up for Llama inference. Still relies on Nvidia GPUs for training.", color: "#DB2777" },
  // OpenAI
  { vendor: "OpenAI", type: "ASIC", chip: "Titan (Custom ASIC w/ Broadcom)", arch: "Custom", node: "N3", year: 2026, status: "In Development", vram: 0, hbm: "HBM4", bw: 0, tdp: 0, fp8: 0, fp4: 0, system: "TBD", notes: "Broadcom co-design (18+ months), TSMC N3 fab, Samsung HBM4 (exclusive deal, Mar 2026). $10B Broadcom order. Deployment H2 2026 thru 2029. 2nd-gen planned on TSMC A16.", color: "#6366F1" },
];

// CPU Industry News — Update during refresh
const CPU_NEWS = [
  { date: "Apr 14", text: "TrendForce: agentic AI is reshaping the CPU:GPU ratio. Traditional 1:4-1:8 → agentic 1:1-1:2. CPU demand surge from ~30M to ~120M cores per GW (4x). Tool processing accounts for up to 90.6% of agent latency at large batch sizes (TrendForce Insights)." },
  { date: "Apr 14", text: "TrendForce: tool processing is CPU-bound, not GPU-bound. CPU dynamic energy at 44% of total at large batch sizes. Validates the structural CPU re-rating thesis for agentic deployments." },
  { date: "Mar 24", text: "Arm Holdings unveils first in-house CPU (Arm AGI CPU) — 136 cores, TSMC N3, 300W TDP. Ends 35-year licensing-only model. Launch partners: Meta, OpenAI, Cerebras, Cloudflare, F5, SAP, SK Telecom. Raymond James upgrade to Outperform $166 PT (CNBC)." },
  { date: "Mar 18", text: "Nvidia begins selling Vera CPU as standalone product. 88-core Olympus Arm core, TSMC N3, 1.8 TB/s NVLink-C2C. Launch partners: Alibaba, ByteDance, Cloudflare, CoreWeave, Crusoe, Lambda, Nebius, Oracle, Together.AI, Vultr (Nvidia)." },
  { date: "Feb 22", text: "Intel and AMD raise CPU prices across select server lines in Q1 2026 in response to surging agentic-AI-driven demand. AMD positioned to gain share if Intel 18A yields slip (Tom's Hardware, Reuters)." },
  { date: "Jan 17", text: "Intel Clearwater Forest (Xeon 6+, 288 E-cores, Intel 18A, ~450W) yield issues threaten H2 2026 launch. Production delays possible until 2027. Diamond Rapids (Xeon 7, 256 P-cores) at risk on same 18A capacity. AMD Venice (256C/512T, TSMC N2) on track (TrendForce, Intel)." },
  { date: "Dec 8 2025", text: "AWS Graviton5 launched — 192 cores, TSMC N3, Neoverse V3. Now default for new EC2 instance types. AWS continues annual cadence: Graviton (2018), G2 64C/N1 (2019), G3 64C/V1 (2021), G4 96C/V2 (2024), G5 192C/V3 (2025) (AWS, Anandtech)." },
  { date: "Nov 18 2025", text: "Microsoft Cobalt 200 launched — 132 cores, TSMC N3, ARM CSS-V3. Successor to Cobalt 100 (Nov 2023, 128C Neoverse N2). Pairs with Maia 200 inference accelerator on Azure (Microsoft, ServeTheHome)." },
  { date: "Oct 10 2024", text: "AMD EPYC 9005 'Turin' (Zen 5) ships — up to 192C/384T on TSMC 3nm. AMD reaches ~30% server CPU revenue share by Q1 2026, gaining ~5pts on Intel since Sapphire Rapids delays (AMD)." },
  { date: "Sep 24 2024", text: "Intel Xeon 6 P-core 'Granite Rapids' ships — up to 128C/256T on Intel 3, 12-channel DDR5/MRDIMM, AMX FP16. Currently the agentic-era mainstream Xeon (Intel)." },
  { date: "Apr 9 2024", text: "Google Axion C4A launched — first Google in-house CPU. 96 cores Neoverse V2, TSMC 5nm, available on GCP. Joins AWS and MSFT in hyperscaler in-house silicon (Google Cloud Next)." },
  { date: "Aug 1 2023", text: "AmpereOne launches — 192-core Arm CPU on TSMC 5nm, custom (non-Neoverse) cores. Adopted by Oracle, MSFT (legacy Azure), Tencent. AmpereOne MX (256 cores) expected H2 2026." },
];

// CPU Release Roadmap — Tracked vendors: Intel, AMD, NVIDIA, ARM, Ampere, AWS, Microsoft, Google, Alibaba
// Sources: TrendForce, vendor announcements, Tom's Hardware, ServeTheHome, AnandTech, hyperscaler product pages
const CPU_ROADMAP = [
  // INTEL
  { vendor: "Intel", chip: "Cooper Lake", arch: "Cascade Lake-R", node: "14nm++", year: 2020, status: "EOL", isa: "x86-64", cores: 28, threads: 56, channels: "6 ch DDR4", pcie: "48 Gen3", l3: "38.5 MB", tdp: 250, link: "—", system: "3rd gen Xeon SP (4S)", notes: "Pre-AI-era 4-socket workhorse. EOL but installed base still large.", color: "#0EA5E9" },
  { vendor: "Intel", chip: "Ice Lake-SP", arch: "Sunny Cove", node: "10nm SuperFin", year: 2021, status: "EOL", isa: "x86-64", cores: 40, threads: 80, channels: "8 ch DDR4", pcie: "64 Gen4", l3: "60 MB", tdp: 270, link: "—", system: "3rd gen Xeon SP", notes: "First 10nm Xeon. Added AVX-512 + early AI extensions. Still deployed in older fleets.", color: "#0EA5E9" },
  { vendor: "Intel", chip: "Sapphire Rapids", arch: "Golden Cove", node: "Intel 7", year: 2023, status: "Shipping", isa: "x86-64", cores: 60, threads: 120, channels: "8 ch DDR5", pcie: "80 Gen5", l3: "112.5 MB", tdp: 350, link: "CXL 1.1", system: "4th gen Xeon", notes: "First AMX (AI matrix accel) Xeon. First DDR5 + PCIe Gen5. The first 'AI-aware' Xeon. Delayed to 2023.", color: "#0EA5E9" },
  { vendor: "Intel", chip: "Emerald Rapids", arch: "Raptor Cove", node: "Intel 7", year: 2023, status: "Shipping", isa: "x86-64", cores: 64, threads: 128, channels: "8 ch DDR5", pcie: "80 Gen5", l3: "320 MB", tdp: 350, link: "CXL 1.1", system: "5th gen Xeon", notes: "MCM refresh of SPR. 3x L3 cache. Same socket. Inference-optimized via AMX.", color: "#0284C7" },
  { vendor: "Intel", chip: "Sierra Forest (Xeon 6 E)", arch: "Crestmont (E-core)", node: "Intel 3", year: 2024, status: "Shipping", isa: "x86-64", cores: 288, threads: 288, channels: "12 ch DDR5", pcie: "88 Gen5", l3: "108 MB", tdp: 500, link: "CXL 2.0", system: "Xeon 6 6900E", notes: "First cloud-optimized E-core-only Xeon. 288 cores in single socket. No SMT. Highest x86 density.", color: "#0EA5E9" },
  { vendor: "Intel", chip: "Granite Rapids (Xeon 6 P)", arch: "Redwood Cove (P-core)", node: "Intel 3", year: 2024, status: "Shipping", isa: "x86-64", cores: 128, threads: 256, channels: "12 ch DDR5/MRDIMM", pcie: "96 Gen5", l3: "504 MB", tdp: 500, link: "CXL 2.0", system: "Xeon 6 6900P", notes: "P-core flagship. AMX FP16. MRDIMM bandwidth uplift. Currently shipping mainstream agentic-era Xeon.", color: "#0EA5E9" },
  { vendor: "Intel", chip: "Clearwater Forest (Xeon 6+)", arch: "Darkmont (E-core)", node: "Intel 18A", year: 2026, status: "H2 2026", isa: "x86-64", cores: 288, threads: 288, channels: "12 ch DDR5/MRDIMM", pcie: "96 Gen5", l3: "—", tdp: 450, link: "CXL 3.0", system: "Xeon 6+", notes: "First Intel 18A product. Yield issues threaten launch — possible slip to 2027. 288 cores.", color: "#0369A1" },
  { vendor: "Intel", chip: "Diamond Rapids (Xeon 7)", arch: "Panther Cove (P-core)", node: "Intel 18A", year: 2026, status: "Sampling", isa: "x86-64", cores: 256, threads: 256, channels: "16 ch DDR5/MRDIMM", pcie: "96 Gen6", l3: "—", tdp: 650, link: "CXL 3.0 + UALink", system: "Xeon 7", notes: "P-core flagship on 18A. 16 memory channels. Up to 650W. Yield-dependent — could slip to 2027.", color: "#0369A1" },

  // AMD
  { vendor: "AMD", chip: "EPYC 7003 (Milan)", arch: "Zen 3", node: "TSMC 7nm", year: 2021, status: "EOL", isa: "x86-64", cores: 64, threads: 128, channels: "8 ch DDR4", pcie: "128 Gen4", l3: "256 MB", tdp: 280, link: "—", system: "EPYC 'Milan'", notes: "AMD's mainstream cloud chip pre-Genoa. Drove early AMD share gains.", color: T_.red },
  { vendor: "AMD", chip: "EPYC 9004 (Genoa)", arch: "Zen 4", node: "TSMC 5nm", year: 2022, status: "Shipping", isa: "x86-64", cores: 96, threads: 192, channels: "12 ch DDR5", pcie: "128 Gen5", l3: "384 MB", tdp: 360, link: "CXL 1.1+", system: "EPYC 'Genoa'", notes: "First DDR5/PCIe Gen5 EPYC. Drove AMD's surge to 25%+ server share by 2024.", color: T_.red },
  { vendor: "AMD", chip: "EPYC 9754 (Bergamo)", arch: "Zen 4c", node: "TSMC 5nm", year: 2023, status: "Shipping", isa: "x86-64", cores: 128, threads: 256, channels: "12 ch DDR5", pcie: "128 Gen5", l3: "256 MB", tdp: 360, link: "CXL 1.1+", system: "EPYC 'Bergamo'", notes: "Cloud-native Zen 4c (smaller, denser cores). Major hyperscaler wins (Meta, Google, MSFT).", color: "#DC2626" },
  { vendor: "AMD", chip: "EPYC 9005 (Turin)", arch: "Zen 5 / Zen 5c", node: "TSMC 3nm", year: 2024, status: "Shipping", isa: "x86-64", cores: 192, threads: 384, channels: "12 ch DDR5", pcie: "128 Gen5", l3: "384 MB", tdp: 500, link: "CXL 2.0", system: "EPYC 'Turin'", notes: "Currently shipping flagship. Up to 192C/384T. AMD ~30% server CPU revenue share Q1 2026.", color: T_.red },
  { vendor: "AMD", chip: "EPYC Venice", arch: "Zen 6", node: "TSMC N2", year: 2026, status: "H2 2026", isa: "x86-64", cores: 256, threads: 512, channels: "16 ch DDR5/MRDIMM", pcie: "96 Gen6", l3: "—", tdp: 600, link: "CXL 3.0 + Infinity Fabric", system: "EPYC 'Venice'", notes: "First TSMC N2 EPYC. 256C/512T (highest thread count). Direct Diamond Rapids competitor — wins by default if Intel 18A slips.", color: "#B91C1C" },

  // NVIDIA
  { vendor: "NVIDIA", chip: "Grace", arch: "Neoverse V2", node: "TSMC 4N", year: 2023, status: "Shipping", isa: "Arm v9", cores: 72, threads: 72, channels: "LPDDR5X 480GB", pcie: "—", l3: "117 MB", tdp: 500, link: "NVLink-C2C 900 GB/s", system: "Grace Hopper / Grace-Blackwell", notes: "Originally bundled with Hopper/Blackwell as Superchip (GH200, GB200). Not sold standalone until Vera.", color: T_.green },
  { vendor: "NVIDIA", chip: "Vera", arch: "Olympus (custom Arm)", node: "TSMC N3", year: 2026, status: "Shipping", isa: "Arm v9", cores: 88, threads: 176, channels: "LPDDR5X", pcie: "Gen6", l3: "—", tdp: 0, link: "NVLink-C2C 1.8 TB/s", system: "Vera Rubin / standalone Mar 2026", notes: "Sold standalone for first time (Mar 2026). 88C custom Olympus core. NVLink-C2C 2x Grace.", color: T_.green },
  { vendor: "NVIDIA", chip: "Rosa", arch: "Custom Arm", node: "TSMC A16 (1.6nm)", year: 2028, status: "Announced", isa: "Arm v9+", cores: 0, threads: 0, channels: "TBD", pcie: "TBD", l3: "—", tdp: 0, link: "NVLink-7 + optical", system: "Feynman platform", notes: "Successor to Vera. Part of Feynman 2028 platform with 3D-stacked GPU dies and silicon photonics.", color: "#059669" },

  // ARM
  { vendor: "ARM", chip: "Neoverse V2 (IP)", arch: "Demeter", node: "—", year: 2023, status: "Licensed", isa: "Arm v9", cores: 0, threads: 0, channels: "—", pcie: "—", l3: "—", tdp: 0, link: "—", system: "Used by Grace, Graviton4, Axion C4A", notes: "Reference IP cores — not a chip. Powers Nvidia Grace, AWS Graviton4, Google Axion C4A. Per-core royalty model.", color: "#A855F7" },
  { vendor: "ARM", chip: "Neoverse V3 / Poseidon (IP)", arch: "Poseidon", node: "—", year: 2024, status: "Licensed", isa: "Arm v9.2", cores: 0, threads: 0, channels: "—", pcie: "—", l3: "—", tdp: 0, link: "—", system: "Used by Graviton5, Cobalt 200", notes: "Latest reference IP. Powers Graviton5 + Cobalt 200. ARM CSS (Compute SubSystem) speeds CSP design cycles.", color: "#A855F7" },
  { vendor: "ARM", chip: "Arm AGI CPU", arch: "Custom Arm", node: "TSMC N3", year: 2026, status: "Shipping", isa: "Arm v9", cores: 136, threads: 136, channels: "DDR5", pcie: "Gen5", l3: "—", tdp: 300, link: "—", system: "Arm AGI platform", notes: "First in-house ARM CPU (Mar 2026). Ends 35-yr licensing-only model. Launch partners: Meta, OpenAI, Cerebras, Cloudflare, F5, SAP, SK Telecom.", color: "#7E22CE" },

  // AMPERE
  { vendor: "Ampere", chip: "Altra Q80-30", arch: "Neoverse N1", node: "TSMC 7nm", year: 2020, status: "Shipping", isa: "Arm v8", cores: 80, threads: 80, channels: "8 ch DDR4", pcie: "128 Gen4", l3: "32 MB", tdp: 210, link: "—", system: "Ampere Altra", notes: "First merchant Arm DC CPU at scale. Adopted by Oracle, MSFT, Tencent.", color: "#F97316" },
  { vendor: "Ampere", chip: "Altra Max M128-30", arch: "Neoverse N1", node: "TSMC 7nm", year: 2021, status: "Shipping", isa: "Arm v8", cores: 128, threads: 128, channels: "8 ch DDR4", pcie: "128 Gen4", l3: "16 MB", tdp: 250, link: "—", system: "Ampere Altra Max", notes: "Density variant. Up to 128 cores per socket. Cloud-targeted.", color: "#F97316" },
  { vendor: "Ampere", chip: "AmpereOne", arch: "Custom Arm", node: "TSMC 5nm", year: 2023, status: "Shipping", isa: "Arm v8.6", cores: 192, threads: 192, channels: "8 ch DDR5", pcie: "128 Gen5", l3: "64 MB", tdp: 350, link: "—", system: "AmpereOne A192", notes: "First custom-core Ampere CPU (no Neoverse). Cloud-optimized.", color: "#EA580C" },
  { vendor: "Ampere", chip: "AmpereOne MX", arch: "Custom Arm", node: "TSMC 3nm", year: 2026, status: "H2 2026", isa: "Arm v9", cores: 256, threads: 256, channels: "12 ch DDR5", pcie: "Gen5", l3: "—", tdp: 0, link: "—", system: "AmpereOne MX", notes: "256-core successor. Faces stiff competition from hyperscaler in-house silicon.", color: "#C2410C" },

  // AWS
  { vendor: "AWS", chip: "Graviton2", arch: "Neoverse N1", node: "TSMC 7nm", year: 2020, status: "Shipping", isa: "Arm v8", cores: 64, threads: 64, channels: "8 ch DDR4", pcie: "64 Gen4", l3: "32 MB", tdp: 100, link: "—", system: "M6g/C6g/R6g", notes: "First mainstream Arm cloud CPU at scale. Up to 40% better price-perf vs x86. Enabled hyperscaler in-house CPU era.", color: T_.amber },
  { vendor: "AWS", chip: "Graviton3", arch: "Neoverse V1", node: "TSMC 5nm", year: 2021, status: "Shipping", isa: "Arm v8.4", cores: 64, threads: 64, channels: "8 ch DDR5", pcie: "64 Gen5", l3: "32 MB", tdp: 100, link: "—", system: "C7g/M7g/R7g", notes: "First DDR5/PCIe Gen5 Arm cloud CPU. SVE for ML inference. 25% better perf than G2.", color: T_.amber },
  { vendor: "AWS", chip: "Graviton4", arch: "Neoverse V2", node: "TSMC 4nm", year: 2024, status: "Shipping", isa: "Arm v9", cores: 96, threads: 96, channels: "12 ch DDR5", pcie: "96 Gen5", l3: "36 MB", tdp: 0, link: "—", system: "R8g/M8g/C8g", notes: "Up to 96 cores. SVE2. 50% more cores than G3, 75% more memory bandwidth.", color: T_.amber },
  { vendor: "AWS", chip: "Graviton5", arch: "Neoverse V3", node: "TSMC N3", year: 2025, status: "Shipping", isa: "Arm v9.2", cores: 192, threads: 192, channels: "12 ch DDR5", pcie: "96 Gen5", l3: "—", tdp: 0, link: "—", system: "Next-gen EC2 (Dec 2025)", notes: "Launched Dec 2025. 192 cores. Annual cadence intact. Default for new EC2 deployments.", color: "#D97706" },

  // MICROSOFT
  { vendor: "Microsoft", chip: "Cobalt 100", arch: "Neoverse N2 (CSS-N2)", node: "TSMC 5nm", year: 2023, status: "Shipping", isa: "Arm v9", cores: 128, threads: 128, channels: "12 ch DDR5", pcie: "Gen5", l3: "—", tdp: 0, link: "—", system: "Azure Dpsv6/Epsv6 VMs", notes: "MSFT's first in-house CPU (Nov 2023). ARM CSS-based design (faster time-to-market). Powers Azure Arm VMs.", color: T_.purple },
  { vendor: "Microsoft", chip: "Cobalt 200", arch: "Neoverse V3 (CSS-V3)", node: "TSMC N3", year: 2025, status: "Shipping", isa: "Arm v9.2", cores: 132, threads: 132, channels: "12 ch DDR5", pcie: "Gen5", l3: "—", tdp: 0, link: "—", system: "Azure VMs (next-gen)", notes: "Launched Nov 2025. ARM CSS-V3 cores. Pairs with Maia 200 inference accelerator.", color: "#7C3AED" },

  // GOOGLE
  { vendor: "Google", chip: "Axion C4A", arch: "Neoverse V2 (CSS-V2)", node: "TSMC 5nm", year: 2024, status: "Shipping", isa: "Arm v9", cores: 96, threads: 96, channels: "8 ch DDR5", pcie: "Gen5", l3: "—", tdp: 0, link: "—", system: "GCP C4A VMs", notes: "Google's first in-house CPU (Apr 2024). Available on GCP for general compute. 2026 expansion planned.", color: T_.blue },

  // ALIBABA
  { vendor: "Alibaba", chip: "Yitian 710", arch: "Neoverse N2", node: "TSMC 5nm", year: 2021, status: "Shipping", isa: "Arm v9", cores: 128, threads: 128, channels: "8 ch DDR5", pcie: "96 Gen5", l3: "—", tdp: 0, link: "—", system: "Alibaba Cloud ECS Y series", notes: "First major Chinese hyperscaler in-house Arm CPU. Powers Alibaba Cloud DCs. Yitian 720 rumored 2026.", color: "#DC2626" },
];

const NEOCLOUD_DATA = [
  { name: "CoreWeave", ticker: "CRWV", status: "Public (Nasdaq, IPO Mar 2025 at $40)", valuation: "$55B+", founded: 2017, hq: "Livingston, NJ",
    power: { connected: "850 MW", contracted: "3.1 GW" }, gpus: "250K+ (H100/H200/GB200/GB300)", backlog: "$88B",
    keyClients: "Microsoft ($10B), OpenAI ($22.4B across 3 tranches), Meta ($35.2B total — expanded $21B Apr 2026 thru 2032), NVIDIA ($6.3B backstop), Anthropic",
    contracts: "MSFT $10B multi-year · OpenAI $22.4B (3 tranches thru 2031) · Meta $35.2B total ($14.2B orig + $21B expansion Apr 2026, thru 2032) · NVIDIA $6.3B backstop (thru Apr 2032) · OpenAI $350M equity investment at IPO",
    revenue: "$5.1B FY2025 (+167% YoY). 2026 guide $12-13B. EBITDA $3.1B. 96% from long-term take-or-pay contracts.", investors: "NVIDIA ($5.3B equity + $6.3B capacity), OpenAI ($350M IPO), Magnetar, Coatue, Fidelity, Jane Street",
    locations: "43 data centers: NJ (Kenilworth 250MW), PA (Lancaster 300MW), TX (Denton 260MW, Plano 30MW), VA (Chester 148MW), OK (Muskogee 100MW), ND (Ellendale 400MW), UK (Crawley, London), Norway, Canada (Regina 300MW)",
    timeline: "GB200 NVL72 live Feb 2025 · GB300 NVL72 live Jul 2025 · 1.7 GW target YE2026 · 3.1 GW contracted by YE2027 · 5+ GW by 2030",
    notes: "Updated 2026-04-29. Platinum-tier SemiAnalysis. Only neocloud commanding premium pricing. $34B+ off-balance-sheet leases. $19.6B total debt (after $3B raise alongside Meta deal). Capex $14.9B (2025), guided $30B (2026). ~$88B revenue backlog (Apr 2026, post-Meta+Anthropic). Revenue per MW ~$7.4M annualized. 55-65% GPU utilization (vs Azure 35-45%). Meta deal expanded +$21B Apr 2026 thru 2032. Now signed all four major AI labs (Meta, Anthropic, OpenAI, Google). No customer >35% of total sales.", color: T_.blue },
  { name: "Nebius", ticker: "NBIS", status: "Public (Nasdaq)", valuation: "$35B+", founded: 2024, hq: "Amsterdam, NL",
    power: { connected: "220 MW", contracted: "2.5 GW" }, gpus: "50K+ (H100/H200/B200)", backlog: "$49B+",
    keyClients: "Microsoft (5-yr GPU supply deal), Meta ($27B 5-yr), Mistral, Anthropic",
    contracts: "$49B+ backlog · Meta $27B 5-yr Vera Rubin deal (Mar 2026) · MSFT $19.4B 5-yr deal · Targeting 800 MW-1 GW by end 2026 · Sovereign AI cloud (EU/ME)",
    revenue: "~$400M run rate (targeting $7-9B ARR by end 2026)", investors: "NVIDIA ($2B, 8.3% equity — Mar 2026), Accel ($700M round), MSFT ($19.4B infra contract), Meta ($27B + prior $3B compute). $4.34B convertible debt closed Apr 2026.",
    locations: "Finland, France, US (Kansas City, New Jersey), Israel, UAE", timeline: "220 MW live · 800 MW-1 GW connected by end 2026 · 2.5 GW contracted",
    notes: "Ex-Yandex spin-off. Gold-tier SemiAnalysis. Open-source Soperator (Slurm-on-K8s). Strong EU sovereign cloud positioning. NBIS +630% from 2025 lows. First large-scale NVIDIA Vera Rubin deployment via Meta deal.", color: "#06B6D4" },
  { name: "Lambda Labs", ticker: "Private", status: "Private", valuation: "$5.9B (post-Series E, Nov 2025)", founded: 2012, hq: "San Francisco, CA",
    power: { connected: "~100 MW", contracted: "~500 MW" }, gpus: "15K+ (A100/H100/H200/B200)", backlog: "N/A",
    keyClients: "AI research labs, startups, enterprise", contracts: "NVIDIA leaseback model · On-prem + cloud GPU clusters",
    revenue: "~$300M+ est.", investors: "$1.5B Series E led by TWG Global + USIT (Nov 2025); ~$2.36B+ cumulative funding. NVIDIA (equity + leaseback model), T. Rowe Price (Series D Feb 2025 $480M). NVIDIA provides preferential GPU allocation. IPO targeted H2 2026.",
    locations: "Austin TX, SF Bay Area, multiple colo sites", timeline: "B200 clusters live 2025 · Expanding 2026",
    notes: "Developer-first identity. One-click clusters. On-prem + cloud hybrid. VAST Data storage integration (11-12 GB/s per node).", color: T_.green },
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
    notes: "Anthropic's primary DC partner. Oxford spin-off. Speed advantage: months not years. Wholesale (62%) + marketplace (38%).", color: T_.amber },
  { name: "Voltage Park", ticker: "Private", status: "Private", valuation: "$1B+ est.", founded: 2023, hq: "San Francisco, CA",
    power: { connected: "~80 MW", contracted: "~200 MW" }, gpus: "24K+ H100 SXM", backlog: "N/A",
    keyClients: "AI startups, research labs", contracts: "Short-to-medium term GPU rental · Bare-metal H100 clusters",
    revenue: "N/A", investors: "Crypto-wealth backed (undisclosed). No known hyperscaler equity stakes",
    locations: "6 global Tier 3+ data centers", timeline: "Operational · Expanding 2026",
    notes: "Bare-metal performance focus. Among cheapest H100 providers. 6 DCs across US/EU.", color: T_.purple },
  { name: "RunPod", ticker: "Private", status: "Private", valuation: "$1B+ est.", founded: 2022, hq: "Moorestown, NJ",
    power: { connected: "~50 MW", contracted: "~150 MW" }, gpus: "10K+ (A100/H100/H200)", backlog: "N/A",
    keyClients: "AI developers, startups, academics", contracts: "Secure Cloud + Community Cloud model · Serverless inference",
    revenue: "~$100M+ est.", investors: "Dell Technologies Capital, Intel Capital, NVIDIA (undisclosed), $220M+ raised",
    locations: "US, EU (multiple colo partners)", timeline: "Expanding GPU fleet 2026",
    notes: "Developer darling: spin up GPUs in seconds. Autoscaling + serverless. Community Cloud for budget workloads.", color: T_.red },
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
    notes: "GPU marketplace model — Airbnb for compute. Lowest prices in market. Spot market for H100s. Capital-light but quality variance.", color: T_.textDim },
  { name: "Civo", ticker: "Private", status: "Private", valuation: "$500M+ est.", founded: 2020, hq: "London, UK",
    power: { connected: "~30 MW", contracted: "~100 MW" }, gpus: "GPU cloud for EU", backlog: "N/A",
    keyClients: "EU developers, SMBs, sovereign AI",
    contracts: "Kubernetes-native GPU cloud · UK/EU sovereign positioning",
    revenue: "~$30M est.", investors: "EU-focused VCs. Kubernetes-native differentiation",
    locations: "UK, EU", timeline: "Expanding EU footprint 2026",
    notes: "K8s-native cloud. EU sovereign AI focus. Small but developer-loved. Competing with Vultr for EU SMB market.", color: T_.green },
];

const SHELL_POWER_DATA = [
  { name: "TeraWulf", ticker: "WULF", status: "Public (Nasdaq)", valuation: "$4B+", founded: 2021, hq: "Easton, MD",
    power: { connected: "~245 MW", contracted: "~600 MW" }, powerType: "Nuclear + Hydro (zero-carbon)",
    keyClients: "Fluidstack/Anthropic, Core42 (G42)", backlog: "$9.5B (25-yr Fluidstack JV)",
    contracts: "$9.5B 25-yr Fluidstack JV · Core42 70 MW lease · 168 MW Abernathy TX campus",
    revenue: "$7.2M HPC (Q3 2025, first recurring)", locations: "Lake Mariner NY (nuclear), Abernathy TX",
    timeline: "18 MW live · 168 MW TX online 2026 · 600 MW total contracted through 2026",
    ecosystem: "Google ($3.2B backstop, 14% equity stake — Dec 2025), Fluidstack ($9.5B JV), Core42/G42 ($1.1B 10-yr lease)", notes: "Zero-carbon power edge (nuclear/hydro). Ex-Bitcoin miner. Power-first model: owns the MW, leases to neoclouds. Google backstop is key credit enhancement.", color: T_.green },
  { name: "Applied Digital", ticker: "APLD", status: "Public (Nasdaq)", valuation: "$8B+", founded: 2022, hq: "Dallas, TX",
    power: { connected: "~100 MW", contracted: "~1 GW+" }, powerType: "Grid + renewables",
    keyClients: "CoreWeave (400 MW), investment-grade hyperscaler (200 MW Polaris Forge 2 + 300 MW Delta Forge 1)", backlog: ">$23B (Apr 2026)",
    contracts: "CoreWeave 400 MW (Polaris Forge 1-3, $11B) · 200 MW Polaris Forge 2 (hyperscaler 15-yr, $5.5B) · 300 MW Delta Forge 1 (15-yr 'high investment-grade' hyperscaler, $7.5B — Apr 23 2026) · Total >$23B aggregate lease revenue",
    revenue: "$126.6M HPC (Q3 FY26, +139% YoY); adj EBITDA $44.1M", locations: "Ellendale ND (Polaris Forge 1), Harwood ND (Forge 2), Jamestown ND, Delta Forge 1 (430 MW campus)",
    timeline: "100 MW live · 150 MW CY2026 · 150 MW CY2027 · 200 MW Forge 2 CY2026-2027 · 300 MW Delta Forge 1 ramping",
    ecosystem: "CoreWeave ($11B total lease revenue, 400 MW), Polaris Forge 2 hyperscaler ($5.5B, 200 MW), Delta Forge 1 hyperscaler ($7.5B, 300 MW). No direct equity from hyperscalers. $5B Macquarie infra partnership.", notes: "Updated 2026-04-29. Data center design-build-operate for hyperscalers. Cool climate (Dakotas) advantage. APLD +12% on Apr 23 Delta Forge 1 announcement. Diversification from CoreWeave-only narrative.", color: T_.blue },
  { name: "Core Scientific", ticker: "CORZ", status: "Public (Nasdaq)", valuation: "$6B+", founded: 2017, hq: "Austin, TX",
    power: { connected: "~250 MW HPC", contracted: "~590 MW (CoreWeave)" }, powerType: "Grid (multi-state)",
    keyClients: "CoreWeave (590 MW contract)", backlog: "$10B+ (CoreWeave)",
    contracts: "CoreWeave $8.7B 12-yr 590 MW contract across 6 sites · Denton TX 100 MW expansion (delayed, mid-2026) · 300 MW expansion + 400 MW new sites",
    revenue: "$1B+ quarterly (BTC + hosting)", locations: "TX (Denton, Pecos), GA, NC, SC, KY, ND — 16 sites",
    timeline: "250 MW live to CoreWeave · 590 MW by early 2027 · 700 MW+ total HPC by 2028",
    ecosystem: "CoreWeave ($10B+ 590 MW contract). NVIDIA indirect via CoreWeave. Galaxy Digital partnership. No direct hyperscaler equity stakes", notes: "Largest ex-crypto infrastructure. 700K+ miners operated. AI hosting 75-80% gross margin at maturity vs -3% for mining.", color: T_.amber },
  { name: "Cipher Mining", ticker: "CIFR", status: "Public (Nasdaq)", valuation: "$3B+", founded: 2021, hq: "New York, NY",
    power: { connected: "~168 MW", contracted: "~470 MW" }, powerType: "Grid (TX, OH)",
    keyClients: "AWS (300 MW, 15-yr), Neocloud (168 MW, 10-yr)", backlog: "$5.5B+ (AWS deal alone)",
    contracts: "AWS 15-yr $5.5B 300 MW lease · 168 MW 10-yr AI hosting agreement · Multiple TX/OH sites",
    revenue: "$56M (Q3 2025)", locations: "Odessa TX, Black Pearl TX, Bear TX, Barber Lake OH",
    timeline: "168 MW AI hosting live · 300 MW AWS coming online 2026-2027",
    ecosystem: "Amazon/AWS ($5.5B 15-yr 300 MW lease — direct hyperscaler contract), Fluidstack (168 MW hosting). AWS is primary anchor tenant", notes: "Significant AWS anchor deal. Fixed-price long-duration contracts reduce GPU pricing risk. Direct hyperscaler relationship is rare among ex-miners.", color: T_.purple },
  { name: "Hut 8", ticker: "HUT", status: "Public (Nasdaq/TSX)", valuation: "$3B+", founded: 2017, hq: "Miami, FL",
    power: { connected: "~100 MW HPC", contracted: "~2.3 GW (Anthropic pipeline)" }, powerType: "Grid + renewables",
    keyClients: "Anthropic/Fluidstack (Google-backed), enterprise", backlog: "$7B (Anthropic/Fluidstack 15-yr)",
    contracts: "$7B 15-yr Anthropic/Fluidstack lease (Google backstop) · Could scale to 2.3 GW · Energy infrastructure platform",
    revenue: "$100M+ quarterly", locations: "Alberta, Ontario, TX, NY",
    timeline: "Initial capacity 2026 · 2.3 GW full pipeline 2027-2030",
    ecosystem: "Anthropic/Fluidstack ($7B 15-yr lease), Google/Alphabet (financial backstop for lease term — credit enhancement), potential 2.3 GW pipeline", notes: "Direct Anthropic infrastructure play. Google providing financial backstop for 15-yr term. Repositioning as energy infrastructure platform. Most direct Anthropic exposure among shells.", color: T_.red },
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
    ecosystem: "No hyperscaler or neocloud partnerships announced. Pure Bitcoin mining. Conversion optionality only", notes: "Second-largest mining fleet. 700+ MW of power but 100% mining today. Massive conversion optionality if mining economics worsen.", color: T_.textDim },
  { name: "Marathon Digital", ticker: "MARA", status: "Public (Nasdaq)", valuation: "$6B+", founded: 2010, hq: "Fort Lauderdale, FL",
    power: { connected: "~1.1 GW", contracted: "~1.5 GW" }, powerType: "Grid + renewables (global)",
    keyClients: "Pure Bitcoin mining (exploring AI)", backlog: "N/A (exploring)",
    contracts: "No major AI contracts · Exploring AI/HPC joint ventures · Kaspa mining diversification",
    revenue: "$252M quarterly (mining)", locations: "TX, NE, OH, ND, UAE, Paraguay — global",
    timeline: "AI exploration phase",
    ecosystem: "No AI/HPC partnerships. Exploring JV opportunities. Kaspa mining diversification. Global but no hyperscaler relationships", notes: "Largest BTC miner by market cap. 44.9% gross margins (mining). Global power portfolio but no AI pivot yet.", color: T_.textGhost },
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
    ecosystem: "Hyperscaler PPAs rumored. No confirmed equity stakes. ERCOT positioning for TX AI corridor", notes: "2nd largest US nuclear operator. ERCOT exposure = direct TX AI boom play. +300% in 2025. Gas peakers for behind-meter.", color: T_.red },
  { name: "Talen Energy", ticker: "TLN", status: "Public (Nasdaq)", valuation: "$12B+", founded: 2015, hq: "Houston, TX",
    power: { connected: "~13 GW fleet", contracted: "960 MW sold to AWS" }, powerType: "Nuclear + gas",
    keyClients: "Amazon/AWS (Susquehanna campus)", backlog: "$650M (AWS deal)",
    contracts: "Sold 960 MW Susquehanna nuclear campus to AWS for $650M (Mar 2024) · Cumulus Data (DC co-located with nuclear)",
    revenue: "$3.5B+ (FY2025)", locations: "PA (Susquehanna nuclear), MT, TX",
    timeline: "AWS Susquehanna DC operational 2025 · Expanding Cumulus Data",
    ecosystem: "Amazon/AWS (direct nuclear-to-DC sale, landmark deal). Cumulus Data subsidiary for co-located DC+power", notes: "First major nuclear-to-AI DC deal. Susquehanna sale validated nuclear+DC model. IPO'd from bankruptcy 2023.", color: T_.amber },
  { name: "Oklo", ticker: "OKLO", status: "Public (NYSE)", valuation: "$5B+", founded: 2013, hq: "Santa Clara, CA",
    power: { connected: "0 MW (pre-revenue)", contracted: "~2 GW pipeline" }, powerType: "Advanced nuclear (SMR)",
    keyClients: "DOD, Equinix, Switch (signed LOIs)", backlog: "2 GW pipeline (LOIs/MOUs)",
    contracts: "Equinix 500 MW LOI · Switch 12 GW LOI · DOE fuel recycling agreement · Sam Altman chairman",
    revenue: "Pre-revenue", locations: "Idaho (INL site), OH, TX planned",
    timeline: "First reactor ~2027 · Commercial scale 2028-2030",
    ecosystem: "Sam Altman (OpenAI) is Chairman. Equinix, Switch LOIs. DOE fuel recycling partnership. ARC Holdings (Altman's fund) largest investor", notes: "Sam Altman-backed SMR play. Pre-revenue but 2 GW pipeline. Only fission power company with NRC application. AI power optionality.", color: T_.purple },
  { name: "NRG Energy", ticker: "NRG", status: "Public (NYSE)", valuation: "$22B+", founded: 2003, hq: "Houston, TX",
    power: { connected: "~23 GW fleet", contracted: "DC PPAs growing" }, powerType: "Gas + nuclear + solar + wind",
    keyClients: "Enterprise, retail, hyperscaler PPAs", backlog: "Multi-billion",
    contracts: "Behind-meter gas generation for TX DCs · Corporate PPAs growing · Vivint retail power",
    revenue: "$34B+ (FY2025)", locations: "TX, CT, DE, MD, NJ, NY, PA, IL",
    timeline: "Expanding DC-specific PPAs 2026+",
    ecosystem: "Large diversified power generator. TX ERCOT presence. Growing DC PPA business. Retail + wholesale model", notes: "Largest competitive power generator in US. ERCOT TX exposure for AI data center corridor. Diversified fuel mix.", color: T_.green },
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
    ecosystem: "Sole-source or duopoly for heavy-duty gas turbines (with Siemens Energy). Grid transformers critical bottleneck for AI DC grid connections", notes: "Grid equipment bottleneck play. Transformers sold out 3+ yrs. Every GW of AI DC needs grid upgrades. GE Vernova spun off from GE Apr 2024.", color: T_.blue },
  { name: "Vertiv", ticker: "VRT", status: "Public (NYSE)", valuation: "$45B+", founded: 2000, hq: "Columbus, OH",
    power: { connected: "Equip supplier", contracted: "N/A" }, powerType: "DC power/cooling/management infrastructure",
    keyClients: "All hyperscalers, DC operators, neoclouds", backlog: "$7B+ orders",
    contracts: "Power distribution, UPS, thermal management, monitoring for AI DCs · Liquid cooling for GPU racks",
    revenue: "$8.5B+ (FY2025, +18% YoY)", locations: "Global (200+ service centers, 35+ countries)",
    timeline: "Liquid cooling revenue 3x 2025 · AI DC demand accelerating",
    ecosystem: "Every AI DC uses Vertiv equipment. NVIDIA-recommended cooling partner. Liquid cooling for GB200/Vera Rubin racks is critical", notes: "Picks-and-shovels AI infrastructure. Liquid cooling is the constraint for next-gen GPUs. +150% in 2024. S&P 500 added.", color: T_.amber },
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
      { name: "Equipment", weight: 23.4, color: T_.amber },
      { name: "AI / GPU", weight: 22.4, color: T_.blue },
      { name: "Foundry", weight: 11.3, color: "#06B6D4" },
      { name: "Analog", weight: 9.7, color: "#F97316" },
      { name: "Networking", weight: 6.5, color: T_.purple },
      { name: "Memory", weight: 6.5, color: "#A855F7" },
      { name: "EDA", weight: 4.7, color: T_.red },
      { name: "IDM", weight: 4.4, color: T_.green },
      { name: "Mobile", weight: 3.2, color: "#14B8A6" },
      { name: "Auto/IoT", weight: 1.8, color: "#6366F1" },
      { name: "Power", weight: 1.0, color: "#84CC16" },
      { name: "MCU", weight: 1.0, color: "#22D3EE" },
      { name: "RF", weight: 0.4, color: "#1E40AF" },
      { name: "Display", weight: 0.1, color: T_.amber },
      { name: "Other / Cash", weight: 3.6, color: "#475569" },
    ],
    holdings: [
      { ticker: "NVDA", name: "NVIDIA Corp", weight: 18.25, price: 174.60, ltmEps: 4.90, fwdEps: 8.67, ltmPe: 35.6, fwdPe: 20.1, sector: "AI / GPU", sectorColor: T_.blue },
      { ticker: "TSM", name: "Taiwan Semiconductor", weight: 11.27, price: 332.00, ltmEps: 10.41, fwdEps: 15.96, ltmPe: 31.9, fwdPe: 20.8, sector: "Foundry", sectorColor: "#06B6D4" },
      { ticker: "AVGO", name: "Broadcom Inc", weight: 6.88, price: 315.80, ltmEps: 5.09, fwdEps: 11.45, ltmPe: 62.0, fwdPe: 27.6, sector: "Networking", sectorColor: T_.purple },
      { ticker: "MU", name: "Micron Technology", weight: 6.47, price: 376.30, ltmEps: 21.46, fwdEps: 30.52, ltmPe: 17.5, fwdPe: 12.3, sector: "Memory", sectorColor: "#A855F7" },
      { ticker: "ASML", name: "ASML Holding NV", weight: 5.84, price: 1394.00, ltmEps: 29.03, fwdEps: 28.06, ltmPe: 48.0, fwdPe: 49.7, sector: "Equipment", sectorColor: T_.amber },
      { ticker: "LRCX", name: "Lam Research", weight: 5.68, price: 216.64, ltmEps: 4.53, fwdEps: 11.11, ltmPe: 47.8, fwdPe: 19.5, sector: "Equipment", sectorColor: T_.amber },
      { ticker: "AMAT", name: "Applied Materials", weight: 5.12, price: 352.88, ltmEps: 11.38, fwdEps: 12.79, ltmPe: 31.0, fwdPe: 27.6, sector: "Equipment", sectorColor: T_.amber },
      { ticker: "KLAC", name: "KLA Corporation", weight: 4.92, price: 1467.45, ltmEps: 32.68, fwdEps: 69.09, ltmPe: 44.9, fwdPe: 21.2, sector: "Equipment", sectorColor: T_.amber },
      { ticker: "ADI", name: "Analog Devices", weight: 4.02, price: 316.18, ltmEps: 5.38, fwdEps: 9.91, ltmPe: 58.8, fwdPe: 31.9, sector: "Analog", sectorColor: "#F97316" },
      { ticker: "AMD", name: "Advanced Micro Devices", weight: 3.90, price: 205.29, ltmEps: 3.83, fwdEps: 6.39, ltmPe: 53.6, fwdPe: 32.1, sector: "AI / GPU", sectorColor: T_.blue },
      { ticker: "QCOM", name: "Qualcomm Inc", weight: 3.75, price: 130.89, ltmEps: 4.92, fwdEps: 8.96, ltmPe: 26.6, fwdPe: 14.6, sector: "Mobile", sectorColor: "#14B8A6" },
      { ticker: "MRVL", name: "Marvell Technology", weight: 3.50, price: 97.92, ltmEps: 3.25, fwdEps: 2.94, ltmPe: 30.1, fwdPe: 33.3, sector: "Networking", sectorColor: T_.purple },
      { ticker: "NXPI", name: "NXP Semiconductors", weight: 2.80, price: 198.67, ltmEps: 8.04, fwdEps: 14.39, ltmPe: 24.7, fwdPe: 13.8, sector: "Auto/IoT", sectorColor: "#6366F1" },
      { ticker: "TXN", name: "Texas Instruments", weight: 2.50, price: 195.83, ltmEps: 5.42, fwdEps: 7.01, ltmPe: 36.1, fwdPe: 27.9, sector: "Analog", sectorColor: "#F97316" },
      { ticker: "INTC", name: "Intel Corp", weight: 2.00, price: 47.00, ltmEps: -0.15, fwdEps: 0.50, ltmPe: 0, fwdPe: 94.0, sector: "IDM", sectorColor: T_.green },
      { ticker: "ARM", name: "Arm Holdings", weight: 2.40, price: 154.80, ltmEps: 0.74, fwdEps: 2.14, ltmPe: 209.2, fwdPe: 72.4, sector: "AI / GPU", sectorColor: T_.blue },
      { ticker: "SNPS", name: "Synopsys Inc", weight: 1.50, price: 401.95, ltmEps: 6.51, fwdEps: 17.06, ltmPe: 61.7, fwdPe: 23.6, sector: "EDA", sectorColor: T_.red },
      { ticker: "CDNS", name: "Cadence Design", weight: 1.30, price: 280.62, ltmEps: 4.07, fwdEps: 9.41, ltmPe: 68.9, fwdPe: 29.8, sector: "EDA", sectorColor: T_.red },
      { ticker: "MPWR", name: "Monolithic Power", weight: 1.20, price: 1058.28, ltmEps: 12.91, fwdEps: 25.85, ltmPe: 82.0, fwdPe: 40.9, sector: "Power", sectorColor: "#84CC16" },
      { ticker: "ON", name: "ON Semiconductor", weight: 1.10, price: 60.87, ltmEps: 0.29, fwdEps: 4.03, ltmPe: 209.9, fwdPe: 15.1, sector: "Power", sectorColor: "#84CC16" },
      { ticker: "CRDO", name: "Credo Technology", weight: 1.00, price: 96.44, ltmEps: 1.82, fwdEps: 4.72, ltmPe: 53.0, fwdPe: 20.4, sector: "Networking", sectorColor: T_.purple },
      { ticker: "MCHP", name: "Microchip Technology", weight: 0.90, price: 64.20, ltmEps: -1.08, fwdEps: 2.66, ltmPe: 0, fwdPe: 24.1, sector: "MCU", sectorColor: "#22D3EE" },
      { ticker: "GFS", name: "GlobalFoundries", weight: 0.80, price: 44.57, ltmEps: 1.59, fwdEps: 2.37, ltmPe: 28.0, fwdPe: 18.8, sector: "Foundry", sectorColor: "#06B6D4" },
      { ticker: "SWKS", name: "Skyworks Solutions", weight: 0.60, price: 56.66, ltmEps: 2.61, fwdEps: 4.99, ltmPe: 21.7, fwdPe: 11.4, sector: "RF", sectorColor: "#1E40AF" },
      { ticker: "ENTG", name: "Entegris Inc", weight: 0.50, price: 115.75, ltmEps: 1.55, fwdEps: 4.39, ltmPe: 74.7, fwdPe: 26.4, sector: "Equipment", sectorColor: T_.amber },
    ],
  },
  SOXX: {
    name: "iShares Semiconductor ETF", price: 323.48, ltmPe: 39.7, fwdPe: 0, ltmEps: 8.15, fwdEps: 0, beta1Y: 1.60, beta3Y: 1.72,
    sectors: [
      { name: "AI / GPU", weight: 13.8, color: T_.blue },
      { name: "Memory", weight: 14.9, color: "#A855F7" },
      { name: "Equipment", weight: 19.8, color: T_.amber },
      { name: "Foundry", weight: 5.5, color: "#06B6D4" },
      { name: "Analog", weight: 10.2, color: "#F97316" },
      { name: "Networking", weight: 9.5, color: T_.purple },
      { name: "IDM", weight: 6.0, color: T_.green },
      { name: "EDA", weight: 5.8, color: T_.red },
      { name: "Mobile", weight: 4.5, color: "#14B8A6" },
      { name: "Auto/IoT", weight: 3.5, color: "#6366F1" },
      { name: "Power", weight: 2.5, color: "#84CC16" },
      { name: "Other", weight: 4.0, color: T_.textDim },
    ],
    holdings: [
      { ticker: "MU", name: "Micron Technology", weight: 8.61, price: 357.22, ltmEps: 21.14, fwdEps: 99.23, ltmPe: 16.9, fwdPe: 3.6, sector: "Memory", sectorColor: "#A855F7" },
      { ticker: "AMAT", name: "Applied Materials", weight: 7.29, price: 337.17, ltmEps: 9.74, fwdEps: 13.82, ltmPe: 34.6, fwdPe: 24.4, sector: "Equipment", sectorColor: T_.amber },
      { ticker: "NVDA", name: "NVIDIA Corp", weight: 6.71, price: 167.52, ltmEps: 4.91, fwdEps: 11.10, ltmPe: 34.1, fwdPe: 15.1, sector: "AI / GPU", sectorColor: T_.blue },
      { ticker: "AMD", name: "Advanced Micro Devices", weight: 6.17, price: 201.99, ltmEps: 2.61, fwdEps: 10.74, ltmPe: 77.4, fwdPe: 18.8, sector: "AI / GPU", sectorColor: T_.blue },
      { ticker: "AVGO", name: "Broadcom Inc", weight: 5.32, price: 300.68, ltmEps: 5.14, fwdEps: 17.79, ltmPe: 58.5, fwdPe: 16.9, sector: "Networking", sectorColor: T_.purple },
      { ticker: "LRCX", name: "Lam Research", weight: 5.03, price: 211.41, ltmEps: 4.86, fwdEps: 6.91, ltmPe: 43.5, fwdPe: 30.6, sector: "Equipment", sectorColor: T_.amber },
      { ticker: "ADI", name: "Analog Devices", weight: 4.50, price: 307.44, ltmEps: 5.47, fwdEps: 12.92, ltmPe: 56.2, fwdPe: 23.8, sector: "Analog", sectorColor: "#F97316" },
      { ticker: "KLAC", name: "KLA Corporation", weight: 4.35, price: 1443.21, ltmEps: 34.36, fwdEps: 47.63, ltmPe: 42.0, fwdPe: 30.3, sector: "Equipment", sectorColor: T_.amber },
      { ticker: "ASML", name: "ASML Holding NV", weight: 4.31, price: 1302.47, ltmEps: 28.52, fwdEps: 43.30, ltmPe: 45.7, fwdPe: 30.1, sector: "Equipment", sectorColor: T_.amber },
      { ticker: "TER", name: "Teradyne Inc", weight: 4.29, price: 295.61, ltmEps: 3.46, fwdEps: 8.23, ltmPe: 85.4, fwdPe: 35.9, sector: "Equipment", sectorColor: T_.amber },
      { ticker: "QCOM", name: "Qualcomm Inc", weight: 4.10, price: 127.11, ltmEps: 4.96, fwdEps: 11.15, ltmPe: 25.6, fwdPe: 11.4, sector: "Mobile", sectorColor: "#14B8A6" },
      { ticker: "MRVL", name: "Marvell Technology", weight: 3.80, price: 94.88, ltmEps: 3.07, fwdEps: 5.45, ltmPe: 30.9, fwdPe: 17.4, sector: "Networking", sectorColor: T_.purple },
      { ticker: "TSM", name: "Taiwan Semiconductor", weight: 3.60, price: 326.74, ltmEps: 10.37, fwdEps: 17.95, ltmPe: 31.5, fwdPe: 18.2, sector: "Foundry", sectorColor: "#06B6D4" },
      { ticker: "TXN", name: "Texas Instruments", weight: 3.50, price: 190.33, ltmEps: 5.44, fwdEps: 7.91, ltmPe: 35.0, fwdPe: 24.1, sector: "Analog", sectorColor: "#F97316" },
      { ticker: "SNPS", name: "Synopsys Inc", weight: 3.00, price: 380.47, ltmEps: 6.51, fwdEps: 17.06, ltmPe: 58.4, fwdPe: 22.3, sector: "EDA", sectorColor: T_.red },
      { ticker: "CDNS", name: "Cadence Design", weight: 2.70, price: 271.77, ltmEps: 4.05, fwdEps: 9.41, ltmPe: 67.1, fwdPe: 28.9, sector: "EDA", sectorColor: T_.red },
      { ticker: "NXPI", name: "NXP Semiconductors", weight: 2.60, price: 191.66, ltmEps: 7.95, fwdEps: 16.74, ltmPe: 24.1, fwdPe: 11.4, sector: "Auto/IoT", sectorColor: "#6366F1" },
      { ticker: "ON", name: "ON Semiconductor", weight: 2.40, price: 58.35, ltmEps: 0.29, fwdEps: 4.02, ltmPe: 201.2, fwdPe: 14.5, sector: "Power", sectorColor: "#84CC16" },
      { ticker: "MPWR", name: "Monolithic Power", weight: 2.10, price: 1053.01, ltmEps: 12.86, fwdEps: 25.87, ltmPe: 81.9, fwdPe: 40.7, sector: "Power", sectorColor: "#84CC16" },
      { ticker: "ARM", name: "Arm Holdings", weight: 1.90, price: 144.13, ltmEps: 0.75, fwdEps: 2.14, ltmPe: 192.2, fwdPe: 67.4, sector: "AI / GPU", sectorColor: T_.blue },
      { ticker: "INTC", name: "Intel Corp", weight: 1.80, price: 43.13, ltmEps: 0, fwdEps: 0.99, ltmPe: 0, fwdPe: 43.5, sector: "IDM", sectorColor: T_.green },
      { ticker: "CRDO", name: "Credo Technology", weight: 1.60, price: 95.24, ltmEps: 1.82, fwdEps: 4.72, ltmPe: 52.3, fwdPe: 20.2, sector: "Networking", sectorColor: T_.purple },
      { ticker: "MCHP", name: "Microchip Technology", weight: 1.40, price: 62.00, ltmEps: 0, fwdEps: 2.66, ltmPe: 0, fwdPe: 23.3, sector: "MCU", sectorColor: "#22D3EE" },
      { ticker: "ENTG", name: "Entegris Inc", weight: 1.30, price: 113.59, ltmEps: 1.54, fwdEps: 4.39, ltmPe: 73.8, fwdPe: 25.9, sector: "Equipment", sectorColor: T_.amber },
      { ticker: "GFS", name: "GlobalFoundries", weight: 1.20, price: 42.94, ltmEps: 1.59, fwdEps: 2.37, ltmPe: 27.0, fwdPe: 18.1, sector: "Foundry", sectorColor: "#06B6D4" },
      { ticker: "MKSI", name: "MKS Instruments", weight: 1.10, price: 223.18, ltmEps: 4.37, fwdEps: 12.00, ltmPe: 51.1, fwdPe: 18.6, sector: "Equipment", sectorColor: T_.amber },
      { ticker: "SWKS", name: "Skyworks Solutions", weight: 1.00, price: 53.65, ltmEps: 2.61, fwdEps: 4.99, ltmPe: 20.6, fwdPe: 10.8, sector: "RF", sectorColor: "#1E40AF" },
      { ticker: "RMBS", name: "Rambus Inc", weight: 0.90, price: 89.73, ltmEps: 2.11, fwdEps: 3.52, ltmPe: 42.5, fwdPe: 25.5, sector: "Memory", sectorColor: "#A855F7" },
      { ticker: "LSCC", name: "Lattice Semiconductor", weight: 0.80, price: 90.39, ltmEps: 0.02, fwdEps: 2.00, ltmPe: 0, fwdPe: 45.1, sector: "FPGA", sectorColor: "#14B8A6" },
      { ticker: "ALAB", name: "Astera Labs", weight: 1.36, price: 112.47, ltmEps: 1.21, fwdEps: 3.53, ltmPe: 93.0, fwdPe: 31.9, sector: "Networking", sectorColor: T_.purple },
      { ticker: "MTSI", name: "MACOM Technology", weight: 1.35, price: 225.44, ltmEps: 2.21, fwdEps: 5.57, ltmPe: 102.0, fwdPe: 40.5, sector: "RF", sectorColor: "#1E40AF" },
      { ticker: "NVMI", name: "Nova Ltd", weight: 1.27, price: 440.72, ltmEps: 7.94, fwdEps: 12.49, ltmPe: 55.5, fwdPe: 35.3, sector: "Equipment", sectorColor: T_.amber },
      { ticker: "ASX", name: "ASE Technology", weight: 0.97, price: 21.50, ltmEps: 0.56, fwdEps: 1.20, ltmPe: 38.4, fwdPe: 17.9, sector: "IDM", sectorColor: T_.green },
      { ticker: "QRVO", name: "Qorvo Inc", weight: 0.70, price: 77.35, ltmEps: 3.63, fwdEps: 6.73, ltmPe: 21.3, fwdPe: 11.5, sector: "RF", sectorColor: "#1E40AF" },
      { ticker: "CRUS", name: "Cirrus Logic", weight: 0.65, price: 143.39, ltmEps: 7.59, fwdEps: 9.19, ltmPe: 18.9, fwdPe: 15.6, sector: "Analog", sectorColor: "#F97316" },
      { ticker: "AMKR", name: "Amkor Technology", weight: 0.55, price: 44.45, ltmEps: 1.50, fwdEps: 2.29, ltmPe: 29.6, fwdPe: 19.4, sector: "IDM", sectorColor: T_.green },
      { ticker: "WOLF", name: "Wolfspeed Inc", weight: 0.45, price: 15.44, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Power", sectorColor: "#84CC16" },
      { ticker: "ALGM", name: "Allegro MicroSystems", weight: 0.35, price: 30.12, ltmEps: 0, fwdEps: 0.94, ltmPe: 0, fwdPe: 32.0, sector: "Analog", sectorColor: "#F97316" },
    ],
  },
  FLKR: {
    name: "Franklin FTSE South Korea ETF", price: 39.29, ltmPe: 15.8, fwdPe: 0, ltmEps: 2.49, fwdEps: 0, beta1Y: 1.08, beta3Y: 1.15,
    sectors: [
      { name: "Semiconductors", weight: 44.0, color: T_.blue },
      { name: "Automotive", weight: 10.5, color: T_.purple },
      { name: "Financials", weight: 10.0, color: T_.green },
      { name: "Industrials", weight: 8.5, color: "#06B6D4" },
      { name: "Communication Svc", weight: 5.5, color: T_.amber },
      { name: "Materials", weight: 5.0, color: "#F97316" },
      { name: "Healthcare", weight: 4.5, color: T_.red },
      { name: "Energy", weight: 3.5, color: "#84CC16" },
      { name: "Consumer", weight: 3.5, color: "#14B8A6" },
      { name: "Other", weight: 5.0, color: T_.textDim },
    ],
    holdings: [
      // Prices in KRW from Yahoo Finance (3/27/26). P/E populated on live refresh.
      { ticker: "005930", name: "Samsung Electronics", weight: 22.27, price: 179700, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Semiconductors", sectorColor: T_.blue },
      { ticker: "000660", name: "SK Hynix", weight: 20.88, price: 922000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Semiconductors", sectorColor: T_.blue },
      { ticker: "005380", name: "Hyundai Motor", weight: 3.31, price: 495000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Automotive", sectorColor: T_.purple },
      { ticker: "005935", name: "Samsung Elec Pref", weight: 2.56, price: 126200, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Semiconductors", sectorColor: T_.blue },
      { ticker: "402340", name: "SK Square", weight: 2.10, price: 544000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Semiconductors", sectorColor: T_.blue },
      { ticker: "105560", name: "KB Financial Group", weight: 2.06, price: 152200, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: T_.green },
      { ticker: "000270", name: "Kia Corporation", weight: 1.77, price: 155800, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Automotive", sectorColor: T_.purple },
      { ticker: "034020", name: "Doosan Enerbility", weight: 1.71, price: 98100, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "055550", name: "Shinhan Financial", weight: 1.50, price: 93500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: T_.green },
      { ticker: "012450", name: "Hanwha Aerospace", weight: 1.48, price: 1335000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "035420", name: "Naver Corp", weight: 1.45, price: 212500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Communication Svc", sectorColor: T_.amber },
      { ticker: "012330", name: "Hyundai Mobis", weight: 1.40, price: 408500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Automotive", sectorColor: T_.purple },
      { ticker: "068270", name: "Celltrion Inc", weight: 1.31, price: 206000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Healthcare", sectorColor: T_.red },
      { ticker: "086790", name: "Hana Financial Group", weight: 1.29, price: 110400, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: T_.green },
      { ticker: "086280", name: "Hyundai Glovis", weight: 1.20, price: 231500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "005490", name: "POSCO Holdings", weight: 1.12, price: 343000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "096770", name: "SK Innovation", weight: 1.15, price: 111400, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Energy", sectorColor: "#84CC16" },
      { ticker: "066570", name: "LG Electronics", weight: 1.10, price: 112000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Consumer", sectorColor: "#14B8A6" },
      { ticker: "028260", name: "Samsung C&T", weight: 1.05, price: 269000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "003670", name: "POSCO Future M", weight: 1.00, price: 209000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "373220", name: "LG Energy Solution", weight: 0.95, price: 394500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "329180", name: "HD Hyundai Heavy Ind", weight: 0.90, price: 498500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "009150", name: "Samsung Electro-Mech", weight: 0.88, price: 434000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Semiconductors", sectorColor: T_.blue },
      { ticker: "006400", name: "Samsung SDI", weight: 1.08, price: 405500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "267260", name: "HD Hyundai Electric", weight: 0.96, price: 915000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "207940", name: "Samsung Biologics", weight: 0.83, price: 1606000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Healthcare", sectorColor: T_.red },
      { ticker: "032830", name: "Samsung Life", weight: 0.79, price: 223000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: T_.green },
      { ticker: "259960", name: "Krafton", weight: 0.80, price: 254500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Communication Svc", sectorColor: T_.amber },
      { ticker: "009540", name: "HD Korea Shipbuilding", weight: 0.76, price: 367000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "010140", name: "Samsung Heavy Ind", weight: 0.75, price: 26000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "010130", name: "Korea Zinc", weight: 0.72, price: 1483000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "017670", name: "SK Telecom", weight: 0.72, price: 79900, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Communication Svc", sectorColor: T_.amber },
      { ticker: "034730", name: "SK Inc", weight: 0.70, price: 334000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "051910", name: "LG Chem", weight: 0.68, price: 313000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "000810", name: "Samsung Fire & Marine", weight: 0.65, price: 443000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: T_.green },
      { ticker: "018260", name: "Samsung SDS", weight: 0.62, price: 156300, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Semiconductors", sectorColor: T_.blue },
      { ticker: "030200", name: "KT Corp", weight: 0.60, price: 60800, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Communication Svc", sectorColor: T_.amber },
      { ticker: "003490", name: "Korean Air", weight: 0.58, price: 25300, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "035720", name: "Kakao Corp", weight: 0.55, price: 48800, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Communication Svc", sectorColor: T_.amber },
      { ticker: "316140", name: "Woori Financial Group", weight: 0.52, price: 33600, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: T_.green },
      { ticker: "036570", name: "NCsoft", weight: 0.50, price: 230000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Communication Svc", sectorColor: T_.amber },
      { ticker: "180640", name: "Hanjin KAL", weight: 0.48, price: 117200, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "011200", name: "HMM Co", weight: 0.45, price: 19660, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "033780", name: "KT&G", weight: 0.43, price: 158000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Consumer", sectorColor: "#14B8A6" },
      { ticker: "352820", name: "HYBE", weight: 0.42, price: 307000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Communication Svc", sectorColor: T_.amber },
      { ticker: "003550", name: "LG Corp", weight: 0.40, price: 89000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Industrials", sectorColor: "#06B6D4" },
      { ticker: "047050", name: "POSCO International", weight: 0.38, price: 74500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "326030", name: "SK Biopharmaceuticals", weight: 0.36, price: 100300, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Healthcare", sectorColor: T_.red },
      { ticker: "097950", name: "CJ CheilJedang", weight: 0.34, price: 214500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Consumer", sectorColor: "#14B8A6" },
      { ticker: "011170", name: "Lotte Chemical", weight: 0.32, price: 82700, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Materials", sectorColor: "#F97316" },
      { ticker: "161390", name: "Hankook Tire", weight: 0.30, price: 58000, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Automotive", sectorColor: T_.purple },
      { ticker: "323410", name: "KakaoBank", weight: 0.28, price: 24650, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: T_.green },
      { ticker: "377300", name: "KakaoPay", weight: 0.26, price: 53500, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: T_.green },
      { ticker: "138930", name: "BNK Financial Group", weight: 0.24, price: 18680, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: T_.green },
      { ticker: "024110", name: "Industrial Bank of Korea", weight: 0.22, price: 23550, ltmEps: 0, fwdEps: 0, ltmPe: 0, fwdPe: 0, sector: "Financials", sectorColor: T_.green },
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
  const [activeGpu, setActiveGpu] = useState("all");
  const [chipVendorFilter, setChipVendorFilter] = useState("All");
  const [chipDeliverySort, setChipDeliverySort] = useState({ key: "shipDate", dir: "desc" });
  const [chipHistSort, setChipHistSort] = useState({ key: "q", dir: "desc" });
  const [cpuVendorFilter, setCpuVendorFilter] = useState("All");
  const [cpuDeliverySort, setCpuDeliverySort] = useState({ key: "shipDate", dir: "desc" });
  const [cpuHistSort, setCpuHistSort] = useState({ key: "q", dir: "desc" });
  const [llmLabFilter, setLlmLabFilter] = useState("All");
  const [llmTableSort, setLlmTableSort] = useState({ key: "date", dir: "desc" });
  const [neocloudSort, setNeocloudSort] = useState({ key: "backlog", dir: "desc" });
  const [shellSort, setShellSort] = useState({ key: "backlog", dir: "desc" });

  const s = {
    page: { fontFamily: FONT, background: T_.bg, color: T_.textMid, minHeight: "100vh", padding: "36px 52px" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, borderBottom: `1px solid ${T_.border}`, paddingBottom: 20 },
    title: { fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px", color: T_.text },
    subtitle: { fontSize: 14, color: T_.textDim, marginTop: 4 },
    bigNum: { fontSize: 32, fontWeight: 700, color: T_.text, letterSpacing: "-1px" },
    card: { background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 16 },
    statsRow: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
    statBox: { background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "14px 18px", flex: "1 1 140px", minWidth: 140 },
    statLabel: { fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 },
    statVal: { fontSize: 20, fontWeight: 700, color: T_.text },
    filtersRow: { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" },
    filterGroup: { display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: `1px solid ${T_.border}` },
    filterBtn: (active) => ({
      padding: "7px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.15s",
      background: active ? T_.blue : T_.bgPanel, color: active ? "#FFF" : T_.textDim,
    }),
    viewToggle: (active) => ({
      padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", borderRadius: 8, transition: "all 0.15s",
      background: active ? T_.border : "transparent", color: active ? T_.text : T_.textDim,
    }),
    table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 },
    th: { textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}`, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" },
    thRight: { textAlign: "right", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}`, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" },
    td: { padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, whiteSpace: "nowrap" },
    tdRight: { padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" },
    ticker: { fontWeight: 700, color: T_.text, fontSize: 14, letterSpacing: "0.3px" },
    name: { color: T_.textDim, fontSize: 11, marginTop: 1 },
    badge: (type) => ({
      display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
      background: TYPE_COLORS[type]?.bg || "#333", color: TYPE_COLORS[type]?.text || "#FFF",
      border: `1px solid ${TYPE_COLORS[type]?.border || "#555"}`,
    }),
    peInput: { width: 58, padding: "4px 6px", fontSize: 12, background: "#0B0F19", border: `1px solid ${T_.border}`, borderRadius: 4, color: T_.textMid, textAlign: "right", outline: "none" },
    btn: { padding: "6px 14px", fontSize: 12, fontWeight: 600, borderRadius: 6, border: "none", cursor: "pointer", transition: "all 0.15s" },
    barWrap: { width: "100%", height: 6, background: T_.border, borderRadius: 3, overflow: "hidden" },
    bar: (pct, color) => ({ width: `${Math.min(pct, 100)}%`, height: "100%", background: color || T_.blue, borderRadius: 3, transition: "width 0.3s" }),
    input: { padding: "6px 10px", fontSize: 12, background: "#0B0F19", border: `1px solid ${T_.border}`, borderRadius: 6, color: T_.textMid, outline: "none", width: "100%" },
    select: { padding: "6px 10px", fontSize: 12, background: "#0B0F19", border: `1px solid ${T_.border}`, borderRadius: 6, color: T_.textMid, outline: "none" },
  };

  // Stub holdings as empty for supply chain map (research portal has no portfolio)
  const holdings = [];

  return (
    <div style={s.page}>
      {mainTab === "ailabs" && (() => {
        const labKeys = ["OpenAI", "Anthropic", "Google", "xAI", "Meta"];
        const lab = AI_LABS_DATA[activeLab];
        const maxArr = lab ? Math.max(...lab.arr.map(a => a.value)) : 0;
        const maxCompute = lab ? Math.max(...lab.compute.map(c => c.value)) : 0;
        return (<>
        {/* Lab Sub-tabs */}
        <TabBar
          tabs={[{ key: "Overview", label: "Overview" }, ...labKeys.map(k => ({ key: k, label: AI_LABS_DATA[k].name }))]}
          active={activeLab}
          onChange={setActiveLab}
          size="lg"
        />

        {/* ===== OVERVIEW SUB-TAB ===== */}
        {activeLab === "Overview" && (<>

        {/* AI Labs Industry & Market Updates — full width */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: T_.blue }}>●</span> Industry & Market Updates
          </div>
          <div style={{ maxHeight: 280, overflow: "auto", padding: "12px 16px" }}>
            {AI_LABS_NEWS.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ fontSize: 11, color: T_.textGhost, minWidth: 50, flexShrink: 0, fontWeight: 600, marginTop: 1 }}>{item.date}</span>
                <span style={{ fontSize: 13, color: "#CBD5E1" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Labs Summary Table */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}` }}>AI Labs — Key Metrics Comparison</div>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr>
                {["Metric", "OpenAI", "Anthropic", "Google DeepMind", "xAI", "Meta AI"].map((h, i) => (
                  <th key={h} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 600, color: i === 0 ? T_.textDim : [null, T_.green, T_.amber, T_.blue, T_.red, "#A855F7"][i], textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: `1px solid ${T_.border}`, textAlign: i === 0 ? "left" : "right", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { metric: "Valuation", vals: ["$852B", "$380B", "GOOGL $3.76T", "$230B", "META $1.5T"], bold: true },
                { metric: "Latest ARR", vals: ["~$24-25B (Apr '26)", "$30B (Apr '26)", "~$80B (Cloud Q1 '26)", "~$1B", "$56.3B Q1 '26 Rev"], bold: true },
                { metric: "2026E ARR", vals: ["$50B", "$26B", "$78B (Cloud)", "$2B", "$220B (Rev)"], bold: false },
                { metric: "MAU (Latest)", vals: ["~900M WAU", "~40M", "750M (Gemini)", "~35M (Grok)", "1.4B (Meta AI)"], bold: true },
                { metric: "Paying Users", vals: ["50M+ subs", "300K+ biz", "120K+ enterprise", "X Premium", "3.54B DAP"], bold: false },
                { metric: "Compute / Power", vals: ["~1.9 GW", "~1 GW", "~7.5 GW (fleet)", "~2 GW", "~4 GW (est.)"], bold: false },
                { metric: "Latest Flagship", vals: ["GPT-5.4", "Opus 4.7", "Gemini 2.5 Pro", "Grok 4.1", "Llama 4 Maverick"], bold: true },
              ].map((row, ri) => (
                <tr key={ri} onMouseEnter={e => e.currentTarget.style.background = `${T_.border}20`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "9px 14px", borderBottom: `1px solid ${T_.border}10`, fontWeight: 600, color: T_.textDim, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.4px" }}>{row.metric}</td>
                  {row.vals.map((v, vi) => (
                    <td key={vi} style={{ padding: "9px 14px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", fontWeight: row.bold ? 700 : 400, color: row.bold ? T_.text : T_.textMid, fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* API Pricing Table — All Models */}
        {(() => {
          const pricingLabs = ["OpenAI", "Anthropic", "Google", "xAI"];
          const pricingLabColors = { OpenAI: T_.green, Anthropic: T_.amber, Google: T_.blue, xAI: T_.red };
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
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T_.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px" }}>API Pricing — All Models</div>
            <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: `1px solid ${T_.border}` }}>
              {["All", ...pricingLabs].map(l => (
                <button key={l} onClick={() => setLlmLabFilter(l)} style={{
                  padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                  background: llmLabFilter === l ? (l === "All" ? T_.blue : pricingLabColors[l]) : T_.bgPanel,
                  color: llmLabFilter === l ? "#FFF" : T_.textDim, transition: "all 0.15s",
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
                    padding: "10px 12px", fontSize: 10, fontWeight: 600, color: T_.textDim,
                    textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}`,
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
                    onMouseEnter={e => e.currentTarget.style.background = `${T_.border}40`}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10` }}>
                      <span style={{ fontWeight: 700, color: pricingLabColors[m.lab] || T_.text, fontSize: 13 }}>{m.lab}</span>
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, fontWeight: 700, color: T_.text, fontSize: 14 }}>{m.model}</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10` }}>
                      <span style={{
                        display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                        background: m.tier === "flagship" ? "#FEF3C7" : m.tier === "mid" ? "#DBEAFE" : "#D1FAE5",
                        color: m.tier === "flagship" ? "#92400E" : m.tier === "mid" ? "#1E40AF" : "#065F46",
                      }}>{m.tier}</span>
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontVariantNumeric: "tabular-nums", fontSize: 14 }}>${m.input.toFixed(2)}</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", fontWeight: 700, color: T_.text, fontVariantNumeric: "tabular-nums", fontSize: 14 }}>${m.output.toFixed(2)}</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textDim, fontVariantNumeric: "tabular-nums" }}>{m.ctx >= 1000 ? `${(m.ctx/1000).toFixed(0)}M` : `${m.ctx}K`}</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textDim, fontSize: 12 }}>{m.date}</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                        <span style={{ fontWeight: 600, color: T_.green, fontSize: 12 }}>-{savings}%</span>
                        <div style={{ width: 50, height: 6, background: T_.border, borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${Math.min(parseInt(savings), 100)}%`, height: "100%", background: T_.green, borderRadius: 3 }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: "10px 16px", fontSize: 11, color: T_.textDim, fontStyle: "italic" }}>Deflation vs GPT-4: % cheaper than GPT-4's original $60/MTok output price at launch (Mar 2023). Click any column header to sort.</div>
        </div>
          );
        })()}

        {/* LLM Pricing Key Observations */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>LLM Pricing — Key Observations</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "\ud83d\udcc9", title: "10x Annual Deflation", text: "LLM inference costs decline faster than any prior technology \u2014 faster than Moore's Law, PC compute, or dotcom bandwidth. GPT-4-equivalent output: $60 \u2192 ~$0.40/MTok in 3 years." },
              { icon: "\ud83c\udfed", title: "Output 3-5x More Than Input", text: "All providers price output tokens 3-10x higher than input. Output requires sequential autoregressive generation while input parallelizes. Output-heavy apps face different economics." },
              { icon: "\ud83d\udcd0", title: "Context Windows Exploded 62x", text: "GPT-4's 32K (Mar '23) \u2192 Gemini's 2M tokens (Jun '24). Anthropic and OpenAI at 1M standard. Eliminates chunking overhead and enables entirely new use cases." },
              { icon: "\u2694\ufe0f", title: "Google Leads Price, Anthropic Quality-per-$", text: "Gemini Flash ($0.10-0.40/MTok output) undercuts all rivals. Anthropic Opus 4.6 dropped 67% from Opus 4 ($75\u2192$25). OpenAI GPT-5.4 balances cost + capability at $10/MTok." },
              { icon: "\ud83d\udd04", title: "Batch + Caching = 75-90% Further Savings", text: "Prompt caching (90% savings on repeated content) and batch APIs (50% off for async) mean sticker price is the ceiling. Production workloads routinely pay 25% of list." },
              { icon: "\ud83c\udde8\ud83c\uddf3", title: "DeepSeek Disrupted the Pricing Floor", text: "DeepSeek R1 at $0.55/$2.19 \u2014 90% below Western incumbents. Forces all providers to offer competitive value tiers or lose developer adoption." },
            ].map((item, idx) => (
              <div key={idx} style={{ background: "#0B0F19", borderRadius: 8, border: `1px solid ${T_.border}`, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T_.textMid }}>{item.title}</span>
                </div>
                <div style={{ fontSize: 12, color: T_.textDim, lineHeight: 1.6 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        </>)}

        {/* ===== INDIVIDUAL LAB SUB-TAB ===== */}
        {lab && (<>
        {/* Lab Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, borderBottom: `1px solid ${T_.border}`, paddingBottom: 20 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>{lab.name}</div>
            <div style={{ fontSize: 16, color: T_.textDim, marginTop: 4 }}>{lab.tagline}</div>
            <div style={{ fontSize: 14, color: T_.textDim, marginTop: 6 }}>{lab.hq} &middot; Founded {lab.founded} &middot; {lab.employees} employees &middot; CEO: {lab.ceo}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px" }}>Valuation</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: T_.text, letterSpacing: "-1px" }}>{lab.valuation.current}</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginTop: 2 }}>{lab.valuation.date} &middot; {lab.valuation.series}</div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "16px 18px", borderLeft: `3px solid ${T_.blue}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Users / Reach</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue }}>{lab.users.paying}</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginTop: 4 }}>{lab.users.trend}</div>
          </div>
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "16px 18px", borderLeft: `3px solid ${T_.green}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Burn / Profitability</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: T_.green, lineHeight: 1.5 }}>{lab.burn}</div>
          </div>
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "16px 18px", borderLeft: `3px solid ${T_.amber}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Latest Funding</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T_.amber }}>{lab.valuation.series}</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginTop: 4, lineHeight: 1.5 }}>{lab.valuation.investors}</div>
          </div>
        </div>

        {/* ARR + Compute Charts Side by Side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 8 }}>
          {/* ARR Growth Chart */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>{lab.arrLabel || "ARR — Annualized Run Rate ($B)"}</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 150 }}>
              {lab.arr.map((a, i) => {
                const barH = maxArr > 0 ? (a.value / maxArr) * 120 : 0;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: a.est ? T_.textDim : T_.text }}>${a.value >= 1 ? Math.round(a.value) : a.value}B</div>
                    <div style={{ width: "100%", maxWidth: 44, height: barH, background: a.est ? `linear-gradient(180deg, ${T_.borderStrong} 0%, ${T_.border} 100%)` : `linear-gradient(180deg, ${T_.blue} 0%, #1E40AF 100%)`, borderRadius: "4px 4px 0 0", transition: "height 0.3s", minHeight: 3, border: a.est ? "1px dashed #475569" : "none" }} />
                    <div style={{ fontSize: 11, color: T_.textDim }}>{a.year}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: T_.textDim, marginTop: 8, fontStyle: "italic" }}>Solid = actual &middot; Dashed = estimate</div>
          </div>

          {/* Compute / Power Growth Chart */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>{lab.computeLabel || "Compute / Power (GW)"}</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 150 }}>
              {lab.compute.map((c, i) => {
                const barH = maxCompute > 0 ? (c.value / maxCompute) * 120 : 0;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: c.est ? T_.textDim : T_.text }}>{c.value >= 1 ? c.value.toFixed(0) : c.value} GW</div>
                    <div style={{ width: "100%", maxWidth: 44, height: barH, background: c.est ? "linear-gradient(180deg, #374151 0%, #1F2937 100%)" : `linear-gradient(180deg, ${T_.amber} 0%, #B45309 100%)`, borderRadius: "4px 4px 0 0", transition: "height 0.3s", minHeight: 3, border: c.est ? "1px dashed #475569" : "none" }} />
                    <div style={{ fontSize: 11, color: T_.textDim }}>{c.year}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: T_.textDim, marginTop: 8, fontStyle: "italic" }}>Solid = actual &middot; Dashed = projection</div>
          </div>
        </div>

        {/* Current Trackers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: `1px solid ${T_.border}`, padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: T_.blue }}>{lab.arrCurrent.value}</span>
                <span style={{ fontSize: 13, color: T_.textDim, marginLeft: 8 }}>as of {lab.arrCurrent.date}</span>
              </div>
              <span style={{ fontSize: 11, color: T_.textDim }}>Track vs projection</span>
            </div>
            <div style={{ fontSize: 11, color: T_.textDim, marginTop: 4 }}>Source: {lab.arrSource}</div>
          </div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: `1px solid ${T_.border}`, padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: T_.amber }}>{lab.computeCurrent.value}</span>
                <span style={{ fontSize: 13, color: T_.textDim, marginLeft: 8 }}>as of {lab.computeCurrent.date}</span>
              </div>
              <span style={{ fontSize: 11, color: T_.textDim }}>Track vs projection</span>
            </div>
            <div style={{ fontSize: 11, color: T_.textDim, marginTop: 4 }}>Source: {lab.computeSource}</div>
          </div>
        </div>

        {/* MAU Growth Chart */}
        {lab.mau && (() => {
          const mauData = lab.mau.filter(m => m.value > 0);
          const maxMau = Math.max(...mauData.map(m => m.value));
          const formatMau = v => v >= 1000 ? `${(v/1000).toFixed(1)}B` : v >= 1 ? `${Math.round(v)}M` : `${(v*1000).toFixed(0)}K`;
          return (
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px" }}>{lab.mauLabel || "Platform MAU"}</div>
              <div style={{ fontSize: 11, color: T_.textDim, fontStyle: "italic" }}>{lab.mauSource}</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 170 }}>
              {lab.mau.map((m, i) => {
                const barH = maxMau > 0 && m.value > 0 ? Math.max((m.value / maxMau) * 130, 4) : 0;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    {m.value > 0 ? (
                      <>
                        <div style={{ fontSize: 10, fontWeight: 700, color: m.est ? T_.textDim : T_.text, whiteSpace: "nowrap" }}>{formatMau(m.value)}</div>
                        <div style={{ width: "100%", maxWidth: 36, height: barH, background: m.est ? `linear-gradient(180deg, ${T_.borderStrong} 0%, ${T_.border} 100%)` : `linear-gradient(180deg, ${T_.purple} 0%, #6D28D9 100%)`, borderRadius: "4px 4px 0 0", transition: "height 0.3s", border: m.est ? "1px dashed #475569" : "none" }} />
                      </>
                    ) : (
                      <div style={{ height: 0 }} />
                    )}
                    <div style={{ fontSize: 9, color: T_.textDim, whiteSpace: "nowrap" }}>{m.q}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: T_.textDim, marginTop: 8, fontStyle: "italic" }}>Solid = reported &middot; Dashed = estimate</div>
          </div>
          );
        })()}

        {/* ===== SUPPLY CHAIN MAP & CONTRACTS ===== */}
        {(() => {
          const supplyChains = {
            OpenAI: {
              layers: [
                { label: "AI Lab", items: [{ name: "OpenAI", sub: "$25B ARR · 900M WAU", color: T_.green }] },
                { label: "Cloud / Compute", items: [
                  { name: "Microsoft Azure", sub: "$250B (2025-2032)", color: T_.blue, link: "MSFT" },
                  { name: "Oracle Cloud", sub: "$300B (2027-2031)", color: T_.red, link: "ORCL" },
                  { name: "AWS", sub: "$38B 7yr", color: T_.amber, link: "AMZN" },
                  { name: "CoreWeave", sub: "$22.4B (thru 2029)", color: T_.purple, link: "CRWV" },
                ]},
                { label: "Silicon", items: [
                  { name: "NVIDIA", sub: "10 GW · Vera Rubin · $100B inv.", color: T_.green, link: "NVDA" },
                  { name: "AMD", sub: "6 GW · Instinct · 10% equity", color: T_.red, link: "AMD" },
                  { name: "Broadcom", sub: "10 GW custom ASIC", color: T_.blue, link: "AVGO" },
                  { name: "Intel", sub: "x86 CPUs", color: T_.textGhost, link: "INTC" },
                ]},
                { label: "Fabrication", items: [
                  { name: "TSMC", sub: "All GPU/ASIC fab", color: T_.purple, link: "TSM" },
                ]},
                { label: "Infrastructure / Power", items: [
                  { name: "Stargate JV", sub: "SoftBank + Oracle · $500B · 10 GW", color: T_.amber },
                  { name: "SoftBank", sub: "$30B inv. · Chair: Masa Son", color: "#A855F7", link: "9984.T" },
                  { name: "MGX (Abu Dhabi)", sub: "Stargate co-funder", color: T_.textGhost },
                ]},
                { label: "Distribution", items: [
                  { name: "ChatGPT", sub: "900M WAU · $200/mo Pro", color: T_.green },
                  { name: "Microsoft Copilot", sub: "M365, GitHub, Azure AI", color: T_.blue, link: "MSFT" },
                  { name: "Apple", sub: "Siri integration (in talks)", color: T_.textDim, link: "AAPL" },
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
                { label: "AI Lab", items: [{ name: "Anthropic", sub: "~$44B+ ARR · 300K+ biz", color: T_.amber }] },
                { label: "Cloud / Compute", items: [
                  { name: "AWS (Primary)", sub: "Project Rainier · $11B campus", color: T_.amber, link: "AMZN" },
                  { name: "Google Cloud", sub: "1M TPUs · 1+ GW · tens of $B", color: T_.blue, link: "GOOGL" },
                  { name: "Microsoft Azure", sub: "$30B compute · 1 GW", color: T_.purple, link: "MSFT" },
                ]},
                { label: "Silicon", items: [
                  { name: "AWS Trainium2/3", sub: "1M+ chips · Rainier · co-designed", color: T_.amber, link: "AMZN" },
                  { name: "Google TPU v7", sub: "Ironwood · 1M units", color: T_.blue, link: "GOOGL" },
                  { name: "NVIDIA", sub: "Grace Blackwell + Vera Rubin", color: T_.green, link: "NVDA" },
                ]},
                { label: "Own Infrastructure", items: [
                  { name: "Fluidstack DCs", sub: "$50B · TX + NY · online 2026", color: T_.red },
                  { name: "TeraWulf", sub: "168 MW (TX) + 360 MW (NY)", color: T_.green, link: "WULF" },
                  { name: "Cipher Mining", sub: "244 MW (TX) via Fluidstack", color: "#A855F7", link: "CIFR" },
                ]},
                { label: "Ecosystem / Investors", items: [
                  { name: "Amazon", sub: "$8B invested · primary partner", color: T_.amber, link: "AMZN" },
                  { name: "Google", sub: "$3B+ invested · 14% equity (capped 15%)", color: T_.blue, link: "GOOGL" },
                  { name: "Microsoft", sub: "$5B invested", color: T_.purple, link: "MSFT" },
                  { name: "NVIDIA", sub: "$10B invested", color: T_.green, link: "NVDA" },
                ]},
                { label: "Distribution / Defense", items: [
                  { name: "Claude.ai + Code", sub: "$2.5B ARR (Code: $500M in 8 wk)", color: T_.green },
                  { name: "Palantir + AWS", sub: "IL6 classified · defense AI", color: T_.red, link: "PLTR" },
                  { name: "Bedrock / Vertex / Foundry", sub: "All 3 hyperscaler platforms", color: T_.blue },
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
                { label: "AI Lab", items: [{ name: "Google DeepMind", sub: "Gemini · $71B Cloud ARR", color: T_.blue }] },
                { label: "Cloud Platform", items: [
                  { name: "Google Cloud (GCP)", sub: "$175-185B capex 2026 · 7.5+ GW fleet", color: T_.blue, link: "GOOGL" },
                ]},
                { label: "Custom Silicon", items: [
                  { name: "TPU v7 Ironwood", sub: "192 GB HBM3e · 44% lower TCO", color: T_.blue, link: "GOOGL" },
                  { name: "Axion (Arm CPU)", sub: "Custom Arm-based server CPU", color: T_.green, link: "GOOGL" },
                  { name: "NVIDIA GPUs", sub: "Blackwell + Vera Rubin (also buys)", color: T_.green, link: "NVDA" },
                ]},
                { label: "Fabrication", items: [
                  { name: "Broadcom", sub: "TPU ASIC design partner", color: T_.red, link: "AVGO" },
                  { name: "TSMC", sub: "All TPU + Axion fab", color: T_.purple, link: "TSM" },
                ]},
                { label: "External TPU Customers", items: [
                  { name: "Anthropic", sub: "1M TPUs · tens of $B", color: T_.amber },
                  { name: "Meta (in talks)", sub: "Cloud 2026 → on-prem 2027", color: "#A855F7", link: "META" },
                  { name: "Midjourney / Cohere", sub: "Inference migration", color: T_.textGhost },
                ]},
                { label: "Equity / Investments", items: [
                  { name: "Anthropic", sub: "$3B+ invested · 14% equity", color: T_.amber },
                  { name: "TeraWulf", sub: "14% equity + backstop", color: T_.green, link: "WULF" },
                  { name: "Cipher Mining", sub: "5.4% equity", color: "#A855F7", link: "CIFR" },
                ]},
                { label: "Distribution", items: [
                  { name: "Gemini App", sub: "750M+ MAU · Android default", color: T_.blue },
                  { name: "Vertex AI", sub: "15M+ biz, 120K+ enterprise", color: T_.green },
                  { name: "Workspace / Search", sub: "2B+ users · AI Overviews", color: T_.amber },
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
                  { name: "Oracle Cloud", sub: "Primary cloud partner", color: T_.red, link: "ORCL" },
                  { name: "AWS", sub: "Secondary cloud", color: T_.amber, link: "AMZN" },
                ]},
                { label: "Silicon", items: [
                  { name: "NVIDIA", sub: "500K+ GPUs · Blackwell · Vera Rubin", color: T_.green, link: "NVDA" },
                  { name: "AMD", sub: "Instinct GPUs (secondary)", color: T_.red, link: "AMD" },
                ]},
                { label: "Fabrication", items: [
                  { name: "TSMC", sub: "All GPU fab", color: T_.purple, link: "TSM" },
                ]},
                { label: "Own Infrastructure", items: [
                  { name: "Colossus 1", sub: "Memphis, TN · 100K H100s · operational", color: "#A855F7" },
                  { name: "Colossus 2", sub: "Memphis, TN · 500K+ GPUs · expanding", color: T_.red },
                  { name: "Solaris Energy", sub: "Behind-meter gas turbines · 67% of orders", color: T_.amber },
                ]},
                { label: "Ecosystem / Investors", items: [
                  { name: "NVIDIA", sub: "GPU-for-equity deal (like OpenAI)", color: T_.green, link: "NVDA" },
                  { name: "Tesla", sub: "Megapack co-deployment · Musk synergy", color: T_.amber, link: "TSLA" },
                  { name: "SoftBank / Qatar", sub: "Major investors", color: "#A855F7" },
                ]},
                { label: "Distribution", items: [
                  { name: "X (Twitter)", sub: "Grok integrated · 600M+ MAU", color: T_.textGhost },
                  { name: "Grok App", sub: "Standalone (iOS/Android)", color: "#A855F7" },
                  { name: "API", sub: "Enterprise + developer access", color: T_.blue },
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
                { label: "AI Lab", items: [{ name: "Meta AI", sub: "Llama · $190B Rev · 1.4B AI MAU", color: T_.blue }] },
                { label: "Cloud / Compute", items: [
                  { name: "On-Prem DCs (Primary)", sub: "30 DCs · 26 in US · $600B by 2028", color: T_.blue, link: "META" },
                  { name: "Nebius", sub: "$27B 5-yr · Vera Rubin · from 2027", color: "#06B6D4", link: "NBIS" },
                  { name: "Google Cloud", sub: "$10B+ 6-yr deal", color: T_.green, link: "GOOGL" },
                  { name: "CoreWeave", sub: "$35.2B total (expanded $21B Apr 2026)", color: T_.purple, link: "CRWV" },
                ]},
                { label: "Silicon", items: [
                  { name: "NVIDIA", sub: "Millions of GPUs · Blackwell + Rubin", color: T_.green, link: "NVDA" },
                  { name: "AMD", sub: "6 GW Instinct · $60-100B · 10% equity", color: T_.red, link: "AMD" },
                  { name: "Google TPU", sub: "In talks · cloud 2026, on-prem 2027", color: T_.blue, link: "GOOGL" },
                  { name: "MTIA (Custom)", sub: "In-house inference chip", color: T_.textGhost, link: "META" },
                ]},
                { label: "Fabrication", items: [
                  { name: "TSMC", sub: "All GPU + MTIA fab", color: T_.purple, link: "TSM" },
                  { name: "Broadcom", sub: "Custom networking / NIC", color: T_.amber, link: "AVGO" },
                  { name: "Corning", sub: "$6B optical fiber deal", color: T_.textGhost, link: "GLW" },
                ]},
                { label: "Own Infrastructure", items: [
                  { name: "Hyperion (Louisiana)", sub: "5 GW · 1.3M GPUs · done 2030", color: T_.red },
                  { name: "Prometheus (Ohio)", sub: "Online 2026 · natural gas", color: T_.amber },
                  { name: "Blue Owl JV", sub: "Hyperion financing · 16-yr lease", color: "#A855F7" },
                ]},
                { label: "Distribution", items: [
                  { name: "Facebook + Instagram", sub: "3B+ and 2B+ users", color: T_.blue, link: "META" },
                  { name: "WhatsApp", sub: "2.5B+ users · AI integrated", color: T_.green, link: "META" },
                  { name: "Meta AI", sub: "1.4B MAU · fastest AI growth ever", color: T_.amber, link: "META" },
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
                { date: "Apr 2026", partner: "CoreWeave (expansion)", type: "Cloud Compute", amount: "$21B additional ($35.2B total)", duration: "Thru 2032", deploy: "Expanded AI cloud capacity", status: "Active" },
                { date: "Q3 2025", partner: "CoreWeave (original)", type: "Cloud Compute", amount: "$14.2B", duration: "Multi-year", deploy: "GPU clusters for Llama training", status: "Active — expanded Apr 2026" },
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
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>{lab.name} Supply Chain &amp; Ecosystem Map</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {sc.layers.map((layer, li) => (
                <div key={li}>
                  {li > 0 && (
                    <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                      <svg width="24" height="18" viewBox="0 0 24 18"><path d="M12 0 L12 12 M6 8 L12 14 L18 8" stroke={T_.borderStrong} strokeWidth="2" fill="none"/></svg>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 120, flexShrink: 0, fontSize: 10, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.8px", textAlign: "right" }}>{layer.label}</div>
                    <div style={{ flex: 1, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {layer.items.map((item, ii) => {
                        const DIRECT_POSITIONS = ["GOOGL","MSFT","NVDA","AMZN","BABA","TSLA","MU"];
                        const inPort = item.link && DIRECT_POSITIONS.includes(item.link);
                        return (
                        <div key={ii} style={{
                          background: inPort ? "rgba(16,185,129,0.08)" : "#0B0F19",
                          border: `1px solid ${inPort ? T_.green : T_.border}`,
                          borderRadius: 8, padding: "10px 14px", minWidth: 160, flex: "1 1 160px", maxWidth: 260,
                          borderLeft: `3px solid ${item.color}`,
                          position: "relative",
                        }}>
                          {inPort && <div style={{ position: "absolute", top: 4, right: 6, fontSize: 8, color: T_.green, fontWeight: 700, letterSpacing: "0.5px" }}>DIRECT POSITION</div>}
                          <div style={{ fontSize: 13, fontWeight: 700, color: T_.textMid }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: T_.textDim, marginTop: 3, lineHeight: 1.4 }}>{item.sub}</div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 10, color: T_.textGhost, alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, border: `1px solid ${T_.green}`, background: "rgba(16,185,129,0.08)" }} />
                In your portfolio (&gt;1% weight)
              </span>
              <span>Arrows indicate primary value/compute flow direction</span>
            </div>
          </div>

          {/* Contracts Table */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px" }}>{lab.name} Major Contracts &amp; Commitments</div>
              <div style={{ fontSize: 11, color: T_.textGhost }}>{sc.contracts.length} deals tracked</div>
            </div>
            <div style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T_.border}` }}>
                    {["Date","Partner","Type","Amount","Duration","Deployment / Notes","Status"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedContracts.map((c, ci) => (
                    <tr key={ci} style={{ borderBottom: "1px solid #0B0F19" }}>
                      <td style={{ padding: "8px 10px", color: T_.textDim, whiteSpace: "nowrap", fontSize: 11 }}>{c.date}</td>
                      <td style={{ padding: "8px 10px", color: T_.textMid, fontWeight: 600, whiteSpace: "nowrap" }}>{c.partner}</td>
                      <td style={{ padding: "8px 10px", color: T_.textDim }}>{c.type}</td>
                      <td style={{ padding: "8px 10px", color: T_.amber, fontWeight: 700, whiteSpace: "nowrap" }}>{c.amount}</td>
                      <td style={{ padding: "8px 10px", color: T_.textDim, whiteSpace: "nowrap" }}>{c.duration}</td>
                      <td style={{ padding: "8px 10px", color: T_.textDim, fontSize: 11, maxWidth: 220 }}>{c.deploy}</td>
                      <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                          background: c.status.includes("Active") || c.status.includes("Operational") || c.status.includes("Closed") ? "rgba(16,185,129,0.12)" : c.status.includes("construction") || c.status.includes("development") ? "rgba(245,158,11,0.12)" : "rgba(59,130,246,0.12)",
                          color: c.status.includes("Active") || c.status.includes("Operational") || c.status.includes("Closed") ? T_.green : c.status.includes("construction") || c.status.includes("development") ? T_.amber : T_.blue,
                        }}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 10, fontStyle: "italic" }}>
              Sources: Company announcements, SEC filings, CNBC, Bloomberg, The Information, TechCrunch. Amounts are reported commitments and may include multi-year estimates.
            </div>
          </div>
          </>
          );
        })()}

        {/* Public Equity Exposure */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Public Equity Exposure</div>
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
                <div style={{ fontSize: 16, fontWeight: 600, color: T_.textMid, minWidth: 100 }}>{e.name}</div>
                <div style={{ fontSize: 14, color: T_.textDim, flex: 1 }}>{e.exposure}</div>
              </div>
            ))}
          </div>
        </div>



        </>)}

        </>);
      })()}

      {/* ===== AI-NATIVE TAB ===== */}
      {mainTab === "ainative" && (<>
        <div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px", marginBottom: 4 }}>AI-Native Platforms</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>AI-native companies with $100M+ ARR. These platforms represent the demand side of the GPU compute stack — every dollar of AI-native revenue ultimately requires GPU infrastructure from hyperscalers and neoclouds like CoreWeave.</div>

        {/* Growth Trend Cards */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "AI-Native $50M+ ARR Companies", value: "30-50", sub: "Up from ~3 in 2023", color: T_.green },
            { label: "Fastest 0→$1B ARR", value: "Cursor", sub: "24 months (Nov 2025). Previous record: ChatGPT ~18 months.", color: T_.blue },
            { label: "AI-Native vs SaaS Speed", value: "2x faster", sub: "AI-native cos reach $1M ARR in half the time of B2B SaaS", color: T_.amber },
            { label: "2026 AI Startup Funding", value: "$15B+ in 49 days", sub: "17 US AI cos raised $100M+ in first 49 days of 2026", color: T_.purple },
          ].map((m, i) => (
            <div key={i} style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "14px 18px", flex: "1 1 180px", minWidth: 180 }}>
              <div style={{ fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 4 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* AI Startup Formation Trend */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T_.text, marginBottom: 4 }}>AI Startup Formation Trend</div>
          <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 16 }}>AI startup formation has exploded since ChatGPT's launch (Nov 2022). Nearly 1 in 4 new startups is now an AI company (PitchBook). AI captured ~50% of all global VC funding in 2025.</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
              <thead>
                <tr>
                  {["Year", "New AI Startups (US)", "GenAI VC Funding", "AI % of All VC", "Companies at $50M+ ARR", "Key Catalyst"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}` }}>{h}</th>
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
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, fontWeight: 700, color: T_.blue }}>{row.year}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.text, fontWeight: 600 }}>{row.startups}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.green, fontWeight: 600 }}>{row.funding}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.textMid }}>{row.pct}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.text, fontWeight: 700, fontSize: 14 }}>{row.arr50}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, color: "#CBD5E1", fontSize: 11 }}>{row.catalyst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Company Table */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T_.text, marginBottom: 16 }}>AI-Native Companies ($50M+ ARR)</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 900 }}>
              <thead>
                <tr>
                  {["Company", "Sector", "Valuation", "ARR", "ARR Date", "Founded", "Funding", "Disrupts"].map(h => (
                    <th key={h} style={{ textAlign: h === "Company" || h === "Sector" || h === "Disrupts" ? "left" : "right", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Cursor (Anysphere)", sector: "AI Coding", val: "$29.3B → $50B", arr: "$2.0B+", arrDate: "Feb 2026", founded: "2022", funding: "$3.3B", disrupts: "GitHub Copilot, VS Code, JetBrains", color: T_.blue },
                  { name: "Poolside", sector: "AI Coding / Agents", val: "$12B", arr: "~$50M", arrDate: "Mar 2025", founded: "2023", funding: "~$2B+ (Series C)", disrupts: "Enterprise SWE, coding agents. CoreWeave anchor tenant — 40K+ GB300 GPUs, 2GW Project Horizon campus (TX)", color: "#06B6D4" },
                  { name: "Perplexity", sector: "AI Search", val: "$20B", arr: "$100M+", arrDate: "2025E", founded: "2022", funding: "$1.5B+", disrupts: "Google Search, Wikipedia", color: "#6366F1" },
                  { name: "Scale AI", sector: "Data/Labeling", val: "$14B", arr: "Est. $500M+", arrDate: "2025E", founded: "2016", funding: "$1.6B+", disrupts: "Data labeling, AI training data", color: T_.blue },
                  { name: "OpenEvidence", sector: "Healthcare AI", val: "$12B", arr: "$100M", arrDate: "Jan 2026", founded: "2022", funding: "$700M", disrupts: "UpToDate, Epocrates, clinical tools", color: T_.red },
                  { name: "ElevenLabs", sector: "AI Voice/Audio", val: "$11B", arr: "$330M+", arrDate: "YE 2025", founded: "2022", funding: "$500M+", disrupts: "Voice actors, audio production, dubbing", color: "#F97316" },
                  { name: "Cognition (Devin)", sector: "AI SWE Agent", val: "$10.2B", arr: "~$100M", arrDate: "Mid 2025E", founded: "2021", funding: "$600M+", disrupts: "Offshore dev, traditional SWE", color: T_.purple },
                  { name: "Sierra", sector: "Enterprise AI Agents", val: "$10B", arr: "$150M", arrDate: "Jan 2026", founded: "2023", funding: "$585M", disrupts: "Zendesk, Salesforce Service Cloud", color: T_.green },
                  { name: "Mistral AI", sector: "Open-Source LLM", val: "$8-10B", arr: "~$600M", arrDate: "2025E", founded: "2023", funding: "$1.1B+", disrupts: "OpenAI, enterprise LLM deployments", color: T_.red },
                  { name: "Harvey", sector: "Legal AI", val: "$8B → $11B", arr: "$190M", arrDate: "Dec 2025", founded: "2022", funding: "$960M+", disrupts: "Westlaw, LexisNexis, Casetext", color: T_.amber },
                  { name: "Glean", sector: "Enterprise AI Search", val: "$7.2B", arr: "$200M", arrDate: "Dec 2025", founded: "2019", funding: "$410M", disrupts: "Microsoft Copilot, Coveo, Elastic", color: "#0EA5E9" },
                  { name: "Cohere", sector: "Enterprise LLM", val: "$5.5B", arr: "~$60M", arrDate: "2025E", founded: "2019", funding: "$1B+", disrupts: "OpenAI Enterprise, on-prem LLM", color: T_.green },
                  { name: "Lovable", sector: "Vibe Coding", val: "$5B", arr: "$400M", arrDate: "Mar 2026", founded: "2024", funding: "$545M", disrupts: "Wix, Squarespace, Webflow", color: "#EC4899" },
                  { name: "Runway", sector: "AI Video / World Models", val: "$5.3B", arr: "~$265M (2026E)", arrDate: "2026E", founded: "2018", funding: "$860M", disrupts: "Video production, VFX, world simulation. CoreWeave powers training on GB300 NVL72 (Dec 2025 deal)", color: "#A855F7" },
                  { name: "Synthesia", sector: "AI Video Avatars", val: "$2.1B", arr: "$100M+", arrDate: "Apr 2025", founded: "2017", funding: "$330M+", disrupts: "Corporate training video, production studios", color: T_.purple },
                  { name: "Pika", sector: "AI Video Gen", val: "$2B", arr: "~$50M", arrDate: "2025E", founded: "2023", funding: "$235M", disrupts: "Video editing, motion graphics", color: "#EC4899" },
                  { name: "Midjourney", sector: "AI Image Gen", val: "Bootstrapped", arr: "$500M", arrDate: "2025", founded: "2022", funding: "$0 (self-funded)", disrupts: "Adobe, stock photography, designers", color: "#F97316" },
                  { name: "Jasper", sector: "AI Content", val: "$1.5B", arr: "~$180M", arrDate: "2025E", founded: "2021", funding: "$300M+", disrupts: "Copywriters, content marketing tools", color: T_.textDim },
                  { name: "HeyGen", sector: "AI Video", val: "$1.3B", arr: "~$95M", arrDate: "Sep 2025", founded: "2020", funding: "$240M+", disrupts: "Video production, localization", color: T_.amber },
                  { name: "Replit", sector: "AI Coding/IDE", val: "$1.2B", arr: "~$50M", arrDate: "2025E", founded: "2016", funding: "$300M+", disrupts: "Development environments, cloud IDEs", color: "#F97316" },
                  { name: "EliseAI", sector: "Real Estate AI", val: "TBD", arr: "$100M+", arrDate: "2025", founded: "2017", funding: "$200M+", disrupts: "Property management, leasing tools", color: T_.blue },
                  { name: "Emergent", sector: "Vibe Coding", val: "TBD", arr: "$100M", arrDate: "Feb 2026", founded: "2025", funding: "TBD", disrupts: "Mobile dev tools, low-code", color: "#A855F7" },
                ].map((co, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, fontWeight: 700, color: co.color }}>{co.name}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.textMid, fontSize: 11 }}>{co.sector}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.text, fontWeight: 600 }}>{co.val}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.green, fontWeight: 700 }}>{co.arr}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textDim, fontSize: 11 }}>{co.arrDate}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textDim }}>{co.founded}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontSize: 11 }}>{co.funding}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.amber, fontSize: 11 }}>{co.disrupts}</td>
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
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "16px 20px", flex: "1 1 0" }}>
            <div style={{ fontSize: 12, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: color || T_.text, letterSpacing: "-0.5px" }}>{value}</div>
            {sub && <div style={{ fontSize: 11, color: T_.textDim, marginTop: 3 }}>{sub}</div>}
          </div>
        );
        return (<>
        {/* Header */}
        <div style={{ marginBottom: 28, borderBottom: `1px solid ${T_.border}`, paddingBottom: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>AI Capex Tracker</div>
          <div style={{ fontSize: 14, color: T_.textDim, marginTop: 5 }}>Hyperscaler &amp; neocloud infrastructure spending · 2022–2030</div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
          {mc("2024 Actual (Top 5)", `$${top5Total2024}B`, "Amazon $83B · Alphabet $53B · MSFT $44B · Meta $39B · Oracle $12B")}
          {mc("2025 Estimate (Top 5)", `$${top5Total2025}B`, `+${((top5Total2025 / top5Total2024 - 1) * 100).toFixed(0)}% y/y`, T_.amber)}
          {mc("2026 Estimate (Top 5)", `$${top5Total2026}B`, `+${yoyGrowth.toFixed(0)}% y/y · ~75% for AI infra`, T_.blue)}
          {mc("2026E All Players", `$${AI_CAPEX_DATA.aggregate.find(a => a.year === 2026)?.value || 0}B`, "Top 5 + neoclouds + others", T_.green)}
        </div>

        {/* Top 5 Trajectory + Aggregate Bar — side by side */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 0", minWidth: 360, background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px" }}>Top 5 Capex Trajectory ($B)</div>
              <div style={{ fontSize: 12, color: T_.textDim, marginTop: 3 }}>Dashed lines = estimates · Solid = reported actuals</div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {AI_CAPEX_DATA.top5.map(co => (
                <div key={co.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                  <div style={{ width: 12, height: 3, borderRadius: 1, background: co.color }} />
                  <span style={{ color: T_.textDim }}>{co.name.split(" (")[0]}</span>
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
              <XAxis dataKey="year" tick={{ fill: T_.textDim, fontSize: 12 }} axisLine={{ stroke: T_.border }} tickLine={false} />
              <YAxis tick={{ fill: T_.textDim, fontSize: 11 }} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => `$${v}B`} />
              <Tooltip
                contentStyle={tooltipStyle}
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
        <div style={{ flex: "1 1 0", minWidth: 360, background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Aggregate AI Infrastructure Capex ($B) — All Players</div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 6, minHeight: 340, padding: "0 8px" }}>
            {aggChartData.map((d) => {
              const maxVal = Math.max(...aggChartData.map(a => a.total));
              const h = (d.total / maxVal) * 280;
              return (
                <div key={d.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: d.est ? T_.textDim : T_.text }}>${d.total}B</div>
                  <div style={{
                    width: "100%", maxWidth: 64, height: h, borderRadius: "6px 6px 2px 2px",
                    background: d.est ? `linear-gradient(180deg, #1E40AF 0%, ${T_.border} 100%)` : `linear-gradient(180deg, ${T_.blue} 0%, #1E40AF 100%)`,
                    border: d.est ? `1px dashed ${T_.blue}` : "none",
                    transition: "height 0.3s",
                  }} />
                  <div style={{ fontSize: 11, color: T_.textDim, marginTop: 2, whiteSpace: "nowrap" }}>{d.year}{d.est ? " (est.)" : ""}</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: T_.textDim, marginTop: 12, fontStyle: "italic" }}>Sources: CreditSights, Goldman Sachs, BofA, company earnings guidance. Includes top 5 hyperscalers + neoclouds + other AI infra spenders.</div>
        </div>
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
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}` }}>Cloud Revenue, Margin &amp; Capex ($B / %)</div>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", borderBottom: `1px solid ${T_.border}`, whiteSpace: "nowrap" }}>Company</th>
                <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", borderBottom: `1px solid ${T_.border}` }}>Metric</th>
                {yrRange.map(yr => (
                  <th key={yr} style={{ textAlign: "right", padding: "8px 6px", fontSize: 10, fontWeight: 600, color: yr >= 2026 ? T_.textDim : T_.textMid, textTransform: "uppercase", borderBottom: `1px solid ${T_.border}`, whiteSpace: "nowrap" }}>
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
                    onMouseEnter={e => e.currentTarget.style.background = `${T_.border}20`}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {ri === 0 ? (
                      <td rowSpan={5} style={{ padding: "8px 10px", borderBottom: `2px solid ${T_.border}`, fontWeight: 700, color: co.color, fontSize: 13, verticalAlign: "top" }}>
                        {co.name}
                      </td>
                    ) : null}
                    <td style={{ padding: "5px 10px", borderBottom: ri === 4 ? `2px solid ${T_.border}` : `1px solid ${T_.border}08`, color: row.isYoY ? T_.textDim : T_.textDim, fontSize: row.isYoY ? 10 : 11, fontWeight: 600, fontStyle: row.isYoY ? "italic" : "normal" }}>{row.metric}</td>
                    {yrRange.map(yr => {
                      if (row.isYoY) {
                        const yoy = getYoY(row.srcData, yr);
                        return (
                          <td key={yr} style={{ padding: "4px 6px", borderBottom: ri === 4 ? `2px solid ${T_.border}` : `1px solid ${T_.border}08`, textAlign: "right", fontSize: 10, fontVariantNumeric: "tabular-nums", color: yoy == null ? T_.textDim : yoy >= 0 ? T_.green : T_.red }}>
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
                          padding: "5px 6px", borderBottom: ri === 4 ? `2px solid ${T_.border}` : `1px solid ${T_.border}08`,
                          textAlign: "right", fontVariantNumeric: "tabular-nums",
                          color: row.metric === "Op. Margin" ? (isNeg ? T_.red : val >= 40 ? T_.green : T_.textMid) : (isEst ? T_.textDim : T_.textMid),
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
        <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Top 5 Hyperscalers — Detail</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {AI_CAPEX_DATA.top5.map((co, idx) => {
            const cap2026 = co.capex.find(c => c.year === 2026)?.value || 0;
            const cap2025 = co.capex.find(c => c.year === 2025)?.value || 0;
            const cap2024 = co.capex.find(c => c.year === 2024)?.value || 0;
            const yoy = cap2025 > 0 ? ((cap2026 / cap2025 - 1) * 100) : 0;
            return (
              <div key={co.name} style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, borderLeft: `3px solid ${co.color}` }}>
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: co.color, background: `${co.color}18`, padding: "3px 8px", borderRadius: 4 }}>#{idx + 1}</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: T_.text }}>{co.name}</span>
                    <span style={{ fontSize: 13, color: T_.textDim }}>{co.ticker}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, textAlign: "right" }}>
                    <div>
                      <div style={{ fontSize: 10, color: T_.textDim, textTransform: "uppercase" }}>2024A</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: T_.textDim }}>${cap2024}B</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: T_.textDim, textTransform: "uppercase" }}>2025E</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: T_.textMid }}>${cap2025}B</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: T_.textDim, textTransform: "uppercase" }}>2026E</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: co.color }}>${cap2026}B</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: T_.textDim, textTransform: "uppercase" }}>y/y</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: yoy >= 0 ? T_.green : T_.red }}>+{yoy.toFixed(0)}%</div>
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
                          <div style={{ fontSize: 9, color: pt.est ? T_.textDim : "#CBD5E1", fontWeight: 600 }}>{pt.value}</div>
                          <div style={{
                            width: "100%", maxWidth: 40, height: Math.max(h, 3), borderRadius: "3px 3px 1px 1px",
                            background: pt.est ? `${co.color}50` : co.color,
                            border: pt.est ? `1px dashed ${co.color}` : "none",
                          }} />
                          <div style={{ fontSize: 8, color: T_.textDim }}>{pt.year.toString().slice(-2)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3-column info grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Spending On</div>
                    <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.spendingOn}</div>
                  </div>
                  <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Major News &amp; Contracts</div>
                    <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.news}</div>
                  </div>
                  <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Key Partners</div>
                    <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.partners}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ranks 6–20 Table */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T_.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px" }}>Neoclouds, Big Tech &amp; Other Major Spenders (Ranks 6–20)</div>
            <div style={{ fontSize: 11, color: T_.textDim }}>Total 6-20: ${AI_CAPEX_DATA.others.reduce((s, c) => s + c.capex2026, 0)}B (2026E)</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr>
                {["#", "Company", "Ticker", "2025E", "2026E", "2027E", "y/y", "2026E Scale", "Status & Notes"].map((h, i) => (
                  <th key={i} style={{
                    textAlign: i >= 3 && i <= 7 ? "right" : "left",
                    padding: "10px 12px", fontSize: 10, fontWeight: 600, color: T_.textDim,
                    textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}`,
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
                    style={{ background: isTop10 ? T_.bgPanel : "transparent", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = `${T_.border}40`}
                    onMouseLeave={e => e.currentTarget.style.background = isTop10 ? T_.bgPanel : "transparent"}
                  >
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, fontWeight: 700, color: co.color, fontSize: 13 }}>#{co.rank}</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10` }}>
                      <div style={{ fontWeight: 700, color: T_.text, fontSize: 14 }}>{co.name}</div>
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, color: T_.textDim, fontSize: 11 }}>{co.ticker}</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", fontWeight: 600, color: T_.textDim, fontVariantNumeric: "tabular-nums", fontSize: 14 }}>${co.capex2025}B</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", fontWeight: 700, color: co.color, fontVariantNumeric: "tabular-nums", fontSize: 14 }}>${co.capex2026}B</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", fontWeight: 600, color: T_.textMid, fontVariantNumeric: "tabular-nums", fontSize: 14 }}>${co.capex2027}B</td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", fontWeight: 600, color: yoy >= 50 ? T_.amber : T_.green, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
                      {co.capex2025 > 0 ? `+${yoy.toFixed(0)}%` : "—"}
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                        <div style={{ width: 80, height: 8, background: T_.border, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: `${barPct}%`, height: "100%", background: co.color, borderRadius: 4, transition: "width 0.3s" }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T_.border}10`, color: T_.textDim, fontSize: 11, maxWidth: 380, lineHeight: 1.5 }}>{co.status}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: `${T_.border}40` }}>
                <td colSpan={3} style={{ padding: "10px 12px", fontWeight: 700, color: T_.text, fontSize: 13 }}>Total (Ranks 6–20)</td>
                <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: T_.textDim, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>${AI_CAPEX_DATA.others.reduce((s, c) => s + c.capex2025, 0)}B</td>
                <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: T_.blue, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>${AI_CAPEX_DATA.others.reduce((s, c) => s + c.capex2026, 0)}B</td>
                <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: T_.textMid, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>${AI_CAPEX_DATA.others.reduce((s, c) => s + c.capex2027, 0)}B</td>
                <td style={{ padding: "10px 12px" }}></td>
                <td style={{ padding: "10px 12px" }}></td>
                <td style={{ padding: "10px 12px" }}></td>
              </tr>
            </tfoot>
          </table>
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
        <div style={{ marginBottom: 28, borderBottom: `1px solid ${T_.border}`, paddingBottom: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>Semi Capex</div>
          <div style={{ fontSize: 14, color: T_.textDim, marginTop: 5 }}>Semiconductor supply chain capex · Foundry, Memory/HBM, ASIC · 2020–2030</div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
          {[
            { label: "TSMC 2026E", value: "$54B", sub: "+33% y/y · 70-80% advanced nodes (2/3nm)", color: T_.green },
            { label: "DRAM Industry 2026E", value: "$69.5B", sub: "SK Hynix $26B + Samsung $30B + Micron $13.5B", color: T_.amber },
            { label: "Capex → Supply Lag", value: "18-24 mo", sub: "Capex today → volume production 1.5-2 yrs later", color: T_.blue },
          ].map((c, i) => (
            <div key={i} style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "16px 20px", flex: "1 1 0" }}>
              <div style={{ fontSize: 12, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: c.color, letterSpacing: "-0.5px" }}>{c.value}</div>
              <div style={{ fontSize: 11, color: T_.textDim, marginTop: 3 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Trajectory Chart */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px" }}>Capex Trajectory by Company ($B)</div>
              <div style={{ fontSize: 12, color: T_.textDim, marginTop: 3 }}>Dashed = estimates · Solid = reported</div>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {companies.map(co => (
                <div key={co.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                  <div style={{ width: 12, height: 3, borderRadius: 1, background: co.color }} />
                  <span style={{ color: T_.textDim }}>{co.name}</span>
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
              <XAxis dataKey="year" tick={{ fill: T_.textDim, fontSize: 12 }} axisLine={{ stroke: T_.border }} tickLine={false} />
              <YAxis tick={{ fill: T_.textDim, fontSize: 11 }} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => `$${v}B`} />
              <Tooltip contentStyle={tooltipStyle}
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
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}` }}>Revenue, Gross Margin &amp; Capex ($B / %)</div>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", borderBottom: `1px solid ${T_.border}`, whiteSpace: "nowrap" }}>Company</th>
                <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", borderBottom: `1px solid ${T_.border}` }}>Metric</th>
                {years.map(yr => (
                  <th key={yr} style={{ textAlign: "right", padding: "8px 6px", fontSize: 10, fontWeight: 600, color: yr >= 2026 ? T_.textDim : T_.textMid, textTransform: "uppercase", borderBottom: `1px solid ${T_.border}`, whiteSpace: "nowrap" }}>
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
                    onMouseEnter={e => e.currentTarget.style.background = `${T_.border}20`}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {ri === 0 ? (
                      <td rowSpan={5} style={{ padding: "8px 10px", borderBottom: `2px solid ${T_.border}`, fontWeight: 700, color: co.color, fontSize: 13, verticalAlign: "top" }}>
                        {co.name}<br/><span style={{ fontSize: 10, fontWeight: 400, color: T_.textDim }}>{co.segment}</span>
                      </td>
                    ) : null}
                    <td style={{ padding: "5px 10px", borderBottom: ri === 4 ? `2px solid ${T_.border}` : `1px solid ${T_.border}08`, color: T_.textDim, fontSize: row.isYoY ? 10 : 11, fontWeight: 600, fontStyle: row.isYoY ? "italic" : "normal" }}>{row.metric}</td>
                    {years.map(yr => {
                      if (row.isYoY) {
                        const yoy = getYoY(row.srcData, yr);
                        return (
                          <td key={yr} style={{ padding: "4px 6px", borderBottom: ri === 4 ? `2px solid ${T_.border}` : `1px solid ${T_.border}08`, textAlign: "right", fontSize: 10, fontVariantNumeric: "tabular-nums", color: yoy == null ? T_.textDim : yoy >= 0 ? T_.green : T_.red }}>
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
                          padding: "5px 6px", borderBottom: ri === 4 ? `2px solid ${T_.border}` : `1px solid ${T_.border}08`,
                          textAlign: "right", fontVariantNumeric: "tabular-nums",
                          color: row.metric === "Gross Margin" ? (isNeg ? T_.red : val >= 50 ? T_.green : T_.textMid) : (isEst ? T_.textDim : T_.textMid),
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
        <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Company Detail</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {companies.map((co) => {
            const cap26 = co.capex.find(c => c.year === 2026)?.value || 0;
            const cap25 = co.capex.find(c => c.year === 2025)?.value || 0;
            const cap24 = co.capex.find(c => c.year === 2024)?.value || 0;
            const yoy = cap25 > 0 ? ((cap26 / cap25 - 1) * 100) : 0;
            return (
              <div key={co.name} style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, borderLeft: `3px solid ${co.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: T_.text }}>{co.name}</span>
                    <span style={{ fontSize: 13, color: T_.textDim }}>{co.ticker} · {co.segment}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, textAlign: "right" }}>
                    <div><div style={{ fontSize: 10, color: T_.textDim, textTransform: "uppercase" }}>2024A</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.textDim }}>${cap24}B</div></div>
                    <div><div style={{ fontSize: 10, color: T_.textDim, textTransform: "uppercase" }}>2025</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.textMid }}>${cap25}B</div></div>
                    <div><div style={{ fontSize: 10, color: T_.textDim, textTransform: "uppercase" }}>2026E</div><div style={{ fontSize: 20, fontWeight: 700, color: co.color }}>${cap26}B</div></div>
                    <div><div style={{ fontSize: 10, color: T_.textDim, textTransform: "uppercase" }}>y/y</div><div style={{ fontSize: 16, fontWeight: 700, color: yoy >= 0 ? T_.green : T_.red }}>{yoy >= 0 ? "+" : ""}{yoy.toFixed(0)}%</div></div>
                  </div>
                </div>
                {/* 3-column info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Capex Breakdown</div>
                    <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.breakdown}</div>
                  </div>
                  <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Capex → Supply Timeline</div>
                    <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.supplyTimeline}</div>
                  </div>
                  <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Key Notes</div>
                    <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.notes}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Themes */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Key Themes</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "⏱️", title: "18-24 Month Capex-to-Supply Lag", text: "TSMC N2 capex in 2025 → volume production H1 2026. SK Hynix HBM4 equipment prep Q1 2026 → Union Fab production Q1 2027. Micron ID1 fab capex 2024-2026 → operational 2027+. This lag means today's capex signals supply availability 2 years out." },
              { icon: "🔧", title: "CoWoS Packaging is the Bottleneck", text: "TSMC allocating 10-20% of capex ($5-10B) to advanced packaging. CoWoS capacity target: 150K wafers/mo by end 2026 (4x late-2024). Nvidia secured ~70% of 2025 CoWoS-L capacity. Packaging, not transistors, is the binding constraint." },
              { icon: "💾", title: "HBM Sold Out Through 2026", text: "All 3 memory vendors (SK Hynix ~55%, Samsung ~22%, Micron ~21% share — Q3 2025; Samsung lost share to Micron over 2025) report HBM sold out for 2026. HBM4 transition from HBM3E adds complexity (Samsung HBM4 mass prod Sep 2025 at Pyeongtaek P3, NVDA-qualified). Wafer consumption ratio: HBM uses 2.5-3x more silicon than conventional DRAM." },
              { icon: "🏭", title: "Capex Shifting from Quantity to Quality", text: "DRAM capex growing only 14% YoY despite massive demand — limited by cleanroom availability. Investment shifting to process upgrades (1-gamma node), higher stacking (12-Hi → 16-Hi), and hybrid bonding rather than raw wafer capacity expansion." },
              { icon: "🌐", title: "Geographic Diversification Drives Cost Up", text: "TSMC Arizona (N3/N2), Samsung Taylor TX, Micron NY/Idaho, Intel Ohio — overseas fabs cost 30-50% more than Asian equivalents. TSMC's $17B Japan Kumamoto upgrade for 3nm. Trade deals and CHIPS Act subsidies offset some premium." },
              { icon: "📈", title: "Semi Capex Lags AI Capex by Design", text: "Hyperscaler AI capex ($780B in 2026) dwarfs semi capex ($145B) because semis are upstream inputs. Each $1 of semi capex enables ~$5 of downstream AI infrastructure spending. Semi companies are disciplined — memory vendors cut capex 30% in 2023 downturn." },
            ].map((item, idx) => (
              <div key={idx} style={{ background: "#0B0F19", borderRadius: 8, border: `1px solid ${T_.border}`, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T_.textMid }}>{item.title}</span>
                </div>
                <div style={{ fontSize: 12, color: T_.textDim, lineHeight: 1.6 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </>);
      })()}

      {/* ===== GPU & ASIC ROADMAP TAB ===== */}

      {mainTab === "chiproadmap" && (() => {
        const vendors = ["NVIDIA", "AMD", "Google", "Amazon", "Microsoft", "Meta", "OpenAI"];
        const vendorColors = { NVIDIA: T_.green, AMD: T_.red, Google: T_.blue, Amazon: T_.amber, Microsoft: T_.purple, Meta: "#EC4899", OpenAI: "#6366F1" };
        const filtered = chipVendorFilter === "All" ? CHIP_ROADMAP : CHIP_ROADMAP.filter(c => c.vendor === chipVendorFilter);
        const sorted = [...filtered].sort((a, b) => b.year - a.year || a.vendor.localeCompare(b.vendor));
        // Timeline data by year
        const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];
        const chipsByYear = {};
        CHIP_ROADMAP.forEach(c => { if (!chipsByYear[c.year]) chipsByYear[c.year] = []; chipsByYear[c.year].push(c); });
        // Status colors
        const statusColor = (s) => s === "EOL" ? T_.textDim : s === "Shipping" ? T_.green : s === "Internal" ? T_.purple : s.includes("202") ? T_.amber : T_.textDim;

        return (<>
        <div style={{ marginBottom: 28, borderBottom: `1px solid ${T_.border}`, paddingBottom: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>GPU/ASIC</div>
          <div style={{ fontSize: 14, color: T_.textDim, marginTop: 5 }}>Tracking AI accelerator generations across NVIDIA, AMD, Google, Amazon, Microsoft, Meta &amp; OpenAI</div>
        </div>

        {/* GPU/ASIC Industry & Market Updates */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: T_.blue }}>●</span> Industry & Market Updates
          </div>
          <div style={{ maxHeight: 280, overflow: "auto", padding: "12px 16px" }}>
            {GPU_ASIC_NEWS.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ fontSize: 11, color: T_.textGhost, minWidth: 50, flexShrink: 0, fontWeight: 600, marginTop: 1 }}>{item.date}</span>
                <span style={{ fontSize: 13, color: "#CBD5E1" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Timeline */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20, overflowX: "auto" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Release Timeline</div>
          {/* Vendor rows */}
          {vendors.filter(v => CHIP_ROADMAP.some(c => c.vendor === v)).map(v => (
            <div key={v} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <div style={{ width: 90, fontSize: 12, fontWeight: 700, color: vendorColors[v], flexShrink: 0 }}>{v}</div>
              <div style={{ display: "flex", flex: 1, gap: 0 }}>
                {years.map(yr => {
                  const chips = CHIP_ROADMAP.filter(c => c.vendor === v && c.year === yr);
                  return (
                    <div key={yr} style={{ flex: 1, minWidth: 0, display: "flex", gap: 3, padding: "2px 4px", borderLeft: `1px solid ${T_.border}` }}>
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
              <div key={yr} style={{ flex: 1, textAlign: "center", fontSize: 11, color: T_.textDim, fontWeight: 600, borderLeft: `1px solid ${T_.border}`, padding: "4px 0" }}>{yr}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 11, color: T_.textDim }}>
            <span>━ Shipping / Deployed</span>
            <span style={{ borderBottom: `1px dashed ${T_.textDim}`, paddingBottom: 1 }}>┅ Planned / Announced</span>
          </div>
        </div>

        {/* Full Specs Table — filterable by vendor */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T_.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px" }}>Accelerator Specs</div>
            <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: `1px solid ${T_.border}` }}>
              {["All", ...vendors].map(v => (
                <button key={v} onClick={() => setChipVendorFilter(v)} style={{
                  padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none",
                  background: chipVendorFilter === v ? (v === "All" ? T_.blue : vendorColors[v] || T_.blue) : T_.bgPanel,
                  color: chipVendorFilter === v ? "#FFF" : T_.textDim, transition: "all 0.15s",
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
                    padding: "8px 10px", fontSize: 10, fontWeight: 600, color: T_.textDim,
                    textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: `1px solid ${T_.border}`, whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => (
                <tr key={i} onMouseEnter={e => e.currentTarget.style.background = `${T_.border}40`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, fontWeight: 700, color: vendorColors[c.vendor], fontSize: 13 }}>{c.vendor}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, fontWeight: 700, color: T_.text, fontSize: 13 }}>{c.chip}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.textDim, fontSize: 11 }}>{c.type}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.textMid, fontSize: 11 }}>{c.arch} · {c.node}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.textMid, fontWeight: 600 }}>{c.year}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10` }}>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: `${statusColor(c.status)}20`, color: statusColor(c.status) }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontVariantNumeric: "tabular-nums" }}>{c.vram > 0 ? `${c.vram.toLocaleString()} GB` : "—"}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textDim, fontSize: 11 }}>{c.hbm}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontVariantNumeric: "tabular-nums" }}>{c.bw > 0 ? `${c.bw.toFixed(1)} TB/s` : "—"}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontVariantNumeric: "tabular-nums" }}>{c.tdp > 0 ? `${c.tdp.toLocaleString()}W` : "—"}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontVariantNumeric: "tabular-nums" }}>{c.fp8 > 0 ? `${c.fp8.toLocaleString()} TFLOPS` : "—"}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontVariantNumeric: "tabular-nums" }}>{c.fp4 > 0 ? (c.fp4 >= 1000 ? `${(c.fp4/1000).toFixed(0)}` : c.fp4.toLocaleString()) : "—"}{c.fp4 > 0 ? (c.fp4 >= 1000 ? " EFLOPS" : " TFLOPS") : ""}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.textDim, fontSize: 11, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.system}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NVIDIA Datacenter GPU — Spec & Pricing Comparison */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}` }}>NVIDIA Datacenter GPU — Spec &amp; Pricing Comparison</div>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
            <thead><tr>
              {["GPU","Gen","Year","VRAM","HBM","BW (TB/s)","TDP (W)","FP16 TFLOPS","FP8 TFLOPS","NVLink (GB/s)","Unit Price","Cloud $/hr"].map((h,i) => (
                <th key={i} style={{ padding: "10px 10px", fontSize: 11, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", borderBottom: `1px solid ${T_.border}`, textAlign: i > 2 ? "right" : "left", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[...GPU_DATA].reverse().map((g, i) => {
                const genColor = g.gen === "Ampere" ? T_.textGhost : g.gen === "Hopper" ? T_.blue : g.gen === "Blackwell" ? T_.green : T_.amber;
                const latestCloud = g.price.cloud.length > 0 ? g.price.cloud[g.price.cloud.length - 1].value : 0;
                return (
                  <tr key={i} onMouseEnter={e => e.currentTarget.style.background = `${T_.border}30`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}08`, fontWeight: 700, color: T_.text, fontSize: 14 }}>{g.gpu}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}08` }}>
                      <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: `${genColor}18`, color: genColor, border: `1px solid ${genColor}40` }}>{g.gen}</span>
                    </td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}08`, color: T_.textDim }}>{g.year}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}08`, textAlign: "right", color: T_.textMid, fontWeight: 600 }}>{g.vram.toLocaleString()} GB</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}08`, textAlign: "right", color: T_.textDim }}>{g.hbmType}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}08`, textAlign: "right", color: T_.textMid }}>{g.bw} TB/s</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}08`, textAlign: "right", color: g.tdp >= 1000 ? T_.red : g.tdp >= 700 ? T_.amber : T_.textDim, fontWeight: 600 }}>{g.tdp.toLocaleString()}W</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}08`, textAlign: "right", color: T_.textMid }}>{g.fp16 ? `${g.fp16.toLocaleString()} TFLOPS` : "TBD"}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}08`, textAlign: "right", color: T_.textMid }}>{g.fp8 ? `${g.fp8.toLocaleString()} TFLOPS` : "TBD"}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}08`, textAlign: "right", color: T_.textDim }}>{g.nvlink.toLocaleString()} GB/s</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}08`, textAlign: "right", color: T_.text, fontWeight: 600 }}>{g.price.unit ? `$${(g.price.unit / 1000).toFixed(0)}K` : "TBD"}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}08`, textAlign: "right", color: T_.green, fontWeight: 700 }}>{latestCloud > 0 ? `$${latestCloud.toFixed(2)}/hr` : "TBD"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: "10px 16px", fontSize: 11, color: T_.textGhost, fontStyle: "italic", borderTop: `1px solid ${T_.border}` }}>NVIDIA datacenter SXM SKUs only. Cloud $/hr = latest avg on-demand from spot indices. For full multi-vendor accelerator coverage see the Accelerator Specs table above.</div>
        </div>

        {/* Delivery & Volume Expectations — Current + Upcoming */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Delivery &amp; Volume Expectations — Current &amp; Upcoming</div>
          {(() => {
            const deliveryData = [
              { vendor: "NVIDIA", chip: "Vera Rubin (VR200)", status: "H2 2026", shipDate: "2026-07", vol2025: "—", vol2026: "5.7M units (JPM)", customers: "OpenAI (1st GW), all hyperscalers", notes: "HBM4 288GB · TSMC 3nm · NVL72. First GW for OpenAI H2 2026.", color: T_.purple, sortOrder: 1 },
              { vendor: "NVIDIA", chip: "Blackwell (B200/GB200)", status: "Shipping", shipDate: "2025-03", vol2025: "5.2M units", vol2026: "1.8M (wind-down)", customers: "MSFT, META, AMZN, GOOGL, ORCL", notes: "Sold out thru mid-2026. 3.6M backlog. 25-35K NVL72 racks in 2025.", color: T_.green, sortOrder: 2 },
              { vendor: "NVIDIA", chip: "Rubin Ultra", status: "H2 2027", shipDate: "2027-07", vol2025: "—", vol2026: "—", customers: "TBD", notes: "Next-gen after Vera Rubin. Annual cadence.", color: T_.textGhost, sortOrder: 0 },
              { vendor: "AMD", chip: "MI455X Helios (flagship)", status: "H2 2026", shipDate: "2026-07", vol2025: "—", vol2026: "Ramp begins", customers: "OpenAI (6 GW), Meta (6 GW)", notes: "HBM4 432GB · Full-rack Helios system. $90B OAI + $60-100B Meta deals. MI450X is the lower-power volume variant; MI440X is enterprise; MI430X is HPC/sovereign.", color: T_.red, sortOrder: 1 },
              { vendor: "AMD", chip: "MI350X (CDNA 4)", status: "Shipping (Q3 2025)", shipDate: "2025-07", vol2025: "~500K-800K", vol2026: "~1.5M est.", customers: "MSFT, Oracle, Meta, OpenAI", notes: "288GB HBM3e · 3nm · Fastest AMD ramp ever. $22-25K ASP.", color: T_.red, sortOrder: 2 },
              { vendor: "Google", chip: "TPU v7 Ironwood", status: "GA 2026", shipDate: "2026-03", vol2025: "Samples", vol2026: "~500K-600K V7E", customers: "Anthropic, Meta (talks), internal", notes: "192GB HBM3e · 44% lower TCO. First merchant sales. V7P $10K.", color: T_.blue, sortOrder: 1 },
              { vendor: "Google", chip: "TPU v6 Trillium", status: "Shipping", shipDate: "2024-12", vol2025: "~2.5M units", vol2026: "~1.6M (transition)", customers: "DeepMind, Anthropic, Midjourney", notes: "ASP ~$4,500. Anthropic 1M-chip deal. Meta in talks.", color: T_.blue, sortOrder: 2 },
              { vendor: "Amazon", chip: "Trainium3", status: "H1 2026", shipDate: "2026-03", vol2025: "—", vol2026: "Ramp begins", customers: "Anthropic, AWS customers", notes: "4x perf vs T2. Co-designed with Anthropic.", color: T_.amber, sortOrder: 1 },
              { vendor: "Amazon", chip: "Trainium2", status: "Shipping (Oct 2025)", shipDate: "2025-10", vol2025: "~1M+ (Rainier)", vol2026: "~2-3M", customers: "Anthropic (primary), Bedrock", notes: "Rainier: 500K→1M+. 30-40% better price-perf. Co-designed.", color: T_.amber, sortOrder: 2 },
              { vendor: "Broadcom", chip: "Custom XPUs (TPU, OAI)", status: "Shipping / In dev", shipDate: "2024-06", vol2025: "~2.5M+ (via Google)", vol2026: "~3-4M+", customers: "Google (TPU), OpenAI (custom), Anthropic (via Google)", notes: "ASIC design + networking thru 2031. Apr 2026: expanded deal for multi-GW Anthropic TPU capacity. $100B AI rev target FY2027.", color: "#A855F7", sortOrder: 2 },
              { vendor: "Meta", chip: "MTIA v2 (In-house)", status: "In deployment", shipDate: "2025-06", vol2025: "Internal only", vol2026: "Scaling", customers: "Meta (ranking, reco, inference)", notes: "Custom inference chip. Supplements GPU fleet.", color: T_.textGhost, sortOrder: 3 },
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
                  <tr style={{ borderBottom: `2px solid ${T_.border}` }}>
                    {[{l:"Vendor",k:"vendor"},{l:"Chip / Platform",k:"chip"},{l:"Ship Date (Est.)",k:"shipDate"},{l:"Status",k:"status"},{l:"2025 Vol (est.)",k:""},{l:"2026 Vol (est.)",k:""},{l:"Key Customers",k:""},{l:"Notes",k:""}].map((h, i) => (
                      <th key={h.l} onClick={h.k ? () => dToggle(h.k) : undefined} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", cursor: h.k ? "pointer" : "default" }}>{h.l}{dArr(h.k)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dSorted.map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: "1px solid #0B0F19" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 700, color: row.color, whiteSpace: "nowrap" }}>{row.vendor}</td>
                      <td style={{ padding: "8px 10px", color: T_.textMid, fontWeight: 600, whiteSpace: "nowrap" }}>{row.chip}</td>
                      <td style={{ padding: "8px 10px", color: T_.text, fontWeight: 600, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{shipLabel(row.shipDate)}</td>
                      <td style={{ padding: "8px 10px" }}><span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: row.status.includes("Shipping") || row.status.includes("deployment") ? "rgba(16,185,129,0.12)" : row.status.includes("2026") ? "rgba(245,158,11,0.12)" : "rgba(100,116,139,0.12)", color: row.status.includes("Shipping") || row.status.includes("deployment") ? T_.green : row.status.includes("2026") ? T_.amber : T_.textDim }}>{row.status}</span></td>
                      <td style={{ padding: "8px 10px", color: T_.textMid, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{row.vol2025}</td>
                      <td style={{ padding: "8px 10px", color: T_.amber, fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{row.vol2026}</td>
                      <td style={{ padding: "8px 10px", color: T_.textDim, fontSize: 11, whiteSpace: "nowrap" }}>{row.customers}</td>
                      <td style={{ padding: "8px 10px", color: T_.textDim, fontSize: 11, maxWidth: 280 }}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>);
          })()}
          <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 10, fontStyle: "italic" }}>Sources: JP Morgan, Morgan Stanley, SemiAnalysis, Epoch AI, TweakTown, company earnings.</div>
        </div>

        {/* Historical Delivery & Volume Trend */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Historical AI Accelerator Shipments (Cumulative Quarterly, Millions)</div>
          <div style={{ fontSize: 11, color: T_.textGhost, marginBottom: 16 }}>Tracks quarterly cumulative shipped units across major vendors. Shows acceleration curve and market share shifts.</div>
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
                  <tr style={{ borderBottom: `2px solid ${T_.border}` }}>
                    <th onClick={hToggle} style={{ padding: "8px 10px", textAlign: "right", fontSize: 10, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", cursor: "pointer" }}>Quarter{hArr}</th>
                    {["NVIDIA GPU","AMD Instinct","Google TPU","AWS Trainium","Total AI Chips","QoQ Δ","Notes"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: h === "Notes" ? "left" : "right", fontSize: 10, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hSorted.map((row, ri) => {
                    const isEst = row.q.includes("E");
                    return (
                    <tr key={ri} style={{ borderBottom: "1px solid #0B0F19", background: isEst ? "rgba(59,130,246,0.03)" : "transparent" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 700, color: isEst ? T_.blue : T_.textMid, whiteSpace: "nowrap", textAlign: "right" }}>{row.q}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: T_.green, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{row.nvda}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: T_.red, fontVariantNumeric: "tabular-nums" }}>{row.amd}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: T_.blue, fontVariantNumeric: "tabular-nums" }}>{row.tpu}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: T_.amber, fontVariantNumeric: "tabular-nums" }}>{row.trn}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: T_.text, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{row.total}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: row.qoq.includes("+") ? T_.green : T_.textDim, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{row.qoq}</td>
                      <td style={{ padding: "8px 10px", color: T_.textDim, fontSize: 11, maxWidth: 280 }}>{row.notes}</td>
                    </tr>);
                  })}
                </tbody>
              </table>
            </div>);
          })()}
          <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 10, fontStyle: "italic" }}>Sources: Epoch AI, JP Morgan, Morgan Stanley, SemiAnalysis, company earnings, TechInsights. Cumulative shipped units. 2026E = estimates.</div>
        </div>

        {/* Notes per chip — expandable */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Key Notes &amp; Context</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {sorted.filter(c => c.notes).map((c, i) => (
              <div key={i} style={{ background: "#0B0F19", borderRadius: 8, border: `1px solid ${T_.border}`, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: vendorColors[c.vendor] }}>{c.vendor}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T_.text }}>{c.chip}</span>
                  <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 9, fontWeight: 600, background: `${statusColor(c.status)}20`, color: statusColor(c.status) }}>{c.status}</span>
                </div>
                <div style={{ fontSize: 12, color: T_.textDim, lineHeight: 1.6 }}>{c.notes}</div>
              </div>
            ))}
          </div>
        </div>
      </>);
      })()}

      {mainTab === "cpuroadmap" && (() => {

        const cpuVendorColors = { Intel: "#0EA5E9", AMD: T_.red, NVIDIA: T_.green, ARM: "#A855F7", Ampere: "#F97316", AWS: T_.amber, Microsoft: T_.purple, Google: T_.blue, Alibaba: "#DC2626" };
        const cpuFiltered = cpuVendorFilter === "All" ? CPU_ROADMAP : CPU_ROADMAP.filter(c => c.vendor === cpuVendorFilter);
        const cpuSorted = [...cpuFiltered].sort((a, b) => b.year - a.year || a.vendor.localeCompare(b.vendor));
        const cpuVendors = ["Intel", "AMD", "NVIDIA", "ARM", "Ampere", "AWS", "Microsoft", "Google", "Alibaba"];
        const cpuYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];
        const cpuStatusColor = (s) => s === "Shipping" || s === "Licensed" ? T_.green : s === "Sampling" ? T_.amber : s === "EOL" ? T_.textGhost : s.includes("2026") || s.includes("2027") ? T_.amber : s === "Announced" ? T_.textDim : T_.textDim;

        return (<>
        <div style={{ marginBottom: 28, borderBottom: `1px solid ${T_.border}`, paddingBottom: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>CPU</div>
          <div style={{ fontSize: 14, color: T_.textDim, marginTop: 5 }}>Tracking server CPU generations across Intel, AMD, NVIDIA, ARM, Ampere, AWS, Microsoft, Google &amp; Alibaba — agentic AI is rebalancing the CPU:GPU ratio from 1:4-1:8 to 1:1-1:2</div>
        </div>

        {/* CPU Industry & Market Updates */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: T_.blue }}>●</span> Industry &amp; Market Updates
          </div>
          <div style={{ maxHeight: 280, overflow: "auto", padding: "12px 16px" }}>
            {CPU_NEWS.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ fontSize: 11, color: T_.textGhost, minWidth: 75, flexShrink: 0, fontWeight: 600, marginTop: 1 }}>{item.date}</span>
                <span style={{ fontSize: 13, color: "#CBD5E1" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Timeline */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20, overflowX: "auto" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Release Timeline</div>
          {cpuVendors.filter(v => CPU_ROADMAP.some(c => c.vendor === v)).map(v => (
            <div key={v} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <div style={{ width: 90, fontSize: 12, fontWeight: 700, color: cpuVendorColors[v], flexShrink: 0 }}>{v}</div>
              <div style={{ display: "flex", flex: 1, gap: 0 }}>
                {cpuYears.map(yr => {
                  const chips = CPU_ROADMAP.filter(c => c.vendor === v && c.year === yr);
                  return (
                    <div key={yr} style={{ flex: 1, minWidth: 0, display: "flex", gap: 3, padding: "2px 4px", borderLeft: `1px solid ${T_.border}` }}>
                      {chips.map(c => (
                        <div key={c.chip} title={`${c.chip} — ${c.status}\n${c.notes}`} style={{
                          padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                          background: `${cpuVendorColors[v]}20`, color: cpuVendorColors[v],
                          border: `1px solid ${c.status === "Shipping" || c.status === "Licensed" || c.status === "EOL" ? cpuVendorColors[v] : `${cpuVendorColors[v]}60`}`,
                          borderStyle: c.status === "Shipping" || c.status === "Licensed" || c.status === "EOL" ? "solid" : "dashed",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130, cursor: "default",
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
          <div style={{ display: "flex", marginTop: 6 }}>
            <div style={{ width: 90, flexShrink: 0 }} />
            {cpuYears.map(yr => (
              <div key={yr} style={{ flex: 1, textAlign: "center", fontSize: 11, color: T_.textDim, fontWeight: 600, borderLeft: `1px solid ${T_.border}`, padding: "4px 0" }}>{yr}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 11, color: T_.textDim }}>
            <span>━ Shipping / Licensed / EOL</span>
            <span style={{ borderBottom: `1px dashed ${T_.textDim}`, paddingBottom: 1 }}>┅ Planned / Sampling / Announced</span>
          </div>
        </div>

        {/* Full Specs Table — filterable by vendor */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T_.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px" }}>CPU Specs</div>
            <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: `1px solid ${T_.border}`, flexWrap: "wrap" }}>
              {["All", ...cpuVendors].map(v => (
                <button key={v} onClick={() => setCpuVendorFilter(v)} style={{
                  padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none",
                  background: cpuVendorFilter === v ? (v === "All" ? T_.blue : cpuVendorColors[v] || T_.blue) : T_.bgPanel,
                  color: cpuVendorFilter === v ? "#FFF" : T_.textDim, transition: "all 0.15s",
                }}>{v}</button>
              ))}
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
            <thead>
              <tr>
                {["Vendor", "Chip", "ISA", "Arch / Node", "Year", "Status", "Cores", "Threads", "Channels", "PCIe", "L3", "TDP", "Coherent Link"].map((h, i) => (
                  <th key={i} style={{
                    textAlign: i >= 6 && i <= 11 ? "right" : "left",
                    padding: "8px 10px", fontSize: 10, fontWeight: 600, color: T_.textDim,
                    textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: `1px solid ${T_.border}`, whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cpuSorted.map((c, i) => (
                <tr key={i} onMouseEnter={e => e.currentTarget.style.background = `${T_.border}40`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, fontWeight: 700, color: cpuVendorColors[c.vendor], fontSize: 13 }}>{c.vendor}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, fontWeight: 700, color: T_.text, fontSize: 13 }}>{c.chip}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.textDim, fontSize: 11 }}>{c.isa}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.textMid, fontSize: 11 }}>{c.arch} · {c.node}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.textMid, fontWeight: 600 }}>{c.year}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10` }}>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: `${cpuStatusColor(c.status)}20`, color: cpuStatusColor(c.status) }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontVariantNumeric: "tabular-nums" }}>{c.cores > 0 ? c.cores : "—"}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textDim, fontVariantNumeric: "tabular-nums" }}>{c.threads > 0 ? c.threads : "—"}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontSize: 11 }}>{c.channels}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontSize: 11 }}>{c.pcie}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontSize: 11 }}>{c.l3}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: c.tdp >= 600 ? T_.red : c.tdp >= 400 ? T_.amber : T_.textMid, fontVariantNumeric: "tabular-nums" }}>{c.tdp > 0 ? `${c.tdp}W` : "—"}</td>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.textDim, fontSize: 11, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.link}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delivery & Volume Expectations — Current + Upcoming */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Delivery &amp; Volume Expectations — Current &amp; Upcoming</div>
          {(() => {
            const cpuDeliveryData = [
              { vendor: "Intel", chip: "Diamond Rapids (Xeon 7)", status: "Sampling", shipDate: "2026-12", vol2025: "—", vol2026: "Sampling only", customers: "Hyperscalers, OEMs", notes: "256C/256T P-core. Intel 18A. Up to 650W. Yield-dependent — could slip to 2027.", color: "#0369A1" },
              { vendor: "Intel", chip: "Clearwater Forest (Xeon 6+)", status: "H2 2026", shipDate: "2026-09", vol2025: "—", vol2026: "Limited ramp", customers: "Hyperscalers", notes: "288 E-cores, Intel 18A. Yield issues risk delay. ~450W TDP.", color: "#0369A1" },
              { vendor: "Intel", chip: "Granite Rapids (Xeon 6 P)", status: "Shipping", shipDate: "2024-09", vol2025: "~3-4M sockets", vol2026: "~5M+ sockets", customers: "All hyperscalers, OEMs", notes: "Currently shipping flagship. AMX FP16 + MRDIMM. Mainstream agentic-era Xeon.", color: "#0EA5E9" },
              { vendor: "Intel", chip: "Sierra Forest (Xeon 6 E)", status: "Shipping", shipDate: "2024-06", vol2025: "~1.5-2M", vol2026: "~3M+", customers: "GCP, Azure, AWS", notes: "288 E-cores per socket. Cloud density king. Power-efficient agentic runtime.", color: "#0EA5E9" },
              { vendor: "AMD", chip: "EPYC Venice (Zen 6)", status: "H2 2026", shipDate: "2026-09", vol2025: "—", vol2026: "Ramp begins", customers: "MSFT, AWS, Meta, GCP", notes: "256C/512T on TSMC N2. AMD's primary share-gain opportunity if Intel 18A slips.", color: "#B91C1C" },
              { vendor: "AMD", chip: "EPYC Turin (Zen 5)", status: "Shipping", shipDate: "2024-10", vol2025: "~3.5M", vol2026: "~4.5M (transition)", customers: "MSFT, AWS, Meta, GCP, Oracle", notes: "Up to 192C/384T. Currently primary AMD agentic-era CPU. ~30% server CPU revenue share Q1 2026.", color: T_.red },
              { vendor: "NVIDIA", chip: "Vera (standalone)", status: "Shipping", shipDate: "2026-03", vol2025: "—", vol2026: "Bundled + standalone", customers: "Alibaba, ByteDance, Cloudflare, CoreWeave, Crusoe, Lambda, Nebius, Oracle, Together.AI, Vultr", notes: "First standalone Nvidia CPU sale (Mar 2026). 88C Olympus + 1.8 TB/s NVLink-C2C.", color: T_.green },
              { vendor: "ARM", chip: "Arm AGI CPU", status: "Shipping", shipDate: "2026-03", vol2025: "—", vol2026: "Initial deployments", customers: "Meta, OpenAI, Cerebras, Cloudflare, F5, SAP, SK Telecom", notes: "First in-house ARM CPU. 136C, TSMC N3. Ends 35-yr licensing-only model.", color: "#7E22CE" },
              { vendor: "Ampere", chip: "AmpereOne MX", status: "H2 2026", shipDate: "2026-09", vol2025: "—", vol2026: "Limited ramp", customers: "Oracle, MSFT, Tencent", notes: "256C custom-core. Faces hyperscaler in-house silicon competition.", color: "#C2410C" },
              { vendor: "AWS", chip: "Graviton5", status: "Shipping", shipDate: "2025-12", vol2025: "Initial", vol2026: "Mass roll-out", customers: "Internal AWS only", notes: "Launched Dec 2025. 192C V3. Default for new EC2 deployments. Arm now ~30%+ of new EC2 instances.", color: "#D97706" },
              { vendor: "Microsoft", chip: "Cobalt 200", status: "Shipping", shipDate: "2025-11", vol2025: "Initial", vol2026: "Mass deploy", customers: "Internal Azure", notes: "Launched Nov 2025. CSS-V3 132C. Pairs with Maia 200 for inference.", color: "#7C3AED" },
              { vendor: "Google", chip: "Axion (next-gen)", status: "H2 2026", shipDate: "2026-09", vol2025: "—", vol2026: "Limited", customers: "Internal GCP", notes: "Successor to C4A (Apr 2024). Per TrendForce: 2026 expansions planned. Likely TSMC N3 with V3-based cores.", color: T_.blue },
              { vendor: "Alibaba", chip: "Yitian 720", status: "Rumored 2026", shipDate: "2026-06", vol2025: "—", vol2026: "Internal initially", customers: "Internal Alibaba Cloud", notes: "Successor to Yitian 710 (2021). Likely TSMC N3 + Neoverse V3-based.", color: "#DC2626" },
            ];
            const dSorted = [...cpuDeliveryData].sort((a, b) => {
              const k = cpuDeliverySort.key;
              let va, vb;
              if (k === "shipDate") { va = a.shipDate; vb = b.shipDate; }
              else if (k === "vendor") { va = a.vendor; vb = b.vendor; }
              else if (k === "chip") { va = a.chip; vb = b.chip; }
              else if (k === "status") { va = a.status; vb = b.status; }
              else { va = a.shipDate; vb = b.shipDate; }
              if (typeof va === "string") return cpuDeliverySort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
              return cpuDeliverySort.dir === "asc" ? va - vb : vb - va;
            });
            const dToggle = (key) => setCpuDeliverySort(prev => prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });
            const dArr = (key) => cpuDeliverySort.key === key ? (cpuDeliverySort.dir === "asc" ? " ↑" : " ↓") : "";
            const shipLabel = (d) => { const [y, m] = d.split("-"); const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return `${months[+m]} ${y}`; };
            return (
            <div style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${T_.border}` }}>
                    {[{l:"Vendor",k:"vendor"},{l:"Chip / Platform",k:"chip"},{l:"Ship Date (Est.)",k:"shipDate"},{l:"Status",k:"status"},{l:"2025 Vol (est.)",k:""},{l:"2026 Vol (est.)",k:""},{l:"Key Customers",k:""},{l:"Notes",k:""}].map((h, i) => (
                      <th key={h.l} onClick={h.k ? () => dToggle(h.k) : undefined} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", cursor: h.k ? "pointer" : "default" }}>{h.l}{dArr(h.k)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dSorted.map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: "1px solid #0B0F19" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 700, color: row.color, whiteSpace: "nowrap" }}>{row.vendor}</td>
                      <td style={{ padding: "8px 10px", color: T_.textMid, fontWeight: 600, whiteSpace: "nowrap" }}>{row.chip}</td>
                      <td style={{ padding: "8px 10px", color: T_.text, fontWeight: 600, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{shipLabel(row.shipDate)}</td>
                      <td style={{ padding: "8px 10px" }}><span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: row.status.includes("Shipping") ? "rgba(16,185,129,0.12)" : row.status.includes("2026") ? "rgba(245,158,11,0.12)" : "rgba(100,116,139,0.12)", color: row.status.includes("Shipping") ? T_.green : row.status.includes("2026") ? T_.amber : T_.textDim }}>{row.status}</span></td>
                      <td style={{ padding: "8px 10px", color: T_.textMid, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{row.vol2025}</td>
                      <td style={{ padding: "8px 10px", color: T_.amber, fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{row.vol2026}</td>
                      <td style={{ padding: "8px 10px", color: T_.textDim, fontSize: 11, whiteSpace: "nowrap" }}>{row.customers}</td>
                      <td style={{ padding: "8px 10px", color: T_.textDim, fontSize: 11, maxWidth: 280 }}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>);
          })()}
          <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 10, fontStyle: "italic" }}>Sources: TrendForce, Tom's Hardware, ServeTheHome, Mercury Research, vendor product pages, hyperscaler announcements.</div>
        </div>

        {/* Historical Server CPU Shipments */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Historical Server CPU Shipments (Quarterly, Millions of Sockets)</div>
          <div style={{ fontSize: 11, color: T_.textGhost, marginBottom: 16 }}>Mercury Research server CPU socket shipments (x86) + estimated Arm DC server CPU shipments (Graviton, Cobalt, Axion, Ampere, Yitian). 2026E = estimates assuming agentic AI core demand uplift.</div>
          {(() => {
            const cpuHistData = [
              { q: "Q4 2026E", qSort: 20264, intel: "8.0M", amd: "4.5M", arm: "1.5M", total: "~14.0M", qoq: "+8%", notes: "Venice + Diamond Rapids ramps + AGI CPU + Vera shipping. AI-driven core demand peaks." },
              { q: "Q3 2026E", qSort: 20263, intel: "7.7M", amd: "4.2M", arm: "1.3M", total: "~13.2M", qoq: "+8%", notes: "Granite Rapids + Turin volume + Cobalt 200 + Graviton5 ramps." },
              { q: "Q2 2026E", qSort: 20262, intel: "7.3M", amd: "3.9M", arm: "1.0M", total: "~12.2M", qoq: "+10%", notes: "Vera CPU first standalone shipments. Q1 price hikes flowing through volume." },
              { q: "Q1 2026", qSort: 20261, intel: "6.8M", amd: "3.5M", arm: "0.8M", total: "~11.1M", qoq: "+10%", notes: "Intel + AMD price hikes. Agentic-AI CPU demand surge first visible." },
              { q: "Q4 2025", qSort: 20254, intel: "6.4M", amd: "3.0M", arm: "0.7M", total: "~10.1M", qoq: "+8%", notes: "Graviton5 + Cobalt 200 launch quarters. AI server demand ramping." },
              { q: "Q3 2025", qSort: 20253, intel: "6.1M", amd: "2.7M", arm: "0.5M", total: "~9.3M", qoq: "+10%", notes: "Turin + Granite Rapids in full ramp. AMD share crosses 30% (revenue)." },
              { q: "Q2 2025", qSort: 20252, intel: "5.7M", amd: "2.4M", arm: "0.4M", total: "~8.5M", qoq: "+13%", notes: "AMD revenue share at 30%. Sierra Forest volume." },
              { q: "Q1 2025", qSort: 20251, intel: "5.0M", amd: "2.1M", arm: "0.4M", total: "~7.5M", qoq: "+10%", notes: "AI server demand starting to materially boost CPU shipments." },
              { q: "Q4 2024", qSort: 20244, intel: "4.7M", amd: "1.8M", arm: "0.3M", total: "~6.8M", qoq: "+10%", notes: "Granite Rapids + Sierra Forest + Turin all launching. AMD revenue share ~28%." },
              { q: "Q3 2024", qSort: 20243, intel: "4.4M", amd: "1.7M", arm: "0.3M", total: "~6.4M", qoq: "+5%", notes: "Genoa/Bergamo selling well. Hyperscaler CSS designs ramping (Cobalt 100, Axion)." },
              { q: "Q2 2024", qSort: 20242, intel: "4.3M", amd: "1.6M", arm: "0.2M", total: "~6.1M", qoq: "+9%", notes: "Graviton4 launches. AMD revenue share 30%+." },
              { q: "Q1 2024", qSort: 20241, intel: "4.1M", amd: "1.3M", arm: "0.2M", total: "~5.6M", qoq: "+4%", notes: "Sapphire/Emerald Rapids in volume. Genoa/Bergamo." },
              { q: "Q4 2023", qSort: 20234, intel: "4.0M", amd: "1.3M", arm: "0.15M", total: "~5.5M", qoq: "+10%", notes: "AMD breaks 25% revenue share. Generative AI capex ramps." },
              { q: "Q3 2023", qSort: 20233, intel: "3.8M", amd: "1.1M", arm: "0.1M", total: "~5.0M", qoq: "+11%", notes: "Bergamo (cloud-optimized Zen 4c) launches." },
              { q: "Q2 2023", qSort: 20232, intel: "3.5M", amd: "0.95M", arm: "0.08M", total: "~4.5M", qoq: "+10%", notes: "Sapphire Rapids + Genoa. AI server inflection visible." },
              { q: "Q1 2023", qSort: 20231, intel: "3.3M", amd: "0.85M", arm: "0.08M", total: "~4.1M", qoq: "+5%", notes: "Sapphire Rapids ships (delayed from 2022). AMX inference acceleration first time." },
              { q: "Q4 2022", qSort: 20224, intel: "3.4M", amd: "0.7M", arm: "0.05M", total: "~3.9M", qoq: "+5%", notes: "Pre-AI-boom baseline. Genoa launches end of quarter." },
              { q: "Q4 2021", qSort: 20214, intel: "2.9M", amd: "0.4M", arm: "0.03M", total: "~3.3M", qoq: "+10%", notes: "Milan ramping. Yitian 710 launches. Graviton3 launches." },
              { q: "Q4 2020", qSort: 20204, intel: "2.6M", amd: "0.2M", arm: "0.02M", total: "~2.9M", qoq: "+7%", notes: "AMD server share <8%. Cooper Lake era. Graviton2 + Ampere Altra at scale." },
            ];
            const hSorted = [...cpuHistData].sort((a, b) => cpuHistSort.dir === "asc" ? a.qSort - b.qSort : b.qSort - a.qSort);
            const hToggle = () => setCpuHistSort(prev => ({ key: "q", dir: prev.dir === "asc" ? "desc" : "asc" }));
            const hArr = cpuHistSort.dir === "asc" ? " ↑" : " ↓";
            return (
            <div style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${T_.border}` }}>
                    <th onClick={hToggle} style={{ padding: "8px 10px", textAlign: "right", fontSize: 10, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", cursor: "pointer" }}>Quarter{hArr}</th>
                    {["Intel x86","AMD x86","Arm DC (in-house + Ampere)","Total Sockets","QoQ Δ","Notes"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: h === "Notes" ? "left" : "right", fontSize: 10, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hSorted.map((row, ri) => {
                    const isEst = row.q.includes("E");
                    return (
                    <tr key={ri} style={{ borderBottom: "1px solid #0B0F19", background: isEst ? "rgba(59,130,246,0.03)" : "transparent" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 700, color: isEst ? T_.blue : T_.textMid, whiteSpace: "nowrap", textAlign: "right" }}>{row.q}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: "#0EA5E9", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{row.intel}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: T_.red, fontVariantNumeric: "tabular-nums" }}>{row.amd}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: "#A855F7", fontVariantNumeric: "tabular-nums" }}>{row.arm}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: T_.text, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{row.total}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: row.qoq.includes("+") ? T_.green : T_.textDim, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{row.qoq}</td>
                      <td style={{ padding: "8px 10px", color: T_.textDim, fontSize: 11, maxWidth: 320 }}>{row.notes}</td>
                    </tr>);
                  })}
                </tbody>
              </table>
            </div>);
          })()}
          <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 10, fontStyle: "italic" }}>Sources: Mercury Research (x86 server CPU socket shipments), TrendForce, vendor disclosures, IDC. Arm DC subset estimated from hyperscaler in-house silicon ramps + Ampere shipments. 2026E = estimates with agentic-AI uplift assumed.</div>
        </div>

        {/* Notes per chip — expandable */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Key Notes &amp; Context</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {cpuSorted.filter(c => c.notes).map((c, i) => (
              <div key={i} style={{ background: "#0B0F19", borderRadius: 8, border: `1px solid ${T_.border}`, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: cpuVendorColors[c.vendor] }}>{c.vendor}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T_.text }}>{c.chip}</span>
                  <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 9, fontWeight: 600, background: `${cpuStatusColor(c.status)}20`, color: cpuStatusColor(c.status) }}>{c.status}</span>
                </div>
                <div style={{ fontSize: 12, color: T_.textDim, lineHeight: 1.6 }}>{c.notes}</div>
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
              <div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>Compute</div>
              <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>GPU compute pricing across generations &middot; on-demand spot &amp; contract</div>
            </div>
          </div>

          {/* Cloud Rental Price History Chart */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Cloud Rental Price ($/GPU-hr, on-demand avg.)</div>
            <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
              {[{ gpu: "A100 SXM", color: T_.textDim }, { gpu: "H100 SXM", color: T_.blue }, { gpu: "H200 SXM", color: "#60A5FA" }, { gpu: "B200 SXM", color: T_.green }, { gpu: "GB200 NVL72", color: T_.amber }].map(g => (
                <div key={g.gpu} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                  <div style={{ width: 10, height: 3, borderRadius: 1, background: g.color }} />
                  <span style={{ color: T_.textDim }}>{g.gpu}</span>
                </div>
              ))}
            </div>
            {(() => {
              const periods = ["Q1 23","Q2 23","Q3 23","Q4 23","Q1 24","Q2 24","Q3 24","Q4 24","Q1 25","Q2 25","Q3 25","Q4 25","Q1 26","Q2 26"];
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
                    <XAxis dataKey="period" tick={{ fill: T_.textDim, fontSize: 11 }} axisLine={{ stroke: T_.border }} tickLine={false} />
                    <YAxis tick={{ fill: T_.textDim, fontSize: 11 }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `$${v}/hr`} domain={[0, 9]} />
                    <Tooltip
                      contentStyle={tooltipStyleSm}
                      formatter={(value, name) => [`$${value.toFixed(2)}/hr`, name]}
                    />
                    <Line type="monotone" dataKey="A100 SXM" stroke={T_.textGhost} strokeWidth={2} dot={{ r: 3, fill: T_.textDim }} connectNulls />
                    <Line type="monotone" dataKey="H100 SXM" stroke={T_.blue} strokeWidth={2.5} dot={{ r: 3, fill: T_.blue }} connectNulls />
                    <Line type="monotone" dataKey="H200 SXM" stroke="#60A5FA" strokeWidth={2} dot={{ r: 3, fill: "#60A5FA" }} connectNulls />
                    <Line type="monotone" dataKey="B200 SXM" stroke={T_.green} strokeWidth={2} dot={{ r: 3, fill: T_.green }} connectNulls />
                    <Line type="monotone" dataKey="GB200 NVL72" stroke={T_.amber} strokeWidth={2} dot={{ r: 4, fill: T_.amber }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              );
            })()}
            <div style={{ fontSize: 11, color: T_.textDim, marginTop: 8, fontStyle: "italic" }}>Sources: SiliconData GPU Rental Index, Jarvislabs, RunPod, Lambda, AWS/GCP on-demand. Avg of specialist providers.</div>
          </div>

          {/* H100 Spot Tiers vs 1-yr Contract — Time Series */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>H100 Pricing — Spot Tiers vs 1-yr Contract</div>
            <div style={{ fontSize: 11, color: T_.textGhost, marginBottom: 16 }}>$/GPU-hr · Silicon Data spot index by tier (since Aug 2023) + SemiAnalysis H100 1-yr Contract Index (free monthly, since Oct 2025)</div>
            <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
              {[
                { lbl: "Hyperscaler Spot", color: "#A78BFA" },
                { lbl: "Neocloud Spot", color: T_.amber },
                { lbl: "Marketplace Spot", color: T_.green },
                { lbl: "1-yr Contract", color: T_.blue, dashed: true },
              ].map(s => (
                <div key={s.lbl} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                  <div style={{ width: 14, height: 0, borderTop: s.dashed ? `2px dashed ${s.color}` : `3px solid ${s.color}` }} />
                  <span style={{ color: T_.textDim }}>{s.lbl}</span>
                </div>
              ))}
            </div>
            {(() => {
              const H100_PRICING = [
                { period: "Q3 23", hyperscaler: 7.76 },
                { period: "Q4 23", hyperscaler: 7.76 },
                { period: "Q1 24", hyperscaler: 7.92 },
                { period: "Q2 24", hyperscaler: 8.50 },
                { period: "Q3 24", hyperscaler: 9.34, neocloud: 2.99, marketplace: 2.58 },
                { period: "Q4 24", hyperscaler: 9.34, neocloud: 2.99, marketplace: 2.58 },
                { period: "Q1 25", hyperscaler: 8.96, neocloud: 3.50, marketplace: 2.29 },
                { period: "Q2 25", hyperscaler: 6.94, neocloud: 3.29, marketplace: 2.00 },
                { period: "Q3 25", hyperscaler: 6.26, neocloud: 3.33, marketplace: 1.95 },
                { period: "Q4 25", hyperscaler: 6.26, neocloud: 3.33, marketplace: 1.95, contract1y: 1.70 },
                { period: "Q1 26", hyperscaler: 7.48, neocloud: 2.53, marketplace: 1.95, contract1y: 2.18 },
                { period: "Q2 26", hyperscaler: 7.48, neocloud: 2.53, marketplace: 1.95, contract1y: 2.35 },
              ];
              return (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={H100_PRICING} margin={{ top: 8, right: 20, left: 8, bottom: 4 }}>
                    <XAxis dataKey="period" tick={{ fill: T_.textDim, fontSize: 11 }} axisLine={{ stroke: T_.border }} tickLine={false} />
                    <YAxis tick={{ fill: T_.textDim, fontSize: 11 }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `$${v}/hr`} domain={[0, 10]} />
                    <Tooltip contentStyle={tooltipStyleSm} formatter={(value, name) => [`$${value.toFixed(2)}/hr`, name]} />
                    <Line type="monotone" dataKey="hyperscaler" name="Hyperscaler Spot" stroke="#A78BFA" strokeWidth={2.5} dot={{ r: 3, fill: "#A78BFA" }} connectNulls />
                    <Line type="monotone" dataKey="neocloud" name="Neocloud Spot" stroke={T_.amber} strokeWidth={2.5} dot={{ r: 3, fill: T_.amber }} connectNulls />
                    <Line type="monotone" dataKey="marketplace" name="Marketplace Spot" stroke={T_.green} strokeWidth={2.5} dot={{ r: 3, fill: T_.green }} connectNulls />
                    <Line type="monotone" dataKey="contract1y" name="1-yr Contract" stroke={T_.blue} strokeWidth={3} strokeDasharray="6 3" dot={{ r: 4, fill: T_.blue }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              );
            })()}
            <div style={{ fontSize: 11, color: T_.textDim, marginTop: 10, fontStyle: "italic" }}>
              Sources: <a href="https://www.silicondata.com/blog/h100-rental-price-over-time" target="_blank" rel="noopener noreferrer" style={{ color: T_.blue, textDecoration: "none" }}>Silicon Data</a> H100 monthly index by tier (Aug 2023→); <a href="https://newsletter.semianalysis.com/p/the-great-gpu-shortage-rental-capacity" target="_blank" rel="noopener noreferrer" style={{ color: T_.blue, textDecoration: "none" }}>SemiAnalysis</a> H100 1-yr Contract Index (free monthly, launched Oct 2025; full multi-GPU coverage paywalled). Quarterly aggregates from monthly publications.
            </div>
            <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 8, lineHeight: 1.6 }}>
              <strong style={{ color: T_.amber }}>Read:</strong> 3-tier spot persists — hyperscaler premium reflects SLAs/networking; neocloud middle for committed buyers; marketplace floor for spot/burst. <strong style={{ color: T_.blue }}>Contract pricing</strong> sits ~25-30% below neocloud spot, but jumped +40% Oct 25 → Mar 26 ($1.70 → $2.35) as B200/H200 allocations tightened. Hyperscaler spot rebounding Q1 26 alongside contract premium — consistent with a re-tightening market.
            </div>
          </div>

          {/* B200 Spot Trend — Q1 2026 */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>B200 Spot Index — Monthly Mean</div>
            <div style={{ fontSize: 11, color: T_.textGhost, marginBottom: 16 }}>$/GPU-hr · Silicon Data B200 Index (since Jan 2026) — short window, watch the March surge</div>
            {(() => {
              const B200_PRICING = [
                { period: "Jan 26", b200: 4.41 },
                { period: "Feb 26", b200: 4.52 },
                { period: "Mar 26", b200: 5.09 },
              ];
              return (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={B200_PRICING} margin={{ top: 8, right: 20, left: 8, bottom: 4 }}>
                    <XAxis dataKey="period" tick={{ fill: T_.textDim, fontSize: 11 }} axisLine={{ stroke: T_.border }} tickLine={false} />
                    <YAxis tick={{ fill: T_.textDim, fontSize: 11 }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `$${v}/hr`} domain={[3.5, 6.5]} />
                    <Tooltip contentStyle={tooltipStyleSm} formatter={(value) => [`$${value.toFixed(2)}/hr`, "B200 monthly mean"]} />
                    <Line type="monotone" dataKey="b200" name="B200 monthly mean" stroke={T_.green} strokeWidth={2.5} dot={{ r: 4, fill: T_.green }} />
                  </LineChart>
                </ResponsiveContainer>
              );
            })()}
            <div style={{ fontSize: 11, color: T_.textDim, marginTop: 10, fontStyle: "italic" }}>
              Source: <a href="https://www.silicondata.com/blog/b200-rental-price-march-2026-update" target="_blank" rel="noopener noreferrer" style={{ color: T_.blue, textDecoration: "none" }}>Silicon Data</a> B200 Index. March mean +12.6% MoM, +15.4% YTD; March daily high $6.11/hr on Mar 25 (YTD); 10-90th pctl band $4.56-$6.05.
            </div>
          </div>
        </div>
      )}

      {mainTab === "neoclouds" && (
        <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, borderBottom: `1px solid ${T_.border}`, paddingBottom: 20 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>Neoclouds</div>
            <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>{NEOCLOUD_DATA.length} providers &middot; GPU-as-a-Service for AI/HPC workloads</div>
          </div>
        </div>

        {/* Neocloud Industry & Market Updates */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: T_.blue }}>●</span> Industry & Market Updates
          </div>
          <div style={{ maxHeight: 280, overflow: "auto", padding: "12px 16px" }}>
            {NEOCLOUD_NEWS.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ fontSize: 11, color: T_.textGhost, minWidth: 50, flexShrink: 0, fontWeight: 600, marginTop: 1 }}>{item.date}</span>
                <span style={{ fontSize: 13, color: "#CBD5E1" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Table */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}` }}>Neocloud Landscape — Key Metrics &middot; {NEOCLOUD_DATA.length} providers</div>
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
                    <th key={h.l} onClick={h.k ? () => ncToggle(h.k) : undefined} style={{ padding: "10px 10px", fontSize: 10, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: `1px solid ${T_.border}`, textAlign: i === 0 ? "left" : i < 6 ? "right" : "left", whiteSpace: "nowrap", cursor: h.k ? "pointer" : "default" }}>{h.l}{ncArr(h.k)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ncSorted.map((co, i) => (
                  <tr key={i} onMouseEnter={e => e.currentTarget.style.background = `${T_.border}20`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, fontWeight: 700, color: co.color, fontSize: 13 }}>{co.name}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: co.ticker === "Private" ? T_.textDim : T_.textMid, fontWeight: 600 }}>{co.ticker}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontVariantNumeric: "tabular-nums" }}>{co.power.connected}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.text, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{co.power.contracted}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontSize: 11 }}>{co.gpus}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.green, fontWeight: 600 }}>{co.backlog || "—"}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.textDim, fontSize: 11, maxWidth: 200 }}>{co.keyClients}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.textDim, fontSize: 11, maxWidth: 160 }}>{co.locations}</td>
                  </tr>
                ))}
              </tbody>
            </table>);
          })()}
        </div>

        {/* Detail Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: T_.textGhost, fontStyle: "italic", marginBottom: 16 }}>Sources: SEC filings (S-1, 10-Q, 10-K), company press releases, Bloomberg, The Information, ABI Research, Synergy Research Group, Mordor Intelligence. Backlog = total remaining performance obligations or announced deal values. As of Mar 2026.</div>
          {NEOCLOUD_DATA.map((co) => (
            <div key={co.name} style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, borderLeft: `3px solid ${co.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: T_.text }}>{co.name}</span>
                  <span style={{ fontSize: 13, color: T_.textDim }}>{co.ticker} &middot; {co.status}</span>
                </div>
                <div style={{ display: "flex", gap: 16, textAlign: "right" }}>
                  <div><div style={{ fontSize: 10, color: T_.textDim, textTransform: "uppercase" }}>Valuation</div><div style={{ fontSize: 16, fontWeight: 700, color: co.color }}>{co.valuation}</div></div>
                  <div><div style={{ fontSize: 10, color: T_.textDim, textTransform: "uppercase" }}>Revenue</div><div style={{ fontSize: 14, fontWeight: 600, color: T_.textMid }}>{co.revenue || "N/A"}</div></div>
                  <div><div style={{ fontSize: 10, color: T_.textDim, textTransform: "uppercase" }}>Backlog</div><div style={{ fontSize: 14, fontWeight: 600, color: T_.green }}>{co.backlog || "N/A"}</div></div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Contracts &amp; Commitments</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.contracts}</div>
                </div>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: T_.amber, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Equity, Converts &amp; Ecosystem</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.investors}</div>
                </div>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Power &amp; Compute</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>Connected: {co.power.connected} &middot; Contracted: {co.power.contracted}<br/>GPUs: {co.gpus}</div>
                </div>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Timeline &amp; Notes</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.timeline}<br/><span style={{ color: T_.textDim, fontStyle: "italic" }}>{co.notes}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}

      {mainTab === "shellpower" && (
        <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, borderBottom: `1px solid ${T_.border}`, paddingBottom: 20 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>Shell + Power</div>
            <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>{SHELL_POWER_DATA.length} providers &middot; Infrastructure shell &amp; power for AI data centers</div>
          </div>
        </div>

        {/* Shell + Power Industry & Market Updates */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: T_.blue }}>●</span> Industry & Market Updates
          </div>
          <div style={{ maxHeight: 280, overflow: "auto", padding: "12px 16px" }}>
            {SHELL_POWER_NEWS.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ fontSize: 11, color: T_.textGhost, minWidth: 50, flexShrink: 0, fontWeight: 600, marginTop: 1 }}>{item.date}</span>
                <span style={{ fontSize: 13, color: "#CBD5E1" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Table */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 0, marginBottom: 24, overflow: "auto" }}>
          <div style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${T_.border}` }}>Shell &amp; Power Infrastructure — Key Metrics &middot; {SHELL_POWER_DATA.length} providers</div>
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
                    <th key={h.l} onClick={h.k ? () => spToggle(h.k) : undefined} style={{ padding: "10px 10px", fontSize: 10, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: `1px solid ${T_.border}`, textAlign: i === 0 ? "left" : i < 6 ? "right" : "left", whiteSpace: "nowrap", cursor: h.k ? "pointer" : "default" }}>{h.l}{spArr(h.k)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {spSorted.map((co, i) => (
                  <tr key={i} onMouseEnter={e => e.currentTarget.style.background = `${T_.border}20`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, fontWeight: 700, color: co.color, fontSize: 13 }}>{co.name}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontWeight: 600 }}>{co.ticker}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textMid, fontVariantNumeric: "tabular-nums" }}>{co.power.connected}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.text, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{co.power.contracted}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.textDim, fontSize: 11 }}>{co.powerType}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, textAlign: "right", color: T_.green, fontWeight: 600 }}>{co.backlog || "—"}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.textDim, fontSize: 11, maxWidth: 180 }}>{co.keyClients}</td>
                    <td style={{ padding: "10px 10px", borderBottom: `1px solid ${T_.border}10`, color: T_.textDim, fontSize: 11, maxWidth: 160 }}>{co.locations}</td>
                  </tr>
                ))}
              </tbody>
            </table>);
          })()}
        </div>

        {/* Detail Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: T_.textGhost, fontStyle: "italic", marginBottom: 16 }}>Sources: SEC filings (S-1, 10-Q, 10-K), company press releases, Bloomberg, CBRE DC Market Report, JLL Data Center Outlook, Uptime Institute. Power capacity and contract values from public filings and press releases. As of Mar 2026.</div>
          {SHELL_POWER_DATA.map((co) => (
            <div key={co.name} style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, borderLeft: `3px solid ${co.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: T_.text }}>{co.name}</span>
                  <span style={{ fontSize: 13, color: T_.textDim }}>{co.ticker} &middot; {co.status}</span>
                </div>
                <div style={{ display: "flex", gap: 16, textAlign: "right" }}>
                  <div><div style={{ fontSize: 10, color: T_.textDim, textTransform: "uppercase" }}>Valuation</div><div style={{ fontSize: 16, fontWeight: 700, color: co.color }}>{co.valuation}</div></div>
                  <div><div style={{ fontSize: 10, color: T_.textDim, textTransform: "uppercase" }}>Power Type</div><div style={{ fontSize: 14, fontWeight: 600, color: T_.textMid }}>{co.powerType}</div></div>
                  <div><div style={{ fontSize: 10, color: T_.textDim, textTransform: "uppercase" }}>Backlog</div><div style={{ fontSize: 14, fontWeight: 600, color: T_.green }}>{co.backlog || "N/A"}</div></div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Contracts &amp; Commitments</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.contracts}</div>
                </div>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: T_.amber, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Equity, Converts &amp; Ecosystem</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.ecosystem || "No disclosed relationships"}</div>
                </div>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Power &amp; Infrastructure</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>Connected: {co.power.connected} &middot; Contracted: {co.power.contracted}<br/>Type: {co.powerType}<br/>Revenue: {co.revenue || "N/A"}</div>
                </div>
                <div style={{ background: "#0B0F19", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, fontWeight: 600 }}>Timeline &amp; Notes</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{co.timeline}<br/><span style={{ color: T_.textDim, fontStyle: "italic" }}>{co.notes}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}

      {/* ═══════ FOUNDRY TAB ═══════ */}
      {mainTab === "foundry" && (() => {
        const TSMC_COLOR = "#E11D48";
        const nodeColor = (n) => ({ "N3": T_.purple, "N2": T_.blue, "A16": "#06B6D4", "Pkg": T_.amber }[n] || T_.textDim);

        // N2 + CoWoS focused roadmap
        const n2Roadmap = [
          { variant: "N2", status: "HVM", date: "Q4 2025", detail: "First nanosheet/GAA transistor node. Fab 22 (Kaohsiung) in production; Fab 20 (Hsinchu) to follow. 4x more tape-outs vs N5 at same stage. Key customers: Apple, NVIDIA, AMD, Qualcomm, MediaTek." },
          { variant: "N2P", status: "On track", date: "Late 2026", detail: "Enhanced 2nm without backside power delivery. Optimized for client SoCs (smartphones, entry-level PCs). Better power efficiency than base N2." },
          { variant: "A16 (1.6nm)", status: "On track", date: "Late 2026", detail: "First node with Super Power Rail (backside power delivery / BSPDN). Targets data center and AI accelerators. NVIDIA reportedly first customer. Arizona Fab 21 Phase 3 will produce A16." },
        ];
        const cowosRoadmap = [
          { variant: "CoWoS-L", status: "Ramping", date: "2025-2026", detail: "Primary packaging for next-gen AI GPUs. 5.5x reticle interposer in 2026, scaling to 9.5x in 2027 (12 HBM4 stacks + 4 accelerator dies). NVIDIA B300 and Rubin R100 both depend on CoWoS-L. Feynman (2028) expected to continue on CoWoS-L or successor." },
          { variant: "CoWoS-S", status: "Legacy", date: "2023+", detail: "Traditional CoWoS. Demand declining as customers transition to CoWoS-L. Still used for smaller AI chips and non-GPU HPC." },
          { variant: "SoIC (3D)", status: "Ramping", date: "2025+", detail: "3D chip stacking via hybrid bonding (6um pitch). CAGR >100% from 2022-2026. Enables chiplet-based architectures — multiple dies stacked vertically." },
        ];
        const priorNodes = [
          { variant: "N3P (3nm)", status: "HVM", date: "Q4 2024", detail: "Current mainstream. Apple 2025 iPhones, NVIDIA Rubin R100. +5% perf vs N3E." },
          { variant: "N3E (3nm)", status: "HVM", date: "2023", detail: "Main 3nm workhorse. ~19 EUV layers." },
          { variant: "N3X (3nm)", status: "On track", date: "H2 2025", detail: "Extreme performance variant for HPC." },
        ];

        const capexData = [
          { year: "FY2024", capex: 29.8, rev: 88.3, gm: 56.1, note: "Actual" },
          { year: "FY2025", capex: 40.9, rev: 122.0, gm: 59.9, note: "Actual (+36% YoY)" },
          { year: "Q1 2026", capex: 0, rev: 35.9, gm: 66.2, note: "Record Q. +41% YoY. HPC 61% of rev." },
          { year: "FY2026E", capex: 54.0, rev: 159.0, gm: 64.0, note: "Guided: $52-56B capex (high end likely), ~30% rev growth, Q1 guide 63-65% GM" },
        ];

        const capexBreakdown = [
          { label: "Advanced Nodes (N3, N2, A16)", pct: 70, color: T_.blue },
          { label: "Advanced Packaging & Test", pct: 15, color: T_.amber },
          { label: "Specialty / Mature Nodes", pct: 15, color: T_.textDim },
        ];

        const revByNode = [
          { label: "3nm", pct: 24, color: T_.purple },
          { label: "5nm", pct: 36, color: T_.blue },
          { label: "7nm", pct: 14, color: "#06B6D4" },
          { label: "16nm", pct: 7, color: T_.green },
          { label: "28nm+", pct: 19, color: T_.textDim },
        ];

        const revByPlatform = [
          { label: "HPC", pct: 61, color: T_.blue },
          { label: "Smartphone", pct: 26, color: T_.green },
          { label: "IoT", pct: 5, color: T_.amber },
          { label: "Auto", pct: 4, color: T_.red },
          { label: "DCE", pct: 4, color: T_.textDim },
        ];

        const cowosCapacity = [
          { period: "Late 2024", kwpm: 38, label: "~38K wpm" },
          { period: "End 2025", kwpm: 75, label: "~75K wpm (2x)" },
          { period: "End 2026E", kwpm: 130, label: "~130K wpm (3.4x)" },
        ];

        const cowosAllocation = [
          { customer: "NVIDIA", share: 55, wafers: "~850K/yr", products: "B300, Rubin (CoWoS-L)", color: "#76B900" },
          { customer: "Broadcom", share: 15, wafers: "~150K/yr", products: "Google TPU, Meta MTIA, OpenAI ASIC", color: T_.red },
          { customer: "AMD", share: 11, wafers: "~105K/yr", products: "MI355, MI400", color: "#ED1C24" },
          { customer: "Marvell", share: 5, wafers: "~55K/yr", products: "AWS Trainium, MSFT Maia", color: "#00599C" },
          { customer: "Amazon (Alchip)", share: 5, wafers: "~50K/yr", products: "Custom AI chips", color: "#FF9900" },
          { customer: "MediaTek", share: 2, wafers: "~20K/yr", products: "Google TPU v7e/v8e", color: "#FFCC00" },
          { customer: "Others", share: 7, wafers: "—", products: "Second-tier AI chip cos", color: T_.textGhost },
        ];

        const fabExpansion = [
          { loc: "Arizona (Fab 21)", phases: [
            { phase: "P1", node: "4nm (N4)", status: "Production", date: "Q4 2024", invest: "$165B total (6 fabs)" },
            { phase: "P2", node: "3nm (N3)", status: "Construction", date: "2027", invest: "Equipment install Q3 2026" },
            { phase: "P3", node: "2nm / A16", status: "Groundbreaking", date: "2027", invest: "Accelerated 1yr ahead" },
          ]},
          { loc: "Japan — Kumamoto (JASM)", phases: [
            { phase: "P1", node: "12/16/22/28nm", status: "Production", date: "Dec 2024", invest: "55K wpm; image sensors, auto" },
            { phase: "P2", node: "3nm or 2nm (pivoted from 6nm)", status: "Construction", date: "~2027", invest: "$13.9B; target node TBD" },
          ]},
          { loc: "Germany — Dresden (ESMC)", phases: [
            { phase: "JV", node: "28/22nm, 16/12nm", status: "Equipment H2 2026", date: "Late 2027", invest: "JV: Bosch + Infineon + NXP; 40K wpm" },
          ]},
          { loc: "Taiwan — Kaohsiung (Fab 22)", phases: [
            { phase: "P1-P5", node: "N2", status: "P1 HVM, P2 trial, P3-5 build", date: "All operational Q4 2027", invest: "5-phase N2 gigafab" },
          ]},
          { loc: "Taiwan — Packaging", phases: [
            { phase: "AP5B", node: "CoWoS", status: "On track", date: "2026", invest: "Taichung" },
            { phase: "AP7", node: "CoWoS / SoIC", status: "Building", date: "P2 2026, P1 2027", invest: "Chiayi" },
            { phase: "AP8", node: "CoWoS", status: "Acquired (Innolux)", date: "2026+", invest: "CoWoS expansion" },
          ]},
        ];

        // Supply chain ecosystem layers
        const ecosystemLayers = [
          { label: "End Customers", items: [
            { name: "Apple", sub: "~17% rev FY2025 (was ~24% in FY2024). A/M-series SoCs (N3P)", color: T_.textDim, link: "AAPL" },
            { name: "NVIDIA", sub: "~19% rev FY2025 (largest customer). B200/B300/Rubin", color: "#76B900", link: "NVDA" },
            { name: "AMD", sub: "~7% rev. EPYC, MI300/MI400", color: "#ED1C24", link: "AMD" },
            { name: "Qualcomm", sub: "~8% rev. Snapdragon SoCs", color: "#3253DC", link: "QCOM" },
            { name: "MediaTek", sub: "~9% rev. Dimensity, Google TPU design", color: "#FFCC00" },
            { name: "Broadcom", sub: "~7-15% rev. Custom AI ASICs for hyperscalers", color: T_.red, link: "AVGO" },
            { name: "Intel", sub: "~6-7% rev. Outsourced products", color: "#0071C5", link: "INTC" },
          ]},
          { label: "Hyperscaler ASICs", items: [
            { name: "Google TPU", sub: "v6/v7/v8 via Broadcom + MediaTek. N3/N2", color: "#4285F4", link: "GOOGL" },
            { name: "Amazon Trainium", sub: "Via Alchip/Marvell. Graviton + Trainium2/3", color: "#FF9900", link: "AMZN" },
            { name: "Microsoft Maia", sub: "Via Marvell. Custom AI accelerator", color: "#00A4EF", link: "MSFT" },
            { name: "Meta MTIA", sub: "Via Broadcom. Custom inference chip", color: "#0866FF", link: "META" },
          ]},
          { label: "TSMC (Foundry)", items: [
            { name: "TSMC", sub: "~70% foundry share. 90%+ at <7nm. $122B rev FY2025. Q1 2026: $35.9B (+41% YoY), GM 66.2%", color: TSMC_COLOR, link: "TSM" },
          ]},
          { label: "Advanced Packaging", items: [
            { name: "CoWoS", sub: "75K wpm (2025) → 130K wpm (2026). Primary for AI GPUs", color: T_.amber },
            { name: "SoIC (3D)", sub: "Hybrid bonding. >100% CAGR. Next-gen chiplet stacking", color: "#F97316" },
            { name: "InFO", sub: "Fan-out packaging. Integrated into 3DFabric platform", color: "#D97706" },
          ]},
          { label: "EDA & IP", items: [
            { name: "Synopsys", sub: "EDA tools + IP cores. Design enablement for N2/A16", color: "#7C3AED", link: "SNPS" },
            { name: "Cadence", sub: "EDA tools + IP. Verification, signoff", color: "#7C3AED", link: "CDNS" },
            { name: "ARM", sub: "CPU IP cores. Neoverse (DC), Cortex (mobile)", color: "#0091BD", link: "ARM" },
            { name: "Siemens EDA", sub: "IC verification, DFM", color: "#009999" },
          ]},
          { label: "Equipment (WFE)", items: [
            { name: "ASML", sub: "EUV monopoly. High-NA EUV for A16+. ~$350M/tool", color: "#00A0E3", link: "ASML" },
            { name: "Applied Materials", sub: "CVD, PVD, etch, CMP. Largest WFE supplier", color: T_.amber, link: "AMAT" },
            { name: "Lam Research", sub: "Etch & deposition. Critical for GAA transistors", color: T_.green, link: "LRCX" },
            { name: "KLA Corp", sub: "Inspection & metrology. Defect detection for EUV", color: T_.red, link: "KLAC" },
            { name: "Tokyo Electron", sub: "Coater/developer, etch. #3 global WFE", color: T_.blue },
          ]},
          { label: "Materials & Components", items: [
            { name: "Shin-Etsu", sub: "300mm silicon wafers. #1 global share", color: T_.textDim },
            { name: "SUMCO", sub: "300mm silicon wafers. #2 global", color: T_.textDim },
            { name: "Entegris", sub: "Specialty chemicals, filters, CMP slurries", color: T_.purple, link: "ENTG" },
            { name: "Photronics", sub: "Photomasks for EUV lithography", color: T_.textGhost },
            { name: "Zeiss (ASML optics)", sub: "EUV optics supplier to ASML. Sole source", color: "#00A0E3" },
            { name: "SK Hynix / Samsung / Micron", sub: "HBM for CoWoS packaging (via NVIDIA/AMD)", color: "#A855F7", link: "MU" },
          ]},
        ];

        const statusColor = (s) => s === "Production" || s === "HVM" ? T_.green : s === "Ramping" || s.includes("Construction") || s.includes("Equipment") ? T_.amber : s.includes("Groundbreaking") || s === "On track" ? T_.blue : T_.textDim;
        const fmtB = (v) => `$${v.toFixed(1)}B`;

        return (
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px", marginBottom: 4 }}>TSMC — Foundry Ecosystem & Roadmap</h2>
          <p style={{ fontSize: 14, color: T_.textDim, marginBottom: 24 }}>Technology roadmap, capex, CoWoS capacity, fab expansion, and supply chain. Sources: TSMC Q1 2026 earnings (Apr 16), TrendForce, SemiAnalysis, Tom's Hardware. Updated 2026-04-18.</p>

          {/* ── Key Metrics ── */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
            {[
              { label: "Q1 2026 Revenue", value: "$35.9B", sub: "+41% YoY, record Q" },
              { label: "FY2025 Revenue", value: "$122B", sub: "+36% YoY (USD)" },
              { label: "FY2026E Revenue", value: "~$159B", sub: "~30% growth (raised)" },
              { label: "Gross Margin", value: "66.2%", sub: "Q1 2026 actual" },
              { label: "Advanced (<7nm)", value: "74-77%", sub: "of wafer revenue" },
              { label: "HPC Share", value: "61%", sub: "of Q1 2026 rev" },
              { label: "CoWoS (2026E)", value: "130K wpm", sub: "3.4x from late 2024" },
              { label: "Arizona", value: "$165B", sub: "Largest FDI in U.S." },
            ].map(m => (
              <div key={m.label} style={{ flex: "1 1 140px", minWidth: 140, background: "#0B0F19", borderRadius: 8, border: `1px solid ${T_.border}`, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: T_.text }}>{m.value}</div>
                <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 2 }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Next-Gen: N2 / 2nm Wafer Roadmap ── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 4 }}>Next-Gen: 2nm Wafer Roadmap</div>
            <div style={{ fontSize: 12, color: T_.textGhost, marginBottom: 16 }}>TSMC's transition from FinFET (N3) to Gate-All-Around nanosheet transistors (N2/A16). N2 capacity target: ~50K wpm by end 2025, ~120-130K wpm by end 2026.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {n2Roadmap.map((r, i) => (
                <div key={i} style={{ padding: "14px 16px", background: "#0B0F19", borderRadius: 8, border: `1px solid ${T_.border}`, borderLeft: `3px solid ${T_.blue}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T_.textMid }}>{r.variant}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: T_.textDim }}>{r.date}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${statusColor(r.status)}15`, color: statusColor(r.status) }}>{r.status}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: T_.textDim, lineHeight: 1.7 }}>{r.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CoWoS Advanced Packaging Roadmap ── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 4 }}>CoWoS Advanced Packaging Roadmap</div>
            <div style={{ fontSize: 12, color: T_.textGhost, marginBottom: 16 }}>CoWoS-L is the critical bottleneck for AI GPU scaling. NVIDIA Rubin (R100, 2026) and Feynman (~2028) both depend on CoWoS-L — without it, these GPUs cannot be assembled. CoWoS-L integrates multiple accelerator dies + HBM stacks on a single large interposer.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {cowosRoadmap.map((r, i) => (
                <div key={i} style={{ padding: "14px 16px", background: "#0B0F19", borderRadius: 8, border: `1px solid ${T_.border}`, borderLeft: `3px solid ${T_.amber}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T_.textMid }}>{r.variant}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: T_.textDim }}>{r.date}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${statusColor(r.status)}15`, color: statusColor(r.status) }}>{r.status}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: T_.textDim, lineHeight: 1.7 }}>{r.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Prior Nodes (collapsed reference) ── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "14px 24px", marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T_.textGhost, marginBottom: 8 }}>Current Production Nodes (N3 Family)</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {priorNodes.map((r, i) => (
                <div key={i} style={{ padding: "8px 12px", background: "#0B0F19", borderRadius: 6, border: `1px solid ${T_.border}`, flex: "1 1 200px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T_.textMid }}>{r.variant}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: `${statusColor(r.status)}15`, color: statusColor(r.status) }}>{r.status}</span>
                  </div>
                  <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 2 }}>{r.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Capex & Revenue ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 16 }}>Capex & Revenue</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T_.border}` }}>
                    <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textDim, fontWeight: 600, fontSize: 11 }}>Year</th>
                    <th style={{ textAlign: "right", padding: "6px 8px", color: T_.textDim, fontWeight: 600, fontSize: 11 }}>Revenue</th>
                    <th style={{ textAlign: "right", padding: "6px 8px", color: T_.textDim, fontWeight: 600, fontSize: 11 }}>Capex</th>
                    <th style={{ textAlign: "right", padding: "6px 8px", color: T_.textDim, fontWeight: 600, fontSize: 11 }}>GM</th>
                  </tr>
                </thead>
                <tbody>
                  {capexData.map(c => (
                    <tr key={c.year} style={{ borderBottom: `1px solid ${T_.border}` }}>
                      <td style={{ padding: "8px", color: c.year.includes("E") ? "#60A5FA" : T_.textMid, fontWeight: 600 }}>{c.year}</td>
                      <td style={{ padding: "8px", textAlign: "right", color: T_.textMid }}>{fmtB(c.rev)}</td>
                      <td style={{ padding: "8px", textAlign: "right", color: T_.textMid }}>{fmtB(c.capex)}</td>
                      <td style={{ padding: "8px", textAlign: "right", color: T_.textMid }}>{c.gm}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 10 }}>FY2026E: $52-56B capex guided. ~70% to advanced nodes, ~15% packaging, ~15% mature.</div>
            </div>

            <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 16 }}>Revenue by Node (FY2025)</div>
              <div style={{ display: "flex", height: 20, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
                {revByNode.map(r => <div key={r.label} style={{ width: `${r.pct}%`, background: r.color, transition: "width 0.3s" }} />)}
              </div>
              {revByNode.map(r => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: r.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: T_.textMid, flex: 1 }}>{r.label}</span>
                  <span style={{ fontSize: 12, color: T_.textDim, fontWeight: 600 }}>{r.pct}%</span>
                </div>
              ))}
              <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginTop: 20, marginBottom: 12 }}>Revenue by Platform (Q4 2025)</div>
              <div style={{ display: "flex", height: 20, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
                {revByPlatform.map(r => <div key={r.label} style={{ width: `${r.pct}%`, background: r.color }} />)}
              </div>
              {revByPlatform.map(r => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: r.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: T_.textMid, flex: 1 }}>{r.label}</span>
                  <span style={{ fontSize: 12, color: T_.textDim, fontWeight: 600 }}>{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Wafer Foundry Market Share ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 16 }}>Foundry Market Share (FY2025)</div>
              {[
                { name: "TSMC", share: 70, color: TSMC_COLOR, sub: "90%+ at advanced nodes (<7nm)" },
                { name: "Samsung", share: 11, color: "#1428A0", sub: "GAA at 3nm; yields lagging TSMC" },
                { name: "GlobalFoundries", share: 5, color: "#00A551", sub: "Mature/specialty (12nm+); no EUV" },
                { name: "UMC", share: 5, color: "#005BAC", sub: "Mature nodes (22/28nm+)" },
                { name: "SMIC", share: 5, color: "#CC0000", sub: "China domestic; DUV-based 7nm" },
                { name: "Others", share: 4, color: T_.textGhost, sub: "Tower Semi, PSMC, etc." },
              ].map(f => (
                <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: f.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: T_.textMid, minWidth: 90, fontWeight: 600 }}>{f.name}</span>
                  <div style={{ flex: 1, height: 14, background: T_.border, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${f.share}%`, height: "100%", background: f.color, borderRadius: 4, opacity: 0.7 }} />
                  </div>
                  <span style={{ fontSize: 11, color: T_.textDim, minWidth: 30, textAlign: "right" }}>{f.share}%</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8 }}>Source: TrendForce. TSMC peaked at 72% in Q3 2025; FY avg ~70%.</div>
            </div>
            <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 16 }}>Advanced Node Share (&lt;7nm)</div>
              {[
                { name: "TSMC", share: 90, color: TSMC_COLOR, sub: "N3, N5, N7. Sole EUV leader at 3nm" },
                { name: "Samsung", share: 8, color: "#1428A0", sub: "3nm GAA; Qualcomm, Google partial" },
                { name: "Intel Foundry", share: 2, color: "#0071C5", sub: "Intel 18A; ramping 2025-2026" },
              ].map(f => (
                <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: f.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: T_.textMid, minWidth: 90, fontWeight: 600 }}>{f.name}</span>
                  <div style={{ flex: 1, height: 14, background: T_.border, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${f.share}%`, height: "100%", background: f.color, borderRadius: 4, opacity: 0.7 }} />
                  </div>
                  <span style={{ fontSize: 11, color: T_.textDim, minWidth: 30, textAlign: "right" }}>{f.share}%</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8 }}>TSMC has near-monopoly at leading edge. Samsung competitive at 3nm GAA but volume lags significantly.</div>
            </div>
          </div>

          {/* ── CoWoS Capacity & Allocation ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 16 }}>CoWoS Capacity Ramp</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 140, marginBottom: 12 }}>
                {cowosCapacity.map(c => {
                  const h = (c.kwpm / 130) * 120;
                  return (
                    <div key={c.period} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T_.amber }}>{c.label}</div>
                      <div style={{ width: "100%", height: h, background: `linear-gradient(180deg, ${T_.amber} 0%, #92400E 100%)`, borderRadius: "6px 6px 0 0" }} />
                      <div style={{ fontSize: 11, color: T_.textDim }}>{c.period}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 16 }}>CoWoS Allocation (2026E)</div>
              {cowosAllocation.map(c => (
                <div key={c.customer} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: T_.textMid, minWidth: 80, fontWeight: 600 }}>{c.customer}</span>
                  <div style={{ flex: 1, height: 14, background: T_.border, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${c.share}%`, height: "100%", background: c.color, borderRadius: 4, opacity: 0.7 }} />
                  </div>
                  <span style={{ fontSize: 11, color: T_.textDim, minWidth: 30, textAlign: "right" }}>{c.share}%</span>
                  <span style={{ fontSize: 10, color: T_.textGhost, minWidth: 100 }}>{c.wafers}</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8 }}>NVIDIA &gt;50% of total CoWoS; 510K wafers specifically CoWoS-L for B300/Rubin.</div>
            </div>
          </div>

          {/* ── Supply Chain & Ecosystem Map ── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 4 }}>TSMC Supply Chain & Ecosystem Map</div>
            <div style={{ fontSize: 12, color: T_.textGhost, marginBottom: 20 }}>Revenue and capex flow from materials → equipment → TSMC → packaging → customers. Direct stock positions (&gt;$20K) highlighted in green.</div>

            {ecosystemLayers.map((layer, li) => (
              <div key={layer.label}>
                {li > 0 && (
                  <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
                    <svg width="20" height="20"><path d="M10 2 L10 14 M6 10 L10 14 L14 10" stroke={T_.borderStrong} strokeWidth="2" fill="none"/></svg>
                  </div>
                )}
                <div style={{ display: "flex", gap: 12, marginBottom: 4 }}>
                  <div style={{ minWidth: 120, maxWidth: 120, textAlign: "right", paddingTop: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px" }}>{layer.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
                    {layer.items.map(item => {
                      const DIRECT_POSITIONS = ["GOOGL","MSFT","NVDA","AMZN","BABA","TSLA","MU"];
                      const inPort = item.link && DIRECT_POSITIONS.includes(item.link);
                      return (
                        <div key={item.name} style={{
                          background: inPort ? "rgba(16,185,129,0.08)" : "#0B0F19",
                          border: `1px solid ${inPort ? T_.green : T_.border}`,
                          borderRadius: 8, padding: "10px 14px", minWidth: 160, flex: "1 1 160px", maxWidth: 260,
                          borderLeft: `3px solid ${item.color}`, position: "relative",
                        }}>
                          {inPort && <div style={{ position: "absolute", top: 4, right: 6, fontSize: 8, color: T_.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>DIRECT POSITION</div>}
                          <div style={{ fontSize: 13, fontWeight: 700, color: T_.textMid }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: T_.textDim, lineHeight: 1.4 }}>{item.sub}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 11, color: T_.textGhost }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, border: `1px dashed ${T_.green}`, background: "rgba(16,185,129,0.08)" }} />
                <span>Direct position (&gt;$20K)</span>
              </div>
              <span>↓ = revenue / capex flow direction</span>
            </div>
          </div>

          {/* ── Global Fab Expansion (compact table) ── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T_.text, marginBottom: 10 }}>Global Fab Expansion</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T_.border}` }}>
                  {["Location", "Phase", "Node", "Status", "Target", "Notes"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "5px 8px", color: T_.textGhost, fontWeight: 600, fontSize: 10, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fabExpansion.flatMap(fab => fab.phases.map(p => (
                  <tr key={`${fab.loc}-${p.phase}`} style={{ borderBottom: `1px solid ${T_.border}` }}>
                    <td style={{ padding: "5px 8px", color: TSMC_COLOR, fontWeight: 600, whiteSpace: "nowrap" }}>{fab.loc.split('—')[0].split('(')[0].trim()}</td>
                    <td style={{ padding: "5px 8px", color: T_.textMid }}>{p.phase}</td>
                    <td style={{ padding: "5px 8px", color: T_.textMid }}>{p.node}</td>
                    <td style={{ padding: "5px 8px" }}><span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 4, background: `${statusColor(p.status)}15`, color: statusColor(p.status) }}>{p.status}</span></td>
                    <td style={{ padding: "5px 8px", color: T_.textDim }}>{p.date}</td>
                    <td style={{ padding: "5px 8px", color: T_.textGhost, fontSize: 11 }}>{p.invest}</td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: 11, color: T_.textGhost, lineHeight: 1.6 }}>
            Sources: TSMC Q4 2025 / Q1 2026 earnings, 2025 Technology Symposium, TrendForce, SemiAnalysis, Tom's Hardware, SemiEngineering, BlackRidge Research, company filings. Revenue shares are estimates based on sell-side consensus and public disclosures. CoWoS allocation based on TrendForce and supply chain reports.
          </div>
        </div>
        );
      })()}


    </div>
  );
}
