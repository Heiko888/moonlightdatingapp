#!/bin/bash

# HD App Deployment Script für Hetzner Server
# Dieses Script installiert und startet die HD App auf einem Hetzner Server

set -e

echo "🚀 HD App Deployment auf Hetzner Server gestartet..."

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funktion für farbige Ausgabe
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

# System aktualisieren
print_step "System wird aktualisiert..."
sudo apt update && sudo apt upgrade -y

# Docker installieren
print_step "Docker wird installiert..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    print_success "Docker installiert"
else
    print_success "Docker bereits installiert"
fi

# Docker Compose installieren
print_step "Docker Compose wird installiert..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installiert"
else
    print_success "Docker Compose bereits installiert"
fi

# Git installieren
print_step "Git wird installiert..."
sudo apt install git -y

# App Verzeichnis erstellen
print_step "App Verzeichnis wird erstellt..."
sudo mkdir -p /opt/hd-app
sudo chown $USER:$USER /opt/hd-app
cd /opt/hd-app

# Repository klonen (falls noch nicht vorhanden)
if [ ! -d "HD_App_chart" ]; then
    print_step "Repository wird geklont..."
    git clone https://github.com/IhrUsername/HD_App_chart.git
    cd HD_App_chart
else
    print_step "Repository wird aktualisiert..."
    cd HD_App_chart
    git pull origin main
fi

# Environment Datei erstellen
print_step "Environment Datei wird erstellt..."
if [ ! -f ".env" ]; then
    cp env.supabase .env
    print_warning "Bitte .env Datei mit Ihren Werten konfigurieren!"
    print_warning "Wichtige Variablen:"
    print_warning "- JWT_SECRET"
    print_warning "- OPENAI_API_KEY"
    print_warning "- GRAFANA_PASSWORD"
    print_warning "- NEXT_PUBLIC_SUPABASE_URL"
    print_warning "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
    read -p "Drücken Sie Enter, wenn Sie die .env Datei konfiguriert haben..."
fi

# Firewall konfigurieren
print_step "Firewall wird konfiguriert..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
sudo ufw allow 9090/tcp
sudo ufw allow 9100/tcp
sudo ufw --force enable

# Nginx installieren und konfigurieren
print_step "Nginx wird installiert..."
sudo apt install nginx -y

# Nginx Konfiguration erstellen
print_step "Nginx Konfiguration wird erstellt..."
sudo tee /etc/nginx/sites-available/hd-app > /dev/null <<EOF
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
sudo ln -sf /etc/nginx/sites-available/hd-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Docker Services starten
print_step "Docker Services werden gestartet..."
docker-compose -f docker-compose.supabase.yml down || true
docker-compose -f docker-compose.supabase.yml up -d --build

# Health Check
print_step "Health Check wird durchgeführt..."
sleep 30

# Services prüfen
print_step "Services werden geprüft..."

# Frontend prüfen
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend läuft auf Port 3000"
else
    print_error "Frontend nicht erreichbar"
fi

# Grafana prüfen
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    print_success "Grafana läuft auf Port 3001"
else
    print_error "Grafana nicht erreichbar"
fi

# Prometheus prüfen
if curl -f http://localhost:9090 > /dev/null 2>&1; then
    print_success "Prometheus läuft auf Port 9090"
else
    print_error "Prometheus nicht erreichbar"
fi

# Deployment Status
print_success "🎉 Deployment abgeschlossen!"
echo ""
echo "📋 Zugriff auf Ihre Services:"
echo "  • Hauptanwendung: http://$(curl -s ifconfig.me)"
echo "  • Grafana: http://$(curl -s ifconfig.me)/grafana/"
echo "  • Prometheus: http://$(curl -s ifconfig.me)/prometheus/"
echo ""
echo "🔧 Nützliche Befehle:"
echo "  • Status prüfen: docker-compose -f docker-compose.supabase.yml ps"
echo "  • Logs anzeigen: docker-compose -f docker-compose.supabase.yml logs -f"
echo "  • Services stoppen: docker-compose -f docker-compose.supabase.yml down"
echo "  • Services neu starten: docker-compose -f docker-compose.supabase.yml up -d"
echo ""
echo "⚠️  Wichtige Hinweise:"
echo "  • Konfigurieren Sie SSL/HTTPS für Produktion"
echo "  • Setzen Sie starke Passwörter in der .env Datei"
echo "  • Überwachen Sie die Logs regelmäßig"
echo "  • Erstellen Sie regelmäßige Backups"