# 🚀 HD App - Supabase Production Deployment Script (PowerShell)
# Vollständiges Deployment für Production-Umgebung mit Supabase

param(
    [switch]$SkipDockerInstall,
    [switch]$SkipNginx,
    [string]$Domain = ""
)

# Fehlerbehandlung
$ErrorActionPreference = "Stop"

Write-Host "🚀 HD App - Supabase Production Deployment wird gestartet..." -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue

# Funktionen
function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Step {
    param([string]$Message)
    Write-Host "🔧 $Message" -ForegroundColor Magenta
}

# Schritt 1: Prüfe ob env.supabase existiert
if (-not (Test-Path "env.supabase")) {
    Write-Error "env.supabase Datei nicht gefunden!"
    Write-Info "Bitte erstellen Sie eine env.supabase Datei basierend auf env.supabase.template"
    exit 1
}

# Schritt 2: System-Informationen
Write-Step "System-Informationen werden angezeigt..."
Write-Host "OS: $([System.Environment]::OSVersion.VersionString)" -ForegroundColor White
Write-Host "PowerShell Version: $($PSVersionTable.PSVersion)" -ForegroundColor White
Write-Host "Architektur: $([System.Environment]::GetEnvironmentVariable('PROCESSOR_ARCHITECTURE'))" -ForegroundColor White
Write-Host ""

# Schritt 3: Dependencies prüfen
Write-Step "Dependencies werden geprüft..."

# Docker prüfen
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Success "Docker bereits installiert: $dockerVersion"
    } else {
        throw "Docker nicht gefunden"
    }
} catch {
    if (-not $SkipDockerInstall) {
        Write-Info "Docker wird installiert..."
        Write-Warning "Bitte installieren Sie Docker Desktop für Windows manuell:"
        Write-Host "https://docs.docker.com/desktop/windows/install/" -ForegroundColor Blue
        Write-Host "Nach der Installation starten Sie dieses Skript erneut." -ForegroundColor Yellow
        exit 1
    }
}

# Docker Compose prüfen
try {
    $composeVersion = docker-compose --version 2>$null
    if ($composeVersion) {
        Write-Success "Docker Compose bereits installiert: $composeVersion"
    } else {
        throw "Docker Compose nicht gefunden"
    }
} catch {
    Write-Error "Docker Compose nicht gefunden. Bitte installieren Sie es."
    exit 1
}

# Schritt 4: Environment-Datei kopieren
Write-Step "Environment-Datei wird konfiguriert..."
if (Test-Path "env.supabase") {
    Copy-Item "env.supabase" ".env"
    Write-Success "Environment-Datei konfiguriert"
} else {
    Write-Error "env.supabase Datei nicht gefunden!"
    exit 1
}

# Schritt 5: Docker Images bauen
Write-Step "Docker Images werden gebaut..."
try {
    docker-compose -f docker-compose.supabase.yml build --no-cache --parallel
    Write-Success "Docker Images gebaut"
} catch {
    Write-Error "Fehler beim Bauen der Docker Images: $_"
    exit 1
}

# Schritt 6: Alte Container stoppen
Write-Step "Alte Container werden gestoppt..."
try {
    docker-compose -f docker-compose.supabase.yml down --remove-orphans
    Write-Success "Alte Container gestoppt"
} catch {
    Write-Warning "Fehler beim Stoppen der Container: $_"
}

# Schritt 7: Services starten
Write-Step "Services werden gestartet..."
try {
    docker-compose -f docker-compose.supabase.yml up -d
    Write-Success "Services gestartet"
} catch {
    Write-Error "Fehler beim Starten der Services: $_"
    exit 1
}

# Schritt 8: Warten auf Services
Write-Step "Warten auf Services..."
Start-Sleep -Seconds 60

# Schritt 9: Health Check
Write-Step "Health Check wird durchgeführt..."

