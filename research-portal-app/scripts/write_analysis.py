"""Write analysis summaries to Supabase kb_articles and Obsidian vault."""
import os
import sys
import io
import httpx
from pathlib import Path
from dotenv import load_dotenv

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
VAULT_DIR = Path("C:/Users/ylin1/obsidianvault/Research Wiki")

load_dotenv(PROJECT_DIR / ".env")
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

ANALYSES = {
    "Research": {
        "analysis": "TSMC Bottleneck thesis — argues TSMC's advanced node capacity is the binding constraint on AI scaling. Relevant to TSM position and semiconductor capex thesis.",
        "tickers": ["TSM", "NVDA", "AVGO", "AMD"],
        "relevance": "Directly relevant to SMH holdings. Supports semiconductor capex supercycle thesis.",
    },
    "AI Agent Traps": {
        "analysis": "Google DeepMind paper identifying 6 categories of adversarial attacks against autonomous AI agents: content injection, semantic manipulation, cognitive state corruption, behavioral control hijacking, systemic failure, and human-in-the-loop exploitation. First systematic framework for this attack surface. Key insight: as agents become more autonomous, the attack surface expands dramatically.",
        "tickers": ["GOOGL", "MSFT", "CRWD", "PANW"],
        "relevance": "Relevant to AI safety/security investment thesis. Growing attack surface = growing TAM for cybersecurity.",
    },
    "Situational Awareness": {
        "analysis": "Leopold Aschenbrenner's core thesis: AGI by 2027 via ~100,000x effective compute scaleup (GPT-2 to GPT-4 jump repeated). Three levers each contributing ~0.5 OOMs/year: compute scaling, algorithmic efficiency, unhobbling. If AI automates AI research, intelligence explosion compresses a decade into a year. $100B+ training clusters are plausible. Key framing piece for the entire AI capex thesis.",
        "tickers": ["NVDA", "MSFT", "GOOGL", "META", "AMZN", "TSM", "MU"],
        "relevance": "Foundational thesis document. Supports max conviction on AI capex, GPU demand, and memory (HBM) positions. Justifies long-duration exposure to SMH/SOXX/DRAM.",
    },
    "The Great GPU Shortage": {
        "analysis": "SemiAnalysis reports H100 1-year rental prices up 40%. Key drivers: Anthropic ARR tripled to $25B in one quarter, Claude Code as inflection point for GPU demand, open model surge (GLM, Kimi K2.5). Tightness across full supply chain: DRAM, NAND, fiber optics, colo, gas turbines. GPU rental market becoming a key price signal for AI demand.",
        "tickers": ["NVDA", "MU", "CRWV", "NBIS", "LITE", "COHR"],
        "relevance": "Confirms GPU shortage thesis. Supports neocloud positions (CRWV, NBIS). Memory demand (MU, SK Hynix) validated. Optical networking (LITE, COHR) in shortage.",
    },
    "AI's Trillion-Dollar Opportunity": {
        "analysis": "Foundation Capital argues agents don't replace systems of record (Salesforce, Workday, SAP) — they raise the bar. The missing layer is 'context graphs': decision traces, exceptions, overrides, precedents that actually run enterprises. New category of enterprise software between agents and systems of record. Agents become the UI, but canonical data still needed underneath.",
        "tickers": ["CRM", "WDAY", "SAP"],
        "relevance": "Relevant to enterprise software thesis. Suggests incumbents (CRM, WDAY) may be more durable than 'agents kill everything' narrative implies.",
    },
}


def update_supabase(article_id, analysis):
    """Update summary, key_takeaways, investment_implications on a kb_articles row."""
    r = httpx.patch(
        f"{SUPABASE_URL}/rest/v1/kb_articles?id=eq.{article_id}",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        json={
            "summary": analysis["analysis"],
            "key_takeaways": analysis["tickers"],
            "investment_implications": analysis["relevance"],
            "updated_at": __import__("datetime").datetime.now().isoformat(),
        },
        timeout=30,
    )
    return r.status_code in (200, 204)


def main():
    # Fetch articles
    r = httpx.get(
        f"{SUPABASE_URL}/rest/v1/kb_articles?select=id,title,category,source_url,date&order=date.desc",
        headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"},
        timeout=30,
    )
    articles = r.json()

    for a in articles:
        title = a.get("title", "")
        # Skip Google Cloud notifications
        if "Reinstated" in title or "Google Cloud" in title:
            continue

        # Find matching analysis
        matched = None
        for key, analysis in ANALYSES.items():
            if key.lower() in title.lower():
                matched = (key, analysis)
                break

        if not matched:
            print(f"  SKIP: No analysis for '{title}'")
            continue

        key, analysis = matched
        analysis_text = (
            f"## Analysis\n{analysis['analysis']}\n\n"
            f"**Tickers:** {', '.join(analysis['tickers'])}\n\n"
            f"**Portfolio Relevance:** {analysis['relevance']}"
        )

        # Update Supabase
        if update_supabase(a["id"], analysis):
            print(f"  Supabase updated: {title}")
        else:
            print(f"  WARN: Supabase update failed for {title}")

        # Update Obsidian file
        cat = (a.get("category") or "notes").strip()
        clean_title = title
        for ch in ['/', '\\', ':', '*', '?', '"', '<', '>', '|']:
            clean_title = clean_title.replace(ch, '-')
        clean_title = clean_title[:80].strip()
        filepath = VAULT_DIR / cat / f"{clean_title}.md"

        if filepath.exists():
            existing = filepath.read_text(encoding="utf-8")
            if "## Analysis" not in existing:
                updated = existing + f"\n\n{analysis_text}\n"
                filepath.write_text(updated, encoding="utf-8")
                print(f"  Obsidian updated: {cat}/{clean_title}.md")
        else:
            print(f"  WARN: Obsidian file not found: {filepath}")

    print("\nDone.")


if __name__ == "__main__":
    main()
