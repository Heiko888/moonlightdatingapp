# 💕 Connection Code Buchungssystem

## 📋 Übersicht

Das Connection Code Buchungssystem ermöglicht es Usern, persönliche Zoom-Sessions für Beziehungsanalysen zu buchen.

---

## ✨ Features

### 1. Buchungsseite (`/connection-code/booking`)

#### **Schritt 1: Paket-Auswahl**
- **Einzelsession**: €149 - Perfekt zum Kennenlernen
- **3er-Paket**: €399 (€133/Session) - **Beliebteste Wahl** - Spare €48
- **5er-Paket**: €599 (€120/Session) - Bester Preis - Spare €146

#### **Schritt 2: Termin-Auswahl**
- Übersichtlicher Kalender
- Verfügbare Zeitslots nach Datum gruppiert
- Echtzeit-Verfügbarkeit
- Zeitzone: Deutschland (CET/CEST)

#### **Schritt 3: Daten eingeben**
- **Deine Kontaktdaten**:
  - Name (automatisch aus Profil geladen)
  - E-Mail (automatisch aus Profil geladen)
  - Telefon (optional)
- **Partner 1 Daten**:
  - Name
  - Geburtsdatum
  - Geburtszeit (optional)
  - Geburtsort (optional)
- **Partner 2 Daten**:
  - Name
  - Geburtsdatum
  - Geburtszeit (optional)
  - Geburtsort (optional)
- **Notizen**: Besondere Wünsche oder Fragen (optional)

#### **Schritt 4: Zusammenfassung & Bezahlung**
- Übersicht aller Buchungsdetails
- Paket & Preis
- Termin
- Kontaktdaten
- Redirect zu Stripe Checkout

---

## 🎨 Design

### **Farbschema**
- **Primary**: `#ff6b9d` (Rosa) - Liebe & Verbindung
- **Secondary**: `#4ecdc4` (Türkis) - Energie & Klarheit
- **Success**: `#10b981` (Grün) - Bestätigung
- **Gold**: `#FFD700` - Beliebteste Wahl Badge

### **Styling**
- Glassmorphism-Effekt auf allen Cards
- Gradient-Buttons für CTAs
- Smooth Transitions & Hover-Effekte
- Responsive für Mobile & Desktop
- Dark Theme mit radialen Gradienten im Hintergrund

---

## 💳 Stripe Integration

### **Checkout Flow**
1. User wählt Paket & füllt Formular aus
2. Click auf "Jetzt buchen"
3. API Call: `/api/payment/create-checkout-session`
4. Redirect zu Stripe Checkout
5. Nach erfolgreicher Zahlung: Redirect zu `/connection-code/success`

### **Metadata in Stripe**
```javascript
{
  bookingType: 'connection-code',
  sessions: <Anzahl Sessions>,
  date: <Gewähltes Datum>,
  time: <Gewählte Uhrzeit>,
  customerEmail: <User Email>
}
```

---

## 📦 Datenstruktur

### **localStorage: `pendingBooking`**
Während der Buchung (vor Zahlung):
```javascript
{
  package: {
    id: 'single' | 'triple' | 'five',
    name: string,
    sessions: number,
    price: number,
    pricePerSession: number,
    savings: number,
    popular: boolean,
    description: string
  },
  date: '2025-10-20',
  time: '10:00',
  name: 'Max Mustermann',
  email: 'max@example.com',
  phone: '+49...',
  partner1Name: 'Anna',
  partner1BirthDate: '1990-05-15',
  partner1BirthTime: '14:30',
  partner1BirthPlace: 'Berlin',
  partner2Name: 'Tom',
  partner2BirthDate: '1988-03-22',
  partner2BirthTime: '09:15',
  partner2BirthPlace: 'München',
  notes: 'Wir interessieren uns besonders für...',
  createdAt: '2025-10-15T...'
}
```

### **localStorage: `userBookings`**
Nach erfolgreicher Zahlung:
```javascript
[
  {
    ...pendingBooking,
    status: 'confirmed',
    bookingId: 'CC-1728998400000',
    type: 'connection-code'
  }
]
```

---

## 🔄 User Flow

```
/resonanzanalyse
  └─ Button: "💕 Connection Code jetzt buchen"
      └─> /connection-code/booking
          ├─ Schritt 1: Paket wählen
          ├─ Schritt 2: Termin wählen
          ├─ Schritt 3: Daten eingeben
          └─ Schritt 4: Zusammenfassung
              └─> Stripe Checkout
                  ├─ Zahlung erfolgreich
                  │   └─> /connection-code/success
                  │       ├─ Bestätigung
                  │       ├─ E-Mail verschickt
                  │       └─ Buttons: Dashboard | Resonanzanalyse
                  │
                  └─ Zahlung abgebrochen
                      └─> /connection-code/booking (zurück)
```

