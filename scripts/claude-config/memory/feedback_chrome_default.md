---
name: Default browser is Chrome
description: Open URLs in Chrome via PowerShell Start-Process — cmd.exe method is unreliable
type: feedback
---

Always open URLs in Google Chrome using PowerShell:
```
powershell -Command "Start-Process 'chrome' 'http://...'"
```

**Why:** `cmd.exe /c start chrome` silently fails on this machine. PowerShell `Start-Process` works consistently.
**How to apply:** Any time you need to open a URL in the browser, use the PowerShell method above.
