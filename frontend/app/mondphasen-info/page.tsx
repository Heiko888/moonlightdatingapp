"use client";

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Grid,
  Tab,
  Tabs,
  Paper,
  Stack,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Moon, Star, Sparkles, TrendingUp, TrendingDown, Circle, ChevronRight } from 'lucide-react';

const moonPhases = [
  {
    id: 'neumond',
    label: '🌑 Neumond',
    icon: Circle,
    color: '#4b2e83',
    title: 'Neumond',
    subtitle: 'Neubeginn & Intention',
    description: 'Neubeginn, Intentionen setzen, frische Energie.',
    tips: [
      'Nutze den Neumond für Journaling',
      'Visualisiere deine Ziele',
      'Setze klare Intentionen',
      'Starte neue Projekte'
    ],
    ritual: 'Schreibe deine Wünsche und Ziele auf und bewahre sie an einem besonderen Ort auf.',
    keywords: ['Neuanfang', 'Klarheit', 'Vision', 'Planung']
  },
  {
    id: 'zunehmend',
    label: '🌒 Zunehmend',
    icon: TrendingUp,
    color: '#ffd700',
    title: 'Zunehmender Mond',
    subtitle: 'Wachstum & Aufbau',
    description: 'Wachstum, Projekte voranbringen, Motivation.',
    tips: [
      'Starte neue Projekte',
      'Pflege bestehende Routinen',
      'Bleibe aktiv und motiviert',
      'Baue Gewohnheiten auf'
    ],
    ritual: 'Mache täglich kleine Schritte zu deinen Zielen und dokumentiere deine Fortschritte.',
    keywords: ['Wachstum', 'Aufbau', 'Motivation', 'Aktion']
  },
  {
    id: 'vollmond',
    label: '🌕 Vollmond',
    icon: Moon,
    color: '#ffffff',
    title: 'Vollmond',
    subtitle: 'Höhepunkt & Manifestation',
    description: 'Höhepunkt, Klarheit, Manifestation, starke Emotionen.',
    tips: [
      'Feiere deine Erfolge',
      'Reflektiere über deinen Weg',
      'Meditiere und manifestiere',
      'Lasse Emotionen zu'
    ],
    ritual: 'Führe eine Vollmond-Meditation durch und schreibe auf, wofür du dankbar bist.',
    keywords: ['Höhepunkt', 'Klarheit', 'Emotion', 'Manifestation'],
    astroNote: 'Der Vollmond steht oft für starke Gefühle und kann zu Schlaflosigkeit führen.'
  },
  {
    id: 'abnehmend',
    label: '🌘 Abnehmend',
    icon: TrendingDown,
    color: '#9b87f5',
    title: 'Abnehmender Mond',
    subtitle: 'Loslassen & Reinigung',
    description: 'Loslassen, Reflexion, Reinigung, Abschluss.',
    tips: [
      'Entrümple physisch und mental',
      'Beende offene Themen',
      'Gönn dir Ruhe und Erholung',
      'Reflektiere und lerne'
    ],
    ritual: 'Verbrenne Zettel mit Dingen, die du loslassen möchtest, als Symbol der Transformation.',
    keywords: ['Loslassen', 'Reinigung', 'Reflexion', 'Abschluss']
  }
];

