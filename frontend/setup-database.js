// Script um die Datenbank für Dating zu setupen
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://njjcywgskzepikyzhihy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjYxNTYsImV4cCI6MjA3MTkwMjE1Nn0.5eyIEMHJr10PjNbNyDokqqcvycgEUIgyHkjB5puQOFs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setup Database für Dating...');
    
    // Teste die Verbindung
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('⚠️ Users Tabelle existiert nicht oder Fehler:', error.message);
    } else {
      console.log('✅ Verbindung zu Supabase erfolgreich');
    }
    
    // Versuche die matching_profiles Tabelle zu erstellen
    console.log('📝 Hinweis: Die matching_profiles Tabelle muss manuell in der Supabase Web-Oberfläche erstellt werden.');
    console.log('📝 SQL für die Tabelle:');
    console.log(`
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

-- Erlaube öffentlichen Zugriff (für Demo-Zwecke)
ALTER TABLE matching_profiles ENABLE ROW LEVEL SECURITY;

-- Erstelle Policy für öffentlichen Zugriff
CREATE POLICY "Enable read access for all users" ON matching_profiles
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON matching_profiles
  FOR INSERT WITH CHECK (true);
    `);
    
  } catch (err) {
    console.error('❌ Unerwarteter Fehler:', err);
  }
}

setupDatabase();
