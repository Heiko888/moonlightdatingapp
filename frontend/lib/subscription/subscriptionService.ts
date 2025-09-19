import { UserSubscription, SubscriptionPackage } from './types';
import { subscriptionPackages } from './packages';

export class SubscriptionService {
  private static readonly API_BASE = 'http://localhost:4001/subscription';

  // Benutzer-Abonnement abrufen
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const response = await fetch(`${this.API_BASE}/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Fehler beim Laden des Abonnements:', error);
      return this.getMockSubscription(userId);
    }
  }

  // Abonnement erstellen/aktualisieren
  static async updateSubscription(
    userId: string, 
    packageId: string, 
    billingCycle: 'monthly' | 'yearly' = 'monthly'
  ): Promise<UserSubscription | null> {
    try {
      const response = await fetch(`${this.API_BASE}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          packageId,
          billingCycle,
          autoRenew: true
        })
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Abonnements:', error);
      return this.getMockSubscription(userId, packageId as any);
    }
  }

  // Abonnement kündigen
  static async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/user/${userId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Fehler beim Kündigen des Abonnements:', error);
      return false;
    }
  }

  // Zahlungsmethoden verwalten
  static async updatePaymentMethod(userId: string, paymentMethod: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/user/${userId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(paymentMethod)
      });

      return response.ok;
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Zahlungsmethode:', error);
      return false;
    }
  }

  // Abonnement-Status prüfen
  static async checkSubscriptionStatus(userId: string): Promise<{
    isActive: boolean;
    daysRemaining: number;
    needsRenewal: boolean;
  }> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) {
        return { isActive: false, daysRemaining: 0, needsRenewal: false };
      }

      const endDate = new Date(subscription.endDate);
      const now = new Date();
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        isActive: subscription.status === 'active' && daysRemaining > 0,
        daysRemaining: Math.max(0, daysRemaining),
        needsRenewal: daysRemaining <= 7 && subscription.autoRenew
      };
    } catch (error) {
      console.error('Fehler beim Prüfen des Abonnement-Status:', error);
      return { isActive: false, daysRemaining: 0, needsRenewal: false };
    }
  }

  // Mock-Daten für Entwicklung
  private static getMockSubscription(userId: string, packageId: 'basic' | 'premium' | 'vip' = 'basic'): UserSubscription {
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 Monat gültig

    return {
      userId,
      packageId,
      status: 'active',
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      autoRenew: true,
      paymentMethod: 'credit_card',
      billingCycle: 'monthly'
    };
  }

  // Verfügbare Pakete abrufen
  static getAvailablePackages(): SubscriptionPackage[] {
    return subscriptionPackages;
  }

  // Paket nach ID abrufen
  static getPackageById(id: string): SubscriptionPackage | undefined {
    return subscriptionPackages.find(pkg => pkg.id === id);
  }

  // Upgrade-Pfad berechnen
  static getUpgradePath(currentPackage: string): SubscriptionPackage[] {
    const packageHierarchy = ['basic', 'premium', 'vip'];
    const currentIndex = packageHierarchy.indexOf(currentPackage);
    
    if (currentIndex === -1 || currentIndex === packageHierarchy.length - 1) {
      return [];
    }
    
    return packageHierarchy
      .slice(currentIndex + 1)
      .map(id => this.getPackageById(id))
      .filter(Boolean) as SubscriptionPackage[];
  }
}
