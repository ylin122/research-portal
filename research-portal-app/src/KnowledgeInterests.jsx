import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";

const TABS = [
  { key: "concepts", label: "Concepts" },
  { key: "deepDives", label: "Deep Dives" },
  { key: "bookmarks", label: "Bookmarks" },
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

      {/* Table of Contents */}
      {sections.length > 1 && (
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Contents</div>
          {sections.map((sec, i) => (
            <div key={i} style={{ fontSize: 13, color: T_.blue, marginBottom: 6, cursor: "pointer" }} onClick={() => { document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: "smooth" }); }}>
              {i + 1}. {sec.title}
            </div>
          ))}
        </div>
      )}

      {/* Sections */}
      {sections.map((sec, i) => (
        <div key={i} id={`section-${i}`} style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: T_.accent, opacity: 0.4 }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{ fontSize: 17, fontWeight: 600, color: T_.text }}>{sec.title}</span>
          </div>
          {sec.content && <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap", marginBottom: sec.key_numbers?.length ? 16 : 0 }}>{sec.content}</div>}
          {sec.key_numbers?.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, marginTop: 12 }}>
              {sec.key_numbers.map((kn, j) => (
                <div key={j} style={{ background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}`, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>{kn.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: T_.blue }}>{kn.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

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
];

function DeepDivesTab() {
  const [dives, setDives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addTopic, setAddTopic] = useState("ai");
  useEffect(() => {
    supabase.from("deep_dives").select("*").order("title", { ascending: true }).then(({ data }) => { setDives(data || []); setLoading(false); });
  }, []);

  const handleAdd = async () => {
    if (!addTitle.trim()) return;
    const d = { id: uid(), title: addTitle.trim(), topic: addTopic, summary: "", sections: [] };
    await supabase.from("deep_dives").upsert(d);
    setDives(prev => [...prev, d].sort((a, b) => a.title.localeCompare(b.title)));
    setAddTitle(""); setShowAdd(false);
  };

  const handleDelete = async (id) => {
    if (id.startsWith("strat_")) return;
    await supabase.from("deep_dives").delete().eq("id", id);
    setDives(prev => prev.filter(d => d.id !== id));
    setSelected(null);
  };

  const allDives = [...STRATEGY_DIVES, ...dives];

  const inputStyle = { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, color: T_.text, fontSize: 14, padding: "10px 14px", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

  if (selected) return <DeepDiveDetail dive={selected} onBack={() => setSelected(null)} onDelete={handleDelete} />;

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setShowAdd(true)} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>+ Request Deep Dive</button>
      </div>

      <p style={{ fontSize: 12, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
        Multi-section breakdowns of big topics. Add a topic, then run <span style={{ color: T_.accent }}>"compile my wiki"</span> to generate the full deep dive.
      </p>

      {loading ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
        : allDives.length === 0 ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>No deep dives yet. Click "+ Request Deep Dive" to start.</div>
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

      {showAdd && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, padding: 28, width: 440 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 600, color: T_.accent, marginBottom: 20 }}>Request Deep Dive</div>
            <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Topic</div>
              <input style={inputStyle} placeholder='e.g. "How LLM Training Works", "Data Center Economics"...' value={addTitle} onChange={e => setAddTitle(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleAdd(); }} /></div>
            <div style={{ marginBottom: 20 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Category</div>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={addTopic} onChange={e => setAddTopic(e.target.value)}>{TOPIC_FILTERS.filter(t => t.key !== "all").map(t => <option key={t.key} value={t.key}>{t.label}</option>)}</select></div>
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
// BOOKMARKS TAB
// ═══════════════════════════════════════════════════════

function BookmarksTab() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", content: "", source: "", source_url: "", topic: "other", tags: [] });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    supabase.from("bookmarks").select("*").order("created_at", { ascending: false }).then(({ data }) => { setBookmarks(data || []); setLoading(false); });
  }, []);

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    const b = { id: uid(), ...form, title: form.title.trim(), content: form.content.trim() };
    await supabase.from("bookmarks").upsert(b);
    setBookmarks(prev => [b, ...prev]);
    setForm({ title: "", content: "", source: "", source_url: "", topic: "other", tags: [] });
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const filtered = bookmarks.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (b.title || "").toLowerCase().includes(q) || (b.content || "").toLowerCase().includes(q) || (b.tags || []).some(t => t.toLowerCase().includes(q));
  });

  const inputStyle = { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, color: T_.text, fontSize: 14, padding: "10px 14px", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input style={{ flex: 1, minWidth: 200, ...inputStyle, fontSize: 13, padding: "9px 14px" }} placeholder="Search bookmarks..." value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={() => setShowAdd(true)} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>+ Save</button>
      </div>

      {loading ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
        : filtered.length === 0 ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>{bookmarks.length === 0 ? "No bookmarks yet. Save quotes, stats, insights, or anything interesting." : "No match."}</div>
        : filtered.map(b => (
        <div key={b.id} style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: T_.text }}>{b.title}</span>
            <button onClick={() => handleDelete(b.id)} style={{ background: "none", border: "none", color: T_.textGhost, cursor: "pointer", fontSize: 11, padding: "2px 6px" }}
              onMouseEnter={e => e.target.style.color = T_.red} onMouseLeave={e => e.target.style.color = T_.textGhost}>Remove</button>
          </div>
          {b.content && <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 10 }}>{b.content}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(b.tags || []).map((tag, i) => (
                <span key={i} style={{ fontSize: 10, color: T_.accent, background: `${T_.accent}12`, padding: "2px 8px", borderRadius: 4, border: `1px solid ${T_.accent}30` }}>{tag}</span>
              ))}
            </div>
            {b.source_url ? <a href={b.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: T_.blue, textDecoration: "none" }}>{b.source || "Source"} ↗</a>
              : b.source ? <span style={{ fontSize: 11, color: T_.textGhost }}>{b.source}</span> : null}
          </div>
        </div>
      ))}

      {showAdd && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, padding: 28, width: 500, maxHeight: "80vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 600, color: T_.accent, marginBottom: 20 }}>Save Bookmark</div>
            <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Title</div>
              <input style={inputStyle} placeholder="What is this about?" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Content / Note</div>
              <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical", lineHeight: 1.7 }} placeholder="Paste a quote, stat, insight, or your own note..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Source</div>
                <input style={inputStyle} placeholder="e.g. SemiAnalysis" value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} /></div>
              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>URL</div>
                <input style={inputStyle} placeholder="https://..." value={form.source_url} onChange={e => setForm(p => ({ ...p, source_url: e.target.value }))} /></div>
            </div>
            <div style={{ marginBottom: 20 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Tags</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                {form.tags.map((t, i) => (
                  <span key={i} onClick={() => setForm(p => ({ ...p, tags: p.tags.filter((_, j) => j !== i) }))} style={{ fontSize: 11, color: T_.accent, background: `${T_.accent}15`, padding: "3px 10px", borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.accent}30` }}>{t} ×</span>
                ))}
              </div>
              <input style={inputStyle} placeholder="Type a tag and press Enter..." value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && tagInput.trim()) { setForm(p => ({ ...p, tags: [...p.tags, tagInput.trim()] })); setTagInput(""); } }} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: `1px solid ${T_.border}`, color: T_.textMid, padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: FONT }}>Cancel</button>
              <button onClick={handleAdd} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════

export default function KnowledgeInterests() {
  const [activeTab, setActiveTab] = useState("concepts");

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T_.text, marginBottom: 4, fontFamily: FONT }}>Knowledge / Interests</h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
        Learn, explore, and save interesting things.
      </p>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${T_.border}`, paddingBottom: 1 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            background: "none", border: "none", borderBottom: activeTab === t.key ? `2px solid ${T_.accent}` : "2px solid transparent",
            color: activeTab === t.key ? T_.accent : T_.textDim, padding: "8px 20px", cursor: "pointer", fontSize: 13,
            fontWeight: activeTab === t.key ? 600 : 400, fontFamily: FONT, marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>
      {activeTab === "concepts" && <ConceptsTab />}
      {activeTab === "deepDives" && <DeepDivesTab />}
      {activeTab === "bookmarks" && <BookmarksTab />}
    </div>
  );
}
