import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';

interface CareerGuidance {
  idealRoles: string[];
  workStyle: string;
  environment: string;
  challenges: string[];
  opportunities: string[];
  salaryRange: string;
  growthPath: string[];
}

interface TeamDynamics {
  role: string;
  strengths: string[];
  contributions: string[];
  communicationStyle: string;
  conflictResolution: string;
  leadershipStyle: string;
}

interface LeadershipStyle {
  type: string;
  description: string;
  strengths: string[];
  challenges: string[];
  development: string[];
  examples: string[];
}

interface Entrepreneurship {
  potential: number;
  strengths: string[];
  challenges: string[];
  businessTypes: string[];
  timing: string;
  advice: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'career';
    
    logger.apiCall('/api/human-design/business', 'GET');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'career':
        result = await getCareerGuidance(userId);
        break;
      case 'team':
        result = await getTeamDynamics(userId);
        break;
      case 'leadership':
        result = await getLeadershipStyle(userId);
        break;
      case 'entrepreneurship':
        result = await getEntrepreneurshipAnalysis(userId);
        break;
      default:
        result = await getCareerGuidance(userId);
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    logger.error('Failed to get business analysis', error);
    return NextResponse.json(
      { error: 'Failed to get business analysis' },
      { status: 500 }
    );
  }
}

async function getCareerGuidance(userId: string): Promise<CareerGuidance> {
  return {
    idealRoles: [
      'Projektmanager',
      'Berater',
      'Coach',
      'Unternehmer',
      'Führungskraft'
    ],
    workStyle: 'Strategisch und visionär - Du arbeitest am besten in einer Umgebung, die dir Autonomie und kreative Freiheit gibt.',
    environment: 'Flexible Arbeitszeiten, kreative Freiheit, direkter Einfluss auf Entscheidungen',
    challenges: [
      'Geduld mit langsameren Prozessen',
      'Kompromisse eingehen',
      'Detailarbeit delegieren'
    ],
    opportunities: [
      'Führungspositionen',
      'Eigene Projekte starten',
      'Mentoring und Coaching',
      'Strategische Beratung'
    ],
    salaryRange: '€60.000 - €120.000+',
    growthPath: [
      'Junior Position → Senior Position',
      'Team Lead → Abteilungsleiter',
      'Unternehmer → CEO',
      'Berater → Partner'
    ]
  };
}

async function getTeamDynamics(userId: string): Promise<TeamDynamics> {
  return {
    role: 'Visionärer Leader',
    strengths: [
      'Strategisches Denken',
      'Menschen motivieren',
      'Große Visionen entwickeln',
      'Innovation vorantreiben'
    ],
    contributions: [
      'Langfristige Strategien entwickeln',
      'Team motivieren und inspirieren',
      'Neue Ideen und Konzepte einbringen',
      'Externe Beziehungen aufbauen'
    ],
    communicationStyle: 'Direkt und inspirierend - Du kommunizierst am besten durch Visionen und große Ideen.',
    conflictResolution: 'Proaktiv und lösungsorientiert - Du gehst Konflikte direkt an und suchst nach konstruktiven Lösungen.',
    leadershipStyle: 'Transformational - Du führst durch Inspiration und Vision, nicht durch Kontrolle.'
  };
}

async function getLeadershipStyle(userId: string): Promise<LeadershipStyle> {
  return {
    type: 'Transformational Leader',
    description: 'Du führst durch Inspiration, Vision und persönliche Transformation. Du motivierst andere, über sich hinauszuwachsen.',
    strengths: [
      'Visionäre Führung',
      'Menschen entwickeln',
      'Innovation fördern',
      'Kulturen transformieren'
    ],
    challenges: [
      'Operative Details',
      'Mikromanagement',
      'Geduld mit langsamen Prozessen',
      'Kompromisse eingehen'
    ],
    development: [
      'Delegationsfähigkeiten verbessern',
      'Operative Prozesse verstehen',
      'Geduld kultivieren',
      'Kommunikationsfähigkeiten verfeinern'
    ],
    examples: [
      'Steve Jobs - Apple',
      'Elon Musk - Tesla/SpaceX',
      'Oprah Winfrey - Media Empire',
      'Richard Branson - Virgin Group'
    ]
  };
}

async function getEntrepreneurshipAnalysis(userId: string): Promise<Entrepreneurship> {
  return {
    potential: 85,
    strengths: [
      'Visionäre Führung',
      'Risikobereitschaft',
      'Innovation',
      'Netzwerkaufbau',
      'Strategisches Denken'
    ],
    challenges: [
      'Operative Details',
      'Finanzmanagement',
      'Geduld mit langsamen Wachstum',
      'Mikromanagement vermeiden'
    ],
    businessTypes: [
      'Beratungsunternehmen',
      'Tech-Startups',
      'Coaching/Personal Development',
      'Innovative Produkte',
      'Service-orientierte Unternehmen'
    ],
    timing: 'Jetzt ist ein guter Zeitpunkt, um neue Projekte zu starten. Die kosmischen Transite unterstützen Innovation und Wachstum.',
    advice: [
      'Beginne mit einem MVP (Minimum Viable Product)',
      'Baue ein starkes Team auf',
      'Fokussiere dich auf deine Stärken',
      'Delegiere operative Aufgaben',
      'Investiere in deine persönliche Entwicklung'
    ]
  };
}
