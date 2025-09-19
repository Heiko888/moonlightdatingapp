import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planet: string }> }
) {
  try {
    const resolvedParams = await params;
    const planetName = resolvedParams.planet.charAt(0).toUpperCase() + resolvedParams.planet.slice(1);
    
    // HTTP-Request an das Backend
    const response = await fetch(`http://localhost:4001/api/planets/${planetName.toLowerCase()}/gates`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Keine Gates für Planet ${planetName} gefunden` },
        { status: 404 }
      );
    }

    const planetGates = await response.json();
    return NextResponse.json(planetGates);
  } catch (error) {
    console.error('Fehler beim Laden der Planet-Gates:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
