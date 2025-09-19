# 🚀 MOONLIGHT App - Supabase Setup für All-Inkl Hosting

## 📋 Warum Supabase für All-Inkl?

### ✅ **Vorteile für All-Inkl Hosting:**
- **Keine lokale Datenbank** erforderlich
- **Cloud-basierte Lösung** - keine Server-Wartung
- **Automatische Backups** und Skalierung
- **Einfache Deployment** auf statischen Hosting
- **Real-time Features** ohne WebSocket-Setup
- **Row Level Security** für Datenschutz

## 🛠️ Setup-Schritte

### 1. **Supabase-Projekt erstellen**

1. Gehen Sie zu [supabase.com](https://supabase.com)
2. Erstellen Sie ein neues Projekt
3. Notieren Sie sich:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Project Reference**: `abcdefghijklmnop`

### 2. **Umgebungsvariablen setzen**

Erstellen Sie `frontend/.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_BASE_URL=https://your-project.supabase.co/functions/v1

# Optional: External APIs
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-key
NEXT_PUBLIC_EMAIL_SERVICE_URL=your-email-service-url
```

### 3. **Datenbank-Schema importieren**

Kopieren Sie den Inhalt von `supabase-migration/schema.sql` in den Supabase SQL Editor:

```sql
-- Führen Sie das komplette Schema aus
-- Alle Tabellen werden automatisch erstellt
```

### 4. **Edge Functions deployen**

```bash
# Supabase CLI installieren
npm install -g supabase

# Login
supabase login

# Projekt verknüpfen
supabase link --project-ref YOUR_PROJECT_REF

# Functions deployen
supabase functions deploy auth-login
supabase functions deploy auth-register
supabase functions deploy user-profile
supabase functions deploy moon-calendar
```

### 5. **Frontend für All-Inkl vorbereiten**

```bash
# Build für statisches Hosting
cd frontend
npm run build
npm run export

# Upload der 'out' Ordner zu All-Inkl
```

## 🗄️ Datenbank-Schema

### **Haupttabellen:**
- `users` - Benutzerprofile
- `charts` - Human Design Charts
- `knowledge_items` - Wissensdatenbank
- `coaching_sessions` - Coaching-Termine
- `matching_profiles` - Dating-Profile
- `swipe_actions` - Dating-Swipes
- `matches` - Dating-Matches
- `journal_entries` - Journal-Einträge

### **Features:**
- **UUID Primary Keys** für bessere Performance
- **JSONB** für komplexe Daten (Charts, Profile)
- **Row Level Security** für Datenschutz
- **Automatische Timestamps**
- **Foreign Key Constraints**

## 🔧 All-Inkl Deployment

### **1. Statisches Build erstellen:**
```bash
cd frontend
npm run build
npm run export
```

### **2. Upload zu All-Inkl:**
- Upload des `out` Ordners
- Keine Server-Konfiguration erforderlich
- Alle API-Calls gehen an Supabase

### **3. Domain konfigurieren:**
- CNAME auf All-Inkl Server
- SSL automatisch verfügbar

## 📊 Monitoring & Analytics

### **Supabase Dashboard:**
- **Database**: Tabellen, Queries, Performance
- **Auth**: Benutzer, Sessions, Security
- **Functions**: Edge Function Logs
- **Storage**: Datei-Uploads
- **API**: Request Logs

### **All-Inkl Features:**
- **Statische Dateien** (HTML, CSS, JS)
- **SSL-Zertifikat** automatisch
- **CDN** für bessere Performance
- **Backup** der statischen Dateien

## 🚀 Vorteile der Kombination

### **All-Inkl + Supabase:**
- ✅ **Günstiges Hosting** (statische Dateien)
- ✅ **Professionelle Datenbank** (Supabase)
- ✅ **Keine Server-Wartung** erforderlich
- ✅ **Automatische Skalierung**
- ✅ **Real-time Features**
- ✅ **Einfache Deployment**

## 🔄 Migration von SQLite

### **Daten exportieren:**
```bash
# SQLite Daten exportieren
sqlite3 backend/data/hd-app.db .dump > data-export.sql
```

### **Daten importieren:**
```sql
-- In Supabase SQL Editor
-- Daten aus SQLite-Export anpassen und importieren
```

## 📞 Support

Bei Fragen zur Supabase-Integration:
- **Supabase Docs**: https://supabase.com/docs
- **All-Inkl Support**: https://all-inkl.com/support
- **MOONLIGHT App**: Lokale Dokumentation

---

**🎯 Ziel: Vollständig cloud-basierte Lösung ohne lokale Server-Abhängigkeiten!**
