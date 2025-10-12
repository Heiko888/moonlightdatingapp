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
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import EnhancedChartVisuals from '@/components/EnhancedChartVisuals';
import UnifiedPageLayout from '@/components/UnifiedPageLayout';

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
  const [user, setUser] = useState<any>(null);

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // Load dashboard stats
      const { data: moonData } = await supabase
        .from('moon_tracking')
        .select('*')
        .eq('user_id', user.id);

      const { data: readingsData } = await supabase
        .from('readings')
        .select('*')
        .eq('user_id', user.id);

      const { data: matchesData } = await supabase
        .from('matches')
        .select('*')
        .eq('user_id', user.id);

      setStats({
        moonEntries: moonData?.length || 0,
        readings: readingsData?.length || 0,
        matches: matchesData?.length || 0,
        communityActivity: Math.floor(Math.random() * 50) + 10
      });

      // Load recent matches
      if (matchesData) {
        const recentMatches = matchesData.slice(0, 3).map((match: any) => ({
          id: match.id,
          name: match.name || 'Unbekannt',
          age: match.age || 25,
          profileImage: match.profile_image || '/default-avatar.jpg',
          compatibility: match.compatibility || Math.floor(Math.random() * 40) + 60,
          lastMessage: match.last_message,
          lastMessageTime: match.last_message_time
        }));
        setMatches(recentMatches);
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Fehler beim Laden der Dashboard-Daten');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  if (loading) {
    return (
      <UnifiedPageLayout
        title="🌟 Dashboard"
        subtitle="Lade deine persönlichen Daten..."
        showStars={true}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress size={60} sx={{ color: '#FFD700' }} />
        </Box>
      </UnifiedPageLayout>
    );
  }

  if (error) {
    return (
      <UnifiedPageLayout
        title="🌟 Dashboard"
        subtitle="Fehler beim Laden der Daten"
        showStars={true}
      >
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={loadUserData}
          sx={{
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FFA500, #FFD700)'
            }
          }}
        >
          Erneut versuchen
        </Button>
      </UnifiedPageLayout>
    );
  }

  return (
    <UnifiedPageLayout
      title="🌟 Dashboard"
      subtitle="Willkommen zurück! Hier ist dein persönlicher Überblick über deine Human Design Journey."
      showStars={true}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              height: '100%'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Moon size={32} color="#4ecdc4" style={{ marginBottom: 8 }} />
                <Typography variant="h4" sx={{ color: '#4ecdc4', fontWeight: 700, mb: 1 }}>
                  {stats.moonEntries}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Mond-Einträge
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              height: '100%'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Target size={32} color="#ff6b9d" style={{ marginBottom: 8 }} />
                <Typography variant="h4" sx={{ color: '#ff6b9d', fontWeight: 700, mb: 1 }}>
                  {stats.readings}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Readings
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              height: '100%'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Heart size={32} color="#c44569" style={{ marginBottom: 8 }} />
                <Typography variant="h4" sx={{ color: '#c44569', fontWeight: 700, mb: 1 }}>
                  {stats.matches}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Matches
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              height: '100%'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Users size={32} color="#FFD700" style={{ marginBottom: 8 }} />
                <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 700, mb: 1 }}>
                  {stats.communityActivity}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Community Aktivität
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          mb: 4
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#FFD700', mb: 3, fontWeight: 700 }}>
              🚀 Schnellzugriff
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Target size={20} />}
                  onClick={() => router.push('/chart')}
                  sx={{
                    background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #44a08d, #4ecdc4)'
                    },
                    py: 2,
                    borderRadius: 2
                  }}
                >
                  Chart anzeigen
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Moon size={20} />}
                  onClick={() => router.push('/mondkalender')}
                  sx={{
                    background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #c44569, #ff6b9d)'
                    },
                    py: 2,
                    borderRadius: 2
                  }}
                >
                  Mondkalender
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Heart size={20} />}
                  onClick={() => router.push('/dating')}
                  sx={{
                    background: 'linear-gradient(45deg, #c44569, #e94560)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #e94560, #c44569)'
                    },
                    py: 2,
                    borderRadius: 2
                  }}
                >
                  Dating
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Users size={20} />}
                  onClick={() => router.push('/community')}
                  sx={{
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FFA500, #FFD700)'
                    },
                    py: 2,
                    borderRadius: 2
                  }}
                >
                  Community
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Matches */}
      {matches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            mb: 4
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#FFD700', mb: 3, fontWeight: 700 }}>
                💕 Deine neuesten Matches
              </Typography>
              <Grid container spacing={2}>
                {matches.map((match, index) => (
                  <Grid item xs={12} sm={6} md={4} key={match.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card sx={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        p: 2,
                        height: '100%'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}>
                            <User size={20} color="white" />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                              {match.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {match.compatibility}% Kompatibilität
                            </Typography>
                          </Box>
                        </Box>
                        {match.lastMessage && (
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
                            "{match.lastMessage}"
                          </Typography>
                        )}
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          onClick={() => router.push('/dating')}
                          sx={{
                            color: '#ff6b9d',
                            borderColor: '#ff6b9d',
                            '&:hover': {
                              borderColor: '#ff6b9d',
                              backgroundColor: 'rgba(255, 107, 157, 0.1)'
                            }
                          }}
                        >
                          Nachricht senden
                        </Button>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* User Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#FFD700', mb: 3, fontWeight: 700 }}>
              ⚙️ Benutzer-Aktionen
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<User size={20} />}
                  onClick={() => router.push('/profile')}
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: '#4ecdc4',
                      backgroundColor: 'rgba(78, 205, 196, 0.1)'
                    },
                    py: 2
                  }}
                >
                  Profil bearbeiten
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Settings size={20} />}
                  onClick={() => router.push('/settings')}
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: '#ff6b9d',
                      backgroundColor: 'rgba(255, 107, 157, 0.1)'
                    },
                    py: 2
                  }}
                >
                  Einstellungen
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LogOut size={20} />}
                  onClick={handleLogout}
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: '#ef4444',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)'
                    },
                    py: 2
                  }}
                >
                  Abmelden
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>
    </UnifiedPageLayout>
  );
};

export default DashboardPage;
