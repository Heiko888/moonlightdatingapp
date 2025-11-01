# 🚀 Deployment Workflow - GitHub Actions → Hetzner

> ⚠️ **WICHTIG:** Ab sofort gilt die neue Deployment-Strategie!
> 
> **Siehe:** `DEPLOYMENT-STRATEGY-FINAL.md` für die aktuelle Strategie:
> - ✅ Nur noch über GitHub deployen
> - ✅ Nur noch über die 3 Server-Skripte (`scripts/git-pull.sh`, `scripts/docker-build.sh`, `scripts/docker-start.sh`)
> 
> Diese Dokumentation dient als Referenz für GitHub Actions.

## Übersicht

Der Deployment-Workflow läuft über **GitHub Actions** und **Docker Container Registry**.

```
Lokale Änderungen
    ↓
Git Push zu GitHub
    ↓
GitHub Actions (automatisch)
    ├─ Build Docker Image
    ├─ Push zu ghcr.io
    └─ Tests & Quality Checks
    ↓
Hetzner Server Update (manuell)
    ├─ Pull neues Image
    ├─ Container neu starten
    └─ Health Checks
```

---

## ✅ Durchgeführte Schritte

### 1. Lokale Änderungen
- ✅ Domain geändert: `www.the-connection-key.de`
- ✅ nginx/nginx.conf aktualisiert
- ✅ SSL-Zertifikat-Pfade konfiguriert
- ✅ Deployment-Skripte erstellt
- ✅ Dokumentation erstellt

### 2. Git Commit & Push
```powershell
git add nginx/nginx.conf docker-compose.supabase.yml ...
git commit -m "feat(domain): wechsel zu www.the-connection-key.de"
git push origin main
```
✅ **Erfolgreich durchgeführt**

Commit: `eccd4726`
- 8 Dateien geändert
- 1483 neue Zeilen
- 9 gelöschte Zeilen

---

## 🔄 Was jetzt passiert (automatisch)

### GitHub Actions Workflows

Zwei Workflows werden automatisch gestartet:

#### 1. CI/CD Pipeline (`.github/workflows/ci-cd.yml`)
```yaml
Jobs:
  - lint-and-typecheck  # ESLint & TypeScript
  - build-test         # npm build
  - docker-build-test  # Docker Build Test
```

#### 2. Docker Image Build (`.github/workflows/docker-image.yml`)
```yaml
Jobs:
  - build-and-push     # Baut und pusht Image
    ↓
  Registry: ghcr.io/heiko888/moonlightdatingapp:main
```

### Status überprüfen:
🔗 https://github.com/Heiko888/moonlightdatingapp/actions

**Erwartete Dauer**: 5-10 Minuten

---

## 📦 Nach GitHub Actions Build

### Schritt 1: Build-Status prüfen

Gehe zu GitHub Actions und warte bis beide Workflows erfolgreich sind:
- ✅ CI/CD Pipeline
- ✅ Docker Image Build

### Schritt 2: Hetzner Server aktualisieren

Führe das Update-Skript aus:

```powershell
.\update-hetzner-after-build.ps1
```

**Das Skript macht:**
1. Verbindung zum Server testen
2. Neues Docker-Image pullen
3. Container neu starten (frontend + nginx)
4. Logs überprüfen
5. Domain testen (HTTP + HTTPS)

**Erwartete Dauer**: 2-3 Minuten

---

## 🔍 Manuelle Alternative

Falls du die Schritte manuell durchführen möchtest:

### 1. Zum Server verbinden
```powershell
ssh -i "Domain the connection Key" root@138.199.237.34
```

### 2. Zum App-Verzeichnis wechseln
```bash
cd /opt/hd-app
```

### 3. Aktuellen Status prüfen
```bash
docker-compose ps
```

### 4. Neues Image pullen
```bash
docker-compose pull
```

### 5. Container neu starten
```bash
# Nur Frontend und Nginx
docker-compose up -d --force-recreate frontend nginx

# ODER alle Container
docker-compose up -d --force-recreate
```

### 6. Logs überprüfen
```bash
# Alle Logs
docker-compose logs -f

# Nur Nginx
docker-compose logs -f nginx

# Nur Frontend
docker-compose logs -f frontend
```

### 7. Status überprüfen
```bash
docker-compose ps
```

### 8. Domain testen
```bash
# Von Server aus
curl -I https://www.the-connection-key.de

# Oder von lokalem PC
curl -I https://www.the-connection-key.de
```

---

## ✅ Erfolgskriterien

Nach dem erfolgreichen Deployment solltest du sehen:

### 1. Container-Status
```bash
NAME                    STATUS          PORTS
frontend                Up X minutes    3000/tcp
nginx                   Up X minutes    80/tcp, 443/tcp
grafana                 Up X minutes    3001/tcp
prometheus              Up X minutes    9090/tcp
```

### 2. Nginx-Logs
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```
Keine Fehler bezüglich SSL-Zertifikaten!

### 3. HTTP-Test
```bash
curl -I http://www.the-connection-key.de
# Erwartete Antwort: HTTP/1.1 301 Moved Permanently
```

### 4. HTTPS-Test
```bash
curl -I https://www.the-connection-key.de
# Erwartete Antwort: HTTP/2 200
```

### 5. Browser-Test
- ✅ https://www.the-connection-key.de lädt
- ✅ Kein SSL-Zertifikat-Fehler
- ✅ Grünes Schloss im Browser
- ✅ Frontend lädt korrekt

---

## 🐛 Troubleshooting

### Problem 1: GitHub Actions schlägt fehl

**Symptom**: Workflow-Status ist rot

**Lösung**:
1. Klick auf den fehlgeschlagenen Workflow
2. Öffne den fehlgeschlagenen Job
3. Prüfe die Logs
4. Häufige Ursachen:
   - Build-Fehler → Code-Fehler beheben
   - Docker-Build-Fehler → Dockerfile prüfen
   - Tests schlagen fehl → Tests reparieren

### Problem 2: Docker-Pull schlägt fehl

**Symptom**: `Error response from daemon: pull access denied`

**Lösung**:
```bash
# Docker Login zum GitHub Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u heiko888 --password-stdin

