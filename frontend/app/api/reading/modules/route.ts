import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    logger.apiCall('/api/reading/modules', 'GET');

    // Mock-Reading-Modules
    const modules = [
      {
        id: 'module-1',
        name: 'Grundlagen',
        description: 'Basiswissen über Human Design',
        topics: [
          'Die 9 Zentren',
          'Die 4 Typen',
          'Strategien und Autoritäten',
          'Profile und Linien'
        ],
        duration: '30 Minuten',
        level: 'beginner'
      },
      {
        id: 'module-2',
        name: 'Zentren',
        description: 'Tiefes Verständnis der 9 Zentren',
        topics: [
          'Definierte vs. undefinierte Zentren',
          'Offene Zentren und Konditionierung',
          'Zentren in Beziehungen',
          'Heilung offener Zentren'
        ],
        duration: '45 Minuten',
        level: 'intermediate'
      },
      {
        id: 'module-3',
        name: 'Kanäle und Tore',
        description: 'Die energetischen Verbindungen',
        topics: [
          'Die 36 Kanäle',
          'Die 64 Tore',
          'Hexagramme und Linien',
          'Planeten und Tore'
        ],
        duration: '60 Minuten',
        level: 'advanced'
      },
      {
        id: 'module-4',
        name: 'Beziehungen',
        description: 'Human Design in Beziehungen',
        topics: [
          'Kompatibilität',
          'Konditionierung in Beziehungen',
          'Kompromisse und Synergie',
          'Langlebige Partnerschaften'
        ],
        duration: '50 Minuten',
        level: 'intermediate'
      }
    ];

    logger.info('Reading modules fetched successfully', { count: modules.length });

    return NextResponse.json({
      success: true,
      modules,
      total: modules.length
    });

  } catch (error) {
    logger.error('Failed to fetch reading modules', error);
    return NextResponse.json(
      { error: 'Failed to fetch reading modules' },
      { status: 500 }
    );
  }
}
