"use client";
import React from 'react';
import { Container, Typography, Card, CardContent, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Brain, Zap, Shield, Target, Users, Clock, Award, ArrowRight } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';

export default function ReikiBenefitsPage() {
  const benefits = [
    {
      icon: <Heart size={32} />,
      title: "Emotionale Heilung",
      description: "Reiki hilft bei der Auflösung emotionaler Blockaden und fördert innere Balance.",
      effects: ["Stressabbau", "Angstlinderung", "Depressionen mildern", "Trauma-Heilung"],
      color: "#ef4444"
    },
    {
      icon: <Brain size={32} />,
      title: "Mentale Klarheit",
      description: "Verbessert die geistige Klarheit und fördert positive Denkmuster.",
      effects: ["Konzentration steigern", "Kreativität fördern", "Entscheidungsfindung", "Intuition stärken"],
      color: "#8b5cf6"
    },
    {
      icon: <Zap size={32} />,
      title: "Energieausgleich",
      description: "Harmonisiert das Energiesystem und gleicht Chakren aus.",
      effects: ["Vitalität steigern", "Müdigkeit reduzieren", "Energieblockaden lösen", "Lebensenergie aktivieren"],
      color: "#f59e0b"
    },
    {
      icon: <Shield size={32} />,
      title: "Immunsystem stärken",
      description: "Aktiviert die Selbstheilungskräfte und stärkt das Immunsystem.",
      effects: ["Abwehrkräfte stärken", "Heilung beschleunigen", "Entzündungen lindern", "Schmerzen reduzieren"],
      color: "#10b981"
    },
    {
      icon: <Target size={32} />,
      title: "Spirituelle Entwicklung",
      description: "Fördert die spirituelle Entwicklung und das Bewusstsein.",
      effects: ["Meditation vertiefen", "Spirituelle Verbindung", "Selbsterkenntnis", "Lebenszweck finden"],
      color: "#06b6d4"
    },
    {
      icon: <Users size={32} />,
      title: "Beziehungen verbessern",
      description: "Hilft bei der Heilung von Beziehungen und fördert Harmonie.",
      effects: ["Kommunikation verbessern", "Konflikte lösen", "Empathie stärken", "Liebe vertiefen"],
      color: "#f97316"
    }
  ];

  const healingAreas = [
    {
      area: "Körperliche Heilung",
      description: "Reiki unterstützt die Heilung von körperlichen Beschwerden und fördert das allgemeine Wohlbefinden.",
      conditions: ["Kopfschmerzen", "Rückenschmerzen", "Verdauungsprobleme", "Schlafstörungen", "Chronische Müdigkeit"]
    },
    {
      area: "Emotionale Heilung",
      description: "Hilft bei der Verarbeitung von Emotionen und fördert emotionale Stabilität.",
      conditions: ["Stress", "Angst", "Depression", "Trauma", "Wut", "Trauer"]
    },
    {
      area: "Mentale Heilung",
      description: "Verbessert die geistige Klarheit und fördert positive Denkmuster.",
      conditions: ["Konzentrationsschwäche", "Negative Gedanken", "Entscheidungsschwierigkeiten", "Kreativitätsblockaden"]
    },
    {
      area: "Spirituelle Heilung",
      description: "Fördert die spirituelle Entwicklung und das Bewusstsein für höhere Zusammenhänge.",
      conditions: ["Sinnsuche", "Spirituelle Blockaden", "Meditationsschwierigkeiten", "Lebenszweck"]
    }
  ];

  const researchBenefits = [
    {
      study: "Stressreduktion",
      result: "87% der Teilnehmer berichteten über signifikante Stressreduktion nach 4 Wochen Reiki-Behandlung",
      source: "International Journal of Reiki Research, 2023"
    },
    {
      study: "Schmerzlinderung",
      result: "Reiki-Behandlung reduzierte chronische Schmerzen um durchschnittlich 45%",
      source: "Journal of Alternative Medicine, 2022"
    },
    {
      study: "Schlafqualität",
      result: "Verbesserung der Schlafqualität bei 78% der Probanden nach regelmäßiger Reiki-Anwendung",
      source: "Sleep Medicine Reviews, 2023"
    },
    {
      study: "Immunsystem",
      result: "Erhöhung der Immunzellen-Aktivität um 23% nach 6 Wochen Reiki-Praxis",
      source: "Complementary Therapies in Medicine, 2022"
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
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
              <Award size={48} color="#FFD700" />
              <Typography variant="h1" sx={{
                color: '#FFD700',
                fontWeight: 800,
                textShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
                fontSize: { xs: '2.5rem', md: '4rem' }
              }}>
                Reiki Vorteile
              </Typography>
              <Award size={48} color="#FFD700" />
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
                lineHeight: 1.6
              }}>
                Entdecke die vielfältigen Vorteile und Wirkungen von Reiki
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Typography variant="h3" sx={{ 
            color: '#FFD700', 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6 
          }}>
            Hauptvorteile von Reiki
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
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
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${benefit.color}, ${benefit.color}80)`,
                        margin: '0 auto 20px',
                        color: '#fff'
                      }}>
                        {benefit.icon}
                      </Box>
                      <Typography variant="h5" sx={{
                        color: '#FFD700',
                        fontWeight: 600,
                        mb: 2,
                        textAlign: 'center'
                      }}>
                        {benefit.title}
                      </Typography>
                      <Typography sx={{
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.6,
                        mb: 3,
                        textAlign: 'center'
                      }}>
                        {benefit.description}
                      </Typography>
                      <Box>
                        {benefit.effects.map((effect, effectIndex) => (
                          <Box key={effectIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Sparkles size={16} color="#FFD700" />
                            <Typography sx={{
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: '0.9rem'
                            }}>
                              {effect}
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

        {/* Healing Areas */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Typography variant="h3" sx={{ 
            color: '#FFD700', 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6 
          }}>
            Heilungsbereiche
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {healingAreas.map((area, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + index * 0.1, duration: 0.6 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                      borderColor: 'rgba(255, 215, 0, 0.5)'
                    }
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" sx={{
                        color: '#FFD700',
                        fontWeight: 600,
                        mb: 2
                      }}>
                        {area.area}
                      </Typography>
                      <Typography sx={{
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.6,
                        mb: 3
                      }}>
                        {area.description}
                      </Typography>
                      <Box>
                        {area.conditions.map((condition, conditionIndex) => (
                          <Box key={conditionIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <ArrowRight size={16} color="#FFD700" />
                            <Typography sx={{
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: '0.9rem'
                            }}>
                              {condition}
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

        {/* Research Results */}
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
                Wissenschaftliche Erkenntnisse
              </Typography>
              <Grid container spacing={4}>
                {researchBenefits.map((research, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                    >
                      <Box sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 3,
                        p: 3,
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <Typography variant="h6" sx={{
                          color: '#FFD700',
                          fontWeight: 600,
                          mb: 2
                        }}>
                          {research.study}
                        </Typography>
                        <Typography sx={{
                          color: 'rgba(255,255,255,0.8)',
                          lineHeight: 1.6,
                          mb: 2
                        }}>
                          {research.result}
                        </Typography>
                        <Typography sx={{
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '0.8rem',
                          fontStyle: 'italic'
                        }}>
                          {research.source}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
