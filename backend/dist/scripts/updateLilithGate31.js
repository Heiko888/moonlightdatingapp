"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLilithGate31 = updateLilithGate31;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const lilithGates31_1 = require("./lilithGates31");
// Script zum Aktualisieren des Lilith Gates 31
function updateLilithGate31() {
    const dbPath = path_1.default.join(__dirname, '../../data/lilith.db');
    const db = new better_sqlite3_1.default(dbPath);
    console.log('[LILITH-GATES] Starte Aktualisierung des Lilith Gates 31...');
    const updateLilithGate = db.prepare(`
    UPDATE lilith_gates 
    SET name = ?, description = ?, deep_meaning = ?, shadow_aspects = ?, gifts = ?, affirmation = ?
    WHERE gate_number = ?
  `);
    // Gate 31 mit echtem Daten aktualisieren
    updateLilithGate.run(lilithGates31_1.lilithGate31.name, lilithGates31_1.lilithGate31.description, lilithGates31_1.lilithGate31.deepMeaning, JSON.stringify(lilithGates31_1.lilithGate31.shadowAspects), JSON.stringify(lilithGates31_1.lilithGate31.gifts), lilithGates31_1.lilithGate31.affirmation, lilithGates31_1.lilithGate31.gate);
    console.log(`[LILITH-GATES] Tor ${lilithGates31_1.lilithGate31.gate} (${lilithGates31_1.lilithGate31.name}) aktualisiert`);
    console.log('[LILITH-GATES] Lilith Gate 31 erfolgreich aktualisiert!');
    db.close();
}
// Script ausführen wenn direkt aufgerufen
if (require.main === module) {
    updateLilithGate31();
}
