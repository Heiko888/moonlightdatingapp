# 📖 Reading-System Dokumentation

## Übersicht

Das Reading-System ermöglicht es Benutzern, personalisierte Human Design Readings zu buchen, die mit einem persönlichen Zoom-Meeting mit einem Coach verbunden sind. Das System verwaltet den gesamten Prozess von der Anfrage bis zur PDF-Lieferung.

## 🚀 Workflow

```
1. User → Füllt Reading-Formular aus
2. System → Erstellt Reading mit Status "pending"
3. System → Sendet Bestätigungs-E-Mail an User
4. System → Benachrichtigt Coach über neue Anfrage
5. Coach → Vereinbart Zoom-Termin → Status "zoom-scheduled"
6. System → Sendet Zoom-Details an User
7. Coach → Führt Zoom-Reading durch → Status "completed"
8. Coach → Bereitet Reading vor → Status "approved"
9. System → Generiert PDF
10. System → Sendet Download-Link an User
11. User → Lädt Reading-PDF herunter
```

## 📁 Dateistruktur

### Frontend Seiten
- `/frontend/app/reading/page.tsx` - Hauptseite für Readings
- `/frontend/app/reading/next-steps/page.tsx` - Erklärungsseite nach Anmeldung
- `/frontend/app/coach/dashboard/page.tsx` - Coach-Dashboard

### API Routes
- `/frontend/app/api/readings/route.ts` - GET (alle) & POST (neu)
- `/frontend/app/api/readings/[id]/route.ts` - GET, PATCH, DELETE (einzeln)
- `/frontend/app/api/coach/readings/route.ts` - Coach-spezifische Endpunkte

### Services
- `/frontend/lib/email/emailService.ts` - E-Mail-Benachrichtigungen
- `/frontend/lib/pdf/pdfGenerator.ts` - PDF-Generierung

## 🎯 Status-System

| Status | Beschreibung | Farbe | Aktion |
|--------|--------------|-------|--------|
| `pending` | Warte auf Termin | Gelb | Coach vereinbart Termin |
| `zoom-scheduled` | Termin vereinbart | Blau | User wartet auf Zoom |
| `completed` | Zoom abgeschlossen | Lila | Coach bereitet PDF vor |
| `approved` | Freigegeben | Grün | User kann PDF downloaden |

## 📧 E-Mail-Templates

### 1. Reading-Bestätigung (`pending`)
- **Trigger:** User erstellt neues Reading
- **An:** User
- **Inhalt:** Bestätigung der Anfrage, nächste Schritte

### 2. Coach-Benachrichtigung
- **Trigger:** User erstellt neues Reading
- **An:** Coach
- **Inhalt:** Neue Reading-Anfrage mit Details

### 3. Zoom-Termin (`zoom-scheduled`)
- **Trigger:** Coach aktualisiert Status + Zoom-Details
- **An:** User
- **Inhalt:** Zoom-Link, Datum/Uhrzeit, Vorbereitung

### 4. Reading freigegeben (`approved`)
- **Trigger:** Coach gibt Reading frei
- **An:** User
- **Inhalt:** PDF-Download-Link

## 🔧 API-Endpunkte

### User-Endpunkte

#### POST /api/readings
Erstellt ein neues Reading.

**Body:**
```json
{
  "userId": "user123",
  "title": "Mein Business Reading",
  "question": "Wie kann ich...",
  "category": "business",
  "birthdate": "1990-01-15",
  "birthtime": "14:30",
  "birthplace": "München, Deutschland",
  "email": "user@example.com",
  "phone": "+49 123 456789"
}
```

**Response:**
```json
{
  "message": "Reading erfolgreich erstellt",
  "reading": {
    "id": "reading_1234567890",
    "status": "pending",
    ...
  }
}
```

#### GET /api/readings?userId=xxx
Ruft alle Readings eines Users ab.

#### GET /api/readings/[id]
Ruft ein einzelnes Reading ab.

#### PATCH /api/readings/[id]
Aktualisiert ein Reading (hauptsächlich für Coach).

**Body:**
```json
{
  "status": "zoom-scheduled",
  "zoomLink": "https://zoom.us/j/...",
  "zoomDate": "2024-01-20T15:00:00Z",
  "coachNotes": "Notizen..."
}
```

### Coach-Endpunkte

#### GET /api/coach/readings
Ruft alle Readings für Coach-Dashboard ab.

**Query-Parameter:**
- `status` - Filtert nach Status
- `sortBy` - Sortierung (default: createdAt)
- `order` - asc/desc (default: desc)

**Response:**
```json
{
  "readings": [...],
  "stats": {
    "total": 10,
    "pending": 3,
    "zoomScheduled": 2,
    "completed": 3,
    "approved": 2
  }
}
```

## 💻 Installation & Verwendung

### Voraussetzungen
```bash
Node.js 18+
npm oder yarn
```

### Installation
```bash
cd frontend
npm install
```

### Entwicklungsserver starten
```bash
npm run dev
```

### Seiten aufrufen

#### User-Seiten:
- Reading-Übersicht: `http://localhost:3005/reading`
- Nächste Schritte: `http://localhost:3005/reading/next-steps`

#### Coach-Seiten:
- Coach-Dashboard: `http://localhost:3005/coach/dashboard`

## 🧪 Testing

