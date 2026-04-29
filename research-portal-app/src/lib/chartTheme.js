import { T_ } from "./theme";

// Shared Recharts styling. Use these instead of duplicating inline contentStyle.

// Dark tooltip with slate-700 border. Matches the recurring pattern across
// IndustryResearch / AIDisruption / *Review charts.
export const tooltipStyle = {
  background: "rgba(15,23,42,0.95)",
  border: `1px solid ${T_.borderStrong}`,
  borderRadius: 8,
  fontSize: 13,
  color: T_.textMid,
};

export const tooltipStyleSm = { ...tooltipStyle, fontSize: 12 };

// Default axis tick + axis line props. Pass via spread: <XAxis {...axisX} dataKey="..." />
export const axisX = {
  tick: { fill: T_.textDim, fontSize: 11 },
  axisLine: { stroke: T_.border },
  tickLine: false,
};

export const axisY = {
  tick: { fill: T_.textDim, fontSize: 11 },
  axisLine: false,
  tickLine: false,
};
