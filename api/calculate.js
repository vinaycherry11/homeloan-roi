const { runSimulation } = require('./_lib/simulation');

module.exports = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ detail: 'Method not allowed' });
    return;
  }

  const data = req.body;

  const {
    home_price, monthly_rent, interest_rate, annual_appreciation,
    rent_appreciation, maintenance_pct, stock_return, benchmark_return, tenure_years, down_payment_pct,
  } = data;

  if (!home_price || home_price < 100000) {
    res.status(400).json({ detail: 'Home price must be at least ₹1 lakh' });
    return;
  }

  try {
    const result = runSimulation(
      home_price, monthly_rent, interest_rate, annual_appreciation,
      rent_appreciation, maintenance_pct, benchmark_return ?? stock_return ?? 12, tenure_years, down_payment_pct
    );
    res.status(200).json({ success: true, data: result });
  } catch (e) {
    res.status(400).json({ detail: e.message });
  }
};
