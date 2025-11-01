import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const supabase = await createClient();

    // Prüfen ob Benutzer authentifiziert ist
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Für Connection Key Readings: anonyme Nutzer erlauben (optional)
    const isConnectionKey = body.type === 'connectionKey' || body.category === 'connection-key';
    
    if (!isConnectionKey && (authError || !user)) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Unterschiedliche Formate unterstützen
    let readingData: any;
    let readingType: string;
    let clientName: string;

    if (body.type === 'connectionKey' || body.category === 'connection-key') {
      // Connection Key Reading Format
      readingType = 'connectionKey';
      clientName = body.title || `Connection Key: ${body.name1 || 'Person 1'} & ${body.person2?.name || 'Person 2'}`;
      
      readingData = {
        userId: body.userId || user?.id || 'anonymous',
        type: 'connectionKey',
        title: body.title || clientName,
        question: body.question || 'Wie ist unsere Resonanz?',
        category: 'connection-key',
        person1: {
          name: body.name1 || body.name,
          birthdate: body.birthdate || body.birthDate1,
          birthtime: body.birthtime || body.birthTime1,
          birthplace: body.birthplace || body.birthplace1,
          email: body.email || body.email1,
          phone: body.phone || body.phone1,
        },
        person2: body.person2 || {
          name: body.name2,
          birthdate: body.birthDate2,
          birthtime: body.birthTime2,
          birthplace: body.birthplace2,
          email: body.email2,
        },
        notes: body.notes || '',
      };
    } else if (body.type && body.data) {
      // Altes Format (type + data)
      readingType = body.type;
      clientName = body.data.name || body.client_name || '';
      readingData = body.data;
    } else {
      // Neues Format (direkte Felder)
      readingType = body.type || 'human-design';
      clientName = body.title || body.client_name || body.name || '';
      readingData = {
        userId: body.userId || user?.id,
        title: body.title,
        question: body.question,
        category: body.category,
        datingType: body.datingType,
        birthdate: body.birthdate,
        birthtime: body.birthtime,
        birthplace: body.birthplace,
        email: body.email,
        phone: body.phone,
      };
    }

    // Reading in Datenbank speichern
    const { data: reading, error } = await supabase
      .from('readings')
      .insert({
        user_id: user?.id || readingData.userId || 'anonymous',
        reading_type: readingType,
        reading_data: readingData,
        client_name: clientName,
        created_at: body.createdAt || new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Fehler beim Speichern des Readings:', error);
      return NextResponse.json(
        { error: 'Fehler beim Speichern: ' + error.message },
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
