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
  CardContent,
  Chip,
  Avatar,
  Stack
} from "@mui/material";
import {
  Heart,
  Users,
  Moon,
  ArrowRight,
  Star,
  Check,
  Crown,
  Zap,
  Shield,
  Sparkles,
  Globe,
  Calendar,
  Brain
} from "lucide-react";
import { motion } from "framer-motion";

// Sterne werden direkt in der Komponente implementiert

// Hauptfunktionen der App
const mainFeatures = [
  {
    title: "💕 Magische Beziehungen",
    description: "Dating mit energetischer Kompatibilität. Finde die Liebe, die wirklich zu dir passt.",
    icon: <Heart size={32} />,
    path: "/dating-info",
    color: "linear-gradient(135deg, #ff6b9d, #c44569)",
    features: ["Energetische Kompatibilität", "Human Design Matching", "Authentische Verbindungen"]
  },
  {
    title: "🌟 Persönliches Wachstum",
    description: "Deine HD-Reise der Transformation. Entdecke dein Potenzial und entwickle dich weiter.",
    icon: <Sparkles size={32} />,
    path: "/community-info",
    color: "linear-gradient(135deg, #4ecdc4, #44a08d)",
    features: ["Coaching & Beratung", "Wachstums-Tracking", "Persönliche Entwicklung"]
  },
  {
    title: "🌙 Moon & Cycles",
    description: "Zyklisches Leben entdecken. Nutze die Kraft der Mondzyklen für dein Wohlbefinden.",
    icon: <Moon size={32} />,
    path: "/mondkalender-info",
    color: "linear-gradient(135deg, #667eea, #764ba2)",
    features: ["Mondphasen", "Tägliche Impulse", "Zyklus-Tracking"]
  },
  {
    title: "🔮 Your Blueprint",
    description: "Dein energetischer Fingerabdruck. Entdecke deine einzigartige Human Design Blaupause.",
    icon: <Brain size={32} />,
    path: "/chart",
    color: "linear-gradient(135deg, #f093fb, #f5576c)",
    features: ["Chart-Analyse", "Persönliche Insights", "Energetische Blaupause"]
  }
];

// Pricing Plans
const pricingPlans = [
  {
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
      "Keine erweiterten Analysen"
    ],
    popular: false,
    cta: "Kostenlos starten",
    href: "/register"
  },
  {
    name: "Premium",
    price: "19",
    period: "monatlich",
    description: "Für tiefere Verbindungen",
    icon: <Crown size={24} />,
    color: "linear-gradient(135deg, #ff6b9d, #c44569)",
    features: [
      "Alles aus Basic",
      "Erweiterte Kompatibilitäts-Analyse",
      "Persönliche Readings",
      "Premium Community Features",
      "Exklusive Events & Meetups"
    ],
    popular: true,
    cta: "Premium starten",
    href: "/register"
  },
  {
    name: "Pro",
    price: "39",
    period: "monatlich",
    description: "Für die tiefste Transformation",
    icon: <Zap size={24} />,
    color: "linear-gradient(135deg, #4ecdc4, #44a08d)",
    features: [
      "Alles aus Premium",
      "1:1 Coaching Sessions",
      "Persönliche Human Design Beratung",
      "Exklusive Masterclasses",
      "Keine erweiterten Analysen"
    ],
    popular: false,
    cta: "Pro starten",
    href: "/register"
  }
];

// Testimonials
const testimonials = [
  {
    text: "Durch Human Design habe ich endlich verstanden, warum ich so ticke. Meine Beziehungen sind seitdem so viel authentischer!",
    author: "Sarah M.",
    type: "Manifestor, 28"
  },
  {
    text: "Die Community hier ist einfach magisch. Ich habe Freunde gefunden, die mich wirklich verstehen.",
    author: "Michael & Lisa",
    type: "Generator & Projector, verheiratet"
  },
  {
    text: "Der Mondkalender hilft mir, meine Energie besser zu verstehen. Ich fühle mich so viel ausgeglichener.",
    author: "Anna K.",
    type: "Reflector, 35"
  }
];

// FAQ Data
const faqData = [
  {
    question: "Was ist Human Design?",
    answer: "Human Design ist ein System, das Astrologie, I Ging, Chakren und Quantenphysik kombiniert, um deine einzigartige energetische Blaupause zu entschlüsseln."
  },
  {
    question: "Wie funktioniert das Matching?",
    answer: "Unser Algorithmus analysiert eure Human Design Charts und findet energetische Kompatibilität basierend auf euren Typen, Strategien und Autoritäten."
  },
  {
    question: "Ist Human Design wissenschaftlich?",
    answer: "Human Design kombiniert alte Weisheit mit modernen Erkenntnissen. Viele Nutzer berichten von tiefgreifenden positiven Veränderungen in ihren Beziehungen."
  },
  {
    question: "Kann ich kostenlos starten?",
    answer: "Ja! Unser Basic Plan ist komplett kostenlos und gibt dir Zugang zu deinem Human Design Chart, dem Mondkalender und der Community."
  },
  {
    question: "Wie genau sind die Analysen?",
    answer: "Unsere Analysen basieren auf deinem exakten Geburtsdatum, -zeit und -ort. Je präziser diese Daten, desto genauer die Ergebnisse."
  },
  {
    question: "Gibt es eine Geld-zurück-Garantie?",
    answer: "Ja! Wir bieten eine 14-tägige Geld-zurück-Garantie für alle Premium-Pläne. Du kannst jederzeit kündigen."
  }
];

