# Better setup, supposed to work no matter where it's run from

$repoRoot = Split-Path -Path $PSScriptRoot -Parent
Set-Location $repoRoot

Write-Host "==> Creating Python venv (backend/.venv)" -ForegroundColor Cyan
if (!(Test-Path "backend/.venv")) {
  python -m venv backend/.venv
}

Write-Host "==> Installing backend requirements" -ForegroundColor Cyan
backend/.venv/Scripts/python -m pip install --upgrade pip
backend/.venv/Scripts/python -m pip install -r backend/requirements.txt

Write-Host "==> Installing root dev deps (concurrently, etc.)" -ForegroundColor Cyan
npm install

Write-Host "==> Installing frontend deps in habit-web/" -ForegroundColor Cyan
npm --prefix "$repoRoot/habit-web" install

Write-Host "==> Setup complete" -ForegroundColor Green
