# 🔐 SSL-Zertifikat Setup Anleitung

## Problem-Erklärung

### Warum fehlen die SSL-Zertifikate lokal?

Die SSL-Zertifikate fehlen auf deinem Windows-PC, weil:

1. **Let's Encrypt Zertifikate** werden für öffentliche Domains ausgestellt
2. Sie werden typischerweise auf **Produktions-Servern** (wie Hetzner) erstellt
3. Lokal auf Windows gibt es keinen `/etc/letsencrypt` Ordner
4. Für lokale Entwicklung benötigt man **keine SSL-Zertifikate**

### Lösung

✅ **Lokal (Windows)**: Verwende `nginx-dev.conf` ohne SSL (nur HTTP)  
✅ **Produktion (Hetzner)**: Verwende `nginx.conf` mit SSL-Zertifikaten

---

## ✅ Lokales Problem gelöst

Das lokale Problem wurde bereits behoben:

- ✅ `docker-compose.supabase.yml` aktualisiert
- ✅ Verwendet jetzt `nginx-dev.conf` (HTTP-only)
- ✅ Nginx läuft ohne Fehler auf Port 80
- ✅ Alle Services sind erreichbar

### Lokale URLs:
- Frontend: http://localhost:3000
- Nginx: http://localhost:80
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090

---

## 🔐 SSL für Hetzner einrichten

### Voraussetzungen

1. **DNS-Einträge konfigurieren**
   - Typ: `A`
   - Name: `@` oder `moonlightdatingapp`
   - Wert: `138.199.237.34`
   - TTL: `3600` (oder Auto)

2. **Firewall-Ports öffnen**
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 22 (SSH)

3. **SSH-Zugang zum Server**

### Option 1: Automatisches Setup (Empfohlen)

#### Schritt 1: DNS überprüfen

Öffne PowerShell und führe aus:

```powershell
nslookup moonlightdatingapp.werdemeisterdeinergedanken.de
```

**Erwartetes Ergebnis**: `138.199.237.34`

#### Schritt 2: SSL-Setup ausführen

```powershell
.\setup-ssl-hetzner.ps1
```

Das Skript führt folgende Schritte automatisch aus:
1. DNS-Einträge überprüfen
2. Setup-Skript auf Server hochladen
3. Certbot installieren
4. SSL-Zertifikat anfordern
5. Docker-Container mit SSL-Konfiguration starten
6. Status überprüfen

#### Schritt 3: Testen

Nach dem Setup:

```powershell
# HTTPS testen
curl https://moonlightdatingapp.werdemeisterdeinergedanken.de
```

---

### Option 2: Manuelles Setup

#### Schritt 1: Mit Server verbinden

```powershell
ssh -i "Domain the connection Key" root@138.199.237.34
```

#### Schritt 2: Certbot installieren

```bash
apt update
apt install -y certbot python3-certbot-nginx
```

#### Schritt 3: Docker-Container stoppen

```bash
cd /opt/hd-app
docker-compose down
```

#### Schritt 4: SSL-Zertifikat anfordern

```bash
certbot certonly --nginx \
  --non-interactive \
  --agree-tos \
  --email deine-email@example.com \
  -d moonlightdatingapp.werdemeisterdeinergedanken.de \
  --rsa-key-size 4096
```

#### Schritt 5: Zertifikat überprüfen

```bash
certbot certificates
```

Erwartete Ausgabe:
```
Certificate Name: moonlightdatingapp.werdemeisterdeinergedanken.de
  Domains: moonlightdatingapp.werdemeisterdeinergedanken.de
  Expiry Date: [90 Tage in der Zukunft]
  Certificate Path: /etc/letsencrypt/live/moonlightdatingapp.werdemeisterdeinergedanken.de/fullchain.pem
  Private Key Path: /etc/letsencrypt/live/moonlightdatingapp.werdemeisterdeinergedanken.de/privkey.pem
```

#### Schritt 6: Nginx-Konfiguration mit SSL hochladen

```bash
# Nginx-Konfiguration erstellen/überprüfen
nano /opt/hd-app/nginx/nginx.conf
```

Stelle sicher, dass folgende Zeilen vorhanden sind:

```nginx
ssl_certificate /etc/letsencrypt/live/moonlightdatingapp.werdemeisterdeinergedanken.de/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/moonlightdatingapp.werdemeisterdeinergedanken.de/privkey.pem;
```

#### Schritt 7: Docker-Compose-Datei anpassen

```bash
nano /opt/hd-app/docker-compose.yml
```

Stelle sicher, dass der nginx-Service die Zertifikate mountet:

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - /etc/letsencrypt:/etc/letsencrypt:ro
  restart: unless-stopped
```

#### Schritt 8: Container mit SSL starten

```bash
cd /opt/hd-app
docker-compose up -d
```

#### Schritt 9: Status überprüfen

```bash
# Container-Status
docker ps

# Nginx-Logs
docker logs <nginx-container-id>

# HTTPS testen
curl https://moonlightdatingapp.werdemeisterdeinergedanken.de
```

---

## 📋 DNS-Konfiguration

### Bei deinem Domain-Anbieter (z.B. IONOS, Strato, etc.)

Erstelle folgende DNS-Einträge:

| Typ | Name                    | Wert            | TTL  |
|-----|-------------------------|-----------------|------|
| A   | moonlightdatingapp      | 138.199.237.34  | 3600 |
| A   | @                       | 138.199.237.34  | 3600 |

**Hinweis**: DNS-Änderungen können 5-60 Minuten dauern.

### DNS-Propagation überprüfen

```powershell
# Windows
nslookup moonlightdatingapp.werdemeisterdeinergedanken.de

