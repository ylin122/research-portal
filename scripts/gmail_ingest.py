"""
Gmail → Supabase Research Wiki Ingest
=====================================
Pulls emails tagged with [Research] from ylresearchwiki@gmail.com
and pushes them to the Supabase kb_articles table.
Handles PDF attachments automatically (extracts text via PyMuPDF).

Usage:
  research-ingest              # ingest new [Research] emails
  research-ingest --dry-run    # preview without writing
  research-ingest --all        # also match subject "Research" (no brackets)
  research-export              # Supabase → Obsidian vault
  research-sync                # both in one shot

Setup:
  1. Download OAuth credentials from Google Cloud Console → save as scripts/credentials.json
  2. First run will open browser for OAuth consent → saves token.json
  3. .env at the repo root (~/projects/research-portal) must have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
  4. pip install pymupdf (for PDF extraction)
"""

import os
import sys
import io
import base64
import re
import argparse
import tempfile
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

# Fix encoding on Windows
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

# ─── Config ───────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
CREDENTIALS_FILE = SCRIPT_DIR / "credentials.json"
TOKEN_FILE = SCRIPT_DIR / "token.json"
PDF_DIR = SCRIPT_DIR / "pdfs"
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

# Tags to search for
TAG_RESEARCH = "[Research]"  # → kb_articles table

load_dotenv(PROJECT_DIR / ".env")
load_dotenv(PROJECT_DIR / ".env.local", override=True)
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
# Service role bypasses RLS; required for inserts. Falls back to anon for read-only dry runs.
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (or VITE_* fallbacks) in .env / .env.local")
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


# ─── PDF Extraction ──────────────────────────────────
def extract_pdf_text(pdf_bytes, max_chars=5000):
    """Extract text from PDF bytes using PyMuPDF."""
    try:
        import fitz
    except ImportError:
        print("  WARN: pymupdf not installed. Run: pip install pymupdf")
        return ""

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
        f.write(pdf_bytes)
        tmp_path = f.name

    try:
        doc = fitz.open(tmp_path)
        text = ""
        for page in doc:
            text += page.get_text()
            if len(text) > max_chars * 2:  # grab extra for summary, truncate later
                break
        doc.close()
        return text
    finally:
        os.unlink(tmp_path)


def download_attachment(service, msg_id, part):
    """Download an attachment from Gmail and return (filename, bytes)."""
    att_id = part["body"]["attachmentId"]
    att = service.users().messages().attachments().get(
        userId="me", messageId=msg_id, id=att_id
    ).execute()
    data = base64.urlsafe_b64decode(att["data"])
    return data


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
    for part in parts:
        if part.get("mimeType") == "text/plain" and part.get("body", {}).get("data"):
            return base64.urlsafe_b64decode(part["body"]["data"]).decode("utf-8", errors="replace")
    for part in parts:
        if part.get("mimeType") == "text/html" and part.get("body", {}).get("data"):
            html = base64.urlsafe_b64decode(part["body"]["data"]).decode("utf-8", errors="replace")
            return html_to_text(html)
    for part in parts:
        if part.get("parts"):
            result = decode_body(part)
            if result:
                return result
    return ""


def html_to_text(html):
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style"]):
        tag.decompose()
    return soup.get_text(separator="\n", strip=True)


def extract_urls(text):
    return re.findall(r'https?://[^\s<>"\')\]]+', text)


def get_pdf_parts(payload):
    """Find all PDF attachment parts in the email."""
    pdfs = []
    parts = payload.get("parts", [])
    for part in parts:
        fn = part.get("filename", "")
        mime = part.get("mimeType", "")
        if (fn.lower().endswith(".pdf") or mime == "application/pdf") and part.get("body", {}).get("attachmentId"):
            pdfs.append(part)
        # Recurse into nested parts
        if part.get("parts"):
            pdfs.extend(get_pdf_parts(part))
    return pdfs


def classify_content(subject, body, urls, has_pdf):
    """Auto-classify: papers (PDF), articles (URL), notes (text only), threads."""
    subject_lower = subject.lower()
    if has_pdf or "paper" in subject_lower or "arxiv" in subject_lower:
        return "papers"
    if "thread" in subject_lower:
        return "threads"
    if urls:
        return "articles"
    return "notes"


