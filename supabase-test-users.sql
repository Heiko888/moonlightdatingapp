-- Test-User für Swipe-Funktion
-- Diese User können zum Testen der Swipe/Match-Funktionalität verwendet werden

-- Hinweis: Ersetze '0c497666-2d5e-4f46-b6ae-ff457c4c085d' mit einer echten User-ID aus auth.users

-- Test User 1: Luna (Generator)
INSERT INTO public.friends (user_id, name, email, avatar, location, age, hd_type, hd_profile, hd_authority, hd_strategy, bio, interests, is_online, status)
VALUES (
  '00000000-0000-0000-0000-000000000001', -- Dummy user_id
  'Luna Schmidt',
  'luna.schmidt@example.com',
  '/dating/default.jpg',
  'Berlin',
  28,
  'Generator',
  '2/4',
  'Emotional',
  'Wait to Respond',
  'Generator mit emotionaler Autorität. Liebe es, authentische Verbindungen zu schaffen. Ich bin eine leidenschaftliche Yogalehrerin und verbringe meine Zeit gerne in der Natur. Suche nach tiefen spirituellen Verbindungen.',
  ARRAY['Yoga', 'Astrologie', 'Natur', 'Meditation', 'Kochen', 'Reisen'],
  true,
  'online'
)
ON CONFLICT (id) DO NOTHING;

-- Test User 2: Phoenix (Projektor)
INSERT INTO public.friends (user_id, name, email, avatar, location, age, hd_type, hd_profile, hd_authority, hd_strategy, bio, interests, is_online, status)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Phoenix Müller',
  'phoenix.mueller@example.com',
  '/dating/default.jpg',
  'München',
  32,
  'Projektor',
  '3/5',
  'Splenic',
  'Wait for the Invitation',
  'Projektor mit splenischer Autorität. Hier um zu führen und zu inspirieren. Ich coache Menschen dabei, ihr Potenzial zu entfalten. Suche nach einer Verbindung, die meine Gaben erkennt.',
  ARRAY['Coaching', 'Spiritualität', 'Reisen', 'Psychologie', 'Bücher'],
  false,
  'away'
)
ON CONFLICT (id) DO NOTHING;

-- Test User 3: Sage (Manifestor)
INSERT INTO public.friends (user_id, name, email, avatar, location, age, hd_type, hd_profile, hd_authority, hd_strategy, bio, interests, is_online, status)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'Sage Weber',
  'sage.weber@example.com',
  '/dating/default.jpg',
  'Hamburg',
  26,
  'Manifestor',
  '1/3',
  'Emotional',
  'Inform Before Acting',
  'Manifestor mit emotionaler Autorität. Erschaffe gerne neue Wege und inspiriere andere. Künstlerin und Musikerin aus Leidenschaft. Suche jemanden, der meine Unabhängigkeit respektiert.',
  ARRAY['Kunst', 'Musik', 'Innovation', 'Kreativität', 'Tanzen'],
  true,
  'online'
)
ON CONFLICT (id) DO NOTHING;

-- Test User 4: River (Reflektor)
INSERT INTO public.friends (user_id, name, email, avatar, location, age, hd_type, hd_profile, hd_authority, hd_strategy, bio, interests, is_online, status)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  'River Chen',
  'river.chen@example.com',
  '/dating/default.jpg',
  'Frankfurt',
  35,
  'Reflektor',
  '6/2',
  'Lunar Cycle',
  'Wait a Lunar Cycle',
  'Reflektor mit Lunar Cycle Autorität. Ich spiegle die Energie um mich herum und brauche Zeit für Entscheidungen. Philosophie und Gemeinschaft sind mir wichtig. Suche nach echter Verbindung.',
  ARRAY['Technologie', 'Philosophie', 'Gemeinschaft', 'Wissenschaft', 'Meditation'],
  true,
  'online'
)
ON CONFLICT (id) DO NOTHING;

