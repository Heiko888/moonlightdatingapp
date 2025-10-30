param(
  [string]$Commit = "origin/main"
)

# Fixed Deployment Script fuer Hetzner
Write-Host "Starting Hetzner Deployment... (Commit: $Commit)" -ForegroundColor Green

$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

# 1. Sync repo to target commit (hard reset)
Write-Host "Syncing repo to $Commit..." -ForegroundColor Yellow
ssh $server "set -e; cd $path; git fetch --all; git reset --hard $Commit; git clean -fdx; git rev-parse --short HEAD"

# 2. Build frontend image (no-cache) – lokaler Build (kein GHCR nötig)
Write-Host "Building frontend (no-cache)..." -ForegroundColor Yellow
ssh $server "set -e; cd $path; docker-compose -f docker-compose.supabase.yml build --no-cache frontend"

# 3. Stop containers
Write-Host "Stopping containers..." -ForegroundColor Yellow
ssh $server "set -e; cd $path; docker-compose -f docker-compose.supabase.yml down"

# 4. Start containers with rebuilt image
Write-Host "Starting containers..." -ForegroundColor Yellow
ssh $server "set -e; cd $path; docker-compose -f docker-compose.supabase.yml up -d --force-recreate frontend nginx"

# 5. Check status
Write-Host "Checking container status..." -ForegroundColor Yellow
ssh $server "cd $path; git rev-parse --short HEAD; docker-compose -f docker-compose.supabase.yml ps"

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "App available at: http://138.199.237.34" -ForegroundColor Cyan

