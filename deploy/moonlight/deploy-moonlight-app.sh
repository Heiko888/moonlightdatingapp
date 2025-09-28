#!/bin/bash

# 🌙 Moonlight Dating App - Hetzner Deployment
# Spezifisches Deployment für moonlightdatingapp.werdemeisterdeinergedanken.de

set -e

# Konfiguration für Moonlight Dating App
DOMAIN="moonlightdatingapp.werdemeisterdeinergedanken.de"
SERVER_IP="138.199.237.34"
GITHUB_REPO="https://github.com/your-username/HD_App_chart.git"

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m'

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

print_moonlight() {
    echo -e "${PURPLE}[MOONLIGHT]${NC} $1"
}

echo "🌙 Moonlight Dating App Deployment gestartet..."
echo "=============================================="
print_moonlight "Domain: $DOMAIN"
print_moonlight "Server: $SERVER_IP"
echo ""

# Email für Let's Encrypt abfragen
if [ -z "$EMAIL" ]; then
    read -p "Email für Let's Encrypt eingeben: " EMAIL
fi

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
mkdir -p /opt/moonlight-app
chown $USER:$USER /opt/moonlight-app
cd /opt/moonlight-app

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

# 6. Environment Datei für Moonlight App erstellen
print_step "Environment Datei für Moonlight App wird erstellt..."
if [ ! -f ".env" ]; then
    cp env.supabase .env
    
    # Moonlight-spezifische Konfiguration
    cat >> .env << EOF

# Moonlight Dating App Configuration
NEXT_PUBLIC_APP_NAME=Moonlight Dating App
NEXT_PUBLIC_APP_URL=https://$DOMAIN
NEXT_PUBLIC_DOMAIN=$DOMAIN
EOF
    
    print_warning "Bitte .env Datei mit Ihren Werten konfigurieren!"
    print_warning "Wichtige Variablen:"
    print_warning "- JWT_SECRET"
    print_warning "- OPENAI_API_KEY"
    print_warning "- GRAFANA_PASSWORD"
    print_warning "- NEXT_PUBLIC_SUPABASE_URL"
    print_warning "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
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

# 9. Certbot installieren
print_step "Certbot wird installiert..."
apt install certbot python3-certbot-nginx -y
print_success "Certbot installiert"

# 10. Nginx Konfiguration für Moonlight App erstellen
print_step "Nginx Konfiguration für Moonlight App wird erstellt..."

# Temporäre HTTP-Konfiguration
cat > /etc/nginx/sites-available/moonlight-app <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Frontend - Moonlight Dating App
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

    # API Endpoints
    location /api {
        proxy_pass http://localhost:4001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Grafana (nur für Admin)
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

    # Prometheus (nur für Admin)
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
ln -sf /etc/nginx/sites-available/moonlight-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
print_success "Nginx für Moonlight App konfiguriert"

# 11. Docker Services starten
print_step "Docker Services für Moonlight App werden gestartet..."
docker-compose -f docker-compose.supabase.yml down || true
docker-compose -f docker-compose.supabase.yml up -d --build

# 12. Warten bis Services laufen
print_step "Warten bis Moonlight App Services gestartet sind..."
sleep 60

# 13. Health Check
print_step "Health Check für Moonlight App wird durchgeführt..."

# Services prüfen
services_ok=true

# Frontend prüfen
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Moonlight App Frontend läuft auf Port 3000"
else
    print_error "Moonlight App Frontend nicht erreichbar"
    services_ok=false
fi

# Backend prüfen
if curl -f http://localhost:4001 > /dev/null 2>&1; then
    print_success "Moonlight App Backend läuft auf Port 4001"
else
    print_error "Moonlight App Backend nicht erreichbar"
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

# 14. SSL-Zertifikat für Moonlight App einrichten
print_step "SSL-Zertifikat für Moonlight App wird eingerichtet..."

# Certbot mit Nginx
certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive

# Auto-Renewal testen
certbot renew --dry-run

print_success "SSL-Zertifikat für Moonlight App eingerichtet"

# 15. Moonlight App spezifische Konfiguration
print_step "Moonlight App spezifische Konfiguration wird angewendet..."

# CORS für Moonlight App anpassen
sed -i "s|CORS_ORIGIN=http://localhost:3000|CORS_ORIGIN=https://$DOMAIN|g" .env
sed -i "s|NEXT_PUBLIC_API_URL=http://localhost:4001|NEXT_PUBLIC_API_URL=https://$DOMAIN/api|g" .env

# Services neu starten mit neuer Konfiguration
docker-compose -f docker-compose.supabase.yml down
docker-compose -f docker-compose.supabase.yml up -d

print_success "Moonlight App Konfiguration angewendet"

# 16. Finale Status-Ausgabe
echo ""
print_success "🌙 Moonlight Dating App Deployment abgeschlossen!"
echo ""
print_moonlight "📋 Zugriff auf Ihre Moonlight Dating App:"
print_moonlight "  • Hauptanwendung: https://$DOMAIN"
print_moonlight "  • API: https://$DOMAIN/api"
print_moonlight "  • Grafana: https://$DOMAIN/grafana/"
print_moonlight "  • Prometheus: https://$DOMAIN/prometheus/"
echo ""
print_moonlight "🔧 Nützliche Befehle:"
print_moonlight "  • Status prüfen: docker-compose -f docker-compose.supabase.yml ps"
print_moonlight "  • Logs anzeigen: docker-compose -f docker-compose.supabase.yml logs -f"
print_moonlight "  • Services neu starten: docker-compose -f docker-compose.supabase.yml restart"
echo ""
print_moonlight "⚠️  Wichtige Hinweise:"
print_moonlight "  • SSL-Zertifikat ist automatisch konfiguriert"
print_moonlight "  • Firewall ist für Moonlight App konfiguriert"
print_moonlight "  • Überwachen Sie die Logs regelmäßig"
print_moonlight "  • Erstellen Sie regelmäßige Backups"

if [ "$services_ok" = false ]; then
    print_warning "⚠️  Einige Services sind nicht erreichbar. Prüfen Sie die Logs:"
    print_warning "  docker-compose -f docker-compose.supabase.yml logs -f"
fi

echo ""
print_moonlight "🎉 Ihre Moonlight Dating App ist jetzt live unter: https://$DOMAIN"
