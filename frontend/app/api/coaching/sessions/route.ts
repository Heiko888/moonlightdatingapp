import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    // Authorization Header auslesen
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_TOKEN',
            message: 'Authorization Token fehlt'
          }
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const userId = request.nextUrl.searchParams.get('userId');
    const status = request.nextUrl.searchParams.get('status');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_USER_ID',
            message: 'User ID fehlt'
          }
        },
        { status: 400 }
      );
    }

    // Token validieren
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
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

    // Coaching Sessions abrufen
    let query = supabase
      .from('coaching_sessions')
      .select(`
        *,
        coach:users!coaching_sessions_coach_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url,
          bio,
          specialties
        ),
        client:users!coaching_sessions_client_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .or(`client_id.eq.${userId},coach_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: sessions, error } = await query;

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Fehler beim Abrufen der Coaching-Sessions'
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sessions || []
    });

  } catch (error) {
    console.error('Coaching Sessions API Error:', error);
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

export async function POST(request: NextRequest) {
  try {
    // Authorization Header auslesen
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_TOKEN',
            message: 'Authorization Token fehlt'
          }
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const body = await request.json();
    const { 
      coach_id, 
      session_type, 
      scheduled_date, 
      duration_minutes, 
      notes, 
      goals 
    } = body;

    // Input-Validierung
    if (!coach_id || !session_type || !scheduled_date) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_REQUIRED_FIELDS',
            message: 'Coach ID, Session-Typ und geplantes Datum sind erforderlich'
          }
        },
        { status: 400 }
      );
    }

    // Token validieren
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
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

    // Coaching Session erstellen
    const { data: session, error: insertError } = await supabase
      .from('coaching_sessions')
      .insert({
        client_id: user.id,
        coach_id,
        session_type,
        scheduled_date,
        duration_minutes: duration_minutes || 60,
        notes: notes || '',
        goals: goals || [],
        status: 'scheduled',
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        coach:users!coaching_sessions_coach_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url,
          bio,
          specialties
        )
      `)
      .single();

    if (insertError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Fehler beim Erstellen der Coaching-Session'
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session
    });

  } catch (error) {
    console.error('Coaching Session Creation Error:', error);
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
