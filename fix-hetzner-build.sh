#!/bin/bash
# ==========================================
# FIX HETZNER BUILD PROBLEM
# ==========================================

echo ""
echo "🔧 FIX HETZNER BUILD"
echo "========================================"
echo ""

# 1. Zum Projekt-Verzeichnis
echo "📂 Wechsle zu Projekt..."
cd /root/hd-app || cd ~/hd-app || cd /home/*/hd-app || { echo "❌ Projekt nicht gefunden!"; exit 1; }

echo "✅ Projekt gefunden: $(pwd)"
echo ""

# 2. Git pull
echo "📥 Pulling latest code..."
git pull origin main
echo ""

# 3. Fix package-lock.json
echo "🔧 Fixing package-lock.json..."
cd frontend
npm install
cd ..
echo ""

# 4. Stop alte Container
echo "🛑 Stopping containers..."
docker-compose down
echo ""

# 5. Clean build (ohne cache)
echo "🏗️  Building containers (ohne cache)..."
docker-compose build --no-cache
echo ""

# 6. Start Container
echo "🚀 Starting containers..."
docker-compose up -d
echo ""

# 7. Warte auf Start
echo "⏳ Waiting 30 seconds for startup..."
sleep 30
echo ""

# 8. Status prüfen
echo "📊 Container Status:"
docker-compose ps
echo ""

# 9. Logs anzeigen
echo "📋 Recent logs:"
docker-compose logs --tail=50
echo ""

echo "✅ FERTIG!"
echo "========================================"
echo ""
echo "🌐 Teste jetzt:"
echo "  http://your-domain.com/reading"
echo ""

