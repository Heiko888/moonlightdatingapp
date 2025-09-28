"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  User, 
  BaseComponentProps,
  FormState 
} from '@/types/common.types';
import { apiService } from '@/lib/services/apiService';
import { useLoadingState } from '@/lib/services/loadingService';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Container,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Edit, 
  Save, 
  Heart,
  Star,
  Calendar,
  Moon,
  BookOpen,
  Activity
} from 'lucide-react';
import AccessControl from '../../components/AccessControl';
import { UserSubscription } from '../../lib/subscription/types';
import { SubscriptionService } from '../../lib/subscription/subscriptionService';
import { useRouter } from 'next/navigation';

// Animierte Sterne Komponente
const AnimatedStars = () => (
  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          width: '3px',
          height: '3px',
          background: '#FFD700',
          borderRadius: '50%',
          boxShadow: '0 0 8px #FFD700, 0 0 16px #FFD700, 0 0 24px #FFD700',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          opacity: [0.2, 1, 0.2],
          scale: [0.6, 1.4, 0.6],
        }}
        transition={{
          duration: 2.5 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 3,
        }}
      />
    ))}
  </Box>
);

interface ProfileData {
  user: {
    id?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    phone?: string;
    location?: string;
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    bio?: string;
    description?: string;
    interests?: string[];
    website?: string;
  };
  hdChart: {
    type?: string;
    profile?: string;
    strategy?: string;
    authority?: string;
    incarnationCross?: string;
  };
  moonData: Array<{
    id: string;
    date: string;
    phase: string;
    notes: string;
  }>;
  matchingHistory: Array<{
    id: string;
    person1: string;
    person2: string;
    score: number;
    date: string;
  }>;
  coachingSessions: Array<{
    id: string;
    coach: string;
    type: string;
    date: string;
    status: string;
  }>;
  statistics: {
    totalMoonEntries: number;
    totalMatchingAnalyses: number;
    totalCoachingSessions: number;
    lastActivity: string;
  };
}

