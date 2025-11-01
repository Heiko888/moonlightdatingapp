# 🚨 Deployment-Reparatur - Hetzner wiederherstellen

## Problem

Durch den Bad Gateway Fix wurde versehentlich die lokale `nginx-http-only.conf` Konfiguration für den Production-Server verwendet. Das hat den Hetzner-Server beschädigt, da dort SSL-Zertifikate benötigt werden.

## ✅ Was wurde repariert:

1. ✅ **docker-compose.supabase.yml**: Zurück auf `nginx.conf` + SSL-Volume
2. ✅ **GitHub Actions**: Workflow-Dependencies korrigiert
3. ✅ **Reparatur-Skript**: `repariere-hetzner.ps1` erstellt

## 🔧 Sofort-Reparatur

### Schritt 1: Änderungen committen und pushen

```powershell
git add docker-compose.supabase.yml .github/workflows/ci-cd.yml
git commit -m "fix: restore production nginx config with SSL"
git push origin main
```

### Schritt 2: Hetzner-Server reparieren

```powershell
.\repariere-hetzner.ps1
```

Das Skript macht:
1. Git Pull auf dem Server (holt die korrigierte Konfiguration)
2. Container stoppen
3. Container neu starten mit korrekter Konfiguration
4. Health Checks durchführen

## 📋 Was war das Problem?

**Vorher (FALSCH - für lokale Entwicklung):**
```yaml
volumes:
  - ./nginx/nginx-http-only.conf:/etc/nginx/nginx.conf:ro
  # ❌ Kein SSL-Volume
```

**Jetzt (RICHTIG - für Production):**
```yaml
volumes:
  - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
  - /etc/letsencrypt:/etc/letsencrypt:ro
  # ✅ Mit SSL-Zertifikaten
```

## 🚀 GitHub Actions wieder aktivieren

Die Workflows sollten jetzt automatisch laufen bei:
- **Push zu main**: CI/CD Pipeline + Docker Build
- **Manuell**: Production Deployment über GitHub Actions UI

### Workflow manuell auslösen:

1. Gehe zu: https://github.com/Heiko888/moonlightdatingapp/actions
2. Wähle "CI/CD Pipeline"
3. Klicke "Run workflow"
4. Wähle Branch: `main`
5. Klicke "Run workflow"

## ✅ Prüfung nach Reparatur

```powershell
# 1. Container Status
ssh root@138.199.237.34 "cd /opt/hd-app/HD_App_chart && docker compose -f docker-compose.supabase.yml ps"

# 2. Nginx Logs
ssh root@138.199.237.34 "cd /opt/hd-app/HD_App_chart && docker compose -f docker-compose.supabase.yml logs --tail=30 nginx"

# 3. HTTPS Test
Invoke-WebRequest -Uri "https://www.the-connection-key.de" -UseBasicParsing
```

## 🔄 Normaler Deployment-Workflow (wiederhergestellt)

### 1. Entwicklung
```powershell
# Lokale Änderungen
git add .
git commit -m "feat: neue Funktion"
git push origin main
```

### 2. GitHub Actions (automatisch)
- ✅ Lint & Type Check
- ✅ Build Test
- ✅ Docker Build & Push zu GHCR

### 3. Hetzner Deployment (manuell oder via GitHub Actions)
```powershell
# Option A: Via GitHub Actions UI
# → Actions → CI/CD Pipeline → Run workflow

# Option B: Manuell
.\repariere-hetzner.ps1
```

## ⚠️ Wichtig

- **Lokal**: Verwendet `nginx-http-only.conf` (über docker-compose.dev.yml)
- **Production**: Verwendet `nginx.conf` mit SSL (über docker-compose.supabase.yml)
- **Niemals** die lokale Config auf Production deployen!