# Online-Tool
# Besuche: https://dnschecker.org
```

---

## 🔄 SSL-Zertifikat Auto-Renewal

Certbot richtet automatisch einen Cronjob ein, der Zertifikate vor Ablauf erneuert.

### Manuell testen:

```bash
# Dry-run (Simulation)
certbot renew --dry-run

# Echte Erneuerung (falls nötig)
certbot renew
```

### Auto-Renewal überprüfen:

```bash
# Cronjob überprüfen
systemctl status certbot.timer

# Oder
crontab -l | grep certbot
```

---

## 🧪 Testing

### Lokale Tests (Windows)

```powershell
# HTTP-Test
curl http://localhost:80

# Frontend direkt
curl http://localhost:3000

# Grafana
curl http://localhost:3001
```

### Hetzner-Server Tests

```bash
# Auf dem Server
curl http://localhost:3000  # Frontend
curl http://localhost:80    # Nginx
curl https://moonlightdatingapp.werdemeisterdeinergedanken.de  # HTTPS
```

### Von außen testen

```powershell
# HTTPS
curl https://moonlightdatingapp.werdemeisterdeinergedanken.de

# SSL-Zertifikat überprüfen
openssl s_client -connect moonlightdatingapp.werdemeisterdeinergedanken.de:443 -servername moonlightdatingapp.werdemeisterdeinergedanken.de

# Online-Tool
# Besuche: https://www.ssllabs.com/ssltest/
```

---

## 🚨 Troubleshooting

### Problem: DNS zeigt nicht auf den Server

**Symptom**: `nslookup` gibt falsche IP zurück

**Lösung**:
1. DNS-Einträge beim Domain-Anbieter überprüfen
2. 15-60 Minuten warten (DNS-Propagation)
3. DNS-Cache leeren: `ipconfig /flushdns`

### Problem: Certbot schlägt fehl

**Symptom**: "Failed authorization procedure"

**Lösung**:
1. Firewall überprüfen: `ufw status`
2. Port 80 öffnen: `ufw allow 80`
3. Nginx stoppen: `systemctl stop nginx`
4. Erneut versuchen

### Problem: Nginx startet nicht mit SSL

**Symptom**: Container restart-loop

**Lösung**:
1. Logs checken: `docker logs <nginx-container>`
2. Zertifikat-Pfade überprüfen: `ls -la /etc/letsencrypt/live/`
3. Nginx-Konfiguration testen: `nginx -t`

### Problem: 502 Bad Gateway

**Symptom**: Nginx läuft, aber 502-Fehler

**Lösung**:
1. Frontend-Container überprüfen: `docker ps | grep frontend`
2. Frontend-Logs: `docker logs <frontend-container>`
3. Upstream-Konfiguration überprüfen

---

## 📚 Nützliche Befehle

### Docker

```bash
# Alle Container anzeigen
docker ps -a

# Logs eines Containers
docker logs -f <container-name>

# Container neu starten
docker restart <container-name>

# Alle Container neu starten
docker-compose restart

# Container neu erstellen
docker-compose up -d --force-recreate
```

### Certbot

```bash
# Alle Zertifikate anzeigen
certbot certificates

# Zertifikat erneuern
certbot renew

# Zertifikat löschen
certbot delete --cert-name moonlightdatingapp.werdemeisterdeinergedanken.de

# Dry-run Test
certbot renew --dry-run
```

### Nginx

```bash
# Konfiguration testen
nginx -t

# Nginx neu laden
nginx -s reload

# Nginx-Status
systemctl status nginx
```

---

## 📞 Support

Bei Problemen:

1. **Logs überprüfen**:
   - Docker: `docker logs <container-name>`
   - Nginx: `tail -f /var/log/nginx/error.log`
   - Certbot: `tail -f /var/log/letsencrypt/letsencrypt.log`

2. **Status überprüfen**:
   - Docker: `docker ps`
   - Nginx: `systemctl status nginx`
   - Firewall: `ufw status`

3. **Verbindung testen**:
   - HTTP: `curl -v http://moonlightdatingapp.werdemeisterdeinergedanken.de`
   - HTTPS: `curl -v https://moonlightdatingapp.werdemeisterdeinergedanken.de`

---

## ✅ Checkliste

### Lokale Entwicklung (Windows)
- [ ] Docker Desktop läuft
- [ ] `docker-compose.supabase.yml` verwendet `nginx-dev.conf`
- [ ] Nginx läuft ohne SSL-Fehler
- [ ] Frontend erreichbar auf http://localhost:3000
- [ ] Nginx erreichbar auf http://localhost:80

### Produktion (Hetzner)
- [ ] DNS-Einträge konfiguriert
- [ ] DNS zeigt auf 138.199.237.34
- [ ] SSH-Zugang funktioniert
- [ ] Firewall-Ports geöffnet (80, 443, 22)
- [ ] Certbot installiert
- [ ] SSL-Zertifikat erstellt
- [ ] Nginx-Konfiguration mit SSL-Pfaden
- [ ] Docker-Container laufen
- [ ] HTTPS funktioniert
- [ ] Auto-Renewal aktiv

---

## 📝 Dateien

Erstellte Dateien für SSL-Setup:

1. **setup-ssl-hetzner.sh** - Bash-Skript für Linux/Hetzner
2. **setup-ssl-hetzner.ps1** - PowerShell-Skript für Windows
3. **SSL-SETUP-ANLEITUNG.md** - Diese Anleitung

---

Viel Erfolg! 🚀

