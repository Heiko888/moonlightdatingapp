export interface SubscriptionPackage {
  id: 'basic' | 'premium' | 'vip';
  name: string;
  description: string;
  price: string;
  priceMonthly: number;
  priceYearly: number;
  color: string;
  icon: string;
  features: string[];
  limitations: string[];
  maxCharts: number;
  maxCoachingSessions: number;
  maxDatingMatches: number;
  hasAdvancedAnalytics: boolean;
  hasVIPCommunity: boolean;
  hasPersonalCoach: boolean;
  hasPrioritySupport: boolean;
  hasEarlyAccess: boolean;
}

export interface UserSubscription {
  id?: string; // Optional für Kompatibilität mit verschiedenen Datenquellen
  userId: string;
  packageId: 'basic' | 'premium' | 'vip';
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: string;
  billingCycle: 'monthly' | 'yearly';
  createdAt?: string; // Optional für Supabase Kompatibilität
  updatedAt?: string; // Optional für Supabase Kompatibilität
}

export interface PageAccess {
  path: string;
  name: string;
  requiredPackage: 'free' | 'basic' | 'premium' | 'vip';
  description: string;
  category: string;
  exactPackage?: boolean; // Wenn true, nur exakt dieses Paket, nicht höhere
}

export interface AccessControl {
  canAccess: boolean;
  requiredPackage: string;
  currentPackage: string;
  upgradeRequired: boolean;
  message: string;
}
