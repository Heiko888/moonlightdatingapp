"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  CreditCard, 
  Calendar, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ExternalLink,
  RefreshCcw
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [showCancelDialog, setShowCancelDialog] = useState(false);

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
        const user = JSON.parse(userData);
        const sub = JSON.parse(subscriptionData);
        
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

      const user = JSON.parse(userData);
      
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

  const handleCancelSubscription = async () => {
    try {
      // Hier würde normalerweise ein API-Call gemacht werden
      // Für Demo-Zwecke aktualisieren wir localStorage
      const subscriptionData = localStorage.getItem('userSubscription');
      if (subscriptionData) {
        const sub = JSON.parse(subscriptionData);
        sub.status = 'canceled';
        sub.cancel_at_period_end = true;
        localStorage.setItem('userSubscription', JSON.stringify(sub));
        
        setSubscription(prev => prev ? {
          ...prev,
          status: 'canceled',
          cancel_at_period_end: true
        } : null);
      }
      
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Fehler beim Kündigen:', error);
      setError('Fehler beim Kündigen des Abonnements');
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                Abonnement-Verwaltung
              </Typography>
              <Chip
                icon={getStatusIcon(subscription.status)}
                label={subscription.status === 'active' ? 'Aktiv' : 
                       subscription.status === 'canceled' ? 'Gekündigt' :
                       subscription.status === 'past_due' ? 'Überfällig' : 'Unbezahlt'}
                sx={{
                  backgroundColor: getStatusColor(subscription.status),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
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

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
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
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Aktionen
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Settings size={20} />}
                      onClick={handleManageSubscription}
                      sx={{
                        background: 'linear-gradient(45deg, #8b5cf6, #a855f7)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #7c3aed, #9333ea)'
                        }
                      }}
                    >
                      Zahlungsmethoden verwalten
                    </Button>

                    {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setShowCancelDialog(true)}
                        sx={{
                          borderColor: '#ef4444',
                          color: '#ef4444',
                          '&:hover': {
                            borderColor: '#dc2626',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)'
                          }
                        }}
                      >
                        Abonnement kündigen
                      </Button>
                    )}

                    {subscription.cancel_at_period_end && (
                      <Alert severity="warning">
                        <Typography variant="body2">
                          Ihr Abonnement wird am {formatDate(subscription.current_period_end)} beendet.
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

            <Box>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Abonnement-Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle size={20} color="#10b981" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Automatische Verlängerung"
                    secondary={subscription.cancel_at_period_end ? "Deaktiviert" : "Aktiviert"}
                    primaryTypographyProps={{ color: 'white' }}
                    secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle size={20} color="#10b981" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Nächste Abrechnung"
                    secondary={formatDate(subscription.current_period_end)}
                    primaryTypographyProps={{ color: 'white' }}
                    secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                  />
                </ListItem>
              </List>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
        <DialogTitle sx={{ color: 'white' }}>
          Abonnement kündigen
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
            Sind Sie sicher, dass Sie Ihr Abonnement kündigen möchten? 
            Sie haben weiterhin Zugang bis zum Ende des aktuellen Abrechnungszeitraums.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Nach der Kündigung können Sie Ihr Abonnement jederzeit wieder aktivieren.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleCancelSubscription}
            color="error"
            variant="contained"
          >
            Kündigen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}