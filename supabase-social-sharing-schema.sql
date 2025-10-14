-- =====================================================
-- SOCIAL SHARING & REFERRAL SYSTEM SCHEMA
-- =====================================================

-- ============================================
-- 1. SHARED CHARTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.shared_charts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  share_id VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'chart', 'transit', 'profile', etc.
  data JSONB NOT NULL,
  is_anonymous BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for shared_charts
CREATE INDEX IF NOT EXISTS idx_shared_charts_share_id ON public.shared_charts(share_id);
CREATE INDEX IF NOT EXISTS idx_shared_charts_user_id ON public.shared_charts(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_charts_created_at ON public.shared_charts(created_at);

-- ============================================
-- 2. REFERRAL CODES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(20) UNIQUE NOT NULL,
  uses INTEGER DEFAULT 0,
  max_uses INTEGER, -- NULL = unlimited
  reward INTEGER DEFAULT 10, -- Credits or percentage
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Indexes for referral_codes
CREATE UNIQUE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON public.referral_codes(user_id);

-- ============================================
-- 3. REFERRAL USES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.referral_uses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code_id UUID NOT NULL REFERENCES public.referral_codes(id) ON DELETE CASCADE,
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'expired'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(referral_code_id, referred_user_id) -- Prevent duplicate uses
);

-- Indexes for referral_uses
CREATE INDEX IF NOT EXISTS idx_referral_uses_referrer ON public.referral_uses(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_uses_referred ON public.referral_uses(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_uses_status ON public.referral_uses(status);

-- ============================================
-- 4. CREDIT TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'referral_reward', 'welcome_bonus', 'purchase', 'spent', etc.
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for credit_transactions
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON public.credit_transactions(type);

-- ============================================
-- 5. USER ACTIONS TABLE (for analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL, -- 'share_created', 'share_viewed', 'referral_sent', etc.
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user_actions
CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON public.user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_action ON public.user_actions(action);
CREATE INDEX IF NOT EXISTS idx_user_actions_created_at ON public.user_actions(created_at);

-- ============================================
-- 6. ADD CREDITS COLUMN TO PROFILES
-- ============================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE public.shared_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_uses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

-- Shared Charts Policies
CREATE POLICY "Users can view all shared charts"
  ON public.shared_charts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own shared charts"
  ON public.shared_charts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shared charts"
  ON public.shared_charts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shared charts"
  ON public.shared_charts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Referral Codes Policies
CREATE POLICY "Users can view all referral codes"
  ON public.referral_codes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own referral codes"
  ON public.referral_codes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own referral codes"
  ON public.referral_codes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Referral Uses Policies
CREATE POLICY "Users can view referrals they're involved in"
  ON public.referral_uses FOR SELECT
  TO authenticated
  USING (
    auth.uid() = referrer_user_id OR 
    auth.uid() = referred_user_id
  );

CREATE POLICY "System can create referral uses"
  ON public.referral_uses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update referral uses"
  ON public.referral_uses FOR UPDATE
  TO authenticated
  USING (true);

-- Credit Transactions Policies
CREATE POLICY "Users can view their own transactions"
  ON public.credit_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create transactions"
  ON public.credit_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- User Actions Policies
CREATE POLICY "Users can view their own actions"
  ON public.user_actions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own actions"
  ON public.user_actions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 8. FUNCTIONS
-- ============================================

-- Function to clean up expired shared charts
CREATE OR REPLACE FUNCTION cleanup_expired_shares()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.shared_charts
  WHERE expires_at < NOW();
END;
$$;

-- Function to get referral leaderboard
CREATE OR REPLACE FUNCTION get_referral_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  referral_count BIGINT,
  total_rewards INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ru.referrer_user_id,
    p.name,
    COUNT(*)::BIGINT as referral_count,
    (COUNT(*) * 10)::INTEGER as total_rewards
  FROM public.referral_uses ru
  JOIN public.profiles p ON p.id = ru.referrer_user_id
  WHERE ru.status = 'completed'
  GROUP BY ru.referrer_user_id, p.name
  ORDER BY referral_count DESC
  LIMIT limit_count;
END;
$$;

-- ============================================
-- 9. SCHEDULED CLEANUP (via pg_cron if available)
-- ============================================
-- Run cleanup daily at 2 AM
-- SELECT cron.schedule('cleanup-expired-shares', '0 2 * * *', 'SELECT cleanup_expired_shares()');

-- ============================================
-- DONE! 🎉
-- ============================================

