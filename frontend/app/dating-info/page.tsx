"use client";
import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Paper, Chip, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star, ArrowRight, CheckCircle, Users, Calendar, MapPin, MessageCircle, Zap, Eye, Moon, Flame } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';
import Link from 'next/link';

export default function DatingInfoPage() {
  const [activeSection, setActiveSection] = useState(0);

  const datingStyles = [
    {
      id: 'magnetic',
      title: '💫 Magnetische Liebe',
      color: '#10B981',
      icon: <Zap size={32} />,
      description: 'Anziehung, die dich auflädt – finde Menschen, die deine pure Lebensenergie erwidern.',
      features: ['Aufladen statt Ausbrennen', 'Strahlen statt Kompromiss'],
      path: '/dating/generator'
    },
    {
      id: 'dynamic',
      title: '🔥 Dynamische Liebe',
      color: '#F59E0B',
      icon: <Zap size={32} />,
      description: 'Beziehungen voller Bewegung, Inspiration und Abenteuer.',
      features: ['Reaktiv & initiativ', 'Multi-Tasking auf Herzebene'],
      path: '/dating/manifesting-generator'
    },
    {
      id: 'intuitive',
      title: '🌙 Intuitive Liebe',
      color: '#8B5CF6',
      icon: <Eye size={32} />,
      description: 'Tiefe, die dich wirklich erkennt und wertschätzt.',
      features: ['Echte Einladungen', 'Weisheit anerkannt'],
      path: '/dating/projector'
    },
    {
      id: 'reflective',
      title: '🌊 Reflektive Liebe',
      color: '#06B6D4',
      icon: <Moon size={32} />,
      description: 'Verbindungen, die dir Raum schenken, um dich selbst in Liebe zu erkennen.',
      features: ['Sensibilität als Stärke', 'Spiegelung ohne Masken'],
      path: '/dating/reflector'
    },
    {
      id: 'passionate',
      title: '⚡ Leidenschaftliche Liebe',
      color: '#EF4444',
      icon: <Flame size={32} />,
      description: 'Intensität, die nicht ausweicht, sondern gemeinsam brennt.',
      features: ['Power teilen', 'Unabhängigkeit respektieren'],
      path: '/dating/manifestor'
    }
  ];

  const datingFeatures = [
    {
      icon: <Users size={32} />,
      title: "Kompatible Matches",
      description: "Finde Menschen mit kompatibler Human Design Energie",
      color: "#ef4444"
    },
    {
      icon: <Calendar size={32} />,
      title: "Events & Meetups",
      description: "Besuche Human Design Events und Workshops",
      color: "#f59e0b"
    },
    {
      icon: <MapPin size={32} />,
      title: "Lokale Community",
      description: "Entdecke Human Design Enthusiasten in deiner Nähe",
      color: "#10b981"
    },
    {
      icon: <MessageCircle size={32} />,
      title: "Authentische Verbindungen",
      description: "Baue echte Beziehungen basierend auf Human Design",
      color: "#8b5cf6"
    }
  ];

  const datingBenefits = [
    "Finde Menschen mit kompatibler Energie",
    "Besuche inspirierende Human Design Events",
    "Baue authentische Beziehungen auf",
    "Lerne von Gleichgesinnten",
    "Entdecke deine lokale Community",
    "Wachse durch bewusste Verbindungen"
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
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
              <Heart size={48} color="#FFD700" />
              <Typography variant="h1" sx={{
                color: '#FFD700',
                fontWeight: 800,
                textShadow: '0 4px 20px rgba(255, 215, 0, 0.8)',
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🌟 Liebe, die auf Energie basiert
              </Typography>
              <Heart size={48} color="#FFD700" />
            </Box>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <Typography variant="h4" sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 6,
                maxWidth: 900,
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 300
              }}>
                Du sitzt da, zwischen Cappuccino und endlosem Swipen.<br/>
                1000 Gesichter – und doch kein echtes Leuchten.
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              <Typography variant="h5" sx={{
                color: 'rgba(255,255,255,0.8)',
                mb: 6,
                maxWidth: 900,
                mx: 'auto',
                lineHeight: 1.7,
                fontStyle: 'italic'
              }}>
                Dein Herz sehnt sich nicht nach mehr Matches, sondern nach <strong>Resonanz</strong>.<br/>
                Nach jemandem, der deine Frequenz wirklich hört.
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
            >
              <Typography variant="h4" sx={{
                color: '#FFD700',
                maxWidth: 900,
                mx: 'auto',
                mb: 8,
                lineHeight: 1.6,
                fontWeight: 600
              }}>
                👉 Willkommen bei Moonlight – wo Verbindungen nicht oberflächlich sind, sondern <strong>energetisch echt</strong>.
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Warum Energie wichtiger ist */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <Box textAlign="center" mb={8}>
            <Typography 
              variant="h3" 
              sx={{ 
                color: 'white',
                fontWeight: 700,
                mb: 4,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Warum Energie wichtiger ist als Chemie
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                maxWidth: 800,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
                fontWeight: 300
              }}
            >
              Chemie vergeht. Energie bleibt.
            </Typography>

            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 900,
                mx: 'auto',
                mb: 6,
                lineHeight: 1.7
              }}
            >
              Wenn deine Frequenz und die Frequenz deines Partners harmonieren, entsteht Liebe, die nicht nur heute, sondern auch morgen trägt.
            </Typography>

            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 900,
                mx: 'auto',
                mb: 8,
                lineHeight: 1.7
              }}
            >
              Wir zeigen dir, wie DU am besten in Beziehungen strahlst – und welche Matches dich auf Herz- und Seelenebene wirklich erfüllen.
            </Typography>
          </Box>
        </motion.div>

        {/* Dating-Stile */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          <Box mb={8}>
            <Typography 
              variant="h3" 
              sx={{ 
                color: 'white',
                fontWeight: 700,
                mb: 6,
                textAlign: 'center',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Entdecke deinen Dating-Stil
            </Typography>

            <Grid container spacing={4}>
              {datingStyles.map((style) => (
                <Grid item xs={12} md={6} key={style.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + Math.random() * 0.3, duration: 0.6 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        background: `linear-gradient(135deg, ${style.color}15 0%, ${style.color}08 100%)`,
                        backdropFilter: 'blur(15px)',
                        border: `1px solid ${style.color}40`,
                        borderRadius: 3,
                        transition: 'all 0.4s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `radial-gradient(circle at 50% 0%, ${style.color}30 0%, transparent 70%)`,
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        },
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: `0 20px 40px ${style.color}40, 0 0 60px ${style.color}30`,
                          border: `1px solid ${style.color}60`,
                          '&::before': {
                            opacity: 1
                          }
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Box sx={{ 
                            color: style.color, 
                            mr: 2,
                            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
                            textShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
                          }}>
                            {style.icon}
                          </Box>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              color: 'white',
                              fontWeight: 700,
                              textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                            }}
                          >
                            {style.title}
                          </Typography>
                        </Box>
                        
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                            mb: 3,
                            lineHeight: 1.6,
                            textShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
                            fontSize: '1rem'
                          }}
                        >
                          {style.description}
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                          {style.features.map((feature, index) => (
                            <Chip
                              key={index}
                              label={feature}
                              size="small"
                              sx={{
                                mr: 1,
                                mb: 1,
                                background: `${style.color}25`,
                                color: style.color,
                                border: `1px solid ${style.color}40`,
                                fontWeight: 500,
                                backdropFilter: 'blur(5px)',
                                boxShadow: `0 0 10px ${style.color}20`,
                                '&:hover': {
                                  background: `${style.color}35`,
                                  transform: 'scale(1.05)'
                                }
                              }}
                            />
                          ))}
                        </Box>

                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            background: `linear-gradient(45deg, ${style.color}, ${style.color}dd)`,
                            color: 'white',
                            fontWeight: 600,
                            py: 1.5,
                            '&:hover': {
                              background: `linear-gradient(45deg, ${style.color}dd, ${style.color})`,
                            }
                          }}
                          component={Link}
                          href={style.path}
                        >
                          Entdecken
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Was ist Dating & Events */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.8 }}
        >
          <Card sx={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            mb: 6
          }}>
            <CardContent sx={{ p: 6 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Sparkles size={48} color="#FFD700" style={{ marginBottom: 16 }} />
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                  Dating & Events in Human Design
                </Typography>
                <Typography sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  maxWidth: 900,
                  mx: 'auto'
                }}>
                  Entdecke eine neue Art des Dating und der Verbindung basierend auf Human Design. 
                  Finde Menschen mit kompatibler Energie, besuche inspirierende Events und baue 
                  authentische Beziehungen auf. Unsere Plattform verbindet dich mit Gleichgesinnten, 
                  die deine Reise zur Selbsterkenntnis teilen.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dating Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Typography variant="h3" sx={{ 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6 
          }}>
            Unsere Features
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {datingFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                >
                  <Card sx={{
                    background: `linear-gradient(135deg, ${feature.color}15 0%, ${feature.color}08 100%)`,
                    borderRadius: 3,
                    border: `1px solid ${feature.color}40`,
                    backdropFilter: 'blur(15px)',
                    height: '100%',
                    transition: 'all 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(circle at 50% 0%, ${feature.color}30 0%, transparent 70%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    },
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: `0 20px 40px ${feature.color}40, 0 0 60px ${feature.color}30`,
                      border: `1px solid ${feature.color}60`,
                      '&::before': {
                        opacity: 1
                      }
                    }
                  }}>
                    <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 2 }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${feature.color}, ${feature.color}80)`,
                        margin: '0 auto 20px',
                        color: '#fff',
                        filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))',
                        boxShadow: `0 0 20px ${feature.color}40`
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{
                        color: 'white',
                        fontWeight: 700,
                        mb: 2,
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{
                        color: 'rgba(255,255,255,0.9)',
                        lineHeight: 1.6,
                        textShadow: '0 0 5px rgba(255, 255, 255, 0.2)'
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

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Card sx={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            mb: 6
          }}>
            <CardContent sx={{ p: 6 }}>
              <Typography variant="h3" sx={{ 
                color: 'white', 
                textAlign: 'center', 
                fontWeight: 700, 
                mb: 4 
              }}>
                Warum Human Design Dating?
              </Typography>
              <Grid container spacing={3}>
                {datingBenefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
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

        {/* Mini-Story */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.8 }}
        >
          <Box textAlign="center" mb={8}>
            <Paper
              sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                p: 6
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#FFD700',
                  fontWeight: 600,
                  mb: 4,
                  fontSize: { xs: '1.8rem', md: '2.2rem' }
                }}
              >
                Mini-Story für Herz & Seele
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  fontWeight: 300
                }}
              >
                „Stell dir vor, du triffst jemanden, bei dem du dich sofort gesehen fühlst –<br/>
                nicht wegen seiner Worte, sondern wegen der Stille zwischen euch.
              </Typography>

              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#FFD700',
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  fontWeight: 600,
                  mt: 3
                }}
              >
                Dieses Gefühl von ‚Ankommen‘ – das ist energetische Liebe."
              </Typography>
            </Paper>
          </Box>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ 
              color: 'white',
              fontWeight: 700,
              mb: 4,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}>
              Bist du bereit für Liebe, die deine Seele berührt?
            </Typography>
            
            <Typography variant="h5" sx={{ 
              color: 'rgba(255,255,255,0.8)',
              maxWidth: 800,
              mx: 'auto',
              mb: 6,
              lineHeight: 1.6
            }}>
              ✨ Entdecke jetzt deine energetische Beziehungs-DNA<br/>
              ✨ Finde dein perfektes Match – nicht nur für den Moment, sondern für dein Leben.
            </Typography>

            <Button
              component={Link}
              href="/dating"
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
                color: '#23233a',
                fontWeight: 700,
                fontSize: '1.2rem',
                px: 6,
                py: 2,
                borderRadius: 3,
                '&:hover': {
                  background: 'linear-gradient(45deg, #fbbf24, #FFD700)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)'
                }
              }}
            >
              Jetzt starten
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
