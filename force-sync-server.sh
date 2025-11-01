#!/bin/bash
# Force Server Sync - Synchronisiere Server mit GitHub (hard reset)

echo "==================================================="
echo "  FORCE SERVER SYNC - GitHub Repository"
echo "==================================================="
echo ""

SERVER_IP="138.199.237.34"
SERVER_PATH="/opt/hd-app/HD_App_chart"

echo "1. Aktueller Status auf Server..."
ssh root@$SERVER_IP "cd $SERVER_PATH && git rev-parse --short HEAD && git log -1 --oneline"
echo ""

echo "2. Hole neueste Änderungen von GitHub..."
ssh root@$SERVER_IP "cd $SERVER_PATH && git fetch origin main"
echo ""

echo "3. Hard Reset zu origin/main (verwirft lokale Änderungen!)..."
ssh root@$SERVER_IP "cd $SERVER_PATH && git reset --hard origin/main"
echo ""

echo "4. Clean (entfernt untracked files)..."
ssh root@$SERVER_IP "cd $SERVER_PATH && git clean -fd"
echo ""

echo "5. Neuer Status auf Server..."
ssh root@$SERVER_IP "cd $SERVER_PATH && git rev-parse --short HEAD && git log -1 --oneline"
echo ""

echo "6. Prüfe neue Dateien..."
ssh root@$SERVER_IP "cd $SERVER_PATH && echo '--- Scripts ---' && ls -la scripts/*.sh 2>/dev/null && echo '--- Deployment Docs ---' && ls -la DEPLOYMENT-STRATEGY-FINAL.md 2>/dev/null && echo '--- Coach Reading ---' && ls -la frontend/app/coach/readings/create/page.tsx 2>/dev/null"
echo ""

echo "==================================================="
echo "  SYNC ABGESCHLOSSEN"
echo "==================================================="
echo ""

