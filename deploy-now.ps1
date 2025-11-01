# Deployment ueber die neuen Server-Skripte
$ServerIP = "138.199.237.34"
$ServerPath = "/opt/hd-app/HD_App_chart"
$ScriptsPath = "$ServerPath/scripts"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT ZU HETZNER SERVER" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Schritt 1/3: Git Pull" -ForegroundColor Yellow
$gitCmd = "cd $ServerPath; git fetch origin main; git pull origin main; git rev-parse --short HEAD"
$result1 = ssh root@$ServerIP $gitCmd
Write-Host "Git Pull abgeschlossen" -ForegroundColor Green
Write-Host "Commit: $result1" -ForegroundColor Gray
Write-Host ""

Write-Host "Schritt 2/3: Docker Build" -ForegroundColor Yellow
Write-Host "Container werden gestoppt..." -ForegroundColor Gray
$downCmd = "cd $ServerPath; docker-compose -f docker-compose.supabase.yml down"
ssh root@$ServerIP $downCmd | Out-Null

Write-Host "Frontend wird neu gebaut (no-cache)..." -ForegroundColor Gray
$buildCmd = "cd $ServerPath; docker-compose -f docker-compose.supabase.yml build --no-cache frontend"
ssh root@$ServerIP $buildCmd
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker Build fehlgeschlagen!" -ForegroundColor Red
    exit 1
}
Write-Host "Docker Build abgeschlossen" -ForegroundColor Green
Write-Host ""

Write-Host "Schritt 3/3: Docker Start" -ForegroundColor Yellow
$upCmd = "cd $ServerPath; docker-compose -f docker-compose.supabase.yml up -d"
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
