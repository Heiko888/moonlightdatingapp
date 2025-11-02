# Deployment ueber die neuen Server-Skripte
$ServerIP = "138.199.237.34"
$ServerPath = "/opt/hd-app/HD_App_chart"
$ScriptsPath = "$ServerPath/scripts"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT ZU HETZNER SERVER" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Schritt 1/3: Git Pull (mit Server-Skript)" -ForegroundColor Yellow
$gitCmd = "cd $ScriptsPath && ./git-pull.sh"
ssh root@$ServerIP $gitCmd
if ($LASTEXITCODE -ne 0) {
    Write-Host "Git Pull fehlgeschlagen!" -ForegroundColor Red
    exit 1
}
Write-Host "Git Pull abgeschlossen" -ForegroundColor Green
Write-Host ""

Write-Host "Schritt 2/3: Docker Build (mit Server-Skript)" -ForegroundColor Yellow
$buildCmd = "cd $ScriptsPath && ./docker-build.sh"
ssh root@$ServerIP $buildCmd
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker Build fehlgeschlagen!" -ForegroundColor Red
    exit 1
}
Write-Host "Docker Build abgeschlossen" -ForegroundColor Green
Write-Host ""

Write-Host "Schritt 3/3: Docker Start (mit Server-Skript)" -ForegroundColor Yellow
$upCmd = "cd $ScriptsPath && ./docker-start.sh"
ssh root@$ServerIP $upCmd
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker Start fehlgeschlagen!" -ForegroundColor Red
    exit 1
}

Write-Host "Warte 5 Sekunden..." -ForegroundColor Gray
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Container-Status:" -ForegroundColor Yellow
$psCmd = "cd $ServerPath; docker-compose -f docker-compose.supabase.yml ps"
ssh root@$ServerIP $psCmd

Write-Host ""
Write-Host "Letzte Logs:" -ForegroundColor Yellow
$logsCmd = "cd $ServerPath; docker-compose -f docker-compose.supabase.yml logs --tail=10"
ssh root@$ServerIP $logsCmd

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT ERFOLGREICH ABGESCHLOSSEN!" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "App verfuegbar unter: http://138.199.237.34" -ForegroundColor Cyan
Write-Host ""
