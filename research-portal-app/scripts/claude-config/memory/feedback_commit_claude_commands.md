---
name: Commit Claude commands to repo
description: Custom .claude/commands should be committed to git repos so they sync across machines and work via web
type: feedback
originSessionId: b84df71b-cbc2-4687-9e26-76e185782dce
---
Always commit `.claude/commands/` files to the git repo (not just local). User works from multiple machines and via Claude Code web — commands need to be in the repo to be available everywhere.

**Why:** User created commands on home machine that weren't available on other machines because they were never committed.
**How to apply:** When creating or modifying custom slash commands, always `git add` them. Check that `.claude/commands/` is not in `.gitignore`.
