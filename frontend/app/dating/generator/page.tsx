"use client";
import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Container,
  Grid,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Heart, 
  Star, 
  Users, 
  Zap, 
  Clock,
  MessageSquare,
  Lock,
  Gift,
  Target,
  Activity,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import LightweightMoon from '@/components/LightweightMoon';

// Schöne animierte Sterne (performance-optimiert)
const FloatingStars = () => {
  const stars = [
    { left: '10%', top: '15%', size: 2, delay: 0 },
    { left: '85%', top: '25%', size: 3, delay: 1 },
    { left: '45%', top: '35%', size: 2, delay: 2 },
    { left: '75%', top: '45%', size: 3, delay: 0.5 },
    { left: '20%', top: '55%', size: 2, delay: 1.5 },
    { left: '90%', top: '65%', size: 3, delay: 2.5 },
    { left: '30%', top: '75%', size: 2, delay: 0.8 },
    { left: '60%', top: '85%', size: 3, delay: 1.8 },
    { left: '15%', top: '95%', size: 2, delay: 3 },
    { left: '80%', top: '5%', size: 3, delay: 0.3 },
    { left: '50%', top: '15%', size: 2, delay: 2.2 },
    { left: '25%', top: '25%', size: 3, delay: 1.2 }
  ];

  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 1
    }}>
      {stars.map((star, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: star.size,
            height: star.size,
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            left: star.left,
            top: star.top,
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
            animation: `twinkle 3s ease-in-out infinite alternate`,
            animationDelay: `${star.delay}s`,
            '@keyframes twinkle': {
              '0%': { 
                opacity: 0.3,
                transform: 'scale(0.8)'
              },
              '100%': { 
                opacity: 1,
                transform: 'scale(1.2)'
              }
            }
          }}
        />
      ))}
    </Box>
  );
};

