# Creates Python venv, installs backend deps, installs frontend deps

Write-Host "==> Setting up Python virtual environment" -ForegroundColor Cyan
if (!(Test-Path "backend/.venv")) {
  python -m venv backend/.venv
}

Write-Host "==> Installing backend requirements" -ForegroundColor Cyan
backend/.venv/Scripts/python -m pip install --upgrade pip
backend/.venv/Scripts/python -m pip install -r backend/requirements.txt

Write-Host "==> Installing frontend deps" -ForegroundColor Cyan
Push-Location habit-web
if (!(Test-Path "node_modules")) {
  npm install
}
Pop-Location

Write-Host "==> Setup complete" -ForegroundColor Green