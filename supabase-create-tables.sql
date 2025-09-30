-- Supabase Tabellen für Human Design App
-- Erstellt die fehlenden Tabellen für Planeten-Daten

-- Planet Info Table - Grundinformationen aller Planeten
CREATE TABLE IF NOT EXISTS planet_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  planet_name VARCHAR(50) UNIQUE NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  orbital_period VARCHAR(50) NOT NULL,
  discovery VARCHAR(50) NOT NULL,
  mythology VARCHAR(255) NOT NULL,
  color VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Planet Gates Table - Alle 64 Gates für alle Planeten
CREATE TABLE IF NOT EXISTS planet_gates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  planet_name VARCHAR(50) NOT NULL,
  gate_number INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  essence VARCHAR(255) NOT NULL,
  consciousness VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  deep_meaning TEXT NOT NULL,
  shadow_aspects JSONB,
  gifts JSONB,
  affirmation TEXT NOT NULL,
  center_name VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(planet_name, gate_number)
);

-- Planet Centers Table - Alle 9 Centers für alle Planeten
CREATE TABLE IF NOT EXISTS planet_centers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  planet_name VARCHAR(50) NOT NULL,
  center_name VARCHAR(50) NOT NULL,
  essence VARCHAR(255) NOT NULL,
  consciousness VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  deep_meaning TEXT NOT NULL,
  shadow_aspects JSONB,
  gifts JSONB,
  affirmation TEXT NOT NULL,
  gates JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(planet_name, center_name)
);

-- Sample Data für Planet Info
INSERT INTO planet_info (planet_name, symbol, orbital_period, discovery, mythology, color, description) VALUES
('Sonne', '☉', '365.25 Tage', 'Seit Anbeginn der Zeit', 'Das Zentrum des Bewusstseins', '#FFD700', 'Die Sonne repräsentiert unser wahres Selbst, unsere Essenz und unser Bewusstsein. Sie zeigt, wer wir wirklich sind und was uns antreibt.'),
('Mond', '☽', '27.3 Tage', 'Seit Anbeginn der Zeit', 'Der Spiegel der Seele', '#C0C0C0', 'Der Mond repräsentiert unsere Emotionen, Instinkte und unser Unterbewusstsein. Er zeigt, wie wir uns fühlen und reagieren.'),
('Merkur', '☿', '88 Tage', 'Seit Anbeginn der Zeit', 'Der Bote der Götter', '#87CEEB', 'Merkur repräsentiert Kommunikation, Denken und Lernen. Er zeigt, wie wir Informationen verarbeiten und ausdrücken.'),
('Venus', '♀', '225 Tage', 'Seit Anbeginn der Zeit', 'Die Göttin der Liebe', '#FFB6C1', 'Venus repräsentiert Liebe, Schönheit und Werte. Sie zeigt, was wir schätzen und wie wir Beziehungen gestalten.'),
('Mars', '♂', '687 Tage', 'Seit Anbeginn der Zeit', 'Der Gott des Krieges', '#FF4500', 'Mars repräsentiert Energie, Aktion und Durchsetzung. Er zeigt, wie wir unsere Ziele verfolgen und kämpfen.'),
('Jupiter', '♃', '12 Jahre', 'Seit Anbeginn der Zeit', 'Der König der Götter', '#DAA520', 'Jupiter repräsentiert Expansion, Weisheit und Optimismus. Er zeigt, wie wir wachsen und uns entwickeln.'),
('Saturn', '♄', '29 Jahre', 'Seit Anbeginn der Zeit', 'Der Lehrer', '#B0C4DE', 'Saturn repräsentiert Struktur, Disziplin und Verantwortung. Er zeigt, wo wir lernen und reifen müssen.'),
('Uranus', '♅', '84 Jahre', '1781', 'Der Revolutionär', '#00CED1', 'Uranus repräsentiert Revolution, Innovation und Freiheit. Er zeigt, wo wir brechen und Neues erschaffen.'),
('Neptun', '♆', '165 Jahre', '1846', 'Der Mystiker', '#4169E1', 'Neptun repräsentiert Spiritualität, Illusion und Verbindung. Er zeigt, wo wir spirituell wachsen und uns verbinden.'),
('Pluto', '♇', '248 Jahre', '1930', 'Der Transformator', '#8B008B', 'Pluto repräsentiert Transformation, Macht und Regeneration. Er zeigt, wo wir sterben und wiedergeboren werden.'),
('Chiron', '⚡', '50.7 Jahre', '1977', 'Der verwundete Heiler', '#FF6B6B', 'Chiron repräsentiert unsere tiefsten Wunden und unsere Fähigkeit, andere zu heilen. Er zeigt, wo wir verletzt wurden und wo wir anderen helfen können.'),
('Lilith', '⚸', '8.85 Jahre', '1977', 'Die dunkle Göttin', '#4B0082', 'Lilith repräsentiert unsere dunkle Seite, unsere verborgenen Kräfte und unsere Rebellion gegen Konventionen.'),
('Incarnation Cross', '✚', 'Variabel', 'Human Design', 'Das Lebenskreuz', '#9370DB', 'Das Inkarnationskreuz zeigt unsere Lebensaufgabe und unseren höchsten Ausdruck in dieser Inkarnation.');

