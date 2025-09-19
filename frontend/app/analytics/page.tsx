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
  StepContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  MessageCircle,
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
  Settings,
  PieChart,
  LineChart,
  Activity,
  Eye,
  ThumbsUp,
  Comment,
  Share,
  Bookmark,
  UserPlus,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import AccessControl from '@/components/AccessControl';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  totalRevenue: number;
  conversionRate: number;
  userGrowth: number;
  sessionGrowth: number;
  revenueGrowth: number;
}

interface ChartData {
  id: string;
  name: string;
  type: 'line' | 'bar' | 'pie';
  data: any[];
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastUpdated: string;
}

interface UserActivity {
  id: string;
  name: string;
  email: string;
  lastActive: string;
  sessions: number;
  totalTime: number;
  rating: number;
  status: 'active' | 'inactive' | 'premium';
  avatar: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  users: number;
  sessions: number;
  growth: number;
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    totalRevenue: 0,
    conversionRate: 0,
    userGrowth: 0,
    sessionGrowth: 0,
    revenueGrowth: 0
  });
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [showCreateChart, setShowCreateChart] = useState(false);
  const [newChart, setNewChart] = useState({
    name: '',
    type: 'line',
    period: 'monthly'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      // Simuliere Analytics-Daten
      setAnalyticsData({
        totalUsers: 1247,
        activeUsers: 892,
        totalSessions: 3456,
        totalRevenue: 45678,
        conversionRate: 23.5,
        userGrowth: 12.3,
        sessionGrowth: 18.7,
        revenueGrowth: 25.4
      });

      setCharts([
        {
          id: '1',
          name: 'User Growth',
          type: 'line',
          data: [
            { month: 'Jan', users: 1000 },
            { month: 'Feb', users: 1100 },
            { month: 'Mar', users: 1200 },
            { month: 'Apr', users: 1247 }
          ],
          period: 'monthly',
          lastUpdated: '2024-01-15'
        },
        {
          id: '2',
          name: 'Session Distribution',
          type: 'pie',
          data: [
            { name: 'Video', value: 45 },
            { name: 'Phone', value: 30 },
            { name: 'In-Person', value: 25 }
          ],
          period: 'monthly',
          lastUpdated: '2024-01-15'
        },
        {
          id: '3',
          name: 'Revenue Trend',
          type: 'bar',
          data: [
            { month: 'Jan', revenue: 35000 },
            { month: 'Feb', revenue: 40000 },
            { month: 'Mar', revenue: 42000 },
            { month: 'Apr', revenue: 45678 }
          ],
          period: 'monthly',
          lastUpdated: '2024-01-15'
        }
      ]);

      setUserActivities([
        {
          id: '1',
          name: 'Dr. Sarah Chen',
          email: 'sarah@example.com',
          lastActive: '2024-01-15',
          sessions: 47,
          totalTime: 2820,
          rating: 4.9,
          status: 'premium',
          avatar: '/avatars/coach1.jpg'
        },
        {
          id: '2',
          name: 'Marcus Weber',
          email: 'marcus@example.com',
          lastActive: '2024-01-14',
          sessions: 32,
          totalTime: 1920,
          rating: 4.8,
          status: 'premium',
          avatar: '/avatars/coach2.jpg'
        },
        {
          id: '3',
          name: 'Elena Rodriguez',
          email: 'elena@example.com',
          lastActive: '2024-01-13',
          sessions: 28,
          totalTime: 1680,
          rating: 4.9,
          status: 'premium',
          avatar: '/avatars/coach3.jpg'
        }
      ]);

      setRevenueData([
        { month: 'Jan 2024', revenue: 35000, users: 1000, sessions: 2800, growth: 15.2 },
        { month: 'Feb 2024', revenue: 40000, users: 1100, sessions: 3100, growth: 14.3 },
        { month: 'Mar 2024', revenue: 42000, users: 1200, sessions: 3300, growth: 5.0 },
        { month: 'Apr 2024', revenue: 45678, users: 1247, sessions: 3456, growth: 8.7 }
      ]);
    } catch (error) {
      console.error('Fehler beim Laden der Analytics-Daten:', error);
    }
  };

  const handleCreateChart = () => {
    const chart: ChartData = {
      id: Date.now().toString(),
      name: newChart.name,
      type: newChart.type as any,
      data: [],
      period: newChart.period as any,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setCharts([...charts, chart]);
    setNewChart({ name: '', type: 'line', period: 'monthly' });
    setShowCreateChart(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUp size={16} color="#10b981" />;
    if (growth < 0) return <ArrowDown size={16} color="#ef4444" />;
    return <Minus size={16} color="#6b7280" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return '#10b981';
    if (growth < 0) return '#ef4444';
    return '#6b7280';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'premium': return '#FFD700';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'inactive': return <AlertCircle size={16} />;
      case 'premium': return <Crown size={16} />;
      default: return <Info size={16} />;
    }
  };

  return (
    <AccessControl path="/analytics">
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
              <BarChart3 size={48} color="#FFD700" style={{ marginRight: 16 }} />
              <Box>
                <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 700, mb: 1 }}>
                  📊 Premium Analytics
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Detaillierte Insights und Trend-Analysen
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <Chip 
                  label="VIP Analytics" 
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

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Users size={32} color="#3b82f6" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                      {analyticsData.totalUsers.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Gesamt Benutzer
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                      {getGrowthIcon(analyticsData.userGrowth)}
                      <Typography variant="body2" sx={{ color: getGrowthColor(analyticsData.userGrowth), ml: 0.5 }}>
                        +{analyticsData.userGrowth}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Activity size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                      {analyticsData.activeUsers.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Aktive Benutzer
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                      <Typography variant="body2" sx={{ color: '#10b981' }}>
                        {((analyticsData.activeUsers / analyticsData.totalUsers) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Calendar size={32} color="#f59e0b" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                      {analyticsData.totalSessions.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Gesamt Sessions
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                      {getGrowthIcon(analyticsData.sessionGrowth)}
                      <Typography variant="body2" sx={{ color: getGrowthColor(analyticsData.sessionGrowth), ml: 0.5 }}>
                        +{analyticsData.sessionGrowth}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <DollarSign size={32} color="#22c55e" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#22c55e', fontWeight: 700 }}>
                      €{analyticsData.totalRevenue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Gesamt Umsatz
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                      {getGrowthIcon(analyticsData.revenueGrowth)}
                      <Typography variant="body2" sx={{ color: getGrowthColor(analyticsData.revenueGrowth), ml: 0.5 }}>
                        +{analyticsData.revenueGrowth}%
                      </Typography>
                    </Box>
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
                <Tab label="Charts" icon={<BarChart3 size={20} />} />
                <Tab label="User Activity" icon={<Users size={20} />} />
                <Tab label="Revenue" icon={<DollarSign size={20} />} />
              </Tabs>

              {/* Charts Tab */}
              {activeTab === 0 && (
                <Box sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                      📈 Analytics Charts
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Plus size={20} />}
                      onClick={() => setShowCreateChart(true)}
                      sx={{
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        color: '#1a1a2e',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #FFA500, #FF8C00)'
                        }
                      }}
                    >
                      Chart erstellen
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    {charts.map((chart) => (
                      <Grid item xs={12} md={6} key={chart.id}>
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="h6" sx={{ color: '#fff' }}>
                                {chart.name}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  <Edit size={16} />
                                </IconButton>
                                <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  <Download size={16} />
                                </IconButton>
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              {chart.type === 'line' && <LineChart size={20} color="#3b82f6" style={{ marginRight: 8 }} />}
                              {chart.type === 'bar' && <BarChart3 size={20} color="#10b981" style={{ marginRight: 8 }} />}
                              {chart.type === 'pie' && <PieChart size={20} color="#f59e0b" style={{ marginRight: 8 }} />}
                              <Chip 
                                label={chart.type.toUpperCase()} 
                                size="small" 
                                sx={{ 
                                  background: 'rgba(139, 92, 246, 0.2)',
                                  color: '#8B5CF6',
                                  fontSize: '0.7rem'
                                }} 
                              />
                              <Chip 
                                label={chart.period.toUpperCase()} 
                                size="small" 
                                sx={{ 
                                  background: 'rgba(59, 130, 246, 0.2)',
                                  color: '#3b82f6',
                                  fontSize: '0.7rem',
                                  ml: 1
                                }} 
                              />
                            </Box>
                            
                            <Box sx={{ 
                              background: 'rgba(0,0,0,0.3)', 
                              borderRadius: 2, 
                              p: 2, 
                              mb: 2,
                              minHeight: '200px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {chart.type === 'line' && 'Line Chart würde hier angezeigt werden'}
                                {chart.type === 'bar' && 'Bar Chart würde hier angezeigt werden'}
                                {chart.type === 'pie' && 'Pie Chart würde hier angezeigt werden'}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              Letzte Aktualisierung: {chart.lastUpdated}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* User Activity Tab */}
              {activeTab === 1 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    👥 User Activity
                  </Typography>
                  
                  <TableContainer component={Paper} sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: '#FFD700', fontWeight: 600 }}>Benutzer</TableCell>
                          <TableCell sx={{ color: '#FFD700', fontWeight: 600 }}>Status</TableCell>
                          <TableCell sx={{ color: '#FFD700', fontWeight: 600 }}>Sessions</TableCell>
                          <TableCell sx={{ color: '#FFD700', fontWeight: 600 }}>Gesamtzeit</TableCell>
                          <TableCell sx={{ color: '#FFD700', fontWeight: 600 }}>Bewertung</TableCell>
                          <TableCell sx={{ color: '#FFD700', fontWeight: 600 }}>Letzte Aktivität</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userActivities
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar src={user.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
                                <Box>
                                  <Typography variant="body2" sx={{ color: '#fff' }}>
                                    {user.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                    {user.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={user.status === 'active' ? 'Aktiv' : 
                                      user.status === 'inactive' ? 'Inaktiv' : 'Premium'}
                                size="small"
                                sx={{
                                  background: getStatusColor(user.status),
                                  color: '#fff',
                                  fontSize: '0.7rem'
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {user.sessions}
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {Math.floor(user.totalTime / 60)}h {user.totalTime % 60}m
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Rating value={user.rating} readOnly size="small" />
                                <Typography variant="body2" sx={{ color: '#FFD700', ml: 1 }}>
                                  {user.rating}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {user.lastActive}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={userActivities.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                          color: 'rgba(255,255,255,0.8)'
                        }
                      }}
                    />
                  </TableContainer>
                </Box>
              )}

              {/* Revenue Tab */}
              {activeTab === 2 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    💰 Revenue Analytics
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Card sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 2
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                            Revenue Trend
                          </Typography>
                          <Box sx={{ 
                            background: 'rgba(0,0,0,0.3)', 
                            borderRadius: 2, 
                            p: 2, 
                            minHeight: '300px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Revenue Chart würde hier angezeigt werden
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Card sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 2
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                            Monatliche Übersicht
                          </Typography>
                          <List>
                            {revenueData.map((data, index) => (
                              <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemText
                                  primary={data.month}
                                  secondary={
                                    <Box>
                                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                        €{data.revenue.toLocaleString()}
                                      </Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                        {getGrowthIcon(data.growth)}
                                        <Typography variant="caption" sx={{ color: getGrowthColor(data.growth), ml: 0.5 }}>
                                          +{data.growth}%
                                        </Typography>
                                      </Box>
                                    </Box>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </motion.div>

          {/* Create Chart Dialog */}
          <Dialog
            open={showCreateChart}
            onClose={() => setShowCreateChart(false)}
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
              Neuen Chart erstellen
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <TextField
                fullWidth
                label="Chart Name"
                value={newChart.name}
                onChange={(e) => setNewChart({...newChart, name: e.target.value})}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Chart Typ</InputLabel>
                <Select
                  value={newChart.type}
                  onChange={(e) => setNewChart({...newChart, type: e.target.value})}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' }
                  }}
                >
                  <MenuItem value="line">Line Chart</MenuItem>
                  <MenuItem value="bar">Bar Chart</MenuItem>
                  <MenuItem value="pie">Pie Chart</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Zeitraum</InputLabel>
                <Select
                  value={newChart.period}
                  onChange={(e) => setNewChart({...newChart, period: e.target.value})}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' }
                  }}
                >
                  <MenuItem value="daily">Täglich</MenuItem>
                  <MenuItem value="weekly">Wöchentlich</MenuItem>
                  <MenuItem value="monthly">Monatlich</MenuItem>
                  <MenuItem value="yearly">Jährlich</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Button
                onClick={() => setShowCreateChart(false)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleCreateChart}
                variant="contained"
                disabled={!newChart.name.trim()}
                sx={{
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  color: '#1a1a2e',
                  fontWeight: 600
                }}
              >
                Chart erstellen
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </AccessControl>
  );
}