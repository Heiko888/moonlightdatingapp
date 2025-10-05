"use client";
import React from "react";
import { Box, Typography, Button, Container, Card, CardContent, Grid, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Users, Star, Zap, Target, Sparkles, MessageCircle, Eye, Crown, Clock, Gift } from "lucide-react";
import Link from "next/link";

// FloatingStars Component (Sales-Style)
const FloatingStars = () => {
  const starPositions = [
    { left: '10%', top: '15%' }, { left: '25%', top: '25%' }, { left: '40%', top: '10%' },
    { left: '55%', top: '30%' }, { left: '70%', top: '20%' }, { left: '85%', top: '35%' },
    { left: '15%', top: '45%' }, { left: '30%', top: '55%' }, { left: '45%', top: '40%' },
    { left: '60%', top: '50%' }, { left: '75%', top: '45%' }, { left: '90%', top: '60%' },
    { left: '5%', top: '70%' }, { left: '20%', top: '80%' }, { left: '35%', top: '75%' },
    { left: '50%', top: '85%' }, { left: '65%', top: '70%' }, { left: '80%', top: '80%' },
    { left: '95%', top: '75%' }, { left: '12%', top: '5%' }, { left: '28%', top: '8%' },
    { left: '42%', top: '3%' }, { left: '58%', top: '7%' }, { left: '72%', top: '12%' },
    { left: '88%', top: '18%' }, { left: '8%', top: '90%' }, { left: '22%', top: '95%' }
  ];

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {starPositions.map((pos, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            background: '#FFD700',
            borderRadius: '50%',
            boxShadow: '0 0 8px #FFD700, 0 0 16px #FFD700, 0 0 24px #FFD700',
            left: pos.left,
            top: pos.top,
          }}
        />
      ))}
    </Box>
  );
};

// ShootingStars Component (Sternschnuppen)
const ShootingStars = () => {
  const shootingStarData = [
    { id: 1, startX: '100%', startY: '10%', endX: '-10%', endY: '25%', delay: 0, duration: 3 },
    { id: 2, startX: '100%', startY: '30%', endX: '-10%', endY: '45%', delay: 2, duration: 4 },
    { id: 3, startX: '100%', startY: '60%', endX: '-10%', endY: '75%', delay: 4, duration: 3.5 },
    { id: 4, startX: '100%', startY: '80%', endX: '-10%', endY: '95%', delay: 6, duration: 4.5 },
    { id: 5, startX: '100%', startY: '15%', endX: '-10%', endY: '35%', delay: 8, duration: 3.2 },
    { id: 6, startX: '100%', startY: '50%', endX: '-10%', endY: '65%', delay: 10, duration: 3.8 }
  ];

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {shootingStarData.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            background: 'linear-gradient(90deg, #FFD700, #FFA500, transparent)',
            borderRadius: '50%',
            boxShadow: '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700',
            left: star.startX,
            top: star.startY,
          }}
          animate={{
            x: [0, -110],
            y: [0, 15],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 8
          }}
        >
          {/* Sternschnuppen-Schweif */}
          <Box
            sx={{
              position: 'absolute',
              left: '-20px',
              top: '50%',
              width: '20px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #FFD700, #FFA500)',
              transform: 'translateY(-50%)',
            }}
          />
        </motion.div>
      ))}
    </Box>
  );
};

