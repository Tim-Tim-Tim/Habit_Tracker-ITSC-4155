# Runs FastAPI and Vite together, Windows-friendly

# ensure deps exist
if (!(Test-Path "backend/.venv")) {
  Write-Host "Python venv not found. Run: npm run setup" -ForegroundColor Yellow
  exit 1
}
if (!(Test-Path "habit-web/node_modules")) {
  Write-Host "Frontend deps not installed. Run: npm run setup" -ForegroundColor Yellow
  exit 1
}

# start both with concurrently
npx concurrently -k `
  "npm:dev:api" `
  "npm:dev:web"
