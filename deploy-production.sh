#!/bin/bash

# 🚀 HD App - Production Deployment Script
# Vollständiges Deployment für Production-Umgebung

set -e  # Exit on any error

echo "🚀 HD App - Production Deployment wird gestartet..."
echo "=================================================="

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

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

log_step() {
    echo -e "${PURPLE}🔧 $1${NC}"
}

# Prüfe ob .env.production existiert
if [ ! -f "env.production" ]; then
    log_error "env.production Datei nicht gefunden!"
    log_info "Bitte erstellen Sie eine env.production Datei basierend auf env.production.template"
    exit 1
fi

# Lade Environment-Variablen
log_step "Lade Environment-Variablen..."
source env.production
log_success "Environment-Variablen geladen"

# Schritt 1: System-Informationen
log_step "System-Informationen werden angezeigt..."
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "Kernel: $(uname -r)"
echo "Architektur: $(uname -m)"
echo "Docker Version: $(docker --version)"
echo "Docker Compose Version: $(docker-compose --version)"
echo ""

# Schritt 2: Dependencies prüfen und installieren
log_step "Dependencies werden geprüft..."

# Docker installieren (falls nicht vorhanden)
if ! command -v docker &> /dev/null; then
    log_info "Docker wird installiert..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl start docker
    systemctl enable docker
    usermod -aG docker $USER
    log_success "Docker installiert"
else
    log_success "Docker bereits installiert"
fi

# Docker Compose installieren (falls nicht vorhanden)
if ! command -v docker-compose &> /dev/null; then
    log_info "Docker Compose wird installiert..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log_success "Docker Compose installiert"
else
    log_success "Docker Compose bereits installiert"
fi

# Schritt 3: Firewall konfigurieren
log_step "Firewall wird konfiguriert..."
ufw --force enable
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw allow 3000  # Frontend
ufw allow 3001  # Grafana
ufw allow 9090  # Prometheus
ufw allow 9100  # Node Exporter
log_success "Firewall konfiguriert"

# Schritt 4: Verzeichnis für HD App erstellen
log_step "Verzeichnis für HD App wird erstellt..."
mkdir -p /opt/hd-app
cd /opt/hd-app
log_success "Verzeichnis /opt/hd-app erstellt"

# Schritt 5: Repository klonen oder aktualisieren
if [ ! -d ".git" ]; then
    log_warning "Repository nicht gefunden. Bitte klonen Sie Ihr Repository:"
    echo "git clone <your-repo-url> ."
    echo "Dann kopieren Sie die env.production Datei hierher."
    exit 1
else
    log_info "Repository wird aktualisiert..."
    git pull origin main
    log_success "Repository aktualisiert"
fi

# Schritt 6: Environment-Datei kopieren
log_step "Environment-Datei wird konfiguriert..."
if [ -f "env.production" ]; then
    cp env.production .env
    log_success "Environment-Datei konfiguriert"
else
    log_error "env.production Datei nicht gefunden!"
    exit 1
fi

# Schritt 7: Docker Images bauen
log_step "Docker Images werden gebaut..."
docker-compose -f docker-compose.prod.yml build --no-cache --parallel
log_success "Docker Images gebaut"

# Schritt 8: Alte Container stoppen
log_step "Alte Container werden gestoppt..."
docker-compose -f docker-compose.prod.yml down --remove-orphans
log_success "Alte Container gestoppt"

# Schritt 9: Services starten
log_step "Services werden gestartet..."
docker-compose -f docker-compose.prod.yml up -d
log_success "Services gestartet"

# Schritt 10: Warten auf Services
log_step "Warten auf Services..."
sleep 60

# Schritt 11: Health Check
log_step "Health Check wird durchgeführt..."

# Prüfe Services
services=("hd-backend:4001" "hd-frontend:3000" "grafana:3001" "prometheus:9090" "node-exporter:9100")
for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if curl -f -s http://localhost:$port > /dev/null 2>&1; then
        log_success "$name ist erreichbar (Port $port)"
    else
        log_warning "$name ist nicht erreichbar (Port $port) - prüfen Sie die Logs"
    fi
done

# Schritt 12: Nginx-Konfiguration (falls gewünscht)
read -p "Möchten Sie Nginx als Reverse Proxy konfigurieren? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_step "Nginx wird konfiguriert..."
    
    # Nginx installieren
    if ! command -v nginx &> /dev/null; then
        apt update
        apt install nginx -y
        systemctl start nginx
        systemctl enable nginx
    fi
    
    # Nginx-Konfiguration erstellen
    cat > /etc/nginx/sites-available/hd-app << EOF
server {
    listen 80;
    server_name _;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # API Routes
    location /api {
        proxy_pass http://localhost:4001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Grafana
    location /grafana {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Prometheus
    location /prometheus {
        proxy_pass http://localhost:9090;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    # Nginx-Konfiguration aktivieren
    ln -sf /etc/nginx/sites-available/hd-app /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t
    systemctl reload nginx
    log_success "Nginx konfiguriert"
fi

# Schritt 13: Status anzeigen
log_step "Deployment Status:"
echo "==================="
docker-compose -f docker-compose.prod.yml ps

echo ""
log_success "🎉 HD App Production Deployment abgeschlossen!"
echo ""
echo "🌐 Verfügbare URLs:"
echo "==================="
echo "Frontend:  http://$(hostname -I | awk '{print $1}'):3000"
echo "Backend:   http://$(hostname -I | awk '{print $1}'):4001"
echo "Grafana:   http://$(hostname -I | awk '{print $1}'):3001"
echo "Prometheus: http://$(hostname -I | awk '{print $1}'):9090"
echo "Node Exporter: http://$(hostname -I | awk '{print $1}'):9100"
echo ""
echo "📊 Nützliche Befehle:"
echo "====================="
echo "Logs anzeigen:    docker-compose -f docker-compose.prod.yml logs -f"
echo "Services stoppen: docker-compose -f docker-compose.prod.yml down"
echo "Services starten: docker-compose -f docker-compose.prod.yml up -d"
echo "Status prüfen:    docker-compose -f docker-compose.prod.yml ps"
echo "Container updaten: docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "🔧 Nächste Schritte:"
echo "===================="
echo "1. SSL-Zertifikat einrichten: certbot --nginx -d your-domain.com"
echo "2. Domain konfigurieren"
echo "3. Backup-Strategie implementieren"
echo "4. Monitoring-Dashboards konfigurieren"
echo "5. Logs überwachen"
echo ""
log_success "Der Server ist bereit für die HD App Production!"
