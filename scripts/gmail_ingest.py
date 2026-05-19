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
import json
import base64
import re
import time
import argparse
import tempfile
import contextlib
from datetime import datetime, timezone
from functools import lru_cache
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
TAG_SELLSIDE = "[Sellside]"  # → sellside_articles table

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


# ─── URL canonicalization & subject-pattern dedup ─────
# Short-link / share-link URL patterns. Two different short URLs can resolve
# to the same canonical article, so we follow redirects before dedup.
URL_SHORT_PATTERNS = [
    re.compile(r"^https?://substack\.com/home/post/p-\d+", re.IGNORECASE),
    re.compile(r"^https?://open\.substack\.com/pub/", re.IGNORECASE),
    re.compile(r"^https?://t\.co/", re.IGNORECASE),
    re.compile(r"^https?://lnkd\.in/", re.IGNORECASE),
    re.compile(r"^https?://bit\.ly/", re.IGNORECASE),
    re.compile(r"^https?://buff\.ly/", re.IGNORECASE),
]

# Tracking params stripped from canonicalized URLs so query-only differences
# don't break dedup (`?utm_medium=ios` vs `?triedRedirect=true`, etc.).
TRACKING_PARAM_KEYS = {
    "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
    "triedRedirect", "r", "ref", "src", "source", "share",
}

# Generic subject patterns that should trigger title fallback. Substack share
# links often arrive with subject `P 195466534` (the raw post ID) instead of
# the article title — treat those as generic.
GENERIC_SUBJECT_PATTERNS = [
    re.compile(r"^P\s+\d+$", re.IGNORECASE),
    re.compile(r"^p-\d+$", re.IGNORECASE),
]
GENERIC_SUBJECT_LITERALS = {"research", "fwd:", "fwd", "fw:", "fw", "re:", "re"}


def is_generic_subject(s: str) -> bool:
    if not s:
        return True
    s = s.strip()
    if s.lower() in GENERIC_SUBJECT_LITERALS:
        return True
    return any(p.match(s) for p in GENERIC_SUBJECT_PATTERNS)


def strip_tracking_params(url: str) -> str:
    if "?" not in url:
        return url
    base, qs = url.split("?", 1)
    keep = []
    for pair in qs.split("&"):
        if not pair:
            continue
        k = pair.split("=", 1)[0]
        if k in TRACKING_PARAM_KEYS:
            continue
        keep.append(pair)
    return base + ("?" + "&".join(keep) if keep else "")


@lru_cache(maxsize=2048)
def canonicalize_url(url: str) -> str:
    """Follow redirects + strip tracking params for known short-link patterns.
    Returns the original URL on network failure so the pipeline never blocks."""
    if not url or not any(p.match(url) for p in URL_SHORT_PATTERNS):
        return url
    try:
        # HEAD is faster but Substack 405s on some shapes — fall back to GET.
        try:
            r = httpx.head(url, follow_redirects=True, timeout=10.0)
            if r.status_code >= 400:
                raise httpx.HTTPError(f"HEAD {r.status_code}")
        except (httpx.HTTPError, httpx.RequestError):
            r = httpx.get(url, follow_redirects=True, timeout=10.0)
        return strip_tracking_params(str(r.url))
    except Exception as e:
        print(f"  WARN: canonicalize failed for {url}: {e}")
        return url


def slug_from_url(url: str) -> str:
    """Pull a human-readable title slug from a (canonical) URL's last path segment."""
    slug = url.rstrip("/").split("/")[-1].split("?")[0]
    # Trim Substack's `p-<id>-` prefix if present
    slug = re.sub(r"^p-\d+-?", "", slug)
    if len(slug) < 5:
        return ""
    return slug.replace("-", " ").replace("_", " ").title()[:120]


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
    for tag in [TAG_RESEARCH, TAG_SELLSIDE,
                "[Research]", "[research]", "[RESEARCH]",
                "[Sellside]", "[sellside]", "[SELLSIDE]",
                "[RW]", "[rw]"]:
        clean_subject = clean_subject.replace(tag, "").strip()

    # Get body text
    body = decode_body(msg["payload"])
    urls = extract_urls(body)

    # If subject is empty or generic after stripping, try to extract title from body content
    if is_generic_subject(clean_subject):
        clean_subject = ""
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
        # If still generic, canonicalize the URL and use its slug (much more
        # meaningful than a raw `p-<id>` share-link slug).
        if is_generic_subject(clean_subject):
            for u in urls:
                slug = slug_from_url(canonicalize_url(u))
                if slug:
                    clean_subject = slug
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


