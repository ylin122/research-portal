import React, { useState, useEffect } from "react";
import { T_, FONT } from "./lib/theme";

const s = {
  card: { background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 0, overflow: "hidden" },
};

const fmtB = (v) => v == null ? '\u2014' : (Math.abs(v) >= 1e9 ? `$${(v / 1e9).toFixed(1)}B` : `$${(v / 1e6).toFixed(0)}M`);
const fmtPct = (v) => v == null ? '\u2014' : `${v.toFixed(1)}%`;
const fmtPe = (v) => v == null ? '\u2014' : `${v.toFixed(1)}x`;

const ROWS = [
  { label: 'Revenue', key: 'revenue', fmt: fmtB },
  { label: 'Y/Y Growth', key: 'revenueGrowth', fmt: fmtPct, indent: true },
  { label: 'Gross Profit', key: 'grossProfit', fmt: fmtB },
  { label: 'Gross Margin', key: 'grossMargin', fmt: fmtPct, indent: true },
  { label: 'EBIT', key: 'ebit', fmt: fmtB },
  { label: 'EBIT Margin', key: 'ebitMargin', fmt: fmtPct, indent: true },
  { label: 'Net Income', key: 'netIncome', fmt: fmtB },
  { label: 'P/E', key: 'pe', fmt: fmtPe, computePe: true },
  { label: 'Capex', key: 'capex', fmt: fmtB },
  { label: 'GAAP FCF', key: 'fcf', fmt: fmtB },
  { label: 'Cash on B/S', key: 'cash', fmt: fmtB },
];

export default function FinancialsTab({ ticker }) {
  const [finData, setFinData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load from cache on mount (no refresh)
  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    fetch(`/api/financials?symbol=${encodeURIComponent(ticker)}`)
      .then(r => r.json())
      .then(d => { setFinData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ticker]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetch(`/api/financials?symbol=${encodeURIComponent(ticker)}&refresh=true`)
      .then(r => r.json())
      .then(d => { setFinData(d); setRefreshing(false); })
      .catch(() => setRefreshing(false));
  };

  const periods = finData?.periods || [];
  const meta = finData?.meta || {};
  const sharesOut = meta.sharesOutstanding;
  const currentPrice = meta.price;

  const cellSt = { padding: '10px 16px', textAlign: 'right', fontSize: 13, borderBottom: '1px solid #1E293B', fontFamily: FONT };
  const hdrSt = { ...cellSt, color: '#94A3B8', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' };
  const lblSt = { ...cellSt, textAlign: 'left', color: '#E2E8F0', fontWeight: 500 };
  const isEst = (p) => p.period?.endsWith('E');
  const fmtDate = (d) => { const [y, m, dd] = d.split('-'); return `${m}/${dd}/${y.slice(2)}`; };

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        {meta.name && <span style={{ fontSize: 15, color: '#E2E8F0', fontWeight: 600, fontFamily: FONT }}>{meta.name} ({ticker})</span>}
        {meta.price != null && <span style={{ fontSize: 13, color: '#94A3B8', fontFamily: FONT }}>@ ${meta.price.toFixed(2)}</span>}
        {meta.marketCap != null && <span style={{ fontSize: 13, color: '#64748B', fontFamily: FONT }}>Mkt Cap: {fmtB(meta.marketCap)}</span>}
        {meta.fiscalYearEnd && <span style={{ fontSize: 12, color: '#64748B', fontFamily: FONT }}>FY ends: {meta.fiscalYearEnd}</span>}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {finData?.cached && finData?.cachedAt && (
            <span style={{ fontSize: 11, color: '#64748B', fontFamily: FONT }}>
              Cached: {new Date(finData.cachedAt).toLocaleDateString()}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: refreshing ? 'wait' : 'pointer',
              border: '1px solid #3B82F6', background: refreshing ? '#1E293B' : 'transparent',
              color: '#3B82F6', borderRadius: 6, fontFamily: FONT,
              opacity: refreshing ? 0.6 : 1,
            }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Financials'}
          </button>
        </div>
      </div>

      {loading && <div style={{ color: '#94A3B8', fontSize: 14, padding: 40, textAlign: 'center', fontFamily: FONT }}>Loading financials...</div>}
      {finData?.error && <div style={{ color: '#EF4444', fontSize: 14, padding: 20, fontFamily: FONT }}>Error: {finData.error}</div>}

      {!loading && periods.length === 0 && !finData?.error && (
        <div style={{ color: '#94A3B8', fontSize: 14, padding: 40, textAlign: 'center', fontFamily: FONT }}>
          No cached financials. Click "Refresh Financials" to pull from Alpha Vantage.
        </div>
      )}

      {periods.length > 0 && (
        <div style={s.card}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...hdrSt, textAlign: 'left', width: 140 }}>Metric</th>
                {periods.map(p => (
                  <th key={p.period} style={{ ...hdrSt, ...(isEst(p) ? { color: '#60A5FA', fontStyle: 'italic' } : {}) }}>
                    {(() => {
                      const fd = p.fiscalDate;
                      if (p.period === 'LTM') return <>LTM{fd && <div style={{ fontSize: 10, color: '#64748B', fontWeight: 400, marginTop: 2 }}>({fmtDate(fd)})</div>}</>;
                      const shortPeriod = p.period.replace(/^FY20/, 'FY').replace(/^FY(\d{2})/, 'FY$1');
                      return <>{shortPeriod}{fd && <div style={{ fontSize: 10, color: '#64748B', fontWeight: 400, marginTop: 2 }}>({fmtDate(fd)})</div>}</>;
                    })()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(row => (
                <tr key={row.label} style={row.indent ? { background: 'rgba(30,41,59,0.3)' } : {}}>
                  <td style={{ ...lblSt, ...(row.indent ? { color: '#94A3B8', fontSize: 12, paddingLeft: 28 } : {}) }}>{row.label}</td>
                  {periods.map(p => {
                    let val = p[row.key];
                    if (row.computePe) {
                      val = p.pe != null ? p.pe : (p.netIncome && sharesOut && currentPrice && p.netIncome > 0 ? currentPrice / (p.netIncome / sharesOut) : null);
                    }
                    const display = row.fmt(val);
                    const isNeg = val != null && val < 0;
                    return (
                      <td key={p.period} style={{ ...cellSt, color: isNeg ? '#EF4444' : (isEst(p) ? '#93C5FD' : '#E2E8F0'), ...(row.indent ? { fontSize: 12 } : {}) }}>
                        {display}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '10px 16px', fontSize: 11, color: '#64748B', borderTop: '1px solid #1E293B', fontFamily: FONT }}>
            Source: Alpha Vantage | Forward estimates are analyst consensus avg | GAAP FCF = CFFO - Capex | P/E uses current price (${currentPrice?.toFixed(2) || '\u2014'})
            {finData?.timestamp && ` | Data: ${new Date(finData.timestamp).toLocaleDateString()}`}
          </div>
        </div>
      )}
    </div>
  );
}
