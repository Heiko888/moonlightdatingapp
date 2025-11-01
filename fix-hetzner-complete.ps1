# Complete Hetzner Fix - Restart everything and fix network
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "=== Complete Hetzner Fix ===" -ForegroundColor Green

Write-Host "`n1. Stopping all containers..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml down"

Write-Host "`n2. Pruning unused networks..." -ForegroundColor Yellow
ssh $server "docker network prune -f"

Write-Host "`n3. Checking Docker system..." -ForegroundColor Yellow
ssh $server "docker system df"

Write-Host "`n4. Restarting Docker daemon (if needed)..." -ForegroundColor Yellow
ssh $server "systemctl status docker --no-pager | head -3"

Write-Host "`n5. Pulling latest images..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml pull"

Write-Host "`n6. Building frontend (no-cache)..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml build --no-cache frontend"

Write-Host "`n7. Starting all containers..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml up -d"

Write-Host "`n8. Waiting 15 seconds for containers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "`n9. Checking container status..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml ps"

Write-Host "`n10. Testing Docker network connectivity..." -ForegroundColor Yellow
ssh $server @"
cd $path
NGINX_CONTAINER=`$(docker ps --filter 'name=nginx' --format '{{.Names}}' | head -1)
if [ -n \"`$NGINX_CONTAINER\" ]; then
    echo \"Testing frontend connectivity from nginx container...\"
    docker exec `$NGINX_CONTAINER ping -c 2 frontend 2>&1 | head -3
    echo \"Testing HTTP connection to frontend...\"
    docker exec `$NGINX_CONTAINER wget -q -O- --timeout=5 http://frontend:3000/health 2>&1 || echo 'HTTP test failed'
fi
"@

Write-Host "`n11. Checking frontend health..." -ForegroundColor Yellow
ssh $server "curl -I http://localhost:3000 2>&1 | head -3"

Write-Host "`n12. Testing Nginx configuration..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml exec -T nginx nginx -t 2>&1"

Write-Host "`n13. Restarting Nginx one more time..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml restart nginx"

Write-Host "`n14. Final container status..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml ps"

Write-Host "`n=== Complete Fix Finished ===" -ForegroundColor Green
Write-Host "Test the domain: http://www.the-connection-key.de" -ForegroundColor Cyan
Write-Host "`nIf still not working, check logs manually:" -ForegroundColor Yellow
Write-Host "  ssh root@138.199.237.34 'cd /opt/hd-app/HD_App_chart && docker compose -f docker-compose.supabase.yml logs nginx | tail -50'" -ForegroundColor Gray

