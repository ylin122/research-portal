import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";
import TabBar from "./lib/TabBar";

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
  const [expanded, setExpanded] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addTopic, setAddTopic] = useState("ai");
  const [collapsedTopics, setCollapsedTopics] = useState({});

  useEffect(() => {
    supabase.from("concepts").select("*").order("title", { ascending: true }).then(({ data }) => { setConcepts(data || []); setLoading(false); }).catch(err => { console.error(err); setLoading(false); });
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

  const filtered = concepts.filter(c => filter === "all" || c.topic === filter);

  const inputStyle = { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, color: T_.text, fontSize: 14, padding: "10px 14px", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
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
      <div style={{ fontSize: 12, color: T_.textGhost, marginBottom: 16 }}><span style={{ color: T_.text, fontWeight: 600 }}>{filtered.length}</span> concepts grouped by topic. Click any topic header to collapse.</div>
      {loading ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
        : filtered.length === 0 ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>{concepts.length === 0 ? "No concepts yet." : "No match."}</div>
        : TOPIC_FILTERS.filter(t => t.key !== "all").map(topic => {
            const items = filtered.filter(c => c.topic === topic.key);
            if (items.length === 0) return null;
            const collapsed = collapsedTopics[topic.key];
            return (
              <div key={topic.key} style={{ marginBottom: 22 }}>
                <div onClick={() => setCollapsedTopics(p => ({ ...p, [topic.key]: !p[topic.key] }))}
                  style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${T_.border}`, cursor: "pointer", userSelect: "none" }}>
                  <span style={{ fontSize: 10, color: T_.textDim, transition: "transform 0.15s", transform: collapsed ? "rotate(0)" : "rotate(90deg)", display: "inline-block" }}>&#9654;</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T_.text, textTransform: "uppercase", letterSpacing: "0.8px" }}>{topic.label}</span>
                  <span style={{ fontSize: 11, color: T_.textGhost }}>{items.length}</span>
                </div>
                {!collapsed && items.map(c => <ConceptRow key={c.id} concept={c} expanded={expanded === c.id} onToggle={() => setExpanded(expanded === c.id ? null : c.id)} onDelete={handleDelete} />)}
              </div>
            );
          })}
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
      { title: "Factor Strategies", content: "Harvest risk premia from persistent stock characteristics. Value (cheap vs expensive, ~2-4%/yr), momentum (winners keep winning, ~4-8%/yr), quality (profitable vs junk, ~2-3%/yr), size (small over large, ~1-3%/yr). All ranges are long-term gross factor premia (academic / AQR-style); net-of-cost realized returns are typically 30-50% lower after implementation drag. Not alpha — compensation for bearing specific risks. Implemented via smart beta ETFs or long/short factor portfolios. Every factor has long drawdown periods (value: 2010-2020)." },
      { title: "Paired Trades", content: "Long one stock, short its closest peer within a sector — profit from the spread reverting to its historical norm. Classic pairs: Coke/Pepsi, Visa/Mastercard. Entry when spread deviates >2 standard deviations. Naturally hedged against market moves. Holding period days to weeks, win rate 55-65%. Main risk: structural divergence where the relationship breaks permanently." },
      { title: "Statistical Arbitrage", content: "Systematic alpha from micro-inefficiencies across 1,000-3,000 stocks. Quantitative models combine mean reversion, earnings momentum, sentiment, and alt data signals. Positions are tiny (0.1-0.5% each), holding periods 1-10 days, turnover very high. Edge comes from the law of large numbers. Players: Renaissance, Two Sigma, DE Shaw. Key risks: crowding, alpha decay (signal half-life varies by frequency — medium-frequency signals 6-18 months, intraday signals seconds-to-hours), and transaction costs." },
      { title: "Convertible Arbitrage", content: "Buy a convertible bond (bond + embedded call option on the stock), short the underlying stock to delta-hedge. You earn the coupon (3-6% yield) plus convexity — if the stock moves big in either direction, the option gains more than the hedge loses. Profit from volatility via gamma scalping (rebalancing the hedge). Typical leverage 3-6x. Main risks: credit default, illiquidity in stress, short squeezes." },
      { title: "Merger Arbitrage", content: "When an acquisition is announced, buy the target at a discount to the deal price (typically 2-5% spread). Earn the spread when the deal closes in 2-6 months, annualizing to 6-12%. For stock deals, also short the acquirer. ~90% of deals close. Main risk: deal breaks send the target down 15-30%. Diversify across 15-30 deals. Edge comes from understanding regulatory, antitrust, and financing risk." },
      { title: "Relative Value Credit", content: "Exploit pricing inefficiencies between related credit instruments — same company's risk priced differently across bonds vs CDS, different maturities, or currencies. Long the cheap one, short the expensive one, profit when the spread normalizes. Credit markets are fragmented and less efficient than equities. Typical spread capture 50-200bp, leverage 3-8x. Main risks: illiquidity in credit crises, leverage amplifying losses." },
      { title: "Directional Macro", content: "Big concentrated bets on global macro trends via rates, FX, commodities, and equity index futures. Form a view on central bank policy, inflation, geopolitics, or growth divergences and express it directionally. 5-15 themes, vol target 10-20%. Famous trades: Soros/Bank of England, Paulson/subprime. Main risks: concentrated positions, timing (right thesis + wrong timing = loss), and deep liquidity making it hard to have edge." },
      { title: "Multi-Strategy", content: "Multiple independent strategy pods (20-200+) under one risk umbrella — the dominant hedge fund model. Each pod specializes (stat arb, merger arb, credit, macro). Central platform provides capital, risk limits, tech. Pods compete for capital; underperformers get cut. Target: 10-15% net, Sharpe 2.0-3.0+. Examples: Citadel, Millennium, Balyasny. Main risks: high pass-through fees (5-8% of NAV), crowding across platforms." },
      { title: "Long/Short Equity", content: "The classic hedge fund strategy. Long best ideas, short worst ideas, maintain net long bias of 30-70%. Returns from both alpha (stock picking) and beta (market exposure). Flavors: Tiger Cubs (concentrated, growth-biased), sector specialists, activist L/S. Can dial net exposure up/down based on market view. Main risks: beta drag in bear markets, shorting is hard (borrow costs, unlimited loss), timing net exposure." },
      { title: "Risk Parity", content: "Allocate by risk contribution, not dollar amount. In 60/40, equities drive ~90% of risk. Risk parity equalizes each asset class's risk contribution (equities, bonds, commodities, TIPS), then levers up to target return. Better diversification and Sharpe than 60/40. Bridgewater All Weather is the famous example. Main risks: leverage costs, rising rates crush the heavy bond weight (2022), and correlation spikes in crisis." },
      { title: "Trend Following / CTA", content: "Systematically go long rising prices, short falling prices across 50-100+ global futures markets. No fundamental view — follow price. Models use moving averages and breakout signals. Win rate only 35-45% but winners are much bigger than losers. Strong crisis alpha — profits from sustained crashes (2008: SG CTA Index ~13%, top trend followers up to ~33%; 2022: SG Trend Index +27.3%, SG CTA Index +20.1%). Main risks: whipsaw in range-bound markets, extended drawdowns in trendless periods." },
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
  { id: "strat_twr_mwr_irr", title: "TWR vs MWR/IRR: How to Measure Returns", topic: "finance", _static: true,
    summary: "The two ways to measure investment performance — Time-Weighted Return judges the manager, Money-Weighted Return (≡ IRR) judges the investor's actual dollar experience. Why they diverge, which fund types use which, and the one principle that decides.",
    sections: [
      { title: "The Core Question", content: "TWR asks: how did the FUND do?\nMWR/IRR asks: how did YOUR WALLET do?\n\nThese metrics exist because cash flows — deposits, withdrawals, capital calls, distributions — change the answer. TWR strips them out. MWR/IRR keeps them in. Neither is 'more correct' — they answer different questions.\n\nThe single governing principle that decides which to use: WHO CONTROLS THE CASH FLOW TIMING?\n• If the INVESTOR controls it (open-ended fund, daily liquidity) — strip the investor's timing decisions out so you can isolate manager skill. Use TWR.\n• If the MANAGER controls it (private equity capital calls, deal exits) — those timing decisions ARE the manager's skill, so keep them in the number. Use MWR/IRR.\n\nThis one question decides 90% of the time which metric a fund reports.",
        key_numbers: [
          { label: "Two Questions", value: "Fund vs Wallet" },
          { label: "Decides It", value: "Who Times Flows" }
        ] },
      { title: "TWR — The Fund's Return", content: "Time-Weighted Return is the compound growth rate of $1 left in the fund from start to finish, with deposits and withdrawals stripped out.\n\nHow it's computed: break the period into sub-periods at each external cash flow. Compute each sub-period's return on the assets held through it, then geometrically link them:\n\nTWR = [(1 + r1) × (1 + r2) × ... × (1 + rn)] − 1\n\nWhere each ri ≈ (End − Begin − CashFlow) / Begin, using pre-cashflow valuations.\n\nWhat it means in practice: two investors with identical portfolios but completely different deposit/withdrawal timing get the EXACT SAME TWR. TWR is a property of the fund, not the investor. That's precisely what makes it the right metric for:\n• Judging manager skill\n• Comparing funds against each other\n• Benchmarking against indices (SPY's published return is TWR)\n• Public reporting and marketing\n\nKey mental image: TWR is the return experienced by an imaginary investor who bought $1 of the fund at t=0 and never touched it.",
        key_numbers: [
          { label: "Chain Rule", value: "(1+r1)×(1+r2)..." },
          { label: "Strips Out", value: "Cash Flow Timing" },
          { label: "Judges", value: "Manager Skill" }
        ] },
      { title: "MWR/IRR — The Investor's Return", content: "Money-Weighted Return is the single discount rate that sets the net present value of ALL cash flows to zero — contributions (negative), withdrawals (positive), and terminal value (positive):\n\nSum of [ CFt / (1 + MWR)^t ] = 0\n\nThat equation is LITERALLY the definition of Internal Rate of Return. In the CFA / GIPS vocabulary, MWR ≡ IRR applied to a portfolio's cash flows. Two names, one calculation.\n\nWhat it means in practice: MWR/IRR is dollar-weighted. If you had $1M exposed during a great year and $100M exposed during a bad year, the MWR is dominated by the $100M period. Timing and sizing of YOUR cash flows drive the answer.\n\nThat makes it the right metric for:\n• Judging the INVESTOR'S actual dollar experience\n• Judging a MANAGER when that manager controls the cash flows (private equity GPs deciding when to call capital and when to exit)\n• Project finance / single-deal analysis\n\nFootnote on Dietz: 'Modified Dietz' and 'Simple Dietz' are money-weighted return APPROXIMATIONS that use a weighted-average capital base instead of solving IRR iteratively. Some practitioners loosely call these 'MWR.' Strictly, true MWR = IRR; Dietz is a close cousin from the pre-computing era when solving IRR by hand was impractical.",
        key_numbers: [
          { label: "Definition", value: "NPV = 0" },
          { label: "Same As", value: "IRR" },
          { label: "Weighted By", value: "Dollars" }
        ] },
      { title: "Worked Example — Alice vs Bob", content: "One fund. Two investors. The fund returns +50% in Year 1, then −20% in Year 2.\n\nALICE puts in $100 at the start of Year 1. Does nothing else.\n• Start Y1: $100\n• End Y1: $150 (+50%)\n• End Y2: $120 (−20% on $150)\nAlice put in $100, ended with $120. Up $20 over 2 years.\n\nBOB puts in $100 at the start of Year 1. Then at the start of Year 2 — RIGHT BEFORE the bad year — he doubles down with another $100.\n• Start Y1: $100\n• End Y1: $150 (+50%)\n• Start Y2: $250 (after $100 deposit)\n• End Y2: $200 (−20% on $250)\nBob put in $200 total, ended with $200. He BROKE EVEN.\n\nTHE FUND'S TWR:\nTWR = (1 + 0.50) × (1 − 0.20) − 1 = 1.50 × 0.80 − 1 = +20% over 2 years\nThis is true for Alice, Bob, and every other investor. TWR is a property of the fund.\n\nALICE'S MWR:\nNo cash flows in the middle. $100 in at t=0, $120 out at t=2. MWR = (120/100)^(1/2) − 1 ≈ 9.54% annualized ≈ 20% over 2 years. Alice's MWR ≈ TWR because she didn't mess with timing.\n\nBOB'S MWR:\nSolve for r where 100 + 100/(1+r) = 200/(1+r)^2. Algebra: r = 0%. Bob's MWR is 0%, even though the fund's TWR is +20%.\n\nTHE LESSON:\nSame fund. Same TWR of +20%. But Bob had $250 exposed during the BAD year versus only $100 during the GOOD year. His dollar-weighted exposure was tilted toward the loss. The fund's performance was identical for both investors — Bob's TIMING is what killed his return. That's the entire reason the two metrics exist: TWR judges the manager, MWR/IRR judges the investor's actual outcome.",
        key_numbers: [
          { label: "Fund TWR", value: "+20%" },
          { label: "Alice MWR", value: "≈ +20%" },
          { label: "Bob MWR", value: "0%" }
        ] },
      { title: "Who Uses What, and Why", content: "Apply the governing principle — WHO CONTROLS THE CASH FLOWS — and the answer falls out almost mechanically.\n\nUSE TWR (investor-driven flows):\n• MUTUAL FUNDS — Investors subscribe and redeem daily at NAV. Manager has zero say in when money moves.\n• ETFs — Creation/redemption happens outside manager control.\n• HEDGE FUNDS — Usually monthly/quarterly liquidity. Fund reports TWR; LPs may track their own MWR.\n• SEPARATELY MANAGED ACCOUNTS (SMAs) — Client decides when to fund or withdraw.\n• UCITS / '40 Act REGISTERED FUNDS — Regulated open-ended structures.\n• PENSION FUNDS evaluating external managers — TWR for fair comparison across managers.\n\nUSE MWR/IRR (manager-driven flows):\n• PRIVATE EQUITY (buyout, growth) — GP calls capital when deals close, distributes when they exit. Timing IS the skill.\n• VENTURE CAPITAL — Same drawdown structure, GP-controlled exits.\n• PRIVATE DEBT / DIRECT LENDING — Capital called as loans originate.\n• CLOSED-END REAL ESTATE, INFRASTRUCTURE — GP times acquisitions and dispositions.\n• PROJECT FINANCE / SINGLE DEALS — One cash-flow stream, one IRR. This is where IRR was born.\n• CORPORATE CAPITAL BUDGETING — Any project NPV/IRR analysis.\n\nBOTH REPORTED (structure-dependent):\n• BDCs, INTERVAL FUNDS, EVERGREEN PE — Semi-liquid hybrids.\n• PENSION FUND TOTAL RESULTS — TWR for manager evaluation, MWR for actual funded-status reality.\n• FUND OF FUNDS — Inherits underlying structure.\n\nThe rule of thumb: PUBLIC MARKETS = TWR. PRIVATE MARKETS = MWR/IRR.",
        key_numbers: [
          { label: "Public Markets", value: "TWR" },
          { label: "Private Markets", value: "MWR/IRR" },
          { label: "Both", value: "Semi-Liquid" }
        ] },
      { title: "GIPS — The Industry Standard", content: "GIPS (Global Investment Performance Standards) is the CFA Institute's performance-reporting rulebook. Nearly every institutional asset manager claims GIPS compliance — it's the global benchmark for how performance must be calculated and presented.\n\nThe GIPS rule is basically the 'who controls flows' principle written into regulation:\n• For MOST COMPOSITES (long-only equity, fixed income, balanced, liquid alts): TWR is REQUIRED.\n• For PRIVATE-MARKET / CLOSED-END FUNDS (PE, VC, real estate, private debt, infrastructure): MWR/IRR (called 'Since-Inception IRR' in GIPS) is REQUIRED.\n\nThis split was formalized in the 2020 GIPS revision, which unified public and private market standards into one document. The split exists because the industry recognized that forcing a PE fund to report TWR would hide the most important thing — the GP's ability to time capital deployment and exits.\n\nHOW TO READ A PITCH DECK:\n• 'This mutual fund delivered 12% annualized over 10 years' = TWR, fund-level manager skill.\n• 'This PE fund generated 25% net IRR since inception' = MWR/IRR, full GP performance including timing.\n• Comparing them directly is apples to oranges — they answer different questions.\n\nAlso important: 'Since-inception' IRR for a PE fund continues updating as new cash flows occur until the fund fully liquidates. Mid-life IRRs are provisional — they can move meaningfully based on final exits.",
        key_numbers: [
          { label: "Standard", value: "GIPS 2020" },
          { label: "Public Composites", value: "TWR Required" },
          { label: "Private Funds", value: "IRR Required" }
        ] },
      { title: "IRR Quirks to Watch For", content: "IRR has three well-known flaws that matter any time you see a private fund pitch a big IRR number.\n\n1) REINVESTMENT ASSUMPTION\nIRR math implicitly assumes every interim distribution is reinvested at the IRR rate. In reality, distributions go to LPs who hold them in cash or deploy them into the next vintage. If a fund returns capital quickly with a high stated IRR, the LP's actual compounded return is usually LOWER than the IRR suggests.\n\n2) EARLY DISTRIBUTIONS INFLATE IRR\nA fund that invests $100M, flips one deal for $50M in Year 1 at a 5x multiple, and grinds through the rest of the portfolio for mediocre returns can still show a great HEADLINE IRR — because the early big win dominates the time-weighted math. The same fund's MOIC might be pedestrian. This is why PE investors NEVER look at IRR alone. The standard PE reporting set:\n• IRR — the speed of returns (time-value-weighted)\n• MOIC (Multiple on Invested Capital) — total magnitude (Total Value / Paid-In)\n• DPI (Distributions to Paid-In) — realized cash-on-cash, unrealized markups don't count\n• TVPI (Total Value to Paid-In) — realized + unrealized, same as MOIC in most usage\n\nA fund can look great on IRR and mediocre on MOIC — or vice versa. Sophisticated LPs triangulate across all four.\n\n3) MULTIPLE-IRR PROBLEM\nIf cash flows change sign more than once (invest → distribute → recapitalize → distribute again), the IRR equation is a polynomial that can have multiple valid roots. Mathematically more than one IRR exists. MIRR (Modified IRR, which specifies explicit reinvestment and financing rates) and NPV at a chosen hurdle rate are cleaner in these cases.\n\nThe takeaway: IRR is POWERFUL when used alongside other metrics, DANGEROUS when used alone.",
        key_numbers: [
          { label: "Report IRR With", value: "MOIC/DPI/TVPI" },
          { label: "Rewards", value: "Speed + Early Wins" },
          { label: "Sign Changes", value: "Multi-IRR Risk" }
        ] },
      { title: "Mental Model — When They Diverge", content: "The gap between TWR and MWR/IRR comes entirely from cash-flow TIMING. With zero cash flows in the middle, the two metrics converge to the same number.\n\nDIRECTION OF THE GAP:\n• Cash flows IN right before good performance → MWR > TWR (lucky timing)\n• Cash flows IN right before bad performance → MWR < TWR (unlucky timing, e.g., Bob)\n• Cash flows OUT right before good performance → MWR < TWR (withdrew before the rally)\n• Cash flows OUT right before bad performance → MWR > TWR (got out in time)\n• No cash flows → MWR ≈ TWR (Alice)\n\nTHE BEHAVIOR GAP:\nMorningstar publishes 'investor return' (asset-weighted MWR across all shareholders) alongside 'fund return' (TWR) for mutual funds. On average, investor return LAGS fund return by 1-2% per year over long periods. Reason: investors on average buy high (pile in after rallies) and sell low (capitulate in drawdowns). The fund delivers its TWR to the patient investor, but the impatient dollar-weighted experience (MWR) is worse. Target-date and balanced funds show the smallest behavior gap; sector/thematic funds show the largest (investors chase heat).\n\nPRACTICAL USES:\n• Comparing your own brokerage account to SPY: use YOUR TWR vs SPY's TWR. Most brokerages can compute both. Apples to apples.\n• Judging whether your cash-flow decisions added value: compare YOUR MWR vs YOUR TWR. If MWR > TWR, your timing helped. If MWR < TWR, your timing hurt. That gap is pure timing alpha (or drag).\n• Judging a manager: use TWR only.\n• Judging a private-fund GP: use IRR alongside MOIC/DPI/TVPI.\n\nONE-LINE SUMMARY:\nTWR = how the fund performed. MWR/IRR = how YOU performed. Manager skill uses the first; investor outcome uses the second.",
        key_numbers: [
          { label: "Zero Flows", value: "TWR = MWR" },
          { label: "Behavior Gap", value: "~1-2%/yr drag" },
          { label: "Your Timing", value: "MWR − TWR" }
        ] }
    ] },
  { id: "infra_gpu_tco", title: "GPU Cost of Ownership", topic: "infrastructure", _static: true,
    summary: "How to think about total cost of ownership for AI accelerators — the capex/opex stack, why PUE is the hidden multiplier, what the right denominator is for TCO ratios, and a worked GB300 NVL72 example. Frames who in the AI value chain captures what.",
    sections: [
      { title: "The Skeleton Equation", content: "The full TCO of one GPU over its useful life is:\n\nTCO = Capex_amortized + Opex_power + Opex_other  (per unit time)\n\nWhat you actually want to know is TCO PER UNIT OF USEFUL WORK — that's the denominator that converts dollars into something investable:\n\n$/PFLOP-hour    = TCO_per_hour / (theoretical_FLOPS × utilization)\n$/M_tokens_out  = TCO_per_hour / (tokens_per_hour × cache_efficiency)\n\nThe first metric is what hardware analysts use; the second is what application economics actually run on. They diverge because of utilization, software efficiency, cache hit rates, and pricing markup — and that gap is where value capture happens.\n\nSemiAnalysis's '$0.28/PFLOP' for VR NVL72 is the first number; their '$0.99/M tokens for Opus 4.7 agentic workloads' is the second. The gap between them shows how much application-layer leverage exists on top of pure compute cost. As you go up the stack, every layer can mark up its share — but only if the layer below has not yet exercised its pricing power.",
        key_numbers: [
          { label: "Two Denominators", value: "Compute vs Tokens" },
          { label: "VR NVL72 $/PFLOP", value: "$0.28" },
          { label: "Opus 4.7 $/M Tokens", value: "$0.99" }
        ] },
      { title: "Capex — The Upfront Stack", content: "The GPU itself is only ~50-60% of the capex of a deployed system. The full bill of materials:\n\n• GPU die + HBM — ~50-60% of system capex. HBM share is rising as memory pricing inflects (HBM allocation pricing up 6x YoY in 1Q26 per SemiAnalysis; broader TrendForce contract benchmarks show ~20% YoY on HBM3E with allocation premiums driving the larger figure; SOCAMM heading toward $13/GB by end of 2026).\n• CPU host (Grace, Intel/AMD) — ~5-8%. Ratio of CPU:GPU has been falling.\n• NVLink switches + scale-up fabric — ~8-12%. The 'NVL72' magic — non-trivial cost.\n• Scale-out networking (InfiniBand, optics, switches) — ~10-15%. Co-packaged optics (CPO) reduces this in next gen.\n• Storage (NVMe, parallel FS — Vast, Weka, DDN) — ~3-5%. Often allocated, not co-located.\n• Server chassis, motherboard, PSU — ~5-8%.\n• Datacenter buildout (allocated) — $10-15M/MW shell + power. Amortized separately, often into $/kW-month.\n\nTwo non-obvious points:\n\n• THE NETWORKING LINE IS RISING. As clusters scale to 100K+ GPUs, the all-to-all bandwidth requirement explodes. This is why Broadcom is a co-beneficiary of every Nvidia generation, and why CPO matters — it cuts both capex and power on optics simultaneously.\n• HBM IS THE SWING FACTOR. When memory vendors capture pricing power (6x HBM, $13/GB SOCAMM), memory takes share of system capex from compute. That changes who in the stack benefits from the next $1B AI capex order — even if Nvidia doesn't change its sticker.",
        key_numbers: [
          { label: "GPU + HBM Share", value: "50-60%" },
          { label: "Networking Share", value: "10-15%" },
          { label: "DC Shell Cost", value: "$10-15M/MW" }
        ] },
      { title: "Opex — Power Math", content: "Opex is dominated by power — typically 60-80% of operating cost. The formula:\n\nAnnual_power_cost = IT_kW × PUE × 8760 × $/kWh\n\nFor one GB300 GPU at 1.4 kW TDP:\n• IT load: 1.4 kW\n• Effective load (85% utilization): 1.19 kW\n• PUE: 1.15 (modern liquid-cooled facility)\n• Power rate: $0.07/kWh (cheap industrial — TX, OK, IA)\n• Hours: 8760\n\n1.19 × 1.15 × 8760 × $0.07 = ~$840/year per GPU\n\nBump to a $0.12/kWh region (most coastal US) → $1,440/yr. That alone is a 70% swing from siting alone.\n\nFor a 100,000-GPU GB300 cluster: 140 MW IT load → 161 MW total at PUE 1.15 → ~$98M/year in power at $0.07/kWh.\n\nOther opex lines:\n• Cooling — folded into PUE, see next section.\n• Bandwidth/network — modest, mostly egress for inference.\n• Personnel — small for hyperscalers (~5%), larger for neoclouds (~10%).\n• Maintenance/spares — small but non-zero, especially for HBM and optics replacements.\n• Real estate / colo lease — applies if not self-built; can be 15-25% of opex.",
        key_numbers: [
          { label: "Power Share of Opex", value: "60-80%" },
          { label: "GB300 Power/yr/GPU", value: "~$840" },
          { label: "Siting Swing", value: "70%" }
        ] },
      { title: "PUE — The Hidden Multiplier", content: "PUE = (total facility power) / (IT equipment power). It's the tax on every watt your GPU draws — and it hides 20-40% of cost in plain sight.\n\nTypical ranges:\n• 1.05-1.10 — Theoretical / extreme immersion. Few production sites.\n• 1.10-1.20 — World-class hyperscaler, liquid-cooled. Google, Meta, latest Microsoft.\n• 1.25-1.40 — Modern colo with hot-aisle containment. Most newer Equinix, CoreSite.\n• 1.40-1.60 — Older enterprise / retrofitted. Lots of legacy capacity.\n• 1.60-2.00+ — Bad / hot climate / inefficient cooling. What you don't want.\n\nWhy it matters at scale: at 100 MW IT load and $0.07/kWh, going from PUE 1.5 to PUE 1.15 saves:\n\n(1.5 − 1.15) × 100 MW × 8760 × $70/MWh = $21.5M/year\n\nOver a 4-year asset life, that's $86M of pure savings — comparable to capex on ~1,500 GPUs.\n\nPUE is also why liquid cooling went from option to mandatory. GB300 at 1.4 kW per GPU pushes NVL72 racks to ~130-150 kW (GB200 baseline was ~120 kW). Vera Rubin pushes per-GPU TDP higher (industry consensus ~1.8-2.0 kW), with rack densities heading toward 200+ kW. Air cooling tops out around 30-40 kW per rack. So liquid cooling isn't a luxury — it's the only physically viable option, and as a side effect it pushes PUE down toward 1.1.\n\nThis is why the GB300 → VR NVL72 transition has only a small capex/W increase ($37.4 → $38.1 per the SemiAnalysis 'AI Value Capture' analysis): liquid cooling is already amortized into the buildout. The hard part (going from air to liquid) already happened. Subsequent generations get to run on the same plumbing.\n\nCooling capex anchors:\n• Air cooling: ~$1-2M per MW IT — cheap upfront, high PUE.\n• Direct-to-chip liquid: ~$3-5M per MW IT — recovers via lower PUE in 12-24 months at modern density.\n• Immersion: ~$5-8M per MW IT — lowest PUE, longest payback.",
        key_numbers: [
          { label: "World-Class PUE", value: "1.10-1.20" },
          { label: "100MW Savings", value: "$21.5M/yr" },
          { label: "Air Cooling Limit", value: "30-40 kW/rack" }
        ] },
      { title: "The Performance Denominator", content: "What you 'get' for your TCO is more nuanced than peak FLOPS. Three concepts:\n\nTHEORETICAL FLOPS — vendor spec (GB300: 5 PFLOPS FP8 dense, 10 PFLOPS sparse; Rubin: ~2x higher).\n\nMFU (Model FLOPS Utilization) — fraction of theoretical FLOPS your model actually achieves. Training MFU on H100: 30-55% typical, 60% best-in-class. Higher MFU on B200/GB300 because of FP4 support and Multi-Token Prediction.\n\nGOODPUT — MFU × cluster_uptime. At 10K+ GPU scale, single-node failures are constant. Google claims 97% goodput on TPU 8t superpods (per Damnang's analysis); Nvidia clusters typically run 92-96%. The 5-point gap is a real moat — at $5/GPU-hour rental, 5% goodput = $400+ per GPU per year of lost revenue.\n\nFor INFERENCE the equivalents are:\n• Tokens/sec/GPU — raw throughput\n• Cache hit rate — 90%+ for agentic workloads, explains the SemiAnalysis $0.99/M effective price vs. $5/$25 sticker\n• Concurrency — how many sessions you can serve per GPU\n• Input:output ratio — agentic workloads run 300:1, very different from chat 1:1\n\nThe trap: vendors quote peak FLOPS at lowest precision (FP4) on synthetic workloads. Real models run at ~30-50% MFU on FP8 with overhead. The honest number is usually 0.3-0.5x the marketing number.\n\nWhat this means in TCO: when SemiAnalysis says '14x software-only throughput improvement on B300' (wideEP, disaggregation, MTP), they're saying the DENOMINATOR of $/PFLOP-hour grows 14x without any hardware change. That's why the same chip delivers radically different unit economics over its life. Software optimization is the most underappreciated TCO driver.",
        key_numbers: [
          { label: "Training MFU", value: "30-55%" },
          { label: "Goodput Range", value: "92-97%" },
          { label: "Software Gain on B300", value: "14x" }
        ] },
      { title: "Key TCO Metrics", content: "The right metric depends on the question:\n\n• $/PFLOP-HOUR — Pure compute cost. Compares hardware fairly across precisions. SemiAnalysis benchmark for VR NVL72: $0.28/PFLOP for customers, 60% improvement over GB300.\n• $/M TOKENS (input/output) — Application unit economics. Diverges hugely from sticker due to cache + batching.\n• PERFORMANCE/WATT — Power-bound efficiency. Critical when power is the binding constraint (which it increasingly is).\n• PERFORMANCE/TCO — True economic efficiency. The metric that should drive purchase decisions.\n• GOODPUT-ADJUSTED FLOPS — Real delivered compute. Reliability is hidden value.\n• CAPEX/WATT ($/W) — Buildout efficiency. GB300 → VR went $37.4 → $38.1 — basically flat, signaling Nvidia restraint on pricing.\n• MFU / UTILIZATION — How much of theoretical you capture. Software stack maturity proxy.\n\nReading these in tension reveals the structural story:\n\n• A vendor's marketing pitch shows peak FLOPS/$ at FP4. That's the most generous denominator — multiply by 0.3-0.5x for honest workloads.\n• A neocloud's pricing is anchored to $/GPU-hour, which translates to $/PFLOP-hour at vendor-spec utilization. Customers care about $/M tokens delivered, which is 5-50x lower per token than the rental rate suggests because of batching and caching.\n• The gap between the rental rate (cost-based, with neocloud margin) and the value delivered to the application (token economics) is what SemiAnalysis means by 'value capture shifting upstack.' It's not that anyone's getting cheated — it's that whoever sits closest to the application can take a markup on every layer below.",
        key_numbers: [
          { label: "VR NVL72 $/PFLOP", value: "$0.28" },
          { label: "VR vs GB300 Gain", value: "60%" },
          { label: "GB300 → VR Capex/W", value: "$37.4 → $38.1" }
        ] },
      { title: "How TCO Changes Over Time", content: "Six forces compress or expand TCO over a GPU's useful life:\n\n1. SOFTWARE OPTIMIZATION — Same chip, more throughput. The 14x B300 software gain is the single most underappreciated TCO driver. Buy a GPU in 2025, get 14x more useful work out of it by 2027 with the same capex.\n\n2. GENERATIONAL DISPLACEMENT — H100 → H200 → B100 → B200 → GB300 → VR. Each ~12-18 months, ~2x perf at ~1.3-1.5x cost. Perf/$ improves 30-50% per gen, which means OLDER GPUS DEPRECIATE FASTER ECONOMICALLY THAN THEY DO ON THE BOOKS. This is why hyperscaler dep schedule extensions (Microsoft 2022, Meta and Google 2023 to 6 years; Amazon partially reversed to 5 years for AI servers in early 2025) are an EPS lever but also a deferred quality-of-earnings risk that cuts both ways.\n\n3. MEMORY PRICING — HBM allocation pricing up 6x YoY (per SemiAnalysis; ~20% on contract benchmarks per TrendForce) changes margin distribution within the system. If memory is now 25% of system cost vs. 15%, GPU vendors lose share of the BOM to memory vendors.\n\n4. POWER COSTS — Generally rising in load-zone constrained markets (NoVa, Dublin, Frankfurt), flat-to-down in renewable-rich regions (TX, IA, WA). Siting decisions made in 2024 lock in 4-year economics.\n\n5. COOLING EFFICIENCY — PUE has trended down 5-10 bps per year industry-wide. Cumulative effect over a 4-year asset is meaningful.\n\n6. RESALE VALUE — Almost zero historically. ML accelerators don't have a strong secondary market, unlike CPUs. This means salvage value in TCO models should be ~$0.\n\nThe combined effect: TCO at year 0 of an asset can look very different from TCO at year 3. The model that justified the purchase may have been correct for that day; what actually shows up in the P&L depends on how all six forces evolve. The biggest mistake in TCO modeling is treating these as static.",
        key_numbers: [
          { label: "Software Gain on B300", value: "14x" },
          { label: "Generation Cycle", value: "12-18 months" },
          { label: "HBM Pricing (YoY)", value: "+6x (SemiAnalysis)" }
        ] },
      { title: "Worked Example — GB300 NVL72", content: "Reasonable production assumptions (numbers approximated; vendor pricing varies):\n\n• Rack capex (72 GPUs + Grace + NVLink + tray): ~$3.5M\n• Per-GPU capex: ~$48,600\n• Per-GPU TDP: 1.4 kW\n• Useful life: 4 years\n• PUE: 1.15\n• Power rate: $0.07/kWh\n• Load factor: 85%\n\nCAPEX PER GPU PER YEAR (straight-line):\n$48,600 / 4 = $12,150\n\nPOWER PER GPU PER YEAR:\n1.4 × 0.85 × 1.15 × 8760 × $0.07 = $840\n\nNetworking/storage allocation: ~$1,500-2,000/yr\nDatacenter buildout amortization: ~$1,500/yr\nPersonnel + maintenance + miscellany: ~$500/yr\n\nTOTAL TCO PER GPU PER YEAR: ~$16,500\nTCO PER GPU PER HOUR: ~$1.88\n\nReading this against neocloud rental rates:\n• Sticker rental for H100: $2.50-4.00/GPU-hr\n• Implied for GB300: $4.50-6.00/GPU-hr\n• SemiAnalysis cost-based floor for VR NVL72: $4.92/hr — slightly higher because VR will be more expensive per GPU (~$60-70K) and HBM cost is rising.\n\nWhere the gross margin lives — at $4.92/hr rental and ~$1.88/hr TCO, gross margin is ~$3/hr per GPU. At 85% utilization, that's ~$22K/yr per GPU. Sounds great, but financing the capex (often 10%+ cost of capital for neoclouds) consumes ~$5K of that. Net ~$17K/yr per GPU at full utilization.\n\nThat's the IRR equation that produces the '15.6% hurdle rate' SemiAnalysis references — it's not generous, and it's why neoclouds are sensitive to utilization slipping below ~80%. A neocloud that can't keep utilization high doesn't just lose margin — it goes upside-down on the IRR pretty quickly.",
        key_numbers: [
          { label: "GB300 TCO/yr/GPU", value: "~$16,500" },
          { label: "TCO/hour", value: "~$1.88" },
          { label: "VR NVL72 Floor", value: "$4.92/hr" }
        ] },
      { title: "The Investing Lens", content: "Every line in the TCO equation maps to a publicly investable name:\n\n• GPU die — NVDA, AMD. Pricing power, cycle position.\n• HBM — MU, Hynix, Samsung. Tightening supply, 6x YoY pricing.\n• Networking — AVGO (Tomahawk), MRVL (custom), ANET (switches). Scale-out fabric expansion.\n• Optics — COHR, FN, LITE; CPO disrupting near-term. CPO compresses both capex and opex on optics.\n• Datacenter buildout — EQIX, DLR (REITs); VRT (cooling/power infra). Power/PUE economics.\n• Power — NEE, CEG, VST (utilities). Capacity scarcity, PPA pricing power.\n• Foundry — TSM. Node access bottleneck, deliberate restraint.\n\nThe SemiAnalysis 'value capture shifting to model labs' thesis read through this framework:\n• The numerator (TCO) is getting bigger but slower (Nvidia restraint, TSMC restraint, capex/W barely moving).\n• The denominator (useful tokens delivered) is exploding (software + Rubin perf + cache hits + agentic batching).\n• The application-layer take rate is widening because customer willingness-to-pay for agentic workloads has decoupled from raw compute cost.\n\nWhat to watch:\n• HBM share rising + pricing power → bullish memory.\n• Networking share rising + Broadcom dominance → bullish AVGO.\n• Power share constant but capacity-constrained → bullish utilities/REITs in load-zones.\n• GPU share constant + Nvidia restraint → margin expansion deferred but stored (the 40% headroom doesn't vanish, it gets exercised eventually).\n• Inference cost falling 14x via software → bullish any model-layer with pricing power (private labs + GOOGL + MSFT through partners).\n\nPortfolio exposure (direct beneficiaries of the TCO framework): NVDA, MU, TSM, AVGO, MRVL, GOOGL, MSFT.",
        key_numbers: [
          { label: "Capex Beneficiaries", value: "NVDA, MU, AVGO, TSM" },
          { label: "Power Beneficiaries", value: "EQIX, DLR, VRT, CEG" },
          { label: "Margin Expansion Bias", value: "Memory > GPU near-term" }
        ] },
      { title: "Mental Model Summary", content: "Three sentences that capture how to think about GPU TCO:\n\n1. CAPEX IS ~75% OF A 4-YEAR TCO; POWER IS MOST OF THE REST. PUE is the multiplier on the second-largest line — that's why hyperscaler PUE leadership is a real moat, not vanity.\n\n2. THE USEFUL DENOMINATOR IS GOODPUT-ADJUSTED FLOPS OR TOKENS-PER-HOUR, NOT PEAK FLOPS. Software improvements expand this denominator on the same hardware — sometimes 10x+ over an asset's life — which is why 'what you bought' is not what 'you operated.'\n\n3. WHERE TCO SHARE IS GROWING TELLS YOU WHICH LAYER HAS PRICING POWER. HBM share rising means memory vendors take more of every $1B AI capex order. Networking share rising means Broadcom does. Inference cost-per-token falling faster than rental rates means model labs do. The 'shift to model labs' thesis is just this framework applied to the application layer.\n\nThe operational instinct to develop: when you read any AI infrastructure analysis, immediately ask:\n• Is this changing the numerator (TCO) or the denominator (useful work)?\n• Which layer's share of the BOM is moving?\n• Who has pricing power at that layer right now?\n• What's the binding constraint (silicon, memory, power, cooling, network)?\n\nThe layer that's both gaining share AND has pricing power is where the profits go. Everything else is detail.",
        key_numbers: [
          { label: "Capex Share of TCO", value: "~75%" },
          { label: "Software Lifetime Gain", value: "10x+" },
          { label: "Profit Goes To", value: "Pricing × Share Gain" }
        ] }
    ] },
  { id: "sw_lang_basics", title: "Programming Languages: A Refresher", topic: "software", _static: true,
    summary: "A working refresher on the major general-purpose languages — Python, JavaScript/TypeScript, Java, C, C++, Go, Rust, SQL — what makes each distinctive (type system, memory model, concurrency) and when to pick one over another. Aimed at restoring fluency, not teaching from scratch.",
    sections: [
      { title: "When to Pick What", content: "Language choice is downstream of constraints — what runtime is required, what team you have, what ecosystem the problem already lives in. Rules of thumb:\n\nPICK PYTHON when: the bottleneck is developer time, not runtime. Data analysis, ML/AI, scripting, prototyping, glue between systems. Anything where heavy compute can sit in C/Fortran libraries (NumPy, PyTorch).\n\nPICK TYPESCRIPT when: you're shipping to browsers (no choice) or building a fullstack app with shared types. Node/Deno/Bun for backend if your team is JS-strong. Skip plain JS for non-trivial work — TS catches too much value to give up.\n\nPICK JAVA (or KOTLIN) when: enterprise backend with mature concurrency needs, big data processing (Spark, Flink, Kafka), Android. The JVM ecosystem is unmatched for backend infra at scale.\n\nPICK GO when: building cloud infrastructure tooling, networking services, or CLIs that need to run on many platforms. Anything that benefits from very fast compiles, easy cross-compilation, and a small static binary.\n\nPICK RUST when: you need C-level performance with safety guarantees. Systems software, performance-critical libraries, anything where memory bugs are unacceptable. Worth the learning curve when correctness matters more than time-to-market.\n\nPICK C++ when: Rust isn't an option (legacy codebase, ecosystem missing, team familiarity), and Go/Java are too slow. Game engines, HFT, ML compiler internals, browsers.\n\nPICK C when: you're writing a kernel, embedded firmware, or an FFI layer — or maintaining one of the millions of existing C codebases.\n\nPICK SQL when: the data lives in a database. Always learn enough SQL to read query plans — abstracting it away via ORMs has consistent costs.\n\nTHE META-RULE: match the language to the constraint that matters most — performance, safety, ecosystem, hiring, time-to-market. There is no 'best' language, only best-for-this-problem.",
        key_numbers: [
          { label: "Meta-Rule", value: "Match Language to Constraint" },
          { label: "'Best Language'", value: "Doesn't Exist" },
          { label: "What Matters", value: "Ecosystem · Team · Perf" }
        ] },
      { title: "The Language Landscape", content: "Most modern languages can be sorted along three axes — and almost everything else (performance, safety, what bugs are possible, what the runtime looks like) follows from the choices on these axes.\n\nTYPE DISCIPLINE\n• Static = types known and checked at compile time (Java, C++, Go, Rust, TypeScript)\n• Dynamic = types checked at runtime (Python, JavaScript, Ruby)\n• Strong = no implicit conversion between unrelated types (Python, Rust)\n• Weak = implicit coercion happens (JavaScript, C)\n\nMEMORY MODEL\n• Manual = programmer calls malloc/free or new/delete (C, classic C++)\n• Garbage collected = runtime reclaims unreferenced memory (Java, Python, Go, JavaScript, C#)\n• Ownership = compiler tracks who owns each value at compile time (Rust)\n\nEXECUTION MODEL\n• Compiled to native = source → machine code at build time (C, C++, Rust, Go)\n• Interpreted = bytecode/AST executed by a VM at run time (CPython)\n• JIT-compiled = bytecode → native at runtime (JVM languages, JavaScript V8, .NET)\n\nThese choices are a frontier. GC adds runtime cost but eliminates whole classes of bugs. Static typing catches errors early but slows prototyping. Manual memory is fastest but unsafe. Ownership is fast and safe but raises the learning curve. Pick the language whose tradeoffs match the constraint that matters most for your problem.",
        key_numbers: [
          { label: "Three Axes", value: "Type · Memory · Execution" },
          { label: "Frontier", value: "Speed vs Safety vs Productivity" },
          { label: "Universal Truth", value: "All Tradeoffs" }
        ] },
      { title: "Python", content: "Dynamically and STRONGLY typed — types checked at runtime, but no implicit coercion (Python won't add a string to an int the way JavaScript will). Garbage collected via reference counting plus a cycle detector. The reference implementation (CPython) interprets bytecode in a single thread protected by the Global Interpreter Lock (GIL): only one thread executes Python bytecode at a time. CPU-bound multithreading is therefore useless; I/O-bound threading and async work fine.\n\nMulti-paradigm — object-oriented, procedural, increasingly functional. Killer features: list/dict comprehensions, decorators, context managers, duck typing, generators, and a massive standard library. asyncio + async/await is the modern concurrency story; multiprocessing or C extensions (NumPy, Pandas, PyTorch) bypass the GIL for parallelism.\n\nDOMINATES where developer productivity beats runtime speed: data science (NumPy, Pandas, scikit-learn, PyTorch), ML (transformers, LangChain), web (Django, Flask, FastAPI), scripting/glue, DevOps automation. Notable warts: GIL kills CPU-bound parallelism (workarounds: subprocess, C extensions, free-threaded Python 3.13+ experimental); packaging is famously painful (pip vs conda vs poetry vs uv); the 2 → 3 migration was a decade of pain. Performance: 10-100x slower than C for tight loops, but C extensions handle the hot paths.",
        key_numbers: [
          { label: "Type System", value: "Dynamic + Strong" },
          { label: "Memory", value: "Refcount GC + cycle detector" },
          { label: "Big Constraint", value: "GIL (one thread runs bytecode)" }
        ] },
      { title: "JavaScript / TypeScript", content: "Dynamically and WEAKLY typed — the famous coercion footguns: `0 == \"0\"` is true, `[] + {}` is `\"[object Object]\"`, `typeof null` is `\"object\"`. Single-threaded event loop with non-blocking I/O — async work happens via callbacks, promises, and async/await on top of the same single thread. Browser engines (V8, SpiderMonkey, JavaScriptCore) JIT-compile JS to native. Node.js runs V8 server-side; Deno and Bun are newer alternatives.\n\nPrototype-based object model — `class` since ES6 is syntactic sugar over prototypes. First-class functions and closures are the bread-and-butter idioms. The module system was a 15-year mess (CommonJS vs AMD vs ESM); ESM is now the default. NPM is the largest package registry in the world (3M+ packages).\n\nTypeScript layers static structural typing on top of JavaScript and compiles down to JS. It is the de facto default for non-trivial JS projects — catches most coercion bugs at compile time without changing runtime behavior. Use cases: every browser frontend (no choice), increasingly server (Node, Deno, Bun), build tooling, Electron desktop apps, React Native mobile. Notable warts: type coercion if you skip TS; single-threaded means CPU-heavy work blocks the event loop (Worker threads exist but are awkward); npm ecosystem bloat and supply chain risk.",
        key_numbers: [
          { label: "Concurrency", value: "Single-thread event loop" },
          { label: "Standard Mode", value: "TypeScript on top" },
          { label: "Ecosystem", value: "NPM (3M+ packages)" }
        ] },
      { title: "Java", content: "Statically and strongly typed; runs on the JVM (Java Virtual Machine) which JIT-compiles bytecode to native at runtime. Garbage collected with multiple GC algorithms tuned for different goals — G1 (default since Java 9), ZGC and Shenandoah for sub-millisecond pauses on huge heaps. Mostly OOP — everything used to be a class — though records, lambdas (Java 8), and pattern matching (recent) softened the formality. Generics are TYPE-ERASED at runtime, which causes friction with reflection and prevents primitive specialization.\n\nConcurrency is mature: synchronized blocks, java.util.concurrent (locks, atomics, executors, fork-join), and as of Java 21 (Sept 2023) VIRTUAL THREADS — lightweight user-space threads that solve the thread-per-request scaling problem Go solved a decade earlier. The 'write once, run anywhere' promise mostly held because of bytecode portability; cross-platform GUI is the exception that proves the rule.\n\nUse cases: enterprise backends (Spring is the dominant framework), Android (alongside Kotlin), big data infra (Hadoop, Spark, Kafka, Cassandra, Flink — almost all in JVM languages), trading systems, ad tech. Notable warts: famously verbose (Spring boilerplate, getters/setters/equals/hashCode); slow JVM startup helped by GraalVM AOT compilation; Oracle vs OpenJDK licensing fight (resolved — OpenJDK is free); checked exceptions are widely regarded as a misfeature.",
        key_numbers: [
          { label: "Runtime", value: "JVM (JIT-compiled bytecode)" },
          { label: "Concurrency", value: "Virtual threads (Java 21+)" },
          { label: "Killer Domain", value: "Enterprise + Big Data" }
        ] },
      { title: "C", content: "Statically but WEAKLY typed — implicit conversions are everywhere, easy footguns. Manual memory management: `malloc` and `free` are your responsibility. Compiled directly to native machine code with thin or no runtime. Procedural — no built-in OOP, generics, or namespaces. Pointer arithmetic is exposed; the language assumes you know what you're doing.\n\nThe lingua franca of systems software for 50+ years (1972 → today): Linux kernel, every major Unix, the Windows kernel, every major language compiler/runtime (CPython, V8, JVM, GCC, LLVM), most database engines, embedded firmware. CRUCIALLY, C is the ABI boundary for every other language — Python's C extensions, Java JNI, Rust FFI, Go cgo, all speak C calling convention. Even if you never write a line of C, your program is running on top of C.\n\nThe minimal runtime is both the killer feature and the killer flaw: zero overhead, but no safety net. Buffer overflows, use-after-free, null pointer dereferences, and undefined behavior are easy and common. Modern static analyzers (clang-tidy, AddressSanitizer, UBSan) help but don't eliminate risk. Notable warts: `strcpy`/`gets` are unsafe by design; the C standard is full of 'implementation-defined' and 'undefined' behavior (compilers are allowed to do ANYTHING in UB cases); macro preprocessing is a footgun. C23 (the latest standard) adds modest QoL improvements (typeof, constexpr-ish constants).",
        key_numbers: [
          { label: "Memory", value: "Manual (malloc/free)" },
          { label: "Role", value: "ABI Lingua Franca" },
          { label: "Age", value: "50+ years (1972)" }
        ] },
      { title: "C++", content: "Statically and strongly typed; compiled to native. Memory is manual but RAII (Resource Acquisition Is Initialization) ties resource lifetimes to object scope — destructors fire automatically when objects go out of scope. Modern C++ (C++11 onwards) leans on smart pointers (`unique_ptr`, `shared_ptr`) so explicit `new`/`delete` is increasingly rare in new code. Multi-paradigm: procedural + OO + generic (templates) + increasingly functional (lambdas, ranges, std::optional/variant).\n\nThe core philosophy is ZERO-COST ABSTRACTIONS — high-level features should compile to code as fast as the hand-written low-level equivalent. Templates enable compile-time metaprogramming and generic algorithms with no runtime cost (monomorphization). The Standard Template Library (STL) gives you containers (vector, map, unordered_map, deque) and algorithms with predictable performance.\n\nUse cases where every microsecond matters: game engines (Unreal native, Unity native parts), browsers (Chromium, Firefox internals), high-frequency trading, databases (MySQL, MongoDB, ClickHouse), ML compilers (PyTorch C++ backend, ONNX, TensorRT), CAD, scientific computing, embedded with abstractions. Modern C++ (17/20/23) is much friendlier than C++98 — concepts, modules, ranges, coroutines all landed in the last decade. Notable warts: undefined behavior is everywhere (compilers exploit it aggressively); the header file model and slow compile times; templates produce inscrutable error messages; ABI compatibility is fragile across compiler versions; the standard library lags Boost on new features.",
        key_numbers: [
          { label: "Idiom", value: "RAII (deterministic destruction)" },
          { label: "Philosophy", value: "Zero-cost Abstractions" },
          { label: "Killer Domain", value: "Performance-critical Systems" }
        ] },
      { title: "Go", content: "Statically and strongly typed; compiled to native with extremely fast compile times (seconds even for large codebases). Tracing GC tuned for low pause times (sub-millisecond, even on multi-GB heaps). The killer feature is GOROUTINES — user-space 'green threads' multiplexed onto OS threads (M:N scheduling). A goroutine starts at ~2KB stack, so spawning thousands or millions is normal. They communicate via channels, the Go take on Communicating Sequential Processes (CSP).\n\nDeliberately a small, opinionated language. No generics until Go 1.18 (March 2022), still no exceptions, no inheritance, no operator overloading. Error handling is explicit `if err != nil` everywhere — the most controversial design choice in the language. Strong standard library philosophy: HTTP server/client, JSON, crypto, testing all in stdlib. Tooling is excellent: built-in formatter (gofmt), test runner, race detector, profiler, fuzz testing.\n\nUse cases: cloud infrastructure (Kubernetes, Docker, Prometheus, Terraform, etcd, Consul, Vault — nearly the entire CNCF stack is in Go), CLIs, networking services, DevOps tools, backend microservices. Notable warts: error handling verbosity (every fallible call is 3 lines); generics arrived late and are limited compared to most languages; the explicit-everything philosophy frustrates engineers from more expressive languages; no proper enums (`iota` is a workaround); nil interfaces vs nil pointers is a footgun.",
        key_numbers: [
          { label: "Concurrency", value: "Goroutines + Channels (CSP)" },
          { label: "Compile Speed", value: "Seconds, even for large codebases" },
          { label: "Killer Domain", value: "Cloud Infrastructure" }
        ] },
      { title: "Rust", content: "Statically and strongly typed; compiled to native. NO garbage collector — instead the OWNERSHIP system and BORROW CHECKER enforce memory safety at compile time. Each value has a single owner; references must follow strict aliasing rules ('one mutable XOR many shared'). Lifetimes track how long references are valid. The compiler refuses to build code that could cause use-after-free, double-free, or data races. Move semantics are the default — assigning a value transfers ownership.\n\nMulti-paradigm: imperative + functional + generic + trait-based. Algebraic data types (enums with payloads, like `Option<T>` and `Result<T, E>`) and exhaustive pattern matching replace exceptions and null. Traits are like Java interfaces but more powerful (and monomorphized at compile time, so zero runtime overhead). Cargo (build + package manager) is widely considered best-in-class.\n\nUse cases: systems software (parts of the Linux kernel since 6.1, Firefox engine), CLIs (ripgrep, fd, bat, eza), browsers, increasingly backend (axum + tokio for async services), embedded (no_std), blockchain (Solana), ML infra (Polars, Hugging Face Tokenizers, Pydantic v2 core). 'Most loved language' on Stack Overflow surveys for 8+ consecutive years. Notable warts: borrow checker has a steep learning curve ('fighting the borrow checker'); compile times are slow; async Rust is meaningfully harder than sync Rust; smaller ecosystem than C++ for legacy domains; some dynamic patterns require Rc/RefCell or unsafe.",
        key_numbers: [
          { label: "Memory", value: "Ownership (no GC, no UAF)" },
          { label: "Safety", value: "Most data races caught at compile" },
          { label: "Trade", value: "Steep Learning · Slow Compiles" }
        ] },
      { title: "SQL", content: "Declarative and SET-BASED — you describe the result you want, not how to compute it. The query optimizer figures out the execution plan (which indexes to use, join order, hashing vs sorting). Statically typed (column types fixed in the schema); strongly typed in modern dialects, more permissive in MySQL. Standardized as SQL:1992, with later updates (SQL:2003, 2011, 2016, 2023), but heavy dialect fragmentation: PostgreSQL, MySQL, SQL Server, Oracle, SQLite, BigQuery, Snowflake, Redshift each have meaningful divergence.\n\nCore ops: SELECT/FROM/WHERE/GROUP BY/HAVING/ORDER BY for retrieval; JOINs (INNER, LEFT, RIGHT, FULL, CROSS) for combining tables; window functions (OVER, PARTITION BY) for running totals and rank-within-group; CTEs (WITH clauses) for readable composition; recursive CTEs for graph traversal. Modern features: JSON columns and operators (jsonb in Postgres), full-text search, geospatial extensions (PostGIS), pivot/unpivot (some dialects).\n\nUse cases: every database-backed application. Analytics warehouses (BigQuery, Snowflake, Redshift) speak SQL even though they're column-store engines underneath. Data engineering pipelines often write the heavy lifting in SQL even when Python orchestrates them (dbt is the canonical example). Notable warts: NULL is 3-VALUED LOGIC (NULL = NULL is NULL, not true; you must use IS NULL); ORM abstraction layers leak constantly; dialect fragmentation makes 'portable SQL' mostly fiction; query performance depends on indexes and statistics, not just the SQL text — read the EXPLAIN plan.",
        key_numbers: [
          { label: "Paradigm", value: "Declarative + Set-based" },
          { label: "NULL", value: "3-valued logic (footgun)" },
          { label: "Standardized", value: "1992, fragmented since" }
        ] }
    ] },
];

function DeepDivesTab() {
  const [dives, setDives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [collapsedTopics, setCollapsedTopics] = useState({});
  useEffect(() => {
    supabase.from("deep_dives").select("*").order("title", { ascending: true }).then(({ data }) => { setDives(data || []); setLoading(false); }).catch(err => { console.error(err); setLoading(false); });
  }, []);

  const handleDelete = async (id) => {
    if (id.startsWith("strat_") || id.startsWith("infra_") || id.startsWith("sw_")) return;
    await supabase.from("deep_dives").delete().eq("id", id);
    setDives(prev => prev.filter(d => d.id !== id));
    setSelected(null);
  };

  const allDives = [...STRATEGY_DIVES, ...dives].sort((a, b) => a.title.localeCompare(b.title));

  const filtered = allDives.filter(d => filter === "all" || d.topic === filter);

  if (selected) return <DeepDiveDetail dive={selected} onBack={() => setSelected(null)} onDelete={handleDelete} />;

  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {TOPIC_FILTERS.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)} style={{
            background: filter === t.key ? `${T_.accent}20` : "transparent", border: `1px solid ${filter === t.key ? T_.accent : T_.border}`,
            color: filter === t.key ? T_.accent : T_.textDim, padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: FONT, fontWeight: filter === t.key ? 600 : 400,
          }}>{t.label}{t.key !== "all" && <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>{allDives.filter(d => d.topic === t.key).length}</span>}</button>
        ))}
      </div>
      <div style={{ fontSize: 12, color: T_.textGhost, marginBottom: 16 }}>
        <span style={{ color: T_.text, fontWeight: 600 }}>{filtered.length}</span> dives grouped by topic. Click any topic header to collapse.
      </div>

      {loading ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
        : filtered.length === 0 ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>{allDives.length === 0 ? "No deep dives yet." : "No match."}</div>
        : TOPIC_FILTERS.filter(t => t.key !== "all").map(topic => {
            const items = filtered.filter(d => d.topic === topic.key);
            if (items.length === 0) return null;
            const collapsed = collapsedTopics[topic.key];
            return (
              <div key={topic.key} style={{ marginBottom: 22 }}>
                <div onClick={() => setCollapsedTopics(p => ({ ...p, [topic.key]: !p[topic.key] }))}
                  style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${T_.border}`, cursor: "pointer", userSelect: "none" }}>
                  <span style={{ fontSize: 10, color: T_.textDim, transition: "transform 0.15s", transform: collapsed ? "rotate(0)" : "rotate(90deg)", display: "inline-block" }}>&#9654;</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T_.text, textTransform: "uppercase", letterSpacing: "0.8px" }}>{topic.label}</span>
                  <span style={{ fontSize: 11, color: T_.textGhost }}>{items.length}</span>
                </div>
                {!collapsed && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {items.map(d => (
                      <div key={d.id} onClick={() => setSelected(d)} style={{
                        display: "flex", alignItems: "center", gap: 16, background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 20px", cursor: "pointer", transition: "border-color 0.2s",
                      }} onMouseEnter={e => e.currentTarget.style.borderColor = T_.accent} onMouseLeave={e => e.currentTarget.style.borderColor = T_.border}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                            <span style={{ fontSize: 15, fontWeight: 600, color: T_.text }}>{d.title}</span>
                            <span style={{ fontSize: 10, color: T_.textGhost }}>{(d.sections || []).length} sections</span>
                          </div>
                          {d.summary && <div style={{ fontSize: 13, color: T_.textDim, lineHeight: 1.5 }}>{d.summary}</div>}
                          {!d.summary && (d.sections || []).length === 0 && <div style={{ fontSize: 12, color: T_.amber, fontStyle: "italic" }}>Pending — run "compile my wiki" to generate</div>}
                        </div>
                        <span style={{ color: T_.textGhost, fontSize: 14, flexShrink: 0 }}>&rarr;</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

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
        <div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px", fontFamily: FONT }}>Knowledge / Interests</div>
        <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4, fontFamily: FONT }}>Learn, explore, and save interesting things.</div>
      </div>
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
      {activeTab === "concepts" && <ConceptsTab />}
      {activeTab === "deepDives" && <DeepDivesTab />}
    </div>
  );
}
