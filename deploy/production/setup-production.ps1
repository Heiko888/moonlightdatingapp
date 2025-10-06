# ===========================================
# PRODUCTION ENVIRONMENT SETUP (Port 3000)
# ===========================================

$ServerIP = "138.199.237.34"
$Username = "root"
$ServerPath = "/opt/hd-app/HD_App_chart"

Write-Host "Production Environment Setup (Port 3000)" -ForegroundColor Blue
Write-Host "===========================================" -ForegroundColor Blue
Write-Host ""

# 1. Server-Verbindung testen
Write-Host "1. Server-Verbindung testen..." -ForegroundColor Cyan
Write-Host "   Test-NetConnection -ComputerName $ServerIP -Port 22"
Write-Host ""

# 2. Production-Deployment
Write-Host "2. Production-Deployment..." -ForegroundColor Cyan
Write-Host "   ssh $Username@$ServerIP 'cd $ServerPath && docker-compose -f docker-compose.supabase.yml down'"
Write-Host "   ssh $Username@$ServerIP 'cd $ServerPath && docker-compose -f docker-compose.supabase.yml build --no-cache'"
Write-Host "   ssh $Username@$ServerIP 'cd $ServerPath && docker-compose -f docker-compose.supabase.yml up -d'"
Write-Host ""

# 3. Health Check
Write-Host "3. Health Check..." -ForegroundColor Cyan
Write-Host "   Test-NetConnection -ComputerName $ServerIP -Port 3000"
Write-Host "   Test-NetConnection -ComputerName $ServerIP -Port 3001"
Write-Host ""

Write-Host "Nach dem Deployment:" -ForegroundColor Green
Write-Host "   • Production App: http://$ServerIP:3000" -ForegroundColor White
Write-Host "   • Grafana: http://$ServerIP:3001" -ForegroundColor White
Write-Host "   • Prometheus: http://$ServerIP:9090" -ForegroundColor White
Write-Host ""

Write-Host "WICHTIG: Production-Deployment nur nach ausführlichen Tests!" -ForegroundColor Yellow