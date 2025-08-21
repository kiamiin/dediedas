export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Missing name' });

  const prompt = `Gib nur den bestimmten Artikel für den Vornamen "${name.trim()}" auf Deutsch an. Antwort nur mit "der", "die" oder "das".`;

  const r = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.8q1fgY1uf4VLmYs0Pvh6OzQRbmuqAKeYEtPhqcaAYLeCPGbO}`
    },
    body: JSON.stringify({
      model: 'k2-latest',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 3,
      temperature: 0
    })
  });

  const data = await r.json();
  const artikel = data.choices?.[0]?.message?.content?.trim().toLowerCase();
  if (!['der', 'die', 'das'].includes(artikel))
    return res.status(422).json({ error: 'Unbekannt' });

  res.json({ artikel });
}