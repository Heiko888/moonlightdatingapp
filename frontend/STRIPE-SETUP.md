# Stripe Integration Setup

Diese Anleitung führt Sie durch die Einrichtung der Stripe-Zahlungsabwicklung für die HD App.

## 1. Stripe Account erstellen

1. Gehen Sie zu [stripe.com](https://stripe.com)
2. Erstellen Sie einen kostenlosen Account
3. Aktivieren Sie den Test-Modus für Entwicklung

## 2. API Keys abrufen

1. Gehen Sie zu Ihrem Stripe Dashboard
2. Navigieren Sie zu "Developers" > "API Keys"
3. Kopieren Sie:
   - **Secret Key** (sk_test_...)
   - **Publishable Key** (pk_test_...)

## 3. Produkte und Preise erstellen

### Basic Package (€9.99/Monat)
```bash
# In Stripe Dashboard oder via API:
Product: "HD App Basic"
Price: €9.99/Monat
Price ID: price_xxxxx
```

### Premium Package (€19.99/Monat)
```bash
Product: "HD App Premium"
Price: €19.99/Monat
Price ID: price_xxxxx
```

### VIP Package (€49.99/Monat)
```bash
Product: "HD App VIP"
Price: €49.99/Monat
Price ID: price_xxxxx
```

## 4. Webhook konfigurieren

1. Gehen Sie zu "Developers" > "Webhooks"
2. Erstellen Sie einen neuen Endpoint:
   - **URL**: `https://yourdomain.com/api/stripe/webhook`
   - **Events**: Wählen Sie diese Events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. Kopieren Sie den **Webhook Secret** (whsec_...)

## 5. Environment Variables konfigurieren

Kopieren Sie `env.stripe.example` zu `.env.local` und füllen Sie die Werte aus:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret

# Stripe Product IDs
STRIPE_BASIC_PRICE_ID=price_your_basic_price_id
STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id
STRIPE_VIP_PRICE_ID=price_your_vip_price_id

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3005
```

## 6. Test-Zahlungen

### Test-Karten verwenden:
- **Erfolgreich**: 4242 4242 4242 4242
- **Fehlgeschlagen**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

### Test-Daten:
- **CVV**: Beliebige 3 Ziffern
- **Datum**: Beliebige zukünftige Daten
- **ZIP**: Beliebige 5 Ziffern

## 7. Features

### ✅ Implementiert:
- [x] Stripe SDK Integration
- [x] Checkout Session Creation
- [x] Customer Portal
- [x] Webhook Handling
- [x] Subscription Management
- [x] Pricing Page Integration
- [x] Settings Page Integration

### 🔄 Workflow:
1. **User wählt Paket** auf `/pricing`
2. **Stripe Checkout** wird geöffnet
3. **Zahlung** wird verarbeitet
4. **Webhook** aktualisiert Subscription
5. **User** wird zu Dashboard weitergeleitet
6. **Settings** zeigt Subscription-Management

## 8. Production Setup

### Für Production:
1. Wechseln Sie zu **Live Mode** in Stripe
2. Erstellen Sie **Live API Keys**
3. Konfigurieren Sie **Live Webhooks**
4. Aktualisieren Sie **Environment Variables**
5. Testen Sie mit **echten Karten** (kleine Beträge)

### Domain-Konfiguration:
```bash
# Für Production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 9. Troubleshooting

### Häufige Probleme:

**Webhook nicht empfangen:**
- Prüfen Sie die Webhook-URL
- Stellen Sie sicher, dass HTTPS verwendet wird
- Prüfen Sie die Event-Auswahl

**Checkout Session Fehler:**
- Prüfen Sie die Price IDs
- Stellen Sie sicher, dass die Keys korrekt sind
- Prüfen Sie die Domain-Konfiguration

**Customer Portal Fehler:**
- Stellen Sie sicher, dass der Customer existiert
- Prüfen Sie die Customer-ID

## 10. Support

Bei Problemen:
1. Prüfen Sie die Stripe Dashboard Logs
2. Prüfen Sie die Browser Console
3. Prüfen Sie die Server Logs
4. Kontaktieren Sie den Support

---

**Wichtig:** Verwenden Sie niemals Live-Keys in der Entwicklung!
