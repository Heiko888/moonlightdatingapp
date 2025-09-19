"use client";
import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Grid, Chip, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { motion } from 'framer-motion';
import { Sparkles, Eye, Heart, Zap, Crown, Shield, Target, Users, Clock, Award, ArrowRight, BookOpen } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';

export default function ReikiSymbolsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const reikiSymbols = [
    {
      id: 1,
      name: "Cho Ku Rei",
      japanese: "力",
      meaning: "Macht und Kraft",
      description: "Das Kraftsymbol verstärkt die Reiki-Energie und schützt vor negativen Einflüssen.",
      usage: "Energie verstärken, Schutz, Reinigung",
      level: "1. Grad",
      color: "#8b5cf6",
      icon: <Zap size={32} />,
      details: {
        pronunciation: "Cho Ku Rei",
        kanji: "力",
        meaning: "Macht und Kraft",
        usage: [
          "Energie verstärken",
          "Schutz vor negativen Einflüssen",
          "Räume reinigen",
          "Objekte energetisieren"
        ],
        meditation: "Visualisiere das Symbol in strahlendem Weiß und spüre, wie es deine Energie verstärkt.",
        affirmation: "Ich bin geschützt und mit universeller Kraft verbunden."
      }
    },
    {
      id: 2,
      name: "Sei He Ki",
      japanese: "平和",
      meaning: "Frieden und Harmonie",
      description: "Das Mental-Emotional-Symbol hilft bei emotionalen Blockaden und mentalen Problemen.",
      usage: "Emotionale Heilung, mentale Klarheit, Beziehungen",
      level: "2. Grad",
      color: "#ef4444",
      icon: <Heart size={32} />,
      details: {
        pronunciation: "Sei He Ki",
        kanji: "平和",
        meaning: "Frieden und Harmonie",
        usage: [
          "Emotionale Heilung",
          "Mentale Klarheit",
          "Beziehungsprobleme lösen",
          "Trauma-Heilung"
        ],
        meditation: "Stelle dir das Symbol in sanftem Blau vor und spüre, wie es dein Herz öffnet.",
        affirmation: "Ich bin in Frieden mit mir selbst und anderen."
      }
    },
    {
      id: 3,
      name: "Hon Sha Ze Sho Nen",
      japanese: "本質",
      meaning: "Wahre Natur",
      description: "Das Fernheilungssymbol ermöglicht Reiki über Zeit und Raum hinweg.",
      usage: "Fernheilung, Vergangenheit heilen, Zukunft gestalten",
      level: "2. Grad",
      color: "#f59e0b",
      icon: <Eye size={32} />,
      details: {
        pronunciation: "Hon Sha Ze Sho Nen",
        kanji: "本質",
        meaning: "Wahre Natur",
        usage: [
          "Fernheilung",
          "Vergangenheit heilen",
          "Zukunft gestalten",
          "Karma auflösen"
        ],
        meditation: "Visualisiere das Symbol als Brücke zwischen den Zeiten und Räumen.",
        affirmation: "Ich heile die Vergangenheit und gestalte eine positive Zukunft."
      }
    },
    {
      id: 4,
      name: "Dai Ko Myo",
      japanese: "大光明",
      meaning: "Großes Licht",
      description: "Das Meistersymbol ist das kraftvollste Symbol und verbindet mit der spirituellen Quelle.",
      usage: "Spirituelle Entwicklung, Meisterschaft, Einweihungen",
      level: "3. Grad",
      color: "#10b981",
      icon: <Crown size={32} />,
      details: {
        pronunciation: "Dai Ko Myo",
        kanji: "大光明",
        meaning: "Großes Licht",
        usage: [
          "Spirituelle Entwicklung",
          "Meisterschaft erlangen",
          "Einweihungen durchführen",
          "Höchste Heilung"
        ],
        meditation: "Stelle dir das Symbol als strahlendes Licht vor, das dich mit der Quelle verbindet.",
        affirmation: "Ich bin eins mit der universellen Lebensenergie."
      }
    },
    {
      id: 5,
      name: "Raku",
      japanese: "楽",
      meaning: "Freude und Leichtigkeit",
      description: "Das Erdungssymbol hilft bei der Erdung und dem Abschluss von Reiki-Sitzungen.",
      usage: "Erdung, Abschluss, Energie ausgleichen",
      level: "2. Grad",
      color: "#06b6d4",
      icon: <Shield size={32} />,
      details: {
        pronunciation: "Raku",
        kanji: "楽",
        meaning: "Freude und Leichtigkeit",
        usage: [
          "Erdung nach Reiki",
          "Energie ausgleichen",
          "Abschluss von Sitzungen",
          "Stabilität schaffen"
        ],
        meditation: "Visualisiere das Symbol als Wurzel, die dich mit der Erde verbindet.",
        affirmation: "Ich bin geerdet und in Balance."
      }
    },
    {
      id: 6,
      name: "Antahkarana",
      japanese: "心",
      meaning: "Herz und Seele",
      description: "Das Antahkarana-Symbol verbindet die drei Ebenen des Bewusstseins.",
      usage: "Bewusstseinserweiterung, spirituelle Verbindung, Heilung",
      level: "3. Grad",
      color: "#f97316",
      icon: <Target size={32} />,
      details: {
        pronunciation: "Antahkarana",
        kanji: "心",
        meaning: "Herz und Seele",
        usage: [
          "Bewusstseinserweiterung",
          "Spirituelle Verbindung",
          "Tiefe Heilung",
          "Meditation vertiefen"
        ],
        meditation: "Stelle dir das Symbol als Brücke zwischen den Bewusstseinsebenen vor.",
        affirmation: "Ich verbinde mich mit meiner höchsten spirituellen Natur."
      }
    }
  ];

  const symbolCategories = [
    {
      name: "Grundsymbole",
      symbols: reikiSymbols.filter(s => s.level === "1. Grad"),
      color: "#8b5cf6"
    },
    {
      name: "Erweiterte Symbole",
      symbols: reikiSymbols.filter(s => s.level === "2. Grad"),
      color: "#ef4444"
    },
    {
      name: "Meistersymbole",
      symbols: reikiSymbols.filter(s => s.level === "3. Grad"),
      color: "#10b981"
    }
  ];

  const handleSymbolClick = (symbol: any) => {
    setSelectedSymbol(symbol);
    setOpenDialog(true);
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
              <Sparkles size={48} color="#FFD700" />
              <Typography variant="h1" sx={{
                color: '#FFD700',
                fontWeight: 800,
                textShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
                fontSize: { xs: '2.5rem', md: '4rem' }
              }}>
                Reiki Symbole
              </Typography>
              <Sparkles size={48} color="#FFD700" />
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
                Entdecke die kraftvollen Reiki-Symbole und ihre heilende Wirkung
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Symbol Categories */}
        {symbolCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + categoryIndex * 0.2, duration: 0.8 }}
          >
            <Typography variant="h3" sx={{ 
              color: '#FFD700', 
              textAlign: 'center', 
              fontWeight: 700, 
              mb: 4,
              mt: categoryIndex > 0 ? 8 : 0
            }}>
              {category.name}
            </Typography>
            
            <Grid container spacing={4} sx={{ mb: 6 }}>
              {category.symbols.map((symbol, index) => (
                <Grid item xs={12} sm={6} md={4} key={symbol.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + categoryIndex * 0.2 + index * 0.1, duration: 0.6 }}
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
                    onClick={() => handleSymbolClick(symbol)}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${symbol.color}, ${symbol.color}80)`,
                          margin: '0 auto 20px',
                          color: '#fff'
                        }}>
                          {symbol.icon}
                        </Box>
                        <Typography variant="h5" sx={{
                          color: '#FFD700',
                          fontWeight: 600,
                          mb: 1
                        }}>
                          {symbol.name}
                        </Typography>
                        <Typography variant="h6" sx={{
                          color: symbol.color,
                          fontWeight: 700,
                          mb: 2,
                          fontSize: '2rem'
                        }}>
                          {symbol.japanese}
                        </Typography>
                        <Typography sx={{
                          color: 'rgba(255,255,255,0.8)',
                          lineHeight: 1.6,
                          mb: 2
                        }}>
                          {symbol.description}
                        </Typography>
                        <Chip 
                          label={symbol.level} 
                          size="small"
                          sx={{ 
                            backgroundColor: symbol.color,
                            color: 'white',
                            fontWeight: 600,
                            mb: 2
                          }}
                        />
                        <Typography sx={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '0.9rem',
                          fontStyle: 'italic'
                        }}>
                          {symbol.usage}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        ))}

        {/* Symbol Usage Guide */}
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
                Symbol-Anwendung
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Eye size={48} color="#FFD700" style={{ marginBottom: 16 }} />
                    <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 600, mb: 2 }}>
                      Visualisierung
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Stelle dir das Symbol in strahlendem Licht vor und spüre seine Energie.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Heart size={48} color="#FFD700" style={{ marginBottom: 16 }} />
                    <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 600, mb: 2 }}>
                      Intention
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Setze eine klare Absicht für die Heilung oder den gewünschten Effekt.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Zap size={48} color="#FFD700" style={{ marginBottom: 16 }} />
                    <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 600, mb: 2 }}>
                      Aktivierung
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Aktiviere das Symbol durch Zeichnen, Visualisierung oder Aussprechen.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Symbol Detail Dialog */}
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
            {selectedSymbol?.name}
          </DialogTitle>
          <DialogContent>
            {selectedSymbol && (
              <Box>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h2" sx={{ 
                    color: selectedSymbol.color, 
                    fontWeight: 700, 
                    mb: 2,
                    fontSize: '4rem'
                  }}>
                    {selectedSymbol.japanese}
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#FFD700', mb: 2 }}>
                    {selectedSymbol.details.meaning}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Aussprache: {selectedSymbol.details.pronunciation}
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                      Anwendungen:
                    </Typography>
                    {selectedSymbol.details.usage.map((usage: string, index: number) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Sparkles size={16} color="#FFD700" />
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {usage}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                      Meditation:
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                      {selectedSymbol.details.meditation}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                      Affirmation:
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      fontStyle: 'italic',
                      background: 'rgba(255, 215, 0, 0.1)',
                      padding: 2,
                      borderRadius: 2
                    }}>
                      "{selectedSymbol.details.affirmation}"
                    </Typography>
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
