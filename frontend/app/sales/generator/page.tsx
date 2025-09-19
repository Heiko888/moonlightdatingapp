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
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
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
  Battery,
  Play,
  Workflow,
  Brain,
  Heart as HeartIcon,
  Users as UsersIcon
} from 'lucide-react';
import Link from 'next/link';

export default function GeneratorSalesPage() {
  const benefits = [
    {
      icon: <Battery size={32} />,
      title: "Verstehe deine natürliche Arbeitsenergie",
      description: "Lerne, wann du am produktivsten bist und wie du deine Energie optimal nutzt."
    },
    {
      icon: <Brain size={32} />,
      title: "Entscheidungsfindung optimieren",
      description: "Entdecke, wie du auf deine innere Antwort hörst und bessere Entscheidungen triffst."
    },
    {
      icon: <Workflow size={32} />,
      title: "Arbeitsprozesse verbessern",
      description: "Finde deine beste Arbeitszeit und optimiere deine täglichen Routinen."
    },
    {
      icon: <HeartIcon size={32} />,
      title: "Beziehungen vertiefen",
      description: "Verstehe, wie deine Generator-Energie deine Beziehungen beeinflusst."
    },
    {
      icon: <UsersIcon size={32} />,
      title: "Teamarbeit optimieren",
      description: "Lerne, wie du am besten mit anderen zusammenarbeitest."
    },
    {
      icon: <Play size={32} />,
      title: "Lebensfreude steigern",
      description: "Entdecke, was dich wirklich erfüllt und glücklich macht."
    }
  ];

  const features = [
    "Personalisiertes Arbeitsprofil",
    "Energie-Management-Tools",
    "Entscheidungsfindung-Guide",
    "Beziehungsoptimierung",
    "Tägliche Energie-Tipps",
    "Arbeitszeit-Optimierung",
    "Stress-Management",
    "Lebensbalance-Coaching"
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='80' cy='80' r='1'/%3E%3Ccircle cx='40' cy='60' r='0.5'/%3E%3Ccircle cx='60' cy='40' r='0.5'/%3E%3Ccircle cx='90' cy='10' r='0.8'/%3E%3Ccircle cx='10' cy='90' r='0.8'/%3E%3C/g%3E%3C/svg%3E")
      `,
      position: 'relative',
      overflow: 'hidden',
      py: 4
    }}>
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

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={8}>
            <Chip
              label="⚡ Speziell für Generatoren entwickelt"
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
              Entdecke deine Generator-Energie
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
              Du bist hier, um zu arbeiten und zu erschaffen. Lerne, wie du deine natürliche 
              Generator-Energie optimal nutzen und dein volles Potenzial entfalten kannst.
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
                  backdropFilter: 'blur(10px)',
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
          </Box>
        </motion.div>

        {/* Benefits Section */}
        <Box sx={{ py: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
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
                  fontSize: { xs: '2rem', md: '3rem' },
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                }}
              >
                Warum Human Design für Generatoren?
              </Typography>
            </Box>
            
            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card sx={{ 
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.1)', 
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4, 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                        borderColor: 'rgba(255,255,255,0.4)',
                        background: 'rgba(255, 255, 255, 0.15)',
                      }
                    }}>
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box sx={{ 
                          width: 64, 
                          height: 64, 
                          borderRadius: '16px', 
                          background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'white', 
                          mx: 'auto',
                          mb: 3,
                          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4), 0 0 20px rgba(102, 126, 234, 0.2)'
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
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
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
                    fontSize: { xs: '2rem', md: '3rem' },
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                  }}
                >
                  Spezielle Features für Generatoren
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(20px)',
              borderRadius: 4, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              p: 6
            }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 2, textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}>
                  Was andere Generatoren sagen
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} style={{ color: '#FFD700', fill: '#FFD700', filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))' }} />
                ))}
              </Box>
              
              <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, lineHeight: 1.6, fontStyle: 'italic', textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                &ldquo;Endlich verstehe ich meine Energie! Ich weiß jetzt, wann ich am produktivsten bin 
                und wie ich meine natürliche Arbeitskraft optimal nutzen kann.&rdquo;
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                }}>
                  MS
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                    Maria S.
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Generator, 28
                  </Typography>
                </Box>
              </Box>
            </Card>
          </motion.div>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
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
                Bereit für deine Generator-Transformation?
              </Typography>
              <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, lineHeight: 1.6, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                Entdecke dein volles Potenzial und lerne, wie du deine natürliche Energie optimal nutzen kannst
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
