import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";
import ErrorBanner from "./lib/ErrorBanner";
import LastUpdated from "./lib/LastUpdated";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "articles", label: "Articles" },
  { key: "notes", label: "Notes" },
  { key: "threads", label: "Threads" },
  { key: "papers", label: "Papers" },
];

// ─── DB Functions ────────────────────────────────────
async function loadArticles() {
  const { data, error } = await supabase
    .from("kb_articles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("loadArticles:", error); throw error; }
  return data || [];
}

async function upsertArticle(article) {
  const { error } = await supabase.from("kb_articles").upsert(article, { onConflict: "id" });
  if (error) console.error("upsertArticle:", error);
}

async function deleteArticle(id) {
  const { error } = await supabase.from("kb_articles").delete().eq("id", id);
  if (error) console.error("deleteArticle:", error);
}

// ─── Section Component ───────────────────────────────
function Section({ title, color, children }) {
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

// ─── Article Card ────────────────────────────────────
function ArticleCard({ article, onClick, onDelete }) {
  const categoryColors = { articles: T_.blue, notes: T_.green, threads: T_.amber, papers: T_.accent };
  const hasAnalysis = article.key_takeaways?.length > 0 || article.investment_implications;

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{
            fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
            color: categoryColors[article.category] || T_.textDim,
            background: `${categoryColors[article.category] || T_.textDim}15`,
            padding: "3px 8px", borderRadius: 4,
          }}>
            {article.category || "article"}
          </span>
          {hasAnalysis && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: T_.green,
              background: `${T_.green}15`, padding: "3px 8px", borderRadius: 4,
            }}>
              Analyzed
            </span>
          )}
        </div>
        {article.published_date && <span style={{ fontSize: 11, color: T_.textMid, fontWeight: 500 }}>Published {article.published_date}</span>}
        {article.published_date && article.date && <span style={{ fontSize: 11, color: T_.textGhost }}> · </span>}
        <span style={{ fontSize: 11, color: T_.textGhost }}>Saved {fmtDate(article.date)}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: T_.text, marginBottom: 8, lineHeight: 1.4 }}>
        {article.title || "Untitled"}
      </div>
      {article.summary && (
        <div style={{ fontSize: 13, color: T_.textDim, lineHeight: 1.6, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {article.summary}
        </div>
      )}
      {/* Show themes as tags */}
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

// ─── Article Detail View ─────────────────────────────
function ArticleDetail({ article, onBack }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const takeaways = article.key_takeaways || [];
  const themes = article.themes || [];
  const questions = article.questions || [];
  const hasAnalysis = takeaways.length > 0 || article.investment_implications;

  return (
    <div>
      <button onClick={onBack} style={{
        background: "none", border: `1px solid ${T_.border}`, color: T_.textMid,
        cursor: "pointer", fontSize: 12, padding: "6px 14px", borderRadius: 6, marginBottom: 20, fontFamily: FONT,
      }}>
        ← Back to articles
      </button>

      {/* Header */}
      <div style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: T_.blue, background: `${T_.blue}15`, padding: "3px 8px", borderRadius: 4 }}>
          {article.category || "article"}
        </span>
        {hasAnalysis && <span style={{ fontSize: 10, fontWeight: 600, color: T_.green, background: `${T_.green}15`, padding: "3px 8px", borderRadius: 4 }}>Analyzed</span>}
        {article.published_date && <span style={{ fontSize: 12, color: T_.textMid, fontWeight: 500 }}>Published {article.published_date}</span>}
        {article.published_date && <span style={{ fontSize: 12, color: T_.textGhost }}> · </span>}
        <span style={{ fontSize: 12, color: T_.textGhost }}>Saved {fmtDate(article.date)}</span>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: T_.text, marginBottom: 8, lineHeight: 1.3 }}>
        {article.title}
      </h1>
      {article.source_url && (
        <a href={article.source_url} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: T_.blue, textDecoration: "none", display: "inline-block", marginBottom: 20 }}>
          {article.source_url} ↗
        </a>
      )}

      {/* Themes */}
      {themes.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {themes.map((theme, i) => (
            <span key={i} style={{ fontSize: 11, color: T_.accent, background: `${T_.accent}15`, padding: "4px 12px", borderRadius: 6, border: `1px solid ${T_.accent}30` }}>
              {theme}
            </span>
          ))}
        </div>
      )}

      {/* Summary */}
      {article.summary && (
        <Section title="Summary" color={T_.accent}>
          <div style={{ fontSize: 14, color: T_.textMid, lineHeight: 1.7 }}>{article.summary}</div>
        </Section>
      )}

      {/* Key Takeaways */}
      {takeaways.length > 0 && (
        <Section title="Key Takeaways" color={T_.green}>
          {takeaways.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <span style={{ color: T_.green, fontSize: 14, flexShrink: 0, marginTop: 1 }}>→</span>
              <span style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{t}</span>
            </div>
          ))}
        </Section>
      )}

      {/* Investment Implications */}
      {article.investment_implications && (
        <Section title="Investment Implications" color={T_.amber}>
          <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{article.investment_implications}</div>
        </Section>
      )}

      {/* Open Questions */}
      {questions.length > 0 && (
        <Section title="Open Questions" color={T_.red}>
          {questions.map((q, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ color: T_.red, fontSize: 13, flexShrink: 0 }}>?</span>
              <span style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{q}</span>
            </div>
          ))}
        </Section>
      )}

      {/* Full Content (collapsible) */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showFullContent ? 16 : 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Article Content</div>
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
          <div style={{ fontSize: 13, color: T_.amber, marginBottom: 4 }}>This article hasn't been analyzed yet.</div>
          <div style={{ fontSize: 12, color: T_.textDim }}>Run "compile my wiki" in Claude Code to generate key takeaways, metrics, and investment implications.</div>
        </div>
      )}
    </div>
  );
}

