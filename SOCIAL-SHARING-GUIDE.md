# 📱 Social Sharing & Referral System - Komplette Anleitung

## 🎉 Was wurde implementiert?

### ✅ 1. **Social Share Component** (`SocialShare.tsx`)
Ein vollständig funktionaler Share-Dialog mit:
- **Multi-Platform Sharing**: Facebook, Twitter, LinkedIn, WhatsApp, Email
- **Anonymisierungs-Toggle**: Teile Charts mit oder ohne persönliche Daten
- **Link-Generierung**: Automatische Erstellung von Share-Links
- **Copy-to-Clipboard**: Ein-Klick Link-Kopieren
- **Native Share API**: Integration für Mobile-Geräte
- **Image Download**: Chart als Bild herunterladen (vorbereitet)

### ✅ 2. **Chart-to-Image Funktionalität** (`chartToImage.ts`)
- HTML-Element zu Bild konvertieren (PNG/JPEG)
- Download-Funktion für Charts
- Web Share API Integration
- Konfigurierbare Qualität und Format

### ✅ 3. **Anonyme Share-Links** (`/share/[id]/page.tsx`)
- Generierung einzigartiger Share-IDs
- 30-Tage Ablaufzeit
- View-Tracking
- Anonymisierte Chart-Darstellung
- Call-to-Action für neue Benutzer

### ✅ 4. **Open Graph Meta-Tags** (`OpenGraphMeta.tsx`)
- Schöne Vorschau auf Social Media
- Facebook, Twitter, LinkedIn optimiert
- Dynamische URL und Bild-Generierung
- SEO-optimiert

### ✅ 5. **Referral-System** (`ReferralSystem.ts` + `ReferralWidget.tsx`)
- Einzigartige Referral-Codes pro User
- Credit-System (10 Credits pro erfolgreiche Empfehlung)
- Tracking von Referrals (Pending → Completed)
- Welcome-Bonus für neue User (5 Credits)
- Leaderboard-Funktion
- Statistik-Dashboard

---

## 📦 Installation

### 1. **Dependencies installieren**

```bash
cd frontend
npm install html2canvas nanoid
```

### 2. **Datenbank-Schema einrichten**

Führe das SQL-Schema aus:

```bash
# Supabase Dashboard → SQL Editor
# Kopiere den Inhalt von supabase-social-sharing-schema.sql
```

Oder via Supabase CLI:

```bash
supabase db push
```

Das Schema erstellt:
- `shared_charts` - Geteilte Charts
- `referral_codes` - Referral-Codes
- `referral_uses` - Referral-Nutzungen
- `credit_transactions` - Credit-Transaktionen
- `user_actions` - Benutzer-Aktionen (Analytics)

### 3. **Environment Variables**

Füge zu `.env.local` hinzu:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3005
```

---

## 🚀 Verwendung

### **1. Social Share Button hinzufügen**

```tsx
import SocialShare from '@/components/SocialShare';

// In deiner Chart-Komponente:
<SocialShare
  title="Mein Human Design Chart"
  description="Schau dir mein Human Design Chart an!"
  chartData={chartData} // Optional: Chart-Daten zum Anonymisieren
  type="chart"
  onShare={(platform) => {
    console.log(`Geteilt auf ${platform}`);
  }}
/>
```

### **2. Open Graph Meta-Tags hinzufügen**

```tsx
import OpenGraphMeta from '@/components/OpenGraphMeta';

// In deinem Page Head:
<OpenGraphMeta
  title="Mein Human Design Chart"
  description="Entdecke dein einzigartiges Human Design"
  image="/og-image.png"
  url={`https://deine-domain.de/chart/${chartId}`}
/>
```

### **3. Referral Widget einbinden**

```tsx
import ReferralWidget from '@/components/ReferralWidget';

// Im User Dashboard:
<ReferralWidget />
```

### **4. Chart als Bild exportieren**

```tsx
import { downloadChartImage, shareChartImage } from '@/lib/utils/chartToImage';

// Download
await downloadChartImage('chart-element-id', 'mein-chart');

// Share (Mobile)
await shareChartImage('chart-element-id', 'Mein Human Design Chart');
```

---

## 🎯 Features im Detail

### **Social Share Dialog**

**Funktionen:**
- ✅ Anonymisierungs-Toggle
- ✅ Multi-Platform Sharing
- ✅ Link kopieren
- ✅ Native Share (Mobile)
- ✅ Download als Bild
- ✅ Tracking

**Platform-Support:**
- Facebook
- Twitter
- LinkedIn
- WhatsApp
- Telegram
- Email
- Native Share API (iOS/Android)

### **Referral-System**

**User-Flow:**
1. User generiert Referral-Code im Dashboard
2. User teilt Code mit Freunden
3. Freund registriert sich mit Code
4. Freund erhält **5 Credits** Welcome-Bonus
5. Wenn Freund Premium-Paket abonniert:
   - Referrer erhält **10 Credits**
   - Referral wird als "completed" markiert

**Statistiken:**
- Gesamt-Einladungen
- Erfolgreiche Referrals
- Verdiente Credits
- Conversion-Rate

**Leaderboard:**
- Top 10 Referrer
- Sortiert nach erfolgreichenReferrals
- Öffentlich einsehbar (optional)

---

## 🔧 API-Endpunkte

### **1. Share Link erstellen**

```typescript
POST /api/share/create

Body:
{
  "type": "chart",
  "data": {...chartData},
  "anonymize": true
}

Response:
{
  "shareId": "abc123xyz",
  "url": "https://app.de/share/abc123xyz"
}
```

### **2. Shared Chart abrufen**

```typescript
GET /api/share/[id]

