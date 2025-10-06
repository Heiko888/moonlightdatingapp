"use client";
import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Container, CircularProgress, Grid } from '@mui/material';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Star, 
  ArrowRight, 
  BarChart3, 
  Users, 
  BookOpen,
  CheckCircle
} from 'lucide-react';
import AccessControl from '../../components/AccessControl';
import { UserSubscription } from '../../lib/subscription/types';
import { SubscriptionService } from '../../lib/subscription/subscriptionService';
import UnifiedPageLayout from '../../components/UnifiedPageLayout';

export default function ChartPage() {
  const router = useRouter();
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        router.push('/login');
        return;
      }
      
      setIsAuthenticated(true);
      loadUserSubscription();
    };

    const loadUserSubscription = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const subscription = await SubscriptionService.getUserSubscription(userId);
          setUserSubscription(subscription);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Subscription:', error);
        setUserSubscription(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <UnifiedPageLayout
        title="📊 Human Design Charts"
        subtitle="Lade Chart-Funktionen..."
        showStars={true}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px'
        }}>
          <CircularProgress sx={{ color: '#FFD700' }} />
        </Box>
      </UnifiedPageLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const chartFeatures = [
    {
      title: "Human Design Chart",
      description: "Vollständige Bodygraph-Visualisierung mit allen 9 Zentren, 36 Kanälen und 64 Toren",
      icon: <BarChart3 size={32} />,
      href: "/human-design-chart",
      features: ["Interaktive Zentren", "Planeten-Positionen", "3D-Modus", "Audio-Controls"],
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "Chart Vergleich",
      description: "Vergleiche dein Chart mit anderen Menschen für Kompatibilitäts-Analyse",
      icon: <Users size={32} />,
      href: "/chart-comparison",
      features: ["Kompatibilitäts-Score", "Gemeinsame Kanäle", "Unterschiede", "Beziehungs-Analyse"],
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "Chart Editor",
      description: "Erstelle und bearbeite dein Human Design Chart mit erweiterten Optionen",
      icon: <BookOpen size={32} />,
      href: "/chart-editor",
      features: ["Chart-Anpassung", "Farb-Themes", "Export-Funktionen", "Speichern"],
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
  ];

  return (
    <AccessControl 
      path="/chart" 
      userSubscription={userSubscription} 
      onUpgrade={() => router.push('/pricing')}
    >
      <UnifiedPageLayout
        title="📊 Human Design Charts"
        subtitle="Entdecke alle verfügbaren Chart-Funktionen: Von der vollständigen Bodygraph-Visualisierung bis hin zu interaktiven Vergleichs-Tools"
        showStars={true}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Quick Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Button
                component={Link}
                href="/human-design-chart"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
                  }
                }}
              >
                Chart erstellen
                <ArrowRight size={20} style={{ marginLeft: 8 }} />
              </Button>
            </Box>
          </motion.div>

          {/* Chart Features Grid */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {chartFeatures.map((feature, index) => (
              <Grid item xs={12} md={6} key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    component={Link}
                    href={feature.href}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          background: feature.color,
                          color: 'white',
                          mr: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        mb: 3,
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                    
                    {/* Features List */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#FFD700',
                          fontWeight: 600,
                          mb: 2,
                          fontSize: '0.9rem'
                        }}
                      >
                        Features:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {feature.features.map((feat, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.9rem'
                            }}
                          >
                            <CheckCircle size={16} color="#4ecdc4" />
                            {feat}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#FFD700', mt: 'auto' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                        Entdecken
                      </Typography>
                      <ArrowRight size={16} />
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Back to Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Button 
                component={Link} 
                href="/dashboard" 
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#fff',
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
                  }
                }}
              >
                Zurück zum Dashboard
                <ArrowRight size={20} style={{ marginLeft: 8 }} />
              </Button>
            </Box>
          </motion.div>
        </Container>
      </UnifiedPageLayout>
    </AccessControl>
  );
}
