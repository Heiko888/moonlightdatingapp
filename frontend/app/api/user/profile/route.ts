import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function PUT(request: NextRequest) {
  try {
    // JSON-Parsing mit Fehlerbehandlung
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'Ungültiges JSON-Format'
          }
        },
        { status: 400 }
      );
    }

    const {
      name,
      birthDate,
      birthTime,
      birthPlace,
      bio,
      interests,
      relationshipGoal,
      photos
    } = body;

    // Authorization Header prüfen
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Autorisierung erforderlich'
          }
        },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Benutzer aus Token abrufen
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Ungültiger oder abgelaufener Token'
          }
        },
        { status: 401 }
      );
    }

    // Profildaten in Supabase speichern
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        name,
        birth_date: birthDate,
        birth_time: birthTime,
        birth_place: birthPlace,
        bio,
        interests: interests || [],
        relationship_goal: relationshipGoal,
        photos: photos || [],
        profile_setup_completed: true,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Fehler beim Speichern der Profildaten'
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: data[0],
        message: 'Profil erfolgreich aktualisiert'
      }
    });

  } catch (error) {
    console.error('Profile API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Interner Serverfehler'
        }
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authorization Header prüfen
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Autorisierung erforderlich'
          }
        },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Benutzer aus Token abrufen
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Ungültiger oder abgelaufener Token'
          }
        },
        { status: 401 }
      );
    }

    // Profildaten aus Supabase abrufen
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'Profil nicht gefunden'
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: data
      }
    });

  } catch (error) {
    console.error('Profile API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Interner Serverfehler'
        }
      },
      { status: 500 }
    );
  }
}
