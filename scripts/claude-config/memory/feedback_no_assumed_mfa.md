---
name: Don't assume MFA / SSO flows exist
description: When walking the user through a login, don't preemptively mention MFA, SSO, or other auth-flow steps unless the script actually hits them
type: feedback
originSessionId: 255928e0-cd22-45f3-9c16-d3fe51bea44e
---
When directing the user through a login script (sell-side brokers, third-party research tools, etc.), don't tell them to "handle MFA" or "complete SSO" preemptively. Many of these tools use plain username + password and the script auto-fills + auto-submits without any further input.

**Why:** User found it noisy/wrong when I said things like "handle the Fitch SSO + MFA" for CreditSights — CS is actually just username/password, no MFA. Saying it preemptively created false expectations and the user had to correct me.

**How to apply:**
- Default phrasing: "Window will open; auto-fill should complete and close automatically — handle anything the script prompts you for."
- Only mention MFA / SSO / OTP after the script reports a hang or the user reports being asked for one.
- Third Bridge IS an exception — by documented anti-bot design the user does manually type username + click Sign In. That one is OK to flag upfront.
