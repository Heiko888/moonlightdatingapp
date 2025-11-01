# Fix Hetzner Nginx SSL/Configuration

$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "=== Fixing Hetzner Nginx Configuration ===" -ForegroundColor Green

Write-Host "`n1. Checking SSL Certificates..." -ForegroundColor Yellow
ssh $server "test -f /etc/letsencrypt/live/www.the-connection-key.de/fullchain.pem && echo 'Certificates exist' || echo 'Certificates MISSING'"

Write-Host "`n2. Checking Nginx Container Status..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml ps nginx"

Write-Host "`n3. Testing Nginx Configuration..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml exec nginx nginx -t 2>&1 || echo 'Cannot test config'"

Write-Host "`n4. Restarting Nginx Container..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml restart nginx"

Write-Host "`n5. Checking Container Logs (last 20 lines)..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml logs --tail=20 nginx 2>&1"

Write-Host "`n=== Fix Completed ===" -ForegroundColor Green
Write-Host "Test the domain: http://www.the-connection-key.de" -ForegroundColor Cyan

