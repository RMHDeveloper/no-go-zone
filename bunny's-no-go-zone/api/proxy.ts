// Vercel serverless function. Forwards chat-completion requests to the shared
// dashboard proxy so the real OpenRouter API key never reaches the browser.
// The client calls POST /api/proxy with the same body it used to send
// directly to OpenRouter.
export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const proxyUrl = process.env.DASHBOARD_PROXY_URL;
  const proxySecret = process.env.DASHBOARD_PROXY_SECRET;

  if (!proxyUrl || !proxySecret) {
    res.status(500).json({
      error:
        'The server is missing DASHBOARD_PROXY_URL / DASHBOARD_PROXY_SECRET. Add them in Vercel -> Settings -> Environment Variables, then redeploy.',
    });
    return;
  }

  try {
    const upstream = await fetch(`${proxyUrl}/api/proxy/no-go-zone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-proxy-secret': proxySecret,
      },
      body: JSON.stringify(req.body ?? {}),
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.send(text);
  } catch (err: any) {
    res.status(502).json({ error: err?.message || 'Failed to reach the dashboard proxy' });
  }
}
