const SYSTEM_PROMPT = `You are a knowledgeable and friendly assistant for GoWinDhan (Go Win Dhan) — a home loan ROI and buy-vs-rent calculator for India.

Help users with:
- Home loan concepts: EMI, amortisation, principal vs interest, tenure, prepayment
- Buy vs rent decisions in Indian real estate
- Property appreciation, rental yield, gross vs net yield, price-to-rent ratio
- DCF (Discounted Cash Flow) analysis and what CAGR means for property investment
- Home wealth (equity + accumulated rent + surplus SIP gains) vs S&P 500 SIP comparison
- Tax benefits: Section 80C (principal up to Rs 1.5 lakh/year) and Section 24(b) (interest up to Rs 2 lakh/year for self-occupied)
- City and locality property market insights for Hyderabad, Bangalore, Mumbai, Pune, Delhi NCR, Chennai, Kolkata, Ahmedabad
- How to interpret GoWinDhan calculator outputs: break-even year, DCF-adjusted CAGR, surplus invested
- Down payment vs tenure trade-offs and their impact on total interest paid

Style rules:
- Be concise and practical — 2 to 5 sentences is usually enough
- Use Indian units: Rs, lakhs (L), crores (Cr)
- When the user's calculation data is available in context, reference those specific numbers directly
- For major financial decisions, mention: "For personalised advice, consult a SEBI-registered financial advisor"
- Do not guarantee future returns or make specific buy/sell recommendations
- Format responses in plain text without markdown symbols like asterisks or hashes`;

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Chat is not yet configured. Add ANTHROPIC_API_KEY to Netlify environment variables to enable it.',
      }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { messages, context } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'messages array is required' }) };
  }

  const systemPrompt = context
    ? SYSTEM_PROMPT + '\n\nUser\'s current calculator inputs and results:\n' + context
    : SYSTEM_PROMPT;

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
        max_tokens: 800,
        system: systemPrompt,
        messages: messages.slice(-12),
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Anthropic API returned ${response.status}`);
    }

    const data = await response.json();
    const reply = (data.content || []).find(b => b.type === 'text')?.text || '';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
