-- Fehlende Supabase-Tabellen für Dashboard und Analytics
-- Diese Tabellen werden in den API-Routen verwendet, aber noch nicht erstellt

-- User Sessions Table - Für Analytics
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Moon Tracking Table - Für Dashboard
CREATE TABLE IF NOT EXISTS moon_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  moon_phase VARCHAR(50) NOT NULL,
  mood VARCHAR(50),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Readings Table - Für Dashboard
CREATE TABLE IF NOT EXISTS readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly', 'custom'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  reading_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches Table - Für Dashboard (Dating)
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  matched_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  compatibility_score INTEGER CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  match_type VARCHAR(50) DEFAULT 'dating', -- 'dating', 'friendship', 'coaching'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'blocked'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, matched_user_id)
);

-- User Subscriptions Table - Für Payment
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package VARCHAR(50) NOT NULL, -- 'free', 'basic', 'premium', 'vip'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moon Calendar Entries Table - Für Analytics
CREATE TABLE IF NOT EXISTS moon_calendar_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  moon_phase VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  mood VARCHAR(50),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dating Matches Table - Für Analytics
CREATE TABLE IF NOT EXISTS dating_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  matched_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  compatibility_score INTEGER CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Posts Table - Für Analytics
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coaching Sessions Table - Für Analytics
CREATE TABLE IF NOT EXISTS coaching_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_type VARCHAR(50) NOT NULL, -- 'individual', 'group', 'workshop'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) aktivieren
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE moon_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE moon_calendar_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE dating_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies erstellen
-- User Sessions - Nur eigene Sessions
CREATE POLICY "Users can view own sessions" ON user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON user_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Moon Tracking - Nur eigene Einträge
CREATE POLICY "Users can manage own moon tracking" ON moon_tracking FOR ALL USING (auth.uid() = user_id);

-- Readings - Nur eigene Readings
CREATE POLICY "Users can manage own readings" ON readings FOR ALL USING (auth.uid() = user_id);

-- Matches - Nur eigene Matches
CREATE POLICY "Users can view own matches" ON matches FOR SELECT USING (auth.uid() = user_id OR auth.uid() = matched_user_id);
CREATE POLICY "Users can insert own matches" ON matches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own matches" ON matches FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

-- User Subscriptions - Nur eigene Abonnements
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON user_subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Moon Calendar Entries - Nur eigene Einträge
CREATE POLICY "Users can manage own moon calendar entries" ON moon_calendar_entries FOR ALL USING (auth.uid() = user_id);

-- Dating Matches - Nur eigene Matches
CREATE POLICY "Users can view own dating matches" ON dating_matches FOR SELECT USING (auth.uid() = user_id OR auth.uid() = matched_user_id);
CREATE POLICY "Users can insert own dating matches" ON dating_matches FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Community Posts - Öffentlich lesbar, nur eigene bearbeitbar
CREATE POLICY "Anyone can view community posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Users can insert own community posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own community posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own community posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- Coaching Sessions - Nur eigene Sessions
CREATE POLICY "Users can manage own coaching sessions" ON coaching_sessions FOR ALL USING (auth.uid() = user_id OR auth.uid() = coach_id);

-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_moon_tracking_user_id ON moon_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_moon_tracking_created_at ON moon_tracking(created_at);
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_type ON readings(type);
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_matched_user_id ON matches(matched_user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_moon_calendar_entries_user_id ON moon_calendar_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_moon_calendar_entries_date ON moon_calendar_entries(date);
CREATE INDEX IF NOT EXISTS idx_dating_matches_user_id ON dating_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_coach_id ON coaching_sessions(coach_id);
