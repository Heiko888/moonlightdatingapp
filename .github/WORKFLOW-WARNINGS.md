# GitHub Actions Workflow Warnungen

## 📋 Übersicht

Die GitHub Actions Workflows zeigen einige Warnungen an, die **harmlos** sind und **ignoriert werden können**.

---

## ⚠️ Aktuelle Warnungen

### **1. Context access might be invalid: NEXT_PUBLIC_SUPABASE_URL**

**Datei**: `.github/workflows/ci-cd.yml:69:37`

**Code:**

```yaml
env:
  NEXT_PUBLIC_SUPABASE_URL: ${{ secrets['NEXT_PUBLIC_SUPABASE_URL'] }}
```

**Warum die Warnung?**

Der GitHub Actions Linter kann nicht überprüfen, ob das Secret `NEXT_PUBLIC_SUPABASE_URL` in den Repository Settings konfiguriert ist.

**Ist das ein Problem?**

❌ **Nein!** Das Secret muss in den GitHub Repository Settings konfiguriert werden:

```text
GitHub → Settings → Secrets and variables → Actions → New repository secret
```

**Status**: ✅ Harmlos, kann ignoriert werden

---

### **2. Context access might be invalid: NEXT_PUBLIC_SUPABASE_ANON_KEY**

**Datei**: `.github/workflows/ci-cd.yml:70:42`

**Code:**

```yaml
env:
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets['NEXT_PUBLIC_SUPABASE_ANON_KEY'] }}
```

**Warum die Warnung?**

Der GitHub Actions Linter kann nicht überprüfen, ob das Secret `NEXT_PUBLIC_SUPABASE_ANON_KEY` in den Repository Settings konfiguriert ist.

**Ist das ein Problem?**

❌ **Nein!** Das Secret muss in den GitHub Repository Settings konfiguriert werden.

**Status**: ✅ Harmlos, kann ignoriert werden

---

### **3. Context access might be invalid: SSH_PRIVATE_KEY**

**Datei**: `.github/workflows/ci-cd.yml:142:28`

**Code:**

```yaml
with:
  ssh-private-key: ${{ secrets['SSH_PRIVATE_KEY'] }}
```

**Warum die Warnung?**

Der GitHub Actions Linter kann nicht überprüfen, ob das Secret `SSH_PRIVATE_KEY` in den Repository Settings konfiguriert ist.

**Ist das ein Problem?**

❌ **Nein!** Das Secret muss in den GitHub Repository Settings konfiguriert werden.

**Status**: ✅ Harmlos, kann ignoriert werden

---

## 🔧 Wie konfiguriere ich die Secrets?

### **Schritt 1: GitHub Repository öffnen**

```text
https://github.com/YOUR_USERNAME/HD_App_chart
```

### **Schritt 2: Settings → Secrets and variables → Actions**

```text
GitHub → Settings → Secrets and variables → Actions
```

### **Schritt 3: Secrets hinzufügen**

**Erforderliche Secrets:**

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://your-project.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `your-anon-key`

3. **SSH_PRIVATE_KEY**
   - Name: `SSH_PRIVATE_KEY`
   - Value: `-----BEGIN OPENSSH PRIVATE KEY-----\n...`

### **Schritt 4: Workflow ausführen**

Nach dem Hinzufügen der Secrets:

```text
GitHub → Actions → CI/CD Pipeline → Run workflow
```

---

## 📚 Weitere Informationen

### **Warum zeigt der Linter diese Warnungen?**

Der GitHub Actions Linter (actionlint) kann nicht auf die Repository Secrets zugreifen und kann daher nicht überprüfen, ob sie existieren. Das ist **beabsichtigt** und **sicher**, da Secrets niemals im Code oder in Logs erscheinen sollten.

### **Sind diese Warnungen gefährlich?**

❌ **Nein!** Diese Warnungen sind **harmlos** und zeigen nur an, dass der Linter die Secrets nicht validieren kann. Solange die Secrets in den GitHub Repository Settings konfiguriert sind, funktioniert alles einwandfrei.

### **Kann ich diese Warnungen unterdrücken?**

✅ **Ja!** Die Datei `.github/.actionlint-ignore` wurde erstellt, um diese spezifischen Warnungen zu unterdrücken.

---

## ✅ Checkliste

Bevor du den Workflow ausführst:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` in GitHub Secrets konfiguriert
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` in GitHub Secrets konfiguriert
- [ ] `SSH_PRIVATE_KEY` in GitHub Secrets konfiguriert (nur für Production)
- [ ] Workflow manuell getestet
- [ ] Logs überprüft

---

## 📖 Referenzen

- [GitHub Actions - Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Actions - Contexts](https://docs.github.com/en/actions/learn-github-actions/contexts)
- [Actionlint Documentation](https://github.com/rhysd/actionlint)

---

**Status**: ✅ Alle Warnungen dokumentiert und erklärt  
**Nächste Schritte**: Secrets in GitHub konfigurieren (siehe `GITHUB-SECRETS-SETUP.md`)
