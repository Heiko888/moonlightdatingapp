# Fix Deployment - Install @supabase/ssr
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  FIX DEPLOYMENT - Install @supabase/ssr" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Pull latest code
Write-Host "1. Pull latest code from GitHub..." -ForegroundColor Yellow
ssh $server "cd $path && git pull origin main"
Write-Host ""

# 2. Install @supabase/ssr dependency
Write-Host "2. Installing @supabase/ssr..." -ForegroundColor Yellow
ssh $server "cd $path/frontend && npm install @supabase/ssr"
Write-Host ""

# 3. Stop containers
Write-Host "3. Stopping containers..." -ForegroundColor Yellow
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml down"
Write-Host ""

# 4. Rebuild frontend (no cache)
Write-Host "4. Rebuilding frontend..." -ForegroundColor Yellow
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml build --no-cache frontend"
Write-Host ""

# 5. Start all services
Write-Host "5. Starting all services..." -ForegroundColor Yellow
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml up -d"
Write-Host ""

Write-Host "================================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT FIXED!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Check: http://138.199.237.34:3000" -ForegroundColor Cyan

