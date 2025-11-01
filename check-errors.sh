#!/bin/bash
# Run this on the server: bash check-errors.sh
# Or: ssh root@138.199.237.34 "bash -s" < check-errors.sh

cd /opt/hd-app/HD_App_chart

echo "=========================================="
echo "=== CONTAINER STATUS ==="
echo "=========================================="
docker compose -f docker-compose.supabase.yml ps

echo ""
echo "=========================================="
echo "=== NGINX ERROR LOG (LAST 50 LINES) ==="
echo "=========================================="
NGINX_CONTAINER=$(docker ps --filter 'name=nginx' --format '{{.Names}}' | head -1)
if [ -n "$NGINX_CONTAINER" ]; then
    echo "Nginx Container: $NGINX_CONTAINER"
    docker exec $NGINX_CONTAINER tail -50 /var/log/nginx/error.log 2>&1
else
    echo "ERROR: Nginx container not found!"
    docker ps --all | grep nginx
fi

echo ""
echo "=========================================="
echo "=== NGINX ACCESS LOG (LAST 20 LINES) ==="
echo "=========================================="
if [ -n "$NGINX_CONTAINER" ]; then
    docker exec $NGINX_CONTAINER tail -20 /var/log/nginx/access.log 2>&1
fi

echo ""
echo "=========================================="
echo "=== FRONTEND LOGS (LAST 50 LINES) ==="
echo "=========================================="
docker compose -f docker-compose.supabase.yml logs --tail=50 frontend 2>&1

echo ""
echo "=========================================="
echo "=== NGINX CONFIG TEST ==="
echo "=========================================="
docker compose -f docker-compose.supabase.yml exec -T nginx nginx -t 2>&1

echo ""
echo "=========================================="
echo "=== TEST FRONTEND CONNECTIVITY ==="
echo "=========================================="
if [ -n "$NGINX_CONTAINER" ]; then
    echo "1. Testing ping to frontend:"
    docker exec $NGINX_CONTAINER ping -c 2 frontend 2>&1 || echo "PING FAILED"
    
    echo ""
    echo "2. Testing HTTP connection to frontend:3000:"
    docker exec $NGINX_CONTAINER wget -q -O- --timeout=5 http://frontend:3000/health 2>&1 || echo "HTTP CONNECTION FAILED"
    
    echo ""
    echo "3. Testing direct IP connection:"
    FRONTEND_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker compose -f docker-compose.supabase.yml ps -q frontend) 2>/dev/null)
    if [ -n "$FRONTEND_IP" ]; then
        echo "Frontend IP: $FRONTEND_IP"
        docker exec $NGINX_CONTAINER wget -q -O- --timeout=5 http://$FRONTEND_IP:3000/health 2>&1 || echo "IP CONNECTION FAILED"
    else
        echo "Could not determine Frontend IP"
    fi
fi

echo ""
echo "=========================================="
echo "=== DIRECT FRONTEND TEST (from host) ==="
echo "=========================================="
curl -v http://localhost:3000 2>&1 | head -20

echo ""
echo "=========================================="
echo "=== DOCKER NETWORK INFO ==="
echo "=========================================="
NETWORK_NAME=$(docker compose -f docker-compose.supabase.yml config 2>/dev/null | grep -A2 'networks:' | tail -1 | awk '{print $1}')
if [ -n "$NETWORK_NAME" ]; then
    echo "Network: $NETWORK_NAME"
    docker network inspect $NETWORK_NAME 2>&1 | grep -A20 '"Containers"' || echo "Could not inspect network"
else
    docker network ls
fi

echo ""
echo "=========================================="
echo "=== DIAGNOSIS COMPLETE ==="
echo "=========================================="

