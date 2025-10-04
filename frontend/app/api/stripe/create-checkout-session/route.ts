import { NextRequest, NextResponse } from 'next/server';
import { stripe, SUBSCRIPTION_PACKAGES } from '../../../../lib/stripe';

// Prüfe ob Stripe konfiguriert ist
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY nicht gesetzt - Stripe-Funktionen deaktiviert');
}

export async function POST(request: NextRequest) {
  try {
    // Prüfe Stripe-Konfiguration
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe nicht konfiguriert' },
        { status: 503 }
      );
    }

    const { packageId, userId, userEmail } = await request.json();

    if (!packageId || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const packageInfo = SUBSCRIPTION_PACKAGES[packageId as keyof typeof SUBSCRIPTION_PACKAGES];
    
    if (!packageInfo) {
      return NextResponse.json(
        { error: 'Invalid package ID' },
        { status: 400 }
      );
    }

    // Stripe Checkout Session erstellen
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: packageInfo.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        packageId: packageId,
      },
      subscription_data: {
        metadata: {
          userId: userId,
          packageId: packageId,
        },
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe Checkout Session Error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
