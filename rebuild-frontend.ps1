# Rebuild Frontend - Fix missing static files
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  REBUILD FRONTEND - Fix Static Files" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Stoppe Container..." -ForegroundColor Yellow
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml stop frontend"
Write-Host ""

Write-Host "2. Lösche alten Build..." -ForegroundColor Yellow
ssh $server "cd $path/frontend && rm -rf .next"
Write-Host ""

Write-Host "3. Baue Frontend NEU (10-15 Min)..." -ForegroundColor Yellow
Write-Host "   Bitte warten..." -ForegroundColor Gray
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml build --no-cache frontend 2>&1 | grep -E 'Step|error|ERROR|Successfully|built'"
Write-Host ""

Write-Host "4. Starte Frontend..." -ForegroundColor Yellow
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml up -d frontend"
Write-Host ""

Write-Host "5. Warte 10 Sekunden..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "6. Prüfe Status..." -ForegroundColor Yellow
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml ps frontend"
Write-Host ""

Write-Host "7. Prüfe Logs..." -ForegroundColor Yellow
ssh $server "docker logs hd_app_chart_frontend_1 --tail 20"
Write-Host ""

Write-Host "================================================" -ForegroundColor Green
Write-Host "  REBUILD COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Teste jetzt: http://138.199.237.34:3000" -ForegroundColor Cyan
Write-Host "Drücke STRG+SHIFT+R im Browser um Cache zu leeren!" -ForegroundColor Yellow