// ─── Add Article Modal ───────────────────────────────
function AddArticleModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [category, setCategory] = useState("articles");

  const handleSave = () => {
    if (!title.trim()) return;
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    onSave({
      id, title: title.trim(), content: content.trim(),
      summary: content.trim().slice(0, 300), source_url: sourceUrl.trim(),
      category, source_type: "manual", tags: [], themes: [],
      key_takeaways: [], key_metrics: [], questions: [],
      date: new Date().toISOString().slice(0, 10),
    });
    onClose();
  };

  const inputStyle = {
    width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`,
    borderRadius: 8, color: T_.text, fontSize: 14, padding: "10px 14px",
    fontFamily: FONT, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`,
        padding: 28, width: 520, maxHeight: "80vh", overflow: "auto",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T_.accent, marginBottom: 20 }}>Add Article</div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Title</div>
          <input style={inputStyle} placeholder="Article title" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Source URL</div>
          <input style={inputStyle} placeholder="https://..." value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Category</div>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={category} onChange={e => setCategory(e.target.value)}>
            <option value="articles">Article</option>
            <option value="notes">Note</option>
            <option value="threads">Thread</option>
            <option value="papers">Paper</option>
          </select>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Content</div>
          <textarea style={{ ...inputStyle, minHeight: 150, resize: "vertical", lineHeight: 1.7 }}
            placeholder="Paste article content or notes..." value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            background: "none", border: `1px solid ${T_.border}`, color: T_.textMid,
            padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: FONT,
          }}>Cancel</button>
          <button onClick={handleSave} style={{
            background: T_.accent, border: "none", color: T_.bg,
            padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT,
          }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────
export default function KnowledgeBase() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await loadArticles();
      setArticles(data);
    } catch (err) {
      setLoadError(err.message || "Failed to load articles");
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

  const handleAdd = async (article) => {
    await upsertArticle(article);
    setArticles(prev => [article, ...prev]);
  };

  const filtered = articles.filter(a => {
    if (filter !== "all" && a.category !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (a.title || "").toLowerCase().includes(q) ||
             (a.summary || "").toLowerCase().includes(q) ||
             (a.themes || []).some(t => t.toLowerCase().includes(q));
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
          Research Wiki
        </div>
        <LastUpdated rows={articles} />
      </div>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 24, lineHeight: 1.6 }}>
        Articles, notes, and research pulled from Gmail. Email links to <span style={{ color: T_.accent }}>ylresearchwiki@gmail.com</span>, run ingest, then compile.
      </p>

      <ErrorBanner message={loadError} onRetry={load} />

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input
          style={{
            flex: 1, minWidth: 200, background: T_.bgInput, border: `1px solid ${T_.border}`,
            borderRadius: 8, color: T_.text, fontSize: 13, padding: "9px 14px", fontFamily: FONT, outline: "none",
          }}
          placeholder="Search articles, themes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={() => setShowAdd(true)} style={{
          background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px",
          borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT,
        }}>
          + Add
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setFilter(c.key)} style={{
            background: filter === c.key ? `${T_.accent}20` : "transparent",
            border: `1px solid ${filter === c.key ? T_.accent : T_.border}`,
            color: filter === c.key ? T_.accent : T_.textDim,
            padding: "6px 14px", borderRadius: 6, cursor: "pointer",
            fontSize: 12, fontFamily: FONT, fontWeight: filter === c.key ? 600 : 400,
          }}>
            {c.label}
            {c.key !== "all" && <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>{articles.filter(a => a.category === c.key).length}</span>}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: T_.textGhost }}>
          <span style={{ color: T_.text, fontWeight: 600 }}>{articles.length}</span> articles
        </div>
        <div style={{ fontSize: 12, color: T_.textGhost }}>
          <span style={{ color: T_.green, fontWeight: 600 }}>{analyzed}</span> analyzed
        </div>
        <div style={{ fontSize: 12, color: T_.textGhost }}>
          <span style={{ color: T_.text, fontWeight: 600 }}>{filtered.length}</span> showing
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center", lineHeight: 1.7 }}>
          {articles.length === 0
            ? "No articles yet. Email links to ylresearchwiki@gmail.com, run the ingest script, then compile."
            : "No articles match your search."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(a => (
            <ArticleCard key={a.id} article={a} onClick={() => setSelected(a)} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showAdd && <AddArticleModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
    </div>
  );
}
