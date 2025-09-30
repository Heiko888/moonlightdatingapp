-- Test-Benutzer für Login-Tests erstellen
-- Führe dieses Script in der Supabase SQL-Konsole aus

-- 1. Test-Benutzer in auth.users erstellen (falls noch nicht vorhanden)
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('testpass123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- 2. Test-Benutzer in users-Tabelle erstellen
INSERT INTO public.users (
  id,
  email,
  first_name,
  last_name,
  birth_date,
  subscription,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@example.com'),
  'test@example.com',
  'Test',
  'User',
  '1990-01-01',
  'free',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  updated_at = NOW();

-- 3. Profil-Setup als abgeschlossen markieren (für Dashboard-Test)
-- Dies wird normalerweise über localStorage gemacht, aber für Tests direkt in der DB
UPDATE public.users 
SET profile_setup_completed = true 
WHERE email = 'test@example.com';

-- 4. Test-Daten für Dashboard-Statistiken
INSERT INTO public.moon_tracking (user_id, moon_phase, mood, energy_level, notes) VALUES
((SELECT id FROM auth.users WHERE email = 'test@example.com'), 'Vollmond', 'Energisch', 8, 'Test-Eintrag 1'),
((SELECT id FROM auth.users WHERE email = 'test@example.com'), 'Neumond', 'Ruhig', 6, 'Test-Eintrag 2')
ON CONFLICT DO NOTHING;

INSERT INTO public.readings (user_id, type, title, description) VALUES
((SELECT id FROM auth.users WHERE email = 'test@example.com'), 'daily', 'Tages-Reading', 'Test-Reading 1'),
((SELECT id FROM auth.users WHERE email = 'test@example.com'), 'weekly', 'Wochen-Reading', 'Test-Reading 2')
ON CONFLICT DO NOTHING;

-- 5. Erfolgsmeldung
SELECT 'Test-Benutzer erfolgreich erstellt!' as message,
       'E-Mail: test@example.com' as email,
       'Passwort: testpass123' as password;
