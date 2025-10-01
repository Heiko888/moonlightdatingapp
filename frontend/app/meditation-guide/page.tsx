"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  Chip, 
  Avatar,
  LinearProgress,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Tabs,
  Tab
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Clock,
  Heart,
  Brain,
  Moon,
  Sun,
  Wind,
  TreePine,
  Waves,
  Music,
  Timer,
  Target,
  Zap,
  Star,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Settings,
  BookOpen,
  Headphones,
  Sparkles
} from 'lucide-react';

interface MeditationTechnique {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'Anfänger' | 'Fortgeschritten' | 'Experte';
  category: 'Achtsamkeit' | 'Atmung' | 'Visualisierung' | 'Mantra' | 'Körper';
  benefits: string[];
  icon: React.ReactNode;
  color: string;
  audioUrl?: string;
}

interface GuidedMeditation {
  id: string;
  title: string;
  description: string;
  duration: number;
  instructor: string;
  category: string;
  rating: number;
  participants: number;
  thumbnail: string;
}

interface MeditationSession {
  id: string;
  technique: string;
  duration: number;
  date: Date;
  notes?: string;
  rating?: number;
}

export default function MeditationGuidePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  // Timer States
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 Minuten in Sekunden
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [isMuted, setIsMuted] = useState(false);
  
  // Dialog States
  const [techniqueDialogOpen, setTechniqueDialogOpen] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<MeditationTechnique | null>(null);
  const [timerDialogOpen, setTimerDialogOpen] = useState(false);

  // Mock-Daten für Meditationstechniken
  const [techniques, setTechniques] = useState<MeditationTechnique[]>([
    {
      id: '1',
      name: 'Achtsamkeits-Meditation',
      description: 'Fokussiere dich auf den gegenwärtigen Moment und beobachte deine Gedanken ohne Urteil.',
      duration: 10,
      difficulty: 'Anfänger',
      category: 'Achtsamkeit',
      benefits: ['Stressreduktion', 'Verbesserte Konzentration', 'Emotionale Balance'],
      icon: <Brain size={24} />,
      color: '#4ECDC4'
    },
    {
      id: '2',
      name: 'Atem-Meditation',
      description: 'Konzentriere dich auf deine Atmung und finde Ruhe durch bewusstes Ein- und Ausatmen.',
      duration: 15,
      difficulty: 'Anfänger',
      category: 'Atmung',
      benefits: ['Entspannung', 'Bessere Atmung', 'Reduzierte Angst'],
      icon: <Wind size={24} />,
      color: '#45B7D1'
    },
    {
      id: '3',
      name: 'Körper-Scan',
      description: 'Gehe systematisch durch deinen Körper und spüre jeden Bereich bewusst.',
      duration: 20,
      difficulty: 'Fortgeschritten',
      category: 'Körper',
      benefits: ['Körperbewusstsein', 'Entspannung', 'Schmerzlinderung'],
      icon: <Heart size={24} />,
      color: '#FF6B6B'
    },
    {
      id: '4',
      name: 'Mantra-Meditation',
      description: 'Wiederhole ein heiliges Wort oder einen Satz, um den Geist zu beruhigen.',
      duration: 25,
      difficulty: 'Fortgeschritten',
      category: 'Mantra',
      benefits: ['Geistige Klarheit', 'Spirituelle Verbindung', 'Tiefe Entspannung'],
      icon: <Star size={24} />,
      color: '#FFD700'
    },
    {
      id: '5',
      name: 'Visualisierungs-Meditation',
      description: 'Stelle dir beruhigende Bilder vor und tauche in eine friedliche Welt ein.',
      duration: 30,
      difficulty: 'Experte',
      category: 'Visualisierung',
      benefits: ['Kreativität', 'Emotionale Heilung', 'Zielerreichung'],
      icon: <Sparkles size={24} />,
      color: '#96CEB4'
    },
    {
      id: '6',
      name: 'Mond-Meditation',
      description: 'Verbinde dich mit der Energie des Mondes und nutze seine zyklische Kraft.',
      duration: 20,
      difficulty: 'Fortgeschritten',
      category: 'Visualisierung',
      benefits: ['Intuition', 'Emotionale Balance', 'Zyklische Verbindung'],
      icon: <Moon size={24} />,
      color: '#8B5CF6'
    }
  ]);

  const [guidedMeditations, setGuidedMeditations] = useState<GuidedMeditation[]>([
    {
      id: '1',
      title: 'Morgen-Meditation für Energie',
      description: 'Starte deinen Tag mit positiver Energie und Klarheit.',
      duration: 15,
      instructor: 'Sarah M.',
      category: 'Energie',
      rating: 4.8,
      participants: 1247,
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'Abend-Meditation für Entspannung',
      description: 'Lass den Tag los und finde Ruhe für eine erholsame Nacht.',
      duration: 20,
      instructor: 'Michael K.',
      category: 'Entspannung',
      rating: 4.9,
      participants: 892,
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '3',
      title: 'HD-Typ Meditation',
      description: 'Spezielle Meditation für deinen Human Design Typ.',
      duration: 25,
      instructor: 'Anna L.',
      category: 'Human Design',
      rating: 4.7,
      participants: 634,
      thumbnail: '/api/placeholder/300/200'
    }
  ]);

  const [recentSessions, setRecentSessions] = useState<MeditationSession[]>([
    {
      id: '1',
      technique: 'Achtsamkeits-Meditation',
      duration: 10,
      date: new Date(Date.now() - 86400000), // Gestern
      rating: 4
    },
    {
      id: '2',
      technique: 'Atem-Meditation',
      duration: 15,
      date: new Date(Date.now() - 172800000), // Vorgestern
      rating: 5
    }
  ]);

  useEffect(() => {
    setIsClient(true);
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
    } else {
      // Keine Authentifizierung erforderlich - App ist öffentlich
    }
    
    setTimeout(() => setLoading(false), 1000);
  }, [router]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      // Hier könnte eine Benachrichtigung oder ein Sound abgespielt werden
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setTimeLeft(selectedDuration * 60);
    setIsPlaying(true);
  };

  const pauseTimer = () => {
    setIsPlaying(false);
  };

  const resetTimer = () => {
    setIsPlaying(false);
    setTimeLeft(selectedDuration * 60);
  };

  const openTechniqueDialog = (technique: MeditationTechnique) => {
    setSelectedTechnique(technique);
    setTechniqueDialogOpen(true);
  };

  if (!isClient || loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <LinearProgress sx={{ width: 200, mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#FFD700' }}>
            Lade Meditations-Guide...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!userId) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Benutzer nicht gefunden
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Hintergrund-Effekte */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(76, 205, 196, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
        `,
        zIndex: 1
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 6 }}>
        <motion.div
          
          
          
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              
              
              
            >
              <Box sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 50%, #96CEB4 100%)',
                mb: 4,
                boxShadow: '0 20px 40px rgba(76, 205, 196, 0.4)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -4,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4ECDC4, #45B7D1, #96CEB4)',
                  zIndex: -1,
                  filter: 'blur(20px)',
                  opacity: 0.7
                }
              }}>
                <Brain size={60} color="#1a1a2e" />
              </Box>
            </motion.div>
            
            <motion.div
              
              
              
            >
              <Typography variant="h2" sx={{ 
                color: '#4ECDC4', 
                fontWeight: 900, 
                mb: 2,
                textShadow: '0 4px 8px rgba(76, 205, 196, 0.3)'
              }}>
                Meditations-Guide
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                maxWidth: 600, 
                mx: 'auto',
                lineHeight: 1.6
              }}>
                Finde deinen Weg zu innerem Frieden und spirituellem Wachstum durch verschiedene Meditationstechniken.
              </Typography>
            </motion.div>
          </Box>

          {/* Tabs */}
          <Box sx={{ mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              centered
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    color: '#4ECDC4'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#4ECDC4'
                }
              }}
            >
              <Tab label="Techniken" />
              <Tab label="Geführte Meditationen" />
              <Tab label="Timer" />
              <Tab label="Meine Sessions" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="techniques"
                
                
                exit={{ opacity: 0, x: -20 }}
                
              >
                <Typography variant="h4" sx={{ color: '#4ECDC4', fontWeight: 700, mb: 4 }}>
                  Meditationstechniken
                </Typography>
                <Grid container spacing={3}>
                  {techniques.map((technique, index) => (
                    <Grid item xs={12} sm={6} md={4} key={technique.id}>
                      <motion.div
                        
                        
                        
                      >
                        <Card sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: 4,
                          border: '1px solid rgba(255,255,255,0.2)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                            border: `1px solid ${technique.color}`
                          }
                        }}
                        onClick={() => openTechniqueDialog(technique)}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              mb: 2
                            }}>
                              <Box sx={{
                                p: 2,
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${technique.color}20, ${technique.color}40)`,
                                border: `2px solid ${technique.color}`
                              }}>
                                {technique.icon}
                              </Box>
                              <Chip
                                label={technique.difficulty}
                                size="small"
                                sx={{
                                  background: `${technique.color}20`,
                                  color: technique.color,
                                  border: `1px solid ${technique.color}`,
                                  fontSize: '0.7rem'
                                }}
                              />
                            </Box>
                            <Typography variant="h6" sx={{ 
                              color: 'white', 
                              fontWeight: 600, 
                              mb: 1
                            }}>
                              {technique.name}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: 'rgba(255,255,255,0.7)',
                              mb: 2,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {technique.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <Clock size={16} color="#4ECDC4" />
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                {technique.duration} Min
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {technique.benefits.slice(0, 2).map((benefit, benefitIndex) => (
                                <Chip
                                  key={benefitIndex}
                                  label={benefit}
                                  size="small"
                                  sx={{
                                    background: 'rgba(76, 205, 196, 0.2)',
                                    color: '#4ECDC4',
                                    border: '1px solid rgba(76, 205, 196, 0.3)',
                                    fontSize: '0.7rem'
                                  }}
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                key="guided"
                
                
                exit={{ opacity: 0, x: -20 }}
                
              >
                <Typography variant="h4" sx={{ color: '#4ECDC4', fontWeight: 700, mb: 4 }}>
                  Geführte Meditationen
                </Typography>
                <Grid container spacing={3}>
                  {guidedMeditations.map((meditation, index) => (
                    <Grid item xs={12} md={6} key={meditation.id}>
                      <motion.div
                        
                        
                        
                      >
                        <Card sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: 4,
                          border: '1px solid rgba(255,255,255,0.2)',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                          }
                        }}>
                          <Box sx={{ 
                            height: 200,
                            background: `linear-gradient(135deg, ${techniques[index % techniques.length].color}20, ${techniques[index % techniques.length].color}40)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                          }}>
                            <PlayCircle size={60} color="#4ECDC4" />
                            <Box sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              background: 'rgba(0,0,0,0.7)',
                              color: 'white',
                              px: 2,
                              py: 1,
                              borderRadius: 2,
                              fontSize: '0.8rem'
                            }}>
                              {meditation.duration} Min
                            </Box>
                          </Box>
                          <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ 
                              color: 'white', 
                              fontWeight: 600, 
                              mb: 1
                            }}>
                              {meditation.title}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: 'rgba(255,255,255,0.7)',
                              mb: 2
                            }}>
                              {meditation.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                von {meditation.instructor}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Star size={16} color="#FFD700" />
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                  {meditation.rating}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                {meditation.participants} Teilnehmer
                              </Typography>
                              <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  background: 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)',
                                  color: '#1a1a2e',
                                  fontWeight: 600,
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #45B7D1 0%, #96CEB4 100%)'
                                  }
                                }}
                              >
                                Starten
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                key="timer"
                
                
                exit={{ opacity: 0, x: -20 }}
                
              >
                <Typography variant="h4" sx={{ color: '#4ECDC4', fontWeight: 700, mb: 4, textAlign: 'center' }}>
                  Meditations-Timer
                </Typography>
                <Box sx={{ 
                  maxWidth: 500, 
                  mx: 'auto',
                  textAlign: 'center'
                }}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.2)',
                    p: 4
                  }}>
                    <Typography variant="h1" sx={{ 
                      color: '#4ECDC4', 
                      fontWeight: 900, 
                      mb: 4,
                      fontSize: '4rem',
                      fontFamily: 'monospace'
                    }}>
                      {formatTime(timeLeft)}
                    </Typography>
                    
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        Dauer: {selectedDuration} Minuten
                      </Typography>
                      <Slider
                        value={selectedDuration}
                        onChange={(e, value) => setSelectedDuration(value as number)}
                        min={1}
                        max={60}
                        step={1}
                        sx={{
                          color: '#4ECDC4',
                          '& .MuiSlider-thumb': {
                            width: 24,
                            height: 24
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
                      <IconButton
                        onClick={isPlaying ? pauseTimer : startTimer}
                        sx={{
                          width: 80,
                          height: 80,
                          background: 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)',
                          color: '#1a1a2e',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #45B7D1 0%, #96CEB4 100%)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                      </IconButton>
                      
                      <IconButton
                        onClick={resetTimer}
                        sx={{
                          width: 60,
                          height: 60,
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.2)',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.2)'
                          }
                        }}
                      >
                        <RotateCcw size={24} />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        startIcon={<Volume2 size={20} />}
                        onClick={() => setIsMuted(!isMuted)}
                        sx={{
                          color: isMuted ? '#FF6B6B' : '#4ECDC4',
                          borderColor: isMuted ? '#FF6B6B' : '#4ECDC4',
                          '&:hover': {
                            borderColor: isMuted ? '#FF6B6B' : '#4ECDC4',
                            backgroundColor: isMuted ? 'rgba(255, 107, 107, 0.1)' : 'rgba(76, 205, 196, 0.1)'
                          }
                        }}
                      >
                        {isMuted ? 'Stumm' : 'Ton'}
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<Settings size={20} />}
                        sx={{
                          color: '#4ECDC4',
                          borderColor: '#4ECDC4',
                          '&:hover': {
                            borderColor: '#4ECDC4',
                            backgroundColor: 'rgba(76, 205, 196, 0.1)'
                          }
                        }}
                      >
                        Einstellungen
                      </Button>
                    </Box>
                  </Card>
                </Box>
              </motion.div>
            )}

            {activeTab === 3 && (
              <motion.div
                key="sessions"
                
                
                exit={{ opacity: 0, x: -20 }}
                
              >
                <Typography variant="h4" sx={{ color: '#4ECDC4', fontWeight: 700, mb: 4 }}>
                  Meine Meditation Sessions
                </Typography>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <CardContent sx={{ p: 4 }}>
                    {recentSessions.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Brain size={64} color="#4ECDC4" style={{ marginBottom: 16 }} />
                        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                          Noch keine Sessions
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                          Starte deine erste Meditation und beginne deine spirituelle Reise.
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => setActiveTab(0)}
                          sx={{
                            background: 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)',
                            color: '#1a1a2e',
                            fontWeight: 600
                          }}
                        >
                          Erste Meditation starten
                        </Button>
                      </Box>
                    ) : (
                      <List>
                        {recentSessions.map((session, index) => (
                          <motion.div
                            key={session.id}
                            
                            
                            
                          >
                            <ListItem sx={{ px: 0 }}>
                              <ListItemAvatar>
                                <Avatar sx={{ 
                                  bgcolor: 'rgba(76, 205, 196, 0.2)',
                                  border: '2px solid #4ECDC4'
                                }}>
                                  <Brain size={20} color="#4ECDC4" />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                    {session.technique}
                                  </Typography>
                                }
                                secondary={
                                  <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                      {session.duration} Minuten • {session.date.toLocaleDateString('de-DE')}
                                    </Typography>
                                    {session.rating && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                        {[...Array(5)].map((_, i) => (
                                          <Star 
                                            key={i} 
                                            size={16} 
                                            color={i < session.rating! ? "#FFD700" : "rgba(255,255,255,0.3)"} 
                                          />
                                        ))}
                                      </Box>
                                    )}
                                  </Box>
                                }
                              />
                              <ListItemSecondaryAction>
                                <IconButton edge="end" sx={{ color: '#4ECDC4' }}>
                                  <ChevronRight size={20} />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                            {index < recentSessions.length - 1 && <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />}
                          </motion.div>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>

      {/* Floating Action Button für Timer */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)',
          color: '#1a1a2e',
          '&:hover': {
            background: 'linear-gradient(135deg, #45B7D1 0%, #96CEB4 100%)',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.3s ease'
        }}
        onClick={() => setActiveTab(2)}
      >
        <Timer size={24} />
      </Fab>

      {/* Technique Dialog */}
      <Dialog
        open={techniqueDialogOpen}
        onClose={() => setTechniqueDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(15, 15, 35, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 4
          }
        }}
      >
        {selectedTechnique && (
          <>
            <DialogTitle sx={{ color: '#4ECDC4', fontWeight: 700, textAlign: 'center' }}>
              {selectedTechnique.name}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box sx={{
                  display: 'inline-flex',
                  p: 3,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${selectedTechnique.color}20, ${selectedTechnique.color}40)`,
                  border: `2px solid ${selectedTechnique.color}`,
                  mb: 2
                }}>
                  {selectedTechnique.icon}
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                  {selectedTechnique.description}
                </Typography>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ color: '#4ECDC4', fontWeight: 600 }}>
                    Dauer
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {selectedTechnique.duration} Minuten
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ color: '#4ECDC4', fontWeight: 600 }}>
                    Schwierigkeit
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {selectedTechnique.difficulty}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" sx={{ color: '#4ECDC4', fontWeight: 600, mb: 1 }}>
                Vorteile
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {selectedTechnique.benefits.map((benefit, index) => (
                  <Chip
                    key={index}
                    label={benefit}
                    size="small"
                    sx={{
                      background: 'rgba(76, 205, 196, 0.2)',
                      color: '#4ECDC4',
                      border: '1px solid rgba(76, 205, 196, 0.3)'
                    }}
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2 }}>
              <Button
                onClick={() => setTechniqueDialogOpen(false)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Schließen
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setTechniqueDialogOpen(false);
                  setActiveTab(2);
                  setSelectedDuration(selectedTechnique.duration);
                }}
                sx={{
                  background: 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)',
                  color: '#1a1a2e',
                  fontWeight: 600
                }}
              >
                Meditation starten
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
