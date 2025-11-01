# 🚀 DEPLOYMENT-STRATEGIE - FINAL

**Ab sofort gilt: Nur noch über GitHub deployen - Nur noch über 3 Skripte auf dem Server**

---

## ⚠️ WICHTIG: DEPLOYMENT-REGELN

### ✅ ERLAUBT:
1. **GitHub-basiertes Deployment** - Alle Änderungen müssen zuerst zu GitHub gepusht werden
2. **Nur die 3 Server-Skripte verwenden** - Keine manuellen Befehle mehr

### ❌ VERBOTEN:
- ❌ Direktes SSH auf den Server und manuelle Befehle
- ❌ Lokale PowerShell-Skripte, die direkt auf den Server zugreifen
- ❌ Manuelles `git pull` auf dem Server
- ❌ Manuelles `docker-compose` ohne Skripte
- ❌ Alle anderen Deployment-Wege

---

## 📋 DEPLOYMENT-WORKFLOW

```
Lokale Änderungen
    ↓
git commit & push origin main
    ↓
GitHub Repository (main branch)
    ↓
Hetzner Server (SSH)
    ├─ Skript 1: git-pull.sh
    ├─ Skript 2: docker-build.sh
    └─ Skript 3: docker-start.sh
    ↓
Production live
```

---

## 🔧 DIE 3 SERVER-SKRIPTE

Alle 3 Skripte befinden sich auf dem Hetzner-Server unter:
```
/opt/hd-app/HD_App_chart/scripts/
```

### **Skript 1: `git-pull.sh`**
**Zweck:** Code vom GitHub Repository holen

```bash
#!/bin/bash
# Git Pull - Hole neuesten Code von GitHub

cd /opt/hd-app/HD_App_chart

echo "==================================================="
echo "  GIT PULL - GitHub Repository"
echo "==================================================="
echo ""

echo "1. Fetching from GitHub..."
git fetch origin main

echo "2. Pulling latest changes..."
git pull origin main

echo "3. Showing current commit..."
git rev-parse --short HEAD
git log -1 --oneline

echo ""
echo "==================================================="
echo "  GIT PULL COMPLETE"
echo "==================================================="
```

**Verwendung:**
```bash
ssh root@138.199.237.34
cd /opt/hd-app/HD_App_chart/scripts
./git-pull.sh
```

---

### **Skript 2: `docker-build.sh`**
**Zweck:** Docker Container neu bauen

```bash
#!/bin/bash
# Docker Build - Baue Container neu

cd /opt/hd-app/HD_App_chart

echo "==================================================="
echo "  DOCKER BUILD - Container bauen"
echo "==================================================="
echo ""

echo "1. Stoppe laufende Container..."
docker-compose -f docker-compose.supabase.yml down

echo ""
echo "2. Baue Frontend neu (no-cache)..."
docker-compose -f docker-compose.supabase.yml build --no-cache frontend

echo ""
echo "3. Build abgeschlossen!"
echo ""

echo "==================================================="
echo "  DOCKER BUILD COMPLETE"
echo "==================================================="
```

**Verwendung:**
```bash
ssh root@138.199.237.34
cd /opt/hd-app/HD_App_chart/scripts
./docker-build.sh
```

---

### **Skript 3: `docker-start.sh`**
**Zweck:** Docker Container starten

```bash
#!/bin/bash
# Docker Start - Container starten

cd /opt/hd-app/HD_App_chart

echo "==================================================="
echo "  DOCKER START - Container starten"
echo "==================================================="
echo ""

echo "1. Starte Container..."
docker-compose -f docker-compose.supabase.yml up -d

echo ""
echo "2. Warte 5 Sekunden..."
sleep 5

echo ""
echo "3. Container-Status:"
docker-compose -f docker-compose.supabase.yml ps

echo ""
echo "4. Letzte Logs:"
docker-compose -f docker-compose.supabase.yml logs --tail=20

echo ""
echo "==================================================="
echo "  DOCKER START COMPLETE"
echo "==================================================="
echo ""
echo "App verfügbar unter: http://138.199.237.34"
```

