---
name: research PDF naming and folder layout
description: When saving research PDFs (sellside or third-party), use the original source title verbatim and aggregate into per-company subfolders
type: feedback
originSessionId: 26b7b5fb-0bdf-49b8-b4db-881549cccdcc
---
When downloading research PDFs (sellside brokers, third-party research tools, anywhere), follow these two rules:

1. **Filename:** `<Source> - <Original Title>.pdf` — preserve the source's report title verbatim. No shortening, no paraphrasing, no synthetic `_<Date>` or `_<Ticker>` suffixes. Only filesystem-illegal characters (`< > : " / \ | ? *`) may be sanitized (replace with `-` or remove; strip trailing `.`/space). For sources with separate title + subtitle fields (e.g., JPM), concatenate as `<title> - <subtitle>`.

2. **Folder layout:** `~/OneDrive/Desktop/Claude/Sellside/<Company-or-Topic>/` — aggregate all sources' reports for the same company/topic into a single subfolder. Example: all 8 brokers' Meta reports go to `~/OneDrive/Desktop/Claude/Sellside/Meta/`.

**Why:** User explicitly objected (2026-05-11) to my having renamed files to `GS_Meta_2026-04-30.pdf` style — synthetic short names strip the analyst's framing (subtitle, thesis-in-title patterns) which is the signal. Original titles preserve that. Per-company subfolders make cross-broker comparison ergonomic.

**How to apply:** Applies to `/sellside`, `@sellside-login` (if it ever downloads), `@third-party-research` (if it saves PDFs), and any other agent that writes research content to disk. Codified in `~/dotclaude/commands/sellside.md`. Path uses `~/OneDrive/...` so it's portable across machines (OneDrive sync handles cross-device).
