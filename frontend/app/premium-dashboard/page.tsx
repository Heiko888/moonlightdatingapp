'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Avatar, 
  Chip, 
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Crown, 
  Users, 
  Sparkles,
  Zap,
  Target,
  Calendar,
  MessageCircle,
  Eye,
  Activity,
  Award,
  Gift,
  BarChart3,
  BookOpen,
  ChartBar,
  Brain,
  Moon
} from 'lucide-react';

export default function PremiumDashboardPage() {
  const router = useRouter();
  const [userStats] = useState({
    chartCalculations: 23,
    profileViews: 156,
    knowledgeEntries: 45,
    communityPosts: 12,
    energyLevel: 85,
    monthlyProgress: 78
  });

  const [hdChart, setHdChart] = useState({
    type: 'Generator',
    profile: '1/3',
    authority: 'Sacral',
    strategy: 'To Respond',
    definition: 'Single Definition'
  });

  // User Subscription Plan für Feature-Freischaltung
  const [userPlan, setUserPlan] = useState('basic');
  const [mounted, setMounted] = useState(false);

  // Hilfsfunktion für Feature-Freischaltung
  const hasAccess = (requiredPlan: string): boolean => {
    if (!mounted) return false; // Verhindert Hydration-Mismatch
    const planHierarchy: Record<string, number> = { 'basic': 1, 'premium': 2, 'vip': 3, 'admin': 4 };
    const userLevel = planHierarchy[userPlan] || 1;
    const requiredLevel = planHierarchy[requiredPlan] || 1;
    return userLevel >= requiredLevel;
  };

  // Lade echte Benutzerdaten aus localStorage
  React.useEffect(() => {
    setMounted(true); // Markiere als gemountet
    
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          console.log('🔍 Premium Dashboard - User-Daten geladen:', user);
          
          // Lade User Plan für Feature-Freischaltung
          const plan = user.subscriptionPlan || 'basic';
          setUserPlan(plan);
          console.log('💎 User Plan erkannt:', plan);
          
          // Lade Human Design Daten aus userData
          if (user.hdType || user.humanDesignType || user.birthDate) {
            setHdChart({
              type: user.hdType || user.humanDesignType || 'Generator',
              profile: user.hdProfile || user.profile || '1/3',
              authority: user.hdAuthority || user.authority || 'Sacral',
              strategy: user.hdStrategy || user.strategy || 'To Respond',
              definition: user.hdDefinition || user.definition || 'Single Definition'
            });
            console.log('✅ HD Chart-Daten aktualisiert:', {
              type: user.hdType || user.humanDesignType,
              profile: user.hdProfile || user.profile,
              authority: user.hdAuthority || user.authority,
              gates: user.hdGates,
              channels: user.hdChannels,
              centers: user.hdCenters
            });
          }
        } catch (error) {
          console.error('❌ Fehler beim Laden der User-Daten:', error);
        }
      }
    }
  }, []);

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'chart',
      message: 'Neue Chart-Berechnung abgeschlossen',
      time: '2 Stunden',
      icon: '🔮'
    },
    {
      id: 2,
      type: 'knowledge',
      message: 'Neuer Knowledge-Eintrag erstellt',
      time: '4 Stunden',
      icon: '📚'
    },
    {
      id: 3,
      type: 'community',
      message: 'Community-Post veröffentlicht',
      time: '6 Stunden',
      icon: '💬'
    },
    {
      id: 4,
      type: 'profile',
      message: 'Profil-Update verfügbar',
      time: '1 Tag',
      icon: '✨'
    }
  ]);

  const [premiumFeatures] = useState([
    {
      id: 1,
      name: 'Erweiterte Chart-Analysen',
      description: 'Detaillierte Human Design Analysen',
      status: 'active',
      icon: <ChartBar size={24} />,
      path: '/bodygraph-advanced',
      color: '#10b981',
      requiredPlan: 'basic'
    },
    {
      id: 2,
      name: 'Persönliche Readings',
      description: '1:1 Human Design Beratungen',
      status: 'active',
      icon: <Sparkles size={24} />,
      path: '/reading',
      color: '#8b5cf6',
      requiredPlan: 'premium'
    },
    {
      id: 3,
      name: 'Premium Knowledge Hub',
      description: 'Exklusive HD-Inhalte und Guides',
      status: 'active',
      icon: <BookOpen size={24} />,
      path: '/knowledge',
      color: '#f59e0b',
      requiredPlan: 'premium'
    },
    {
      id: 4,
      name: 'HD Events & Workshops',
      description: 'Zugang zu Premium-Veranstaltungen',
      status: 'active',
      icon: <Calendar size={24} />,
      path: '/live-events',
      color: '#06b6d4',
      requiredPlan: 'vip'
    },
    {
      id: 5,
      name: 'Chart-Vergleiche',
      description: 'Erweiterte Kompatibilitäts-Analysen',
      status: 'available',
      icon: <Users size={24} />,
      path: '/chart-comparison',
      color: '#ef4444',
      requiredPlan: 'premium'
    },
    {
      id: 6,
      name: 'Planeten-Energien',
      description: 'Alle 64 Gates und 9 Centers erkunden',
      status: 'active',
      icon: <Moon size={24} />,
      path: '/planets',
      color: '#8b5cf6'
    },
    {
      id: 7,
      name: 'Premium Analytics',
      description: 'Detaillierte Einblicke in deine HD-Daten',
      status: 'active',
      icon: <BarChart3 size={24} />,
      path: '/analytics',
      color: '#f59e0b'
    },
    {
      id: 8,
      name: 'Echtzeit-Analyse',
      description: 'Live Chart-Kompatibilitäts-Analyse',
      status: 'active',
      icon: <Activity size={24} />,
      path: '/realtime-analysis',
      color: '#8b5cf6'
    },
    {
      id: 9,
      name: 'KI-Mond-Erkenntnisse',
      description: 'KI-basierte Mond-Insights',
      status: 'active',
      icon: <Moon size={24} />,
      path: '/ai-moon-insights',
      color: '#8b5cf6'
    },
    {
      id: 10,
      name: 'HD Academy',
      description: 'Human Design Lernplattform',
      status: 'active',
      icon: <Brain size={24} />,
      path: '/hd-academy',
      color: '#10b981'
    },
    {
      id: 11,
      name: 'Roadmap',
      description: 'Persönliche Entwicklungs-Roadmap',
      status: 'active',
      icon: <Target size={24} />,
      path: '/roadmap',
      color: '#06b6d4'
    },
    {
      id: 12,
      name: 'Sieben Stufen des Bewusstseins',
      description: 'Strukturierte Übungen für vollständige Bewusstseinsentwicklung',
      status: 'active',
      icon: <Brain size={24} />,
      path: '/consciousness-exercises',
      color: '#8B5CF6'
    },
    {
      id: 13,
      name: 'Inkarnationskreuz',
      description: 'Deine einzigartige Lebensaufgabe und dein höchstes Potenzial',
      status: 'active',
      icon: <Target size={24} />,
      path: '/planets/incarnation-cross',
      color: '#EC4899'
    }
  ]);

  const [energyInsights] = useState([
    { day: 'Mo', energy: 85, insights: 3 },
    { day: 'Di', energy: 92, insights: 5 },
    { day: 'Mi', energy: 78, insights: 2 },
    { day: 'Do', energy: 88, insights: 4 },
    { day: 'Fr', energy: 95, insights: 6 },
    { day: 'Sa', energy: 82, insights: 3 },
    { day: 'So', energy: 90, insights: 4 }
  ]);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Stars Background */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        {[...Array(25)].map((_, i) => (
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

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Crown size={48} color="#f59e0b" />
              <Typography variant="h2" sx={{ ml: 2, fontWeight: 700, background: 'linear-gradient(45deg, #f59e0b, #ffd700)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Premium Dashboard
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
              Willkommen in deinem exklusiven Premium-Bereich
            </Typography>
            {mounted && (
              <Chip 
                label={`${userPlan.toUpperCase()} Member`}
                sx={{ 
                  background: userPlan === 'vip' ? 'linear-gradient(45deg, #FFD700, #FFA500)' : 
                             userPlan === 'premium' ? 'linear-gradient(45deg, #8B5CF6, #A78BFA)' :
                             'linear-gradient(45deg, #10B981, #34D399)',
                  color: '#1a1a2e',
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 2,
                  py: 1
                }} 
              />
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip 
                icon={<Crown size={16} />} 
                label="Premium Mitglied" 
                sx={{ 
                  background: 'linear-gradient(45deg, #f59e0b, #ffd700)',
                  color: 'white',
                  fontWeight: 600,
                  px: 2,
                  py: 1
                }} 
              />
              <Button
                variant="outlined"
                onClick={() => router.push('/dashboard')}
                sx={{
                  color: '#FFD700',
                  borderColor: '#FFD700',
                  '&:hover': {
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
                  }
                }}
              >
                ← Zurück zum Dashboard
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={3}>
              <Paper elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 3,
                textAlign: 'center'
              }}>
                <ChartBar size={32} color="#FFD700" />
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{userStats.chartCalculations}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Chart-Berechnungen</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 3,
                textAlign: 'center'
              }}>
                <Eye size={32} color="#06b6d4" />
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{userStats.profileViews}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Profil-Aufrufe</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 3,
                textAlign: 'center'
              }}>
                <BookOpen size={32} color="#10b981" />
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{userStats.knowledgeEntries}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Knowledge-Einträge</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 3,
                textAlign: 'center'
              }}>
                <MessageCircle size={32} color="#f59e0b" />
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{userStats.communityPosts}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Community-Posts</Typography>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>

        {/* Human Design Chart Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Paper elevation={0} sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            p: 4,
            mb: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Brain size={24} color="#FFD700" />
              <Typography variant="h5" sx={{ ml: 2, fontWeight: 600 }}>Dein Human Design Chart</Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center', p: 3, background: 'rgba(255, 215, 0, 0.1)', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 700, mb: 1 }}>
                    {hdChart.type}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Profil {hdChart.profile}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Authority: {hdChart.authority}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Strategy: {hdChart.strategy}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center' }}>
                  <Button
                    component={Link}
                    href="/human-design-chart"
                    variant="outlined"
                    sx={{
                      borderColor: '#FFD700',
                      color: '#FFD700',
                      '&:hover': {
                        borderColor: '#FFA500',
                        bgcolor: 'rgba(255, 215, 0, 0.1)'
                      }
                    }}
                  >
                    Vollständiges Chart anzeigen
                  </Button>
                  <Button
                    component={Link}
                    href="/grundlagen-hd"
                    variant="outlined"
                    sx={{
                      borderColor: '#06b6d4',
                      color: '#06b6d4',
                      '&:hover': {
                        borderColor: '#0891b2',
                        bgcolor: 'rgba(6, 182, 212, 0.1)'
                      }
                    }}
                  >
                    HD-Grundlagen erkunden
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        <Grid container spacing={4}>
          {/* Premium Features */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Paper elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 3,
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Crown size={24} color="#f59e0b" />
                  <Typography variant="h5" sx={{ ml: 2, fontWeight: 600 }}>Premium Features</Typography>
                </Box>
                <Grid container spacing={2}>
                  {premiumFeatures.map((feature) => {
                    const hasFeatureAccess = mounted ? hasAccess(feature.requiredPlan || 'basic') : false;
                    return (
                      <Grid item xs={12} sm={6} key={feature.id}>
                        <Button
                          component={hasFeatureAccess ? Link : 'div'}
                          href={hasFeatureAccess ? feature.path : undefined}
                          variant="outlined"
                          fullWidth
                          disabled={!hasFeatureAccess}
                          sx={{
                            p: 2,
                            height: 'auto',
                            borderColor: hasFeatureAccess ? feature.color : 'rgba(255,255,255,0.2)',
                            color: hasFeatureAccess ? feature.color : 'rgba(255,255,255,0.4)',
                            borderRadius: 2,
                            textAlign: 'left',
                            justifyContent: 'flex-start',
                            position: 'relative',
                            '&:hover': hasFeatureAccess ? {
                              borderColor: feature.color,
                              backgroundColor: `${feature.color}20`,
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 12px ${feature.color}40`
                            } : {},
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: hasFeatureAccess ? 
                              (feature.status === 'active' ? `linear-gradient(45deg, ${feature.color}, ${feature.color}80)` : 'rgba(107, 114, 128, 0.3)') :
                              'rgba(107, 114, 128, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: hasFeatureAccess ? 'white' : 'rgba(255,255,255,0.4)',
                            mr: 2,
                            flexShrink: 0
                          }}>
                            {feature.icon}
                          </Box>
                          <Box sx={{ flex: 1, textAlign: 'left' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'inherit' }}>
                                {feature.name}
                              </Typography>
                              {!hasFeatureAccess && (
                                <Chip 
                                  label={`${feature.requiredPlan?.toUpperCase()} Required`} 
                                  size="small" 
                                  sx={{ 
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    color: '#ef4444',
                                    fontSize: '10px',
                                    height: 20
                                  }}
                                />
                              )}
                              {hasFeatureAccess && (
                                <Chip 
                                  label={feature.status === 'active' ? 'Aktiv' : 'Verfügbar'} 
                                  size="small" 
                                  sx={{ 
                                    background: feature.status === 'active' ? `${feature.color}20` : 'rgba(107, 114, 128, 0.2)',
                                    color: feature.status === 'active' ? feature.color : '#6b7280',
                                    fontSize: '10px',
                                    height: 20
                                  }} 
                                />
                              )}
                            </Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                              {feature.description}
                            </Typography>
                          </Box>
                        </Box>
                        {!hasFeatureAccess && (
                          <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2
                          }}>
                            <Chip 
                              label="Upgrade Required" 
                              sx={{ 
                                background: 'rgba(239, 68, 68, 0.9)',
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </Box>
                        )}
                      </Button>
                    </Grid>
                  );
                  })}
                </Grid>
              </Paper>
            </motion.div>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Paper elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 3,
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Activity size={24} color="#06b6d4" />
                  <Typography variant="h5" sx={{ ml: 2, fontWeight: 600 }}>Letzte Aktivitäten</Typography>
                </Box>
                <List>
                  {recentActivity.map((activity) => (
                    <ListItem key={activity.id} sx={{ px: 0, py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          width: 40,
                          height: 40,
                          fontSize: '16px',
                          background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)'
                        }}>
                          {activity.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {activity.message}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            {activity.time}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Energy Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Paper elevation={0} sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            p: 4,
            mt: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Zap size={24} color="#f59e0b" />
              <Typography variant="h5" sx={{ ml: 2, fontWeight: 600 }}>HD-Energie-Insights</Typography>
            </Box>
            <Grid container spacing={3}>
              {energyInsights.map((day, index) => (
                <Grid item xs={12} sm={6} md={1.7} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      {day.day}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={day.energy}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#f59e0b'
                          }
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                        {day.energy}%
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {day.insights} Insights
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>

        {/* Premium Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <Paper elevation={0} sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            p: 4,
            mt: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Gift size={24} color="#10b981" />
              <Typography variant="h5" sx={{ ml: 2, fontWeight: 600 }}>Premium HD-Vorteile</Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Award size={32} color="#f59e0b" />
                  <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>Persönliche HD-Beratung</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    1:1 Human Design Readings mit zertifizierten Beratern
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Target size={32} color="#8b5cf6" />
                  <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>Erweiterte Chart-Analysen</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Detaillierte Einblicke in deine Human Design Daten
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Calendar size={32} color="#06b6d4" />
                  <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>HD Events & Workshops</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Exklusive Human Design Veranstaltungen und Kurse
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