**Verwendung:**
```bash
ssh root@138.199.237.34
cd /opt/hd-app/HD_App_chart/scripts
./docker-start.sh
```

---

## 📝 VOLLSTÄNDIGER DEPLOYMENT-ABLAUF

### Schritt 1: Lokale Änderungen committen und pushen

```powershell
# Lokale Entwicklung
git add .
git commit -m "feat: neue Funktion"
git push origin main
```

### Schritt 2: Warten auf GitHub Actions (optional)

Die GitHub Actions führen automatisch Tests durch:
- CI/CD Pipeline
- Docker Image Build
- Code Quality Checks

Status prüfen: https://github.com/Heiko888/moonlightdatingapp/actions

### Schritt 3: Auf Hetzner-Server deployen

**Option A: Alle 3 Skripte nacheinander**
```bash
ssh root@138.199.237.34

cd /opt/hd-app/HD_App_chart/scripts

# 1. Code holen
./git-pull.sh

# 2. Container bauen
./docker-build.sh

# 3. Container starten
./docker-start.sh
```

**Option B: Alles-in-einem-Skript (wird erstellt)**
```bash
ssh root@138.199.237.34
cd /opt/hd-app/HD_App_chart/scripts
./deploy-all.sh
```

---

## 🔐 SERVER-ZUGRIFF

### SSH-Verbindung:
```bash
ssh root@138.199.237.34
```

### Server-Pfad:
```bash
/opt/hd-app/HD_App_chart
```

### Skripte-Pfad:
```bash
/opt/hd-app/HD_App_chart/scripts/
```

---

## ✅ DEPLOYMENT-CHECKLISTE

Vor jedem Deployment:

- [ ] Lokale Änderungen getestet (`npm run dev`)
- [ ] Code committed (`git commit`)
- [ ] Code gepusht (`git push origin main`)
- [ ] GitHub Actions erfolgreich (optional)
- [ ] SSH-Verbindung zum Server funktioniert
- [ ] Skripte ausführbar (`chmod +x *.sh`)

Nach jedem Deployment:

- [ ] Container laufen (`docker-compose ps`)
- [ ] App erreichbar (`http://138.199.237.34`)
- [ ] Logs ohne Fehler (`docker-compose logs`)
- [ ] Health Checks erfolgreich

---

## 🚨 NOTFALL-VERFAHREN

Falls etwas schiefgeht:

```bash
# 1. Container stoppen
cd /opt/hd-app/HD_App_chart
docker-compose -f docker-compose.supabase.yml down

# 2. Logs prüfen
docker-compose -f docker-compose.supabase.yml logs

# 3. Altes Image nutzen (falls vorhanden)
docker-compose -f docker-compose.supabase.yml up -d

# 4. Bei Bedarf: Rollback zu vorherigem Commit
cd /opt/hd-app/HD_App_chart
git log --oneline  # Commit-Hash finden
git checkout <alter-commit-hash>
cd scripts
./docker-build.sh
./docker-start.sh
```

---

## 📚 WEITERE DOKUMENTATION

- **SERVER-KONFIGURATION-COMPLETE.md** - Server-Setup Details
- **DEPLOYMENT-WORKFLOW.md** - GitHub Actions Workflows
- **HETZNER-RECOVERY-INSTRUCTIONS.md** - Notfall-Recovery

---

## ⚙️ WICHTIGE DATEIEN

| Datei | Zweck | Ort |
|-------|-------|-----|
| `git-pull.sh` | Code von GitHub holen | `/opt/hd-app/HD_App_chart/scripts/` |
| `docker-build.sh` | Container bauen | `/opt/hd-app/HD_App_chart/scripts/` |
| `docker-start.sh` | Container starten | `/opt/hd-app/HD_App_chart/scripts/` |
| `docker-compose.supabase.yml` | Docker Compose Config | `/opt/hd-app/HD_App_chart/` |
| `.env` | Environment Variablen | `/opt/hd-app/HD_App_chart/` |

---

**🚀 Ab sofort: Nur noch über GitHub und die 3 Skripte deployen!**

