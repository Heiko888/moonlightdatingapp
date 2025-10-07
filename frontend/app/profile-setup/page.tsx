"use client";
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, Button, Card, CardContent, Alert, Stepper, Step, StepLabel, Grid, Avatar, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Heart, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SSRSafeStars from '../../components/SSRSafeStars';

interface ProfileData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  bio: string;
  interests: string[];
  relationshipGoal: string;
  photos: string[];
}

const steps = [
  'Persönliche Daten',
  'Geburtsdaten',
  'Über mich',
  'Beziehungsziele',
  'Fertig!'
];

const interests = [
  'Yoga & Meditation', 'Astrologie', 'Reisen', 'Musik', 'Kunst', 'Natur',
  'Spiritualität', 'Fitness', 'Kochen', 'Lesen', 'Fotografie', 'Tanz',
  'Wellness', 'Mystik', 'Heilung', 'Kreativität'
];

const relationshipGoals = [
  'Ernsthafte Beziehung',
  'Freundschaft',
  'Casual Dating',
  'Ehe',
  'Offene Beziehung',
  'Noch unentschieden'
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    bio: '',
    interests: [],
    relationshipGoal: '',
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Prüfe ob User eingeloggt ist
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
      // Keine Authentifizierung erforderlich - App ist öffentlich
      return;
    }

    // Prüfe ob Profileinrichtung bereits abgeschlossen ist
    const profileSetupCompleted = localStorage.getItem('profileSetupCompleted');
    if (profileSetupCompleted === 'true') {
      router.push('/dashboard');
      return;
    }

    // Lade vorhandene User-Daten
    try {
      const user = JSON.parse(userData);
      setProfileData(prev => ({
        ...prev,
        name: user.name || user.username || '',
        birthDate: user.birthDate || '',
        birthTime: user.birthTime || '',
        birthPlace: user.birthPlace || '',
        bio: user.bio || '',
        interests: user.interests || [],
        relationshipGoal: user.relationshipGoal || ''
      }));
    } catch (error) {
      console.error('Fehler beim Laden der User-Daten:', error);
    }
  }, [router]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string | string[]) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleInterest = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    setError('');

    try {
      // Speichere Profildaten
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const updatedUserData = {
        ...userData,
        ...profileData,
        profileSetupCompleted: true
      };

      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      localStorage.setItem('profileSetupCompleted', 'true');

      // Speichere Profildaten in Supabase
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
          });
          
          if (!response.ok) {
            console.warn('Profil-Update fehlgeschlagen, aber Setup wird fortgesetzt');
          }
        } catch (error) {
          console.warn('Profil-Update fehlgeschlagen:', error);
        }
      }

      console.log('✅ Profileinrichtung abgeschlossen');
      console.log('🔄 Weiterleitung zum Dashboard...');
      
      // Profil-Setup als abgeschlossen markieren
      localStorage.setItem('profileSetupCompleted', 'true');
      
      // Erfolgsmeldung anzeigen
      setSuccess('✅ Profil erfolgreich eingerichtet! Weiterleitung zum Dashboard...');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Fehler beim Speichern der Profildaten:', error);
      setError('Fehler beim Speichern. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: '#ff6b9d', mb: 3, textAlign: 'center' }}>
              Persönliche Daten
            </Typography>
            <TextField
              fullWidth
              label="Vollständiger Name"
              value={profileData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Geburtsort"
              value={profileData.birthPlace}
              onChange={(e) => handleInputChange('birthPlace', e.target.value)}
              placeholder="z.B. Berlin, Deutschland"
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: '#ff6b9d', mb: 3, textAlign: 'center' }}>
              Geburtsdaten für Human Design
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Geburtsdatum"
                  type="date"
                  value={profileData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Geburtszeit"
                  type="time"
                  value={profileData.birthTime}
                  onChange={(e) => handleInputChange('birthTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2, textAlign: 'center' }}>
              Diese Daten werden für dein Human Design Chart benötigt
            </Typography>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: '#ff6b9d', mb: 3, textAlign: 'center' }}>
              Über mich
            </Typography>
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={4}
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Erzähle etwas über dich..."
              sx={{ mb: 3 }}
            />
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
              Interessen (wähle bis zu 6 aus):
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {interests.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  onClick={() => toggleInterest(interest)}
                  color={profileData.interests.includes(interest) ? 'primary' : 'default'}
                  variant={profileData.interests.includes(interest) ? 'filled' : 'outlined'}
                  sx={{
                    color: profileData.interests.includes(interest) ? 'white' : 'rgba(255,255,255,0.8)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    background: profileData.interests.includes(interest) 
                      ? 'linear-gradient(135deg, #ff6b9d, #c44569)' 
                      : 'transparent',
                    '&:hover': {
                      borderColor: '#ff6b9d'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: '#ff6b9d', mb: 3, textAlign: 'center' }}>
              Beziehungsziele
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {relationshipGoals.map((goal) => (
                <Button
                  key={goal}
                  variant={profileData.relationshipGoal === goal ? 'contained' : 'outlined'}
                  onClick={() => handleInputChange('relationshipGoal', goal)}
                  sx={{
                    justifyContent: 'flex-start',
                    py: 2,
                    px: 3,
                    background: profileData.relationshipGoal === goal 
                      ? 'linear-gradient(135deg, #ff6b9d, #c44569)' 
                      : 'transparent',
                    color: profileData.relationshipGoal === goal ? 'white' : 'rgba(255,255,255,0.8)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: '#ff6b9d',
                      background: profileData.relationshipGoal === goal 
                        ? 'linear-gradient(135deg, #ff5a8a, #b83a5a)' 
                        : 'rgba(255, 107, 157, 0.1)'
                    }
                  }}
                >
                  <Heart size={20} style={{ marginRight: 12 }} />
                  {goal}
                </Button>
              ))}
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <motion.div
              
              
              
            >
              <Box sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                mb: 3,
                boxShadow: '0 0 30px rgba(255, 107, 157, 0.5)'
              }}>
                <CheckCircle size={50} color="white" />
              </Box>
            </motion.div>
            
            <Typography variant="h5" sx={{ color: '#ff6b9d', mb: 2 }}>
              Profil erfolgreich erstellt!
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
              Dein Profil ist jetzt bereit. Du kannst jederzeit in den Einstellungen Änderungen vornehmen.
            </Typography>
            
            <Button
              onClick={handleComplete}
              disabled={loading}
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                color: 'white',
                fontWeight: 'bold',
                py: 1.5,
                px: 4,
                borderRadius: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {loading ? 'Speichern...' : 'Zum Dashboard'}
              <ArrowRight size={20} style={{ marginLeft: 8 }} />
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      py: 4,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Stars Background */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}>
        <SSRSafeStars 
          count={20} 
          opacity={0.8}
        />
      </Box>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          
          
          
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ 
              background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold', 
              mb: 2,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              👤 Profil einrichten
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 1px 5px rgba(0,0,0,0.3)'
            }}>
              Lass uns dein Profil für die perfekte Human Design Erfahrung einrichten
            </Typography>
          </Box>

          {/* Stepper */}
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            mb: 4
          }}>
            <CardContent sx={{ p: 3 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel sx={{ 
                      '& .MuiStepLabel-label': { 
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.9rem'
                      }
                    }}>
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          {/* Content */}
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <CardContent sx={{ p: 6 }}>
              {/* Fehler-Anzeige */}
              {error && (
                <Alert severity="error" sx={{ 
                  mb: 3,
                  background: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  color: '#ffcdd2'
                }}>
                  {error}
                </Alert>
              )}

              {/* Erfolgs-Anzeige */}
              {success && (
                <Alert severity="success" sx={{ 
                  mb: 3,
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  color: '#c8e6c9'
                }}>
                  {success}
                </Alert>
              )}

              {/* Step Content */}
              {renderStepContent()}

              {/* Navigation */}
              {activeStep < steps.length - 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      '&:hover': { color: '#ff6b9d' }
                    }}
                  >
                    Zurück
                  </Button>
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                      color: 'white',
                      fontWeight: 'bold',
                      px: 4,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Weiter
                    <ArrowRight size={18} style={{ marginLeft: 8 }} />
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
