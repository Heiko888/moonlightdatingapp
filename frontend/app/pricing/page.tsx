"use client";

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Check, Star, Diamond, Crown, ArrowRight, Heart, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UnifiedPageLayout from '@/components/UnifiedPageLayout';

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
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadUserSubscription();
  }, []);

  const loadUserSubscription = async () => {
    try {
      // Prüfe beide localStorage Keys
      let subscriptionData = localStorage.getItem('userSubscription');
      if (!subscriptionData) {
        subscriptionData = localStorage.getItem('user-subscription');
      }
      
      if (subscriptionData) {
        const subscription = JSON.parse(subscriptionData);
        setUserSubscription(subscription);
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
      // Prüfe ob User eingeloggt ist (mehrere mögliche Keys)
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      let userData = localStorage.getItem('userData');
      const storedSubscription = localStorage.getItem('userSubscription') || localStorage.getItem('user-subscription');
      
      console.log('Login-Check (Pricing):', { 
        token: !!token, 
        userId: !!userId, 
        userData: !!userData, 
        userSubscription: !!userSubscription,
        storedSubscription: !!storedSubscription
      });
      
      // User ist eingeloggt wenn mindestens EINE dieser Bedingungen erfüllt ist
      const isLoggedIn = !!(userSubscription || storedSubscription || token || userId || userData);
      
      if (!isLoggedIn) {
        // Kein Login gefunden
        console.error('Kein Login gefunden - leite zu Login');
        alert('⚠️ Bitte melde dich zuerst an!');
        router.push('/login');
        return;
      }
      
      console.log('✅ User ist eingeloggt');

      // Hole User ID
      let userIdValue = userId;
      if (!userIdValue && userData) {
        try {
          const user = JSON.parse(userData);
          userIdValue = user.id;
        } catch (e) {
          console.error('Fehler beim Parsen von userData', e);
        }
      }
      if (!userIdValue && userSubscription) {
        userIdValue = userSubscription.userId;
      }
      if (!userIdValue) {
        userIdValue = 'user-' + Date.now();
      }
      
      console.log('User ID:', userIdValue);
      
      const newSubscription = {
        userId: userIdValue,
        packageId: packageId,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + (cycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true,
        paymentMethod: 'credit_card',
        billingCycle: cycle
      };
      
      // Speichere in beiden Keys (für Kompatibilität)
      localStorage.setItem('userSubscription', JSON.stringify(newSubscription));
      localStorage.setItem('user-subscription', JSON.stringify(newSubscription));
      
      setUserSubscription(newSubscription);
      
      // Erfolgsmeldung mit Upgrade/Downgrade Info
      const packageNames = { basic: 'Basic', premium: 'Premium', vip: 'VIP' } as const;
      alert(`✅ Paket zu ${packageNames[packageId as keyof typeof packageNames]} gewechselt!`);
      
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Fehler beim Auswählen des Pakets:', error);
      alert('Fehler beim Paketwechsel. Bitte versuchen Sie es erneut.');
    }
  };

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'basic': return <Star size={24} />;
      case 'premium': return <Diamond size={24} />;
      case 'vip': return <Crown size={24} />;
      default: return <Heart size={24} />;
    }
  };

  const getPackageColor = (packageId: string) => {
    switch (packageId) {
      case 'basic': return '#4ecdc4';
      case 'premium': return '#ff6b9d';
      case 'vip': return '#ff6b9d';
      default: return '#6b7280';
    }
  };

  const packages = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfekt für den Einstieg',
      priceMonthly: 9.99,
      priceYearly: 99.99,
      features: [
        'Human Design Chart',
        'Grundlegende Analysen',
        'Mondkalender',
        'Community-Zugang',
        'Mobile App'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Für ernsthafte Human Design Enthusiasten',
      priceMonthly: 19.99,
      priceYearly: 199.99,
      features: [
        'Alle Basic Features',
        'Erweiterte Chart-Analysen',
        'Dating-System',
        'Persönliche Insights',
        'Priority Support',
        'Exklusive Inhalte'
      ],
      popular: true
    },
    {
      id: 'vip',
      name: 'VIP',
      description: 'Das ultimative Human Design Erlebnis',
      priceMonthly: 49.99,
      priceYearly: 499.99,
      features: [
        'Alle Premium Features',
        '1:1 Coaching Sessions',
        'VIP Community',
        'Persönlicher Coach',
        'Exklusive Events',
        'Lifetime Updates',
        'White Glove Service'
      ],
      popular: false
    }
  ];

  const getPrice = (pkg: any) => {
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

  if (isLoading) {
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ 
            color: 'white',
            background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            💎 Lade Premium Pakete...
          </Typography>
        </Box>
      </Box>
    );
  }

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
      overflow: 'hidden'
    }}>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            💎 Premium Pakete
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontWeight: 300,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Wähle das perfekte Paket für deine Human Design Journey. Alle Pakete enthalten Zugang zu unserer exklusiven Community.
          </Typography>
        </Box>

        {/* Billing Cycle Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 6,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              p: 2,
              maxWidth: 400,
              mx: 'auto'
            }}>
              <Button
                variant={billingCycle === 'monthly' ? 'contained' : 'text'}
                onClick={() => setBillingCycle('monthly')}
                sx={{
                  background: billingCycle === 'monthly' ? 'linear-gradient(45deg, #4ecdc4, #44a08d)' : 'transparent',
                  color: billingCycle === 'monthly' ? 'white' : 'rgba(255,255,255,0.7)',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  mr: 1,
                  '&:hover': {
                    background: billingCycle === 'monthly' ? 'linear-gradient(45deg, #44a08d, #4ecdc4)' : 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Monatlich
              </Button>
              <Button
                variant={billingCycle === 'yearly' ? 'contained' : 'text'}
                onClick={() => setBillingCycle('yearly')}
                sx={{
                  background: billingCycle === 'yearly' ? 'linear-gradient(45deg, #ff6b9d, #c44569)' : 'transparent',
                  color: billingCycle === 'yearly' ? 'white' : 'rgba(255,255,255,0.7)',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  ml: 1,
                  '&:hover': {
                    background: billingCycle === 'yearly' ? 'linear-gradient(45deg, #c44569, #ff6b9d)' : 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Jährlich
                <Chip 
                  label="20% sparen" 
                  size="small" 
                  sx={{ 
                    ml: 1, 
                    background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
                    color: '#1a1a2e',
                    fontWeight: 700,
                    fontSize: '0.7rem'
                  }} 
                />
              </Button>
            </Box>
          </motion.div>

          {/* Pricing Cards */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {packages.map((pkg, index) => (
              <Grid item xs={12} md={4} key={pkg.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={pkg.popular ? 12 : 6}
                    sx={{
                      background: pkg.popular 
                        ? 'linear-gradient(135deg, rgba(255, 107, 157, 0.1) 0%, rgba(196, 69, 105, 0.1) 100%)'
                        : 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: pkg.popular 
                        ? '2px solid rgba(255, 107, 157, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 4,
                      p: 4,
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {pkg.popular && (
                      <Box sx={{
                        position: 'absolute',
                        top: -1,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
                        color: 'white',
                        px: 3,
                        py: 1,
                        borderRadius: '0 0 12px 12px',
                        fontSize: '0.9rem',
                        fontWeight: 700
                      }}>
                        🔥 Beliebt
                      </Box>
                    )}

                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mb: 2,
                        color: getPackageColor(pkg.id)
                      }}>
                        {getPackageIcon(pkg.id)}
                      </Box>
                      <Typography variant="h5" sx={{ 
                        color: 'white', 
                        fontWeight: 700, 
                        mb: 1,
                        fontSize: '1.5rem'
                      }}>
                        {pkg.name}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255,255,255,0.7)',
                        mb: 3
                      }}>
                        {pkg.description}
                      </Typography>
                      <Typography variant="h3" sx={{ 
                        color: getPackageColor(pkg.id),
                        fontWeight: 800,
                        mb: 1
                      }}>
                        {getPrice(pkg)}
                      </Typography>
                      {getSavings(pkg) && (
                        <Chip 
                          label={getSavings(pkg)} 
                          size="small"
                          sx={{ 
                            background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ mb: 4 }}>
                      {pkg.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 2,
                            py: 1
                          }}>
                            <Check size={20} color={getPackageColor(pkg.id)} style={{ marginRight: 12 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {feature}
                            </Typography>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        component={Link}
                        href={`/packages/${pkg.id}`}
                        sx={{
                          borderColor: getPackageColor(pkg.id),
                          color: getPackageColor(pkg.id),
                          '&:hover': {
                            borderColor: getPackageColor(pkg.id),
                            background: `${getPackageColor(pkg.id)}15`,
                            transform: 'translateY(-2px)'
                          },
                          borderRadius: 3,
                          fontWeight: 600,
                          py: 1.5
                        }}
                      >
                        📋 Alle Details ansehen
                      </Button>
                      
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={() => handlePackageSelect(pkg.id, billingCycle)}
                        disabled={mounted && userSubscription?.packageId === pkg.id}
                        sx={{
                          background: (mounted && userSubscription?.packageId === pkg.id)
                            ? 'linear-gradient(45deg, #6b7280, #9ca3af)'
                            : `linear-gradient(45deg, ${getPackageColor(pkg.id)}, ${getPackageColor(pkg.id)}CC)`,
                          '&:hover': {
                            background: (mounted && userSubscription?.packageId === pkg.id)
                              ? 'linear-gradient(45deg, #6b7280, #9ca3af)'
                              : `linear-gradient(45deg, ${getPackageColor(pkg.id)}DD, ${getPackageColor(pkg.id)}EE)`,
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                          },
                          borderRadius: 3,
                          fontWeight: 700,
                          py: 2,
                          fontSize: '1.1rem'
                        }}
                      >
                        {mounted && userSubscription?.packageId === pkg.id ? (
                          'Aktuelles Paket'
                        ) : (
                          <>
                            {pkg.id === 'vip' ? 'VIP werden' : `${pkg.name} wählen`}
                            <ArrowRight size={20} style={{ marginLeft: 8 }} />
                          </>
                        )}
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Features Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Paper sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              p: 4
            }}>
              <Typography variant="h5" sx={{ 
                color: '#ff6b9d', 
                textAlign: 'center', 
                mb: 4, 
                fontWeight: 700 
              }}>
                🎯 Warum Human Design Premium?
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Heart size={48} color="#ff6b9d" style={{ marginBottom: 16 }} />
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                      Persönliches Wachstum
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Entdecke deine einzigartige Human Design und verstehe dich selbst besser
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Users size={48} color="#4ecdc4" style={{ marginBottom: 16 }} />
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                      Community & Dating
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Finde Gleichgesinnte und baue tiefe Verbindungen auf
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Star size={48} color="#ff6b9d" style={{ marginBottom: 16 }} />
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                      Exklusive Inhalte
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Zugang zu Premium-Features und exklusiven Coaching-Sessions
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* Current Subscription Info */}
          {userSubscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Paper sx={{
                background: 'rgba(78, 205, 196, 0.1)',
                border: '1px solid rgba(78, 205, 196, 0.3)',
                borderRadius: 3,
                p: 3,
                mt: 4
              }}>
                <Typography variant="h6" sx={{ color: '#4ecdc4', mb: 2, fontWeight: 700 }}>
                  ✅ Dein aktuelles Abonnement
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                  <strong>Paket:</strong> {userSubscription.packageId.charAt(0).toUpperCase() + userSubscription.packageId.slice(1)}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                  <strong>Status:</strong> {userSubscription.status}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  <strong>Läuft ab:</strong> {new Date(userSubscription.endDate).toLocaleDateString('de-DE')}
                </Typography>
              </Paper>
            </motion.div>
          )}
      </Container>
    </Box>
  );
}