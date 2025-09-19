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
  Flame
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

export default function PassionateDatingPage() {
  const benefits = [
    {
      icon: <Flame size={32} />,
      title: "Leidenschaftliche Verbindungen",
      description: "Finde Partner, die deiner Power nicht ausweichen, sondern gemeinsam mit dir brennen."
    },
    {
      icon: <Shield size={32} />,
      title: "Unabhängigkeit respektiert",
      description: "Menschen, die deine Unabhängigkeit nicht als Bedrohung, sondern als Stärke sehen."
    },
    {
      icon: <Users size={32} />,
      title: "Echte Verbindungen",
      description: "Partner, die deine Initiative und deine Art zu handeln wirklich schätzen."
    },
    {
      icon: <Target size={32} />,
      title: "Gezielte Initiative",
      description: "Basierend auf deiner einzigartigen initiativen Energie."
    },
    {
      icon: <MessageSquare size={32} />,
      title: "Direkte Kommunikation",
      description: "Partner, die deine direkte Art zu kommunizieren und zu handeln lieben."
    },
    {
      icon: <Activity size={32} />,
      title: "Aktive Partnerschaften",
      description: "Beziehungen, die deine natürliche Fähigkeit zu initiieren und zu führen unterstützen."
    }
  ];

  const features = [
    "Initiative-basierte Matching-Algorithmen",
    "Unabhängigkeits-Kompatibilitätsanalyse",
    "Initiative-Training für Dating",
    "Authentische Profilgestaltung",
    "Direkte Kommunikation",
    "Beziehungs-Coaching für leidenschaftliche Verbindungen",
    "Freundschafts-Netzwerk",
    "Live-Initiative-Checks"
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
        <Box
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={8}>
            <Chip
              label="🔥 Für leidenschaftliche Verbindungen entwickelt"
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
              Finde Partner, die mit dir brennen
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
              Du bist ein Initiator, ein Impulsgeber, jemand, der Neues in die Welt bringt. 
              Finde Partner, die deine Unabhängigkeit respektieren – und trotzdem dein Herz berühren.
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#FFD700',
                  color: '#DC2626',
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
                Mein leidenschaftliches Match finden
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
          <Box
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
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
                Warum leidenschaftliche Verbindungen?
              </Typography>
            </Box>
            
            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <Box
                    initial={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
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
                          background: 'linear-gradient(135deg, #EF4444, #DC2626)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'white', 
                          mx: 'auto',
                          mb: 3,
                          boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)'
                        }}>
                          {benefit.icon}
                        </Box>
                        <Typography variant="h6" sx={{ color: '#DC2626', fontWeight: 700, mb: 2 }}>
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
            <Box
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
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
                  Spezielle Features für leidenschaftliche Verbindungen
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      initial={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
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
          <Box
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(10px)',
              borderRadius: 4, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '2px solid rgba(255,255,255,0.2)',
              p: 6
            }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ color: '#DC2626', fontWeight: 800, mb: 2 }}>
                  Was andere über leidenschaftliche Verbindungen sagen
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} style={{ color: '#FFD700', fill: '#FFD700' }} />
                ))}
              </Box>
              
              <Typography variant="h5" sx={{ color: '#374151', mb: 4, lineHeight: 1.6, fontStyle: 'italic', textAlign: 'center' }}>
                &ldquo;Endlich habe ich jemanden gefunden, der meine Unabhängigkeit respektiert und 
                trotzdem mein Herz berührt. Wir brennen gemeinsam für dieselben Ziele!&rdquo;
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  bgcolor: 'linear-gradient(135deg, #EF4444, #DC2626)',
                  width: 56,
                  height: 56,
                  fontWeight: 700
                }}>
                  MK
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: '#374151', fontWeight: 700 }}>
                    Michael K.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Leidenschaftliche Verbindung, 33
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: 8 }}>
          <Box
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(10px)',
              borderRadius: 4, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '2px solid rgba(255,255,255,0.2)',
              textAlign: 'center',
              p: 6
            }}>
              <Typography variant="h2" sx={{ color: '#DC2626', fontWeight: 800, mb: 3 }}>
                Bereit für leidenschaftliche Verbindungen?
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
                    color: '#DC2626',
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
                    borderColor: '#EF4444',
                    color: '#EF4444',
                    fontWeight: 700,
                    px: 6,
                    py: 2,
                    fontSize: '1.2rem',
                    borderRadius: 3,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#DC2626',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    }
                  }}
                >
                  Chart berechnen
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Lock size={16} style={{ color: '#EF4444' }} />
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Sichere Daten
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Clock size={16} style={{ color: '#EF4444' }} />
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Sofortiger Zugang
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Gift size={16} style={{ color: '#EF4444' }} />
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
