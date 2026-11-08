// Monthly reducing-balance EMI. Indian banks quote an annual rate and charge rate/12 each month.
function calcEmi(principal, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// Annual internal rate of return (%) for monthly cash flows, flows[0] at t=0.
// Returns null when no rate in roughly -46%..+214%/yr makes the NPV zero.
function irrAnnualPct(flows) {
  const npv = r => flows.reduce((sum, f, i) => sum + f / Math.pow(1 + r, i), 0);
  let lo = -0.05, hi = 0.10;
  let npvLo = npv(lo);
  if (npvLo * npv(hi) > 0) return null;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const npvMid = npv(mid);
    if (npvMid * npvLo > 0) { lo = mid; npvLo = npvMid; } else hi = mid;
  }
  return (Math.pow(1 + (lo + hi) / 2, 12) - 1) * 100;
}

// Both sides start with the same money. The buyer spends the down payment plus buying costs (stamp
// duty, registration) on the home; the renter puts that same sum into the benchmark fund. Each month, whoever spends less invests the difference in the
// fund: the renter when EMI + maintenance > rent, the buyer when rent > EMI + maintenance.
// Stamp duty + registration is capped at 7% (the frontend enforces the same cap)
const BUYING_COST_MAX = 7;
const clampBuyingCost = v => Math.min(BUYING_COST_MAX, Math.max(0, Number(v) || 0));

