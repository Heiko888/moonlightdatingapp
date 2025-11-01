#!/bin/bash
# Docker Build - Baue Container neu

cd /opt/hd-app/HD_App_chart

echo "==================================================="
echo "  DOCKER BUILD - Container bauen"
echo "==================================================="
echo ""

echo "1. Stoppe laufende Container..."
docker-compose -f docker-compose.supabase.yml down

if [ $? -ne 0 ]; then
    echo "⚠️  Warnung: Fehler beim Stoppen der Container"
fi

echo ""
echo "2. Baue Frontend neu (no-cache)..."
docker-compose -f docker-compose.supabase.yml build --no-cache frontend

if [ $? -ne 0 ]; then
    echo "❌ Fehler beim Docker Build!"
    exit 1
fi

echo ""
echo "==================================================="
echo "  ✅ DOCKER BUILD COMPLETE"
echo "==================================================="

