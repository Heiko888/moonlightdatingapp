"use client";
import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Brain, Zap, Eye, Crown, Shield, Target, Users, Clock, Award, ArrowRight, BookOpen } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';
import Link from 'next/link';

export default function ReikiPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const reikiFeatures = [
    {
      icon: <Sparkles size={32} />,
      title: "Reiki Symbole",
      description: "Entdecke die kraftvollen Reiki-Symbole und ihre Bedeutung",
      path: "/reiki/symbols",
      color: "#8b5cf6"
    },
    {
      icon: <Brain size={32} />,
      title: "HD-basierte Analyse",
      description: "Reiki-Analyse basierend auf deinem Human Design Chart",
      path: "/reiki/analysis",
      color: "#ef4444"
    },
    {
      icon: <Heart size={32} />,
      title: "Session Planung",
      description: "Erstelle individuelle Reiki-Session-Pläne",
      path: "/reiki/session-plan",
      color: "#f59e0b"
    },
    {
      icon: <Zap size={32} />,
      title: "Selbstbehandlung",
      description: "Lerne Reiki-Techniken für die Selbstbehandlung",
      path: "/reiki/self-treatment",
      color: "#10b981"
    },
    {
      icon: <Eye size={32} />,
      title: "Meditation",
      description: "Reiki-Meditations-Anleitungen und -Techniken",
      path: "/reiki/meditation-guides",
      color: "#06b6d4"
    },
    {
      icon: <Award size={32} />,
      title: "Vorteile & Wirkungen",
      description: "Verstehe die Vorteile und Wirkungen von Reiki",
      path: "/reiki/benefits",
      color: "#f97316"
    }
  ];

  const reikiBenefits = [
    "Tiefe Entspannung und Stressabbau",
    "Energieausgleich und Harmonisierung",
    "Stärkung des Immunsystems",
    "Emotionale Heilung und Balance",
    "Verbesserung der Schlafqualität",
    "Steigerung der Lebensenergie",
    "Spirituelle Entwicklung",
    "Selbstheilungskräfte aktivieren"
  ];

  const reikiLevels = [
    {
      level: "1. Grad",
      title: "Reiki Einweihung",
      description: "Grundlagen des Reiki und Selbstbehandlung",
      features: ["Handpositionen lernen", "Selbstbehandlung", "Grundsymbole", "Energie spüren"]
    },
    {
      level: "2. Grad",
      title: "Reiki Symbole",
      description: "Erweiterte Techniken mit Reiki-Symbolen",
      features: ["3 Reiki-Symbole", "Fernbehandlung", "Mentalheilung", "Zeit- und Raumheilung"]
    },
    {
      level: "3. Grad",
      title: "Meister-Grad",
      description: "Reiki-Meisterschaft und Einweihungen",
      features: ["Meistersymbol", "Andere einweihen", "Lehren", "Spirituelle Führung"]
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
      
      {/* Animated Reiki Symbols Background */}
      {isClient && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden'
        }}>
        {/* Cho Ku Rei Symbols */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`chokurei-${i}`}
            style={{
              position: 'absolute',
              fontSize: '2rem',
              color: 'rgba(192, 192, 192, 0.3)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.5, 1, 0.5],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            力
          </motion.div>
        ))}
        
        {/* Sei He Ki Symbols */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`seiheki-${i}`}
            style={{
              position: 'absolute',
              fontSize: '1.5rem',
              color: 'rgba(192, 192, 192, 0.25)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.15, 0.4, 0.15]
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            平和
          </motion.div>
        ))}
        
        {/* Hon Sha Ze Sho Nen Symbols */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`honsha-${i}`}
            style={{
              position: 'absolute',
              fontSize: '1.2rem',
              color: 'rgba(192, 192, 192, 0.2)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, -360],
              scale: [0.3, 0.8, 0.3],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            本質
          </motion.div>
        ))}
        
        {/* Dai Ko Myo Symbols */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`daikomyo-${i}`}
            style={{
              position: 'absolute',
              fontSize: '1.8rem',
              color: 'rgba(192, 192, 192, 0.3)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.15, 0.4, 0.15],
              scale: [0.4, 1.2, 0.4]
            }}
            transition={{
              duration: 18 + Math.random() * 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            大光明
          </motion.div>
        ))}
        
        {/* Floating Energy Orbs */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            style={{
              position: 'absolute',
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(192, 192, 192, 0.4) 0%, rgba(192, 192, 192, 0.2) 50%, transparent 100%)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
        </Box>
      )}
      
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles size={48} color="#C0C0C0" />
              </motion.div>
              <motion.div
                animate={{
                  textShadow: [
                    '0 4px 20px rgba(192, 192, 192, 0.3)',
                    '0 4px 30px rgba(192, 192, 192, 0.6), 0 0 40px rgba(192, 192, 192, 0.4)',
                    '0 4px 20px rgba(192, 192, 192, 0.3)'
                  ],
                  color: [
                    '#C0C0C0',
                    '#E6E6FA',
                    '#C0C0C0'
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
                  fontSize: { xs: '2.5rem', md: '4rem' }
                }}>
                  Reiki & Energiearbeit
                </Typography>
              </motion.div>
              <motion.div
                animate={{
                  rotate: [0, -360],
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <Sparkles size={48} color="#C0C0C0" />
              </motion.div>
            </Box>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <Typography variant="h5" sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6,
                mb: 4
              }}>
                Entdecke die heilende Kraft der universellen Lebensenergie
              </Typography>
            </motion.div>
            
            {/* Reiki Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 1.2 }}
            >
              <Box sx={{
                position: 'relative',
                maxWidth: 600,
                mx: 'auto',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                border: '2px solid rgba(192, 192, 192, 0.3)'
              }}>
                <Box
                  component="img"
                  src="/images/20250908_1712_Reiki Energiefluss Hände_simple_compose_01k4my21c7e5gbjfc386rqb1b6 bearbeitet.png"
                  alt="Reiki Energie und Heilung"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: { xs: 400, md: 500 },
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                />
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* Was ist Reiki */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
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
                <Heart size={48} color="#FFD700" style={{ marginBottom: 16 }} />
                <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 700, mb: 3 }}>
                  Was ist Reiki?
                </Typography>
                <Typography sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  maxWidth: 900,
                  mx: 'auto'
                }}>
                  Reiki ist eine japanische Heilmethode, die universelle Lebensenergie nutzt, um Körper, Geist und Seele zu harmonisieren. 
                  Durch sanfte Berührung oder Fernbehandlung wird die natürliche Selbstheilungskraft aktiviert und das Energiesystem 
                  ins Gleichgewicht gebracht. Reiki wirkt auf allen Ebenen und unterstützt ganzheitliche Heilung.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reiki Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Typography variant="h3" sx={{ 
            color: '#FFD700', 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6 
          }}>
            Unsere Reiki-Features
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {reikiFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
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
                        background: `linear-gradient(135deg, ${feature.color}, ${feature.color}80)`,
                        margin: '0 auto 20px',
                        color: '#fff'
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{
                        color: '#FFD700',
                        fontWeight: 600,
                        mb: 2
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.6,
                        mb: 3
                      }}>
                        {feature.description}
                      </Typography>
                      <Button
                        component={Link}
                        href={feature.path}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: '#FFD700',
                          color: '#FFD700',
                          '&:hover': {
                            borderColor: '#FFA500',
                            color: '#FFA500',
                            backgroundColor: 'rgba(255, 215, 0, 0.1)'
                          }
                        }}
                      >
                        Entdecken <ArrowRight size={16} style={{ marginLeft: 8 }} />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
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
                Wirkungen von Reiki
              </Typography>
              <Grid container spacing={3}>
                {reikiBenefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Sparkles size={24} color="#FFD700" />
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

        {/* Reiki Levels */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <Typography variant="h3" sx={{ 
            color: '#FFD700', 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6 
          }}>
            Reiki-Grade
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {reikiLevels.map((level, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + index * 0.1, duration: 0.6 }}
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
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Crown size={40} color="#FFD700" style={{ marginBottom: 12 }} />
                        <Typography variant="h5" sx={{
                          color: '#FFD700',
                          fontWeight: 700,
                          mb: 1
                        }}>
                          {level.level}
                        </Typography>
                        <Typography variant="h6" sx={{
                          color: 'rgba(255,255,255,0.9)',
                          fontWeight: 600,
                          mb: 2
                        }}>
                          {level.title}
                        </Typography>
                        <Typography sx={{
                          color: 'rgba(255,255,255,0.8)',
                          lineHeight: 1.6,
                          mb: 3
                        }}>
                          {level.description}
                        </Typography>
                      </Box>
                      <Box>
                        {level.features.map((feature, featureIndex) => (
                          <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Sparkles size={16} color="#FFD700" />
                            <Typography sx={{
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: '0.9rem'
                            }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ 
              color: '#FFD700', 
              fontWeight: 700, 
              mb: 4 
            }}>
              Beginne deine Reiki-Reise
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/reiki/symbols"
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
                Reiki Symbole <Sparkles size={24} style={{ marginLeft: 8 }} />
              </Button>
              <Button
                component={Link}
                href="/reiki/analysis"
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
                HD-Analyse <Brain size={24} style={{ marginLeft: 8 }} />
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
