import { NextRequest, NextResponse } from 'next/server';
import emailService from '@/lib/email/emailService';
import pdfGenerator from '@/lib/pdf/pdfGenerator';

// Temporärer In-Memory Store (später durch Datenbank ersetzen)
let readingsStore: any[] = [];

// GET /api/readings/[id] - Einzelnes Reading abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reading = readingsStore.find(r => r.id === params.id);

    if (!reading) {
      return NextResponse.json(
        { error: 'Reading nicht gefunden' },
        { status: 404 }
      );
    }

    return NextResponse.json(reading, { status: 200 });
  } catch (error) {
    console.error('Fehler beim Abrufen des Readings:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

// PATCH /api/readings/[id] - Reading Status/Daten aktualisieren
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const readingIndex = readingsStore.findIndex(r => r.id === params.id);

    if (readingIndex === -1) {
      return NextResponse.json(
        { error: 'Reading nicht gefunden' },
        { status: 404 }
      );
    }

    // Aktualisiere Reading
    const updatedReading = {
      ...readingsStore[readingIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    const oldStatus = readingsStore[readingIndex].status;
    readingsStore[readingIndex] = updatedReading;

    // Bei Status-Änderung E-Mail senden und ggf. PDF generieren
    if (body.status && body.status !== oldStatus) {
      try {
        if (body.status === 'zoom-scheduled') {
          await emailService.sendZoomScheduled({
            email: updatedReading.email,
            title: updatedReading.title,
            status: updatedReading.status,
            zoomLink: updatedReading.zoomLink,
            zoomDate: updatedReading.zoomDate
          });
        } else if (body.status === 'approved') {
          // Generiere PDF bei Freigabe
          const pdfUrl = await pdfGenerator.generateReadingPDF({
            id: updatedReading.id,
            title: updatedReading.title,
            userName: updatedReading.email,
            birthdate: updatedReading.birthdate,
            birthtime: updatedReading.birthtime,
            birthplace: updatedReading.birthplace,
            category: updatedReading.category,
            question: updatedReading.question,
            content: updatedReading.content || 'Reading-Inhalt wird noch erstellt',
            coachNotes: updatedReading.coachNotes,
            createdAt: updatedReading.createdAt
          });

          // Speichere PDF-URL
          updatedReading.pdfUrl = pdfUrl;
          readingsStore[readingIndex] = updatedReading;

          await emailService.sendReadingApproved({
            email: updatedReading.email,
            title: updatedReading.title,
            status: updatedReading.status,
            pdfUrl: pdfUrl
          });
        }
      } catch (error) {
        console.error('Fehler bei Status-Update-Aktionen:', error);
        // Fahre trotzdem fort
      }
    }

    return NextResponse.json(
      { 
        message: 'Reading erfolgreich aktualisiert',
        reading: updatedReading 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Readings:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

// DELETE /api/readings/[id] - Reading löschen (nur für Admin/Coach)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const readingIndex = readingsStore.findIndex(r => r.id === params.id);

    if (readingIndex === -1) {
      return NextResponse.json(
        { error: 'Reading nicht gefunden' },
        { status: 404 }
      );
    }

    // Entferne Reading
    readingsStore.splice(readingIndex, 1);

    return NextResponse.json(
      { message: 'Reading erfolgreich gelöscht' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fehler beim Löschen des Readings:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