def get_existing_source_urls(table="kb_articles"):
    """Pull (gmail_id, source_url) pairs for canonical-URL dedup."""
    r = httpx.get(
        f"{SUPABASE_URL}/rest/v1/{table}?select=gmail_id,source_url&source_url=not.is.null",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
        },
        timeout=30,
    )
    if r.status_code == 200:
        return [(row["gmail_id"], row["source_url"]) for row in r.json()]
    return []


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


# ─── Followups ────────────────────────────────────────
FOLLOWUPS_PATH = SCRIPT_DIR / "followups.json"
FOLLOWUPS_LOCK = SCRIPT_DIR / "followups.json.lock"


@contextlib.contextmanager
def _file_lock(lock_path: Path, timeout: float = 30.0):
    """Cross-platform exclusive lock via O_CREAT|O_EXCL on a sidecar lockfile.
    Steals locks older than `timeout` so a crashed prior run can't deadlock
    the pipeline. Lockfile is .gitignored."""
    start = time.time()
    fd = None
    while fd is None:
        try:
            fd = os.open(str(lock_path), os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        except FileExistsError:
            try:
                age = time.time() - lock_path.stat().st_mtime
                if age > timeout:
                    print(f"  WARN: stealing stale lock {lock_path.name} (age {age:.0f}s)")
                    lock_path.unlink()
                    continue
            except FileNotFoundError:
                continue  # race: prior holder cleaned up between stat and unlink
            if time.time() - start > timeout:
                raise TimeoutError(f"Could not acquire {lock_path} within {timeout}s")
            time.sleep(0.2)
    try:
        os.write(fd, str(os.getpid()).encode())
        yield
    finally:
        try:
            os.close(fd)
        except OSError:
            pass
        try:
            lock_path.unlink()
        except FileNotFoundError:
            pass


def _atomic_write_json(path: Path, data: dict) -> None:
    """Write JSON via temp file + os.replace (atomic on POSIX and Windows)."""
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(data, indent=2), encoding="utf-8")
    os.replace(str(tmp), str(path))


def check_followups(new_titles):
    """Scan followups.json: print any open items, and flag any whose
    trigger_regex matches a title ingested this run. Auto-close matched items.
    Read+write happen inside a file lock so concurrent ingests (e.g. from two
    machines) don't lose each other's closed-item updates."""
    if not FOLLOWUPS_PATH.exists():
        return
    with _file_lock(FOLLOWUPS_LOCK):
        try:
            data = json.loads(FOLLOWUPS_PATH.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"\nWARN: followups.json unreadable: {e}")
            return

        items = data.get("items", [])
        open_items = [x for x in items if x.get("status") == "open"]
        if not open_items:
            return

        print("\n─── Open followups ───")
        changed = False
        for it in open_items:
            rx = it.get("trigger_regex")
            match = None
            if rx and new_titles:
                try:
                    pat = re.compile(rx)
                    for t in new_titles:
                        if pat.search(t):
                            match = t
                            break
                except re.error as e:
                    print(f"  WARN: bad regex in followup {it.get('id')}: {e}")
            marker = "✓ MATCHED" if match else "·"
            print(f"  {marker} [{it.get('id')}] {it.get('note', '')[:90]}")
            if match:
                print(f"     → matched newly-ingested: {match}")
                it["status"] = "closed"
                it["closed_at"] = datetime.now(timezone.utc).date().isoformat()
                it["closed_by_title"] = match
                changed = True
        if changed:
            _atomic_write_json(FOLLOWUPS_PATH, data)
            print("  (followups.json updated — matched items auto-closed)")


