"use client";

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Container,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import { 
  Moon, 
  Calendar,
  Zap,
  Heart,
  Brain,
  Shield,
  Target,
  Sparkles,
  Activity,
  TrendingUp,
  Info,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Floating Stars Animation
const AnimatedStars = () => {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2
  }));

  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 1
    }}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '50%',
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: star.delay
          }}
        />
      ))}
    </Box>
  );
};

export default function MondkalenderInfo() {
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const features = [
    {
      icon: <Moon size={32} />,
      title: "Mondphasen-Tracking",
      description: "Verfolge alle 8 Mondphasen in Echtzeit mit präzisen Zeitangaben",
      details: [
        "Neumond - Neubeginn und Intentionen setzen",
        "Zunehmender Mond - Wachstum und Manifestation",
        "Vollmond - Höhepunkt und Vollendung",
        "Abnehmender Mond - Loslassen und Reflektion"
      ],
      image: "🌙",
      gradient: "linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 235, 50, 0.05) 100%)",
      borderColor: "rgba(255, 215, 0, 0.3)"
    },
    {
      icon: <Calendar size={32} />,
      title: "Persönlicher Mondkalender",
      description: "Individueller Kalender basierend auf deinem Geburtsort und -zeit",
      details: [
        "Lokale Mondzeiten für deinen Standort",
        "Persönliche Mondzyklen und Rhythmen",
        "Optimale Zeiten für verschiedene Aktivitäten",
        "Mondkalender-Export für andere Apps"
      ],
      image: "📅",
      gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
      borderColor: "rgba(16, 185, 129, 0.3)"
    },
    {
      icon: <Brain size={32} />,
      title: "Mond-Energie-Analyse",
      description: "Verstehe, wie der Mond deine Energie und Stimmung beeinflusst",
      details: [
        "Energetische Auswirkungen auf deinen Typ",
        "Optimale Zeiten für Entscheidungen",
        "Mond-basierte Stimmungsvorhersagen",
        "Persönliche Energie-Rhythmen"
      ],
      image: "🧠",
      gradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)",
      borderColor: "rgba(139, 92, 246, 0.3)"
    },
    {
      icon: <Heart size={32} />,
      title: "Beziehungs-Harmonie",
      description: "Verstehe, wie Mondphasen deine Beziehungen beeinflussen",
      details: [
        "Kompatible Mondphasen für Dates",
        "Optimale Zeiten für wichtige Gespräche",
        "Mond-basierte Beziehungsberatung",
        "Harmonie zwischen Partnern"
      ],
      image: "💕",
      gradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(244, 63, 94, 0.05) 100%)",
      borderColor: "rgba(236, 72, 153, 0.3)"
    },
    {
      icon: <Zap size={32} />,
      title: "Manifestations-Unterstützung",
      description: "Nutze die Kraft des Mondes für deine Ziele und Wünsche",
      details: [
        "Neumond-Rituale für neue Projekte",
        "Vollmond-Energie für Durchbrüche",
        "Mond-basierte Affirmationen",
        "Manifestations-Tracking"
      ],
      image: "⚡",
      gradient: "linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)",
      borderColor: "rgba(251, 191, 36, 0.3)"
    },
    {
      icon: <Activity size={32} />,
      title: "Gesundheit & Wellness",
      description: "Optimiere deine Gesundheit mit dem Mondrhythmus",
      details: [
        "Beste Zeiten für Fasten und Entgiftung",
        "Mond-basierte Ernährungsempfehlungen",
        "Optimale Trainingszeiten",
        "Schlafqualität und Mondphasen"
      ],
      image: "💪",
      gradient: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",
      borderColor: "rgba(34, 197, 94, 0.3)"
    }
  ];

  const moonPhases = [
    {
      name: "Neumond",
      emoji: "🌑",
      description: "Zeit für Neubeginn und Intentionen",
      activities: ["Ziele setzen", "Meditation", "Planung", "Reflektion"],
      color: "#1a1a2e",
      gradient: "linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(45, 45, 65, 0.8) 100%)",
      glowColor: "rgba(26, 26, 46, 0.3)",
      borderColor: "rgba(100, 100, 120, 0.3)"
    },
    {
      name: "Zunehmender Sichelmond",
      emoji: "🌒",
      description: "Energie sammeln und erste Schritte",
      activities: ["Lernen", "Forschung", "Vorbereitung", "Netzwerken"],
      color: "#2d3748",
      gradient: "linear-gradient(135deg, rgba(45, 55, 72, 0.9) 0%, rgba(65, 75, 92, 0.8) 100%)",
      glowColor: "rgba(45, 55, 72, 0.3)",
      borderColor: "rgba(120, 130, 140, 0.3)"
    },
    {
      name: "Erstes Viertel",
      emoji: "🌓",
      description: "Aktion und Entscheidungen treffen",
      activities: ["Handeln", "Entscheiden", "Probleme lösen", "Durchsetzen"],
      color: "#4a5568",
      gradient: "linear-gradient(135deg, rgba(74, 85, 104, 0.9) 0%, rgba(94, 105, 124, 0.8) 100%)",
      glowColor: "rgba(74, 85, 104, 0.3)",
      borderColor: "rgba(140, 150, 160, 0.3)"
    },
    {
      name: "Zunehmender Gibbous",
      emoji: "🌔",
      description: "Anpassungen und Verfeinerungen",
      activities: ["Anpassen", "Verfeinern", "Korrigieren", "Optimieren"],
      color: "#718096",
      gradient: "linear-gradient(135deg, rgba(113, 128, 150, 0.9) 0%, rgba(133, 148, 170, 0.8) 100%)",
      glowColor: "rgba(113, 128, 150, 0.3)",
      borderColor: "rgba(160, 170, 180, 0.3)"
    },
    {
      name: "Vollmond",
      emoji: "🌕",
      description: "Höhepunkt und Vollendung",
      activities: ["Feiern", "Ernten", "Vollenden", "Manifestieren"],
      color: "#ffd700",
      gradient: "linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 235, 50, 0.15) 100%)",
      glowColor: "rgba(255, 215, 0, 0.4)",
      borderColor: "rgba(255, 215, 0, 0.5)"
    },
    {
      name: "Abnehmender Gibbous",
      emoji: "🌖",
      description: "Dankbarkeit und Teilen",
      activities: ["Danken", "Teilen", "Lehren", "Geben"],
      color: "#a0aec0",
      gradient: "linear-gradient(135deg, rgba(160, 174, 192, 0.9) 0%, rgba(180, 194, 212, 0.8) 100%)",
      glowColor: "rgba(160, 174, 192, 0.3)",
      borderColor: "rgba(200, 210, 220, 0.3)"
    },
    {
      name: "Letztes Viertel",
      emoji: "🌗",
      description: "Loslassen und Vergebung",
      activities: ["Loslassen", "Vergeben", "Aufräumen", "Entgiften"],
      color: "#cbd5e0",
      gradient: "linear-gradient(135deg, rgba(203, 213, 224, 0.9) 0%, rgba(223, 233, 244, 0.8) 100%)",
      glowColor: "rgba(203, 213, 224, 0.3)",
      borderColor: "rgba(230, 240, 250, 0.3)"
    },
    {
      name: "Abnehmender Sichelmond",
      emoji: "🌘",
      description: "Ruhe und Regeneration",
      activities: ["Ruhen", "Regenerieren", "Reflektieren", "Vorbereiten"],
      color: "#e2e8f0",
      gradient: "linear-gradient(135deg, rgba(226, 232, 240, 0.9) 0%, rgba(246, 252, 255, 0.8) 100%)",
      glowColor: "rgba(226, 232, 240, 0.3)",
      borderColor: "rgba(250, 255, 255, 0.3)"
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp size={24} />,
      title: "Bessere Entscheidungen",
      description: "Treffe wichtige Entscheidungen zur optimalen Mondzeit"
    },
    {
      icon: <Shield size={24} />,
      title: "Natürlicher Rhythmus",
      description: "Lebe im Einklang mit den natürlichen Zyklen"
    },
    {
      icon: <Target size={24} />,
      title: "Erfolgreichere Ziele",
      description: "Nutze die Mondenergie für deine Manifestationen"
    },
    {
      icon: <Heart size={24} />,
      title: "Harmonische Beziehungen",
      description: "Verstehe die Mond-Einflüsse auf deine Beziehungen"
    }
  ];

  const useCases = [
    {
      category: "Business & Karriere",
      icon: <TrendingUp size={20} />,
      examples: [
        "Neumond: Neue Projekte starten",
        "Zunehmender Mond: Verhandlungen führen",
        "Vollmond: Präsentationen halten",
        "Abnehmender Mond: Alte Projekte abschließen"
      ]
    },
    {
      category: "Gesundheit & Wellness",
      icon: <Activity size={20} />,
      examples: [
        "Neumond: Entgiftungsprogramme beginnen",
        "Zunehmender Mond: Muskelaufbau-Training",
        "Vollmond: Intensives Cardio-Training",
        "Abnehmender Mond: Entspannung und Regeneration"
      ]
    },
    {
      category: "Beziehungen & Liebe",
      icon: <Heart size={20} />,
      examples: [
        "Neumond: Neue Beziehungen beginnen",
        "Zunehmender Mond: Vertiefung bestehender Beziehungen",
        "Vollmond: Romantische Dates und Intimität",
        "Abnehmender Mond: Konflikte lösen und vergeben"
      ]
    },
    {
      category: "Spiritualität & Wachstum",
      icon: <Sparkles size={20} />,
      examples: [
        "Neumond: Meditation und Intentionen setzen",
        "Zunehmender Mond: Lernen und Studieren",
        "Vollmond: Rituale und Manifestationen",
        "Abnehmender Mond: Loslassen und Reflektion"
      ]
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
      overflow: 'hidden',
      '@keyframes moonRotate': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
      },
      '@keyframes moonPulse': {
        '0%': { transform: 'scale(1)', opacity: 0.6 },
        '50%': { transform: 'scale(1.1)', opacity: 0.8 },
        '100%': { transform: 'scale(1)', opacity: 0.6 }
      }
    }}>
      {isClient && <AnimatedStars />}
      
      {/* Animierter Vollmond im Hintergrund */}
      <Box sx={{ 
        position: 'absolute', 
        top: '2%', 
        right: '8%', 
        zIndex: 1,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #f8f8ff, #e6e6fa, #d3d3d3, #c0c0c0)',
        boxShadow: `
          0 0 60px rgba(255, 255, 255, 0.3),
          0 0 120px rgba(255, 255, 255, 0.2),
          0 0 180px rgba(255, 255, 255, 0.1),
          inset -20px -20px 40px rgba(0, 0, 0, 0.2),
          inset 20px 20px 40px rgba(255, 255, 255, 0.1)
        `,
        animation: 'moonRotate 20s linear infinite, moonPulse 4s ease-in-out infinite'
      }} />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
        {/* Header */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
              <Moon size={48} color="#FFD700" />
              <Typography variant="h2" sx={{ 
                fontWeight: 800, 
                ml: 2,
                background: 'radial-gradient(circle at 30% 30%, #f8f8ff 0%, #e6e6fa 30%, #d3d3d3 60%, #c0c0c0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(248, 248, 255, 0.8), 0 0 60px rgba(230, 230, 250, 0.4)',
                filter: 'drop-shadow(0 0 20px rgba(248, 248, 255, 0.6))'
              }}>
                Mondkalender
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
              🌙 Dein persönlicher Begleiter durch die Mondzyklen
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 800, mx: 'auto', lineHeight: 1.6 }}>
              Entdecke die Kraft des Mondes für dein Leben. Nutze die natürlichen Rhythmen für bessere Entscheidungen, 
              harmonische Beziehungen und erfolgreiche Manifestationen.
            </Typography>
          </Box>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          
          
          
        >
          <Typography variant="h3" sx={{ color: '#FFD700', textAlign: 'center', mb: 6, fontWeight: 700 }}>
            ✨ Alle Funktionen im Überblick
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  
                  
                  
                >
                  <Card sx={{
                    background: feature.gradient,
                    backdropFilter: 'blur(15px)',
                    border: `1px solid ${feature.borderColor}`,
                    borderRadius: 3,
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
                      background: `radial-gradient(circle at 50% 0%, ${feature.borderColor} 0%, transparent 70%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    },
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: `0 20px 40px ${feature.borderColor}, 0 0 60px ${feature.borderColor}`,
                      '&::before': {
                        opacity: 1
                      }
                    }
                  }}>
                    <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
                      {/* Großes Emoji-Bild oben */}
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <motion.div
                          animate={{ 
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 4, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: index * 0.3
                          }}
                        >
                          <Typography variant="h1" sx={{ 
                            fontSize: '4rem',
                            filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))',
                            textShadow: '0 0 25px rgba(255, 255, 255, 0.2)',
                            mb: 1
                          }}>
                            {feature.image}
                          </Typography>
                        </motion.div>
                      </Box>
                      
                      {/* Icon und Titel */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: `1px solid ${feature.borderColor}`,
                          mr: 3,
                          backdropFilter: 'blur(5px)'
                        }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h5" sx={{ 
                          color: 'white', 
                          fontWeight: 700,
                          textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                        }}>
                          {feature.title}
                        </Typography>
                      </Box>
                      
                      <Typography sx={{ 
                        color: 'rgba(255,255,255,0.9)', 
                        mb: 3, 
                        lineHeight: 1.6,
                        textShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
                        fontSize: '1rem'
                      }}>
                        {feature.description}
                      </Typography>
                      
                      <List dense>
                        {feature.details.map((detail, detailIndex) => (
                          <ListItem key={detailIndex} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle size={16} color={feature.borderColor.replace('0.3', '0.8')} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={detail}
                              sx={{ 
                                '& .MuiListItemText-primary': { 
                                  color: 'rgba(255,255,255,0.95)',
                                  fontSize: '0.9rem',
                                  textShadow: '0 0 3px rgba(255, 255, 255, 0.1)'
                                }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Moon Phases */}
        <motion.div
          
          
          
        >
          <Typography variant="h3" sx={{ color: '#FFD700', textAlign: 'center', mb: 6, fontWeight: 700 }}>
            🌙 Die 8 Mondphasen verstehen
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {moonPhases.map((phase, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  
                  
                  
                >
                  <Card sx={{
                    background: phase.gradient,
                    backdropFilter: 'blur(15px)',
                    border: `1px solid ${phase.borderColor}`,
                    borderRadius: 3,
                    textAlign: 'center',
                    p: 3,
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
                      background: `radial-gradient(circle at 50% 0%, ${phase.glowColor} 0%, transparent 70%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    },
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: `0 20px 40px ${phase.glowColor}, 0 0 60px ${phase.glowColor}`,
                      '&::before': {
                        opacity: 1
                      }
                    }
                  }}>
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 6, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: index * 0.5
                      }}
                    >
                      <Typography variant="h2" sx={{ 
                        mb: 2, 
                        fontSize: '3.5rem',
                        filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
                        textShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
                      }}>
                        {phase.emoji}
                      </Typography>
                    </motion.div>
                    <Typography variant="h6" sx={{ 
                      color: phase.name === 'Vollmond' ? '#FFD700' : 'rgba(255,255,255,0.95)', 
                      fontWeight: 700, 
                      mb: 2,
                      textShadow: phase.name === 'Vollmond' ? '0 0 15px rgba(255, 215, 0, 0.5)' : '0 0 10px rgba(255, 255, 255, 0.3)'
                    }}>
                      {phase.name}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255,255,255,0.9)', 
                      mb: 3, 
                      lineHeight: 1.6,
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.2)'
                    }}>
                      {phase.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                      {phase.activities.map((activity, activityIndex) => (
                        <Chip
                          key={activityIndex}
                          label={activity}
                          size="small"
                          sx={{
                            background: phase.name === 'Vollmond' 
                              ? 'rgba(255, 215, 0, 0.25)' 
                              : 'rgba(255, 255, 255, 0.15)',
                            color: phase.name === 'Vollmond' ? '#FFD700' : 'rgba(255, 255, 255, 0.9)',
                            border: phase.name === 'Vollmond' 
                              ? '1px solid rgba(255, 215, 0, 0.4)' 
                              : '1px solid rgba(255, 255, 255, 0.2)',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            backdropFilter: 'blur(5px)',
                            boxShadow: phase.name === 'Vollmond' 
                              ? '0 0 10px rgba(255, 215, 0, 0.2)' 
                              : '0 0 5px rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                              background: phase.name === 'Vollmond' 
                                ? 'rgba(255, 215, 0, 0.35)' 
                                : 'rgba(255, 255, 255, 0.25)',
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Benefits */}
        <motion.div
          
          
          
        >
          <Typography variant="h3" sx={{ color: '#FFD700', textAlign: 'center', mb: 6, fontWeight: 700 }}>
            🎯 Deine Vorteile
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  
                  
                  
                >
                  <Paper sx={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    p: 4,
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      border: '1px solid rgba(255, 215, 0, 0.3)'
                    }
                  }}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      background: 'rgba(255, 215, 0, 0.1)',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      mr: 3
                    }}>
                      {benefit.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                        {benefit.title}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {benefit.description}
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Use Cases */}
        <motion.div
          
          
          
        >
          <Typography variant="h3" sx={{ color: '#FFD700', textAlign: 'center', mb: 6, fontWeight: 700 }}>
            💡 Praktische Anwendungen
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {useCases.map((useCase, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  
                  
                  
                >
                  <Card sx={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    height: '100%'
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ 
                          p: 1.5, 
                          borderRadius: 2, 
                          background: 'rgba(255, 215, 0, 0.1)',
                          border: '1px solid rgba(255, 215, 0, 0.3)',
                          mr: 2
                        }}>
                          {useCase.icon}
                        </Box>
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                          {useCase.category}
                        </Typography>
                      </Box>
                      
                      <List dense>
                        {useCase.examples.map((example, exampleIndex) => (
                          <ListItem key={exampleIndex} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <ArrowRight size={16} color="#FFD700" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={example}
                              sx={{ 
                                '& .MuiListItemText-primary': { 
                                  color: 'rgba(255,255,255,0.9)',
                                  fontSize: '0.9rem'
                                }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4,
            p: 6,
            textAlign: 'center'
          }}>
            <Typography variant="h3" sx={{ color: '#FFD700', mb: 3, fontWeight: 700 }}>
              🌙 Starte deine Mondreise
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, maxWidth: 600, mx: 'auto' }}>
              Entdecke die Kraft des Mondes für dein Leben. Nutze die natürlichen Rhythmen 
              für bessere Entscheidungen und ein harmonischeres Leben.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/mondkalender"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
                  color: '#23233a',
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #fbbf24, #FFD700)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)'
                  }
                }}
              >
                <Moon size={24} style={{ marginRight: 8 }} />
                Mondkalender öffnen
              </Button>
              
              <Button
                component={Link}
                href="/seitenanzeige"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  fontWeight: 600,
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                <Info size={24} style={{ marginRight: 8 }} />
                Alle Funktionen
              </Button>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