Response:
{
  "type": "Generator",
  "profile": "3/5",
  "authority": "Emotional",
  "centers": {...},
  "gates": [...],
  "channels": [...],
  "isAnonymous": true,
  "views": 42,
  "createdAt": "2025-10-14T...",
  "expiresAt": "2025-11-13T..."
}
```

---

## 🎨 Styling & Customization

### **Social Share Button**

```tsx
<SocialShare
  // Custom Styling über sx prop möglich
/>
```

### **Referral Widget**

Das Widget passt sich automatisch dem Theme an:
- Gradient-Background
- Glassmorphism-Effekt
- Responsive Design
- Dark Mode ready

---

## 📊 Analytics & Tracking

### **User Actions Tracking**

Alle Share-Aktionen werden getrackt:

```typescript
// Automatisch in user_actions gespeichert:
{
  user_id: "...",
  action: "share_created",
  metadata: {
    type: "chart",
    anonymous: true,
    share_id: "abc123"
  }
}
```

### **Share View Tracking**

Jeder Aufruf eines Shared Charts wird gezählt:
- View Counter inkrementiert
- Timestamp erfasst
- Referrer erfasst (falls vorhanden)

---

## 🔒 Sicherheit & Privacy

### **Anonymisierung**

Wenn `anonymize: true`:
- Name wird entfernt
- Geburtsdatum entfernt
- Geburtszeit entfernt
- Geburtsort entfernt
- **NUR** Chart-Daten werden geteilt

### **Expiration**

- Shared Charts laufen nach **30 Tagen** ab
- Automatische Cleanup-Funktion verfügbar
- Expired Charts werden nicht mehr angezeigt

### **Row Level Security (RLS)**

Alle Tabellen haben RLS-Policies:
- Users können nur ihre eigenen Daten sehen/bearbeiten
- Shared Charts sind öffentlich lesbar
- Referral-System ist geschützt

---

## 🚀 Next Steps

### **1. Open Graph Image generieren**

Erstelle ein schönes OG-Image:

```bash
# Speichere in /public/og-image.png
# Empfohlene Größe: 1200x630px
```

### **2. Referral-Rewards anpassen**

In `ReferralSystem.ts`:

```typescript
reward: 10, // Ändere Credit-Betrag
welcomeAmount: 5, // Welcome-Bonus
```

### **3. Share-Templates anpassen**

In `SocialShare.tsx`:

```typescript
const text = `Dein custom Share-Text mit ${referralCode}`;
```

### **4. Cleanup-Job einrichten**

Für automatisches Löschen abgelaufener Shares:

```sql
SELECT cron.schedule(
  'cleanup-expired-shares', 
  '0 2 * * *', 
  'SELECT cleanup_expired_shares()'
);
```

---

## 🎯 Verwendung im Chart

### **Beispiel: Chart-Seite**

```tsx
// app/chart/page.tsx
import SocialShare from '@/components/SocialShare';
import OpenGraphMeta from '@/components/OpenGraphMeta';

export default function ChartPage() {
  return (
    <>
      <OpenGraphMeta
        title="Mein Human Design Chart - Generator 3/5"
        description="Entdecke dein einzigartiges Human Design"
        image="/og-chart.png"
      />
      
      <Box>
        {/* Chart-Inhalte */}
        <div id="chart-container">
          {/* Dein Chart hier */}
        </div>

        {/* Share Button */}
        <SocialShare
          title="Mein Human Design Chart"
          chartData={chartData}
          type="chart"
          onShare={(platform) => {
            // Analytics tracking
            trackEvent('chart_shared', { platform });
          }}
        />
      </Box>
    </>
  );
}
```

---

## 💡 Best Practices

### **1. Chart-to-Image Performance**

```typescript
// Große Charts: Reduziere Quality für schnellere Generation
await chartToImage('chart', { quality: 0.7 });

// Kleine Charts: Maximale Qualität
await chartToImage('chart', { quality: 1.0 });
```

### **2. Referral-Tracking**

```typescript
// Bei Registrierung mit Referral-Code:
const urlParams = new URLSearchParams(window.location.search);
const refCode = urlParams.get('ref');

if (refCode) {
  await referralSystem.useReferralCode(refCode, newUserId);
}
```

### **3. Share-Button Placement**

Platziere den Share-Button an strategischen Stellen:
- ✅ Oben rechts im Chart
- ✅ Nach erfolgreicher Chart-Generierung
- ✅ Im User-Profil
- ✅ Nach Upgrade auf Premium

---

## 🐛 Troubleshooting

### **"Failed to generate share link"**

```typescript
// Check Supabase Connection
const { error } = await supabase
  .from('shared_charts')
  .select('*')
  .limit(1);

if (error) console.error('Supabase Error:', error);
```

### **"Chart image is blurry"**

```typescript
// Erhöhe scale für bessere Qualität
await html2canvas(element, {
  scale: 3, // Höhere Qualität (default: 2)
  ...
});
```

### **"Referral code not working"**

```typescript
// Check if code exists
const { data } = await supabase
  .from('referral_codes')
  .select('*')
  .eq('code', referralCode)
  .single();

console.log('Code found:', data);
```

---

## 🎉 Fertig!

Dein **Social Sharing & Referral-System** ist jetzt einsatzbereit! 🚀

**Features:**
- ✅ Multi-Platform Sharing
- ✅ Anonyme Share-Links
- ✅ Chart-to-Image Export
- ✅ Referral-System mit Credits
- ✅ Open Graph Optimierung
- ✅ Analytics & Tracking

**Nächste Schritte:**
1. Teste alle Sharing-Funktionen
2. Erstelle schöne OG-Images
3. Aktiviere das Referral-System
4. Beobachte die Analytics
5. Sammle User-Feedback

Viel Erfolg mit deinem viralen Wachstum! 🌟

