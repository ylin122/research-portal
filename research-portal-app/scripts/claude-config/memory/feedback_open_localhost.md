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
- PA dashboard: `cd ~/projects/pa-dashboard && vercel dev --listen 3000` → open http://localhost:3000
- Research portal: `cd ~/projects/research-portal && vercel dev --listen 3001` → open http://localhost:3001
- Use dedicated ports: 3000 for PA dashboard, 3001 for research portal — never share
- Kill any conflicting process on the target port first
- Use PowerShell to open Chrome (not cmd.exe — see feedback_chrome_default.md)
- Yarn is installed globally so `vercel dev`'s "Creating initial build" step works for both projects
