---
name: Third-party research tools setup
description: Third-party research scrapers — git repo location, login flows, per-tool quirks
type: reference
originSessionId: 71d3351a-c0d2-4ee0-9971-b7cf23a5a289
---
**Repo:** `https://github.com/ylin122/third-party-research-tools` (private). Local path on every machine: `~/third-party-research-tools/`. Cloned fresh per machine — `state.json`, `.env`, `browser-profile/` are device-bound and gitignored.

**Layout:**
```
~/third-party-research-tools/
├── bin/
│   ├── preflight.mjs        # parallel auth status across all 4 tools
│   └── setup-machine.ps1    # new-machine bootstrap
├── reorg/                   # Reorg / Octus
├── 9fin/                    # 9fin
├── creditsights/            # CreditSights / LevFin / Covenant Review (Fitch SSO)
└── thirdbridge/             # Third Bridge Forum (special bot-resistant login — see reference_thirdbridge_login.md)
```

**Used by:** `@third-party-research` Claude Code agent (~/.claude/agents/third-party-research.md).

**Per-tool quirks:**
- **Reorg / Octus** — focused on distressed/restructuring/credit. Won't have IG mega-cap coverage. Standard SSO login.
- **9fin** — leveraged finance + news. Sessions can be flaky; click around in product before signaling done. IG names typically have entity records but no editorial news.
- **CreditSights / LevFin / Covenant Review** — Fitch Group SSO at `auth.fitch.group`. login.js uses diag-login pattern (auto-detect via `POST /api/common/v1/issuers`). Note: some Covenant Review loan reports may show locked (entitlement, not auth).
- **Third Bridge** — special handling (see `reference_thirdbridge_login.md`). Persistent profile + real Chrome + clipboard-paste, no scripted form submission.

**New-machine setup:**
```powershell
git clone https://github.com/ylin122/third-party-research-tools.git "$HOME\third-party-research-tools"
cd "$HOME\third-party-research-tools"
.\bin\setup-machine.ps1
# Then log into each tool: node reorg/login.js, etc.
# Verify with: node .\bin\preflight.mjs
```

**Auth verification API endpoints (used by preflight and login diag-detection):**
- Reorg: `lookup <name>` — returns company match
- 9fin: `search <keyword>` — returns documents/companies
- CreditSights: `POST /api/common/v1/issuers` — returns issuer matches
- Third Bridge: `POST /api/interview/search` — returns interview hits

**Working at HOME machine confirmed 2026-05-11. Repo created + pushed 2026-05-11.**
