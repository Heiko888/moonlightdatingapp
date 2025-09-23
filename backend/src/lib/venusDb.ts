// SQLite vollständig entfernt - verwende nur Supabase
// Alle Venus-Daten werden über Supabase verwaltet

// Venus-Datenbank initialisieren
export function initVenusDatabase() {
  console.log('[VENUS-DB] SQLite deaktiviert - verwende nur Supabase');
  return; // Früher beenden
}

// Venus-Grunddaten einfügen
export function initVenusData() {
  console.log('[VENUS-DB] SQLite deaktiviert - verwende nur Supabase');
  return; // Früher beenden
}

// Alle Venus-Funktionen deaktiviert - verwende Supabase
export function getVenusDatabase() {
  return null; // SQLite deaktiviert
}

export function getVenusInfo() {
  return null; // SQLite deaktiviert
}

export function getVenusCenters() {
  return []; // SQLite deaktiviert
}

export function getVenusCenter(centerNumber: number) {
  return null; // SQLite deaktiviert
}

export function getVenusGates() {
  return []; // SQLite deaktiviert
}

export function getVenusGate(gateNumber: number) {
  return null; // SQLite deaktiviert
}

export function getVenusGatesByCenter(centerNumber: number) {
  return []; // SQLite deaktiviert
}

// SQLite vollständig entfernt - verwende nur Supabase
export default null;
