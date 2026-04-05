import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const T_ = {
  bg: "#0a0e17", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", blue: "#70b0fa", red: "#f87171",
};
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function fmtDate(d) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }

export default function QuickNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    supabase.from("quick_notes").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setNotes(data || []);
      setLoading(false);
    });
  }, []);

  const handleAdd = async () => {
    if (!draft.trim()) return;
    const note = { id: uid(), content: draft.trim(), created_at: new Date().toISOString() };
    await supabase.from("quick_notes").insert(note);
    setNotes(prev => [note, ...prev]);
    setDraft("");
  };

  const handleDelete = async (id) => {
    await supabase.from("quick_notes").delete().eq("id", id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div style={{ padding: "36px 44px", maxWidth: "none", fontFamily: FONT }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T_.text, marginBottom: 4 }}>Notes</h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
        Jot things down from anywhere. Run <span style={{ color: T_.accent }}>"process my notes"</span> in Claude Code to sort them into the right places.
      </p>

      {/* Input */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <textarea
          style={{
            flex: 1, background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8,
            color: T_.text, fontSize: 14, padding: "12px 16px", fontFamily: FONT, outline: "none",
            resize: "vertical", minHeight: 60, lineHeight: 1.6, boxSizing: "border-box",
          }}
          placeholder="Type a note, paste a link, jot an idea..."
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(); } }}
        />
        <button onClick={handleAdd} style={{
          background: T_.accent, border: "none", color: T_.bg, padding: "12px 20px",
          borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT, alignSelf: "flex-end",
        }}>Save</button>
      </div>

      {/* Notes list */}
      {loading ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
        : notes.length === 0 ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>No notes yet. Type something above.</div>
        : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notes.map(note => (
            <div key={note.id} style={{
              background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.border}`, padding: "14px 18px",
            }}>
              <div style={{ fontSize: 14, color: T_.text, lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 8 }}>{note.content}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: T_.textGhost }}>{fmtDate(note.created_at)}</span>
                <button onClick={() => handleDelete(note.id)} style={{
                  background: "none", border: "none", color: T_.textGhost, cursor: "pointer", fontSize: 11,
                }} onMouseEnter={e => e.target.style.color = T_.red} onMouseLeave={e => e.target.style.color = T_.textGhost}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
