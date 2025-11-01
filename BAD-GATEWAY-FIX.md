# Bad Gateway (502) Fehler beheben

## Übersicht

Ein "Bad Gateway" (502) Fehler tritt auf, wenn Nginx als Reverse Proxy den Upstream-Service (Frontend) nicht erreichen kann.

## Häufige Ursachen

1. **Frontend-Container läuft nicht**
   - Der Frontend-Container wurde nicht gestartet oder ist abgestürzt
   - Lösung: Container neu starten

2. **Netzwerk-Probleme**
   - Container sind nicht im gleichen Docker-Netzwerk
   - Lösung: Explizites Netzwerk in docker-compose.yml definiert (bereits implementiert)

3. **Frontend startet nicht korrekt**
   - Build-Fehler oder fehlende Umgebungsvariablen
   - Lösung: Logs prüfen und Build-Probleme beheben

4. **Port-Konflikte**
   - Port 3000 ist bereits belegt
   - Lösung: Port freigeben oder ändern

## Schnelle Lösung

### Schritt 1: Automatisches Diagnose- und Reparatur-Skript

```powershell
.\fix-bad-gateway.ps1
```

Dieses Skript:
- Prüft den Status aller Container
- Analysiert die Logs
- Testet die Netzwerk-Verbindung
- Startet Container neu falls nötig

### Schritt 2: Manuelle Reparatur

#### Option A: Container neu starten

```powershell
# Frontend neu starten
docker compose -f docker-compose.supabase.yml restart frontend

# Nginx neu starten
docker compose -f docker-compose.supabase.yml restart nginx

# Warten (15 Sekunden)
Start-Sleep -Seconds 15
```

#### Option B: Kompletter Neustart

```powershell
# Alle Container stoppen
docker compose -f docker-compose.supabase.yml down

# Container neu starten
docker compose -f docker-compose.supabase.yml up -d

# Status prüfen
docker compose -f docker-compose.supabase.yml ps
```

#### Option C: Frontend neu aufbauen

```powershell
# Frontend neu bauen und starten
docker compose -f docker-compose.supabase.yml up -d --build frontend

# Warten bis Build abgeschlossen
Start-Sleep -Seconds 30

# Logs prüfen
docker compose -f docker-compose.supabase.yml logs frontend
```

## Diagnose

### Container-Status prüfen

```powershell
docker compose -f docker-compose.supabase.yml ps
```

**Erwartete Ausgabe:**
- `frontend` sollte `Up` sein
- `nginx` sollte `Up` sein

### Logs prüfen

#### Frontend-Logs

```powershell
docker compose -f docker-compose.supabase.yml logs --tail=50 frontend
```

**Suchen nach:**
- `Error` oder `Failed`
- `EADDRINUSE` (Port bereits belegt)
- `ECONNREFUSED` (Verbindung verweigert)

#### Nginx Error-Logs

```powershell
$nginxContainer = docker ps --filter "name=nginx" --format "{{.Names}}" | Select-Object -First 1
docker exec $nginxContainer tail -50 /var/log/nginx/error.log
```

**Typische Fehler:**
- `connect() failed (111: Connection refused)`
- `upstream timed out`
- `no resolver defined`

### Netzwerk-Verbindung testen

#### Von Nginx zu Frontend

```powershell
$nginxContainer = docker ps --filter "name=nginx" --format "{{.Names}}" | Select-Object -First 1

# Ping-Test
docker exec $nginxContainer ping -c 2 frontend

# HTTP-Test
docker exec $nginxContainer wget -q -O- --timeout=5 http://frontend:3000/health
```

#### Direkter Frontend-Test (vom Host)

```powershell
Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
```

### Docker-Netzwerk prüfen

```powershell
# Netzwerk-Name finden
docker compose -f docker-compose.supabase.yml config | Select-String "networks"

# Netzwerk inspizieren
docker network inspect hd_app_chart_app-network

# Oder alle Netzwerke anzeigen
docker network ls
```

## Prävention

### 1. Explizites Netzwerk (bereits implementiert)

Die `docker-compose.supabase.yml` wurde aktualisiert mit:
- Explizitem `app-network` Netzwerk
- Allen Services sind im gleichen Netzwerk

### 2. Health Checks

Frontend-Container sollte Health Checks haben (in Dockerfile oder docker-compose.yml):

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### 3. Dependency Management

Nginx wartet auf Frontend mit `depends_on`:

```yaml
nginx:
  depends_on:
    - frontend
```

### 4. Monitoring

Regelmäßige Statusprüfung:

```powershell
# Tägliche Prüfung (z.B. als Cron-Job)
docker compose -f docker-compose.supabase.yml ps | Select-String "Exit"
```

## Erweiterte Fehlerbehebung

### Problem: Frontend startet, antwortet aber nicht

**Ursache:** Frontend läuft, aber auf falschem Port oder Hostname

**Lösung:**
1. Prüfe Frontend-Umgebungsvariablen:
   ```powershell
   docker compose -f docker-compose.supabase.yml exec frontend env | Select-String "PORT|HOSTNAME"
   ```
2. Prüfe ob Frontend auf 0.0.0.0:3000 lauscht:
   ```powershell
   docker compose -f docker-compose.supabase.yml exec frontend netstat -tlnp | Select-String "3000"
   ```

### Problem: Netzwerk existiert nicht

**Ursache:** Netzwerk wurde nicht erstellt

**Lösung:**
```powershell
# Netzwerk manuell erstellen
docker network create app-network

# Oder Compose-Datei neu laden
docker compose -f docker-compose.supabase.yml down
docker compose -f docker-compose.supabase.yml up -d
```

### Problem: Port bereits belegt

**Ursache:** Ein anderer Prozess verwendet Port 3000, 80 oder 443

**Lösung:**
```powershell
# Prozess auf Port 3000 finden
netstat -ano | Select-String ":3000"

# Oder auf Linux-Server:
# lsof -i :3000
# fuser -k 3000/tcp
```

## Kontakt & Support

Bei anhaltenden Problemen:
1. Vollständige Logs sammeln
2. Container-Status dokumentieren
3. Netzwerk-Konfiguration prüfen
4. System-Ressourcen prüfen (Speicher, CPU)

## Nützliche Befehle

```powershell
# Alle Container-Logs
docker compose -f docker-compose.supabase.yml logs

# Nur Fehler
docker compose -f docker-compose.supabase.yml logs | Select-String -Pattern "error|Error|ERROR|failed|Failed"

# Container-Ressourcen
docker stats

# System-Ressourcen
docker system df
```

