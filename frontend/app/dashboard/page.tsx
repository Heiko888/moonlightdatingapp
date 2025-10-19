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
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import EnhancedChartVisuals from '@/components/EnhancedChartVisuals';
import SeitenuebersichtWidget from '@/components/SeitenuebersichtWidget';
import ReferralWidget from '@/components/ReferralWidget';
import SocialShare from '@/components/SocialShare';

interface DashboardStats {
  moonEntries: number;
  readings: number;
  matches: number;
  communityActivity: number;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Prüfe ob Benutzer eingeloggt ist
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      console.log('Keine Authentifizierung, weiterleitung zu Login');
      router.push('/login');
      return;
    }
    
    console.log('Dashboard wird geladen...');
    loadUserName();
    loadDashboardData();
    loadUserSubscription();
  }, [router]);

  const loadUserName = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      // Versuche zuerst aus localStorage zu laden
      const userData = localStorage.getItem('userData');
      if (userData) {
        const data = JSON.parse(userData);
        if (data.firstName || data.first_name) {
          setUserName(data.firstName || data.first_name);
          return;
        }
      }

      // Andernfalls aus Supabase laden
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('user_id', userId)
        .single();

      if (!error && profile?.first_name) {
        setUserName(profile.first_name);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Benutzernamens:', error);
    }
  }, []);

  const loadUserSubscription = useCallback(async () => {
    try {
      // Lade Abonnement-Status aus localStorage
      const storedSubscription = localStorage.getItem('user-subscription');
      if (storedSubscription) {
        const subscription = JSON.parse(storedSubscription);
        setUserSubscription(subscription);
        console.log('Abonnement geladen:', subscription);
      } else {
        // Fallback: Lade aus userData
        const userData = localStorage.getItem('userData');
        if (userData) {
          const data = JSON.parse(userData);
          if (data.subscriptionPlan) {
            setUserSubscription({
              packageId: data.subscriptionPlan,
              status: 'active',
              plan: data.subscriptionPlan === 'basic' ? 'Basic' : 
                    data.subscriptionPlan === 'premium' ? 'Premium' : 
                    data.subscriptionPlan === 'vip' ? 'VIP' : 'Kostenlos'
            });
          }
        }
      }
    } catch (error) {
      console.error('Fehler beim Laden des Abonnements:', error);
    }
  }, []);

  // Event Listener für Abonnement-Updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user-subscription' && e.newValue) {
        try {
          const subscription = JSON.parse(e.newValue);
          setUserSubscription(subscription);
          console.log('Abonnement aktualisiert:', subscription);
        } catch (error) {
          console.error('Fehler beim Parsen des Abonnements:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Auch auf localStorage-Änderungen im gleichen Tab hören
    const handleLocalStorageChange = () => {
      const storedSubscription = localStorage.getItem('user-subscription');
      if (storedSubscription) {
        try {
          const subscription = JSON.parse(storedSubscription);
          setUserSubscription(subscription);
          console.log('Abonnement aktualisiert (local):', subscription);
        } catch (error) {
          console.error('Fehler beim Parsen des Abonnements:', error);
        }
      }
    };

    // Polling für localStorage-Änderungen (als Fallback)
    const interval = setInterval(handleLocalStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);


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
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#000000',
        gap: 3
      }}>
        <CircularProgress 
          size={70} 
          thickness={4}
          sx={{ 
            color: '#e8b86d',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }} 
        />
        <Typography
          variant="h6"
          sx={{
            color: '#e8b86d',
            fontWeight: 600,
            textAlign: 'center'
          }}
        >
          Lädt...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#000000'
    }}>
      {/* Fixed Navigation Bar */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backdropFilter: 'blur(20px)',
        background: '#000000',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            py: 1 
          }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                position: 'relative',
                height: { xs: 50, md: 70 },
                width: { xs: 200, md: 280 },
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}>
                <Image
                  src="/images/connection-key-logo.png"
                  alt="The Connection Key Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
            </Link>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={() => router.push('/seitenuebersicht')}
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: '#4ecdc4',
                    background: 'rgba(78, 205, 196, 0.1)'
                  }
                }}
              >
                Übersicht
              </Button>
              <Button
                onClick={handleLogout}
                variant="contained"
                startIcon={<LogOut size={18} />}
                sx={{
                  background: 'linear-gradient(135deg, #4ecdc4, #0891b2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3bb5b0, #0779a1)'
                  }
                }}
              >
                Abmelden
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 20, pb: 4 }}>
        {/* Header */}
        <Box sx={{ 
          mb: 6,
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Logo über dem Dashboard-Titel */}
          <Box sx={{ 
            position: 'relative',
            height: { xs: 100, md: 150 },
            width: { xs: 380, md: 560 },
            mx: 'auto',
            mb: 3
          }}>
            <Image
              src="/images/connection-key-logo.png"
              alt="The Connection Key"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </Box>
          
          <Typography variant="h2" sx={{ 
            fontWeight: 'bold',
            mb: 2,
            color: 'white',
            fontSize: { xs: '2rem', md: '3rem' },
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
          }}>
            {userName ? `${userName}s Dashboard` : 'Dashboard'}
          </Typography>
          <Typography variant="h6" sx={{ 
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 300,
            maxWidth: 700,
            mx: 'auto',
            lineHeight: 1.8,
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}>
            {userName ? `Willkommen zurück, ${userName}!` : 'Willkommen zurück!'} Hier ist dein persönlicher Überblick über deine Human Design Journey.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Abonnement Status */}
        {userSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{
              background: userSubscription.packageId === 'vip' ? 'rgba(255, 215, 0, 0.08)' :
                         userSubscription.packageId === 'premium' ? 'rgba(156, 39, 176, 0.08)' :
                         userSubscription.packageId === 'basic' ? 'rgba(33, 150, 243, 0.08)' :
                         'rgba(76, 175, 80, 0.08)',
              backdropFilter: 'blur(20px)',
              mb: 4,
              borderRadius: 4,
              border: userSubscription.packageId === 'vip' ? '1px solid rgba(255, 215, 0, 0.2)' :
                     userSubscription.packageId === 'premium' ? '1px solid rgba(156, 39, 176, 0.2)' :
                     userSubscription.packageId === 'basic' ? '1px solid rgba(33, 150, 243, 0.2)' :
                     '1px solid rgba(76, 175, 80, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: userSubscription.packageId === 'vip' ? '0 8px 30px rgba(255, 215, 0, 0.15)' :
                          userSubscription.packageId === 'premium' ? '0 8px 30px rgba(156, 39, 176, 0.15)' :
                          userSubscription.packageId === 'basic' ? '0 8px 30px rgba(33, 150, 243, 0.15)' :
                          '0 8px 30px rgba(76, 175, 80, 0.15)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: userSubscription.packageId === 'vip' ? 'rgba(255, 215, 0, 0.15)' :
                                 userSubscription.packageId === 'premium' ? 'rgba(156, 39, 176, 0.15)' :
                                 userSubscription.packageId === 'basic' ? 'rgba(33, 150, 243, 0.15)' :
                                 'rgba(76, 175, 80, 0.15)',
                      border: userSubscription.packageId === 'vip' ? '2px solid rgba(255, 215, 0, 0.3)' :
                             userSubscription.packageId === 'premium' ? '2px solid rgba(156, 39, 176, 0.3)' :
                             userSubscription.packageId === 'basic' ? '2px solid rgba(33, 150, 243, 0.3)' :
                             '2px solid rgba(76, 175, 80, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      fontSize: '1.5rem'
                    }}>
                      {userSubscription.packageId === 'vip' ? '👑' :
                       userSubscription.packageId === 'premium' ? '💎' :
                       userSubscription.packageId === 'basic' ? '⭐' : '🌱'}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        color: userSubscription.packageId === 'vip' ? '#FFD700' :
                               userSubscription.packageId === 'premium' ? '#9C27B0' :
                               userSubscription.packageId === 'basic' ? '#2196F3' :
                               '#4CAF50',
                        fontWeight: 700, 
                        mb: 0.5 
                      }}>
                        {userSubscription.packageId === 'vip' ? 'VIP' :
                         userSubscription.packageId === 'premium' ? 'Premium' :
                         userSubscription.packageId === 'basic' ? 'Basic' : 'Kostenlos'} Paket
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Status: {userSubscription.status === 'active' ? 'Aktiv ✓' : 'Inaktiv'}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: userSubscription.packageId === 'vip' ? 'rgba(255, 215, 0, 0.4)' :
                                  userSubscription.packageId === 'premium' ? 'rgba(156, 39, 176, 0.4)' :
                                  userSubscription.packageId === 'basic' ? 'rgba(33, 150, 243, 0.4)' :
                                  'rgba(76, 175, 80, 0.4)',
                      color: userSubscription.packageId === 'vip' ? '#FFD700' :
                            userSubscription.packageId === 'premium' ? '#9C27B0' :
                            userSubscription.packageId === 'basic' ? '#2196F3' :
                            '#4CAF50',
                      '&:hover': {
                        borderColor: userSubscription.packageId === 'vip' ? '#FFD700' :
                                    userSubscription.packageId === 'premium' ? '#9C27B0' :
                                    userSubscription.packageId === 'basic' ? '#2196F3' :
                                    '#4CAF50',
                        background: userSubscription.packageId === 'vip' ? 'rgba(255, 215, 0, 0.1)' :
                                   userSubscription.packageId === 'premium' ? 'rgba(156, 39, 176, 0.1)' :
                                   userSubscription.packageId === 'basic' ? 'rgba(33, 150, 243, 0.1)' :
                                   'rgba(76, 175, 80, 0.1)'
                      }
                    }}
                    onClick={() => router.push('/pricing')}
                  >
                    Upgrade
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ============ STATISTIKEN ============ */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h4" sx={{ 
            color: 'white',
            fontWeight: 700,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '&::before': {
              content: '""',
              width: 4,
              height: 32,
              background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6)',
              borderRadius: 2
            }
          }}>
            Deine Statistiken
          </Typography>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Grid container spacing={4} sx={{ mb: 0 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(78, 205, 196, 0.15)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(78, 205, 196, 0.15)',
                border: '1px solid rgba(78, 205, 196, 0.25)',
                background: 'rgba(78, 205, 196, 0.08)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 2 }}>
                <Box sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'rgba(78, 205, 196, 0.15)',
                  border: '2px solid rgba(78, 205, 196, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Moon size={24} color="#4ECDC4" />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#4ECDC4', 
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  {stats.moonEntries}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500
                }}>
                  Mond-Einträge
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(78, 205, 196, 0.15)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(78, 205, 196, 0.15)',
                border: '1px solid rgba(78, 205, 196, 0.25)',
                background: 'rgba(78, 205, 196, 0.08)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 2 }}>
                <Box sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'rgba(78, 205, 196, 0.15)',
                  border: '2px solid rgba(78, 205, 196, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Star size={24} color="#4ECDC4" />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#4ECDC4', 
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  {stats.readings}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500
                }}>
                  Readings
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(78, 205, 196, 0.15)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(78, 205, 196, 0.15)',
                border: '1px solid rgba(78, 205, 196, 0.25)',
                background: 'rgba(78, 205, 196, 0.08)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 2 }}>
                <Box sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'rgba(78, 205, 196, 0.15)',
                  border: '2px solid rgba(78, 205, 196, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Heart size={24} color="#4ECDC4" />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#4ECDC4', 
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  {stats.matches}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500
                }}>
                  Matches
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(78, 205, 196, 0.15)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(78, 205, 196, 0.15)',
                border: '1px solid rgba(78, 205, 196, 0.25)',
                background: 'rgba(78, 205, 196, 0.08)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 2 }}>
                <Box sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'rgba(78, 205, 196, 0.15)',
                  border: '2px solid rgba(78, 205, 196, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Users size={24} color="#4ECDC4" />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#4ECDC4', 
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  {stats.communityActivity}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500
                }}>
                  Community
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
          </motion.div>
        </Box>

        {/* ============ SCHNELLZUGRIFF ============ */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h4" sx={{ 
            color: 'white',
            fontWeight: 700,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '&::before': {
              content: '""',
              width: 4,
              height: 32,
              background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6)',
              borderRadius: 2
            }
          }}>
              Schnellzugriff
            </Typography>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(78, 205, 196, 0.15)',
            borderRadius: 4,
            mb: 0
          }}>
            <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Star size={20} />}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.15) !important',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3) !important',
                    color: 'white !important',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 500,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25) !important',
                      border: '1px solid rgba(255, 255, 255, 0.4) !important',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
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
                  startIcon={<Moon size={20} />}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.15) !important',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3) !important',
                    color: 'white !important',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 500,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25) !important',
                      border: '1px solid rgba(255, 255, 255, 0.4) !important',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                  onClick={() => router.push('/mondkalender')}
                >
                  Mondkalender
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Target size={20} />}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.15) !important',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3) !important',
                    color: 'white !important',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 500,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25) !important',
                      border: '1px solid rgba(255, 255, 255, 0.4) !important',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                  onClick={() => router.push('/resonanzanalyse')}
                >
                  Readings
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Heart size={20} />}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.15) !important',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3) !important',
                    color: 'white !important',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 500,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25) !important',
                      border: '1px solid rgba(255, 255, 255, 0.4) !important',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                  onClick={() => router.push('/dating')}
                >
                  Dating
                </Button>
              </Grid>
              
              {/* Zweite Reihe */}
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Users size={20} />}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.15) !important',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3) !important',
                    color: 'white !important',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 500,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25) !important',
                      border: '1px solid rgba(255, 255, 255, 0.4) !important',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                  onClick={() => router.push('/community')}
                >
                  Community
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<User size={20} />}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.15) !important',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3) !important',
                    color: 'white !important',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 500,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25) !important',
                      border: '1px solid rgba(255, 255, 255, 0.4) !important',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                  onClick={() => router.push('/profil')}
                >
                  Profil
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<MessageCircle size={20} />}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.15) !important',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3) !important',
                    color: 'white !important',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 500,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25) !important',
                      border: '1px solid rgba(255, 255, 255, 0.4) !important',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                  onClick={() => router.push('/chat')}
                >
                  Chat
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Settings size={20} />}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.15) !important',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3) !important',
                    color: 'white !important',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 500,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25) !important',
                      border: '1px solid rgba(255, 255, 255, 0.4) !important',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
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
          </motion.div>
        </Box>

        {/* ============ COMMUNITY ============ */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h4" sx={{ 
            color: 'white',
            fontWeight: 700,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '&::before': {
              content: '""',
              width: 4,
              height: 32,
              background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
              borderRadius: 2
            }
          }}>
            Community
          </Typography>

          {/* Friends Community Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
          <Card sx={{ 
          background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15) 0%, rgba(68, 160, 141, 0.08) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(78, 205, 196, 0.4)',
          borderRadius: 3,
          mb: 5,
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
        </motion.div>
        </Box>

        {/* ============ DATING ============ */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h4" sx={{ 
            color: 'white',
            fontWeight: 700,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '&::before': {
              content: '""',
              width: 4,
              height: 32,
              background: 'linear-gradient(135deg, #ff6b9d, #ef4444)',
              borderRadius: 2
            }
          }}>
            Dating
          </Typography>

          {/* Dating Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
          <Card sx={{ 
          background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 107, 157, 0.4)',
          borderRadius: 3,
          mb: 5,
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
                background: 'linear-gradient(135deg, #ff6b9d, #ef4444)',
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
                onClick={() => router.push('/swipe')}
                sx={{
                  background: 'linear-gradient(135deg, #ff6b9d, #ef4444)',
                  color: 'white',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 25px rgba(255, 107, 157, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5a8a, #dc2626)',
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
                onClick={() => router.push('/match')}
                sx={{
                  borderColor: '#ff6b9d',
                  color: '#ff6b9d',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: '#ef4444',
                    color: '#ef4444',
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
        </motion.div>
        </Box>

        {/* ============ HUMAN DESIGN ============ */}
        {chartData && (
          <Box sx={{ mb: 10 }}>
            <Typography variant="h4" sx={{ 
              color: 'white',
              fontWeight: 700,
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              '&::before': {
                content: '""',
                width: 4,
                height: 32,
                background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                borderRadius: 2
              }
            }}>
              Dein Human Design
            </Typography>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            mb: 0,
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
              
              <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Social Share Button */}
                <SocialShare
                  title={`Mein Human Design: ${chartData.type} ${chartData.profile}`}
                  description={`Ich bin ein ${chartData.type} mit ${chartData.authority} Autorität. Entdecke dein eigenes Human Design!`}
                  chartData={chartData}
                  type="chart"
                  onShare={(platform) => {
                    console.log(`Chart geteilt auf ${platform}`);
                  }}
                />
                
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
            </motion.div>
          </Box>
        )}


        {/* ============ WEITERE FEATURES ============ */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h4" sx={{ 
            color: 'white',
            fontWeight: 700,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '&::before': {
              content: '""',
              width: 4,
              height: 32,
              background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6)',
              borderRadius: 2
            }
          }}>
            Weitere Features
              </Typography>

          {/* Referral Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
          >
            <Box sx={{ mb: 5 }}>
              <ReferralWidget />
        </Box>
          </motion.div>

        {/* Seitenübersicht Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
              <Card sx={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            mb: 0
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h5" sx={{ 
                  color: 'white', 
                  mb: 2,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Alle Features & Seiten
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    Entdecke alle verfügbaren Seiten und Features der Human Design App
                  </Typography>
              </Box>
              <SeitenuebersichtWidget 
                maxHeight={400} 
                showFilters={true} 
                compact={false} 
              />
                </CardContent>
              </Card>
        </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;
