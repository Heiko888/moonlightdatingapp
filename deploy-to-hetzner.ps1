# ===========================================
# HETZNER DEPLOYMENT - Social Sharing Update
# ===========================================

$ServerIP = "138.199.237.34"
$Username = "root"
$ServerPath = "/opt/hd-app/HD_App_chart"
$SSH = "ssh -o ConnectTimeout=7 -o ServerAliveInterval=15 -o ServerAliveCountMax=4 -o StrictHostKeyChecking=no"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  HETZNER DEPLOYMENT - Social Sharing Update" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 1. GitHub auf Hetzner pullen
Write-Host "1️⃣  GitHub Repository auf Hetzner Server pullen..." -ForegroundColor Yellow
& $SSH "$Username@$ServerIP" "cd $ServerPath && git pull origin main"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git Pull fehlgeschlagen!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git Pull erfolgreich!" -ForegroundColor Green
Write-Host ""

# 2. Dependencies installieren
Write-Host "2️⃣  Dependencies installieren (html2canvas, nanoid)..." -ForegroundColor Yellow
& $SSH "$Username@$ServerIP" "cd $ServerPath/frontend && npm install"

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  npm install hatte Fehler, aber weiter..." -ForegroundColor Yellow
}

Write-Host "✅ Dependencies installiert!" -ForegroundColor Green
Write-Host ""

# 3. Docker Container stoppen
Write-Host "3️⃣  Stoppe laufende Docker Container..." -ForegroundColor Yellow
& $SSH "$Username@$ServerIP" "cd $ServerPath && docker-compose -f docker-compose.supabase.yml down"

Write-Host "✅ Container gestoppt!" -ForegroundColor Green
Write-Host ""

# 4. Frontend neu bauen (ohne Cache)
Write-Host "4️⃣  Frontend neu bauen..." -ForegroundColor Yellow
& $SSH "$Username@$ServerIP" "cd $ServerPath && docker-compose -f docker-compose.supabase.yml build --no-cache frontend"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend Build fehlgeschlagen!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend Build erfolgreich!" -ForegroundColor Green
Write-Host ""

# 5. Alle Services starten
Write-Host "5️⃣  Starte alle Services..." -ForegroundColor Yellow
& $SSH "$Username@$ServerIP" "cd $ServerPath && docker-compose -f docker-compose.supabase.yml up -d"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Services konnten nicht gestartet werden!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Alle Services gestartet!" -ForegroundColor Green
Write-Host ""

# 6. Warte 10 Sekunden für Service-Start
Write-Host "⏳ Warte 10 Sekunden für Service-Start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 7. Health Check
Write-Host "6️⃣  Health Check..." -ForegroundColor Yellow
Write-Host ""

Write-Host "   Frontend (Port 3000): " -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://${ServerIP}:3000" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ ONLINE" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ OFFLINE" -ForegroundColor Red
}

Write-Host "   Grafana (Port 3001): " -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://${ServerIP}:3001" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 302) {
        Write-Host "✅ ONLINE" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ OFFLINE" -ForegroundColor Red
}

Write-Host "   Prometheus (Port 9090): " -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://${ServerIP}:9090" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ ONLINE" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ OFFLINE" -ForegroundColor Red
}

Write-Host ""

# 8. Docker Container Status
Write-Host "7️⃣  Docker Container Status..." -ForegroundColor Yellow
& $SSH "$Username@$ServerIP" "cd $ServerPath && docker-compose -f docker-compose.supabase.yml ps"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  ✅ DEPLOYMENT ABGESCHLOSSEN!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Social Sharing System ist jetzt auf Hetzner live!" -ForegroundColor Green
Write-Host ""
Write-Host "Naechste Schritte:" -ForegroundColor Yellow
Write-Host "   1. Teste Social Share: http://$ServerIP`:3000/chart" -ForegroundColor White
Write-Host "   2. Teste Dashboard: http://$ServerIP`:3000/dashboard" -ForegroundColor White
Write-Host "   3. Teste Transits: http://$ServerIP`:3000/transits" -ForegroundColor White
Write-Host ""

