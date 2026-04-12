const AV_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE = 'https://www.alphavantage.co/query';

async function avFetch(fn, symbol) {
  const url = `${BASE}?function=${fn}&symbol=${symbol}&apikey=${AV_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`AV ${fn} failed: ${res.status}`);
  const data = await res.json();
  // AV returns rate limit messages as { "Note": "..." } or { "Information": "..." }
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const symbol = (req.query?.symbol || 'MU').toUpperCase();

  try {
    // Sequential calls with delays to avoid AV's 5 calls/min rate limit
    const income = await avFetch('INCOME_STATEMENT', symbol);
    await delay(1500);
    const cashflow = await avFetch('CASH_FLOW', symbol);
    await delay(1500);
    const balance = await avFetch('BALANCE_SHEET', symbol);
    await delay(1500);
    const overview = await avFetch('OVERVIEW', symbol);
    await delay(1500);
    const estimates = await avFetch('EARNINGS_ESTIMATES', symbol);

    // --- Annual data (last 4 fiscal years for 3 years + prior year for growth calc) ---
    const annualIncome = (income.annualReports || []).slice(0, 4);
    const annualCF = (cashflow.annualReports || []).slice(0, 4);
    const annualBS = (balance.annualReports || []).slice(0, 4);

    // Build lookup by fiscal date
    const cfByDate = Object.fromEntries(annualCF.map(r => [r.fiscalDateEnding, r]));
    const bsByDate = Object.fromEntries(annualBS.map(r => [r.fiscalDateEnding, r]));

    // Annual periods: most recent 3 fiscal years
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
        period: `FY${fy.slice(0, 4)}`,
        fiscalDate: fy,
        revenue,
        revenueGrowth: pctChg(revenue, prevRevenue),
        grossProfit,
        grossMargin: revenue ? (grossProfit / revenue) * 100 : null,
        ebit,
        ebitMargin: revenue ? (ebit / revenue) * 100 : null,
        netIncome,
        pe: null, // will compute on frontend with price
        capex,
        fcf: cffo != null && capex != null ? cffo - capex : null,
        cash,
      };
    }).reverse(); // oldest first

    // --- LTM (last 4 quarters) ---
    const qIncome = (income.quarterlyReports || []).slice(0, 4);
    const qCF = (cashflow.quarterlyReports || []).slice(0, 4);
    const qBS = (balance.quarterlyReports || []).slice(0, 1); // latest quarter for cash

    // For LTM growth, need the 4 quarters before that
    const prevQIncome = (income.quarterlyReports || []).slice(4, 8);

    const ltmRevenue = sumQ(qIncome, 'totalRevenue');
    const ltmPrevRevenue = prevQIncome.length === 4 ? sumQ(prevQIncome, 'totalRevenue') : null;
    const ltmGrossProfit = sumQ(qIncome, 'grossProfit');
    const ltmEbit = sumQ(qIncome, 'ebit') ?? sumQ(qIncome, 'operatingIncome');
    const ltmNetIncome = sumQ(qIncome, 'netIncome');
    const ltmCffo = sumQ(qCF, 'operatingCashflow');
    const ltmCapex = sumQ(qCF, 'capitalExpenditures');
    const ltmCash = qBS[0] ? (num(qBS[0].cashAndCashEquivalentsAtCarryingValue) ?? num(qBS[0].cashAndShortTermInvestments)) : null;

    const ltmPeriodEnd = qIncome[0]?.fiscalDateEnding || '';
    const ltmPeriodStart = qIncome[3]?.fiscalDateEnding || '';

    const ltm = {
      period: 'LTM',
      fiscalDate: ltmPeriodEnd,
      quartersCovered: `${ltmPeriodStart} to ${ltmPeriodEnd}`,
      revenue: ltmRevenue,
      revenueGrowth: pctChg(ltmRevenue, ltmPrevRevenue),
      grossProfit: ltmGrossProfit,
      grossMargin: ltmRevenue ? (ltmGrossProfit / ltmRevenue) * 100 : null,
      ebit: ltmEbit,
      ebitMargin: ltmRevenue ? (ltmEbit / ltmRevenue) * 100 : null,
      netIncome: ltmNetIncome,
      pe: null,
      capex: ltmCapex,
      fcf: ltmCffo != null && ltmCapex != null ? ltmCffo - ltmCapex : null,
      cash: ltmCash,
    };

    // --- Forward estimates (next fiscal year) ---
    const estList = estimates.estimates || [];
    const fyEstimates = estList.filter(e => e.horizon === 'fiscal year');
    // Sort by date ascending, pick the nearest future FY
    fyEstimates.sort((a, b) => a.date.localeCompare(b.date));
    // Find the first FY that is after the latest annual report
    const latestAnnualDate = annualIncome[0]?.fiscalDateEnding || '';
    const fwdFY = fyEstimates.find(e => e.date > latestAnnualDate) || fyEstimates[0];

    const sharesOut = num(overview.SharesOutstanding);
    const price = num(overview.MarketCapitalization) && sharesOut
      ? num(overview.MarketCapitalization) / sharesOut
      : null;
    const fwdPE = num(overview.ForwardPE);

    let forward = null;
    if (fwdFY) {
      const fwdRevenue = num(fwdFY.revenue_estimate_average);
      const fwdEpsAvg = num(fwdFY.eps_estimate_average);
      const fwdNetIncome = fwdEpsAvg != null && sharesOut ? fwdEpsAvg * sharesOut : null;

      forward = {
        period: `FY${fwdFY.date.slice(0, 4)}E`,
        fiscalDate: fwdFY.date,
        revenue: fwdRevenue,
        revenueGrowth: pctChg(fwdRevenue, num(annualIncome[0]?.totalRevenue)),
        grossProfit: null, // not available in estimates
        grossMargin: null,
        ebit: null,
        ebitMargin: null,
        netIncome: fwdNetIncome,
        pe: fwdPE,
        capex: null,
        fcf: null,
        cash: null,
        epsEstimate: fwdEpsAvg,
        epsHigh: num(fwdFY.eps_estimate_high),
        epsLow: num(fwdFY.eps_estimate_low),
        analystCount: num(fwdFY.eps_estimate_analyst_count),
        revenueHigh: num(fwdFY.revenue_estimate_high),
        revenueLow: num(fwdFY.revenue_estimate_low),
      };
    }

    // --- Company info ---
    const meta = {
      symbol,
      name: overview.Name || symbol,
      currency: overview.Currency || 'USD',
      fiscalYearEnd: overview.FiscalYearEnd || '',
      marketCap: num(overview.MarketCapitalization),
      sharesOutstanding: sharesOut,
      price,
      trailingPE: num(overview.TrailingPE),
      forwardPE: fwdPE,
      eps: num(overview.EPS),
    };

    return res.status(200).json({
      meta,
      periods: [...annualPeriods, ltm, ...(forward ? [forward] : [])],
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message, symbol });
  }
}
