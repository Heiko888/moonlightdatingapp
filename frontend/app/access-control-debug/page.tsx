"use client";

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Alert, Chip, Grid, Paper } from '@mui/material';
import { Crown, Diamond, Star, Lock, RefreshCw, RotateCcw } from 'lucide-react';
import UnifiedPageLayout from '@/components/UnifiedPageLayout';
import { useSubscription } from '../../hooks/useSubscription';

export default function AccessControlDebugPage() {
  const { subscription, isLoading, forceSync } = useSubscription();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [cookieData, setCookieData] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  const loadAllData = () => {
    // localStorage
    try {
      const stored = localStorage.getItem('user-subscription');
      setLocalStorageData(stored ? JSON.parse(stored) : null);
    } catch (e) {
      setLocalStorageData({ error: 'Failed to parse localStorage' });
    }

    // Cookies
    try {
      const cookieSubscription = document.cookie
        .split('; ')
        .find(row => row.startsWith('user-subscription='))
        ?.split('=')[1];
      setCookieData(cookieSubscription ? JSON.parse(decodeURIComponent(cookieSubscription)) : null);
    } catch (e) {
      setCookieData({ error: 'Failed to parse cookies' });
    }

    // Debug Info
    setDebugInfo({
      userAgent: navigator.userAgent,
      cookies: document.cookie,
      localStorageKeys: Object.keys(localStorage),
      timestamp: new Date().toISOString()
    });
  };

  const setTestSubscription = (packageId: string) => {
    const testSubscription = {
      id: `sub_test_${Date.now()}`,
      userId: 'user_123',
      packageId: packageId,
      plan: packageId.charAt(0).toUpperCase() + packageId.slice(1),
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      billingCycle: 'monthly',
      autoRenew: true,
      paymentMethod: 'test_card'
    };

    // Set in localStorage
    localStorage.setItem('user-subscription', JSON.stringify(testSubscription));
    
    // Set in cookies
    document.cookie = `user-subscription=${encodeURIComponent(JSON.stringify(testSubscription))}; path=/; max-age=86400`;
    
    // Reload data
    loadAllData();
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Auto-refresh when subscription changes
  useEffect(() => {
    if (subscription) {
      setSubscriptionData(subscription);
      loadAllData();
    }
  }, [subscription]);

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'free': return <Lock size={24} />;
      case 'basic': return <Star size={24} />;
      case 'premium': return <Diamond size={24} />;
      case 'vip': return <Crown size={24} />;
      default: return <Lock size={24} />;
    }
  };

  const getPackageColor = (packageId: string) => {
    switch (packageId) {
      case 'free': return '#6b7280';
      case 'basic': return '#3b82f6';
      case 'premium': return '#8b5cf6';
      case 'vip': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <UnifiedPageLayout
      title="🔧 Access Control Debug"
      subtitle="Debug-Tool für Subscription und Access Control"
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Controls */}
          <Grid item xs={12}>
            <Card sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  🎛️ Test-Subscriptions setzen
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    onClick={() => setTestSubscription('free')}
                    sx={{ background: '#6b7280' }}
                  >
                    Free
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setTestSubscription('basic')}
                    sx={{ background: '#3b82f6' }}
                  >
                    Basic
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setTestSubscription('premium')}
                    sx={{ background: '#8b5cf6' }}
                  >
                    Premium
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setTestSubscription('vip')}
                    sx={{ background: '#f59e0b' }}
                  >
                    VIP
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={loadAllData}
                    startIcon={<RefreshCw size={16} />}
                    sx={{ color: 'white', borderColor: 'white' }}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={forceSync}
                    startIcon={<RotateCcw size={16} />}
                    sx={{ color: 'white', borderColor: 'white' }}
                  >
                    Force Sync
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* localStorage Data */}
          <Grid item xs={12} md={6}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  📦 localStorage
                </Typography>
                {localStorageData ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {getPackageIcon(localStorageData.packageId)}
                      <Chip
                        label={localStorageData.packageId}
                        sx={{
                          backgroundColor: getPackageColor(localStorageData.packageId),
                          color: 'white'
                        }}
                      />
                    </Box>
                    <pre style={{ 
                      background: 'rgba(0,0,0,0.3)', 
                      padding: '10px', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: 'white',
                      overflow: 'auto'
                    }}>
                      {JSON.stringify(localStorageData, null, 2)}
                    </pre>
                  </Box>
                ) : (
                  <Alert severity="warning">Keine localStorage-Daten gefunden</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Cookie Data */}
          <Grid item xs={12} md={6}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  🍪 Cookies
                </Typography>
                {cookieData ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {getPackageIcon(cookieData.packageId)}
                      <Chip
                        label={cookieData.packageId}
                        sx={{
                          backgroundColor: getPackageColor(cookieData.packageId),
                          color: 'white'
                        }}
                      />
                    </Box>
                    <pre style={{ 
                      background: 'rgba(0,0,0,0.3)', 
                      padding: '10px', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: 'white',
                      overflow: 'auto'
                    }}>
                      {JSON.stringify(cookieData, null, 2)}
                    </pre>
                  </Box>
                ) : (
                  <Alert severity="warning">Keine Cookie-Daten gefunden</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Current Hook Status */}
          <Grid item xs={12}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  🎣 useSubscription Hook Status
                </Typography>
                {subscription ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {getPackageIcon(subscription.packageId)}
                      <Chip
                        label={subscription.packageId}
                        sx={{
                          backgroundColor: getPackageColor(subscription.packageId),
                          color: 'white'
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Loading: {isLoading ? 'Yes' : 'No'}
                      </Typography>
                    </Box>
                    <pre style={{ 
                      background: 'rgba(0,0,0,0.3)', 
                      padding: '10px', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: 'white',
                      overflow: 'auto'
                    }}>
                      {JSON.stringify(subscription, null, 2)}
                    </pre>
                  </Box>
                ) : (
                  <Alert severity="warning">
                    {isLoading ? 'Loading subscription...' : 'No subscription found'}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Debug Info */}
          <Grid item xs={12}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  🔍 Debug-Informationen
                </Typography>
                <pre style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '10px', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: 'white',
                  overflow: 'auto',
                  maxHeight: '300px'
                }}>
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </Grid>

          {/* Test Links */}
          <Grid item xs={12}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  🔗 Test-Links
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    href="/coaching"
                    component="a"
                    sx={{ color: 'white', borderColor: 'white' }}
                  >
                    /coaching
                  </Button>
                  <Button
                    variant="outlined"
                    href="/dashboard"
                    component="a"
                    sx={{ color: 'white', borderColor: 'white' }}
                  >
                    /dashboard
                  </Button>
                  <Button
                    variant="outlined"
                    href="/pricing"
                    component="a"
                    sx={{ color: 'white', borderColor: 'white' }}
                  >
                    /pricing
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </UnifiedPageLayout>
  );
}
