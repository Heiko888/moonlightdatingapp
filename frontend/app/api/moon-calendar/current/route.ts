import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get('date') || new Date().toISOString();
    const targetDate = new Date(date);

    // Mondphase berechnen (vereinfachte Berechnung)
    const moonPhase = calculateMoonPhase(targetDate);
    
    // Mondkalender-Daten
    const moonData = {
      date: targetDate.toISOString(),
      phase: moonPhase.phase,
      phaseName: moonPhase.name,
      illumination: moonPhase.illumination,
      nextNewMoon: getNextNewMoon(targetDate),
      nextFullMoon: getNextFullMoon(targetDate),
      zodiacSign: getMoonZodiacSign(targetDate),
      energy: getMoonEnergy(moonPhase.phase),
      recommendations: getMoonRecommendations(moonPhase.phase)
    };

    return NextResponse.json({
      success: true,
      data: moonData
    });

  } catch (error) {
    console.error('Moon Calendar API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Interner Serverfehler'
        }
      },
      { status: 500 }
    );
  }
}

function calculateMoonPhase(date: Date) {
  // Vereinfachte Mondphasen-Berechnung
  const knownNewMoon = new Date('2024-01-11T11:57:00Z'); // Bekannter Neumond
  const lunarCycle = 29.53059; // Tage im Mondzyklus
  
  const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const cyclePosition = ((daysSinceNewMoon % lunarCycle) + lunarCycle) % lunarCycle;
  
  const illumination = Math.abs(Math.cos(2 * Math.PI * cyclePosition / lunarCycle));
  
  let phase: string;
  let name: string;
  
  if (cyclePosition < 1.84566) {
    phase = 'new';
    name = 'Neumond';
  } else if (cyclePosition < 5.53699) {
    phase = 'waxing_crescent';
    name = 'Zunehmender Halbmond';
  } else if (cyclePosition < 9.22831) {
    phase = 'first_quarter';
    name = 'Erstes Viertel';
  } else if (cyclePosition < 12.91963) {
    phase = 'waxing_gibbous';
    name = 'Zunehmender Mond';
  } else if (cyclePosition < 16.61096) {
    phase = 'full';
    name = 'Vollmond';
  } else if (cyclePosition < 20.30228) {
    phase = 'waning_gibbous';
    name = 'Abnehmender Mond';
  } else if (cyclePosition < 23.99361) {
    phase = 'last_quarter';
    name = 'Letztes Viertel';
  } else {
    phase = 'waning_crescent';
    name = 'Abnehmender Halbmond';
  }
  
  return {
    phase,
    name,
    illumination: Math.round(illumination * 100)
  };
}

function getNextNewMoon(currentDate: Date): string {
  const nextNewMoon = new Date(currentDate);
  nextNewMoon.setDate(currentDate.getDate() + 15); // Vereinfacht: ~15 Tage bis zum nächsten Neumond
  return nextNewMoon.toISOString();
}

function getNextFullMoon(currentDate: Date): string {
  const nextFullMoon = new Date(currentDate);
  nextFullMoon.setDate(currentDate.getDate() + 7); // Vereinfacht: ~7 Tage bis zum nächsten Vollmond
  return nextFullMoon.toISOString();
}

function getMoonZodiacSign(date: Date): string {
  const signs = [
    'Widder', 'Stier', 'Zwillinge', 'Krebs', 'Löwe', 'Jungfrau',
    'Waage', 'Skorpion', 'Schütze', 'Steinbock', 'Wassermann', 'Fische'
  ];
  
  // Vereinfachte Berechnung basierend auf dem Datum
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const signIndex = Math.floor(dayOfYear / 30.44) % 12;
  
  return signs[signIndex];
}

function getMoonEnergy(phase: string): string {
  const energyMap: Record<string, string> = {
    'new': 'Neubeginn und Intentionen setzen',
    'waxing_crescent': 'Wachstum und Planung',
    'first_quarter': 'Aktion und Entscheidungen',
    'waxing_gibbous': 'Anpassung und Verfeinerung',
    'full': 'Vollendung und Manifestation',
    'waning_gibbous': 'Dankbarkeit und Teilen',
    'last_quarter': 'Vergebung und Loslassen',
    'waning_crescent': 'Ruhe und Reflexion'
  };
  
  return energyMap[phase] || 'Unbekannte Mondenergie';
}

function getMoonRecommendations(phase: string): string[] {
  const recommendations: Record<string, string[]> = {
    'new': [
      'Neue Projekte starten',
      'Intentionen setzen',
      'Vision Board erstellen',
      'Ziele definieren'
    ],
    'waxing_crescent': [
      'Pläne konkretisieren',
      'Erste Schritte unternehmen',
      'Ressourcen sammeln',
      'Netzwerk aufbauen'
    ],
    'first_quarter': [
      'Entscheidungen treffen',
      'Aktionen durchführen',
      'Herausforderungen angehen',
      'Fortschritt überprüfen'
    ],
    'waxing_gibbous': [
      'Pläne verfeinern',
      'Anpassungen vornehmen',
      'Details ausarbeiten',
      'Qualität verbessern'
    ],
    'full': [
      'Ergebnisse feiern',
      'Manifestationen würdigen',
      'Vollendung genießen',
      'Erfolge teilen'
    ],
    'waning_gibbous': [
      'Dankbarkeit üben',
      'Erfahrungen teilen',
      'Wissen weitergeben',
      'Gemeinschaft stärken'
    ],
    'last_quarter': [
      'Altes loslassen',
      'Vergebung üben',
      'Aufräumen und ordnen',
      'Bilanz ziehen'
    ],
    'waning_crescent': [
      'Ruhe und Erholung',
      'Reflexion und Meditation',
      'Intuition stärken',
      'Neue Zyklen vorbereiten'
    ]
  };
  
  return recommendations[phase] || ['Mondenergie nutzen'];
}
