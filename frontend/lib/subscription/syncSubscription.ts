"use client";

import { UserSubscription } from './types';

/**
 * Synchronisiert die Subscription zwischen localStorage und Cookies
 */
export function syncSubscriptionToCookies(subscription: UserSubscription | null) {
  if (subscription && subscription.packageId !== 'free') {
    // Setze Cookie für Server-side Access
    document.cookie = `user-subscription=${JSON.stringify(subscription)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    
    // Setze auch userData für Kompatibilität
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.subscriptionPlan = subscription.packageId;
    localStorage.setItem('userData', JSON.stringify(userData));
    
    console.log('Subscription synced to cookies:', subscription);
  } else {
    // Entferne Cookie wenn keine Subscription
    document.cookie = 'user-subscription=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

/**
 * Lädt Subscription aus localStorage und synchronisiert mit Cookies
 */
export function loadAndSyncSubscription(): UserSubscription | null {
  try {
    // Lade aus localStorage
    const storedSubscription = localStorage.getItem('user-subscription');
    if (storedSubscription) {
      const subscription = JSON.parse(storedSubscription);
      
      // Synchronisiere mit Cookies
      syncSubscriptionToCookies(subscription);
      
      return subscription;
    }
  } catch (error) {
    console.error('Error loading subscription:', error);
  }
  
  return null;
}

/**
 * Setzt eine neue Subscription und synchronisiert sie
 */
export function setSubscription(subscription: UserSubscription) {
  // Speichere in localStorage
  localStorage.setItem('user-subscription', JSON.stringify(subscription));
  
  // Synchronisiere mit Cookies
  syncSubscriptionToCookies(subscription);
  
  // Trigger storage event für andere Tabs
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'user-subscription',
    newValue: JSON.stringify(subscription)
  }));
  
  console.log('Subscription set and synced:', subscription);
}

/**
 * Entfernt die Subscription
 */
export function clearSubscription() {
  localStorage.removeItem('user-subscription');
  document.cookie = 'user-subscription=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  // Trigger storage event
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'user-subscription',
    newValue: null
  }));
  
  console.log('Subscription cleared');
}
