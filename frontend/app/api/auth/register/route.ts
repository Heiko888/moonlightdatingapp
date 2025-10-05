import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      birthDate, 
      birthTime, 
      birthPlace, 
      subscription 
    } = await request.json();

    if (!email || !password || !firstName || !lastName || !birthDate) {
      return NextResponse.json(
        { error: 'Alle Pflichtfelder sind erforderlich' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Benutzer registrieren
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          birth_date: birthDate,
          birth_time: birthTime || null,
          birth_place: birthPlace || null,
          subscription: subscription || 'free'
        }
      }
    });

    if (error) {
      console.error('Supabase Registration Error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Benutzer konnte nicht erstellt werden' },
        { status: 400 }
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
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        birth_time: birthTime,
        birth_place: birthPlace,
        subscription: subscription
      },
      token
    });

  } catch (error) {
    console.error('API Registration Error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
