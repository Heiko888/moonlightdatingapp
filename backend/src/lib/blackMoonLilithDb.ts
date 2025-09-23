// import Database from 'better-sqlite3';
import path from 'path';

// const dbPath = path.join(process.cwd(), 'blackMoonLilith.db');
// let db: Database.Database;

export function initBlackMoonLilithDatabase() {
  console.log('[BML-DB] SQLite deaktiviert - verwende nur Supabase');
  return; // Früher beenden
    
    db = new Database(dbPath);
    
    // Tabellen erstellen
    createTables();
    
    // Grunddaten einfügen
    initializeBlackMoonLilithBasicData();
    
    console.log('[BML-DB] Black Moon Lilith Datenbank erfolgreich initialisiert');
    return true;
  } catch (error) {
    console.error('[BML-DB] Fehler bei der Initialisierung:', error);
    return false;
  }
}

function createTables() {
  // Black Moon Lilith Grundinformationen
  db.exec(`
    CREATE TABLE IF NOT EXISTS blackmoonlilith_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      symbol TEXT NOT NULL,
      description TEXT,
      mythology TEXT,
      color TEXT,
      orbital_period TEXT,
      discovery TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Black Moon Lilith Centers
  db.exec(`
    CREATE TABLE IF NOT EXISTS blackmoonlilith_centers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      center_name TEXT NOT NULL,
      description TEXT,
      energy_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Black Moon Lilith Gates (bewusst und unbewusst)
  db.exec(`
    CREATE TABLE IF NOT EXISTS blackmoonlilith_gates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gate_number INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      deep_meaning TEXT,
      shadow_aspects TEXT,
      gifts TEXT,
      affirmation TEXT,
      unconscious_description TEXT,
      unconscious_deep_meaning TEXT,
      unconscious_shadow_aspects TEXT,
      unconscious_gifts TEXT,
      unconscious_affirmation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function initializeBlackMoonLilithBasicData() {
  // Black Moon Lilith Grundinformationen
  const insertInfo = db.prepare(`
    INSERT OR REPLACE INTO blackmoonlilith_info 
    (name, symbol, description, mythology, color, orbital_period, discovery)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertInfo.run(
    "Black Moon Lilith",
    "⚸",
    "Black Moon Lilith ist der apogäische Punkt des Mondes - der Punkt, an dem der Mond am weitesten von der Erde entfernt ist. Sie repräsentiert unsere verdrängte, wilde, unabhängige Seite und zeigt, wo wir uns von gesellschaftlichen Erwartungen befreien müssen.",
    "Die dunkle Göttin der Unabhängigkeit",
    "#2D1B69",
    "8.85 Jahre",
    "Berechnet seit der Antike"
  );

  // Black Moon Lilith Centers
  const insertCenter = db.prepare(`
    INSERT OR REPLACE INTO blackmoonlilith_centers 
    (center_name, description, energy_type)
    VALUES (?, ?, ?)
  `);

  const centers = [
    {
      name: "Kopf-Zentrum",
      description: "Black Moon Lilith im Kopf-Zentrum bringt wilde, unkonventionelle Gedanken und Ideen. Du denkst außerhalb der Norm und stellst gesellschaftliche Konzepte in Frage.",
      energy: "Inspiration"
    },
    {
      name: "Hals-Zentrum",
      description: "Black Moon Lilith im Hals-Zentrum gibt dir eine kraftvolle, unabhängige Stimme. Du sprichst deine Wahrheit ohne Kompromisse und weigerst dich, dich anzupassen.",
      energy: "Manifestation"
    },
    {
      name: "G-Zentrum",
      description: "Black Moon Lilith im G-Zentrum zeigt deinen wilden, unabhängigen Lebensweg. Du folgst deiner eigenen Richtung und weigerst dich, den Erwartungen anderer zu entsprechen.",
      energy: "Richtung"
    },
    {
      name: "Herz-Zentrum",
      description: "Black Moon Lilith im Herz-Zentrum bringt wilde, unabhängige Willenskraft. Du kämpfst für deine eigenen Werte und weigerst dich, dich zu verbiegen.",
      energy: "Willenskraft"
    },
    {
      name: "Solarplexus-Zentrum",
      description: "Black Moon Lilith im Solarplexus-Zentrum zeigt deine wilden, ungezähmten Emotionen. Du fühlst tief und intensiv, ohne dich zu entschuldigen.",
      energy: "Emotionen"
    },
    {
      name: "Sakral-Zentrum",
      description: "Black Moon Lilith im Sakral-Zentrum bringt wilde, unabhängige Lebenskraft. Du lebst deine Sexualität und Kreativität auf deine eigene Weise.",
      energy: "Lebenskraft"
    },
    {
      name: "Milz-Zentrum",
      description: "Black Moon Lilith im Milz-Zentrum gibt dir wilde, instinktive Intuition. Du vertraust deinem Bauchgefühl und weigerst dich, rationale Erklärungen zu akzeptieren.",
      energy: "Intuition"
    },
    {
      name: "Wurzel-Zentrum",
      description: "Black Moon Lilith im Wurzel-Zentrum zeigt deine wilde, unabhängige Überlebensenergie. Du schaffst deine eigene Sicherheit und weigerst dich, dich von anderen abhängig zu machen.",
      energy: "Stress"
    }
  ];

  centers.forEach(center => {
    insertCenter.run(center.name, center.description, center.energy);
  });
}

// Exportiere die Datenbank für andere Module
export function getBlackMoonLilithDatabase() {
  if (!db) {
    initBlackMoonLilithDatabase();
  }
  return db;
}

// Hilfsfunktionen für Datenabfragen
export function getBlackMoonLilithInfo() {
  const db = getBlackMoonLilithDatabase();
  const stmt = db.prepare('SELECT * FROM blackmoonlilith_info LIMIT 1');
  return stmt.get();
}

export function getBlackMoonLilithCenters() {
  const db = getBlackMoonLilithDatabase();
  const stmt = db.prepare('SELECT * FROM blackmoonlilith_centers');
  return stmt.all();
}

export function getBlackMoonLilithGates() {
  const db = getBlackMoonLilithDatabase();
  const stmt = db.prepare('SELECT * FROM blackmoonlilith_gates ORDER BY gate_number');
  return stmt.all();
}

export function getBlackMoonLilithGate(gateNumber: number) {
  const db = getBlackMoonLilithDatabase();
  const stmt = db.prepare('SELECT * FROM blackmoonlilith_gates WHERE gate_number = ?');
  return stmt.get(gateNumber);
}
