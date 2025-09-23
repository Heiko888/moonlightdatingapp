# 🚀 HD App Deployment auf Hetzner Server (138.199.237.34)

## Schritt 1: Auf Server einloggen
```bash
ssh root@138.199.237.34
```

## Schritt 2: System vorbereiten
```bash
# System aktualisieren
apt update && apt upgrade -y

# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose installieren
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Git installieren
apt install git -y
```

## Schritt 3: App herunterladen
```bash
# Verzeichnis erstellen
mkdir -p /opt/hd-app
cd /opt/hd-app

# Repository klonen (ersetzen Sie IHR_GITHUB_REPO)
git clone https://github.com/IhrUsername/HD_App_chart.git
cd HD_App_chart
```

## Schritt 4: Environment konfigurieren
```bash
# Environment Datei erstellen
cp env.supabase .env

# .env Datei bearbeiten
nano .env
```

**Wichtige Werte in .env setzen:**
```
JWT_SECRET=IhrStarkerJWTSecret
OPENAI_API_KEY=IhrOpenAIAPIKey
GRAFANA_PASSWORD=IhrStarkesGrafanaPasswort
NEXT_PUBLIC_SUPABASE_URL=IhrSupabaseURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=IhrSupabaseAnonKey
```

## Schritt 5: Firewall konfigurieren
```bash
# UFW installieren und konfigurieren
apt install ufw -y
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 3001/tcp
ufw allow 9090/tcp
ufw allow 9100/tcp
ufw --force enable
```

## Schritt 6: Nginx installieren
```bash
# Nginx installieren
apt install nginx -y

# Konfiguration erstellen
cat > /etc/nginx/sites-available/hd-app << 'EOF'
server {
    listen 80;
    server_name _;

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

    location /grafana/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /prometheus/ {
        proxy_pass http://localhost:9090/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Site aktivieren
ln -sf /etc/nginx/sites-available/hd-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

## Schritt 7: Docker Services starten
```bash
# Services starten
docker-compose -f docker-compose.supabase.yml up -d --build

# Status prüfen
docker-compose -f docker-compose.supabase.yml ps
```

## Schritt 8: Health Check
```bash
# Warten bis Services starten
sleep 30

# Services testen
curl http://localhost:3000
curl http://localhost:3001
curl http://localhost:9090
```

## 🌐 Zugriff auf Ihre App

Nach erfolgreichem Deployment:

- **Hauptanwendung**: http://138.199.237.34
- **Grafana**: http://138.199.237.34/grafana/
- **Prometheus**: http://138.199.237.34/prometheus/

## 🔧 Wartungsbefehle

```bash
# Status prüfen
docker-compose -f docker-compose.supabase.yml ps

# Logs anzeigen
docker-compose -f docker-compose.supabase.yml logs -f

# Services neu starten
docker-compose -f docker-compose.supabase.yml down
docker-compose -f docker-compose.supabase.yml up -d

# Updates
git pull origin main
docker-compose -f docker-compose.supabase.yml up -d --build
```

## 🚨 Troubleshooting

### Container startet nicht
```bash
# Logs prüfen
docker-compose -f docker-compose.supabase.yml logs SERVICE_NAME

# Container neu bauen
docker-compose -f docker-compose.supabase.yml build --no-cache SERVICE_NAME
```

### Port bereits belegt
```bash
# Ports prüfen
netstat -tulpn | grep :3000

# Prozess beenden
kill -9 PID
```

### Netzwerk Probleme
```bash
# Docker Netzwerke prüfen
docker network ls

# Netzwerk bereinigen
docker network prune -f
```

## 📞 Support

Bei Problemen:
1. Logs prüfen: `docker-compose -f docker-compose.supabase.yml logs -f`
2. Status prüfen: `docker-compose -f docker-compose.supabase.yml ps`
3. System Ressourcen prüfen: `htop`, `df -h`
4. Netzwerk prüfen: `netstat -tulpn`
