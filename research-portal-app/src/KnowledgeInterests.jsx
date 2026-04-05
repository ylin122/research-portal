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
  { key: "deepDives", label: "Deep Dives" },
  { key: "bookmarks", label: "Bookmarks" },
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

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

// ═══════════════════════════════════════════════════════
// CONCEPTS TAB
// ═══════════════════════════════════════════════════════

function ConceptRow({ concept, expanded, onToggle, onDelete }) {
  const topic = TOPIC_FILTERS.find(t => t.key === concept.topic);
  return (
    <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, marginBottom: 10, overflow: "hidden" }}>
      <div onClick={onToggle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: T_.accent, fontSize: 12, transition: "transform 0.15s", transform: expanded ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: T_.text }}>{concept.title}</span>
          {topic && topic.key !== "all" && (
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: T_.blue, background: `${T_.blue}15`, padding: "2px 8px", borderRadius: 4 }}>{topic.label}</span>
          )}
        </div>
        {concept.one_liner && !expanded && (
          <span style={{ fontSize: 12, color: T_.textDim, maxWidth: "50%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>{concept.one_liner}</span>
        )}
      </div>
      {expanded && (
        <div style={{ padding: "0 20px 20px 44px", borderTop: `1px solid ${T_.border}` }}>
          {concept.one_liner && <p style={{ fontSize: 14, color: T_.accent, marginTop: 16, marginBottom: 16, lineHeight: 1.5, fontStyle: "italic" }}>{concept.one_liner}</p>}
          {concept.explanation && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T_.green, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>What It Is</div>
              <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.explanation}</div>
            </div>
          )}
          {concept.example && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T_.blue, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Example</div>
              <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.example}</div>
            </div>
          )}
          {concept.analogy && (
            <div style={{ marginBottom: 16, background: `${T_.accent}08`, borderRadius: 8, border: `1px solid ${T_.accent}25`, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Think Of It Like...</div>
              <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.analogy}</div>
            </div>
          )}
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
          {concept.why_it_matters && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T_.red, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Why It Matters</div>
              <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{concept.why_it_matters}</div>
            </div>
          )}
          {concept.related?.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: T_.textGhost, alignSelf: "center", marginRight: 4 }}>Related:</span>
              {concept.related.map((r, i) => (
                <span key={i} style={{ fontSize: 11, color: T_.textDim, background: T_.bgInput, padding: "3px 10px", borderRadius: 6, border: `1px solid ${T_.border}` }}>{r}</span>
              ))}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={e => { e.stopPropagation(); onDelete(concept.id); }} style={{ background: "none", border: `1px solid ${T_.border}`, color: T_.textGhost, padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: FONT }}
              onMouseEnter={e => e.target.style.color = T_.red} onMouseLeave={e => e.target.style.color = T_.textGhost}>Remove</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConceptsTab() {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addTopic, setAddTopic] = useState("ai");

  useEffect(() => {
    supabase.from("concepts").select("*").order("title", { ascending: true }).then(({ data }) => { setConcepts(data || []); setLoading(false); });
  }, []);

  const handleAdd = async () => {
    if (!addTitle.trim()) return;
    const c = { id: uid(), title: addTitle.trim(), topic: addTopic, one_liner: "", explanation: "", example: "", analogy: "", key_points: [], why_it_matters: "", related: [], difficulty: "beginner" };
    await supabase.from("concepts").upsert(c);
    setConcepts(prev => [...prev, c].sort((a, b) => a.title.localeCompare(b.title)));
    setAddTitle(""); setShowAdd(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("concepts").delete().eq("id", id);
    setConcepts(prev => prev.filter(c => c.id !== id));
  };

  const filtered = concepts.filter(c => {
    if (filter !== "all" && c.topic !== filter) return false;
    if (search) { const q = search.toLowerCase(); return (c.title || "").toLowerCase().includes(q) || (c.one_liner || "").toLowerCase().includes(q); }
    return true;
  });

  const inputStyle = { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, color: T_.text, fontSize: 14, padding: "10px 14px", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input style={{ flex: 1, minWidth: 200, ...inputStyle, fontSize: 13, padding: "9px 14px" }} placeholder="Search concepts..." value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={() => setShowAdd(true)} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>+ Add</button>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {TOPIC_FILTERS.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)} style={{
            background: filter === t.key ? `${T_.accent}20` : "transparent", border: `1px solid ${filter === t.key ? T_.accent : T_.border}`,
            color: filter === t.key ? T_.accent : T_.textDim, padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: FONT, fontWeight: filter === t.key ? 600 : 400,
          }}>{t.label}{t.key !== "all" && <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>{concepts.filter(c => c.topic === t.key).length}</span>}</button>
        ))}
      </div>
      <div style={{ fontSize: 12, color: T_.textGhost, marginBottom: 16 }}><span style={{ color: T_.text, fontWeight: 600 }}>{filtered.length}</span> concepts — A-Z. Click to expand.</div>
      {loading ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
        : filtered.length === 0 ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>{concepts.length === 0 ? "No concepts yet." : "No match."}</div>
        : filtered.map(c => <ConceptRow key={c.id} concept={c} expanded={expanded === c.id} onToggle={() => setExpanded(expanded === c.id ? null : c.id)} onDelete={handleDelete} />)}
      {showAdd && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, padding: 28, width: 440 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 600, color: T_.accent, marginBottom: 20 }}>Add Concept</div>
            <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Term</div>
              <input style={inputStyle} placeholder="e.g. FLOPs, EBITDA, RAG..." value={addTitle} onChange={e => setAddTitle(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleAdd(); }} /></div>
            <div style={{ marginBottom: 20 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Topic</div>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={addTopic} onChange={e => setAddTopic(e.target.value)}>{TOPIC_FILTERS.filter(t => t.key !== "all").map(t => <option key={t.key} value={t.key}>{t.label}</option>)}</select></div>
            <p style={{ fontSize: 12, color: T_.textDim, marginBottom: 20 }}>Add the term, then run <span style={{ color: T_.accent }}>"compile my wiki"</span> to generate the explanation.</p>
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

// ═══════════════════════════════════════════════════════
// DEEP DIVES TAB
// ═══════════════════════════════════════════════════════

function DeepDiveDetail({ dive, onBack, onDelete }) {
  const sections = dive.sections || [];
  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: `1px solid ${T_.border}`, color: T_.textMid, cursor: "pointer", fontSize: 12, padding: "6px 14px", borderRadius: 6, marginBottom: 20, fontFamily: FONT }}>← Back</button>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: T_.blue, background: `${T_.blue}15`, padding: "3px 8px", borderRadius: 4 }}>{(TOPIC_FILTERS.find(t => t.key === dive.topic) || {}).label || dive.topic}</span>
        <span style={{ fontSize: 10, color: T_.textGhost }}>{sections.length} sections</span>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: T_.text, marginBottom: 8, lineHeight: 1.3 }}>{dive.title}</h1>
      {dive.summary && <p style={{ fontSize: 14, color: T_.textDim, marginBottom: 28, lineHeight: 1.6 }}>{dive.summary}</p>}

      {/* Table of Contents */}
      {sections.length > 1 && (
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Contents</div>
          {sections.map((sec, i) => (
            <div key={i} style={{ fontSize: 13, color: T_.blue, marginBottom: 6, cursor: "pointer" }} onClick={() => { document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: "smooth" }); }}>
              {i + 1}. {sec.title}
            </div>
          ))}
        </div>
      )}

      {/* Sections */}
      {sections.map((sec, i) => (
        <div key={i} id={`section-${i}`} style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: T_.accent, opacity: 0.4 }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{ fontSize: 17, fontWeight: 600, color: T_.text }}>{sec.title}</span>
          </div>
          {sec.content && <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap", marginBottom: sec.key_numbers?.length ? 16 : 0 }}>{sec.content}</div>}
          {sec.key_numbers?.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, marginTop: 12 }}>
              {sec.key_numbers.map((kn, j) => (
                <div key={j} style={{ background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}`, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>{kn.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: T_.blue }}>{kn.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <button onClick={() => onDelete(dive.id)} style={{ background: "none", border: `1px solid ${T_.border}`, color: T_.textGhost, padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: FONT }}
          onMouseEnter={e => e.target.style.color = T_.red} onMouseLeave={e => e.target.style.color = T_.textGhost}>Remove</button>
      </div>
    </div>
  );
}

function DeepDivesTab() {
  const [dives, setDives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addTopic, setAddTopic] = useState("ai");

  useEffect(() => {
    supabase.from("deep_dives").select("*").order("title", { ascending: true }).then(({ data }) => { setDives(data || []); setLoading(false); });
  }, []);

  const handleAdd = async () => {
    if (!addTitle.trim()) return;
    const d = { id: uid(), title: addTitle.trim(), topic: addTopic, summary: "", sections: [] };
    await supabase.from("deep_dives").upsert(d);
    setDives(prev => [...prev, d].sort((a, b) => a.title.localeCompare(b.title)));
    setAddTitle(""); setShowAdd(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("deep_dives").delete().eq("id", id);
    setDives(prev => prev.filter(d => d.id !== id));
    setSelected(null);
  };

  const inputStyle = { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, color: T_.text, fontSize: 14, padding: "10px 14px", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

  if (selected) return <DeepDiveDetail dive={selected} onBack={() => setSelected(null)} onDelete={handleDelete} />;

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={() => setShowAdd(true)} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>+ Request Deep Dive</button>
      </div>
      <p style={{ fontSize: 12, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
        Multi-section breakdowns of big topics. Add a topic, then run <span style={{ color: T_.accent }}>"compile my wiki"</span> to generate the full deep dive.
      </p>

      {loading ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
        : dives.length === 0 ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>No deep dives yet. Click "+ Request Deep Dive" to start.</div>
        : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {dives.map(d => (
            <div key={d.id} onClick={() => setSelected(d)} style={{
              display: "flex", alignItems: "center", gap: 16, background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 20px", cursor: "pointer", transition: "border-color 0.2s",
            }} onMouseEnter={e => e.currentTarget.style.borderColor = T_.accent} onMouseLeave={e => e.currentTarget.style.borderColor = T_.border}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: T_.text }}>{d.title}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: T_.blue, background: `${T_.blue}15`, padding: "2px 8px", borderRadius: 4 }}>{(TOPIC_FILTERS.find(t => t.key === d.topic) || {}).label || d.topic}</span>
                  <span style={{ fontSize: 10, color: T_.textGhost }}>{(d.sections || []).length} sections</span>
                </div>
                {d.summary && <div style={{ fontSize: 13, color: T_.textDim, lineHeight: 1.5 }}>{d.summary}</div>}
                {!d.summary && (d.sections || []).length === 0 && <div style={{ fontSize: 12, color: T_.amber, fontStyle: "italic" }}>Pending — run "compile my wiki" to generate</div>}
              </div>
              <span style={{ color: T_.textGhost, fontSize: 14, flexShrink: 0 }}>→</span>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, padding: 28, width: 440 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 600, color: T_.accent, marginBottom: 20 }}>Request Deep Dive</div>
            <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Topic</div>
              <input style={inputStyle} placeholder='e.g. "How LLM Training Works", "Data Center Economics"...' value={addTitle} onChange={e => setAddTitle(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleAdd(); }} /></div>
            <div style={{ marginBottom: 20 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Category</div>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={addTopic} onChange={e => setAddTopic(e.target.value)}>{TOPIC_FILTERS.filter(t => t.key !== "all").map(t => <option key={t.key} value={t.key}>{t.label}</option>)}</select></div>
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

// ═══════════════════════════════════════════════════════
// BOOKMARKS TAB
// ═══════════════════════════════════════════════════════

function BookmarksTab() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", content: "", source: "", source_url: "", topic: "other", tags: [] });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    supabase.from("bookmarks").select("*").order("created_at", { ascending: false }).then(({ data }) => { setBookmarks(data || []); setLoading(false); });
  }, []);

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    const b = { id: uid(), ...form, title: form.title.trim(), content: form.content.trim() };
    await supabase.from("bookmarks").upsert(b);
    setBookmarks(prev => [b, ...prev]);
    setForm({ title: "", content: "", source: "", source_url: "", topic: "other", tags: [] });
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const filtered = bookmarks.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (b.title || "").toLowerCase().includes(q) || (b.content || "").toLowerCase().includes(q) || (b.tags || []).some(t => t.toLowerCase().includes(q));
  });

  const inputStyle = { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, color: T_.text, fontSize: 14, padding: "10px 14px", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input style={{ flex: 1, minWidth: 200, ...inputStyle, fontSize: 13, padding: "9px 14px" }} placeholder="Search bookmarks..." value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={() => setShowAdd(true)} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>+ Save</button>
      </div>

      {loading ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
        : filtered.length === 0 ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>{bookmarks.length === 0 ? "No bookmarks yet. Save quotes, stats, insights, or anything interesting." : "No match."}</div>
        : filtered.map(b => (
        <div key={b.id} style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: T_.text }}>{b.title}</span>
            <button onClick={() => handleDelete(b.id)} style={{ background: "none", border: "none", color: T_.textGhost, cursor: "pointer", fontSize: 11, padding: "2px 6px" }}
              onMouseEnter={e => e.target.style.color = T_.red} onMouseLeave={e => e.target.style.color = T_.textGhost}>Remove</button>
          </div>
          {b.content && <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 10 }}>{b.content}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(b.tags || []).map((tag, i) => (
                <span key={i} style={{ fontSize: 10, color: T_.accent, background: `${T_.accent}12`, padding: "2px 8px", borderRadius: 4, border: `1px solid ${T_.accent}30` }}>{tag}</span>
              ))}
            </div>
            {b.source_url ? <a href={b.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: T_.blue, textDecoration: "none" }}>{b.source || "Source"} ↗</a>
              : b.source ? <span style={{ fontSize: 11, color: T_.textGhost }}>{b.source}</span> : null}
          </div>
        </div>
      ))}

      {showAdd && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, padding: 28, width: 500, maxHeight: "80vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 600, color: T_.accent, marginBottom: 20 }}>Save Bookmark</div>
            <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Title</div>
              <input style={inputStyle} placeholder="What is this about?" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Content / Note</div>
              <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical", lineHeight: 1.7 }} placeholder="Paste a quote, stat, insight, or your own note..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Source</div>
                <input style={inputStyle} placeholder="e.g. SemiAnalysis" value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} /></div>
              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>URL</div>
                <input style={inputStyle} placeholder="https://..." value={form.source_url} onChange={e => setForm(p => ({ ...p, source_url: e.target.value }))} /></div>
            </div>
            <div style={{ marginBottom: 20 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Tags</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                {form.tags.map((t, i) => (
                  <span key={i} onClick={() => setForm(p => ({ ...p, tags: p.tags.filter((_, j) => j !== i) }))} style={{ fontSize: 11, color: T_.accent, background: `${T_.accent}15`, padding: "3px 10px", borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.accent}30` }}>{t} ×</span>
                ))}
              </div>
              <input style={inputStyle} placeholder="Type a tag and press Enter..." value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && tagInput.trim()) { setForm(p => ({ ...p, tags: [...p.tags, tagInput.trim()] })); setTagInput(""); } }} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: `1px solid ${T_.border}`, color: T_.textMid, padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: FONT }}>Cancel</button>
              <button onClick={handleAdd} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════

export default function KnowledgeInterests() {
  const [activeTab, setActiveTab] = useState("concepts");

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T_.text, marginBottom: 4, fontFamily: FONT }}>Knowledge / Interests</h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
        Learn, explore, and save interesting things.
      </p>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${T_.border}`, paddingBottom: 1 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            background: "none", border: "none", borderBottom: activeTab === t.key ? `2px solid ${T_.accent}` : "2px solid transparent",
            color: activeTab === t.key ? T_.accent : T_.textDim, padding: "8px 20px", cursor: "pointer", fontSize: 13,
            fontWeight: activeTab === t.key ? 600 : 400, fontFamily: FONT, marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>
      {activeTab === "concepts" && <ConceptsTab />}
      {activeTab === "deepDives" && <DeepDivesTab />}
      {activeTab === "bookmarks" && <BookmarksTab />}
    </div>
  );
}
