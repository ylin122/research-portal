import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";

const T_ = {
  bg: "#0a0e17", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347", borderLight: "#222d40",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", blue: "#70b0fa", red: "#f87171",
};
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

async function loadPrinciples() {
  const { data, error } = await supabase.from("principles").select("*").order("sort_order", { ascending: true });
  if (error) { console.error("loadPrinciples:", error); return []; }
  return data || [];
}

async function upsertPrinciple(p) {
  const { error } = await supabase.from("principles").upsert(p, { onConflict: "id" });
  if (error) console.error("upsertPrinciple:", error);
}

async function deletePrinciple(id) {
  const { error } = await supabase.from("principles").delete().eq("id", id);
  if (error) console.error("deletePrinciple:", error);
}

export default function Principles() {
  const [principles, setPrinciples] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [editing, setEditing] = useState(null);
  const saveTimers = useRef({});

  useEffect(() => { loadPrinciples().then(setPrinciples); }, []);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    const record = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      title: newTitle.trim(),
      description: newText.trim(),
      sort_order: principles.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await upsertPrinciple(record);
    setPrinciples(await loadPrinciples());
    setNewTitle("");
    setNewText("");
    setAdding(false);
  };

  const handleUpdate = (id, field, value) => {
    const idx = principles.findIndex(p => p.id === id);
    if (idx < 0) return;
    const updated = { ...principles[idx], [field]: value, updated_at: new Date().toISOString() };
    const next = [...principles];
    next[idx] = updated;
    setPrinciples(next);
    clearTimeout(saveTimers.current[id + field]);
    saveTimers.current[id + field] = setTimeout(() => upsertPrinciple(updated), 1000);
  };

  const handleDelete = async (id) => {
    await deletePrinciple(id);
    setPrinciples(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: T_.text, letterSpacing: "-0.5px" }}>Principles & Epiphanies</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginTop: 4 }}>Fundamental beliefs that guide decisions. Review before acting.</div>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          style={{
            background: adding ? T_.red : T_.accent, color: "#000", border: "none", borderRadius: 6,
            padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
          }}
        >
          {adding ? "Cancel" : "+ Add"}
        </button>
      </div>

      {/* Add new */}
      {adding && (
        <div style={{ background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Principle title (bold heading)"
            style={{
              width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 6,
              padding: "10px 14px", color: T_.text, fontSize: 14, fontFamily: FONT, marginBottom: 10,
              outline: "none", boxSizing: "border-box",
            }}
          />
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Description / explanation (optional)"
            rows={3}
            style={{
              width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 6,
              padding: "10px 14px", color: T_.text, fontSize: 13, fontFamily: FONT, resize: "vertical",
              outline: "none", boxSizing: "border-box",
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              marginTop: 10, background: T_.accent, color: "#000", border: "none", borderRadius: 6,
              padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
            }}
          >
            Save
          </button>
        </div>
      )}

      {/* Principles list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {principles.map((p, i) => (
          <div
            key={p.id}
            style={{
              padding: "20px 0",
              borderBottom: i < principles.length - 1 ? `1px solid ${T_.borderLight}` : "none",
            }}
          >
            {editing === p.id ? (
              /* Edit mode */
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: T_.accent, minWidth: 28 }}>{i + 1}.</span>
                  <input
                    value={p.title}
                    onChange={e => handleUpdate(p.id, "title", e.target.value)}
                    style={{
                      flex: 1, background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 6,
                      padding: "8px 12px", color: T_.text, fontSize: 15, fontWeight: 600, fontFamily: FONT, outline: "none",
                    }}
                  />
                </div>
                <div style={{ paddingLeft: 38 }}>
                  <textarea
                    value={p.description || ""}
                    onChange={e => handleUpdate(p.id, "description", e.target.value)}
                    placeholder="Description..."
                    rows={3}
                    style={{
                      width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 6,
                      padding: "8px 12px", color: T_.textMid, fontSize: 13, fontFamily: FONT, resize: "vertical",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button onClick={() => setEditing(null)} style={{ background: T_.accent, color: "#000", border: "none", borderRadius: 5, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Done</button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: "transparent", color: T_.red, border: `1px solid ${T_.red}`, borderRadius: 5, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Delete</button>
                  </div>
                </div>
              </div>
            ) : (
              /* Read mode */
              <div
                onClick={() => setEditing(p.id)}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: T_.accent, minWidth: 28, lineHeight: "1.4" }}>{i + 1}.</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: T_.text, lineHeight: "1.4" }}>{p.title}</div>
                    {p.description && (
                      <div style={{ fontSize: 13, color: T_.textDim, marginTop: 4, lineHeight: "1.6" }}>{p.description}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {principles.length === 0 && !adding && (
        <div style={{ textAlign: "center", color: T_.textGhost, padding: "60px 0", fontSize: 14 }}>
          No principles yet. Click "+ Add" to start.
        </div>
      )}
    </div>
  );
}
