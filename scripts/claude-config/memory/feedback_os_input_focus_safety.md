---
name: OS-level keystroke automation requires verified focus
description: When using PowerShell SendKeys / Win32 SendInput to drive a browser login, NEVER send keys without triple-verifying focus is on the intended input element
type: feedback
originSessionId: 255928e0-cd22-45f3-9c16-d3fe51bea44e
---
**Rule:** OS-level keyboard automation in browser login scripts must verify focus at three layers before sending any keys:

1. **URL check** — current URL must match expected login-page pattern (`/login|signin|auth/i`)
2. **Input element check** — Playwright must find a visible, non-readonly input element
3. **Active element check** — `document.activeElement.tagName === 'INPUT'` after clicking to focus

PowerShell side ALSO verifies: after `SetForegroundWindow`, `GetForegroundWindow()` must equal the target handle before SendKeys fires.

If any guard fails, fall back to manual prompt — never send keys.

**Why:** 2026-05-19 incident — TB login OS-level automation typed username + password into Chrome's address bar because focus wasn't on the form. Enter then triggered a Google search with credentials in the URL. Password ended up in Chrome URL history + Google search logs; user had to immediately rotate credentials.

**How to apply:** Reference implementation lives in `~/third-party-research-tools/bin/os-input.ps1` (PS guard) and `~/third-party-research-tools/thirdbridge/login.js` (Node guards). Reuse this pattern any time OS-level input is wired into a new login script.
