#!/bin/bash
# Deploy All - Alle 3 Schritte nacheinander

echo "==================================================="
echo "  🚀 FULL DEPLOYMENT"
echo "==================================================="
echo ""

# Schritt 1: Git Pull
echo "📍 Schritt 1/3: Git Pull"
./git-pull.sh

if [ $? -ne 0 ]; then
    echo "❌ Git Pull fehlgeschlagen! Deployment abgebrochen."
    exit 1
fi

echo ""
echo ""

# Schritt 2: Docker Build
echo "📍 Schritt 2/3: Docker Build"
./docker-build.sh

if [ $? -ne 0 ]; then
    echo "❌ Docker Build fehlgeschlagen! Deployment abgebrochen."
    exit 1
fi

echo ""
echo ""

# Schritt 3: Docker Start
echo "📍 Schritt 3/3: Docker Start"
./docker-start.sh

if [ $? -ne 0 ]; then
    echo "❌ Docker Start fehlgeschlagen! Deployment abgebrochen."
    exit 1
fi

echo ""
echo "==================================================="
echo "  🎉 DEPLOYMENT ERFOLGREICH ABGESCHLOSSEN!"
echo "==================================================="
echo ""

