// SQLite vollständig entfernt - verwende nur Supabase
// Alle Black Moon Lilith-Daten werden über Supabase verwaltet

export function initBlackMoonLilithDatabase() {
  console.log('[BML-DB] SQLite deaktiviert - verwende nur Supabase');
  return; // Früher beenden
}

// Alle Black Moon Lilith-Funktionen deaktiviert - verwende Supabase
export function getBlackMoonLilithDatabase() {
  return null; // SQLite deaktiviert
}

export function getBlackMoonLilithInfo() {
  return null; // SQLite deaktiviert
}

export function getBlackMoonLilithCenters() {
  return []; // SQLite deaktiviert
}

export function getBlackMoonLilithGates() {
  return []; // SQLite deaktiviert
}

export function getBlackMoonLilithGate(gateNumber: number) {
  return null; // SQLite deaktiviert
}

export default null;
