import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";

const STATUSES = [
  { key: "seed", label: "Seed", color: T_.textDim, icon: "💡" },
  { key: "researching", label: "Researching", color: T_.blue, icon: "🔍" },
  { key: "thesis", label: "Thesis", color: T_.amber, icon: "📝" },
  { key: "validated", label: "Validated", color: T_.green, icon: "✓" },
  { key: "archived", label: "Archived", color: T_.textGhost, icon: "📦" },
];

const CONVICTIONS = [
  { key: "low", label: "Low", color: T_.textDim },
  { key: "medium", label: "Medium", color: T_.amber },
  { key: "high", label: "High", color: T_.green },
];

const CATEGORIES = [
  "Macro", "Tech", "AI", "Healthcare", "Fintech", "SaaS", "Infrastructure",
  "Consumer", "Energy", "Crypto", "Other",
];

// ─── DB Functions ────────────────────────────────────
async function loadIdeas() {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) { console.error("loadIdeas:", error); return []; }
  return data || [];
}

async function upsertIdea(idea) {
  const { error } = await supabase.from("ideas").upsert(
    { ...idea, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );
  if (error) console.error("upsertIdea:", error);
}

async function deleteIdea(id) {
  const { error } = await supabase.from("ideas").delete().eq("id", id);
  if (error) console.error("deleteIdea:", error);
}

// ─── Helpers ─────────────────────────────────────────
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""; }

