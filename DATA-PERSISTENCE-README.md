# 🗄️ Echte Daten-Persistierung - HD App

## 📋 Übersicht

Die HD App implementiert jetzt eine vollständige Datenpersistierung mit **echter Datenbank-Integration**. Alle Benutzerdaten werden dauerhaft in einer SQLite-Datenbank gespeichert und können optional mit Supabase synchronisiert werden.

## 🏗️ Architektur

### Backend (SQLite-Datenbank)

- **Lokale SQLite-Datenbank** für Entwicklung und Produktion
- **Vollständige Tabellen-Struktur** für alle App-Features
- **API-Endpoints** für CRUD-Operationen
- **Authentifizierung** und Benutzer-Management

### Frontend (Hybrid-Speicherung)

- **localStorage** für Offline-Nutzung
- **Automatische Synchronisation** mit Backend-Datenbank
- **Fallback-Mechanismen** bei Netzwerkproblemen
- **Echtzeit-Status** für Online/Offline-Modus

## 📊 Datenbank-Schema

### Haupttabellen

#### `users` - Benutzerprofile

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  birthdate TEXT,
  birthplace TEXT,
  hd_type TEXT,
  profile TEXT,
  centers TEXT,        -- JSON
  channels TEXT,       -- JSON
  gates TEXT,          -- JSON
  planets TEXT,        -- JSON
  chart_data TEXT,     -- JSON
  avatar TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### `charts` - Human Design Charts

```sql
CREATE TABLE charts (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  birth_time TEXT NOT NULL,
  birth_place TEXT NOT NULL,
  chart_data TEXT NOT NULL,  -- JSON
  centers TEXT,              -- JSON
  channels TEXT,             -- JSON
  gates TEXT,                -- JSON
  planets TEXT,              -- JSON
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### `journal_entries` - Journal-Einträge

```sql
CREATE TABLE journal_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  tags TEXT,                 -- JSON
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### `moon_tracking` - Mondkalender-Tracking

```sql
CREATE TABLE moon_tracking (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  moon_phase TEXT NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 10),
  energy INTEGER CHECK (energy >= 1 AND energy <= 10),
  notes TEXT,
  rituals_completed TEXT,    -- JSON
  journal_entry_id TEXT REFERENCES journal_entries(id) ON DELETE SET NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API-Endpoints

### Benutzerprofil

- `POST /data-persistence/user-profile` - Profil speichern/aktualisieren
- `GET /data-persistence/user-profile` - Profil abrufen

### Charts

- `POST /data-persistence/chart` - Chart speichern
- `GET /data-persistence/charts` - Alle Charts des Benutzers

### Journal

- `POST /data-persistence/journal` - Journal-Eintrag speichern
- `GET /data-persistence/journal` - Journal-Einträge abrufen

### Mondkalender

- `POST /data-persistence/moon-tracking` - Mondkalender-Eintrag speichern
- `GET /data-persistence/moon-tracking` - Mondkalender-Einträge abrufen

### Dashboard

- `GET /data-persistence/dashboard` - Zentrale Dashboard-Daten

## 💻 Frontend-Integration

### Datenpersistierung Service

```typescript
import { 
  dataPersistenceUtils, 
  userProfileService, 
  chartService, 
  moonTrackingService, 
  journalService, 
  dashboardService 
} from '../lib/dataPersistenceService';

// Vollständige Synchronisation
await dataPersistenceUtils.hybridSync();

