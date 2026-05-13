---
name: Auto-open localhost on project start
description: Always start the dev server and open localhost in Chrome when user begins working on PA Dashboard or Research Portal
metadata:
  type: feedback
originSessionId: 5a8fbd21-1d4e-494c-96b4-5342a2923a64
---
When the user says "work on PA Dashboard" or "work on Research Portal", automatically start the dev server (if not already running) and open the localhost URL in Chrome.

**Why:** User expects the app to be running and visible immediately when they start working.

**Fast path:** Invoke the `dev` skill (or run `~/dotclaude/scripts/open-projects.ps1`) — it handles both projects in one shot, warm path ≈ 0.5s, cold path ≈ 4-5s. Trigger: `/dev`, "open the projects", "open localhost", "let's work on...". Built 2026-05-13 to replace the manual probe-start-poll dance.

**How to apply (manual fallback, if skill is unavailable):**
- **PA Dashboard:** `cd ~/projects/pa-dashboard && npm run dev` → http://localhost:**3001**
- **Research Portal:** `cd ~/projects/research-portal && npm run dev` → http://localhost:**3000**
- Both projects pin their ports in `vite.config.js` (`server.port` + `strictPort: true`) so collisions are impossible — if startup fails with EADDRINUSE, find and kill the stale process, do not fall back to a different port.
- Use `npm run dev` (Vite), **not** `vercel dev`. Vite is faster and is what the projects need locally. Only use `vercel dev` if testing serverless API routes that require Vercel emulation.
- Open Chrome via `Start-Process chrome.exe http://localhost:<port>` per [[feedback_chrome_default]].
- Launch the dev server hidden per [[feedback_no_windows]]. **Critical:** child `powershell.exe` processes spawned via `Start-Process -WindowStyle Hidden` inherit a restricted execution policy that blocks `npm.ps1`. Always pass `-ExecutionPolicy Bypass` to the child shell, e.g. `Start-Process powershell.exe -WindowStyle Hidden -ArgumentList "-ExecutionPolicy","Bypass","-Command","cd <path>; npm run dev" -RedirectStandardOutput <log> -RedirectStandardError <log>`. Without it the child dies silently with no log file.
- **Always confirm the title in the served HTML matches the project before reporting "ready"** (`<title>YL Research Portal</title>` vs `<title>PA Dashboard</title>`). This prevents the "wrong project opened" failure mode that happened 2026-05-06 / 2026-05-07.
- Port assignment confirmed 2026-05-13 from `vite.config.js` and project-level `CLAUDE.md` (was previously 5173/5180; corrected to 3001/3000).
