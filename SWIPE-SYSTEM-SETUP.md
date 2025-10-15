# 💕 Swipe-System Setup & Test-Anleitung

## 📋 Übersicht

Das Swipe-System ermöglicht es Usern, andere Profile zu liken und Matches zu erstellen basierend auf gegenseitigen Likes.

---

## 🚀 Setup

### **1. Test-User in Supabase anlegen**

**Option A: SQL-Script ausführen**
1. Öffne Supabase Dashboard: https://app.supabase.com
2. Gehe zu deinem Projekt
3. Navigiere zu **SQL Editor**
4. Öffne die Datei `supabase-test-users.sql`
5. Kopiere den gesamten Inhalt
6. Füge ihn in den SQL Editor ein
7. Klicke auf **"Run"**

**Ergebnis:**
- ✅ 8 Test-User werden angelegt
- ✅ Verschiedene HD-Typen (Generator, Projektor, Manifestor, Reflektor)
- ✅ Mit Bio, Interessen, Location, etc.

---

## 🎯 System-Architektur

### **Datenbank-Tabellen**

#### **1. `friends` Tabelle**
Speichert alle User-Profile:
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key zu auth.users)
- name (VARCHAR)
- email (VARCHAR)
- avatar (TEXT)
- location (VARCHAR)
- age (INTEGER)
- hd_type (VARCHAR) - Generator, Projektor, etc.
- hd_profile (VARCHAR) - z.B. "2/4"
- hd_authority (VARCHAR)
- hd_strategy (VARCHAR)
- bio (TEXT)
- interests (TEXT[]) - Array
- is_online (BOOLEAN)
- status (VARCHAR) - online, away, busy, offline
```

#### **2. `friendships` Tabelle**
Speichert Likes, Passes und Matches:
```sql
- id (UUID, Primary Key)
- user_id (UUID) - Der User der liked/passed
- friend_id (UUID, Foreign Key zu friends.id)
- status (VARCHAR):
  - 'pending' = Like, aber noch kein Match
  - 'accepted' = Match (beide haben geliked)
  - 'blocked' = Pass (User wird nicht mehr angezeigt)
- connection_type (VARCHAR):
  - 'like' = Einseitiges Like
  - 'match' = Gegenseitiges Like
  - 'pass' = Gepasst
- compatibility (INTEGER) - Score 0-100
```

---

## 🔄 Swipe-Flow

### **1. User Discovery**
```
GET /api/users/discover
↓
Lädt User aus friends-Tabelle
↓
Filtert aus:
- Eigener User
- Bereits gelikte User
- Bereits gepasste User
↓
Gibt Liste zurück mit:
- Name, Bio, HD-Info
- Kompatibilitäts-Score
- Interessen
```

### **2. Swipe-Aktion**
```
POST /api/users/swipe
Body: {
  targetUserId: "...",
  targetFriendId: "...",
  action: "like" | "pass"
}
↓
Bei "like":
  ├─ Erstelle friendship mit status='pending'
  ├─ Prüfe ob anderer User uns auch liked
  └─ Falls JA:
      ├─ Update beide friendships zu status='accepted'
      ├─ Update connection_type zu 'match'
      └─ Return: { isMatch: true }
↓
Bei "pass":
  └─ Erstelle friendship mit status='blocked'
```

### **3. Match-Detection**
```
User A liked User B
↓
System prüft:
  Hat User B auch User A geliked?
↓
Falls JA:
  ├─ Beide friendships → status='accepted'
  ├─ Beide friendships → connection_type='match'
  ├─ Match-Animation auf Frontend
  └─ Match erscheint in Match-Liste
```

---

## 💻 Frontend-Integration

### **Swipe-Seite** (`/swipe`)

**Features:**
- ✅ Lädt echte User aus Supabase
- ✅ Zeigt HD-Typ, Profil, Autorität, Strategie
- ✅ Kompatibilitäts-Score
- ✅ Interessen-Tags
- ✅ Like/Pass Buttons (oder Swipe-Gesten)
- ✅ Match-Animation bei gegenseitigem Like
- ✅ Fallback zu Mock-Daten falls keine User

**User Interface:**
```
┌─────────────────────────────┐
│   [Profil-Bild]             │
│                             │
│   Luna Schmidt, 28          │
│   📍 Berlin                 │
│                             │
│   Generator 2/4             │
│   Emotional • Wait to Resp  │
│                             │
│   Bio: "Generator mit..."   │
│                             │
│   Interessen:               │
│   [Yoga] [Astrologie]...    │
│                             │
│   Kompatibilität: 85%       │
│                             │
│  [❌ Pass]      [❤️ Like]   │
└─────────────────────────────┘
```

---

## 🧪 Testing

### **1. Test-Szenario: Like ohne Match**
```
1. Gehe zu http://localhost:3005/swipe
2. Like einen User (❤️)
3. Prüfe in Supabase friendships-Tabelle:
   → status: 'pending'
   → connection_type: 'like'
