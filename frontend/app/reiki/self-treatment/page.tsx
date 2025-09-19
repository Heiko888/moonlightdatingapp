"use client";
import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Grid, Stepper, Step, StepLabel, StepContent } from '@mui/material';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Brain, Zap, Eye, Crown, Shield, Target, Users, Clock, Award, ArrowRight, Play, Pause } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';

export default function ReikiSelfTreatmentPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const selfTreatmentSteps = [
    {
      title: "Vorbereitung",
      description: "Bereite dich und deinen Raum für die Reiki-Selbstbehandlung vor",
      icon: <Shield size={24} />,
      instructions: [
        "Sorge für eine ruhige, störungsfreie Umgebung",
        "Zünde eine Kerze oder Räucherstäbchen an",
        "Setze oder lege dich bequem hin",
        "Atme tief ein und aus, um zur Ruhe zu kommen",
        "Setze eine positive Absicht für deine Heilung"
      ],
      duration: "5 Minuten"
    },
    {
      title: "Energie aktivieren",
      description: "Aktiviere deine Reiki-Energie und verbinde dich mit der Quelle",
      icon: <Zap size={24} />,
      instructions: [
        "Bitte um Reiki-Energie (mündlich oder im Geiste)",
        "Visualisiere goldenes Licht, das von oben in dich fließt",
        "Spüre, wie die Energie durch deinen Körper strömt",
        "Aktiviere das Cho Ku Rei Symbol für Schutz und Kraft",
        "Fühle dich mit der universellen Lebensenergie verbunden"
      ],
      duration: "3 Minuten"
    },
    {
      title: "Kopf und Hals",
      description: "Behandle Kopf, Gesicht und Halsbereich",
      icon: <Brain size={24} />,
      instructions: [
        "Lege deine Hände sanft auf deine Schläfen",
        "Halte die Position für 3-5 Minuten",
        "Bewege deine Hände zum Hinterkopf",
        "Behandle Stirn und Gesicht",
        "Lege deine Hände um den Hals (vorne und hinten)"
      ],
      duration: "15 Minuten"
    },
    {
      title: "Herz und Brust",
      description: "Fokussiere auf Herz-Chakra und Brustbereich",
      icon: <Heart size={24} />,
      instructions: [
        "Lege deine Hände über dein Herz",
        "Aktiviere das Sei He Ki Symbol für emotionale Heilung",
        "Spüre, wie sich dein Herz öffnet",
        "Behandle die Lungen und den Brustkorb",
        "Lass Liebe und Mitgefühl fließen"
      ],
      duration: "10 Minuten"
    },
    {
      title: "Bauch und Solarplexus",
      description: "Harmonisiere Solarplexus und Verdauungssystem",
      icon: <Target size={24} />,
      instructions: [
        "Lege deine Hände auf den Solarplexus (oberer Bauch)",
        "Spüre, wie sich Anspannung löst",
        "Behandle den gesamten Bauchbereich",
        "Fokussiere auf Verdauung und Emotionen",
        "Lass Wärme und Entspannung entstehen"
      ],
      duration: "10 Minuten"
    },
    {
      title: "Abschluss und Erdung",
      description: "Schließe die Session ab und erde dich",
      icon: <Crown size={24} />,
      instructions: [
        "Danke der Reiki-Energie für die Heilung",
        "Visualisiere das Raku-Symbol für Erdung",
        "Stelle dir vor, wie überschüssige Energie in die Erde fließt",
        "Atme tief ein und aus",
        "Öffne langsam deine Augen und kehre ins Hier und Jetzt zurück"
      ],
      duration: "5 Minuten"
    }
  ];

  const handPositions = [
    { position: "Kopf", description: "Schläfen, Hinterkopf, Stirn", duration: "5 Min" },
    { position: "Hals", description: "Vorder- und Rückseite des Halses", duration: "3 Min" },
    { position: "Herz", description: "Herz-Chakra, Brustbereich", duration: "5 Min" },
    { position: "Solarplexus", description: "Oberer Bauch, Magen", duration: "5 Min" },
    { position: "Unterbauch", description: "Unterer Bauch, Darm", duration: "5 Min" },
    { position: "Knie", description: "Beide Knie gleichzeitig", duration: "3 Min" },
    { position: "Füße", description: "Fußsohlen, Energieausgleich", duration: "5 Min" }
  ];

  const startSession = () => {
    setIsSessionActive(true);
    setActiveStep(0);
  };

  const nextStep = () => {
    if (activeStep < selfTreatmentSteps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      setIsSessionActive(false);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

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
                textShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
                fontSize: { xs: '2.5rem', md: '4rem' }
              }}>
                Reiki Selbstbehandlung
              </Typography>
              <Heart size={48} color="#FFD700" />
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
                Lerne, wie du Reiki für deine eigene Heilung anwenden kannst
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {!isSessionActive ? (
          <>
            {/* Hand Positions Guide */}
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
                Handpositionen für Selbstbehandlung
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 8 }}>
                {handPositions.map((pos, index) => (
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
                          transform: 'translateY(-4px)',
                          boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
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
                            <Sparkles size={24} />
                          </Box>
                          <Typography variant="h6" sx={{
                            color: '#FFD700',
                            fontWeight: 600,
                            mb: 2
                          }}>
                            {pos.position}
                          </Typography>
                          <Typography sx={{
                            color: 'rgba(255,255,255,0.8)',
                            lineHeight: 1.6,
                            mb: 2
                          }}>
                            {pos.description}
                          </Typography>
                          <Typography sx={{
                            color: '#FFD700',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                          }}>
                            {pos.duration}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>

            {/* Start Session Button */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  onClick={startSession}
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
                  Selbstbehandlung starten <Play size={24} style={{ marginLeft: 8 }} />
                </Button>
              </Box>
            </motion.div>
          </>
        ) : (
          /* Active Session */
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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
                  Reiki Selbstbehandlung - Schritt {activeStep + 1}
                </Typography>
                
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    margin: '0 auto 20px',
                    color: '#1a1a2e'
                  }}>
                    {selfTreatmentSteps[activeStep].icon}
                  </Box>
                  <Typography variant="h4" sx={{
                    color: '#FFD700',
                    fontWeight: 600,
                    mb: 2
                  }}>
                    {selfTreatmentSteps[activeStep].title}
                  </Typography>
                  <Typography sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '1.1rem',
                    mb: 2
                  }}>
                    {selfTreatmentSteps[activeStep].description}
                  </Typography>
                  <Typography sx={{
                    color: '#FFD700',
                    fontWeight: 600
                  }}>
                    Dauer: {selfTreatmentSteps[activeStep].duration}
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  {selfTreatmentSteps[activeStep].instructions.map((instruction, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Sparkles size={20} color="#FFD700" />
                      <Typography sx={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '1rem'
                      }}>
                        {instruction}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    onClick={prevStep}
                    disabled={activeStep === 0}
                    variant="outlined"
                    sx={{
                      borderColor: '#FFD700',
                      color: '#FFD700',
                      '&:hover': {
                        borderColor: '#FFA500',
                        color: '#FFA500'
                      }
                    }}
                  >
                    Zurück
                  </Button>
                  
                  <Button
                    onClick={nextStep}
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      color: '#1a1a2e',
                      fontWeight: 700,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)'
                      }
                    }}
                  >
                    {activeStep === selfTreatmentSteps.length - 1 ? 'Beenden' : 'Weiter'} 
                    <ArrowRight size={20} style={{ marginLeft: 8 }} />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}
