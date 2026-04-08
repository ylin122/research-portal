import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";

const CATEGORIES = ["AI Infrastructure", "GPU / Compute", "AI Labs", "Enterprise Software", "Macro", "Fintech", "Semiconductors", "Other"];

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

export default function WatchlistAgent() {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addKeyword, setAddKeyword] = useState("");
  const [addCategory, setAddCategory] = useState("Other");

  useEffect(() => {
    supabase.from("watchlist").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setKeywords(data || []);
      setLoading(false);
    });
  }, []);

  const handleAdd = async () => {
    if (!addKeyword.trim()) return;
    const kw = { id: uid(), keyword: addKeyword.trim(), category: addCategory, active: true };
    await supabase.from("watchlist").upsert(kw);
    setKeywords(prev => [kw, ...prev]);
    setAddKeyword(""); setShowAdd(false);
  };

  const toggleActive = async (id, active) => {
    await supabase.from("watchlist").update({ active: !active }).eq("id", id);
    setKeywords(prev => prev.map(k => k.id === id ? { ...k, active: !active } : k));
  };

  const handleDelete = async (id) => {
    await supabase.from("watchlist").delete().eq("id", id);
    setKeywords(prev => prev.filter(k => k.id !== id));
  };

  const inputStyle = { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, color: T_.text, fontSize: 14, padding: "10px 14px", fontFamily: FONT, outline: "none", boxSizing: "border-box" };
  const activeCount = keywords.filter(k => k.active).length;

  return (
    <div style={{ padding: "36px 44px", maxWidth: "none", fontFamily: FONT }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T_.text, marginBottom: 4 }}>Alerts</h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
        Keywords and topics to screen for. Run <span style={{ color: T_.accent }}>"scan my alerts"</span> in Claude Code to search the web for matches.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <button onClick={() => setShowAdd(true)} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>+ Add Alert</button>
        <div style={{ fontSize: 12, color: T_.textGhost }}>
          <span style={{ color: T_.text, fontWeight: 600 }}>{keywords.length}</span> alerts
          <span style={{ margin: "0 8px", color: T_.border }}>|</span>
          <span style={{ color: T_.green, fontWeight: 600 }}>{activeCount}</span> active
        </div>
      </div>

      {loading ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
        : keywords.length === 0 ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>No alerts yet. Add keywords to screen for.</div>
        : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {keywords.map(kw => (
            <div key={kw.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
              background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.border}`,
              opacity: kw.active ? 1 : 0.5,
            }}>
              <div onClick={() => toggleActive(kw.id, kw.active)} style={{
                width: 18, height: 18, borderRadius: 4, border: `2px solid ${kw.active ? T_.green : T_.textGhost}`,
                background: kw.active ? T_.green : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {kw.active && <span style={{ color: T_.bg, fontSize: 12, fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: T_.text, flex: 1 }}>{kw.keyword}</span>
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: T_.blue, background: `${T_.blue}15`, padding: "2px 8px", borderRadius: 4 }}>{kw.category}</span>
              <button onClick={() => handleDelete(kw.id)} style={{ background: "none", border: "none", color: T_.textGhost, cursor: "pointer", fontSize: 14, padding: "0 4px" }}
                onMouseEnter={e => e.target.style.color = T_.red} onMouseLeave={e => e.target.style.color = T_.textGhost}>×</button>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, padding: 28, width: 440 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 600, color: T_.accent, marginBottom: 20 }}>Add Alert</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Keyword / Topic</div>
              <input style={inputStyle} placeholder='e.g. "CoreWeave earnings", "GPU rental pricing"...' value={addKeyword} onChange={e => setAddKeyword(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleAdd(); }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Category</div>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={addCategory} onChange={e => setAddCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
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
