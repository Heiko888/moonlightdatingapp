import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4001';

// Test-Funktionen
async function testTestDataSeeding() {
  console.log('🧪 Teste Test-Daten Seeding...');
  
  try {
    const response = await fetch(`${BASE_URL}/test-data/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Test-Daten Seeding erfolgreich');
      console.log(`📊 ${result.data.usersCreated} Benutzer erstellt`);
      return true;
    } else {
      console.error('❌ Test-Daten Seeding fehlgeschlagen:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Fehler beim Test-Daten Seeding:', error);
    return false;
  }
}

async function testTestDataStatus() {
  console.log('🧪 Teste Test-Daten Status...');
  
  try {
    const response = await fetch(`${BASE_URL}/test-data/status`);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Test-Daten Status erfolgreich abgerufen');
      console.log(`📊 Test-Benutzer: ${result.data.testUsers}`);
      console.log(`📊 Gesamt-Benutzer: ${result.data.totalUsers}`);
      console.log(`📊 Swipes: ${result.data.totalSwipes}`);
      console.log(`📊 Matches: ${result.data.totalMatches}`);
      console.log(`📊 Analysen: ${result.data.totalAnalyses}`);
      return true;
    } else {
      console.error('❌ Test-Daten Status fehlgeschlagen:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Fehler beim Abrufen des Test-Daten Status:', error);
    return false;
  }
}

async function testTestDataUsers() {
  console.log('🧪 Teste Test-Benutzer Abruf...');
  
  try {
    const response = await fetch(`${BASE_URL}/test-data/users`);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Test-Benutzer erfolgreich abgerufen');
      console.log(`📊 ${result.data.count} Test-Benutzer gefunden`);
      
      result.data.users.forEach((user: any, index: number) => {
        console.log(`👤 ${index + 1}. ${user.name} (${user.hd_type} - ${user.profile})`);
      });
      
      return true;
    } else {
      console.error('❌ Test-Benutzer Abruf fehlgeschlagen:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Fehler beim Abrufen der Test-Benutzer:', error);
    return false;
  }
}

async function testSwipeProfiles() {
  console.log('🧪 Teste Swipe-Profile API...');
  
  try {
    // Hole zuerst Test-Benutzer
    const usersResponse = await fetch(`${BASE_URL}/test-data/users`);
    const usersResult = await usersResponse.json();
    
    if (!usersResult.success || usersResult.data.users.length === 0) {
      console.log('⚠️ Keine Test-Benutzer verfügbar für Swipe-Test');
      return false;
    }
    
    const userId = usersResult.data.users[0].id;
    
    const response = await fetch(`${BASE_URL}/api/swipe/profiles/${userId}`);
    const result = await response.json();
    
    if (Array.isArray(result)) {
      console.log('✅ Swipe-Profile API erfolgreich');
      console.log(`📊 ${result.length} Profile für Swipe verfügbar`);
      
      result.slice(0, 3).forEach((profile: any, index: number) => {
        console.log(`👤 ${index + 1}. ${profile.name} (${profile.hdType} - ${profile.hdProfile}) - Score: ${profile.compatibilityScore}%`);
      });
      
      return true;
    } else {
      console.error('❌ Swipe-Profile API fehlgeschlagen:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ Fehler beim Testen der Swipe-Profile API:', error);
    return false;
  }
}

async function testAdvancedMatching() {
  console.log('🧪 Teste Advanced Matching API...');
  
  try {
    // Hole zuerst Test-Benutzer
    const usersResponse = await fetch(`${BASE_URL}/test-data/users`);
    const usersResult = await usersResponse.json();
    
    if (!usersResult.success || usersResult.data.users.length < 2) {
      console.log('⚠️ Nicht genügend Test-Benutzer für Matching-Test');
      return false;
    }
    
    const user1Id = usersResult.data.users[0].id;
    const user2Id = usersResult.data.users[1].id;
    
    const response = await fetch(`${BASE_URL}/api/advanced-matching/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user1Id,
        user2Id,
        relationshipType: 'romantic'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Advanced Matching API erfolgreich');
      console.log(`📊 Gesamt-Score: ${result.analysis.overallScore}%`);
      console.log(`📊 Energetische Kompatibilität: ${result.analysis.breakdown.energeticCompatibility}%`);
      console.log(`📊 Persönlichkeits-Kompatibilität: ${result.analysis.breakdown.personalityCompatibility}%`);
      console.log(`📊 Stärken: ${result.analysis.strengths.length}`);
      console.log(`📊 Herausforderungen: ${result.analysis.challenges.length}`);
      return true;
    } else {
      console.error('❌ Advanced Matching API fehlgeschlagen:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Fehler beim Testen der Advanced Matching API:', error);
    return false;
  }
}

async function testCompatibleUsers() {
  console.log('🧪 Teste Kompatible Benutzer API...');
  
  try {
    // Hole zuerst Test-Benutzer
    const usersResponse = await fetch(`${BASE_URL}/test-data/users`);
    const usersResult = await usersResponse.json();
    
    if (!usersResult.success || usersResult.data.users.length === 0) {
      console.log('⚠️ Keine Test-Benutzer verfügbar für Kompatibilitäts-Test');
      return false;
    }
    
    const userId = usersResult.data.users[0].id;
    
    const response = await fetch(`${BASE_URL}/api/advanced-matching/compatible-users/${userId}?minCompatibility=70&limit=5`);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Kompatible Benutzer API erfolgreich');
      console.log(`📊 ${result.users.length} kompatible Benutzer gefunden`);
      
      result.users.forEach((user: any, index: number) => {
        console.log(`👤 ${index + 1}. ${user.name} (${user.hdType}) - Score: ${user.compatibilityScore}%`);
      });
      
      return true;
    } else {
      console.error('❌ Kompatible Benutzer API fehlgeschlagen:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Fehler beim Testen der Kompatiblen Benutzer API:', error);
    return false;
  }
}

// Haupttest-Funktion
async function runAllTests() {
  console.log('🚀 Starte API-Tests...\n');
  
  const tests = [
    { name: 'Test-Daten Seeding', fn: testTestDataSeeding },
    { name: 'Test-Daten Status', fn: testTestDataStatus },
    { name: 'Test-Benutzer Abruf', fn: testTestDataUsers },
    { name: 'Swipe-Profile API', fn: testSwipeProfiles },
    { name: 'Advanced Matching API', fn: testAdvancedMatching },
    { name: 'Kompatible Benutzer API', fn: testCompatibleUsers }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    const success = await test.fn();
    
    if (success) {
      passed++;
    } else {
      failed++;
    }
    
    // Kurze Pause zwischen Tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 TEST-ERGEBNISSE:');
  console.log(`✅ Erfolgreich: ${passed}`);
  console.log(`❌ Fehlgeschlagen: ${failed}`);
  console.log(`📈 Erfolgsrate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 Alle Tests erfolgreich!');
  } else {
    console.log('\n⚠️ Einige Tests sind fehlgeschlagen. Überprüfe die Logs.');
  }
}

// Führe Tests aus, wenn das Skript direkt ausgeführt wird
if (require.main === module) {
  runAllTests().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('❌ Fehler beim Ausführen der Tests:', error);
    process.exit(1);
  });
}

export { runAllTests };
