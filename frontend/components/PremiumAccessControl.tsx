"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/api/auth';
import { subscriptionService, SubscriptionInfo } from '@/lib/services/subscriptionService';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Container,
  Alert,
  CircularProgress,
  Grid,
  Paper
} from '@mui/material';
import { 
  Crown, 
  Star, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PremiumAccessControlProps {
  children: React.ReactNode;
  requiredSubscription?: 'premium' | 'vip' | 'admin';
  fallbackComponent?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

// SubscriptionInfo wird jetzt aus dem Service importiert

const PremiumAccessControl: React.FC<PremiumAccessControlProps> = ({
  children,
  requiredSubscription = 'premium',
  fallbackComponent,
  showUpgradePrompt = true
}) => {
  const { user } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const router = useRouter();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscription-Level-Hierarchie
  const subscriptionLevels = {
    free: 0,
    basic: 1,
    premium: 2,
    vip: 3,
    admin: 4
  };

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !token) {
          setError('Keine Benutzerdaten verfügbar');
          return;
        }

        // Echte Subscription-Prüfung über den Service
        const userId = user?.id as string || user?.userId as string;
        if (!userId) {
          setError('Benutzer-ID nicht verfügbar');
          return;
        }
        const subscription = await subscriptionService.getCurrentSubscription(userId);
        
        if (subscription) {
          setSubscriptionInfo({
            id: subscription.id,
            userId: subscription.userId,
            level: subscription.level,
            status: subscription.status,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            autoRenew: subscription.autoRenew,
            features: subscription.features,
            metadata: subscription.metadata
          });
        } else {
          // Fallback für Benutzer ohne Subscription
          setSubscriptionInfo({
            id: 'free',
            userId: user.id as string,
            level: 'free',
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: undefined,
            autoRenew: false,
            features: subscriptionService.getFeaturesForLevel('free'),
            metadata: {}
          });
        }
      } catch (err) {
        console.error('Fehler beim Laden der Subscription-Info:', err);
        setError('Fehler beim Laden der Abonnement-Informationen');
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [user, token]);

  const getFeaturesForSubscription = (level: SubscriptionInfo['level']): string[] => {
    return subscriptionService.getFeaturesForLevel(level);
  };

  const isSubscriptionActive = (level: SubscriptionInfo['level'], expires?: string): boolean => {
    if (level === 'free') return true;
    if (level === 'admin') return true;
    
    if (!expires) return false;
    
    const expirationDate = new Date(expires);
    const now = new Date();
    
    return expirationDate > now;
  };

  const hasAccess = (): boolean => {
    if (!subscriptionInfo) return false;
    
    const userLevel = subscriptionLevels[subscriptionInfo.level];
    const requiredLevel = subscriptionLevels[requiredSubscription];
    
    return userLevel >= requiredLevel && subscriptionInfo.status === 'active';
  };

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  const handleGoBack = () => {
    router.back();
  };

  // Loading-Zustand
  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6">
            Überprüfe Abonnement-Status...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Fehler-Zustand
  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ 
              background: 'linear-gradient(45deg, #8B5CF6 30%, #DB2777 90%)',
              color: 'white'
            }}
          >
            Erneut versuchen
          </Button>
        </Container>
      </Box>
    );
  }

  // Kein Zugriff - Zeige Upgrade-Prompt
  if (!hasAccess() && showUpgradePrompt) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 8
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box textAlign="center" mb={6}>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Crown size={80} style={{ color: '#FFD700', marginBottom: '16px' }} />
              </motion.div>
              
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800, 
                  color: 'white',
                  fontSize: { xs: '2rem', md: '3rem' },
                  textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
                }}
              >
                Premium-Zugriff erforderlich
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  mb: 4,
                  maxWidth: '600px',
                  mx: 'auto'
                }}
              >
                Du benötigst ein {requiredSubscription === 'premium' ? 'Premium' : requiredSubscription === 'vip' ? 'VIP' : 'Admin'}-Abonnement, um auf diese Funktionen zuzugreifen.
              </Typography>
            </Box>

            <Grid container spacing={4} sx={{ mb: 6 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <XCircle size={24} style={{ color: '#ff6b6b', marginRight: '8px' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Aktueller Status
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Abonnement: <strong>{subscriptionInfo?.level.toUpperCase()}</strong>
                    </Typography>
                    {subscriptionInfo?.endDate && (
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Läuft ab: {new Date(subscriptionInfo.endDate).toLocaleDateString('de-DE')}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  background: 'rgba(255, 215, 0, 0.1)', 
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  color: 'white'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircle size={24} style={{ color: '#FFD700', marginRight: '8px' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Erforderlich
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Abonnement: <strong>{requiredSubscription.toUpperCase()}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Für erweiterte Features und Analytics
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Paper sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              p: 4,
              mb: 4
            }}>
              <Typography variant="h5" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
                Was du mit {requiredSubscription === 'premium' ? 'Premium' : requiredSubscription === 'vip' ? 'VIP' : 'Admin'} erhältst:
              </Typography>
              
              <Grid container spacing={2}>
                {getFeaturesForSubscription(requiredSubscription).map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Star size={16} style={{ color: '#FFD700', marginRight: '8px' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {feature}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            <Box sx={{ textAlign: 'center' }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={handleUpgrade}
                sx={{
                  background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
                  color: '#1f2937',
                  fontWeight: 700,
                  borderRadius: '10px',
                  px: 5,
                  py: 1.5,
                  mr: 2,
                  mb: 2,
                  boxShadow: '0 8px 20px rgba(255, 215, 0, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(255, 215, 0, 0.5)',
                  }
                }}
              >
                <Crown size={20} style={{ marginRight: 8 }} />
                Jetzt upgraden
                <ArrowRight size={20} style={{ marginLeft: 8 }} />
              </Button>
              
              <Button 
                variant="outlined" 
                size="large"
                onClick={handleGoBack}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '10px',
                  px: 4,
                  py: 1.5,
                  mb: 2,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Zurück
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    );
  }

  // Kein Zugriff - Zeige Fallback-Komponente
  if (!hasAccess() && fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  // Kein Zugriff - Zeige nichts
  if (!hasAccess()) {
    return null;
  }

  // Zugriff gewährt - Zeige Inhalt
  return <>{children}</>;
};

export default PremiumAccessControl;
