import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";

const T_ = {
  bg: "#0a0e17", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347", borderLight: "#222d40",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", blue: "#70b0fa", red: "#f87171", amber: "#f5a623",
};
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const TOPICS = [
  { key: "all", label: "All" },
  { key: "ai", label: "AI / ML" },
  { key: "finance", label: "Finance" },
  { key: "infrastructure", label: "Infrastructure" },
  { key: "software", label: "Software" },
  { key: "business", label: "Business" },
  { key: "other", label: "Other" },
];

const DIFFICULTY = [
  { key: "beginner", label: "Beginner", color: T_.green },
  { key: "intermediate", label: "Intermediate", color: T_.amber },
  { key: "advanced", label: "Advanced", color: T_.red },
];

// ─── DB ──────────────────────────────────────────────
async function loadConcepts() {
  const { data, error } = await supabase
    .from("concepts")
    .select("*")
    .order("topic", { ascending: true });
  if (error) { console.error("loadConcepts:", error); return []; }
  return data || [];
}

async function upsertConcept(concept) {
  const { error } = await supabase.from("concepts").upsert(
    { ...concept, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );
  if (error) console.error("upsertConcept:", error);
}

async function deleteConcept(id) {
  const { error } = await supabase.from("concepts").delete().eq("id", id);
  if (error) console.error("deleteConcept:", error);
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

// ─── Concept Card ────────────────────────────────────
function ConceptCard({ concept, onClick }) {
  const diff = DIFFICULTY.find(d => d.key === concept.difficulty) || DIFFICULTY[0];
  const topic = TOPICS.find(t => t.key === concept.topic);

  return (
    <div
      onClick={onClick}
      style={{
        background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`,
        padding: 20, cursor: "pointer", transition: "border-color 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = T_.accent}
      onMouseLeave={e => e.currentTarget.style.borderColor = T_.border}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {topic && topic.key !== "all" && (
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: T_.blue, background: `${T_.blue}15`, padding: "3px 8px", borderRadius: 4 }}>
              {topic.label}
            </span>
          )}
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: diff.color, background: `${diff.color}15`, padding: "3px 8px", borderRadius: 4 }}>
            {diff.label}
          </span>
        </div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: T_.text, marginBottom: 6, lineHeight: 1.4 }}>
        {concept.title}
      </div>
      {concept.one_liner && (
        <div style={{ fontSize: 13, color: T_.textDim, lineHeight: 1.6 }}>
          {concept.one_liner}
        </div>
      )}
    </div>
  );
}

// ─── Concept Detail ──────────────────────────────────
function ConceptDetail({ concept, onBack, onDelete }) {
  const diff = DIFFICULTY.find(d => d.key === concept.difficulty) || DIFFICULTY[0];
  const topic = TOPICS.find(t => t.key === concept.topic);

  return (
    <div>
      <button onClick={onBack} style={{
        background: "none", border: `1px solid ${T_.border}`, color: T_.textMid,
        cursor: "pointer", fontSize: 12, padding: "6px 14px", borderRadius: 6, marginBottom: 20, fontFamily: FONT,
      }}>
        ← Back
      </button>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        {topic && topic.key !== "all" && (
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: T_.blue, background: `${T_.blue}15`, padding: "3px 8px", borderRadius: 4 }}>{topic.label}</span>
        )}
        <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: diff.color, background: `${diff.color}15`, padding: "3px 8px", borderRadius: 4 }}>{diff.label}</span>
      </div>

      <h1 style={{ fontSize: 24, fontWeight: 700, color: T_.text, marginBottom: 8, lineHeight: 1.3 }}>{concept.title}</h1>
      {concept.one_liner && (
        <p style={{ fontSize: 15, color: T_.accent, marginBottom: 24, lineHeight: 1.5, fontStyle: "italic" }}>{concept.one_liner}</p>
      )}

      {/* Simple Explanation */}
      {concept.explanation && (
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.green, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Explain It Simply</div>
          <div style={{ fontSize: 14, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.explanation}</div>
        </div>
      )}

      {/* Real World Example */}
      {concept.example && (
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.blue, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Real-World Example</div>
          <div style={{ fontSize: 14, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.example}</div>
        </div>
      )}

      {/* Analogy */}
      {concept.analogy && (
        <div style={{ background: `${T_.accent}08`, borderRadius: 10, border: `1px solid ${T_.accent}30`, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Think Of It Like...</div>
          <div style={{ fontSize: 14, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.analogy}</div>
        </div>
      )}

      {/* Key Points */}
      {concept.key_points?.length > 0 && (
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.amber, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Key Points</div>
          {concept.key_points.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <span style={{ color: T_.amber, fontSize: 14, flexShrink: 0, marginTop: 1 }}>→</span>
              <span style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{p}</span>
            </div>
          ))}
        </div>
      )}

      {/* Why It Matters */}
      {concept.why_it_matters && (
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.red, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Why It Matters</div>
          <div style={{ fontSize: 14, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.why_it_matters}</div>
        </div>
      )}

      {/* Related Concepts */}
      {concept.related?.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: T_.textGhost, marginRight: 4, alignSelf: "center" }}>Related:</span>
          {concept.related.map((r, i) => (
            <span key={i} style={{ fontSize: 11, color: T_.textDim, background: T_.bgInput, padding: "4px 10px", borderRadius: 6, border: `1px solid ${T_.border}` }}>{r}</span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <button onClick={() => onDelete(concept.id)} style={{
          background: "none", border: `1px solid ${T_.border}`, color: T_.red,
          padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: FONT,
        }}>Delete Concept</button>
      </div>
    </div>
  );
}

// ─── Add Concept Modal ───────────────────────────────
function AddConceptModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("ai");
  const [difficulty, setDifficulty] = useState("beginner");

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: uid(),
      title: title.trim(),
      topic,
      difficulty,
      one_liner: "",
      explanation: "",
      example: "",
      analogy: "",
      key_points: [],
      why_it_matters: "",
      related: [],
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
        padding: 28, width: 480,
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T_.accent, marginBottom: 20 }}>Add Concept</div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>What do you want to learn?</div>
          <input style={inputStyle} placeholder="e.g. Transformer Architecture, LBO, RAG..." value={title} onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSave(); }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Topic</div>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={topic} onChange={e => setTopic(e.target.value)}>
              {TOPICS.filter(t => t.key !== "all").map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Difficulty</div>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              {DIFFICULTY.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
          </div>
        </div>
        <p style={{ fontSize: 12, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
          Add the concept, then run <span style={{ color: T_.accent }}>"compile my wiki"</span> in Claude Code to generate the explanation, examples, and analogies.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            background: "none", border: `1px solid ${T_.border}`, color: T_.textMid,
            padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: FONT,
          }}>Cancel</button>
          <button onClick={handleSave} style={{
            background: T_.accent, border: "none", color: T_.bg,
            padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT,
          }}>Add</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────
export default function KnowledgeInterests() {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadConcepts();
    setConcepts(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (concept) => {
    await upsertConcept(concept);
    setConcepts(prev => [...prev, concept]);
  };

  const handleDelete = async (id) => {
    await deleteConcept(id);
    setConcepts(prev => prev.filter(c => c.id !== id));
    setSelected(null);
  };

  const filtered = concepts.filter(c => {
    if (filter !== "all" && c.topic !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (c.title || "").toLowerCase().includes(q) ||
             (c.one_liner || "").toLowerCase().includes(q) ||
             (c.related || []).some(r => r.toLowerCase().includes(q));
    }
    return true;
  });

  const filled = concepts.filter(c => c.explanation).length;

  if (selected) {
    return <div style={{ padding: 0 }}><ConceptDetail concept={selected} onBack={() => setSelected(null)} onDelete={handleDelete} /></div>;
  }

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T_.text, marginBottom: 4, fontFamily: FONT }}>
        Knowledge / Interests
      </h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 24, lineHeight: 1.6 }}>
        Concepts explained simply with real-world examples. Add a topic, then run <span style={{ color: T_.accent }}>"compile my wiki"</span> in Claude Code to fill in explanations.
      </p>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input
          style={{
            flex: 1, minWidth: 200, background: T_.bgInput, border: `1px solid ${T_.border}`,
            borderRadius: 8, color: T_.text, fontSize: 13, padding: "9px 14px", fontFamily: FONT, outline: "none",
          }}
          placeholder="Search concepts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={() => setShowAdd(true)} style={{
          background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px",
          borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT,
        }}>
          + Add Concept
        </button>
      </div>

      {/* Topic Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {TOPICS.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)} style={{
            background: filter === t.key ? `${T_.accent}20` : "transparent",
            border: `1px solid ${filter === t.key ? T_.accent : T_.border}`,
            color: filter === t.key ? T_.accent : T_.textDim,
            padding: "6px 14px", borderRadius: 6, cursor: "pointer",
            fontSize: 12, fontFamily: FONT, fontWeight: filter === t.key ? 600 : 400,
          }}>
            {t.label}
            {t.key !== "all" && <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>{concepts.filter(c => c.topic === t.key).length}</span>}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: T_.textGhost }}>
          <span style={{ color: T_.text, fontWeight: 600 }}>{concepts.length}</span> concepts
        </div>
        <div style={{ fontSize: 12, color: T_.textGhost }}>
          <span style={{ color: T_.green, fontWeight: 600 }}>{filled}</span> explained
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center", lineHeight: 1.7 }}>
          {concepts.length === 0
            ? "No concepts yet. Click \"+ Add Concept\" to start learning."
            : "No concepts match your search."}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map(c => (
            <ConceptCard key={c.id} concept={c} onClick={() => setSelected(c)} />
          ))}
        </div>
      )}

      {showAdd && <AddConceptModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
    </div>
  );
}
