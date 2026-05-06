import { useState, useEffect } from "react";
import { T_, FONT } from "./lib/theme";
import { supabase } from "./lib/supabase";

async function authedFetch(url) {
  const { data: { session } } = await supabase.auth.getSession();
  return fetch(url, {
    headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
  });
}

// ── Number formatting — negatives as (parentheses), matching portal style ──
const fmtB = (v) => {
  if (v == null) return '\u2014';
  const abs = Math.abs(v);
  const str = abs >= 1e9 ? `$${(abs / 1e9).toFixed(1)}B` : abs >= 1e6 ? `$${(abs / 1e6).toFixed(0)}M` : `$${(abs / 1e3).toFixed(0)}K`;
  return v < 0 ? `(${str})` : str;
};
const fmtPct = (v) => v == null ? '\u2014' : v < 0 ? `(${Math.abs(v).toFixed(1)}%)` : `${v.toFixed(1)}%`;
const fmtX = (v) => v == null ? '\u2014' : `${v.toFixed(1)}x`;
const fmtNum = (v) => v == null ? '\u2014' : v < 0 ? `(${Math.abs(v).toFixed(2)})` : v.toFixed(2);

const s = {
  card: { background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: 20, marginBottom: 16 },
  sectionHdr: { fontSize: 14, fontWeight: 600, color: T_.textDim, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${T_.borderLight}`, fontFamily: FONT },
  prose: { fontSize: 14, lineHeight: 1.9, color: T_.text, whiteSpace: "pre-wrap", fontFamily: FONT },
  metricCard: { flex: "1 1 130px", minWidth: 130, background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "10px 14px" },
  metricLabel: { fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3, fontFamily: FONT },
  metricValue: { fontSize: 16, fontWeight: 700, color: "#F8FAFC", fontFamily: FONT },
  inputRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  inputLabel: { fontSize: 13, color: T_.textDim, fontWeight: 500, minWidth: 120, fontFamily: FONT },
  input: { background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "6px 10px", color: "#E2E8F0", fontSize: 13, fontFamily: FONT, width: 140, textAlign: "right" },
  textarea: { width: "100%", background: "#0B0F19", border: `1px solid ${T_.border}`, borderRadius: 8, padding: "14px 16px", fontSize: 14, color: T_.text, outline: "none", fontFamily: FONT, resize: "vertical", minHeight: 110, lineHeight: 1.8, boxSizing: "border-box" },
  btnRefresh: { padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid #3B82F6", background: "transparent", color: "#3B82F6", borderRadius: 6, fontFamily: FONT },
};

// Generate prose paragraph for a fiscal year
function fyProse(p) {
  if (!p) return '';
  const parts = [];
  const fy = p.period;
  const dateStr = p.fiscalDate ? ` (ended ${p.fiscalDate.slice(5).replace('-', '/')})` : '';

  if (p.revenue != null) {
    let revStr = `${fy}${dateStr}: Revenue of ${fmtB(p.revenue)}`;
    if (p.revenueGrowth != null) revStr += `, ${p.revenueGrowth > 0 ? 'up' : 'down'} ${fmtPct(Math.abs(p.revenueGrowth))} Y/Y`;
    parts.push(revStr + '.');
  }
  if (p.grossMargin != null) parts.push(`Gross margin ${fmtPct(p.grossMargin)}.`);
  if (p.ebit != null) {
    let ebitStr = `EBIT ${fmtB(p.ebit)}`;
    if (p.ebitMargin != null) ebitStr += ` (${fmtPct(p.ebitMargin)} margin)`;
    parts.push(ebitStr + '.');
  }
  if (p.netIncome != null) parts.push(`Net income ${fmtB(p.netIncome)}.`);
  if (p.fcf != null) {
    let fcfStr = `FCF ${fmtB(p.fcf)}`;
    if (p.cffo != null && p.capex != null) fcfStr += ` (CFFO ${fmtB(p.cffo)} less capex ${fmtB(p.capex)})`;
    parts.push(fcfStr + '.');
  } else if (p.capex != null) {
    parts.push(`Capex ${fmtB(p.capex)}.`);
  }
  if (p.cash != null) parts.push(`Cash on B/S: ${fmtB(p.cash)}.`);

  return parts.join(' ');
}

// Forward estimate field keys
const FWD_FIELDS = [
  { key: 'revenue', label: 'Revenue ($M)', parse: (v) => v * 1e6 },
  { key: 'grossProfit', label: 'Gross Profit ($M)', parse: (v) => v * 1e6 },
  { key: 'ebit', label: 'EBIT ($M)', parse: (v) => v * 1e6 },
  { key: 'netIncome', label: 'Net Income ($M)', parse: (v) => v * 1e6 },
  { key: 'eps', label: 'EPS ($)', parse: (v) => v },
  { key: 'capex', label: 'Capex ($M)', parse: (v) => v * 1e6 },
];

export default function FinancialsTab({ ticker, companyId, companyName, curFields, updateField }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load cached data on mount (only for companies with a ticker)
  useEffect(() => {
    if (!ticker) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: fetch + setState on ticker change
    setLoading(true);
    authedFetch(`/api/financials?symbol=${encodeURIComponent(ticker)}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ticker]);

  const handleRefresh = () => {
    if (!ticker) return;
    setRefreshing(true);
    authedFetch(`/api/financials?symbol=${encodeURIComponent(ticker)}&refresh=true`)
      .then(r => r.json())
      .then(d => { setData(d); setRefreshing(false); })
      .catch(() => setRefreshing(false));
  };

  const meta = data?.meta || {};
  const ttm = data?.ttm || {};
  const historical = data?.historical || [];

  // Read forward estimates from curFields
  const getFwd = (year, field) => {
    const key = `fin_fwd_${year}_${field}`;
    return curFields?.[key]?.text || '';
  };
  const setFwd = (year, field, val) => {
    const key = `fin_fwd_${year}_${field}`;
    updateField(companyId, key, val);
  };

  // Manual financials prose for private companies
  const manualProse = curFields?.fin_manual_prose?.text || '';

  // Compute forward ratios
  const computeFwdPE = (year) => {
    const eps = parseFloat(getFwd(year, 'eps'));
    if (!eps || !meta.price) return null;
    return meta.price / eps;
  };

  // Determine forward year labels from the latest historical period
  const latestFY = historical.length ? historical[historical.length - 1] : null;
  const latestYear = latestFY ? parseInt(latestFY.fiscalDate?.slice(0, 4)) : new Date().getFullYear();
  const fwdYear1 = `FY${latestYear + 1}`;
  const fwdYear2 = `FY${latestYear + 2}`;

  const isPublic = !!ticker;
  const negColor = (v) => v != null && v < 0 ? T_.red : "#F8FAFC";

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#F8FAFC", fontFamily: FONT }}>
          {meta.name || companyName || 'Financials'}
          {ticker && <span style={{ color: T_.textDim, fontWeight: 400 }}> ({ticker})</span>}
        </span>
        {meta.price != null && (
          <span style={{ fontSize: 14, color: T_.textMid, fontFamily: FONT }}>
            ${meta.price.toFixed(2)}
            {meta.change1d != null && (
              <span style={{ color: meta.change1d >= 0 ? T_.green : T_.red, marginLeft: 6 }}>
                {meta.change1d >= 0 ? '+' : ''}{meta.change1d.toFixed(2)}%
              </span>
            )}
          </span>
        )}
        {meta.marketCap != null && <span style={{ fontSize: 13, color: T_.textGhost, fontFamily: FONT }}>Mkt Cap: {fmtB(meta.marketCap)}</span>}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {data?.cached && data?.cachedAt && (
            <span style={{ fontSize: 11, color: T_.textGhost, fontFamily: FONT }}>
              Cached: {new Date(data.cachedAt).toLocaleDateString()}
            </span>
          )}
          {isPublic && (
            <button onClick={handleRefresh} disabled={refreshing}
              style={{ ...s.btnRefresh, opacity: refreshing ? 0.5 : 1, cursor: refreshing ? 'wait' : 'pointer' }}>
              {refreshing ? 'Refreshing...' : 'Refresh Financials'}
            </button>
          )}
        </div>
      </div>

      {loading && <div style={{ color: T_.textDim, fontSize: 14, padding: 40, textAlign: "center", fontFamily: FONT }}>Loading financials...</div>}
      {data?.error && <div style={{ color: T_.red, fontSize: 14, padding: 20, fontFamily: FONT }}>Error: {data.error}</div>}

      {/* ── Key Ratios ── */}
      {(meta.price || ttm.revenue) && (
        <div style={s.card}>
          <div style={s.sectionHdr}>Key Metrics</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "Trailing P/E", value: meta.trailingPE, fmt: fmtX },
              { label: "Forward P/E", value: meta.forwardPE, fmt: fmtX },
              { label: "PEG Ratio", value: meta.pegRatio, fmt: fmtX },
              { label: "LTM EPS", value: meta.ltmEps, fmt: fmtNum },
              { label: "Fwd EPS", value: meta.fwdEps, fmt: fmtNum },
              { label: "Gross Margin", value: ttm.grossMargin, fmt: fmtPct },
              { label: "Op Margin", value: ttm.operatingMargin, fmt: fmtPct },
              { label: "Rev Growth", value: ttm.revenueGrowth, fmt: fmtPct },
              { label: "TTM FCF", value: ttm.fcf, fmt: fmtB },
              { label: "Beta", value: meta.beta, fmt: (v) => v == null ? '\u2014' : v.toFixed(2) },
            ].filter(m => m.value != null).map(m => (
              <div key={m.label} style={s.metricCard}>
                <div style={s.metricLabel}>{m.label}</div>
                <div style={{ ...s.metricValue, color: negColor(m.value) }}>{m.fmt(m.value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Historical Financials (Prose) — public companies ── */}
      {isPublic && historical.length > 0 && (
        <div style={s.card}>
          <div style={s.sectionHdr}>Historical Financials (SEC EDGAR)</div>
          {historical.map(p => (
            <div key={p.period} style={{ marginBottom: 14 }}>
              <div style={s.prose}>{fyProse(p)}</div>
            </div>
          ))}
          {data?.timestamp && (
            <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 8, fontFamily: FONT }}>
              Source: SEC EDGAR (10-K filings) + Yahoo Finance | Data as of {new Date(data.timestamp).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {/* ── TTM Summary — public companies ── */}
      {isPublic && ttm.revenue && (
        <div style={s.card}>
          <div style={s.sectionHdr}>Trailing Twelve Months (Yahoo Finance)</div>
          <div style={s.prose}>
            {[
              ttm.revenue ? `TTM Revenue: ${fmtB(ttm.revenue)}` : null,
              ttm.revenueGrowth != null ? `(${ttm.revenueGrowth > 0 ? '+' : ''}${fmtPct(ttm.revenueGrowth)} Y/Y)` : null,
            ].filter(Boolean).join(' ')}
            {'. '}
            {[
              ttm.grossMargin != null ? `Gross margin ${fmtPct(ttm.grossMargin)}` : null,
              ttm.operatingMargin != null ? `Operating margin ${fmtPct(ttm.operatingMargin)}` : null,
              ttm.fcf != null ? `FCF ${fmtB(ttm.fcf)}` : null,
              meta.ltmEps != null ? `EPS $${meta.ltmEps.toFixed(2)}` : null,
            ].filter(Boolean).join('. ')}.
          </div>
        </div>
      )}

      {/* ── Manual Financials (Private companies) ── */}
      {!isPublic && (
        <div style={s.card}>
          <div style={s.sectionHdr}>Financials & Metrics</div>
          <textarea
            style={s.textarea}
            rows={8}
            value={manualProse}
            onChange={e => updateField(companyId, 'fin_manual_prose', e.target.value)}
            placeholder="Revenue, growth, margins, ARR/MRR, headcount, unit economics, burn rate, profitability, funding, debt profile..."
          />
        </div>
      )}

      {/* ── Forward Estimates (Editable) ── */}
      <div style={s.card}>
        <div style={s.sectionHdr}>Forward Estimates {isPublic ? '(Editable)' : ''}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[fwdYear1, fwdYear2].map(year => (
            <div key={year}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#60A5FA", marginBottom: 12, fontFamily: FONT }}>{year}E</div>
              {FWD_FIELDS.map(f => (
                <div key={f.key} style={s.inputRow}>
                  <span style={s.inputLabel}>{f.label}</span>
                  <input
                    style={s.input}
                    type="text"
                    value={getFwd(year, f.key)}
                    onChange={e => setFwd(year, f.key, e.target.value)}
                    placeholder="\u2014"
                  />
                </div>
              ))}
              {/* Auto-calculated forward P/E */}
              {meta.price && getFwd(year, 'eps') && (
                <div style={s.inputRow}>
                  <span style={s.inputLabel}>Implied P/E</span>
                  <span style={{ ...s.input, background: "transparent", border: "none", color: "#60A5FA" }}>
                    {fmtX(computeFwdPE(year))}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        {isPublic && meta.fwdEps && (
          <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 12, fontFamily: FONT }}>
            Yahoo consensus: Fwd EPS ${meta.fwdEps?.toFixed(2)} (current year){meta.fwdEpsNextYear ? `, $${meta.fwdEpsNextYear.toFixed(2)} (next year)` : ''}
          </div>
        )}
      </div>

      {/* ── 52-Week Range ── */}
      {meta.fiftyTwoWeekLow != null && meta.fiftyTwoWeekHigh != null && meta.price != null && (
        <div style={{ ...s.card, padding: "14px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: T_.textGhost, fontFamily: FONT }}>52-Week Range</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: T_.textDim, fontFamily: FONT }}>${meta.fiftyTwoWeekLow.toFixed(2)}</span>
            <div style={{ flex: 1, height: 4, background: "#1E293B", borderRadius: 2, position: "relative" }}>
              <div style={{
                position: "absolute", left: `${((meta.price - meta.fiftyTwoWeekLow) / (meta.fiftyTwoWeekHigh - meta.fiftyTwoWeekLow)) * 100}%`,
                top: -4, width: 12, height: 12, background: "#3B82F6", borderRadius: "50%", transform: "translateX(-50%)",
              }} />
            </div>
            <span style={{ fontSize: 13, color: T_.textDim, fontFamily: FONT }}>${meta.fiftyTwoWeekHigh.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
