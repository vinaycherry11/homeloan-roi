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
    rent_appreciation, maintenance_pct, stock_return, benchmark_return,
    current_tenure, current_down_pct,
  } = data;

  const tenures = data.tenures || [5, 10, 15, 20, 25, 30];
  const downPayments = data.down_payments || [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  try {
    const rows = tenures.map(t => ({
      tenure: t,
      cells: downPayments.map(d => {
        const { summary } = runSimulation(
          home_price, monthly_rent, interest_rate, annual_appreciation,
          rent_appreciation, maintenance_pct, stock_return, benchmark_return ?? stock_return, t, d
        );
        return { down_pct: d, roi: Math.round(summary.roi_pct * 10) / 10, cagr_dcf: summary.cagr_dcf_pct, monthly_emi: summary.monthly_emi, is_current: t === current_tenure && d === current_down_pct };
      }),
    }));

    res.status(200).json({ success: true, data: { rows, down_payments: downPayments } });
  } catch (e) {
    res.status(400).json({ detail: e.message });
  }
};
