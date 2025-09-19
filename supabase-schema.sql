-- Human Design App Database Schema für Supabase

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users Table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  birthdate DATE,
  birthplace VARCHAR(100),
  hd_type VARCHAR(50),
  profile VARCHAR(20),
  centers TEXT[],
  channels TEXT[],
  gates TEXT[],
  planets TEXT[],
  chart_data JSONB,
  avatar VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Charts Table
CREATE TABLE charts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME NOT NULL,
  birth_place VARCHAR(100) NOT NULL,
  chart_data JSONB NOT NULL,
  centers TEXT[],
  channels TEXT[],
  gates TEXT[],
  planets TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Readings Table
CREATE TABLE readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  chart_id UUID REFERENCES charts(id) ON DELETE CASCADE,
  scope VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  sources TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Items Table
CREATE TABLE knowledge_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('gate', 'channel', 'center', 'profile', 'type')),
  ref_key VARCHAR(50) NOT NULL,
  scope VARCHAR(50) NOT NULL,
  quality VARCHAR(20) DEFAULT 'draft' CHECK (quality IN ('verified', 'draft', 'needs_review')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chats Table
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  file_url VARCHAR(255),
  file_name VARCHAR(255),
  reactions TEXT[],
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins Table
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coaches Table
CREATE TABLE coaches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  bio TEXT,
  specialties TEXT[],
  hourly_rate DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chiron Healing Practices Table
CREATE TABLE chiron_healing_practices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  techniques JSONB,
  benefits JSONB,
  contraindications JSONB,
  duration_minutes INTEGER,
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  materials_needed JSONB,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chiron Transits Table
CREATE TABLE chiron_transits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transit_date DATE NOT NULL,
  transit_type VARCHAR(100) NOT NULL,
  affected_gate INTEGER,
  affected_center VARCHAR(50),
  description TEXT NOT NULL,
  healing_opportunity TEXT,
  challenges TEXT,
  recommendations TEXT,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  duration_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chiron Wounds Table
CREATE TABLE chiron_wounds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wound_type VARCHAR(100) NOT NULL,
  gate_number INTEGER,
  center_name VARCHAR(50),
  description TEXT NOT NULL,
  healing_stage VARCHAR(50) DEFAULT 'awareness',
  healing_practices JSONB,
  progress_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chiron Healing Sessions Table
CREATE TABLE chiron_healing_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  practice_id UUID REFERENCES chiron_healing_practices(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  duration_minutes INTEGER,
  notes TEXT,
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 10),
  emotional_state_before INTEGER CHECK (emotional_state_before >= 1 AND emotional_state_before <= 10),
  emotional_state_after INTEGER CHECK (emotional_state_after >= 1 AND emotional_state_after <= 10),
  insights TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chiron Gates Table - Alle 64 Gates mit Chiron-Informationen
CREATE TABLE chiron_gates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gate_number INTEGER UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  healing VARCHAR(255) NOT NULL,
  wound VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  deep_meaning TEXT NOT NULL,
  shadow_aspects JSONB,
  gifts JSONB,
  healing_affirmation TEXT NOT NULL,
  center_name VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chiron Centers Table - Alle 9 Centers mit Chiron-Informationen
CREATE TABLE chiron_centers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  center_name VARCHAR(50) UNIQUE NOT NULL,
  healing VARCHAR(255) NOT NULL,
  wound VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  deep_meaning TEXT NOT NULL,
  shadow_aspects JSONB,
  gifts JSONB,
  healing_affirmation TEXT NOT NULL,
  gates JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Planet Info Table - Grundinformationen aller Planeten
CREATE TABLE planet_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  planet_name VARCHAR(50) UNIQUE NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  orbital_period VARCHAR(50) NOT NULL,
  discovery VARCHAR(50) NOT NULL,
  mythology VARCHAR(255) NOT NULL,
  color VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Planet Gates Table - Alle 64 Gates für alle Planeten
CREATE TABLE planet_gates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  planet_name VARCHAR(50) NOT NULL,
  gate_number INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  essence VARCHAR(255) NOT NULL,
  consciousness VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  deep_meaning TEXT NOT NULL,
  shadow_aspects JSONB,
  gifts JSONB,
  affirmation TEXT NOT NULL,
  center_name VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(planet_name, gate_number)
);

-- Planet Centers Table - Alle 9 Centers für alle Planeten
CREATE TABLE planet_centers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  planet_name VARCHAR(50) NOT NULL,
  center_name VARCHAR(50) NOT NULL,
  essence VARCHAR(255) NOT NULL,
  consciousness VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  deep_meaning TEXT NOT NULL,
  shadow_aspects JSONB,
  gifts JSONB,
  affirmation TEXT NOT NULL,
  gates JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(planet_name, center_name)
);

