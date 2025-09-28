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
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const category = request.nextUrl.searchParams.get('category');

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

    // Community Posts abrufen
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        user:users(first_name, last_name, avatar_url),
        comments:community_comments(count),
        likes:community_likes(count)
      `)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: posts, error } = await query;

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Fehler beim Abrufen der Posts'
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        posts: posts || [],
        pagination: {
          page,
          limit,
          total: posts?.length || 0
        }
      }
    });

  } catch (error) {
    console.error('Community Posts API Error:', error);
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
    const { title, content, category, tags, image_url } = body;

    // Input-Validierung
    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_REQUIRED_FIELDS',
            message: 'Titel und Inhalt sind erforderlich'
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

    // Post erstellen
    const { data: post, error: insertError } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        title,
        content,
        category: category || 'general',
        tags: tags || [],
        image_url,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        user:users(first_name, last_name, avatar_url)
      `)
      .single();

    if (insertError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Fehler beim Erstellen des Posts'
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Community Post Creation Error:', error);
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
