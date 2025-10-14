import { NextRequest, NextResponse } from 'next/server';
import emailService from '@/lib/email/emailService';

// Temporärer In-Memory Store (später durch Datenbank ersetzen)
// In Produktion: MongoDB, PostgreSQL, oder Supabase
let readingsStore: any[] = [];

// GET /api/readings - Alle Readings eines Users abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId ist erforderlich' },
        { status: 400 }
      );
    }

    // Filtere Readings nach User
    const userReadings = readingsStore.filter(r => r.userId === userId);

    return NextResponse.json(userReadings, { status: 200 });
  } catch (error) {
    console.error('Fehler beim Abrufen der Readings:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

// POST /api/readings - Neues Reading erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validierung
    const requiredFields = ['title', 'question', 'birthdate', 'birthtime', 'birthplace', 'email', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Feld "${field}" ist erforderlich` },
          { status: 400 }
        );
      }
    }

    // Erstelle neues Reading
    const newReading = {
      id: `reading_${Date.now()}`,
      userId: body.userId || 'anonymous',
      title: body.title,
      question: body.question,
      category: body.category,
      datingType: body.datingType || '',
      birthdate: body.birthdate,
      birthtime: body.birthtime,
      birthplace: body.birthplace,
      email: body.email,
      phone: body.phone || '',
      status: 'pending', // pending, zoom-scheduled, completed, approved
      content: '', // Wird nach Zoom-Reading befüllt
      pdfUrl: null,
      zoomLink: null,
      zoomDate: null,
      coachNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Speichere Reading
    readingsStore.push(newReading);

    // Sende E-Mails
    try {
      await emailService.sendReadingConfirmation({
        email: newReading.email,
        title: newReading.title,
        status: newReading.status
      });

      await emailService.notifyCoachNewReading(newReading);
    } catch (emailError) {
      console.error('E-Mail-Fehler:', emailError);
      // Fahre trotzdem fort, auch wenn E-Mail fehlschlägt
    }

    return NextResponse.json(
      { 
        message: 'Reading erfolgreich erstellt',
        reading: newReading 
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
