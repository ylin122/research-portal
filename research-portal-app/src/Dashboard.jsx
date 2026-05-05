import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";
import ErrorBanner from "./lib/ErrorBanner";

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
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const load = () => {
    setLoading(true);
    setLoadError(null);
    Promise.all([
      supabase.from("kb_articles").select("id, title, date, category, key_takeaways, themes").order("created_at", { ascending: false }).limit(5),
      supabase.from("concepts").select("id, title, topic, one_liner").order("title", { ascending: true }),
    ]).then(([aRes, cRes]) => {
      const err = aRes.error || cRes.error;
      if (err) { setLoadError(err.message); setLoading(false); return; }
      setArticles(aRes.data || []);
      setConcepts(cRes.data || []);
      setLoading(false);
    });
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: load data on mount
  useEffect(() => { load(); }, []);

  if (loading) return <div style={{ padding: "60px 44px", color: T_.textDim, fontSize: 14, textAlign: "center" }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: 0 }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px", marginBottom: 4, fontFamily: FONT }}>Dashboard</div>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 24, lineHeight: 1.6 }}>
        Overview of your research portal. {companies?.length > 0 && `Tracking ${companies.length} companies.`}
      </p>

      <ErrorBanner message={loadError} onRetry={load} />

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
    </div>
  );
}
