# 🚀 HD App - Alle Server neu starten (PowerShell Version)
# Führt einen kompletten Reboot aller Services durch

Write-Host "🚀 HD App - Alle Server werden neu gestartet..." -ForegroundColor Blue
Write-Host "==============================================" -ForegroundColor Blue

# Funktionen für farbige Ausgabe
function Write-Step {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Info {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

# 1. Zum App-Verzeichnis wechseln
Write-Step "Zum App-Verzeichnis wechseln..."
$currentDir = Get-Location
Write-Success "Im App-Verzeichnis: $currentDir"

# 2. Docker Services stoppen
Write-Step "Docker Services stoppen..."

# Supabase Services stoppen
if (Test-Path "docker-compose.supabase.yml") {
    Write-Step "Supabase Services stoppen..."
    docker-compose -f docker-compose.supabase.yml down
    Write-Success "Supabase Services gestoppt"
}

# Frontend Services stoppen
if (Test-Path "docker-compose.frontend.yml") {
    Write-Step "Frontend Services stoppen..."
    docker-compose -f docker-compose.frontend.yml down
    Write-Success "Frontend Services gestoppt"
}

# 3. Alle laufenden Container stoppen
Write-Step "Alle laufenden Container stoppen..."
$containers = docker ps -q
if ($containers) {
    docker stop $containers
    Write-Success "Alle Container gestoppt"
} else {
    Write-Info "Keine laufenden Container gefunden"
}

# 4. Docker System bereinigen
Write-Step "Docker System bereinigen..."
docker system prune -f
Write-Success "Docker System bereinigt"

# 5. Docker Services neu starten
Write-Step "Docker Services neu starten..."

# Supabase Services starten
if (Test-Path "docker-compose.supabase.yml") {
    Write-Step "Supabase Services starten..."
    docker-compose -f docker-compose.supabase.yml up -d --build
    Write-Success "Supabase Services gestartet"
}

# Frontend Services starten (falls separat)
if (Test-Path "docker-compose.frontend.yml") {
    Write-Step "Frontend Services starten..."
    docker-compose -f docker-compose.frontend.yml up -d --build
    Write-Success "Frontend Services gestartet"
}

# 6. Warten bis Services laufen
Write-Step "Warten bis Services gestartet sind..."
Start-Sleep -Seconds 30

# 7. Services Status prüfen
Write-Step "Services Status prüfen..."
Write-Host ""
Write-Host "=== DOCKER SERVICES STATUS ===" -ForegroundColor Yellow
if (Test-Path "docker-compose.supabase.yml") {
    docker-compose -f docker-compose.supabase.yml ps
}

Write-Host ""
Write-Host "=== PORT STATUS ===" -ForegroundColor Yellow
netstat -an | Select-String -Pattern ":(80|443|3000|3001|9090|9100)"

# 8. Health Checks
Write-Step "Health Checks durchführen..."

# Frontend Test
Write-Step "Frontend Test (Port 3000)..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Success "Frontend läuft auf Port 3000"
    } else {
        Write-Error "Frontend NICHT erreichbar auf Port 3000 (Status: $($response.StatusCode))"
    }
} catch {
    Write-Error "Frontend NICHT erreichbar auf Port 3000"
}

# Grafana Test
Write-Step "Grafana Test (Port 3001)..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Success "Grafana läuft auf Port 3001"
    } else {
        Write-Error "Grafana NICHT erreichbar auf Port 3001 (Status: $($response.StatusCode))"
    }
} catch {
    Write-Error "Grafana NICHT erreichbar auf Port 3001"
}

# Prometheus Test
Write-Step "Prometheus Test (Port 9090)..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:9090" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Success "Prometheus läuft auf Port 9090"
    } else {
        Write-Error "Prometheus NICHT erreichbar auf Port 9090 (Status: $($response.StatusCode))"
    }
} catch {
    Write-Error "Prometheus NICHT erreichbar auf Port 9090"
}

# Node Exporter Test
Write-Step "Node Exporter Test (Port 9100)..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:9100" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Success "Node Exporter läuft auf Port 9100"
    } else {
        Write-Error "Node Exporter NICHT erreichbar auf Port 9100 (Status: $($response.StatusCode))"
    }
} catch {
    Write-Error "Node Exporter NICHT erreichbar auf Port 9100"
}

# HTTP Test
Write-Step "HTTP Test (Port 80)..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:80" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Success "HTTP läuft auf Port 80"
    } else {
        Write-Error "HTTP NICHT erreichbar auf Port 80 (Status: $($response.StatusCode))"
    }
} catch {
    Write-Error "HTTP NICHT erreichbar auf Port 80"
}

# HTTPS Test
Write-Step "HTTPS Test (Port 443)..."
try {
    $response = Invoke-WebRequest -Uri "https://localhost:443" -TimeoutSec 10 -UseBasicParsing -SkipCertificateCheck
    if ($response.StatusCode -eq 200) {
        Write-Success "HTTPS läuft auf Port 443"
    } else {
        Write-Error "HTTPS NICHT erreichbar auf Port 443 (Status: $($response.StatusCode))"
    }
} catch {
    Write-Error "HTTPS NICHT erreichbar auf Port 443"
}

# 9. Domain Test (falls konfiguriert)
$domain = "www.the-connection-key.de"
Write-Step "Domain Test: $domain"
try {
    $response = Invoke-WebRequest -Uri "https://$domain" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Success "Domain ist erreichbar: https://$domain"
    } else {
        Write-Error "Domain NICHT erreichbar: $domain (Status: $($response.StatusCode))"
    }
} catch {
    Write-Error "Domain NICHT erreichbar: $domain"
}

# 10. Finale Status-Ausgabe
Write-Host ""
Write-Success "🎉 Alle Server wurden neu gestartet!"
Write-Host ""
Write-Info "📋 Zugriff auf Ihre Services:"
Write-Info "  • Frontend: http://138.199.237.34:3000"
Write-Info "  • Grafana: http://138.199.237.34:3001"
Write-Info "  • Prometheus: http://138.199.237.34:9090"
Write-Info "  • Node Exporter: http://138.199.237.34:9100"
Write-Info "  • Domain: https://$domain"
Write-Host ""
Write-Info "🔧 Nützliche Befehle:"
Write-Info "  • Services Status: docker-compose -f docker-compose.supabase.yml ps"
Write-Info "  • Logs anzeigen: docker-compose -f docker-compose.supabase.yml logs -f"
Write-Info "  • Server-Diagnose: ./deploy/hetzner/check-server-errors.sh"
Write-Info "  • Auto-Recovery: ./deploy/hetzner/auto-recovery.sh"
Write-Host ""

# 11. Logs anzeigen (letzte 10 Zeilen)
Write-Step "Letzte Docker Logs:"
if (Test-Path "docker-compose.supabase.yml") {
    docker-compose -f docker-compose.supabase.yml logs --tail=10
}

Write-Success "Reboot aller Server abgeschlossen!"
