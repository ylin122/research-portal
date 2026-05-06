import { T_, FONT } from "./theme";

// Unified solid-style sub-tab nav. Replaces the inline-styled
// "8px 22px, T_.blue active" pattern that drifted across 8+ files.
//
// Props:
//   tabs:     [{ key, label, color? }]  — color overrides T_.blue for active bg (per-tab accent)
//   active:   the active key
//   onChange: (key) => void
//   size:     "sm" (default, 13pt) | "lg" (16pt) — matches the two pre-existing sizes
//   trailing:    optional React node rendered inside the bordered wrapper after the tabs
//                (used by ProductPrimer's "more products coming" hint)
//   marginBottom: override the default 24px wrapper margin (CreditInstruments stacks
//                 multiple TabBars per category and uses 0 here)
export default function TabBar({ tabs, active, onChange, size = "sm", trailing = null, marginBottom = 24 }) {
  const fontSize = size === "lg" ? 16 : 13;
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 0,
      borderRadius: 8,
      overflow: "hidden",
      border: `1px solid ${T_.border}`,
      marginBottom,
      width: "fit-content",
      maxWidth: "100%",
    }}>
      {tabs.map(t => {
        const isActive = active === t.key;
        const accent = t.color || T_.blue;
        return (
          <button key={t.key} onClick={() => onChange(t.key)} style={{
            padding: "8px 22px",
            fontSize,
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
            background: isActive ? accent : T_.bgPanel,
            color: isActive ? "#FFF" : T_.textDim,
            fontFamily: FONT,
            transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}>{t.label}</button>
        );
      })}
      {trailing}
    </div>
  );
}