export default function SalesDatingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%),
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
        `,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* SVG Pattern Overlay */}
      <Box
        component="svg"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.1,
          zIndex: 1
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </Box>

      <FloatingStars />
      <ShootingStars />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
        {/* Hero Section */}
        <motion.div
          
          
          
        >
          <Box textAlign="center" mb={8}>
            <Chip
              label="💕 Energetisches Dating"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontWeight: 700,
                mb: 3,
                fontSize: '1rem',
                py: 1,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
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
                textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                background: 'linear-gradient(45deg, #fff, #e0e7ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Dating mit Energie
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 6,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.4,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              Entdecke wahre Verbindungen durch energetische Kompatibilität und kosmische Harmonie.
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/dating"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
                  color: '#23233a',
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(255, 215, 0, 0.6)',
                  }
                }}
              >
                Dating starten
                <ArrowRight size={24} style={{ marginLeft: 8 }} />
              </Button>
              
              <Button
                component={Link}
                href="/matching"
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
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 32px rgba(255,255,255,0.2)',
                  }
                }}
              >
                Matching entdecken
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Features Section */}
        <motion.div
          
          
          
        >
          <Typography variant="h2" sx={{ 
            color: 'white',
            fontWeight: 800,
            mb: 6,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #fff, #e0e7ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Warum energetisches Dating?
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                height: '100%',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
                }
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #FFD700, #fbbf24)',
                    color: '#23233a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)'
                  }}>
                    <Heart size={40} />
                  </Box>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                    Echte Verbindungen
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                    Finde Partner, die energetisch zu dir passen und echte, tiefgreifende Verbindungen ermöglichen.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                height: '100%',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
                }
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #FFD700, #fbbf24)',
                    color: '#23233a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)'
                  }}>
                    <Zap size={40} />
                  </Box>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                    Sofortige Chemie
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                    Spüre die energetische Anziehung sofort und erlebe authentische Momente der Verbindung.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                height: '100%',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
                }
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #FFD700, #fbbf24)',
                    color: '#23233a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)'
                  }}>
                    <Target size={40} />
                  </Box>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                    Präzise Matches
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                    Unser Algorithmus findet Partner basierend auf energetischer Kompatibilität und kosmischen Mustern.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* Dating Tools Section */}
        <motion.div
          
          
          
        >
          <Typography variant="h2" sx={{ 
            color: 'white',
            fontWeight: 800,
            mb: 6,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #fff, #e0e7ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Unsere Dating-Tools
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                height: '100%',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
                }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '15px',
                      background: 'linear-gradient(135deg, #FFD700, #fbbf24)',
                      color: '#23233a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)'
                    }}>
                      <Users size={28} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                        Swipe & Match
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Entdecke neue Verbindungen
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.6 }}>
                    Swipe durch energetisch kompatible Profile und finde deine perfekte Verbindung basierend auf kosmischen Mustern.
                  </Typography>
                  <Button
                    component={Link}
                    href="/swipe"
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
                      color: '#23233a',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 3,
                      boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(255, 215, 0, 0.4)'
                      }
                    }}
                  >
                    Jetzt swipen <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                height: '100%',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
                }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '15px',
                      background: 'linear-gradient(135deg, #FFD700, #fbbf24)',
                      color: '#23233a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)'
                    }}>
                      <Star size={28} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                        Energetisches Matching
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Tiefgreifende Kompatibilität
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.6 }}>
                    Erhalte detaillierte Analysen der energetischen Kompatibilität und verstehe, warum ihr euch anzieht.
                  </Typography>
                  <Button
                    component={Link}
                    href="/matching"
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
                      color: '#23233a',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 3,
                      boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(255, 215, 0, 0.4)'
                      }
                    }}
                  >
                    Matching starten <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          
          
          
        >
          <Typography variant="h2" sx={{ 
            color: 'white',
            fontWeight: 800,
            mb: 6,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #fff, #e0e7ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Wähle dein Dating-Paket
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {/* Basic Package */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                height: '100%',
                position: 'relative',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
                }
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6b7280, #9ca3af)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      boxShadow: '0 6px 20px rgba(107, 114, 128, 0.4)'
                    }}>
                      <Users size={28} color="white" />
                    </Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                      Basic
                    </Typography>
                    <Typography variant="h2" sx={{ 
                      color: '#FFD700', 
                      fontWeight: 800,
                      mb: 1
                    }}>
                      €9.99
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      pro Monat
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 4 }}>
                    {[
                      'Basis-Profil erstellen',
                      '5 Swipes pro Tag',
                      'Einfache Kompatibilität',
                      'Basis-Matching',
                      'Community-Zugang'
                    ].map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #10b981, #34d399)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px'
                        }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  <Button
                    component={Link}
                    href="/subscription"
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 3,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Basic wählen
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Premium Package */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid #FFD700',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
                height: '100%',
                position: 'relative',
                transform: 'scale(1.05)',
                '&:hover': {
                  transform: 'scale(1.07)',
                  boxShadow: '0 12px 40px rgba(255, 215, 0, 0.5)'
                }
              }}>
                {/* Popular Badge */}
                <Box sx={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #FFD700, #fbbf24)',
                  color: '#23233a',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
                }}>
                  <Crown size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Beliebt
                </Box>
                
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FFD700, #fbbf24)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)'
                    }}>
                      <Crown size={28} color="#23233a" />
                    </Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                      Premium
                    </Typography>
                    <Typography variant="h2" sx={{ 
                      color: '#FFD700', 
                      fontWeight: 800,
                      mb: 1
                    }}>
                      €19.99
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      pro Monat
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 4 }}>
                    {[
                      'Unbegrenzte Swipes',
                      'Erweiterte Kompatibilität',
                      'Premium-Matching',
                      'Chat-Priorität',
                      'Exklusive Events',
                      'Persönlicher Coach'
                    ].map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FFD700, #fbbf24)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px'
                        }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#23233a' }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  <Button
                    component={Link}
                    href="/subscription"
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
                      color: '#23233a',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 3,
                      boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(255, 215, 0, 0.4)'
                      }
                    }}
                  >
                    Premium wählen
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* VIP Package */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                height: '100%',
                position: 'relative',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
                }
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)'
                    }}>
                      <Sparkles size={28} color="white" />
                    </Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                      VIP
                    </Typography>
                    <Typography variant="h2" sx={{ 
                      color: '#8b5cf6', 
                      fontWeight: 800,
                      mb: 1
                    }}>
                      €39.99
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      pro Monat
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 4 }}>
                    {[
                      'Alles aus Premium',
                      '1:1 Coaching-Sessions',
                      'Exklusive VIP-Events',
                      'Persönlicher Matchmaker',
                      'Luxus-Dating-Erlebnisse',
                      '24/7 Premium-Support'
                    ].map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px'
                        }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  <Button
                    component={Link}
                    href="/subscription"
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: '#8b5cf6',
                      color: '#8b5cf6',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 3,
                      '&:hover': {
                        borderColor: '#a855f7',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        color: '#a855f7'
                      }
                    }}
                  >
                    VIP wählen
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Pricing Benefits */}
          <Box sx={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            p: 4,
            mb: 6,
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ 
              color: 'white', 
              fontWeight: 700, 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}>
              <Gift size={24} />
              Alle Pakete enthalten:
            </Typography>
            <Grid container spacing={2}>
              {[
                '30 Tage Geld-zurück-Garantie',
                'Sichere & verschlüsselte Daten',
                '24/7 Kundensupport',
                'Regelmäßige Updates',
                'Mobile App inklusive'
              ].map((benefit, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Box sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #34d399)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {benefit}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          
          
          
        >
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            textAlign: 'center',
            p: 6
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
            
            <Typography variant="h5" sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              mb: 4, 
              maxWidth: 600, 
              mx: 'auto',
              lineHeight: 1.4 
            }}>
              Starte deine Reise zu energetisch kompatiblen Partnerschaften und erlebe Dating auf einer neuen Ebene.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/dating"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
                  color: '#23233a',
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(255, 215, 0, 0.6)',
                  }
                }}
              >
                Jetzt starten
                <ArrowRight size={24} style={{ marginLeft: 8 }} />
              </Button>
              
              <Button
                component={Link}
                href="/matching"
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
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 32px rgba(255,255,255,0.2)',
                  }
                }}
              >
                Mehr erfahren
              </Button>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
