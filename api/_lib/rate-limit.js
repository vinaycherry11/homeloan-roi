// Best-effort per-IP limiter for the endpoints that spend Anthropic API credit.
// State lives in the function instance's memory, so it resets on cold starts and
// isn't shared across instances — it stops casual abuse, not a determined attacker.
// For a hard cap, also set a monthly spend limit in the Anthropic Console.

const WINDOW_MS = 60 * 60 * 1000;
const hits = new Map();

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (fwd ? String(fwd).split(',')[0] : req.socket?.remoteAddress || 'unknown').trim();
}

// Returns true if the request may proceed; otherwise sends a 429 and returns false.
function allowRequest(req, res, limitPerHour) {
  const now = Date.now();
  const key = clientIp(req);
  const recent = (hits.get(key) || []).filter(t => now - t < WINDOW_MS);

  if (recent.length >= limitPerHour) {
    res.setHeader('Retry-After', Math.ceil((recent[0] + WINDOW_MS - now) / 1000));
    res.status(429).json({ error: 'You have reached the hourly limit. Please try again later.' });
    return false;
  }

  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (now - v[v.length - 1] >= WINDOW_MS) hits.delete(k);
  }
  return true;
}

module.exports = { allowRequest };
