import { initVenusDatabase, initVenusData, insertVenusGatesData } from '../lib/venusDb';

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
    
    // Gates Daten einfügen
    const gatesInit = insertVenusGatesData();
    if (!gatesInit) {
      throw new Error('Fehler beim Einfügen der Venus Gates Daten');
    }
    
    console.log('✅ Venus-Datenbank erfolgreich initialisiert!');
    console.log('📊 Venus-Info, 9 Centers und Gates 1-20 (unbewusst) eingefügt');
    
  } catch (error) {
    console.error('❌ Fehler bei der Venus-Datenbank Initialisierung:', error);
    process.exit(1);
  }
}

main();

