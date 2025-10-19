#!/usr/bin/env pwsh
# Hetzner Deployment - Static Files Fix
# Dieses Script deployt den Fix für die fehlenden /_next/static/ Dateien

$SERVER = "root@138.199.237.34"
$APP_DIR = "/opt/hd-app/HD_App_chart"

Write-Host "==================================================="
Write-Host "  HETZNER DEPLOYMENT - STATIC FILES FIX"
Write-Host "==================================================="
Write-Host ""

# 1. Push changes to GitHub
Write-Host "1. Pushing changes to GitHub..."
git add frontend/Dockerfile
git commit -m "fix: Add missing .next/static copy for standalone build"
git push origin main
Write-Host ""

# 2. Connect to server and rebuild
Write-Host "2. Connecting to Hetzner server..."
Write-Host ""

$deployScript = @"
#!/bin/bash
cd $APP_DIR

echo "==================================================="
echo "  REBUILDING WITH STATIC FILES FIX"
echo "==================================================="
echo ""

# Pull latest code
echo "1. Pulling latest code..."
git pull origin main
echo ""

# Stop containers
echo "2. Stopping containers..."
docker-compose -f docker-compose.supabase.yml down
echo ""

# Remove old images
echo "3. Removing old frontend image..."
docker rmi \$(docker images -q hd_app_chart-frontend) 2>/dev/null || true
echo ""

# Rebuild frontend (with --no-cache to ensure clean build)
echo "4. Rebuilding frontend with static files fix..."
docker-compose -f docker-compose.supabase.yml build --no-cache frontend
echo ""

# Start all services
echo "5. Starting all services..."
docker-compose -f docker-compose.supabase.yml up -d
echo ""

# Wait for container to be ready
echo "6. Waiting for container to start..."
sleep 10
echo ""

# Show status
echo "7. Container status:"
docker-compose -f docker-compose.supabase.yml ps
echo ""

# Check if static files are accessible
echo "8. Verifying static files..."
docker exec hd_app_chart-frontend-1 ls -la .next/static 2>/dev/null || echo "Static folder check failed (might be normal)"
echo ""

echo "==================================================="
echo "  DEPLOYMENT COMPLETE!"
echo "==================================================="
echo ""
echo "Check your app at: https://www.the-connection-key.de"
echo ""
"@

# Execute on server
ssh $SERVER $deployScript

Write-Host ""
Write-Host "==================================================="
Write-Host "  DONE!"
Write-Host "==================================================="
Write-Host ""
Write-Host "Teste jetzt deine App unter:"
Write-Host "https://www.the-connection-key.de"
Write-Host ""
Write-Host "Die /_next/static/ Dateien sollten jetzt erreichbar sein!"

