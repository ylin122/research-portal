import { useState } from "react";
import { T_, FONT } from "./lib/theme";

const PRIORITIES = ["High", "Medium", "Low"];
const prColors = {
  High: { bg: T_.greenBg, color: T_.green, border: T_.greenBorder },
  Medium: { bg: T_.amberBg, color: T_.amber, border: T_.amberBorder },
  Low: { bg: T_.grayBadge, color: T_.grayBadgeText, border: T_.textGhost },
};

const SECTORS = {
  software: "Software",
  aidigital: "Digital Infrastructure",
  itservices: "IT Services",
  internet: "Internet",
  hardware: "Hardware & Others",
  education: "Education & Services",
  healthcare: "Healthcare IT",
};

const categoryColor = (cat) => {
  const colors = { "M&A": T_.accent, "Earnings": T_.green, "Product": T_.blue, "Leadership": "#a78bfa", "Partnership": "#34d399", "Regulatory": T_.red, "Funding": T_.amber, "Other": T_.textGhost, "Acquisition": T_.accent, "Divestiture": "#a78bfa", "IPO": T_.green, "Merger": T_.amber, "Strategic Investment": T_.blue };
  return colors[cat] || T_.textGhost;
};

const impactColor = (impact) => {
  if (impact === "Positive" || impact === "Tailwind") return T_.green;
  if (impact === "Negative" || impact === "Headwind") return T_.red;
  return T_.amber;
};

