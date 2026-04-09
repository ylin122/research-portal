"""Sync Supabase kb_articles → Obsidian vault as markdown files."""
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


def main():
    print("Fetching articles from Supabase...")
    r = httpx.get(
        f"{SUPABASE_URL}/rest/v1/kb_articles?select=id,title,category,source_type,source_url,date,content&order=date.desc",
        headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"},
        timeout=30,
    )
    articles = r.json()
    print(f"Found {len(articles)} articles")

    synced = 0
    for a in articles:
        cat = (a.get("category") or "notes").strip()
        folder = VAULT_DIR / cat
        folder.mkdir(parents=True, exist_ok=True)

        title = (a.get("title") or "Untitled")
        # Clean filename
        for ch in ['/', '\\', ':', '*', '?', '"', '<', '>', '|']:
            title = title.replace(ch, '-')
        title = title[:80].strip()

        date = (a.get("date") or "")[:10]
        content = (a.get("content") or "")[:5000]
        source = a.get("source_url") or ""

        md = f"---\ndate: {date}\nsource: {source}\ncategory: {cat}\n---\n\n"
        md += content
        if source:
            md += f"\n\n---\nSource: {source}\n"

        filepath = folder / f"{title}.md"
        filepath.write_text(md, encoding="utf-8")
        print(f"  {cat}/{title}.md")
        synced += 1

    print(f"\nDone. {synced} articles synced to {VAULT_DIR}")


if __name__ == "__main__":
    main()
