import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = await createClient();

    // Prüfen ob Benutzer authentifiziert ist
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Reading löschen (nur wenn es dem Benutzer gehört)
    const { error } = await supabase
      .from('readings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Fehler beim Löschen des Readings:', error);
      return NextResponse.json(
        { error: 'Fehler beim Löschen' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server-Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = await createClient();

    // Prüfen ob Benutzer authentifiziert ist
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Reading abrufen (nur wenn es dem Benutzer gehört)
    const { data: reading, error } = await supabase
      .from('readings')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Fehler beim Abrufen des Readings:', error);
      return NextResponse.json(
        { error: 'Reading nicht gefunden' },
        { status: 404 }
      );
    }

    return NextResponse.json({ reading });
  } catch (error) {
    console.error('Server-Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}
