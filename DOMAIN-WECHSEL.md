# 🌐 Domain-Wechsel: www.the-connection-key.de

## Übersicht

**Alte Domain**: moonlightdatingapp.werdemeisterdeinergedanken.de  
**Neue Domain**: www.the-connection-key.de  
**Status**: ✅ SSL-Zertifikat bereits vorhanden

---

## ✅ Bereits durchgeführte Änderungen

### Aktualisierte Dateien:

1. **nginx/nginx.conf**
   - Server-Name geändert zu: `www.the-connection-key.de` und `the-connection-key.de`
   - SSL-Zertifikat-Pfad aktualisiert: `/etc/letsencrypt/live/www.the-connection-key.de/`

2. **setup-ssl-hetzner.sh**
   - Domain-Variable aktualisiert

3. **setup-ssl-hetzner.ps1**
   - Domain-Variable aktualisiert

4. **reboot-all-servers.ps1**
   - Domain-Test aktualisiert

5. **deploy-new-domain.ps1** (neu erstellt)
   - Automatisches Deployment-Skript für den Domain-Wechsel

---

## 🚀 Deployment auf Hetzner

### Option 1: Automatisches Deployment (Empfohlen)

Führe einfach das PowerShell-Skript aus:

```powershell
.\deploy-new-domain.ps1
```

Das Skript führt folgende Schritte aus:
1. ✅ Verbindung zum Server testen
2. ✅ Domain-Erreichbarkeit prüfen
3. ✅ SSL-Zertifikat überprüfen
4. ✅ Neue Nginx-Konfiguration hochladen
5. ✅ Konfiguration testen
6. ✅ Nginx-Container neu laden
7. ✅ Status überprüfen
8. ✅ Domain testen

### Option 2: Manuelles Deployment

#### Schritt 1: Mit Server verbinden

```powershell
ssh -i "Domain the connection Key" root@138.199.237.34
```

#### Schritt 2: Nginx-Konfiguration hochladen

Von deinem lokalen PC:

```powershell
scp -i "Domain the connection Key" nginx/nginx.conf root@138.199.237.34:/opt/hd-app/nginx/nginx.conf
```

#### Schritt 3: SSL-Zertifikat überprüfen

Auf dem Server:

```bash
# Überprüfen, ob Zertifikat existiert
ls -la /etc/letsencrypt/live/www.the-connection-key.de/

# Sollte zeigen:
# - fullchain.pem
# - privkey.pem
```

Falls Zertifikat nicht vorhanden:

```bash
certbot certonly --nginx \
  --non-interactive \
  --agree-tos \
  --email deine-email@example.com \
  -d www.the-connection-key.de \
  -d the-connection-key.de \
  --rsa-key-size 4096
```

#### Schritt 4: Nginx-Konfiguration testen

```bash
cd /opt/hd-app
docker-compose exec nginx nginx -t
```

Erwartete Ausgabe:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

#### Schritt 5: Nginx neu laden

```bash
docker-compose restart nginx
```

#### Schritt 6: Status überprüfen

```bash
# Container-Status
docker-compose ps

# Nginx-Logs
docker-compose logs -f nginx
```

#### Schritt 7: Domain testen

Von deinem PC:

```powershell
# HTTPS-Test
curl https://www.the-connection-key.de

# HTTP-Redirect-Test
curl -I http://www.the-connection-key.de
```

---

## 🔍 Überprüfungen

### DNS-Einträge

Überprüfe die DNS-Einträge für die neue Domain:

```powershell
nslookup www.the-connection-key.de
```

Sollte auf `138.199.237.34` zeigen.

### SSL-Zertifikat

Überprüfe das SSL-Zertifikat online:
- https://www.ssllabs.com/ssltest/analyze.html?d=www.the-connection-key.de

Oder lokal:

```powershell
openssl s_client -connect www.the-connection-key.de:443 -servername www.the-connection-key.de
```

### HTTPS-Funktionalität

```powershell
# Windows
Invoke-WebRequest -Uri "https://www.the-connection-key.de" -UseBasicParsing

# Oder im Browser
https://www.the-connection-key.de
```

---

## 🌐 Domain-Konfiguration

### DNS-Einträge (bei deinem Domain-Anbieter)

Stelle sicher, dass folgende DNS-Einträge existieren:

| Typ   | Name | Wert            | TTL  |
|-------|------|-----------------|------|
| A     | www  | 138.199.237.34  | 3600 |
| A     | @    | 138.199.237.34  | 3600 |
| CNAME | www  | the-connection-key.de | 3600 |

**Hinweis**: Entweder A-Records ODER CNAME, nicht beides für `www`.

### Empfohlene Konfiguration:

```
@ (Root)          A      138.199.237.34
www               CNAME  the-connection-key.de
```

---

## 🔐 SSL-Zertifikat

### Zertifikat-Informationen

Auf dem Server:

```bash
certbot certificates
```

### Auto-Renewal

