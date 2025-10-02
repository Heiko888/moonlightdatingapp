-- Erstelle matching_profiles Tabelle in Supabase
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

-- Erstelle Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_matching_profiles_user_id ON matching_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_matching_profiles_active ON matching_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_matching_profiles_location ON matching_profiles(location);

-- Erlaube öffentlichen Zugriff (für Demo-Zwecke)
ALTER TABLE matching_profiles ENABLE ROW LEVEL SECURITY;

-- Erstelle Policy für öffentlichen Zugriff
CREATE POLICY "Enable read access for all users" ON matching_profiles
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON matching_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON matching_profiles
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON matching_profiles
  FOR DELETE USING (true);
