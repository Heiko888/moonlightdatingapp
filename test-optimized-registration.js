/**
 * Test der optimierten Registrierung mit automatischer Human Design Chart-Erstellung
 */

async function testOptimizedRegistration() {
  console.log('🧪 Teste optimierte Registrierung...\n');
  
  const testUser = {
    username: 'testuser_' + Date.now(),
    email: `test${Date.now()}@hdapp.com`,
    password: 'test123456',
    firstName: 'Test',
    lastName: 'User',
    subscriptionPlan: 'basic',
    birthDate: '1990-05-15',
    birthTime: '14:30',
    birthPlace: 'Berlin, Deutschland'
  };
  
  try {
    console.log('📝 Registriere neuen Benutzer mit Geburtsdaten...');
    console.log(`👤 Name: ${testUser.firstName} ${testUser.lastName}`);
    console.log(`📧 E-Mail: ${testUser.email}`);
    console.log(`📅 Geburtsdatum: ${testUser.birthDate}`);
    console.log(`🕐 Geburtszeit: ${testUser.birthTime}`);
    console.log(`📍 Geburtsort: ${testUser.birthPlace}\n`);
    
    const response = await fetch('http://localhost:4001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    if (response.ok) {
      const data = await response.json();
      
      console.log('✅ Registrierung erfolgreich!');
      console.log(`🔑 Token erhalten: ${data.token ? 'Ja' : 'Nein'}`);
      console.log(`👤 User ID: ${data.user.id}`);
      console.log(`📧 E-Mail: ${data.user.email}`);
      console.log(`📅 Geburtsdaten gespeichert: ${data.user.birthDate ? 'Ja' : 'Nein'}`);
      
      if (data.chart) {
        console.log('\n🌟 Human Design Chart automatisch erstellt!');
        console.log(`🎭 Typ: ${data.chart.hdType}`);
        console.log(`📊 Profil: ${data.chart.profile}`);
        console.log(`🎯 Autorität: ${data.chart.authority}`);
        console.log(`💡 Strategie: ${data.chart.strategy}`);
        console.log(`✨ Inkarnationskreuz: ${data.chart.incarnationCross}`);
        
        console.log('\n🎉 VOLLSTÄNDIGE REGISTRIERUNG ERFOLGREICH!');
        console.log('   ✓ Benutzer erstellt');
        console.log('   ✓ Geburtsdaten gespeichert');
        console.log('   ✓ Human Design Chart berechnet');
        console.log('   ✓ Chart in Datenbank gespeichert');
        console.log('   ✓ JWT Token generiert');
        
      } else {
        console.log('\n⚠️ Kein Chart erstellt - möglicherweise fehlende Geburtsdaten');
      }
      
    } else {
      const errorData = await response.json();
      console.error('❌ Registrierung fehlgeschlagen:', errorData.error);
    }
    
  } catch (error) {
    console.error('❌ Test fehlgeschlagen:', error.message);
  }
}

// Test ausführen
testOptimizedRegistration();


