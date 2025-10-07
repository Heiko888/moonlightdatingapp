# 🗄️ Supabase Tables Setup - Anleitung

## **Schritt 1: Supabase Dashboard öffnen**
1. Gehe zu: https://supabase.com/dashboard/project/njjcywgskzepikyzhihy
2. Logge dich in dein Supabase-Konto ein

## **Schritt 2: SQL Editor öffnen**
1. Klicke auf **"SQL Editor"** im linken Menü
2. Klicke auf **"New Query"**

## **Schritt 3: SQL-Schema ausführen**
1. Kopiere den gesamten Inhalt aus `supabase-setup.sql`
2. Füge ihn in den SQL Editor ein
3. Klicke auf **"Run"** (oder Strg+Enter)

## **Schritt 4: Tables überprüfen**
1. Gehe zu **"Table Editor"** im linken Menü
2. Überprüfe, dass alle Tables erstellt wurden:
   - ✅ profiles
   - ✅ charts
   - ✅ matching_profiles
   - ✅ swipes
   - ✅ matches
   - ✅ moon_tracking
   - ✅ community_posts
   - ✅ chat_messages

## **Schritt 5: RLS Policies überprüfen**
1. Gehe zu **"Authentication" > "Policies"**
2. Überprüfe, dass alle RLS Policies aktiv sind

## **Schritt 6: Test-Daten einfügen (optional)**
```sql
-- Test-User Profile
INSERT INTO profiles (user_id, email, first_name, last_name, hd_type, profile, authority, strategy)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'test@example.com',
  'Test',
  'User',
  'Generator',
  '1/3',
  'Sacral',
  'Wait to Respond'
);
```

## **Schritt 7: App testen**
1. Gehe zu http://localhost:3005
2. Teste Login/Register
3. Teste Chart-Erstellung
4. Teste Community-Features

## **Troubleshooting**
- **Fehler bei RLS**: Überprüfe, dass alle Policies korrekt erstellt wurden
- **Fehler bei Auth**: Überprüfe, dass auth.users Table existiert
- **Fehler bei JSONB**: Überprüfe, dass PostgreSQL Version 12+ verwendet wird

## **Nächste Schritte**
- Realtime-Features aktivieren
- Chat-System testen
- Community-Features testen
- Performance optimieren
