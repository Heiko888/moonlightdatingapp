# 🔐 GITHUB SECRETS SETUP

## **ÜBERSICHT**

Anleitung zur Konfiguration aller erforderlichen GitHub Secrets für CI/CD und Deployment.

---

## **📋 ERFORDERLICHE SECRETS**

### **1. Supabase Secrets**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### **2. JWT Secret**
```
JWT_SECRET
```

### **3. API Keys**
```
OPENAI_API_KEY
NASA_API_KEY
```

### **4. Stripe Secrets**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

### **5. Monitoring**
```
GRAFANA_PASSWORD
```

### **6. Deployment**
```
SSH_PRIVATE_KEY
```

---

## **🚀 SCHRITT-FÜR-SCHRITT ANLEITUNG**

### **Schritt 1: GitHub Repository öffnen**

1. Gehe zu: https://github.com/yourusername/HD_App_chart
2. Klicke auf **Settings** (oben rechts)
3. Navigiere zu **Secrets and variables** → **Actions**

---

### **Schritt 2: Secrets hinzufügen**

Für jedes Secret:

1. Klicke auf **New repository secret**
2. Gebe den **Name** ein (siehe unten)
3. Gebe den **Value** ein
4. Klicke auf **Add secret**

---

## **📝 SECRETS DETAILS**

### **1. NEXT_PUBLIC_SUPABASE_URL**

**Name:** `NEXT_PUBLIC_SUPABASE_URL`

**Value:** Deine Supabase Project URL

**Wo finden:**
1. Gehe zu: https://supabase.com/dashboard
2. Wähle dein Projekt
3. Settings → API
4. Project URL kopieren

**Beispiel:**
```
https://abcdefghijklmnop.supabase.co
```

---

### **2. NEXT_PUBLIC_SUPABASE_ANON_KEY**

**Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Value:** Dein Supabase Anon/Public Key

**Wo finden:**
1. Supabase Dashboard → Settings → API
2. Project API keys → anon public
3. Key kopieren

**Beispiel:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **3. SUPABASE_SERVICE_ROLE_KEY**

**Name:** `SUPABASE_SERVICE_ROLE_KEY`

**Value:** Dein Supabase Service Role Key

**Wo finden:**
1. Supabase Dashboard → Settings → API
2. Project API keys → service_role
3. Key kopieren

**⚠️ WICHTIG:** Dieser Key hat volle Zugriffsrechte - niemals öffentlich teilen!

**Beispiel:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **4. JWT_SECRET**

**Name:** `JWT_SECRET`

**Value:** Ein sicherer, zufälliger String

**Generieren:**
```powershell
# PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

**Beispiel:**
```
a9f8d7c6b5e4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9e8
```

---

### **5. OPENAI_API_KEY**

**Name:** `OPENAI_API_KEY`

**Value:** Dein OpenAI API Key

**Wo finden:**
1. Gehe zu: https://platform.openai.com/api-keys
2. Erstelle einen neuen API Key
3. Key kopieren

**Beispiel:**
```
sk-proj-abcdefghijklmnopqrstuvwxyz123456789
```

---

### **6. NASA_API_KEY**

**Name:** `NASA_API_KEY`

**Value:** Dein NASA API Key

**Wo finden:**
1. Gehe zu: https://api.nasa.gov/
2. Registriere dich für einen API Key
3. Key kopieren

**Beispiel:**
```
DEMO_KEY
```

---

### **7. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**

**Name:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Value:** Dein Stripe Publishable Key

**Wo finden:**
1. Gehe zu: https://dashboard.stripe.com/apikeys
2. Publishable key kopieren
3. Für Production: Live key verwenden
4. Für Testing: Test key verwenden

**Format:**
- Test: `pk_test_[50+ characters]`
- Live: `pk_live_[50+ characters]`

**Wo finden:**
- Stripe Dashboard → API Keys → Publishable key

---

### **8. STRIPE_SECRET_KEY**

**Name:** `STRIPE_SECRET_KEY`

**Value:** Dein Stripe Secret Key

**Wo finden:**
1. Stripe Dashboard → API keys
2. Secret key kopieren

**⚠️ WICHTIG:** Niemals öffentlich teilen!

**Format:**
- Test: `sk_test_[50+ characters]`
- Live: `sk_live_[50+ characters]`

**Wo finden:**
- Stripe Dashboard → API Keys → Secret key (show)

---

### **9. STRIPE_WEBHOOK_SECRET**

**Name:** `STRIPE_WEBHOOK_SECRET`

**Value:** Dein Stripe Webhook Secret

**Wo finden:**
1. Stripe Dashboard → Developers → Webhooks
2. Erstelle einen Webhook Endpoint
3. Webhook signing secret kopieren

**Format:**
- `whsec_[32 characters]`

**Wo finden:**
- Stripe Dashboard → Webhooks → Endpoint → Signing secret

---

### **10. GRAFANA_PASSWORD**

**Name:** `GRAFANA_PASSWORD`

**Value:** Dein Grafana Admin Passwort

**Aktuelles Passwort finden:**
```powershell
# Aus docker-compose.supabase.yml
docker-compose -f docker-compose.supabase.yml exec grafana cat /etc/grafana/grafana.ini | grep admin_password
```

**Oder neues Passwort setzen:**
```powershell
# Generiere ein sicheres Passwort
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Standard (falls nicht geändert):**
```
admin123
```

