# 🚀 Hetzner Server Recovery - Komplette Anleitung

## 📋 **Zusammenfassung der Probleme:**
- ✅ **Server erreichbar**: Ping funktioniert (138.199.237.34)
- ✅ **SSH verfügbar**: Port 22 ist offen
- ❌ **Alle Services offline**: Ports 80, 443, 3000, 3001, 9090 nicht erreichbar
- ❌ **Domain nicht funktional**: moonlightdatingapp.werdemeisterdeinergedanken.de nicht erreichbar

## 🔧 **Lösungsansätze:**

### **Option 1: Automatische Wiederherstellung (Empfohlen)**
```bash
# SSH-Verbindung zum Server
ssh root@138.199.237.34

# Zum App-Verzeichnis wechseln
cd /opt/hd-app/HD_App_chart

# Automatisches Recovery-Skript ausführen
./deploy/hetzner/auto-recovery.sh
```

### **Option 2: Manuelle Wiederherstellung**
```bash
# SSH-Verbindung zum Server
ssh root@138.199.237.34

# Zum App-Verzeichnis wechseln
cd /opt/hd-app/HD_App_chart

# 1. Repository aktualisieren
git pull origin main

# 2. Docker Services starten
docker-compose -f docker-compose.supabase.yml down
docker-compose -f docker-compose.supabase.yml up -d --build

# 3. Nginx starten
systemctl start nginx
systemctl enable nginx

# 4. SSL-Zertifikat prüfen
certbot renew

# 5. Firewall konfigurieren
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 3001/tcp
ufw allow 9090/tcp
```

### **Option 3: Komplettes Neudeployment**
```bash
# SSH-Verbindung zum Server
ssh root@138.199.237.34

# Zum App-Verzeichnis wechseln
cd /opt/hd-app/HD_App_chart

# Komplettes Deployment ausführen
./deploy/hetzner/deploy-hetzner-complete.sh
```

## 🔍 **Diagnose-Befehle:**

### **Server-Status prüfen**
```bash
# Server-Diagnose
./deploy/hetzner/check-server-errors.sh

# Debug-Informationen
./deploy/hetzner/debug-server.sh

# Services Status
docker-compose -f docker-compose.supabase.yml ps

# Port Status
netstat -tlnp | grep -E ':(80|443|3000|3001|9090)'
```

### **Logs überwachen**
```bash
# Docker Logs
docker-compose -f docker-compose.supabase.yml logs -f

# Nginx Logs
tail -f /var/log/nginx/error.log

# System Logs
journalctl -u nginx -f
```

## 🎯 **Erwartete Ergebnisse nach Wiederherstellung:**

### **Erreichbare Services:**
- ✅ **Frontend**: http://138.199.237.34:3000
- ✅ **Grafana**: http://138.199.237.34:3001
- ✅ **Prometheus**: http://138.199.237.34:9090
- ✅ **HTTP**: http://138.199.237.34
- ✅ **HTTPS**: https://138.199.237.34
- ✅ **Domain**: https://moonlightdatingapp.werdemeisterdeinergedanken.de

### **Verfügbare Tools:**
- 📊 **Grafana Dashboard**: Monitoring und Analytics
- 🔍 **Prometheus**: Metriken und Alerting
- 🌐 **Frontend**: Hauptanwendung mit allen Features
- 🔐 **SSL**: Sichere HTTPS-Verbindung

## 🚨 **Häufige Probleme und Lösungen:**

### **Problem: Docker Services starten nicht**
```bash
# Docker neu starten
systemctl restart docker

# Services erneut starten
docker-compose -f docker-compose.supabase.yml up -d
```

### **Problem: Nginx startet nicht**
```bash
# Nginx Konfiguration prüfen
nginx -t

# Nginx Logs prüfen
tail -f /var/log/nginx/error.log

# Nginx neu starten
systemctl restart nginx
```

### **Problem: SSL-Zertifikat abgelaufen**
```bash
# Zertifikat erneuern
certbot renew

# Nginx neu starten
systemctl restart nginx
```

### **Problem: Ports nicht erreichbar**
```bash
# Firewall Status prüfen
ufw status

# Ports freigeben
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 3001/tcp
ufw allow 9090/tcp
```

## 📞 **Support und Monitoring:**

### **Nach der Wiederherstellung:**
1. **Services testen**: Alle URLs aufrufen und Funktionalität prüfen
2. **Logs überwachen**: Regelmäßig auf Fehler prüfen
3. **Backup erstellen**: Wichtige Daten sichern
4. **Monitoring einrichten**: Automatische Überwachung konfigurieren

### **Kontinuierliche Überwachung:**
```bash
# Server-Status regelmäßig prüfen
./deploy/hetzner/check-server-errors.sh

# Logs überwachen
docker-compose -f docker-compose.supabase.yml logs -f
```

## 🎉 **Erfolgreiche Wiederherstellung bestätigen:**

Nach der Wiederherstellung sollten folgende Tests erfolgreich sein:
- ✅ `curl -I http://138.199.237.34:3000` → Frontend erreichbar
- ✅ `curl -I http://138.199.237.34:3001` → Grafana erreichbar
- ✅ `curl -I http://138.199.237.34:9090` → Prometheus erreichbar
- ✅ `curl -I https://moonlightdatingapp.werdemeisterdeinergedanken.de` → Domain erreichbar

**Die App ist dann wieder vollständig funktional! 🚀**
