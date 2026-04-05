import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";

const T_ = {
  bg: "#0a0e17", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347", borderLight: "#222d40",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", blue: "#70b0fa", red: "#f87171", amber: "#f5a623",
};
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const TABS = [
  { key: "concepts", label: "Concepts" },
  { key: "interests", label: "Interests" },
];

const TOPIC_FILTERS = [
  { key: "all", label: "All" },
  { key: "ai", label: "AI / ML" },
  { key: "finance", label: "Finance" },
  { key: "infrastructure", label: "Infrastructure" },
  { key: "software", label: "Software" },
  { key: "business", label: "Business" },
  { key: "other", label: "Other" },
];

// ─── DB ──────────────────────────────────────────────
async function loadConcepts() {
  const { data, error } = await supabase.from("concepts").select("*").order("title", { ascending: true });
  if (error) { console.error("loadConcepts:", error); return []; }
  return data || [];
}

async function upsertConcept(concept) {
  const { error } = await supabase.from("concepts").upsert({ ...concept, updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) console.error("upsertConcept:", error);
}

async function deleteConcept(id) {
  const { error } = await supabase.from("concepts").delete().eq("id", id);
  if (error) console.error("deleteConcept:", error);
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

// ─── Concept Row (expandable) ────────────────────────
function ConceptRow({ concept, expanded, onToggle, onDelete }) {
  const topic = TOPIC_FILTERS.find(t => t.key === concept.topic);

  return (
    <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, marginBottom: 10, overflow: "hidden" }}>
      {/* Header — always visible */}
      <div
        onClick={onToggle}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: T_.accent, fontSize: 12, transition: "transform 0.15s", transform: expanded ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: T_.text }}>{concept.title}</span>
          {topic && topic.key !== "all" && (
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: T_.blue, background: `${T_.blue}15`, padding: "2px 8px", borderRadius: 4 }}>{topic.label}</span>
          )}
        </div>
        {concept.one_liner && !expanded && (
          <span style={{ fontSize: 12, color: T_.textDim, maxWidth: "50%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>
            {concept.one_liner}
          </span>
        )}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: "0 20px 20px 44px", borderTop: `1px solid ${T_.border}` }}>
          {/* One-liner */}
          {concept.one_liner && (
            <p style={{ fontSize: 14, color: T_.accent, marginTop: 16, marginBottom: 16, lineHeight: 1.5, fontStyle: "italic" }}>{concept.one_liner}</p>
          )}

          {/* What it is */}
          {concept.explanation && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T_.green, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>What It Is</div>
              <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.explanation}</div>
            </div>
          )}

          {/* Example */}
          {concept.example && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T_.blue, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Example</div>
              <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.example}</div>
            </div>
          )}

          {/* Analogy */}
          {concept.analogy && (
            <div style={{ marginBottom: 16, background: `${T_.accent}08`, borderRadius: 8, border: `1px solid ${T_.accent}25`, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Think Of It Like...</div>
              <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.analogy}</div>
            </div>
          )}

          {/* Key Points */}
          {concept.key_points?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T_.amber, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Key Points</div>
              {concept.key_points.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                  <span style={{ color: T_.amber, fontSize: 13, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{p}</span>
                </div>
              ))}
            </div>
          )}

          {/* Why It Matters */}
          {concept.why_it_matters && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T_.red, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Why It Matters</div>
              <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.why_it_matters}</div>
            </div>
          )}

          {/* Related */}
          {concept.related?.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: T_.textGhost, alignSelf: "center", marginRight: 4 }}>Related:</span>
              {concept.related.map((r, i) => (
                <span key={i} style={{ fontSize: 11, color: T_.textDim, background: T_.bgInput, padding: "3px 10px", borderRadius: 6, border: `1px solid ${T_.border}` }}>{r}</span>
              ))}
            </div>
          )}

          {/* Delete */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={e => { e.stopPropagation(); onDelete(concept.id); }} style={{
              background: "none", border: `1px solid ${T_.border}`, color: T_.textGhost, padding: "4px 12px",
              borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: FONT,
            }}
              onMouseEnter={e => e.target.style.color = T_.red}
              onMouseLeave={e => e.target.style.color = T_.textGhost}
            >Remove</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Add Concept Modal ───────────────────────────────
function AddConceptModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("ai");

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ id: uid(), title: title.trim(), topic, difficulty: "beginner", one_liner: "", explanation: "", example: "", analogy: "", key_points: [], why_it_matters: "", related: [] });
    onClose();
  };

  const inputStyle = { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, color: T_.text, fontSize: 14, padding: "10px 14px", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, padding: 28, width: 440 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T_.accent, marginBottom: 20 }}>Add Concept</div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Term / Concept</div>
          <input style={inputStyle} placeholder="e.g. FLOPs, PUE, EBITDA, RAG..." value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSave(); }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Topic</div>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={topic} onChange={e => setTopic(e.target.value)}>
            {TOPIC_FILTERS.filter(t => t.key !== "all").map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </div>
        <p style={{ fontSize: 12, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
          Add the term, then run <span style={{ color: T_.accent }}>"compile my wiki"</span> to fill in the explanation.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: `1px solid ${T_.border}`, color: T_.textMid, padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: FONT }}>Cancel</button>
          <button onClick={handleSave} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>Add</button>
        </div>
      </div>
    </div>
  );
}

