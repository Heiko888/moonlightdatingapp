# 🚀 Hetzner Server Update nach GitHub Build
# Zieht das neue Docker-Image und startet die Container neu

param(
    [switch]$AutoConfirmBuild = $false
)

Write-Host "🚀 Hetzner Server Update" -ForegroundColor Blue
Write-Host "========================" -ForegroundColor Blue
Write-Host ""

# Server-Daten
$SERVER_IP = "138.199.237.34"
$SSH_USER = "root"
$SSH_KEY = ".\Domain the connection Key"
$SERVER_PATH = "/opt/hd-app"

# Funktionen
function Write-Step {
    param($Message)
    Write-Host "[→] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param($Message)
    Write-Host "[✓] $Message" -ForegroundColor Green
}

function Write-Error {
    param($Message)
    Write-Host "[✗] $Message" -ForegroundColor Red
}

function Write-Info {
    param($Message)
    Write-Host "[ℹ] $Message" -ForegroundColor Yellow
}

# Schritt 1: Verbindung testen
Write-Step "Teste Verbindung zum Server..."
$testConnection = ssh -i $SSH_KEY -o ConnectTimeout=5 ${SSH_USER}@${SERVER_IP} "echo 'connected'" 2>$null
if ($testConnection -eq "connected") {
    Write-Success "Verbindung erfolgreich"
} else {
    Write-Error "Keine Verbindung zum Server!"
    exit 1
}
Write-Host ""

# Schritt 2: GitHub Actions Status prüfen
Write-Step "GitHub Actions Status..."
Write-Info "Bitte überprüfe, ob der GitHub Actions Workflow abgeschlossen ist:"
Write-Host "   https://github.com/Heiko888/moonlightdatingapp/actions" -ForegroundColor Blue
Write-Host ""
if (-not $AutoConfirmBuild) {
    $continue = Read-Host "Ist der Docker Image Build abgeschlossen? (ja/nein)"
    if ($continue -ne "ja") {
        Write-Host "Warte auf Build-Abschluss..." -ForegroundColor Yellow
        exit 0
    }
}
Write-Host ""

# Schritt 3: Aktuellen Container-Status
Write-Step "Aktueller Container-Status..."
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && docker-compose ps"
Write-Host ""

# Schritt 4: Neues Image pullen
Write-Step "Ziehe neues Docker-Image..."
Write-Info "Registry: ghcr.io/heiko888/moonlightdatingapp:main"
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} @"
cd $SERVER_PATH
docker-compose pull
"@

if ($LASTEXITCODE -eq 0) {
    Write-Success "Docker-Image erfolgreich aktualisiert"
} else {
    Write-Error "Fehler beim Pullen des Images"
    exit 1
}
Write-Host ""

# Schritt 5: Container mit neuem Image starten
Write-Step "Starte Container mit neuem Image..."
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} @"
cd $SERVER_PATH
docker-compose up -d --force-recreate frontend nginx
"@

if ($LASTEXITCODE -eq 0) {
    Write-Success "Container erfolgreich neu gestartet"
} else {
    Write-Error "Fehler beim Neustart der Container"
    exit 1
}
Write-Host ""

# Schritt 6: Warte auf Container-Start
Write-Step "Warte 10 Sekunden auf Container-Start..."
Start-Sleep -Seconds 10
Write-Host ""

# Schritt 7: Neuer Container-Status
Write-Step "Neuer Container-Status..."
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && docker-compose ps"
Write-Host ""

# Schritt 8: Nginx-Logs prüfen
Write-Step "Nginx-Logs (letzte 20 Zeilen)..."
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && docker-compose logs --tail=20 nginx"
Write-Host ""

# Schritt 9: Frontend-Logs prüfen
Write-Step "Frontend-Logs (letzte 10 Zeilen)..."
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && docker-compose logs --tail=10 frontend"
Write-Host ""

# Schritt 10: Domain testen
Write-Step "Teste neue Domain..."
Write-Host ""

Write-Host "HTTP-Test:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://www.the-connection-key.de" -TimeoutSec 10 -MaximumRedirection 0
} catch {
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode.value__ -eq 301) {
        Write-Success "✓ HTTP leitet korrekt um (301)"
    } else {
        Write-Info "HTTP Status: $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host "HTTPS-Test:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://www.the-connection-key.de" -TimeoutSec 10 -UseBasicParsing
    Write-Success "✓ HTTPS funktioniert! (Status: $($response.StatusCode))"
    Write-Host "   Content-Length: $($response.RawContentLength) Bytes" -ForegroundColor Gray
} catch {
    Write-Error "✗ HTTPS nicht erreichbar: $($_.Exception.Message)"
    Write-Info "Möglicherweise ist die Nginx-Konfiguration noch nicht korrekt"
    Write-Info "Prüfe die Logs oben für Details"
}

Write-Host ""

# Zusammenfassung
Write-Host "========================================" -ForegroundColor Green
Write-Host "🎉 UPDATE ABGESCHLOSSEN" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Status:" -ForegroundColor Cyan
Write-Host "  ✓ Docker-Image aktualisiert" -ForegroundColor Green
Write-Host "  ✓ Container neu gestartet" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 URLs:" -ForegroundColor Cyan
Write-Host "  Domain:     https://www.the-connection-key.de" -ForegroundColor White
Write-Host "  Server IP:  http://138.199.237.34:3000" -ForegroundColor White
Write-Host "  Grafana:    http://138.199.237.34:3001" -ForegroundColor White
Write-Host "  Prometheus: http://138.199.237.34:9090" -ForegroundColor White
Write-Host ""
Write-Host "📝 Nächste Schritte:" -ForegroundColor Yellow
Write-Host "  1. Teste die Haupt-Domain im Browser" -ForegroundColor White
Write-Host "  2. Überprüfe die SSL-Zertifikat-Warnung (falls vorhanden)" -ForegroundColor White
Write-Host "  3. Falls SSL-Fehler: Nginx-Konfiguration auf Server prüfen" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Nützliche Befehle:" -ForegroundColor Cyan
Write-Host "  Logs live:        ssh -i `"$SSH_KEY`" ${SSH_USER}@${SERVER_IP} 'cd $SERVER_PATH && docker-compose logs -f'" -ForegroundColor Gray
Write-Host "  Container Status: ssh -i `"$SSH_KEY`" ${SSH_USER}@${SERVER_IP} 'cd $SERVER_PATH && docker-compose ps'" -ForegroundColor Gray
Write-Host "  Nginx neuladen:  ssh -i `"$SSH_KEY`" ${SSH_USER}@${SERVER_IP} 'cd $SERVER_PATH && docker-compose restart nginx'" -ForegroundColor Gray
Write-Host ""

# Optional: Browser öffnen
$openBrowser = Read-Host "Browser mit neuer Domain öffnen? (ja/nein)"
if ($openBrowser -eq "ja") {
    Start-Process "https://www.the-connection-key.de"
}

Write-Host ""
Write-Success "Fertig! 🚀"
Write-Host ""
