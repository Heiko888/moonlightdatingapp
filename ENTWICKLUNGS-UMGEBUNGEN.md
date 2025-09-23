# 🚀 HD App - Entwicklungs-Umgebungen

## 📋 Übersicht

Die HD App unterstützt zwei separate Entwicklungs-Umgebungen:

1. **🏠 Lokale Entwicklung** - Ohne Supabase, mit lokaler SQLite-Datenbank
2. **☁️ Supabase/Produktion** - Mit Hetzner-Server und Supabase-Integration

## 🏠 Lokale Entwicklung (Empfohlen für Development)

### Starten der lokalen Umgebung:
```bash
# Lokale Entwicklung starten (ohne Supabase)
npm run dev:local
```

**Was passiert:**
- ✅ Backend läuft auf Port 4001 mit lokaler SQLite-Datenbank
- ✅ Frontend läuft auf Port 3000
- ✅ Keine Supabase-Abhängigkeiten
- ✅ Alle Daten werden lokal gespeichert
- ✅ Schneller Start, keine Netzwerk-Abhängigkeiten

**Verfügbare URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4001
- Health Check: http://localhost:4001/health

## ☁️ Supabase/Produktion (Für Hetzner-Deployment)

### Starten der Supabase-Umgebung:
```bash
# Supabase-Entwicklung starten
npm run dev
```

**Was passiert:**
- ✅ Backend läuft auf Port 4001 mit Supabase-Verbindung
- ✅ Frontend läuft auf Port 3000
- ✅ Verbindung zu Hetzner-Supabase-Instanz
- ✅ Produktions-ähnliche Umgebung

**Verfügbare URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4001
- Health Check: http://localhost:4001/health

## 🔧 Konfiguration

### Lokale Umgebung (env.local)
```env
NODE_ENV=development
PORT=4001
USE_LOCAL_DB=true
SUPABASE_ENABLED=false
```

### Supabase-Umgebung (env.supabase)
```env
NODE_ENV=production
PORT=4001
SUPABASE_ENABLED=true
NEXT_PUBLIC_SUPABASE_URL=https://njjcywgskzepikyzhihy.supabase.co
```

## 🚀 Deployment-Optionen

### 1. Lokale Entwicklung
```bash
# Für lokale Entwicklung
npm run dev:local
```

### 2. Supabase-Entwicklung
```bash
# Für Supabase-Entwicklung
npm run dev
```

### 3. Hetzner-Produktion
```bash
# Auf Hetzner-Server
docker-compose -f docker-compose.supabase.yml up -d
```

## 🔄 Umgebungen wechseln

### Von Supabase zu Lokal:
```bash
# Stoppe aktuelle Server
Ctrl+C

# Starte lokale Umgebung
npm run dev:local
```

### Von Lokal zu Supabase:
```bash
# Stoppe aktuelle Server
Ctrl+C

# Starte Supabase-Umgebung
npm run dev
```

## 📊 Vorteile der getrennten Umgebungen

### Lokale Entwicklung:
- ✅ **Schneller Start** - Keine Netzwerk-Abhängigkeiten
- ✅ **Offline-Entwicklung** - Funktioniert ohne Internet
- ✅ **Sichere Tests** - Keine Auswirkungen auf Produktionsdaten
- ✅ **Einfache Debugging** - Lokale Logs und Datenbank

### Supabase-Entwicklung:
- ✅ **Produktions-ähnlich** - Echte Supabase-Integration
- ✅ **Team-Entwicklung** - Geteilte Datenbank
- ✅ **Cloud-Features** - Echtzeit-Updates, Auth, etc.
- ✅ **Deployment-Test** - Test vor Hetzner-Deployment

## 🛠️ Troubleshooting

### Port-Konflikte:
```bash
# Alle Node.js-Prozesse stoppen
taskkill /F /IM node.exe

# Docker-Container stoppen (falls nötig)
docker stop $(docker ps -q)
```

### Environment-Probleme:
```bash
# Lokale Environment-Dateien prüfen
ls backend/env.local
ls frontend/env.local

# Supabase-Environment prüfen
ls env.supabase
```

### Datenbank-Probleme:
```bash
# Lokale Datenbank zurücksetzen
rm backend/data/*.db

# Server neu starten
npm run dev:local
```

## 📝 Empfehlungen

1. **Für tägliche Entwicklung**: Verwende `npm run dev:local`
2. **Für Supabase-Features**: Verwende `npm run dev`
3. **Vor Deployment**: Teste mit `npm run dev`
4. **Bei Problemen**: Wechsle zu `npm run dev:local`

## 🔗 Nützliche Links

- [Hetzner-Deployment Guide](HETZNER-DEPLOYMENT.md)
- [Supabase-Setup Guide](SUPABASE-SETUP-GUIDE.md)
- [Lokale Entwicklung](README.md)
