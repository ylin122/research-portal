---
name: User Workflow Preferences
description: How the user prefers to work — batch company additions, UI iteration, and deployment workflow
type: feedback
---

- User prefers batch company additions via insert scripts (node .cjs files using dotenv + supabase-js). Don't ask user to paste SQL into Supabase dashboard — they found that painful.
- When adding companies, take best guess on sector/sub-sector. User will correct if wrong.
- Always push to GitHub after changes so Vercel auto-deploys.
- Start dev server (npm run dev) for UI preview before pushing.
- User iterates quickly on UI — make changes, verify build, push. Don't over-discuss before implementing.
- Terminal paste doesn't work well for user (Ctrl+Shift+V issues). Avoid asking user to paste content into terminal.
- User prefers concise briefs — bullet format, no periods, portfolio-manager tone. Section 7 (financials) always left empty.
- When verifying data (like public/private), use web search to confirm rather than relying on training data alone.

**Why:** User moves fast and wants to see changes immediately. The less friction in the workflow, the better.

**How to apply:** Default to implementing and showing results rather than asking for confirmation. Use insert scripts for data, push to GitHub for code, and always verify the build passes before pushing.
