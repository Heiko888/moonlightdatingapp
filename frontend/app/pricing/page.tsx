"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Alert,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { Check, Star, Diamond, Crown, ArrowRight, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AnimatedStars from '../../components/AnimatedStars';
import AnimatedMoon from '../../components/AnimatedMoon';
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
        // Fallback: Erstelle Basic-Subscription für bestehende User
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
        // Kein User eingeloggt - setze null
        setUserSubscription(null);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Abonnements:', error);
      // Bei Fehler: setze null
      setUserSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePackageSelect = async (packageId: string, cycle: 'monthly' | 'yearly') => {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        router.push('/login');
        return;
      }

      const user = JSON.parse(userData);
      
      // Erstelle neues Subscription-Objekt
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
      
      // Speichere in localStorage
      localStorage.setItem('userSubscription', JSON.stringify(newSubscription));
      
      // Aktualisiere State
      setUserSubscription(newSubscription);
      
      // Weiterleitung zum Dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Fehler beim Auswählen des Pakets:', error);
      // Bei Fehler: zeige Alert oder redirect zu Login
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
      icon: '⭐',
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
      icon: '💎',
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
      icon: '👑',
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
      <AnimatedStars />
      <AnimatedMoon size={120} position="top-right" />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Wählen Sie Ihr Paket
            </Typography>
            
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.7)',
              mb: 4,
              maxWidth: 600,
              mx: 'auto'
            }}>
              Entdecken Sie die perfekte Lösung für Ihre Human Design Reise
            </Typography>

            {/* Billing Cycle Toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value as 'monthly' | 'yearly')}
                >
                  <FormControlLabel
                    value="monthly"
                    control={<Radio sx={{ color: 'white' }} />}
                    label={<Typography sx={{ color: 'white' }}>Monatlich</Typography>}
                  />
                  <FormControlLabel
                    value="yearly"
                    control={
                      <Box>
                        <Radio sx={{ color: 'white' }} />
                        <Chip 
                          label="20% sparen" 
                          size="small" 
                          color="success"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    label={<Typography sx={{ color: 'white' }}>Jährlich</Typography>}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        </motion.div>

        {/* Package Cards */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {packages.map((pkg, index) => (
            <Grid item xs={12} md={4} key={pkg.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{
                  height: '100%',
                  background: pkg.popular 
                    ? `linear-gradient(135deg, ${pkg.color}20 0%, ${pkg.color}10 100%)`
                    : 'rgba(255, 255, 255, 0.05)',
                  border: pkg.popular ? `2px solid ${pkg.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {pkg.popular && (
                    <Chip
                      label="Beliebt"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 1,
                        background: pkg.color
                      }}
                    />
                  )}
                  
                  {getSavings(pkg) && (
                    <Chip
                      label="Sparen"
                      color="success"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 1
                      }}
                    />
                  )}

                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                        background: `${pkg.color}20`
                      }}>
                        {getPackageIcon(pkg.id)}
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
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
                        fontWeight: 'bold',
                        mb: 1
                      }}>
                        {getPrice(pkg)}
                      </Typography>
                      {getSavings(pkg) && (
                        <Typography variant="body2" sx={{ color: '#10b981' }}>
                          {getSavings(pkg)}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ flexGrow: 1, mb: 4 }}>
                      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        Enthaltene Features:
                      </Typography>
                      {pkg.features.map((feature, featureIndex) => (
                        <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Check size={16} color="#10b981" style={{ marginRight: 8 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {pkg.limitations.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
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
                        background: pkg.popular ? pkg.color : 'transparent',
                        borderColor: pkg.color,
                        color: 'white',
                        '&:hover': {
                          background: pkg.color,
                          borderColor: pkg.color
                        }
                      }}
                    >
                      {userSubscription?.packageId === pkg.id ? 'Aktuelles Paket' : 'Auswählen'}
                      {userSubscription?.packageId !== pkg.id && <ArrowRight size={20} style={{ marginLeft: 8 }} />}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ color: 'white', textAlign: 'center', mb: 4 }}>
                Feature-Vergleich
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Basic
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {['Chart-Berechnung', 'Mondkalender (7 Tage)', 'Community', 'Basis-Support'].map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Check size={16} color="#10b981" style={{ marginRight: 8 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Premium
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {['Alle Basic-Features', 'Erweiterte Analytics', 'Vollständiger Mondkalender', 'Coaching', 'Werbefrei'].map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Check size={16} color="#10b981" style={{ marginRight: 8 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    VIP
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {['Alle Premium-Features', 'VIP-Community', 'Persönlicher Coach', 'Unbegrenzte API', '1:1 Beratung'].map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Check size={16} color="#10b981" style={{ marginRight: 8 }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Alert severity="info" sx={{ mt: 4, background: 'rgba(59, 130, 246, 0.1)' }}>
            <Typography variant="body1">
              <strong>30-Tage Geld-zurück-Garantie:</strong> Sie können Ihr Abonnement jederzeit innerhalb der ersten 30 Tage kündigen und erhalten eine vollständige Rückerstattung. Keine Fragen gestellt.
            </Typography>
          </Alert>
        </motion.div>
      </Container>
    </Box>
  );
}
