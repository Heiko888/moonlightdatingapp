-- Cleanup-Script für Readings-Tabelle
-- Führe dies aus, wenn du die Tabelle neu erstellen möchtest

-- Warnung: Dies löscht alle existierenden Readings!

-- Trigger entfernen
DROP TRIGGER IF EXISTS readings_updated_at_trigger ON readings;

-- Funktion entfernen
DROP FUNCTION IF EXISTS update_readings_updated_at();

-- Policies entfernen
DROP POLICY IF EXISTS "Users can view own readings" ON readings;
DROP POLICY IF EXISTS "Users can create own readings" ON readings;
DROP POLICY IF EXISTS "Users can update own readings" ON readings;
DROP POLICY IF EXISTS "Users can delete own readings" ON readings;

-- Indizes entfernen (werden automatisch mit der Tabelle gelöscht, aber zur Sicherheit)
DROP INDEX IF EXISTS idx_readings_user_id;
DROP INDEX IF EXISTS idx_readings_created_at;
DROP INDEX IF EXISTS idx_readings_type;

-- Tabelle löschen
DROP TABLE IF EXISTS readings CASCADE;

-- Bestätigung
SELECT 'Readings-Tabelle und alle zugehörigen Objekte wurden erfolgreich gelöscht!' AS status;

