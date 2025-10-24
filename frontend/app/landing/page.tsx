'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Grid,
  Stack,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Key, 
  Heart, 
  ArrowRight, 
  Star, 
  Users, 
  Shield, 
  Clock,
  CheckCircle,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Gift,
  X
} from 'lucide-react';

// Hero Features Data
const heroFeatures = [
  {
    icon: <Key size={24} />,
    title: "Human Design",
    description: "Entschlüssele dein einzigartiges energetisches Profil"
  },
  {
    icon: <Heart size={24} />,
    title: "Kompatibilität",
    description: "Finde die perfekten Verbindungen für dein Leben"
  },
  {
    icon: <Sparkles size={24} />,
    title: "Transformation",
    description: "Erlebe tiefgreifende persönliche Entwicklung"
  }
];

// How it Works Data
const howItWorks = [
  {
    step: "01",
    title: "Profil erstellen",
    description: "Erstelle dein kostenloses Profil mit deinen Geburtsdaten",
    icon: <Users size={32} />
  },
  {
    step: "02", 
    title: "Design entschlüsseln",
    description: "Erhalte deine detaillierte Human Design Analyse",
    icon: <Key size={32} />
  },
  {
    step: "03",
    title: "Verbindungen finden",
    description: "Entdecke kompatible Menschen und tiefe Beziehungen",
    icon: <Heart size={32} />
  }
];

// Success Stories Data
const successStories = [
  {
    name: "Sarah M.",
    age: 28,
    location: "Berlin",
    story: "Durch The Connection Key habe ich endlich verstanden, warum meine Beziehungen nicht funktioniert haben. Jetzt bin ich in einer wundervollen Partnerschaft!",
    rating: 5,
    type: "Beziehung"
  },
  {
    name: "Michael K.",
    age: 35,
    location: "München", 
    story: "Mein Human Design hat mir geholfen, meinen Traumjob zu finden. Ich bin jetzt viel glücklicher und erfüllter in meinem Beruf.",
    rating: 5,
    type: "Karriere"
  },
  {
    name: "Lisa R.",
    age: 31,
    location: "Hamburg",
    story: "Die Kompatibilitätsanalyse war so präzise! Ich habe meinen Seelenverwandten gefunden und wir sind jetzt verlobt.",
    rating: 5,
    type: "Beziehung"
  }
];

// Benefits Data
const benefits = [
  {
    icon: <Target size={32} />,
    title: "Präzise Analysen",
    description: "Wissenschaftlich fundierte Human Design Berechnungen"
  },
  {
    icon: <Shield size={32} />,
    title: "100% Privatsphäre",
    description: "Deine Daten sind sicher und werden niemals geteilt"
  },
  {
    icon: <Clock size={32} />,
    title: "Sofortige Ergebnisse",
    description: "Erhalte deine Analyse in wenigen Minuten"
  },
  {
    icon: <TrendingUp size={32} />,
    title: "Kontinuierliches Wachstum",
    description: "Ein Werkzeug für kontinuierliches Wachstum und Selbsterkenntnis"
  }
];

// Vordefinierte Zufallswerte für konsistentes Server/Client Rendering
const sparklePositions = [
  { left: 15, top: 20 }, { left: 75, top: 35 }, { left: 45, top: 60 },
  { left: 85, top: 15 }, { left: 25, top: 80 }, { left: 65, top: 45 },
  { left: 10, top: 55 }, { left: 90, top: 70 }, { left: 35, top: 25 },
  { left: 55, top: 85 }, { left: 70, top: 10 }, { left: 30, top: 90 }
];

const sparkleAnimations = [
  { duration: 2.5, delay: 0.3 }, { duration: 3.2, delay: 1.1 }, { duration: 2.8, delay: 0.7 },
  { duration: 3.5, delay: 1.5 }, { duration: 2.3, delay: 0.5 }, { duration: 3.8, delay: 1.8 },
  { duration: 2.6, delay: 0.9 }, { duration: 3.0, delay: 1.2 }, { duration: 2.9, delay: 0.4 },
  { duration: 3.3, delay: 1.6 }, { duration: 2.7, delay: 0.8 }, { duration: 3.6, delay: 1.4 }
];

