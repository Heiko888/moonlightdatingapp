#!/bin/bash
# Quick Status Check for Hetzner Server
# Run this directly on the server: ssh root@138.199.237.34 "bash -s" < check-hetzner-status.sh

cd /opt/hd-app/HD_App_chart

echo "=== Container Status ==="
docker compose -f docker-compose.supabase.yml ps

echo -e "\n=== Container Logs - Nginx (last 30 lines) ==="
docker compose -f docker-compose.supabase.yml logs --tail=30 nginx

echo -e "\n=== Container Logs - Frontend (last 30 lines) ==="
docker compose -f docker-compose.supabase.yml logs --tail=30 frontend

echo -e "\n=== Nginx Error Log ==="
NGINX_CONTAINER=$(docker ps --filter 'name=nginx' --format '{{.Names}}' | head -1)
if [ -n "$NGINX_CONTAINER" ]; then
    docker exec $NGINX_CONTAINER tail -30 /var/log/nginx/error.log 2>&1 || echo "Cannot access error log"
else
    echo "Nginx container not found"
fi

echo -e "\n=== Nginx Config Test ==="
docker compose -f docker-compose.supabase.yml exec -T nginx nginx -t 2>&1 || echo "Cannot test config"

echo -e "\n=== SSL Certificates ==="
ls -la /etc/letsencrypt/live/www.the-connection-key.de/ 2>&1 || echo "Certificates not found"

echo -e "\n=== Frontend Health Check ==="
curl -I http://localhost:3000 2>&1 | head -3

echo -e "\n=== Nginx Port Check ==="
netstat -tlnp | grep -E ':(80|443)' || ss -tlnp | grep -E ':(80|443)'