function ProfilContent() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading] = useState(true);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    postalCode: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    hdType: '',
    hdProfile: '',
    hdStrategy: '',
    hdAuthority: '',
    hdIncarnationCross: '',
    description: '',
    interests: [] as string[],
    website: '',
    bio: '',
    isPublic: true,
    notifications: true,
    emailNotifications: true,
    allowMessages: true,
    dataSharing: false
  });

  const [formData, setFormData] = useState(profile);

  const { isLoading, error, setLoading, setError } = useLoadingState('profile');

  // Profil-Daten aus der SQLite-Datenbank laden
  const loadProfileData = React.useCallback(async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setLoading(false);
        return;
      }

      // Verwende den zentralen API-Service
      const userData = await apiService.getUserProfile(userId);
      
      if (userData) {
        
        // Profil-Daten aus den echten API-Daten extrahieren
        setProfile(prev => ({
          ...prev,
          name: userData.firstName + ' ' + userData.lastName || 'Unbekannter Benutzer',
          email: userData.email || '',
          phone: userData.phone || '',
          location: userData.location || '',
          birthDate: userData.birthDate || '',
          birthTime: userData.birthTime || '',
          birthPlace: userData.birthPlace || '',
          description: userData.bio || '',
          interests: userData.interests || [],
          website: userData.website || '',
          bio: userData.bio || '',
          hdType: userData.hdType || '',
          hdProfile: userData.hdProfile || '',
          hdStrategy: userData.hdStrategy || '',
          hdAuthority: userData.hdAuthority || ''
        }));

        // Statistiken aus echten Daten berechnen
        setProfileData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            statistics: {
              totalMoonEntries: 0,
              totalMatchingAnalyses: 0,
              totalCoachingSessions: 0,
              lastActivity: userData.updatedAt || userData.createdAt || new Date().toISOString()
            }
          };
        });
      } else {
        // Fallback auf Test-Daten aus der Datenbank
        await loadTestData();
      }
    } catch (error) {
      console.error('Fehler beim Laden der Profil-Daten:', error);
      // Fallback auf Test-Daten
      await loadTestData();
    } finally {
      setLoading(false);
    }
  }, []);

  // Authentifizierung und Subscription prüfen
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        setIsAuthenticated(false);
        // Keine Authentifizierung erforderlich - App ist öffentlich
        return;
      }
      
      setIsAuthenticated(true);
      
      // Daten laden
      loadProfileData();
      await loadUserSubscription();
    };

    checkAuth();
  }, [router, loadProfileData]);

  const loadUserSubscription = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const subscription = await SubscriptionService.getUserSubscription(user.id);
        setUserSubscription(subscription);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Subscription:', error);
    }
  };

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  // Test-Daten aus der Datenbank laden
  const loadTestData = async () => {
    try {
      const response = await apiService.getTestStatus();
      if (response.success) {
        const testData = response.data;
        if (testData.users && testData.users.length > 0) {
          const firstUser = testData.users[0];
          setProfile(prev => ({
            ...prev,
            name: firstUser.name || 'Test Benutzer',
            email: firstUser.email || 'test@example.com',
            phone: '+49 123 456789',
            location: firstUser.location || 'Hamburg, Deutschland',
            birthDate: firstUser.birthdate || '1990-05-15',
            birthTime: '14:30',
            birthPlace: firstUser.birthplace || 'Hamburg',
            hdType: firstUser.hd_type || 'Generator',
            hdProfile: firstUser.profile || '2/4',
            hdStrategy: firstUser.strategy || 'Auf andere reagieren',
            hdAuthority: firstUser.authority || 'Sakral',
            description: firstUser.bio || 'Energiegeladener Generator, der gerne neue Menschen kennenlernt und tiefgründige Gespräche führt.',
            interests: firstUser.interests ? JSON.parse(firstUser.interests) : ['Sport', 'Musik', 'Reisen', 'Human Design', 'Kochen'],
            bio: firstUser.bio || 'Ich bin ein leidenschaftlicher Generator, der gerne neue Verbindungen knüpft und tiefgründige Gespräche führt.'
          }));
        }
      }
    } catch (error) {
      console.error('Fehler beim Laden der Test-Daten:', error);
      // Letzter Fallback auf statische Daten
      setProfile(prev => ({
        ...prev,
        name: 'Max Mustermann',
        email: 'max@example.com',
        phone: '+49 123 456789',
        location: 'Hamburg, Deutschland',
        birthDate: '1990-05-15',
        birthTime: '14:30',
        birthPlace: 'Hamburg',
        hdType: 'Generator',
        hdProfile: '2/4',
        hdStrategy: 'Auf andere reagieren',
        hdAuthority: 'Sakral',
        description: 'Energiegeladener Generator, der gerne neue Menschen kennenlernt und tiefgründige Gespräche führt.',
        interests: ['Sport', 'Musik', 'Reisen', 'Human Design', 'Kochen'],
        bio: 'Ich bin ein leidenschaftlicher Generator, der gerne neue Verbindungen knüpft und tiefgründige Gespräche führt.'
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        setMessage('Nicht angemeldet');
        return;
      }

      // Bereite Update-Daten vor
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        birthdate: formData.birthDate,
        birthTime: formData.birthTime,
        birthplace: formData.birthPlace,
        bio: formData.bio,
        interests: JSON.stringify(formData.interests),
        website: formData.website
      };

      const response = await apiService.updateUserProfile(userId, updateData);

      if (response.success) {
        const updatedUser = response.data;
        console.log('Profil erfolgreich aktualisiert:', updatedUser);
        
        // Aktualisiere lokalen State
        setProfile(formData);
        setIsEditing(false);
        setMessage('Profil erfolgreich aktualisiert!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await response.json();
        setMessage(`Fehler beim Speichern: ${error.error || 'Unbekannter Fehler'}`);
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Profils:', error);
      setMessage('Fehler beim Speichern des Profils');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // const handleInterestToggle = (interest: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     interests: prev.interests.includes(interest)
  //       ? prev.interests.filter(i => i !== interest)
  //       : [...prev.interests, interest]
  //   }));
  // };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #533483 50%, #8B5CF6 75%, #A855F7 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress size={60} sx={{ color: '#FFD700' }} />
      </Box>
    );
  }

  return (
    <AccessControl 
      path="/profil" 
      userSubscription={userSubscription}
      onUpgrade={() => router.push('/pricing')}
    >
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #533483 50%, #8B5CF6 75%, #A855F7 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="lg" sx={{ py: 8, pt: 12 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ 
              color: '#ffffff', 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2,
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              Mein Profil 👤
            </Typography>
            <Typography variant="h5" sx={{ 
              color: 'rgba(255,255,255,0.8)',
              maxWidth: 800,
              mx: 'auto'
            }}>
              Hier findest du alle deine persönlichen Daten und Aktivitäten
            </Typography>
          </Box>
        </motion.div>

        {/* Message Alert */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setMessage('')}
            >
              {message}
            </Alert>
          </motion.div>
        )}

        <Grid container spacing={4}>
          {/* Linke Spalte - Profil-Informationen */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {/* Profil-Karte */}
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                mb: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700 }}>
                      Persönliche Informationen
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={isEditing ? <Save /> : <Edit />}
                      onClick={isEditing ? handleSave : () => setIsEditing(true)}
                      disabled={isLoading}
                      sx={{
                        borderColor: '#FFD700',
                        color: '#FFD700',
                        '&:hover': {
                          borderColor: '#FFA500',
                          color: '#FFA500',
                          bgcolor: 'rgba(255,215,0,0.1)'
                        }
                      }}
                    >
                      {isEditing ? 'Speichern' : 'Bearbeiten'}
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    {/* Name */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Name
                      </Typography>
                      {isEditing ? (
                        <TextField
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: 'rgba(255,255,255,0.9)',
                            }
                          }}
                        />
                      ) : (
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                          {profile.name}
                        </Typography>
                      )}
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        E-Mail
                      </Typography>
                      {isEditing ? (
                        <TextField
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: 'rgba(255,255,255,0.9)',
                            }
                          }}
                        />
                      ) : (
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                          {profile.email}
                        </Typography>
                      )}
                    </Grid>

                    {/* Telefon */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Telefon
                      </Typography>
                      {isEditing ? (
                        <TextField
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: 'rgba(255,255,255,0.9)',
                            }
                          }}
                        />
                      ) : (
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                          {profile.phone}
                        </Typography>
                      )}
                    </Grid>

                    {/* Standort */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Standort
                      </Typography>
                      {isEditing ? (
                        <TextField
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: 'rgba(255,255,255,0.9)',
                            }
                          }}
                        />
                      ) : (
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                          {profile.location}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>

                  {/* Bio */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                      Über mich
                    </Typography>
                    {isEditing ? (
                      <TextField
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        variant="outlined"
                        multiline
                        rows={3}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                          }
                        }}
                      />
                    ) : (
                      <Typography variant="body1" sx={{ color: '#ffffff', lineHeight: 1.6 }}>
                        {profile.bio}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Human Design Informationen */}
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                mb: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: '#FFD700', mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star size={24} />
                    Human Design Profil
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        HD-Typ
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        {profile.hdType || 'Nicht verfügbar'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Profil
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        {profile.hdProfile || 'Nicht verfügbar'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Strategie
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        {profile.hdStrategy || 'Nicht verfügbar'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Autorität
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        {profile.hdAuthority || 'Nicht verfügbar'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Geburtsdaten */}
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                mb: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: '#FFD700', mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={24} />
                    Geburtsdaten
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Geburtsdatum
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        {profile.birthDate || 'Nicht verfügbar'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Geburtszeit
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        {profile.birthTime || 'Nicht verfügbar'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Geburtsort
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        {profile.birthPlace || 'Nicht verfügbar'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Rechte Spalte - Aktivitäten und Statistiken */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {/* Aktivitäts-Statistiken */}
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                mb: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 3, fontWeight: 700, textAlign: 'center' }}>
                    📊 Meine Aktivitäten
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Moon size={20} style={{ color: '#FFD700' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Mond-Einträge
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, ml: 'auto' }}>
                        {profileData?.statistics.totalMoonEntries || 0}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Heart size={20} style={{ color: '#FFD700' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Matching-Analysen
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, ml: 'auto' }}>
                        {profileData?.statistics.totalMatchingAnalyses || 0}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <BookOpen size={20} style={{ color: '#FFD700' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Coaching-Sessions
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, ml: 'auto' }}>
                        {profileData?.statistics.totalCoachingSessions || 0}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Activity size={20} style={{ color: '#FFD700' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Letzte Aktivität
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600, ml: 'auto' }}>
                        {profileData?.statistics.lastActivity ? 
                          new Date(profileData.statistics.lastActivity).toLocaleDateString('de-DE') : 
                          'Heute'
                        }
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Letzte Mond-Einträge */}
              {profileData?.moonData && profileData.moonData.length > 0 && (
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  mb: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: '#FFD700', mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Moon size={20} />
                      Letzte Mond-Einträge
                    </Typography>
                    
                    <List dense>
                      {profileData.moonData.slice(0, 3).map((entry) => (
                        <ListItem key={entry.id} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Moon size={16} style={{ color: '#FFD700' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={entry.phase}
                            secondary={`${entry.date} - ${entry.notes}`}
                            sx={{
                              '& .MuiListItemText-primary': { color: '#ffffff', fontSize: '0.9rem' },
                              '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}

              {/* Letzte Matching-Analysen */}
              {profileData?.matchingHistory && profileData.matchingHistory.length > 0 && (
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  mb: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: '#FFD700', mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Heart size={20} />
                      Letzte Matching-Analysen
                    </Typography>
                    
                    <List dense>
                      {profileData.matchingHistory.slice(0, 3).map((match) => (
                        <ListItem key={match.id} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Heart size={16} style={{ color: '#FFD700' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${match.person2} (${match.score}%)`}
                            secondary={match.date}
                            sx={{
                              '& .MuiListItemText-primary': { color: '#ffffff', fontSize: '0.9rem' },
                              '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}

              {/* Letzte Coaching-Sessions */}
              {profileData?.coachingSessions && profileData.coachingSessions.length > 0 && (
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  mb: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: '#FFD700', mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BookOpen size={20} />
                      Letzte Coaching-Sessions
                    </Typography>
                    
                    <List dense>
                      {profileData.coachingSessions.slice(0, 3).map((session) => (
                        <ListItem key={session.id} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <BookOpen size={16} style={{ color: '#FFD700' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${session.coach} - ${session.type}`}
                            secondary={`${session.date} (${session.status})`}
                            sx={{
                              '& .MuiListItemText-primary': { color: '#ffffff', fontSize: '0.9rem' },
                              '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </AccessControl>
  );
}

// Hauptkomponente mit ProtectedRoute
export default function ProfilPage() {
  return (
    <ProtectedRoute requiredRole="basic">
      <ProfilContent />
    </ProtectedRoute>
  );
}
