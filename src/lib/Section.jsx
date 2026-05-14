import { T_ } from "./theme";

// ─── Helper: Section Card ───
// `compact` shrinks padding, margin, and title size for dense reference pages.
export function Section({ title, subtitle, color, children, compact = false }) {
  const padding = compact ? 16 : 24;
  const cardMarginBottom = compact ? 12 : 24;
  const titleSize = compact ? 15 : 18;
  const titleMarginBottom = compact ? (subtitle ? 4 : 8) : (subtitle ? 6 : 16);
  const subtitleSize = compact ? 12 : 13;
  const subtitleMarginBottom = compact ? 10 : 20;
  return (
    <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding, marginBottom: cardMarginBottom }}>
      <div style={{ fontSize: titleSize, fontWeight: 600, color: color || T_.text, marginBottom: titleMarginBottom }}>{title}</div>
      {subtitle && <div style={{ fontSize: subtitleSize, color: T_.textDim, marginBottom: subtitleMarginBottom }}>{subtitle}</div>}
      {children}
    </div>
  );
}
