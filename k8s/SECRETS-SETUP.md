# 🔐 Secrets Setup für HD App Kubernetes

## 📋 Übersicht

Diese Anleitung zeigt dir, wie du die Secrets in `k8s/secrets.yaml` mit deinen echten API-Keys konfigurierst.

## 🔧 Base64-Kodierung

Alle Secrets müssen **Base64-kodiert** werden. Hier sind die Befehle:

### **Windows (PowerShell):**

```powershell
# JWT Secret
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("dein-jwt-secret-hier"))

# OpenAI API Key
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("sk-dein-openai-key-hier"))

# Supabase URL
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("https://dein-projekt.supabase.co"))

# Supabase Anon Key
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("dein-supabase-anon-key-hier"))
```

### **Linux/Mac (Terminal):**

```bash
# JWT Secret
echo -n "dein-jwt-secret-hier" | base64

# OpenAI API Key
echo -n "sk-dein-openai-key-hier" | base64

# Supabase URL
echo -n "https://dein-projekt.supabase.co" | base64

# Supabase Anon Key
echo -n "dein-supabase-anon-key-hier" | base64
```

## 📝 Secrets die du anpassen musst

### **1. JWT_SECRET**

```yaml
JWT_SECRET: <base64-kodierter-jwt-secret>
```

**Zweck**: Für JWT-Token-Authentifizierung

### **2. OPENAI_API_KEY**

```yaml
OPENAI_API_KEY: <base64-kodierter-openai-key>
```

**Zweck**: Für AI-Features (Reading-Generierung, Chat)
**Wo bekommen**: [OpenAI API Keys](https://platform.openai.com/api-keys)

### **3. SUPABASE_URL**

```yaml
SUPABASE_URL: <base64-kodierte-supabase-url>
```

**Zweck**: Supabase-Datenbankverbindung
**Format**: `https://dein-projekt.supabase.co`

### **4. SUPABASE_ANON_KEY**

```yaml
SUPABASE_ANON_KEY: <base64-kodierter-supabase-anon-key>
```

**Zweck**: Supabase-Anonyme-API-Key
**Wo bekommen**: Supabase Dashboard → Settings → API

### **5. NASA_API_KEY (Optional)**

```yaml
NASA_API_KEY: <base64-kodierter-nasa-key>
```

**Zweck**: Mondkalender-Daten
**Standard**: `DEMO_KEY` (kostenlos, aber limitiert)
**Wo bekommen**: [NASA API](https://api.nasa.gov/)

### **6. E-Mail Konfiguration (Optional)**

```yaml
EMAIL_PROVIDER: <base64-kodierter-provider>  # mailchimp oder hubspot
EMAIL_API_KEY: <base64-kodierter-email-key>
MAILCHIMP_LIST_ID: <base64-kodierte-list-id>
HUBSPOT_PORTAL_ID: <base64-kodierte-portal-id>
FROM_EMAIL: <base64-kodierte-email-adresse>
```

## 🚀 Schnellstart

### **Minimale Konfiguration (nur für lokale Entwicklung):**

```yaml
# Diese Werte reichen für lokale Entwicklung:
JWT_SECRET: aGRfYXBwX2p3dF9zZWNyZXRfa2V5XzIwMjQ=  # hd_app_jwt_secret_key_2024
OPENAI_API_KEY: eW91cl9vcGVuYWlfYXBpX2tleV9oZXJl  # your_openai_api_key_here
SUPABASE_URL: eW91cl9zdXBhYmFzZV91cmxfaGVyZQ==     # your_supabase_url_here
SUPABASE_ANON_KEY: eW91cl9zdXBhYmFzZV9hbm9uX2tleV9oZXJl  # your_supabase_anon_key_here
NASA_API_KEY: Rk1FTU9fS0VZ  # DEMO_KEY
```

### **Vollständige Konfiguration (für Produktion):**

Alle Secrets mit echten Werten ersetzen.

## ⚠️ Wichtige Hinweise

### **Sicherheit:**

- ❌ **NIE** echte Secrets in Git committen
- ✅ **Immer** Base64-kodieren
- ✅ **Regelmäßig** Secrets rotieren
- ✅ **Produktions-Secrets** von Entwicklungs-Secrets trennen

### **Entwicklung vs. Produktion:**

```yaml
# Entwicklung (lokale Werte)
JWT_SECRET: aGRfYXBwX2p3dF9zZWNyZXRfa2V5XzIwMjQ=
OPENAI_API_KEY: eW91cl9vcGVuYWlfYXBpX2tleV9oZXJl

# Produktion (echte Werte)
JWT_SECRET: <echter-base64-kodierter-secret>
OPENAI_API_KEY: <echter-base64-kodierter-openai-key>
```

## 🔍 Secrets testen

Nach dem Deployment kannst du die Secrets testen:

```bash
# Secrets anzeigen
kubectl get secrets -n hd-app

# Secret-Details anzeigen
kubectl describe secret hd-app-secrets -n hd-app

# Secret-Wert dekodieren (nur für Tests!)
kubectl get secret hd-app-secrets -n hd-app -o jsonpath='{.data.JWT_SECRET}' | base64 -d
```

## 🛠️ Troubleshooting

### **Problem: Secret wird nicht geladen**

```bash
# Pod-Logs prüfen
kubectl logs deployment/hd-app-backend -n hd-app

# Environment-Variablen im Pod prüfen
kubectl exec -it deployment/hd-app-backend -n hd-app -- env | grep JWT_SECRET
```

### **Problem: Base64-Kodierung falsch**

```bash
# Testen ob Base64 korrekt ist
echo "aGRfYXBwX2p3dF9zZWNyZXRfa2V5XzIwMjQ=" | base64 -d
# Sollte ausgeben: hd_app_jwt_secret_key_2024
```

## 📚 Weitere Ressourcen

- [Kubernetes Secrets Dokumentation](https://kubernetes.io/docs/concepts/configuration/secret/)
- [Base64 Encoder/Decoder](https://www.base64encode.org/)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [Supabase API Keys](https://supabase.com/dashboard/project/_/settings/api)

---

**🎯 Nach dem Setup der Secrets kannst du die HD App auf Kubernetes deployen!**
