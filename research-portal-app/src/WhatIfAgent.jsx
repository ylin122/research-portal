import { useState, useRef } from "react";
import { T_, FONT } from "./lib/theme";

const STORAGE_KEY = "research_portal_whatif_scenarios";
function load() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } }
function save(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

const SEVERITY_COLOR = { HIGH: T_.red, MEDIUM: "#F97316", LOW: T_.amber, NONE: T_.textGhost };
const DIRECTION_COLOR = { Negative: T_.red, Positive: T_.green, Mixed: "#F97316" };

async function callClaude(messages, maxTokens = 8000) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("NO_KEY");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: maxTokens,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages,
    }),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${r.status}`);
  }
  const d = await r.json();
  return d.content?.map(i => i.type === "text" ? i.text : "").filter(Boolean).join("\n") || "";
}

function buildCompanyContext(companies, fieldsMap) {
  const active = companies.filter(c => c.sector !== "sources" && c.sector !== "prompts");
  return active.map(c => {
    const f = fieldsMap[c.id] || {};
    const parts = [`## ${c.name} (${c.sector}/${c.sub || "other"})${c.priority ? " [Priority: " + c.priority + "]" : ""}`];
    for (const key of ["overview", "products", "customers", "industry", "competitive"]) {
      if (f[key]?.text) parts.push(`**${key}:** ${f[key].text.slice(0, 600)}`);
    }
    if (c.moats?._enabled) {
      const m = c.moats;
      const scores = [];
      if (m.data) scores.push(`Data:${m.data}`);
      if (m.switching) scores.push(`Switching:${m.switching}`);
      if (m.regulatory) scores.push(`Regulatory:${m.regulatory}`);
      if (m.ecosystem) scores.push(`Ecosystem:${m.ecosystem}`);
      if (m.contracts) scores.push(`Contracts:${m.contracts}`);
      if (scores.length) parts.push(`**Moats:** ${scores.join(", ")}`);
    }
    return parts.join("\n");
  }).join("\n\n---\n\n");
}

function parseImpacts(text) {
  const impacts = [];
  const pattern = /[▼•\-]\s*\*?\*?(.+?)\*?\*?\s*[—–-]\s*\*?\*?(NEGATIVE|POSITIVE|MIXED)\*?\*?\s*\|?\s*Severity:\s*\*?\*?(HIGH|MEDIUM|LOW)\*?\*?/gi;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    const name = m[1].trim().replace(/\*+/g, "");
    const direction = m[2].charAt(0).toUpperCase() + m[2].slice(1).toLowerCase();
    const severity = m[3].toUpperCase();
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 500);
    const transMatch = after.match(/Transmission:\s*(.+?)(?:\n\s*(?:Revenue|Moat|Timeframe|Confidence|Sources|\n))/si);
    const transmission = transMatch ? transMatch[1].trim() : "";
    const timeMatch = after.match(/Timeframe:\s*(.+)/i);
    const timeframe = timeMatch ? timeMatch[1].trim() : "";
    const confMatch = after.match(/Confidence:\s*(.+)/i);
    const confidence = confMatch ? confMatch[1].trim() : "";
    impacts.push({ name, direction, severity, transmission, timeframe, confidence });
  }
  return impacts;
}

