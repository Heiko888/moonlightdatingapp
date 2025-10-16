# Quick Deployment Script
Write-Host "Starting deployment..." -ForegroundColor Green

# SSH Commands
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

# 1. Pull latest code
Write-Host "Pulling latest code from GitHub..." -ForegroundColor Yellow
ssh $server "cd $path && git pull origin main"

# 2. Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
ssh $server "cd $path/frontend && npm install"

# 3. Rebuild and restart
Write-Host "Rebuilding Docker containers..." -ForegroundColor Yellow
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml down"
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml build --no-cache frontend"
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml up -d"

Write-Host "Deployment completed!" -ForegroundColor Green

