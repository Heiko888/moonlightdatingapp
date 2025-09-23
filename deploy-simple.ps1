# Einfaches Deployment-Script für Hetzner-Server
param(
    [string]$ServerIP = "138.199.237.34",
    [string]$Username = "root"
)

Write-Host "Deploye HD App auf Hetzner-Server..." -ForegroundColor Blue
Write-Host "Server: $ServerIP" -ForegroundColor Cyan

# 1. Git-Status prüfen und committen
Write-Host "Prüfe Git-Status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Gefundene Änderungen:" -ForegroundColor Cyan
    $gitStatus | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
    
    $commitMessage = Read-Host "Commit-Nachricht eingeben (oder Enter für 'Deploy to Hetzner')"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Deploy to Hetzner - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    
    Write-Host "Committe Änderungen..." -ForegroundColor Yellow
    git add .
    git commit -m $commitMessage
    
    try {
        git push origin main
        Write-Host "Änderungen gepusht" -ForegroundColor Green
    } catch {
        Write-Host "Push fehlgeschlagen (lokales Repository?)" -ForegroundColor Yellow
    }
} else {
    Write-Host "Keine lokalen Änderungen gefunden" -ForegroundColor Green
}

# 2. SSH-Verbindung testen
Write-Host "Teste SSH-Verbindung..." -ForegroundColor Yellow
try {
    ssh -o ConnectTimeout=10 $Username@$ServerIP "echo 'SSH-Verbindung erfolgreich'"
    Write-Host "SSH-Verbindung erfolgreich" -ForegroundColor Green
} catch {
    Write-Host "SSH-Verbindung fehlgeschlagen!" -ForegroundColor Red
    exit 1
}

# 3. Server-Verzeichnis vorbereiten
Write-Host "Bereite Server vor..." -ForegroundColor Yellow
ssh $Username@$ServerIP "mkdir -p /opt/hd-app/HD_App_chart"

# 4. Wichtige Dateien übertragen
Write-Host "Übertrage Dateien..." -ForegroundColor Yellow
$files = @(
    "package.json",
    "docker-compose.supabase.yml",
    "env.supabase",
    "deploy-hetzner.sh"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "   $file" -ForegroundColor Gray
        scp $file $Username@$ServerIP`:/opt/hd-app/HD_App_chart/
    }
}

# 5. Verzeichnisse übertragen
Write-Host "Übertrage Verzeichnisse..." -ForegroundColor Yellow
$dirs = @("backend", "frontend", "grafana", "prometheus")

foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        Write-Host "   $dir" -ForegroundColor Gray
        scp -r $dir $Username@$ServerIP`:/opt/hd-app/HD_App_chart/
    }
}

# 6. Server-seitige Vorbereitung
Write-Host "Bereite Server vor..." -ForegroundColor Yellow
ssh $Username@$ServerIP "cd /opt/hd-app/HD_App_chart && chmod +x deploy-hetzner.sh"

# 7. Docker-Container stoppen
Write-Host "Stoppe Container..." -ForegroundColor Yellow
ssh $Username@$ServerIP "cd /opt/hd-app/HD_App_chart && docker-compose -f docker-compose.supabase.yml down 2>/dev/null || true"

# 8. Environment-Datei prüfen
Write-Host "Prüfe Environment..." -ForegroundColor Yellow
ssh $Username@$ServerIP "cd /opt/hd-app/HD_App_chart && if [ ! -f .env ]; then cp env.supabase .env; fi"

# 9. Services starten
Write-Host "Starte Services..." -ForegroundColor Yellow
ssh $Username@$ServerIP "cd /opt/hd-app/HD_App_chart && docker-compose -f docker-compose.supabase.yml build --no-cache && docker-compose -f docker-compose.supabase.yml up -d"

# 10. Warten und prüfen
Write-Host "Warte auf Services..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "Prüfe Services..." -ForegroundColor Yellow
ssh $Username@$ServerIP "cd /opt/hd-app/HD_App_chart && docker-compose -f docker-compose.supabase.yml ps"

# 11. Health Check
Write-Host "Führe Health Check durch..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://$ServerIP" -UseBasicParsing -TimeoutSec 10
    Write-Host "Frontend: OK (Status $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "Frontend: Fehler - $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "http://$ServerIP:4001/health" -UseBasicParsing -TimeoutSec 10
    Write-Host "Backend: OK (Status $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "Backend: Fehler - $($_.Exception.Message)" -ForegroundColor Red
}

# 12. Zusammenfassung
Write-Host ""
Write-Host "Deployment abgeschlossen!" -ForegroundColor Green
Write-Host ""
Write-Host "Service-URLs:" -ForegroundColor Cyan
Write-Host "   Hauptanwendung: http://$ServerIP" -ForegroundColor White
Write-Host "   Backend API: http://$ServerIP:4001" -ForegroundColor White
Write-Host "   Grafana: http://$ServerIP:3001" -ForegroundColor White
Write-Host "   Prometheus: http://$ServerIP:9090" -ForegroundColor White
Write-Host ""
Write-Host "Nützliche Befehle:" -ForegroundColor Cyan
Write-Host "   Logs: ssh $Username@$ServerIP 'cd /opt/hd-app/HD_App_chart && docker-compose -f docker-compose.supabase.yml logs -f'" -ForegroundColor White
Write-Host "   Status: ssh $Username@$ServerIP 'cd /opt/hd-app/HD_App_chart && docker-compose -f docker-compose.supabase.yml ps'" -ForegroundColor White
Write-Host ""
Write-Host "Deployment erfolgreich abgeschlossen!" -ForegroundColor Green
