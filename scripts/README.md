# 🚀 Deployment-Skripte

**Ab sofort: Nur noch über GitHub deployen - Nur noch über diese 3 Skripte!**

---

## 📋 Die 3 Hauptskripte

### 1. `git-pull.sh`
**Zweck:** Code vom GitHub Repository holen

**Verwendung:**
```bash
cd /opt/hd-app/HD_App_chart/scripts
./git-pull.sh
```

**Was es tut:**
- Git fetch von GitHub
- Git pull (neueste Änderungen)
- Zeigt aktuellen Commit-Hash

---

### 2. `docker-build.sh`
**Zweck:** Docker Container neu bauen

**Verwendung:**
```bash
cd /opt/hd-app/HD_App_chart/scripts
./docker-build.sh
```

**Was es tut:**
- Stoppt laufende Container
- Baut Frontend neu (no-cache)
- Bereit für Start

---

### 3. `docker-start.sh`
**Zweck:** Docker Container starten

**Verwendung:**
```bash
cd /opt/hd-app/HD_App_chart/scripts
./docker-start.sh
```

**Was es tut:**
- Startet alle Container
- Zeigt Container-Status
- Zeigt letzte Logs

---

## 🚀 All-in-One: `deploy-all.sh`

**Zweck:** Alle 3 Schritte nacheinander ausführen

**Verwendung:**
```bash
cd /opt/hd-app/HD_App_chart/scripts
./deploy-all.sh
```

**Was es tut:**
1. Git Pull
2. Docker Build
3. Docker Start

---

## ⚙️ Ersteinrichtung

Beim ersten Mal müssen die Skripte ausführbar gemacht werden:

```bash
cd /opt/hd-app/HD_App_chart/scripts
chmod +x *.sh
```

---

## 📝 Vollständiger Deployment-Ablauf

### Schritt 1: Lokale Änderungen zu GitHub pushen

```powershell
# Lokale Entwicklung
git add .
git commit -m "feat: neue Funktion"
git push origin main
```

### Schritt 2: Auf Server deployen

**Option A: All-in-One**
```bash
ssh root@138.199.237.34
cd /opt/hd-app/HD_App_chart/scripts
./deploy-all.sh
```

**Option B: Schritt für Schritt**
```bash
ssh root@138.199.237.34
cd /opt/hd-app/HD_App_chart/scripts

./git-pull.sh
./docker-build.sh
./docker-start.sh
```

---

## ✅ Checkliste

Vor jedem Deployment:

- [ ] Lokale Änderungen committed (`git commit`)
- [ ] Code zu GitHub gepusht (`git push origin main`)
- [ ] SSH-Verbindung zum Server funktioniert

Nach jedem Deployment:

- [ ] Container laufen (`docker-compose ps`)
- [ ] App erreichbar (`http://138.199.237.34`)
- [ ] Logs ohne Fehler

---

## 🚨 Fehlerbehandlung

Falls ein Skript fehlschlägt:

```bash
# Logs prüfen
cd /opt/hd-app/HD_App_chart
docker-compose -f docker-compose.supabase.yml logs

# Container-Status prüfen
docker-compose -f docker-compose.supabase.yml ps

# Container manuell stoppen
docker-compose -f docker-compose.supabase.yml down
```

---

## ⚠️ WICHTIG

**Nur noch diese 3 Skripte verwenden!**

- ❌ Keine manuellen Git-Befehle
- ❌ Keine manuellen Docker-Befehle
- ❌ Keine PowerShell-Skripte von lokal

**Alles über GitHub → Server-Skripte!**

