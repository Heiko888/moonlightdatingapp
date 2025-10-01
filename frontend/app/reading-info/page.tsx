"use client";
import React from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, ArrowRight, CheckCircle, Brain, Heart, Zap, Eye, Crown, Shield, Target, Users, Clock, Award } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';
import Link from 'next/link';

export default function ReadingInfoPage() {

  const readingTypes = [
    {
      icon: <Brain size={32} />,
      title: "Intelligente Analysen",
      description: "Erhalte detaillierte Interpretationen deines Charts mit modernster Technologie",
      color: "#8b5cf6"
    },
    {
      icon: <Heart size={32} />,
      title: "Persönliche Insights",
      description: "Entdecke deine einzigartigen Talente, Herausforderungen und Potenziale",
      color: "#ef4444"
    },
    {
      icon: <Zap size={32} />,
      title: "Energie-Optimierung",
      description: "Lerne, wie du deine Energie optimal nutzen und deine Strategie leben kannst",
      color: "#f59e0b"
    },
    {
      icon: <Eye size={32} />,
      title: "Tiefe Selbsterkenntnis",
      description: "Verstehe deine wahre Natur und deine authentische Lebensweise",
      color: "#10b981"
    }
  ];

  const readingBenefits = [
    "Erhalte klare Antworten auf deine wichtigsten Lebensfragen",
    "Verstehe deine natürlichen Talente und wie du sie entwickelst",
    "Lerne deine optimalen Entscheidungsmethoden kennen",
    "Entdecke deine Beziehungsdynamiken und Kompatibilität",
    "Finde deine Berufung und deinen Lebenszweck",
    "Optimiere deine Energie und dein Wohlbefinden"
  ];

  const features = [
    {
      icon: <Crown size={24} />,
      title: "Premium Qualität",
      description: "Hochwertige, detaillierte Analysen von zertifizierten Human Design Experten"
    },
    {
      icon: <Shield size={24} />,
      title: "Vertraulich & Sicher",
      description: "Deine Daten sind geschützt und werden niemals geteilt"
    },
    {
      icon: <Target size={24} />,
      title: "Personalisierte Insights",
      description: "Jedes Reading ist einzigartig auf dein Chart zugeschnitten"
    },
    {
      icon: <Users size={24} />,
      title: "Experten-Team",
      description: "Arbeite mit erfahrenen Human Design Beratern zusammen"
    },
    {
      icon: <Clock size={24} />,
      title: "Schnelle Ergebnisse",
      description: "Erhalte dein Reading innerhalb von 24-48 Stunden"
    },
    {
      icon: <Award size={24} />,
      title: "Zertifizierte Qualität",
      description: "Alle Analysen folgen den höchsten Human Design Standards"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Chart berechnen",
      description: "Erstelle dein Human Design Chart mit Geburtsdaten"
    },
    {
      step: "02", 
      title: "Reading auswählen",
      description: "Wähle den Reading-Typ, der zu dir passt"
    },
    {
      step: "03",
      title: "Analyse erhalten",
      description: "Erhalte deine personalisierte Analyse"
    },
    {
      step: "04",
      title: "Insights umsetzen",
      description: "Nutze die Erkenntnisse für dein authentisches Leben"
    }
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
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
              <BookOpen size={48} color="#FFD700" />
              <Typography variant="h1" sx={{
                color: '#FFD700',
                fontWeight: 800,
                textShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
                fontSize: { xs: '2.5rem', md: '4rem' }
              }}>
                Persönliche Readings
              </Typography>
              <BookOpen size={48} color="#FFD700" />
            </Box>
            <motion.div
              
              
              
            >
              <Typography variant="h5" sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6
              }}>
                Erhalte tiefe Einblicke in dein Human Design mit intelligenten Analysen
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Was sind Readings */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.2)',
            mb: 6
          }}>
            <CardContent sx={{ p: 6 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Sparkles size={48} color="#FFD700" style={{ marginBottom: 16 }} />
                <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 700, mb: 3 }}>
                  Was sind Human Design Readings?
                </Typography>
                <Typography sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  maxWidth: 900,
                  mx: 'auto'
                }}>
                  Human Design Readings sind detaillierte Interpretationen deines einzigartigen Charts. 
                  Sie enthüllen deine energetische Blaupause und zeigen dir, wie du authentisch leben kannst. 
                  Mit modernster Technologie erhältst du personalisierte Insights, die dir helfen, 
                  deine wahre Natur zu verstehen und dein volles Potenzial zu entfalten.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reading Types */}
        <motion.div
          
          
          
        >
          <Typography variant="h3" sx={{ 
            color: '#FFD700', 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6 
          }}>
            Unsere Reading-Typen
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {readingTypes.map((reading, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  
                  
                  
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      borderColor: 'rgba(255, 215, 0, 0.5)'
                    }
                  }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${reading.color}, ${reading.color}80)`,
                        margin: '0 auto 20px',
                        color: '#fff'
                      }}>
                        {reading.icon}
                      </Box>
                      <Typography variant="h5" sx={{
                        color: '#FFD700',
                        fontWeight: 600,
                        mb: 2
                      }}>
                        {reading.title}
                      </Typography>
                      <Typography sx={{
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.6
                      }}>
                        {reading.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Benefits */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.2)',
            mb: 6
          }}>
            <CardContent sx={{ p: 6 }}>
              <Typography variant="h3" sx={{ 
                color: '#FFD700', 
                textAlign: 'center', 
                fontWeight: 700, 
                mb: 4 
              }}>
                Was du von einem Reading erhältst
              </Typography>
              <Grid container spacing={3}>
                {readingBenefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <motion.div
                      
                      
                      
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <CheckCircle size={24} color="#FFD700" />
                        <Typography sx={{
                          color: 'rgba(255,255,255,0.9)',
                          fontSize: '1.1rem'
                        }}>
                          {benefit}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Section */}
        <motion.div
          
          
          
        >
          <Typography variant="h3" sx={{ 
            color: '#FFD700', 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6 
          }}>
            Warum unsere Readings?
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  
                  
                  
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      borderColor: 'rgba(255, 215, 0, 0.5)'
                    }
                  }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        margin: '0 auto 20px',
                        color: '#1a1a2e'
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{
                        color: '#FFD700',
                        fontWeight: 600,
                        mb: 2
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.6
                      }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.2)',
            mb: 6
          }}>
            <CardContent sx={{ p: 6 }}>
              <Typography variant="h3" sx={{ 
                color: '#FFD700', 
                textAlign: 'center', 
                fontWeight: 700, 
                mb: 6 
              }}>
                So funktioniert&apos;s
              </Typography>
              <Grid container spacing={4}>
                {processSteps.map((step, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <motion.div
                      
                      
                      
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                          margin: '0 auto 20px',
                          color: '#1a1a2e',
                          fontSize: '1.5rem',
                          fontWeight: 800
                        }}>
                          {step.step}
                        </Box>
                        <Typography variant="h6" sx={{
                          color: '#FFD700',
                          fontWeight: 600,
                          mb: 2
                        }}>
                          {step.title}
                        </Typography>
                        <Typography sx={{
                          color: 'rgba(255,255,255,0.8)',
                          lineHeight: 1.6
                        }}>
                          {step.description}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ 
              color: '#FFD700', 
              fontWeight: 700, 
              mb: 4 
            }}>
              Bereit für dein persönliches Reading?
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/reading"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#1a1a2e',
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1.2rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 30px rgba(255, 215, 0, 0.3)'
                  }
                }}
              >
                Reading starten <ArrowRight size={24} style={{ marginLeft: 8 }} />
              </Button>
              <Button
                component={Link}
                href="/chart"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#FFD700',
                  color: '#FFD700',
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1.2rem',
                  '&:hover': {
                    borderColor: '#FFA500',
                    color: '#FFA500',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Chart erstellen <BookOpen size={24} style={{ marginLeft: 8 }} />
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
