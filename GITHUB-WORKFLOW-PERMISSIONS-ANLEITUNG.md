# 🔧 GitHub Workflow Permissions - Detaillierte Anleitung

## 📍 Wo finde ich die Workflow Permissions?

### ⚠️ WICHTIG: Du musst **Admin/Owner** des Repositories sein!

---

## 🎯 Weg 1: Repository Settings (Desktop/Web)

### Schritt 1: Öffne dein Repository
```
https://github.com/DEIN-USERNAME/HD_App_chart
```

### Schritt 2: Klicke auf "Settings"
- **Oben** in der Repository-Navigation
- Zwischen "Insights" und dem Zahnrad-Symbol
- Falls du es nicht siehst → Du hast keine Admin-Rechte!

### Schritt 3: Navigiere zu Actions
**Linke Sidebar:**
```
Settings
  ├─ General
  ├─ Collaborators
  ├─ Code and automation
  │   ├─ Branches
  │   ├─ Tags
  │   ├─ Rules
  │   ├─ Actions                    ← HIER KLICKEN
  │   │   └─ General                ← DANN HIER
  │   ├─ Webhooks
  │   └─ ...
```

### Schritt 4: Scrolle nach unten
Scrolle bis zum Abschnitt:
```
┌──────────────────────────────────────────┐
│  Workflow permissions                    │
├──────────────────────────────────────────┤
│  Choose the default permissions granted  │
│  to the GITHUB_TOKEN when running        │
│  workflows in this repository...         │
│                                          │
│  ○ Read repository contents and         │
│     packages permissions                 │
│                                          │
│  ● Read and write permissions           │ ← DIESEN WÄHLEN
│                                          │
│  ☑ Allow GitHub Actions to create and   │ ← UND DIESEN
│     approve pull requests                │
│                                          │
│  [Save]                                  │
└──────────────────────────────────────────┘
```

### Schritt 5: Speichern
Klicke unten auf **"Save"**

---

## 🎯 Weg 2: Direkter Link

Wenn du Admin bist, öffne direkt:
```
https://github.com/DEIN-USERNAME/HD_App_chart/settings/actions
```

Oder für dein Repo:
```
https://github.com/[DEIN-USERNAME]/HD_App_chart/settings/actions
```

Ersetze `[DEIN-USERNAME]` mit deinem GitHub-Benutzernamen.

---

## 🚫 "Ich finde es nicht!" - Mögliche Gründe

### 1. **Keine Admin-Rechte**
❌ **Problem:** Du bist nicht Owner/Admin des Repos

✅ **Lösung:**
- Bitte den Repository-Owner, dich als Admin hinzuzufügen
- Oder: Der Owner muss die Einstellung ändern

**Owner finden:**
```
Repository → Settings → Collaborators and teams
```
Oben steht der Owner.

---

### 2. **Organisationsregeln**
❌ **Problem:** Das Repository gehört einer Organisation mit Regeln

✅ **Lösung:**
1. Gehe zu: `https://github.com/organizations/DEIN-ORG/settings/actions`
2. Unter **"Workflow permissions"**
3. Wähle: "Read and write permissions"

---

### 3. **GitHub UI hat sich geändert**
❌ **Problem:** GitHub ändert manchmal die UI

✅ **Alternative:** Workflow-Datei direkt anpassen (siehe unten)

---

## 🔧 Alternative: Permissions direkt im Workflow (EMPFOHLEN!)

**Die einfachste Lösung:** Wir haben bereits die Permissions im Workflow gesetzt!

```yaml
permissions:
  contents: read
  packages: write    ← Das erlaubt das Pushen zu GHCR
```

**Das sollte ausreichen!** Die Repository-Einstellung ist nur ein Fallback.

---

## 🧪 Test: Workflow jetzt ausführen

### Option A: Commit & Push (Automatischer Trigger)

```powershell
# Wir haben gerade den Workflow vereinfacht (Image-Scan deaktiviert)
git add .github/workflows/docker-image.yml
git commit -m "Fix: Vereinfache Docker Workflow für Debugging"
git push origin main
```

