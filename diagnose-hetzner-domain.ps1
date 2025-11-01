# Comprehensive Hetzner Domain Diagnosis
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"
$domain = "www.the-connection-key.de"

Write-Host "=== Comprehensive Domain Diagnosis ===" -ForegroundColor Green

# 1. Container Status
Write-Host "`n1. Container Status:" -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml ps 2>&1"

# 2. Nginx Container Name
Write-Host "`n2. Finding Nginx Container:" -ForegroundColor Yellow
$nginxContainer = ssh $server "cd $path && docker compose -f docker-compose.supabase.yml ps --format json nginx 2>&1 | ConvertFrom-Json | Select-Object -First 1 | ForEach-Object { `$_.Name }"
if (-not $nginxContainer) {
    $nginxContainer = ssh $server "docker ps --filter 'name=nginx' --format '{{.Names}}' 2>&1 | Select-Object -First 1"
}
Write-Host "Nginx Container: $nginxContainer"

# 3. Test Nginx Config
Write-Host "`n3. Testing Nginx Configuration:" -ForegroundColor Yellow
ssh $server "docker exec $nginxContainer nginx -t 2>&1"

# 4. Check if frontend is reachable from nginx
Write-Host "`n4. Testing Frontend Connectivity:" -ForegroundColor Yellow
ssh $server "docker exec $nginxContainer ping -c 2 frontend 2>&1 || docker exec $nginxContainer wget -O- http://frontend:3000/health 2>&1 | head -5"

# 5. Check Nginx Error Log
Write-Host "`n5. Last 30 lines of Nginx Error Log:" -ForegroundColor Yellow
ssh $server "docker exec $nginxContainer tail -30 /var/log/nginx/error.log 2>&1"

# 6. Check Nginx Access Log
Write-Host "`n6. Last 10 lines of Nginx Access Log:" -ForegroundColor Yellow
ssh $server "docker exec $nginxContainer tail -10 /var/log/nginx/access.log 2>&1"

# 7. Test direct connection to frontend
Write-Host "`n7. Direct Frontend Test:" -ForegroundColor Yellow
ssh $server "curl -I http://localhost:3000 2>&1 | head -5"

# 8. Test nginx from inside container
Write-Host "`n8. Nginx Internal Test:" -ForegroundColor Yellow
ssh $server "docker exec $nginxContainer curl -I http://localhost:80 2>&1 | head -5"

Write-Host "`n=== Diagnosis Complete ===" -ForegroundColor Green

