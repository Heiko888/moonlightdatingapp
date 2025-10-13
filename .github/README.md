# 📁 .github Verzeichnis - Übersicht

Dieses Verzeichnis enthält alle GitHub-spezifischen Konfigurationen und Dokumentationen.

---

## 📋 INHALT

### **🔧 Workflows**

- **`workflows/ci-cd.yml`** - Haupt-CI/CD-Pipeline
  - Lint & Type Check
  - Build Test
  - Docker Build Test
  - Staging Deployment
  - Production Deployment

- **`workflows/code-quality.yml`** - Code Quality Checks
  - ESLint
  - TypeScript
  - Security Audit
  - Dependency Check

- **`workflows/docker-image.yml`** - Docker Image Build & Scan
  - Buildx Setup
  - Image Build
  - Security Scan

---

### **📚 Dokumentation**

#### **Warnungen & Troubleshooting:**

- **`QUICK-REFERENCE.md`** ⭐ **START HIER!**
  - Schnelle Antworten zu Linter-Warnungen
  - TL;DR für beschäftigte Entwickler

- **`LINTER-WARNINGS-ERKLAERUNG.md`** 📖 **DETAILLIERT**
  - Vollständige Erklärung aller Warnungen
  - Warum sie harmlos sind
  - Technische Details

- **`WORKFLOW-WARNINGS.md`** 🔍 **REFERENZ**
  - Alle Warnungen aufgelistet
  - Schritt-für-Schritt Lösungen
  - Checklisten

#### **Setup & Konfiguration:**

- **`GITHUB-SECRETS-SETUP.md`** (im Root-Verzeichnis)
  - Wie Secrets konfigurieren
  - Welche Secrets benötigt werden
  - Sicherheits-Best-Practices

---

### **📝 Templates**

- **`ISSUE_TEMPLATE/`** - Issue-Vorlagen
  - `bug_report.yml` - Bug-Report
  - `feature_request.yml` - Feature-Request
  - `config.yml` - Template-Konfiguration

- **`pull_request_template.md`** - PR-Vorlage
  - Checkliste für Pull Requests
  - Beschreibungsformat

---

### **⚙️ Konfiguration**

- **`.actionlint-ignore`** - Ignorierte Linter-Warnungen
  - Harmlose Warnungen unterdrückt
  - Gut dokumentiert

- **`dependabot.yml`** - Automatische Dependency Updates
  - NPM Packages
  - Docker Images
  - GitHub Actions

- **`CODEOWNERS`** - Code-Besitzer
  - Automatische Reviewer-Zuweisung

- **`CONTRIBUTING.md`** - Contribution Guidelines
  - Wie beitragen
  - Code-Standards
  - PR-Prozess

- **`FUNDING.yml`** - Sponsoring-Info
  - GitHub Sponsors
  - Andere Plattformen

---

## 🚨 WICHTIG: Linter-Warnungen

### **Du siehst diese Warnungen?**

```text
⚠️  Context access might be invalid: NEXT_PUBLIC_SUPABASE_URL
⚠️  Context access might be invalid: NEXT_PUBLIC_SUPABASE_ANON_KEY
⚠️  Context access might be invalid: SSH_PRIVATE_KEY
```

### **→ KEINE PANIK! Das ist NORMAL!**

**Quick Fix:**

1. Lies: **`QUICK-REFERENCE.md`** (2 Minuten)
2. Konfiguriere Secrets in GitHub
3. Ignoriere die Warnungen
4. Mach weiter! 🚀

**Detaillierte Erklärung:**

- **`LINTER-WARNINGS-ERKLAERUNG.md`** - Warum harmlos
- **`WORKFLOW-WARNINGS.md`** - Alle Warnungen

---

## 🎯 QUICK START

### **Neuer Entwickler?**

1. **Lies**: `QUICK-REFERENCE.md` (2 Min)
2. **Setup**: Secrets konfigurieren (5 Min)
3. **Test**: Workflow ausführen (2 Min)
4. **Fertig**: Weitermachen mit Entwicklung! 🎉

### **Warnungen in IDE?**

→ **`QUICK-REFERENCE.md`** lesen!

### **Workflow schlägt fehl?**

1. Secrets konfiguriert? → `GITHUB-SECRETS-SETUP.md`
2. Syntax-Fehler? → Logs prüfen
3. Immer noch Probleme? → `WORKFLOW-WARNINGS.md`

---

## 📖 WEITERE RESSOURCEN

### **Im Root-Verzeichnis:**

- `VOLLSTAENDIGE-BEDIENUNGSANLEITUNG.md` - Komplette Projekt-Doku
- `DEPLOYMENT-STRATEGY.md` - Deployment-Übersicht
- `GITHUB-SETUP-COMPLETE.md` - GitHub-Setup-Doku

### **Online:**

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Actionlint](https://github.com/rhysd/actionlint)

---

## ✅ CHECKLISTE

### **Vor dem ersten Workflow-Run:**

- [ ] `QUICK-REFERENCE.md` gelesen
- [ ] Secrets in GitHub konfiguriert
- [ ] `.actionlint-ignore` verstanden
- [ ] Warnungen als harmlos akzeptiert

### **Nach dem ersten Workflow-Run:**

- [ ] Build erfolgreich
- [ ] Keine echten Fehler
- [ ] Warnungen ignoriert
- [ ] Weitermachen! 🚀

---

## 🎓 LERN-PFAD

### **Level 1: Anfänger**

1. `QUICK-REFERENCE.md` - Schnelle Übersicht
2. Secrets konfigurieren
3. Workflow testen

### **Level 2: Fortgeschritten**

1. `WORKFLOW-WARNINGS.md` - Alle Warnungen
2. `workflows/ci-cd.yml` - Workflow verstehen
3. Templates anpassen

### **Level 3: Experte**

1. `LINTER-WARNINGS-ERKLAERUNG.md` - Technische Details
2. Eigene Workflows erstellen
3. Best Practices anwenden

---

## 🤝 CONTRIBUTING

Möchtest du beitragen?

→ Lies: `CONTRIBUTING.md`

---

## 📞 SUPPORT

**Fragen zu Warnungen?**

1. `QUICK-REFERENCE.md` - Schnelle Antworten
2. `LINTER-WARNINGS-ERKLAERUNG.md` - Detailliert
3. `WORKFLOW-WARNINGS.md` - Alle Warnungen

**Andere Fragen?**

- Issue erstellen mit Template
- `CONTRIBUTING.md` lesen

---

**Happy Coding! 🚀**

