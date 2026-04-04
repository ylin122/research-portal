import { useState, useEffect, useRef } from "react";

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

const T_ = {
  bg: "#0a0e17", bgSidebar: "#0d1220", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347", borderLight: "#222d40",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", greenBg: "#0d3520", greenBorder: "#1a7a3d",
  amber: "#f5a623", amberBg: "#332508", amberBorder: "#8a5e16",
  grayBadge: "#3d4d60", grayBadgeText: "#b0bcc9",
  blue: "#70b0fa", red: "#f87171", redDim: "#7f1d1d",
};

async function callClaude(prompt, maxTokens = 4000) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: maxTokens,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const d = await r.json();
  return d.content?.map(i => i.type === "text" ? i.text : "").filter(Boolean).join("\n") || "";
}

const STORAGE_KEY = "research_portal_verification";
function loadResults() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; } }
function saveResults(r) { localStorage.setItem(STORAGE_KEY, JSON.stringify(r)); }

const TIMER_KEY = "research_portal_verify_timer";
function loadTimer() { try { return JSON.parse(localStorage.getItem(TIMER_KEY) || "null"); } catch { return null; } }
function saveTimer(t) { localStorage.setItem(TIMER_KEY, JSON.stringify(t)); }

const STATUS_COLORS = {
  verified: { bg: T_.greenBg, color: T_.green, border: T_.greenBorder, label: "Verified" },
  warning: { bg: T_.amberBg, color: T_.amber, border: T_.amberBorder, label: "Warning" },
  error: { bg: T_.redDim, color: T_.red, border: T_.red, label: "Error" },
  stale: { bg: T_.grayBadge, color: T_.grayBadgeText, border: T_.textGhost, label: "Stale" },
  pending: { bg: "transparent", color: T_.textGhost, border: T_.border, label: "Pending" },
};

// Tab definitions for verification scope
const VERIFY_TABS = [
  { key: "credit", label: "Credit Research", color: "#3B82F6" },
  { key: "equity", label: "Equity Research", color: "#10B981" },
  { key: "primer", label: "Primer", color: "#0EA5E9" },
  { key: "businessModels", label: "Business Models", color: "#F59E0B" },
  { key: "creditInstruments", label: "Credit Instruments", color: "#EF4444" },
  { key: "aiResearch", label: "AI Research", color: "#8B5CF6" },
];

const PRIMER_TABS = [
  "Software", "Semiconductors", "Digital Infrastructure", "IT Services", "IT & BPO",
  "Healthcare IT", "Healthcare & Pharma", "Healthcare Services", "Internet", "Education",
  "Comms & Telecom", "Consumer Discretionary", "Consumer Staples", "Financials", "Fintech",
  "Industrials", "Aerospace & Defense", "Energy & Materials", "Real Estate", "Utilities",
];

const BIZ_MODEL_TABS = [
  "Aircraft Leasing", "GPU / Compute Leasing", "Equipment Leasing", "SaaS / Subscription",
  "Payment Take Rates", "Marketplace / Platform", "REITs", "Regulated Utilities",
  "Banking / Net Interest", "Franchise Model", "Royalties & Licensing", "Data & Info Services", "Specialty Finance",
];

const CREDIT_INST_SECTIONS = [
  "Credit Instruments (Leveraged Loans, HY Bonds, IG Bonds, Private Credit, Mezzanine)",
  "Structured Credit (CLO, CDO Mechanics, ABS, CMBS/RMBS, Synthetic CLO)",
  "Derivatives (CDS, CDX Indices, IRS, TRS, Swaptions)",
  "Hybrid Instruments (Convertibles, Preferred, Warrants, PIK Toggle)",
  "Distressed (DIP, Exit Financing, Loan-to-Own, Claims Trading)",
];

