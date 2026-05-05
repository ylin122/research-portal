import { T_, FONT } from "./theme";

// Show the most recent created_at/updated_at across a list of records.
// Pass `rows` (array) and `field` (the column name to read).
export default function LastUpdated({ rows, field = "created_at", label = "Last updated" }) {
  if (!rows || rows.length === 0) return null;
  let latest = null;
  for (const r of rows) {
    const v = r[field];
    if (!v) continue;
    if (!latest || v > latest) latest = v;
  }
  if (!latest) return null;
  const d = new Date(latest);
  const text = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <span style={{ fontSize: 11, color: T_.textGhost, fontFamily: FONT }}>
      {label} {text}
    </span>
  );
}
