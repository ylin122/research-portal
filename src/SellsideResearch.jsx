import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";
import ErrorBanner from "./lib/ErrorBanner";
import LastUpdated from "./lib/LastUpdated";

// Color per broker. Anything else falls back to T_.textDim.
const BROKER_COLORS = {
  GS: T_.amber,
  MS: T_.blue,
  JPM: T_.accent,
  BofA: T_.red,
  Barclays: T_.green,
  DB: T_.amber,
  Citi: T_.blue,
  WF: T_.accent,
};

async function loadArticles() {
  const { data, error } = await supabase
    .from("sellside_articles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("loadArticles:", error); throw error; }
  return data || [];
}

async function deleteArticle(id) {
  const { error } = await supabase.from("sellside_articles").delete().eq("id", id);
  if (error) console.error("deleteArticle:", error);
}

function MiniSection({ title, color, children }) {
  return (
    <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: color || T_.accent, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

function fmtDate(d) {
  if (!d) return "";
  try {
    const dt = new Date(d.includes("T") ? d : d + "T00:00:00");
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return d; }
}

function brokerColor(broker) {
  if (!broker) return T_.textDim;
  return BROKER_COLORS[broker] || T_.textDim;
}

function ArticleCard({ article, onClick, onDelete }) {
  const hasAnalysis = article.key_takeaways?.length > 0 || article.investment_implications;
  const tickers = article.tickers || [];
  const color = brokerColor(article.broker);

  return (
    <div
      style={{
        background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`,
        padding: 20, cursor: "pointer", transition: "border-color 0.2s",
      }}
      onClick={onClick}
      onMouseEnter={e => e.currentTarget.style.borderColor = T_.accent}
      onMouseLeave={e => e.currentTarget.style.borderColor = T_.border}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 12 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          {article.broker ? (
            <span style={{
              fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
              color, background: `${color}15`, padding: "3px 8px", borderRadius: 4,
            }}>
              {article.broker}
            </span>
          ) : (
            <span style={{
              fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
              color: T_.textGhost, background: `${T_.textGhost}15`, padding: "3px 8px", borderRadius: 4,
            }}>
              Unanalyzed
            </span>
          )}
          {article.analyst && (
            <span style={{ fontSize: 11, color: T_.textDim }}>{article.analyst}</span>
          )}
          {hasAnalysis && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: T_.green,
              background: `${T_.green}15`, padding: "3px 8px", borderRadius: 4,
            }}>
              Analyzed
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {article.published_date && <span style={{ fontSize: 11, color: T_.textMid, fontWeight: 500 }}>Pub {article.published_date}</span>}
          <span style={{ fontSize: 11, color: T_.textGhost }}>Saved {fmtDate(article.date)}</span>
        </div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: T_.text, marginBottom: 8, lineHeight: 1.4 }}>
        {article.title || "Untitled"}
      </div>
      {tickers.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
          {tickers.map((t, i) => (
            <span key={i} style={{ fontSize: 10, color: T_.blue, background: `${T_.blue}15`, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>
              {t}
            </span>
          ))}
        </div>
      )}
      {article.summary && (
        <div style={{ fontSize: 13, color: T_.textDim, lineHeight: 1.6, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {article.summary}
        </div>
      )}
      {article.themes?.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
          {article.themes.slice(0, 4).map((theme, i) => (
            <span key={i} style={{ fontSize: 10, color: T_.accent, background: `${T_.accent}12`, padding: "2px 8px", borderRadius: 4, border: `1px solid ${T_.accent}30` }}>
              {theme}
            </span>
          ))}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {article.source_url ? (
          <a href={article.source_url} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()} style={{ fontSize: 11, color: T_.blue, textDecoration: "none" }}>
            View source ↗
          </a>
        ) : <span />}
        <button
          onClick={e => { e.stopPropagation(); onDelete(article.id); }}
          style={{ background: "none", border: "none", color: T_.textGhost, cursor: "pointer", fontSize: 11, padding: "2px 6px", borderRadius: 4 }}
          onMouseEnter={e => e.target.style.color = T_.red}
          onMouseLeave={e => e.target.style.color = T_.textGhost}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function ArticleDetail({ article, onBack }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const takeaways = article.key_takeaways || [];
  const themes = article.themes || [];
  const questions = article.questions || [];
  const tickers = article.tickers || [];
  const hasAnalysis = takeaways.length > 0 || article.investment_implications;
  const color = brokerColor(article.broker);

  return (
    <div>
      <button onClick={onBack} style={{
        background: "none", border: `1px solid ${T_.border}`, color: T_.textMid,
        cursor: "pointer", fontSize: 12, padding: "6px 14px", borderRadius: 6, marginBottom: 20, fontFamily: FONT,
      }}>
        ← Back to reports
      </button>

      <div style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {article.broker && (
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color, background: `${color}15`, padding: "3px 8px", borderRadius: 4 }}>
            {article.broker}
          </span>
        )}
        {article.analyst && <span style={{ fontSize: 12, color: T_.textMid }}>{article.analyst}</span>}
        {hasAnalysis && <span style={{ fontSize: 10, fontWeight: 600, color: T_.green, background: `${T_.green}15`, padding: "3px 8px", borderRadius: 4 }}>Analyzed</span>}
        {article.published_date && <span style={{ fontSize: 12, color: T_.textMid, fontWeight: 500 }}>Pub {article.published_date}</span>}
        <span style={{ fontSize: 12, color: T_.textGhost }}>Saved {fmtDate(article.date)}</span>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: T_.text, marginBottom: 8, lineHeight: 1.3 }}>
        {article.title}
      </h1>
      {tickers.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {tickers.map((t, i) => (
            <span key={i} style={{ fontSize: 11, color: T_.blue, background: `${T_.blue}15`, padding: "3px 10px", borderRadius: 6, fontWeight: 600 }}>
              {t}
            </span>
          ))}
        </div>
      )}
      {article.source_url && (
        <a href={article.source_url} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: T_.blue, textDecoration: "none", display: "inline-block", marginBottom: 20 }}>
          {article.source_url} ↗
        </a>
      )}

      {themes.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {themes.map((theme, i) => (
            <span key={i} style={{ fontSize: 11, color: T_.accent, background: `${T_.accent}15`, padding: "4px 12px", borderRadius: 6, border: `1px solid ${T_.accent}30` }}>
              {theme}
            </span>
          ))}
        </div>
      )}

      {article.summary && (
        <MiniSection title="Summary" color={T_.accent}>
          <div style={{ fontSize: 14, color: T_.textMid, lineHeight: 1.7 }}>{article.summary}</div>
        </MiniSection>
      )}

      {takeaways.length > 0 && (
        <MiniSection title="Key Takeaways" color={T_.green}>
          {takeaways.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <span style={{ color: T_.green, fontSize: 14, flexShrink: 0, marginTop: 1 }}>→</span>
              <span style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{t}</span>
            </div>
          ))}
        </MiniSection>
      )}

      {article.investment_implications && (
        <MiniSection title="Investment Implications" color={T_.amber}>
          <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{article.investment_implications}</div>
        </MiniSection>
      )}

      {questions.length > 0 && (
        <MiniSection title="Open Questions" color={T_.red}>
          {questions.map((q, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ color: T_.red, fontSize: 13, flexShrink: 0 }}>?</span>
              <span style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{q}</span>
            </div>
          ))}
        </MiniSection>
      )}

      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showFullContent ? 16 : 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Report Content</div>
          <button onClick={() => setShowFullContent(!showFullContent)} style={{
            background: "none", border: `1px solid ${T_.border}`, color: T_.textDim,
            padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: FONT,
          }}>
            {showFullContent ? "Collapse" : "Expand"}
          </button>
        </div>
        {showFullContent && (
          <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, whiteSpace: "pre-wrap", maxHeight: 600, overflow: "auto" }}>
            {article.content || "No content available."}
          </div>
        )}
      </div>

      {!hasAnalysis && (
        <div style={{ marginTop: 20, padding: 20, background: `${T_.amber}10`, borderRadius: 10, border: `1px solid ${T_.amber}30`, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: T_.amber, marginBottom: 4 }}>This report hasn't been analyzed yet.</div>
          <div style={{ fontSize: 12, color: T_.textDim }}>Run <code>/sellside-research-ingest</code> in Claude Code to extract broker / analyst / tickers and generate takeaways + implications.</div>
        </div>
      )}
    </div>
  );
}

export default function SellsideResearch() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [brokerFilter, setBrokerFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await loadArticles();
      setArticles(data);
    } catch (err) {
      setLoadError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    await deleteArticle(id);
    setArticles(prev => prev.filter(a => a.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  // Broker list is data-driven; unanalyzed rows roll up under their own bucket.
  const brokers = useMemo(() => {
    const map = new Map();
    for (const a of articles) {
      const b = a.broker || "(unanalyzed)";
      map.set(b, (map.get(b) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [articles]);

  const filtered = articles.filter(a => {
    if (brokerFilter !== "all") {
      const b = a.broker || "(unanalyzed)";
      if (b !== brokerFilter) return false;
    }
    return true;
  });

  const analyzed = articles.filter(a => a.key_takeaways?.length > 0).length;

  if (selected) {
    return <div style={{ padding: 0 }}><ArticleDetail article={selected} onBack={() => setSelected(null)} /></div>;
  }

  return (
    <div style={{ padding: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px", fontFamily: FONT }}>
          Sellside
        </div>
        <LastUpdated rows={articles} />
      </div>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 24, lineHeight: 1.6 }}>
        Sell-side reports forwarded to <span style={{ color: T_.accent }}>ylresearchwiki@gmail.com</span> with subject prefix <code style={{ color: T_.accent }}>[Sellside]</code>. Run <code style={{ color: T_.accent }}>/sellside-research-ingest</code> in Claude Code to pull, analyze, and tag broker / analyst / tickers.
      </p>

      <ErrorBanner message={loadError} onRetry={load} />

      {/* Broker filter chips */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={() => setBrokerFilter("all")} style={{
          background: brokerFilter === "all" ? `${T_.accent}20` : "transparent",
          border: `1px solid ${brokerFilter === "all" ? T_.accent : T_.border}`,
          color: brokerFilter === "all" ? T_.accent : T_.textDim,
          padding: "6px 14px", borderRadius: 6, cursor: "pointer",
          fontSize: 12, fontFamily: FONT, fontWeight: brokerFilter === "all" ? 600 : 400,
        }}>
          All
          <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>{articles.length}</span>
        </button>
        {brokers.map(([b, n]) => {
          const active = brokerFilter === b;
          const color = brokerColor(b === "(unanalyzed)" ? null : b);
          return (
            <button key={b} onClick={() => setBrokerFilter(b)} style={{
              background: active ? `${color}20` : "transparent",
              border: `1px solid ${active ? color : T_.border}`,
              color: active ? color : T_.textDim,
              padding: "6px 14px", borderRadius: 6, cursor: "pointer",
              fontSize: 12, fontFamily: FONT, fontWeight: active ? 600 : 400,
            }}>
              {b}
              <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>{n}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: T_.textGhost }}>
          <span style={{ color: T_.text, fontWeight: 600 }}>{articles.length}</span> reports
        </div>
        <div style={{ fontSize: 12, color: T_.textGhost }}>
          <span style={{ color: T_.green, fontWeight: 600 }}>{analyzed}</span> analyzed
        </div>
        <div style={{ fontSize: 12, color: T_.textGhost }}>
          <span style={{ color: T_.text, fontWeight: 600 }}>{filtered.length}</span> showing
        </div>
      </div>

      {loading ? (
        <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center", lineHeight: 1.7 }}>
          {articles.length === 0
            ? "No reports yet. Forward sell-side PDFs to ylresearchwiki@gmail.com with subject [Sellside], then run /sellside-research-ingest."
            : "No reports match the current filter."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(a => (
            <ArticleCard key={a.id} article={a} onClick={() => setSelected(a)} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
