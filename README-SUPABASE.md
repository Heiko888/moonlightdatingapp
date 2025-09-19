# Supabase Integration für HD App

Diese Dokumentation erklärt die Integration von Supabase als Datenbank-Alternative zu MongoDB für die Human Design App.

## 🚀 Vorteile von Supabase

### ✅ **Vorteile gegenüber MongoDB**

- **SQL-basiert**: Vertraute SQL-Syntax
- **Row Level Security**: Eingebaute Sicherheit
- **Real-time**: Live-Updates mit WebSockets
- **Auth**: Integrierte Authentifizierung
- **Storage**: Datei-Upload direkt integriert
- **Edge Functions**: Serverless Functions
- **Dashboard**: Web-basiertes Admin-Interface
- **Backups**: Automatische Backups
- **Skalierbar**: Cloud-native Architektur

### 🔧 **Features für HD App**

- **Benutzer-Management**: Registrierung, Login, Profile
- **Chart-Speicherung**: Human Design Charts als JSONB
- **Knowledge Base**: Strukturierte Wissensdatenbank
- **Chat-System**: Echtzeit-Messaging
- **Dating-Features**: Matching, Swipes, Friend Requests
- **Journal**: Persönliche Einträge
- **Coaching**: Session-Management

## 📋 Setup

### 1. Supabase Projekt erstellen

```bash
# Gehen Sie zu https://supabase.com
# Erstellen Sie ein neues Projekt
# Notieren Sie sich:
# - Project URL
# - Anon Key
# - Service Role Key
```

### 2. Umgebungsvariablen setzen

```bash
# .env Datei erstellen
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Datenbank-Schema importieren

```sql
-- Führen Sie supabase-schema.sql in der Supabase SQL Editor aus
-- Oder kopieren Sie den Inhalt in den SQL Editor
```

### 4. Dependencies installieren

```bash
cd backend
npm install @supabase/supabase-js --legacy-peer-deps
```

## 🗄️ Datenbank-Schema

### Haupttabellen

#### `users`

- Benutzer-Profile mit HD-Informationen
- UUID als Primary Key
- E-Mail und Username Unique

#### `charts`

- Human Design Charts
- JSONB für Chart-Daten
- Verknüpft mit User

#### `readings`

- Generierte HD-Readings
- Verschiedene Scopes (business, health, etc.)

#### `knowledge_items`

- Wissensdatenbank
- Verschiedene Typen (gate, channel, center, etc.)
- Qualitäts-Stufen (verified, draft, needs_review)

#### `chats` & `messages`

- Chat-System
- Echtzeit-Messaging

#### `matches` & `swipes`

- Dating-Features
- Matching-Algorithmus

## 🔐 Sicherheit

### Row Level Security (RLS)

- **Users**: Können nur eigene Daten sehen
- **Charts**: Nur eigene Charts zugänglich
- **Readings**: Nur eigene Readings
- **Knowledge**: Öffentlich lesbar, nur Admins können bearbeiten

### Policies

```sql
-- Beispiel: Users können nur eigene Charts sehen
CREATE POLICY "Users can view own charts" ON charts
  FOR SELECT USING (auth.uid() = user_id);
```

## 🛠️ Verwendung

### 1. Service verwenden

```typescript
import { SupabaseService } from '../services/supabaseService';

// Benutzer erstellen
const user = await SupabaseService.createUser({
  username: 'testuser',
  email: 'test@example.com',
  password_hash: 'hashed_password',
  hd_type: 'Manifestierender Generator'
});

// Chart erstellen
const chart = await SupabaseService.createChart({
  user_id: user.id,
  name: 'Mein Chart',
  birth_date: '1990-01-01',
  birth_time: '12:00:00',
  birth_place: 'Berlin',
  chart_data: { /* Chart-Daten */ }
});
```

### 2. Real-time Subscriptions

```typescript
import { supabase } from '../lib/supabase';

// Live-Updates für Messages
const subscription = supabase
  .channel('messages')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      console.log('Neue Nachricht:', payload.new);
    }
  )
  .subscribe();
```

### 3. Authentifizierung

```typescript
// Benutzer registrieren
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Benutzer einloggen
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

## 📊 Analytics & Monitoring

### Prometheus Integration

```typescript
// Supabase-Operationen tracken
import { trackDatabaseOperation } from '../middleware/monitoring';

// In SupabaseService
static async createUser(userData: Partial<HDUser>) {
  trackDatabaseOperation('insert', 'users');
  // ... Supabase Operation
}
```

### Metriken

- **Database Operations**: Insert, Select, Update, Delete
- **User Activity**: Registrierungen, Logins
- **Chart Generation**: Erstellte Charts
- **Readings**: Generierte Readings
- **Chat Activity**: Nachrichten, Chats

## 🔄 Migration von MongoDB

### 1. Daten exportieren

```javascript
// MongoDB Daten exportieren
const users = await User.find().lean();
const charts = await Chart.find().lean();
// ... weitere Collections
```

### 2. Daten transformieren

```typescript
// MongoDB zu Supabase Format
const supabaseUsers = users.map(user => ({
  id: user._id.toString(),
  username: user.username,
  email: user.email,
  // ... weitere Felder
}));
```

### 3. Daten importieren

```typescript
// Batch-Insert in Supabase
for (const user of supabaseUsers) {
  await SupabaseService.createUser(user);
}
```

## 🚀 Deployment

### 1. Supabase Production

```bash
# Projekt in Supabase Dashboard erstellen
# Production URL und Keys verwenden
# SSL und CDN aktivieren
```

### 2. Environment Variables

```bash
# Production .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
NODE_ENV=production
```

### 3. Monitoring

```bash
# Supabase Dashboard
# - Database Performance
# - API Usage
# - Storage Usage
# - Auth Logs
```

## 🔧 Troubleshooting

### Häufige Probleme

#### 1. RLS Policy Fehler

```sql
-- Policy prüfen
SELECT * FROM pg_policies WHERE tablename = 'users';
```

#### 2. Connection Issues

```typescript
// Supabase Client Status prüfen
const { data, error } = await supabase.from('users').select('count');
console.log('Connection status:', error ? 'Failed' : 'OK');
```

#### 3. Performance Issues

```sql
-- Indexes prüfen
SELECT * FROM pg_indexes WHERE tablename = 'users';
```

## 📚 Weitere Ressourcen

- [Supabase Dokumentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

## 🎯 Nächste Schritte

1. **Supabase Projekt erstellen**
2. **Schema importieren**
3. **Umgebungsvariablen setzen**
4. **Service testen**
5. **Prometheus-Metriken anpassen**
6. **Frontend integrieren**
7. **Real-time Features aktivieren**
