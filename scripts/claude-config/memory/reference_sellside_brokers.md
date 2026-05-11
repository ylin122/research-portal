---
name: Sell-side broker tools setup
description: Sell-side login + research scrapers — git repo location, login pattern, broker-specific quirks, output target
type: reference
originSessionId: 71d3351a-c0d2-4ee0-9971-b7cf23a5a289
---

**Repo:** `https://github.com/ylin122/sellside-broker-tools` (private). Local path on every machine: `~/sellside-broker-tools/`. Cloned fresh per machine — `state.json`, `.env`, `browser-profile/` are device-bound and gitignored.

**Layout:**
```
~/sellside-broker-tools/
├── bin/
│   ├── preflight.mjs        # parallel auth status across all 8
│   ├── setup-machine.ps1    # new-machine bootstrap (npm install + .env prompts)
│   └── log.mjs              # shared download event logger
├── gs/                      # 8 broker dirs (gs, ms, jpm, barclays, bofa, db, citi, wf)
│   ├── login.js             # diag-login pattern + trust-cookie preservation (where applicable)
│   ├── query.js             # search / report / download / api subcommands
│   ├── package.json + package-lock.json
│   ├── .env                 # gitignored — credentials
│   ├── state.json           # gitignored — session cookies, device-bound
│   └── browser-profile/     # gitignored — Playwright profile, device-bound
```

**Global slash commands (synced via dotclaude):**
- `~/.claude/commands/sellside-login.md` — auth orchestrator
- `~/.claude/commands/sellside.md` — parallel research sweep for a company

**Output target:** `C:\Users\willi\sellside-research\[Company Name]\` (local, NOT git-tracked, NOT cloud-synced — the user manually decides what to publish via Research Portal).

**Per-broker `query.js download` ID format:**
- gs: HTML report path (`/content/research/en/reports/.../X.html`)
- ms: GUID (36-char)
- jpm: document-id (`GPS-XXXXXXX-0`)
- barclays: pubId
- bofa: company keyword (full name like "Meta Platforms" — daily briefs are filtered out)
- db: documentKey (`2795-...-YYYYMMDD`)
- citi: pubId (numeric, e.g., `30425389`)
- wf: encrypt-id

**Broker-specific quirks:**
- **GS** — `download` needs `headless: false` + `--disable-http2` (PDF endpoint trips HTTP2 errors). SSO auto-refresh if session-exchange returns 401.
- **MS** — MUST use MFA URL `https://login.matrix.ms.com/public/login-mfa/webapp/public_Login`. The default `/login-email/webapp/entry` triggers email verification (requires work email). PDF download via in-page XHR (not `fetch()` or `context.request.get()` — those fail silently).
- **JPM** — full company names ("Meta Platforms" not "META", "Alphabet" not "Google"). Without "Platforms", search matches "Metals".
- **Barclays** — env var is `BARCLAYS_USERNAME` (NOT `BARC_USERNAME` like at work).
- **BofA** — TWO-STAGE auth. Stage 1: standard login. Stage 2: email-token gate on `/two-factor`. Trust cookies `UID_PRD`+`PINAUTH_PRD` on `.ml.com` (90-day TTL) bypass stage 2 once trusted. login.js loads existing state.json to preserve. `report`/`download` subcommand filters out daily briefs (Morning Notes, QuickNotes, Closing Bell) and prefers articles where title contains the company keyword.
- **DB** — `research.db.com`. No programmatic login auto-fill; user logs in manually. **Search is CASE-SENSITIVE on company names** — `CoreWeave` returns 0 but `Coreweave` returns full match. query.js auto-retries with title-case when no companies match. Use `MSYS_NO_PATHCONV=1` prefix on git-bash to avoid path mangling on /api/ routes.
- **Citi** — `citivelocity.com/login/`. Search uses `contentType: 'Research'` only. PDFs at `ir.citi.com` need signed URLs via `/cvr/encodeFileLink.action` — `download` handles this automatically.
- **WF** — login URL `research.wellsfargosecurities.com` (NOT `wellsfargo.bluematrix.com`). `sspfid` cookie has hard 1-hour TTL. Trust cookies `at_ex2`+`at_ex2_42724` on `.bluematrix.com` (TTL ~2027) bypass the email-token gate once trusted. login.js loads existing state.json + auto-fills credentials from .env. **Search only matches by TICKER, not company name** — code falls back to text-matched docs and also retries uppercase keyword.

**New-machine setup:**
```powershell
git clone https://github.com/ylin122/sellside-broker-tools.git "$HOME\sellside-broker-tools"
cd "$HOME\sellside-broker-tools"
.\bin\setup-machine.ps1
# Then in Claude Code: /sellside-login
```

**How auth works (diag-login pattern):**
1. Open broker portal URL (with state.json preloaded if exists, to preserve trust cookies)
2. User logs in manually (auto-fill credentials from .env where supported)
3. Script polls every 5s for URL/cookies/title
4. When URL leaves login domain AND cookies > N, script makes a real API call to verify
5. If API returns JSON (not HTML login wall), save state.json and exit

**Session log:** `download` writes a JSON line to `~/sellside-research/.log` per successful save — useful for spotting silent failures across brokers.

**Working at HOME machine confirmed 2026-05-11. Repo created + pushed 2026-05-11.**
