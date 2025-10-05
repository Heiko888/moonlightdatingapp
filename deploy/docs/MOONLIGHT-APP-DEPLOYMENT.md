# 🌙 Moonlight Dating App - Hetzner Deployment

## 📋 Übersicht

Deployment-Anleitung für die **Moonlight Dating App** auf dem Hetzner Server mit der Domain `moonlightdatingapp.werdemeisterdeinergedanken.de`.

### ✅ **Bereits konfiguriert:**

- **Domain**: `moonlightdatingapp.werdemeisterdeinergedanken.de`
- **Server**: `138.199.237.34`
- **DNS**: Bereits konfiguriert
- **SSL**: Automatisch mit Let's Encrypt

## 🚀 **Sofortiges Deployment:**

### **Option 1: Vollständiges Moonlight App Deployment (Empfohlen)**

```bash
# 1. Auf Server einloggen
ssh root@138.199.237.34

# 2. Moonlight App Deployment-Skript herunterladen
wget https://raw.githubusercontent.com/Heiko888/moonlightdatingapp/main/deploy-moonlight-app.sh
chmod +x deploy-moonlight-app.sh

# 3. Deployment ausführen
./deploy-moonlight-app.sh
```

### **Option 2: Mit spezifischen Parametern**

```bash
# Mit Email für Let's Encrypt
./deploy-moonlight-app.sh -e your-email@domain.com

# Mit GitHub Repository
./deploy-moonlight-app.sh -r https://github.com/Heiko888/moonlightdatingapp.git
```

## 🌐 **Nach dem Deployment verfügbar:**

- **🌙 Moonlight Dating App**: `https://moonlightdatingapp.werdemeisterdeinergedanken.de`
- **📊 Grafana Dashboard**: `https://moonlightdatingapp.werdemeisterdeinergedanken.de/grafana/`
- **📈 Prometheus Metriken**: `https://moonlightdatingapp.werdemeisterdeinergedanken.de/prometheus/`

## 🔧 **Moonlight App spezifische Features:**

### **Automatisch konfiguriert:**

- ✅ **SSL/HTTPS** für `moonlightdatingapp.werdemeisterdeinergedanken.de`
- ✅ **CORS** für Moonlight App Domain
- ✅ **API-Endpunkte** unter `/api`
- ✅ **Security Headers** für Dating App
- ✅ **Rate Limiting** für API-Schutz
- ✅ **Monitoring** für alle Services

### **Environment-Konfiguration:**

```env
# Moonlight Dating App Configuration
NEXT_PUBLIC_APP_NAME=Moonlight Dating App
NEXT_PUBLIC_APP_URL=https://moonlightdatingapp.werdemeisterdeinergedanken.de
NEXT_PUBLIC_DOMAIN=moonlightdatingapp.werdemeisterdeinergedanken.de
CORS_ORIGIN=https://moonlightdatingapp.werdemeisterdeinergedanken.de
NEXT_PUBLIC_API_URL=https://moonlightdatingapp.werdemeisterdeinergedanken.de/api
```

## 🔒 **Security für Dating App:**

### **Nginx-Konfiguration:**

- **Security Headers** für Dating App
- **XSS-Protection** aktiviert
- **Content Security Policy** konfiguriert
- **HTTPS-Only** erzwungen
- **API-Rate-Limiting** aktiviert

### **Firewall-Regeln:**

- **Port 80/443** für Web-Traffic
- **Port 3000** für Frontend (intern)
- **Port 4001** für Backend (intern)
- **Port 3001** für Grafana (intern)
- **Port 9090** für Prometheus (intern)

## 📊 **Monitoring für Moonlight App:**

### **Grafana Dashboard:**

- **URL**: `https://moonlightdatingapp.werdemeisterdeinergedanken.de/grafana/`
- **Login**: `admin` / `admin123`
- **Dashboard**: "Moonlight Dating App Monitoring"

### **Prometheus Metriken:**

- **URL**: `https://moonlightdatingapp.werdemeisterdeinergedanken.de/prometheus/`
- **API-Metriken**: `https://moonlightdatingapp.werdemeisterdeinergedanken.de/api/metrics`

## 🔧 **Wartung der Moonlight App:**

### **Status prüfen:**

```bash
cd /opt/moonlight-app/HD_App_chart
docker-compose -f docker-compose.supabase.yml ps
```

### **Logs anzeigen:**

```bash
# Alle Logs
docker-compose -f docker-compose.supabase.yml logs -f

# Moonlight App Frontend
docker-compose -f docker-compose.supabase.yml logs -f hd-frontend

# Moonlight App Backend
docker-compose -f docker-compose.supabase.yml logs -f hd-backend
```

### **Services neu starten:**

```bash
docker-compose -f docker-compose.supabase.yml restart
```

### **Updates:**

```bash
cd /opt/moonlight-app/HD_App_chart
git pull origin main
docker-compose -f docker-compose.supabase.yml up -d --build
```

## 🚨 **Troubleshooting für Moonlight App:**

### **App nicht erreichbar:**

```bash
# DNS prüfen
nslookup moonlightdatingapp.werdemeisterdeinergedanken.de

# SSL prüfen
curl -I https://moonlightdatingapp.werdemeisterdeinergedanken.de

# Services prüfen
docker-compose -f docker-compose.supabase.yml ps
```

### **SSL-Probleme:**

```bash
# Certbot Status
certbot certificates

# SSL erneuern
certbot renew --force-renewal

# Nginx neu laden
systemctl reload nginx
```

### **API-Probleme:**

```bash
# API-Test
curl https://moonlightdatingapp.werdemeisterdeinergedanken.de/api/health

# Backend-Logs
docker-compose -f docker-compose.supabase.yml logs -f hd-backend
```

## 📈 **Performance-Optimierung:**

### **Nginx-Caching:**

```nginx
# In /etc/nginx/sites-available/moonlight-app
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### **Docker-Ressourcen:**

```yaml
# In docker-compose.supabase.yml
deploy:
  resources:
    limits:
      memory: 1G
    reservations:
      memory: 512M
```

## 🔄 **Backup für Moonlight App:**

### **Automatisches Backup:**

```bash
# Backup-Skript ausführen
wget https://raw.githubusercontent.com/Heiko888/moonlightdatingapp/main/backup-production.sh
chmod +x backup-production.sh
./backup-production.sh
```

### **Manuelles Backup:**

```bash
# Datenbank-Backup
docker-compose -f docker-compose.supabase.yml exec hd-backend npm run backup

# Volumes-Backup
docker run --rm -v moonlight_app_prometheus_data:/data -v $(pwd):/backup alpine tar czf /backup/moonlight-backup.tar.gz -C /data .
```

## 🎯 **Nächste Schritte:**

1. **Deployment ausführen** mit `deploy-moonlight-app.sh`
2. **Environment-Datei** mit deinen API-Keys konfigurieren
3. **Security-Hardening** durchführen
4. **Monitoring** einrichten
5. **Backup-Strategie** implementieren

## 🎉 **Fertig!**

**Deine Moonlight Dating App ist bereit für das Deployment!**

**Einfach ausführen:**

```bash
ssh root@138.199.237.34
wget https://raw.githubusercontent.com/Heiko888/moonlightdatingapp/main/deploy-moonlight-app.sh
chmod +x deploy-moonlight-app.sh
./deploy-moonlight-app.sh
```

**Nach dem Deployment ist deine App verfügbar unter:**
**🌙 [https://moonlightdatingapp.werdemeisterdeinergedanken.de](https://moonlightdatingapp.werdemeisterdeinergedanken.de)**

---

**🚀 Viel Erfolg mit deiner Moonlight Dating App!**
