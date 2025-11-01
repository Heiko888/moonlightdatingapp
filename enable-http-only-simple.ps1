# Simple HTTP-Only Configuration (direct approach)
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "=== Enabling HTTP-Only Configuration (Simple) ===" -ForegroundColor Green

Write-Host "`n1. Stopping Nginx and creating HTTP-only config..." -ForegroundColor Yellow
ssh $server @"
cd $path
docker compose -f docker-compose.supabase.yml stop nginx
cp nginx/nginx.conf nginx/nginx.conf.backup.`$(date +%Y%m%d_%H%M%S)

# Modify nginx.conf to remove HTTPS redirect and SSL
sed -i 's|return 301 https://|# return 301 https://|g' nginx/nginx.conf
sed -i 's|listen 443 ssl|# listen 443 ssl|g' nginx/nginx.conf
sed -i 's|ssl_certificate|# ssl_certificate|g' nginx/nginx.conf

# Add proxy_pass to HTTP server block (if not already there)
grep -q 'proxy_pass http://frontend' nginx/nginx.conf || sed -i '/location \/ {/,/}/c\        location / {\n            proxy_pass http://frontend;\n            proxy_set_header Host \$host;\n            proxy_set_header X-Real-IP \$remote_addr;\n            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;\n            proxy_set_header X-Forwarded-Proto \$scheme;\n        }' nginx/nginx.conf

echo "Configuration modified"
"@

Write-Host "`n2. Starting Nginx..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml start nginx"

Write-Host "`n3. Waiting 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "`n4. Testing configuration..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml exec -T nginx nginx -t 2>&1"

Write-Host "`n=== HTTP-Only Mode Enabled ===" -ForegroundColor Green
Write-Host "Test: http://www.the-connection-key.de" -ForegroundColor Cyan

