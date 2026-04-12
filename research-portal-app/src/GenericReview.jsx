import React, { useState } from "react";
import { T_, FONT } from "./lib/theme";

const RESEARCH_FIELDS = [
  { key: "overview", label: "Company overview", ph: "Business description, founding year, HQ, stage, ownership, funding history, key leadership..." },
  { key: "products", label: "Key business / products", ph: "Start with how the company makes money..." },
  { key: "customers", label: "Customer focus", ph: "Target segments, key accounts, verticals..." },
  { key: "industry", label: "Industry & market", ph: "TAM/SAM/SOM, growth drivers, macro trends..." },
  { key: "competitive", label: "Competitive landscape", ph: "Key competitors, differentiation, moat..." },
  { key: "transactions", label: "Recent transactions", ph: "Funding rounds, M&A, divestitures, partnerships..." },
  { key: "financials", label: "Financials & metrics", ph: "Revenue, growth, margins, ARR/MRR..." },
];

const s = {
  card: { background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 16 },
  section: { marginBottom: 36 },
  sectionHdr: { fontSize: 14, fontWeight: 500, color: T_.textDim, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${T_.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: FONT },
  sectionDate: { fontSize: 12, fontWeight: 400, color: T_.textGhost, fontFamily: FONT },
  btnSmall: { padding: "4px 12px", fontSize: 12, border: `1px solid ${T_.border}`, background: "transparent", color: T_.textDim, borderRadius: 5, cursor: "pointer", fontFamily: FONT },
  proseBody: { fontSize: 14, lineHeight: 1.9, color: T_.text, cursor: "pointer", whiteSpace: "pre-wrap", padding: "6px 0", fontFamily: FONT },
  textarea: { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, padding: "14px 16px", fontSize: 14, color: T_.text, outline: "none", fontFamily: FONT, resize: "vertical", minHeight: 110, lineHeight: 1.8, boxSizing: "border-box" },
};

function fmtShort(d) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function tryJSON(text) { try { return JSON.parse(text); } catch { return null; } }
const typeBg = (t) => ({ Earnings: "rgba(139,92,246,0.12)", Capacity: "rgba(16,185,129,0.12)", Financing: "rgba(59,130,246,0.12)", Contract: "rgba(239,68,68,0.12)", Regulatory: "rgba(245,158,11,0.12)", Product: "rgba(245,158,11,0.12)", "M&A": "rgba(239,68,68,0.12)" }[t] || "rgba(245,158,11,0.12)");
const typeColor = (t) => ({ Earnings: "#8B5CF6", Capacity: "#10B981", Financing: "#3B82F6", Contract: "#EF4444", Regulatory: "#F59E0B", Product: "#F59E0B", "M&A": "#EF4444" }[t] || "#F59E0B");

/* ── Reusable sub-components matching CoreWeave visual style ── */

function TimelineCard({ events, label, color }) {
  if (!events || !events.length) return null;
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${color}` }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {events.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "8px 10px", background: "#0B0F19", borderRadius: 6, border: "1px solid #1E293B" }}>
            <div style={{ width: 85, minWidth: 85 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color }}>{c.date}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC" }}>{c.event}</span>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 3, background: typeBg(c.type), color: typeColor(c.type) }}>{c.type}</span>
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>{c.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataTable({ headers, rows, colColors }) {
  if (!rows || !rows.length) return null;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 700 }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: colColors?.[j] || "#E2E8F0", fontWeight: j === 0 ? 700 : 400, fontSize: j === 0 ? 12 : 11 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EntityCard({ entity }) {
  return (
    <div style={{ background: "#111827", border: entity.highlight ? "1px dashed #3B82F6" : "1px solid #1E293B", borderRadius: 8, padding: "12px 12px 10px" }}>
      {entity.tag && <div style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: typeBg(entity.tag), color: typeColor(entity.tag), fontWeight: 600, display: "inline-block", marginBottom: 6 }}>{entity.tag}</div>}
      <div style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC", marginBottom: 2, lineHeight: 1.2 }}>{entity.name}</div>
      {entity.sub && <div style={{ fontSize: 9, color: "#64748B", marginBottom: 8 }}>{entity.sub}</div>}
      {entity.metrics && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 8 }}>
          {entity.metrics.map((m, i) => (
            <div key={i} style={{ background: "#0B0F19", borderRadius: 5, padding: "6px 8px" }}>
              <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>{m.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: m.color || "#3B82F6" }}>{m.value}</div>
              {m.sub && <div style={{ fontSize: 10, color: "#94A3B8" }}>{m.sub}</div>}
            </div>
          ))}
        </div>
      )}
      {entity.details && (
        <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.7 }}>
          {entity.details.map((d, i) => (
            <div key={i}><span style={{ color: "#64748B", fontWeight: 600 }}>{d.label}:</span> {d.value}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function RiskCard({ title, desc, color }) {
  return (
    <div style={{ flex: "1 1 280px", minWidth: 280, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: "1.6" }}>{desc}</div>
    </div>
  );
}

function MetricCards({ metrics }) {
  if (!metrics || !metrics.length) return null;
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
      {metrics.map((m, i) => (
        <div key={i} style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: "14px 18px", flex: "1 1 180px", minWidth: 180 }}>
          <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{m.label}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: m.color || "#F8FAFC" }}>{m.value}</div>
          {m.sub && <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{m.sub}</div>}
        </div>
      ))}
    </div>
  );
}

function SentimentArc({ phases }) {
  if (!phases || !phases.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {phases.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B" }}>
          <div style={{ width: 200, minWidth: 200, background: "#0B0F19", padding: "12px 14px", borderRight: "1px solid #1E293B" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC" }}>{p.phase}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: p.color || "#8B5CF6", marginTop: 4 }}>{p.sentiment}</div>
          </div>
          <div style={{ flex: 1, padding: "12px 14px", background: "#111827" }}>
            <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.6 }}>{p.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FieldEditor({ fieldKey, curFields, companyId, updateField, editingField, setEditingField, placeholder }) {
  const fd = curFields?.[fieldKey];
  const isEditing = editingField === fieldKey;
  const hasContent = fd?.text?.trim();
  return (isEditing || !hasContent) ? (
    <div>
      <textarea style={s.textarea} rows={6} value={fd?.text || ""} onChange={e => updateField(companyId, fieldKey, e.target.value)} placeholder={placeholder} autoFocus={isEditing} />
      {isEditing && <button style={{ ...s.btnSmall, marginTop: 10 }} onClick={() => setEditingField(null)}>Done</button>}
    </div>
  ) : (
    <div style={s.proseBody} onClick={() => setEditingField(fieldKey)}>{fd.text}</div>
  );
}

/* ── Main Component ── */

export default function GenericReview({ companyId, companyName, curFields, updateField, editingField, setEditingField }) {
  const [tab, setTab] = useState("recent");
  const fp = { curFields, companyId, updateField, editingField, setEditingField };

  // Parse JSON data from Supabase fields
  const timeline = tryJSON(curFields?.overview_timeline_json?.text);
  const ecosystem = tryJSON(curFields?.overview_ecosystem_json?.text);
  const orgEntities = tryJSON(curFields?.orgchart_entities_json?.text);
  const orgDebt = tryJSON(curFields?.orgchart_debt_json?.text);
  const orgRisk = tryJSON(curFields?.orgchart_risk_json?.text);
  const contractsTable = tryJSON(curFields?.contracts_table_json?.text);
  const suppliersTable = tryJSON(curFields?.contracts_suppliers_json?.text);
  const contractRisks = tryJSON(curFields?.contracts_risk_json?.text);
  const sentimentSnap = tryJSON(curFields?.sentiment_snapshot_json?.text);
  const sentimentArc = tryJSON(curFields?.sentiment_arc_json?.text);
  const analystTable = tryJSON(curFields?.sentiment_analysts_json?.text);
  const creditTable = tryJSON(curFields?.sentiment_credit_json?.text);
  const ownershipTable = tryJSON(curFields?.sentiment_ownership_json?.text);

  return (
    <>
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #1E293B" }}>
        {[{ key: "recent", label: "Research" }, { key: "overview", label: "Overview" }, { key: "orgchart", label: "Org Chart" }, { key: "contracts", label: "Supply Chain & Customers" }, { key: "sentiment", label: "Sentiment" }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "8px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
            background: "transparent", color: tab === t.key ? "#F8FAFC" : "#64748B",
            borderBottom: tab === t.key ? "2px solid #3B82F6" : "2px solid transparent",
            marginBottom: -1, transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ===== RESEARCH TAB ===== */}
      {tab === "recent" && (
        <div style={s.section}>
          {RESEARCH_FIELDS.map(f => {
            const fd = curFields?.[f.key];
            const isEditing = editingField === f.key;
            const hasContent = fd?.text?.trim();
            return (
              <div key={f.key} style={s.section}>
                <div style={s.sectionHdr}>
                  <span>{f.label}</span>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {fd?.date && <span style={s.sectionDate}>{fmtShort(fd.date)}</span>}
                    {hasContent && !isEditing && <button style={s.btnSmall} onClick={() => setEditingField(f.key)}>Edit</button>}
                  </div>
                </div>
                {(isEditing || !hasContent) ? (
                  <div>
                    <textarea style={s.textarea} rows={6} value={fd?.text || ""} onChange={e => updateField(companyId, f.key, e.target.value)} placeholder={f.ph} autoFocus={isEditing} />
                    {isEditing && <button style={{ ...s.btnSmall, marginTop: 10 }} onClick={() => setEditingField(null)}>Done</button>}
                  </div>
                ) : (
                  <div style={s.proseBody} onClick={() => setEditingField(f.key)}>{fd.text}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== OVERVIEW TAB ===== */}
      {tab === "overview" && (<>
        <div style={s.card}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>{companyName}</div>
        </div>

        {/* Key Events Timeline */}
        {timeline && (
          <div style={s.card}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Key Events Timeline</div>
            <div style={{ display: "flex", gap: 16 }}>
              <TimelineCard events={timeline.near} label={timeline.nearLabel || "0\u20136 Months"} color="#3B82F6" />
              <TimelineCard events={timeline.far} label={timeline.farLabel || "6\u201318 Months"} color="#F59E0B" />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
              {["Contract", "Earnings", "Capacity", "Financing", "Product", "M&A", "Regulatory"].map((l, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748B" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: typeColor(l) }} />{l}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ecosystem Map */}
        {ecosystem && (
          <>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>{companyName} Ecosystem</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {ecosystem.map((layer, li) => (
                <div key={li} style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B" }}>
                  <div style={{ width: 180, minWidth: 180, background: "#0B0F19", padding: "12px 14px", display: "flex", alignItems: "center", borderRight: "1px solid #1E293B" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px" }}>{layer.label}</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", gap: 0, flexWrap: "wrap", background: "#111827" }}>
                    {layer.items.map((item, ii) => (
                      <div key={ii} style={{ flex: "1 1 200px", padding: "10px 14px", borderRight: ii < layer.items.length - 1 ? "1px solid #1E293B" : "none" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: item.color || "#F59E0B" }}>{item.name}</div>
                        <div style={{ fontSize: 10, color: "#64748B", marginTop: 2, lineHeight: 1.4 }}>{item.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Fallback: editable text if no JSON */}
        {!timeline && !ecosystem && (
          <div style={s.section}>
            <div style={s.sectionHdr}><span>Overview</span></div>
            <FieldEditor fieldKey="overview_timeline" placeholder="Key events timeline (or paste JSON)..." {...fp} />
          </div>
        )}
      </>)}

      {/* ===== ORG CHART TAB ===== */}
      {tab === "orgchart" && (<>
        {/* Parent Entity */}
        {orgEntities?.parent && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 8 }}>
            <div style={{ background: "linear-gradient(135deg, #1E3A5F, #0B1929)", border: "2px solid #3B82F6", borderRadius: 12, padding: "20px 40px", textAlign: "center", minWidth: 400 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>{orgEntities.parent.name}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{orgEntities.parent.sub}</div>
              {orgEntities.parent.ratings && (
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
                  {orgEntities.parent.ratings.map((r, i) => (
                    <span key={i} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>{r}</span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ width: 2, height: 24, background: "#1E293B" }} />
          </div>
        )}

        {/* Entity Cards */}
        {orgEntities?.entities && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(orgEntities.entities.length, 4)}, 1fr)`, gap: 8, marginBottom: 16 }}>
            {orgEntities.entities.map((e, i) => <EntityCard key={i} entity={e} />)}
          </div>
        )}

        {/* Debt Instruments */}
        {orgDebt && orgDebt.length > 0 && (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, marginTop: 4 }}>Debt at Parent</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(orgDebt.length, 3)}, 1fr)`, gap: 8, marginBottom: 16 }}>
              {orgDebt.map((e, i) => <EntityCard key={i} entity={e} />)}
            </div>
          </>
        )}

        {/* Cross-Structure Risk */}
        {orgRisk && orgRisk.length > 0 && (
          <div style={s.card}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Key Risk Factors</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {orgRisk.map((r, i) => (
                <div key={i} style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: r.color || "#EF4444", marginBottom: 6 }}>{r.title}</div>
                  <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.6 }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback */}
        {!orgEntities && !orgDebt && (
          <div style={s.section}>
            <div style={s.sectionHdr}><span>Corporate & Debt Structure</span></div>
            <FieldEditor fieldKey="orgchart_structure" placeholder="Corporate structure JSON or text..." {...fp} />
          </div>
        )}
      </>)}

      {/* ===== SUPPLY CHAIN & CUSTOMERS TAB ===== */}
      {tab === "contracts" && (<>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Supply Chain & Customers</div>

        {/* Key Customers Table */}
        {contractsTable && (
          <div style={s.card}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Key Customer Relationships</div>
            <DataTable headers={contractsTable.headers} rows={contractsTable.rows} colColors={contractsTable.colColors} />
          </div>
        )}

        {/* Suppliers Table */}
        {suppliersTable && (
          <div style={s.card}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Supply Chain & Key Partners</div>
            <DataTable headers={suppliersTable.headers} rows={suppliersTable.rows} colColors={suppliersTable.colColors} />
          </div>
        )}

        {/* Risk Factors */}
        {contractRisks && contractRisks.length > 0 && (
          <div style={s.card}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>Risk Factors</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {contractRisks.map((r, i) => <RiskCard key={i} title={r.title} desc={r.desc} color={r.color || "#F59E0B"} />)}
            </div>
          </div>
        )}

        {/* Fallback */}
        {!contractsTable && !suppliersTable && (
          <div style={s.section}>
            <div style={s.sectionHdr}><span>Supply Chain & Customers</span></div>
            <FieldEditor fieldKey="contracts_customers" placeholder="Customer relationships JSON or text..." {...fp} />
          </div>
        )}
      </>)}

      {/* ===== SENTIMENT TAB ===== */}
      {tab === "sentiment" && (<>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Market Sentiment</div>

        {/* Consensus Snapshot */}
        {sentimentSnap && <MetricCards metrics={sentimentSnap} />}

        {/* Sentiment Arc */}
        {sentimentArc && (
          <div style={s.card}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Sentiment Arc</div>
            <SentimentArc phases={sentimentArc} />
          </div>
        )}

        {/* Analyst Coverage */}
        {analystTable && (
          <div style={s.card}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Analyst Coverage</div>
            <DataTable headers={analystTable.headers} rows={analystTable.rows} colColors={analystTable.colColors} />
          </div>
        )}

        {/* Credit Ratings */}
        {creditTable && (
          <div style={s.card}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Credit Research & Ratings</div>
            <DataTable headers={creditTable.headers} rows={creditTable.rows} colColors={creditTable.colColors} />
          </div>
        )}

        {/* Ownership */}
        {ownershipTable && (
          <div style={s.card}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Key Holders & Insider Activity</div>
            <DataTable headers={ownershipTable.headers} rows={ownershipTable.rows} colColors={ownershipTable.colColors} />
          </div>
        )}

        {/* Fallback */}
        {!sentimentSnap && !sentimentArc && (
          <div style={s.section}>
            <div style={s.sectionHdr}><span>Sentiment</span></div>
            <FieldEditor fieldKey="sentiment_analyst" placeholder="Analyst coverage JSON or text..." {...fp} />
          </div>
        )}
      </>)}
    </>
  );
}