-- Session Requests Table
CREATE TABLE session_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  coach_id UUID REFERENCES coaches(id),
  wunsch TEXT,
  handy VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Friend Requests Table
CREATE TABLE friend_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

-- Matches Table
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  compatibility_score DECIMAL(3,2),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Swipes Table
CREATE TABLE swipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('left', 'right')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_user_id)
);

-- Journal Entries Table
CREATE TABLE journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  mood VARCHAR(20),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moon Tracking Table
CREATE TABLE moon_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  moon_phase VARCHAR(50) NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 10),
  energy INTEGER CHECK (energy >= 1 AND energy <= 10),
  notes TEXT,
  rituals_completed TEXT[],
  journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes für bessere Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_charts_user_id ON charts(user_id);
CREATE INDEX idx_readings_user_id ON readings(user_id);
CREATE INDEX idx_readings_chart_id ON readings(chart_id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_knowledge_items_type ON knowledge_items(type);
CREATE INDEX idx_knowledge_items_scope ON knowledge_items(scope);
CREATE INDEX idx_knowledge_items_ref_key ON knowledge_items(ref_key);
CREATE INDEX idx_friend_requests_from_user ON friend_requests(from_user_id);
CREATE INDEX idx_friend_requests_to_user ON friend_requests(to_user_id);
CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);
CREATE INDEX idx_swipes_user_id ON swipes(user_id);
CREATE INDEX idx_swipes_target_user_id ON swipes(target_user_id);
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_moon_tracking_user_id ON moon_tracking(user_id);
CREATE INDEX idx_moon_tracking_date ON moon_tracking(date);
CREATE INDEX idx_moon_tracking_journal_entry_id ON moon_tracking(journal_entry_id);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE moon_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;

-- Users können nur ihre eigenen Daten sehen/bearbeiten
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Charts Policies
CREATE POLICY "Users can view own charts" ON charts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own charts" ON charts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own charts" ON charts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own charts" ON charts
  FOR DELETE USING (auth.uid() = user_id);

-- Readings Policies
CREATE POLICY "Users can view own readings" ON readings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own readings" ON readings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own readings" ON readings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own readings" ON readings
  FOR DELETE USING (auth.uid() = user_id);

-- Moon Tracking Policies
CREATE POLICY "Users can view own moon tracking" ON moon_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own moon tracking" ON moon_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own moon tracking" ON moon_tracking
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own moon tracking" ON moon_tracking
  FOR DELETE USING (auth.uid() = user_id);

-- Knowledge Items sind öffentlich lesbar
CREATE POLICY "Anyone can view knowledge items" ON knowledge_items
  FOR SELECT USING (true);

-- Nur Admins können Knowledge Items bearbeiten
CREATE POLICY "Admins can manage knowledge items" ON knowledge_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins WHERE admins.id = auth.uid()
    )
  );

-- Chat Policies
CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON chats
  FOR DELETE USING (auth.uid() = user_id);

-- Message Policies
CREATE POLICY "Users can view messages in their chats" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their chats" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid()
    )
  );

-- Journal Policies
CREATE POLICY "Users can view own journal entries" ON journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries" ON journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" ON journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" ON journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Functions für automatische Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers für automatische updated_at Updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_charts_updated_at BEFORE UPDATE ON charts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_readings_updated_at BEFORE UPDATE ON readings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_items_updated_at BEFORE UPDATE ON knowledge_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON coaches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_requests_updated_at BEFORE UPDATE ON session_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_friend_requests_updated_at BEFORE UPDATE ON friend_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample Data für Knowledge Items
INSERT INTO knowledge_items (title, content, type, ref_key, scope, quality) VALUES
('Manifestierender Generator', 'Du bist ein Manifestierender Generator! Du hast die Fähigkeit, Energie zu manifestieren und andere zu initiieren.', 'type', 'manifesting_generator', 'all', 'verified'),
('Tor 1 - Kreativität', 'Das Tor der Kreativität. Du hast die Gabe, neue Ideen zu erschaffen und Innovation zu bringen.', 'gate', '1', 'all', 'verified'),
('Kanal 1-8 - Inspiration', 'Der Kanal der Inspiration verbindet das G-Zentrum mit dem Sakralzentrum.', 'channel', '1-8', 'all', 'verified'),
('G-Zentrum', 'Das G-Zentrum ist das Zentrum der Identität und der Liebe.', 'center', 'g', 'all', 'verified');
