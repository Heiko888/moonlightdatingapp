'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Chip,
  Paper,
  Tabs,
  Tab,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  Database, 
  Server, 
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  LogIn,
  Eye,
  TrendingUp,
  Globe,
  Lock,
  Unlock
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SSRSafeStars from '@/components/SSRSafeStars';

interface SystemStatus {
  backend: 'online' | 'offline' | 'error';
  database: 'connected' | 'disconnected' | 'error';
  openai: 'active' | 'fallback' | 'error';
  lastUpdate: string;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalReadings: number;
  systemUptime: string;
  apiCalls: number;
}

export default function AdminPublicPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    backend: 'offline',
    database: 'disconnected',
    openai: 'error',
    lastUpdate: new Date().toLocaleString()
  });
  
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalReadings: 0,
    systemUptime: '0h 0m',
    apiCalls: 0
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSystemStatus();
    loadAdminStats();
    
    // Status alle 30 Sekunden aktualisieren
    const interval = setInterval(() => {
      checkSystemStatus();
      loadAdminStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const checkSystemStatus = async () => {
    try {
      // Backend Health Check
      const backendResponse = await fetch('http://localhost:4001/health', {
        method: 'GET',
        timeout: 5000
      } as any);
      
      const backendStatus = backendResponse.ok ? 'online' : 'error';
      
      // Database Status (vereinfacht)
      const databaseStatus = backendResponse.ok ? 'connected' : 'disconnected';
      
      // OpenAI Status (vereinfacht)
      const openaiStatus = backendResponse.ok ? 'active' : 'fallback';
      
      setSystemStatus({
        backend: backendStatus,
        database: databaseStatus,
        openai: openaiStatus,
        lastUpdate: new Date().toLocaleString()
      });
      
    } catch (error) {
      setSystemStatus({
        backend: 'offline',
        database: 'disconnected',
        openai: 'error',
        lastUpdate: new Date().toLocaleString()
      });
    }
  };

  const loadAdminStats = async () => {
    try {
      // Mock-Daten für Demo
      setAdminStats({
        totalUsers: 1247,
        activeUsers: 89,
        totalReadings: 3456,
        systemUptime: '2d 14h 32m',
        apiCalls: 12543
      });
    } catch (error) {
      console.error('Fehler beim Laden der Admin-Statistiken:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'active':
        return 'success';
      case 'offline':
      case 'disconnected':
      case 'error':
        return 'error';
      case 'fallback':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'active':
        return <CheckCircle size={16} />;
      case 'offline':
      case 'disconnected':
      case 'error':
        return <AlertCircle size={16} />;
      case 'fallback':
        return <Info size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const adminFeatures = [
    {
      title: 'Benutzerverwaltung',
      description: 'Verwalte Benutzer, Rollen und Berechtigungen',
      icon: <Users size={24} />,
      path: '/admin/users',
      color: '#3b82f6'
    },
    {
      title: 'System-Monitoring',
      description: 'Überwache System-Performance und Logs',
      icon: <Activity size={24} />,
      path: '/admin/monitoring',
      color: '#10b981'
    },
    {
      title: 'Datenbank-Verwaltung',
      description: 'Verwalte Datenbanken und Backups',
      icon: <Database size={24} />,
      path: '/admin/database',
      color: '#f59e0b'
    },
    {
      title: 'API-Verwaltung',
      description: 'Verwalte API-Keys und Endpoints',
      icon: <Server size={24} />,
      path: '/admin/api',
      color: '#8b5cf6'
    },
    {
      title: 'Content-Management',
      description: 'Verwalte Inhalte und Readings',
      icon: <BarChart3 size={24} />,
      path: '/admin/content',
      color: '#ef4444'
    },
    {
      title: 'System-Einstellungen',
      description: 'Konfiguriere System-Parameter',
      icon: <Settings size={24} />,
      path: '/admin/settings',
      color: '#6b7280'
    }
  ];

  const systemInfo = [
    { label: 'Backend Version', value: '1.0.0' },
    { label: 'Frontend Version', value: '1.0.0' },
    { label: 'Node.js Version', value: '22.18.0' },
    { label: 'Datenbank', value: 'SQLite + Supabase' },
    { label: 'AI Service', value: 'OpenAI GPT-4' },
    { label: 'Letzte Aktualisierung', value: systemStatus.lastUpdate }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #533483 50%, #8B5CF6 75%, #A855F7 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <SSRSafeStars />
      
      <Container maxWidth="xl" sx={{ pt: 4, pb: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h2" sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              mb: 2,
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
            }}>
              🛡️ Admin Dashboard
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 3
            }}>
              System-Übersicht und Verwaltung
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<LogIn size={20} />}
                component={Link}
                href="/admin/login"
                sx={{
                  background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ff5a8a, #b83a5a)'
                  }
                }}
              >
                Admin Login
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Eye size={20} />}
                component={Link}
                href="/seitenanzeige"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Seiten-Übersicht
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Tabs */}
        <Paper sx={{ 
          mb: 3, 
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': {
                  color: 'white'
                }
              }
            }}
          >
            <Tab label="System Status" />
            <Tab label="Statistiken" />
            <Tab label="Admin Features" />
            <Tab label="System Info" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Grid container spacing={3}>
              {/* System Status */}
              <Grid item xs={12} md={6}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Shield size={20} />
                      System Status
                    </Typography>
                    
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(systemStatus.backend)}
                        </ListItemIcon>
                        <ListItemText 
                          primary="Backend Server"
                          secondary={`Status: ${systemStatus.backend}`}
                        />
                        <Chip 
                          label={systemStatus.backend}
                          color={getStatusColor(systemStatus.backend) as any}
                          size="small"
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(systemStatus.database)}
                        </ListItemIcon>
                        <ListItemText 
                          primary="Datenbank"
                          secondary={`Status: ${systemStatus.database}`}
                        />
                        <Chip 
                          label={systemStatus.database}
                          color={getStatusColor(systemStatus.database) as any}
                          size="small"
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(systemStatus.openai)}
                        </ListItemIcon>
                        <ListItemText 
                          primary="OpenAI API"
                          secondary={`Status: ${systemStatus.openai}`}
                        />
                        <Chip 
                          label={systemStatus.openai}
                          color={getStatusColor(systemStatus.openai) as any}
                          size="small"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Quick Actions */}
              <Grid item xs={12} md={6}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Activity size={20} />
                      Quick Actions
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Globe size={16} />}
                        component={Link}
                        href="http://localhost:3000"
                        target="_blank"
                        sx={{
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      >
                        Frontend öffnen
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<Server size={16} />}
                        component={Link}
                        href="http://localhost:4001/health"
                        target="_blank"
                        sx={{
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      >
                        Backend Health Check
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<BarChart3 size={16} />}
                        component={Link}
                        href="http://localhost:4001/metrics"
                        target="_blank"
                        sx={{
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      >
                        System Metrics
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Grid container spacing={3}>
              {[
                { label: 'Gesamt Benutzer', value: adminStats.totalUsers, icon: <Users size={24} />, color: '#3b82f6' },
                { label: 'Aktive Benutzer', value: adminStats.activeUsers, icon: <Activity size={24} />, color: '#10b981' },
                { label: 'Gesamt Readings', value: adminStats.totalReadings, icon: <BarChart3 size={24} />, color: '#f59e0b' },
                { label: 'System Uptime', value: adminStats.systemUptime, icon: <Clock size={24} />, color: '#8b5cf6' },
                { label: 'API Calls', value: adminStats.apiCalls.toLocaleString(), icon: <Server size={24} />, color: '#ef4444' },
                { label: 'Letzte Aktualisierung', value: systemStatus.lastUpdate, icon: <TrendingUp size={24} />, color: '#6b7280' }
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{ color: stat.color, mb: 2 }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Grid container spacing={3}>
              {adminFeatures.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)'
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ color: feature.color, mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 2
                      }}>
                        {feature.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        component={Link}
                        href={feature.path}
                        sx={{
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          '&:hover': {
                            borderColor: feature.color,
                            backgroundColor: `${feature.color}20`
                          }
                        }}
                      >
                        Öffnen
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {activeTab === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Info size={20} />
                  System Information
                </Typography>
                
                <Grid container spacing={2}>
                  {systemInfo.map((info, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box sx={{ 
                        p: 2, 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 1,
                        background: 'rgba(255, 255, 255, 0.02)'
                      }}>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          mb: 0.5
                        }}>
                          {info.label}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {info.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Footer */}
        <Box sx={{ 
          textAlign: 'center', 
          mt: 4, 
          pt: 3,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            HD App Chart - Admin Dashboard | Version 1.0.0
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            Letzte Aktualisierung: {systemStatus.lastUpdate}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
