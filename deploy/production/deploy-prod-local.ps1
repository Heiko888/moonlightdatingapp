# ===========================================
# PRODUCTION-LOCAL DEPLOYMENT
# ===========================================

Write-Host "`n🚀 PRODUCTION-LOCAL DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Alte Container stoppen
Write-Host "`n1. Alte Container stoppen..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod-local.yml down

# 2. Docker Build
Write-Host "`n2. Docker Build (Production)..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod-local.yml build --no-cache

# 3. Container starten
Write-Host "`n3. Container starten..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod-local.yml up -d

# 4. Warten auf Container-Start
Write-Host "`n4. Warten auf Container-Start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# 5. Health Checks
Write-Host "`n5. Health Checks..." -ForegroundColor Yellow

Write-Host "   Frontend (Port 3004)..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3004" -Method HEAD -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend: OK" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Frontend: FEHLER" -ForegroundColor Red
}

Write-Host "   Nginx HTTP (Port 8004)..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8004" -Method HEAD -TimeoutSec 10 -MaximumRedirection 0 -ErrorAction SilentlyContinue
    Write-Host "   ✅ Nginx HTTP: OK (Redirect zu HTTPS)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 301) {
        Write-Host "   ✅ Nginx HTTP: OK (Redirect zu HTTPS)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Nginx HTTP: FEHLER" -ForegroundColor Red
    }
}

Write-Host "   Grafana (Port 3005)..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3005" -Method HEAD -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Grafana: OK" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Grafana: FEHLER" -ForegroundColor Red
}

Write-Host "   Prometheus (Port 9092)..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:9092" -Method HEAD -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Prometheus: OK" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Prometheus: FEHLER" -ForegroundColor Red
}

Write-Host "   Redis (Port 6380)..." -ForegroundColor White
try {
    $tcpConnection = Test-NetConnection -ComputerName localhost -Port 6380 -WarningAction SilentlyContinue
    if ($tcpConnection.TcpTestSucceeded) {
        Write-Host "   ✅ Redis: OK" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Redis: FEHLER" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Redis: FEHLER" -ForegroundColor Red
}

# 6. Container Status
Write-Host "`n6. Container Status..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod-local.yml ps

# 7. Resource Usage
Write-Host "`n7. Resource Usage..." -ForegroundColor Yellow
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" $(docker-compose -f docker-compose.prod-local.yml ps -q)

# 8. Logs anzeigen
Write-Host "`n8. Letzte Logs..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod-local.yml logs --tail=20

Write-Host "`n✅ PRODUCTION-LOCAL DEPLOYMENT ABGESCHLOSSEN" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "`nZugriff:" -ForegroundColor Cyan
Write-Host "   • Frontend: http://localhost:3004" -ForegroundColor White
Write-Host "   • Nginx HTTP: http://localhost:8004 (→ HTTPS)" -ForegroundColor White
Write-Host "   • Nginx HTTPS: https://localhost:8443" -ForegroundColor White
Write-Host "   • Grafana: http://localhost:3005" -ForegroundColor White
Write-Host "   • Prometheus: http://localhost:9092" -ForegroundColor White
Write-Host "   • Alertmanager: http://localhost:9094" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  HINWEIS: Dies ist eine lokale Production-Simulation!" -ForegroundColor Yellow
Write-Host "   Für echtes Production-Deployment: .\deploy\production\setup-production.ps1" -ForegroundColor Yellow
Write-Host ""

