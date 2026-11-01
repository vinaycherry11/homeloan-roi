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
  "maintenance_pct": 1,
  "benchmark_return": 12,
  "tenure_years": 20,
  "down_payment_pct": 20
}
```

### Response

```json
{
  "success": true,
  "data": {
    "summary": {
      "monthly_emi": 86822,
      "down_payment": 2000000,
      "loan_amount": 8000000,
      "final_home_value": 35917,
      "total_paid": 26121,
      "net_gain": 9796,
      "roi_pct": 37.5,
      "rent_vs_buy": 1234,
      "break_even_year": 14,
      "buying_wins": true
    },
    "chart_data": { "labels": [...], "equity": [...], "renter_portfolio": [...], "cumulative_cost": [...] },
    "amortisation": [{ "year": 1, "emi_paid": ..., "principal": ..., ... }]
  }
}
```

---

## What gets calculated

- **Monthly EMI** via standard reducing-balance formula
- **Home equity** = appreciated property value − remaining loan balance
- **Renter portfolio** = down payment invested in the chosen benchmark fund + monthly savings (EMI+maintenance−rent), compounding monthly
- **ROI** = (final equity / total cash paid) − 1
- **Buy vs rent edge** = final equity − renter portfolio at the end of tenure
- **Break-even year** = first year equity exceeds cumulative cash outflow
