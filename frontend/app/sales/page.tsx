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
  Chip,
  Divider
} from '@mui/material';
import { 
  Sparkles, 
  Star, 
  Heart, 
  Users, 
  BookOpen, 
  Moon, 
  BarChart3, 
  CheckCircle, 
  ArrowRight, 
  Crown, 
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
  Brain
} from 'lucide-react';
import Link from 'next/link';

export default function SalesPage() {
  const benefits = [
    {
      icon: <Brain size={32} />,
      title: "Selbsterkenntnis",
      description: "Verstehe deine einzigartige Energie und wie du sie optimal nutzen kannst."
    },
    {
      icon: <Target size={32} />,
      title: "Lebensstrategie",
      description: "Entdecke deine natürliche Art zu entscheiden und zu handeln."
    },
    {
      icon: <Heart size={32} />,
      title: "Beziehungen",
      description: "Lerne, wie du authentische Verbindungen aufbaust und pflegst."
    },
    {
      icon: <Zap size={32} />,
      title: "Energie-Management",
      description: "Optimiere deine Energie und vermeide Ausbrenner."
    },
    {
      icon: <Crown size={32} />,
      title: "Lebenszweck",
      description: "Finde deine wahre Mission und dein höchstes Potenzial."
    },
    {
      icon: <Shield size={32} />,
      title: "Authentizität",
      description: "Lebe dein wahres Selbst und fühle dich endlich verstanden."
    }
  ];

  const features = [
    "Persönliche Chart-Analyse",
    "Individuelle Strategie-Beratung",
    "Energie-Optimierung",
    "Beziehungs-Coaching",
    "Karriere-Beratung",
    "Lebenszweck-Entdeckung",
    "Mondphasen-Integration",
    "Ongoing Support"
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(circle at 20% 20%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(255, 107, 157, 0.15) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
      }}>
      
      {/* Fixed Navigation */}
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
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                href="/"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(78, 205, 196, 0.5)',
                    background: 'rgba(78, 205, 196, 0.1)'
                  }
                }}
              >
                Home
              </Button>
              <Button
                component={Link}
                href="/dashboard"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #4ecdc4, #0891b2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3bb5b0, #0779a1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Dashboard
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Floating Stars Animation */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {[...Array(20)].map((_, i) => (
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

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pt: { xs: 12, md: 15 }, pb: { xs: 4, md: 8 } }}>
        {/* Hero Section */}
        <motion.div
          
          
          
        >
          <Box textAlign="center" mb={8}>
            <Chip
              label="✨ Entdecke dein kosmisches Potenzial"
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
                textShadow: '0 0 30px rgba(78, 205, 196, 0.3)',
                background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              The Connection Key
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
              Entdecke deine einzigartige kosmische Energie und lerne, wie du sie optimal nutzen kannst. 
              The Connection Key zeigt dir den Weg zu deinem authentischen Selbst im Universum.
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #4ecdc4, #0891b2)',
                  color: 'white',
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(78, 205, 196, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3bb5b0, #0779a1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(78, 205, 196, 0.6)',
                  },
                  transition: 'all 0.3s ease'
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
                  borderColor: 'rgba(78, 205, 196, 0.5)',
                  color: 'white',
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'rgba(78, 205, 196, 0.8)',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    boxShadow: '0 8px 32px rgba(78, 205, 196, 0.2)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Chart berechnen
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Benefits Section */}
        <Box sx={{ py: 8 }}>
          <motion.div
            
            whileInView={{ opacity: 1, y: 0 }}
            
            
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  color: 'white', 
                  mb: 3, 
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '3rem' },
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                }}
              >
                Was The Connection Key für dich bedeutet
              </Typography>
            </Box>
            
            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <motion.div
                    
                    whileInView={{ opacity: 1, y: 0 }}
                    
                    
                  >
                    <Card sx={{ 
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.05)', 
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4, 
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(78, 205, 196, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 30px rgba(78, 205, 196, 0.2)',
                        borderColor: 'rgba(78, 205, 196, 0.4)',
                        background: 'rgba(255, 255, 255, 0.08)',
                      }
                    }}>
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box sx={{ 
                          width: 64, 
                          height: 64, 
                          borderRadius: '16px', 
                          background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'white', 
                          mx: 'auto',
                          mb: 3,
                          boxShadow: '0 8px 24px rgba(78, 205, 196, 0.4)'
                        }}>
                          {benefit.icon}
                        </Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                          {benefit.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                          {benefit.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, mb: 8, backdropFilter: 'blur(10px)' }}>
          <Container maxWidth="lg">
            <motion.div
              
              whileInView={{ opacity: 1, y: 0 }}
              
              
            >
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: 'white', 
                    mb: 3, 
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '3rem' },
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                  }}
                >
                  Was du bekommst
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <motion.div
                      
                      whileInView={{ opacity: 1, x: 0 }}
                      
                      
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 3,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.15)',
                          borderColor: 'rgba(255,255,255,0.4)',
                          transform: 'translateY(-2px)'
                        }
                      }}>
                        <CheckCircle size={24} style={{ color: '#FFD700', marginRight: 16, filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))' }} />
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                          {feature}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>

        {/* Testimonial */}
        <Box sx={{ py: 8 }}>
          <motion.div
            
            whileInView={{ opacity: 1, y: 0 }}
            
            
          >
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(20px)',
              borderRadius: 4, 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(78, 205, 196, 0.2)',
              p: 6
            }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 2, textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}>
                  Was andere sagen
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} style={{ color: '#4ecdc4', fill: '#4ecdc4', filter: 'drop-shadow(0 0 8px rgba(78, 205, 196, 0.5))' }} />
                ))}
              </Box>
              
              <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, lineHeight: 1.6, fontStyle: 'italic', textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                &ldquo;The Connection Key hat mir geholfen, mich selbst wirklich zu verstehen. 
                Endlich fühle ich mich authentisch und weiß, wie ich meine kosmische Energie optimal nutzen kann!&rdquo;
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(78, 205, 196, 0.4)'
                }}>
                  AS
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                    Anna S.
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Connection Key Coach, 34
                  </Typography>
                </Box>
              </Box>
            </Card>
          </motion.div>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: 8 }}>
          <motion.div
            
            whileInView={{ opacity: 1, y: 0 }}
            
            
          >
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(20px)',
              borderRadius: 4, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center',
              p: 6
            }}>
              <Typography variant="h2" sx={{ color: 'white', fontWeight: 800, mb: 3, textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}>
                Bereit für deine kosmische Transformation?
              </Typography>
              <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, lineHeight: 1.6, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                Entdecke dein wahres Potenzial und beginne deine Reise zu deinem authentischen Selbst im Universum
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
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
                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FFA500, #FFD700)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(255, 215, 0, 0.6)',
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
                  Chart berechnen
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Lock size={16} style={{ color: '#FFD700', filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Sichere Daten
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Clock size={16} style={{ color: '#FFD700', filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Sofortiger Zugang
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Gift size={16} style={{ color: '#FFD700', filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    7 Tage kostenlos
                  </Typography>
                </Box>
              </Box>
            </Card>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
