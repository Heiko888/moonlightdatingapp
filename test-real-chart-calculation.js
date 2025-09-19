/**
 * Test der echten Chart-Berechnung mit deinen Geburtsdaten
 */

async function testRealChartCalculation() {
  console.log('🧪 Teste echte Chart-Berechnung mit deinen Geburtsdaten...\n');
  
  const birthData = {
    birth_date: '1980-12-08',
    birth_time: '22:10',
    birth_place: 'Miltenberg, Deutschland',
    name: 'Test User'
  };
  
  try {
    console.log('📊 Geburtsdaten:', birthData);
    console.log('🎯 Erwartetes Ergebnis: Generator 6/3\n');
    
    const response = await fetch('http://localhost:4001/charts/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(birthData)
    });
    
    if (response.ok) {
      const data = await response.json();
      
      console.log('✅ Chart-Berechnung erfolgreich!');
      console.log('📋 Vollständige Antwort:', JSON.stringify(data, null, 2));
      
      console.log('\n📋 Berechnete Daten:');
      if (data.chart && data.chart.chart_data && data.chart.chart_data.metadata) {
        console.log(`🎭 Typ: ${data.chart.chart_data.metadata.type || 'Unbekannt'}`);
        console.log(`📊 Profil: ${data.chart.chart_data.metadata.profile || 'Unbekannt'}`);
        console.log(`🎯 Autorität: ${data.chart.chart_data.metadata.authority || 'Unbekannt'}`);
        console.log(`💡 Strategie: ${data.chart.chart_data.metadata.strategy || 'Unbekannt'}`);
        console.log(`✨ Inkarnationskreuz: ${data.chart.chart_data.metadata.incarnationCross || 'Unbekannt'}`);
      } else {
        console.log('❌ Keine Chart-Daten oder Metadata gefunden');
        console.log('📊 Verfügbare Daten:', Object.keys(data));
      }
      
      console.log('\n🔍 Geocoding-Informationen:');
      if (data.chart && data.chart.chart_data && data.chart.chart_data.geocoding) {
        console.log(`📍 Koordinaten: ${data.chart.chart_data.geocoding.coordinates.lat}, ${data.chart.chart_data.geocoding.coordinates.lon}`);
        console.log(`🌍 Zeitzone: ${data.chart.chart_data.geocoding.timezone}`);
        console.log(`🏙️ Adresse: ${data.chart.chart_data.geocoding.formattedAddress}`);
      }
      
      console.log('\n📊 Berechnungsdetails:');
      console.log(`🔬 Methode: ${data.calculation?.method || 'Unbekannt'}`);
      console.log(`📅 Ephemeris-Version: ${data.calculation?.ephemerisVersion || 'Unbekannt'}`);
      console.log(`🎯 Präzision: ${data.calculation?.precision || 'Unbekannt'}`);
      
      // Vergleich mit erwarteten Werten
      const isCorrect = data.chart?.chart_data?.metadata?.type === 'Generator' && 
                       data.chart?.chart_data?.metadata?.profile === '6/3';
      
      console.log('\n🎯 Ergebnis-Vergleich:');
      console.log(`✅ Korrekt: ${isCorrect ? 'JA' : 'NEIN'}`);
      if (!isCorrect) {
        console.log('❌ Erwartet: Generator 6/3');
        console.log(`❌ Erhalten: ${data.chart?.chart_data?.metadata?.type} ${data.chart?.chart_data?.metadata?.profile}`);
      }
      
    } else {
      const errorData = await response.json();
      console.error('❌ Chart-Berechnung fehlgeschlagen:', errorData.error);
    }
    
  } catch (error) {
    console.error('❌ Test fehlgeschlagen:', error.message);
  }
}

// Test ausführen
testRealChartCalculation();
