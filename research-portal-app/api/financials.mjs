import { createClient } from '@supabase/supabase-js';

const AV_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE = 'https://www.alphavantage.co/query';
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function avFetch(fn, symbol) {
  const url = `${BASE}?function=${fn}&symbol=${symbol}&apikey=${AV_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`AV ${fn} failed: ${res.status}`);
  const data = await res.json();
  if (data.Note || data.Information) throw new Error(`AV rate limited on ${fn}: ${data.Note || data.Information}`);
  return data;
}

const delay = (ms) => new Promise(r => setTimeout(r, ms));

function num(v) {
  if (v === undefined || v === null || v === 'None' || v === '') return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function sumQ(quarters, field) {
  const vals = quarters.map(q => num(q[field]));
  if (vals.some(v => v === null)) return null;
  return vals.reduce((a, b) => a + b, 0);
}

function pctChg(curr, prev) {
  if (curr == null || prev == null || prev === 0) return null;
  return ((curr - prev) / Math.abs(prev)) * 100;
}

async function fetchFromAlphaVantage(symbol) {
  const income = await avFetch('INCOME_STATEMENT', symbol);
  await delay(1500);
  const cashflow = await avFetch('CASH_FLOW', symbol);
  await delay(1500);
  const balance = await avFetch('BALANCE_SHEET', symbol);
  await delay(1500);
  const overview = await avFetch('OVERVIEW', symbol);
  await delay(1500);
  const estimates = await avFetch('EARNINGS_ESTIMATES', symbol);

  // --- Annual data ---
  const annualIncome = (income.annualReports || []).slice(0, 4);
  const annualCF = (cashflow.annualReports || []).slice(0, 4);
  const annualBS = (balance.annualReports || []).slice(0, 4);
  const cfByDate = Object.fromEntries(annualCF.map(r => [r.fiscalDateEnding, r]));
  const bsByDate = Object.fromEntries(annualBS.map(r => [r.fiscalDateEnding, r]));

  const annualPeriods = annualIncome.slice(0, 3).map((inc, i) => {
    const fy = inc.fiscalDateEnding;
    const cf = cfByDate[fy] || {};
    const bs = bsByDate[fy] || {};
    const prevInc = annualIncome[i + 1];
    const revenue = num(inc.totalRevenue);
    const grossProfit = num(inc.grossProfit);
    const ebit = num(inc.ebit) ?? num(inc.operatingIncome);
    const netIncome = num(inc.netIncome);
    const capex = num(cf.capitalExpenditures);
    const cffo = num(cf.operatingCashflow);
    const cash = num(bs.cashAndCashEquivalentsAtCarryingValue) ?? num(bs.cashAndShortTermInvestments);
    const prevRevenue = prevInc ? num(prevInc.totalRevenue) : null;
    return {
      period: `FY${fy.slice(0, 4)}`, fiscalDate: fy, revenue,
      revenueGrowth: pctChg(revenue, prevRevenue), grossProfit,
      grossMargin: revenue ? (grossProfit / revenue) * 100 : null,
      ebit, ebitMargin: revenue ? (ebit / revenue) * 100 : null,
      netIncome, pe: null, capex,
      fcf: cffo != null && capex != null ? cffo - capex : null, cash,
    };
  }).reverse();

  // --- LTM ---
  const qIncome = (income.quarterlyReports || []).slice(0, 4);
  const qCF = (cashflow.quarterlyReports || []).slice(0, 4);
  const qBS = (balance.quarterlyReports || []).slice(0, 1);
  const prevQIncome = (income.quarterlyReports || []).slice(4, 8);
  const ltmRevenue = sumQ(qIncome, 'totalRevenue');
  const ltmGrossProfit = sumQ(qIncome, 'grossProfit');
  const ltmEbit = sumQ(qIncome, 'ebit') ?? sumQ(qIncome, 'operatingIncome');
  const ltmNetIncome = sumQ(qIncome, 'netIncome');
  const ltmCffo = sumQ(qCF, 'operatingCashflow');
  const ltmCapex = sumQ(qCF, 'capitalExpenditures');
  const ltmCash = qBS[0] ? (num(qBS[0].cashAndCashEquivalentsAtCarryingValue) ?? num(qBS[0].cashAndShortTermInvestments)) : null;
  const ltm = {
    period: 'LTM', fiscalDate: qIncome[0]?.fiscalDateEnding || '',
    quartersCovered: `${qIncome[3]?.fiscalDateEnding || ''} to ${qIncome[0]?.fiscalDateEnding || ''}`,
    revenue: ltmRevenue,
    revenueGrowth: pctChg(ltmRevenue, prevQIncome.length === 4 ? sumQ(prevQIncome, 'totalRevenue') : null),
    grossProfit: ltmGrossProfit,
    grossMargin: ltmRevenue ? (ltmGrossProfit / ltmRevenue) * 100 : null,
    ebit: ltmEbit, ebitMargin: ltmRevenue ? (ltmEbit / ltmRevenue) * 100 : null,
    netIncome: ltmNetIncome, pe: null, capex: ltmCapex,
    fcf: ltmCffo != null && ltmCapex != null ? ltmCffo - ltmCapex : null, cash: ltmCash,
  };

  // --- Forward estimates (next 2 FYs) ---
  const fyEstimates = (estimates.estimates || []).filter(e => e.horizon === 'fiscal year');
  fyEstimates.sort((a, b) => a.date.localeCompare(b.date));
  const latestAnnualDate = annualIncome[0]?.fiscalDateEnding || '';
  const futureFYs = fyEstimates.filter(e => e.date > latestAnnualDate).slice(0, 2);
  const sharesOut = num(overview.SharesOutstanding);
  const price = num(overview.MarketCapitalization) && sharesOut
    ? num(overview.MarketCapitalization) / sharesOut : null;
  const fwdPE = num(overview.ForwardPE);

  const forwards = futureFYs.map((fy, idx) => {
    const fwdRevenue = num(fy.revenue_estimate_average);
    const fwdEpsAvg = num(fy.eps_estimate_average);
    const fwdNetIncome = fwdEpsAvg != null && sharesOut ? fwdEpsAvg * sharesOut : null;
    const prevRev = idx === 0 ? num(annualIncome[0]?.totalRevenue) : num(futureFYs[0]?.revenue_estimate_average);
    return {
      period: `FY${fy.date.slice(0, 4)}E`, fiscalDate: fy.date,
      revenue: fwdRevenue, revenueGrowth: pctChg(fwdRevenue, prevRev),
      grossProfit: null, grossMargin: null, ebit: null, ebitMargin: null,
      netIncome: fwdNetIncome,
      pe: idx === 0 ? fwdPE : (fwdEpsAvg && price ? price / fwdEpsAvg : null),
      capex: null, fcf: null, cash: null,
      epsEstimate: fwdEpsAvg, epsHigh: num(fy.eps_estimate_high),
      epsLow: num(fy.eps_estimate_low), analystCount: num(fy.eps_estimate_analyst_count),
      revenueHigh: num(fy.revenue_estimate_high), revenueLow: num(fy.revenue_estimate_low),
    };
  });

  const meta = {
    symbol, name: overview.Name || symbol, currency: overview.Currency || 'USD',
    fiscalYearEnd: overview.FiscalYearEnd || '', marketCap: num(overview.MarketCapitalization),
    sharesOutstanding: sharesOut, price, trailingPE: num(overview.TrailingPE),
    forwardPE: fwdPE, eps: num(overview.EPS),
  };

  return { meta, periods: [...annualPeriods, ltm, ...forwards], timestamp: new Date().toISOString() };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const symbol = (req.query?.symbol || 'MU').toUpperCase();
  const refresh = req.query?.refresh === 'true';

  try {
    // If not refreshing, try cache first
    if (!refresh) {
      const { data: cached } = await supabase
        .from('financials_cache')
        .select('data, updated_at')
        .eq('ticker', symbol)
        .single();

      if (cached?.data) {
        return res.status(200).json({
          ...cached.data,
          cached: true,
          cachedAt: cached.updated_at,
        });
      }
    }

    // Fresh pull from Alpha Vantage
    const result = await fetchFromAlphaVantage(symbol);

    // Save to cache
    await supabase.from('financials_cache').upsert({
      ticker: symbol,
      data: result,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'ticker' });

    return res.status(200).json({ ...result, cached: false });
  } catch (err) {
    return res.status(500).json({ error: err.message, symbol });
  }
}
