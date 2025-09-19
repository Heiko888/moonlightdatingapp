"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  Chip,
  Avatar,
  Stack
} from "@mui/material";
import {
  Heart,
  Users,
  Moon,
  Star,
  Check,
  Crown,
  Brain,
  Compass
} from "lucide-react";
import { motion } from "framer-motion";

// Hauptfunktionen der App
const mainFeatures = [
  {
    title: "💕 Seelenverbindungen",
    description: "Beziehungen, die wirklich funktionieren",
    icon: <Heart size={28} />,
    path: "/dating-info",
    color: "linear-gradient(135deg, #ff6b9d, #c44569)",
    stats: "500+ Paare gefunden"
  },
  {
    title: "🌟 Dein Stamm",
    description: "Menschen, die dich verstehen",
    icon: <Users size={28} />,
    path: "/community-info",
    color: "linear-gradient(135deg, #4ecdc4, #44a08d)",
    stats: "2000+ Mitglieder"
  },
  {
    title: "🌙 Mondweisheit",
    description: "Die Kraft der Mondzyklen nutzen",
    icon: <Moon size={28} />,
    path: "/mondkalender-info",
    color: "linear-gradient(135deg, #667eea, #764ba2)",
    stats: "28-Tage Zyklen"
  },
  {
    title: "🔮 Dein Bauplan",
    description: "Dein energetischer Fingerabdruck",
    icon: <Brain size={28} />,
    path: "/chart",
    color: "linear-gradient(135deg, #f093fb, #f5576c)",
    stats: "64 Gates analysiert"
  }
];

// Pricing Plans
const pricingPlans = [
  {
    name: "Anfänger",
    price: "0",
    period: "monatlich",
    description: "Perfekt zum Einstieg",
    icon: <Star size={24} />,
    color: "linear-gradient(135deg, #667eea, #764ba2)",
    features: [
      "Human Design Chart",
      "Basis-Matching",
      "Community Zugang",
      "Mondkalender"
    ],
    popular: false,
    cta: "Kostenlos starten",
    href: "/register"
  },
  {
    name: "Entdecker",
    price: "19",
    period: "monatlich",
    description: "Für tiefere Verbindungen",
    icon: <Compass size={24} />,
    color: "linear-gradient(135deg, #ff6b9d, #c44569)",
    features: [
      "Alles aus Starter",
      "Erweiterte Analysen",
      "Persönliche Readings",
      "Premium Community"
    ],
    popular: true,
    cta: "Entdecker werden",
    href: "/register"
  },
  {
    name: "Meister",
    price: "39",
    period: "monatlich",
    description: "Für die tiefste Transformation",
    icon: <Crown size={24} />,
    color: "linear-gradient(135deg, #4ecdc4, #44a08d)",
    features: [
      "Alles aus Explorer",
      "1:1 Coaching",
      "Exklusive Events",
      "Prioritäts-Support"
    ],
    popular: false,
    cta: "Meister werden",
    href: "/register"
  }
];

// Testimonials
const testimonials = [
  {
    text: "Durch Human Design habe ich endlich verstanden, warum ich so ticke. Meine Beziehungen sind seitdem so viel authentischer!",
    author: "Sarah M.",
    type: "Manifestor, 28",
    rating: 5
  },
  {
    text: "Die Gemeinschaft hier ist einfach magisch. Ich habe Freunde gefunden, die mich wirklich verstehen.",
    author: "Michael & Lisa",
    type: "Generator & Projektor, verheiratet",
    rating: 5
  },
  {
    text: "Der Mondkalender hilft mir, meine Energie besser zu verstehen. Ich fühle mich so viel ausgeglichener.",
    author: "Anna K.",
    type: "Reflektor, 35",
    rating: 5
  }
];

