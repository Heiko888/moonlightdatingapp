"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Stack,
  Paper,
  Grid,
  TextField,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Heart, 
  Users, 
  BookOpen,
  Moon,
  Star,
  Target,
  Calendar,
  ArrowRight,
  Sparkles,
  Link2,
  Copy,
  CheckCircle,
  TrendingUp,
  Zap,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  // Sparkle-Positionen für animierte Hintergrund-Funken
  const sparklePositions = React.useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
    }));
  }, []);

  const sparkleAnimations = React.useMemo(() => {
    return sparklePositions.map(() => ({
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
  }, [sparklePositions]);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionCode, setConnectionCode] = useState('');
  const [showConnectionSuccess, setShowConnectionSuccess] = useState(false);

  useEffect(() => {
    // Prüfe ob Benutzer eingeloggt ist
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (token && userId) {
        setIsAuthenticated(true);
        // Weiterleitung zum Dashboard für eingeloggte Benutzer
        router.push('/dashboard');
        return;
      }
      
      setIsAuthenticated(false);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleConnectionCode = () => {
    if (connectionCode.trim()) {
      // Speichere Connection Code für spätere Verwendung nach Registration
      localStorage.setItem('pendingConnectionCode', connectionCode.trim());
      setShowConnectionSuccess(true);
      setTimeout(() => {
        router.push('/register');
      }, 1500);
    }
  };

  // Loading-Zustand während der Authentifizierungsprüfung
  if (isLoading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        color: 'white'
      }}>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>
          🌟 Lade...
        </Typography>
      </Box>
    );
  }

  // Wenn eingeloggt, zeige nichts (Weiterleitung läuft)
  if (isAuthenticated) {
    return null;
  }
  const features = [
    {
      icon: <Heart size={32} />,
      title: "Human Design Dating",
      description: "Finde Menschen, die zu deinem Human Design passen und erlebe authentische Verbindungen",
      color: "linear-gradient(135deg, #F29F05, #8C1D04)",
      link: "/dating"
    },
    {
      icon: <BookOpen size={32} />,
      title: "Persönliche Readings",
      description: "Erhalte tiefe Einblicke in dein Human Design mit professionellen Analysen",
      color: "linear-gradient(135deg, #F29F05, #8C1D04)",
      link: "/reading"
    },
    {
      icon: <Users size={32} />,
      title: "Community",
      description: "Verbinde dich mit Gleichgesinnten und teile deine Journey",
      color: "linear-gradient(135deg, #F29F05, #8C1D04)",
      link: "/community"
    },
    {
      icon: <Moon size={32} />,
      title: "Mondkalender",
      description: "Verfolge die kosmischen Zyklen und plane mit den Sternen",
      color: "linear-gradient(135deg, #F29F05, #8C1D04)",
      link: "/moon-calendar"
    },
    {
      icon: <Sparkles size={32} />,
      title: "VIP Zugang",
      description: "Exklusive Features und Inhalte für Premium Mitglieder",
      color: "linear-gradient(135deg, #F29F05, #8C1D04)",
      link: "/pricing"
    },
    {
      icon: <Target size={32} />,
      title: "Human Design Chart",
      description: "Dein persönlicher Bodygraph mit detaillierten Analysen",
      color: "linear-gradient(135deg, #F29F05, #8C1D04)",
      link: "/human-design-chart"
    }
  ];

  const stats = [
    { label: "Aktive Mitglieder", value: "2,500+", icon: <Users size={24} />, color: "#F29F05" },
    { label: "Erfolgreiche Matches", value: "500+", icon: <Heart size={24} />, color: "#8C1D04" },
    { label: "Community Events", value: "25+", icon: <Calendar size={24} />, color: "#F29F05" },
    { label: "Zufriedene Nutzer", value: "98%", icon: <Star size={24} />, color: "#F29F05" }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      position: 'relative',
      background: 'radial-gradient(ellipse at top, rgba(242, 159, 5, 0.15) 0%, rgba(0, 0, 0, 1) 50%), radial-gradient(ellipse at bottom, rgba(140, 29, 4, 0.1) 0%, rgba(0, 0, 0, 1) 70%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Dynamischer animierter Hintergrund */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        {/* Animierter Gradient Hintergrund */}
        <motion.div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(242, 159, 5, 0.1) 0%, transparent 50%)',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(140, 29, 4, 0.08) 0%, transparent 50%)',
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        
        {/* Mehr Funken mit unterschiedlichen Größen */}
        {sparklePositions.map((pos, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: i % 3 === 0 ? '4px' : i % 3 === 1 ? '6px' : '3px',
              height: i % 3 === 0 ? '4px' : i % 3 === 1 ? '6px' : '3px',
              background: i % 2 === 0 ? '#F29F05' : '#FFD700',
              borderRadius: '50%',
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              boxShadow: `0 0 ${i % 3 === 0 ? '15px' : '10px'} ${i % 2 === 0 ? 'rgba(242,159,5,0.9)' : 'rgba(255,215,0,0.8)'}, 0 0 ${i % 3 === 0 ? '25px' : '20px'} ${i % 2 === 0 ? 'rgba(140,29,4,0.6)' : 'rgba(242,159,5,0.5)'}`
            }}
            animate={{
              opacity: [0, 1, 0.5, 1, 0],
              scale: [0.3, 1.5, 0.8, 1.3, 0.3],
              y: [0, -50, -20, -40, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0]
            }}
            transition={{
              duration: sparkleAnimations[i].duration * 1.5,
              repeat: Infinity,
              delay: sparkleAnimations[i].delay,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Zusätzliche Partikel-Effekte */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: '#F29F05',
              borderRadius: '50%',
              left: `${(i * 12.5) % 100}%`,
              top: `${(i * 15) % 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
              y: [0, -100, -200],
            }}
            transition={{
              duration: 3 + (i * 0.5),
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut"
            }}
          />
        ))}
      </Box>
      
      {/* Globaler Header kommt aus AppHeader */}

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 16, md: 20 }, pb: 8, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            {/* Logo */}
            <Box sx={{ 
              position: 'relative',
              zIndex: 1,
              pt: { xs: 6, md: 8 },
              pb: 0,
              mb: 4,
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
                  src="/images/connection-key-logo.png"
                  alt="The Connection Key"
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 70vw, 900px"
                  priority
                />
              </Box>
            </Box>
            
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              align="center" 
              sx={{ 
                mb: 2,
                background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '0 0 30px rgba(242, 159, 5, 0.3)'
              }}
            >
              💫 The Connection Key
            </Typography>
            
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.85)',
              mb: 6,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}>
              Verbinde dich mit Menschen, die zu deinem kosmischen Design passen. 
              Finde Liebe, Freundschaft und persönliches Wachstum.
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 6, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/landing"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  color: 'white',
                  px: 5,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  minWidth: { xs: '100%', sm: 'auto' },
                  boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 35px rgba(242, 159, 5, 0.40)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                🔑 The Connection Key
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  px: 5,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  minWidth: { xs: '100%', sm: 'auto' },
                  boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 35px rgba(255, 107, 157, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Heart size={22} style={{ marginRight: 10 }} />
                Jetzt starten
              </Button>
              
              <Button
                component={Link}
                href="/community-info"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#F29F05',
                  color: '#F29F05',
                  px: 5,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  minWidth: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    borderColor: '#8C1D04',
                    backgroundColor: 'rgba(242, 159, 5, 0.10)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 25px rgba(242, 159, 5, 0.25)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Users size={22} style={{ marginRight: 10 }} />
                Mehr erfahren
              </Button>
            </Stack>

            {/* Connection Code Section */}
            {showConnectionSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Paper sx={{
                  background: 'rgba(242, 159, 5, 0.12)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(242, 159, 5, 0.30)',
                  borderRadius: 3,
                  p: 3,
                  maxWidth: 500,
                  mx: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <CheckCircle size={24} color="#F29F05" />
                  <Typography sx={{ color: '#F29F05', fontWeight: 600 }}>
                    Connection Code gespeichert! Weiterleitung zur Registrierung...
                  </Typography>
                </Paper>
              </motion.div>
            ) : (
              <Paper sx={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 4,
                p: 4,
                maxWidth: 600,
                mx: 'auto',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: 'center' }}>
                  <Link2 size={28} color="#F29F05" />
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                    Connection Code
                  </Typography>
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, textAlign: 'center' }}>
                  Hast du einen Connection Code von einem Freund? Gib ihn hier ein!
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    placeholder="z.B. HD-2024-ABC123"
                    value={connectionCode}
                    onChange={(e) => setConnectionCode(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#F29F05'
                        }
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)'
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleConnectionCode}
                    disabled={!connectionCode.trim()}
                    sx={{
                      background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      minWidth: { xs: '100%', sm: 'auto' },
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(242, 159, 5, 0.30)'
                      },
                      '&:disabled': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.3)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Verbinden
                  </Button>
                </Stack>
              </Paper>
            )}
          </Box>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid container spacing={3} sx={{ mb: 10 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.15)',
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      background: 'rgba(255, 255, 255, 0.12)',
                      boxShadow: `0 12px 40px ${stat.color}40`,
                      border: `1px solid ${stat.color}60`
                    }
                  }}>
                    <Box sx={{ 
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: 3,
                      background: `${stat.color}20`,
                      color: stat.color,
                      mb: 2
                    }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h3" sx={{ 
                      color: 'white', 
                      fontWeight: 800, 
                      mb: 1,
                      fontSize: { xs: '1.8rem', md: '2.5rem' }
                    }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      fontWeight: 500
                    }}>
                      {stat.label}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ 
              background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800, 
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}>
              ✨ Was macht uns besonders?
            </Typography>
            <Typography variant="h6" sx={{
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 600,
              mx: 'auto',
              mb: 6
            }}>
              Entdecke alle Features, die deine Human Design Journey unvergesslich machen
            </Typography>
          </Box>
        </motion.div>
        
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -10 }}
              >
                <Card
                  component={Link}
                  href={feature.link}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.15)',
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      background: 'rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 15px 45px rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      '& .feature-icon': {
                        transform: 'scale(1.1) rotate(5deg)'
                      }
                    }
                  }}
                >
                  <Box 
                    className="feature-icon"
                    sx={{ 
                      display: 'inline-flex',
                      p: 2.5,
                      borderRadius: 3,
                      background: feature.color,
                      color: 'white',
                      mb: 3,
                      alignSelf: 'flex-start',
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
                    flexGrow: 1
                  }}>
                    {feature.description}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mt: 3,
                    color: '#F29F05'
                  }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      Mehr erfahren
                    </Typography>
                    <ArrowRight size={18} />
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
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
                background: 'linear-gradient(135deg, rgba(242, 159, 5, 0.10), rgba(140, 29, 4, 0.10))',
              zIndex: 0
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ mb: 3 }}>
                <Sparkles size={48} color="#FFD700" style={{ marginBottom: 16 }} />
              </Box>
              <Typography variant="h3" sx={{ 
                color: 'white', 
                fontWeight: 800, 
                mb: 3,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🚀 Bereit für deine kosmische Reise?
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.85)', 
                mb: 5,
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.8,
                fontSize: { xs: '1rem', md: '1.2rem' }
              }}>
                Starte noch heute und entdecke, wer du wirklich bist. Über 2.500+ Mitglieder haben bereits ihre Human Design Journey begonnen.
              </Typography>
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3} 
                justifyContent="center"
                sx={{ mb: 4 }}
              >
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                    px: 6,
                    py: 2.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    minWidth: { xs: '100%', sm: '220px' },
                    boxShadow: '0 10px 30px rgba(242, 159, 5, 0.35)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 15px 40px rgba(242, 159, 5, 0.45)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Heart size={22} style={{ marginRight: 10 }} />
                  Kostenlos registrieren
                </Button>
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#F29F05',
                    borderWidth: 2,
                    color: '#F29F05',
                    px: 6,
                    py: 2.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    minWidth: { xs: '100%', sm: '220px' },
                    '&:hover': {
                      borderColor: '#8C1D04',
                      borderWidth: 2,
                      backgroundColor: 'rgba(242, 159, 5, 0.10)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 30px rgba(242, 159, 5, 0.35)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Bereits Mitglied?
                  <ArrowRight size={22} style={{ marginLeft: 10 }} />
                </Button>
              </Stack>

              <Box sx={{ 
                display: 'flex', 
                gap: 4, 
                justifyContent: 'center',
                flexWrap: 'wrap',
                mt: 5
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Shield size={20} color="#F29F05" />
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                    100% Sicher
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Zap size={20} color="#f59e0b" />
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                    Sofort starten
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp size={20} color="#F29F05" />
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                    Kostenlos testen
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}