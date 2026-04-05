import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const T_ = {
  bg: "#0a0e17", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", blue: "#70b0fa", red: "#f87171",
};
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "news", label: "News & Data" },
  { key: "research", label: "Research" },
  { key: "filings", label: "Filings & Regulatory" },
  { key: "sellside", label: "Sell-Side" },
  { key: "newsletter", label: "Newsletters" },
  { key: "other", label: "Other" },
];

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

export default function Sources() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", category: "other", description: "" });

  useEffect(() => {
    supabase.from("sources").select("*").order("name", { ascending: true }).then(({ data }) => {
      setSources(data || []);
      setLoading(false);
    });
  }, []);

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    const src = { id: uid(), name: form.name.trim(), url: form.url.trim(), category: form.category, description: form.description.trim() };
    await supabase.from("sources").upsert(src);
    setSources(prev => [...prev, src].sort((a, b) => a.name.localeCompare(b.name)));
    setForm({ name: "", url: "", category: "other", description: "" });
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("sources").delete().eq("id", id);
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const filtered = filter === "all" ? sources : sources.filter(s => s.category === filter);

  const catColor = (key) => {
    const colors = { news: T_.blue, research: T_.green, filings: T_.accent, sellside: "#A78BFA", newsletter: "#FB923C", other: T_.textDim };
    return colors[key] || T_.textDim;
  };

  const inputStyle = { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, color: T_.text, fontSize: 14, padding: "10px 14px", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ padding: "36px 44px", maxWidth: 900, fontFamily: FONT }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T_.text, marginBottom: 4 }}>Sources</h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 24, lineHeight: 1.6 }}>
        Trusted sources used across the portal for research, data, and analysis.
      </p>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button onClick={() => setShowAdd(true)} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>+ Add Source</button>
      </div>

      {/* Category filters */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setFilter(c.key)} style={{
            background: filter === c.key ? `${T_.accent}20` : "transparent",
            border: `1px solid ${filter === c.key ? T_.accent : T_.border}`,
            color: filter === c.key ? T_.accent : T_.textDim,
            padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: FONT, fontWeight: filter === c.key ? 600 : 400,
          }}>
            {c.label}
            {c.key !== "all" && <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>{sources.filter(s => s.category === c.key).length}</span>}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: T_.textGhost, marginBottom: 16 }}>
        <span style={{ color: T_.text, fontWeight: 600 }}>{filtered.length}</span> sources
      </div>

      {/* Source list */}
      {loading ? (
        <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>No sources yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map(src => (
            <div key={src.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
              background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.border}`,
            }}>
              <span style={{
                fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
                color: catColor(src.category), background: `${catColor(src.category)}15`,
                padding: "3px 8px", borderRadius: 4, flexShrink: 0,
              }}>
                {(CATEGORIES.find(c => c.key === src.category) || {}).label || src.category}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: T_.text, minWidth: 160 }}>{src.name}</span>
              {src.description && <span style={{ fontSize: 12, color: T_.textDim, flex: 1 }}>{src.description}</span>}
              {!src.description && <span style={{ flex: 1 }} />}
              {src.url && (
                <a href={src.url.startsWith("http") ? src.url : `https://${src.url}`} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, color: T_.blue, textDecoration: "none", flexShrink: 0 }}>
                  {src.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]} ↗
                </a>
              )}
              <button onClick={() => handleDelete(src.id)} style={{
                background: "none", border: "none", color: T_.textGhost, cursor: "pointer", fontSize: 11, padding: "2px 6px", flexShrink: 0,
              }} onMouseEnter={e => e.target.style.color = T_.red} onMouseLeave={e => e.target.style.color = T_.textGhost}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, padding: 28, width: 440 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 600, color: T_.accent, marginBottom: 20 }}>Add Source</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Name</div>
              <input style={inputStyle} placeholder="e.g. Bloomberg, SemiAnalysis..." value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} onKeyDown={e => { if (e.key === "Enter") handleAdd(); }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Website URL</div>
              <input style={inputStyle} placeholder="https://..." value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Category</div>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.filter(c => c.key !== "all").map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Description (optional)</div>
              <input style={inputStyle} placeholder="Brief note about this source..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: `1px solid ${T_.border}`, color: T_.textMid, padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: FONT }}>Cancel</button>
              <button onClick={handleAdd} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
