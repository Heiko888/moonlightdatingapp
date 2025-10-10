-- HD App - Komplettes Supabase Schema
-- Dieses Script erstellt alle notwendigen Tabellen und richtet Heiko als Admin ein

-- 1. Profiles Tabelle erstellen
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Subscriptions Tabelle erstellen
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. Community Posts Tabelle erstellen
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS (Row Level Security) aktivieren
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies erstellen
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view all community posts" ON community_posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create community posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Admin-User für Heiko erstellen
INSERT INTO profiles (user_id, email, first_name, last_name, is_admin)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'heiko.schwaninger@outlook.com'),
  'heiko.schwaninger@outlook.com',
  'Heiko',
  'Schwaninger',
  true
) ON CONFLICT (user_id) DO UPDATE SET
  is_admin = true,
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;

-- 7. Admin-Subscription für Heiko erstellen
INSERT INTO subscriptions (user_id, package_id, status, start_date, end_date)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'heiko.schwaninger@outlook.com'),
  'admin',
  'active',
  NOW(),
  NOW() + INTERVAL '1 year'
) ON CONFLICT (user_id) DO UPDATE SET
  package_id = 'admin',
  status = 'active',
  start_date = NOW(),
  end_date = NOW() + INTERVAL '1 year';

-- 8. Überprüfung: Admin-Status anzeigen
SELECT 
  p.user_id,
  p.email,
  p.first_name,
  p.last_name,
  p.is_admin,
  s.package_id,
  s.status
FROM profiles p
LEFT JOIN subscriptions s ON p.user_id = s.user_id
WHERE p.email = 'heiko.schwaninger@outlook.com';
