# 🤝 Friends/Matches System - Supabase Setup

## 📋 Übersicht

Das Friends/Matches-System ermöglicht es Benutzern, andere User als Freunde/Matches zu speichern und ihre Human Design Charts zu vergleichen.

---

## 🛠️ Setup-Anleitung

### **Schritt 1: Supabase-Tabellen erstellen**

1. Öffne dein Supabase-Dashboard: https://app.supabase.com
2. Gehe zu deinem Projekt
3. Klicke auf **SQL Editor** (linke Sidebar)
4. Erstelle eine neue Query
5. Kopiere den Inhalt von `supabase-friends-schema.sql`
6. Führe die Query aus (**Run** Button)

**Tabellen die erstellt werden:**
- ✅ `friends` - Speichert alle Friend-Profile
- ✅ `friendships` - Verknüpfungen zwischen Usern
- ✅ `friend_activities` - Gemeinsame Aktivitäten

---

### **Schritt 2: Überprüfe die Tabellen**

Gehe zu **Table Editor** und prüfe, ob folgende Tabellen existieren:
- `public.friends`
- `public.friendships`
- `public.friend_activities`

---

### **Schritt 3: Environment Variables prüfen**

Stelle sicher, dass folgende Variablen in `.env.local` gesetzt sind:

```bash
NEXT_PUBLIC_SUPABASE_URL=deine-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
SUPABASE_SERVICE_ROLE_KEY=dein-service-role-key
```

---

## 🎯 API-Endpoints

### **GET /api/friends**
Lädt alle Friends eines Users.

**Query Parameters:**
- `userId` (required) - UUID des Users

**Response:**
```json
{
  "success": true,
  "friends": [
    {
      "id": "uuid",
      "name": "Anna Schmidt",
      "hdType": "Generator",
      "hdProfile": "6/3",
      "hdAuthority": "Sakral",
      "hdStrategy": "Warten und Reagieren",
      "compatibility": 85,
      "...": "..."
    }
  ]
}
```

---

### **POST /api/friends**
Fügt einen neuen Friend hinzu.

**Body:**
```json
{
  "userId": "user-uuid",
  "friendData": {
    "name": "Anna Schmidt",
    "email": "anna@example.com",
    "hdType": "Generator",
    "hdProfile": "6/3",
    "hdAuthority": "Sakral",
    "hdStrategy": "Warten und Reagieren",
    "birthDate": "1995-03-15",
    "birthTime": "14:30",
    "birthPlace": "Berlin",
    "bio": "...",
    "interests": ["Yoga", "Meditation"],
    "compatibility": 85
  }
}
```

**Response:**
```json
{
  "success": true,
  "friend": {
    "id": "friend-uuid",
    "name": "Anna Schmidt",
    "hdType": "Generator",
    "friendshipId": "friendship-uuid"
  }
}
```

---

### **DELETE /api/friends**
Entfernt einen Friend.

**Query Parameters:**
- `friendshipId` (required) - UUID der Friendship

**Response:**
```json
{
  "success": true
}
```

---

## 🔧 Integration in Frontend

### **Friends laden:**

```typescript
const loadFriends = async () => {
  const userId = localStorage.getItem('userId');
  const response = await fetch(`/api/friends?userId=${userId}`);
  const data = await response.json();
  setFriends(data.friends);
};
```

### **Friend hinzufügen:**

```typescript
const addFriend = async (friendData) => {
  const userId = localStorage.getItem('userId');
  const response = await fetch('/api/friends', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, friendData })
  });
  const data = await response.json();
  return data.friend;
};
```

### **Friend entfernen:**

```typescript
const removeFriend = async (friendshipId) => {
  await fetch(`/api/friends?friendshipId=${friendshipId}`, {
    method: 'DELETE'
  });
};
```

---

## 🚀 Nächste Schritte

1. ✅ SQL-Schema in Supabase ausführen
2. ✅ API-Routes testen
3. ⏳ Friends-Seite anpassen (automatisch beim nächsten Schritt)
4. ⏳ Chartvergleich mit echten Daten testen

---

## 📊 Datenmodell

### **friends Table**
Speichert alle Friend-Profile mit ihren Human Design Daten.

**Wichtige Felder:**
- `user_id` - Besitzer des Friend-Profils
- `hd_type`, `hd_profile`, `hd_authority`, `hd_strategy` - HD-Daten
- `birth_date`, `birth_time`, `birth_place` - Geburtsdaten für Charts
- `is_online`, `last_seen`, `status` - Online-Status

### **friendships Table**
Verknüpft User mit ihren Friends.

**Wichtige Felder:**
- `user_id` - Der User
- `friend_id` - Der Friend (FK zu friends)
- `status` - 'pending', 'accepted', 'blocked'
- `compatibility` - Match-Score (0-100)
- `connection_type` - 'friend', 'match', 'favorite'

---

## 🔐 Security (RLS)

✅ Row Level Security ist aktiviert  
✅ User können nur ihre eigenen Friends sehen  
✅ User können nur ihre eigenen Friendships verwalten  
✅ Service Role Key wird für Server-Side Operations verwendet

---

## 💡 Tipps

- **Mock-Daten:** Die aktuellen Mock-Daten in `friends/page.tsx` können als Vorlage für echte Daten dienen
- **Migration:** Bestehende localStorage-Daten können mit einem Migrations-Script in Supabase übertragen werden
- **Offline-Support:** Kombiniere Supabase mit localStorage für Offline-Funktionalität

---

**Bereit zum Testen? Führe zuerst das SQL-Schema in Supabase aus!** 🚀

