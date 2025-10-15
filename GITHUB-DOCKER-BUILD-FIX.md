# 🐳 GitHub Docker Build Fehler - Lösung

## 🚨 Problem
Der GitHub Workflow "Docker Image Build" schlägt nach 15 Sekunden fehl.

## ✅ Lokaler Build funktioniert
Der Docker-Build funktioniert lokal einwandfrei (getestet, 130s Buildzeit).
**Das Problem liegt bei GitHub Actions, nicht am Dockerfile!**

---

## 🔍 Mögliche Ursachen & Lösungen

### 1. **GitHub Container Registry Berechtigungen** ⭐ HÄUFIGSTE URSACHE

GitHub Actions benötigt spezielle Berechtigungen für GHCR (GitHub Container Registry).

#### Lösung A: Workflow Permissions aktivieren

1. Gehe zu deinem GitHub Repository
2. **Settings** → **Actions** → **General**
3. Scrolle zu **"Workflow permissions"**
4. Wähle: **"Read and write permissions"**
5. Aktiviere: **"Allow GitHub Actions to create and approve pull requests"**
6. Klicke **Save**

#### Lösung B: Repository Package Settings

1. Gehe zu deinem GitHub Repository
2. **Settings** → **Actions** → **General**
3. Unter **"Actions permissions"**:
   - Stelle sicher, dass Actions aktiviert sind
   - Wähle "Allow all actions and reusable workflows"

---

### 2. **GitHub Personal Access Token (PAT)**

Falls das Problem weiterhin besteht, benötigst du einen PAT mit Package-Berechtigungen.

#### Schritt 1: PAT erstellen

1. GitHub → **Settings** (dein Profil) → **Developer settings**
2. **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)**
4. Wähle Scopes:
   - ✅ `write:packages`
   - ✅ `read:packages`
   - ✅ `delete:packages` (optional)
   - ✅ `repo` (für private Repos)
5. **Generate token**
6. **WICHTIG:** Kopiere den Token sofort!

#### Schritt 2: Token als Secret hinzufügen

1. Dein Repository → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Name: `GHCR_TOKEN`
4. Value: Dein PAT
5. **Add secret**

#### Schritt 3: Workflow anpassen

```yaml
- name: Log in to Container Registry
  if: github.event_name != 'pull_request'
  uses: docker/login-action@v3
  with:
    registry: ${{ env.REGISTRY }}
    username: ${{ github.actor }}
    password: ${{ secrets.GHCR_TOKEN }}  # ← Geändert von GITHUB_TOKEN
```

---

### 3. **Repository Visibility & Packages**

Wenn dein Repository **private** ist:

1. **Settings** → **General**
2. Scrolle zu **"Danger Zone"**
3. Prüfe unter **"Change repository visibility"**

Für private Repositories:
- GHCR braucht explizite Berechtigungen
- PAT (Lösung 2) ist oft notwendig

---

### 4. **Workflow Branch Protection**

Manchmal blockieren Branch Protection Rules den Workflow.

1. **Settings** → **Branches**
2. Prüfe Regeln für `main`
3. Unter **"Require status checks"**:
   - Deaktiviere temporär "Docker Image Build"
   - Teste den Workflow
   - Aktiviere wieder

---

### 5. **GitHub Actions Logs ansehen**

Um die genaue Fehlerursache zu finden:

1. Gehe zu deinem Repository
2. **Actions** Tab
3. Klicke auf den fehlgeschlagenen Workflow
4. Klicke auf **"Build and Push Docker Image"**
5. Expandiere die Schritte

**Suche nach:**
- ❌ `denied: permission_denied`
- ❌ `unauthorized: authentication required`
- ❌ `Error: denied: denied`

---

## 🎯 Empfohlene Reihenfolge

### Schritt 1: Workflow Permissions aktivieren (5 Minuten)
✅ **Settings** → **Actions** → **General** → **"Read and write permissions"**

### Schritt 2: Workflow neu ausführen
```bash
# Lokal
git commit --allow-empty -m "Trigger workflow"
git push origin main
```

### Schritt 3: Logs überprüfen
Gehe zu **Actions** und schaue dir die Logs an.

### Schritt 4: Falls weiterhin Fehler → PAT erstellen (10 Minuten)
Folge **Lösung 2** oben.

---

## 🧪 Test: Workflow manuell ausführen

1. GitHub Repository → **Actions**
2. Wähle **"Docker Image Build"**
3. Klicke **"Run workflow"** → **"Run workflow"**
4. Warte und schaue dir die Logs an

---

## 📊 Status Check

### ✅ Lokaler Build
```powershell
cd frontend
docker build -t hd-app-test -f Dockerfile .
```
**Status:** ✅ Funktioniert (130s)

### ❌ GitHub Actions Build
**Status:** ❌ Schlägt nach 15s fehl

**Ursache:** Fehlende Berechtigungen für GitHub Container Registry

---

## 🔧 Quick Fix (Empfohlen)

```powershell
# 1. Settings → Actions → General → Read/Write Permissions aktivieren

# 2. Workflow neu triggern
git commit --allow-empty -m "Fix: Enable GHCR permissions"
git push origin main

# 3. Logs überprüfen
# GitHub → Actions → Docker Image Build
```

---

## 📞 Support

### Weitere Fehler nach diesen Fixes?

**Teile die Fehlermeldung aus den GitHub Actions Logs:**
1. Actions → Fehlgeschlagener Run
2. Build and Push Docker Image → Logs kopieren
3. Suche nach "ERROR" oder "denied"

### Alternative: Workflow temporär deaktivieren

Falls du GHCR nicht brauchst:

```yaml
# .github/workflows/docker-image.yml
on:
  push:
    branches: [ main ]
  # Kommentiere das aus:
  # pull_request:
  #   branches: [ main ]
```

Oder lösche die Datei:
```powershell
rm .github/workflows/docker-image.yml
git add .github/workflows/docker-image.yml
git commit -m "Remove docker workflow (not needed)"
git push origin main
```

---

## ✅ Erwartetes Ergebnis

Nach dem Fix sollte der Workflow:
1. ✅ Erfolgreich das Docker-Image bauen (~2-3 Minuten)
2. ✅ Image zu GHCR pushen
3. ✅ Security Scan durchführen

---

**Viel Erfolg! 🚀**

Bei Fragen: Teile die GitHub Actions Logs für weitere Diagnose.