export default function ResearchAgentPage({ companies, onSetPriority, researchResults }) {
  const [tab, setTab] = useState("High");
  const [collapsed, setCollapsed] = useState({});
  const agentResults = researchResults || {};

  const activeCos = companies.filter(c => c.sector !== "sources" && c.sector !== "prompts").sort((a, b) => a.name.localeCompare(b.name));

  const toggleCollapse = (key) => setCollapsed(p => ({ ...p, [key]: !p[key] }));

  // Filter companies by selected priority
  const priorityCos = tab === "config" ? activeCos : activeCos.filter(c => (c.priority || "") === tab);

  // Group by sector for config tab
  const bySector = {};
  for (const c of activeCos) {
    if (!bySector[c.sector]) bySector[c.sector] = [];
    bySector[c.sector].push(c);
  }

  const counts = { High: 0, Medium: 0, Low: 0, None: 0 };
  for (const c of activeCos) {
    if (c.priority && counts[c.priority] !== undefined) counts[c.priority]++;
    else counts.None++;
  }

  function fmtDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  // Render research results for a company
  function renderCompanyResults(co) {
    const data = agentResults[co.id];
    const isOpen = !collapsed[`res_${co.id}`];

    return (
      <div key={co.id} style={s.companyBlock}>
        <div style={s.companyHeader} onClick={() => toggleCollapse(`res_${co.id}`)}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 10, color: T_.textDim, transition: "transform .15s", transform: isOpen ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: T_.text }}>{co.name}</span>
            <span style={{ fontSize: 11, color: T_.textGhost }}>{SECTORS[co.sector] || co.sector}</span>
          </div>
          {data?.lastUpdated && (
            <span style={{ fontSize: 11, color: T_.textGhost }}>Updated {fmtDate(data.lastUpdated)}</span>
          )}
        </div>

        {isOpen && (
          <div style={{ padding: "0 18px 16px" }}>
            {!data ? (
              <div style={{ padding: "20px 0", textAlign: "center", color: T_.textGhost, fontSize: 13 }}>
                No research results yet. Run the Research Agent to populate.
              </div>
            ) : (
              <>
                {/* News */}
                {data.news && data.news.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={s.sectionLabel}>News & Press</div>
                    {data.news.map((item, i) => (
                      <div key={i} style={s.resultRow}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          {item.category && <span style={{ fontSize: 10, fontWeight: 600, color: categoryColor(item.category), textTransform: "uppercase" }}>{item.category}</span>}
                          <span style={{ fontSize: 13, fontWeight: 500, color: T_.text }}>{item.headline}</span>
                        </div>
                        {item.summary && <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6, marginBottom: 4 }}>{item.summary}</div>}
                        <div style={{ fontSize: 11, color: T_.textGhost }}>{item.source} — {item.date}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Transactions */}
                {data.transactions && data.transactions.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={s.sectionLabel}>Transactions & M&A</div>
                    {data.transactions.map((item, i) => (
                      <div key={i} style={s.resultRow}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: categoryColor(item.type), textTransform: "uppercase" }}>{item.type}</span>
                          <span style={{ fontSize: 13, fontWeight: 500, color: T_.text }}>{item.title}</span>
                        </div>
                        {item.summary && <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6, marginBottom: 4 }}>{item.summary}</div>}
                        <div style={{ display: "flex", gap: 16, fontSize: 11, color: T_.textGhost }}>
                          {item.value && <span>Value: {item.value}</span>}
                          {item.parties && <span>Parties: {item.parties}</span>}
                          <span>{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Competitive */}
                {data.competitive && data.competitive.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={s.sectionLabel}>Competitive Intel</div>
                    {data.competitive.map((item, i) => (
                      <div key={i} style={s.resultRow}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: T_.blue }}>{item.competitor}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: impactColor(item.impact) }}>{item.impact}</span>
                        </div>
                        <div style={{ fontSize: 13, color: T_.text, marginBottom: 4 }}>{item.development}</div>
                        {item.summary && <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6, marginBottom: 4 }}>{item.summary}</div>}
                        <div style={{ fontSize: 11, color: T_.textGhost }}>{item.date}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Industry */}
                {data.industry && data.industry.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={s.sectionLabel}>Industry Trends</div>
                    {data.industry.map((item, i) => (
                      <div key={i} style={s.resultRow}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: impactColor(item.impact) }}>{item.impact}</span>
                          <span style={{ fontSize: 13, fontWeight: 500, color: T_.text }}>{item.trend}</span>
                        </div>
                        {item.summary && <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6, marginBottom: 4 }}>{item.summary}</div>}
                        <div style={{ fontSize: 11, color: T_.textGhost }}>{item.source} — {item.date}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={s.page}>
      <h1 style={s.title}>Research Agent</h1>
      <p style={s.sub}>AI-powered research results for your prioritized companies.</p>

      <div style={s.tabBar}>
        {PRIORITIES.map(pr => (
          <span key={pr} style={{
            ...s.tab,
            ...(tab === pr ? { color: prColors[pr].color, borderBottomColor: prColors[pr].color } : {}),
          }} onClick={() => setTab(pr)}>
            {pr} Priority
            <span style={{ marginLeft: 6, fontSize: 11, color: tab === pr ? prColors[pr].color : T_.textGhost }}>({counts[pr]})</span>
          </span>
        ))}
        <span style={{ ...s.tab, ...(tab === "config" ? { color: T_.accent, borderBottomColor: T_.accent } : {}) }} onClick={() => setTab("config")}>
          Priority Config
        </span>
      </div>

      {/* ─── PRIORITY RESULT TABS ─── */}
      {PRIORITIES.includes(tab) && (
        <div>
          {priorityCos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: T_.textGhost }}>
              <div style={{ fontSize: 16, marginBottom: 8 }}>No {tab.toLowerCase()} priority companies</div>
              <div style={{ fontSize: 13 }}>Assign companies to {tab.toLowerCase()} priority in the Priority Config tab.</div>
            </div>
          ) : (
            priorityCos.map(co => renderCompanyResults(co))
          )}
        </div>
      )}

      {/* ─── CONFIG TAB ─── */}
      {tab === "config" && (
        <div>
          <div style={s.summaryRow}>
            {PRIORITIES.map(pr => (
              <div key={pr} style={{ ...s.summaryCard, borderColor: prColors[pr].border }}>
                <div style={{ fontSize: 22, fontWeight: 600, color: prColors[pr].color }}>{counts[pr]}</div>
                <div style={{ fontSize: 12, color: T_.textDim }}>{pr} Priority</div>
              </div>
            ))}
            <div style={{ ...s.summaryCard, borderColor: T_.border }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: T_.textGhost }}>{counts.None}</div>
              <div style={{ fontSize: 12, color: T_.textDim }}>Unassigned</div>
            </div>
          </div>

          {Object.entries(SECTORS).map(([sk, label]) => {
            const cos = bySector[sk];
            if (!cos || cos.length === 0) return null;
            const isCollapsed = collapsed[`cfg_${sk}`];
            const sectorCounts = { High: 0, Medium: 0, Low: 0 };
            for (const c of cos) {
              if (c.priority && sectorCounts[c.priority] !== undefined) sectorCounts[c.priority]++;
            }

            return (
              <div key={sk} style={s.sectorBlock}>
                <div style={s.sectorHeader} onClick={() => toggleCollapse(`cfg_${sk}`)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 10, color: T_.textDim, transition: "transform .15s", transform: isCollapsed ? "rotate(0)" : "rotate(90deg)", display: "inline-block" }}>&#9654;</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: T_.text }}>{label}</span>
                    <span style={{ fontSize: 12, color: T_.textGhost }}>{cos.length}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {PRIORITIES.map(pr => sectorCounts[pr] > 0 && (
                      <span key={pr} style={{ fontSize: 11, color: prColors[pr].color, background: prColors[pr].bg, padding: "2px 8px", borderRadius: 4 }}>
                        {sectorCounts[pr]} {pr}
                      </span>
                    ))}
                  </div>
                </div>
                {!isCollapsed && (
                  <div style={s.companyList}>
                    {cos.map(c => {
                      const pr = c.priority || "";
                      return (
                        <div key={c.id} style={s.companyRow}>
                          <span style={{ fontSize: 13, color: T_.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                          <div style={{ display: "flex", gap: 4 }}>
                            {PRIORITIES.map(p => {
                              const active = pr === p;
                              const pc = prColors[p];
                              return (
                                <span key={p} style={{
                                  padding: "4px 12px", fontSize: 11, borderRadius: 5, cursor: "pointer",
                                  border: `1px solid ${active ? pc.border : T_.border}`,
                                  background: active ? pc.bg : "transparent",
                                  color: active ? pc.color : T_.textGhost,
                                  transition: "all .12s", fontFamily: FONT,
                                }} onClick={() => onSetPriority(c.id, p)}>{p}</span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
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

const s = {
  page: { flex: 1, padding: "36px 52px", overflowY: "auto", maxWidth: "none" },
  title: { fontSize: 24, fontWeight: 500, color: T_.text, margin: "0 0 6px", fontFamily: FONT },
  sub: { fontSize: 14, color: T_.textDim, marginBottom: 24, lineHeight: 1.7, fontFamily: FONT },
  tabBar: { display: "flex", gap: 0, borderBottom: `1px solid ${T_.borderLight}`, marginBottom: 28 },
  tab: { padding: "10px 20px", fontSize: 13, fontWeight: 500, color: T_.textGhost, cursor: "pointer", borderBottom: "2px solid transparent", transition: "all .12s", fontFamily: FONT, marginBottom: -1 },
  companyBlock: { background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, marginBottom: 8, overflow: "hidden" },
  companyHeader: { padding: "14px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none", fontFamily: FONT },
  sectionLabel: { fontSize: 12, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10, paddingTop: 8, fontFamily: FONT },
  resultRow: { padding: "12px 0", borderBottom: `1px solid ${T_.borderLight}`, fontFamily: FONT },
  summaryRow: { display: "flex", gap: 10, marginBottom: 32 },
  summaryCard: { background: T_.bgPanel, border: `1px solid`, borderRadius: 10, padding: "14px 20px", minWidth: 100, textAlign: "center", fontFamily: FONT },
  sectorBlock: { marginBottom: 4, background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, overflow: "hidden" },
  sectorHeader: { padding: "12px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none", fontFamily: FONT },
  companyList: { borderTop: `1px solid ${T_.borderLight}` },
  companyRow: { display: "flex", alignItems: "center", gap: 12, padding: "9px 18px 9px 38px", borderBottom: `1px solid ${T_.borderLight}`, fontFamily: FONT },
};
