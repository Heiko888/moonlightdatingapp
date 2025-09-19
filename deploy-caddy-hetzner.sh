#!/bin/bash

# 🚀 HD App - Caddy Deployment auf Hetzner Server
# Für Server: 138.199.237.34

set -e  # Exit on any error

echo "🚀 HD App - Caddy Deployment auf Hetzner Server..."
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

# Schritt 1: System-Informationen
log_info "System-Informationen werden angezeigt..."
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "Kernel: $(uname -r)"
echo "Architektur: $(uname -m)"
echo ""

# Schritt 2: System aktualisieren
log_step "System wird aktualisiert..."
apt update && apt upgrade -y
log_success "System aktualisiert"
echo ""

# Schritt 3: Caddy installieren
log_step "Caddy wird installiert..."

if ! command -v caddy &> /dev/null; then
    log_info "Caddy wird installiert..."
    
    # Caddy Repository hinzufügen
    apt install -y debian-keyring debian-archive-keyring apt-transport-https
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
    apt update
    apt install caddy -y
    
    log_success "Caddy installiert"
else
    log_success "Caddy bereits installiert"
fi

# Caddy Version anzeigen
caddy version
echo ""

# Schritt 4: Docker installieren
log_step "Docker wird installiert..."

if ! command -v docker &> /dev/null; then
    log_info "Docker wird installiert..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl start docker
    systemctl enable docker
    log_success "Docker installiert"
else
    log_success "Docker bereits installiert"
fi

# Docker Compose installieren
if ! command -v docker-compose &> /dev/null; then
    log_info "Docker Compose wird installiert..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log_success "Docker Compose installiert"
else
    log_success "Docker Compose bereits installiert"
fi

echo ""

# Schritt 5: Node.js installieren
log_step "Node.js wird installiert..."

if ! command -v node &> /dev/null; then
    log_info "Node.js wird installiert..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    apt-get install -y nodejs
    log_success "Node.js installiert"
else
    log_success "Node.js bereits installiert"
fi

# Git installieren
if ! command -v git &> /dev/null; then
    log_info "Git wird installiert..."
    apt install git -y
    log_success "Git installiert"
else
    log_success "Git bereits installiert"
fi

echo ""

# Schritt 6: Firewall konfigurieren
log_step "Firewall wird konfiguriert..."
ufw --force enable
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw allow 3000  # Frontend (temporär)
ufw allow 3001  # Grafana
ufw allow 9090  # Prometheus
log_success "Firewall konfiguriert"
echo ""

# Schritt 7: Verzeichnis für HD App erstellen
log_step "Verzeichnis für HD App wird erstellt..."
mkdir -p /opt/hd-app
cd /opt/hd-app
log_success "Verzeichnis /opt/hd-app erstellt"

# Schritt 8: Repository klonen (falls nicht vorhanden)
if [ ! -d ".git" ]; then
    log_warning "Repository muss geklont werden:"
    echo "git clone <your-repo-url> ."
    echo ""
else
    log_info "Repository wird aktualisiert..."
    git pull origin main
    log_success "Repository aktualisiert"
fi

# Schritt 9: Environment-Datei erstellen
log_step "Environment-Datei wird erstellt..."
cat > .env << EOF
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/hdapp
JWT_SECRET=your-super-secret-jwt-key-$(date +%s)
OPENAI_API_KEY=your-openai-key-here
GRAFANA_PASSWORD=admin123
NEXT_PUBLIC_API_URL=https://your-domain.com
EOF
log_success "Environment-Datei erstellt"

# Schritt 10: Caddyfile erstellen
log_step "Caddyfile wird erstellt..."
cat > /etc/caddy/Caddyfile << 'EOF'
# HD App Caddyfile
# Ersetzen Sie 'your-domain.com' mit Ihrer tatsächlichen Domain

# Hauptdomain
your-domain.com {
    # Next.js App
    reverse_proxy localhost:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
        
        # Health Check
        health_uri /api/health
        health_interval 30s
        health_timeout 5s
    }
    
    # Security Headers
    header {
        # HSTS
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        
        # Content Security Policy
        Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
        
        # X-Frame-Options
        X-Frame-Options "SAMEORIGIN"
        
        # X-Content-Type-Options
        X-Content-Type-Options "nosniff"
        
        # Referrer Policy
        Referrer-Policy "strict-origin-when-cross-origin"
    }
    
    # Gzip Compression
    encode gzip
    
    # Logging
    log {
        output file /var/log/caddy/hd-app.log
        format json
        level INFO
    }
    
    # Rate Limiting
    rate_limit {
        zone static {
            key {remote_host}
            events 100
            window 1m
        }
    }
}

# IP-basierter Zugriff (temporär für Tests)
138.199.237.34 {
    reverse_proxy localhost:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Internes TLS für Tests
    tls internal
}

# Grafana Subdomain
grafana.your-domain.com {
    reverse_proxy localhost:3001 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Basic Auth für zusätzliche Sicherheit
    basicauth {
        admin $2a$14$your-hashed-password-here
    }
    
    # Grafana-spezifische Headers
    header {
        X-Frame-Options "SAMEORIGIN"
    }
}

