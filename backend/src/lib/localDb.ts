// SQLite vollständig entfernt - verwende nur Supabase
// Alle Daten werden über Supabase verwaltet

// Datenbank initialisieren
export function initLocalDatabase() {
  console.log('[LOCAL-DB] SQLite deaktiviert - verwende nur Supabase');
  return; // Früher beenden
}

// Funktion zum Aktualisieren von Mercury Gate-Daten
export function updateMercuryGate(gateNumber: number, gateData: any) {
  return; // SQLite deaktiviert
}

// Funktion zum Abrufen eines spezifischen Mercury Gates
export function getMercuryGate(gateNumber: number) {
  return null; // SQLite deaktiviert
}

// SQLite vollständig entfernt - verwende nur Supabase
export default null;
