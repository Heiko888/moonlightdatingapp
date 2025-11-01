#!/bin/bash
# Script to collect logs from Hetzner server

cd /opt/hd-app/HD_App_chart

echo "=== Container Status ==="
docker compose -f docker-compose.supabase.yml ps

echo -e "\n=== Nginx Logs (last 200 lines) ==="
docker compose -f docker-compose.supabase.yml logs --tail=200 nginx 2>&1

echo -e "\n=== Frontend Logs (last 200 lines) ==="
docker compose -f docker-compose.supabase.yml logs --tail=200 frontend 2>&1

echo -e "\n=== Nginx Config Test ==="
docker exec hd-app-nginx-1 nginx -t 2>&1 || docker exec hd_app_chart-nginx-1 nginx -t 2>&1 || echo "Nginx container not found"

echo -e "\n=== SSL Certificates ==="
ls -la /etc/letsencrypt/live/www.the-connection-key.de/ 2>&1 || echo "Certificates not found"

echo -e "\n=== Error Log Check ==="
docker exec hd-app-nginx-1 cat /var/log/nginx/error.log 2>&1 | tail -50 || docker exec hd_app_chart-nginx-1 cat /var/log/nginx/error.log 2>&1 | tail -50 || echo "Cannot access error log"

