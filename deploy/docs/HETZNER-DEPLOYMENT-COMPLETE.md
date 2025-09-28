# 🚀 HD App - Komplettes Hetzner Deployment

## 📋 Übersicht

Alle Vorbereitungen für das Hetzner-Deployment sind **abgeschlossen**!

### ✅ **Bereits vorbereitet:**

1. **Deployment-Skripte:**
   - `deploy-hetzner-complete.sh` - Vollständiges Deployment mit SSL
   - `deploy-hetzner.sh` - Basis-Deployment
   - `deploy-final.ps1` - PowerShell-Skript

2. **Production-Stack:**
   - `docker-compose.supabase.yml` - Vollständige Container-Konfiguration
   - `env.supabase` - Production Environment

3. **Monitoring & Alerts:**
   - `setup-monitoring-alerts.sh` - Grafana-Alerts Setup
   - `backup-production.sh` - Automatische Backups
   - `security-hardening.sh` - Security-Hardening

4. **Dokumentation:**
   - Vollständige Anleitungen für alle Komponenten
   - Troubleshooting-Guides
   - Wartungsanleitungen

## 🚀 **Sofort einsatzbereit - 3 Deployment-Optionen:**

### **Option 1: Vollständiges Deployment mit SSL (Empfohlen)**

```bash
# 1. Auf Server einloggen
ssh root@138.199.237.34

# 2. Deployment-Skript herunterladen
wget https://raw.githubusercontent.com/your-username/HD_App_chart/main/deploy-hetzner-complete.sh
chmod +x deploy-hetzner-complete.sh

# 3. Mit Domain und SSL ausführen
./deploy-hetzner-complete.sh -d your-domain.com -e your-email@domain.com -r https://github.com/your-username/HD_App_chart.git
```

### **Option 2: Basis-Deployment (ohne SSL)**

```bash
# 1. Auf Server einloggen
ssh root@138.199.237.34

# 2. Basis-Deployment
wget https://raw.githubusercontent.com/your-username/HD_App_chart/main/deploy-hetzner.sh
chmod +x deploy-hetzner.sh
./deploy-hetzner.sh
```

### **Option 3: PowerShell-Deployment (Windows)**

```powershell
# Lokal ausführen
.\deploy-final.ps1
```

## 🔧 **Nach dem Deployment:**

### **1. Security-Hardening durchführen:**

```bash
# Auf Server ausführen
wget https://raw.githubusercontent.com/your-username/HD_App_chart/main/security-hardening.sh
chmod +x security-hardening.sh
./security-hardening.sh -a "YOUR_IP,TRUSTED_IP" -p 2222
```

### **2. Monitoring einrichten:**

```bash
# Monitoring-Alerts einrichten
wget https://raw.githubusercontent.com/your-username/HD_App_chart/main/setup-monitoring-alerts.sh
chmod +x setup-monitoring-alerts.sh
./setup-monitoring-alerts.sh
```

### **3. Backups einrichten:**

```bash
# Backup-Skript ausführen
wget https://raw.githubusercontent.com/your-username/HD_App_chart/main/backup-production.sh
chmod +x backup-production.sh
./backup-production.sh
```

## 🌐 **Zugriff auf Services:**

Nach dem Deployment sind folgende Services verfügbar:

- **Hauptanwendung**: `https://your-domain.com` (mit SSL) oder `http://138.199.237.34`
- **Grafana**: `https://your-domain.com/grafana/` oder `http://138.199.237.34:3001`
- **Prometheus**: `https://your-domain.com/prometheus/` oder `http://138.199.237.34:9090`

## 📊 **Monitoring-Dashboard:**

- **Grafana**: `http://138.199.237.34:3001`
  - Login: `admin` / `admin123`
  - Dashboard: "HD App Complete Monitoring"

- **Prometheus**: `http://138.199.237.34:9090`
  - Metriken: `http://138.199.237.34:4001/metrics`

## 🔒 **Security-Features:**

- ✅ **SSL/HTTPS** mit Let's Encrypt
- ✅ **Firewall** (UFW) konfiguriert
- ✅ **Fail2Ban** für SSH-Schutz
- ✅ **Rate Limiting** für API
- ✅ **Security Headers** in Nginx
- ✅ **Docker Security** Hardening
- ✅ **System Hardening** (Kernel-Parameter)

## 📈 **Backup & Monitoring:**

- ✅ **Automatische Backups** (täglich um 2:00 Uhr)
- ✅ **Grafana-Alerts** für alle Services
- ✅ **Email-Benachrichtigungen** bei Problemen
- ✅ **Security-Monitoring** für verdächtige Aktivitäten
- ✅ **Log-Rotation** für alle Services

## 🔧 **Wartung:**

### **Status prüfen:**

```bash
cd /opt/hd-app/HD_App_chart
docker-compose -f docker-compose.supabase.yml ps
```

### **Logs anzeigen:**

```bash
# Alle Logs
docker-compose -f docker-compose.supabase.yml logs -f

# Spezifische Services
docker-compose -f docker-compose.supabase.yml logs -f hd-frontend
docker-compose -f docker-compose.supabase.yml logs -f hd-backend
```

### **Services neu starten:**

```bash
docker-compose -f docker-compose.supabase.yml down
docker-compose -f docker-compose.supabase.yml up -d
```

### **Updates:**

```bash
cd /opt/hd-app/HD_App_chart
git pull origin main
docker-compose -f docker-compose.supabase.yml up -d --build
```

## 🚨 **Troubleshooting:**

### **Container startet nicht:**

```bash
# Logs prüfen
docker-compose -f docker-compose.supabase.yml logs SERVICE_NAME

# Container neu bauen
docker-compose -f docker-compose.supabase.yml build --no-cache SERVICE_NAME
```

### **Port bereits belegt:**

```bash
# Ports prüfen
sudo netstat -tulpn | grep :3000

# Prozess beenden
sudo kill -9 PID
```

### **SSL-Probleme:**

```bash
# Certbot Status
certbot certificates

# SSL erneuern
certbot renew --force-renewal
```

## 📞 **Support:**

Bei Problemen:

1. **Logs prüfen**: `docker-compose -f docker-compose.supabase.yml logs -f`
2. **Status prüfen**: `docker-compose -f docker-compose.supabase.yml ps`
3. **System-Ressourcen**: `htop`, `df -h`
4. **Netzwerk**: `netstat -tulpn`

## 🎯 **Nächste Schritte:**

1. **Domain kaufen** und DNS auf `138.199.237.34` zeigen lassen
2. **SSL-Zertifikat** automatisch mit Let's Encrypt einrichten
3. **Email-Konfiguration** für Alerts anpassen
4. **Backup-Strategie** für externe Speicherung erweitern
5. **CI/CD-Pipeline** für automatische Deployments einrichten

---

## 🎉 **Fertig!**

**Alle technischen Vorbereitungen sind abgeschlossen!**

Du kannst jetzt sofort mit dem Deployment beginnen. Wähle eine der drei Optionen oben und folge den Anweisungen.

**Empfohlenes Vorgehen:**

1. **Option 1** für vollständiges Deployment mit SSL
2. **Security-Hardening** durchführen
3. **Monitoring** einrichten
4. **Backups** testen

## **Die HD App ist bereit für Production! 🚀**
