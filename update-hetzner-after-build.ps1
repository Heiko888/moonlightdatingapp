# Hetzner Server Update nach GitHub Build
# Zieht das neue Docker-Image und startet die Container neu

param(
    [switch]$AutoConfirmBuild = $false
)

Write-Host "Hetzner Server Update" -ForegroundColor Blue
Write-Host "======================" -ForegroundColor Blue
Write-Host ""

# Server-Daten
$SERVER_IP = "138.199.237.34"
$SSH_USER = "root"
$SSH_KEY = ".\Domain the connection Key"
$SERVER_PATH = "/opt/hd-app/HD_App_chart"
$COMPOSE_FILE = "docker-compose.supabase.yml"

function Write-Step { param($Message) Write-Host "[->] $Message" -ForegroundColor Cyan }
function Write-Success { param($Message) Write-Host "[OK] $Message" -ForegroundColor Green }
function Write-Error { param($Message) Write-Host "[ERR] $Message" -ForegroundColor Red }
function Write-Info { param($Message) Write-Host "[INFO] $Message" -ForegroundColor Yellow }

# Schritt 1: Verbindung testen
Write-Step "Teste Verbindung zum Server..."
$testConnection = ssh -i $SSH_KEY -o ConnectTimeout=5 ${SSH_USER}@${SERVER_IP} "echo connected" 2>$null
if ($testConnection -eq "connected") { Write-Success "Verbindung erfolgreich" } else { Write-Error "Keine Verbindung zum Server"; exit 1 }
Write-Host ""

# Schritt 2: GitHub Actions Status pruefen
Write-Step "GitHub Actions Status"
Write-Info "Bitte pruefe, ob der GitHub Actions Workflow abgeschlossen ist:"
Write-Host "   https://github.com/Heiko888/moonlightdatingapp/actions" -ForegroundColor Blue
Write-Host ""
if (-not $AutoConfirmBuild) {
    $continue = Read-Host "Ist der Docker Image Build abgeschlossen? (ja/nein)"
    if ($continue -ne "ja") { Write-Host "Warte auf Build-Abschluss..." -ForegroundColor Yellow; exit 0 }
}
Write-Host ""

# Schritt 3: Aktuellen Container-Status
Write-Step "Aktueller Container-Status"
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && docker-compose -f $COMPOSE_FILE ps"
Write-Host ""

# Schritt 3.1: Code vom GitHub Repo ziehen
Write-Step "Synchronisiere Code (git pull)"
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && git pull origin main"
Write-Host ""

# Schritt 4: Neues Image pullen
Write-Step "Ziehe neues Docker-Image"
Write-Info "Registry: ghcr.io/heiko888/moonlightdatingapp:main"
$remotePull = "cd $SERVER_PATH; docker-compose -f $COMPOSE_FILE pull"
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} $remotePull
if ($LASTEXITCODE -ne 0) { Write-Error "Fehler beim Pullen des Images"; exit 1 }
Write-Host ""

# Schritt 5: Container mit neuem Image starten
Write-Step "Stoppe laufende Container (compose down)"
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && docker-compose -f $COMPOSE_FILE down"
Write-Host ""

Write-Step "Raeume blockierende Port-Container auf (80/443)"
$free80 = 'docker ps -q --filter "publish=80" | xargs -r docker rm -f'
$free443 = 'docker ps -q --filter "publish=443" | xargs -r docker rm -f'
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} $free80
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} $free443
Write-Host ""

Write-Step "Stoppe systemweiten nginx (falls vorhanden)"
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "systemctl stop nginx 2>/dev/null || true; service nginx stop 2>/dev/null || true; nginx -s stop 2>/dev/null || true; pkill -f nginx 2>/dev/null || true"
Write-Host ""

Write-Step "Kille Prozesse, die Ports 80/443 belegen (docker-proxy etc.)"
$kill80 = "for p in $(ss -ltnp | grep -E ':80 ' | sed -n \"s/.*pid=\\([0-9]\\+\\).*/\\1/p\"); do kill -9 $p 2>/dev/null || true; done"
$kill443 = "for p in $(ss -ltnp | grep -E ':443 ' | sed -n \"s/.*pid=\\([0-9]\\+\\).*/\\1/p\"); do kill -9 $p 2>/dev/null || true; done"
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} $kill80
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} $kill443
Write-Host ""

Write-Step "Starte Container mit neuem Image"
$remoteUp = "cd $SERVER_PATH; docker-compose -f $COMPOSE_FILE up -d --force-recreate frontend nginx"
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} $remoteUp
if ($LASTEXITCODE -ne 0) { Write-Error "Fehler beim Neustart der Container"; exit 1 }
Write-Host ""

# Schritt 5.1: Frontend neu bauen (falls build verwendet wird)
Write-Step "Baue Frontend neu (no-cache)"
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && docker-compose -f $COMPOSE_FILE build --no-cache frontend"
if ($LASTEXITCODE -ne 0) { Write-Error "Fehler beim Frontend-Build"; exit 1 }
Write-Host ""

# Schritt 6: Warte auf Container-Start
Write-Step "Warte 10 Sekunden auf Container-Start"
Start-Sleep -Seconds 10
Write-Host ""

# Schritt 7: Neuer Container-Status
Write-Step "Neuer Container-Status"
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && docker-compose -f $COMPOSE_FILE ps"
Write-Host ""

# Schritt 8: Nginx-Logs pruefen
Write-Step "Nginx-Logs (letzte 20 Zeilen)"
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && docker-compose -f $COMPOSE_FILE logs --tail=20 nginx"
Write-Host ""

# Schritt 9: Frontend-Logs pruefen
Write-Step "Frontend-Logs (letzte 10 Zeilen)"
ssh -i $SSH_KEY ${SSH_USER}@${SERVER_IP} "cd $SERVER_PATH && docker-compose -f $COMPOSE_FILE logs --tail=10 frontend"
Write-Host ""

# Schritt 10: HTTPS Test
Write-Step "HTTPS Test"
try {
    $response = Invoke-WebRequest -Uri "https://www.the-connection-key.de" -TimeoutSec 10 -UseBasicParsing
    Write-Success "HTTPS funktioniert (Status: $($response.StatusCode))"
} catch {
    Write-Error "HTTPS nicht erreichbar: $($_.Exception.Message)"
}
Write-Host ""

# Zusammenfassung
Write-Host "========================================" -ForegroundColor Green
Write-Host "UPDATE ABGESCHLOSSEN" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "  Domain:     https://www.the-connection-key.de" -ForegroundColor White
Write-Host "  Server IP:  http://138.199.237.34:3000" -ForegroundColor White
Write-Host "  Grafana:    http://138.199.237.34:3001" -ForegroundColor White
Write-Host "  Prometheus: http://138.199.237.34:9090" -ForegroundColor White
Write-Host ""
Write-Host "Naechste Schritte:" -ForegroundColor Yellow
Write-Host "  1. Teste die Haupt-Domain im Browser" -ForegroundColor White
Write-Host "  2. Pruefe Logs, falls Fehler auftreten" -ForegroundColor White
Write-Host ""

if (-not $AutoConfirmBuild) {
    $openBrowser = Read-Host "Browser mit neuer Domain oeffnen? (ja/nein)"
    if ($openBrowser -eq "ja") { Start-Process "https://www.the-connection-key.de" }
}

Write-Host ""
Write-Success "Fertig!"
Write-Host ""