-- Test User 5: Aurora (Generator)
INSERT INTO public.friends (user_id, name, email, avatar, location, age, hd_type, hd_profile, hd_authority, hd_strategy, bio, interests, is_online, status)
VALUES (
  '00000000-0000-0000-0000-000000000005',
  'Aurora Hoffmann',
  'aurora.hoffmann@example.com',
  '/dating/default.jpg',
  'Köln',
  29,
  'Generator',
  '5/1',
  'Sacral',
  'Wait to Respond',
  'Generator mit sakraler Autorität. Tänzerin und Künstlerin. Bringe Menschen durch Bewegung und Kunst zusammen. Ich liebe es, im Flow zu sein und suche jemanden, der diese Energie teilt.',
  ARRAY['Tanz', 'Musik', 'Kreativität', 'Bewegung', 'Ausdruck', 'Performance'],
  false,
  'busy'
)
ON CONFLICT (id) DO NOTHING;

-- Test User 6: Kai (Manifestor)
INSERT INTO public.friends (user_id, name, email, avatar, location, age, hd_type, hd_profile, hd_authority, hd_strategy, bio, interests, is_online, status)
VALUES (
  '00000000-0000-0000-0000-000000000006',
  'Kai Richter',
  'kai.richter@example.com',
  '/dating/default.jpg',
  'Stuttgart',
  31,
  'Manifestor',
  '4/6',
  'Ego',
  'Inform Before Acting',
  'Manifestor mit Ego-Autorität. Sport-Coach und Motivator. Helfe Menschen dabei, ihre Ziele zu erreichen. Ich brauche Freiheit und suche jemanden, der meine Stärke schätzt.',
  ARRAY['Sport', 'Abenteuer', 'Leadership', 'Motivation', 'Fitness', 'Outdoor'],
  true,
  'online'
)
ON CONFLICT (id) DO NOTHING;

-- Test User 7: Stella (Projektor)
INSERT INTO public.friends (user_id, name, email, avatar, location, age, hd_type, hd_profile, hd_authority, hd_strategy, bio, interests, is_online, status)
VALUES (
  '00000000-0000-0000-0000-000000000007',
  'Stella Becker',
  'stella.becker@example.com',
  '/dating/default.jpg',
  'Dresden',
  27,
  'Projektor',
  '2/5',
  'Emotional',
  'Wait for the Invitation',
  'Projektor mit emotionaler Autorität. Ich bin Designerin und liebe Ästhetik in allen Formen. Warte auf die richtige Einladung und suche jemanden, der meine Weisheit zu schätzen weiß.',
  ARRAY['Design', 'Kunst', 'Mode', 'Ästhetik', 'Fotografie', 'Reisen'],
  true,
  'online'
)
ON CONFLICT (id) DO NOTHING;

-- Test User 8: Noah (Generator)
INSERT INTO public.friends (user_id, name, email, avatar, location, age, hd_type, hd_profile, hd_authority, hd_strategy, bio, interests, is_online, status)
VALUES (
  '00000000-0000-0000-0000-000000000008',
  'Noah Fischer',
  'noah.fischer@example.com',
  '/dating/default.jpg',
  'Leipzig',
  30,
  'Generator',
  '1/4',
  'Sacral',
  'Wait to Respond',
  'Generator mit sakraler Autorität. Musiker und Produzent. Meine Energie fließt in Kreativität und ich liebe es, andere damit zu inspirieren. Suche nach jemandem mit ähnlicher Leidenschaft.',
  ARRAY['Musik', 'Produktion', 'Konzerte', 'Vinyl', 'Studio', 'Sound'],
  false,
  'offline'
)
ON CONFLICT (id) DO NOTHING;

-- Ausgabe der eingefügten User
SELECT 
  name, 
  hd_type, 
  hd_profile, 
  location, 
  age, 
  is_online,
  array_length(interests, 1) as interest_count
FROM public.friends
WHERE user_id LIKE '00000000-%'
ORDER BY name;

-- Info-Meldung
DO $$
BEGIN
  RAISE NOTICE '✅ Test-User erfolgreich angelegt!';
  RAISE NOTICE '📍 Anzahl Test-User: 8';
  RAISE NOTICE '🎭 HD-Typen: 3x Generator, 2x Projektor, 2x Manifestor, 1x Reflektor';
  RAISE NOTICE '📱 Status: 6x online, 1x away, 1x offline';
  RAISE NOTICE '';
  RAISE NOTICE '🔥 Jetzt kannst du die Swipe-Funktion testen!';
  RAISE NOTICE '👉 Gehe zu: http://localhost:3005/swipe';
END $$;

