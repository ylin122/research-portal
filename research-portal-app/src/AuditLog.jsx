import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const T_ = {
  bg: "#0a0e17", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347", borderLight: "#222d40",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", greenBg: "#0d3520", greenBorder: "#1a7a3d",
  amber: "#f5a623", amberBg: "#332508", amberBorder: "#8a5e16",
  blue: "#70b0fa", red: "#f87171", redDim: "#7f1d1d",
  grayBadge: "#3d4d60", grayBadgeText: "#b0bcc9",
};
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const STORAGE_KEY = "research_portal_audit_log";
const VERIFICATION_KEY = "research_portal_verification";
const NOTES_IDEAS_KEY = "research_portal_notes_ideas";
const EQUITY_NOTES_KEY = "research_portal_equity_notes";
const EQUITIES_KEY = "research_portal_equities";

function loadLog() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } }
function saveLog(entries) { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }

// Expose globally so other components can log events
window.__auditLog = function(entry) {
  const log = loadLog();
  const newEntry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  log.unshift(newEntry);
  // Keep last 1000 entries
  if (log.length > 1000) log.length = 1000;
  saveLog(log);
};

const SOURCE_COLORS = {
  "Credit Research": { bg: "#3B82F622", color: "#3B82F6", border: "#3B82F644" },
  "Equity Research": { bg: "#10B98122", color: "#10B981", border: "#10B98144" },
  "Data Verification": { bg: T_.amberBg, color: T_.amber, border: T_.amberBorder },
  "Notes / Ideas": { bg: "#8B5CF622", color: "#8B5CF6", border: "#8B5CF644" },
  "Primer": { bg: "#0EA5E922", color: "#0EA5E9", border: "#0EA5E944" },
  "Business Models": { bg: "#F59E0B22", color: "#F59E0B", border: "#F59E0B44" },
  "Financial Instruments": { bg: "#EF444422", color: "#EF4444", border: "#EF444444" },
  "YL Research Wiki": { bg: "#14B8A622", color: "#14B8A6", border: "#14B8A644" },
  "Idea Tracker": { bg: "#A78BFA22", color: "#A78BFA", border: "#A78BFA44" },
  "Knowledge Base": { bg: "#FB923C22", color: "#FB923C", border: "#FB923C44" },
  "Portal": { bg: "#6EE7B722", color: "#6EE7B7", border: "#6EE7B744" },
  "Gmail Ingest": { bg: "#38BDF822", color: "#38BDF8", border: "#38BDF844" },
  "System": { bg: T_.grayBadge, color: T_.grayBadgeText, border: T_.textGhost },
};

const TYPE_ICONS = {
  create: "\u2795",
  update: "\u270F\uFE0F",
  delete: "\uD83D\uDDD1\uFE0F",
  verify: "\u2705",
  warning: "\u26A0\uFE0F",
  error: "\u274C",
  refresh: "\uD83D\uDD04",
  note: "\uD83D\uDCDD",
  idea: "\uD83D\uDCA1",
};

function fmt(d) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function fmtTime(d) { return new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }
function fmtFull(d) { return fmt(d) + " " + fmtTime(d); }

