# ✅ Deployment-Checkliste

Führe diese Schritte **manuell auf dem Hetzner-Server** aus, um zu prüfen, ob das Deployment erfolgreich war:

## 🔗 1. SSH-Verbindung zum Server

```bash
ssh root@138.199.237.34
```

## 📂 2. Zum Projekt-Verzeichnis wechseln

```bash
cd /opt/hd-app/HD_App_chart
```

## 🔄 3. Git-Status prüfen

```bash
# Aktueller Commit prüfen
git rev-parse --short HEAD

# Erwarteter Commit: 19ab0728 oder neuer
# Sollte zeigen: "chore: .original Dateien zu .gitignore hinzugefuegt"

git log -1 --oneline
```

**Erwartete Ausgabe:**
```
19ab0728 chore: .original Dateien zu .gitignore hinzugefuegt
```

Falls der Commit nicht aktuell ist:
```bash
git fetch origin main
git pull origin main
```

## 📁 4. Prüfe neue Dateien

### Deployment-Skripte
```bash
ls -la scripts/
```

**Sollte enthalten:**
- ✅ `git-pull.sh`
- ✅ `docker-build.sh`
- ✅ `docker-start.sh`
- ✅ `deploy-all.sh`
- ✅ `README.md`

### Deployment-Dokumentation
```bash
ls -la DEPLOYMENT-STRATEGY-FINAL.md
```

Sollte die Datei zeigen.

### Coach Reading Onboarding
```bash
ls -la frontend/app/coach/readings/create/page.tsx
```

Sollte die Datei zeigen (mit ~1038 Zeilen).

## 🐳 5. Container-Status prüfen

```bash
docker-compose -f docker-compose.supabase.yml ps
```

**Erwartete Ausgabe:**
- Alle Container sollten `Up` oder `running` sein
- Frontend, Nginx, Supabase sollten laufen

## 📋 6. Container-Logs prüfen

```bash
# Frontend-Logs
docker-compose -f docker-compose.supabase.yml logs --tail=20 frontend

# Alle Logs
docker-compose -f docker-compose.supabase.yml logs --tail=20
```

**Keine Fehler erwartet!**

## 🌐 7. App testen

```bash
# Von außen testen (vom lokalen Rechner)
curl -I http://138.199.237.34

# Oder im Browser öffnen:
# http://138.199.237.34
```

## ✅ Checkliste - Alles erledigt?

- [ ] Git Commit ist aktuell (19ab0728 oder neuer)
- [ ] Alle Deployment-Skripte vorhanden (`scripts/*.sh`)
- [ ] Deployment-Dokumentation vorhanden
- [ ] Coach Reading Onboarding-Datei vorhanden
- [ ] Container laufen (docker-compose ps)
- [ ] Container-Logs ohne Fehler
- [ ] App erreichbar (http://138.199.237.34)

## 🔧 Falls etwas fehlt

### Git nicht aktuell?
```bash
cd /opt/hd-app/HD_App_chart
git fetch origin main
git reset --hard origin/main  # VORSICHT: Verwirft lokale Änderungen!
git rev-parse --short HEAD
```

### Container nicht am Laufen?
```bash
cd /opt/hd-app/HD_App_chart
docker-compose -f docker-compose.supabase.yml down
docker-compose -f docker-compose.supabase.yml build --no-cache frontend
docker-compose -f docker-compose.supabase.yml up -d
docker-compose -f docker-compose.supabase.yml ps
```

### Skripte nicht vorhanden?
```bash
cd /opt/hd-app/HD_App_chart
git fetch origin main
git pull origin main
ls -la scripts/
```

---

## 🚀 Schnell-Befehl: Alles prüfen

```bash
ssh root@138.199.237.34 << 'EOF'
cd /opt/hd-app/HD_App_chart
echo "=== GIT STATUS ==="
git rev-parse --short HEAD
git log -1 --oneline
echo ""
echo "=== NEW FILES ==="
ls -la scripts/*.sh 2>/dev/null | wc -l
ls -la DEPLOYMENT-STRATEGY-FINAL.md 2>/dev/null
ls -la frontend/app/coach/readings/create/page.tsx 2>/dev/null
echo ""
echo "=== CONTAINER STATUS ==="
docker-compose -f docker-compose.supabase.yml ps
EOF
```