def parse_email(service, msg):
    """Parse a Gmail message into a structured dict, including PDF text."""
    headers = msg["payload"]["headers"]
    subject = get_header(headers, "Subject")
    sender = get_header(headers, "From")
    date_str = get_header(headers, "Date")
    msg_id = msg["id"]

    try:
        dt = parsedate_to_datetime(date_str)
    except Exception:
        dt = datetime.now(timezone.utc)

    # Strip tags from subject
    clean_subject = subject
    for tag in [TAG_RESEARCH, "[Research]", "[research]", "[RESEARCH]", "[RW]", "[rw]"]:
        clean_subject = clean_subject.replace(tag, "").strip()

    # Get body text
    body = decode_body(msg["payload"])
    urls = extract_urls(body)

    # If subject is empty or generic after stripping, try to extract title from body content
    if not clean_subject or clean_subject.lower() in ("research", "fwd:", "fwd", "fw:", "fw", "re:", "re"):
        # Try to find a heading in the body (markdown # or first meaningful line)
        for line in body.split("\n"):
            line = line.strip()
            if line.startswith("# "):
                clean_subject = line.lstrip("# ").strip()
                break
            # Skip empty lines, URLs, short lines
            if len(line) > 15 and not line.startswith("http") and not line.startswith("Sent from"):
                clean_subject = line[:120]
                break
        # If still generic, try to extract from URL slug
        if not clean_subject or clean_subject.lower() in ("research",):
            for u in urls:
                slug = u.rstrip("/").split("/")[-1].split("?")[0]
                if len(slug) > 5:
                    clean_subject = slug.replace("-", " ").replace("_", " ").title()[:120]
                    break
        if not clean_subject:
            clean_subject = "Untitled Research"

    # Handle PDF attachments
    pdf_parts = get_pdf_parts(msg["payload"])
    pdf_text = ""
    pdf_filenames = []

    for pdf_part in pdf_parts:
        fn = pdf_part.get("filename", "attachment.pdf")
        pdf_filenames.append(fn)
        print(f"  PDF found: {fn} — downloading & extracting text...")

        pdf_bytes = download_attachment(service, msg_id, pdf_part)

        # Save locally
        PDF_DIR.mkdir(exist_ok=True)
        local_path = PDF_DIR / fn
        local_path.write_bytes(pdf_bytes)
        print(f"  Saved to {local_path} ({len(pdf_bytes):,} bytes)")

        # Extract text
        text = extract_pdf_text(pdf_bytes)
        if text:
            pdf_text += f"\n\n--- {fn} ---\n{text}"
            print(f"  Extracted {len(text):,} chars from {fn}")
        else:
            print(f"  WARN: No text extracted from {fn}")

    has_pdf = bool(pdf_parts)
    category = classify_content(clean_subject, body, urls, has_pdf)

    # Combine body + PDF text
    combined_content = body.strip()
    if pdf_text:
        combined_content = (combined_content + "\n\n" + pdf_text.strip()).strip()

    return {
        "gmail_id": msg_id,
        "subject": clean_subject,
        "body": combined_content,
        "urls": urls,
        "category": category,
        "sender": sender,
        "date": dt.isoformat(),
        "pdf_filenames": pdf_filenames,
        "has_pdf": has_pdf,
    }


# ─── Supabase ─────────────────────────────────────────
def get_existing_gmail_ids(table="kb_articles"):
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
    return set()


def upsert_to_supabase(table, record):
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
    parser.add_argument("--all", action="store_true", help="Also match 'subject:Research' without brackets")
    args = parser.parse_args()

    print("Connecting to Gmail...")
    service = get_gmail_service()

    query = 'subject:[Research]'
    if args.all:
        query = 'subject:Research OR subject:[Research]'
    print(f"Searching: {query}")

    results = service.users().messages().list(
        userId="me", q=query, maxResults=args.max
    ).execute()

    messages = results.get("messages", [])
    if not messages:
        print("No tagged emails found.")
        return

    print(f"Found {len(messages)} email(s)")

    existing = get_existing_gmail_ids("kb_articles")
    print(f"Already ingested: {len(existing)} email(s)")

    new_count = 0
    skip_count = 0

    for msg_meta in messages:
        msg_id = msg_meta["id"]
        if msg_id in existing:
            skip_count += 1
            continue

        msg = service.users().messages().get(
            userId="me", id=msg_id, format="full"
        ).execute()

        parsed = parse_email(service, msg)

        # Skip non-research emails (Google Cloud notifications, etc.)
        skip_keywords = ["reinstated", "google cloud platform", "suspended", "billing", "your project has been"]
        body_lower = parsed["body"][:500].lower()
        subj_lower = parsed["subject"].lower()
        if any(kw in subj_lower or kw in body_lower for kw in skip_keywords):
            print(f"  SKIP (non-research): {parsed['subject'][:60]}")
            skip_count += 1
            continue

        print(f"\n{'[DRY RUN] ' if args.dry_run else ''}Processing: {parsed['subject']}")
        print(f"  Category: {parsed['category']} → kb_articles")
        print(f"  Date: {parsed['date']}")
        print(f"  URLs: {len(parsed['urls'])}")
        if parsed["has_pdf"]:
            print(f"  PDFs: {', '.join(parsed['pdf_filenames'])}")
        if parsed['urls']:
            for u in parsed['urls'][:3]:
                print(f"    {u}")

        if args.dry_run:
            new_count += 1
            continue

        uid = f"gmail_{msg_id}"

        tags = [parsed["category"]]
        if parsed["has_pdf"]:
            tags.append("pdf-attachment")

        record = {
            "id": uid,
            "gmail_id": msg_id,
            "title": parsed["subject"],
            "content": parsed["body"][:5000],
            "source_url": parsed["urls"][0] if parsed["urls"] else None,
            "source_type": "paper" if parsed["has_pdf"] else ("article" if parsed["urls"] else "note"),
            "category": parsed["category"],
            "tags": tags,
            "date": parsed["date"][:10],
            "created_at": parsed["date"],
        }

        if upsert_to_supabase("kb_articles", record):
            print(f"  \u2713 Saved to kb_articles")
            new_count += 1
        else:
            print(f"  \u2717 Failed")

    print(f"\nDone. New: {new_count}, Skipped (already ingested): {skip_count}")


if __name__ == "__main__":
    main()
