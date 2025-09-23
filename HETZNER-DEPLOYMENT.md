# HD App Deployment auf Hetzner Server

## 🚀 Schnellstart

### 1. Server vorbereiten
```bash
# Auf Ihrem Hetzner Server einloggen
ssh root@IHR_SERVER_IP

# Deployment Script herunterladen und ausführen
wget https://raw.githubusercontent.com/IhrUsername/HD_App_chart/main/deploy-hetzner.sh
chmod +x deploy-hetzner.sh
./deploy-hetzner.sh
```

### 2. Environment konfigurieren
Das Script erstellt eine `.env` Datei basierend auf `env.supabase`. Sie müssen folgende Werte setzen:

```bash
# In /opt/hd-app/HD_App_chart/.env
JWT_SECRET=IhrStarkerJWTSecret
OPENAI_API_KEY=IhrOpenAIAPIKey
GRAFANA_PASSWORD=IhrStarkesGrafanaPasswort
NEXT_PUBLIC_SUPABASE_URL=IhrSupabaseURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=IhrSupabaseAnonKey
```

### 3. Services starten
```bash
cd /opt/hd-app/HD_App_chart
docker-compose -f docker-compose.supabase.yml up -d
```

## 📋 Was das Script macht

1. **System aktualisieren** - Ubuntu/Debian System wird aktualisiert
2. **Docker installieren** - Docker und Docker Compose werden installiert
3. **Git installieren** - Für Repository-Zugriff
4. **App Verzeichnis erstellen** - `/opt/hd-app/` wird erstellt
5. **Repository klonen** - HD App wird heruntergeladen
6. **Environment konfigurieren** - `.env` Datei wird erstellt
7. **Firewall konfigurieren** - UFW wird konfiguriert
8. **Nginx installieren** - Reverse Proxy wird eingerichtet
9. **Services starten** - Docker Container werden gestartet
10. **Health Check** - Alle Services werden geprüft

## 🌐 Zugriff auf Services

Nach dem Deployment sind folgende Services verfügbar:

- **Hauptanwendung**: `http://IHR_SERVER_IP`
- **Grafana**: `http://IHR_SERVER_IP/grafana/`
- **Prometheus**: `http://IHR_SERVER_IP/prometheus/`

## 🔧 Wartung

### Status prüfen
```bash
cd /opt/hd-app/HD_App_chart
docker-compose -f docker-compose.supabase.yml ps
```

### Logs anzeigen
```bash
# Alle Logs
docker-compose -f docker-compose.supabase.yml logs -f

# Spezifische Service Logs
docker-compose -f docker-compose.supabase.yml logs -f hd-frontend
docker-compose -f docker-compose.supabase.yml logs -f hd-backend
```

### Services neu starten
```bash
docker-compose -f docker-compose.supabase.yml down
docker-compose -f docker-compose.supabase.yml up -d
```

### Updates
```bash
cd /opt/hd-app/HD_App_chart
git pull origin main
docker-compose -f docker-compose.supabase.yml up -d --build
```

## 🔒 Sicherheit

### SSL/HTTPS einrichten
```bash
# Certbot installieren
sudo apt install certbot python3-certbot-nginx -y

# SSL Zertifikat erstellen
sudo certbot --nginx -d IHR_DOMAIN.de

# Auto-Renewal testen
sudo certbot renew --dry-run
```

### Firewall erweitern
```bash
# Nur bestimmte IPs erlauben
sudo ufw allow from IHR_IP to any port 22
sudo ufw deny 22
```

## 📊 Monitoring

### Grafana Dashboard
- URL: `http://IHR_SERVER_IP/grafana/`
- Login: `admin` / `IhrGrafanaPasswort`
- Dashboard: "HD App Complete Monitoring"

### Prometheus Metriken
- URL: `http://IHR_SERVER_IP/prometheus/`
- Metriken: `http://IHR_SERVER_IP:4001/metrics`

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
sudo netstat -tulpn | grep :3000

# Prozess beenden
sudo kill -9 PID
```

### Netzwerk Probleme
```bash
# Docker Netzwerke prüfen
docker network ls

# Netzwerk bereinigen
docker network prune -f
```

## 📁 Dateistruktur

```
/opt/hd-app/HD_App_chart/
├── docker-compose.supabase.yml
├── .env
├── backend/
├── frontend/
├── grafana/
├── prometheus/
└── deploy-hetzner.sh
```

## 🔄 Backup & Restore

### Backup erstellen
```bash
# Datenbank Backup (falls verwendet)
docker-compose -f docker-compose.supabase.yml exec hd-backend npm run backup

# Volumes Backup
docker run --rm -v hd_app_chart_prometheus_data:/data -v $(pwd):/backup alpine tar czf /backup/prometheus-backup.tar.gz -C /data .
docker run --rm -v hd_app_chart_grafana_data:/data -v $(pwd):/backup alpine tar czf /backup/grafana-backup.tar.gz -C /data .
```

### Restore
```bash
# Volumes Restore
docker run --rm -v hd_app_chart_prometheus_data:/data -v $(pwd):/backup alpine tar xzf /backup/prometheus-backup.tar.gz -C /data
docker run --rm -v hd_app_chart_grafana_data:/data -v $(pwd):/backup alpine tar xzf /backup/grafana-backup.tar.gz -C /data
```

## 📞 Support

Bei Problemen:
1. Logs prüfen: `docker-compose -f docker-compose.supabase.yml logs -f`
2. Status prüfen: `docker-compose -f docker-compose.supabase.yml ps`
3. System Ressourcen prüfen: `htop`, `df -h`
4. Netzwerk prüfen: `netstat -tulpn`
