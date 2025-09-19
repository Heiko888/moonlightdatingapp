import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  console.log('Lilith Gates API aufgerufen - lade alle 64 Gates');
  
  try {
    // Pfad zu den JSON-Dateien
    const scriptsDir = path.join(process.cwd(), '..', 'backend', 'src', 'scripts');
    
    // Alle bewussten Gates laden
    const consciousGates = [];
    const consciousFiles = [
      'lilithGates1to10.json',
      'lilithGates6to20.json', 
      'lilithGates21to30.json',
      'lilithGates31.json',
      'lilithGates32to40.json',
      'lilithGates41to50.json',
      'lilithGates51to64.json'
    ];

    for (const file of consciousFiles) {
      try {
        const filePath = path.join(scriptsDir, file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          const gates = JSON.parse(content);
          consciousGates.push(...gates);
          console.log(`Geladen: ${file} - ${gates.length} Gates`);
        }
      } catch (fileError) {
        console.warn(`Fehler beim Laden von ${file}:`, fileError);
      }
    }

    // Alle unbewussten Gates laden
    const unconsciousGates = [];
    const unconsciousFiles = [
      'lilithGatesUnconscious1to10.json',
      'lilithGatesUnconscious11to20.json',
      'lilithGatesUnconscious21to30.json',
      'lilithGatesUnconscious31.json',
      'lilithGatesUnconscious32to40.json',
      'lilithGatesUnconscious41to50.json',
      'lilithGatesUnconscious51to60.json',
      'lilithGatesUnconscious61to64.json'
    ];

    for (const file of unconsciousFiles) {
      try {
        const filePath = path.join(scriptsDir, file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          const gates = JSON.parse(content);
          unconsciousGates.push(...gates);
          console.log(`Geladen: ${file} - ${gates.length} Gates`);
        }
      } catch (fileError) {
        console.warn(`Fehler beim Laden von ${file}:`, fileError);
      }
    }

    // Bewusste und unbewusste Gates zusammenführen
    const allGates = [];
    const maxGate = Math.max(
      ...consciousGates.map(g => g.gate), 
      ...unconsciousGates.map(g => g.gate)
    );

    for (let gateNumber = 1; gateNumber <= maxGate; gateNumber++) {
      const consciousGate = consciousGates.find(g => g.gate === gateNumber);
      const unconsciousGate = unconsciousGates.find(g => g.gate === gateNumber);

      if (consciousGate || unconsciousGate) {
        const combinedGate = {
          gate: gateNumber,
          name: consciousGate?.name || unconsciousGate?.name || `Tor ${gateNumber}`,
          // Bewusste Daten
          description: consciousGate?.text || '',
          deep_meaning: consciousGate?.text || '',
          shadow_aspects: consciousGate?.shadow || '',
          gifts: consciousGate?.gift || '',
          affirmation: consciousGate?.siddhi || '',
          // Unbewusste Daten
          unconscious_description: unconsciousGate?.text || '',
          unconscious_deep_meaning: unconsciousGate?.text || '',
          unconscious_shadow_aspects: unconsciousGate?.shadow || '',
          unconscious_gifts: unconsciousGate?.gift || '',
          unconscious_affirmation: unconsciousGate?.siddhi || ''
        };
        allGates.push(combinedGate);
      }
    }

    console.log(`Alle Gates geladen: ${allGates.length} von 64`);
    return NextResponse.json(allGates);

  } catch (error) {
    console.error('Fehler beim Laden der JSON-Dateien:', error);
    
    // Fallback: Nur die ersten 10 Gates
    const fallbackData = [
      {
        gate: 1,
        name: "Der Schöpfer",
        description: "Lilith in Tor 1 bringt die Kraft der Schöpfung und des Ausdrucks. Du hast die Fähigkeit, deine kreative Energie wild und ungezähmt zu leben.",
        deep_meaning: "Die tiefe Bedeutung liegt in der natürlichen Kreativität. Du erkennst, dass dein Schaffen nicht gezähmt werden will, sondern wild und frei fließen muss.",
        shadow_aspects: "Unbewusste Angst vor zu viel Ausdruck, Zurückhaltung des Feuers, Scham über die eigene Kreativität",
        gifts: "Instinktives Schaffen, Lava-artige Kreativität, Selbstversöhnende Kraft",
        affirmation: "Ich lebe Tor 1 mit wilder Lilith Kraft. Mein Schaffen ist wild und instinktiv.",
        unconscious_description: "Tief in dir liegt eine rohe Angst: dass dein Ausdruck zu viel ist. Unbewusst hast du dich klein gemacht, dein Feuer zurückgehalten, damit es niemanden blendet.",
        unconscious_deep_meaning: "Dein Schaffen ist instinktiv, es bricht hervor wie Lava. Und wenn du es nicht mehr drosselst, wird es zur Kraft, die dich mit dir selbst versöhnt.",
        unconscious_shadow_aspects: "Unbewusste Angst vor zu viel Ausdruck, Zurückhaltung des Feuers, Scham über die eigene Kreativität",
        unconscious_gifts: "Instinktives Schaffen, Lava-artige Kreativität, Selbstversöhnende Kraft",
        unconscious_affirmation: "Ich lebe Tor 1 unbewusst mit wilder Lilith Kraft. Mein Schaffen ist wild und instinktiv."
      }
    ];
    
    return NextResponse.json(fallbackData);
  }
}