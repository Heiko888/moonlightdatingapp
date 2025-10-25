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
Write-Host "Hinweis: Dieses Skript ist veraltet und startet 'update-hetzner-after-build.ps1'." -ForegroundColor Yellow
Write-Host ""

$updateScript = Join-Path $PSScriptRoot "update-hetzner-after-build.ps1"
if (-not (Test-Path $updateScript)) {
    Write-Host "❌ update-hetzner-after-build.ps1 nicht gefunden!" -ForegroundColor Red
    Write-Host "   Stelle sicher, dass die Datei im Projektstamm liegt." -ForegroundColor Red
    exit 1
}

& $updateScript -AutoConfirmBuild:$true
exit $LASTEXITCODE
