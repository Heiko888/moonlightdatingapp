# ==========================================
# TRIVY SECURITY SCAN - HETZNER SERVER
# ==========================================

Write-Host "`n🔒 TRIVY SECURITY SCAN FÜR HETZNER" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

# Server-Adresse
$server = Read-Host "Hetzner Server IP oder Domain"

if ([string]::IsNullOrWhiteSpace($server)) {
    Write-Host "❌ Keine Server-Adresse angegeben!" -ForegroundColor Red
    exit 1
}

Write-Host "`n📡 Verbinde zu Server: $server" -ForegroundColor Yellow

# SSH Befehl für Trivy Scan
$sshCommand = @"
# Trivy auf Hetzner Server installieren (falls nicht vorhanden)
if ! command -v trivy &> /dev/null; then
    echo "📦 Installiere Trivy..."
    wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
    echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
    sudo apt-get update
    sudo apt-get install -y trivy
fi

echo ""
echo "🔍 Starte Trivy Scan..."
echo "========================================"
echo ""

# Liste alle laufenden Container
echo "📋 Laufende Container:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
echo ""

# Scanne jeden Container
echo "🔒 Scanne Container auf Schwachstellen..."
echo ""

# Frontend Container
if docker ps | grep -q "hd-app-frontend"; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔍 FRONTEND CONTAINER SCAN"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    trivy image --severity HIGH,CRITICAL \$(docker ps --filter "name=frontend" --format "{{.Image}}")
    echo ""
fi

# Nginx Container
if docker ps | grep -q "nginx"; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔍 NGINX CONTAINER SCAN"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    trivy image --severity HIGH,CRITICAL nginx:alpine
    echo ""
fi

# Grafana Container
if docker ps | grep -q "grafana"; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔍 GRAFANA CONTAINER SCAN"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    trivy image --severity HIGH,CRITICAL grafana/grafana:latest
    echo ""
fi

# Prometheus Container
if docker ps | grep -q "prometheus"; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔍 PROMETHEUS CONTAINER SCAN"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    trivy image --severity HIGH,CRITICAL prom/prometheus:latest
    echo ""
fi

# Redis Container
if docker ps | grep -q "redis"; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔍 REDIS CONTAINER SCAN"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    trivy image --severity HIGH,CRITICAL redis:alpine
    echo ""
fi

echo ""
echo "✅ Scan abgeschlossen!"
echo "========================================"
"@

Write-Host "`nFühre Trivy Scan auf Server aus...`n" -ForegroundColor Yellow

# SSH ausführen
ssh root@$server $sshCommand

Write-Host "`n✅ SCAN ABGESCHLOSSEN" -ForegroundColor Green
Write-Host "=========================================`n" -ForegroundColor Green

Write-Host "📊 Interpretation der Ergebnisse:" -ForegroundColor Cyan
Write-Host "  • HIGH     = Hohe Schwachstelle (sollte behoben werden)" -ForegroundColor Yellow
Write-Host "  • CRITICAL = Kritische Schwachstelle (MUSS behoben werden)" -ForegroundColor Red
Write-Host ""
Write-Host "💡 Empfohlene Aktionen:" -ForegroundColor Cyan
Write-Host "  1. Container-Images aktualisieren" -ForegroundColor White
Write-Host "  2. Dependencies updaten (npm update)" -ForegroundColor White
Write-Host "  3. Security-Patches anwenden" -ForegroundColor White
Write-Host ""

