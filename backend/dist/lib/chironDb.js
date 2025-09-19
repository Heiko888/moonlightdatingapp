"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initChironDatabase = initChironDatabase;
exports.getAllChironGates = getAllChironGates;
exports.getChironGate = getChironGate;
exports.getAllChironCenters = getAllChironCenters;
exports.getChironCenter = getChironCenter;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
// Separate Chiron-Datenbank
const chironDbPath = path_1.default.join(process.cwd(), 'data', 'chiron.db');
const chironDb = new better_sqlite3_1.default(chironDbPath);
// Chiron unbewusst Texte für alle 64 Tore
function getUnconsciousChironTexts() {
    return {
        1: "Tief in deinem Körper liegt der Druck, etwas Eigenes zu gebären. Nicht immer sichtbar, oft leise, aber unaufhaltsam drängt dich ein inneres Feuer. Die Wunde: das Gefühl, dass deine Schöpfung nie reicht, dass deine Einzigartigkeit im Schatten bleibt.\n\nChiron hier zeigt: Der Schmerz sitzt nicht im Mangel an Ideen, sondern in der Angst, dass niemand deine Schöpfung erkennt.\n\nDoch dein Geschenk ist das stille Strahlen. Du bringst nicht das Lauteste hervor, sondern das Echteste. Deine Kreativität ist kein Beweisstück, sondern Ausdruck deines Seins.\n\nDie Heilung geschieht, wenn du dein Erschaffen nicht länger an Anerkennung bindest. Dein Werk trägt Kraft, weil es aus der Tiefe deines Körpers kommt – nicht, weil es applaudiert wird.",
        2: "In deinem Innersten wohnt eine stille Antenne, die Wege empfängt. Doch die Wunde liegt darin, dass du gelernt hast, Richtung erzwingen zu müssen. So verkrampft dein Körper, wenn er führen soll, statt zu lauschen.\n\nChiron in Tor 2 bringt die Angst, verloren zu gehen, wenn du dich hingibst.\n\nDoch dein Geschenk ist deine Empfangskraft. Dein Körper liest den Raum, spürt die Strömungen, die andere übersehen.\n\nDie Heilung geschieht, wenn du vertraust, dass Stille nicht Leere, sondern Einladung ist. Deine Richtung wird dir gegeben, wenn du atmest statt steuerst. Dann wirst du zum Gefäß, das dem Leben Form gibt.",
        3: "In dir lebt das Chaos wie ein Echo. Du gerätst in Umbrüche, fühlst die Nervosität in deinen Zellen, wenn Ordnung zerfällt. Die Wunde: der Glaube, dass du selbst der Fehler bist, weil Strukturen nicht halten.\n\nDoch dein Geschenk liegt im Körperwissen, dass Ordnung nicht fest ist, sondern geboren wird. Du bist eine Gestalterin aus dem Chaos heraus.\n\nDie Heilung geschieht, wenn du nicht länger fliehst, sondern bleibst. Dein Körper erinnert dich: Jeder Bruch trägt den Keim neuer Ordnung. In deinem Vertrauen verwandelt sich Unsicherheit in Kreativität.",
        4: "Dein Körper kennt den Druck nach Lösungen. Fragen rumoren in dir, als müsstest du sofort antworten – und dein Kopf hetzt, während dein Inneres ermüdet.\n\nChiron in Tor 4 zeigt: Die Wunde liegt in der Angst, dass du ohne Antwort wertlos bist.\n\nDoch dein Geschenk ist die Ruhe, die Antworten gebären lässt. Dein Körper weiß, dass Klarheit nicht durch Zwang, sondern durch Zeit entsteht.\n\nDie Heilung geschieht, wenn du die Lücke zwischen Frage und Antwort ehrst. In diesem Zwischenraum liegt dein Schatz – die Fähigkeit, Wahrheit nicht zu erzwingen, sondern zu empfangen.",
        5: "In deinem Innersten liegt ein Takt, der nicht der der Welt ist. Die Wunde entsteht, wenn du dich zwingst, dich fremden Rhythmen anzupassen – und dein Körper ermüdet, weil er seinen eigenen Puls verliert.\n\nChiron in Tor 5 zeigt: Dein Schmerz liegt darin, dass du glaubst, falsch zu sein, wenn du nicht im Gleichschritt gehst.\n\nDoch dein Geschenk ist die Erinnerung an den natürlichen Rhythmus. Dein Körper weiß, wann es Zeit ist zu handeln, zu ruhen, zu leben.\n\nDie Heilung geschieht, wenn du deinen eigenen Takt ehrst. Aus deiner Treue zu ihm entsteht Ruhe – und andere spüren, dass auch sie ihrem eigenen Puls folgen dürfen.",
        6: "Deine Wunde zeigt sich in der Angst vor Nähe. Dein Körper spannt sich, wenn Konflikt droht, und du fliehst oder kämpfst, weil die Spannung zu viel wird.\n\nChiron in Tor 6 zeigt: Der Schmerz liegt in der Verwechslung. Du glaubst, Reibung sei Gefahr, dabei ist sie Einladung.\n\nDein Geschenk ist deine Fähigkeit, Spannung zu halten. In deinem Körper kann Nähe wachsen, weil du den Sturm nicht fürchtest.\n\nDie Heilung geschieht, wenn du deine Zartheit nicht mehr als Schwäche siehst. Deine Fähigkeit, in der Reibung präsent zu bleiben, macht dich zur Brücke für echte Intimität.",
        7: "Tief in dir lebt die Sehnsucht, Richtung zu geben – und die Angst, es falsch zu machen. Du spürst, wie dein Körper Verantwortung aufnimmt, auch wenn dein Verstand fliehen will.\n\nChiron in Tor 7 zeigt: Deine Wunde liegt im Zweifel an deiner Führungsnatur.\n\nDoch dein Geschenk ist die stille Führung, die nicht drückt, sondern lauscht. Dein Körper führt, weil er mit dem Feld verbunden ist.\n\nDie Heilung geschieht, wenn du Führung nicht länger mit Last verwechselst. Deine Präsenz reicht. Du führst, indem du bist.",
        8: "In dir lebt das Rufen nach Ausdruck. Die Wunde: der Schmerz, wenn dein Beitrag nicht gesehen oder überhört wird. Dein Körper zieht sich dann zurück, als sei Unsichtbarkeit Schutz.\n\nChiron in Tor 8 zeigt: Dein Schmerz liegt im Vergleich. Du glaubst, du müsstest beitragen wie die anderen.\n\nDoch dein Geschenk ist deine Einzigartigkeit. Dein Körper kennt die Note, die nur du singen kannst.\n\nDie Heilung geschieht, wenn du dich erlaubst, roh zu klingen, ohne Garantie. Dein Beitrag ist wertvoll, gerade weil er unvergleichlich ist.",
        9: "Dein Körper kennt das Zersplittern. Du beginnst vieles, verlierst dich im Vielerlei, und zurück bleibt das Gefühl, nichts sei wirklich vollbracht. Die Wunde sitzt in den Zellen: ein ständiger Druck, dich enger zu machen, als es sich anfühlt.\n\nChiron in Tor 9 zeigt: Dein Schmerz liegt in der Angst, dass deine Energie zu klein ist für die Welt.\n\nDoch dein Geschenk ist die Fähigkeit zur Bündelung. Dein Körper weiß, wie er Kraft fokussiert – nicht auf alles, sondern auf das, was wirklich deins ist.\n\nDie Heilung geschieht, wenn du dich traust, das Überflüssige loszulassen. Dein Ja zum Wenigen macht dich tief, und deine Tiefe ist das, was andere an dir suchen.",
        10: "In deinem Körper brennt die alte Wunde: das Gefühl, nicht richtig zu sein, so wie du bist. Vielleicht hast du gelernt, dich zu verbiegen, um Liebe nicht zu verlieren.\n\nChiron in Tor 10 zeigt: Dein Schmerz liegt darin, dass Selbstannahme nicht selbstverständlich war.\n\nDoch dein Geschenk ist die Verkörperung von Selbstliebe. Dein Körper erinnert dich daran, dass jede Bewegung, jeder Atemzug, jede Eigenheit ein Ja zum Leben ist.\n\nDie Heilung geschieht, wenn du dich nicht länger gegen dich selbst stellst. Dein Körper wird zur Botschaft: So wie ich bin, bin ich liebenswert."
    };
}
// Chiron Gates mit den wunderschönen spirituellen Texten
// Lade alle 64 Chiron-Texte aus der lokalen Datenbank
function getAllChironTexts() {
    try {
        // Versuche die lokale Datenbank zu laden
        const localDbPath = path_1.default.join(process.cwd(), 'data', 'local.db');
        const localDb = new better_sqlite3_1.default(localDbPath);
        const gates = localDb.prepare('SELECT gate_number, deep_meaning FROM chiron_gates ORDER BY gate_number').all();
        localDb.close();
        const chironTexts = {};
        gates.forEach((gate) => {
            chironTexts[gate.gate_number] = gate.deep_meaning;
        });
        return chironTexts;
    }
    catch (error) {
        console.log('[CHIRON-DB] Lokale Datenbank nicht verfügbar, verwende Fallback-Daten');
        // Fallback: Nur die ersten 10 Gates
        return {
            1: "Du trägst in dir das Drängen, etwas Einzigartiges zu erschaffen – ein Werk, ein Ausdruck, ein Zeichen deines Daseins. Doch zugleich brennt in dir die Angst, dass nichts davon reicht. Die Wunde von Tor 1 ist das Gefühl, dass deine Schöpfung immer zu klein ist für die Größe der Welt.\n\nChiron hier flüstert dir: Dein Schmerz liegt darin, dass du deinen Wert an deinem Werk misst. Du verwechselst dein Sein mit deiner Leistung. Darum reißt es, wenn andere nicht sehen, was du bringst.\n\nDoch in dieser Wunde ruht dein größtes Geschenk. Deine Kreativität ist nicht ein Mittel zum Beweis, sondern ein Fluss, der dich lebendig macht. Wenn du dich erlaubst zu erschaffen, ohne Ergebnis, wird dein Ausdruck zu einer Quelle der Heilung – für dich und für andere.\n\nDeine Heilung geschieht, wenn du dein Schaffen nicht länger an den Applaus koppelst, sondern an das innere Ja. Dann wird dein Ausdruck wahr, und deine Gabe erhellt andere nicht, weil sie groß ist, sondern weil sie echt ist.",
            2: "In dir wohnt die Sehnsucht nach Richtung. Doch die Wunde von Tor 2 liegt im Irrtum, dass du sie selbst machen müsstest. So spannst du dich an, planst, führst, treibst – und verlierst dabei den leisen Kompass deines Körpers.\n\nChiron hier zeigt, dass deine Verletzung in der Verwechslung liegt: du glaubst, Sinn sei ein Werk deiner Anstrengung. Dabei bist du nicht der Lenker, sondern die Empfängerin.\n\nDein Geschenk entfaltet sich, wenn du lernst, still zu werden. Wenn du die Wege kommen lässt, statt sie zu erzwingen. Dann erkennst du, dass Richtung nicht aus Leistung entsteht, sondern aus Hingabe.\n\nDie Heilung beginnt, wenn du dem Raum vertraust, der dich trägt. Plötzlich finden dich Menschen, die wie Schlüssel klingen, Arbeit, die sich anfühlt wie Atem, Begegnungen, die deine Straße beleuchten. Deine Gabe ist es, zur Schale zu werden, die nichts hält und in deren Weite alles Platz findet.",
            3: "Chaos ist dir vertraut. Pläne brechen, Strukturen fallen, Sicherheiten lösen sich auf – und du spürst die Wunde: das Gefühl, dass mit dir etwas nicht stimmt, weil Ordnung nicht bleibt.\n\nChiron in Tor 3 bringt die Angst, im Chaos verloren zu gehen. Du suchst nach Kontrolle, nach einem festen Halt, und doch entgleitet er dir.\n\nDein Geschenk liegt darin, zu erkennen, dass du nicht das Chaos bist – du bist die, die aus ihm neue Ordnung formt. Jedes Scheitern, jeder Bruch bringt dir Weisheit über das, was trägt.\n\nDie Heilung geschieht, wenn du Fehler nicht länger als Schuld liest, sondern als Samen. Du lernst, dass jeder Zusammenbruch ein Anfang ist, dass jede Verwirrung den Keim neuer Klarheit trägt. So wirst du zur Übersetzerin von Chaos in Form – und andere finden Vertrauen, weil du wagst, wo alles wankt.",
            4: "Die Wunde dieses Tores ist das nagende Gefühl, keine Antwort zu haben. Du suchst, du rechnest, du prüfst – und deine Gedanken kreisen, bis der Kopf flimmert. Du glaubst, dass Sicherheit nur dort ist, wo eine Lösung liegt.\n\nDoch Chiron in Tor 4 zeigt: Die Verletzung liegt in der Jagd nach endgültigen Wahrheiten. In dir erwacht die Angst, unzulänglich zu sein, wenn dein Kopf schweigt.\n\nDein Geschenk entfaltet sich, wenn du begreifst: Antworten sind nicht Endpunkte, sondern Brücken. Deine Klarheit liegt nicht darin, alles zu wissen, sondern darin, Fragen zu halten, bis sich Wahrheit zeigt.\n\nDie Heilung kommt, wenn du die Stille zwischen den Gedanken nicht mehr füllst. Dort, im Schweigen, wächst die Antwort, die kein Beweis braucht. Du wirst zur Stimme, die Orientierung schenkt – nicht weil sie alles weiß, sondern weil sie den Mut hat, auch Nicht-Wissen auszuhalten.",
            5: "Du spürst die Wunde, wenn dein Leben aus dem Takt fällt. Wenn Routinen zerbrechen, wenn Pläne nicht halten, wenn andere deinen Rhythmus stören. Tief in dir liegt die Sehnsucht nach Verlässlichkeit – und die Angst, dass sie dir nie gegönnt ist.\n\nChiron in Tor 5 bringt die Verletzung, sich dem falschen Takt anpassen zu müssen. Zu früh, zu spät, nie im richtigen Moment. Du glaubst, dass mit dir etwas nicht stimmt, weil du nicht so funktionierst wie die anderen.\n\nDoch dein Geschenk ist dein eigener Rhythmus. Dein Körper kennt den Takt, der dich trägt. Wenn du dich ihm hingibst, wirst du zur Einladung für andere, ihren eigenen Puls zu finden.\n\nDie Heilung geschieht, wenn du anerkennst: Du bist kein Fehler, weil du nicht \"mit der Masse\" schwingst. Dein Rhythmus ist die Wahrheit. Und wenn du ihn lebst, wird er zum Herzschlag für alle, die dich umgeben.",
            6: "Deine Wunde zeigt sich dort, wo Nähe und Distanz nicht zusammenpassen. Du fürchtest den Konflikt – und zugleich spürst du, wie er unausweichlich wird. So ziehst du dich zurück oder stürzt dich hinein, und in beiden Fällen bleibt ein Schmerz.\n\nChiron in Tor 6 zeigt, dass die Verletzung in der Angst liegt, deine Gefühle seien zu viel. Dass deine Reibung zerstört, statt Verbindung zu schaffen.\n\nDoch dein Geschenk liegt genau hier: Reibung ist kein Fehler, sie ist der Funke, der Beziehung echt macht. Wenn du deine Gefühle annimmst, werden sie zum Tor, durch das Intimität tiefer wird.\n\nDie Heilung geschieht, wenn du erkennst: Nähe braucht Reibung, damit sie lebendig bleibt. Dein Mut, Gefühle nicht zu glätten, schenkt anderen die Freiheit, ebenso echt zu sein.",
            7: "Die Wunde dieses Tores liegt in der Verantwortung. Du spürst den Drang, Richtung zu geben – und zugleich die Angst, andere in die Irre zu führen. Führung lastet schwer auf dir, weil du glaubst, sie müsse perfekt sein.\n\nChiron hier zeigt: Die Verletzung ist die Verwechslung von Führung mit Kontrolle. Du meinst, du müsstest alles wissen, alle Antworten haben, alle schützen.\n\nDoch dein Geschenk liegt darin, dass wahre Führung Zuhören ist. Dass du führst, indem du das Feld spürst, nicht indem du Kommandos gibst.\n\nDie Heilung geschieht, wenn du dich erlaubst, unvollkommen zu sein. Deine Authentizität wird zur Richtung, deine Demut zur Kraft. So wirst du zur Führung, die nicht drückt, sondern hebt.",
            8: "Deine Wunde liegt im Gefühl, dass dein Beitrag unsichtbar bleibt. Du fragst dich: Wofür bin ich da? – und fürchtest, dass deine Stimme nie Gewicht haben wird.\n\nChiron in Tor 8 zeigt dir, dass die Verletzung im Vergleichen liegt. Du glaubst, du müsstest so beitragen wie die anderen, um anerkannt zu sein.\n\nDoch dein Geschenk ist deine Einzigartigkeit. Dein Beitrag ist nicht laut, aber unverwechselbar. Er besteht darin, dass du dich selbst einbringst, nicht eine Rolle spielst.\n\nDie Heilung geschieht, wenn du erkennst: Dein Wert liegt nicht im Applaus, sondern im Klang deiner eigenen Note. Dein Beitrag trägt das Ganze, gerade weil er nur von dir kommen kann.",
            9: "Deine Wunde liegt im Zersplittern. So viele Aufgaben, so viele Stimmen, so viele Richtungen – und du fühlst dich schuldig, weil du nichts \"zu Ende bringst\". Der Schmerz sitzt tief: das Gefühl, dass deine Kraft zu klein ist für die Welt.\n\nChiron in Tor 9 zeigt, dass die Verletzung im Kampf gegen deine eigene Natur liegt. Du versuchst, alles zu umfassen, und verlierst dich in der Weite.\n\nDoch dein Geschenk liegt in der Fokussierung. Du bist hier, um das Wesentliche zu sehen, den Punkt zu benennen, der zählt. Deine Kraft liegt nicht in der Menge, sondern in der Tiefe.\n\nDie Heilung geschieht, wenn du anerkennst: Du musst nicht alles tragen. Dein Nein schenkt dir Schärfe, dein Ja Tiefe. So wird deine Präsenz zu einer Kraft, die andere bündelt, ohne zu zwingen.",
            10: "Die Wunde dieses Tores ist uralt: die Angst, falsch zu sein, so wie du bist. Du hast gelernt, dass Liebe Bedingungen hat, dass Anerkennung vom Verhalten abhängt.\n\nChiron in Tor 10 lässt dich fühlen, dass Selbstliebe keine Selbstverständlichkeit ist. Du suchst nach Spiegeln im Außen, die dir bestätigen sollen, dass du genügst – und findest doch nie genug.\n\nDoch dein Geschenk ist, dass du zur Verkörperung der Selbstliebe werden kannst. Wenn du dich in deiner Eigenheit bejahst, lehrst du andere, dass sie es ebenso dürfen.\n\nDie Heilung geschieht, wenn du erkennst: Dein Wert war nie verhandelbar. Deine Art, zu gehen, zu sprechen, zu atmen, ist genug. Du bist nicht hier, dich zu biegen – du bist hier, ein lebendiges Ja zu dir selbst zu sein."
        };
    }
}
// Chiron Centers
const chironCenters = [
    { center: "HEAD", healing: "Inspirationsheilung", wound: "Inspirationswunde", gates: [64, 61, 63] },
    { center: "AJNA", healing: "Verstandesheilung", wound: "Verstandeswunde", gates: [47, 24, 11] },
    { center: "THROAT", healing: "Ausdrucksheilung", wound: "Ausdruckswunde", gates: [62, 23, 56, 16, 20, 31, 33, 8] },
    { center: "G", healing: "Identitätsheilung", wound: "Identitätswunde", gates: [1, 13, 25, 46, 2, 15, 10, 7] },
    { center: "HEART", healing: "Wertheilung", wound: "Wertwunde", gates: [21, 40, 26, 51] },
    { center: "SOLAR", healing: "Emotionsheilung", wound: "Emotionswunde", gates: [36, 22, 37, 6, 49, 55, 30] },
    { center: "SACRAL", healing: "Lebenskraftheilung", wound: "Lebenskraftwunde", gates: [34, 5, 14, 29, 59, 9, 3] },
    { center: "SPLEEN", healing: "Instinktheilung", wound: "Instinktwunde", gates: [48, 57, 44, 50, 32, 28, 18] },
    { center: "ROOT", healing: "Druckheilung", wound: "Druckwunde", gates: [41, 39, 53, 38, 58, 54, 52, 19, 60] }
];
// Initialisiere Chiron-Datenbank
function initChironDatabase() {
    console.log('[CHIRON-DB] Initialisiere Chiron-Datenbank...');
    // Erstelle Tabellen
    chironDb.exec(`
    CREATE TABLE IF NOT EXISTS chiron_gates (
      gate_number INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      deep_meaning TEXT NOT NULL,
      unconscious_meaning TEXT,
      description TEXT,
      center TEXT,
      healing TEXT,
      wound TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chiron_centers (
      center TEXT PRIMARY KEY,
      healing TEXT NOT NULL,
      wound TEXT NOT NULL,
      gates TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
    // Füge fehlende Spalten hinzu, falls sie nicht existieren
    try {
        chironDb.exec(`ALTER TABLE chiron_gates ADD COLUMN unconscious_meaning TEXT;`);
    }
    catch (e) {
        // Spalte existiert bereits
    }
    // Füge Chiron Gates hinzu
    const insertGate = chironDb.prepare(`
    INSERT OR REPLACE INTO chiron_gates (gate_number, name, deep_meaning, unconscious_meaning, description, center, healing, wound)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const allChironTexts = getAllChironTexts();
    const unconsciousTexts = getUnconsciousChironTexts();
    Object.entries(allChironTexts).forEach(([gateNumber, deepMeaning]) => {
        const gateNum = parseInt(gateNumber);
        const name = `Tor ${gateNum}`;
        const description = `Chiron bewusst – ${name}: ${deepMeaning.split('\n')[0].substring(0, 100)}...`;
        const unconsciousMeaning = unconsciousTexts[gateNum] || '';
        // Finde das entsprechende Center
        const center = chironCenters.find(c => c.gates.includes(gateNum));
        insertGate.run(gateNum, name, deepMeaning, unconsciousMeaning, description, center?.center || 'UNKNOWN', center?.healing || 'Heilung', center?.wound || 'Wunde');
    });
    // Füge Chiron Centers hinzu
    const insertCenter = chironDb.prepare(`
    INSERT OR REPLACE INTO chiron_centers (center, healing, wound, gates)
    VALUES (?, ?, ?, ?)
  `);
    chironCenters.forEach(center => {
        insertCenter.run(center.center, center.healing, center.wound, JSON.stringify(center.gates));
    });
    console.log('[CHIRON-DB] Chiron-Datenbank erfolgreich initialisiert');
}
// Funktionen zum Abrufen der Daten
function getAllChironGates() {
    return chironDb.prepare('SELECT * FROM chiron_gates ORDER BY gate_number').all();
}
function getChironGate(gateNumber) {
    return chironDb.prepare('SELECT * FROM chiron_gates WHERE gate_number = ?').get(gateNumber);
}
function getAllChironCenters() {
    return chironDb.prepare('SELECT * FROM chiron_centers ORDER BY center').all();
}
function getChironCenter(center) {
    return chironDb.prepare('SELECT * FROM chiron_centers WHERE center = ?').get(center);
}
// Initialisiere die Datenbank beim Import
initChironDatabase();
exports.default = chironDb;
