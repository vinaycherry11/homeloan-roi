#!/bin/bash
set -e

echo ""
echo "  🏠  Home Loan ROI Analyzer"
echo "  ────────────────────────────"

# Find python
if command -v python3 &> /dev/null; then
    PY=python3
elif command -v python &> /dev/null; then
    PY=python
else
    echo "  ✗ Python not found. Please install Python 3.9+"
    exit 1
fi

echo "  → Using $($PY --version)"

# Install deps using the same python that will run the server
echo "  → Checking dependencies..."
cd "$(dirname "$0")/backend"
$PY -m pip install -r requirements.txt -q --upgrade

echo "  → Starting server on http://localhost:8000"
echo "  → Press Ctrl+C to stop"
echo ""

$PY -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
