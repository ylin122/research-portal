import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";

const TABS = [
  { key: "concepts", label: "Concepts" },
  { key: "deepDives", label: "Deep Dives" },
];

const TOPIC_FILTERS = [
  { key: "all", label: "All" },
  { key: "ai", label: "AI / ML" },
  { key: "finance", label: "Finance" },
  { key: "infrastructure", label: "Infrastructure" },
  { key: "software", label: "Software" },
  { key: "business", label: "Business" },
  { key: "other", label: "Other" },
];

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

// ═══════════════════════════════════════════════════════
// CONCEPTS TAB
// ═══════════════════════════════════════════════════════

function ConceptRow({ concept, expanded, onToggle, onDelete }) {
  const topic = TOPIC_FILTERS.find(t => t.key === concept.topic);
  return (
    <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, marginBottom: 10, overflow: "hidden" }}>
      <div onClick={onToggle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: T_.accent, fontSize: 12, transition: "transform 0.15s", transform: expanded ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: T_.text }}>{concept.title}</span>
          {topic && topic.key !== "all" && (
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: T_.blue, background: `${T_.blue}15`, padding: "2px 8px", borderRadius: 4 }}>{topic.label}</span>
          )}
        </div>
        {concept.one_liner && !expanded && (
          <span style={{ fontSize: 12, color: T_.textDim, maxWidth: "50%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>{concept.one_liner}</span>
        )}
      </div>
      {expanded && (
        <div style={{ padding: "0 20px 20px 44px", borderTop: `1px solid ${T_.border}` }}>
          {concept.one_liner && <p style={{ fontSize: 14, color: T_.accent, marginTop: 16, marginBottom: 16, lineHeight: 1.5, fontStyle: "italic" }}>{concept.one_liner}</p>}
          {concept.explanation && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T_.green, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>What It Is</div>
              <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.explanation}</div>
            </div>
          )}
          {concept.example && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T_.blue, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Example</div>
              <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.example}</div>
            </div>
          )}
          {concept.analogy && (
            <div style={{ marginBottom: 16, background: `${T_.accent}08`, borderRadius: 8, border: `1px solid ${T_.accent}25`, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Think Of It Like...</div>
              <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.analogy}</div>
            </div>
          )}
          {concept.key_points?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T_.amber, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Key Points</div>
              {concept.key_points.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                  <span style={{ color: T_.amber, fontSize: 13, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{p}</span>
                </div>
              ))}
            </div>
          )}
          {concept.why_it_matters && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T_.red, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Why It Matters</div>
              <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.why_it_matters}</div>
            </div>
          )}
          {concept.related?.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: T_.textGhost, alignSelf: "center", marginRight: 4 }}>Related:</span>
              {concept.related.map((r, i) => (
                <span key={i} style={{ fontSize: 11, color: T_.textDim, background: T_.bgInput, padding: "3px 10px", borderRadius: 6, border: `1px solid ${T_.border}` }}>{r}</span>
              ))}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={e => { e.stopPropagation(); onDelete(concept.id); }} style={{ background: "none", border: `1px solid ${T_.border}`, color: T_.textGhost, padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: FONT }}
              onMouseEnter={e => e.target.style.color = T_.red} onMouseLeave={e => e.target.style.color = T_.textGhost}>Remove</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConceptsTab() {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addTopic, setAddTopic] = useState("ai");

  useEffect(() => {
    supabase.from("concepts").select("*").order("title", { ascending: true }).then(({ data }) => { setConcepts(data || []); setLoading(false); });
  }, []);

  const handleAdd = async () => {
    if (!addTitle.trim()) return;
    const c = { id: uid(), title: addTitle.trim(), topic: addTopic, one_liner: "", explanation: "", example: "", analogy: "", key_points: [], why_it_matters: "", related: [] };
    await supabase.from("concepts").upsert(c);
    setConcepts(prev => [...prev, c].sort((a, b) => a.title.localeCompare(b.title)));
    setAddTitle(""); setShowAdd(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("concepts").delete().eq("id", id);
    setConcepts(prev => prev.filter(c => c.id !== id));
  };

  const filtered = concepts.filter(c => {
    if (filter !== "all" && c.topic !== filter) return false;
    if (search) { const q = search.toLowerCase(); return (c.title || "").toLowerCase().includes(q) || (c.one_liner || "").toLowerCase().includes(q); }
    return true;
  });

  const inputStyle = { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, color: T_.text, fontSize: 14, padding: "10px 14px", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input style={{ flex: 1, minWidth: 200, ...inputStyle, fontSize: 13, padding: "9px 14px" }} placeholder="Search concepts..." value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={() => setShowAdd(true)} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>+ Add</button>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {TOPIC_FILTERS.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)} style={{
            background: filter === t.key ? `${T_.accent}20` : "transparent", border: `1px solid ${filter === t.key ? T_.accent : T_.border}`,
            color: filter === t.key ? T_.accent : T_.textDim, padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: FONT, fontWeight: filter === t.key ? 600 : 400,
          }}>{t.label}{t.key !== "all" && <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>{concepts.filter(c => c.topic === t.key).length}</span>}</button>
        ))}
      </div>
      <div style={{ fontSize: 12, color: T_.textGhost, marginBottom: 16 }}><span style={{ color: T_.text, fontWeight: 600 }}>{filtered.length}</span> concepts — A-Z. Click to expand.</div>
      {loading ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
        : filtered.length === 0 ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>{concepts.length === 0 ? "No concepts yet." : "No match."}</div>
        : filtered.map(c => <ConceptRow key={c.id} concept={c} expanded={expanded === c.id} onToggle={() => setExpanded(expanded === c.id ? null : c.id)} onDelete={handleDelete} />)}
      {showAdd && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, padding: 28, width: 440 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 600, color: T_.accent, marginBottom: 20 }}>Add Concept</div>
            <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Term</div>
              <input style={inputStyle} placeholder="e.g. FLOPs, EBITDA, RAG..." value={addTitle} onChange={e => setAddTitle(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleAdd(); }} /></div>
            <div style={{ marginBottom: 20 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Topic</div>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={addTopic} onChange={e => setAddTopic(e.target.value)}>{TOPIC_FILTERS.filter(t => t.key !== "all").map(t => <option key={t.key} value={t.key}>{t.label}</option>)}</select></div>
            <p style={{ fontSize: 12, color: T_.textDim, marginBottom: 20 }}>Add the term, then run <span style={{ color: T_.accent }}>"compile my wiki"</span> to generate the explanation.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: `1px solid ${T_.border}`, color: T_.textMid, padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: FONT }}>Cancel</button>
              <button onClick={handleAdd} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DEEP DIVES TAB
