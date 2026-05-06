import { T_ } from "./theme";

// ─── Helper: Section Card ───
export function Section({ title, subtitle, color, children }) {
  return (
    <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: color || T_.text, marginBottom: subtitle ? 6 : 16 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>{subtitle}</div>}
      {children}
    </div>
  );
}
