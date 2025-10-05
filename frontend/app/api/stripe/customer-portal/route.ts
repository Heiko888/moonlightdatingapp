import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Benutzer-ID ist erforderlich' },
        { status: 400 }
      );
    }

    // Mock Stripe Customer Portal für Demo-Zwecke
    // In der Produktion würde hier die echte Stripe-Integration stehen
    
    const mockPortalUrl = `https://billing.stripe.com/p/login/test_${userId}`;
    
    return NextResponse.json({
      success: true,
      url: mockPortalUrl,
      message: 'Stripe Customer Portal URL generiert'
    });

  } catch (error) {
    console.error('Stripe Customer Portal Error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
