---
name: Auto-open localhost on project start
description: Always start vercel dev and open localhost in Chrome when user begins working on PA dashboard or research portal
type: feedback
originSessionId: 5a8fbd21-1d4e-494c-96b4-5342a2923a64
---
When the user says "work on PA dashboard" or "work on research portal", automatically:
1. Start `vercel dev` for that project (if not already running)
2. Open the localhost URL in Chrome via `powershell -Command "Start-Process 'chrome' 'http://localhost:PORT'"`

**Why:** User expects the app to be running and visible immediately when they start working. Don't wait for them to ask.

**How to apply:**
- PA dashboard: `cd ~/pa-dashboard && npx vercel dev --listen 5173` → open http://localhost:5173
- Research portal: `cd ~/research-portal/research-portal-app && npx vercel dev --listen 5174` → open http://localhost:5174
- Use dedicated ports: 5173 for PA dashboard, 5174 for research portal — never share
- Kill any conflicting process on the target port first
- Use PowerShell to open Chrome (not cmd.exe — see feedback_chrome_default.md)
