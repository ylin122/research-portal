"""
Gmail → Supabase Research Wiki Ingest
=====================================
Pulls emails tagged with [RW] or [idea] from ylresearchwiki@gmail.com
and pushes them to the Supabase kb_articles or idea_tracker tables.

Usage:
  python scripts/gmail_ingest.py           # ingest new [RW] and [idea] emails
  python scripts/gmail_ingest.py --dry-run # preview without writing to Supabase

Setup:
  1. Download OAuth credentials from Google Cloud Console → save as scripts/credentials.json
  2. First run will open browser for OAuth consent → saves token.json
  3. .env in research-portal-app root must have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
"""

import os
import sys
import json
import base64
import re
import argparse
from datetime import datetime, timezone
from pathlib import Path
from email.utils import parsedate_to_datetime

import httpx
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# ─── Config ───────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
CREDENTIALS_FILE = SCRIPT_DIR / "credentials.json"
TOKEN_FILE = SCRIPT_DIR / "token.json"
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

# Tags to search for
TAG_RW = "[RW]"        # → kb_articles table
TAG_IDEA = "[idea]"    # → idea_tracker table (future)

load_dotenv(PROJECT_DIR / ".env")
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env")
    sys.exit(1)


# ─── Gmail Auth ───────────────────────────────────────
def get_gmail_service():
    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDENTIALS_FILE.exists():
                print(f"ERROR: {CREDENTIALS_FILE} not found.")
                print("Download OAuth credentials from Google Cloud Console and save as scripts/credentials.json")
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_FILE), SCOPES)
            creds = flow.run_local_server(port=0)

        TOKEN_FILE.write_text(creds.to_json())
        print(f"Token saved to {TOKEN_FILE}")

    return build("gmail", "v1", credentials=creds)


# ─── Email Parsing ────────────────────────────────────
def get_header(headers, name):
    for h in headers:
        if h["name"].lower() == name.lower():
            return h["value"]
    return ""


def decode_body(payload):
    """Extract plain text from email payload, handling multipart."""
    if payload.get("body", {}).get("data"):
        return base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="replace")

    parts = payload.get("parts", [])
    # Prefer plain text
    for part in parts:
        if part.get("mimeType") == "text/plain" and part.get("body", {}).get("data"):
            return base64.urlsafe_b64decode(part["body"]["data"]).decode("utf-8", errors="replace")
    # Fall back to HTML → text
    for part in parts:
        if part.get("mimeType") == "text/html" and part.get("body", {}).get("data"):
            html = base64.urlsafe_b64decode(part["body"]["data"]).decode("utf-8", errors="replace")
            return html_to_text(html)
    # Recurse into nested multipart
    for part in parts:
        if part.get("parts"):
            result = decode_body(part)
            if result:
                return result
    return ""


def html_to_text(html):
    """Convert HTML to clean text."""
    soup = BeautifulSoup(html, "html.parser")
    # Remove script/style
    for tag in soup(["script", "style"]):
        tag.decompose()
    return soup.get_text(separator="\n", strip=True)


def extract_urls(text):
    """Pull URLs from text."""
    return re.findall(r'https?://[^\s<>"\')\]]+', text)


def classify_content(subject, body, urls):
    """Auto-classify: articles (has URL), notes (no URL), threads, papers."""
    subject_lower = subject.lower()
    if "paper" in subject_lower or "arxiv" in subject_lower:
        return "papers"
    if "thread" in subject_lower:
        return "threads"
    if urls:
        return "articles"
    return "notes"


def parse_email(msg):
    """Parse a Gmail message into a structured dict."""
    headers = msg["payload"]["headers"]
    subject = get_header(headers, "Subject")
    sender = get_header(headers, "From")
    date_str = get_header(headers, "Date")
    msg_id = msg["id"]

    # Parse date
    try:
        dt = parsedate_to_datetime(date_str)
    except Exception:
        dt = datetime.now(timezone.utc)

    # Strip tag from subject
    clean_subject = subject
    for tag in [TAG_RW, TAG_IDEA, "[rw]", "[Rw]", "[IDEA]", "[Idea]"]:
        clean_subject = clean_subject.replace(tag, "").strip()

    # Get body
    body = decode_body(msg["payload"])
    urls = extract_urls(body)
    category = classify_content(clean_subject, body, urls)

    # Determine which table
    subject_lower = subject.lower()
    if "[idea]" in subject_lower:
        target_table = "idea_tracker"
    else:
        target_table = "kb_articles"

    return {
        "gmail_id": msg_id,
        "subject": clean_subject,
        "body": body.strip(),
        "urls": urls,
        "category": category,
        "sender": sender,
        "date": dt.isoformat(),
        "target_table": target_table,
    }


