import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";
import { T_, FONT } from "./lib/theme";

const STORAGE_KEY = "research_portal_audit_log";
const VERIFICATION_KEY = "research_portal_verification";
const NOTES_IDEAS_KEY = "research_portal_notes_ideas";
const EQUITY_NOTES_KEY = "research_portal_equity_notes";
const EQUITIES_KEY = "research_portal_equities";

function loadLog() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } }
function saveLog(entries) { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }

const SOURCE_COLORS = {
  "Credit Research": { bg: "#3B82F622", color: "#3B82F6", border: "#3B82F644" },
  "Equity Research": { bg: "#10B98122", color: "#10B981", border: "#10B98144" },
  "Data Verification": { bg: "#33250822", color: T_.amber, border: "#8a5e1644" },
  "Notes / Ideas": { bg: "#8B5CF622", color: "#8B5CF6", border: "#8B5CF644" },
  "Business Models": { bg: "#F59E0B22", color: "#F59E0B", border: "#F59E0B44" },
  "Financial Instruments": { bg: "#EF444422", color: "#EF4444", border: "#EF444444" },
  "Research Wiki": { bg: "#14B8A622", color: "#14B8A6", border: "#14B8A644" },
  "Idea Tracker": { bg: "#A78BFA22", color: "#A78BFA", border: "#A78BFA44" },
  "Knowledge Base": { bg: "#FB923C22", color: "#FB923C", border: "#FB923C44" },
  "Portal": { bg: "#6EE7B722", color: "#6EE7B7", border: "#6EE7B744" },
  "Gmail Ingest": { bg: "#38BDF822", color: "#38BDF8", border: "#38BDF844" },
  "System": { bg: T_.grayBadge, color: T_.grayBadgeText, border: T_.textGhost },
};

function fmt(d) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function fmtTime(d) { return new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }

export default function AuditLog({ companies, fieldsMap, notesMap }) {
  const [log, setLog] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const fetchAll = useCallback(() => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const existing = loadLog().filter(e => e.timestamp >= twoWeeksAgo);
    const newEntries = [];

    // Scan Credit Research field updates
    if (fieldsMap) {
      Object.entries(fieldsMap).forEach(([companyId, fields]) => {
        const companyName = companies?.find(c => c.id === companyId)?.name || companyId;
        Object.entries(fields).forEach(([fieldKey, fieldData]) => {
          if (fieldData?.date && fieldData.text) {
            if (!existing.some(e => e.companyId === companyId && e.fieldKey === fieldKey && e.fieldDate === fieldData.date)) {
              newEntries.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + fieldKey, timestamp: fieldData.date, source: "Credit Research", title: `${companyName} — ${fieldKey}`, detail: fieldData.text.slice(0, 200), companyId, fieldKey, fieldDate: fieldData.date });
            }
          }
        });
      });
    }

    // Scan company notes
    if (notesMap) {
      Object.entries(notesMap).forEach(([companyId, notes]) => {
        const companyName = companies?.find(c => c.id === companyId)?.name || companyId;
        notes.forEach(note => {
          if (!existing.some(e => e.noteId === note.id)) {
            newEntries.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + note.id, timestamp: note.date, source: "Credit Research", title: `Note on ${companyName}`, detail: note.text.slice(0, 200), companyId, noteId: note.id });
          }
        });
      });
    }

    // Scan Data Verification
    try {
      const vr = JSON.parse(localStorage.getItem(VERIFICATION_KEY) || "{}");
      Object.entries(vr).forEach(([cid, r]) => {
        if (r?.date && !existing.some(e => e.verifyId === cid && e.verifyDate === r.date)) {
          newEntries.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + cid, timestamp: r.date, source: "Data Verification", title: `${r.companyName || cid} — ${r.status}`, detail: (r.issues || []).join("; ").slice(0, 300) || "No issues", verifyId: cid, verifyDate: r.date });
        }
      });
    } catch {}

    // Scan Notes/Ideas
    try {
      const ni = JSON.parse(localStorage.getItem(NOTES_IDEAS_KEY) || "[]");
      ni.forEach(entry => {
        if (!existing.some(e => e.notesIdeaId === entry.id)) {
          newEntries.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + entry.id, timestamp: entry.date, source: "Notes / Ideas", title: entry.title || entry.input?.slice(0, 60), detail: entry.analysis?.slice(0, 300) || "", notesIdeaId: entry.id });
        }
      });
    } catch {}

    // Scan Equity Research
    try {
      const en = JSON.parse(localStorage.getItem(EQUITY_NOTES_KEY) || "{}");
      const eq = JSON.parse(localStorage.getItem(EQUITIES_KEY) || "[]");
      Object.entries(en).forEach(([eqId, text]) => {
        if (text && !existing.some(e => e.equityNoteId === eqId && e.detail === text.slice(0, 200))) {
          newEntries.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + eqId, timestamp: new Date().toISOString(), source: "Equity Research", title: `${eq.find(e => e.id === eqId)?.name || eqId} — Notes updated`, detail: text.slice(0, 200), equityNoteId: eqId });
        }
      });
    } catch {}

    const recentNew = newEntries.filter(e => e.timestamp >= twoWeeksAgo);
    const local = [...recentNew, ...existing].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    saveLog(local);

    // Merge with Supabase
    supabase.from("audit_log").select("*").order("timestamp", { ascending: false }).limit(500).then(({ data }) => {
      const localIds = new Set(local.map(e => e.id));
      const cloud = (data || []).filter(e => !localIds.has(e.id)).map(e => ({
        id: e.id, timestamp: e.timestamp || e.created_at, source: e.source || "Portal", title: e.title, detail: e.detail,
      }));
      setLog([...local, ...cloud].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    });
  }, [companies, fieldsMap, notesMap]);

  // Initial load
  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  function clearLog() {
    saveLog([]);
    supabase.from("audit_log").delete().neq("id", "").then(() => setLog([]));
  }

  // Group by date
  const today = fmt(new Date().toISOString());
  const grouped = {};
  log.forEach(entry => {
    const day = fmt(entry.timestamp);
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(entry);
  });

  return (
    <div style={{ padding: "36px 44px", maxWidth: "none", fontFamily: FONT }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Audit Log</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{
            padding: "8px 16px", fontSize: 12, borderRadius: 6, cursor: "pointer",
            background: T_.accent, color: "#000", border: "none", fontFamily: FONT, fontWeight: 500,
          }} onClick={fetchAll}>Refresh</button>
          <button style={{
            padding: "8px 16px", fontSize: 12, borderRadius: 6, cursor: "pointer",
            background: "transparent", color: T_.red, border: `1px solid ${T_.red}44`, fontFamily: FONT,
          }} onClick={clearLog}>Clear All</button>
        </div>
      </div>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 24, lineHeight: 1.6 }}>
        All portal changes, data updates, and events. Auto-refreshes every 30 seconds.
        <span style={{ color: T_.textGhost, marginLeft: 8 }}>{log.length} events</span>
      </p>

      {/* Log entries grouped by date */}
      {Object.keys(grouped).length === 0 && (
        <div style={{ color: T_.textDim, fontSize: 14, textAlign: "center", padding: "40px 0" }}>
          No events logged yet.
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
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 4, fontFamily: FONT, flexShrink: 0,
                    background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                  }}>{entry.source}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: T_.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {entry.title}
                  </span>
                  <span style={{ fontSize: 11, color: T_.textGhost, flexShrink: 0 }}>
                    {fmtTime(entry.timestamp)}
                  </span>
                </div>

                {expanded && entry.detail && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T_.borderLight}` }}>
                    <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {entry.detail}
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
