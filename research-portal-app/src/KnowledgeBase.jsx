import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";

const T_ = {
  bg: "#0a0e17", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347", borderLight: "#222d40",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", blue: "#70b0fa", red: "#f87171", amber: "#f5a623",
};
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

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
  if (error) { console.error("loadArticles:", error); return []; }
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

// ─── Components ──────────────────────────────────────

function ArticleCard({ article, onClick, onDelete }) {
  const categoryColors = {
    articles: T_.blue,
    notes: T_.green,
    threads: T_.amber,
    papers: T_.accent,
  };

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
        <span style={{
          fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
          color: categoryColors[article.category] || T_.textDim,
          background: `${categoryColors[article.category] || T_.textDim}15`,
          padding: "3px 8px", borderRadius: 4,
        }}>
          {article.category || "article"}
        </span>
        <span style={{ fontSize: 11, color: T_.textGhost }}>{article.date || ""}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: T_.text, marginBottom: 8, lineHeight: 1.4 }}>
        {article.title || "Untitled"}
      </div>
      {article.summary && (
        <div style={{ fontSize: 13, color: T_.textDim, lineHeight: 1.6, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {article.summary}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {article.source_url ? (
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ fontSize: 11, color: T_.blue, textDecoration: "none" }}
          >
            View source ↗
          </a>
        ) : <span />}
        <button
          onClick={e => { e.stopPropagation(); onDelete(article.id); }}
          style={{
            background: "none", border: "none", color: T_.textGhost, cursor: "pointer",
            fontSize: 11, padding: "2px 6px", borderRadius: 4,
          }}
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
  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: "none", border: `1px solid ${T_.border}`, color: T_.textMid,
          cursor: "pointer", fontSize: 12, padding: "6px 14px", borderRadius: 6, marginBottom: 20,
          fontFamily: FONT,
        }}
      >
        ← Back to articles
      </button>
      <div style={{ marginBottom: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
          color: T_.blue, background: `${T_.blue}15`, padding: "3px 8px", borderRadius: 4,
        }}>
          {article.category || "article"}
        </span>
        <span style={{ fontSize: 12, color: T_.textGhost, marginLeft: 12 }}>{article.date}</span>
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
      {article.summary && (
        <div style={{
          background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`,
          padding: 20, marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Summary</div>
          <div style={{ fontSize: 14, color: T_.textMid, lineHeight: 1.7 }}>{article.summary}</div>
        </div>
      )}
      <div style={{
        background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`,
        padding: 24,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 16 }}>Content</div>
        <div style={{ fontSize: 14, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
          {article.content || "No content available."}
        </div>
      </div>
      {article.tags && article.tags.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16 }}>
          {article.tags.map((tag, i) => (
            <span key={i} style={{
              fontSize: 11, color: T_.textDim, background: T_.bgInput,
              padding: "3px 10px", borderRadius: 12, border: `1px solid ${T_.border}`,
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function AddArticleModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [category, setCategory] = useState("articles");

  const handleSave = () => {
    if (!title.trim()) return;
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    onSave({
      id,
      title: title.trim(),
      content: content.trim(),
      summary: content.trim().slice(0, 300),
      source_url: sourceUrl.trim(),
      category,
      source_type: "manual",
      tags: [],
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
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadArticles();
    setArticles(data);
    setLoading(false);
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
             (a.content || "").toLowerCase().includes(q) ||
             (a.summary || "").toLowerCase().includes(q);
    }
    return true;
  });

  // ─── Detail View ───
  if (selected) {
    return (
      <div style={{ padding: 0 }}>
        <ArticleDetail article={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  // ─── List View ───
  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T_.text, marginBottom: 4, fontFamily: FONT }}>
        Knowledge Base
      </h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 24, lineHeight: 1.6 }}>
        Articles, notes, and research pulled from your Gmail inbox. Email links to <span style={{ color: T_.accent }}>ylresearchwiki@gmail.com</span> then sync.
      </p>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input
          style={{
            flex: 1, minWidth: 200, background: T_.bgInput, border: `1px solid ${T_.border}`,
            borderRadius: 8, color: T_.text, fontSize: 13, padding: "9px 14px",
            fontFamily: FONT, outline: "none",
          }}
          placeholder="Search articles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px",
            borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT,
          }}
        >
          + Add
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            style={{
              background: filter === c.key ? `${T_.accent}20` : "transparent",
              border: `1px solid ${filter === c.key ? T_.accent : T_.border}`,
              color: filter === c.key ? T_.accent : T_.textDim,
              padding: "6px 14px", borderRadius: 6, cursor: "pointer",
              fontSize: 12, fontFamily: FONT, fontWeight: filter === c.key ? 600 : 400,
            }}
          >
            {c.label}
            {c.key !== "all" && (
              <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>
                {articles.filter(a => a.category === c.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: T_.textGhost }}>
          <span style={{ color: T_.text, fontWeight: 600 }}>{articles.length}</span> articles
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
            ? "No articles yet. Email links to ylresearchwiki@gmail.com, run the ingest script, then sync here."
            : "No articles match your search."}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {filtered.map(a => (
            <ArticleCard key={a.id} article={a} onClick={() => setSelected(a)} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showAdd && <AddArticleModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
    </div>
  );
}
