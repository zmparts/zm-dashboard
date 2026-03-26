export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const CLIENT_ID = '155621253246357';
  const SECRET = 'tYPFDzupaQFam3FvOxwaUHoDd2oDeiPw';
  const ML = 'https://api.mercadolibre.com';

  // Renovar token
  if (req.method === 'POST' && req.url.includes('/api/token')) {
    const { refresh_token } = req.body;
    try {
      const r = await fetch('https://api.mercadolibre.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=refresh_token&client_id=${CLIENT_ID}&client_secret=${SECRET}&refresh_token=${refresh_token}`
      });
      const data = await r.json();
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Proxy para API do ML
  const token = req.headers.authorization;
  const path = req.query.path || '';
  const params = req.query.params || '';

  if (!token || !path) {
    return res.status(400).json({ error: 'Missing token or path' });
  }

  try {
    const url = `${ML}${path}${params ? '?' + params : ''}`;
    const r = await fetch(url, {
      headers: { 'Authorization': token }
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
