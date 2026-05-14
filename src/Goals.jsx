import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";
import ErrorBanner from "./lib/ErrorBanner";

const STATUS_CYCLE = ["active", "done", "paused"];
const STATUS_COLORS = {
  active: T_.accent,
  done: T_.green,
  paused: T_.amber,
};

async function loadGoals() {
  const { data, error } = await supabase.from("goals").select("*").order("sort_order", { ascending: true });
  if (error) { console.error("loadGoals:", error); throw error; }
  return data || [];
}

async function upsertGoal(g) {
  const { error } = await supabase.from("goals").upsert(g, { onConflict: "id" });
  if (error) console.error("upsertGoal:", error);
}

async function deleteGoal(id) {
  const { error } = await supabase.from("goals").delete().eq("id", id);
  if (error) console.error("deleteGoal:", error);
}

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editing, setEditing] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const saveTimers = useRef({});

  const load = () => {
    setLoadError(null);
    loadGoals().then(setGoals).catch(err => setLoadError(err.message || "Failed to load goals"));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: load data on mount
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    const record = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      title: newTitle.trim(),
      status: "active",
      sort_order: goals.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await upsertGoal(record);
    setGoals(await loadGoals());
    setNewTitle("");
    setAdding(false);
  };

  const handleUpdate = (id, field, value) => {
    const idx = goals.findIndex(g => g.id === id);
    if (idx < 0) return;
    const updated = { ...goals[idx], [field]: value, updated_at: new Date().toISOString() };
    const next = [...goals];
    next[idx] = updated;
    setGoals(next);
    clearTimeout(saveTimers.current[id + field]);
    saveTimers.current[id + field] = setTimeout(() => upsertGoal(updated), 1000);
  };

  const cycleStatus = (g) => {
    const current = g.status || "active";
    const nextStatus = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length];
    const updated = { ...g, status: nextStatus, updated_at: new Date().toISOString() };
    setGoals(prev => prev.map(x => x.id === g.id ? updated : x));
    upsertGoal(updated);
  };

  const handleDelete = async (id) => {
    await deleteGoal(id);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleMove = async (idx, dir) => {
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= goals.length) return;
    const next = [...goals];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    const a = { ...next[idx], sort_order: idx + 1, updated_at: new Date().toISOString() };
    const b = { ...next[swapIdx], sort_order: swapIdx + 1, updated_at: new Date().toISOString() };
    next[idx] = a;
    next[swapIdx] = b;
    setGoals(next);
    await upsertGoal(a);
    await upsertGoal(b);
  };

  return (
    <div style={{ marginTop: 40, fontFamily: FONT }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T_.text, letterSpacing: "-0.3px" }}>Goals</div>
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

      <ErrorBanner message={loadError} onRetry={load} />

      {adding && (
        <div style={{ background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
          <textarea
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Write your goal..."
            rows={3}
            style={{
              width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 6,
              padding: "10px 14px", color: T_.text, fontSize: 14, fontFamily: FONT, resize: "vertical",
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

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {goals.map((g, i) => {
          const status = g.status || "active";
          const isDone = status === "done";
          const isPaused = status === "paused";
          return (
            <div
              key={g.id}
              style={{
                padding: "18px 0",
                borderBottom: i < goals.length - 1 ? `1px solid ${T_.borderLight}` : "none",
              }}
            >
              {editing === g.id ? (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T_.accent, minWidth: 28, lineHeight: "1.6", paddingTop: 6 }}>{i + 1}.</span>
                  <div style={{ flex: 1 }}>
                    <textarea
                      value={g.title}
                      onChange={e => handleUpdate(g.id, "title", e.target.value)}
                      rows={3}
                      style={{
                        width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 6,
                        padding: "8px 12px", color: T_.text, fontSize: 14, fontFamily: FONT, resize: "vertical",
                        outline: "none", boxSizing: "border-box", lineHeight: "1.6",
                      }}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                      <button onClick={() => handleMove(i, -1)} disabled={i === 0} style={{ background: "transparent", color: i === 0 ? T_.textGhost : T_.textMid, border: `1px solid ${T_.border}`, borderRadius: 5, padding: "4px 10px", fontSize: 12, cursor: i === 0 ? "default" : "pointer", fontFamily: FONT }}>Move Up</button>
                      <button onClick={() => handleMove(i, 1)} disabled={i === goals.length - 1} style={{ background: "transparent", color: i === goals.length - 1 ? T_.textGhost : T_.textMid, border: `1px solid ${T_.border}`, borderRadius: 5, padding: "4px 10px", fontSize: 12, cursor: i === goals.length - 1 ? "default" : "pointer", fontFamily: FONT }}>Move Down</button>
                      <div style={{ flex: 1 }} />
                      <button onClick={() => setEditing(null)} style={{ background: T_.accent, color: "#000", border: "none", borderRadius: 5, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Done</button>
                      <button onClick={() => handleDelete(g.id)} style={{ background: "transparent", color: T_.red, border: `1px solid ${T_.red}`, borderRadius: 5, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Delete</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T_.accent, minWidth: 28, lineHeight: "1.6" }}>{i + 1}.</span>
                  <span
                    onClick={() => setEditing(g.id)}
                    style={{
                      flex: 1, fontSize: 14, color: isDone || isPaused ? T_.textDim : T_.text,
                      lineHeight: "1.6", cursor: "pointer",
                      textDecoration: isDone ? "line-through" : "none",
                    }}
                  >
                    {g.title}
                  </span>
                  <button
                    onClick={() => cycleStatus(g)}
                    style={{
                      background: `${STATUS_COLORS[status]}15`, color: STATUS_COLORS[status],
                      border: `1px solid ${STATUS_COLORS[status]}40`, borderRadius: 4,
                      padding: "2px 10px", fontSize: 10, fontWeight: 600, textTransform: "uppercase",
                      letterSpacing: "0.5px", cursor: "pointer", fontFamily: FONT,
                    }}
                    title="Click to cycle status"
                  >
                    {status}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {goals.length === 0 && !adding && (
        <div style={{ textAlign: "center", color: T_.textGhost, padding: "40px 0", fontSize: 13 }}>
          No goals yet. Click "+ Add" to start.
        </div>
      )}
    </div>
  );
}