Das Zertifikat erneuert sich automatisch. Überprüfung:

```bash
# Dry-Run Test
certbot renew --dry-run

# Cronjob überprüfen
systemctl status certbot.timer
```

### Manuelles Erneuern

Falls nötig:

```bash
certbot renew
```

---

## 🐛 Troubleshooting

### Problem: Nginx startet nicht

**Symptom**: Container restart-loop

**Lösung**:

```bash
# Logs überprüfen
docker-compose logs nginx

# Häufige Ursachen:
# 1. Zertifikat nicht gefunden
ls -la /etc/letsencrypt/live/www.the-connection-key.de/

# 2. Nginx-Konfiguration fehlerhaft
docker-compose exec nginx nginx -t

# 3. Port bereits belegt
netstat -tlnp | grep :80
netstat -tlnp | grep :443
```

### Problem: 502 Bad Gateway

**Symptom**: Nginx läuft, aber Fehler beim Zugriff

**Lösung**:

```bash
# Frontend-Container überprüfen
docker-compose ps frontend

# Frontend-Logs
docker-compose logs frontend

# Frontend neu starten
docker-compose restart frontend
```

### Problem: SSL-Zertifikat-Fehler

**Symptom**: Browser zeigt Zertifikat-Warnung

**Lösung**:

```bash
# Zertifikat überprüfen
certbot certificates

# Falls abgelaufen oder falsch, neu erstellen
certbot certonly --nginx \
  --force-renewal \
  -d www.the-connection-key.de \
  -d the-connection-key.de
```

### Problem: Domain nicht erreichbar

**Symptom**: Timeout oder DNS-Fehler

**Lösung**:

1. DNS-Einträge überprüfen:
   ```powershell
   nslookup www.the-connection-key.de
   ```

2. Server-Firewall:
   ```bash
   ufw status
   ufw allow 80
   ufw allow 443
   ```

3. Container-Status:
   ```bash
   docker-compose ps
   ```

---

## 📊 Monitoring

### Container-Status

```bash
# Alle Container
docker-compose ps

# Nur Nginx
docker ps --filter name=nginx
```

### Logs

```bash
# Echtzeit-Logs
docker-compose logs -f nginx

# Letzte 50 Zeilen
docker-compose logs --tail=50 nginx

# Alle Services
docker-compose logs -f
```

### Ressourcen

```bash
# Docker-Stats
docker stats

# Disk-Usage
df -h

# Memory
free -h
```

---

## 🔗 Wichtige URLs

### Produktion

- **Hauptdomain**: https://www.the-connection-key.de
- **Alternative**: https://the-connection-key.de
- **Server-IP**: http://138.199.237.34

### Monitoring

- **Grafana**: http://138.199.237.34:3001
- **Prometheus**: http://138.199.237.34:9090
- **Node Exporter**: http://138.199.237.34:9100

### Entwicklung (lokal)

- **Frontend**: http://localhost:3000
- **Nginx**: http://localhost:80
- **Grafana**: http://localhost:3001
- **Prometheus**: http://localhost:9090

---

## 📝 Checkliste

### Vor dem Deployment

- [ ] DNS-Einträge überprüft
- [ ] SSL-Zertifikat vorhanden
- [ ] SSH-Zugang funktioniert
- [ ] Lokale Nginx-Config getestet
- [ ] Backup der alten Konfiguration

### Deployment

- [ ] Nginx-Config hochgeladen
- [ ] Config-Test erfolgreich
- [ ] Container neu gestartet
- [ ] Logs überprüft
- [ ] Keine Fehler in Logs

### Nach dem Deployment

- [ ] HTTPS funktioniert
- [ ] HTTP leitet auf HTTPS um
- [ ] Frontend lädt korrekt
- [ ] SSL-Zertifikat valide
- [ ] Grafana erreichbar
- [ ] Prometheus erreichbar
- [ ] Monitoring-Daten kommen an

---

## 📞 Support-Befehle

### Schnell-Diagnose

```bash
# Server-Status komplett
docker-compose ps && \
docker-compose logs --tail=20 nginx && \
curl -I https://www.the-connection-key.de
```

### Nginx neu starten

```bash
cd /opt/hd-app
docker-compose restart nginx
```

### Alle Services neu starten

```bash
cd /opt/hd-app
docker-compose down
docker-compose up -d
```

### Logs live verfolgen

```bash
docker-compose logs -f
```

---

## ✅ Erfolgreicher Wechsel

Nach erfolgreichem Deployment solltest du sehen:

1. ✅ Nginx-Container läuft ohne Restart
2. ✅ Keine Fehler in Nginx-Logs
3. ✅ HTTPS erreichbar: https://www.the-connection-key.de
4. ✅ HTTP leitet auf HTTPS um
5. ✅ SSL-Zertifikat valide
6. ✅ Frontend lädt korrekt
7. ✅ Alle Monitoring-Services laufen

---

Viel Erfolg! 🚀

