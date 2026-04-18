// NOTE: This exposes the Anthropic API key to the browser via import.meta.env.
// Acceptable tradeoff for this internal tool — do NOT use in public-facing apps.
export async function callClaude(prompt, maxTokens = 4000) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: maxTokens,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const d = await r.json();
  return d.content?.map(i => i.type === "text" ? i.text : "").filter(Boolean).join("\n") || "";
}