# Prometheus Subdomain
prometheus.your-domain.com {
    reverse_proxy localhost:9090 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Basic Auth für zusätzliche Sicherheit
    basicauth {
        admin $2a$14$your-hashed-password-here
    }
}

# API Subdomain (optional)
api.your-domain.com {
    reverse_proxy localhost:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # API-spezifische Headers
    header {
        Access-Control-Allow-Origin "*"
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Content-Type, Authorization"
    }
}

# Caddy Metriken (optional)
:2019/metrics {
    prometheus
}
EOF
log_success "Caddyfile erstellt"

# Schritt 11: Log-Verzeichnis erstellen
log_step "Log-Verzeichnis wird erstellt..."
mkdir -p /var/log/caddy
chown caddy:caddy /var/log/caddy
log_success "Log-Verzeichnis erstellt"

# Schritt 12: Docker Compose mit Caddy erstellen
log_step "Docker Compose mit Caddy wird erstellt..."
cat > docker-compose.caddy.yml << 'EOF'
version: '3.8'

services:
  # HD App (Next.js Full-Stack)
  hd-app:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/hdapp
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    depends_on:
      - mongo
    networks:
      - hd-network
    restart: unless-stopped

  # MongoDB
  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - hd-network
    restart: unless-stopped

  # Grafana
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_SERVER_ROOT_URL=https://grafana.your-domain.com
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - hd-network
    restart: unless-stopped

  # Prometheus
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - hd-network
    restart: unless-stopped

volumes:
  mongo_data:
  grafana_data:
  prometheus_data:

networks:
  hd-network:
    driver: bridge
EOF
log_success "Docker Compose mit Caddy erstellt"

# Schritt 13: Caddy konfigurieren und starten
log_step "Caddy wird konfiguriert und gestartet..."

# Caddy Konfiguration validieren
caddy validate --config /etc/caddy/Caddyfile
log_success "Caddy-Konfiguration ist gültig"

# Caddy starten
systemctl enable caddy
systemctl start caddy
systemctl status caddy --no-pager
log_success "Caddy gestartet"

echo ""

# Schritt 14: Docker Images bauen und starten
log_step "Docker Images werden gebaut..."
docker-compose -f docker-compose.caddy.yml build --no-cache
log_success "Docker Images gebaut"

log_step "Services werden gestartet..."
docker-compose -f docker-compose.caddy.yml down
docker-compose -f docker-compose.caddy.yml up -d
log_success "Services gestartet"

echo ""

# Schritt 15: Health Check
log_step "Health Check wird durchgeführt..."
sleep 30

# Prüfe Services
services=("hd-app:3000" "grafana:3001" "prometheus:9090")
for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if curl -f -s http://localhost:$port > /dev/null; then
        log_success "$name ist erreichbar (Port $port)"
    else
        log_error "$name ist nicht erreichbar (Port $port)"
    fi
done

# Caddy Status prüfen
if systemctl is-active --quiet caddy; then
    log_success "Caddy läuft"
else
    log_error "Caddy läuft nicht"
fi

echo ""

# Schritt 16: Status anzeigen
log_info "Deployment Status:"
echo "==================="
docker-compose -f docker-compose.caddy.yml ps

echo ""
log_success "🎉 HD App mit Caddy Deployment abgeschlossen!"
echo ""
echo "🌐 Verfügbare URLs:"
echo "==================="
echo "HD App (Domain):  https://your-domain.com"
echo "HD App (IP):      https://138.199.237.34 (temporär)"
echo "Grafana:          https://grafana.your-domain.com"
echo "Prometheus:       https://prometheus.your-domain.com"
echo "API:              https://api.your-domain.com"
echo ""
echo "📊 Nützliche Befehle:"
echo "====================="
echo "Caddy Status:     systemctl status caddy"
echo "Caddy Logs:       journalctl -u caddy -f"
echo "Caddy Reload:     caddy reload --config /etc/caddy/Caddyfile"
echo "Caddy Validate:   caddy validate --config /etc/caddy/Caddyfile"
echo "App Logs:         docker-compose -f docker-compose.caddy.yml logs -f"
echo "Services Status:  docker-compose -f docker-compose.caddy.yml ps"
echo ""
echo "🔧 Nächste Schritte:"
echo "===================="
echo "1. Domain in Caddyfile anpassen (your-domain.com → echte Domain)"
echo "2. DNS auf Server zeigen lassen"
echo "3. SSL wird automatisch eingerichtet!"
echo "4. Basic Auth Passwörter in Caddyfile setzen"
echo "5. Environment-Variablen in .env anpassen"
echo ""
echo "🔒 SSL Features:"
echo "================"
echo "✅ Automatisches Let's Encrypt SSL"
echo "✅ HTTP → HTTPS Weiterleitung"
echo "✅ HTTP/2 und HTTP/3 Support"
echo "✅ Automatische Zertifikatserneuerung"
echo ""
log_success "Der Server ist bereit für die HD App mit Caddy!"
