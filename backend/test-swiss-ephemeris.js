/**
 * Test der neuen Swiss Ephemeris Alternative
 */

// Da TypeScript-Kompilierung problematisch ist, verwenden wir JavaScript für Tests
const { swissEphemerisAlternative } = require('./dist/services/swissEphemerisService');
const { HumanDesignDataService } = require('./dist/data/humanDesignData');

async function testSwissEphemeris() {
  console.log('🧪 Teste Swiss Ephemeris Alternative...\n');
  
  try {
    // Test-Datum: 1. Januar 2000, 12:00 UTC
    const testDate = new Date('2000-01-01T12:00:00Z');
    
    console.log(`📅 Test-Datum: ${testDate.toISOString()}`);
    
    // Berechne Planetenpositionen
    const result = swissEphemerisAlternative.calculatePositions(testDate);
    
    console.log(`\n🌟 Planetenpositionen:`);
    Object.entries(result.planets).forEach(([planet, position]) => {
      const gateData = swissEphemerisAlternative.longitudeToGate(position.longitude);
      console.log(`${planet.padEnd(8)}: ${position.longitude.toFixed(2)}° → Gate ${gateData.gate}.${gateData.line}`);
    });
    
    // Test Human Design Datenbank
    console.log(`\n🧬 Human Design Datenbank Test:`);
    
    const gate1 = HumanDesignDataService.getGate(1);
    console.log(`Gate 1: ${gate1?.name} (${gate1?.center})`);
    
    const channel = HumanDesignDataService.getChannel(1, 8);
    console.log(`Channel 1-8: ${channel?.name}`);
    
    // Test mit aktivierten Gates
    const activeGates = [1, 8, 14, 20, 34];
    const activeChannels = HumanDesignDataService.getActiveChannels(activeGates);
    
    console.log(`\n📊 Aktive Kanäle für Gates [${activeGates.join(', ')}]:`);
    activeChannels.forEach(channel => {
      console.log(`- ${channel.name} (${channel.gates.join('-')})`);
    });
    
    const definedCenters = HumanDesignDataService.getDefinedCenters(activeChannels);
    console.log(`\n🎯 Definierte Zentren: ${definedCenters.join(', ')}`);
    
    const hdType = HumanDesignDataService.determineType(definedCenters);
    console.log(`\n🎭 Human Design Typ: ${hdType}`);
    
    console.log('\n✅ Alle Tests erfolgreich!');
    
  } catch (error) {
    console.error('❌ Test fehlgeschlagen:', error);
  }
}

// Falls das Script direkt ausgeführt wird
if (require.main === module) {
  testSwissEphemeris();
}

module.exports = { testSwissEphemeris };


