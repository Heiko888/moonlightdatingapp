# 🚀 HD App - Vollständige Deployment-Anleitung

## Übersicht

Diese Anleitung führt Sie durch das komplette Deployment der HD App (Human Design App) in einer Production-Umgebung. Die App besteht aus:

- **Frontend**: Next.js React-Anwendung
- **Backend**: Node.js Express API
- **Datenbank**: MongoDB + SQLite
- **Monitoring**: Prometheus + Grafana
- **Container**: Docker + Docker Compose

## 📋 Voraussetzungen

### System-Anforderungen
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM**: Mindestens 4GB (empfohlen: 8GB+)
- **CPU**: 2 Kerne (empfohlen: 4+)
- **Speicher**: 50GB freier Speicherplatz
- **Netzwerk**: Statische IP-Adresse oder Domain

### Software-Anforderungen
- Docker 20.10+
- Docker Compose 2.0+
- Git
- Nginx (optional, für Reverse Proxy)

## 🛠️ Installation

### 1. Automatisches Deployment (Empfohlen)

```bash
# Repository klonen
git clone <your-repo-url> /opt/hd-app
cd /opt/hd-app

# Deployment-Skript ausführen
chmod +x deploy-production.sh
./deploy-production.sh
```

### 2. Manuelles Deployment

#### Schritt 1: System vorbereiten
```bash
# Dependencies installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker

# Docker Compose installieren
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

#### Schritt 2: Firewall konfigurieren
```bash
ufw enable
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw allow 3000  # Frontend
ufw allow 3001  # Grafana
ufw allow 9090  # Prometheus
```

#### Schritt 3: Environment konfigurieren
```bash
# Environment-Datei erstellen
cp env.production .env

# Wichtige Variablen anpassen
nano .env
```

**Wichtige Environment-Variablen:**
```bash
# Sicherheit
JWT_SECRET=your-super-secure-jwt-secret-key
MONGO_ROOT_PASSWORD=your-secure-mongo-password
GRAFANA_PASSWORD=your-secure-grafana-password

# URLs
NEXT_PUBLIC_API_URL=https://your-domain.com:4001
CORS_ORIGIN=https://your-domain.com

# API Keys
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Schritt 4: Services starten
```bash
# Docker Images bauen
docker-compose -f docker-compose.prod.yml build

# Services starten
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Konfiguration

### Nginx Reverse Proxy (Empfohlen)

```bash
# Nginx installieren
apt install nginx -y

