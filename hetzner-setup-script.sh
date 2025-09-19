#!/bin/bash

# 🚀 HD App - Hetzner Server Setup Script
# Für Server: 138.199.237.34

echo "🚀 HD App - Hetzner Server Setup wird gestartet..."
echo "=================================================="

# System-Informationen anzeigen
echo "📋 System-Informationen:"
echo "========================"
uname -a
cat /etc/os-release
echo ""

# Schritt 1: System aktualisieren
echo "🔄 Schritt 1: System aktualisieren..."
echo "====================================="
apt update && apt upgrade -y
echo "✅ System aktualisiert"
echo ""

# Schritt 2: Docker installieren
echo "🐳 Schritt 2: Docker installieren..."
echo "===================================="
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Docker Compose installieren
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Docker starten
systemctl start docker
systemctl enable docker

echo "✅ Docker und Docker Compose installiert"
echo ""

# Schritt 3: Node.js installieren
echo "📦 Schritt 3: Node.js installieren..."
echo "====================================="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

echo "✅ Node.js installiert"
node --version
npm --version
echo ""

# Schritt 4: Firewall konfigurieren
echo "🔥 Schritt 4: Firewall konfigurieren..."
echo "======================================"
ufw --force enable
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw allow 3000  # Frontend (temporär)
ufw allow 4001  # Backend (temporär)
ufw allow 3001  # Grafana
ufw allow 9090  # Prometheus

echo "✅ Firewall konfiguriert"
ufw status
echo ""

# Schritt 5: Nginx installieren
echo "🌐 Schritt 5: Nginx installieren..."
echo "==================================="
apt install nginx -y
systemctl start nginx
systemctl enable nginx

echo "✅ Nginx installiert und gestartet"
echo ""

# Schritt 6: Git installieren (falls nicht vorhanden)
echo "📥 Schritt 6: Git installieren..."
echo "================================="
apt install git -y

echo "✅ Git installiert"
echo ""

# Schritt 7: Verzeichnis für HD App erstellen
echo "📁 Schritt 7: Verzeichnis für HD App erstellen..."
echo "================================================"
mkdir -p /opt/hd-app
cd /opt/hd-app

echo "✅ Verzeichnis /opt/hd-app erstellt"
echo ""

# Schritt 8: Nginx-Konfiguration vorbereiten
echo "⚙️  Schritt 8: Nginx-Konfiguration vorbereiten..."
echo "==============================================="
cat > /etc/nginx/sites-available/hd-app << 'EOF'
server {
    listen 80;
    server_name 138.199.237.34;
    
    # Frontend
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
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:4001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Nginx-Konfiguration aktivieren
ln -sf /etc/nginx/sites-available/hd-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "✅ Nginx-Konfiguration erstellt"
echo ""

# Schritt 9: Status anzeigen
echo "📊 Schritt 9: Installation Status..."
echo "==================================="
echo "✅ Docker Status:"
systemctl is-active docker
echo ""
echo "✅ Nginx Status:"
systemctl is-active nginx
echo ""
echo "✅ Node.js Version:"
node --version
echo ""
echo "✅ Firewall Status:"
ufw status
echo ""

# Schritt 10: Nächste Schritte
echo "🎯 Nächste Schritte:"
echo "==================="
echo "1. HD App Repository klonen:"
echo "   cd /opt/hd-app"
echo "   git clone <your-repo-url> ."
echo ""
echo "2. Environment-Datei erstellen:"
echo "   cp env.example .env"
echo "   nano .env"
echo ""
echo "3. HD App starten:"
echo "   docker-compose up -d"
echo ""
echo "4. URLs nach Deployment:"
echo "   Frontend: http://138.199.237.34:3000"
echo "   Backend:  http://138.199.237.34:4001"
echo "   Grafana:  http://138.199.237.34:3001"
echo ""

echo "🎉 Server-Setup abgeschlossen!"
echo "Der Server ist bereit für die HD App Deployment."
