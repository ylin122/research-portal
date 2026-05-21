---
name: Always include agent self-evaluation when running agents
description: Standing instruction — every agent invocation should be followed by a meta-evaluation (strengths, weaknesses, recommendations) regardless of whether the user explicitly asks for it that turn
type: feedback
originSessionId: fed14a0f-c437-483d-b0bc-7300de07e1c9
---
When the user invokes any agent (refresh, fact-check-reconciler, numbers-audit, ratings-research, third-party-research, verifier, codeverifier, deploy, etc.), automatically include a meta-evaluation alongside the findings.

**Why:** User asked for this on 2026-05-10 during the first refresh + fact-check pair run, and was annoyed when it wasn't carried over to a subsequent numbers-audit invocation. They treat it as a standing rule, not a per-invocation request.

**How to apply:**
- After every agent run, in addition to summarizing findings, include a short "Meta-eval on this run" section covering:
  - Strengths — what the agent did well
  - Weaknesses — what it missed, fudged, or skipped
  - Recommendations — concrete tactics to improve the agent prompt / workflow. Tag each one with a **P0–P3** criticality tier and a plain-language **"Improves:"** clause stating what it ultimately makes better — P0 = run produced a wrong/unsafe result or the agent reliably fails without the fix; P1 = a real gap that degraded output or forced user rework; P2 = a refinement to typical runs; P3 = cosmetic polish.
- Every agent prompt in ~/dotclaude/agents/ now has a built-in `## Self-Evaluation` section in exactly this format (standardized 2026-05-21 across all 19 agents), so the agent self-scores in its own output — I still add my own brief meta-eval on top, using the same P0–P3 + "Improves:" convention.
- Keep the meta-eval tight (a few bullets each). User wants the signal, not a wall of process commentary.

**Don't apply to:**
- Trivial tool runs (Bash, Read, Grep, Glob) — those aren't agents
- Sub-tasks the user explicitly scoped narrow ("just run this one check")
- When the user says "skip the eval" or otherwise explicitly opts out
