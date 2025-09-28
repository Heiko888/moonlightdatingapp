/**
 * Subscription-Service für Abonnement-Management
 * Verwaltet Benutzer-Abonnements und Zugriffsrechte
 */

import { api } from '@/lib/api/client';
import { API_CONFIG } from '@/lib/api/config';

export interface SubscriptionInfo {
  id: string;
  userId: string;
  level: 'free' | 'basic' | 'premium' | 'vip' | 'admin';
  status: 'active' | 'inactive' | 'expired' | 'cancelled';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  features: string[];
  metadata?: Record<string, unknown>;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  level: SubscriptionInfo['level'];
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  isPopular?: boolean;
  isRecommended?: boolean;
}

export interface SubscriptionHistory {
  id: string;
  userId: string;
  action: 'created' | 'upgraded' | 'downgraded' | 'cancelled' | 'renewed' | 'expired';
  fromLevel?: SubscriptionInfo['level'];
  toLevel?: SubscriptionInfo['level'];
  timestamp: string;
  metadata?: Record<string, unknown>;
}

class SubscriptionService {
  /**
   * Lädt aktuelle Subscription-Informationen für einen Benutzer
   */
  async getCurrentSubscription(userId: string): Promise<SubscriptionInfo | null> {
    try {
      const response = await api.get<SubscriptionInfo>(`${API_CONFIG.ENDPOINTS.USERS.SUBSCRIPTION.replace(':id', userId)}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Fehler beim Laden der Subscription-Info:', error);
      return null;
    }
  }

  /**
   * Überprüft, ob ein Benutzer Zugriff auf eine bestimmte Subscription-Stufe hat
   */
  async hasAccess(userId: string, requiredLevel: SubscriptionInfo['level']): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription(userId);
      
      if (!subscription) {
        return requiredLevel === 'free';
      }

      // Subscription-Level-Hierarchie
      const levels = {
        free: 0,
        basic: 1,
        premium: 2,
        vip: 3,
        admin: 4
      };

      const userLevel = levels[subscription.level];
      const requiredLevelValue = levels[requiredLevel];

      // Admin hat immer Zugriff
      if (subscription.level === 'admin') {
        return true;
      }

      // Prüfe Level und Status
      return userLevel >= requiredLevelValue && 
             subscription.status === 'active' && 
             this.isSubscriptionActive(subscription);
    } catch (error) {
      console.error('Fehler bei der Zugriffsprüfung:', error);
      return false;
    }
  }

  /**
   * Überprüft, ob eine Subscription aktiv ist
   */
  isSubscriptionActive(subscription: SubscriptionInfo): boolean {
    if (subscription.level === 'free') return true;
    if (subscription.level === 'admin') return true;
    if (subscription.status !== 'active') return false;
    
    if (!subscription.endDate) return false;
    
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    
    return endDate > now;
  }

  /**
   * Lädt verfügbare Subscription-Pläne
   */
  async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await api.get<SubscriptionPlan[]>('/subscription/plans');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return this.getDefaultPlans();
    } catch (error) {
      console.error('Fehler beim Laden der Pläne:', error);
      return this.getDefaultPlans();
    }
  }

  /**
   * Erstellt oder aktualisiert eine Subscription
   */
  async createOrUpdateSubscription(
    userId: string, 
    planId: string, 
    paymentMethodId?: string
  ): Promise<{ success: boolean; subscription?: SubscriptionInfo; error?: string }> {
    try {
      const response = await api.post<SubscriptionInfo>('/subscription/create', {
        userId,
        planId,
        paymentMethodId
      });
      
      if (response.success && response.data) {
        return { success: true, subscription: response.data };
      }
      
      return { success: false, error: 'Fehler beim Erstellen der Subscription' };
    } catch (error) {
      console.error('Fehler beim Erstellen der Subscription:', error);
      return { success: false, error: 'Fehler beim Erstellen der Subscription' };
    }
  }

  /**
   * Kündigt eine Subscription
   */
  async cancelSubscription(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.post(`/subscription/cancel`, { userId });
      
      if (response.success) {
        return { success: true };
      }
      
      return { success: false, error: 'Fehler beim Kündigen der Subscription' };
    } catch (error) {
      console.error('Fehler beim Kündigen der Subscription:', error);
      return { success: false, error: 'Fehler beim Kündigen der Subscription' };
    }
  }

  /**
   * Lädt Subscription-Historie für einen Benutzer
   */
  async getSubscriptionHistory(userId: string): Promise<SubscriptionHistory[]> {
    try {
      const response = await api.get<SubscriptionHistory[]>(`/subscription/history/${userId}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Fehler beim Laden der Subscription-Historie:', error);
      return [];
    }
  }

  /**
   * Lädt Features für eine Subscription-Stufe
   */
  getFeaturesForLevel(level: SubscriptionInfo['level']): string[] {
    const features = {
      free: [
        'Grundlegende Human Design Analyse',
        'Basis-Profil-Informationen',
        'Community-Zugang (limitierte Funktionen)',
        'Basis-Mondkalender'
      ],
      basic: [
        'Alle Free-Features',
        'Erweiterte Profil-Analyse',
        'Vollständiger Mondkalender',
        'Basis-Dating-Features',
        'Erweiterte Community-Funktionen'
      ],
      premium: [
        'Alle Basic-Features',
        'Premium-Dashboard mit Analytics',
        'Erweiterte Dating-Algorithmen',
        'Prioritäts-Support',
        'Exklusive Community-Features',
        'Erweiterte Mondkalender-Features',
        'Persönliche Insights'
      ],
      vip: [
        'Alle Premium-Features',
        'Persönlicher Coach-Zugang',
        'Exklusive Events und Workshops',
        '1:1 Beratungen',
        'Früher Zugang zu neuen Features',
        'Premium-Community-Bereich',
        'Individuelle Analysen'
      ],
      admin: [
        'Vollzugriff auf alle Features',
        'Admin-Dashboard',
        'System-Verwaltung',
        'Benutzer-Management',
        'Analytics und Berichte',
        'API-Zugriff'
      ]
    };

    return features[level] || features.free;
  }

  /**
   * Überprüft, ob ein Feature für eine Subscription-Stufe verfügbar ist
   */
  hasFeature(level: SubscriptionInfo['level'], feature: string): boolean {
    const features = this.getFeaturesForLevel(level);
    return features.includes(feature);
  }

  /**
   * Lädt Standard-Pläne als Fallback
   */
  private getDefaultPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'free',
        name: 'Free',
        level: 'free',
        price: 0,
        currency: 'EUR',
        interval: 'monthly',
        features: this.getFeaturesForLevel('free')
      },
      {
        id: 'basic',
        name: 'Basic',
        level: 'basic',
        price: 9.99,
        currency: 'EUR',
        interval: 'monthly',
        features: this.getFeaturesForLevel('basic')
      },
      {
        id: 'premium',
        name: 'Premium',
        level: 'premium',
        price: 19.99,
        currency: 'EUR',
        interval: 'monthly',
        features: this.getFeaturesForLevel('premium'),
        isPopular: true
      },
      {
        id: 'vip',
        name: 'VIP',
        level: 'vip',
        price: 49.99,
        currency: 'EUR',
        interval: 'monthly',
        features: this.getFeaturesForLevel('vip'),
        isRecommended: true
      }
    ];
  }

  /**
   * Validiert eine Subscription und aktualisiert den Status
   */
  async validateSubscription(userId: string): Promise<SubscriptionInfo | null> {
    try {
      const subscription = await this.getCurrentSubscription(userId);
      
      if (!subscription) {
        return null;
      }

      // Prüfe, ob Subscription abgelaufen ist
      if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
        // Aktualisiere Status auf abgelaufen
        await this.updateSubscriptionStatus(userId, 'expired');
        subscription.status = 'expired';
      }

      return subscription;
    } catch (error) {
      console.error('Fehler bei der Subscription-Validierung:', error);
      return null;
    }
  }

  /**
   * Aktualisiert den Status einer Subscription
   */
  private async updateSubscriptionStatus(
    userId: string, 
    status: SubscriptionInfo['status']
  ): Promise<boolean> {
    try {
      const response = await api.put(`/subscription/status`, { userId, status });
      return response.success;
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Subscription-Status:', error);
      return false;
    }
  }
}

// Singleton-Instanz exportieren
export const subscriptionService = new SubscriptionService();

// Convenience-Funktionen
export const getCurrentSubscription = (userId: string) => subscriptionService.getCurrentSubscription(userId);
export const hasAccess = (userId: string, level: SubscriptionInfo['level']) => subscriptionService.hasAccess(userId, level);
export const getAvailablePlans = () => subscriptionService.getAvailablePlans();
export const createOrUpdateSubscription = (userId: string, planId: string, paymentMethodId?: string) => 
  subscriptionService.createOrUpdateSubscription(userId, planId, paymentMethodId);
export const cancelSubscription = (userId: string) => subscriptionService.cancelSubscription(userId);
export const getSubscriptionHistory = (userId: string) => subscriptionService.getSubscriptionHistory(userId);
export const getFeaturesForLevel = (level: SubscriptionInfo['level']) => subscriptionService.getFeaturesForLevel(level);
export const hasFeature = (level: SubscriptionInfo['level'], feature: string) => subscriptionService.hasFeature(level, feature);
export const validateSubscription = (userId: string) => subscriptionService.validateSubscription(userId);
