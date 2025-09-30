import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
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
      email, 
      password, 
      firstName, 
      lastName, 
      birthDate, 
      birthTime, 
      birthPlace, 
      subscription = 'free' 
    } = body;

    // Input-Validierung
    if (!email || !password || !firstName || !lastName || !birthDate) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_REQUIRED_FIELDS',
            message: 'Alle Pflichtfelder müssen ausgefüllt werden'
          }
        },
        { status: 400 }
      );
    }

    // E-Mail-Format validieren
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Ungültige E-Mail-Adresse'
          }
        },
        { status: 400 }
      );
    }

    // Passwort-Stärke validieren
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'Passwort muss mindestens 8 Zeichen lang sein'
          }
        },
        { status: 400 }
      );
    }

    // Passwort-Komplexität prüfen (lockerer)
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasLowerCase || !hasNumbers) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'Passwort muss Kleinbuchstaben und Zahlen enthalten'
          }
        },
        { status: 400 }
      );
    }

    // Geburtsdatum validieren
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    if (birthDateObj >= today) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_BIRTH_DATE',
            message: 'Geburtsdatum muss in der Vergangenheit liegen'
          }
        },
        { status: 400 }
      );
    }

    // Supabase Registrierung
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
          subscription: subscription
        }
      }
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'REGISTRATION_FAILED',
            message: error.message
          }
        },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'REGISTRATION_FAILED',
            message: 'Registrierung fehlgeschlagen'
          }
        },
        { status: 400 }
      );
    }

    // Erfolgreiche Registrierung
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: firstName,
          lastName: lastName,
          subscription: subscription
        },
        message: 'Registrierung erfolgreich. Bitte überprüfen Sie Ihre E-Mails für die Bestätigung.'
      }
    });

  } catch (error) {
    console.error('Registration API Error:', error);
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
