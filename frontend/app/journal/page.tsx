"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Container, Typography, Card, CardContent, Box, Button, Paper, Chip, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, LinearProgress, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { Star, BookOpen, BarChart3, Target, Plus, Calendar, TrendingUp, CheckCircle, Filter, Home, Briefcase, Heart, Users, User } from 'lucide-react';
import SSRSafeStars from '@/components/SSRSafeStars';
import AccessControl from '@/components/AccessControl';
// import { UserSubscription } from '@/lib/subscription/types'; // Entfernt - nicht mehr benötigt
// import { SubscriptionService } from '@/lib/subscription/subscriptionService'; // Entfernt - nicht mehr benötigt


export default function JournalPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [newGoal, setNewGoal] = useState({ title: '', description: '', deadline: '', category: 'privat' });
  const [showJournalDialog, setShowJournalDialog] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState('alle');
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [journalEntries, setJournalEntries] = useState([
    {
      id: 1,
      date: '2024-12-10',
      content: 'Heute habe ich mein Human Design Chart analysiert und bin erstaunt, wie genau es meine Persönlichkeit beschreibt. Als Manifesting Generator fühle ich mich endlich verstanden.',
      mood: 'Begeistert',
      tags: ['Chart-Analyse', 'Selbsterkenntnis']
    },
    {
      id: 2,
      date: '2024-12-09',
      content: 'Ich habe heute meine Strategie "Warten auf die Einladung" angewendet und es war erstaunlich, wie viel weniger Stress ich hatte. Die Menschen kamen von selbst auf mich zu.',
      mood: 'Zufrieden',
      tags: ['Strategie', 'Energie-Management']
    },
    {
      id: 3,
      date: '2024-12-08',
      content: 'Meine emotionale Autorität hat mir heute geholfen, eine wichtige Entscheidung zu treffen. Ich habe gewartet, bis meine Emotionen sich beruhigt haben, und dann war die Antwort klar.',
      mood: 'Klar',
      tags: ['Autorität', 'Entscheidungen']
    },
    {
      id: 4,
      date: '2024-12-07',
      title: 'Mond-Tracking: Vollmond - 07.12.2024',
      content: 'Mondphase: Vollmond\nStimmung: 8/10\nEnergie: 7/10\n\nNotizen:\nHeute fühle ich mich besonders verbunden mit der kosmischen Energie. Der Vollmond hat mir geholfen, meine Manifesting Generator Energie zu nutzen.\n\nRituale:\nMeditation, Kristall aufladen, Intentionen setzen',
      mood: 'Begeistert',
      tags: ['Mond-Tracking', 'Vollmond']
    }
  ]);

  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Human Design Grundlagen lernen',
      description: 'Die vier Typen und ihre Strategien verstehen',
      deadline: '2024-12-31',
      progress: 75,
      completed: false,
      category: 'privat'
    },
    {
      id: 2,
      title: 'Tägliches Journaling etablieren',
      description: 'Jeden Tag 10 Minuten über meine Human Design Erfahrungen schreiben',
      deadline: '2024-12-20',
      progress: 60,
      completed: false,
      category: 'privat'
    },
    {
      id: 3,
      title: 'Chart-Analyse Workshop besuchen',
      description: 'Lernen, wie man Human Design Charts liest und interpretiert',
      deadline: '2025-01-15',
      progress: 0,
      completed: false,
      category: 'beruflich'
    },
    {
      id: 4,
      title: 'Mehr Sport treiben',
      description: '3x pro Woche ins Fitnessstudio gehen',
      deadline: '2025-02-01',
      progress: 30,
      completed: false,
      category: 'gesundheit'
    },
    {
      id: 5,
      title: 'Neue Freundschaften knüpfen',
      description: 'Mindestens 2 neue Menschen pro Monat kennenlernen',
      deadline: '2025-03-01',
      progress: 20,
      completed: false,
      category: 'freundschaften'
    },
    {
      id: 6,
      title: 'Beziehung vertiefen',
      description: 'Mehr Zeit mit meinem Partner verbringen und gemeinsame Aktivitäten planen',
      deadline: '2025-01-31',
      progress: 45,
      completed: false,
      category: 'beziehung'
    }
  ]);

  const [trackingData, setTrackingData] = useState({
    totalEntries: journalEntries.length,
    currentStreak: 3,
    longestStreak: 7,
    goalsCompleted: 0,
    totalGoals: goals.length
  });

  // const _moods = [
  //   { label: 'Begeistert', color: '#10b981' },
  //   { label: 'Zufrieden', color: '#f59e0b' },
  //   { label: 'Klar', color: '#8b5cf6' },
  //   { label: 'Verwirrt', color: '#ef4444' },
  //   { label: 'Neutral', color: '#64748b' }
  // ];

  // const _tags = [
  //   'Chart-Analyse', 'Selbsterkenntnis', 'Strategie', 'Energie-Management',
  //   'Autorität', 'Entscheidungen', 'Beziehungen', 'Karriere', 'Gesundheit'
  // ];

  const goalCategories = [
    { id: 'alle', name: 'Alle Ziele', icon: Filter, color: '#FFD700' },
    { id: 'privat', name: 'Privat', icon: Home, color: '#10b981' },
    { id: 'beruflich', name: 'Beruflich', icon: Briefcase, color: '#3b82f6' },
    { id: 'gesundheit', name: 'Gesundheit', icon: Heart, color: '#ef4444' },
    { id: 'freundschaften', name: 'Freundschaften', icon: Users, color: '#8b5cf6' },
    { id: 'beziehung', name: 'Beziehung', icon: User, color: '#f59e0b' }
  ];

  const filteredGoals = selectedCategory === 'alle' 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory);

  const addJournalEntry = () => {
    if (journalEntry.trim()) {
      const newEntry = {
        id: Date.now(),
        date: selectedDate,
        content: journalEntry,
        mood: 'Zufrieden',
        tags: []
      };
      setJournalEntries([newEntry, ...journalEntries]);
      setJournalEntry('');
      setShowJournalDialog(false);
      updateTrackingData();
    }
  };

  const addGoal = () => {
    if (newGoal.title.trim()) {
      const goal = {
        id: Date.now(),
        title: newGoal.title,
        description: newGoal.description,
        deadline: newGoal.deadline,
        progress: 0,
        completed: false,
        category: newGoal.category
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: '', description: '', deadline: '', category: 'privat' });
      setShowGoalDialog(false);
      updateTrackingData();
    }
  };

  const updateGoalProgress = (goalId: number, progress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress: Math.min(100, Math.max(0, progress)) }
        : goal
    ));
  };

  const completeGoal = (goalId: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: true, progress: 100 }
        : goal
    ));
    updateTrackingData();
  };

  const updateTrackingData = useCallback(() => {
    setTrackingData({
      totalEntries: journalEntries.length,
      currentStreak: 3, // Simplified calculation
      longestStreak: 7,
      goalsCompleted: goals.filter(g => g.completed).length,
      totalGoals: goals.length
    });
  }, [journalEntries, goals]);

  // Authentifizierung und Subscription prüfen
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        // Authentication state - User nicht eingeloggt
        console.log('User not authenticated - redirecting to login');
        // Hier könnte ein Redirect zu /login implementiert werden
        // Keine Authentifizierung erforderlich - App ist öffentlich
        return;
      }
      
      // Authentication state - User ist eingeloggt
      console.log('User authenticated:', userId);
      // Hier könnten weitere Authentifizierungs-Checks implementiert werden
      
      // Daten laden
      updateTrackingData();
      loadUserSubscription();
    };

    checkAuth();
  }, [router, journalEntries, goals, updateTrackingData]);

  const loadUserSubscription = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        // Temporärer Fix - SubscriptionService entfernt
        // const subscription = await SubscriptionService.getUserSubscription(user.id);
        const subscription = null;
        setUserSubscription(subscription);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Abonnements:', error);
    }
  };

  return (
    <AccessControl 
      path={pathname} 
      userSubscription={userSubscription}
      onUpgrade={() => router.push('/pricing')}
    >
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <SSRSafeStars />
      
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 2,
                textShadow: '0 0 30px rgba(255, 107, 157, 0.3)'
              }}
            >
              📝 Journal & Tracking
            </Typography>
            <motion.div
              
              
              
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  mb: 3,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Dokumentiere deine Human Design Reise und verfolge deine Entwicklung
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          
          
          
        >
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <BookOpen size={32} color="#ff6b9d" style={{ marginBottom: 16 }} />
                  <Typography variant="h3" sx={{ color: '#ff6b9d', fontWeight: 800, mb: 1 }}>
                    {trackingData.totalEntries}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Journal Einträge
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <TrendingUp size={32} color="#4ecdc4" style={{ marginBottom: 16 }} />
                  <Typography variant="h3" sx={{ color: '#4ecdc4', fontWeight: 800, mb: 1 }}>
                    {trackingData.currentStreak}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Tage in Folge
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Target size={32} color="#667eea" style={{ marginBottom: 16 }} />
                  <Typography variant="h3" sx={{ color: '#667eea', fontWeight: 800, mb: 1 }}>
                    {trackingData.goalsCompleted}/{trackingData.totalGoals}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Ziele erreicht
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <BarChart3 size={32} color="#10b981" style={{ marginBottom: 16 }} />
                  <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 800, mb: 1 }}>
                    {Math.round((trackingData.goalsCompleted / trackingData.totalGoals) * 100)}%
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Erfolgsrate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* Tabs */}
        <motion.div
          
          
          
        >
          <Paper sx={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            mb: 6
          }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  '&.Mui-selected': {
                    color: '#ff6b9d'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#ff6b9d'
                }
              }}
            >
              <Tab label="Journal" icon={<BookOpen size={20} />} />
              <Tab label="Ziele" icon={<Target size={20} />} />
              <Tab label="Tracking" icon={<BarChart3 size={20} />} />
            </Tabs>
          </Paper>
        </motion.div>

        {/* Journal Tab */}
        {activeTab === 0 && (
          <motion.div
            
            
            
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h3" sx={{ 
                color: '#ffffff', 
                fontWeight: 700 
              }}>
                Meine Journal Einträge
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => setShowJournalDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 2,
                  borderRadius: 12,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(255, 107, 157, 0.4)'
                  }
                }}
              >
                Neuer Eintrag
              </Button>
            </Box>
            
            <Grid container spacing={4}>
              {journalEntries.map((entry, index) => (
                <Grid item xs={12} md={6} key={entry.id}>
                  <motion.div
                    
                    
                    
                    whileHover={{ y: -8 }}
                  >
                    <Card sx={{
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Calendar size={20} color="#ff6b9d" />
                            <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {new Date(entry.date).toLocaleDateString('de-DE')}
                            </Typography>
                          </Box>
                          <Chip
                            label={entry.mood}
                            size="small"
                            sx={{
                              background: 'rgba(255, 107, 157, 0.2)',
                              color: '#ff6b9d',
                              border: '1px solid rgba(255, 107, 157, 0.3)'
                            }}
                          />
                        </Box>

                        <Typography sx={{
                          color: 'rgba(255,255,255,0.9)',
                          mb: 3,
                          lineHeight: 1.6
                        }}>
                          {entry.content}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {entry.tags.map((tag, idx) => (
                            <Chip
                              key={idx}
                              label={tag}
                              size="small"
                              sx={{
                                background: 'rgba(255, 107, 157, 0.15)',
                                color: '#ff6b9d',
                                border: '1px solid rgba(255, 107, 157, 0.2)',
                                fontSize: '0.8rem'
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

        {/* Goals Tab */}
        {activeTab === 1 && (
          <motion.div
            
            
            
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h3" sx={{ 
                color: '#ffffff', 
                fontWeight: 700 
              }}>
                Meine Ziele
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => setShowGoalDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 2,
                  borderRadius: 12,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(255, 107, 157, 0.4)'
                  }
                }}
              >
                Neues Ziel
              </Button>
            </Box>

            {/* Kategorien-Filter */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ 
                color: '#ffffff', 
                fontWeight: 600, 
                mb: 2 
              }}>
                Kategorien
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {goalCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Chip
                      key={category.id}
                      label={category.name}
                      icon={<IconComponent size={16} />}
                      onClick={() => setSelectedCategory(category.id)}
                      sx={{
                        background: selectedCategory === category.id 
                          ? category.color 
                          : 'rgba(255,255,255,0.1)',
                        color: selectedCategory === category.id 
                          ? '#000' 
                          : 'rgba(255,255,255,0.8)',
                        border: `1px solid ${category.color}`,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: category.color,
                          color: '#000',
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 20px ${category.color}40`
                        }
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
            
            <Grid container spacing={4}>
              {filteredGoals.map((goal, index) => (
                <Grid item xs={12} md={6} key={goal.id}>
                  <motion.div
                    
                    
                    
                    whileHover={{ y: -8 }}
                  >
                    <Card sx={{
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                      }
                    }}>
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h5" sx={{
                              color: '#ffffff',
                              fontWeight: 700,
                              mb: 1
                            }}>
                              {goal.title}
                            </Typography>
                            <Chip
                              label={goalCategories.find(cat => cat.id === goal.category)?.name || goal.category}
                              size="small"
                              icon={(() => {
                                const category = goalCategories.find(cat => cat.id === goal.category);
                                const IconComponent = category?.icon || Filter;
                                return <IconComponent size={12} />;
                              })()}
                              sx={{
                                background: goalCategories.find(cat => cat.id === goal.category)?.color || '#FFD700',
                                color: '#000',
                                fontWeight: 600,
                                fontSize: '0.7rem'
                              }}
                            />
                          </Box>
                          {goal.completed && (
                            <CheckCircle size={24} color="#10b981" />
                          )}
                        </Box>

                        <Typography sx={{
                          color: 'rgba(255,255,255,0.8)',
                          mb: 3,
                          lineHeight: 1.6
                        }}>
                          {goal.description}
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                              Fortschritt
                            </Typography>
                            <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>
                              {goal.progress}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={goal.progress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(254,243,199,0.2)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(135deg, #10b981, #34d399)',
                                borderRadius: 4
                              }
                            }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                            Deadline: {new Date(goal.deadline).toLocaleDateString('de-DE')}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => updateGoalProgress(goal.id, goal.progress + 10)}
                              sx={{ color: '#ffffff' }}
                            >
                              <TrendingUp size={16} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => completeGoal(goal.id)}
                              sx={{ color: '#10b981' }}
                            >
                              <CheckCircle size={16} />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {/* Tracking Tab */}
        {activeTab === 2 && (
          <motion.div
            
            
            
          >
            <Typography variant="h3" sx={{ 
              color: '#ffffff', 
              textAlign: 'center', 
              fontWeight: 700, 
              mb: 6 
            }}>
              Deine Entwicklung
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{
                  background: 'linear-gradient(135deg, rgba(254,243,199,0.1) 0%, rgba(254,243,199,0.05) 100%)',
                  borderRadius: 4,
                  border: '1px solid rgba(254,243,199,0.2)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{
                      color: '#ffffff',
                      fontWeight: 700,
                      mb: 3
                    }}>
                      Journal Aktivität
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          Aktuelle Serie
                        </Typography>
                        <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>
                          {trackingData.currentStreak} Tage
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          Längste Serie
                        </Typography>
                        <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>
                          {trackingData.longestStreak} Tage
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{
                  background: 'linear-gradient(135deg, rgba(254,243,199,0.1) 0%, rgba(254,243,199,0.05) 100%)',
                  borderRadius: 4,
                  border: '1px solid rgba(254,243,199,0.2)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{
                      color: '#ffffff',
                      fontWeight: 700,
                      mb: 3
                    }}>
                      Ziel-Fortschritt
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          Abgeschlossen
                        </Typography>
                        <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>
                          {trackingData.goalsCompleted}/{trackingData.totalGoals}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          Erfolgsrate
                        </Typography>
                        <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>
                          {Math.round((trackingData.goalsCompleted / trackingData.totalGoals) * 100)}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* Journal Entry Dialog */}
        <Dialog 
          open={showJournalDialog} 
          onClose={() => setShowJournalDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, rgba(254,243,199,0.95) 0%, rgba(254,243,199,0.9) 100%)',
              borderRadius: 4,
              border: '1px solid rgba(254,243,199,0.3)'
            }
          }}
        >
          <DialogTitle sx={{ color: '#1f2937', fontWeight: 700 }}>
            Neuer Journal Eintrag
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Datum"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Deine Gedanken und Erfahrungen"
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Schreibe über deine Human Design Erfahrungen, Erkenntnisse und Gefühle..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setShowJournalDialog(false)}
              sx={{ color: '#64748b' }}
            >
              Abbrechen
            </Button>
            <Button 
              onClick={addJournalEntry}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: '#fff',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  background: 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)'
                }
              }}
            >
              Eintrag speichern
            </Button>
          </DialogActions>
        </Dialog>

        {/* Goal Dialog */}
        <Dialog 
          open={showGoalDialog} 
          onClose={() => setShowGoalDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, rgba(254,243,199,0.95) 0%, rgba(254,243,199,0.9) 100%)',
              borderRadius: 4,
              border: '1px solid rgba(254,243,199,0.3)'
            }
          }}
        >
          <DialogTitle sx={{ color: '#1f2937', fontWeight: 700 }}>
            Neues Ziel
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ziel-Titel"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Beschreibung"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ color: '#1f2937', fontWeight: 600, mb: 1 }}>
                  Kategorie
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {goalCategories.filter(cat => cat.id !== 'alle').map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Chip
                        key={category.id}
                        label={category.name}
                        icon={<IconComponent size={14} />}
                        onClick={() => setNewGoal({...newGoal, category: category.id})}
                        sx={{
                          background: newGoal.category === category.id 
                            ? category.color 
                            : 'rgba(0,0,0,0.1)',
                          color: newGoal.category === category.id 
                            ? '#000' 
                            : '#1f2937',
                          border: `1px solid ${category.color}`,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: category.color,
                            color: '#000'
                          }
                        }}
                      />
                    );
                  })}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setShowGoalDialog(false)}
              sx={{ color: '#64748b' }}
            >
              Abbrechen
            </Button>
            <Button 
              onClick={addGoal}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: '#fff',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  background: 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)'
                }
              }}
            >
              Ziel erstellen
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
    </AccessControl>
  );
}
