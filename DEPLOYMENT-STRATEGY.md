# 🚀 DEPLOYMENT-STRATEGIE - HD_APP_CHART

## **ÜBERSICHT**

Konsistente Deployment-Pipeline für alle Environments mit standardisierten Ports, Konfigurationen und Prozessen.

---

## **📊 ENVIRONMENT-STRUKTUR**

### **1. DEVELOPMENT (Lokal)**
```yaml
Environment: development
Port: 3005
Type: Native (npm run dev)
URL: http://localhost:3005
Zweck: Schnelle Entwicklung mit Hot Reload
```

**Konfiguration:**
- **Frontend:** Native Next.js Development Server
- **Port:** 3005 (npm run dev)
- **Hot Reload:** ✅ Aktiviert
- **Debugging:** ✅ Aktiviert
- **Source Maps:** ✅ Aktiviert
- **Environment:** `.env.local`

**Start:**
```powershell
cd frontend
npm run dev
```

---

### **2. DOCKER-DEVELOPMENT (Lokal)**
```yaml
Environment: development-docker
Port: 3000
Type: Docker (docker-compose.dev.yml)
URL: http://localhost:3000
Zweck: Docker-basierte Entwicklung
```

**Konfiguration:**
- **Frontend:** Docker Container
- **Port:** 3000
- **Nginx:** Port 80
- **Environment:** `.env.local`
- **Compose:** `docker-compose.dev.yml`

**Start:**
```powershell
docker-compose -f docker-compose.dev.yml up -d
```

---

### **3. STAGING (Lokal)**
```yaml
Environment: staging
Port: 3002
Type: Docker (docker-compose.staging.yml)
URL: http://localhost:3002
Zweck: Production-ähnliche Tests
```

**Konfiguration:**
- **Frontend:** Docker Container (Production Build)
- **Port:** 3002
- **Nginx:** Port 8002
- **Monitoring:** Grafana (3003), Prometheus (9091)
- **Environment:** `.env.staging`
- **Compose:** `docker-compose.staging.yml`

**Start:**
```powershell
docker-compose -f docker-compose.staging.yml up -d
```

---

### **4. PRODUCTION-SIMULATION (Lokal)**
```yaml
Environment: production-local
Port: 3004
Type: Docker (docker-compose.prod-local.yml)
URL: http://localhost:3004
Zweck: Exakte Production-Simulation
```

**Konfiguration:**
- **Frontend:** Docker Container (Production Build)
- **Port:** 3004
- **Nginx:** Port 8004 (mit SSL)
- **Monitoring:** Grafana (3005), Prometheus (9092)
- **Redis:** Port 6380
- **Alertmanager:** Port 9094
- **Environment:** `.env.production.local`
- **Compose:** `docker-compose.prod-local.yml`

**Start:**
```powershell
docker-compose -f docker-compose.prod-local.yml up -d
```

---

### **5. PRODUCTION (Hetzner)**
```yaml
Environment: production
Port: 3000
Type: Docker (docker-compose.supabase.yml)
URL: http://138.199.237.34:3000
Zweck: Live Production Server
```

**Konfiguration:**
- **Frontend:** Docker Container (Production Build)
- **Port:** 3000
- **Nginx:** Port 80/443 (mit SSL)
- **Monitoring:** Grafana (3001), Prometheus (9090)
- **Redis:** Port 6379
- **Alertmanager:** Port 9093
- **Environment:** `.env.production`
- **Compose:** `docker-compose.supabase.yml`

**Deployment:**
```powershell
.\deploy\production\setup-production.ps1
```

---

## **🔄 DEPLOYMENT-WORKFLOW**

### **Schritt 1: Development**
```powershell
# Native Development
cd frontend
npm run dev
# → http://localhost:3005

# Entwicklung & Testing
# Hot Reload aktiviert
# Schnelle Iterationen
```

### **Schritt 2: Docker-Development**
```powershell
# Docker-basierte Entwicklung
docker-compose -f docker-compose.dev.yml up -d
# → http://localhost:3000

# Docker-spezifische Tests
# Container-Integration prüfen
```

### **Schritt 3: Staging**
```powershell
# Staging-Environment
docker-compose -f docker-compose.staging.yml up -d
# → http://localhost:3002

# Production-ähnliche Tests
# Performance-Tests
# Integration-Tests
```

### **Schritt 4: Production-Simulation**
```powershell
# Lokale Production-Simulation
docker-compose -f docker-compose.prod-local.yml up -d
# → http://localhost:3004

# Finale Tests vor Production
# SSL-Tests
# Monitoring-Tests
# Performance-Tests
```

### **Schritt 5: Production-Deployment**
```powershell
# Production-Deployment
.\deploy\production\setup-production.ps1
# → http://138.199.237.34:3000

# Live-Deployment
# Health Checks
# Monitoring aktiviert
```

