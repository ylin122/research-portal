import { useState } from "react";
import { T_, FONT } from "./lib/theme";

async function callClaude(prompt, maxTokens = 4000) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: maxTokens,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const d = await r.json();
  return d.content?.map(i => i.type === "text" ? i.text : "").filter(Boolean).join("\n") || "";
}

const STORAGE_KEY = "research_portal_notes_ideas";
function loadEntries() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } }
function saveEntries(entries) { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }

export default function NotesIdeasAgent({ companies, fieldsMap, sectorNotes }) {
  const [entries, setEntries] = useState(loadEntries);
  const [input, setInput] = useState("");
  const [type, setType] = useState("note");
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const types = [
    { key: "note", label: "Note" },
    { key: "idea_macro", label: "Macro Idea" },
    { key: "idea_micro", label: "Micro Idea" },
    { key: "question", label: "Question" },
  ];

  async function handleSubmit() {
    if (!input.trim()) return;
    setLoading(true);

    const companyContext = companies
      .filter(c => c.sector !== "sources" && c.sector !== "prompts")
      .slice(0, 30)
      .map(c => c.name)
      .join(", ");

    const prompt = `You are a research assistant helping an analyst organize their thinking. The analyst has entered the following ${type === "note" ? "note" : type === "question" ? "question" : "investment idea"}:

"${input}"

Context: The analyst tracks these companies: ${companyContext}

Please provide:
1. A concise title (max 10 words)
2. Key themes or tags (3-5 tags)
3. Related companies from the tracked list (if any)
4. An expanded analysis or response (2-3 paragraphs):
   - For notes: organize and expand the thought with supporting context
   - For ideas: evaluate the thesis, identify risks and catalysts
   - For questions: research and answer the question with sources

Respond ONLY with a JSON object, no markdown backticks:
{
  "title": "...",
  "tags": ["tag1", "tag2"],
  "relatedCompanies": ["Company A"],
  "analysis": "..."
}`;

    let result = { title: input.slice(0, 60), tags: [], relatedCompanies: [], analysis: "" };
    try {
      const raw = await callClaude(prompt);
      if (raw) {
        const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        result = { ...result, ...parsed };
      }
    } catch { /* use defaults */ }

    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      type,
      input: input.trim(),
      ...result,
      date: new Date().toISOString(),
    };

    const updated = [entry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    setInput("");
    setLoading(false);
    setExpandedId(entry.id);
  }

  function deleteEntry(id) {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    saveEntries(updated);
  }

  const typeColors = {
    note: { bg: "rgba(112,176,250,0.1)", color: T_.blue, border: "rgba(112,176,250,0.3)" },
    idea_macro: { bg: T_.greenBg, color: T_.green, border: T_.greenBorder },
    idea_micro: { bg: T_.amberBg, color: T_.amber, border: T_.amberBorder },
    question: { bg: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "rgba(167,139,250,0.3)" },
  };

  const typeLabels = { note: "Note", idea_macro: "Macro", idea_micro: "Micro", question: "Question" };

  return (
    <div style={{ padding: "36px 44px", fontFamily: FONT }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Notes / Ideas Agent</h1>
      <p style={{ fontSize: 14, color: T_.textDim, marginBottom: 28, lineHeight: 1.6 }}>
        Capture notes, questions, and investment ideas. The agent will organize, tag, and expand your thinking.
      </p>

      {/* Input */}
      <div style={{ background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: 20, marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {types.map(t => (
            <span key={t.key} style={{
              padding: "5px 14px", fontSize: 12, borderRadius: 6, cursor: "pointer", fontFamily: FONT,
              background: type === t.key ? typeColors[t.key].bg : "transparent",
              color: type === t.key ? typeColors[t.key].color : T_.textGhost,
              border: `1px solid ${type === t.key ? typeColors[t.key].border : T_.border}`,
            }} onClick={() => setType(t.key)}>{t.label}</span>
          ))}
        </div>
        <textarea
          style={{
            width: "100%", minHeight: 80, background: T_.bgInput, border: `1px solid ${T_.border}`,
            borderRadius: 8, color: T_.text, fontSize: 14, padding: 14, fontFamily: FONT,
            resize: "vertical", outline: "none", boxSizing: "border-box",
          }}
          placeholder={type === "question" ? "Ask a question..." : type === "note" ? "Capture a thought or observation..." : "Describe an investment idea or thesis..."}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <span style={{ fontSize: 11, color: T_.textGhost }}>Ctrl+Enter to submit</span>
          <button
            style={{
              padding: "8px 20px", fontSize: 13, fontWeight: 500, borderRadius: 8, cursor: "pointer",
              background: loading ? T_.border : T_.accent, color: loading ? T_.textDim : "#000",
              border: "none", fontFamily: FONT, opacity: loading ? 0.6 : 1,
            }}
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
          >{loading ? "Thinking..." : "Submit"}</button>
        </div>
      </div>

      {/* Entries */}
      {entries.length === 0 && (
        <div style={{ color: T_.textDim, fontSize: 14, textAlign: "center", padding: "40px 0" }}>
          No entries yet. Start by capturing a note, idea, or question above.
        </div>
      )}

      {entries.map(entry => {
        const expanded = expandedId === entry.id;
        const tc = typeColors[entry.type] || typeColors.note;
        return (
          <div key={entry.id} style={{
            background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10,
            padding: "16px 20px", marginBottom: 10, cursor: "pointer",
          }} onClick={() => setExpandedId(expanded ? null : entry.id)}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: expanded ? 12 : 0 }}>
              <span style={{
                fontSize: 10, padding: "3px 10px", borderRadius: 4, fontFamily: FONT,
                background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
              }}>{typeLabels[entry.type]}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: T_.text, flex: 1 }}>{entry.title}</span>
              <span style={{ fontSize: 11, color: T_.textGhost, flexShrink: 0 }}>
                {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
              <span style={{ fontSize: 11, color: T_.red, padding: "2px 8px", cursor: "pointer" }}
                onClick={e => { e.stopPropagation(); deleteEntry(entry.id); }}>&#10005;</span>
            </div>
            {expanded && (
              <div>
                <div style={{ fontSize: 13, color: T_.textMid, marginBottom: 10, fontStyle: "italic", borderLeft: `2px solid ${T_.border}`, paddingLeft: 12 }}>
                  {entry.input}
                </div>
                {entry.tags?.length > 0 && (
                  <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                    {entry.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, background: T_.grayBadge, color: T_.grayBadgeText }}>{tag}</span>
                    ))}
                  </div>
                )}
                {entry.relatedCompanies?.length > 0 && (
                  <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 10 }}>
                    Related: {entry.relatedCompanies.join(", ")}
                  </div>
                )}
                {entry.analysis && (
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                    {entry.analysis}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
