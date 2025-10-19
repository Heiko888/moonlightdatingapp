import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, createdAt } = body;

    const supabase = await createClient();

    // Prüfen ob Benutzer authentifiziert ist
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Reading in Datenbank speichern
    const { data: reading, error } = await supabase
      .from('readings')
      .insert({
        user_id: user.id,
        reading_type: type,
        reading_data: data,
        client_name: data.name,
        created_at: createdAt || new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Fehler beim Speichern des Readings:', error);
      return NextResponse.json(
        { error: 'Fehler beim Speichern' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, reading });
  } catch (error) {
    console.error('Server-Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Prüfen ob Benutzer authentifiziert ist
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Alle Readings des Benutzers abrufen
    const { data: readings, error } = await supabase
      .from('readings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fehler beim Abrufen der Readings:', error);
      return NextResponse.json(
        { error: 'Fehler beim Abrufen' },
        { status: 500 }
      );
    }

    return NextResponse.json({ readings });
  } catch (error) {
    console.error('Server-Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}
