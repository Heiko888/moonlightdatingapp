"use strict";
// SQLite vollständig entfernt - verwende nur Supabase
// Alle Lilith-Daten werden über Supabase verwaltet
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLilithDatabase = initLilithDatabase;
exports.getLilithDatabase = getLilithDatabase;
exports.getLilithInfo = getLilithInfo;
exports.getLilithCenters = getLilithCenters;
exports.getLilithGates = getLilithGates;
exports.getLilithGate = getLilithGate;
// Lilith-Datenbank initialisieren
function initLilithDatabase() {
    console.log('[LILITH-DB] SQLite deaktiviert - verwende nur Supabase');
    return; // Früher beenden
}
// Alle Lilith-Funktionen deaktiviert - verwende Supabase
function getLilithDatabase() {
    return null; // SQLite deaktiviert
}
function getLilithInfo() {
    return null; // SQLite deaktiviert
}
function getLilithCenters() {
    return []; // SQLite deaktiviert
}
function getLilithGates() {
    return []; // SQLite deaktiviert
}
function getLilithGate(gateNumber) {
    return null; // SQLite deaktiviert
}
exports.default = null;
