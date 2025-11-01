# Diagnose Docker Network and Frontend Connectivity
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "=== Docker Network Diagnosis ===" -ForegroundColor Green

# Create comprehensive diagnosis script
ssh $server @"
cd $path

echo '=== 1. Container Status ==='
docker compose -f docker-compose.supabase.yml ps

echo -e '\n=== 2. Docker Network ==='
docker network ls
docker network inspect `$(docker compose -f docker-compose.supabase.yml config | grep -A1 'networks:' | tail -1 | awk '{print `$1}') | grep -A5 'Containers'

echo -e '\n=== 3. Frontend Container IP ==='
docker compose -f docker-compose.supabase.yml exec -T frontend hostname -i 2>&1 || docker inspect `$(docker compose -f docker-compose.supabase.yml ps -q frontend) | grep -A5 IPAddress

echo -e '\n=== 4. Test Frontend from Nginx Container ==='
NGINX_CONTAINER=`$(docker ps --filter 'name=nginx' --format '{{.Names}}' | head -1)
if [ -n \"`$NGINX_CONTAINER\" ]; then
    echo \"Nginx Container: `$NGINX_CONTAINER\"
    docker exec `$NGINX_CONTAINER ping -c 2 frontend 2>&1 || echo 'Ping failed'
    docker exec `$NGINX_CONTAINER wget -q -O- --timeout=5 http://frontend:3000/health 2>&1 || echo 'Frontend not reachable'
else
    echo 'Nginx container not found'
fi

echo -e '\n=== 5. Frontend Logs (last 30 lines) ==='
docker compose -f docker-compose.supabase.yml logs --tail=30 frontend 2>&1

echo -e '\n=== 6. Nginx Error Log (last 30 lines) ==='
NGINX_CONTAINER=`$(docker ps --filter 'name=nginx' --format '{{.Names}}' | head -1)
if [ -n \"`$NGINX_CONTAINER\" ]; then
    docker exec `$NGINX_CONTAINER tail -30 /var/log/nginx/error.log 2>&1
else
    echo 'Nginx container not found'
fi

echo -e '\n=== 7. Direct Frontend Test (from host) ==='
curl -I http://localhost:3000 2>&1 | head -3
"@

Write-Host "`n=== Diagnosis Complete ===" -ForegroundColor Green