// ─── Concepts Tab ────────────────────────────────────
function ConceptsTab() {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setConcepts(await loadConcepts());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (concept) => {
    await upsertConcept(concept);
    setConcepts(prev => [...prev, concept].sort((a, b) => a.title.localeCompare(b.title)));
  };

  const handleDelete = async (id) => {
    await deleteConcept(id);
    setConcepts(prev => prev.filter(c => c.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const filtered = concepts.filter(c => {
    if (filter !== "all" && c.topic !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (c.title || "").toLowerCase().includes(q) || (c.one_liner || "").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input
          style={{ flex: 1, minWidth: 200, background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, color: T_.text, fontSize: 13, padding: "9px 14px", fontFamily: FONT, outline: "none" }}
          placeholder="Search concepts..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <button onClick={() => setShowAdd(true)} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>
          + Add
        </button>
      </div>

      {/* Topic filters */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {TOPIC_FILTERS.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)} style={{
            background: filter === t.key ? `${T_.accent}20` : "transparent",
            border: `1px solid ${filter === t.key ? T_.accent : T_.border}`,
            color: filter === t.key ? T_.accent : T_.textDim,
            padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: FONT, fontWeight: filter === t.key ? 600 : 400,
          }}>
            {t.label}
            {t.key !== "all" && <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>{concepts.filter(c => c.topic === t.key).length}</span>}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: T_.textGhost, marginBottom: 16 }}>
        <span style={{ color: T_.text, fontWeight: 600 }}>{filtered.length}</span> concepts — sorted A-Z. Click to expand.
      </div>

      {/* Concept list */}
      {loading ? (
        <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>
          {concepts.length === 0 ? 'No concepts yet. Click "+ Add" to start.' : "No concepts match your search."}
        </div>
      ) : (
        filtered.map(c => (
          <ConceptRow key={c.id} concept={c} expanded={expanded === c.id} onToggle={() => setExpanded(expanded === c.id ? null : c.id)} onDelete={handleDelete} />
        ))
      )}

      {showAdd && <AddConceptModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
    </div>
  );
}

// ─── Interests Tab (placeholder for now) ─────────────
function InterestsTab() {
  return (
    <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center", lineHeight: 1.7 }}>
      Coming soon — curate interesting topics and articles here.
    </div>
  );
}

// ─── Main ────────────────────────────────────────────
export default function KnowledgeInterests() {
  const [activeTab, setActiveTab] = useState("concepts");

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T_.text, marginBottom: 4, fontFamily: FONT }}>Knowledge / Interests</h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
        Learn concepts simply. Add a term, then run <span style={{ color: T_.accent }}>"compile my wiki"</span> in Claude Code to fill in explanations.
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${T_.border}`, paddingBottom: 1 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            background: "none", border: "none", borderBottom: activeTab === t.key ? `2px solid ${T_.accent}` : "2px solid transparent",
            color: activeTab === t.key ? T_.accent : T_.textDim,
            padding: "8px 20px", cursor: "pointer", fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400, fontFamily: FONT,
            marginBottom: -1,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "concepts" && <ConceptsTab />}
      {activeTab === "interests" && <InterestsTab />}
    </div>
  );
}
