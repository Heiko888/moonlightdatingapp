"use client";

import React from "react";
import Link from "next/link";
import { 
  Box, 
  Typography, 
  Button,
  Container,
  Grid,
  Card,
  Paper,
  Chip,
  Stack
} from "@mui/material";
import { 
  Heart, 
  Users,
  ArrowRight,
  Star, 
  Sparkles,
  Target,
  Zap,
  Shield,
  CheckCircle,
  TrendingUp,
  MessageCircle,
  Calendar,
  Compass,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

// Dating Features
const datingFeatures = [
  {
    icon: <Heart size={32} />,
    title: "Human Design Matching",
    description: "Unser intelligenter Algorithmus findet Partner, die energetisch zu deinem Human Design passen",
    color: "linear-gradient(135deg, #ff6b9d, #c44569)",
    stats: "95% Kompatibilität"
  },
  {
    icon: <Target size={32} />,
    title: "Authentische Verbindungen",
    description: "Keine oberflächlichen Matches - finde Menschen, die wirklich zu dir passen",
    color: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    stats: "500+ Matches"
  },
  {
    icon: <MessageCircle size={32} />,
    title: "Tiefgründige Gespräche",
    description: "Chat-System mit Fokus auf bedeutungsvolle Konversationen und echten Austausch",
    color: "linear-gradient(135deg, #06b6d4, #0284c7)",
    stats: "10.000+ Nachrichten"
  },
  {
    icon: <Compass size={32} />,
    title: "Energetische Kompatibilität",
    description: "Vergleiche deine Zentren, Kanäle und Tore mit potenziellen Partnern",
    color: "linear-gradient(135deg, #10b981, #059669)",
    stats: "9 Zentren-Analyse"
  },
  {
    icon: <Calendar size={32} />,
    title: "Dating Events",
    description: "Exklusive Meetups und Speed-Dating-Events für Human Design Enthusiasten",
    color: "linear-gradient(135deg, #f59e0b, #d97706)",
    stats: "15+ Events/Monat"
  },
  {
    icon: <Award size={32} />,
    title: "Verifizierte Profile",
    description: "Alle Profile werden geprüft - für eine sichere und authentische Dating-Erfahrung",
    color: "linear-gradient(135deg, #ec4899, #db2777)",
    stats: "100% Verifiziert"
  }
];

// How it Works
const howItWorks = [
  {
    step: "1",
    title: "Profil erstellen",
    description: "Erstelle dein Profil mit deinen Geburtsdaten und lass dein Human Design Chart berechnen",
    icon: <Users size={24} />
  },
  {
    step: "2",
    title: "Matches erhalten",
    description: "Unser Algorithmus findet Menschen mit hoher energetischer Kompatibilität zu dir",
    icon: <Heart size={24} />
  },
  {
    step: "3",
    title: "Verbindung aufbauen",
    description: "Like, Match und chatte mit Menschen, die wirklich zu dir passen",
    icon: <MessageCircle size={24} />
  },
  {
    step: "4",
    title: "Dates vereinbaren",
    description: "Triff dich bei unseren Events oder verabrede dich privat - der Rest ist Magie",
    icon: <Sparkles size={24} />
  }
];

// Success Stories
const successStories = [
  {
    name: "Julia & Marco",
    types: "Generator & Manifestor",
    story: "Wir haben uns über die App gefunden und sofort gemerkt, dass unsere Energien perfekt harmonieren. Nach 6 Monaten sind wir nun zusammengezogen!",
    rating: 5,
    image: "👩‍❤️‍👨"
  },
  {
    name: "Sophie & Lisa",
    types: "Projector & Generator",
    story: "Als Projector habe ich endlich jemanden gefunden, der meine Energie wirklich versteht. Die App hat uns zusammengebracht!",
    rating: 5,
    image: "💑"
  },
  {
    name: "Tim & Anna",
    types: "Manifestor & Reflector",
    story: "Unsere ungewöhnliche Kombination funktioniert perfekt! Die Human Design Kompatibilität hat uns gezeigt, warum.",
    rating: 5,
    image: "💕"
  }
];

// Benefits
const benefits = [
  {
    icon: <Shield size={24} />,
    title: "Sicher & Privat",
    description: "Deine Daten sind bei uns geschützt"
  },
  {
    icon: <Zap size={24} />,
    title: "Schnelle Matches",
    description: "Finde in Minuten passende Partner"
  },
  {
    icon: <CheckCircle size={24} />,
    title: "Verifizierte Profile",
    description: "Alle Profile werden geprüft"
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Hohe Erfolgsrate",
    description: "95% Kompatibilität bei Matches"
  }
];

export default function DatingInfoPage() {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Navigation */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}>
            <Typography
              component={Link}
              href="/"
              variant="h5"
              sx={{
                background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              🔑 The Connection Key
            </Typography>
            
            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                href="/"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#ff6b9d',
                    backgroundColor: 'rgba(255, 107, 157, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 15px rgba(255, 107, 157, 0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Startseite
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(255, 107, 157, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(255, 107, 157, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Jetzt starten
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 16, md: 20 }, pb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h1" sx={{
              background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '4rem' },
              textShadow: '0 0 30px rgba(78, 205, 196, 0.3)'
            }}>
              💕 Dating & Matching
            </Typography>
            
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.85)',
              mb: 6,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}>
              Finde die Liebe, die wirklich zu dir passt. Basierend auf deinem Human Design 
              und energetischer Kompatibilität.
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
              sx={{ mb: 6 }}
            >
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                  px: 5,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  minWidth: { xs: '100%', sm: 'auto' },
                  boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 35px rgba(255, 107, 157, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Heart size={22} style={{ marginRight: 10 }} />
                Jetzt Partner finden
              </Button>
              
              <Button
                component={Link}
                href="/dating"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  px: 5,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  minWidth: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    borderColor: '#ff6b9d',
                    backgroundColor: 'rgba(255, 107, 157, 0.1)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 25px rgba(255, 107, 157, 0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Zum Dating-Bereich
                <ArrowRight size={22} style={{ marginLeft: 10 }} />
              </Button>
            </Stack>

            {/* Stats */}
            <Grid container spacing={3} sx={{ mb: 8 }}>
              <Grid item xs={6} md={3}>
                <Card sx={{
                  background: 'rgba(255, 107, 157, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 107, 157, 0.3)',
                  textAlign: 'center',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(255, 107, 157, 0.3)'
                  }
                }}>
                  <Typography variant="h3" sx={{ color: '#ff6b9d', fontWeight: 800, mb: 1 }}>
                    500+
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Erfolgreiche Matches
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  textAlign: 'center',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
                  }
                }}>
                  <Typography variant="h3" sx={{ color: '#8b5cf6', fontWeight: 800, mb: 1 }}>
                    95%
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Kompatibilität
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{
                  background: 'rgba(78, 205, 196, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(78, 205, 196, 0.3)',
                  textAlign: 'center',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(78, 205, 196, 0.3)'
                  }
                }}>
                  <Typography variant="h3" sx={{ color: '#4ecdc4', fontWeight: 800, mb: 1 }}>
                    15+
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Events/Monat
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  textAlign: 'center',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)'
                  }
                }}>
                  <Typography variant="h3" sx={{ color: '#f59e0b', fontWeight: 800, mb: 1 }}>
                    100%
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Verifiziert
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* Dating Features */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h2" sx={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ff6b9d, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' }
          }}>
            ✨ Dating Features
          </Typography>
          <Typography variant="h6" sx={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            mb: 6,
            maxWidth: 600,
            mx: 'auto'
          }}>
            Alles, was du brauchst, um die perfekte Verbindung zu finden
          </Typography>

          <Grid container spacing={3}>
            {datingFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    p: 4,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      background: 'rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 15px 45px rgba(0, 0, 0, 0.4)',
                      '& .feature-icon': {
                        transform: 'scale(1.1) rotate(5deg)'
                      }
                    }
                  }}>
                    <Box 
                      className="feature-icon"
                      sx={{ 
                        display: 'inline-flex',
                        p: 2.5,
                        borderRadius: 3,
                        background: feature.color,
                        color: 'white',
                        mb: 3,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ 
                      color: 'white', 
                      fontWeight: 700, 
                      mb: 2
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(255,255,255,0.75)',
                      lineHeight: 1.7,
                      mb: 3
                    }}>
                      {feature.description}
                    </Typography>
                    <Chip
                      label={feature.stats}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* How It Works */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h2" sx={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, #8b5cf6, #ff6b9d)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            mb: 6,
            fontSize: { xs: '2rem', md: '3rem' }
          }}>
            🎯 So funktioniert's
          </Typography>

          <Grid container spacing={3}>
            {howItWorks.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    background: 'rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)'
                  }
                }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff6b9d, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'white'
                  }}>
                    {step.step}
                  </Box>
                  <Box sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    mb: 2
                  }}>
                    {step.icon}
                  </Box>
                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 1
                  }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.6
                  }}>
                    {step.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Benefits */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h2" sx={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, #4ecdc4, #ff6b9d)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            mb: 6,
            fontSize: { xs: '2rem', md: '3rem' }
          }}>
            🌟 Deine Vorteile
          </Typography>

          <Grid container spacing={3}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    background: 'rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)'
                  }
                }}>
                  <Box sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #ff6b9d, #8b5cf6)',
                    color: 'white',
                    mb: 2
                  }}>
                    {benefit.icon}
                  </Box>
                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 1
                  }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.6
                  }}>
                    {benefit.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Success Stories */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h2" sx={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f59e0b, #ff6b9d)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' }
          }}>
            💑 Erfolgsgeschichten
          </Typography>
          <Typography variant="h6" sx={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            mb: 6,
            maxWidth: 600,
            mx: 'auto'
          }}>
            Diese Paare haben ihre Liebe über uns gefunden
          </Typography>

          <Grid container spacing={3}>
            {successStories.map((story, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  p: 4,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    background: 'rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)'
                  }
                }}>
                  <Box sx={{ fontSize: '3rem', textAlign: 'center', mb: 2 }}>
                    {story.image}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 2, justifyContent: 'center' }}>
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} size={20} fill="#FFD700" color="#FFD700" />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.7,
                    mb: 3,
                    fontStyle: 'italic',
                    textAlign: 'center'
                  }}>
                    "{story.story}"
                  </Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                      {story.name}
                    </Typography>
                    <Chip
                      label={story.types}
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #ff6b9d, #8b5cf6)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.15)',
            textAlign: 'center',
            p: { xs: 4, md: 8 },
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.1), rgba(139, 92, 246, 0.1))',
              zIndex: 0
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ mb: 3 }}>
                <Sparkles size={48} color="#ff6b9d" style={{ marginBottom: 16 }} />
              </Box>
              <Typography variant="h3" sx={{ 
                color: 'white', 
                fontWeight: 800, 
                mb: 3,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                background: 'linear-gradient(135deg, #ff6b9d, #8b5cf6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🚀 Bereit für die große Liebe?
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.85)', 
                mb: 5,
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.8,
                fontSize: { xs: '1rem', md: '1.2rem' }
              }}>
                Registriere dich jetzt kostenlos und finde Menschen, die wirklich zu dir passen.
              </Typography>
              
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                  px: 6,
                  py: 2.5,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  minWidth: { xs: '100%', sm: '300px' },
                  boxShadow: '0 10px 30px rgba(255, 107, 157, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 15px 40px rgba(255, 107, 157, 0.5)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Heart size={22} style={{ marginRight: 10 }} />
                Jetzt kostenlos starten
              </Button>

              <Typography sx={{ 
                color: 'rgba(255,255,255,0.6)', 
                mt: 3,
                fontSize: '0.9rem'
              }}>
                100% kostenlos • Keine Kreditkarte erforderlich • 500+ erfolgreiche Matches
              </Typography>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
