import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Kein gültiger Token' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      // Dekodiere den JWT Token
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Prüfe Ablaufzeit
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return NextResponse.json(
          { error: 'Token abgelaufen' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        valid: true,
        user: {
          id: payload.userId,
          email: payload.email
        }
      });

    } catch (parseError) {
      console.error('Token Parse Error:', parseError);
      return NextResponse.json(
        { error: 'Ungültiger Token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Token Verification Error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
