"use client";
import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Card, CardContent, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { LogIn, User, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SSRSafeStars from '@/components/SSRSafeStars';
import { smartRedirect } from '../../lib/utils/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.email || !formData.password) {
        setError('Bitte füllen Sie alle Felder aus');
        return;
      }

      // Echte API-Aufruf an das Backend
      const response = await fetch('http://localhost:4001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Speichere Token und Benutzerdaten
        localStorage.setItem('token', data.token);
        localStorage.setItem('authToken', data.token); // Für Kompatibilität
        localStorage.setItem('userId', data.user?.id || data.userId || 'user-' + Date.now());
        
        // Lade vorhandene User-Daten oder erstelle neue
        const existingUserData = localStorage.getItem('userData');
        let userData;
        
        if (existingUserData) {
          userData = JSON.parse(existingUserData);
          // Aktualisiere nur die wichtigsten Felder
          userData.email = formData.email;
          userData.id = data.user?.id || data.userId || userData.id;
          userData.username = data.user?.username || userData.username;
          userData.name = data.user?.name || userData.name;
          // WICHTIG: Premium-Status aktualisieren
          userData.subscriptionPlan = data.user?.subscriptionPlan || userData.subscriptionPlan || 'basic';
          userData.subscriptionStatus = data.user?.subscriptionStatus || userData.subscriptionStatus || 'active';
        } else {
          // Neue User-Daten erstellen
          userData = {
            email: formData.email,
            id: data.user?.id || data.userId || 'user-' + Date.now(),
            username: data.user?.username || '',
            name: data.user?.name || '',
            subscriptionPlan: data.user?.subscriptionPlan || 'basic',
            subscriptionStatus: data.user?.subscriptionStatus || 'active'
          };
          // Profileinrichtung nur für wirklich neue User setzen
          const existingProfileSetup = localStorage.getItem('profileSetupCompleted');
          if (!existingProfileSetup) {
            localStorage.setItem('profileSetupCompleted', 'false');
          }
        }
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        console.log('✅ Login erfolgreich');
        console.log('🔍 User-Daten:', userData);
        console.log('💎 Premium-Status:', userData.subscriptionPlan);
        
        // Intelligente Weiterleitung basierend auf Benutzer-Berechtigungen
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        
        const targetPath = smartRedirect(redirect || undefined);
        console.log(`🚀 Weiterleitung nach Login: ${targetPath}`);
        router.push(targetPath);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login fehlgeschlagen');
      }
    } catch (err) {
      console.error('Login-Fehler:', err);
      setError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
      `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
          minSize={2} 
          maxSize={6} 
          opacity={0.8}
          animation={true}
        />
      </Box>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
      <motion.div
          initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <CardContent sx={{ p: 6 }}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Box sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    mb: 3,
                    boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)'
                  }}>
                    <LogIn size={40} color="#1a1a2e" />
          </Box>
                </motion.div>
                
          <Typography variant="h4" sx={{ 
                  color: '#FFD700', 
                  fontWeight: 'bold', 
                  mb: 1,
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}>
                  Anmelden
          </Typography>
                
                <Typography variant="body1" sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  textShadow: '0 1px 5px rgba(0,0,0,0.3)'
                }}>
                  Melden Sie sich in Ihrem Moonlight Account an
          </Typography>
        </Box>

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

              {/* Login-Formular */}
              <form onSubmit={handleSubmit}>
          <TextField 
                  fullWidth
            label="E-Mail" 
                  name="email"
            type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FFD700',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                    }
                  }}
            InputProps={{
                    startAdornment: <User size={20} style={{ marginRight: 8, color: 'rgba(255,255,255,0.7)' }} />
            }}
          />
          
          <TextField 
                  fullWidth
            label="Passwort" 
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  sx={{ 
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FFD700',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                    }
                  }}
            InputProps={{
                    startAdornment: <Lock size={20} style={{ marginRight: 8, color: 'rgba(255,255,255,0.7)' }} />
            }}
          />
          
          <Button 
            type="submit" 
                  fullWidth
            variant="contained" 
                  disabled={loading}
            sx={{ 
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    color: '#1a1a2e',
                    fontWeight: 'bold',
              py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FFA500, #FFD700)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(255, 215, 0, 0.6)'
                    },
                    '&:disabled': {
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.5)'
                    }
                  }}
                >
                  {loading ? 'Anmelden...' : 'Anmelden'}
          </Button>
        </form>

              {/* Registrierung-Link */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}>
                  Noch kein Account?{' '}
                  <Button 
                    variant="text" 
                    onClick={() => router.push('/register')}
                    sx={{ 
                      color: '#FFD700', 
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                      '&:hover': {
                        color: '#FFA500',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Jetzt registrieren
                  </Button>
                </Typography>
              </Box>
            </CardContent>
          </Card>
      </motion.div>
      </Container>
    </Box>
  );
}