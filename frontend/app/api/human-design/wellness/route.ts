import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';

interface PHSDiet {
  type: string;
  foods: string[];
  avoid: string[];
  timing: string;
  environment: string;
  benefits: string[];
  recipes: string[];
}

interface WellnessTracking {
  energy: number;
  mood: number;
  stress: number;
  sleep: number;
  exercise: number;
  nutrition: number;
  date: string;
  notes: string;
}

interface MeditationGuide {
  type: string;
  duration: string;
  technique: string;
  benefits: string[];
  instructions: string[];
  timing: string;
}

interface StressManagement {
  triggers: string[];
  techniques: string[];
  prevention: string[];
  recovery: string[];
  tools: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'phs';
    
    logger.apiCall('/api/human-design/wellness', 'GET');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'phs':
        result = await getPHSDiet(userId);
        break;
      case 'tracking':
        result = await getWellnessTracking(userId);
        break;
      case 'meditation':
        result = await getMeditationGuides(userId);
        break;
      case 'stress':
        result = await getStressManagement(userId);
        break;
      default:
        result = await getPHSDiet(userId);
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    logger.error('Failed to get wellness data', error);
    return NextResponse.json(
      { error: 'Failed to get wellness data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, data } = await request.json();
    logger.apiCall('/api/human-design/wellness', 'POST');

    let result;

    switch (type) {
      case 'tracking':
        result = await saveWellnessTracking(userId, data);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    logger.error('Failed to save wellness data', error);
    return NextResponse.json(
      { error: 'Failed to save wellness data' },
      { status: 500 }
    );
  }
}

async function getPHSDiet(userId: string): Promise<PHSDiet> {
  return {
    type: 'Sensitive',
    foods: [
      'Frische, lokale Zutaten',
      'Bio-Gemüse und Obst',
      'Nüsse und Samen',
      'Vollkornprodukte',
      'Pflanzliche Proteine'
    ],
    avoid: [
      'Verarbeitete Lebensmittel',
      'Künstliche Zusatzstoffe',
      'Fast Food',
      'Zuckerhaltige Getränke',
      'Alkohol'
    ],
    timing: 'Regelmäßige Mahlzeiten in ruhiger Atmosphäre',
    environment: 'Ruhige, natürliche Umgebung ohne Ablenkungen',
    benefits: [
      'Verbesserte Verdauung',
      'Höhere Energie',
      'Besseres Wohlbefinden',
      'Stärkere Intuition'
    ],
    recipes: [
      'Quinoa-Bowl mit Gemüse',
      'Grüner Smoothie',
      'Mediterrane Salate',
      'Gedämpftes Gemüse'
    ]
  };
}

async function getWellnessTracking(userId: string): Promise<WellnessTracking[]> {
  // Mock-Daten für die letzten 7 Tage
  const tracking: WellnessTracking[] = [
    {
      energy: 8,
      mood: 7,
      stress: 3,
      sleep: 8,
      exercise: 6,
      nutrition: 9,
      date: '2024-03-20',
      notes: 'Guter Tag, viel Energie'
    },
    {
      energy: 6,
      mood: 5,
      stress: 6,
      sleep: 6,
      exercise: 4,
      nutrition: 7,
      date: '2024-03-19',
      notes: 'Etwas müde, stressiger Tag'
    },
    {
      energy: 9,
      mood: 8,
      stress: 2,
      sleep: 9,
      exercise: 8,
      nutrition: 8,
      date: '2024-03-18',
      notes: 'Ausgezeichneter Tag!'
    }
  ];

  return tracking;
}

async function getMeditationGuides(userId: string): Promise<MeditationGuide[]> {
  return [
    {
      type: 'Sakral-Meditation',
      duration: '15-20 Minuten',
      technique: 'Fokus auf das Sakralzentrum',
      benefits: [
        'Energie aufladen',
        'Kreativität steigern',
        'Lebenskraft stärken'
      ],
      instructions: [
        'Setze dich bequem hin',
        'Fokussiere dich auf dein Sakralzentrum',
        'Atme tief in den Bauch',
        'Spüre die Energie fließen'
      ],
      timing: 'Morgens oder abends'
    },
    {
      type: 'G-Zentrum Meditation',
      duration: '10-15 Minuten',
      technique: 'Herzöffnung und Selbstliebe',
      benefits: [
        'Selbstliebe stärken',
        'Richtung finden',
        'Herz öffnen'
      ],
      instructions: [
        'Platziere deine Hand auf dein Herz',
        'Atme in dein Herz hinein',
        'Spüre Liebe und Akzeptanz',
        'Visualisiere deine Richtung'
      ],
      timing: 'Jederzeit'
    }
  ];
}

async function getStressManagement(userId: string): Promise<StressManagement> {
  return {
    triggers: [
      'Unvorhergesehene Veränderungen',
      'Mikromanagement',
      'Lärm und Chaos',
      'Unterbrechungen'
    ],
    techniques: [
      'Tiefes Atmen',
      'Meditation',
      'Spaziergänge in der Natur',
      'Journaling',
      'Yoga'
    ],
    prevention: [
      'Regelmäßige Pausen',
      'Grenzen setzen',
      'Nein sagen lernen',
      'Prioritäten setzen'
    ],
    recovery: [
      'Alleinzeit',
      'Natur',
      'Kreative Aktivitäten',
      'Entspannungstechniken'
    ],
    tools: [
      'Meditations-App',
      'Journal',
      'Aromatherapie',
      'Entspannungsmusik'
    ]
  };
}

async function saveWellnessTracking(userId: string, data: WellnessTracking): Promise<WellnessTracking> {
  // Speichere in Supabase
  const { error } = await supabase
    .from('wellness_tracking')
    .upsert({
      user_id: userId,
      energy: data.energy,
      mood: data.mood,
      stress: data.stress,
      sleep: data.sleep,
      exercise: data.exercise,
      nutrition: data.nutrition,
      date: data.date,
      notes: data.notes,
      created_at: new Date().toISOString()
    });

  if (error) {
    logger.error('Fehler beim Speichern des Wellness-Trackings:', error);
    throw error;
  }

  return data;
}