# Konfiguration erstellen
cat > /etc/nginx/sites-available/hd-app << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    
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
    
    # API Routes
    location /api {
        proxy_pass http://localhost:4001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Grafana
    location /grafana {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Konfiguration aktivieren
ln -sf /etc/nginx/sites-available/hd-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

### SSL-Zertifikat (Let's Encrypt)

```bash
# Certbot installieren
apt install certbot python3-certbot-nginx -y

# SSL-Zertifikat erstellen
certbot --nginx -d your-domain.com

# Auto-Renewal testen
certbot renew --dry-run
```

## 📊 Monitoring

### Grafana Dashboard

1. **Zugriff**: `http://your-domain.com/grafana`
2. **Login**: `admin` / `[GRAFANA_PASSWORD]`
3. **Dashboard**: "HD App Complete Monitoring"

### Prometheus Metriken

1. **Zugriff**: `http://your-domain.com:9090`
2. **Metriken**: Automatisch konfiguriert
3. **Alerts**: Vordefinierte Alert-Regeln

### Health Checks

- **Frontend**: `http://your-domain.com/api/health`
- **Backend**: `http://your-domain.com:4001/health`
- **Metrics**: `http://your-domain.com:4001/metrics`

## 🔄 Wartung

### Backup

```bash
# Automatisches Backup
./backup.sh

# Cron-Job für tägliche Backups
echo "0 2 * * * /opt/hd-app/backup.sh" | crontab -
```

### Update

```bash
# Automatisches Update
./update.sh

# Manuelles Update
git pull origin main
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Wiederherstellung

```bash
# Backup wiederherstellen
./restore.sh /opt/backups/hd-app/hd-app-backup-YYYYMMDD_HHMMSS.tar.gz
```

## 🚨 Troubleshooting

### Häufige Probleme

#### 1. Services starten nicht
```bash
# Logs prüfen
docker-compose -f docker-compose.prod.yml logs

# Container-Status prüfen
docker-compose -f docker-compose.prod.yml ps

# Services neu starten
docker-compose -f docker-compose.prod.yml restart
```

#### 2. Datenbank-Verbindungsfehler
```bash
# MongoDB-Container prüfen
docker exec hd-app_mongo_1 mongosh --eval "db.adminCommand('ping')"

# Datenbank-Logs prüfen
docker logs hd-app_mongo_1
```

#### 3. Frontend lädt nicht
```bash
# Frontend-Logs prüfen
docker logs hd-app_hd-frontend_1

# API-Verbindung testen
curl http://localhost:4001/health
```

#### 4. Monitoring funktioniert nicht
```bash
# Prometheus-Status prüfen
curl http://localhost:9090/-/healthy

# Grafana-Status prüfen
curl http://localhost:3001/api/health
```

### Log-Analyse

```bash
# Alle Logs anzeigen
docker-compose -f docker-compose.prod.yml logs -f

# Spezifische Service-Logs
docker-compose -f docker-compose.prod.yml logs -f hd-backend
docker-compose -f docker-compose.prod.yml logs -f hd-frontend

# Logs mit Zeitstempel
docker-compose -f docker-compose.prod.yml logs -f -t
```

## 📈 Performance-Optimierung

### Ressourcen-Monitoring

```bash
# Container-Ressourcen prüfen
docker stats

# System-Ressourcen prüfen
htop
df -h
free -h
```

### Skalierung

```bash
# Mehr Backend-Instanzen
docker-compose -f docker-compose.prod.yml up -d --scale hd-backend=3

# Load Balancer konfigurieren (Nginx)
# Siehe Nginx-Konfiguration oben
```

## 🔒 Sicherheit

### Firewall-Regeln

```bash
# Nur notwendige Ports öffnen
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw deny 3000   # Frontend (nur über Nginx)
ufw deny 4001   # Backend (nur über Nginx)
```

### SSL/TLS

- Verwenden Sie Let's Encrypt für kostenlose SSL-Zertifikate
- Konfigurieren Sie HSTS-Header
- Verwenden Sie starke Cipher-Suites

### Datenbank-Sicherheit

- Verwenden Sie starke Passwörter
- Beschränken Sie Datenbank-Zugriff auf lokale Verbindungen
- Regelmäßige Backups

## 📞 Support

### Nützliche Befehle

```bash
# System-Status
docker-compose -f docker-compose.prod.yml ps
docker system df
docker system prune -f

# Service-Management
docker-compose -f docker-compose.prod.yml start
docker-compose -f docker-compose.prod.yml stop
docker-compose -f docker-compose.prod.yml restart

# Debugging
docker-compose -f docker-compose.prod.yml exec hd-backend sh
docker-compose -f docker-compose.prod.yml exec hd-frontend sh
```

### Log-Dateien

- **Application Logs**: Docker Container Logs
- **System Logs**: `/var/log/syslog`
- **Nginx Logs**: `/var/log/nginx/`
- **Docker Logs**: `journalctl -u docker`

## 🎯 Nächste Schritte

Nach erfolgreichem Deployment:

1. **Domain konfigurieren** und DNS-Einträge setzen
2. **SSL-Zertifikat** einrichten
3. **Monitoring-Dashboards** anpassen
4. **Backup-Strategie** implementieren
5. **Performance-Tests** durchführen
6. **Sicherheits-Audit** durchführen

## 📚 Weitere Dokumentation

- [Docker Compose Dokumentation](https://docs.docker.com/compose/)
- [Nginx Dokumentation](https://nginx.org/en/docs/)
- [Let's Encrypt Dokumentation](https://letsencrypt.org/docs/)
- [Grafana Dokumentation](https://grafana.com/docs/)
- [Prometheus Dokumentation](https://prometheus.io/docs/)

---

**🎉 Herzlichen Glückwunsch! Ihre HD App ist jetzt erfolgreich deployed und bereit für den Production-Einsatz!**