### 1. Neues Reading erstellen
```bash
# Gehe zu http://localhost:3005/reading
# Klicke auf "Reading starten"
# Fülle das Formular aus
# Prüfe Konsole für E-Mail-Logs
```

### 2. Coach-Dashboard testen
```bash
# Gehe zu http://localhost:3005/coach/dashboard
# Sehe alle Readings
# Klicke auf Edit-Icon
# Ändere Status und speichere
# Prüfe Konsole für E-Mail-Logs
```

### 3. Status-Änderungen simulieren
```javascript
// In Browser-Konsole:
fetch('/api/readings/reading_xxx', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'approved',
    zoomLink: 'https://zoom.us/j/test',
    zoomDate: new Date().toISOString()
  })
}).then(r => r.json()).then(console.log);
```

## 🔐 Authentifizierung (TODO)

Aktuell verwendet das System eine einfache localStorage-basierte Authentifizierung. In Produktion sollte implementiert werden:

1. **JWT-basierte Authentifizierung**
2. **Role-based Access Control (RBAC)**
   - User-Rolle: Kann nur eigene Readings sehen
   - Coach-Rolle: Kann alle Readings verwalten
3. **API-Route-Schutz mit Middleware**

## 📦 Datenspeicherung

### Aktuell (Entwicklung)
- In-Memory Store (flüchtiger Speicher)
- localStorage für Frontend

### Empfohlen für Produktion
- **Datenbank:** PostgreSQL, MongoDB, oder Supabase
- **File Storage:** AWS S3, Google Cloud Storage für PDFs
- **Caching:** Redis für Performance

### Migration zu Datenbank

```typescript
// Beispiel: Supabase-Integration
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Reading erstellen
const { data, error } = await supabase
  .from('readings')
  .insert([newReading]);

// Readings abrufen
const { data: readings } = await supabase
  .from('readings')
  .select('*')
  .eq('userId', userId);
```

## 📧 E-Mail-Integration

### Aktuell (Entwicklung)
- E-Mails werden in Konsole geloggt
- Keine echten E-Mails

### Für Produktion

#### Option 1: SendGrid
```typescript
// .env
EMAIL_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@yourdomain.com

// lib/email/emailService.ts
const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(emailData)
});
```

#### Option 2: Resend (empfohlen für Next.js)
```bash
npm install resend
```

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Human Design <onboarding@resend.dev>',
  to: user.email,
  subject: 'Dein Reading ist bereit!',
  html: emailTemplate
});
```

## 📄 PDF-Generierung

### Aktuell (Entwicklung)
- Simulierte PDF-Generierung
- Placeholder-URLs

### Für Produktion

#### Option 1: jsPDF (Client-Side)
```bash
npm install jspdf
```

```typescript
import { jsPDF } from 'jspdf';

const doc = new jsPDF();
doc.text(readingContent, 10, 10);
const pdfBlob = doc.output('blob');
```

#### Option 2: Puppeteer (Server-Side, empfohlen)
```bash
npm install puppeteer
```

```typescript
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setContent(htmlContent);
const pdf = await page.pdf({ format: 'A4' });
await browser.close();
```

#### Option 3: @react-pdf/renderer
```bash
npm install @react-pdf/renderer
```

```typescript
import { Document, Page, Text, pdf } from '@react-pdf/renderer';

const MyDocument = () => (
  <Document>
    <Page>
      <Text>{readingContent}</Text>
    </Page>
  </Document>
);

const blob = await pdf(<MyDocument />).toBlob();
```

## 🔒 Sicherheit

### Wichtige Maßnahmen für Produktion

1. **API-Route-Validierung**
   - Input-Validierung mit Zod oder Yup
   - Rate-Limiting
   - CSRF-Schutz

2. **Datenschutz**
   - DSGVO-konforme Datenspeicherung
   - Verschlüsselung sensibler Daten
   - Daten-Löschung nach Frist

3. **Zugriffskontrolle**
   - Authentifizierung auf allen geschützten Routes
   - Autorisierung für Coach-Dashboard
   - API-Keys für externe Services

## 📊 Monitoring & Analytics

### Empfohlene Tools
- **Sentry** - Error Tracking
- **Vercel Analytics** - Performance Monitoring
- **PostHog** - User Analytics
- **LogTail** - Log-Management

## 🚀 Deployment

### Vercel (empfohlen)
```bash
npm install -g vercel
vercel --prod
```

### Umgebungsvariablen setzen
```bash
EMAIL_API_KEY=xxx
EMAIL_FROM=xxx
COACH_EMAIL=xxx
DATABASE_URL=xxx
PDF_STORAGE_BUCKET=xxx
```

## 📞 Support & Weiterentwicklung

### Nächste Features
- [ ] Kalender-Integration (Calendly, Cal.com)
- [ ] Automatische Erinnerungen vor Zoom-Termin
- [ ] Video-Recording-Upload nach Zoom
- [ ] Bewertungssystem für Readings
- [ ] Multi-Coach-Support
- [ ] Zahlungs-Integration

### Known Issues
- In-Memory Store verliert Daten bei Server-Neustart
- Keine echten E-Mails in Entwicklung
- PDF-Generierung ist simuliert

---

**Version:** 1.0.0  
**Letzte Aktualisierung:** Oktober 2024  
**Autor:** Human Design Team

