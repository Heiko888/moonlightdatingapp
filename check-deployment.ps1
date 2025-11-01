# Deployment-Status prüfen
$ServerIP = "138.199.237.34"
$ServerPath = "/opt/hd-app/HD_App_chart"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT-STATUS PRUEFEN" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Git Status auf Server..." -ForegroundColor Yellow
$gitStatusCmd = "cd $ServerPath; git rev-parse --short HEAD; git log -1 --oneline"
$gitStatus = ssh root@$ServerIP $gitStatusCmd
Write-Host $gitStatus
Write-Host ""

Write-Host "2. Container Status..." -ForegroundColor Yellow
$containerCmd = "cd $ServerPath; docker-compose -f docker-compose.supabase.yml ps"
ssh root@$ServerIP $containerCmd
Write-Host ""

Write-Host "3. Pruefe neue Dateien..." -ForegroundColor Yellow
$scriptsCmd = "cd $ServerPath; if [ -d scripts ]; then echo 'Scripts-Verzeichnis gefunden:'; ls -la scripts/*.sh 2>/dev/null | wc -l; else echo 'Scripts-Verzeichnis nicht gefunden'; fi"
$scriptsCheck = ssh root@$ServerIP $scriptsCmd
Write-Host $scriptsCheck
Write-Host ""

Write-Host "4. Pruefe Deployment-Dokumentation..." -ForegroundColor Yellow
$docCmd = "cd $ServerPath; ls -la DEPLOYMENT-STRATEGY-FINAL.md 2>/dev/null && echo 'Gefunden' || echo 'Nicht gefunden'"
$docCheck = ssh root@$ServerIP $docCmd
Write-Host $docCheck
Write-Host ""

Write-Host "5. Pruefe Coach Reading Onboarding..." -ForegroundColor Yellow
$coachCmd = "cd $ServerPath; ls -la frontend/app/coach/readings/create/page.tsx 2>/dev/null && echo 'Datei gefunden' || echo 'Datei nicht gefunden'"
$coachCheck = ssh root@$ServerIP $coachCmd
Write-Host $coachCheck
Write-Host ""

Write-Host "6. Letzte Container Logs (Frontend)..." -ForegroundColor Yellow
$logsCmd = "cd $ServerPath; docker-compose -f docker-compose.supabase.yml logs --tail=10 frontend"
ssh root@$ServerIP $logsCmd
Write-Host ""

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  STATUS-PRUEFUNG ABGESCHLOSSEN" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

