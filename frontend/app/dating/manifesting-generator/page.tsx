"use client";
import React from 'react';
// Framer Motion entfernt für bessere Performance
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Container,
  Grid,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Heart, 
  Star, 
  Users, 
  Zap, 
  Shield,
  Clock,
  MessageSquare,
  Calendar,
  Award,
  TrendingUp,
  Globe,
  Lock,
  Gift,
  Target,
  Lightbulb,
  Eye,
  Activity,
  Compass,
  Battery,
  Play,
  Workflow,
  Brain,
  ArrowRight,
  CheckCircle,
  Crown,
  Sparkles,
  Rocket
} from 'lucide-react';
import Link from 'next/link';
import LightweightMoon from '@/components/LightweightMoon';

// Ultra-leichte Sterne (maximale Performance)
const FloatingStars = () => {
  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 1,
      background: `
        radial-gradient(2px 2px at 10% 15%, rgba(255,255,255,0.8), transparent),
        radial-gradient(3px 3px at 85% 25%, rgba(255,255,255,0.8), transparent),
        radial-gradient(2px 2px at 45% 35%, rgba(255,255,255,0.8), transparent),
        radial-gradient(3px 3px at 75% 45%, rgba(255,255,255,0.8), transparent),
        radial-gradient(2px 2px at 20% 55%, rgba(255,255,255,0.8), transparent),
        radial-gradient(3px 3px at 90% 65%, rgba(255,255,255,0.8), transparent),
        radial-gradient(2px 2px at 30% 75%, rgba(255,255,255,0.8), transparent),
        radial-gradient(3px 3px at 60% 85%, rgba(255,255,255,0.8), transparent)
      `,
      animation: 'twinkle 4s ease-in-out infinite alternate',
      '@keyframes twinkle': {
        '0%': { opacity: 0.3 },
        '100%': { opacity: 1 }
      }
    }} />
  );
};

