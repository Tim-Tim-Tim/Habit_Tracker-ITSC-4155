#!/usr/bin/env bash
set -euo pipefail

if [ ! -d backend/.venv ]; then
  python3 -m venv backend/.venv
fi

backend/.venv/bin/python -m pip install -r backend/requirements.txt

(cd habit-web && npm install)

npx concurrently -k \
  "backend/.venv/bin/python -m uvicorn app:app --reload --port 8000" \
  "cd habit-web && vite"
