"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress, 
  Container, 
  Paper,
  InputAdornment,
  IconButton,
  Stack
} from '@mui/material';
import { 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { safeJsonParse, supabase } from '@/lib/supabase/client';
import Link from 'next/link';

interface LoginData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  
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
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Floating Stars Animation */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`,
              '@keyframes twinkle': {
                '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                '50%': { opacity: 1, transform: 'scale(1.2)' }
              }
            }}
          />
        ))}
      </Box>
      
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
              component={Link}
              href="/"
              variant="h5"
              sx={{
                background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              🔑 The Connection Key
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                href="/"
                variant="outlined"
                disabled={isLoading}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'rgba(78, 205, 196, 0.5)',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Home
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="outlined"
                disabled={isLoading}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
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
                Registrieren
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ pt: { xs: 14, md: 16 }, pb: 8, position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%' }}
        >
          <Paper 
            elevation={24} 
            sx={{ 
              p: { xs: 4, md: 6 },
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
            }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              align="center" 
              sx={{ 
                mb: 2,
                background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '0 0 30px rgba(78, 205, 196, 0.3)'
              }}
            >
              Anmeldung
            </Typography>
          
            <Typography 
              variant="h6" 
              align="center" 
              sx={{ 
                mb: 5, 
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Melde dich in deinem Konto an
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

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            name="email"
            label="E-Mail-Adresse"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                </InputAdornment>
              )
            }}
            sx={{ 
              mb: 3,
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

          <TextField
            required
            fullWidth
            name="password"
            label="Passwort"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
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
            sx={{ 
              mb: 4,
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ 
              mb: 4,
              px: 6,
              py: 2.5,
              background: 'linear-gradient(135deg, #4ecdc4, #0891b2)',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1rem',
              textTransform: 'none',
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(78, 205, 196, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #3bb5b0, #0779a1)',
                transform: 'translateY(-4px)',
                boxShadow: '0 15px 40px rgba(78, 205, 196, 0.5)'
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : '🔐 Anmelden'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
              Noch kein Konto?{' '}
              <Button 
                component={Link}
                href="/register"
                variant="text" 
                disabled={isLoading}
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
                Jetzt registrieren
              </Button>
            </Typography>

            <Button 
              component={Link}
              href="/"
              variant="text" 
              disabled={isLoading}
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

export default LoginPage;
