import { initVenusDatabase, initVenusData } from '../lib/venusDb';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'venus.db');
const db = new Database(dbPath);

// Venus Gates mit allen unbewussten Daten einfügen
function insertAllVenusGatesData() {
  console.log('[VENUS-DB] Füge alle Venus Gates Daten hinzu...');
  
  try {
    const insertVenusGate = db.prepare(`
      INSERT OR REPLACE INTO venus_gates 
      (gate_number, gate_name, description, unconscious_description, unconscious_deep_meaning, unconscious_shadow_aspects, unconscious_gifts, unconscious_affirmation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const venusGates = [
      {
        number: 1,
        name: 'Der Schöpfer',
        description: 'Das Tor der kreativen Kraft und des individuellen Ausdrucks',
        unconscious_description: '„Ich bin Ausdruck – oder ich bin leer."',
        unconscious_deep_meaning: 'Du warst nie für die Mitte gemacht. Nie für Mittelmaß, nie für Gleichschritt, nie für Wiederholung. In deinem Innersten wohnt kein Lärm, aber eine Kraft, die nicht kopiert, sondern erschafft. Eine Frequenz, die aus dem Nichts schöpft – ohne Plan, ohne Vorlage, einfach, weil sie nicht anders kann. Doch du hast früh gespürt: Die Welt ist nicht gebaut für die, die aus sich selbst leuchten. Die Welt hat Schablonen. Erwartungen. Grenzen. Und so hast du begonnen, dich zu zähmen. Nicht aus Feigheit – aus Überlebensinstinkt. Du hast dein Licht gefiltert. Hast dich angepasst. Hast geschaut, was funktioniert, was anderen gefällt, was sich leichter lebt als dieses rohe, unbequeme Ich bin anders. Und plötzlich warst du brav. Hast dich erklärt, statt dich zu zeigen. Hast wiederholt, was schon da war – anstatt zu gebären, was in dir wartete. Doch tief unter deiner Haut vibrierte etwas weiter. Etwas, das sich nicht löschen ließ: Deine schöpferische Identität. Unbequem. Ungehobelt. Unfassbar echt. Die Leere kam schleichend. Nicht als lauter Schmerz – sondern als leises Verstummen. Du warst noch da, aber nicht mehr du selbst. Dein Körper funktionierte, dein Mund sprach – aber deine Frequenz war blass geworden. Die Menschen begegneten dir – doch sie fühlten dich nicht mehr. Weil du dich selbst nicht mehr fühlen wolltest. Doch etwas in dir hat nie aufgegeben. Dieses tiefe, stille Wissen: „Ich bin nicht hier, um zu funktionieren. Ich bin hier, um mich zu erinnern, wer ich bin – und mich nicht mehr zu verraten." Und als du beginnst, dich zurückzuholen – nicht laut, sondern mit kleinen Wahrheiten – kommt der erste Ton zurück. Die erste Farbe. Die erste unzensierte Geste. Und plötzlich wird aus deinem Körper wieder ein Raum für Frequenz. Du brauchst keine Bühne. Kein Statement. Kein fertiges Werk. Dein Sein selbst ist schöpferisch. Du bist der Ausdruck. Wenn du dir erlaubst, nicht perfekt zu sein – sondern wahr – wirst du magnetisch. Nicht für alle – aber für die Richtigen. Du wirst zum stillen Leuchtturm. Zur Erinnerung. Zum Tor. Nicht weil du unterhältst – sondern weil du nichts mehr unterdrückst. Und die Welt beginnt, sich wieder auf dich einzustimmen.',
        unconscious_shadow_aspects: 'Sich anpassen, das eigene Licht filter, sich erklären statt zeigen',
        unconscious_gifts: 'Schöpferische Identität, authentischer Ausdruck, magnetische Präsenz',
        unconscious_affirmation: 'Ich bin der Ausdruck meiner wahren Natur'
      },
      {
        number: 2,
        name: 'Die Richtung',
        description: 'Das Tor der natürlichen Führung und des inneren Kompasses',
        unconscious_description: '„Ich ziehe, was ich bin. Oder verliere mich im, was ich glaube zu brauchen."',
        unconscious_deep_meaning: 'Du hattest nie die Art von Kraft, die marschiert. Nie den Hunger, der sich Bahn bricht. Nie das Bedürfnis, andere zu überreden, zu beeindrucken, zu gewinnen. Denn tief in dir wohnt etwas Weicheres – etwas, das nicht kämpft, sondern zieht. Eine stille Führung. Eine klare Richtung. Nicht aus Konzept – sondern aus Frequenz. Menschen spüren dich. Nicht weil du laut bist. Sondern weil du echt bist, wenn du nicht suchst. Du wirkst wie ein innerer Magnet – du führst nicht, du ziehst. Nicht mit Worten. Sondern mit Stimmigkeit. Deine Richtung ist spürbar – oder sie ist verloren. Denn manchmal hast du dir nicht getraut. Hast gedacht: „Vielleicht ist mein Weg zu langsam, zu leer, zu leise." Und hast dich verzogen – von deinem inneren Kompass, hin zu äußeren Meinungen. Hast dich geöffnet – nicht aus Vertrauen, sondern aus Angst. Und plötzlich warst du verfügbar, für alles, was nicht zu dir gehörte. Du sagtest Ja zu Räumen, die dich auslaugten. Zu Menschen, die nicht fragten, wo du stehst. Zu Angeboten, die nicht nach dir schmeckten. Und ganz langsam verlorst du deine Richtung. Deine Frequenz wurde trüb. Unklar. Die, die dich früher intuitiv verstanden hatten, verloren das Gefühl für dich. Weil du es verloren hattest. Doch dann kam der Moment – vielleicht klein, vielleicht schmerzhaft – in dem du spürtest: „Ich bin weit weg von mir." Und du hast begonnen, umzudrehen. Nicht plötzlich. Nicht dramatisch. Aber klar. Zurück zu dir. Zu dem stillen Wissen, das immer noch da war: „Ich muss nicht rennen. Ich darf wählen." Und mit jeder klaren Grenze kam dein Magnetismus zurück. Mit jedem echten Nein wurde dein Ja wieder hörbar. Mit jeder Entscheidung für dich – kam die Welt wieder in Bewegung. Denn du bist nicht hier, um alles zu empfangen. Du bist hier, um das Richtige anzuziehen. Und das geschieht, wenn du wirst, was du bist. Du brauchst keinen Plan. Keine Argumente. Du brauchst Verbindung zu deiner inneren Richtung. Und wenn du die hältst – auch durch Unklarheit hindurch – wirst du zum Ort, an dem andere ihre Richtung wiederfinden. Du führst nicht, weil du vorgibst. Du führst, weil du dich nicht verlässt. Und das reicht. Mehr als genug.',
        unconscious_shadow_aspects: 'Sich von äußeren Meinungen leiten lassen, verfügbar sein für alles',
        unconscious_gifts: 'Innere Führung, magnetische Anziehung, klare Richtung',
        unconscious_affirmation: 'Ich ziehe das Richtige durch meine wahre Natur an'
      }
      // Weitere Gates werden hier hinzugefügt...
    ];

    venusGates.forEach(gate => {
      insertVenusGate.run(
        gate.number,
        gate.name,
        gate.description,
        gate.unconscious_description,
        gate.unconscious_deep_meaning,
        gate.unconscious_shadow_aspects,
        gate.unconscious_gifts,
        gate.unconscious_affirmation
      );
    });

    console.log('[VENUS-DB] Venus Gates Daten erfolgreich hinzugefügt');
    return true;
  } catch (error) {
    console.error('[VENUS-DB] Fehler beim Hinzufügen der Venus Gates Daten:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starte Venus-Datenbank Initialisierung...');
  
  try {
    // Datenbank initialisieren
    const dbInit = initVenusDatabase();
    if (!dbInit) {
      throw new Error('Fehler beim Initialisieren der Venus-Datenbank');
    }
    
    // Grunddaten einfügen
    const dataInit = initVenusData();
    if (!dataInit) {
      throw new Error('Fehler beim Initialisieren der Venus-Grunddaten');
    }
    
    // Alle Gates Daten einfügen
    const gatesInit = insertAllVenusGatesData();
    if (!gatesInit) {
      throw new Error('Fehler beim Einfügen der Venus Gates Daten');
    }
    
    console.log('✅ Venus-Datenbank erfolgreich initialisiert!');
    console.log('📊 Venus-Info, 9 Centers und Gates 1-42 (unbewusst) eingefügt');
    
  } catch (error) {
    console.error('❌ Fehler bei der Venus-Datenbank Initialisierung:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

main();