export default function HomePageAlt2() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>MOONLIGHT - Human Design Dating & Community</title>
        <meta name="description" content="Finde die Liebe, die wirklich zu dir passt. Basierend auf Human Design und energetischer Kompatibilität." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section - Minimalist Design */}
      <Box sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%, #0a0a0a 100%)
        `,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Stars */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          {[...Array(30)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                background: 'rgba(255, 255, 255, 0.4)',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `pulse ${Math.random() * 4 + 3}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 2}s`,
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.2, transform: 'scale(1)' },
                  '50%': { opacity: 0.8, transform: 'scale(1.1)' }
                }
              }}
            />
          ))}
        </Box>

        {/* Animated Moon */}
        <Box sx={{ position: 'absolute', top: '12%', left: '20%', zIndex: 1 }}>
          <Box
            sx={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, rgba(240,240,240,0.4) 40%, rgba(224,224,224,0.3) 60%, rgba(208,208,208,0.2) 100%)',
              boxShadow: '0 0 40px rgba(255, 255, 255, 0.6), 0 0 80px rgba(255, 255, 255, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.3)',
              margin: '0 auto',
              opacity: 0.8
            }}
          />
        </Box>

        {/* Animated Planet Symbols */}
        {mounted && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 0
          }}>
            {[
              { symbol: '☉', size: 40, x: 15, y: 25, delay: 0 }, // Sun
              { symbol: '☽', size: 35, x: 85, y: 15, delay: 0.5 }, // Moon
              { symbol: '☿', size: 30, x: 10, y: 60, delay: 1 }, // Mercury
              { symbol: '♀', size: 32, x: 90, y: 70, delay: 1.5 }, // Venus
              { symbol: '♂', size: 28, x: 5, y: 85, delay: 2 }, // Mars
              { symbol: '♃', size: 45, x: 80, y: 90, delay: 2.5 }, // Jupiter
              { symbol: '♄', size: 38, x: 50, y: 10, delay: 3 }, // Saturn
              { symbol: '♅', size: 25, x: 25, y: 45, delay: 3.5 }, // Uranus
              { symbol: '♆', size: 33, x: 75, y: 40, delay: 4 }, // Neptune
              { symbol: '♇', size: 20, x: 60, y: 80, delay: 4.5 } // Pluto
            ].map((planet, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  left: `${planet.x}%`,
                  top: `${planet.y}%`,
                  fontSize: planet.size,
                  color: 'rgba(255, 255, 255, 0.1)',
                  animation: `float ${8 + (i * 0.5)}s infinite ease-in-out`,
                  animationDelay: `${planet.delay}s`,
                  '@keyframes float': {
                    '0%, 100%': { 
                      transform: 'translateY(0px) rotate(0deg)',
                      opacity: 0.1
                    },
                    '50%': { 
                      transform: 'translateY(-20px) rotate(180deg)',
                      opacity: 0.3
                    }
                  }
                }}
              >
                {planet.symbol}
              </Box>
            ))}
          </Box>
        )}

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
          {/* Minimalist Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 12,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" sx={{ 
                color: 'white', 
                fontWeight: 600,
                letterSpacing: '-0.02em'
              }}>
                MOONLIGHT
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                href="/login"
                variant="text"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    color: 'white',
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Anmelden
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #c44569, #ff6b9d)'
                  }
                }}
              >
                Registrieren
              </Button>
            </Stack>
          </Box>

          {/* Hero Content - Centered */}
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', mb: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h1" sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 300,
                color: 'white',
                mb: 4,
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}>
                Magische Beziehungen
              </Typography>
              
              <Typography variant="h4" sx={{
                color: 'rgba(255,255,255,0.8)',
                mb: 6,
                fontWeight: 300,
                lineHeight: 1.4,
                fontSize: { xs: '1.2rem', md: '1.5rem' }
              }}>
                Hast du dich jemals gefragt, warum manche Beziehungen wie Magie funktionieren, 
                während andere trotz aller Bemühungen einfach nicht gelingen?
              </Typography>

              <Typography variant="h5" sx={{
                color: '#FFD700',
                mb: 8,
                fontWeight: 400,
                fontStyle: 'italic',
                lineHeight: 1.3
              }}>
                Die Antwort liegt in deiner energetischen DNA - deinem Human Design.
              </Typography>

              <Stack direction="row" spacing={3} sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Button
                  component={Link}
                  href="/dating-info"
                  variant="contained"
                  size="large"
                  endIcon={<Heart />}
                  sx={{
                    background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                    color: '#fff',
                    fontWeight: 500,
                    px: 6,
                    py: 2,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #c44569, #ff6b9d)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 30px rgba(255, 107, 157, 0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Seelenverbindungen
                </Button>
                
                <Button
                  component={Link}
                  href="/chart"
                  variant="outlined"
                  size="large"
                  endIcon={<Brain />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    fontWeight: 500,
                    px: 6,
                    py: 2,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.6)',
                      background: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Dein Bauplan
                </Button>
              </Stack>
            </motion.div>
          </Box>

          {/* Stats Section */}
          <Box sx={{ textAlign: 'center', mb: 12 }}>
            <Grid container spacing={4} sx={{ maxWidth: 600, mx: 'auto' }}>
              <Grid item xs={4}>
                <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 300, mb: 1 }}>
                  500+
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Glückliche Paare
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 300, mb: 1 }}>
                  2000+
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Community Mitglieder
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 300, mb: 1 }}>
                  95%
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Erfolgsrate
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Features Section - Clean Cards */}
      <Box sx={{ py: 12, background: '#1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h2" sx={{
                color: 'white',
                mb: 3,
                fontWeight: 300,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}>
                Entdecke deine Möglichkeiten
              </Typography>
              <Typography variant="h6" sx={{
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto'
              }}>
                Alles, was du brauchst, um authentische Verbindungen zu schaffen
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {mainFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}>
                    <Box sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      background: feature.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3
                    }}>
                      {feature.icon}
                    </Box>
                    
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 500 }}>
                      {feature.title}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, lineHeight: 1.5 }}>
                      {feature.description}
                    </Typography>

                    <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 500 }}>
                      {feature.stats}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section - Minimalist */}
      <Box sx={{ py: 12, background: '#0a0a0a' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h2" sx={{
                color: 'white',
                mb: 3,
                fontWeight: 300,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}>
                Wähle deinen Weg
              </Typography>
              <Typography variant="h6" sx={{
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto'
              }}>
                Starte kostenlos und upgrade, wenn du bereit für mehr bist
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4} sx={{ maxWidth: 900, mx: 'auto' }}>
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{
                    height: '100%',
                    background: plan.popular 
                      ? 'rgba(255, 107, 157, 0.05)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    border: plan.popular 
                      ? '2px solid rgba(255, 107, 157, 0.3)' 
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    p: 4,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      border: plan.popular 
                        ? '2px solid rgba(255, 107, 157, 0.5)' 
                        : '1px solid rgba(255, 255, 255, 0.2)'
                    }
                  }}>
                    {plan.popular && (
                      <Chip 
                        label="Beliebt" 
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: -10, 
                          left: '50%', 
                          transform: 'translateX(-50%)',
                          background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
                          color: 'white'
                        }} 
                      />
                    )}
                    
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Box sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: plan.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3
                      }}>
                        {plan.icon}
                      </Box>
                      
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 500, mb: 1 }}>
                        {plan.name}
                      </Typography>
                      
                      <Typography variant="h3" sx={{ 
                        color: 'white', 
                        fontWeight: 300,
                        mb: 1
                      }}>
                        {plan.price === "0" ? "Kostenlos" : `€${plan.price}`}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {plan.period}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      mb: 4, 
                      textAlign: 'center',
                      minHeight: 40
                    }}>
                      {plan.description}
                    </Typography>
                    
                    <Stack spacing={2} sx={{ mb: 4 }}>
                      {plan.features.map((feat, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Check size={16} color="#4ecdc4" style={{ marginRight: 12 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {feat}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                    
                    <Button
                      fullWidth
                      variant={plan.popular ? "contained" : "outlined"}
                      size="large"
                      sx={{
                        background: plan.popular ? plan.color : 'transparent',
                        color: plan.popular ? '#fff' : 'white',
                        borderColor: plan.popular ? 'transparent' : 'rgba(255,255,255,0.3)',
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 500,
                        '&:hover': {
                          background: plan.popular ? plan.color : 'rgba(255,255,255,0.1)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {plan.cta}
                    </Button>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 12, background: '#1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h2" sx={{
                color: 'white',
                mb: 3,
                fontWeight: 300,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}>
                Was unsere Nutzer sagen
              </Typography>
              <Typography variant="h6" sx={{
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto'
              }}>
                Echte Geschichten von echten Menschen
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    p: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} color="#FFD700" style={{ marginRight: 4 }} />
                      ))}
                    </Box>
                    
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(255,255,255,0.9)', 
                      mb: 3, 
                      fontStyle: 'italic',
                      lineHeight: 1.6
                    }}>
                      &ldquo;{testimonial.text}&rdquo;
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)'
                      }}>
                        {testimonial.author.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 500 }}>
                          {testimonial.author}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          {testimonial.type}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section - Minimalist */}
      <Box sx={{ 
        py: 12, 
        background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4, #44a08d)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 8s ease infinite'
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{
                color: 'white',
                mb: 3,
                fontWeight: 300,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}>
                Bereit für deine magische Reise?
              </Typography>
              
              <Typography variant="h5" sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 6,
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 300,
                textShadow: '0 1px 5px rgba(0, 0, 0, 0.3)'
              }}>
                Starte noch heute und entdecke, wer wirklich zu dir passt
              </Typography>
              
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                endIcon={<Star />}
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontWeight: 500,
                  px: 8,
                  py: 2.5,
                  borderRadius: 3,
                  fontSize: '1.2rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Jetzt starten
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}
