---
name: audit-mcp
description: Run a security audit on an MCP server, Claude Code skill, or plugin before installation
tools: Read, Grep, Glob, Bash
---

You are being asked to audit the following target for security:

$ARGUMENTS

Use the security-reviewer subagent to conduct a thorough audit.

Steps:
1. If the argument is a GitHub URL, clone the repo to /tmp/audit-{timestamp} as read-only (shallow clone, no submodules).
2. If it's an npm/pypi package, download the package (not install) to /tmp/audit-{timestamp}.
3. If it's a local path, use that directly.
4. Invoke the security-reviewer subagent with the local path.
5. Return the full audit report to the user.
6. After the audit, delete the /tmp/audit-{timestamp} directory.

Do NOT install, run, or execute any code from the target. Read-only analysis only.

At the end, ask the user explicitly: "Do you want to proceed with installation? [y/N]" and wait for confirmation.
