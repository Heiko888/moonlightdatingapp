import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    logger.apiCall('/api/readings', 'GET');

    // Mock-Readings für User
    // TODO: Implementiere echte Supabase-Integration
    const mockReadings = [
      {
        id: 'reading-1',
        userId: userId,
        title: 'Persönliche Analyse',
        content: 'Eine tiefgreifende Analyse Ihrer Human Design Konfiguration...',
        type: 'personal',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 Tag alt
        updatedAt: new Date(Date.now() - 3600000).toISOString() // 1 Stunde alt
      },
      {
        id: 'reading-2',
        userId: userId,
        title: 'Beziehungs-Analyse',
        content: 'Analyse der Kompatibilität zwischen zwei Human Design Charts...',
        type: 'relationship',
        status: 'in_progress',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 Tage alt
        updatedAt: new Date(Date.now() - 7200000).toISOString() // 2 Stunden alt
      }
    ];

    logger.info('Readings fetched successfully', { userId, count: mockReadings.length });

    return NextResponse.json({
      success: true,
      readings: mockReadings,
      total: mockReadings.length
    });

  } catch (error) {
    logger.error('Failed to fetch readings', error);
    return NextResponse.json(
      { error: 'Failed to fetch readings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, content, type } = body;

    if (!userId || !title || !content) {
      return NextResponse.json(
        { error: 'User ID, title, and content are required' },
        { status: 400 }
      );
    }

    logger.apiCall('/api/readings', 'POST');

    // Mock-Reading erstellen
    const newReading = {
      id: `reading-${Date.now()}`,
      userId,
      title,
      content,
      type: type || 'personal',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    logger.info('Reading created successfully', { 
      userId, 
      readingId: newReading.id 
    });

    return NextResponse.json({
      success: true,
      reading: newReading,
      message: 'Reading created successfully'
    });

  } catch (error) {
    logger.error('Failed to create reading', error);
    return NextResponse.json(
      { error: 'Failed to create reading' },
      { status: 500 }
    );
  }
}
