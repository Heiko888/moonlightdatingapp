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
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Crown,
  Star,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Award,
  Target,
  Zap,
  Download,
  Share2,
  Clock,
  BookOpen,
  Globe,
  Trophy,
  Activity
} from 'lucide-react';
// import AccessControl from '@/lib/subscription/accessControl';

interface VIPStats {
  totalSessions: number;
  monthlyGrowth: number;
  communityMembers: number;
  personalCoachingHours: number;
  analyticsViews: number;
  apiCalls: number;
  vipPoints: number;
  achievements: number;
  globalRank: number;
  coursesCompleted: number;
}


interface PersonalCoach {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  nextSession: string;
  avatar: string;
  status: 'available' | 'busy' | 'offline';
}

interface VIPCourse {
  id: string;
  title: string;
  description: string;
  progress: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  isCompleted: boolean;
}

interface VIPAchievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  isUnlocked: boolean;
  unlockedDate?: string;
}

interface GlobalMember {
  id: string;
  name: string;
  country: string;
  city: string;
  avatar: string;
  isOnline: boolean;
  lastActive: string;
}

export default function DashboardVIPPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState<VIPStats>({
    totalSessions: 0,
    monthlyGrowth: 0,
    communityMembers: 0,
    personalCoachingHours: 0,
    analyticsViews: 0,
    apiCalls: 0,
    vipPoints: 0,
    achievements: 0,
    globalRank: 0,
    coursesCompleted: 0
  });
  const [coaches, setCoaches] = useState<PersonalCoach[]>([]);
  const [courses, setCourses] = useState<VIPCourse[]>([]);
  const [achievements, setAchievements] = useState<VIPAchievement[]>([]);
  const [globalMembers, setGlobalMembers] = useState<GlobalMember[]>([]);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<PersonalCoach | null>(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: '60',
    topic: ''
  });

  useEffect(() => {
    loadVIPData();
  }, []);

  const loadVIPData = async () => {
    try {
      // Simuliere VIP-Daten
      setStats({
        totalSessions: 47,
        monthlyGrowth: 23,
        communityMembers: 1247,
        personalCoachingHours: 12,
        analyticsViews: 89,
        apiCalls: 156,
        vipPoints: 2847,
        achievements: 12,
        globalRank: 156,
        coursesCompleted: 8
      });


      setCoaches([
        {
          id: '1',
          name: 'Dr. Sarah Chen',
          specialty: 'Human Design & Business',
          rating: 4.9,
          nextSession: '2024-01-15 14:00',
          avatar: '/avatars/coach1.jpg',
          status: 'available'
        },
        {
          id: '2',
          name: 'Marcus Weber',
          specialty: 'Relationships & Dating',
          rating: 4.8,
          nextSession: '2024-01-16 10:00',
          avatar: '/avatars/coach2.jpg',
          status: 'busy'
        },
        {
          id: '3',
          name: 'Elena Rodriguez',
          specialty: 'Spiritual Development',
          rating: 4.9,
          nextSession: '2024-01-17 16:00',
          avatar: '/avatars/coach3.jpg',
          status: 'available'
        }
      ]);

      // VIP Kurse
      setCourses([
        {
          id: '1',
          title: 'Human Design Masterclass',
          description: 'Vertiefe dein Verständnis der HD-Grundlagen',
          progress: 75,
          duration: '4 Wochen',
          level: 'intermediate',
          category: 'Grundlagen',
          isCompleted: false
        },
        {
          id: '2',
          title: 'Advanced Chart Reading',
          description: 'Lerne professionelle Chart-Interpretation',
          progress: 100,
          duration: '6 Wochen',
          level: 'advanced',
          category: 'Professionell',
          isCompleted: true
        },
        {
          id: '3',
          title: 'Business & Human Design',
          description: 'HD für Unternehmer und Führungskräfte',
          progress: 30,
          duration: '8 Wochen',
          level: 'advanced',
          category: 'Business',
          isCompleted: false
        },
        {
          id: '4',
          title: 'Relationships & Compatibility',
          description: 'HD in Beziehungen und Partnerschaft',
          progress: 0,
          duration: '5 Wochen',
          level: 'intermediate',
          category: 'Beziehungen',
          isCompleted: false
        }
      ]);

      // VIP Achievements
      setAchievements([
        {
          id: '1',
          title: 'Chart Master',
          description: 'Erste Chart-Interpretation abgeschlossen',
          icon: <Trophy size={20} />,
          points: 100,
          isUnlocked: true,
          unlockedDate: '2024-01-10'
        },
        {
          id: '2',
          title: 'Community Leader',
          description: '50 hilfreiche Community-Posts',
          icon: <Crown size={20} />,
          points: 250,
          isUnlocked: true,
          unlockedDate: '2024-01-15'
        },
        {
          id: '3',
          title: 'Course Completist',
          description: '5 Kurse erfolgreich abgeschlossen',
          icon: <BookOpen size={20} />,
          points: 500,
          isUnlocked: true,
          unlockedDate: '2024-01-20'
        },
        {
          id: '4',
          title: 'Global Connector',
          description: 'Mitglieder aus 10+ Ländern kennengelernt',
          icon: <Globe size={20} />,
          points: 300,
          isUnlocked: false
        },
        {
          id: '5',
          title: 'VIP Veteran',
          description: '1 Jahr VIP-Mitgliedschaft',
          icon: <Award size={20} />,
          points: 1000,
          isUnlocked: false
        }
      ]);

      // Globale VIP-Mitglieder
      setGlobalMembers([
        {
          id: '1',
          name: 'Sarah Chen',
          country: 'Deutschland',
          city: 'Berlin',
          avatar: '/avatars/member1.jpg',
          isOnline: true,
          lastActive: 'Jetzt online'
        },
        {
          id: '2',
          name: 'Marcus Weber',
          country: 'Österreich',
          city: 'Wien',
          avatar: '/avatars/member2.jpg',
          isOnline: true,
          lastActive: 'Jetzt online'
        },
        {
          id: '3',
          name: 'Elena Rodriguez',
          country: 'Spanien',
          city: 'Madrid',
          avatar: '/avatars/member3.jpg',
          isOnline: false,
          lastActive: 'vor 2 Stunden'
        },
        {
          id: '4',
          name: 'David Kim',
          country: 'USA',
          city: 'New York',
          avatar: '/avatars/member4.jpg',
          isOnline: true,
          lastActive: 'Jetzt online'
        },
        {
          id: '5',
          name: 'Anna Müller',
          country: 'Schweiz',
          city: 'Zürich',
          avatar: '/avatars/member5.jpg',
          isOnline: false,
          lastActive: 'vor 1 Tag'
        }
      ]);
    } catch (error) {
      console.error('Fehler beim Laden der VIP-Daten:', error);
    }
  };

  const handleBookSession = (coach: PersonalCoach) => {
    setSelectedCoach(coach);
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = () => {
    // Hier würde die Buchung verarbeitet werden
    console.log('Buchung bestätigt:', { coach: selectedCoach, booking: bookingData });
    setShowBookingDialog(false);
    setSelectedCoach(null);
    setBookingData({ date: '', time: '', duration: '60', topic: '' });
  };


  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white',
      '& .MuiDialogTitle-root h4, & .MuiDialogTitle-root .MuiTypography-h4': {
        all: 'unset',
        fontSize: '1.25rem',
        fontWeight: 600,
        color: 'inherit',
        display: 'inline'
      },
      '& h2 h4, & h2 .MuiTypography-h4': {
        all: 'unset',
        fontSize: '1.25rem',
        fontWeight: 600,
        color: 'inherit',
        display: 'inline'
      }
    }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Crown size={48} color="#FFD700" style={{ marginRight: 16 }} />
              <Box>
                <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 700, mb: 1 }}>
                  👑 VIP Dashboard
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Exklusive Premium-Features für VIP-Mitglieder
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  component="a"
                  href="/roadmap"
                  variant="outlined"
                  startIcon={<Target size={20} />}
                  sx={{
                    borderColor: 'rgba(255, 215, 0, 0.3)',
                    color: '#FFD700',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.9rem',
                    '&:hover': {
                      borderColor: '#FFD700',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Roadmap
                </Button>
                <Chip 
                  label="VIP Member" 
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

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ 
                  background: 'rgba(255, 215, 0, 0.1)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Crown size={32} color="#FFD700" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 700 }}>
                      {stats.totalSessions}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Coaching Sessions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ 
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <TrendingUp size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                      +{stats.monthlyGrowth}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Monatliches Wachstum
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ 
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Users size={32} color="#8B5CF6" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#8B5CF6', fontWeight: 700 }}>
                      {stats.communityMembers}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      VIP Community
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ 
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Clock size={32} color="#f59e0b" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                      {stats.personalCoachingHours}h
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Coaching Stunden
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ 
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <BarChart3 size={32} color="#3b82f6" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                      {stats.analyticsViews}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Analytics Views
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ 
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Zap size={32} color="#ef4444" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 700 }}>
                      {stats.apiCalls}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      API Calls
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ 
                  background: 'rgba(255, 215, 0, 0.1)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Trophy size={32} color="#FFD700" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 700 }}>
                      {stats.vipPoints}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      VIP Punkte
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ 
                  background: 'rgba(139, 69, 19, 0.1)',
                  border: '1px solid rgba(139, 69, 19, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Award size={32} color="#8B4513" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#8B4513', fontWeight: 700 }}>
                      {stats.achievements}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Achievements
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ 
                  background: 'rgba(75, 0, 130, 0.1)',
                  border: '1px solid rgba(75, 0, 130, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Globe size={32} color="#4B0082" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#4B0082', fontWeight: 700 }}>
                      #{stats.globalRank}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Globaler Rang
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ 
                  background: 'rgba(0, 128, 0, 0.1)',
                  border: '1px solid rgba(0, 128, 0, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <BookOpen size={32} color="#008000" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#008000', fontWeight: 700 }}>
                      {stats.coursesCompleted}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Kurse abgeschlossen
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
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
                <Tab label="Personal Coach" icon={<Users size={20} />} />
                <Tab label="VIP Community" icon={<Crown size={20} />} />
                <Tab label="HD Academy" icon={<BookOpen size={20} />} />
                <Tab label="Achievements" icon={<Trophy size={20} />} />
                <Tab label="Global Network" icon={<Globe size={20} />} />
                <Tab label="Analytics" icon={<BarChart3 size={20} />} />
                <Tab label="API Access" icon={<Zap size={20} />} />
              </Tabs>

              {/* Personal Coach Tab */}
              {activeTab === 0 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    👨‍🏫 Personal Coach Sessions
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
                                sx={{ width: 60, height: 60, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="h6" sx={{ color: '#fff' }}>
                                  {coach.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  {coach.specialty}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                  <Star size={16} color="#FFD700" />
                                  <Typography variant="body2" sx={{ color: '#FFD700', ml: 0.5 }}>
                                    {coach.rating}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                                Nächste Session: {coach.nextSession}
                              </Typography>
                              <Chip 
                                label={coach.status === 'available' ? 'Verfügbar' : 
                                      coach.status === 'busy' ? 'Beschäftigt' : 'Offline'}
                                size="small"
                                sx={{
                                  background: coach.status === 'available' ? '#10b981' : 
                                             coach.status === 'busy' ? '#f59e0b' : '#6b7280',
                                  color: '#fff'
                                }}
                              />
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

              {/* VIP Community Tab */}
              {activeTab === 1 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    👑 VIP Community
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{
                        background: 'rgba(255, 215, 0, 0.1)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        borderRadius: 2
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                            🌟 Exklusive Gruppen
                          </Typography>
                          <List>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Crown size={20} color="#FFD700" /></ListItemIcon>
                              <ListItemText 
                                primary="VIP Business Network" 
                                secondary="1247 Mitglieder"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Crown size={20} color="#FFD700" /></ListItemIcon>
                              <ListItemText 
                                primary="Elite Dating Circle" 
                                secondary="892 Mitglieder"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Crown size={20} color="#FFD700" /></ListItemIcon>
                              <ListItemText 
                                primary="Mastermind Group" 
                                secondary="156 Mitglieder"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card sx={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: 2
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#8B5CF6', mb: 2 }}>
                            🎯 VIP Events
                          </Typography>
                          <List>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Calendar size={20} color="#8B5CF6" /></ListItemIcon>
                              <ListItemText 
                                primary="Monthly VIP Masterclass" 
                                secondary="15. Januar 2024"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Calendar size={20} color="#8B5CF6" /></ListItemIcon>
                              <ListItemText 
                                primary="Exclusive Networking Event" 
                                secondary="22. Januar 2024"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Calendar size={20} color="#8B5CF6" /></ListItemIcon>
                              <ListItemText 
                                primary="VIP Retreat 2024" 
                                secondary="März 2024"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* HD Academy Tab */}
              {activeTab === 2 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    📚 HD Academy - Premium Kurse
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {courses.map((course) => (
                      <Grid item xs={12} md={6} key={course.id}>
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
                              <BookOpen size={24} color="#FFD700" style={{ marginRight: 12 }} />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ color: '#fff' }}>
                                  {course.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  {course.description}
                                </Typography>
                              </Box>
                              <Chip 
                                label={course.level}
                                size="small"
                                sx={{
                                  background: course.level === 'beginner' ? '#10b981' : 
                                             course.level === 'intermediate' ? '#f59e0b' : '#ef4444',
                                  color: '#fff',
                                  fontSize: '10px'
                                }}
                              />
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                  Fortschritt
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#FFD700' }}>
                                  {course.progress}%
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={course.progress} 
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(90deg, #FFD700, #FFA500)'
                                  }
                                }}
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                📅 {course.duration}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                🏷️ {course.category}
                              </Typography>
                            </Box>
                            
                            <Button
                              fullWidth
                              variant="contained"
                              disabled={course.isCompleted}
                              sx={{
                                background: course.isCompleted ? '#10b981' : 'linear-gradient(45deg, #FFD700, #FFA500)',
                                color: course.isCompleted ? '#fff' : '#1a1a2e',
                                fontWeight: 600,
                                '&:hover': {
                                  background: course.isCompleted ? '#059669' : 'linear-gradient(45deg, #FFA500, #FF8C00)'
                                }
                              }}
                            >
                              {course.isCompleted ? '✅ Abgeschlossen' : 'Kurs starten'}
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Achievements Tab */}
              {activeTab === 3 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    🏆 VIP Achievements & Gamification
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                        🎯 Deine Achievements
                      </Typography>
                      <Grid container spacing={2}>
                        {achievements.map((achievement) => (
                          <Grid item xs={12} sm={6} key={achievement.id}>
                            <Card sx={{
                              background: achievement.isUnlocked ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                              border: `1px solid ${achievement.isUnlocked ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                              borderRadius: 2,
                              opacity: achievement.isUnlocked ? 1 : 0.6
                            }}>
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Box sx={{ 
                                    color: achievement.isUnlocked ? '#FFD700' : 'rgba(255,255,255,0.4)',
                                    mr: 1
                                  }}>
                                    {achievement.icon}
                                  </Box>
                                  <Typography variant="h6" sx={{ 
                                    color: achievement.isUnlocked ? '#fff' : 'rgba(255,255,255,0.6)',
                                    fontSize: '1rem'
                                  }}>
                                    {achievement.title}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ 
                                  color: achievement.isUnlocked ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
                                  mb: 1
                                }}>
                                  {achievement.description}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600 }}>
                                    +{achievement.points} Punkte
                                  </Typography>
                                  {achievement.isUnlocked && achievement.unlockedDate && (
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                      {achievement.unlockedDate}
                                    </Typography>
                                  )}
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Card sx={{
                        background: 'rgba(255, 215, 0, 0.1)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        borderRadius: 2
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                            📊 Deine VIP Stats
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                              Gesamtpunkte
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 700 }}>
                              {stats.vipPoints}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                              Achievements freigeschaltet
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                              {stats.achievements}/5
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                              Globaler Rang
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#8B5CF6', fontWeight: 700 }}>
                              #{stats.globalRank}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Global Network Tab */}
              {activeTab === 4 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    🌍 Global VIP Network
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                        👥 VIP-Mitglieder weltweit
                      </Typography>
                      <Grid container spacing={2}>
                        {globalMembers.map((member) => (
                          <Grid item xs={12} sm={6} md={4} key={member.id}>
                            <Card sx={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 16px rgba(255, 215, 0, 0.2)'
                              }
                            }}>
                              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
                                  <Avatar 
                                    src={member.avatar} 
                                    sx={{ width: 60, height: 60, mx: 'auto' }}
                                  />
                                  <Box sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    background: member.isOnline ? '#10b981' : '#6b7280',
                                    border: '2px solid #1a1a2e'
                                  }} />
                                </Box>
                                <Typography variant="h6" sx={{ color: '#fff', fontSize: '1rem', mb: 0.5 }}>
                                  {member.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                                  {member.city}, {member.country}
                                </Typography>
                                <Chip 
                                  label={member.isOnline ? 'Online' : 'Offline'}
                                  size="small"
                                  sx={{
                                    background: member.isOnline ? '#10b981' : '#6b7280',
                                    color: '#fff',
                                    fontSize: '10px'
                                  }}
                                />
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Card sx={{
                        background: 'rgba(75, 0, 130, 0.1)',
                        border: '1px solid rgba(75, 0, 130, 0.3)',
                        borderRadius: 2
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#4B0082', mb: 2 }}>
                            🌐 Global Stats
                          </Typography>
                          <List>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Globe size={20} color="#4B0082" /></ListItemIcon>
                              <ListItemText 
                                primary="Länder vertreten" 
                                secondary="47 Länder"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Users size={20} color="#4B0082" /></ListItemIcon>
                              <ListItemText 
                                primary="Aktive Mitglieder" 
                                secondary="1,247 VIPs"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Activity size={20} color="#4B0082" /></ListItemIcon>
                              <ListItemText 
                                primary="Online jetzt" 
                                secondary="156 Mitglieder"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Analytics Tab */}
              {activeTab === 5 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    📊 Premium Analytics
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: 2
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#3b82f6', mb: 2 }}>
                            📈 Performance Trends
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                              Human Design Chart Views
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={75} 
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)'
                                }
                              }}
                            />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              75% (+12% vs. letzter Monat)
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                              Community Engagement
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={68} 
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #10b981, #059669)'
                                }
                              }}
                            />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              68% (+8% vs. letzter Monat)
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card sx={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: 2
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#10b981', mb: 2 }}>
                            🎯 Goal Tracking
                          </Typography>
                          <List>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Target size={20} color="#10b981" /></ListItemIcon>
                              <ListItemText 
                                primary="Coaching Sessions" 
                                secondary="12/20 completed"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Target size={20} color="#10b981" /></ListItemIcon>
                              <ListItemText 
                                primary="Community Posts" 
                                secondary="8/15 completed"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Target size={20} color="#10b981" /></ListItemIcon>
                              <ListItemText 
                                primary="Reading Requests" 
                                secondary="5/10 completed"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* API Access Tab */}
              {activeTab === 6 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    ⚡ API Access
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 2
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#ef4444', mb: 2 }}>
                            🔑 API Keys
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                              Production Key
                            </Typography>
                            <TextField
                              fullWidth
                              value="hd_vip_sk_live_..."
                              InputProps={{
                                readOnly: true,
                                sx: { color: 'rgba(255,255,255,0.8)' }
                              }}
                              size="small"
                            />
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                              Test Key
                            </Typography>
                            <TextField
                              fullWidth
                              value="hd_vip_sk_test_..."
                              InputProps={{
                                readOnly: true,
                                sx: { color: 'rgba(255,255,255,0.8)' }
                              }}
                              size="small"
                            />
                          </Box>
                          <Button
                            variant="outlined"
                            startIcon={<Download size={16} />}
                            sx={{ color: '#ef4444', borderColor: '#ef4444' }}
                          >
                            Neue Keys generieren
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card sx={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: 2
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#8B5CF6', mb: 2 }}>
                            📚 API Documentation
                          </Typography>
                          <List>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Zap size={20} color="#8B5CF6" /></ListItemIcon>
                              <ListItemText 
                                primary="Chart Calculation API" 
                                secondary="Berechne Human Design Charts"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Zap size={20} color="#8B5CF6" /></ListItemIcon>
                              <ListItemText 
                                primary="Compatibility API" 
                                secondary="Vergleiche Charts"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Zap size={20} color="#8B5CF6" /></ListItemIcon>
                              <ListItemText 
                                primary="Reading Generation API" 
                                secondary="Generiere AI-Readings"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                          </List>
                          <Button
                            variant="outlined"
                            startIcon={<Share2 size={16} />}
                            sx={{ color: '#8B5CF6', borderColor: '#8B5CF6', mt: 2 }}
                          >
                            Dokumentation öffnen
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
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
            <DialogTitle 
              sx={{ 
                color: '#FFD700', 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                '& .MuiTypography-root': {
                  fontSize: '1.25rem',
                  fontWeight: 600
                }
              }}
            >
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
                <Grid item xs={12}>
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
        </Container>
      </Box>
  );
}