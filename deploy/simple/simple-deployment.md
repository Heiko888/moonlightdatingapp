# EINFACHE DEPLOYMENT-STRATEGIE (NUR 1 REPOSITORY)

## 📋 REPOSITORY-STRUKTUR

### ✅ NUR GITHUB VERWENDEN
```bash
# Hetzner-Repository entfernen
git remote remove hetzner

# Nur GitHub behalten
git remote -v
# → origin  https://github.com/Heiko888/moonlightdatingapp.git
```

## 🔄 WORKFLOW (VEREINFACHT)

### 1. DEVELOPMENT (Port 3005)
```bash
# Lokale Entwicklung
npm run dev
# → http://localhost:3005
```

### 2. STAGING (Port 3001)
```bash
# Nach Development-Tests
git add .
git commit -m "Staging: Feature XYZ"
git push origin main

# Staging starten
.\deploy\staging\setup-staging.ps1
# → http://localhost:3001
```

### 3. PRODUCTION (Port 3000)
```bash
# Nach Staging-Tests
git push origin main

# Production starten (SSH zu Hetzner)
.\deploy\production\setup-production.ps1
# → http://138.199.237.34:3000
```

## 🎯 VORTEILE

- ✅ **Einfacher:** Nur 1 Repository
- ✅ **Weniger Fehler:** Keine Sync-Probleme
- ✅ **Bessere Übersicht:** Alles an einem Ort
- ✅ **Einfacher Backup:** GitHub als zentrale Quelle

## 📊 REPOSITORY-STATUS

| Repository | Status | Zweck |
|------------|--------|-------|
| **origin** | ✅ Aktiv | GitHub (Haupt-Repo) |
| **hetzner** | ❌ Entfernt | Nicht mehr benötigt |

## 🔧 HETZNER-DEPLOYMENT

### SSH-basiertes Deployment
```bash
# Auf Hetzner-Server
ssh root@138.199.237.34
cd /opt/hd-app/HD_App_chart
git pull origin main
docker-compose -f docker-compose.supabase.yml up -d
```

**Das ist viel einfacher und zuverlässiger!**
