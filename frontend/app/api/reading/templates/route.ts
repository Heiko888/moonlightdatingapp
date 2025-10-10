import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    logger.apiCall('/api/reading/templates', 'GET');

    // Mock-Reading-Templates
    const templates = [
      {
        id: 'template-1',
        name: 'Persönliche Analyse',
        description: 'Grundlegende Analyse Ihrer Human Design Konfiguration',
        sections: [
          { id: 'type', title: 'Typ', content: 'Ihr Human Design Typ und seine Bedeutung' },
          { id: 'strategy', title: 'Strategie', content: 'Ihre persönliche Strategie für Entscheidungen' },
          { id: 'authority', title: 'Autorität', content: 'Ihr innerer Kompass für wichtige Entscheidungen' },
          { id: 'profile', title: 'Profil', content: 'Ihre Lebensrolle und ihr Zweck' }
        ],
        category: 'personal',
        difficulty: 'beginner'
      },
      {
        id: 'template-2',
        name: 'Beziehungs-Analyse',
        description: 'Kompatibilitäts-Analyse zwischen zwei Personen',
        sections: [
          { id: 'compatibility', title: 'Kompatibilität', content: 'Wie gut passen Sie zusammen?' },
          { id: 'challenges', title: 'Herausforderungen', content: 'Potenzielle Konfliktbereiche' },
          { id: 'synergy', title: 'Synergie', content: 'Wo Sie sich gegenseitig unterstützen' }
        ],
        category: 'relationship',
        difficulty: 'intermediate'
      },
      {
        id: 'template-3',
        name: 'Karriere-Guidance',
        description: 'Berufliche Orientierung basierend auf Human Design',
        sections: [
          { id: 'career_type', title: 'Karriere-Typ', content: 'Welche Art von Arbeit passt zu Ihnen?' },
          { id: 'environment', title: 'Arbeitsumgebung', content: 'Ideal für Sie' },
          { id: 'leadership', title: 'Führung', content: 'Ihr natürlicher Führungsstil' }
        ],
        category: 'career',
        difficulty: 'advanced'
      }
    ];

    logger.info('Reading templates fetched successfully', { count: templates.length });

    return NextResponse.json({
      success: true,
      templates,
      total: templates.length
    });

  } catch (error) {
    logger.error('Failed to fetch reading templates', error);
    return NextResponse.json(
      { error: 'Failed to fetch reading templates' },
      { status: 500 }
    );
  }
}
