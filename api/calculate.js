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

  const equityArr = [], renterArr = [], snpArr = [], costArr = [], rentSavedArr = [], surplusSnpArr = [], snpEmiSipArr = [], surplusInvestedArr = [], yearData = [];

  let homeVal = homePrice;
  let loanBal = loan;
  let renterPortfolio = down;
  let snpPortfolio = down;
  let snpEmiSip = down;
  let surplusSnp = 0;
  let surplusInvested = 0;
  let cumCost = down;
  let cumRent = 0;
  let pvOutflow = down;
  let pvOutflowsOnly = 0;
  let cashOutOfPocket = down;
  let netWealthInflow = 0;
  let curRent = monthlyRent;
  let breakEvenYear = null;
  const r = interestRate / 12 / 100;
  const discR = stockReturn / 12 / 100;
  const snpR = 10.5 / 12 / 100;
  let monthNum = 0;
  const monthlyMaintY1 = homePrice * maintenancePct / 100 / 12;
  const monthlyCfY1 = monthlyRent - monthlyEmi - monthlyMaintY1;
  let cumNetCf = 0;
  let cfPositiveYear = null;

  for (let y = 1; y <= tenure; y++) {
    let yearPrincipal = 0, yearInterest = 0, yearMaint = 0, yearRent = 0, yearOutflowInvested = 0;

    for (let m = 0; m < 12; m++) {
      monthNum++;
      const interest = loanBal * r;
      const principal = Math.min(monthlyEmi - interest, loanBal);
      loanBal = Math.max(0, loanBal - principal);
      const maint = homeVal * maintenancePct / 100 / 12;
      yearPrincipal += principal;
      yearInterest += interest;
      yearMaint += maint;
      cumCost += monthlyEmi + maint;
      cumRent += curRent;
      yearRent += curRent;
      const netOutflow = (monthlyEmi + maint) - curRent;
      pvOutflow += netOutflow / Math.pow(1 + discR, monthNum);
      if (netOutflow > 0) { cashOutOfPocket += netOutflow; pvOutflowsOnly += netOutflow / Math.pow(1 + discR, monthNum); }
      else netWealthInflow += (-netOutflow);
      const diff = Math.max(0, netOutflow);
      renterPortfolio = renterPortfolio * (1 + stockReturn / 12 / 100) + diff;
      snpPortfolio = snpPortfolio * (1 + snpR) + diff;
      yearOutflowInvested += diff;
      snpEmiSip = snpEmiSip * (1 + snpR) + monthlyEmi;
      const surplus = Math.max(0, curRent - monthlyEmi - maint);
      surplusInvested += surplus;
      surplusSnp = surplusSnp * (1 + snpR) + surplus;
    }

    homeVal *= (1 + appreciation / 100);
    curRent *= (1 + rentAppreciation / 100);

    const yearNetCf = yearRent - monthlyEmi * 12 - yearMaint;
    cumNetCf += yearNetCf;
    if (!cfPositiveYear && yearNetCf > 0) cfPositiveYear = y;

    const equity = homeVal - loanBal;
    if (!breakEvenYear && (equity + cumRent) >= cumCost) breakEvenYear = y;

    equityArr.push(Math.round(equity));
    renterArr.push(Math.round(renterPortfolio));
    snpArr.push(Math.round(snpPortfolio));
    costArr.push(Math.round(cumCost));
    rentSavedArr.push(Math.round(cumRent));
    surplusSnpArr.push(Math.round(surplusSnp));
    snpEmiSipArr.push(Math.round(snpEmiSip));
    surplusInvestedArr.push(Math.round(surplusInvested));

    yearData.push({
      year: y,
      emi_paid: Math.round(monthlyEmi * 12),
      principal: Math.round(yearPrincipal),
      interest: Math.round(yearInterest),
      maintenance: Math.round(yearMaint),
      loan_balance: Math.round(loanBal),
      home_value: Math.round(homeVal),
      net_equity: Math.round(equity),
      rent_saved_year: Math.round(yearRent),
      cum_rent_saved: Math.round(cumRent),
      annual_net_cf: Math.round(yearNetCf),
      cum_net_cf: Math.round(cumNetCf),
      surplus_snp_value: Math.round(surplusSnp),
      outflow_invested_year: Math.round(yearOutflowInvested),
      snp_portfolio_value: Math.round(snpPortfolio),
    });
  }

  const finalEquity = equityArr[equityArr.length - 1];
  const finalRenter = renterArr[renterArr.length - 1];
  const finalSnp = snpArr[snpArr.length - 1];
  const totalPaid = costArr[costArr.length - 1];
  const surplusGrowth = surplusSnp - surplusInvested;
  const finalBenefit = finalEquity + cumRent + surplusGrowth;
  const homeNetGain = finalEquity + cumNetCf;
  const gain = finalBenefit - totalPaid;
  const roi = totalPaid > 0 ? (finalBenefit / totalPaid - 1) * 100 : 0;
  const cagr = totalPaid > 0 ? Math.pow(finalBenefit / totalPaid, 1 / tenure) - 1 : 0;
  const wealthReturn = finalEquity + netWealthInflow;
  const roiDcf = cashOutOfPocket > 0 ? (wealthReturn / cashOutOfPocket - 1) * 100 : 0;
  const cagrDcf = cashOutOfPocket > 0 ? Math.pow(wealthReturn / cashOutOfPocket, 1 / tenure) - 1 : 0;
  const pvCashOut = down + pvOutflowsOnly;
  const cagrDcfReal = pvCashOut > 0 ? Math.pow(wealthReturn / pvCashOut, 1 / tenure) - 1 : 0;
  const rentVsBuy = finalEquity - finalRenter;
  const stockNetGain = finalSnp;
  const homeVsSnp = homeNetGain - stockNetGain;
  const homeWealthFinal = finalBenefit;
  const homeBeatsSnpSip = homeWealthFinal > snpEmiSip;

  return {
    summary: {
      monthly_emi: Math.round(monthlyEmi),
      down_payment: Math.round(down),
      loan_amount: Math.round(loan),
      final_home_value: finalEquity,
      total_paid: totalPaid,
      pv_outflow: Math.round(pvOutflow),
      cash_out_of_pocket: Math.round(cashOutOfPocket),
      wealth_return: Math.round(wealthReturn),
      cumulative_rent_saved: Math.round(cumRent),
      net_gain: Math.round(gain),
      roi_pct: Math.round(roi * 100) / 100,
      cagr_pct: Math.round(cagr * 10000) / 100,
      roi_dcf_pct: Math.round(roiDcf * 100) / 100,
      cagr_dcf_pct: Math.round(cagrDcf * 10000) / 100,
      pv_outflows_only: Math.round(pvOutflowsOnly),
      pv_cash_out: Math.round(pvCashOut),
      cagr_dcf_real_pct: Math.round(cagrDcfReal * 10000) / 100,
      rent_vs_buy: Math.round(rentVsBuy),
      final_snp_portfolio: Math.round(finalSnp),
      home_net_gain: Math.round(homeNetGain),
      stock_net_gain: Math.round(stockNetGain),
      home_vs_snp: Math.round(homeVsSnp),
      snp_emi_sip_final: Math.round(snpEmiSip),
      home_beats_snp_sip: homeBeatsSnpSip,
      break_even_year: breakEvenYear,
      buying_wins: rentVsBuy > 0,
      buying_beats_snp: homeVsSnp > 0,
      rental_yield_gross_pct: Math.round(monthlyRent * 12 / homePrice * 10000) / 100,
      rental_yield_net_pct: Math.round((monthlyRent * 12 - homePrice * maintenancePct / 100) / homePrice * 10000) / 100,
      monthly_cashflow_y1: Math.round(monthlyCfY1),
      cf_positive_year: cfPositiveYear,
      total_net_cashflow: Math.round(cumNetCf),
      surplus_snp_final: Math.round(surplusSnp),
      surplus_invested: Math.round(surplusInvested),
      surplus_growth: Math.round(surplusGrowth),
    },
    chart_data: {
      labels: Array.from({ length: tenure }, (_, i) => `Yr ${i + 1}`),
      equity: equityArr,
      renter_portfolio: renterArr,
      snp_portfolio: snpArr,
      cumulative_cost: costArr,
      rent_saved: rentSavedArr,
      surplus_snp: surplusSnpArr,
      snp_emi_sip: snpEmiSipArr,
      surplus_invested: surplusInvestedArr,
    },
    amortisation: yearData,
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
    rent_appreciation, maintenance_pct, stock_return, tenure_years, down_payment_pct,
  } = data;

  if (!home_price || home_price < 100000) {
    res.status(400).json({ detail: 'Home price must be at least ₹1 lakh' });
    return;
  }

  try {
    const result = runSimulation(
      home_price, monthly_rent, interest_rate, annual_appreciation,
      rent_appreciation, maintenance_pct, stock_return, tenure_years, down_payment_pct
    );
    res.status(200).json({ success: true, data: result });
  } catch (e) {
    res.status(400).json({ detail: e.message });
  }
};
