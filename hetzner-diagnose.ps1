# Hetzner Services Diagnose
Write-Host "Hetzner Services Diagnose" -ForegroundColor Blue
Write-Host "=========================" -ForegroundColor Blue
Write-Host ""

$HETZNER_IP = "138.199.237.34"

Write-Host "Hole Diagnose-Informationen von $HETZNER_IP..." -ForegroundColor Cyan
Write-Host ""

ssh root@$HETZNER_IP 'cd /opt/hd-app/HD_App_chart && echo "=== Docker Container Status ===" && docker ps -a && echo "" && echo "=== Frontend Logs (letzte 30 Zeilen) ===" && docker logs hd_app_chart_frontend_1 --tail=30 2>&1 && echo "" && echo "=== Nginx Logs (letzte 20 Zeilen) ===" && docker logs hd_app_chart_nginx_1 --tail=20 2>&1 && echo "" && echo "=== Environment Check ===" && ls -la .env* && echo "" && echo "=== Docker Compose Files ===" && ls -la docker-compose*.yml'

Write-Host ""
Write-Host "Diagnose abgeschlossen" -ForegroundColor Blue

