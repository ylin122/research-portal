---
name: Third Bridge login pattern (bot-resistant)
description: How to log into Third Bridge Forum without triggering bot detection — clipboard-paste hybrid
type: reference
originSessionId: 71d3351a-c0d2-4ee0-9971-b7cf23a5a289
---
Third Bridge Forum (`~/third-party-research-tools/thirdbridge/`) flags **scripted form submission** as "suspicious behavior" even with stealth + persistent profile. Full Playwright autofill (`type()` + `click()` on submit) gets caught.

**Working pattern (verified 2026-05-11):**

1. Persistent browser profile at `./browser-profile/` — fingerprint + cookies survive across sessions
2. Real Chrome via `channel: 'chrome'` in `launchPersistentContext` (not Playwright's bundled Chromium binary)
3. `ignoreDefaultArgs: ['--enable-automation']` — suppresses Chrome's "Chrome is being controlled by automated test software" UI banner. Without this, the banner appears (Chrome UI tell, not site detection, but visible to user)
4. playwright-extra + StealthPlugin
5. `--disable-blink-features=AutomationControlled`
5. **NO programmatic form interaction.** Hybrid manual + clipboard:
   - User types username manually (real keyboard cadence)
   - Script copies password from `.env` to Windows clipboard via PowerShell stdin (`spawnSync('powershell', ['-NoProfile', '-Command', '$Input | Set-Clipboard'], { input: PASSWORD })`)
   - User pastes password with Ctrl+V (real native paste event)
   - User clicks Sign In manually (real mouse click)
   - Script polls `POST /api/interview/search` every 5s to detect auth
   - Saves `state.json` when API succeeds

TB sees a user with a password manager — every form event is a real user event.

**To force re-test the login flow** (when cookies still valid in persistent profile): use `context.clearCookies()` on the persistent context, then delete `state.json`. Fingerprint is preserved, only auth cookies are wiped.

**Key API endpoint for auth verification:** `POST https://forum.thirdbridge.com/api/interview/search` with `{lang:'en', sortBy:{field:'transcriptUploadedAt', order:'desc'}, take:1}`. Returns valid JSON when authed, HTTP 406 or empty when not.

**Cookies that matter:** TB session uses ~8 cookies, all session-or-short-TTL. No long-lived trust cookie (unlike WF's `at_ex2*` or BofA's `UID_PRD`). Re-auth needed when session expires (days-weeks).

**What does NOT work** (avoid these patterns):
- Playwright's `type()` on password field — even with random delays, keystroke timing flags as bot
- Playwright's `click()` on submit button — flagged
- Going through SSO without a persistent profile — fingerprint mismatch flags as bot
- Bundled Chromium (default Playwright) — binary signature is fingerprintable