const flamePositions = [
  { left: 20, top: 40 }, { left: 60, top: 25 }, { left: 80, top: 65 },
  { left: 40, top: 50 }, { left: 50, top: 15 }, { left: 15, top: 75 },
  { left: 70, top: 30 }, { left: 35, top: 85 }
];

const flameAnimations = [
  { duration: 4.2, delay: 0.6, x: 10 }, { duration: 5.0, delay: 2.1, x: -8 },
  { duration: 4.5, delay: 1.2, x: 12 }, { duration: 4.8, delay: 2.7, x: -5 },
  { duration: 3.8, delay: 0.9, x: 7 }, { duration: 5.2, delay: 2.4, x: -10 },
  { duration: 4.3, delay: 1.5, x: 9 }, { duration: 4.7, delay: 1.8, x: -7 }
];

export default function LandingPage() {
  const [bannerVisible, setBannerVisible] = React.useState(true);
  const [logoSrc, setLogoSrc] = React.useState('/images/connection-key-logo.png');

  return (
    <Box sx={{
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Feurige Animation */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {/* Funken */}
        {sparklePositions.slice(0, 6).map((pos, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              background: '#F29F05',
              borderRadius: '50%',
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              boxShadow: '0 0 10px rgba(242,159,5,0.9), 0 0 20px rgba(140,29,4,0.6), 0 0 30px rgba(89,10,3,0.5)'
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
              y: [0, -30, 0]
            }}
            transition={{
              duration: sparkleAnimations[i].duration,
              repeat: Infinity,
              delay: sparkleAnimations[i].delay,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Feurige Partikel (entfernt) */}
      </Box>
      
      {/* Promotion Banner */}
      {bannerVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Box sx={{ 
            position: 'relative',
            zIndex: 2,
            background: 'linear-gradient(135deg, #F29F05 0%, #8C1D04 100%)',
            borderBottom: '1px solid rgba(242, 159, 5, 0.45)',
            boxShadow: '0 4px 20px rgba(242, 159, 5, 0.4)',
            py: 2,
            px: 3
          }}>
            <Container maxWidth="lg">
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 2,
                position: 'relative'
              }}>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Gift size={28} color="#ffffff" />
                </motion.div>
                
                <Typography sx={{
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: { xs: '0.9rem', md: '1.2rem' },
                  textAlign: 'center',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)'
                }}>
                  🎉 Limitiertes Angebot: Jetzt kostenlos anmelden und lebenslangen Premium-Zugang sichern! 🎉
                </Typography>

                <Box
                  component="button"
                  onClick={() => setBannerVisible(false)}
                  sx={{
                    position: 'absolute',
                    right: 0,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 1,
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(0, 0, 0, 0.1)',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <X size={20} color="#ffffff" />
                </Box>
              </Box>
            </Container>
          </Box>
        </motion.div>
      )}

      {/* Logo am Anfang der Seite */}
      <Box sx={{ 
        position: 'relative',
        zIndex: 1,
        pt: 6,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Box sx={{ 
          position: 'relative',
          height: { xs: 120, md: 240 },
          width: { xs: '100%', md: 900 },
          maxWidth: 900,
          px: { xs: 2, md: 0 }
        }}>
          <Image
            src={logoSrc}
            alt="The Connection Key"
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 70vw, 900px"
            priority
            onError={() => setLogoSrc('/images/Design ohne Titel(15).png')}
          />
        </Box>
      </Box>

      {/* Hero Section - Zentral positioniert */}
      <Container maxWidth="lg" sx={{ 
        pt: { xs: 8, md: 12 }, 
        pb: { xs: 8, md: 12 }, 
        position: 'relative', 
        zIndex: 1,
        minHeight: 'calc(100vh - 180px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '1200px',
          mx: 'auto',
          padding: { xs: 4, md: 6 }
        }}>
            {/* Hero Content ohne Logo - Logo ist jetzt Hintergrund */}
            
            
            {/* Haupttitel */}
            <Typography variant="h2" sx={{
              background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 4,
              maxWidth: 900,
              mx: 'auto',
              lineHeight: 1.2,
              fontSize: { xs: '1.8rem', md: '2.8rem' },
              fontWeight: 800,
              fontFamily: '"Playfair Display", serif',
              textAlign: 'center'
            }}>
              Was ist The Connection Key?
            </Typography>
            
            {/* Emotionale Geschichte */}
            <Typography variant="h4" sx={{
              background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.3,
              fontSize: { xs: '1.3rem', md: '1.8rem' },
              fontWeight: 600,
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic'
            }}>
              "Stell dir vor, du triffst jemanden und spürst sofort..."
            </Typography>
            
            {/* Antwort auf die Frage */}
            <Typography variant="h5" sx={{
              color: 'rgba(255, 255, 255, 0.95)',
              mb: 3,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.5,
              fontSize: { xs: '1.2rem', md: '1.6rem' },
              fontWeight: 500,
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.9)',
              fontFamily: '"Crimson Text", serif'
            }}>
              The Connection Key ist dein Schlüssel zu einer magischen Verbindung, die du nie vergessen wirst.
            </Typography>
            
            <Typography variant="h6" sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 3,
              maxWidth: 750,
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', md: '1.4rem' },
              fontWeight: 400,
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.9)',
              fontFamily: '"Crimson Text", serif'
            }}>
              Die Energie zwischen euch ist so stark, dass sie die Luft zum Knistern bringt. 
              Jeder Blick, jede Berührung fühlt sich an wie ein elektrischer Funke.
            </Typography>
            
            <Typography variant="h6" sx={{
              background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 4,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', md: '1.4rem' },
              fontWeight: 600,
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic'
            }}>
              Was wäre, wenn du diese Verbindung schon heute finden könntest?
            </Typography>
            
            {/* Emotionaler CTA Button */}
            <Button
              component={Link}
              href="/register"
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                color: 'white',
                px: 12,
                py: 4,
                borderRadius: 12,
                fontWeight: 700,
                fontSize: '1.3rem',
                textTransform: 'none',
                fontFamily: '"Playfair Display", serif',
                boxShadow: '0 0 40px rgba(242, 159, 5, 0.55), 0 10px 30px rgba(140, 29, 4, 0.35)',
                border: '1px solid rgba(242, 159, 5, 0.45)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                  transform: 'translateY(-4px) scale(1.05)',
                  boxShadow: '0 0 50px rgba(242, 159, 5, 0.7), 0 15px 40px rgba(140, 29, 4, 0.5)',
                  border: '1px solid rgba(242, 159, 5, 0.6)'
                },
                transition: 'all 0.5s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                  transition: 'left 0.8s ease'
                },
                '&:hover::before': {
                  left: '100%'
                }
              }}
            >
              🔑 Entdecke The Connection Key 🔑
            </Button>
          </Box>
      </Container>

      {/* Hero Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography variant="h3" sx={{
            textAlign: 'center',
            mb: 6,
            color: 'white',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Warum The Connection Key?
          </Typography>
          
          <Grid container spacing={4}>
            {heroFeatures.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{
                    background: 'rgba(242, 159, 5, 0.06)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(242, 159, 5, 0.15)',
                    borderRadius: 4,
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      border: '1px solid rgba(242, 159, 5, 0.3)',
                      boxShadow: '0 20px 40px rgba(242, 159, 5, 0.15)'
                    }
                  }}>
                    <Box sx={{
                      color: '#F29F05',
                      mb: 3,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{
                      color: 'white',
                      mb: 2,
                      fontWeight: 600
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.6
                    }}>
                      {feature.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* How it Works */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography variant="h3" sx={{
            textAlign: 'center',
            mb: 6,
            color: 'white',
            fontWeight: 700
          }}>
            So funktioniert's
          </Typography>
          
          <Grid container spacing={4} alignItems="center">
            {howItWorks.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '1.2rem'
                    }}>
                      {step.step}
                    </Box>
                    <Box sx={{
                      color: '#F29F05',
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {step.icon}
                    </Box>
                    <Typography variant="h5" sx={{
                      color: 'white',
                      mb: 2,
                      fontWeight: 600
                    }}>
                      {step.title}
                    </Typography>
                    <Typography sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.6
                    }}>
                      {step.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Success Stories */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography variant="h3" sx={{
            textAlign: 'center',
            mb: 6,
            color: 'white',
            fontWeight: 700
          }}>
            Erfolgsgeschichten
          </Typography>
          
          <Grid container spacing={4}>
            {successStories.map((story, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{
                    background: 'rgba(242, 159, 5, 0.06)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(242, 159, 5, 0.15)',
                    borderRadius: 4,
                    p: 4,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      border: '1px solid rgba(242, 159, 5, 0.3)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        color: '#fff',
                        fontWeight: 700
                      }}>
                        {story.name.charAt(0)}
                      </Box>
                      <Box>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>
                          {story.name}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                          {story.age} Jahre • {story.location}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.6,
                      mb: 3,
                      fontStyle: 'italic'
                    }}>
                      "{story.story}"
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex' }}>
                        {[...Array(story.rating)].map((_, i) => (
                          <Star key={i} size={16} fill="#F29F05" color="#F29F05" />
                        ))}
                      </Box>
                      <Chip
                        label={story.type}
                        size="small"
                        sx={{
                          background: 'rgba(242, 159, 5, 0.2)',
                          color: '#F29F05',
                          border: '1px solid rgba(242, 159, 5, 0.3)'
                        }}
                      />
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Benefits */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography variant="h3" sx={{
            textAlign: 'center',
            mb: 6,
            color: 'white',
            fontWeight: 700
          }}>
            Deine Vorteile
          </Typography>
          
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Box sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 215, 0, 0.05)',
                      border: '1px solid rgba(255, 215, 0, 0.2)'
                    }
                  }}>
                    <Box sx={{
                      color: '#FFD700',
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {benefit.icon}
                    </Box>
                    <Typography variant="h6" sx={{
                      color: 'white',
                      mb: 2,
                      fontWeight: 600
                    }}>
                      {benefit.title}
                    </Typography>
                    <Typography sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                      lineHeight: 1.5
                    }}>
                      {benefit.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card sx={{
                  background: 'linear-gradient(135deg, rgba(242, 159, 5, 0.10), rgba(140, 29, 4, 0.06))',
            backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(242, 159, 5, 0.30)',
            borderRadius: 6,
            p: 6,
            textAlign: 'center'
          }}>
            <Typography variant="h3" sx={{
              color: 'white',
              mb: 3,
              fontWeight: 700,
                    background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Bereit für deine Transformation?
            </Typography>
            
            <Typography variant="h6" sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}>
              Starte noch heute deine Reise zu mehr Selbsterkenntnis und tiefen Verbindungen.
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mb: 4 }}>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  color: 'white',
                  px: 6,
                  py: 2,
                  borderRadius: 4,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  boxShadow: '0 8px 25px rgba(242, 159, 5, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 35px rgba(242, 159, 5, 0.45)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Key size={24} style={{ marginRight: 12 }} />
                Kostenlos starten
              </Button>
              
              <Button
                component={Link}
                href="/dating-info"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#F29F05',
                  color: '#F29F05',
                  px: 6,
                  py: 2,
                  borderRadius: 4,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#8C1D04',
                    backgroundColor: 'rgba(242, 159, 5, 0.10)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 30px rgba(242, 159, 5, 0.30)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Heart size={24} style={{ marginRight: 12 }} />
                Mehr erfahren
                <ArrowRight size={24} style={{ marginLeft: 12 }} />
              </Button>
            </Stack>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <CheckCircle size={20} color="#F29F05" />
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                100% kostenlos • Keine Kreditkarte erforderlich • Sofortige Ergebnisse
              </Typography>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}