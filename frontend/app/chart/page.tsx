"use client";
import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Container, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Star, 
  ArrowRight, 
  BarChart3, 
  Users, 
  BookOpen
} from 'lucide-react';
import AnimatedStars from '../../components/AnimatedStars';
import AccessControl from '../../components/AccessControl';
import { UserSubscription } from '../../lib/subscription/types';
import { SubscriptionService } from '../../lib/subscription/subscriptionService';

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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)'
      }}>
        <CircularProgress sx={{ color: '#FFD700' }} />
      </Box>
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
      <Box sx={{ 
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
        `,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <AnimatedStars />
      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: 8, px: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(255, 215, 0, 0.5)',
                  '0 0 30px rgba(255, 215, 0, 0.8)',
                  '0 0 20px rgba(255, 215, 0, 0.5)'
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 2,
                  textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                <Star size={64} style={{ color: '#FFD700' }} />
                Human Design Charts
                <Star size={64} style={{ color: '#FFD700' }} />
              </Typography>
            </motion.div>
            
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 4,
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.2rem' },
                textAlign: 'center',
                lineHeight: 1.7,
                maxWidth: '800px',
                mx: 'auto',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              Entdecke alle verfügbaren Chart-Funktionen: Von der vollständigen Bodygraph-Visualisierung bis hin zu interaktiven Vergleichs-Tools
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
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
          </Box>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
            gap: 4,
            maxWidth: '1200px',
            mx: 'auto',
            px: 2
          }}>
            {chartFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{ width: '100%' }}
              >
                <Paper
                  component={Link}
                  href={feature.href}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
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
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
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
                        mb: 1,
                        fontSize: '0.9rem'
                      }}
                    >
                      Features:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {feature.features.map((feat, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            background: 'rgba(255, 215, 0, 0.1)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            fontSize: '0.8rem',
                            color: '#FFD700'
                          }}
                        >
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
            ))}
          </Box>


          <Box sx={{ textAlign: 'center', mt: 8 }}>
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
      </Box>
    </AccessControl>
  );
}
