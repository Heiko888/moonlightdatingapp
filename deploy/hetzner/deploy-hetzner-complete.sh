#!/bin/bash

# 🚀 HD App - Komplettes Hetzner Deployment mit SSL
# Für Server: 138.199.237.34

set -e

echo "🚀 HD App - Komplettes Hetzner Deployment gestartet..."
echo "=================================================="

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funktionen für farbige Ausgabe
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

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

# Parameter prüfen
DOMAIN="moonlightdatingapp.werdemeisterdeinergedanken.de"
EMAIL=""
GITHUB_REPO="https://github.com/Heiko888/moonlightdatingapp.git"

while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--domain)
            DOMAIN="$2"
            shift 2
            ;;
        -e|--email)
            EMAIL="$2"
            shift 2
            ;;
        -r|--repo)
            GITHUB_REPO="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -d, --domain DOMAIN    Domain für SSL (z.B. hd-app.example.com)"
            echo "  -e, --email EMAIL      Email für Let's Encrypt"
            echo "  -r, --repo REPO        GitHub Repository URL"
            echo "  -h, --help            Diese Hilfe anzeigen"
            exit 0
            ;;
        *)
            print_error "Unbekannter Parameter: $1"
            exit 1
            ;;
    esac
done

# Domain und Email abfragen falls nicht angegeben
if [ -z "$DOMAIN" ]; then
    read -p "Domain eingeben (z.B. hd-app.example.com): " DOMAIN
fi

if [ -z "$EMAIL" ]; then
    read -p "Email für Let's Encrypt eingeben: " EMAIL
fi

print_info "Deployment-Konfiguration:"
print_info "  Domain: $DOMAIN"
print_info "  Email: $EMAIL"
print_info "  Repository: $GITHUB_REPO"
echo ""

# 1. System aktualisieren
print_step "System wird aktualisiert..."
apt update && apt upgrade -y
print_success "System aktualisiert"

# 2. Docker installieren
print_step "Docker wird installiert..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $USER
    print_success "Docker installiert"
else
    print_success "Docker bereits installiert"
fi

# Docker Compose installieren
print_step "Docker Compose wird installiert..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installiert"
else
    print_success "Docker Compose bereits installiert"
fi

# 3. Git installieren
print_step "Git wird installiert..."
apt install git -y
print_success "Git installiert"

# 4. App Verzeichnis erstellen
print_step "App Verzeichnis wird erstellt..."
mkdir -p /opt/hd-app
chown $USER:$USER /opt/hd-app
cd /opt/hd-app

# 5. Repository klonen
if [ ! -d "HD_App_chart" ]; then
    print_step "Repository wird geklont..."
    git clone $GITHUB_REPO
    cd HD_App_chart
else
    print_step "Repository wird aktualisiert..."
    cd HD_App_chart
    git pull origin main
fi

# 6. Environment Datei erstellen
print_step "Environment Datei wird erstellt..."
if [ ! -f ".env" ]; then
    cp env.supabase .env
    print_warning "Bitte .env Datei mit Ihren Werten konfigurieren!"
    print_warning "Wichtige Variablen:"
    print_warning "- JWT_SECRET (mindestens 32 Zeichen)"
    print_warning "- OPENAI_API_KEY"
    print_warning "- GRAFANA_PASSWORD"
    print_warning "- SUPABASE_SERVICE_ROLE_KEY"
    print_warning "- ALERT_EMAIL"
    print_warning "- SMTP_Konfiguration für Alerts"
    read -p "Drücken Sie Enter, wenn Sie die .env Datei konfiguriert haben..."
fi

# 7. Firewall konfigurieren
print_step "Firewall wird konfiguriert..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 3001/tcp
ufw allow 9090/tcp
ufw allow 9100/tcp
ufw --force enable
print_success "Firewall konfiguriert"

# 8. Nginx installieren
print_step "Nginx wird installiert..."
apt install nginx -y
print_success "Nginx installiert"

# 9. Certbot installieren (für SSL)
print_step "Certbot wird installiert..."
apt install certbot python3-certbot-nginx -y
print_success "Certbot installiert"

