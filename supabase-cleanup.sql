-- Bereinigung der Supabase-Tabellen
-- Führen Sie dieses Script aus, bevor Sie das Hauptscript erneut ausführen

-- Tabellen löschen (in umgekehrter Reihenfolge wegen Foreign Keys)
DROP TABLE IF EXISTS planet_centers CASCADE;
DROP TABLE IF EXISTS planet_gates CASCADE;
DROP TABLE IF EXISTS planet_info CASCADE;

-- Policies löschen (falls vorhanden)
DROP POLICY IF EXISTS "Public read access for planet_info" ON planet_info;
DROP POLICY IF EXISTS "Public read access for planet_gates" ON planet_gates;
DROP POLICY IF EXISTS "Public read access for planet_centers" ON planet_centers;