export default function MondphasenInfoPage() {
  const [activeTab, setActiveTab] = useState(0);
  const currentPhase = moonPhases[activeTab];
  const Icon = currentPhase.icon;

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(255, 107, 157, 0.15) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Stars Animation */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {[...Array(30)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`,
              '@keyframes twinkle': {
                '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                '50%': { opacity: 1, transform: 'scale(1.2)' }
              }
            }}
          />
        ))}
      </Box>

      {/* Navigation */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backdropFilter: 'blur(20px)',
        background: 'rgba(15, 15, 35, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            py: 2 
          }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography variant="h5" sx={{ 
                background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                cursor: 'pointer'
              }}>
                🔑 The Connection Key
              </Typography>
            </Link>
            <Stack direction="row" spacing={2}>
              <Link href="/mondkalender" passHref>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: '#4ecdc4',
                      background: 'rgba(78, 205, 196, 0.1)'
                    }
                  }}
                >
                  Mondkalender
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button 
                  variant="contained"
                  sx={{ 
                    background: 'linear-gradient(135deg, #4ecdc4, #0891b2)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3bb5b0, #0779a1)'
                    }
                  }}
                >
                  Anmelden
                </Button>
              </Link>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 15, pb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={8}>
            <Typography variant="h2" sx={{
              background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2rem', md: '3.5rem' },
              textShadow: '0 0 30px rgba(78, 205, 196, 0.3)'
            }}>
              🌙 Mondphasen verstehen
            </Typography>
            <Typography variant="h6" sx={{
              color: 'rgba(255,255,255,0.85)',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}>
              Nutze die Kraft der Mondzyklen für deine persönliche Entwicklung und lebe im Einklang mit den natürlichen Rhythmen
            </Typography>
          </Box>
        </motion.div>

        {/* Tabs für Mondphasen */}
        <Paper sx={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.15)',
          mb: 6,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(78, 205, 196, 0.2)',
            border: '1px solid rgba(78, 205, 196, 0.25)'
          }
        }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 64,
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 600,
                fontSize: { xs: '0.875rem', md: '1rem' },
                minHeight: 64,
                px: { xs: 2, md: 3 },
                transition: 'all 0.3s ease',
                '&.Mui-selected': {
                  color: '#FFD700',
                  background: 'rgba(255, 215, 0, 0.1)'
                },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.9)'
                }
              },
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(135deg, #4ecdc4, #0891b2)',
                height: 3,
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            {moonPhases.map((phase) => (
              <Tab key={phase.id} label={phase.label} />
            ))}
          </Tabs>
        </Paper>

        {/* Phase Details Card */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 4,
            mb: 6,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 25px 70px rgba(78, 205, 196, 0.3)',
              border: '1px solid rgba(78, 205, 196, 0.3)'
            }
          }}>
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${currentPhase.color}, rgba(255,255,255,0.2))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 32px ${currentPhase.color}40`
                }}>
                  <Icon size={40} color="white" />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{
                    color: 'white',
                    fontWeight: 800,
                    mb: 0.5,
                    fontSize: { xs: '1.75rem', md: '2.5rem' }
                  }}>
                    {currentPhase.title}
                  </Typography>
                  <Typography variant="h6" sx={{
                    color: currentPhase.color,
                    fontWeight: 600
                  }}>
                    {currentPhase.subtitle}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, lineHeight: 1.8 }}>
                {currentPhase.description}
              </Typography>

              {/* Keywords */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {currentPhase.keywords.map((keyword) => (
                    <Chip
                      key={keyword}
                      label={keyword}
                      icon={<Sparkles size={16} />}
                      sx={{
                        background: 'rgba(255, 215, 0, 0.15)',
                        color: '#FFD700',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        fontWeight: 600,
                        '& .MuiChip-icon': { color: '#FFD700' }
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Tips */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                  💡 Praktische Tipps
                </Typography>
                <Grid container spacing={2}>
                  {currentPhase.tips.map((tip, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.08)',
                          transform: 'translateY(-2px)'
                        }
                      }}>
                        <Star size={20} color="#FFD700" fill="#FFD700" />
                        <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
                          {tip}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Ritual */}
              <Paper sx={{
                background: 'rgba(78, 205, 196, 0.1)',
                border: '1px solid rgba(78, 205, 196, 0.3)',
                borderRadius: 3,
                p: 3,
                mb: currentPhase.astroNote ? 3 : 0
              }}>
                <Typography variant="h6" sx={{ color: '#4ecdc4', fontWeight: 700, mb: 1 }}>
                  🔮 Ritual-Idee
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.8 }}>
                  {currentPhase.ritual}
                </Typography>
              </Paper>

              {/* Astro Note (nur beim Vollmond) */}
              {currentPhase.astroNote && (
                <Paper sx={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: 3,
                  p: 3
                }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700, mb: 1 }}>
                    ✨ Astro-Hinweis
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.8 }}>
                    {currentPhase.astroNote}
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Allgemeine Hinweise */}
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 4,
          mb: 6,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 25px 70px rgba(139, 92, 246, 0.3)',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }
        }}>
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 800, mb: 3 }}>
              🌟 Die Kraft der Mondzyklen
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 3, lineHeight: 1.8, fontSize: '1.1rem' }}>
              Die Mondphasen sind ein natürlicher Rhythmus, der dich unterstützen kann, bewusster zu leben. 
              Viele Menschen nutzen sie für Rituale, Meditation und persönliche Entwicklung.
            </Typography>
            <Paper sx={{
              background: 'rgba(196, 69, 105, 0.15)',
              border: '1px solid rgba(196, 69, 105, 0.3)',
              borderRadius: 3,
              p: 3
            }}>
              <Typography variant="h6" sx={{ color: '#ff6b9d', fontWeight: 700, mb: 1 }}>
                💫 Ritual-Tipp für den kompletten Zyklus
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.8 }}>
                Schreibe zum <strong>Neumond</strong> deine Wünsche und Ziele auf. 
                Arbeite während des <strong>zunehmenden Mondes</strong> aktiv daran. 
                Feiere zum <strong>Vollmond</strong> deine Erfolge und reflektiere. 
                Beim <strong>abnehmenden Mond</strong> verbrenne symbolisch, was du loslassen möchtest.
              </Typography>
            </Paper>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(78, 205, 196, 0.2)',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          mb: 8,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 25px 70px rgba(78, 205, 196, 0.3)',
            border: '1px solid rgba(78, 205, 196, 0.4)'
          }
        }}>
          <CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>
              Entdecke deinen Mondkalender
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', mb: 4, maxWidth: 600, mx: 'auto' }}>
              Sieh die aktuelle Mondphase und erhalte personalisierte Empfehlungen für jeden Tag
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Link href="/mondkalender" passHref>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ChevronRight />}
                  sx={{
                    background: 'linear-gradient(135deg, #4ecdc4, #0891b2)',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(78, 205, 196, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3bb5b0, #0779a1)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 15px 40px rgba(78, 205, 196, 0.5)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Zum Mondkalender
                </Button>
              </Link>
              <Link href="/register" passHref>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    '&:hover': {
                      borderColor: '#4ecdc4',
                      background: 'rgba(78, 205, 196, 0.1)',
                      transform: 'translateY(-4px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Jetzt registrieren
                </Button>
              </Link>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
      </Box>
  );
}
