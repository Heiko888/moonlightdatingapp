"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLilithGatesUnconscious1to20 = updateLilithGatesUnconscious1to20;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const lilithGatesUnconscious1to20_1 = require("./lilithGatesUnconscious1to20");
// Script zum Aktualisieren der Lilith Gates 1-20 UNBEWUSST
function updateLilithGatesUnconscious1to20() {
    const dbPath = path_1.default.join(__dirname, '../../data/lilith.db');
    const db = new better_sqlite3_1.default(dbPath);
    console.log('[LILITH-GATES] Starte Aktualisierung der Lilith Gates 1-20 UNBEWUSST...');
    const updateLilithGate = db.prepare(`
    UPDATE lilith_gates 
    SET unconscious_description = ?, unconscious_deep_meaning = ?, unconscious_shadow_aspects = ?, unconscious_gifts = ?, unconscious_affirmation = ?
    WHERE gate_number = ?
  `);
    // Gates 1-20 mit unbewussten Daten aktualisieren
    lilithGatesUnconscious1to20_1.lilithGatesUnconscious1to20.forEach(gateData => {
        updateLilithGate.run(gateData.description, gateData.deepMeaning, JSON.stringify(gateData.shadowAspects), JSON.stringify(gateData.gifts), gateData.affirmation, gateData.gate);
        console.log(`[LILITH-GATES] Tor ${gateData.gate} (${gateData.name}) UNBEWUSST aktualisiert`);
    });
    console.log('[LILITH-GATES] Lilith Gates 1-20 UNBEWUSST erfolgreich aktualisiert!');
    db.close();
}
// Script ausführen wenn direkt aufgerufen
if (require.main === module) {
    updateLilithGatesUnconscious1to20();
}
