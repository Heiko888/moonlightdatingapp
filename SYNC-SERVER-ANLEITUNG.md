# 🔄 Server-Synchronisation - Anleitung

Wenn der Server unterschiedliche Versionen hat, führe diese Schritte manuell aus:

## 📋 Manuelle Synchronisation

### Schritt 1: SSH-Verbindung zum Server

```bash
ssh root@138.199.237.34
```

### Schritt 2: Zum Projekt-Verzeichnis wechseln

```bash
cd /opt/hd-app/HD_App_chart
```

### Schritt 3: Git Status prüfen

```bash
git status
```

Erwartete Ausgabe sollte zeigen:
- Branch: `main`
- Status: "Your branch is behind 'origin/main' by X commits" oder ähnlich

### Schritt 4: Remote Repository prüfen

```bash
git remote -v
```

Sollte zeigen:
```
origin  https://github.com/Heiko888/moonlightdatingapp.git (fetch)
origin  https://github.com/Heiko888/moonlightdatingapp.git (push)
```

### Schritt 5: Aktuellen Commit prüfen

```bash
git rev-parse --short HEAD
git log -1 --oneline
```

### Schritt 6: Neueste Änderungen holen

```bash
git fetch origin main
```

### Schritt 7: Code aktualisieren

```bash
git pull origin main
```

Wenn es Konflikte gibt:
```bash
# Lokale Änderungen verwerfen (VORSICHT!)
git reset --hard origin/main

# ODER: Lokale Änderungen stashen
git stash
git pull origin main
git stash pop  # Nur wenn du die lokalen Änderungen behalten willst
```

### Schritt 8: Neuen Commit prüfen

```bash
git rev-parse --short HEAD
git log -1 --oneline
```

Sollte jetzt `2bf83e87` oder neuer sein.

### Schritt 9: Dateien prüfen

Prüfe, ob die neuen Dateien vorhanden sind:

```bash
# Deployment-Skripte
ls -la scripts/

# Sollte enthalten:
# - git-pull.sh
# - docker-build.sh
# - docker-start.sh
# - deploy-all.sh
# - README.md

# Deployment-Dokumentation
ls -la DEPLOYMENT-STRATEGY-FINAL.md

# Coach Reading Onboarding
ls -la frontend/app/coach/readings/create/page.tsx
```

### Schritt 10: Container neu bauen (falls nötig)

```bash
cd /opt/hd-app/HD_App_chart

# Container stoppen
docker-compose -f docker-compose.supabase.yml down

# Container neu bauen
docker-compose -f docker-compose.supabase.yml build --no-cache frontend

# Container starten
docker-compose -f docker-compose.supabase.yml up -d

# Status prüfen
docker-compose -f docker-compose.supabase.yml ps
```

---

## 🔍 Troubleshooting

### Problem: "Your branch is behind 'origin/main'"

**Lösung:**
```bash
git fetch origin main
git pull origin main
```

### Problem: "error: Your local changes to the following files would be overwritten"

**Lösung:** Lokale Änderungen verwerfen oder stashen:
```bash
# Option 1: Verwerfen (VORSICHT - löscht lokale Änderungen!)
git reset --hard origin/main

# Option 2: Stashen (behält lokale Änderungen)
git stash
git pull origin main
```

### Problem: "fatal: not a git repository"

**Lösung:** Du bist nicht im richtigen Verzeichnis:
```bash
cd /opt/hd-app/HD_App_chart
pwd  # Sollte /opt/hd-app/HD_App_chart zeigen
```

### Problem: "Permission denied"

**Lösung:** Stelle sicher, dass du als root eingeloggt bist:
```bash
whoami  # Sollte "root" zeigen
```

### Problem: Git Remote zeigt falsches Repository

**Lösung:** Remote korrigieren:
```bash
git remote remove origin
git remote add origin https://github.com/Heiko888/moonlightdatingapp.git
git fetch origin main
git pull origin main
```

---

## ✅ Checkliste

Nach der Synchronisation sollten folgende Dateien vorhanden sein:

- [ ] `scripts/git-pull.sh`
- [ ] `scripts/docker-build.sh`
- [ ] `scripts/docker-start.sh`
- [ ] `scripts/deploy-all.sh`
- [ ] `scripts/README.md`
- [ ] `DEPLOYMENT-STRATEGY-FINAL.md`
- [ ] `frontend/app/coach/readings/create/page.tsx` (mit Onboarding Flow)
- [ ] `frontend/app/api/coach/readings/route.ts` (mit POST-Endpunkt)

---

## 🚀 Schnell-Befehl (Alles in einem)

```bash
ssh root@138.199.237.34 "cd /opt/hd-app/HD_App_chart && git fetch origin main && git reset --hard origin/main && git rev-parse --short HEAD && git log -1 --oneline"
```

**WARNUNG:** `git reset --hard` verwirft alle lokalen Änderungen auf dem Server!

---

## 📞 Wenn nichts funktioniert

1. Prüfe die SSH-Verbindung:
   ```bash
   ssh root@138.199.237.34
   ```

2. Prüfe den Git-Status:
   ```bash
   cd /opt/hd-app/HD_App_chart
   git status
   git remote -v
   ```

3. Prüfe, ob das Repository korrekt ist:
   ```bash
   git log --oneline -5
   ```

4. Manuell pullen:
   ```bash
   git fetch origin main
   git pull origin main
   ```

