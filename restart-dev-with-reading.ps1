# ===========================================
# DEV ENVIRONMENT NEU STARTEN MIT READING SYSTEM
# ===========================================

Write-Host "`n🔄 DEV ENVIRONMENT NEU STARTEN" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Alte Container stoppen
Write-Host "`n1. Stoppe Container..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev-3005.yml down

# 2. Container mit neuem Code starten (kein rebuild nötig im dev mode)
Write-Host "`n2. Starte Container..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev-3005.yml up -d

# 3. Warten auf Start
Write-Host "`n3. Warte 20 Sekunden auf Container-Start..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# 4. Logs anzeigen
Write-Host "`n4. Aktuelle Logs..." -ForegroundColor Yellow
docker logs hd-app-frontend-dev-3005 --tail 30

# 5. Status prüfen
Write-Host "`n5. Container Status..." -ForegroundColor Yellow
docker ps | Select-String "hd-app"

Write-Host "`n✅ NEUSTART ABGESCHLOSSEN" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "`n📍 Teste jetzt:" -ForegroundColor Cyan
Write-Host "   • http://localhost:3005/reading" -ForegroundColor White
Write-Host "   • http://localhost:3005/coach/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Wenn Fehler auftreten:" -ForegroundColor Yellow
Write-Host "   docker logs hd-app-frontend-dev-3005 -f" -ForegroundColor White
Write-Host ""