-- Sample Data für Planet Gates (Beispiel für Sonne)
INSERT INTO planet_gates (planet_name, gate_number, name, essence, consciousness, description, deep_meaning, shadow_aspects, gifts, affirmation, center_name) VALUES
('sonne', 1, 'Das Selbst', 'Kreativität', 'Selbstausdruck', 'Das Tor der Kreativität und des Selbstausdrucks', 'Die Essenz des kreativen Selbstausdrucks liegt in der authentischen Darstellung unserer inneren Wahrheit', '{"Selbstzweifel": "Angst vor Ablehnung", "Perfektionismus": "Übertriebene Selbstkritik"}', '{"Kreativität": "Natürlicher Ausdruck", "Authentizität": "Wahres Selbst"}', 'Ich bin einzigartig und kreativ', 'G-Zentrum'),
('sonne', 2, 'Die Richtung', 'Empfang', 'Empfänglichkeit', 'Das Tor der Empfänglichkeit und der Richtung', 'Die Fähigkeit, die richtige Richtung zu erkennen und zu folgen', '{"Verwirrung": "Unklare Richtung", "Passivität": "Mangel an Initiative"}', '{"Intuition": "Natürliche Führung", "Empfänglichkeit": "Offenheit für Führung"}', 'Ich folge meiner inneren Führung', 'G-Zentrum'),
('sonne', 3, 'Die Schwierigkeit', 'Innovation', 'Durchbruch', 'Das Tor der Innovation und des Durchbruchs', 'Die Kraft, durch Schwierigkeiten zu brechen und Neues zu erschaffen', '{"Frustration": "Widerstand gegen Veränderung", "Impatience": "Ungeduld mit Prozessen"}', '{"Innovation": "Neue Lösungen", "Durchbruch": "Transformation"}', 'Ich breche durch und erschaffe Neues', 'Kehlkopf-Zentrum');

-- Sample Data für Planet Centers (Beispiel für Sonne)
INSERT INTO planet_centers (planet_name, center_name, essence, consciousness, description, deep_meaning, shadow_aspects, gifts, affirmation, gates) VALUES
('sonne', 'G-Zentrum', 'Identität und Liebe', 'Wer ich bin', 'Das Zentrum der Identität und der Liebe', 'Die Essenz unseres Seins und unserer Fähigkeit zu lieben', '{"Identitätskrise": "Verlust des Selbst", "Liebesangst": "Angst vor Verletzung"}', '{"Identität": "Wahres Selbst", "Liebe": "Bedingungslose Liebe"}', 'Ich bin, wer ich bin', '["1", "2", "7", "10", "15", "25", "46"]'),
('sonne', 'Kehlkopf-Zentrum', 'Manifestation', 'Wie ich mich ausdrücke', 'Das Zentrum der Manifestation und des Ausdrucks', 'Die Kraft, Gedanken und Gefühle in die physische Realität zu bringen', '{"Schweigen": "Angst vor Ausdruck", "Überkommunikation": "Zu viel reden"}', '{"Manifestation": "Gedanken werden Realität", "Ausdruck": "Authentische Kommunikation"}', 'Ich drücke mich authentisch aus', '["3", "5", "11", "14", "16", "20", "21", "23", "26", "29", "31", "33", "35", "45", "56", "62"]'),
('sonne', 'Herz-Zentrum', 'Willenskraft', 'Wie ich handle', 'Das Zentrum der Willenskraft und des Handelns', 'Die Kraft, zu handeln und zu manifestieren', '{"Willensschwäche": "Mangel an Durchsetzung", "Überwillen": "Zwanghaftes Handeln"}', '{"Willenskraft": "Starke Entschlossenheit", "Handlung": "Entschlossenes Handeln"}', 'Ich handle mit klarem Willen', '["21", "26", "40", "51"]');

-- RLS (Row Level Security) aktivieren
ALTER TABLE planet_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE planet_gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE planet_centers ENABLE ROW LEVEL SECURITY;

-- Öffentliche Lese-Zugriffe erlauben
CREATE POLICY "Public read access for planet_info" ON planet_info FOR SELECT USING (true);
CREATE POLICY "Public read access for planet_gates" ON planet_gates FOR SELECT USING (true);
CREATE POLICY "Public read access for planet_centers" ON planet_centers FOR SELECT USING (true);
