import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Guard: API key must exist
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('[chat] GROQ_API_KEY is not set');
    return res.status(500).json({ error: 'Server misconfiguration: missing API key' });
  }

  // Safely parse body (Vercel may pass it as a string)
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  const { messages } = body ?? {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[chat] Groq API error:', JSON.stringify(data));
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('[chat] Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
