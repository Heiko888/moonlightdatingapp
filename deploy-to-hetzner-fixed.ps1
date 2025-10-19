# Fixed Deployment Script fuer Hetzner
Write-Host "Starting Hetzner Deployment..." -ForegroundColor Green

$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

# 1. Pull latest code from GitHub
Write-Host "Pulling latest code from GitHub..." -ForegroundColor Yellow
ssh $server "cd $path; git pull origin main"

# 2. Pull latest Docker image from GitHub Container Registry
Write-Host "Pulling latest Docker image from GitHub..." -ForegroundColor Yellow
ssh $server "docker pull ghcr.io/heiko888/moonlightdatingapp:main"

# 3. Stop containers
Write-Host "Stopping containers..." -ForegroundColor Yellow
ssh $server "cd $path; docker-compose -f docker-compose.supabase.yml down"

# 4. Start containers with new image
Write-Host "Starting containers..." -ForegroundColor Yellow
ssh $server "cd $path; docker-compose -f docker-compose.supabase.yml up -d"

# 5. Check status
Write-Host "Checking container status..." -ForegroundColor Yellow
ssh $server "cd $path; docker-compose -f docker-compose.supabase.yml ps"

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "App available at: http://138.199.237.34" -ForegroundColor Cyan

