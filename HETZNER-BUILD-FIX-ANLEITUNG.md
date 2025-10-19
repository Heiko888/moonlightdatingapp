# 🔧 Hetzner Build Problem - Lösung

## Problem
Der Docker Build auf Hetzner schlägt fehl mit:
```
npm error code EUSAGE
npm ci can only install packages when your package.json and package-lock.json are in sync
```

## ✅ Schnelle Lösung

### Option 1: Mit dem Fix-Skript (Empfohlen)

```bash
# 1. Skript auf Server kopieren
scp fix-hetzner-build.sh root@dein-server-ip:/root/

# 2. Auf Server verbinden
ssh root@ip


# 3. Skript ausführbar machen
chmod +x /root/fix-hetzner-build.sh

# 4. Ausführen
/root/fix-hetzner-build.sh
```

### Option 2: Manuell (Schritt für Schritt)

```bash
# 1. Mit Server verbinden
ssh root@dein-server-ip

# 2. Zum Projekt
cd /root/hd-app  # oder dein Projekt-Pfad

# 3. Code pullen
git pull origin main

# 4. Package-Lock fixen
cd frontend
npm install
cd ..

# 5. Container stoppen
docker-compose down

# 6. Neu bauen (ohne Cache)
docker-compose build --no-cache

# 7. Starten
docker-compose up -d

# 8. Logs prüfen
docker-compose logs -f
```

### Option 3: Nur ohne Docker-Build (Dev-Mode)

Wenn du kein Production-Build brauchst:

```bash
# 1. Mit Server verbinden
ssh root@dein-server-ip

# 2. Zum Projekt
cd /root/hd-app

# 3. Git pull
git pull origin main

# 4. Dev-Container starten (ohne build)
docker-compose -f docker-compose.dev.yml up -d

# 5. Fertig!
```

---

## 🔍 Warum passiert das?

Der Fehler tritt auf weil:
1. `package-lock.json` nicht mit `package.json` synchron ist
2. Neue Dependencies (@supabase/ssr, cookie) wurden hinzugefügt
3. Docker's `npm ci` ist strenger als `npm install`

## 🛡️ Langfristige Lösung

### 1. GitHub Actions CI/CD einrichten

Erstelle `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hetzner

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install & Update packages
        run: |
          cd frontend
          npm install
          
      - name: Commit updated package-lock if changed
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add frontend/package-lock.json
          git diff --staged --quiet || git commit -m "chore: update package-lock.json"
          git push || true
      
      - name: Deploy to Hetzner
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HETZNER_HOST }}
          username: root
          key: ${{ secrets.HETZNER_SSH_KEY }}
          script: |
            cd /root/hd-app
            git pull
            docker-compose down
            docker-compose up -d --build
```

### 2. Pre-commit Hook

Erstelle `.husky/pre-commit`:

```bash
#!/bin/sh
cd frontend
npm install
git add package-lock.json
```

---

## 📊 Status prüfen nach Fix

```bash
# Container Status
docker-compose ps

# Logs live anschauen
docker-compose logs -f

# Nur Frontend-Logs
docker-compose logs -f frontend

# Health Check
curl http://localhost:3000
```

---

## 🆘 Falls es immer noch nicht funktioniert

### Check 1: Dockerfile anpassen

Ändere in `frontend/Dockerfile`:
```dockerfile
# Statt:
RUN npm ci

# Verwende:
RUN npm install
```

### Check 2: Docker Cache löschen

```bash
# Alles löschen und neu bauen
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

### Check 3: Dependencies manuell fixen

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm audit fix
```

---

## ✅ Erfolgreich wenn...

Du siehst in den Logs:
```
✓ Ready in X seconds
Server listening on port 3000
```

Und die Webseite lädt unter deiner Domain!

---

**Bei Problemen:**
- Logs posten: `docker-compose logs --tail=100`
- Server-Specs prüfen: `free -h && df -h`
- Ports prüfen: `netstat -tulpn | grep LISTEN`

