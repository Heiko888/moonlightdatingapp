"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
// import { UserSubscription } from '../../lib/subscription/types'; // Entfernt - nicht mehr benötigt
// import { SubscriptionService } from '../../lib/subscription/subscriptionService'; // Entfernt - nicht mehr benötigt
import { useRouter } from 'next/navigation';
// import UnifiedPageLayout from '../../components/UnifiedPageLayout'; // Entfernt - verwende Dating-Design
import Image from 'next/image';

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
  const [localLoading, setLocalLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);
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
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Temporärer Fix - useLoadingState Hook entfernt
  const isLoading = false;
  const error = null;
  const setGlobalLoading = (loading: boolean) => {};
  const setError = (err: string | null) => {};

  // Profil-Daten aus der SQLite-Datenbank laden
  const loadProfileData = React.useCallback(async () => {
    try {
      setLocalLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setLocalLoading(false);
        return;
      }

      // Lade echte Daten aus localStorage
      const storedUserData = localStorage.getItem('userData');
      const userEmail = localStorage.getItem('userEmail');
      const userPackage = localStorage.getItem('userPackage');
      
      let userData = null;
      
      if (storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          userData = { data: parsedData };
        } catch (e) {
          console.error('Fehler beim Parsen von userData:', e);
        }
      }
      
      // Wenn keine userData vorhanden, erstelle minimale Daten aus Login-Info
      if (!userData && userEmail) {
        // Generiere Namen aus Email (z.B. "max.mustermann@gmail.com" -> "Max Mustermann")
        const emailName = userEmail.split('@')[0];
        const nameParts = emailName.split(/[._-]/);
        const firstName = nameParts[0]?.charAt(0).toUpperCase() + nameParts[0]?.slice(1) || 'User';
        const lastName = nameParts[1]?.charAt(0).toUpperCase() + nameParts[1]?.slice(1) || '';
        
        userData = {
          data: {
            firstName,
            lastName,
            email: userEmail,
            phone: '',
            location: '',
            birthDate: '',
            birthTime: '',
            birthPlace: '',
            bio: 'Noch kein Profil ausgefüllt. Klicke auf "Bearbeiten" um dein Profil zu vervollständigen!',
            interests: [],
            website: '',
            hdType: '',
            hdProfile: '',
            hdStrategy: '',
            hdAuthority: ''
          }
        };
      }
      
      // Wenn immer noch keine Daten, Fallback auf Test-Daten
      if (!userData) {
        await loadTestData();
        setLocalLoading(false);
        return;
      }
      
      if (userData) {
        
        // Profil-Daten aus den echten API-Daten extrahieren
        setProfile(prev => ({
          ...prev,
          name: (userData.data?.firstName || '') + ' ' + (userData.data?.lastName || '') || 'Unbekannter Benutzer',
          email: userData.data?.email || '',
          phone: userData.data?.phone || '',
          location: userData.data?.location || '',
          birthDate: userData.data?.birthDate || '',
          birthTime: userData.data?.birthTime || '',
          birthPlace: userData.data?.birthPlace || '',
          description: userData.data?.bio || '',
          interests: userData.data?.interests || [],
          website: userData.data?.website || '',
          bio: userData.data?.bio || '',
          hdType: userData.data?.hdType || '',
          hdProfile: userData.data?.hdProfile || '',
          hdStrategy: userData.data?.hdStrategy || '',
          hdAuthority: userData.data?.hdAuthority || ''
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
              lastActivity: new Date().toISOString()
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
      console.log('✅ Ladezustand beendet');
      setLocalLoading(false);
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
  }, [router]);

  const loadUserSubscription = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        // Temporärer Fix - SubscriptionService entfernt
        // const subscription = await SubscriptionService.getUserSubscription(user.id);
        const subscription = null;
        setUserSubscription(subscription);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Subscription:', error);
    }
  };

  useEffect(() => {
    setFormData(profile);
  }, [profile.name, profile.email, profile.phone, profile.location, profile.bio]);

  // Test-Daten aus der Datenbank laden
  const loadTestData = async () => {
    try {
      console.log('🔄 Lade Test-Daten...');
      // Fallback auf statische Test-Daten
      setProfile(prev => ({
        ...prev,
        name: 'Test Benutzer',
        email: 'test@example.com',
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
      
      // Setze auch die Profil-Daten für die Anzeige
      setProfileData({
        user: {
          id: 'test-user',
          firstName: 'Test',
          lastName: 'Benutzer',
          email: 'test@example.com'
        },
        hdChart: {
          type: 'Generator',
          profile: '2/4'
        },
        moonData: [],
        matchingHistory: [],
        coachingSessions: [],
        statistics: {
          totalMoonEntries: 0,
          totalMatchingAnalyses: 0,
          totalCoachingSessions: 0,
          lastActivity: new Date().toISOString()
        }
      });
      
      console.log('✅ Test-Daten geladen');
      
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
    setGlobalLoading(true);
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

      // Temporärer Fix - apiService entfernt
      // const response = await apiService.updateUserProfile(userId, updateData);
      const response = { success: true, data: updateData };

      if (response.success) {
        console.log('Profil erfolgreich aktualisiert:', response.data);
        
        // Aktualisiere lokalen State
        setProfile(formData);
        
        // Speichere auch in localStorage
        const storedUserData = localStorage.getItem('userData');
        let userData: any = {};
        
        if (storedUserData) {
          try {
            userData = JSON.parse(storedUserData);
          } catch (e) {
            console.error('Fehler beim Parsen von userData:', e);
          }
        }
        
        // Namen splitten
        const nameParts = formData.name.split(' ');
        userData.firstName = nameParts[0] || '';
        userData.lastName = nameParts.slice(1).join(' ') || '';
        userData.email = formData.email;
        userData.phone = formData.phone;
        userData.location = formData.location;
        userData.birthDate = formData.birthDate;
        userData.birthTime = formData.birthTime;
        userData.birthPlace = formData.birthPlace;
        userData.bio = formData.bio;
        userData.website = formData.website;
        userData.interests = formData.interests;
        userData.profileImage = profileImage || imagePreview;
        
        // Speichere zurück in localStorage
        try {
          localStorage.setItem('userData', JSON.stringify(userData));
          console.log('✅ Profildaten in localStorage gespeichert');
        } catch (e) {
          console.error('Fehler beim Speichern in localStorage:', e);
        }
        
        setIsEditing(false);
        setMessage('✅ Profil erfolgreich aktualisiert!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Fehler beim Speichern des Profils');
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Profils:', error);
      setMessage('Fehler beim Speichern des Profils');
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleInputChange = React.useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        // In einer echten App würde hier der Upload stattfinden
        setProfileImage(result);
        localStorage.setItem('profileImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Lade Profilbild aus localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
    
    // Lade auch Profildaten für Bio etc.
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        if (parsedData.profileImage) {
          setProfileImage(parsedData.profileImage);
        }
      } catch (e) {
        console.error('Fehler beim Laden der Profildaten:', e);
      }
    }
  }, []);

  // const handleInterestToggle = (interest: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     interests: prev.interests.includes(interest)
  //       ? prev.interests.filter(i => i !== interest)
  //       : [...prev.interests, interest]
  //   }));
  // };

  if (localLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress 
            size={70}
            thickness={4}
            sx={{ 
              color: '#e8b86d',
              mb: 3,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
          <Typography variant="h6" sx={{ 
            color: '#e8b86d',
            fontWeight: 600
          }}>
            Lade Profil-Daten...
          </Typography>
        </Box>
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
        background: '#02000D'
      }}>
        {/* Header (ohne Logo) */}
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: '#02000D',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(242, 159, 5, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
        }}>
          <Container maxWidth="lg">
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1
            }}>
              <Box sx={{ position: 'relative', width: { xs: 140, md: 200 }, height: { xs: 36, md: 48 } }}>
                <Image
                  src="/images/Design%20ohne%20Titel%2815%29.png"
                  alt="The Connection Key Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
              <Box>
                <Button
                  href="/dashboard"
                  variant="outlined"
                  sx={{
                    borderColor: '#F29F05',
                    color: '#F29F05',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    mr: 1.5,
                    '&:hover': {
                      borderColor: '#8C1D04',
                      backgroundColor: 'rgba(242, 159, 5, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  href="/profil"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(242, 159, 5, 0.35)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(242, 159, 5, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Profil
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ pt: { xs: 12, md: 15 }, pb: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
          {/* Logo entfernt */}

          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Mein Profil
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontWeight: 300,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Hier findest du alle deine persönlichen Daten und Aktivitäten
            </Typography>
          </Box>

        {/* Message Alert */}
        {message && (
          <Alert 
            severity="success" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Linke Spalte - Profil-Informationen */}
          <Grid item xs={12} lg={8}>
              {/* Profilbild-Karte */}
              <Card sx={{ 
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
                mb: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
                    {/* Profilbild */}
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          width: 150,
                          height: 150,
                          borderRadius: '50%',
                          background: profileImage || imagePreview 
                            ? `url(${imagePreview || profileImage}) center/cover`
                            : 'linear-gradient(135deg, #F29F05, #8C1D04)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3rem',
                          fontWeight: 'bold',
                          color: 'white',
                          border: '4px solid rgba(255,255,255,0.2)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {!profileImage && !imagePreview && (
                          <Box>{profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}</Box>
                        )}
                      </Box>
                      
                      {/* Upload Button */}
                      {isEditing && (
                        <label htmlFor="profile-image-upload">
                          <input
                            id="profile-image-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                          />
                          <Button
                            component="span"
                            variant="contained"
                            size="small"
                            sx={{
                              position: 'absolute',
                              bottom: 5,
                              right: 5,
                              minWidth: 'auto',
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                              }
                            }}
                          >
                            📷
                          </Button>
                        </label>
                      )}
                    </Box>

                    {/* Name und Basis-Info */}
                    <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' }, flexWrap: 'wrap' }}>
                        <Typography variant="h3" sx={{ 
                          fontWeight: 'bold',
                          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>
                          {profile.name}
                        </Typography>
                        {/* Package Badge */}
                        {(() => {
                          const subscription = localStorage.getItem('userSubscription') || localStorage.getItem('user-subscription');
                          let packageId = 'free';
                          if (subscription) {
                            try {
                              const parsed = JSON.parse(subscription);
                              packageId = parsed.packageId || 'free';
                            } catch (e) {}
                          }
                          
                          const badges = {
                            vip: { icon: '👑', label: 'VIP', color: '#FFD700', bg: 'linear-gradient(135deg, #FFD700, #FFA500)' },
                            premium: { icon: '💎', label: 'Premium', color: '#4ecdc4', bg: 'linear-gradient(135deg, #4ecdc4, #2a9d8f)' },
                            basic: { icon: '⭐', label: 'Basic', color: '#ff6b9d', bg: 'linear-gradient(135deg, #ff6b9d, #ff8fab)' },
                            free: { icon: '🌙', label: 'Kostenlos', color: '#9ca3af', bg: 'linear-gradient(135deg, #6b7280, #9ca3af)' }
                          };
                          
                          const badge = badges[packageId as keyof typeof badges] || badges.free;
                          
                          return (
                            <Box sx={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.5,
                              px: 2,
                              py: 0.5,
                              borderRadius: 3,
                              background: badge.bg,
                              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                              fontWeight: 'bold',
                              fontSize: '0.9rem',
                              color: 'white'
                            }}>
                              <span>{badge.icon}</span>
                              <span>{badge.label}</span>
                            </Box>
                          );
                        })()}
                      </Box>
                      <Typography variant="h6" sx={{ color: '#FFD700', mb: 1, mt: 1, fontWeight: 600 }}>
                        {profile.hdType ? `${profile.hdType} ${profile.hdProfile}` : 'Human Design Profil'}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {profile.location || 'Standort nicht angegeben'}
                      </Typography>
                    </Box>

                    {/* Edit Button */}
                    <Button
                      variant="outlined"
                      startIcon={isEditing ? <Save /> : <Edit />}
                      onClick={isEditing ? handleSave : () => setIsEditing(true)}
                      disabled={isLoading}
                      sx={{
                        borderColor: 'rgba(242, 159, 5, 0.30)',
                        color: '#F29F05',
                        fontWeight: 600,
                        px: 3,
                        borderRadius: 3,
                        '&:hover': {
                          borderColor: '#8C1D04',
                          backgroundColor: 'rgba(242, 159, 5, 0.10)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      {isEditing ? 'Speichern' : 'Bearbeiten'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Paket-Status Karte */}
              {(() => {
                const subscription = localStorage.getItem('userSubscription') || localStorage.getItem('user-subscription');
                let packageData = { packageId: 'free', validUntil: null };
                if (subscription) {
                  try {
                    packageData = JSON.parse(subscription);
                  } catch (e) {}
                }
                
                const packages = {
                  vip: { 
                    icon: '👑', 
                    label: 'VIP Mitglied', 
                    color: '#FFD700', 
                    bg: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.1))',
                    features: ['Unbegrenzte Chart-Analysen', 'Persönlicher Coach', 'Alle Premium-Features', 'VIP-Community Zugang']
                  },
                  premium: { 
                    icon: '💎', 
                    label: 'Premium Mitglied', 
                    color: '#4ecdc4', 
                    bg: 'linear-gradient(135deg, rgba(78,205,196,0.2), rgba(42,157,143,0.1))',
                    features: ['Erweiterte Analysen', 'Partnermatchings', 'Mondphasen-Tracking', 'Priority Support']
                  },
                  basic: { 
                    icon: '⭐', 
                    label: 'Basic Mitglied', 
                    color: '#ff6b9d', 
                    bg: 'linear-gradient(135deg, rgba(255,107,157,0.2), rgba(255,143,171,0.1))',
                    features: ['Basis Chart-Analyse', 'Tageshoroskop', 'Community Zugang']
                  },
                  free: { 
                    icon: '🌙', 
                    label: 'Kostenloses Konto', 
                    color: '#9ca3af', 
                    bg: 'linear-gradient(135deg, rgba(107,114,128,0.2), rgba(156,163,175,0.1))',
                    features: ['Basis-Profil', 'Eingeschränkte Features']
                  }
                };
                
                const pkg = packages[packageData.packageId as keyof typeof packages] || packages.free;
                
                return (
                  <Card sx={{ 
                    background: pkg.bg,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${pkg.color}40`,
                    borderRadius: 4,
                    mb: 4,
                    boxShadow: `0 8px 32px ${pkg.color}20`
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                            <span style={{ fontSize: '2rem' }}>{pkg.icon}</span>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                              {pkg.label}
                            </Typography>
                          </Box>
                          {packageData.validUntil && (
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Gültig bis: {new Date(packageData.validUntil).toLocaleDateString('de-DE')}
                            </Typography>
                          )}
                        </Box>
                        <Button
                          variant="contained"
                          href="/pricing"
                          sx={{
                            background: `linear-gradient(135deg, ${pkg.color}, ${pkg.color}dd)`,
                            color: 'white',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            borderRadius: 3,
                            boxShadow: `0 4px 15px ${pkg.color}40`,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${pkg.color}dd, ${pkg.color}bb)`,
                              transform: 'translateY(-2px)',
                              boxShadow: `0 6px 20px ${pkg.color}50`
                            }
                          }}
                        >
                          Paket verwalten
                        </Button>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, mb: 0.5 }}>
                          Deine Vorteile:
                        </Typography>
                        {pkg.features.map((feature, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 6, 
                              height: 6, 
                              borderRadius: '50%', 
                              background: pkg.color 
                            }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Persönliche Informationen Karte */}
              <Card sx={{ 
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
                mb: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 700, mb: 3 }}>
                    Persönliche Informationen
                  </Typography>

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
                              backgroundColor: 'rgba(255,255,255,0.25)',
                              color: 'white'
                            }
                          }}
                        />
                      ) : (
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>
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
                              backgroundColor: 'rgba(255,255,255,0.25)',
                              color: 'white'
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
                              backgroundColor: 'rgba(255,255,255,0.25)',
                              color: 'white'
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
                              backgroundColor: 'rgba(255,255,255,0.25)',
                              color: 'white'
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
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
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
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
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
          </Grid>

          {/* Rechte Spalte - Aktivitäten und Statistiken */}
          <Grid item xs={12} lg={4}>
              {/* Aktivitäts-Statistiken */}
              <Card sx={{ 
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
                mb: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 3, fontWeight: 700, textAlign: 'center' }}>
                    Meine Aktivitäten
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

              {/* Profil-Vollständigkeit */}
              {(() => {
                const userData = localStorage.getItem('userData');
                const profileImage = localStorage.getItem('profileImage');
                const datingPhotos = userData ? JSON.parse(userData).datingPhotos || [] : [];
                
                let completedSteps = 0;
                let totalSteps = 5;
                const missingSteps = [];
                
                // Check welche Schritte fehlen
                if (profile.name && profile.name !== 'Unbekannter Benutzer') completedSteps++;
                else missingSteps.push('Name eingeben');
                
                if (profile.email) completedSteps++;
                else missingSteps.push('E-Mail bestätigen');
                
                if (profile.birthDate && profile.birthTime && profile.birthPlace) completedSteps++;
                else missingSteps.push('Geburtsdaten vervollständigen');
                
                if (profileImage || datingPhotos.length > 0) completedSteps++;
                else missingSteps.push('Fotos hochladen');
                
                if (profile.bio && profile.bio.length > 50) completedSteps++;
                else missingSteps.push('Bio schreiben');
                
                const percentage = Math.round((completedSteps / totalSteps) * 100);
                const isComplete = percentage === 100;
                
                return (
                  <Card sx={{ 
                    background: isComplete 
                      ? 'linear-gradient(135deg, rgba(78,205,196,0.2), rgba(42,157,143,0.1))'
                      : 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: isComplete 
                      ? '1px solid rgba(78,205,196,0.3)' 
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    mb: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                        Profil-Vollständigkeit
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {completedSteps} von {totalSteps} Schritten
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 700 }}>
                            {percentage}%
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          width: '100%', 
                          height: 8, 
                          background: 'rgba(255,255,255,0.1)', 
                          borderRadius: 4,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{ 
                            width: `${percentage}%`, 
                            height: '100%', 
                            background: isComplete 
                              ? 'linear-gradient(90deg, #4ecdc4, #2a9d8f)'
                : 'linear-gradient(90deg, #F29F05, #8C1D04)',
                            transition: 'width 0.3s ease'
                          }} />
                        </Box>
                      </Box>
                      
                      {isComplete ? (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          p: 2,
                          background: 'rgba(78,205,196,0.2)',
                          borderRadius: 2,
                          border: '1px solid rgba(78,205,196,0.3)'
                        }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                            Dein Profil ist vollständig!
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                            Noch {missingSteps.length} Schritt{missingSteps.length !== 1 ? 'e' : ''} fehlen:
                          </Typography>
                          {missingSteps.slice(0, 3).map((step, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ 
                                width: 4, 
                                height: 4, 
                                borderRadius: '50%', 
                              background: '#F29F05' 
                              }} />
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                                {step}
                              </Typography>
                            </Box>
                          ))}
                          <Button
                            variant="outlined"
                            href={missingSteps.includes('Fotos hochladen') ? '/profil-einrichten' : '#'}
                            onClick={!missingSteps.includes('Fotos hochladen') ? () => setIsEditing(true) : undefined}
                            sx={{
                              mt: 1,
                              borderColor: 'rgba(255,107,157,0.3)',
                              color: '#ff6b9d',
                              fontSize: '0.85rem',
                              py: 0.5,
                              '&:hover': {
                                borderColor: '#ff6b9d',
                                background: 'rgba(255,107,157,0.1)'
                              }
                            }}
                          >
                            Jetzt vervollständigen →
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Schnellaktionen */}
              <Card sx={{ 
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
                mb: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    Schnellaktionen
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Button
                      variant="outlined"
                      href="/friends"
                      startIcon={<Heart size={18} />}
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#ff6b9d',
                          background: 'rgba(255,107,157,0.1)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <span>Matches</span>
                        <Box sx={{ 
                          background: '#ff6b9d', 
                          color: 'white', 
                          px: 1, 
                          py: 0.25, 
                          borderRadius: 2,
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          Neu
                        </Box>
                      </Box>
                    </Button>
                    
                    <Button
                      variant="outlined"
                      href="/resonanzanalyse"
                      startIcon={<BookOpen size={18} />}
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#4ecdc4',
                          background: 'rgba(78,205,196,0.1)'
                        }
                      }}
                    >
                      Neue Analyse starten
                    </Button>
                    
                    <Button
                      variant="outlined"
                      href="/moon-cycles"
                      startIcon={<Moon size={18} />}
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#FFD700',
                          background: 'rgba(255,215,0,0.1)'
                        }
                      }}
                    >
                      Aktuelle Mondphase
                    </Button>
                    
                    <Button
                      variant="outlined"
                      href="/pricing"
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        borderColor: 'rgba(255,215,0,0.3)',
                        color: '#FFD700',
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#FFD700',
                          background: 'rgba(255,215,0,0.1)'
                        }
                      }}
                    >
                      Paket upgraden
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* HD-Tipp des Tages */}
              {(() => {
                const hdType = profile.hdType || 'Generator';
                const tips = {
                  'Generator': {
                    icon: '🔋',
                    title: 'Warte auf die Antwort',
                    text: 'Als Generator bist du heute besonders kraftvoll. Höre auf dein Sakral und warte auf die richtige Antwort, bevor du handelst.',
                    color: '#ff6b9d'
                  },
                  'Manifestor': {
                    icon: '⚡',
                    title: 'Informiere andere',
                    text: 'Als Manifestor hast du heute die Kraft, Dinge in Gang zu setzen. Vergiss nicht, andere zu informieren, bevor du handelst.',
                    color: '#FFD700'
                  },
                  'Projektor': {
                    icon: '🎯',
                    title: 'Warte auf Einladung',
                    text: 'Als Projektor ist heute ein guter Tag, um auf Einladungen zu warten. Deine Weisheit wird gebraucht und anerkannt.',
                    color: '#4ecdc4'
                  },
                  'Reflektor': {
                    icon: '🌙',
                    title: 'Beobachte & Reflektiere',
                    text: 'Als Reflektor spiegelst du heute besonders klar. Nimm dir Zeit, die Energien um dich herum zu beobachten.',
                    color: '#9ca3af'
                  }
                };
                
                const tip = tips[hdType as keyof typeof tips] || tips.Generator;
                
                return (
                  <Card sx={{ 
                    background: `linear-gradient(135deg, ${tip.color}15, ${tip.color}05)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${tip.color}40`,
                    borderRadius: 4,
                    mb: 4,
                    boxShadow: `0 8px 32px ${tip.color}20`
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <span style={{ fontSize: '2rem' }}>{tip.icon}</span>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>
                            DEIN HD-TIPP HEUTE
                          </Typography>
                          <Typography variant="h6" sx={{ color: tip.color, fontWeight: 700, lineHeight: 1.2 }}>
                            {tip.title}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, mb: 2 }}>
                        {tip.text}
                      </Typography>
                      
                      <Button
                        variant="text"
                        href="/resonanzanalyse"
                        sx={{
                          color: tip.color,
                          fontSize: '0.85rem',
                          p: 0,
                          minWidth: 'auto',
                          '&:hover': {
                            background: 'transparent',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Mehr über deinen Typ erfahren →
                      </Button>
                    </CardContent>
                  </Card>
                );
              })()}

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
    <ProfilContent />
  );
}
