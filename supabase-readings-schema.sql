-- Tabelle für Human Design Readings
CREATE TABLE IF NOT EXISTS readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_type VARCHAR(50) NOT NULL, -- 'basis', 'erweitert', 'folge'
  client_name VARCHAR(255),
  reading_data JSONB NOT NULL, -- Alle Reading-Daten als JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für schnellere Abfragen
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_readings_type ON readings(reading_type);

-- RLS (Row Level Security) aktivieren
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Policy: Benutzer können nur ihre eigenen Readings sehen
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'readings' AND policyname = 'Users can view own readings'
  ) THEN
    CREATE POLICY "Users can view own readings"
      ON readings
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Policy: Benutzer können eigene Readings erstellen
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'readings' AND policyname = 'Users can create own readings'
  ) THEN
    CREATE POLICY "Users can create own readings"
      ON readings
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Policy: Benutzer können eigene Readings aktualisieren
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'readings' AND policyname = 'Users can update own readings'
  ) THEN
    CREATE POLICY "Users can update own readings"
      ON readings
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Policy: Benutzer können eigene Readings löschen
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'readings' AND policyname = 'Users can delete own readings'
  ) THEN
    CREATE POLICY "Users can delete own readings"
      ON readings
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_readings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger nur erstellen, wenn er noch nicht existiert
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'readings_updated_at_trigger'
  ) THEN
    CREATE TRIGGER readings_updated_at_trigger
      BEFORE UPDATE ON readings
      FOR EACH ROW
      EXECUTE FUNCTION update_readings_updated_at();
  END IF;
END $$;

-- Kommentar zur Tabelle
COMMENT ON TABLE readings IS 'Speichert Human Design Readings, die von Coaches erstellt wurden';
COMMENT ON COLUMN readings.reading_type IS 'Typ des Readings: basis, erweitert, oder folge';
COMMENT ON COLUMN readings.reading_data IS 'Vollständige Reading-Daten im JSON-Format';
COMMENT ON COLUMN readings.client_name IS 'Name des Klienten für schnelle Suche';

