import { T_, FONT } from "./theme";

export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div style={{
      background: `${T_.red}10`, border: `1px solid ${T_.red}40`, borderRadius: 8,
      padding: "10px 14px", marginBottom: 16, fontFamily: FONT, fontSize: 13,
      color: T_.red, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    }}>
      <span>Failed to load: {message}</span>
      {onRetry && (
        <button onClick={onRetry} style={{
          background: "transparent", border: `1px solid ${T_.red}60`, color: T_.red,
          padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: FONT,
        }}>Retry</button>
      )}
    </div>
  );
}
