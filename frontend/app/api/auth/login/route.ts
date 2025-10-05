import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email und Passwort sind erforderlich' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase Login Error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 401 }
      );
    }

    // Erstelle JWT Token für die Session
    const token = Buffer.from(JSON.stringify({
      userId: data.user.id,
      email: data.user.email,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 Stunden
    })).toString('base64');

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at
      },
      token
    });

  } catch (error) {
    console.error('API Login Error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
