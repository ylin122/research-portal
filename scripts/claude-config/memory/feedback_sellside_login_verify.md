---
name: verify-sell-side-broker-auth-with-a-real-query-not-the-state-json-mtime-watcher
description: "In /sellside-login, a broker is only confirmed authed after the Step 4 re-preflight (a real query) — the state.json-mtime watcher only proves login.js wrote the file, not that the session is valid"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 30638a58-24fc-4e4a-affc-70841e38df8f
---

When driving /sellside-login, the state.json mtime-refresh signal (the Step 3 "done" watcher) only proves login.js finished and wrote the session file — NOT that the session is valid. login.js writes state.json on timeout / partial failure too.

**Why:** On 2026-05-21, BofA's login.js wrote a fresh state.json (the mtime watcher reported "bofa=ok"), so I told the user "BofA re-authed cleanly." The Step 4 re-preflight then showed BofA still dead ("HTML wrapper / login page returned") — the earlier run had hit a page-expired ERR_ABORTED and saved an invalid session. The premature "cleanly" claim misled the user.

**How to apply:** Treat the mtime watcher as "login.js finished," not "broker authed." Only call a broker authed/working after the Step 4 re-preflight (or a real `query.js` search / auth-check) confirms it. Until then, say "session file written — verifying," not "re-authed." Related: [[feedback_cross_machine_workflows]].
