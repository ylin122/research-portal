---
name: no visible terminal windows
description: Launch background processes hidden — never spawn visible cmd/PowerShell windows the user didn't ask for
type: feedback
originSessionId: 223d4e6d-d42a-4579-ada3-c5bc7fc59b13
---
When launching long-running processes (dev servers, login scripts, etc.) on this Windows machine, run them in **hidden background mode** — not in visible cmd/PowerShell windows.

**Why:** User finds unexpected terminal windows confusing and disruptive — they didn't open them and don't want to manage them.

**How to apply:**
- Default: `Start-Process -WindowStyle Hidden` (gives a TTY parent without showing a window) — this combines the stability of a real shell parent with no visual clutter.
- If a process specifically needs an interactive console (e.g., a one-time manual login flow that prompts the user), surface that need explicitly and ask before opening a window.
- Do NOT use bash `nohup ... &` + `disown` for `vercel dev` on this machine — the lack of TTY caused subprocess-management crashes in Apr 2026.
