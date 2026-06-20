# Home Loan ROI Analyzer

A full-stack web app to calculate the ROI of buying a home vs renting — with amortisation schedule, sensitivity analysis, and buy-vs-rent wealth comparison.

---

## Tech Stack

| Layer    | Technology                      |
|----------|---------------------------------|
| Backend  | Python · FastAPI · Uvicorn      |
| Frontend | Vanilla HTML / CSS / JS         |
| Charts   | Chart.js (CDN)                  |

---

## Project Structure

```
homeloan-roi/
├── backend/
│   ├── main.py            # FastAPI app + all calculation logic
│   └── requirements.txt
├── frontend/
│   ├── index.html         # Single-page app shell
│   └── static/
│       ├── css/style.css
│       └── js/app.js
├── run.sh                 # One-command startup
└── README.md
```

---

## Local Setup

### 1. Install Python dependencies

```bash
cd backend
pip install -r requirements.txt
```

> Requires Python 3.9+. Use a virtual environment if preferred:
> ```bash
> python -m venv venv && source venv/bin/activate
> pip install -r requirements.txt
> ```

### 2. Start the server

From the project root:

```bash
# Option A — use the run script
bash run.sh

# Option B — manual
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Open the app

```
http://localhost:8000
```

---

## API Endpoints

| Method | Path               | Description                              |
|--------|--------------------|------------------------------------------|
| GET    | `/api/health`      | Health check                             |
| POST   | `/api/calculate`   | Run full loan + ROI simulation           |
| POST   | `/api/sensitivity` | ROI matrix across tenure × down payment  |

### POST `/api/calculate` — Request body

```json
{
  "home_price": 10000000,
  "monthly_rent": 30000,
  "interest_rate": 8.5,
  "annual_appreciation": 6,
  "rent_appreciation": 5,
  "maintenance_pct": 1,
  "stock_return": 12,
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

## Deploying Later

### Option A — Docker (recommended)

Create a `Dockerfile` in the project root:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend/
COPY frontend/ ./frontend/
EXPOSE 8000
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t homeloan-roi .
docker run -p 8000:8000 homeloan-roi
```

### Option B — Render / Railway / Fly.io

1. Push to GitHub
2. Connect your repo in the platform dashboard
3. Set start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Done — the frontend is served by FastAPI's static file mount

### Option C — VPS (nginx + systemd)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
    }
}
```

---

## What gets calculated

- **Monthly EMI** via standard reducing-balance formula
- **Home equity** = appreciated property value − remaining loan balance
- **Renter portfolio** = down payment invested in equities + monthly savings (EMI+maintenance−rent), compounding monthly
- **ROI** = (final equity / total cash paid) − 1
- **Buy vs rent edge** = final equity − renter portfolio at the end of tenure
- **Break-even year** = first year equity exceeds cumulative cash outflow
