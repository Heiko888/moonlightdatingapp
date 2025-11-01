# Get errors directly and save to local file
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"
$outputFile = "hetzner-diagnosis.txt"

Write-Host "Collecting diagnosis data..." -ForegroundColor Yellow

# Execute commands and save all output
$diagnosis = ssh $server @"
cd $path
echo '=== CONTAINER STATUS ==='
docker compose -f docker-compose.supabase.yml ps
echo ''
echo '=== NGINX ERROR LOG ==='
NGINX_CONTAINER=`$(docker ps --filter 'name=nginx' --format '{{.Names}}' | head -1)
if [ -n \"`$NGINX_CONTAINER\" ]; then
    docker exec `$NGINX_CONTAINER tail -50 /var/log/nginx/error.log 2>&1
else
    echo 'Nginx container not found'
fi
echo ''
echo '=== FRONTEND LOGS ==='
docker compose -f docker-compose.supabase.yml logs --tail=50 frontend 2>&1
echo ''
echo '=== FRONTEND HEALTH TEST ==='
NGINX_CONTAINER=`$(docker ps --filter 'name=nginx' --format '{{.Names}}' | head -1)
if [ -n \"`$NGINX_CONTAINER\" ]; then
    docker exec `$NGINX_CONTAINER wget -q -O- --timeout=5 http://frontend:3000/health 2>&1 || echo 'FRONTEND NOT REACHABLE'
fi
"@ 2>&1

# Save to file
$diagnosis | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "`nDiagnosis saved to: $outputFile" -ForegroundColor Green
Write-Host "`n=== DIAGNOSIS RESULTS ===" -ForegroundColor Cyan
Get-Content $outputFile