// Einzelne Services
await userProfileService.saveProfile(profileData);
await chartService.saveChart(chartData);
await moonTrackingService.saveEntry(entryData);
await journalService.saveEntry(entryData);
```

### Hybrid-Modus

Die App funktioniert in einem **Hybrid-Modus**:

1. **Online + Authentifiziert**: Daten werden in der Datenbank gespeichert
2. **Offline**: Daten werden in localStorage gespeichert
3. **Automatische Synchronisation**: Bei Wiederherstellung der Verbindung

## 🚀 Verwendung

### 1. Backend starten

```bash
cd backend
npm run dev:supabase
```

### 2. Frontend starten

```bash
cd frontend
npm run dev
```

### 3. Demo-Seite aufrufen

```text
http://localhost:3000/data-persistence-demo
```

### 4. Chart mit Persistierung

```text
http://localhost:3000/chart/page-with-persistence
```

## 📱 Features

### ✅ Implementiert

- [x] **SQLite-Datenbank** mit vollständigem Schema
- [x] **API-Endpoints** für alle CRUD-Operationen
- [x] **Frontend-Service** für Datenpersistierung
- [x] **Hybrid-Speicherung** (localStorage + Datenbank)
- [x] **Automatische Synchronisation**
- [x] **Offline-Unterstützung**
- [x] **Demo-Seite** für Testing
- [x] **Chart-Integration** mit Persistierung
- [x] **Benutzerprofil-Persistierung**
- [x] **Journal-Persistierung**
- [x] **Mondkalender-Persistierung**
- [x] **Dashboard-Daten-Aggregation**

### 🔄 Synchronisation

- **Automatisch**: Bei App-Start und Datenänderungen
- **Manuell**: Über Sync-Button in der UI
- **Intelligent**: Nur geänderte Daten werden synchronisiert
- **Robust**: Fehlerbehandlung und Retry-Mechanismen

### 📊 Monitoring

- **Prometheus-Metriken** für alle Datenbank-Operationen
- **Sync-Status** in der UI
- **Online/Offline-Status** Anzeige
- **Fehler-Logging** und Benachrichtigungen

## 🔧 Konfiguration

### Umgebungsvariablen

```env
# Backend
PORT=4001
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4001
```

### Datenbank-Pfad

```typescript
// backend/src/lib/localDb.ts
const dbPath = path.join(__dirname, '../../data/hd-app.db');
```

## 🧪 Testing

### Demo-Daten erstellen

1. Öffne `/data-persistence-demo`
2. Klicke "Demo-Daten erstellen"
3. Überprüfe die Dashboard-Statistiken

### Synchronisation testen

1. Erstelle Daten im Offline-Modus
2. Verbinde mit dem Internet
3. Klicke "Vollständige Sync"
4. Überprüfe die Datenbank

## 📈 Performance

### Optimierungen

- **Batch-Operationen** für mehrere Einträge
- **Lazy Loading** für große Datensätze
- **Caching** in localStorage
- **Indexierung** in der Datenbank

### Metriken

- **Datenbank-Operationen** werden gemessen
- **Sync-Zeiten** werden getrackt
- **Fehler-Raten** werden überwacht

## 🔒 Sicherheit

### Authentifizierung

- **JWT-Token** für API-Zugriff
- **Benutzer-spezifische** Datenabfragen
- **Rate Limiting** für API-Endpoints

### Datenvalidierung

- **Input-Validierung** auf Backend und Frontend
- **SQL-Injection-Schutz** durch Prepared Statements
- **JSON-Schema-Validierung** für komplexe Daten

## 🚀 Nächste Schritte

### Geplante Features

- [ ] **Supabase-Integration** für Cloud-Synchronisation
- [ ] **Real-time Updates** mit WebSockets
- [ ] **Daten-Export/Import** Funktionen
- [ ] **Backup/Restore** Mechanismen
- [ ] **Multi-User-Support** mit Rollen
- [ ] **API-Dokumentation** mit Swagger

### Erweiterungen

- [ ] **Daten-Analytics** Dashboard
- [ ] **Automatische Backups**
- [ ] **Daten-Migration** Tools
- [ ] **Performance-Monitoring**

## 📞 Support

Bei Fragen oder Problemen:

1. Überprüfe die **Demo-Seite** für Funktionalität
2. Schaue in die **Browser-Konsole** für Fehler
3. Überprüfe die **Backend-Logs** für API-Probleme
4. Teste die **Synchronisation** manuell

---

**🎉 Die HD App hat jetzt echte Datenpersistierung!** Alle Benutzerdaten werden dauerhaft gespeichert und können nahtlos zwischen Geräten synchronisiert werden.