$services = @(
    @{Name="hd-backend"; Port=4001},
    @{Name="hd-frontend"; Port=3000},
    @{Name="grafana"; Port=3001},
    @{Name="prometheus"; Port=9090},
    @{Name="node-exporter"; Port=9100}
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "$($service.Name) ist erreichbar (Port $($service.Port))"
        } else {
            Write-Warning "$($service.Name) antwortet mit Status Code $($response.StatusCode)"
        }
    } catch {
        Write-Warning "$($service.Name) ist nicht erreichbar (Port $($service.Port)) - prüfen Sie die Logs"
    }
}

# Schritt 10: Status anzeigen
Write-Step "Deployment Status:"
Write-Host "===================" -ForegroundColor White
try {
    docker-compose -f docker-compose.supabase.yml ps
} catch {
    Write-Warning "Fehler beim Anzeigen des Status: $_"
}

# Schritt 11: Nginx-Konfiguration (optional)
if (-not $SkipNginx) {
    $nginxChoice = Read-Host "Möchten Sie Nginx als Reverse Proxy konfigurieren? (y/n)"
    if ($nginxChoice -eq "y" -or $nginxChoice -eq "Y") {
        Write-Step "Nginx-Konfiguration wird erstellt..."
        
        $nginxConfig = @"
server {
    listen 80;
    server_name $Domain;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
        proxy_cache_bypass `$http_upgrade;
    }
    
    # API Routes
    location /api {
        proxy_pass http://localhost:4001;
        proxy_http_version 1.1;
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
    }
    
    # Grafana
    location /grafana {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
    }
    
    # Prometheus
    location /prometheus {
        proxy_pass http://localhost:9090;
        proxy_http_version 1.1;
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
    }
}
"@
        
        $nginxConfig | Out-File -FilePath "nginx-hd-app-supabase.conf" -Encoding UTF8
        Write-Success "Nginx-Konfiguration erstellt: nginx-hd-app-supabase.conf"
        Write-Info "Kopieren Sie diese Datei nach /etc/nginx/sites-available/ auf Ihrem Linux-Server"
    }
}

# Schritt 12: Abschluss
Write-Host ""
Write-Success "🎉 HD App Supabase Production Deployment abgeschlossen!"
Write-Host ""
Write-Host "🌐 Verfügbare URLs:" -ForegroundColor White
Write-Host "===================" -ForegroundColor White
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPAddress
Write-Host "Frontend:  http://$localIP:3000" -ForegroundColor Green
Write-Host "Backend:   http://$localIP:4001" -ForegroundColor Green
Write-Host "Grafana:   http://$localIP:3001" -ForegroundColor Green
Write-Host "Prometheus: http://$localIP:9090" -ForegroundColor Green
Write-Host "Node Exporter: http://$localIP:9100" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Nützliche Befehle:" -ForegroundColor White
Write-Host "=====================" -ForegroundColor White
Write-Host "Logs anzeigen:    docker-compose -f docker-compose.supabase.yml logs -f" -ForegroundColor Yellow
Write-Host "Services stoppen: docker-compose -f docker-compose.supabase.yml down" -ForegroundColor Yellow
Write-Host "Services starten: docker-compose -f docker-compose.supabase.yml up -d" -ForegroundColor Yellow
Write-Host "Status prüfen:    docker-compose -f docker-compose.supabase.yml ps" -ForegroundColor Yellow
Write-Host "Container updaten: docker-compose -f docker-compose.supabase.yml pull; docker-compose -f docker-compose.supabase.yml up -d" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔧 Nächste Schritte:" -ForegroundColor White
Write-Host "====================" -ForegroundColor White
Write-Host "1. SSL-Zertifikat einrichten (falls Domain vorhanden)" -ForegroundColor Cyan
Write-Host "2. Domain konfigurieren" -ForegroundColor Cyan
Write-Host "3. Supabase-Konfiguration überprüfen" -ForegroundColor Cyan
Write-Host "4. Monitoring-Dashboards konfigurieren" -ForegroundColor Cyan
Write-Host "5. Logs überwachen" -ForegroundColor Cyan
Write-Host ""
Write-Success "Der Server ist bereit für die HD App mit Supabase!"
