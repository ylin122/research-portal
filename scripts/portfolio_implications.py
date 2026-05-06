"""
Generate portfolio-specific implications for research articles.
Tags each article with key portfolio tickers that are critically impacted.
Only flags tickers where the article has DIRECT, MATERIAL relevance — not broad-based exposure.
"""
import os
import sys
import io
import httpx
from pathlib import Path
from dotenv import load_dotenv

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

SCRIPT_DIR = Path(__file__).parent
load_dotenv(SCRIPT_DIR.parent / ".env")
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

# Portfolio tickers (direct holdings only — no broad index ETFs)
PORTFOLIO_TICKERS = {"NVDA", "MSFT", "GOOGL", "AMZN", "META", "AAPL", "TSLA", "MU", "BABA", "TCEHY", "SMH"}

# Map article keywords → portfolio tickers they CRITICALLY impact
# Only map when the connection is direct and material, not tangential
CRITICAL_MAPPINGS = {
    # Semiconductor / compute infrastructure → SMH, NVDA, MU
    "tsmc": ["SMH"],
    "cowos": ["SMH", "MU"],
    "advanced packaging": ["SMH", "MU"],
    "hbm": ["MU", "SMH"],
    "dram": ["MU"],
    "nand": ["MU"],
    "memory shortage": ["MU"],
    "memory pricing": ["MU"],
    "gpu shortage": ["NVDA", "SMH"],
    "gpu rental": ["NVDA"],
    "h100": ["NVDA"],
    "gb200": ["NVDA"],
    "gb300": ["NVDA"],
    "vera rubin": ["NVDA"],
    "blackwell": ["NVDA"],
    "cuda": ["NVDA"],
    "nvidia": ["NVDA"],
    "semiconductor bottleneck": ["SMH"],
    "foundry": ["SMH"],
    "euv": ["SMH"],
    "compute scaling": ["NVDA", "SMH"],

    # Hyperscaler specific
    "azure": ["MSFT"],
    "copilot": ["MSFT"],
    "microsoft ai": ["MSFT"],
    "google cloud": ["GOOGL"],
    "deepmind": ["GOOGL"],
    "gemini": ["GOOGL"],
    "tpu": ["GOOGL"],
    "aws": ["AMZN"],
    "trainium": ["AMZN"],
    "meta ai": ["META"],
    "llama": ["META"],

    # AI agent / software
    "agent security": ["GOOGL", "MSFT"],
    "ai agent": ["MSFT", "GOOGL"],
    "enterprise software": ["MSFT"],
    "systems of record": ["MSFT"],

    # Claude / Anthropic → GPU demand → NVDA
    "claude code": ["NVDA"],
    "anthropic": ["NVDA"],

    # Neocloud → SMH (GPU demand signal)
    "neocloud": ["SMH"],
    "coreweave": ["SMH"],

    # China tech
    "alibaba": ["BABA"],
    "tencent": ["TCEHY"],
}


def get_critical_tickers(title, themes, takeaways):
    """Return only the tickers critically impacted by this article."""
    all_text = (title + " " + " ".join(themes or []) + " " + " ".join(takeaways or [])).lower()

    hits = set()
    for keyword, tickers in CRITICAL_MAPPINGS.items():
        if keyword in all_text:
            for t in tickers:
                if t in PORTFOLIO_TICKERS:
                    hits.add(t)

    return sorted(hits)


def main():
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }

    r = httpx.get(
        f"{SUPABASE_URL}/rest/v1/kb_articles?select=id,title,themes,key_takeaways,investment_implications&order=date.desc",
        headers=headers,
        timeout=30,
    )
    articles = r.json()

    for a in articles:
        title = a.get("title", "")
        themes = a.get("themes") or []
        takeaways = a.get("key_takeaways") or []

        tickers = get_critical_tickers(title, themes, takeaways)
        exposure_line = f"Portfolio exposure: {', '.join(tickers)}" if tickers else "Portfolio exposure: None (no direct portfolio impact)"

        # Update investment_implications: strip old portfolio section, append new
        existing = a.get("investment_implications") or ""
        # Remove any prior portfolio exposure section
        clean = existing
        for marker in ["PORTFOLIO EXPOSURE", "Portfolio exposure:", "TOTAL RELEVANT", "IMPLICATIONS:"]:
            idx = clean.find(marker)
            if idx >= 0:
                clean = clean[:idx].rstrip()

        combined = clean.rstrip() + "\n\n" + exposure_line

        r2 = httpx.patch(
            f"{SUPABASE_URL}/rest/v1/kb_articles?id=eq.{a['id']}",
            headers={**headers, "Prefer": "return=minimal"},
            json={"investment_implications": combined},
            timeout=30,
        )
        if r2.status_code in (200, 204):
            print(f"  {title[:55]:<55} → {exposure_line}")
        else:
            print(f"  FAILED: {title[:55]} — {r2.status_code}")

    print(f"\nDone.")


if __name__ == "__main__":
    main()
