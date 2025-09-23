"use client";
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Alert,
  CircularProgress,
  IconButton,
  Chip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Moon, 
  Heart, 
  BookOpen, 
  Activity,
  ChartBar,
  Bell,
  BarChart3,
  Settings,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SSRSafeStars from '@/components/SSRSafeStars';

interface DashboardData {
  user: {
    name: string;
    avatar: string;
  };
  hdChart: {
    type: string;
    profile: string;
    authority: string;
  };
  statistics: {
    totalMoonEntries: number;
    totalReadings: number;
    totalMatches: number;
    communityActivity: number;
  };
  recentActivity: Array<{
    id: number;
    type: string;
    message: string;
    time: string;
  }>;
  notifications: Array<{
    id: number;
    message: string;
    unread: boolean;
  }>;
}

interface UserSubscription {
  packageId: string;
  status: string;
  startDate: string;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('Max');
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Sichere Daten-Extraktion mit defensiver Programmierung
        let userData: Record<string, unknown> = {};
        let userSubscription: Record<string, unknown> = {};
        let userName = 'User';
        let currentPlan = 'basic';
        
        // Sichere localStorage-Zugriffe (nur im Browser)
        if (typeof window !== 'undefined') {
          try {
            const userDataStr = localStorage.getItem('userData');
            if (userDataStr && userDataStr !== 'null' && userDataStr !== 'undefined') {
              userData = JSON.parse(userDataStr);
              userName = (userData && typeof userData === 'object' && 'name' in userData && typeof userData.name === 'string') ? userData.name : 'User';
            }
          } catch (userDataError) {
            console.warn('Fehler beim Parsen von userData:', userDataError);
          }
          
          try {
            const userSubStr = localStorage.getItem('userSubscription');
            if (userSubStr && userSubStr !== 'null' && userSubStr !== 'undefined') {
              userSubscription = JSON.parse(userSubStr);
            }
          } catch (userSubError) {
            console.warn('Fehler beim Parsen von userSubscription:', userSubError);
          }
        }
        
        // Plan bestimmen
        if (userData && typeof userData === 'object' && 'subscriptionPlan' in userData && typeof userData.subscriptionPlan === 'string') {
          currentPlan = userData.subscriptionPlan;
        } else if (userSubscription && typeof userSubscription === 'object' && 'packageId' in userSubscription && typeof userSubscription.packageId === 'string') {
          currentPlan = userSubscription.packageId;
        }

        // State setzen mit Validierung
        setUsername(userName);
        setUserSubscription({
          packageId: currentPlan,
          status: (userSubscription && typeof userSubscription === 'object' && 'status' in userSubscription && typeof userSubscription.status === 'string') ? userSubscription.status : 'active',
          startDate: (userSubscription && typeof userSubscription === 'object' && 'startDate' in userSubscription && typeof userSubscription.startDate === 'string') ? userSubscription.startDate : new Date().toISOString(),
        });