// ─── Idea Card ───────────────────────────────────────
function IdeaCard({ idea, onClick }) {
  const status = STATUSES.find(s => s.key === idea.status) || STATUSES[0];
  const conviction = CONVICTIONS.find(c => c.key === idea.conviction);

  return (
    <div
      onClick={onClick}
      style={{
        background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.border}`,
        padding: 16, cursor: "pointer", transition: "border-color 0.2s",
        borderLeft: `3px solid ${status.color}`,
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = T_.accent}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T_.border; e.currentTarget.style.borderLeftColor = status.color; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: status.color }}>
          {status.icon} {status.label}
        </span>
        {conviction && (
          <span style={{ fontSize: 10, fontWeight: 600, color: conviction.color, background: `${conviction.color}15`, padding: "2px 8px", borderRadius: 4 }}>
            {conviction.label}
          </span>
        )}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: T_.text, marginBottom: 6, lineHeight: 1.4 }}>
        {idea.title}
      </div>
      {idea.summary && (
        <div style={{ fontSize: 12, color: T_.textDim, lineHeight: 1.5, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {idea.summary}
        </div>
      )}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {(idea.tags || []).map((tag, i) => (
          <span key={i} style={{ fontSize: 10, color: T_.textGhost, background: T_.bgInput, padding: "2px 7px", borderRadius: 4, border: `1px solid ${T_.border}` }}>
            {tag}
          </span>
        ))}
      </div>
      <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8 }}>
        {fmtDate(idea.updated_at)}
      </div>
    </div>
  );
}

// ─── Idea Detail / Edit Modal ────────────────────────
function IdeaModal({ idea, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({
    title: idea?.title || "",
    summary: idea?.summary || "",
    thesis: idea?.thesis || "",
    notes: idea?.notes || "",
    status: idea?.status || "seed",
    conviction: idea?.conviction || "low",
    tags: idea?.tags || [],
    source_urls: idea?.source_urls || [],
  });
  const [newTag, setNewTag] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave({
      id: idea?.id || uid(),
      ...form,
      created_at: idea?.created_at || new Date().toISOString(),
    });
    onClose();
  };

  const inputStyle = {
    width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`,
    borderRadius: 8, color: T_.text, fontSize: 13, padding: "10px 14px",
    fontFamily: FONT, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`,
        padding: 28, width: 600, maxHeight: "85vh", overflow: "auto",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: T_.accent }}>{idea ? "Edit Idea" : "New Idea"}</div>
          {idea && (
            <button onClick={() => { onDelete(idea.id); onClose(); }} style={{
              background: "none", border: `1px solid ${T_.border}`, color: T_.red,
              padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: FONT,
            }}>Delete</button>
          )}
        </div>

        {/* Title */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Title</div>
          <input style={inputStyle} placeholder="What's the idea?" value={form.title} onChange={e => set("title", e.target.value)} />
        </div>

        {/* Status + Conviction */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Status</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {STATUSES.map(s => (
                <button key={s.key} onClick={() => set("status", s.key)} style={{
                  background: form.status === s.key ? `${s.color}20` : "transparent",
                  border: `1px solid ${form.status === s.key ? s.color : T_.border}`,
                  color: form.status === s.key ? s.color : T_.textDim,
                  padding: "4px 10px", borderRadius: 5, cursor: "pointer", fontSize: 11, fontFamily: FONT,
                }}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Conviction</div>
            <div style={{ display: "flex", gap: 4 }}>
              {CONVICTIONS.map(c => (
                <button key={c.key} onClick={() => set("conviction", c.key)} style={{
                  background: form.conviction === c.key ? `${c.color}20` : "transparent",
                  border: `1px solid ${form.conviction === c.key ? c.color : T_.border}`,
                  color: form.conviction === c.key ? c.color : T_.textDim,
                  padding: "4px 14px", borderRadius: 5, cursor: "pointer", fontSize: 11, fontFamily: FONT,
                }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Summary</div>
          <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical", lineHeight: 1.6 }}
            placeholder="One-liner — what's the core insight?" value={form.summary} onChange={e => set("summary", e.target.value)} />
        </div>

        {/* Thesis */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Thesis</div>
          <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical", lineHeight: 1.6 }}
            placeholder="Develop your thesis here... Why does this matter? What's the opportunity? What needs to be true?" value={form.thesis} onChange={e => set("thesis", e.target.value)} />
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Notes</div>
          <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical", lineHeight: 1.6 }}
            placeholder="Running notes, observations, data points..." value={form.notes} onChange={e => set("notes", e.target.value)} />
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Tags</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => {
                set("tags", form.tags.includes(cat) ? form.tags.filter(t => t !== cat) : [...form.tags, cat]);
              }} style={{
                background: form.tags.includes(cat) ? `${T_.accent}20` : "transparent",
                border: `1px solid ${form.tags.includes(cat) ? T_.accent : T_.border}`,
                color: form.tags.includes(cat) ? T_.accent : T_.textDim,
                padding: "3px 10px", borderRadius: 5, cursor: "pointer", fontSize: 11, fontFamily: FONT,
              }}>
                {cat}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Custom tag..." value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && newTag.trim()) { set("tags", [...form.tags, newTag.trim()]); setNewTag(""); } }} />
          </div>
        </div>

        {/* Source URLs */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Source Links</div>
          {form.source_urls.map((url, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "center" }}>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: T_.blue, textDecoration: "none", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</a>
              <button onClick={() => set("source_urls", form.source_urls.filter((_, j) => j !== i))} style={{
                background: "none", border: "none", color: T_.textGhost, cursor: "pointer", fontSize: 14, padding: "0 4px",
              }}>×</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 6 }}>
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Add source URL..." value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && newUrl.trim()) { set("source_urls", [...form.source_urls, newUrl.trim()]); setNewUrl(""); } }} />
          </div>
        </div>

        {/* Actions */}
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
export default function IdeaTracker() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("pipeline"); // pipeline | list
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | idea object
  const [sortBy, setSortBy] = useState("updated"); // updated | conviction | created

  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadIdeas();
    setIdeas(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (idea) => {
    await upsertIdea(idea);
    setIdeas(prev => {
      const exists = prev.find(i => i.id === idea.id);
      if (exists) return prev.map(i => i.id === idea.id ? { ...idea, updated_at: new Date().toISOString() } : i);
      return [{ ...idea, updated_at: new Date().toISOString() }, ...prev];
    });
  };

  const handleDelete = async (id) => {
    await deleteIdea(id);
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  const filtered = ideas.filter(i => {
    if (filterStatus !== "all" && i.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (i.title || "").toLowerCase().includes(q) ||
             (i.summary || "").toLowerCase().includes(q) ||
             (i.thesis || "").toLowerCase().includes(q) ||
             (i.tags || []).some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "conviction") {
      const order = { high: 0, medium: 1, low: 2 };
      return (order[a.conviction] ?? 3) - (order[b.conviction] ?? 3);
    }
    return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
  });

  // ─── Pipeline View ───
  const renderPipeline = () => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${STATUSES.length}, 1fr)`, gap: 12, minHeight: 400 }}>
      {STATUSES.map(status => {
        const items = ideas.filter(i => i.status === status.key).filter(i => {
          if (!search) return true;
          const q = search.toLowerCase();
          return (i.title || "").toLowerCase().includes(q) || (i.summary || "").toLowerCase().includes(q);
        });
        return (
          <div key={status.key} style={{ background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}`, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 4px" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: status.color }}>
                {status.icon} {status.label}
              </span>
              <span style={{ fontSize: 11, color: T_.textGhost, background: T_.bgInput, padding: "2px 8px", borderRadius: 10 }}>
                {items.length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map(idea => (
                <IdeaCard key={idea.id} idea={idea} onClick={() => setEditing(idea)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ─── List View ───
  const renderList = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {sorted.length === 0 ? (
        <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>
          {ideas.length === 0 ? "No ideas yet. Add one or email to ylresearchwiki@gmail.com with [idea] in the subject." : "No ideas match your filters."}
        </div>
      ) : sorted.map(idea => (
        <IdeaCard key={idea.id} idea={idea} onClick={() => setEditing(idea)} />
      ))}
    </div>
  );

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T_.text, marginBottom: 4, fontFamily: FONT }}>
        Idea Tracker
      </h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 24, lineHeight: 1.6 }}>
        Capture, develop, and track investment ideas and theses. Email ideas to <span style={{ color: T_.accent }}>ylresearchwiki@gmail.com</span> with <span style={{ color: T_.accent }}>[idea]</span> in the subject.
      </p>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input
          style={{
            flex: 1, minWidth: 200, background: T_.bgInput, border: `1px solid ${T_.border}`,
            borderRadius: 8, color: T_.text, fontSize: 13, padding: "9px 14px",
            fontFamily: FONT, outline: "none",
          }}
          placeholder="Search ideas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          onClick={() => setEditing("new")}
          style={{
            background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px",
            borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT,
          }}
        >
          + New Idea
        </button>
      </div>

      {/* View Toggle + Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => setViewMode("pipeline")} style={{
            background: viewMode === "pipeline" ? `${T_.accent}20` : "transparent",
            border: `1px solid ${viewMode === "pipeline" ? T_.accent : T_.border}`,
            color: viewMode === "pipeline" ? T_.accent : T_.textDim,
            padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: FONT,
          }}>Pipeline</button>
          <button onClick={() => setViewMode("list")} style={{
            background: viewMode === "list" ? `${T_.accent}20` : "transparent",
            border: `1px solid ${viewMode === "list" ? T_.accent : T_.border}`,
            color: viewMode === "list" ? T_.accent : T_.textDim,
            padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: FONT,
          }}>List</button>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: T_.textGhost }}>
            <span style={{ color: T_.text, fontWeight: 600 }}>{ideas.length}</span> ideas
          </span>
          {viewMode === "list" && (
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 6,
                color: T_.text, fontSize: 12, padding: "5px 10px", fontFamily: FONT, outline: "none", cursor: "pointer",
              }}
            >
              <option value="all">All statuses</option>
              {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
      ) : viewMode === "pipeline" ? renderPipeline() : renderList()}

      {/* Modal */}
      {editing && (
        <IdeaModal
          idea={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
