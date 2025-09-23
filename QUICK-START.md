# ⚡ HD App - Quick Start Guide

## 🚀 Schnellstart (5 Minuten)

### 1. Repository klonen
```bash
git clone <your-repo-url> /opt/hd-app
cd /opt/hd-app
```

### 2. Environment konfigurieren
```bash
cp env.production .env
nano .env  # Wichtige Variablen anpassen
```

### 3. Deployment starten
```bash
chmod +x deploy-production.sh
./deploy-production.sh
```

### 4. Zugriff testen
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4001
- **Grafana**: http://localhost:3001 (admin/[GRAFANA_PASSWORD])

## 🔧 Wichtige Konfigurationen

### Environment-Variablen (env.production)
```bash
# Sicherheit (MUSS geändert werden!)
JWT_SECRET=your-super-secure-jwt-secret-key
MONGO_ROOT_PASSWORD=your-secure-mongo-password
GRAFANA_PASSWORD=your-secure-grafana-password

# URLs (anpassen)
NEXT_PUBLIC_API_URL=https://your-domain.com:4001
CORS_ORIGIN=https://your-domain.com

# API Keys (optional)
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 📊 Monitoring

### Health Checks
```bash
# Frontend Health
curl http://localhost:3000/api/health

# Backend Health
curl http://localhost:4001/health

# Metrics
curl http://localhost:4001/metrics
```

### Logs anzeigen
```bash
# Alle Services
docker-compose -f docker-compose.prod.yml logs -f

# Spezifischer Service
docker-compose -f docker-compose.prod.yml logs -f hd-backend
```

## 🔄 Wartung

### Backup
```bash
./backup.sh
```

### Update
```bash
./update.sh
```

### Wiederherstellung
```bash
./restore.sh /opt/backups/hd-app/hd-app-backup-YYYYMMDD_HHMMSS.tar.gz
```

## 🚨 Häufige Probleme

### Services starten nicht
```bash
docker-compose -f docker-compose.prod.yml logs
docker-compose -f docker-compose.prod.yml restart
```

### Port bereits belegt
```bash
# Prüfen welche Ports belegt sind
netstat -tulpn | grep :3000
netstat -tulpn | grep :4001

# Andere Services stoppen oder Ports ändern
```

### Datenbank-Probleme
```bash
# MongoDB-Container prüfen
docker exec hd-app_mongo_1 mongosh --eval "db.adminCommand('ping')"

# Container neu starten
docker-compose -f docker-compose.prod.yml restart mongo
```

## 📞 Support-Befehle

```bash
# Status prüfen
docker-compose -f docker-compose.prod.yml ps

# Services stoppen
docker-compose -f docker-compose.prod.yml down

# Services starten
docker-compose -f docker-compose.prod.yml up -d

# Container-Status
docker stats

# System-Ressourcen
htop
df -h
```

## 🎯 Nächste Schritte

1. **Domain konfigurieren** und DNS-Einträge setzen
2. **SSL-Zertifikat** einrichten (Let's Encrypt)
3. **Nginx Reverse Proxy** konfigurieren
4. **Backup-Strategie** implementieren
5. **Monitoring-Dashboards** anpassen

---

**Für detaillierte Informationen siehe [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)**
