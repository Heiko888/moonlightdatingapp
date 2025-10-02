// Script um matching_profiles Tabelle in Supabase zu erstellen
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://njjcywgskzepikyzhihy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjYxNTYsImV4cCI6MjA3MTkwMjE1Nn0.5eyIEMHJr10PjNbNyDokqqcvycgEUIgyHkjB5puQOFs';

const supabase = createClient(supabaseUrl, supabaseKey);

const createTableSQL = `
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
`;

async function createTable() {
  try {
    console.log('🚀 Erstelle matching_profiles Tabelle in Supabase...');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) {
      console.error('❌ Fehler beim Erstellen der Tabelle:', error);
    } else {
      console.log('✅ Tabelle erfolgreich erstellt!');
    }
  } catch (err) {
    console.error('❌ Unerwarteter Fehler:', err);
  }
}

createTable();
