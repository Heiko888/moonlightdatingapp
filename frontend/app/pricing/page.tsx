"use client";

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Check, Star, Diamond, Crown, ArrowRight, Heart, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// UserSubscription Interface
interface UserSubscription {
  userId: string;
  packageId: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: string;
  billingCycle: string;
}

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserSubscription();
  }, []);

  const loadUserSubscription = async () => {
    try {
      const userData = localStorage.getItem('userData');
      const subscriptionData = localStorage.getItem('userSubscription');
      
      if (userData && subscriptionData) {
        const user = JSON.parse(userData);
        const subscription = JSON.parse(subscriptionData);
        setUserSubscription(subscription);
      } else if (userData) {
        const user = JSON.parse(userData);
        const basicSubscription = {
          userId: user.id,
          packageId: 'basic',
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          autoRenew: false,
          paymentMethod: 'none',
          billingCycle: 'monthly'
        };
        localStorage.setItem('userSubscription', JSON.stringify(basicSubscription));
        setUserSubscription(basicSubscription);
      } else {
        setUserSubscription(null);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Abonnements:', error);
      setUserSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePackageSelect = async (packageId: string, cycle: 'monthly' | 'yearly') => {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        router.push('/register');
        return;
      }

      const user = JSON.parse(userData);
      
      const newSubscription = {
        userId: user.id,
        packageId: packageId,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + (cycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true,
        paymentMethod: 'credit_card',
        billingCycle: cycle
      };
      
      localStorage.setItem('userSubscription', JSON.stringify(newSubscription));
      setUserSubscription(newSubscription);
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Fehler beim Auswählen des Pakets:', error);
      alert('Fehler beim Auswählen des Pakets. Bitte versuchen Sie es erneut.');
    }
  };

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'basic': return <Star size={24} />;
      case 'premium': return <Diamond size={24} />;
      case 'vip': return <Crown size={24} />;
      default: return <Star size={24} />;
    }
  };

  const getPackageColor = (packageId: string) => {
    const colors = {
      basic: '#6b7280',
      premium: '#8b5cf6',
      vip: '#f59e0b'
    };
    return colors[packageId as keyof typeof colors] || '#6b7280';
  };

  const packages = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfekt für den Einstieg',
      price: 'Kostenlos',
      priceMonthly: 0,
      priceYearly: 0,
      color: '#6b7280',
      features: [
        'Grundlegende Chart-Berechnung',
        'Mondkalender (7 Tage)',
        'Community-Zugang',
        'Basis-Matching',
        'Standard-Support'
      ],
      limitations: [
        'Begrenzte Chart-Details',
        'Werbung in der App'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Erweiterte Features',
      price: '19,99€/Monat',
      priceMonthly: 19.99,
      priceYearly: 199.99,
      color: '#8b5cf6',
      features: [
        'Alle Basic-Features',
        'Erweiterte Chart-Analyse',
        'Vollständiger Mondkalender',
        'Coaching-Zugang',
        'Werbefreie Erfahrung',
        'Prioritäts-Support'
      ],
      limitations: [
        'Keine VIP-Features'
      ],
      popular: true
    },
    {
      id: 'vip',
      name: 'VIP',
      description: 'Das ultimative Erlebnis',
      price: '49,99€/Monat',
      priceMonthly: 49.99,
      priceYearly: 499.99,
      color: '#f59e0b',
      features: [
        'Alle Premium-Features',
        'Exklusive VIP-Community',
        'Persönlicher Coach',
        'Unbegrenzte API-Zugriffe',
        'Früher Zugang zu Features',
        '1:1 Beratung'
      ],
      limitations: [],
      popular: false
    }
  ];

  const getPrice = (pkg: any) => {
    if (pkg.id === 'basic') return 'Kostenlos';
    const price = billingCycle === 'yearly' ? pkg.priceYearly : pkg.priceMonthly;
    const cycle = billingCycle === 'yearly' ? '/Jahr' : '/Monat';
    return `${price.toFixed(2)}€${cycle}`;
  };

  const getSavings = (pkg: any) => {
    if (pkg.id === 'basic' || billingCycle === 'monthly') return null;
    const monthlyTotal = pkg.priceMonthly * 12;
    const savings = monthlyTotal - pkg.priceYearly;
    return `Sie sparen ${savings.toFixed(2)}€ pro Jahr`;
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h1" sx={{
              color: '#e6e6fa',
              textShadow: '0 0 20px rgba(230, 230, 250, 0.8), 0 0 40px rgba(230, 230, 250, 0.6)',
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '4rem' }
            }}>
              Wählen Sie Ihr Paket
            </Typography>
            
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.8)',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}>
              Entdecken Sie die perfekte Lösung für Ihre kosmische Reise
            </Typography>

            {/* Billing Cycle Toggle */}
            <Paper sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)',
              p: 2,
              display: 'inline-block'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant={billingCycle === 'monthly' ? 'contained' : 'outlined'}
                  onClick={() => setBillingCycle('monthly')}
                  sx={{
                    background: billingCycle === 'monthly' 
                      ? 'linear-gradient(135deg, #8b5cf6, #a855f7)' 
                      : 'transparent',
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      background: billingCycle === 'monthly' 
                        ? 'linear-gradient(135deg, #a855f7, #8b5cf6)' 
                        : 'rgba(255,255,255,0.1)',
                      borderColor: 'rgba(255,255,255,0.5)'
                    }
                  }}
                >
                  Monatlich
                </Button>
                <Button
                  variant={billingCycle === 'yearly' ? 'contained' : 'outlined'}
                  onClick={() => setBillingCycle('yearly')}
                  sx={{
                    background: billingCycle === 'yearly' 
                      ? 'linear-gradient(135deg, #8b5cf6, #a855f7)' 
                      : 'transparent',
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    position: 'relative',
                    '&:hover': {
                      background: billingCycle === 'yearly' 
                        ? 'linear-gradient(135deg, #a855f7, #8b5cf6)' 
                        : 'rgba(255,255,255,0.1)',
                      borderColor: 'rgba(255,255,255,0.5)'
                    }
                  }}
                >
                  Jährlich
                  <Box sx={{
                    ml: 1,
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    fontSize: '0.7rem',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1
                  }}>
                    20% sparen
                  </Box>
                </Button>
              </Box>
            </Paper>
          </Box>
        </motion.div>

        {/* Package Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {packages.map((pkg, index) => (
            <Grid item xs={12} md={4} key={pkg.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper sx={{
                  height: '100%',
                  background: pkg.popular 
                    ? `linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))`
                    : 'rgba(255, 255, 255, 0.05)',
                  border: pkg.popular ? `2px solid #8b5cf6` : '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    border: pkg.popular ? `2px solid #a855f7` : '1px solid rgba(255, 255, 255, 0.3)'
                  }
                }}>
                  {pkg.popular && (
                    <Box sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 1,
                      background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                      color: 'white',
                      fontWeight: 600,
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.8rem'
                    }}>
                      Beliebt
                    </Box>
                  )}
                  
                  {getSavings(pkg) && (
                    <Box sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      zIndex: 1,
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#22c55e',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.8rem'
                    }}>
                      Sparen
                    </Box>
                  )}

                  <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ 
                        color: pkg.color, 
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: `${pkg.color}20`,
                        border: `1px solid ${pkg.color}40`
                      }}>
                        {getPackageIcon(pkg.id)}
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                          {pkg.name}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {pkg.description}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h2" sx={{ 
                        color: pkg.color, 
                        fontWeight: 800,
                        mb: 1,
                        textShadow: `0 0 20px ${pkg.color}40`
                      }}>
                        {getPrice(pkg)}
                      </Typography>
                      {getSavings(pkg) && (
                        <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 600 }}>
                          {getSavings(pkg)}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ flexGrow: 1, mb: 4 }}>
                      <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                        Enthaltene Features:
                      </Typography>
                      {pkg.features.map((feature, featureIndex) => (
                        <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <Check size={16} color="#22c55e" style={{ marginRight: 12 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {pkg.limitations.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, fontWeight: 600 }}>
                          Einschränkungen:
                        </Typography>
                        {pkg.limitations.map((limitation, limitationIndex) => (
                          <Typography key={limitationIndex} variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            • {limitation}
                          </Typography>
                        ))}
                      </Box>
                    )}

                    <Button
                      variant={pkg.popular ? "contained" : "outlined"}
                      fullWidth
                      size="large"
                      onClick={() => handlePackageSelect(pkg.id, billingCycle)}
                      sx={{
                        background: pkg.popular 
                          ? 'linear-gradient(135deg, #8b5cf6, #a855f7)' 
                          : 'transparent',
                        borderColor: pkg.color,
                        color: 'white',
                        py: 2,
                        borderRadius: 3,
                        fontWeight: 600,
                        '&:hover': {
                          background: pkg.popular 
                            ? 'linear-gradient(135deg, #a855f7, #8b5cf6)' 
                            : pkg.color,
                          borderColor: pkg.color,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 25px ${pkg.color}30`
                        }
                      }}
                    >
                      {userSubscription?.packageId === pkg.id ? 'Aktuelles Paket' : 'Auswählen'}
                      {userSubscription?.packageId !== pkg.id && <ArrowRight size={20} style={{ marginLeft: 8 }} />}
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
              Noch nicht sicher? Starten Sie kostenlos!
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)',
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #e55a8a, #3bb5b0)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)'
                  }
                }}
              >
                <Heart size={20} style={{ marginRight: 8 }} />
                Kostenlos registrieren
              </Button>
              <Button
                component={Link}
                href="/community-info"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Users size={20} style={{ marginRight: 8 }} />
                Mehr erfahren
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}