# ─── Main ─────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Gmail → Supabase Research Wiki / Sellside Ingest")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing to Supabase")
    parser.add_argument("--max", type=int, default=50, help="Max emails to process (default: 50)")
    parser.add_argument("--all", action="store_true", help="Also match the tag without brackets (e.g. 'subject:Research')")
    parser.add_argument("--sellside", action="store_true", help="Ingest [Sellside] tagged emails into sellside_articles instead of [Research]/kb_articles")
    args = parser.parse_args()

    print("Connecting to Gmail...")
    service = get_gmail_service()

    if args.sellside:
        table_name = "sellside_articles"
        query = 'subject:[Sellside]'
        if args.all:
            query = 'subject:Sellside OR subject:[Sellside]'
    else:
        table_name = "kb_articles"
        query = 'subject:[Research]'
        if args.all:
            query = 'subject:Research OR subject:[Research]'
    print(f"Searching: {query}  →  table: {table_name}")

    results = service.users().messages().list(
        userId="me", q=query, maxResults=args.max
    ).execute()

    messages = results.get("messages", [])
    if not messages:
        print("No tagged emails found.")
        return

    print(f"Found {len(messages)} email(s)")

    existing = get_existing_gmail_ids(table_name)
    print(f"Already ingested: {len(existing)} email(s)")

    # Build canonical-URL → gmail_id map from existing rows for cross-share-link
    # dedup (e.g., substack.com/home/post/p-X and open.substack.com/pub/Y/p/X
    # both resolve to the same canonical post).
    canonical_to_gmail = {}
    for gid, surl in get_existing_source_urls(table_name):
        c = canonicalize_url(surl)
        canonical_to_gmail.setdefault(c, gid)

    new_count = 0
    skip_count = 0
    new_titles = []  # for followup matching at end of run

    for msg_meta in messages:
        msg_id = msg_meta["id"]
        if msg_id in existing:
            skip_count += 1
            continue

        msg = service.users().messages().get(
            userId="me", id=msg_id, format="full"
        ).execute()

        parsed = parse_email(service, msg)

        # In sell-side mode, the PDF is the report; the email body is usually
        # just a forwarding wrapper (signature + work disclaimer). Drop body
        # text and body-derived URLs when a PDF is attached so the stored
        # `content` is the report only.
        if args.sellside and parsed["has_pdf"]:
            body_text = parsed["body"]
            marker_idx = body_text.find("\n\n--- ")
            if marker_idx > 0:
                parsed["body"] = body_text[marker_idx + 2:].strip()
            parsed["urls"] = []

        # Skip non-research emails (Google Cloud notifications, etc.)
        skip_keywords = ["reinstated", "google cloud platform", "suspended", "billing", "your project has been"]
        body_lower = parsed["body"][:500].lower()
        subj_lower = parsed["subject"].lower()
        if any(kw in subj_lower or kw in body_lower for kw in skip_keywords):
            print(f"  SKIP (non-research): {parsed['subject'][:60]}")
            skip_count += 1
            continue

        # Canonicalize the primary URL (follow share-link redirects, strip
        # tracking params) and dedup against any existing row pointing to the
        # same article. This catches re-forwards of the same Substack post.
        # Applies to BOTH --research and --sellside modes (the dedup map is
        # built per-table from get_existing_source_urls(table_name)). For
        # sellside-with-PDF, parsed["urls"] is cleared above so this block is
        # a no-op — PDF-content dedup would be a separate concern.
        canonical_url = None
        if parsed["urls"]:
            canonical_url = canonicalize_url(parsed["urls"][0])
            if canonical_url in canonical_to_gmail:
                print(f"  SKIP (duplicate of {canonical_to_gmail[canonical_url]}): {parsed['subject'][:60]}")
                skip_count += 1
                continue
            canonical_to_gmail[canonical_url] = msg_id

        print(f"\n{'[DRY RUN] ' if args.dry_run else ''}Processing: {parsed['subject']}")
        print(f"  Category: {parsed['category']} → {table_name}")
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
            "source_url": canonical_url if canonical_url else (parsed["urls"][0] if parsed["urls"] else None),
            "source_type": "paper" if parsed["has_pdf"] else ("article" if parsed["urls"] else "note"),
            "category": parsed["category"],
            "tags": tags,
            "date": parsed["date"][:10],
            "created_at": parsed["date"],
        }
        # broker / analyst / tickers are filled in by the sellside-research-ingest
        # analysis step (Claude reads the PDF / email body and identifies them).
        # Leaving them NULL here so the table is dedup-safe on re-ingest.

        if upsert_to_supabase(table_name, record):
            print(f"  \u2713 Saved to {table_name}")
            new_count += 1
            new_titles.append(parsed["subject"])
        else:
            print(f"  \u2717 Failed")

    print(f"\nDone. New: {new_count}, Skipped (already ingested): {skip_count}")

    # Print followups status (matches against newly-ingested titles + any open queue items)
    check_followups(new_titles)


if __name__ == "__main__":
    main()
