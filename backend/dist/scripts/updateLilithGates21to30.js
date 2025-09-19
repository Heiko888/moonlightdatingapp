"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLilithGates21to30 = updateLilithGates21to30;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const lilithGates21to30_1 = require("./lilithGates21to30");
// Script zum Aktualisieren der Lilith Gates 21-30
function updateLilithGates21to30() {
    const dbPath = path_1.default.join(__dirname, '../../data/lilith.db');
    const db = new better_sqlite3_1.default(dbPath);
    console.log('[LILITH-GATES] Starte Aktualisierung der Lilith Gates 21-30...');
    const updateLilithGate = db.prepare(`
    UPDATE lilith_gates 
    SET name = ?, description = ?, deep_meaning = ?, shadow_aspects = ?, gifts = ?, affirmation = ?
    WHERE gate_number = ?
  `);
    // Gates 21-30 mit echten Daten aktualisieren
    lilithGates21to30_1.lilithGates21to30.forEach(gateData => {
        updateLilithGate.run(gateData.name, gateData.description, gateData.deepMeaning, JSON.stringify(gateData.shadowAspects), JSON.stringify(gateData.gifts), gateData.affirmation, gateData.gate);
        console.log(`[LILITH-GATES] Tor ${gateData.gate} (${gateData.name}) aktualisiert`);
    });
    console.log('[LILITH-GATES] Lilith Gates 21-30 erfolgreich aktualisiert!');
    db.close();
}
// Script ausführen wenn direkt aufgerufen
if (require.main === module) {
    updateLilithGates21to30();
}
