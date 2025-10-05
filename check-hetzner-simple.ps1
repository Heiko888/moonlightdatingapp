# 🔍 HD App - Hetzner Server Status Check (Simplified)
Write-Host "🔍 HD App - Hetzner Server Status Check" -ForegroundColor Blue
Write-Host "=========================================" -ForegroundColor Blue
Write-Host ""

# Server Details
$HETZNER_IP = "138.199.237.34"
$DOMAIN = "moonlightdatingapp.werdemeisterdeinergedanken.de"

# 1. Lokale System Checks
Write-Host "=== LOKALE SYSTEM CHECKS ===" -ForegroundColor Cyan
Write-Host "Aktuelles Verzeichnis: $(Get-Location)"
Write-Host "Verfügbarer Speicher: $([math]::Round((Get-WmiObject -Class Win32_LogicalDisk | Where-Object {$_.DeviceID -eq 'C:'}).FreeSpace / 1GB, 2)) GB"
Write-Host ""

# 2. Git Status
Write-Host "=== GIT STATUS ===" -ForegroundColor Cyan
try {
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        Write-Host "Uncommitted changes gefunden:" -ForegroundColor Yellow
        $gitStatus | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
    } else {
        Write-Host "Git Repository ist sauber" -ForegroundColor Green
    }
    
    $gitBranch = git branch --show-current 2>$null
    Write-Host "Aktueller Branch: $gitBranch"
} catch {
    Write-Host "Git nicht verfügbar oder kein Repository" -ForegroundColor Yellow
}
Write-Host ""

# 3. Hetzner Server Connectivity Test
Write-Host "=== HETZNER SERVER CONNECTIVITY ===" -ForegroundColor Cyan

# Ping Test
Write-Host "Ping Test zu $HETZNER_IP..."
$pingResult = Test-Connection -ComputerName $HETZNER_IP -Count 4 -Quiet
if ($pingResult) {
    Write-Host "Server ist erreichbar (Ping OK)" -ForegroundColor Green
} else {
    Write-Host "Server ist NICHT erreichbar (Ping Failed)" -ForegroundColor Red
}
Write-Host ""

# Port Tests
Write-Host "Port Connectivity Tests:"
$ports = @(22, 80, 443, 3000, 3001, 9090)
$portNames = @("SSH", "HTTP", "HTTPS", "Frontend", "Grafana", "Prometheus")

for ($i = 0; $i -lt $ports.Length; $i++) {
    $port = $ports[$i]
    $portName = $portNames[$i]
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.ReceiveTimeout = 3000
        $tcpClient.SendTimeout = 3000
        $result = $tcpClient.ConnectAsync($HETZNER_IP, $port).Wait(3000)
        $tcpClient.Close()
        
        if ($result) {
            Write-Host "$portName (Port $port) ist offen" -ForegroundColor Green
        } else {
            Write-Host "$portName (Port $port) ist geschlossen" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "$portName (Port $port) ist nicht erreichbar" -ForegroundColor Yellow
    }
}
Write-Host ""

# 4. HTTP Service Tests
Write-Host "=== HTTP SERVICE TESTS ===" -ForegroundColor Cyan

# Frontend Test
Write-Host "Frontend Service Test (Port 3000)..."
try {
    $response = Invoke-WebRequest -Uri "http://$HETZNER_IP:3000" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "Frontend läuft auf Port 3000" -ForegroundColor Green
    } else {
        Write-Host "Frontend antwortet mit Status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Frontend nicht erreichbar auf Port 3000" -ForegroundColor Red
}

# Grafana Test
Write-Host "Grafana Service Test (Port 3001)..."
try {
    $response = Invoke-WebRequest -Uri "http://$HETZNER_IP:3001" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "Grafana läuft auf Port 3001" -ForegroundColor Green
    } else {
        Write-Host "Grafana antwortet mit Status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Grafana nicht erreichbar auf Port 3001" -ForegroundColor Red
}

# HTTPS Test
Write-Host "HTTPS Test (Port 443)..."
try {
    $response = Invoke-WebRequest -Uri "https://$HETZNER_IP" -TimeoutSec 10 -UseBasicParsing -SkipCertificateCheck
    if ($response.StatusCode -eq 200) {
        Write-Host "HTTPS läuft auf Port 443" -ForegroundColor Green
    } else {
        Write-Host "HTTPS antwortet mit Status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "HTTPS nicht erreichbar oder SSL-Problem" -ForegroundColor Yellow
}
Write-Host ""

# 5. Domain Test
Write-Host "=== DOMAIN TEST ===" -ForegroundColor Cyan
if ($DOMAIN) {
    Write-Host "Domain Test: $DOMAIN"
    try {
        $response = Invoke-WebRequest -Uri "https://$DOMAIN" -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "Domain ist erreichbar: https://$DOMAIN" -ForegroundColor Green
        } else {
            Write-Host "Domain antwortet mit Status: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Domain nicht erreichbar: $DOMAIN" -ForegroundColor Red
    }
} else {
    Write-Host "Keine Domain konfiguriert" -ForegroundColor Yellow
}
Write-Host ""

# 6. Empfohlene Aktionen
Write-Host "=== EMPFOHLENE AKTIONEN ===" -ForegroundColor Cyan

if (-not $pingResult) {
    Write-Host "KRITISCH: Server ist nicht erreichbar!" -ForegroundColor Red
    Write-Host "1. Prüfen Sie die Server-IP: $HETZNER_IP"
    Write-Host "2. Prüfen Sie die Netzwerkverbindung"
    Write-Host "3. Prüfen Sie die Firewall-Einstellungen"
} else {
    Write-Host "Server ist erreichbar" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Nächste Schritte:"
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
}

Write-Host ""
Write-Host "=== DIAGNOSE ABGESCHLOSSEN ===" -ForegroundColor Cyan
Write-Host "Check the results above and follow the recommended actions."
