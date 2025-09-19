'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Chip, 
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Badge,
  LinearProgress,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Star, 
  Heart,
  Sparkles,
  Crown,
  Zap,
  Target,
  Calendar,
  MessageCircle,
  Eye,
  Activity,
  Award,
  Gift,
  Clock,
  PieChart,
  LineChart,
  Download,
  Filter
} from 'lucide-react';

export default function AdvancedAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({
    totalMatches: 47,
    totalSwipes: 1247,
    matchRate: 3.8,
    profileViews: 234,
    messagesSent: 89,
    responseRate: 78.5,
    averageResponseTime: '2.3h',
    compatibilityScore: 89,
    energyLevel: 85,
    monthlyProgress: 78
  });

  const [swipeAnalytics, setSwipeAnalytics] = useState([
    { day: 'Mo', swipes: 45, matches: 2, rate: 4.4 },
    { day: 'Di', swipes: 52, matches: 3, rate: 5.8 },
    { day: 'Mi', swipes: 38, matches: 1, rate: 2.6 },
    { day: 'Do', swipes: 61, matches: 4, rate: 6.6 },
    { day: 'Fr', swipes: 48, matches: 2, rate: 4.2 },
    { day: 'Sa', swipes: 67, matches: 5, rate: 7.5 },
    { day: 'So', swipes: 43, matches: 2, rate: 4.7 }
  ]);

  const [compatibilityInsights, setCompatibilityInsights] = useState([
    {
      type: 'Generator',
      count: 23,
      percentage: 48.9,
      avgCompatibility: 87,
      color: '#10b981'
    },
    {
      type: 'Projector',
      count: 12,
      percentage: 25.5,
      avgCompatibility: 92,
      color: '#8b5cf6'
    },
    {
      type: 'Manifestor',
      count: 8,
      percentage: 17.0,
      avgCompatibility: 78,
      color: '#ef4444'
    },
    {
      type: 'Reflector',
      count: 4,
      percentage: 8.5,
      avgCompatibility: 85,
      color: '#f59e0b'
    }
  ]);

  const [energyPatterns, setEnergyPatterns] = useState([
    { hour: '6:00', energy: 45, matches: 1 },
    { hour: '9:00', energy: 78, matches: 3 },
    { hour: '12:00', energy: 85, matches: 5 },
    { hour: '15:00', energy: 82, matches: 4 },
    { hour: '18:00', energy: 92, matches: 7 },
    { hour: '21:00', energy: 88, matches: 6 },
    { hour: '24:00', energy: 65, matches: 2 }
  ]);

  const [profileInsights, setProfileInsights] = useState([
    {
      metric: 'Profil-Vollständigkeit',
      value: 95,
      target: 100,
      color: '#10b981'
    },
    {
      metric: 'Foto-Qualität',
      value: 88,
      target: 100,
      color: '#06b6d4'
    },
    {
      metric: 'Bio-Attraktivität',
      value: 92,
      target: 100,
      color: '#8b5cf6'
    },
    {
      metric: 'Interessen-Vielfalt',
      value: 85,
      target: 100,
      color: '#f59e0b'
    }
  ]);

  const [topPerformingFeatures, setTopPerformingFeatures] = useState([
    {
      feature: 'Energetische Kompatibilität',
      impact: 95,
      description: 'Höchste Match-Rate bei energetisch kompatiblen Profilen',
      icon: '⚡'
    },
    {
      feature: 'Gemeinsame Interessen',
      impact: 87,
      description: 'Starke Korrelation zwischen Interessen und Matches',
      icon: '🎯'
    },
    {
      feature: 'Profil-Vollständigkeit',
      impact: 82,
      description: 'Vollständige Profile erhalten mehr Aufmerksamkeit',
      icon: '📋'
    },
    {
      feature: 'Aktive Kommunikation',
      impact: 78,
      description: 'Regelmäßige Nachrichten erhöhen die Match-Qualität',
      icon: '💬'
    }
  ]);

  const [recommendations, setRecommendations] = useState([
    {
      type: 'Optimierung',
      title: 'Profil-Fotos aktualisieren',
      description: 'Deine aktuellen Fotos sind 3 Monate alt. Neue Fotos könnten deine Match-Rate um 15% steigern.',
      priority: 'Hoch',
      impact: '+15% Matches'
    },
    {
      type: 'Timing',
      title: 'Optimale Swipe-Zeiten',
      description: 'Du hast die beste Match-Rate zwischen 18:00-21:00 Uhr. Nutze diese Zeit für aktives Swipen.',
      priority: 'Mittel',
      impact: '+8% Matches'
    },
    {
      type: 'Inhalt',
      title: 'Bio erweitern',
      description: 'Füge mehr Details über deine Hobbys und Interessen hinzu, um die Kompatibilität zu verbessern.',
      priority: 'Mittel',
      impact: '+12% Kompatibilität'
    },
    {
      type: 'Verhalten',
      title: 'Nachrichten schneller beantworten',
      description: 'Deine durchschnittliche Antwortzeit ist 2.3h. Schnellere Antworten könnten die Gesprächsqualität verbessern.',
      priority: 'Niedrig',
      impact: '+5% Response Rate'
    }
  ]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Hoch': return '#ef4444';
      case 'Mittel': return '#f59e0b';
      case 'Niedrig': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getRecommendationTypeColor = (type) => {
    switch (type) {
      case 'Optimierung': return '#8b5cf6';
      case 'Timing': return '#06b6d4';
      case 'Inhalt': return '#10b981';
      case 'Verhalten': return '#f59e0b';
      default: return '#6b7280';
    }
  };

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
              <BarChart3 size={48} color="#8b5cf6" />
              <Typography variant="h2" sx={{ ml: 2, fontWeight: 700, background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Erweiterte Analytics
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
              Detaillierte Einblicke in deine Dating-Performance
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Chip 
                icon={<Crown size={16} />} 
                label="Premium Analytics" 
                sx={{ 
                  background: 'linear-gradient(45deg, #f59e0b, #ffd700)',
                  color: 'white',
                  fontWeight: 600,
                  px: 2,
                  py: 1
                }} 
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  sx={{ 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                  }}
                >
                  <MenuItem value="7d" sx={{ color: 'white' }}>7 Tage</MenuItem>
                  <MenuItem value="30d" sx={{ color: 'white' }}>30 Tage</MenuItem>
                  <MenuItem value="90d" sx={{ color: 'white' }}>90 Tage</MenuItem>
                  <MenuItem value="1y" sx={{ color: 'white' }}>1 Jahr</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </motion.div>

        {/* Key Metrics */}
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
                <Heart size={32} color="#ef4444" />
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{analyticsData.totalMatches}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Matches</Typography>
                <Typography variant="caption" sx={{ color: '#10b981' }}>+12% vs. Vormonat</Typography>
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
                <Target size={32} color="#06b6d4" />
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{analyticsData.matchRate}%</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Match-Rate</Typography>
                <Typography variant="caption" sx={{ color: '#10b981' }}>+0.8% vs. Vormonat</Typography>
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
                <MessageCircle size={32} color="#10b981" />
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{analyticsData.responseRate}%</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Response Rate</Typography>
                <Typography variant="caption" sx={{ color: '#10b981' }}>+5% vs. Vormonat</Typography>
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
                <Star size={32} color="#f59e0b" />
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{analyticsData.compatibilityScore}%</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Kompatibilität</Typography>
                <Typography variant="caption" sx={{ color: '#10b981' }}>+3% vs. Vormonat</Typography>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>

        <Grid container spacing={4}>
          {/* Swipe Analytics */}
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
                  <TrendingUp size={24} color="#8b5cf6" />
                  <Typography variant="h5" sx={{ ml: 2, fontWeight: 600 }}>Swipe-Performance</Typography>
                </Box>
                <Grid container spacing={2}>
                  {swipeAnalytics.map((day, index) => (
                    <Grid item xs={12} key={index}>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {day.day}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#8b5cf6', fontWeight: 600 }}>
                            {day.rate}% Match-Rate
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Box sx={{ flex: 1, textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              {day.swipes} Swipes
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1, textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              {day.matches} Matches
                            </Typography>
                          </Box>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={day.rate * 10}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#8b5cf6'
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>
          </Grid>

          {/* Compatibility Insights */}
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
                  <Sparkles size={24} color="#10b981" />
                  <Typography variant="h5" sx={{ ml: 2, fontWeight: 600 }}>Kompatibilitäts-Insights</Typography>
                </Box>
                <List>
                  {compatibilityInsights.map((insight, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 2 }}>
                      <ListItemIcon>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: `linear-gradient(45deg, ${insight.color}, ${insight.color}80)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 600
                        }}>
                          {insight.percentage}%
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {insight.type}
                            </Typography>
                            <Chip 
                              label={`${insight.count} Matches`} 
                              size="small" 
                              sx={{ 
                                background: 'rgba(139, 92, 246, 0.2)',
                                color: '#8b5cf6',
                                fontSize: '10px'
                              }} 
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Durchschnittliche Kompatibilität: {insight.avgCompatibility}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={insight.avgCompatibility}
                              sx={{
                                height: 4,
                                borderRadius: 2,
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                mt: 1,
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: insight.color
                                }
                              }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Profile Insights */}
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
              <Target size={24} color="#06b6d4" />
              <Typography variant="h5" sx={{ ml: 2, fontWeight: 600 }}>Profil-Insights</Typography>
            </Box>
            <Grid container spacing={3}>
              {profileInsights.map((insight, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ color: insight.color, fontWeight: 700, mb: 1 }}>
                      {insight.value}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                      {insight.metric}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={insight.value}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: insight.color
                        }
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>

        {/* Recommendations */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Award size={24} color="#f59e0b" />
                <Typography variant="h5" sx={{ ml: 2, fontWeight: 600 }}>KI-Empfehlungen</Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<Download size={16} />}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                Report herunterladen
              </Button>
            </Box>
            <Grid container spacing={3}>
              {recommendations.map((rec, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Chip 
                        label={rec.type} 
                        size="small" 
                        sx={{ 
                          background: getRecommendationTypeColor(rec.type) + '20',
                          color: getRecommendationTypeColor(rec.type),
                          fontSize: '10px'
                        }} 
                      />
                      <Chip 
                        label={rec.priority} 
                        size="small" 
                        sx={{ 
                          background: getPriorityColor(rec.priority) + '20',
                          color: getPriorityColor(rec.priority),
                          fontSize: '10px'
                        }} 
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {rec.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                      {rec.description}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                      {rec.impact}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
