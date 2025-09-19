-- HD App Supabase Migration Schema
-- Converted from SQLite to PostgreSQL

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  birthdate TEXT,
  birthplace TEXT,
  location TEXT,
  bio TEXT,
  age INTEGER,
  hd_type TEXT,
  profile TEXT,
  authority TEXT,
  strategy TEXT,
  centers JSONB,
  channels JSONB,
  gates JSONB,
  planets JSONB,
  chart_data JSONB,
  images JSONB,
  interests JSONB,
  avatar TEXT,
  is_active BOOLEAN DEFAULT true,
  last_active TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Charts Table
CREATE TABLE IF NOT EXISTS charts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  birth_time TEXT NOT NULL,
  birth_place TEXT NOT NULL,
  chart_data JSONB NOT NULL,
  centers JSONB,
  channels JSONB,
  gates JSONB,
  planets JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Items Table
CREATE TABLE IF NOT EXISTS knowledge_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gate', 'channel', 'center', 'profile', 'type')),
  ref_key TEXT NOT NULL,
  scope TEXT NOT NULL,
  quality TEXT DEFAULT 'draft' CHECK (quality IN ('verified', 'draft', 'needs_review')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chiron Healing Practices Table
CREATE TABLE IF NOT EXISTS chiron_healing_practices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
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
CREATE TABLE IF NOT EXISTS chiron_transits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transit_date TEXT NOT NULL,
  transit_type TEXT NOT NULL,
  affected_gate INTEGER,
  affected_center TEXT,
  description TEXT NOT NULL,
  healing_opportunity TEXT,
  challenges TEXT,
  recommendations TEXT,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  duration_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chiron Wounds Table
CREATE TABLE IF NOT EXISTS chiron_wounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wound_type TEXT NOT NULL,
  gate_number INTEGER,
  center_name TEXT,
  description TEXT NOT NULL,
  healing_stage TEXT DEFAULT 'awareness',
  healing_practices JSONB,
  progress_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chiron Healing Sessions Table
CREATE TABLE IF NOT EXISTS chiron_healing_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  practice_id UUID REFERENCES chiron_healing_practices(id) ON DELETE CASCADE,
  session_date TEXT NOT NULL,
  duration_minutes INTEGER,
  notes TEXT,
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 10),
  emotional_state_before INTEGER CHECK (emotional_state_before >= 1 AND emotional_state_before <= 10),
  emotional_state_after INTEGER CHECK (emotional_state_after >= 1 AND emotional_state_after <= 10),
  insights TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coaching Sessions Table
CREATE TABLE IF NOT EXISTS coaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  coach_name TEXT NOT NULL,
  session_type TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matching Profiles Table
CREATE TABLE IF NOT EXISTS matching_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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

-- Swipe Actions Table
CREATE TABLE IF NOT EXISTS swipe_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like', 'pass', 'super_like')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  compatibility_score INTEGER,
  compatibility_analysis JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'unmatched')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_charts_user_id ON charts(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_type ON knowledge_items(type);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_ref_key ON knowledge_items(ref_key);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_matching_profiles_user_id ON matching_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_swipe_actions_user_id ON swipe_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_swipe_actions_target_user_id ON swipe_actions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_charts_updated_at BEFORE UPDATE ON charts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_items_updated_at BEFORE UPDATE ON knowledge_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaching_sessions_updated_at BEFORE UPDATE ON coaching_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matching_profiles_updated_at BEFORE UPDATE ON matching_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Charts are private to users
CREATE POLICY "Users can view own charts" ON charts FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create own charts" ON charts FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own charts" ON charts FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own charts" ON charts FOR DELETE USING (auth.uid()::text = user_id::text);

-- Knowledge items are public for reading
CREATE POLICY "Knowledge items are viewable by everyone" ON knowledge_items FOR SELECT USING (true);

-- Coaching sessions are private to users
CREATE POLICY "Users can view own coaching sessions" ON coaching_sessions FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create own coaching sessions" ON coaching_sessions FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Matching profiles are viewable by authenticated users
CREATE POLICY "Authenticated users can view matching profiles" ON matching_profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage own matching profile" ON matching_profiles FOR ALL USING (auth.uid()::text = user_id::text);

-- Swipe actions are private to users
CREATE POLICY "Users can view own swipe actions" ON swipe_actions FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create own swipe actions" ON swipe_actions FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Matches are viewable by participants
CREATE POLICY "Users can view own matches" ON matches FOR SELECT USING (auth.uid()::text = user1_id::text OR auth.uid()::text = user2_id::text);

-- Messages are viewable by match participants
CREATE POLICY "Users can view messages in their matches" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM matches 
    WHERE matches.id = messages.match_id 
    AND (matches.user1_id::text = auth.uid()::text OR matches.user2_id::text = auth.uid()::text)
  )
);
CREATE POLICY "Users can send messages in their matches" ON messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM matches 
    WHERE matches.id = messages.match_id 
    AND (matches.user1_id::text = auth.uid()::text OR matches.user2_id::text = auth.uid()::text)
  )
);
