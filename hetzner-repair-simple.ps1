# Hetzner Services Reparieren - Simple Version
Write-Host "Hetzner Services Reparatur" -ForegroundColor Blue
Write-Host "===========================" -ForegroundColor Blue
Write-Host ""

$HETZNER_IP = "138.199.237.34"

Write-Host "Verbinde zu $HETZNER_IP..." -ForegroundColor Cyan
Write-Host ""
Write-Host "HINWEIS: Das Script wird SSH-Befehle senden." -ForegroundColor Yellow
Write-Host "Falls du nach einem Passwort gefragt wirst, gib dein SSH-Passwort ein." -ForegroundColor Yellow
Write-Host ""

# Einfacher SSH-Befehl
$result = ssh root@$HETZNER_IP @"
cd /opt/hd-app/HD_App_chart && \
echo 'Stopping services...' && \
docker-compose -f docker-compose.supabase.yml down && \
echo 'Pulling latest code...' && \
git pull origin main && \
echo 'Starting services...' && \
docker-compose -f docker-compose.supabase.yml up -d && \
echo 'Waiting 20 seconds...' && \
sleep 20 && \
echo 'Service Status:' && \
docker ps && \
echo 'Done!'
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Reparatur abgeschlossen!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Teste Services in 5 Sekunden..." -ForegroundColor Cyan
    Start-Sleep -Seconds 5
    
    Write-Host ""
    Write-Host "Testing Frontend (Port 3000)..."
    try {
        $response = Invoke-WebRequest -Uri "http://$HETZNER_IP:3000" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        Write-Host "Frontend laeuft! Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "Frontend noch nicht erreichbar" -ForegroundColor Yellow
    }
    
    Write-Host "Testing Grafana (Port 3001)..."
    try {
        $response = Invoke-WebRequest -Uri "http://$HETZNER_IP:3001" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        Write-Host "Grafana laeuft! Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "Grafana noch nicht erreichbar" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "Fehler bei SSH-Verbindung!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manuelle Schritte:" -ForegroundColor Yellow
    Write-Host "1. ssh root@$HETZNER_IP"
    Write-Host "2. cd /opt/hd-app/HD_App_chart"
    Write-Host "3. docker-compose -f docker-compose.supabase.yml down"
    Write-Host "4. docker-compose -f docker-compose.supabase.yml up -d"
}

Write-Host ""
Write-Host "Script beendet" -ForegroundColor Blue

