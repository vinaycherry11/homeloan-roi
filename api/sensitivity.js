function calcEmi(principal, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function runSimulation(homePrice, monthlyRent, interestRate, appreciation, rentAppreciation, maintenancePct, stockReturn, tenure, downPct) {
  const down = homePrice * downPct / 100;
  const loan = homePrice - down;
  const monthlyEmi = calcEmi(loan, interestRate, tenure);

  let homeVal = homePrice;
  let loanBal = loan;
  let renterPortfolio = down;
  let snpPortfolio = down;
  let surplusSnp = 0;
  let surplusInvested = 0;
  let cumCost = down;
  let cumRent = 0;
  let pvOutflow = down;
  let cashOutOfPocket2 = down;
  let netWealthInflow2 = 0;
  let curRent = monthlyRent;
  const r = interestRate / 12 / 100;
  const discR = stockReturn / 12 / 100;
  const snpR = 10.5 / 12 / 100;
  let monthNum = 0;

  for (let y = 1; y <= tenure; y++) {
    for (let m = 0; m < 12; m++) {
      monthNum++;
      const interest = loanBal * r;
      const principal = Math.min(monthlyEmi - interest, loanBal);
      loanBal = Math.max(0, loanBal - principal);
      const maint = homeVal * maintenancePct / 100 / 12;
      cumCost += monthlyEmi + maint;
      cumRent += curRent;
      const netOutflow2 = (monthlyEmi + maint) - curRent;
      pvOutflow += netOutflow2 / Math.pow(1 + discR, monthNum);
      if (netOutflow2 > 0) cashOutOfPocket2 += netOutflow2;
      else netWealthInflow2 += (-netOutflow2);
      const diff = Math.max(0, netOutflow2);
      renterPortfolio = renterPortfolio * (1 + stockReturn / 12 / 100) + diff;
      snpPortfolio = snpPortfolio * (1 + snpR) + diff;
      const surplus = Math.max(0, curRent - monthlyEmi - maint);
      surplusInvested += surplus;
      surplusSnp = surplusSnp * (1 + snpR) + surplus;
    }
    homeVal *= (1 + appreciation / 100);
    curRent *= (1 + rentAppreciation / 100);
  }

  const finalEquity = homeVal - loanBal;
  const surplusGrowth = surplusSnp - surplusInvested;
  const finalBenefit = finalEquity + cumRent + surplusGrowth;
  const roi = cumCost > 0 ? (finalBenefit / cumCost - 1) * 100 : 0;
  const wealthReturn2 = finalEquity + netWealthInflow2;
  const cagrDcf = cashOutOfPocket2 > 0 ? Math.pow(wealthReturn2 / cashOutOfPocket2, 1 / tenure) - 1 : 0;

  return {
    roi_pct: Math.round(roi * 10) / 10,
    cagr_dcf_pct: Math.round(cagrDcf * 10000) / 100,
    monthly_emi: Math.round(monthlyEmi),
  };
}

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
    rent_appreciation, maintenance_pct, stock_return,
    current_tenure, current_down_pct,
  } = data;

  const tenures = data.tenures || [5, 10, 15, 20, 25, 30];
  const downPayments = data.down_payments || [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  try {
    const rows = tenures.map(t => ({
      tenure: t,
      cells: downPayments.map(d => {
        const res2 = runSimulation(
          home_price, monthly_rent, interest_rate, annual_appreciation,
          rent_appreciation, maintenance_pct, stock_return, t, d
        );
        return { down_pct: d, roi: res2.roi_pct, cagr_dcf: res2.cagr_dcf_pct, monthly_emi: res2.monthly_emi, is_current: t === current_tenure && d === current_down_pct };
      }),
    }));

    res.status(200).json({ success: true, data: { rows, down_payments: downPayments } });
  } catch (e) {
    res.status(400).json({ detail: e.message });
  }
};
