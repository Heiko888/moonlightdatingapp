# Hetzner Server Check
Write-Host "Hetzner Server Check" -ForegroundColor Blue
Write-Host "===================" -ForegroundColor Blue

$HETZNER_IP = "138.199.237.34"
$DOMAIN = "www.the-connection-key.de"

# Ping Test
Write-Host "Ping Test zu $HETZNER_IP..."
$pingResult = Test-Connection -ComputerName $HETZNER_IP -Count 4 -Quiet
if ($pingResult) {
    Write-Host "Server ist erreichbar" -ForegroundColor Green
} else {
    Write-Host "Server ist NICHT erreichbar" -ForegroundColor Red
}

# Port Tests
Write-Host "Port Tests:"
$ports = @(22, 80, 443, 3000, 3001, 9090)
foreach ($port in $ports) {
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $result = $tcpClient.ConnectAsync($HETZNER_IP, $port).Wait(3000)
        $tcpClient.Close()
        if ($result) {
            Write-Host "Port $port ist offen" -ForegroundColor Green
        } else {
            Write-Host "Port $port ist geschlossen" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Port $port ist nicht erreichbar" -ForegroundColor Yellow
    }
}

# HTTP Tests
Write-Host "HTTP Tests:"
try {
    $response = Invoke-WebRequest -Uri "http://$HETZNER_IP:3000" -TimeoutSec 10 -UseBasicParsing
    Write-Host "Frontend (Port 3000): Status $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Frontend (Port 3000): Nicht erreichbar" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "http://$HETZNER_IP:3001" -TimeoutSec 10 -UseBasicParsing
    Write-Host "Grafana (Port 3001): Status $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Grafana (Port 3001): Nicht erreichbar" -ForegroundColor Red
}

# Domain Test
Write-Host "Domain Test: $DOMAIN"
try {
    $response = Invoke-WebRequest -Uri "https://$DOMAIN" -TimeoutSec 10 -UseBasicParsing
    Write-Host "Domain: Status $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Domain: Nicht erreichbar" -ForegroundColor Red
}

Write-Host "Check completed."
