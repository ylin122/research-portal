import { createClient } from '@supabase/supabase-js';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// CIK map for SEC EDGAR lookups
const CIK = {
  MU: '0000723125', ORCL: '0001341439', NVDA: '0001045810', AMZN: '0001018724',
  MSFT: '0000789019', GOOGL: '0001652044', TSLA: '0001318605', LITE: '0001404057',
  COHR: '0000820318', APLD: '0001144879', CIFR: '0001819989', WULF: '0001619762',
  CRWV: '0001840574',
};

const EDGAR_UA = 'research-portal/1.0 (ylresearchwiki@gmail.com)';

function num(v) {
  if (v === undefined || v === null || v === 'None' || v === '') return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function pctChg(curr, prev) {
  if (curr == null || prev == null || prev === 0) return null;
  return ((curr - prev) / Math.abs(prev)) * 100;
}

// ── SEC EDGAR: fetch XBRL company facts ──
async function fetchEdgar(cik) {
  const url = `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`;
  const res = await fetch(url, { headers: { 'User-Agent': EDGAR_UA } });
  if (!res.ok) throw new Error(`EDGAR failed: ${res.status}`);
  return res.json();
}

// Extract annual (10-K) values for a given XBRL tag, deduplicated by end date
function getAnnual(facts, tags) {
  for (const tag of tags) {
    const entries = facts?.['us-gaap']?.[tag]?.units?.USD;
    if (!entries) continue;
    const annual = entries.filter(e => e.form === '10-K' && e.fp === 'FY');
    // Deduplicate by end date (take the latest filing)
    const byEnd = {};
    for (const e of annual) byEnd[e.end] = e;
    const sorted = Object.values(byEnd).sort((a, b) => a.end.localeCompare(b.end));
    if (sorted.length) return sorted;
  }
  return [];
}

// Build annual periods from EDGAR data
function buildAnnualPeriods(edgarData) {
  const f = edgarData.facts || {};
  const revEntries = getAnnual(f, ['RevenueFromContractWithCustomerExcludingAssessedTax', 'Revenues', 'SalesRevenueNet']);
  const gpEntries = getAnnual(f, ['GrossProfit']);
  const ebitEntries = getAnnual(f, ['OperatingIncomeLoss']);
  const niEntries = getAnnual(f, ['NetIncomeLoss']);
  const cashEntries = getAnnual(f, ['CashAndCashEquivalentsAtCarryingValue', 'CashCashEquivalentsAndShortTermInvestments']);
  const capexEntries = getAnnual(f, ['PaymentsToAcquirePropertyPlantAndEquipment']);
  const cffoEntries = getAnnual(f, ['NetCashProvidedByUsedInOperatingActivities', 'NetCashProvidedByOperatingActivities']);

  const byDate = (arr) => Object.fromEntries(arr.map(e => [e.end, e.val]));
  const revMap = byDate(revEntries);
  const gpMap = byDate(gpEntries);
  const ebitMap = byDate(ebitEntries);
  const niMap = byDate(niEntries);
  const cashMap = byDate(cashEntries);
  const capexMap = byDate(capexEntries);
  const cffoMap = byDate(cffoEntries);

  // Use revenue dates as the master list, take last 4 (3 display + 1 for growth)
  const dates = revEntries.map(e => e.end).slice(-4);

  const periods = dates.map((d, i) => {
    const revenue = num(revMap[d]);
    const grossProfit = num(gpMap[d]);
    const ebit = num(ebitMap[d]);
    const netIncome = num(niMap[d]);
    const cash = num(cashMap[d]);
    const capex = num(capexMap[d]);
    const cffo = num(cffoMap[d]);
    const prevD = dates[i - 1];
    const prevRev = prevD ? num(revMap[prevD]) : null;

    return {
      period: `FY${d.slice(0, 4)}`,
      fiscalDate: d,
      revenue, grossProfit, ebit, netIncome, cash, capex, cffo,
      revenueGrowth: pctChg(revenue, prevRev),
      grossMargin: revenue ? (grossProfit / revenue) * 100 : null,
      ebitMargin: revenue ? (ebit / revenue) * 100 : null,
      fcf: cffo != null && capex != null ? cffo - capex : null,
    };
  });

  // Drop the oldest (used only for growth calc) if we have 4
  return periods.length > 3 ? periods.slice(1) : periods;
}

// ── Yahoo Finance: fetch market data and estimates ──
async function fetchYahoo(ticker) {
  const quote = await yahooFinance.quote(ticker);
  let estimates = null;
  try {
    const summary = await yahooFinance.quoteSummary(ticker, {
      modules: ['defaultKeyStatistics', 'financialData', 'earningsTrend'],
    });
    estimates = summary;
  } catch { /* earningsTrend may not be available for all tickers */ }

  return {
    price: quote.regularMarketPrice ?? null,
    marketCap: quote.marketCap ?? null,
    sharesOutstanding: quote.sharesOutstanding ?? null,
    trailingPE: quote.trailingPE ? +quote.trailingPE.toFixed(2) : null,
    forwardPE: quote.forwardPE ? +quote.forwardPE.toFixed(2) : null,
    ltmEps: quote.epsTrailingTwelveMonths ? +quote.epsTrailingTwelveMonths.toFixed(2) : null,
    fwdEps: quote.epsCurrentYear ? +quote.epsCurrentYear.toFixed(2) : null,
    fwdEpsNextYear: quote.epsForward ? +quote.epsForward.toFixed(2) : null,
    name: quote.shortName || quote.longName || ticker,
    change1d: quote.regularMarketChangePercent ? +quote.regularMarketChangePercent.toFixed(2) : null,
    fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh ?? null,
    fiftyTwoWeekLow: quote.fiftyTwoWeekLow ?? null,
    // TTM data from financialData
    ttmRevenue: estimates?.financialData?.totalRevenue ?? null,
    ttmEbitda: estimates?.financialData?.ebitda ?? null,
    ttmFcf: estimates?.financialData?.freeCashflow ?? null,
    ttmGrossMargin: estimates?.financialData?.grossMargins ? +(estimates.financialData.grossMargins * 100).toFixed(1) : null,
    ttmEbitdaMargin: estimates?.financialData?.ebitdaMargins ? +(estimates.financialData.ebitdaMargins * 100).toFixed(1) : null,
    ttmOperatingMargin: estimates?.financialData?.operatingMargins ? +(estimates.financialData.operatingMargins * 100).toFixed(1) : null,
    revenueGrowth: estimates?.financialData?.revenueGrowth ? +(estimates.financialData.revenueGrowth * 100).toFixed(1) : null,
    pegRatio: estimates?.defaultKeyStatistics?.pegRatio ?? null,
    beta: estimates?.defaultKeyStatistics?.betaRaw ?? estimates?.defaultKeyStatistics?.beta ?? null,
    dividendYield: quote.dividendYield ? +(quote.dividendYield * 100).toFixed(2) : null,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const symbol = (req.query?.symbol || '').toUpperCase();
  if (!symbol) return res.status(400).json({ error: 'Missing symbol param' });

  const refresh = req.query?.refresh === 'true';

  try {
    // Check cache first
    if (!refresh) {
      const { data: cached } = await supabase
        .from('financials_cache')
        .select('data, updated_at')
        .eq('ticker', symbol)
        .single();
      if (cached?.data) {
        return res.status(200).json({ ...cached.data, cached: true, cachedAt: cached.updated_at });
      }
    }

    // Fresh pull
    const cik = CIK[symbol];
    let historical = [];

    // SEC EDGAR for historical (US companies only)
    if (cik) {
      try {
        const edgarData = await fetchEdgar(cik);
        historical = buildAnnualPeriods(edgarData);
      } catch (e) {
        console.error('EDGAR error:', e.message);
      }
    }

    // Yahoo Finance for market data
    const yahoo = await fetchYahoo(symbol);

    const result = {
      meta: {
        symbol,
        name: yahoo.name,
        price: yahoo.price,
        marketCap: yahoo.marketCap,
        sharesOutstanding: yahoo.sharesOutstanding,
        trailingPE: yahoo.trailingPE,
        forwardPE: yahoo.forwardPE,
        ltmEps: yahoo.ltmEps,
        fwdEps: yahoo.fwdEps,
        fwdEpsNextYear: yahoo.fwdEpsNextYear,
        pegRatio: yahoo.pegRatio,
        beta: yahoo.beta,
        dividendYield: yahoo.dividendYield,
        change1d: yahoo.change1d,
        fiftyTwoWeekHigh: yahoo.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: yahoo.fiftyTwoWeekLow,
      },
      ttm: {
        revenue: yahoo.ttmRevenue,
        ebitda: yahoo.ttmEbitda,
        fcf: yahoo.ttmFcf,
        grossMargin: yahoo.ttmGrossMargin,
        ebitdaMargin: yahoo.ttmEbitdaMargin,
        operatingMargin: yahoo.ttmOperatingMargin,
        revenueGrowth: yahoo.revenueGrowth,
        eps: yahoo.ltmEps,
      },
      historical,
      timestamp: new Date().toISOString(),
    };

    // Cache
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
