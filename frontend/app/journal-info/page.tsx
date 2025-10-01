"use client";
import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Paper, Chip, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Star, Sparkles, ArrowRight, CheckCircle, BookOpen, BarChart3, Target, Heart } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';
import Link from 'next/link';

export default function JournalInfoPage() {
  const [activeSection, setActiveSection] = useState(0);

  const journalFeatures = [
    {
      icon: <BookOpen size={32} />,
      title: "Tägliches Journaling",
      description: "Dokumentiere deine Human Design Reise und Erkenntnisse",
      color: "#8b5cf6"
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Fortschritt Tracking",
      description: "Verfolge deine Entwicklung und Erfolge",
      color: "#10b981"
    },
    {
      icon: <Target size={32} />,
      title: "Ziel-Management",
      description: "Setze und erreiche deine Human Design Ziele",
      color: "#f59e0b"
    },
    {
      icon: <Heart size={32} />,
      title: "Selbstreflexion",
      description: "Vertiefe dein Verständnis durch bewusste Reflexion",
      color: "#ef4444"
    }
  ];

  const journalBenefits = [
    "Dokumentiere deine Reise zur Selbsterkenntnis",
    "Verfolge deine Fortschritte und Erfolge",
    "Vertiefe dein Human Design Verständnis",
    "Setze und erreiche persönliche Ziele",
    "Reflektiere über deine Erfahrungen",
    "Wachse durch bewusste Selbstbeobachtung"
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
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
              <Star size={48} color="#fef3c7" />
              <Typography variant="h1" sx={{
                color: '#fef3c7',
                fontWeight: 800,
                textShadow: '0 4px 20px rgba(0,0,0,0.6)',
                fontSize: { xs: '2.5rem', md: '4rem' }
              }}>
                Journal & Tracking
              </Typography>
              <Star size={48} color="#fef3c7" />
            </Box>
            <motion.div
              
              
              
            >
              <Typography variant="h5" sx={{
                color: 'rgba(254,243,199,0.9)',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6
              }}>
                Dokumentiere deine Reise und verfolge deine Entwicklung
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Was ist Journal & Tracking */}
        <motion.div
          
          
          
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
                  Journal & Tracking in Human Design
                </Typography>
                <Typography sx={{
                  color: 'rgba(254,243,199,0.9)',
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  maxWidth: 900,
                  mx: 'auto'
                }}>
                  Dein persönliches Journal ist ein wichtiger Teil deiner Human Design Reise. 
                  Dokumentiere deine Erkenntnisse, verfolge deine Fortschritte und vertiefe 
                  dein Verständnis durch bewusste Selbstreflexion. Unser Tracking-System 
                  hilft dir dabei, deine Entwicklung zu visualisieren und Ziele zu erreichen.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Journal Features */}
        <motion.div
          
          
          
        >
          <Typography variant="h3" sx={{ 
            color: '#fef3c7', 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6 
          }}>
            Unsere Features
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {journalFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  
                  
                  
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
                        background: `linear-gradient(135deg, ${feature.color}, ${feature.color}80)`,
                        margin: '0 auto 20px',
                        color: '#fff'
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{
                        color: '#fef3c7',
                        fontWeight: 600,
                        mb: 2
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{
                        color: 'rgba(254,243,199,0.8)',
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

        {/* Benefits */}
        <motion.div
          
          
          
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
                Warum Journal & Tracking?
              </Typography>
              <Grid container spacing={3}>
                {journalBenefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <motion.div
                      
                      
                      
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
          
          
          
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ 
              color: '#fef3c7', 
              fontWeight: 700, 
              mb: 4 
            }}>
              Bereit für dein Journal?
            </Typography>
            <Button
              component={Link}
              href="/journal"
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
              Journal starten <ArrowRight size={24} style={{ marginLeft: 8 }} />
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
