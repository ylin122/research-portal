import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";

function fmtDate(d) { return d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""; }

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{ background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.border}`, padding: "16px 18px", textAlign: "center" }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: color || T_.text }}>{value}</div>
      <div style={{ fontSize: 11, color: T_.textDim, marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, count, onViewAll }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, marginTop: 28 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: T_.text }}>{title} {count != null && <span style={{ color: T_.textGhost, fontWeight: 400 }}>({count})</span>}</div>
      {onViewAll && <span onClick={onViewAll} style={{ fontSize: 11, color: T_.accent, cursor: "pointer" }}>View all →</span>}
    </div>
  );
}

export default function Dashboard({ companies, setView }) {
  const [articles, setArticles] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [qa, setQa] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("kb_articles").select("id, title, date, category, key_takeaways, themes").order("created_at", { ascending: false }).limit(5),
      supabase.from("ideas").select("id, title, status, conviction, updated_at").order("updated_at", { ascending: false }).limit(10),
      supabase.from("concepts").select("id, title, topic, one_liner").order("title", { ascending: true }),
      supabase.from("qa_log").select("id, question, answer, created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("watchlist").select("id, keyword, active").order("created_at", { ascending: false }),
    ]).then(([aRes, iRes, cRes, qRes, wRes]) => {
      setArticles(aRes.data || []);
      setIdeas(iRes.data || []);
      setConcepts(cRes.data || []);
      setQa(qRes.data || []);
      setAlerts(wRes.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const ideasByStatus = (status) => ideas.filter(i => i.status === status).length;
  const pendingQa = qa.filter(q => !q.answer).length;
  const activeAlerts = alerts.filter(a => a.active).length;

  if (loading) return <div style={{ padding: "60px 44px", color: T_.textDim, fontSize: 14, textAlign: "center" }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: 0 }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4, fontFamily: FONT }}>Dashboard</div>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 24, lineHeight: 1.6 }}>
        Overview of your research portal. {companies?.length > 0 && `Tracking ${companies.length} companies.`}
      </p>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 8 }}>
        <StatCard label="Wiki Articles" value={articles.length} color={T_.blue} />
        <StatCard label="Concepts" value={concepts.length} color={T_.green} />
        {companies?.length > 0 && <StatCard label="Companies" value={companies.length} color={T_.accent} />}
      </div>

      {/* Recent Wiki Articles */}
      {articles.length > 0 && (
        <>
          <SectionHeader title="Recent Articles" count={articles.length} onViewAll={() => setView({ type: "researchWiki" })} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {articles.slice(0, 5).map(a => (
              <div key={a.id} onClick={() => setView({ type: "researchWiki" })} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.border}`, cursor: "pointer",
              }}>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: T_.blue, background: `${T_.blue}15`, padding: "2px 8px", borderRadius: 4, flexShrink: 0 }}>{a.category || "article"}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: T_.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</span>
                {a.key_takeaways?.length > 0 && <span style={{ fontSize: 10, color: T_.green, flexShrink: 0 }}>Analyzed</span>}
                <span style={{ fontSize: 11, color: T_.textGhost, flexShrink: 0 }}>{fmtDate(a.date)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Idea Pipeline */}
      {ideas.length > 0 && (
        <>
          <SectionHeader title="Idea Pipeline" count={ideas.length} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 4 }}>
            {[
              { key: "seed", label: "Seed", color: T_.textDim },
              { key: "researching", label: "Researching", color: T_.blue },
              { key: "thesis", label: "Thesis", color: T_.amber },
              { key: "validated", label: "Validated", color: T_.green },
              { key: "archived", label: "Archived", color: T_.textGhost },
            ].map(s => (
              <div key={s.key} style={{ background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.border}`, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{ideasByStatus(s.key)}</div>
                <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pending Q&A */}
      {pendingQa > 0 && (
        <>
          <SectionHeader title="Pending Questions" count={pendingQa} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {qa.filter(q => !q.answer).slice(0, 3).map(q => (
              <div key={q.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.border}`, borderLeft: `3px solid ${T_.amber}`,
              }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: T_.amber, background: `${T_.amber}15`, padding: "2px 8px", borderRadius: 4 }}>Pending</span>
                <span style={{ fontSize: 13, color: T_.text, flex: 1 }}>{q.question}</span>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}
