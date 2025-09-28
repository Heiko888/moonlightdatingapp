# 🚀 Quick Setup - Supabase Login reparieren

## 📋 Was Sie jetzt tun müssen:

### 1. Supabase-Dashboard öffnen
- Gehen Sie zu [supabase.com](https://supabase.com)
- Öffnen Sie Ihr Projekt
- Klicken Sie auf **"SQL Editor"**

### 2. Users-Tabelle erstellen
Kopieren Sie diesen Code in den SQL-Editor und führen Sie ihn aus:

```sql
-- Users-Tabelle erstellen
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    subscription_plan VARCHAR(50) DEFAULT 'basic',
    subscription_status VARCHAR(50) DEFAULT 'active',
    subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- RLS (Row Level Security) aktivieren
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy für öffentlichen Zugriff
DROP POLICY IF EXISTS "Allow public access for auth" ON users;
CREATE POLICY "Allow public access for auth" ON users
    FOR ALL USING (true);
```

### 3. Admin-Benutzer erstellen
Kopieren Sie diesen Code in den SQL-Editor und führen Sie ihn aus:

```sql
-- Admin-Benutzer erstellen (Passwort: admin123)
INSERT INTO users (username, email, password_hash, first_name, last_name, subscription_plan, subscription_status)
VALUES (
    'admin',
    'admin@hd-app.com',
    '$2b$10$ndZmcAiaEYn.Skw2Eb.Loew68sj9Y8OoTuEbVxD6uuHWReJ77tWTu',
    'Admin',
    'User',
    'premium',
    'active'
) ON CONFLICT (email) DO NOTHING;
```

### 4. Login testen
Nach dem Ausführen der SQL-Codes können Sie sich anmelden mit:
- **Email:** `admin@hd-app.com`
- **Passwort:** `admin123`

## ✅ Fertig!
Das Login sollte jetzt funktionieren!
