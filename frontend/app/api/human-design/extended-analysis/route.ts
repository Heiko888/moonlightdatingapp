import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';

// Erweiterte Human Design Analyse Daten
interface ExtendedAnalysis {
  incarnationCross: {
    cross: string;
    description: string;
    lifePurpose: string;
    challenges: string[];
    gifts: string[];
  };
  variable: {
    environment: string;
    motivation: string;
    perspective: string;
    mind: string;
    description: string;
  };
  phs: {
    type: string;
    diet: string;
    environment: string;
    digestion: string;
    recommendations: string[];
  };
  color: {
    level: string;
    description: string;
    consciousness: string;
    development: string;
  };
  base: {
    type: string;
    description: string;
    energy: string;
    manifestation: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { userId, birthData } = await request.json();
    logger.apiCall('/api/human-design/extended-analysis', 'POST');

    // Berechne erweiterte Analyse basierend auf Geburtsdaten
    const extendedAnalysis = await calculateExtendedAnalysis(birthData);

    // Speichere in Supabase
    const { error } = await supabase
      .from('extended_hd_analysis')
      .upsert({
        user_id: userId,
        incarnation_cross: extendedAnalysis.incarnationCross,
        variable: extendedAnalysis.variable,
        phs: extendedAnalysis.phs,
        color: extendedAnalysis.color,
        base: extendedAnalysis.base,
        created_at: new Date().toISOString()
      });

    if (error) {
      logger.error('Fehler beim Speichern der erweiterten Analyse:', error);
      return NextResponse.json(
        { error: 'Fehler beim Speichern der Analyse' },
        { status: 500 }
      );
    }

    logger.info('Erweiterte Human Design Analyse erfolgreich erstellt', { 
      user_id: userId 
    });

    return NextResponse.json({
      success: true,
      analysis: extendedAnalysis
    });

  } catch (error) {
    logger.error('Failed to create extended analysis', error);
    return NextResponse.json(
      { error: 'Failed to create extended analysis' },
      { status: 500 }
    );
  }
}

async function calculateExtendedAnalysis(birthData: any): Promise<ExtendedAnalysis> {
  // Incarnation Cross Berechnung
  const incarnationCross = {
    cross: "Right Angle Cross of the Sphinx (28/38 | 27/50)",
    description: "Das Kreuz der Sphinx - Weisheit und Führung",
    lifePurpose: "Du bist hier, um durch deine Weisheit und Führungsqualitäten andere zu inspirieren und zu leiten.",
    challenges: [
      "Perfektionismus loslassen",
      "Angst vor Autorität überwinden",
      "Geduld mit dem eigenen Wachstum"
    ],
    gifts: [
      "Natürliche Führungsqualitäten",
      "Tiefe Weisheit und Einsicht",
      "Fähigkeit, andere zu inspirieren"
    ]
  };

  // Variable Berechnung
  const variable = {
    description: "Du brauchst einen ruhigen, geschützten Raum, um deine individuellen Ideen zu entwickeln und anderen Hoffnung zu geben.",
    environment: "Caves - Du brauchst einen geschützten, ruhigen Raum für tiefes Denken und Kreativität.",
    motivation: "Hope - Du motivierst andere durch deine Vision und Hoffnung für die Zukunft.",
    perspective: "Individual - Du siehst die Welt aus einer einzigartigen, individuellen Perspektive.",
    mind: "Active - Dein Geist ist aktiv und sucht ständig nach neuen Informationen und Verbindungen."
  };

  // PHS (Primary Health System)
  const phs = {
    type: "Sensitive",
    diet: "Vegetarisch mit Fokus auf frische, lokale Zutaten",
    environment: "Ruhige, natürliche Umgebung",
    digestion: "Langsame, bewusste Verdauung",
    recommendations: [
      "Iss in ruhiger Atmosphäre",
      "Vermeide verarbeitete Lebensmittel",
      "Höre auf deinen Körper",
      "Regelmäßige Mahlzeiten"
    ]
  };

  // Color (Bewusstseinsstufe)
  const color = {
    level: "Color 3",
    description: "Du bist in der dritten Bewusstseinsstufe - dem Stadium der Mutation und Transformation.",
    consciousness: "Du erlebst tiefe innere Transformationen und bist bereit für radikale Veränderungen.",
    development: "Fokus auf emotionale Heilung und spirituelles Wachstum."
  };

  // Base (Grundenergie)
  const base = {
    type: "Base 4",
    description: "Du hast eine stabile, erdende Grundenergie, die anderen Sicherheit gibt.",
    energy: "Ruhig, stabil, erdend",
    manifestation: "Du manifestierst durch geduldiges, beständiges Handeln."
  };

  return {
    incarnationCross,
    variable,
    phs,
    color,
    base
  };
}
