#!/bin/bash
# Start Docker Containers nach Network Fix

cd /opt/hd-app/HD_App_chart

echo "==================================================="
echo "  CONTAINER STARTEN"
echo "==================================================="
echo ""

echo "1. Prüfe docker-compose Datei..."
ls -la docker-compose.supabase.yml
echo ""

echo "2. Starte Container..."
docker-compose -f docker-compose.supabase.yml up -d

echo ""
echo "3. Warte 10 Sekunden..."
sleep 10

echo ""
echo "4. Container-Status:"
docker-compose -f docker-compose.supabase.yml ps

echo ""
echo "5. Container-Logs (letzte 20 Zeilen):"
docker-compose -f docker-compose.supabase.yml logs --tail=20

echo ""
echo "==================================================="
echo "  CONTAINER START ABGESCHLOSSEN"
echo "==================================================="
echo ""