# 10. Nginx Konfiguration erstellen
print_step "Nginx Konfiguration wird erstellt..."

# Temporäre HTTP-Konfiguration
cat > /etc/nginx/sites-available/hd-app <<EOF
server {
    listen 80;
    server_name $DOMAIN;

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

    # Grafana
    location /grafana/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Prometheus
    location /prometheus/ {
        proxy_pass http://localhost:9090/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Nginx Site aktivieren
ln -sf /etc/nginx/sites-available/hd-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
print_success "Nginx konfiguriert"

# 11. Docker Services starten
print_step "Docker Services werden gestartet..."
docker-compose -f docker-compose.supabase.yml down || true
docker-compose -f docker-compose.supabase.yml up -d --build

# 12. Warten bis Services laufen
print_step "Warten bis Services gestartet sind..."
sleep 60

# 13. Health Check
print_step "Health Check wird durchgeführt..."

# Services prüfen
services_ok=true

# Frontend prüfen
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend läuft auf Port 3000"
else
    print_error "Frontend nicht erreichbar"
    services_ok=false
fi

# Grafana prüfen
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    print_success "Grafana läuft auf Port 3001"
else
    print_error "Grafana nicht erreichbar"
    services_ok=false
fi

# Prometheus prüfen
if curl -f http://localhost:9090 > /dev/null 2>&1; then
    print_success "Prometheus läuft auf Port 9090"
else
    print_error "Prometheus nicht erreichbar"
    services_ok=false
fi

# 14. SSL-Zertifikat einrichten (nur wenn Domain angegeben)
if [ ! -z "$DOMAIN" ] && [ ! -z "$EMAIL" ]; then
    print_step "SSL-Zertifikat wird eingerichtet..."
    
    # Certbot mit Nginx
    certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive
    
    # Auto-Renewal testen
    certbot renew --dry-run
    
    print_success "SSL-Zertifikat eingerichtet"
else
    print_warning "SSL-Setup übersprungen (keine Domain/Email angegeben)"
fi

# 15. Finale Status-Ausgabe
echo ""
print_success "🎉 Deployment abgeschlossen!"
echo ""
print_info "📋 Zugriff auf Ihre Services:"
if [ ! -z "$DOMAIN" ]; then
    print_info "  • Hauptanwendung: https://$DOMAIN"
    print_info "  • Grafana: https://$DOMAIN/grafana/"
    print_info "  • Prometheus: https://$DOMAIN/prometheus/"
else
    print_info "  • Hauptanwendung: http://$(curl -s ifconfig.me)"
    print_info "  • Grafana: http://$(curl -s ifconfig.me)/grafana/"
    print_info "  • Prometheus: http://$(curl -s ifconfig.me)/prometheus/"
fi
echo ""
print_info "🔧 Nützliche Befehle:"
print_info "  • Status prüfen: docker-compose -f docker-compose.supabase.yml ps"
print_info "  • Logs anzeigen: docker-compose -f docker-compose.supabase.yml logs -f"
print_info "  • Services stoppen: docker-compose -f docker-compose.supabase.yml down"
print_info "  • Services neu starten: docker-compose -f docker-compose.supabase.yml up -d"
print_info "  • Supabase Status: curl -f http://localhost:3000/api/health"
echo ""
print_info "⚠️  Wichtige Hinweise:"
print_info "  • Überwachen Sie die Logs regelmäßig"
print_info "  • Erstellen Sie regelmäßige Backups"
print_info "  • SSL-Zertifikat wird automatisch erneuert"
print_info "  • Firewall ist konfiguriert und aktiv"

if [ "$services_ok" = false ]; then
    print_warning "⚠️  Einige Services sind nicht erreichbar. Prüfen Sie die Logs:"
    print_warning "  docker-compose -f docker-compose.supabase.yml logs -f"
    print_warning "  • Supabase-Verbindung prüfen: curl -f http://localhost:3000/api/health"
    print_warning "  • Grafana prüfen: curl -f http://localhost:3001"
    print_warning "  • Prometheus prüfen: curl -f http://localhost:9090"
fi
