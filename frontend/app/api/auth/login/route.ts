import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt:', { email, password: '***' });

    // Simulate successful login for testing purposes
    const mockUserId = `user-${Date.now()}`;
    const mockAccessToken = `token-${Date.now()}`;
    const mockRefreshToken = `refresh-${Date.now()}`;

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: mockUserId,
          email: email,
          name: 'Test User',
          hdType: 'Generator',
          profile: '1/3'
        },
        session: {
          access_token: mockAccessToken,
          refresh_token: mockRefreshToken,
          expires_at: new Date(Date.now() + 3600000).toISOString()
        }
      }
    });

    console.log('Login successful, returning session data');
    return response;

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({
      success: false,
      error: {
        message: 'Server-Fehler',
        code: 'SERVER_ERROR'
      }
    }, { status: 500 });
  }
}
