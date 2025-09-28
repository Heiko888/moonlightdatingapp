"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Container,
  Grid,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import { 
  Settings, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Edit,
  Delete,
  Plus,
  Download,
  RotateCcw,
  Eye,
  Filter,
  Calendar,
  Clock,
  Award,
  Activity,
  MessageCircle,
  Heart,
  Star,
  Zap,
  Shield,
  Globe,
  Brain,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Floating Stars Animation
const AnimatedStars = () => {
  const stars = Array.from({ length: 12 }, (_, i) => ({
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

interface KPIGoal {
  id: string;
  name: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  category: 'engagement' | 'growth' | 'quality' | 'revenue';
  isActive: boolean;
}

interface KPISetting {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  category: string;
  isEnabled: boolean;
  lastModified: Date;
}

export default function AdminKPIPanel() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [goals, setGoals] = useState<KPIGoal[]>([]);
  const [settings, setSettings] = useState<KPISetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [settingDialogOpen, setSettingDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<KPIGoal | null>(null);
  const [editingSetting, setEditingSetting] = useState<KPISetting | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockGoals: KPIGoal[] = [
        {
          id: '1',
          name: 'Aktive Benutzer steigern',
          description: 'Ziel: 1000 aktive Benutzer pro Woche',
          targetValue: 1000,
          currentValue: 890,
          unit: 'Benutzer',
          deadline: new Date('2024-02-01'),
          status: 'on-track',
          category: 'engagement',
          isActive: true
        },
        {
          id: '2',
          name: 'Community Posts erhöhen',
          description: 'Ziel: 500 Posts pro Woche',
          targetValue: 500,
          currentValue: 234,
          unit: 'Posts',
          deadline: new Date('2024-01-15'),
          status: 'at-risk',
          category: 'engagement',
          isActive: true
        },
        {
          id: '3',
          name: 'Zufriedenheits-Score',
          description: 'Ziel: 90% Community-Zufriedenheit',
          targetValue: 90,
          currentValue: 82.5,
          unit: '%',
          deadline: new Date('2024-03-01'),
          status: 'on-track',
          category: 'quality',
          isActive: true
        }
      ];

      const mockSettings: KPISetting[] = [
        {
          id: '1',
          name: 'Cache-Dauer',
          description: 'Wie lange KPI-Daten gecacht werden',
          value: 5,
          unit: 'Minuten',
          category: 'Performance',
          isEnabled: true,
          lastModified: new Date()
        },
        {
          id: '2',
          name: 'Auto-Refresh Intervall',
          description: 'Automatische Aktualisierung der KPIs',
          value: 10,
          unit: 'Minuten',
          category: 'Performance',
          isEnabled: true,
          lastModified: new Date()
        },
        {
          id: '3',
          name: 'Engagement-Schwellenwert',
          description: 'Mindest-Engagement für aktive Benutzer',
          value: 3,
          unit: 'Aktionen',
          category: 'Engagement',
          isEnabled: true,
          lastModified: new Date()
        }
      ];

      setGoals(mockGoals);
      setSettings(mockSettings);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Fehler beim Laden der Daten', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'on-track': return '#3b82f6';
      case 'at-risk': return '#f59e0b';
      case 'behind': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'on-track': return <TrendingUp size={16} />;
      case 'at-risk': return <AlertTriangle size={16} />;
      case 'behind': return <AlertTriangle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'engagement': return <Users size={20} />;
      case 'growth': return <TrendingUp size={20} />;
      case 'quality': return <Star size={20} />;
      case 'revenue': return <Award size={20} />;
      default: return <Target size={20} />;
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
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
                ⚙️ Admin KPI Panel
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                KPI-Verwaltung, Ziele und Einstellungen
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RotateCcw size={20} />}
                onClick={fetchData}
                disabled={loading}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Aktualisieren
              </Button>
              
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

        {/* Content */}
        {!loading && (
          <>
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                mb: 4
              }}>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{
                    '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .Mui-selected': { color: '#FFD700' },
                    '& .MuiTabs-indicator': { backgroundColor: '#FFD700' }
                  }}
                >
                  <Tab label="KPI Ziele" icon={<Target size={20} />} />
                  <Tab label="Einstellungen" icon={<Settings size={20} />} />
                  <Tab label="Analytics" icon={<BarChart3 size={20} />} />
                </Tabs>
              </Card>
            </motion.div>

            {/* KPI Goals Tab */}
            {activeTab === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card sx={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 3
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                        🎯 KPI Ziele
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        onClick={() => setGoalDialogOpen(true)}
                        sx={{
                          background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
                          color: '#23233a',
                          fontWeight: 600
                        }}
                      >
                        Neues Ziel
                      </Button>
                    </Box>

                    <Grid container spacing={3}>
                      {goals.map((goal) => (
                        <Grid item xs={12} md={6} lg={4} key={goal.id}>
                          <Card sx={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 2,
                            height: '100%'
                          }}>
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {getCategoryIcon(goal.category)}
                                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, ml: 1 }}>
                                    {goal.name}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={goal.status}
                                  size="small"
                                  sx={{
                                    backgroundColor: getStatusColor(goal.status),
                                    color: 'white',
                                    fontWeight: 600
                                  }}
                                />
                              </Box>

                              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, fontSize: '0.9rem' }}>
                                {goal.description}
                              </Typography>

                              <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                                    Fortschritt
                                  </Typography>
                                  <Typography sx={{ color: 'white', fontWeight: 600 }}>
                                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={calculateProgress(goal.currentValue, goal.targetValue)}
                                  sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: getStatusColor(goal.status),
                                      borderRadius: 3
                                    }
                                  }}
                                />
                              </Box>

                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                                  Deadline: {goal.deadline.toLocaleDateString('de-DE')}
                                </Typography>
                                <Box>
                                  <IconButton size="small" sx={{ color: '#FFD700' }}>
                                    <Edit size={16} />
                                  </IconButton>
                                  <IconButton size="small" sx={{ color: '#ef4444' }}>
                                    <Delete size={16} />
                                  </IconButton>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card sx={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 3
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                        ⚙️ KPI Einstellungen
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        onClick={() => setSettingDialogOpen(true)}
                        sx={{
                          background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
                          color: '#23233a',
                          fontWeight: 600
                        }}
                      >
                        Neue Einstellung
                      </Button>
                    </Box>

                    <TableContainer component={Paper} sx={{
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Beschreibung</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Wert</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Kategorie</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Aktionen</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {settings.map((setting) => (
                            <TableRow key={setting.id}>
                              <TableCell sx={{ color: 'white' }}>{setting.name}</TableCell>
                              <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{setting.description}</TableCell>
                              <TableCell sx={{ color: 'white' }}>
                                {setting.value} {setting.unit}
                              </TableCell>
                              <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{setting.category}</TableCell>
                              <TableCell>
                                <Switch
                                  checked={setting.isEnabled}
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#FFD700' },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FFD700' }
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton size="small" sx={{ color: '#FFD700' }}>
                                  <Edit size={16} />
                                </IconButton>
                                <IconButton size="small" sx={{ color: '#ef4444' }}>
                                  <Delete size={16} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card sx={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 3
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                      📊 Erweiterte Analytics
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 2,
                          p: 3
                        }}>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                            Performance Metriken
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Cache Hit Rate</Typography>
                            <Typography sx={{ color: 'white' }}>94.2%</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>API Response Time</Typography>
                            <Typography sx={{ color: 'white' }}>245ms</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Data Freshness</Typography>
                            <Typography sx={{ color: 'white' }}>2.3 min</Typography>
                          </Box>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Card sx={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 2,
                          p: 3
                        }}>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                            System Status
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Uptime</Typography>
                            <Typography sx={{ color: '#10b981' }}>99.8%</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Error Rate</Typography>
                            <Typography sx={{ color: '#10b981' }}>0.2%</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Active Connections</Typography>
                            <Typography sx={{ color: 'white' }}>1,247</Typography>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
