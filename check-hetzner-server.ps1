# 🔍 HD App - Hetzner Server Status Check
# PowerShell Version für Windows

Write-Host "🔍 HD App - Hetzner Server Status Check" -ForegroundColor Blue
Write-Host "=========================================" -ForegroundColor Blue
Write-Host ""

# Server Details
$HETZNER_IP = "138.199.237.34"
$DOMAIN = "www.the-connection-key.de"

# Farben für Output
function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "[SUCCESS] $msg" -ForegroundColor Green }
function Write-Warning { param($msg) Write-Host "[WARNING] $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }

# 1. Lokale System Checks
Write-Info "=== LOKALE SYSTEM CHECKS ==="
Write-Host "Aktuelles Verzeichnis: $(Get-Location)"
Write-Host "Verfügbarer Speicher: $((Get-WmiObject -Class Win32_LogicalDisk | Where-Object {$_.DeviceID -eq 'C:'}).FreeSpace / 1GB) GB"
Write-Host ""

# 2. Docker Status (falls lokal installiert)
Write-Info "=== DOCKER STATUS ==="
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Success "Docker ist installiert: $dockerVersion"
        Write-Host "Docker Container:"
        docker ps -a 2>$null
    } else {
        Write-Warning "Docker nicht lokal installiert"
    }
} catch {
    Write-Warning "Docker nicht verfügbar"
}
Write-Host ""

# 3. Git Status
Write-Info "=== GIT STATUS ==="
try {
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        Write-Warning "Uncommitted changes gefunden:"
        $gitStatus | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
    } else {
        Write-Success "Git Repository ist sauber"
    }
    
    $gitBranch = git branch --show-current 2>$null
    Write-Host "Aktueller Branch: $gitBranch"
} catch {
    Write-Warning "Git nicht verfügbar oder kein Repository"
}
Write-Host ""

# 4. Hetzner Server Connectivity Test
Write-Info "=== HETZNER SERVER CONNECTIVITY ==="

# Ping Test
Write-Host "Ping Test zu $HETZNER_IP..."
$pingResult = Test-Connection -ComputerName $HETZNER_IP -Count 4 -Quiet
if ($pingResult) {
    Write-Success "Server ist erreichbar (Ping OK)"
} else {
    Write-Error "Server ist NICHT erreichbar (Ping Failed)"
}
Write-Host ""

# Port Tests
Write-Info "Port Connectivity Tests:"

$ports = @{
    "SSH (22)" = 22
    "HTTP (80)" = 80
    "HTTPS (443)" = 443
    "Frontend (3000)" = 3000
    "Grafana (3001)" = 3001
    "Prometheus (9090)" = 9090
}

foreach ($portName in $ports.Keys) {
    $port = $ports[$portName]
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.ReceiveTimeout = 3000
        $tcpClient.SendTimeout = 3000
        $result = $tcpClient.ConnectAsync($HETZNER_IP, $port).Wait(3000)
        $tcpClient.Close()
        
        if ($result) {
            Write-Success "$portName ist offen"
        } else {
            Write-Warning "$portName ist geschlossen oder nicht erreichbar"
        }
    } catch {
        Write-Warning "$portName ist nicht erreichbar"
    }
}
Write-Host ""

# 5. HTTP Service Tests
Write-Info "=== HTTP SERVICE TESTS ==="

# Frontend Test
Write-Host "Frontend Service Test (Port 3000)..."
try {
    $response = Invoke-WebRequest -Uri "http://$HETZNER_IP:3000" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Success "Frontend läuft auf Port 3000"
    } else {
        Write-Warning "Frontend antwortet mit Status: $($response.StatusCode)"
    }
} catch {
    Write-Error "Frontend nicht erreichbar auf Port 3000"
}

# Grafana Test
Write-Host "Grafana Service Test (Port 3001)..."
try {
    $response = Invoke-WebRequest -Uri "http://$HETZNER_IP:3001" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Success "Grafana läuft auf Port 3001"
    } else {
        Write-Warning "Grafana antwortet mit Status: $($response.StatusCode)"
    }
} catch {
    Write-Error "Grafana nicht erreichbar auf Port 3001"
}

# HTTPS Test (falls SSL konfiguriert)
Write-Host "HTTPS Test (Port 443)..."
try {
    $response = Invoke-WebRequest -Uri "https://$HETZNER_IP" -TimeoutSec 10 -UseBasicParsing -SkipCertificateCheck
    if ($response.StatusCode -eq 200) {
        Write-Success "HTTPS läuft auf Port 443"
    } else {
        Write-Warning "HTTPS antwortet mit Status: $($response.StatusCode)"
    }
} catch {
    Write-Warning "HTTPS nicht erreichbar oder SSL-Problem"
}
Write-Host ""

# 6. Domain Test (falls konfiguriert)
Write-Info "=== DOMAIN TEST ==="
if ($DOMAIN) {
    Write-Host "Domain Test: $DOMAIN"
    try {
        $response = Invoke-WebRequest -Uri "https://$DOMAIN" -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "Domain ist erreichbar: https://$DOMAIN"
        } else {
            Write-Warning "Domain antwortet mit Status: $($response.StatusCode)"
        }
    } catch {
        Write-Error "Domain nicht erreichbar: $DOMAIN"
    }
} else {
    Write-Warning "Keine Domain konfiguriert"
}
Write-Host ""

# 7. Deployment Status Check
Write-Info "=== DEPLOYMENT STATUS ==="
Write-Host "Prüfe ob neues Deployment nötig ist..."

# Git Status für Deployment
try {
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        Write-Warning "Lokale Änderungen gefunden - Deployment empfohlen"
        Write-Host "Uncommitted files:"
        $gitStatus | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
    } else {
        Write-Success "Keine lokalen Änderungen - Repository ist sauber"
    }
} catch {
    Write-Warning "Git Status konnte nicht geprüft werden"
}
Write-Host ""

# 8. Empfohlene Aktionen
Write-Info "=== EMPFOHLENE AKTIONEN ==="

if (-not $pingResult) {
    Write-Error "🚨 KRITISCH: Server ist nicht erreichbar!"
    Write-Host "1. Prüfen Sie die Server-IP: $HETZNER_IP"
    Write-Host "2. Prüfen Sie die Netzwerkverbindung"
    Write-Host "3. Prüfen Sie die Firewall-Einstellungen"
} else {
    Write-Success "✅ Server ist erreichbar"
    
    Write-Host ""
    Write-Host "🔧 Nächste Schritte:"
    Write-Host "1. SSH-Verbindung zum Server:"
    Write-Host "   ssh root@$HETZNER_IP"
    Write-Host ""
    Write-Host "2. Server-Diagnose ausführen:"
    Write-Host "   cd /opt/hd-app/HD_App_chart"
    Write-Host "   ./deploy/hetzner/check-server-errors.sh"
    Write-Host ""
    Write-Host "3. Services neu starten (falls nötig):"
    Write-Host "   docker-compose -f docker-compose.supabase.yml down"
    Write-Host "   docker-compose -f docker-compose.supabase.yml up -d"
    Write-Host ""
    Write-Host "4. Neues Deployment (falls lokale Änderungen):"
    Write-Host "   git add ."
    Write-Host "   git commit -m 'Update: $(Get-Date -Format \"yyyy-MM-dd HH:mm\")'"
    Write-Host "   git push origin main"
    Write-Host "   # Dann auf Server: git pull origin main"
}

Write-Host ""
Write-Info "=== DIAGNOSE ABGESCHLOSSEN ==="
Write-Host "Prüfen Sie die obigen Ergebnisse und folgen Sie den empfohlenen Aktionen."
