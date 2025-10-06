# 🔐 HD App - Authentifizierung & VIP-Bereiche Übersicht

## 📋 **Paket-Hierarchie**

| Paket | Beschreibung | Preis | Zugang |
|-------|-------------|-------|--------|
| **Free** | Grundfunktionen | Kostenlos | Öffentlich |
| **Basic** | Erweiterte Features | €9.99/Monat | Nach Registrierung |
| **Premium** | Premium-Features | €19.99/Monat | Bezahlung erforderlich |
| **VIP** | Exklusive Features | €49.99/Monat | Bezahlung erforderlich |
| **Admin** | Verwaltung | Speziell | Admin-Berechtigung |

## 🌐 **Öffentliche Seiten (Free - Kein Login erforderlich)**

| Seite | Pfad | Beschreibung |
|-------|------|-------------|
| **Startseite** | `/` | Hauptseite der App |
| **Login** | `/login` | Benutzer anmelden |
| **Registrierung** | `/register` | Neuen Account erstellen |
| **Verkaufsseite** | `/sales` | Paket-Informationen |
| **Preise** | `/pricing` | Preisübersicht |
| **Human Design Info** | `/human-design-info` | Grundinformationen |
| **Chart Info** | `/chart-info` | Chart-Informationen |
| **Profil Einrichten** | `/profil-einrichten` | Profil einrichten |

## 🔓 **Basic-Paket (Nach Registrierung - €9.99/Monat)**

| Seite | Pfad | Beschreibung |
|-------|------|-------------|
| **Dashboard** | `/dashboard` | Benutzer-Dashboard |
| **Chart** | `/chart` | Human Design Chart berechnen |
| **Human Design Chart** | `/human-design-chart` | Detailliertes Chart |
| **Community** | `/community` | Community-Zugang (Basis) |
| **Community Hub** | `/community/hub` | Erweiterte Community-Features |
| **Friends** | `/friends` | Freunde-Funktionen |
| **Mondkalender** | `/mondkalender` | Mondkalender-Features |
| **Journal** | `/journal` | Persönliches Journal |
| **Reading** | `/reading` | Chart-Readings |
| **Chat** | `/chat-new` | Chat-System |
| **Mobile App** | `/mobile-app` | Mobile App Download |
| **Profil** | `/profil` | Benutzerprofil |
| **Einstellungen** | `/settings` | App-Einstellungen |

## ⭐ **Premium-Paket (€19.99/Monat)**

| Seite | Pfad | Beschreibung |
|-------|------|-------------|
| **Bodygraph Advanced** | `/bodygraph-advanced` | Erweiterte Bodygraph-Analyse |
| **Chart Comparison** | `/chart-comparison` | Chart-Vergleich |
| **Dating** | `/dating` | Dating-System |
| **Coaching** | `/coaching` | Coaching-Features |
| **Analytics** | `/analytics` | Premium-Analytics |
| **API-Zugang** | `/api-access` | Entwickler-API-Zugang |
| **Planeten-Energien** | `/planets` | Alle 64 Gates und 9 Centers |
| **Roadmap** | `/roadmap` | Projekt-Roadmap |
| **Premium Dashboard** | `/premium-dashboard` | Premium-Dashboard |

## 👑 **VIP-Paket (€49.99/Monat)**

| Seite | Pfad | Beschreibung |
|-------|------|-------------|
| **VIP Dashboard** | `/dashboard-vip` | Exklusives VIP-Dashboard |
| **VIP Community** | `/vip-community` | Exklusive VIP-Community |
| **Persönlicher Coach** | `/personal-coach` | 1:1 Coaching-Sessions |
| **Analytics** | `/analytics` | Premium-Analytics |
| **API-Zugang** | `/api-access` | Entwickler-API-Zugang |

## 🔧 **Admin-Bereich (Separate Berechtigung)**

| Seite | Pfad | Beschreibung |
|-------|------|-------------|
| **Admin** | `/admin` | Administrationsbereich |
| **Content Management** | `/admin/content/advanced` | Content-Verwaltung |
| **User Management** | `/admin/users` | Benutzer-Verwaltung |

## 💳 **Stripe Integration Status**

### ✅ **Bereits implementiert:**
- Stripe API Integration (`lib/stripe.ts`)
- Subscription Management (`components/SubscriptionManagement.tsx`)
- Customer Portal (`app/api/stripe/customer-portal/route.ts`)
- Pricing Page (`app/pricing/page.tsx`)
- Environment Setup (`env.stripe.example`)

### 🔧 **Benötigte Konfiguration:**

#### **1. Stripe API Keys:**
```bash
# In .env.local hinzufügen:
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
```

#### **2. Stripe Product IDs:**
```bash
STRIPE_BASIC_PRICE_ID=price_your_basic_price_id
STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id
STRIPE_VIP_PRICE_ID=price_your_vip_price_id
```

#### **3. App URL:**
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3005
```

## 🚨 **Aktuelle Probleme:**

### **1. VIP-Freischaltung funktioniert nicht:**
- **Problem**: Alle Seiten sind geschützt
- **Ursache**: Subscription-System nicht vollständig konfiguriert
- **Lösung**: Stripe-Konfiguration und Test-Zahlungen einrichten

### **2. Registrierungsdaten:**
- **Problem**: Unklare Registrierungsdaten
- **Lösung**: Test-Accounts mit verschiedenen Paketen erstellen

### **3. Middleware-Konflikte:**
- **Problem**: Middleware blockiert Zugriff
- **Lösung**: Access Control System überarbeiten

## 🛠️ **Lösungsvorschläge:**

### **1. Stripe Test-Setup:**
```bash
# Test-Karten für Stripe:
# Erfolgreich: 4242 4242 4242 4242
# Fehlgeschlagen: 4000 0000 0000 0002
# 3D Secure: 4000 0000 0000 3220
```

### **2. Test-Accounts erstellen:**
- **Free**: Automatisch nach Registrierung
- **Basic**: Test-Zahlung mit Stripe
- **Premium**: Test-Zahlung mit Stripe
- **VIP**: Test-Zahlung mit Stripe

### **3. Environment-Setup:**
```bash
# .env.local erstellen:
cp env.stripe.example .env.local
# Stripe-Keys eintragen
```

## 📞 **Nächste Schritte:**

1. **Stripe-Konfiguration vervollständigen**
2. **Test-Zahlungen einrichten**
3. **VIP-Bereiche testen**
4. **Access Control System überprüfen**

**Benötigen Sie die Stripe-URL für Testkäufe?** 🚀
