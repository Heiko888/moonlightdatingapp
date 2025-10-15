import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';
import { calculateHumanDesignChart, type ChartCalculationInput } from '@/lib/astro/chartCalculation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, birthPlace } = body;

    if (!birthDate || !birthTime) {
      return NextResponse.json(
        { error: 'Birth date and time are required' },
        { status: 400 }
      );
    }

    logger.apiCall('/api/charts/calculate', 'POST');

    // Bereite Input für Chart-Berechnung vor
    const chartInput: ChartCalculationInput = {
      birthDate, // Format: YYYY-MM-DD
      birthTime, // Format: HH:MM
      birthPlace: {
        latitude: birthPlace?.latitude || 52.52, // Berlin als Fallback
        longitude: birthPlace?.longitude || 13.405,
        timezone: birthPlace?.timezone || 'Europe/Berlin'
      }
    };

    // Berechne echtes Human Design Chart mit astronomy-engine
    const chart = await calculateHumanDesignChart(chartInput);

    logger.info('Chart calculation completed', { 
      type: chart.type, 
      profile: chart.profile,
      authority: chart.authority
    });

    // Response mit echten Daten
    return NextResponse.json({
      success: true,
      chart: {
        id: `chart-${Date.now()}`,
        ...chart,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      message: 'Chart mit echten astronomischen Daten berechnet',
      source: 'astronomy-engine' // Kennzeichnung dass echte Berechnungen verwendet wurden
    });

  } catch (error) {
    logger.error('Chart calculation failed', error);
    return NextResponse.json(
      { error: 'Chart calculation failed' },
      { status: 500 }
    );
  }
}
