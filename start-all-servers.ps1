#!/usr/bin/env pwsh

# HD App - Alle Server Start Skript
# PowerShell Version

Write-Host "🚀 HD App - Alle Server werden gestartet..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan

# Funktion zum Überprüfen, ob Docker läuft
function Test-DockerRunning {
    try {
        docker version | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Funktion zum Überprüfen, ob ein Port verfügbar ist
function Test-PortAvailable {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $false
    }
    catch {
        return $true
    }
}

# Funktion zum Warten auf einen Service
function Wait-ForService {
    param([string]$ServiceName, [int]$Port, [int]$TimeoutSeconds = 60)
    
    Write-Host "⏳ Warte auf $ServiceName (Port $Port)..." -ForegroundColor Yellow
    $startTime = Get-Date
    $timeout = $startTime.AddSeconds($TimeoutSeconds)
    
    while ((Get-Date) -lt $timeout) {
        if (Test-PortAvailable -Port $Port) {
            Start-Sleep -Seconds 2
        } else {
            Write-Host "✅ $ServiceName ist bereit!" -ForegroundColor Green
            return $true
        }
    }
    
    Write-Host "❌ Timeout: $ServiceName ist nicht verfügbar" -ForegroundColor Red
    return $false
}

# Funktion zum Erstellen von .env Dateien
function Create-EnvFile {
    param([string]$TemplatePath, [string]$EnvPath)
    
    if (-not (Test-Path $EnvPath)) {
        Write-Host "📝 Erstelle $EnvPath aus Template..." -ForegroundColor Yellow
        if (Test-Path $TemplatePath) {
            Copy-Item $TemplatePath $EnvPath
            Write-Host "✅ $EnvPath erstellt" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Template $TemplatePath nicht gefunden" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✅ $EnvPath bereits vorhanden" -ForegroundColor Green
    }
}

# Prüfe und erstelle .env Dateien
Write-Host "🔧 Prüfe Konfigurationsdateien..." -ForegroundColor Cyan
Create-EnvFile -TemplatePath "backend/env-template.txt" -EnvPath "backend/.env"
Create-EnvFile -TemplatePath "frontend/env-template.txt" -EnvPath "frontend/.env"

# Prüfe Docker
if (-not (Test-DockerRunning)) {
    Write-Host "❌ Docker ist nicht gestartet. Bitte starten Sie Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker ist verfügbar" -ForegroundColor Green

# Stoppe bestehende Container
Write-Host "🛑 Stoppe bestehende Container..." -ForegroundColor Yellow
docker-compose down 2>$null
docker-compose -f docker-compose-monitoring.yml down 2>$null

# Starte Monitoring Stack
Write-Host "📊 Starte Monitoring Stack..." -ForegroundColor Cyan
docker-compose -f docker-compose-monitoring.yml up -d

# Warte auf Monitoring Services
Start-Sleep -Seconds 5

# Starte Hauptanwendung
Write-Host "🏗️  Starte HD App Stack..." -ForegroundColor Cyan
docker-compose up -d

# Warte auf Services
Write-Host "⏳ Warte auf Services..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Überprüfe Services
$services = @(
    @{Name="MongoDB"; Port=27017},
    @{Name="Backend"; Port=4001},
    @{Name="Frontend"; Port=3000},
    @{Name="Prometheus"; Port=9090},
    @{Name="Grafana"; Port=3001},
    @{Name="Alertmanager"; Port=9093},
    @{Name="Node Exporter"; Port=9100}
)

$allServicesReady = $true

foreach ($service in $services) {
    if (-not (Wait-ForService -ServiceName $service.Name -Port $service.Port -TimeoutSeconds 30)) {
        $allServicesReady = $false
    }
}

# Zeige Status
Write-Host ""
Write-Host "📋 Service Status:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

docker-compose ps
docker-compose -f docker-compose-monitoring.yml ps

Write-Host ""
Write-Host "🌐 Verfügbare URLs:" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "Frontend:     http://localhost:3000" -ForegroundColor White
Write-Host "Backend API:  http://localhost:4001" -ForegroundColor White
Write-Host "Grafana:      http://localhost:3001 (admin/admin)" -ForegroundColor White
Write-Host "Prometheus:   http://localhost:9090" -ForegroundColor White
Write-Host "Alertmanager: http://localhost:9093" -ForegroundColor White

if ($allServicesReady) {
    Write-Host ""
    Write-Host "🎉 Alle Server sind erfolgreich gestartet!" -ForegroundColor Green
    Write-Host "Öffnen Sie http://localhost:3000 in Ihrem Browser." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "⚠️  Einige Services konnten nicht gestartet werden." -ForegroundColor Yellow
    Write-Host "Überprüfen Sie die Docker-Logs mit: docker-compose logs" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 Nützliche Befehle:" -ForegroundColor Magenta
Write-Host "=====================" -ForegroundColor Magenta
Write-Host "Logs anzeigen:     docker-compose logs -f" -ForegroundColor White
Write-Host "Services stoppen:  docker-compose down" -ForegroundColor White
Write-Host "Monitoring stoppen: docker-compose -f docker-compose-monitoring.yml down" -ForegroundColor White
