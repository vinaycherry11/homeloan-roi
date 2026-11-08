# Home Loan ROI Analyzer

A full-stack web app to calculate the ROI of buying a home vs renting — with amortisation schedule, sensitivity analysis, and buy-vs-rent wealth comparison.

---

## Tech Stack

| Layer    | Technology                                  |
|----------|---------------------------------------------|
| Hosting  | Vercel (static site + serverless functions) |
| API      | Node.js functions in `api/`                 |
| Frontend | Vanilla HTML / CSS / JS                     |
| Charts   | Chart.js                                    |
| Chat     | Claude via the Anthropic API                |

---

## Project Structure

```
homeloan-roi/
├── api/
│   ├── _lib/
│   │   ├── simulation.js   # All loan + ROI math (single source of truth)
│   │   └── rate-limit.js   # Per-IP limit for the endpoints that call Claude
│   ├── calculate.js        # POST /api/calculate
│   ├── sensitivity.js      # POST /api/sensitivity
│   ├── chat.js             # POST /api/chat
│   └── locality.js         # POST /api/locality
├── frontend/
│   ├── index.html          # Single-page app shell
│   └── static/             # CSS, JS, images
├── vercel.json
└── README.md
```

---

## Deploying

The live site (https://www.gowindhan.com) deploys automatically on Vercel when you push to `main` on GitHub.

The chat and locality endpoints need an `ANTHROPIC_API_KEY` environment variable set in the Vercel project settings.

## Running Locally

Requires [Node.js](https://nodejs.org). From the project root:

```bash
npx vercel dev
```

Then open http://localhost:3000.

---

## API Endpoints

| Method | Path               | Description                              |
|--------|--------------------|------------------------------------------|
| POST   | `/api/calculate`   | Run full loan + ROI simulation           |
| POST   | `/api/sensitivity` | ROI matrix across tenure × down payment  |
| POST   | `/api/chat`        | Chat assistant (rate-limited)            |
| POST   | `/api/locality`    | AI locality insights (rate-limited)      |

### POST `/api/calculate` — Request body

```json
{
  "home_price": 10000000,
  "monthly_rent": 30000,
  "interest_rate": 8.5,
  "annual_appreciation": 6,
  "rent_appreciation": 5,
  "maintenance_pct": 0.5,
  "buying_cost_pct": 7,
  "benchmark_return": 12,
  "tenure_years": 20,
  "down_payment_pct": 20
}
```

### Response (abridged)

```json
{
  "success": true,
  "data": {
    "summary": {
      "monthly_emi": 69426,
      "buying_costs": 700000,
      "irr_pct": 8.25,
      "home_net_gain": 32071355,
      "stock_net_gain": 57060128,
      "rent_vs_buy": -24988773,
      "buying_wins": false,
      "breakeven_appreciation_pct": 9.25,
      "break_even_year": 3
    },
    "chart_data": { "labels": [...], "equity": [...], "home_wealth": [...], "renter_portfolio": [...] },
    "amortisation": [{ "year": 1, "emi_paid": ..., "principal": ..., ... }]
  }
}
```

---

## What gets calculated

The site's "The Math" tab shows every formula with the user's own numbers plugged in.

- **Monthly EMI**: standard reducing-balance formula, monthly rate = annual rate ÷ 12
- **Home equity** = appreciated property value − remaining loan balance
- **Buying costs** = stamp duty + registration, `buying_cost_pct` of price, paid on day 1 (defaults to 0 in the API, 7% in the UI)
- **Renter portfolio** = down payment + buying costs invested in the benchmark fund on day 1, plus every month where EMI + maintenance > rent. The fund compounds at (1 + annual return)^(1/12) − 1 a month, so a 12% fund really earns 12% a year
- **Home wealth** = equity + the buyer's surplus (months where rent > EMI + maintenance), invested in the same fund
- **Buy vs rent edge** = home wealth − renter portfolio. It is positive exactly when the IRR beats the fund's return
- **Annual return (IRR)**: the monthly rate that zeroes the NPV of the buyer's cash flows (rent avoided counts as income, final equity is the exit), annualised
- **Total return** = (money out − money in) ÷ money in, ignoring timing
- **Break-even appreciation**: the appreciation rate at which the edge is exactly zero, solved by bisection
- **Break-even year**: the first year equity + rent saved ≥ total cash paid (undiscounted)

Not modelled: any taxes (home-loan deductions, capital gains, tax on fund returns, property tax), brokerage, selling costs, insurance, vacancy. Ongoing ownership cost is maintenance only.
