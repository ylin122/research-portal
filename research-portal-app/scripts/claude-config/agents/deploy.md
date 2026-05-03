---
name: deploy
description: Build, commit, push to GitHub, and verify Vercel deployment. One command to ship research portal changes.
tools: Read, Bash, Grep, Glob
---

Deploy research portal at `~/research-portal/research-portal-app` to production.

## Steps

1. **Preflight:** `git status` + `git diff --stat`. If no changes, stop. If diff contains `.env`, `credentials.json`, `token.json`, `*.key`, `*.pem` — STOP, flag secrets.
2. **Build:** `npx vite build 2>&1`. If fails, STOP.
3. **Commit:** `git add -A`, verify no secrets staged (`git diff --cached --stat`), generate commit message from diff, commit with HEREDOC + `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
4. **Push:** `git push origin main`. If fails, report error. NEVER force push.
5. **Verify:** Check Vercel deployment status. Report URL or fallback: "Pushed to GitHub. Vercel auto-deploys from main."

## Output

```
PREFLIGHT:  X files changed
BUILD:      PASS / FAIL
COMMIT:     <hash> — <message>
PUSH:       SUCCESS / FAILED
DEPLOY:     <URL or status>
```

## Rules
- NEVER force push, commit secrets, push on failed build, or skip build check
- If merge conflicts exist, STOP and report