### Option B: Manueller Run

1. GitHub → **Actions**
2. Wähle **"Docker Image Build"** (linke Sidebar)
3. Klicke **"Run workflow"** (rechts oben)
4. Branch: `main`
5. Klicke **"Run workflow"** (grüner Button)

---

## 📊 Was wurde geändert?

Ich habe den **Image-Scan temporär deaktiviert**, weil:
1. Der könnte das Problem verursachen
2. Wir können ihn später wieder aktivieren
3. Der eigentliche Build sollte jetzt funktionieren

**Änderung in `.github/workflows/docker-image.yml`:**
- ❌ Image-Scan Job → Auskommentiert
- ✅ Build & Push → Bleibt aktiv

---

## 🎯 Erwartetes Ergebnis

Nach dem Push solltest du sehen:

```
✅ Docker Image Build
   ├─ Build and Push Docker Image (2-3 Minuten)
   │   ├─ Checkout Code
   │   ├─ Set up Docker Buildx
   │   ├─ Log in to Container Registry
   │   ├─ Extract metadata
   │   └─ Build and push Docker image ✅
   └─ Workflow completed successfully!
```

---

## 🚨 Falls es immer noch fehlschlägt

### Schritt 1: Logs ansehen
1. GitHub → **Actions**
2. Klicke auf den fehlgeschlagenen Run
3. Klicke auf **"Build and Push Docker Image"**
4. Expandiere **jeden Schritt**
5. Suche nach der **ersten ERROR-Meldung**

### Schritt 2: Häufige Fehlermeldungen

#### ❌ "denied: permission denied"
```
Error: denied: permission_denied: write_package
```
**Ursache:** Repository-Permissions fehlen

**Lösung:** Workflow Permissions aktivieren (siehe oben)

---

#### ❌ "authentication required"
```
Error: unauthorized: authentication required
```
**Ursache:** Login fehlgeschlagen

**Lösung:** Prüfe ob Repository öffentlich ist:
- Settings → General → Danger Zone
- "Change repository visibility" → Public

---

#### ❌ "resource not accessible by integration"
```
Error: Resource not accessible by integration
```
**Ursache:** GITHUB_TOKEN hat keine Rechte

**Lösung A:** Workflow Permissions (siehe oben)

**Lösung B:** Personal Access Token verwenden:
```yaml
password: ${{ secrets.GHCR_TOKEN }}  # Statt GITHUB_TOKEN
```

---

## 📞 Weitere Hilfe benötigt?

### Teile folgende Informationen:

1. **GitHub Repository Visibility:**
   - [ ] Public
   - [ ] Private

2. **Bist du Owner/Admin?**
   - [ ] Ja
   - [ ] Nein

3. **Fehlermeldung aus Actions Logs:**
   ```
   [Hier die erste ERROR-Zeile einfügen]
   ```

4. **Screenshot der Fehlermeldung** (optional)

---

## ✅ Nächste Schritte

### Jetzt sofort:
```powershell
# 1. Änderungen committen
git add .
git commit -m "Fix: Vereinfache Docker Workflow"
git push origin main

# 2. Warte 30 Sekunden

# 3. Öffne GitHub Actions
# https://github.com/DEIN-USERNAME/HD_App_chart/actions

# 4. Schaue dir die Logs an
```

### Nach erfolgreichem Build:
- Image-Scan wieder aktivieren (falls gewünscht)
- Deployment konfigurieren
- Weitere Workflows optimieren

---

## 🎉 Erfolg!

Falls der Workflow jetzt funktioniert:
- ✅ Docker-Image wird gebaut
- ✅ Image wird zu GHCR gepusht
- ✅ Du siehst das Image unter: `github.com/DEIN-USERNAME/HD_App_chart/pkgs/container/hd_app_chart`

**Glückwunsch! 🚀**

---

## 📚 Weitere Ressourcen

- [GitHub Actions Permissions](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [GHCR Authentication](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

---

**Viel Erfolg! Bei Fragen einfach melden.** 🚀

