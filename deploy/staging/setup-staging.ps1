# ===========================================
# STAGING ENVIRONMENT SETUP (Port 3001)
# ===========================================

Write-Host "🔧 Staging Environment Setup (Port 3001)" -ForegroundColor Blue
Write-Host "=========================================" -ForegroundColor Blue
Write-Host ""

# 1. Frontend für Staging konfigurieren
Write-Host "1. Frontend für Staging konfigurieren..." -ForegroundColor Cyan
Write-Host "   cd frontend"
Write-Host "   npm run build"
Write-Host "   npm start -- -p 3001"
Write-Host ""

# 2. Grafana für Monitoring
Write-Host "2. Grafana für Monitoring starten..." -ForegroundColor Cyan
Write-Host "   docker-compose -f docker-compose.supabase.yml up -d grafana"
Write-Host ""

# 3. Staging-spezifische Umgebung
Write-Host "3. Staging-spezifische Umgebung..." -ForegroundColor Cyan
Write-Host "   cp env.supabase .env.staging"
Write-Host "   # Bearbeiten Sie .env.staging für Staging-Konfiguration"
Write-Host ""

Write-Host "📋 Nach dem Setup:" -ForegroundColor Green
Write-Host "   • Staging App: http://localhost:3001" -ForegroundColor White
Write-Host "   • Grafana: http://localhost:3001/grafana" -ForegroundColor White
Write-Host "   • Monitoring: http://localhost:3001/prometheus" -ForegroundColor White
Write-Host ""

Write-Host "✅ Staging Environment bereit!" -ForegroundColor Green
