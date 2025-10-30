<#
===========================================================
DEPRECATED WRAPPER
===========================================================

Dieses Skript ist veraltet. Der vereinbarte Deployment-Weg ist:
  1) Git Push → GitHub Actions baut und pusht das Docker-Image zu GHCR
  2) update-hetzner-after-build.ps1 zieht das Image und startet Container neu

Bitte NICHT mehr direkt auf dem Server git pull / npm install / docker build ausführen.
#>

# ===========================================
# HETZNER DEPLOYMENT - Wrapper
# ===========================================

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  HETZNER DEPLOYMENT (Wrapper)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Hinweis: Verwende ab sofort NUR 'deploy-to-hetzner-fixed.ps1'" -ForegroundColor Yellow
Write-Host ""

$target = Join-Path $PSScriptRoot "deploy-to-hetzner-fixed.ps1"
if (-not (Test-Path $target)) {
    Write-Host "❌ deploy-to-hetzner-fixed.ps1 nicht gefunden!" -ForegroundColor Red
    exit 1
}

& $target
exit $LASTEXITCODE
