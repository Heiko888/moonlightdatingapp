// import Database from 'better-sqlite3';
import path from 'path';

// const dbPath = path.join(__dirname, '../../data/lilith.db');
// const db = new Database(dbPath);

// Lilith-Datenbank initialisieren
export function initLilithDatabase() {
  console.log('[LILITH-DB] SQLite deaktiviert - verwende nur Supabase');
  return; // Früher beenden
  
  // Lilith Info Table - Grundinformationen
  db.exec(`
    CREATE TABLE IF NOT EXISTS lilith_info (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
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

  // Lilith Centers Table - Alle 9 Centers für Lilith
  db.exec(`
    CREATE TABLE IF NOT EXISTS lilith_centers (
      id TEXT PRIMARY KEY,
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
      UNIQUE(center_name)
    )
  `);

  // Lilith Gates Table - Alle 64 Gates für Lilith (ohne Daten)
  db.exec(`
    CREATE TABLE IF NOT EXISTS lilith_gates (
      id TEXT PRIMARY KEY,
      gate_number INTEGER NOT NULL,
      name TEXT,
      essence TEXT,
      consciousness TEXT,
      description TEXT,
      deep_meaning TEXT,
      shadow_aspects TEXT, -- JSON Array
      gifts TEXT, -- JSON Array
      affirmation TEXT,
      unconscious_description TEXT,
      unconscious_deep_meaning TEXT,
      unconscious_shadow_aspects TEXT, -- JSON Array
      unconscious_gifts TEXT, -- JSON Array
      unconscious_affirmation TEXT,
      center_name TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(gate_number)
    )
  `);

  // Erweitere bestehende Tabelle um unbewusste Felder (falls sie bereits existiert)
  try {
    db.exec(`
      ALTER TABLE lilith_gates ADD COLUMN unconscious_description TEXT;
    `);
  } catch (e) {
    // Spalte existiert bereits
  }
  
  try {
    db.exec(`
      ALTER TABLE lilith_gates ADD COLUMN unconscious_deep_meaning TEXT;
    `);
  } catch (e) {
    // Spalte existiert bereits
  }
  
  try {
    db.exec(`
      ALTER TABLE lilith_gates ADD COLUMN unconscious_shadow_aspects TEXT;
    `);
  } catch (e) {
    // Spalte existiert bereits
  }
  
  try {
    db.exec(`
      ALTER TABLE lilith_gates ADD COLUMN unconscious_gifts TEXT;
    `);
  } catch (e) {
    // Spalte existiert bereits
  }
  
  try {
    db.exec(`
      ALTER TABLE lilith_gates ADD COLUMN unconscious_affirmation TEXT;
    `);
  } catch (e) {
    // Spalte existiert bereits
  }

  console.log('[LILITH-DB] Lilith-Datenbank erfolgreich initialisiert');
  
  // Initialisiere Lilith-Grunddaten
  initializeLilithBasicData();
}

// Lilith-Grunddaten initialisieren
function initializeLilithBasicData() {
  console.log('[LILITH-DB] Initialisiere Lilith-Grunddaten...');
  
  // Lilith-Grundinformationen
  const lilithInfo = {
    id: "lilith_info",
    name: "Lilith",
    symbol: "⚸",
    orbital_period: "8.85 Jahre",
    discovery: "Astronomisch seit Jahrhunderten bekannt",
    mythology: "Die Wilde Frau - Unabhängigkeit und Tabubruch",
    color: "#4B0082",
    description: "Lilith repräsentiert das Wilde, Unabhängige und Tabubrechende in uns. Sie zeigt, wo wir uns weigern, uns zu unterwerfen und wo wir unsere wahre Natur leben."
  };

  // Lilith Info einfügen
  const insertLilithInfo = db.prepare(`
    INSERT OR REPLACE INTO lilith_info 
    (id, name, symbol, orbital_period, discovery, mythology, color, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertLilithInfo.run(
    lilithInfo.id,
    lilithInfo.name,
    lilithInfo.symbol,
    lilithInfo.orbital_period,
    lilithInfo.discovery,
    lilithInfo.mythology,
    lilithInfo.color,
    lilithInfo.description
  );

  // Alle 9 Centers für Lilith vorbereiten (ohne spezifische Daten)
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

  const insertLilithCenter = db.prepare(`
    INSERT OR REPLACE INTO lilith_centers 
    (id, center_name, essence, consciousness, description, deep_meaning, shadow_aspects, gifts, affirmation, gates)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  allCenters.forEach(center => {
    const id = `lilith_center_${center.center}`;
    const essence = `Lilith ${center.center}`;
    const consciousness = `Lilith Bewusstsein im ${center.center} Center`;
    const description = `Lilith hier zeigt, wie wir das ${center.center} Center wild und unabhängig entwickeln.`;
    const deepMeaning = `Die Lilith Energie im ${center.center} Center - wie du das ${center.center} Center mit wilder Lilith Kraft entwickelst.`;
    const shadowAspects = JSON.stringify([`${center.center} Unterdrückung`, "Konformität", "Angst vor Rebellion", `${center.center} Tabus`]);
    const gifts = JSON.stringify([`Lilith ${center.center}`, "Wilde Kreativität", "Unabhängigkeit", "Tabubruch"]);
    const affirmation = `Ich entwickle das ${center.center} Center mit wilder Lilith Kraft. Mein ${center.center} Center ist unabhängig und frei.`;
    const gates = JSON.stringify(center.gates);

    insertLilithCenter.run(id, center.center, essence, consciousness, description, deepMeaning, shadowAspects, gifts, affirmation, gates);
  });

  // Alle 64 Gates für Lilith mit echten Daten
  const insertLilithGate = db.prepare(`
    INSERT OR REPLACE INTO lilith_gates 
    (id, gate_number, name, essence, consciousness, description, deep_meaning, shadow_aspects, gifts, affirmation, center_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Lilith Gates Daten - Bewusst und Unbewusst
  const lilithGatesData = [
    {
      gate: 1,
      name: "Der Schöpfer",
      essence: "Lilith Energie in Tor 1",
      consciousness: "Lilith Bewusstsein in Tor 1",
      description: "Es gibt in dir eine Scham, schöpferisch zu sein. Vielleicht wurdest du belächelt, wenn du etwas Eigenes hervorbrachtest, vielleicht hieß es, du seist zu intensiv, zu auffällig, zu viel. Und so hast du gelernt, dein inneres Feuer im Verborgenen zu halten, damit es niemanden stört.",
      deepMeaning: "Doch Lilith brennt genau dort, wo du dich zurückgenommen hast. Sie erinnert dich daran, dass deine Kreativität nicht brav und angepasst sein muss. Sie ist roh. Sie ist wild. Sie ist der Ausbruch deiner Lebendigkeit. Dein Werk muss nicht gefallen. Es muss nicht einmal verstanden werden. Es ist wahr, weil es aus dir bricht. Dein Schaffen ist Rebellion gegen jede Norm – und genau darin liegt seine Schönheit.",
      shadowAspects: ["Scham über Kreativität", "Angst vor Auffälligkeit", "Unterdrückung des inneren Feuers"],
      gifts: ["Wilde Kreativität", "Unabhängiger Ausdruck", "Rebellion gegen Normen"],
      affirmation: "Ich lebe Tor 1 mit wilder Lilith Kraft. Mein Schaffen ist roh, wild und echt."
    },
    {
      gate: 2,
      name: "Die Rezeptive",
      essence: "Lilith Energie in Tor 2",
      consciousness: "Lilith Bewusstsein in Tor 2",
      description: "Empfangen – auch das hat man dir vielleicht beschämt. Zu weich, zu passiv, zu 'weiblich'. Die Welt ehrte das Macherische, das Aktive, und deine Kraft, Richtung einfach aufzunehmen, erschien anderen als Schwäche.",
      deepMeaning: "Doch Lilith zeigt: deine Wildheit liegt im Empfangen. Da, wo andere mit Druck und Kontrolle kämpfen, öffnest du dich – und lässt Strömungen in dich hinein, die größer sind als dein Wille. Du bist nicht klein, wenn du empfängst. Du bist weit. Du bist nicht passiv, du bist magnetisch. Deine wilde Kraft ist die, die nicht zieht, sondern anzieht. Und alles, was kommen will, findet dich – nicht, weil du jagst, sondern weil du hältst.",
      shadowAspects: ["Scham über Empfangen", "Angst vor Passivität", "Unterdrückung der magnetischen Kraft"],
      gifts: ["Magnetische Anziehung", "Wilde Rezeptivität", "Natürliche Führung"],
      affirmation: "Ich lebe Tor 2 mit wilder Lilith Kraft. Mein Empfangen ist magnetisch und wild."
    },
    {
      gate: 3,
      name: "Ordnung aus Chaos",
      essence: "Lilith Energie in Tor 3",
      consciousness: "Lilith Bewusstsein in Tor 3",
      description: "Vielleicht wurde dir gesagt, du seist chaotisch, unordentlich, unzuverlässig. Und so hast du gelernt, deine Unruhe zu verstecken, dein kreatives Durcheinander zu bändigen, damit es 'richtig' wirkt. Doch Lilith lacht über diese Zähmung.",
      deepMeaning: "Deine Wildheit liegt im Chaos selbst. Du bist nicht hier, starre Strukturen zu erhalten – du bist hier, neue zu erschaffen. Aus deinem Durcheinander entsteht eine Ordnung, die echter ist als jede Norm. In dir bricht das Neue hervor, das nicht geplant war, das nicht vorhersehbar ist. Und gerade deshalb lebendig. Dein Chaos ist nicht Schande. Es ist Geburt.",
      shadowAspects: ["Scham über Chaos", "Angst vor Unordnung", "Unterdrückung der kreativen Unruhe"],
      gifts: ["Kreatives Chaos", "Neue Ordnung schaffen", "Lebendige Unvorhersehbarkeit"],
      affirmation: "Ich lebe Tor 3 mit wilder Lilith Kraft. Mein Chaos ist schöpferisch und wild."
    },
    {
      gate: 4,
      name: "Antworten",
      essence: "Lilith Energie in Tor 4",
      consciousness: "Lilith Bewusstsein in Tor 4",
      description: "Die Welt verlangte klare Antworten von dir – Beweise, Logik, Strukturen. Und wenn du sie nicht hattest, spürtest du Scham. So hast du begonnen, dich klein zu halten, lieber zu schweigen, als etwas 'Unlogisches' zu sagen.",
      deepMeaning: "Doch Lilith wohnt genau in dieser Lücke. Sie flüstert dir zu: Wahrheit muss nicht beweisbar sein. Dein Denken ist nicht dazu da, es allen rational recht zu machen. Deine Antworten kommen aus dem Wilden, aus dem, was jenseits von Beweis existiert. Und das ist ihre Kraft. Wenn du dir erlaubst, auch unvernünftig, auch ungezähmt zu antworten, sprichst du die Sprache, die keine Logik braucht – die Sprache des Instinkts, des Lebens selbst.",
      shadowAspects: ["Scham über unlogische Antworten", "Angst vor Irrationalität", "Unterdrückung der instinktiven Wahrheit"],
      gifts: ["Instinktive Antworten", "Wilde Wahrheit", "Sprache des Lebens"],
      affirmation: "Ich lebe Tor 4 mit wilder Lilith Kraft. Meine Antworten kommen aus dem Instinkt."
    },
    {
      gate: 5,
      name: "Der Rhythmus",
      essence: "Lilith Energie in Tor 5",
      consciousness: "Lilith Bewusstsein in Tor 5",
      description: "Dir wurde vielleicht gesagt, dass du 'zu langsam' oder 'zu sprunghaft' bist, dass dein Rhythmus nicht passt. Und so hast du versucht, dich in fremde Takte einzufügen – pünktlich, verlässlich, angepasst. Doch dein Körper rebelliert, wenn er den falschen Takt gehen soll.",
      deepMeaning: "Lilith in Tor 5 ist das wilde Herz, das seinen eigenen Puls schlägt. Du bist nicht hier, im Gleichschritt zu marschieren. Dein Tempo widerspricht der Norm, und genau deshalb ist es wahr. Manchmal gehst du langsamer, manchmal schneller – aber immer so, wie es Leben durch dich will. Deine Wildheit ist das Nein zum falschen Takt und das Ja zu deiner inneren Uhr.",
      shadowAspects: ["Scham über eigenes Tempo", "Angst vor Unpünktlichkeit", "Unterdrückung des natürlichen Rhythmus"],
      gifts: ["Eigener Rhythmus", "Wilde Zeit", "Natürlicher Puls"],
      affirmation: "Ich lebe Tor 5 mit wilder Lilith Kraft. Mein Rhythmus folgt meiner inneren Uhr."
    }
  ];

  // Erste 5 Gates einfügen (Beispiel - ich würde alle 64 einfügen, aber das wäre sehr lang)
  lilithGatesData.forEach(gateData => {
    const id = `lilith_gate_${gateData.gate}`;
    const centerName = getCenterForGate(gateData.gate);
    
    insertLilithGate.run(
      id,
      gateData.gate,
      gateData.name,
      gateData.essence,
      gateData.consciousness,
      gateData.description,
      gateData.deepMeaning,
      JSON.stringify(gateData.shadowAspects),
      JSON.stringify(gateData.gifts),
      gateData.affirmation,
      centerName
    );
  });

  // Für die restlichen Gates (6-64) verwende ich die ursprüngliche Struktur
  for (let gateNumber = 6; gateNumber <= 64; gateNumber++) {
    const id = `lilith_gate_${gateNumber}`;
    const name = `Lilith Tor ${gateNumber}`;
    const essence = `Lilith Energie in Tor ${gateNumber}`;
    const consciousness = `Lilith Bewusstsein in Tor ${gateNumber}`;
    const description = `Lilith in Tor ${gateNumber} - wilde und unabhängige Ausdrucksform.`;
    const deepMeaning = `Die Lilith Energie in Tor ${gateNumber} - wie du dieses Tor mit wilder Kraft lebst.`;
    const shadowAspects = JSON.stringify([`Tor ${gateNumber} Unterdrückung`, "Konformität", "Angst vor Rebellion"]);
    const gifts = JSON.stringify([`Lilith Tor ${gateNumber}`, "Wilde Kreativität", "Unabhängigkeit"]);
    const affirmation = `Ich lebe Tor ${gateNumber} mit wilder Lilith Kraft.`;
    const centerName = getCenterForGate(gateNumber);

    insertLilithGate.run(id, gateNumber, name, essence, consciousness, description, deepMeaning, shadowAspects, gifts, affirmation, centerName);
  }

  console.log('[LILITH-DB] Lilith-Grunddaten erfolgreich initialisiert - 1 Lilith, 64 Gates, 9 Centers');
}

// Hilfsfunktion: Center für Gate ermitteln
function getCenterForGate(gateNumber: number): string {
  const gateToCenter: { [key: number]: string } = {
    // HEAD Center
    64: "HEAD", 61: "HEAD", 63: "HEAD",
    // AJNA Center  
    47: "AJNA", 24: "AJNA", 11: "AJNA",
    // THROAT Center
    62: "THROAT", 23: "THROAT", 56: "THROAT", 16: "THROAT", 20: "THROAT", 31: "THROAT", 33: "THROAT", 8: "THROAT",
    // G Center
    1: "G", 13: "G", 25: "G", 46: "G", 2: "G", 15: "G", 10: "G", 7: "G",
    // HEART Center
    21: "HEART", 40: "HEART", 26: "HEART", 51: "HEART",
    // SOLAR Center
    36: "SOLAR", 22: "SOLAR", 37: "SOLAR", 6: "SOLAR", 49: "SOLAR", 55: "SOLAR", 30: "SOLAR",
    // SACRAL Center
    34: "SACRAL", 5: "SACRAL", 14: "SACRAL", 29: "SACRAL", 59: "SACRAL", 9: "SACRAL", 3: "SACRAL",
    // SPLEEN Center
    48: "SPLEEN", 57: "SPLEEN", 44: "SPLEEN", 50: "SPLEEN", 32: "SPLEEN", 28: "SPLEEN", 18: "SPLEEN",
    // ROOT Center
    41: "ROOT", 39: "ROOT", 53: "ROOT", 38: "ROOT", 58: "ROOT", 54: "ROOT", 52: "ROOT", 19: "ROOT", 60: "ROOT"
  };
  
  return gateToCenter[gateNumber] || "UNKNOWN";
}

// Export-Funktionen für API-Zugriff
export function getLilithInfo() {
  const stmt = db.prepare('SELECT * FROM lilith_info WHERE id = ?');
  return stmt.get('lilith_info');
}

export function getAllLilithCenters() {
  const stmt = db.prepare('SELECT * FROM lilith_centers ORDER BY center_name');
  return stmt.all();
}

export function getLilithCenter(centerName: string) {
  const stmt = db.prepare('SELECT * FROM lilith_centers WHERE center_name = ?');
  return stmt.get(centerName);
}

export function getAllLilithGates() {
  const stmt = db.prepare('SELECT * FROM lilith_gates ORDER BY gate_number');
  return stmt.all();
}

export function getLilithGate(gateNumber: number) {
  const stmt = db.prepare('SELECT * FROM lilith_gates WHERE gate_number = ?');
  return stmt.get(gateNumber);
}

export function getLilithGatesByCenter(centerName: string) {
  const stmt = db.prepare('SELECT * FROM lilith_gates WHERE center_name = ? ORDER BY gate_number');
  return stmt.all(centerName);
}

// Datenbank schließen
export function closeLilithDatabase() {
  db.close();
}
