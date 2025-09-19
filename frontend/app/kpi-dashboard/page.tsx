"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Container,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  LinearProgress,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageCircle, 
  Heart, 
  Calendar,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Star,
  Zap,
  Shield,
  Globe,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  Moon,
  Sun,
  Brain,
  User,
  MessageSquare,
  Calendar as CalendarIcon,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Floating Stars Animation
const AnimatedStars = () => {
  const stars = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
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

interface KPIData {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalLikes: number;
  communityHealth: number;
  engagementLevel: string;
  trends: Array<{
    metric: string;
    currentValue: number;
    previousValue: number;
    changePercentage: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  health: {
    overallHealth: number;
    engagementLevel: string;
    toxicityLevel: string;
    diversityScore: number;
    inclusivityScore: number;
    supportivenessScore: number;
  };
  topMetrics: {
    mostActiveType: [string, number];
    growthRate: number;
    satisfactionScore: number;
    retentionRate: number;
  };
}

export default function KPIDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    fetchKPIData();
  }, [period]);

  const fetchKPIData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API response
      const mockData: KPIData = {
        totalUsers: 1250,
        activeUsers: 890,
        totalPosts: 3450,
        totalLikes: 45670,
        communityHealth: 82.5,
        engagementLevel: 'high',
        trends: [
          { metric: 'totalUsers', currentValue: 1250, previousValue: 1180, changePercentage: 5.9, trend: 'up' },
          { metric: 'activeUsers', currentValue: 890, previousValue: 820, changePercentage: 8.5, trend: 'up' },
          { metric: 'totalPosts', currentValue: 3450, previousValue: 3200, changePercentage: 7.8, trend: 'up' },
          { metric: 'totalLikes', currentValue: 45670, previousValue: 42000, changePercentage: 8.7, trend: 'up' }
        ],
        health: {
          overallHealth: 82.5,
          engagementLevel: 'high',
          toxicityLevel: 'low',
          diversityScore: 78.2,
          inclusivityScore: 85.0,
          supportivenessScore: 78.5
        },
        topMetrics: {
          mostActiveType: ['Generator', 45],
          growthRate: 12.5,
          satisfactionScore: 82.5,
          retentionRate: 78.5
        }
      };
      
      setKpiData(mockData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching KPI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} color="#10b981" />;
      case 'down': return <TrendingDown size={16} color="#ef4444" />;
      default: return <Minus size={16} color="#6b7280" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#ef4444';
    return '#6b7280';
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'excellent': return '#10b981';
      case 'high': return '#3b82f6';
      case 'medium': return '#f59e0b';
      default: return '#ef4444';
    }
  };

  if (!isClient) return null;

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
      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 800, mb: 1 }}>
                📊 KPI Dashboard
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Community Analytics & Performance Metrics
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: 'white' }}>Zeitraum</InputLabel>
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as any)}
                  sx={{ 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' }
                  }}
                >
                  <MenuItem value="daily">Täglich</MenuItem>
                  <MenuItem value="weekly">Wöchentlich</MenuItem>
                  <MenuItem value="monthly">Monatlich</MenuItem>
                </Select>
              </FormControl>
              
              <IconButton onClick={fetchKPIData} disabled={loading} sx={{ color: '#FFD700' }}>
                <RefreshCw size={20} />
              </IconButton>
              
              <Button
                variant="outlined"
                startIcon={<Download size={20} />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Export
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ color: '#FFD700' }} />
          </Box>
        )}

        {/* KPI Data */}
        {kpiData && !loading && (
          <>
            {/* Overview Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                            {kpiData.totalUsers.toLocaleString()}
                          </Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                            Gesamt Benutzer
                          </Typography>
                        </Box>
                        <Users size={32} color="#3b82f6" />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        {getTrendIcon('up')}
                        <Typography sx={{ color: '#10b981', ml: 1, fontSize: '0.8rem' }}>
                          +5.9% diese Woche
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                            {kpiData.activeUsers.toLocaleString()}
                          </Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                            Aktive Benutzer
                          </Typography>
                        </Box>
                        <Activity size={32} color="#10b981" />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        {getTrendIcon('up')}
                        <Typography sx={{ color: '#10b981', ml: 1, fontSize: '0.8rem' }}>
                          +8.5% diese Woche
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                            {kpiData.totalPosts.toLocaleString()}
                          </Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                            Gesamt Posts
                          </Typography>
                        </Box>
                        <MessageCircle size={32} color="#f59e0b" />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        {getTrendIcon('up')}
                        <Typography sx={{ color: '#10b981', ml: 1, fontSize: '0.8rem' }}>
                          +7.8% diese Woche
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                            {kpiData.totalLikes.toLocaleString()}
                          </Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                            Gesamt Likes
                          </Typography>
                        </Box>
                        <Heart size={32} color="#ef4444" />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        {getTrendIcon('up')}
                        <Typography sx={{ color: '#10b981', ml: 1, fontSize: '0.8rem' }}>
                          +8.7% diese Woche
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>

            {/* Community Health */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                mb: 4
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                    🏥 Community Gesundheit
                  </Typography>
                  
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Gesamt Gesundheit
                          </Typography>
                          <Typography sx={{ color: getHealthColor(kpiData.health.overallHealth), fontWeight: 600 }}>
                            {kpiData.health.overallHealth.toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={kpiData.health.overallHealth}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getHealthColor(kpiData.health.overallHealth),
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Engagement Level
                          </Typography>
                          <Chip
                            label={kpiData.health.engagementLevel}
                            size="small"
                            sx={{
                              backgroundColor: getEngagementColor(kpiData.health.engagementLevel),
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Toxizität Level
                          </Typography>
                          <Chip
                            label={kpiData.health.toxicityLevel}
                            size="small"
                            sx={{
                              backgroundColor: kpiData.health.toxicityLevel === 'low' ? '#10b981' : '#ef4444',
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Paper sx={{
                            background: 'rgba(255,255,255,0.05)',
                            p: 2,
                            textAlign: 'center',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}>
                            <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                              {kpiData.health.diversityScore.toFixed(1)}%
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                              Diversität
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper sx={{
                            background: 'rgba(255,255,255,0.05)',
                            p: 2,
                            textAlign: 'center',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}>
                            <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700 }}>
                              {kpiData.health.inclusivityScore.toFixed(1)}%
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                              Inklusivität
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper sx={{
                            background: 'rgba(255,255,255,0.05)',
                            p: 2,
                            textAlign: 'center',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}>
                            <Typography variant="h6" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                              {kpiData.health.supportivenessScore.toFixed(1)}%
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                              Unterstützung
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper sx={{
                            background: 'rgba(255,255,255,0.05)',
                            p: 2,
                            textAlign: 'center',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}>
                            <Typography variant="h6" sx={{ color: '#8b5cf6', fontWeight: 700 }}>
                              {kpiData.topMetrics.retentionRate.toFixed(1)}%
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                              Retention
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Card sx={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    height: '100%'
                  }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Zap size={48} color="#FFD700" style={{ marginBottom: 16 }} />
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                        Aktivster Typ
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 700, mb: 1 }}>
                        {kpiData.topMetrics.mostActiveType[0]}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {kpiData.topMetrics.mostActiveType[1]}% der Community
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card sx={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    height: '100%'
                  }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <TrendingUp size={48} color="#10b981" style={{ marginBottom: 16 }} />
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                        Wachstumsrate
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700, mb: 1 }}>
                        +{kpiData.topMetrics.growthRate}%
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Monatliches Wachstum
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card sx={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    height: '100%'
                  }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Star size={48} color="#f59e0b" style={{ marginBottom: 16 }} />
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                        Zufriedenheit
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700, mb: 1 }}>
                        {kpiData.topMetrics.satisfactionScore.toFixed(1)}%
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Community Score
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>

            {/* Last Updated */}
            {lastUpdated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                    Letzte Aktualisierung: {lastUpdated.toLocaleString('de-DE')}
                  </Typography>
                </Box>
              </motion.div>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
