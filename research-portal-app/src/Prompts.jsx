import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";

async function loadPrompts() {
  const { data, error } = await supabase.from("prompts").select("*").order("created_at", { ascending: true });
  if (error) { console.error("loadPrompts:", error); return []; }
  return data || [];
}

async function upsertPrompt(prompt) {
  const { error } = await supabase.from("prompts").upsert(prompt, { onConflict: "id" });
  if (error) console.error("upsertPrompt:", error);
}

async function deletePrompt(id) {
  const { error } = await supabase.from("prompts").delete().eq("id", id);
  if (error) console.error("deletePrompt:", error);
}

export default function Prompts() {
  const [prompts, setPrompts] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");

  useEffect(() => { loadPrompts().then(setPrompts); }, []);

  const handleAdd = async () => {
    if (!newTitle.trim() || !newText.trim()) return;
    const record = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      title: newTitle.trim(),
      prompt_text: newText.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await upsertPrompt(record);
    setPrompts(await loadPrompts());
    setNewTitle("");
    setNewText("");
    setAdding(false);
  };

  const saveTimers = useRef({});
  const handleUpdate = (id, field, value) => {
    const idx = prompts.findIndex(p => p.id === id);
    if (idx < 0) return;
    const updated = { ...prompts[idx], [field]: value, updated_at: new Date().toISOString() };
    const next = [...prompts];
    next[idx] = updated;
    setPrompts(next);
    // Debounce save — wait 1s after last keystroke
    clearTimeout(saveTimers.current[id + field]);
    saveTimers.current[id + field] = setTimeout(() => upsertPrompt(updated), 1000);
  };

  const handleDelete = async (id) => {
    await deletePrompt(id);
    setPrompts(prev => prev.filter(p => p.id !== id));
  };

  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", margin: 0 }}>Prompts</div>
        <button onClick={() => setAdding(true)} style={{
          background: T_.accent, border: "none", color: "#000", fontWeight: 600,
          fontSize: 13, padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontFamily: FONT,
        }}>+ Add Prompt</button>
      </div>

      {/* Add new */}
      {adding && (
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.accent}`, padding: 20, marginBottom: 16 }}>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="What is this prompt for?"
            style={{ width: "100%", padding: "8px 12px", fontSize: 14, background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 6, color: T_.text, fontFamily: FONT, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
          <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="Prompt text... (paste numbered lists, bullets, etc.)" rows={10}
            style={{ width: "100%", padding: "12px 14px", fontSize: 13, background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 6, color: T_.text, fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace", outline: "none", resize: "vertical", lineHeight: 1.8, marginBottom: 10, boxSizing: "border-box", whiteSpace: "pre-wrap", tabSize: 2 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAdd} disabled={!newTitle.trim() || !newText.trim()} style={{
              background: newTitle.trim() && newText.trim() ? T_.accent : T_.border, border: "none",
              color: newTitle.trim() && newText.trim() ? "#000" : T_.textGhost, fontWeight: 600,
              fontSize: 12, padding: "6px 16px", borderRadius: 5, cursor: "pointer", fontFamily: FONT,
            }}>Save</button>
            <button onClick={() => { setAdding(false); setNewTitle(""); setNewText(""); }} style={{
              background: "none", border: `1px solid ${T_.border}`, color: T_.textDim,
              fontSize: 12, padding: "6px 16px", borderRadius: 5, cursor: "pointer", fontFamily: FONT,
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Prompt list */}
      {prompts.length === 0 && !adding && (
        <div style={{ color: T_.textDim, fontSize: 14, padding: "20px 0" }}>No prompts yet. Click "+ Add Prompt" to get started.</div>
      )}

      {prompts.map((p, i) => (
        <div key={p.id} style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: T_.accent, background: `${T_.accent}15`, padding: "3px 10px", borderRadius: 4 }}>#{i + 1}</span>
              <input value={p.title} onChange={e => handleUpdate(p.id, "title", e.target.value)}
                style={{ fontSize: 15, fontWeight: 600, color: T_.text, background: "transparent", border: "none", outline: "none", fontFamily: FONT, flex: 1, minWidth: 200 }} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => toggleExpand(p.id)} style={{
                background: "none", border: `1px solid ${T_.border}`, color: T_.accent,
                fontSize: 11, padding: "4px 10px", borderRadius: 5, cursor: "pointer", fontFamily: FONT,
              }}>{expanded[p.id] ? "Collapse" : "Expand"}</button>
              <button onClick={() => handleCopy(p.prompt_text)} style={{
                background: "none", border: `1px solid ${T_.border}`, color: T_.textGhost,
                fontSize: 11, padding: "4px 10px", borderRadius: 5, cursor: "pointer", fontFamily: FONT,
              }}>Copy</button>
              <button onClick={() => handleDelete(p.id)} style={{
                background: "none", border: `1px solid ${T_.border}`, color: T_.red,
                fontSize: 11, padding: "4px 10px", borderRadius: 5, cursor: "pointer", fontFamily: FONT,
              }}>Delete</button>
            </div>
          </div>
          <textarea value={p.prompt_text} onChange={e => handleUpdate(p.id, "prompt_text", e.target.value)}
            rows={expanded[p.id] ? 30 : 6}
            onPaste={e => {
              e.stopPropagation();
              const text = e.clipboardData.getData("text/plain");
              const ta = e.target;
              const start = ta.selectionStart;
              const end = ta.selectionEnd;
              const newVal = ta.value.substring(0, start) + text + ta.value.substring(end);
              handleUpdate(p.id, "prompt_text", newVal);
              e.preventDefault();
              setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + text.length; }, 0);
            }}
            style={{ width: "100%", padding: "12px 14px", fontSize: 13, background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 6, color: T_.text, fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace", outline: "none", resize: "vertical", lineHeight: 1.8, boxSizing: "border-box", whiteSpace: "pre-wrap", tabSize: 2, transition: "height 0.2s" }} />
        </div>
      ))}
    </div>
  );
}
