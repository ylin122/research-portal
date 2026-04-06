import httpx, os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / ".env")
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")

prompt_text = """0. Recent Update
Pull the most critical and relevant news I need to know.
Focus on items that impact market sentiment and fundamentals - skip marketing or product advertising updates.

1. Company Overview
Keep this section brief.
- What does this company do in plain terms (products or services)?
- Only the most critical background and history needed to understand the business - keep it tight. What is the minimal historical background needed to understand the business today?

2. Key Business / Products
I want to know what [COMPANY] offers and sells to its customers.
- How does this company make money? Lead with this.
- Key segments, products, and services - are these recurring, re-occurring, transactional, and/or project-based?
- Why do customers buy these products or services?

3. Customer Focus
I want to understand the customer profile.
- Customer profile: large enterprise, upper-mid, mid-market, SMB?
- Key end markets or verticals. Is it diversified or concentrated?
- Geography - revenue mix by North America, EMEA, APAC, and LATAM? Focus on major geographies.
- What drives the buying decision for these customers in these industries? What problems is [COMPANY] addressing?

4. Industry & Market
I want to understand industry trends and market opportunities.
- Key headwinds and tailwinds, and duration of tailwinds and headwinds.
- Market size and [COMPANY]'s relative position within it.
- Estimated market growth over the last 5 years, using your best estimate if exact data is not available. If you estimate, explicitly say so or highlight it.

5. Competitive Landscape
I want to understand the key players in industries [COMPANY] competes in.
- Key competitors and competitive advantage - why and how do they win?
- Which products and/or services from section 2 are most competitive?
- Where [COMPANY] competes best and worst, such as price, product quality, speed, relationships, expertise, or switching costs.
- Biggest threats and largest opportunities in the next 3 years.

6. Recent Transactions
- List the most important recent transactions in reverse chronological order.
- Include only transactions that materially matter to the investment case.
- Focus on what matters for diligence and fundamental underwriting.
- If unsure or torn on what to exclude, it is safer to include.

7. Financials & Metrics
Leave this empty and don't add any information to this section."""

record = {
    "id": "prompt_brief_research",
    "title": "Brief Company Research",
    "prompt_text": prompt_text,
    "created_at": "2026-04-05T00:00:02Z",
    "updated_at": "2026-04-05T00:00:02Z",
}

r = httpx.post(
    f"{url}/rest/v1/prompts",
    headers={"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates"},
    json=record,
    timeout=30,
)
print(f"Status: {r.status_code}")
if r.status_code not in (200, 201):
    print(r.text)
else:
    print("Prompt #3 saved.")
