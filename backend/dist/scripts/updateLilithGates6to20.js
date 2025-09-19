"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLilithGates6to20 = updateLilithGates6to20;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const lilithGates6to20_1 = require("./lilithGates6to20");
// Hilfsfunktion: Center für Gate ermitteln
function getCenterForGate(gateNumber) {
    const gateToCenter = {
        // HEAD Center
        64: 'HEAD', 61: 'HEAD', 63: 'HEAD',
        // AJNA Center  
        47: 'AJNA', 24: 'AJNA', 11: 'AJNA',
        // THROAT Center
        62: 'THROAT', 23: 'THROAT', 56: 'THROAT', 16: 'THROAT', 20: 'THROAT', 31: 'THROAT', 33: 'THROAT', 8: 'THROAT',
        // G Center
        1: 'G', 13: 'G', 25: 'G', 46: 'G', 2: 'G', 15: 'G', 10: 'G', 7: 'G',
        // HEART Center
        21: 'HEART', 40: 'HEART', 26: 'HEART', 51: 'HEART',
        // SOLAR Center
        36: 'SOLAR', 22: 'SOLAR', 37: 'SOLAR', 6: 'SOLAR', 49: 'SOLAR', 55: 'SOLAR', 30: 'SOLAR',
        // SACRAL Center
        34: 'SACRAL', 5: 'SACRAL', 14: 'SACRAL', 29: 'SACRAL', 59: 'SACRAL', 9: 'SACRAL', 3: 'SACRAL',
        // SPLEEN Center
        48: 'SPLEEN', 57: 'SPLEEN', 44: 'SPLEEN', 50: 'SPLEEN', 32: 'SPLEEN', 28: 'SPLEEN', 18: 'SPLEEN',
        // ROOT Center
        41: 'ROOT', 39: 'ROOT', 53: 'ROOT', 38: 'ROOT', 58: 'ROOT', 54: 'ROOT', 52: 'ROOT', 19: 'ROOT', 60: 'ROOT'
    };
    return gateToCenter[gateNumber] || 'UNKNOWN';
}
// Script zum Aktualisieren der Lilith Gates 6-20
function updateLilithGates6to20() {
    const dbPath = path_1.default.join(__dirname, '../../data/lilith.db');
    const db = new better_sqlite3_1.default(dbPath);
    console.log('[LILITH-GATES] Starte Aktualisierung der Lilith Gates 6-20...');
    const updateLilithGate = db.prepare(`
    UPDATE lilith_gates 
    SET name = ?, description = ?, deep_meaning = ?, shadow_aspects = ?, gifts = ?, affirmation = ?
    WHERE gate_number = ?
  `);
    // Gates 6-20 mit echten Daten aktualisieren
    lilithGates6to20_1.lilithGates6to20.forEach(gateData => {
        updateLilithGate.run(gateData.name, gateData.description, gateData.deepMeaning, JSON.stringify(gateData.shadowAspects), JSON.stringify(gateData.gifts), gateData.affirmation, gateData.gate);
        console.log(`[LILITH-GATES] Tor ${gateData.gate} (${gateData.name}) aktualisiert`);
    });
    console.log('[LILITH-GATES] Lilith Gates 6-20 erfolgreich aktualisiert!');
    db.close();
}
// Script ausführen wenn direkt aufgerufen
if (require.main === module) {
    updateLilithGates6to20();
}