export default function MagneticDatingPage() {
  const benefits = [
    {
      icon: <Heart size={32} />,
      title: "Magnetische Anziehung",
      description: "Finde Menschen, die deine pure Lebensenergie wirklich erwidern."
    },
    {
      icon: <Zap size={32} />,
      title: "Keine Ausbrenner mehr",
      description: "Lerne Menschen kennen, die dich aufladen statt dich zu erschöpfen."
    },
    {
      icon: <Users size={32} />,
      title: "Echte Verbindungen",
      description: "Entdecke Partner, die deine Energie nicht nur bewundern, sondern teilen."
    },
    {
      icon: <Target size={32} />,
      title: "Gezielte Matches",
      description: "Basierend auf deiner einzigartigen Lebensenergie."
    },
    {
      icon: <MessageSquare size={32} />,
      title: "Tiefe Gespräche",
      description: "Menschen, die deine Gedanken und Gefühle wirklich verstehen."
    },
    {
      icon: <Activity size={32} />,
      title: "Aktive Partnerschaften",
      description: "Beziehungen, die deine natürliche Kraft unterstützen und verstärken."
    }
  ];

  const features = [
    "Energie-basierte Matching-Algorithmen",
    "Kompatibilitätsanalyse für magnetische Anziehung",
    "Response-Training für authentisches Dating",
    "Authentische Profilgestaltung",
    "Energie-optimierte Kommunikation",
    "Beziehungs-Coaching für energetische Verbindungen",
    "Freundschafts-Netzwerk",
    "Live-Energie-Checks"
  ];

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
      py: 4
    }}>
      <FloatingStars />
      
      {/* Animated Moon im Hintergrund */}
      <Box sx={{
        position: 'absolute',
        top: '5%',
        right: '-10%',
        width: '1200px',
        height: '1200px',
        opacity: 0.12,
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <LightweightMoon size={400} />
      </Box>
      
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box>
          <Box textAlign="center" mb={8}>
            <Chip
              label="⚡ Für magnetische Anziehung entwickelt"
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                fontWeight: 600,
                mb: 3,
                fontSize: '0.9rem',
                py: 1
              }}
            />
            
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 800,
                mb: 4,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(45deg, #fff, #e0e7ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Finde dein Match – mit deiner puren Lebensenergie
            </Typography>
            
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                mb: 6,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.4,
                fontWeight: 400
              }}
            >
              Du bist magnetisch, anziehend, voller Kraft. Finde Menschen, die deine Energie 
              nicht nur bewundern, sondern ehrlich erwidern.
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                  color: 'white',
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(255, 107, 157, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(255, 107, 157, 0.4)',
                  }
                }}
              >
                Mein energetisches Match finden
                <ArrowRight size={24} style={{ marginLeft: 8 }} />
              </Button>
              
              <Button
                component={Link}
                href="/chart"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255, 107, 157, 0.3)',
                  color: '#ff6b9d',
                  fontWeight: 600,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    borderColor: '#ff6b9d',
                    backgroundColor: 'rgba(255, 107, 157, 0.1)',
                  }
                }}
              >
                Chart berechnen
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Benefits Section */}
        <Box sx={{ py: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  color: 'white', 
                  mb: 3, 
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '3rem' },
                  background: 'linear-gradient(45deg, #fff, #e0e7ff)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Warum energiebasierte Verbindungen?
              </Typography>
            </Box>
            
            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                    <Card sx={{ 
                      height: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 4, 
                      border: '1px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                      color: 'white',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }
                    }}>
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box sx={{ 
                          width: 80, 
                          height: 80, 
                          borderRadius: '20px', 
                          background: 'linear-gradient(135deg, #ff6b9d, #c44569)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'white', 
                          mx: 'auto',
                          mb: 3,
                          boxShadow: '0 8px 24px rgba(255, 107, 157, 0.4)'
                        }}>
                          {benefit.icon}
                        </Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                          {benefit.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                          {benefit.description}
                        </Typography>
                      </CardContent>
                    </Card>
                </Grid>
              ))}
            </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, mb: 8 }}>
          <Container maxWidth="lg">
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: 'white', 
                    mb: 3, 
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '3rem' },
                    background: 'linear-gradient(45deg, #fff, #e0e7ff)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Spezielle Features für magnetische Verbindungen
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 3,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.15)',
                          transform: 'translateX(4px)'
                        }
                      }}>
                        <CheckCircle size={24} style={{ color: '#ff6b9d', marginRight: 16 }} />
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {feature}
                        </Typography>
                      </Box>
                  </Grid>
                ))}
              </Grid>
          </Container>
        </Box>

        {/* Testimonial */}
        <Box sx={{ py: 8 }}>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 4, 
              border: '1px solid rgba(255,255,255,0.1)',
              p: 6,
              color: 'white'
            }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ color: '#ff6b9d', fontWeight: 800, mb: 2 }}>
                  Was andere über magnetische Verbindungen sagen
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} style={{ color: '#ff6b9d', fill: '#ff6b9d' }} />
                ))}
              </Box>
              
              <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, lineHeight: 1.6, fontStyle: 'italic', textAlign: 'center' }}>
                &ldquo;Endlich habe ich Menschen kennengelernt, die meine Energie nicht nur bewundern, 
                sondern wirklich erwidern. Keine Ausbrenner mehr – nur noch echte Verbindungen!&rdquo;
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  bgcolor: 'linear-gradient(135deg, #10B981, #059669)',
                  width: 56,
                  height: 56,
                  fontWeight: 700
                }}>
                  MS
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    Maria S.
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Magnetische Anziehung, 28
                  </Typography>
                </Box>
              </Box>
            </Card>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: 8 }}>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 4, 
              border: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center',
              p: 6,
              color: 'white'
            }}>
              <Typography variant="h2" sx={{ 
                color: 'white', 
                fontWeight: 800, 
                mb: 3,
                background: 'linear-gradient(45deg, #fff, #e0e7ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Bereit für echte Verbindungen?
              </Typography>
              <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, lineHeight: 1.6 }}>
                Finde dein Match – nicht nur für den Moment, sondern für deine Seele
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                    color: 'white',
                    fontWeight: 700,
                    px: 6,
                    py: 2,
                    fontSize: '1.2rem',
                    borderRadius: 3,
                    textTransform: 'none',
                    boxShadow: '0 8px 24px rgba(255, 107, 157, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(255, 107, 157, 0.4)',
                    }
                  }}
                >
                  Jetzt kostenlos starten
                  <ArrowRight size={24} style={{ marginLeft: 8 }} />
                </Button>
                
                <Button
                  component={Link}
                  href="/chart"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'rgba(255, 107, 157, 0.3)',
                    color: '#ff6b9d',
                    fontWeight: 600,
                    px: 6,
                    py: 2,
                    fontSize: '1.2rem',
                    borderRadius: 3,
                    textTransform: 'none',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderColor: '#ff6b9d',
                      backgroundColor: 'rgba(255, 107, 157, 0.1)',
                    }
                  }}
                >
                  Chart berechnen
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Lock size={16} style={{ color: '#ff6b9d' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Sichere Daten
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Clock size={16} style={{ color: '#ff6b9d' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Sofortiger Zugang
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Gift size={16} style={{ color: '#ff6b9d' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    7 Tage kostenlos
                  </Typography>
                </Box>
              </Box>
            </Card>
        </Box>
      </Container>
    </Box>
  );
}
