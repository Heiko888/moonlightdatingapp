# DEPLOYMENT-SKRIPTE AUFRÄUMEN

## 🗑️ VERALTETE SKRIPTE LÖSCHEN

### ❌ ZU LÖSCHENDE SKRIPTE:
- `deploy/commands/deploy-commands.txt` - Veraltete manuelle Befehle
- `deploy/quick/quick-deploy.ps1` - Veraltetes Quick Deployment
- `deploy/hetzner/deploy-hetzner-complete.sh` - Veraltetes Hetzner Deployment
- `deploy/production/deploy-production.ps1` - Veraltetes Production Deployment
- `deploy/moonlight/deploy-moonlight-app.sh` - Veraltetes Moonlight App

### ✅ ZU BEHALTENDE SKRIPTE:
- `deploy/staging/setup-staging.ps1` - ✅ Neu
- `deploy/production/setup-production.ps1` - ✅ Neu
- `deploy/simple/simple-deployment.md` - ✅ Neu

## 🎯 NEUE STRUKTUR

### 📁 DEPLOYMENT-ORDNER:
```
deploy/
├── staging/
│   └── setup-staging.ps1
├── production/
│   └── setup-production.ps1
├── simple/
│   └── simple-deployment.md
└── workflow/
    └── git-workflow-option3.md
```

## 🚀 NEUER WORKFLOW

### 1. DEVELOPMENT (Port 3005)
```bash
npm run dev
# → http://localhost:3005
```

### 2. STAGING (Port 3001)
```bash
git push origin main
.\deploy\staging\setup-staging.ps1
# → http://localhost:3001
```

### 3. PRODUCTION (Port 3000)
```bash
git push origin main
.\deploy\production\setup-production.ps1
# → http://138.199.237.34:3000
```

## ✅ VORTEILE DER NEUEN STRUKTUR

- **Einfacher:** Nur 3 Skripte
- **Klarer:** Einfacher Workflow
- **Weniger Fehler:** Keine Konflikte
- **Bessere Übersicht:** Klare Struktur
