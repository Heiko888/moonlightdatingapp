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
    
    // Supabase Query für Planet Gates
    const { data: planetGates, error } = await supabase
      .from('planet_gates')
      .select('*')
      .eq('planet', planetName.toLowerCase());
    
    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json(
        { error: `Fehler beim Laden der Gates für ${planetName}` },
        { status: 500 }
      );
    }

    if (!planetGates || planetGates.length === 0) {
      return NextResponse.json(
        { error: `Keine Gates für Planet ${planetName} gefunden` },
        { status: 404 }
      );
    }

    return NextResponse.json(planetGates);
  } catch (error) {
    console.error('Fehler beim Laden der Planet-Gates:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
