# Check Database Status
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  DATABASE STATUS CHECK" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check all containers
Write-Host "1. All Docker Containers:" -ForegroundColor Yellow
ssh $server "docker ps -a"
Write-Host ""

# 2. Check Supabase specifically
Write-Host "2. Supabase Services:" -ForegroundColor Yellow
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml ps"
Write-Host ""

# 3. Check frontend logs for database errors
Write-Host "3. Frontend Logs (Database errors):" -ForegroundColor Yellow
ssh $server "docker logs hd_app_chart_frontend_1 2>&1 | grep -i 'supabase\|database\|error' | tail -20"
Write-Host ""

# 4. Check environment variables
Write-Host "4. Environment Variables (Frontend):" -ForegroundColor Yellow
ssh $server "cd $path && docker exec hd_app_chart_frontend_1 printenv | grep SUPABASE"
Write-Host ""

# 5. Test Supabase connection
Write-Host "5. Testing Supabase URL:" -ForegroundColor Yellow
ssh $server "curl -I https://uatgacdkneprlbhdayat.supabase.co/rest/v1/"
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  CHECK COMPLETE" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