---

### **11. SSH_PRIVATE_KEY**

**Name:** `SSH_PRIVATE_KEY`

**Value:** Dein SSH Private Key für Hetzner Server

**Generieren (falls nicht vorhanden):**
```powershell
# Auf lokalem Rechner
ssh-keygen -t ed25519 -C "github-actions@hd-app-chart"

# Speicherort: C:\Users\YourUsername\.ssh\id_ed25519
```

**Public Key auf Server hinzufügen:**
```powershell
# Public Key anzeigen
Get-Content C:\Users\YourUsername\.ssh\id_ed25519.pub

# Auf Hetzner Server
ssh root@138.199.237.34
echo "your-public-key-here" >> ~/.ssh/authorized_keys
```

**Private Key für GitHub:**
```powershell
# Private Key anzeigen
Get-Content C:\Users\YourUsername\.ssh\id_ed25519

# Kompletten Inhalt kopieren (inkl. BEGIN und END)
```

**Beispiel:**
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
...
-----END OPENSSH PRIVATE KEY-----
```

---

## **✅ SECRETS CHECKLISTE**

Nach dem Hinzufügen solltest du folgende Secrets haben:

- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] JWT_SECRET
- [ ] OPENAI_API_KEY
- [ ] NASA_API_KEY
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] GRAFANA_PASSWORD
- [ ] SSH_PRIVATE_KEY

---

## **🔍 SECRETS VERIFIZIEREN**

### **Schritt 1: Secrets prüfen**

1. GitHub Repository → Settings → Secrets and variables → Actions
2. Alle Secrets sollten aufgelistet sein
3. ⚠️ Values sind nicht sichtbar (aus Sicherheitsgründen)

### **Schritt 2: Workflow testen**

```powershell
# Test-Commit erstellen
git add .
git commit -m "test: verify GitHub secrets"
git push origin main

# Workflow Status prüfen
# GitHub → Actions → CI/CD Pipeline
```

### **Schritt 3: Logs prüfen**

1. GitHub → Actions → Workflow auswählen
2. Job auswählen
3. Logs durchsehen
4. Bei Fehlern: Secret-Namen und -Werte prüfen

---

## **🚨 TROUBLESHOOTING**

### **Problem: Workflow schlägt fehl**

**Lösung:**
1. Prüfe Secret-Namen (Groß-/Kleinschreibung beachten)
2. Prüfe, ob alle Secrets vorhanden sind
3. Prüfe Workflow-Logs für spezifische Fehler

### **Problem: SSH Deployment schlägt fehl**

**Lösung:**
1. Prüfe SSH_PRIVATE_KEY Format (inkl. BEGIN/END)
2. Prüfe, ob Public Key auf Server ist
3. Teste SSH-Verbindung manuell:
   ```powershell
   ssh -i C:\Users\YourUsername\.ssh\id_ed25519 root@138.199.237.34
   ```

### **Problem: Build schlägt fehl**

**Lösung:**
1. Prüfe Supabase Secrets
2. Prüfe API Keys
3. Teste Build lokal:
   ```powershell
   cd frontend
   npm run build
   ```

---

## **🔐 SECURITY BEST PRACTICES**

### **1. Secrets niemals committen**
```bash
# ❌ NIEMALS
git add .env.production
git commit -m "add production env"

# ✅ IMMER
# .env.production ist in .gitignore
```

### **2. Secrets regelmäßig rotieren**
- API Keys alle 90 Tage
- JWT Secret alle 180 Tage
- SSH Keys jährlich

### **3. Least Privilege Principle**
- Verwende Service Accounts mit minimalen Rechten
- Verwende Test Keys für Staging
- Verwende Live Keys nur für Production

### **4. Secrets Monitoring**
- Überwache Workflow-Logs
- Aktiviere GitHub Security Alerts
- Nutze Dependabot für Updates

---

## **📚 WEITERE RESSOURCEN**

- [GitHub Secrets Dokumentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Supabase API Keys](https://supabase.com/docs/guides/api/api-keys)
- [Stripe API Keys](https://stripe.com/docs/keys)
- [OpenAI API Keys](https://platform.openai.com/docs/api-reference/authentication)

---

## **🎯 NÄCHSTE SCHRITTE**

Nach dem Konfigurieren der Secrets:

1. **Branch Protection aktivieren**
   - Repository → Settings → Branches
   
2. **Environments konfigurieren**
   - Repository → Settings → Environments
   
3. **Ersten Workflow testen**
   ```powershell
   git add .
   git commit -m "feat(ci): configure GitHub secrets"
   git push origin main
   ```

4. **Deployment testen**
   - GitHub → Actions → CI/CD Pipeline
   - Workflow Status überwachen

---

**Letzte Aktualisierung**: 2025-10-13

**Status**: Bereit zur Konfiguration

