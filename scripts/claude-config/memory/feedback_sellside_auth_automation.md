---
name: Sell-side broker auth is fully automated — no MFA push
description: Reauth flow for all 8 sell-side brokers — credentials in .env, scripts auto-fill+submit, no MFA push approval needed; only BofA has a 2nd-step email token. WF must be logged in last (1hr TTL).
type: feedback
originSessionId: 54fe5db5-1677-46b8-9409-828c34e6eb5f
---
# Sell-side broker re-auth is fully automated

All 8 broker `login.js` scripts at `~/sellside-broker-tools/<broker>/` must:
- Read `<BROKER>_USERNAME` and `<BROKER>_PASSWORD` from `.env`
- Auto-fill the form and click submit
- Wait for the session cookie to materialize, save `state.json`, exit

**No MFA push approval is needed for ANY broker.** Do NOT print "approve MFA on your phone", "complete MFA push manually", or wait for the user. Submit and poll for cookies.

The ONLY user interaction required:
- **BofA**: 2nd-step email token. After credentials submit, BofA emails a code that the user types into the page. Script's STAGE 2 polls for the two-factor URL/title and waits for the user to enter the code from work email.

**WF login must be done last** — its `sspfid` cookie has a hard 1-hour TTL. Logging WF in first burns the clock before any research runs.

**Why:** The user has had to walk me through this multiple times because earlier login scripts (MS, Barclays, BofA) were written as "open browser, wait for manual login" and I kept treating MFA push as required. The credentials are stored locally, the brokers don't actually need MFA push for these accounts, and the WF/GS scripts already prove the autofill pattern works. The pattern: dotenv → env vars → `tryAutofill()` that fills `input[type=text|email|user-ish]` + `input[type=password]` and clicks `button[type=submit]` or similar.

**How to apply:**
- On any future re-auth (preflight reports broker dead → relaunch), use the same autofill scripts. Do not introduce manual-login wording.
- If a new broker is added, its `login.js` should follow the WF/GS/MS/Barclays/BofA-stage-1 pattern: autofill + auto-submit. The only exception is BofA's STAGE 2 email token.
- Console messages should say "auto-fill from .env, waiting for session cookies" — NOT "complete MFA on phone".
- If a real MFA push ever shows up on a broker portal that previously didn't have one, surface it as a CHANGE to investigate, not a normal step.
