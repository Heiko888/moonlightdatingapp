-- HD App - Admin User Setup für heiko.schwaninger@outlook.com
-- Dieses Script richtet Heiko als Admin ein

-- 1. Admin-User in der profiles Tabelle markieren
UPDATE profiles 
SET is_admin = true 
WHERE user_id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'heiko.schwaninger@outlook.com'
);

-- 2. Admin-Subscription erstellen (optional)
INSERT INTO subscriptions (user_id, package_id, status, start_date, end_date)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'heiko.schwaninger@outlook.com'),
  'admin',
  'active',
  NOW(),
  NOW() + INTERVAL '1 year'
)
ON CONFLICT (user_id) DO UPDATE SET
  package_id = 'admin',
  status = 'active',
  start_date = NOW(),
  end_date = NOW() + INTERVAL '1 year';

-- 3. Überprüfung: Admin-User anzeigen
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

-- 4. Alle Admin-User anzeigen
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
WHERE p.is_admin = true;

-- 5. Admin-Statistiken
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN is_admin = true THEN 1 END) as admin_users,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_users
FROM profiles;

-- 6. Subscription-Statistiken
SELECT 
  package_id,
  COUNT(*) as count
FROM subscriptions
GROUP BY package_id
ORDER BY count DESC;
