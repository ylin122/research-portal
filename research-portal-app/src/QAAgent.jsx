import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const T_ = {
  bg: "#0a0e17", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", blue: "#70b0fa", red: "#f87171", amber: "#f5a623",
};
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""; }

export default function QAAgent() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addQuestion, setAddQuestion] = useState("");

  useEffect(() => {
    supabase.from("qa_log").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setEntries(data || []);
      setLoading(false);
    });
  }, []);

  const handleAdd = async () => {
    if (!addQuestion.trim()) return;
    const qa = { id: uid(), question: addQuestion.trim(), answer: "", sources: [], tags: [] };
    await supabase.from("qa_log").upsert(qa);
    setEntries(prev => [qa, ...prev]);
    setAddQuestion(""); setShowAdd(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("qa_log").delete().eq("id", id);
    setEntries(prev => prev.filter(e => e.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const filtered = entries.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (e.question || "").toLowerCase().includes(q) || (e.answer || "").toLowerCase().includes(q) || (e.tags || []).some(t => t.toLowerCase().includes(q));
  });

  const answered = entries.filter(e => e.answer).length;
  const pending = entries.filter(e => !e.answer).length;

  const inputStyle = { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, color: T_.text, fontSize: 14, padding: "10px 14px", fontFamily: FONT, outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ padding: "36px 44px", maxWidth: "none", fontFamily: FONT }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T_.text, marginBottom: 4 }}>Q&A</h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
        Ask questions about your research wiki. Add a question, then run <span style={{ color: T_.accent }}>"answer my questions"</span> in Claude Code. Answers are saved and searchable.
      </p>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input style={{ flex: 1, minWidth: 200, ...inputStyle, fontSize: 13, padding: "9px 14px" }} placeholder="Search Q&A..." value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={() => setShowAdd(true)} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>+ Ask Question</button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: T_.textGhost }}><span style={{ color: T_.text, fontWeight: 600 }}>{entries.length}</span> questions</div>
        <div style={{ fontSize: 12, color: T_.textGhost }}><span style={{ color: T_.green, fontWeight: 600 }}>{answered}</span> answered</div>
        {pending > 0 && <div style={{ fontSize: 12, color: T_.textGhost }}><span style={{ color: T_.amber, fontWeight: 600 }}>{pending}</span> pending</div>}
      </div>

      {/* Q&A List */}
      {loading ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
        : filtered.length === 0 ? (
          <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center", lineHeight: 1.7 }}>
            {entries.length === 0 ? 'No questions yet. Click "+ Ask Question" to start.' : "No match."}
          </div>
        ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(qa => {
            const isExpanded = expanded === qa.id;
            const hasAnswer = !!qa.answer;
            return (
              <div key={qa.id} style={{
                background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, overflow: "hidden",
                borderLeft: `3px solid ${hasAnswer ? T_.green : T_.amber}`,
              }}>
                {/* Question header */}
                <div onClick={() => setExpanded(isExpanded ? null : qa.id)} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    <span style={{ color: T_.accent, fontSize: 12, transition: "transform 0.15s", transform: isExpanded ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>&#9654;</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{qa.question}</span>
                    {!hasAnswer && <span style={{ fontSize: 10, fontWeight: 600, color: T_.amber, background: `${T_.amber}15`, padding: "2px 8px", borderRadius: 4 }}>Pending</span>}
                    {hasAnswer && <span style={{ fontSize: 10, fontWeight: 600, color: T_.green, background: `${T_.green}15`, padding: "2px 8px", borderRadius: 4 }}>Answered</span>}
                  </div>
                  <span style={{ fontSize: 11, color: T_.textGhost, marginLeft: 12, flexShrink: 0 }}>{fmtDate(qa.created_at)}</span>
                </div>

                {/* Expanded answer */}
                {isExpanded && (
                  <div style={{ padding: "0 20px 20px 44px", borderTop: `1px solid ${T_.border}` }}>
                    {hasAnswer ? (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{qa.answer}</div>
                        {qa.sources?.length > 0 && (
                          <div style={{ marginTop: 12 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Sources Referenced</div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {qa.sources.map((src, i) => (
                                <span key={i} style={{ fontSize: 11, color: T_.blue, background: `${T_.blue}12`, padding: "3px 10px", borderRadius: 6, border: `1px solid ${T_.blue}30` }}>{src}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {qa.tags?.length > 0 && (
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                            {qa.tags.map((tag, i) => (
                              <span key={i} style={{ fontSize: 10, color: T_.accent, background: `${T_.accent}12`, padding: "2px 8px", borderRadius: 4, border: `1px solid ${T_.accent}30` }}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ marginTop: 16, padding: 16, background: `${T_.amber}08`, borderRadius: 8, border: `1px solid ${T_.amber}25` }}>
                        <div style={{ fontSize: 13, color: T_.amber }}>Waiting for answer.</div>
                        <div style={{ fontSize: 12, color: T_.textDim, marginTop: 4 }}>Run <span style={{ color: T_.accent }}>"answer my questions"</span> in Claude Code to research your wiki and generate an answer.</div>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                      <button onClick={e => { e.stopPropagation(); handleDelete(qa.id); }} style={{
                        background: "none", border: `1px solid ${T_.border}`, color: T_.textGhost, padding: "4px 12px",
                        borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: FONT,
                      }} onMouseEnter={e => e.target.style.color = T_.red} onMouseLeave={e => e.target.style.color = T_.textGhost}>Remove</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, padding: 28, width: 500 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 600, color: T_.accent, marginBottom: 20 }}>Ask a Question</div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Your Question</div>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical", lineHeight: 1.7 }}
                placeholder='e.g. "What are the key arguments for why GPU rental prices will keep rising?" or "How do context graphs relate to the agent compute demand?"'
                value={addQuestion} onChange={e => setAddQuestion(e.target.value)} />
            </div>
            <p style={{ fontSize: 12, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
              The question will be saved. Run <span style={{ color: T_.accent }}>"answer my questions"</span> in Claude Code — it will research your wiki and generate an answer with source citations.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: `1px solid ${T_.border}`, color: T_.textMid, padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: FONT }}>Cancel</button>
              <button onClick={handleAdd} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>Ask</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
