# Restore SSL Configuration
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "=== Restoring SSL Configuration ===" -ForegroundColor Green

Write-Host "`n1. Stopping Nginx..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml stop nginx"

Write-Host "`n2. Finding backup file..." -ForegroundColor Yellow
$backupFile = ssh $server "cd $path && ls -t nginx/nginx.conf.backup.* 2>/dev/null | head -1"
if ($backupFile) {
    Write-Host "Found backup: $backupFile" -ForegroundColor Green
    Write-Host "`n3. Restoring from backup..." -ForegroundColor Yellow
    ssh $server "cd $path && cp $backupFile nginx/nginx.conf"
} else {
    Write-Host "No backup found. Pulling from git..." -ForegroundColor Yellow
    ssh $server "cd $path && git checkout nginx/nginx.conf"
}

Write-Host "`n4. Starting Nginx..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml start nginx"

Write-Host "`n5. Waiting 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "`n6. Testing Nginx config..." -ForegroundColor Yellow
ssh $server "cd $path && docker compose -f docker-compose.supabase.yml exec -T nginx nginx -t 2>&1"

Write-Host "`n=== SSL Configuration Restored ===" -ForegroundColor Green
Write-Host "Test the domain: https://www.the-connection-key.de" -ForegroundColor Cyan