# Oder: Image ist noch nicht fertig gebaut
# → Warte auf GitHub Actions Abschluss
```

### Problem 3: Nginx startet nicht

**Symptom**: `nginx-1  Restarting`

**Lösung**:
```bash
# Logs prüfen
docker-compose logs nginx

# Häufige Ursachen:
# 1. SSL-Zertifikat nicht gefunden
ls -la /etc/letsencrypt/live/www.the-connection-key.de/

# 2. Nginx-Config fehlerhaft
docker-compose exec nginx nginx -t

# 3. Port bereits belegt
netstat -tlnp | grep :80
netstat -tlnp | grep :443
```

### Problem 4: SSL-Zertifikat-Fehler

**Symptom**: Browser zeigt "Nicht sicher"

**Lösung 1**: Zertifikat überprüfen
```bash
certbot certificates
```

**Lösung 2**: Neues Zertifikat erstellen
```bash
certbot certonly --nginx \
  --non-interactive \
  --agree-tos \
  --email deine-email@example.com \
  -d www.the-connection-key.de \
  -d the-connection-key.de
```

**Lösung 3**: Container neu starten
```bash
docker-compose restart nginx
```

### Problem 5: 502 Bad Gateway

**Symptom**: Nginx läuft, aber 502-Fehler

**Lösung**:
```bash
# Frontend-Container prüfen
docker-compose ps frontend

# Frontend-Logs
docker-compose logs frontend

# Frontend neu starten
docker-compose restart frontend
```

---

## 📊 Monitoring

### Container-Status überwachen
```bash
# Echtzeit-Updates alle 2 Sekunden
watch -n 2 'docker-compose ps'

# Ressourcen-Nutzung
docker stats
```

### Logs verfolgen
```bash
# Alle Services
docker-compose logs -f

# Nur Fehler
docker-compose logs -f | grep -i error

# Nur Warnungen und Fehler
docker-compose logs -f | grep -iE 'warn|error'
```

### Health Checks
```bash
# Nginx Health
curl http://138.199.237.34/health

# Frontend direkt
curl http://138.199.237.34:3000

# HTTPS
curl -I https://www.the-connection-key.de
```

---

## 🔗 Wichtige Links

### GitHub
- **Repository**: https://github.com/Heiko888/moonlightdatingapp
- **Actions**: https://github.com/Heiko888/moonlightdatingapp/actions
- **Container Registry**: https://github.com/Heiko888?tab=packages

### Hetzner Server
- **Frontend**: http://138.199.237.34:3000
- **Grafana**: http://138.199.237.34:3001
- **Prometheus**: http://138.199.237.34:9090

### Produktion
- **Hauptdomain**: https://www.the-connection-key.de
- **Alternative**: https://the-connection-key.de

---

## 📝 Deployment Checkliste

### Vor dem Deployment
- [x] Code-Änderungen getestet
- [x] Konfigurationen aktualisiert
- [x] Dokumentation erstellt
- [x] Commit erstellt
- [x] Push zu GitHub

### Während des Deployments
- [ ] GitHub Actions Workflows überprüfen
- [ ] Build-Logs überprüfen
- [ ] Warten bis Build abgeschlossen
- [ ] Docker-Image-Version notieren

### Server-Update
- [ ] Verbindung zum Server testen
- [ ] Aktuellen Status dokumentieren
- [ ] Backup erstellen (optional)
- [ ] Neues Image pullen
- [ ] Container neu starten
- [ ] Logs überprüfen

### Nach dem Deployment
- [ ] Container-Status OK
- [ ] Keine Fehler in Logs
- [ ] HTTP funktioniert
- [ ] HTTPS funktioniert
- [ ] Frontend lädt korrekt
- [ ] SSL-Zertifikat valide
- [ ] Domain im Browser testen
- [ ] Monitoring-Daten prüfen

---

## 🚀 Nächste Schritte

1. **Warte auf GitHub Actions** (5-10 Min)
   - Überprüfe: https://github.com/Heiko888/moonlightdatingapp/actions

2. **Server aktualisieren** (2-3 Min)
   ```powershell
   .\update-hetzner-after-build.ps1
   ```

3. **Domain testen**
   - Browser: https://www.the-connection-key.de
   - Überprüfe SSL-Zertifikat
   - Teste Funktionalität

4. **Optional: Monitoring einrichten**
   - Grafana: http://138.199.237.34:3001
   - Prometheus: http://138.199.237.34:9090

---

## 📞 Support

Bei Problemen:

1. **Logs überprüfen**
   - GitHub Actions: https://github.com/Heiko888/moonlightdatingapp/actions
   - Server: `docker-compose logs`

2. **Status prüfen**
   - Container: `docker-compose ps`
   - Nginx: `docker-compose exec nginx nginx -t`

3. **Verbindung testen**
   - HTTP: `curl -v http://www.the-connection-key.de`
   - HTTPS: `curl -v https://www.the-connection-key.de`

---

**Erstellt**: 2025-10-18  
**Letztes Update**: Nach Git Push (Commit: eccd4726)  
**Status**: ✅ GitHub Push erfolgreich, warte auf Build  

