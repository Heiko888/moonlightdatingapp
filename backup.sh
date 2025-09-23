#!/bin/bash

# 🗄️ HD App - Backup Script
# Automatisches Backup für HD App Datenbank und Konfiguration

set -e

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Konfiguration
BACKUP_DIR="/opt/backups/hd-app"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}

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

# Backup-Verzeichnis erstellen
mkdir -p "$BACKUP_DIR"

log_info "HD App Backup wird gestartet..."
echo "Backup-Datum: $DATE"
echo "Backup-Verzeichnis: $BACKUP_DIR"
echo ""

# 1. MongoDB Backup
log_info "MongoDB Backup wird erstellt..."
if docker exec hd-app_mongo_1 mongodump --out /tmp/backup 2>/dev/null; then
    docker cp hd-app_mongo_1:/tmp/backup "$BACKUP_DIR/mongodb_$DATE"
    docker exec hd-app_mongo_1 rm -rf /tmp/backup
    log_success "MongoDB Backup erstellt: mongodb_$DATE"
else
    log_warning "MongoDB Backup fehlgeschlagen - Container möglicherweise nicht verfügbar"
fi

# 2. SQLite Datenbanken Backup
log_info "SQLite Datenbanken werden gesichert..."
if [ -d "backend/data" ]; then
    cp -r backend/data "$BACKUP_DIR/sqlite_$DATE"
    log_success "SQLite Datenbanken gesichert: sqlite_$DATE"
else
    log_warning "SQLite Datenverzeichnis nicht gefunden"
fi

# 3. Konfigurationsdateien Backup
log_info "Konfigurationsdateien werden gesichert..."
mkdir -p "$BACKUP_DIR/config_$DATE"
cp -r docker-compose*.yml "$BACKUP_DIR/config_$DATE/" 2>/dev/null || true
cp -r env.production "$BACKUP_DIR/config_$DATE/" 2>/dev/null || true
cp -r .env "$BACKUP_DIR/config_$DATE/" 2>/dev/null || true
cp -r prometheus.yml "$BACKUP_DIR/config_$DATE/" 2>/dev/null || true
cp -r grafana/ "$BACKUP_DIR/config_$DATE/" 2>/dev/null || true
log_success "Konfigurationsdateien gesichert: config_$DATE"

# 4. Upload-Verzeichnis Backup
log_info "Upload-Verzeichnis wird gesichert..."
if [ -d "backend/uploads" ]; then
    cp -r backend/uploads "$BACKUP_DIR/uploads_$DATE"
    log_success "Upload-Verzeichnis gesichert: uploads_$DATE"
else
    log_warning "Upload-Verzeichnis nicht gefunden"
fi

# 5. Backup komprimieren
log_info "Backup wird komprimiert..."
cd "$BACKUP_DIR"
tar -czf "hd-app-backup-$DATE.tar.gz" mongodb_$DATE sqlite_$DATE config_$DATE uploads_$DATE 2>/dev/null || true
rm -rf mongodb_$DATE sqlite_$DATE config_$DATE uploads_$DATE
log_success "Backup komprimiert: hd-app-backup-$DATE.tar.gz"

# 6. Alte Backups löschen
log_info "Alte Backups werden bereinigt (älter als $RETENTION_DAYS Tage)..."
find "$BACKUP_DIR" -name "hd-app-backup-*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
log_success "Alte Backups bereinigt"

# 7. Backup-Status
log_info "Backup-Status:"
echo "==================="
ls -lh "$BACKUP_DIR"/hd-app-backup-*.tar.gz 2>/dev/null | tail -5 || echo "Keine Backups gefunden"
echo ""

# 8. Backup-Größe
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
log_success "Gesamt-Backup-Größe: $BACKUP_SIZE"

echo ""
log_success "🎉 HD App Backup abgeschlossen!"
echo ""
echo "📊 Backup-Informationen:"
echo "========================"
echo "Backup-Datei: hd-app-backup-$DATE.tar.gz"
echo "Speicherort: $BACKUP_DIR"
echo "Größe: $BACKUP_SIZE"
echo "Aufbewahrung: $RETENTION_DAYS Tage"
echo ""
echo "🔄 Wiederherstellung:"
echo "===================="
echo "tar -xzf hd-app-backup-$DATE.tar.gz"
echo "docker cp mongodb_$DATE hd-app_mongo_1:/tmp/restore"
echo "docker exec hd-app_mongo_1 mongorestore /tmp/restore"
