"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
  Chip,
  Avatar,
  IconButton,
  Divider,
  FormControlLabel,
  Switch,
  Slider,
  RadioGroup,
  Radio,
  FormLabel
} from '@mui/material';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Heart, Star, CheckCircle, Camera, Upload, Phone, Globe, Lock, Eye } from 'lucide-react';
import MultiImageUpload from '@/components/MultiImageUpload';

const steps = [
  'Persönliche Daten',
  'Dating-Fotos & Kontakt',
  'Geburtsdaten',
  'Interessen & Präferenzen',
  'Privatsphäre',
  'Fertig!'
];

export default function ProfilEinrichtenPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    website: '',
    location: '',
    profileImage: '',
    datingPhotos: [] as any[],
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    interests: [] as string[],
    bio: '',
    relationshipStatus: '',
    lookingFor: '',
    ageRange: [18, 65],
    maxDistance: 50,
    privacySettings: {
      showProfile: true,
      showBirthDate: false,
      showLocation: true,
      allowMessages: true,
      showOnlineStatus: true
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Gemeinsames Styling für alle Formularfelder
  const textFieldStyle = {
    '& .MuiInputLabel-root': {
      color: '#FFD700',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#FFA500',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#FFD700',
      },
      '&:hover fieldset': {
        borderColor: '#FFA500',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FFA500',
        borderWidth: '2px'
      }
    }
  };

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

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleInterestToggle = useCallback((interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  }, []);

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
        userData.phone = formData.phone;
        userData.website = formData.website;
        userData.location = formData.location;
        userData.profileImage = formData.profileImage;
        userData.datingPhotos = formData.datingPhotos;
        userData.birthDate = formData.birthDate;
        userData.birthTime = formData.birthTime;
        userData.birthPlace = formData.birthPlace;
        userData.interests = formData.interests;
        userData.bio = formData.bio;
        userData.relationshipStatus = formData.relationshipStatus;
        userData.lookingFor = formData.lookingFor;
        userData.ageRange = formData.ageRange;
        userData.maxDistance = formData.maxDistance;
        userData.privacySettings = formData.privacySettings;
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange('profileImage', result);
      };
      reader.readAsDataURL(file);
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
                sx={{ ...textFieldStyle, mb: 3 }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nachname"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                sx={{ ...textFieldStyle, mb: 3 }}
                required
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
                sx={{ ...textFieldStyle, mb: 3 }}
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
                sx={textFieldStyle}
                placeholder="Erzähle etwas über dich..."
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ 
                color: 'white', 
                mb: 2,
                fontWeight: 'bold',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Dating-Fotos
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, textAlign: 'center' }}>
                Lade bis zu 6 Fotos hoch für dein Dating-Profil. Das erste Foto wird als Hauptbild verwendet.
              </Typography>
              
              <MultiImageUpload
                userId={typeof window !== 'undefined' ? localStorage.getItem('userId') || 'user-demo' : 'user-demo'}
                existingImages={formData.datingPhotos}
                onImagesUpdate={(images) => {
                  setFormData(prev => ({ ...prev, datingPhotos: images }));
                }}
                maxImages={6}
                maxFileSize={5}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefon (optional)"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                sx={{ ...textFieldStyle, mb: 3 }}
                InputProps={{
                  startAdornment: <Phone size={20} style={{ marginRight: 8, color: '#FFA500' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website (optional)"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                sx={{ ...textFieldStyle, mb: 3 }}
                InputProps={{
                  startAdornment: <Globe size={20} style={{ marginRight: 8, color: '#FFA500' }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Standort"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="z.B. Berlin, Deutschland"
                sx={textFieldStyle}
                InputProps={{
                  startAdornment: <MapPin size={20} style={{ marginRight: 8, color: '#FFA500' }} />
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
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
                sx={{ ...textFieldStyle, mb: 3 }}
                required
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
                sx={{ ...textFieldStyle, mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Geburtsort"
                value={formData.birthPlace}
                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                placeholder="z.B. Berlin, Deutschland"
                sx={{ ...textFieldStyle, mb: 3 }}
                required
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
              Wähle deine Interessen (optional)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
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
            
            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ 
                    color: '#FFD700',
                    mb: 1,
                    '&.Mui-focused': { color: '#FFA500' }
                  }}>Beziehungsstatus</FormLabel>
                  <RadioGroup
                    value={formData.relationshipStatus}
                    onChange={(e) => handleInputChange('relationshipStatus', e.target.value)}
                  >
                    <FormControlLabel 
                      value="single" 
                      control={<Radio sx={{ 
                        color: '#FFD700',
                        '&.Mui-checked': { color: '#FFA500' }
                      }} />} 
                      label="Single" 
                      sx={{ color: 'white' }}
                    />
                    <FormControlLabel 
                      value="in-relationship" 
                      control={<Radio sx={{ 
                        color: '#FFD700',
                        '&.Mui-checked': { color: '#FFA500' }
                      }} />} 
                      label="In einer Beziehung" 
                      sx={{ color: 'white' }}
                    />
                    <FormControlLabel 
                      value="married" 
                      control={<Radio sx={{ 
                        color: '#FFD700',
                        '&.Mui-checked': { color: '#FFA500' }
                      }} />} 
                      label="Verheiratet" 
                      sx={{ color: 'white' }}
                    />
                    <FormControlLabel 
                      value="complicated" 
                      control={<Radio sx={{ 
                        color: '#FFD700',
                        '&.Mui-checked': { color: '#FFA500' }
                      }} />} 
                      label="Es ist kompliziert" 
                      sx={{ color: 'white' }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ 
                    color: '#FFD700',
                    mb: 1,
                    '&.Mui-focused': { color: '#FFA500' }
                  }}>Suche nach</FormLabel>
                  <RadioGroup
                    value={formData.lookingFor}
                    onChange={(e) => handleInputChange('lookingFor', e.target.value)}
                  >
                    <FormControlLabel 
                      value="friendship" 
                      control={<Radio sx={{ 
                        color: '#FFD700',
                        '&.Mui-checked': { color: '#FFA500' }
                      }} />} 
                      label="Freundschaft" 
                      sx={{ color: 'white' }}
                    />
                    <FormControlLabel 
                      value="relationship" 
                      control={<Radio sx={{ 
                        color: '#FFD700',
                        '&.Mui-checked': { color: '#FFA500' }
                      }} />} 
                      label="Beziehung" 
                      sx={{ color: 'white' }}
                    />
                    <FormControlLabel 
                      value="networking" 
                      control={<Radio sx={{ 
                        color: '#FFD700',
                        '&.Mui-checked': { color: '#FFA500' }
                      }} />} 
                      label="Networking" 
                      sx={{ color: 'white' }}
                    />
                    <FormControlLabel 
                      value="mentoring" 
                      control={<Radio sx={{ 
                        color: '#FFD700',
                        '&.Mui-checked': { color: '#FFA500' }
                      }} />} 
                      label="Mentoring" 
                      sx={{ color: 'white' }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Altersbereich für Matches
                </Typography>
                <Slider
                  value={formData.ageRange}
                  onChange={(_, newValue) => handleInputChange('ageRange', newValue)}
                  valueLabelDisplay="auto"
                  min={18}
                  max={80}
                  step={1}
                  sx={{
                    color: '#FFA500',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#FFD700',
                      '&:hover': {
                        backgroundColor: '#FFA500'
                      }
                    },
                    '& .MuiSlider-track': {
                      background: 'linear-gradient(90deg, #FFD700, #FFA500)'
                    }
                  }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                  {formData.ageRange[0]} - {formData.ageRange[1]} Jahre
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Maximale Entfernung für Matches
                </Typography>
                <Slider
                  value={formData.maxDistance}
                  onChange={(_, newValue) => handleInputChange('maxDistance', newValue)}
                  valueLabelDisplay="auto"
                  min={1}
                  max={200}
                  step={5}
                  sx={{
                    color: '#FFA500',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#FFD700',
                      '&:hover': {
                        backgroundColor: '#FFA500'
                      }
                    },
                    '& .MuiSlider-track': {
                      background: 'linear-gradient(90deg, #FFD700, #FFA500)'
                    }
                  }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                  {formData.maxDistance} km
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
              Privatsphäre-Einstellungen
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.privacySettings.showProfile}
                      onChange={(e) => handleInputChange('privacySettings', {
                        ...formData.privacySettings,
                        showProfile: e.target.checked
                      })}
                      sx={{ 
                        '& .MuiSwitch-switchBase': {
                          color: '#FFD700',
                          '&.Mui-checked': {
                            color: '#FFA500',
                            '& + .MuiSwitch-track': {
                              backgroundColor: '#FFA500'
                            }
                          }
                        }
                      }}
                    />
                  }
                  label="Profil öffentlich sichtbar"
                  sx={{ color: 'white' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.privacySettings.showBirthDate}
                      onChange={(e) => handleInputChange('privacySettings', {
                        ...formData.privacySettings,
                        showBirthDate: e.target.checked
                      })}
                      sx={{ 
                        '& .MuiSwitch-switchBase': {
                          color: '#FFD700',
                          '&.Mui-checked': {
                            color: '#FFA500',
                            '& + .MuiSwitch-track': {
                              backgroundColor: '#FFA500'
                            }
                          }
                        }
                      }}
                    />
                  }
                  label="Geburtsdatum anzeigen"
                  sx={{ color: 'white' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.privacySettings.showLocation}
                      onChange={(e) => handleInputChange('privacySettings', {
                        ...formData.privacySettings,
                        showLocation: e.target.checked
                      })}
                      sx={{ 
                        '& .MuiSwitch-switchBase': {
                          color: '#FFD700',
                          '&.Mui-checked': {
                            color: '#FFA500',
                            '& + .MuiSwitch-track': {
                              backgroundColor: '#FFA500'
                            }
                          }
                        }
                      }}
                    />
                  }
                  label="Standort anzeigen"
                  sx={{ color: 'white' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.privacySettings.allowMessages}
                      onChange={(e) => handleInputChange('privacySettings', {
                        ...formData.privacySettings,
                        allowMessages: e.target.checked
                      })}
                      sx={{ 
                        '& .MuiSwitch-switchBase': {
                          color: '#FFD700',
                          '&.Mui-checked': {
                            color: '#FFA500',
                            '& + .MuiSwitch-track': {
                              backgroundColor: '#FFA500'
                            }
                          }
                        }
                      }}
                    />
                  }
                  label="Nachrichten von anderen Benutzern erlauben"
                  sx={{ color: 'white' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.privacySettings.showOnlineStatus}
                      onChange={(e) => handleInputChange('privacySettings', {
                        ...formData.privacySettings,
                        showOnlineStatus: e.target.checked
                      })}
                      sx={{ 
                        '& .MuiSwitch-switchBase': {
                          color: '#FFD700',
                          '&.Mui-checked': {
                            color: '#FFA500',
                            '& + .MuiSwitch-track': {
                              backgroundColor: '#FFA500'
                            }
                          }
                        }
                      }}
                    />
                  }
                  label="Online-Status anzeigen"
                  sx={{ color: 'white' }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 5:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircle size={64} color="#22c55e" style={{ marginBottom: '1rem' }} />
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              Perfekt!
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
      background: '#000000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 2 }}>
        {/* Logo */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          mb: { xs: 3, md: 4 }
        }}>
          <Box sx={{ 
            position: 'relative',
            width: '100%',
            maxWidth: { xs: 250, sm: 350, md: 500 },
            height: { xs: 120, sm: 170, md: 240 }
          }}>
            <Image
              src="/images/connection-key-logo.png"
              alt="Connection Key Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority
              sizes="(max-width: 600px) 250px, (max-width: 960px) 350px, 500px"
            />
          </Box>
        </Box>

        {/* Header */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none'
              }}
            >
              Profil einrichten
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
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
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
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
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
                Weiter
              </Button>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
