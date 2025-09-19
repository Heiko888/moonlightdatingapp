# HD App - Server Start Anleitung

Diese Anleitung erklärt, wie Sie alle Server der HD App starten können.

## 📋 Verfügbare Skripte

### 1. `start-all-servers.ps1` (PowerShell)
**Empfohlen für Windows 10/11**
- Startet alle Services mit Docker
- Inklusive Monitoring (Prometheus, Grafana, Alertmanager)
- Vollständige Produktionsumgebung

### 2. `start-all-servers.bat` (Batch)
**Alternative für Windows**
- Gleiche Funktionalität wie PowerShell-Skript
- Kompatibel mit älteren Windows-Versionen

### 3. `start-dev-servers.ps1` (PowerShell)
**Für Entwicklung**
- Startet nur Backend und Frontend
- Ohne Docker (direkt mit Node.js)
- Schneller für Entwicklung

## 🚀 Schnellstart

### Option 1: Vollständige Umgebung (Empfohlen)
```powershell
# PowerShell als Administrator ausführen
.\start-all-servers.ps1
```

### Option 2: Batch-Datei
```cmd
# Doppelklick auf die .bat Datei oder
start-all-servers.bat
```

### Option 3: Entwicklungsumgebung
```powershell
# Nur für Entwicklung
.\start-dev-servers.ps1
```

### Option 4: Environment Setup (falls .env Dateien fehlen)
```powershell
# Erstellt automatisch die benötigten .env Dateien
.\setup-env.ps1
```

```cmd
# Batch-Version
setup-env.bat
```

## 📋 Voraussetzungen

### Für Docker-Skripte (`start-all-servers.ps1/.bat`)
- ✅ Docker Desktop installiert und gestartet
- ✅ Docker Compose verfügbar
- ✅ Mindestens 4GB RAM verfügbar

### Für Entwicklungsskript (`start-dev-servers.ps1`)
- ✅ Node.js 18+ installiert
- ✅ MongoDB (optional, wird automatisch erkannt)
- ✅ npm verfügbar

## 🔧 Installation der Voraussetzungen

### Docker Desktop
1. Laden Sie Docker Desktop von [docker.com](https://www.docker.com/products/docker-desktop/) herunter
2. Installieren Sie Docker Desktop
3. Starten Sie Docker Desktop
4. Warten Sie, bis Docker vollständig geladen ist

### Node.js
1. Laden Sie Node.js von [nodejs.org](https://nodejs.org/) herunter
2. Installieren Sie Node.js (LTS Version empfohlen)
3. Überprüfen Sie die Installation: `node --version`

## 🌐 Verfügbare URLs

Nach erfolgreichem Start sind folgende Services verfügbar:

| Service | URL | Beschreibung |
|---------|-----|--------------|
| Frontend | http://localhost:3000 | Hauptanwendung |
| Backend API | http://localhost:4001 | API-Server |
| Grafana | http://localhost:3001 | Monitoring Dashboard (admin/admin) |
| Prometheus | http://localhost:9090 | Metriken-Server |
| Alertmanager | http://localhost:9093 | Alert-Management |

## 🛠️ Troubleshooting

### Docker läuft nicht
```
❌ Docker ist nicht gestartet. Bitte starten Sie Docker Desktop.
```
**Lösung:**
1. Starten Sie Docker Desktop
2. Warten Sie, bis Docker vollständig geladen ist
3. Führen Sie das Skript erneut aus

### Port bereits belegt
```
❌ Port 3000 ist bereits belegt
```
**Lösung:**
1. Stoppen Sie andere Anwendungen, die den Port verwenden
2. Oder verwenden Sie `docker-compose down` um bestehende Container zu stoppen

### Fehlende .env Dateien
```
❌ Keine Konfigurationsdatei gefunden
```
**Lösung:**
1. Führen Sie das Environment Setup aus: `.\setup-env.ps1`
2. Oder erstellen Sie manuell die .env Dateien aus den Templates
3. Die Skripte erstellen .env Dateien automatisch, falls sie fehlen

### MongoDB nicht verfügbar (Entwicklung)
```
⚠️ MongoDB läuft nicht auf Port 27017
```
**Lösung:**
1. Starten Sie MongoDB lokal, oder
2. Verwenden Sie Docker: `docker run -d -p 27017:27017 --name mongodb mongo:7.0`

## 📊 Monitoring

### Grafana Dashboard
- URL: http://localhost:3001
- Benutzername: `admin`
- Passwort: `admin`

### Prometheus Metriken
- URL: http://localhost:9090
- Direkter Zugriff auf Metriken und Alerts

## 🛑 Services stoppen

### Docker Services
```powershell
# Alle Services stoppen
docker-compose down

# Nur Monitoring stoppen
docker-compose -f docker-compose-monitoring.yml down
```

### Entwicklungsservices
```powershell
# Im PowerShell-Fenster Strg+C drücken
# Oder manuell stoppen:
Stop-Job $backendJob, $frontendJob
```

## 🔍 Logs anzeigen

### Docker Logs
```powershell
# Alle Logs
docker-compose logs -f

# Spezifischer Service
docker-compose logs -f hd-backend
docker-compose logs -f hd-frontend
```

### Entwicklungsserver Logs
```powershell
# Backend Logs
Receive-Job $backendJob

# Frontend Logs
Receive-Job $frontendJob
```

## 📝 Skript anpassen

Die Skripte können bei Bedarf angepasst werden:

- **Ports ändern**: Bearbeiten Sie die Port-Nummern in den Skripten
- **Services hinzufügen**: Erweitern Sie die Service-Listen
- **Timeout-Werte**: Passen Sie die Wartezeiten an

## 🆘 Support

Bei Problemen:
1. Überprüfen Sie die Logs mit den oben genannten Befehlen
2. Stellen Sie sicher, dass alle Voraussetzungen erfüllt sind
3. Prüfen Sie, ob die Ports verfügbar sind
4. Starten Sie Docker Desktop neu, falls nötig
