import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const T_ = {
  bg: "#0a0e17", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", blue: "#70b0fa", red: "#f87171", amber: "#f5a623",
};
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const CATEGORIES = ["AI Infrastructure", "GPU / Compute", "AI Labs", "Enterprise Software", "Macro", "Fintech", "Semiconductors", "Other"];

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Never"; }

export default function WatchlistAgent() {
  const [keywords, setKeywords] = useState([]);
  const [hits, setHits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addKeyword, setAddKeyword] = useState("");
  const [addCategory, setAddCategory] = useState("Other");
  const [view, setView] = useState("watchlist"); // watchlist | alerts

  useEffect(() => {
    Promise.all([
      supabase.from("watchlist").select("*").order("created_at", { ascending: false }),
      supabase.from("watchlist_hits").select("*").order("found_at", { ascending: false }).limit(100),
    ]).then(([wRes, hRes]) => {
      setKeywords(wRes.data || []);
      setHits(hRes.data || []);
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
    setHits(prev => prev.filter(h => h.watchlist_id !== id));
  };

  const handleDeleteHit = async (id) => {
    await supabase.from("watchlist_hits").delete().eq("id", id);
    setHits(prev => prev.filter(h => h.id !== id));
  };

  const inputStyle = { width: "100%", background: T_.bgInput, border: `1px solid ${T_.border}`, borderRadius: 8, color: T_.text, fontSize: 14, padding: "10px 14px", fontFamily: FONT, outline: "none", boxSizing: "border-box" };
  const activeCount = keywords.filter(k => k.active).length;

  return (
    <div style={{ padding: "36px 44px", maxWidth: "none", fontFamily: FONT }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T_.text, marginBottom: 4 }}>Watchlist / Alerts</h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 20, lineHeight: 1.6 }}>
        Track keywords across the web. Add terms to watch, then run <span style={{ color: T_.accent }}>"scan my watchlist"</span> in Claude Code to search for recent hits.
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${T_.border}`, paddingBottom: 1 }}>
        {[{ key: "watchlist", label: `Watchlist (${keywords.length})` }, { key: "alerts", label: `Alerts (${hits.length})` }].map(t => (
          <button key={t.key} onClick={() => setView(t.key)} style={{
            background: "none", border: "none", borderBottom: view === t.key ? `2px solid ${T_.accent}` : "2px solid transparent",
            color: view === t.key ? T_.accent : T_.textDim, padding: "8px 20px", cursor: "pointer", fontSize: 13,
            fontWeight: view === t.key ? 600 : 400, fontFamily: FONT, marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      {/* WATCHLIST VIEW */}
      {view === "watchlist" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button onClick={() => setShowAdd(true)} style={{ background: T_.accent, border: "none", color: T_.bg, padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT }}>+ Add Keyword</button>
            <div style={{ fontSize: 12, color: T_.textGhost, alignSelf: "center" }}>
              <span style={{ color: T_.green, fontWeight: 600 }}>{activeCount}</span> active
            </div>
          </div>

          {loading ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading...</div>
            : keywords.length === 0 ? <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center" }}>No keywords yet. Add terms to watch.</div>
            : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {keywords.map(kw => {
                const hitCount = hits.filter(h => h.watchlist_id === kw.id).length;
                return (
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
                    <span style={{ fontSize: 15, fontWeight: 600, color: T_.text, minWidth: 160 }}>{kw.keyword}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: T_.blue, background: `${T_.blue}15`, padding: "2px 8px", borderRadius: 4 }}>{kw.category}</span>
                    {hitCount > 0 && <span style={{ fontSize: 11, color: T_.amber, fontWeight: 600 }}>{hitCount} hit{hitCount !== 1 ? "s" : ""}</span>}
                    <span style={{ flex: 1 }} />
                    <span style={{ fontSize: 11, color: T_.textGhost }}>Checked: {fmtDate(kw.last_checked)}</span>
                    <button onClick={() => handleDelete(kw.id)} style={{ background: "none", border: "none", color: T_.textGhost, cursor: "pointer", fontSize: 14, padding: "0 4px" }}
                      onMouseEnter={e => e.target.style.color = T_.red} onMouseLeave={e => e.target.style.color = T_.textGhost}>×</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ALERTS VIEW */}
      {view === "alerts" && (
        <div>
          {hits.length === 0 ? (
            <div style={{ color: T_.textDim, fontSize: 14, padding: "40px 0", textAlign: "center", lineHeight: 1.7 }}>
              No alerts yet. Add keywords to your watchlist, then run <span style={{ color: T_.accent }}>"scan my watchlist"</span> in Claude Code.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {hits.map(hit => {
                const kw = keywords.find(k => k.id === hit.watchlist_id);
                return (
                  <div key={hit.id} style={{ background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.border}`, padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {kw && <span style={{ fontSize: 10, fontWeight: 600, color: T_.amber, background: `${T_.amber}15`, padding: "2px 8px", borderRadius: 4 }}>{kw.keyword}</span>}
                        <span style={{ fontSize: 11, color: T_.textGhost }}>{fmtDate(hit.found_at)}</span>
                      </div>
                      <button onClick={() => handleDeleteHit(hit.id)} style={{ background: "none", border: "none", color: T_.textGhost, cursor: "pointer", fontSize: 11 }}
                        onMouseEnter={e => e.target.style.color = T_.red} onMouseLeave={e => e.target.style.color = T_.textGhost}>Dismiss</button>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T_.text, marginBottom: 4 }}>{hit.title}</div>
                    {hit.snippet && <div style={{ fontSize: 13, color: T_.textDim, lineHeight: 1.6, marginBottom: 6 }}>{hit.snippet}</div>}
                    {hit.source_url && <a href={hit.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: T_.blue, textDecoration: "none" }}>View source ↗</a>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, padding: 28, width: 440 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 600, color: T_.accent, marginBottom: 20 }}>Add to Watchlist</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 6 }}>Keyword / Topic</div>
              <input style={inputStyle} placeholder='e.g. "CoreWeave earnings", "GPU rental pricing", "TSMC capacity"...' value={addKeyword} onChange={e => setAddKeyword(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleAdd(); }} />
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
