import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";

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
      <div style={{ marginBottom: 24 }}>
        <textarea
          style={{
            width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 10,
            color: T_.text, fontSize: 15, padding: "16px 18px", fontFamily: FONT, outline: "none",
            resize: "vertical", minHeight: 160, lineHeight: 1.7, boxSizing: "border-box",
          }}
          placeholder="Type a note, paste a link, jot an idea... Press Enter for new lines."
          value={draft}
          onChange={e => setDraft(e.target.value)}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button onClick={handleAdd} style={{
            background: T_.accent, border: "none", color: T_.bg, padding: "10px 28px",
            borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: FONT,
          }}>Save Note</button>
        </div>
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
