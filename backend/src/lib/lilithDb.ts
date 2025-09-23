// SQLite vollständig entfernt - verwende nur Supabase
// Alle Lilith-Daten werden über Supabase verwaltet

// Lilith-Datenbank initialisieren
export function initLilithDatabase() {
  console.log('[LILITH-DB] SQLite deaktiviert - verwende nur Supabase');
  return; // Früher beenden
}

// Alle Lilith-Funktionen deaktiviert - verwende Supabase
export function getLilithDatabase() {
  return null; // SQLite deaktiviert
}

export function getLilithInfo() {
  return null; // SQLite deaktiviert
}

export function getLilithCenters() {
  return []; // SQLite deaktiviert
}

export function getLilithGates() {
  return []; // SQLite deaktiviert
}

export function getLilithGate(gateNumber: number) {
  return null; // SQLite deaktiviert
}

export default null;