# ─── Supabase ─────────────────────────────────────────
def get_existing_gmail_ids(table="kb_articles"):
    """Fetch gmail_ids already in Supabase to avoid duplicates."""
    r = httpx.get(
        f"{SUPABASE_URL}/rest/v1/{table}?select=gmail_id&gmail_id=not.is.null",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
        },
        timeout=30,
    )
    if r.status_code == 200:
        return {row["gmail_id"] for row in r.json()}
    # Table might not have gmail_id column yet — that's ok
    return set()


def upsert_to_supabase(table, record):
    """Insert a record into Supabase."""
    r = httpx.post(
        f"{SUPABASE_URL}/rest/v1/{table}",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates",
        },
        json=record,
        timeout=30,
    )
    if r.status_code not in (200, 201):
        print(f"  ERROR inserting into {table}: {r.status_code} {r.text}")
        return False
    return True


# ─── Main ─────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Gmail → Supabase Research Wiki Ingest")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing to Supabase")
    parser.add_argument("--max", type=int, default=50, help="Max emails to process (default: 50)")
    args = parser.parse_args()

    print("Connecting to Gmail...")
    service = get_gmail_service()

    # Search for [RW] and [idea] tagged emails
    query = "subject:[RW] OR subject:[idea]"
    print(f"Searching: {query}")

    results = service.users().messages().list(
        userId="me", q=query, maxResults=args.max
    ).execute()

    messages = results.get("messages", [])
    if not messages:
        print("No tagged emails found.")
        return

    print(f"Found {len(messages)} tagged email(s)")

    # Get existing IDs to skip duplicates
    existing_kb = get_existing_gmail_ids("kb_articles")
    existing_ideas = get_existing_gmail_ids("idea_tracker")
    existing = existing_kb | existing_ideas
    print(f"Already ingested: {len(existing)} email(s)")

    new_count = 0
    skip_count = 0

    for msg_meta in messages:
        msg_id = msg_meta["id"]
        if msg_id in existing:
            skip_count += 1
            continue

        # Fetch full message
        msg = service.users().messages().get(
            userId="me", id=msg_id, format="full"
        ).execute()

        parsed = parse_email(msg)
        table = parsed["target_table"]

        print(f"\n{'[DRY RUN] ' if args.dry_run else ''}Processing: {parsed['subject']}")
        print(f"  Category: {parsed['category']} → {table}")
        print(f"  Date: {parsed['date']}")
        print(f"  URLs: {len(parsed['urls'])}")
        if parsed['urls']:
            for u in parsed['urls'][:3]:
                print(f"    {u}")

        if args.dry_run:
            new_count += 1
            continue

        # Build record for Supabase
        uid = f"gmail_{msg_id}"

        if table == "kb_articles":
            record = {
                "id": uid,
                "gmail_id": msg_id,
                "title": parsed["subject"],
                "content": parsed["body"][:5000],  # Truncate if huge
                "url": parsed["urls"][0] if parsed["urls"] else None,
                "category": parsed["category"],
                "source": parsed["sender"],
                "created_at": parsed["date"],
            }
        else:  # idea_tracker
            record = {
                "id": uid,
                "gmail_id": msg_id,
                "title": parsed["subject"],
                "description": parsed["body"][:5000],
                "status": "new",
                "created_at": parsed["date"],
            }

        if upsert_to_supabase(table, record):
            print(f"  ✓ Saved to {table}")
            new_count += 1
        else:
            print(f"  ✗ Failed")

    print(f"\nDone. New: {new_count}, Skipped (already ingested): {skip_count}")


if __name__ == "__main__":
    main()