function buildScreenPrompt(input, companies, fieldsMap, sectorNotes) {
  const companyContext = buildCompanyContext(companies, fieldsMap);
  const sectorContext = Object.entries(sectorNotes || {})
    .filter(([, v]) => v.text)
    .map(([k, v]) => `**${k}:** ${v.text.slice(0, 300)}`)
    .join("\n");
  return `You are a scenario analysis agent for a financial research portfolio. You must screen EVERY company below for impact from this scenario.

## SCENARIO
${input.trim()}

## SECTOR NOTES
${sectorContext || "(none)"}

## COMPANIES IN COVERAGE (${companies.filter(c => c.sector !== "sources" && c.sector !== "prompts").length} total)
${companyContext}

## INSTRUCTIONS
1. First, use web search to research this scenario — find recent news, analyst commentary, and real-world context.
2. Map out the 1st, 2nd, and 3rd order effects of this scenario.
3. Screen EVERY company above. For each, determine:
   - Direction: Negative / Positive / Mixed
   - Severity: HIGH / MEDIUM / LOW
   - Order of impact: 1st / 2nd / 3rd
   - Transmission mechanism (HOW exactly does this impact this specific company?)
   - Timeframe: Immediate / Near-term / Medium-term / Long-term
   - Confidence: High / Medium / Low

## OUTPUT FORMAT (follow exactly)

SCENARIO SUMMARY: [2-3 sentences]
PROBABILITY: [Low/Medium/High] — [rationale]
TIMEFRAME: [primary timeframe]

=== HIGH IMPACT ===

▼ [Company Name] — NEGATIVE/POSITIVE/MIXED | Severity: HIGH | Order: 1st/2nd/3rd
Transmission: [exact mechanism — which product, revenue line, customer segment]
Revenue exposure: [which lines affected]
Moat effect: [helps or hurts]
Timeframe: [when]
Confidence: [High/Medium/Low]

=== MEDIUM IMPACT ===

▼ [Company Name] — NEGATIVE/POSITIVE/MIXED | Severity: MEDIUM | Order: 1st/2nd/3rd
Transmission: [mechanism]
Timeframe: [when]
Confidence: [High/Medium/Low]

=== LOW IMPACT ===

- [Company Name] — NEGATIVE/POSITIVE/MIXED | Severity: LOW
Transmission: [one line]

=== NOT IMPACTED ===

- [Company Name]: [one-line reason]

=== KEY INSIGHT ===
[2-3 sentences — the single most important takeaway for portfolio positioning]`;
}

function buildVerifyPrompt(input, screenResult, companies, fieldsMap) {
  const companyContext = buildCompanyContext(companies, fieldsMap);
  return `You are a verification agent. Below is a scenario analysis that screened companies for impact. Your job is to CHALLENGE every impact assessment and check for errors.

## ORIGINAL SCENARIO
${input.trim()}

## ANALYSIS TO VERIFY
${screenResult}

## COMPANY DATA (for cross-reference)
${companyContext}

## YOUR TASK
For each company flagged as HIGH or MEDIUM impact:
1. Is the transmission mechanism actually correct given the company's business? Cross-check against the company data above.
2. Is the severity rating justified or inflated? Would this really be HIGH vs MEDIUM?
3. Is the direction right? Could this actually be positive when marked negative (or vice versa)?
4. Are there companies marked NOT IMPACTED that should actually be flagged?
5. Are there factual errors about any company's business model or products?

Use web search to verify key claims about supply chains, customer relationships, or market dynamics.

## OUTPUT FORMAT

=== VERIFICATION RESULTS ===

For each company checked:
✅ [Company] — Assessment CONFIRMED. [brief reason]
⚠️ [Company] — ADJUSTMENT NEEDED: [what's wrong and what it should be]
❌ [Company] — INCORRECT: [what's wrong]

=== MISSED COMPANIES ===
[Any companies that should have been flagged but weren't]

=== FACTUAL ERRORS ===
[Any incorrect claims about company business models, products, or relationships]

=== ADJUSTED SUMMARY ===
Provide a corrected final impact count:
HIGH: [N] | MEDIUM: [N] | LOW: [N] | Not impacted: [N]
[Note any changes from the original assessment]`;
}

