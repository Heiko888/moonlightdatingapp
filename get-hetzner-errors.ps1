# Get specific error messages from Hetzner
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "=== Getting Error Messages ===" -ForegroundColor Green

# Create script that collects all errors
ssh $server @"
cd $path

echo '=== CONTAINER STATUS ==='
docker compose -f docker-compose.supabase.yml ps

echo -e '\n=== NGINX ERROR LOG (LAST 50 LINES) ==='
NGINX_CONTAINER=`$(docker ps --filter 'name=nginx' --format '{{.Names}}' | head -1)
if [ -n \"`$NGINX_CONTAINER\" ]; then
    docker exec `$NGINX_CONTAINER tail -50 /var/log/nginx/error.log 2>&1
else
    echo 'Nginx container not found!'
    docker ps --filter 'name=nginx'
fi

echo -e '\n=== NGINX ACCESS LOG (LAST 20 LINES) ==='
if [ -n \"`$NGINX_CONTAINER\" ]; then
    docker exec `$NGINX_CONTAINER tail -20 /var/log/nginx/access.log 2>&1
fi

echo -e '\n=== FRONTEND LOGS (LAST 50 LINES) ==='
docker compose -f docker-compose.supabase.yml logs --tail=50 frontend 2>&1

echo -e '\n=== NGINX CONFIG TEST ==='
docker compose -f docker-compose.supabase.yml exec -T nginx nginx -t 2>&1

echo -e '\n=== TEST FRONTEND FROM NGINX ==='
if [ -n \"`$NGINX_CONTAINER\" ]; then
    echo 'Pinging frontend...'
    docker exec `$NGINX_CONTAINER ping -c 2 frontend 2>&1
    echo 'Connecting to frontend:3000...'
    docker exec `$NGINX_CONTAINER wget -q -O- --timeout=5 http://frontend:3000/health 2>&1 || echo 'CONNECTION FAILED'
    echo 'Trying IP directly...'
    FRONTEND_IP=`$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' `$(docker compose -f docker-compose.supabase.yml ps -q frontend) 2>/dev/null)
    if [ -n \"`$FRONTEND_IP\" ]; then
        echo \"Frontend IP: `$FRONTEND_IP\"
        docker exec `$NGINX_CONTAINER wget -q -O- --timeout=5 http://`$FRONTEND_IP:3000/health 2>&1 || echo 'IP CONNECTION FAILED'
    fi
fi

echo -e '\n=== DOCKER NETWORK INFO ==='
docker network ls | grep hd
NETWORK_NAME=`$(docker compose -f docker-compose.supabase.yml config 2>/dev/null | grep -A2 'networks:' | tail -1 | awk '{print `$1}')
if [ -n \"`$NETWORK_NAME\" ]; then
    echo \"Network: `$NETWORK_NAME\"
    docker network inspect `$NETWORK_NAME 2>&1 | grep -A10 Containers
fi

echo -e '\n=== DIRECT FRONTEND TEST (from host) ==='
curl -v http://localhost:3000 2>&1 | head -15
"@ | Out-File -FilePath "hetzner-errors.txt" -Encoding UTF8

Write-Host "`nErrors saved to: hetzner-errors.txt" -ForegroundColor Green
Write-Host "`nDisplaying error file..." -ForegroundColor Yellow
Get-Content hetzner-errors.txt

