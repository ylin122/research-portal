import { T_ } from "./theme";

/* ═══════════════════════════════════════════════════════
   ORG CHART PRIMITIVES — bond-prospectus style
   ═══════════════════════════════════════════════════════ */

// Vertical line connector
export function VLine({ h = 28, color, dashed }) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 0, height: h, borderLeft: `2px ${dashed ? "dashed" : "solid"} ${color || T_.border}` }} />
    </div>
  );
}

// Label on the connector
export function VLineLabel({ label, color, h = 36 }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: h }}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 0, height: h / 2 - 8, borderLeft: `2px solid ${color || T_.border}` }} />
        <span style={{ fontSize: 9, color: color || T_.textGhost, background: T_.bg, padding: "0 6px", whiteSpace: "nowrap" }}>{label}</span>
        <div style={{ width: 0, height: h / 2 - 8, borderLeft: `2px solid ${color || T_.border}` }} />
      </div>
    </div>
  );
}

// Detail flyout
export function DetailPanel({ title, onClose, children }) {
  return (
    <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.accent}40`, padding: "16px 20px", marginTop: 16, marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T_.accent }}>{title}</div>
        <span onClick={onClose} style={{ fontSize: 11, color: T_.textGhost, cursor: "pointer", padding: "2px 8px" }}>✕</span>
      </div>
      <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.9 }}>{children}</div>
    </div>
  );
}

// Entity box — the core building block
export function Box({ label, sub, color, borderColor, badges, debt, selected, onClick, dashed, width }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? `${color}10` : T_.bgPanel,
        border: `2px ${dashed ? "dashed" : "solid"} ${selected ? color : (borderColor || color || T_.border)}`,
        borderRadius: 8, padding: "12px 16px",
        cursor: onClick ? "pointer" : "default",
        width: width || "auto",
        transition: "border-color .15s, background .15s",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: color || T_.text, lineHeight: 1.3 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: T_.textDim, marginTop: 3, lineHeight: 1.4 }}>{sub}</div>}
      {badges && (
        <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
          {badges.map((b, i) => (
            <span key={i} style={{ fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 3, background: `${b.color}18`, color: b.color }}>{b.text}</span>
          ))}
        </div>
      )}
      {debt && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
          {debt.map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, padding: "3px 6px", borderRadius: 3, background: `${d.color}10`, border: `1px solid ${d.color}25` }}>
              <span style={{ color: T_.textMid, flex: 1 }}>{d.name}</span>
              <span style={{ color: d.color, fontWeight: 700, marginLeft: 8 }}>{d.amount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
