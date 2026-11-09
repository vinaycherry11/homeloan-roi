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
- **Buying costs** = stamp duty + registration, `buying_cost_pct` of price, paid on day 1 (defaults to 0 in the API, 7% in the UI; capped at 7% in both)
- **Renter portfolio** = down payment + buying costs invested in the benchmark fund on day 1, plus every month where EMI + maintenance > rent. The fund compounds at (1 + annual return)^(1/12) − 1 a month, so a 12% fund really earns 12% a year
- **Home wealth** = equity + the buyer's surplus (months where rent > EMI + maintenance), invested in the same fund
- **Buy vs rent edge** = home wealth − renter portfolio. It is positive exactly when the IRR beats the fund's return
- **Annual return (IRR)**: the monthly rate that zeroes the NPV of the buyer's cash flows (rent avoided counts as income, final equity is the exit), annualised
- **Total return** = (money out − money in) ÷ money in, ignoring timing
- **Break-even appreciation**: the appreciation rate at which the edge is exactly zero, solved by bisection
- **Break-even year**: the first year equity + rent saved ≥ total cash paid (undiscounted)

Not modelled: any taxes (home-loan deductions, capital gains, tax on fund returns, property tax), brokerage, selling costs, insurance, vacancy. Ongoing ownership cost is maintenance only.

## Content pages (SEO)

The city, locality, guide and EMI calculator pages are static HTML generated from the site's own data and engine:

```
python3 scripts/seo/build.py
```

This rewrites `frontend/buy-vs-rent.html`, `frontend/buy-vs-rent/**`, `frontend/guides.html`, `frontend/guides/**`, `frontend/emi-calculator.html` and `frontend/sitemap.xml`. Commit the output; Vercel serves it as-is. It needs macOS (it runs the JS with JavaScriptCore, no Node needed).

- **Locality data** comes from `LOCALITY_DATA` / `LOCALITY_METRICS` in `app.js` and `locality-insights.js` (read by `scripts/extract-data.js`). A locality gets a page when it has an entry in `locality-insights.js`.
- **Typical 2BHK price and rent** per locality live in `scripts/seo/typicals.json`. These are estimates: edit them by hand and rebuild. `scripts/seo/make_typicals.py` drafts an estimate for any locality not yet in the file and leaves existing entries alone (price = city 2BHK size × middle of the price/sq ft range; rent from the locality note, capped at a 4.5% gross yield). After adding localities to `locality-insights.js`, run `jsc scripts/extract-data.js -- "$PWD" > /tmp/data.json && python3 scripts/seo/make_typicals.py /tmp/data.json`, then rebuild.
- **Verdicts** run `api/_lib/simulation.js` via `scripts/seo/compute.js` with the calculator's defaults (8.5%, 20 years, 20% down, 7% stamp duty, 0.5% maintenance, Nifty 50 at 12%). Within 0.5 points of break-even growth counts as a "close call".
- **Guides** and the EMI page are in `scripts/seo/guides.py`. Change `UPDATED` / `UPDATED_ISO` in `build.py` when you refresh the data.
