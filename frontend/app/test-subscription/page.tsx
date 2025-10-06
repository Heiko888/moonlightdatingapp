"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Card, CardContent, Button, Grid, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import SSRSafeStars from '@/components/SSRSafeStars';

export default function TestSubscriptionPage() {
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = () => {
    // Lade user-subscription
    const storedSubscription = localStorage.getItem('user-subscription');
    if (storedSubscription) {
      setUserSubscription(JSON.parse(storedSubscription));
    }

    // Lade userData
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  };

  const setTestSubscription = (packageId: string) => {
    const subscriptionData = {
      id: `sub_${Date.now()}`,
      userId: 'user_123',
      packageId: packageId,
      plan: packageId === 'basic' ? 'Basic' : 
            packageId === 'premium' ? 'Premium' : 
            packageId === 'vip' ? 'VIP' : 'Kostenlos',
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      billingCycle: 'monthly',
      autoRenew: true,
      paymentMethod: 'credit_card'
    };

    localStorage.setItem('user-subscription', JSON.stringify(subscriptionData));
    
    // Aktualisiere auch userData
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.subscriptionPlan = packageId;
    localStorage.setItem('userData', JSON.stringify(userData));

    // Trigger storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'user-subscription',
      newValue: JSON.stringify(subscriptionData)
    }));

    loadSubscriptionData();
  };

  const clearSubscription = () => {
    localStorage.removeItem('user-subscription');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    delete userData.subscriptionPlan;
    localStorage.setItem('userData', JSON.stringify(userData));
    loadSubscriptionData();
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden',
      color: 'white',
    }}>
      <SSRSafeStars />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 2,
                textShadow: '0 0 30px rgba(255, 107, 157, 0.3)'
              }}
            >
              🧪 Subscription Test
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                mb: 3,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Teste die Abonnement-Status-Anzeige und Updates
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {/* Aktueller Status */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                p: 3,
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
              }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                  📊 Aktueller Status
                </Typography>
                
                {userSubscription ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip
                        label={userSubscription.plan || 'Unbekannt'}
                        color={userSubscription.packageId === 'vip' ? 'warning' : 
                               userSubscription.packageId === 'premium' ? 'secondary' : 
                               userSubscription.packageId === 'basic' ? 'primary' : 'success'}
                        sx={{ mr: 2 }}
                      />
                      <Chip
                        label={userSubscription.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                        color={userSubscription.status === 'active' ? 'success' : 'error'}
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                      Package ID: {userSubscription.packageId}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                      Start: {new Date(userSubscription.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Ende: {new Date(userSubscription.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Kein Abonnement gefunden
                  </Typography>
                )}
              </Card>
            </motion.div>
          </Grid>

          {/* Test Buttons */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                p: 3,
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
              }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                  🎮 Test-Aktionen
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setTestSubscription('basic')}
                      sx={{
                        background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1976D2, #1565C0)'
                        }
                      }}
                    >
                      ⭐ Basic
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setTestSubscription('premium')}
                      sx={{
                        background: 'linear-gradient(135deg, #9C27B0, #673AB7)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #673AB7, #512DA8)'
                        }
                      }}
                    >
                      💎 Premium
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setTestSubscription('vip')}
                      sx={{
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FFA500, #FF8C00)'
                        }
                      }}
                    >
                      👑 VIP
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={clearSubscription}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'rgba(255,255,255,0.5)',
                          background: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      🗑️ Löschen
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </motion.div>
          </Grid>

          {/* Debug Info */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                p: 3,
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
              }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                  🔍 Debug Information
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                    user-subscription:
                  </Typography>
                  <Box sx={{
                    background: 'rgba(0,0,0,0.3)',
                    p: 2,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: 'white',
                    overflow: 'auto',
                    maxHeight: '100px'
                  }}>
                    {localStorage.getItem('user-subscription') || 'Nicht gefunden'}
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                    userData:
                  </Typography>
                  <Box sx={{
                    background: 'rgba(0,0,0,0.3)',
                    p: 2,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: 'white',
                    overflow: 'auto',
                    maxHeight: '100px'
                  }}>
                    {localStorage.getItem('userData') || 'Nicht gefunden'}
                  </Box>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
