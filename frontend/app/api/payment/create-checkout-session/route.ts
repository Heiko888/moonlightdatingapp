import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe Client - nur wenn Environment Variables gesetzt sind
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null;

export async function POST(request: NextRequest) {
  try {
    // Prüfe ob Stripe konfiguriert ist
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: { code: 'STRIPE_NOT_CONFIGURED', message: 'Stripe ist nicht konfiguriert' } },
        { status: 500 }
      );
    }

    const { packageId, priceId } = await request.json();

    // User ID aus Authorization Header extrahieren
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_TOKEN', message: 'Kein gültiger Token' } },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Temporär: User ID aus Token extrahieren (vereinfacht)
    const userId = 'temp-user-id'; // TODO: Echte User-Verifizierung implementieren

    // Stripe Price ID validieren
    const validPriceIds = {
      basic: process.env.STRIPE_BASIC_PRICE_ID,
      premium: process.env.STRIPE_PREMIUM_PRICE_ID,
      vip: process.env.STRIPE_VIP_PRICE_ID
    };

    const stripePriceId = validPriceIds[packageId as keyof typeof validPriceIds];
    if (!stripePriceId) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_PACKAGE', message: 'Ungültiges Paket' } },
        { status: 400 }
      );
    }

    // Stripe Checkout Session erstellen
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      customer_email: 'user@example.com', // TODO: Echte User-Email
      metadata: {
        userId: userId,
        packageId: packageId,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });

  } catch (error) {
    console.error('Stripe Checkout Session Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'STRIPE_ERROR', 
          message: 'Fehler beim Erstellen der Checkout-Session' 
        } 
      },
      { status: 500 }
    );
  }
}