export default function DataVerificationAgent({ companies, fieldsMap, sectorNotes }) {
  const [results, setResults] = useState(loadResults);
  const [running, setRunning] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [timerInterval, setTimerInterval] = useState(() => loadTimer());
  const [nextRun, setNextRun] = useState(null);
  const timerRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState("credit");

  const activeCos = companies.filter(c => c.sector !== "sources" && c.sector !== "prompts").sort((a, b) => a.name.localeCompare(b.name));

  // Load equity data from localStorage
  const equities = (() => { try { return JSON.parse(localStorage.getItem("research_portal_equities") || "[]"); } catch { return []; } })();
  const equityNotes = (() => { try { return JSON.parse(localStorage.getItem("research_portal_equity_notes") || "{}"); } catch { return {}; } })();

  // Timer logic
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (timerInterval) {
      const ms = timerInterval * 60 * 1000;
      setNextRun(new Date(Date.now() + ms));
      timerRef.current = setInterval(() => {
        runFullVerification();
        setNextRun(new Date(Date.now() + ms));
      }, ms);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerInterval]);

  // Generic verify function
  async function verifyItem(id, name, category, dataText) {
    if (!dataText || dataText.trim().length < 20) return { status: "stale", issues: ["No data to verify — content is empty or too short."], details: "" };

    const prompt = `You are a data verification agent. Check the following ${category} data for accuracy, errors, outdated information, and inconsistencies. Search the web to verify key claims.

Item: ${name}
Category: ${category}

Data to verify:
${dataText.slice(0, 3000)}

Check for:
1. Factual accuracy (numbers, dates, names, companies, market data)
2. Outdated information (M&A, leadership changes, market shifts, regulatory changes)
3. Internal inconsistencies
4. Missing critical information
5. Source reliability

Respond ONLY with a JSON object, no markdown backticks:
{
  "status": "verified" | "warning" | "error",
  "score": 0-100,
  "issues": ["issue 1", "issue 2"],
  "details": "Summary of findings..."
}

Use "verified" if data is mostly accurate (score 80+), "warning" if some issues found (score 50-79), "error" if significant problems (score <50).`;

    try {
      const raw = await callClaude(prompt);
      if (raw) return JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {}
    return { status: "warning", score: 0, issues: ["Verification failed — could not reach AI."], details: "" };
  }

  async function runSingleVerify(itemId, name, category, dataText) {
    setCurrentItem(name);
    const result = await verifyItem(itemId, name, category, dataText);
    result.date = new Date().toISOString();
    result.companyName = name;
    result.category = category;
    const updated = { ...results, [itemId]: result };
    setResults(updated);
    saveResults(updated);
    setCurrentItem(null);
    return result;
  }

  // Build verification items for each tab
  function getItemsForTab(tab) {
    switch (tab) {
      case "credit":
        return activeCos.map(co => {
          const fields = fieldsMap[co.id] || {};
          const text = Object.entries(fields).filter(([k, v]) => v.text && k !== "public_private").map(([k, v]) => `${k}: ${v.text.slice(0, 500)}`).join("\n");
          return { id: co.id, name: co.name, category: "Credit Research", data: text };
        });
      case "equity":
        return equities.map(eq => {
          const notes = equityNotes[eq.id] || "";
          return { id: `eq_${eq.id}`, name: eq.name, category: "Equity Research", data: notes };
        });
      case "primer":
        return PRIMER_TABS.map((name, i) => ({
          id: `primer_${i}`, name: `${name} Primer`, category: "Primer",
          data: `Industry primer for ${name}: subsectors, TAM estimates, growth rates, key players, value chain, revenue models, key concepts. Verify that TAM figures, growth rates, company names, and market share data are current and accurate as of 2025-2026.`,
        }));
      case "businessModels":
        return BIZ_MODEL_TABS.map((name, i) => ({
          id: `bm_${i}`, name, category: "Business Models",
          data: `Business model analysis for ${name}: economics, key metrics, valuation multiples, real company examples with specific financial figures. Verify that company examples, revenue figures, valuation multiples (P/E, EV/EBITDA, P/B), and market data are accurate and current.`,
        }));
      case "creditInstruments":
        return CREDIT_INST_SECTIONS.map((name, i) => ({
          id: `ci_${i}`, name, category: "Credit Instruments",
          data: `Credit instrument reference for ${name}: structure mechanics, pricing conventions, key terms, market size, key players, regulatory framework. Verify that market sizes, spread ranges, recovery rates, and regulatory references are current.`,
        }));
      case "aiResearch":
        return [{ id: "ai_disruption", name: "AI Disruption Analysis", category: "AI Research",
          data: "AI disruption analysis: moat scores, Jevons Paradox analysis, sector disruption rankings, weighted moat tiers. Verify AI impact assessments, company moat classifications, and disruption rankings are current." }];
      default:
        return [];
    }
  }

  async function runFullVerification() {
    if (running) return;
    setRunning(true);

    // Gather all items across all tabs
    const allItems = VERIFY_TABS.flatMap(tab => getItemsForTab(tab.key));
    setProgress({ done: 0, total: allItems.length });

    const updated = { ...results };
    for (let i = 0; i < allItems.length; i++) {
      const item = allItems[i];
      setCurrentItem(item.name);
      setProgress({ done: i, total: allItems.length });
      const result = await verifyItem(item.id, item.name, item.category, item.data);
      result.date = new Date().toISOString();
      result.companyName = item.name;
      result.category = item.category;
      updated[item.id] = result;
      setResults({ ...updated });
      saveResults(updated);
    }

    setCurrentItem(null);
    setRunning(false);
    setProgress({ done: allItems.length, total: allItems.length });
  }

  async function runTabVerification(tabKey) {
    if (running) return;
    setRunning(true);
    const items = getItemsForTab(tabKey);
    setProgress({ done: 0, total: items.length });

    const updated = { ...results };
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      setCurrentItem(item.name);
      setProgress({ done: i, total: items.length });
      const result = await verifyItem(item.id, item.name, item.category, item.data);
      result.date = new Date().toISOString();
      result.companyName = item.name;
      result.category = item.category;
      updated[item.id] = result;
      setResults({ ...updated });
      saveResults(updated);
    }

    setCurrentItem(null);
    setRunning(false);
    setProgress({ done: items.length, total: items.length });
  }

  function setTimer(minutes) {
    setTimerInterval(minutes);
    saveTimer(minutes);
  }

  const timerOptions = [
    { label: "Off", value: null },
    { label: "30m", value: 30 },
    { label: "1h", value: 60 },
    { label: "4h", value: 240 },
    { label: "12h", value: 720 },
    { label: "24h", value: 1440 },
  ];

  // Current tab items and stats
  const currentItems = getItemsForTab(activeTab);
  const currentItemIds = new Set(currentItems.map(i => i.id));

  const allResults = Object.entries(results).filter(([id]) => currentItemIds.has(id));
  const verified = allResults.filter(([, r]) => r.status === "verified").length;
  const warnings = allResults.filter(([, r]) => r.status === "warning").length;
  const errors = allResults.filter(([, r]) => r.status === "error").length;
  const unchecked = currentItems.length - allResults.length;

  // Global stats
  const globalVerified = Object.values(results).filter(r => r.status === "verified").length;
  const globalWarnings = Object.values(results).filter(r => r.status === "warning").length;
  const globalErrors = Object.values(results).filter(r => r.status === "error").length;

  return (
    <div style={{ padding: "36px 44px", maxWidth: 1000, fontFamily: FONT }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Data Verification Agent</h1>
      <p style={{ fontSize: 14, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
        Verifies data accuracy across every tab in your portal. Select a section to verify, or run full verification across all tabs.
      </p>

      {/* Controls */}
      <div style={{ background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <button style={{
            padding: "8px 20px", fontSize: 13, fontWeight: 500, borderRadius: 8, cursor: "pointer",
            background: running ? T_.border : T_.accent, color: running ? T_.textDim : "#000",
            border: "none", fontFamily: FONT, opacity: running ? 0.6 : 1,
          }} onClick={runFullVerification} disabled={running}>
            {running ? `Verifying ${currentItem || "..."}` : "Verify All Tabs"}
          </button>
          <button style={{
            padding: "8px 20px", fontSize: 13, fontWeight: 500, borderRadius: 8, cursor: "pointer",
            background: running ? T_.border : T_.blue + "22", color: running ? T_.textDim : T_.blue,
            border: `1px solid ${running ? T_.border : T_.blue + "44"}`, fontFamily: FONT, opacity: running ? 0.6 : 1,
          }} onClick={() => runTabVerification(activeTab)} disabled={running}>
            Verify {VERIFY_TABS.find(t => t.key === activeTab)?.label}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <span style={{ fontSize: 12, color: T_.textGhost }}>Auto-run:</span>
            {timerOptions.map(opt => (
              <span key={opt.label} style={{
                padding: "4px 12px", fontSize: 11, borderRadius: 5, cursor: "pointer", fontFamily: FONT,
                background: timerInterval === opt.value ? T_.amberBg : "transparent",
                color: timerInterval === opt.value ? T_.amber : T_.textGhost,
                border: `1px solid ${timerInterval === opt.value ? T_.amberBorder : T_.border}`,
              }} onClick={() => setTimer(opt.value)}>{opt.label}</span>
            ))}
          </div>
        </div>

        {timerInterval && nextRun && (
          <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 8 }}>
            Next auto-run: {nextRun.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} — verifies all tabs
          </div>
        )}

        {running && (
          <div style={{ marginTop: 14 }}>
            <div style={{ height: 4, background: T_.border, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", background: T_.accent, borderRadius: 2, width: `${(progress.done / Math.max(progress.total, 1)) * 100}%`, transition: "width 0.3s" }} />
            </div>
            <span style={{ fontSize: 11, color: T_.textGhost, marginTop: 6, display: "block" }}>
              {progress.done} / {progress.total} items checked
            </span>
          </div>
        )}
      </div>

      {/* Global stats bar */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, fontSize: 12, color: T_.textGhost }}>
        <span>Global: <span style={{ color: T_.green, fontWeight: 600 }}>{globalVerified}</span> verified</span>
        <span><span style={{ color: T_.amber, fontWeight: 600 }}>{globalWarnings}</span> warnings</span>
        <span><span style={{ color: T_.red, fontWeight: 600 }}>{globalErrors}</span> errors</span>
      </div>

      {/* Tab selector */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `1px solid ${T_.borderLight}`, flexWrap: "wrap" }}>
        {VERIFY_TABS.map(tab => {
          const tabItems = getItemsForTab(tab.key);
          const tabResults = tabItems.filter(i => results[i.id]);
          const tabErrors = tabResults.filter(i => results[i.id]?.status === "error" || results[i.id]?.status === "warning").length;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: "10px 16px", fontSize: 12, fontWeight: 500, cursor: "pointer",
              border: "none", borderBottom: activeTab === tab.key ? `2px solid ${tab.color}` : "2px solid transparent",
              background: "transparent", color: activeTab === tab.key ? T_.text : T_.textGhost,
              fontFamily: FONT, transition: "all 0.15s", whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {tab.label}
              <span style={{ fontSize: 10, color: T_.textGhost }}>({tabItems.length})</span>
              {tabErrors > 0 && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: T_.amberBg, color: T_.amber }}>{tabErrors}</span>}
            </button>
          );
        })}
      </div>

      {/* Tab stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Verified", count: verified, color: T_.green, bg: T_.greenBg },
          { label: "Warnings", count: warnings, color: T_.amber, bg: T_.amberBg },
          { label: "Errors", count: errors, color: T_.red, bg: T_.redDim },
          { label: "Unchecked", count: unchecked, color: T_.textGhost, bg: T_.grayBadge },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${T_.border}`, borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 11, color: T_.textDim, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Items for current tab */}
      {currentItems.map(item => {
        const r = results[item.id];
        const st = r ? STATUS_COLORS[r.status] || STATUS_COLORS.pending : STATUS_COLORS.pending;
        const expanded = expandedId === item.id;

        return (
          <div key={item.id} style={{
            background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10,
            padding: "14px 20px", marginBottom: 8, cursor: "pointer",
          }} onClick={() => setExpandedId(expanded ? null : item.id)}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                fontSize: 10, padding: "3px 10px", borderRadius: 4, fontFamily: FONT,
                background: st.bg, color: st.color, border: `1px solid ${st.border}`, minWidth: 60, textAlign: "center",
              }}>{st.label}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: T_.text, flex: 1 }}>{item.name}</span>
              {r?.score != null && (
                <span style={{ fontSize: 12, fontWeight: 500, color: r.score >= 80 ? T_.green : r.score >= 50 ? T_.amber : T_.red }}>
                  {r.score}/100
                </span>
              )}
              {r?.date && (
                <span style={{ fontSize: 11, color: T_.textGhost }}>
                  {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              )}
              {!running && (
                <span style={{ fontSize: 11, color: T_.accent, padding: "2px 8px", cursor: "pointer" }}
                  onClick={e => { e.stopPropagation(); runSingleVerify(item.id, item.name, item.category, item.data); }}>verify</span>
              )}
            </div>
            {expanded && r && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T_.borderLight}` }}>
                {r.issues?.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    {r.issues.map((issue, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                        <span style={{ color: r.status === "error" ? T_.red : T_.amber, fontSize: 12, flexShrink: 0 }}>
                          {r.status === "error" ? "\u2716" : "\u26A0"}
                        </span>
                        <span style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.5 }}>{issue}</span>
                      </div>
                    ))}
                  </div>
                )}
                {r.details && (
                  <div style={{ fontSize: 13, color: T_.textDim, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {r.details}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {currentItems.length === 0 && (
        <div style={{ color: T_.textDim, fontSize: 14, textAlign: "center", padding: "40px 0" }}>
          No items to verify in this section.
        </div>
      )}
    </div>
  );
}