function runSimulation(homePrice, monthlyRent, interestRate, appreciation, rentAppreciation, maintenancePct, benchmarkReturn, tenure, downPct, buyingCostPct = 0) {
  const down = homePrice * downPct / 100;
  const buyingCosts = homePrice * clampBuyingCost(buyingCostPct) / 100;
  const upfront = down + buyingCosts;
  const loan = homePrice - down;
  const monthlyEmi = calcEmi(loan, interestRate, tenure);

  const equityArr = [], renterArr = [], homeWealthArr = [], costArr = [], yearData = [];

  let homeVal = homePrice;
  let loanBal = loan;
  let renterPortfolio = upfront;
  let surplusPortfolio = 0;   // buyer's rent surplus, invested in the fund
  let cumCost = upfront;
  let cumRent = 0;
  let cashOutOfPocket = upfront;
  let cashIn = 0;
  let curRent = monthlyRent;
  let breakEvenYear = null;
  const r = interestRate / 12 / 100;
  // Fund returns are quoted as annual CAGR, so compound monthly at the equivalent rate.
  const bmR = Math.pow(1 + benchmarkReturn / 100, 1 / 12) - 1;
  const monthlyMaintY1 = homePrice * maintenancePct / 100 / 12;
  const monthlyCfY1 = monthlyRent - monthlyEmi - monthlyMaintY1;
  let cumNetCf = 0;
  let cfPositiveYear = null;
  // Buyer's cash flows for the IRR: avoided rent counts as income, equity is the exit value.
  const monthlyFlows = [-upfront];

  for (let y = 1; y <= tenure; y++) {
    let yearPrincipal = 0, yearInterest = 0, yearMaint = 0, yearRent = 0, yearOutflowInvested = 0;

    for (let m = 0; m < 12; m++) {
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
      monthlyFlows.push(-netOutflow);
      if (netOutflow > 0) cashOutOfPocket += netOutflow;
      else cashIn += -netOutflow;
      const toRenter = Math.max(0, netOutflow);
      const toBuyer = Math.max(0, -netOutflow);
      renterPortfolio = renterPortfolio * (1 + bmR) + toRenter;
      surplusPortfolio = surplusPortfolio * (1 + bmR) + toBuyer;
      yearOutflowInvested += toRenter;
    }

    homeVal *= (1 + appreciation / 100);
    curRent *= (1 + rentAppreciation / 100);

    const yearNetCf = yearRent - monthlyEmi * 12 - yearMaint;
    cumNetCf += yearNetCf;
    if (!cfPositiveYear && yearNetCf > 0) cfPositiveYear = y;

    const equity = homeVal - loanBal;
    // Undiscounted: equity covers every rupee put in, net of rent avoided.
    if (!breakEvenYear && (equity + cumRent) >= cumCost) breakEvenYear = y;

    equityArr.push(Math.round(equity));
    renterArr.push(Math.round(renterPortfolio));
    homeWealthArr.push(Math.round(equity + surplusPortfolio));
    costArr.push(Math.round(cumCost));

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
      outflow_invested_year: Math.round(yearOutflowInvested),
      snp_portfolio_value: Math.round(renterPortfolio),
      surplus_portfolio_value: Math.round(surplusPortfolio),
      home_wealth: Math.round(equity + surplusPortfolio),
    });
  }

  const finalEquity = homeVal - loanBal;
  monthlyFlows[monthlyFlows.length - 1] += finalEquity;
  const irr = irrAnnualPct(monthlyFlows);
  const totalPaid = cumCost;
  const homeWealth = finalEquity + surplusPortfolio;
  // Same as the future value of the buyer's cash flows at the fund rate, so it is positive
  // exactly when the IRR beats the fund.
  const rentVsBuy = homeWealth - renterPortfolio;

  // Plain money multiple: what you end with over what you put in, ignoring timing.
  const wealthReturn = finalEquity + cashIn;
  const gain = wealthReturn - cashOutOfPocket;
  const roi = cashOutOfPocket > 0 ? gain / cashOutOfPocket * 100 : 0;

  return {
    summary: {
      monthly_emi: Math.round(monthlyEmi),
      down_payment: Math.round(down),
      buying_costs: Math.round(buyingCosts),
      loan_amount: Math.round(loan),
      final_home_value: Math.round(finalEquity),
      total_paid: Math.round(totalPaid),
      cash_out_of_pocket: Math.round(cashOutOfPocket),
      wealth_return: Math.round(wealthReturn),
      cumulative_rent_saved: Math.round(cumRent),
      net_gain: Math.round(gain),
      roi_pct: Math.round(roi * 100) / 100,
      irr_pct: irr === null ? null : Math.round(irr * 100) / 100,
      rent_vs_buy: Math.round(rentVsBuy),
      home_net_gain: Math.round(homeWealth),
      stock_net_gain: Math.round(renterPortfolio),
      surplus_portfolio: Math.round(surplusPortfolio),
      break_even_year: breakEvenYear,
      buying_wins: rentVsBuy > 0,
      rental_yield_gross_pct: Math.round(monthlyRent * 12 / homePrice * 10000) / 100,
      rental_yield_net_pct: Math.round((monthlyRent * 12 - homePrice * maintenancePct / 100) / homePrice * 10000) / 100,
      monthly_cashflow_y1: Math.round(monthlyCfY1),
      cf_positive_year: cfPositiveYear,
      total_net_cashflow: Math.round(cumNetCf),
    },
    chart_data: {
      labels: Array.from({ length: tenure }, (_, i) => `Yr ${i + 1}`),
      equity: equityArr,
      home_wealth: homeWealthArr,
      renter_portfolio: renterArr,
      cumulative_cost: costArr,
    },
    amortisation: yearData,
  };
}

// Appreciation (%/yr) at which buying exactly ties renting + investing in the fund.
// Returns null if the tie lies outside -10%..+30%.
function breakevenAppreciation(homePrice, monthlyRent, interestRate, rentAppreciation, maintenancePct, benchmarkReturn, tenure, downPct, buyingCostPct = 0) {
  const edge = a => runSimulation(homePrice, monthlyRent, interestRate, a, rentAppreciation, maintenancePct, benchmarkReturn, tenure, downPct, buyingCostPct).summary.rent_vs_buy;
  let lo = -10, hi = 30;
  if (edge(lo) > 0 || edge(hi) < 0) return null;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (edge(mid) > 0) hi = mid; else lo = mid;
  }
  return Math.round((lo + hi) / 2 * 100) / 100;
}

module.exports = { calcEmi, runSimulation, breakevenAppreciation, BUYING_COST_MAX };
