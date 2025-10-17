# 🚀 Matches System Setup - Echte Datenbank-Daten

## ✅ Was wurde implementiert?

### 1. **API-Endpunkt**: `/api/matches`

- **GET**: Lädt alle aktiven Match-Profile aus Supabase
- **POST**: Erstellt neue Match-Profile
- **Datei**: `frontend/app/api/matches/route.ts`

### 2. **Datenbank-Tabelle**: `matching_profiles`

- Speichert Profile für das Matching-System
- **Datei**: `create-matching-profiles-table.sql`

### 3. **Angepasste Match-Seite**

- Lädt jetzt echte Daten aus der Datenbank
- Fallback auf Mock-Daten, wenn DB leer ist
- **Datei**: `frontend/app/match/page.tsx`

---

## 🎯 Setup-Schritte

### **Schritt 1: Datenbank-Tabelle erstellen**

Falls noch nicht vorhanden, führe in Supabase SQL Editor aus:

```sql
CREATE TABLE IF NOT EXISTS matching_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  location TEXT,
  bio TEXT,
  hd_type TEXT,
  profile TEXT,
  authority TEXT,
  strategy TEXT,
  centers JSONB,
  channels JSONB,
  gates JSONB,
  planets JSONB,
  interests JSONB,
  images JSONB,
  avatar TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices für Performance
CREATE INDEX IF NOT EXISTS idx_matching_profiles_user_id ON matching_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_matching_profiles_active ON matching_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_matching_profiles_location ON matching_profiles(location);

-- RLS Policies
ALTER TABLE matching_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON matching_profiles
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON matching_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON matching_profiles
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON matching_profiles
  FOR DELETE USING (true);
```

### **Schritt 2: Development Server starten**

```powershell
cd frontend
npm run dev
```

Server läuft auf: `http://localhost:3005`

### **Schritt 3: Test-Profile einfügen**

#### Option A: PowerShell Script (Empfohlen)

```powershell
.\insert-test-profiles-to-supabase.ps1
```

Das Script fügt automatisch 6 Test-Profile ein:

- ✅ Sarah (28, Berlin) - Generator
- ✅ Marcus (32, München) - Projector
- ✅ Luna (26, Hamburg) - Manifestor
- ✅ David (35, Köln) - Reflector
- ✅ Emma (29, Frankfurt) - Generator
- ✅ Alex (31, Stuttgart) - Projector

#### Option B: Manuell via SQL

```sql
-- Führe insert-test-profiles.sql in Supabase SQL Editor aus
```

#### Option C: Via API (curl)

```bash
curl -X POST http://localhost:3005/api/matches \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-1",
    "name": "Sarah",
    "age": 28,
    "location": "Berlin",
    "bio": "Leidenschaftliche Generatorin...",
    "hd_type": "Generator",
    "profile": "2/4",
    "authority": "Sakral",
    "strategy": "Auf andere reagieren",
    "interests": ["Yoga", "Meditation"],
    "images": ["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"],
    "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"
  }'
```

### **Schritt 4: Testen**

1. Öffne: `http://localhost:3005/match`
2. Du solltest jetzt die echten Profile aus der Datenbank sehen! 🎉

---

## 🔍 Wie funktioniert es?

### **Datenfluss:**

```text
[Match Page]
    ↓
    useEffect() lädt beim Start
    ↓
[GET /api/matches?userId=xxx&limit=20]
    ↓
[Supabase Query]
    ↓
SELECT * FROM matching_profiles WHERE is_active = true
    ↓
[Transform Data]
    ↓
[Display in UI]
```

### **API-Endpunkt Details:**

#### GET `/api/matches`

**Query Parameter:**

- `userId` (optional): Aktueller User für Matching-Algorithmus
- `limit` (optional, default: 10): Max. Anzahl Profile

**Response:**

```json
{
  "success": true,
  "matches": [
    {
      "id": "uuid",
      "name": "Sarah",
      "age": 28,
      "location": "Berlin",
      "hdType": "Generator",
      "compatibility": 92,
      "profile": {
        "bio": "...",
        "interests": ["Yoga", "Meditation"]
      }
    }
  ],
  "count": 6
}
```

#### POST `/api/matches`

**Body:**

```json
{
  "user_id": "uuid",
  "name": "Name",
  "age": 28,
  "location": "Stadt",
  "bio": "Bio Text",
  "hd_type": "Generator",
  "interests": ["Interest1", "Interest2"],
  "avatar": "https://..."
}
```

---

## 🐛 Troubleshooting

### **Problem: "Keine Matches in Datenbank"**

**Lösung:**

1. Prüfe ob Tabelle existiert: `SELECT * FROM matching_profiles;` in Supabase
2. Führe `insert-test-profiles-to-supabase.ps1` aus
3. Prüfe Console-Logs im Browser (F12)

### **Problem: "Failed to fetch profiles"**

**Lösung:**

1. Prüfe Supabase Credentials in `frontend/.env.local`:

   ```text
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   ```

2. Prüfe RLS Policies in Supabase
3. Prüfe Server-Logs: `npm run dev`

### **Problem: PowerShell Script schlägt fehl**

**Lösung:**

1. Development Server muss laufen (`npm run dev`)
2. Prüfe `.env.local` Datei
3. Führe Script mit Admin-Rechten aus

---

## 📊 Nächste Schritte (Optional)

### **1. Erweiterte Matching-Logik**

- Kompatibilitäts-Berechnung basierend auf HD-Typen
- Geografische Nähe berücksichtigen
- Interessen-Matching

### **2. User-eigenes Profil**

- Eigenes Profil erstellen/bearbeiten
- Profilbilder hochladen
- Bio und Interessen verwalten

### **3. Like/Match System**

- Swipe-Funktion implementieren
- Match-Benachrichtigungen
- Chat-Integration

### **4. Echtzeit-Features**

- Online-Status
- Typing-Indicators
- Push-Notifications

---

## ✨ Zusammenfassung

✅ API-Endpunkt für Matches erstellt
✅ Match-Seite lädt echte Daten aus Supabase
✅ Test-Profile verfügbar
✅ Fallback auf Mock-Daten bei leerer DB
✅ PowerShell Script für einfaches Setup

**Nächster Schritt:** Führe `.\insert-test-profiles-to-supabase.ps1` aus! 🚀
