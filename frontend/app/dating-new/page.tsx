"use client";
import React from 'react';
import DatingInterface from '../../components/DatingInterface';
import AccessControl from '../../components/AccessControl';
import { UserSubscription } from '../../lib/subscription/types';
import { SubscriptionService } from '../../lib/subscription/subscriptionService';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DatingNewPage() {
  const router = useRouter();
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authentifizierung und Subscription prüfen
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        setIsAuthenticated(false);
        router.push('/login?redirect=/dating-new');
        return;
      }
      
      setIsAuthenticated(true);
      
      // Subscription laden
      await loadUserSubscription();
    };

    checkAuth();
  }, [router]);

  const loadUserSubscription = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const subscription = await SubscriptionService.getUserSubscription(user.id);
        setUserSubscription(subscription);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Subscription:', error);
    }
  };

  return (
    <AccessControl 
      path="/dating-new" 
      userSubscription={userSubscription}
      onUpgrade={() => router.push('/pricing')}
    >
      <DatingInterface />
    </AccessControl>
  );
}
