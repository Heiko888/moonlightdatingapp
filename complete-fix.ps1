# COMPLETE FIX - Alle bekannten Probleme beheben
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  COMPLETE FIX - Social Sharing Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Pull latest code
Write-Host "1. Git Pull..." -ForegroundColor Yellow
ssh $server "cd $path && git pull origin main && git status"
Write-Host ""

# 2. Check if files exist
Write-Host "2. Checking critical files..." -ForegroundColor Yellow
ssh $server "cd $path && ls -la frontend/lib/hooks/useAuth.ts"
ssh $server "cd $path && ls -la frontend/lib/supabase/server.ts"
Write-Host ""

# 3. Install ALL dependencies fresh
Write-Host "3. Installing dependencies (fresh)..." -ForegroundColor Yellow
ssh $server "cd $path/frontend && rm -rf node_modules package-lock.json && npm install"
Write-Host ""

# 4. Stop and remove all containers
Write-Host "4. Stopping all containers..." -ForegroundColor Yellow
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml down -v"
Write-Host ""

# 5. Remove old images
Write-Host "5. Removing old Docker images..." -ForegroundColor Yellow
ssh $server "docker image prune -f"
Write-Host ""

# 6. Build frontend (no cache)
Write-Host "6. Building frontend (this takes 5-10 minutes)..." -ForegroundColor Yellow
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml build --no-cache frontend"
Write-Host ""

# 7. Start all services
Write-Host "7. Starting all services..." -ForegroundColor Yellow
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml up -d"
Write-Host ""

# 8. Wait and check status
Write-Host "8. Waiting 10 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "9. Container Status:" -ForegroundColor Yellow
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml ps"
Write-Host ""

Write-Host "================================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Check the app at: http://138.199.237.34:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "If there are still errors, check logs with:" -ForegroundColor Yellow
Write-Host "  .\check-logs.ps1" -ForegroundColor White

