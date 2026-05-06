"""
Supabase → Obsidian Vault Export
================================
Exports kb_articles from Supabase to an Obsidian vault as markdown files.
Run this periodically to keep your vault in sync.

Usage:
  python scripts/export_to_obsidian.py                    # export to default vault
  python scripts/export_to_obsidian.py --vault ~/my-vault # custom vault path
"""

import os
import sys
import re
import argparse
from datetime import datetime
from pathlib import Path

import httpx
from dotenv import load_dotenv

# ─── Config ───────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DEFAULT_VAULT = Path.home() / "ObsidianVault" / "Research Wiki"

load_dotenv(PROJECT_DIR / ".env")
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env")
    sys.exit(1)


def fetch_articles():
    """Fetch all kb_articles from Supabase."""
    r = httpx.get(
        f"{SUPABASE_URL}/rest/v1/kb_articles?select=*&order=created_at.desc",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
        },
        timeout=30,
    )
    if r.status_code != 200:
        print(f"ERROR fetching articles: {r.status_code} {r.text}")
        return []
    return r.json()


def fetch_companies():
    """Fetch companies for cross-linking."""
    r = httpx.get(
        f"{SUPABASE_URL}/rest/v1/companies?select=id,name,sector,sub",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
        },
        timeout=30,
    )
    if r.status_code != 200:
        return []
    return r.json()


def sanitize_filename(name):
    """Make a string safe for use as a filename."""
    return re.sub(r'[<>:"/\\|?*]', '', name).strip()[:100]


def article_to_markdown(article, companies):
    """Convert a kb_article record to Obsidian-flavored markdown."""
    title = article.get("title", "Untitled")
    content = article.get("content", "")
    url = article.get("url", "")
    category = article.get("category", "notes")
    source = article.get("source", "")
    created = article.get("created_at", "")

    # Format date
    try:
        dt = datetime.fromisoformat(created.replace("Z", "+00:00"))
        date_str = dt.strftime("%Y-%m-%d %H:%M")
    except Exception:
        date_str = created[:10] if created else "unknown"

    # Build frontmatter
    lines = [
        "---",
        f"title: \"{title}\"",
        f"category: {category}",
        f"date: {date_str}",
    ]
    if url:
        lines.append(f"url: \"{url}\"")
    if source:
        lines.append(f"source: \"{source}\"")

    # Auto-tag with company names found in content
    tags = [category]
    content_lower = (title + " " + content).lower()
    for co in companies:
        if co["name"].lower() in content_lower:
            tags.append(co["name"].replace(" ", "-"))
    lines.append(f"tags: [{', '.join(tags)}]")
    lines.append("---")
    lines.append("")

    # Title
    lines.append(f"# {title}")
    lines.append("")

    # URL
    if url:
        lines.append(f"**Link:** [{url}]({url})")
        lines.append("")

    # Metadata
    lines.append(f"**Date:** {date_str}  ")
    lines.append(f"**Category:** {category}  ")
    if source:
        lines.append(f"**Source:** {source}  ")
    lines.append("")

    # Content
    lines.append("---")
    lines.append("")
    lines.append(content)

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Export Supabase → Obsidian Vault")
    parser.add_argument("--vault", type=str, default=str(DEFAULT_VAULT),
                        help=f"Obsidian vault path (default: {DEFAULT_VAULT})")
    args = parser.parse_args()

    vault = Path(args.vault)

    print(f"Fetching articles from Supabase...")
    articles = fetch_articles()
    companies = fetch_companies()

    if not articles:
        print("No articles found.")
        return

    print(f"Found {len(articles)} article(s)")

    # Create vault directories
    categories = {"articles", "notes", "threads", "papers"}
    for cat in categories:
        (vault / cat).mkdir(parents=True, exist_ok=True)

    exported = 0
    for article in articles:
        cat = article.get("category", "notes")
        if cat not in categories:
            cat = "notes"

        title = article.get("title", "Untitled")
        filename = sanitize_filename(title) + ".md"
        filepath = vault / cat / filename

        md = article_to_markdown(article, companies)
        filepath.write_text(md, encoding="utf-8")
        exported += 1

    # Create an index note
    index_lines = ["# Research Wiki Index", "", f"*Exported {datetime.now().strftime('%Y-%m-%d %H:%M')}*", ""]
    for cat in sorted(categories):
        cat_articles = [a for a in articles if a.get("category", "notes") == cat]
        if cat_articles:
            index_lines.append(f"## {cat.title()} ({len(cat_articles)})")
            for a in cat_articles[:20]:
                title = a.get("title", "Untitled")
                safe = sanitize_filename(title)
                index_lines.append(f"- [[{cat}/{safe}|{title}]]")
            index_lines.append("")

    (vault / "Index.md").write_text("\n".join(index_lines), encoding="utf-8")

    print(f"Exported {exported} article(s) to {vault}")
    print(f"Index created at {vault / 'Index.md'}")
    print(f"\nOpen Obsidian > 'Open folder as vault' > select: {vault}")


if __name__ == "__main__":
    main()