```

### **2. Test-Szenario: Gegenseitiges Match**
```
1. User A liked User B
2. Logge dich als User B ein (oder simuliere in DB)
3. User B liked User A
4. Ergebnis:
   ✅ Match-Animation erscheint
   ✅ Beide friendships status='accepted'
   ✅ Match in Match-Liste sichtbar
```

### **3. Test-Szenario: Pass**
```
1. Gehe zu http://localhost:3005/swipe
2. Passe einen User (❌)
3. Lade Seite neu
4. Ergebnis:
   ✅ User erscheint nicht mehr
   ✅ friendships-Eintrag mit status='blocked'
```

---

## 📊 SQL-Queries für Testing

### **Zeige alle Likes eines Users**
```sql
SELECT 
  f.name,
  fs.status,
  fs.connection_type,
  fs.compatibility
FROM friendships fs
JOIN friends f ON f.id = fs.friend_id
WHERE fs.user_id = 'YOUR_USER_ID'
  AND fs.connection_type IN ('like', 'match');
```

### **Zeige alle Matches**
```sql
SELECT 
  f.name,
  fs.compatibility,
  fs.created_at
FROM friendships fs
JOIN friends f ON f.id = fs.friend_id
WHERE fs.user_id = 'YOUR_USER_ID'
  AND fs.status = 'accepted'
  AND fs.connection_type = 'match';
```

### **Lösche alle Test-Friendships**
```sql
DELETE FROM friendships 
WHERE user_id = 'YOUR_USER_ID';
```

---

## 🎨 Kompatibilitäts-Berechnung

Aktuell wird ein **zufälliger Score (60-100)** generiert.

**TODO: Echte HD-Kompatibilitäts-Logik**

Beispiel-Faktoren:
- **HD-Typ Kompatibilität:**
  - Generator + Projektor = 90%
  - Generator + Generator = 75%
  - Manifestor + Reflektor = 85%
  
- **Autoritäts-Match:**
  - Emotional + Emotional = +10%
  - Sakral + Splenic = +5%
  
- **Gemeinsame Interessen:**
  - +5% pro gemeinsames Interest

---

## 🔧 Troubleshooting

### **Problem: Keine User werden angezeigt**
**Lösung:**
1. Prüfe ob Test-User in `friends` Tabelle existieren:
   ```sql
   SELECT COUNT(*) FROM friends;
   ```
2. Falls 0: Führe `supabase-test-users.sql` aus

### **Problem: API Error "supabaseKey is required"**
**Lösung:**
1. Prüfe ob `utils/supabase/server.ts` existiert
2. Prüfe `next.config.js` für Supabase-Keys
3. Starte Server neu

### **Problem: Matches werden nicht erkannt**
**Lösung:**
1. Prüfe `friendships` Tabelle:
   ```sql
   SELECT * FROM friendships 
   WHERE friend_id = 'TARGET_FRIEND_ID';
   ```
2. Beide User müssen jeweils einen friendship-Eintrag haben

---

## 📱 Nächste Schritte

### **Kurzfristig**
- [ ] Match-Liste Seite (`/matches`)
- [ ] Chat-Funktion für Matches
- [ ] Push-Notifications bei neuen Matches

### **Mittelfristig**
- [ ] Echte HD-Kompatibilitäts-Berechnung
- [ ] Filter (Alter, Location, HD-Typ)
- [ ] "Super Like" Feature (VIP)
- [ ] Undo-Funktion (letzte Swipes rückgängig)

### **Langfristig**
- [ ] AI-basierte Match-Vorschläge
- [ ] Video-Profile
- [ ] Verified Badges
- [ ] Ice-Breaker Fragen

---

## 🎉 Fertig!

Das Swipe-System ist jetzt voll funktionsfähig und bereit zum Testen!

**Happy Swiping! 💕**

