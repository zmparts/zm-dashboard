export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.headers.authorization;
  const path = req.query.path || '';
  const params = req.query.params || '';

  if (!token || !path) return res.status(400).json({ error: 'Missing token or path' });

  try {
    const url = `https://api.mercadolibre.com${path}${params ? '?' + params : ''}`;
    const r = await fetch(url, { headers: { 'Authorization': token } });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
