# 🚀 DEPLOYMENT QUICK-START GUIDE

## **SCHNELLÜBERSICHT**

```
Development (Port 3005) → Docker-Dev (Port 3000) → Staging (Port 3002) → Prod-Local (Port 3004) → Production (Hetzner)
```

---

## **1. DEVELOPMENT (LOKAL)**

### **Native Development Server:**
```powershell
cd frontend
npm run dev
```
**URL:** http://localhost:3005

### **Features:**
- ✅ Hot Reload
- ✅ Schnelle Entwicklung
- ✅ Source Maps
- ✅ Debugging

---

## **2. DOCKER-DEVELOPMENT (LOKAL)**

### **Docker-basierte Entwicklung:**
```powershell
docker-compose -f docker-compose.dev.yml up -d
```
**URL:** http://localhost:3000

### **Stoppen:**
```powershell
docker-compose -f docker-compose.dev.yml down
```

---

## **3. STAGING (LOKAL)**

### **Staging-Environment starten:**
```powershell
.\deploy\staging\deploy-staging.ps1
```
**URLs:**
- Frontend: http://localhost:3002
- Nginx: http://localhost:8002
- Grafana: http://localhost:3003
- Prometheus: http://localhost:9091

### **Stoppen:**
```powershell
docker-compose -f docker-compose.staging.yml down
```

---

## **4. PRODUCTION-SIMULATION (LOKAL)**

### **Lokale Production-Simulation:**
```powershell
.\deploy\production\deploy-prod-local.ps1
```
**URLs:**
- Frontend: http://localhost:3004
- Nginx HTTP: http://localhost:8004
- Nginx HTTPS: https://localhost:8443
- Grafana: http://localhost:3005
- Prometheus: http://localhost:9092

### **Stoppen:**
```powershell
docker-compose -f docker-compose.prod-local.yml down
```

---

## **5. PRODUCTION (HETZNER)**

### **Production-Deployment:**
```powershell
.\deploy\production\setup-production.ps1
```
**URLs:**
- Frontend: http://138.199.237.34:3000
- Grafana: http://138.199.237.34:3001
- Prometheus: http://138.199.237.34:9090

---

## **📊 PORT-ÜBERSICHT**

| **Environment** | **Frontend** | **Nginx** | **Grafana** | **Prometheus** |
|-----------------|--------------|-----------|-------------|----------------|
| Development | 3005 | - | - | - |
| Docker-Dev | 3000 | 80 | - | - |
| Staging | 3002 | 8002 | 3003 | 9091 |
| Prod-Local | 3004 | 8004/8443 | 3005 | 9092 |
| Production | 3000 | 80/443 | 3001 | 9090 |

---

## **🔄 TYPISCHER WORKFLOW**

### **1. Feature-Entwicklung:**
```powershell
# Development Server starten
cd frontend
npm run dev
# → http://localhost:3005

# Entwicklung & Testing
# Hot Reload aktiviert
```

### **2. Docker-Test:**
```powershell
# Docker-Container testen
docker-compose -f docker-compose.dev.yml up -d
# → http://localhost:3000

# Container-Integration prüfen
```

### **3. Staging-Test:**
```powershell
# Staging-Environment
.\deploy\staging\deploy-staging.ps1
# → http://localhost:3002

# Production-ähnliche Tests
# Performance-Tests
```

### **4. Production-Simulation:**
```powershell
# Lokale Production-Simulation
.\deploy\production\deploy-prod-local.ps1
# → http://localhost:3004

# Finale Tests vor Production
# SSL-Tests
# Monitoring-Tests
```

### **5. Production-Deployment:**
```powershell
# Production-Deployment
.\deploy\production\setup-production.ps1
# → http://138.199.237.34:3000

# Live-Deployment
# Health Checks
```

---

## **✅ DEPLOYMENT-CHECKLISTE**

### **Vor jedem Deployment:**
- [ ] Code-Review abgeschlossen
- [ ] Tests erfolgreich
- [ ] Linter-Fehler behoben
- [ ] TypeScript-Fehler behoben
- [ ] Performance-Tests durchgeführt
- [ ] Dokumentation aktualisiert

### **Development → Staging:**
- [ ] Docker Build erfolgreich
- [ ] Container starten ohne Fehler
- [ ] Health Checks erfolgreich
- [ ] Integration-Tests erfolgreich

### **Staging → Production:**
- [ ] Finale Tests erfolgreich
- [ ] Backup erstellt
- [ ] Rollback-Plan vorhanden
- [ ] Team informiert
- [ ] Monitoring aktiviert

---

## **🚨 TROUBLESHOOTING**

### **Port bereits belegt:**
```powershell
# Port-Belegung prüfen
Get-NetTCPConnection -LocalPort 3005

# Prozess beenden
Stop-Process -Id <ProcessId> -Force
```

### **Docker-Container startet nicht:**
```powershell
# Logs anzeigen
docker-compose -f docker-compose.staging.yml logs -f

# Container neu starten
docker-compose -f docker-compose.staging.yml restart
```

### **Health Check fehlgeschlagen:**
```powershell
# Container Status prüfen
docker-compose -f docker-compose.staging.yml ps

# Logs prüfen
docker-compose -f docker-compose.staging.yml logs frontend-staging
```

---

## **📚 WEITERE DOKUMENTATION**

- **Deployment-Strategie:** `DEPLOYMENT-STRATEGY.md`
- **Production-Deployment:** `deploy/production/setup-production.ps1`
- **Staging-Deployment:** `deploy/staging/deploy-staging.ps1`
- **Monitoring:** `MONITORING-COMPLETE.md`
- **Grafana:** `GRAFANA-SETUP.md`

