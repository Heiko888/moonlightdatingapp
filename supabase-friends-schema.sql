-- Friends/Matches Schema für Supabase

-- 1. Friends Table (Speichert alle User-Profile)
CREATE TABLE IF NOT EXISTS public.friends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  avatar TEXT,
  location VARCHAR(255),
  age INTEGER,
  hd_type VARCHAR(50),
  hd_profile VARCHAR(20),
  hd_authority VARCHAR(100),
  hd_strategy VARCHAR(100),
  bio TEXT,
  interests TEXT[], -- Array of interests
  birth_date DATE,
  birth_time TIME,
  birth_place VARCHAR(255),
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'offline', -- 'online', 'away', 'busy', 'offline'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Friendships Table (Speichert Verbindungen zwischen Usern)
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES public.friends(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
  compatibility INTEGER DEFAULT 0, -- 0-100
  mutual_friends INTEGER DEFAULT 0,
  connection_type VARCHAR(50) DEFAULT 'friend', -- 'friend', 'match', 'favorite'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- 3. Friend Activities Table (Gemeinsame Aktivitäten)
CREATE TABLE IF NOT EXISTS public.friend_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  friendship_id UUID NOT NULL REFERENCES public.friendships(id) ON DELETE CASCADE,
  activity_name VARCHAR(255) NOT NULL,
  activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes für Performance
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON public.friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_hd_type ON public.friends(hd_type);
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON public.friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON public.friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON public.friendships(status);
CREATE INDEX IF NOT EXISTS idx_friend_activities_friendship_id ON public.friend_activities(friendship_id);

-- Row Level Security (RLS)
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies für friends
CREATE POLICY "Users can view all friends"
  ON public.friends FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own friends"
  ON public.friends FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own friends"
  ON public.friends FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own friends"
  ON public.friends FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies für friendships
CREATE POLICY "Users can view their own friendships"
  ON public.friendships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own friendships"
  ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own friendships"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own friendships"
  ON public.friendships FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies für friend_activities
CREATE POLICY "Users can view activities of their friendships"
  ON public.friend_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.friendships
      WHERE friendships.id = friend_activities.friendship_id
      AND friendships.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create activities for their friendships"
  ON public.friend_activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.friendships
      WHERE friendships.id = friendship_id
      AND friendships.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_friends_updated_at
  BEFORE UPDATE ON public.friends
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON public.friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

