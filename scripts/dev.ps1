# Runs FastAPI and Vite together, Windows-friendly

# Checking both node_modules locations just in case

$repoRoot = Split-Path -Path $PSScriptRoot -Parent
Set-Location $repoRoot

if (!(Test-Path "backend/.venv")) {
  Write-Host "Python venv not found. Run: npm run setup" -ForegroundColor Yellow
  exit 1
}

if (!(Test-Path "node_modules")) {
  Write-Host "Root dev deps not installed. Run: npm run setup" -ForegroundColor Yellow
  exit 1
}

if (!(Test-Path "habit-web/node_modules")) {
  Write-Host "Frontend deps not installed (habit-web/node_modules missing). Run: npm run setup" -ForegroundColor Yellow
  exit 1
}

# Start both processes using the venv python and Vite in habit-web
npx concurrently -k `
  "backend/.venv/Scripts/python -m uvicorn app:app --reload --port 8000" `
  "cd habit-web && vite"