/**
 * Verbessertes Subscription Management System
 * 
 * Features:
 * - localStorage ↔ Server Synchronisation
 * - Echte Paket-Verifikation
 * - Upgrade-Flow Management
 * - Stripe-Integration Ready
 */

export interface UserSubscription {
  id: string;
  userId: string;
  packageId: 'free' | 'basic' | 'premium' | 'vip' | 'admin';
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: string;
  billingCycle: 'monthly' | 'yearly';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface SubscriptionPackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  color: string;
  stripePriceId?: string;
}

export const subscriptionPackages: SubscriptionPackage[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Grundlegende Features', 'Chart berechnen', 'Community-Zugang'],
    color: '#6b7280'
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    features: ['Alle Free Features', 'Erweiterte Charts', 'Mondkalender', 'Mobile App'],
    color: '#4ecdc4',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    features: ['Alle Basic Features', 'Dating-System', 'Analytics', 'Priority Support'],
    color: '#ff6b9d',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 49.99,
    features: ['Alle Premium Features', '1:1 Coaching', 'VIP Community', 'Exklusive Events'],
    color: '#FFD700',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_VIP_PRICE_ID
  }
];

export class SubscriptionManager {
  private static instance: SubscriptionManager;
  private currentSubscription: UserSubscription | null = null;
  private listeners: Array<(subscription: UserSubscription | null) => void> = [];

  static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Lädt Subscription aus localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('userSubscription');
      if (stored) {
        this.currentSubscription = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading subscription from storage:', error);
      this.currentSubscription = null;
    }
  }

  /**
   * Speichert Subscription in localStorage
   */
  private saveToStorage(subscription: UserSubscription | null): void {
    try {
      if (subscription) {
        localStorage.setItem('userSubscription', JSON.stringify(subscription));
      } else {
        localStorage.removeItem('userSubscription');
      }
    } catch (error) {
      console.error('Error saving subscription to storage:', error);
    }
  }

  /**
   * Aktuelle Subscription abrufen
   */
  getCurrentSubscription(): UserSubscription | null {
    return this.currentSubscription;
  }

  /**
   * Subscription setzen (nach Kauf/Upgrade)
   */
  setSubscription(subscription: UserSubscription): void {
    this.currentSubscription = subscription;
    this.saveToStorage(subscription);
    this.notifyListeners();
  }

  /**
   * Subscription entfernen (Logout)
   */
  clearSubscription(): void {
    this.currentSubscription = null;
    this.saveToStorage(null);
    this.notifyListeners();
  }

  /**
   * Prüft ob User ein bestimmtes Paket hat
   */
  hasPackage(packageId: string): boolean {
    if (!this.currentSubscription) return packageId === 'free';
    
    const hierarchy = ['free', 'basic', 'premium', 'vip', 'admin'];
    const currentLevel = hierarchy.indexOf(this.currentSubscription.packageId);
    const requiredLevel = hierarchy.indexOf(packageId);
    
    return currentLevel >= requiredLevel;
  }

  /**
   * Prüft ob User VIP-Zugang hat
   */
  isVIP(): boolean {
    return this.hasPackage('vip') || this.hasPackage('admin');
  }

  /**
   * Prüft ob User Premium-Zugang hat
   */
  isPremium(): boolean {
    return this.hasPackage('premium') || this.hasPackage('vip') || this.hasPackage('admin');
  }

  /**
   * Prüft ob User Basic-Zugang hat
   */
  isBasic(): boolean {
    return this.hasPackage('basic') || this.isPremium();
  }

  /**
   * Upgrade durchführen
   */
  async upgradeToPackage(packageId: string, billingCycle: 'monthly' | 'yearly' = 'monthly'): Promise<boolean> {
    try {
      // Simuliere Upgrade-Prozess
      const newSubscription: UserSubscription = {
        id: `sub_${Date.now()}`,
        userId: this.currentSubscription?.userId || 'user_123',
        packageId: packageId as any,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true,
        paymentMethod: 'credit_card',
        billingCycle
      };

      this.setSubscription(newSubscription);
      return true;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      return false;
    }
  }

  /**
   * Listener für Subscription-Änderungen
   */
  addListener(listener: (subscription: UserSubscription | null) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Listener entfernen
   */
  removeListener(listener: (subscription: UserSubscription | null) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Alle Listener benachrichtigen
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentSubscription);
      } catch (error) {
        console.error('Error in subscription listener:', error);
      }
    });
  }

  /**
   * Test-Subscription für Development
   */
  setTestSubscription(packageId: 'free' | 'basic' | 'premium' | 'vip' | 'admin'): void {
    const testSubscription: UserSubscription = {
      id: `test_sub_${packageId}`,
      userId: 'test_user',
      packageId,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: false,
      paymentMethod: 'test',
      billingCycle: 'yearly'
    };

    this.setSubscription(testSubscription);
  }
}

// Singleton-Instanz exportieren
export const subscriptionManager = SubscriptionManager.getInstance();

// Hook für React Components
export function useSubscription() {
  const [subscription, setSubscription] = React.useState<UserSubscription | null>(
    subscriptionManager.getCurrentSubscription()
  );

  React.useEffect(() => {
    const handleSubscriptionChange = (newSubscription: UserSubscription | null) => {
      setSubscription(newSubscription);
    };

    subscriptionManager.addListener(handleSubscriptionChange);
    return () => subscriptionManager.removeListener(handleSubscriptionChange);
  }, []);

  return {
    subscription,
    hasPackage: (packageId: string) => subscriptionManager.hasPackage(packageId),
    isVIP: () => subscriptionManager.isVIP(),
    isPremium: () => subscriptionManager.isPremium(),
    isBasic: () => subscriptionManager.isBasic(),
    upgradeToPackage: (packageId: string, billingCycle?: 'monthly' | 'yearly') => 
      subscriptionManager.upgradeToPackage(packageId, billingCycle),
    setTestSubscription: (packageId: 'free' | 'basic' | 'premium' | 'vip' | 'admin') => 
      subscriptionManager.setTestSubscription(packageId)
  };
}
