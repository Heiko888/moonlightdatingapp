#!/bin/bash
# Docker Start - Container starten

cd /opt/hd-app/HD_App_chart

echo "==================================================="
echo "  DOCKER START - Container starten"
echo "==================================================="
echo ""

echo "1. Starte Container..."
docker-compose -f docker-compose.supabase.yml up -d

if [ $? -ne 0 ]; then
    echo "❌ Fehler beim Starten der Container!"
    exit 1
fi

echo ""
echo "2. Warte 5 Sekunden..."
sleep 5

echo ""
echo "3. Container-Status:"
docker-compose -f docker-compose.supabase.yml ps

echo ""
echo "4. Letzte Logs:"
docker-compose -f docker-compose.supabase.yml logs --tail=20

echo ""
echo "==================================================="
echo "  ✅ DOCKER START COMPLETE"
echo "==================================================="
echo ""
echo "🌐 App verfügbar unter: http://138.199.237.34"

