# 🚀 HD App - Supabase Setup Guide

## 📋 Übersicht

Dieser Guide führt Sie durch die Migration der HD App von Node.js/Express zu Supabase für Shared Hosting.

## ✅ Was wurde vorbereitet

### 1. Database Schema

- **Datei**: `supabase-migration/schema.sql`
- **Inhalt**: PostgreSQL-Schema mit allen Tabellen, Indizes und RLS-Policies
- **Features**: UUID-Primary Keys, JSONB für komplexe Daten, Row Level Security

### 2. Edge Functions

- **auth-login**: Benutzeranmeldung
- **auth-register**: Benutzerregistrierung  
- **user-profile**: Profil-Management (GET/PUT)
- **moon-calendar**: Mondkalender-API mit Fallback-Daten

### 3. Frontend Integration

- **supabase.ts**: Supabase Client Setup
- **api.ts**: API-Wrapper für alle Endpunkte
- **env.example**: Umgebungsvariablen-Template

## 🚀 Setup-Schritte

### Schritt 1: Supabase-Projekt erstellen

1. Gehen Sie zu [supabase.com](https://supabase.com)
2. Erstellen Sie ein neues Projekt
3. Notieren Sie sich:
   - Project URL
   - Anon Key
   - Project Reference

### Schritt 2: Supabase CLI installieren

```bash
npm install -g supabase
supabase login
```

### Schritt 3: Projekt initialisieren

```bash
cd supabase-migration
supabase init
supabase link --project-ref YOUR_PROJECT_REF
```

### Schritt 4: Database Schema anwenden

```bash
# Schema in Supabase Dashboard SQL Editor einfügen
# Oder über CLI:
supabase db reset
```

### Schritt 5: Edge Functions deployen

```bash
# Alle Functions deployen
supabase functions deploy auth-login
supabase functions deploy auth-register
supabase functions deploy user-profile
supabase functions deploy moon-calendar

# Oder das Deploy-Script verwenden:
chmod +x deploy.sh
./deploy.sh
```

### Schritt 6: Frontend konfigurieren

1. Kopieren Sie `frontend/env.example` zu `frontend/.env.local`
2. Füllen Sie die Supabase-Credentials ein:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_BASE_URL=https://your-project.supabase.co/functions/v1
```

### Schritt 7: Frontend anpassen

Die API-Aufrufe müssen von `localhost:4001` auf Supabase umgestellt werden:

```typescript
// Vorher:
const response = await fetch('http://localhost:4001/auth/login', {...})

// Nachher:
import { authAPI } from '@/lib/api'
const response = await authAPI.login(email, password)
```

## 📊 Database Schema

### Tabellen

- **users**: Benutzerprofile mit HD-Daten
- **charts**: Human Design Charts
- **knowledge_items**: Wissensdatenbank
- **coaching_sessions**: Coaching-Buchungen
- **matching_profiles**: Dating-Profile
- **swipe_actions**: Swipe-Aktionen
- **matches**: Matches zwischen Benutzern
- **messages**: Chat-Nachrichten

### Sicherheit

- **Row Level Security (RLS)** aktiviert
- **Policies** für Datenzugriff
- **UUID** als Primary Keys
- **JSONB** für komplexe Datenstrukturen

## 🔧 API-Endpunkte

### Authentication

- `POST /functions/v1/auth-login` - Anmeldung
- `POST /functions/v1/auth-register` - Registrierung

### User Management

- `GET /functions/v1/user-profile/{id}` - Profil abrufen
- `PUT /functions/v1/user-profile/{id}` - Profil aktualisieren

### Moon Calendar

- `GET /functions/v1/moon-calendar` - Kalender-Daten
- `GET /functions/v1/moon-calendar/current` - Aktuelle Mondphase
- `GET /functions/v1/moon-calendar/phases` - Alle Phasen

## 🚀 Deployment auf All-Inkl

### 1. Static Export (bereits fertig)

```bash
cd frontend
npm run build
# Dateien in 'out/' Ordner sind bereit
```

### 2. Upload auf All-Inkl

1. Alle Dateien aus `frontend/out/` auf den Webserver hochladen
2. `.env.local` mit Supabase-Credentials erstellen
3. Domain konfigurieren

### 3. Testen

- Frontend: `https://ihre-domain.de`
- API: `https://ihre-domain.de/functions/v1/`

## 🔍 Troubleshooting

### Häufige Probleme

1. **CORS-Fehler**
   - CORS-Headers sind in allen Edge Functions konfiguriert

2. **Authentication-Fehler**
   - Supabase Auth ist korrekt konfiguriert
   - RLS-Policies sind aktiv

3. **API-Fehler**
   - Edge Functions sind deployed
   - Umgebungsvariablen sind gesetzt

### Debugging

```bash
# Supabase Logs anzeigen
supabase functions logs auth-login

# Database Status prüfen
supabase status
```

## 📈 Nächste Schritte

1. **Erweiterte Functions**: Matching, Coaching, Knowledge
2. **Real-time Features**: WebSocket-Integration
3. **File Upload**: Supabase Storage
4. **Email Service**: Supabase Edge Functions
5. **Monitoring**: Supabase Analytics

## 🎯 Vorteile der Migration

- ✅ **Shared Hosting kompatibel**
- ✅ **Skalierbare Architektur**
- ✅ **Automatische Backups**
- ✅ **Real-time Features**
- ✅ **Sichere Authentication**
- ✅ **Kostenoptimiert**

Die HD App ist jetzt bereit für professionelles Shared Hosting! 🚀
