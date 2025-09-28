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

    // Matches abrufen
    const { data: matches, error } = await supabase
      .from('matches')
      .select(`
        *,
        matched_user:users!matches_matched_user_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url,
          birth_date,
          birth_time,
          birth_place
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Fehler beim Abrufen der Matches'
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: matches || []
    });

  } catch (error) {
    console.error('Dating Matches API Error:', error);
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
    const { matched_user_id, compatibility_score, compatibility_details } = body;

    // Input-Validierung
    if (!matched_user_id || !compatibility_score) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_REQUIRED_FIELDS',
            message: 'Matched User ID und Compatibility Score sind erforderlich'
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

    // Match erstellen
    const { data: match, error: insertError } = await supabase
      .from('matches')
      .insert({
        user_id: user.id,
        matched_user_id,
        compatibility_score,
        compatibility_details: compatibility_details || {},
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        matched_user:users!matches_matched_user_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url,
          birth_date,
          birth_time,
          birth_place
        )
      `)
      .single();

    if (insertError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Fehler beim Erstellen des Matches'
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: match
    });

  } catch (error) {
    console.error('Dating Match Creation Error:', error);
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
