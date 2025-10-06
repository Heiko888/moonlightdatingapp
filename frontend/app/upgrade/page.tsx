"use client";
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { Crown, Zap, Star, Check, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SSRSafeStars from '@/components/SSRSafeStars';

export default function UpgradePage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState('basic');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lade aktuellen Plan aus localStorage
    const userData = localStorage.getItem('userData');
    const userSubscription = localStorage.getItem('userSubscription');
    
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentPlan(user.subscriptionPlan || 'basic');
    } else if (userSubscription) {
      const subscription = JSON.parse(userSubscription);
      setCurrentPlan(subscription.plan || 'basic');
    }
  }, []);

  const plans = {
    basic: {
      name: "Basic",
      price: "0",
      period: "monatlich",
      description: "Perfekt zum Einstieg",
      icon: <Star size={24} />,
      color: "linear-gradient(135deg, #667eea, #764ba2)",
      features: [
        "Human Design Chart",
        "Vollständiger Mondkalender",
        "Community Zugang",
        "Basis-Matching",
        "Bis zu 3 Profilbilder"
      ],
      limitations: [
        "Begrenzte Matches pro Tag",
        "Keine erweiterten Analysen"
      ],
      popular: false,
      cta: "Aktueller Plan",
      disabled: true
    },
    premium: {
      name: "Premium",
      price: "19",
      period: "monatlich",
      description: "Für ernsthafte Suchende",
      icon: <Crown size={24} />,
      color: "linear-gradient(135deg, #FFD700, #FFA500)",
    features: [
      "Alle Basic Features",
      "Unbegrenzte Matches",
      "Erweiterte Kompatibilitäts-Analyse",
      "Persönliche Readings",
      "Bis zu 10 Profilbilder",
      "Prioritäts-Support",
      "Chart-Vergleichs-Tool"
    ],
      limitations: [],
      popular: true,
      cta: currentPlan === 'premium' ? "Aktueller Plan" : "Zu Premium upgraden",
      disabled: currentPlan === 'premium'
    },
    vip: {
      name: "VIP",
      price: "49",
      period: "monatlich",
      description: "Das komplette Erlebnis",
      icon: <Zap size={24} />,
      color: "linear-gradient(135deg, #ff6b9d, #c44569)",
      features: [
        "Alle Premium Features",
        "1:1 Coaching Sessions",
        "Reiki & Energiearbeit",
        "Unbegrenzte Profilbilder",
        "VIP Community Zugang",
        "Persönlicher Concierge",
        "Früher Zugang zu neuen Features",
        "Exklusive Retreats"
      ],
      limitations: [],
      popular: false,
      cta: currentPlan === 'vip' ? "Aktueller Plan" : "Zu VIP upgraden",
      disabled: currentPlan === 'vip'
    }
  };

  const handleUpgrade = async (planName: string) => {
    if (planName === currentPlan) return;
    
    setLoading(true);
    
    try {
      // Simuliere Upgrade-Prozess
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aktualisiere localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      userData.subscriptionPlan = planName;
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Erstelle vollständige Subscription-Daten
      const subscriptionData = {
        id: `sub_${Date.now()}`,
        userId: userData.userId || 'user_123',
        packageId: planName,
        plan: plans[planName as keyof typeof plans].name,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 Tage
        billingCycle: 'monthly',
        autoRenew: true,
        paymentMethod: 'credit_card',
        features: plans[planName as keyof typeof plans].features
      };
      
      localStorage.setItem('userSubscription', JSON.stringify(subscriptionData));
      
      // Trigger storage event für andere Tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'user-subscription',
        newValue: JSON.stringify(subscriptionData)
      }));
      
      setCurrentPlan(planName);
      
      // Weiterleitung zum Dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Upgrade-Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='80' cy='80' r='1'/%3E%3Ccircle cx='40' cy='60' r='0.5'/%3E%3Ccircle cx='60' cy='40' r='0.5'/%3E%3Ccircle cx='90' cy='10' r='0.8'/%3E%3Ccircle cx='10' cy='90' r='0.8'/%3E%3C/g%3E%3C/svg%3E")
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <SSRSafeStars count={30} minSize={1} maxSize={4} opacity={0.6} animation={true} />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
        {/* Header */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{
              color: '#FFD700',
              fontWeight: 'bold',
              mb: 3,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              🚀 Upgrade dein Erlebnis
            </Typography>
            
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.8)',
              mb: 4,
              maxWidth: 600,
              mx: 'auto'
            }}>
              Entdecke alle Premium-Features und finde die Liebe, die wirklich zu dir passt
            </Typography>
            
            {currentPlan !== 'basic' && (
              <Alert severity="info" sx={{
                bgcolor: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                color: '#FFD700',
                maxWidth: 400,
                mx: 'auto',
                mb: 4
              }}>
                Aktueller Plan: <strong>{plans[currentPlan as keyof typeof plans].name}</strong>
              </Alert>
            )}
          </Box>
        </motion.div>

        {/* Pricing Cards */}
        <Grid container spacing={4} justifyContent="center">
          {Object.entries(plans).map(([planKey, plan], index) => (
            <Grid item xs={12} md={4} key={planKey}>
              <motion.div
                
                
                
              >
                <Card sx={{
                  background: plan.popular 
                    ? 'rgba(255, 215, 0, 0.1)' 
                    : 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: plan.popular 
                    ? '2px solid #FFD700' 
                    : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: plan.popular 
                      ? '0 20px 40px rgba(255, 215, 0, 0.3)' 
                      : '0 20px 40px rgba(0,0,0,0.3)',
                    border: plan.popular 
                      ? '2px solid #FFD700' 
                      : '1px solid rgba(255, 215, 0, 0.3)'
                  }
                }}>
                  {/* Popular Badge */}
                  {plan.popular && (
                    <Box sx={{
                      position: 'absolute',
                      top: -1,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                      color: '#000',
                      px: 3,
                      py: 1,
                      borderRadius: '0 0 12px 12px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      zIndex: 2
                    }}>
                      <Shield size={16} style={{ marginRight: 8, display: 'inline' }} />
                      Beliebt
                    </Box>
                  )}
                  
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Plan Header */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: plan.color,
                        mb: 2,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                      }}>
                        {plan.icon}
                      </Box>
                      
                      <Typography variant="h4" sx={{ 
                        color: plan.popular ? '#FFD700' : 'white', 
                        fontWeight: 'bold',
                        mb: 1
                      }}>
                        {plan.name}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255,255,255,0.7)',
                        mb: 2
                      }}>
                        {plan.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                        <Typography variant="h2" sx={{ 
                          color: plan.popular ? '#FFD700' : 'white',
                          fontWeight: 'bold',
                          mr: 1
                        }}>
                          €{plan.price}
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(255,255,255,0.6)'
                        }}>
                          /{plan.period}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Features */}
                    <Box sx={{ flexGrow: 1, mb: 4 }}>
                      <Box sx={{ mb: 2 }}>
                        {plan.features.map((feature, featureIndex) => (
                          <Box key={featureIndex} sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 1.5,
                            py: 0.5
                          }}>
                            <Check size={16} style={{ 
                              color: '#10b981', 
                              marginRight: 12,
                              flexShrink: 0
                            }} />
                            <Typography variant="body2" sx={{ 
                              color: 'rgba(255,255,255,0.9)',
                              lineHeight: 1.4
                            }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      
                      {plan.limitations.length > 0 && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                          {plan.limitations.map((limitation, limitIndex) => (
                            <Box key={limitIndex} sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              mb: 1,
                              py: 0.5
                            }}>
                              <Box sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                border: '1px solid rgba(255,255,255,0.3)',
                                marginRight: 12,
                                flexShrink: 0
                              }} />
                              <Typography variant="body2" sx={{ 
                                color: 'rgba(255,255,255,0.5)',
                                lineHeight: 1.4
                              }}>
                                {limitation}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                    
                    {/* CTA Button */}
                    <Button
                      onClick={() => handleUpgrade(planKey)}
                      variant="contained"
                      fullWidth
                      disabled={plan.disabled || loading}
                      sx={{
                        background: plan.disabled 
                          ? 'rgba(255,255,255,0.1)' 
                          : plan.popular 
                            ? 'linear-gradient(45deg, #FFD700, #FFA500)' 
                            : 'linear-gradient(45deg, #667eea, #764ba2)',
                        color: plan.disabled 
                          ? 'rgba(255,255,255,0.5)' 
                          : plan.popular ? '#000' : 'white',
                        fontWeight: 'bold',
                        py: 2,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        boxShadow: plan.disabled 
                          ? 'none' 
                          : plan.popular 
                            ? '0 8px 20px rgba(255, 215, 0, 0.3)' 
                            : '0 8px 20px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          background: plan.disabled 
                            ? 'rgba(255,255,255,0.1)' 
                            : plan.popular 
                              ? 'linear-gradient(45deg, #FFA500, #FFD700)' 
                              : 'linear-gradient(45deg, #764ba2, #667eea)',
                          transform: plan.disabled ? 'none' : 'translateY(-2px)',
                          boxShadow: plan.disabled 
                            ? 'none' 
                            : plan.popular 
                              ? '0 12px 25px rgba(255, 215, 0, 0.4)' 
                              : '0 12px 25px rgba(102, 126, 234, 0.4)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? 'Wird verarbeitet...' : plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
        
        {/* Pricing Note */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 600,
              mx: 'auto'
            }}>
              Alle Pläne beinhalten eine 14-tägige Geld-zurück-Garantie. 
              Keine versteckten Kosten, jederzeit kündbar.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
