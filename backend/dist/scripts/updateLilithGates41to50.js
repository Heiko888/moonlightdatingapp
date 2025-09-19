"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLilithGates41to50 = updateLilithGates41to50;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const lilithGates41to50_1 = require("./lilithGates41to50");
// Script zum Aktualisieren der Lilith Gates 41-50
function updateLilithGates41to50() {
    const dbPath = path_1.default.join(__dirname, '../../data/lilith.db');
    const db = new better_sqlite3_1.default(dbPath);
    console.log('[LILITH-GATES] Starte Aktualisierung der Lilith Gates 41-50...');
    const updateLilithGate = db.prepare(`
    UPDATE lilith_gates 
    SET name = ?, description = ?, deep_meaning = ?, shadow_aspects = ?, gifts = ?, affirmation = ?
    WHERE gate_number = ?
  `);
    // Gates 41-50 mit echten Daten aktualisieren
    lilithGates41to50_1.lilithGates41to50.forEach(gateData => {
        updateLilithGate.run(gateData.name, gateData.description, gateData.deepMeaning, JSON.stringify(gateData.shadowAspects), JSON.stringify(gateData.gifts), gateData.affirmation, gateData.gate);
        console.log(`[LILITH-GATES] Tor ${gateData.gate} (${gateData.name}) aktualisiert`);
    });
    console.log('[LILITH-GATES] Lilith Gates 41-50 erfolgreich aktualisiert!');
    db.close();
}
// Script ausführen wenn direkt aufgerufen
if (require.main === module) {
    updateLilithGates41to50();
}
