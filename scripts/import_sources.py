import httpx, os, json
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / ".env")
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")
h = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates"}

sources = [
    # News & Data
    {"id": "src_bloomberg", "name": "Bloomberg", "url": "bloomberg.com", "category": "news", "description": "Neocloud deal values, AI infrastructure M&A, hyperscaler capex breakdowns"},
    {"id": "src_reuters", "name": "Reuters", "url": "reuters.com", "category": "news", "description": "Contract announcements, M&A, policy/regulatory changes"},
    {"id": "src_cnbc", "name": "CNBC", "url": "cnbc.com", "category": "news", "description": "Earnings coverage, AI infrastructure deals, hyperscaler capex"},
    {"id": "src_wsj", "name": "Wall Street Journal", "url": "wsj.com", "category": "news", "description": "M&A, regulatory, macro, enterprise technology coverage"},
    {"id": "src_theinformation", "name": "The Information", "url": "theinformation.com", "category": "news", "description": "AI lab revenue estimates, private company valuations (OpenAI, Anthropic), contract details"},
    {"id": "src_dcd", "name": "DataCenterDynamics", "url": "datacenterdynamics.com", "category": "news", "description": "Data center deals, campus announcements, power capacity, neocloud infrastructure"},
    {"id": "src_dcf", "name": "Data Center Frontier", "url": "datacenterfrontier.com", "category": "news", "description": "Data center development, site selection, hyperscale campus coverage"},
    {"id": "src_coindesk", "name": "CoinDesk", "url": "coindesk.com", "category": "news", "description": "Bitcoin miner-to-AI pivot coverage, WULF/CIFR/CORZ/IREN deals"},
    {"id": "src_theblock", "name": "The Block", "url": "theblock.co", "category": "news", "description": "Crypto infrastructure pivots, mining economics, AI hosting contracts"},
    {"id": "src_seekingalpha", "name": "Seeking Alpha", "url": "seekingalpha.com", "category": "news", "description": "Analyst commentary, earnings analysis, neocloud comparisons"},

    # Research
    {"id": "src_semianalysis", "name": "SemiAnalysis", "url": "semianalysis.com", "category": "research", "description": "GPU roadmaps, neocloud tier ratings, ASIC comparisons, datacenter architecture, supply chain analysis"},
    {"id": "src_epochai", "name": "Epoch AI", "url": "epoch.ai", "category": "research", "description": "AI chip sales database, cumulative GPU shipment tracking, compute growth models"},
    {"id": "src_trendforce", "name": "TrendForce", "url": "trendforce.com", "category": "research", "description": "DRAM/NAND pricing, HBM market sizing, memory shipment forecasts"},
    {"id": "src_synergy", "name": "Synergy Research Group", "url": "srgresearch.com", "category": "research", "description": "Neocloud market revenue ($35B 2026E), cloud infrastructure market share"},
    {"id": "src_abi", "name": "ABI Research", "url": "abiresearch.com", "category": "research", "description": "Neocloud market profiling (CoreWeave, Nebius, Lambda, Crusoe, Vultr)"},
    {"id": "src_mordor", "name": "Mordor Intelligence", "url": "mordorintelligence.com", "category": "research", "description": "Neocloud market size projections ($35B 2026 -> $237B 2031), CAGR estimates"},

    # Sell-Side
    {"id": "src_jpmorgan", "name": "JP Morgan Research", "url": "jpmorgan.com", "category": "sellside", "description": "GPU delivery volume estimates, Vera Rubin forecasts, hyperscaler capex models, AI accelerator shipments"},
    {"id": "src_morganstanley", "name": "Morgan Stanley Research", "url": "morganstanley.com", "category": "sellside", "description": "AI capex estimates, semiconductor capex forecasts, neocloud market sizing"},
    {"id": "src_goldman", "name": "Goldman Sachs Research", "url": "goldmansachs.com", "category": "sellside", "description": "Hyperscaler capex guidance, AI infrastructure spending projections, power demand forecasts"},
    {"id": "src_creditsights", "name": "CreditSights", "url": "creditsights.com", "category": "sellside", "description": "Hyperscaler capex tracking, neocloud debt analysis, credit research"},
    {"id": "src_bofa", "name": "BofA Global Research", "url": "research.ml.com", "category": "sellside", "description": "AI infrastructure research, semiconductor coverage, hyperscaler capex"},

    # Filings & Regulatory
    {"id": "src_sec", "name": "SEC EDGAR", "url": "sec.gov/cgi-bin/browse-edgar", "category": "filings", "description": "10-K/10-Q filings, S-1s, earnings press releases, proxy statements for all public companies"},
    {"id": "src_nvidia_ir", "name": "NVIDIA Investor Relations", "url": "investor.nvidia.com", "category": "filings", "description": "GPU roadmap, revenue/guidance, customer disclosures, capex, earnings calls"},
    {"id": "src_stockanalysis", "name": "StockAnalysis.com", "url": "stockanalysis.com", "category": "filings", "description": "P/E ratios, enterprise value, market cap, revenue, EPS, shares outstanding, beta"},
    {"id": "src_yahoo", "name": "Yahoo Finance", "url": "finance.yahoo.com", "category": "filings", "description": "Key statistics, earnings dates, quarterly financials, sector comparisons"},
    {"id": "src_macrotrends", "name": "MacroTrends", "url": "macrotrends.net", "category": "filings", "description": "Historical P/E ratios, revenue history, margin trends"},

    # Newsletters
    {"id": "src_a16z", "name": "a16z Newsletter", "url": "a16z.com/newsletter", "category": "newsletter", "description": "Tech industry analysis, AI trends, startup ecosystem, market structure"},
    {"id": "src_stratechery", "name": "Stratechery", "url": "stratechery.com", "category": "newsletter", "description": "Tech strategy analysis, platform dynamics, business model breakdowns"},
    {"id": "src_mbi", "name": "MBI Deep Dives", "url": "mbi.substack.com", "category": "newsletter", "description": "Software and technology company deep dives, competitive analysis"},

    # Other industry
    {"id": "src_marketbeat", "name": "MarketBeat", "url": "marketbeat.com", "category": "news", "description": "Analyst ratings, price targets, earnings dates, insider trading, short interest"},
    {"id": "src_tipranks", "name": "TipRanks", "url": "tipranks.com", "category": "news", "description": "Analyst consensus, price targets, insider transactions, institutional ownership"},
    {"id": "src_fintel", "name": "Fintel", "url": "fintel.io", "category": "news", "description": "Short interest data, institutional holdings, insider trading, options flow"},
    {"id": "src_baxtel", "name": "Baxtel", "url": "baxtel.com", "category": "research", "description": "Data center maps, facility databases, colocation provider profiles"},
]

count = 0
for s in sources:
    r = httpx.post(f"{url}/rest/v1/sources", headers=h, json=s, timeout=30)
    if r.status_code in (200, 201):
        count += 1
    else:
        print(f"  SKIP {s['name']}: {r.status_code} {r.text[:100]}")

print(f"Added {count}/{len(sources)} sources.")
