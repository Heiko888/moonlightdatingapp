import { NextRequest, NextResponse } from 'next/server';

// Temporärer In-Memory Store (später durch Datenbank ersetzen)
let readingsStore: any[] = [];

// GET /api/coach/readings - Alle Readings für Coach-Dashboard
export async function GET(request: NextRequest) {
  try {
    // Authentifizierung prüfen (später implementieren)
    const authHeader = request.headers.get('authorization');
    
    // TODO: Prüfe ob User Coach-Rechte hat
    // if (!isCoach(authHeader)) {
    //   return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 });
    // }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Filtere nach Status wenn angegeben
    let filteredReadings = status 
      ? readingsStore.filter(r => r.status === status)
      : readingsStore;

    // Sortiere Readings
    filteredReadings.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Statistiken berechnen
    const stats = {
      total: readingsStore.length,
      pending: readingsStore.filter(r => r.status === 'pending').length,
      zoomScheduled: readingsStore.filter(r => r.status === 'zoom-scheduled').length,
      completed: readingsStore.filter(r => r.status === 'completed').length,
      approved: readingsStore.filter(r => r.status === 'approved').length
    };

    return NextResponse.json(
      { 
        readings: filteredReadings,
        stats 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fehler beim Abrufen der Coach-Readings:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

// POST /api/coach/readings - Neues Reading erstellen
export async function POST(request: NextRequest) {
  try {
    // Authentifizierung prüfen (später implementieren)
    const authHeader = request.headers.get('authorization');
    
    // TODO: Prüfe ob User Coach-Rechte hat
    // if (!isCoach(authHeader)) {
    //   return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 });
    // }

    const body = await request.json();
    const { reading_type, client_name, reading_data } = body;

    // Validierung
    if (!reading_type || !client_name || !reading_data) {
      return NextResponse.json(
        { error: 'Bitte fülle alle Pflichtfelder aus' },
        { status: 400 }
      );
    }

    // Erstelle neues Reading-Objekt
    const newReading = {
      id: `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reading_type,
      client_name,
      reading_data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Speichere im In-Memory Store (später durch Datenbank ersetzen)
    readingsStore.push(newReading);

    return NextResponse.json(
      { 
        success: true,
        reading: newReading,
        message: 'Reading erfolgreich erstellt'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Fehler beim Erstellen des Readings:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

