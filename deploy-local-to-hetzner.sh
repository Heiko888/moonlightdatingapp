#!/bin/bash

# ===========================================
# HD APP - LOKALE ÄNDERUNGEN AUF HETZNER DEPLOYEN
# ===========================================

set -e

# Konfiguration
SERVER_IP="${1:-138.199.237.34}"
USERNAME="${2:-root}"
SERVER_PATH="/opt/hd-app/HD_App_chart"

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Funktionen
print_header() {
    echo -e "${BLUE}🚀 HD App - Lokale Änderungen auf Hetzner Server deployen${NC}"
    echo -e "${CYAN}Server: ${WHITE}$SERVER_IP${NC}"
    echo -e "${CYAN}Benutzer: ${WHITE}$USERNAME${NC}"
    echo -e "${CYAN}Pfad: ${WHITE}$SERVER_PATH${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# SSH-Verbindung testen
test_ssh_connection() {
    print_step "Prüfe SSH-Verbindung..."
    if ssh -o ConnectTimeout=10 $USERNAME@$SERVER_IP "echo 'SSH-Verbindung erfolgreich'" > /dev/null 2>&1; then
        print_success "SSH-Verbindung erfolgreich"
    else
        print_error "SSH-Verbindung fehlgeschlagen. Bitte prüfen Sie:"
        echo -e "   ${WHITE}- Server-IP: $SERVER_IP${NC}"
        echo -e "   ${WHITE}- Benutzername: $USERNAME${NC}"
        echo -e "   ${WHITE}- SSH-Key oder Passwort${NC}"
        exit 1
    fi
}

# Git-Status prüfen und committen
handle_git_changes() {
    print_step "Prüfe lokale Git-Änderungen..."
    
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${CYAN}📝 Gefundene Änderungen:${NC}"
        git status --porcelain | while read line; do
            echo -e "   ${WHITE}$line${NC}"
        done
        echo ""
        
        # Commit-Nachricht abfragen
        read -p "💬 Commit-Nachricht eingeben (oder Enter für 'Deploy to Hetzner'): " commit_message
        if [ -z "$commit_message" ]; then
            commit_message="Deploy to Hetzner - $(date '+%Y-%m-%d %H:%M')"
        fi
        
        print_step "Committe Änderungen..."
        git add .
        git commit -m "$commit_message"
        
        # Push zu Repository
        print_step "Pushe zu Repository..."
        if git push origin main 2>/dev/null; then
            print_success "Änderungen gepusht"
        else
            print_warning "Push fehlgeschlagen (lokales Repository?)"
        fi
    else
        print_success "Keine lokalen Änderungen gefunden"
    fi
}

# Server-Verzeichnis vorbereiten
prepare_server_directory() {
    print_step "Bereite Server-Verzeichnis vor..."
    ssh $USERNAME@$SERVER_IP "mkdir -p $SERVER_PATH"
}

# Dateien übertragen
upload_files() {
    print_step "Übertrage Dateien..."
    
    # Wichtige Dateien
    local files=(
        "package.json"
        "docker-compose.supabase.yml"
        "env.supabase"
        "deploy-hetzner.sh"
        "ENTWICKLUNGS-UMGEBUNGEN.md"
        "backend/package.json"
        "backend/env.local"
        "backend/src/server-local.ts"
        "backend/src/server-supabase.ts"
        "frontend/package.json"
        "frontend/env.local"
        "frontend/next.config.ts"
        "frontend/postcss.config.mjs"
        "frontend/tailwind.config.js"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            echo -e "   ${GRAY}📄 $file${NC}"
            scp "$file" $USERNAME@$SERVER_IP:$SERVER_PATH/
        else
            echo -e "   ${YELLOW}⚠️  $file nicht gefunden${NC}"
        fi
    done
}

# Verzeichnisse übertragen
upload_directories() {
    print_step "Übertrage Verzeichnisse..."
    
    # Wichtige Verzeichnisse
    local dirs=(
        "backend/src"
        "backend/data"
        "backend/routes"
        "backend/lib"
        "backend/middleware"
        "backend/models"
        "backend/monitoring"
        "backend/websocket"
        "backend/services"
        "backend/utils"
        "frontend/app"
        "frontend/components"
        "frontend/lib"
        "frontend/hooks"
        "frontend/models"
        "frontend/types"
        "frontend/styles"
        "grafana"
        "prometheus"
        "alertmanager"
    )
    
    for dir in "${dirs[@]}"; do
        if [ -d "$dir" ]; then
            echo -e "   ${GRAY}📁 $dir${NC}"
            scp -r "$dir" $USERNAME@$SERVER_IP:$SERVER_PATH/
        else
            echo -e "   ${YELLOW}⚠️  $dir nicht gefunden${NC}"
        fi
    done
}

# Server-seitige Vorbereitung
prepare_server() {
    print_step "Bereite Server vor..."
    ssh $USERNAME@$SERVER_IP "cd $SERVER_PATH && chmod +x deploy-hetzner.sh && chmod +x *.sh"
}

# Docker-Container stoppen
stop_containers() {
    print_step "Stoppe laufende Container..."
    ssh $USERNAME@$SERVER_IP "cd $SERVER_PATH && docker-compose -f docker-compose.supabase.yml down 2>/dev/null || true"
}

# Environment-Datei prüfen
check_environment() {
    print_step "Prüfe Environment-Konfiguration..."
    ssh $USERNAME@$SERVER_IP "cd $SERVER_PATH && if [ ! -f .env ]; then echo '📝 Erstelle .env aus env.supabase...' && cp env.supabase .env && echo '✅ .env erstellt'; else echo '✅ .env bereits vorhanden'; fi"
}

# Services neu starten
restart_services() {
    print_step "Starte Services neu..."
    ssh $USERNAME@$SERVER_IP "cd $SERVER_PATH && echo '🐳 Baue Docker-Images neu...' && docker-compose -f docker-compose.supabase.yml build --no-cache && echo '🚀 Starte Services...' && docker-compose -f docker-compose.supabase.yml up -d && echo '⏳ Warte auf Services...' && sleep 30 && echo '🔍 Prüfe Service-Status...' && docker-compose -f docker-compose.supabase.yml ps"
}

# Health Check
health_check() {
    print_step "Führe Health Check durch..."
    ssh $USERNAME@$SERVER_IP "cd $SERVER_PATH && echo '🔍 Prüfe Frontend...' && (curl -f http://localhost:3000 > /dev/null 2>&1 && echo '✅ Frontend: OK' || echo '❌ Frontend: Fehler') && echo '🔍 Prüfe Backend...' && (curl -f http://localhost:4001/health > /dev/null 2>&1 && echo '✅ Backend: OK' || echo '❌ Backend: Fehler') && echo '🔍 Prüfe Grafana...' && (curl -f http://localhost:3001 > /dev/null 2>&1 && echo '✅ Grafana: OK' || echo '❌ Grafana: Fehler')"
}

# Zusammenfassung
show_summary() {
    echo ""
    echo -e "${GREEN}🎉 Deployment abgeschlossen!${NC}"
    echo ""
    echo -e "${CYAN}📋 Service-URLs:${NC}"
    echo -e "   ${WHITE}• Hauptanwendung: http://$SERVER_IP${NC}"
    echo -e "   ${WHITE}• Backend API: http://$SERVER_IP:4001${NC}"
    echo -e "   ${WHITE}• Grafana: http://$SERVER_IP:3001${NC}"
    echo -e "   ${WHITE}• Prometheus: http://$SERVER_IP:9090${NC}"
    echo ""
    echo -e "${CYAN}🔧 Nützliche Befehle:${NC}"
    echo -e "   ${WHITE}• Logs anzeigen: ssh $USERNAME@$SERVER_IP 'cd $SERVER_PATH && docker-compose -f docker-compose.supabase.yml logs -f'${NC}"
    echo -e "   ${WHITE}• Status prüfen: ssh $USERNAME@$SERVER_IP 'cd $SERVER_PATH && docker-compose -f docker-compose.supabase.yml ps'${NC}"
    echo -e "   ${WHITE}• Services stoppen: ssh $USERNAME@$SERVER_IP 'cd $SERVER_PATH && docker-compose -f docker-compose.supabase.yml down'${NC}"
    echo -e "   ${WHITE}• Services starten: ssh $USERNAME@$SERVER_IP 'cd $SERVER_PATH && docker-compose -f docker-compose.supabase.yml up -d'${NC}"
    echo ""
    echo -e "${CYAN}📝 Environment-Datei bearbeiten:${NC}"
    echo -e "   ${WHITE}ssh $USERNAME@$SERVER_IP 'cd $SERVER_PATH && nano .env'${NC}"
    echo ""
    echo -e "${GREEN}✅ Alle lokalen Änderungen wurden erfolgreich auf den Hetzner-Server übertragen!${NC}"
}

# Hauptfunktion
main() {
    print_header
    test_ssh_connection
    handle_git_changes
    prepare_server_directory
    upload_files
    upload_directories
    prepare_server
    stop_containers
    check_environment
    restart_services
    health_check
    show_summary
}

# Script ausführen
main "$@"
