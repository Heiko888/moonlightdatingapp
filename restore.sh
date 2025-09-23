#!/bin/bash

# 🔄 HD App - Restore Script
# Wiederherstellung von HD App Backups

set -e

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Konfiguration
BACKUP_DIR="/opt/backups/hd-app"

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

# Prüfe ob Backup-Datei angegeben wurde
if [ -z "$1" ]; then
    log_error "Keine Backup-Datei angegeben!"
    echo ""
    echo "Verwendung: $0 <backup-datei>"
    echo ""
    log_info "Verfügbare Backups:"
    ls -la "$BACKUP_DIR"/hd-app-backup-*.tar.gz 2>/dev/null || echo "Keine Backups gefunden"
    exit 1
fi

BACKUP_FILE="$1"

# Prüfe ob Backup-Datei existiert
if [ ! -f "$BACKUP_FILE" ]; then
    log_error "Backup-Datei nicht gefunden: $BACKUP_FILE"
    exit 1
fi

log_info "HD App Restore wird gestartet..."
echo "Backup-Datei: $BACKUP_FILE"
echo ""

# Bestätigung
read -p "Sind Sie sicher, dass Sie das Backup wiederherstellen möchten? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Restore abgebrochen"
    exit 0
fi

# 1. Services stoppen
log_info "Services werden gestoppt..."
docker-compose -f docker-compose.prod.yml down
log_success "Services gestoppt"

# 2. Backup extrahieren
log_info "Backup wird extrahiert..."
TEMP_DIR="/tmp/hd-app-restore-$(date +%s)"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"
tar -xzf "$BACKUP_FILE"
log_success "Backup extrahiert"

# 3. MongoDB wiederherstellen
log_info "MongoDB wird wiederhergestellt..."
if [ -d "mongodb_"* ]; then
    # Services starten (nur MongoDB)
    docker-compose -f docker-compose.prod.yml up -d mongo
    sleep 10
    
    # Warten bis MongoDB bereit ist
    until docker exec hd-app_mongo_1 mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
        log_info "Warten auf MongoDB..."
        sleep 2
    done
    
    # Backup in Container kopieren und wiederherstellen
    MONGODB_DIR=$(ls -d mongodb_* | head -1)
    docker cp "$MONGODB_DIR" hd-app_mongo_1:/tmp/restore
    docker exec hd-app_mongo_1 mongorestore /tmp/restore
    docker exec hd-app_mongo_1 rm -rf /tmp/restore
    log_success "MongoDB wiederhergestellt"
else
    log_warning "MongoDB Backup nicht gefunden"
fi

# 4. SQLite Datenbanken wiederherstellen
log_info "SQLite Datenbanken werden wiederhergestellt..."
if [ -d "sqlite_"* ]; then
    SQLITE_DIR=$(ls -d sqlite_* | head -1)
    cp -r "$SQLITE_DIR"/* backend/data/
    log_success "SQLite Datenbanken wiederhergestellt"
else
    log_warning "SQLite Backup nicht gefunden"
fi

# 5. Upload-Verzeichnis wiederherstellen
log_info "Upload-Verzeichnis wird wiederhergestellt..."
if [ -d "uploads_"* ]; then
    UPLOADS_DIR=$(ls -d uploads_* | head -1)
    cp -r "$UPLOADS_DIR" backend/uploads
    log_success "Upload-Verzeichnis wiederhergestellt"
else
    log_warning "Upload-Backup nicht gefunden"
fi

# 6. Konfigurationsdateien wiederherstellen (optional)
read -p "Möchten Sie auch die Konfigurationsdateien wiederherstellen? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Konfigurationsdateien werden wiederhergestellt..."
    if [ -d "config_"* ]; then
        CONFIG_DIR=$(ls -d config_* | head -1)
        cp -r "$CONFIG_DIR"/* ./
        log_success "Konfigurationsdateien wiederhergestellt"
    else
        log_warning "Konfigurations-Backup nicht gefunden"
    fi
fi

# 7. Temporäres Verzeichnis bereinigen
log_info "Temporäre Dateien werden bereinigt..."
rm -rf "$TEMP_DIR"
log_success "Temporäre Dateien bereinigt"

# 8. Services starten
log_info "Services werden gestartet..."
docker-compose -f docker-compose.prod.yml up -d
log_success "Services gestartet"

# 9. Health Check
log_info "Health Check wird durchgeführt..."
sleep 30

services=("hd-backend:4001" "hd-frontend:3000")
for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if curl -f -s http://localhost:$port/health > /dev/null 2>&1; then
        log_success "$name ist erreichbar (Port $port)"
    else
        log_warning "$name ist nicht erreichbar (Port $port)"
    fi
done

echo ""
log_success "🎉 HD App Restore abgeschlossen!"
echo ""
echo "📊 Restore-Informationen:"
echo "========================="
echo "Backup-Datei: $BACKUP_FILE"
echo "Wiederherstellungszeit: $(date)"
echo ""
echo "🔧 Nächste Schritte:"
echo "===================="
echo "1. Überprüfen Sie die Anwendung: http://localhost:3000"
echo "2. Prüfen Sie die Logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "3. Testen Sie die Funktionalität"
echo ""
log_success "Die HD App wurde erfolgreich wiederhergestellt!"
