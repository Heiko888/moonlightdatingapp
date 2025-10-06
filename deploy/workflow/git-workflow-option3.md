# OPTION 3: SEPARATE UMGEBUNGEN - GIT WORKFLOW

## 📋 REPOSITORY-STRUKTUR

### 1. DEVELOPMENT (Port 3005)
- **Repository:** Lokal
- **Push:** Kein Push erforderlich
- **Zweck:** Lokale Entwicklung
- **Workflow:**
  ```bash
  # Entwicklung
  git add .
  git commit -m "Development: Feature XYZ"
  # → Nur lokal gespeichert
  ```

### 2. STAGING (Port 3001)
- **Repository:** GitHub (origin)
- **Push:** `git push origin main`
- **Zweck:** Tests und Code-Review
- **Workflow:**
  ```bash
  # Nach Development-Tests
  git push origin main
  # → https://github.com/Heiko888/moonlightdatingapp.git
  ```

### 3. PRODUCTION (Port 3000)
- **Repository:** Hetzner-Server (hetzner)
- **Push:** `git push hetzner main`
- **Zweck:** Live-Server
- **Workflow:**
  ```bash
  # Nach Staging-Tests
  git push hetzner main
  # → root@138.199.237.34:/var/repos/hd-app-chart.git
  ```

## 🔄 VOLLSTÄNDIGER WORKFLOW

### Schritt 1: Development (Port 3005)
```bash
# Lokale Entwicklung
npm run dev
# → http://localhost:3005

# Änderungen committen
git add .
git commit -m "Development: Feature XYZ"
```

### Schritt 2: Staging (Port 3001)
```bash
# Nach erfolgreichen Tests
git push origin main

# Staging-Server starten
.\deploy\staging\setup-staging.ps1
# → http://localhost:3001
```

### Schritt 3: Production (Port 3000)
```bash
# Nach Staging-Tests
git push hetzner main

# Production-Server starten
.\deploy\production\setup-production.ps1
# → http://138.199.237.34:3000
```

## 📊 REPOSITORY-STATUS

| Repository | Status | Letzter Push | Nächster Push |
|------------|--------|--------------|---------------|
| **origin** | ✅ Aktiv | GitHub | Nach Development |
| **hetzner** | ❌ Offline | Server offline | Nach Staging |

## ⚠️ WICHTIGE HINWEISE

1. **Development:** Nur lokal, kein Push
2. **Staging:** Push zu GitHub für Tests
3. **Production:** Push zu Hetzner-Server für Live-Deployment
4. **Reihenfolge:** Development → Staging → Production
5. **Tests:** Jede Umgebung vor nächster testen
