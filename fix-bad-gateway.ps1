# Bad Gateway (502) Fehler beheben
# Dieses Skript diagnostiziert und repariert Bad Gateway Fehler

Write-Host "=== Bad Gateway (502) Fehler Diagnose und Reparatur ===" -ForegroundColor Cyan
Write-Host ""

# 1. Container Status prüfen
Write-Host "1. Container Status prüfen..." -ForegroundColor Yellow
Write-Host ""
$containers = docker compose -f docker-compose.supabase.yml ps 2>&1
Write-Host $containers

$frontendRunning = $containers -match "frontend.*Up"
$nginxRunning = $containers -match "nginx.*Up"

Write-Host ""
if (-not $frontendRunning) {
    Write-Host "⚠️  Frontend-Container läuft NICHT!" -ForegroundColor Red
} else {
    Write-Host "✅ Frontend-Container läuft" -ForegroundColor Green
}

if (-not $nginxRunning) {
    Write-Host "⚠️  Nginx-Container läuft NICHT!" -ForegroundColor Red
} else {
    Write-Host "✅ Nginx-Container läuft" -ForegroundColor Green
}

Write-Host ""
Write-Host "2. Frontend-Logs prüfen (letzte 30 Zeilen)..." -ForegroundColor Yellow
Write-Host ""
docker compose -f docker-compose.supabase.yml logs --tail=30 frontend 2>&1

Write-Host ""
Write-Host "3. Nginx Error-Logs prüfen..." -ForegroundColor Yellow
Write-Host ""
$nginxContainer = docker ps --filter "name=nginx" --format "{{.Names}}" | Select-Object -First 1
if ($nginxContainer) {
    Write-Host "Nginx Container: $nginxContainer" -ForegroundColor Cyan
    docker exec $nginxContainer tail -30 /var/log/nginx/error.log 2>&1
} else {
    Write-Host "⚠️  Nginx-Container nicht gefunden!" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Docker-Netzwerk prüfen..." -ForegroundColor Yellow
Write-Host ""
$networkName = docker compose -f docker-compose.supabase.yml config 2>&1 | Select-String -Pattern "networks:" -Context 0,2 | Select-Object -Last 1
if (-not $networkName) {
    $networkName = "hd_app_chart_default"
    Write-Host "Verwende Standard-Netzwerk: $networkName" -ForegroundColor Cyan
}

$networkInfo = docker network inspect $networkName 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host $networkInfo | Select-String -Pattern "Containers" -Context 0,10
} else {
    Write-Host "⚠️  Netzwerk nicht gefunden oder kann nicht inspiziert werden" -ForegroundColor Red
    Write-Host "Verfügbare Netzwerke:" -ForegroundColor Yellow
    docker network ls
}

Write-Host ""
Write-Host "5. Frontend-Verbindungstest von Nginx..." -ForegroundColor Yellow
Write-Host ""
if ($nginxContainer) {
    Write-Host "Ping zu Frontend..." -ForegroundColor Cyan
    docker exec $nginxContainer ping -c 2 frontend 2>&1
    
    Write-Host ""
    Write-Host "HTTP-Verbindung zu Frontend:3000..." -ForegroundColor Cyan
    docker exec $nginxContainer wget -q -O- --timeout=5 http://frontend:3000/health 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Frontend ist von Nginx nicht erreichbar!" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Kann Frontend-Verbindung nicht testen (Nginx-Container nicht gefunden)" -ForegroundColor Red
}

Write-Host ""
Write-Host "6. Direkter Frontend-Test (vom Host)..." -ForegroundColor Yellow
Write-Host ""
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Frontend antwortet auf Port 3000 (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Frontend antwortet NICHT auf Port 3000" -ForegroundColor Red
    Write-Host "Fehler: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Reparatur-Versuche ===" -ForegroundColor Cyan
Write-Host ""

# Reparatur 1: Frontend neu starten
Write-Host "Reparatur 1: Frontend-Container neu starten..." -ForegroundColor Yellow
docker compose -f docker-compose.supabase.yml restart frontend 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend neu gestartet" -ForegroundColor Green
    Write-Host "Warte 15 Sekunden bis Frontend bereit ist..." -ForegroundColor Cyan
    Start-Sleep -Seconds 15
} else {
    Write-Host "⚠️  Frontend-Neustart fehlgeschlagen" -ForegroundColor Red
}

# Reparatur 2: Nginx neu starten
Write-Host ""
Write-Host "Reparatur 2: Nginx-Container neu starten..." -ForegroundColor Yellow
docker compose -f docker-compose.supabase.yml restart nginx 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Nginx neu gestartet" -ForegroundColor Green
    Start-Sleep -Seconds 5
} else {
    Write-Host "⚠️  Nginx-Neustart fehlgeschlagen" -ForegroundColor Red
}

# Reparatur 3: Wenn Frontend nicht läuft, neu aufbauen
if (-not $frontendRunning) {
    Write-Host ""
    Write-Host "Reparatur 3: Frontend-Container neu aufbauen..." -ForegroundColor Yellow
    Write-Host "Dies kann einige Minuten dauern..." -ForegroundColor Cyan
    docker compose -f docker-compose.supabase.yml up -d --build frontend 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend wird neu aufgebaut" -ForegroundColor Green
        Write-Host "Warte 30 Sekunden bis Build abgeschlossen ist..." -ForegroundColor Cyan
        Start-Sleep -Seconds 30
    } else {
        Write-Host "⚠️  Frontend-Build fehlgeschlagen" -ForegroundColor Red
    }
}

# Finale Statusprüfung
Write-Host ""
Write-Host "=== Finale Statusprüfung ===" -ForegroundColor Cyan
Write-Host ""
$finalContainers = docker compose -f docker-compose.supabase.yml ps 2>&1
Write-Host $finalContainers

$finalFrontendRunning = $finalContainers -match "frontend.*Up"
$finalNginxRunning = $finalContainers -match "nginx.*Up"

Write-Host ""
if ($finalFrontendRunning -and $finalNginxRunning) {
    Write-Host "✅ Beide Container laufen jetzt" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Teste HTTP-Verbindung..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    try {
        $testResponse = Invoke-WebRequest -Uri "http://localhost" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host "✅ HTTP-Verbindung erfolgreich (Status: $($testResponse.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  HTTP-Verbindung schlägt noch fehl" -ForegroundColor Red
        Write-Host "Fehler: $_" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Problem besteht weiterhin" -ForegroundColor Red
    if (-not $finalFrontendRunning) {
        Write-Host "   - Frontend läuft nicht" -ForegroundColor Red
    }
    if (-not $finalNginxRunning) {
        Write-Host "   - Nginx läuft nicht" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Bitte prüfe die Logs manuell:" -ForegroundColor Yellow
    Write-Host "  docker compose -f docker-compose.supabase.yml logs frontend" -ForegroundColor Cyan
    Write-Host "  docker compose -f docker-compose.supabase.yml logs nginx" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=== Diagnose und Reparatur abgeschlossen ===" -ForegroundColor Cyan

