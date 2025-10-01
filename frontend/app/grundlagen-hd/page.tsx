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
      icon: <Shield size={48} />,
      color: "#10b981",
      path: "/authority",
      details: "Lerne deine natürliche Entscheidungsmethode kennen - von der emotionalen Autorität bis zur sakralen Antwort."
    },
    {
      title: "Centers",
      description: "Die 9 Energiezentren - deine energetische Anatomie",
      icon: <Target size={48} />,
      color: "#8b5cf6",
      path: "/centers",
      details: "Verstehe die 9 Energiezentren und wie sie deine Persönlichkeit und Energie beeinflussen."
    },
    {
      title: "Channels",
      description: "Die 36 Kanäle - deine Verbindungen",
      icon: <Zap size={48} />,
      color: "#f59e0b",
      path: "/channels",
      details: "Entdecke die 36 Kanäle, die deine Energiezentren verbinden und deine Talente definieren."
    },
    {
      title: "Gates",
      description: "Die 64 Tore - deine individuellen Eigenschaften",
      icon: <Crown size={48} />,
      color: "#ef4444",
      path: "/gates",
      details: "Erkunde die 64 Tore des I Ging und ihre Bedeutung für dein Human Design."
    },
    {
      title: "Profiles",
      description: "Die 12 Profile - deine Lebensrolle",
      icon: <Star size={48} />,
      color: "#06b6d4",
      path: "/profiles",
      details: "Verstehe dein Profil und deine einzigartige Lebensrolle in diesem Leben."
    }
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
      <AnimatedStars />
      
      <Container maxWidth="xl" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
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
                color: 'white',
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 2,
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}>
                <Brain size={64} style={{ color: '#FFD700' }} />
                Human Design Grundlagen
                <Brain size={64} style={{ color: '#FFD700' }} />
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

        {/* Navigation Buttons */}
        <motion.div
          
          
          
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3, 
            mb: 6,
            flexWrap: 'wrap'
          }}>
            <Link href="/dashboard" passHref>
              <Button
                variant="outlined"
                startIcon={<Home size={20} />}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
                  }
                }}
              >
                Dashboard
              </Button>
            </Link>
            
            <Link href="/premium-dashboard" passHref>
              <Button
                variant="outlined"
                startIcon={<BarChart3 size={20} />}
                sx={{
                  borderColor: 'rgba(255, 215, 0, 0.3)',
                  color: '#FFD700',
                  fontWeight: 600,
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
                  }
                }}
              >
                Premium Dashboard
              </Button>
            </Link>
          </Box>
        </motion.div>

        {/* Human Design Grundlagen Cards */}
        <Grid container spacing={3}>
          {hdBasics.map((basic, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                
                
                
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  height: '100%'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: basic.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}>
                        <Box sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: 'white'
                        }} />
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
                          borderColor: basic.color,
                          color: basic.color,
                          fontWeight: 600,
                          py: 1,
                          borderRadius: 2,
                          fontSize: '0.8rem',
                          '&:hover': {
                            borderColor: basic.color,
                            backgroundColor: `${basic.color}20`
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
            background: 'linear-gradient(135deg, rgba(11,13,18,0.95) 0%, rgba(26,31,43,0.98) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.2)',
            mt: 8,
            mb: 4
          }}>
            <CardContent sx={{ p: 6 }}>
              <Box sx={{ textAlign: 'center' }}>
                <BookOpen size={48} color="#FFD700" style={{ marginBottom: 16 }} />
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
                        borderColor: 'rgba(255, 215, 0, 0.3)',
                        color: '#FFD700',
                        fontWeight: 600,
                        px: 4,
                        py: 2,
                        borderRadius: 3,
                        '&:hover': {
                          borderColor: '#FFD700',
                          backgroundColor: 'rgba(255, 215, 0, 0.1)',
                          transform: 'translateY(-2px)'
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
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        color: '#000',
                        fontWeight: 700,
                        px: 4,
                        py: 2,
                        borderRadius: 3,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)'
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
