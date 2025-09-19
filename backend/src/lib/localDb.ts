import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/hd-app.db');
const db = new Database(dbPath);

// Datenbank initialisieren
export function initLocalDatabase() {
  console.log('[LOCAL-DB] Initialisiere lokale SQLite-Datenbank...');
  
  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      birthdate TEXT,
      birthplace TEXT,
      location TEXT,
      bio TEXT,
      age INTEGER,
      hd_type TEXT,
      profile TEXT,
      authority TEXT,
      strategy TEXT,
      centers TEXT,
      channels TEXT,
      gates TEXT,
      planets TEXT,
      chart_data TEXT,
      images TEXT,
      interests TEXT,
      avatar TEXT,
      is_active BOOLEAN DEFAULT 1,
      last_active TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Charts Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS charts (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      birth_date TEXT NOT NULL,
      birth_time TEXT NOT NULL,
      birth_place TEXT NOT NULL,
      chart_data TEXT NOT NULL,
      centers TEXT,
      channels TEXT,
      gates TEXT,
      planets TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Knowledge Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS knowledge_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('gate', 'channel', 'center', 'profile', 'type')),
      ref_key TEXT NOT NULL,
      scope TEXT NOT NULL,
      quality TEXT DEFAULT 'draft' CHECK (quality IN ('verified', 'draft', 'needs_review')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Admins Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Journal Entries Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      mood TEXT,
      energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
      tags TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Moon Tracking Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS moon_tracking (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      moon_phase TEXT NOT NULL,
      mood INTEGER CHECK (mood >= 1 AND mood <= 10),
      energy INTEGER CHECK (energy >= 1 AND energy <= 10),
      notes TEXT,
      rituals_completed TEXT,
      journal_entry_id TEXT REFERENCES journal_entries(id) ON DELETE SET NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Swipes Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS swipes (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      target_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      liked BOOLEAN NOT NULL,
      is_super_like BOOLEAN DEFAULT 0,
      compatibility_score INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Matches Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      user_a TEXT REFERENCES users(id) ON DELETE CASCADE,
      user_b TEXT REFERENCES users(id) ON DELETE CASCADE,
      compatibility_score INTEGER DEFAULT 0,
      relationship_type TEXT DEFAULT 'romantic',
      is_active BOOLEAN DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Match Feedback Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS match_feedback (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      target_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      match_id TEXT REFERENCES matches(id) ON DELETE CASCADE,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      feedback TEXT,
      categories TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Compatibility Analysis Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS compatibility_analysis (
      id TEXT PRIMARY KEY,
      user_a TEXT REFERENCES users(id) ON DELETE CASCADE,
      user_b TEXT REFERENCES users(id) ON DELETE CASCADE,
      overall_score INTEGER NOT NULL,
      breakdown TEXT NOT NULL,
      strengths TEXT,
      challenges TEXT,
      recommendations TEXT,
      detailed_analysis TEXT,
      relationship_type TEXT DEFAULT 'romantic',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Chiron Healing Practices Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chiron_healing_practices (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      techniques TEXT, -- JSON
      benefits TEXT, -- JSON
      contraindications TEXT, -- JSON
      duration_minutes INTEGER,
      difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
      materials_needed TEXT, -- JSON
      instructions TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Chiron Transits Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chiron_transits (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      transit_date TEXT NOT NULL,
      transit_type TEXT NOT NULL,
      affected_gate INTEGER,
      affected_center TEXT,
      description TEXT NOT NULL,
      healing_opportunity TEXT,
      challenges TEXT,
      recommendations TEXT,
      intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
      duration_days INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Chiron Wounds Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chiron_wounds (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      wound_type TEXT NOT NULL,
      gate_number INTEGER,
      center_name TEXT,
      description TEXT NOT NULL,
      healing_stage TEXT DEFAULT 'awareness',
      healing_practices TEXT, -- JSON
      progress_notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Chiron Healing Sessions Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chiron_healing_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      practice_id TEXT REFERENCES chiron_healing_practices(id) ON DELETE CASCADE,
      session_date TEXT NOT NULL,
      duration_minutes INTEGER,
      notes TEXT,
      effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 10),
      emotional_state_before INTEGER CHECK (emotional_state_before >= 1 AND emotional_state_before <= 10),
      emotional_state_after INTEGER CHECK (emotional_state_after >= 1 AND emotional_state_after <= 10),
      insights TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Chiron Gates Table - Alle 64 Gates mit Chiron-Informationen
  db.exec(`
    CREATE TABLE IF NOT EXISTS chiron_gates (
      id TEXT PRIMARY KEY,
      gate_number INTEGER UNIQUE NOT NULL,
      name TEXT NOT NULL,
      healing TEXT NOT NULL,
      wound TEXT NOT NULL,
      description TEXT NOT NULL,
      deep_meaning TEXT NOT NULL,
      shadow_aspects TEXT, -- JSON Array
      gifts TEXT, -- JSON Array
      healing_affirmation TEXT NOT NULL,
      center_name TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Chiron Centers Table - Alle 9 Centers mit Chiron-Informationen
  db.exec(`
    CREATE TABLE IF NOT EXISTS chiron_centers (
      id TEXT PRIMARY KEY,
      center_name TEXT UNIQUE NOT NULL,
      healing TEXT NOT NULL,
      wound TEXT NOT NULL,
      description TEXT NOT NULL,
      deep_meaning TEXT NOT NULL,
      shadow_aspects TEXT, -- JSON Array
      gifts TEXT, -- JSON Array
      healing_affirmation TEXT NOT NULL,
      gates TEXT, -- JSON Array of gate numbers
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Planet Gates Table - Alle 64 Gates für alle Planeten
  db.exec(`
    CREATE TABLE IF NOT EXISTS planet_gates (
      id TEXT PRIMARY KEY,
      planet_name TEXT NOT NULL,
      gate_number INTEGER NOT NULL,
      name TEXT NOT NULL,
      essence TEXT NOT NULL,
      consciousness TEXT NOT NULL,
      description TEXT NOT NULL,
      deep_meaning TEXT NOT NULL,
      shadow_aspects TEXT, -- JSON Array
      gifts TEXT, -- JSON Array
      affirmation TEXT NOT NULL,
      personal_affirmation TEXT,
      business_affirmation TEXT,
      business_description TEXT,
      center_name TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(planet_name, gate_number)
    )
  `);

  // Erweitere die Tabelle um die neuen Spalten (falls sie noch nicht existieren)
  try {
    db.exec(`ALTER TABLE planet_gates ADD COLUMN personal_affirmation TEXT`);
  } catch (e) {
    // Spalte existiert bereits
  }
  
  try {
    db.exec(`ALTER TABLE planet_gates ADD COLUMN business_affirmation TEXT`);
  } catch (e) {
    // Spalte existiert bereits
  }
  
  try {
    db.exec(`ALTER TABLE planet_gates ADD COLUMN business_description TEXT`);
  } catch (e) {
    // Spalte existiert bereits
  }

  // Planet Centers Table - Alle 9 Centers für alle Planeten
  db.exec(`
    CREATE TABLE IF NOT EXISTS planet_centers (
      id TEXT PRIMARY KEY,
      planet_name TEXT NOT NULL,
      center_name TEXT NOT NULL,
      essence TEXT NOT NULL,
      consciousness TEXT NOT NULL,
      description TEXT NOT NULL,
      deep_meaning TEXT NOT NULL,
      shadow_aspects TEXT, -- JSON Array
      gifts TEXT, -- JSON Array
      affirmation TEXT NOT NULL,
      gates TEXT, -- JSON Array of gate numbers
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(planet_name, center_name)
    )
  `);

  // Planet Info Table - Grundinformationen aller Planeten
  db.exec(`
    CREATE TABLE IF NOT EXISTS planet_info (
      id TEXT PRIMARY KEY,
      planet_name TEXT UNIQUE NOT NULL,
      symbol TEXT NOT NULL,
      orbital_period TEXT NOT NULL,
      discovery TEXT NOT NULL,
      mythology TEXT NOT NULL,
      color TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('[LOCAL-DB] Datenbank erfolgreich initialisiert');
  
  // Initialisiere alle Planeten-Daten
  initializeChironData();
  initializeAllPlanetsData();
}

// Chiron-Daten initialisieren
function initializeChironData() {
  console.log('[LOCAL-DB] Initialisiere Chiron-Daten...');
  
  // Alle 64 Gates mit Chiron-Informationen
  const chironGates = [
    // Gates 1-8 (bereits vorhanden)
    { gate: 1, name: "Kreativität", healing: "Kreative Heilung", wound: "Kreative Wunde", center: "G" },
    { gate: 2, name: "Empfänglichkeit", healing: "Empfangende Heilung", wound: "Empfangende Wunde", center: "G" },
    { gate: 3, name: "Beginn", healing: "Anfängliche Heilung", wound: "Anfängliche Wunde", center: "SACRAL" },
    { gate: 4, name: "Jugendliche Torheit", healing: "Wissende Heilung", wound: "Wissende Wunde", center: "AJNA" },
    { gate: 5, name: "Warten", healing: "Wartende Heilung", wound: "Wartende Wunde", center: "SACRAL" },
    { gate: 6, name: "Konflikt", healing: "Konfliktlösende Heilung", wound: "Konfliktlösende Wunde", center: "SOLAR" },
    { gate: 7, name: "Die Rolle des Selbst", healing: "Rollenbewusste Heilung", wound: "Rollenbewusste Wunde", center: "G" },
    { gate: 8, name: "Haltung", healing: "Wertbewusste Heilung", wound: "Wertbewusste Wunde", center: "THROAT" },
    
    // Gates 9-16
    { gate: 9, name: "Fokus", healing: "Fokussierte Heilung", wound: "Fokussierte Wunde", center: "SACRAL" },
    { gate: 10, name: "Selbstliebe", healing: "Selbstliebende Heilung", wound: "Selbstliebende Wunde", center: "G" },
    { gate: 11, name: "Frieden", healing: "Friedliche Heilung", wound: "Friedliche Wunde", center: "AJNA" },
    { gate: 12, name: "Vorsicht", healing: "Vorsichtige Heilung", wound: "Vorsichtige Wunde", center: "THROAT" },
    { gate: 13, name: "Der Zuhörer", healing: "Zuhörende Heilung", wound: "Zuhörende Wunde", center: "G" },
    { gate: 14, name: "Die Kraft", healing: "Kraftvolle Heilung", wound: "Kraftvolle Wunde", center: "SACRAL" },
    { gate: 15, name: "Bescheidenheit", healing: "Bescheidene Heilung", wound: "Bescheidene Wunde", center: "G" },
    { gate: 16, name: "Enthusiasmus", healing: "Enthusiastische Heilung", wound: "Enthusiastische Wunde", center: "THROAT" },
    
    // Gates 17-24
    { gate: 17, name: "Folgen", healing: "Folgende Heilung", wound: "Folgende Wunde", center: "AJNA" },
    { gate: 18, name: "Korrektur", healing: "Korrigierende Heilung", wound: "Korrigierende Wunde", center: "SPLEEN" },
    { gate: 19, name: "Annäherung", healing: "Annähernde Heilung", wound: "Annähernde Wunde", center: "ROOT" },
    { gate: 20, name: "Das Jetzt", healing: "Gegenwärtige Heilung", wound: "Gegenwärtige Wunde", center: "THROAT" },
    { gate: 21, name: "Kontrolle", healing: "Kontrollierende Heilung", wound: "Kontrollierende Wunde", center: "HEART" },
    { gate: 22, name: "Anmut", healing: "Anmutige Heilung", wound: "Anmutige Wunde", center: "SOLAR" },
    { gate: 23, name: "Aufspaltung", healing: "Aufspaltende Heilung", wound: "Aufspaltende Wunde", center: "THROAT" },
    { gate: 24, name: "Rückkehr", healing: "Rückkehrende Heilung", wound: "Rückkehrende Wunde", center: "AJNA" },
    
    // Gates 25-32
    { gate: 25, name: "Unschuld", healing: "Unschuldige Heilung", wound: "Unschuldige Wunde", center: "G" },
    { gate: 26, name: "Der Egoist", healing: "Egoistische Heilung", wound: "Egoistische Wunde", center: "HEART" },
    { gate: 27, name: "Die Fürsorge", healing: "Fürsorgliche Heilung", wound: "Fürsorgliche Wunde", center: "SACRAL" },
    { gate: 28, name: "Das Spiel", healing: "Spielende Heilung", wound: "Spielende Wunde", center: "SPLEEN" },
    { gate: 29, name: "Die Entschlossenheit", healing: "Entschlossene Heilung", wound: "Entschlossene Wunde", center: "SACRAL" },
    { gate: 30, name: "Die Gefühle", healing: "Gefühlsvolle Heilung", wound: "Gefühlsvolle Wunde", center: "SOLAR" },
    { gate: 31, name: "Der Einfluss", healing: "Einflussreiche Heilung", wound: "Einflussreiche Wunde", center: "THROAT" },
    { gate: 32, name: "Die Dauer", healing: "Dauerhafte Heilung", wound: "Dauerhafte Wunde", center: "SPLEEN" },
    
    // Gates 33-40
    { gate: 33, name: "Die Flucht", healing: "Flüchtende Heilung", wound: "Flüchtende Wunde", center: "THROAT" },
    { gate: 34, name: "Die Kraft", healing: "Kraftvolle Heilung", wound: "Kraftvolle Wunde", center: "SACRAL" },
    { gate: 35, name: "Der Fortschritt", healing: "Fortschrittliche Heilung", wound: "Fortschrittliche Wunde", center: "SOLAR" },
    { gate: 36, name: "Die Krise", healing: "Krisenhafte Heilung", wound: "Krisenhafte Wunde", center: "SOLAR" },
    { gate: 37, name: "Die Freundschaft", healing: "Freundschaftliche Heilung", wound: "Freundschaftliche Wunde", center: "SOLAR" },
    { gate: 38, name: "Der Kämpfer", healing: "Kämpfende Heilung", wound: "Kämpfende Wunde", center: "ROOT" },
    { gate: 39, name: "Die Provokation", healing: "Provokative Heilung", wound: "Provokative Wunde", center: "ROOT" },
    { gate: 40, name: "Die Entspannung", healing: "Entspannende Heilung", wound: "Entspannende Wunde", center: "HEART" },
    
    // Gates 41-48
    { gate: 41, name: "Die Verringerung", healing: "Verringernde Heilung", wound: "Verringernde Wunde", center: "ROOT" },
    { gate: 42, name: "Das Wachstum", healing: "Wachsende Heilung", wound: "Wachsende Wunde", center: "SOLAR" },
    { gate: 43, name: "Der Durchbruch", healing: "Durchbrechende Heilung", wound: "Durchbrechende Wunde", center: "AJNA" },
    { gate: 44, name: "Die Annäherung", healing: "Annähernde Heilung", wound: "Annähernde Wunde", center: "SPLEEN" },
    { gate: 45, name: "Der Sammler", healing: "Sammelnde Heilung", wound: "Sammelnde Wunde", center: "SOLAR" },
    { gate: 46, name: "Die Liebe zum Körper", healing: "Körperliebende Heilung", wound: "Körperliebende Wunde", center: "G" },
    { gate: 47, name: "Die Verwirrung", healing: "Verwirrende Heilung", wound: "Verwirrende Wunde", center: "AJNA" },
    { gate: 48, name: "Die Tiefe", healing: "Tiefe Heilung", wound: "Tiefe Wunde", center: "SPLEEN" },
    
    // Gates 49-56
    { gate: 49, name: "Die Revolution", healing: "Revolutionäre Heilung", wound: "Revolutionäre Wunde", center: "SOLAR" },
    { gate: 50, name: "Die Werte", healing: "Wertvolle Heilung", wound: "Wertvolle Wunde", center: "SPLEEN" },
    { gate: 51, name: "Die Herausforderung", healing: "Herausfordernde Heilung", wound: "Herausfordernde Wunde", center: "HEART" },
    { gate: 52, name: "Die Stille", healing: "Stille Heilung", wound: "Stille Wunde", center: "ROOT" },
    { gate: 53, name: "Der Beginn", healing: "Beginnende Heilung", wound: "Beginnende Wunde", center: "ROOT" },
    { gate: 54, name: "Die Ambition", healing: "Ehrgeizige Heilung", wound: "Ehrgeizige Wunde", center: "ROOT" },
    { gate: 55, name: "Die Fülle", healing: "Fülle Heilung", wound: "Fülle Wunde", center: "SOLAR" },
    { gate: 56, name: "Der Wanderer", healing: "Wandernde Heilung", wound: "Wandernde Wunde", center: "THROAT" },
    
    // Gates 57-64
    { gate: 57, name: "Die Sanftheit", healing: "Sanfte Heilung", wound: "Sanfte Wunde", center: "SPLEEN" },
    { gate: 58, name: "Die Freude", healing: "Freudige Heilung", wound: "Freudige Wunde", center: "ROOT" },
    { gate: 59, name: "Die Intimität", healing: "Intime Heilung", wound: "Intime Wunde", center: "SACRAL" },
    { gate: 60, name: "Die Einschränkung", healing: "Einschränkende Heilung", wound: "Einschränkende Wunde", center: "ROOT" },
    { gate: 61, name: "Das Mysterium", healing: "Mysteriöse Heilung", wound: "Mysteriöse Wunde", center: "HEAD" },
    { gate: 62, name: "Die Details", healing: "Detailreiche Heilung", wound: "Detailreiche Wunde", center: "THROAT" },
    { gate: 63, name: "Die Zweifel", healing: "Zweifelnde Heilung", wound: "Zweifelnde Wunde", center: "HEAD" },
    { gate: 64, name: "Die Verwirrung", healing: "Verwirrende Heilung", wound: "Verwirrende Wunde", center: "HEAD" }
  ];

  // Alle 9 Centers mit Chiron-Informationen
  const chironCenters = [
    { center: "HEAD", healing: "Inspirationsheilung", wound: "Inspirationswunde", gates: [64, 61, 63] },
    { center: "AJNA", healing: "Verstandesheilung", wound: "Verstandeswunde", gates: [47, 24, 11] },
    { center: "THROAT", healing: "Ausdrucksheilung", wound: "Ausdruckswunde", gates: [62, 23, 56, 16, 20, 31, 33, 8] },
    { center: "G", healing: "Identitätsheilung", wound: "Identitätswunde", gates: [1, 13, 25, 46, 2, 15, 10, 7] },
    { center: "HEART", healing: "Wertheilung", wound: "Wertwunde", gates: [21, 40, 26, 51] },
    { center: "SOLAR", healing: "Emotionsheilung", wound: "Emotionswunde", gates: [36, 22, 37, 6, 49, 55, 30] },
    { center: "SACRAL", healing: "Lebenskraftheilung", wound: "Lebenskraftwunde", gates: [34, 5, 14, 29, 59, 9, 3] },
    { center: "SPLEEN", healing: "Instinktheilung", wound: "Instinktwunde", gates: [48, 57, 44, 50, 32, 28, 18] },
    { center: "ROOT", healing: "Druckheilung", wound: "Druckwunde", gates: [41, 39, 53, 38, 58, 54, 52, 19, 60] }
  ];

  // Gates in Datenbank einfügen
  const insertGate = db.prepare(`
    INSERT OR REPLACE INTO chiron_gates 
    (id, gate_number, name, healing, wound, description, deep_meaning, shadow_aspects, gifts, healing_affirmation, center_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  chironGates.forEach(gate => {
    const id = `chiron_gate_${gate.gate}`;
    const description = `Chiron hier zeigt, wie wir ${gate.wound.toLowerCase()} heilen und ${gate.healing.toLowerCase()} entwickeln.`;
    const deepMeaning = `Die Heilung der ${gate.name} - wie du ${gate.wound.toLowerCase()} heilst und ${gate.healing.toLowerCase()} entwickelst.`;
    const shadowAspects = JSON.stringify([`${gate.name} Blockaden`, "Perfektionismus", "Angst vor Kritik", `${gate.name} Wunden`]);
    const gifts = JSON.stringify([gate.healing, "Künstlerische Begabung", "Inspiration", "Innovative Heilung"]);
    const healingAffirmation = `Ich heile meine ${gate.wound.toLowerCase()} und entwickle ${gate.healing.toLowerCase()}. Meine ${gate.name} ist heilend.`;

    insertGate.run(id, gate.gate, gate.name, gate.healing, gate.wound, description, deepMeaning, shadowAspects, gifts, healingAffirmation, gate.center);
  });

  // Centers in Datenbank einfügen
  const insertCenter = db.prepare(`
    INSERT OR REPLACE INTO chiron_centers 
    (id, center_name, healing, wound, description, deep_meaning, shadow_aspects, gifts, healing_affirmation, gates)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  chironCenters.forEach(center => {
    const id = `chiron_center_${center.center}`;
    const description = `Chiron hier zeigt, wie wir ${center.wound.toLowerCase()} heilen und ${center.healing.toLowerCase()} entwickeln.`;
    const deepMeaning = `Die Heilung des ${center.center} Centers - wie du ${center.wound.toLowerCase()} heilst und ${center.healing.toLowerCase()} entwickelst.`;
    const shadowAspects = JSON.stringify([`${center.center} Blockaden`, "Perfektionismus", "Angst vor Kritik", `${center.center} Wunden`]);
    const gifts = JSON.stringify([center.healing, "Künstlerische Begabung", "Inspiration", "Innovative Heilung"]);
    const healingAffirmation = `Ich heile meine ${center.wound.toLowerCase()} und entwickle ${center.healing.toLowerCase()}. Mein ${center.center} Center ist heilend.`;
    const gates = JSON.stringify(center.gates);

    insertCenter.run(id, center.center, center.healing, center.wound, description, deepMeaning, shadowAspects, gifts, healingAffirmation, gates);
  });

  console.log('[LOCAL-DB] Chiron-Daten erfolgreich initialisiert - 64 Gates und 9 Centers');
  
  // Füge die detaillierten Chiron-Texte hinzu
  addDetailedChironTexts();
}

// Detaillierte Chiron-Texte hinzufügen
function addDetailedChironTexts() {
  console.log('[LOCAL-DB] Füge detaillierte Chiron-Texte hinzu...');
  
  const detailedChironTexts = {
    1: "Du trägst in dir das Drängen, etwas Einzigartiges zu erschaffen – ein Werk, ein Ausdruck, ein Zeichen deines Daseins. Doch zugleich brennt in dir die Angst, dass nichts davon reicht. Die Wunde von Tor 1 ist das Gefühl, dass deine Schöpfung immer zu klein ist für die Größe der Welt.\n\nChiron hier flüstert dir: Dein Schmerz liegt darin, dass du deinen Wert an deinem Werk misst. Du verwechselst dein Sein mit deiner Leistung. Darum reißt es, wenn andere nicht sehen, was du bringst.\n\nDoch in dieser Wunde ruht dein größtes Geschenk. Deine Kreativität ist nicht ein Mittel zum Beweis, sondern ein Fluss, der dich lebendig macht. Wenn du dich erlaubst zu erschaffen, ohne Ergebnis, wird dein Ausdruck zu einer Quelle der Heilung – für dich und für andere.\n\nDeine Heilung geschieht, wenn du dein Schaffen nicht länger an den Applaus koppelst, sondern an das innere Ja. Dann wird dein Ausdruck wahr, und deine Gabe erhellt andere nicht, weil sie groß ist, sondern weil sie echt ist.",
    
    2: "In dir wohnt die Sehnsucht nach Richtung. Doch die Wunde von Tor 2 liegt im Irrtum, dass du sie selbst machen müsstest. So spannst du dich an, planst, führst, treibst – und verlierst dabei den leisen Kompass deines Körpers.\n\nChiron hier zeigt, dass deine Verletzung in der Verwechslung liegt: du glaubst, Sinn sei ein Werk deiner Anstrengung. Dabei bist du nicht der Lenker, sondern die Empfängerin.\n\nDein Geschenk entfaltet sich, wenn du lernst, still zu werden. Wenn du die Wege kommen lässt, statt sie zu erzwingen. Dann erkennst du, dass Richtung nicht aus Leistung entsteht, sondern aus Hingabe.\n\nDie Heilung beginnt, wenn du dem Raum vertraust, der dich trägt. Plötzlich finden dich Menschen, die wie Schlüssel klingen, Arbeit, die sich anfühlt wie Atem, Begegnungen, die deine Straße beleuchten. Deine Gabe ist es, zur Schale zu werden, die nichts hält und in deren Weite alles Platz findet.",
    
    3: "Chaos ist dir vertraut. Pläne brechen, Strukturen fallen, Sicherheiten lösen sich auf – und du spürst die Wunde: das Gefühl, dass mit dir etwas nicht stimmt, weil Ordnung nicht bleibt.\n\nChiron in Tor 3 bringt die Angst, im Chaos verloren zu gehen. Du suchst nach Kontrolle, nach einem festen Halt, und doch entgleitet er dir.\n\nDein Geschenk liegt darin, zu erkennen, dass du nicht das Chaos bist – du bist die, die aus ihm neue Ordnung formt. Jedes Scheitern, jeder Bruch bringt dir Weisheit über das, was trägt.\n\nDie Heilung geschieht, wenn du Fehler nicht länger als Schuld liest, sondern als Samen. Du lernst, dass jeder Zusammenbruch ein Anfang ist, dass jede Verwirrung den Keim neuer Klarheit trägt. So wirst du zur Übersetzerin von Chaos in Form – und andere finden Vertrauen, weil du wagst, wo alles wankt.",
    
    4: "Die Wunde dieses Tores ist das nagende Gefühl, keine Antwort zu haben. Du suchst, du rechnest, du prüfst – und deine Gedanken kreisen, bis der Kopf flimmert. Du glaubst, dass Sicherheit nur dort ist, wo eine Lösung liegt.\n\nDoch Chiron in Tor 4 zeigt: Die Verletzung liegt in der Jagd nach endgültigen Wahrheiten. In dir erwacht die Angst, unzulänglich zu sein, wenn dein Kopf schweigt.\n\nDein Geschenk entfaltet sich, wenn du begreifst: Antworten sind nicht Endpunkte, sondern Brücken. Deine Klarheit liegt nicht darin, alles zu wissen, sondern darin, Fragen zu halten, bis sich Wahrheit zeigt.\n\nDie Heilung kommt, wenn du die Stille zwischen den Gedanken nicht mehr füllst. Dort, im Schweigen, wächst die Antwort, die kein Beweis braucht. Du wirst zur Stimme, die Orientierung schenkt – nicht weil sie alles weiß, sondern weil sie den Mut hat, auch Nicht-Wissen auszuhalten.",
    
    5: "Du spürst die Wunde, wenn dein Leben aus dem Takt fällt. Wenn Routinen zerbrechen, wenn Pläne nicht halten, wenn andere deinen Rhythmus stören. Tief in dir liegt die Sehnsucht nach Verlässlichkeit – und die Angst, dass sie dir nie gegönnt ist.\n\nChiron in Tor 5 bringt die Verletzung, sich dem falschen Takt anpassen zu müssen. Zu früh, zu spät, nie im richtigen Moment. Du glaubst, dass mit dir etwas nicht stimmt, weil du nicht so funktionierst wie die anderen.\n\nDoch dein Geschenk ist dein eigener Rhythmus. Dein Körper kennt den Takt, der dich trägt. Wenn du dich ihm hingibst, wirst du zur Einladung für andere, ihren eigenen Puls zu finden.\n\nDie Heilung geschieht, wenn du anerkennst: Du bist kein Fehler, weil du nicht \"mit der Masse\" schwingst. Dein Rhythmus ist die Wahrheit. Und wenn du ihn lebst, wird er zum Herzschlag für alle, die dich umgeben.",
    
    6: "Deine Wunde zeigt sich dort, wo Nähe und Distanz nicht zusammenpassen. Du fürchtest den Konflikt – und zugleich spürst du, wie er unausweichlich wird. So ziehst du dich zurück oder stürzt dich hinein, und in beiden Fällen bleibt ein Schmerz.\n\nChiron in Tor 6 zeigt, dass die Verletzung in der Angst liegt, deine Gefühle seien zu viel. Dass deine Reibung zerstört, statt Verbindung zu schaffen.\n\nDoch dein Geschenk liegt genau hier: Reibung ist kein Fehler, sie ist der Funke, der Beziehung echt macht. Wenn du deine Gefühle annimmst, werden sie zum Tor, durch das Intimität tiefer wird.\n\nDie Heilung geschieht, wenn du erkennst: Nähe braucht Reibung, damit sie lebendig bleibt. Dein Mut, Gefühle nicht zu glätten, schenkt anderen die Freiheit, ebenso echt zu sein.",
    
    7: "Die Wunde dieses Tores liegt in der Verantwortung. Du spürst den Drang, Richtung zu geben – und zugleich die Angst, andere in die Irre zu führen. Führung lastet schwer auf dir, weil du glaubst, sie müsse perfekt sein.\n\nChiron hier zeigt: Die Verletzung ist die Verwechslung von Führung mit Kontrolle. Du meinst, du müsstest alles wissen, alle Antworten haben, alle schützen.\n\nDoch dein Geschenk liegt darin, dass wahre Führung Zuhören ist. Dass du führst, indem du das Feld spürst, nicht indem du Kommandos gibst.\n\nDie Heilung geschieht, wenn du dich erlaubst, unvollkommen zu sein. Deine Authentizität wird zur Richtung, deine Demut zur Kraft. So wirst du zur Führung, die nicht drückt, sondern hebt.",
    
    8: "Deine Wunde liegt im Gefühl, dass dein Beitrag unsichtbar bleibt. Du fragst dich: Wofür bin ich da? – und fürchtest, dass deine Stimme nie Gewicht haben wird.\n\nChiron in Tor 8 zeigt dir, dass die Verletzung im Vergleichen liegt. Du glaubst, du müsstest so beitragen wie die anderen, um anerkannt zu sein.\n\nDoch dein Geschenk ist deine Einzigartigkeit. Dein Beitrag ist nicht laut, aber unverwechselbar. Er besteht darin, dass du dich selbst einbringst, nicht eine Rolle spielst.\n\nDie Heilung geschieht, wenn du erkennst: Dein Wert liegt nicht im Applaus, sondern im Klang deiner eigenen Note. Dein Beitrag trägt das Ganze, gerade weil er nur von dir kommen kann.",
    
    9: "Deine Wunde liegt im Zersplittern. So viele Aufgaben, so viele Stimmen, so viele Richtungen – und du fühlst dich schuldig, weil du nichts \"zu Ende bringst\". Der Schmerz sitzt tief: das Gefühl, dass deine Kraft zu klein ist für die Welt.\n\nChiron in Tor 9 zeigt, dass die Verletzung im Kampf gegen deine eigene Natur liegt. Du versuchst, alles zu umfassen, und verlierst dich in der Weite.\n\nDoch dein Geschenk liegt in der Fokussierung. Du bist hier, um das Wesentliche zu sehen, den Punkt zu benennen, der zählt. Deine Kraft liegt nicht in der Menge, sondern in der Tiefe.\n\nDie Heilung geschieht, wenn du anerkennst: Du musst nicht alles tragen. Dein Nein schenkt dir Schärfe, dein Ja Tiefe. So wird deine Präsenz zu einer Kraft, die andere bündelt, ohne zu zwingen.",
    
    10: "Die Wunde dieses Tores ist uralt: die Angst, falsch zu sein, so wie du bist. Du hast gelernt, dass Liebe Bedingungen hat, dass Anerkennung vom Verhalten abhängt.\n\nChiron in Tor 10 lässt dich fühlen, dass Selbstliebe keine Selbstverständlichkeit ist. Du suchst nach Spiegeln im Außen, die dir bestätigen sollen, dass du genügst – und findest doch nie genug.\n\nDoch dein Geschenk ist, dass du zur Verkörperung der Selbstliebe werden kannst. Wenn du dich in deiner Eigenheit bejahst, lehrst du andere, dass sie es ebenso dürfen.\n\nDie Heilung geschieht, wenn du erkennst: Dein Wert war nie verhandelbar. Deine Art, zu gehen, zu sprechen, zu atmen, ist genug. Du bist nicht hier, dich zu biegen – du bist hier, ein lebendiges Ja zu dir selbst zu sein.",
    
    11: "Deine Wunde liegt in den unzähligen Bildern, die dein Geist dir schenkt. Ideen, Visionen, Konzepte – und die Angst, dass sie nicht gehört oder verstanden werden. Vielleicht hast du erlebt, dass deine Gedanken belächelt oder übergangen wurden.\n\nChiron in Tor 11 zeigt: Die Verletzung ist der Zweifel am Wert deiner Bilder. Du fragst dich, ob deine Ideen zu naiv, zu bunt, zu unrealistisch sind.\n\nDoch dein Geschenk liegt darin, dass deine Bilder Nahrung sind. Du gibst dem Leben neue Perspektiven, die andere bereichern. Deine Ideen müssen nicht alle umgesetzt werden – sie sind Inspiration, die Samen streut.\n\nDie Heilung geschieht, wenn du deine Visionen teilst, ohne Garantie. Dann werden deine Bilder zum Geschenk – nicht weil sie beweisen, sondern weil sie erinnern, dass mehr möglich ist.",
    
    12: "Du kennst die Zerrissenheit zwischen Schweigen und Sprechen. Die Wunde dieses Tores liegt im Gefühl, dass deine Stimme entweder zu viel oder zu wenig ist. Du hältst dich zurück, aus Angst, verletzt oder abgelehnt zu werden.\n\nChiron in Tor 12 zeigt, dass deine Verletzung in der Unsicherheit liegt, wann dein Ausdruck willkommen ist. Du schwankst zwischen Zurückhaltung und dem Drang, alles herauszuschleudern.\n\nDoch dein Geschenk liegt in deiner Unterscheidung. Du spürst, wann Worte Gewicht haben, wann ein Satz eine ganze Welt bewegen kann.\n\nDie Heilung geschieht, wenn du anerkennst: Dein Schweigen ist nicht Leere, sondern Vorbereitung. Deine Stimme ist nicht zu viel, sie ist Medizin, wenn sie im richtigen Moment kommt. So wirst du zur Stimme, die Herzen berührt, weil sie echt und behutsam ist.",
    
    13: "Deine Wunde liegt in den Geschichten, die du hörst und trägst. Oft hast du mehr aufgenommen, als dir guttat – Geheimnisse, Kummer, Worte, die schwer auf deiner Brust lasten. Du spürst die Last der Vergangenheit anderer und glaubst, sie allein tragen zu müssen.\n\nChiron in Tor 13 zeigt: Die Verletzung liegt darin, dass du zum stillen Zeugen wirst, ohne deine eigene Stimme. Du hörst alles, aber fühlst dich unsichtbar.\n\nDoch dein Geschenk ist tief: Du bist hier, um durch Zuhören Heilung zu schenken. Dein Ohr ist wie ein Gefäß, das Schmerz wandelt, wenn er ausgesprochen wird.\n\nDie Heilung geschieht, wenn du erkennst: Du bist nicht hier, alles für andere zu halten. Deine Aufgabe ist nicht, dich zu verlieren, sondern Räume zu öffnen, in denen Wahrheit klingen darf. So wird dein Zuhören zu einem Heiligtum, in dem andere sich selbst erkennen.",
    
    14: "Deine Wunde liegt im Gefühl, nie genug zu haben – nicht genug Geld, Zeit, Kraft, Einfluss. Vielleicht hast du erlebt, dass deine Gaben klein gemacht oder deine Sehnsucht nach Fülle beschämt wurde.\n\nChiron in Tor 14 zeigt: Die Verletzung ist die Angst, abhängig oder leer zu sein. Du glaubst, dein Wert hinge an dem, was du anhäufst oder kontrollierst.\n\nDoch dein Geschenk ist die Erinnerung: wahre Fülle fließt durch dich, nicht zu dir. Deine Kraft ist ein Magnet für Ressourcen, wenn du dich mit deiner Freude verbindest.\n\nDie Heilung geschieht, wenn du aufhörst, Mangel zu bekämpfen, und stattdessen beginnst, dich dem Überfluss des Lebens zu öffnen. Du wirst zur Quelle, die andere nährt – nicht weil du alles hast, sondern weil du alles fließen lässt.",
    
    15: "Du trägst die Wunde der Extreme: mal zu viel, mal zu wenig, nie im Maß der anderen. Du fühlst dich falsch, weil dein Takt nicht dem entspricht, was man erwartet.\n\nChiron in Tor 15 zeigt: Die Verletzung liegt im Urteil über deine Natur. Du glaubst, du müsstest dich anpassen, um liebenswert zu sein.\n\nDoch dein Geschenk ist deine Menschlichkeit. Du bist hier, die Vielfalt auszuhalten, die Gegensätze, die Übertreibungen – und daraus Liebe zu weben.\n\nDie Heilung geschieht, wenn du erkennst: Deine Extreme sind kein Fehler. Sie sind Spiegel, in denen andere ihre eigene Menschlichkeit erkennen. In deinem Ja zu dir selbst finden sie Erlaubnis für ihre Eigenart.",
    
    16: "Deine Wunde liegt im Zweifel an deinem Talent. Du willst wirken, spielen, dich ausdrücken – und fürchtest doch, nicht gut genug zu sein. Jede Kritik trifft dich tiefer als du zeigen magst.\n\nChiron in Tor 16 zeigt: Die Verletzung ist der Glaube, dass Freude nur dann zählt, wenn sie makellos ist. Du setzt deine Begeisterung unter den Druck des Perfekten.\n\nDoch dein Geschenk liegt darin, dass deine Freude ansteckend ist. Dein Spiel ist Heilung, gerade weil es nicht fehlerfrei ist. Deine Begeisterung erweckt andere zum Leben.\n\nDie Heilung geschieht, wenn du dir erlaubst, aus purer Lust zu spielen, nicht aus Angst vor Bewertung. Dann wird dein Ausdruck zu einer Medizin, die Leichtigkeit in jede Schwere trägt."
  };
  
  // Update die bestehenden Gates mit den detaillierten Texten
  const updateGate = db.prepare(`
    UPDATE chiron_gates 
    SET deep_meaning = ?, description = ?
    WHERE gate_number = ?
  `);
  
  Object.entries(detailedChironTexts).forEach(([gateNumber, text]) => {
    const gateNum = parseInt(gateNumber);
    const shortDescription = `Chiron bewusst – Tor ${gateNum}: ${text.split('\n')[0].substring(0, 100)}...`;
    
    updateGate.run(text, shortDescription, gateNum);
  });
  
  console.log('[LOCAL-DB] Detaillierte Chiron-Texte erfolgreich hinzugefügt');
}

// Alle Planeten-Daten initialisieren
function initializeAllPlanetsData() {
  console.log('[LOCAL-DB] Initialisiere alle Planeten-Daten...');
  
  // Planet-Grundinformationen
  const planetInfos = [
    { name: "Sonne", symbol: "☉", orbitalPeriod: "365.25 Tage", discovery: "Seit Anbeginn der Zeit", mythology: "Das Zentrum des Bewusstseins", color: "#FFD700", description: "Die Sonne repräsentiert unser wahres Selbst, unsere Essenz und unser Bewusstsein. Sie zeigt, wer wir wirklich sind und was uns antreibt." },
    { name: "Mond", symbol: "☽", orbitalPeriod: "27.3 Tage", discovery: "Seit Anbeginn der Zeit", mythology: "Der Spiegel der Seele", color: "#C0C0C0", description: "Der Mond repräsentiert unsere Emotionen, Instinkte und unser Unterbewusstsein. Er zeigt, wie wir uns fühlen und reagieren." },
    { name: "Merkur", symbol: "☿", orbitalPeriod: "88 Tage", discovery: "Seit Anbeginn der Zeit", mythology: "Der Bote der Götter", color: "#87CEEB", description: "Merkur repräsentiert Kommunikation, Denken und Lernen. Er zeigt, wie wir Informationen verarbeiten und ausdrücken." },
    { name: "Venus", symbol: "♀", orbitalPeriod: "225 Tage", discovery: "Seit Anbeginn der Zeit", mythology: "Die Göttin der Liebe", color: "#FFB6C1", description: "Venus repräsentiert Liebe, Schönheit und Werte. Sie zeigt, was wir schätzen und wie wir Beziehungen gestalten." },
    { name: "Mars", symbol: "♂", orbitalPeriod: "687 Tage", discovery: "Seit Anbeginn der Zeit", mythology: "Der Gott des Krieges", color: "#FF4500", description: "Mars repräsentiert Energie, Aktion und Durchsetzung. Er zeigt, wie wir unsere Ziele verfolgen und kämpfen." },
    { name: "Jupiter", symbol: "♃", orbitalPeriod: "12 Jahre", discovery: "Seit Anbeginn der Zeit", mythology: "Der König der Götter", color: "#DAA520", description: "Jupiter repräsentiert Expansion, Weisheit und Optimismus. Er zeigt, wie wir wachsen und uns entwickeln." },
    { name: "Saturn", symbol: "♄", orbitalPeriod: "29 Jahre", discovery: "Seit Anbeginn der Zeit", mythology: "Der Lehrer", color: "#B0C4DE", description: "Saturn repräsentiert Struktur, Disziplin und Verantwortung. Er zeigt, wo wir lernen und reifen müssen." },
    { name: "Uranus", symbol: "♅", orbitalPeriod: "84 Jahre", discovery: "1781", mythology: "Der Revolutionär", color: "#00CED1", description: "Uranus repräsentiert Revolution, Innovation und Freiheit. Er zeigt, wo wir brechen und Neues erschaffen." },
    { name: "Neptun", symbol: "♆", orbitalPeriod: "165 Jahre", discovery: "1846", mythology: "Der Mystiker", color: "#4169E1", description: "Neptun repräsentiert Spiritualität, Illusion und Verbindung. Er zeigt, wo wir spirituell wachsen und uns verbinden." },
    { name: "Pluto", symbol: "♇", orbitalPeriod: "248 Jahre", discovery: "1930", mythology: "Der Transformator", color: "#8B008B", description: "Pluto repräsentiert Transformation, Macht und Regeneration. Er zeigt, wo wir sterben und wiedergeboren werden." },
    { name: "Chiron", symbol: "⚡", orbitalPeriod: "50.7 Jahre", discovery: "1977", mythology: "Der verwundete Heiler", color: "#FF6B6B", description: "Chiron repräsentiert unsere tiefsten Wunden und unsere Fähigkeit, andere zu heilen. Er zeigt, wo wir verletzt wurden und wo wir anderen helfen können." },
    { name: "Lilith", symbol: "⚸", orbitalPeriod: "4.1 Jahre", discovery: "1884", mythology: "Die wilde Göttin", color: "#8B008B", description: "Lilith repräsentiert unsere wilde, unabhängige Seite und zeigt, wo wir uns von gesellschaftlichen Erwartungen befreien müssen." },
    { name: "Black Moon Lilith", symbol: "⚸", orbitalPeriod: "8.85 Jahre", discovery: "Berechnet seit der Antike", mythology: "Die dunkle Göttin der Unabhängigkeit", color: "#2D1B69", description: "Black Moon Lilith ist der apogäische Punkt des Mondes. Sie repräsentiert unsere verdrängte, wilde, unabhängige Seite und zeigt, wo wir uns von gesellschaftlichen Erwartungen befreien müssen." }
  ];

  // Alle 64 Gates mit Namen
  const allGates = [
    { gate: 1, name: "Kreativität", center: "G" },
    { gate: 2, name: "Empfänglichkeit", center: "G" },
    { gate: 3, name: "Beginn", center: "SACRAL" },
    { gate: 4, name: "Jugendliche Torheit", center: "AJNA" },
    { gate: 5, name: "Warten", center: "SACRAL" },
    { gate: 6, name: "Konflikt", center: "SOLAR" },
    { gate: 7, name: "Die Rolle des Selbst", center: "G" },
    { gate: 8, name: "Haltung", center: "THROAT" },
    { gate: 9, name: "Fokus", center: "SACRAL" },
    { gate: 10, name: "Selbstliebe", center: "G" },
    { gate: 11, name: "Frieden", center: "AJNA" },
    { gate: 12, name: "Vorsicht", center: "THROAT" },
    { gate: 13, name: "Der Zuhörer", center: "G" },
    { gate: 14, name: "Die Kraft", center: "SACRAL" },
    { gate: 15, name: "Bescheidenheit", center: "G" },
    { gate: 16, name: "Enthusiasmus", center: "THROAT" },
    { gate: 17, name: "Folgen", center: "AJNA" },
    { gate: 18, name: "Korrektur", center: "SPLEEN" },
    { gate: 19, name: "Annäherung", center: "ROOT" },
    { gate: 20, name: "Das Jetzt", center: "THROAT" },
    { gate: 21, name: "Kontrolle", center: "HEART" },
    { gate: 22, name: "Anmut", center: "SOLAR" },
    { gate: 23, name: "Aufspaltung", center: "THROAT" },
    { gate: 24, name: "Rückkehr", center: "AJNA" },
    { gate: 25, name: "Unschuld", center: "G" },
    { gate: 26, name: "Der Egoist", center: "HEART" },
    { gate: 27, name: "Die Fürsorge", center: "SACRAL" },
    { gate: 28, name: "Das Spiel", center: "SPLEEN" },
    { gate: 29, name: "Die Entschlossenheit", center: "SACRAL" },
    { gate: 30, name: "Die Gefühle", center: "SOLAR" },
    { gate: 31, name: "Der Einfluss", center: "THROAT" },
    { gate: 32, name: "Die Dauer", center: "SPLEEN" },
    { gate: 33, name: "Die Flucht", center: "THROAT" },
    { gate: 34, name: "Die Kraft", center: "SACRAL" },
    { gate: 35, name: "Der Fortschritt", center: "SOLAR" },
    { gate: 36, name: "Die Krise", center: "SOLAR" },
    { gate: 37, name: "Die Freundschaft", center: "SOLAR" },
    { gate: 38, name: "Der Kämpfer", center: "ROOT" },
    { gate: 39, name: "Die Provokation", center: "ROOT" },
    { gate: 40, name: "Die Entspannung", center: "HEART" },
    { gate: 41, name: "Die Verringerung", center: "ROOT" },
    { gate: 42, name: "Das Wachstum", center: "SOLAR" },
    { gate: 43, name: "Der Durchbruch", center: "AJNA" },
    { gate: 44, name: "Die Annäherung", center: "SPLEEN" },
    { gate: 45, name: "Der Sammler", center: "SOLAR" },
    { gate: 46, name: "Die Liebe zum Körper", center: "G" },
    { gate: 47, name: "Die Verwirrung", center: "AJNA" },
    { gate: 48, name: "Die Tiefe", center: "SPLEEN" },
    { gate: 49, name: "Die Revolution", center: "SOLAR" },
    { gate: 50, name: "Die Werte", center: "SPLEEN" },
    { gate: 51, name: "Die Herausforderung", center: "HEART" },
    { gate: 52, name: "Die Stille", center: "ROOT" },
    { gate: 53, name: "Der Beginn", center: "ROOT" },
    { gate: 54, name: "Die Ambition", center: "ROOT" },
    { gate: 55, name: "Die Fülle", center: "SOLAR" },
    { gate: 56, name: "Der Wanderer", center: "THROAT" },
    { gate: 57, name: "Die Sanftheit", center: "SPLEEN" },
    { gate: 58, name: "Die Freude", center: "ROOT" },
    { gate: 59, name: "Die Intimität", center: "SACRAL" },
    { gate: 60, name: "Die Einschränkung", center: "ROOT" },
    { gate: 61, name: "Das Mysterium", center: "HEAD" },
    { gate: 62, name: "Die Details", center: "THROAT" },
    { gate: 63, name: "Die Zweifel", center: "HEAD" },
    { gate: 64, name: "Die Verwirrung", center: "HEAD" }
  ];

  // Alle 9 Centers
  const allCenters = [
    { center: "HEAD", gates: [64, 61, 63] },
    { center: "AJNA", gates: [47, 24, 11] },
    { center: "THROAT", gates: [62, 23, 56, 16, 20, 31, 33, 8] },
    { center: "G", gates: [1, 13, 25, 46, 2, 15, 10, 7] },
    { center: "HEART", gates: [21, 40, 26, 51] },
    { center: "SOLAR", gates: [36, 22, 37, 6, 49, 55, 30] },
    { center: "SACRAL", gates: [34, 5, 14, 29, 59, 9, 3] },
    { center: "SPLEEN", gates: [48, 57, 44, 50, 32, 28, 18] },
    { center: "ROOT", gates: [41, 39, 53, 38, 58, 54, 52, 19, 60] }
  ];

  // Planet-Info in Datenbank einfügen
  const insertPlanetInfo = db.prepare(`
    INSERT OR REPLACE INTO planet_info 
    (id, planet_name, symbol, orbital_period, discovery, mythology, color, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  planetInfos.forEach(planet => {
    const id = `planet_${planet.name.toLowerCase()}`;
    insertPlanetInfo.run(id, planet.name, planet.symbol, planet.orbitalPeriod, planet.discovery, planet.mythology, planet.color, planet.description);
  });

  // Planet-Gates in Datenbank einfügen
  const insertPlanetGate = db.prepare(`
    INSERT OR REPLACE INTO planet_gates 
    (id, planet_name, gate_number, name, essence, consciousness, description, deep_meaning, shadow_aspects, gifts, affirmation, center_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  planetInfos.forEach(planet => {
    allGates.forEach(gate => {
      const id = `${planet.name.toLowerCase()}_gate_${gate.gate}`;
      const essence = `${planet.name} ${gate.name}`;
      const consciousness = `${planet.name} Bewusstsein in ${gate.name}`;
      const description = `${planet.name} hier zeigt, wie wir ${gate.name.toLowerCase()} entwickeln und nutzen.`;
      const deepMeaning = `Die ${planet.name} Energie in ${gate.name} - wie du ${gate.name.toLowerCase()} mit ${planet.name} Kraft entwickelst.`;
      const shadowAspects = JSON.stringify([`${gate.name} Blockaden`, "Perfektionismus", "Angst vor Kritik", `${gate.name} Wunden`]);
      const gifts = JSON.stringify([`${planet.name} ${gate.name}`, "Künstlerische Begabung", "Inspiration", "Innovative Lösungen"]);
      const affirmation = `Ich entwickle ${gate.name.toLowerCase()} mit ${planet.name} Kraft. Meine ${gate.name} ist ${planet.name.toLowerCase()}.`;

      insertPlanetGate.run(id, planet.name, gate.gate, gate.name, essence, consciousness, description, deepMeaning, shadowAspects, gifts, affirmation, gate.center);
    });
  });

  // Planet-Centers in Datenbank einfügen
  const insertPlanetCenter = db.prepare(`
    INSERT OR REPLACE INTO planet_centers 
    (id, planet_name, center_name, essence, consciousness, description, deep_meaning, shadow_aspects, gifts, affirmation, gates)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  planetInfos.forEach(planet => {
    allCenters.forEach(center => {
      const id = `${planet.name.toLowerCase()}_center_${center.center}`;
      const essence = `${planet.name} ${center.center}`;
      const consciousness = `${planet.name} Bewusstsein im ${center.center} Center`;
      const description = `${planet.name} hier zeigt, wie wir das ${center.center} Center entwickeln und nutzen.`;
      const deepMeaning = `Die ${planet.name} Energie im ${center.center} Center - wie du das ${center.center} Center mit ${planet.name} Kraft entwickelst.`;
      const shadowAspects = JSON.stringify([`${center.center} Blockaden`, "Perfektionismus", "Angst vor Kritik", `${center.center} Wunden`]);
      const gifts = JSON.stringify([`${planet.name} ${center.center}`, "Künstlerische Begabung", "Inspiration", "Innovative Lösungen"]);
      const affirmation = `Ich entwickle das ${center.center} Center mit ${planet.name} Kraft. Mein ${center.center} Center ist ${planet.name.toLowerCase()}.`;
      const gates = JSON.stringify(center.gates);

      insertPlanetCenter.run(id, planet.name, center.center, essence, consciousness, description, deepMeaning, shadowAspects, gifts, affirmation, gates);
    });
  });

  console.log('[LOCAL-DB] Alle Planeten-Daten erfolgreich initialisiert - 11 Planeten, 64 Gates, 9 Centers');
  
  // Mercury-spezifische Daten für Tor 1 hinzufügen
  initializeMercurySpecificData();
}

// Mercury-spezifische Daten initialisieren
function initializeMercurySpecificData() {
  console.log('[LOCAL-DB] Initialisiere Mercury-spezifische Daten...');
  
  const insertMercuryGate = db.prepare(`
    INSERT OR REPLACE INTO planet_gates 
    (id, planet_name, gate_number, name, essence, consciousness, description, deep_meaning, shadow_aspects, gifts, affirmation, center_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Tor 1 - Kreativität (Mercury-spezifisch)
  const mercuryGate1 = {
    id: 'mercury_gate_1',
    planet_name: 'Mercury',
    gate_number: 1,
    name: 'Kreativität',
    essence: 'Die schöpferische Stimme in dir - Unbewusste Kreativität durch authentischen Ausdruck',
    consciousness: 'Kommunikation als Selbstvergewisserung - Bewusste Kreativität durch strategische Positionierung',
    description: 'Tor 1 im bewussten Merkur: Dein Ausdruck ist kein Nebeneffekt – er ist deine Lebensader. Du erschaffst nicht nur Sätze – du erschaffst dich selbst in dem Moment, in dem du sprichst.',
    deep_meaning: 'Der Tanz zwischen Stille und Sprache: Zu lange in der Stille – und du fühlst dich abgeschnitten. Zu viel Ausdruck ohne Tiefe – und du fühlst dich leer. Der Schlüssel liegt im Rhythmus: Dem Wechselspiel aus Hören und Sprechen, aus Sammeln und Teilen.',
    shadow_aspects: JSON.stringify([
      'Du formulierst so, dass du gefällst, nicht dass du echt bist',
      'Du weichst ab, um nicht anzuecken – und verlierst deine Klarheit',
      'Du schweigst, wenn deine Worte unbequem wären',
      'Du übernimmst den Ausdruck anderer, bis deine eigene Stimme verkümmert'
    ]),
    gifts: JSON.stringify([
      'Unverwechselbare sprachliche Signatur',
      'Kreativer Ausdruck als Marktposition',
      'Kommunikation als Verkaufshebel',
      'Authentizität als Business-Vorteil'
    ]),
    affirmation: 'Ich erschaffe durch meine Worte. Meine Sprache ist mein Markenzeichen.',
    center_name: 'G'
  };

  insertMercuryGate.run(
    mercuryGate1.id,
    mercuryGate1.planet_name,
    mercuryGate1.gate_number,
    mercuryGate1.name,
    mercuryGate1.essence,
    mercuryGate1.consciousness,
    mercuryGate1.description,
    mercuryGate1.deep_meaning,
    mercuryGate1.shadow_aspects,
    mercuryGate1.gifts,
    mercuryGate1.affirmation,
    mercuryGate1.center_name
  );

  // Tor 2 - Empfang (Mercury-spezifisch)
  const mercuryGate2 = {
    id: 'mercury_gate_2',
    planet_name: 'Mercury',
    gate_number: 2,
    name: 'Empfang',
    essence: 'Die innere Stimme, die den Weg kennt - Unbewusste Navigation durch klare Orientierung',
    consciousness: 'Sprache als strategischer Kompass - Bewusste Navigation durch Positionierung',
    description: 'Tor 2 im bewussten Merkur: Deine Sprache ist wie ein innerer Nordstern. Sie ordnet, strukturiert, lenkt – nicht, weil du laut bist, sondern weil deine Worte aus einer tiefen, inneren Orientierung kommen.',
    deep_meaning: 'Der Tanz zwischen Zuhören und Lenken: Sprichst du zu früh, fehlt deinen Worten Tiefe. Sprichst du zu spät, fehlt anderen der Anker, den sie brauchen.',
    shadow_aspects: JSON.stringify([
      'Du redest, um niemandem zu widersprechen',
      'Du gibst keine klare Richtung, um nicht in Verantwortung zu geraten',
      'Du bleibst vage, um alle Optionen offen zu halten',
      'Du verlierst deine innere Orientierung und führst in die Irre'
    ]),
    gifts: JSON.stringify([
      'Strategische Navigation durch Sprache',
      'Positionierung durch Klarheit',
      'Führung durch Orientierung',
      'Kompass für Business-Richtung'
    ]),
    affirmation: 'Ich spreche aus Klarheit. Meine Worte geben meinem Business Richtung.',
    center_name: "G"
  };

  insertMercuryGate.run(
    mercuryGate2.id,
    mercuryGate2.planet_name,
    mercuryGate2.gate_number,
    mercuryGate2.name,
    mercuryGate2.essence,
    mercuryGate2.consciousness,
    mercuryGate2.description,
    mercuryGate2.deep_meaning,
    mercuryGate2.shadow_aspects,
    mercuryGate2.gifts,
    mercuryGate2.affirmation,
    mercuryGate2.center_name
  );

  // Tor 3 - Anfang (Mercury-spezifisch)
  const mercuryGate3 = {
    id: 'mercury_gate_3',
    planet_name: 'Mercury',
    gate_number: 3,
    name: 'Anfang',
    essence: 'Die Stimme, die Klarheit schafft - Unbewusste Strukturierung durch Ordnung',
    consciousness: 'Sprache als Strukturgeber im Business - Bewusste Strukturierung durch Klarheit',
    description: 'Tor 3 im bewussten Merkur: Du kannst Ungeordnetes, Rohes, Unfertiges in eine Form bringen, die verständlich und umsetzbar ist. Du bist der Moment, in dem ein verwirrendes Knäuel an Gedanken plötzlich eine klare Linie wird.',
    deep_meaning: 'Der Tanz zwischen Offenheit und Struktur: zu viel Struktur zu früh – und die Lebendigkeit erstickt. zu wenig Struktur – und die Möglichkeiten zerfallen ins Chaos. Deine Aufgabe ist es, die Mitte zu finden.',
    shadow_aspects: JSON.stringify([
      'Du presst Dinge zu früh in Formen',
      'Du formulierst vorschnell, ohne alle Informationen',
      'Du benutzt Struktur, um Unsicherheit zu vermeiden',
      'Du überstrukturierst und nimmst deiner Botschaft die Lebendigkeit'
    ]),
    gifts: JSON.stringify([
      'Strukturierung komplexer Prozesse',
      'Klarheitseffekt in Marketing',
      'Positionierung durch Struktur',
      'Kommunikation als Ordnungswerkzeug'
    ]),
    affirmation: 'Ich bringe Ordnung ins Chaos. Meine Kommunikation bringt Struktur ins Angebot.',
    center_name: "G"
  };

  insertMercuryGate.run(
    mercuryGate3.id,
    mercuryGate3.planet_name,
    mercuryGate3.gate_number,
    mercuryGate3.name,
    mercuryGate3.essence,
    mercuryGate3.consciousness,
    mercuryGate3.description,
    mercuryGate3.deep_meaning,
    mercuryGate3.shadow_aspects,
    mercuryGate3.gifts,
    mercuryGate3.affirmation,
    mercuryGate3.center_name
  );

  // Tor 4 - Antwort (Mercury-spezifisch)
  const mercuryGate4 = {
    id: 'mercury_gate_4',
    planet_name: 'Mercury',
    gate_number: 4,
    name: 'Antwort',
    essence: 'Der innere Analytiker in dir - Unbewusste Logik durch durchdachte Antworten',
    consciousness: 'Sprache als Vertrauensanker - Bewusste Logik durch präzise Kommunikation',
    description: 'Tor 4 im bewussten Merkur: Du lebt in dir eine natürliche Tendenz, Dinge zu durchdenken, zu durchleuchten und so zu formulieren, dass sie für dich und andere Sinn ergeben. Es ist, als würdest du mit jedem Satz ein kleines Stück Unsicherheit aus der Welt schaffen.',
    deep_meaning: 'Der Tanz zwischen Analyse und Ausdruck: Zu viel Nachdenken – und deine Worte kommen zu spät. Zu wenig Klarheit – und sie sind nicht präzise genug. Tor 4 will, dass du eine Sprache findest, die durchdacht und zugänglich ist.',
    shadow_aspects: JSON.stringify([
      'Du sprichst nur, um recht zu haben',
      'Du überforderst andere mit zu viel Logik',
      'Du wartest so lange auf die perfekte Antwort, dass du gar nichts mehr sagst',
      'Du verlierst dich in Details und erschlägst Kunden mit Informationen'
    ]),
    gifts: JSON.stringify([
      'Übersetzung komplexer Probleme in verständliche Lösungen',
      'Vertrauen durch Logik',
      'Positionierung durch Klarheit',
      'Marketing mit Argumentationskraft'
    ]),
    affirmation: 'Ich bringe Logik in meine Worte. Ich übersetze komplexe Probleme in verständliche Lösungen.',
    center_name: "G"
  };

  insertMercuryGate.run(
    mercuryGate4.id,
    mercuryGate4.planet_name,
    mercuryGate4.gate_number,
    mercuryGate4.name,
    mercuryGate4.essence,
    mercuryGate4.consciousness,
    mercuryGate4.description,
    mercuryGate4.deep_meaning,
    mercuryGate4.shadow_aspects,
    mercuryGate4.gifts,
    mercuryGate4.affirmation,
    mercuryGate4.center_name
  );

  // Tor 5 - Warten (Mercury-spezifisch)
  const mercuryGate5 = {
    id: 'mercury_gate_5',
    planet_name: 'Mercury',
    gate_number: 5,
    name: 'Warten',
    essence: 'Die Stimme, die Ordnung durch Rhythmus gibt - Unbewusste Stabilität durch wiederkehrende Muster',
    consciousness: 'Sprache als Taktgeber für dein Business - Bewusste Stabilität durch Beständigkeit',
    description: 'Tor 5 im bewussten Merkur: Deine Kommunikation hat einen Pulsschlag. Du drückst dich nicht chaotisch aus – du baust innere und äußere Rhythmen in deine Sprache ein. Deine Worte geben Halt, weil sie nicht nur Inhalt, sondern auch Verlässlichkeit transportieren.',
    deep_meaning: 'Der Tanz zwischen Struktur und Spontanität: Zu viel Struktur: Deine Worte wirken starr und vorhersehbar. Zu wenig Struktur: Deine Botschaften verlieren an Klarheit und Halt. Tor 5 erinnert dich daran, den Rahmen so stabil zu halten, dass er Sicherheit gibt.',
    shadow_aspects: JSON.stringify([
      'Du wiederholst alte Aussagen, obwohl sie dich nicht mehr repräsentieren',
      'Du klammerst dich an Formulierungen, weil sie sich "bewährt" haben',
      'Du vermeidest Neues, um den Takt nicht zu verlieren',
      'Du wiederholst dich so sehr, dass es stagnierend wirkt'
    ]),
    gifts: JSON.stringify([
      'Vertrauen durch Beständigkeit',
      'Positionierung durch Wiedererkennbarkeit',
      'Marketing mit Kontinuitätseffekt',
      'Kommunikation als Stabilitätsgeber'
    ]),
    affirmation: 'Ich spreche im Rhythmus. Meine Kommunikation gibt meinem Business Struktur.',
    center_name: "SACRAL"
  };

  insertMercuryGate.run(
    mercuryGate5.id,
    mercuryGate5.planet_name,
    mercuryGate5.gate_number,
    mercuryGate5.name,
    mercuryGate5.essence,
    mercuryGate5.consciousness,
    mercuryGate5.description,
    mercuryGate5.deep_meaning,
    mercuryGate5.shadow_aspects,
    mercuryGate5.gifts,
    mercuryGate5.affirmation,
    mercuryGate5.center_name
  );

  // Tor 6 - Konflikt (Mercury-spezifisch)
  const mercuryGate6 = {
    id: 'mercury_gate_6',
    planet_name: 'Mercury',
    gate_number: 6,
    name: 'Konflikt',
    essence: 'Die Stimme, die Verbindung steuert - Unbewusste Nähe durch bewusste Grenzen',
    consciousness: 'Sprache als Qualitätsfilter - Bewusste Nähe durch selektive Kommunikation',
    description: 'Tor 6 im bewussten Merkur: Deine Kommunikation hat eine besondere Schwelle. Sie kann Nähe herstellen – oder Grenzen ziehen. Du spürst genau, wann der Moment reif ist, und wann es klüger ist, zu schweigen. Deine Worte sind wie Schlüssel: Manche öffnen Türen, manche verriegeln sie.',
    deep_meaning: 'Der Tanz zwischen Offenheit und Schutz: Zu viel Schutz: Du hältst Distanz, auch wenn Nähe möglich wäre. Zu viel Offenheit: Du lässt alles durch, ohne Filter, und verlierst Energie. Deine Kunst ist es, diesen Filter bewusst einzusetzen – nicht aus Angst, sondern aus Klarheit.',
    shadow_aspects: JSON.stringify([
      'Du hältst Informationen zurück, um Kontrolle zu behalten',
      'Du öffnest dich in unpassenden Momenten',
      'Du sprichst, um Nähe zu erzwingen, statt sie wachsen zu lassen',
      'Du bist zu vage, um die richtigen Kunden anzuziehen'
    ]),
    gifts: JSON.stringify([
      'Qualitätsfilter durch Sprache',
      'Positionierung durch Selektion',
      'Marketing mit Resonanzqualität',
      'Kommunikation als Tor'
    ]),
    affirmation: 'Ich spreche als Torhüter. Meine Kommunikation entscheidet, wer den Raum betritt.',
    center_name: "SOLAR"
  };

  insertMercuryGate.run(
    mercuryGate6.id,
    mercuryGate6.planet_name,
    mercuryGate6.gate_number,
    mercuryGate6.name,
    mercuryGate6.essence,
    mercuryGate6.consciousness,
    mercuryGate6.description,
    mercuryGate6.deep_meaning,
    mercuryGate6.shadow_aspects,
    mercuryGate6.gifts,
    mercuryGate6.affirmation,
    mercuryGate6.center_name
  );

  // Tor 7 - Armee (Mercury-spezifisch)
  const mercuryGate7 = {
    id: 'mercury_gate_7',
    planet_name: 'Mercury',
    gate_number: 7,
    name: 'Armee',
    essence: 'Die Stimme, die den Kurs hält - Unbewusste Führung durch klare Orientierung',
    consciousness: 'Sprache als Leadership-Tool - Bewusste Führung durch klare Kommunikation',
    description: 'Tor 7 im bewussten Merkur: Deine Kommunikation besitzt eine natürliche Führungsqualität. Du brauchst keine Machtposition, um Einfluss zu haben – deine Worte sind die Autorität. Es ist nicht die Lautstärke, die dich leitet, sondern die Klarheit, mit der du deine Gedanken formulierst.',
    deep_meaning: 'Der Tanz zwischen Zuhören und Lenken: Zu viel Führung: Du übernimmst Verantwortung, bevor sie gefragt ist. Zu wenig Führung: Du hältst dich zurück, obwohl deine Worte helfen würden. Die Kunst liegt darin, erst zu hören, dann zu sprechen – und das Gesagte als klare Richtung zu setzen.',
    shadow_aspects: JSON.stringify([
      'Du setzt Richtung, ohne Rücksicht auf andere Stimmen',
      'Du hältst an einem Kurs fest, obwohl er nicht mehr passt',
      'Du passt deine Worte so an, dass du Führung vermeidest',
      'Du wirkst zu bestimmend und schreckt damit potenzielle Partner ab'
    ]),
    gifts: JSON.stringify([
      'Führung durch klare Kommunikation',
      'Positionierung durch klare Richtung',
      'Marketing mit Führungscharakter',
      'Kommunikation als Führungsinstrument'
    ]),
    affirmation: 'Ich leite durch meine Worte. Meine Worte positionieren mich als Leader.',
    center_name: "G"
  };

  insertMercuryGate.run(
    mercuryGate7.id,
    mercuryGate7.planet_name,
    mercuryGate7.gate_number,
    mercuryGate7.name,
    mercuryGate7.essence,
    mercuryGate7.consciousness,
    mercuryGate7.description,
    mercuryGate7.deep_meaning,
    mercuryGate7.shadow_aspects,
    mercuryGate7.gifts,
    mercuryGate7.affirmation,
    mercuryGate7.center_name
  );

  // Tor 8 - Beteiligung (Mercury-spezifisch)
  const mercuryGate8 = {
    id: 'mercury_gate_8',
    planet_name: 'Mercury',
    gate_number: 8,
    name: 'Beteiligung',
    essence: 'Die Stimme, die Individualität teilt - Unbewusste Einzigartigkeit durch authentischen Ausdruck',
    consciousness: 'Sprache als Differenzierungsfaktor - Bewusste Einzigartigkeit durch unverwechselbare Stimme',
    description: 'Tor 8 im bewussten Merkur: Du trägst die Fähigkeit in dir, deinen eigenen, unverwechselbaren Ausdruck in die Welt zu bringen – und andere damit zu inspirieren, ebenfalls ihre Einzigartigkeit zu leben. Du bist nicht hier, um dich anzupassen. Du bist hier, um das zu benennen, was nur durch dich gesagt werden kann.',
    deep_meaning: 'Der Tanz zwischen Authentizität und Anerkennung: Zu viel Anpassung: Du verlierst deine Eigenheit. Zu viel Abgrenzung: Du isolierst dich und deine Botschaft erreicht niemanden. Die Kunst liegt darin, dich zu zeigen, ohne dich zu verbiegen – und Resonanz willkommen zu heißen, ohne von ihr abhängig zu werden.',
    shadow_aspects: JSON.stringify([
      'Du wählst "sichere" Worte, die niemanden stören',
      'Du hältst deine Ideen zurück, aus Angst vor Ablehnung',
      'Du übernimmst die Sprache anderer, um dazuzugehören',
      'Du bleibst zu "neutral" und gehst in der Masse unter'
    ]),
    gifts: JSON.stringify([
      'Sprache als Differenzierungsfaktor',
      'Positionierung durch unverwechselbare Stimme',
      'Marketing mit Inspirationswirkung',
      'Kommunikation als Geschenk'
    ]),
    affirmation: 'Ich gebe meiner Einzigartigkeit eine Stimme. Meine Sprache macht meinen Beitrag sichtbar.',
    center_name: "THROAT"
  };

  insertMercuryGate.run(
    mercuryGate8.id,
    mercuryGate8.planet_name,
    mercuryGate8.gate_number,
    mercuryGate8.name,
    mercuryGate8.essence,
    mercuryGate8.consciousness,
    mercuryGate8.description,
    mercuryGate8.deep_meaning,
    mercuryGate8.shadow_aspects,
    mercuryGate8.gifts,
    mercuryGate8.affirmation,
    mercuryGate8.center_name
  );

  // Tor 9 - Fokus (Mercury-spezifisch)
  const mercuryGate9 = {
    id: 'mercury_gate_9',
    planet_name: 'Mercury',
    gate_number: 9,
    name: 'Fokus',
    essence: 'Die Stimme der Präzision - Unbewusste Konzentration durch gezielte Kommunikation',
    consciousness: 'Sprache als Fokussierungswerkzeug - Bewusste Konzentration durch präzise Botschaften',
    description: 'Tor 9 im bewussten Merkur: Deine Sprache besitzt eine besondere Qualität - sie kann das Wesentliche herausfiltern und alles Überflüssige weglassen. Du bist nicht hier, um jedes Detail zu erzählen. Du bist hier, um den Kern zu treffen. Deine Worte bringen Klarheit, weil sie nicht zerfasern – sondern bündeln.',
    deep_meaning: 'Der Tanz zwischen Tiefe und Offenheit: Zu viel Fokus: Du schneidest Ideen ab, bevor sie reifen. Zu wenig Fokus: Die Energie verläuft sich und nichts kommt in die Umsetzung. Deine Kunst liegt darin, zu wissen, wann es Zeit ist, zu fokussieren – und wann es Zeit ist, Raum zu lassen.',
    shadow_aspects: JSON.stringify([
      'Du unterbrichst, um schneller zum Punkt zu kommen',
      'Du drängst andere zu früh auf ein Ziel fest',
      'Du verlierst Geduld für langsame Prozesse',
      'Du bist so stark fokussiert, dass du potenziell wertvolle Nebenthemen ausschließt'
    ]),
    gifts: JSON.stringify([
      'Sprache als Fokussierungswerkzeug',
      'Positionierung durch Klarheit',
      'Marketing mit Zielwirkung',
      'Kommunikation als Laserstrahl'
    ]),
    affirmation: 'Meine Worte bündeln Energie. Ich fokussiere meine Botschaft.',
    center_name: "ROOT"
  };

  insertMercuryGate.run(
    mercuryGate9.id,
    mercuryGate9.planet_name,
    mercuryGate9.gate_number,
    mercuryGate9.name,
    mercuryGate9.essence,
    mercuryGate9.consciousness,
    mercuryGate9.description,
    mercuryGate9.deep_meaning,
    mercuryGate9.shadow_aspects,
    mercuryGate9.gifts,
    mercuryGate9.affirmation,
    mercuryGate9.center_name
  );

  // Tor 10 - Selbsttreue (Mercury-spezifisch)
  const mercuryGate10 = {
    id: 'mercury_gate_10',
    planet_name: 'Mercury',
    gate_number: 10,
    name: 'Selbsttreue',
    essence: 'Die Stimme der Authentizität - Unbewusste Identität durch echte Kommunikation',
    consciousness: 'Sprache als Markenidentität - Bewusste Identität durch wertebasierte Kommunikation',
    description: 'Tor 10 im bewussten Merkur: Deine Kommunikation ist untrennbar mit deiner Identität verbunden. Du kannst dich nicht lange verstellen – deine Sprache verrät immer, wer du bist. Deine Worte tragen deine Haltung, deine Werte, deine gelebte Wahrheit. Egal, ob du es bewusst planst oder nicht – deine Kommunikation ist ein Spiegel deiner Selbstannahme.',
    deep_meaning: 'Der Tanz zwischen Echtheit und Anpassung: Zu viel Anpassung: Du verlierst deine Integrität. Zu viel Härte in der Echtheit: Du stößt Menschen unnötig vor den Kopf. Deine Aufgabe ist es, authentisch zu sprechen, ohne verletzend zu sein – und kompromisslos zu dir zu stehen, ohne dich von der Resonanz abhängig zu machen.',
    shadow_aspects: JSON.stringify([
      'Du vermeidest klare Aussagen',
      'Du übernimmst die Sichtweise anderer, um Konflikten aus dem Weg zu gehen',
      'Du gibst vor, etwas zu sein, was nicht deiner Wahrheit entspricht',
      'Du weichst von deinen Werten ab, um einen Auftrag zu bekommen'
    ]),
    gifts: JSON.stringify([
      'Sprache als Markenidentität',
      'Positionierung durch Wertekommunikation',
      'Marketing mit Authentizität',
      'Kommunikation als Identitätsanker'
    ]),
    affirmation: 'Ich spreche aus meiner Selbsttreue. Meine Kommunikation ist meine Marke.',
    center_name: "SOLAR"
  };

  insertMercuryGate.run(
    mercuryGate10.id,
    mercuryGate10.planet_name,
    mercuryGate10.gate_number,
    mercuryGate10.name,
    mercuryGate10.essence,
    mercuryGate10.consciousness,
    mercuryGate10.description,
    mercuryGate10.deep_meaning,
    mercuryGate10.shadow_aspects,
    mercuryGate10.gifts,
    mercuryGate10.affirmation,
    mercuryGate10.center_name
  );

  // Tor 12 - Zurückhaltung (Mercury-spezifisch)
  const mercuryGate12 = {
    id: 'mercury_gate_12',
    planet_name: 'Mercury',
    gate_number: 12,
    name: 'Zurückhaltung',
    essence: 'Die Stimme der Bedachtsamkeit - Unbewusste Wirkung durch bewusste Auswahl',
    consciousness: 'Sprache als strategisches Werkzeug - Bewusste Wirkung durch gezieltes Timing',
    description: 'Tor 12 im bewussten Merkur: Du hast die Gabe, Sprache bewusst zu wählen. Du redest nicht, um Raum zu füllen – du redest, um Wirkung zu erzeugen. Du spürst, dass nicht jedes Gespräch und nicht jeder Moment Worte braucht. Deine Stärke liegt darin, zu warten, bis das Timing stimmt – und dann genau die Formulierung zu wählen, die ins Herz trifft.',
    deep_meaning: 'Der Tanz zwischen Ausdruck und Zurückhaltung: Zu viel Zurückhaltung: Du sagst gar nichts und verlierst Einfluss. Zu viel Ausdruck: Du überforderst mit Worten, die nicht reifen konnten. Die Kunst liegt darin, deine Stimme bewusst einzusetzen, ohne dich aus Angst zu blockieren.',
    shadow_aspects: JSON.stringify([
      'Du wartest so lange, dass der Moment vorbei ist',
      'Du redest nur, wenn du sicher bist, dass es ankommt',
      'Du verlierst Authentizität, weil du zu vorsichtig bist',
      'Du kommunizierst zu selten und wirst übersehen'
    ]),
    gifts: JSON.stringify([
      'Sprache als strategisches Werkzeug',
      'Positionierung durch gezielte Kommunikation',
      'Marketing mit Spannungsaufbau',
      'Kommunikation als feine Kunst'
    ]),
    affirmation: 'Ich spreche, wenn es zählt. Meine Worte setzen den entscheidenden Impuls.',
    center_name: "THROAT"
  };

  insertMercuryGate.run(
    mercuryGate12.id,
    mercuryGate12.planet_name,
    mercuryGate12.gate_number,
    mercuryGate12.name,
    mercuryGate12.essence,
    mercuryGate12.consciousness,
    mercuryGate12.description,
    mercuryGate12.deep_meaning,
    mercuryGate12.shadow_aspects,
    mercuryGate12.gifts,
    mercuryGate12.affirmation,
    mercuryGate12.center_name
  );

  // Tor 13 - Zuhören (Mercury-spezifisch)
  const mercuryGate13 = {
    id: 'mercury_gate_13',
    planet_name: 'Mercury',
    gate_number: 13,
    name: 'Zuhören',
    essence: 'Die Stimme des Zuhörens - Unbewusste Empathie durch aufmerksame Kommunikation',
    consciousness: 'Sprache als Resonanzraum - Bewusste Empathie durch Community-Verständnis',
    description: 'Tor 13 im bewussten Merkur: Deine Kommunikation beginnt nicht beim Sprechen, sondern beim Hinhören. Du hast die Fähigkeit, Geschichten, Erfahrungen und Gefühle anderer aufzunehmen und ihnen in deiner Sprache eine neue Form zu geben. Oft bist du der Mensch, dem man Dinge anvertraut, weil deine Präsenz Sicherheit schafft.',
    deep_meaning: 'Der Tanz zwischen Empathie und Abgrenzung: Zu viel Offenheit: Du übernimmst fremde Geschichten, bis sie dich erdrücken. Zu viel Abgrenzung: Du verschließt dich und verlierst den Zugang zu dieser Gabe. Die Kunst liegt darin, dich als Kanal zu verstehen – nicht als Speicher, der alles behalten muss.',
    shadow_aspects: JSON.stringify([
      'Du erzählst Dinge weiter, die dir im Vertrauen gesagt wurden',
      'Du nutzt die Geschichte anderer für deine eigene Positionierung, ohne sie zu achten',
      'Du trägst Lasten, die nicht deine sind, und verstummst unter der Schwere',
      'Du passt dich so sehr an, dass deine eigene Botschaft untergeht'
    ]),
    gifts: JSON.stringify([
      'Sprache als Resonanzraum',
      'Positionierung durch das Verstehen anderer',
      'Marketing mit Zuhör-Strategie',
      'Kommunikation als Spiegel'
    ]),
    affirmation: 'Ich höre die Geschichten anderer. Ich höre den Markt, bevor ich spreche.',
    center_name: "THROAT"
  };

  insertMercuryGate.run(
    mercuryGate13.id,
    mercuryGate13.planet_name,
    mercuryGate13.gate_number,
    mercuryGate13.name,
    mercuryGate13.essence,
    mercuryGate13.consciousness,
    mercuryGate13.description,
    mercuryGate13.deep_meaning,
    mercuryGate13.shadow_aspects,
    mercuryGate13.gifts,
    mercuryGate13.affirmation,
    mercuryGate13.center_name
  );

  // Tor 14 - Besitz (Mercury-spezifisch)
  const mercuryGate14 = {
    id: 'mercury_gate_14',
    planet_name: 'Mercury',
    gate_number: 14,
    name: 'Besitz',
    essence: 'Die Stimme des Reichtums - Unbewusste Wertschöpfung durch bewusste Kommunikation',
    consciousness: 'Sprache als Wertgenerator - Bewusste Wertschöpfung durch strategische Kommunikation',
    description: 'Tor 14 im bewussten Merkur: Du trägst eine besondere Gabe - du kannst das, was wertvoll ist, in Worte fassen – und dadurch sichtbar und nutzbar machen. Es geht nicht nur um Geld. Es geht um jede Form von Ressource: Fähigkeiten, Ideen, Kontakte, Möglichkeiten. Du bist jemand, der erkennt, was Potenzial hat, und es so benennt, dass andere es ebenfalls sehen und schätzen.',
    deep_meaning: 'Der Tanz zwischen Großzügigkeit und Fokus: Zu viel Großzügigkeit: Du verteilst Ressourcen wahllos, ohne Strategie. Zu viel Zurückhaltung: Du hältst Potenzial zurück, weil du Angst hast, es zu "verschwenden". Deine Aufgabe ist es, deine Worte bewusst als Investition zu sehen – nicht als beliebige Währung.',
    shadow_aspects: JSON.stringify([
      'Du betonst Wert nur, wenn er dir selbst zugutekommt',
      'Du übertreibst, um Ressourcen zu sichern',
      'Du schweigst über Wert, um andere kleinzuhalten',
      'Du sprichst zu abstrakt über den Wert deines Angebots'
    ]),
    gifts: JSON.stringify([
      'Sprache als Wertgenerator',
      'Positionierung durch Wertkommunikation',
      'Marketing mit Investitionslogik',
      'Kommunikation als Ressourcentransfer'
    ]),
    affirmation: 'Ich spreche den Wert aus. Meine Worte lenken Geld- und Energieflüsse.',
    center_name: "SACRAL"
  };

  insertMercuryGate.run(
    mercuryGate14.id,
    mercuryGate14.planet_name,
    mercuryGate14.gate_number,
    mercuryGate14.name,
    mercuryGate14.essence,
    mercuryGate14.consciousness,
    mercuryGate14.description,
    mercuryGate14.deep_meaning,
    mercuryGate14.shadow_aspects,
    mercuryGate14.gifts,
    mercuryGate14.affirmation,
    mercuryGate14.center_name
  );

  // Tor 15 - Bescheidenheit (Mercury-spezifisch)
  const mercuryGate15 = {
    id: 'mercury_gate_15',
    planet_name: 'Mercury',
    gate_number: 15,
    name: 'Bescheidenheit',
    essence: 'Die Stimme der Balance - Unbewusste Harmonie durch bewusste Verbindung',
    consciousness: 'Sprache als Brücke im Business - Bewusste Harmonie durch inklusive Kommunikation',
    description: 'Tor 15 im bewussten Merkur: Du kannst Unterschiede, Gegensätze und Widersprüche benennen – ohne sie gegeneinander auszuspielen. Du bist nicht hier, um eine Seite zu wählen. Du bist hier, um das verbindende Muster sichtbar zu machen. Oft bist du der Mensch, der Spannungen im Gespräch entschärft, indem du Worte findest, die alle Seiten anerkennen.',
    deep_meaning: 'Der Tanz zwischen Neutralität und Position: Zu viel Neutralität: Du wirst unsichtbar und unverbindlich. Zu viel Stellungnahme: Du verlierst deine verbindende Wirkung. Deine Kunst ist es, klar zu sprechen, ohne Spaltung zu fördern.',
    shadow_aspects: JSON.stringify([
      'Du weichst heiklen Themen aus',
      'Du sprichst in so allgemeinen Begriffen, dass niemand wirklich versteht, wofür du stehst',
      'Du vermeidest Konfrontation, selbst wenn sie nötig wäre',
      'Zu breite Ansprache, die niemanden tief erreicht'
    ]),
    gifts: JSON.stringify([
      'Sprache als Brücke im Business',
      'Positionierung durch Werte der Inklusion',
      'Marketing mit Gemeinschaftsgefühl',
      'Kommunikation als Harmoniebringer'
    ]),
    affirmation: 'Ich spreche aus der Mitte. Meine Kommunikation schafft Balance im Markt.',
    center_name: "G"
  };

  insertMercuryGate.run(
    mercuryGate15.id,
    mercuryGate15.planet_name,
    mercuryGate15.gate_number,
    mercuryGate15.name,
    mercuryGate15.essence,
    mercuryGate15.consciousness,
    mercuryGate15.description,
    mercuryGate15.deep_meaning,
    mercuryGate15.shadow_aspects,
    mercuryGate15.gifts,
    mercuryGate15.affirmation,
    mercuryGate15.center_name
  );

  // Tor 16 - Begeisterung (Mercury-spezifisch)
  const mercuryGate16 = {
    id: 'mercury_gate_16',
    planet_name: 'Mercury',
    gate_number: 16,
    name: 'Begeisterung',
    essence: 'Die Stimme der Begeisterung - Unbewusste Energie durch bewusste Leidenschaft',
    consciousness: 'Sprache als Energiequelle im Business - Bewusste Begeisterung durch authentische Kommunikation',
    description: 'Tor 16 im bewussten Merkur: In deiner Sprache steckt eine lebendige, ansteckende Energie. Deine Worte sind nicht nur Informationen – sie sind Funken, die Feuer entfachen können. Du bist nicht hier, um neutral zu klingen. Deine Sprache lebt, weil sie von echtem Interesse und Freude durchdrungen ist. Oft merken Menschen dir schon an deiner Stimmlage und Wortwahl an, dass dir etwas wirklich wichtig ist – und genau das zieht sie in deinen Bann.',
    deep_meaning: 'Der Tanz zwischen Show und Substanz: Zu viel Show: Die Begeisterung wirkt übertrieben und künstlich. Zu wenig Ausdruck: Die Botschaft bleibt farblos und wird überhört. Deine Kunst liegt darin, Begeisterung aus echter Verbindung zu deinem Thema zu schöpfen – und nicht aus reiner Wirkungslust.',
    shadow_aspects: JSON.stringify([
      'Du sprichst, um zu beeindrucken, nicht um zu verbinden',
      'Du nutzt Emotion, um von fehlender Substanz abzulenken',
      'Du übertreibst und verlierst dadurch Glaubwürdigkeit',
      'Du verlässt dich zu sehr auf Emotion und vernachlässigst Fakten'
    ]),
    gifts: JSON.stringify([
      'Sprache als Energiequelle im Business',
      'Positionierung durch spürbare Kompetenzfreude',
      'Marketing mit Sogwirkung',
      'Kommunikation als Verstärker'
    ]),
    affirmation: 'Ich spreche mit Begeisterung. Meine Worte wecken Kaufmotivation.',
    center_name: "THROAT"
  };

  insertMercuryGate.run(
    mercuryGate16.id,
    mercuryGate16.planet_name,
    mercuryGate16.gate_number,
    mercuryGate16.name,
    mercuryGate16.essence,
    mercuryGate16.consciousness,
    mercuryGate16.description,
    mercuryGate16.deep_meaning,
    mercuryGate16.shadow_aspects,
    mercuryGate16.gifts,
    mercuryGate16.affirmation,
    mercuryGate16.center_name
  );

  // Tor 17 - Meinung (Mercury-spezifisch)
  const mercuryGate17 = {
    id: 'mercury_gate_17',
    planet_name: 'Mercury',
    gate_number: 17,
    name: 'Meinung',
    essence: 'Die Stimme der Klarheit und Ordnung - Unbewusste Struktur durch bewusste Meinungsbildung',
    consciousness: 'Sprache als Positionierungswerkzeug - Bewusste Meinungsbildung durch klare Haltung',
    description: 'Tor 17 im bewussten Merkur: Du besitzt eine besondere Strukturkraft. Du kannst aus einer Vielzahl von Eindrücken eine klar formulierte Meinung bilden – und diese so ausdrücken, dass sie nachvollziehbar ist. Du sprichst nicht, um zu verwirren. Du sprichst, um Orientierung zu geben. Deine Worte sind oft wie gut sortierte Werkzeuge: jedes an seinem Platz, bereit für den gezielten Einsatz.',
    deep_meaning: 'Der Tanz zwischen Meinung und Offenheit: Zu viel Meinung: Du wirkst starr und unflexibel. Zu wenig Meinung: Du verlierst Profil und Einfluss. Die Kunst liegt darin, deine Sicht klar zu formulieren, ohne den Dialog zu schließen.',
    shadow_aspects: JSON.stringify([
      'Du betonst Recht haben über Verstehen wollen',
      'Du schneidest alternative Sichtweisen ab',
      'Du formulierst so streng, dass kein Raum für Flexibilität bleibt',
      'Du bist so stark auf deine Sicht fixiert, dass du Marktsignale übersiehst'
    ]),
    gifts: JSON.stringify([
      'Sprache als Positionierungswerkzeug',
      'Positionierung durch Haltung',
      'Marketing mit Meinungsstärke',
      'Kommunikation als Strukturgeber'
    ]),
    affirmation: 'Ich formuliere meine Sicht klar. Meine Worte geben meiner Marke eine klare Haltung.',
    center_name: "AJNA"
  };

  insertMercuryGate.run(
    mercuryGate17.id,
    mercuryGate17.planet_name,
    mercuryGate17.gate_number,
    mercuryGate17.name,
    mercuryGate17.essence,
    mercuryGate17.consciousness,
    mercuryGate17.description,
    mercuryGate17.deep_meaning,
    mercuryGate17.shadow_aspects,
    mercuryGate17.gifts,
    mercuryGate17.affirmation,
    mercuryGate17.center_name
  );

  // Tor 18 - Korrektur (Mercury-spezifisch)
  const mercuryGate18 = {
    id: 'mercury_gate_18',
    planet_name: 'Mercury',
    gate_number: 18,
    name: 'Korrektur',
    essence: 'Die Stimme der Korrektur - Unbewusste Verbesserung durch bewusste Optimierung',
    consciousness: 'Sprache als Optimierungskraft - Bewusste Verbesserung durch lösungsorientiertes Feedback',
    description: 'Tor 18 im bewussten Merkur: Du trägst eine besondere Gabe - du kannst Ungleichgewichte, Schwachstellen und Optimierungspotenziale nicht nur erkennen, sondern so in Worte fassen, dass sie zu Verbesserungen führen können. Du bist nicht hier, um zu kritisieren, um der Kritik willen. Du bist hier, um Dinge zu heilen, zu verfeinern, zu verbessern – und deine Sprache ist eines deiner wichtigsten Werkzeuge dafür.',
    deep_meaning: 'Der Tanz zwischen Kritik und Verbesserung: Zu viel Kritik: Du wirkst destruktiv und demotivierend. Zu wenig Feedback: Potenzial bleibt ungenutzt. Deine Kunst liegt darin, Schwachstellen so anzusprechen, dass sie motivieren und zu Lösungen führen.',
    shadow_aspects: JSON.stringify([
      'Du kritisierst, um zu verletzen, nicht um zu helfen',
      'Du siehst nur das Negative und übersiehst Stärken',
      'Du gibst Feedback ohne konstruktive Lösungsvorschläge',
      'Du bist so perfektionistisch, dass du Fortschritte blockierst'
    ]),
    gifts: JSON.stringify([
      'Sprache als Optimierungskraft',
      'Positionierung durch lösungsorientiertes Feedback',
      'Marketing mit Qualitätsfokus',
      'Kommunikation als Verbesserungswerkzeug'
    ]),
    affirmation: 'Ich spreche, um zu verbessern. Meine Worte steigern Qualität.',
    center_name: "SPLEEN"
  };

  insertMercuryGate.run(
    mercuryGate18.id,
    mercuryGate18.planet_name,
    mercuryGate18.gate_number,
    mercuryGate18.name,
    mercuryGate18.essence,
    mercuryGate18.consciousness,
    mercuryGate18.description,
    mercuryGate18.deep_meaning,
    mercuryGate18.shadow_aspects,
    mercuryGate18.gifts,
    mercuryGate18.affirmation,
    mercuryGate18.center_name
  );

  // Tor 19 - Nähe (Mercury-spezifisch)
  const mercuryGate19 = {
    id: 'mercury_gate_19',
    planet_name: 'Mercury',
    gate_number: 19,
    name: 'Nähe',
    essence: 'Die Stimme der Sensibilität - Unbewusste Verbindung durch bewusste Bedürfniswahrnehmung',
    consciousness: 'Sprache als Bindungskraft - Bewusste Verbindung durch achtsame Kommunikation',
    description: 'Tor 19 im bewussten Merkur: Du bist besonders feinfühlig für die unausgesprochenen Bedürfnisse in deinem Umfeld. Deine Worte können wie Fühler wirken – sie tasten ab, wo jemand mehr Nähe, Unterstützung oder Aufmerksamkeit braucht. Du bist nicht hier, um oberflächlich zu reden. Du bist hier, um Resonanzräume zu schaffen, in denen Menschen sich gesehen fühlen.',
    deep_meaning: 'Der Tanz zwischen Nähe und Unabhängigkeit: Zu viel Anpassung: Du verlierst deine eigene Stimme. Zu viel Rückzug: Du schließt andere von deiner Sensibilität aus. Die Kunst ist es, klar zu sprechen, ohne dich selbst aufzugeben.',
    shadow_aspects: JSON.stringify([
      'Du sprichst, um gemocht zu werden',
      'Du vermeidest klare Worte, um niemanden zu verletzen',
      'Du verlierst dich im "Kümmern" und vergisst dich selbst',
      'Du passt dich so stark an, dass deine Marke ihr Profil verliert'
    ]),
    gifts: JSON.stringify([
      'Sprache als Bindungskraft',
      'Positionierung durch Bedürfniswahrnehmung',
      'Marketing mit Sensibilität',
      'Kommunikation als Brücke'
    ]),
    affirmation: 'Ich spreche, um Verbindung zu schaffen. Meine Kommunikation baut Kundenbeziehungen auf.',
    center_name: "ROOT"
  };

  insertMercuryGate.run(
    mercuryGate19.id,
    mercuryGate19.planet_name,
    mercuryGate19.gate_number,
    mercuryGate19.name,
    mercuryGate19.essence,
    mercuryGate19.consciousness,
    mercuryGate19.description,
    mercuryGate19.deep_meaning,
    mercuryGate19.shadow_aspects,
    mercuryGate19.gifts,
    mercuryGate19.affirmation,
    mercuryGate19.center_name
  );

  // Tor 20 - Gegenwart (Mercury-spezifisch)
  const mercuryGate20 = {
    id: 'mercury_gate_20',
    planet_name: 'Mercury',
    gate_number: 20,
    name: 'Gegenwart',
    essence: 'Die Stimme des Augenblicks - Unbewusste Spontanität durch bewusste Präsenz',
    consciousness: 'Sprache als Energie-Booster - Bewusste Spontanität durch authentische Kommunikation',
    description: 'Tor 20 im bewussten Merkur: Du lebst in der Sprache des Hier und Jetzt. Deine Worte haben Kraft, weil sie ungefiltert und direkt aus dem Moment entstehen. Du bist nicht hier, um lange zu überlegen. Du bist hier, um dem Augenblick eine Stimme zu geben. Du spürst, dass Wahrheit nicht immer vorbereitet werden muss. Manchmal genügt es, das zu sagen, was gerade da ist.',
    deep_meaning: 'Der Tanz zwischen Spontanität und Bedacht: Zu viel Spontanität: Worte kommen unbedacht und schaffen Konflikte. Zu viel Bedacht: Worte verlieren ihre Energie und verpassen den Moment. Die Kunst liegt darin, deine Spontanität mit Bewusstsein zu verbinden.',
    shadow_aspects: JSON.stringify([
      'Du sprichst, ohne zuzuhören',
      'Du suchst Bestätigung durch spontane Aussagen',
      'Du lenkst den Fokus, ohne Substanz zu haben',
      'Du sprichst zu spontan und wirkst unprofessionell'
    ]),
    gifts: JSON.stringify([
      'Sprache als Energie-Booster',
      'Positionierung durch Präsenz',
      'Marketing mit Lebendigkeit',
      'Kommunikation als Gegenwartsanker'
    ]),
    affirmation: 'Ich spreche im Jetzt. Meine Worte bringen mein Business in den Moment.',
    center_name: "THROAT"
  };

  insertMercuryGate.run(
    mercuryGate20.id,
    mercuryGate20.planet_name,
    mercuryGate20.gate_number,
    mercuryGate20.name,
    mercuryGate20.essence,
    mercuryGate20.consciousness,
    mercuryGate20.description,
    mercuryGate20.deep_meaning,
    mercuryGate20.shadow_aspects,
    mercuryGate20.gifts,
    mercuryGate20.affirmation,
    mercuryGate20.center_name
  );

  // Tor 21 - Kontrolle (Mercury-spezifisch)
  const mercuryGate21 = {
    id: 'mercury_gate_21',
    planet_name: 'Mercury',
    gate_number: 21,
    name: 'Kontrolle',
    essence: 'Die Stimme der Führung - Unbewusste Kontrolle durch bewusste Strukturierung',
    consciousness: 'Sprache als Führungsinstrument - Bewusste Führung durch klare Kommunikation',
    description: 'Tor 21 im bewussten Merkur: Deine Worte tragen die Energie von Leitung und Klarheit. Du bist nicht hier, um nur zu beobachten – du bist hier, um Ordnung zu schaffen. Deine Sprache hat etwas Entscheidendes, Verbindliches. Oft bist du die Person, die im Gespräch sagt: "So machen wir es." Tor 21 erkennt sofort, wenn Chaos herrscht. Es drängt dich, Dinge zu benennen, die organisiert und geführt werden müssen.',
    deep_meaning: 'Der Tanz zwischen Macht und Verantwortung: Zu viel Machtanspruch: Du bestimmst, ohne Rücksicht. Zu wenig Führung: Du vermeidest Verantwortung. Die Kunst liegt darin, deine Führungsenergie klar und fair einzusetzen.',
    shadow_aspects: JSON.stringify([
      'Du formulierst Befehle statt Impulse',
      'Du nutzt Worte, um andere kleinzuhalten',
      'Du redest, um Kontrolle zu behalten, nicht um zu führen',
      'Du kontrollierst zu stark und verlierst Flexibilität'
    ]),
    gifts: JSON.stringify([
      'Sprache als Führungsinstrument',
      'Positionierung durch Klarheit',
      'Marketing mit Struktur',
      'Kommunikation als Ordnungsgeber'
    ]),
    affirmation: 'Ich spreche, um zu führen. Meine Kommunikation gibt meinem Business Struktur.',
    center_name: "HEART"
  };

  insertMercuryGate.run(
    mercuryGate21.id,
    mercuryGate21.planet_name,
    mercuryGate21.gate_number,
    mercuryGate21.name,
    mercuryGate21.essence,
    mercuryGate21.consciousness,
    mercuryGate21.description,
    mercuryGate21.deep_meaning,
    mercuryGate21.shadow_aspects,
    mercuryGate21.gifts,
    mercuryGate21.affirmation,
    mercuryGate21.center_name
  );

  // Tor 22 - Anmut (Mercury-spezifisch)
  const mercuryGate22 = {
    id: 'mercury_gate_22',
    planet_name: 'Mercury',
    gate_number: 22,
    name: 'Anmut',
    essence: 'Die Stimme der Anmut - Unbewusste Freundlichkeit durch bewusste Würde',
    consciousness: 'Sprache als Beziehungsbrücke - Bewusste Anmut durch authentische Kommunikation',
    description: 'Tor 22 im bewussten Merkur: Deine Worte haben eine besondere Qualität - sie sind getragen von Charme, Höflichkeit und emotionaler Intelligenz. Deine Sprache kann Türen öffnen, die sonst verschlossen bleiben. Nicht, weil du unbedingt das perfekte Argument hast – sondern weil deine Worte mit einer besonderen Ausstrahlung kommen. Du spürst: Menschen öffnen sich schneller, wenn sie sich wohlfühlen. Darum nutzt du Sprache, um Atmosphäre zu schaffen.',
    deep_meaning: 'Der Tanz zwischen Höflichkeit und Echtheit: Zu viel Anpassung: Worte wirken oberflächlich. Zu viel Direktheit: Worte wirken verletzend. Deine Kunst liegt darin, freundlich zu sprechen, ohne dich zu verbiegen.',
    shadow_aspects: JSON.stringify([
      'Du bleibst höflich, obwohl du wütend bist',
      'Du sagst Ja, obwohl du Nein meinst',
      'Du nutzt Charme, um zu manipulieren',
      'Du bleibst zu höflich und verlierst an Durchschlagskraft'
    ]),
    gifts: JSON.stringify([
      'Sprache als Beziehungsbrücke',
      'Positionierung mit Charme und Klarheit',
      'Marketing mit Resonanz',
      'Kommunikation als Einladung'
    ]),
    affirmation: 'Ich spreche mit Anmut. Meine Worte öffnen Kundenherzen.',
    center_name: "HEART"
  };

  insertMercuryGate.run(
    mercuryGate22.id,
    mercuryGate22.planet_name,
    mercuryGate22.gate_number,
    mercuryGate22.name,
    mercuryGate22.essence,
    mercuryGate22.consciousness,
    mercuryGate22.description,
    mercuryGate22.deep_meaning,
    mercuryGate22.shadow_aspects,
    mercuryGate22.gifts,
    mercuryGate22.affirmation,
    mercuryGate22.center_name
  );

  // Tor 23 - Einfachheit (Mercury-spezifisch)
  const mercuryGate23 = {
    id: 'mercury_gate_23',
    planet_name: 'Mercury',
    gate_number: 23,
    name: 'Einfachheit',
    essence: 'Die Stimme der Einfachheit - Unbewusste Klarheit durch bewusste Vereinfachung',
    consciousness: 'Sprache als Verkaufsfaktor - Bewusste Klarheit durch verständliche Kommunikation',
    description: 'Tor 23 im bewussten Merkur: Du besitzt die Fähigkeit, Komplexes in einfache Sprache zu verwandeln. Deine Worte können wie eine Übersetzung wirken – sie holen Ideen aus dem Abstrakten ins Greifbare. Du bist nicht hier, um in Rätseln zu reden. Du bist hier, um Dinge auf den Punkt zu bringen. Du spürst sofort, wenn Sprache unnötig kompliziert ist. Dein Drang ist es, den Kern sichtbar zu machen – für dich und für andere.',
    deep_meaning: 'Der Tanz zwischen Tiefe und Einfachheit: Zu viel Tiefe: Andere verstehen dich nicht. Zu viel Vereinfachung: Andere nehmen dich nicht ernst. Deine Kunst liegt darin, das Wesentliche klar auszudrücken – ohne Substanz zu verlieren.',
    shadow_aspects: JSON.stringify([
      'Du erklärst so kompliziert, dass andere sich dumm fühlen',
      'Du vereinfachst so stark, dass Inhalte an Wert verlieren',
      'Du benutzt Worte, um dich über andere zu stellen',
      'Du vereinfachst so stark, dass dein Angebot oberflächlich wirkt'
    ]),
    gifts: JSON.stringify([
      'Sprache als Verkaufsfaktor',
      'Positionierung durch Klarheit',
      'Marketing mit Verständlichkeit',
      'Kommunikation als Übersetzung'
    ]),
    affirmation: 'Ich spreche, um Klarheit zu schaffen. Meine Kommunikation macht mein Angebot verständlich.',
    center_name: "THROAT"
  };

  insertMercuryGate.run(
    mercuryGate23.id,
    mercuryGate23.planet_name,
    mercuryGate23.gate_number,
    mercuryGate23.name,
    mercuryGate23.essence,
    mercuryGate23.consciousness,
    mercuryGate23.description,
    mercuryGate23.deep_meaning,
    mercuryGate23.shadow_aspects,
    mercuryGate23.gifts,
    mercuryGate23.affirmation,
    mercuryGate23.center_name
  );

  // Tor 24 - Reflexion (Mercury-spezifisch)
  const mercuryGate24 = {
    id: 'mercury_gate_24',
    planet_name: 'Mercury',
    gate_number: 24,
    name: 'Reflexion',
    essence: 'Die Stimme der Reflexion - Unbewusste Wiederkehr durch bewusste Vertiefung',
    consciousness: 'Sprache als Wiedererkennungswert - Bewusste Wiederholung durch reflektierte Kommunikation',
    description: 'Tor 24 im bewussten Merkur: Du arbeitest gedanklich oft in Schleifen. Deine Worte kommen manchmal wiederholt – nicht, weil du dich wiederholst, sondern weil du durch die Wiederholung Tiefe findest. Du bist nicht hier, um alles sofort zu verstehen. Du bist hier, um Schritt für Schritt Klarheit zu gewinnen – und diese Klarheit dann in Sprache zu gießen. Deine Kommunikation folgt oft Zyklen. Du kommst immer wieder auf bestimmte Themen zurück, bis sie für dich und andere klarer werden.',
    deep_meaning: 'Der Tanz zwischen Vertiefung und Stagnation: Zu viel Wiederholung: Gespräche drehen sich im Kreis. Zu wenig Reflexion: Einsichten verschwinden, bevor sie wirken können. Deine Kunst liegt darin, Wiederholung bewusst einzusetzen – als Mittel zur Klarheit.',
    shadow_aspects: JSON.stringify([
      'Du sprichst immer wieder dieselben Worte, ohne sie zu fühlen',
      'Du drehst dich in endlosen Gedankenschleifen',
      'Du blockierst dich, weil du keine Entscheidung triffst',
      'Du wiederholst dich zu mechanisch und wirkst leblos'
    ]),
    gifts: JSON.stringify([
      'Sprache als Wiedererkennungswert',
      'Positionierung durch reflektierte Kommunikation',
      'Marketing mit Vertrautheit',
      'Kommunikation als Wiedergewinnung'
    ]),
    affirmation: 'Ich spreche, um zurückzukehren. Meine Worte geben meinem Business Tiefe.',
    center_name: "AJNA"
  };

  insertMercuryGate.run(
    mercuryGate24.id,
    mercuryGate24.planet_name,
    mercuryGate24.gate_number,
    mercuryGate24.name,
    mercuryGate24.essence,
    mercuryGate24.consciousness,
    mercuryGate24.description,
    mercuryGate24.deep_meaning,
    mercuryGate24.shadow_aspects,
    mercuryGate24.gifts,
    mercuryGate24.affirmation,
    mercuryGate24.center_name
  );

  // Tor 25 - Unschuld (Mercury-spezifisch)
  const mercuryGate25 = {
    id: 'mercury_gate_25',
    planet_name: 'Mercury',
    gate_number: 25,
    name: 'Unschuld',
    essence: 'Die Stimme der Unschuld - Unbewusste Reinheit durch bewusste Echtheit',
    consciousness: 'Sprache als Vertrauensfaktor - Bewusste Authentizität durch unverfälschte Kommunikation',
    description: 'Tor 25 im bewussten Merkur: Deine Worte tragen eine besondere Reinheit. Sie sind frei von Manipulation und wirken deshalb oft überraschend direkt, ehrlich und klar. Du bist nicht hier, um strategisch zu reden. Du bist hier, um die Wahrheit so auszusprechen, wie sie durch dich fließt. Du spürst, wenn Worte gespielt, unecht oder taktisch sind. Dein eigenes Bedürfnis ist es, Sprache als Spiegel deiner reinen Absicht zu nutzen.',
    deep_meaning: 'Der Tanz zwischen Naivität und Weisheit: Zu viel Unschuld: Deine Worte wirken naiv und weltfremd. Zu viel Kalkül: Deine Worte verlieren ihre Reinheit. Deine Kunst liegt darin, Echtheit zu bewahren – und trotzdem weise zu sprechen.',
    shadow_aspects: JSON.stringify([
      'Du sprichst "unschuldig", um Kritik zu vermeiden',
      'Du nutzt Offenheit, um andere zu manipulieren',
      'Du sagst, was "rein" klingt, ohne es zu fühlen',
      'Deine Worte wirken zu naiv und schwächen deine Autorität'
    ]),
    gifts: JSON.stringify([
      'Sprache als Vertrauensfaktor',
      'Positionierung durch authentische Sprache',
      'Marketing mit Echtheit',
      'Kommunikation als Herzöffnung'
    ]),
    affirmation: 'Ich spreche aus Unschuld. Meine Worte bringen Echtheit ins Business.',
    center_name: "HEART"
  };

  insertMercuryGate.run(
    mercuryGate25.id,
    mercuryGate25.planet_name,
    mercuryGate25.gate_number,
    mercuryGate25.name,
    mercuryGate25.essence,
    mercuryGate25.consciousness,
    mercuryGate25.description,
    mercuryGate25.deep_meaning,
    mercuryGate25.shadow_aspects,
    mercuryGate25.gifts,
    mercuryGate25.affirmation,
    mercuryGate25.center_name
  );

  // Tor 26 - Überzeugung (Mercury-spezifisch)
  const mercuryGate26 = {
    id: 'mercury_gate_26',
    planet_name: 'Mercury',
    gate_number: 26,
    name: 'Überzeugung',
    essence: 'Die Stimme der geschickten Überzeugung - Unbewusste Wirkung durch bewusste Strategie',
    consciousness: 'Sprache als Verpackungskunst - Bewusste Wirkung durch strategische Kommunikation',
    description: 'Tor 26 im bewussten Merkur: Du besitzt eine besondere Einflusskraft in deiner Sprache. Du weißt instinktiv, wie du eine Botschaft so verpacken kannst, dass sie beim Gegenüber ankommt. Es geht dir nicht nur um den Inhalt, sondern um die Wirkung. Du spürst, wie du etwas formulieren musst, damit es nicht nur verstanden, sondern auch akzeptiert wird. Für dich ist Kommunikation nicht neutral. Du willst, dass sie etwas bewirkt. Oft bist du ein geborener Diplomat, der weiß, wie er Brücken baut, ohne den Kern der Botschaft zu verlieren.',
    deep_meaning: 'Der Tanz zwischen Integrität und Strategie: Zu strategisch: Deine Botschaft wirkt unecht. Zu direkt: Du verlierst den Zugang zum Gegenüber. Deine Kunst liegt darin, ehrliche Inhalte so zu formulieren, dass sie wirken – ohne ihre Wahrheit zu verlieren.',
    shadow_aspects: JSON.stringify([
      'Du "polierst" so sehr, dass der Kern verloren geht',
      'Du sagst, was andere hören wollen',
      'Du nutzt deine Gabe für Eigennutz statt Mehrwert',
      'Du verpackst so stark, dass Authentizität verloren geht'
    ]),
    gifts: JSON.stringify([
      'Sprache als Verpackungskunst',
      'Positionierung durch wirkungsvolle Kommunikation',
      'Marketing mit strategischer Wahrhaftigkeit',
      'Kommunikation als Überzeugungskraft'
    ]),
    affirmation: 'Ich spreche, um zu überzeugen. Ich positioniere mich durch wirkungsvolle Kommunikation.',
    center_name: "HEART"
  };

  insertMercuryGate.run(
    mercuryGate26.id,
    mercuryGate26.planet_name,
    mercuryGate26.gate_number,
    mercuryGate26.name,
    mercuryGate26.essence,
    mercuryGate26.consciousness,
    mercuryGate26.description,
    mercuryGate26.deep_meaning,
    mercuryGate26.shadow_aspects,
    mercuryGate26.gifts,
    mercuryGate26.affirmation,
    mercuryGate26.center_name
  );

  // Tor 27 - Fürsorge (Mercury-spezifisch)
  const mercuryGate27 = {
    id: 'mercury_gate_27',
    planet_name: 'Mercury',
    gate_number: 27,
    name: 'Fürsorge',
    essence: 'Die Stimme der Fürsorge - Unbewusste Nährung durch bewusste Verantwortung',
    consciousness: 'Sprache als Nahrung - Bewusste Fürsorge durch nährende Kommunikation',
    description: 'Tor 27 im bewussten Merkur: Deine Worte tragen eine nährende Qualität. Du gibst Menschen das Gefühl, dass sie wichtig sind – und dass du Verantwortung übernimmst. Sprache ist für dich nicht nur Ausdruck, sondern ein Mittel, um andere zu stärken. Du kannst Sprache einsetzen, um Schutz und Sicherheit zu vermitteln. Mit Tor 27 fühlen sich deine Worte wie Nahrung an. Sie stärken, beruhigen, ermutigen.',
    deep_meaning: 'Der Tanz zwischen Selbstaufgabe und Abgrenzung: Du gibst dich sprachlich völlig für andere auf. Du verweigerst Fürsorge, um dich zu schützen. Deine Kunst ist es, Sprache zu finden, die nährt – ohne dich selbst zu verlieren.',
    shadow_aspects: JSON.stringify([
      'Du machst andere abhängig von deiner Fürsorge',
      'Du hältst Verantwortung zurück, um Macht zu behalten',
      'Du opferst dich auf, bis nichts mehr für dich bleibt',
      'Du sprichst, um andere zu retten'
    ]),
    gifts: JSON.stringify([
      'Sprache als Nahrung',
      'Positionierung durch Verantwortung und Fürsorge',
      'Marketing mit nährenden Botschaften',
      'Kommunikation als Stärkung'
    ]),
    affirmation: 'Ich spreche, um Fürsorge auszudrücken. Meine Worte stärken mein Team und meine Kunden.',
    center_name: "SPLEEN"
  };

  insertMercuryGate.run(
    mercuryGate27.id,
    mercuryGate27.planet_name,
    mercuryGate27.gate_number,
    mercuryGate27.name,
    mercuryGate27.essence,
    mercuryGate27.consciousness,
    mercuryGate27.description,
    mercuryGate27.deep_meaning,
    mercuryGate27.shadow_aspects,
    mercuryGate27.gifts,
    mercuryGate27.affirmation,
    mercuryGate27.center_name
  );

  // Tor 28 - Sinn (Mercury-spezifisch)
  const mercuryGate28 = {
    id: 'mercury_gate_28',
    planet_name: 'Mercury',
    gate_number: 28,
    name: 'Sinn',
    essence: 'Die Stimme des Sinns - Unbewusste Tiefe durch bewusste Bedeutung',
    consciousness: 'Sprache als Sinnvermittler - Bewusste Orientierung durch sinnstiftende Kommunikation',
    description: 'Tor 28 im bewussten Merkur: Du trägst eine Sprache, die sich nicht mit Oberflächlichkeiten zufriedengibt. Du willst Bedeutung finden – und diese Bedeutung in Worte fassen. Oft bist du derjenige, der in Gesprächen fragt: "Wozu machen wir das eigentlich?" Für dich ist Sprache ein Werkzeug, um Orientierung zu schaffen, wenn der Weg unklar ist. Du sprichst nicht nur, um zu unterhalten, sondern um etwas zu verankern: eine Richtung, einen Wert, einen tieferen Grund.',
    deep_meaning: 'Der Tanz zwischen Tiefe und Schwere: Zu viel Tiefe: Gespräche werden schwer und bedrückend. Zu wenig Ausdruck: Das Wesentliche bleibt unausgesprochen. Deine Kunst liegt darin, über Sinn zu sprechen, ohne die Leichtigkeit zu verlieren.',
    shadow_aspects: JSON.stringify([
      'Du machst aus jeder Herausforderung einen existenziellen Kampf',
      'Du bleibst so lange im "Warum", dass es zu Handlungsunfähigkeit führt',
      'Du nutzt Sinnfragen, um Verantwortung zu vermeiden',
      'Du machst Gespräche zu schwer und bedrückend'
    ]),
    gifts: JSON.stringify([
      'Sprache als Sinnvermittler',
      'Positionierung durch klare Sinnbotschaften',
      'Marketing mit tieferen Werten',
      'Kommunikation als Orientierung'
    ]),
    affirmation: 'Ich spreche über Sinn und Richtung. Ich spreche über den tieferen Wert meiner Arbeit.',
    center_name: "ROOT"
  };

  insertMercuryGate.run(
    mercuryGate28.id,
    mercuryGate28.planet_name,
    mercuryGate28.gate_number,
    mercuryGate28.name,
    mercuryGate28.essence,
    mercuryGate28.consciousness,
    mercuryGate28.description,
    mercuryGate28.deep_meaning,
    mercuryGate28.shadow_aspects,
    mercuryGate28.gifts,
    mercuryGate28.affirmation,
    mercuryGate28.center_name
  );

  // Tor 29 - Commitment (Mercury-spezifisch)
  const mercuryGate29 = {
    id: 'mercury_gate_29',
    planet_name: 'Mercury',
    gate_number: 29,
    name: 'Commitment',
    essence: 'Die Stimme des Commitments - Unbewusste Verbindlichkeit durch bewusste Hingabe',
    consciousness: 'Sprache als Vertrauensbasis - Bewusste Glaubwürdigkeit durch verbindliche Kommunikation',
    description: 'Tor 29 im bewussten Merkur: Deine Worte haben Gewicht, weil sie Bindung ausdrücken. Ein "Ja" von dir ist kein Lippenbekenntnis – es ist eine Entscheidung. Sprache ist für dich nicht beliebig. Du spürst, dass Worte Verpflichtungen schaffen können – und du willst, dass sie ehrlich sind. Mit Tor 29 sind deine Worte wie Verträge. Wenn du dich festlegst, spüren andere: Das ist verbindlich.',
    deep_meaning: 'Der Tanz zwischen Hingabe und Überforderung: Zu viel Hingabe: Du sagst zu allem Ja und brennst aus. Zu wenig Hingabe: Deine Worte verlieren ihre Kraft. Deine Kunst liegt darin, bewusst und klar zu wählen, wozu du dich sprachlich verpflichtest.',
    shadow_aspects: JSON.stringify([
      'Du sagst Ja, um Konflikte zu vermeiden',
      'Du versprichst mehr, als du leisten kannst',
      'Du bindest dich, ohne dich geprüft zu haben',
      'Du sagst zu allem Ja und brennst aus'
    ]),
    gifts: JSON.stringify([
      'Sprache als Vertrauensbasis',
      'Positionierung durch klare Zusagen',
      'Marketing mit Glaubwürdigkeit',
      'Kommunikation als Versprechen'
    ]),
    affirmation: 'Ich spreche mit Hingabe. Meine Worte schaffen Vertrauen durch Verbindlichkeit.',
    center_name: "SPLEEN"
  };

  insertMercuryGate.run(
    mercuryGate29.id,
    mercuryGate29.planet_name,
    mercuryGate29.gate_number,
    mercuryGate29.name,
    mercuryGate29.essence,
    mercuryGate29.consciousness,
    mercuryGate29.description,
    mercuryGate29.deep_meaning,
    mercuryGate29.shadow_aspects,
    mercuryGate29.gifts,
    mercuryGate29.affirmation,
    mercuryGate29.center_name
  );

  // Tor 30 - Leidenschaft (Mercury-spezifisch)
  const mercuryGate30 = {
    id: 'mercury_gate_30',
    planet_name: 'Mercury',
    gate_number: 30,
    name: 'Leidenschaft',
    essence: 'Die Stimme der Leidenschaft - Unbewusste Intensität durch bewusste Emotion',
    consciousness: 'Sprache als emotionaler Anker - Bewusste Herzenergie durch leidenschaftliche Kommunikation',
    description: 'Tor 30 im bewussten Merkur: Deine Worte sind nicht nur Information – sie sind Emotion, sie sind Feuer, sie sind der Ausdruck dessen, was dich im Innersten bewegt. Du kannst Gefühle so formulieren, dass andere sie miterleben. Deine Sprache brennt vor Intensität, weil sie nicht nur aus dem Kopf, sondern aus deinem Herzraum kommt. Für dich ist es schwer, dich mit rein sachlicher Kommunikation zufriedenzugeben. Du möchtest, dass Menschen fühlen, was du meinst – nicht nur, dass sie es verstehen.',
    deep_meaning: 'Der Tanz zwischen Intensität und Balance: Zu viel Feuer: Du überrollst andere mit deiner Emotion. Zu wenig Ausdruck: Du unterdrückst deine Leidenschaft. Deine Kunst liegt darin, dein Feuer so zu kanalisieren, dass es wärmt und inspiriert, statt zu verbrennen.',
    shadow_aspects: JSON.stringify([
      'Du sprichst in Extremen, um Wirkung zu erzeugen',
      'Du hängst an Wunschbildern, ohne ins Handeln zu kommen',
      'Du nutzt Emotion, um Zustimmung zu erzwingen',
      'Du überrollst andere mit deiner Emotion'
    ]),
    gifts: JSON.stringify([
      'Sprache als emotionaler Anker',
      'Positionierung durch Herzenergie',
      'Marketing mit Leidenschaft',
      'Kommunikation als emotionale Zündung'
    ]),
    affirmation: 'Ich spreche meine Sehnsucht aus. Ich verkaufe durch emotionale Verbindung.',
    center_name: "SOLAR_PLEXUS"
  };

  insertMercuryGate.run(
    mercuryGate30.id,
    mercuryGate30.planet_name,
    mercuryGate30.gate_number,
    mercuryGate30.name,
    mercuryGate30.essence,
    mercuryGate30.consciousness,
    mercuryGate30.description,
    mercuryGate30.deep_meaning,
    mercuryGate30.shadow_aspects,
    mercuryGate30.gifts,
    mercuryGate30.affirmation,
    mercuryGate30.center_name
  );

  // Tor 31 - Führung (Mercury-spezifisch)
  const mercuryGate31 = {
    id: 'mercury_gate_31',
    planet_name: 'Mercury',
    gate_number: 31,
    name: 'Führung',
    essence: 'Die Stimme der Führung durch Sprache - Unbewusste Kollektivität durch bewusste Richtung',
    consciousness: 'Sprache als Leadership-Tool - Bewusste Führung durch kollektive Kommunikation',
    description: 'Tor 31 im bewussten Merkur: Deine Worte haben eine kollektive Dimension. Sie sind nicht nur für dich gedacht – sie wirken für eine Gruppe, ein Team, eine Gemeinschaft. Du bist nicht hier, um allein zu sprechen. Du bist hier, um eine Stimme für viele zu sein. Deine Worte tragen Gewicht, weil sie nicht nur deine Sicht widerspiegeln, sondern auch die Bedürfnisse anderer. Mit Tor 31 kannst du Worte finden, die Orientierung für viele schaffen.',
    deep_meaning: 'Der Tanz zwischen Ego und Kollektiv: Zu viel Ego: Du nutzt Sprache für Macht. Zu wenig Stimme: Du hältst dich zurück, obwohl Führung gebraucht wird. Deine Kunst liegt darin, im Namen des Ganzen zu sprechen – ohne dich selbst zu verlieren.',
    shadow_aspects: JSON.stringify([
      'Du formulierst, um Macht zu sichern',
      'Du sagst, was gehört werden will, nicht was nötig ist',
      'Du sprichst über andere hinweg',
      'Du nutzt Sprache für persönliche Macht'
    ]),
    gifts: JSON.stringify([
      'Sprache als Leadership-Tool',
      'Positionierung als Leader',
      'Marketing mit Führungsenergie',
      'Kommunikation als kollektive Stimme'
    ]),
    affirmation: 'Ich spreche als Stimme der Führung. Meine Worte positionieren mich als Leader.',
    center_name: "THROAT"
  };

  insertMercuryGate.run(
    mercuryGate31.id,
    mercuryGate31.planet_name,
    mercuryGate31.gate_number,
    mercuryGate31.name,
    mercuryGate31.essence,
    mercuryGate31.consciousness,
    mercuryGate31.description,
    mercuryGate31.deep_meaning,
    mercuryGate31.shadow_aspects,
    mercuryGate31.gifts,
    mercuryGate31.affirmation,
    mercuryGate31.center_name
  );

  // Tor 32 - Beständigkeit (Mercury-spezifisch)
  const mercuryGate32 = {
    id: 'mercury_gate_32',
    planet_name: 'Mercury',
    gate_number: 32,
    name: 'Beständigkeit',
    essence: 'Die Stimme der Beständigkeit - Unbewusste Stabilität durch bewusste Werte',
    consciousness: 'Sprache als Stabilitätsanker - Bewusste Nachhaltigkeit durch beständige Kommunikation',
    description: 'Tor 32 im bewussten Merkur: Deine Worte haben ein Fundament. Du sprichst nicht, um Trends zu bedienen, sondern um das zu schützen, was sich bewährt hat und tragfähig ist. Für dich ist Kommunikation ein Werkzeug, um Beständigkeit zu sichern. Deine Worte können Vertrauen geben, weil sie auf Nachhaltigkeit und Stabilität ausgerichtet sind. Mit Tor 32 kannst du Worte setzen, die Sicherheit vermitteln, ohne Entwicklungen zu blockieren.',
    deep_meaning: 'Der Tanz zwischen Bewahren und Veränderung: Zu viel Festhalten: Du verteidigst Altes, auch wenn es überholt ist. Zu viel Anpassung: Du verlierst deine Wurzeln. Deine Kunst liegt darin, Beständigkeit nicht mit Stillstand zu verwechseln.',
    shadow_aspects: JSON.stringify([
      'Du verteidigst Altes, auch wenn es überholt ist',
      'Du verlierst deine Wurzeln durch zu viel Anpassung',
      'Du nutzt Sprache nur noch zur Verteidigung',
      'Du verwechselst Beständigkeit mit Stillstand'
    ]),
    gifts: JSON.stringify([
      'Sprache als Stabilitätsanker',
      'Positionierung als Garant für nachhaltigen Erfolg',
      'Marketing mit Beständigkeit',
      'Kommunikation als Wertebewahrung'
    ]),
    affirmation: 'Ich spreche über das, was Bestand hat. Ich sichere den langfristigen Wert meiner Arbeit.',
    center_name: "SPLEEN"
  };

  insertMercuryGate.run(
    mercuryGate32.id,
    mercuryGate32.planet_name,
    mercuryGate32.gate_number,
    mercuryGate32.name,
    mercuryGate32.essence,
    mercuryGate32.consciousness,
    mercuryGate32.description,
    mercuryGate32.deep_meaning,
    mercuryGate32.shadow_aspects,
    mercuryGate32.gifts,
    mercuryGate32.affirmation,
    mercuryGate32.center_name
  );

  // Tor 33 - Rückblick (Mercury-spezifisch)
  const mercuryGate33 = {
    id: 'mercury_gate_33',
    planet_name: 'Mercury',
    gate_number: 33,
    name: 'Rückblick',
    essence: 'Die Stimme des Rückblicks - Unbewusste Weisheit durch bewusste Erfahrung',
    consciousness: 'Sprache als Storytelling-Instrument - Bewusste Geschichte durch erzählende Kommunikation',
    description: 'Tor 33 im bewussten Merkur: Deine Worte haben eine historische Dimension. Du sprichst nicht nur aus dem Moment – du bringst die Weisheit vergangener Erfahrungen in die Gegenwart. Du erkennst, dass Sprache Erinnerungen konserviert. Deine Worte sind oft geprägt von Rückschau, Reflexion und dem Bedürfnis, Erfahrungen weiterzugeben. Mit Tor 33 kannst du Geschichten und Erfahrungen so erzählen, dass andere daraus lernen.',
    deep_meaning: 'Der Tanz zwischen Bewahrung und Loslassen: Festhalten an der Vergangenheit. Vergessen der Erfahrungen. Deine Kunst liegt darin, Worte zu finden, die Lehren bewahren – ohne im Alten zu verharren.',
    shadow_aspects: JSON.stringify([
      'Du hältst an der Vergangenheit fest',
      'Du vergisst wichtige Erfahrungen',
      'Du nutzt Sprache, um in Nostalgie festzuhängen',
      'Du redest, um nicht fühlen zu müssen'
    ]),
    gifts: JSON.stringify([
      'Sprache als Storytelling-Instrument',
      'Positionierung durch Storytelling',
      'Marketing mit gelebter Erfahrung',
      'Kommunikation als Archiv'
    ]),
    affirmation: 'Ich spreche aus Erfahrung. Meine Worte machen meine Geschichte zu einem Asset.',
    center_name: "THROAT"
  };

  insertMercuryGate.run(
    mercuryGate33.id,
    mercuryGate33.planet_name,
    mercuryGate33.gate_number,
    mercuryGate33.name,
    mercuryGate33.essence,
    mercuryGate33.consciousness,
    mercuryGate33.description,
    mercuryGate33.deep_meaning,
    mercuryGate33.shadow_aspects,
    mercuryGate33.gifts,
    mercuryGate33.affirmation,
    mercuryGate33.center_name
  );

  // Tor 34 - Handlungskraft (Mercury-spezifisch)
  const mercuryGate34 = {
    id: 'mercury_gate_34',
    planet_name: 'Mercury',
    gate_number: 34,
    name: 'Handlungskraft',
    essence: 'Die Stimme der reinen Handlungskraft - Unbewusste Energie durch bewusste Aktion',
    consciousness: 'Sprache als Handlungsimpuls - Bewusste Aktivierung durch kraftvolle Kommunikation',
    description: 'Tor 34 im bewussten Merkur: In deiner Sprache liegt eine unmittelbare Energie. Deine Worte sind nicht nur Ideen – sie sind wie ein Startschuss. Du redest nicht endlos um etwas herum, sondern bringst Dinge in Bewegung. Menschen spüren, dass hinter deinen Aussagen echte Kraft steckt – nicht nur Absicht, sondern Bereitschaft zu handeln. Für dich fühlt sich Kommunikation erst dann vollständig an, wenn sie in eine Handlung übergeht.',
    deep_meaning: 'Der Tanz zwischen Impulsivität und Fokus: Zu viel Energie: Du überrollst andere mit Dringlichkeit. Zu wenig Steuerung: Deine Worte sind kraftvoll, aber zerstreut. Deine Kunst liegt darin, Kraft so zu kanalisieren, dass sie wirksam wird, ohne zu überfordern.',
    shadow_aspects: JSON.stringify([
      'Du bist laut, aber nicht wirksam',
      'Du drängst, statt einzuladen',
      'Du nutzt Worte wie Druckmittel',
      'Du überrollst andere mit Dringlichkeit'
    ]),
    gifts: JSON.stringify([
      'Sprache als Handlungsimpuls',
      'Positionierung durch kraftvolle Kommunikation',
      'Marketing mit Aktivierung',
      'Kommunikation als Energieübertragung'
    ]),
    affirmation: 'Ich spreche mit Kraft. Ich bringe durch meine Worte Projekte in Bewegung.',
    center_name: "ROOT"
  };

  insertMercuryGate.run(
    mercuryGate34.id,
    mercuryGate34.planet_name,
    mercuryGate34.gate_number,
    mercuryGate34.name,
    mercuryGate34.essence,
    mercuryGate34.consciousness,
    mercuryGate34.description,
    mercuryGate34.deep_meaning,
    mercuryGate34.shadow_aspects,
    mercuryGate34.gifts,
    mercuryGate34.affirmation,
    mercuryGate34.center_name
  );

  // Tor 35 - Erfahrung (Mercury-spezifisch)
  const mercuryGate35 = {
    id: 'mercury_gate_35',
    planet_name: 'Mercury',
    gate_number: 35,
    name: 'Erfahrung',
    essence: 'Die Stimme der Erfahrung - Unbewusste Vielfalt durch bewusste Erlebnisse',
    consciousness: 'Sprache als Storytelling-Kraft - Bewusste Inspiration durch erfahrungsbasierte Kommunikation',
    description: 'Tor 35 im bewussten Merkur: Deine Worte sind bunt und vielfältig. Du sprichst nicht nur aus Theorie, sondern aus gelebter Erfahrung. Du ziehst Sprache aus einem reichen Fundus an Erlebnissen. Deine Worte zeigen, dass du ausprobiert, erlebt, erfahren hast. Mit Tor 35 bist du Geschichtenerzähler. Deine Worte nehmen andere mit auf Reisen – ob in Erlebnisse, Projekte oder Visionen.',
    deep_meaning: 'Der Tanz zwischen Abwechslung und Fokus: Du springst zu sehr zwischen Themen. Du bleibst zu eng und verlierst Lebendigkeit. Deine Kunst liegt darin, Erfahrungen in Worte zu fassen, die sowohl Vielfalt als auch Klarheit zeigen.',
    shadow_aspects: JSON.stringify([
      'Du redest, um nicht fühlen zu müssen',
      'Du sammelst Geschichten, statt sie zu verdauen',
      'Du flüchtest in Erlebnisse, statt Tiefe zu finden',
      'Du springst zu sehr zwischen Themen'
    ]),
    gifts: JSON.stringify([
      'Sprache als Storytelling-Kraft',
      'Positionierung durch gelebte Erfahrung',
      'Marketing mit Vielfalt',
      'Kommunikation als Erzählen'
    ]),
    affirmation: 'Ich spreche aus Erfahrung. Meine Worte erzählen die Reise meines Angebots.',
    center_name: "THROAT"
  };

  insertMercuryGate.run(
    mercuryGate35.id,
    mercuryGate35.planet_name,
    mercuryGate35.gate_number,
    mercuryGate35.name,
    mercuryGate35.essence,
    mercuryGate35.consciousness,
    mercuryGate35.description,
    mercuryGate35.deep_meaning,
    mercuryGate35.shadow_aspects,
    mercuryGate35.gifts,
    mercuryGate35.affirmation,
    mercuryGate35.center_name
  );

  // Tor 36 - Herausforderung (Mercury-spezifisch)
  const mercuryGate36 = {
    id: 'mercury_gate_36',
    planet_name: 'Mercury',
    gate_number: 36,
    name: 'Herausforderung',
    essence: 'Die Stimme der Erfahrung aus der Herausforderung - Unbewusste Transformation durch bewusste Krise',
    consciousness: 'Sprache als Transformationsraum - Bewusste Krisenkommunikation durch herzvolle Begleitung',
    description: 'Tor 36 im bewussten Merkur: Deine Worte haben eine besondere Tiefe, weil sie aus intensiven Erfahrungen stammen. Du kennst den Umgang mit Unsicherheit, Wandel und plötzlichen Veränderungen – und kannst diese Erfahrung in Sprache übersetzen, die andere beruhigt und stärkt. Für dich ist Sprache ein Werkzeug, um Chaos zu ordnen und Unsicherheit greifbar zu machen. Du kannst Gefühle benennen, die andere nicht aussprechen, und so einen Raum schaffen, in dem Transformation beginnt.',
    deep_meaning: 'Der Tanz zwischen Dramatik und Stabilität: Zu viel Drama: Du verstärkst Unsicherheit. Zu viel Kontrolle: Du unterdrückst Intensität. Deine Kunst liegt darin, Emotionen zuzulassen, aber Worte zu wählen, die Halt geben.',
    shadow_aspects: JSON.stringify([
      'Du sprichst in Extremen',
      'Du suchst Aufmerksamkeit über Dramatik',
      'Du bleibst im Problem hängen',
      'Du verstärkst Unsicherheit durch Drama'
    ]),
    gifts: JSON.stringify([
      'Sprache als Transformationsraum',
      'Positionierung durch Krisenkommunikation mit Herz',
      'Marketing mit Stabilität in unsicheren Zeiten',
      'Kommunikation als Wandelbegleitung'
    ]),
    affirmation: 'Ich spreche über das, was herausfordert. Ich nutze meine Sprache, um Wandel zu begleiten.',
    center_name: "SOLAR_PLEXUS"
  };

  insertMercuryGate.run(
    mercuryGate36.id,
    mercuryGate36.planet_name,
    mercuryGate36.gate_number,
    mercuryGate36.name,
    mercuryGate36.essence,
    mercuryGate36.consciousness,
    mercuryGate36.description,
    mercuryGate36.deep_meaning,
    mercuryGate36.shadow_aspects,
    mercuryGate36.gifts,
    mercuryGate36.affirmation,
    mercuryGate36.center_name
  );

  // Tor 37 - Gemeinschaft (Mercury-spezifisch)
  const mercuryGate37 = {
    id: 'mercury_gate_37',
    planet_name: 'Mercury',
    gate_number: 37,
    name: 'Gemeinschaft',
    essence: 'Die Stimme der Gemeinschaft - Unbewusste Bindung durch bewusste Verbindung',
    consciousness: 'Sprache als Bindung - Bewusste Gemeinschaft durch ehrliche Kommunikation',
    description: 'Tor 37 im bewussten Merkur: Deine Worte sind getragen von dem Wunsch nach Miteinander. Du sprichst, um Nähe und Verbindlichkeit zu schaffen. Sprache ist für dich ein Mittel, um Bande zu knüpfen und Vertrauen zu stärken. Mit Tor 37 kannst du Sprache nutzen, um Brücken zu bauen – zwischen Partnern, Familien, Gruppen. Deine Worte schaffen Vertrauen und Verlässlichkeit.',
    deep_meaning: 'Der Tanz zwischen Nähe und Abgrenzung: Du sprichst nur, um dazuzugehören. Du schweigst, um unabhängig zu bleiben. Deine Kunst liegt darin, ehrlich und verbindend zu sprechen.',
    shadow_aspects: JSON.stringify([
      'Du forderst Loyalität, ohne sie zu geben',
      'Du passt dich übermäßig an',
      'Du vermeidest ehrliche Konfrontation',
      'Du sprichst nur, um dazuzugehören'
    ]),
    gifts: JSON.stringify([
      'Sprache als Bindung',
      'Positionierung durch Gemeinschaftssinn',
      'Marketing mit Kundenbindung',
      'Kommunikation als Brückenbau'
    ]),
    affirmation: 'Ich spreche, um Gemeinschaft zu stärken. Meine Worte stärken mein Team.',
    center_name: "HEART"
  };

  insertMercuryGate.run(
    mercuryGate37.id,
    mercuryGate37.planet_name,
    mercuryGate37.gate_number,
    mercuryGate37.name,
    mercuryGate37.essence,
    mercuryGate37.consciousness,
    mercuryGate37.description,
    mercuryGate37.deep_meaning,
    mercuryGate37.shadow_aspects,
    mercuryGate37.gifts,
    mercuryGate37.affirmation,
    mercuryGate37.center_name
  );

  // Tor 38 - Standpunkt (Mercury-spezifisch)
  const mercuryGate38 = {
    id: 'mercury_gate_38',
    planet_name: 'Mercury',
    gate_number: 38,
    name: 'Standpunkt',
    essence: 'Die Stimme des Standpunkts - Unbewusste Haltung durch bewusste Klarheit',
    consciousness: 'Sprache als Positionslicht - Bewusste Werteverteidigung durch strategische Kommunikation',
    description: 'Tor 38 im bewussten Merkur: In deiner Sprache liegt eine kämpferische, entschlossene Frequenz – nicht im Sinne von Streitlust, sondern im Sinne von Haltung. Du bist nicht hier, um alles zu akzeptieren. Du bist hier, um klar zu benennen, wo es sich lohnt, Haltung zu zeigen. Für dich ist Kommunikation ein Mittel, Werte zu schützen. Du erhebst deine Stimme, wenn etwas gegen deine Überzeugungen verstößt – und genau dann spüren andere deine Klarheit.',
    deep_meaning: 'Der Tanz zwischen Kampfgeist und Starrheit: Zu viel Widerstand: Kämpfen um des Kämpfens willen. Zu wenig Standpunkt: Konflikte vermeiden und Klarheit verlieren. Deine Kunst liegt darin, gezielt zu wählen, wo deine Stimme den größten Unterschied macht.',
    shadow_aspects: JSON.stringify([
      'Widerspruch aus Prinzip',
      'Alte Standpunkte verteidigen',
      'Sprache für Konfrontation statt Lösung',
      'Kämpfen um des Kämpfens willen'
    ]),
    gifts: JSON.stringify([
      'Sprache als Positionslicht',
      'Positionierung durch klare Werteverteidigung',
      'Marketing mit Rückgrat',
      'Kommunikation als Werte-Schutzschild'
    ]),
    affirmation: 'Ich spreche, um für das Wesentliche einzustehen. Ich positioniere mich klar zu dem, wofür ich stehe.',
    center_name: "ROOT"
  };

  insertMercuryGate.run(
    mercuryGate38.id,
    mercuryGate38.planet_name,
    mercuryGate38.gate_number,
    mercuryGate38.name,
    mercuryGate38.essence,
    mercuryGate38.consciousness,
    mercuryGate38.description,
    mercuryGate38.deep_meaning,
    mercuryGate38.shadow_aspects,
    mercuryGate38.gifts,
    mercuryGate38.affirmation,
    mercuryGate38.center_name
  );

  // Tor 39 - Provokation (Mercury-spezifisch)
  const mercuryGate39 = {
    id: 'mercury_gate_39',
    planet_name: 'Mercury',
    gate_number: 39,
    name: 'Provokation',
    essence: 'Die Stimme der Provokation - Unbewusste Bewegung durch bewusste Herausforderung',
    consciousness: 'Sprache als Innovationskraft - Bewusste Musterbrechung durch konstruktive Provokation',
    description: 'Tor 39 im bewussten Merkur: Deine Worte haben oft einen provozierenden Klang. Nicht, um zu verletzen – sondern um ins Nachdenken zu bringen. Du bist nicht hier, um es allen recht zu machen. Du bist hier, um Themen anzustoßen. Deine Sprache testet Grenzen. Du merkst schnell, wo Stillstand herrscht – und setzt dann Worte, die herausfordern. Mit Tor 39 kannst du Dinge ansprechen, die andere lieber vermeiden. Deine Worte sind wie Impulse, die Bewegung auslösen.',
    deep_meaning: 'Der Tanz zwischen Reiz und Inspiration: Worte, die blockieren. Worte, die befreien. Die Kunst ist es, deine Provokation konstruktiv einzusetzen.',
    shadow_aspects: JSON.stringify([
      'Du provozierst nur, um zu stören',
      'Du verletzt, statt zu inspirieren',
      'Du rebellierst ohne Ziel',
      'Zu viel Provokation wirkt destruktiv'
    ]),
    gifts: JSON.stringify([
      'Sprache als Innovationskraft',
      'Positionierung durch klare Reibungspunkte',
      'Marketing mit Musterbrechung',
      'Kommunikation als Wachrütteln'
    ]),
    affirmation: 'Ich spreche, um Anstoß zu geben. Meine Worte brechen Muster auf.',
    center_name: "ROOT"
  };

  insertMercuryGate.run(
    mercuryGate39.id,
    mercuryGate39.planet_name,
    mercuryGate39.gate_number,
    mercuryGate39.name,
    mercuryGate39.essence,
    mercuryGate39.consciousness,
    mercuryGate39.description,
    mercuryGate39.deep_meaning,
    mercuryGate39.shadow_aspects,
    mercuryGate39.gifts,
    mercuryGate39.affirmation,
    mercuryGate39.center_name
  );

  // Tor 42 - Vollendung (Mercury-spezifisch)
  const mercuryGate42 = {
    id: 'mercury_gate_42',
    planet_name: 'Mercury',
    gate_number: 42,
    name: 'Vollendung',
    essence: 'Die Stimme der Vollendung - Unbewusste Beständigkeit durch bewusste Abschlusskraft',
    consciousness: 'Sprache als Klammer - Bewusste Projektführung bis zur Reife durch klare Kommunikation',
    description: 'Tor 42 im bewussten Merkur: Deine Worte tragen die Energie von Beständigkeit und Abschluss. Du bist nicht hier, um Dinge nur anzustoßen – du bist hier, um sie zu begleiten, bis sie rund und reif sind. Sprache ist für dich ein Werkzeug, um Dinge abzuschließen. Du willst nicht, dass etwas ungesagt bleibt – genauso wenig wie du halbe Wege akzeptierst. Mit Tor 42 gibst du Erlebnissen einen Rahmen. Du sprichst, um etwas zu runden und einen klaren Abschluss zu schaffen.',
    deep_meaning: 'Der Tanz zwischen Ausdauer und Loslassen: Zu viel Festhalten: Du bleibst, obwohl es vorbei ist. Zu schnelles Loslassen: Du brichst ab, bevor etwas reifen konnte. Deine Kunst liegt darin, zu erkennen, wann noch ein Satz gebraucht wird – und wann Schweigen Vollendung ist.',
    shadow_aspects: JSON.stringify([
      'Du bleibst, obwohl es vorbei ist',
      'Du brichst ab, bevor etwas reifen konnte',
      'Du verwechselst Abschluss mit Kontrolle',
      'Du hältst fest, obwohl es rund ist'
    ]),
    gifts: JSON.stringify([
      'Sprache als Klammer',
      'Positionierung als Partner für Ganzheit',
      'Marketing mit Projektführung bis zur Reife',
      'Kommunikation als Vollendung'
    ]),
    affirmation: 'Ich spreche Geschichten zu Ende. Ich führe Projekte bis zur Reife.',
    center_name: "SACRAL"
  };

  insertMercuryGate.run(
    mercuryGate42.id,
    mercuryGate42.planet_name,
    mercuryGate42.gate_number,
    mercuryGate42.name,
    mercuryGate42.essence,
    mercuryGate42.consciousness,
    mercuryGate42.description,
    mercuryGate42.deep_meaning,
    mercuryGate42.shadow_aspects,
    mercuryGate42.gifts,
    mercuryGate42.affirmation,
    mercuryGate42.center_name
  );

  // Tor 43 - Einsicht (Mercury-spezifisch)
  const mercuryGate43 = {
    id: 'mercury_gate_43',
    planet_name: 'Mercury',
    gate_number: 43,
    name: 'Einsicht',
    essence: 'Die Stimme der Einsicht - Unbewusste Durchbrüche durch bewusste Klarheit',
    consciousness: 'Sprache als Offenbarung - Bewusste Innovation durch frische Einsichten und plötzliche Klarheit',
    description: 'Tor 43 im bewussten Merkur: Deine Worte tragen oft etwas Überraschendes. Du sprichst nicht linear – du sprichst, wenn plötzlich ein Geistesblitz kommt. Sprache ist für dich Ausdruck von Erkenntnis. Manchmal kommen deine Worte unerwartet, aber mit so viel Klarheit, dass sie alles verändern können. Mit Tor 43 bist du die Stimme, die Dinge ausspricht, die andere spüren, aber nicht greifen können. Deine Sprache kann wie ein Schlüssel wirken.',
    deep_meaning: 'Der Tanz zwischen Genialität und Unverständnis: Worte sind zu komplex, niemand versteht dich. Worte sind zu reduziert, die Tiefe geht verloren. Deine Kunst liegt darin, deine Einsichten so zu übersetzen, dass sie zugänglich sind.',
    shadow_aspects: JSON.stringify([
      'Du hältst deine Einsichten zurück',
      'Du fürchtest, komisch zu wirken',
      'Worte sind zu komplex, niemand versteht dich',
      'Du wirst nicht verstanden'
    ]),
    gifts: JSON.stringify([
      'Sprache als Offenbarung',
      'Positionierung durch frische Einsichten',
      'Marketing mit Innovation',
      'Kommunikation als Durchbruch'
    ]),
    affirmation: 'Ich spreche meine Einsichten. Meine Worte bringen Innovation.',
    center_name: "AJNA"
  };

  insertMercuryGate.run(
    mercuryGate43.id,
    mercuryGate43.planet_name,
    mercuryGate43.gate_number,
    mercuryGate43.name,
    mercuryGate43.essence,
    mercuryGate43.consciousness,
    mercuryGate43.description,
    mercuryGate43.deep_meaning,
    mercuryGate43.shadow_aspects,
    mercuryGate43.gifts,
    mercuryGate43.affirmation,
    mercuryGate43.center_name
  );

  // Tor 40 - Verbindlichkeit (Mercury-spezifisch)
  const mercuryGate40 = {
    id: 'mercury_gate_40',
    planet_name: 'Mercury',
    gate_number: 40,
    name: 'Verbindlichkeit',
    essence: 'Die Stimme der Verlässlichkeit - Unbewusste Bindung durch bewusste Klarheit',
    consciousness: 'Sprache als Bindungspunkt - Bewusste Vertrauensbildung durch klare Zusagen und Verbindlichkeit',
    description: 'Tor 40 im bewussten Merkur: In deiner Sprache liegt eine Qualität, die Vertrauen schafft. Deine Worte wirken wie ein Handschlag – ehrlich, klar und bindend. Für dich ist Kommunikation nicht nur Ausdruck, sondern auch ein Vertrag. Du willst, dass andere wissen, worauf sie sich verlassen können. Mit Tor 40 kannst du Beziehungen durch klare Worte stabilisieren.',
    deep_meaning: 'Der Tanz zwischen Geben und Abgrenzung: Zu viel Geben: Du verpflichtest dich über deine Grenzen hinaus. Zu viel Abgrenzung: Du wirkst kühl. Deine Kunst liegt darin, klar zu sagen, was du leisten kannst – und gleichzeitig offen für Verbindung zu bleiben.',
    shadow_aspects: JSON.stringify([
      'Du verpflichtest dich über deine Grenzen hinaus',
      'Du gibst Zusagen aus Pflichtgefühl',
      'Du wirkst kühl durch zu viel Abgrenzung',
      'Du versprichst zu schnell'
    ]),
    gifts: JSON.stringify([
      'Sprache als Bindungspunkt',
      'Positionierung als verlässlicher Partner',
      'Marketing mit klaren Zusagen',
      'Kommunikation als Vertrauensbildung'
    ]),
    affirmation: 'Ich spreche Verbindlichkeit aus. Ich schaffe Vertrauen durch klare Zusagen.',
    center_name: "HEART"
  };

  insertMercuryGate.run(
    mercuryGate40.id,
    mercuryGate40.planet_name,
    mercuryGate40.gate_number,
    mercuryGate40.name,
    mercuryGate40.essence,
    mercuryGate40.consciousness,
    mercuryGate40.description,
    mercuryGate40.deep_meaning,
    mercuryGate40.shadow_aspects,
    mercuryGate40.gifts,
    mercuryGate40.affirmation,
    mercuryGate40.center_name
  );

  // Tor 41 - Beginn (Mercury-spezifisch)
  const mercuryGate41 = {
    id: 'mercury_gate_41',
    planet_name: 'Mercury',
    gate_number: 41,
    name: 'Beginn',
    essence: 'Die Stimme des Beginns - Unbewusste Initiation durch bewusste Impulse',
    consciousness: 'Sprache als Anfangspunkt - Bewusste Projektinitiation durch inspirierende Kommunikation',
    description: 'Tor 41 im bewussten Merkur: Deine Worte sind wie ein Startschuss. Du gibst den ersten Impuls – nicht immer das ganze Ziel, aber den Anfang. Deine Sprache ist oft ein Anstoß für Veränderungen. Mit Tor 41 kannst du mit Worten Neugier wecken, Energie freisetzen und Richtung eröffnen.',
    deep_meaning: 'Der Tanz zwischen Vision und Umsetzung: Worte voller Träume, ohne Handlung. Worte, die blockieren, weil du den Anfang scheust. Deine Kunst ist es, Sprache als Einladung in etwas Neues zu nutzen.',
    shadow_aspects: JSON.stringify([
      'Du fängst an, ohne durchzuhalten',
      'Du hast Angst vor dem ersten Schritt',
      'Worte voller Träume, ohne Handlung',
      'Zu viele Impulse wirken flatterhaft'
    ]),
    gifts: JSON.stringify([
      'Sprache als Anfangspunkt',
      'Positionierung durch Mut zum Anfang',
      'Marketing mit Projektinitiation',
      'Kommunikation als Startimpuls'
    ]),
    affirmation: 'Ich spreche den Anfang aus. Ich starte durch meine Kommunikation neue Projekte.',
    center_name: "ROOT"
  };

  insertMercuryGate.run(
    mercuryGate41.id,
    mercuryGate41.planet_name,
    mercuryGate41.gate_number,
    mercuryGate41.name,
    mercuryGate41.essence,
    mercuryGate41.consciousness,
    mercuryGate41.description,
    mercuryGate41.deep_meaning,
    mercuryGate41.shadow_aspects,
    mercuryGate41.gifts,
    mercuryGate41.affirmation,
    mercuryGate41.center_name
  );

  console.log('[LOCAL-DB] Mercury Tor 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42 & 43 Daten erfolgreich hinzugefügt');
}

// Datenbank-Operationen
export const localDb = {
  db: db,
  
  // Chiron Gates
  getAllChironGates: () => {
    const stmt = db.prepare('SELECT * FROM chiron_gates ORDER BY gate_number');
    return stmt.all();
  },
  
  getChironGate: (gateNumber: number) => {
    const stmt = db.prepare('SELECT * FROM chiron_gates WHERE gate_number = ?');
    return stmt.get(gateNumber);
  },
  
  getChironGatesByCenter: (centerName: string) => {
    const stmt = db.prepare('SELECT * FROM chiron_gates WHERE center_name = ? ORDER BY gate_number');
    return stmt.all(centerName);
  },
  
  // Chiron Centers
  getAllChironCenters: () => {
    const stmt = db.prepare('SELECT * FROM chiron_centers ORDER BY center_name');
    return stmt.all();
  },
  
  getChironCenter: (centerName: string) => {
    const stmt = db.prepare('SELECT * FROM chiron_centers WHERE center_name = ?');
    return stmt.get(centerName);
  },
  
  // Chiron Healing Practices
  getAllChironHealingPractices: () => {
    const stmt = db.prepare('SELECT * FROM chiron_healing_practices ORDER BY name');
    return stmt.all();
  },
  
  getChironHealingPractice: (id: string) => {
    const stmt = db.prepare('SELECT * FROM chiron_healing_practices WHERE id = ?');
    return stmt.get(id);
  },
  
  // Chiron Transits
  getUserChironTransits: (userId: string) => {
    const stmt = db.prepare('SELECT * FROM chiron_transits WHERE user_id = ? ORDER BY transit_date DESC');
    return stmt.all(userId);
  },
  
  // Chiron Wounds
  getUserChironWounds: (userId: string) => {
    const stmt = db.prepare('SELECT * FROM chiron_wounds WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId);
  },
  
  // Chiron Healing Sessions
  getUserChironHealingSessions: (userId: string) => {
    const stmt = db.prepare('SELECT * FROM chiron_healing_sessions WHERE user_id = ? ORDER BY session_date DESC');
    return stmt.all(userId);
  },
  
  // Planet Info
  getAllPlanetInfo: () => {
    const stmt = db.prepare('SELECT * FROM planet_info ORDER BY planet_name');
    return stmt.all();
  },
  
  getPlanetInfo: (planetName: string) => {
    const stmt = db.prepare('SELECT * FROM planet_info WHERE planet_name = ?');
    return stmt.get(planetName);
  },
  
  // Planet Gates
  getAllPlanetGates: (planetName: string) => {
    const stmt = db.prepare('SELECT * FROM planet_gates WHERE planet_name = ? ORDER BY gate_number');
    return stmt.all(planetName);
  },
  
  getPlanetGate: (planetName: string, gateNumber: number) => {
    const stmt = db.prepare('SELECT * FROM planet_gates WHERE planet_name = ? AND gate_number = ?');
    return stmt.get(planetName, gateNumber);
  },
  
  getPlanetGatesByCenter: (planetName: string, centerName: string) => {
    const stmt = db.prepare('SELECT * FROM planet_gates WHERE planet_name = ? AND center_name = ? ORDER BY gate_number');
    return stmt.all(planetName, centerName);
  },
  
  // Planet Centers
  getAllPlanetCenters: (planetName: string) => {
    const stmt = db.prepare('SELECT * FROM planet_centers WHERE planet_name = ? ORDER BY center_name');
    return stmt.all(planetName);
  },
  
  getPlanetCenter: (planetName: string, centerName: string) => {
    const stmt = db.prepare('SELECT * FROM planet_centers WHERE planet_name = ? AND center_name = ?');
    return stmt.get(planetName, centerName);
  },
  
  // Alle Gates für einen Planeten (erste 8 für Anzeige)
  getPlanetGatesFirst8: (planetName: string) => {
    const stmt = db.prepare('SELECT * FROM planet_gates WHERE planet_name = ? AND gate_number <= 8 ORDER BY gate_number');
    return stmt.all(planetName);
  },
  
  // Users
  createUser: (userData: any) => {
    const stmt = db.prepare(`
      INSERT INTO users (id, username, email, password_hash, name, birthdate, birthplace, location, bio, age, hd_type, profile, authority, strategy, centers, channels, gates, planets, chart_data, images, interests, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const id = Math.random().toString(36).substr(2, 9);
    return stmt.run(id, userData.username, userData.email, userData.password_hash, 
                   userData.name, userData.birthdate, userData.birthplace, userData.location, 
                   userData.bio, userData.age, userData.hd_type, userData.profile, 
                   userData.authority, userData.strategy, 
                   JSON.stringify(userData.centers || {}), 
                   JSON.stringify(userData.channels || {}), 
                   JSON.stringify(userData.gates || {}), 
                   JSON.stringify(userData.planets || {}), 
                   JSON.stringify(userData.chart_data || {}), 
                   JSON.stringify(userData.images || []), 
                   JSON.stringify(userData.interests || []), 
                   userData.avatar);
  },

  getUserByEmail: (email: string) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  getUserById: (id: string) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  },

  // Charts
  createChart: (chartData: any) => {
    const stmt = db.prepare(`
      INSERT INTO charts (id, user_id, name, birth_date, birth_time, birth_place, chart_data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const id = Math.random().toString(36).substr(2, 9);
    return stmt.run(id, chartData.user_id, chartData.name, chartData.birth_date,
                   chartData.birth_time, chartData.birth_place, JSON.stringify(chartData.chart_data));
  },

  getChartsByUserId: (userId: string) => {
    const stmt = db.prepare('SELECT * FROM charts WHERE user_id = ?');
    return stmt.all(userId);
  },

  // Knowledge
  createKnowledgeItem: (itemData: any) => {
    const stmt = db.prepare(`
      INSERT INTO knowledge_items (id, title, content, type, ref_key, scope, quality)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const id = Math.random().toString(36).substr(2, 9);
    return stmt.run(id, itemData.title, itemData.content, itemData.type,
                   itemData.ref_key, itemData.scope, itemData.quality || 'draft');
  },

  getKnowledgeItems: (type?: string) => {
    if (type) {
      const stmt = db.prepare('SELECT * FROM knowledge_items WHERE type = ?');
      return stmt.all(type);
    } else {
      const stmt = db.prepare('SELECT * FROM knowledge_items');
      return stmt.all();
    }
  },

  // Admins
  createAdmin: (adminData: any) => {
    const stmt = db.prepare(`
      INSERT INTO admins (id, username, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    const id = Math.random().toString(36).substr(2, 9);
    return stmt.run(id, adminData.username, adminData.email, adminData.password_hash, 'admin');
  },

  getAdminByEmail: (email: string) => {
    const stmt = db.prepare('SELECT * FROM admins WHERE email = ?');
    return stmt.get(email);
  },

  // Swipes
  createSwipe: (swipeData: any) => {
    const stmt = db.prepare(`
      INSERT INTO swipes (id, user_id, target_id, liked, is_super_like, compatibility_score)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const id = Math.random().toString(36).substr(2, 9);
    return stmt.run(id, swipeData.user_id, swipeData.target_id, swipeData.liked, 
                   swipeData.is_super_like || false, swipeData.compatibility_score || 0);
  },

  getSwipesByUserId: (userId: string) => {
    const stmt = db.prepare('SELECT * FROM swipes WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId);
  },

  // Matches
  createMatch: (matchData: any) => {
    const stmt = db.prepare(`
      INSERT INTO matches (id, user_a, user_b, compatibility_score, relationship_type)
      VALUES (?, ?, ?, ?, ?)
    `);
    const id = Math.random().toString(36).substr(2, 9);
    return stmt.run(id, matchData.user_a, matchData.user_b, matchData.compatibility_score, 
                   matchData.relationship_type || 'romantic');
  },

  getMatchesByUserId: (userId: string) => {
    const stmt = db.prepare(`
      SELECT m.*, 
             u1.name as user_a_name, u1.avatar as user_a_avatar,
             u2.name as user_b_name, u2.avatar as user_b_avatar
      FROM matches m
      LEFT JOIN users u1 ON m.user_a = u1.id
      LEFT JOIN users u2 ON m.user_b = u2.id
      WHERE m.user_a = ? OR m.user_b = ?
      ORDER BY m.created_at DESC
    `);
    return stmt.all(userId, userId);
  },

  // Compatibility Analysis
  createCompatibilityAnalysis: (analysisData: any) => {
    const stmt = db.prepare(`
      INSERT INTO compatibility_analysis (id, user_a, user_b, overall_score, breakdown, strengths, challenges, recommendations, detailed_analysis, relationship_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const id = Math.random().toString(36).substr(2, 9);
    return stmt.run(id, analysisData.user_a, analysisData.user_b, analysisData.overall_score,
                   JSON.stringify(analysisData.breakdown), 
                   JSON.stringify(analysisData.strengths), 
                   JSON.stringify(analysisData.challenges), 
                   JSON.stringify(analysisData.recommendations), 
                   JSON.stringify(analysisData.detailed_analysis),
                   analysisData.relationship_type || 'romantic');
  },

  getCompatibilityAnalysis: (userA: string, userB: string) => {
    const stmt = db.prepare(`
      SELECT * FROM compatibility_analysis 
      WHERE (user_a = ? AND user_b = ?) OR (user_a = ? AND user_b = ?)
      ORDER BY created_at DESC LIMIT 1
    `);
    return stmt.get(userA, userB, userB, userA);
  },

  // Match Feedback
  createMatchFeedback: (feedbackData: any) => {
    const stmt = db.prepare(`
      INSERT INTO match_feedback (id, user_id, target_id, match_id, rating, feedback, categories)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const id = Math.random().toString(36).substr(2, 9);
    return stmt.run(id, feedbackData.user_id, feedbackData.target_id, feedbackData.match_id,
                   feedbackData.rating, feedbackData.feedback, JSON.stringify(feedbackData.categories || []));
  }
};

// Funktion zum Aktualisieren von Mercury Gate-Daten
export function updateMercuryGate(gateNumber: number, gateData: {
  name?: string;
  essence?: string;
  consciousness?: string;
  description?: string;
  deep_meaning?: string;
  shadow_aspects?: string[];
  gifts?: string[];
  affirmation?: string;
  personal_affirmation?: string;
  business_affirmation?: string;
  business_description?: string;
}) {
  try {
    console.log(`[LOCAL-DB] Aktualisiere Mercury Gate ${gateNumber}...`);
    
    const updateGate = db.prepare(`
      UPDATE planet_gates 
      SET name = COALESCE(?, name),
          essence = COALESCE(?, essence),
          consciousness = COALESCE(?, consciousness),
          description = COALESCE(?, description),
          deep_meaning = COALESCE(?, deep_meaning),
          shadow_aspects = COALESCE(?, shadow_aspects),
          gifts = COALESCE(?, gifts),
          affirmation = COALESCE(?, affirmation),
          personal_affirmation = COALESCE(?, personal_affirmation),
          business_affirmation = COALESCE(?, business_affirmation),
          business_description = COALESCE(?, business_description)
      WHERE planet_name = 'Merkur' AND gate_number = ?
    `);
    
    const result = updateGate.run(
      gateData.name || null,
      gateData.essence || null,
      gateData.consciousness || null,
      gateData.description || null,
      gateData.deep_meaning || null,
      gateData.shadow_aspects ? JSON.stringify(gateData.shadow_aspects) : null,
      gateData.gifts ? JSON.stringify(gateData.gifts) : null,
      gateData.affirmation || null,
      gateData.personal_affirmation || null,
      gateData.business_affirmation || null,
      gateData.business_description || null,
      gateNumber
    );
    
    console.log(`[LOCAL-DB] Mercury Gate ${gateNumber} erfolgreich aktualisiert`);
    return { success: true, changes: result.changes };
  } catch (error) {
    console.error(`[LOCAL-DB] Fehler beim Aktualisieren von Mercury Gate ${gateNumber}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unbekannter Fehler' };
  }
}

// Funktion zum Abrufen eines spezifischen Mercury Gates
export function getMercuryGate(gateNumber: number) {
  try {
    const getGate = db.prepare(`
      SELECT * FROM planet_gates 
      WHERE planet_name = 'Merkur' AND gate_number = ?
    `);
    
    const gate = getGate.get(gateNumber) as any;
    if (gate) {
      // JSON-Felder parsen
      gate.shadow_aspects = gate.shadow_aspects ? JSON.parse(gate.shadow_aspects) : [];
      gate.gifts = gate.gifts ? JSON.parse(gate.gifts) : [];
    }
    
    return gate;
  } catch (error) {
    console.error(`[LOCAL-DB] Fehler beim Abrufen von Mercury Gate ${gateNumber}:`, error);
    return null;
  }
}

export default db;
