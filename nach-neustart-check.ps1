# Nach Hetzner-Neustart Check
Write-Host "`n🔄 NACH-NEUSTART CHECK" -ForegroundColor Cyan
Write-Host "=====================`n" -ForegroundColor Cyan

$HETZNER_IP = "138.199.237.34"

# Warte bis Server erreichbar ist
Write-Host "⏳ Warte auf Server..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$serverUp = $false

while ($attempt -lt $maxAttempts -and -not $serverUp) {
    $attempt++
    Write-Host "Versuch $attempt/$maxAttempts..." -NoNewline
    
    $pingResult = Test-Connection -ComputerName $HETZNER_IP -Count 1 -Quiet
    if ($pingResult) {
        Write-Host " ✅ Server antwortet!" -ForegroundColor Green
        $serverUp = $true
    } else {
        Write-Host " ⏳ Noch nicht erreichbar" -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
}

if (-not $serverUp) {
    Write-Host "`n❌ Server antwortet nicht nach $maxAttempts Versuchen!" -ForegroundColor Red
    exit 1
}

# Warte weitere 30 Sekunden für Service-Start
Write-Host "`n⏳ Warte 30 Sekunden für Service-Start..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

# Prüfe Services
Write-Host "`n📊 SERVICE STATUS:`n" -ForegroundColor Cyan

# Port Tests
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
        $result = $tcpClient.ConnectAsync($HETZNER_IP, $port).Wait(3000)
        $tcpClient.Close()
        
        if ($result) {
            Write-Host "✅ $portName ist offen" -ForegroundColor Green
        } else {
            Write-Host "❌ $portName ist geschlossen" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ $portName nicht erreichbar" -ForegroundColor Yellow
    }
}

# HTTP Tests
Write-Host "`n🌐 HTTP TESTS:`n" -ForegroundColor Cyan

Write-Host "Testing Frontend (Port 3000)..."
try {
    $response = Invoke-WebRequest -Uri "http://$HETZNER_IP:3000" -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Frontend läuft! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend nicht erreichbar" -ForegroundColor Red
}

Write-Host "Testing Grafana (Port 3001)..."
try {
    $response = Invoke-WebRequest -Uri "http://$HETZNER_IP:3001" -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Grafana läuft! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Grafana nicht erreichbar" -ForegroundColor Red
}

Write-Host "`n📝 NÄCHSTE SCHRITTE:`n" -ForegroundColor Cyan
Write-Host "Falls Services nicht laufen:"
Write-Host "  ssh root@$HETZNER_IP"
Write-Host "  cd /opt/hd-app/HD_App_chart"
Write-Host "  docker-compose -f docker-compose.supabase.yml up -d"
Write-Host "  docker ps"
Write-Host ""

