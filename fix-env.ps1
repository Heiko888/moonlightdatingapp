# Fix Environment Variables
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  FIX ENVIRONMENT VARIABLES" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Create .env from env.production
Write-Host "1. Creating .env from env.production..." -ForegroundColor Yellow
ssh $server "cd $path && cp env.production .env"
Write-Host ""

# 2. Verify .env was created
Write-Host "2. Verifying .env file:" -ForegroundColor Yellow
ssh $server "cd $path && ls -la .env"
Write-Host ""

# 3. Restart frontend to pick up new env vars
Write-Host "3. Restarting frontend container..." -ForegroundColor Yellow
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml restart frontend"
Write-Host ""

# 4. Wait for restart
Write-Host "4. Waiting 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 5. Check if environment variables are now set
Write-Host "5. Checking if SUPABASE variables are set:" -ForegroundColor Yellow
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml exec frontend printenv | grep SUPABASE"
Write-Host ""

Write-Host "================================================" -ForegroundColor Green
Write-Host "  ENVIRONMENT FIX COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Test the app: http://138.199.237.34:3000" -ForegroundColor Cyan

