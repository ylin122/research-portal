import { useState, useEffect } from "react";
import { T_, FONT } from "./lib/theme";
import { loadAgents, upsertAgent, deleteAgent } from "./lib/db";

export default function DataVerificationAgent() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // agent id or "new"
  const [draft, setDraft] = useState({});

  useEffect(() => { loadAgents().then(d => { setAgents(d); setLoading(false); }); }, []);

  function startEdit(agent) {
    setEditing(agent.id);
    setDraft({ ...agent });
  }

  function startNew() {
    setEditing("new");
    setDraft({ id: "", name: "", description: "", tools: "", body: "", color: "#70b0fa", usage_example: "", mode: "", sort_order: agents.length });
  }

  function cancelEdit() { setEditing(null); setDraft({}); }

  async function saveDraft() {
    const id = editing === "new" ? draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") : draft.id;
    if (!id || !draft.name || !draft.body) return;
    const row = { ...draft, id, sort_order: Number(draft.sort_order) || 0 };
    await upsertAgent(row);
    const updated = await loadAgents();
    setAgents(updated);
    setEditing(null);
    setDraft({});
  }

  async function handleDelete(id) {
    if (!confirm(`Delete agent @${id}?`)) return;
    await deleteAgent(id);
    setAgents(agents.filter(a => a.id !== id));
  }

  const panelStyle = { background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: 20, marginBottom: 20 };
  const headerStyle = { fontSize: 13, fontWeight: 600, color: T_.textMid, letterSpacing: 0.3 };
  const inputStyle = {
    width: "100%", padding: "8px 10px", fontSize: 12, background: T_.bgInput,
    border: `1px solid ${T_.borderLight}`, borderRadius: 6, color: T_.text, outline: "none",
    fontFamily: FONT, boxSizing: "border-box", marginBottom: 8,
  };
  const btnSmall = (bg, color, border) => ({
    padding: "5px 14px", fontSize: 11, fontWeight: 500, borderRadius: 6, cursor: "pointer",
    background: bg, color, border: `1px solid ${border}`, fontFamily: FONT,
  });

  return (
    <div style={{ padding: "36px 44px", fontFamily: FONT }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: T_.text, marginBottom: 4 }}>Agent Commands</h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 28 }}>
        Claude Code agents synced via Supabase. Edit from any device, run from CLI with <span style={{ color: T_.accent, fontFamily: "monospace" }}>@agent-name</span>.
      </p>

      <div style={panelStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={headerStyle}>Claude Code Agents</span>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 11, color: T_.textGhost }}>Supabase → ~/.claude/agents/</span>
            <button onClick={startNew} style={btnSmall(T_.accent + "20", T_.accent, T_.accent + "40")}>+ New Agent</button>
          </div>
        </div>

        {loading && <div style={{ fontSize: 12, color: T_.textGhost, padding: 20 }}>Loading agents...</div>}

        {/* ── New Agent Form ── */}
        {editing === "new" && (
          <div style={{ background: T_.bgInput, border: `1px solid ${T_.accent}40`, borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T_.accent, marginBottom: 10 }}>New Agent</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input placeholder="Name (e.g. verifier)" value={draft.name || ""} onChange={e => setDraft({ ...draft, name: e.target.value })} style={inputStyle} />
              <input placeholder="Tools (e.g. Read, Bash, Grep)" value={draft.tools || ""} onChange={e => setDraft({ ...draft, tools: e.target.value })} style={inputStyle} />
            </div>
            <input placeholder="Description" value={draft.description || ""} onChange={e => setDraft({ ...draft, description: e.target.value })} style={inputStyle} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: 8, marginBottom: 8 }}>
              <input placeholder="Usage example" value={draft.usage_example || ""} onChange={e => setDraft({ ...draft, usage_example: e.target.value })} style={inputStyle} />
              <input placeholder="Mode (e.g. Read-only)" value={draft.mode || ""} onChange={e => setDraft({ ...draft, mode: e.target.value })} style={inputStyle} />
              <input placeholder="Color" value={draft.color || ""} onChange={e => setDraft({ ...draft, color: e.target.value })} style={{ ...inputStyle, fontFamily: "monospace" }} />
            </div>
            <textarea placeholder="Agent instructions (markdown body)" value={draft.body || ""} onChange={e => setDraft({ ...draft, body: e.target.value })} rows={12}
              style={{ ...inputStyle, fontFamily: "monospace", fontSize: 11, lineHeight: 1.6, resize: "vertical" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveDraft} style={btnSmall(T_.accent, "#fff", T_.accent)}>Save</button>
              <button onClick={cancelEdit} style={btnSmall("transparent", T_.textDim, T_.border)}>Cancel</button>
            </div>
          </div>
        )}

        {/* ── Agent Cards ── */}
        {agents.map(agent => (
          <div key={agent.id} style={{ background: T_.bgInput, border: `1px solid ${T_.borderLight}`, borderRadius: 8, padding: 14, marginBottom: 8 }}>
            {editing === agent.id ? (
              /* ── Edit Mode ── */
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <input value={draft.name || ""} onChange={e => setDraft({ ...draft, name: e.target.value })} style={inputStyle} />
                  <input value={draft.tools || ""} onChange={e => setDraft({ ...draft, tools: e.target.value })} style={inputStyle} />
                </div>
                <input value={draft.description || ""} onChange={e => setDraft({ ...draft, description: e.target.value })} style={inputStyle} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: 8, marginBottom: 8 }}>
                  <input value={draft.usage_example || ""} onChange={e => setDraft({ ...draft, usage_example: e.target.value })} style={inputStyle} />
                  <input value={draft.mode || ""} onChange={e => setDraft({ ...draft, mode: e.target.value })} style={inputStyle} />
                  <input value={draft.color || ""} onChange={e => setDraft({ ...draft, color: e.target.value })} style={{ ...inputStyle, fontFamily: "monospace" }} />
                </div>
                <textarea value={draft.body || ""} onChange={e => setDraft({ ...draft, body: e.target.value })} rows={14}
                  style={{ ...inputStyle, fontFamily: "monospace", fontSize: 11, lineHeight: 1.6, resize: "vertical" }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={saveDraft} style={btnSmall(T_.accent, "#fff", T_.accent)}>Save</button>
                  <button onClick={cancelEdit} style={btnSmall("transparent", T_.textDim, T_.border)}>Cancel</button>
                </div>
              </div>
            ) : (
              /* ── View Mode ── */
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: agent.color || T_.accent, fontFamily: "monospace" }}>@{agent.name}</span>
                    <span style={{ fontSize: 10, color: T_.textGhost, fontFamily: "monospace" }}>{agent.id}.md</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => startEdit(agent)} style={btnSmall("transparent", T_.textDim, T_.border)}>Edit</button>
                    <button onClick={() => handleDelete(agent.id)} style={btnSmall("transparent", T_.red, T_.border)}>Del</button>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.6, marginBottom: 8 }}>{agent.description}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {agent.usage_example && (
                    <div style={{ fontSize: 11, color: T_.textGhost }}>
                      <span style={{ fontWeight: 600, color: T_.textDim }}>Usage:</span>{" "}
                      <span style={{ fontFamily: "monospace", color: agent.color || T_.accent, background: `${agent.color || T_.accent}10`, padding: "1px 6px", borderRadius: 3 }}>{agent.usage_example}</span>
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: T_.textGhost }}>
                    <span style={{ fontWeight: 600, color: T_.textDim }}>Tools:</span> {agent.tools}
                  </div>
                  {agent.mode && (
                    <div style={{ fontSize: 11, color: T_.textGhost }}>
                      <span style={{ fontWeight: 600, color: T_.textDim }}>Mode:</span> {agent.mode}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}

        {/* ── Recommended Workflow ── */}
        <div style={{ background: T_.bgInput, border: `1px dashed ${T_.accent}30`, borderRadius: 8, padding: "12px 14px", marginTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T_.accent, marginBottom: 6 }}>Recommended Workflow</div>
          <div style={{ fontSize: 11, color: T_.textMid, lineHeight: 1.8 }}>
            <strong>1.</strong> To update a tab with latest info → <span style={{ fontFamily: "monospace", color: "#14B8A6" }}>@refresh</span><br/>
            <strong>2.</strong> After code changes → <span style={{ fontFamily: "monospace", color: "#34d673" }}>@verifier</span><br/>
            <strong>3.</strong> After writing research content → run <span style={{ fontFamily: "monospace", color: "#70b0fa" }}>@fact-checker</span> and <span style={{ fontFamily: "monospace", color: "#f87171" }}>@fact-disputer</span> in parallel<br/>
            <strong>4.</strong> After both return → <span style={{ fontFamily: "monospace", color: "#f5a623" }}>@fact-check-reconciler</span> to get final verdicts<br/>
            <strong>5.</strong> Fix any CONFLICT / LIKELY WRONG items, then re-verify<br/>
            <strong>6.</strong> To test a scenario → <span style={{ fontFamily: "monospace", color: "#F97316" }}>@whatif</span> screens all companies for impact
          </div>
        </div>
      </div>
    </div>
  );
}
