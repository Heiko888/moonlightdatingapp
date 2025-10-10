# 🚀 Stripe-Konfiguration - Vollständige Setup-Anleitung

## 📋 **Aktueller Status:**

### ✅ **Bereits implementiert:**
- Stripe SDK Integration
- Webhook-Handler mit Supabase-Integration
- Checkout Session API
- Environment Variable Templates

### ⚠️ **Noch zu konfigurieren:**
- `.env.local` Datei erstellen
- Stripe Account Setup
- Produkte und Preise erstellen
- Webhook konfigurieren

## 🔧 **Schritt-für-Schritt Setup:**

### **Schritt 1: Environment Variables erstellen**

```bash
# In frontend/ Verzeichnis:
cp env.stripe.example .env.local
```

### **Schritt 2: Stripe Account Setup**

1. **Stripe Account erstellen:**
   - Gehe zu [stripe.com](https://stripe.com)
   - Erstelle kostenlosen Account
   - Aktiviere Test-Modus

2. **API Keys abrufen:**
   - Dashboard → "Developers" → "API Keys"
   - Kopiere:
     - **Secret Key** (sk_test_...)
     - **Publishable Key** (pk_test_...)

### **Schritt 3: Produkte in Stripe erstellen**

**Im Stripe Dashboard → Products → Create Product:**

#### **Basic Package:**
```
Product Name: "HD App Basic"
Description: "Grundlegende Human Design Features"
Price: €9.99/Monat
Billing: Recurring
Price ID: price_xxxxx (kopieren!)
```

#### **Premium Package:**
```
Product Name: "HD App Premium" 
Description: "Erweiterte Analytics und Dating Features"
Price: €19.99/Monat
Billing: Recurring
Price ID: price_xxxxx (kopieren!)
```

#### **VIP Package:**
```
Product Name: "HD App VIP"
Description: "Persönlicher Coach und exklusive Features"
Price: €49.99/Monat
Billing: Recurring
Price ID: price_xxxxx (kopieren!)
```

### **Schritt 4: Webhook konfigurieren**

1. **Stripe Dashboard → "Developers" → "Webhooks"**
2. **"Add endpoint"**
3. **URL eingeben:** `http://localhost:3005/api/stripe/webhook`
4. **Events auswählen:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. **Webhook Secret kopieren** (whsec_...)

### **Schritt 5: .env.local konfigurieren**

```bash
# Supabase Configuration (bereits vorhanden)
NEXT_PUBLIC_SUPABASE_URL=https://njjcywgskzepikyzhihy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe API Keys (aus Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here

# Stripe Product IDs (aus Stripe Dashboard)
STRIPE_BASIC_PRICE_ID=price_your_basic_price_id_here
STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id_here
STRIPE_VIP_PRICE_ID=price_your_vip_price_id_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3005
```

## 🧪 **Test-Zahlungen einrichten:**

### **Test-Karten (Stripe Test-Modus):**

```text
# Erfolgreiche Zahlung:
Kartennummer: 4242 4242 4242 4242
CVV: Beliebige 3 Ziffern
Datum: Beliebige zukünftige Daten
ZIP: Beliebige 5 Ziffern

# Fehlgeschlagene Zahlung:
Kartennummer: 4000 0000 0000 0002

# 3D Secure:
Kartennummer: 4000 0025 0000 3155
```

### **Test-Workflow:**

1. **App starten:** `npm run dev`
2. **Pricing-Seite besuchen:** http://localhost:3005/pricing
3. **Paket auswählen** → Stripe Checkout öffnet sich
4. **Test-Karte eingeben** → Zahlung simulieren
5. **Webhook testen** → Subscription wird in Supabase aktualisiert

## 🔍 **Verification:**

### **1. Environment Variables prüfen:**
```bash
# In Browser Console (F12):
console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
```

### **2. Stripe Connection testen:**
```bash
# API Route testen:
curl -X POST http://localhost:3005/api/payment/create-checkout-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{"packageId": "basic", "priceId": "price_xxxxx"}'
```

### **3. Webhook testen:**
```bash
# Stripe CLI installieren:
npm install -g stripe-cli

# Webhook forwarding:
stripe listen --forward-to localhost:3005/api/stripe/webhook

# Test Event senden:
stripe trigger checkout.session.completed
```

## 🚀 **Production Setup:**

### **Für Live-Deployment:**

1. **Stripe auf Live-Modus wechseln**
2. **Live API Keys generieren**
3. **Live Webhook konfigurieren:**
   - URL: `https://yourdomain.com/api/stripe/webhook`
4. **Environment Variables aktualisieren**
5. **Mit echten Karten testen** (kleine Beträge)

## 📊 **Monitoring:**

### **Stripe Dashboard:**
- **Payments** → Alle Transaktionen
- **Customers** → Kundenverwaltung  
- **Webhooks** → Event-Logs
- **Products** → Produktverwaltung

### **Supabase Dashboard:**
- **Table Editor** → `subscriptions` Tabelle
- **SQL Editor** → Analytics Queries

## 🔒 **Sicherheit:**

### **Wichtige Hinweise:**
- ✅ **Niemals Live-Keys in Development verwenden**
- ✅ **Webhook Secret geheim halten**
- ✅ **HTTPS für Production Webhooks**
- ✅ **RLS Policies in Supabase aktiviert**

## 🆘 **Troubleshooting:**

### **Häufige Probleme:**

**"Stripe not configured":**
- Prüfe `.env.local` Datei
- Stelle sicher, dass alle Keys gesetzt sind
- Server neu starten

**"Invalid signature":**
- Prüfe Webhook Secret
- Stelle sicher, dass Webhook URL korrekt ist
- Teste mit Stripe CLI

**"Checkout Session Error":**
- Prüfe Price IDs
- Stelle sicher, dass Produkte in Stripe existieren
- Prüfe API Keys

---

**🎉 Nach diesem Setup funktioniert die komplette Stripe-Integration!**
