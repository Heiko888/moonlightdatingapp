# Hetzner-Server Reparatur nach Bad Gateway Fix
# Stellt die ursprüngliche Production-Konfiguration wieder her

$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HETZNER SERVER REPARATUR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Git Pull (aktuelle Konfiguration)..." -ForegroundColor Yellow
ssh $server "cd $path && git pull origin main"

Write-Host ""
Write-Host "2. Docker Container stoppen..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml down"

Write-Host ""
Write-Host "3. Nginx-Konfiguration prüfen..." -ForegroundColor Yellow
ssh $server "cd $path && ls -la nginx/nginx.conf"

Write-Host ""
Write-Host "4. SSL-Zertifikate prüfen..." -ForegroundColor Yellow
ssh $server "ls -la /etc/letsencrypt/live/www.the-connection-key.de/ 2>&1 || echo 'SSL-Zertifikate prüfen...'"

Write-Host ""
Write-Host "5. Docker-Compose Konfiguration prüfen..." -ForegroundColor Yellow
ssh $server "cd $path && cat docker-compose.supabase.yml | grep -A5 'nginx:'"

Write-Host ""
Write-Host "6. Container neu starten..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml up -d"

Write-Host ""
Write-Host "7. Warten bis Container gestartet sind..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

Write-Host ""
Write-Host "8. Container Status prüfen..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml ps"

Write-Host ""
Write-Host "9. Nginx Logs prüfen..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml logs --tail=20 nginx"

Write-Host ""
Write-Host "10. Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://www.the-connection-key.de" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ HTTPS funktioniert (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "⚠️  HTTPS Test fehlgeschlagen, prüfe HTTP..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://www.the-connection-key.de" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        Write-Host "✅ HTTP funktioniert (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "❌ Beide Tests fehlgeschlagen" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  REPARATUR ABGESCHLOSSEN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

