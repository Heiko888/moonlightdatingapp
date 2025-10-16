# 🔧 Hetzner Services Reparieren
# Dieses Script verbindet sich zum Hetzner-Server und startet die Services neu

Write-Host "🔧 Hetzner Services Reparatur" -ForegroundColor Blue
Write-Host "==============================" -ForegroundColor Blue
Write-Host ""

$HETZNER_IP = "138.199.237.34"
$SERVER_PATH = "/opt/hd-app/HD_App_chart"

Write-Host "📡 Verbinde zu Hetzner Server..." -ForegroundColor Cyan
Write-Host "IP: $HETZNER_IP"
Write-Host ""

# SSH-Befehle als Array
$commands = @'
echo '🔍 Checking current status...'
cd /opt/hd-app/HD_App_chart || exit 1
echo ''
echo '📊 Current Docker containers:'
docker ps -a
echo ''
echo '🛑 Stopping all services...'
docker-compose -f docker-compose.supabase.yml down
docker-compose -f docker-compose.frontend.yml down 2>/dev/null || true
docker-compose -f docker-compose.yml down 2>/dev/null || true
echo ''
echo '🧹 Cleaning up...'
docker system prune -f
echo ''
echo '📥 Pulling latest changes from Git...'
git fetch origin main
git reset --hard origin/main
echo ''
echo '🔧 Checking environment files...'
if [ ! -f .env.production ]; then
    echo '⚠️ .env.production missing! Creating from template...'
    cp env.production.template .env.production || true
fi
echo ''
echo '🚀 Starting services...'
docker-compose -f docker-compose.supabase.yml up -d
echo ''
echo '⏳ Waiting 30 seconds for services to start...'
sleep 30
echo ''
echo '📊 Service status:'
docker ps
echo ''
echo '📝 Recent logs:'
docker-compose -f docker-compose.supabase.yml logs --tail=50
echo ''
echo '✅ Repair completed!'
echo ''
echo '🔍 Testing services...'
curl -I http://localhost:3000 2>/dev/null | head -1 || echo '❌ Frontend not responding'
curl -I http://localhost:3001 2>/dev/null | head -1 || echo '❌ Grafana not responding'
echo ''
echo '🎯 Next steps:'
echo '1. Check if services are running: docker ps'
echo '2. Check logs: docker-compose -f docker-compose.supabase.yml logs -f'
echo '3. If issues persist, check env file: cat .env.production'
'@

# SSH-Verbindung mit Befehlen
Write-Host "🔌 Führe Reparatur-Befehle aus..." -ForegroundColor Yellow
Write-Host ""

# Führe SSH-Befehl aus
$sshCommand = "ssh -o StrictHostKeyChecking=no root@$HETZNER_IP '$commands'"
try {
    Invoke-Expression $sshCommand
    
    Write-Host ""
    Write-Host "✅ Reparatur abgeschlossen!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔍 Prüfe Services..." -ForegroundColor Cyan
    
    # Warte kurz
    Start-Sleep -Seconds 5
    
    # Teste Services
    Write-Host ""
    Write-Host "Testing Frontend (Port 3000)..."
    try {
        $response = Invoke-WebRequest -Uri "http://${HETZNER_IP}:3000" -TimeoutSec 10 -UseBasicParsing
        Write-Host "✅ Frontend läuft! Status: $($response.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Frontend noch nicht erreichbar" -ForegroundColor Red
    }
    
    Write-Host "Testing Grafana (Port 3001)..."
    try {
        $response = Invoke-WebRequest -Uri "http://${HETZNER_IP}:3001" -TimeoutSec 10 -UseBasicParsing
        Write-Host "✅ Grafana läuft! Status: $($response.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Grafana noch nicht erreichbar" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "📖 Weitere Befehle:" -ForegroundColor Cyan
    Write-Host "  ssh root@$HETZNER_IP"
    Write-Host "  cd $SERVER_PATH"
    Write-Host "  docker ps                    # Status prüfen"
    Write-Host "  docker-compose logs -f       # Logs ansehen"
    Write-Host "  docker-compose restart       # Neustart"
}
catch {
    Write-Host ""
    Write-Host "❌ Fehler bei SSH-Verbindung!" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ""
    Write-Host "💡 Mögliche Lösungen:" -ForegroundColor Yellow
    Write-Host "1. SSH-Key konfiguriert?"
    Write-Host "   ssh-add ~/.ssh/id_rsa"
    Write-Host ""
    Write-Host "2. Manuell verbinden:"
    Write-Host "   ssh root@$HETZNER_IP"
    Write-Host "   cd $SERVER_PATH"
    Write-Host "   docker-compose -f docker-compose.supabase.yml down"
    Write-Host "   docker-compose -f docker-compose.supabase.yml up -d"
}

Write-Host ""
Write-Host "🏁 Script beendet" -ForegroundColor Blue
