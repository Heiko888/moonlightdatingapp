"use client";
import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Container, Grid, Card, CardContent, Chip, IconButton } from '@mui/material';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Smartphone, 
  Download, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Apple,
  QrCode,
  Shield,
  Zap,
  Heart,
  Users,
  BarChart3,
  Moon,
  Sparkles
} from 'lucide-react';
import AnimatedStars from '../../components/AnimatedStars';
import AccessControl from '../../components/AccessControl';
import { UserSubscription } from '../../lib/subscription/types';
import { SubscriptionService } from '../../lib/subscription/subscriptionService';

export default function MobileAppPage() {
  const router = useRouter();
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      // Warte kurz, damit localStorage gesetzt werden kann
      setTimeout(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        console.log('🔍 Auth Check - Token:', !!token, 'UserId:', !!userId);
        
        if (!token || !userId) {
          console.log('❌ Keine Auth-Daten gefunden, leite zu Login weiter');
          router.push('/login');
          return;
        }
        
        console.log('✅ Auth-Daten gefunden, setze authenticated');
        setIsAuthenticated(true);
        loadUserSubscription();
      }, 100);
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
        <Box sx={{ color: '#FFD700', textAlign: 'center' }}>
          <Moon size={48} className="animate-spin" />
          <Typography variant="h6" sx={{ mt: 2, color: '#FFD700' }}>
            Lade Mobile App...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const appFeatures = [
    {
      title: "Human Design Charts",
      description: "Vollständige Bodygraph-Visualisierung mit allen 9 Zentren, 36 Kanälen und 64 Toren",
      icon: <BarChart3 size={32} />,
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "Dating & Matching",
      description: "Finde deine kosmische Verbindung basierend auf Human Design Kompatibilität",
      icon: <Heart size={32} />,
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "Community",
      description: "Verbinde dich mit gleichgesinnten Menschen in deiner Human Design Gruppe",
      icon: <Users size={32} />,
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      title: "Mondkalender",
      description: "Verfolge Mondphasen und ihre Auswirkungen auf dein Human Design",
      icon: <Moon size={32} />,
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    }
  ];

  const downloadOptions = [
    {
      platform: "iOS",
      icon: <Apple size={24} />,
      version: "2.1.0",
      size: "45.2 MB",
      requirements: "iOS 14.0 oder höher",
      color: "#007AFF",
      link: "#"
    },
    {
      platform: "Android",
      icon: <Smartphone size={24} />,
      version: "2.1.0", 
      size: "52.8 MB",
      requirements: "Android 8.0 oder höher",
      color: "#3DDC84",
      link: "#"
    }
  ];

  return (
    <AccessControl 
      path="/mobile-app" 
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
            {/* Hero Section */}
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
                  <Smartphone size={64} style={{ color: '#FFD700' }} />
                  HD App Mobile
                  <Smartphone size={64} style={{ color: '#FFD700' }} />
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
                Deine Human Design Journey immer dabei - mit der offiziellen HD App für iOS und Android
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="#download"
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
                  <Download size={20} style={{ marginRight: 8 }} />
                  App herunterladen
                </Button>
                
                <Button
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
                  <QrCode size={20} style={{ marginRight: 8 }} />
                  QR-Code scannen
                </Button>
              </Box>
            </Box>

            {/* Download Section */}
            <Box id="download" sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  mb: 4,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Download für dein Gerät
              </Typography>

              <Grid container spacing={4} justifyContent="center">
                {downloadOptions.map((option, index) => (
                  <Grid item xs={12} md={6} key={option.platform}>
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          p: 4,
                          borderRadius: 4,
                          background: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                          transition: 'all 0.3s ease',
                          height: '100%',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
                            background: 'rgba(255, 255, 255, 0.12)',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                          }
                        }}
                      >
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <Box
                              sx={{
                                p: 3,
                                borderRadius: 3,
                                background: option.color,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {option.icon}
                            </Box>
                          </Box>
                          
                          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                            {option.platform}
                          </Typography>
                          
                          <Box sx={{ mb: 3 }}>
                            <Chip 
                              label={`Version ${option.version}`} 
                              sx={{ 
                                background: 'rgba(255, 215, 0, 0.2)', 
                                color: '#FFD700',
                                border: '1px solid rgba(255, 215, 0, 0.3)',
                                mb: 1
                              }} 
                            />
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                              Größe: {option.size}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {option.requirements}
                            </Typography>
                          </Box>
                          
                          <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{
                              background: option.color,
                              py: 2,
                              borderRadius: 3,
                              fontWeight: 600,
                              '&:hover': {
                                background: option.color,
                                opacity: 0.9,
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            <Download size={20} style={{ marginRight: 8 }} />
                            Für {option.platform} herunterladen
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Features Section */}
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  mb: 6,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Alle Features der Web-App
              </Typography>

              <Grid container spacing={4}>
                {appFeatures.map((feature, index) => (
                  <Grid item xs={12} md={6} key={feature.title}>
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Paper
                        sx={{
                          p: 4,
                          borderRadius: 4,
                          background: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                          transition: 'all 0.3s ease',
                          height: '100%',
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
                            lineHeight: 1.6
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Benefits Section */}
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  mb: 6,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Warum die Mobile App?
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <Box sx={{ textAlign: 'center', p: 3 }}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3
                        }}
                      >
                        <Zap size={32} />
                      </Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                        Immer verfügbar
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Deine Human Design Daten immer griffbereit - auch offline
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>

                <Grid item xs={12} md={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Box sx={{ textAlign: 'center', p: 3 }}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3
                        }}
                      >
                        <Shield size={32} />
                      </Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                        Sicher & Privat
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Deine Daten sind sicher verschlüsselt und nur für dich zugänglich
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>

                <Grid item xs={12} md={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Box sx={{ textAlign: 'center', p: 3 }}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          color: 'white',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3
                        }}
                      >
                        <Sparkles size={32} />
                      </Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                        Optimiert für Mobile
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Speziell für Touch-Bedienung und mobile Nutzung entwickelt
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </Box>

            {/* CTA Section */}
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
