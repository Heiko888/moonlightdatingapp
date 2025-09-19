"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLilithGatesUnconscious41to60 = updateLilithGatesUnconscious41to60;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const lilithGatesUnconscious41to60_1 = require("./lilithGatesUnconscious41to60");
// Script zum Aktualisieren der Lilith Gates 41-60 UNBEWUSST
function updateLilithGatesUnconscious41to60() {
    const dbPath = path_1.default.join(__dirname, '../../data/lilith.db');
    const db = new better_sqlite3_1.default(dbPath);
    console.log('[LILITH-GATES] Starte Aktualisierung der Lilith Gates 41-60 UNBEWUSST...');
    const updateLilithGate = db.prepare(`
    UPDATE lilith_gates 
    SET unconscious_description = ?, unconscious_deep_meaning = ?, unconscious_shadow_aspects = ?, unconscious_gifts = ?, unconscious_affirmation = ?
    WHERE gate_number = ?
  `);
    // Gates 41-60 mit unbewussten Daten aktualisieren
    lilithGatesUnconscious41to60_1.lilithGatesUnconscious41to60.forEach(gateData => {
        updateLilithGate.run(gateData.description, gateData.deepMeaning, JSON.stringify(gateData.shadowAspects), JSON.stringify(gateData.gifts), gateData.affirmation, gateData.gate);
        console.log(`[LILITH-GATES] Tor ${gateData.gate} (${gateData.name}) UNBEWUSST aktualisiert`);
    });
    console.log('[LILITH-GATES] Lilith Gates 41-60 UNBEWUSST erfolgreich aktualisiert!');
    db.close();
}
// Script ausführen wenn direkt aufgerufen
if (require.main === module) {
    updateLilithGatesUnconscious41to60();
}
