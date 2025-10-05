"use client";

import React, { useState, useEffect } from 'react';
import { safeJsonParse } from '@/lib/supabase/client';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  CreditCard, 
  Calendar, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCcw
} from 'lucide-react';

interface SubscriptionData {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  plan: {
    id: string;
    nickname: string;
    amount: number;
    currency: string;
    interval: string;
  };
}

export default function SubscriptionManagement() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      // Hier würde normalerweise ein API-Call zu Ihrem Backend gemacht werden
      // Für Demo-Zwecke verwenden wir localStorage
      const userData = localStorage.getItem('userData');
      const subscriptionData = localStorage.getItem('userSubscription');

      if (userData && subscriptionData) {
        const user = safeJsonParse(userData, {});
        const sub = safeJsonParse(subscriptionData, {});
        
        // Mock Stripe Subscription Data
        const mockSubscription: SubscriptionData = {
          id: `sub_${Date.now()}`,
          status: sub.status === 'active' ? 'active' : 'canceled',
          current_period_start: sub.startDate,
          current_period_end: sub.endDate,
          cancel_at_period_end: false,
          plan: {
            id: sub.packageId,
            nickname: sub.packageId.charAt(0).toUpperCase() + sub.packageId.slice(1),
            amount: sub.packageId === 'basic' ? 0 : sub.packageId === 'premium' ? 1999 : 4999,
            currency: 'eur',
            interval: 'month'
          }
        };

        setSubscription(mockSubscription);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Subscription:', error);
      setError('Fehler beim Laden der Abonnement-Daten');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        setError('Benutzer nicht gefunden');
        return;
      }

      const user = safeJsonParse(userData, {});
      
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const { url } = await response.json();

      if (url) {
        window.open(url, '_blank');
      } else {
        setError('Fehler beim Öffnen des Kundenportals');
      }
    } catch (error) {
      console.error('Fehler beim Öffnen des Kundenportals:', error);
      setError('Fehler beim Öffnen des Kundenportals');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'canceled': return '#ef4444';
      case 'past_due': return '#f59e0b';
      case 'unpaid': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={20} />;
      case 'canceled': return <XCircle size={20} />;
      case 'past_due': return <AlertTriangle size={20} />;
      case 'unpaid': return <XCircle size={20} />;
      default: return <AlertTriangle size={20} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <RefreshCcw className="animate-spin" size={24} />
      </Box>
    );
  }

  if (!subscription) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        <Typography variant="body1">
          Sie haben derzeit kein aktives Abonnement. 
          <Button 
            variant="text" 
            onClick={() => window.location.href = '/pricing'}
            sx={{ ml: 1 }}
          >
            Jetzt upgraden
          </Button>
        </Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ color: '#e6e6fa', fontWeight: 700 }}>
              Abonnement-Verwaltung
            </Typography>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: getStatusColor(subscription.status),
              color: 'white',
              fontWeight: 'bold'
            }}>
              {getStatusIcon(subscription.status)}
              {subscription.status === 'active' ? 'Aktiv' : 
               subscription.status === 'canceled' ? 'Gekündigt' :
               subscription.status === 'past_due' ? 'Überfällig' : 'Unbezahlt'}
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ color: '#e6e6fa', mb: 2 }}>
                Aktueller Plan
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CreditCard size={24} color="#8b5cf6" style={{ marginRight: 12 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {subscription.plan.nickname}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {formatPrice(subscription.plan.amount, subscription.plan.currency)} / {subscription.plan.interval}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ color: '#e6e6fa', mb: 2 }}>
                Abrechnungszeitraum
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Calendar size={20} color="#10b981" style={{ marginRight: 8 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Von: {formatDate(subscription.current_period_start)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Calendar size={20} color="#10b981" style={{ marginRight: 8 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Bis: {formatDate(subscription.current_period_end)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Settings size={20} />}
              onClick={handleManageSubscription}
              sx={{
                background: 'linear-gradient(45deg, #8b5cf6, #a855f7)',
                borderRadius: 3,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(45deg, #7c3aed, #9333ea)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
                }
              }}
            >
              Zahlungsmethoden verwalten
            </Button>

            {subscription.cancel_at_period_end && (
              <Alert severity="warning" sx={{ borderRadius: 3 }}>
                <Typography variant="body2">
                  Ihr Abonnement wird am {formatDate(subscription.current_period_end)} beendet.
                </Typography>
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}