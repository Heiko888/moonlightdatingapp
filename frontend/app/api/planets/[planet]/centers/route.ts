import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planet: string }> }
) {
  try {
    const resolvedParams = await params;
    const planetName = resolvedParams.planet.charAt(0).toUpperCase() + resolvedParams.planet.slice(1);
    
    // Supabase Query für Planet Centers
    const { data: planetCenters, error } = await supabase
      .from('planet_centers')
      .select('*')
      .eq('planet', planetName.toLowerCase());
    
    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json(
        { error: `Fehler beim Laden der Centers für ${planetName}` },
        { status: 500 }
      );
    }

    if (!planetCenters || planetCenters.length === 0) {
      return NextResponse.json(
        { error: `Keine Centers für Planet ${planetName} gefunden` },
        { status: 404 }
      );
    }

    return NextResponse.json(planetCenters);
  } catch (error) {
    console.error('Fehler beim Laden der Planet-Centers:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
