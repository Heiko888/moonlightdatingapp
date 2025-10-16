"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress, 
  Container, 
  Paper,
  Grid,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { 
  CalendarToday, 
  AccessTime, 
  LocationOn, 
  Person, 
  Email, 
  Lock,
  Visibility,
  VisibilityOff,
  Star
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  subscription: 'free' | 'basic' | 'premium' | 'vip';
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    subscription: 'free'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Formatierung für Geburtsdatum dd/mm/yyyy
  const formatBirthDate = (value: string) => {
    // Entferne alle Nicht-Zahlen
    const numbers = value.replace(/\D/g, '');
    
    // Formatierung: dd/mm/yyyy
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatBirthDate(e.target.value);
    setFormData(prev => ({
      ...prev,
      birthDate: formattedValue
    }));
  };

  // Konvertierung von dd/mm/yyyy zu yyyy-mm-dd für API
  const convertBirthDateForAPI = (dateString: string) => {
    if (!dateString || dateString.length !== 10) return '';
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const validateForm = (): string | null => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      return 'Bitte füllen Sie alle Pflichtfelder aus.';
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Die Passwörter stimmen nicht überein.';
    }
    
    if (formData.password.length < 6) {
      return 'Das Passwort muss mindestens 6 Zeichen lang sein.';
    }
    
    if (!formData.birthDate || formData.birthDate.length !== 10) {
      return 'Bitte geben Sie Ihr Geburtsdatum im Format dd/mm/yyyy an.';
    }
    
    // Validierung des Datums
    const [day, month, year] = formData.birthDate.split('/');
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      return 'Bitte geben Sie ein gültiges Geburtsdatum ein.';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    
    try {
      // Echte API-Registrierung
      // Supabase Registrierung
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            birth_date: convertBirthDateForAPI(formData.birthDate),
            birth_time: formData.birthTime,
            birth_place: formData.birthPlace
          }
        }
      });

      if (error) {
        // Fehler bei der Registrierung
        setError(error.message || 'Registrierung fehlgeschlagen');
      } else {
        // Registrierung erfolgreich
        setSuccess(true);
        
        // Nach 2 Sekunden zur Profil-Einrichtung weiterleiten
        setTimeout(() => {
          router.push('/profile-setup');
        }, 2000);
      }

    } catch (err) {
      console.error('Registrierungsfehler:', err);
      setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main" gutterBottom>
            ✅ Registrierung erfolgreich!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Willkommen bei der HD App! Sie werden in Kürze zum Dashboard weitergeleitet.
          </Typography>
          <CircularProgress />
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Navigation */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}>
            <Typography
              onClick={() => router.push('/')}
              variant="h5"
              sx={{
                background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              💫 HD App
            </Typography>
            
            <Button
              onClick={() => router.push('/login')}
              variant="outlined"
              disabled={loading}
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#4ecdc4',
                  backgroundColor: 'rgba(78, 205, 196, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 15px rgba(78, 205, 196, 0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Anmelden
            </Button>
          </Box>
        </Container>
      </Box>
      
      <Container maxWidth="md" sx={{ pt: { xs: 14, md: 16 }, pb: 8, position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper elevation={8} sx={{ 
            p: { xs: 3, md: 6 }, 
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
          }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography variant="h2" sx={{ 
                background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' }
              }}>
                ✨ Registrierung
        </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}>
          Erstelle dein Konto und entdecke dein Human Design
        </Typography>
            </Box>

        {error && (
              <Alert severity="error" sx={{ mb: 4, background: 'rgba(244, 67, 54, 0.1)' }}>
            {error}
          </Alert>
        )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Persönliche Daten */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1, color: '#ff6b9d' }} />
                    Persönliche Daten
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="firstName"
              label="Vorname"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#ff6b9d' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiInputBase-input': { color: 'white' }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="lastName"
              label="Nachname"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#ff6b9d' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiInputBase-input': { color: 'white' }
                    }}
                  />
                </Grid>

                {/* Kontakt */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ mr: 1, color: '#4ecdc4' }} />
                    Kontakt
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="email"
            label="E-Mail-Adresse"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#4ecdc4' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiInputBase-input': { color: 'white' }
                    }}
                  />
                </Grid>

                {/* Passwort */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Lock sx={{ mr: 1, color: '#8b5cf6' }} />
                    Passwort
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="password"
            label="Passwort"
                    type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
            helperText="Mindestens 6 Zeichen"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiInputBase-input': { color: 'white' },
                      '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.6)' }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="confirmPassword"
            label="Passwort bestätigen"
                    type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiInputBase-input': { color: 'white' }
                    }}
                  />
                </Grid>

                {/* Geburtsdaten */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ mr: 1, color: '#f59e0b' }} />
                    Geburtsdaten
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="birthDate"
                    label="Geburtsdatum (dd/mm/yyyy)"
                    placeholder="dd/mm/yyyy"
            value={formData.birthDate}
                    onChange={handleBirthDateChange}
            disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      )
                    }}
                    helperText="Format: dd/mm/yyyy (z.B. 15/03/1990)"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#f59e0b' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiInputBase-input': { color: 'white' },
                      '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.6)' }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="birthTime"
            label="Geburtszeit (optional)"
            type="time"
            value={formData.birthTime}
            onChange={handleInputChange}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#f59e0b' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiInputBase-input': { color: 'white' }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
          <TextField
            fullWidth
            name="birthPlace"
            label="Geburtsort (optional)"
            value={formData.birthPlace}
            onChange={handleInputChange}
            disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#f59e0b' }
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiInputBase-input': { color: 'white' }
                    }}
                  />
                </Grid>

                {/* Subscription */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ mr: 1, color: '#ff6b9d' }} />
                    Abonnement wählen
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Abonnement</InputLabel>
                    <Select
                      value={formData.subscription}
                      onChange={(e) => setFormData(prev => ({ ...prev, subscription: e.target.value as any }))}
                      disabled={loading}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6b9d' }
                      }}
                    >
                      <MenuItem value="free">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label="Kostenlos" size="small" color="default" />
                          <Typography>Basis-Features</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="basic">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label="Basic" size="small" color="primary" />
                          <Typography>Erweiterte Features</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="premium">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label="Premium" size="small" color="secondary" />
                          <Typography>Alle Features</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="vip">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label="VIP" size="small" sx={{ background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)' }} />
                          <Typography>Premium + Coaching</Typography>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ 
                    px: 6,
                    py: 2.5,
                    background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    minWidth: { xs: '100%', sm: '300px' },
                    boxShadow: '0 10px 30px rgba(255, 107, 157, 0.4)',
              '&:hover': {
                      background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 15px 40px rgba(255, 107, 157, 0.5)'
              },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.3)'
                    },
                    transition: 'all 0.3s ease'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : '✨ Konto erstellen'}
          </Button>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
              Bereits ein Konto?{' '}
              <Button 
                variant="text" 
                onClick={() => router.push('/login')}
                disabled={loading}
                    sx={{ 
                      color: '#4ecdc4', 
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        color: '#3bb5b0',
                        background: 'rgba(78, 205, 196, 0.1)'
                      }
                    }}
              >
                Jetzt anmelden
              </Button>
            </Typography>

            <Button 
              variant="text" 
              onClick={() => router.push('/')}
              disabled={loading}
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      color: 'rgba(255,255,255,0.9)',
                      background: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
            >
              ← Zurück zur Startseite
            </Button>
          </Box>
        </Box>
      </Paper>
        </motion.div>
    </Container>
    </Box>
  );
};

export default RegisterPage;
