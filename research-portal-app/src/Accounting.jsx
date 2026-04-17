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

function CaseStudy({ cs }) {
  return (
    <div style={{ background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}`, padding: 18, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: T_.accent }}>{cs.company}</span>
        <span style={{ fontSize: 12, color: T_.textGhost }}>{cs.year}</span>
        {cs.amount && <span style={{ fontSize: 12, color: T_.red, fontWeight: 600 }}>{cs.amount}</span>}
      </div>
      <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.7, marginBottom: 10 }}>{cs.scheme}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>How It Unraveled</div>
      <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.7, marginBottom: 10 }}>{cs.unraveled}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: T_.textDim, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Aftermath</div>
      <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.7 }}>{cs.aftermath}</div>
    </div>
  );
}

function RedFlagList({ flags }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {flags.map((f, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 12px", background: T_.bg, borderRadius: 6, border: `1px solid ${T_.border}` }}>
          <span style={{ color: T_.red, fontSize: 12, flexShrink: 0, marginTop: 2 }}>{"\u26A0"}</span>
          <span style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{f}</span>
        </div>
      ))}
    </div>
  );
}

function DetectionList({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 12px", background: T_.bg, borderRadius: 6, border: `1px solid ${T_.border}` }}>
          <span style={{ color: T_.green, fontSize: 12, flexShrink: 0, marginTop: 2 }}>{"\u2714"}</span>
          <span style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

// ─── ASC STANDARDS REFERENCE DATA ───
const ASC_STANDARDS = [
  {
    code: "ASC 606",
    title: "Revenue from Contracts with Customers",
    effective: "Public: Dec 2017 (FY beginning after Dec 15, 2017). Private: Dec 2018.",
    replaced: "Replaced ASC 605, SOP 97-2 (software), SOP 81-1 (construction), and ~200 pieces of industry-specific guidance with a single principles-based framework.",
    goal: "Eliminate inconsistencies across industries. Under old rules, a software company and a construction company doing economically similar deals could recognize revenue completely differently. ASC 606 forces everyone through the same 5-step model.",
    framework: "5-step model: (1) Identify the contract \u2014 enforceable rights and obligations exist. (2) Identify performance obligations \u2014 distinct goods/services promised. (3) Determine the transaction price \u2014 including variable consideration, time value of money, non-cash consideration. (4) Allocate the price to performance obligations \u2014 using standalone selling prices. (5) Recognize revenue when/as each obligation is satisfied \u2014 either at a point in time (control transfers) or over time (customer simultaneously receives and consumes benefits).",
    keyJudgments: "Over-time vs. point-in-time recognition, identifying distinct performance obligations in bundled deals, estimating variable consideration (rebates, penalties, returns), principal vs. agent (gross vs. net reporting), contract modification treatment (cumulative catch-up vs. prospective).",
    relevance: "Most common area of restatements and SEC enforcement. Software/SaaS, construction, and multi-element arrangements are highest-risk. Watch for DSO trends, deferred revenue changes, and percentage-of-completion estimate revisions.",
    example: "A SaaS company sells a $1.2M, 3-year deal that bundles software licenses, implementation services, and ongoing support. Under ASC 606: Step 1 \u2014 one contract exists. Step 2 \u2014 three performance obligations (license, implementation, support) because each is distinct. Step 3 \u2014 transaction price is $1.2M. Step 4 \u2014 allocate based on standalone selling prices: license $500K, implementation $200K, support $500K. Step 5 \u2014 license recognized at a point in time when delivered ($500K Day 1), implementation over time as work is performed ($200K over ~3 months), support ratably over 36 months (~$13.9K/month). Without ASC 606, the company might have booked the full $1.2M upfront. With ASC 606, only $500K hits revenue on Day 1, the rest is spread. This is why deferred revenue is so important to track \u2014 it shows how much has been paid but not yet recognized.",
    financialImpact: {
      incomeStatement: "Revenue recognized only as performance obligations are satisfied \u2014 $500K license on Day 1, $200K implementation over 3 months, $500K support ratably over 36 months. Timing of revenue directly drives reported margins and growth rates.",
      balanceSheet: "Cash collected upfront ($1.2M) but not yet earned sits as Deferred Revenue (liability). As revenue is recognized, deferred revenue decreases and retained earnings increase. Accounts receivable appears if billed but not yet collected.",
      cashFlow: "Cash from operations gets the full $1.2M when collected, regardless of revenue timing. This is why CFO can significantly exceed net income for subscription businesses \u2014 cash comes in upfront, revenue trickles in over time.",
    },
  },
  {
    code: "ASC 842",
    title: "Leases",
    effective: "Public: Jan 2019. Private: Jan 2022.",
    replaced: "Replaced ASC 840. Under old rules, operating leases were entirely off-balance sheet \u2014 companies could have billions in lease obligations with no balance sheet recognition.",
    goal: "Bring operating leases onto the balance sheet so investors can see the full scope of a company's lease obligations. Pre-ASC 842, airlines, retailers, and restaurant chains had massive hidden liabilities.",
    framework: "Lessees recognize a right-of-use (ROU) asset and lease liability for virtually all leases >12 months. Two classifications: (1) Finance lease \u2014 front-loaded expense (interest + amortization, like old capital leases). (2) Operating lease \u2014 straight-line single lease cost. Both go on balance sheet, but P&L treatment differs. Lessors retain operating, sales-type, and direct financing classification. Practical expedients allow combining lease and non-lease components.",
    keyJudgments: "Lease term (renewal/termination options that are 'reasonably certain'), discount rate (incremental borrowing rate if implicit rate not available), variable lease payments (usage-based, CPI-indexed), lease modifications vs. separate contracts, embedded leases in service agreements.",
    relevance: "Critical for data center/infrastructure (CORZ, WULF, APLD), retail, airlines, restaurants. Commencement timing determines when revenue starts for lessors. Practical expedient elections (combining lease/non-lease components) affect comparability. Watch for ROU asset impairments.",
    example: "A restaurant chain signs a 10-year lease for a location at $20K/month. Pre-ASC 842, this was just a footnote \u2014 $2.4M in annual rent expense appeared on the P&L, but zero showed on the balance sheet. Post-ASC 842: Day 1, the company records a right-of-use (ROU) asset of ~$1.7M and a lease liability of ~$1.7M (present value of all future payments at their incremental borrowing rate, say 6%). Each month, $20K is recognized as a single straight-line lease cost (operating lease). The liability decreases as payments are made; the ROU asset amortizes. Now multiply this by 500 locations \u2014 suddenly $850M+ in previously hidden liabilities appears on the balance sheet, leverage ratios jump, and debt covenants may be triggered. This is exactly why ASC 842 mattered: a retailer that 'looked' like it had 2x leverage might actually be at 4x when you include lease obligations.",
    financialImpact: {
      incomeStatement: "Operating lease: single straight-line lease cost ($20K/month) within operating expenses \u2014 same P&L treatment as before ASC 842. Finance lease: split into amortization expense (operating) + interest expense (below the line), front-loaded so total expense is higher in early years.",
      balanceSheet: "ROU asset and lease liability both appear on Day 1 (~$1.7M each). Over time, both decline but at different rates. Total assets and total liabilities both increase \u2014 leverage ratios (Debt/EBITDA, Debt/Equity) jump. This is the big change: previously hidden obligations now visible.",
      cashFlow: "Lease payments split: operating lease payments are operating cash outflows. Finance lease payments split between operating (interest portion) and financing (principal portion). No change in actual cash spent \u2014 just reclassification. But CFO looks worse for finance leases because principal repayments move to financing section.",
    },
  },
  {
    code: "ASC 350",
    title: "Intangibles \u2014 Goodwill and Other",
    effective: "Original: Jun 2001 (SFAS 142). Major update: Jan 2020 (ASU 2017-04 simplified impairment test).",
    replaced: "Replaced goodwill amortization with annual impairment testing. Before SFAS 142, goodwill was amortized over up to 40 years.",
    goal: "Better reflect the economics of acquired intangibles. Goodwill shouldn't decline on a fixed schedule \u2014 it either retains value or gets impaired. The 2017 update eliminated Step 2 (hypothetical purchase price allocation) to simplify.",
    framework: "Goodwill: not amortized, tested annually for impairment (or when triggering events occur). Compare fair value of reporting unit to carrying value \u2014 if carrying > fair value, recognize impairment loss (capped at goodwill balance). Other intangibles: finite-life intangibles (customer relationships, patents, tech) amortized over useful life. Indefinite-life intangibles (certain trademarks, FCC licenses) tested annually like goodwill.",
    keyJudgments: "Reporting unit identification, fair value measurement methodology (DCF vs. market multiples), discount rate selection, long-term growth rate assumptions, triggering event assessment. Companies have significant discretion in assumptions that determine whether impairment is triggered.",
    relevance: "Serial acquirers (Broadcom, Oracle, IBM) carry massive goodwill. When an acquisition underperforms, management has incentive to delay impairment recognition using optimistic projections. Watch for goodwill as a % of total assets, acquisition track record, and whether triggering events (market cap < book value) go without impairment charges.",
    example: "A PE-backed software company acquires a competitor for $500M. The target has $50M in net tangible assets (servers, cash, receivables minus liabilities). The acquirer identifies $150M in intangible assets: $80M in customer relationships (amortized over 10 years = $8M/yr expense), $50M in technology (amortized over 5 years = $10M/yr), and $20M in trade name (indefinite life, not amortized). The remaining $300M is goodwill \u2014 it just sits on the balance sheet, not amortized, not hitting earnings. Two years later, the acquired business underperforms. Annual impairment test: management runs a DCF using a 10% discount rate and 3% terminal growth \u2014 fair value comes out to $480M, still above carrying value, so no impairment. But if they used 12% and 2%, fair value drops to $420M, triggering a $80M impairment charge. That's the game \u2014 small changes in assumptions determine whether a massive write-down happens or not.",
    financialImpact: {
      incomeStatement: "Finite-life intangibles hit earnings every year via amortization ($18M/yr in this example). Goodwill ($300M) never hits earnings unless impaired. When an impairment triggers \u2014 say $80M \u2014 it's a one-time, non-cash charge that tanks net income that quarter but is typically excluded from Adjusted EBITDA.",
      balanceSheet: "Goodwill and intangibles sit as long-term assets. Finite-life intangibles shrink each year (amortization). Goodwill stays flat until impaired, then drops by the impairment amount. A company with $5B in goodwill on $8B total assets is 62.5% goodwill \u2014 that's a lot of acquisition premium at risk.",
      cashFlow: "Zero cash impact. Amortization and impairment charges are non-cash \u2014 they add back to CFO in the reconciliation. This is why serial acquirers love non-GAAP metrics that exclude amortization: the cash was spent when the deal closed (investing activities), but the P&L hit from amortization is ongoing.",
    },
  },
  {
    code: "ASC 360",
    title: "Property, Plant, and Equipment",
    effective: "Original: Mar 1995 (SFAS 121, later SFAS 144). Codified into ASC 360.",
    replaced: "Replaced ad-hoc impairment practices. Before SFAS 121, there was no consistent standard for when to write down long-lived assets.",
    goal: "Establish consistent framework for recognizing impairment of long-lived assets and for classifying assets as held-for-sale. Ensure carrying values don't exceed recoverable amounts.",
    framework: "Two-step impairment test: (1) Recoverability test \u2014 if undiscounted future cash flows < carrying value, asset is impaired. (2) Measurement \u2014 write down to fair value (discounted cash flows or market value). Assets held-for-sale: carried at lower of carrying value or fair value minus cost to sell; depreciation stops. Useful life and depreciation method must reflect the pattern of economic benefit consumption.",
    keyJudgments: "Useful life estimates (directly drives depreciation expense), triggering event identification (management has discretion on when to test), undiscounted cash flow projections for recoverability test, asset grouping (testing at too high a level can mask impaired assets), held-for-sale classification timing.",
    relevance: "Capital-intensive businesses (data centers, telcos, manufacturing, energy). Useful life choices directly impact margins \u2014 a 25-year vs. 15-year life on a $500M data center is a $16.7M/yr difference. Watch for depreciation/gross PP&E ratios vs. peers and CIP balances growing without impairment testing.",
    example: "A data center company builds a $500M facility. Management chooses a 25-year useful life \u2014 depreciation is $20M/year. A peer with an identical facility uses 15 years \u2014 depreciation is $33.3M/year. That's a $13.3M annual margin difference from one accounting estimate alone. Now suppose the anchor tenant leaves after 5 years. Is the facility impaired? Step 1 (recoverability): management projects $30M/year in undiscounted cash flows for the remaining 20 years = $600M, which exceeds the ~$400M carrying value \u2014 passes, no impairment. But those projections assume they re-lease at current rates within 6 months. If you use more conservative assumptions (re-lease at 70% rate, 18-month vacancy), undiscounted cash flows drop to $350M \u2014 now it fails, and you go to Step 2: write it down to fair value, maybe $300M, taking a $100M charge. The useful life choice and the re-leasing assumptions are where the real judgment lives.",
    financialImpact: {
      incomeStatement: "Depreciation expense flows through COGS or operating expenses, directly reducing operating income. Longer useful life = lower annual depreciation = higher margins. An impairment charge is a one-time hit to operating income. Both are non-cash but directly affect reported profitability.",
      balanceSheet: "PP&E (net) decreases each year by depreciation. Construction-in-progress (CIP) sits as an asset during build-out \u2014 no depreciation until the asset is 'placed in service.' Impairment reduces PP&E by the write-down amount. Held-for-sale reclassification moves assets to current and stops depreciation.",
      cashFlow: "Depreciation is non-cash \u2014 adds back to CFO. The actual cash was spent during construction (CapEx in investing activities). This is why capital-intensive companies can show strong CFO despite low net income: depreciation is a large non-cash add-back. Impairment is also non-cash. The real cash flow question is CapEx vs. CFO \u2014 free cash flow.",
    },
  },
  {
    code: "ASC 805",
    title: "Business Combinations",
    effective: "SFAS 141R issued Dec 2007, effective Dec 2008. Major update: ASU 2021-08 (issued Oct 2021, effective Dec 2022).",
    replaced: "Replaced pooling-of-interests method and the old SFAS 141. Under pooling, acquisitions could be recorded at historical book values \u2014 no goodwill, no fair value adjustments.",
    goal: "Require acquisition method for all business combinations. All assets acquired and liabilities assumed measured at fair value on acquisition date. Creates transparency about what acquirers are actually paying for.",
    framework: "Acquisition method: (1) Identify the acquirer. (2) Determine acquisition date. (3) Recognize and measure identifiable assets, liabilities, and any non-controlling interest at fair value. (4) Recognize goodwill (excess of consideration over net identifiable assets) or a bargain purchase gain. Contingent consideration measured at fair value and remeasured each period. Acquisition costs expensed as incurred (not capitalized). In-process R&D recognized as an asset.",
    keyJudgments: "Fair value of identified intangibles (customer relationships, technology, trade names) \u2014 determines how much goes to amortizable intangibles vs. goodwill. Contingent earnout valuation and subsequent remeasurement. Measurement period adjustments (up to 1 year post-acquisition). Determining if a transaction is a business combination vs. an asset acquisition (matters for tax and accounting treatment).",
    relevance: "Critical for M&A-heavy sectors (tech, healthcare, PE-backed companies). The split between goodwill (not amortized) and identifiable intangibles (amortized) directly impacts future earnings. Companies can influence this allocation. Watch for acquirers consistently allocating more to goodwill (extends earnings impact) vs. finite-life intangibles.",
    example: "Company A buys Company B for $1B. B has $200M in net identifiable assets (cash, receivables, equipment minus liabilities). The remaining $800M gets split between identifiable intangibles and goodwill. Scenario 1 (aggressive): allocate $200M to intangibles (customer relationships over 15 years) and $600M to goodwill. Annual amortization: $13.3M. Scenario 2 (conservative): allocate $500M to intangibles ($300M customer relationships over 10 years + $200M technology over 5 years) and $300M to goodwill. Annual amortization: $70M. Same deal, same price, but Scenario 2 hits earnings $56.7M harder per year. This is why you see PE-backed companies and serial acquirers love goodwill \u2014 it never hits the P&L unless impaired. When you see 'Adjusted EBITDA excludes amortization of acquired intangibles,' the company is trying to undo the impact of this allocation. The contingent earnout adds another layer: if Company A promises B's founders $100M if revenue hits $50M in Year 2, that $100M must be fair-valued at close (say $60M) and remeasured each quarter. If the target crushes it, the earnout liability increases and hits earnings as a loss.",
    financialImpact: {
      incomeStatement: "Acquisition costs (banker fees, legal, diligence) expensed immediately \u2014 not capitalized. Ongoing amortization of identified intangibles hits operating income each year. Contingent earnout remeasurement gains/losses flow through earnings. Revenue from the target consolidated from acquisition date forward.",
      balanceSheet: "Goodwill and intangible assets appear as long-term assets. Contingent earnout is a liability (remeasured quarterly). If acquisition is stock-for-stock, equity increases; if cash, assets decrease. Measurement period adjustments (up to 1 year) can retroactively adjust the allocation between goodwill and intangibles.",
      cashFlow: "Cash paid for acquisition shows in investing activities (a single large outflow). Earnout payments when triggered are also investing outflows. Amortization of intangibles adds back to CFO (non-cash). Key insight: a $1B all-cash acquisition shows as a $1B investing outflow, but subsequent intangible amortization improves CFO through add-backs \u2014 so CFO looks better after the deal even though cash was spent.",
    },
  },
  {
    code: "ASC 810",
    title: "Consolidation",
    effective: "Various updates. Key: ASU 2015-02 (issued Feb 2015, effective Dec 2015) reformed VIE analysis.",
    replaced: "Modernized consolidation framework post-Enron. Before reforms, Enron used thousands of SPEs to hide debt off-balance sheet.",
    goal: "Determine which entities a company must consolidate in its financial statements. Prevent off-balance sheet schemes where economic risk is retained but liabilities are hidden.",
    framework: "Two models: (1) Voting interest model \u2014 consolidate if >50% voting interest (traditional majority ownership). (2) Variable interest entity (VIE) model \u2014 consolidate if the company is the primary beneficiary (has power to direct activities AND obligation to absorb losses/right to receive benefits). Primary beneficiary analysis considers both power and economics. VIEs include SPEs, certain joint ventures, and entities where voting rights don't determine control.",
    keyJudgments: "Whether an entity is a VIE, who is the primary beneficiary when multiple parties have involvement, related-party considerations, kick-out rights and participating rights analysis, reconsideration events that trigger re-evaluation.",
    relevance: "Private equity, structured finance, real estate (JVs), and any company with complex entity structures. Off-balance sheet VIEs can hide significant liabilities. Watch for footnote disclosures about unconsolidated VIEs, maximum loss exposure, and entities where consolidation conclusions changed.",
    example: "A real estate company creates a joint venture with a partner to develop a $200M property. The company owns 40% equity and manages the project (power to direct activities). The partner owns 60% and provides most of the capital. Question: who consolidates? Under the voting interest model, the 60% partner would consolidate. But if this JV is a VIE (which it likely is because voting rights don't align with economics), you look at who is the primary beneficiary: who has (1) power to direct the most significant activities AND (2) obligation to absorb losses / right to receive benefits? The 40% manager directs leasing, construction, and operations (power), and absorbs losses through their equity plus a guarantee. Result: the 40% owner consolidates \u2014 the full $200M in assets and $120M in debt show up on their balance sheet, even though they only own 40%. If they can structure it so they're NOT the primary beneficiary, all that debt stays off their balance sheet and shows up only as a footnote. This is exactly what Enron did thousands of times.",
    financialImpact: {
      incomeStatement: "If consolidated: 100% of the VIE's revenue and expenses appear on the parent's P&L, with the partner's share backed out as 'non-controlling interest' at the bottom. If NOT consolidated: only the parent's equity pickup (their % share of net income) appears as a single line item. The difference in reported revenue can be enormous.",
      balanceSheet: "If consolidated: 100% of the VIE's assets and liabilities appear on the parent's balance sheet, with NCI in the equity section. If unconsolidated: only an equity method investment (one line in assets). The debt impact is the key \u2014 $120M in JV debt either appears on the balance sheet or is buried in footnotes.",
      cashFlow: "If consolidated: all of the VIE's cash flows appear in the parent's statement. If unconsolidated: only distributions received show up (operating activities). The difference matters for leverage analysis \u2014 consolidated debt service obligations are visible; unconsolidated ones require footnote mining.",
    },
  },
  {
    code: "ASC 815",
    title: "Derivatives and Hedging",
    effective: "SFAS 133 issued Jun 1998, effective Jun 2000. Major overhaul: ASU 2017-12 (effective Jan 2019).",
    replaced: "Before SFAS 133, derivatives were largely invisible in financial statements \u2014 could represent massive exposures with no balance sheet recognition.",
    goal: "Require all derivatives on the balance sheet at fair value. The 2017 reform simplified hedge accounting to encourage companies to align accounting with actual risk management. Reduced the cost of hedging by eliminating ineffectiveness testing for cash flow and net investment hedges.",
    framework: "All derivatives recognized at fair value on balance sheet. Changes in fair value flow through: (1) Earnings (trading/speculative). (2) OCI (effective portion of cash flow hedges, net investment hedges). (3) Adjusted basis of hedged item (fair value hedges). Hedge accounting requires formal designation and documentation. Three hedge types: fair value, cash flow, and net investment. ASU 2017-12 allows the full change in fair value of hedging instrument in OCI (no ineffectiveness in P&L for qualifying hedges).",
    keyJudgments: "Whether hedge accounting criteria are met, fair value measurement of complex derivatives (Level 3), hedge effectiveness assessment, credit valuation adjustments (CVA/DVA), embedded derivative identification and bifurcation.",
    relevance: "Banks, energy companies, airlines (fuel hedging), and any company with FX or interest rate exposure. Complex derivative portfolios can obscure true economic exposure. Watch for large Level 3 fair value assets/liabilities, frequent hedge de-designations, and OCI volatility that eventually hits earnings.",
    example: "An airline expects to buy 100M gallons of jet fuel over the next year. To lock in costs, they enter into fuel swaps at $2.50/gallon. They designate these as cash flow hedges under ASC 815. At quarter-end, fuel prices drop to $2.20 \u2014 the swaps are now underwater by $30M ($0.30 x 100M gallons). With hedge accounting: that $30M loss goes to OCI (other comprehensive income) on the balance sheet, NOT through the P&L. As the airline actually buys fuel each month, the loss reclassifies from OCI to earnings, matched against the cheaper fuel cost. Net effect on earnings: smooth. Without hedge accounting: the $30M loss hits earnings immediately, even though the airline hasn't bought the fuel yet. Next quarter, if prices reverse, you get a $30M gain. The P&L whipsaws quarter to quarter even though the economic exposure is hedged. This is why companies fight to qualify for hedge accounting \u2014 it prevents earnings volatility from hedges that are actually working as intended. When a company 'de-designates' a hedge, all the accumulated OCI balance gets dumped into earnings at once.",
    financialImpact: {
      incomeStatement: "With hedge accounting: earnings are smooth \u2014 the hedge gain/loss is matched to the hedged item in the same period. Without hedge accounting: full mark-to-market volatility flows through earnings every quarter. De-designation dumps accumulated OCI into earnings as a one-time hit.",
      balanceSheet: "All derivatives appear at fair value as assets or liabilities (no exceptions). Hedge gains/losses for cash flow hedges accumulate in Accumulated OCI (AOCI) within equity. This can create large swings in total equity without touching earnings. Watch the AOCI balance \u2014 it's a reservoir of gains/losses that will eventually flow through the P&L.",
      cashFlow: "Derivative settlements are classified based on the hedged item: fuel hedge settlements go to operating (matching fuel purchases), interest rate hedge settlements go to operating or financing. Premium payments on options are operating outflows. The cash flow statement is often the cleanest view because it shows actual settlements regardless of hedge accounting treatment.",
    },
  },
  {
    code: "ASC 820",
    title: "Fair Value Measurement",
    effective: "SFAS 157 issued Sep 2006, effective Nov 2007. Updates: ASU 2011-04 aligned with IFRS 13.",
    replaced: "Before SFAS 157, fair value was used throughout GAAP but defined differently in different standards. No consistent framework or disclosure requirements.",
    goal: "Single definition of fair value, consistent framework for measurement, and enhanced disclosures. Fair value = exit price (what you'd receive to sell an asset or pay to transfer a liability) in an orderly transaction between market participants.",
    framework: "Three-level hierarchy: Level 1 \u2014 quoted prices in active markets (stocks, liquid bonds). Level 2 \u2014 observable inputs other than Level 1 (yield curves, comparable transactions, matrix pricing). Level 3 \u2014 unobservable inputs (management models, DCF with internal assumptions). Companies must maximize observable inputs and minimize unobservable inputs. Requires disclosure of transfers between levels and Level 3 rollforward.",
    keyJudgments: "Level classification (Level 2 vs. Level 3 boundary is subjective), valuation techniques for Level 3 (DCF assumptions, volatility estimates, credit adjustments), determining whether a market is 'active' or 'inactive' (affects whether quoted prices are used directly), blockage factors.",
    relevance: "Banks (loan portfolios, structured products), insurance (reserves), PE/hedge funds (portfolio valuations), and any company with significant intangibles or illiquid investments. Level 3 assets are self-marked \u2014 management controls the valuation inputs. Watch for growing Level 3 balances, transfers from Level 2 to Level 3, and Level 3 gains as a % of net income.",
    example: "A bank holds three assets: (1) 10,000 shares of Apple \u2014 Level 1, just look at the stock price, no judgment. (2) A corporate bond that doesn't trade often but similar bonds do \u2014 Level 2, you use yield curves and comparable transactions to estimate fair value. (3) A structured credit tranche tied to a pool of commercial real estate loans \u2014 Level 3, there's no market price and no comparable, so the bank builds a DCF model with assumptions about default rates, recovery rates, prepayment speeds, and discount rates. The bank says this tranche is worth $50M. But if they tweak the default rate from 3% to 5% and the discount rate from 8% to 10%, the value drops to $35M. That's a $15M difference from assumptions nobody outside the bank can verify. Now imagine the bank has $2B in Level 3 assets and reports $500M in net income \u2014 if Level 3 gains contributed $100M of that, 20% of earnings are based on management's own marks. This is exactly the problem that blew up in 2008: banks held massive Level 3 positions in mortgage-backed securities and marked them based on models that assumed housing prices wouldn't fall nationally.",
    financialImpact: {
      incomeStatement: "Fair value changes on trading assets/liabilities flow directly through earnings (gains/losses). For available-for-sale securities, unrealized gains/losses go to OCI (not earnings) until sold. Level 3 gains are particularly scrutinized because they're based on management's own models.",
      balanceSheet: "Assets and liabilities carried at fair value with Level 1/2/3 classification disclosed in footnotes. Level 3 requires a full rollforward (beginning balance, purchases, sales, gains/losses, transfers in/out). Growing Level 3 balances mean more of the balance sheet is based on internal models rather than market prices.",
      cashFlow: "Fair value changes are non-cash and adjust out of CFO (unrealized gains subtracted, unrealized losses added back). Actual cash only moves when positions are settled or sold. This is why CFO can diverge significantly from net income for banks and funds with large mark-to-market portfolios.",
    },
  },
  {
    code: "ASC 326",
    title: "Credit Losses (CECL)",
    effective: "Large public: Jan 2020. Smaller public: Jan 2023. Private: Jan 2023.",
    replaced: "Replaced the 'incurred loss' model under ASC 450 (SFAS 5). Under old rules, you only recognized credit losses when loss was 'probable' \u2014 backward-looking.",
    goal: "Shift from incurred-loss (recognize when loss is probable) to expected-loss (recognize lifetime expected credit losses at origination). The 2008 financial crisis exposed the 'too little, too late' problem \u2014 banks recognized losses after portfolios had already deteriorated significantly.",
    framework: "CECL model: estimate lifetime expected credit losses on financial assets measured at amortized cost (loans, HTM debt securities, receivables, lease receivables). Loss allowance recognized at origination based on historical experience, current conditions, and reasonable/supportable forecasts. No threshold for recognition \u2014 Day 1 allowance required. Available-for-sale debt securities use a separate model (impairment through allowance rather than direct write-down, reversible).",
    keyJudgments: "Forecast period and methodology (how far into the future can you reasonably forecast?), economic scenario weighting (probability of recession vs. baseline vs. optimistic), reversion to historical mean assumptions, portfolio segmentation, qualitative adjustment factors (Q-factors). CECL gives management enormous discretion in the forecast period and assumptions.",
    relevance: "Banks, credit card companies, any company with significant receivables portfolios. CECL made reserves more volatile and pro-cyclical \u2014 reserves spike at cycle turns when forecasts darken. Watch for banks with materially lower CECL reserves than peers for similar loan portfolios, frequent methodology changes, and optimistic economic scenario weightings.",
    example: "A bank makes a $10M commercial real estate loan on Day 1. Old rules (incurred loss): no reserve needed because nothing has gone wrong yet \u2014 the borrower is current, no loss is 'probable.' Reserve stays at zero until the borrower actually misses payments. New rules (CECL): on Day 1, the bank must estimate lifetime expected losses. They look at historical CRE default rates (say 2% over the loan's life), current conditions (office vacancy rising), and a forecast (mild recession likely in Year 2). Result: they book a $250K reserve immediately, which hits earnings as a provision expense on the day the loan is made. If the economy worsens next quarter, they re-forecast: recession probability goes from 30% to 60%, lifetime expected loss jumps to 5%, and the reserve increases to $500K \u2014 another $250K provision expense. The loan is still performing, the borrower hasn't missed a payment, but CECL forces the bank to recognize losses based on where the economy is heading, not where it's been. This is why bank earnings got crushed in Q1 2020 \u2014 CECL reserves spiked by tens of billions across the industry as COVID forecasts darkened, even before actual defaults materialized.",
    financialImpact: {
      incomeStatement: "Provision for credit losses expense hits the P&L when reserves increase. This is the single biggest earnings driver for banks \u2014 provision expense can swing from $500M in a good year to $5B in a downturn, overwhelming net interest income changes. Reserve releases in good times boost earnings.",
      balanceSheet: "Allowance for credit losses (contra-asset) reduces the net loan balance. A $10M loan with a $250K CECL allowance is carried at $9.75M net. The allowance is a management estimate of lifetime losses \u2014 higher allowance = more conservative. Compare allowance-to-total-loans ratio across peer banks for the same loan types.",
      cashFlow: "Provision expense is non-cash \u2014 adds back to CFO. Actual cash loss only occurs on charge-offs (when the bank writes off the loan as uncollectible). Recoveries on previously charged-off loans are cash inflows. The gap between provision (P&L) and charge-offs (cash) tells you whether the bank is building or releasing reserves.",
    },
  },
  {
    code: "ASC 740",
    title: "Income Taxes",
    effective: "SFAS 109 issued Feb 1992, effective Dec 1992. Continuously updated.",
    replaced: "Replaced SFAS 96 and established the asset-and-liability method for deferred taxes.",
    goal: "Recognize the tax consequences of transactions in the same period as the transactions themselves, not when taxes are paid. Deferred tax assets and liabilities represent future tax effects of temporary differences between book and tax basis.",
    framework: "Deferred tax assets (DTA): future tax benefits from deductible temporary differences, NOL carryforwards, tax credit carryforwards. Deferred tax liabilities (DTL): future tax obligations from taxable temporary differences. DTAs require a valuation allowance if 'more likely than not' (>50%) that some or all won't be realized. Uncertain tax positions: two-step process \u2014 (1) recognition threshold (more likely than not to be sustained), (2) measurement (largest amount with >50% probability of being realized).",
    keyJudgments: "Valuation allowance on DTAs (management assesses future profitability, tax planning strategies), indefinite reinvestment assertion on foreign earnings, uncertain tax position (UTP) reserves, transfer pricing, R&D credit eligibility, state tax apportionment.",
    relevance: "Effective tax rate is one of the easiest levers for earnings management. Releasing valuation allowances on DTAs creates large one-time earnings boosts. Watch for: ETR consistently below statutory rate without clear explanation, sudden VA releases, growing UTP reserves, and companies with large DTAs relative to pre-tax income.",
    example: "A tech company has $500M in net operating loss (NOL) carryforwards from years of pre-profit startup losses. At a 21% tax rate, that's a $105M deferred tax asset (DTA) \u2014 future tax savings. But will they ever be profitable enough to use it? If management concludes 'more likely than not' they won't fully use it, they must record a valuation allowance (VA) against the DTA. Say they put a $60M VA, so the net DTA on the balance sheet is $45M. Two years later, the company turns profitable. Management decides they'll now use all the NOLs. They release the $60M VA \u2014 that $60M flows through as a negative tax provision, boosting net income by $60M in a single quarter. Pre-tax income was $80M, but reported net income is $140M because of the VA release. Earnings just jumped 75% with no change in the actual business. This is the classic 'flip to profitability' earnings boost \u2014 it's real (the tax savings exist) but it's a one-time accounting event that inflates that quarter's earnings and makes growth comps look amazing. Companies turning profitable for the first time (like many SaaS companies) almost always get this one-time boost.",
    financialImpact: {
      incomeStatement: "Tax provision (expense) is the P&L line. VA release shows up as a negative provision or tax benefit \u2014 net income spikes. The effective tax rate (ETR) drops dramatically in the VA release quarter (can even go negative). Ongoing, NOL usage means lower cash taxes and lower ETR until the NOLs are consumed.",
      balanceSheet: "DTA sits in long-term assets (net of VA). When VA is released, DTA increases and equity jumps by the same amount. DTLs appear when book income exceeds tax income (e.g., accelerated depreciation for tax). Net DTA vs. DTL position tells you the directional relationship between book and tax reporting.",
      cashFlow: "Deferred tax changes are non-cash adjustments within CFO. The real cash benefit is lower actual tax payments \u2014 visible in the cash taxes paid line (supplemental disclosure). A company with $500M in NOLs pays minimal cash taxes for years, even while reporting tax expense on the P&L for the DTA amortization.",
    },
  },
  {
    code: "ASC 450/ASC 460",
    title: "Contingencies and Guarantees",
    effective: "ASC 450: Original SFAS 5 (1975). ASC 460: FASB Interpretation 45 (2003).",
    replaced: "ASC 450 codified long-standing contingency accounting. ASC 460 added recognition requirements for guarantee obligations that previously had limited disclosure.",
    goal: "Ensure companies recognize or disclose probable losses and commitments. 'Probable and estimable' threshold determines when a loss contingency must be accrued vs. disclosed. Guarantees must be recognized at fair value when issued.",
    framework: "Loss contingencies: accrue if probable and reasonably estimable, disclose if reasonably possible, ignore if remote. Gain contingencies: never accrue (conservatism), disclose if probable. Guarantees (ASC 460): recognize at fair value at inception (product warranties, indemnifications, financial guarantees). Litigation reserves: accrue best estimate within a range; if no best estimate, accrue the low end and disclose the range.",
    keyJudgments: "Whether a loss is 'probable' vs. 'reasonably possible' (determines accrual vs. disclosure only), estimating the range of loss (especially in litigation), evaluating guarantee obligations that may never be triggered, assessing environmental and product liability reserves.",
    relevance: "Litigation-heavy industries (pharma, tech patent disputes, financial services). Companies minimize disclosed ranges and reserves to avoid market impact. Watch for boilerplate 'cannot estimate' disclosures on significant litigation, reserves that seem small relative to claimed damages, and sudden large reserve increases that suggest prior understatement.",
    example: "A pharma company faces a lawsuit alleging its drug caused harm to 5,000 patients. Plaintiff attorneys demand $2B. The company's lawyers assess the situation: Is a loss probable? They think yes \u2014 the evidence is strong. Can they estimate it? They estimate a range of $300M to $800M, with $500M as the most likely outcome. Under ASC 450: they accrue $500M (best estimate within the range) as a litigation reserve on the balance sheet and disclose the $300M-$800M range in the footnotes. If they couldn't identify a 'best estimate,' they'd accrue the low end ($300M) and disclose the range. Now here's the game: what if the company's lawyers say the loss is 'reasonably possible' instead of 'probable'? Then NO accrual is required \u2014 they just disclose the range in a footnote. The difference between 'probable' and 'reasonably possible' is entirely a judgment call, and it determines whether $500M hits the P&L or just appears as a footnote that most investors skip. This is why you see pharma companies carry surprisingly small litigation reserves relative to the headline risk \u2014 they classify as many cases as 'reasonably possible' as they can defend.",
    financialImpact: {
      incomeStatement: "Accrual of a loss contingency (e.g., $500M litigation reserve) hits operating expenses as a one-time charge. If the case settles for less, the excess reserve is released as a gain. If it settles for more, additional expense is recognized. Guarantee obligations recognized at inception also flow through the P&L.",
      balanceSheet: "Accrued liabilities increase by the reserve amount ($500M). If only 'reasonably possible,' no liability appears \u2014 it's footnote-only, which is why the balance sheet can look clean despite massive pending litigation. Guarantee liabilities appear when guarantees are issued and decline as the guarantee period expires.",
      cashFlow: "The accrual is non-cash (adds back to CFO). Actual cash outflow occurs only when the settlement is paid \u2014 this can be years after the accrual. The timing gap means CFO in the accrual year looks worse than cash reality (large expense, no cash out), while CFO in the settlement year looks worse than P&L (large cash out, no new expense). Watch the 'legal settlements' line in operating or financing activities.",
    },
  },
  {
    code: "ASC 280",
    title: "Segment Reporting",
    effective: "Original: Jun 1997 (SFAS 131). Major update: ASU 2023-07 (Nov 2023, effective Dec 2024).",
    replaced: "Replaced SFAS 14's industry-segment approach with the management approach (report segments as management sees the business). ASU 2023-07 adds significant expense disclosure requirements.",
    goal: "Give investors visibility into how management views the business internally. The 'management approach' means segments align with how the CODM (Chief Operating Decision Maker) evaluates performance and allocates resources. The 2023 update requires disclosure of significant segment expenses and the CODM's identity and title.",
    framework: "Operating segments defined by: (1) engaging in business activities that earn revenue/incur expenses, (2) regularly reviewed by the CODM, (3) discrete financial information is available. Aggregation criteria allow combining segments with similar economic characteristics. ASU 2023-07 requires: disclosure of significant segment expenses regularly provided to the CODM, reconciliation of segment expenses to total, identification of CODM by title, and interim segment disclosures previously only required annually.",
    keyJudgments: "CODM identification, segment aggregation decisions (combining segments hides underperformers), what constitutes 'regularly reviewed' discrete financial information, whether to aggregate segments with 'similar economic characteristics' (vague standard).",
    relevance: "Conglomerates and diversified companies use segment aggregation to hide underperforming divisions. Single-segment reporting by a diversified company is a red flag. ASU 2023-07 will force more expense transparency starting 2024/2025. Watch for segment changes around acquisitions/divestitures and compare segment profitability to consolidated metrics.",
    example: "A company has three business lines: Cloud (growing 30%, 25% margins), Legacy Software (declining 10%, 40% margins), and Services (flat, 8% margins). If they report as one segment, investors see blended revenue growth of ~10% and ~22% margins \u2014 looks like a healthy, growing business. If they report three segments, investors immediately see that Cloud is subsidizing a declining legacy business, and Services barely covers its costs. Management argues Cloud and Legacy have 'similar economic characteristics' (both are software!) and aggregates them into a single 'Software' segment. Now Legacy's decline is hidden inside a segment that still shows growth. ASU 2023-07 makes this harder by requiring disclosure of significant segment expenses the CODM actually reviews. If the CEO gets a report every month showing Cloud, Legacy, and Services separately, that's evidence of three operating segments \u2014 the company has to explain why it aggregated. The new rule also requires naming the CODM by title, so investors know exactly who is making segment decisions.",
    financialImpact: {
      incomeStatement: "Segment reporting doesn't change total consolidated revenue or income \u2014 it changes how much detail you see. Each segment discloses revenue, a measure of profit/loss, and (under ASU 2023-07) significant expenses. The key: segment margins expose which parts of the business are actually making money and which are subsidized.",
      balanceSheet: "Total segment assets are disclosed, showing capital allocation across business lines. Comparing assets-to-revenue or assets-to-profit by segment reveals capital efficiency. Goodwill is allocated to reporting units (often aligned with segments), so segment structure determines where impairment is tested.",
      cashFlow: "Segment-level cash flow is NOT required under GAAP (only IFRS requires it). This is a major gap \u2014 you can see segment profits but not segment cash generation. Workaround: compare segment depreciation + capex disclosures (if provided) to infer which segments are cash-generating vs. cash-consuming.",
    },
  },
];

// ─── ACCOUNTING TOPICS DATA ───

const TOPICS = {
  ascStandards: {
    label: "ASC Standards",
    icon: "\uD83D\uDCD6",
    type: "reference",
    category: "Key GAAP Standards",
    color: "#8B5CF6",
    tagline: "Quick reference for the ASC standards that matter most in credit and equity research",
  },
  revenueRecognition: {
    label: "Revenue Recognition",
    icon: "\uD83D\uDCCA",
    category: "ASC 606 / Top Line",
    color: "#3B82F6",
    tagline: "The single most common area of financial statement manipulation \u2014 when and how much revenue to recognize",
    theRule: "ASC 606 (effective 2018) established a 5-step model: (1) Identify the contract, (2) Identify performance obligations, (3) Determine the transaction price, (4) Allocate the price to obligations, (5) Recognize revenue when/as obligations are satisfied. Revenue is recognized when control transfers to the customer \u2014 either at a point in time or over time. The standard replaced industry-specific guidance with a single framework, but its principles-based nature creates significant room for judgment, especially around performance obligation identification, variable consideration estimates, and the over-time vs. point-in-time determination.",
    manipulation: "Companies manipulate revenue recognition by: (1) Recognizing revenue before performance obligations are satisfied \u2014 shipping products customers didn't order, booking revenue on unsigned contracts, or using aggressive percentage-of-completion estimates on long-duration contracts. (2) Channel stuffing \u2014 pushing excess inventory to distributors at quarter-end with side agreements (right of return, extended payment terms) that should preclude revenue recognition. (3) Bill-and-hold \u2014 recognizing revenue on goods that haven't shipped by claiming the customer requested delayed delivery. (4) Round-tripping \u2014 two companies sell to each other to inflate both top lines. (5) Gross vs. net \u2014 reporting the full transaction value instead of just the commission/fee when the company is acting as an agent rather than principal. (6) Contract modification abuse \u2014 restructuring contracts to accelerate recognition of deferred revenue.",
    redFlags: [
      "Revenue growing significantly faster than cash from operations or receivables growing faster than revenue (widening gap between accrual earnings and cash)",
      "Large spike in revenue in the final weeks of a quarter, especially if pattern repeats \u2014 classic channel stuffing indicator",
      "Days sales outstanding (DSO) increasing quarter over quarter without a business explanation (customers not actually paying)",
      "Unusual increase in bill-and-hold arrangements or consignment inventory disclosed in footnotes",
      "Deferred revenue declining while reported revenue grows \u2014 company may be pulling forward future revenue",
      "Frequent changes to revenue recognition policies or restatements of prior periods",
      "Related-party revenue or revenue from entities in jurisdictions with limited transparency",
      "Percentage-of-completion estimates consistently revised upward late in contracts",
    ],
    caseStudies: [
      {
        company: "Luckin Coffee",
        year: "2019\u20132020",
        amount: "$310M fabricated revenue",
        scheme: "Luckin, China's challenger to Starbucks, fabricated approximately $310M in sales from Q2\u2013Q4 2019 \u2014 roughly 40% of reported revenue. The COO and subordinates created fake customer voucher purchases through related parties, inflated order counts, and manufactured transactions that never occurred. They also inflated costs proportionally to make margins look consistent and avoid detection through margin analysis. The company used bulk purchases through third-party accounts to simulate demand, with funds round-tripping through related entities.",
        unraveled: "Anonymous short-seller report (later attributed to Muddy Waters, who received an anonymous 89-page dossier in January 2020) alleged fabricated sales backed by thousands of hours of store-level video surveillance, receipt tracking, and customer traffic analysis. The report showed per-store sales were inflated by 69\u201388%. Luckin initially denied the allegations, but its board formed a special committee in April 2020 that confirmed the COO fabricated transactions. The stock crashed 80% in a single day (April 2, 2020) and was delisted from NASDAQ in June 2020.",
        aftermath: "Luckin paid a $180M SEC settlement (December 2020). COO Jian Liu and CEO Jenny Zhiya Qian were terminated. The company went through restructuring, cleaned up operations, and remarkably survived \u2014 it now operates 31,000+ stores in China (surpassing Starbucks) under new management. Traded OTC, then relisted on OTC Pink Sheets. The fraud was unusual in that the company actually had a viable underlying business.",
      },
      {
        company: "Xerox",
        year: "1997\u20132000",
        amount: "$6.4B revenue overstatement (~$3B accelerated, remainder via other maneuvers)",
        scheme: "Xerox accelerated revenue recognition on long-term copier leases, recognizing upfront what should have been spread over 3\u20135 year lease terms. When a customer signed a lease for a copier, Xerox would estimate the total lease value and recognize a large portion immediately as 'equipment sale' revenue rather than ratably as lease income. They also manipulated 'cookie jar' reserves \u2014 setting aside excess reserves in good quarters and releasing them to boost revenue in weak quarters. Finance executives used at least 11 different accounting maneuvers across geographies (particularly in Mexico, Brazil, and Europe).",
        unraveled: "SEC investigation beginning in 2000, prompted by internal whistleblowers and auditor concerns. KPMG (Xerox's auditor) had flagged issues but ultimately signed off on the financials. The SEC found that Xerox used accounting maneuvers to inflate revenue by $6.4B and pre-tax earnings by $1.5B over 4 years. The scale was staggering \u2014 roughly 36% of equipment revenue in some periods was improperly accelerated.",
        aftermath: "Xerox paid a $10M SEC penalty (2002) and restated financials for 1997\u20132000. Six senior executives paid $22M in penalties. KPMG paid $22.5M to settle SEC charges for improper auditing and separately paid $80M to settle shareholder lawsuits. Xerox shareholders lost billions as the stock declined ~90% from its 1999 peak. The case became a textbook example of lease revenue acceleration.",
      },
      {
        company: "Sunbeam (Al Dunlap)",
        year: "1996\u20131998",
        amount: "$60M+ inflated revenue",
        scheme: "CEO Al 'Chainsaw Al' Dunlap orchestrated multiple revenue manipulation schemes simultaneously: (1) Bill-and-hold sales \u2014 Sunbeam 'sold' grills and other seasonal products to retailers months before they were needed, warehousing them at third-party locations and recognizing revenue immediately. In Q1 1998, $35M of grill sales were bill-and-hold. (2) Channel stuffing \u2014 offered deeply discounted 'early buy' programs with guaranteed right of return and extended payment terms, pushing Q1 products into Q4 to inflate year-end numbers. (3) Cookie jar reserves \u2014 during the 1996 restructuring, Dunlap created excessive reserves ($18.7M in restructuring reserves) that were later released to inflate income. (4) Revenue from incomplete sales \u2014 booking revenue on consignment shipments.",
        unraveled: "The bill-and-hold scheme created visible distortions: accounts receivable ballooned (DSO jumped from 43 to 77 days), warehouse costs at third-party facilities spiked, and Q1 1998 grills were literally sitting in warehouses while Q2 'sales' collapsed. Barron's published a critical article in June 1998 questioning the revenue patterns. Arthur Andersen (auditor) belatedly raised concerns. The board fired Dunlap in June 1998 after discovering the full scope. Stock fell from $52 to under $7.",
        aftermath: "Sunbeam filed for bankruptcy in 2001. Dunlap paid $15M to settle shareholder class-action suits and was permanently barred by the SEC from serving as officer/director of a public company. Arthur Andersen paid $110M to settle shareholder suits (a precursor to Andersen's later Enron collapse). The case established bill-and-hold as a primary red flag for auditors and regulators.",
      },
      {
        company: "Qwest Communications",
        year: "1999\u20132002",
        amount: "$3.8B+ inflated revenue",
        scheme: "Qwest engaged in systematic round-tripping of fiber optic network capacity. They would 'sell' network capacity (IRUs \u2014 Indefeasible Rights of Use) to other telecom companies while simultaneously 'buying' equivalent capacity back from those same companies, generating revenue on both sides with no real economic substance. Qwest recognized immediate revenue on what were effectively long-term capacity swaps. They also improperly recognized revenue on equipment sales before delivery and booking recurring service revenue upfront.",
        unraveled: "SEC investigation launched in 2002 as the telecom bubble burst and investors began questioning the sustainability of reported revenue. Internal documents revealed that Qwest executives set aggressive revenue targets and pressured staff to close reciprocal capacity deals at quarter-end to hit numbers. Whistleblower complaints and internal audit concerns surfaced. The company disclosed it would need to restate $2.2B in revenue initially, later expanded to $3.8B.",
        aftermath: "CEO Joseph Nacchio was convicted of insider trading in 2007 (accused of selling $101M in stock while knowing revenue was fabricated; convicted on $52M across 19 of 42 counts) and sentenced to 6 years in federal prison. CFO Robin Szeliga pled guilty to insider trading. Qwest restated $3.8B in revenue across 1999\u20132002. The company never recovered its competitive position and was ultimately acquired by CenturyLink (now Lumen) in 2011 for $12.2B \u2014 a fraction of its peak $90B+ market cap.",
      },
    ],
    detection: [
      "Track DSO trends \u2014 rising DSO relative to revenue growth is the single strongest signal of revenue quality deterioration",
      "Compare revenue growth to cash from operations growth over multi-year periods \u2014 persistent divergence is a red flag",
      "Read the revenue recognition footnote carefully each quarter \u2014 watch for policy changes, new judgment disclosures, or expanded bill-and-hold language",
      "Check deferred revenue and backlog trends \u2014 a shrinking deferred revenue balance amid growing revenue suggests pull-forward",
      "Analyze channel inventory disclosures if available \u2014 rising distributor inventory levels signal stuffing",
      "Compare reported revenue to industry growth and peer performance \u2014 sustained outperformance vs. all peers deserves scrutiny",
      "Beneish M-Score: a composite model using DSO index, gross margin index, asset quality index, revenue growth index, and accruals to flag likely manipulators (>-1.78 = likely manipulation)",
    ],
  },

  expenseCapitalization: {
    label: "Expense Capitalization",
    icon: "\uD83D\uDCC8",
    category: "CapEx vs OpEx",
    color: "#8B5CF6",
    tagline: "Moving expenses from the income statement to the balance sheet \u2014 instant margin improvement at the cost of future write-offs",
    theRule: "GAAP draws a clear line between capital expenditures (assets with future economic benefit, recognized on the balance sheet and depreciated/amortized over useful life) and operating expenses (period costs expensed immediately on the income statement). Key standards: ASC 350 (intangibles/goodwill), ASC 360 (PP&E), ASC 340-40 (contract costs including sales commissions), ASC 985/ASC 350-40 (software development costs). The judgment call is whether a cost creates a long-lived asset or is consumed in the current period. Capitalizing a cost improves current-period EBITDA, operating income, and net income \u2014 the expense is simply deferred to future periods via depreciation/amortization.",
    manipulation: "Companies aggressively capitalize by: (1) Capitalizing routine operating costs as assets \u2014 the WorldCom playbook of reclassifying line costs (network access fees paid to local phone companies) as capital expenditures. (2) Capitalizing excessive internal labor and overhead into PP&E or software projects. (3) Over-capitalizing software development costs by stretching the 'technological feasibility' or 'application development' stage definitions. (4) Capitalizing sales commissions under ASC 340-40 with inflated estimated contract lives (a $100K commission amortized over 7 years vs. the actual 3-year customer life). (5) Capitalizing interest costs on projects that don't qualify. (6) Treating maintenance/repair CapEx as growth CapEx to inflate 'organic growth' narratives while understating sustaining capital needs.",
    redFlags: [
      "CapEx-to-revenue ratio rising without a clear growth investment program or management explanation",
      "Capitalized software costs growing as a percentage of total assets, especially if the company isn't primarily a software business",
      "Depreciation/amortization expense growing slower than the capitalized asset base \u2014 useful lives may be stretched",
      "Free cash flow consistently lower than net income (earnings exist on paper but not in cash)",
      "Large 'other assets' or 'deferred costs' line items growing on the balance sheet without clear explanation",
      "Commission asset (ASC 340-40) amortization period significantly longer than observable customer churn suggests",
      "Capitalized interest costs rising as a percentage of total interest expense",
    ],
    caseStudies: [
      {
        company: "WorldCom",
        year: "1999\u20132002",
        amount: "$3.8B capitalized operating expenses + $3.3B reserve manipulation = $11B total",
        scheme: "WorldCom's CFO Scott Sullivan directed staff to reclassify billions in ordinary operating expenses \u2014 primarily 'line costs' (fees paid to local telephone companies for network access, the largest single expense for a long-distance carrier) \u2014 as capital expenditures on the balance sheet. This was pure fabrication: the costs had no future economic benefit and should have been expensed immediately. The entries were booked as 'prepaid capacity' in capital accounts. Additionally, WorldCom manipulated accrual reserves, releasing reserves set aside for other purposes directly into revenue. The combined effect inflated reported EBITDA by approximately $11B. The reclassification was mechanically simple \u2014 journal entries moving costs between accounts \u2014 making it easy to execute but hard for external auditors to catch without testing the underlying nature of capitalized costs.",
        unraveled: "Internal auditor Cynthia Cooper and her team discovered the irregular capitalization entries in May\u2013June 2002 while conducting an audit of capital expenditures that was not originally authorized by CFO Sullivan (who tried to get her to delay the audit). Cooper found $3.8B in improperly capitalized line costs by tracing journal entries back to their source. She reported directly to the board's audit committee, bypassing Sullivan. Arthur Andersen (WorldCom's auditor) had failed to detect the fraud despite it being in the general ledger. The board fired Sullivan and announced the restatement on June 25, 2002.",
        aftermath: "WorldCom filed for Chapter 11 bankruptcy on July 21, 2002 \u2014 at the time the largest bankruptcy in US history ($107B in assets). CEO Bernie Ebbers was convicted of fraud and conspiracy in 2005 and sentenced to 25 years in prison (died in 2020 after early release). CFO Sullivan pled guilty and received 5 years. Cynthia Cooper was named TIME Person of the Year (2002) alongside Sherron Watkins (Enron) and Coleen Rowley (FBI). WorldCom emerged as MCI, later acquired by Verizon for $8.5B in 2006. The fraud directly accelerated passage of the Sarbanes-Oxley Act (2002).",
      },
      {
        company: "WeWork",
        year: "2017\u20132019",
        amount: "Not fraud per se, but $1.6B operating loss disguised through metrics",
        scheme: "WeWork didn't commit traditional accounting fraud, but aggressively manipulated perception through invented non-GAAP metrics. Their signature metric was 'Community Adjusted EBITDA' \u2014 which excluded not only interest, taxes, depreciation, and amortization, but also building and community-level operating expenses, stock-based compensation, and essentially all costs of running the business. By this metric, WeWork was profitable. By GAAP, it lost $1.6B in 2018 alone. They also capitalized significant buildout and design costs, stretched the useful life assumptions on leasehold improvements (amortizing over 15 years on 10-year leases), and used creative lease classification to minimize on-balance-sheet liabilities pre-ASC 842. Additionally, CEO Adam Neumann's related-party transactions (leasing buildings he personally owned back to WeWork) inflated both revenue and costs.",
        unraveled: "The S-1 filing in August 2019 for the planned IPO exposed the gap between the narrative and reality. Investors and journalists dismantled Community Adjusted EBITDA, revealing it excluded virtually all real costs. Scott Galloway, Matt Levine, and others publicly ridiculed the metric. SoftBank (lead investor at $47B valuation) struggled to find institutional investors at any price. The IPO was pulled in September 2019. Neumann was forced out as CEO. SoftBank wrote down ~$14B.",
        aftermath: "WeWork eventually went public via SPAC in October 2021 at ~$9B valuation (down from $47B). Filed for Chapter 11 bankruptcy in November 2023. Emerged in June 2024 as a private company. Community Adjusted EBITDA became a punchline and a cautionary tale about non-GAAP manipulation. SEC subsequently increased scrutiny of custom non-GAAP metrics in IPO filings. The lesson: when a company invents its own profitability metric, the GAAP numbers are probably ugly.",
      },
      {
        company: "Satyam Computer Services",
        year: "2003\u20132008",
        amount: "$1.5B fabricated cash + inflated revenue",
        scheme: "India's fourth-largest IT company, founder and chairman Ramalinga Raju systematically inflated revenue by creating fictitious customer invoices and fabricated bank statements showing cash balances that didn't exist. Over 5+ years, Satyam reported ~$1.04B in cash and bank balances that were entirely fictional. Revenue was inflated by 25% with ~7,500 fake invoices. Operating margins were reported at 24% vs. actual 3%. Raju also created 13,000 fictitious employees whose 'salaries' were siphoned to fund personal real estate acquisitions through related entities. The fabricated cash was the core of the scheme \u2014 without it, the inflated revenue would have been detectable through cash flow analysis.",
        unraveled: "Raju confessed in a letter to the board on January 7, 2009, calling it 'like riding a tiger, not knowing how to get off without being eaten.' A failed attempt to acquire Maytas Properties and Maytas Infra (both Raju family-owned companies \u2014 'Maytas' is 'Satyam' spelled backward) for $1.6B in December 2008 triggered investor backlash and board scrutiny that made continuation impossible. PricewaterhouseCoopers (auditor) had issued clean audit opinions for years without verifying bank balances directly.",
        aftermath: "Raju was arrested January 9, 2009. Stock fell 78% in a day, wiping out $2.2B in market cap. PwC India partners were charged with negligence. Tech Mahindra acquired Satyam in April 2009 for ~$600M. The case became known as 'India's Enron' and led to major reforms in Indian corporate governance (Companies Act 2013). Raju was convicted in 2015 and sentenced to 7 years. PwC was banned from auditing listed companies in India for 2 years.",
      },
    ],
    detection: [
      "Compare CapEx/revenue ratios to industry peers \u2014 outliers deserve investigation into what exactly is being capitalized",
      "Read the capitalization policy in the accounting policies footnote \u2014 watch for changes in thresholds or categories of capitalized costs",
      "Track the ratio of depreciation/amortization to gross capitalized assets \u2014 declining ratios suggest useful life assumptions are being stretched",
      "Compute FCF-to-net income ratio over rolling 3-year periods \u2014 if consistently below 0.7x, the company is capitalizing what should be expenses",
      "For software companies: compare capitalized development costs to R&D expense trends and product release cycles",
      "For ASC 340-40 (commissions): compare the stated amortization period to disclosed customer churn rates \u2014 they should be consistent",
    ],
  },

  marginManipulation: {
    label: "Margin Manipulation",
    icon: "\uD83C\uDFAD",
    category: "Cost Classification & Adjustments",
    color: "#10B981",
    tagline: "Not all margin improvement is real \u2014 reclassifying costs between lines, abusing adjustments, and inflating non-GAAP metrics",
    theRule: "GAAP requires expenses to be classified by function: cost of revenue (direct costs of delivering goods/services), research & development, sales & marketing, and general & administrative. Gross margin = Revenue minus Cost of Revenue. Companies have discretion in classification \u2014 is a customer success engineer a cost of revenue or S&M expense? Is a cloud hosting cost COGS or R&D? This discretion is legitimate, but the boundary between reasonable judgment and manipulation is exploited frequently. Stock-based compensation (SBC) is an operating expense under GAAP (ASC 718) but is excluded from virtually all non-GAAP metrics despite being a real, recurring cost of doing business.",
    manipulation: "Companies manipulate margins by: (1) Shifting costs below the gross margin line \u2014 reclassifying implementation, hosting, or support costs from COGS to R&D or S&M to inflate gross margins (critical for SaaS companies where 75%+ gross margin is the benchmark). (2) SBC exclusion \u2014 reporting 'adjusted' margins that exclude stock-based compensation, which can be 15\u201340% of revenue for high-growth tech companies. SBC is real dilution paid by shareholders. (3) Restructuring charge abuse \u2014 taking large 'one-time' restructuring charges every year, moving ongoing operating costs into these buckets, and reporting 'adjusted' earnings that exclude them. (4) Acquisition-related cost exclusion \u2014 serial acquirers exclude integration costs, amortization of acquired intangibles, and deal costs from adjusted metrics despite acquisitions being their core growth strategy. (5) Vendor financing \u2014 offering financing to customers to pull forward revenue while burying the financing costs in a different line item.",
    redFlags: [
      "Gross margin improving while peers are flat or declining \u2014 may indicate cost reclassification rather than genuine efficiency",
      "Stock-based compensation consistently exceeding 15% of revenue with no path to declining \u2014 GAAP earnings are materially lower than adjusted",
      "Restructuring charges appearing in 4+ consecutive years \u2014 these are not 'one-time' costs, they are the cost of doing business",
      "Growing gap between GAAP and non-GAAP operating income \u2014 the bridge should be scrutinized line by line",
      "Changes in cost classification policies disclosed in footnotes, especially around COGS vs. OpEx boundaries",
      "Adjusted EBITDA margin expanding while GAAP operating margin contracts \u2014 the adjustments are doing the heavy lifting",
      "Serial acquirers reporting 'organic growth' that excludes integration costs but includes acquired revenue",
    ],
    caseStudies: [
      {
        company: "Valeant Pharmaceuticals",
        year: "2013\u20132016",
        amount: "$75B market cap destroyed",
        scheme: "Valeant, under CEO Michael Pearson, employed a multi-layered margin manipulation strategy built around serial acquisitions and aggressive cost-cutting. The playbook: acquire pharmaceutical companies, slash R&D spending to near-zero (arguing drug development was wasteful), raise prices on acquired drugs by 200\u2013800%, and report massive 'adjusted' earnings that excluded deal costs, restructuring, amortization of acquired intangibles, and litigation costs. Adjusted EPS was consistently 2\u20133x GAAP EPS. The company also used a hidden specialty pharmacy relationship (Philidor Rx Services) to push prescriptions and inflate demand \u2014 Philidor was effectively controlled by Valeant but not consolidated, keeping its liabilities off Valeant's balance sheet. Revenue from Philidor was booked as third-party sales when it was essentially a captive distribution channel.",
        unraveled: "Short sellers (Andrew Left/Citron Research in October 2015) published a report calling Valeant the 'pharmaceutical Enron' and exposing the Philidor relationship. Congressional investigations into drug pricing (led by Sen. Bernie Sanders and Rep. Elijah Cummings) brought public scrutiny. The Philidor relationship was disclosed and severed in November 2015, causing an immediate revenue cliff. The company disclosed an SEC investigation and ad hoc board committee investigation in 2016. Revenue dropped as pricing power collapsed under political pressure. Debt covenants tightened as earnings fell.",
        aftermath: "Stock fell from a peak of ~$263 (August 2015) to ~$8.30 (early 2017) \u2014 a 97% decline. CEO Pearson was fired in 2016. The company rebranded as Bausch Health in 2018 to distance from the scandal. $30B+ in debt left over from the acquisition spree nearly forced bankruptcy. CFO Howard Schiller settled SEC charges. The case taught investors to scrutinize serial acquirers' adjusted metrics and the gap between GAAP and non-GAAP earnings.",
      },
      {
        company: "IBM",
        year: "2013\u20132020",
        amount: "Persistent non-GAAP vs GAAP divergence",
        scheme: "IBM didn't commit fraud, but systematically used non-GAAP adjustments to paint a more favorable picture during a prolonged revenue decline. IBM's 'operating (non-GAAP) earnings' excluded: acquisition-related charges, retirement-related costs, amortization of acquired intangibles, and restructuring charges \u2014 items that collectively ran $2\u20134B per year. For a company doing $5\u201310B in acquisitions annually, excluding acquisition-related costs was excluding a core cost of the business strategy. IBM also reclassified revenue between legacy and 'strategic imperatives' categories, setting arbitrary boundaries to show the strategic segment growing even as total revenue declined for 22 consecutive quarters (2012\u20132017). The company also used significant share buybacks ($140B+ over 2005\u20132020) funded partly by debt to maintain EPS growth despite declining earnings.",
        unraveled: "No single moment \u2014 it was a slow credibility erosion. Analysts and investors gradually lost confidence in the 'strategic imperatives' reclassification as the definition kept shifting. Warren Buffett (who owned ~5% of IBM) sold his entire position in 2017\u20132018, citing inability to value the company. The 22-quarter revenue decline streak became a symbol of managed decline. CEO Ginni Rometty's compensation (which was tied to non-GAAP metrics) drew shareholder criticism. The stock was flat for a decade while the S&P 500 tripled.",
        aftermath: "New CEO Arvind Krishna (2020) shifted strategy to hybrid cloud via Red Hat acquisition ($34B, 2019). The company spun off managed infrastructure as Kyndryl (2021) to reset the revenue growth narrative. IBM remains a case study in how non-GAAP adjustments and revenue reclassification can obscure structural decline for years, but eventually the cash flows tell the truth.",
      },
      {
        company: "SoftBank Group",
        year: "2017\u20132022",
        amount: "$50B+ in investment gains reported as operating income",
        scheme: "SoftBank, through its Vision Fund, reported massive unrealized investment gains as operating income under IFRS (which, unlike GAAP, allows fair value changes on investments to flow through operating income for investment entities). In FY2021, SoftBank reported \u00A55.6T ($49B) in 'operating income' \u2014 almost entirely unrealized gains on portfolio companies (Coupang, DoorDash, etc.) that had recently IPO'd. When markets reversed, SoftBank reported a record \u00A53.1T ($23B) operating loss in FY2022. Under GAAP, these would have been below-the-line investment gains, not operating income. The presentation made a venture capital portfolio look like an operating business with operating margins, which created a fundamentally misleading picture of recurring profitability. Additionally, SoftBank used Alibaba shares as collateral for loans, creating leveraged exposure to a single stock.",
        unraveled: "The tech/growth stock correction in 2022 reversed billions in unrealized gains. SoftBank reported a record loss. The volatility of 'operating income' swinging from +$49B to -$23B in consecutive years made it obvious to all observers that this was investment mark-to-market activity, not operating results. CEO Masayoshi Son acknowledged the Vision Fund's performance was poor. Many portfolio companies (WeWork, Greensill, Wirecard) either failed or suffered massive impairments.",
        aftermath: "SoftBank shifted to a defensive posture in 2022\u20132023, drastically reducing new investments. Vision Fund 2 was largely self-funded (not external LP capital). The stock traded at a persistent 50\u201360% discount to NAV, reflecting investor distrust of the reported 'operating' results. The case illustrates how IFRS vs. GAAP differences can create materially different pictures of the same economic reality, and why investors must understand which accounting framework a company uses.",
      },
    ],
    detection: [
      "Build a GAAP-to-non-GAAP bridge for every company \u2014 track each adjustment line item over time, flag any that recur for 3+ years (those aren't one-time)",
      "Compare gross margin definitions across peers \u2014 read the COGS footnote to understand what's included vs. excluded",
      "Track SBC as a percentage of revenue and per employee \u2014 high SBC companies' GAAP earnings are the real number, not adjusted",
      "For serial acquirers: add back ALL acquisition-related adjustments to get a realistic picture of the cost of the acquisition strategy",
      "Watch for reclassification of revenue or cost categories \u2014 particularly when accompanied by narrative changes about 'strategic' vs 'legacy' segments",
      "Compare operating cash flow to GAAP operating income, not adjusted operating income \u2014 cash flow validates GAAP, not non-GAAP",
    ],
  },

  reservesCookieJar: {
    label: "Reserves & Cookie Jars",
    icon: "\uD83C\uDF6A",
    category: "Accrual Manipulation",
    color: "#F59E0B",
    tagline: "Over-reserve in good times, release in bad times \u2014 smoothing earnings to create an illusion of consistency",
    theRule: "GAAP requires companies to estimate and accrue liabilities for future obligations: warranty costs, legal settlements, restructuring, loan losses, insurance claims, pension benefits, and more. These estimates involve significant management judgment. ASC 450 (contingencies) requires accrual when a loss is 'probable' and 'estimable.' Pension accounting (ASC 715) requires assumptions about discount rates, expected return on plan assets, mortality, and salary growth. Insurance reserves require actuarial estimates of future claims. In all cases, the estimates directly impact reported earnings \u2014 higher reserves reduce current income, lower reserves increase it.",
    manipulation: "Cookie jar accounting works in two phases: (1) Over-reserve during strong periods \u2014 set aside more than is actually needed for warranties, restructuring, bad debts, or other accruals. This depresses earnings when the company is doing well (and nobody notices the conservative estimates). (2) Release the excess reserves during weak periods to boost earnings \u2014 reversing the accrual flows directly to the bottom line. This creates artificially smooth earnings that mask the business's true cyclicality. Specific techniques: taking 'big bath' restructuring charges that include provisions for future operating costs; using overly conservative pension assumptions in strong years and relaxing them when returns fall short; manipulating warranty or return provisions based on desired earnings rather than actual experience; and timing the recognition of legal accruals to smooth quarters.",
    redFlags: [
      "Unusually large restructuring charges followed by quarters of reserve releases \u2014 the classic big bath/cookie jar cycle",
      "Warranty or return reserve ratios that don't correlate with actual claim experience disclosed in footnotes",
      "Pension discount rate assumptions significantly different from peers or market rates \u2014 lowering the discount rate inflates the obligation (and the charge), raising it does the opposite",
      "Expected return on pension plan assets above actual historical returns \u2014 reduces current pension expense",
      "Legal reserves that don't change despite disclosed litigation activity \u2014 may indicate under-accrual",
      "Restructuring charges appearing to cover ordinary operating expenses (includes future rent, future salary for retained employees)",
      "'Other comprehensive income' swings that offset or complement operating results \u2014 may indicate reserve timing",
    ],
    caseStudies: [
      {
        company: "General Electric (GE)",
        year: "2001\u20132018",
        amount: "$15B+ insurance reserve shortfall; $22B goodwill impairment",
        scheme: "GE's insurance subsidiary (GE Capital's run-off long-term care insurance portfolio, known as North American Life & Health or NALH) had been systematically under-reserving for long-term care claims for over a decade. As policyholders aged and utilized benefits at higher rates than GE's actuarial assumptions predicted, the reserve deficit compounded. GE also used its massive industrial conglomerate structure to smooth earnings through discretionary reserve adjustments across dozens of business units. Former CEO Jeff Immelt reportedly pressured business unit heads to deliver predictable earnings growth, leading to reserve manipulation to fill gaps. GE Capital also engaged in gains trading (selling winning investments and holding losers) to smooth investment income. Additionally, GE used aggressive assumptions for pension returns (assuming 8\u20139% returns) and used the resulting lower pension expense to boost operating earnings.",
        unraveled: "In January 2018, GE disclosed a $6.2B after-tax ($9.5B pre-tax) charge to strengthen insurance reserves at NALH, with $15B in total statutory reserve contributions planned over seven years. The SEC had been investigating GE's accounting since 2017. In November 2017, CEO John Flannery (Immelt's replacement) disclosed that the company would take a $22B goodwill impairment charge on the power division. Harry Markopolos (the whistleblower who exposed Bernie Madoff) published a 175-page forensic report in August 2019 alleging $38B in accounting fraud across insurance reserves and Baker Hughes accounting. GE disputed the specifics but the stock fell 11% on the report.",
        aftermath: "GE paid a $200M SEC settlement in December 2020 for misleading investors about the insurance reserves and power division performance. Stock fell from $30+ to $6 between 2017\u20132018. GE ultimately broke itself into three companies (GE Aerospace, GE Vernova, GE HealthCare) in 2023\u20132024. The insurance reserve fiasco demonstrated how long-duration liabilities (like long-term care) can be under-reserved for decades before the gap becomes unmanageable. The conglomerate structure had allowed cross-subsidization of weak divisions and reserve smoothing across units.",
      },
      {
        company: "AIG (American International Group)",
        year: "2000\u20132005",
        amount: "$3.9B+ reserve manipulation + finite reinsurance",
        scheme: "AIG under CEO Hank Greenberg engaged in multiple reserve manipulation schemes: (1) Finite reinsurance \u2014 AIG entered into a $500M reinsurance deal with General Re (a Berkshire Hathaway subsidiary) in 2000\u20132001 that was designed to artificially boost AIG's loss reserves by $500M without any actual risk transfer. The deal was essentially a loan structured to look like insurance, making AIG's reserves appear more adequate than they were. (2) Smoothing investment income through strategic timing of gains and losses across its massive investment portfolio. (3) Under-reserving for workers' compensation and other long-tail casualty lines to boost current earnings. (4) Converting underwriting losses into investment income through internal reinsurance transactions between AIG subsidiaries.",
        unraveled: "Eliot Spitzer (New York Attorney General) began investigating the insurance industry's bid-rigging practices in 2004, which expanded into AIG's accounting. The SEC simultaneously investigated the Gen Re reinsurance transaction. Internal emails showed Greenberg directed the finite reinsurance deal specifically to manipulate reserves. AIG disclosed material weakness in internal controls in 2005 and restated financials, reducing shareholders' equity by $3.9B. Greenberg was forced to resign as CEO in March 2005.",
        aftermath: "AIG restated 5 years of financial results. Greenberg paid $15M in SEC penalties (without admitting guilt) and separately settled for $9M with the state of New York. Four Gen Re executives were convicted of fraud (later overturned on appeal, one reconvicted). The true scale of AIG's risk management failures became clear in 2008 when the company's $440B CDS portfolio on mortgage-backed securities nearly collapsed the global financial system, requiring a $182B government bailout. The reserve manipulation was separate from the CDS disaster but illustrated the same cultural problem: AIG systematically underestimated and disguised risk.",
      },
      {
        company: "Bristol-Myers Squibb",
        year: "2000\u20132002",
        amount: "$1.5B+ channel stuffing disguised via reserve manipulation",
        scheme: "Bristol-Myers Squibb engaged in a coordinated scheme combining channel stuffing with cookie jar reserves. The company stuffed its wholesale distribution channels with $1.5B+ in excess pharmaceutical inventory \u2014 far more than distributors could sell through to pharmacies and patients. To disguise the stuffing, BMS manipulated its sales return and rebate reserves: when wholesalers inevitably returned unsold product or demanded rebates, BMS used previously established excess reserves to absorb the returns without an earnings hit. In strong quarters, BMS would over-accrue reserves (building the cookie jar); in weak quarters, they'd stuff the channel AND release reserves to offset the inevitable returns. The company also offered extended payment terms and incentives to wholesalers to accept inventory they didn't need.",
        unraveled: "SEC investigation beginning in 2002 uncovered the coordinated scheme. Wholesaler inventory data (which became available through IMS Health and other tracking services) showed channel inventory levels far above normal. Internal emails showed sales leadership setting channel inventory targets based on earnings goals, not demand forecasts. A former executive cooperated with the SEC and described the coordinated reserve and stuffing scheme.",
        aftermath: "BMS paid a $150M SEC settlement in 2004 (then the largest SEC settlement by a public company). The company entered into a deferred prosecution agreement with the DOJ. CEO Peter Dolan was forced out (though for a different issue \u2014 the Plavix patent dispute). The company restated $1.5B+ in revenue. The case demonstrated how channel stuffing and reserve manipulation can work together as complementary schemes, and led to increased SEC scrutiny of pharmaceutical distribution channel inventory levels.",
      },
    ],
    detection: [
      "Track reserve balances as a percentage of related liability or exposure over time \u2014 sharp declines in reserve ratios often precede earnings misses",
      "Compare pension discount rates and expected return assumptions to peers and to market benchmarks (high-grade corporate bond yields for discount rates)",
      "Look for reserve releases disclosed in earnings announcements or 10-Q footnotes \u2014 quantify their contribution to earnings beats",
      "For insurance companies: compare reported loss ratios to industry loss ratios; compare reserve development (prior year favorable/unfavorable) patterns",
      "Flag any restructuring charge where the charge-to-actual-cost ratio deviates significantly from 1.0x \u2014 excess indicates cookie jar building",
      "Read actuarial opinions and auditor emphasis paragraphs about estimates \u2014 qualified language around reserves is a warning sign",
    ],
  },

  offBalanceSheet: {
    label: "Off-Balance Sheet",
    icon: "\uD83D\uDC7B",
    category: "Hidden Debt & Consolidation",
    color: "#EC4899",
    tagline: "If it's not on the balance sheet, investors can't see it \u2014 the art of hiding obligations, leverage, and risk",
    theRule: "GAAP requires consolidation of entities that a company controls (ASC 810). Variable Interest Entities (VIEs) must be consolidated by their primary beneficiary \u2014 the entity that absorbs the majority of expected losses or receives the majority of expected residual returns. Post-ASC 842 (effective 2019), most leases must be on the balance sheet. Securitizations and factoring arrangements require 'true sale' accounting treatment to be off-balance-sheet \u2014 if the seller retains significant risk, the assets stay on the books. Despite these rules, companies have historically used SPEs, VIEs, operating leases, factoring, and unconsolidated joint ventures to keep significant liabilities invisible to investors.",
    manipulation: "Off-balance-sheet manipulation takes several forms: (1) Special Purpose Entities (SPEs) designed to hold debt, toxic assets, or underperforming investments away from the parent balance sheet, with just enough 'independent' equity (often 3%) to avoid consolidation. (2) Operating lease structuring (pre-ASC 842) to keep real estate, equipment, and other large obligations off-balance-sheet \u2014 total undiscounted lease commitments for major retailers and airlines often exceeded total on-balance-sheet debt. (3) Receivables factoring and supply chain finance \u2014 selling receivables to banks or SPEs to convert them to cash, removing them from the balance sheet and inflating cash from operations. (4) Unconsolidated JVs where the parent guarantees the JV's debt but doesn't consolidate the JV's balance sheet. (5) Synthetic leases and other structured finance products designed to achieve off-balance-sheet treatment through technical compliance with accounting rules.",
    redFlags: [
      "Significant VIE or SPE disclosures in footnotes with maximum loss exposure much larger than recognized assets/liabilities",
      "Off-balance-sheet commitments (disclosed in MD&A or footnotes) that rival or exceed on-balance-sheet debt",
      "Factoring or supply chain finance programs growing rapidly \u2014 often disclosed in footnotes but can inflate operating cash flow",
      "Unconsolidated equity investments or JVs with significant debt that the parent guarantees",
      "Cash from operations significantly exceeding net income + D&A, with receivables declining \u2014 may indicate factoring/securitization",
      "Related-party entities that appear to exist primarily for balance sheet management rather than operational purposes",
      "Complex footnote disclosures about 'derecognition' of financial assets or 'sale' treatment of transfers",
    ],
    caseStudies: [
      {
        company: "Enron",
        year: "1997\u20132001",
        amount: "$38B+ in hidden debt via 3,000+ SPEs",
        scheme: "Enron created approximately 3,000 special purpose entities (SPEs) \u2014 with names like LJM1, LJM2, Raptor, Chewco, and JEDI \u2014 to accomplish three goals: (1) hide billions in debt from Enron's balance sheet to maintain its investment-grade credit rating, (2) hedge against losses on declining investments using Enron's own stock as the hedging instrument (circular logic \u2014 if Enron's stock fell, the hedges failed), and (3) create fictitious earnings by 'selling' underperforming assets to SPEs at inflated prices, booking the difference as profit. CFO Andrew Fastow personally managed LJM1 and LJM2, earning ~$45M in fees while simultaneously negotiating on Enron's behalf \u2014 an obvious conflict of interest. The SPEs met the technical 3% independent equity rule but the 'independent' investors were often Enron-connected. The Raptors (hedging vehicles) were backed by Enron stock: when the stock price declined, the Raptors became insolvent, unable to cover the very losses they were supposed to hedge.",
        unraveled: "Bethany McLean's Fortune article 'Is Enron Overpriced?' (March 2001) first questioned how Enron made money. Short sellers (notably Jim Chanos) had been building positions based on the incomprehensible financial statements. In October 2001, Enron disclosed a $1.2B reduction in shareholders' equity related to the Raptor unwind. Sherron Watkins (VP) had warned CEO Ken Lay in August 2001 that the company might 'implode in a wave of accounting scandals.' Arthur Andersen's David Duncan ordered document destruction. The stock fell from $90 to below $1 in weeks. The SPE consolidation cascade meant that once one entity was brought back on-balance-sheet, others followed, revealing the true debt load.",
        aftermath: "Enron filed for bankruptcy on December 2, 2001 ($63.4B in assets, then the largest US bankruptcy). CEO Ken Lay was convicted (died before sentencing in 2006). CFO Andrew Fastow sentenced to 6 years. CEO Jeff Skilling sentenced to 24 years (reduced to 14). Arthur Andersen was convicted of obstruction of justice (later overturned by SCOTUS, but the firm was destroyed \u2014 85,000 employees lost their jobs). 20,000+ Enron employees lost jobs and retirement savings. The scandal directly led to the Sarbanes-Oxley Act (2002), PCAOB creation, and FIN 46/ASC 810 revisions tightening VIE consolidation rules. It remains the defining accounting scandal of the modern era.",
      },
      {
        company: "Lehman Brothers (Repo 105)",
        year: "2007\u20132008",
        amount: "$50B temporarily removed from balance sheet",
        scheme: "Lehman Brothers used an accounting device called 'Repo 105' to temporarily remove approximately $50B in assets from its balance sheet at the end of each quarter. In a normal repurchase agreement (repo), a firm sells securities with an agreement to repurchase them \u2014 the transaction is treated as a financing (loan), and both the asset and liability stay on the balance sheet. Lehman structured repos where the collateral exceeded 105% of the cash received (hence 'Repo 105'). Under a technical interpretation of SFAS 140, this overcollateralization allowed the transaction to be treated as a 'sale' rather than a financing. The assets disappeared from the balance sheet for a few days around quarter-end, reducing reported leverage ratios (net leverage appeared to be 12.1x instead of the true ~16x). After the reporting date, Lehman would 'repurchase' the securities, putting them back on the balance sheet until the next quarter-end. The transactions had no business purpose other than cosmetically reducing leverage.",
        unraveled: "Lehman filed for bankruptcy on September 15, 2008. The Repo 105 scheme was discovered during the bankruptcy examiner's investigation. Anton Valukas (examiner) published a 2,200-page report in March 2010 detailing the Repo 105 transactions and alleging that senior management (CEO Dick Fuld, CFO Erin Callan, and subsequent CFOs) were aware. Internal emails showed Lehman's Senior VP Matthew Lee had raised concerns about the practice in May 2008 (and was subsequently fired). Ernst & Young (auditor) had been informed of Repo 105 and did not object, though the transactions were only executed through Lehman's London subsidiary because no US law firm would provide the required 'true sale' opinion \u2014 only Linklaters in London would sign off.",
        aftermath: "Lehman's bankruptcy ($639B in assets) remains the largest in US history and triggered the 2008 global financial crisis. No Lehman executives were criminally charged for Repo 105 (DOJ declined to prosecute). Ernst & Young settled a shareholder class action for $99M and paid $10M to the New York Attorney General. The case led to increased regulatory focus on quarter-end window dressing and repo market transparency. It also highlighted how transactions can be technically compliant with accounting rules while being fundamentally misleading \u2014 the 'true sale' opinion was obtained from a UK firm specifically because US firms wouldn't provide it.",
      },
      {
        company: "Banks Pre-2008 (SIVs/Conduits)",
        year: "2004\u20132008",
        amount: "$1.4T+ in off-balance-sheet vehicles",
        scheme: "Major banks (Citigroup, HSBC, Bank of America, and others) created Structured Investment Vehicles (SIVs) and asset-backed commercial paper (ABCP) conduits to hold mortgage-backed securities, CDOs, and other structured credit products off their balance sheets. These vehicles funded themselves by issuing short-term commercial paper (30\u201390 day) and invested in long-term, higher-yielding assets \u2014 a classic maturity mismatch. Banks earned fees for creating and administering the vehicles while keeping $1.4T+ in assets (and associated leverage) off their reported balance sheets. The vehicles had just enough independent capital (typically 5\u201310%) to avoid GAAP consolidation. However, banks provided liquidity backstops guaranteeing the vehicles' commercial paper \u2014 meaning the risk never actually left the bank.",
        unraveled: "When the subprime mortgage crisis hit in 2007, investors in the commercial paper market refused to roll over the SIVs' short-term funding. The maturity mismatch became lethal: vehicles couldn't refinance their short-term liabilities while holding illiquid long-term assets whose values were plummeting. Banks were forced to honor their liquidity guarantees, bringing the assets (and losses) back onto their balance sheets. Citigroup alone brought $49B in SIV assets back on-balance-sheet in December 2007. HSBC took a $35B charge. The aggregate effect was a massive, sudden increase in bank leverage ratios at the worst possible time.",
        aftermath: "The SIV crisis contributed to the 2008 financial crisis by simultaneously revealing hidden leverage and forcing asset fire sales. Citigroup required $45B in government bailout funds. The Dodd-Frank Act (2010) and Basel III capital rules significantly tightened off-balance-sheet rules, requiring banks to hold capital against liquidity facilities and consolidate more vehicles. FAS 166/167 (2009, now ASC 860/810) eliminated QSPEs (Qualifying Special Purpose Entities, the primary off-balance-sheet vehicle) and tightened VIE consolidation. The SIV episode demonstrated that off-balance-sheet doesn't mean off-risk \u2014 guarantees and reputational risk brought everything back when it mattered most.",
      },
    ],
    detection: [
      "Read the VIE/SPE footnote carefully \u2014 maximum loss exposure is the key number, not the recognized amount",
      "Calculate 'total obligations' including off-balance-sheet commitments disclosed in the contractual obligations table (MD&A) \u2014 compare to on-balance-sheet debt",
      "Watch for sudden declines in assets or leverage ratios at quarter-end that reverse early in the next quarter (window dressing)",
      "Track factoring/supply chain finance program sizes in footnotes \u2014 Moody's and S&P now treat significant programs as debt-like",
      "For banks: compare total assets to risk-weighted assets \u2014 a large gap may indicate off-balance-sheet exposures",
      "Check guarantees and commitments footnote for contingent obligations that could come back on-balance-sheet under stress scenarios",
    ],
  },

  cashFlowManipulation: {
    label: "Cash Flow Manipulation",
    icon: "\uD83D\uDCB8",
    category: "CFO Inflation & Timing",
    color: "#06B6D4",
    tagline: "Cash flow from operations is supposed to be the hardest number to fake \u2014 but it's not immune to manipulation",
    theRule: "The cash flow statement (ASC 230) classifies cash flows into three categories: operating (day-to-day business), investing (acquisitions, CapEx, investment purchases/sales), and financing (debt, equity, dividends). Cash from operations (CFO) is considered the most reliable indicator of business quality because it reflects actual cash collected and paid. Investors often use FCF (CFO minus CapEx) as the ultimate measure of value creation. However, GAAP provides discretion in classification, and companies can time payments, restructure transactions, and shift items between categories to inflate CFO.",
    manipulation: "Cash flow manipulation techniques include: (1) Reclassifying operating outflows as investing \u2014 Tyco classified acquisition-related payments as 'investing' cash flows when they were effectively operating costs. (2) Stretching payables \u2014 delaying vendor payments from 30 to 90+ days at quarter-end inflates CFO temporarily (the cash was used but not yet paid). (3) Pulling forward collections \u2014 offering discounts for early payment or factoring receivables to convert them to cash sooner. (4) Supply chain finance (reverse factoring) \u2014 a bank pays the company's suppliers early, and the company pays the bank later; this converts what should be an accounts payable (operating outflow when paid) into a bank loan repayment (financing outflow), inflating CFO. (5) Capitalizing operating costs (covered in Expense Capitalization but also impacts cash flow \u2014 capitalized costs flow through investing, not operating). (6) Timing of tax payments, legal settlements, and other large one-time items.",
    redFlags: [
      "CFO growing faster than net income over multiple periods \u2014 check whether this is sustainable working capital improvement or one-time timing",
      "Accounts payable days (DPO) increasing significantly quarter over quarter without supply chain strategy changes",
      "Large swings in working capital that consistently benefit CFO at quarter-end",
      "Supply chain finance program disclosed in footnotes \u2014 this can reclassify billions from operating to financing cash flows",
      "Proceeds from 'asset sales' in investing that look more like operating transactions",
      "Cash flow from operations persistently exceeding EBITDA by a wide margin (more than working capital dynamics explain)",
      "Acquiring companies and classifying deal-related operating costs as investing activities",
    ],
    caseStudies: [
      {
        company: "Tyco International",
        year: "1999\u20132002",
        amount: "$5.8B in misclassified cash flows",
        scheme: "Tyco under CEO Dennis Kozlowski pursued an aggressive acquisition strategy (700+ acquisitions in 3 years) and systematically manipulated cash flow classification. Operating expenses related to integrating acquired companies were classified as 'investing' cash outflows (capitalized as acquisition costs), inflating reported cash from operations. Tyco also used a technique called 'spring-loading' \u2014 at acquisition close, the company would write down the target's assets and accrue expenses that were actually Tyco's ongoing operating costs, parking them in the purchase price allocation. When these accruals were later reversed or the written-down assets were used, it created artificial operating income and cash flow. Separately, Kozlowski and CFO Mark Swartz looted $600M+ from the company through unauthorized bonuses, loan forgiveness, and personal expenses charged to the company (including the infamous $6,000 shower curtain and $2M birthday party in Sardinia).",
        unraveled: "The SEC began investigating Tyco in early 2002 after questions about executive compensation and accounting practices. The Manhattan DA's office investigated the personal looting charges. Internal investigations revealed the acquisition accounting manipulation and cash flow misclassification. A January 2002 analyst report by David Tice raised concerns about Tyco's acquisition accounting and free cash flow quality. The combination of executive theft and accounting manipulation unwound simultaneously. Kozlowski resigned in June 2002 as the criminal investigation expanded.",
        aftermath: "Kozlowski and Swartz were convicted of grand larceny and fraud in 2005, each sentenced to 8\u201325 years in prison (Kozlowski served 6.5 years, paroled in 2014). Tyco restated financials and broke itself into three companies: Tyco International (fire/security), Covidien (healthcare), and TE Connectivity (electronics) in 2007. The three pieces were collectively worth more than the pre-scandal Tyco. CFO Swartz paid $38M in restitution. The case illustrated how serial acquisition strategies can obscure both operating cash flow quality and executive misconduct.",
      },
      {
        company: "Wirecard",
        year: "2015\u20132020",
        amount: "\u20AC1.9B in cash that didn't exist",
        scheme: "Wirecard, a German payments processor and DAX 30 constituent, fabricated \u20AC1.9B in cash balances held in escrow accounts at two Philippine banks. The scheme was designed to support fabricated revenue from third-party acquiring partners (TPA) in Asia and the Middle East \u2014 partnerships where Wirecard claimed to process payments through third parties who collected the cash on Wirecard's behalf. The TPA revenue was entirely fictitious. The purported cash (representing accumulated TPA revenue) was supposedly held in escrow accounts at BDO Unibank and BPI in the Philippines. In reality, neither bank held any Wirecard funds. The fictitious cash represented roughly a quarter of Wirecard's total reported assets. Wirecard also inflated revenue from its legitimate payment processing business and used round-tripping through a network of opaque third-party partners in Dubai, Singapore, and Manila.",
        unraveled: "Financial Times journalist Dan McCrum published a series of investigative articles beginning in 2015 ('House of Wirecard') alleging accounting irregularities in Wirecard's Asian operations. Short sellers (including Muddy Waters in 2016) amplified the allegations. Germany's financial regulator BaFin infamously responded by banning short-selling of Wirecard stock and filing a criminal complaint against the FT journalists (2019) for alleged market manipulation. In June 2020, EY (auditor) refused to sign off on 2019 results because the Philippine banks stated the escrow accounts did not exist. CEO Markus Braun resigned on June 19. Wirecard disclosed that \u20AC1.9B in cash 'probably did not exist.'",
        aftermath: "Wirecard filed for insolvency on June 25, 2020 \u2014 the first DAX 30 company ever to go bankrupt. Stock went from \u20AC100+ to \u20AC0. CEO Braun was arrested. COO Jan Marsalek (who managed the TPA relationships) fled and is believed to be in Russia, possibly under intelligence protection. EY faced massive lawsuits for failing to verify bank balances for years (they had relied on screenshots and third-party confirmations rather than direct bank confirmations). The case led to a complete overhaul of Germany's financial regulation (BaFin reform), mandatory auditor rotation changes in the EU, and demonstrated that even basic audit procedures (confirming bank balances) can fail when auditors trust management representations over independent verification.",
      },
      {
        company: "Peloton",
        year: "2020\u20132022",
        amount: "$1B+ in inventory absorption and working capital gaming",
        scheme: "Peloton didn't commit fraud, but its cash flow dynamics illustrated how manufacturing companies can temporarily inflate operating metrics through inventory management. During the COVID-19 demand surge, Peloton massively ramped production and used absorption costing \u2014 a GAAP-compliant method where fixed manufacturing overhead (factory rent, equipment depreciation, salaried labor) is allocated to inventory rather than expensed immediately. By producing more units than it sold, Peloton absorbed more fixed costs into inventory on the balance sheet, reducing COGS and inflating reported gross margins. When demand collapsed in late 2021, Peloton was left with $1.5B+ in excess inventory. As production was cut, the reverse occurred: under-absorption meant fixed costs flowed directly to COGS, crushing margins. The company also took massive inventory writedowns ($576M in Q3 FY2022) as unsold bikes and treadmills became obsolete.",
        unraveled: "Demand evaporated as COVID lockdowns ended. Peloton cut its subscriber forecast repeatedly through 2022. The $576M inventory writedown in Q3 FY2022 crystalized the overproduction problem. Gross margin went from 36.1% (FY2021) to -7.7% (Q3 FY2022). Free cash flow went from positive to negative $3.7B over 18 months. The absorption costing effect was visible in the divergence between revenue trends (declining) and inventory trends (rising) \u2014 a classic warning sign that production was outpacing demand.",
        aftermath: "CEO John Foley was replaced in February 2022. The company cut 2,800 employees (20% of workforce), slashed production, hired McKinsey to restructure, and shifted from in-house manufacturing to third-party production. Stock fell from $170 peak to $3. While Peloton's case wasn't fraud, it illustrates how absorption costing under GAAP can temporarily mask deteriorating demand \u2014 investors should always compare production volumes to sales volumes and watch for inventory building.",
      },
    ],
    detection: [
      "Build a cash flow 'quality' waterfall: start with net income, add D&A, then scrutinize every working capital line for sustainability",
      "Track DPO (days payable outstanding) trends \u2014 a significant increase may be payables stretching rather than genuine supply chain optimization",
      "Check for supply chain finance/reverse factoring disclosures \u2014 these programs can shift $B from operating to financing classification",
      "Compare inventory growth to revenue growth \u2014 inventory building ahead of revenue growth is a warning sign (overproduction/absorption costing)",
      "Look at cash flow from investing for items that look like operating costs reclassified into acquisitions",
      "For companies with factoring programs: add back factored receivables to compute 'real' DSO and 'real' CFO",
      "Check the supplemental cash flow disclosure for significant non-cash items that might obscure real cash dynamics",
    ],
  },

  goodwillImpairment: {
    label: "Goodwill & Impairment",
    icon: "\uD83D\uDCA3",
    category: "Balance Sheet Overstatement",
    color: "#EF4444",
    tagline: "Goodwill is management's promise that an acquisition was worth the premium \u2014 impairment is the admission that it wasn't",
    theRule: "When a company acquires another, the excess of purchase price over fair value of identifiable net assets is recorded as goodwill (ASC 805). Under GAAP, goodwill is not amortized (unlike IFRS, where companies can elect amortization) \u2014 instead, it is tested for impairment at least annually (ASC 350). Impairment occurs when the carrying value of a reporting unit exceeds its fair value. The fair value determination requires significant judgment: management chooses discount rates, terminal growth rates, comparable companies, and projected cash flows. Separately, purchase price allocation (PPA) determines how much of the acquisition price goes to goodwill vs. identifiable intangible assets (customer relationships, technology, trade names) \u2014 the allocation directly affects future amortization expense.",
    manipulation: "Goodwill and impairment manipulation takes several forms: (1) Purchase price allocation gaming \u2014 allocating more of the purchase price to goodwill (not amortized) vs. finite-lived intangibles (amortized) to minimize future amortization expense and protect operating earnings. (2) Impairment avoidance \u2014 using optimistic assumptions in annual goodwill impairment tests (high revenue growth, low discount rates, favorable terminal values) to avoid recognizing an impairment that would reduce earnings. Management has a strong incentive to avoid impairment because it signals the acquisition destroyed value. (3) 'Big bath' impairment \u2014 the opposite: writing down goodwill by more than necessary (often coinciding with a new CEO) to reset the earnings base lower, making future earnings growth easier. (4) Reporting unit definition \u2014 combining a struggling acquired business with a healthy existing unit for impairment testing purposes, so the healthy unit's value masks the acquired business's decline.",
    redFlags: [
      "Goodwill exceeding 50% of total assets or 100% of shareholders' equity \u2014 the balance sheet is dominated by acquisition premiums",
      "Stock price implying market cap below book value (P/B < 1) while goodwill remains unimpaired \u2014 the market is telling you the goodwill is worthless",
      "Acquired companies' revenue or margin performance consistently missing the projections used to justify the acquisition price",
      "Discount rates used in impairment testing significantly below WACC or below rates used by peers",
      "Reporting unit restructuring that combines a struggling acquisition with a healthy legacy business",
      "CEO transition accompanied by massive goodwill impairment \u2014 may indicate prior management was avoiding impairment for years",
      "Serial acquirers with growing goodwill balances but flat or declining ROIC \u2014 acquisitions destroying value",
    ],
    caseStudies: [
      {
        company: "Kraft Heinz",
        year: "2018\u20132019",
        amount: "$15.4B goodwill + intangible impairment",
        scheme: "Kraft Heinz was formed through the 2015 merger orchestrated by 3G Capital and Berkshire Hathaway, creating a consumer food giant with $36B+ in goodwill and intangible assets (brands). 3G Capital's playbook was aggressive cost-cutting (zero-based budgeting) to drive margin expansion on legacy food brands (Kraft, Oscar Mayer, Heinz, Jell-O, Maxwell House). Management used extremely optimistic assumptions in goodwill impairment testing \u2014 projecting continued revenue growth and margin expansion for brands that were actually losing market share to private label and healthier alternatives. Marketing and R&D budgets were slashed to boost short-term margins, further eroding brand value. For three years, impairment tests 'passed' using projections that bore no relationship to actual performance trends.",
        unraveled: "In February 2019, Kraft Heinz disclosed a $15.4B impairment charge on goodwill and intangible assets across the Kraft and Oscar Mayer brands, simultaneously cutting the dividend 36% and disclosing an SEC investigation into its procurement accounting practices. The impairment acknowledged what the market had already priced in \u2014 the stock had been declining since 2017 as organic revenue growth turned negative. The SEC probe focused on whether the company had improperly accounted for procurement costs (booking costs in wrong periods to manage earnings). The combination of impairment, dividend cut, and SEC investigation in a single disclosure was devastating.",
        aftermath: "Stock fell 27% on the day of the February 2019 disclosure. Warren Buffett acknowledged the Kraft Heinz investment was a mistake, saying 'we overpaid for Kraft.' Additional impairments of $2.9B followed in 2020. Total goodwill and intangible impairments exceeded $20B \u2014 more than the company's market cap at its low point. CEO Bernardo Hees (3G partner) was replaced in 2019. The case demonstrated that aggressive cost-cutting on legacy consumer brands is a one-time trick, not a sustainable strategy, and that goodwill impairment avoidance eventually catches up with reality.",
      },
      {
        company: "HP / Autonomy",
        year: "2011\u20132012",
        amount: "$8.8B impairment on $11.1B acquisition",
        scheme: "Hewlett-Packard acquired UK software company Autonomy in October 2011 for $11.1B \u2014 a 64% premium to Autonomy's pre-announcement market cap. Within 13 months, HP wrote down $8.8B (79% of the purchase price), alleging that Autonomy had inflated its revenue before the acquisition through: (1) Round-tripping \u2014 selling hardware at a loss bundled with software licenses to inflate software revenue and gross margins. (2) Channel stuffing \u2014 reselling through intermediaries (Value Added Resellers) who had no end customers, with Autonomy secretly funding the purchases. (3) Reclassifying hosting revenue (lower margin, recognized ratably) as license revenue (higher margin, recognized upfront). Autonomy founder Mike Lynch denied all allegations and counter-claimed that HP mismanaged the integration.",
        unraveled: "HP's new CEO Meg Whitman (who replaced Leo Apotheker, the CEO who made the acquisition) disclosed the impairment in November 2012, explicitly alleging 'serious accounting improprieties, disclosure failures, and outright misrepresentations' by Autonomy's management. HP's post-acquisition audit uncovered the revenue inflation schemes. The case became an international legal battle: HP reported Autonomy to the DOJ and UK Serious Fraud Office. Deloitte (Autonomy's auditor) came under scrutiny for failing to detect the issues.",
        aftermath: "Mike Lynch was extradited to the US in 2023 and stood trial in San Francisco in 2024 on federal fraud charges. He was acquitted on all counts in June 2024 but tragically died in a yacht sinking in August 2024. Autonomy CFO Sushovan Hussain was convicted of fraud in 2018 and sentenced to 5 years. HP shareholders lost billions. The case raised fundamental questions about acquirer due diligence: HP's advisors (KPMG, Barclays, Perella Weinberg) failed to catch the alleged irregularities before the acquisition, and HP paid a premium justified by metrics that were allegedly fabricated. It became a defining cautionary tale about acquisition risk and the inadequacy of pre-deal due diligence for detecting revenue quality issues.",
      },
      {
        company: "GE (Power Division)",
        year: "2017\u20132018",
        amount: "$22B goodwill impairment",
        scheme: "GE's Power division had accumulated massive goodwill through acquisitions, most notably the $10.6B acquisition of Alstom's power business in 2015. Management justified the Alstom deal based on projections of continued global demand for gas turbines. However, the energy transition was already accelerating: renewable energy costs were plummeting, and gas turbine orders were entering structural decline. GE continued to use optimistic growth and margin assumptions in annual impairment testing even as Power division revenue declined 25%+ and orders collapsed. The Power division's goodwill impairment was deferred through aggressive impairment test assumptions and by maintaining Power as a combined reporting unit (mixing gas turbines with other power equipment to dilute the impairment signal).",
        unraveled: "New CEO John Flannery (replaced Jeff Immelt in August 2017) conducted a comprehensive review and announced a $22B goodwill impairment for the Power division in Q3 2018 \u2014 effectively admitting the Alstom acquisition had been a catastrophic misallocation of capital at the peak of the gas turbine cycle. The dividend was cut in two stages: Flannery cut from $0.24 to $0.12 in November 2017, then successor Larry Culp cut from $0.12 to $0.01 in October 2018 \u2014 a 96% total reduction. Combined with the insurance reserve shortfall (see Reserves section), investor confidence was destroyed. The confluence of Power impairment, insurance charges, and dividend cut destroyed investor confidence.",
        aftermath: "GE stock fell from $30+ (2017) to $6.40 (2018 low). Flannery was fired after just 14 months (replaced by Larry Culp). GE ultimately broke into three companies: GE Aerospace, GE Vernova (power/energy), and GE HealthCare. The Alstom acquisition is studied as a textbook example of pro-cyclical M&A: buying at peak cycle with optimistic assumptions that fail to account for structural industry change. Culp eventually stabilized the company by writing down assets to realistic values and focusing on cash generation over reported earnings.",
      },
    ],
    detection: [
      "Track goodwill-to-total-assets and goodwill-to-equity ratios \u2014 high ratios mean the balance sheet is vulnerable to impairment",
      "Compare P/B ratio to goodwill \u2014 if market cap < book value and goodwill is large, the market is pricing in future impairment",
      "Read the impairment testing footnote for discount rates and growth assumptions \u2014 compare to WACC, peer assumptions, and industry growth forecasts",
      "Track ROIC (return on invested capital including goodwill) \u2014 declining ROIC signals that acquisitions are destroying value",
      "Watch for CEO transitions \u2014 new CEOs have incentive to 'kitchen sink' impairments to reset the base",
      "Monitor organic revenue growth vs. acquisition-driven growth for serial acquirers \u2014 decelerating organic growth suggests acquired businesses are deteriorating",
    ],
  },

  fairValue: {
    label: "Fair Value & Mark-to-Market",
    icon: "\uD83C\uDFB0",
    category: "Valuation Judgment",
    color: "#A855F7",
    tagline: "When there's no market price, management estimates become the price \u2014 and estimates can be whatever management needs them to be",
    theRule: "ASC 820 (Fair Value Measurement) establishes a three-level hierarchy for fair value inputs: Level 1 \u2014 quoted prices in active markets (stocks, bonds with active trading), most reliable. Level 2 \u2014 observable inputs other than Level 1 (similar assets, yield curves, broker quotes), moderately reliable. Level 3 \u2014 unobservable inputs based on the entity's own assumptions (models, projections, discounted cash flows), least reliable. Companies must disclose the level of fair value inputs used for each class of assets and liabilities. ASC 320/ASC 326 governs classification of investment securities: Held-to-Maturity (HTM, carried at amortized cost), Available-for-Sale (AFS, fair value through other comprehensive income), and Trading (fair value through earnings). The classification determines where gains and losses appear \u2014 or don't appear.",
    manipulation: "Fair value manipulation occurs through: (1) Level 3 inflation \u2014 using overly optimistic assumptions in models to value illiquid assets (higher projected cash flows, lower discount rates, favorable assumptions about defaults or prepayments). Since Level 3 has no market verification, the model output IS the value. (2) Level migration gaming \u2014 moving assets between levels as markets deteriorate to avoid recognizing losses (e.g., claiming an asset that was Level 2 has become Level 3 because markets are 'dislocated'). (3) HTM classification to hide unrealized losses \u2014 classifying bonds as HTM means unrealized losses don't hit earnings or equity (they're invisible unless the bond defaults or is sold). (4) Cherry-picking \u2014 selling investments with gains (realizing the gain in earnings) while holding investments with losses (keeping losses unrealized). (5) Day 1 gains \u2014 recognizing profits on illiquid derivatives at inception based on Level 3 models.",
    redFlags: [
      "Large or growing Level 3 assets as a percentage of total assets or equity \u2014 these values are management estimates",
      "Level 3 gains consistently flowing through earnings (especially for financial institutions) \u2014 the company is generating 'earnings' from model assumptions",
      "Assets migrating from Level 2 to Level 3 during periods of market stress \u2014 may be avoiding loss recognition",
      "HTM portfolio with large unrealized losses disclosed in footnotes \u2014 losses are real but hidden from income statement and equity",
      "Significant Day 1 gains on derivatives or structured products at inception (disclosed in derivatives footnote)",
      "Valuation assumptions (discount rates, default rates, prepayment speeds) that are significantly more optimistic than market consensus or peer assumptions",
    ],
    caseStudies: [
      {
        company: "Lehman Brothers (Asset Marks)",
        year: "2007\u20132008",
        amount: "$30B+ in overvalued Level 3 assets",
        scheme: "Beyond Repo 105 (covered in Off-Balance Sheet), Lehman Brothers maintained aggressive Level 3 valuations on its $30B+ portfolio of illiquid real estate, private equity, and structured credit assets. As the mortgage market deteriorated through 2007\u20132008, Lehman's internal models consistently valued these assets above where comparable positions were trading (when comparables existed). Lehman rejected marks from third-party pricing services and counterparties, arguing their internal models were superior. The Asset Valuation Group (which set marks) reported to the CFO rather than risk management, creating a conflict of interest. Commercial real estate positions were valued using cap rates and growth assumptions that didn't reflect the rapidly deteriorating market. CDO positions were marked using default and recovery assumptions that lagged actual market conditions by months.",
        unraveled: "As other firms (Bear Stearns, Merrill Lynch) wrote down similar assets, pressure mounted on Lehman's marks. Counterparties demanded more collateral as they disputed Lehman's valuations. In Q2 2008, Lehman reported $2.8B in net losses \u2014 the first quarterly loss in its history \u2014 and raised $6B in emergency capital. But the marks remained suspect: the gap between Lehman's valuations and where distressed buyers were bidding kept widening. When Lehman filed for bankruptcy in September 2008, the estate's subsequent asset sales realized significantly less than the carrying values, confirming the overvaluation.",
        aftermath: "Post-bankruptcy, the Lehman estate spent 12+ years liquidating assets. Many positions realized 20\u201360 cents on the dollar relative to Lehman's pre-bankruptcy marks. The case demonstrated how Level 3 fair value can create a 'fictional' balance sheet: Lehman appeared solvent based on its own marks while being deeply insolvent at liquidation values. The lesson: when a company's largest assets are Level 3 and the company is also in distress, the marks are almost certainly optimistic.",
      },
      {
        company: "Silicon Valley Bank (SVB)",
        year: "2020\u20132023",
        amount: "$15.1B unrealized loss on HTM portfolio",
        scheme: "SVB didn't commit fraud, but its use of HTM accounting perfectly illustrates how accounting classification can hide material economic risk. During 2020\u20132021, SVB invested $91B in deposits into long-duration fixed-rate bonds (agency MBS and US Treasuries), mostly classified as Held-to-Maturity. Under HTM accounting, these bonds were carried at amortized cost \u2014 unrealized gains or losses were NOT reflected in either earnings or shareholders' equity. When the Fed raised rates from 0% to 5%+ in 2022\u20132023, SVB's HTM portfolio developed $15.1B in unrealized losses (disclosed in footnotes but invisible in headline financial statements). SVB's reported Tier 1 capital was $15.9B \u2014 meaning the unrealized losses, if recognized, would have wiped out the bank's entire capital base. The HTM classification was technically valid under GAAP, but it created a massive disconnect between reported capital adequacy and economic reality.",
        unraveled: "On March 8, 2023, SVB announced it was selling $21B of AFS securities at a $1.8B loss and raising $2.25B in new equity to shore up its balance sheet. The AFS sale crystallized losses that had been unrealized. Depositors (heavily concentrated in VC-backed tech startups) panicked and withdrew $42B in a single day (March 9) \u2014 the fastest bank run in history, enabled by mobile banking and social media. SVB was seized by the FDIC on March 10, 2023.",
        aftermath: "SVB's failure triggered the broader regional banking crisis (Signature Bank, First Republic). The FDIC invoked the systemic risk exception to guarantee all deposits. The failure led to intense debate about HTM accounting for banks: the unrealized losses were fully disclosed in SVB's footnotes, but most depositors and many analysts didn't read the footnotes. The FDIC's loss on SVB was estimated at $20B. The case demonstrated that GAAP accounting can be fully compliant while completely masking the economic reality of a firm's solvency. Post-SVB, regulators proposed requiring larger banks to reflect unrealized securities losses in capital ratios (AOCI inclusion).",
      },
      {
        company: "Bear Stearns (CDO Marks)",
        year: "2006\u20132008",
        amount: "$1.6B hedge fund collapse + firm failure",
        scheme: "Bear Stearns' two internal hedge funds \u2014 the High-Grade Structured Credit Strategies Fund and the Enhanced Leverage Fund \u2014 were heavily invested in CDO tranches backed by subprime mortgages. These positions were largely Level 3 (no active market, valued by models). The funds used aggressive leverage (10:1 and 20:1 respectively) on assets whose values were determined by Bear Stearns' own models. As subprime delinquencies rose in early 2007, the model-based marks didn't reflect the deteriorating fundamentals. Competitor banks (Merrill Lynch, JP Morgan) who had lent to the funds and held similar collateral began marking their positions lower, creating a valuation gap. Bear's funds continued to report modest declines while the actual market was collapsing.",
        unraveled: "In June 2007, Merrill Lynch attempted to sell $850M in CDO collateral from the Bear funds to establish a market price. The auction drew bids at 50\u201385 cents on the dollar \u2014 far below Bear's marks. Bear convinced Merrill to cancel most of the auction to prevent price discovery. But the damage was done: investors demanded redemptions. By July 2007, both funds reported losses exceeding 90% and filed for bankruptcy. The fund collapse was the first visible crack in the subprime crisis and a preview of Bear Stearns' own failure in March 2008.",
        aftermath: "Bear Stearns collapsed in March 2008 and was acquired by JP Morgan for $10/share (initially $2/share) with $29B in Fed guarantees. Fund managers Ralph Cioffi and Matthew Tannin were indicted for fraud (misleading investors about the funds' health) but acquitted in 2009 \u2014 the jury found that internal emails showed genuine uncertainty rather than intent to deceive. The case established that Level 3 marks on illiquid structured products can diverge massively from actual liquidation values, and that leverage on Level 3 assets creates existential risk because you can't sell at your marks in a crisis.",
      },
    ],
    detection: [
      "Check the fair value footnote for Level 3 assets as a % of total assets and equity \u2014 high ratios mean the balance sheet depends on management estimates",
      "For banks: compare HTM portfolio unrealized losses (disclosed in notes) to Tier 1 capital \u2014 this shows the 'economic' capital position",
      "Track Level 3 net gains/losses flowing through earnings \u2014 persistent gains from model-based valuation should be scrutinized",
      "Watch for assets migrating between fair value levels, especially Level 2 to Level 3 during market stress",
      "Compare a company's valuation assumptions (discount rates, default rates, prepayment speeds) to industry data and peer disclosures",
      "For investment firms: compare reported NAV to where comparable assets are trading in public markets \u2014 large discounts are a warning",
    ],
  },

  relatedParty: {
    label: "Related Party Transactions",
    icon: "\uD83E\uDD1D",
    category: "Governance & Self-Dealing",
    color: "#F97316",
    tagline: "When insiders use the company as a personal ATM \u2014 the most brazen form of shareholder value destruction",
    theRule: "ASC 850 requires disclosure of related-party transactions \u2014 transactions between the company and its directors, officers, significant shareholders, family members, or entities they control. Disclosure must include the nature of the relationship, transaction description, dollar amounts, and amounts due to/from related parties. The standard requires disclosure, not prohibition \u2014 the board's audit committee is responsible for evaluating whether related-party transactions are on arm's-length terms. Related-party transactions are inherently suspect because one side (management) controls both the company's resources and has personal financial interest in the transaction terms.",
    manipulation: "Related-party manipulation includes: (1) Self-dealing leases \u2014 executives buying properties and leasing them back to the company at above-market rates. (2) Related-party purchases/sales \u2014 the company buying goods or services from entities controlled by management at inflated prices, or selling assets to related parties at below-market prices. (3) Executive loans \u2014 the company making low-interest or no-interest loans to executives (largely prohibited for public companies by SOX Section 402, but still common in private companies and through indirect arrangements). (4) Family employment \u2014 hiring and compensating family members far above market rates. (5) Using company resources for personal benefit \u2014 personal use of corporate aircraft, real estate, security, and other perks beyond disclosed compensation. (6) Transfer pricing manipulation between company and entities controlled by insiders.",
    redFlags: [
      "Material related-party transactions disclosed in the proxy statement or 10-K, especially if the company is on the other side of a transaction with an entity controlled by the CEO or board members",
      "Company leasing significant real estate from entities controlled by management or board members",
      "Executive loans or guarantees (particularly in pre-SOX companies or non-US companies where such arrangements remain legal)",
      "Unusual consulting arrangements or service agreements with entities connected to management",
      "Multiple family members employed by the company, particularly in senior or highly compensated roles",
      "Dual-class share structures or founder control that reduces accountability for self-dealing transactions",
      "Audit committee that is not fully independent or has members with business relationships with management",
    ],
    caseStudies: [
      {
        company: "Adelphia Communications",
        year: "1998\u20132002",
        amount: "$3.1B in hidden Rigas family debt",
        scheme: "Adelphia, the fifth-largest US cable company, was controlled by the Rigas family (founder John Rigas and sons Timothy, Michael, and James). The Rigas family used Adelphia's borrowing capacity to fund personal purchases totaling $3.1B: luxury condominiums in Manhattan, a golf course in Pennsylvania, timberlands, the Buffalo Sabres NHL franchise, and private aircraft. The family borrowed through off-balance-sheet partnerships (co-borrowing facilities) that were guaranteed by Adelphia but not disclosed on Adelphia's balance sheet or in its SEC filings. Adelphia also overstated its subscriber counts by 20%+ by including connections that didn't generate revenue and inflated revenue through internal accounting adjustments. The family treated the public company as a family piggy bank, moving cash between Adelphia and family entities freely.",
        unraveled: "In March 2002, Adelphia disclosed $2.3B in off-balance-sheet co-borrowings guaranteed by the company \u2014 debt the market didn't know existed. The disclosure came after an analyst noticed the co-borrowing footnote during the company's year-end earnings call. The stock fell 50% immediately. An internal investigation revealed the full $3.1B in family borrowings and the subscriber count inflation. The SEC and DOJ opened investigations within weeks.",
        aftermath: "John Rigas was convicted of fraud and sentenced to 15 years in prison (he was 80 years old at sentencing). Son Timothy Rigas received 20 years. The company filed for Chapter 11 in June 2002. Time Warner Cable and Comcast acquired Adelphia's cable systems for $17.6B in 2006. The case led to strengthened related-party disclosure requirements and demonstrated how family-controlled companies with weak corporate governance can facilitate systematic looting. Deloitte (auditor) paid $167M+ to settle investor lawsuits.",
      },
      {
        company: "Tyco (Kozlowski)",
        year: "1997\u20132002",
        amount: "$600M+ in unauthorized compensation and theft",
        scheme: "Tyco CEO Dennis Kozlowski and CFO Mark Swartz systematically looted the company through multiple related-party schemes: (1) Unauthorized bonuses of $81M and loan forgiveness of $25M+ through a company relocation loan program (Key Employee Loan Program) where the loans were designed to never be repaid. (2) Personal expenses charged to the company including $6,000 gold-and-burgundy shower curtain, $15,000 dog umbrella stand, $2M birthday party for Kozlowski's wife on the island of Sardinia (half charged to the company as a 'business event'), $7M Park Avenue apartment furnished with company funds. (3) Unauthorized stock grants and bonus payments concealed from the board and compensation committee. (4) Related-party real estate transactions where executives purchased properties using company funds. The total personal enrichment exceeded $600M.",
        unraveled: "The Manhattan District Attorney's office began investigating Kozlowski in January 2002 for sales tax evasion on art purchases (he had art shipped to New Hampshire to avoid $1M in New York sales tax). This investigation expanded to Tyco's compensation practices. Internal investigation by the new board (after Kozlowski's resignation in June 2002) uncovered the full scope of unauthorized compensation, loan forgiveness, and personal expenses. The DA investigation revealed that Kozlowski had deliberately concealed transactions from the board by splitting payments below authorization thresholds.",
        aftermath: "Kozlowski and Swartz were convicted in 2005 (after a first trial ended in mistrial). Both sentenced to 8\u201325 years. Kozlowski served 6.5 years (paroled 2014). Both were ordered to pay $134M in restitution. General Counsel Mark Belnick was acquitted. The case, along with Enron and WorldCom, drove passage of Sarbanes-Oxley, which among other things prohibited company loans to executives (Section 402) and required CEO/CFO certification of financial statements (Section 302). Tyco survived and eventually became three successful companies (Tyco/Johnson Controls, Covidien/Medtronic, TE Connectivity).",
      },
      {
        company: "WeWork (Adam Neumann)",
        year: "2015\u20132019",
        amount: "$100M+ in self-dealing",
        scheme: "WeWork CEO and co-founder Adam Neumann engaged in extensive related-party transactions: (1) Neumann personally purchased buildings and leased them back to WeWork at market or above-market rates \u2014 at least $12M in lease payments to Neumann-owned entities. (2) Neumann charged WeWork $5.9M for the 'We' trademark (which he had personally trademarked), later returned under pressure. (3) Neumann borrowed against his WeWork equity through company-facilitated JPMorgan credit lines totaling $500M+. (4) Family members were employed in senior positions. (5) Neumann's personal investments (wave pools, artificial meat companies) were partially funded through WeWork-adjacent entities. (6) Neumann had unilateral control through supervoting shares (20:1 voting rights) that gave him ~65% voting control with only ~20% economic ownership, making board oversight ineffective.",
        unraveled: "The August 2019 S-1 IPO filing disclosed the full extent of related-party transactions for the first time. Public investors and media were stunned by the scope: the trademark charge, the self-dealing leases, the personal loans, and the governance structure. The S-1 also revealed that Neumann could appoint his successor, had taken $700M+ off the table through secondary share sales while the company lost billions, and that WeWork's own lawyers acknowledged the related-party transactions created 'conflicts of interest.' The IPO was withdrawn in September 2019 after the valuation collapsed from $47B to effectively zero institutional demand.",
        aftermath: "SoftBank forced Neumann out as CEO in September 2019, paying him a $1.7B exit package (including $185M 'consulting fee,' $500M credit line payoff, and $970M in share purchases) that infuriated WeWork employees who lost their equity value. SoftBank later sued to reduce the exit package. WeWork went public via SPAC at $9B (2021) and filed for bankruptcy in 2023. Neumann moved on to a new real estate venture (Flow) that received $350M from Andreessen Horowitz. The case became the defining example of founder self-dealing enabled by dual-class governance and passive boards.",
      },
    ],
    detection: [
      "Read Item 13 (Related-Party Transactions) in the 10-K and the Related-Party section of the proxy statement every year \u2014 changes or new transactions warrant investigation",
      "Check for company leases or contracts with entities sharing names or addresses with executives or board members",
      "Review executive compensation for unusual 'other compensation' line items that could include personal benefits",
      "Scrutinize dual-class share structures and governance provisions that reduce board independence or accountability",
      "Watch for insider stock sales, especially in pre-IPO secondary transactions, that diverge from stated long-term conviction",
      "For family-controlled companies: check for family member employment, family entity contracts, and personal guarantees",
    ],
  },

  nonGAAP: {
    label: "Non-GAAP Metrics",
    icon: "\uD83C\uDF93",
    category: "Adjusted Everything",
    color: "#14B8A6",
    tagline: "When GAAP earnings don't tell the story management wants \u2014 they invent a metric that does",
    theRule: "SEC Regulation G and Item 10(e) of Regulation S-K govern the use of non-GAAP financial measures. Companies are required to: (1) Present the most directly comparable GAAP measure with equal or greater prominence. (2) Provide a reconciliation from non-GAAP to GAAP. (3) Explain why management believes the non-GAAP measure is useful to investors. (4) Not use misleading labels. Companies cannot exclude normal, recurring cash operating expenses to create a non-GAAP measure. Despite these rules, the use of non-GAAP metrics has exploded: as of 2024, over 95% of S&P 500 companies report at least one non-GAAP measure, and the average gap between GAAP and non-GAAP EPS has widened from 15% in 2010 to 30%+ in recent years.",
    manipulation: "Non-GAAP manipulation works by systematically excluding real, recurring costs: (1) Stock-based compensation \u2014 the most common exclusion, running 10\u201340% of revenue for tech companies. SBC is real dilution paid by shareholders. (2) Amortization of acquired intangibles \u2014 serial acquirers exclude the amortization of assets they paid real money for, making acquisitions appear more accretive than they are. (3) Restructuring charges \u2014 excluding 'one-time' charges that occur every single year. (4) Litigation costs \u2014 excluding legal settlements and reserves that are an ongoing cost of doing business in certain industries. (5) Custom metric invention \u2014 creating proprietary metrics that have no standardized definition (Community Adjusted EBITDA, Adjusted Contribution Margin, etc.). (6) Moving the goalposts \u2014 changing non-GAAP definitions over time without restating prior periods, making trend comparisons meaningless.",
    redFlags: [
      "GAAP net loss alongside non-GAAP profit, especially if this pattern persists for multiple years \u2014 the 'real' profitability is the GAAP number",
      "Non-GAAP adjustments growing as a percentage of non-GAAP earnings over time \u2014 the adjustments are becoming the earnings",
      "Restructuring charges excluded from non-GAAP for 3+ consecutive years \u2014 these are operating costs, not one-time events",
      "SBC exceeding 20% of revenue with no declining trend \u2014 non-GAAP earnings are materially overstated relative to true shareholder economics",
      "Custom non-GAAP metrics with no peer comparability \u2014 the company is trying to define away its problems",
      "Non-GAAP definition changes between periods, particularly if the change flatters the comparison",
      "Management compensation tied to non-GAAP metrics rather than GAAP \u2014 creates incentive to maximize adjustments",
      "FCF presented as 'adjusted free cash flow' that excludes significant recurring cash costs",
    ],
    caseStudies: [
      {
        company: "WeWork (Community Adjusted EBITDA)",
        year: "2017\u20132019",
        amount: "Non-GAAP profit vs. $1.6B GAAP loss (2018)",
        scheme: "WeWork's S-1 introduced 'Community Adjusted EBITDA' which excluded: building and community-level operating expenses (the core cost of running shared workspaces), stock-based compensation, depreciation and amortization, interest expense, taxes, AND an additional category of 'pre-opening location costs.' After all exclusions, Community Adjusted EBITDA was positive, implying profitability in a business that was actually burning $1.6B per year. The metric effectively measured revenue minus almost nothing. WeWork presented this metric prominently in investor materials while burying GAAP results. The S-1 mentioned 'community' 150 times. The company also used unusual revenue metrics like 'memberships' and 'occupancy rates' that obscured the actual financial performance of individual locations.",
        unraveled: "The August 2019 S-1 filing put Community Adjusted EBITDA in front of sophisticated institutional investors who immediately recognized it as meaningless. NYU Professor Scott Galloway's viral analysis showed that by WeWork's metric definition, his dog-walking business could be a unicorn. Matt Levine (Bloomberg) wrote extensively about how the metric excluded approximately all costs of operating the business. The ridicule was so thorough and public that the term became shorthand for non-GAAP abuse. No institutional investor would buy the IPO at the proposed valuation.",
        aftermath: "The IPO was withdrawn. The term 'Community Adjusted EBITDA' entered the business lexicon as a cautionary joke. The SEC increased scrutiny of creative non-GAAP measures in subsequent IPO filings, issuing comment letters challenging unusual adjusted metrics. Other companies quietly retired their more aggressive custom metrics. The lesson was clear: you can invent any metric you want, but sophisticated investors (and the public market generally) will see through it if the GAAP-to-non-GAAP gap is absurd.",
      },
      {
        company: "Groupon (ACSOI)",
        year: "2011",
        amount: "Non-GAAP profit vs. $420M GAAP loss",
        scheme: "In its June 2011 S-1 filing, Groupon prominently featured 'Adjusted Consolidated Segment Operating Income' (ACSOI) as its primary profitability metric. ACSOI excluded online marketing costs (the company's largest expense and the primary way it acquired customers), stock-based compensation, and acquisition-related costs. By this measure, Groupon was profitable. By GAAP, it lost $420M in 2010 on $713M in revenue. The exclusion of customer acquisition costs was particularly egregious because: (1) These were Groupon's largest single expense. (2) They were recurring and essential to the business model. (3) They were growing faster than revenue, suggesting deteriorating unit economics. Groupon's S-1 presented ACSOI first, with GAAP results buried deeper in the filing.",
        unraveled: "The SEC issued comment letters in August\u2013September 2011 challenging the ACSOI metric. The SEC told Groupon that ACSOI was 'a non-GAAP measure that excludes a significant, recurring cost to generate revenues' and that it violated Reg G's prohibition on excluding normal operating expenses to create the appearance of profitability. Groupon was forced to remove ACSOI from the revised S-1. The company also had to restate revenue from gross to net for many deals (recognizing only the commission, not the full deal value), cutting reported revenue roughly in half. Both issues were caught before IPO through the SEC review process.",
        aftermath: "Groupon IPO'd in November 2011 at $20/share ($12.7B valuation) without ACSOI. The stock opened at $28 on its first trading day and is now ~$10 (post-reverse split). The SEC's intervention on ACSOI was widely covered and cited in subsequent enforcement guidance. The case became the landmark example of SEC pushback on creative non-GAAP metrics and is cited in virtually every corporate finance class discussing non-GAAP abuse. The gross-to-net revenue restatement also became a teaching case for ASC 606 principal-vs-agent considerations.",
      },
      {
        company: "Uber (Contribution Margin / Adjusted EBITDA)",
        year: "2017\u20132023",
        amount: "6+ years of non-GAAP profit vs. cumulative ~$25B+ GAAP net losses",
        scheme: "Uber progressively redefined its non-GAAP metrics as the company's losses deepened. Early stage: 'Contribution Margin' (unit economics per ride, excluding everything except variable costs). Then 'Core Platform Contribution Margin' (excluding Uber Eats losses from the core rideshare metric). Then 'Adjusted EBITDA' which excluded SBC ($1.8B in 2022), depreciation, restructuring, legal settlements, and 'non-recurring' items. Each quarterly earnings release featured adjusted EBITDA prominently while GAAP net losses were $8.5B (2019), $6.8B (2020), and $9.1B (2022, including impairments) \u2014 with 2021 showing $0.9B net income largely from investment gains, not operations. The definition of Adjusted EBITDA itself changed over time: in some years it excluded driver incentives above baseline, in others it included them. The goalpost movement made period-over-period comparison nearly impossible without reconstructing the reconciliation.",
        unraveled: "There was no single moment \u2014 rather, a gradual investor realization as cumulative GAAP net losses exceeded $25B through 2022. Even when Uber reported GAAP net income in 2021, it was driven by investment gains (Didi, Aurora), not operating profitability. Analysts increasingly focused on FCF rather than Adjusted EBITDA. When interest rates rose in 2022, the market's tolerance for non-GAAP profitability evaporated. Uber finally achieved GAAP operating income profitability in 2023 ($1.1B), and the stock reacted positively \u2014 demonstrating that the market had been waiting for real profits all along.",
        aftermath: "Uber is now GAAP profitable and the non-GAAP debate has subsided for this particular company. But the journey illustrates a broader pattern: companies use escalating non-GAAP adjustments during the unprofitable growth phase, gradually redefine metrics to show improvement, and eventually have to deliver GAAP profits. Investors who relied on Uber's non-GAAP metrics from 2017\u20132022 were investing based on management's preferred narrative rather than economic reality. The lesson: track the GAAP-to-non-GAAP reconciliation over time, and be skeptical when the definition changes.",
      },
    ],
    detection: [
      "Build a multi-year GAAP-to-non-GAAP reconciliation and track each adjustment as a % of non-GAAP earnings \u2014 growing adjustments are a red flag",
      "Check if the non-GAAP definition changed from last year \u2014 read the footnote in the earnings release, not just the number",
      "Calculate SBC as % of revenue and per employee \u2014 this is the most commonly excluded real cost",
      "For serial acquirers: add acquisition costs back to non-GAAP to see the true cost of the growth strategy",
      "Check if management compensation is tied to GAAP or non-GAAP metrics \u2014 the metric management is paid on is the metric they'll optimize",
      "Compare non-GAAP earnings to FCF over time \u2014 if FCF is consistently lower than non-GAAP earnings, the adjustments are inflating perceived profitability",
      "Count how many years 'restructuring' has been excluded \u2014 if it's annual, it's an operating cost",
    ],
  },

  leaseAccounting: {
    label: "Lease Accounting",
    icon: "\uD83C\uDFED",
    category: "ASC 842 / Commencement & Capitalization",
    color: "#F43F5E",
    tagline: "Lease commencement timing, construction capitalization, useful life, and depreciation \u2014 where small estimate changes create large swings in reported profitability",
    theRule: "Digital infrastructure companies (data center shells, HPC hosting, powered shell providers) operate at the intersection of several accounting standards. Most structure tenant arrangements as operating leases under ASC 842 \u2014 revenue is recognized straight-line over the lease term, commencing when the asset is 'made available for the customer's use.' Applied Digital (APLD) is the notable exception: its tenant fit-out services are recognized under ASC 606 using the cost-to-cost percentage-of-completion method. Construction-phase costs are capitalized under ASC 360 (PP&E) with significant judgment around what qualifies. Once operating, the assets are tested for impairment under ASC 360's triggered impairment model. Companies report Adjusted EBITDA excluding pre-opening costs, SBC, and 'non-recurring' buildout charges. The sector is in permanent build mode \u2014 meaning the line between CapEx and OpEx, between 'pre-revenue' and 'operating,' and between 'under construction' and 'commenced' is where accounting judgment concentrates.",
    manipulation: "Digital infrastructure accounting aggression operates across seven interconnected vectors: (1) Lease commencement timing \u2014 declaring a facility 'available for use' before it's truly operational to start straight-line revenue recognition sooner. Under ASC 842, revenue begins when the asset is made available, not when the customer actually occupies or uses it. Aggressive interpretation: power is connected but cooling, network, or physical security aren't fully operational. (2) CapEx capitalization \u2014 capitalizing internal labor (engineering, project management, executive time 'allocated' to construction), interest on broader corporate debt beyond construction-specific financing, pre-development costs (site selection, permitting, community relations), and SG&A overhead 'related to' construction. Every dollar capitalized is a dollar removed from current-period expense. (3) Useful life stretching \u2014 depreciating data center shells over 25\u201330 years vs. 15\u201320 years. A $500M facility at 30 years = $16.7M/yr depreciation; at 15 years = $33.3M/yr. That's a $16.6M annual margin difference per facility from a single accounting estimate. (4) APLD-style PoC on tenant fit-out \u2014 underestimating total cost-to-complete inflates current-period margin. If actual costs will be $120M but you estimate $100M, you're 50% complete at $50M spent (recognizing 50% of revenue) when you should only be 42% complete. (5) Adjusted EBITDA abuse \u2014 excluding pre-opening facility costs as 'non-recurring' when the company is perpetually opening new facilities. Pre-opening costs ARE the business model for a growth-stage shell company. (6) Contract modification treatment \u2014 when a hyperscaler renegotiates (lower rate, fewer MW, shorter term), treating it as a lease modification (spread impact over remaining term) vs. termination + new lease (recognize loss immediately). 'Blend and extend' structures can obscure economic concessions. (7) Impairment avoidance on stranded capacity \u2014 using optimistic re-leasing assumptions and DCF projections to pass ASC 360 impairment tests on facilities that have lost their anchor tenant or face softening demand.",
    redFlags: [
      "Revenue-generating MW in press releases diverging from actual cash rent collected \u2014 if rent receivables are ballooning, the customer may not agree that commencement occurred",
      "CapEx per MW significantly higher than peers for comparable builds \u2014 suggests aggressive capitalization of costs that peers expense (compare APLD, WULF, CORZ, CIFR $/MW)",
      "Depreciation-to-gross PP&E ratio materially lower than peers \u2014 the company is using longer useful lives to suppress depreciation expense",
      "Adjusted EBITDA positive while GAAP operating income is deeply negative and the gap is growing \u2014 the 'adjustments' are the real cost of the business",
      "Pre-opening / development costs excluded from Adjusted EBITDA exceeding 20\u201330% of total operating costs \u2014 this isn't a rounding error, it's the core growth investment being hidden",
      "Capitalized interest growing as a percentage of total interest expense \u2014 more interest is being deferred to the balance sheet rather than expensed",
      "Fit-out / construction revenue (APLD) with stable or improving margins across projects of varying size and complexity \u2014 suspiciously consistent PoC estimates",
      "Contract 'modifications' or 'amendments' disclosed in footnotes alongside stable headline revenue metrics \u2014 may be hiding economic concessions",
      "Large PP&E balances with no impairment charges despite visible demand softening, customer concentration risk, or tenant departures",
      "Inventory of 'facilities under development' or 'construction in progress' growing faster than contracted backlog \u2014 building on spec with no committed tenants",
    ],
    caseStudies: [
      {
        company: "Applied Digital (APLD) \u2014 Tenant Fit-Out PoC",
        year: "2024\u20132026",
        amount: "$18.9M fit-out revenue in Q3 FY2026 (27% of HPC hosting revenue)",
        scheme: "Applied Digital is the only major shell/infrastructure company using percentage-of-completion revenue recognition on tenant fit-out construction. In Q3 FY2026, APLD recognized $18.9M in fit-out revenue out of $71M total HPC hosting revenue using the cost-to-cost input method under ASC 606. The base rent ($44.1M) is recognized under ASC 842 operating lease accounting on a straight-line basis. The fit-out PoC creates a distinct manipulation vector: management estimates total cost-to-complete for each project, and the ratio of costs incurred to total estimated costs determines how much revenue and margin to recognize. This is the classic construction PoC model that has historically been abused in defense, construction, and engineering companies. APLD is effectively operating two different accounting models simultaneously \u2014 conservative straight-line lease recognition on base rent, but judgment-heavy PoC on fit-out. The fit-out margins and revenue trajectory should be monitored closely for consistency across projects.",
        unraveled: "No unraveling has occurred \u2014 this is a current, ongoing accounting treatment. The risk is prospective: if total fit-out costs on any project exceed estimates, APLD would need to record a catch-up adjustment reducing both revenue and margin in the period the revision is recognized. For a company already operating at thin margins with significant customer concentration (Macquarie/NVIDIA), a single cost overrun catch-up could materially impact quarterly results. The secondary risk is that if fit-out and lease components are not properly separated, some fit-out revenue may actually be lease revenue that should be recognized straight-line \u2014 a potential restatement risk.",
        aftermath: "APLD's stock has been volatile around earnings as investors parse the different revenue streams. The company's Q3 FY2026 results showed total revenue of $71M in HPC hosting with 26% of that from fit-out PoC. Watch for: (1) Fit-out gross margins by project \u2014 should vary based on complexity. (2) Revisions to cost-to-complete estimates disclosed in footnotes. (3) The ratio of fit-out revenue to base rent revenue over time \u2014 if fit-out is growing disproportionately, it may indicate pull-forward. (4) Whether new contracts (e.g., the Macquarie 200MW Jamestown expansion) continue the fit-out PoC structure or shift to pure lease.",
      },
      {
        company: "Core Scientific (CORZ) \u2014 Lease Commencement & Conversion",
        year: "2024\u20132026",
        amount: "500MW+ converting from mining to HPC hosting",
        scheme: "Core Scientific represents the most significant business model pivot in the sector: converting bitcoin mining facilities to HPC/AI hosting under long-term CoreWeave leases. The accounting pivot is equally significant \u2014 revenue shifts from ASC 606 point-in-time mining recognition to ASC 842 operating lease straight-line recognition. CORZ has elected the practical expedient to combine lease and nonlease components (power, security, maintenance) into a single operating lease component because the lease is the predominant element. Revenue commences when the asset is 'made available for the customer's use.' The key judgment: when exactly is a converted mining facility 'available' for HPC use? The conversion involves significant infrastructure upgrades (cooling, power density, network), and the definition of 'available' determines when straight-line revenue recognition begins. Earlier commencement = earlier revenue recognition across the entire multi-year lease term.",
        unraveled: "No unraveling \u2014 this is an active transition. The risk is in the commencement date determination for each facility tranche. If CORZ declares facilities available and begins recognizing revenue, but CoreWeave disputes readiness or delays deployment of its GPU clusters, CORZ could be recognizing lease revenue on space the customer isn't actually using. The gap would show up as growing lease receivables (revenue recognized but not yet billed or collected). Additionally, the conversion CapEx (mining-to-HPC) is being capitalized and will be depreciated over the lease term \u2014 if the useful life assumptions on the conversion CapEx don't align with the actual lease term and re-leasing probability, future impairment risk exists.",
        aftermath: "CORZ stock has re-rated significantly on the HPC pivot (from bankruptcy emergence at ~$4 to $15+). The market is pricing in successful conversion of 500MW+ to CoreWeave leases. Key monitoring: (1) Timing of lease commencement disclosures vs. CoreWeave's actual deployment announcements. (2) Revenue-per-MW metrics compared to contracted rates. (3) Conversion CapEx per MW and depreciation assumptions. (4) CoreWeave concentration risk \u2014 CORZ's HPC revenue is essentially single-customer.",
      },
      {
        company: "Cipher Mining (CIFR) \u2014 Pre-Revenue Capitalization",
        year: "2025\u20132027",
        amount: "$5.5B AWS lease + ~$3B base Fluidstack/Google lease (up to $9B with extensions)",
        scheme: "Cipher is transitioning from bitcoin mining to HPC hosting with massive long-term leases: $5.5B / 300MW / 15 years with AWS and ~$3B base / 300MW / 10 years with Fluidstack (Google), up to $9B with extensions. These deals are structured as colocation leases where Cipher builds and owns the shell. HPC revenue won't begin until August 2026 (AWS). During the multi-year construction period, Cipher will capitalize hundreds of millions in development costs. The accounting question: what qualifies as capitalizable construction cost vs. period expense? Site acquisition, permitting, design, internal engineering labor, interest, project management overhead, community engagement, environmental compliance \u2014 the boundary is judgment-intensive. Aggressive capitalization during the pre-revenue phase makes the eventual asset base larger (inflating future depreciation but deferring current expenses), makes current-period losses look smaller, and creates a larger balance sheet that supports more borrowing capacity. Because Cipher is in pure construction mode with no HPC revenue yet, investors can't compare capitalized costs to revenue metrics \u2014 the validation only comes when leases commence.",
        unraveled: "No unraveling \u2014 Cipher is pre-revenue on HPC. The risk materializes when leases commence and the capitalized asset base starts generating revenue. If CapEx/MW is significantly higher than peers, it could indicate either genuine build quality differences or aggressive capitalization. The secondary risk: if AWS or Fluidstack/Google delays or restructures the lease, Cipher could face impairment on a massive construction-in-progress balance with no tenant. The $5.5B AWS lease represents Cipher's entire strategic pivot \u2014 customer concentration risk is extreme.",
        aftermath: "Cipher has committed to its largest-ever capital expenditure program. Key monitoring: (1) Track construction-in-progress balance quarterly and compare growth to disclosed project milestones. (2) When HPC revenue begins, compare CapEx/MW to WULF, CORZ, and APLD to benchmark capitalization aggressiveness. (3) Watch for any AWS or Fluidstack contract modification disclosures. (4) Capitalized interest disclosures during the construction phase. (5) How Cipher classifies costs between 'development' (capitalizable) and 'operating' (expensed) in its cash flow statement.",
      },
      {
        company: "TeraWulf (WULF) \u2014 Depreciation & Useful Life",
        year: "2024\u20132026",
        amount: "200MW Lake Mariner HPC facility",
        scheme: "TeraWulf's HPC hosting at Lake Mariner uses ASC 842 operating lease accounting with straight-line recognition. The accounting judgment that matters most for WULF is depreciation: the useful life assigned to data center infrastructure directly drives reported margins. Data center shell components have different useful lives \u2014 the building shell might last 30 years, but power distribution (UPS, switchgear) may be 15\u201320 years, cooling systems 10\u201315 years, and networking infrastructure 5\u201310 years. How these are blended into a composite useful life for the facility determines annual depreciation expense. WULF's Lake Mariner site also has a unique power advantage (New York's predominantly zero-carbon grid (~90%+ nuclear and hydro)) that is part of the asset base. The depreciation treatment of power infrastructure (long-lived) vs. data center fit-out (shorter-lived) vs. technology-specific components creates significant room for judgment. Additionally, WULF elected the ASC 842 practical expedient to combine lease and nonlease components \u2014 meaning power delivery, security, and maintenance revenue are all bundled into a single straight-line recognition pattern rather than being recognized separately based on consumption or delivery.",
        unraveled: "No unraveling \u2014 WULF's HPC operations are early-stage. The useful life and depreciation assumptions will become more visible as the asset base grows and more facilities reach operating status. The test will come when: (1) WULF reports facility-level profitability and investors can compute implied depreciation rates. (2) If Core42 or Fluidstack leases expire or aren't renewed, the residual value assumption embedded in the useful life will be tested. (3) If power density requirements change (current 50\u201380kW/rack may evolve to 100\u2013200kW+), older infrastructure may face economic obsolescence before its accounting useful life expires.",
        aftermath: "WULF trades at a significant premium to peers partly on its power cost advantage. The sustainability of that premium depends on whether the accounting (depreciation, lease recognition) accurately reflects the economic reality of operating a data center with advantaged power. Key monitoring: (1) Compare D&A/gross PP&E to CORZ, APLD. (2) Track useful life disclosures in the PP&E footnote. (3) Watch for any technology obsolescence or power density-driven asset writedowns in the industry that might signal WULF faces similar risk.",
      },
      {
        company: "Broader Sector \u2014 Adjusted EBITDA in Permanent Build Mode",
        year: "2023\u20132026",
        amount: "Sector-wide: GAAP-to-non-GAAP gaps of 50\u2013200%+",
        scheme: "Every major digital infrastructure company reports Adjusted EBITDA that excludes pre-opening facility costs, stock-based compensation, depreciation, and various 'non-recurring' charges. The fundamental problem: when a company is perpetually building new facilities, pre-opening costs are not non-recurring \u2014 they are the core cost of executing the growth strategy. A company like CORZ converting 500MW across multiple tranches will have some facilities 'pre-opening' and some 'operating' at all times for years. Excluding pre-opening costs shows artificially high margins on the operating portion while hiding the cash burn of the growth portion. Similarly, SBC at these companies can run 15\u201330% of revenue (especially post-IPO or post-SPAC with significant equity-based compensation). Excluding SBC from Adjusted EBITDA overstates profitability by the full amount of real dilution shareholders are absorbing. The combined effect: Adjusted EBITDA can be positive while GAAP operating income is negative and free cash flow is deeply negative.",
        unraveled: "The WeWork precedent applies here. WeWork's 'Community Adjusted EBITDA' excluded essentially all real costs to show profitability in a money-losing business. While digital infrastructure companies have real assets and contracted revenue (unlike WeWork), the same dynamic of excluding core operating costs to present a favorable profitability picture is at play. The reckoning comes when: (1) Growth slows and pre-opening costs decline, revealing that 'steady-state' margins are lower than Adjusted EBITDA implied. (2) SBC converts to selling pressure that dilutes shareholders. (3) Investors start benchmarking on FCF instead of Adjusted EBITDA (as happened with Uber). (4) A company hits a demand air pocket and must cut CapEx, at which point the Adjusted EBITDA suddenly looks like the GAAP number because there are no more pre-opening costs to exclude.",
        aftermath: "As the sector matures, expect a gradual shift from Adjusted EBITDA to FCF as the primary valuation metric \u2014 the same evolution that SaaS went through from 2015\u20132023. Early investors benefit from the favorable Adjusted EBITDA narrative; the risk is being the last buyer before the market re-rates to GAAP/FCF-based valuation. Compare Adjusted EBITDA to FCF for every company in the sector: APLD, CORZ, WULF, CIFR, CRWV. The gap is the 'narrative premium' baked into current valuations.",
      },
    ],
    detection: [
      "Compare CapEx/MW across peers (APLD, WULF, CORZ, CIFR) for similar facility types \u2014 significant outliers suggest capitalization policy differences, not just build cost differences",
      "Track capitalized interest as a % of total interest expense each quarter \u2014 rising ratios during construction phases mean more interest is being deferred to the balance sheet",
      "Compare depreciation-to-gross PP&E ratios across peers \u2014 lower ratios indicate longer useful life assumptions that suppress depreciation expense",
      "Build a 'total cost of growth' metric: GAAP operating expense + CapEx + capitalized interest \u2014 compare this to Adjusted EBITDA to see the true cost the adjustments hide",
      "For APLD specifically: track fit-out gross margins by project and look for cost-to-complete estimate revisions in the ASC 606 footnotes",
      "Monitor lease receivables vs. revenue recognized \u2014 growing receivables suggest commencement timing may be ahead of actual customer usage",
      "Watch construction-in-progress (CIP) balance relative to contracted backlog \u2014 CIP growing faster than committed leases means speculative building that carries impairment risk",
      "Compare revenue-generating MW (press release) to implied MW from revenue/rate math \u2014 divergence suggests commencement timing games",
      "Track Adjusted EBITDA to FCF ratio over time \u2014 if the ratio is persistently above 2x, the adjustments are not 'noise,' they are the real economics",
      "Read the ASC 842 practical expedient elections in the lease footnote \u2014 combining lease and nonlease components can obscure the profitability of the underlying lease vs. service delivery",
    ],
  },
};

const TOPIC_ORDER = [
  "ascStandards",
  "revenueRecognition",
  "leaseAccounting",
  "expenseCapitalization",
  "marginManipulation",
  "reservesCookieJar",
  "offBalanceSheet",
  "cashFlowManipulation",
  "goodwillImpairment",
  "fairValue",
  "relatedParty",
  "nonGAAP",
];

export default function Accounting({ initialTab }) {
  const [activeTopic, setActiveTopic] = useState(initialTab || TOPIC_ORDER[0]);
  useEffect(() => { if (initialTab) setActiveTopic(initialTab); }, [initialTab]);

  const topic = activeTopic ? TOPICS[activeTopic] : TOPICS[TOPIC_ORDER[0]];

  return (
    <div style={{ flex: 1, padding: "36px 52px", overflowY: "auto", fontFamily: FONT }}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `1px solid ${T_.borderLight}`, flexWrap: "wrap" }}>
        {TOPIC_ORDER.map(key => (
          <button key={key} onClick={() => setActiveTopic(key)} style={{
            padding: "10px 16px", fontSize: 12, fontWeight: 500, cursor: "pointer",
            border: "none", borderBottom: activeTopic === key ? `2px solid ${TOPICS[key].color}` : "2px solid transparent",
            background: "transparent", color: activeTopic === key ? T_.text : T_.textGhost,
            fontFamily: FONT, transition: "all 0.15s", whiteSpace: "nowrap",
          }}>{TOPICS[key].label}</button>
        ))}
      </div>

      {/* TOPIC DETAIL */}
      {topic && topic.type === "reference" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{topic.icon}</span>
              <div>
                <div style={{ fontSize: 22, fontWeight: 500, color: T_.text }}>{topic.label}</div>
                <div style={{ fontSize: 13, color: topic.color, marginTop: 2 }}>{topic.category}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: T_.textDim, marginTop: 8, lineHeight: 1.6, fontStyle: "italic" }}>{topic.tagline}</div>
          </div>

          {ASC_STANDARDS.map(asc => (
            <Section key={asc.code} title={`${asc.code} \u2014 ${asc.title}`}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Effective Date</div>
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{asc.effective}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>What It Replaced</div>
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{asc.replaced}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Goal</div>
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{asc.goal}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Framework</div>
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.7 }}>{asc.framework}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Key Judgments & Gray Areas</div>
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{asc.keyJudgments}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Why It Matters for Research</div>
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{asc.relevance}</div>
                </div>
                {asc.example && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T_.green, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Example Walkthrough</div>
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.7, background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}`, padding: 16 }}>{asc.example}</div>
                </div>
                )}
                {asc.financialImpact && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#60A5FA", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Impact Across Financial Statements</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Income Statement", text: asc.financialImpact.incomeStatement, color: "#F59E0B" },
                      { label: "Balance Sheet", text: asc.financialImpact.balanceSheet, color: "#8B5CF6" },
                      { label: "Cash Flow Statement", text: asc.financialImpact.cashFlow, color: "#10B981" },
                    ].map(fs => (
                      <div key={fs.label} style={{ background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}`, padding: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: fs.color, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{fs.label}</div>
                        <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.6 }}>{fs.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
                )}
              </div>
            </Section>
          ))}
        </div>
      )}

      {topic && topic.type !== "reference" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{topic.icon}</span>
              <div>
                <div style={{ fontSize: 22, fontWeight: 500, color: T_.text }}>{topic.label}</div>
                <div style={{ fontSize: 13, color: topic.color, marginTop: 2 }}>{topic.category}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: T_.textDim, marginTop: 8, lineHeight: 1.6, fontStyle: "italic" }}>{topic.tagline}</div>
          </div>

          {/* The Rule */}
          <Section title="The Accounting Rule" subtitle="What GAAP/IFRS actually requires and where judgment lives">
            <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.7 }}>{topic.theRule}</div>
          </Section>

          {/* How It Gets Manipulated */}
          <Section title="How It Gets Manipulated" subtitle="The playbook for making numbers look better than they are">
            <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.7 }}>{topic.manipulation}</div>
          </Section>

          {/* Red Flags */}
          <Section title="Red Flags" subtitle="What to look for in financial statements and disclosures">
            <RedFlagList flags={topic.redFlags} />
          </Section>

          {/* Case Studies */}
          <Section title="Case Studies" subtitle="Famous examples \u2014 what happened, how it unraveled, and the aftermath">
            {topic.caseStudies.map((cs, i) => (
              <CaseStudy key={i} cs={cs} />
            ))}
          </Section>

          {/* Detection Framework */}
          <Section title="Detection Framework" subtitle="How to identify this in practice when analyzing a company">
            <DetectionList items={topic.detection} />
          </Section>
        </div>
      )}
    </div>
  );
}
