-- HD App - Admin User Setup
-- Dieses Script erstellt einen Admin-User in der Supabase-Datenbank

-- 1. Admin-User in der profiles Tabelle markieren
-- Ersetzen Sie 'YOUR_USER_ID' mit der tatsächlichen User-ID aus der auth.users Tabelle

-- Beispiel: Admin-User für Email 'admin@hd-app.com' erstellen
UPDATE profiles 
SET is_admin = true 
WHERE user_id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'admin@hd-app.com'
);

-- 2. Admin-Subscription erstellen (optional)
-- Ersetzen Sie 'YOUR_USER_ID' mit der tatsächlichen User-ID
INSERT INTO subscriptions (user_id, package_id, status, start_date, end_date)
VALUES (
  'YOUR_USER_ID',
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
WHERE p.is_admin = true;

-- 4. Alle User mit Admin-Status anzeigen
SELECT 
  p.user_id,
  p.email,
  p.first_name,
  p.last_name,
  p.is_admin,
  s.package_id,
  s.status,
  s.start_date,
  s.end_date
FROM profiles p
LEFT JOIN subscriptions s ON p.user_id = s.user_id
ORDER BY p.created_at DESC;

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
