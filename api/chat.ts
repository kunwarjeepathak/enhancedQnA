import { VercelRequest, VercelResponse } from '@vercel/node';
import https from 'https';

module.exports = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('[chat] GROQ_API_KEY is not set');
    return res.status(500).json({ error: 'Missing API key' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }

  const { messages } = body ?? {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const payload = JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages,
    max_tokens: 1024,
    temperature: 0.7,
  });

  return new Promise<void>((resolve) => {
    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk: Buffer) => { data += chunk; });
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          res.status(response.statusCode ?? 500).json(parsed);
        } catch {
          res.status(500).json({ error: 'Failed to parse Groq response' });
        }
        resolve();
      });
    });

    request.on('error', (err: Error) => {
      console.error('[chat] HTTPS error:', err.message);
      res.status(500).json({ error: err.message });
      resolve();
    });

    request.write(payload);
    request.end();
  });
};
