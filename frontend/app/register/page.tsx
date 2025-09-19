"use client";
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, Button, Card, CardContent, Alert, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, Mail, Crown, Zap, Star } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import AnimatedStars from '../../components/AnimatedStars';
import AnimatedMoon from '../../components/AnimatedMoon';
import { smartRedirect } from '../../lib/utils/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('basic');

  // Plan aus URL-Parameter lesen
  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan && ['basic', 'premium', 'vip'].includes(plan)) {
      setSelectedPlan(plan);
    }
  }, [searchParams]);

  // Plan-Definitionen
  const plans = {
    basic: {
      name: 'Basic',
      price: '0',
      period: 'monatlich',
      description: 'Perfekt zum Einstieg',
      icon: <Star size={20} />,
      color: 'linear-gradient(135deg, #667eea, #764ba2)',
      features: [
        'Human Design Chart',
        'Vollständiger Mondkalender',
        'Community Zugang',
        'Basis-Matching',
        'Bis zu 3 Profilbilder'
      ]
    },
    premium: {
      name: 'Premium',
      price: '19',
      period: 'monatlich',
      description: 'Für ernsthafte Suchende',
      icon: <Crown size={20} />,
      color: 'linear-gradient(135deg, #FFD700, #FFA500)',
      features: [
        'Alle Free Features',
        'Unbegrenzte Matches',
        'Erweiterte Kompatibilitäts-Analyse',
        'Persönliche Readings',
        'Bis zu 10 Profilbilder',
        'Prioritäts-Support',
        'Exklusive Community Events'
      ]
    },
    vip: {
      name: 'VIP',
      price: '49',
      period: 'monatlich',
      description: 'Das komplette Erlebnis',
      icon: <Zap size={20} />,
      color: 'linear-gradient(135deg, #ff6b9d, #c44569)',
      features: [
        'Alle Premium Features',
        '1:1 Coaching Sessions',
        'Reiki & Energiearbeit',
        'Unbegrenzte Profilbilder',
        'VIP Community Zugang',
        'Persönlicher Concierge',
        'Früher Zugang zu neuen Features',
        'Exklusive Retreats'
      ]
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validierung
      if (!formData.name || !formData.email || !formData.password || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
        setError('Bitte füllen Sie alle Felder aus (einschließlich Geburtsdaten)');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwörter stimmen nicht überein');
        return;
      }

      if (formData.password.length < 6) {
        setError('Passwort muss mindestens 6 Zeichen lang sein');
        return;
      }

      // Echte API-Aufruf an das Backend
      const response = await fetch('http://localhost:4001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password,
          firstName: formData.name.split(' ')[0] || formData.name,
          lastName: formData.name.split(' ').slice(1).join(' ') || '',
          subscriptionPlan: selectedPlan,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Speichere Token und Benutzerdaten
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('token', data.token); // Für Kompatibilität
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userData', JSON.stringify({
          email: formData.email,
          id: data.user.id,
          username: data.user.username,
          name: data.user.name,
          subscriptionPlan: selectedPlan,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace
        }));

        // Speichere Human Design Chart-Daten (falls vorhanden)
        if (data.chart) {
          localStorage.setItem('userChart', JSON.stringify(data.chart));
          console.log('✅ Human Design Chart automatisch erstellt:', data.chart);
        }
        
        // Profileinrichtung als abgeschlossen markieren (da Chart automatisch erstellt wurde)
        localStorage.setItem('profileSetupCompleted', 'true');
        
        // Speichere auch den gewählten Plan separat
        localStorage.setItem('userSubscription', JSON.stringify({
          plan: selectedPlan,
          status: 'active',
          startDate: new Date().toISOString(),
          features: plans[selectedPlan as keyof typeof plans].features
        }));
        
        console.log('✅ Registrierung erfolgreich');
        
        // Intelligente Weiterleitung basierend auf gewähltem Plan
        const targetPath = smartRedirect();
        console.log(`🚀 Weiterleitung nach Registrierung: ${targetPath}`);
        router.push(targetPath);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Registrierung fehlgeschlagen');
      }
    } catch (err) {
      console.error('Registrierungs-Fehler:', err);
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
      <AnimatedStars />
      <AnimatedMoon size={150} position="top-right" />
      
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.1)',
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
                    background: 'linear-gradient(45deg, #8b5cf6, #a855f7)',
                    mb: 3,
                    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)'
                  }}>
                    <UserPlus size={40} color="white" />
                  </Box>
                </motion.div>
                
                <Typography variant="h4" sx={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  mb: 1,
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                  Registrieren
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  textShadow: '0 1px 4px rgba(0,0,0,0.3)'
                }}>
                  Erstellen Sie Ihren Human Design Account
                </Typography>
              </Box>

              {/* Fehler-Anzeige */}
              {error && (
                <Alert severity="error" sx={{ 
                  mb: 3,
                  background: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  color: 'white'
                }}>
                  {error}
                </Alert>
              )}

              {/* Plan-Auswahl */}
              {selectedPlan !== 'basic' && (
                <Box sx={{ mb: 4, p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, textAlign: 'center', fontWeight: 600 }}>
                    🎯 Gewählter Plan
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <Box sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: plans[selectedPlan as keyof typeof plans].color,
                      mr: 2,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                    }}>
                      {plans[selectedPlan as keyof typeof plans].icon}
                    </Box>
                    
                    <Box>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {plans[selectedPlan as keyof typeof plans].name}
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                        €{plans[selectedPlan as keyof typeof plans].price}
                        <Typography component="span" variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', ml: 1 }}>
                          /{plans[selectedPlan as keyof typeof plans].period}
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', mb: 2 }}>
                    {plans[selectedPlan as keyof typeof plans].description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {plans[selectedPlan as keyof typeof plans].features.slice(0, 3).map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,215,0,0.2)',
                          color: '#FFD700',
                          border: '1px solid rgba(255,215,0,0.3)',
                          fontSize: '0.75rem'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Registrierungs-Formular */}
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  type="text"
                  value={formData.name}
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
                        borderColor: '#8b5cf6',
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
                        borderColor: '#8b5cf6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                    }
                  }}
                  InputProps={{
                    startAdornment: <Mail size={20} style={{ marginRight: 8, color: 'rgba(255,255,255,0.7)' }} />
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
                        borderColor: '#8b5cf6',
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
                
                <TextField
                  fullWidth
                  label="Passwort bestätigen"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
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
                        borderColor: '#8b5cf6',
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

                {/* Geburtsdaten-Sektion */}
                <Box sx={{ 
                  mt: 3, 
                  mb: 3, 
                  p: 2, 
                  bgcolor: 'rgba(139, 92, 246, 0.1)', 
                  borderRadius: 2, 
                  border: '1px solid rgba(139, 92, 246, 0.3)' 
                }}>
                  <Typography variant="h6" sx={{ color: '#8b5cf6', mb: 2, textAlign: 'center' }}>
                    🌟 Geburtsdaten für Human Design Chart
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Geburtsdatum"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#8b5cf6',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255,255,255,0.7)',
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Geburtszeit"
                    name="birthTime"
                    type="time"
                    value={formData.birthTime}
                    onChange={handleInputChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#8b5cf6',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255,255,255,0.7)',
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Geburtsort"
                    name="birthPlace"
                    type="text"
                    value={formData.birthPlace}
                    onChange={handleInputChange}
                    required
                    placeholder="z.B. Berlin, Deutschland"
                    sx={{ 
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#8b5cf6',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255,255,255,0.7)',
                      }
                    }}
                  />
                  
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', textAlign: 'center' }}>
                    💡 Diese Daten werden für dein persönliches Human Design Chart verwendet
                  </Typography>
                </Box>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(45deg, #8b5cf6, #a855f7)',
                    color: 'white',
                    fontWeight: 'bold',
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    textTransform: 'none',
                    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #7c3aed, #9333ea)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(139, 92, 246, 0.4)'
                    },
                    '&:disabled': {
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.5)'
                    }
                  }}
                >
                  {loading ? 'Registrieren...' : 'Registrieren'}
                </Button>
              </form>

              {/* Info-Hinweis */}
              <Box sx={{ 
                mt: 4, 
                p: 2, 
                background: 'rgba(139, 92, 246, 0.1)', 
                borderRadius: 2,
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  textAlign: 'center',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  <strong>Registrierung:</strong> Ihre Daten werden sicher in Supabase gespeichert. 
                  Sie erhalten eine Willkommens-E-Mail nach der Registrierung.
                </Typography>
              </Box>

              {/* Link zur Login-Seite */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  Bereits registriert?{' '}
                  <Button
                    component="a"
                    href="/login"
                    sx={{
                      color: '#8b5cf6',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        color: '#a855f7',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Hier anmelden
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