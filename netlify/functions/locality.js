const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { city, locality } = body;
  if (!city || !locality) {
    return { statusCode: 400, body: JSON.stringify({ error: 'city and locality are required' }) };
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
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].text.trim();
    let insights;
    try {
      insights = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not parse response as JSON');
      insights = JSON.parse(jsonMatch[0]);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, data: insights }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
