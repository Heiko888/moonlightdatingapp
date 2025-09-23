import { checkPageAccess } from '../subscription/accessControl';
import type { UserSubscription as SubscriptionType } from '../subscription/types';

export interface UserData {
  subscriptionPlan?: string;
  id?: string;
  name?: string;
  email?: string;
}

export interface UserSubscription {
  userId?: string;
  packageId?: string;
  plan?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  autoRenew?: boolean;
  paymentMethod?: string;
  billingCycle?: string;
  features?: string[];
}

/**
 * Intelligente Weiterleitung basierend auf Benutzer-Berechtigungen
 */
export const smartRedirect = (targetPath?: string): string => {
  // Prüfe ob Profileinrichtung abgeschlossen ist
  const profileSetupCompleted = localStorage.getItem('profileSetupCompleted');
  console.log('🔍 Profile-Setup Status:', profileSetupCompleted);
  
  if (profileSetupCompleted !== 'true') {
    console.log('🔄 Erste Anmeldung - leite zur Profil-Einrichtung weiter');
    return '/profil-einrichten';
  }

  // Lade Benutzer-Daten
  const userData = getUserData();
  const userSubscription = getUserSubscription();
  
  // Bestimme den aktuellen Plan
  const currentPlan = getCurrentPlan(userData, userSubscription);
  
  console.log('🔍 Navigation Debug:', {
    userData,
    userSubscription,
    currentPlan
  });
  
  // Erstelle UserSubscription-Objekt für AccessControl
  const subscription: SubscriptionType = {
    userId: userData?.id || 'unknown',
    packageId: currentPlan as 'basic' | 'premium' | 'vip',
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: false,
    paymentMethod: 'none',
    billingCycle: 'monthly'
  };
  
  // Wenn eine spezifische Seite gewünscht ist, prüfe die Berechtigung
  if (targetPath) {
    const access = checkPageAccess(targetPath, subscription);
    if (access.canAccess) {
      console.log(`✅ Zugriff auf ${targetPath} gewährt (Plan: ${currentPlan})`);
      return targetPath;
    } else {
      console.log(`⚠️ Kein Zugriff auf ${targetPath} (Plan: ${currentPlan}) - leite zu Premium Dashboard weiter`);
      return '/premium-dashboard';
    }
  }
  
  // Standard-Weiterleitung basierend auf Plan
  switch (currentPlan) {
    case 'basic':
      return '/dashboard'; // Basic-User verwenden normales Dashboard
    case 'premium':
      return '/premium-dashboard'; // Premium-User haben ihr eigenes Premium-Dashboard
    case 'vip':
      return '/premium-dashboard'; // VIP-User verwenden Premium Dashboard
    case 'admin':
      return '/admin'; // Admin-User haben ihren eigenen Admin-Bereich
    default:
      return '/dashboard'; // Fallback: Normales Dashboard
  }
};

/**
 * Lädt Benutzer-Daten aus localStorage
 */
export const getUserData = (): UserData | null => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    
    const parsed = JSON.parse(userData);
    return {
      subscriptionPlan: parsed?.subscriptionPlan || 'basic',
      id: parsed?.id || '',
      name: parsed?.name || '',
      email: parsed?.email || ''
    };
  } catch (error) {
    console.error('Fehler beim Laden der Benutzer-Daten:', error);
    return null;
  }
};

/**
 * Lädt Subscription-Daten aus localStorage
 */
export const getUserSubscription = (): UserSubscription | null => {
  try {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      
      // Debug-Logging für bessere Fehlerdiagnose
      console.log('🔍 getUserSubscription Debug:', {
        userData: user,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus
      });
      
      return {
        userId: user?.id || 'unknown',
        packageId: user?.subscriptionPlan || 'basic', // WICHTIG: subscriptionPlan wird zu packageId
        status: user?.subscriptionStatus || 'active',
        startDate: user?.subscriptionStartDate || new Date().toISOString(),
        endDate: user?.subscriptionEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: user?.autoRenew || false,
        paymentMethod: user?.paymentMethod || 'none',
        billingCycle: user?.billingCycle || 'monthly',
      } as SubscriptionType;
    }
    return null;
  } catch (error) {
    console.error('Fehler beim Laden der Subscription-Daten:', error);
    return null;
  }
};

/**
 * Bestimmt den aktuellen Plan des Benutzers
 */
export const getCurrentPlan = (userData?: UserData | null, userSubscription?: UserSubscription | null): string => {
  // Priorität: userSubscription.packageId > userSubscription.plan > userData.subscriptionPlan > 'basic'
  let plan = userSubscription?.packageId || userSubscription?.plan || userData?.subscriptionPlan || 'basic';
  
  // Debug-Logging für bessere Fehlerdiagnose
  console.log('🔍 getCurrentPlan Debug:', {
    userData: userData ? { subscriptionPlan: userData.subscriptionPlan } : null,
    userSubscription: userSubscription ? { packageId: userSubscription.packageId, plan: userSubscription.plan } : null,
    finalPlan: plan
  });
  
  // Auto-Upgrade für alte 'free' Accounts
  if (plan === 'free') {
    plan = 'basic';
    console.log('🔄 Auto-Upgrade: free → basic');
  }
  
  // Admin ist ein separater Zugang - nicht Teil der normalen Paket-Hierarchie
  if (plan === 'admin') {
    console.log('🔐 Admin-Zugang erkannt');
  }
  
  return plan;
};

/**
 * Prüft, ob der Benutzer Zugriff auf eine bestimmte Seite hat
 */
export const hasAccess = (path: string): boolean => {
  const userData = getUserData();
  const userSubscription = getUserSubscription();
  const currentPlan = getCurrentPlan(userData, userSubscription);
  
  const subscription: SubscriptionType = {
    userId: userData?.id || 'unknown',
    packageId: currentPlan as 'basic' | 'premium' | 'vip',
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: false,
    paymentMethod: 'none',
    billingCycle: 'monthly'
  };
  
  const access = checkPageAccess(path, subscription);
  return access.canAccess;
};

/**
 * Gibt eine Liste der für den Benutzer zugänglichen Seiten zurück
 */
export const getAccessiblePages = (): string[] => {
  const userData = getUserData();
  const userSubscription = getUserSubscription();
  const currentPlan = getCurrentPlan(userData, userSubscription);
  
  const subscription: SubscriptionType = {
    userId: userData?.id || 'unknown',
    packageId: currentPlan as 'basic' | 'premium' | 'vip',
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: false,
    paymentMethod: 'none',
    billingCycle: 'monthly'
  };
  
  // Liste der wichtigsten Seiten
  const pages = [
    '/dashboard',
    '/chart',
    '/mondkalender',
    '/community',
    '/swipe',
    '/settings',
    '/chart-comparison',
    '/coaching-new',
    '/dashboard-vip',
    '/admin'
  ];
  
  return pages.filter(page => {
    const access = checkPageAccess(page, subscription);
    return access.canAccess;
  });
};
