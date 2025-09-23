"use strict";
// SQLite vollständig entfernt - verwende nur Supabase
// Alle Daten werden über Supabase verwaltet
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLocalDatabase = initLocalDatabase;
exports.updateMercuryGate = updateMercuryGate;
exports.getMercuryGate = getMercuryGate;
// Datenbank initialisieren
function initLocalDatabase() {
    console.log('[LOCAL-DB] SQLite deaktiviert - verwende nur Supabase');
    return; // Früher beenden
}
// Funktion zum Aktualisieren von Mercury Gate-Daten
function updateMercuryGate(gateNumber, gateData) {
    return; // SQLite deaktiviert
}
// Funktion zum Abrufen eines spezifischen Mercury Gates
function getMercuryGate(gateNumber) {
    return null; // SQLite deaktiviert
}
// SQLite vollständig entfernt - verwende nur Supabase
exports.default = null;
