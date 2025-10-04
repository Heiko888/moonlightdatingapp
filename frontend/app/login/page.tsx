"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, TextField, Button, Alert, CircularProgress, Container, Paper } from '@mui/material';
import { useLoadingState } from '@/lib/api/loading';
// import { supabase } from '@/lib/supabase/client'; // Temporär deaktiviert

interface LoginData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { isLoading, error, setLoading, setError, clearError } = useLoadingState(false);
  const [success, setSuccess] = useState<string>('');
  
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });

  // Keine automatische Weiterleitung - Benutzer kann sich jederzeit einloggen
  // useEffect(() => {
  //   // Automatische Weiterleitung entfernt, um Login-Probleme zu vermeiden
  // }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Fehler und Erfolg beim Eingeben zurücksetzen
    if (error) clearError();
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess('');
    
    if (!formData.email || !formData.password) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('🔄 Starte API Login...');
      
      // API-basierte Anmeldung (funktioniert)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const result = await response.json();
      console.log('📊 API Response:', result);

      if (result.success) {
        console.log('✅ API Login erfolgreich:', result.data.user.email);

        // Session-Daten in localStorage speichern
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('userId', result.data.user.id);
        localStorage.setItem('userEmail', result.data.user.email);
        localStorage.setItem('userPackage', result.data.user.package || 'free');
        console.log('💾 Session-Daten in localStorage gespeichert');

        // Erfolgsmeldung anzeigen
        setError('');
        setSuccess('✅ Login erfolgreich!');

        console.log('🔄 Weiterleitung zum Dashboard...');
        // Kurzer Delay um sicherzustellen, dass localStorage gesetzt ist
        setTimeout(() => {
          console.log('🚀 Navigiere zu /dashboard');
          router.push('/dashboard');
        }, 500);
      } else {
        console.error('API Login Fehler:', result);
        const errorMessage = result.error?.message || result.message || 'Anmeldung fehlgeschlagen';
        setError(errorMessage);
      }

    } catch (err) {
      console.error('Login-Fehler:', err);
      setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          🔐 HD App - Anmeldung
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
          Melden Sie sich in Ihrem Konto an
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            required
            fullWidth
            name="email"
            label="E-Mail-Adresse"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
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
            disabled={isLoading}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ 
              mb: 2,
              background: 'linear-gradient(45deg, #9C27B0, #673AB7)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7B1FA2, #512DA8)',
              }
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Anmelden'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Noch kein Konto?{' '}
              <Button 
                variant="text" 
                onClick={() => router.push('/register')}
                disabled={isLoading}
              >
                Registrieren
              </Button>
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button 
              variant="text" 
              onClick={() => router.push('/')}
              disabled={isLoading}
            >
              ← Zurück zur Startseite
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
