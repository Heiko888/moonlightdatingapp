# Complete Nginx Fix for Hetzner
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "=== Complete Nginx Fix ===" -ForegroundColor Green

Write-Host "`n1. Stopping all containers..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml down"

Write-Host "`n2. Checking SSL certificates..." -ForegroundColor Yellow
$certCheck = ssh $server "test -f /etc/letsencrypt/live/www.the-connection-key.de/fullchain.pem && echo 'CERT_OK' || echo 'CERT_MISSING'"

if ($certCheck -match "CERT_MISSING") {
    Write-Host "WARNING: SSL certificates missing! Creating..." -ForegroundColor Red
    ssh $server "certbot certonly --standalone -d www.the-connection-key.de -d the-connection-key.de --non-interactive --agree-tos --email admin@the-connection-key.de"
}

Write-Host "`n3. Verifying certificate mount in docker-compose..." -ForegroundColor Yellow
ssh $server "cd $path && grep -A2 'volumes:' docker-compose.supabase.yml | grep letsencrypt || echo 'Certificate mount not found'"

Write-Host "`n4. Restarting containers..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml up -d"

Write-Host "`n5. Waiting 10 seconds for containers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`n6. Checking container status..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml ps"

Write-Host "`n7. Testing Nginx from inside container..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml exec -T nginx nginx -t 2>&1"

Write-Host "`n=== Fix Complete ===" -ForegroundColor Green
Write-Host "Test the domain now: https://www.the-connection-key.de" -ForegroundColor Cyan

