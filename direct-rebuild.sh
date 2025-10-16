#!/bin/bash
# Direct Rebuild auf Hetzner Server

cd /opt/hd-app/HD_App_chart

echo "==================================================="
echo "  DIRECT REBUILD - Fixing Static Files"
echo "==================================================="
echo ""

# 1. Stoppe Container
echo "1. Stopping containers..."
docker-compose -f docker-compose.supabase.yml down
echo ""

# 2. Pull latest code
echo "2. Pulling latest code..."
git pull origin main
echo ""

# 3. Create .env
echo "3. Creating .env..."
cp env.production .env
echo ""

# 4. Clean frontend
echo "4. Cleaning frontend build..."
cd frontend
rm -rf .next node_modules package-lock.json
echo ""

# 5. Install dependencies
echo "5. Installing dependencies..."
npm install
echo ""

# 6. Build locally (not in Docker)
echo "6. Building Next.js app locally..."
npm run build
echo ""

# 7. Go back
cd ..

# 8. Rebuild Docker image
echo "7. Rebuilding Docker image..."
docker-compose -f docker-compose.supabase.yml build --no-cache frontend
echo ""

# 9. Start everything
echo "8. Starting all services..."
docker-compose -f docker-compose.supabase.yml up -d
echo ""

# 10. Show status
echo "9. Container status:"
docker-compose -f docker-compose.supabase.yml ps
echo ""

echo "==================================================="
echo "  REBUILD COMPLETE!"
echo "==================================================="
echo ""
echo "Test: http://138.199.237.34:3000"

