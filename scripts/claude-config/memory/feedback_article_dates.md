---
name: feedback_article_dates
description: Always include publication date in analyzed research articles
type: feedback
---

Always include the publication date in analyzed article titles and metadata. If no explicit publication date is available from the article itself, use the email date from ingestion.

**Why:** User had to ask for this twice — dates are essential context for research articles and their investment relevance decays over time.

**How to apply:** When analyzing articles during research ingest, append the date to the title (e.g., "Article Title — Author (Apr 11, 2026)") and ensure the date field is always populated.
