module.exports = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { city, locality } = req.body || {};
  if (!city || !locality) {
    res.status(400).json({ error: 'city and locality are required' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'ANTHROPIC_API_KEY not configured' });
    return;
  }

  const prompt = `You are a real estate data assistant with deep knowledge of Indian property markets, drawing on data similar to what 99acres, MagicBricks, Google Maps, and local news would provide.

Provide a structured locality insights report for: ${locality}, ${city}, India.

Return ONLY valid JSON in this exact structure (no markdown, no explanation):
{
  "overview": "2-3 sentence summary of the locality character and real estate outlook",
  "specialties": ["up to 5 short phrases describing what the area is known for"],
  "major_employers": ["up to 5 major companies or IT parks nearby"],
  "schools": [
    {"name": "School name", "type": "CBSE/ICSE/IB/State", "note": "brief note"}
  ],
  "traffic": {
    "peak_hours": "description of rush hour pattern",
    "metro_access": "nearest metro station and distance",
    "highway_access": "nearest highway/ORR/ring road",
    "congestion_level": "Low/Moderate/High/Very High"
  },
  "nearby_amenities": {
    "hospitals": ["up to 3 hospitals"],
    "malls": ["up to 3 malls or retail zones"],
    "parks": ["up to 2 parks or green spaces"]
  },
  "investment_note": "1-2 sentences on investment potential — appreciation trend, rental demand, upcoming infra"
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Anthropic API returned ${response.status}`);
    }

    const apiData = await response.json();
    const text = (apiData.content || []).find(b => b.type === 'text')?.text?.trim() || '';

    let insights;
    try {
      insights = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse response as JSON');
      insights = JSON.parse(jsonMatch[0]);
    }

    res.status(200).json({ success: true, data: insights });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
