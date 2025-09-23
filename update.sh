#!/bin/bash

# 🔄 HD App - Update Script
# Automatisches Update für HD App

set -e

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funktionen
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_info "HD App Update wird gestartet..."
echo "Update-Zeit: $(date)"
echo ""

# 1. Backup erstellen
log_info "Backup wird erstellt..."
if [ -f "backup.sh" ]; then
    ./backup.sh
    log_success "Backup erstellt"
else
    log_warning "Backup-Skript nicht gefunden - Update ohne Backup fortgesetzt"
fi

# 2. Git Repository aktualisieren
log_info "Repository wird aktualisiert..."
if [ -d ".git" ]; then
    git fetch origin
    CURRENT_BRANCH=$(git branch --show-current)
    log_info "Aktueller Branch: $CURRENT_BRANCH"
    
    # Prüfe auf Änderungen
    if [ -n "$(git status --porcelain)" ]; then
        log_warning "Uncommitted changes detected. Stashing..."
        git stash push -m "Auto-stash before update $(date)"
    fi
    
    # Update durchführen
    git pull origin "$CURRENT_BRANCH"
    log_success "Repository aktualisiert"
else
    log_warning "Kein Git-Repository gefunden"
fi

# 3. Dependencies aktualisieren
log_info "Dependencies werden aktualisiert..."

# Backend Dependencies
if [ -f "backend/package.json" ]; then
    log_info "Backend Dependencies werden aktualisiert..."
    cd backend
    npm update
    cd ..
    log_success "Backend Dependencies aktualisiert"
fi

# Frontend Dependencies
if [ -f "frontend/package.json" ]; then
    log_info "Frontend Dependencies werden aktualisiert..."
    cd frontend
    npm update
    cd ..
    log_success "Frontend Dependencies aktualisiert"
fi

# 4. Docker Images neu bauen
log_info "Docker Images werden neu gebaut..."
docker-compose -f docker-compose.prod.yml build --no-cache --parallel
log_success "Docker Images neu gebaut"

# 5. Services neu starten
log_info "Services werden neu gestartet..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
log_success "Services neu gestartet"

# 6. Warten auf Services
log_info "Warten auf Services..."
sleep 60

# 7. Health Check
log_info "Health Check wird durchgeführt..."
services=("hd-backend:4001" "hd-frontend:3000" "grafana:3001" "prometheus:9090")
for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if curl -f -s http://localhost:$port > /dev/null 2>&1; then
        log_success "$name ist erreichbar (Port $port)"
    else
        log_warning "$name ist nicht erreichbar (Port $port)"
    fi
done

# 8. Datenbank-Migrationen (falls vorhanden)
if [ -f "backend/migrations/migrate.js" ]; then
    log_info "Datenbank-Migrationen werden ausgeführt..."
    cd backend
    node migrations/migrate.js
    cd ..
    log_success "Datenbank-Migrationen ausgeführt"
fi

# 9. Cache leeren
log_info "Cache wird geleert..."
docker system prune -f
log_success "Cache geleert"

# 10. Status anzeigen
log_info "Update Status:"
echo "==================="
docker-compose -f docker-compose.prod.yml ps

echo ""
log_success "🎉 HD App Update abgeschlossen!"
echo ""
echo "📊 Update-Informationen:"
echo "========================"
echo "Update-Zeit: $(date)"
echo "Git Branch: $(git branch --show-current 2>/dev/null || echo 'N/A')"
echo "Git Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')"
echo ""
echo "🌐 Verfügbare URLs:"
echo "==================="
echo "Frontend:  http://$(hostname -I | awk '{print $1}'):3000"
echo "Backend:   http://$(hostname -I | awk '{print $1}'):4001"
echo "Grafana:   http://$(hostname -I | awk '{print $1}'):3001"
echo "Prometheus: http://$(hostname -I | awk '{print $1}'):9090"
echo ""
echo "🔧 Nützliche Befehle:"
echo "====================="
echo "Logs anzeigen:    docker-compose -f docker-compose.prod.yml logs -f"
echo "Status prüfen:    docker-compose -f docker-compose.prod.yml ps"
echo "Rollback:         git reset --hard HEAD~1 && ./restore.sh <backup-file>"
echo ""
log_success "Die HD App wurde erfolgreich aktualisiert!"
