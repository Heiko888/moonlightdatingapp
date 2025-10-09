"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Award, 
  Clock, 
  Star, 
  Lock,
  ArrowLeft,
  Brain,
  Compass,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function HDAcademyPage() {
  const router = useRouter();

  const courses = [
    {
      id: 'hd-basics',
      title: 'Human Design Grundlagen',
      description: 'Lerne die Grundprinzipien des Human Design Systems kennen',
      duration: '2 Stunden',
      level: 'Anfänger',
      progress: 0,
      lessons: 8,
      completed: 0,
      color: '#FFD700',
      icon: <Brain size={24} />,
      topics: [
        'Was ist Human Design?',
        'Die 4 Typen verstehen',
        'Profile und ihre Bedeutung',
        'Authority - deine innere Weisheit',
        'Strategy - dein Lebensweg',
        'Definition - wie du Energie verarbeitest',
        'Centers - deine Energiezentren',
        'Gates und Channels'
      ]
    },
    {
      id: 'centers-deep-dive',
      title: 'Centers - Deine Energiezentren',
      description: 'Tiefgreifendes Verständnis der 9 Human Design Centers',
      duration: '3 Stunden',
      level: 'Fortgeschritten',
      progress: 25,
      lessons: 12,
      completed: 3,
      color: '#06b6d4',
      icon: <Compass size={24} />,
      topics: [
        'Head Center - Inspiration',
        'Ajna Center - Konzeptualisierung',
        'Throat Center - Manifestation',
        'G Center - Identität und Richtung',
        'Heart Center - Willenskraft',
        'Solar Plexus - Emotionen',
        'Sacral Center - Lebenskraft',
        'Spleen Center - Intuition',
        'Root Center - Stress und Druck',
        'Definierte vs. Undefinierte Centers',
        'Open Centers - deine Lernbereiche',
        'Conditioning und Deconditioning'
      ]
    },
    {
      id: 'profiles-mastery',
      title: 'Profile Mastery',
      description: 'Meistere dein Profil und verstehe deine Lebensaufgabe',
      duration: '2.5 Stunden',
      level: 'Fortgeschritten',
      progress: 0,
      lessons: 10,
      completed: 0,
      color: '#10b981',
      icon: <Target size={24} />,
      topics: [
        'Profil 1/3 - Der Forscher/Märtyrer',
        'Profil 1/4 - Der Forscher/Opportunist',
        'Profil 2/4 - Der Einsiedler/Opportunist',
        'Profil 2/5 - Der Einsiedler/Ketzer',
        'Profil 3/5 - Der Märtyrer/Ketzer',
        'Profil 3/6 - Der Märtyrer/Role Model',
        'Profil 4/6 - Der Opportunist/Role Model',
        'Profil 4/1 - Der Opportunist/Forscher',
        'Profil 5/1 - Der Ketzer/Forscher',
        'Profil 5/2 - Der Ketzer/Einsiedler'
      ]
    },
    {
      id: 'authority-strategy',
      title: 'Authority & Strategy',
      description: 'Entdecke deine innere Weisheit und deinen Lebensweg',
      duration: '1.5 Stunden',
      level: 'Anfänger',
      progress: 60,
      lessons: 6,
      completed: 4,
      color: '#8b5cf6',
      icon: <Lightbulb size={24} />,
      topics: [
        'Emotional Authority',
        'Sacral Authority',
        'Splenic Authority',
        'Ego Authority',
        'G Center Authority',
        'Strategy für jeden Typ'
      ]
    },
    {
      id: 'gates-channels',
      title: 'Gates & Channels',
      description: 'Verstehe die 64 Gates und 36 Channels im Detail',
      duration: '4 Stunden',
      level: 'Experte',
      progress: 0,
      lessons: 15,
      completed: 0,
      color: '#f59e0b',
      icon: <Zap size={24} />,
      topics: [
        'Die 64 Gates - deine Talente',
        'Die 36 Channels - deine Verbindungen',
        'Definierte vs. Undefinierte Gates',
        'Hanging Gates - deine Lernbereiche',
        'Channel-Interpretation',
        'Gate-Kombinationen',
        'Planetare Einflüsse',
        'Transits und ihre Bedeutung'
      ]
    },
    {
      id: 'incarnation-cross',
      title: 'Incarnation Cross',
      description: 'Entdecke deine Lebensaufgabe und dein höheres Ziel',
      duration: '2 Stunden',
      level: 'Fortgeschritten',
      progress: 0,
      lessons: 8,
      completed: 0,
      color: '#ef4444',
      icon: <Award size={24} />,
      topics: [
        'Was ist die Incarnation Cross?',
        'Die 4 Quadranten',
        'Right Angle Crosses',
        'Juxtaposition Crosses',
        'Left Angle Crosses',
        'Deine Lebensaufgabe',
        'Höheres Ziel und Zweck',
        'Integration in den Alltag'
      ]
    },
            {
              id: 'chiron',
              title: 'Chiron - Der verwundete Heiler',
              description: 'Entdecke den vergessenen Planeten und seine Heilungskraft',
              duration: '1.5 Stunden',
              level: 'Fortgeschritten',
              progress: 0,
              lessons: 6,
              completed: 0,
              color: '#FF6B6B',
              icon: <Zap size={24} />,
              topics: [
                'Chiron - Der verwundete Heiler',
                'Chiron in den Gates',
                'Chiron in den Centers',
                'Wunden erkennen und annehmen',
                'Heilung durch Dienst an anderen',
                'Chiron-Heilungspraktiken'
              ]
            },
            {
              id: 'planets',
              title: 'Die Planeten im Human Design',
              description: 'Entdecke alle Planeten und ihre kosmischen Kräfte',
              duration: '3 Stunden',
              level: 'Fortgeschritten',
              progress: 0,
              lessons: 11,
              completed: 0,
              color: '#FFD700',
              icon: <Star size={24} />,
              topics: [
                'Sonne - Das Zentrum des Bewusstseins',
                'Mond - Das Unterbewusstsein',
                'Merkur - Der Bote der Götter',
                'Venus - Die Göttin der Liebe',
                'Mars - Der Gott des Krieges',
                'Jupiter - Der König der Götter',
                'Saturn - Der Lehrer',
                'Uranus - Der Revolutionär',
                'Neptun - Der Mystiker',
                'Pluto - Der Transformator',
                'Chiron - Der verwundete Heiler'
              ]
            }
  ];

  const achievements = [
    { id: 1, title: 'Erste Schritte', description: 'Erste Lektion abgeschlossen', icon: '🎯', unlocked: true },
    { id: 2, title: 'Wissensdurst', description: '5 Lektionen abgeschlossen', icon: '📚', unlocked: true },
    { id: 3, title: 'Durchhaltevermögen', description: '10 Lektionen abgeschlossen', icon: '💪', unlocked: false },
    { id: 4, title: 'HD-Experte', description: 'Alle Grundlagen-Kurse abgeschlossen', icon: '🏆', unlocked: false },
    { id: 5, title: 'Meister', description: 'Alle Kurse abgeschlossen', icon: '👑', unlocked: false }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Anfänger': return '#10b981';
      case 'Fortgeschritten': return '#f59e0b';
      case 'Experte': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #533483 50%, #8B5CF6 75%, #A855F7 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Stars Background */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: 'rgba(255, 255, 255, 0.3)',
              fontSize: '12px'
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            ✨
          </motion.div>
        ))}
      </Box>

      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h2" sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              mb: 2
            }}>
              🎓 HD Academy
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
              Deine persönliche Human Design Lernplattform
            </Typography>
            
            {/* Zurück zum Premium Dashboard Button */}
            <Button
              variant="outlined"
              onClick={() => router.push('/premium-dashboard')}
              sx={{
                color: '#FFD700',
                borderColor: '#FFD700',
                '&:hover': {
                  borderColor: '#FFD700',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
                },
                mb: 2
              }}
            >
              <ArrowLeft size={20} style={{ marginRight: 8 }} />
              Zurück zum Premium Dashboard
            </Button>
          </Box>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Paper sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #FFD700',
            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)',
            p: 4,
            mb: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Award size={24} color="#FFD700" />
              <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: 'white' }}>
                Dein Lernfortschritt
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 700 }}>
                    7
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Abgeschlossene Lektionen
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#06b6d4', fontWeight: 700 }}>
                    2
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Kurse in Bearbeitung
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                    15%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Gesamtfortschritt
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#8b5cf6', fontWeight: 700 }}>
                    2
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Achievements
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        <Grid container spacing={4}>
          {/* Courses */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                📚 Verfügbare Kurse
              </Typography>
              <Grid container spacing={3}>
                {courses.map((course) => (
                  <Grid item xs={12} md={6} key={course.id}>
                    <Card sx={{
                      background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 3,
                      border: '1px solid #FFD700',
                      boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 20px 40px rgba(255, 215, 0, 0.3)'
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: course.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            mr: 2
                          }}>
                            {course.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                              {course.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Chip 
                                label={course.level} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: getLevelColor(course.level),
                                  color: 'white',
                                  fontSize: '10px'
                                }} 
                              />
                              <Chip 
                                icon={<Clock size={12} />}
                                label={course.duration} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: 'rgba(255,255,255,0.1)',
                                  color: 'white',
                                  fontSize: '10px'
                                }} 
                              />
                            </Box>
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                          {course.description}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Fortschritt
                            </Typography>
                            <Typography variant="body2" sx={{ color: course.color }}>
                              {course.completed}/{course.lessons} Lektionen
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={course.progress}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'rgba(255,255,255,0.1)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: course.color
                              }
                            }}
                          />
                        </Box>
                        
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                if (course.id === 'chiron') {
                  router.push('/chiron');
                } else if (course.id === 'planets') {
                  router.push('/planets');
                } else {
                  // setSelectedCourse(course.id); // Temporär deaktiviert
                }
              }}
              sx={{
                borderColor: course.color,
                color: course.color,
                '&:hover': {
                  borderColor: course.color,
                  backgroundColor: `${course.color}20`
                }
              }}
            >
              {course.progress > 0 ? 'Fortsetzen' : 'Starten'}
            </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Paper sx={{
                background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                border: '1px solid #FFD700',
                boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)',
                p: 3,
                mb: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Star size={24} color="#FFD700" />
                  <Typography variant="h6" sx={{ ml: 2, fontWeight: 600, color: 'white' }}>
                    Achievements
                  </Typography>
                </Box>
                <List>
                  {achievements.map((achievement) => (
                    <ListItem key={achievement.id} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: achievement.unlocked ? '#10b981' : 'rgba(255,255,255,0.1)',
                          fontSize: '16px'
                        }}>
                          {achievement.unlocked ? achievement.icon : <Lock size={16} />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ 
                            color: achievement.unlocked ? 'white' : 'rgba(255,255,255,0.5)',
                            fontWeight: achievement.unlocked ? 600 : 400
                          }}>
                            {achievement.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ 
                            color: achievement.unlocked ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'
                          }}>
                            {achievement.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Paper sx={{
                background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                border: '1px solid #FFD700',
                boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)',
                p: 3
              }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                  🔗 Schnellzugriff
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    component={Link}
                    href="/grundlagen-hd"
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#06b6d4',
                      color: '#06b6d4',
                      '&:hover': {
                        borderColor: '#0891b2',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)'
                      }
                    }}
                  >
                    HD-Grundlagen
                  </Button>
                  <Button
                    component={Link}
                    href="/human-design-chart"
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#10b981',
                      color: '#10b981',
                      '&:hover': {
                        borderColor: '#059669',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)'
                      }
                    }}
                  >
                    Mein Chart
                  </Button>
                  <Button
                    component={Link}
                    href="/community"
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#8b5cf6',
                      color: '#8b5cf6',
                      '&:hover': {
                        borderColor: '#7c3aed',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)'
                      }
                    }}
                  >
                    Community
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
