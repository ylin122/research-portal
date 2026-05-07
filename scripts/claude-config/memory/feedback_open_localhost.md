---
name: Auto-open localhost on project start
description: Always start the dev server and open localhost in Chrome when user begins working on PA Dashboard or Research Portal
type: feedback
originSessionId: 5a8fbd21-1d4e-494c-96b4-5342a2923a64
---
When the user says "work on PA Dashboard" or "work on Research Portal", automatically start the dev server (if not already running) and open the localhost URL in Chrome.

**Why:** User expects the app to be running and visible immediately when they start working.

**How to apply:**
- **PA Dashboard:** `cd ~/projects/pa-dashboard && npm run dev` → http://localhost:**5173**
- **Research Portal:** `cd ~/projects/research-portal && npm run dev` → http://localhost:**5180**
- Both projects pin their ports in `vite.config.js` (`server.port` + `strictPort: true`) so collisions are impossible — if startup fails with EADDRINUSE, find and kill the stale process, do not fall back to a different port.
- Use `npm run dev` (Vite), **not** `vercel dev`. Vite is faster and is what the projects need locally. Only use `vercel dev` if testing serverless API routes that require Vercel emulation.
- Open Chrome via `Start-Process chrome.exe http://localhost:<port>` per feedback_chrome_default.md.
- Launch the dev server hidden per feedback_no_windows.md (`Start-Process powershell.exe -WindowStyle Hidden ...`).
- **Always confirm the title in the served HTML matches the project before reporting "ready"** (`<title>YL Research Portal</title>` vs `<title>PA Dashboard</title>`). This prevents the "wrong project opened" failure mode that happened 2026-05-06 / 2026-05-07.
