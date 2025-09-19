"use client";
import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Grid, Chip, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Brain, Zap, Eye, Crown, Shield, Target, Users, Clock, Award, ArrowRight, Play, Pause, Volume2 } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';

export default function ReikiMeditationGuidesPage() {
  const [selectedMeditation, setSelectedMeditation] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const meditationTypes = [
    {
      id: 1,
      title: "Reiki Energie-Meditation",
      description: "Verbinde dich mit der universellen Lebensenergie",
      duration: "15 Minuten",
      level: "Anfänger",
      color: "#8b5cf6",
      icon: <Zap size={32} />,
      steps: [
        "Setze dich bequem hin und schließe die Augen",
        "Atme tief ein und aus, entspanne dich",
        "Bitte um Reiki-Energie",
        "Visualisiere goldenes Licht von oben",
        "Spüre, wie die Energie durch deinen Körper fließt",
        "Lass die Energie frei fließen",
        "Danke der Energie und öffne die Augen"
      ],
      benefits: ["Energie aktivieren", "Entspannung", "Stressabbau", "Bewusstsein erweitern"]
    },
    {
      id: 2,
      title: "Chakra-Harmonisierung",
      description: "Harmonisiere und balanciere deine Chakren",
      duration: "20 Minuten",
      level: "Fortgeschritten",
      color: "#ef4444",
      icon: <Heart size={32} />,
      steps: [
        "Lege dich hin und entspanne dich",
        "Beginne mit dem Wurzel-Chakra (rot)",
        "Visualisiere rotes Licht am unteren Ende der Wirbelsäule",
        "Gehe durch alle Chakren: orange, gelb, grün, blau, indigo, violett",
        "Spüre, wie sich jedes Chakra öffnet und harmonisiert",
        "Stelle dir vor, wie alle Chakren in Balance sind",
        "Lass die Energie frei fließen und danke"
      ],
      benefits: ["Chakra-Balance", "Energieausgleich", "Emotionale Heilung", "Spirituelle Entwicklung"]
    },
    {
      id: 3,
      title: "Symbol-Meditation",
      description: "Meditiere mit Reiki-Symbolen für tiefere Heilung",
      duration: "25 Minuten",
      level: "Fortgeschritten",
      color: "#f59e0b",
      icon: <Eye size={32} />,
      steps: [
        "Sitze bequem und schließe die Augen",
        "Aktiviere das Cho Ku Rei Symbol",
        "Visualisiere das Symbol in strahlendem Weiß",
        "Spüre, wie es deine Energie verstärkt",
        "Wechsle zum Sei He Ki Symbol",
        "Lass emotionale Heilung geschehen",
        "Nutze Hon Sha Ze Sho Nen für Fernheilung",
        "Beende mit dem Raku-Symbol zur Erdung"
      ],
      benefits: ["Symbolkraft nutzen", "Tiefe Heilung", "Fernheilung", "Spirituelle Verbindung"]
    },
    {
      id: 4,
      title: "Selbstheilung-Meditation",
      description: "Aktiviere deine natürlichen Selbstheilungskräfte",
      duration: "18 Minuten",
      level: "Anfänger",
      color: "#10b981",
      icon: <Shield size={32} />,
      steps: [
        "Finde eine bequeme Position",
        "Atme tief und entspanne dich",
        "Visualisiere heilendes Licht",
        "Richte das Licht auf Bereiche, die Heilung brauchen",
        "Spüre, wie sich dein Körper entspannt",
        "Lass die Heilung geschehen",
        "Danke deinem Körper für seine Weisheit"
      ],
      benefits: ["Selbstheilung", "Immunsystem stärken", "Körperheilung", "Wohlbefinden"]
    },
    {
      id: 5,
      title: "Herz-Öffnungs-Meditation",
      description: "Öffne dein Herz für Liebe und Mitgefühl",
      duration: "12 Minuten",
      level: "Anfänger",
      color: "#06b6d4",
      icon: <Heart size={32} />,
      steps: [
        "Sitze aufrecht und lege die Hände aufs Herz",
        "Atme tief in dein Herz hinein",
        "Visualisiere grünes Licht im Herz-Chakra",
        "Spüre, wie sich dein Herz öffnet",
        "Lass Liebe und Mitgefühl fließen",
        "Sende Liebe an dich selbst und andere",
        "Danke für die Liebe in deinem Leben"
      ],
      benefits: ["Herz öffnen", "Liebe erfahren", "Mitgefühl entwickeln", "Beziehungen heilen"]
    },
    {
      id: 6,
      title: "Erdungs-Meditation",
      description: "Erde dich und verbinde dich mit der Erde",
      duration: "10 Minuten",
      level: "Anfänger",
      color: "#f97316",
      icon: <Target size={32} />,
      steps: [
        "Stehe oder sitze mit den Füßen auf dem Boden",
        "Visualisiere Wurzeln, die von deinen Füßen in die Erde wachsen",
        "Spüre die Erdenergie, die zu dir aufsteigt",
        "Lass überschüssige Energie in die Erde fließen",
        "Fühle dich geerdet und stabil",
        "Danke der Erde für ihre Unterstützung",
        "Kehre langsam ins Hier und Jetzt zurück"
      ],
      benefits: ["Erdung", "Stabilität", "Energieausgleich", "Präsenz"]
    }
  ];

  const meditationTips = [
    {
      tip: "Regelmäßigkeit",
      description: "Meditiere täglich zur gleichen Zeit für beste Ergebnisse",
      icon: <Clock size={24} />
    },
    {
      tip: "Ruhe",
      description: "Wähle einen ruhigen Ort ohne Ablenkungen",
      icon: <Shield size={24} />
    },
    {
      tip: "Geduld",
      description: "Sei geduldig mit dir selbst - Meditation braucht Übung",
      icon: <Heart size={24} />
    },
    {
      tip: "Absicht",
      description: "Setze eine klare Absicht vor jeder Meditation",
      icon: <Target size={24} />
    }
  ];

  const handleMeditationClick = (meditation: any) => {
    setSelectedMeditation(meditation);
    setOpenDialog(true);
  };

  const startMeditation = () => {
    setIsPlaying(true);
    // Hier würde normalerweise ein Audio-Player gestartet werden
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
              <Brain size={48} color="#FFD700" />
              <Typography variant="h1" sx={{
                color: '#FFD700',
                fontWeight: 800,
                textShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
                fontSize: { xs: '2.5rem', md: '4rem' }
              }}>
                Reiki Meditation
              </Typography>
              <Brain size={48} color="#FFD700" />
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
                Entdecke geführte Reiki-Meditations-Anleitungen für tiefe Entspannung und Heilung
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Meditation Types */}
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
            Meditations-Anleitungen
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {meditationTypes.map((meditation, index) => (
              <Grid item xs={12} sm={6} md={4} key={meditation.id}>
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
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      borderColor: 'rgba(255, 215, 0, 0.5)'
                    }
                  }}
                  onClick={() => handleMeditationClick(meditation)}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${meditation.color}, ${meditation.color}80)`,
                        margin: '0 auto 20px',
                        color: '#fff'
                      }}>
                        {meditation.icon}
                      </Box>
                      <Typography variant="h5" sx={{
                        color: '#FFD700',
                        fontWeight: 600,
                        mb: 2,
                        textAlign: 'center'
                      }}>
                        {meditation.title}
                      </Typography>
                      <Typography sx={{
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.6,
                        mb: 3,
                        textAlign: 'center'
                      }}>
                        {meditation.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                        <Chip 
                          label={meditation.duration} 
                          size="small"
                          sx={{ 
                            backgroundColor: meditation.color,
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                        <Chip 
                          label={meditation.level} 
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Button
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
                          Anleitung ansehen <ArrowRight size={16} style={{ marginLeft: 8 }} />
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Meditation Tips */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
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
                Meditations-Tipps
              </Typography>
              <Grid container spacing={4}>
                {meditationTips.map((tip, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 + index * 0.1, duration: 0.6 }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
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
                          {tip.icon}
                        </Box>
                        <Typography variant="h6" sx={{
                          color: '#FFD700',
                          fontWeight: 600,
                          mb: 2
                        }}>
                          {tip.tip}
                        </Typography>
                        <Typography sx={{
                          color: 'rgba(255,255,255,0.8)',
                          lineHeight: 1.6
                        }}>
                          {tip.description}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Meditation Detail Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(26, 26, 46, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 4
            }
          }}
        >
          <DialogTitle sx={{ 
            color: '#FFD700', 
            fontWeight: 700, 
            textAlign: 'center',
            fontSize: '1.5rem'
          }}>
            {selectedMeditation?.title}
          </DialogTitle>
          <DialogContent>
            {selectedMeditation && (
              <Box>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                    {selectedMeditation.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                    <Chip 
                      label={selectedMeditation.duration} 
                      sx={{ 
                        backgroundColor: selectedMeditation.color,
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                    <Chip 
                      label={selectedMeditation.level} 
                      sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                  <Button
                    onClick={startMeditation}
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
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    {isPlaying ? 'Pausieren' : 'Meditation starten'}
                  </Button>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                      Meditations-Schritte:
                    </Typography>
                    {selectedMeditation.steps.map((step: string, index: number) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Box sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: selectedMeditation.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          flexShrink: 0,
                          mt: 0.5
                        }}>
                          {index + 1}
                        </Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {step}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                      Vorteile:
                    </Typography>
                    {selectedMeditation.benefits.map((benefit: string, index: number) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Sparkles size={16} color="#FFD700" />
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {benefit}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}
