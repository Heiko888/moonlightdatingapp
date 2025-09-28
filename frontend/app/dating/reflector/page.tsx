"use client";
import React from 'react';
import { motion } from 'framer-motion';
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
} from '@mui/material';
import { 
  Star, 
  Users, 
  Clock,
  MessageSquare,
  Lock,
  Gift,
  Target,
  Eye,
  Activity,
  ArrowRight,
  CheckCircle,
  Moon
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

export default function ReflectiveDatingPage() {
  const benefits = [
    {
      icon: <Moon size={32} />,
      title: "Raum für dich selbst",
      description: "Finde Menschen, die dir Raum geben, damit du dich selbst in Liebe erkennst."
    },
    {
      icon: <Eye size={32} />,
      title: "Echte Spiegelung",
      description: "Partner, die dich nicht überrollen, sondern dich wirklich sehen und verstehen."
    },
    {
      icon: <Users size={32} />,
      title: "Sensible Verbindungen",
      description: "Menschen, die deine Sensibilität als Stärke sehen und schätzen."
    },
    {
      icon: <Target size={32} />,
      title: "Gezielte Spiegelung",
      description: "Basierend auf deiner einzigartigen reflektiven Energie."
    },
    {
      icon: <MessageSquare size={32} />,
      title: "Tiefe Gespräche",
      description: "Partner, die deine Art zu fühlen und zu reflektieren wirklich verstehen."
    },
    {
      icon: <Activity size={32} />,
      title: "Harmonische Beziehungen",
      description: "Beziehungen, die deine natürliche Fähigkeit zu spiegeln und zu fühlen unterstützen."
    }
  ];

  const features = [
    "Reflektive Matching-Algorithmen",
    "Spiegelungs-basierte Kompatibilitätsanalyse",
    "Raum-Training für Dating",
    "Authentische Profilgestaltung",
    "Sensible Kommunikation",
    "Beziehungs-Coaching für reflektive Verbindungen",
    "Freundschafts-Netzwerk",
    "Live-Spiegelungs-Checks"
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
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
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box textAlign="center" mb={8}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            >
              <Chip
                label="🌙 Für reflektive Liebe entwickelt"
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 700,
                  mb: 4,
                  fontSize: '1rem',
                  py: 1.5,
                  px: 3,
                  borderRadius: 3
                }}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 800,
                  mb: 4,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B6B 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                ✨ Entdecke Beziehungen, die dir Raum geben ✨
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  mb: 6,
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                Du bist einzigartig – ein Spiegel, der das Umfeld und den Partner tief spürt. 
                Finde Menschen, die dich nicht überrollen, sondern Raum geben.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                      color: '#1a1a2e',
                      fontWeight: 700,
                      px: 6,
                      py: 2,
                      fontSize: '1.2rem',
                      borderRadius: 3,
                      textTransform: 'none',
                      boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FFA500, #FF8C00)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(255, 215, 0, 0.4)',
                      }
                    }}
                  >
                    Mein reflektives Match finden
                    <ArrowRight size={24} style={{ marginLeft: 8 }} />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    href="#"
                    variant="outlined"
                    size="large"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontWeight: 700,
                      px: 6,
                      py: 2,
                      fontSize: '1.2rem',
                      borderRadius: 3,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#FFD700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        color: '#FFD700'
                      }
                    }}
                  >
                    Login
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Box sx={{ py: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  color: '#FFD700', 
                  mb: 3, 
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '3rem' },
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                }}
              >
                Warum reflektive Verbindungen?
              </Typography>
            </Box>
            
            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -8 }}
                  >
                    <Card sx={{ 
                      height: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 4,
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
                      }
                    }}>
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box sx={{ 
                          width: 64, 
                          height: 64, 
                          borderRadius: '16px', 
                          background: 'linear-gradient(135deg, #FFD700, #FFA500)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: '#1a1a2e', 
                          mx: 'auto',
                          mb: 3,
                          boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)'
                        }}>
                          {benefit.icon}
                        </Box>
                        <Typography variant="h6" sx={{ 
                          color: 'rgba(255,255,255,0.9)', 
                          fontWeight: 700, 
                          mb: 2 
                        }}>
                          {benefit.title}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(255,255,255,0.8)', 
                          lineHeight: 1.6 
                        }}>
                          {benefit.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Box sx={{ 
            py: 8, 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: 4, 
            mb: 8,
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)'
          }}>
            <Container maxWidth="lg">
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: '#FFD700', 
                    mb: 3, 
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '3rem' },
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                  }}
                >
                  Spezielle Features für reflektive Verbindungen
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                      whileHover={{ y: -5 }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 3,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 4,
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 215, 0, 0.1)',
                          border: '1px solid rgba(255, 215, 0, 0.3)'
                        }
                      }}>
                        <CheckCircle size={24} style={{ color: '#FFD700', marginRight: 16 }} />
                        <Typography variant="h6" sx={{ 
                          color: 'rgba(255,255,255,0.9)', 
                          fontWeight: 600 
                        }}>
                          {feature}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <Box sx={{ py: 8 }}>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              p: 6
            }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ 
                  color: '#FFD700', 
                  fontWeight: 800, 
                  mb: 2,
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                }}>
                  Was andere über reflektive Verbindungen sagen
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} style={{ color: '#FFD700', fill: '#FFD700' }} />
                ))}
              </Box>
              
              <Typography variant="h5" sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                mb: 4, 
                lineHeight: 1.6, 
                fontStyle: 'italic', 
                textAlign: 'center' 
              }}>
                &ldquo;Endlich habe ich jemanden gefunden, der mir Raum gibt und meine Sensibilität 
                als Stärke sieht. Ich fühle mich wirklich verstanden und geliebt!&rdquo;
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#1a1a2e',
                  width: 56,
                  height: 56,
                  fontWeight: 700
                }}>
                  LM
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontWeight: 700 
                  }}>
                    Lisa M.
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.7)' 
                  }}>
                    Reflektive Verbindung, 26
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <Box sx={{ py: 8 }}>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center',
              p: 6
            }}>
              <Typography variant="h2" sx={{ 
                color: '#FFD700', 
                fontWeight: 800, 
                mb: 3,
                textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
              }}>
                Bereit für reflektive Liebe?
              </Typography>
              <Typography variant="h5" sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                mb: 4, 
                lineHeight: 1.6 
              }}>
                Finde dein Match – nicht nur für den Moment, sondern für deine Seele
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                      color: '#1a1a2e',
                      fontWeight: 700,
                      px: 6,
                      py: 2,
                      fontSize: '1.2rem',
                      borderRadius: 3,
                      textTransform: 'none',
                      boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FFA500, #FF8C00)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(255, 215, 0, 0.4)',
                      }
                    }}
                  >
                    Jetzt kostenlos starten
                    <ArrowRight size={24} style={{ marginLeft: 8 }} />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    href="#"
                    variant="outlined"
                    size="large"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontWeight: 700,
                      px: 6,
                      py: 2,
                      fontSize: '1.2rem',
                      borderRadius: 3,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#FFD700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        color: '#FFD700'
                      }
                    }}
                  >
                    Login
                  </Button>
                </motion.div>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Lock size={16} style={{ color: '#FFD700' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Sichere Daten
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Clock size={16} style={{ color: '#FFD700' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Sofortiger Zugang
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Gift size={16} style={{ color: '#FFD700' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    7 Tage kostenlos
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
