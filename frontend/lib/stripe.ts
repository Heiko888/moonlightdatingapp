import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

// Stripe Product IDs für verschiedene Pakete
export const STRIPE_PRODUCTS = {
  BASIC: process.env.STRIPE_BASIC_PRICE_ID!,
  PREMIUM: process.env.STRIPE_PREMIUM_PRICE_ID!,
  VIP: process.env.STRIPE_VIP_PRICE_ID!,
} as const;

// Subscription-Pakete Mapping
export const SUBSCRIPTION_PACKAGES = {
  basic: {
    name: 'Basic',
    price: 9.99,
    features: ['Grundlegende Features', 'Chat-System', 'Mobile App'],
    stripePriceId: STRIPE_PRODUCTS.BASIC,
  },
  premium: {
    name: 'Premium',
    price: 19.99,
    features: ['Alle Basic Features', 'Erweiterte Analytics', 'Priority Support'],
    stripePriceId: STRIPE_PRODUCTS.PREMIUM,
  },
  vip: {
    name: 'VIP',
    price: 49.99,
    features: ['Alle Premium Features', '1:1 Coaching', 'Exklusive Community'],
    stripePriceId: STRIPE_PRODUCTS.VIP,
  },
} as const;

export type SubscriptionPackage = keyof typeof SUBSCRIPTION_PACKAGES;