        // Dashboard-Daten laden
        let userId = null;
        if (typeof window !== 'undefined') {
          userId = localStorage.getItem('userId');
        }
        if (userId && userId !== 'null' && userId !== 'undefined') {
          try {
            console.log('📊 Lade Dashboard-Daten für Benutzer:', userId);
            const response = await fetch(`http://localhost:4001/dashboard/${userId}`);
            
            if (response.ok) {
              const realData: DashboardData = await response.json();
              console.log('✅ Dashboard-Daten erfolgreich geladen:', realData);
              setDashboardData(realData);
            } else {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          } catch (fetchError) {
            console.error('Fehler beim Laden der Dashboard-Daten:', fetchError);
            
            // Fallback zu Mock-Daten
            const mockData: DashboardData = {
              user: { name: userName, avatar: '/api/placeholder/100/100/' },
              hdChart: { type: 'Generator', profile: '1/3', authority: 'Sacral' },
              statistics: {
                totalMoonEntries: 45,
                totalReadings: 12,
                totalMatches: 8,
                communityActivity: 23
              },
              recentActivity: [
                { id: 1, type: 'moon', message: 'Neuer Mondkalender-Eintrag', time: '2h ago' },
                { id: 2, type: 'reading', message: 'Reiki-Reading abgeschlossen', time: '1d ago' },
                { id: 3, type: 'match', message: 'Neuer Match gefunden!', time: '2d ago' }
              ],
              notifications: [
                { id: 1, message: 'Neue Community-Nachricht', unread: true },
                { id: 2, message: 'Mondphase-Update verfügbar', unread: false }
              ]
            };
            setDashboardData(mockData);
          }
        } else {
          console.warn('Keine gültige User-ID gefunden');
        }
        
      } catch (error) {
        console.error('Fehler beim Initialisieren des Dashboards:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
      }}>
        <CircularProgress size={60} sx={{ color: '#FFD700' }} />
      </Box>
    );
  }

  const isBasicUser = userSubscription?.packageId === 'basic';

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='80' cy='80' r='1'/%3E%3Ccircle cx='40' cy='60' r='0.5'/%3E%3Ccircle cx='60' cy='40' r='0.5'/%3E%3Ccircle cx='90' cy='10' r='0.8'/%3E%3Ccircle cx='10' cy='90' r='0.8'/%3E%3C/g%3E%3C/svg%3E")
      `,
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <SSRSafeStars />
      
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <BarChart3 size={48} color="#10B981" />
              <Typography variant="h2" sx={{ 
                ml: 2, 
                fontWeight: 700, 
                background: 'linear-gradient(45deg, #10B981, #34D399)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Dashboard
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
              Willkommen zurück, {username}! 👋
            </Typography>
            {userSubscription && (
              <Chip 
                label={`${userSubscription.packageId.toUpperCase()} Member`}
                sx={{ 
                  background: userSubscription.packageId === 'vip' ? 'linear-gradient(45deg, #FFD700, #FFA500)' : 
                             userSubscription.packageId === 'premium' ? 'linear-gradient(45deg, #8B5CF6, #A78BFA)' :
                             'linear-gradient(45deg, #10B981, #34D399)',
                  color: '#1a1a2e',
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 2,
                  py: 1
                }} 
              />
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/premium-dashboard')}
                sx={{
                  color: '#10B981',
                  borderColor: '#10B981',
                  '&:hover': {
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
                  }
                }}
              >
                → Premium Dashboard
              </Button>
              <IconButton 
                onClick={() => router.push('/settings')}
                sx={{ 
                  color: '#10B981',
                  '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' }
                }}
              >
                <Settings size={24} />
              </IconButton>
            </Box>
          </Box>
        </motion.div>

        {/* Basic User Upgrade Prompt - Nur für erweiterte Features */}
        {isBasicUser && (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Alert 
              severity="info" 
                      sx={{
                mb: 4,
                background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                color: 'white',
                '& .MuiAlert-icon': { color: '#FFD700' }
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, color: '#FFD700' }}>
                ✨ Entdecke erweiterte Premium-Features
                      </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.9)' }}>
                Du hast bereits Zugang zu deinem vollständigen Dashboard! Upgrade zu Premium oder VIP für erweiterte Analytics, detaillierte Chart-Vergleiche und exklusive Features.
                    </Typography>
                    <Button
                onClick={() => router.push('/upgrade')}
                      variant="contained"
                      sx={{
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  color: '#000',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FFA500, #FFD700)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Premium Features entdecken
                    </Button>
            </Alert>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Left Column - Main Features */}
          <Grid item xs={12} lg={8}>
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
                <Card sx={{
                mb: 4,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3
                }}>
                  <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ 
                    mb: 3, 
                    color: '#FFD700',
                    fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                    gap: 1
                  }}>
                    <Sparkles size={24} />
                    Schnellzugriff
                      </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                    <Button
                        component={Link}
                        href="/mondkalender"
                        fullWidth
                      sx={{
                          p: 2,
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        color: 'white',
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #764ba2, #667eea)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Moon size={32} style={{ marginBottom: 8 }} />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Mondkalender
                      </Typography>
                    </Box>
                    </Button>
              </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                    <Button
                        component={Link}
                        href="/dating"
                        fullWidth
                      sx={{
                          p: 2,
                          background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                        color: 'white',
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #ee5a24, #ff6b6b)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Heart size={32} style={{ marginBottom: 8 }} />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Dating
                      </Typography>
                    </Box>
                    </Button>
              </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                    <Button
                        component={Link}
                        href="/community"
                        fullWidth
                      sx={{
                          p: 2,
                          background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                        color: 'white',
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #44a08d, #4ecdc4)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Users size={32} style={{ marginBottom: 8 }} />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Community
                      </Typography>
                    </Box>
                    </Button>
              </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                    <Button
                        component={Link}
                        href="/grundlagen-hd"
                        fullWidth
                      sx={{
                          p: 2,
                          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                          color: '#000',
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #FFA500, #FFD700)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <BookOpen size={32} style={{ marginBottom: 8 }} />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Grundwissen HD
                      </Typography>
                    </Box>
                    </Button>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                    <Button
                        component={Link}
                        href="/hd-academy"
                        fullWidth
                      sx={{
                          p: 2,
                          background: 'linear-gradient(45deg, #8b5cf6, #a855f7)',
                          color: 'white',
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #a855f7, #8b5cf6)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <BookOpen size={32} style={{ marginBottom: 8 }} />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            HD Academy
                      </Typography>
                    </Box>
                    </Button>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                    <Button
                        component={Link}
                        href="/info-hub"
                        fullWidth
                      sx={{
                          p: 2,
                          background: 'linear-gradient(45deg, #a8edea, #fed6e3)',
                          color: '#333',
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #fed6e3, #a8edea)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <BookOpen size={32} style={{ marginBottom: 8 }} />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Info Hub
                      </Typography>
                    </Box>
                    </Button>
                    </Grid>
                  </Grid>
                  </CardContent>
                </Card>
            </motion.div>

            {/* Human Design Chart - Available for all registered users */}
            {(
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card sx={{
                  mb: 4,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ 
                      mb: 3, 
                      color: '#FFD700',
                      fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                      gap: 1
                    }}>
                      <ChartBar size={24} />
                      Dein Human Design Chart
                      </Typography>
                    
                      <Box sx={{
                      p: 3, 
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#FFD700' }}>
                        {dashboardData?.hdChart?.type} • {dashboardData?.hdChart?.profile}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Authority: {dashboardData?.hdChart?.authority}
                    </Typography>
                    <Button
                        component={Link}
                        href="/chart"
                        variant="outlined"
                      sx={{
                          mt: 2,
                          borderColor: '#FFD700',
                          color: '#FFD700',
                          '&:hover': {
                            borderColor: '#FFA500',
                            bgcolor: 'rgba(255, 215, 0, 0.1)'
                          }
                        }}
                      >
                        Chart anzeigen
                    </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Statistics - Available for all registered users */}
            {(
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ 
                      mb: 3, 
                      color: '#FFD700',
                      fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                      gap: 1
                    }}>
                      <BarChart3 size={24} />
                      Deine Statistiken
                      </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                            {dashboardData?.statistics.totalMoonEntries}
                    </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Mond-Einträge
                          </Typography>
                        </Box>
              </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                            {dashboardData?.statistics.totalReadings}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Readings
                          </Typography>
                      </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                            {dashboardData?.statistics.totalMatches}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Matches
                      </Typography>
                    </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                            {dashboardData?.statistics.communityActivity}
                    </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Community
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}
              </Grid>

          {/* Right Column - Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Recent Activity - Available for all registered users */}
            {(
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card sx={{
                  mb: 4,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ 
                      mb: 3, 
                      color: '#FFD700',
                      fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                      gap: 1
                    }}>
                      <Activity size={20} />
                      Letzte Aktivitäten
                      </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {dashboardData?.recentActivity.map((activity) => (
                        <Box key={activity.id} sx={{ 
                          p: 2, 
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 2,
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
                            {activity.message}
                      </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            {activity.time}
                    </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
        </motion.div>
            )}

            {/* Notifications - Available for all registered users */}
            {(
        <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
              <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ 
                    mb: 3,
                      color: '#FFD700',
                      fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                      <Bell size={20} />
                      Benachrichtigungen
                  </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {dashboardData?.notifications.map((notification) => (
                        <Box key={notification.id} sx={{ 
                          p: 2, 
                          background: notification.unread 
                            ? 'rgba(255, 215, 0, 0.1)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 2,
                          border: notification.unread 
                            ? '1px solid rgba(255, 215, 0, 0.3)' 
                            : '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          <Typography variant="body2" sx={{ 
                            color: notification.unread ? '#FFD700' : 'white'
                          }}>
                            {notification.message}
                            </Typography>
                        </Box>
                      ))}
                    </Box>
                </CardContent>
              </Card>
              </motion.div>
            )}

            </Grid>
          </Grid>
      </Container>
    </Box>
  );
}