// ═══════════════════════════════════════════════════════

function DeepDiveDetail({ dive, onBack, onDelete }) {
  const sections = dive.sections || [];
  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: `1px solid ${T_.border}`, color: T_.textMid, cursor: "pointer", fontSize: 12, padding: "6px 14px", borderRadius: 6, marginBottom: 20, fontFamily: FONT }}>← Back</button>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: T_.blue, background: `${T_.blue}15`, padding: "3px 8px", borderRadius: 4 }}>{(TOPIC_FILTERS.find(t => t.key === dive.topic) || {}).label || dive.topic}</span>
        <span style={{ fontSize: 10, color: T_.textGhost }}>{sections.length} sections</span>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: T_.text, marginBottom: 8, lineHeight: 1.3 }}>{dive.title}</h1>
      {dive.summary && <p style={{ fontSize: 14, color: T_.textDim, marginBottom: 28, lineHeight: 1.6 }}>{dive.summary}</p>}

      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24 }}>
        {sections.map((sec, i) => (
          <div key={i} style={{ marginBottom: i < sections.length - 1 ? 24 : 0, paddingBottom: i < sections.length - 1 ? 24 : 0, borderBottom: i < sections.length - 1 ? `1px solid ${T_.border}` : "none" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: T_.accent, marginBottom: 10 }}>{sec.title}</div>
            {sec.content && <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap", marginBottom: sec.key_numbers?.length ? 12 : 0 }}>{sec.content}</div>}
            {sec.key_numbers?.length > 0 && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                {sec.key_numbers.map((kn, j) => (
                  <div key={j} style={{ background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}`, padding: "8px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: T_.textGhost, textTransform: "uppercase", marginBottom: 2 }}>{kn.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T_.blue }}>{kn.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {!dive._static && <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <button onClick={() => onDelete(dive.id)} style={{ background: "none", border: `1px solid ${T_.border}`, color: T_.textGhost, padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: FONT }}
          onMouseEnter={e => e.target.style.color = T_.red} onMouseLeave={e => e.target.style.color = T_.textGhost}>Remove</button>
      </div>}
    </div>
  );
}

const STRATEGY_DIVES = [
  { id: "strat_strategies", title: "Strategies", topic: "finance", _static: true,
    summary: "15 investment strategies — from beta-heavy allocations to pure alpha extraction.",
    sections: [
      { title: "Beta Plus", content: "Add alpha on top of market beta. ~80% passive market exposure (index fund) + ~20% concentrated alpha overlay of high-conviction picks. You still rise and fall with the market, but the alpha sleeve targets 1-3% excess return per year. Common forms: enhanced indexing, 130/30, core + satellite. Tracking error 2-5%. Main risk: alpha sleeve underperforms and fees eat into modest edge." },
      { title: "Market Neutral", content: "Pure alpha, no market direction. Long stocks you like, short an equal dollar amount of stocks you don't — net beta near zero. Returns come entirely from the spread between your longs and shorts. Gross exposure 150-300%, target return 4-8%. Uncorrelated to markets by design. Main risks: short squeezes, borrow costs, and correlation spikes that cause both sides to move together." },
      { title: "Factor Neutral", content: "Strip all systematic factor risk — value, momentum, size, quality, volatility — leaving only idiosyncratic stock-picking alpha. Goes beyond market neutral by also hedging factor exposures to zero. Requires a multi-factor risk model (Barra, Axioma). Purest test of investment skill but hardest to generate returns — you're removing all the easy risk premia." },
      { title: "Factor Strategies", content: "Harvest risk premia from persistent stock characteristics. Value (cheap vs expensive, ~2-4%/yr), momentum (winners keep winning, ~4-8%/yr), quality (profitable vs junk, ~2-3%/yr), size (small over large, ~1-3%/yr). Not alpha — compensation for bearing specific risks. Implemented via smart beta ETFs or long/short factor portfolios. Every factor has long drawdown periods (value: 2010-2020)." },
      { title: "Paired Trades", content: "Long one stock, short its closest peer within a sector — profit from the spread reverting to its historical norm. Classic pairs: Coke/Pepsi, Visa/Mastercard. Entry when spread deviates >2 standard deviations. Naturally hedged against market moves. Holding period days to weeks, win rate 55-65%. Main risk: structural divergence where the relationship breaks permanently." },
      { title: "Statistical Arbitrage", content: "Systematic alpha from micro-inefficiencies across 1,000-3,000 stocks. Quantitative models combine mean reversion, earnings momentum, sentiment, and alt data signals. Positions are tiny (0.1-0.5% each), holding periods 1-10 days, turnover very high. Edge comes from the law of large numbers. Players: Renaissance, Two Sigma, DE Shaw. Key risks: crowding, alpha decay (signal half-life 6-18 months), and transaction costs." },
      { title: "Convertible Arbitrage", content: "Buy a convertible bond (bond + embedded call option on the stock), short the underlying stock to delta-hedge. You earn the coupon (3-6% yield) plus convexity — if the stock moves big in either direction, the option gains more than the hedge loses. Profit from volatility via gamma scalping (rebalancing the hedge). Typical leverage 3-6x. Main risks: credit default, illiquidity in stress, short squeezes." },
      { title: "Merger Arbitrage", content: "When an acquisition is announced, buy the target at a discount to the deal price (typically 2-5% spread). Earn the spread when the deal closes in 2-6 months, annualizing to 6-12%. For stock deals, also short the acquirer. ~90% of deals close. Main risk: deal breaks send the target down 15-30%. Diversify across 15-30 deals. Edge comes from understanding regulatory, antitrust, and financing risk." },
      { title: "Relative Value Credit", content: "Exploit pricing inefficiencies between related credit instruments — same company's risk priced differently across bonds vs CDS, different maturities, or currencies. Long the cheap one, short the expensive one, profit when the spread normalizes. Credit markets are fragmented and less efficient than equities. Typical spread capture 50-200bp, leverage 3-8x. Main risks: illiquidity in credit crises, leverage amplifying losses." },
      { title: "Directional Macro", content: "Big concentrated bets on global macro trends via rates, FX, commodities, and equity index futures. Form a view on central bank policy, inflation, geopolitics, or growth divergences and express it directionally. 5-15 themes, vol target 10-20%. Famous trades: Soros/Bank of England, Paulson/subprime. Main risks: concentrated positions, timing (right thesis + wrong timing = loss), and deep liquidity making it hard to have edge." },
      { title: "Multi-Strategy", content: "Multiple independent strategy pods (20-200+) under one risk umbrella — the dominant hedge fund model. Each pod specializes (stat arb, merger arb, credit, macro). Central platform provides capital, risk limits, tech. Pods compete for capital; underperformers get cut. Target: 10-15% net, Sharpe 2.0-3.0+. Examples: Citadel, Millennium, Balyasny. Main risks: high pass-through fees (5-8% of NAV), crowding across platforms." },
      { title: "Long/Short Equity", content: "The classic hedge fund strategy. Long best ideas, short worst ideas, maintain net long bias of 30-70%. Returns from both alpha (stock picking) and beta (market exposure). Flavors: Tiger Cubs (concentrated, growth-biased), sector specialists, activist L/S. Can dial net exposure up/down based on market view. Main risks: beta drag in bear markets, shorting is hard (borrow costs, unlimited loss), timing net exposure." },
      { title: "Risk Parity", content: "Allocate by risk contribution, not dollar amount. In 60/40, equities drive ~90% of risk. Risk parity equalizes each asset class's risk contribution (equities, bonds, commodities, TIPS), then levers up to target return. Better diversification and Sharpe than 60/40. Bridgewater All Weather is the famous example. Main risks: leverage costs, rising rates crush the heavy bond weight (2022), and correlation spikes in crisis." },
      { title: "Trend Following / CTA", content: "Systematically go long rising prices, short falling prices across 50-100+ global futures markets. No fundamental view — follow price. Models use moving averages and breakout signals. Win rate only 35-45% but winners are much bigger than losers. Strong crisis alpha — profits from sustained crashes (2008, 2022: CTAs up 20-40%). Main risks: whipsaw in range-bound markets, extended drawdowns in trendless periods." },
      { title: "Core-Satellite", content: "60-80% cheap passive beta (index funds, ETFs) + 20-40% concentrated alpha satellites (hedge funds, active managers, thematic positions, alternatives). Fee-efficient — pay high fees only on the alpha portion. Core provides stability; satellites provide potential outperformance and diversification. Main risk: satellite selection — picking the wrong active managers wastes the alpha budget." },
    ] },
  { id: "strat_ls_pod_risk", title: "L/S Equity & Pod Shop Risk Framework", topic: "finance", _static: true,
    summary: "How long/short equity works inside a pod shop — exposure management, risk limits, VaR, alpha attribution, and the mechanics of degrossing. A deep reference for understanding how multi-manager platforms think about portfolio construction and risk.",
    sections: [
      { title: "Gross & Net Exposure", content: "Gross exposure is the total capital deployed: |Longs| + |Shorts|. A PM with $100M long and $80M short has $180M gross. It measures how much capital is at work — more gross means more potential P&L but also more risk. With leverage, gross can be 150-300%+ of allocated capital.\n\nNet exposure is the directional bet: Longs − Shorts. The same PM has +$20M net long, meaning slightly bullish. Both are expressed as % of NAV.\n\nDollar neutral means net exposure ≈ 0 — longs roughly equal shorts in dollar terms. P&L comes from stock selection, not market direction. Most pod shops mandate something close to dollar neutral, typically constraining net to a tight band like -10% to +10%.\n\nBeta neutral is stricter: adjusting for each position's beta so the portfolio's weighted beta to the market is ~0. A portfolio can be dollar neutral but still have beta exposure if the longs are higher-beta stocks than the shorts. Beta neutral removes that residual market sensitivity.",
        key_numbers: [
          { label: "Typical Gross", value: "150-300%" },
          { label: "Net Band", value: "±10%" },
          { label: "Positions Per Side", value: "30-80" }
        ] },
      { title: "Beta & Factor Exposure", content: "Market beta measures how much a stock or portfolio moves with the overall market. A beta of 1.2 means the position moves 20% more than the market. At a pod shop, portfolio beta to the S&P is constrained to a tight range (e.g., ±0.1) so the PM isn't making a hidden directional bet.\n\nFactor betas extend this idea to other systematic drivers of returns. The major factors:\n• Value — cheap vs expensive stocks (P/E, P/B, FCF yield)\n• Momentum — stocks that have been going up tend to keep going up\n• Size — small caps vs large caps\n• Quality — high ROE, stable earnings, low leverage\n• Low Volatility — boring stocks that move less\n\nEach of these factors earns a risk premium over time. If a PM's returns are just coming from being long momentum stocks and short value stocks, that's not alpha — it's factor exposure anyone can get cheaply through an ETF.\n\nPod risk systems (using models like Barra or Axioma) decompose every portfolio into its factor exposures in real time. The PM gets limits on each factor — e.g., no more than 0.3 standard deviations of momentum tilt. This forces the PM to generate returns from genuine stock selection rather than riding a factor wave.",
        key_numbers: [
          { label: "Beta Limit", value: "±0.1" },
          { label: "Major Factors", value: "5" },
          { label: "Risk Models", value: "Barra/Axioma" }
        ] },
      { title: "Alpha & P&L Decomposition", content: "At a pod shop, raw P&L is just the starting point. The risk team decomposes every dollar of return into its sources:\n\n• Beta P&L — returns from market exposure. If the market went up 2% and your portfolio had 0.1 beta, you earned ~0.2% from beta. This should be near zero if you're running dollar/beta neutral.\n\n• Factor P&L — returns from factor tilts. If momentum stocks rallied and you were tilted long momentum, some of your gains came from the factor, not your stock picks. This is 'fake alpha' that the platform strips out.\n\n• Residual / Idiosyncratic P&L — what's left after subtracting beta and all factor contributions. This is 'true alpha' — returns that came purely from picking the right stocks relative to their peers. This is what pods pay for.\n\nSharpe Ratio = Annualized Return / Annualized Volatility. The platform expects each PM to run at 1.5-2.5+ Sharpe. A PM making 20% with 15% vol (Sharpe 1.3) is valued less than one making 10% with 4% vol (Sharpe 2.5) because the second PM's returns are more efficient and can be levered up.\n\nInformation Ratio = Alpha / Tracking Error. Similar concept but measured against a benchmark. It captures how consistently a PM generates excess returns. An IR above 1.0 is strong; above 1.5 is elite. The difference from Sharpe: IR specifically measures skill relative to a benchmark, while Sharpe measures total risk-adjusted returns.\n\nThe key insight: pod shops don't want PMs who hit home runs occasionally. They want PMs who generate small, consistent, uncorrelated alpha that the platform can then lever up across dozens of pods.",
        key_numbers: [
          { label: "Target Sharpe", value: "1.5-2.5+" },
          { label: "Strong IR", value: "> 1.0" },
          { label: "Elite IR", value: "> 1.5" }
        ] },
      { title: "VaR & Risk Measurement", content: "Value at Risk (VaR) answers: 'What is the maximum I expect to lose over a given time period at a given confidence level?' A 1-day 95% VaR of $2M means: on 95% of days, you expect to lose no more than $2M. On the other 5% of days, losses will exceed that.\n\nThree methods to calculate VaR:\n\n1. Historical VaR — take actual portfolio returns over the past 1-3 years, rank them, pick the 5th percentile. Simple and assumption-free, but assumes the future looks like the past. Misses regime changes.\n\n2. Parametric / Variance-Covariance VaR — assume returns are normally distributed, calculate portfolio variance from position covariances, find the cutoff. Fast to compute, works well for liquid equities. Badly underestimates tail risk because returns aren't actually normal — fat tails are real.\n\n3. Monte Carlo VaR — simulate thousands of random return scenarios based on estimated distributions, compute portfolio P&L for each, find the 5th percentile. Most flexible (can model non-linear positions, fat tails, complex instruments). Also the most computationally expensive.\n\nConditional VaR (CVaR) / Expected Shortfall answers the follow-up question: 'When I DO breach VaR, how bad does it get on average?' If 95% VaR is -$2M, CVaR might be -$3.5M — meaning on those worst 5% of days, the average loss is $3.5M. CVaR is a better measure of tail risk and is what most sophisticated risk teams focus on.\n\nStress testing is scenario-based, not probabilistic. What happens to this portfolio in a 2008 replay? A sudden rate shock? A sector rotation out of growth into value? A liquidity crisis where correlations spike to 1? These scenarios don't have probabilities attached — they're 'what if' exercises that reveal hidden risks VaR models miss.",
        key_numbers: [
          { label: "Common VaR Confidence", value: "95-99%" },
          { label: "VaR Horizon", value: "1-10 days" },
          { label: "Monte Carlo Sims", value: "10,000+" }
        ] },
      { title: "The Pod Risk Framework", content: "A pod shop's risk framework is a nested hierarchy of limits, each layer constraining the one inside it:\n\nPosition level — No single name can exceed ~5% of the PM's gross exposure. If the PM has $200M gross, max position is ~$10M. This ensures no single stock blowing up can cause catastrophic damage. The PM's stop-loss on individual names is typically -8% to -12%, which translates to ~50bps of portfolio impact per name.\n\nSector level — Net exposure to any GICS sector is capped (e.g., ±5% of NAV). A healthcare PM can be long and short healthcare stocks all day, but can't be 20% net long the sector — that's a sector bet, not stock picking.\n\nPortfolio level — Overall gross, net, and beta limits. Gross might be capped at 200-300% of capital, net at ±10%, beta at ±0.1. Factor exposures constrained as described above.\n\nPod level — Drawdown limits are the hard behavioral constraint:\n• -2% from peak: risk team calls, PM explains the thesis\n• -3% from peak: forced to reduce gross by ~30%\n• -5% from peak: hard degross to ~50% of normal gross\n• -7% from peak: pod is shut down, positions liquidated\n\nThese are peak-to-trough drawdowns — the clock resets every time the PM makes new equity highs. This creates very specific PM behavior: cut losers fast (you can't 'hold and hope'), size carefully, and wait for catalysts before putting on big positions.\n\nRisk budgeting ties it all together. The platform doesn't just give a PM $200M and say 'go.' It allocates a risk budget — a VaR limit, a max drawdown, a gross limit. Capital is just one input. The real question is: how much risk is this PM allowed to take, and how efficiently are they using it?\n\nPlatform level — The CRO monitors correlations across all pods. If 15 pods own the same stock, that's concentration risk for the platform even if each individual PM is within limits. Cross-pod crowding analysis is a critical platform-level risk function.",
        key_numbers: [
          { label: "Max Position Size", value: "~5% of gross" },
          { label: "Soft Drawdown Limit", value: "-2% to -3%" },
          { label: "Hard Shutdown", value: "-5% to -7%" }
        ] },
      { title: "Degrossing & Crowding", content: "Degrossing means reducing gross exposure — selling longs AND covering shorts simultaneously. It's not about going directional; it's about reducing total capital at work.\n\nWhen degrossing happens:\n• Drawdown triggers — PM hits -3% or -5%, forced to cut gross by 30-50%. This is mechanical and non-negotiable.\n• Volatility spikes — risk systems automatically reduce exposure when realized or implied vol jumps. If VIX goes from 15 to 30, many pods will be forced to degross to stay within VaR limits even if they haven't lost money yet.\n• Margin calls — prime brokers tighten lending terms in stress, forcing deleveraging.\n• Correlation breakdown — if longs and shorts start moving in the same direction against you, the hedge isn't working and risk increases faster than P&L.\n\nCrowding is what makes degrossing dangerous. If 50 multi-manager pods own the same 'consensus long' and the same 'consensus short,' they'll all degross at the same time when stress hits. Everyone selling the same longs and covering the same shorts creates a cascading liquidation.\n\nThis is exactly what happened in January 2021 (GameStop/meme stocks) and August 2007 (quant quake). In 2007, a few quant funds started degrossing, which pushed down the popular longs and pushed up the popular shorts, triggering losses at other funds, forcing more degrossing — a doom loop.\n\nCorrelation and regime risk amplifies this. In normal markets, a diversified L/S book has many uncorrelated positions. In a crisis, correlations spike toward 1 — everything moves together. Your 'diversified' 60-stock long book suddenly acts like one big position. VaR models built on normal-period correlations massively underestimate the risk.\n\nPod shops monitor crowding actively: how many other pods (internal and street-wide) own the same names? How many days of volume would it take to liquidate the position? If a position is crowded AND illiquid, it gets flagged regardless of its fundamental merit.",
        key_numbers: [
          { label: "Forced Degross", value: "-3% to -5%" },
          { label: "VIX Trigger", value: "~30+" },
          { label: "Key Events", value: "2007, 2021" }
        ] },
      { title: "Pairs & Spread Thinking", content: "The fundamental mental model at a pod shop is the spread, not the individual stock. A PM doesn't ask 'will MSFT go up?' — they ask 'will MSFT outperform ORCL?' Every long has a corresponding short, and the unit of analysis is the pair.\n\nWhy this matters:\n• It removes the market direction question entirely. You don't need to know if the market goes up or down — you need to know which stock does better.\n• It forces discipline on the short side. Every long thesis must have a mirror: 'if I think Company A wins because of X, who loses?'\n• It makes position sizing clearer. The risk of a pair is the spread volatility, not the individual stock volatilities.\n\nTypes of pairs:\n• Intra-sector — Long the better company, short the weaker one in the same industry. Long Visa / Short Mastercard if you have a thesis on Visa's debit growth. The sector risk cancels out.\n• Catalyst vs no-catalyst — Long a stock going into an earnings beat / product launch, short a sector peer with no near-term catalyst as a hedge.\n• Structural — Long a secular winner, short a secular loser. Long cloud software / short legacy on-prem. These are longer-duration trades.\n\nPosition sizing in spread terms: if the pair has 15% annualized spread volatility and you want no more than 50bps of portfolio risk from this pair, you'd size it at ~3.3% of portfolio per leg (0.50% / 15% = 3.3%).\n\nThe key behavioral implication: PMs think about 'at-bats' — the number of independent spread bets they have on. More at-bats with smaller sizes produces higher Sharpe than fewer concentrated bets. A typical pod PM runs 30-60 pairs, each contributing a small amount of expected alpha. The law of large numbers works in your favor.",
        key_numbers: [
          { label: "Typical Pairs", value: "30-60" },
          { label: "Spread Vol", value: "~15% ann." },
          { label: "Max Pair Risk", value: "~50bps" }
        ] }
    ] },
  { id: "strat_covenants_seniority", title: "Covenants 101: Who Comes First — Types of Seniority", topic: "finance", _static: true,
    summary: "The four ways one class of debt can rank ahead of another — temporal, contractual, structural, and effective seniority — with worked examples of each and why seniority is always a relative concept.",
    sections: [
      { title: "The Four Types of Seniority", content: "There are four ways in which one class of debt can rank ahead of another:\n\n• Temporal seniority — the debt that matures first gets paid first.\n• Contractual seniority — the debtor and creditors agree who ranks in which order.\n• Structural seniority — debt of a subsidiary operating company gets paid before debt of its parent.\n• Effective seniority — debt with security over certain collateral has priority over unsecured debt (or debt secured on other assets), at least up to the value of that collateral.\n\nWhich kind is 'best' depends entirely on the facts — what other debt is in the capital structure and what characteristics that other debt has. There is no absolute ranking." },
      { title: "Temporal Seniority", content: "Temporal seniority means the debt that matures first gets repaid first — simply because it comes due earlier. It matters most in the run-up to a restructuring: a maturity wall forces the company to the negotiating table, and the holders of the near-term maturity have leverage because they can refuse to extend and push the company into default.\n\nBorrower-friendly drafting in recent years has eroded temporal seniority. 'Sidecar' facilities and the 'inside maturity basket' let borrowers incur new debt that matures AHEAD of existing debt, up to an agreed amount. That flips the priority — the new lender gets paid first even though the existing lender was there earlier.\n\nTemporal priority largely disappears in insolvency because all debt accelerates on a bankruptcy filing — every dollar becomes due at the same moment. So temporal seniority is a pre-insolvency negotiating tool, not a recovery tool.\n\nExample: A company has $500M of senior unsecured notes due 2027 and $300M of senior unsecured notes due 2031. Both rank pari passu contractually. But the 2027 holders have temporal seniority — the company must either repay or refinance them in 2027. If the business is struggling, the 2027 holders can demand better terms (higher coupon, collateral, covenants) in exchange for an extension, while the 2031 holders are stuck waiting. However, if the company files for Chapter 11 in 2026, both tranches accelerate and rank equally — the temporal edge vanishes." },
      { title: "Contractual Seniority", content: "Contractual seniority is where creditors AGREE the order in which different classes of debt get repaid — typically in an intercreditor agreement, sometimes in the credit document itself.\n\nFor unsecured debt, contractual seniority only ranks rights to PAYMENT. For secured debt, there's a second dimension: the ranking of rights to proceeds from ENFORCEMENT of the collateral. Practitioners distinguish these as:\n• Ranking in right of payment — who gets the company's free cash flow first\n• Ranking of security (lien subordination in the US) — who gets the enforcement proceeds first\n\nThe distinction matters for recoveries.\n\nExample — Super-senior RCF alongside senior secured bonds: A company has a $100M 'super senior' revolving credit facility and $800M of senior secured notes. Both share the SAME collateral and rank EQUALLY in right of payment — if the company pays interest or principal in the ordinary course, neither is subordinated to the other. But the intercreditor agreement says that when collateral is ENFORCED and sold, the RCF gets paid first from the proceeds. So if the collateral sells for $600M, the RCF gets its $100M in full, and the bonds get the remaining $500M (a 62.5% recovery). To the extent the bonds aren't repaid in full from collateral, the remaining $300M deficiency claim ranks EQUALLY with the RCF for any other recoveries — lien subordination doesn't extend to unsecured recoveries on the residual.\n\nThis split ranking is the core reason lenders fight over intercreditors — the same words 'senior secured' can mean very different recoveries depending on the lien waterfall." },
      { title: "Structural Seniority", content: "Structural seniority comes from WHERE two creditors sit in the corporate tree. Two facts drive it:\n1. Corporate entities have separate legal personalities — a subsidiary is its own legal entity separate from its parent.\n2. In almost every legal system, debt ranks ahead of equity — and a parent company is just a shareholder of its operating subsidiary.\n\nSo: a creditor lending directly to an operating subsidiary (where the cash flow and assets sit) gets paid from those assets before any value can be upstreamed as equity distributions to the parent. The parent-level lender only gets whatever is left after the operating company's creditors are paid — because the parent's only claim on the opco is as an equity holder.\n\nStructural seniority can be eliminated by having the operating subsidiary GUARANTEE the parent's debt. Then the parent's debt becomes a direct claim on the opco, ranking pari passu with other opco debt. This is why covenant analysis obsesses over guarantor coverage, and whether ratio debt and permitted debt baskets can be incurred by non-guarantor subsidiaries — debt incurred by non-guarantors is structurally senior to everything at the parent.\n\nExample — HoldCo PIK vs. OpCo Term Loan: Parent HoldCo has issued $400M of unsecured PIK notes. Its wholly-owned operating subsidiary OpCo has $600M of senior secured term loans outstanding. OpCo generates all the EBITDA; HoldCo has no assets other than OpCo's stock. If the group is liquidated and OpCo is worth $800M:\n• OpCo term loan holders get their $600M first (structurally senior AND contractually/effectively senior at the OpCo level).\n• The remaining $200M flows up to HoldCo as residual equity value.\n• HoldCo PIK note holders share that $200M — a 50% recovery.\nHad the OpCo guaranteed the PIK notes, they would rank pari passu with the term loan at the OpCo level (subject to any contractual subordination) and recoveries would be calculated very differently.\n\nThis is also why 'J.Crew' and 'Chewy' style transactions are so aggressive — they transfer valuable assets (IP, equity in subsidiaries) OUT to unrestricted or non-guarantor subsidiaries, putting them beyond the reach of existing creditors. Existing creditors become structurally subordinated to any new debt raised at the new entity." },
      { title: "Effective Seniority", content: "Effective seniority arises when one class of creditor has a lien on a SPECIFIC asset that another class does not — even if that other class has security over other assets. The collateralized creditor can enforce its lien, sell that asset, and apply the proceeds to its debt FIRST. Any other creditor only sees what's left, and only as an unsecured claim against the residual.\n\nEffective seniority is the driving force behind 'pari-plus' priming transactions. In these deals, new money is raised with a lien pari passu to existing secured debt on the existing collateral — so on paper it looks equal. But the new money ALSO gets a lien on ADDITIONAL collateral that the existing debt doesn't have (often held at a non-guarantor restricted subsidiary or an unrestricted subsidiary). That extra collateral gives the new money effective seniority without technically subordinating the existing lenders' liens.\n\nExample — Serta Simmons (pari-plus uptier): Serta had secured term loans outstanding. In 2020, a subset of lenders agreed to a transaction where the company issued new first-lien and second-lien loans to those participating lenders. The new loans had liens on the same collateral PLUS were structured to sit ahead in a new priority waterfall. Non-participating lenders, whose loans had been first-lien, were pushed down to third-lien — they still had a lien on the same collateral, but behind the new money. When the company later filed, the new-money participating lenders had effective seniority and recovered at par, while non-participants took significant haircuts. The legal battles around whether this was permitted by the credit agreement's 'open market purchase' language are still being litigated.\n\nSimpler example: Company has $500M of senior unsecured notes and raises $200M of new senior secured debt secured by the company's IP and receivables. Both rank 'senior' contractually. But if the company liquidates and the IP + receivables are worth $250M, the new $200M gets paid in full from that collateral pool first. The unsecured notes get whatever's left ($50M from that pool) plus their share of any unencumbered assets. The secured tranche has effective seniority up to the value of its collateral, even though it was labeled the same 'senior' as the notes." },
      { title: "What Is Most Senior?", content: "Seniority is ALWAYS relative. It depends on what other debt is in the capital structure and what characteristics that other debt has. There is no such thing as absolute seniority.\n\nIt can be better to hold 'subordinated' debt than 'senior' debt. For example, imagine:\n• Subordinated bond issued at the OpCo level, secured on real hard assets (real estate, equipment), with minimal other OpCo debt ahead of it.\n• 'Senior' PIK bond at a HoldCo level, unsecured — or secured only by the shares of the OpCo, which are worthless if the OpCo is insolvent.\n\nDespite its label, the 'subordinated' bond is likely to recover MORE in a downside: it's structurally senior (issued at OpCo), effectively senior (has real collateral), and sits ahead of the HoldCo PIK in any realistic waterfall. The HoldCo PIK is 'senior' in name only — its only real claim is to residual equity value that probably doesn't exist in a stress case.\n\nThe practical rule: ignore what the debt is CALLED (senior, senior secured, subordinated, second lien, mezzanine). Look at:\n1. WHERE in the group it sits (which entity is the issuer/borrower and which entities guarantee it — structural)\n2. WHAT collateral it actually has, and how valuable that collateral is in a downside case (effective)\n3. WHAT the intercreditor says about payment and lien priority relative to other debt at the same level (contractual)\n4. WHEN it matures relative to other debt (temporal — matters mostly pre-bankruptcy)\n\nSeniority labels are marketing. The credit agreement, the indenture, the intercreditor, and the org chart are the truth.",
        key_numbers: [
          { label: "Types of Seniority", value: "4" },
          { label: "Key Concept", value: "Relative" },
          { label: "Look At", value: "Docs, Not Labels" }
        ] }
    ] },
];

function DeepDivesTab() {
  const [dives, setDives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    supabase.from("deep_dives").select("*").order("title", { ascending: true }).then(({ data }) => { setDives(data || []); setLoading(false); });
  }, []);

  const handleDelete = async (id) => {
    if (id.startsWith("strat_")) return;
    await supabase.from("deep_dives").delete().eq("id", id);
    setDives(prev => prev.filter(d => d.id !== id));
    setSelected(null);
  };

  const allDives = [...STRATEGY_DIVES, ...dives].sort((a, b) => a.title.localeCompare(b.title));

  if (selected) return <DeepDiveDetail dive={selected} onBack={() => setSelected(null)} onDelete={handleDelete} />;

  return (
    <div>
      <p style={{ fontSize: 12, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
        Multi-section breakdowns of big topics — A-Z.
      </p>

      {loading ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
        : allDives.length === 0 ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>No deep dives yet.</div>
        : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {allDives.map(d => (
            <div key={d.id} onClick={() => setSelected(d)} style={{
              display: "flex", alignItems: "center", gap: 16, background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 20px", cursor: "pointer", transition: "border-color 0.2s",
            }} onMouseEnter={e => e.currentTarget.style.borderColor = T_.accent} onMouseLeave={e => e.currentTarget.style.borderColor = T_.border}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: T_.text }}>{d.title}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: T_.blue, background: `${T_.blue}15`, padding: "2px 8px", borderRadius: 4 }}>{(TOPIC_FILTERS.find(t => t.key === d.topic) || {}).label || d.topic}</span>
                  <span style={{ fontSize: 10, color: T_.textGhost }}>{(d.sections || []).length} sections</span>
                </div>
                {d.summary && <div style={{ fontSize: 13, color: T_.textDim, lineHeight: 1.5 }}>{d.summary}</div>}
                {!d.summary && (d.sections || []).length === 0 && <div style={{ fontSize: 12, color: T_.amber, fontStyle: "italic" }}>Pending — run "compile my wiki" to generate</div>}
              </div>
              <span style={{ color: T_.textGhost, fontSize: 14, flexShrink: 0 }}>→</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// ═══════════════════════════════════════════════════════
// BOOKMARKS TAB
// ═══════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════

export default function KnowledgeInterests() {
  const [activeTab, setActiveTab] = useState("concepts");

  return (
    <div style={{ padding: 0 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Knowledge / Interests</div>
        <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>Learn, explore, and save interesting things.</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B", marginBottom: 24, width: "fit-content", maxWidth: "100%" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: "8px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            border: "none", background: activeTab === t.key ? "#3B82F6" : "#111827",
            color: activeTab === t.key ? "#FFF" : "#94A3B8",
            fontFamily: FONT, transition: "all 0.15s", whiteSpace: "nowrap",
          }}>{t.label}</button>
        ))}
      </div>
      {activeTab === "concepts" && <ConceptsTab />}
      {activeTab === "deepDives" && <DeepDivesTab />}
    </div>
  );
}
