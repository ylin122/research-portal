"""Analyze newly ingested articles and write to Supabase."""
import os, sys, io, httpx
from pathlib import Path
from dotenv import load_dotenv

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

load_dotenv(Path(__file__).parent.parent / ".env")
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")
headers = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json", "Prefer": "return=minimal"}

UPDATES = {
    "gmail_19d6e350c0f74618": {
        "title": "Terafab is Bullshit \u2014 Damnang",
        "summary": "Damnang (semiconductor engineer) argues Tesla's Terafab megafactory is technically unrealistic as described. Building an advanced 2nm fab requires 30-40M man-hours, US construction takes 38 months vs Taiwan's 19, ASML EUV scanners cost $350-400M each with 2028+ delivery, and the FinFET-to-GAA nanosheet transition is the hardest architecture shift in decades. Intel 18A took over a year to reach profitable yield. However, Musk's track record (SpaceX, Tesla, Starlink) means partial success is plausible. Realistic outcome: Samsung Taylor partnership ($16.5B deal), SpaceX packaging line (FOPLP, equipment arriving since Sep 2025), and potential Intel collaboration.",
        "key_takeaways": [
            "Terafab as publicly described doesn't make technical sense \u2014 2nm fab from scratch requires expertise Tesla doesn't have",
            "US fab construction takes 38 months vs 19 in Taiwan \u2014 permitting, workforce, and supply chain gaps are structural",
            "ASML EUV scanner delivery backlog means first equipment wouldn't arrive until 2028 for a new customer",
            "Samsung already has $16.5B Tesla AI chip supply contract \u2014 this is the realistic near-term path",
            "SpaceX packaging line in Texas (FOPLP) has been receiving equipment since Sep 2025, targeting 2026-2027 production",
            "The negotiating leverage of threatening vertical integration may be more valuable than actually building a fab",
            "60,000+ semiconductor jobs remain unfilled through 2030 \u2014 talent is as much a bottleneck as equipment"
        ],
        "investment_implications": "Terafab announcement is more strategic posturing than near-term reality. Tesla's chip ambitions will flow through Samsung and potentially Intel partnerships, not a greenfield fab. Bearish for the idea that Tesla disrupts semiconductor manufacturing in the next 3-5 years. TSMC's monopoly position is reinforced, not threatened.\n\nPortfolio exposure: TSLA, SMH",
        "themes": ["Terafab", "Tesla", "Semiconductor Manufacturing", "TSMC", "Samsung Foundry", "SpaceX", "Advanced Packaging"],
        "questions": [
            "Is the Samsung Taylor $16.5B deal sufficient for Tesla/xAI's chip needs through 2028?",
            "What chips is SpaceX actually fabricating at the Texas FOPLP packaging line?",
            "Does Terafab announcement change TSMC's or Samsung's negotiating position with Tesla?",
            "How does this affect the CHIPS Act funding landscape \u2014 would Terafab qualify?"
        ],
    },
    "gmail_19d6da1a79b4cae0": {
        "title": "The Real Game Behind Terafab \u2014 Damnang",
        "summary": "Follow-up to 'Terafab is Bullshit.' Intel's April 7 announcement joining Terafab with SpaceX/xAI/Tesla is a credibility play, not an immediate revenue event. Intel Foundry had $17.8B revenue in 2025 but $10.3B operating losses, with only $307M (1.7%) from external customers. The Terafab partnership gives Intel a credential: 'the U.S. AI manufacturing platform that Tesla and SpaceX put their names on.' The real near-term value is advanced packaging (Foveros, EMIB) where capacity is genuinely constrained. The single X post announcement with no press release or SEC filing signals this is preliminary.",
        "key_takeaways": [
            "Intel Foundry external customer revenue is only $307M (1.7% of $17.8B total) \u2014 existential problem for spinoff/IPO viability",
            "Terafab partnership is primarily a credibility signal for Intel, not an immediate revenue event",
            "Intel's advanced packaging (Foveros, EMIB) is the real near-term monetization opportunity \u2014 packaging is the actual bottleneck",
            "SpaceX IPO filing (Apr 1) at $1.75T valuation \u2014 Terafab announcement strategically precedes major capital events",
            "No press release, no SEC filing, just an X post \u2014 this is preliminary, not a binding contract",
            "Samsung already holds $16.5B Tesla AI chip contract \u2014 Intel is supplementary, not primary"
        ],
        "investment_implications": "Positive for Intel (INTC) as a credibility catalyst but doesn't solve the fundamental external customer problem. Intel needs many more anchor customers beyond Tesla/SpaceX. Packaging revenue is real and near-term. SpaceX IPO at $1.75T is a major event for Musk ecosystem.\n\nPortfolio exposure: TSLA, SMH",
        "themes": ["Intel Foundry", "Terafab", "Advanced Packaging", "SpaceX IPO", "Semiconductor Manufacturing", "CHIPS Act"],
        "questions": [
            "Can Intel convert the Terafab credibility into other external foundry customers?",
            "What is the actual packaging revenue opportunity for Intel from Tesla/SpaceX?",
            "How does Intel's 18A process node compare to TSMC N2 for AI chip applications?",
            "Does SpaceX IPO at $1.75T change the capital structure of the Musk ecosystem?"
        ],
    },
    "gmail_19d6d6d434fb2d4d": {
        "title": "AI Adoption By The Numbers \u2014 a16z",
        "summary": "a16z analysis showing enterprise AI adoption is far more successful than skeptics claim. 29% of Fortune 500 companies are now live, paying customers of leading AI startups. ~19% of Global 2000 deployed AI solutions. This adoption occurred within 3 years of ChatGPT's launch. Coding dominates use cases with 10-20x productivity improvements. Customer support ranks second (well-defined tasks, clear ROI metrics). Legal emerged as a surprise early mover despite historical software resistance. Healthcare rapidly deployed AI for medical scribing.",
        "key_takeaways": [
            "29% of Fortune 500 are live, paying customers of leading AI startups \u2014 far higher than skeptics expected",
            "~19% of Global 2000 have deployed AI solutions within 3 years of ChatGPT launch",
            "Coding dominates AI use cases by an order of magnitude \u2014 10-20x productivity improvements reported",
            "Customer support is #2 use case: well-defined tasks, standardized procedures, clear ROI metrics",
            "Legal is a surprise early mover despite historical software resistance",
            "Healthcare rapidly deploying for medical scribing and administrative automation",
            "Partial AI capability doesn't automatically translate to proportional job displacement \u2014 bottleneck tasks remain"
        ],
        "investment_implications": "Validates the AI spending thesis \u2014 enterprises are actually adopting, not just piloting. Coding productivity gains (10-20x) explain why Claude Code/Cursor demand is spiking GPU rental prices. Supports continued infrastructure buildout. Legal and healthcare verticals may be underappreciated AI TAM.\n\nPortfolio exposure: NVDA, MSFT, GOOGL",
        "themes": ["AI Adoption", "Enterprise AI", "Coding Productivity", "Claude Code", "Fortune 500", "Healthcare AI", "Legal Tech"],
        "questions": [
            "What is the revenue retention rate for enterprise AI deployments after the pilot phase?",
            "How much of the 10-20x coding productivity translates to actual headcount reduction vs. output increase?",
            "Which AI startups have the highest Fortune 500 penetration?",
            "Does the coding use case dominance mean developer tools capture disproportionate AI value?"
        ],
    },
    "gmail_19d6cf3a0514cde4": {
        "title": "There Are Only Two Paths Left For Software \u2014 a16z",
        "summary": "a16z argues software companies can no longer occupy the profitable middle ground. Public market repricing has forced a binary choice: (1) Accelerate growth by building AI-native products within 12-18 months, shifting from seat-based to token/per-use pricing, or (2) Maximize profitability to 40-50% true operating margins (including SBC) through radical cost discipline. The 'comfortable middle' of modest growth with moderate margins is dead. Broadcom under Hock Tan cited as the pre-AI model for Path 2. Small 4-person pods outpace larger committees. Engineers should get ~$1,000/month token budgets.",
        "key_takeaways": [
            "Software companies face a binary choice: accelerate growth (+10pts) via AI-native products OR maximize profitability (40-50% margins)",
            "The 'comfortable middle' of modest growth + moderate margins is no longer viable in public markets",
            "Seat-based pricing is dying \u2014 shifting to token/per-use consumption models",
            "Stock compensation must be counted as real expense when measuring true margins",
            "Small teams (4-person pods) outpace larger committees \u2014 AI enables smaller, faster teams",
            "Engineers should get ~$1,000/month token budgets for AI tools",
            "Broadcom under Hock Tan is the model for Path 2 (radical cost discipline + price realization)"
        ],
        "investment_implications": "Bearish for mid-growth SaaS companies stuck in the middle. Bullish for companies that successfully pivot to AI-native (Path 1) or achieve Broadcom-level margins (Path 2). The shift from seats to tokens is bullish for GPU/compute demand. If every engineer gets $1K/month in AI tokens, that's massive incremental compute demand.\n\nPortfolio exposure: MSFT, NVDA",
        "themes": ["SaaS", "Software Pricing", "AI-Native", "Enterprise Software", "Broadcom", "Token Economics", "Operating Margins"],
        "questions": [
            "Which public SaaS companies are successfully executing Path 1 (AI-native acceleration)?",
            "How does the seat-to-token pricing shift affect unit economics for software companies?",
            "If $1K/month/engineer becomes standard, what's the total incremental GPU demand?",
            "Does this framework apply to your credit research coverage of software companies?"
        ],
    },
}

for aid, data in UPDATES.items():
    r = httpx.patch(f"{url}/rest/v1/kb_articles?id=eq.{aid}", headers=headers, json=data, timeout=30)
    if r.status_code in (200, 204):
        print(f"  Updated: {data['title'][:60]}")
    else:
        print(f"  FAILED: {data['title'][:60]} \u2014 {r.status_code} {r.text[:100]}")

print("\nDone.")