---

## **📋 PORT-ÜBERSICHT**

| **Environment** | **Frontend** | **Nginx** | **Grafana** | **Prometheus** | **Redis** |
|-----------------|--------------|-----------|-------------|----------------|-----------|
| **Development** | 3005 | - | - | - | - |
| **Docker-Dev** | 3000 | 80 | - | - | - |
| **Staging** | 3002 | 8002 | 3003 | 9091 | 6381 |
| **Prod-Local** | 3004 | 8004 | 3005 | 9092 | 6380 |
| **Production** | 3000 | 80/443 | 3001 | 9090 | 6379 |

---

## **🔒 ENVIRONMENT-VARIABLEN**

### **Development (.env.local)**
```env
NODE_ENV=development
PORT=3005
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### **Staging (.env.staging)**
```env
NODE_ENV=staging
PORT=3002
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### **Production (.env.production)**
```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GRAFANA_PASSWORD=...
JWT_SECRET=...
```

---

## **✅ DEPLOYMENT-CHECKLISTE**

### **Vor jedem Deployment:**
- [ ] Code-Review abgeschlossen
- [ ] Tests erfolgreich (Unit, Integration, E2E)
- [ ] Linter-Fehler behoben
- [ ] TypeScript-Fehler behoben
- [ ] Performance-Tests durchgeführt
- [ ] Security-Audit durchgeführt
- [ ] Dokumentation aktualisiert
- [ ] Changelog aktualisiert

### **Development → Staging:**
- [ ] Docker Build erfolgreich
- [ ] Container starten ohne Fehler
- [ ] Health Checks erfolgreich
- [ ] Integration-Tests erfolgreich
- [ ] Performance akzeptabel

### **Staging → Production-Simulation:**
- [ ] Production Build erfolgreich
- [ ] SSL-Konfiguration korrekt
- [ ] Monitoring funktioniert
- [ ] Alerts konfiguriert
- [ ] Backup-Strategie vorhanden

### **Production-Simulation → Production:**
- [ ] Finale Tests erfolgreich
- [ ] Backup erstellt
- [ ] Rollback-Plan vorhanden
- [ ] Team informiert
- [ ] Monitoring aktiviert
- [ ] Health Checks erfolgreich

---

## **🚨 ROLLBACK-STRATEGIE**

### **Automatischer Rollback:**
```powershell
# Bei Health Check Fehlern
if (!(Test-NetConnection -ComputerName $ServerIP -Port 3000)) {
    Write-Host "Health Check failed - Rolling back..." -ForegroundColor Red
    ssh $Username@$ServerIP 'cd $ServerPath && docker-compose -f docker-compose.supabase.yml down'
    ssh $Username@$ServerIP 'cd $ServerPath && git checkout HEAD~1'
    ssh $Username@$ServerIP 'cd $ServerPath && docker-compose -f docker-compose.supabase.yml up -d'
}
```

### **Manueller Rollback:**
```powershell
# Zum vorherigen Commit zurück
ssh root@138.199.237.34 'cd /opt/hd-app/HD_App_chart && git log --oneline -5'
ssh root@138.199.237.34 'cd /opt/hd-app/HD_App_chart && git checkout <commit-hash>'
ssh root@138.199.237.34 'cd /opt/hd-app/HD_App_chart && docker-compose -f docker-compose.supabase.yml restart'
```

---

## **📊 MONITORING**

### **Health Checks:**
```powershell
# Development
Invoke-WebRequest -Uri "http://localhost:3005" -Method HEAD

# Staging
Invoke-WebRequest -Uri "http://localhost:3002" -Method HEAD

# Production
Invoke-WebRequest -Uri "http://138.199.237.34:3000" -Method HEAD
```

### **Grafana Dashboards:**
- **Development:** Nicht verfügbar
- **Staging:** http://localhost:3003
- **Production:** http://138.199.237.34:3001

### **Prometheus Metrics:**
- **Staging:** http://localhost:9091
- **Production:** http://138.199.237.34:9090

---

## **🎯 BEST PRACTICES**

1. **Immer Development → Staging → Production**
2. **Nie direkt in Production deployen**
3. **Immer Backup vor Production-Deployment**
4. **Monitoring während Deployment beobachten**
5. **Health Checks nach jedem Deployment**
6. **Rollback-Plan bereithalten**
7. **Team vor Production-Deployment informieren**
8. **Changelog pflegen**

---

## **📚 WEITERE DOKUMENTATION**

- **Production-Deployment:** `deploy/production/setup-production.ps1`
- **Staging-Setup:** `deploy/staging/setup-staging.ps1`
- **Docker-Konfiguration:** `docker-compose.*.yml`
- **Monitoring:** `MONITORING-COMPLETE.md`
- **Grafana:** `GRAFANA-SETUP.md`