export default function WhatIfAgent({ companies, fieldsMap, sectorNotes }) {
  const [scenarios, setScenarios] = useState(() => load());
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [phase, setPhase] = useState("");
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteAnalysis, setPasteAnalysis] = useState("");
  const [pasteVerification, setPasteVerification] = useState("");
  const abortRef = useRef(false);

  const hasKey = !!import.meta.env.VITE_ANTHROPIC_API_KEY;
  const activeCount = companies.filter(c => c.sector !== "sources" && c.sector !== "prompts").length;

  async function runScenario() {
    if (!input.trim() || running) return;
    abortRef.current = false;
    setRunning(true);
    setError("");
    setPhase("Researching scenario & screening companies...");

    try {
      const screenPrompt = buildScreenPrompt(input, companies, fieldsMap, sectorNotes);
      const screenResult = await callClaude([{ role: "user", content: screenPrompt }]);
      if (abortRef.current) { setRunning(false); setPhase(""); return; }

      setPhase("Verifying impact assessments...");
      const verifyPrompt = buildVerifyPrompt(input, screenResult, companies, fieldsMap);
      let verifyResult = "";
      try {
        verifyResult = await callClaude([{ role: "user", content: verifyPrompt }]);
      } catch { /* verification is optional — don't block on it */ }
      if (abortRef.current) { setRunning(false); setPhase(""); return; }

      saveScenario(input, screenResult, verifyResult);
    } catch (e) {
      if (e.message === "NO_KEY") {
        setError("No API key configured. Use the paste workflow below, or run @whatif from Claude Code CLI.");
      } else {
        setError(`API error: ${e.message}`);
      }
    }
    setRunning(false);
    setPhase("");
  }

  function saveScenario(scenarioInput, analysis, verification) {
    const impacts = parseImpacts(analysis);
    const scenario = {
      id: uid(),
      input: scenarioInput.trim(),
      date: new Date().toISOString(),
      analysis,
      verification: verification || "",
      impacts,
      highCount: impacts.filter(i => i.severity === "HIGH").length,
      medCount: impacts.filter(i => i.severity === "MEDIUM").length,
      lowCount: impacts.filter(i => i.severity === "LOW").length,
    };
    const updated = [scenario, ...scenarios];
    setScenarios(updated);
    save(updated);
    setInput("");
    setExpanded(scenario.id);
  }

  function savePastedResult() {
    if (!input.trim() || !pasteAnalysis.trim()) return;
    saveScenario(input, pasteAnalysis, pasteVerification);
    setPasteMode(false);
    setPasteAnalysis("");
    setPasteVerification("");
  }

  function copyPromptToClipboard() {
    if (!input.trim()) return;
    const prompt = buildScreenPrompt(input, companies, fieldsMap, sectorNotes);
    navigator.clipboard.writeText(prompt);
    setError("");
  }

  async function recheck(scenarioId) {
    const sc = scenarios.find(s => s.id === scenarioId);
    if (!sc || verifying) return;
    setVerifying(scenarioId);

    try {
      const companyContext = buildCompanyContext(companies, fieldsMap);
      const recheckPrompt = `You are a fact-checking agent. Re-verify this scenario analysis against CURRENT information.

## SCENARIO: ${sc.input}
## DATE OF ORIGINAL ANALYSIS: ${new Date(sc.date).toLocaleDateString()}

## ORIGINAL ANALYSIS
${sc.analysis}

## PREVIOUS VERIFICATION
${sc.verification}

## CURRENT COMPANY DATA
${companyContext}

Search the web for the LATEST developments related to this scenario. Has anything changed since the original analysis?

## OUTPUT FORMAT

=== RECHECK RESULTS (${new Date().toLocaleDateString()}) ===

SCENARIO STATUS: [Still relevant / Partially materialized / Overtaken by events / Materialized]

CHANGES SINCE LAST CHECK:
- [list any new developments]

UPDATED IMPACT ASSESSMENTS:
[only list companies where the assessment has changed]
⬆️ [Company] — Upgraded from [old] to [new]: [reason]
⬇️ [Company] — Downgraded from [old] to [new]: [reason]
🔄 [Company] — Direction changed: [reason]
➡️ No changes needed for: [list]

KEY UPDATE: [1-2 sentences on what's different now]`;

      const result = await callClaude([{ role: "user", content: recheckPrompt }]);
      if (result) {
        const updated = scenarios.map(s => s.id === scenarioId
          ? { ...s, lastRecheck: new Date().toISOString(), recheckResult: result }
          : s
        );
        setScenarios(updated);
        save(updated);
      }
    } catch { /* silent */ }
    setVerifying(null);
  }

  function deleteScenario(id) {
    const updated = scenarios.filter(s => s.id !== id);
    setScenarios(updated);
    save(updated);
    if (expanded === id) setExpanded(null);
  }

  // Styles
  const panel = { background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: 20, marginBottom: 20 };
  const hdr = { fontSize: 13, fontWeight: 600, color: T_.textMid, letterSpacing: 0.3 };
  const btn = (bg, color, border) => ({
    padding: "8px 20px", fontSize: 12, fontWeight: 600, borderRadius: 7, cursor: "pointer",
    background: bg, color, border: `1px solid ${border}`, fontFamily: FONT,
  });
  const btnSm = (bg, color, border) => ({
    padding: "4px 12px", fontSize: 11, fontWeight: 500, borderRadius: 5, cursor: "pointer",
    background: bg, color, border: `1px solid ${border}`, fontFamily: FONT,
  });
  const textareaStyle = {
    width: "100%", padding: 14, fontSize: 13, fontFamily: FONT,
    background: T_.bgInput, color: T_.text, border: `1px solid ${T_.borderLight}`,
    borderRadius: 8, resize: "vertical", lineHeight: 1.6,
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "36px 44px", maxWidth: 1000, fontFamily: FONT }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: T_.text, marginBottom: 4 }}>What If</h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 28 }}>
        Test a scenario or thesis against your entire coverage universe. Screens every company for impact with auto-verification.
      </p>

      {/* Input */}
      <div style={panel}>
        <div style={hdr}>Scenario Input</div>
        <p style={{ fontSize: 11, color: T_.textGhost, marginTop: 4, marginBottom: 12 }}>
          Describe a market event, policy change, supply chain shock, or thesis. Be specific.
        </p>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='e.g., "Massive delays in NVIDIA R100 launch — TSMC yield issues push delivery to Q2 2027, impacting all hyperscaler GPU refresh cycles"'
          disabled={running}
          style={{ ...textareaStyle, minHeight: 100 }}
        />

        {/* Error display */}
        {error && (
          <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 7, background: T_.red + "10", border: `1px solid ${T_.red}25`, fontSize: 12, color: T_.red }}>
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          {hasKey ? (
            <button
              onClick={runScenario}
              disabled={running || !input.trim()}
              style={{
                ...btn(running ? T_.bgInput : "#F97316", running ? T_.textGhost : "#fff", running ? T_.borderLight : "#F97316"),
                opacity: running || !input.trim() ? 0.5 : 1,
              }}
            >
              {running ? "Running..." : "Run Scenario Screen"}
            </button>
          ) : (
            <button
              onClick={() => { copyPromptToClipboard(); setError("Prompt copied! Paste into Claude to run, then paste results back below."); }}
              disabled={!input.trim()}
              style={{ ...btn("#F97316", "#fff", "#F97316"), opacity: !input.trim() ? 0.5 : 1 }}
            >
              Copy Prompt to Clipboard
            </button>
          )}
          <button
            onClick={() => setPasteMode(!pasteMode)}
            disabled={running}
            style={btnSm(pasteMode ? "#F97316" + "15" : T_.bgInput, pasteMode ? "#F97316" : T_.textDim, pasteMode ? "#F97316" + "30" : T_.borderLight)}
          >
            {pasteMode ? "Cancel Paste" : "Paste Results"}
          </button>
          {running && (
            <>
              <span style={{ fontSize: 12, color: "#F97316", fontWeight: 500 }}>{phase}</span>
              <button onClick={() => { abortRef.current = true; }} style={btnSm("transparent", T_.textGhost, T_.borderLight)}>Cancel</button>
            </>
          )}
        </div>

        {/* CLI hint */}
        {!hasKey && (
          <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 6, background: "#F97316" + "08", border: `1px dashed #F9731630`, fontSize: 11, color: T_.textMid, lineHeight: 1.6 }}>
            <strong style={{ color: "#F97316" }}>No API key configured.</strong> Two options:<br/>
            1. Run <span style={{ fontFamily: "monospace", color: "#F97316" }}>@whatif {input.trim().slice(0, 60) || "your scenario"}</span> in Claude Code CLI<br/>
            2. Click "Copy Prompt" above, paste into Claude, then paste the results back with "Paste Results"
          </div>
        )}

        <div style={{ marginTop: 10, display: "flex", gap: 16, fontSize: 11, color: T_.textGhost }}>
          <span>Screens {activeCount} companies</span>
          <span>|</span>
          <span>Web search for real-time data</span>
          <span>|</span>
          <span>Auto-verifies HIGH/MEDIUM calls</span>
        </div>
      </div>

      {/* Paste Mode */}
      {pasteMode && (
        <div style={{ ...panel, borderColor: "#F97316" + "40" }}>
          <div style={{ ...hdr, color: "#F97316" }}>Paste Results</div>
          <p style={{ fontSize: 11, color: T_.textGhost, marginTop: 4, marginBottom: 12 }}>
            Paste the scenario analysis output from Claude Code or Claude.ai. Optionally paste verification results separately.
          </p>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.textDim, marginBottom: 4 }}>Analysis Output</div>
          <textarea
            value={pasteAnalysis}
            onChange={e => setPasteAnalysis(e.target.value)}
            placeholder="Paste the scenario screen results here..."
            style={{ ...textareaStyle, minHeight: 150, marginBottom: 12 }}
          />
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.textDim, marginBottom: 4 }}>Verification Output (optional)</div>
          <textarea
            value={pasteVerification}
            onChange={e => setPasteVerification(e.target.value)}
            placeholder="Paste verification results here if available..."
            style={{ ...textareaStyle, minHeight: 80, marginBottom: 12 }}
          />
          <button
            onClick={savePastedResult}
            disabled={!input.trim() || !pasteAnalysis.trim()}
            style={{ ...btn("#F97316", "#fff", "#F97316"), opacity: !input.trim() || !pasteAnalysis.trim() ? 0.5 : 1 }}
          >
            Save Scenario
          </button>
        </div>
      )}

      {/* Past Scenarios */}
      {scenarios.length > 0 && (
        <div style={panel}>
          <div style={{ ...hdr, marginBottom: 14 }}>Scenario History</div>
          {scenarios.map(sc => {
            const isExpanded = expanded === sc.id;
            return (
              <div key={sc.id} style={{
                background: T_.bgInput, border: `1px solid ${isExpanded ? "#F97316" + "40" : T_.borderLight}`,
                borderRadius: 8, marginBottom: 8, overflow: "hidden",
              }}>
                {/* Header row */}
                <div
                  onClick={() => setExpanded(isExpanded ? null : sc.id)}
                  style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span style={{ fontSize: 9, color: T_.textDim, transition: "transform .15s", transform: isExpanded ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T_.text, flex: 1 }}>
                    {sc.input.length > 100 ? sc.input.slice(0, 100) + "..." : sc.input}
                  </span>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {sc.highCount > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: T_.red, background: T_.red + "15", padding: "2px 7px", borderRadius: 4 }}>{sc.highCount} HIGH</span>}
                    {sc.medCount > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: "#F97316", background: "#F97316" + "15", padding: "2px 7px", borderRadius: 4 }}>{sc.medCount} MED</span>}
                    {sc.lowCount > 0 && <span style={{ fontSize: 10, color: T_.textGhost, background: T_.bgPanel, padding: "2px 7px", borderRadius: 4 }}>{sc.lowCount} LOW</span>}
                  </div>
                  <span style={{ fontSize: 10, color: T_.textGhost, minWidth: 70, textAlign: "right" }}>
                    {new Date(sc.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${T_.borderLight}` }}>
                    {/* Impact pills */}
                    {sc.impacts.length > 0 && (
                      <div style={{ marginTop: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: T_.textDim, marginBottom: 8 }}>Impact Map</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {sc.impacts.map((imp, i) => (
                            <div key={i} style={{
                              display: "inline-flex", alignItems: "center", gap: 5,
                              padding: "4px 10px", borderRadius: 5, fontSize: 11,
                              background: (SEVERITY_COLOR[imp.severity] || T_.textGhost) + "12",
                              border: `1px solid ${(SEVERITY_COLOR[imp.severity] || T_.textGhost)}25`,
                            }}>
                              <span style={{ color: DIRECTION_COLOR[imp.direction] || T_.textGhost, fontWeight: 700, fontSize: 12 }}>
                                {imp.direction === "Negative" ? "▼" : imp.direction === "Positive" ? "▲" : "◆"}
                              </span>
                              <span style={{ color: T_.text, fontWeight: 500 }}>{imp.name}</span>
                              <span style={{ color: SEVERITY_COLOR[imp.severity] || T_.textGhost, fontWeight: 600, fontSize: 10 }}>{imp.severity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Analysis */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: T_.textDim, marginBottom: 6 }}>Scenario Analysis</div>
                      <pre style={{
                        fontSize: 12, color: T_.textMid, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word",
                        background: T_.bgPanel, border: `1px solid ${T_.borderLight}`, borderRadius: 6, padding: 14,
                        maxHeight: 500, overflowY: "auto", fontFamily: FONT,
                      }}>{sc.analysis}</pre>
                    </div>

                    {/* Verification */}
                    {sc.verification && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: T_.green, marginBottom: 6 }}>Verification Results</div>
                        <pre style={{
                          fontSize: 12, color: T_.textMid, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word",
                          background: T_.green + "08", border: `1px solid ${T_.green}20`, borderRadius: 6, padding: 14,
                          maxHeight: 400, overflowY: "auto", fontFamily: FONT,
                        }}>{sc.verification}</pre>
                      </div>
                    )}

                    {/* Recheck */}
                    {sc.recheckResult && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: T_.blue }}>Latest Recheck</span>
                          <span style={{ fontSize: 10, color: T_.textGhost }}>
                            {sc.lastRecheck ? new Date(sc.lastRecheck).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : ""}
                          </span>
                        </div>
                        <pre style={{
                          fontSize: 12, color: T_.textMid, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word",
                          background: T_.blue + "08", border: `1px solid ${T_.blue}20`, borderRadius: 6, padding: 14,
                          maxHeight: 400, overflowY: "auto", fontFamily: FONT,
                        }}>{sc.recheckResult}</pre>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      {hasKey && (
                        <button
                          onClick={() => recheck(sc.id)}
                          disabled={verifying === sc.id}
                          style={{ ...btnSm(T_.blue + "15", T_.blue, T_.blue + "30"), opacity: verifying === sc.id ? 0.5 : 1 }}
                        >
                          {verifying === sc.id ? "Rechecking..." : "Recheck with Latest Data"}
                        </button>
                      )}
                      <button
                        onClick={() => navigator.clipboard.writeText(`SCENARIO: ${sc.input}\n\n${sc.analysis}${sc.verification ? `\n\nVERIFICATION:\n${sc.verification}` : ""}`)}
                        style={btnSm(T_.bgPanel, T_.textDim, T_.borderLight)}
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => { if (confirm("Delete this scenario?")) deleteScenario(sc.id); }}
                        style={btnSm("transparent", T_.textGhost, T_.borderLight)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
