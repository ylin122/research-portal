---
name: No speculative complexity
description: Don't propose or build features/fixes gated on hypothetical conditions — only solve real, current problems
type: feedback
originSessionId: d4c48b1a-9178-48d8-a28f-e332b1e6d9e2
---
Do not propose or build improvements that solve hypothetical scenarios. If a feature, abstraction, error path, or fix is gated on a condition that may never occur for the user's actual workflow, skip it — don't even put it on a "future work" list as a numbered recommendation.

**Why:** On 2026-05-18, after a clean three-fix ingester refactor, I proposed three follow-on improvements (heartbeat lockfile, PDF-content hash dedup for sellside, JSON schema validation for `followups.json`). All three were technically real problems in theory — but each was gated on a scenario that may never happen (lock held > 30s, repeated PDF forwards, hand-editing breaking the JSON). The user called this "overly complicated workflow that's not useful" and asked me to remember the preference. The Karpathy guidelines in CLAUDE.md already say this in principle (#2 Simplicity First — no abstractions for single-use code, no error handling for impossible scenarios) but the user wants it elevated to an explicit, always-applied filter on my recommendations, not just my code.

**How to apply:**
- Before listing a recommendation, ask: "is this solving a problem that exists *today*?" If no → don't list it.
- If a hypothetical issue is worth flagging at all, mention it as a one-line "if X symptom appears, Y is the fix" — never as a numbered action item that implies it should be built.
- In agent self-evals, don't pad the "Recommendations" section with speculative items. Two real recommendations beat five speculative ones.
- When the user agrees to "let's add all of them," push back if any of them are speculative — explain which are real-problem-solvers and which are pre-emptive, and let them choose. Don't silently implement speculative work just because they greenlit a batch.
- Applies project-wide (PA Dashboard, Research Portal, dotclaude). Not domain-specific.
