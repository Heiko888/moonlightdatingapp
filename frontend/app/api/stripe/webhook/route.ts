import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe Client - nur wenn Environment Variables gesetzt sind
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    // Prüfe ob Stripe konfiguriert ist
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Event-Handler
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Checkout Session abgeschlossen
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const packageId = session.metadata?.packageId;

  if (!userId || !packageId) {
    console.error('Missing metadata in checkout session:', session.id);
    return;
  }

  try {
    // TODO: Supabase Integration implementieren
    console.log(`Subscription created for user ${userId}: ${packageId}`);
    console.log('TODO: Implement Supabase subscription update');
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

// Subscription erstellt
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    // TODO: Supabase Integration implementieren
    console.log(`Subscription created: ${subscription.id}`);
    console.log('TODO: Implement Supabase subscription update');
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

// Subscription aktualisiert
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // TODO: Supabase Integration implementieren
    console.log(`Subscription updated: ${subscription.id} - ${subscription.status}`);
    console.log('TODO: Implement Supabase subscription update');
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

// Subscription gelöscht
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    // TODO: Supabase Integration implementieren
    console.log(`Subscription deleted: ${subscription.id}`);
    console.log('TODO: Implement Supabase subscription update');
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

// Zahlung erfolgreich
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    // TODO: Supabase Integration implementieren
    console.log(`Payment succeeded for subscription: ${(invoice as any).subscription || 'N/A'}`);
    console.log('TODO: Implement Supabase subscription update');
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

// Zahlung fehlgeschlagen
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    // TODO: Supabase Integration implementieren
    console.log(`Payment failed for subscription: ${(invoice as any).subscription || 'N/A'}`);
    console.log('TODO: Implement Supabase subscription update');
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}
