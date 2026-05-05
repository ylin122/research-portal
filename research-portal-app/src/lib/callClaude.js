import { supabase } from './supabase';

// Calls Anthropic via the /api/claude server function.
// The function requires a valid Supabase Auth session — sign in must succeed first.
// Returns the model's text or null on any error / missing session.
export async function callClaude(prompt, maxTokens = 4000) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return null;

    const r = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ prompt, maxTokens }),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      console.error('callClaude failed:', r.status, err);
      return null;
    }
    const d = await r.json();
    return d.text || '';
  } catch (err) {
    console.error('callClaude error:', err);
    return null;
  }
}
