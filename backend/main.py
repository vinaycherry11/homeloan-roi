from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import List, Optional
import math
import os
import json
import urllib.request

app = FastAPI(
    title="Home Loan ROI Analyzer",
    description="Calculate ROI on home purchase vs renting",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Input Models ──────────────────────────────────────────────────────────────

class LoanInput(BaseModel):
    home_price: float = Field(..., gt=0, description="Total home purchase price in ₹")
    monthly_rent: float = Field(..., gt=0, description="Equivalent monthly rent for this property")
    interest_rate: float = Field(..., gt=0, le=30, description="Annual loan interest rate %")
    annual_appreciation: float = Field(..., ge=0, le=50, description="Annual property price appreciation %")
    rent_appreciation: float = Field(..., ge=0, le=30, description="Annual rent increase %")
    maintenance_pct: float = Field(..., ge=0, le=10, description="Maintenance + tax as % of property value/yr")
    stock_return: float = Field(..., gt=0, le=50, description="Expected equity/MF annual return % (for renter)")
    tenure_years: int = Field(..., ge=1, le=30, description="Loan tenure in years")
    down_payment_pct: float = Field(..., ge=5, le=90, description="Down payment as % of home price")

    @validator('home_price')
    def check_home_price(cls, v):
        if v < 100000:
            raise ValueError("Home price must be at least ₹1 lakh")
        return v


class SensitivityInput(BaseModel):
    home_price: float
    monthly_rent: float
    interest_rate: float
    annual_appreciation: float
    rent_appreciation: float
    maintenance_pct: float
    stock_return: float
    tenures: List[int] = [5, 10, 15, 20, 25, 30]
    down_payments: List[float] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
    current_tenure: int
    current_down_pct: float


class ChatInput(BaseModel):
    messages: List[dict]
    context: Optional[List[str]] = None


# ── Calculation Engine ────────────────────────────────────────────────────────

def calc_emi(principal: float, annual_rate: float, years: int) -> float:
    r = annual_rate / 12 / 100
    n = years * 12
    if r == 0:
        return principal / n
    return principal * r * math.pow(1 + r, n) / (math.pow(1 + r, n) - 1)


def run_simulation(
    home_price, monthly_rent, interest_rate, appreciation,
    rent_appreciation, maintenance_pct, stock_return, tenure, down_pct
):
    down = home_price * down_pct / 100
    loan = home_price - down
    monthly_emi = calc_emi(loan, interest_rate, tenure)

    equity_arr, renter_arr, snp_arr, cost_arr, rent_saved_arr, surplus_snp_arr, snp_emi_sip_arr, surplus_invested_arr, year_data = [], [], [], [], [], [], [], [], []

    home_val = home_price
    loan_bal = loan
    renter_portfolio = down  # renter invests down payment at user's stock_return
    snp_portfolio    = down  # same renter but investing at fixed S&P 500 rate
    snp_emi_sip      = float(down)   # down payment lump sum + EMI monthly SIP at S&P rate
    surplus_snp      = 0.0
    surplus_invested = 0.0
    cum_cost = down
    cum_rent = 0
    pv_outflow = float(down)
    cash_out_of_pocket = float(down)
    net_wealth_inflow = 0.0
    cur_rent = monthly_rent
    break_even_year = None
    r = interest_rate / 12 / 100
    disc_r = stock_return / 12 / 100
    snp_r  = 10.5 / 12 / 100          # S&P 500 historical 30-yr avg
    month_num = 0
    monthly_maint_y1 = home_price * maintenance_pct / 100 / 12
    monthly_cf_y1 = monthly_rent - monthly_emi - monthly_maint_y1
    cum_net_cf = 0
    cf_positive_year = None

    for y in range(1, tenure + 1):
        year_principal = 0
        year_interest = 0
        year_maint = 0
        year_rent = 0
        year_outflow_invested = 0

        for m in range(12):
            month_num += 1
            interest = loan_bal * r
            principal = min(monthly_emi - interest, loan_bal)
            loan_bal = max(0, loan_bal - principal)
            maint = home_val * maintenance_pct / 100 / 12
            year_principal += principal
            year_interest += interest
            year_maint += maint
            cum_cost += monthly_emi + maint
            cum_rent += cur_rent
            year_rent += cur_rent
            net_outflow = (monthly_emi + maint) - cur_rent
            pv_outflow += net_outflow / (1 + disc_r) ** month_num
            if net_outflow > 0:
                cash_out_of_pocket += net_outflow
            else:
                net_wealth_inflow += (-net_outflow)
            diff = max(0, net_outflow)
            renter_portfolio = renter_portfolio * (1 + stock_return / 12 / 100) + diff
            snp_portfolio    = snp_portfolio    * (1 + snp_r)                   + diff
            year_outflow_invested += diff
            snp_emi_sip      = snp_emi_sip      * (1 + snp_r) + monthly_emi
            surplus = max(0.0, cur_rent - monthly_emi - maint)
            surplus_invested += surplus
            surplus_snp = surplus_snp * (1 + snp_r) + surplus

        home_val *= (1 + appreciation / 100)
        cur_rent *= (1 + rent_appreciation / 100)

        year_net_cf = year_rent - monthly_emi * 12 - year_maint
        cum_net_cf += year_net_cf
        if not cf_positive_year and year_net_cf > 0:
            cf_positive_year = y

        equity = home_val - loan_bal
        if not break_even_year and (equity + cum_rent) >= cum_cost:
            break_even_year = y

        equity_arr.append(round(equity))
        renter_arr.append(round(renter_portfolio))
        snp_arr.append(round(snp_portfolio))
        cost_arr.append(round(cum_cost))
        rent_saved_arr.append(round(cum_rent))
        surplus_snp_arr.append(round(surplus_snp))
        snp_emi_sip_arr.append(round(snp_emi_sip))
        surplus_invested_arr.append(round(surplus_invested))

        year_data.append({
            "year": y,
            "emi_paid": round(monthly_emi * 12),
            "principal": round(year_principal),
            "interest": round(year_interest),
            "maintenance": round(year_maint),
            "loan_balance": round(loan_bal),
            "home_value": round(home_val),
            "net_equity": round(equity),
            "rent_saved_year": round(year_rent),
            "cum_rent_saved": round(cum_rent),
            "annual_net_cf": round(year_net_cf),
            "cum_net_cf": round(cum_net_cf),
            "surplus_snp_value": round(surplus_snp),
            "outflow_invested_year": round(year_outflow_invested),
            "snp_portfolio_value": round(snp_portfolio),
        })

    final_equity    = equity_arr[-1]
    final_renter    = renter_arr[-1]
    final_snp       = snp_arr[-1]
    total_paid      = cost_arr[-1]
    surplus_growth  = surplus_snp - surplus_invested   # S&P compounding gain on reinvested surplus
    final_benefit   = final_equity + cum_rent + surplus_growth
    home_net_gain   = final_equity + cum_net_cf  # equity + (total rent - total EMI - total maintenance)

    gain    = final_benefit - total_paid
    roi     = (final_benefit / total_paid  - 1) * 100 if total_paid  > 0 else 0
    cagr    = (final_benefit / total_paid)  ** (1 / tenure) - 1 if total_paid  > 0 else 0
    wealth_return = final_equity + net_wealth_inflow
    roi_dcf = (wealth_return / cash_out_of_pocket - 1) * 100 if cash_out_of_pocket > 0 else 0
    cagr_dcf= (wealth_return / cash_out_of_pocket) ** (1 / tenure) - 1 if cash_out_of_pocket > 0 else 0

    rent_vs_buy    = final_equity - final_renter
    stock_net_gain = final_snp                  # down payment + monthly outflow invested in S&P 500
    home_vs_snp    = home_net_gain - stock_net_gain   # positive = home wins vs S&P 500 renter
    home_beats_snp_sip = final_benefit > snp_emi_sip

    return {
        "summary": {
            "monthly_emi": round(monthly_emi),
            "down_payment": round(down),
            "loan_amount": round(loan),
            "final_home_value": final_equity,
            "total_paid": total_paid,
            "pv_outflow": round(pv_outflow),
            "cash_out_of_pocket": round(cash_out_of_pocket),
            "wealth_return": round(wealth_return),
            "cumulative_rent_saved": round(cum_rent),
            "net_gain": round(gain),
            "roi_pct": round(roi, 2),
            "cagr_pct": round(cagr * 100, 2),
            "roi_dcf_pct": round(roi_dcf, 2),
            "cagr_dcf_pct": round(cagr_dcf * 100, 2),
            "rent_vs_buy": round(rent_vs_buy),
            "final_snp_portfolio": round(final_snp),
            "home_net_gain": round(home_net_gain),
            "stock_net_gain": round(stock_net_gain),
            "home_vs_snp": round(home_vs_snp),
            "snp_emi_sip_final": round(snp_emi_sip),
            "home_beats_snp_sip": home_beats_snp_sip,
            "break_even_year": break_even_year,
            "buying_wins": rent_vs_buy > 0,
            "buying_beats_snp": home_vs_snp > 0,
            "rental_yield_gross_pct": round(monthly_rent * 12 / home_price * 100, 2),
            "rental_yield_net_pct": round((monthly_rent * 12 - home_price * maintenance_pct / 100) / home_price * 100, 2),
            "monthly_cashflow_y1": round(monthly_cf_y1),
            "cf_positive_year": cf_positive_year,
            "total_net_cashflow": round(cum_net_cf),
            "surplus_snp_final": round(surplus_snp),
            "surplus_invested": round(surplus_invested),
            "surplus_growth": round(surplus_growth),
        },
        "chart_data": {
            "labels": [f"Yr {y}" for y in range(1, tenure + 1)],
            "equity": equity_arr,
            "renter_portfolio": renter_arr,
            "snp_portfolio": snp_arr,
            "cumulative_cost": cost_arr,
            "rent_saved": rent_saved_arr,
            "surplus_snp": surplus_snp_arr,
            "snp_emi_sip": snp_emi_sip_arr,
            "surplus_invested": surplus_invested_arr,
        },
        "amortisation": year_data,
    }


SYSTEM_PROMPT = """You are a knowledgeable and friendly assistant for GoWinDhan (Go Win Dhan) — a home loan ROI and buy-vs-rent calculator for India.

Help users with:
- Home loan concepts: EMI, amortisation, principal vs interest, tenure, prepayment
- Buy vs rent decisions in Indian real estate
- Property appreciation, rental yield, gross vs net yield, price-to-rent ratio
- DCF (Discounted Cash Flow) analysis and what CAGR means for property investment
- Home wealth (equity + accumulated rent + surplus SIP gains) vs S&P 500 SIP comparison
- Tax benefits: Section 80C (principal up to Rs 1.5 lakh/year) and Section 24(b) (interest up to Rs 2 lakh/year for self-occupied)
- City and locality property market insights for Hyderabad, Bangalore, Mumbai, Pune, Delhi NCR, Chennai, Kolkata, Ahmedabad
- How to interpret GoWinDhan calculator outputs: break-even year, DCF-adjusted CAGR, surplus invested
- Down payment vs tenure trade-offs and their impact on total interest paid

Style rules:
- Be concise and practical — 2 to 5 sentences is usually enough
- Use Indian units: Rs, lakhs (L), crores (Cr)
- When the user's calculation data is available in context, reference those specific numbers directly
- For major financial decisions, mention: "For personalised advice, consult a SEBI-registered financial advisor"
- Do not guarantee future returns or make specific buy/sell recommendations
- Format responses in plain text without markdown symbols like asterisks or hashes"""


# ── API Routes ────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


@app.post("/api/calculate")
def calculate(data: LoanInput):
    try:
        result = run_simulation(
            home_price=data.home_price,
            monthly_rent=data.monthly_rent,
            interest_rate=data.interest_rate,
            appreciation=data.annual_appreciation,
            rent_appreciation=data.rent_appreciation,
            maintenance_pct=data.maintenance_pct,
            stock_return=data.stock_return,
            tenure=data.tenure_years,
            down_pct=data.down_payment_pct,
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/chat")
def chat(data: ChatInput):
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="Chat is not configured. Set ANTHROPIC_API_KEY environment variable.")

    if not data.messages:
        raise HTTPException(status_code=400, detail="messages array is required")

    system_prompt = SYSTEM_PROMPT
    if data.context:
        system_prompt += "\n\nUser's current calculator inputs and results:\n" + "\n".join(data.context)

    payload = json.dumps({
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 800,
        "system": system_prompt,
        "messages": data.messages[-12:],
    }).encode()

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=payload,
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
        reply = next((b["text"] for b in result.get("content", []) if b.get("type") == "text"), "")
        return {"reply": reply}
    except urllib.error.HTTPError as e:
        err = json.loads(e.read()).get("error", {})
        raise HTTPException(status_code=502, detail=err.get("message", f"Anthropic API error {e.code}"))


@app.post("/api/sensitivity")
def sensitivity(data: SensitivityInput):
    try:
        rows = []
        for t in data.tenures:
            row = {"tenure": t, "cells": []}
            for d in data.down_payments:
                res = run_simulation(
                    home_price=data.home_price,
                    monthly_rent=data.monthly_rent,
                    interest_rate=data.interest_rate,
                    appreciation=data.annual_appreciation,
                    rent_appreciation=data.rent_appreciation,
                    maintenance_pct=data.maintenance_pct,
                    stock_return=data.stock_return,
                    tenure=t,
                    down_pct=d,
                )
                row["cells"].append({
                    "down_pct": d,
                    "roi": round(res["summary"]["roi_pct"], 1),
                    "cagr_dcf": round(res["summary"]["cagr_dcf_pct"], 2),
                    "monthly_emi": round(res["summary"]["monthly_emi"]),
                    "is_current": t == data.current_tenure and d == data.current_down_pct,
                })
            rows.append(row)
        return {
            "success": True,
            "data": {
                "rows": rows,
                "down_payments": data.down_payments,
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Serve Frontend ────────────────────────────────────────────────────────────

frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")

if os.path.exists(os.path.join(frontend_dir, "static")):
    app.mount("/static", StaticFiles(directory=os.path.join(frontend_dir, "static")), name="static")


@app.get("/{full_path:path}", include_in_schema=False)
def serve_spa(full_path: str):
    index = os.path.join(frontend_dir, "index.html")
    if os.path.exists(index):
        return FileResponse(index)
    return {"detail": "Frontend not found. Make sure frontend/index.html exists."}
