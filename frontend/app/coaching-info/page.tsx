"use client";
import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Paper, Chip, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Users, Sparkles, Star, ArrowRight, CheckCircle, MessageCircle, Video, Calendar, Heart } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';
import Link from 'next/link';

export default function CoachingInfoPage() {
  const [activeSection, setActiveSection] = useState(0);

  const coachingServices = [
    {
      icon: <MessageCircle size={32} />,
      title: "1:1 Coaching",
      description: "Persönliche Beratung mit erfahrenen Human Design Coaches",
      color: "#667eea"
    },
    {
      icon: <Video size={32} />,
      title: "Gruppen-Sessions",
      description: "Lerne in kleinen Gruppen und teile Erfahrungen",
      color: "#764ba2"
    },
    {
      icon: <Calendar size={32} />,
      title: "Workshops",
      description: "Intensive Workshops zu spezifischen Human Design Themen",
      color: "#FFD700"
    },
    {
      icon: <Heart size={32} />,
      title: "Community",
      description: "Verbinde dich mit Gleichgesinnten und finde Unterstützung",
      color: "#fef3c7"
    }
  ];

  const communityBenefits = [
    "Lerne von erfahrenen Human Design Experten",
    "Finde Gleichgesinnte auf deiner Reise",
    "Teile Erfahrungen und Erkenntnisse",
    "Erhalte Unterstützung bei Herausforderungen",
    "Entwickle dich in einer unterstützenden Umgebung",
    "Bleibe motiviert und inspiriert"
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              <Users size={48} color="#fef3c7" />
              <Typography variant="h1" sx={{
                color: '#fef3c7',
                fontWeight: 800,
                textShadow: '0 4px 20px rgba(0,0,0,0.6)',
                fontSize: { xs: '2.5rem', md: '4rem' }
              }}>
                Coaching & Community
              </Typography>
              <Users size={48} color="#fef3c7" />
            </Box>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <Typography variant="h5" sx={{
                color: 'rgba(254,243,199,0.9)',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6
              }}>
                Verbinde dich mit erfahrenen Coaches und Gleichgesinnten auf deiner Human Design Reise
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Was ist Coaching */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(254,243,199,0.1) 0%, rgba(254,243,199,0.05) 100%)',
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            border: '1px solid rgba(254,243,199,0.2)',
            backdropFilter: 'blur(20px)',
            mb: 6
          }}>
            <CardContent sx={{ p: 6 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Sparkles size={48} color="#fef3c7" style={{ marginBottom: 16 }} />
                <Typography variant="h3" sx={{ color: '#fef3c7', fontWeight: 700, mb: 3 }}>
                  Warum Human Design Coaching?
                </Typography>
                <Typography sx={{
                  color: 'rgba(254,243,199,0.9)',
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  maxWidth: 900,
                  mx: 'auto'
                }}>
                  Human Design Coaching hilft dir dabei, dein Chart zu verstehen und in dein Leben zu integrieren. 
                  Unsere erfahrenen Coaches begleiten dich auf deiner Reise zur Selbsterkenntnis und unterstützen dich dabei, 
                  deine authentische Natur zu leben. In unserer Community findest du Gleichgesinnte, 
                  die dich verstehen und unterstützen.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Coaching Services */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Typography variant="h3" sx={{ 
            color: '#fef3c7', 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6 
          }}>
            Unsere Coaching-Angebote
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {coachingServices.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                >
                  <Card sx={{
                    background: 'linear-gradient(135deg, rgba(254,243,199,0.1) 0%, rgba(254,243,199,0.05) 100%)',
                    borderRadius: 3,
                    border: '1px solid rgba(254,243,199,0.2)',
                    backdropFilter: 'blur(10px)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
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
                        background: `linear-gradient(135deg, ${service.color}, ${service.color}80)`,
                        margin: '0 auto 20px',
                        color: '#fff'
                      }}>
                        {service.icon}
                      </Box>
                      <Typography variant="h5" sx={{
                        color: '#fef3c7',
                        fontWeight: 600,
                        mb: 2
                      }}>
                        {service.title}
                      </Typography>
                      <Typography sx={{
                        color: 'rgba(254,243,199,0.8)',
                        lineHeight: 1.6
                      }}>
                        {service.description}
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
            background: 'linear-gradient(135deg, rgba(254,243,199,0.1) 0%, rgba(254,243,199,0.05) 100%)',
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            border: '1px solid rgba(254,243,199,0.2)',
            backdropFilter: 'blur(20px)',
            mb: 6
          }}>
            <CardContent sx={{ p: 6 }}>
              <Typography variant="h3" sx={{ 
                color: '#fef3c7', 
                textAlign: 'center', 
                fontWeight: 700, 
                mb: 4 
              }}>
                Vorteile unserer Community
              </Typography>
              <Grid container spacing={3}>
                {communityBenefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <CheckCircle size={24} color="#fef3c7" />
                        <Typography sx={{
                          color: 'rgba(254,243,199,0.9)',
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ 
              color: '#fef3c7', 
              fontWeight: 700, 
              mb: 4 
            }}>
              Bereit für dein Coaching?
            </Typography>
            <Button
              component={Link}
              href="/coaching"
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                color: '#1f2937',
                fontWeight: 700,
                px: 6,
                py: 2,
                borderRadius: 3,
                fontSize: '1.2rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #fde68a 0%, #fef3c7 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 30px rgba(254,243,199,0.3)'
                }
              }}
            >
              Community beitreten <ArrowRight size={24} style={{ marginLeft: 8 }} />
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
