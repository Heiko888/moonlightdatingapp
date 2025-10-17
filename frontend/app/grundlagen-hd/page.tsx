"use client";
import React from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Target, 
  Zap, 
  Crown, 
  Star,
  ArrowRight,
  BookOpen,
  Brain,
  Heart,
  Eye,
  Activity,
  Home,
  BarChart3
} from 'lucide-react';
import AnimatedStars from '../../components/AnimatedStars';
import Link from 'next/link';

export default function GrundlagenHDPage() {
  const hdBasics = [
    {
      title: "Authority",
      description: "Deine innere Autorität und Entscheidungsfindung",
      icon: <Shield size={24} />,
      color: "#10b981",
      path: "/authority",
      details: "Lerne deine natürliche Entscheidungsmethode kennen - von der emotionalen Autorität bis zur sakralen Antwort."
    },
    {
      title: "Centers",
      description: "Die 9 Energiezentren - deine energetische Anatomie",
      icon: <Target size={24} />,
      color: "#8b5cf6",
      path: "/centers",
      details: "Verstehe die 9 Energiezentren und wie sie deine Persönlichkeit und Energie beeinflussen."
    },
    {
      title: "Channels",
      description: "Die 36 Kanäle - deine Verbindungen",
      icon: <Zap size={24} />,
      color: "#f59e0b",
      path: "/channels",
      details: "Entdecke die 36 Kanäle, die deine Energiezentren verbinden und deine Talente definieren."
    },
    {
      title: "Gates",
      description: "Die 64 Tore - deine individuellen Eigenschaften",
      icon: <Crown size={24} />,
      color: "#ef4444",
      path: "/gates",
      details: "Erkunde die 64 Tore des I Ging und ihre Bedeutung für dein Human Design."
    },
    {
      title: "Profiles",
      description: "Die 12 Profile - deine Lebensrolle",
      icon: <Star size={24} />,
      color: "#06b6d4",
      path: "/profiles",
      details: "Verstehe dein Profil und deine einzigartige Lebensrolle in diesem Leben."
    }
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
      <AnimatedStars />

      {/* Fixed Navigation Bar */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backdropFilter: 'blur(20px)',
        background: 'rgba(26, 11, 46, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            py: 2 
          }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography variant="h5" sx={{ 
                background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                cursor: 'pointer'
              }}>
                🔑 The Connection Key
              </Typography>
            </Link>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                href="/dashboard"
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: '#4ecdc4',
                    background: 'rgba(78, 205, 196, 0.1)'
                  }
                }}
              >
                Dashboard
              </Button>
              <Button
                component={Link}
                href="/chart"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #4ecdc4, #0891b2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3bb5b0, #0779a1)'
                  }
                }}
              >
                Mein Chart
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      
      <Container maxWidth="xl" sx={{ pt: 15, pb: 6, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(255, 215, 0, 0.5)',
                  '0 0 30px rgba(255, 215, 0, 0.8)',
                  '0 0 20px rgba(255, 215, 0, 0.5)'
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Typography variant="h1" sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 2,
                textShadow: '0 0 30px rgba(78, 205, 196, 0.3)',
                background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}>
                <Brain size={64} style={{ color: '#4ecdc4' }} />
                Human Design Grundlagen
                <Brain size={64} style={{ color: '#8b5cf6' }} />
              </Typography>
            </motion.div>
            
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
              mb: 4
            }}>
              Entdecke die fundamentalen Bausteine des Human Design Systems
            </Typography>
          </Box>
        </motion.div>

        {/* Human Design Grundlagen Cards */}
        <Grid container spacing={3}>
          {hdBasics.map((basic, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                
                
                
              >
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.15)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 35px rgba(78, 205, 196, 0.3)',
                    borderColor: '#4ecdc4'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.2), rgba(139, 92, 246, 0.2))',
                        border: '2px solid rgba(78, 205, 196, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        color: '#4ecdc4'
                      }}>
                        {basic.icon}
                      </Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        {basic.title}
                      </Typography>
                    </Box>
                    <Typography sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      mb: 2
                    }}>
                      {basic.description}
                    </Typography>
                    <Typography sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.8rem',
                      lineHeight: 1.4,
                      mb: 3
                    }}>
                      {basic.details}
                    </Typography>
                    <Link href={basic.path} passHref>
                      <Button
                        variant="outlined"
                        fullWidth
                        endIcon={<ArrowRight size={16} />}
                        sx={{
                          borderColor: '#4ecdc4',
                          color: '#4ecdc4',
                          fontWeight: 600,
                          py: 1.5,
                          borderRadius: 2,
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#4ecdc4',
                            backgroundColor: 'rgba(78, 205, 196, 0.1)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(78, 205, 196, 0.3)'
                          }
                        }}
                      >
                        Erkunden
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Info Section */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.15)',
            mt: 8,
            mb: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <CardContent sx={{ p: 6 }}>
              <Box sx={{ textAlign: 'center' }}>
                <BookOpen size={48} color="#4ecdc4" style={{ marginBottom: 16 }} />
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                  Human Design System
                </Typography>
                <Typography sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  maxWidth: 900,
                  mx: 'auto',
                  mb: 4
                }}>
                  Das Human Design System ist eine revolutionäre Wissenschaft, die Astrologie, I Ging, Chakren-System und Quantenphysik vereint. 
                  Es zeigt dir deine einzigartige energetische Blaupause und wie du authentisch leben kannst.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
                  <Link href="/chart-info" passHref>
                    <Button
                      variant="outlined"
                      startIcon={<Eye size={20} />}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        fontWeight: 600,
                        px: 4,
                        py: 2,
                        borderRadius: 3,
                        '&:hover': {
                          borderColor: '#4ecdc4',
                          color: '#4ecdc4',
                          backgroundColor: 'rgba(78, 205, 196, 0.1)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(78, 205, 196, 0.3)'
                        }
                      }}
                    >
                      Mehr über Human Design
                    </Button>
                  </Link>
                  
                  <Link href="/human-design-chart" passHref>
                    <Button
                      variant="contained"
                      startIcon={<Activity size={20} />}
                      sx={{
                        background: 'linear-gradient(135deg, #4ecdc4, #0891b2)',
                        color: 'white',
                        fontWeight: 700,
                        px: 4,
                        py: 2,
                        borderRadius: 3,
                        boxShadow: '0 8px 25px rgba(78, 205, 196, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #3bb5b0, #0779a1)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 30px rgba(78, 205, 196, 0.5)'
                        }
                      }}
                    >
                      Dein Chart anzeigen
                    </Button>
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
