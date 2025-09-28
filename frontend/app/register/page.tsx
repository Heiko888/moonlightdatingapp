"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, TextField, Button, Alert, CircularProgress, Container, Paper } from '@mui/material';
// Supabase-Client wird nicht mehr direkt verwendet - Backend-API wird verwendet

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    
    if (!formData.birthDate) {
      return 'Bitte geben Sie Ihr Geburtsdatum an.';
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          subscription: formData.subscription
        })
      });

      const result = await response.json();

      if (result.success) {
        // Registrierung erfolgreich
        setSuccess(true);
        
        // Nach 2 Sekunden zum Dashboard weiterleiten
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        // Fehler bei der Registrierung
        setError(result.error?.message || 'Registrierung fehlgeschlagen');
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
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          🎯 HD App - Registrierung
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
          Erstellen Sie Ihr Konto und entdecken Sie Ihr Human Design
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              required
              fullWidth
              name="firstName"
              label="Vorname"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={loading}
            />
            <TextField
              required
              fullWidth
              name="lastName"
              label="Nachname"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Box>

          <TextField
            required
            fullWidth
            name="email"
            label="E-Mail-Adresse"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <TextField
            required
            fullWidth
            name="password"
            label="Passwort"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            sx={{ mb: 2 }}
            helperText="Mindestens 6 Zeichen"
          />

          <TextField
            required
            fullWidth
            name="confirmPassword"
            label="Passwort bestätigen"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <TextField
            required
            fullWidth
            name="birthDate"
            label="Geburtsdatum"
            type="date"
            value={formData.birthDate}
            onChange={handleInputChange}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="birthTime"
            label="Geburtszeit (optional)"
            type="time"
            value={formData.birthTime}
            onChange={handleInputChange}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="birthPlace"
            label="Geburtsort (optional)"
            value={formData.birthPlace}
            onChange={handleInputChange}
            disabled={loading}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ 
              mb: 2,
              background: 'linear-gradient(45deg, #9C27B0, #673AB7)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7B1FA2, #512DA8)',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Konto erstellen'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Bereits ein Konto?{' '}
              <Button 
                variant="text" 
                onClick={() => router.push('/login')}
                disabled={loading}
              >
                Anmelden
              </Button>
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button 
              variant="text" 
              onClick={() => router.push('/')}
              disabled={loading}
            >
              ← Zurück zur Startseite
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