export default function HomePageAlt() {
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
        <title>Magische Beziehungen - Human Design Dating & Community</title>
        <meta name="description" content="Finde die Liebe, die wirklich zu dir passt. Basierend auf Human Design und energetischer Kompatibilität." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section - Modern Card Layout */}
      <Box sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)
        `,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Stars */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          {[...Array(50)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 2}s`,
                '@keyframes twinkle': {
                  '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                  '50%': { opacity: 1, transform: 'scale(1.2)' }
                }
              }}
            />
          ))}
        </Box>
        
        {/* Floating Elements */}
        <Box sx={{ position: 'absolute', top: '10%', right: '10%', zIndex: 1 }}>
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Box sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 107, 157, 0.3), rgba(78, 205, 196, 0.3))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Heart size={40} color="rgba(255, 255, 255, 0.8)" />
            </Box>
          </motion.div>
        </Box>

        <Box sx={{ position: 'absolute', bottom: '20%', left: '5%', zIndex: 1 }}>
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Moon size={35} color="rgba(255, 255, 255, 0.8)" />
            </Box>
          </motion.div>
        </Box>

        {/* Animated Moon */}
        <Box sx={{ position: 'absolute', top: '6%', left: '11%', zIndex: 1 }}>
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

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            mb: 8,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(255, 107, 157, 0.3)'
              }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  ✨
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ 
                color: 'white', 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                MOONLIGHT
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.6)',
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
                  '&:hover': {
                    background: 'linear-gradient(45deg, #c44569, #ff6b9d)'
                  }
                }}
              >
                Registrieren
              </Button>
            </Stack>
          </Box>

          {/* Main Hero Content */}
          <Grid container spacing={6} alignItems="center" sx={{ minHeight: '70vh' }}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h1" sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 'bold',
                  color: 'white',
                  mb: 3,
                  lineHeight: 1.2
                }}>
                  Magische Beziehungen
                </Typography>
                
                <Typography variant="h5" sx={{
                  color: 'rgba(255,255,255,0.8)',
                  mb: 4,
                  fontWeight: 300,
                  lineHeight: 1.6
                }}>
                  Hast du dich jemals gefragt, warum manche Beziehungen wie Magie funktionieren, 
                  während andere trotz aller Bemühungen einfach nicht gelingen?
                </Typography>

                <Typography variant="h6" sx={{
                  color: '#FFD700',
                  mb: 4,
                  fontWeight: 600,
                  fontStyle: 'italic',
                  lineHeight: 1.5
                }}>
                  Die Antwort liegt in deiner energetischen DNA - deinem Human Design.
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    icon={<Heart size={16} />}
                    label="Magische Beziehungen"
                    sx={{
                      background: 'rgba(255, 107, 157, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 107, 157, 0.3)'
                    }}
                  />
                  <Chip 
                    icon={<Sparkles size={16} />}
                    label="Persönliches Wachstum"
                    sx={{
                      background: 'rgba(78, 205, 196, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(78, 205, 196, 0.3)'
                    }}
                  />
                  <Chip 
                    icon={<Moon size={16} />}
                    label="Moon & Cycles"
                    sx={{
                      background: 'rgba(102, 126, 234, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(102, 126, 234, 0.3)'
                    }}
                  />
                  <Chip 
                    icon={<Brain size={16} />}
                    label="Your Blueprint"
                    sx={{
                      background: 'rgba(240, 147, 251, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(240, 147, 251, 0.3)'
                    }}
                  />
                </Stack>

                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                  <Button
                    component={Link}
                    href="/dating-info"
                    variant="contained"
                    size="large"
                    endIcon={<Heart />}
                    sx={{
                      background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                      color: '#fff',
                      fontWeight: 'bold',
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(255, 107, 157, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #c44569, #ff6b9d)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(255, 107, 157, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    💕 Magische Beziehungen
                  </Button>
                  
                  <Button
                    component={Link}
                    href="/chart"
                    variant="contained"
                    size="large"
                    endIcon={<Brain />}
                    sx={{
                      background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                      color: '#fff',
                      fontWeight: 'bold',
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #f5576c, #f093fb)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(240, 147, 251, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🔮 Your Blueprint
                  </Button>
                </Stack>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                  p: 4,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
                    🌟 Dein Human Design Chart
                  </Typography>
                  
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)',
                      fontSize: '2rem'
                    }}>
                      ✨
                    </Avatar>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                      Generator
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Strategie: Warten auf die Antwort
                    </Typography>
                  </Box>

                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Energetische Kompatibilität
                      </Typography>
                      <Chip label="95%" size="small" color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Emotionaler Match
                      </Typography>
                      <Chip label="88%" size="small" color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Mentale Verbindung
                      </Typography>
                      <Chip label="92%" size="small" color="success" />
                    </Box>
                  </Stack>

                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #44a08d, #4ecdc4)'
                      }
                    }}
                  >
                    Chart erstellen
                  </Button>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h2" sx={{
              color: 'white',
              textAlign: 'center',
              mb: 2,
              fontWeight: 'bold'
            }}>
              Entdecke deine Möglichkeiten
            </Typography>
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.7)',
              textAlign: 'center',
              mb: 6,
              maxWidth: 600,
              mx: 'auto'
            }}>
              Alles, was du brauchst, um authentische Verbindungen zu schaffen
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {mainFeatures.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }
                  }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      background: feature.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3
                    }}>
                      {feature.icon}
                    </Box>
                    
                    <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                    
                    <Stack spacing={1}>
                      {feature.features.map((feat, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Check size={16} color="#4ecdc4" style={{ marginRight: 8 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {feat}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h2" sx={{
              color: 'white',
              textAlign: 'center',
              mb: 2,
              fontWeight: 'bold'
            }}>
              Wähle deinen Plan
            </Typography>
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.7)',
              textAlign: 'center',
              mb: 6,
              maxWidth: 600,
              mx: 'auto'
            }}>
              Starte kostenlos und upgrade, wenn du bereit für mehr bist
            </Typography>
          </motion.div>

          <Grid container spacing={4} sx={{ maxWidth: 1000, mx: 'auto' }}>
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
                      ? 'rgba(255, 107, 157, 0.1)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: plan.popular 
                      ? '2px solid rgba(255, 107, 157, 0.3)' 
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    p: 4,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                    }
                  }}>
                    {plan.popular && (
                      <Chip 
                        label="Beliebt" 
                        color="secondary" 
                        sx={{ 
                          position: 'absolute', 
                          top: -10, 
                          left: '50%', 
                          transform: 'translateX(-50%)',
                          background: 'linear-gradient(45deg, #ff6b9d, #c44569)'
                        }} 
                      />
                    )}
                    
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Box sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: plan.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                      }}>
                        {plan.icon}
                      </Box>
                      
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {plan.name}
                      </Typography>
                      
                      <Typography variant="h3" sx={{ 
                        color: 'white', 
                        fontWeight: 'bold',
                        background: plan.color,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        {plan.price === "0" ? "Kostenlos" : `€${plan.price}`}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {plan.period}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      mb: 3, 
                      textAlign: 'center',
                      minHeight: 40
                    }}>
                      {plan.description}
                    </Typography>
                    
                    <Stack spacing={2} sx={{ mb: 4 }}>
                      {plan.features.map((feat, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Check size={16} color="#4ecdc4" style={{ marginRight: 8 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {feat}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{
                        background: plan.color,
                        color: '#fff',
                        fontWeight: 'bold',
                        py: 1.5,
                        borderRadius: 3,
                        '&:hover': {
                          background: plan.color,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
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
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h2" sx={{
              color: 'white',
              textAlign: 'center',
              mb: 2,
              fontWeight: 'bold'
            }}>
              Was unsere Nutzer sagen
            </Typography>
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.7)',
              textAlign: 'center',
              mb: 6,
              maxWidth: 600,
              mx: 'auto'
            }}>
              Echte Geschichten von echten Menschen
            </Typography>
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
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)'
                    }
                  }}>
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(255,255,255,0.9)', 
                      mb: 3, 
                      fontStyle: 'italic',
                      lineHeight: 1.6
                    }}>
                      "{testimonial.text}"
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{
                        width: 50,
                        height: 50,
                        mr: 2,
                        background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)'
                      }}>
                        {testimonial.author.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                          {testimonial.author}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
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

      {/* FAQ Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h2" sx={{
              color: 'white',
              textAlign: 'center',
              mb: 2,
              fontWeight: 'bold'
            }}>
              Häufig gestellte Fragen
            </Typography>
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.7)',
              textAlign: 'center',
              mb: 6,
              maxWidth: 600,
              mx: 'auto'
            }}>
              Alles, was du wissen musst
            </Typography>
          </motion.div>

          <Grid container spacing={4} sx={{ maxWidth: 1000, mx: 'auto' }}>
            {faqData.map((faq, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }
                  }}>
                    <Typography variant="h6" sx={{ 
                      color: 'white', 
                      mb: 2, 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <Sparkles size={20} style={{ marginRight: 8, color: '#ff6b9d' }} />
                      {faq.question}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      lineHeight: 1.6
                    }}>
                      {faq.answer}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={Link}
              href="/support"
              variant="outlined"
              size="large"
              endIcon={<ArrowRight />}
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.6)',
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Support kontaktieren
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        py: 8, 
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
                mb: 2,
                fontWeight: 'bold',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}>
                Bereit für deine magische Reise?
              </Typography>
              
              <Typography variant="h5" sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
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
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
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
