#!/bin/bash
# Git Pull - Hole neuesten Code von GitHub

cd /opt/hd-app/HD_App_chart

echo "==================================================="
echo "  GIT PULL - GitHub Repository"
echo "==================================================="
echo ""

echo "1. Fetching from GitHub..."
git fetch origin main

echo "2. Pulling latest changes..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Fehler beim Git Pull!"
    exit 1
fi

echo "3. Showing current commit..."
git rev-parse --short HEAD
git log -1 --oneline

echo ""
echo "==================================================="
echo "  ✅ GIT PULL COMPLETE"
echo "==================================================="

