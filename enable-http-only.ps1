# Enable HTTP-Only Configuration (temporary, for testing)
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "=== Enabling HTTP-Only Configuration ===" -ForegroundColor Green
Write-Host "WARNING: This is for testing only! SSL will be disabled temporarily." -ForegroundColor Yellow

Write-Host "`n1. Stopping Nginx..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml stop nginx"

Write-Host "`n2. Backing up current nginx.conf..." -ForegroundColor Yellow
ssh $server "cd $path && cp nginx/nginx.conf nginx/nginx.conf.backup.`$(date +%Y%m%d_%H%M%S)"

Write-Host "`n3. Creating HTTP-only configuration on server..." -ForegroundColor Yellow
# Read the HTTP-only config and write it directly via SSH
$httpOnlyConfig = Get-Content -Path "nginx/nginx-http-only.conf" -Raw
$escapedConfig = $httpOnlyConfig -replace "'", "''" -replace '\$', '\$'
ssh $server "cat > $path/nginx/nginx.conf << 'NGINXCONFIG'
$escapedConfig
NGINXCONFIG
"

Write-Host "`n4. Starting Nginx with HTTP-only config..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml start nginx"

Write-Host "`n5. Waiting 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "`n6. Testing Nginx config..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml exec -T nginx nginx -t 2>&1"

Write-Host "`n7. Checking container status..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml ps nginx"

Write-Host "`n=== HTTP-Only Mode Enabled ===" -ForegroundColor Green
Write-Host "Test the domain: http://www.the-connection-key.de (NOTE: HTTP, not HTTPS)" -ForegroundColor Cyan
Write-Host "`nTo restore SSL: Run restore-ssl-config.ps1" -ForegroundColor Yellow

