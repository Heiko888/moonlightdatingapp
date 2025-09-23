# 🚀 HD App - Lokale Änderungen auf Hetzner Server deployen

## 📋 Übersicht

Dieses Guide zeigt, wie Sie Ihre lokalen Änderungen einfach auf den Hetzner-Server übertragen können.

## 🎯 Voraussetzungen

- ✅ Lokale Entwicklungsumgebung läuft (`npm run dev:local`)
- ✅ Änderungen getestet und funktionsfähig
- ✅ SSH-Zugang zum Hetzner-Server (138.199.237.34)
- ✅ PowerShell (Windows) oder Bash (Linux/Mac)

## 🚀 Deployment-Optionen

### Option 1: PowerShell Script (Windows)

```powershell
# Einfaches Deployment
.\deploy-local-to-hetzner.ps1

# Mit benutzerdefinierten Parametern
.\deploy-local-to-hetzner.ps1 -ServerIP "138.199.237.34" -Username "root"
```

### Option 2: Bash Script (Linux/Mac)

```bash
# Script ausführbar machen
chmod +x deploy-local-to-hetzner.sh

# Einfaches Deployment
./deploy-local-to-hetzner.sh

# Mit benutzerdefinierten Parametern
./deploy-local-to-hetzner.sh "138.199.237.34" "root"
```

### Option 3: Manuelles Deployment

```bash
# 1. SSH-Verbindung zum Server
ssh root@138.199.237.34

# 2. Ins App-Verzeichnis wechseln
cd /opt/hd-app/HD_App_chart

# 3. Repository aktualisieren
git pull origin main

# 4. Services neu starten
docker-compose -f docker-compose.supabase.yml down
docker-compose -f docker-compose.supabase.yml build --no-cache
docker-compose -f docker-compose.supabase.yml up -d
```

## 📋 Was die Scripts machen

### 1. **Git-Status prüfen**
- ✅ Erkennt lokale Änderungen
- ✅ Committet Änderungen automatisch
- ✅ Pusht zu Repository (falls vorhanden)

### 2. **Dateien übertragen**
- ✅ Konfigurationsdateien (`package.json`, `docker-compose.yml`)
- ✅ Backend-Code (`src/`, `routes/`, `lib/`)
- ✅ Frontend-Code (`app/`, `components/`, `lib/`)
- ✅ Monitoring-Konfiguration (`grafana/`, `prometheus/`)

### 3. **Server vorbereiten**
- ✅ Verzeichnisse erstellen
- ✅ Berechtigungen setzen
- ✅ Environment-Datei prüfen

### 4. **Services neu starten**
- ✅ Docker-Container stoppen
- ✅ Images neu bauen
- ✅ Services starten
- ✅ Health Check durchführen

## 🔧 Konfiguration

### Server-Details
- **IP-Adresse**: 138.199.237.34
- **Benutzer**: root
- **Pfad**: /opt/hd-app/HD_App_chart

### Environment-Variablen
Die Scripts verwenden automatisch die `env.supabase` Datei für die Produktionsumgebung.

## 📊 Nach dem Deployment

### Service-URLs
- **Hauptanwendung**: http://138.199.237.34
- **Backend API**: http://138.199.237.34:4001
- **Grafana**: http://138.199.237.34:3001
- **Prometheus**: http://138.199.237.34:9090

### Nützliche Befehle

```bash
# Logs anzeigen
ssh root@138.199.237.34 'cd /opt/hd-app/HD_App_chart && docker-compose -f docker-compose.supabase.yml logs -f'

# Status prüfen
ssh root@138.199.237.34 'cd /opt/hd-app/HD_App_chart && docker-compose -f docker-compose.supabase.yml ps'

# Services stoppen
ssh root@138.199.237.34 'cd /opt/hd-app/HD_App_chart && docker-compose -f docker-compose.supabase.yml down'

# Services starten
ssh root@138.199.237.34 'cd /opt/hd-app/HD_App_chart && docker-compose -f docker-compose.supabase.yml up -d'

# Environment bearbeiten
ssh root@138.199.237.34 'cd /opt/hd-app/HD_App_chart && nano .env'
```

## 🛠️ Troubleshooting

### SSH-Verbindung fehlgeschlagen
```bash
# SSH-Key prüfen
ssh-add -l

# Verbindung testen
ssh -v root@138.199.237.34

# SSH-Key hinzufügen
ssh-copy-id root@138.199.237.34
```

### Docker-Probleme
```bash
# Docker-Status prüfen
ssh root@138.199.237.34 'docker ps'

# Container-Logs anzeigen
ssh root@138.199.237.34 'cd /opt/hd-app/HD_App_chart && docker-compose -f docker-compose.supabase.yml logs'

# Images neu bauen
ssh root@138.199.237.34 'cd /opt/hd-app/HD_App_chart && docker-compose -f docker-compose.supabase.yml build --no-cache'
```

### Port-Konflikte
```bash
# Laufende Prozesse prüfen
ssh root@138.199.237.34 'netstat -tlnp | grep :3000'
ssh root@138.199.237.34 'netstat -tlnp | grep :4001'

# Prozesse beenden
ssh root@138.199.237.34 'pkill -f node'
ssh root@138.199.237.34 'docker stop $(docker ps -q)'
```

## 🔄 Workflow

### Tägliche Entwicklung
1. **Lokal entwickeln**: `npm run dev:local`
2. **Änderungen testen**: Frontend und Backend prüfen
3. **Deployen**: `.\deploy-local-to-hetzner.ps1`
4. **Produktion testen**: URLs aufrufen

### Bei Problemen
1. **Lokale Umgebung prüfen**: `npm run dev:local`
2. **Supabase-Umgebung testen**: `npm run dev`
3. **Server-Logs prüfen**: SSH-Befehle verwenden
4. **Rollback**: Alte Version deployen

## 📝 Best Practices

### Vor dem Deployment
- ✅ Alle Tests lokal durchgeführt
- ✅ Keine uncommitteten Änderungen
- ✅ Backup der Produktionsdaten
- ✅ Deployment-Zeitfenster geplant

### Nach dem Deployment
- ✅ Health Check durchgeführt
- ✅ Alle Services funktionsfähig
- ✅ Logs überwacht
- ✅ Benutzer informiert

## 🎯 Vorteile

- ✅ **Automatisiert**: Ein Befehl deployt alles
- ✅ **Sicher**: Git-basierte Versionskontrolle
- ✅ **Schnell**: Nur geänderte Dateien werden übertragen
- ✅ **Zuverlässig**: Health Checks und Rollback-Möglichkeiten
- ✅ **Flexibel**: Lokale und Produktionsumgebung getrennt

## 🔗 Verwandte Dokumentation

- [Entwicklungs-Umgebungen](ENTWICKLUNGS-UMGEBUNGEN.md)
- [Hetzner-Deployment](HETZNER-DEPLOYMENT.md)
- [Supabase-Setup](SUPABASE-SETUP-GUIDE.md)
- [Docker-Compose](docker-compose.supabase.yml)
