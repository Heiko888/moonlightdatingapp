'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  IconButton,
  Badge,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  LinearProgress,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Users,
  Calendar,
  MessageCircle,
  Video,
  Phone,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Edit,
  Trash2,
  Download,
  Share2,
  Filter,
  Search,
  Award,
  Target,
  TrendingUp,
  Heart,
  Brain,
  Zap,
  Crown,
  BookOpen,
  FileText,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  Settings
} from 'lucide-react';
import AccessControl from '@/components/AccessControl';

interface Coach {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  totalSessions: number;
  avatar: string;
  status: 'available' | 'busy' | 'offline';
  nextAvailable: string;
  price: number;
  description: string;
  certifications: string[];
  languages: string[];
  experience: number;
}

interface Session {
  id: string;
  coachId: string;
  coachName: string;
  coachAvatar: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  topic: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  recording?: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  coachId: string;
  milestones: string[];
}

export default function PersonalCoachPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: '60',
    type: 'video',
    topic: ''
  });
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionRating, setSessionRating] = useState(0);
  const [sessionFeedback, setSessionFeedback] = useState('');

  useEffect(() => {
    loadCoachData();
  }, []);

  const loadCoachData = async () => {
    try {
      // Simuliere Coach-Daten
      setCoaches([
        {
          id: '1',
          name: 'Dr. Sarah Chen',
          specialty: 'Human Design & Business Strategy',
          rating: 4.9,
          totalSessions: 1247,
          avatar: '/avatars/coach1.jpg',
          status: 'available',
          nextAvailable: '2024-01-15 14:00',
          price: 150,
          description: 'Expertin für Human Design in Business-Kontexten. 15+ Jahre Erfahrung in der Beratung von Führungskräften und Unternehmern.',
          certifications: ['Certified Human Design Analyst', 'Business Coach', 'NLP Master'],
          languages: ['Deutsch', 'Englisch', 'Chinesisch'],
          experience: 15
        },
        {
          id: '2',
          name: 'Marcus Weber',
          specialty: 'Relationships & Dating Coaching',
          rating: 4.8,
          totalSessions: 892,
          avatar: '/avatars/coach2.jpg',
          status: 'busy',
          nextAvailable: '2024-01-16 10:00',
          price: 120,
          description: 'Spezialist für Beziehungen und Dating mit Human Design. Hilft Singles dabei, authentische Verbindungen zu finden.',
          certifications: ['Relationship Coach', 'Human Design Practitioner', 'Dating Expert'],
          languages: ['Deutsch', 'Englisch'],
          experience: 12
        },
        {
          id: '3',
          name: 'Elena Rodriguez',
          specialty: 'Spiritual Development & Life Purpose',
          rating: 4.9,
          totalSessions: 634,
          avatar: '/avatars/coach3.jpg',
          status: 'available',
          nextAvailable: '2024-01-17 16:00',
          price: 130,
          description: 'Spirituelle Begleiterin mit Fokus auf Lebenszweck und persönliche Transformation. Kombiniert Human Design mit spirituellen Praktiken.',
          certifications: ['Spiritual Life Coach', 'Human Design Reader', 'Meditation Teacher'],
          languages: ['Deutsch', 'Spanisch', 'Englisch'],
          experience: 10
        }
      ]);

      setSessions([
        {
          id: '1',
          coachId: '1',
          coachName: 'Dr. Sarah Chen',
          coachAvatar: '/avatars/coach1.jpg',
          date: '2024-01-15',
          time: '14:00',
          duration: 60,
          type: 'video',
          status: 'scheduled',
          topic: 'Business Strategy & Human Design',
          notes: 'Vorbereitung auf wichtige Präsentation'
        },
        {
          id: '2',
          coachId: '2',
          coachName: 'Marcus Weber',
          coachAvatar: '/avatars/coach2.jpg',
          date: '2024-01-10',
          time: '16:00',
          duration: 90,
          type: 'video',
          status: 'completed',
          topic: 'Dating Strategy',
          notes: 'Besprochen: Authentizität in Dating-Profilen',
          rating: 5,
          feedback: 'Sehr hilfreich! Marcus hat mir geholfen, meine wahre Persönlichkeit zu zeigen.',
          recording: '/recordings/session-2.mp4'
        },
        {
          id: '3',
          coachId: '3',
          coachName: 'Elena Rodriguez',
          coachAvatar: '/avatars/coach3.jpg',
          date: '2024-01-08',
          time: '10:00',
          duration: 60,
          type: 'phone',
          status: 'completed',
          topic: 'Life Purpose Discovery',
          notes: 'Tiefe Reflexion über Lebenszweck und Ziele',
          rating: 5,
          feedback: 'Elena hat mir geholfen, meinen wahren Lebenszweck zu finden. Sehr transformativ!'
        }
      ]);

      setGoals([
        {
          id: '1',
          title: 'Business-Erfolg mit Human Design',
          description: 'Mein Business mit Human Design-Prinzipien auf das nächste Level bringen',
          targetDate: '2024-06-30',
          progress: 65,
          status: 'active',
          coachId: '1',
          milestones: [
            'Human Design Chart analysiert',
            'Business-Strategie entwickelt',
            'Team-Dynamiken optimiert',
            'Marketing-Strategie angepasst',
            'Erfolgsmetriken definiert'
          ]
        },
        {
          id: '2',
          title: 'Authentische Beziehungen finden',
          description: 'Echte, tiefe Verbindungen basierend auf Human Design-Kompatibilität',
          targetDate: '2024-12-31',
          progress: 40,
          status: 'active',
          coachId: '2',
          milestones: [
            'Dating-Profil optimiert',
            'Kompatibilitäts-Kriterien definiert',
            'Erste Dates geplant',
            'Beziehungsdynamiken verstanden',
            'Langlebige Partnerschaft gefunden'
          ]
        },
        {
          id: '3',
          title: 'Spirituelle Entwicklung',
          description: 'Tiefere Verbindung zu meinem spirituellen Selbst und Lebenszweck',
          targetDate: '2024-09-30',
          progress: 80,
          status: 'active',
          coachId: '3',
          milestones: [
            'Meditations-Praxis etabliert',
            'Lebenszweck identifiziert',
            'Spirituelle Praktiken integriert',
            'Innere Ruhe gefunden',
            'Spirituelle Gemeinschaft aufgebaut'
          ]
        }
      ]);
    } catch (error) {
      console.error('Fehler beim Laden der Coach-Daten:', error);
    }
  };

  const handleBookSession = (coach: Coach) => {
    setSelectedCoach(coach);
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      coachId: selectedCoach!.id,
      coachName: selectedCoach!.name,
      coachAvatar: selectedCoach!.avatar,
      date: bookingData.date,
      time: bookingData.time,
      duration: parseInt(bookingData.duration),
      type: bookingData.type as any,
      status: 'scheduled',
      topic: bookingData.topic
    };
    
    setSessions([newSession, ...sessions]);
    setShowBookingDialog(false);
    setSelectedCoach(null);
    setBookingData({ date: '', time: '', duration: '60', type: 'video', topic: '' });
  };

  const handleStartSession = (session: Session) => {
    setSelectedSession(session);
    setShowSessionDialog(true);
  };

  const handleCompleteSession = () => {
    if (selectedSession) {
      setSessions(sessions.map(s => 
        s.id === selectedSession.id 
          ? { 
              ...s, 
              status: 'completed' as const,
              notes: sessionNotes,
              rating: sessionRating,
              feedback: sessionFeedback
            }
          : s
      ));
    }
    setShowSessionDialog(false);
    setSelectedSession(null);
    setSessionNotes('');
    setSessionRating(0);
    setSessionFeedback('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'busy': return '#f59e0b';
      case 'offline': return '#6b7280';
      case 'scheduled': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle size={16} />;
      case 'busy': return <Clock size={16} />;
      case 'offline': return <AlertCircle size={16} />;
      case 'scheduled': return <Calendar size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <AlertCircle size={16} />;
      default: return <Info size={16} />;
    }
  };

  return (
    <AccessControl path="/personal-coach">
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white'
      }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Users size={48} color="#FFD700" style={{ marginRight: 16 }} />
              <Box>
                <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 700, mb: 1 }}>
                  👨‍🏫 Personal Coach
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  1:1 Coaching mit zertifizierten Human Design Experten
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <Chip 
                  label="VIP Exclusive" 
                  sx={{ 
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    color: '#1a1a2e',
                    fontWeight: 600,
                    fontSize: '1rem',
                    px: 2,
                    py: 1
                  }} 
                />
              </Box>
            </Box>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3
            }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255,255,255,0.7)',
                    '&.Mui-selected': {
                      color: '#FFD700'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#FFD700'
                  }
                }}
              >
                <Tab label="Coaches" icon={<Users size={20} />} />
                <Tab label="Sessions" icon={<Calendar size={20} />} />
                <Tab label="Ziele" icon={<Target size={20} />} />
              </Tabs>

              {/* Coaches Tab */}
              {activeTab === 0 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    🎯 Verfügbare Coaches
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {coaches.map((coach) => (
                      <Grid item xs={12} md={4} key={coach.id}>
                        <Card sx={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)'
                          }
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Avatar 
                                src={coach.avatar} 
                                sx={{ width: 80, height: 80, mr: 2 }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ color: '#fff', mb: 0.5 }}>
                                  {coach.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                  {coach.specialty}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Rating value={coach.rating} readOnly size="small" />
                                  <Typography variant="body2" sx={{ color: '#FFD700' }}>
                                    {coach.rating} ({coach.totalSessions} Sessions)
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                              {coach.description}
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                Zertifizierungen:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {coach.certifications.map((cert, index) => (
                                  <Chip 
                                    key={index}
                                    label={cert} 
                                    size="small" 
                                    sx={{ 
                                      background: 'rgba(139, 92, 246, 0.2)',
                                      color: '#8B5CF6',
                                      fontSize: '0.7rem'
                                    }} 
                                  />
                                ))}
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Clock size={16} color="#FFD700" style={{ marginRight: 8 }} />
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Nächste Verfügbarkeit: {coach.nextAvailable}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                              <Chip 
                                label={coach.status === 'available' ? 'Verfügbar' : 
                                      coach.status === 'busy' ? 'Beschäftigt' : 'Offline'}
                                size="small"
                                sx={{
                                  background: getStatusColor(coach.status),
                                  color: '#fff',
                                  mr: 2
                                }}
                              />
                              <Typography variant="h6" sx={{ color: '#FFD700' }}>
                                €{coach.price}/h
                              </Typography>
                            </Box>
                            
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => handleBookSession(coach)}
                              disabled={coach.status !== 'available'}
                              sx={{
                                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                color: '#1a1a2e',
                                fontWeight: 600,
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #FFA500, #FF8C00)'
                                },
                                '&:disabled': {
                                  background: 'rgba(255,255,255,0.1)',
                                  color: 'rgba(255,255,255,0.3)'
                                }
                              }}
                            >
                              Session buchen
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Sessions Tab */}
              {activeTab === 1 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    📅 Meine Sessions
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {sessions.map((session) => (
                      <Grid item xs={12} md={6} key={session.id}>
                        <Card sx={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.1)'
                          }
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Avatar 
                                src={session.coachAvatar} 
                                sx={{ width: 50, height: 50, mr: 2 }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ color: '#fff' }}>
                                  {session.coachName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  {session.date} um {session.time}
                                </Typography>
                              </Box>
                              <Chip 
                                label={session.status === 'scheduled' ? 'Geplant' : 
                                      session.status === 'completed' ? 'Abgeschlossen' : 'Abgebrochen'}
                                size="small"
                                sx={{
                                  background: getStatusColor(session.status),
                                  color: '#fff'
                                }}
                              />
                            </Box>
                            
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                              <strong>Thema:</strong> {session.topic}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              {session.type === 'video' && <Video size={16} color="#3b82f6" style={{ marginRight: 8 }} />}
                              {session.type === 'phone' && <Phone size={16} color="#10b981" style={{ marginRight: 8 }} />}
                              {session.type === 'in-person' && <Users size={16} color="#f59e0b" style={{ marginRight: 8 }} />}
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {session.duration} Minuten • {session.type === 'video' ? 'Video Call' : 
                                 session.type === 'phone' ? 'Telefon' : 'Persönlich'}
                              </Typography>
                            </Box>
                            
                            {session.notes && (
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                                <strong>Notizen:</strong> {session.notes}
                              </Typography>
                            )}
                            
                            {session.rating && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Rating value={session.rating} readOnly size="small" />
                                <Typography variant="body2" sx={{ color: '#FFD700', ml: 1 }}>
                                  {session.rating}/5
                                </Typography>
                              </Box>
                            )}
                            
                            {session.feedback && (
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                                <strong>Feedback:</strong> {session.feedback}
                              </Typography>
                            )}
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {session.status === 'scheduled' && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleStartSession(session)}
                                  sx={{
                                    background: 'linear-gradient(45deg, #10b981, #059669)',
                                    color: '#fff',
                                    fontWeight: 600
                                  }}
                                >
                                  Session starten
                                </Button>
                              )}
                              
                              {session.recording && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<Download size={16} />}
                                  sx={{ color: '#3b82f6', borderColor: '#3b82f6' }}
                                >
                                  Aufnahme
                                </Button>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Goals Tab */}
              {activeTab === 2 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    🎯 Meine Ziele
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {goals.map((goal) => (
                      <Grid item xs={12} md={6} key={goal.id}>
                        <Card sx={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.1)'
                          }
                        }}>
                          <CardContent>
                            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                              {goal.title}
                            </Typography>
                            
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                              {goal.description}
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  Fortschritt
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#FFD700' }}>
                                  {goal.progress}%
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={goal.progress} 
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(90deg, #FFD700, #FFA500)'
                                  }
                                }}
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Target size={16} color="#FFD700" style={{ marginRight: 8 }} />
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Ziel: {goal.targetDate}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                Meilensteine:
                              </Typography>
                              <List dense>
                                {goal.milestones.map((milestone, index) => (
                                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                                    <ListItemIcon>
                                      <CheckCircle 
                                        size={16} 
                                        color={index < (goal.progress / 100) * goal.milestones.length ? '#10b981' : '#6b7280'} 
                                      />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={milestone}
                                      sx={{ 
                                        color: index < (goal.progress / 100) * goal.milestones.length ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'
                                      }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                            
                            <Chip 
                              label={goal.status === 'active' ? 'Aktiv' : 
                                    goal.status === 'completed' ? 'Abgeschlossen' : 'Pausiert'}
                              size="small"
                              sx={{
                                background: goal.status === 'active' ? '#10b981' : 
                                           goal.status === 'completed' ? '#8B5CF6' : '#f59e0b',
                                color: '#fff'
                              }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Paper>
          </motion.div>

          {/* Booking Dialog */}
          <Dialog
            open={showBookingDialog}
            onClose={() => setShowBookingDialog(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                background: 'rgba(26, 26, 46, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                color: 'white'
              }
            }}
          >
            <DialogTitle sx={{ color: '#FFD700', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              Session mit {selectedCoach?.name} buchen
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Datum"
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Uhrzeit"
                    type="time"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Dauer</InputLabel>
                    <Select
                      value={bookingData.duration}
                      onChange={(e) => setBookingData({...bookingData, duration: e.target.value})}
                      sx={{
                        color: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' }
                      }}
                    >
                      <MenuItem value="30">30 Minuten</MenuItem>
                      <MenuItem value="60">60 Minuten</MenuItem>
                      <MenuItem value="90">90 Minuten</MenuItem>
                      <MenuItem value="120">120 Minuten</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Typ</InputLabel>
                    <Select
                      value={bookingData.type}
                      onChange={(e) => setBookingData({...bookingData, type: e.target.value})}
                      sx={{
                        color: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' }
                      }}
                    >
                      <MenuItem value="video">Video Call</MenuItem>
                      <MenuItem value="phone">Telefon</MenuItem>
                      <MenuItem value="in-person">Persönlich</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Thema/Beschreibung"
                    value={bookingData.topic}
                    onChange={(e) => setBookingData({...bookingData, topic: e.target.value})}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Button
                onClick={() => setShowBookingDialog(false)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleConfirmBooking}
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  color: '#1a1a2e',
                  fontWeight: 600
                }}
              >
                Session buchen
              </Button>
            </DialogActions>
          </Dialog>

          {/* Session Dialog */}
          <Dialog
            open={showSessionDialog}
            onClose={() => setShowSessionDialog(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                background: 'rgba(26, 26, 46, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                color: 'white'
              }
            }}
          >
            <DialogTitle sx={{ color: '#FFD700', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              Session mit {selectedSession?.coachName}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ 
                    background: 'rgba(0,0,0,0.3)', 
                    borderRadius: 2, 
                    p: 2, 
                    mb: 2,
                    minHeight: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Video Call Interface würde hier angezeigt werden
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Video size={16} />}
                      sx={{ background: '#10b981', color: '#fff' }}
                    >
                      Video an
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Mic size={16} />}
                      sx={{ background: '#3b82f6', color: '#fff' }}
                    >
                      Mikrofon an
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Settings size={16} />}
                      sx={{ color: '#FFD700', borderColor: '#FFD700' }}
                    >
                      Einstellungen
                    </Button>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                    Session Notizen
                  </Typography>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="Notizen während der Session..."
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                      }
                    }}
                  />
                  
                  <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                    Bewertung
                  </Typography>
                  
                  <Rating
                    value={sessionRating}
                    onChange={(e, newValue) => setSessionRating(newValue || 0)}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Feedback zur Session..."
                    value={sessionFeedback}
                    onChange={(e) => setSessionFeedback(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Button
                onClick={() => setShowSessionDialog(false)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Session beenden
              </Button>
              <Button
                onClick={handleCompleteSession}
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  color: '#fff',
                  fontWeight: 600
                }}
              >
                Session abschließen
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </AccessControl>
  );
}
