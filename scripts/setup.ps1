# Creates Python venv, installs backend deps, installs frontend deps

$repoRoot = Split-Path -Path $PSScriptRoot -Parent
Set-Location $repoRoot

Write-Host "==> Creating Python venv (backend/.venv)" -ForegroundColor Cyan
if (!(Test-Path "backend/.venv")) {
  python -m venv backend/.venv
}

Write-Host "==> Installing backend requirements" -ForegroundColor Cyan
backend/.venv/Scripts/python -m pip install --upgrade pip
backend/.venv/Scripts/python -m pip install -r backend/requirements.txt

# fix for root dependencies
Write-Host "==> Installing ROOT dependencies" -ForegroundColor Cyan
npm install

# fix for node_modules insalation
Write-Host "==> Installing frontend deps in habit-web/" -ForegroundColor Cyan
npm --prefix "$repoRoot/habit-web" install

Write-Host "==> Setup complete" -ForegroundColor Green