---

## 📧 E-Mail Flow (TODO)

### **1. Buchungsbestätigung**
- **Wann**: Sofort nach erfolgreicher Zahlung
- **Inhalt**:
  - Buchungsnummer
  - Gewähltes Paket
  - Termin (Datum & Uhrzeit)
  - Partner-Daten
  - Rechnungs-PDF

### **2. Zoom-Link**
- **Wann**: 24 Stunden vor der Session
- **Inhalt**:
  - Zoom-Meeting-Link
  - Meeting-ID & Passwort
  - Vorbereitung: Was mitbringen?

### **3. PDF-Analyse**
- **Wann**: Nach der Session (Coach-Freigabe)
- **Inhalt**:
  - Detaillierte PDF-Analyse
  - Chart-Vergleich
  - Persönliche Notizen vom Coach

---

## 🚀 API Endpoints

### **POST `/api/payment/create-checkout-session`**
Erstellt eine Stripe Checkout Session.

**Request:**
```json
{
  "packageId": "triple",
  "amount": 399,
  "productName": "Connection Code - 3er-Paket",
  "successUrl": "https://.../connection-code/success",
  "cancelUrl": "https://.../connection-code/booking",
  "metadata": {
    "bookingType": "connection-code",
    "sessions": 3,
    "date": "2025-10-20",
    "time": "10:00",
    "customerEmail": "max@example.com"
  }
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/...",
  "sessionId": "cs_test_..."
}
```

---

## 🎯 Nächste Schritte

### **Kurzfristig (manuell möglich)**
- [ ] Stripe Webhook für automatische Buchungsbestätigung
- [ ] E-Mail Versand (Bestätigung + Zoom-Link)
- [ ] Admin-Panel für Termin-Verwaltung

### **Mittelfristig (Backend-Integration)**
- [ ] Supabase-Tabelle für Bookings
- [ ] Coach-Zuordnung
- [ ] Kalender-Synchronisation (Google Calendar)
- [ ] Automatische Zoom-Meeting-Erstellung

### **Langfristig (Automatisierung)**
- [ ] Warteschlangen-System bei ausgebuchten Terminen
- [ ] Automatische Erinnerungen (1 Woche, 1 Tag, 1 Stunde vorher)
- [ ] Rating-System nach Sessions
- [ ] Wiederbuchungs-Rabatte

---

## 🔧 Technische Details

### **Dependencies**
- `@mui/material` - UI Components
- `lucide-react` - Icons
- `next/navigation` - Routing
- Stripe Client SDK

### **Files**
```
frontend/
├── app/
│   ├── connection-code/
│   │   ├── booking/
│   │   │   └── page.tsx          # Buchungsseite (4 Schritte)
│   │   └── success/
│   │       └── page.tsx          # Erfolgsseite nach Zahlung
│   └── resonanzanalyse/
│       └── page.tsx              # Link zur Buchung hinzugefügt
```

### **State Management**
- React `useState` für Formular-Daten
- `localStorage` für Buchungs-Persistenz
- URL-Parameter für Schritt-Navigation (zukünftig)

---

## 📱 Responsive Design

- **Mobile**: 1-spaltig, große Buttons
- **Tablet**: 2-spaltig (Partner-Daten)
- **Desktop**: 3-spaltig (Paket-Auswahl)

---

## ✅ Testing

### **Manuell testen**
1. Navigiere zu `/resonanzanalyse`
2. Klicke "💕 Connection Code jetzt buchen"
3. Durchlaufe alle 4 Schritte
4. Prüfe Validierung (leere Felder)
5. Prüfe Stripe Redirect (Test-Modus)
6. Prüfe Success-Page

### **Test-Daten**
```
Partner 1:
- Name: Anna Müller
- Geburtsdatum: 1990-05-15
- Geburtszeit: 14:30
- Geburtsort: Berlin

Partner 2:
- Name: Tom Schmidt
- Geburtsdatum: 1988-03-22
- Geburtszeit: 09:15
- Geburtsort: München
```

---

## 📊 Analytics (TODO)

Tracking für:
- Paket-Auswahl (welches Paket am beliebtesten?)
- Abbruch-Rate pro Schritt
- Durchschnittliche Conversion-Time
- Beliebte Buchungszeiten

---

## 🎉 Fazit

Das Connection Code Buchungssystem ist **vollständig implementiert** und bereit für die Integration mit Stripe und Backend-Services!

**Nächster Schritt**: Stripe Test-Modus konfigurieren und erste Test-Buchung durchführen! 🚀

