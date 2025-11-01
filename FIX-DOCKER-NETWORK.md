# 🔧 Docker Network iptables Fehler - Lösung

## Problem

```
ERROR: Failed to Setup IP tables: Unable to enable NAT rule
```

## ✅ Lösung

### Option 1: Docker-Daemon neu starten (Empfohlen)

**Auf dem Server ausführen:**

```bash
# 1. Docker stoppen
systemctl stop docker

# 2. Warten
sleep 5

# 3. Docker starten
systemctl start docker

# 4. Status prüfen
systemctl status docker

# 5. Netzwerke prüfen
docker network ls
```

### Option 2: Alte Netzwerke entfernen

```bash
# Entferne alle nicht verwendeten Netzwerke
docker network prune -f

# Entferne alle nicht verwendeten Ressourcen
docker system prune -f
```

### Option 3: iptables zurücksetzen (VORSICHT!)

**Nur wenn Option 1 und 2 nicht funktionieren:**

```bash
# iptables zurücksetzen (VORSICHT - kann Firewall-Regeln löschen!)
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X

# Docker neu starten
systemctl restart docker
```

### Option 4: Docker komplett neu installieren (letzte Option)

```bash
# Docker stoppen
systemctl stop docker

# Docker deinstallieren
apt-get remove docker docker-engine docker.io containerd runc

# Docker neu installieren
apt-get update
apt-get install -y docker.io docker-compose

# Docker starten
systemctl start docker
systemctl enable docker
```

## 🔍 Diagnose

### Prüfe Docker-Status:
```bash
systemctl status docker
```

### Prüfe iptables:
```bash
iptables -L -n
iptables -t nat -L -n
```

### Prüfe Docker-Netzwerke:
```bash
docker network ls
docker network inspect bridge
```

### Prüfe Docker-Logs:
```bash
journalctl -u docker -n 50
```

## ✅ Nach dem Fix

```bash
cd /opt/hd-app/HD_App_chart

# Versuche Container zu starten
docker-compose -f docker-compose.supabase.yml up -d

# Prüfe Status
docker-compose -f docker-compose.supabase.yml ps
```

## ⚠️ libprocesshider.so Warnung

Die Warnung:
```
ERROR: ld.so: object '/usr/local/lib/libprocesshider.so/usr/local/lib/libprocesshider.so' from /etc/ld.so.preload cannot be preloaded
```

**Ist normalerweise nicht kritisch** und kann ignoriert werden. Falls sie stört:

```bash
# Entferne die Preload-Datei (VORSICHT - kann andere Software beeinflussen!)
# Backup erstellen
cp /etc/ld.so.preload /etc/ld.so.preload.backup

# Kommentiere die Zeile aus oder entferne sie
sed -i 's|/usr/local/lib/libprocesshider.so||g' /etc/ld.so.preload
```

## 🚀 Schnell-Fix (Alles in einem)

```bash
systemctl stop docker && \
sleep 5 && \
docker network prune -f && \
systemctl start docker && \
sleep 5 && \
cd /opt/hd-app/HD_App_chart && \
docker-compose -f docker-compose.supabase.yml up -d && \
docker-compose -f docker-compose.supabase.yml ps
```

