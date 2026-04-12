const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY || '';
const BASE = 'https://www.alphavantage.co/query';

async function fetchAV(params) {
  const url = `${BASE}?${new URLSearchParams({ ...params, apikey: API_KEY })}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`AV API error: ${res.status}`);
  return res.json();
}

export async function fetchOverview(symbol) {
  const d = await fetchAV({ function: 'OVERVIEW', symbol });
  if (d.Note || d.Information) throw new Error(d.Note || d.Information);
  return {
    name: d.Name,
    symbol: d.Symbol,
    exchange: d.Exchange,
    sector: d.Sector,
    industry: d.Industry,
    marketCap: fmt$(d.MarketCapitalization),
    peRatio: num(d.PERatio),
    forwardPE: num(d.ForwardPE),
    eps: num(d.EPS),
    revenuePerShare: num(d.RevenuePerShareTTM),
    revenueTTM: fmt$(d.RevenueTTM),
    grossProfitTTM: fmt$(d.GrossProfitTTM),
    ebitda: fmt$(d.EBITDA),
    profitMargin: pct(d.ProfitMargin),
    operatingMargin: pct(d.OperatingMarginTTM),
    returnOnEquity: pct(d.ReturnOnEquityTTM),
    returnOnAssets: pct(d.ReturnOnAssetsTTM),
    beta: num(d.Beta),
    week52High: num(d['52WeekHigh']),
    week52Low: num(d['52WeekLow']),
    movingAvg50: num(d['50DayMovingAverage']),
    movingAvg200: num(d['200DayMovingAverage']),
    dividendYield: pct(d.DividendYield),
    dividendPerShare: num(d.DividendPerShare),
    analystTarget: num(d.AnalystTargetPrice),
    analystRatingStrongBuy: int(d.AnalystRatingStrongBuy),
    analystRatingBuy: int(d.AnalystRatingBuy),
    analystRatingHold: int(d.AnalystRatingHold),
    analystRatingSell: int(d.AnalystRatingSell),
    analystRatingStrongSell: int(d.AnalystRatingStrongSell),
    evToRevenue: num(d.EVToRevenue),
    evToEBITDA: num(d.EVToEBITDA),
    priceToBook: num(d.PriceToBookRatio),
    priceToSales: num(d.PriceToSalesRatioTTM),
    quarterlyEarningsGrowth: pct(d.QuarterlyEarningsGrowthYOY),
    quarterlyRevenueGrowth: pct(d.QuarterlyRevenueGrowthYOY),
    sharesOutstanding: fmt$(d.SharesOutstanding),
    _raw: d,
  };
}

export async function fetchIncomeStatement(symbol) {
  const d = await fetchAV({ function: 'INCOME_STATEMENT', symbol });
  if (d.Note || d.Information) throw new Error(d.Note || d.Information);
  return {
    annual: (d.annualReports || []).slice(0, 5).map(r => ({
      date: r.fiscalDateEnding,
      revenue: fmt$(r.totalRevenue),
      grossProfit: fmt$(r.grossProfit),
      operatingIncome: fmt$(r.operatingIncome),
      netIncome: fmt$(r.netIncome),
      ebitda: fmt$(r.ebitda),
      _raw: r,
    })),
    quarterly: (d.quarterlyReports || []).slice(0, 8).map(r => ({
      date: r.fiscalDateEnding,
      revenue: fmt$(r.totalRevenue),
      grossProfit: fmt$(r.grossProfit),
      operatingIncome: fmt$(r.operatingIncome),
      netIncome: fmt$(r.netIncome),
      ebitda: fmt$(r.ebitda),
      _raw: r,
    })),
  };
}

export async function fetchBalanceSheet(symbol) {
  const d = await fetchAV({ function: 'BALANCE_SHEET', symbol });
  if (d.Note || d.Information) throw new Error(d.Note || d.Information);
  return {
    annual: (d.annualReports || []).slice(0, 5).map(r => ({
      date: r.fiscalDateEnding,
      totalAssets: fmt$(r.totalAssets),
      totalDebt: fmt$(r.shortLongTermDebtTotal || r.longTermDebt),
      totalLiabilities: fmt$(r.totalLiabilities),
      totalEquity: fmt$(r.totalShareholderEquity),
      cash: fmt$(r.cashAndCashEquivalentsAtCarryingValue),
      currentAssets: fmt$(r.totalCurrentAssets),
      currentLiabilities: fmt$(r.totalCurrentLiabilities),
      _raw: r,
    })),
  };
}

export async function fetchCashFlow(symbol) {
  const d = await fetchAV({ function: 'CASH_FLOW', symbol });
  if (d.Note || d.Information) throw new Error(d.Note || d.Information);
  return {
    annual: (d.annualReports || []).slice(0, 5).map(r => ({
      date: r.fiscalDateEnding,
      operatingCF: fmt$(r.operatingCashflow),
      capex: fmt$(r.capitalExpenditures),
      fcf: fmt$(sub(r.operatingCashflow, r.capitalExpenditures)),
      dividendsPaid: fmt$(r.dividendPayout),
      shareRepurchase: fmt$(r.commonStockRepurchased),
      _raw: r,
    })),
  };
}

export async function fetchEarnings(symbol) {
  const d = await fetchAV({ function: 'EARNINGS', symbol });
  if (d.Note || d.Information) throw new Error(d.Note || d.Information);
  return {
    annual: (d.annualEarnings || []).slice(0, 5),
    quarterly: (d.quarterlyEarnings || []).slice(0, 12),
  };
}

// Helpers
function num(v) { const n = parseFloat(v); return isNaN(n) ? null : n; }
function int(v) { const n = parseInt(v); return isNaN(n) ? null : n; }
function pct(v) { const n = parseFloat(v); return isNaN(n) ? null : (n * (Math.abs(n) < 1 ? 100 : 1)).toFixed(1) + '%'; }
function sub(a, b) { const na = parseFloat(a), nb = parseFloat(b); return isNaN(na) || isNaN(nb) ? null : String(na - nb); }
function fmt$(v) {
  const n = parseFloat(v);
  if (isNaN(n) || v === 'None' || !v) return null;
  const abs = Math.abs(n);
  if (abs >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (abs >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (abs >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toFixed(2);
}
