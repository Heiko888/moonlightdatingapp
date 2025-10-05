# 🚀 Hetzner Server Recovery Guide

## 📋 **Server-Details:**
- **IP**: 138.199.237.34
- **Domain**: moonlightdatingapp.werdemeisterdeinergedanken.de
- **Status**: Server erreichbar, Services offline

## 🔧 **Schritt-für-Schritt Anleitung:**

### **1. SSH-Verbindung herstellen**
```bash
ssh root@138.199.237.34
```

### **2. Zum App-Verzeichnis wechseln**
```bash
cd /opt/hd-app/HD_App_chart
```

### **3. Neueste Änderungen pullen**
```bash
git pull origin main
```

### **4. Docker Services starten**
```bash
# Services stoppen (falls laufend)
docker-compose -f docker-compose.supabase.yml down

# Services neu starten
docker-compose -f docker-compose.supabase.yml up -d --build
```

### **5. Nginx Status prüfen und starten**
```bash
# Nginx Status prüfen
systemctl status nginx

# Nginx starten (falls gestoppt)
systemctl start nginx
systemctl enable nginx

# Nginx Konfiguration testen
nginx -t
```

### **6. SSL-Zertifikat prüfen**
```bash
# SSL-Zertifikat Status
certbot certificates

# SSL-Zertifikat erneuern (falls nötig)
certbot renew --dry-run
certbot renew
```

### **7. Services überprüfen**
```bash
# Docker Services Status
docker-compose -f docker-compose.supabase.yml ps

# Port Status
netstat -tlnp | grep -E ':(80|443|3000|3001|9090)'

# Service Logs
docker-compose -f docker-compose.supabase.yml logs --tail=20
```

### **8. Firewall prüfen**
```bash
# UFW Status
ufw status

# Ports freigeben (falls nötig)
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 3001/tcp
ufw allow 9090/tcp
```

## 🔍 **Diagnose-Befehle:**

### **Server-Diagnose ausführen**
```bash
./deploy/hetzner/check-server-errors.sh
```

### **Debug-Skript ausführen**
```bash
./deploy/hetzner/debug-server.sh
```

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

## 📊 **Erfolgreiche Wiederherstellung prüfen:**

### **1. Port-Tests**
```bash
curl -I http://localhost:3000  # Frontend
curl -I http://localhost:3001  # Grafana
curl -I http://localhost:9090  # Prometheus
```

### **2. Domain-Test**
```bash
curl -I https://moonlightdatingapp.werdemeisterdeinergedanken.de
```

### **3. Externe Tests**
- Frontend: http://138.199.237.34:3000
- Grafana: http://138.199.237.34:3001
- Domain: https://moonlightdatingapp.werdemeisterdeinergedanken.de

## 🎯 **Erwartete Ergebnisse:**

Nach erfolgreicher Wiederherstellung sollten folgende Services erreichbar sein:
- ✅ Frontend: Port 3000
- ✅ Grafana: Port 3001  
- ✅ Prometheus: Port 9090
- ✅ HTTP: Port 80
- ✅ HTTPS: Port 443
- ✅ Domain: moonlightdatingapp.werdemeisterdeinergedanken.de

## 📞 **Support:**

Falls Probleme auftreten:
1. Logs prüfen: `docker-compose -f docker-compose.supabase.yml logs -f`
2. Server-Diagnose: `./deploy/hetzner/check-server-errors.sh`
3. System-Logs: `journalctl -u nginx -f`
