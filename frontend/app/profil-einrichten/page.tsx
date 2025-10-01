"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Heart, Star, CheckCircle } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';

const steps = [
  'Persönliche Daten',
  'Geburtsdaten',
  'Interessen',
  'Fertig!'
];

export default function ProfilEinrichtenPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    interests: [] as string[],
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const interestOptions = [
    'Human Design',
    'Astrologie',
    'Spiritualität',
    'Meditation',
    'Yoga',
    'Beziehungen',
    'Persönlichkeitsentwicklung',
    'Coaching',
    'Therapie',
    'Kreativität',
    'Musik',
    'Kunst',
    'Natur',
    'Reisen'
  ];

  useEffect(() => {
    // Lade vorhandene User-Daten
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setFormData(prev => ({
          ...prev,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          birthDate: user.birthDate || '',
          birthTime: user.birthTime || '',
          birthPlace: user.birthPlace || ''
        }));
      } catch (error) {
        console.error('Fehler beim Laden der User-Daten:', error);
      }
    }
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

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

  const handleComplete = async () => {
    setLoading(true);
    setError('');

    try {
      // Lade vorhandene User-Daten
      const existingUserData = localStorage.getItem('userData');
      let userData;
      
      if (existingUserData) {
        userData = JSON.parse(existingUserData);
        // Aktualisiere die Daten
        userData.firstName = formData.firstName;
        userData.lastName = formData.lastName;
        userData.birthDate = formData.birthDate;
        userData.birthTime = formData.birthTime;
        userData.birthPlace = formData.birthPlace;
        userData.interests = formData.interests;
        userData.bio = formData.bio;
        userData.name = `${formData.firstName} ${formData.lastName}`.trim();
      }

      // Speichere aktualisierte Daten
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Markiere Profileinrichtung als abgeschlossen
      localStorage.setItem('profileSetupCompleted', 'true');

      console.log('✅ Profil erfolgreich eingerichtet');

      // Weiterleitung basierend auf Premium-Status
      const currentPlan = userData?.subscriptionPlan || 'basic';
      let redirectPath = '/dashboard';
      
      if (currentPlan === 'premium') {
        redirectPath = '/premium-dashboard';
      } else if (currentPlan === 'vip') {
        redirectPath = '/dashboard-vip';
      } else if (currentPlan === 'admin') {
        redirectPath = '/admin';
      }

      router.push(redirectPath);
    } catch (error) {
      console.error('Fehler beim Speichern des Profils:', error);
      setError('Fehler beim Speichern des Profils. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vorname"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nachname"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="E-Mail"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio (optional)"
                multiline
                rows={4}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Erzähle etwas über dich..."
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Geburtsdatum"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Geburtszeit"
                type="time"
                value={formData.birthTime}
                onChange={(e) => handleInputChange('birthTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Geburtsort"
                value={formData.birthPlace}
                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                placeholder="z.B. Berlin, Deutschland"
                sx={{ mb: 3 }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
              Wähle deine Interessen (optional)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {interestOptions.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  clickable
                  color={formData.interests.includes(interest) ? 'primary' : 'default'}
                  onClick={() => handleInterestToggle(interest)}
                  sx={{
                    mb: 1,
                    backgroundColor: formData.interests.includes(interest) 
                      ? 'rgba(255, 215, 0, 0.2)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: formData.interests.includes(interest) 
                      ? '#FFD700' 
                      : 'white',
                    border: formData.interests.includes(interest) 
                      ? '1px solid #FFD700' 
                      : '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: formData.interests.includes(interest) 
                        ? 'rgba(255, 215, 0, 0.3)' 
                        : 'rgba(255, 255, 255, 0.2)',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircle size={64} color="#22c55e" style={{ marginBottom: '1rem' }} />
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              🎉 Perfekt!
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
              Dein Profil ist jetzt vollständig eingerichtet. Du kannst jetzt alle Features der App nutzen!
            </Typography>
            <Alert severity="success" sx={{ mb: 3 }}>
              Profil erfolgreich erstellt! Du wirst jetzt zu deinem Dashboard weitergeleitet.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                mb: 2,
                fontWeight: 800,
                textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
              }}
            >
              👤 Profil einrichten
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Lass uns dein Profil vervollständigen, damit du alle Features nutzen kannst
            </Typography>
          </Box>
        </motion.div>

        {/* Stepper */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            mb: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          color: 'white',
                          fontSize: '0.9rem'
                        },
                        '& .MuiStepIcon-root': {
                          color: 'rgba(255, 255, 255, 0.3)',
                          '&.Mui-active': {
                            color: '#FFD700'
                          },
                          '&.Mui-completed': {
                            color: '#22c55e'
                          }
                        }
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step Content */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            mb: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              {renderStepContent(activeStep)}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          
          
          
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: '#FFD700',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)'
                }
              }}
            >
              Zurück
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleComplete}
                disabled={loading}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)'
                  }
                }}
              >
                {loading ? 'Speichere...' : 'Profil abschließen'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
                  }
                }}
              >
                Weiter
              </Button>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
