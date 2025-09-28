/**
 * Stripe Client für Payment-Integration
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export interface CreateCheckoutSessionParams {
  packageId: string;
  priceId: string;
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  data?: {
    sessionId: string;
    url: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Erstellt eine Stripe Checkout Session
 */
export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<CreateCheckoutSessionResponse> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Kein Authentifizierungs-Token gefunden'
        }
      };
    }

    const response = await fetch('/api/payment/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(params)
    });

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Netzwerkfehler beim Erstellen der Checkout-Session'
      }
    };
  }
}

/**
 * Leitet zur Stripe Checkout-Seite weiter
 */
export async function redirectToCheckout(sessionUrl: string): Promise<void> {
  const stripe = await getStripe();
  if (stripe) {
    await stripe.redirectToCheckout({ sessionId: sessionUrl });
  }
}

/**
 * Stripe-Preis-IDs für verschiedene Pakete
 */
export const STRIPE_PRICE_IDS = {
  basic: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || 'price_basic',
  premium: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || 'price_premium',
  vip: process.env.NEXT_PUBLIC_STRIPE_VIP_PRICE_ID || 'price_vip'
} as const;

/**
 * Paket-zu-Preis-ID-Mapping
 */
export const PACKAGE_TO_PRICE_ID: Record<string, string> = {
  'basic': STRIPE_PRICE_IDS.basic,
  'premium': STRIPE_PRICE_IDS.premium,
  'vip': STRIPE_PRICE_IDS.vip
};

/**
 * Validiert Stripe-Konfiguration
 */
export function validateStripeConfig(): boolean {
  const requiredEnvVars = [
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];

  return requiredEnvVars.every(envVar => process.env[envVar]);
}

/**
 * Stripe-Fehler-Handler
 */
export function handleStripeError(error: any): string {
  if (error.type === 'card_error') {
    return 'Kartennummer ungültig oder abgelehnt';
  } else if (error.type === 'rate_limit_error') {
    return 'Zu viele Anfragen. Bitte versuche es später erneut';
  } else if (error.type === 'invalid_request_error') {
    return 'Ungültige Anfrage. Bitte überprüfe deine Eingaben';
  } else if (error.type === 'api_connection_error') {
    return 'Verbindungsfehler. Bitte versuche es später erneut';
  } else if (error.type === 'api_error') {
    return 'Serverfehler. Bitte versuche es später erneut';
  } else if (error.type === 'authentication_error') {
    return 'Authentifizierungsfehler. Bitte melde dich erneut an';
  } else {
    return 'Ein unbekannter Fehler ist aufgetreten';
  }
}
