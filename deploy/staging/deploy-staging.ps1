# ===========================================
# STAGING ENVIRONMENT DEPLOYMENT
# ===========================================

Write-Host "`n🚀 STAGING DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Alte Container stoppen
Write-Host "`n1. Alte Container stoppen..." -ForegroundColor Yellow
docker-compose -f docker-compose.staging.yml down

# 2. Docker Build
Write-Host "`n2. Docker Build (Staging)..." -ForegroundColor Yellow
docker-compose -f docker-compose.staging.yml build --no-cache

# 3. Container starten
Write-Host "`n3. Container starten..." -ForegroundColor Yellow
docker-compose -f docker-compose.staging.yml up -d

# 4. Warten auf Container-Start
Write-Host "`n4. Warten auf Container-Start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 5. Health Checks
Write-Host "`n5. Health Checks..." -ForegroundColor Yellow

Write-Host "   Frontend (Port 3002)..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002" -Method HEAD -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend: OK" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Frontend: FEHLER" -ForegroundColor Red
}

Write-Host "   Grafana (Port 3003)..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3003" -Method HEAD -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Grafana: OK" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Grafana: FEHLER" -ForegroundColor Red
}

Write-Host "   Prometheus (Port 9091)..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:9091" -Method HEAD -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Prometheus: OK" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Prometheus: FEHLER" -ForegroundColor Red
}

# 6. Container Status
Write-Host "`n6. Container Status..." -ForegroundColor Yellow
docker-compose -f docker-compose.staging.yml ps

# 7. Logs anzeigen
Write-Host "`n7. Letzte Logs..." -ForegroundColor Yellow
docker-compose -f docker-compose.staging.yml logs --tail=20

Write-Host "`n✅ STAGING DEPLOYMENT ABGESCHLOSSEN" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "`nZugriff:" -ForegroundColor Cyan
Write-Host "   • Frontend: http://localhost:3002" -ForegroundColor White
Write-Host "   • Nginx: http://localhost:8002" -ForegroundColor White
Write-Host "   • Grafana: http://localhost:3003" -ForegroundColor White
Write-Host "   • Prometheus: http://localhost:9091" -ForegroundColor White
Write-Host ""

