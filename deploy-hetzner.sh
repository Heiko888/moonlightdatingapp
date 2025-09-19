#!/bin/bash

# 🚀 HD App - Hetzner Server Deployment Script
# Für Server: 138.199.237.34

set -e  # Exit on any error

echo "🚀 HD App - Hetzner Deployment wird gestartet..."
echo "================================================"

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Schritt 1: System-Informationen
log_info "System-Informationen werden angezeigt..."
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "Kernel: $(uname -r)"
echo "Architektur: $(uname -m)"
echo ""

# Schritt 2: Dependencies installieren
log_info "Dependencies werden installiert..."

# Docker installieren (falls nicht vorhanden)
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

# Docker Compose installieren (falls nicht vorhanden)
if ! command -v docker-compose &> /dev/null; then
    log_info "Docker Compose wird installiert..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log_success "Docker Compose installiert"
else
    log_success "Docker Compose bereits installiert"
fi

# Node.js installieren (falls nicht vorhanden)
if ! command -v node &> /dev/null; then
    log_info "Node.js wird installiert..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    apt-get install -y nodejs
    log_success "Node.js installiert"
else
    log_success "Node.js bereits installiert"
fi

# Nginx installieren (falls nicht vorhanden)
if ! command -v nginx &> /dev/null; then
    log_info "Nginx wird installiert..."
    apt install nginx -y
    systemctl start nginx
    systemctl enable nginx
    log_success "Nginx installiert"
else
    log_success "Nginx bereits installiert"
fi

# Git installieren (falls nicht vorhanden)
if ! command -v git &> /dev/null; then
    log_info "Git wird installiert..."
    apt install git -y
    log_success "Git installiert"
else
    log_success "Git bereits installiert"
fi

echo ""

# Schritt 3: Firewall konfigurieren
log_info "Firewall wird konfiguriert..."
ufw --force enable
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw allow 3000  # Frontend (temporär)
ufw allow 3001  # Grafana
ufw allow 9090  # Prometheus
log_success "Firewall konfiguriert"

echo ""

# Schritt 4: Verzeichnis für HD App erstellen
log_info "Verzeichnis für HD App wird erstellt..."
mkdir -p /opt/hd-app
cd /opt/hd-app
log_success "Verzeichnis /opt/hd-app erstellt"

# Schritt 5: Repository klonen (falls nicht vorhanden)
if [ ! -d ".git" ]; then
    log_info "Repository wird geklont..."
    # Hier müssen Sie Ihr Repository-URL einfügen
    # git clone https://github.com/your-username/HD_App_chart.git .
    log_warning "Bitte klonen Sie Ihr Repository manuell:"
    echo "git clone <your-repo-url> ."
    echo ""
else
    log_info "Repository wird aktualisiert..."
    git pull origin main
    log_success "Repository aktualisiert"
fi

# Schritt 6: Environment-Datei erstellen
log_info "Environment-Datei wird erstellt..."
cat > .env << EOF
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/hdapp
JWT_SECRET=your-super-secret-jwt-key-$(date +%s)
OPENAI_API_KEY=your-openai-key-here
GRAFANA_PASSWORD=admin123
NEXT_PUBLIC_API_URL=http://138.199.237.34:3000
EOF
log_success "Environment-Datei erstellt"

# Schritt 7: Docker Compose Production-Datei erstellen
log_info "Docker Compose Production-Konfiguration wird erstellt..."
cat > docker-compose.prod.yml << 'EOF'
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
log_success "Docker Compose Production-Konfiguration erstellt"

# Schritt 8: Nginx-Konfiguration erstellen
log_info "Nginx-Konfiguration wird erstellt..."
cat > /etc/nginx/sites-available/hd-app << 'EOF'
server {
    listen 80;
    server_name 138.199.237.34;
    
    # Next.js App
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Next.js spezifische Headers
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
    }
    
    # API Routes
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static Assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Nginx-Konfiguration aktivieren
ln -sf /etc/nginx/sites-available/hd-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
log_success "Nginx-Konfiguration erstellt und aktiviert"

echo ""

# Schritt 9: Docker Images bauen und starten
log_info "Docker Images werden gebaut..."
docker-compose -f docker-compose.prod.yml build --no-cache
log_success "Docker Images gebaut"

log_info "Services werden gestartet..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
log_success "Services gestartet"

echo ""

# Schritt 10: Health Check
log_info "Health Check wird durchgeführt..."
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

echo ""

# Schritt 11: Status anzeigen
log_info "Deployment Status:"
echo "==================="
docker-compose -f docker-compose.prod.yml ps

echo ""
log_success "🎉 HD App Deployment abgeschlossen!"
echo ""
echo "🌐 Verfügbare URLs:"
echo "==================="
echo "Frontend:  http://138.199.237.34:3000"
echo "Grafana:   http://138.199.237.34:3001 (admin/admin123)"
echo "Prometheus: http://138.199.237.34:9090"
echo ""
echo "📊 Nützliche Befehle:"
echo "====================="
echo "Logs anzeigen:    docker-compose -f docker-compose.prod.yml logs -f"
echo "Services stoppen: docker-compose -f docker-compose.prod.yml down"
echo "Services starten: docker-compose -f docker-compose.prod.yml up -d"
echo "Status prüfen:    docker-compose -f docker-compose.prod.yml ps"
echo ""
echo "🔧 Nächste Schritte:"
echo "===================="
echo "1. Repository klonen: git clone <your-repo-url> ."
echo "2. Environment-Variablen anpassen: nano .env"
echo "3. SSL-Zertifikat einrichten: certbot --nginx -d your-domain.com"
echo "4. Domain konfigurieren"
echo ""
log_success "Der Server ist bereit für die HD App!"
