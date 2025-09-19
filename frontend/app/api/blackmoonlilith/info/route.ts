import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fallback-Daten für Black Moon Lilith Info
    const fallbackInfo = {
      id: '1',
      name: 'Black Moon Lilith',
      symbol: '⚸',
      description: 'Black Moon Lilith ist der apogäische Punkt des Mondes - der Punkt, an dem der Mond am weitesten von der Erde entfernt ist. Sie repräsentiert unsere verdrängte, wilde, unabhängige Seite und zeigt, wo wir uns von gesellschaftlichen Erwartungen befreien müssen.',
      mythology: 'Die dunkle Göttin der Unabhängigkeit',
      color: '#2D1B69',
      orbital_period: '8.85 Jahre',
      discovery: 'Berechnet seit der Antike'
    };

    // Versuche Backend-API zu erreichen
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4001';
    try {
      const response = await fetch(`${backendUrl}/blackmoonlilith/info`, {
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
    return NextResponse.json(fallbackInfo);

  } catch (error) {
    console.error('Fehler beim Abrufen der Black Moon Lilith-Informationen:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Black Moon Lilith-Informationen' },
      { status: 500 }
    );
  }
}
