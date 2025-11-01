#!/bin/bash
# Fix Docker Network iptables Error

echo "==================================================="
echo "  DOCKER NETWORK FIX"
echo "==================================================="
echo ""

echo "1. Prüfe Docker-Daemon Status..."
systemctl status docker | head -5
echo ""

echo "2. Stoppe Docker-Daemon..."
systemctl stop docker
echo ""

echo "3. Prüfe iptables..."
iptables -L -n | head -10
echo ""

echo "4. Entferne alte Docker-Netzwerke..."
docker network prune -f 2>/dev/null || echo "Docker nicht verfügbar (erwartet)"
echo ""

echo "5. Starte Docker-Daemon neu..."
systemctl start docker
echo ""

echo "6. Warte 5 Sekunden..."
sleep 5
echo ""

echo "7. Prüfe Docker-Status..."
systemctl status docker | head -5
echo ""

echo "8. Prüfe Docker-Netzwerke..."
docker network ls
echo ""

echo "==================================================="
echo "  FIX ABGESCHLOSSEN"
echo "==================================================="
echo ""

echo "Jetzt versuche Container zu starten:"
echo "cd /opt/hd-app/HD_App_chart"
echo "docker-compose -f docker-compose.supabase.yml up -d"

