# Simple Hetzner Domain Diagnosis
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "=== Hetzner Domain Diagnosis ===" -ForegroundColor Green

# Create diagnosis script on server
$diagnosisScript = @"
#!/bin/bash
cd $path

echo '=== 1. Container Status ==='
docker compose -f docker-compose.supabase.yml ps

echo -e '\n=== 2. Nginx Container Name ==='
docker ps --filter 'name=nginx' --format '{{.Names}}' | head -1

echo -e '\n=== 3. Testing Nginx Config ==='
NGINX_CONTAINER=`$(docker ps --filter 'name=nginx' --format '{{.Names}}' | head -1)
docker exec `$NGINX_CONTAINER nginx -t 2>&1

echo -e '\n=== 4. Frontend Health Check ==='
docker exec `$NGINX_CONTAINER wget -q -O- http://frontend:3000/health 2>&1 || echo 'Frontend not reachable'

echo -e '\n=== 5. Nginx Error Log (last 20 lines) ==='
docker exec `$NGINX_CONTAINER tail -20 /var/log/nginx/error.log 2>&1 || echo 'Cannot read error log'

echo -e '\n=== 6. Nginx Access Log (last 10 lines) ==='
docker exec `$NGINX_CONTAINER tail -10 /var/log/nginx/access.log 2>&1 || echo 'Cannot read access log'

echo -e '\n=== 7. Direct Frontend Test ==='
curl -I http://localhost:3000 2>&1 | head -3

echo -e '\n=== 8. SSL Certificate Check ==='
ls -la /etc/letsencrypt/live/www.the-connection-key.de/ 2>&1 | head -5
"@

# Write script to server and execute
ssh $server "cat > /tmp/diagnose.sh << 'SCRIPT'
$diagnosisScript
SCRIPT
chmod +x /tmp/diagnose.sh && /tmp/diagnose.sh"

Write-Host "`n=== Diagnosis Complete ===" -ForegroundColor Green

