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
  Activity,
  Key,
  Sparkles,
  ArrowRight,
  Calendar,
  FileText,
  BookOpen
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
  connectionKeys: number;
  bookings: number;
  resonances: number;
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
    communityActivity: 0,
    connectionKeys: 0,
    bookings: 0,
    resonances: 0
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
      
      // Lade Connection Key Daten
      let connectionKeyReadings = [];
      let bookings = [];
      
      try {
        const readingsData = localStorage.getItem('readings');
        if (readingsData) {
          connectionKeyReadings = JSON.parse(readingsData).filter((r: any) => 
            r.category === 'connection-key' || r.type === 'connectionKey' || (r as any).category === 'connection-key'
          );
        }
        
        const bookingsData = localStorage.getItem('userBookings');
        if (bookingsData) {
          bookings = JSON.parse(bookingsData).filter((b: any) => 
            b.type === 'connection-key' || b.bookingType === 'connection-key'
          );
        }
      } catch (e) {
        console.error('Error loading Connection Key data:', e);
      }

      // Simuliere Dashboard-Daten
      const mockStats: DashboardStats = {
        moonEntries: 12,
        readings: 5,
        matches: 3,
        communityActivity: 8,
        connectionKeys: connectionKeyReadings.length || 0,
        bookings: bookings.length || 0,
        resonances: connectionKeyReadings.length || 0
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
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(90% 70% at 50% 25%, rgba(242, 159, 5, 0.30), transparent 78%), radial-gradient(60% 50% at 80% 80%, rgba(140, 29, 4, 0.20), transparent 78%)'
        },
        gap: 3
      }}>
        <CircularProgress 
          size={70} 
          thickness={4}
          sx={{ 
            color: '#F29F05',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }} 
        />
        <Typography
          variant="h6"
          sx={{
            color: '#F29F05',
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
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(90% 70% at 50% 28%, rgba(242, 159, 5, 0.36), transparent 78%), radial-gradient(60% 50% at 82% 82%, rgba(140, 29, 4, 0.24), transparent 78%)'
      }
    }}>
      {/* Fixed Navigation Bar entfernt */}

      <Container maxWidth="lg" sx={{ pt: 6, pb: 4 }}>
        {/* Header-Actions */}
        {/* Abmelden-Button entfernt – global im Header vorhanden */}
        {/* Header */}
        <Box sx={{ 
          mb: 6,
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Logo über dem Dashboard-Titel entfernt */}
          
          <Typography variant="h2" suppressHydrationWarning sx={{ 
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
              background: 'rgba(242, 159, 5, 0.08)',
              backdropFilter: 'blur(20px)',
              mb: 4,
              borderRadius: 4,
              border: '1px solid rgba(242, 159, 5, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 30px rgba(242, 159, 5, 0.15)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'rgba(242, 159, 5, 0.15)',
                      border: '2px solid rgba(242, 159, 5, 0.3)',
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
                        color: '#F29F05',
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
                      borderColor: 'rgba(242, 159, 5, 0.4)',
                      color: '#F29F05',
                      '&:hover': {
                        borderColor: '#F29F05',
                        background: 'rgba(242, 159, 5, 0.1)'
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

        {/* ============ CONNECTION KEY HERO ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(242, 159, 5, 0.15) 0%, rgba(140, 29, 4, 0.10) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(242, 159, 5, 0.30)',
            borderRadius: 4,
            mb: 6,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(242, 159, 5, 0.2)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 0%, rgba(242, 159, 5, 0.30) 0%, transparent 70%)',
              opacity: 0.6,
              pointerEvents: 'none'
            }
          }}>
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(242, 159, 5, 0.4)'
                  }}>
                    <Key size={40} color="white" />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ 
                      background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 800,
                      mb: 1,
                      fontSize: { xs: '1.8rem', md: '2.5rem' }
                    }}>
                      💫 The Connection Key
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 400,
                      fontSize: { xs: '1rem', md: '1.2rem' }
                    }}>
                      Entdecke die unsichtbaren Goldadern zwischen dir und anderen
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Sparkles size={20} />}
                    onClick={() => router.push('/connection-key/create')}
                    sx={{
                      background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                      color: 'white',
                      fontWeight: 700,
                      py: 1.5,
                      fontSize: '1rem',
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(242, 159, 5, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(242, 159, 5, 0.5)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Connection Key erstellen
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Calendar size={20} />}
                    onClick={() => router.push('/connection-key/booking')}
                    sx={{
                      borderColor: 'rgba(242, 159, 5, 0.5)',
                      color: '#F29F05',
                      fontWeight: 600,
                      py: 1.5,
                      fontSize: '1rem',
                      borderRadius: 3,
                      '&:hover': {
                        borderColor: '#F29F05',
                        background: 'rgba(242, 159, 5, 0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(242, 159, 5, 0.2)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Session buchen
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FileText size={20} />}
                    endIcon={<ArrowRight size={18} />}
                    onClick={() => router.push('/connection-key')}
                    sx={{
                      borderColor: 'rgba(242, 159, 5, 0.5)',
                      color: '#F29F05',
                      fontWeight: 600,
                      py: 1.5,
                      fontSize: '1rem',
                      borderRadius: 3,
                      '&:hover': {
                        borderColor: '#F29F05',
                        background: 'rgba(242, 159, 5, 0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(242, 159, 5, 0.2)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Alle Keys ansehen
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

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
              background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
              borderRadius: 2
            }
          }}>
            Connection Key Statistiken
          </Typography>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Grid container spacing={4} sx={{ mb: 0 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(242, 159, 5, 0.15) 0%, rgba(140, 29, 4, 0.10) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(242, 159, 5, 0.30)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 24px rgba(242, 159, 5, 0.2)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 34px rgba(242, 159, 5, 0.3)',
                border: '1px solid rgba(242, 159, 5, 0.45)'
              }
            }} onClick={() => router.push('/connection-key')}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 2 }}>
                <Box sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'rgba(242, 159, 5, 0.20)',
                  border: '2px solid rgba(242, 159, 5, 0.40)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Key size={24} color="#F29F05" />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#F29F05', 
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  {stats.connectionKeys}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500
                }}>
                  Connection Keys
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(242, 159, 5, 0.15) 0%, rgba(140, 29, 4, 0.10) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(242, 159, 5, 0.30)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 24px rgba(242, 159, 5, 0.2)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 34px rgba(242, 159, 5, 0.3)',
                border: '1px solid rgba(242, 159, 5, 0.45)'
              }
            }} onClick={() => router.push('/connection-key/booking')}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 2 }}>
                <Box sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'rgba(242, 159, 5, 0.20)',
                  border: '2px solid rgba(242, 159, 5, 0.40)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Calendar size={24} color="#F29F05" />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#F29F05', 
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  {stats.bookings}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500
                }}>
                  Buchungen
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(242, 159, 5, 0.15) 0%, rgba(140, 29, 4, 0.10) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(242, 159, 5, 0.30)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 24px rgba(242, 159, 5, 0.2)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 34px rgba(242, 159, 5, 0.3)',
                border: '1px solid rgba(242, 159, 5, 0.45)'
              }
            }} onClick={() => router.push('/resonanzanalyse')}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 2 }}>
                <Box sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'rgba(242, 159, 5, 0.20)',
                  border: '2px solid rgba(242, 159, 5, 0.40)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Sparkles size={24} color="#F29F05" />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#F29F05', 
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  {stats.resonances}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500
                }}>
                  Resonanzen
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
              background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
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
            background: 'rgba(139, 92, 246, 0.10)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.24)',
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
                  startIcon={<Key size={20} />}
                  sx={{
                    background: 'linear-gradient(135deg, #F29F05, #8C1D04) !important',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(242, 159, 5, 0.3) !important',
                    color: 'white !important',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(242, 159, 5, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #8C1D04, #F29F05) !important',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(242, 159, 5, 0.4)'
                    }
                  }}
                  onClick={() => router.push('/connection-key')}
                >
                  Connection Key
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Sparkles size={20} />}
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
                  Resonanzanalyse
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<BookOpen size={20} />}
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
                  onClick={() => router.push('/journal')}
                >
                  Journal
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

        {/* ============ COMMUNITY & CONNECTION KEY ============ */}
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
              background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
              borderRadius: 2
            }
          }}>
            Community & Connection Key
          </Typography>

          {/* Connection Key in Community Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
          <Card sx={{ 
          background: 'linear-gradient(135deg, rgba(242, 159, 5, 0.18) 0%, rgba(140, 29, 4, 0.12) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(242, 159, 5, 0.40)',
          borderRadius: 3,
          mb: 5,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(242, 159, 5, 0.25)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(242, 159, 5, 0.35) 0%, transparent 70%)',
            opacity: 0.7
          }
        }}>
          <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(242, 159, 5, 0.4)',
                flexShrink: 0
              }}>
                <Key size={30} color="white" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ 
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  mb: 0.5
                }}>
                  💫 Connection Key in unserer Community
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  Teile deine Resonanzen und entdecke die energetischen Verbindungen
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ 
              color: 'rgba(255,255,255,0.95)', 
              mb: 3,
              lineHeight: 1.7,
              fontSize: '1.05rem'
            }}>
              In unserer Community teilst du nicht nur deine Human Design Journey, sondern auch die tiefgreifenden 
              Resonanzen, die du mit anderen Menschen erlebst. Mit <strong style={{ color: '#F29F05' }}>The Connection Key</strong> kannst du 
              deine energetischen Verbindungen analysieren, verstehen und in der Community teilen. 
              Entdecke die unsichtbaren Goldadern zwischen dir und anderen Menschen.
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#F29F05', fontWeight: 'bold' }}>
                    2,500+
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Mitglieder
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#F29F05', fontWeight: 'bold' }}>
                    {stats.connectionKeys}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Connection Keys
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#F29F05', fontWeight: 'bold' }}>
                    {stats.resonances}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Geteilte Resonanzen
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#F29F05', fontWeight: 'bold' }}>
                    150+
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Posts/Tag
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Key size={18} />}
                onClick={() => router.push('/connection-key/create')}
                sx={{
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  color: 'white',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 25px rgba(242, 159, 5, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(242, 159, 5, 0.45)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Connection Key erstellen
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Users size={18} />}
                onClick={() => router.push('/community-info')}
                sx={{
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  color: 'white',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 25px rgba(242, 159, 5, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(242, 159, 5, 0.45)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Community entdecken
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Sparkles size={18} />}
                onClick={() => router.push('/connection-key')}
                sx={{
                  borderColor: '#F29F05',
                  color: '#F29F05',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: '#8C1D04',
                    color: '#F29F05',
                    background: 'rgba(242, 159, 5, 0.10)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(242, 159, 5, 0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Alle Keys ansehen
              </Button>
            </Box>
          </CardContent>
        </Card>
        </motion.div>
        </Box>

        {/* ============ DATING & CONNECTION KEY ============ */}
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
              background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
              borderRadius: 2
            }
          }}>
            Dating & Connection Key
          </Typography>

        {/* Dating & Connection Key Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card sx={{ 
          background: 'linear-gradient(135deg, rgba(242, 159, 5, 0.18) 0%, rgba(140, 29, 4, 0.12) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(242, 159, 5, 0.40)',
          borderRadius: 3,
          mb: 5,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(242, 159, 5, 0.25)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 0%, rgba(242, 159, 5, 0.35) 0%, transparent 70%)',
            opacity: 0.7
          }
        }}>
          <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(242, 159, 5, 0.4)',
                flexShrink: 0
              }}>
                <Key size={30} color="white" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ 
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  mb: 0.5
                }}>
                  💕 Dating & Connection Key Matching
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  Finde Resonanzen statt nur Matches
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ 
              color: 'rgba(255,255,255,0.95)', 
              mb: 3,
              lineHeight: 1.7,
              fontSize: '1.05rem'
            }}>
              Es geht nicht darum, ob ihr <em>passt</em> – sondern was entsteht, wenn ihr euch begegnet. 
              Mit <strong style={{ color: '#F29F05' }}>The Connection Key</strong> analysierst du die energetische Resonanz zwischen dir und deinen Dating-Partnern. 
              Entdecke die unsichtbaren Goldadern, die euch verbinden, und verstehe, was wirklich zwischen euch wirkt. 
              Kein Algorithmus. Kein Match. Nur Wahrheit – in Energie übersetzt.
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#F29F05', fontWeight: 'bold' }}>
                    {stats.matches}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Aktive Matches
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#F29F05', fontWeight: 'bold' }}>
                    {stats.connectionKeys}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Dating Keys
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#F29F05', fontWeight: 'bold' }}>
                    {stats.resonances}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Resonanzen
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#F29F05', fontWeight: 'bold' }}>
                    100%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Energetisch
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Key size={18} />}
                onClick={() => router.push('/connection-key/create')}
                sx={{
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  color: 'white',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 25px rgba(242, 159, 5, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(242, 159, 5, 0.45)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Resonanz analysieren
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Heart size={18} />}
                onClick={() => router.push('/dating')}
                sx={{
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  color: 'white',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 25px rgba(242, 159, 5, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(242, 159, 5, 0.45)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Dating entdecken
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Sparkles size={18} />}
                onClick={() => router.push('/connection-key')}
                sx={{
                  borderColor: '#F29F05',
                  color: '#F29F05',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: '#8C1D04',
                    color: '#F29F05',
                    background: 'rgba(242, 159, 5, 0.10)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(242, 159, 5, 0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Alle Keys
              </Button>
            </Box>
          </CardContent>
        </Card>
          </motion.div>
        </Box>

        {/* ============ HUMAN DESIGN & CONNECTION KEY ============ */}
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
                background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                borderRadius: 2
              }
            }}>
              Human Design & Connection Key
            </Typography>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
          <Card sx={{ 
          background: 'linear-gradient(135deg, rgba(242, 159, 5, 0.18) 0%, rgba(140, 29, 4, 0.12) 100%)',
            backdropFilter: 'blur(25px)',
          border: '1px solid rgba(242, 159, 5, 0.40)',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            mb: 0,
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 32px rgba(242, 159, 5, 0.25)',
            '&:hover': {
              transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(242, 159, 5, 0.35)',
            border: '1px solid rgba(242, 159, 5, 0.55)'
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            background: 'radial-gradient(circle at 50% 0%, rgba(242, 159, 5, 0.30) 0%, transparent 70%)',
              opacity: 0.7
            }
          }}>
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 25px rgba(242, 159, 5, 0.4)'
                }}>
                  <Target size={24} color="white" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ 
                    background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 800,
                    mb: 0.5
                  }}>
                    Dein Human Design Chart
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.9)',
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
                mb: 3,
                p: 2.5,
                background: 'rgba(242, 159, 5, 0.08)',
                borderRadius: 2,
                border: '1px solid rgba(242, 159, 5, 0.2)'
              }}>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.95)',
                  lineHeight: 1.7,
                  fontSize: '0.95rem'
                }}>
                  <strong style={{ color: '#F29F05' }}>Human Design ist die Landkarte. The Connection Key ist der Raum dazwischen.</strong> 
                  Während dein Human Design Chart zeigt, wer du bist, zeigt dir <strong style={{ color: '#F29F05' }}>The Connection Key</strong>, 
                  was entsteht, wenn sich zwei Designs begegnen. Erstelle einen Connection Key, um die energetische Resonanz 
                  zwischen dir und anderen zu entdecken.
                </Typography>
              </Box>
              
              <Box sx={{ 
                background: 'rgba(242, 159, 5, 0.05)', 
                borderRadius: 3, 
                p: 3,
                border: '1px solid rgba(242, 159, 5, 0.25)',
                mb: 3
              }}>
                <EnhancedChartVisuals 
                  chartData={chartData} 
                  onTransitClick={() => console.log('Transit clicked')}
                />
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<Key size={18} />}
                  onClick={() => router.push('/connection-key/create')}
                  sx={{
                    background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                    color: 'white',
                    fontWeight: 700,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(242, 159, 5, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(242, 159, 5, 0.5)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Connection Key erstellen
                </Button>
                
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
                    borderColor: 'rgba(242, 159, 5, 0.5)',
                    color: '#F29F05',
                    '&:hover': {
                      borderColor: '#F29F05',
                      backgroundColor: 'rgba(242, 159, 5, 0.1)'
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
                    borderColor: 'rgba(242, 159, 5, 0.5)',
                    color: '#F29F05',
                    '&:hover': {
                      borderColor: '#F29F05',
                      backgroundColor: 'rgba(242, 159, 5, 0.1)'
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
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
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
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
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
