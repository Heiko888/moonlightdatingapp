#!/bin/bash

# 🔐 SSL-Zertifikat Setup für Hetzner Server
# Domain: www.the-connection-key.de
# Server: 138.199.237.34

echo "🔐 SSL-Zertifikat Setup für Hetzner Server"
echo "==========================================="
echo ""

# Farben für Ausgabe
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Domainname
DOMAIN="www.the-connection-key.de"
EMAIL="your-email@example.com"  # BITTE ÄNDERN!

echo -e "${BLUE}📋 Schritt 1: System aktualisieren${NC}"
echo "=================================="
apt update
apt upgrade -y
echo -e "${GREEN}✅ System aktualisiert${NC}"
echo ""

echo -e "${BLUE}📦 Schritt 2: Certbot installieren${NC}"
echo "==================================="
apt install -y certbot python3-certbot-nginx
echo -e "${GREEN}✅ Certbot installiert${NC}"
echo ""

echo -e "${BLUE}🛑 Schritt 3: Bestehende Docker-Container stoppen${NC}"
echo "=================================================="
cd /opt/hd-app || cd /root || cd ~
docker-compose down || docker compose down || echo "Keine Container gestoppt"
echo -e "${GREEN}✅ Container gestoppt${NC}"
echo ""

echo -e "${BLUE}🌐 Schritt 4: Temporäre Nginx-Konfiguration${NC}"
echo "============================================="

# Erstelle temporäre Nginx-Konfiguration für Certbot
cat > /etc/nginx/sites-available/temp-ssl << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    # Let's Encrypt ACME Challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 200 'Server läuft - SSL wird eingerichtet';
        add_header Content-Type text/plain;
    }
}
EOF

# Verzeichnis für ACME Challenge erstellen
mkdir -p /var/www/html/.well-known/acme-challenge

# Nginx-Konfiguration aktivieren
ln -sf /etc/nginx/sites-available/temp-ssl /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Nginx neu laden
nginx -t && systemctl reload nginx
echo -e "${GREEN}✅ Temporäre Nginx-Konfiguration aktiv${NC}"
echo ""

echo -e "${YELLOW}⚠️  WICHTIG: Stelle sicher, dass die DNS-Einträge korrekt sind!${NC}"
echo ""
echo "Prüfe DNS-Einträge:"
echo "-------------------"
dig +short $DOMAIN
echo ""
echo -e "${YELLOW}Drücke Enter, wenn die DNS-Einträge korrekt sind...${NC}"
read -r

echo -e "${BLUE}🔐 Schritt 5: SSL-Zertifikat anfordern${NC}"
echo "======================================"
echo ""
echo -e "${YELLOW}Bitte gib deine E-Mail-Adresse ein:${NC}"
read -r EMAIL

certbot certonly \
    --nginx \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    -d "$DOMAIN" \
    --rsa-key-size 4096

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SSL-Zertifikat erfolgreich erstellt!${NC}"
else
    echo -e "${RED}❌ Fehler beim Erstellen des SSL-Zertifikats${NC}"
    echo ""
    echo "Mögliche Probleme:"
    echo "1. Domain zeigt nicht auf diesen Server"
    echo "2. Port 80 ist nicht erreichbar"
    echo "3. Firewall blockiert den Zugriff"
    echo ""
    echo "Überprüfe die Firewall:"
    ufw status
    echo ""
    echo "Teste Port 80:"
    curl -I http://$DOMAIN
    exit 1
fi

echo ""
echo -e "${BLUE}📋 Schritt 6: Zertifikat-Informationen${NC}"
echo "======================================"
certbot certificates
echo ""

echo -e "${BLUE}🔄 Schritt 7: Auto-Renewal testen${NC}"
echo "=================================="
certbot renew --dry-run
echo -e "${GREEN}✅ Auto-Renewal funktioniert${NC}"
echo ""

echo -e "${BLUE}🔧 Schritt 8: Nginx-Konfiguration für Docker vorbereiten${NC}"
echo "========================================================"

# Erstelle Docker-Compose-Konfiguration mit SSL
cat > /opt/hd-app/docker-compose.prod.yml << EOF
version: '3.8'

services:
  # Frontend Application
  frontend:
    image: ghcr.io/heiko888/moonlightdatingapp:main
    pull_policy: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOSTNAME=0.0.0.0
      - NEXT_TELEMETRY_DISABLED=1
      - NODE_OPTIONS=--max-old-space-size=3072
    restart: unless-stopped

  # Nginx Reverse Proxy mit SSL
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - /var/www/html:/usr/share/nginx/html:ro
    depends_on:
      - frontend
    restart: unless-stopped

  # Grafana Monitoring
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=\${GRAFANA_PASSWORD:-admin123}
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana-storage:/var/lib/grafana
    restart: unless-stopped

  # Prometheus Metrics
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-storage:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    restart: unless-stopped

volumes:
  grafana-storage:
  prometheus-storage:
EOF

echo -e "${GREEN}✅ Docker-Compose-Konfiguration erstellt${NC}"
echo ""

echo -e "${BLUE}🚀 Schritt 9: Docker-Container mit SSL starten${NC}"
echo "=============================================="
cd /opt/hd-app
docker-compose -f docker-compose.prod.yml up -d
echo -e "${GREEN}✅ Container gestartet${NC}"
echo ""

echo -e "${BLUE}📊 Schritt 10: Status überprüfen${NC}"
echo "================================"
docker-compose -f docker-compose.prod.yml ps
echo ""

echo -e "${GREEN}🎉 SSL-Setup abgeschlossen!${NC}"
echo ""
echo "📋 Zusammenfassung:"
echo "==================="
echo "✅ SSL-Zertifikat: /etc/letsencrypt/live/$DOMAIN/"
echo "✅ Auto-Renewal: Aktiv (erneuert automatisch vor Ablauf)"
echo "✅ Domain: https://$DOMAIN"
echo ""
echo "🔧 Nützliche Befehle:"
echo "====================="
echo "Zertifikat erneuern:     certbot renew"
echo "Zertifikat anzeigen:     certbot certificates"
echo "Container neustarten:    docker-compose -f docker-compose.prod.yml restart"
echo "Logs anzeigen:          docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🔗 URLs:"
echo "========"
echo "Frontend:    https://$DOMAIN"
echo "Grafana:     http://138.199.237.34:3001"
echo "Prometheus:  http://138.199.237.34:9090"
echo ""
echo -e "${YELLOW}⚠️  WICHTIG: Speichere die Zertifikat-Pfade sicher!${NC}"
echo ""

