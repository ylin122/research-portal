import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";
import ErrorBanner from "./lib/ErrorBanner";
import LastUpdated from "./lib/LastUpdated";

const AGENT_COLORS = {
  "refresh": { bg: `${T_.blue}22`, color: T_.blue, border: `${T_.blue}44` },
  "code-review": { bg: `${T_.green}22`, color: T_.green, border: `${T_.green}44` },
  "agent-review": { bg: "#A78BFA22", color: "#A78BFA", border: "#A78BFA44" },
  "fact-checker": { bg: `${T_.amber}22`, color: T_.amber, border: `${T_.amber}44` },
  "fact-disputer": { bg: `${T_.red}22`, color: T_.red, border: `${T_.red}44` },
  "fact-check-reconciler": { bg: "#A855F722", color: "#A855F7", border: "#A855F744" },
  "research-ingest": { bg: "#38BDF822", color: "#38BDF8", border: "#38BDF844" },
  "deploy": { bg: "#6EE7B722", color: "#6EE7B7", border: "#6EE7B744" },
  "whatif": { bg: "#FB923C22", color: "#FB923C", border: "#FB923C44" },
  "portfolio-verifier": { bg: "#14B8A622", color: "#14B8A6", border: "#14B8A644" },
  "consistency": { bg: "#818CF822", color: "#818CF8", border: "#818CF844" },
};
const DEFAULT_COLOR = { bg: `${T_.textGhost}22`, color: T_.textDim, border: `${T_.textGhost}44` };

function fmtDate(d) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function fmtTime(d) { return new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }
function fmtDuration(ms) {
  if (!ms) return null;
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  return `${Math.round(ms / 60000)}m`;
}

export default function AuditLog() {
  const [runs, setRuns] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  async function fetchRuns() {
    setLoadError(null);
    const { data, error } = await supabase
      .from("agent_runs")
      .select("*")
      .eq("project", "research-portal")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      console.error("fetchRuns:", error);
      setLoadError(error.message);
      setLoading(false);
      return;
    }
    setRuns(data || []);
    setLoading(false);
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: load data on mount
  useEffect(() => { fetchRuns(); }, []);

  const today = fmtDate(new Date().toISOString());
  const grouped = {};
  runs.forEach(r => {
    const day = fmtDate(r.created_at);
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(r);
  });

  // Stats
  const agentCounts = {};
  runs.forEach(r => { agentCounts[r.agent_name] = (agentCounts[r.agent_name] || 0) + 1; });
  const totalIssuesFound = runs.reduce((s, r) => s + (r.issues_found || 0), 0);
  const totalIssuesFixed = runs.reduce((s, r) => s + (r.issues_fixed || 0), 0);

  return (
    <div style={{ padding: "36px 52px", maxWidth: "none", fontFamily: FONT }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>Agent Run Log</div>
          <LastUpdated rows={runs} label="Last run" />
        </div>
        <button style={{
          padding: "8px 16px", fontSize: 12, borderRadius: 6, cursor: "pointer",
          background: T_.accent, color: "#000", border: "none", fontFamily: FONT, fontWeight: 500,
        }} onClick={fetchRuns}>Refresh</button>
      </div>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
        Every agent run logged with task, changes, and files modified.
        <span style={{ color: T_.textGhost, marginLeft: 8 }}>{runs.length} runs</span>
      </p>

      <ErrorBanner message={loadError} onRetry={fetchRuns} />

      {/* Stats bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {Object.entries(agentCounts).sort((a, b) => b[1] - a[1]).map(([agent, count]) => {
          const ac = AGENT_COLORS[agent] || DEFAULT_COLOR;
          return (
            <div key={agent} style={{
              padding: "6px 12px", borderRadius: 6, fontSize: 12, fontFamily: FONT,
              background: ac.bg, color: ac.color, border: `1px solid ${ac.border}`,
            }}>
              {agent} <span style={{ fontWeight: 700 }}>{count}</span>
            </div>
          );
        })}
        {totalIssuesFound > 0 && (
          <div style={{ padding: "6px 12px", borderRadius: 6, fontSize: 12, fontFamily: FONT, background: `${T_.amber}15`, color: T_.amber, border: `1px solid ${T_.amber}33` }}>
            Issues: {totalIssuesFixed}/{totalIssuesFound} fixed
          </div>
        )}
      </div>

      {loading && <div style={{ color: T_.textDim, fontSize: 14, textAlign: "center", padding: "40px 0" }}>Loading...</div>}

      {!loading && runs.length === 0 && (
        <div style={{ color: T_.textDim, fontSize: 14, textAlign: "center", padding: "40px 0" }}>
          No agent runs logged yet. Runs are logged after each agent completes.
        </div>
      )}

      {Object.entries(grouped).map(([day, entries]) => (
        <div key={day} style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: day === today ? T_.green : T_.textGhost,
            textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8,
            padding: "6px 0", borderBottom: `1px solid ${T_.borderLight}`,
          }}>
            {day === today ? "Today" : day} — {entries.length} run{entries.length !== 1 ? "s" : ""}
          </div>

          {entries.map(run => {
            const ac = AGENT_COLORS[run.agent_name] || DEFAULT_COLOR;
            const expanded = expandedId === run.id;
            const dur = fmtDuration(run.duration_ms);
            const files = run.files_modified || [];

            return (
              <div key={run.id} style={{
                background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 8,
                padding: "12px 16px", marginBottom: 6, cursor: "pointer",
                borderLeft: `3px solid ${ac.color}`,
              }} onClick={() => setExpandedId(expanded ? null : run.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 4, fontFamily: FONT, flexShrink: 0,
                    background: ac.bg, color: ac.color, border: `1px solid ${ac.border}`,
                  }}>{run.agent_name}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: T_.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {run.task}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {run.issues_found != null && (
                      <span style={{ fontSize: 11, color: run.issues_fixed === run.issues_found ? T_.green : T_.amber }}>
                        {run.issues_fixed || 0}/{run.issues_found} fixed
                      </span>
                    )}
                    {dur && <span style={{ fontSize: 11, color: T_.textGhost }}>{dur}</span>}
                    <span style={{ fontSize: 11, color: T_.textGhost }}>{fmtTime(run.created_at)}</span>
                  </div>
                </div>

                {expanded && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T_.borderLight}` }}>
                    {run.changes && (
                      <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6, whiteSpace: "pre-wrap", marginBottom: files.length ? 10 : 0 }}>
                        {run.changes}
                      </div>
                    )}
                    {files.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {files.map(f => (
                          <span key={f} style={{
                            fontSize: 11, padding: "2px 8px", borderRadius: 4, fontFamily: "monospace",
                            background: T_.border, color: T_.textDim, border: `1px solid ${T_.borderStrong}`,
                          }}>{f}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