export default function AuditLog({ companies, fieldsMap, notesMap, newsCache, sectorNotes }) {
  const [log, setLog] = useState(loadLog);
  const [filter, setFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // On mount, scan for changes and auto-log them (last 2 weeks only)
  useEffect(() => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const existing = loadLog().filter(e => e.timestamp >= twoWeeksAgo);
    const newEntries = [];

    // Scan Credit Research field updates
    if (fieldsMap) {
      Object.entries(fieldsMap).forEach(([companyId, fields]) => {
        const company = companies?.find(c => c.id === companyId);
        const companyName = company?.name || companyId;
        Object.entries(fields).forEach(([fieldKey, fieldData]) => {
          if (fieldData?.date) {
            const alreadyLogged = existing.some(e =>
              e.companyId === companyId && e.fieldKey === fieldKey && e.fieldDate === fieldData.date
            );
            if (!alreadyLogged && fieldData.text) {
              newEntries.push({
                id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + fieldKey,
                timestamp: fieldData.date,
                type: "update",
                source: "Credit Research",
                title: `${companyName} — ${fieldKey}`,
                detail: fieldData.text.slice(0, 200) + (fieldData.text.length > 200 ? "..." : ""),
                companyId,
                fieldKey,
                fieldDate: fieldData.date,
              });
            }
          }
        });
      });
    }

    // Scan company notes
    if (notesMap) {
      Object.entries(notesMap).forEach(([companyId, notes]) => {
        const company = companies?.find(c => c.id === companyId);
        const companyName = company?.name || companyId;
        notes.forEach(note => {
          const alreadyLogged = existing.some(e => e.noteId === note.id);
          if (!alreadyLogged) {
            newEntries.push({
              id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + note.id,
              timestamp: note.date,
              type: "note",
              source: "Credit Research",
              title: `Note on ${companyName}`,
              detail: note.text.slice(0, 200) + (note.text.length > 200 ? "..." : ""),
              companyId,
              noteId: note.id,
            });
          }
        });
      });
    }

    // Scan Data Verification results
    try {
      const verResults = JSON.parse(localStorage.getItem(VERIFICATION_KEY) || "{}");
      Object.entries(verResults).forEach(([companyId, result]) => {
        if (result?.date) {
          const alreadyLogged = existing.some(e => e.verifyId === companyId && e.verifyDate === result.date);
          if (!alreadyLogged) {
            newEntries.push({
              id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + companyId,
              timestamp: result.date,
              type: result.status === "verified" ? "verify" : result.status === "error" ? "error" : "warning",
              source: "Data Verification",
              title: `${result.companyName || companyId} — ${result.status}`,
              detail: (result.issues || []).join("; ").slice(0, 300) || result.details?.slice(0, 300) || "No issues found",
              score: result.score,
              verifyId: companyId,
              verifyDate: result.date,
            });
          }
        }
      });
    } catch {}

    // Scan Notes / Ideas Agent entries
    try {
      const notesIdeas = JSON.parse(localStorage.getItem(NOTES_IDEAS_KEY) || "[]");
      notesIdeas.forEach(entry => {
        const alreadyLogged = existing.some(e => e.notesIdeaId === entry.id);
        if (!alreadyLogged) {
          newEntries.push({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + entry.id,
            timestamp: entry.date,
            type: entry.type === "question" ? "note" : "idea",
            source: "Notes / Ideas",
            title: entry.title || entry.input?.slice(0, 60),
            detail: entry.analysis?.slice(0, 300) || entry.input?.slice(0, 300) || "",
            tags: entry.tags,
            notesIdeaId: entry.id,
          });
        }
      });
    } catch {}

    // Scan Equity Research notes
    try {
      const equityNotes = JSON.parse(localStorage.getItem(EQUITY_NOTES_KEY) || "{}");
      const equities = JSON.parse(localStorage.getItem(EQUITIES_KEY) || "[]");
      Object.entries(equityNotes).forEach(([eqId, noteText]) => {
        if (noteText) {
          const eq = equities.find(e => e.id === eqId);
          const alreadyLogged = existing.some(e => e.equityNoteId === eqId && e.detail === noteText.slice(0, 200));
          if (!alreadyLogged) {
            newEntries.push({
              id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + eqId,
              timestamp: new Date().toISOString(),
              type: "update",
              source: "Equity Research",
              title: `${eq?.name || eqId} — Notes updated`,
              detail: noteText.slice(0, 200) + (noteText.length > 200 ? "..." : ""),
              equityNoteId: eqId,
            });
          }
        }
      });
    } catch {}

    // Filter new entries to last 2 weeks
    const recentNew = newEntries.filter(e => e.timestamp >= twoWeeksAgo);
    const merged = [...recentNew, ...existing].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    saveLog(merged);
    setLog(merged);
  }, [companies, fieldsMap, notesMap]);

  // Fetch cloud audit log from Supabase and merge
  useEffect(() => {
    supabase.from("audit_log").select("*").order("timestamp", { ascending: false }).limit(500).then(({ data }) => {
      if (data && data.length > 0) {
        setLog(prev => {
          const localIds = new Set(prev.map(e => e.id));
          const newEntries = data.filter(e => !localIds.has(e.id)).map(e => ({
            id: e.id,
            timestamp: e.timestamp || e.created_at,
            type: e.type || "update",
            source: e.source || "Portal",
            title: e.title,
            detail: e.detail,
          }));
          if (newEntries.length === 0) return prev;
          return [...prev, ...newEntries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        });
      }
    });
  }, []);

  // Refresh log from storage + Supabase
  function refreshLog() {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const local = loadLog().filter(e => e.timestamp >= twoWeeksAgo);
    supabase.from("audit_log").select("*").order("timestamp", { ascending: false }).limit(500).then(({ data }) => {
      const localIds = new Set(local.map(e => e.id));
      const cloud = (data || []).filter(e => !localIds.has(e.id)).map(e => ({
        id: e.id, timestamp: e.timestamp || e.created_at, type: e.type || "update",
        source: e.source || "Portal", title: e.title, detail: e.detail,
      }));
      setLog([...local, ...cloud].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    });
  }

  // Clear all logs
  function clearLog() {
    saveLog([]);
    setLog([]);
  }

  // Filters
  const types = ["all", "update", "create", "delete", "verify", "warning", "error", "refresh", "note", "idea"];
  const sources = ["all", ...Object.keys(SOURCE_COLORS)];

  let filtered = log;
  if (filter !== "all") filtered = filtered.filter(e => e.type === filter);
  if (sourceFilter !== "all") filtered = filtered.filter(e => e.source === sourceFilter);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(e =>
      (e.title || "").toLowerCase().includes(term) ||
      (e.detail || "").toLowerCase().includes(term) ||
      (e.source || "").toLowerCase().includes(term)
    );
  }

  // Group by date
  const grouped = {};
  filtered.forEach(entry => {
    const day = fmt(entry.timestamp);
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(entry);
  });

  // Stats
  const today = fmt(new Date().toISOString());
  const todayCount = log.filter(e => fmt(e.timestamp) === today).length;
  const verifyCount = log.filter(e => e.type === "verify" || e.type === "warning" || e.type === "error").length;
  const updateCount = log.filter(e => e.type === "update").length;
  const totalSources = new Set(log.map(e => e.source)).size;

  return (
    <div style={{ padding: "36px 44px", maxWidth: 1000, fontFamily: FONT }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Audit & Change Log</h1>
      <p style={{ fontSize: 14, color: T_.textDim, marginBottom: 24, lineHeight: 1.6 }}>
        Track all changes, updates, and verification results across your entire portal. Every field edit, data verification, note, and idea is logged here.
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total Events", value: log.length, color: T_.text },
          { label: "Today", value: todayCount, color: T_.green },
          { label: "Verifications", value: verifyCount, color: T_.amber },
          { label: "Data Updates", value: updateCount, color: T_.blue },
        ].map(s => (
          <div key={s.label} style={{ background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: T_.textDim, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {/* Search */}
          <input
            style={{
              flex: 1, minWidth: 200, background: T_.bgInput, border: `1px solid ${T_.border}`,
              borderRadius: 6, color: T_.text, fontSize: 13, padding: "8px 12px", fontFamily: FONT, outline: "none",
            }}
            placeholder="Search events..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button style={{
            padding: "8px 16px", fontSize: 12, borderRadius: 6, cursor: "pointer",
            background: T_.accent, color: "#000", border: "none", fontFamily: FONT, fontWeight: 500,
          }} onClick={refreshLog}>Refresh</button>
          <button style={{
            padding: "8px 16px", fontSize: 12, borderRadius: 6, cursor: "pointer",
            background: "transparent", color: T_.red, border: `1px solid ${T_.red}44`, fontFamily: FONT,
          }} onClick={clearLog}>Clear All</button>
        </div>

        {/* Type filter */}
        <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: T_.textGhost, paddingTop: 4 }}>Type:</span>
          {types.map(t => (
            <span key={t} style={{
              padding: "4px 12px", fontSize: 11, borderRadius: 5, cursor: "pointer", fontFamily: FONT,
              background: filter === t ? T_.amberBg : "transparent",
              color: filter === t ? T_.amber : T_.textGhost,
              border: `1px solid ${filter === t ? T_.amberBorder : T_.border}`,
            }} onClick={() => setFilter(t)}>
              {TYPE_ICONS[t] || ""} {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            </span>
          ))}
        </div>

        {/* Source filter */}
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: T_.textGhost, paddingTop: 4 }}>Source:</span>
          {sources.map(s => {
            const sc = SOURCE_COLORS[s];
            return (
              <span key={s} style={{
                padding: "4px 12px", fontSize: 11, borderRadius: 5, cursor: "pointer", fontFamily: FONT,
                background: sourceFilter === s ? (sc?.bg || T_.amberBg) : "transparent",
                color: sourceFilter === s ? (sc?.color || T_.amber) : T_.textGhost,
                border: `1px solid ${sourceFilter === s ? (sc?.border || T_.amberBorder) : T_.border}`,
              }} onClick={() => setSourceFilter(s)}>
                {s === "all" ? "All Sources" : s}
              </span>
            );
          })}
        </div>
      </div>

      {/* Log entries grouped by date */}
      {Object.keys(grouped).length === 0 && (
        <div style={{ color: T_.textDim, fontSize: 14, textAlign: "center", padding: "40px 0" }}>
          No events logged yet. Changes will appear here as you use the portal.
        </div>
      )}

      {Object.entries(grouped).map(([day, entries]) => (
        <div key={day} style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: day === today ? T_.green : T_.textGhost,
            textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8,
            padding: "6px 0", borderBottom: `1px solid ${T_.borderLight}`,
          }}>
            {day === today ? "Today" : day} — {entries.length} event{entries.length !== 1 ? "s" : ""}
          </div>

          {entries.map(entry => {
            const sc = SOURCE_COLORS[entry.source] || SOURCE_COLORS["System"];
            const expanded = expandedId === entry.id;

            return (
              <div key={entry.id} style={{
                background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 8,
                padding: "12px 16px", marginBottom: 6, cursor: "pointer",
                borderLeft: `3px solid ${sc.color}`,
              }} onClick={() => setExpandedId(expanded ? null : entry.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{TYPE_ICONS[entry.type] || "\uD83D\uDD35"}</span>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 4, fontFamily: FONT, flexShrink: 0,
                    background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                  }}>{entry.source}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: T_.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {entry.title}
                  </span>
                  {entry.score != null && (
                    <span style={{ fontSize: 12, fontWeight: 500, color: entry.score >= 80 ? T_.green : entry.score >= 50 ? T_.amber : T_.red }}>
                      {entry.score}/100
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: T_.textGhost, flexShrink: 0 }}>
                    {fmtTime(entry.timestamp)}
                  </span>
                </div>

                {expanded && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T_.borderLight}` }}>
                    {entry.detail && (
                      <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6, whiteSpace: "pre-wrap", marginBottom: 8 }}>
                        {entry.detail}
                      </div>
                    )}
                    {entry.tags?.length > 0 && (
                      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                        {entry.tags.map(tag => (
                          <span key={tag} style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, background: T_.grayBadge, color: T_.grayBadgeText }}>{tag}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: T_.textGhost }}>
                      {fmtFull(entry.timestamp)} — ID: {entry.id}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
