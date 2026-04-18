import { useState, useEffect } from "react";
import { T_, FONT } from "./lib/theme";

// ─── Helper: Section Card ───
function Section({ title, subtitle, children }) {
  return (
    <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: subtitle ? 6 : 16 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>{subtitle}</div>}
      {children}
    </div>
  );
}

function MetricCard({ label, value, sub, color }) {
  return (
    <div style={{ background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}`, padding: "14px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: color || T_.text }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: T_.textDim, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function InfoGrid({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
      {items.map((item, i) => (
        <div key={i}>
          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 6 }}>{item.label}</div>
          <div style={{ fontSize: 13, color: item.color || T_.text, lineHeight: 1.6 }}>{item.text}</div>
        </div>
      ))}
    </div>
  );
}

function ExampleTable({ examples }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {examples.map((ex, i) => (
        <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "10px 14px", background: T_.bg, borderRadius: 6, border: `1px solid ${T_.border}` }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: T_.accent, minWidth: 140 }}>{ex.name}</span>
          <span style={{ fontSize: 13, color: T_.textMid, flex: 1, lineHeight: 1.5 }}>{ex.detail}</span>
          {ex.metric && <span style={{ fontSize: 12, color: T_.green, flexShrink: 0 }}>{ex.metric}</span>}
        </div>
      ))}
    </div>
  );
}

function RiskReward({ risks, rewards }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <div style={{ fontSize: 11, color: T_.red, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8 }}>Key Risks</div>
        {risks.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
            <span style={{ color: T_.red, fontSize: 12, flexShrink: 0 }}>{"\u2716"}</span>
            <span style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.5 }}>{r}</span>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 11, color: T_.green, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8 }}>What Makes It Attractive</div>
        {rewards.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
            <span style={{ color: T_.green, fontSize: 12, flexShrink: 0 }}>{"\u2714"}</span>
            <span style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.5 }}>{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BUSINESS MODEL DATA ───

const MODELS = {
  aircraft: {
    label: "Aircraft Leasing",
    icon: "\u2708\uFE0F",
    category: "Asset-Heavy / Leasing",
    color: "#3B82F6",
    tagline: "Buy planes, lease to airlines, earn the spread between financing cost and lease rate",
    howItWorks: "Aircraft lessors purchase new or used aircraft from manufacturers (Boeing, Airbus) and lease them to airlines on long-term operating leases (typically 6-12 years). Revenue = monthly lease rental payments. The lessor owns the asset, bears residual value risk, and manages transitions between lessees. At lease end, the aircraft is either re-leased, sold, or parted out. Lessors finance purchases with a mix of unsecured bonds, bank debt, ABS, and equity — the spread between lease yield (~10-12% on invested capital) and borrowing cost (~4-6%) drives profit.",
    economics: "Lease yields: 10-12% of aircraft value annually. Cost of debt: 4-6% (investment-grade lessors). Net spread: 4-7%. Depreciation: 20-25 year useful life. Residual value at lease end is the key variable — narrowbody aircraft (A320neo, 737 MAX) hold value better than widebody. Fleet utilization: 97-99% for top lessors. Maintenance reserves collected from lessees offset redelivery costs. SG&A is minimal — AerCap runs ~$72B total assets with ~730 employees.",
    keyMetrics: [
      { label: "Lease Yield", value: "10-12%", sub: "Annual rent / aircraft value" },
      { label: "Cost of Funds", value: "4-6%", sub: "Weighted avg borrowing rate" },
      { label: "Fleet Value", value: "$50-70B", sub: "Top lessors (AerCap)" },
      { label: "Utilization", value: "97-99%", sub: "% fleet on lease" },
      { label: "Lease Term", value: "6-12 yr", sub: "Operating lease duration" },
      { label: "LTV Ratio", value: "2.5-3x", sub: "Debt / equity target" },
    ],
    valuation: "Traded on price-to-book (P/B). AerCap: ~1.3x book. Air Lease: ~0.8-1.0x book. Book value reflects depreciated fleet — below-market P/B implies market discounts residual values. P/E: 6-9x. EV/EBITDA: 8-12x. Higher P/B for lessors with younger, more liquid fleets (narrowbody-heavy). Discount for older, less liquid fleets or high geographic concentration.",
    goodVsBad: "A GOOD leasing business has: young fleet (avg age <8 years), predominantly narrowbody, diversified airline customer base (100+ airlines), investment-grade rating (lower cost of funds), strong order book at favorable pricing. A BAD one has: old fleet, widebody-heavy (harder to re-lease), concentrated in weak airlines, high leverage, poor transition management.",
    examples: [
      { name: "AerCap", detail: "World's largest aircraft lessor. ~$72B total assets, ~1,680 aircraft, 300+ airline customers. Acquired GECAS in 2021 for $30B. Investment-grade rated. ~730 employees.", metric: "~1.1x P/B" },
      { name: "Air Lease (AL)", detail: "Founded by Steven Udvar-Hazy. Young fleet (~4 yr avg age), order-heavy model, delivers new aircraft directly from manufacturers to airlines.", metric: "~0.9x P/B" },
      { name: "SMBC Aviation Capital", detail: "#2 global lessor. Japanese bank-owned. ~760+ aircraft. Conservative, relationship-driven model.", metric: "Private" },
      { name: "Avolon", detail: "#3 global. Owned by Bohai Leasing (China). ~1,100+ aircraft (owned+managed). Focused on new-tech narrowbody.", metric: "Private" },
    ],
    risks: [
      "Residual value risk — aircraft worth less than expected at lease end (especially widebody or older tech)",
      "Airline credit risk — lessee defaults or restructures (COVID grounded ~60% of global fleet in 2020)",
      "Interest rate risk — rising rates increase cost of funds and compress spread",
      "Concentration risk — geographic or airline customer over-exposure (Russia sanctions trapped ~400 aircraft in 2022)",
      "Manufacturer delays — Boeing production issues delay new deliveries",
    ],
    rewards: [
      "Contracted, predictable cash flows (6-12 year lease terms)",
      "Essential asset — airlines need planes, leasing share growing (now ~50% of global fleet vs ~25% in 2000)",
      "Inflation hedge — lease rates reprice at market; aircraft values correlate with replacement cost",
      "Oligopoly structure — top 5 lessors control ~50% of leased fleet, scale advantage in financing and fleet management",
      "Counter-cyclical acquisition opportunities — buy distressed assets at discounts during downturns",
    ],
    sources: "AerCap 10-K, Air Lease investor presentations, Ascend by Cirium fleet data, IATA airline finance reports",
  },

  gpu: {
    label: "GPU / Compute Leasing",
    icon: "\uD83D\uDDA5\uFE0F",
    category: "Asset-Heavy / Leasing",
    color: "#8B5CF6",
    tagline: "Finance and lease GPU clusters to AI companies, earn the spread on high-demand compute assets",
    howItWorks: "GPU lessors acquire NVIDIA (H100/B200) and other AI accelerators, build them into data center clusters, and lease compute capacity to AI companies, startups, and enterprises. Contracts range from months to 3+ years. Revenue = contracted lease payments or usage-based fees. The model mirrors aircraft leasing but with faster depreciation (3-5 years vs 20-25 for planes) and higher utilization demand. Some operate as cloud providers (CoreWeave), others as pure financing vehicles. Capital is raised through equity, debt, and structured finance (GPU-backed ABS).",
    economics: "GPU cost: $25-40K per H100 chip, $30-40K per B200. Cluster build cost: $500M-2B+ for large deployments. Lease yields: 30-50%+ annualized (current demand-supply imbalance). Depreciation: 3-5 years (aggressive — next-gen chips obsolete prior gen). Power costs: significant (50-100MW+ per large cluster). Utilization: 85-95% when contracted. Net margins: potentially 20-40%+ at scale. The key risk is technology obsolescence — unlike planes, GPUs can lose value rapidly when next-gen ships.",
    keyMetrics: [
      { label: "GPU Unit Cost", value: "$25-70K", sub: "Per chip (H100 to B200)" },
      { label: "Lease Yield", value: "30-50%+", sub: "Annualized on invested capital" },
      { label: "Useful Life", value: "3-5 yr", sub: "Before obsolescence" },
      { label: "Utilization", value: "85-95%", sub: "% capacity under contract" },
      { label: "Power Cost", value: "$0.04-0.08/kWh", sub: "Major operating expense" },
      { label: "Contract Length", value: "1-3+ yr", sub: "Enterprise commitments" },
    ],
    valuation: "Emerging model — limited public comp set. CoreWeave IPO'd Mar 2025 at ~$23B, now public (NYSE: CRWV). Valuation approaches: EV/EBITDA (if profitable), EV/Revenue (10-20x for high-growth), or asset-based (fleet value). Premium for long-term contracted revenue, discount for technology obsolescence risk. The market debates whether this is more like 'cloud infrastructure' (high multiples) or 'equipment leasing' (low multiples).",
    goodVsBad: "A GOOD GPU lessor has: long-term take-or-pay contracts with creditworthy customers (hyperscalers, well-funded AI labs), access to latest-gen chips (NVIDIA preferred customer), low power costs, secured financing at reasonable rates. A BAD one has: short-term or spot-priced contracts, old-gen GPUs (depreciating fast), high power costs, excessive leverage, concentrated customer base.",
    examples: [
      { name: "CoreWeave", detail: "Leading GPU cloud provider. Raised $12B+. Major NVIDIA partner. Microsoft, Meta as customers. Building 28+ data centers.", metric: "NYSE: CRWV" },
      { name: "Lambda", detail: "GPU cloud for AI training. On-demand and reserved instances. NVIDIA DGX partner. Smaller scale than CoreWeave.", metric: "~$5.9B val" },
      { name: "Crusoe Energy", detail: "Uses stranded natural gas for GPU data centers. Lower power costs. Sustainable computing angle.", metric: "~$10B val" },
      { name: "Voltage Park", detail: "Provides GPU compute access. Backed by significant capital. Focused on AI research and startups.", metric: "Private" },
    ],
    risks: [
      "Technology obsolescence — new GPU generations (annual cadence) can slash prior-gen value 50%+ in 12-18 months",
      "Customer concentration — few large AI customers represent bulk of demand; loss of one is catastrophic",
      "CapEx intensity — requires billions upfront before revenue materializes; financing risk is existential",
      "Power availability — securing sufficient power at reasonable rates is a major bottleneck",
      "NVIDIA dependency — single supplier for critical hardware; allocation and pricing at NVIDIA's discretion",
      "Demand durability — if AI spending cycles down, utilization drops and leases don't renew",
    ],
    rewards: [
      "Massive demand-supply imbalance — AI training compute demand growing 4-5x annually through 2027+",
      "High yields — current GPU lease rates far exceed cost of capital, driven by scarcity",
      "Contracted revenue — multi-year take-or-pay contracts from well-capitalized customers",
      "Secular tailwind — AI is the largest technology investment cycle since cloud; GPU compute is the critical input",
      "Pricing power — limited competition for large-scale, available-now GPU capacity",
    ],
    sources: "CoreWeave investor materials, NVIDIA earnings calls, data center industry reports (JLL, CBRE), AI infrastructure analysis (Bernstein, Barclays)",
  },

  equipment: {
    label: "Equipment Leasing",
    icon: "\uD83D\uDE9C",
    category: "Asset-Heavy / Leasing",
    color: "#0EA5E9",
    tagline: "Finance essential equipment — railcars, containers, trucks, medical devices — and earn steady yields on diversified asset pools",
    howItWorks: "Equipment lessors purchase specialized assets (railcars, shipping containers, trucks, construction equipment, medical devices) and lease them to operators on multi-year contracts. Revenue = lease payments (typically monthly/quarterly). At lease end, assets are re-leased, sold, or refurbished. Some assets (railcars, containers) have 30-40 year useful lives with multiple lease cycles. The model benefits from diversification across asset types, geographies, and end markets. Financing through secured debt (asset-backed), unsecured bonds, and warehouse facilities.",
    economics: "Lease yields: 8-15% depending on asset type and age. Cost of funds: 4-6%. Net spread: 3-8%. Depreciation varies widely: railcars (30-40 yr), containers (12-15 yr), trucks (5-8 yr), medical equipment (5-10 yr). Utilization: 92-98% for essential assets. Maintenance capex is modest for simple assets (containers) but significant for complex ones (aircraft engines). Revenue is predictable and recurring. Operating leverage is high — fleet management overhead is low relative to asset base.",
    keyMetrics: [
      { label: "Lease Yield", value: "8-15%", sub: "On asset net book value" },
      { label: "Utilization", value: "92-98%", sub: "% fleet on lease" },
      { label: "Asset Life", value: "5-40 yr", sub: "Varies by asset type" },
      { label: "Fleet Size", value: "$5-30B", sub: "Major lessors" },
      { label: "Re-lease Rate", value: "85-95%", sub: "% re-leased at expiry" },
      { label: "Leverage", value: "2-4x", sub: "Debt / equity" },
    ],
    valuation: "Price-to-book: 0.8-1.5x depending on asset quality and earnings growth. P/E: 8-14x. EV/EBITDA: 7-11x. Railcar lessors trade at premium (long-lived assets). Truck/trailer lessors trade at modest multiples (shorter lives, cyclical). Dividend yield is important — many lessors return 30-50% of earnings. NAV-based analysis common: sum of asset values minus debt.",
    goodVsBad: "A GOOD equipment leasing business has: diversified asset pool, long-lived assets, essential/non-discretionary use, high re-lease rates, conservative leverage. A BAD one has: concentrated in one asset type, short-lived or rapidly depreciating assets, cyclical end markets, high customer concentration, aggressive leverage.",
    examples: [
      { name: "GATX", detail: "North America's largest railcar lessor. ~156,000 railcars. 125+ year operating history. 99%+ utilization.", metric: "~1.3x P/B" },
      { name: "Triton (Brookfield)", detail: "World's largest intermodal container lessor. ~7M+ TEUs. Acquired by Brookfield Infrastructure for $13.3B.", metric: "Acquired" },
      { name: "Air Lease / GECAS", detail: "Aircraft leasing (covered separately). The aircraft leasing model is the largest and most sophisticated equipment leasing segment.", metric: "See Aircraft" },
      { name: "PACCAR Leasing", detail: "Captive truck leasing arm of PACCAR (Kenworth, Peterbilt). Finances own product sales.", metric: "Captive" },
    ],
    risks: [
      "Residual value risk — asset worth less than book at lease end",
      "Cyclical demand — economic downturns reduce equipment utilization",
      "Interest rate sensitivity — rising rates compress spread and reduce asset values",
      "Maintenance and obsolescence — regulatory changes or technology shifts can strand assets",
      "Credit risk — lessee defaults, particularly in cyclical industries",
    ],
    rewards: [
      "Predictable contracted cash flows — multi-year lease terms",
      "Essential assets — transportation and industrial equipment has inelastic demand",
      "Long asset lives — railcars and containers can generate returns for 30+ years",
      "Diversification — portfolio approach across asset types and customers",
      "Inflation protection — replacement cost rises, supporting residual values and re-lease rates",
    ],
    sources: "GATX 10-K, Triton International filings, railroad industry reports (AAR), equipment leasing association data",
  },

  saas: {
    label: "SaaS / Subscription",
    icon: "\uD83D\uDD04",
    category: "Recurring Revenue",
    color: "#10B981",
    tagline: "Sell cloud software on recurring subscriptions — high margins, predictable revenue, compounding growth through land-and-expand",
    howItWorks: "Software-as-a-Service (SaaS) companies deliver cloud-hosted applications accessed via browser or API, charged on a recurring basis (monthly/annual). Customers never own the software — they rent access. Revenue is recognized ratably over the subscription period. The model creates a 'flywheel': acquire customers (high upfront CAC), retain them (low churn), expand them (upsell more seats/modules), and compound recurring revenue. The transition from perpetual licensing to SaaS was the defining business model shift of 2010-2025.",
    economics: "Gross margins: 70-85% (no physical COGS). Net dollar retention (NDR): 110-130% for best-in-class (existing customers spend more each year). Gross retention: 90-95%. CAC payback: 12-18 months target. LTV/CAC: 3-5x for healthy SaaS. Revenue per employee: $200-500K. Free cash flow margins: 20-40% at scale. The 'Rule of 40' (revenue growth % + FCF margin %) measures overall health — above 40% is good, above 60% is elite.",
    keyMetrics: [
      { label: "Gross Margin", value: "70-85%", sub: "Software delivery cost is minimal" },
      { label: "NDR", value: "110-130%", sub: "Net dollar retention" },
      { label: "CAC Payback", value: "12-18 mo", sub: "Months to recover acquisition cost" },
      { label: "LTV/CAC", value: "3-5x", sub: "Lifetime value / acquisition cost" },
      { label: "Rule of 40", value: ">40%", sub: "Growth% + FCF margin%" },
      { label: "Churn", value: "5-10%", sub: "Annual gross logo churn" },
    ],
    valuation: "EV/Revenue: 5-20x for growth SaaS. EV/ARR: similar. Premium for: high NDR (>120%), durable growth (>25%), strong FCF, large TAM. Discount for: decelerating growth, NDR <110%, high churn, small TAM. At maturity, valued on EV/FCF: 25-40x. The best SaaS companies (ServiceNow, CrowdStrike) compound at 25%+ growth with 30%+ FCF margins for years.",
    goodVsBad: "GOOD: NDR >120%, gross margins >75%, growing 25%+ organically, expanding into adjacent products, low churn, strong platform/ecosystem. BAD: NDR <100% (net churn), growth decelerating toward single digits, reliant on acquisitions for growth, high customer concentration, commoditized product with pricing pressure.",
    examples: [
      { name: "Salesforce", detail: "The original SaaS company. ~$38B revenue. CRM + platform + marketing + analytics. NDR ~110%. ~35% FCF margin.", metric: "~7x Rev" },
      { name: "ServiceNow", detail: "IT workflow automation. ~$13B revenue, growing ~21%. NDR ~125%. 30%+ FCF margin. One of the best SaaS businesses.", metric: "~15x Rev" },
      { name: "CrowdStrike", detail: "Endpoint security SaaS. ~$4B revenue, growing ~29%. NDR ~115%+. Module expansion drives land-and-expand.", metric: "~18x Rev" },
      { name: "Datadog", detail: "Observability platform. ~$3.4B revenue. Consumption + subscription hybrid. NDR ~120%. Multi-product expansion.", metric: "~14x Rev" },
    ],
    risks: [
      "Growth deceleration — market saturation or competitive displacement",
      "NDR compression — existing customers spending less (macro sensitivity)",
      "Rising competition — AI-native tools disrupting incumbent SaaS",
      "Customer concentration — enterprise SaaS often has large customer dependency",
      "Sales efficiency decline — CAC payback extending as market matures",
    ],
    rewards: [
      "Recurring, predictable revenue — 90%+ of revenue is contractually committed",
      "High margins — 70-85% gross, 20-40% FCF at scale with minimal incremental cost per customer",
      "Compounding growth — NDR >100% means revenue grows even without new customers",
      "Switching costs — deeply embedded in customer workflows, high cost to migrate",
      "Operating leverage — revenue grows faster than headcount at scale",
    ],
    sources: "Public SaaS company 10-Ks, Bessemer Venture Partners Cloud Index, KeyBanc SaaS Surveys, Meritech Capital SaaS benchmarks",
  },

  payments: {
    label: "Payment Take Rates",
    icon: "\uD83D\uDCB3",
    category: "Toll / Take-Rate",
    color: "#F59E0B",
    tagline: "Sit in the flow of money — take a small cut of every transaction processed, at massive volume",
    howItWorks: "Payment companies insert themselves into the transaction flow between buyer and seller. For every card swipe, online checkout, or money transfer, multiple parties take a fee: card networks (Visa/Mastercard ~0.13-0.15%), issuing banks (interchange ~1.5-2.0%), acquirers/processors (~0.2-0.5%), and payment facilitators (Stripe, Square ~0.3-0.5% above interchange). Total merchant discount rate: 2.0-3.5% of transaction value. Revenue scales linearly with total payment volume (TPV) — as the economy grows and cash shifts to digital, volume compounds.",
    economics: "Visa/Mastercard (networks): 65-70% operating margins. They don't take credit risk — pure toll model. Revenue = assessments + transaction fees on $17T+ annual volume. Processors (FIS, Fiserv): 30-40% margins, more operational complexity. Fintechs (Stripe, Adyen): 50-60% gross margins, still scaling. Interchange (bank revenue): ~$100B+ annually in the US alone. The key insight: payment companies earn more revenue as prices inflate (% of a larger transaction), making them natural inflation hedges.",
    keyMetrics: [
      { label: "TPV", value: "$17T+", sub: "Visa annual payment volume" },
      { label: "Network Take", value: "~0.13%", sub: "Visa/MA assessment rate" },
      { label: "Total MDR", value: "2.0-3.5%", sub: "Merchant discount rate" },
      { label: "Op Margin", value: "55-70%", sub: "Networks (Visa/MA)" },
      { label: "Revenue Growth", value: "10-12%", sub: "Secular cash-to-digital shift" },
      { label: "Cash→Digital", value: "~60% done", sub: "Global digital penetration" },
    ],
    valuation: "Visa/Mastercard: 25-35x earnings. Premium for: duopoly moat, near-zero credit risk, secular volume growth, extraordinary margins. Processors (FIS, Fiserv, GPN): 10-18x earnings — more competitive, lower margins. Fintechs (Adyen, Stripe): 30-60x revenue — priced for share gain and global expansion. PayPal: 15-20x — discount for decelerating growth and competitive pressure.",
    goodVsBad: "GOOD: toll-booth position (networks), high volume with low credit risk, secular penetration tailwinds, pricing power, cross-border exposure (higher take rate). BAD: purely commodity processing (race to zero), high customer concentration, exposed to interchange regulation (Durbin Amendment), losing share to alternative payment rails.",
    examples: [
      { name: "Visa", detail: "Largest payment network globally. ~$17T annual volume. ~67% operating margin. No credit risk — pure toll model.", metric: "~30x P/E" },
      { name: "Mastercard", detail: "#2 network. ~$11T volume. Similar margin profile to Visa. Growing faster in cross-border and value-added services.", metric: "~33x P/E" },
      { name: "Stripe", detail: "Leading online payment facilitator. ~$1.9T TPV. ~$5.8B revenue. Powers internet commerce for millions of businesses.", metric: "~$160B val" },
      { name: "Adyen", detail: "European payment processor. Unified commerce platform. ~50% EBITDA margin. Direct acquirer model.", metric: "~8x Rev" },
    ],
    risks: [
      "Regulatory risk — interchange caps (Durbin Amendment, EU regulation) directly compress economics",
      "Alternative payment rails — real-time payments (FedNow, Pix, UPI) bypass card networks at lower cost",
      "Merchant pushback — large merchants (Walmart, Amazon) negotiate aggressively or build own rails",
      "Fintech disruption — buy-now-pay-later, account-to-account, crypto challenging card rails",
      "Macro sensitivity — TPV declines in recession (discretionary spending drops)",
    ],
    rewards: [
      "Extraordinary moat — Visa/Mastercard duopoly is one of the strongest in all of business",
      "Secular tailwind — global cash-to-digital shift is ~60% complete; decades of growth ahead",
      "Inflation hedge — revenue is a % of transaction value; higher prices = higher fees",
      "Near-zero credit risk — networks don't lend, they just process",
      "Operating leverage — incremental volume at near-zero marginal cost",
      "Pricing power — merchants have limited alternatives; switching costs are extremely high",
    ],
    sources: "Visa/Mastercard 10-Ks, Nilson Report (payment industry data), Federal Reserve Payments Study, McKinsey Global Payments Map",
  },

  marketplace: {
    label: "Marketplace / Platform",
    icon: "\uD83C\uDFEA",
    category: "Toll / Take-Rate",
    color: "#EF4444",
    tagline: "Connect buyers and sellers, take a cut of each transaction — network effects create winner-take-most dynamics",
    howItWorks: "Marketplace platforms match supply (sellers, service providers, hosts) with demand (buyers, consumers, guests) and charge a take rate on each transaction. Revenue = Gross Merchandise Value (GMV) \u00D7 take rate. The platform doesn't hold inventory or deliver the service — it facilitates the connection and handles trust, payment, and discovery. Network effects are the key: more buyers attract more sellers, which attracts more buyers. Once a marketplace achieves liquidity, it becomes very hard to displace. Monetization expands through advertising, fintech (payments, lending), and premium tools for sellers.",
    economics: "Take rates: 5-30% depending on category. Airbnb: ~13.5% (host + guest fees). Uber: ~25-30% (driver + rider). DoorDash: ~15-20%. Etsy: ~22% (fees + ads + payments). Booking.com: ~14.5%. Gross margins: 50-75%. The 'holy grail' is a marketplace with high take rate, high frequency, and strong network effects. Contribution margin per transaction increases over time as CAC amortizes and repeat usage grows. At scale, marketplaces can achieve 25-40% EBITDA margins.",
    keyMetrics: [
      { label: "GMV", value: "$10B-200B+", sub: "Gross merchandise/booking value" },
      { label: "Take Rate", value: "5-30%", sub: "Revenue / GMV" },
      { label: "Gross Margin", value: "50-75%", sub: "After payment processing" },
      { label: "Frequency", value: "4-50x/yr", sub: "Transactions per user/year" },
      { label: "Liquidity", value: ">80%", sub: "% demand matched quickly" },
      { label: "CAC/LTV", value: "3-5x+", sub: "Target LTV/CAC ratio" },
    ],
    valuation: "EV/GMV: 0.5-3x (efficient way to compare across take rates). EV/Revenue: 5-20x for growth marketplaces. Premium for: high take rate, strong network effects, demonstrated liquidity, expanding into adjacencies (fintech, ads). Discount for: low take rate, subsidy-driven growth, no clear path to profitability, regulatory risk (gig economy classification).",
    goodVsBad: "GOOD: genuine two-sided network effects, high frequency, expanding take rate over time, multiple revenue streams (ads, fintech), high seller/buyer retention. BAD: subsidy-dependent (growth collapses when discounts end), single-sided (no real network effect), commoditized supply (easy to multi-home), regulatory risk.",
    examples: [
      { name: "Airbnb", detail: "~$91B GMV. ~13.5% take rate. ~$12B revenue. Asset-light, 40%+ FCF margins. Dominant in short-term rental.", metric: "~25x P/E" },
      { name: "Uber", detail: "~$194B gross bookings. Mobility + delivery. 25-30% take rate. Reached profitability at scale after years of subsidies.", metric: "~30x P/E" },
      { name: "Etsy", detail: "Handmade/vintage marketplace. ~$12B GMV. ~22% take rate. High seller lock-in but facing competition from Amazon Handmade, Temu.", metric: "~15x P/E" },
      { name: "Booking Holdings", detail: "Largest online travel agency. ~$150B+ gross bookings. ~14.5% take rate. Includes Booking.com, Priceline, Kayak.", metric: "~20x P/E" },
    ],
    risks: [
      "Disintermediation — buyers and sellers take the relationship off-platform",
      "Multi-homing — sellers/buyers use multiple platforms, weakening network effects",
      "Regulatory risk — gig economy labor laws, short-term rental restrictions, antitrust",
      "Subsidy dependency — growth requires unsustainable incentives to attract supply or demand",
      "Take rate pressure — sellers resist fee increases, especially on commoditized platforms",
    ],
    rewards: [
      "Network effects — the strongest moat in business; winner-take-most dynamics",
      "Asset-light — no inventory, no warehouses, no fleet (marketplace owns the connection, not the product)",
      "Operating leverage — marginal transaction cost approaches zero at scale",
      "Multiple monetization vectors — advertising, fintech, premium tools compound on base GMV",
      "High switching costs — sellers build reputation/reviews on the platform; leaving means starting over",
    ],
    sources: "Public marketplace company 10-Ks, a16z marketplace metrics framework, NFX network effects manual, Bessemer marketplace benchmarks",
  },

  reits: {
    label: "REITs",
    icon: "\uD83C\uDFE2",
    category: "Yield / Spread",
    color: "#06B6D4",
    tagline: "Own real estate, collect rent, distribute income — a tax-advantaged structure for real estate investing",
    howItWorks: "Real Estate Investment Trusts (REITs) own, operate, or finance income-producing real estate. They must distribute \u226590% of taxable income as dividends (the tax advantage — no corporate tax if distribution requirement is met). Revenue = rental income from tenants on leases ranging from 1 year (apartments) to 20+ years (triple-net). REITs grow by: raising rents (same-store NOI growth), acquiring properties, or developing new ones. Leverage is typically 4-6x debt/EBITDA. Sub-types: equity REITs (own property), mortgage REITs (own loans/MBS), and hybrid.",
    economics: "Cap rates: 4-8% depending on property type (lower for premium assets). NOI margins: 60-75% (rental income minus operating expenses). FFO (Funds from Operations) is the key earnings metric — net income + depreciation - gains on sale. AFFO adjusts for maintenance capex. Dividend yield: 3-6% for equity REITs. Total return = dividend yield + NAV growth. Interest expense is the largest cost after property operations. REITs are highly sensitive to interest rates — higher rates increase cost of capital and compress cap rates.",
    keyMetrics: [
      { label: "Cap Rate", value: "4-8%", sub: "NOI / property value" },
      { label: "NOI Margin", value: "60-75%", sub: "Net operating income margin" },
      { label: "FFO/AFFO", value: "key metric", sub: "Funds from operations" },
      { label: "Occupancy", value: "90-97%", sub: "% occupied" },
      { label: "SS NOI Growth", value: "2-5%", sub: "Same-store NOI growth" },
      { label: "Dividend Yield", value: "3-6%", sub: "Annual distribution" },
    ],
    valuation: "P/FFO: 12-25x depending on property type and growth. P/AFFO for comparison. Premium/discount to NAV: most REITs trade within +/-15% of NAV. Data center REITs (Equinix, Digital Realty): 20-30x FFO — AI/cloud demand. Industrial (Prologis): 20-25x — e-commerce logistics. Office: 8-12x — secular headwind from remote work. Triple-net (Realty Income): 14-18x — bond-like stability.",
    goodVsBad: "GOOD: irreplaceable locations, long-term leases with contractual escalators, high occupancy, secular demand tailwinds (data centers, logistics), conservative balance sheet. BAD: oversupplied market, short-term leases with cyclical tenants (office, retail), high leverage, development risk, geographic concentration.",
    examples: [
      { name: "Prologis", detail: "World's largest logistics REIT. ~1.3B sq ft. Amazon is ~5% of rent. E-commerce secular tailwind.", metric: "~22x FFO" },
      { name: "Equinix", detail: "Largest data center REIT. ~270 data centers in 70+ metros globally. AI/cloud demand driving growth.", metric: "~28x FFO" },
      { name: "Realty Income", detail: "'The Monthly Dividend Company.' Triple-net retail REIT. 15,000+ properties. 30+ years of monthly dividend increases.", metric: "~15x FFO" },
      { name: "Public Storage", detail: "Largest self-storage REIT. ~3,200 facilities. High NOI margins (~75%). Low maintenance capex.", metric: "~20x FFO" },
    ],
    risks: [
      "Interest rate sensitivity — rising rates increase cost of debt and compress property values",
      "Oversupply — new construction can exceed demand (especially office, multifamily in some markets)",
      "Tenant credit risk — anchor tenant bankruptcies (retail) or downsizing (office)",
      "Secular headwinds — remote work (office), e-commerce (brick-and-mortar retail)",
      "Illiquidity of underlying assets — can't sell buildings quickly in a downturn",
      "Development risk — cost overruns, delays, lease-up risk on new construction",
    ],
    rewards: [
      "Tax-advantaged income — 90%+ distribution requirement means high current yield",
      "Inflation protection — rents escalate with CPI; replacement cost rises, supporting values",
      "Essential assets — people need places to live, work, store goods, and house servers",
      "Tangible NAV — real estate has intrinsic value; floor on downside",
      "Secular winners — data centers, logistics, healthcare REITs have structural demand growth",
      "Portfolio diversification — low correlation with equity markets",
    ],
    sources: "NAREIT data, Green Street Advisors, REIT company 10-Ks/supplements, Federal Reserve economic data (FRED)",
  },

  utilities: {
    label: "Regulated Utilities",
    icon: "\u26A1",
    category: "Yield / Spread",
    color: "#34D399",
    tagline: "Earn a regulated return on invested capital — the more you invest in infrastructure, the more you earn",
    howItWorks: "Regulated utilities operate monopoly franchises to deliver electricity, gas, or water within defined service territories. Revenue and profits are set by state/federal regulators through 'rate cases.' The formula: Rate Base (invested capital) \u00D7 Allowed ROE (typically 9-11%) = authorized earnings. Utilities grow earnings by investing in infrastructure (transmission lines, substations, renewables, grid hardening) which increases the rate base. They file rate cases every 2-4 years to incorporate new investment and recover costs. The regulatory compact: guaranteed service territory and reasonable return in exchange for the obligation to serve all customers.",
    economics: "Allowed ROE: 9-11% (varies by state). Earned ROE: 8-10% (usually slightly below allowed due to regulatory lag). Rate base growth: 6-8% CAGR for top utilities (capital investment driven). Equity ratio: 45-55% of capitalization. Debt cost: 4-6%. Dividend payout: 60-75% of earnings. Dividend growth: 5-8% annually. The key insight: utilities grow earnings primarily through CapEx deployment, not revenue growth. More investment = larger rate base = higher allowed earnings.",
    keyMetrics: [
      { label: "Rate Base", value: "$20-60B", sub: "Major utilities" },
      { label: "Allowed ROE", value: "9-11%", sub: "Authorized return on equity" },
      { label: "Rate Base Growth", value: "6-8%", sub: "Annual CapEx-driven growth" },
      { label: "Dividend Yield", value: "3-4%", sub: "Current yield" },
      { label: "Payout Ratio", value: "60-75%", sub: "Dividend / earnings" },
      { label: "EPS Growth", value: "5-8%", sub: "Tracks rate base growth" },
    ],
    valuation: "P/E: 16-22x forward earnings. Premium for: constructive regulatory jurisdictions, high rate base growth (data center load, renewables), T&D-focused (lower risk than generation). Discount for: merchant generation exposure, unfriendly regulators, wildfire liability (California). Regulated utilities trade as 'bond proxies' — P/E expands when rates fall, compresses when rates rise. Dividend yield + EPS growth = 8-12% total expected return.",
    goodVsBad: "GOOD: constructive regulatory environment, high capital deployment opportunity (grid modernization, renewables, data center load growth), transmission-focused (federally regulated, more predictable), strong balance sheet. BAD: hostile regulators (disallowed costs), merchant/unregulated generation exposure, wildfire or storm liability, weak load growth, over-leveraged.",
    examples: [
      { name: "NextEra Energy", detail: "Largest US utility by market cap. FPL (regulated FL) + NextEra Energy Resources (largest wind/solar operator). ~8% EPS growth.", metric: "~22x P/E" },
      { name: "Duke Energy", detail: "Large regulated utility. Southeast/Midwest. $45B+ rate base. Heavy CapEx in grid modernization and renewables.", metric: "~17x P/E" },
      { name: "Southern Company", detail: "Large regulated. Southeast US. Transmission + distribution. Nuclear (Vogtle 3&4). $55B+ rate base.", metric: "~18x P/E" },
      { name: "AES Corporation", detail: "Diversified utility with large renewables pipeline. US + international. Data center power contracts growing.", metric: "~12x P/E" },
    ],
    risks: [
      "Regulatory risk — unfavorable rate case outcomes can reduce allowed ROE or disallow costs",
      "Interest rate sensitivity — utilities are 'bond proxies'; rising rates compress valuations",
      "Execution risk — large capital projects (nuclear, grid buildout) can face delays and cost overruns",
      "Weather/natural disaster — storms, wildfires, droughts impact infrastructure and earnings",
      "Stranded asset risk — fossil generation may become uneconomic before fully depreciated",
    ],
    rewards: [
      "Monopoly franchise — no competition within service territory; guaranteed customer base",
      "Regulated returns — allowed ROE of 9-11% provides floor on profitability",
      "Visible growth — CapEx plans announced years in advance; rate base growth is predictable",
      "Defensive — electricity/gas demand is essential and non-discretionary",
      "AI/data center tailwind — massive new load growth from data centers driving incremental investment",
      "Dividend compounding — 5-8% annual dividend growth with 60-75% payout ratio",
    ],
    sources: "EEI (Edison Electric Institute) financial data, utility company 10-Ks, state PUC rate case orders, S&P Global utility research",
  },

  banks: {
    label: "Banking / Net Interest",
    icon: "\uD83C\uDFE6",
    category: "Yield / Spread",
    color: "#6366F1",
    tagline: "Borrow short (deposits) and lend long (loans) — earn the spread, manage the credit risk",
    howItWorks: "Banks take in deposits (checking, savings, CDs) at low interest rates and lend them out (mortgages, commercial loans, credit cards) at higher rates. The spread = Net Interest Income (NII). This is supplemented by fee income: wealth management, investment banking, credit card fees, service charges. The business model is inherently leveraged — banks operate at 8-12x leverage (equity/assets). Regulation (Basel III/IV) sets minimum capital ratios (CET1: 10-13% for large banks). Credit risk management is existential: bad loans destroy capital. The Fed funds rate directly impacts NII — higher rates generally benefit banks (asset yields reprice faster than deposit costs) until deposit competition catches up.",
    economics: "Net Interest Margin (NIM): 2.5-3.5% for most US banks. ROE: 10-15% for well-run banks. ROA: 1.0-1.3%. Efficiency ratio: 55-65% (operating expenses / revenue — lower is better). Credit costs (provision for loan losses): 0.3-0.6% of loans in normal times, 1-2%+ in recession. Capital ratios: CET1 of 10-13%. Dividend payout: 30-40%. Share buybacks: significant (banks return 70-100% of earnings to shareholders when capital is adequate).",
    keyMetrics: [
      { label: "NIM", value: "2.5-3.5%", sub: "Net interest margin" },
      { label: "ROE", value: "10-15%", sub: "Return on equity" },
      { label: "Efficiency Ratio", value: "55-65%", sub: "Expenses / revenue" },
      { label: "CET1", value: "10-13%", sub: "Common equity tier 1" },
      { label: "NCO Ratio", value: "0.3-0.6%", sub: "Net charge-offs / loans" },
      { label: "P/TBV", value: "1.0-2.0x", sub: "Price / tangible book" },
    ],
    valuation: "Price/Tangible Book Value (P/TBV): 1.0-2.0x. P/E: 9-14x. Banks that consistently earn above cost of equity (~12%) trade above 1x TBV. JPMorgan: ~2x TBV (premium for consistent >15% ROE). Regional banks: 1.0-1.5x TBV. Weak banks: 0.5-0.8x TBV (earnings below cost of equity). Dividend yield: 2-4%.",
    goodVsBad: "GOOD: consistently high ROE (>13%), conservative underwriting, low-cost deposit base, diversified revenue (fees + NII), strong capital position, excellent management track record through cycles. BAD: concentrated loan book (CRE heavy), high cost of deposits, low ROE (<10%), weak credit culture, regulatory issues, over-reliance on rate environment.",
    examples: [
      { name: "JPMorgan Chase", detail: "Largest US bank by assets ($4T+). Fortress balance sheet. 16%+ ROE. Dominant across all banking segments.", metric: "~2x P/TBV" },
      { name: "Bank of America", detail: "#2 US bank. Largest deposit base. Consumer + wealth (Merrill) + IB. NIM-sensitive.", metric: "~1.4x P/TBV" },
      { name: "Wells Fargo", detail: "4th largest US bank. Under consent orders with asset cap. Exited mortgage origination business. Turnaround story.", metric: "~1.3x P/TBV" },
      { name: "First Republic (cautionary)", detail: "Failed in 2023. Concentrated in low-rate jumbo mortgages + high-cost deposits. Deposit flight + unrealized bond losses = insolvency.", metric: "Failed" },
    ],
    risks: [
      "Credit risk — loan losses in recession can wipe out multiple years of earnings",
      "Interest rate risk — mismatched asset/liability duration (SVB failure lesson)",
      "Liquidity risk — deposit flight can be sudden and fatal (First Republic, SVB)",
      "Regulatory risk — higher capital requirements reduce leverage and returns",
      "Concentration risk — heavy CRE or single-industry exposure amplifies cyclical losses",
    ],
    rewards: [
      "Spread income compounds — NII is recurring as long as loans perform",
      "Operating leverage — scale drives efficiency ratio improvement",
      "Capital return — well-capitalized banks return 70-100% of earnings via dividends + buybacks",
      "Rate environment — higher rates generally expand NIM and boost earnings",
      "Diversification — large banks earn fees from wealth management, trading, IB, cards",
      "Essential service — everyone needs a bank; deposit franchises have deep moats",
    ],
    sources: "Federal Reserve bank holding company data (Y-9C), FDIC statistics, bank 10-Ks/earnings supplements, Basel III/IV regulatory framework",
  },

  franchise: {
    label: "Franchise Model",
    icon: "\uD83C\uDF54",
    category: "Asset-Light",
    color: "#F97316",
    tagline: "License your brand and system to independent operators — collect royalties with minimal capital deployed",
    howItWorks: "Franchise businesses license their brand, operating system, supply chain, and training to independent franchisees who invest the capital and run day-to-day operations. The franchisor collects: (1) initial franchise fees ($25K-75K), (2) ongoing royalties (4-8% of gross sales), (3) advertising fund contributions (2-4% of sales), and (4) sometimes real estate rent (McDonald's model — owns the land, leases to franchisees). The franchisee bears the capital cost ($500K-3M+ per unit) and operating risk. The franchisor earns high-margin royalty income on a growing system. Growth = new unit openings + same-store sales growth.",
    economics: "Royalty rate: 4-8% of franchisee gross sales. Franchisor revenue per unit: $30-80K/year in royalties. Franchisor gross margins on royalty income: 80-90%+. Operating margins: 40-60%. FCF conversion: 80-100%. Capital intensity: near zero (franchisee invests). Revenue growth = unit growth (3-5%) + same-store sales growth (2-4%) = 5-9% organic. The McDonald's model is the gold standard: they own the real estate, making them both franchisor AND landlord — rent income adds another high-margin revenue stream.",
    keyMetrics: [
      { label: "Royalty Rate", value: "4-8%", sub: "% of franchisee gross sales" },
      { label: "System Sales", value: "$50-120B", sub: "Top franchisors" },
      { label: "Op Margin", value: "40-60%", sub: "Franchisor margins" },
      { label: "Unit Growth", value: "3-5%", sub: "Annual new openings" },
      { label: "SSSG", value: "2-4%", sub: "Same-store sales growth" },
      { label: "FCF Conversion", value: "80-100%", sub: "Minimal capex" },
    ],
    valuation: "EV/EBITDA: 18-30x for premium franchisors. P/E: 20-35x. Premium for: high unit growth runway, strong same-store sales, asset-light model, brand strength. McDonald's: ~25x EBITDA. Yum Brands: ~22x. Restaurant Brands (Burger King/Tim Hortons): ~16x. Marriott/Hilton: ~22-25x. Franchise royalty streams are valued like annuities — high predictability commands premium multiples.",
    goodVsBad: "GOOD: strong brand with pricing power, large unit growth runway (international expansion), high franchisee profitability (unit economics work), asset-light with high FCF conversion, self-funding growth (franchisees invest). BAD: declining brand, franchisee profitability under pressure, saturated domestic market, high franchisee turnover, capital-intensive company-owned units mixed in.",
    examples: [
      { name: "McDonald's", detail: "~45,000 restaurants, 95% franchised. Collects royalties + rent (owns real estate). ~$26B revenue. 45%+ op margins.", metric: "~25x EBITDA" },
      { name: "Marriott International", detail: "~9,700 properties, 98% franchised/managed. Largest hotel company. Asset-light transformation complete.", metric: "~23x EBITDA" },
      { name: "Yum Brands", detail: "KFC, Taco Bell, Pizza Hut. ~63,000 restaurants, 98% franchised. International growth (China, India).", metric: "~22x EBITDA" },
      { name: "Wingstop", detail: "Fast-growing chicken wing franchise. ~3,000+ units. 95%+ franchised. 60%+ unit-level margins. Digital-forward.", metric: "~50x P/E" },
    ],
    risks: [
      "Brand damage — franchisee misconduct or quality decline tarnishes system-wide brand",
      "Franchisee profitability — if unit economics deteriorate, growth stalls and closures accelerate",
      "Labor and commodity inflation — franchisees squeezed on costs, may resist royalty payments",
      "Market saturation — limited whitespace for new unit openings domestically",
      "Regulatory risk — franchise disclosure laws, minimum wage increases, joint employer liability",
    ],
    rewards: [
      "Asset-light — franchisees invest the capital; franchisor earns royalties with minimal deployed assets",
      "Predictable revenue — royalties flow as long as restaurants/hotels are open; high visibility",
      "Operating leverage — incremental franchised unit adds revenue at near-zero marginal cost",
      "Inflation pass-through — royalties are % of sales; menu price increases flow through directly",
      "Scale advantages — purchasing power, technology, marketing budgets grow with system size",
      "Capital return — high FCF conversion enables large buybacks and dividends",
    ],
    sources: "Franchise Disclosure Documents (FDDs), company 10-Ks, Nation's Restaurant News, STR (hotel industry data), IFA (International Franchise Association)",
  },

  royalties: {
    label: "Royalties & Licensing",
    icon: "\uD83D\uDC8E",
    category: "Asset-Light",
    color: "#A855F7",
    tagline: "Own the rights to production output — collect royalties on every unit produced, with zero operating costs",
    howItWorks: "Royalty companies own the rights to a stream of payments based on production or usage — mineral rights (oil, gas, mining), pharmaceutical royalties, music catalogs, or IP licenses. The royalty owner has no operating costs, no employees at the asset level, and no capital expenditure obligation. The operator bears all costs and risks of production; the royalty owner simply collects a % of revenue or per-unit fee. This creates the highest-margin business model in existence — royalty revenue falls almost entirely to the bottom line. Growth comes from: rising production volumes, rising commodity/drug prices, or acquiring new royalty streams.",
    economics: "Margins: 70-90% operating margins (nearly pure profit). No capex obligation. No operating costs at the asset level. Revenue driven by: production volume \u00D7 commodity price \u00D7 royalty rate. Mineral royalties: 12.5-25% of gross production. Pharma royalties: 1-10% of drug sales. Music royalties: streaming payments per play + licensing fees. Valuation of royalty streams uses discounted cash flow of expected future payments. Key risk: production decline or drug patent expiry.",
    keyMetrics: [
      { label: "Op Margin", value: "70-90%", sub: "Nearly zero costs" },
      { label: "Royalty Rate", value: "1-25%", sub: "Varies by asset type" },
      { label: "Production Growth", value: "0-10%/yr", sub: "Volume drives revenue" },
      { label: "Reserve Life", value: "10-30+ yr", sub: "Mineral assets" },
      { label: "FCF Conversion", value: "~100%", sub: "No capex required" },
      { label: "Dividend Yield", value: "1-8%", sub: "Varies by growth profile" },
    ],
    valuation: "P/NAV (net asset value): 1.0-2.5x for mineral royalties. Pharma royalties: valued on DCF of pipeline. EV/EBITDA: 15-30x (premium for zero-cost margin structure). Franco-Nevada: ~30x EBITDA (gold royalty premium). Royalty Pharma: ~15-20x EBITDA. Music catalogs: 15-25x annual publishing income. The premium reflects margin quality, predictability, and optionality (exploration upside for mineral royalties).",
    goodVsBad: "GOOD: diversified royalty portfolio, long-lived assets, multiple operators (no single-operator dependency), optionality on exploration/development, growing production base. BAD: concentrated in single asset or operator, declining production, commodity price sensitivity without hedging, limited pipeline of new royalty acquisitions, patent expiry (pharma).",
    examples: [
      { name: "Franco-Nevada", detail: "Largest precious metals royalty company. 440+ assets. No operating mines. 80%+ margins. Gold price exposure.", metric: "~30x EBITDA" },
      { name: "Texas Pacific Land", detail: "Owns ~880,000 acres in West Texas (Permian Basin). Oil/gas royalties + water sales. No operating costs. 90%+ margins.", metric: "~35x P/E" },
      { name: "Royalty Pharma", detail: "Largest buyer of pharmaceutical royalties. Owns royalties on 35+ approved therapies including Trikafta (CF), Tremfya, Xtandi.", metric: "~15x EBITDA" },
      { name: "Hipgnosis / Universal Music", detail: "Music catalog owners. Streaming revenue per song. Evergreen copyright (life of author + 70 years). Growing streaming TAM.", metric: "15-25x income" },
    ],
    risks: [
      "Commodity price risk — mineral royalties directly tied to oil, gold, copper prices",
      "Production decline — natural resource depletion reduces volumes over time",
      "Patent/exclusivity expiry — pharma royalties cliff when generics launch",
      "Operator risk — production depends on operator's competence and capital allocation",
      "Acquisition risk — overpaying for new royalty streams when competition for deals is high",
    ],
    rewards: [
      "Highest-margin model in business — 70-90%+ operating margins with zero operating costs",
      "Zero capex obligation — the operator funds all development and production",
      "Inflation hedge — commodity and drug prices tend to rise over time",
      "Optionality — mineral royalties benefit from operator exploration on your land at no cost to you",
      "Portfolio diversification — royalty companies own streams across multiple operators and assets",
      "Tax efficiency — depletion allowance provides tax shield for mineral royalties",
    ],
    sources: "Franco-Nevada annual report, Texas Pacific Land 10-K, Royalty Pharma investor materials, IFPI Global Music Report",
  },

  datainfo: {
    label: "Data & Information Services",
    icon: "\uD83D\uDCCA",
    category: "Asset-Light",
    color: "#14B8A6",
    tagline: "Sell mission-critical data, ratings, and analytics that customers can't operate without — high retention, high margins, high pricing power",
    howItWorks: "Data and information services companies collect, curate, and distribute proprietary datasets, ratings, benchmarks, and analytics that are embedded in customer workflows. Revenue comes from subscriptions (annual data feeds), transaction-based fees (per-rating, per-report), and licensing. The key moat: the data is essential for regulatory compliance, investment decisions, or business operations — and there's often no substitute. Bloomberg terminals, S&P credit ratings, MSCI indexes — customers literally cannot do their jobs without these products. This creates extraordinary pricing power and retention.",
    economics: "Gross margins: 65-80%. Operating margins: 40-55%. Organic growth: 6-10%. Revenue retention: 95-98% (near-zero churn). Pricing power: 3-5% annual price increases accepted with minimal pushback. Revenue per employee: $300-600K. Capital intensity: very low. FCF conversion: 85-95% of EBITDA. The 'regulatory moat' is powerful: credit ratings agencies are NRSRO-designated, index providers determine trillions in passive flows, and financial data is required for compliance.",
    keyMetrics: [
      { label: "Op Margin", value: "40-55%", sub: "Information services" },
      { label: "Retention", value: "95-98%", sub: "Revenue retention" },
      { label: "Organic Growth", value: "6-10%", sub: "Price + volume" },
      { label: "Price Increases", value: "3-5%", sub: "Annual escalators" },
      { label: "FCF Conversion", value: "85-95%", sub: "Low capex required" },
      { label: "Revenue/Employee", value: "$300-600K", sub: "High productivity" },
    ],
    valuation: "EV/EBITDA: 20-35x. P/E: 25-40x. Among the most expensive business models in public markets. Premium for: regulatory moat (ratings agencies), index-linked AUM flows (MSCI), mission-critical data (Bloomberg, Refinitiv). S&P Global: ~28x EBITDA. MSCI: ~35x EBITDA. Verisk: ~25x EBITDA. The premium reflects extraordinary predictability, pricing power, and compounding.",
    goodVsBad: "GOOD: regulatory moat (mandated usage), deeply embedded in workflows, no viable substitute, high switching costs, network effects (more data = better product), consistent 95%+ retention. BAD: commoditized data (easily replicated), low switching costs, small addressable market, single-product dependency, regulatory risk (ratings agency reform).",
    examples: [
      { name: "S&P Global", detail: "Credit ratings (#1 globally) + indices (S&P 500) + Market Intelligence (data/analytics). ~$15B revenue. Merged with IHS Markit.", metric: "~28x EBITDA" },
      { name: "MSCI", detail: "Indices (drives ~$7T in linked AUM), ESG ratings, real estate analytics. Revenue grows with global AUM. Extraordinary pricing power.", metric: "~35x EBITDA" },
      { name: "Bloomberg LP", detail: "Bloomberg Terminal (~$30K/yr per seat, 350K+ subscribers). Dominant in fixed income data. ~$12B revenue. Privately held.", metric: "Private" },
      { name: "Verisk Analytics", detail: "Insurance data/analytics monopoly. ISO statistical agent. PCS catastrophe data. 95%+ retention.", metric: "~25x EBITDA" },
    ],
    risks: [
      "Regulatory scrutiny — ratings agency reform, antitrust on data monopolies",
      "Open data initiatives — government and industry pushing for free/open alternatives",
      "Technology disruption — AI could replicate some analytical capabilities at lower cost",
      "Concentration risk — dependence on financial services industry (cyclical fee pools)",
      "Acquisition integration — large M&A (S&P/IHS Markit) creates execution risk",
    ],
    rewards: [
      "Mission-critical — customers cannot operate without the data; 95-98% retention",
      "Pricing power — 3-5% annual increases with minimal pushback; customers have no alternative",
      "Regulatory moats — mandated usage for credit ratings, index tracking, insurance data",
      "Operating leverage — data assets scale at near-zero marginal cost",
      "Compounding — organic growth + price increases + M&A = consistent double-digit earnings growth",
      "Recession resilience — data subscriptions are among the last expenses cut in a downturn",
    ],
    sources: "S&P Global, MSCI, Verisk 10-Ks, industry reports (Burton-Taylor, Opimas), SEC NRSRO reports",
  },

  specialty: {
    label: "Specialty Finance / Lending",
    icon: "\uD83D\uDCB0",
    category: "Yield / Spread",
    color: "#EC4899",
    tagline: "Lend to underserved or niche markets at higher rates — earn wider spreads by accepting and managing specialized credit risk",
    howItWorks: "Specialty finance companies lend to borrowers that traditional banks avoid or under-serve: auto loans (subprime/near-prime), equipment finance, factoring/ABL, consumer installment, small business, healthcare receivables, and more. Revenue = interest income on loans - cost of funding. The spread is wider than bank lending (8-20% yields vs 5-7% for banks) because borrowers are higher-risk or the collateral is specialized. Funding comes from warehouse lines, ABS securitization, credit facilities, and sometimes deposits (for licensed finance companies). Credit risk management and loss mitigation are the core competency — the ability to underwrite, price, and collect better than competitors defines profitability.",
    economics: "Yield on loans: 8-20%+ depending on credit quality and collateral. Cost of funds: 5-8% (higher than banks — no cheap deposits). Net interest spread: 4-12%. Provision for losses: 2-8% of loans (higher than banks). Operating expenses: 3-6% of loans. ROE: 12-20% for well-run specialty lenders. Leverage: 3-8x (lower than banks). Loss severity varies: auto loans (30-50% severity on default), unsecured consumer (80-100% severity), equipment (20-40% severity).",
    keyMetrics: [
      { label: "Yield", value: "8-20%+", sub: "Interest rate on loans" },
      { label: "NIM", value: "4-12%", sub: "Wider than banks" },
      { label: "NCO Rate", value: "2-8%", sub: "Net charge-offs" },
      { label: "ROE", value: "12-20%", sub: "Well-run lenders" },
      { label: "Leverage", value: "3-8x", sub: "Debt / equity" },
      { label: "Delinquency", value: "3-8%", sub: "30+ day delinquent" },
    ],
    valuation: "P/TBV: 0.8-2.5x. P/E: 7-14x. Premium for: consistent credit performance through cycles, niche underwriting expertise, strong funding access, growing origination. Discount for: rising delinquencies, funding concentration, single-product dependency. BDCs (business development companies): 0.8-1.2x NAV with 8-12% dividend yields. Auto finance: 1.0-1.5x TBV.",
    goodVsBad: "GOOD: proven credit track record through cycles (2008, COVID), diversified funding sources (deposits, ABS, warehouse), proprietary data/underwriting models, niche with limited competition, scalable origination. BAD: untested credit through recession, funding concentration (single warehouse lender), loose underwriting to chase growth, macro-cyclical portfolio, regulatory risk.",
    examples: [
      { name: "Ares Capital (ARCC)", detail: "Largest BDC. ~$30B portfolio. Middle-market direct lending. 9-10% dividend yield. Managed by Ares Management.", metric: "~1.1x NAV" },
      { name: "Ally Financial", detail: "Leading auto finance company. ~$192B assets. Bank charter (cheap deposits). Digital banking platform.", metric: "~0.9x TBV" },
      { name: "SoFi Technologies", detail: "Digital finance platform. Student refinancing + personal loans + banking + investing. Growing deposits rapidly.", metric: "~3x P/B" },
      { name: "OneMain Financial", detail: "Subprime consumer installment lender. ~$21B portfolio. ~25% APR. 1,300+ branches. Deep underwriting expertise.", metric: "~1.2x TBV" },
    ],
    risks: [
      "Credit risk — loan losses can spike rapidly in recession; subprime portfolios are especially vulnerable",
      "Funding risk — inability to securitize or roll warehouse lines can be existential (2008 lesson)",
      "Regulatory risk — consumer lending regulations (CFPB, state usury laws) can cap rates or restrict practices",
      "Competition — banks moving into specialty niches when yields are attractive compresses margins",
      "Macro sensitivity — unemployment directly drives delinquencies and charge-offs",
    ],
    rewards: [
      "Higher returns — wider spreads compensate for higher credit risk; ROE of 12-20%",
      "Underserved markets — limited competition in many niches; pricing power",
      "Data advantage — proprietary underwriting models improve with scale and history",
      "Yield to investors — BDCs, REITs, and specialty lenders offer attractive dividend income",
      "Counter-cyclical opportunities — buy distressed loan portfolios at discounts during downturns",
    ],
    sources: "Company 10-Ks, Federal Reserve consumer credit data, ABS market reports (Fitch, S&P), CFPB consumer finance reports",
  },
};

const MODEL_ORDER = ["aircraft", "gpu", "equipment", "saas", "payments", "marketplace", "reits", "utilities", "banks", "franchise", "royalties", "datainfo", "specialty"];

const CATEGORIES = [
  { label: "Asset-Heavy / Leasing", keys: ["aircraft", "gpu", "equipment"], color: "#3B82F6" },
  { label: "Recurring Revenue", keys: ["saas"], color: "#10B981" },
  { label: "Toll / Take-Rate", keys: ["payments", "marketplace"], color: "#F59E0B" },
  { label: "Yield / Spread", keys: ["reits", "utilities", "banks", "specialty"], color: "#06B6D4" },
  { label: "Asset-Light", keys: ["franchise", "royalties", "datainfo"], color: "#A855F7" },
];

export default function BusinessModels({ initialTab }) {
  const [activeModel, setActiveModel] = useState(initialTab || MODEL_ORDER[0]);
  useEffect(() => { if (initialTab) setActiveModel(initialTab); }, [initialTab]);

  const model = activeModel ? MODELS[activeModel] : MODELS[MODEL_ORDER[0]];

  return (
    <div style={{ flex: 1, padding: "36px 52px", overflowY: "auto", fontFamily: FONT }}>
      {/* Tab bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B", marginBottom: 24, width: "fit-content", maxWidth: "100%" }}>
        {MODEL_ORDER.map(key => (
          <button key={key} onClick={() => setActiveModel(key)} style={{
            padding: "8px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            border: "none", background: activeModel === key ? "#3B82F6" : "#111827",
            color: activeModel === key ? "#FFF" : "#94A3B8",
            fontFamily: FONT, transition: "all 0.15s", whiteSpace: "nowrap",
          }}>{MODELS[key].label}</button>
        ))}
      </div>

      {/* MODEL DETAIL */}
      {model && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>{model.label}</div>
              <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>{model.category}</div>
            </div>
            <div style={{ fontSize: 14, color: T_.textDim, marginTop: 8, lineHeight: 1.6, fontStyle: "italic" }}>{model.tagline}</div>
          </div>

          {/* How It Works */}
          <Section title="How It Works" subtitle="The economic engine and mechanics of this business model">
            <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.7 }}>{model.howItWorks}</div>
          </Section>

          {/* Unit Economics */}
          <Section title="Unit Economics" subtitle="The numbers that drive profitability">
            <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.7, marginBottom: 20 }}>{model.economics}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
              {model.keyMetrics.map(m => (
                <MetricCard key={m.label} label={m.label} value={m.value} sub={m.sub} color={T_.accent} />
              ))}
            </div>
          </Section>

          {/* Good vs Bad */}
          <Section title="What Separates Good from Bad">
            <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.7 }}>{model.goodVsBad}</div>
          </Section>

          {/* Valuation */}
          <Section title="Valuation Framework" subtitle="How the market prices this business model">
            <div style={{ fontSize: 13, color: T_.green, lineHeight: 1.7 }}>{model.valuation}</div>
          </Section>

          {/* Real Examples */}
          <Section title="Real Examples" subtitle="Companies operating this model today">
            <ExampleTable examples={model.examples} />
          </Section>

          {/* Risk / Reward */}
          <Section title="Risk / Reward Analysis">
            <RiskReward risks={model.risks} rewards={model.rewards} />
          </Section>

          {/* Sources */}
          <div style={{ fontSize: 12, color: T_.textGhost, fontStyle: "italic", marginTop: 8 }}>
            Sources: {model.sources}
          </div>
        </div>
      )}
    </div>
  );
}
