# Check Hetzner Container Logs
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "=== Checking Container Status ===" -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml ps"

Write-Host "`n=== Nginx Container Logs (last 200 lines) ===" -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml logs --tail=200 nginx 2>&1"

Write-Host "`n=== Frontend Container Logs (last 200 lines) ===" -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml logs --tail=200 frontend 2>&1"

Write-Host "`n=== Checking Nginx Config Test ===" -ForegroundColor Yellow
ssh $server "cd $path && docker exec hd-app-nginx-1 nginx -t 2>&1 || docker exec hd_app_chart-nginx-1 nginx -t 2>&1 || echo 'Nginx container not found'"

Write-Host "`n=== Checking SSL Certificates ===" -ForegroundColor Yellow
ssh $server "ls -la /etc/letsencrypt/live/www.the-connection-key.de/ 2>&1 || echo 'Certificates not found'"

