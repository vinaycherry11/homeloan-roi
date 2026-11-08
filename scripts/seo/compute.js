// Run with macOS JavaScriptCore:  jsc scripts/seo/compute.js -- <repo> <scenarios.json>
// Runs the site's own simulation (api/_lib/simulation.js) for each scenario and prints JSON.
const [repo, file] = arguments;
const mod = { exports: {} };
(new Function('module', 'exports', 'require', readFile(repo + '/api/_lib/simulation.js')))(mod, mod.exports, () => ({}));
const { runSimulation, breakevenAppreciation, calcEmi } = mod.exports;
const out = JSON.parse(readFile(file)).map(s => {
  const args = [s.price, s.rent, s.rate, s.app, s.rentGrowth, s.maint, s.fund, s.tenure, s.down, s.buyingCost];
  const r = runSimulation(...args);
  const be = breakevenAppreciation(s.price, s.rent, s.rate, s.rentGrowth, s.maint, s.fund, s.tenure, s.down, s.buyingCost);
  const sm = r.summary;
  return {
    id: s.id, emi: Math.round(calcEmi(s.price * (1 - s.down / 100), s.rate, s.tenure)),
    edge: sm.rent_vs_buy, buyingWins: sm.buying_wins, homeWealth: sm.home_net_gain, renter: sm.stock_net_gain,
    irr: sm.irr_pct, breakeven: be, upfront: sm.down_payment + sm.buying_costs, loan: sm.loan_amount,
    cashOut: sm.cash_out_of_pocket, cfYear1: Math.round(s.rent - calcEmi(sm.loan_amount, s.rate, s.tenure) - s.price * s.maint / 100 / 12),
    cfPositiveYear: sm.cf_positive_year || null, totalInterest: r.amortisation.reduce((a, d) => a + d.interest, 0),
    finalHome: r.amortisation[r.amortisation.length - 1].home_value,
  };
});
print(JSON.stringify(out));
