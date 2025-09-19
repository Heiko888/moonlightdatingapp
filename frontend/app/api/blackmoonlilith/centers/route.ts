import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fallback-Daten für Black Moon Lilith Centers
    const fallbackCenters = [
      {
        id: '1',
        center_name: 'Kopf-Zentrum',
        description: 'Black Moon Lilith im Kopf-Zentrum bringt wilde, unkonventionelle Gedanken und Ideen. Du denkst außerhalb der Norm und stellst gesellschaftliche Konzepte in Frage.',
        energy_type: 'Inspiration'
      },
      {
        id: '2',
        center_name: 'Hals-Zentrum',
        description: 'Black Moon Lilith im Hals-Zentrum gibt dir eine kraftvolle, unabhängige Stimme. Du sprichst deine Wahrheit ohne Kompromisse und weigerst dich, dich anzupassen.',
        energy_type: 'Manifestation'
      },
      {
        id: '3',
        center_name: 'G-Zentrum',
        description: 'Black Moon Lilith im G-Zentrum zeigt deinen wilden, unabhängigen Lebensweg. Du folgst deiner eigenen Richtung und weigerst dich, den Erwartungen anderer zu entsprechen.',
        energy_type: 'Richtung'
      },
      {
        id: '4',
        center_name: 'Herz-Zentrum',
        description: 'Black Moon Lilith im Herz-Zentrum bringt wilde, unabhängige Willenskraft. Du kämpfst für deine eigenen Werte und weigerst dich, dich zu verbiegen.',
        energy_type: 'Willenskraft'
      },
      {
        id: '5',
        center_name: 'Solarplexus-Zentrum',
        description: 'Black Moon Lilith im Solarplexus-Zentrum zeigt deine wilden, ungezähmten Emotionen. Du fühlst tief und intensiv, ohne dich zu entschuldigen.',
        energy_type: 'Emotionen'
      },
      {
        id: '6',
        center_name: 'Sakral-Zentrum',
        description: 'Black Moon Lilith im Sakral-Zentrum bringt wilde, unabhängige Lebenskraft. Du lebst deine Sexualität und Kreativität auf deine eigene Weise.',
        energy_type: 'Lebenskraft'
      },
      {
        id: '7',
        center_name: 'Milz-Zentrum',
        description: 'Black Moon Lilith im Milz-Zentrum gibt dir wilde, instinktive Intuition. Du vertraust deinem Bauchgefühl und weigerst dich, rationale Erklärungen zu akzeptieren.',
        energy_type: 'Intuition'
      },
      {
        id: '8',
        center_name: 'Wurzel-Zentrum',
        description: 'Black Moon Lilith im Wurzel-Zentrum zeigt deine wilde, unabhängige Überlebensenergie. Du schaffst deine eigene Sicherheit und weigerst dich, dich von anderen abhängig zu machen.',
        energy_type: 'Stress'
      }
    ];

    // Versuche Backend-API zu erreichen
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4001';
    try {
      const response = await fetch(`${backendUrl}/blackmoonlilith/centers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.log('Backend nicht erreichbar, verwende Fallback-Daten');
    }

    // Fallback-Daten zurückgeben
    return NextResponse.json(fallbackCenters);

  } catch (error) {
    console.error('Fehler beim Abrufen der Black Moon Lilith Centers:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Black Moon Lilith Centers' },
      { status: 500 }
    );
  }
}
