export default async function handler(req, res) {
  console.log('Key starts with', process.env.KIMI_API_KEY?.slice(0, 8));
  if (req.method !== 'POST') return res.status(405).end();

  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Missing name' });

  const prompt = `Gib nur den bestimmten Artikel für den Vornamen "${name.trim()}" auf Deutsch an. Antwort nur mit "der", "die" oder "das".`;

  try {
    const r = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.KIMI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'k2-latest',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 3,
        temperature: 0
      })
    });

    const data = await r.json();
    if (!r.ok) throw new Error(data?.error?.message || 'API error');

    const artikel = data.choices?.[0]?.message?.content?.trim().toLowerCase();
    if (!['der', 'die', 'das'].includes(artikel))
      return res.status(422).json({ error: 'Unbekannt' });

    res.json({ artikel });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }

}