export default function DynamicDatingPage() {
  const benefits = [
    {
      icon: <Zap size={32} />,
      title: "Dynamische Verbindungen",
      description: "Finde Menschen, die sowohl deine reaktive als auch deine initiierende Energie verstehen."
    },
    {
      icon: <Rocket size={32} />,
      title: "Schnelle Entscheidungen",
      description: "Partner, die deine impulsiven Momente nicht nur akzeptieren, sondern lieben."
    },
    {
      icon: <Users size={32} />,
      title: "Multi-Tasking-Beziehungen",
      description: "Menschen, die dich dabei unterstützen, mehrere Dinge gleichzeitig zu meistern."
    },
    {
      icon: <Target size={32} />,
      title: "Effiziente Matches",
      description: "Basierend auf deiner einzigartigen dualen Energie."
    },
    {
      icon: <MessageSquare size={32} />,
      title: "Direkte Kommunikation",
      description: "Partner, die deine schnelle, direkte Art zu kommunizieren schätzen."
    },
    {
      icon: <Activity size={32} />,
      title: "Dynamische Partnerschaften",
      description: "Beziehungen, die deine Energie und deine Vielseitigkeit unterstützen."
    }
  ];

  const features = [
    "Dual-Energie-Matching-Algorithmen",
    "Dynamische Kompatibilitätsanalyse",
    "Impuls-Management für Dating",
    "Multi-Tasking-Beziehungs-Coaching",
    "Schnellentscheidungs-Training",
    "Energie-optimierte Kommunikation",
    "Freundschafts-Netzwerk",
    "Live-Energie-Checks"
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #533483 100%)',
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
              label="🚀 Für dynamische Verbindungen entwickelt"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 700,
                mb: 3,
                fontSize: '1rem',
                py: 1
              }}
            />
            
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 900,
                mb: 4,
                fontSize: { xs: '2.5rem', md: '4rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Entdecke Beziehungen, die deine Vielseitigkeit feiern
            </Typography>
            
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                mb: 6,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.4
              }}
            >
              Du bist reaktiv UND initiativ – finde Menschen, die deine duale Energie 
              nicht nur verstehen, sondern lieben.
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#FFD700',
                  color: '#D97706',
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
                  '&:hover': {
                    bgcolor: '#fbbf24',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(255, 215, 0, 0.4)',
                  }
                }}
              >
                Mein dynamisches Match finden
                <ArrowRight size={24} style={{ marginLeft: 8 }} />
              </Button>
              
              <Button
                component={Link}
                href="/chart"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
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
        <Box>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  color: 'white', 
                  mb: 3, 
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                Warum dynamische Verbindungen?
              </Typography>
            </Box>
            
            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <Box>
                    <Card sx={{ 
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.95)', 
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4, 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      border: '2px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                      }
                    }}>
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box sx={{ 
                          width: 64, 
                          height: 64, 
                          borderRadius: '16px', 
                          background: 'linear-gradient(135deg, #F59E0B, #D97706)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'white', 
                          mx: 'auto',
                          mb: 3,
                          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)'
                        }}>
                          {benefit.icon}
                        </Box>
                        <Typography variant="h6" sx={{ color: '#D97706', fontWeight: 700, mb: 2 }}>
                          {benefit.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.6 }}>
                          {benefit.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, mb: 8 }}>
          <Container maxWidth="lg">
        <Box>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: 'white', 
                    mb: 3, 
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '3rem' }
                  }}
                >
                  Spezielle Features für dynamische Verbindungen
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
      <Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 3,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}>
                        <CheckCircle size={24} style={{ color: '#FFD700', marginRight: 16 }} />
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {feature}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>
        </Box>

        {/* Testimonial */}
        <Box sx={{ py: 8 }}>
        <Box>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(10px)',
              borderRadius: 4, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '2px solid rgba(255,255,255,0.2)',
              p: 6
            }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ color: '#D97706', fontWeight: 800, mb: 2 }}>
                  Was andere über dynamische Verbindungen sagen
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} style={{ color: '#FFD700', fill: '#FFD700' }} />
                ))}
              </Box>
              
              <Typography variant="h5" sx={{ color: '#374151', mb: 4, lineHeight: 1.6, fontStyle: 'italic', textAlign: 'center' }}>
                &ldquo;Endlich habe ich jemanden gefunden, der meine duale Energie versteht. 
                Er akzeptiert sowohl meine reaktive als auch meine initiierende Seite!&rdquo;
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  bgcolor: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  width: 56,
                  height: 56,
                  fontWeight: 700
                }}>
                  TJ
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: '#374151', fontWeight: 700 }}>
                    Thomas J.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Dynamische Verbindung, 31
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: 8 }}>
        <Box>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(10px)',
              borderRadius: 4, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '2px solid rgba(255,255,255,0.2)',
              textAlign: 'center',
              p: 6
            }}>
              <Typography variant="h2" sx={{ color: '#D97706', fontWeight: 800, mb: 3 }}>
                Bereit für dynamische Verbindungen?
              </Typography>
              <Typography variant="h5" sx={{ color: '#6B7280', mb: 4, lineHeight: 1.6 }}>
                Finde dein Match – nicht nur für den Moment, sondern für deine Seele
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#FFD700',
                    color: '#D97706',
                    fontWeight: 700,
                    px: 6,
                    py: 2,
                    fontSize: '1.2rem',
                    borderRadius: 3,
                    textTransform: 'none',
                    boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
                    '&:hover': {
                      bgcolor: '#fbbf24',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(255, 215, 0, 0.4)',
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
                    borderColor: '#F59E0B',
                    color: '#F59E0B',
                    fontWeight: 700,
                    px: 6,
                    py: 2,
                    fontSize: '1.2rem',
                    borderRadius: 3,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#D97706',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    }
                  }}
                >
                  Chart berechnen
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Lock size={16} style={{ color: '#F59E0B' }} />
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Sichere Daten
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Clock size={16} style={{ color: '#F59E0B' }} />
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Sofortiger Zugang
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Gift size={16} style={{ color: '#F59E0B' }} />
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    7 Tage kostenlos
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
