"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Home, 
  Heart, 
  Moon, 
  Users, 
  Settings,
  LogOut,
  Star,
  User,
  Edit,
  MessageCircle,
  Target,
  Zap,
  Eye,
  Activity
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import EnhancedChartVisuals from '@/components/EnhancedChartVisuals';

interface DashboardStats {
  moonEntries: number;
  readings: number;
  matches: number;
  communityActivity: number;
}

interface Match {
  id: string;
  name: string;
  age: number;
  profileImage: string;
  compatibility: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface ChartData {
  type: string;
  profile: string;
  authority: string;
  strategy: string;
  centers: Record<string, { defined: boolean }>;
  gates: Array<{ id: number; active: boolean; center: string }>;
  planets?: Record<string, any>;
}

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    moonEntries: 0,
    readings: 0,
    matches: 0,
    communityActivity: 0
  });
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    // Supabase-Authentifizierung prüfen
    const initializeAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          console.log('Kein authentifizierter Benutzer, weiterleitung zu Login');
          // Verzögerte Weiterleitung um Loop zu vermeiden
          setTimeout(() => router.push('/login'), 100);
          return;
        }
        
        console.log('Benutzer authentifiziert:', user.email);
        // Dashboard-Daten laden
        loadDashboardData();
      } catch (error) {
        console.error('Auth-Check Fehler:', error);
        // Verzögerte Weiterleitung um Loop zu vermeiden
        setTimeout(() => router.push('/login'), 100);
      }
    };

    initializeAuth();
  }, []); // Leere Dependencies verhindert Infinite Loop


  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simuliere Dashboard-Daten
      const mockStats: DashboardStats = {
        moonEntries: 12,
        readings: 5,
        matches: 3,
        communityActivity: 8
      };
      
      // Simuliere Matches
      const mockMatches: Match[] = [
        {
          id: '1',
          name: 'Sarah',
          age: 28,
          profileImage: '/api/placeholder/60/60',
          compatibility: 87,
          lastMessage: 'Hey! Wie war dein Tag?',
          lastMessageTime: '2h'
        },
        {
          id: '2',
          name: 'Michael',
          age: 32,
          profileImage: '/api/placeholder/60/60',
          compatibility: 92,
          lastMessage: 'Lass uns mal treffen!',
          lastMessageTime: '1d'
        },
        {
          id: '3',
          name: 'Emma',
          age: 26,
          profileImage: '/api/placeholder/60/60',
          compatibility: 78,
          lastMessage: 'Dein HD-Chart ist faszinierend!',
          lastMessageTime: '3d'
        }
      ];
      
      // Mock Chart Data
      const mockChartData: ChartData = {
        type: 'Generator',
        profile: '2/4',
        authority: 'Sakral',
        strategy: 'Auf andere reagieren',
        centers: {
          'Head': { defined: true },
          'Ajna': { defined: true },
          'Throat': { defined: false },
          'G': { defined: true },
          'Heart': { defined: false },
          'Spleen': { defined: true },
          'Sacral': { defined: true },
          'Solar': { defined: false },
          'Root': { defined: true }
        },
        gates: [
          { id: 1, active: true, center: 'Head' },
          { id: 2, active: true, center: 'Head' },
          { id: 3, active: true, center: 'Throat' },
          { id: 4, active: true, center: 'Head' },
          { id: 5, active: true, center: 'Throat' },
          { id: 6, active: true, center: 'Throat' },
          { id: 7, active: true, center: 'Throat' },
          { id: 8, active: true, center: 'Throat' },
          { id: 9, active: true, center: 'Spleen' },
          { id: 10, active: true, center: 'G' },
          { id: 11, active: true, center: 'Ajna' },
          { id: 12, active: true, center: 'Throat' },
          { id: 13, active: true, center: 'G' },
          { id: 14, active: true, center: 'G' },
          { id: 15, active: true, center: 'G' },
          { id: 16, active: true, center: 'Throat' },
          { id: 17, active: true, center: 'Ajna' },
          { id: 18, active: true, center: 'Spleen' },
          { id: 19, active: true, center: 'Root' },
          { id: 20, active: true, center: 'Throat' },
          { id: 21, active: true, center: 'Heart' },
          { id: 22, active: true, center: 'Throat' },
          { id: 23, active: true, center: 'Throat' },
          { id: 24, active: true, center: 'Ajna' },
          { id: 25, active: true, center: 'Heart' },
          { id: 26, active: true, center: 'Heart' },
          { id: 27, active: true, center: 'Spleen' },
          { id: 28, active: true, center: 'Root' },
          { id: 29, active: true, center: 'Sacral' },
          { id: 30, active: true, center: 'Solar' },
          { id: 31, active: true, center: 'Throat' },
          { id: 32, active: true, center: 'Solar' },
          { id: 33, active: true, center: 'Throat' },
          { id: 34, active: true, center: 'Sacral' },
          { id: 35, active: true, center: 'Throat' },
          { id: 36, active: true, center: 'Solar' },
          { id: 37, active: true, center: 'Solar' },
          { id: 38, active: true, center: 'Solar' },
          { id: 39, active: true, center: 'Root' },
          { id: 40, active: true, center: 'Heart' },
          { id: 41, active: true, center: 'Root' },
          { id: 42, active: true, center: 'Solar' },
          { id: 43, active: true, center: 'Ajna' },
          { id: 44, active: true, center: 'Spleen' },
          { id: 45, active: true, center: 'G' },
          { id: 46, active: true, center: 'G' },
          { id: 47, active: true, center: 'G' },
          { id: 48, active: true, center: 'Spleen' },
          { id: 49, active: true, center: 'G' },
          { id: 50, active: true, center: 'Solar' },
          { id: 51, active: true, center: 'Heart' },
          { id: 52, active: true, center: 'Root' },
          { id: 53, active: true, center: 'Root' },
          { id: 54, active: true, center: 'Root' },
          { id: 55, active: true, center: 'Solar' },
          { id: 56, active: true, center: 'Throat' },
          { id: 57, active: true, center: 'G' },
          { id: 58, active: true, center: 'Root' },
          { id: 59, active: true, center: 'Sacral' },
          { id: 60, active: true, center: 'Root' },
          { id: 61, active: true, center: 'Head' },
          { id: 62, active: true, center: 'Throat' },
          { id: 63, active: true, center: 'Head' },
          { id: 64, active: true, center: 'Head' }
        ]
      };
      
      // Batch State Updates um Re-Renders zu minimieren
      setStats(mockStats);
      setMatches(mockMatches);
      setChartData(mockChartData);
      
      // Verzögerte Loading-False um State-Updates zu stabilisieren
      setTimeout(() => setLoading(false), 50);
    } catch (error) {
      console.error('Fehler beim Laden der Dashboard-Daten:', error);
      setLoading(false);
    }
  }, []); // Leere Dependencies für stabile Funktion

  const handleLogout = useCallback(async () => {
    try {
      // Supabase Logout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout Fehler:', error);
        setError('Fehler beim Abmelden');
        return;
      }
      
      // LocalStorage leeren
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userData');
      localStorage.removeItem('profileSetupCompleted');
      
      console.log('Erfolgreich abgemeldet');
      // Verzögerte Weiterleitung um Loop zu vermeiden
      setTimeout(() => router.push('/login'), 100);
    } catch (error) {
      console.error('Logout Fehler:', error);
      setError('Fehler beim Abmelden');
    }
  }, [router]); // Router als Dependency für stabile Funktion

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)',
        zIndex: 0
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Header */}
        <Box sx={{ 
          mb: 6,
          textAlign: 'center',
          position: 'relative'
        }}>
          <Typography variant="h3" sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            textShadow: '0 0 20px rgba(255,255,255,0.5)',
            background: 'linear-gradient(45deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            <Home size={40} />
            🌟 Dashboard
          </Typography>
          <Typography variant="h6" sx={{ 
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 300,
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.6
          }}>
            Willkommen zurück! Hier ist dein persönlicher Überblick über deine Human Design Journey.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Statistik-Karten */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.08) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(255, 215, 0, 0.3)',
                border: '1px solid rgba(255, 215, 0, 0.5)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.2) 0%, transparent 70%)',
                opacity: 0.6
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 2 }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)'
                }}>
                  <Moon size={28} color="white" />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#FFD700', 
                  fontWeight: 'bold',
                  mb: 1,
                  textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                }}>
                  {stats.moonEntries}
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 500
                }}>
                  Mond-Einträge
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 69, 0, 0.08) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(255, 107, 107, 0.3)',
                border: '1px solid rgba(255, 107, 107, 0.5)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(255, 107, 107, 0.2) 0%, transparent 70%)',
                opacity: 0.6
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 2 }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF6B6B, #FF4500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)'
                }}>
                  <Star size={28} color="white" />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#FF6B6B', 
                  fontWeight: 'bold',
                  mb: 1,
                  textShadow: '0 0 10px rgba(255, 107, 107, 0.5)'
                }}>
                  {stats.readings}
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 500
                }}>
                  Readings
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15) 0%, rgba(68, 160, 141, 0.08) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(78, 205, 196, 0.3)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(78, 205, 196, 0.3)',
                border: '1px solid rgba(78, 205, 196, 0.5)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(78, 205, 196, 0.2) 0%, transparent 70%)',
                opacity: 0.6
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 2 }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 8px 25px rgba(78, 205, 196, 0.4)'
                }}>
                  <Heart size={28} color="white" />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#4ECDC4', 
                  fontWeight: 'bold',
                  mb: 1,
                  textShadow: '0 0 10px rgba(78, 205, 196, 0.5)'
                }}>
                  {stats.matches}
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 500
                }}>
                  Matches
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(155, 89, 182, 0.15) 0%, rgba(142, 68, 173, 0.08) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(155, 89, 182, 0.3)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(155, 89, 182, 0.3)',
                border: '1px solid rgba(155, 89, 182, 0.5)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(155, 89, 182, 0.2) 0%, transparent 70%)',
                opacity: 0.6
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 2 }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #9B59B6, #8E44AD)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 8px 25px rgba(155, 89, 182, 0.4)'
                }}>
                  <Users size={28} color="white" />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#9B59B6', 
                  fontWeight: 'bold',
                  mb: 1,
                  textShadow: '0 0 10px rgba(155, 89, 182, 0.5)'
                }}>
                  {stats.communityActivity}
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 500
                }}>
                  Community
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Human Design Chart Widget */}
        {chartData && (
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            mb: 6,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
              border: '1px solid rgba(139, 92, 246, 0.5)'
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
              opacity: 0.6
            }
          }}>
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
                }}>
                  <Target size={24} color="white" />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ 
                    color: '#8B5CF6', 
                    fontWeight: 'bold',
                    mb: 0.5,
                    textShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
                  }}>
                    Dein Human Design Chart
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Zap size={16} />
                    {chartData.type} • {chartData.profile} • {chartData.authority}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: 3, 
                p: 3,
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <EnhancedChartVisuals 
                  chartData={chartData} 
                  onTransitClick={() => console.log('Transit clicked')}
                />
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<Eye size={16} />}
                  sx={{
                    borderColor: 'rgba(139, 92, 246, 0.5)',
                    color: '#8B5CF6',
                    '&:hover': {
                      borderColor: '#8B5CF6',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)'
                    }
                  }}
                  onClick={() => router.push('/human-design-chart')}
                >
                  Vollständiges Chart
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Activity size={16} />}
                  sx={{
                    borderColor: 'rgba(139, 92, 246, 0.5)',
                    color: '#8B5CF6',
                    '&:hover': {
                      borderColor: '#8B5CF6',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)'
                    }
                  }}
                  onClick={() => router.push('/centers')}
                >
                  Zentren Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          mb: 4
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
              Schnellzugriff
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    color: 'white',
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                    }
                  }}
                  onClick={() => router.push('/planets')}
                >
                  Planeten
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    color: 'white',
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                    }
                  }}
                  onClick={() => router.push('/moon-tracking')}
                >
                  Mond-Tracking
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    color: 'white',
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                    }
                  }}
                  onClick={() => router.push('/reading')}
                >
                  Readings
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    color: 'white',
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                    }
                  }}
                  onClick={() => router.push('/swipe')}
                >
                  Dating
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Friends Community Widget */}
        <Card sx={{ 
          background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15) 0%, rgba(68, 160, 141, 0.08) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(78, 205, 196, 0.4)',
          borderRadius: 3,
          mb: 4,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 0%, rgba(78, 205, 196, 0.3) 0%, transparent 70%)',
            opacity: 0.6
          }
        }}>
          <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
                boxShadow: '0 8px 25px rgba(78, 205, 196, 0.4)'
              }}>
                <Users size={30} color="white" />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ 
                  color: '#4ecdc4', 
                  fontWeight: 'bold',
                  mb: 0.5
                }}>
                  👥 Friends Community
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  Verbinde dich mit Gleichgesinnten
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              mb: 3,
              lineHeight: 1.6
            }}>
              Entdecke eine lebendige Community von Menschen, die Human Design leben und verstehen. 
              Tausche dich aus, lerne voneinander und finde Menschen, die zu deinem energetischen Design passen.
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                    2,500+
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Mitglieder
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                    150+
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Posts/Tag
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                    25+
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Events/Monat
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                    500+
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Matches
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Users size={18} />}
                onClick={() => router.push('/community-info')}
                sx={{
                  background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                  color: 'white',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 25px rgba(78, 205, 196, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #44a08d, #4ecdc4)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(78, 205, 196, 0.6)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Community entdecken
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Heart size={18} />}
                onClick={() => router.push('/friends')}
                sx={{
                  borderColor: '#4ecdc4',
                  color: '#4ecdc4',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: '#44a08d',
                    color: '#44a08d',
                    background: 'rgba(78, 205, 196, 0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Freunde finden
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Dating Widget */}
        <Card sx={{ 
          background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.15) 0%, rgba(196, 69, 105, 0.08) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 107, 157, 0.4)',
          borderRadius: 3,
          mb: 4,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 0%, rgba(255, 107, 157, 0.3) 0%, transparent 70%)',
            opacity: 0.6
          }
        }}>
          <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
                boxShadow: '0 8px 25px rgba(255, 107, 157, 0.4)'
              }}>
                <Heart size={30} color="white" />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ 
                  color: '#ff6b9d', 
                  fontWeight: 'bold',
                  mb: 0.5
                }}>
                  💕 Dating & Matching
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  Finde die Liebe, die wirklich zu dir passt
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              mb: 3,
              lineHeight: 1.6
            }}>
              Entdecke Menschen, die energetisch zu deinem Human Design passen. 
              Basierend auf deinem Typ, Strategie und Autorität findest du authentische Verbindungen.
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#ff6b9d', fontWeight: 'bold' }}>
                    {stats.matches}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Aktive Matches
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#ff6b9d', fontWeight: 'bold' }}>
                    95%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Kompatibilität
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#ff6b9d', fontWeight: 'bold' }}>
                    24h
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Neue Matches
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#ff6b9d', fontWeight: 'bold' }}>
                    12
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Likes heute
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Heart size={18} />}
                onClick={() => router.push('/dating-info')}
                sx={{
                  background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                  color: 'white',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 25px rgba(255, 107, 157, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #c44569, #ff6b9d)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(255, 107, 157, 0.6)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Dating entdecken
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Star size={18} />}
                onClick={() => router.push('/matches')}
                sx={{
                  borderColor: '#ff6b9d',
                  color: '#ff6b9d',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: '#c44569',
                    color: '#c44569',
                    background: 'rgba(255, 107, 157, 0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Matches ansehen
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Dating Matches Section */}
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          mb: 3
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Heart size={24} color="#FF69B4" />
              <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: 'white' }}>
                Deine Matches
              </Typography>
            </Box>
            
            {matches.length > 0 ? (
              <Grid container spacing={2}>
                {matches.map((match) => (
                  <Grid item xs={12} sm={6} md={4} key={match.id}>
                    <Card sx={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease'
                      }
                    }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ 
                            width: 50, 
                            height: 50, 
                            borderRadius: '50%', 
                            background: 'linear-gradient(45deg, #FF69B4, #FFB6C1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                              {match.name.charAt(0)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                              {match.name}, {match.age}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {match.compatibility}% Kompatibilität
                            </Typography>
                          </Box>
                        </Box>
                        
                        {match.lastMessage && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              &ldquo;{match.lastMessage}&rdquo;
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                              {match.lastMessageTime}
                            </Typography>
                          </Box>
                        )}
                        
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<MessageCircle size={16} />}
                          sx={{
                            background: 'linear-gradient(45deg, #FF69B4, #FFB6C1)',
                            color: 'white',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #FF1493, #FF69B4)',
                            }
                          }}
                          onClick={() => router.push(`/dating/chat/${match.id}`)}
                        >
                          Nachricht senden
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Heart size={48} color="rgba(255,255,255,0.3)" />
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2 }}>
                  Noch keine Matches
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>
                  Starte deine Dating-Reise!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Heart size={16} />}
                  sx={{
                    background: 'linear-gradient(45deg, #FF69B4, #FFB6C1)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF1493, #FF69B4)',
                    }
                  }}
                  onClick={() => router.push('/dating')}
                >
                  Dating starten
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Profile & Settings Section */}
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          mb: 3
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <User size={24} color="#4ECDC4" />
              <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: 'white' }}>
                Profil & Einstellungen
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Edit size={20} />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    py: 2,
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                  onClick={() => router.push('/profile')}
                >
                  Profil bearbeiten
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Settings size={20} />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    py: 2,
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                  onClick={() => router.push('/settings')}
                >
                  Einstellungen
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<LogOut size={20} />}
            onClick={handleLogout}
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Abmelden
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;
