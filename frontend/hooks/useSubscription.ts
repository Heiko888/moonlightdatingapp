import { useState, useEffect } from 'react';
import { UserSubscription } from '../lib/subscription/types';

export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubscription = () => {
    try {
      // Versuche localStorage
      const stored = localStorage.getItem('user-subscription');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('useSubscription: Loaded from localStorage:', parsed);
        setSubscription(parsed);
        setIsLoading(false);
        return;
      }

      // Fallback: Cookies (für Server-Side Rendering)
      const cookieSubscription = document.cookie
        .split('; ')
        .find(row => row.startsWith('user-subscription='))
        ?.split('=')[1];
      
      if (cookieSubscription) {
        const parsed = JSON.parse(decodeURIComponent(cookieSubscription));
        console.log('useSubscription: Loaded from cookies:', parsed);
        setSubscription(parsed);
        // Synchronisiere auch in localStorage
        localStorage.setItem('user-subscription', JSON.stringify(parsed));
        setIsLoading(false);
        return;
      }

      console.log('useSubscription: No subscription found');
      setSubscription(null);
      setIsLoading(false);
    } catch (error) {
      console.error('useSubscription: Error loading subscription:', error);
      setSubscription(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscription();

    // Storage Event Listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user-subscription') {
        console.log('useSubscription: Storage event detected');
        loadSubscription();
      }
    };

    // Polling für Cookie-Updates (falls Storage Events nicht funktionieren)
    const pollInterval = setInterval(() => {
      const cookieSubscription = document.cookie
        .split('; ')
        .find(row => row.startsWith('user-subscription='))
        ?.split('=')[1];
      
      if (cookieSubscription) {
        // Prüfe ob sich die Cookie-Subscription geändert hat
        const currentStored = localStorage.getItem('user-subscription');
        if (!currentStored || currentStored !== cookieSubscription) {
          console.log('useSubscription: Polling detected cookie subscription change');
          loadSubscription();
        }
      }
    }, 2000); // Erhöht auf 2 Sekunden um Performance zu verbessern

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, []); // Entfernt subscription aus dependencies um Loop zu vermeiden

  const hasPackage = (requiredPackage: string) => {
    if (!subscription) return requiredPackage === 'free';
    
    const hierarchy = ['free', 'basic', 'premium', 'vip', 'admin'];
    const currentLevel = hierarchy.indexOf(subscription.packageId);
    const requiredLevel = hierarchy.indexOf(requiredPackage);
    
    return currentLevel >= requiredLevel;
  };

  const isVIP = subscription?.packageId === 'vip' || subscription?.packageId === 'admin';
  const isPremium = subscription?.packageId === 'premium' || isVIP;
  const isBasic = subscription?.packageId === 'basic' || isPremium;

  const forceSync = () => {
    console.log('useSubscription: Force sync triggered');
    loadSubscription();
  };

  return {
    subscription,
    isLoading,
    hasPackage,
    isVIP,
    isPremium,
    isBasic,
    reload: loadSubscription,
    forceSync
  };
}
