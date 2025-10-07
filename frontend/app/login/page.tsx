"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, TextField, Button, Alert, CircularProgress, Container, Paper } from '@mui/material';
import { safeJsonParse, supabase } from '@/lib/supabase/client';

interface LoginData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
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
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.email || !formData.password) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('🔄 Starte API Login...');
      
      // Supabase-basierte Anmeldung
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        console.error('Supabase Login Fehler:', error);
        setError(error.message || 'Anmeldung fehlgeschlagen');
      } else {
        console.log('✅ Supabase Login erfolgreich:', data.user?.email);

        // Session-Daten in localStorage speichern
        localStorage.setItem('token', data.session?.access_token || '');
        localStorage.setItem('userId', data.user?.id || '');
        localStorage.setItem('userEmail', data.user?.email || '');
        localStorage.setItem('userPackage', data.user?.user_metadata?.package || 'free');
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
      }

    } catch (err) {
      console.error('Login-Fehler:', err);
      setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
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
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper 
          elevation={24} 
          sx={{ 
            p: 6,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 4,
              background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.5rem' },
              textShadow: '0 0 30px rgba(255, 107, 157, 0.3)'
            }}
          >
            🔐 HD App - Anmeldung
          </Typography>
        
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            mb: 3, 
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1.1rem'
          }}
        >
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
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                color: 'white',
                '&:hover': {
                  border: '1px solid rgba(255,255,255,0.2)'
                },
                '&.Mui-focused': {
                  border: '1px solid #ff6b9d'
                }
              },
              '& .MuiInputBase-input': {
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.7)'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#ff6b9d'
                }
              }
            }}
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
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                color: 'white',
                '&:hover': {
                  border: '1px solid rgba(255,255,255,0.2)'
                },
                '&.Mui-focused': {
                  border: '1px solid #ff6b9d'
                }
              },
              '& .MuiInputBase-input': {
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.7)'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#ff6b9d'
                }
              }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ 
              mb: 2,
              background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.1rem',
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(45deg, #e55a8a, #3bb5b0)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)'
              },
              '&:disabled': {
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)'
              }
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Anmelden'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Noch kein Konto?{' '}
              <Button 
                variant="text" 
                onClick={() => router.push('/register')}
                disabled={isLoading}
                sx={{
                  color: '#ff6b9d',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(255, 107, 157, 0.1)',
                    color: '#e55a8a'
                  }
                }}
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
              sx={{
                color: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white'
                }
              }}
            >
              ← Zurück zur Startseite
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
    </Box>
  );
};

export default LoginPage;
